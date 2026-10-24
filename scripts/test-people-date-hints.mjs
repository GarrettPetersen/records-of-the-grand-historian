import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {normalizeWesternDateHint,normalizeExtractionDateHints} from './lib/people-date-hints.mjs';
import {runDateHintNormalization} from './normalize-people-date-hints.mjs';

test('existing Western years and ranges retain endpoints and qualifiers',()=>{
  for(const [before,after] of [
    ['682 BC','BC 682'],['682–650 BC','BC 682–BC 650'],['682 - 650 BC','BC 682 - BC 650'],
    ['c. 682 BC','c. BC 682'],['before 682 BC','before BC 682'],['20 AD','AD 20'],
    ['2 BC–1 AD','BC 2–AD 1'],['BC 2–1 AD','BC 2–AD 1'],['AD 1–2 BC','AD 1–BC 2'],
    ['682 BC or 650 BC','BC 682 or BC 650'],['approximately 20—30 AD','approximately AD 20—AD 30'],
    ['earlier: 682 BC','earlier: BC 682'],['c. 682 BC','c. BC 682'],
  ]){assert.equal(normalizeWesternDateHint(before),after,before);assert.equal(normalizeWesternDateHint(after),after);}
});
test('canonical, unresolved and unsupported chronology is not guessed',()=>{
  for(const hint of ['BC 682','AD 20–AD 30','research required: regnal year one','legendary antiquity','44 BCE','20 CE','0 BC','-44 BC','- 44 BC','10000 BC','AD 44 BC','0 – 44 BC','12.5 BC','12 . 5 BC','682/681 BC','682 / 681 BC','682⁄681 BC','682／681 BC','682∕681 BC','12．5 BC','12٫5 BC','1 234 BC','682·681 BC','682~681 BC','１／681 BC','1,234 BC','3:40 AD','1–2–3 BC','44–0 BC','died Xinghe 3 AD 541','Hongwu 1–4 AD 1368'])assert.equal(normalizeWesternDateHint(hint),hint,hint);
  assert.throws(()=>normalizeWesternDateHint(null),/strings/);
});
function fixture(){return {schemaVersion:1,book:'fixture',chapter:'001',people:[{localId:'p001',identityHints:{activeDateHints:['682 BC','AD 20']}}],claims:[{value:{event:'682 BC',westernYear:{era:'BC',year:682}}}]};}
test('only hint strings change in expanded and compact extractions',()=>{
  for(const compact of [false,true]){
    const e=fixture();if(compact){e.schemaVersion=2;e.people=[['p001',['Jia'], 'historical','Official',{a:['682 BC','AD 20']}]];}
    const saved=structuredClone(e),{candidate,changes}=normalizeExtractionDateHints(e);
    assert.deepEqual(e,saved);assert.deepEqual(candidate.claims,e.claims);assert.equal(changes.length,1);
    const restored=structuredClone(candidate);if(compact)restored.people[0][4].a[0]='682 BC';else restored.people[0].identityHints.activeDateHints[0]='682 BC';
    assert.deepEqual(restored,e);assert.equal(normalizeExtractionDateHints(candidate).changes.length,0);
  }
  assert.throws(()=>normalizeExtractionDateHints({schemaVersion:3,people:[]}),/schema/);
  assert.throws(()=>normalizeExtractionDateHints({schemaVersion:1,people:[{}]}),/array/);
});
test('normalization fails closed when an external-primary witness links the hint',()=>{
  for(const compact of [false,true]){
    const e=fixture();
    if(compact){e.schemaVersion=2;e.people=[['p001',['Jia'],'historical','Official',{a:['682 BC'],e:[{hint:'682 BC'}]}]];}
    else e.people[0].identityHints.externalPrimaryChronology=[{hint:'682 BC'}];
    const original=structuredClone(e);
    assert.throws(()=>normalizeExtractionDateHints(e),/external-primary chronology/);
    assert.deepEqual(e,original);
  }
});
test('CLI previews, checks, applies with receipts, and is idempotent',t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'people-date-hints-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const file=path.join(dir,'input.json'),receipt=path.join(dir,'receipt.json');fs.writeFileSync(file,JSON.stringify(fixture()));const original=fs.readFileSync(file,'utf8');
  assert.equal(runDateHintNormalization(['--file',file]),0);assert.equal(fs.readFileSync(file,'utf8'),original);
  assert.equal(runDateHintNormalization(['--file',file,'--check']),1);
  assert.throws(()=>runDateHintNormalization(['--file',file,'--apply']),/receipt/);
  assert.equal(fs.readFileSync(file,'utf8'),original);
  assert.equal(runDateHintNormalization(['--file',file,'--apply','--receipt',receipt]),0);
  assert.equal(JSON.parse(fs.readFileSync(file)).people[0].identityHints.activeDateHints[0],'BC 682');
  const saved=JSON.parse(fs.readFileSync(receipt));assert.equal(saved.hints,1);assert.equal(saved.entries[0].changes[0].before,'682 BC');
  assert.match(saved.entries[0].candidateSemanticHash,/^sha256:[0-9a-f]{64}$/u);
  const receiptBytes=fs.readFileSync(receipt,'utf8');
  assert.equal(runDateHintNormalization(['--file',file,'--check']),0);
  assert.throws(()=>runDateHintNormalization(['--file',file,'--receipt',receipt]),/already exists/);
  assert.equal(fs.readFileSync(receipt,'utf8'),receiptBytes);
  assert.throws(()=>runDateHintNormalization(['--file',file,'--all']),/Select/);
  assert.throws(()=>runDateHintNormalization(['--book','../escape','--chapter','001']),/Invalid/);
});
test('concurrent receipt writers cannot replace one another',async t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'people-date-hints-race-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const file=path.join(dir,'input.json'),receipt=path.join(dir,'receipt.json');
  fs.writeFileSync(file,JSON.stringify(fixture()));
  const script=fileURLToPath(new URL('./normalize-people-date-hints.mjs',import.meta.url));
  const invoke=()=>new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[script,'--file',file,'--receipt',receipt],{stdio:['ignore','pipe','pipe']});
    let stderr='';child.stderr.on('data',chunk=>{stderr+=chunk;});
    child.on('error',reject);child.on('close',status=>resolve({status,stderr}));
  });
  const outcomes=await Promise.all([invoke(),invoke()]);
  assert.deepEqual(outcomes.map(item=>item.status).sort(),[0,1]);
  assert.match(outcomes.find(item=>item.status===1).stderr,/Receipt already exists/);
  const result=JSON.parse(fs.readFileSync(receipt,'utf8'));
  assert.equal(result.hints,1);
  assert.equal(JSON.parse(fs.readFileSync(file,'utf8')).people[0].identityHints.activeDateHints[0],'682 BC');
});
