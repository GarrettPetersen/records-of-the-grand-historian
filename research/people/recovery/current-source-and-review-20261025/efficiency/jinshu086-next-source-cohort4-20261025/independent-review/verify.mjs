import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const parent='/Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/efficiency/jinshu086-next-source-cohort4-20261025';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
const root='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
process.env.PEOPLE_REPO_ROOT=root;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=x=>'sha256:'+crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const bytes=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const packet=read(parent+'/blinded-packet.json');
const blind=read(parent+'/independent-review/blind-judgment.json');
assert.equal(bytes(parent+'/independent-review/blind-judgment.json'),'4139a9425c1679fc8261194849ae69dfb1f3a2c35d5762a374581af4bb1aadfb');
const proposal=read(parent+'/proposal.json');
const base=read(packet.candidateFile);
const priorPath='/Users/garrettpetersen/records-of-the-grand-historian/'+packet.excludedPriorOperations.file;
const prior=read(priorPath);
const baseBytesBefore=bytes(packet.candidateFile),priorBytesBefore=bytes(priorPath);
assert.equal(prior.changes.length,72);
assert.equal(bytes(parent+'/proposal.json'),'ad0db419537ef8d5aaedb5e32058a8d456ec2f79be3fac879cd86f8128736519');
assert.equal(bytes(parent+'/aggregate-proposal.json'),'806a41df190208abf868f9e9ec2ac279e9e0e7e181c416b599a6cf6e1ec7da5c');
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
 assert(change.after[4].includes('s0499'));
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
assert.deepEqual(aggregateProposal.changes.slice(0,72),prior.changes);
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
for(let i=0;i<base.claims.length;i++)if(!packet.items.some(item=>item.claimIndex===i))assert.deepEqual(candidate.claims[i],base.claims[i]);
assert.equal(bytes(packet.candidateFile),baseBytesBefore);assert.equal(bytes(priorPath),priorBytesBefore);
const report={schemaVersion:1,status:'Scoped independent source review passed; uninstalled; not chapter approval',reviewer:'/root/jin086_next_source_independent',blindJudgmentHash:'sha256:'+bytes(parent+'/independent-review/blind-judgment.json'),proposalByteHash:'sha256:'+bytes(parent+'/proposal.json'),proposalHash:hash(proposal),sourceHash:audit.sourceHash,extractionHash:audit.extractionHash,sourceVerdict:'All110 Chinese units were read, including the complete later remonstrance, campaign defeat, memorial and court response. All12 selected own-event claims retain supported onOrAfter AD346 bounds from Chonghua’s accession at s0499. No further numbered current era year occurs through s0604; elapsed business delays and the ancient Lu quotation do not provide more precise calendar dates. Fu Jian’s name is 苻健, and the two deaths 弘、悠皆沒 are confirmed by mourning for 戰亡吏士. Pei Heng’s statement is a current reported dispatch inside Chonghua’s memorial. The memorial context and 季龍自斃 notice remain explicit in added evidence and the proposal reason, without inferring a year for Shi Hu’s death or treating Pei Heng’s current dispatch as retrospective reception. No precise year, upper endpoint, ruler lifespan or reign interval is introduced.',claims:blind.judgments.map(j=>({id:j.id,verdict:'supported-scoped-change',reason:j.sourceReason+' '+j.dateJudgment})),checks,unresolved:{base:before.length,cohort12Only:after.length,prior72:priorUnresolved.length,aggregate84:combined.length,removed},prior72Preserved:true,peopleUnchanged:true,boundsUnchanged:true,nonselectedClaimsUnchanged:true,canonicalInputsByteUnchanged:true,candidateHash:hash(candidate),aggregateCandidateHash:hash(aggregate),diagnostics:{base:dateAuditDiagnostics(audit),candidate:dateAuditDiagnostics(buildDateAuditPacket('jinshu','086',{extraction:candidate}))},limitations:'No full chapter or date approval; no installation, state, queue, Git, source or canonical edits. Count reduction is a scheduling-predicate result, not approval. Prior 72 changes are preserved structurally, not source re-reviewed here.'};
fs.writeFileSync(parent+'/independent-review/final-review.json',JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(report,null,2));
