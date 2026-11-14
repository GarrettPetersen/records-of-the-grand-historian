import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {once} from 'node:events';
import {spawnSync} from 'node:child_process';
import {prepareChapterOwner,chapterOperation,authenticateChapterRole,ownerDirectory,pinChapterNativeRuntime} from './lib/people-chapter-owner.mjs';
import {startGrokbotMcpServer} from './grokbot-mcp-server.mjs';

function fixture(t){
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'chapter-owner-test-')));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const put=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(v));};
 put('data/test/001.json',{content:[{type:'paragraph',sentences:[{id:'s0001',zh:'甲',translations:[{lang:'en',idiomatic:'A',literal:'A'}]}]}]});
 put('data/people/extractions/test/001.json',{people:[],claims:[],translationRepairs:[],run:{agentId:'old-author'}});
 put('data/people/editorial-decisions/test/001.json',{schemaVersion:4,reviews:[{id:'retained-review'}]});
 put('data/people/generated/extraction-state.json',{chapters:{'test/001':{status:'interrupted',agentId:'retained-agent'}}});
 put('data/people/generated/completion/test/001/returned-review.json',{status:'failed',reason:'Retain this research'});
 const ledger={schemaVersion:1,claims:{},dateAudits:{'test/001':{worker:'prior-owner',status:'active',jobs:{}}}};
 const original=JSON.stringify(ledger),job=prepareChapterOwner(root,{book:'test',chapter:'001',lane:'cursor-sdk',worker:'stable',ledger});
 assert.equal(JSON.stringify(ledger),original);return{root,job,dir:ownerDirectory(root,job.id)};
}
function nativeFixture(root){
 const native=path.join(root,'native');fs.mkdirSync(path.join(root,'scripts'),{recursive:true});
 fs.writeFileSync(path.join(root,'scripts/check-local-disk.mjs'),`if(process.env.PEOPLE_REPO_ROOT!==process.cwd())process.exit(1);`);
 fs.mkdirSync(path.join(native,'scripts/lib'),{recursive:true});
 fs.writeFileSync(path.join(native,'scripts/build-people-extraction-packet.mjs'),'export const buildPeopleExtractionPacket=()=>({input:{unitCount:1}});');
 fs.writeFileSync(path.join(native,'scripts/validate-people-extraction.mjs'),'export const validateCompactPeopleExtraction=()=>({stats:{people:0}});');
 fs.writeFileSync(path.join(native,'scripts/lib/people-candidates.mjs'),'export const loadProperNounMatcher=()=>({});');
 fs.writeFileSync(path.join(native,'scripts/lib/people-content.mjs'),'export {contentUnits,setTranslationField} from '+JSON.stringify(new URL('./lib/people-content.mjs',import.meta.url).href)+';');
 return native;
}
test('partial work indexed and byte sealed, retained conversations preserved',t=>{
 const {root,job,dir}=fixture(t);const artifact=job.artifacts.find(a=>a.file.endsWith('returned-review.json'));assert(artifact);
 assert.equal(artifact.use,'recovery-evidence-not-approval');
 assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'recovery-state.json'))).extraction.agentId,'retained-agent');
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir,'editorial.json'))).reviews,[{id:'retained-review'}]);
 assert.throws(()=>chapterOperation(root,job.id,'owner','patch',{revision:0,target:'editorial',pointer:'/reviews',before:[{id:'retained-review'}],after:[]}),/Role cannot/);
 fs.appendFileSync(path.join(root,artifact.file),' ');
 assert.throws(()=>chapterOperation(root,job.id,'owner','read',{artifact:artifact.id}),/Sealed input changed/);
});
test('roles, exact-before, revision, source repair and coverage guards',t=>{
 const {root,job,dir}=fixture(t);
 assert.throws(()=>authenticateChapterRole(root,job.id,'owner','bad'),/Invalid scoped/);
 const token=fs.readFileSync(path.join(dir,'owner-token'),'utf8');assert(authenticateChapterRole(root,job.id,'owner',token));
 assert.throws(()=>chapterOperation(root,job.id,'owner','patch',{revision:0,target:'identity-review',pointer:'/status',add:true,after:'approved'}),/Role cannot/);
 assert.throws(()=>chapterOperation(root,job.id,'owner','patch',{revision:0,target:'extraction',pointer:'/run/agentId',before:'wrong',after:'new'}),/exact-before/);
 let r=chapterOperation(root,job.id,'owner','repair',{revision:0,unitId:'s0001',field:'literal',before:'A',after:'Person A',reason:'Complete name'});assert.equal(r.revision,1);
 assert.throws(()=>chapterOperation(root,job.id,'owner','coverage',{revision:0,unitIds:['s0001'],bothEnglishFields:true}),/Stale/);
 assert.throws(()=>chapterOperation(root,job.id,'owner','finish',{revision:1}),/Incomplete coverage/);
 assert.equal(JSON.parse(fs.readFileSync(path.join(root,'data/test/001.json'))).content[0].sentences[0].translations[0].literal,'A');
 assert.throws(()=>chapterOperation(root,job.id,'owner','patch',{revision:1,target:'extraction',pointer:'/__proto__/x',after:1}),/safe/);
});
test('individual claim append preserves existing data and requires an explicit add',t=>{
 const {root,job,dir}=fixture(t);
 assert.throws(()=>chapterOperation(root,job.id,'owner','patch',{revision:0,target:'extraction',pointer:'/claims/0',after:['c001','p001','role']}),/exact-before/);
 const r=chapterOperation(root,job.id,'owner','patch',{revision:0,target:'extraction',pointer:'/claims/-',add:true,after:['c001','p001','role']});
 assert.equal(r.revision,1);assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir,'extraction.json'))).claims,[['c001','p001','role']]);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'data/people/extractions/test/001.json'))).claims,[]);
});
test('validator uses host guard context and fails closed when native runtime changes',t=>{
 const {root,job,dir}=fixture(t),native=nativeFixture(root);
 job.nativeRoot=native;job.nativeSeals=[];fs.writeFileSync(path.join(dir,'job.json'),JSON.stringify(job));
 const inherited=process.env.PEOPLE_REPO_ROOT;process.env.PEOPLE_REPO_ROOT='/wrong-runtime';
 try{assert.equal(chapterOperation(root,job.id,'owner','validate').passed,true);}finally{if(inherited===undefined)delete process.env.PEOPLE_REPO_ROOT;else process.env.PEOPLE_REPO_ROOT=inherited;}
 job.nativeSeals=[{file:'scripts/validate-people-extraction.mjs',sha256:'sha256:'+'0'.repeat(64)}];fs.writeFileSync(path.join(dir,'job.json'),JSON.stringify(job));
 assert.throws(()=>chapterOperation(root,job.id,'owner','validate'),/Pinned native runtime changed/);
});

