import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {test} from 'node:test';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {PINS,assertClaim,assertUnstarted,IndependentReviewBoundary} from '../guards.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
process.env.PEOPLE_REPO_ROOT='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const load=p=>import(pathToFileURL(path.join(runtime,'scripts',p)).href);
const {dateExecutorIsBusy,extractionClaimBlocksDateAudit}=await load('lib/people-work-queue.mjs');
const {runDateWorkflow,dateWorkflowDirectory}=await load('lib/people-date-workflow.mjs');
const {writeJsonAtomic,readJson}=await load('lib/people-content.mjs');
const {createDateWorkerPool}=await load('lib/people-date-concurrency.mjs');
const baseline=()=>({claims:{},dateAudits:{[PINS.key]:{...PINS,status:'active',jobs:{[PINS.job]:{status:'interrupted'}}}}});
const guard=ledger=>assertClaim(ledger,{hostname:'fixture-host',token:'new-token',reserving:true,busy:dateExecutorIsBusy,extractionBlocks:extractionClaimBlocksDateAudit});
test('ownership, pins, leases and started SDK work fail closed',()=>{
  assert.ok(guard(baseline()));
  for(const patch of [{worker:'other'},{lane:'manual'},{generationId:'other'},{sourceHash:'other'},{extractionHash:'other'},{executorHost:'another-host'},{executorToken:'old',executorExpiresAt:new Date(Date.now()+60000).toISOString()},{executorToken:'expired',executorExpiresAt:'2000-01-01'},{status:'ready'},{combinedCuration:{}}]) {
    const ledger=baseline();Object.assign(ledger.dateAudits[PINS.key],patch);assert.throws(()=>guard(ledger));
  }
  for(const patch of [{sent:true},{agentId:'bc-real'},{runId:'run-real'},{priorAgentId:'bc-old'},{artifactHash:'download'},{nativeAuthorId:'native-old'}])assert.throws(()=>assertUnstarted({status:'interrupted',...patch}));
});
test('actual workflow stages native proposal and unstarted independent plan on tiny synthetic fixture',async t=>{
  const root=fs.mkdtempSync(path.join(here,'synthetic-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const options={dataDir:path.join(root,'data'),peopleDir:path.join(root,'people'),maxUnits:250,maxBytes:253952,maxRounds:3,maxAttempts:3,jobConcurrency:4,generationId:'synthetic-generation',workerPool:createDateWorkerPool(4),validateExtraction:c=>assert.ok(Array.isArray(c.claims))};
  const target={book:'fixture',chapter:'001'};
  writeJsonAtomic(path.join(options.dataDir,'fixture/001.json'),{content:[{sentences:[{id:'s0001',zh:'元年甲卒。',translation:'Jia died in year one.'}]}]});
  const extraction={schemaVersion:2,...target,input:{unitCount:1,chapterFingerprint:'fixture',candidateScannerVersion:2,unitDigests:[]},run:{model:'synthetic-extractor'},people:[['p001',['Jia','甲'],'historical','Official',{a:['AD 2']}]],surfaces:[],claims:[['p001','attestation',{sourceDate:{text:'元年'},westernYear:{era:'AD',year:2,precision:'year'}},'explicit',['s0001']]],translationRepairs:[],candidateDispositions:[],coverage:{}};
  const originalFile=path.join(options.peopleDir,'extractions/fixture/001.json');writeJsonAtomic(originalFile,extraction);
  const originalBytes=fs.readFileSync(originalFile);
  await assert.rejects(runDateWorkflow(target,async task=>{
    if(task.kind==='repair')throw new Error('synthetic audit checkpoint only');
    const check=id=>({id,verdict:'incorrect',reason:'The synthetic source says year one, not year two.',event:'Jia participates in the synthetic year-one event.',evidence:[{unit:'s0001',quote:'元年'}]});
    return {jobId:task.job.id,sourceHash:task.packet.sourceHash,extractionHash:task.packet.extractionHash,reviewedAt:new Date().toISOString(),reviewer:{name:'Synthetic independent reviewer',agentId:'synthetic-independent',independentOfExtractor:true},summary:'All owned units and date items checked against the synthetic source.',reviewedUnits:task.job.ownedUnits,itemChecks:task.job.ownedItems.map(check),personChecks:task.job.ownedPeople.map(id=>({...check(id),verdict:'supported'})),findings:[{items:['claim-1','hints-p001'],problem:'Synthetic date two conflicts with year one.',action:'Correct the synthetic event and hint to year one.'}],references:[]};
  },options),/synthetic audit checkpoint/);
  const reportFile=path.join(options.peopleDir,'date-audits/fixture/001.json'),negativeReport=fs.readFileSync(reportFile);
  let repaired=false,plan;
  await assert.rejects(runDateWorkflow(target,async task=>{
    if(task.kind==='review') {assert.ok(repaired);assert.deepEqual(task.state,{});throw new IndependentReviewBoundary('synthetic independent review required');}
    assert.equal(task.kind,'repair');assert.ok(!task.state.agentId && !task.state.runId && !task.state.sent);
    const before=task.extraction.claims[0],after=structuredClone(before);after[2].westernYear.year=1;
    task.save({status:'returned',nativeAuthorId:'synthetic-native'});repaired=true;
    return {author:{agentId:'synthetic-native'},sourceHash:task.packet.sourceHash,extractionHash:task.packet.extractionHash,changes:[{kind:'replace',id:'claim-1',before,after,reason:'The synthetic year-one source supports this date.'},{kind:'hints',personId:'p001',before:['AD 2'],after:['AD 1'],reason:'Synchronize synthetic activity hints with the corrected event.'}]};
  },{...options,saveReviewPlan:async(key,value)=>{assert.equal(key,'reaudit-1');plan=value;}}),e=>e instanceof AggregateError && e.errors.every(x=>x instanceof IndependentReviewBoundary));
  const dir=dateWorkflowDirectory(target.book,target.chapter,options.peopleDir),state=readJson(path.join(dir,'state.json'));
  assert.equal(state.phase,'reaudit');assert.equal(state.round,1);assert.equal(state.candidate,'candidate-1.json');assert.deepEqual(state.reviewPlans['reaudit-1'],plan);
  const repairJob=Object.values(state.jobs).find(j=>j.nativeAuthorId==='synthetic-native');assert.equal(repairJob.proposalAuthorId,'synthetic-native');assert.ok(!repairJob.agentId && !repairJob.runId && !repairJob.sent);
  assert.equal(readJson(path.join(dir,state.candidate)).claims[0][2].westernYear.year,1);
  assert.ok(fs.readFileSync(originalFile).equals(originalBytes));
  assert.ok(fs.readFileSync(reportFile).equals(negativeReport));
});
