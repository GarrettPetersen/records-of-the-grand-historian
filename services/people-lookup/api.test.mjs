import {test} from 'node:test';
import assert from 'node:assert/strict';
import {handleLookup,sha256,consumeBudget,normalizedSearchKey} from './api.mjs';

async function fixture(){
 const objects=new Map(),reads=[];
 const env={REGISTRY_PREFIX:'snapshots/test',PEOPLE_API_TOKEN_SHA256:await sha256('test-token'),
 PEOPLE_RATE:{limit:async()=>({success:true})},PEOPLE_BUDGET:{idFromName:x=>x,get:()=>({fetch:async()=>new Response('',{status:200})})},
 PEOPLE_DATA:{get:async(key,opts)=>{reads.push(key);const raw=objects.get(key);if(!raw)return null;const b=Buffer.from(raw);const out=opts?.range?b.subarray(opts.range.offset,opts.range.offset+opts.range.length):b;return{size:b.length,arrayBuffer:async()=>out};}}};
 const row=async(kind,key,value)=>{const k=JSON.stringify([kind,key]),file=`snapshots/test/index/${(await sha256(k)).slice(0,3)}.jsonl`;objects.set(file,(objects.get(file)??'')+JSON.stringify([k,value])+'\n');};
 const get=(route,options={})=>handleLookup(new Request('https://lookup.test'+route,{headers:{authorization:'Bearer test-token'},...options}),env);
 return{env,objects,reads,row,get};
}
test('auth and malformed requests never reach storage',async()=>{
 const f=await fixture();
 assert.equal((await f.get('/v1/search?q=Cao',{headers:{}})).status,401);
 assert.equal((await f.get('/v1/search?q=Cao',{method:'POST'})).status,405);
 assert.equal((await f.get('/v1/search?q=Cao&limit=99')).status,400);
 assert.equal((await f.get('/health',{headers:{}})).status,200);
 assert.equal(f.reads.length,0);
});
test('exact search reports truncation and original posting seal',async()=>{
 const f=await fixture();await f.row('postings','en:cao cao',{ids:['per_A','per_B'],total:20,fingerprint:'sha256:original'});
 const result=await(await f.get('/v1/search?q=Cao%20Cao&limit=1')).json();
 assert.deepEqual(result.ids,['per_A']);assert.equal(result.total,20);assert.equal(result.truncated,true);assert.equal(result.postingFingerprint,'sha256:original');
 assert.equal(normalizedSearchKey('Cáo Cao'),'en:cao cao');
 assert.equal(normalizedSearchKey('休祐'),'zh:休佑');assert.equal(normalizedSearchKey('The Cao-Cao'),'en:cao cao');
});
test('both admission limits reject before R2 reads',async()=>{
 const f=await fixture();f.env.PEOPLE_RATE.limit=async()=>({success:false});assert.equal((await f.get('/v1/search?q=x')).status,429);
 f.env.PEOPLE_RATE.limit=async()=>({success:true});f.env.PEOPLE_BUDGET.get=()=>({fetch:async()=>new Response('',{status:429})});
 assert.equal((await f.get('/v1/search?q=x')).status,429);assert.equal(f.reads.length,0);
});
test('native record checksum and version verified, evidence scoped to member',async()=>{
 const f=await fixture(),value={id:'per_A',version:'sha256:v1',names:[],localPeople:['jinshu:053:p001'],anchorCandidates:[],matching:{},identityEvidence:[{localId:'jinshu:053:p001',claims:[{id:'claim1'}]}]};
 const raw=JSON.stringify(value)+'\n';f.objects.set('snapshots/test/data/0000.bin',raw);
 await f.row('dossier','per_A',{offset:0,bytes:Buffer.byteLength(raw),sha256:await sha256(raw),version:value.version});
 let r=await(await f.get('/v1/people/per_A')).json();assert.deepEqual(r.identityEvidence,[]);assert.equal(r.publicationApproval,false);
 r=await(await f.get('/v1/people/per_A?member=jinshu:053:p001')).json();assert.equal(r.identityEvidence[0].claims[0].id,'claim1');
 f.objects.set('snapshots/test/data/0000.bin',raw.replace('claim1','claim2'));
 assert.equal((await f.get('/v1/people/per_A')).status,503);
});
test('global budget resets UTC days and minutes and denies exhausted budgets',async()=>{
 const data=new Map(),storage={transaction:async f=>f({get:async k=>data.get(k),put:async(k,v)=>data.set(k,v)})};
 assert.equal(await consumeBudget(storage,0,2,1),true);assert.equal(await consumeBudget(storage,1,2,1),false);
 assert.equal(await consumeBudget(storage,60000,2,1),true);assert.equal(await consumeBudget(storage,120000,2,1),false);
 assert.equal(await consumeBudget(storage,86400000,2,1),true);
});
test('dossier byte range spanning two R2 chunks retains native checksum',async()=>{
 const f=await fixture(),value={id:'per_B',version:'sha256:v2',names:[],localPeople:[],anchorCandidates:[],matching:{},identityEvidence:[]};
 const raw=Buffer.from(JSON.stringify(value)+'\n'),chunk=32*1024*1024,offset=chunk-5;
 await f.row('dossier','per_B',{offset,bytes:raw.length,sha256:await sha256(raw.toString()),version:value.version});
 const original=f.env.PEOPLE_DATA.get;let ranges=0;
 f.env.PEOPLE_DATA.get=async(key,options)=>{
  if(!key.includes('/data/'))return original(key,options);
  ranges++;const first=key.endsWith('0000.bin');
  assert.equal(options.range.offset,first?offset:0);assert.equal(options.range.length,first?5:raw.length-5);
  return{size:chunk,arrayBuffer:async()=>first?raw.subarray(0,5):raw.subarray(5)};
 };
 assert.equal((await f.get('/v1/people/per_B')).status,200);assert.equal(ranges,2);
});
