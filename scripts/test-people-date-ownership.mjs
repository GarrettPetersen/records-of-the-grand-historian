import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

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
fs.copyFileSync(fileURLToPath(new URL('../prompt-people-date-review.txt',import.meta.url)),path.join(root,'prompt-people-date-review.txt'));
process.env.PEOPLE_REPO_ROOT=root;
process.env.GIT_TERMINAL_PROMPT='0';
process.env.GIT_CONFIG_NOSYSTEM='1';
process.env.GIT_CONFIG_GLOBAL='/dev/null';
const {mutateRemotePeopleWorkLedger,readRemotePeopleWorkLedger,dateExecutorIsBusy,claimIsActive,reservePeopleTargetsInLedger,extractionClaimBlocksDateAudit}=await import('./lib/people-work-queue.mjs');
const {runDateWorkflow,assertCompletedGenerationSafe,dateWorkflowDirectory,CompletedDateGenerationHold,resolvedDatePreflight,revisePendingDateRepair}=await import('./lib/people-date-workflow.mjs');
const {buildDateAuditPacket,dateAuditStatus}=await import('./lib/people-date-audit.mjs');
const {writeJsonAtomic,readJson}=await import('./lib/people-content.mjs');
const source=fs.readFileSync(fileURLToPath(new URL('./run-people-date-workflow.mjs',import.meta.url)),'utf8');
const argsStart=source.indexOf('const {values:o} = parseArgs('),argsEnd=source.indexOf('const concurrency=',argsStart);
assert(argsStart>=0 && argsEnd>argsStart,'production argument validation anchors must be present');
const parseProductionArgs=new Function('parseArgs',source.slice(argsStart,argsEnd)+'\nreturn o;');
const argumentsFor=args=>parseProductionArgs(settings=>parseArgs({...settings,args}));
const marker='reserved=mutateRemotePeopleWorkLedger(ledger=>{';
const start=source.indexOf(marker);
const end=source.indexOf('},{message:`Reserve date audit ${key}`}).result;',start);
assert.ok(start>=0 && end>start,'production reservation callback anchors must be present');
assert.equal(source.indexOf(marker,start+1),-1,'reservation callback must be unambiguous');
const body=source.slice(start+marker.length,end);
const outcomeMarker='mutateRemotePeopleWorkLedger(ledger=>{';
const outcomeStart=source.indexOf(outcomeMarker,source.indexOf("if(result.status!=='audited')process.exitCode=1;"));
const outcomeEnd=source.indexOf('},{message:`Date review outcome ${key}`});',outcomeStart);
assert.ok(outcomeStart>=0 && outcomeEnd>outcomeStart,'production outcome callback anchors must be present');
const makeOutcome=new Function('key','executorToken','result',`return ledger=>{${source.slice(outcomeStart+outcomeMarker.length,outcomeEnd)}}`);
const makeCallback=new Function('o','key','target','packet','executorToken','leaseMs','dateExecutorIsBusy','claimIsActive','extractionClaimBlocksDateAudit','fs','path','os','dateWorkflowDirectory','readJson','assertCompletedGenerationSafe','CompletedDateGenerationHold','randomUUID','resolvedDatePreflight','options',`return ledger=>{${body}}`);
const reconcileMarker='mutateRemotePeopleWorkLedger(ledger=>{';
const reconcileStart=source.indexOf(reconcileMarker,source.indexOf('// Recover a completed host publication'));
const reconcileEnd=source.indexOf("},{message:'Reconcile completed date publications'});",reconcileStart);
assert.ok(reconcileStart>=0 && reconcileEnd>reconcileStart,'production startup callback anchors must be present');
const reconcileBody=source.slice(reconcileStart+reconcileMarker.length,reconcileEnd);
const makeReconcile=new Function('o','executorToken','dateExecutorIsBusy','os','fs','path','PEOPLE_DIR','dateAuditStatus','buildDateAuditPacket','readJson','completedDateClaimEvidence',`return ledger=>{${reconcileBody}}`);
const key='jinshu/127', target={book:'jinshu',chapter:'127'}, h1='sha256:'+'1'.repeat(64),h2='sha256:'+'2'.repeat(64);
const prior=(overrides={})=>({worker:'owner',lane:'openrouter',status:'stale-source',sourceHash:h1,extractionHash:h1,jobs:{retained:{agentId:'must-preserve'}},reviewPlans:{},...overrides});
const options={worker:'owner',lane:'openrouter',takeover:false,release:false,'retry-blocked':false};
const packet={sourceHash:h1,extractionHash:h1};
const workflow=path.join(root,'workflow');
const callback=(overrides={},packetOverrides={},preflight=()=>{},resolve=resolvedDatePreflight)=>makeCallback({...options,...overrides},key,target,{...packet,...packetOverrides},'test-token',3600000,dateExecutorIsBusy,claimIsActive,extractionClaimBlocksDateAudit,fs,path,os,()=>workflow,p=>JSON.parse(fs.readFileSync(p,'utf8')),preflight,CompletedDateGenerationHold,()=> 'fixture-generation',resolve,{maxRounds:3});
const reconcile=(evidence=()=>({ready:true}))=>makeReconcile(options,'test-token',dateExecutorIsBusy,os,{existsSync:()=>true},path,root,()=>({status:'audited'}),()=>packet,()=>({proposal:{extractionHash:h1}}),evidence);
const read=()=>readRemotePeopleWorkLedger();
const save=claim=>mutateRemotePeopleWorkLedger(l=>{l.claims={};l.dateAudits={[key]:structuredClone(claim)};delete l.dateAuditHistory;});
const run=cb=>mutateRemotePeopleWorkLedger(cb).result;

