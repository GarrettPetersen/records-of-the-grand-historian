import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath,pathToFileURL} from 'node:url';
const host='/Users/garrettpetersen/records-of-the-grand-historian',repo='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
process.env.PEOPLE_REPO_ROOT=repo;
const dir=path.dirname(fileURLToPath(import.meta.url)), oldDir=repo+'/data/people/generated/date-workflow/jinshu/053.stale-5e4b7cd15a9d5aa653e2', evidence=host+'/data/people/generated/efficiency/jinshu053-final-source-20261025';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),hash=b=>'sha256:'+crypto.createHash('sha256').update(b).digest('hex'),semantic=x=>hash(JSON.stringify(x)),write=(f,x)=>fs.writeFileSync(dir+'/'+f,JSON.stringify(x,null,2)+'\n');
const files=[repo+'/data/people/extractions/jinshu/053.json',repo+'/data/jinshu/053.json',repo+'/data/people/editorial-decisions/jinshu/053.json',oldDir+'/candidate-3.json',oldDir+'/combined-proposal.json',evidence+'/source-author/date-proposal.json',evidence+'/independent-review/exact-proposal-review.json'];
const pins=Object.fromEntries(files.map(f=>[f,hash(fs.readFileSync(f))]));
const imp=f=>import(pathToFileURL(runtime+'/'+f).href);
const {buildDateAuditPacket}=await imp('scripts/lib/people-date-audit.mjs');
const {dateRepairDifference,applyDateRepairProposal}=await imp('scripts/lib/people-date-workflow.mjs');
const {buildPeopleExtractionPacket}=await imp('scripts/build-people-extraction-packet.mjs');
const {validateCompactPeopleExtraction}=await imp('scripts/validate-people-extraction.mjs');
const {validateAppliedEditorialDecisions}=await imp('scripts/lib/people-editorial-decisions.mjs');
const baseline=read(files[0]),oldCandidate=read(files[3]),lastProposal=read(files[5]),review=read(files[6]),packet=buildDateAuditPacket('jinshu','053',{extraction:baseline});
assert(semantic(baseline).startsWith('sha256:d076c673'),'Expected new editorial-only baseline');assert.equal(baseline.translationRepairs.length,24);
assert.equal(semantic(oldCandidate),lastProposal.extractionHash);
// Replay exact independently accepted final operations in memory with its retained old-source seal.
// Reconstruct the former English source in memory from exact reviewed before strings,
// then obtain its real packet fingerprint; no sealed hash is rewritten.
const oldSource=read(files[1]),editorial=read(evidence+'/source-author/editorial-proposal.json');
for(const r of editorial.translationRepairs)oldSource.content[r.unit.blockIndex][r.unit.collection][r.unit.itemIndex].translations.find(t=>t.lang==='en')[r.field]=r.before;
const readFile=fs.readFileSync;let retainedPacket;
try{fs.readFileSync=function(f,...args){if(String(f)===files[1]){const v=JSON.stringify(oldSource);return args[0]?v:Buffer.from(v);}return readFile.call(fs,f,...args);};retainedPacket=buildDateAuditPacket('jinshu','053',{extraction:oldCandidate});}finally{fs.readFileSync=readFile;}
assert.equal(retainedPacket.sourceHash,lastProposal.sourceHash);
assert.equal(lastProposal.sourceHash,review.sealedSourceHash);
assert.equal(lastProposal.extractionHash,review.sealedExtractionHash);
assert.equal(hash(fs.readFileSync(files[5])),review.proposalByteHashes.date);
const oldDesired=applyDateRepairProposal(oldCandidate,lastProposal,retainedPacket);
const desired=structuredClone(baseline);
desired.claims=structuredClone(oldDesired.claims);
for(const p of desired.people){const old=oldDesired.people.find(q=>q[0]===p[0]);assert(old);p[4].a=structuredClone(old[4].a);}
const proposal=dateRepairDifference(baseline,desired,packet);
// Generated helper reasons describe already-approved chronology; replace them with truthful retained-material status.
for(const c of proposal.changes)c.reason='Retained research candidate rebased mechanically onto the current English-only baseline; not yet approved for current-source publication. Prior candidate3 and independently accepted final claim-104 removal / p004 empty-hint operations are provenance; fresh complete current-source independent audit remains required.';
proposal.author={name:'Codex retained date proposal rebase preparer',agentId:'/root/prepare_053_editorial_apply'};
const candidate=applyDateRepairProposal(baseline,proposal,packet);
// dateRepairDifference may reorder additions; only the reconstructed candidate may be reviewed.
const peoplePacket=buildPeopleExtractionPacket('jinshu','053');
const validation=validateCompactPeopleExtraction(candidate,peoplePacket);
let history={valid:true};try{validateAppliedEditorialDecisions(read(files[2]),validation.normalized);}catch(e){history={valid:false,error:e.message};}
for(const key of Object.keys(baseline))if(!['claims','people'].includes(key))assert.deepEqual(candidate[key],baseline[key],'Non-date field changed '+key);
for(const p of baseline.people){const after=candidate.people.find(q=>q[0]===p[0]),copy=structuredClone(after);copy[4].a=p[4].a;assert.deepEqual(copy,p,'Non-date person change');}
for(const [f,h]of Object.entries(pins))assert.equal(hash(fs.readFileSync(f)),h,'Input changed during preparation');
write('rebased-proposal.json',proposal);write('rebased-candidate.json',candidate);write('new-baseline-date-packet.json',packet);write('input-pins.json',pins);
write('verification.json',{sourceHash:packet.sourceHash,baselineExtractionHash:packet.extractionHash,candidateExtractionHash:semantic(candidate),changes:proposal.changes.length,stats:validation.stats,editorialHistory:history,preservedRepairs:24,claimRevisionsRetained:true,author:proposal.author,retainedAuthors:[...fs.readdirSync(oldDir).filter(f=>/^repair-[0-9]+-[0-9]+-.*\.json$/.test(f)).map(f=>({file:oldDir+'/'+f,author:read(oldDir+'/'+f).author??null})),{file:files[5],author:lastProposal.author}],limits:['Research/proposal only, not current-source approval.','Do not install this candidate or proposal into the active workflow.','Production applyDateRepairProposal enforces date-only mutation; production compact validation passed.']});
console.log(JSON.stringify({baseline:packet.extractionHash,candidate:semantic(candidate),changes:proposal.changes.length,stats:validation.stats,history},null,2));
