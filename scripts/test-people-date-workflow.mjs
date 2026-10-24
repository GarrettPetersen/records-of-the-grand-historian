import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { writeJsonAtomic, readJson, sha256 } from './lib/people-content.mjs';
import { buildDateAuditPacket, dateAuditStatus, dateAuditReferencesCurrent } from './lib/people-date-audit.mjs';
import { completedDateClaimEvidence, dateReviewJobs, retainedDateReviewJobs, dateRepairJobs, applyDateRepairProposal, applyDateRepairEditorialAmendment, dateRepairDifference, runDateWorkflow, dateWorkflowDirectory, publishDateRepair, validateDateJobResult, revisePendingDateRepair, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { editorialDecisionSeed } from './lib/people-editorial-decisions.mjs';
import { createDateWorkerPool } from './lib/people-date-concurrency.mjs';
import { validatePeopleWorkLedger, reservePeopleTargetsInLedger, dateExecutorIsBusy, extractionClaimBlocksDateAudit } from './lib/people-work-queue.mjs';
import { cursorDateWorker } from './lib/people-date-worker.mjs';
import { createRunControl } from './lib/cursor-run-control.mjs';

function fixture(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'date-workflow-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const options={dataDir:path.join(root,'data'),peopleDir:path.join(root,'people'),maxUnits:1,maxBytes:64000,validateExtraction:()=>{}};
  const source={content:[{sentences:[{id:'s0001',zh:'元年甲卒。',translation:'Jia died in year one.'},{id:'s0002',zh:'乙在。',translation:'Yi was present.'}]}]};
  const extraction={schemaVersion:2,book:'fixture',chapter:'001',input:{unitCount:2,chapterFingerprint:'fixture',candidateScannerVersion:2,unitDigests:[]},run:{model:'original-extractor'},
    people:[['p001',['Jia','甲'],'historical','Official',{a:['AD 2']}],['p002',['Yi','乙'],'historical','Official',{a:['AD 1']}]],
    surfaces:[],claims:[['p001','attestation',{sourceDate:{text:'元年'},westernYear:{era:'AD',year:2,precision:'year'}},'explicit',['s0001']],['p002','attestation',{sourceDate:{text:'元年'},westernYear:{era:'AD',year:1,precision:'year'}},'explicit',['s0002']],['p001','role',{roleId:'official'},'explicit',['s0001']]],translationRepairs:[],candidateDispositions:[],coverage:{}};
  const sourceFile=path.join(options.dataDir,'fixture/001.json'),file=path.join(options.peopleDir,'extractions/fixture/001.json');
  writeJsonAtomic(sourceFile,source);writeJsonAtomic(file,extraction);
  return {options,source,sourceFile,extraction,file,packet:buildDateAuditPacket('fixture','001',options)};
}
function review(task) {
  const check=(id,item=false)=>({id,verdict:'supported',reason:'Fixture event and date ownership were checked against the test source.',...(item?{event:'The named person participates in the fixture event.'}:{}),evidence:[{unit:'s0001',quote:'元年'}]});
  const result={jobId:task.job.id,sourceHash:task.packet.sourceHash,extractionHash:task.packet.extractionHash,
    reviewedAt:new Date().toISOString(),reviewer:{name:'Independent fixture reviewer',agentId:`review-${task.key}`,independentOfExtractor:true},
    summary:'Every owned source unit and date item was reviewed in this fixture.',reviewedUnits:task.job.ownedUnits,
    itemChecks:task.job.ownedItems.map(id=>check(id,true)),personChecks:task.job.ownedPeople.map(id=>check(id)),findings:[],references:[]};
  for (const item of task.job.items) if((item.value?.westernYear?.year===2)||(item.id==='hints-p001'&&item.value.includes('AD 2'))) {
    result.itemChecks.find(c=>c.id===item.id).verdict='incorrect';
    result.findings.push({items:[item.id],problem:'Fixture date two does not match the first-year source.',action:'Correct this fixture event to year one and synchronize its hint.'});
  }
  return result;
}
function repair(task) {
  const before=task.extraction.claims[0],after=structuredClone(before);after[2].westernYear.year=1;
  return {sourceHash:task.packet.sourceHash,extractionHash:task.packet.extractionHash,changes:[
    {kind:'replace',id:'claim-1',before,after,reason:'The fixture first-year event supports year one, not year two.'},
    {kind:'hints',personId:'p001',before:['AD 2'],after:['AD 1'],reason:'Synchronize the fixture hint with the corrected personal event.'}]};
}

test('date claim recovery requires its own completed generation report', async t => {
  const f=fixture(t),scope={book:'fixture',chapter:'001'};
  const directory=dateWorkflowDirectory(scope.book,scope.chapter,f.options.peopleDir);
  const claim={sourceHash:f.packet.sourceHash,extractionHash:f.packet.extractionHash,generationId:'generation-one'};
  assert.match(completedDateClaimEvidence({...scope,claim},f.options).reason,/missing/);
  const worker=async task=>{const result=review(task);for(const item of result.itemChecks)item.verdict='supported';result.findings=[];return result;};
  await runDateWorkflow(scope,worker,{...f.options,generationId:claim.generationId});
  const stateFile=path.join(directory,'state.json'),state=readJson(stateFile);
  assert.equal(state.phase,'complete');
  assert.equal(completedDateClaimEvidence({...scope,claim},f.options).ready,true);
  assert.match(completedDateClaimEvidence({...scope,claim:{...claim,generationId:'new-generation'}},f.options).reason,/generation identity/);
  assert.match(completedDateClaimEvidence({...scope,claim:{...claim,generationId:undefined}},f.options).reason,/generation identity/);
  assert.match(completedDateClaimEvidence({...scope,claim:{...claim,sourceHash:'other'}},f.options).reason,/fingerprints/);
  writeJsonAtomic(stateFile,{...state,phase:'audit'});
  assert.match(completedDateClaimEvidence({...scope,claim},f.options).reason,/not complete/);
  writeJsonAtomic(stateFile,{...state,phase:'publish'});
  assert.match(completedDateClaimEvidence({...scope,claim},f.options).reason,/not complete/);
  writeJsonAtomic(stateFile,{...state,review:'../review-0.json'});
  assert.match(completedDateClaimEvidence({...scope,claim},f.options).reason,/identity/);
  writeJsonAtomic(stateFile,state);
  const reviewFile=path.join(directory,state.review),saved=readJson(reviewFile);
  writeJsonAtomic(reviewFile,{...saved,summary:'A different valid-looking historical review summary.'});
  assert.match(completedDateClaimEvidence({...scope,claim},f.options).reason,/differs/);
});

test('newer external hold blocks retained workflow without changing artifacts or calling worker', async t => {
  const f=fixture(t),scope={book:'fixture',chapter:'001'};
  const worker=async task=>{const result=review(task);for(const item of result.itemChecks)item.verdict='supported';result.findings=[];return result;};
  await runDateWorkflow(scope,worker,{...f.options,generationId:'generation-one'});
  const directory=dateWorkflowDirectory(scope.book,scope.chapter,f.options.peopleDir),stateFile=path.join(directory,'state.json');
  const oldState=readJson(stateFile);writeJsonAtomic(stateFile,{...oldState,phase:'audit'});
  const reportFile=path.join(f.options.peopleDir,'date-audits/fixture/001.json'),oldReport=readJson(reportFile);
  const hold={...oldReport,status:'research-blocked',reviewedUnits:[],itemChecks:[],personChecks:[],findings:[{items:['hints-p001'],problem:'Current evidence needs an independent source review.',action:'Independently assess the source and preserve this hold.'}]};
  writeJsonAtomic(reportFile,hold);const before=fs.readFileSync(stateFile,'utf8');let calls=0;
  await assert.rejects(runDateWorkflow(scope,async()=>{calls++;throw Error('unexpected');},f.options),/cannot be safely seeded/);
  assert.equal(calls,0);assert.equal(fs.readFileSync(stateFile,'utf8'),before);assert.deepEqual(readJson(reportFile),hold);
});
test('mismatched restored generation is held before state or report mutation',async t=>{
  const f=fixture(t),scope={book:'fixture',chapter:'001'},directory=dateWorkflowDirectory(scope.book,scope.chapter,f.options.peopleDir);
  const stateFile=path.join(directory,'state.json');
  const state={schemaVersion:1,workflowVersion:1,sourceHash:f.packet.sourceHash,extractionHash:f.packet.extractionHash,generationId:'old',round:0,phase:'audit',jobs:{},restoredFromLedger:true};
  writeJsonAtomic(stateFile,state);let calls=0;
  await assert.rejects(runDateWorkflow(scope,async()=>{calls++;}, {...f.options,generationId:'new'}),/does not match the reserved generation/);
  assert.deepEqual(readJson(stateFile),state);assert.equal(calls,0);
});

test('startup reconciliation preserves interrupted sticky claims and accepts matching completed generation', async t => {
  const f=fixture(t),scope={book:'fixture',chapter:'001'};
  const worker=async task=>{const result=review(task);for(const item of result.itemChecks)item.verdict='supported';result.findings=[];return result;};
  await runDateWorkflow(scope,worker,{...f.options,generationId:'generation-one'});
  const directory=dateWorkflowDirectory(scope.book,scope.chapter,f.options.peopleDir),stateFile=path.join(directory,'state.json'),state=readJson(stateFile);
  const source=fs.readFileSync(new URL('./run-people-date-workflow.mjs',import.meta.url),'utf8');
  const begin='mutateRemotePeopleWorkLedger(ledger=>{',end="},{message:'Reconcile completed date publications'});";
  const start=source.indexOf(begin),finish=source.indexOf(end,start);assert.ok(start>=0&&finish>start);
  const makeCallback=new Function('fs','path','PEOPLE_DIR','o','os','dateExecutorIsBusy','executorToken','dateAuditStatus','buildDateAuditPacket','readJson','completedDateClaimEvidence',`return ledger=>{${source.slice(start+begin.length,finish)}}`);
  const claim={worker:'owner',status:'active',sourceHash:f.packet.sourceHash,extractionHash:f.packet.extractionHash,generationId:'generation-one',jobs:{'audit-0':{status:'interrupted'}}};
  const ledger={dateAudits:{'fixture/001':claim}};
  const callback=makeCallback(fs,path,f.options.peopleDir,{worker:'owner'},os,dateExecutorIsBusy,'token',(b,c)=>dateAuditStatus(b,c,f.options),(b,c)=>buildDateAuditPacket(b,c,f.options),readJson,(input)=>completedDateClaimEvidence(input,f.options));
  writeJsonAtomic(stateFile,{...state,phase:'audit'});const before=structuredClone(ledger);callback(ledger);assert.deepEqual(ledger,before);
  writeJsonAtomic(stateFile,state);callback(ledger);assert.equal(claim.status,'ready');
});
test('completed repaired generation retains original claim binding and current audited report',async t=>{
  const f=fixture(t),scope={book:'fixture',chapter:'001'};
  const claim={sourceHash:f.packet.sourceHash,extractionHash:f.packet.extractionHash,generationId:'repair-generation'};
  const result=await runDateWorkflow(scope,async task=>task.kind==='repair'?repair(task):review(task),{...f.options,generationId:claim.generationId});
  assert.equal(result.status,'audited');
  assert.notEqual(buildDateAuditPacket(scope.book,scope.chapter,f.options).extractionHash,claim.extractionHash);
  assert.equal(completedDateClaimEvidence({...scope,claim},f.options).ready,true);
  assert.match(completedDateClaimEvidence({...scope,claim:{...claim,generationId:'other-generation'}},f.options).reason,/generation identity/);
});
test('review partitions own every unit, date and person exactly once',t=>{
  const f=fixture(t),jobs=dateReviewJobs(f.packet,f.options);
  assert.equal(jobs.length,2);
  for(const field of ['ownedUnits','ownedItems','ownedPeople'])assert.equal(new Set(jobs.flatMap(j=>j[field])).size,jobs.flatMap(j=>j[field]).length);
});
test('parallel review and re-audit retain full gates and serial repair',async t=>{
  const f=fixture(t),pool=createDateWorkerPool(2);
  let active=0,peak=0;
  const worker=async task=>{
    active++;peak=Math.max(peak,active);
    if(task.kind==='repair')assert.equal(active,1);
    await new Promise(resolve=>setTimeout(resolve,5));
    active--;
    return task.kind==='repair'?repair(task):review(task);
  };
  const result=await runDateWorkflow({book:'fixture',chapter:'001'},worker,{...f.options,jobConcurrency:2,workerPool:pool});
  assert.equal(result.status,'audited');assert.equal(peak,2);
  assert.equal(pool.summary().active,0);assert.equal(pool.summary().completed,5);
});
test('failed parallel review drains and preserves successful siblings before resumption',async t=>{
  const f=fixture(t);let completed=0;
  const worker=async task=>{
    if(task.job.ownedUnits.includes('s0001'))throw new Error('fixture failed shard');
    await new Promise(resolve=>setTimeout(resolve,10));completed++;
    return review(task);
  };
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,{...f.options,jobConcurrency:2}),/fixture failed shard/);
  assert.equal(completed,1);assert.deepEqual(readJson(f.file),f.extraction);
  const state=readJson(path.join(dateWorkflowDirectory('fixture','001',f.options.peopleDir),'state.json'));
  assert.equal(state.phase,'audit');
  const calls=[];
  await runDateWorkflow({book:'fixture',chapter:'001'},async task=>{calls.push(task);return task.kind==='repair'?repair(task):review(task);},{...f.options,jobConcurrency:2});
  assert.equal(calls.filter(task=>task.key.startsWith('audit-')&&task.job.ownedUnits.includes('s0002')).length,0);
});
test('shared worker pool caps concurrent chapters rather than multiplying limits',async t=>{
  const a=fixture(t),b=fixture(t),pool=createDateWorkerPool(2);
  let active=0,peak=0;
  const worker=async task=>{
    active++;peak=Math.max(peak,active);
    await new Promise(resolve=>setTimeout(resolve,5));active--;
    return task.kind==='repair'?repair(task):review(task);
  };
  await Promise.all([a,b].map(f=>runDateWorkflow({book:'fixture',chapter:'001'},worker,{...f.options,jobConcurrency:2,workerPool:pool})));
  assert.equal(peak,2);assert.deepEqual(pool.summary(),{limit:2,peak:2,completed:10,active:0,queued:0});
});
test('pool stops queued launches on quota stop and drains active calls',async()=>{
  let stop=false,release;const pool=createDateWorkerPool(1,{shouldStop:()=>stop});
  const first=pool.run(()=>new Promise(resolve=>{release=resolve;}));
  const second=pool.run(()=>assert.fail('queued worker must not launch'));
  const rejected=assert.rejects(second,/launch stopped/);
  await Promise.resolve();stop=true;release('done');
  assert.equal(await first,'done');await rejected;assert.equal(pool.summary().active,0);
});
test('reception reconciliation preserves event content',t=>{
  const f=fixture(t),row=['p001','event-participation',{kind:'posthumous-commemoration',receptionType:'posthumous',role:'honoree',action:'a later cap commemorates the Hongmen shield'},'explicit',['s0001']];
  const before={...f.extraction,claims:[...f.extraction.claims,row]},packet=buildDateAuditPacket('fixture','001',{...f.options,extraction:before});
  const after=structuredClone(row);after[2].kind='retrospective-reference';after[2].receptionType='retrospective';
  const proposal={sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,changes:[{kind:'replace',id:'claim-4',before:row,after,reason:'Unify the sole retrospective reception classification without changing the event.'}]};
  const candidate=applyDateRepairProposal(before,proposal,packet);
  assert.deepEqual(candidate.claims[3],after);
  assert.equal(dateRepairDifference(before,candidate,packet).changes.length,1);
  const bad=structuredClone(proposal);bad.changes[0].after[2].action='a different event';
  assert.throws(()=>applyDateRepairProposal(before,bad,packet),/non-temporal/);
});
test('repair findings are split without dropping or rewriting a finding',t=>{
  const findings=[
    {items:['claim-1'],problem:'First fixture chronology is wrong.',action:'Correct the first fixture date.'},
    {items:['hints-p001'],problem:'First fixture hint is stale.',action:'Synchronize the first fixture hint.'},
  ];
  const jobs=dateRepairJobs({findings},{items:[{id:'claim-1',personId:'p001'},{id:'hints-p001',personId:'p001'}]});
  assert.equal(jobs.length,1);
  assert.deepEqual(jobs.flatMap(job=>job.findings),findings);
  assert.equal(new Set(jobs.map(job=>job.id)).size,1);
});
test('repair planning packs disjoint people into one bounded packet',t=>{
  const f=fixture(t);
  const findings=[
    {items:['claim-1'],problem:'Jia needs a source-backed chronology correction.',action:'Correct Jia only.'},
    {items:['claim-2'],problem:'Yi needs a separate source-backed chronology correction.',action:'Correct Yi only.'},
  ];
  const jobs=dateRepairJobs({findings,itemChecks:[],personChecks:[],references:[]},f.packet,f.extraction,{maxBytes:1024*1024});
  assert.equal(jobs.length,1);
  assert.deepEqual(jobs[0].findings,findings);
});
test('retained review plans reuse exact ownership despite changed invocation ceilings',t=>{
  const f=fixture(t),state={phase:'audit',round:0,jobs:{}};
  const original=retainedDateReviewJobs(f.packet,state,{maxUnits:2,maxBytes:64000});
  state.jobs[`audit-0-${original.jobs[0].id}`]={agentId:'retained'};
  const resumed=retainedDateReviewJobs(f.packet,state,{maxUnits:1,maxBytes:32000});
  assert.deepEqual(resumed.jobs,original.jobs);
  const changed=structuredClone(f.packet);changed.items[0].value.westernYear.year=7;
  assert.throws(()=>retainedDateReviewJobs(changed,state,f.options),/ownership changed/);
});
test('same worker and host cannot reuse another live executor token',()=>{
  const claim={worker:'same-worker',executorHost:'same-host',executorToken:'first-checkout',executorExpiresAt:new Date(2000).toISOString()};
  assert.equal(dateExecutorIsBusy(claim,{executorToken:'second-checkout',now:1000}),true);
  assert.equal(dateExecutorIsBusy(claim,{executorToken:'first-checkout',now:1000}),false);
  assert.equal(dateExecutorIsBusy(claim,{executorToken:'second-checkout',now:2001}),false);
  assert.equal(dateExecutorIsBusy(claim,{executorToken:'second-checkout',now:1000,takeover:true}),false);
});
test('submitted extraction claims retain publication ownership without blocking the date gate',()=>{
  const active={sticky:true,status:'claimed'};
  const submitted={sticky:true,status:'submitted'};
  const ready={sticky:true,status:'ready'};
  assert.equal(extractionClaimBlocksDateAudit(active),true);
  assert.equal(extractionClaimBlocksDateAudit(submitted),false);
  assert.equal(extractionClaimBlocksDateAudit(ready),false);
});
test('audit -> repair -> fresh re-audit -> publish completes and is idempotent',async t=>{
  const f=fixture(t),calls=[];
  const worker=async task=>{calls.push(task.key);return task.kind==='repair'?repair(task):review(task);};
  const result=await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options);
  assert.equal(result.status,'audited');assert.equal(readJson(f.file).claims[0][2].westernYear.year,1);
  assert.equal(dateAuditStatus('fixture','001',f.options).status,'audited');
  assert.equal(calls.filter(k=>k.startsWith('audit-')).length,2);
  assert.equal(calls.filter(k=>k.startsWith('reaudit-')).length,2);
  const n=calls.length;await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options);assert.equal(calls.length,n);
});
test('completed generation with a current needs-revision report preserves every artifact and dispatches no worker',async t=>{
  const f=fixture(t);
  const result=await runDateWorkflow({book:'fixture',chapter:'001'},async task=>review(task),{...f.options,maxRounds:0});
  assert.equal(result.status,'needs-revision');
  const directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir),stateFile=path.join(directory,'state.json');
  const state=readJson(stateFile);state.phase='complete';state.restoredFromLedger=true;writeJsonAtomic(stateFile,state);
  const names=fs.readdirSync(directory).sort(),before=new Map(names.map(n=>[n,fs.readFileSync(path.join(directory,n))]));
  const prior=path.join(f.options.peopleDir,'date-audits','fixture','001.json'),report=fs.readFileSync(prior),extraction=fs.readFileSync(f.file);
  let called=false;
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{called=true;throw Error('unexpected worker');},f.options),/needs-revision report/);
  assert.equal(called,false);assert.deepEqual(fs.readdirSync(directory).sort(),names);
  for(const [name,bytes] of before)assert.deepEqual(fs.readFileSync(path.join(directory,name)),bytes);
  assert.deepEqual(fs.readFileSync(prior),report);assert.deepEqual(fs.readFileSync(f.file),extraction);
});
test('a completed generation retains a stale failed report for explicit reconciliation',async t=>{
  const f=fixture(t);
  await runDateWorkflow({book:'fixture',chapter:'001'},async task=>review(task),{...f.options,maxRounds:0});
  const directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir),stateFile=path.join(directory,'state.json');
  const state=readJson(stateFile);state.phase='complete';writeJsonAtomic(stateFile,state);
  const changed=readJson(f.sourceFile);changed.content[0].sentences[1].translation='A changed translation.';writeJsonAtomic(f.sourceFile,changed);
  assert.equal(dateAuditStatus('fixture','001',f.options).status,'stale');
  let called=false;await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{called=true;},f.options),/stale needs-revision report/);
  assert.equal(called,false);assert.equal(readJson(stateFile).phase,'complete');
});
test('stale failed report without local workflow state cannot start a new audit',async t=>{
  const f=fixture(t);await runDateWorkflow({book:'fixture',chapter:'001'},async task=>review(task),{...f.options,maxRounds:0});
  const stateFile=path.join(dateWorkflowDirectory('fixture','001',f.options.peopleDir),'state.json');fs.unlinkSync(stateFile);
  const changed=readJson(f.sourceFile);changed.content[0].sentences[1].translation='A changed translation.';writeJsonAtomic(f.sourceFile,changed);
  let called=false;await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{called=true;},f.options),/stale needs-revision report/);
  assert.equal(called,false);assert.equal(fs.existsSync(stateFile),false);
});
test('an existing audit cannot bypass seeding of a newly failed report',async t=>{
  const f=fixture(t);await runDateWorkflow({book:'fixture',chapter:'001'},async task=>review(task),{...f.options,maxRounds:0});
  const file=path.join(dateWorkflowDirectory('fixture','001',f.options.peopleDir),'state.json'),state=readJson(file);
  state.phase='audit';state.round=0;state.jobs={};delete state.restoredFromLedger;writeJsonAtomic(file,state);
  let called=false;await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{called=true;},f.options),/needs-revision report/);
  assert.equal(called,false);assert.deepEqual(readJson(file),state);
});
test('a later repair cannot treat an unrelated older matching review as its current source',async t=>{
  const f=fixture(t);await runDateWorkflow({book:'fixture',chapter:'001'},async task=>review(task),{...f.options,maxRounds:0});
  const directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir),file=path.join(directory,'state.json'),state=readJson(file);
  const later=readJson(path.join(directory,'review-0.json'));later.summary='A different later review is linked to the retained repair plan.';writeJsonAtomic(path.join(directory,'review-1.json'),later);
  state.phase='repair';state.round=1;state.review='review-1.json';writeJsonAtomic(file,state);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{throw Error('unexpected worker');},f.options),/cannot be safely seeded/);
  assert.deepEqual(readJson(file),state);
});