test('production CLI permits one source-preflight retry and rejects a broad unsupplemented retry',()=>{
  const args=['--worker','owner','--lane','cursor-sdk','--run','--model','offline','--retry-blocked'];
  assert.equal(argumentsFor(['--book','jinshu','--chapter','127',...args])['retry-blocked'],true);
  assert.throws(()=>argumentsFor(['--all',...args]),/one explicit chapter/);
  assert.throws(()=>argumentsFor(['--book','jinshu',...args]),/one explicit chapter/);
});

test('production CLI research retry reserves a real native amendment and still waits for independent approval',async()=>{
  const dataDir=path.join(root,'resume-source'),peopleDir=path.join(root,'resume-people');
  const opts={dataDir,peopleDir,maxUnits:10,maxBytes:64000,maxRounds:3,validateExtraction:()=>{}};
  writeJsonAtomic(path.join(dataDir,'jinshu/127.json'),{content:[{sentences:[{id:'s0001',zh:'甲在。',translation:'Jia was present.'}]}]});
  const extraction={schemaVersion:2,book:'jinshu',chapter:'127',input:{unitCount:1,chapterFingerprint:'fixture',candidateScannerVersion:2,unitDigests:[]},run:{model:'original-extractor'},people:[['p001',['Jia','甲'],'historical','Official',{a:['AD 2']}]],surfaces:[],claims:[['p001','attestation',{sourceDate:{text:'甲在'},westernYear:{era:'AD',year:2,precision:'year'}},'explicit',['s0001']]],translationRepairs:[],candidateDispositions:[],coverage:{}};
  const file=path.join(peopleDir,'extractions/jinshu/127.json');writeJsonAtomic(file,extraction);
  const originalPacket=buildDateAuditPacket('jinshu','127',opts),originalBytes=fs.readFileSync(file);
  const report=(task,bad)=>{
    const check=(id,item=false)=>({id,verdict:item&&bad?'incorrect':'supported',reason:'The cited fixture names Jia but states no calendar year for this presence.',...(item?{event:'Jia is present in the undated source.'}:{}),evidence:[{unit:'s0001',quote:'甲'}]});
    return {jobId:task.job.id,sourceHash:task.packet.sourceHash,extractionHash:task.packet.extractionHash,reviewedAt:new Date().toISOString(),reviewer:{name:'Independent fixture reviewer',agentId:bad?'first-source-reviewer':'fresh-source-reviewer',independentOfExtractor:true},summary:'All fixture units and date claims were checked directly against the Chinese source.',reviewedUnits:task.job.ownedUnits,itemChecks:task.job.ownedItems.map(id=>check(id,true)),personChecks:task.job.ownedPeople.map(id=>check(id)),findings:bad?task.job.ownedItems.map(id=>({items:[id],problem:'The fixture source supplies no year for this personal activity.',action:'Withdraw the invented date and preserve the source attestation.'})):[],references:[]};
  };
  const held=await runDateWorkflow(target,async task=>{
    if(task.kind!=='repair')return report(task,true);
    const before=task.extraction.claims[0],after=structuredClone(before);
    after[2]={sourceDate:{text:'甲在'},unresolved:true,unresolvedReason:'The inherited year is unsupported and requires source representation research.'};
    return {sourceHash:task.packet.sourceHash,extractionHash:task.packet.extractionHash,changes:[
      {kind:'replace',id:'claim-1',before,after,reason:'Remove the unsupported Western year while retaining the source occurrence.'},
      {kind:'hints',personId:'p001',before:['AD 2'],after:[],reason:'Remove the unsupported Western activity hint from this undated occurrence.'},
    ]};
  },opts);
  assert.equal(held.status,'research-blocked');
  const directory=dateWorkflowDirectory('jinshu','127',peopleDir),state=readJson(path.join(directory,'state.json')),candidate=readJson(path.join(directory,state.candidate));
  const current=buildDateAuditPacket('jinshu','127',{...opts,extraction:candidate}),before=candidate.claims[0],after=structuredClone(before);
  after[2]={undatedSourceAttestation:true,event:'Jia is explicitly named as present, with no calendar date in the source.'};
  revisePendingDateRepair(target,{sourceHash:current.sourceHash,extractionHash:current.extractionHash,author:{agentId:'host-source-researcher'},changes:[{kind:'replace',id:'claim-1',before,after,reason:'The source is genuinely undated, so preserve its event without inventing a calendar conversion.'}]},opts);
  save(prior({lane:'cursor-sdk',status:'research-blocked',sourceHash:originalPacket.sourceHash,extractionHash:originalPacket.extractionHash,researchPreflights:[held.researchPreflight]}));
  const args=argumentsFor(['--book','jinshu','--chapter','127','--worker','owner','--lane','cursor-sdk','--run','--model','offline','--retry-blocked']);
  const reserved=run(callback(args,originalPacket,()=>assertCompletedGenerationSafe(target,opts),(scope,claim)=>resolvedDatePreflight(scope,claim,opts)));
  assert.equal(reserved.status,'active');assert.equal(reserved.worker,'owner');assert.equal(reserved.preflightResolutions.length,1);
  assert.deepEqual(fs.readFileSync(file),originalBytes);assert.notEqual(dateAuditStatus('jinshu','127',opts).status,'audited');
  let independentReviews=0;
  const result=await runDateWorkflow(target,async task=>{assert.equal(task.kind,'review');assert(task.key.startsWith('reaudit-2-'));independentReviews++;return report(task,false);},opts);
  assert(independentReviews>0);assert.equal(result.status,'audited');
  run(makeOutcome(key,'test-token',result));
  assert.equal(read().dateAudits[key].status,'ready');assert.equal(read().dateAudits[key].preflightResolutions.length,1);
  assert.equal(readJson(file).claims[0][2].undatedSourceAttestation,true);
});

