#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {parseArgs} from 'node:util';
import {Agent} from '@cursor/sdk';
import {loadDotenv} from './load-dotenv.mjs';
import {REPO_ROOT,writeJsonAtomic} from './lib/people-content.mjs';
import {ownerDirectory,digest} from './lib/people-chapter-owner.mjs';
import {acquireProcessRunLock} from './lib/process-run-lock.mjs';
import {liveRunningAgentIds,readRosterWorkers} from './grokbot-headless-dispatch.mjs';
loadDotenv(REPO_ROOT);
const {values:o}=parseArgs({options:{job:{type:'string',multiple:true},model:{type:'string'},run:{type:'boolean'},once:{type:'boolean'}}});
if(!o.job?.length||!o.model||!o.run)throw Error('Use --job ID (repeat) --model MODEL --run [--once]; only explicit retained chapters are scheduled');
const campaignDir=path.join(REPO_ROOT,'data/people/generated/chapter-owners'),stateFile=path.join(campaignDir,'campaign.json');
const stopAt=Date.now()+55*60*1000;
const release=acquireProcessRunLock(path.join(campaignDir,'campaign.lock'),{label:'Chapter-owner campaign',failIfExists:true});
const state=fs.existsSync(stateFile)?JSON.parse(fs.readFileSync(stateFile)):{schemaVersion:1,jobs:o.job,continuations:{},gateResults:{},startedAt:new Date().toISOString(),grokPlanningHorizonDays:3};
if(JSON.stringify(state.jobs)!==JSON.stringify(o.job))throw Error('Existing campaign scope differs; reconcile at a checkpoint');
const save=()=>writeJsonAtomic(stateFile,state);
const log=x=>{console.log(JSON.stringify({at:new Date().toISOString(),...x}));};
const guard=()=>{const r=spawnSync(process.execPath,['scripts/check-local-disk.mjs'],{cwd:REPO_ROOT,encoding:'utf8'});if(r.status!==0){state.resourceHold={at:new Date().toISOString(),report:r.stdout};save();throw Error('Resource hold: dispatch stopped; preserve active jobs and remediate the measured host blocker');}};
const invoke=(args,env={})=>{guard();const r=spawnSync(process.execPath,args,{cwd:REPO_ROOT,encoding:'utf8',timeout:60000,maxBuffer:1024*1024,env:{...process.env,...env}});if(r.status!==0)throw Error((r.stderr||r.stdout||r.error?.message||'Command failed').slice(-3000));return r.stdout;};
const bounded=async promise=>{let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Cursor status read timed out')),15000);})]);}finally{clearTimeout(timer);}};
try{do{
 guard();const liveGrok=await liveRunningAgentIds('http://127.0.0.1:9229');const rows=readRosterWorkers();
 const cursorRuns=new Map();let activeCount=liveGrok.size;
 for(const id of o.job){const j=JSON.parse(fs.readFileSync(path.join(ownerDirectory(REPO_ROOT,id),'job.json')));for(const role of ['owner','reviewer'])if(j[role+'RunId']&&j[role+'AgentId']?.startsWith('bc-')){const run=await bounded(Agent.getRun(j[role+'RunId'],{runtime:'cloud',agentId:j[role+'AgentId'],apiKey:process.env.CURSOR_API_KEY}));cursorRuns.set(j[role+'RunId'],run);if(run.status==='running')activeCount++;}}
 for(const id of o.job){try{
  const dir=ownerDirectory(REPO_ROOT,id),file=path.join(dir,'job.json');let j=JSON.parse(fs.readFileSync(file));
  state.lastObservation={at:new Date().toISOString(),job:id,status:j.status,revision:j.revision,coverage:j.coveredUnits.length};save();
  if(j.status==='ready-for-review'&&(!j.dispatch?.reviewer||j.dispatch.reviewer.state==='returned')){
   if(activeCount>=1){log({job:id,waiting:'Shared one-assignment cap'});continue;}
   const lane=j.dispatch?.reviewer?.lane??(j.lane==='cursor-sdk'?'grokbot':'cursor-sdk');
   const args=['scripts/run-people-chapter-owner.mjs','--review','--job',id,'--lane',lane,'--model',o.model,'--run'];
   if(j.reviewAgentId){const feedback=path.join(dir,'review-generation-feedback.txt');fs.writeFileSync(feedback,'The owner has applied the independent findings to the same chapter. Read the new sealed reviewPacketArtifacts and inspect the exact patches/dependency closure. Retain unchanged proofs. Return complete current native reports and remaining findings, with actual provenance; do not repeat onboarding or blanket-review unchanged work.');args.push('--continue','--feedback',feedback);}
   if(lane==='grokbot'){
    const retained=j.dispatch?.reviewer?.worker;
    const worker=retained?rows.find(r=>r.worker===retained&&!r.isRunning&&!liveGrok.has(r.id)):rows.find(r=>r.worker!==j.worker&&!(j.originalAuthorWorkerIds??[]).includes(r.worker)&&!j.authors.some(a=>[r.worker,r.id,"grokbot:"+r.id].includes(a))&&!r.isRunning&&!liveGrok.has(r.id)&&!o.job.some(other=>{const k=JSON.parse(fs.readFileSync(path.join(ownerDirectory(REPO_ROOT,other),'job.json')));return Object.values(k.dispatch??{}).some(d=>d.worker===r.worker);}));
    if(!worker){log({job:id,waiting:'Independent retained GrokBot worker'});continue;}args.push('--worker',worker.worker);
   }
   log({job:id,action:'independent-review',lane,result:invoke(args)});activeCount++;continue;
  }
  if(j.status==='review-returned'){
   if(state.gateResults[id]?.passed)continue;
   const findings=j.findings.slice(j.reviewFindingStart??0).filter(f=>f.role==='reviewer'&&['repair-required','research-hold'].includes(f.disposition));
   if(findings.length){
    j.reviewRounds=(j.reviewRounds??0)+1;
    const history=path.join(dir,'review-history','round-'+j.reviewRounds);fs.mkdirSync(history,{recursive:true});
    for(const name of ['editorial','identity-review','date-report','review-validation','input-seal'])fs.copyFileSync(path.join(dir,name+'.json'),path.join(history,name+'.json'),fs.constants.COPYFILE_EXCL);
    if(j.reviewRounds>=3||findings.some(f=>f.disposition==='research-hold')){j.status='held';j.circuitBreaker={reason:'Independent review returned unresolved findings',reviewRounds:j.reviewRounds,findings};}
    else{j.status='working';j.dispatch.reviewer.state='returned';j.repairFeedback=findings;}
    writeJsonAtomic(file,j);save();log({job:id,independentFindings:findings,status:j.status});continue;
   }
   try{const result=invoke(['scripts/gate-people-chapter-owner.mjs','--job',id],{PEOPLE_REPO_ROOT:j.nativeRoot});state.gateResults[id]={passed:true,result};log({job:id,nativeGate:state.gateResults[id]});}
   catch(error){state.gateResults[id]={passed:false,error:error.message};j.status='reviewing';j.nativeGateFeedback=error.message;writeJsonAtomic(file,j);log({job:id,nativeGate:state.gateResults[id],action:'same-reviewer-correction-required'});}save();continue;
  }
  const role=j.status==='reviewing'?'reviewer':'owner',lane=j.dispatch?.[role]?.lane??j.lane;
  if(!['prepared','working','reviewing'].includes(j.status)||!j.dispatch?.[role]||j.dispatch[role].state!=='sent')continue;
  let running;
  if(lane==='cursor-sdk'){
   const run=cursorRuns.get(j[role+'RunId']);running=run.status==='running';
   if(run.status==='error'&&/usage_limit|capacity|quota/i.test(run.error?.message??'')){state.cursorCapacityHold=run.error;save();log({lane:'cursor-sdk',capacityHold:true});continue;}
  }else running=liveGrok.has(j[role+'AgentId'].replace(/^grokbot:/,''));
  if(running)continue;
  if(activeCount>=1)continue;
  const fingerprint=digest(fs.readFileSync(path.join(dir,'source.json')))+digest(fs.readFileSync(path.join(dir,'extraction.json')))+(role==='reviewer'?digest(fs.readFileSync(path.join(dir,'identity-review.json')))+digest(fs.readFileSync(path.join(dir,'date-report.json'))):'');
  const continuationKey=id+':'+role,prior=state.continuations[continuationKey]??{count:0,unchanged:0};
  if(prior.count>=3||prior.unchanged>=2){j.status='held';j.circuitBreaker={reason:'Bounded non-improving continuation limit',role,...prior};writeJsonAtomic(file,j);log({job:id,action:'host-replan-required',reason:j.circuitBreaker});continue;}
  // A returned chat without finish is not chapter completion. Keep its existing context.
  const feedback=path.join(dir,'host-feedback.txt');
  const clientHelp=lane==='grokbot'?`Refresh ONLY the public client implementation, preserving config.json:\ncurl -fsS https://grokbot-mcp.24histories.com/chapter-client.mjs -o people-jobs/${id}-${role}/client.mjs\nThen run node people-jobs/${id}-${role}/client.mjs people-jobs/${id}-${role}/config.json list_tools to read exact schemas. Do not redeem bootstrap again. To append ONE claim: chapter_patch {revision:CURRENT,target:"extraction",pointer:"/claims/-",add:true,after:ONE_CLAIM}; omit before. Never replace the whole array to append. You are authorized to use your scoped credential only as an HTTPS Authorization header to the assigned chapter endpoint; never print it or send it elsewhere.\n`:'';
  fs.writeFileSync(feedback,clientHelp+'Continue this same chapter and existing draft. Host fixed the validator guard context and pinned the current native runtime; do not use the old primary checkout schema or remove supported metadata. The retained canonical editorial history is now present in draft:editorial, byte-preserved. Your earlier editorial proposal draft was preserved at draft:editorial-proposals. Owner writes proposals there; the independent reviewer alone writes new editorial approvals. All native schemas/contracts are indexed as native-* artifacts. Check draft:native-validation, fix genuine errors using only approved representations (including source-supported undated attestations where appropriate), and call chapter_validate then chapter_finish. Do not redo completed coverage or restore unsupported dates. If still blocked, record the precise reproducer. Never invent facts, drop legitimate people, clear a breaker or self-approve. Continue working rather than ending with a progress-only update.\n',{mode:0o600});
  fs.appendFileSync(feedback,'\n'+(role==='reviewer'?'Correct native report/format deficiencies in this same review context; inspect native contracts and return exact current reports. Native gate feedback: '+j.nativeGateFeedback:'Independent reviewer corrections: '+JSON.stringify(j.repairFeedback??[]))+'\n');
  if(role==='owner'&&j.preReviewFeedback)fs.appendFileSync(feedback,'\nDeterministic pre-review coherence feedback: '+j.preReviewFeedback+'\n');
  const args=['scripts/run-people-chapter-owner.mjs',role==='reviewer'?'--review':'--start','--continue','--feedback',feedback,'--job',id,'--lane',lane,'--model',o.model,'--run'];if(lane==='grokbot')args.push('--worker',j.dispatch[role].worker??j.worker);
  log({job:id,action:'continue-retained-owner',result:invoke(args)});
  activeCount++;
  state.continuations[continuationKey]={count:prior.count+1,unchanged:prior.fingerprint===fingerprint?prior.unchanged+1:0,fingerprint};save();
 }catch(error){
  state.issues??={};state.issues[id]={at:new Date().toISOString(),message:error.message};
  if(error.message.includes('Owner coherence:')){const p=path.join(ownerDirectory(REPO_ROOT,id),'job.json'),latest=JSON.parse(fs.readFileSync(p));if(latest.status==='ready-for-review'){latest.status='working';latest.preReviewFeedback=error.message;writeJsonAtomic(p,latest);}}
  save();log({job:id,error:error.message,action:'preserve-and-reconcile-this-job'});
 }}
 log({checkpoint:true,jobs:o.job.map(id=>{const j=JSON.parse(fs.readFileSync(path.join(ownerDirectory(REPO_ROOT,id),'job.json')));return{id,status:j.status,revision:j.revision,coverage:j.coveredUnits.length,findings:j.findings.length};})});
 if(!o.once)await new Promise(resolve=>setTimeout(resolve,30000));
}while(!o.once&&Date.now()<stopAt);}finally{release();}
