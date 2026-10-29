import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {once} from 'node:events';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import {Client,StreamableHTTPClientTransport} from '@modelcontextprotocol/client';
import {startGrokbotMcpServer} from './grokbot-mcp-server.mjs';
import {GrokbotReviewStore,reviewFingerprint} from './lib/grokbot-review-store.mjs';
import {GrokbotMcpBridge} from './lib/grokbot-mcp-bridge.mjs';
import {assignmentDirectory} from './people-work-queue.mjs';
import {REPO_ROOT} from './lib/people-content.mjs';

const fixture=()=>({schemaVersion:1,id:'editorial-jin053-001',worker:'grokbot-24',kind:'editorial-review',book:'jinshu',chapter:'053',sourceRevision:'a'.repeat(40),reviewerAgentId:'reviewer-real-24',authorAgentIds:['independent-author-17'],prompt:'Review the complete sealed primary-source proposal, including paired English fields. Return a report artifact only.',packet:{units:[{id:'s0001',zh:'成皇帝諱衍'}],proposal:{before:'Emperor Xiaowu',after:'Emperor Cheng'}},draft:{},reportSchema:{type:'object',additionalProperties:false,required:['verdict'],properties:{verdict:{enum:['approve','reject','hold']}}},hostOwnership:{worker:'existing-host-owner',scope:'jinshu/053 supplemental editorial job',receiptSha256:'b'.repeat(64)}});
function setup(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'grok-review-test-'));fs.chmodSync(dir,0o700);t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));const store=new GrokbotReviewStore(path.join(dir,'private-reviews'));return {dir,store};}
const report=job=>({schemaVersion:1,jobId:job.id,packetSha256:reviewFingerprint(job.packet),reviewer:{agentId:job.reviewerAgentId,name:'Independent source reviewer'},result:{verdict:'approve'}});
function bridgeFor(store){const bridge=new GrokbotMcpBridge({claimSecret:'s'.repeat(48),reviewStore:store});bridge.currentClaim=()=>null;bridge.currentLedger=()=>({claims:{}});return bridge;}

