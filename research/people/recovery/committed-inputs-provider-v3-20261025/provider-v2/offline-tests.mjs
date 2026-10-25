import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import vm from 'node:vm';import {execFileSync} from 'node:child_process';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
const ROOT='/Users/garrettpetersen/records-of-the-grand-historian',REF='d1d2494017426c278606f323233ee335e33b6eeb',SDK='scripts/sdk-people-resolve.mjs',DIR=new URL('.',import.meta.url),RUNTIME=JSON.parse(fs.readFileSync(ROOT+'/data/people/generated/independent-identity-recovery/jinshu053-source106-7b6e4f-20261025/input-pin-manifest.json')).runtime;
const hash=b=>createHash('sha256').update(b).digest('hex'),fp=b=>'sha256:'+hash(b),pins=new Map(),trace={apiCalls:0,localCorpusReads:0,blobBatches:[]};
const gitSource=f=>{const bytes=execFileSync('git',['-C',ROOT,'show',REF+':'+f],{maxBuffer:2e6});pins.set(f,hash(bytes));return bytes.toString()};
async function load(rootOverride=null){const cache=new Map();async function mod(f){if(cache.has(f))return cache.get(f);const source=f===SDK?fs.readFileSync(new URL('sdk-people-resolve.draft.mjs',DIR),'utf8')+'\nexport {selfTest, parseArgs, verifyPreparedSourceFiles, loadPreparedDossiers, writeShardCheckpoint, writeCommittedInputsReceipt, main};\n':gitSource(f);const m=new vm.SourceTextModule(source,{identifier:f,initializeImportMeta(meta){meta.url=pathToFileURL(RUNTIME+'/'+f).href}});cache.set(f,m);return m}
const synthetic=async(key,namespace)=>{if(cache.has(key))return cache.get(key);const m=new vm.SyntheticModule(Object.keys(namespace),function(){for(const[k,v]of Object.entries(namespace))this.setExport(k,v)},{identifier:key});cache.set(key,m);return m};
async function linker(specifier,from){
 if(rootOverride&&from.identifier===SDK&&specifier==='./lib/people-content.mjs'){const m=await mod('scripts/lib/people-content.mjs');await m.link(linker);await m.evaluate();return synthetic('fixture-sdk-content',{...m.namespace,REPO_ROOT:rootOverride,PEOPLE_DIR:path.join(rootOverride,'data/people')})}
 if(rootOverride&&from.identifier===SDK&&specifier==='./lib/people-corpus.mjs'){const m=await mod('scripts/lib/people-corpus.mjs');await m.link(linker);await m.evaluate();return synthetic('fixture-sdk-corpus',{...m.namespace,loadValidatedPeopleCorpus(){trace.localCorpusReads++;throw Error('Local corpus read forbidden in committed fixture')}})}
 if(specifier.startsWith('.'))return mod(path.posix.normalize(path.posix.join(path.posix.dirname(from.identifier),specifier)));
 const resolved=specifier.startsWith('node:')?specifier:import.meta.resolve(specifier),namespace=await import(resolved);
 if(rootOverride&&from.identifier===SDK&&specifier==='node:child_process')return synthetic('fixture-git-trace',{...namespace,execFileSync(command,args,opts){const result=namespace.execFileSync(command,args,opts);if(command==='git'&&args.includes('--batch'))trace.blobBatches.push(result.length);return result}});
 if(rootOverride&&specifier==='@cursor/sdk')return synthetic('fixture-no-api',{...namespace,Agent:new Proxy(namespace.Agent,{construct(){trace.apiCalls++;throw Error('API call forbidden')},get(){trace.apiCalls++;throw Error('API call forbidden')}})});
 return synthetic(resolved,namespace)
}
 const entry=await mod(SDK);await entry.link(linker);await entry.evaluate();return entry.namespace}