async function interruptedSecondRound(t, { secondaryReference = false } = {}) {
  const f = fixture(t), scope = { book: 'fixture', chapter: '001' };
  const secondaryFile = path.join(f.options.dataDir, 'fixture/002.json'), secondaryQuote = '二年乙卒。';
  if (secondaryReference) writeJsonAtomic(secondaryFile, { content: [{ sentences: [{ id: 's0001', zh: secondaryQuote, translation: 'Yi died in year two.' }] }] });
  const worker = async task => {
    if (task.key.startsWith('reaudit-2-')) throw new Error('fixture second-round audit interrupted');
    if (task.kind === 'repair') {
      task.save({ status: 'returned' });
      if (task.key.startsWith('repair-0-')) return repair(task);
      return { sourceHash: task.packet.sourceHash, extractionHash: task.packet.extractionHash, changes: [{
        kind: 'hints', personId: 'p002', before: task.extraction.people[1][4].a,
        after: ['AD 1 (fixture source year)'], reason: 'Clarify the retained fixture source year without changing the event.',
      }] };
    }
    const result = review(task);
    if (task.key.startsWith('reaudit-1-') && task.job.ownedPeople.includes('p002')) {
      result.personChecks.find(check => check.id === 'p002').verdict = 'incorrect';
      result.findings.push({ items: ['p002', 'hints-p002'], problem: 'The second fixture hint needs its source-year qualifier.', action: 'Clarify the existing source-year hint and obtain another independent review.' });
      if (secondaryReference) result.references.push({ book: 'fixture', chapter: '002', unit: 's0001', quote: secondaryQuote,
        sourceHash: sha256(secondaryQuote), reason: 'The independent second-source passage informs this staged chronology finding.' });
    }
    return result;
  };
  await assert.rejects(runDateWorkflow(scope, worker, f.options), /second-round audit interrupted/);
  const directory = dateWorkflowDirectory(scope.book, scope.chapter, f.options.peopleDir);
  return { ...f, scope, directory, secondaryFile, stateFile: path.join(directory, 'state.json'), reportFile: path.join(f.options.peopleDir, 'date-audits/fixture/001.json') };
}