test('production reservation records native preflight resolution while retaining owner and jobs',()=>{
  const proof={preflightContentHash:h1,candidateExtractionHash:h2,authorAgentId:'source-researcher',round:2};
  save(prior({lane:'cursor-sdk',status:'research-blocked',researchPreflights:[{contentHash:h1}]}));
  let calls=0;
  const resolve=(scope,claim,settings)=>{assert.deepEqual(scope,target);assert.equal(claim.worker,'owner');assert.equal(settings.maxRounds,3);calls++;return proof;};
  const result=run(callback({lane:'cursor-sdk','retry-blocked':true},{},()=>{},resolve));
  assert.equal(calls,1);assert.equal(result.worker,'owner');assert.equal(result.executorToken,'test-token');
  assert.deepEqual(result.jobs,{retained:{agentId:'must-preserve'}});
  assert.deepEqual(result.researchPreflights,[{contentHash:h1}]);assert.deepEqual(result.preflightResolutions,[proof]);
  save({...result,status:'research-blocked'});
  run(callback({lane:'cursor-sdk','retry-blocked':true},{},()=>{},resolve));
  assert.deepEqual(read().dateAudits[key].preflightResolutions,[proof]);
});

test('production reservation cannot use preflight retry for an old worker blocker',()=>{
  save(prior({lane:'cursor-sdk',status:'research-blocked'}));const before=read().dateAudits[key];
  assert.throws(()=>run(callback({lane:'cursor-sdk','retry-blocked':true})),/worker research supplement or saved chapter preflight/);
  assert.deepEqual(read().dateAudits[key],before);
});

