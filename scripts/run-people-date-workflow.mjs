#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { randomUUID } from 'node:crypto';
import { parseArgs } from 'node:util';
import { PEOPLE_DIR, REPO_ROOT, readJson, writeJsonAtomic } from './lib/people-content.mjs';
import { peopleExtractionFiles } from './lib/people-corpus.mjs';
import { buildDateAuditPacket, dateAuditStatus } from './lib/people-date-audit.mjs';
import { dateReviewJobs, dateWorkflowDirectory, runDateWorkflow } from './lib/people-date-workflow.mjs';
import { cursorDateWorker, attachmentDateWorker } from './lib/people-date-worker.mjs';
import { mutateRemotePeopleWorkLedger, claimIsActive, dateExecutorIsBusy } from './lib/people-work-queue.mjs';
import { acquireProcessRunLock } from './lib/process-run-lock.mjs';
import { createRunControl, installSignalHandlers } from './lib/cursor-run-control.mjs';
import { loadDotenv } from './load-dotenv.mjs';
import { readPeopleCampaignPolicy } from './lib/people-campaign-policy.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { editorialDecisionPath, validateAppliedEditorialDecisions } from './lib/people-editorial-decisions.mjs';

const {values:o} = parseArgs({ options:{book:{type:'string'},chapter:{type:'string'},all:{type:'boolean'},
  worker:{type:'string'},lane:{type:'string',default:'cursor-sdk'},run:{type:'boolean'},
  'dry-run':{type:'boolean'},limit:{type:'string',default:'5'},concurrency:{type:'string',default:'2'},
  model:{type:'string'},'max-units':{type:'string',default:'40'},'max-worker-kib':{type:'string',default:'64'},
  'max-rounds':{type:'string',default:'3'},'max-run-cost':{type:'string',default:'3'},
  'max-run-tokens':{type:'string',default:'4000000'},'run-timeout-minutes':{type:'string',default:'20'},
  'attachment-dir':{type:'string'},'release':{type:'boolean'},'retry-blocked':{type:'boolean'},takeover:{type:'boolean'},
  'min-approved':{type:'string',default:'0'},'summary-out':{type:'string'},order:{type:'string',default:'balanced'},
  'recover-only':{type:'boolean'},'cursor-capacity-start':{type:'string'} } });
const integer = (key,max) => { const value=Number(o[key]); if(!Number.isSafeInteger(value)||value<1||value>max)throw new Error(`Invalid --${key}`); return value; };
if ((!o.book && !o.all) || (o.book && o.all) || (o.chapter && !o.book)) throw new Error('Use --book [--chapter NNN] or --all');
if (!['cursor-sdk','grokbot','manual'].includes(o.lane)) throw new Error('Unknown date worker lane');
if (!['balanced','calibration'].includes(o.order))throw new Error('Unknown date workload order');
if (o.chapter && !/^\d{3}$/.test(o.chapter)) throw new Error('--chapter requires three digits');
if (!o['dry-run'] && !o.worker) throw new Error('A stable --worker ID is required');
if (o.release && (!o.book || !o.chapter)) throw new Error('--release requires one explicit --book and --chapter');
if (!o.release && !o['recover-only'] && !o['dry-run'] && o.lane==='cursor-sdk' && (!o.run || !o.model)) throw new Error('Paid Cursor execution requires explicit --run and --model; use --dry-run otherwise');
if (!o.release && o.lane!=='cursor-sdk' && !o['dry-run'] && !o['attachment-dir']) throw new Error('Attachment lanes require --attachment-dir');
if (o.lane!=='cursor-sdk' && o.run) throw new Error('Grok Bot/manual lanes must not call Cursor SDK');
const concurrency=integer('concurrency',8), limit=integer('limit',1000);
const minimumApproved=Number(o['min-approved']);
if(!Number.isSafeInteger(minimumApproved)||minimumApproved<0||minimumApproved>limit)throw new Error('Invalid --min-approved');
const options = {maxUnits:integer('max-units',1000),maxBytes:integer('max-worker-kib',512)*1024-8192,
  recoverOnly:Boolean(o['recover-only']),
  maxWorkerBytes:integer('max-worker-kib',512)*1024,maxRounds:integer('max-rounds',20),
  maxRunTokens:integer('max-run-tokens',10000000),timeoutMs:integer('run-timeout-minutes',120)*60000};