test('a second repair round resumes from the original frozen negative seed and staged review ancestry', async t => {
  const f = await interruptedSecondRound(t), state = readJson(f.stateFile);
  assert.equal(state.phase, 'reaudit'); assert.equal(state.round, 2);
  assert.equal(state.review, 'review-1.json'); assert.equal(state.candidate, 'candidate-2.json');
  assert.deepEqual(readJson(f.reportFile), readJson(path.join(f.directory, 'review-0.json')));
  assert.notEqual(readJson(f.reportFile).extractionHash, readJson(path.join(f.directory, state.review)).extractionHash);
  const calls = [];
  assert.equal((await runDateWorkflow(f.scope, async task => { calls.push(task.key); return review(task); }, f.options)).status, 'audited');
  assert.ok(calls.length); assert.ok(calls.every(key => key.startsWith('reaudit-2-')));
  assert.equal(readJson(f.file).people[1][4].a[0], 'AD 1 (fixture source year)');
});

test('a later negative staged review also resumes its retained repair phase', async t => {
  const f = await interruptedSecondRound(t), state = readJson(f.stateFile);
  // Model a crash after returning the next repair but before advancing its
  // candidate: retain the proposal and the preceding round's combined delta.
  state.phase = 'repair'; state.round = 1;
  state.candidate = 'candidate-1.json'; state.review = 'review-1.json';
  writeJsonAtomic(f.stateFile, state);
  writeJsonAtomic(path.join(f.directory, 'combined-proposal.json'), dateRepairDifference(f.extraction, readJson(path.join(f.directory, state.candidate)), f.packet));
  const calls = [];
  assert.equal((await runDateWorkflow(f.scope, async task => { calls.push(task.key); return review(task); }, f.options)).status, 'audited');
  assert.ok(calls.every(key => key.startsWith('reaudit-2-')));
});

test('a current local secondary reference in a staged negative review permits recovery', async t => {
  const f = await interruptedSecondRound(t, { secondaryReference: true });
  assert.equal(dateAuditReferencesCurrent(readJson(path.join(f.directory, 'review-1.json')), f.options), true);
  assert.equal((await runDateWorkflow(f.scope, async task => review(task), f.options)).status, 'audited');
});

test('changed or missing secondary source units invalidate staged negative ancestry without changing report or job assembly', async t => {
  for (const mutation of ['changed', 'missing']) await t.test(mutation, async t => {
    const f = await interruptedSecondRound(t, { secondaryReference: true });
    const secondary = readJson(f.secondaryFile);
    if (mutation === 'changed') secondary.content[0].sentences[0].zh = '三年乙卒。';
    else secondary.content[0].sentences = [];
    writeJsonAtomic(f.secondaryFile, secondary);
    const canonical = readJson(f.reportFile), staged = readJson(path.join(f.directory, 'review-1.json'));
    assert.deepEqual(canonical.references, []); assert.equal(staged.references.length, 1);
    assert.equal(dateAuditStatus('fixture', '001', f.options).status, 'needs-revision');
    assert.equal(dateAuditReferencesCurrent(staged, f.options), false);
    const files = fs.readdirSync(f.directory).sort().map(name => [path.join(f.directory, name), fs.readFileSync(path.join(f.directory, name))]);
    files.push([f.file, fs.readFileSync(f.file)], [f.sourceFile, fs.readFileSync(f.sourceFile)],
      [f.secondaryFile, fs.readFileSync(f.secondaryFile)], [f.reportFile, fs.readFileSync(f.reportFile)]);
    let calls = 0;
    await assert.rejects(runDateWorkflow(f.scope, async () => { calls += 1; throw new Error('unexpected worker'); }, f.options), /cannot be safely seeded;.*stale source references/);
    assert.equal(calls, 0);
    assert.deepEqual(fs.readdirSync(f.directory).sort(), files.slice(0, -4).map(([file]) => path.basename(file)));
    for (const [file, bytes] of files) assert.deepEqual(fs.readFileSync(file), bytes);
  });
});

test('second-round recovery holds altered, missing, stale, or unrelated ancestry before any worker or write', async t => {
  const cases = {
    'changed canonical report': f => amend(f.reportFile, x => { x.summary += ' A separately installed report.'; }),
    'missing original seed': f => fs.unlinkSync(path.join(f.directory, 'review-0.json')),
    'changed original seed': f => amend(path.join(f.directory, 'review-0.json'), x => { x.summary += ' Changed.'; }),
    'missing prior candidate': f => fs.unlinkSync(path.join(f.directory, 'candidate-1.json')),
    'changed prior candidate': f => amend(path.join(f.directory, 'candidate-1.json'), x => { x.people[0][4].a = ['AD 9']; }),
    'missing current candidate': f => fs.unlinkSync(path.join(f.directory, 'candidate-2.json')),
    'changed current candidate': f => amend(path.join(f.directory, 'candidate-2.json'), x => { x.people[0][4].a = ['AD 9']; }),
    'missing linked review': f => fs.unlinkSync(path.join(f.directory, 'review-1.json')),
    'stale linked review': f => amend(path.join(f.directory, 'review-1.json'), x => { x.extractionHash = f.packet.extractionHash; }),
    'altered linked review': f => amend(path.join(f.directory, 'review-1.json'), x => { x.summary += ' Altered after assembly.'; }),
    'older matching review pointer': f => amend(f.stateFile, x => { x.review = 'review-0.json'; }),
    'wrong candidate pointer': f => amend(f.stateFile, x => { x.candidate = 'candidate-1.json'; }),
    'missing review plan': f => amend(f.stateFile, x => { delete x.reviewPlans['reaudit-1']; }),
    'changed review ownership': f => amend(f.stateFile, x => { x.reviewPlans['reaudit-1'].jobIds[0] = 'unknown'; }),
    'missing retained review job': f => fs.unlinkSync(path.join(f.directory, fs.readdirSync(f.directory).find(n => n.startsWith('reaudit-1-')))),
    'altered retained review job': f => amend(path.join(f.directory, fs.readdirSync(f.directory).find(n => n.startsWith('reaudit-1-'))), x => { x.summary += ' Altered.'; }),
    'missing intermediate candidate': f => fs.unlinkSync(path.join(f.directory, 'repair-candidate-0-1.json')),
    'altered intermediate candidate': f => amend(path.join(f.directory, 'repair-candidate-0-1.json'), x => { x.people[0][4].a = ['AD 9']; }),
    'missing scoped proposal': f => fs.unlinkSync(path.join(f.directory, fs.readdirSync(f.directory).find(n => /^repair-1-/.test(n)))),
    'altered combined proposal': f => amend(path.join(f.directory, 'combined-proposal.json'), x => { x.changes.find(c => c.kind === 'hints').after = ['AD 9']; }),
    'changed original state pin': f => amend(f.stateFile, x => { x.extractionHash = 'sha256:' + '0'.repeat(64); }),
    'changed source': f => amend(f.sourceFile, x => { x.content[0].sentences[0].translation += ' Changed.'; }),
    'changed canonical extraction': f => amend(f.file, x => { x.people[0][4].a = ['AD 9']; }),
    'completed generation': f => amend(f.stateFile, x => { x.phase = 'complete'; }),
    'unknown publication': f => amend(f.stateFile, x => { x.phase = 'publish'; }),
    'editorial amendment': f => amend(f.stateFile, x => { x.phase = 'editorial-amendment'; }),
  };
  function amend(file, change) { const value = readJson(file); change(value); writeJsonAtomic(file, value); }
  function snapshot(directory) {
    return fs.readdirSync(directory).sort().flatMap(name => {
      const file = path.join(directory, name);
      return fs.statSync(file).isDirectory() ? snapshot(file) : [[file, fs.readFileSync(file)]];
    });
  }
  for (const [name, change] of Object.entries(cases)) await t.test(name, async t => {
    const f = await interruptedSecondRound(t); change(f);
    const before = snapshot(path.dirname(f.options.peopleDir)); let calls = 0;
    await assert.rejects(runDateWorkflow(f.scope, async () => { calls += 1; throw new Error('unexpected worker'); }, f.options), /cannot be safely seeded/);
    assert.equal(calls, 0); assert.deepEqual(snapshot(path.dirname(f.options.peopleDir)), before);
  });
});

