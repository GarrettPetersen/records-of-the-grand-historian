import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Exercise the real queue mutator against a temporary local-only origin.  The
// runner's production callbacks are extracted from source so this test covers
// the exact scheduler and startup code rather than a reimplementation of it.
const root=fs.mkdtempSync(path.join(os.tmpdir(),'people-date-ownership-test-'));
after(()=>fs.rmSync(root,{recursive:true,force:true}));
const remote=path.join(root,'remote.git');
// Neither the fixture Git commands nor the queue adapter may inherit Git
// repository, configuration, hook, transport, or alternate-object overrides.
for(const name of Object.keys(process.env))if(name.startsWith('GIT_'))delete process.env[name];
function git(...args) {
  const result=spawnSync('git',args,{cwd:root,encoding:'utf8',env:{...process.env,GIT_TERMINAL_PROMPT:'0',GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null'}});
  if(result.error)throw result.error;
  if(result.status!==0)throw new Error(`Local Git fixture failed: ${result.stderr}`);
}
git('init','--quiet','--bare',remote);
git('init','--quiet',root);
git('remote','add','origin',remote);
fs.mkdirSync(path.join(root,'data','people'),{recursive:true});
fs.writeFileSync(path.join(root,'data','people','config.json'),JSON.stringify({schemaVersion:1}));
process.env.PEOPLE_REPO_ROOT=root;
process.env.GIT_TERMINAL_PROMPT='0';
process.env.GIT_CONFIG_NOSYSTEM='1';
process.env.GIT_CONFIG_GLOBAL='/dev/null';
const {mutateRemotePeopleWorkLedger,readRemotePeopleWorkLedger,dateExecutorIsBusy,claimIsActive,reservePeopleTargetsInLedger}=await import('./lib/people-work-queue.mjs');
const source=fs.readFileSync(fileURLToPath(new URL('./run-people-date-workflow.mjs',import.meta.url)),'utf8');
const marker='const reserved=mutateRemotePeopleWorkLedger(ledger=>{';
const start=source.indexOf(marker);
const end=source.indexOf('},{message:`Reserve date audit ${key}`}).result;',start);
assert.ok(start>=0 && end>start,'production reservation callback anchors must be present');
assert.equal(source.indexOf(marker,start+1),-1,'reservation callback must be unambiguous');
const body=source.slice(start+marker.length,end);
const makeCallback=new Function('o','key','target','packet','executorToken','leaseMs','dateExecutorIsBusy','claimIsActive','fs','path','os','dateWorkflowDirectory','readJson',`return ledger=>{${body}}`);
const reconcileMarker='mutateRemotePeopleWorkLedger(ledger=>{';
const reconcileStart=source.indexOf(reconcileMarker,source.indexOf('// Recover a completed host publication'));
const reconcileEnd=source.indexOf("},{message:'Reconcile completed date publications'});",reconcileStart);
assert.ok(reconcileStart>=0 && reconcileEnd>reconcileStart,'production startup callback anchors must be present');
const reconcileBody=source.slice(reconcileStart+reconcileMarker.length,reconcileEnd);
const makeReconcile=new Function('o','executorToken','dateExecutorIsBusy','os','fs','path','PEOPLE_DIR','dateAuditStatus','buildDateAuditPacket','readJson',`return ledger=>{${reconcileBody}}`);
const key='jinshu/127', target={book:'jinshu',chapter:'127'}, h1='sha256:'+'1'.repeat(64),h2='sha256:'+'2'.repeat(64);
const prior=(overrides={})=>({worker:'owner',lane:'openrouter',status:'stale-source',sourceHash:h1,extractionHash:h1,jobs:{retained:{agentId:'must-preserve'}},reviewPlans:{},...overrides});
const options={worker:'owner',lane:'openrouter',takeover:false,release:false,'retry-blocked':false};
const packet={sourceHash:h1,extractionHash:h1};
const workflow=path.join(root,'workflow');
const callback=(overrides={},packetOverrides={})=>makeCallback({...options,...overrides},key,target,{...packet,...packetOverrides},'test-token',3600000,dateExecutorIsBusy,claimIsActive,fs,path,os,()=>workflow,p=>JSON.parse(fs.readFileSync(p,'utf8')));
const reconcile=()=>makeReconcile(options,'test-token',dateExecutorIsBusy,os,{existsSync:()=>true},path,root,()=>({status:'audited'}),()=>packet,()=>({proposal:{extractionHash:h1}}));
const read=()=>readRemotePeopleWorkLedger();
const save=claim=>mutateRemotePeopleWorkLedger(l=>{l.claims={};l.dateAudits={[key]:structuredClone(claim)};delete l.dateAuditHistory;});
const run=cb=>mutateRemotePeopleWorkLedger(cb).result;

test('other worker cannot take stale-source, even after lease expiry',()=>{
  const claim=prior(); save(claim);
  assert.equal(run(callback({worker:'intruder'})),null);
  const actual=read();assert.deepEqual(actual.dateAudits[key],claim);assert.equal(actual.dateAuditHistory,undefined);
});
test('other lane cannot take stale-source with same worker',()=>{
  const claim=prior();save(claim);assert.equal(run(callback({lane:'manual'})),null);
  assert.deepEqual(read().dateAudits[key],claim);
});
test('changed stale-source fingerprint remains untouched even with retained publish phase',()=>{
  fs.mkdirSync(workflow,{recursive:true});fs.writeFileSync(path.join(workflow,'state.json'),JSON.stringify({phase:'publish'}));
  const claim=prior();save(claim);
  assert.throws(()=>run(callback({}, {sourceHash:h2})),/Sticky date work .* changed/);
  assert.deepEqual(read().dateAudits[key],claim);assert.equal(read().dateAuditHistory,undefined);
});
test('ready claim is archived and may be reassigned with fresh fingerprint and no old jobs',()=>{
  const claim=prior({status:'ready'});save(claim);
  const result=run(callback({worker:'new-owner',lane:'manual'},{sourceHash:h2}));
  assert.equal(result.worker,'new-owner');assert.equal(result.lane,'manual');assert.equal(result.sourceHash,h2);assert.deepEqual(result.jobs,{});
  assert.deepEqual(read().dateAuditHistory[key],[claim]);
});
test('unexpired lease blocks same-owner resume without takeover',()=>{
  const claim=prior({executorToken:'live-token',executorHost:os.hostname(),executorExpiresAt:new Date(Date.now()+3600000).toISOString()});save(claim);
  assert.equal(run(callback()),null);assert.deepEqual(read().dateAudits[key],claim);
});
test('same-owner unchanged stale-source resumes without dropping retained jobs',()=>{
  const claim=prior();save(claim);const result=run(callback());
  assert.equal(result.worker,'owner');assert.equal(result.status,'active');assert.deepEqual(result.jobs,claim.jobs);assert.equal(result.sourceHash,h1);
});
for(const status of ['stale-source','active','research-blocked'])test(`extraction claim blocked while date work is ${status}`,()=>{
  const claim=prior({status});save(claim);
  const result=mutateRemotePeopleWorkLedger(ledger=>reservePeopleTargetsInLedger(ledger,[{...target,chapterFingerprint:h1}],{lane:'cursor-sdk',worker:'extractor',limit:1})).result;
  assert.equal(result.claimed.length,0);assert.equal(result.blocked.length,1);
  assert.deepEqual(read().dateAudits[key],claim);assert.equal(read().claims[key],undefined);
});
test('ready date audit does not block extraction claim',()=>{
  const claim=prior({status:'ready'});save(claim);
  const result=mutateRemotePeopleWorkLedger(ledger=>reservePeopleTargetsInLedger(ledger,[{...target,chapterFingerprint:h1}],{lane:'cursor-sdk',worker:'extractor',limit:1})).result;
  assert.equal(result.claimed.length,1);assert.equal(result.blocked.length,0);
  assert.deepEqual(read().dateAudits[key],claim);assert.equal(read().claims[key].worker,'extractor');
});
test('startup reconciliation preserves stale-source even with an audited matching report',()=>{
  const claim=prior();save(claim);run(reconcile());assert.deepEqual(read().dateAudits[key],claim);
});
test('startup reconciliation still marks completed active work ready',()=>{
  const claim=prior({status:'active'});save(claim);run(reconcile());const result=read().dateAudits[key];
  assert.equal(result.status,'ready');assert.deepEqual(result.jobs,claim.jobs);
});
test('startup reconciliation respects an active executor lease',()=>{
  const claim=prior({status:'active',executorToken:'live-token',executorHost:os.hostname(),executorExpiresAt:new Date(Date.now()+3600000).toISOString()});
  save(claim);run(reconcile());assert.deepEqual(read().dateAudits[key],claim);
});
