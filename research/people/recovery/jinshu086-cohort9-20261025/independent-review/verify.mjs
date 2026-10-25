import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const parent='/Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/efficiency/jinshu086-next-source-cohort9-20261025';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
const root='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
process.env.PEOPLE_REPO_ROOT=root;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=x=>'sha256:'+crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const bytes=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const packet=read(parent+'/blinded-packet.json');
const blind=read(parent+'/independent-review/blind-judgment.json');
assert.equal(bytes(parent+'/independent-review/blind-judgment.json'),'c6317bc0d17a795907d1c9a8635fca4edf88682751194866f548132ea35312d9');
const proposal=read(parent+'/proposal.json');
const base=read(packet.candidateFile);
const priorPath='/Users/garrettpetersen/records-of-the-grand-historian/'+packet.excludedPriorOperations.file;
const prior=read(priorPath);
const baseBytesBefore=bytes(packet.candidateFile),priorBytesBefore=bytes(priorPath);
assert.equal(priorBytesBefore,'aac194010279a25584b244a39191cee51aaed075ba5b64c634d1161aaa2c0159');
assert.equal(prior.changes.length,120);
assert.equal(bytes(parent+'/proposal.json'),'027d4cc760603082879cde91a95abf5ee3d194b03b7b1271cc4007e8a2347593');
assert.equal(bytes(parent+'/aggregate-proposal.json'),'d93e5ef6b744ee7f80694a86712035e7522e441b722d8dcadf757a131e9ea9f2');
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
 if(['claim-257','claim-478'].includes(change.id)){assert(change.after[4].includes('s0487'));assert(change.after[4].includes('s0488'));assert(change.after[4].includes('s0499'));}
 if(change.id==='claim-367'){assert(change.after[4].includes('s0753'));assert(change.after[4].includes('s0769'));assert(change.after[4].includes('s0770'));assert(change.after[4].includes('s0775'));assert(change.after[4].includes('s0778'));assert(change.after[4].includes('s0787'));assert(change.reason.includes('六年夏'));}
 if(change.id==='claim-567'){assert.equal(change.after[0],'p133');assert(change.after[4].includes('s0302'));}
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
assert.deepEqual(aggregateProposal.changes.slice(0,120),prior.changes);
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
const preservedResearchHolds=[362,364,365,366,462,510];
for(const id of preservedResearchHolds){assert.deepEqual(candidate.claims[id-1],base.claims[id-1]);assert.deepEqual(aggregate.claims[id-1],base.claims[id-1]);assert(combined.includes('claim-'+id));}
assert.equal(hash(aggregate),'sha256:bdb418ae01bb67f0cdda369b4f39bf550f7afd29895939884cef7b5c6ab56d46');
for(let i=0;i<base.claims.length;i++)if(!packet.items.some(item=>item.claimIndex===i))assert.deepEqual(candidate.claims[i],base.claims[i]);
assert.equal(bytes(packet.candidateFile),baseBytesBefore);assert.equal(bytes(priorPath),priorBytesBefore);
const report={schemaVersion:1,status:'Scoped independent source review passed; uninstalled; not chapter approval',reviewer:'/root/jin086_next_source_independent',blindJudgmentHash:'sha256:'+bytes(parent+'/independent-review/blind-judgment.json'),proposalByteHash:'sha256:'+bytes(parent+'/proposal.json'),proposalHash:hash(proposal),sourceHash:audit.sourceHash,extractionHash:audit.extractionHash,sourceVerdict:'All91 Chinese units were independently read before proposals. Ma Ji is the current proposer in a speech accepted by Zhang Jun, bounded by the Yonghe1 appointment and death/next Yonghe2 accession; his AD345–346 bounds remain intact. King Mu is cited within that same speech and receives only later reception chronology. Dahuai’s own investiture retains its broad AD366–376 envelope while Tianxi’s imperial confirmation, retrospective accession summary, subsequent deposition and prospective 六年夏 pledge remain distinct; no year is inferred from the pledge and no disputed campaign witness is resolved. Han Pu personally commands the separate 永昌初 strike with the unchanged AD322 floor. All original certainty/roles/actions and bounds are preserved. Explicit comparisons confirm that the Mao death, Taihe campaign claims and separate510 hold are unchanged and unresolved in both candidates.',claims:blind.judgments.map(j=>({id:j.id,verdict:'supported-scoped-change',reason:j.sourceReason+' '+j.dateJudgment})),checks,unresolved:{base:before.length,cohort4Only:after.length,prior120:priorUnresolved.length,aggregate124:combined.length,removed},prior120Preserved:true,heldClaim510Unchanged:true,preservedResearchHolds,peopleUnchanged:true,boundsUnchanged:true,nonselectedClaimsUnchanged:true,canonicalInputsByteUnchanged:true,candidateHash:hash(candidate),aggregateCandidateHash:hash(aggregate),diagnostics:{base:dateAuditDiagnostics(audit),candidate:dateAuditDiagnostics(buildDateAuditPacket('jinshu','086',{extraction:candidate}))},limitations:'No full chapter or date approval; no installation, state, queue, Git, source or canonical edits. Count reduction is a scheduling-predicate result, not approval. Prior 120 changes are preserved structurally, not source re-reviewed here.'};
fs.writeFileSync(parent+'/independent-review/final-review.json',JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(report,null,2));