for(const change of [{worker:'other'},{executorToken:'other-token',executorExpiresAt:new Date(Date.now()+3600000).toISOString()}])test('preflight retry preserves a foreign owner or live executor before inspecting source work',()=>{
  save(prior({lane:'cursor-sdk',status:'research-blocked',...change}));const before=read().dateAudits[key];
  const result=run(callback({lane:'cursor-sdk','retry-blocked':true},{},()=>{},()=>{throw Error('must not inspect foreign source work');}));
  assert.equal(result,null);assert.deepEqual(read().dateAudits[key],before);
});

for(const pending of [{kind:'reviewed-combined-source-identity-date-curation',receiptHash:h1},null]) {
  for(const [label,override] of [
    ['same owner',{}],['foreign owner',{worker:'other'}],['release',{release:true}],
    ['foreign release',{worker:'other',release:true}],['takeover',{takeover:true}],
    ['release with takeover',{release:true,takeover:true}],
  ])test(`pending ${pending===null?'null':'receipt'} prevents ${label}`,()=>{
    const claim=prior({status:'active',combinedCuration:pending});save(claim);
    const before=read();assert.throws(()=>run(callback(override)),e=>e instanceof CompletedDateGenerationHold && /Combined curation .* pending/.test(e.message));
    assert.deepEqual(read(),before);
  });
  for(const status of ['active','research-blocked','ready'])test(`pending ${pending===null?'null':'receipt'} prevents reconciliation and extraction at ${status}`,()=>{
    const claim=prior({status,combinedCuration:pending,executorToken:'expired',executorExpiresAt:'2020-01-01T00:00:00.000Z'});save(claim);
    run(reconcile());assert.deepEqual(read().dateAudits[key],claim);
    const result=run(l=>reservePeopleTargetsInLedger(l,[{...target,chapterFingerprint:h1}],{worker:'extractor',lane:'cursor-sdk',limit:1}));
    assert.equal(result.claimed.length,0);assert.equal(result.blocked.length,1);
    assert.deepEqual(read().dateAudits[key],claim);
  });
}

for(const claim of [null,prior({status:'ready'}),prior({status:'active'})])test(`generation hold does not change ${claim?.status??'absent'} queue reservation`,()=>{
  mutateRemotePeopleWorkLedger(l=>{l.claims={};l.dateAudits={};delete l.dateAuditHistory;if(claim)l.dateAudits[key]=structuredClone(claim);});
  const before=read();assert.throws(()=>run(callback({}, {},()=>{throw new Error('retained report hold');})),/retained report hold/);
  assert.deepEqual(read(),before);
});

test('other worker cannot take stale-source, even after lease expiry',()=>{
  const claim=prior(); save(claim);
  assert.equal(run(callback({worker:'intruder'})),null);
  const actual=read();assert.deepEqual(actual.dateAudits[key],claim);assert.equal(actual.dateAuditHistory,undefined);
});
test('other lane cannot take stale-source with same worker',()=>{
  const claim=prior();save(claim);assert.equal(run(callback({lane:'manual'})),null);
  assert.deepEqual(read().dateAudits[key],claim);
});

test('research preflight outcome preserves ownership and deduplicates pinned history',()=>{
  const claim=prior({status:'active',executorToken:'preflight-owner-token',
    executorExpiresAt:new Date(Date.now()+3600000).toISOString()});save(claim);
  const researchPreflight={file:'research-preflight-1-fixture.json',contentHash:`sha256:${'c'.repeat(64)}`,
    sourceHash:claim.sourceHash,extractionHash:`sha256:${'d'.repeat(64)}`,candidateFile:'candidate-1.json',round:1,unresolvedItems:1};
  const outcome=makeOutcome(key,'preflight-owner-token',{status:'research-blocked',researchPreflight});
  run(outcome);run(outcome);
  const held=read().dateAudits[key];
  assert.equal(held.status,'research-blocked');
  assert.equal(held.worker,claim.worker);
  assert.equal(held.executorToken,claim.executorToken);
  assert.deepEqual(held.jobs,claim.jobs);
  assert.deepEqual(held.researchPreflights,[researchPreflight]);
  run(makeOutcome(key,'preflight-owner-token',{status:'audited'}));
  assert.equal(read().dateAudits[key].status,'ready');
  assert.deepEqual(read().dateAudits[key].researchPreflights,[researchPreflight]);
});

