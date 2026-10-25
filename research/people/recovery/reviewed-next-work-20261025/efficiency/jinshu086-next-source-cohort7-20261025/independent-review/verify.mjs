import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const parent='/Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/efficiency/jinshu086-next-source-cohort7-20261025';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
const root='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
process.env.PEOPLE_REPO_ROOT=root;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=x=>'sha256:'+crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const bytes=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const packet=read(parent+'/blinded-packet.json');
const blind=read(parent+'/independent-review/blind-judgment.json');
assert.equal(bytes(parent+'/independent-review/blind-judgment.json'),'3d99170db670cbcd8bd81466915068c99061d246e4b8764e3a3070847ca148a5');
const proposal=read(parent+'/proposal.json');
const base=read(packet.candidateFile);
const priorPath='/Users/garrettpetersen/records-of-the-grand-historian/'+packet.excludedPriorOperations.file;
const prior=read(priorPath);
const baseBytesBefore=bytes(packet.candidateFile),priorBytesBefore=bytes(priorPath);
assert.equal(priorBytesBefore,'2fe8036b3c67b90d9a6b7114a72ff512bf767f9d71d01ef6332ab312d0d83ccf');
assert.equal(prior.changes.length,106);
assert.equal(bytes(parent+'/proposal.json'),'346552ea80a9ff1e07ccfaca3f94e54ec8883ec3e57bea34f3f4d0a23d1881b4');
assert.equal(bytes(parent+'/aggregate-proposal.json'),'689df06ed9ec94d2bd3de7853a48a17f6ba73a56a64c3bfd2efe7cb4abb22faa');
assert.deepEqual(proposal.changes.map(c=>c.id),packet.items.map(i=>i.id));
const priorTargets=new Set(prior.changes.map(c=>c.id ?? 'hints-'+c.personId));
for(const change of proposal.changes){
 assert.equal(change.kind,'replace'); assert(!priorTargets.has(change.id));
 const item=packet.items.find(i=>i.id===change.id);
 assert.deepEqual(change.before,base.claims[item.claimIndex]);
 assert.equal(hash(change.before),item.claimHash);
 for(const slot of [0,1,3]) assert.deepEqual(change.after[slot],change.before[slot]);
 const strip=value=>Array.isArray(value)?value.map(strip):value && typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([key])=>!['sourceDate','unresolved','unresolvedReason'].includes(key)).map(([key,child])=>[key,strip(child)])):value;
 assert.deepEqual(strip(change.after[2]),strip(change.before[2]));
 if(change.before[2].dateContext){
  assert.equal(change.after[2].kind,'retrospective-reference');
  assert.equal(change.after[2].receptionType,'retrospective');
  assert.deepEqual(change.after[2].dateContext.westernBounds,change.before[2].dateContext.westernBounds);
  assert(!change.after[2].dateContext.unresolved && !change.after[2].dateContext.unresolvedReason);
 }
 assert.deepEqual(change.after[2].westernBounds,change.before[2].westernBounds);
 assert(change.before[4].every(id=>change.after[4].includes(id)));
 assert(change.after[4].every(id=>packet.units.some(u=>u.id===id)));
 assert(change.after[4].includes('s0449'));
 if(change.id==='claim-230')assert.equal(change.after[3],'uncertain');
 if(change.id==='claim-569'){assert.equal(change.after[0],'p188');assert.equal(change.after[1],'death');assert(change.after[4].includes('s0452'));}
 if(change.id==='claim-296'){assert(change.after[4].includes('s0599'));assert(change.reason.includes('季龍自斃'));assert(change.after[2].sourceDate.text.includes('memorial'));}
 assert(!change.after[2].unresolved && !change.after[2].unresolvedReason);
}
const {buildDateAuditPacket,unresolvedDateAuditItems,dateAuditDiagnostics}=await import(runtime+'/scripts/lib/people-date-audit.mjs');
const {applyDateRepairProposal}=await import(runtime+'/scripts/lib/people-date-workflow.mjs');
const {buildPeopleExtractionPacket}=await import(runtime+'/scripts/build-people-extraction-packet.mjs');
const {validateCompactPeopleExtraction}=await import(runtime+'/scripts/validate-people-extraction.mjs');
const {validateAppliedEditorialDecisions}=await import(runtime+'/scripts/lib/people-editorial-decisions.mjs');
const audit=buildDateAuditPacket('jinshu','086',{extraction:base});
assert.equal(audit.sourceHash,packet.sourceHash); assert.equal(audit.extractionHash,packet.extractionHash);
const candidate=applyDateRepairProposal(base,proposal,audit);
const oldCandidate=applyDateRepairProposal(base,prior,audit);
const aggregateProposal={sourceHash:audit.sourceHash,extractionHash:audit.extractionHash,changes:[...prior.changes,...proposal.changes]};
assert.deepEqual(aggregateProposal.changes.slice(0,106),prior.changes);
assert.deepEqual(read(parent+'/aggregate-proposal.json').changes,aggregateProposal.changes);
const aggregate=applyDateRepairProposal(base,aggregateProposal,audit);
const extractionPacket=buildPeopleExtractionPacket('jinshu','086');
const editorial=read(root+'/data/people/editorial-decisions/jinshu/086.json');
const checks={};
for(const [name,value]of Object.entries({candidate,aggregate})){
 const result=validateCompactPeopleExtraction(value,extractionPacket,{strictAliasDispositions:true});
 validateAppliedEditorialDecisions(editorial,result.normalized);
 checks[name]={compact:true,strictAliasDispositions:true,existingEditorialHistory:true,stats:result.stats};
}
const unresolved=x=>unresolvedDateAuditItems(buildDateAuditPacket('jinshu','086',{extraction:x})).map(i=>i.id);
const before=unresolved(base),after=unresolved(candidate),priorUnresolved=unresolved(oldCandidate),combined=unresolved(aggregate);
const removed=before.filter(id=>!after.includes(id));
assert.deepEqual(removed,packet.items.map(i=>i.id));
assert.deepEqual(priorUnresolved.filter(id=>!combined.includes(id)),removed);
assert.deepEqual(candidate.people,base.people);
assert.deepEqual(candidate.claims[509],base.claims[509]);
assert.deepEqual(aggregate.claims[509],base.claims[509]);
assert(combined.includes('claim-510'));
assert.equal(hash(aggregate),'sha256:0c8c5ef3050c909928332018d279bc6eb88a8bffc5eb68f7bb2e512d11602855');
for(let i=0;i<base.claims.length;i++)if(!packet.items.some(item=>item.claimIndex===i))assert.deepEqual(candidate.claims[i],base.claims[i]);
assert.equal(bytes(packet.candidateFile),baseBytesBefore);assert.equal(bytes(priorPath),priorBytesBefore);
const report={schemaVersion:1,status:'Scoped independent source review passed; uninstalled; not chapter approval',reviewer:'/root/jin086_next_source_independent',blindJudgmentHash:'sha256:'+bytes(parent+'/independent-review/blind-judgment.json'),proposalByteHash:'sha256:'+bytes(parent+'/proposal.json'),proposalHash:hash(proposal),sourceHash:audit.sourceHash,extractionHash:audit.extractionHash,sourceVerdict:'All20 Chinese units were independently read before proposals. 咸和初 at s0449 resets military/diplomatic chronology after the thematic residence description ending 及末年. The current 及/至是/後 sequences support all eleven unchanged onOrAfter AD326 lower bounds. The 趙貞 initial refusal is a flashback; the capture returns to current time via 至是. 辛岩 the relief commander and 辛晏 the protector remain distinct. The actual killing 石勒殺劉曜 belongs to Liu Yao as death victim, with Shi Le separately the actor; no external AD329 year or upper endpoint is imported. Claim230 retains its original uncertain certainty. No event is recast as retrospective reception, no exact opening-years interval or reign/lifespan is invented, and the unrelated510 research hold remains unchanged.',claims:blind.judgments.map(j=>({id:j.id,verdict:'supported-scoped-change',reason:j.sourceReason+' '+j.dateJudgment})),checks,unresolved:{base:before.length,cohort11Only:after.length,prior106:priorUnresolved.length,aggregate117:combined.length,removed},prior106Preserved:true,heldClaim510Unchanged:true,peopleUnchanged:true,boundsUnchanged:true,nonselectedClaimsUnchanged:true,canonicalInputsByteUnchanged:true,candidateHash:hash(candidate),aggregateCandidateHash:hash(aggregate),diagnostics:{base:dateAuditDiagnostics(audit),candidate:dateAuditDiagnostics(buildDateAuditPacket('jinshu','086',{extraction:candidate}))},limitations:'No full chapter or date approval; no installation, state, queue, Git, source or canonical edits. Count reduction is a scheduling-predicate result, not approval. Prior 106 changes are preserved structurally, not source re-reviewed here.'};
fs.writeFileSync(parent+'/independent-review/final-review.json',JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(report,null,2));