test('a restored audit past round zero cannot bypass failed report seeding',async t=>{
  const f=fixture(t);await runDateWorkflow({book:'fixture',chapter:'001'},async task=>review(task),{...f.options,maxRounds:0});
  const file=path.join(dateWorkflowDirectory('fixture','001',f.options.peopleDir),'state.json'),state=readJson(file);
  state.phase='audit';state.round=1;state.jobs={};state.restoredFromLedger=true;writeJsonAtomic(file,state);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{throw Error('unexpected worker');},f.options),/cannot be safely seeded/);
  assert.deepEqual(readJson(file),state);
});
test('a current failed report with no local state seeds the repair before any new review',async t=>{
  const f=fixture(t);await runDateWorkflow({book:'fixture',chapter:'001'},async task=>review(task),{...f.options,maxRounds:0});
  const directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir),file=path.join(directory,'state.json');fs.unlinkSync(file);
  const calls=[];const result=await runDateWorkflow({book:'fixture',chapter:'001'},async task=>{calls.push(task.kind);return repair(task);},{...f.options,maxRounds:0});
  assert.equal(result.status,'needs-revision');assert.equal(readJson(file).phase,'repair');assert.deepEqual(calls,[]);
  assert.deepEqual(readJson(path.join(directory,'review-0.json')),readJson(path.join(f.options.peopleDir,'date-audits','fixture','001.json')));
});
test('a retained different seed is not overwritten when state is missing',async t=>{
  const f=fixture(t);await runDateWorkflow({book:'fixture',chapter:'001'},async task=>review(task),{...f.options,maxRounds:0});
  const directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir),state=path.join(directory,'state.json'),seed=path.join(directory,'review-0.json');
  fs.unlinkSync(state);const old=readJson(seed);old.summary='Different retained review that must be preserved.';writeJsonAtomic(seed,old);const bytes=fs.readFileSync(seed);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{throw Error('unexpected worker');},f.options),/cannot be safely seeded/);
  assert.deepEqual(fs.readFileSync(seed),bytes);assert.equal(fs.existsSync(state),false);
});
test('interrupted publication reuses an exact retained prior review and matching receipt',async t=>{
  const f=fixture(t),worker=async task=>task.kind==='repair'?repair(task):review(task);
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options)).status,'audited');
  const directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir),file=path.join(directory,'state.json'),reportFile=path.join(f.options.peopleDir,'date-audits','fixture','001.json');
  writeJsonAtomic(reportFile,readJson(path.join(directory,'review-0.json')));const state=readJson(file);state.phase='publish';writeJsonAtomic(file,state);
  let called=false;const result=await runDateWorkflow({book:'fixture',chapter:'001'},async()=>{called=true;},f.options);
  assert.equal(result.status,'audited');assert.equal(called,false);
});
test('interrupted publication cannot overwrite a separately amended failed report',async t=>{
  const f=fixture(t),worker=async task=>task.kind==='repair'?repair(task):review(task);
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options)).status,'audited');
  const directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir),file=path.join(directory,'state.json'),reportFile=path.join(f.options.peopleDir,'date-audits','fixture','001.json');
  const prior=readJson(path.join(directory,'review-0.json'));prior.summary='An independently amended review contains an additional unresolved finding.';
  prior.findings.push({items:['claim-1'],problem:'A later independent source review found another unresolved concern.',action:'Review the separately discovered concern before declaring chronology approved.'});
  writeJsonAtomic(reportFile,prior);const before=fs.readFileSync(reportFile);const state=readJson(file);state.phase='publish';writeJsonAtomic(file,state);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{throw Error('unexpected worker');},f.options),/cannot be safely seeded/);
  assert.deepEqual(fs.readFileSync(reportFile),before);assert.equal(readJson(file).phase,'publish');
});
test('a report installed during a review is not overwritten by its outcome',async t=>{
  const f=fixture(t),reportFile=path.join(f.options.peopleDir,'date-audits','fixture','001.json');let installed;
  const worker=async task=>{if(!installed){installed={status:'needs-revision',note:'New independent finding'};writeJsonAtomic(reportFile,installed);}return review(task);};
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,{...f.options,maxRounds:0}),/Installed date report changed during workflow/);
  assert.deepEqual(readJson(reportFile),installed);assert.deepEqual(readJson(f.file),f.extraction);
});
test('an interrupted source review reuses completed chunks',async t=>{
  const f=fixture(t),calls=[];let interrupt=true;
  const worker=async task=>{calls.push(task.key);if(interrupt&&task.kind==='review'&&task.job.ownedUnits.includes('s0002')){interrupt=false;throw new Error('interrupted');}return task.kind==='repair'?repair(task):review(task);};
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options),/interrupted/);
  assert.equal(readJson(f.file).claims[0][2].westernYear.year,2);
  const first=calls[0];await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options);
  assert.equal(calls.filter(k=>k===first).length,1);
});
test('failed candidate re-audit never changes the production extraction',async t=>{
  const f=fixture(t);
  const worker=async task=>{
    if(task.kind==='repair')return repair(task);
    const r=review(task);
    if(task.key.startsWith('reaudit-')){r.personChecks[0].verdict='research-blocked';r.findings.push({items:[r.personChecks[0].id],problem:'Independent fixture evidence still needs more research.',action:'Keep the candidate staged until the primary passage is verified.'});}
    return r;
  };
  const result=await runDateWorkflow({book:'fixture',chapter:'001'},worker,{...f.options,maxRounds:1});
  assert.equal(result.status,'needs-revision');assert.deepEqual(readJson(f.file),f.extraction);
});
test('production validation failure preserves the old source artifact',async t=>{
  const f=fixture(t);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async task=>task.kind==='repair'?repair(task):review(task),{...f.options,maxAttempts:1,validateExtraction:()=>{throw new Error('production validation rejected');}}),/production validation rejected/);
  assert.deepEqual(readJson(f.file),f.extraction);
});
test('missing host validation fails before invoking any worker',async t=>{
  const f=fixture(t);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{throw new Error('worker must not launch');},{...f.options,validateExtraction:undefined}),/before worker execution/);
});
test('repair publication recovers an interrupted report write from its receipt',async t=>{
  const f=fixture(t);await runDateWorkflow({book:'fixture',chapter:'001'},async task=>task.kind==='repair'?repair(task):review(task),f.options);
  const publication=readJson(path.join(dateWorkflowDirectory('fixture','001',f.options.peopleDir),'publication.json'));
  fs.unlinkSync(path.join(f.options.peopleDir,'date-audits/fixture/001.json'));
  assert.equal(publishDateRepair(publication,f.options).status,'audited');
  publication.proposal.changes[0].reason='A substituted receipt must not be accepted for recovery.';
  assert.throws(()=>publishDateRepair(publication,f.options),/matching repair receipt/);
});
test('repairs reject wrong hashes, non-temporal claims and changed subjects',t=>{
  const f=fixture(t),p=repair({packet:f.packet,extraction:f.extraction});
  let bad=structuredClone(p);bad.sourceHash='wrong';assert.throws(()=>applyDateRepairProposal(f.extraction,bad,f.packet),/Stale/);
  bad=structuredClone(p);bad.changes[0].id='claim-3';assert.throws(()=>applyDateRepairProposal(f.extraction,bad,f.packet),/temporal claim/);
  bad=structuredClone(p);bad.changes[0].after[0]='p002';assert.throws(()=>applyDateRepairProposal(f.extraction,bad,f.packet),/subject/);
});
test('staged review binds a sealed proposal even when candidate bytes are unchanged', t => {
  const proposal = { sourceHash: 'sha256:source', extractionHash: 'sha256:base', changes: [{ kind: 'hints', personId: 'p001', before: ['AD 1'], after: ['AD 1'], reason: 'A deliberately distinct sealed proposal fixture.' }] };
  const candidate = { schemaVersion: 2, book: 'fixture', chapter: '001', people: [], claims: [] };
  const handoff = { kind: 'date-repair-candidate-handoff', book: 'fixture', chapter: '001', proposal, candidate, sealedCandidateHash: sealedDateRepairProposalHash(proposal), candidateExtractionHash: sha256(JSON.stringify(candidate)) };
  const review = { kind: 'independent-staged-date-repair-review', book: 'fixture', chapter: '001', candidateFile: 'staged-candidate-sealed.json', sealedCandidateHash: handoff.sealedCandidateHash, candidateExtractionHash: handoff.candidateExtractionHash };
  assert.deepEqual(validateStagedDateRepairReview(handoff, review, 'staged-candidate-sealed.json'), { sealedCandidateHash: handoff.sealedCandidateHash, candidateExtractionHash: handoff.candidateExtractionHash });
  const collapsed = { ...review, candidateHash: handoff.candidateExtractionHash };
  assert.throws(() => validateStagedDateRepairReview(handoff, collapsed, 'staged-candidate-sealed.json'), /Legacy candidateHash/);
  const wrongProposal = { ...review, sealedCandidateHash: handoff.candidateExtractionHash };
  assert.throws(() => validateStagedDateRepairReview(handoff, wrongProposal, 'staged-candidate-sealed.json'), /exact sealed proposal/);
});
test('sealed editorial amendments may replace only a reviewed date container',t=>{
  const original={id:'fixture:001:c0001',subject:'fixture:001:p001',predicate:'attestation',value:{sourceDate:{text:'元年'},westernYear:{era:'AD',year:2,precision:'year'}},certainty:'explicit',evidence:['fixture:001:s0001','fixture:001:s0002']};
  const held={...structuredClone(original),evidence:['fixture:001:s0002'],value:{sourceDate:{text:'元年'},unresolved:true,unresolvedReason:'The fixture source supplies only a dated context, not a continuous personal chronology.',event:'Source-specific context retained without a Western personal date.'}};
  const repair={id:'fixture:001:r0001',unit:{id:'s0001',kind:'paragraph-sentence',blockIndex:0,collection:'sentences',itemIndex:0},field:'literal',before:'Jia died in year one.',after:'Jia was present in year one.',reason:'The source says Jia was present, rather than that he died.',confidence:'high'};
  const candidate={book:'fixture',chapter:'001',input:{chapterFingerprint:`sha256:${'a'.repeat(64)}`},run:{agentId:'extractor'},people:[{localId:'fixture:001:p001'}],claims:[held],translationRepairs:[{...repair,status:'applied'}]};
  const document=editorialDecisionSeed({...candidate,translationRepairs:[{...repair,status:'proposed'}]});
  document.reviewer={kind:'human',name:'Independent editor',model:null,agentId:'reviewer',runId:null,completedAt:new Date(0).toISOString()};
  document.decisions[0]={repairId:repair.id,decision:'accept',after:null,reason:repair.reason,sourceWitness:{source:'chapter-text',citation:'s0001',excerpt:'元年'}};
  const reviewedAfter={...structuredClone(original),evidence:['fixture:001:s0002']};
  document.claimRevisions=[{repairId:repair.id,before:structuredClone(original),after:reviewedAfter,reason:'Preserve the reviewed fixture attestation while removing an unrelated evidence error.',sourceWitness:{source:'chapter-text',citation:'s0001',excerpt:'元年'}}];
  const amendment={schemaVersion:1,kind:'date-repair-editorial-amendment',book:'fixture',chapter:'001',editorialDecisionHash:sha256(JSON.stringify(document)),claimRevisions:[{repairId:repair.id,claimId:original.id,before:structuredClone(reviewedAfter),after:structuredClone(held),reason:'The reviewed source wording is retained, while the imported Western date is replaced by a source-specific unresolved hold.'}]};
  const amended=applyDateRepairEditorialAmendment(document,amendment,candidate);
  assert.deepEqual(amended.claimRevisions[0].after,held);
  const stale={...amendment,editorialDecisionHash:'sha256:stale'};
  assert.throws(()=>applyDateRepairEditorialAmendment(document,stale,candidate),/stale/);
  const unsafe=structuredClone(amendment);unsafe.claimRevisions[0].after.value.sourceDate.text='another year';
  assert.throws(()=>applyDateRepairEditorialAmendment(document,unsafe,candidate),/only chronology/);
});
function receptionRepair(f) {
  const proposal=repair({packet:f.packet,extraction:f.extraction});
  proposal.changes.push({kind:'add-reception-event',after:['p001','event-participation',
    {kind:'retrospective-reference',role:'remembered-official',action:'remembered'},'explicit',['s0001']],
    reason:'Keep the later reference separate from this official\'s living activity.'});
  return proposal;
}
test('returned repair labels reconcile before validation and retain a raw receipt',async t=>{
  const f=fixture(t);
  let submission;
  const worker=async task=>{
    if(task.kind!=='repair')return review(task);
    submission=receptionRepair(f);
    submission.changes.at(-1).after[2].kind='posthumous-reference';
    submission.changes.at(-1).after[2].receptionType='posthumous';
    return submission;
  };
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options)).status,'audited');
  const directory=path.join(f.options.peopleDir,'generated','date-workflow','fixture','001');
  const receipt=fs.readdirSync(directory).find(name=>name.startsWith('reception-reconciliation-'));
  assert.ok(receipt);
  const saved=readJson(path.join(directory,receipt));
  assert.equal(saved.submission.changes.at(-1).after[2].receptionType,'posthumous');
  assert.equal(saved.proposal.changes.at(-1).after[2].receptionType,'retrospective');
  assert.equal(submission.changes.at(-1).after[2].receptionType,'posthumous');
  assert.ok(readJson(f.file).claims.some(row=>row[2].kind==='retrospective-reference'));
});
test('a reception addition requires a nonempty event kind',t=>{
  const f=fixture(t),proposal=repair({packet:f.packet,extraction:f.extraction});
  proposal.changes.push({kind:'add-reception-event',after:['p001','event-participation',
    {receptionType:'retrospective',role:'remembered-official'},'explicit',['s0001']],
    reason:'Keep the later reference separate from this official\'s living activity.'});
  assert.throws(()=>applyDateRepairProposal(f.extraction,proposal,f.packet),/explicitly classified reception/);
});
test('scoped reception additions survive final-delta reconstruction and remain audit items',t=>{
  const f=fixture(t),proposal=receptionRepair(f),candidate=applyDateRepairProposal(f.extraction,proposal,f.packet);
  const combined=dateRepairDifference(f.extraction,candidate,f.packet);
  assert.equal(combined.changes.at(-1).kind,'hints');
  assert.equal(combined.changes.filter(c=>c.kind==='add-reception-event').length,1);
  assert.deepEqual(applyDateRepairProposal(f.extraction,combined,f.packet),candidate);
  const packet=buildDateAuditPacket('fixture','001',{...f.options,extraction:candidate});
  assert.ok(packet.items.some(i=>i.value?.kind==='retrospective-reference'));
});
test('a reception-only person may clear fabricated active-date hints',t=>{
  const f=fixture(t),before=f.extraction.claims[0];
  const proposal={sourceHash:f.packet.sourceHash,extractionHash:f.packet.extractionHash,changes:[
    {kind:'remove',id:'claim-1',before,reason:'The cited fixture is a later reception event, not evidence of Jia living in year two.'},
    {kind:'add-reception-event',after:['p001','event-participation',{kind:'retrospective-reference',role:'recalled-example',action:'cited as a later precedent',receptionType:'retrospective'},'explicit',['s0001']],reason:'Preserve the later citation as a retrospective reference rather than a life attestation.'},
    {kind:'hints',personId:'p001',before:['AD 2'],after:[],reason:'Remove the fabricated active-date hint because this chapter supplies only later reception evidence.'},
  ]};
  const candidate=applyDateRepairProposal(f.extraction,proposal,f.packet);
  assert.deepEqual(candidate.people[0][4].a,[]);
  assert.ok(candidate.claims.some(c=>c[1]==='event-participation'&&c[2].kind==='retrospective-reference'));
  const noReception=structuredClone(proposal);noReception.changes.splice(1,1);
  assert.throws(()=>applyDateRepairProposal(f.extraction,noReception,f.packet),/active-hint/);
});
test('an undated source attestation may clear active-date hints without inventing chronology',t=>{
  const f=fixture(t),before=f.extraction.claims[1],after=structuredClone(before);
  after[2]={undatedSourceAttestation:true,event:'The source attests Yi but supplies no temporal wording.'};
  const proposal={sourceHash:f.packet.sourceHash,extractionHash:f.packet.extractionHash,changes:[
    {kind:'replace',id:'claim-2',before,after,reason:'The cited source unit identifies Yi but has no temporal language, so its inherited first-year date must be removed.'},
    {kind:'hints',personId:'p002',before:['AD 1'],after:[],reason:'Clear the inherited date hint because this person has only an explicitly undated source attestation.'},
  ]};
  const candidate=applyDateRepairProposal(f.extraction,proposal,f.packet);
  assert.deepEqual(candidate.people[1][4].a,[]);
  assert.equal(candidate.claims[1][2].undatedSourceAttestation,true);
});
test('an undated source attestation may clear hints when remaining contexts are explicitly unresolved',t=>{
  const f=fixture(t),stored=structuredClone(f.extraction);
  stored.claims.push(['p002','event-participation',{kind:'political',role:'named',dateContext:{unresolved:true,unresolvedReason:'The source names the event but supplies no date.'}},'explicit',['s0002']]);
  const packet=buildDateAuditPacket('fixture','001',{...f.options,extraction:stored});
  const before=stored.claims[1],after=structuredClone(before);
  after[2]={undatedSourceAttestation:true,event:'The source attests Yi but supplies no temporal wording.'};
  const proposal={sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,changes:[
    {kind:'replace',id:'claim-2',before,after,reason:'The attestation carries an inherited date even though its source wording is explicitly undated.'},
    {kind:'hints',personId:'p002',before:['AD 1'],after:[],reason:'An unresolved event context is not evidence for an active Western year, so clear the inherited hint.'},
  ]};
  const candidate=applyDateRepairProposal(stored,proposal,packet);
  assert.deepEqual(candidate.people[1][4].a,[]);
});
test('an unresolved replacement may clear the hint it withdraws',t=>{
  const f=fixture(t),before=f.extraction.claims[1],after=structuredClone(before);
  after[2]={sourceDate:{text:'The source gives only a disputed relative count.'},unresolved:true,
    unresolvedReason:'The relative count has competing anchors and does not support one Western year.'};
  const proposal={sourceHash:f.packet.sourceHash,extractionHash:f.packet.extractionHash,changes:[
    {kind:'replace',id:'claim-2',before,after,reason:'Replace the unsupported converted year with the source\'s explicitly unresolved relative chronology.'},
    {kind:'hints',personId:'p002',before:['AD 1'],after:[],reason:'Clear the active hint because the repaired record no longer supports a concrete Western year.'},
  ]};
  const candidate=applyDateRepairProposal(f.extraction,proposal,f.packet);
  assert.deepEqual(candidate.people[1][4].a,[]);
  assert.equal(candidate.claims[1][2].unresolved,true);
});
test('an undated source attestation cannot clear hints when another claim supplies chronology',t=>{
  const f=fixture(t),stored=structuredClone(f.extraction);
  stored.claims.push(['p002','birth',{sourceDate:{text:'元年'},westernYear:{era:'AD',year:1,precision:'year'}},'explicit',['s0002']]);
  const packet=buildDateAuditPacket('fixture','001',{...f.options,extraction:stored});
  const before=stored.claims[1],after=structuredClone(before);
  after[2]={undatedSourceAttestation:true,event:'The source attests Yi but supplies no date-bearing temporal wording.'};
  const proposal={sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,changes:[
    {kind:'replace',id:'claim-2',before,after,reason:'Remove the inherited first-year date because Yi is named here without a date-bearing temporal statement.'},
    {kind:'hints',personId:'p002',before:['AD 1'],after:[],reason:'This must be rejected because the person retains a separate dated birth claim.'},
  ]};
  assert.throws(()=>applyDateRepairProposal(stored,proposal,packet),/active-hint/);
});
test('reception additions reject non-reception events, life claims, conflicting labels and bad evidence',t=>{
  const f=fixture(t),proposal=receptionRepair(f);
  for(const mutate of [
    row=>{row[1]='role';},row=>{row[1]='attestation';},row=>{row[0]='p999';},
    row=>{row[2]={kind:'battle'};},
    row=>{row[2].receptionType='unknown';},row=>{row[4]=[];},row=>{row[4]=['s9999'];},
  ]) {
    const bad=structuredClone(proposal);mutate(bad.changes.at(-1).after);
    assert.throws(()=>applyDateRepairProposal(f.extraction,bad,f.packet),/Only life\/date|source-unit/);
  }
  const duplicate=structuredClone(proposal);duplicate.changes.push(structuredClone(duplicate.changes.at(-1)));
  assert.throws(()=>applyDateRepairProposal(f.extraction,duplicate,f.packet),/Duplicate/);
  for(const field of ['hostRequiredChanges','requiredReceptionEvents','requiredHostCuration','blocked']) {
    assert.throws(()=>applyDateRepairProposal(f.extraction,{...proposal,[field]:true},f.packet),/Incomplete repair/);
  }
});
test('corrected event dates and a separate reception event cannot be mismatched during collapse',t=>{
  const f=fixture(t);
  const before=['p001','event-participation',{kind:'appointment',dateContext:{westernYear:{era:'AD',year:2,precision:'year'}}},'explicit',['s0001']];
  f.extraction.claims.push(before);writeJsonAtomic(f.file,f.extraction);
  f.packet=buildDateAuditPacket('fixture','001',f.options);
  const proposal=receptionRepair(f),after=structuredClone(before);after[2].dateContext.westernYear.year=1;
  proposal.changes.push({kind:'replace',id:'claim-4',before,after,reason:'Correct the appointment date without changing the event itself.'});
  const candidate=applyDateRepairProposal(f.extraction,proposal,f.packet);
  // Put the new reception before the old event to exercise matching by content.
  candidate.claims.splice(3,2,candidate.claims[4],candidate.claims[3]);
  const combined=dateRepairDifference(f.extraction,candidate,f.packet);
  const reconstructed=applyDateRepairProposal(f.extraction,combined,f.packet);
  assert.deepEqual(reconstructed.claims.find(c=>c[2].kind==='appointment'),after);
  assert.ok(reconstructed.claims.some(c=>c[2].kind==='retrospective-reference'));
  const bad=structuredClone(candidate);bad.claims.find(c=>c[2].kind==='appointment')[2].kind='battle';
  assert.throws(()=>applyDateRepairProposal(f.extraction,dateRepairDifference(f.extraction,bad,f.packet),f.packet),/Only life\/date/);
});
test('a reception repair stays staged until a fresh reviewer approves the added event',async t=>{
  const f=fixture(t);let approve=false;let receptionChecks=0;
  const worker=async task=>{
    if(task.kind==='repair')return receptionRepair(f);
    if(task.key.startsWith('reaudit-') && !approve)throw new Error('waiting for independent reception review');
    if(task.key.startsWith('reaudit-'))receptionChecks+=task.job.items.filter(i=>i.value?.kind==='retrospective-reference').length;
    return review(task);
  };
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options),/waiting for independent/);
  assert.deepEqual(readJson(f.file),f.extraction);
  approve=true;
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options)).status,'audited');
  assert.equal(receptionChecks,1);
  assert.ok(readJson(f.file).claims.some(c=>c[2].kind==='retrospective-reference'));
});
function undatedEventFixture(t) {
  const f=fixture(t);
  f.extraction.claims.push(['p001','event-participation',{kind:'appointment',role:'appointee'},'explicit',['s0001']]);
  writeJsonAtomic(f.file,f.extraction);f.packet=buildDateAuditPacket('fixture','001',f.options);
  return f;
}
function eventDateRepair(f) {
  const proposal=repair({packet:f.packet,extraction:f.extraction});
  const before=f.extraction.claims[3][2].dateContext ?? null;
  const after={sourceDate:{text:'元年'},westernYear:{era:'AD',year:1,precision:'year'}};
  proposal.changes.push({kind:'date-context',id:'claim-4',before,after,reason:'Preserve the appointment and attach its separately checked first-year source context.'});
  return proposal;
}
test('missing event chronology can be added without replacing the underlying event',t=>{
  const f=undatedEventFixture(t),proposal=eventDateRepair(f);
  assert.ok(!f.packet.items.some(i=>i.id==='claim-4'));
  const candidate=applyDateRepairProposal(f.extraction,proposal,f.packet);
  const combined=dateRepairDifference(f.extraction,candidate,f.packet);
  assert.equal(combined.changes.find(c=>c.id==='claim-4').kind,'date-context');
  assert.deepEqual(applyDateRepairProposal(f.extraction,combined,f.packet),candidate);
  assert.ok(buildDateAuditPacket('fixture','001',{...f.options,extraction:candidate}).items.some(i=>i.id==='claim-4'));
});
test('date-context cannot rewrite identities, event content, life claims or unowned targets',t=>{
  const f=undatedEventFixture(t),proposal=eventDateRepair(f);
  for(const mutate of [
    c=>{c.after.role='ruler';},c=>{c.after.kind='battle';},c=>{c.id='claim-999';},c=>{c.id='claim-04';},
    c=>{c.before={sourceDate:{text:'wrong'}};},c=>{c.after=null;},
    c=>{c.id='claim-1';c.before=f.extraction.claims[0][2].dateContext;c.after=structuredClone(c.before);},
  ]) {
    const bad=structuredClone(proposal);mutate(bad.changes.at(-1));
    assert.throws(()=>applyDateRepairProposal(f.extraction,bad,f.packet));
  }
  const changed=applyDateRepairProposal(f.extraction,proposal,f.packet);
  changed.claims[3][2].kind='battle';
  assert.throws(()=>dateRepairDifference(f.extraction,changed,f.packet),/non-temporal claim/);
});
test('date-context repair retains an existing explanatory event',t=>{
  const f=undatedEventFixture(t);
  f.extraction.claims[3][2].dateContext={sourceDate:{text:'first-year notice'},event:'The office appointment is recorded in the first-year notice.'};
  writeJsonAtomic(f.file,f.extraction);f.packet=buildDateAuditPacket('fixture','001',f.options);
  const proposal=repair({packet:f.packet,extraction:f.extraction});
  proposal.changes.push({kind:'date-context',id:'claim-4',before:structuredClone(f.extraction.claims[3][2].dateContext),after:{...structuredClone(f.extraction.claims[3][2].dateContext),westernYear:{era:'AD',year:1,precision:'year'}},reason:'Add the checked year while retaining the existing event wording.'});
  const candidate=applyDateRepairProposal(f.extraction,proposal,f.packet);
  assert.equal(candidate.claims[3][2].dateContext.event,'The office appointment is recorded in the first-year notice.');
  const bad=structuredClone(proposal);delete bad.changes.at(-1).after.event;
  assert.throws(()=>applyDateRepairProposal(f.extraction,bad,f.packet),/cannot alter or remove an existing event description/);
});
test('a newly dated event requires coverage in the fresh independent review',async t=>{
  const f=undatedEventFixture(t);let approve=false,checked=0;
  const worker=async task=>{
    if(task.kind==='repair')return eventDateRepair(f);
    if(task.key.startsWith('reaudit-')) {
      if(!approve)throw new Error('awaiting fresh event-date review');
      checked+=task.job.ownedItems.filter(id=>id==='claim-4').length;
    }
    return review(task);
  };
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options),/awaiting fresh/);
  assert.deepEqual(readJson(f.file),f.extraction);
  approve=true;
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options)).status,'audited');
  assert.equal(checked,1);
  assert.equal(readJson(f.file).claims[3][2].dateContext.westernYear.year,1);
});
test('incomplete remote artifacts cannot be silently accepted',t=>{
  const f=fixture(t),job=dateReviewJobs(f.packet,f.options)[0],result=review({job,packet:f.packet,key:'test'});result.itemChecks.pop();
  assert.throws(()=>validateDateJobResult(result,job,f.packet),/exactly/);
});
test('changed source during active work refuses reuse',async t=>{
  const f=fixture(t);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async task=>{task.save({agentId:'retained'});throw new Error('interruption');},f.options),/interruption/);
  f.source.content[0].sentences[0].zh='二年甲卒。';writeJsonAtomic(f.sourceFile,f.source);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{throw new Error('must not launch');},f.options),/changed during date work/);
});
test('shared ledger validates isolated date reservations without modifying extraction claims',()=>{
  const ledger={schemaVersion:1,claims:{},dateAudits:{'fixture/001':{worker:'date-a',lane:'cursor-sdk',sourceHash:`sha256:${'a'.repeat(64)}`,extractionHash:`sha256:${'b'.repeat(64)}`,jobs:{},status:'active'}}};
  validatePeopleWorkLedger(ledger);assert.deepEqual(ledger.claims,{});
  const reserved=reservePeopleTargetsInLedger(ledger,[{book:'fixture',chapter:'001'}],{lane:'grokbot',worker:'extract-a',limit:1});
  assert.equal(reserved.claimed.length,0);assert.equal(reserved.blocked.length,1);
  ledger.dateAudits['fixture/001'].status='stale-source';
  validatePeopleWorkLedger(ledger);
  const refreshed=reservePeopleTargetsInLedger(ledger,[{book:'fixture',chapter:'001'}],{lane:'grokbot',worker:'extract-a',limit:1});
  assert.equal(refreshed.claimed.length,0);assert.equal(refreshed.blocked.length,1);
  ledger.dateAudits['fixture/001'].status='ready';
  const ready=reservePeopleTargetsInLedger(ledger,[{book:'fixture',chapter:'001'}],{lane:'grokbot',worker:'extract-a',limit:1});
  assert.equal(ready.claimed.length,1);assert.equal(ready.blocked.length,0);
  ledger.dateAudits['fixture/001'].lane='unknown';assert.throws(()=>validatePeopleWorkLedger(ledger),/date-audit reservation/);
});
test('completed workflow starts a new generation when the chapter changes',async t=>{
  const f=fixture(t),worker=async task=>task.kind==='repair'?repair(task):review(task);
  await runDateWorkflow({book:'fixture',chapter:'001'},worker,{...f.options,generationId:'old-generation'});
  f.source.content[0].sentences[1].zh+='乙仕。';writeJsonAtomic(f.sourceFile,f.source);
  const packet=buildDateAuditPacket('fixture','001',f.options);
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,{...f.options,generationId:'new-generation'})).status,'audited');
  assert.equal(completedDateClaimEvidence({book:'fixture',chapter:'001',claim:{sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,generationId:'new-generation'}},f.options).ready,true);
  assert.ok(fs.readdirSync(path.dirname(dateWorkflowDirectory('fixture','001',f.options.peopleDir))).some(n=>n.startsWith('001.completed-')));
});
test('a repair context cannot approve its own candidate',async t=>{
  const f=fixture(t);
  const worker=async task=>{
    if(task.kind==='repair'){await task.save({agentId:'same-context'});return repair(task);}
    const result=review(task);result.reviewer.agentId='same-context';return result;
  };
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options),/cannot approve its own/);
  assert.deepEqual(readJson(f.file),f.extraction);
});
test('repeated repair blockers are archived immutably, byte-exactly and idempotently',async t=>{
  const f=fixture(t),directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir);
  const first={blocked:true,reason:'The first chronology finding needs primary-source research.'};
  const second={blocked:true,reason:'The second chronology finding still needs another primary source.'};
  let result=first,repairCalls=0;
  const worker=async task=>{
    if(task.kind==='review')return review(task);
    repairCalls++;await task.save({agentId:'retained-fixture',runId:`run-${repairCalls}`,artifactHash:'fixture-remote-hash'});return result;
  };
  const run=()=>runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options);
  assert.equal((await run()).status,'research-blocked');
  const legacy=path.join(directory,'research-blocker.json');
  const firstBytes=Buffer.from(`${JSON.stringify(first,null,2)}\n`);
  assert.deepEqual(fs.readFileSync(legacy),firstBytes);
  assert.deepEqual(readJson(f.file),f.extraction);
  assert.equal((await run()).status,'research-blocked');
  let state=readJson(path.join(directory,'state.json'));
  assert.equal(state.blockerArchives.filter(r=>r.kind==='workflow-normalized').length,2,
    'distinct remote run provenance is retained even for identical bytes');
  assert.equal(new Set(state.blockerArchives.map(r=>r.path)).size,1);
  assert.deepEqual(fs.readFileSync(legacy),firstBytes);
  result=second;
  assert.equal((await run()).status,'research-blocked');
  state=readJson(path.join(directory,'state.json'));
  const archives=state.blockerArchives.filter(r=>r.kind==='workflow-normalized');
  assert.equal(new Set(archives.map(r=>r.path)).size,2);
  for(const entry of state.blockerArchives){
    const bytes=fs.readFileSync(path.join(directory,entry.path));
    assert.equal(bytes.length,entry.bytes);
    assert.equal(sha256(bytes.toString('utf8')).slice(7),entry.sha256);
  }
  assert.deepEqual(fs.readFileSync(legacy),firstBytes);
  assert.deepEqual(readJson(f.file),f.extraction);
});