const dollars=Number(o['max-run-cost']);
if(!Number.isFinite(dollars)||dollars<=0||dollars>20) throw new Error('Invalid --max-run-cost');
options.maxRunCostCents=Math.round(dollars*100);
const control=createRunControl();
let matcher;
let targets=peopleExtractionFiles().map(file=>{const e=readJson(file);return {book:e.book,chapter:e.chapter,file,personCount:e.people.length,unitCount:e.input.unitCount,claimCount:e.claims.length,pendingEditorial:e.translationRepairs?.some(r=>(Array.isArray(r)?r[6]:r.status)==='proposed')};})
  .filter(t=>(!o.book||t.book===o.book)&&(!o.chapter||t.chapter===o.chapter)&&(o.release||(!t.pendingEditorial && dateAuditStatus(t.book,t.chapter).status!=='audited')));
targets.sort((a,b)=>Number(fs.existsSync(path.join(dateWorkflowDirectory(b.book,b.chapter),'state.json')))-Number(fs.existsSync(path.join(dateWorkflowDirectory(a.book,a.chapter),'state.json')))||fs.statSync(a.file).size-fs.statSync(b.file).size);
const sticky=targets.filter(t=>fs.existsSync(path.join(dateWorkflowDirectory(t.book,t.chapter),'state.json')));
const fresh=targets.filter(t=>!sticky.includes(t));
const named=fresh.filter(t=>t.personCount>0),empty=fresh.filter(t=>!t.personCount),ordered=[];
if(o.order==='calibration') {
  const books=new Set();
  for(const quantile of [0.1,0.3,0.5,0.7,0.85]) {
    const pool=named.filter(t=>!books.has(t.book)&&t.unitCount>=5&&t.unitCount<=60&&t.personCount<=25&&t.claimCount<=150);
    if(!pool.length)break;
    const chosen=pool[Math.min(pool.length-1,Math.floor(pool.length*quantile))];
    ordered.push(chosen);books.add(chosen.book);named.splice(named.indexOf(chosen),1);
  }
  if(ordered.length+sticky.length<Math.min(limit,5,targets.length))throw new Error('Not enough bounded nonempty calibration chapters; inspect and assign an explicit cohort');
}
while(named.length || empty.length) {
  if(named.length)ordered.push(named.splice(ordered.length%4===3?Math.floor(named.length/2):0,1)[0]);
  if(empty.length && (!named.length || ordered.length%20===0))ordered.push(empty.shift());
}
targets=[...sticky,...ordered];
if (o['dry-run']) {
  const selected=targets.slice(0,limit).map(t=>{const p=buildDateAuditPacket(t.book,t.chapter);const jobs=dateReviewJobs(p,options);return {book:t.book,chapter:t.chapter,items:p.items.length,units:p.units.length,jobs:jobs.length,maxJobBytes:Math.max(...jobs.map(j=>Buffer.byteLength(JSON.stringify(j))))};});
  console.log(JSON.stringify({paidCalls:0,eligibleChapters:targets.length,concurrency,selected},null,2));
} else {
  loadDotenv(REPO_ROOT);
  if(o.lane==='cursor-sdk' && !o.release && !o['recover-only']) {
    const capacityStart=o['cursor-capacity-start']??process.env.PEOPLE_CURSOR_CAPACITY_START??readPeopleCampaignPolicy().lanes['cursor-sdk'].capacityStart;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(capacityStart))throw new Error('Invalid Cursor capacity date');
    const today=new Intl.DateTimeFormat('sv-SE',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    if(today<capacityStart)throw new Error(`Cursor SDK capacity is unavailable until ${capacityStart}; use --recover-only for artifacts without inference`);
  }
  options.apiKey=process.env.CURSOR_API_KEY;
  if(!o.release && o.lane==='cursor-sdk' && !options.apiKey) throw new Error('CURSOR_API_KEY is missing');
  const unlock=acquireProcessRunLock(path.join(PEOPLE_DIR,'generated','date-workflow-run.lock'),{label:'People date workflow'});
  const removeSignals=installSignalHandlers(control);
  const executorToken=randomUUID(),leaseMs=Math.max(3600000,options.timeoutMs+600000);
  let cursor=0,started=0,approved=0;
  const outcomes=[];
  try {
    // Recover a completed host publication even when the process died before
    // checkpointing its remote outcome. No model turn is needed for this step.
    mutateRemotePeopleWorkLedger(ledger=>{
      for(const [key,claim] of Object.entries(ledger.dateAudits??{})) {
        if(claim.worker!==o.worker || claim.status==='ready' || (claim.executorHost && claim.executorHost!==os.hostname()))continue;
        if(dateExecutorIsBusy(claim,{executorToken,takeover:o.takeover}))continue;
        const [book,chapter]=key.split('/');
        if(fs.existsSync(path.join(PEOPLE_DIR,'extractions',book,`${chapter}.json`)) && dateAuditStatus(book,chapter).status==='audited') {
          const current=buildDateAuditPacket(book,chapter);
          const receipt=path.join(PEOPLE_DIR,'date-repairs',book,chapter,`${current.extractionHash.slice(7)}.json`);
          if(claim.sourceHash!==current.sourceHash || (claim.extractionHash!==current.extractionHash && (!fs.existsSync(receipt)||readJson(receipt).proposal.extractionHash!==claim.extractionHash)))continue;
          claim.status='ready';claim.updatedAt=new Date().toISOString();
        }
      }
    },{message:'Reconcile completed date publications'});
    const processNext=async()=>{
      while(!control.stopRequested && cursor<targets.length && started<limit) {
        const target=targets[cursor++],key=`${target.book}/${target.chapter}`;
        const packet=buildDateAuditPacket(target.book,target.chapter);
        const reserved=mutateRemotePeopleWorkLedger(ledger=>{
          ledger.dateAudits ??= {};
          const prior=ledger.dateAudits[key];
          if(o.release) {
            if(!prior||prior.worker!==o.worker)throw new Error('Only the owning worker may release date work');
            if(dateExecutorIsBusy(prior,{executorToken,takeover:o.takeover}))throw new Error('Stop the active executor before explicitly taking over its reservation');
            delete ledger.dateAudits[key];return {released:true};
          }
          if(dateExecutorIsBusy(prior,{executorToken,takeover:o.takeover}))return null;
          if(prior && prior.status!=='ready' && (prior.worker!==o.worker || prior.lane!==o.lane))return null;
          if(prior?.status!=='ready' && prior?.executorHost && prior.executorHost!==os.hostname() && !o.takeover)throw new Error('Date work belongs to another host; stop that executor before using --takeover');
          if(prior?.status==='research-blocked'&&!o['retry-blocked'])return null;
          if(claimIsActive(ledger.claims[key]) && !['ready','complete'].includes(ledger.claims[key].status))return null;
          const changed=prior&&(prior.sourceHash!==packet.sourceHash||prior.extractionHash!==packet.extractionHash);
          const retainedState=path.join(dateWorkflowDirectory(target.book,target.chapter),'state.json');
          const finishing=changed && fs.existsSync(retainedState) && readJson(retainedState).phase==='publish';
          if(changed && prior.status!=='ready' && !finishing)throw new Error(`Sticky date work ${key} changed; reconcile before release`);
          if(prior?.status==='ready') { ledger.dateAuditHistory??={}; (ledger.dateAuditHistory[key]??=[]).push(prior); }
          const claim=prior?.status==='ready'||!prior?{worker:o.worker,lane:o.lane,sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,jobs:{}}:prior;
          claim.status='active';claim.executorHost=os.hostname();claim.executorToken=executorToken;claim.executorExpiresAt=new Date(Date.now()+leaseMs).toISOString();claim.updatedAt=new Date().toISOString();ledger.dateAudits[key]=claim;return claim;
        },{message:`Reserve date audit ${key}`}).result;
        if(!reserved)continue;
        if(reserved.released){console.log(`Released ${key}; local recovery artifacts retained`);continue;}
        started+=1;
        const saveRemoteJob=async(job,patch)=>mutateRemotePeopleWorkLedger(ledger=>{
          const claim=ledger.dateAudits?.[key];
          if(!claim||claim.worker!==o.worker||claim.executorToken!==executorToken||claim.sourceHash!==packet.sourceHash||claim.extractionHash!==packet.extractionHash)throw new Error('Date reservation changed');
          claim.jobs[job]={...claim.jobs[job],...patch};
          claim.executorExpiresAt=new Date(Date.now()+leaseMs).toISOString();
        },{message:`Checkpoint date work ${key}`});
        const saveReviewPlan=async(planKey,plan)=>mutateRemotePeopleWorkLedger(ledger=>{
          const claim=ledger.dateAudits?.[key];
          if(!claim||claim.executorToken!==executorToken)throw new Error('Lost date executor before planning');
          claim.reviewPlans??={};
          if(claim.reviewPlans[planKey]&&JSON.stringify(claim.reviewPlans[planKey])!==JSON.stringify(plan))throw new Error('Remote date chunk ownership differs from local plan');
          claim.reviewPlans[planKey]=plan;claim.executorExpiresAt=new Date(Date.now()+leaseMs).toISOString();
        },{message:`Retain date ownership plan ${key}`});
        const directory=dateWorkflowDirectory(target.book,target.chapter);
        const stateFile=path.join(directory,'state.json');
        if(!fs.existsSync(stateFile)&&(Object.keys(reserved.jobs).length||Object.keys(reserved.reviewPlans??{}).length)) writeJsonAtomic(stateFile,{schemaVersion:1,workflowVersion:1,sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,round:0,phase:'audit',jobs:reserved.jobs,reviewPlans:reserved.reviewPlans??{},restoredFromLedger:true});
        matcher ??= loadProperNounMatcher();
        const extractionPacket=buildPeopleExtractionPacket(target.book,target.chapter,{properNounMatcher:matcher});
        const validateExtraction=candidate=>{
          const result=validateCompactPeopleExtraction(candidate,extractionPacket);
          const editorial=editorialDecisionPath(target.book,target.chapter);
          if(fs.existsSync(editorial))validateAppliedEditorialDecisions(readJson(editorial),result.normalized);
        };
        const worker=o.lane==='cursor-sdk'?cursorDateWorker({...options,model:o.model,saveRemoteJob},control):attachmentDateWorker({outputDir:path.resolve(o['attachment-dir']),saveRemoteJob});
        try {
          const result=await runDateWorkflow(target,worker,{...options,validateExtraction,saveReviewPlan});
          console.log(`${key}: ${result.status}`);
          outcomes.push({book:target.book,chapter:target.chapter,status:result.status});
          if(result.status==='audited')approved+=1;
          if(result.status!=='audited')process.exitCode=1;
          mutateRemotePeopleWorkLedger(ledger=>{
            const claim=ledger.dateAudits?.[key];if(!claim||claim.executorToken!==executorToken)throw new Error('Lost date reservation');
            claim.status=result.status==='audited'?'ready':result.status==='research-blocked'?'research-blocked':'active';
          },{message:`Date review outcome ${key}`});
        }catch(error){console.error(`${key}: ${error.message}`);outcomes.push({book:target.book,chapter:target.chapter,status:'interrupted',error:error.message});process.exitCode=1;}
      }
    };
    const settled=await Promise.allSettled(Array.from({length:concurrency},processNext));
    for(const result of settled)if(result.status==='rejected'){console.error(result.reason.message);process.exitCode=1;}
    const summary={started,approved,failed:outcomes.filter(r=>r.status!=='audited').length,eligibleChapters:targets.length,results:outcomes};
    if(o['summary-out'])writeJsonAtomic(path.resolve(o['summary-out']),summary);
    console.log(JSON.stringify(summary));
    if(approved<minimumApproved){console.error(`Only ${approved}/${minimumApproved} required date chapters approved`);process.exitCode=1;}
  } finally {
    try {mutateRemotePeopleWorkLedger(ledger=>{
      for(const claim of Object.values(ledger.dateAudits??{}))if(claim.executorToken===executorToken){delete claim.executorToken;delete claim.executorExpiresAt;}
    },{message:'Release date executor leases; retain review ownership'});}
    finally {removeSignals();unlock();}
  }
}
