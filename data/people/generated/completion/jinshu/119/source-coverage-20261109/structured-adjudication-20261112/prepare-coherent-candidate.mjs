import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import {expandPeopleExtraction,serializeCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-compact.mjs';
import {editorialDecisionSeed} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(dir);
const read=p=>JSON.parse(fs.readFileSync(p));const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const compact=read(path.join(base,'independent-decisions/candidate.compact.json'));
const fields=read(path.join(dir,'coherent-english-fields.json'));
const prior=read(path.join(base,'independent-decisions/validated-review.json'));
const supplements=read(path.join(base,'supplemental-adjudication-20261112/accepted-english-fields.json')).repairs;
const packet=buildPeopleExtractionPacket('jinshu','119');
const nativeDecisions=structuredClone(prior.decisions);
let added=0;
for(const r of fields.repairs){
 if(r.originalRepairId){
  const decision=nativeDecisions.find(x=>x.repairId===r.originalRepairId);const proposal=prior.proposals.find(x=>x.id===r.originalRepairId);
  if(!decision||!proposal)throw new Error('Missing accepted prior decision');
  const oldAfter=decision.decision==='revise'?decision.after:proposal.after;
  if(oldAfter!==r.after){const s=supplements.find(s=>s.unitId===r.unitId&&s.field===r.field);if(!s||oldAfter!==s.before)throw new Error('Bad overlap');Object.assign(decision,{decision:'revise',after:s.after,reason:s.reason,sourceWitness:s.sourceWitness});}
 }else{
  const s=supplements.find(s=>s.unitId===r.unitId&&s.field===r.field);if(!s)throw new Error('Missing supplement');
  compact.translationRepairs.push([r.unitId,r.field,r.before,r.after,s.reason,'high','proposed']);
  const id='jinshu:119:r'+String(compact.translationRepairs.length).padStart(4,'0');
  nativeDecisions.push({repairId:id,decision:'accept',after:null,reason:s.reviewReason,sourceWitness:s.sourceWitness});added++;
 }
}
if(added!==15)throw new Error('Unexpected additions');
const extraction=expandPeopleExtraction(compact,packet);
const seed=editorialDecisionSeed(extraction);
if(seed.proposals.length!==283||nativeDecisions.length!==283)throw new Error('Incomplete English decisions');
const candidate=path.join(dir,'coherent-candidate.compact.json');fs.writeFileSync(candidate,serializeCompactPeopleExtraction(compact),{flag:'wx'});
const plan={kind:'coherent-decision-assembly-plan-not-an-approval',book:'jinshu',chapter:'119',candidateFile:candidate,candidateSha256:hash(candidate),nativeInput:seed.input,nativeProposals:seed.proposals,acceptedEnglishDecisions:nativeDecisions,priorClaimRevisions:prior.claimRevisions,priorClaimRetractions:prior.claimRetractions,priorClaimAdditions:prior.claimAdditions,proofs:{prior:path.join(base,'independent-decisions/validated-review.json'),priorSha256:hash(path.join(base,'independent-decisions/validated-review.json')),supplemental:path.join(base,'supplemental-adjudication-20261112/independent-review.json'),supplementalSha256:hash(path.join(base,'supplemental-adjudication-20261112/independent-review.json')),coherentEnglish:path.join(dir,'coherent-english-fields.json'),coherentEnglishSha256:hash(path.join(dir,'coherent-english-fields.json'))},pending:'Independent structured report; then assemble exact accepted claim changes without altering source or prior reports. Native reviewer metadata must name a real contributing independent reviewer and retain all per-field proof provenance.',canonicalApplied:false,chapterApproved:false};
const out=path.join(dir,'coherent-decision-plan.json');fs.writeFileSync(out,JSON.stringify(plan,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({candidate,candidateSha256:hash(candidate),plan:out,planSha256:hash(out),existingAppliedRepairs:31,proposals:283,canonicalChanges:0}));
