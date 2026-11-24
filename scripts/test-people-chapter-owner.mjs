import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {once} from 'node:events';
import {spawnSync} from 'node:child_process';
import {prepareChapterOwner,chapterOperation,authenticateChapterRole,ownerDirectory,pinChapterNativeRuntime} from './lib/people-chapter-owner.mjs';
import {startGrokbotMcpServer} from './grokbot-mcp-server.mjs';
import {editorialReviews} from './lib/people-editorial-decisions.mjs';
import {documentHash} from './lib/people-combined-curation-review.mjs';

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
 fs.writeFileSync(path.join(native,'scripts/lib/people-editorial-decisions.mjs'),'export {editorialReviews,validateEditorialDecisionDocument} from '+JSON.stringify(new URL('./lib/people-editorial-decisions.mjs',import.meta.url).href)+';');
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
test('explicit fresh preparation keeps the seed private and preserves canonical absence',t=>{
 const {root}=fixture(t),canonical=path.join(root,'data/people/extractions/test/001.json');
 const seed={schemaVersion:2,book:'test',chapter:'001',people:[],claims:[],translationRepairs:[],run:{agentId:null},coverage:{allUnitsVisited:false}};
 const options={book:'test',chapter:'001',lane:'cursor-sdk',worker:'fresh-owner',ledger:{schemaVersion:1,claims:{}},freshSeed:seed};
 assert.throws(()=>prepareChapterOwner(root,options),/canonical extraction is absent/);
 fs.unlinkSync(canonical);
 assert.throws(()=>prepareChapterOwner(root,{...options,freshSeed:null}),/explicit fresh draft/);
 const job=prepareChapterOwner(root,options),dir=ownerDirectory(root,job.id);
 assert.equal(fs.existsSync(canonical),false);
 assert.equal(job.extractionSha256,null);assert.equal(job.canonicalExtractionAbsent,true);
 assert.equal(job.firstInstallApprovalGranted,false);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir,'extraction.json'))),seed);
 assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'editorial.json'))).reviews[0].id,'retained-review');
});
test('fresh compiler preserves absent canonical extraction and rejects a new competing install',t=>{
 const {root,job,dir}=fixture(t),native=nativeFixture(root);
 const canonical=path.join(root,'data/people/extractions/test/001.json');fs.unlinkSync(canonical);
 Object.assign(job,{status:'working',canonicalExtractionAbsent:true,extractionSha256:null,nativeRoot:native,nativeSeals:[]});
 fs.writeFileSync(path.join(dir,'job.json'),JSON.stringify(job));
 const invoke=()=>spawnSync(process.execPath,['scripts/compile-people-chapter-owner.mjs','--root',root,'--job',job.id],{cwd:process.cwd(),encoding:'utf8',env:{...process.env,PEOPLE_REPO_ROOT:root}});
 let r=invoke();assert.equal(r.status,0,r.stderr);assert.equal(fs.existsSync(canonical),false);
 fs.writeFileSync(canonical,'{}');r=invoke();assert.notEqual(r.status,0);assert.match(r.stderr,/extraction absence changed/);
});
test('missing accepted extraction preserves partial chunks, holds and reviewer evidence without granting approval',t=>{
 const {root}=fixture(t);
 fs.unlinkSync(path.join(root,'data/people/extractions/test/001.json'));
 const chunk='data/people/generated/chunk-extractions/test/001/chunk-001.json';
 fs.mkdirSync(path.dirname(path.join(root,chunk)),{recursive:true});
 const bytes=JSON.stringify({people:[{id:'saved-person'}],run:{agentId:'retained-chunk-author'}});
 fs.writeFileSync(path.join(root,chunk),bytes);
 const ledger={schemaVersion:1,claims:{'test/001':{worker:'original-worker',status:'ready'}},dateAudits:{'test/001':{status:'research-blocked',circuitBreaker:{rounds:3}}},identityReviews:{'test/001':{status:'held',reason:'Unresolved attribution'}}};
 const before=JSON.stringify(ledger);
 const seed={schemaVersion:2,book:'test',chapter:'001',people:[],claims:[],translationRepairs:[],coverage:{allUnitsVisited:false}};
 const job=prepareChapterOwner(root,{book:'test',chapter:'001',lane:'cursor-sdk',worker:'successor',ledger,freshSeed:seed});
 assert.equal(job.initialState,'recovery-private-draft');
 assert(job.authors.includes('retained-chunk-author'));
 assert(job.authors.includes('retained-agent'));
 const artifact=job.artifacts.find(a=>a.file===chunk);assert(artifact);
 assert.deepEqual(JSON.parse(chapterOperation(root,job.id,'owner','read',{artifact:artifact.id}).text),JSON.parse(bytes));
 assert.equal(fs.readFileSync(path.join(root,chunk),'utf8'),bytes);
 assert.equal(JSON.stringify(ledger),before);
 const recovery=JSON.parse(fs.readFileSync(path.join(ownerDirectory(root,job.id),'recovery-state.json')));
 assert.equal(recovery.dateClaim.circuitBreaker.rounds,3);
 assert.equal(recovery.identityClaim.reason,'Unresolved attribution');
 assert.equal(recovery.extraction.agentId,'retained-agent');
 assert.equal(job.firstInstallApprovalGranted,false);
 assert.deepEqual(job.coveredUnits,[]);
 assert.equal(fs.existsSync(path.join(root,'data/people/extractions/test/001.json')),false);
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

test('bounded exact-before replacement is atomic, revision guarded and role scoped',t=>{
 const {root,job,dir}=fixture(t),file=path.join(dir,'extraction.json'),d=JSON.parse(fs.readFileSync(file));d.people=[{id:'one'},{id:'two'},{id:'three'}];fs.writeFileSync(file,JSON.stringify(d));
 const args={revision:0,target:'extraction',pointer:'/people',expectedLength:3,replacements:[{index:0,before:{id:'one'},after:{id:'first'}},{index:2,before:{id:'wrong'},after:{id:'last'}}]};
 const before=fs.readFileSync(file);assert.throws(()=>chapterOperation(root,job.id,'owner','replace',args),/exact-before/);assert.deepEqual(fs.readFileSync(file),before);assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'job.json'))).revision,0);
 args.replacements[1].before={id:'three'};const r=chapterOperation(root,job.id,'owner','replace',args);assert.equal(r.revision,1);assert.equal(r.approvalGranted,false);
 assert.deepEqual(JSON.parse(fs.readFileSync(file)).people,[{id:'first'},{id:'two'},{id:'last'}]);assert.throws(()=>chapterOperation(root,job.id,'owner','replace',args),/Stale/);
 assert.throws(()=>chapterOperation(root,job.id,'owner','replace',{...args,revision:1,target:'identity-review'}),/Role cannot/);
 assert.throws(()=>chapterOperation(root,job.id,'owner','replace',{...args,revision:1,expectedLength:2}),/length changed/);
});
test('bounded replacement refuses duplicate indices, appends, unsafe pointers and oversized batches',t=>{
 const {root,job,dir}=fixture(t),file=path.join(dir,'extraction.json'),d=JSON.parse(fs.readFileSync(file));d.people=['one','two'];fs.writeFileSync(file,JSON.stringify(d));
 const args={revision:0,target:'extraction',pointer:'/people',expectedLength:2,replacements:[{index:0,before:'one',after:'changed'}]},before=fs.readFileSync(file);
 for(const override of [{replacements:[...args.replacements,...args.replacements]},{replacements:[{index:2,before:null,after:'appended'}]},{pointer:'/__proto__/bad'},{replacements:Array(33).fill(args.replacements[0])},{replacements:[{...args.replacements[0],extra:'ignored'}]}]){assert.throws(()=>chapterOperation(root,job.id,'owner','replace',{...args,...override}));assert.deepEqual(fs.readFileSync(file),before);}
});
test('independent reviewer can replace authored checks without owner access to review artifacts',t=>{
 const {root,job,dir}=fixture(t);job.status='reviewing';job.reviewAgentId='independent';fs.writeFileSync(path.join(dir,'job.json'),JSON.stringify(job));
 const file=path.join(dir,'review-validation.json');fs.writeFileSync(file,JSON.stringify({checks:[{verdict:'hold'}]}));
 const args={revision:0,target:'review-validation',pointer:'/checks',expectedLength:1,replacements:[{index:0,before:{verdict:'hold'},after:{verdict:'supported',reason:'Actual independent fixture judgment'}}]};
 assert.throws(()=>chapterOperation(root,job.id,'owner','replace',args),/frozen/);
 assert.equal(chapterOperation(root,job.id,'reviewer','replace',args).revision,1);assert.equal(JSON.parse(fs.readFileSync(file)).checks[0].verdict,'supported');
});

