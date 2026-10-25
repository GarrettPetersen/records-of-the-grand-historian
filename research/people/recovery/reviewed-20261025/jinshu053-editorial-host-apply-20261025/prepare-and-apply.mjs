import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const host='/Users/garrettpetersen/records-of-the-grand-historian';
const repo='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
const dir=path.dirname(fileURLToPath(import.meta.url));
const evidence=host+'/data/people/generated/efficiency/jinshu053-final-source-20261025';
if(process.argv.slice(2).some(a=>a!=='--apply'))throw Error('Only optional --apply supported');
execFileSync('npm',['run','people:disk:check'],{cwd:host,stdio:'inherit'});
process.env.PEOPLE_REPO_ROOT=repo;
const imp=p=>import(pathToFileURL(runtime+'/'+p).href);
const hash=b=>'sha256:'+crypto.createHash('sha256').update(b).digest('hex');
const semantic=x=>hash(JSON.stringify(x));
const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const bytes=f=>fs.existsSync(f)?hash(fs.readFileSync(f)):null;
const text=x=>JSON.stringify(x,null,2)+'\n';
const chapterFile=repo+'/data/jinshu/053.json', extractionFile=repo+'/data/people/extractions/jinshu/053.json';
const decisionFile=repo+'/data/people/editorial-decisions/jinshu/053.json', packetFile=repo+'/data/people/generated/packets/jinshu/053.json';
const proposalFile=evidence+'/source-author/editorial-proposal.json',reviewFile=evidence+'/independent-review/exact-proposal-review.json',blindFile=evidence+'/independent-review/blind-judgment.json';
const inputFiles=[chapterFile,extractionFile,decisionFile,packetFile,proposalFile,reviewFile,blindFile];
const pins=Object.fromEntries(inputFiles.map(f=>[f,bytes(f)]));
const manifestFile=dir+'/input-pins.json';
if(fs.existsSync(manifestFile))assert.deepEqual(pins,json(manifestFile),'Sealed inputs changed');
const original=json(extractionFile), prior=json(decisionFile),proposal=json(proposalFile),review=json(reviewFile),blind=json(blindFile);
assert.equal(semantic(original),'sha256:5e4b7cd15a9d5aa653e28fc1101bc3a846130274021c8b02eb5b148435a7f7b0');
assert.equal(bytes(proposalFile),review.proposalByteHashes.editorial);
assert.equal(bytes(blindFile),review.blindJudgmentByteHash);
assert.equal(review.independentOfAuthor,true);
assert.equal(review.reviewer,'/root/jin053_final_source_independent');
assert.equal(original.translationRepairs.length,22);
const {buildPeopleExtractionPacket}=await imp('scripts/build-people-extraction-packet.mjs');
const {validateCompactPeopleExtraction}=await imp('scripts/validate-people-extraction.mjs');
const {editorialDecisionSeed,mergeEditorialDecisionReview,validateEditorialDecisions,validateAppliedEditorialDecisions,editorialReviews}=await imp('scripts/lib/people-editorial-decisions.mjs');
const {applyPeopleTranslationRepairs}=await imp('scripts/apply-people-translation-repairs.mjs');
const {buildDateAuditPacket}=await imp('scripts/lib/people-date-audit.mjs');
const {writeTextAtomic}=await imp('scripts/lib/people-content.mjs');
const packet=buildPeopleExtractionPacket('jinshu','053');
assert.equal(proposal.chapterFingerprint,packet.input.chapterFingerprint);
assert.equal(buildDateAuditPacket('jinshu','053',{extraction:original}).sourceHash,review.sealedSourceHash);
assert.equal(editorialReviews(prior).reduce((n,r)=>n+r.claimRevisions.length,0),4);
const prepared=structuredClone(original);
assert.equal(proposal.translationRepairs.length,2);
for(const [i,r] of proposal.translationRepairs.entries()){
 assert.equal(r.id,'jinshu:053:r'+String(23+i).padStart(4,'0'));
 assert.equal(r.unit.id,'s0044');assert.equal(r.status,'proposed');
 assert.equal(r.field,i===0?'idiomatic':'literal');
 const u=packet.units.find(u=>u.id==='s0044');assert.equal(r.before,u[r.field==='idiomatic'?'en':'literal']);
 const op=review.operations.find(o=>o.scope===r.id+' '+r.field);assert.equal(op.verdict,'accept');assert.equal(op.after,r.after);
 prepared.translationRepairs.push([r.unit.id,r.field,r.before,r.after,r.reason,r.confidence,r.status]);
}
const expanded=validateCompactPeopleExtraction(prepared,packet).normalized;
validateAppliedEditorialDecisions(prior,expanded);
const incoming=editorialDecisionSeed(expanded);
// Rebind only the two exact reviewed English contracts to the original baseline.
// This is serialization of retained independent evidence, not a new review or date approval.
incoming.reviewer={kind:'codex',name:review.reviewer,model:null,agentId:review.reviewer,runId:null,completedAt:new Date(blind.reviewedAt).toISOString()};
incoming.decisions=incoming.proposals.map(r=>({repairId:r.id,decision:'accept',after:null,reason:review.operations.find(o=>o.scope===r.id+' '+r.field).reason,sourceWitness:{source:'chapter-text',citation:'Jinshu 053 s0044; retained independent exact-proposal-review.json and blind-judgment.json',excerpt:proposal.sourceUnit.zh}}));
const decisions=mergeEditorialDecisionReview(prior,incoming);
assert.deepEqual(editorialReviews(decisions).slice(0,-1),editorialReviews(prior));
validateEditorialDecisions(decisions,expanded,packet);
// Run the production applier, intercepting all writes into memory. Unexpected I/O fails.
const originals={readFileSync:fs.readFileSync,existsSync:fs.existsSync,mkdirSync:fs.mkdirSync,writeFileSync:fs.writeFileSync,renameSync:fs.renameSync};
const overlays=new Map([[extractionFile,text(prepared)],[decisionFile,text(decisions)]]),writes=new Map(),temporary=new Map();
const allowed=new Set([chapterFile,extractionFile,packetFile]);
try{
 fs.readFileSync=function(f,...args){if(overlays.has(String(f))){const v=overlays.get(String(f));return args[0]?v:Buffer.from(v);}return originals.readFileSync.call(fs,f,...args);};
 fs.existsSync=function(f){return overlays.has(String(f))||originals.existsSync.call(fs,f);};
 fs.mkdirSync=function(f){assert([...allowed].some(a=>path.dirname(a)===String(f)),'Unexpected mkdir '+f);};
 fs.writeFileSync=function(f,v){assert([...allowed].some(a=>path.dirname(a)===path.dirname(String(f))&&path.basename(String(f))==='.'+path.basename(a)+'.'+process.pid+'.tmp'),'Unexpected write '+f);temporary.set(String(f),String(v));};
 fs.renameSync=function(a,b){assert(allowed.has(String(b))&&temporary.has(String(a)),'Unexpected rename');writes.set(String(b),temporary.get(String(a)));temporary.delete(String(a));};
 applyPeopleTranslationRepairs({book:'jinshu',chapter:'053',extraction:null,decisions:null,reconcileCurrent:false,candidateDispositions:[],candidatePeople:[],prepareCandidateReview:false});
}finally{Object.assign(fs,originals);}
assert.deepEqual([...writes.keys()].sort(),[...allowed].sort());
const outputExtraction=JSON.parse(writes.get(extractionFile)),outputPacket=JSON.parse(writes.get(packetFile));
const validated=validateCompactPeopleExtraction(outputExtraction,outputPacket);
validateAppliedEditorialDecisions(decisions,validated.normalized);
assert.equal(outputExtraction.translationRepairs.length,24);
assert.deepEqual(outputExtraction.claims,original.claims,'English-only correction changed claims');
assert.deepEqual(outputExtraction.people,original.people,'English-only correction changed people/hints');
assert.deepEqual(outputExtraction.translationRepairs.slice(0,22),original.translationRepairs);
const sourceBefore=json(chapterFile),sourceAfter=JSON.parse(writes.get(chapterFile));
const reverted=structuredClone(sourceAfter);const location=proposal.sourceUnit;
const oldItem=sourceBefore.content[location.blockIndex][location.collection][location.itemIndex];
reverted.content[location.blockIndex][location.collection][location.itemIndex]=oldItem;
assert.deepEqual(reverted,sourceBefore,'Changes outside s0044');
writes.set(decisionFile,text(decisions));
for(const [f,h] of Object.entries(pins))assert.equal(bytes(f),h,'Input changed during preview '+f);
if(!fs.existsSync(manifestFile))fs.writeFileSync(manifestFile,text(pins));
fs.writeFileSync(dir+'/prepared-extraction.json',text(prepared));
fs.writeFileSync(dir+'/incoming-editorial-decision.json',text(incoming));
for(const [f,v] of writes)fs.writeFileSync(dir+'/expected-'+(f===chapterFile?'source':f===extractionFile?'extraction':f===packetFile?'packet':'editorial-decisions')+'.json',v);
const summary={mode:process.argv.includes('--apply')?'apply':'preview',runtime,repo,originalExtractionSemanticHash:semantic(original),reviewer:incoming.reviewer,preservedAppliedRepairs:22,preservedClaimRevisions:4,stats:validated.stats,writes:[...writes].map(([file,v])=>({file,before:pins[file],after:hash(v),bytes:Buffer.byteLength(v)})),limits:['No date approval; source changes stale existing date evidence.','Canonical writes are individually atomic, not a multi-file transaction. Host must retain exclusive idle ownership.']};
fs.writeFileSync(dir+'/preview.json',text(summary));
if(process.argv.includes('--apply')){
 for(const [f,h] of Object.entries(pins))assert.equal(bytes(f),h,'Input changed before apply '+f);
 // Everything above has validated before the first canonical write.
 for(const f of [decisionFile,chapterFile,extractionFile,packetFile])writeTextAtomic(f,writes.get(f));
 fs.writeFileSync(dir+'/applied-receipt.json',text(summary));
}
console.log(text(summary));
