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
test('CLI normalizes shared-era bounds with a receipt while retaining chronology and evidence', t => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'people-bound-hints-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const file=path.join(dir,'input.json'),receipt=path.join(dir,'receipt.json');
  const input=fixture();
  input.people[0].identityHints.activeDateHints=['AD onOrAfter 318 onOrBefore 320 (existing source bounds)'];
  const before=JSON.stringify(input);fs.writeFileSync(file,before);
  assert.equal(runDateHintNormalization(['--file',file]),0);
  assert.equal(fs.readFileSync(file,'utf8'),before);
  assert.equal(runDateHintNormalization(['--file',file,'--apply','--receipt',receipt]),0);
  const result=JSON.parse(fs.readFileSync(file));
  assert.deepEqual(result.claims,input.claims);
  assert.deepEqual(result.people[0].identityHints.activeDateHints,['on or after AD 318 and on or before AD 320 (existing source bounds)']);
  assert.equal(JSON.parse(fs.readFileSync(receipt)).hints,1);
  assert.equal(runDateHintNormalization(['--file',file,'--check']),0);
});


test('exact prefixed bounds preserve era, year, direction and source context',()=>{
  for(const era of ['AD','BC']) for(const [label,canonical] of [
    ['onOrAfter','on or after'],['onOrBefore','on or before'],['before','before'],['after','after'],
  ]) for(const suffix of ['', ' (after Yongjia 1)', ' (source states 太康元年)']) {
    const before=`${era} ${label} 307${suffix}`, after=`${canonical} ${era} 307${suffix}`;
    assert.equal(normalizeWesternDateHint(before),after);
    assert.equal(normalizeWesternDateHint(after),after);
  }
  assert.equal(normalizeWesternDateHint('AD\tbefore 1 (Yongjia 1)'), 'before\tAD 1 (Yongjia 1)');
  assert.equal(normalizeWesternDateHint('BC onOrAfter 9999'), 'on or after BC 9999');
});

test('unsupported prefixed bounds are left wholly unchanged',()=>{
  for(const hint of [
    'AD onOrAfter 0','AD onOrAfter -307','AD onOrAfter +307','AD onOrAfter 0307',
    'AD onOrAfter 10000','AD onOrAfter 307.5','AD onOrAfter 3,007','AD onOrAfter 3/7',
    'AD onOrAfter 307–308','AD onOrAfter 307 to 308','AD onOrAfter 307 BC',
    'AD onOrAfter 307 AD','BC before AD 307','AD onOrAfter 307 (BC 20)',
    'AD onOrAfter 307 (20 BC)','AD onOrAfter 307 (20 BCE)',
    'AD onOrAfter 307 or 308','AD onOrAfter 307 approximately',
    'AD onOrAfter 307 (after Yongjia 1) trailing','AD onOrAfter 307 ((context))',
    'AD onOrAfter 307 (','AD onOrAfter 307 ()','AD onOrAfter 307\n',
    'AD onOrAfter 307 (20 BC) and 10 BC','AD onOrAfter 0 (20 BC)',
    'AD approximately 307','AD onOrDuring 307','AD OnOrAfter 307',
  ]) assert.equal(normalizeWesternDateHint(hint),hint,hint);
});

test('bound normalization changes only hints in either schema and records exact changes',()=>{
  for(const compact of [false,true]) {
    const before='BC onOrBefore 307 (after Yongjia 1)';
    const e={schemaVersion:compact?2:1,people:compact?
      [['p001',['Jia'],'historical','Official',{a:[before,'research required: calendar'],custom:{text:before}}]]:
      [{localId:'p001',identityHints:{activeDateHints:[before,'research required: calendar'],custom:{text:before}}}],
      claims:[['p001','attestation',{event:before,westernBounds:{onOrBefore:{era:'BC',year:307}}},'explicit',['s001']]],
      evidence:{text:before}};
    const original=structuredClone(e),{candidate,changes}=normalizeExtractionDateHints(e);
    assert.deepEqual(e,original);
    assert.deepEqual(changes,[{personId:'p001',index:0,before,after:'on or before BC 307 (after Yongjia 1)'}]);
    const restored=structuredClone(candidate);
    if(compact)restored.people[0][4].a[0]=before;
    else restored.people[0].identityHints.activeDateHints[0]=before;
    assert.deepEqual(restored,original);
    assert.deepEqual(normalizeExtractionDateHints(candidate),{candidate,changes:[]});
  }
});

