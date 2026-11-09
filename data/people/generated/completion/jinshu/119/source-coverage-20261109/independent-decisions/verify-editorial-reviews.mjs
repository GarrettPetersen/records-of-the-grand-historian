import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {buildPeopleExtractionPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
import {getPeopleSchemaValidator} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-schema.mjs';
import {editorialDecisionSeed,proposalSetFingerprint,validateEditorialDecisionDocument,validateEditorialDecisions,validateAppliedEditorialDecisions,mergeEditorialDecisionReview} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=file=>JSON.parse(fs.readFileSync(file));
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const order=read(dir+'/work-order.json'),srcOrder=read(dir+'/../work-order.json');
const sourceJob=read(dir+'/../source-coverage-receipt.json');
for(const [file,pin] of Object.entries(srcOrder.sealedFileSha256))assert.equal(hash(file),pin,file);
assert.equal(hash(dir+'/candidate.compact.json'),order.candidateSha256);
assert.equal(hash(dir+'/proposal-contracts.json'),order.contractSha256);
assert.equal(hash(dir+'/../source-coverage-receipt.json'),order.sourceReviewReceiptSha256);
const head=execFileSync('git',['ls-remote','origin','refs/heads/codex/people-work-queue'],{encoding:'utf8'}).split(/\s/)[0];
const ledger=JSON.parse(execFileSync('git',['show',head+':people-work-queue.json'],{maxBuffer:32*1024*1024}));
const row=ledger.dateAudits['jinshu/119'];
const job=Object.values(row.jobs).find(job=>job.kind==='independent-editorial-decisions'&&job.inputSha256===hash(dir+'/work-order.json'));
assert.equal(row.worker,order.owner);assert.equal(row.sourceHash,order.sourceHash);assert.equal(row.extractionHash,order.extractionHash);
assert.ok(['running','returned'].includes(job?.status));assert.ok(job.agentId&&!order.authorExclusions.includes(job.agentId));assert.notEqual(job.agentId,sourceJob.reviewer);
const packet=buildPeopleExtractionPacket('jinshu','119',{chapterData:read('data/jinshu/119.json')});
const candidate=validateCompactPeopleExtraction(read(dir+'/candidate.compact.json'),packet,{strictAliasDispositions:true}).normalized;
const seed=editorialDecisionSeed(candidate),history=read('data/people/editorial-decisions/jinshu/119.json');
assert.deepEqual(seed.proposals,read(dir+'/proposal-contracts.json').proposals);
validateAppliedEditorialDecisions(history,candidate);
const decisionById=new Map(),reports=[],seenSupplementals=new Set(),supplementalRepairs=[],findings=[];
const lists={claimRevisions:[],claimAdditions:[],claimRetractions:[]};
for(const part of order.parts){
 const input=read(dir+'/'+part.file);assert.equal(hash(dir+'/'+part.file),part.sha256);
 const original=dir+'/'+input.partId+'.editorial-review.json';
 if(!fs.existsSync(original))continue;
 const second=dir+'/'+input.partId+'.editorial-review.v2.json';
 const file=fs.existsSync(second)?second:original;
 const report=read(file);assert.deepEqual([report.book,report.chapter,report.partId,report.inputSha256,report.agentId],['jinshu','119',input.partId,part.sha256,job.agentId]);
 assert.ok(Number.isFinite(Date.parse(report.completedAt)));
 const proposals=seed.proposals.filter(p=>part.proposalIds.includes(p.id));
 assert.deepEqual(report.decisions.map(d=>d.repairId).sort(),[...part.proposalIds].sort());
 for(const d of report.decisions){
  const p=proposals.find(p=>p.id===d.repairId),unit=input.units.find(u=>u.id===p.unit.id);
  assert.ok(!decisionById.has(d.repairId));decisionById.set(d.repairId,d);
  assert.ok(d.reason.trim().length>=20);assert.equal(d.sourceWitness.source,'chapter-text');assert.ok(d.sourceWitness.citation.includes(unit.id));assert.ok(d.sourceWitness.excerpt.trim()&&unit.zh.includes(d.sourceWitness.excerpt));
 }
 const reviewer={kind:'codex',name:'Independent Jinshu 119 editorial reviewer',agentId:job.agentId,model:null,runId:null,completedAt:report.completedAt};
 const partDocument={...seed,reviewer,proposals,input:{...seed.input,proposalsFingerprint:proposalSetFingerprint(proposals)},decisions:report.decisions};
 for(const k in lists){partDocument[k]=report[k];lists[k].push(...report[k]);}
 validateEditorialDecisionDocument(partDocument);
 const schema=getPeopleSchemaValidator().getSchema('https://24histories.com/schema/people/extraction-v1.json#/$defs/claim');
 assert.ok(schema);
 for(const claim of [...report.claimRevisions.map(r=>r.after),...report.claimAdditions.map(r=>r.claim)])assert.ok(schema(claim),claim.id+' '+JSON.stringify(schema.errors));
 for(const s of report.supplementalRepairs){
  const u=input.units.find(u=>u.id===(s.unitId??s.unit));assert.ok(u);const field=s.field==='idiomatic'?'en':s.field;
  assert.equal(u[field],s.before);assert.ok(s.after?.trim()&&s.after!==s.before&&u.zh.includes(s.sourceWitness.excerpt));assert.ok(s.reason.trim().length);
  const key=u.id+'/'+field;assert.ok(!seenSupplementals.has(key),key);seenSupplementals.add(key);supplementalRepairs.push(s);
 }
 findings.push(...report.attributionFindings);
 reports.push({partId:input.partId,file:path.basename(file),sha256:hash(file),originalSha256:hash(original),decisions:report.decisions.length,completedAt:report.completedAt});
}
const full=decisionById.size===seed.proposals.length;
const result={queueCommit:head,agentId:job.agentId,reports,decisions:decisionById.size,full,approvals:{accept:0,revise:0,reject:0},supplementalRepairs:supplementalRepairs.length,attributionFindings:findings.length};
for(const d of decisionById.values())result.approvals[d.decision]++;
if(full){
 const reviewer={kind:'codex',name:'Independent Jinshu 119 editorial reviewer',agentId:job.agentId,model:null,runId:null,completedAt:new Date(Math.max(...reports.map(r=>Date.parse(r.completedAt)))).toISOString()};
 const document={...seed,...lists,reviewer,decisions:seed.proposals.map(p=>decisionById.get(p.id))};
 validateEditorialDecisions(document,candidate,packet);
 const merged=mergeEditorialDecisionReview(history,document);validateEditorialDecisions(merged,candidate,packet);
 validateAppliedEditorialDecisions(merged,candidate);
 if(process.argv.includes('--seal')){
  for(const [name,data] of Object.entries({'validated-review.json':document,'merged-editorial-history.json':merged,'residual-findings.json':{supplementalRepairs,attributionFindings:findings}})){
   const file=dir+'/'+name; if(fs.existsSync(file))assert.deepEqual(read(file),data);else fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n',{flag:'wx'});
  }
 }
}
console.log(JSON.stringify(result));
