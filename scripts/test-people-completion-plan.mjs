import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { compareCompletionCheckpoints } from './lib/people-completion-plan.mjs';

const hash='sha256:'+'1'.repeat(64);
const seed=()=>({scope:{book:'jinshu',chapter:'053'},personCount:71,
  inputs:{source:hash,extraction:hash,editorial:hash,dateAudit:hash},
  unresolvedPairs:[['a','b'],['a','c']]});
test('finite worklist shrinks without becoming an approval',()=>{
  const a=seed(),b=seed();b.unresolvedPairs.pop();
  const report=compareCompletionCheckpoints(a,b);
  assert.equal(report.state,'identity-work');assert.equal(report.remainingPairs,1);
  assert.deepEqual(report.removedPairs,[['a','c']]);assert.equal(report.diagnosticOnly,true);
  b.unresolvedPairs=[];
  assert.equal(compareCompletionCheckpoints(a,b).state,'ready-for-release-checks');
});
test('new comparisons require reconciliation even when the total count falls',()=>{
  const a=seed(),b=seed();b.unresolvedPairs=[['a','new']];
  const report=compareCompletionCheckpoints(a,b);
  assert.equal(report.state,'replan-required');assert.deepEqual(report.addedPairs,[['a','new']]);
});
test('every source or approval input change invalidates a pinned work order',()=>{
  for(const key of ['source','extraction','editorial','dateAudit']){
    const a=seed(),b=seed();b.inputs[key]='sha256:'+'2'.repeat(64);b.unresolvedPairs=[];
    const r=compareCompletionCheckpoints(a,b);assert.equal(r.state,'replan-required');assert.deepEqual(r.changedInputs,[key]);
  }
});
test('a changed people count cannot be disguised as fewer comparisons',()=>{
  const a=seed(),b=seed();b.personCount=1;b.unresolvedPairs=[];
  assert.equal(compareCompletionCheckpoints(a,b).state,'replan-required');
});
test('empty extractions never demonstrate a nonempty completion',()=>{
  const a=seed();a.personCount=0;a.unresolvedPairs=[];
  assert.equal(compareCompletionCheckpoints(a,a).state,'empty-scope');
});
test('pair order is irrelevant, while duplicates and malformed pairs fail loudly',()=>{
  const a=seed(),b=seed();b.unresolvedPairs=[['c','a'],['b','a']];
  assert.equal(compareCompletionCheckpoints(a,b).addedPairs.length,0);
  for(const pairs of [[['a','a']],[['a','b'],['b','a']],[['a']],[['','b']]]){
    const invalid=seed();invalid.unresolvedPairs=pairs;
    assert.throws(()=>compareCompletionCheckpoints(a,invalid),/pair/i);
  }
});
test('scope and hash mistakes cannot silently reset the finish line',()=>{
  const a=seed(),b=seed();b.scope.chapter='054';assert.throws(()=>compareCompletionCheckpoints(a,b),/different chapter/);
  const c=seed();delete c.inputs.source;assert.throws(()=>compareCompletionCheckpoints(a,c),/source/);
});
test('CLI is read-only and exits nonzero for expanding work',t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'people-completion-test-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const a=path.join(dir,'baseline.json'),b=path.join(dir,'current.json');
  fs.writeFileSync(a,JSON.stringify(seed()));const changed=seed();changed.unresolvedPairs.push(['a','new']);fs.writeFileSync(b,JSON.stringify(changed));
  const before=fs.readFileSync(b,'utf8');
  const result=spawnSync(process.execPath,['scripts/check-people-completion.mjs','--baseline',a,'--current',b],{encoding:'utf8'});
  assert.equal(result.status,1);assert.equal(JSON.parse(result.stdout).state,'replan-required');assert.equal(fs.readFileSync(b,'utf8'),before);
  assert.deepEqual(fs.readdirSync(dir).sort(),['baseline.json','current.json']);
});

test('scope fields require strings rather than regex-coercible JSON values',()=>{
  for(const key of ['book','chapter'])for(const value of [123,[key==='book'?'jinshu':'053']]){
    const invalid=seed();invalid.scope[key]=value;
    assert.throws(()=>compareCompletionCheckpoints(seed(),invalid),/scope/);
  }
});
test('every digest requires a string rather than an array coerced to a digest',()=>{
  for(const key of ['source','extraction','editorial','dateAudit']){
    const invalid=seed();invalid.inputs[key]=[hash];
    assert.throws(()=>compareCompletionCheckpoints(seed(),invalid),new RegExp(key));
  }
});