test('a corrupt blocker archive fails closed before a retained repair executes',async t=>{
  const f=fixture(t),directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir);
  const worker=async task=>task.kind==='review'?review(task):{blocked:true,reason:'The chronology needs independent source research.'};
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options)).status,'research-blocked');
  const state=readJson(path.join(directory,'state.json'));
  const archive=path.join(directory,state.blockerArchives[0].path);
  fs.writeFileSync(archive,'corrupted fixture archive');
  let called=false;
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{called=true;throw new Error('must not execute');},f.options),/Conflicting immutable research blocker archive/);
  assert.equal(called,false);
  assert.deepEqual(readJson(f.file),f.extraction);
});

test('a mismatched supplement job is rejected before repair without changing the canonical extraction',async t=>{
  const f=fixture(t);let calls=0;
  const worker=async task=>{if(task.kind==='repair'){calls++;return {blocked:true,reason:'The fixture chronology requires source research.'};}return review(task);};
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options)).status,'research-blocked');
  calls=0;
  const supplement={schemaVersion:1,book:'fixture',chapter:'001',jobKey:'repair-0-wrong-job',
    sourceHash:f.packet.sourceHash,extractionHash:f.packet.extractionHash,originalSourceHash:f.packet.sourceHash,
    originalExtractionHash:f.packet.extractionHash,blockerHash:`sha256:${'a'.repeat(64)}`,evidence:'Fixture source research.'};
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,{...f.options,researchSupplement:supplement}),/supplement.*active repair job/i);
  assert.equal(calls,0);assert.deepEqual(readJson(f.file),f.extraction);
});