test('sealed review round trip through the existing operations never invokes publication or grants approval',async t=>{
 const {store}=setup(t),job=fixture();store.register(job);const bridge=bridgeFor(store);bridge.verifiedClaim=()=>{throw Error('Review must not enter extraction publication');};bridge.publisher={publish(){assert.fail('Review cannot publish');}};
 const resumed=await bridge.resumeOrClaim({worker:job.worker,reviewJob:job.id});assert.equal(resumed.mode,'sealed-review');
 const input=bridge.getChunk({claimToken:resumed.claimToken,chunkId:'review'});assert.deepEqual(input.packet,job.packet);assert.deepEqual(input.schema.properties.result,job.reportSchema);
 const result=bridge.submitChunk({claimToken:resumed.claimToken,chunkId:'review',report:report(job)});assert.equal(result.status,'returned-awaiting-host');assert.equal(result.qualityApproved,false);assert.equal(result.published,false);
 assert.deepEqual(await bridge.finalizeChapter({claimToken:resumed.claimToken}),result);
 assert.equal(bridge.status({worker:job.worker}).reviews[0].status,'returned-awaiting-host');
 assert.deepEqual((await bridge.resumeOrClaim({worker:job.worker,reviewJob:job.id})).chunks,[]);
});
test('wrong identity, seal, schema and report kind preserve the original report',t=>{
 const {store}=setup(t),job=fixture();store.register(job);
 for(const mutate of [r=>r.packetSha256='0'.repeat(64),r=>r.reviewer.agentId='author-agent',r=>r.result.verdict='invented',r=>r.result.extra=true,r=>r.extra=true]){const r=report(job);mutate(r);assert.throws(()=>store.submit(job,r));}
 assert.equal(store.list(job.worker)[0].status,'pending-review');const original=store.submit(job,report(job));assert.deepEqual(store.submit(job,report(job)),original);
 const altered=report(job);altered.result.verdict='reject';assert.throws(()=>store.submit(job,altered),/already preserved/u);assert.equal(store.savedResult(job).report.result.verdict,'approve');
});
test('registration rejects self-review, async schemas, malformed scope and competing pending work',t=>{
 const {store}=setup(t);
 for(const mutate of [j=>j.authorAgentIds=[j.reviewerAgentId],j=>j.reportSchema.$async=true,j=>j.id='../escape',j=>j.worker='../../escape',j=>j.hostOwnership=null,j=>j.packet={},j=>j.reportSchema.additionalProperties=true]){const j=fixture();mutate(j);assert.throws(()=>store.register(j));}
 const j=fixture();store.register(j);assert.throws(()=>store.register({...j,id:'different-review'}),/preserved pending/u);assert.throws(()=>store.register(j),/preserved pending/u);
 store.submit(j,report(j));assert.throws(()=>store.register(j),/EEXIST/u);assert.equal(store.savedResult(j).report.jobId,j.id);
});
test('world-readable inputs and symlinks are rejected',t=>{
 const {dir,store}=setup(t),j=fixture();store.register(j);const file=store.jobFile(j.worker,j.id);fs.chmodSync(file,0o644);assert.throws(()=>store.read(j.worker,j.id),/owner-only/u);fs.chmodSync(file,0o600);
 fs.renameSync(file,path.join(dir,'outside.json'));fs.symlinkSync(path.join(dir,'outside.json'),file);assert.throws(()=>store.read(j.worker,j.id),/owner-only/u);
});
test('signed review tokens bind exact job bytes and scope',async t=>{
 const {store}=setup(t),j=fixture();store.register(j);const b=bridgeFor(store),a=await b.resumeOrClaim({worker:j.worker,reviewJob:j.id});assert.throws(()=>b.getChunk({claimToken:a.claimToken+'x',chunkId:'review'}),/signature/u);
 assert.throws(()=>b.getChunk({claimToken:a.claimToken,chunkId:'other'}),/Unknown sealed review/u);
 assert.throws(()=>b.submitChunk({claimToken:a.claimToken,chunkId:'review',extraction:{}}),/require only a report/u);
 const changed={...j,prompt:j.prompt+' Changed.'};fs.writeFileSync(store.jobFile(j.worker,j.id),JSON.stringify(changed),{mode:0o600});assert.throws(()=>b.getChunk({claimToken:a.claimToken,chunkId:'review'}),/changed after token/u);
});
test('sticky extraction and pending review ownership cannot be bypassed',async t=>{
 const {store}=setup(t),j=fixture();store.register(j);const b=bridgeFor(store);
 await assert.rejects(b.resumeOrClaim({worker:j.worker}),/host-prepared reviewJob/u);
 const a=await b.resumeOrClaim({worker:j.worker,reviewJob:j.id});b.currentClaim=()=>({target:{book:'jinshu',chapter:'086'}});
 await assert.rejects(b.resumeOrClaim({worker:j.worker,reviewJob:j.id}),/existing sticky extraction/u);
 assert.throws(()=>b.getChunk({claimToken:a.claimToken,chunkId:'review'}),/Sticky extraction/u);
 assert.equal(store.list(j.worker)[0].status,'pending-review');
});
test('a pending or corrupted review never blocks recovery of an existing sealed extraction',async t=>{
 const {store}=setup(t),j={...fixture(),worker:'grokbot-sticky-test-'+process.pid};store.register(j);
 const target={book:'jinshu',chapter:'086'},dir=assignmentDirectory(j.worker,target);
 assert.equal(fs.existsSync(dir),false);const created=[];for(let d=dir;!fs.existsSync(d);d=path.dirname(d))created.push(d);
 fs.mkdirSync(dir,{recursive:true});t.after(()=>{fs.rmSync(dir,{recursive:true,force:true});for(const d of created.slice(1)){try{fs.rmdirSync(d);}catch(e){if(['ENOTEMPTY','EEXIST','ENOENT'].includes(e.code))break;throw e;}}});
 const packet=path.join(dir,'packet.json'),output=path.join(dir,'output.json');fs.writeFileSync(packet,'{}');fs.writeFileSync(output,'{}');
 const assignment={...target,worker:j.worker,mode:'whole',chunks:[{id:'001',packet:path.relative(REPO_ROOT,packet),output:path.relative(REPO_ROOT,output)}]};
 fs.writeFileSync(path.join(dir,'assignment.json'),JSON.stringify(assignment));
 const live={target,claim:{chapterFingerprint:'sha256:sealed-fixture',grokbotPlan:{chunks:[{id:'001'}]}}},bridge=bridgeFor(store);bridge.currentClaim=()=>live;
 assert.equal((await bridge.resumeOrClaim({worker:j.worker})).mode,'whole');
 fs.chmodSync(store.jobFile(j.worker,j.id),0o644);
 assert.equal((await bridge.resumeOrClaim({worker:j.worker})).mode,'whole');
 assert.equal(bridge.status({worker:j.worker}).reviewsError.code,'review-store-invalid');
 await assert.rejects(bridge.resumeOrClaim({worker:j.worker,reviewJob:j.id}),/sticky extraction/u);
});
test('registration lock records ownership and is never deleted to bypass an uncertain host invocation',t=>{
 const {store}=setup(t),j=fixture();store.register(j);store.submit(j,report(j));
 const lock=path.join(store.directory(j.worker),'.registration.lock');fs.writeFileSync(lock,JSON.stringify({pid:999999,startedAt:'2026-01-01T00:00:00Z',token:'preserve-me'}),{mode:0o600});
 assert.throws(()=>store.register({...j,id:'new-review'}),/inspect preserved owner/u);assert.equal(JSON.parse(fs.readFileSync(lock)).token,'preserve-me');
});
test('the authenticated HTTP surface still has exactly five operations and accepts sealed review reports',async t=>{
 const {store}=setup(t),j=fixture();store.register(j);const bridge=bridgeFor(store),auth='fixture-only-auth-token-'+'a'.repeat(32);
 const server=startGrokbotMcpServer({bridge,env:{HOST:'127.0.0.1',PORT:'0',GROKBOT_MCP_AUTH_TOKEN:auth,GROKBOT_MCP_CLAIM_SECRET:'s'.repeat(48)}});
 t.after(()=>server.close());if(!server.httpServer.listening)await once(server.httpServer,'listening');
 const base='http://127.0.0.1:'+server.httpServer.address().port;
 const client=new Client({name:'review-transport-test',version:'1.0.0'});await client.connect(new StreamableHTTPClientTransport(new URL(base+'/mcp'),{requestInit:{headers:{Authorization:'Bearer '+auth}}}));t.after(()=>client.close());
 assert.deepEqual((await client.listTools()).tools.map(x=>x.name).sort(),['finalize_chapter','get_chunk','resume_or_claim','submit_chunk','worker_status']);
 const call=async(name,args)=>{const r=await client.callTool({name,arguments:args});assert.equal(r.isError,undefined,JSON.stringify(r));return JSON.parse(r.content[0].text);};
 const resumed=await call('resume_or_claim',{worker:j.worker,reviewJob:j.id});
 assert.equal((await call('get_chunk',{claimToken:resumed.claimToken,chunkId:'review'})).reviewJob,j.id);
 const received=await call('submit_chunk',{claimToken:resumed.claimToken,chunkId:'review',report:report(j)});
 assert.equal(received.qualityApproved,false);assert.equal(received.published,false);
 assert.deepEqual(await call('finalize_chapter',{claimToken:resumed.claimToken}),received);
});
test('dependency-free CLI forwards reviewJob and report without touching extraction publication',async t=>{
 const {dir,store}=setup(t),j=fixture();store.register(j);const bridge=bridgeFor(store),auth='fixture-client-only-'+'f'.repeat(40);
 const server=startGrokbotMcpServer({bridge,env:{HOST:'127.0.0.1',PORT:'0',GROKBOT_MCP_AUTH_TOKEN:auth,GROKBOT_MCP_CLAIM_SECRET:'s'.repeat(48)}});t.after(()=>server.close());if(!server.httpServer.listening)await once(server.httpServer,'listening');
 const script=fileURLToPath(new URL('./grokbot-mcp-client.mjs',import.meta.url));
 async function cli(args){const p=spawn(process.execPath,[script,...args],{env:{...process.env,GROKBOT_MCP_AUTH_TOKEN:auth,GROKBOT_MCP_URL:'http://127.0.0.1:'+server.httpServer.address().port+'/mcp'},stdio:['ignore','pipe','pipe']});let out='',err='';p.stdout.on('data',b=>out+=b);p.stderr.on('data',b=>err+=b);const [code]=await once(p,'close');assert.equal(code,0,err);return JSON.parse(out);}
 const resumed=await cli(['resume','--worker',j.worker,'--review-job',j.id]);assert.equal(resumed.mode,'sealed-review');
 const file=path.join(dir,'report.json');fs.writeFileSync(file,JSON.stringify(report(j)),{mode:0o600});
 const result=await cli(['submit-chunk','--claim-token',resumed.claimToken,'--chunk-id','review','--kind','review','--file',file]);assert.equal(result.status,'returned-awaiting-host');assert.equal(result.qualityApproved,false);
});
test('review CLI refuses an older server before resume could silently allocate extraction',async t=>{
 let calls=0;const server=createServer(async(req,res)=>{let body='';for await(const b of req)body+=b;const request=JSON.parse(body);if(request.method==='tools/call')calls++;res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify({jsonrpc:'2.0',id:request.id,result:{protocolVersion:'2025-06-18',capabilities:{},serverInfo:{name:'old-extraction-only-server',version:'1.0.0'}}}));});
 server.listen(0,'127.0.0.1');await once(server,'listening');t.after(()=>new Promise(resolve=>server.close(resolve)));
 const script=fileURLToPath(new URL('./grokbot-mcp-client.mjs',import.meta.url)),p=spawn(process.execPath,[script,'resume','--worker','grokbot-24','--review-job','must-not-become-extraction'],{env:{...process.env,GROKBOT_MCP_AUTH_TOKEN:'fixture-only-never-real',GROKBOT_MCP_URL:'http://127.0.0.1:'+server.address().port+'/mcp'},stdio:['ignore','pipe','pipe']});let err='';p.stderr.on('data',b=>err+=b);const[code]=await once(p,'close');assert.notEqual(code,0);assert.match(err,/older extraction-only server/u);assert.equal(calls,0);
});
