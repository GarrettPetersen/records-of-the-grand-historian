import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const parent='/Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/efficiency/jinshu086-next-source-cohort8-20261025';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
const root='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
process.env.PEOPLE_REPO_ROOT=root;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=x=>'sha256:'+crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const bytes=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const packet=read(parent+'/blinded-packet.json');
const blind=read(parent+'/independent-review/blind-judgment.json');
assert.equal(bytes(parent+'/independent-review/blind-judgment.json'),'bead7fe46904d762623b1d8bb0cc45ef606a2b3884b3fed36c9b0583ecfc59a9');
const proposal=read(parent+'/proposal.json');
const base=read(packet.candidateFile);
const priorPath='/Users/garrettpetersen/records-of-the-grand-historian/'+packet.excludedPriorOperations.file;
const prior=read(priorPath);
const baseBytesBefore=bytes(packet.candidateFile),priorBytesBefore=bytes(priorPath);
assert.equal(priorBytesBefore,'689df06ed9ec94d2bd3de7853a48a17f6ba73a56a64c3bfd2efe7cb4abb22faa');
assert.equal(prior.changes.length,117);
assert.equal(bytes(parent+'/proposal.json'),'33171bb24e2337d2a542d9b8f58fce0a3fadb9c80b06988fe5ab39ef0ebae5c2');
assert.equal(bytes(parent+'/aggregate-proposal.json'),'aac194010279a25584b244a39191cee51aaed075ba5b64c634d1161aaa2c0159');
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
 if(change.id==='claim-158'){assert(change.after[4].includes('s0257'));assert(change.after[4].includes('s0258'));assert(change.after[4].includes('s0260'));}else{assert(change.after[4].includes('s0234'));assert.equal(change.after[3],'uncertain');}
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
assert.deepEqual(aggregateProposal.changes.slice(0,117),prior.changes);
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
assert.equal(hash(aggregate),'sha256:9674c0e7c16847ec48506a4c7fe631d3889b8b8f7e6410926ef517a46883afe8');
for(let i=0;i<base.claims.length;i++)if(!packet.items.some(item=>item.claimIndex===i))assert.deepEqual(candidate.claims[i],base.claims[i]);
assert.equal(bytes(packet.candidateFile),baseBytesBefore);assert.equal(bytes(priorPath),priorBytesBefore);
const report={schemaVersion:1,status:'Scoped independent source review passed; uninstalled; not chapter approval',reviewer:'/root/jin086_next_source_independent',blindJudgmentHash:'sha256:'+bytes(parent+'/independent-review/blind-judgment.json'),proposalByteHash:'sha256:'+bytes(parent+'/proposal.json'),proposalHash:hash(proposal),sourceHash:audit.sourceHash,extractionHash:audit.extractionHash,sourceVerdict:'All31 Chinese units were independently read before proposals. Yin Jian’s interception and Sima Bao’s actual death retain the existing AD318 lower floor from the s0234 Yuan accession/retained Jianxing6 anchor, through the linked crisis and flight sequence. Bao’s invitation of Zhang Mao is in a distinct earlier-career backstory introduced at s0255–s0257; 建興初 retains the existing AD313 lower floor. The following 二年 court summons and later 太興三年 elevation remain separate anchors and are not borrowed as exact invitation or Bao death years. Mao refused the offered service, so Bao’s recruiting attestation is not evidence of accepted service by Mao. Original uncertain certainties and all Western bounds remain intact. No external exact320 death year, endpoint, duration counting or life/reign interval is introduced. Unrelated claim510 remains research-held unchanged.',claims:blind.judgments.map(j=>({id:j.id,verdict:'supported-scoped-change',reason:j.sourceReason+' '+j.dateJudgment})),checks,unresolved:{base:before.length,cohort3Only:after.length,prior117:priorUnresolved.length,aggregate120:combined.length,removed},prior117Preserved:true,heldClaim510Unchanged:true,peopleUnchanged:true,boundsUnchanged:true,nonselectedClaimsUnchanged:true,canonicalInputsByteUnchanged:true,candidateHash:hash(candidate),aggregateCandidateHash:hash(aggregate),diagnostics:{base:dateAuditDiagnostics(audit),candidate:dateAuditDiagnostics(buildDateAuditPacket('jinshu','086',{extraction:candidate}))},limitations:'No full chapter or date approval; no installation, state, queue, Git, source or canonical edits. Count reduction is a scheduling-predicate result, not approval. Prior 117 changes are preserved structurally, not source re-reviewed here.'};
fs.writeFileSync(parent+'/independent-review/final-review.json',JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(report,null,2));
