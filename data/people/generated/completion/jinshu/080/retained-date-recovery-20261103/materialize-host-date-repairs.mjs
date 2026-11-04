import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {buildDateAuditPacket,unresolvedDateAuditItems} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import {applyDateRepairProposal,dateRepairDifference,dateRepairJobs,retainedDateReviewJobs,assembleDateReview} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-workflow.mjs';
import {normalizeExtractionDateHints} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-hints.mjs';
import {buildPeopleExtractionPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
import {loadProperNounMatcher} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import {editorialDecisionPath,validateAppliedEditorialDecisions} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
import {mutateRemotePeopleWorkLedger,dateExecutorIsBusy} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-work-queue.mjs';

// Host-authored proposal artifacts only. The existing production CLI applies
// these through its normal validators and requires a fresh independent re-audit.
const root='/Users/garrettpetersen/records-of-the-grand-historian',a=path.dirname(fileURLToPath(import.meta.url)),w=root+'/data/people/generated/date-workflow/jinshu/080';
const read=f=>JSON.parse(fs.readFileSync(f)),same=(x,y)=>JSON.stringify(x)===JSON.stringify(y),need=(v,m)=>{if(!v)throw Error(m);},sha=b=>createHash('sha256').update(b).digest('hex');
const apply=process.argv[2]==='--apply';need(process.argv.length===(apply?3:2),'Preview without arguments, then --apply the exact preview');
need(!inspectLocalDisk(root).errors.length,'Resource guard rejected host preparation');
const stateBytes=fs.readFileSync(w+'/state.json'),state=JSON.parse(stateBytes);
need(state.phase==='repair'&&state.round===2&&state.review==='review-2.json'&&!state.circuitBreaker&&!state.repairIndex&&!state.repairCandidate,'Preserve another phase, partial repair or circuit');
for(const [key,j] of Object.entries(state.jobs))if(key.startsWith('repair-2-'))need(!j.agentId&&!j.runId&&!j.artifactHash&&!j.researchSupplementHash,'A repair worker already owns '+key);
const before=read(w+'/'+state.candidate),packet=buildDateAuditPacket('jinshu','080',{extraction:before}),baseline=buildDateAuditPacket('jinshu','080');
need(baseline.sourceHash===state.sourceHash&&baseline.extractionHash===state.extractionHash,'Canonical source/extraction changed');
const ownership=retainedDateReviewJobs(packet,{...structuredClone(state),phase:'reaudit'},{});
need(ownership.jobs.length===16,'Unexpected complete review ownership');
const results=ownership.jobs.map(j=>read(w+'/reaudit-2-'+j.id+'.json')),report=read(w+'/review-2.json');
const rebuilt=assembleDateReview(packet,ownership.jobs,results);rebuilt.reviewedAt=report.reviewedAt;
need(same(rebuilt,report)&&report.status==='needs-revision','Exact complete native negative review required');
const proposalFile=a+'/pending-reaudit2-repairs-v7-proposal.json',proposal=read(proposalFile),validation=read(a+'/pending-reaudit2-repairs-v7-production-validation.json');
need(proposal.author?.agentId==='/root'&&validation.proposalSha256===sha(fs.readFileSync(proposalFile))&&validation.productionValidationPassed&&validation.appliedEditorialValidationPassed,'Current host proposal validation required');
const plan=dateRepairJobs(report,packet,before,{maxBytes:56*1024});need(same(plan,state.repairPlan),'Retained native repair plan changed');
const peopleByItem=new Map(packet.items.map(i=>[i.id,i.personId]));
const owners=plan.map(j=>new Set(j.findings.flatMap(f=>f.items.map(id=>peopleByItem.get(id)??(id.startsWith('p')?id:null))).filter(Boolean)));
const changes=plan.map(()=>[]);
for(const c of proposal.changes){const person=c.kind==='hints'?c.personId:c.kind==='add'?c.after[0]:c.before[0];const matches=owners.flatMap((set,i)=>set.has(person)?[i]:[]);need(matches.length===1,'Ambiguous or unowned host repair for '+person);changes[matches[0]].push(c);}
need(changes.every(c=>c.length)&&changes.flat().length===proposal.changes.length,'Every native repair group requires its exact host changes');
const extractionPacket=buildPeopleExtractionPacket('jinshu','080',{properNounMatcher:loadProperNounMatcher()}),editorial=read(editorialDecisionPath('jinshu','080'));
const validate=c=>{const v=validateCompactPeopleExtraction(c,extractionPacket);validateAppliedEditorialDecisions(editorial,v.normalized);};
const prepared=[];let candidate=before;
for(let i=0;i<plan.length;i++){
 const active=buildDateAuditPacket('jinshu','080',{extraction:candidate});
 const scoped=changes[i].map(c=>{const out=structuredClone(c);if(c.kind==='replace'){const matches=candidate.claims.flatMap((row,n)=>same(row,c.before)?[n]:[]);need(matches.length===1,'Ambiguous before claim '+c.id);out.id='claim-'+(matches[0]+1);}return out;});
 const p={sourceHash:active.sourceHash,extractionHash:active.extractionHash,author:proposal.author,changes:scoped};
 const key='repair-2-'+plan[i].id+'-'+active.extractionHash.slice(7,19),bytes=Buffer.from(JSON.stringify(p,null,2)+'\n');
 candidate=normalizeExtractionDateHints(applyDateRepairProposal(candidate,p,active)).candidate;validate(candidate);
 prepared.push({key,sha256:sha(bytes),bytes,proposal:p,changes:scoped.length,inputExtractionHash:active.extractionHash,outputExtractionHash:buildDateAuditPacket('jinshu','080',{extraction:candidate}).extractionHash});
}
const direct=normalizeExtractionDateHints(applyDateRepairProposal(before,proposal,packet)).candidate;
need(same(candidate,direct),'Native job partition changed host repair meaning');
const original=read(root+'/data/people/extractions/jinshu/080.json'),final=applyDateRepairProposal(original,dateRepairDifference(original,candidate,baseline),baseline);validate(final);
const projected=buildDateAuditPacket('jinshu','080',{extraction:final});need(projected.extractionHash===validation.projectedExtractionHash&&!unresolvedDateAuditItems(projected).length,'Projected result differs from validated complete proposal');
const manifest={at:new Date().toISOString(),kind:'host-authored-native-repair-artifact-preparation',sourceHash:state.sourceHash,originalExtractionHash:state.extractionHash,reviewedCandidateHash:packet.extractionHash,negativeReviewSha256:sha(fs.readFileSync(w+'/review-2.json')),cachedReviewRanges:16,negativeFindings:report.findings.length,hostAuthor:'/root',globalProposalSha256:validation.proposalSha256,nativePlanByteCeiling:56*1024,groups:prepared.map(({bytes,proposal,...rest})=>rest),allIntermediateProductionAndEditorialChecksPassed:true,allGlobalChangesAssignedExactlyOnce:true,projectedExtractionHash:projected.extractionHash,canonicalWrites:0,modelTurns:0,independentApproval:false,chapterApproved:false};
const preview=a+'/host-native-repair-artifact-preview.json';
if(!apply){
 for(const p of prepared)fs.writeFileSync(a+'/host-'+p.key+'.json',p.bytes,{flag:'wx'});
 fs.writeFileSync(preview,JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
}else{
 const saved=read(preview);need(saved.globalProposalSha256===manifest.globalProposalSha256&&same(saved.groups,manifest.groups)&&saved.negativeReviewSha256===manifest.negativeReviewSha256,'Saved host preview differs');
 for(const p of prepared)need(sha(fs.readFileSync(a+'/host-'+p.key+'.json'))===p.sha256&&!fs.existsSync(w+'/'+p.key+'.json'),'Conflicting or changed proposal artifact');
 need(fs.readFileSync(w+'/state.json').equals(stateBytes),'Workflow changed before materialization');
 const token='host-repair-materialization-'+randomUUID();let reserved=false,checkpoint;
 const metadata=p=>({host:'/root',proposalSha256:p.sha256,sourceProposalSha256:manifest.globalProposalSha256,sourceNegativeReviewSha256:manifest.negativeReviewSha256,at:new Date().toISOString(),modelTurns:0,chapterApproved:false});
 try{
  checkpoint=mutateRemotePeopleWorkLedger(ledger=>{const c=ledger.dateAudits?.['jinshu/080'];need(c?.worker==='jinshu-release-dates-cursor-sdk'&&c.sourceHash===state.sourceHash&&c.extractionHash===state.extractionHash&&!c.executorToken&&!dateExecutorIsBusy(c),'Shared claim is not idle and owned');for(const p of prepared){const old=c.jobs[p.key]??{};need(!old.agentId&&!old.runId&&!old.artifactHash,'Shared repair worker already started');c.jobs[p.key]={...old,proposalAuthorId:'/root',hostPrepared:metadata(p)};}c.executorToken=token;c.executorHost=os.hostname();c.executorExpiresAt=new Date(Date.now()+120000).toISOString();},{message:'Reserve exact host-authored Jinshu080 repair artifacts'});reserved=true;
  need(fs.readFileSync(w+'/state.json').equals(stateBytes),'Workflow changed during host reservation');
  const current=buildDateAuditPacket('jinshu','080');need(current.sourceHash===baseline.sourceHash&&current.extractionHash===baseline.extractionHash,'Canonical inputs changed during preparation');
  for(const p of prepared)fs.writeFileSync(w+'/'+p.key+'.json',p.bytes,{flag:'wx'});
  fs.writeFileSync(a+'/host-native-repair-artifacts-materialized.json',JSON.stringify({...manifest,at:new Date().toISOString(),queuePreparationCommit:checkpoint.commit,nativeProposalFiles:prepared.map(p=>w+'/'+p.key+'.json'),nativeApplicationCompleted:false},null,2)+'\n',{flag:'wx'});
 }finally{
  if(reserved)mutateRemotePeopleWorkLedger(ledger=>{const c=ledger.dateAudits?.['jinshu/080'];need(c?.executorToken===token,'Host reservation ownership changed');delete c.executorToken;delete c.executorHost;delete c.executorExpiresAt;},{message:'Release completed host repair artifact preparation'});
 }
}
need(!inspectLocalDisk(root).errors.length,'Guard failed after preparation; stop dispatch');
console.log(JSON.stringify({mode:apply?'materialized-native-inputs':'preview',groups:prepared.length,changes:proposal.changes.length,projectedExtractionHash:projected.extractionHash,canonicalWrites:0,modelTurns:0,independentApproval:false}));
