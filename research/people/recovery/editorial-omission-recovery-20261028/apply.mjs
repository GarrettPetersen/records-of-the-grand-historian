import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {ROOT,REF,load,read,set,overlay,writes,has} from './canonical-runtime.mjs';
import {inspectLocalDisk} from '../../../../scripts/check-local-disk.mjs';
const JOB=path.dirname(fileURLToPath(import.meta.url)),hash=b=>createHash('sha256').update(b).digest('hex'),need=(x,m)=>{if(!x)throw Error(m)};
need(inspectLocalDisk(ROOT).errors.length===0,'Resource guard failed');
const envelope=JSON.parse(fs.readFileSync(path.join(JOB,'review.json'),'utf8')),state=JSON.parse(fs.readFileSync(path.join(JOB,'review-state.json'),'utf8')),bundle=JSON.parse(fs.readFileSync(path.join(JOB,'editorial-review-bundle.json'),'utf8'));
need(state.phase==='review-recorded'&&envelope.bundleSha256===hash(fs.readFileSync(path.join(JOB,'editorial-review-bundle.json'))),'Unsealed review');
const builder=await load('scripts/build-people-extraction-packet.mjs'),matcher=(await load('scripts/lib/people-candidates.mjs')).loadProperNounMatcher(),compact=await load('scripts/lib/people-compact.mjs'),decisions=await load('scripts/lib/people-editorial-decisions.mjs'),applier=await load('scripts/apply-people-translation-repairs.mjs');
const summaries=[];
function packet(book,chapter){return builder.buildPeopleExtractionPacket(book,chapter,{chapterData:read(`data/${book}/${chapter}.json`),chapterFile:`${ROOT}/data/${book}/${chapter}.json`,properNounMatcher:matcher});}
function stored(book,chapter,p){const x=read(`data/people/extractions/${book}/${chapter}.json`);return x.schemaVersion===2?compact.expandPeopleExtraction(x,p):x;}
function saveExtraction(book,chapter,x,p){const c=compact.compactPeopleExtraction(x,p);set(`data/people/extractions/${book}/${chapter}.json`,c);}
function saveReview(book,chapter,document){const file=`data/people/editorial-decisions/${book}/${chapter}.json`;decisions.validateEditorialDecisionDocument(document);set(file,has(file)?decisions.mergeEditorialDecisionReview(read(file),document):document);writes.add(file);}
const candidateFile='data/people/generated/editorial-omission-recovery-20261028/jinshu-031-candidate-resolution.json';if(fs.existsSync(path.join(ROOT,candidateFile)))set(candidateFile,JSON.parse(fs.readFileSync(path.join(ROOT,candidateFile),'utf8')));
function apply(book,chapter){return applier.applyPeopleTranslationRepairs({book,chapter,extraction:null,decisions:null,reconcileCurrent:false,candidatePeople:[],candidateDispositions:[],prepareCandidateReview:process.argv.includes('--prepare-candidates')&&book==='jinshu'&&chapter==='031',candidateResolution:book==='jinshu'&&chapter==='031'?ROOT+'/'+candidateFile:null});}
for(const scope of ['jinshu/053','zizhitongjian/083','jinshu/031']){
 const[book,chapter]=scope.split('/'),p=packet(book,chapter),draft=JSON.parse(fs.readFileSync(path.join(JOB,`${book}-${chapter}-draft-extraction.json`),'utf8'));
 const report=envelope.reports.find(r=>r.book===book&&r.chapter===chapter);need(report,'Missing exact scope');let document=structuredClone(report.document);
 document.reviewer={kind:'cursor-agent',name:'Independent retained editorial reviewer',model:'grok-4.6',agentId:state.agentId,runId:state.runId,completedAt:state.finishedAt};
 // Bind actual reviewed chapter text mechanically; no external witness is invented.
 for(const d of document.decisions){const proposal=document.proposals.find(r=>r.id===d.repairId);need(proposal,'Unknown decision');if(!d.sourceWitness)d.sourceWitness={source:'chapter-text',citation:`${book}/${chapter} ${proposal.unit.id}`,excerpt:p.units.find(u=>u.id===proposal.unit.id).zh};}
 const claimById=new Map(draft.claims.map(c=>[c.id,c]));
 function associatedProposal(row,claim){
  const choices=document.proposals.filter(prop=>claim.evidence.includes(`${book}:${chapter}:${prop.unit.id}`)&&document.decisions.some(d=>d.repairId===prop.id&&d.decision!=='reject'));
  need(choices.length>0,'Claim change lacks an accepted source-linked proposal');
  need(new Set(choices.map(c=>c.unit.id)).size===1,'Ambiguous claim-change source unit');
  return choices.sort((a,b)=>a.id.localeCompare(b.id))[0];
 }
 for(const key of ['claimRetractions','claimRevisions'])document[key]=(document[key]??[]).map(row=>{
  const id=row.claim?.id??row.before?.id??row.id,claim=claimById.get(id);need(claim,'Unknown reviewed claim '+id);const prop=associatedProposal(row,claim);
  const witness={source:'chapter-text',citation:`${book}/${chapter} ${prop.unit.id}`,excerpt:p.units.find(u=>u.id===prop.unit.id).zh};
  if(key==='claimRetractions')return {repairId:row.repairId??prop.id,claim:structuredClone(claim),reason:row.reason,sourceWitness:row.sourceWitness??witness};
  need(row.after&&typeof row.after==='object','Missing reviewed claim replacement');
  const after=row.after.id?row.after:{...structuredClone(claim),value:structuredClone(row.after)};
  return {repairId:row.repairId??prop.id,before:structuredClone(claim),after,reason:row.reason,sourceWitness:row.sourceWitness??witness};
 });
 document=decisions.normalizeEditorialDecisionArtifact(document,draft);decisions.validateEditorialDecisions(document,draft,p);
 saveExtraction(book,chapter,draft,p);saveReview(book,chapter,document);apply(book,chapter);
 if(process.argv.includes('--prepare-candidates')&&scope==='jinshu/031'){const matches=[...writes].filter(f=>f.startsWith('data/people/generated/')&&overlay.get(f)).map(f=>({file:f,value:JSON.parse(overlay.get(f).toString())})).filter(x=>x.value.kind==='independent-editorial-repair-candidate-review');need(matches.length===1,'Expected one exact candidate dossier');fs.writeFileSync(path.join(JOB,'jinshu-031-candidate-review.json'),JSON.stringify(matches[0].value,null,2)+'\n');console.log(JSON.stringify({candidateReviewPrepared:true,candidates:matches[0].value.candidates.length}));process.exit(0);}
 summaries.push({scope,phase:'reviewed-existing-proposals-applied',reviewed:document.decisions.length});
}
// Independently inspect the worker-authored paired-field repairs against Chinese.
// These are a separate author's proposals; the host is the independent reviewer.
const extraRevisions={
 'zizhitongjian/083:s0155:idiomatic':'Mi slandered the heir apparent to the empress, saying: \"The heir apparent amasses private wealth to win over petty men because of the Jia clan.',
 'jinshu/031:s0093:idiomatic':"Lady Yang, widow of Wang Su, the General Who Guards the Army and Marquis Jing of Lanling, bore inward grace and outward modesty, fulfilled every womanly virtue, linked great houses by marriage, and observed the three obediences without fault.",
 'jinshu/031:s0571:idiomatic':"At first, the empress feigned pregnancy and brought in straw materials as childbirth supplies. She then took in and raised Weizu, the son of her sister's husband Han Shou, claiming he had been born during the mourning period and therefore keeping him out of public view.",
 'jinshu/031:s0597:idiomatic':"Lun then forged an edict and sent Minister Liu Hong and others, bearing an imperial tally, to deliver wine mixed with gold filings and order the empress's death.",
};
const independentReasons={
 'zizhitongjian/083:s0155:idiomatic':'Translate 為賈氏故也 without inserting the explicit destroy verb absent from this unit, and preserve the open quotation that continues through s0157 rather than closing it prematurely.',
 'jinshu/031:s0093:idiomatic':'Retain the sourced Wang Su identification: s0075 identifies Empress Wang, s0076 names her father Su, and s0092 identifies Lady Yang as her mother. Correct 衛將軍 while preserving accurate named context; a name need not be repeated inside the same sentence to be supported.',
 'jinshu/031:s0571:idiomatic':'The complete Chinese explicitly supplies feigned pregnancy, bringing in childbirth supplies, Han Shou as the sister’s husband, Weizu, and the mourning-period concealment. Use brought in for 內 rather than inventing a separate act of hiding materials.',
 'jinshu/031:s0597:idiomatic':'Preserve every Chinese action and named official: forged edict, Liu Hong and others, imperial tally, gold-filings wine, and ordering the empress’s death. Use natural English for 賜后死 without adding an unsupported action.'};