test('a retained supplement reaches only its job and does not block subsequent repairs after restart',async t=>{
  const f=fixture(t),directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir);
  let firstKey,firstPacket;
  const firstWorker=async task=>{
    if(task.kind==='review')return review(task);
    firstKey=task.key;firstPacket=task.packet;return {blocked:true,reason:'The first repair needs independent source research.'};
  };
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},firstWorker,f.options)).status,'research-blocked');
  const stateFile=path.join(directory,'state.json'),state=readJson(stateFile);
  // Model a retained second disjoint component without altering its sealed
  // first component or the live corpus; this synthetic job does not publish.
  state.repairPlan.push({id:'002-fixture-second',findings:[{items:['claim-2'],problem:'The second person needs separate chronology.',action:'Review the second person independently.'}]});
  writeJsonAtomic(stateFile,state);
  const blockerBytes=Buffer.from('{"blocked":true,"reason":"Fixture research hold."}');
  const blockerHash=sha256(blockerBytes.toString()).slice(7);
  const supplement={schemaVersion:1,book:'fixture',chapter:'001',jobKey:firstKey,
    sourceHash:firstPacket.sourceHash,extractionHash:firstPacket.extractionHash,originalSourceHash:f.packet.sourceHash,
    originalExtractionHash:f.packet.extractionHash,blockerHash:`sha256:${blockerHash}`,evidence:'Fixture independent primary source.'};
  const supplementBytes=Buffer.from(JSON.stringify(supplement));
  const supplementHash=sha256(supplementBytes.toString()).slice(7);
  fs.writeFileSync(path.join(directory,`raw-research-blocker-${blockerHash}.json`),blockerBytes);
  fs.writeFileSync(path.join(directory,`research-supplement-${supplementHash}.json`),supplementBytes);
  let secondCalls=0,firstCalls=0;
  const worker=async task=>{
    if(task.kind==='review')return review(task);
    if(task.key===firstKey){
      firstCalls++;assert.deepEqual(task.researchSupplement,supplement);
      const result=repair(task),raw=Buffer.from(JSON.stringify(result)),artifactHash=sha256(raw.toString()).slice(7);
      fs.writeFileSync(path.join(directory,`raw-repair-artifact-${artifactHash}.json`),raw);
      await task.save({agentId:'fixture-repair-context',runId:'fixture-run',status:'returned',artifactHash,
        researchSupplementHash:supplementHash,researchBlockerHash:blockerHash,
        researchAttempts:[{agentId:'fixture-repair-context',priorRunId:'fixture-prior-run',supplementHash,blockerHash}]});
      return result;
    }
    secondCalls++;assert.equal(task.researchSupplement,undefined);throw new Error('second fixture interruption');
  };
  const run=()=>runDateWorkflow({book:'fixture',chapter:'001'},worker,{...f.options,researchSupplement:supplement});
  await assert.rejects(run(),/second fixture interruption/);
  assert.equal(firstCalls,1);assert.equal(secondCalls,1);
  assert.ok(fs.existsSync(path.join(directory,`${firstKey}.json`)));
  assert.equal(readJson(stateFile).researchSupplementReceipts[firstKey].supplementHash,supplementHash);
  await assert.rejects(run(),/second fixture interruption/);
  assert.equal(firstCalls,1);assert.equal(secondCalls,2);
  assert.deepEqual(readJson(f.file),f.extraction);
});

