import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const dir=path.dirname(fileURLToPath(import.meta.url)), read=f=>JSON.parse(fs.readFileSync(f)), hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const w=read(dir+'/work-order.json');
const head=execFileSync('git',['ls-remote','origin','refs/heads/codex/people-work-queue'],{encoding:'utf8'}).split(/\s/)[0];
const ledger=JSON.parse(execFileSync('git',['show',head+':people-work-queue.json'],{encoding:'utf8',maxBuffer:16*1024*1024}));
const row=ledger.dateAudits[w.book+'/'+w.chapter];
const job=Object.values(row.jobs).find(j=>j.kind==='independent-source-English-coverage'&&j.inputSha256===hash(dir+'/work-order.json'));
assert.ok(job?.agentId && ['running','returned'].includes(job.status));
assert.equal(row.worker,w.owner);assert.equal(row.sourceHash,w.sourceHash);assert.equal(row.extractionHash,w.extractionHash);
assert.ok(!w.excludedAuthorIds.includes(job.agentId));assert.equal(job.inputSha256,hash(dir+'/work-order.json'));
for(const [f,h] of Object.entries(w.sealedFileSha256))assert.equal(hash(f),h,'Sealed file drift '+f);
const reports=[],units=new Set(),pairs=new Set(),repairs=[],holds=[];
for(const p of w.parts){
 const f=path.join(dir,p.partId+'.source-review.json');if(!fs.existsSync(f))continue;
 const src=read(path.join(dir,p.file)),report=read(f);assert.equal(hash(path.join(dir,p.file)),p.sha256);
 assert.deepEqual([report.kind,report.book,report.chapter,report.partId,report.inputSha256,report.sourceHash,report.extractionHash,report.reviewer?.agentId,report.reviewer?.independentOfAuthors],['independent-source-English-review',w.book,w.chapter,p.partId,p.sha256,w.sourceHash,w.extractionHash,job.agentId,true]);
 assert.ok(Number.isFinite(Date.parse(report.completedAt)));assert.deepEqual(report.unitChecks.map(x=>x.unit),p.owned);
 const expected=new Set();
 for(const [i,check] of report.unitChecks.entries()){
  const u=src.units[i];assert.ok(!units.has(u.id));units.add(u.id);
  assert.ok(check.sourceWitness?.trim() && u.zh.includes(check.sourceWitness));assert.ok(check.checkedPropositions?.trim());
  for(const field of ['en','literal']){
   assert.ok(['faithful','repair','hold'].includes(check[field]));
   if(check[field]==='hold'){assert.ok(check.holdReason?.trim());holds.push({unit:u.id,field,reason:check.holdReason});}
   if(check[field]==='repair')expected.add(u.id+'/'+field);
  }
 }
 for(const change of report.repairs){
  const key=change.unit+'/'+change.field,u=src.units.find(x=>x.id===change.unit);
  assert.ok(expected.delete(key)&&!pairs.has(key),'Missing/duplicate field decision '+key);pairs.add(key);
  assert.equal(change.book,w.book);assert.equal(change.chapter,w.chapter);assert.equal(change.before,u[change.field]);assert.ok(change.after?.trim()&&change.after!==change.before);assert.ok(change.sourceWitness?.trim()&&u.zh.includes(change.sourceWitness));assert.ok(change.sourceReason?.trim());repairs.push(change);
 }
 assert.equal(expected.size,0,'Missing exact replacement(s)');reports.push({partId:p.partId,reportSha256:hash(f),units:p.owned.length,fieldProposals:report.repairs.length});
}
assert.ok(reports.length);console.log(JSON.stringify({queueCommit:head,reviewer:job.agentId,reports,units:units.size,totalUnits:w.sourceUnits,repairs:repairs.length,holds:holds.length,fullScopeCovered:units.size===w.sourceUnits,independentlyApprovedReplacements:0}));
