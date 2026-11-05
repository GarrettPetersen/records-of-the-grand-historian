import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {buildDateAuditPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import {mutateRemotePeopleWorkLedger} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-work-queue.mjs';
import {observeProvider} from '../../../093/bounded-independent-parts-eb9a-20261105/provider-observation.mjs';
import {acquireProcessRunLock} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/process-run-lock.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('.',import.meta.url).pathname;
const read=p=>JSON.parse(fs.readFileSync(p)),need=(v,m)=>{if(!v)throw Error(m)},hash=b=>createHash('sha256').update(b).digest('hex'),write=(p,v)=>{fs.writeFileSync(p+'.tmp',JSON.stringify(v,null,2)+'\n');fs.renameSync(p+'.tmp',p)};
const releaseWriter=acquireProcessRunLock(dir+'English-review-control.lock',{label:'Single writer for English review state',failIfExists:true});
try{
const [action,number,id]=process.argv.slice(2),s=read(dir+'controller.json'),m=read(dir+'english-full-source-review-manifest.json'),n=Number(number),part=m.parts[n-1],full=read(dir+'complete-native-review-repair-handoff.json'),native=read(root+'/data/people/generated/date-workflow/jinshu/109/state.json');
need(!inspectLocalDisk(root).errors.length,'Resource guard hold');
need(part && Number.isInteger(n) && s.completeReports===13 && native.phase==='repair' && native.round===1 && native.reviewRoundCeiling===3,'Exact source-review part/native repair boundary required');
const current=buildDateAuditPacket('jinshu','109',{dataDir:root+'/data',peopleDir:root+'/data/people'});
need(current.sourceHash===s.sourceHash && current.extractionHash===s.canonicalExtractionHash && hash(fs.readFileSync(root+'/data/jinshu/109.json'))===m.sourceByteSha256,'Frozen source changed');
need(hash(fs.readFileSync(full.reportFile))===full.reportSha256 && hash(fs.readFileSync(part.file))===part.sha256,'Sealed review inputs changed');
const packet=read(part.file),key='supplemental-editorial-'+part.sha256.slice(0,20);
const commit=(message,mutate)=>mutateRemotePeopleWorkLedger(l=>{
 const c=l.dateAudits['jinshu/109'];
 need(c?.worker===s.worker && c.generationId===s.generationId && c.executorToken===s.executorToken && c.sourceHash===s.sourceHash && c.extractionHash===s.canonicalExtractionHash,'Shared source/date owner changed');
 mutate(c);c.executorExpiresAt=new Date(Date.now()+s.executorLeaseMs).toISOString();
},{message});
if(action==='claim'){
 need(part.phase==='prepared','Retain existing source reviewer');
 if(!m.startedAt){m.startedAt=new Date().toISOString();m.deadlineAt=new Date(Date.now()+20*60000).toISOString();}
 need(Date.now()<Date.parse(m.deadlineAt),'Source-review admission window closed');
 const actual=observeProvider(r=>r.id===id);
 const retainedCross=part.kind==='amendment-cross-review'&&id===part.reviewerAgentId&&m.parts.some(p=>p.index===part.retainedContextPart&&p.phase==='report-recorded'&&p.agentId===id&&p.runId===actual.lastMessageId&&actual.lastMessageId===actual.newestEntryId);
 need((retainedCross||/^tbs[0-9]+$/u.test(actual.lastMessageId??''))&&!packet.proposalAuthors.includes(id)&&!s.parts.some(p=>p.agentId===id),'Fresh independent source reviewer or exact idle independent cross-review context required');
 const prompt=`Independently review the attached Jinshu109 English correction packet ${n}/${m.parts.length}. Verify attachment SHA256 ${part.sha256}. Actual reviewer agentId ${id}. You did not author these proposals. Review all ${part.repairs} proposalIds against exact Chinese, both English fields, neighboring context, named roles, quantities and repeated uses. Amend any wrong proposal with a COMPLETE replacement; preserve all source propositions. Save english-full-source-part${String(n).padStart(3,'0')}.result.json and return a DIRECT downloadable attachment. Output schema: {schemaVersion:1,packetSha256:"${part.sha256}",reviewer:{name:"Grok Bot",agentId:"${id}",independentOfAuthors:true},verdict:"approve"|"needs-revision",repairs:[{proposalId,book,chapter,unitId,field,before,after,sourceQuote,pairedFieldChecked,verdict:"approve"|"amend"|"reject",reason}]}. Include EVERY proposalId exactly once. Copy before/sourceQuote/target exactly from the packet. pairedFieldChecked must be the CURRENT OTHER English field copied verbatim from context. With approve, after must match the proposed after exactly; with amend, give your complete corrected text and a Chinese-source reason of at least20characters. Top approve requires every row approve/amend. Report any additional definite defect with complete before/after for both fields in a SEPARATE supplemental artifact. No chapter/date/publication approval. Shared host checkout, assigned artifact only; no checkout/git/build/delegation/paid calls.`;
 need(part.bytes+Buffer.byteLength(prompt)<=65536,'Complete source-review packet/prompt exceeds ceiling');
 fs.writeFileSync(dir+`english-full-source-part${String(n).padStart(3,'0')}-prompt.txt`,prompt+'\n',{flag:'wx'});
 const q=commit('Reserve independent review of retained109 paired-English corrections',c=>{
  need(!c.jobs[key]&&Object.values(c.jobs).filter(j=>['claimed','running'].includes(j.status)).length<2,'Shared model pool occupied');
  c.jobs[key]={kind:'supplemental-editorial-review',status:'claimed',agentId:id,runId:null,inputFile:part.file,inputSha256:part.sha256};
  c.candidateStage={...c.candidateStage,phase:'repair',completeReports:13,totalReports:13,dateFindings:55,fullNativeReport:full.reportFile,supplementalEditorialReview:{parts:m.parts.length,deadlineAt:m.deadlineAt}};
 });
 Object.assign(part,{phase:'claimed',agentId:id,priorRunId:actual.lastMessageId,jobKey:key});s.queueCommit=q.commit;
}else if(action==='running'){
 need(part.phase==='claimed'&&part.agentId===id,'Exact claimed reviewer required');
 const q=commit('Record actual running109 independent English correction reviewer',c=>{need(c.jobs[key]?.agentId===id,'Reviewer ownership changed');c.jobs[key].status='running';});
 Object.assign(part,{phase:'running',workingIndicatorObserved:true,startedAt:new Date().toISOString()});s.queueCommit=q.commit;
}else if(action==='capture'){
 need(part.phase==='running'&&part.agentId===id,'Exact running reviewer required');
 const file=dir+`english-full-source-part${String(n).padStart(3,'0')}-provider.raw.json`,bytes=fs.readFileSync(file),review=JSON.parse(bytes),actual=observeProvider(r=>r.id===id);
 need(review.schemaVersion===1&&review.packetSha256===part.sha256&&review.reviewer?.agentId===id&&review.reviewer.independentOfAuthors===true&&!packet.proposalAuthors.includes(id),'Independent exact-packet source review required');
 need(actual.lastMessageId===actual.newestEntryId&&typeof actual.lastMessageId==='string'&&!/^tbs/u.test(actual.lastMessageId),'Actual completed provider response required');
 need(Array.isArray(review.repairs)&&review.repairs.length===packet.repairs.length,'Complete source-correction review required');
 const seen=new Set();
 for(const row of review.repairs){
  const p=packet.repairs.find(p=>p.proposalId===row.proposalId);need(p&&!seen.has(p.proposalId),'Unknown/duplicate proposal');seen.add(p.proposalId);
  for(const field of ['book','chapter','unitId','field','before','sourceQuote'])need(row[field]===p[field],'Review target differs: '+field);
  const u=packet.context.find(u=>u.id===p.unitId);need(u&&u.zh.includes(p.sourceQuote)&&row.pairedFieldChecked===u[p.field==='literal'?'idiomatic':'literal'],'Exact Chinese/paired field required');
  need(['approve','amend','reject'].includes(row.verdict)&&typeof row.reason==='string'&&row.reason.trim().length>=20,'Substantive independent decision required');
  need(typeof row.after==='string'&&row.after.length>=20&&(row.verdict!=='approve'||row.after===p.after),'Complete exact approved/amended replacement required');
 }
 need(review.verdict===(review.repairs.every(r=>r.verdict!=='reject')?'approve':'needs-revision'),'Top source-review verdict contradicts rows');
 const q=commit('Retain complete independent109 English correction review without source publication',c=>{need(c.jobs[key]?.agentId===id,'Shared reviewer changed');Object.assign(c.jobs[key],{status:'returned',runId:actual.lastMessageId,resultFile:file,resultSha256:hash(bytes),verdict:review.verdict});});
 Object.assign(part,{phase:'report-recorded',rawFile:file,reportSha256:hash(bytes),runId:actual.lastMessageId,verdict:review.verdict,amended:review.repairs.filter(r=>r.verdict==='amend').length,completedAt:new Date().toISOString()});s.queueCommit=q.commit;
}else throw Error('Use claim/running/capture PART ACTUAL_ID');
m.completeReports=m.parts.filter(p=>p.phase==='report-recorded').length;
s.stage='native-repair-with-independent-English-review';s.supplementalEditorialReview={manifest:dir+'english-full-source-review-manifest.json',completeReports:m.completeReports,totalReports:m.parts.length,deadlineAt:m.deadlineAt};
write(dir+'english-full-source-review-manifest.json',m);write(dir+'controller.json',s);
console.log(JSON.stringify({action,part:n,editorialReports:m.completeReports,totalEditorialReports:m.parts.length,nativeDatePhase:'repair',dateApproval:false,canonicalWrites:0}));
}finally{releaseWriter();}