test('owner finish freezes candidate mutations while permitting bounded reads and native validation',t=>{
 const {root,job,dir}=fixture(t);job.nativeRoot=nativeFixture(root);job.nativeSeals=[];job.coveredUnits=job.unitIds;
 fs.writeFileSync(path.join(dir,'job.json'),JSON.stringify(job));
 assert.equal(chapterOperation(root,job.id,'owner','validate').passed,true);
 const done=chapterOperation(root,job.id,'owner','finish',{revision:0});assert.equal(done.status,'ready-for-review');
 for(const [operation,args] of [['repair',{unitId:'s0001',field:'literal',before:'A',after:'B',reason:'Late change'}],['patch',{target:'extraction',pointer:'/claims',before:[],after:[['late']]}],['append',{target:'extraction',pointer:'/claims',expectedLength:0,records:[['late']]}]]){
  assert.throws(()=>chapterOperation(root,job.id,'owner',operation,{revision:done.revision,...args}),/frozen/);
 }
 assert.equal(chapterOperation(root,job.id,'owner','validate').passed,true);
 assert.deepEqual(JSON.parse(chapterOperation(root,job.id,'owner','read',{artifact:'draft:extraction'}).text).claims,[]);
});

test('native contract pins cover actual publisher and approval dependencies',t=>{
 const {root,job,dir}=fixture(t),native=nativeFixture(root);
 fs.mkdirSync(path.join(native,'data/people/schema'),{recursive:true});
 for(const file of ['scripts/lib/people-compact.mjs','scripts/lib/people-combined-curation-review.mjs','scripts/lib/people-combined-footnote-review.mjs','scripts/lib/people-combined-curation.mjs','scripts/lib/people-editorial-decisions.mjs','scripts/lib/people-date-audit.mjs','scripts/publish-people-combined-curation.mjs'])fs.writeFileSync(path.join(native,file),'export const fixture=true;');
 pinChapterNativeRuntime(root,job,native);fs.writeFileSync(path.join(dir,'job.json'),JSON.stringify(job));
 assert.equal(chapterOperation(root,job.id,'owner','validate').passed,true);
 for(const file of ['scripts/lib/people-combined-footnote-review.mjs','scripts/lib/people-combined-curation.mjs','scripts/lib/people-editorial-decisions.mjs','scripts/lib/people-date-audit.mjs','scripts/lib/people-content.mjs']){
  const target=path.join(native,file),before=fs.readFileSync(target);fs.appendFileSync(target,'\n// changed runtime\n');
  assert.throws(()=>chapterOperation(root,job.id,'owner','validate'),/Pinned native runtime changed/);fs.writeFileSync(target,before);
 }
});