test('bound normalization refuses externally sealed chronology without changing input',()=>{
  for(const compact of [false,true]) {
    const hint='AD onOrAfter 307 (after Yongjia 1)', record={hint,sourceHash:'sealed'};
    const e={schemaVersion:compact?2:1,people:compact?
      [['p001',[], 'historical','Official',{a:[hint],e:[record]}]]:
      [{localId:'p001',identityHints:{activeDateHints:[hint],externalPrimaryChronology:[record]}}]};
    const original=structuredClone(e);
    assert.throws(()=>normalizeExtractionDateHints(e),/external-primary chronology/);
    assert.deepEqual(e,original);
  }
});

test('shared-era paired bounds preserve direction, years, source context and era order',()=>{
  for(const [era,lower,upper] of [['AD',318,320],['BC',320,318]]) {
    for(const [lo,ltext] of [['onOrAfter','on or after'],['after','after']])
    for(const [hi,htext] of [['onOrBefore','on or before'],['before','before']]) {
      const before=`${era} ${lo} ${lower} ${hi} ${upper} (after Jianxing 6, before Taixing 3)`;
      const after=`${ltext} ${era} ${lower} and ${htext} ${era} ${upper} (after Jianxing 6, before Taixing 3)`;
      assert.equal(normalizeWesternDateHint(before),after);
      assert.equal(normalizeWesternDateHint(after),after);
    }
    assert.equal(normalizeWesternDateHint(`${era} onOrAfter 318 onOrBefore 318`),`on or after ${era} 318 and on or before ${era} 318`);
  }
});

test('reversed, impossible, malformed and ambiguous bound pairs remain wholly unchanged',()=>{
  for(const era of ['AD','BC']) {
    for(const [lo,hi] of [['after','before'],['after','onOrBefore'],['onOrAfter','before']]) {
      const hint=`${era} ${lo} 318 ${hi} 318`;
      assert.equal(normalizeWesternDateHint(hint),hint);
    }
    for(const rest of ['onOrAfter 0 onOrBefore 320','onOrAfter -318 onOrBefore 320',
      'onOrAfter 0318 onOrBefore 320','onOrAfter 318 onOrBefore 10000',
      'onOrAfter 318.5 onOrBefore 320','onOrAfter 318 onOrBefore 320.5',
      'onOrAfter 318 onOrBefore AD 320','onOrAfter 318 BC onOrBefore 320',
      'onOrAfter 318 onOrBefore 320 AD','onOrAfter 318 onOrBefore 320 (320 ad)',
      'onOrAfter 318 onOrBefore 320 approx','onOrAfter 318 approximately onOrBefore 320',
      'onOrAfter 318 onOrBefore 320 ((context))','onOrAfter 318 onOrBefore 320 (context) trailing',
      'onOrBefore 318 onOrAfter 320','onOrAfter 318 onOrAfter 320',
      'onOrAfter 318–319 onOrBefore 320','onOrAfter 318 onOrBefore 320 onOrBefore 321']) {
      const hint=`${era} ${rest}`;assert.equal(normalizeWesternDateHint(hint),hint,hint);
    }
  }
  for(const hint of ['AD onOrAfter 320 onOrBefore 318','BC onOrAfter 318 onOrBefore 320','AD after 318 before 319','BC after 320 before 319'])assert.equal(normalizeWesternDateHint(hint),hint);
});

test('paired bounds change only hint strings and retain external-primary refusal',()=>{
  const e=fixture();
  const before='AD onOrAfter 318 onOrBefore 320 (Jianxing 6 to Taixing 3)';
  e.people[0].identityHints.activeDateHints=[before];
  const saved=structuredClone(e),{candidate,changes}=normalizeExtractionDateHints(e);
  assert.deepEqual(e,saved);assert.deepEqual(candidate.claims,e.claims);
  assert.deepEqual(changes,[{personId:'p001',index:0,before,after:'on or after AD 318 and on or before AD 320 (Jianxing 6 to Taixing 3)'}]);
  candidate.people[0].identityHints.activeDateHints=[before];assert.deepEqual(candidate,e);
  e.people[0].identityHints.externalPrimaryChronology=[{hint:before}];
  assert.throws(()=>normalizeExtractionDateHints(e),/external-primary chronology/);
});