async function supplementedProposalCrashFixture(t){
  const f=fixture(t),directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir);
  let key,jobPacket,jobTask;
  const blocked=async task=>{
    if(task.kind==='review')return review(task);
    key=task.key;jobPacket=task.packet;jobTask=task;
    return {blocked:true,reason:'This retained fixture chronology requires primary source research.'};
  };
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},blocked,f.options)).status,'research-blocked');
  const blockerBytes=Buffer.from('{"blocked":true,"reason":"The original fixture research hold."}');
  const blockerHash=sha256(blockerBytes.toString()).slice(7);
  const supplement={schemaVersion:1,book:'fixture',chapter:'001',jobKey:key,sourceHash:jobPacket.sourceHash,
    extractionHash:jobPacket.extractionHash,originalSourceHash:f.packet.sourceHash,originalExtractionHash:f.packet.extractionHash,
    blockerHash:`sha256:${blockerHash}`,evidence:'The independent fixture source is https://example.invalid/primary.'};
  const supplementBytes=Buffer.from(JSON.stringify(supplement)),supplementHash=sha256(supplementBytes.toString()).slice(7);
  const proposal=repair(jobTask),raw=Buffer.from(JSON.stringify(proposal)),artifactHash=sha256(raw.toString()).slice(7);
  fs.writeFileSync(path.join(directory,`raw-research-blocker-${blockerHash}.json`),blockerBytes);
  fs.writeFileSync(path.join(directory,`research-supplement-${supplementHash}.json`),supplementBytes);
  fs.writeFileSync(path.join(directory,`raw-repair-artifact-${artifactHash}.json`),raw);
  // Represent the exact crash window: job output is durable and worker state
  // is returned, but no workflow receipt or advanced repair candidate exists.
  writeJsonAtomic(path.join(directory,`${key}.json`),proposal);
  const stateFile=path.join(directory,'state.json'),state=readJson(stateFile);
  state.jobs[key]={agentId:'fixture-repair',runId:'fixture-run',status:'returned',artifactHash,
    researchSupplementHash:supplementHash,researchBlockerHash:blockerHash,
    researchAttempts:[{agentId:'fixture-repair',priorRunId:'fixture-prior-run',supplementHash,blockerHash}]};
  writeJsonAtomic(stateFile,state);
  return {f,directory,key,supplement,supplementHash,artifactHash,stateFile};
}

test('crash after supplemented proposal requires original supplement before applying candidate',async t=>{
  const {f,directory,key,supplement,stateFile}=await supplementedProposalCrashFixture(t);
  let called=0;
  const worker=async task=>{called++;if(task.kind==='review')throw new Error('fixture independent reaudit interruption');throw new Error('fixture worker must not run');};
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options),/supplement|receipt/i);
  assert.equal(called,0);assert.deepEqual(readJson(f.file),f.extraction);
  let state=readJson(stateFile);
  assert.equal(state.repairIndex ?? 0,0);
  assert.equal(state.researchSupplementReceipts?.[key],undefined);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,{...f.options,researchSupplement:supplement}),/fixture independent reaudit interruption/);
  state=readJson(stateFile);
  assert.ok(state.researchSupplementReceipts[key]);
  assert.ok(fs.existsSync(path.join(directory,state.candidate)));
  assert.deepEqual(readJson(f.file),f.extraction);
});

test('supplement receipt evidence is always checked even if caller omits supplement',async t=>{
  for(const damage of ['missing','changed']){
    const {f,directory,supplement,supplementHash}=await supplementedProposalCrashFixture(t);
    const worker=async task=>{if(task.kind==='review')throw new Error('fixture independent reaudit interruption');throw new Error('unexpected repair');};
    await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,{...f.options,researchSupplement:supplement}),/fixture independent reaudit interruption/);
    const file=path.join(directory,`research-supplement-${supplementHash}.json`);
    if(damage==='missing')fs.unlinkSync(file);else fs.writeFileSync(file,'changed fixture evidence');
    let called=false;
    await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{called=true;throw new Error('must not run');},f.options),/receipt evidence (?:is )?(missing|changed)/i,damage);
    assert.equal(called,false,damage);assert.deepEqual(readJson(f.file),f.extraction);
  }
});

test('supplemented proposal cannot advance without matching post-dispatch attempt provenance',async t=>{
  for(const failure of ['no-attempt','before-send','dispatch-before-run-checkpoint','missing-prior-run','wrong-agent','wrong-blocker','wrong-supplement']){
    const {f,supplement,key,stateFile}=await supplementedProposalCrashFixture(t);
    const state=readJson(stateFile),job=state.jobs[key],attempt=job.researchAttempts[0];
    if(failure==='no-attempt')delete job.researchAttempts;
    if(failure==='before-send'){job.status='sending';job.runId=attempt.priorRunId;}
    if(failure==='dispatch-before-run-checkpoint')job.runId=attempt.priorRunId;
    if(failure==='missing-prior-run')delete attempt.priorRunId;
    if(failure==='wrong-agent')attempt.agentId='different-agent';
    if(failure==='wrong-blocker')attempt.blockerHash='0'.repeat(64);
    if(failure==='wrong-supplement')attempt.supplementHash='0'.repeat(64);
    writeJsonAtomic(stateFile,state);
    let called=false;
    await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{called=true;throw new Error('must not execute');},
      {...f.options,researchSupplement:supplement}),/provenance|attempt|dispatch/i,failure);
    assert.equal(called,false,failure);
    assert.deepEqual(readJson(f.file),f.extraction,failure);
    assert.equal(readJson(stateFile).researchSupplementReceipts?.[key],undefined,failure);
  }
});

test('two sequential researched blockers continue the same workflow to a verified repair receipt',async t=>{
  const f=fixture(t),directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir);
  const firstRaw=JSON.stringify({blocked:true,reason:'First chronology finding needs source research.'});
  const secondRaw=JSON.stringify({blocked:true,reason:'A second distinct chronology question needs source research.'});
  let firstTask,proposal,sendCount=0,remoteArtifact=null,runs=[];
  const agent={agentId:'fixture-retained',async listArtifacts(){return remoteArtifact===null?[]:[{path:`/opt/cursor/artifacts/date-${firstTask.key}.json`}];},
    async downloadArtifact(){return Buffer.from(typeof remoteArtifact==='string'?remoteArtifact:JSON.stringify(remoteArtifact));}};
  const Agent={async create(){return agent;},async resume(id){assert.equal(id,agent.agentId);return agent;},
    async listRuns(){return {items:runs};},async getUsage(){return {usage:{totalTokens:1}};}};
  const cursor=cursorDateWorker({apiKey:'offline-only',model:'offline-fixture',maxWorkerBytes:65536,timeoutMs:1000,
    maxRunCostCents:300,maxRunTokens:4000000,async saveRemoteJob(){}},createRunControl(),{
    Agent,async send(){const run={id:`fixture-run-${++sendCount}`,status:'running'};runs=[run,...runs];return run;},
    async wait(run){remoteArtifact=sendCount===1?firstRaw:sendCount===2?secondRaw:proposal;run.status='completed';return run;},
  });
  const worker=async task=>{
    if(task.kind==='review'){
      if(task.key.startsWith('reaudit-'))throw new Error('fixture fresh independent reaudit interruption');
      return review(task);
    }
    firstTask??=task;proposal=repair(task);return cursor(task);
  };
  const run=options=>runDateWorkflow({book:'fixture',chapter:'001'},worker,{...f.options,...options});
  assert.equal((await run({})).status,'research-blocked');
  const originalLegacy=fs.readFileSync(path.join(directory,'research-blocker.json'));
  const buildSupplement=(raw,evidence)=>({schemaVersion:1,book:'fixture',chapter:'001',jobKey:firstTask.key,
    sourceHash:firstTask.packet.sourceHash,extractionHash:firstTask.packet.extractionHash,
    originalSourceHash:f.packet.sourceHash,originalExtractionHash:f.packet.extractionHash,
    blockerHash:sha256(raw),evidence});
  const firstSupplement=buildSupplement(firstRaw,'First independent source: https://example.invalid/one .');
  assert.equal((await run({researchSupplement:firstSupplement})).status,'research-blocked');
  const secondSupplement=buildSupplement(secondRaw,'Second independent source: https://example.invalid/two .');
  await assert.rejects(run({researchSupplement:secondSupplement}),/fixture fresh independent reaudit interruption/);
  const state=readJson(path.join(directory,'state.json'));
  const job=state.jobs[firstTask.key],receipt=state.researchSupplementReceipts[firstTask.key];
  assert.equal(sendCount,3);assert.equal(job.agentId,'fixture-retained');
  assert.deepEqual(job.researchAttempts.map(a=>a.blockerHash),[sha256(firstRaw).slice(7),sha256(secondRaw).slice(7)]);
  assert.equal(receipt.supplementHash,sha256(JSON.stringify(secondSupplement)).slice(7));
  for(const [raw,supplement] of [[firstRaw,firstSupplement],[secondRaw,secondSupplement]]){
    assert.equal(fs.readFileSync(path.join(directory,`raw-research-blocker-${sha256(raw).slice(7)}.json`),'utf8'),raw);
    assert.equal(fs.readFileSync(path.join(directory,`research-supplement-${sha256(JSON.stringify(supplement)).slice(7)}.json`),'utf8'),JSON.stringify(supplement));
  }
  assert.deepEqual(fs.readFileSync(path.join(directory,'research-blocker.json')),originalLegacy);
  assert.deepEqual(readJson(f.file),f.extraction);
  await assert.rejects(run({}),/fixture fresh independent reaudit interruption/);
  assert.equal(sendCount,3);
});

