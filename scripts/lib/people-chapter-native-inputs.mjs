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

// Bind only reasoning already supplied by the captured independent reviewer.
// Source text, facts, replacement wording, authors and old repair history stay exact.
export function bindChapterRepairReasonMetadata(candidate,editorial,{priorRepairCount,canonicalReviewCount,actualReviewerAgentId,authorAgentIds,native}){
 need(candidate.schemaVersion===2&&Number.isSafeInteger(priorRepairCount)&&priorRepairCount>=0&&priorRepairCount<=candidate.translationRepairs.length,'Explicit compact repair boundary required');
 need(Number.isSafeInteger(canonicalReviewCount)&&canonicalReviewCount>=0&&actualReviewerAgentId&&Array.isArray(authorAgentIds)&&!authorAgentIds.includes(actualReviewerAgentId),'Actual independent repair reviewer required');
 const reviews=native.editorialReviews(editorial),copy=structuredClone(candidate),changes=[];
 need(canonicalReviewCount<=reviews.length,'Canonical review boundary exceeds history');
 for(let index=priorRepairCount;index<copy.translationRepairs.length;index++){
  const row=copy.translationRepairs[index],id=`${candidate.book}:${candidate.chapter}:r${String(index+1).padStart(4,'0')}`,matches=[];
  for(const [reviewIndex,review]of reviews.entries()){
   if(reviewIndex<canonicalReviewCount)continue;
   for(const decision of review.decisions??[]){
    if(decision.repairId!==id||!['accept','revise'].includes(decision.decision))continue;
    const proposal=review.proposals.find(p=>p.id===id);if(!proposal)continue;
    const after=decision.decision==='revise'?decision.after:proposal.after;
    if(!isDeepStrictEqual([proposal.unit.id,proposal.field,proposal.before,after,proposal.confidence],[row[0],row[1],row[2],row[3],row[5]]))continue;
    need(review.reviewer?.agentId===actualReviewerAgentId&&!authorAgentIds.includes(review.reviewer.agentId),'Uncaptured or author-supplied repair approval');
    native.validateEditorialDecisionDocument(review);
    need([proposal.reason,decision.reason].includes(row[4]),'Repair reasoning differs from both the authored proposal and actual independent decision');
    matches.push({reviewIndex,decision});
   }
  }
  need(matches.length<=1,'Duplicate accepted incoming repair approvals');
  if(matches.length&&row[4]!==matches[0].decision.reason){changes.push({repairId:id,reviewIndex:matches[0].reviewIndex,beforeReason:row[4],afterReason:matches[0].decision.reason,actualReviewerAgentId});row[4]=matches[0].decision.reason;}
 }
 return{candidate:copy,changes,semanticApprovalCreated:false};
}

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
  const {combinedEditorialBaseline,acceptedHistoricalClaims}=await native('lib/people-combined-curation-review.mjs');
  const expanded=validateCompactPeopleExtraction(raw.extraction,buildPeopleExtractionPacket(job.book,job.chapter,{chapterData:raw.source,properNounMatcher:loadProperNounMatcher()}),{strictAliasDispositions:true}).normalized;
  // An explicit host request may reconcile this one derived aggregate only.
  // The gate has already authenticated the immutable independent capture. The
  // production validator below must still prove every source/check row and count.
  let countBinding;
  if(job.coverageCountBinding){
    const requestPin=job.coverageCountBinding;
    need(path.isAbsolute(requestPin.file??''),'Absolute count-binding request required');
    const stat=fs.lstatSync(requestPin.file);
    need(stat.isFile()&&!stat.isSymbolicLink()&&isDeepStrictEqual(pin(requestPin.file),requestPin),'Count-binding request changed');
    const request=JSON.parse(fs.readFileSync(requestPin.file));
    need(job.circuitBreaker&&job.recordingRecoveryHistory?.length===2&&isDeepStrictEqual(job.recordingRecoveryHistory.map(h=>[h.stage,h.status]),[['native-wrapper-binding','recorded'],['explicit-witness-capture','recorded']])&&job.witnessCapture,'Complete captured recovery required for count binding');
    const before=raw.identity.coverage?.candidateDispositions,after=expanded.candidateDispositions.length;
    need(Number.isSafeInteger(before)&&before>=0&&Number.isSafeInteger(after)&&after>=0&&before!==after,'Count binding requires one real aggregate mismatch');
    const expected={schemaVersion:1,kind:'host-candidate-disposition-count-binding',job:job.id,
      actualReviewer:job.reviewAgentId,actualRun:job.reviewerRunId,
      breakerHash:documentHash(job.circuitBreaker),reviewRounds:job.reviewRounds,repairRounds:job.repairRounds,
      rawPins,change:{pointer:'/coverage/candidateDispositions',before,after}};
    need(isDeepStrictEqual(request,expected),'Count-binding scope, frozen inputs or derivation changed');
    countBinding={request:requestPin,change:request.change,originalIdentityHash:documentHash(raw.identity),
      derivedCountSource:'validateCompactPeopleExtraction.normalized.candidateDispositions.length',
      originalBreakerHash:request.breakerHash,reviewRounds:job.reviewRounds,repairRounds:job.repairRounds,
      recordingReceipts:job.recordingRecoveryHistory.map(h=>h.receipt),actualReviewer:job.reviewAgentId,actualRun:job.reviewerRunId,
      semanticApprovalCreated:false};
  }
  const originalEditorial=beforePins.editorial===null?null:JSON.parse(fs.readFileSync(canonical.editorial));
  const singleReview=originalEditorial===null&&raw.editorial.schemaVersion===4&&raw.editorial.reviews?.length===1;
  const editorialNative=await native('lib/people-editorial-decisions.mjs');
  const priorRepairCount=beforePins.extraction===null?0:JSON.parse(fs.readFileSync(canonical.extraction)).translationRepairs.length;
  const reasonBinding=bindChapterRepairReasonMetadata(raw.extraction,raw.editorial,{priorRepairCount,canonicalReviewCount:editorialNative.editorialReviews(originalEditorial).length,actualReviewerAgentId:job.reviewAgentId,authorAgentIds:job.authors,native:editorialNative});
  need(!countBinding||reasonBinding.changes.length===0,'Count binding cannot change the frozen extraction');
  const boundCandidateBytes=reasonBinding.changes.length?json(reasonBinding.candidate):rawBytes.extraction;
  const boundExpanded=reasonBinding.changes.length?validateCompactPeopleExtraction(reasonBinding.candidate,buildPeopleExtractionPacket(job.book,job.chapter,{chapterData:raw.source,properNounMatcher:loadProperNounMatcher()}),{strictAliasDispositions:true}).normalized:expanded;
  const acceptedClaims=originalEditorial===null?null:acceptedHistoricalClaims(job.book,job.chapter,JSON.parse(fs.readFileSync(canonical.source)),beforePins.extraction===null?null:JSON.parse(fs.readFileSync(canonical.extraction)));
  const baseline=combinedEditorialBaseline(originalEditorial,boundExpanded,priorRepairCount,acceptedClaims),amendment=baseline.amendment;
  const oldReviews=editorialNative.editorialReviews(originalEditorial),currentReviews=editorialNative.editorialReviews(raw.editorial);
  need(isDeepStrictEqual(currentReviews.slice(0,oldReviews.length),oldReviews),'Captured canonical editorial history changed');
  let editorial=singleReview?{schemaVersion:3,book:job.book,chapter:job.chapter,...raw.editorial.reviews[0]}:raw.editorial;
  if(amendment){
    const reviews=[...editorialNative.editorialReviews(baseline.editorial),...currentReviews.slice(oldReviews.length)];
    editorial=reviews.length===1?reviews[0]:{schemaVersion:4,book:job.book,chapter:job.chapter,reviews:reviews.map(({schemaVersion,book,chapter,...record})=>record)};
  }
  const binding={kind:'host-native-input-metadata-binding',hostAuthor,rawPins,beforePins,editorialAmendment:amendment,singleReviewWrapperNormalized:singleReview,reviewedRepairReasonBinding:reasonBinding.changes,...(countBinding?{coverageCountBinding:countBinding}:{}),semanticApprovalCreated:false};
  const suffix=documentHash(binding).slice(7,23),out=path.join(dir,'native-bound-'+suffix),materializedDir=path.join(out,'materialized'),reviewDir=path.join(out,'review');
  const targets={source:path.join(materializedDir,'data',job.book,job.chapter+'.json'),extraction:path.join(materializedDir,'candidate.json'),editorial:path.join(materializedDir,'editorial-decisions.json'),materialization:path.join(materializedDir,'validation.json'),identity:path.join(reviewDir,'identity-review.json'),dateReport:path.join(reviewDir,'date-report.json'),validation:path.join(reviewDir,'validation.json'),seal:path.join(reviewDir,'input-seal.json')};
  const docs=structuredClone(raw);docs.editorial=editorial;docs.extraction=reasonBinding.candidate;
  if(countBinding)docs.identity.coverage.candidateDispositions=countBinding.change.after;
  if(reasonBinding.changes.length){
    const extractionHash=documentHash(docs.extraction),candidateByteHash=hash(boundCandidateBytes);
    for(const role of ['identity','dateReport','validation','seal','materialization']){
      need(docs[role].extractionHash===raw.identity.extractionHash,'Unexpected captured extraction hash before reason binding');docs[role].extractionHash=extractionHash;
      for(const context of [docs[role],docs[role].reviewContext].filter(Boolean))if(context.candidateByteHash!==undefined){need(context.candidateByteHash===rawPins.extraction.sha256,'Conflicting candidate metadata before reason binding');context.candidateByteHash=candidateByteHash;}
    }
    docs.materialization.extractionByteHash=candidateByteHash;
  }
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
  // Reuse the complete, unchanged native review validator. This also rejects
  // missing/duplicate/extra rows, other stale counts and semantic differences.
  let countReceiptPin;
  if(countBinding){
    const {validateCombinedReviews}=await native('lib/people-combined-curation-review.mjs');
    const checked=validateCombinedReviews({book:job.book,chapter:job.chapter,...docs,candidate:docs.extraction,
      beforeSource:JSON.parse(fs.readFileSync(canonical.source)),
      beforeExtraction:beforePins.extraction===null?null:JSON.parse(fs.readFileSync(canonical.extraction)),
      beforeEditorial:originalEditorial,authorAgentIds:job.authors},{dataDir:path.join(root,'data')});
    const receiptFile=path.join(out,'coverage-count-binding.json');
    const receipt={schemaVersion:1,kind:'derived-native-candidate-disposition-count-binding',hostAuthor,...countBinding,
      rawPins,derivedIdentityHash:documentHash(docs.identity),derivedValidationHash:documentHash(docs.validation),
      nativeValidation:{method:'validateCombinedReviews',stats:checked.stats,validatorsUnchanged:job.nativeSeals}};
    immutableWrite(receiptFile,json(receipt));countReceiptPin=pin(receiptFile);
    need(isDeepStrictEqual(pin(countBinding.request.file),countBinding.request),'Count-binding request changed during validation');
  }
  const outputBytes=Object.fromEntries(Object.entries(docs).map(([role,value])=>[role,role==='extraction'?boundCandidateBytes:role==='source'||(role==='editorial'&&!amendment&&!singleReview)?rawBytes[role]:json(value)]));
  const rolePins=['source','extraction','editorial','materialization'].map(role=>({file:targets[role],sha256:hash(outputBytes[role]),bytes:outputBytes[role].length}));
  const protectedPins=new Map();
  for(const p of [...originalProtected,...Object.values(beforePins).filter(Boolean),...rolePins,...Object.values(rawPins),...(countReceiptPin?[countReceiptPin,countBinding.request]:[])]){const old=protectedPins.get(p.file);need(!old||isDeepStrictEqual(old,p),'Conflicting host protection pins');protectedPins.set(p.file,p);}
  docs.seal.protectedFiles=[...protectedPins.values()];
  outputBytes.seal=json(docs.seal);
  for(const role of Object.keys(docs))immutableWrite(targets[role],outputBytes[role]);
  immutableWrite(path.join(out,'host-binding.json'),json({...binding,targets,addedMetadata:metadata,outputs:Object.fromEntries(Object.entries(targets).map(([role,file])=>[role,pin(file)]))}));
  for(const[role,file]of Object.entries(files))need(isDeepStrictEqual(pin(file),rawPins[role]),'Original capture changed during preparation');
  for(const[role,file]of Object.entries(canonical))need(beforePins[role]===null?!fs.existsSync(file):isDeepStrictEqual(pin(file),beforePins[role]),'Original canonical input changed during preparation');
  return{materializedDir,reviewDir,bindingReceipt:path.join(out,'host-binding.json'),originalReportsUnchanged:true,...(countReceiptPin?{coverageCountBinding:countReceiptPin}:{}),approvalGranted:false};
}
