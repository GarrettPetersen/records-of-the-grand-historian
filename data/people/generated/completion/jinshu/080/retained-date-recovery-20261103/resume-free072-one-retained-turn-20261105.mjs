import fs from 'node:fs';
import os from 'node:os';
import {randomUUID,createHash} from 'node:crypto';
import {parseArgs} from 'node:util';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {loadDotenv} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/load-dotenv.mjs';
import {acquireProcessRunLock} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/process-run-lock.mjs';
import {readRemotePeopleWorkLedger,mutateRemotePeopleWorkLedger,dateExecutorIsBusy,extractionClaimBlocksDateAudit} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-work-queue.mjs';
import {buildDateAuditPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import {retainedDateReviewJobs,runDateWorkflow} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-workflow.mjs';
import {dateWorkerInput,openRouterDateWorker} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-worker.mjs';
import {verifyOpenRouterFreeModel,DEFAULT_OPENROUTER_FREE_MODEL} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/openrouter-free.mjs';
import {buildPeopleExtractionPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import {loadProperNounMatcher} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import {validateCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
import {validateAppliedEditorialDecisions} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
const {values:args}=parseArgs({options:{'expected-turn':{type:'string',default:'25'},'max-new-requests':{type:'string',default:'1'},'output-name':{type:'string',default:'free072-resume-one-turn-20261105'}}});
const firstTurn=Number(args['expected-turn']),maxNewRequests=Number(args['max-new-requests']),maxTurns=firstTurn+maxNewRequests-1;
if(!Number.isSafeInteger(firstTurn)||firstTurn<1||!Number.isSafeInteger(maxNewRequests)||maxNewRequests<1||maxNewRequests>12||!/^[a-z0-9-]+$/.test(args['output-name']))throw Error('Invalid bounded retained-job parameters');
const root='/Users/garrettpetersen/records-of-the-grand-historian',base=new URL('.',import.meta.url).pathname,out=base+args['output-name']+'/',peopleDir=root+'/data/people',wf=peopleDir+'/generated/date-workflow/jinshu/072',target={book:'jinshu',chapter:'072'},worker='openrouter-local-dates',model=DEFAULT_OPENROUTER_FREE_MODEL,claimKey='jinshu/072';
const read=p=>JSON.parse(fs.readFileSync(p)),need=(v,m)=>{if(!v)throw Error(m)},hash=b=>createHash('sha256').update(b).digest('hex'),json=v=>JSON.stringify(v,null,2)+'\n';
need(!fs.existsSync(out),'Preserve previous bounded invocation');need(!inspectLocalDisk(root).errors.length,'Resource guard hold');
const native=read(wf+'/state.json'),packet=buildDateAuditPacket('jinshu','072',{dataDir:root+'/data',peopleDir}),plan=retainedDateReviewJobs(packet,structuredClone(native)),job=plan.jobs[0],key='audit-0-'+job.id,toolStateFile=wf+'/openrouter-tools-'+key+'/state.json',prior=read(toolStateFile),marker='No shell or external model API is available.\n';
need(native.phase==='audit'&&native.round===0&&!native.circuitBreaker,'Unexpected retained workflow phase');need(native.sourceHash===packet.sourceHash&&native.extractionHash===packet.extractionHash,'Retained source changed');need(!prior.finished&&prior.nextTurn===firstTurn,'Retained continuation turn differs from explicit bound');need(!fs.existsSync(wf+'/openrouter-tools-'+key+'/response-'+firstTurn+'.json'),'Recover the saved response instead of a new request');
need(prior.messages[0].content.includes(marker),'Unknown original prompt envelope');
const instructions=prior.messages[0].content.slice(prior.messages[0].content.indexOf(marker)+marker.length),input=dateWorkerInput({kind:'review',job:{...job,instructions}}),fingerprint='sha256:'+hash(Buffer.from(JSON.stringify({version:1,key,input,model})));
need(fingerprint===prior.fingerprint,'Recovered original sealed input does not match fingerprint');
const sourcePacket=buildPeopleExtractionPacket('jinshu','072',{chapterData:read(root+'/data/jinshu/072.json'),chapterFile:root+'/data/jinshu/072.json',properNounMatcher:loadProperNounMatcher()}),editorial=read(peopleDir+'/editorial-decisions/jinshu/072.json');
const validateExtraction=candidate=>{const valid=validateCompactPeopleExtraction(candidate,sourcePacket,{strictAliasDispositions:true});validateAppliedEditorialDecisions(editorial,valid.normalized);return valid};
validateExtraction(read(peopleDir+'/extractions/jinshu/072.json'));
loadDotenv(root);const verified=await verifyOpenRouterFreeModel({key:process.env.OPENROUTER_API_KEY,model});
const ledger=readRemotePeopleWorkLedger(),oldClaim=ledger.dateAudits[claimKey];need(oldClaim?.worker===worker&&oldClaim.lane==='openrouter'&&!dateExecutorIsBusy(oldClaim),'Sticky owner is absent, changed or busy');
need(oldClaim.status!=='research-blocked'&&!oldClaim.sourceQualityHold,'Retained free date calibration requires independent source re-check; do not repeat this approach');
fs.mkdirSync(out);fs.writeFileSync(out+'before.json',json({at:new Date().toISOString(),pid:process.pid,sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,worker,model,jobKey:key,originalPromptRestoredWithoutRetagging:true,originalInputFingerprint:fingerprint,toolStateSha256:hash(fs.readFileSync(toolStateFile)),nextTurn:firstTurn,maxNewInferenceRequests:maxNewRequests,verifiedZeroPricing:verified.pricing,priorWorkflowStateSha256:hash(fs.readFileSync(wf+'/state.json')),priorClaim:oldClaim,chapterApproved:false}),{flag:'wx'});
const unlock=acquireProcessRunLock(peopleDir+'/generated/date-workflow-run.lock',{label:'People date workflow',failIfExists:true}),executorToken=randomUUID();let reserved=false,hold=false,timer,result,error;
const assertOwner=claim=>need(claim?.worker===worker&&claim.lane==='openrouter'&&claim.executorToken===executorToken&&claim.sourceHash===packet.sourceHash&&claim.extractionHash===packet.extractionHash,'Date ownership changed');
const sample=()=>{const guard=inspectLocalDisk(root);fs.appendFileSync(out+'resources.jsonl',JSON.stringify({at:new Date().toISOString(),guard})+'\n');if(guard.errors.length)hold=true;return guard};
try{
 need(!sample().errors.length,'Resource guard hold');
 mutateRemotePeopleWorkLedger(l=>{const c=l.dateAudits[claimKey];need(c?.worker===worker&&c.lane==='openrouter'&&!dateExecutorIsBusy(c),'Retained date owner became busy');need(c.sourceHash===packet.sourceHash&&c.extractionHash===packet.extractionHash&&!extractionClaimBlocksDateAudit(l.claims?.[claimKey]),'Reservation source or extraction owner changed');Object.assign(c,{executorToken,executorHost:os.hostname(),executorExpiresAt:new Date(Date.now()+20*60000).toISOString(),updatedAt:new Date().toISOString()});},{message:'Resume bounded retained free Jinshu072 date job under the same owner'});reserved=true;
 timer=setInterval(sample,45000);
 const saveRemoteJob=async(jobKey,patch)=>mutateRemotePeopleWorkLedger(l=>{const c=l.dateAudits[claimKey];assertOwner(c);c.jobs[jobKey]={...c.jobs[jobKey],...patch};c.executorExpiresAt=new Date(Date.now()+20*60000).toISOString();},{message:'Checkpoint bounded retained free date review'});
 const saveReviewPlan=async(planKey,current)=>mutateRemotePeopleWorkLedger(l=>{const c=l.dateAudits[claimKey];assertOwner(c);need(JSON.stringify(c.reviewPlans[planKey])===JSON.stringify(current),'Retained review ownership changed');},{message:'Verify retained free review plan'});
 const provider=openRouterDateWorker({key:process.env.OPENROUTER_API_KEY,model,maxWorkerBytes:49152,timeoutMs:120000,maxToolTurns:maxTurns,saveRemoteJob});
 const boundedWorker=async task=>{need(!hold,'Stop new requests after resource warning');need(!sample().errors.length,'Resource guard hold');need(task.kind==='review'&&task.key===key,'Bounded continuation stops before another job or repair');return provider({...task,job:{...task.job,instructions}})};
 result=await runDateWorkflow(target,boundedWorker,{dataDir:root+'/data',peopleDir,maxUnits:80,maxBytes:40960,maxWorkerBytes:49152,maxRounds:3,maxAttempts:3,jobConcurrency:1,validateExtraction,saveReviewPlan});
}catch(e){error={message:e.message,status:e.status??null,retryAfter:e.retryAfter??null};}
finally{
 if(timer)clearInterval(timer);
 if(reserved)mutateRemotePeopleWorkLedger(l=>{const c=l.dateAudits[claimKey];assertOwner(c);delete c.executorToken;delete c.executorExpiresAt;c.lastBoundedFreeResume={at:new Date().toISOString(),jobKey:key,attemptedMaxNewRequests:maxNewRequests,result:result?.status??null,error:error?.message??null};},{message:'Release bounded free review executor; preserve sticky context'});
 unlock();
}
const after=read(toolStateFile),responses=[];
for(let turn=firstTurn;turn<=maxTurns;turn++){const file=wf+'/openrouter-tools-'+key+'/response-'+turn+'.json';if(fs.existsSync(file)){const response=read(file);responses.push({turn,file,sha256:hash(fs.readFileSync(file)),model:response.model,requestId:response.id,cost:response.usage?.cost??null,tokens:response.usage?.total_tokens??null})}}
const receipt={at:new Date().toISOString(),kind:'bounded-retained-free-date-review-resume',worker,model,jobKey:key,originalInputFingerprint:fingerprint,sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,originalPromptRestoredWithoutRetagging:true,beforeNextTurn:firstTurn,afterNextTurn:after.nextTurn,maxNewRequests,responses,finished:after.finished,savedRecords:Object.fromEntries(Object.entries(after.records).map(([k,v])=>[k,Object.keys(v).length])),error,result,executorReleased:reserved,globalLockReleased:!fs.existsSync(peopleDir+'/generated/date-workflow-run.lock'),canonicalWrites:0,newDateApprovals:0,newCompletedChapters:0,newPublishedChapters:0,finalResourceGuard:sample()};
fs.writeFileSync(out+'receipt.json',json(receipt),{flag:'wx'});console.log(JSON.stringify(receipt));