test('a second-blocker transition rejects missing, mismatched or nonblocked evidence before executing',async t=>{
  for(const failure of ['missing-raw','missing-normalized','wrong-job','wrong-hash','wrong-run','wrong-agent','same-blocker-changed-supplement','nonblocked']){
    const f=fixture(t),directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir);
    let task;
    const initial=async current=>{if(current.kind==='review')return review(current);task=current;return {blocked:true,reason:'The first fixture research hold needs primary evidence.'};};
    assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},initial,f.options)).status,'research-blocked');
    const initialRaw=JSON.stringify({blocked:true,reason:'The first fixture research hold needs primary evidence.'});
    const later=failure==='nonblocked'?{changes:[]}:{blocked:true,reason:'A different fixture research hold also needs primary evidence.'};
    const laterRaw=JSON.stringify(later),initialHash=sha256(initialRaw).slice(7),laterHash=sha256(laterRaw).slice(7);
    const firstSupplement={schemaVersion:1,book:'fixture',chapter:'001',jobKey:task.key,
      sourceHash:task.packet.sourceHash,extractionHash:task.packet.extractionHash,originalSourceHash:f.packet.sourceHash,
      originalExtractionHash:f.packet.extractionHash,blockerHash:`sha256:${initialHash}`,evidence:'Fixture source A.'};
    const secondSupplement={...firstSupplement,blockerHash:`sha256:${laterHash}`,evidence:'Fixture source B.'};
    const firstSupplementHash=sha256(JSON.stringify(firstSupplement)).slice(7);
    const normalized=Buffer.from(`${JSON.stringify(later,null,2)}\n`),normalizedHash=sha256(normalized.toString()).slice(7);
    const archive=path.join(directory,'blocker-archive',`${normalizedHash}.json`);
    fs.mkdirSync(path.dirname(archive),{recursive:true});
    fs.writeFileSync(archive,normalized);
    fs.writeFileSync(path.join(directory,`raw-research-blocker-${initialHash}.json`),initialRaw);
    fs.writeFileSync(path.join(directory,`raw-research-blocker-${laterHash}.json`),laterRaw);
    fs.writeFileSync(path.join(directory,`research-supplement-${firstSupplementHash}.json`),JSON.stringify(firstSupplement));
    const stateFile=path.join(directory,'state.json'),state=readJson(stateFile);
    state.jobs[task.key]={agentId:'fixture-agent',runId:'fixture-next-run',status:'returned',artifactHash:laterHash,
      researchSupplementHash:firstSupplementHash,researchBlockerHash:initialHash,
      researchAttempts:[{blockerHash:initialHash,supplementHash:firstSupplementHash,agentId:'fixture-agent',priorRunId:'fixture-prior-run'}]};
    state.blockerArchives.push({kind:'workflow-normalized',jobKey:task.key,path:`blocker-archive/${normalizedHash}.json`,
      sha256:normalizedHash,bytes:normalized.length,remoteArtifactHash:laterHash,agentId:'fixture-agent',runId:'fixture-next-run'});
    if(failure==='missing-raw')fs.unlinkSync(path.join(directory,`raw-research-blocker-${laterHash}.json`));
    if(failure==='missing-normalized')fs.unlinkSync(archive);
    if(failure==='wrong-job')secondSupplement.jobKey='repair-0-other-job';
    if(failure==='wrong-hash')secondSupplement.blockerHash=`sha256:${'0'.repeat(64)}`;
    if(failure==='wrong-run')state.jobs[task.key].runId='fixture-prior-run';
    if(failure==='wrong-agent')state.jobs[task.key].agentId='fixture-other-agent';
    if(failure==='same-blocker-changed-supplement')secondSupplement.blockerHash=firstSupplement.blockerHash;
    writeJsonAtomic(stateFile,state);
    let called=false;
    await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{called=true;throw new Error('must not execute');},
      {...f.options,researchSupplement:secondSupplement}),/supplement|transition|blocker|evidence/i,failure);
    assert.equal(called,false,failure);
    assert.deepEqual(readJson(f.file),f.extraction,failure);
    assert.equal(readJson(stateFile).researchSupplementReceipts?.[task.key],undefined,failure);
  }
});

test('archiving legacy blocker before interruption preserves exact bytes and resumes idempotently',async t=>{
  const f=fixture(t),directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir);
  const worker=async task=>task.kind==='review'?review(task):{blocked:true,reason:'The original chronology needs primary-source research.'};
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options)).status,'research-blocked');
  const legacy=path.join(directory,'research-blocker.json');
  const raw=Buffer.from('{\n  "blocked": true,\n  "reason": "Preserved legacy raw bytes need primary source research."\n}\n');
  fs.writeFileSync(legacy,raw);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async()=>{throw new Error('fixture interruption');},f.options),/fixture interruption/);
  let state=readJson(path.join(directory,'state.json'));
  const ref=state.blockerArchives.find(r=>r.kind==='legacy-raw-unattributed'&&r.sha256===sha256(raw.toString('utf8')).slice(7));
  assert.ok(ref);assert.deepEqual(fs.readFileSync(path.join(directory,ref.path)),raw);
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options)).status,'research-blocked');
  state=readJson(path.join(directory,'state.json'));
  assert.equal(state.blockerArchives.filter(r=>r.kind==='legacy-raw-unattributed'&&r.sha256===ref.sha256).length,1);
  assert.deepEqual(fs.readFileSync(legacy),raw);assert.deepEqual(readJson(f.file),f.extraction);
});

test('a prior retained repair context cannot independently re-audit its replacement work',async t=>{
  for(const priorField of ['priorAgentId','priorUsages']){
    const f=fixture(t);
    const worker=async task=>{
      if(task.kind==='repair'){
        await task.save({agentId:'new-repair-context',...(priorField==='priorAgentId'?{priorAgentId:'old-repair-context'}:{priorUsages:[{agentId:'old-repair-context'}]})});
        return repair(task);
      }
      const result=review(task);
      if(task.key.startsWith('reaudit-'))result.reviewer.agentId='old-repair-context';
      return result;
    };
    await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options),/cannot approve its own/);
    assert.deepEqual(readJson(f.file),f.extraction);
  }
});
test('person-check context includes that person\'s other dates and evidence',t=>{
  const f=fixture(t);
  f.extraction.claims.push(['p001','age',{age:20},'explicit',['s0002']]);writeJsonAtomic(f.file,f.extraction);
  const packet=buildDateAuditPacket('fixture','001',f.options),jobs=dateReviewJobs(packet,f.options);
  const job=jobs.find(j=>j.ownedPeople.includes('p001'));
  assert.ok(job.contextItems.some(i=>i.id==='claim-4'));assert.ok(job.units.some(u=>u.id==='s0002'));
});
test('an unstarted staged review can accept an amended proposal without losing earlier rounds',async t=>{
  const f=fixture(t);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},async task=>{
    if(task.key.startsWith('reaudit-'))throw new Error('waiting for reviewer');
    return task.kind==='repair'?repair(task):review(task);
  },f.options),/waiting for reviewer/);
  const dir=dateWorkflowDirectory('fixture','001',f.options.peopleDir),candidate=readJson(path.join(dir,'candidate-1.json'));
  const packet=buildDateAuditPacket('fixture','001',{...f.options,extraction:candidate});
  const proposal={sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,author:{name:'Researcher',agentId:'repair-researcher'},changes:[{kind:'hints',personId:'p001',before:['AD 1'],after:['AD 1 (first-year fixture event)'],reason:'Clarify the hint without inventing additional fixture chronology.'}]};
  revisePendingDateRepair({book:'fixture',chapter:'001'},proposal,f.options);
  assert.equal(readJson(path.join(dir,'state.json')).round,2);
  assert.deepEqual(readJson(f.file),f.extraction);
  await runDateWorkflow({book:'fixture',chapter:'001'},async task=>review(task),f.options);
  assert.equal(readJson(path.join(dir,'publication.json')).rounds.length,2);
  assert.throws(()=>revisePendingDateRepair({book:'fixture',chapter:'001'},proposal,f.options),/review has started/);
});

function formattedRepair(task) {
  const proposal = repair(task);
  proposal.changes.find(change => change.kind === 'hints').after = ['AD onOrAfter 1 (fixture first year)'];
  return proposal;
}
test('repair hint formatting avoids a worker retry and preserves the raw proposal with an immutable receipt', async t => {
  const f=fixture(t);let repairs=0;
  f.options.validateExtraction = extraction => {
    for (const person of extraction.people) for (const hint of person[4].a) {
      assert.doesNotMatch(hint, /^(?:AD|BC) onOr/u, 'production validation sees normalized hints');
    }
  };
  const worker=async task=>task.kind==='repair' ? (repairs++,formattedRepair(task)) : review(task);
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options)).status,'audited');
  assert.equal(repairs,1);
  const directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir),state=readJson(path.join(directory,'state.json'));
  const records=Object.entries(state.hintFormattingReceipts);
  assert.equal(records.length,1);
  const [key,record]=records[0],receipt=readJson(path.join(directory,record.path));
  assert.equal(receipt.proposalHash,sha256(JSON.stringify(readJson(path.join(directory,key+'.json')))));
  assert.equal(readJson(path.join(directory,key+'.json')).changes.find(c=>c.kind==='hints').after[0],'AD onOrAfter 1 (fixture first year)');
  assert.deepEqual(receipt.changes,[{personId:'p001',index:0,before:'AD onOrAfter 1 (fixture first year)',after:'on or after AD 1 (fixture first year)'}]);
  assert.equal(readJson(f.file).people[0][4].a[0],'on or after AD 1 (fixture first year)');
  assert.equal(receipt.originalExtractionHash,f.packet.extractionHash);
  assert.equal(dateAuditStatus('fixture','001',f.options).status,'audited');
  const receiptFile=path.join(directory,record.path);
  fs.appendFileSync(receiptFile,' ');
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},()=>{throw Error('worker must not run');},f.options),/hint-formatting receipt changed/);
});
test('formatted repair remains staged until a fresh independent audit succeeds', async t => {
  const f=fixture(t);
  const worker=async task=>{
    if(task.kind==='repair')return formattedRepair(task);
    if(task.packet.extractionHash!==f.packet.extractionHash)throw Error('Awaiting independent re-audit');
    return review(task);
  };
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options),/Awaiting independent re-audit/);
  assert.deepEqual(readJson(f.file),f.extraction);
  const directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir),state=readJson(path.join(directory,'state.json'));
  assert.equal(state.phase,'reaudit');
  assert.ok(Object.keys(state.hintFormattingReceipts).length);
  assert.notEqual(dateAuditStatus('fixture','001',f.options).status,'audited');
});
test('a retained formatting receipt cannot adopt a changed raw repair proposal', async t => {
  const f=fixture(t);
  const worker=async task=>{
    if(task.kind==='repair')return formattedRepair(task);
    if(task.packet.extractionHash!==f.packet.extractionHash)throw Error('Awaiting independent re-audit');
    return review(task);
  };
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options),/Awaiting independent re-audit/);
  const directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir),state=readJson(path.join(directory,'state.json'));
  const key=Object.keys(state.hintFormattingReceipts)[0],file=path.join(directory,key+'.json'),proposal=readJson(file);
  proposal.changes[0].reason+=' Altered.';
  writeJsonAtomic(file,proposal);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},()=>{throw Error('worker must not run');},f.options),/receipt scope or proposal changed/);
  assert.deepEqual(readJson(f.file),f.extraction);
});
test('a retained formatting receipt rejects a changed intermediate candidate before any model turn', async t => {
  const f=fixture(t);
  const worker=async task=>{
    if(task.kind==='repair')return formattedRepair(task);
    if(task.packet.extractionHash!==f.packet.extractionHash)throw Error('Awaiting independent re-audit');
    return review(task);
  };
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options),/Awaiting independent re-audit/);
  const directory=dateWorkflowDirectory('fixture','001',f.options.peopleDir),state=readJson(path.join(directory,'state.json'));
  const record=Object.values(state.hintFormattingReceipts)[0],receipt=readJson(path.join(directory,record.path));
  const candidateFile=path.join(directory,receipt.afterCandidateFile),candidate=readJson(candidateFile);
  candidate.people[0][4].a[0]='AD 999';
  writeJsonAtomic(candidateFile,candidate);
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},()=>{throw Error('worker must not run');},f.options),/normalized repair candidate changed/);
  assert.deepEqual(readJson(f.file),f.extraction);
});