test('research preflight cannot update another executor reservation',()=>{
  save(prior({status:'active',executorToken:'actual-owner-token',
    executorExpiresAt:new Date(Date.now()+3600000).toISOString()}));
  const before=read();
  assert.throws(()=>run(makeOutcome(key,'intruder-token',{status:'research-blocked',researchPreflight:{file:'untrusted'}})),/Lost date reservation/);
  assert.deepEqual(read(),before);
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
test('startup reconciliation retains a claim without matching completed-generation evidence',()=>{
  const claim=prior({status:'active'});save(claim);run(reconcile(()=>({ready:false,reason:'generation mismatch'})));
  assert.deepEqual(read().dateAudits[key],claim);
});
test('startup reconciliation respects an active executor lease',()=>{
  const claim=prior({status:'active',executorToken:'live-token',executorHost:os.hostname(),executorExpiresAt:new Date(Date.now()+3600000).toISOString()});
  save(claim);run(reconcile());assert.deepEqual(read().dateAudits[key],claim);
});

test('real workflow generation guard prevents a production callback from changing the local Git-backed queue',async()=>{
  const dataDir=path.join(root,'chapter-fixture'),peopleDir=path.join(root,'people-fixture');
  const opts={dataDir,peopleDir,maxUnits:10,maxBytes:64000,maxRounds:0,validateExtraction:()=>{}};
  writeJsonAtomic(path.join(dataDir,'jinshu/127.json'),{content:[{sentences:[{id:'s0001',zh:'元年甲卒。',translation:'Jia died in year one.'}]}]});
  const extraction={schemaVersion:2,book:'jinshu',chapter:'127',input:{unitCount:1,chapterFingerprint:'fixture',candidateScannerVersion:2,unitDigests:[]},run:{model:'original-extractor'},people:[['p001',['Jia','甲'],'historical','Official',{a:['AD 2']}]],surfaces:[],claims:[['p001','attestation',{sourceDate:{text:'元年'},westernYear:{era:'AD',year:2,precision:'year'}},'explicit',['s0001']]],translationRepairs:[],candidateDispositions:[],coverage:{}};
  writeJsonAtomic(path.join(peopleDir,'extractions/jinshu/127.json'),extraction);
  const worker=async task=>{
    const check=(id,item=false)=>({id,verdict:item?'incorrect':'supported',reason:'Fixture event and date ownership were checked against the test source.',...(item?{event:'The named person participates in the fixture event.'}:{}),evidence:[{unit:'s0001',quote:'元年'}]});
    return {jobId:task.job.id,sourceHash:task.packet.sourceHash,extractionHash:task.packet.extractionHash,reviewedAt:new Date().toISOString(),reviewer:{name:'Independent fixture reviewer',agentId:'fixture-reviewer',independentOfExtractor:true},summary:'Every owned source unit and date item was reviewed in this fixture.',reviewedUnits:task.job.ownedUnits,itemChecks:task.job.ownedItems.map(id=>check(id,true)),personChecks:task.job.ownedPeople.map(id=>check(id)),findings:task.job.ownedItems.map(id=>({items:[id],problem:'The fixture date does not match the source event.',action:'Correct the fixture date and any related date hints.'})),references:[]};
  };
  assert.equal((await runDateWorkflow(target,worker,opts)).status,'needs-revision');
  const file=path.join(dateWorkflowDirectory('jinshu','127',peopleDir),'state.json'),state=readJson(file);state.phase='complete';writeJsonAtomic(file,state);
  const claim=prior({status:'ready'});save(claim);const before=read();
  assert.throws(()=>run(callback({}, {},()=>assertCompletedGenerationSafe(target,opts))),/needs-revision report/);
  assert.deepEqual(read(),before);assert.equal(readJson(file).phase,'complete');
});
