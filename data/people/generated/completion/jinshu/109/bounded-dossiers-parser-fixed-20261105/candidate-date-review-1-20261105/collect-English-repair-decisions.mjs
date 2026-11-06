import fs from 'node:fs';
import {decodeEnglishRepairPacket} from './English-repair-packet.mjs';
import {createHash} from 'node:crypto';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {acquireProcessRunLock} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/process-run-lock.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',out=new URL('./complete-English-coverage-c4f6b535-20261105/',import.meta.url).pathname;
const read=p=>JSON.parse(fs.readFileSync(p)),hash=b=>createHash('sha256').update(b).digest('hex'),need=(v,m)=>{if(!v)throw Error(m)};
const key=p=>p.recordKind==='source-English'?`source-English|${p.unit}|${p.field}`:`${p.recordKind}|${p.recordId}|${JSON.stringify(p.fieldPath)}`;
export function collectEnglishRepairDecisions(){
  const m=read(out+'manifest.json'),c=read(out+'cross-review-manifest.json'),entries=new Map(),duplicates=[];
  need(hash(fs.readFileSync(root+'/data/jinshu/109.json'))===m.sourceByteSha256&&hash(fs.readFileSync(root+'/data/people/extractions/jinshu/109.json'))===m.canonicalByteSha256,'Current source changed');
  const proof=(job,inputFile,inputSha256,checkId)=>({agentId:job.agentId,runId:job.runId,inputFile,inputSha256,rawFile:job.rawFile,rawSha256:job.resultSha256,completedAt:job.completedAt,checkId});
  const add=(p,authorAgentId,origin,approval=null)=>{
    const k=key(p);need(!entries.has(k)&&typeof authorAgentId==='string'&&p.before!==p.after,'Unique complete original repair required');
    const entry={...p,targetKey:k,authorAgentId,origin,status:approval?'independently-approved':'pending-review',approval};entries.set(k,entry);return entry;
  };
  for(const part of m.parts){
    need(part.phase==='returned'&&hash(fs.readFileSync(part.rawFile))===part.resultSha256&&hash(fs.readFileSync(part.inputFile))===part.inputSha256,'Exact returned source coverage required');
    const input=read(part.inputFile),r=read(part.rawFile);
    for(const p of r.knownDecisions){
      if(p.decision==='reject')continue;
      const original=input.knownProposedCorrections.find(x=>x.id===p.id);need(original&&original.before===p.before,'Known source proposal changed');
      const author=p.decision==='approve'?original.authorAgentId:part.agentId,approval=p.decision==='approve'?proof(part,part.inputFile,part.inputSha256,p.id):null;
      need(!approval||approval.agentId!==author,'Independent source approval required');add({...p,recordKind:'source-English'},author,{kind:'known-proposal',part:part.index,rawFile:part.rawFile},approval);
    }
    for(const p of r.additionalCorrections)add({...p,recordKind:'source-English'},part.agentId,{kind:'source-coverage-proposal',part:part.index,rawFile:part.rawFile});
    for(const p of r.recordCorrections)add(p,part.agentId,{kind:'source-record-proposal',part:part.index,rawFile:part.rawFile});
  }
  for(const job of c.jobs){
    for(const revision of job.wordingRevisions??[]){
      const entry=entries.get(revision.targetKey);
      need(entry?.status==='independently-approved'&&entry.after===revision.previousAfter&&entry.approval.rawSha256===revision.previousApprovalSha256&&entry.before!==revision.after&&typeof revision.after==='string'&&revision.after.trim().length>0&&revision.sourceReason?.trim().length>=20&&revision.authorAgentId==='codex-thread:01a18e17-07b3-7f13-8e34-cb207908be33','Exact approved wording lineage required for a host-authored production revision');
      entry.wordingHistory=[...(entry.wordingHistory??[]),{after:entry.after,authorAgentId:entry.authorAgentId,approval:entry.approval,revisionReason:revision.sourceReason}];
      Object.assign(entry,{after:revision.after,sourceReason:revision.sourceReason,authorAgentId:revision.authorAgentId,status:'pending-review',approval:null});
    }
    if(job.phase!=='returned')continue;
    need(hash(fs.readFileSync(job.inputFile))===job.inputSha256&&hash(fs.readFileSync(job.rawFile))===job.resultSha256,'Exact retained independent report required');
    const input=decodeEnglishRepairPacket(read(job.inputFile)),r=read(job.rawFile);need(r.reviewer.agentId===job.agentId&&r.reviewer.independentOfAuthors===true&&!input.excludedReviewerIds.includes(job.agentId),'Independent repair actor required');
    for(const p of input.proposals){
      const check=r.checks.find(x=>x.id===p.id),entry=entries.get(key(p));
      need(entry&&entry.before===p.before&&entry.after===p.after&&check,'Exact proposed wording and independent decision required');
      need(job.agentId!==entry.authorAgentId,'Reviewer authored this wording');
      if(check.verdict==='approve'){
        need(check.after===entry.after,'Approved wording changed');entry.status='independently-approved';entry.approval=proof(job,job.inputFile,job.inputSha256,p.id);
        for(const id of p.addressesCurrentFieldFindings??[]){const finding=duplicates.find(d=>d.findingId===id&&d.existingTargetKey===entry.targetKey);need(finding,'Exact additional finding required');finding.coverageReconciliation='independently-confirmed-existing-repair';finding.reconciliationProof=entry.approval;}
      }else if(check.verdict==='amend'){
        need(check.after!==entry.before,'Amended repair must fix a definite defect');entry.previousProposal={after:entry.after,authorAgentId:entry.authorAgentId};entry.after=check.after;entry.sourceReason=check.reason;entry.authorAgentId=job.agentId;entry.status='pending-review';entry.approval=null;
      }else{
        need(check.verdict==='reject'&&check.after===entry.before,'Rejected repair must retain original text');entry.status='rejected-keep-current';entry.rejection={...proof(job,job.inputFile,job.inputSha256,p.id),reason:check.reason};
      }
    }
    for(const p of r.additionalCorrections){
      const value={...p,recordKind:'source-English'},existing=entries.get(key(value));
      if(existing){
        need(existing.before===p.before,'Supplemental finding has a different source version');
        duplicates.push({findingId:hash(JSON.stringify([job.resultSha256,key(value),p.after])),unit:p.unit,field:p.field,report:job.rawFile,reportSha256:job.resultSha256,sourceReason:p.sourceReason,alternativeAfter:p.after,alternativeAuthorAgentId:job.agentId,existingTargetKey:existing.targetKey,identicalReplacement:p.after===existing.after,coverageReconciliation:p.after===existing.after&&existing.status==='independently-approved'?'identical-reviewed-replacement':'pending',existingApproval:existing.approval,disposition:'attach new diagnosis to existing field repair; preserve alternative without approving it'});
      }else add(value,job.agentId,{kind:'supplemental-review-proposal',rawFile:job.rawFile,rawSha256:job.resultSha256});
    }
  }
  for(const finding of duplicates){const e=entries.get(finding.existingTargetKey);if(finding.coverageReconciliation==='pending'&&e.status==='independently-approved'&&finding.alternativeAfter===e.after){finding.coverageReconciliation='identical-reviewed-replacement';finding.reconciliationProof=e.approval;}}
  for(const entry of entries.values())entry.unreconciledCurrentFieldFindings=duplicates.filter(d=>d.existingTargetKey===entry.targetKey&&d.coverageReconciliation==='pending').map(d=>d.findingId);
  return {at:new Date().toISOString(),kind:'source-field-indexed-independent-repair-decisions',sourceHash:m.sourceHash,canonicalExtractionHash:m.canonicalExtractionHash,stagedExtractionHash:m.stagedExtractionHash,originalReviewsReturned:c.jobs.filter(j=>j.phase==='returned').length,totalReviewJobs:c.jobs.length,entries:[...entries.values()],duplicateCurrentFieldFindings:duplicates,repairReviewComplete:c.jobs.every(j=>j.phase==='returned')&&[...entries.values()].every(e=>e.status!=='pending-review'&&!e.unreconciledCurrentFieldFindings.length),sourceIssues:read(out+'coverage-receipt.json').sourceIssues,canonicalWrites:0,dateApproval:false,chapterApproved:false};
}
if(process.argv[1]===new URL(import.meta.url).pathname){
  need(!inspectLocalDisk(root).errors.length,'Resource hold');const write=process.argv.includes('--write'),unlock=write?acquireProcessRunLock(out+'writer.lock',{label:'One English repair registry writer',failIfExists:true}):()=>{};
  try{const r=collectEnglishRepairDecisions();if(write){const file=out+'repair-decisions-working.json';fs.writeFileSync(file+'.tmp',JSON.stringify(r,null,2)+'\n',{flag:'wx'});fs.renameSync(file+'.tmp',file);}console.log(JSON.stringify({targets:r.entries.length,approved:r.entries.filter(e=>e.status==='independently-approved').length,pending:r.entries.filter(e=>e.status==='pending-review').length,rejected:r.entries.filter(e=>e.status==='rejected-keep-current').length,duplicateCurrentFieldFindings:r.duplicateCurrentFieldFindings.length,unreconciledFindings:r.duplicateCurrentFieldFindings.filter(d=>d.coverageReconciliation==='pending').length,repairReviewComplete:r.repairReviewComplete,canonicalWrites:0}));}finally{unlock();}
}