const ordinary=await load();await ordinary.selfTest();
const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'committed-inputs-offline-'));
try{
const write=(f,data)=>{const file=path.join(fixture,f);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data)};
const git=args=>execFileSync('git',['-C',fixture,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
write('prompt-people-resolution.txt','Offline fixture prompt.');
const sources=[];
for(const chapter of ['001','002','003'])sources.push({file:`data/fixture/${chapter}.json`,bytes:Buffer.from(JSON.stringify({source:chapter,text:'測試'})+'\n')},{file:`data/people/extractions/fixture/${chapter}.json`,bytes:Buffer.from(JSON.stringify({extraction:chapter})+'\n')});
for(const file of ['data/people/resolutions/fixture.json','data/people/resolutions/history/older.json'])sources.push({file,bytes:Buffer.from('{"decisions":[]}\n')});
for(const source of sources)write(source.file,source.bytes);
write('data/fixture/999.json/child','tree fixture');
const stress=[];for(let i=100;i<170;i++){const file=`data/fixture/${i}.json`,bytes=Buffer.from(JSON.stringify({i})+'\n');write(file,bytes);sources.push({file,bytes});const extraction={file:`data/people/extractions/fixture/${i}.json`,bytes:Buffer.from('{}\n')};write(extraction.file,extraction.bytes);sources.push(extraction);stress.push({file,fingerprint:fp(bytes)})}
for(let i=170;i<172;i++){const file=`data/fixture/${i}.json`,bytes=Buffer.from('"'+String(i).slice(-1).repeat(17*1024*1024)+'"\n');write(file,bytes);sources.push({file,bytes});const extraction={file:`data/people/extractions/fixture/${i}.json`,bytes:Buffer.from('{}\n')};write(extraction.file,extraction.bytes);sources.push(extraction);stress.push({file,fingerprint:fp(bytes)})}
const batch='committed-inputs-fixture',shard=batch+'-shard-001',dossierDir='data/people/resolver-inputs/fixture',a='fixture:001:p001',b='fixture:002:p001',ca='per_00000000000000000001',cb='per_00000000000000000002';
const document={schemaVersion:1,batch:shard,targetLocalPeople:[a],blocks:[{id:'fixture-block',component:1,localPeople:[a,b],currentGroups:[[a],[b]],sharedNames:[],reviewPairs:[[ca,cb]]}],people:{[a]:{localId:a,currentCanonicalPersonId:ca,targetOfThisPass:true,nameKeys:[],familyRelationships:[]},[b]:{localId:b,currentCanonicalPersonId:cb,targetOfThisPass:false,nameKeys:[],familyRelationships:[]}},priorSeparations:[],outputSeed:{schemaVersion:1,batch:shard,decisions:[]}};
const serialized=JSON.stringify(document,null,2)+'\n';write(dossierDir+'/'+shard+'.json',serialized);
const manifest={schemaVersion:1,batch,selection:{allUnresolved:false,chapters:['fixture/001'],shards:8,componentShards:false},sourceFiles:sources.map(({file,bytes})=>({file,fingerprint:fp(bytes)})),dossiers:[{batch:shard,shard:1,file:dossierDir+'/'+shard+'.json',documentFingerprint:fp(Buffer.from(JSON.stringify(document))),workerFile:null,workerFingerprint:null}]};
write(dossierDir+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');
git(['init','-q']);git(['-c','user.name=Offline Fixture','-c','user.email=offline@example.invalid','add','.']);git(['-c','user.name=Offline Fixture','-c','user.email=offline@example.invalid','commit','-qm','Offline immutable input fixture']);const commit=git(['rev-parse','HEAD']).trim();
const orphanDocument=structuredClone(document),orphan='fixture:097:p001';orphanDocument.people[orphan]={...orphanDocument.people[b],localId:orphan};
const orphanManifest=structuredClone(manifest);orphanManifest.dossiers[0].documentFingerprint=fp(Buffer.from(JSON.stringify(orphanDocument)));
const orphanText=JSON.stringify(orphanDocument,null,2)+'\n',orphanManifestText=JSON.stringify(orphanManifest,null,2)+'\n';
write(dossierDir+'/'+shard+'.json',orphanText);write(dossierDir+'/manifest.json',orphanManifestText);
git(['add',dossierDir]);git(['-c','user.name=Offline Fixture','-c','user.email=offline@example.invalid','commit','-qm','Orphan person fixture']);const orphanCommit=git(['rev-parse','HEAD']).trim();
write('data/people/extractions/fixture/999.json','{}\n');git(['add','data/people/extractions/fixture/999.json']);git(['-c','user.name=Offline Fixture','-c','user.email=offline@example.invalid','commit','-qm','Tree source fixture']);const treeCommit=git(['rev-parse','HEAD']).trim();
git(['rm','-q','data/people/extractions/fixture/999.json']);write('data/people/extractions/fixture/098.json','{}\n');git(['add','data/people/extractions/fixture/098.json']);git(['-c','user.name=Offline Fixture','-c','user.email=offline@example.invalid','commit','-qm','Missing source fixture']);const missingCommit=git(['rev-parse','HEAD']).trim();
write(dossierDir+'/'+shard+'.json',serialized);write(dossierDir+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');
write(sources[0].file,'{"changed":"local"}\n');fs.unlinkSync(path.join(fixture,sources[1].file));
const api=await load(fixture),opts=api.parseArgs(['--batch',batch,'--chapters','fixture/001','--dossier-dir',dossierDir,'--starting-ref',commit,'--committed-inputs','--recover-only','--skip-cloud-recovery']);
const prepared=api.loadPreparedDossiers(opts);assert.equal(prepared.dossiers.length,1);assert.equal(prepared.dossiers[0].committedInputProvenance.startingRef,commit);
assert.throws(()=>api.loadPreparedDossiers({...opts,committedInputs:false}),/source changed|Missing resolver source/);
write(sources[0].file,sources[0].bytes);assert.throws(()=>api.loadPreparedDossiers({...opts,committedInputs:false}),/Missing resolver source/);write(sources[0].file,'{"changed":"local"}\n');
api.verifyPreparedSourceFiles(manifest.sourceFiles,opts);assert(trace.blobBatches.length>=3);assert(Math.max(...trace.blobBatches)<32*1024*1024+8192);
const replaceFirst=source=>[source,...manifest.sourceFiles.slice(1)];
for(const bad of [replaceFirst({...manifest.sourceFiles[0],fingerprint:'sha256:'+'0'.repeat(64)}),replaceFirst({file:'data/fixture/098.json',fingerprint:fp(Buffer.from('missing'))}),replaceFirst({file:'data/fixture/999.json',fingerprint:fp(Buffer.from('tree'))}),[...manifest.sourceFiles,manifest.sourceFiles[0]],replaceFirst({file:'../outside.json',fingerprint:fp(Buffer.from('outside'))}),replaceFirst({...manifest.sourceFiles[0],fingerprint:'bad'})])assert.throws(()=>api.verifyPreparedSourceFiles(bad,opts));
for(const [chapter,startingRef] of [['999',treeCommit],['098',missingCommit]]) {
 const sourceFiles=[...manifest.sourceFiles,{file:`data/fixture/${chapter}.json`,fingerprint:fp(Buffer.from('absent or tree'))},{file:`data/people/extractions/fixture/${chapter}.json`,fingerprint:fp(Buffer.from('{}\n'))}];
 assert.throws(()=>api.verifyPreparedSourceFiles(sourceFiles,{...opts,startingRef}),/Missing, non-blob/);
}
for(const omitted of ['data/fixture/002.json','data/people/extractions/fixture/002.json','data/fixture/003.json','data/people/extractions/fixture/003.json','data/people/resolutions/fixture.json','data/people/resolutions/history/older.json']) {
 assert.throws(()=>api.verifyPreparedSourceFiles(manifest.sourceFiles.filter(source=>source.file!==omitted),opts),/inventory mismatch/);
}
write(dossierDir+'/'+shard+'.json',orphanText);write(dossierDir+'/manifest.json',orphanManifestText);
assert.throws(()=>api.loadPreparedDossiers({...opts,startingRef:orphanCommit}),/person lacks a complete source\/extraction chapter/);
write(dossierDir+'/'+shard+'.json',serialized);write(dossierDir+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');
assert.throws(()=>api.loadPreparedDossiers({...opts,startingRef:'HEAD'}),/immutable/);
assert.throws(()=>api.loadPreparedDossiers({...opts,startingRef:'0'.repeat(40)}));
assert.throws(()=>api.loadPreparedDossiers({...opts,prepareDossiers:true}),/prepared execution/);
assert.throws(()=>api.loadPreparedDossiers({...opts,dossierDir:null}),/prepared execution/);
assert.throws(()=>api.loadPreparedDossiers({...opts,out:path.join(fixture,'data/people/resolutions/forbidden.json')}),/forbids --out/);
// Packets remain required to match both local bytes and the immutable commit.
const packet=path.join(fixture,dossierDir,shard+'.json');fs.appendFileSync(packet,' ');assert.throws(()=>api.loadPreparedDossiers(opts),/does not match the current corpus/);fs.writeFileSync(packet,serialized);
const decision={schemaVersion:1,batch:shard,decisions:[{decision:'keep-separate',localPeople:[a,b],basis:['fixture'],confidence:'high'}]};api.writeShardCheckpoint(prepared.dossiers[0],decision);
process.env.CURSOR_API_KEY='offline-fixture';process.argv=['node','offline-driver','--batch',batch,'--chapters','fixture/001','--dossier-dir',dossierDir,'--starting-ref',commit,'--committed-inputs','--recover-only','--skip-cloud-recovery'];
await api.main();
const receiptFile=path.join(fixture,'data/people/generated/resolution-shards',batch,'committed-inputs-receipt.json'),receipt=JSON.parse(fs.readFileSync(receiptFile));
assert.equal(receipt.globallyAccepted,false);assert.equal(receipt.publicationApproved,false);assert.equal(receipt.committedInputProvenance.startingRef,commit);assert.equal(receipt.shards[0].status,'structurally-accepted-pending-host-acceptance');assert.equal(receipt.shards[0].fingerprint,fp(fs.readFileSync(path.join(fixture,receipt.shards[0].checkpoint))));assert(!fs.existsSync(path.join(fixture,'data/people/resolutions',batch+'.json')));assert.equal(trace.apiCalls,0);assert.equal(trace.localCorpusReads,0);
const pendingReceipt=api.writeCommittedInputsReceipt(prepared.dossiers,[],opts);assert.equal(pendingReceipt.shards[0].status,'pending');
const committedModeLocalCorpusReads=trace.localCorpusReads;
const receiptBefore=hash(fs.readFileSync(receiptFile));for(const source of sources)write(source.file,source.bytes);
process.argv=['node','offline-driver','--batch',batch,'--chapters','fixture/001','--dossier-dir',dossierDir,'--starting-ref',commit,'--recover-only','--skip-cloud-recovery'];
await assert.rejects(api.main(),/Local corpus read forbidden/);assert.equal(trace.localCorpusReads,1);assert.equal(hash(fs.readFileSync(receiptFile)),receiptBefore);assert(!fs.existsSync(path.join(fixture,'data/people/resolutions',batch+'.json')));
const result={base:REF,ordinarySdkSelfTest:'PASS',realTemporaryGitFixture:'PASS',commit,exactFullCommittedInventory:'PASS; visible002 plus unrelated003 and recursive prior inputs required',inventoryOmissionsAndOrphanPersonReject:'PASS',completeInventoryMissingAndTreeSourcesReject:'PASS',committedDirtyAndMissingLocalSource:'PASS',defaultDirtyLocalSourceRejects:'PASS',rawMismatchMissingNonBlobDuplicateOutsidePathMalformedFingerprintReject:'PASS',mutableRefInvalidModeExplicitOutAndChangedPacketReject:'PASS',boundedBatches:{count:trace.blobBatches.length,largestBytes:Math.max(...trace.blobBatches)},completeCheckpointMainReturnsPendingReceipt:'PASS',partialReceiptRemainsPending:'PASS',canonicalOutputWritten:false,apiCalls:trace.apiCalls,committedModeLocalCorpusReads,ordinaryAggregateFailurePropagates:'PASS; local corpus gate attempted and trapped, receipt unchanged',candidateSha256:hash(fs.readFileSync(new URL('sdk-people-resolve.draft.mjs',DIR))),canonicalDependencyPins:[...pins].map(([path,sha256])=>({path,sha256})),fixtureRootInjection:'Test-only SDK imports override REPO_ROOT/PEOPLE_DIR; schema/core dependencies remain exact canonical modules. API and local corpus access trapped; actual main executes recovery of an existing structural checkpoint.'};
fs.writeFileSync(new URL('offline-test-result.json',DIR),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{fs.rmSync(fixture,{recursive:true,force:true})}
