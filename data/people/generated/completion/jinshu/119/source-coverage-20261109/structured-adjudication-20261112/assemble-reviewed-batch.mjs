import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import {expandPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-compact.mjs';
import {validateEditorialDecisions} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
import {validateCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=p=>JSON.parse(fs.readFileSync(p));const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const reportFile=path.join(dir,'independent-review.json'),report=read(reportFile),input=read(path.join(dir,'input.json')),plan=read(path.join(dir,'coherent-decision-plan.json'));
if(hash(reportFile)!=='8e894f6856f9d7aa5ad9534b0331ea4dfc632515072610c1bb2a2b66bf205aa0'||report.inputSha256!==hash(path.join(dir,'input.json'))||report.agentId!=='/root/jinshu119_structured_reviewer'||input.authorExclusions.includes(report.agentId))throw new Error('Independent review pin/provenance failure');
if(!report.proofReuseVerified.verified||report.changes.length!==input.changes.length||report.changes.some(x=>x.decision!=='accept'))throw new Error('Review incomplete or changed');
for(const [name,pin] of Object.entries(report.proofReuseVerified.artifacts)){if(hash(path.join(dir,name))!==pin.sha256)throw new Error('Reused proof drift');}
const result={schemaVersion:3,book:'jinshu',chapter:'119',input:plan.nativeInput,reviewer:{...report.reviewer,name:'Independent Jinshu 119 structured reviewer; accepted English proofs reused'},proposals:plan.nativeProposals,decisions:plan.acceptedEnglishDecisions,claimRetractions:structuredClone(plan.priorClaimRetractions),claimRevisions:structuredClone(plan.priorClaimRevisions),claimAdditions:structuredClone(plan.priorClaimAdditions)};
const compact=read(plan.candidateFile),packet=buildPeopleExtractionPacket('jinshu','119'),extraction=expandPeopleExtraction(compact,packet);
const claimById=new Map(extraction.claims.map(c=>[c.id,c]));
function add(change,before,after){
 if(before&&JSON.stringify(claimById.get(before.id))!==JSON.stringify(before))throw new Error('Exact before mismatch '+before.id);
 const common={repairId:change.repairId,reason:change.reason,sourceWitness:change.sourceWitness};
 if(change.operation==='revise')result.claimRevisions.push({...common,before,after});
 else if(change.operation==='retract')result.claimRetractions.push({...common,claim:before});
 else if(change.operation==='add')result.claimAdditions.push({...common,claim:after});
 else throw new Error('Unsupported reviewed operation');
}
for(const proposed of input.changes){const actual=report.changes.find(c=>c.changeId===proposed.changeId);if(!actual||actual.operation!==proposed.operation||actual.repairId!==proposed.repairId||JSON.stringify(actual.after)!==JSON.stringify(proposed.after??null))throw new Error('Accepted contract mismatch '+proposed.changeId);add(actual,proposed.before,actual.after);}
const additional=report.structuralFindings.flatMap(f=>f.exactRequiredChanges??[]);
if(additional.length!==1||additional[0].before.id!=='jinshu:119:c0717')throw new Error('Unexpected additional change');
for(const c of additional)add(c,c.before,c.after);
const envelopeAdaptations=[];
for(const decision of result.decisions){
 if(typeof decision.sourceWitness==='string'){
  const proposal=result.proposals.find(p=>p.id===decision.repairId),unit=packet.units.find(u=>u.id===proposal.unit.id),excerpt=decision.sourceWitness;
  if(!['jinshu:119:r0065','jinshu:119:r0314'].includes(decision.repairId)||!unit.zh.includes(excerpt))throw new Error('Unexpected primitive source witness');
  const after={source:'chapter-text',citation:'Jinshu 119 '+unit.id,excerpt};
  envelopeAdaptations.push({target:decision.repairId+'/sourceWitness',before:excerpt,after,reason:'Wrap the exact accepted Chinese source quotation in the required native witness object; semantic text unchanged.'});decision.sourceWitness=after;
 }
}
const conciseReasons=new Map([
 ['jinshu:119:r0311','系組而降軹道 invokes Qin’s surrender motif. Shiji 006 s0664 explicitly places Ziying’s neck cord and surrender beside Zhidao. The accepted replacement marks the allusion and preserves Hong’s failed plan; his narrative surrender with wife and children remains at the camp gate in s0245.'],
 ['jinshu:119:c1956','子略 is Xing’s courtesy name, not a son token. Local succession/先構 context alone does not prove biological parentage. Jinshu 117 s0003 explicitly identifies Xing/Zilüe as Chang’s eldest son, supporting the retained strongly-inferred edge with English son and no invented Chinese 子 span. Preserve that external witness; do not upgrade certainty or infer dates.'],
 ['jinshu:119:c2095','Jinshu 116 s0175 identifies the 舊主 of s0258 as Fu Jian 苻堅 and explicitly describes exhumation and corpse abuse. This is retrospective reception, not living activity. Retain the reviewed s0258 identity evidence and collective-reference retractions. Keep the separately supported AD 357 accession/AD 385 death research outside this local event; do not restore a lifespan or confuse 苻堅 with 苻健.'],
]);
for(const entry of [...result.decisions,...result.claimRevisions,...result.claimAdditions]){
 if(entry.reason.length<=500)continue;
 const id=entry.after?.id??entry.claim?.id??entry.repairId,after=conciseReasons.get(id);
 if(!after||after.length>500)throw new Error('Unplanned oversized native rationale '+id);
 envelopeAdaptations.push({target:id+'/reason',before:entry.reason,after,reason:'Concise native envelope rationale; exact accepted content and complete original independent reasoning are preserved in the pinned report.'});entry.reason=after;
}
const validation=validateCompactPeopleExtraction(compact,packet);
const reviewed=validateEditorialDecisions(result,extraction,packet);
const out=path.join(dir,'coherent-native-review.json');fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
const provenance={schemaVersion:1,kind:'reviewed-coherent-batch-provenance',book:'jinshu',chapter:'119',assembledAt:new Date().toISOString(),nativeReview:{file:out,sha256:hash(out),contributingReviewer:report.agentId},focusedStructuredReview:{file:reportFile,sha256:hash(reportFile),acceptedActions:7,additionalRequiredClaimRevision:'c0717'},englishProofs:plan.proofs,envelopeAdaptations,statement:'The native envelope names an actual contributing independent reviewer. English decisions and prior structured changes reuse independent proofs, not re-authored approvals. Per-field original reviewers remain in coherent-english-fields.json and original reports remain immutable. Exact primitive-witness wrapping and concise rationale adaptations are recorded above without changing accepted before/after content, certainty or evidence. This is native pre-application validation, not final source/extraction application or chapter approval.',nativeValidation:{people:extraction.people.length,claims:extraction.claims.length,reviewedRepairs:reviewed.reviewedRepairs.length,revisions:result.claimRevisions.length,retractions:result.claimRetractions.length,additions:result.claimAdditions.length},canonicalApplied:false,chapterApproved:false};
fs.writeFileSync(path.join(dir,'coherent-native-review-provenance.json'),JSON.stringify(provenance,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({nativeReview:out,sha256:hash(out),...provenance.nativeValidation,canonicalChanges:0}));