test('bounded removal validates all exact-before rows before deleting, preserving all other order and revision',t=>{
 const {root,job,dir}=fixture(t),file=path.join(dir,'extraction.json'),d=JSON.parse(fs.readFileSync(file));d.claims=['keep-first','remove-one','keep-middle','remove-two','keep-last'];fs.writeFileSync(file,JSON.stringify(d));
 const args={revision:0,target:'extraction',pointer:'/claims',expectedLength:5,removals:[{index:1,before:'remove-one'},{index:3,before:'wrong'}]},before=fs.readFileSync(file);
 assert.throws(()=>chapterOperation(root,job.id,'owner','remove',args),/Exact-before/);assert.deepEqual(fs.readFileSync(file),before);assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'job.json'))).revision,0);
 args.removals[1].before='remove-two';const result=chapterOperation(root,job.id,'owner','remove',args);assert.equal(result.revision,1);assert.equal(result.approvalGranted,false);
 assert.deepEqual(JSON.parse(fs.readFileSync(file)).claims,['keep-first','keep-middle','keep-last']);assert.throws(()=>chapterOperation(root,job.id,'owner','remove',args),/Stale/);
});
test('bounded removal rejects unsafe indices, repeated rows, stale lengths, role escalation and oversized batches',t=>{
 const {root,job,dir}=fixture(t),file=path.join(dir,'extraction.json'),d=JSON.parse(fs.readFileSync(file));d.claims=['keep','remove'];fs.writeFileSync(file,JSON.stringify(d));
 const args={revision:0,target:'extraction',pointer:'/claims',expectedLength:2,removals:[{index:1,before:'remove'}]},before=fs.readFileSync(file);
 for(const override of [{expectedLength:3},{removals:[...args.removals,...args.removals]},{removals:[{index:2,before:null}]},{target:'identity-review'},{pointer:'/__proto__/bad'},{removals:Array(33).fill(args.removals[0])},{removals:[{...args.removals[0],extra:true}]}]){assert.throws(()=>chapterOperation(root,job.id,'owner','remove',{...args,...override}));assert.deepEqual(fs.readFileSync(file),before);}
});
test('editorial reads expose exact native schema3 component hashes without changing raw records or bare-pointer hashes',t=>{
 const {root,job,dir}=fixture(t),file=path.join(dir,'editorial.json'),document={schemaVersion:4,book:'test',chapter:'001',reviews:[{reviewer:{agentId:'actual-reviewer'},decisions:[]},{reviewer:{agentId:null},decisions:[{decision:'reject',reason:''}]}]};
 fs.writeFileSync(file,JSON.stringify(document));const before=fs.readFileSync(file),result=chapterOperation(root,job.id,'reviewer','read',{artifact:'draft:editorial',pointer:'/reviews/1'});
 assert.deepEqual(result.editorialComponentHashes,editorialReviews(document).map((r,index)=>({index,documentHash:documentHash(r)})));
 assert.equal(result.documentHash,documentHash(document.reviews[1]));assert.notEqual(result.documentHash,result.editorialComponentHashes[1].documentHash);assert.deepEqual(fs.readFileSync(file),before);
});
test('single-review and empty editorial hash views preserve native document shape and grant no approval',t=>{
 const {root,job,dir}=fixture(t),file=path.join(dir,'editorial.json'),document={schemaVersion:3,book:'test',chapter:'001',reviewer:{agentId:null},decisions:[]};fs.writeFileSync(file,JSON.stringify(document));
 const result=chapterOperation(root,job.id,'owner','read',{artifact:'draft:editorial'});assert.deepEqual(result.editorialComponentHashes,[{index:0,documentHash:documentHash(document)}]);assert.equal(JSON.parse(result.text).reviewer.agentId,null);
 fs.writeFileSync(file,'{}');assert.deepEqual(chapterOperation(root,job.id,'owner','read',{artifact:'draft:editorial'}).editorialComponentHashes,[]);
 assert.equal(chapterOperation(root,job.id,'owner','read',{artifact:'draft:source'}).editorialComponentHashes,undefined);
});
