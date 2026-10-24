import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateKeyPairSync,randomUUID,sign} from 'node:crypto';
import {DateArtifactTransport,admitDateTask,closeDateTask,createDateMcpWorker,digest} from './draft/scripts/lib/grokbot-date-transport.mjs';
import {createTypedGrokbotBridge} from './draft/scripts/lib/grokbot-typed-bridge.mjs';
import {createDateWorkerPool} from './draft/scripts/lib/people-date-concurrency.mjs';
import {toolArguments} from './draft/scripts/grokbot-mcp-client.mjs';
import {createGrokbotMcpServer} from './draft/scripts/grokbot-mcp-server.mjs';
import {Client} from '@modelcontextprotocol/client';

const here=path.dirname(fileURLToPath(import.meta.url));
fs.mkdirSync(path.join(here,'test-runs'),{recursive:true});
const {privateKey,publicKey}=generateKeyPairSync('ed25519');
const claimSecret='offline-test-only-claim-key-not-a-credential';
const hash=n=>`sha256:${String(n).repeat(64)}`;
function admission(overrides={}) {
  const a={version:1,admissionId:randomUUID(),hostSessionId:'host-test',queueWorker:'grok-dates-test',generationId:'generation-1',book:'jinshu',chapter:'053',jobKey:'audit-0-test',jobId:'job1',phase:'audit',artifactType:'date-review',worker:'grokbot-test',contextId:'independent-context',extractorContextIds:['extractor-context'],repairContextIds:['repair-context'],sourceHash:hash('a'),extractionHash:hash('b'),maxBytes:16384,expiresAt:new Date(Date.now()+60000).toISOString(),input:{id:'job1',sourceHash:hash('a'),extractionHash:hash('b'),ownedUnits:['s0001'],units:[{id:'s0001',zh:'某卒。'}]},...overrides};
  a.packetHash=digest(a.input);a.phaseHash=digest({phase:a.phase,artifactType:a.artifactType,jobKey:a.jobKey,jobId:a.jobId});return a;
}
function setup(a=admission()) {
  const root=fs.mkdtempSync(path.join(here,'test-runs','case-'));
  admitDateTask({root,admission:a,privateKey});
  const dates=new DateArtifactTransport({root,publicKey,claimSecret});
  const args={type:'date',worker:a.worker,contextId:a.contextId,admissionId:a.admissionId};
  const token=dates.resume(args).claimToken;
  return {a,root,dates,args,token};
}
function envelope(a,patch={}) {
  const identity={name:'Offline fixture reviewer',agentId:a.contextId};
  return {type:a.artifactType,generationId:a.generationId,worker:a.worker,contextId:a.contextId,phase:a.phase,packetHash:a.packetHash,phaseHash:a.phaseHash,result:a.phase==='repair'?{sourceHash:a.sourceHash,extractionHash:a.extractionHash,author:identity,changes:[]}:{jobId:a.jobId,sourceHash:a.sourceHash,extractionHash:a.extractionHash,reviewer:{...identity,independentOfExtractor:true},reviewedUnits:['s0001'],itemChecks:[],personChecks:[],findings:[]},...patch};
}
const submit=(f,artifact=envelope(f.a))=>f.dates.submit({claimToken:f.token,chunkId:f.a.admissionId,artifact});
test('capture/get/finalize only; no date approval or publication',()=>{
  const f=setup();assert.deepEqual(f.dates.get({claimToken:f.token,chunkId:f.a.admissionId}).input,f.a.input);
  assert.equal(submit(f).approved,false);assert.equal(submit(f).captured,true);
  assert.deepEqual(Object.values(f.dates.finalize({claimToken:f.token})).includes(true),true);
  assert.equal(f.dates.finalize({claimToken:f.token}).published,false);
  assert.equal(f.dates.status(f.args).approved,false);
});
test('exact admission only: wrong worker/context/missing job never calls allocator',()=>{
  const f=setup();let allocations=0;const bridge=createTypedGrokbotBridge({dates:()=>f.dates,extraction:()=>{allocations++;throw Error('allocation');}});
  for(const patch of [{worker:'grokbot-other'},{contextId:'other'},{admissionId:randomUUID()}])assert.throws(()=>bridge.resumeOrClaim({...f.args,...patch}));
  assert.equal(allocations,0);assert.equal(bridge.resumeOrClaim(f.args).claimToken,f.token);
});
test('reviewer exclusions are mandatory and reject repair/extractor self-review',()=>{
  for(const contextId of ['extractor-context','repair-context'])assert.throws(()=>setup(admission({contextId})),/Reviewer context/);
  assert.throws(()=>setup(admission({extractorContextIds:undefined})),/exclusions/);
});
test('mixed or unsupported typed operations rejected; date token cannot reach extraction',()=>{
  const f=setup();let oldCalls=0;const bridge=createTypedGrokbotBridge({dates:()=>f.dates,extraction:()=>{oldCalls++;return {};}});
  assert.throws(()=>bridge.resumeOrClaim({...f.args,book:'jinshu',chapter:'053'}),/Mixed/);
  assert.throws(()=>bridge.submitChunk({type:'date',claimToken:f.token,chunkId:f.a.admissionId,artifact:envelope(f.a),extraction:{}}),/Mixed/);
  assert.throws(()=>bridge.getChunk({claimToken:f.token,chunkId:f.a.admissionId}),/explicit date/);
  assert.throws(()=>bridge.status({type:'editorial',worker:'grokbot-test'}),/Unsupported/);assert.equal(oldCalls,0);
});
test('existing extraction calls retain original arguments and behavior',()=>{
  const calls=[];const old=Object.fromEntries(['resumeOrClaim','getChunk','submitChunk','finalizeChapter','status'].map(k=>[k,args=>{calls.push([k,args]);return {existing:k};}]));
  const bridge=createTypedGrokbotBridge({extraction:()=>old,dates:()=>{throw Error('unexpected date');}});
  const rows=[['resumeOrClaim',{worker:'grokbot-old',book:'jinshu',chapter:'054'}],['getChunk',{claimToken:'old-signed-token',chunkId:'001'}],['submitChunk',{claimToken:'old-signed-token',chunkId:'001',extraction:{schemaVersion:1}}],['finalizeChapter',{claimToken:'old-signed-token'}],['status',{worker:'grokbot-old'}]];
  for(const[k,args]of rows){assert.equal(bridge[k](args).existing,k);assert.equal(bridge[k]({type:'extraction',...args}).existing,k);}assert.equal(calls.length,10);
  for(let i=0;i<rows.length;i++)assert.deepEqual(calls[i*2+1],rows[i]);
});
test('wrong envelope phase/generation/hash/worker/context is captured then rejected',()=>{
  const f=setup();for(const patch of [{phase:'repair'},{generationId:'another-generation'},{worker:'grokbot-other'},{contextId:'other-context'},{packetHash:hash('c')},{phaseHash:hash('d')},{type:'extraction'}])assert.throws(()=>submit(f,envelope(f.a,patch)),/Wrong/);
  const dir=path.join(f.root,f.a.admissionId);assert.equal(fs.readdirSync(dir).filter(n=>n.startsWith('capture-')).length,7);assert.equal(fs.existsSync(path.join(dir,'result.json')),false);
});
test('wrong result identity/role/hash and mixed identities reject before capture acceptance',()=>{
  const f=setup();for(const change of [r=>r.reviewer.agentId='repair-context',r=>r.reviewer.independentOfExtractor=false,r=>r.sourceHash=hash('c'),r=>r.jobId='different-job',r=>r.author={name:'x',agentId:f.a.contextId}]){const a=envelope(f.a);change(a.result);assert.throws(()=>submit(f,a));}
});
test('tampered source packet, scope or signature cannot be served',()=>{
  for(const mutate of [d=>d.payload.input.units[0].zh='改',d=>d.payload.generationId='g2',d=>d.signature='bad']){const f=setup(),p=path.join(f.root,f.a.admissionId,'admission.json'),d=JSON.parse(fs.readFileSync(p));mutate(d);fs.writeFileSync(p,JSON.stringify(d));assert.throws(()=>f.dates.get({claimToken:f.token,chunkId:f.a.admissionId}),/signature/);}
});
test('new validly signed generation invalidates old token; token cannot select another job',()=>{
  const f=setup();const other=setup();assert.throws(()=>other.dates.get({claimToken:f.token,chunkId:other.a.admissionId}));
  const d=admission({...f.a,generationId:'new-generation'});
  fs.writeFileSync(path.join(f.root,f.a.admissionId,'admission.json'),JSON.stringify({payload:d,signature:sign(null,Buffer.from(JSON.stringify(d)),privateKey).toString('base64url')}));
  assert.throws(()=>f.dates.get({claimToken:f.token,chunkId:f.a.admissionId}),/Stale date generation/);
});
test('immutable admission and sticky worker recovery prevent concurrent job reuse',()=>{
  const f=setup();assert.throws(()=>admitDateTask({root:f.root,admission:admission({...f.a,generationId:'new-generation'}),privateKey}),/Retained admission changed/);
  assert.throws(()=>admitDateTask({root:f.root,admission:admission(),privateKey}),/sticky unfinished/);
  assert.equal(f.dates.resume(f.args).claimToken,f.token);
});
test('original job byte ceiling and terminal host decisions fail closed',()=>{
  assert.throws(()=>setup(admission({maxBytes:1})),/ceiling/);
  const f=setup();const a=envelope(f.a);a.result.padding='x'.repeat(17000);assert.throws(()=>submit(f,a),/ceiling/);
  closeDateTask({root:f.root,admission:f.a,privateKey,status:'host-interrupted',reason:'host stopped'});assert.throws(()=>f.dates.get({claimToken:f.token,chunkId:f.a.admissionId}),/host-interrupted/);
  assert.equal(fs.existsSync(path.join(f.root,f.a.admissionId,'admission.json')),true);
});
test('repair type accepts author, rejects reviewer; no approval from finalize',()=>{
  const f=setup(admission({phase:'repair',artifactType:'date-repair',jobKey:'repair-0-test',contextId:'repair-context'}));
  assert.equal(submit(f).captured,true);assert.equal(f.dates.finalize({claimToken:f.token}).approved,false);
});
const until=async check=>{const end=Date.now()+3000;while(!check()){if(Date.now()>end)throw Error('test wait timed out');await new Promise(r=>setTimeout(r,5));}};
function hostOptions(root,extra={}){return {root,privateKey,dateWorkerInput:t=>t.input,resolveAdmission:t=>({hostSessionId:'host-test',queueWorker:'grok-dates-test',generationId:'generation-test',book:'jinshu',chapter:t.chapter??'053',jobId:t.input.id,phase:'audit',artifactType:'date-review',worker:t.worker,contextId:t.contextId,extractorContextIds:['extractor'],repairContextIds:['repair']}),assertHostOwnership:async()=>{},validateArtifact:async()=>{},timeoutMs:3000,maxWorkerBytes:16384,pollMs:5,...extra};}
const task=n=>({key:`audit-${n}`,kind:'review',worker:`grokbot-test-${n}`,contextId:`review-context-${n}`,input:{id:`job-${n}`,sourceHash:hash('a'),extractionHash:hash('b'),ownedUnits:[],units:[]},state:{},save:async()=>{}});
test('one shared four-job pool holds slots while results await; six tasks do not launch six admissions',async()=>{
  const root=fs.mkdtempSync(path.join(here,'test-runs','pool-')),pool=createDateWorkerPool(4),worker=createDateMcpWorker(hostOptions(root)),tasks=Array.from({length:6},(_,i)=>task(i));
  const promises=tasks.map(t=>pool.run(()=>worker(t)));
  await until(()=>fs.readdirSync(root).filter(n=>fs.statSync(path.join(root,n)).isDirectory()).length===4);
  assert.equal(pool.summary().active,4);assert.equal(pool.summary().queued,2);
  const dates=new DateArtifactTransport({root,publicKey,claimSecret});
  const completed=new Set();while(completed.size<6){for(const name of fs.readdirSync(root)){if(completed.has(name))continue;const p=path.join(root,name,'admission.json');if(!fs.existsSync(p))continue;const a=JSON.parse(fs.readFileSync(p)).payload;const token=dates.resume({type:'date',worker:a.worker,contextId:a.contextId,admissionId:a.admissionId}).claimToken;dates.submit({claimToken:token,chunkId:a.admissionId,artifact:envelope(a)});completed.add(name);}await new Promise(r=>setTimeout(r,10));}
  await Promise.all(promises);assert.equal(pool.summary().peak,4);assert.equal(pool.summary().active,0);
});
test('host production validation rejects retained result without publishing, then retry retains old capture',async()=>{
  const root=fs.mkdtempSync(path.join(here,'test-runs','reject-')),t=task('rejected');let reject=true;
  const worker=createDateMcpWorker(hostOptions(root,{validateArtifact:async()=>{if(reject)throw Error('production coverage failure');}}));
  const first=worker(t);await until(()=>Boolean(t.state.dateMcp));let a=JSON.parse(fs.readFileSync(path.join(root,t.state.dateMcp.admissionId,'admission.json'))).payload,old=a.admissionId;
  const dates=new DateArtifactTransport({root,publicKey,claimSecret});let token=dates.resume({type:'date',worker:a.worker,contextId:a.contextId,admissionId:a.admissionId}).claimToken;dates.submit({claimToken:token,chunkId:a.admissionId,artifact:envelope(a)});await assert.rejects(first,/production coverage failure/);assert.equal(t.state.dateMcp.rejected,true);
  reject=false;const second=worker(t);await until(()=>t.state.dateMcp.admissionId!==old);a=JSON.parse(fs.readFileSync(path.join(root,t.state.dateMcp.admissionId,'admission.json'))).payload;token=dates.resume({type:'date',worker:a.worker,contextId:a.contextId,admissionId:a.admissionId}).claimToken;dates.submit({claimToken:token,chunkId:a.admissionId,artifact:envelope(a)});await second;assert.equal(fs.existsSync(path.join(root,old,'result.json')),true);
});
test('missing host integration contracts fail immediately and CLI preserves typed payload boundaries',()=>{
  assert.throws(()=>createDateMcpWorker({}),/contracts/);
  assert.throws(()=>toolArguments('resume',{type:'date',worker:'grokbot-x','context-id':'context','admission-id':'job',book:'jinshu'}),/Mixed/);
  assert.deepEqual(toolArguments('status',{type:'date',worker:'grokbot-x','context-id':'context','admission-id':'job'}),{type:'date',worker:'grokbot-x',contextId:'context',admissionId:'job'});
  assert.deepEqual(toolArguments('status',{worker:'grokbot-old'}),{worker:'grokbot-old'});
  assert.throws(()=>toolArguments('resume',{worker:'grokbot-old',phase:'date'}),/Mixed/);
});
test('expiry and changed host ownership stop writes while retaining admissions/results',async()=>{
  const f=setup();const expired=new DateArtifactTransport({root:f.root,publicKey,claimSecret,now:()=>Date.parse(f.a.expiresAt)+1});
  assert.throws(()=>expired.get({claimToken:f.token,chunkId:f.a.admissionId}),/Expired/);
  const root=fs.mkdtempSync(path.join(here,'test-runs','guard-')),t=task('guard');let live=true;
  const worker=createDateMcpWorker(hostOptions(root,{assertHostOwnership:async()=>{if(!live)throw Error('lost host ownership or changed current hashes');}}));
  const promise=worker(t);await until(()=>Boolean(t.state.dateMcp));live=false;
  await assert.rejects(promise,/lost host ownership/);
  const a=JSON.parse(fs.readFileSync(path.join(root,t.state.dateMcp.admissionId,'admission.json'))).payload;
  const dates=new DateArtifactTransport({root,publicKey,claimSecret});assert.throws(()=>dates.resume({type:'date',worker:a.worker,contextId:a.contextId,admissionId:a.admissionId}),/host-interrupted/);
});
test('interrupted host resumes exact same nonexpired admission and context',async()=>{
  const root=fs.mkdtempSync(path.join(here,'test-runs','resume-')),t=task('resume'),abort=new AbortController();
  const first=createDateMcpWorker(hostOptions(root,{signal:abort.signal}))(t);await until(()=>Boolean(t.state.dateMcp));const old=t.state.dateMcp.admissionId;abort.abort();await assert.rejects(first,/interrupted/);
  const second=createDateMcpWorker(hostOptions(root))(t);await until(()=>{const p=path.join(root,old,'host-result.json');return fs.existsSync(p)&&JSON.parse(fs.readFileSync(p)).payload.status==='host-waiting';});
  assert.equal(t.state.dateMcp.admissionId,old);const a=JSON.parse(fs.readFileSync(path.join(root,old,'admission.json'))).payload;const dates=new DateArtifactTransport({root,publicKey,claimSecret}),token=dates.resume({type:'date',worker:a.worker,contextId:a.contextId,admissionId:old}).claimToken;dates.submit({claimToken:token,chunkId:old,artifact:envelope(a)});await second;
});
test('real MCP SDK advertises exactly five tools and enforces typed schemas without network',async()=>{
  const f=setup(),bridge=createTypedGrokbotBridge({dates:()=>f.dates,extraction:()=>({status:({worker})=>({worker,claims:[]})})});
  const server=createGrokbotMcpServer(bridge),client=new Client({name:'offline-draft-test',version:'1'});
  const left={start:async()=>{},send:async message=>queueMicrotask(()=>right.onmessage?.(structuredClone(message))),close:async()=>{}};
  const right={start:async()=>{},send:async message=>queueMicrotask(()=>left.onmessage?.(structuredClone(message))),close:async()=>{}};
  try {
    await server.connect(left);await client.connect(right);
    const tools=await client.listTools();assert.deepEqual(tools.tools.map(t=>t.name).sort(),['finalize_chapter','get_chunk','resume_or_claim','submit_chunk','worker_status']);
    const r=await client.callTool({name:'resume_or_claim',arguments:f.args});assert.notEqual(r.isError,true);assert.equal(JSON.parse(r.content[0].text).type,'date');
    const mixed=await client.callTool({name:'resume_or_claim',arguments:{...f.args,book:'jinshu'}});assert.equal(mixed.isError,true);
    const old=await client.callTool({name:'worker_status',arguments:{worker:'grokbot-old'}});assert.deepEqual(JSON.parse(old.content[0].text),{worker:'grokbot-old',claims:[]});
    await assert.rejects(client.callTool({name:'approve_date',arguments:{}}),/not found/);
  } finally {await client.close();await server.close();}
});
test('host seam requires real ownership/context contracts and invokes host review validator',async()=>{
  // Stub only the existing host dependencies, explicitly; no SDK or canonical
  // recovery state is loaded by this offline test.
  const asModule=source=>`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  const inputStub=asModule('export const dateWorkerInput=task=>task.input;');
  const validationStub=asModule(`export function validateDateJobResult(r,j,p){if(r.jobId!==j.id||r.sourceHash!==p.sourceHash)throw Error('host review validator');} export function applyDateRepairProposal(e,r,p){if(!r.changes?.length)throw Error('host repair validator');return e;}`);
  const transportUrl=new URL('./draft/scripts/lib/grokbot-date-transport.mjs',import.meta.url).href;
  const code=fs.readFileSync(path.join(here,'draft/scripts/lib/grokbot-date-host-worker.mjs'),'utf8')
    .replace("'./people-date-worker.mjs'",JSON.stringify(inputStub)).replace("'./people-date-workflow.mjs'",JSON.stringify(validationStub)).replace("'./grokbot-date-transport.mjs'",JSON.stringify(transportUrl));
  const {grokbotDateHostWorker}=await import(asModule(code));
  assert.throws(()=>grokbotDateHostWorker({}),/actual reserved generation/);
  const root=fs.mkdtempSync(path.join(here,'test-runs','hook-')),t=task('hook');t.job={id:t.input.id};t.packet={book:'jinshu',chapter:'053',sourceHash:t.input.sourceHash};
  const worker=grokbotDateHostWorker({root,privateKey,generationId:'g1',hostSessionId:'host-test',queueWorker:'existing-queue-owner',timeoutMs:3000,maxWorkerBytes:16384,pollMs:5,
    contextAssignment:async()=>({worker:t.worker,contextId:t.contextId}),independence:async()=>({extractorContextIds:['extractor'],repairContextIds:['repair']}),assertHostOwnership:async()=>{},validateExtraction:()=>{throw Error('review should not call extraction validator');}});
  const promise=worker(t);await until(()=>Boolean(t.state.dateMcp));const a=JSON.parse(fs.readFileSync(path.join(root,t.state.dateMcp.admissionId,'admission.json'))).payload;assert.equal(a.queueWorker,'existing-queue-owner');
  const dates=new DateArtifactTransport({root,publicKey,claimSecret}),token=dates.resume({type:'date',worker:a.worker,contextId:a.contextId,admissionId:a.admissionId}).claimToken;dates.submit({claimToken:token,chunkId:a.admissionId,artifact:envelope(a)});assert.equal((await promise).jobId,t.input.id);
});
