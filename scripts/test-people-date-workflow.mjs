import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { writeJsonAtomic, readJson } from './lib/people-content.mjs';
import { buildDateAuditPacket, dateAuditStatus } from './lib/people-date-audit.mjs';
import { dateReviewJobs, retainedDateReviewJobs, applyDateRepairProposal, dateRepairDifference, runDateWorkflow, dateWorkflowDirectory, publishDateRepair, validateDateJobResult, revisePendingDateRepair } from './lib/people-date-workflow.mjs';
import { validatePeopleWorkLedger, reservePeopleTargetsInLedger, dateExecutorIsBusy } from './lib/people-work-queue.mjs';

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
test('review partitions own every unit, date and person exactly once',t=>{
  const f=fixture(t),jobs=dateReviewJobs(f.packet,f.options);
  assert.equal(jobs.length,2);
  for(const field of ['ownedUnits','ownedItems','ownedPeople'])assert.equal(new Set(jobs.flatMap(j=>j[field])).size,jobs.flatMap(j=>j[field]).length);
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
function receptionRepair(f) {
  const proposal=repair({packet:f.packet,extraction:f.extraction});
  proposal.changes.push({kind:'add-reception-event',after:['p001','event-participation',
    {kind:'posthumous-reference',role:'remembered-official',action:'remembered'},'explicit',['s0001']],
    reason:'Keep the later reference separate from this official\'s living activity.'});
  return proposal;
}
test('scoped reception additions survive final-delta reconstruction and remain audit items',t=>{
  const f=fixture(t),proposal=receptionRepair(f),candidate=applyDateRepairProposal(f.extraction,proposal,f.packet);
  const combined=dateRepairDifference(f.extraction,candidate,f.packet);
  assert.equal(combined.changes.at(-1).kind,'hints');
  assert.equal(combined.changes.filter(c=>c.kind==='add-reception-event').length,1);
  assert.deepEqual(applyDateRepairProposal(f.extraction,combined,f.packet),candidate);
  const packet=buildDateAuditPacket('fixture','001',{...f.options,extraction:candidate});
  assert.ok(packet.items.some(i=>i.value?.kind==='posthumous-reference'));
});
test('reception additions reject non-reception events, life claims, conflicting labels and bad evidence',t=>{
  const f=fixture(t),proposal=receptionRepair(f);
  for(const mutate of [
    row=>{row[1]='role';},row=>{row[1]='attestation';},row=>{row[0]='p999';},
    row=>{row[2]={kind:'battle'};},row=>{row[2].receptionType='retrospective';},
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
  assert.ok(reconstructed.claims.some(c=>c[2].kind==='posthumous-reference'));
  const bad=structuredClone(candidate);bad.claims.find(c=>c[2].kind==='appointment')[2].kind='battle';
  assert.throws(()=>applyDateRepairProposal(f.extraction,dateRepairDifference(f.extraction,bad,f.packet),f.packet),/Only life\/date/);
});
test('a reception repair stays staged until a fresh reviewer approves the added event',async t=>{
  const f=fixture(t);let approve=false;let receptionChecks=0;
  const worker=async task=>{
    if(task.kind==='repair')return receptionRepair(f);
    if(task.key.startsWith('reaudit-') && !approve)throw new Error('waiting for independent reception review');
    if(task.key.startsWith('reaudit-'))receptionChecks+=task.job.items.filter(i=>i.value?.kind==='posthumous-reference').length;
    return review(task);
  };
  await assert.rejects(runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options),/waiting for independent/);
  assert.deepEqual(readJson(f.file),f.extraction);
  approve=true;
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options)).status,'audited');
  assert.equal(receptionChecks,1);
  assert.ok(readJson(f.file).claims.some(c=>c[2].kind==='posthumous-reference'));
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
  ledger.dateAudits['fixture/001'].lane='unknown';assert.throws(()=>validatePeopleWorkLedger(ledger),/date-audit reservation/);
});
test('completed workflow starts a new generation when the chapter changes',async t=>{
  const f=fixture(t),worker=async task=>task.kind==='repair'?repair(task):review(task);
  await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options);
  f.source.content[0].sentences[1].zh+='乙仕。';writeJsonAtomic(f.sourceFile,f.source);
  assert.equal((await runDateWorkflow({book:'fixture',chapter:'001'},worker,f.options)).status,'audited');
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
