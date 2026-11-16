import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {pathToFileURL} from 'node:url';

const hash=bytes=>'sha256:'+createHash('sha256').update(bytes).digest('hex');
const json=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
const documentHash=value=>hash(JSON.stringify(value));
const need=(ok,message)=>{if(!ok)throw Error(message);};
const pin=file=>{const b=fs.readFileSync(file);return{file,sha256:hash(b),bytes:b.length};};
const immutableWrite=(file,bytes)=>{fs.mkdirSync(path.dirname(file),{recursive:true});if(fs.existsSync(file))need(fs.readFileSync(file).equals(bytes),'Prepared native input changed: '+file);else fs.writeFileSync(file,bytes,{flag:'wx',mode:0o600});};

// Bind already-captured approvals to the native publisher's physical paths.
// Original reports stay immutable. Every added field is host metadata; no check,
// verdict, reason, reviewer declaration or approval boolean is manufactured.
export async function prepareChapterNativeInputs({root,dir,job,hostAuthor}) {
  need(path.isAbsolute(root)&&path.isAbsolute(dir)&&dir.startsWith(root+path.sep),'Invalid shared chapter artifact directory');
  need(typeof hostAuthor==='string'&&hostAuthor.trim()===hostAuthor&&hostAuthor.startsWith('codex:'),'Declare actual binding host');
  const names={source:'source',extraction:'extraction',editorial:'editorial',materialization:'materialization',identity:'identity-review',dateReport:'date-report',validation:'review-validation',seal:'input-seal'};
  const files=Object.fromEntries(Object.entries(names).map(([role,name])=>[role,path.join(dir,name+'.json')]));
  const rawBytes=Object.fromEntries(Object.entries(files).map(([role,file])=>[role,fs.readFileSync(file)]));
  const rawPins=Object.fromEntries(Object.entries(files).map(([role,file])=>[role,{file,sha256:hash(rawBytes[role]),bytes:rawBytes[role].length}]));
  const raw=Object.fromEntries(Object.entries(rawBytes).map(([role,bytes])=>[role,JSON.parse(bytes)]));
  for(const role of ['identity','dateReport','seal'])need(raw[role].reviewer?.agentId===job.reviewAgentId,'Captured reviewer identity mismatch');
  need(raw.identity.approved===true&&raw.identity.status==='approved'&&raw.dateReport.status==='audited','Independent approval has not returned');
  need(raw.validation.identityReviewHash===documentHash(raw.identity)&&raw.validation.dateReportHash===documentHash(raw.dateReport),'Captured report hashes changed');
  for(const report of [raw.identity,raw.dateReport,raw.validation,raw.seal,raw.materialization])need(report.sourceHash===raw.identity.sourceHash&&report.extractionHash===raw.identity.extractionHash,'Captured input generations disagree');
  need(raw.materialization.sourceByteHash===rawPins.source.sha256&&raw.materialization.extractionByteHash===rawPins.extraction.sha256,'Captured materialization bytes changed');
  for(const report of [raw.identity,raw.dateReport])need(report.reviewContext?.sourceByteHash===rawPins.source.sha256&&report.reviewContext?.candidateByteHash===rawPins.extraction.sha256,'Captured report bytes changed');
  const originalProtected=raw.seal.protectedFiles.map(p=>{need(path.isAbsolute(p.file),'Normalize original protected locators explicitly before binding');need(isDeepStrictEqual(pin(p.file),p),'Original protected input changed');return p;});
  for(const role of ['source','extraction','editorial'])need(originalProtected.some(p=>p.file===files[role]&&p.sha256===rawPins[role].sha256),'Missing captured draft protection: '+role);
  const canonical=Object.fromEntries(['source','extraction','editorial'].map(role=>[role,path.join(root,role==='source'?`data/${job.book}/${job.chapter}.json`:`data/people/${role==='extraction'?'extractions':'editorial-decisions'}/${job.book}/${job.chapter}.json`)]));
  const beforePins=Object.fromEntries(Object.entries(canonical).map(([role,file])=>[role,fs.existsSync(file)?pin(file):null]));
  need(beforePins.source!==null,'Original canonical source is required');
  for(const role of Object.keys(canonical))need((beforePins[role]?.sha256??null)===job.beforeNative?.[role+'ByteHash'],'Original canonical '+role+' drift');
  if(beforePins.extraction===null)need(job.canonicalExtractionAbsent===true&&beforePins.editorial===null,'Missing canonical extraction requires explicit first-install ownership');
  const native=f=>import(pathToFileURL(path.join(job.nativeRoot,'scripts',f)));
  const {buildPeopleExtractionPacket}=await native('build-people-extraction-packet.mjs');
  const {validateCompactPeopleExtraction}=await native('validate-people-extraction.mjs');
  const {loadProperNounMatcher}=await native('lib/people-candidates.mjs');
  const {deriveDateRepairEditorialAmendment,applyDateRepairEditorialAmendment}=await native('lib/people-date-workflow.mjs');
  const expanded=validateCompactPeopleExtraction(raw.extraction,buildPeopleExtractionPacket(job.book,job.chapter,{chapterData:raw.source,properNounMatcher:loadProperNounMatcher()}),{strictAliasDispositions:true}).normalized;
  const originalEditorial=beforePins.editorial===null?null:JSON.parse(fs.readFileSync(canonical.editorial));
  const amendment=originalEditorial===null?null:deriveDateRepairEditorialAmendment(originalEditorial,expanded);
  const singleReview=originalEditorial===null&&raw.editorial.schemaVersion===4&&raw.editorial.reviews?.length===1;
  const editorial=amendment?applyDateRepairEditorialAmendment(originalEditorial,amendment,expanded):singleReview?{schemaVersion:3,book:job.book,chapter:job.chapter,...raw.editorial.reviews[0]}:raw.editorial;
  if(amendment)need(isDeepStrictEqual(raw.editorial,originalEditorial),'Chronology amendment requires exact captured old editorial history');
  const binding={kind:'host-native-input-metadata-binding',hostAuthor,rawPins,beforePins,editorialAmendment:amendment,singleReviewWrapperNormalized:singleReview,semanticApprovalCreated:false};
  const suffix=documentHash(binding).slice(7,23),out=path.join(dir,'native-bound-'+suffix),materializedDir=path.join(out,'materialized'),reviewDir=path.join(out,'review');
  const targets={source:path.join(materializedDir,'data',job.book,job.chapter+'.json'),extraction:path.join(materializedDir,'candidate.json'),editorial:path.join(materializedDir,'editorial-decisions.json'),materialization:path.join(materializedDir,'validation.json'),identity:path.join(reviewDir,'identity-review.json'),dateReport:path.join(reviewDir,'date-report.json'),validation:path.join(reviewDir,'validation.json'),seal:path.join(reviewDir,'input-seal.json')};
  const docs=structuredClone(raw);docs.editorial=editorial;
  const metadata={hostAuthor,receipt:path.join(out,'host-binding.json'),originalReportHashes:Object.fromEntries(['identity','dateReport','validation','seal'].map(role=>[role,rawPins[role].sha256]))};
  for(const role of ['identity','dateReport']){
    const context=docs[role].reviewContext;
    for(const[key,target,original]of [['sourcePath',targets.source,files.source],['candidatePath',targets.extraction,files.extraction]]){
      need(context[key]===undefined||[target,original].includes(context[key]),'Conflicting captured '+key);context[key]=target;
    }
    docs[role].hostInputBinding=metadata;
  }
  if(amendment){docs.materialization.editorialAmendment=amendment;for(const context of [docs.identity.reviewContext,docs.dateReport.reviewContext,docs.validation,docs.seal]){need(context.editorialAmendmentHash===undefined,'Existing chronology amendment must be reconciled');context.editorialAmendmentHash=documentHash(amendment);}}
  docs.materialization.hostInputBinding=metadata;
  docs.validation.identityReviewHash=documentHash(docs.identity);docs.validation.dateReportHash=documentHash(docs.dateReport);
  docs.validation.hostInputBinding=metadata;docs.seal.hostInputBinding=metadata;
  if(docs.seal.identityReviewHash!==undefined)docs.seal.identityReviewHash=documentHash(docs.identity);
  if(docs.seal.dateReportHash!==undefined)docs.seal.dateReportHash=documentHash(docs.dateReport);
  const outputBytes=Object.fromEntries(Object.entries(docs).map(([role,value])=>[role,['source','extraction'].includes(role)||(role==='editorial'&&!amendment&&!singleReview)?rawBytes[role]:json(value)]));
  const rolePins=['source','extraction','editorial','materialization'].map(role=>({file:targets[role],sha256:hash(outputBytes[role]),bytes:outputBytes[role].length}));
  const protectedPins=new Map();
  for(const p of [...originalProtected,...Object.values(beforePins).filter(Boolean),...rolePins,...Object.values(rawPins)]){const old=protectedPins.get(p.file);need(!old||isDeepStrictEqual(old,p),'Conflicting host protection pins');protectedPins.set(p.file,p);}
  docs.seal.protectedFiles=[...protectedPins.values()];
  outputBytes.seal=json(docs.seal);
  for(const role of Object.keys(docs))immutableWrite(targets[role],outputBytes[role]);
  immutableWrite(path.join(out,'host-binding.json'),json({...binding,targets,addedMetadata:metadata,outputs:Object.fromEntries(Object.entries(targets).map(([role,file])=>[role,pin(file)]))}));
  for(const[role,file]of Object.entries(files))need(isDeepStrictEqual(pin(file),rawPins[role]),'Original capture changed during preparation');
  for(const[role,file]of Object.entries(canonical))need(beforePins[role]===null?!fs.existsSync(file):isDeepStrictEqual(pin(file),beforePins[role]),'Original canonical input changed during preparation');
  return{materializedDir,reviewDir,bindingReceipt:path.join(out,'host-binding.json'),originalReportsUnchanged:true,approvalGranted:false};
}