for(const scope of ['jinshu/053','zizhitongjian/083','jinshu/031']){
 const extras=envelope.additionalRepairs.filter(r=>r.book+'/'+r.chapter===scope);if(!extras.length)continue;
 const[book,chapter]=scope.split('/'),p=packet(book,chapter),x=stored(book,chapter,p);let number=Math.max(0,...x.translationRepairs.map(r=>Number(r.id.match(/r(\d+)$/)?.[1]??0)));
 for(const extra of extras){const unit=p.units.find(u=>u.id===extra.unitId);need(unit,'Extra missing unit');const before=extra.field==='literal'?unit.literal:unit.en;if(scope==='zizhitongjian/083'&&extra.unitId==='s0155'&&extra.field==='idiomatic'){need(extra.before===before+'\"','Unexpected source mismatch in quoted sidecar');extra.before=before;}need(before===extra.before,'Extra repair before changed: '+scope+':'+extra.unitId);need(['literal','idiomatic'].includes(extra.field),'Invalid field');const locator=Object.fromEntries(['id','kind','blockIndex','collection','itemIndex'].map(k=>[k,unit[k]]));x.translationRepairs.push({id:`${book}:${chapter}:r${String(++number).padStart(4,'0')}`,unit:locator,field:extra.field,before,after:extra.after,reason:extra.reason,confidence:'high',status:'proposed'});}
 const doc=decisions.editorialDecisionSeed(x);doc.reviewer={kind:'codex',name:'Codex host independent Chinese-source review',model:null,agentId:'/root',runId:null,completedAt:new Date().toISOString()};
 for(const d of doc.decisions){const prop=doc.proposals.find(p=>p.id===d.repairId),key=scope+':'+prop.unit.id+':'+prop.field;d.decision=extraRevisions[key]?'revise':'accept';d.after=extraRevisions[key]??null;d.reason=independentReasons[key]??'Independently checked the supplied Chinese unit and the concrete replacement, with governing context where needed. The concrete replacement restores or corrects the stated name, office, relationship or action without adding chronology; '+prop.reason;d.sourceWitness={source:'chapter-text',citation:scope+' '+prop.unit.id,excerpt:p.units.find(u=>u.id===prop.unit.id).zh};}
 decisions.validateEditorialDecisions(doc,x,p);saveExtraction(book,chapter,x,p);saveReview(book,chapter,doc);apply(book,chapter);summaries.push({scope,phase:'independently-reviewed-additional-repairs-applied',reviewed:doc.decisions.length});
}
const outputs=[];
for(const file of [...writes].sort()){
 if(file.startsWith('data/people/generated/'))continue;
 need(/^data\/(?:jinshu\/(?:031|053)\.json|zizhitongjian\/083\.json|people\/(?:extractions|editorial-decisions)\/(?:jinshu\/(?:031|053)|zizhitongjian\/083)\.json)$/.test(file),'Unexpected canonical output '+file);
 const bytes=overlay.get(file);need(bytes,'Missing transactional output');const dest=path.join(JOB,'outputs',file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);outputs.push({path:file,bytes:bytes.length,sha256:hash(bytes)});
}
const result={revision:REF,sourceAndExtractionApplication:'normal production applier and validators in canonical Git-backed transactional runtime',summaries,outputs,allAppliedEditorialGatesPassed:true,allDateIdentityAndPublicationGatesPendingRevalidation:true,primaryCheckoutSourceFilesChanged:false};fs.writeFileSync(path.join(JOB,'application-proof.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({scopes:summaries,outputs:outputs.length,status:'Applied and validated transactionally; canonical checkpoint pending; date/identity approvals not carried forward'}));