test('source journal compiles final deltas without publishing intermediate English or losing drafts',t=>{
 const {root,job,dir}=fixture(t);job.nativeRoot=nativeFixture(root);job.nativeSeals=[];fs.writeFileSync(path.join(dir,'job.json'),JSON.stringify(job));
 chapterOperation(root,job.id,'owner','repair',{revision:0,unitId:'s0001',field:'literal',before:'A',after:'B',reason:'First proposal',confidence:'high'});
 chapterOperation(root,job.id,'owner','repair',{revision:1,unitId:'s0001',field:'literal',before:'B',after:'C',reason:'Final source-backed replacement',confidence:'medium'});
 const script=new URL('./compile-people-chapter-owner.mjs',import.meta.url);
 const run=()=>spawnSync(process.execPath,[script.pathname,'--job',job.id,'--root',root],{encoding:'utf8'});
 const result=run();assert.equal(result.status,0,result.stderr);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir,'extraction.json'))).translationRepairs,[['s0001','literal','A','C','Final source-backed replacement','medium','applied']]);
 assert.equal(JSON.parse(fs.readFileSync(path.join(root,'data/test/001.json'))).content[0].sentences[0].translations[0].literal,'A');
 assert.equal(fs.readdirSync(path.join(dir,'owner-history')).length,1);
 assert.equal(run().status,0);assert.equal(fs.readdirSync(path.join(dir,'owner-history')).length,1);
 const source=JSON.parse(fs.readFileSync(path.join(dir,'source.json')));source.content[0].sentences[0].translations[0].literal='Unrecorded';fs.writeFileSync(path.join(dir,'source.json'),JSON.stringify(source));
 assert.match(run().stderr,/not completely explained/);
});

test('bounded batches append atomically without stale overwrites or role escalation',t=>{
 const {root,job,dir}=fixture(t);
 const args={revision:0,target:'extraction',pointer:'/claims',expectedLength:0,records:[['c001'],['c002']]};
 assert.equal(chapterOperation(root,job.id,'owner','append',args).revision,1);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir,'extraction.json'))).claims,[['c001'],['c002']]);
 assert.throws(()=>chapterOperation(root,job.id,'owner','append',{...args,revision:1}),/length changed/);
 assert.throws(()=>chapterOperation(root,job.id,'owner','append',{...args,revision:1,target:'date-report'}),/Role cannot/);
 assert.throws(()=>chapterOperation(root,job.id,'owner','append',{...args,revision:1,expectedLength:2,records:Array(33).fill(['x'])}),/one and 32/);
 assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'job.json'))).revision,1);
});
test('HTTP MCP accepts only job-scoped credential and exposes chapter tools',async t=>{
 const {root,job,dir}=fixture(t);const server=startGrokbotMcpServer({env:{GROKBOT_MCP_AUTH_TOKEN:'a'.repeat(64),GROKBOT_MCP_CLAIM_SECRET:'b'.repeat(64),HOST:'127.0.0.1',PORT:'0',PEOPLE_CHAPTER_ROOT:root},bridge:{}});
 t.after(()=>server.close());await once(server.httpServer,'listening');
 const url=`http://127.0.0.1:${server.httpServer.address().port}/chapter-mcp/${job.id}/owner`;
 const headers={'content-type':'application/json',accept:'application/json, text/event-stream',authorization:'Bearer wrong'};
 assert.equal((await fetch(url,{method:'POST',headers,body:'{}'})).status,401);
 headers.authorization='Bearer '+fs.readFileSync(path.join(dir,'owner-token'),'utf8');
 const response=await fetch(url,{method:'POST',headers,body:JSON.stringify({jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'chapter_manifest',arguments:{}}})});
 assert.equal(response.status,200);const text=await response.text();const data=text.split('\n').filter(s=>s.startsWith('data:')).at(-1);const value=JSON.parse(data?data.slice(5):text);assert.equal(JSON.parse(value.result.content[0].text).id,job.id);
});
