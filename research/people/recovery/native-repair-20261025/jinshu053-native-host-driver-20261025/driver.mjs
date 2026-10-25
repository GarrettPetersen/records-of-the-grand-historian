import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {parseArgs} from 'node:util';
import {PINS,need,assertUnstarted,assertClaim,IndependentReviewBoundary} from './guards.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const HOST='/Users/garrettpetersen/records-of-the-grand-historian';
const RUNTIME='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
const {values:args}=parseArgs({options:{apply:{type:'boolean'},proposal:{type:'string'},'proposal-sha256':{type:'string'},author:{type:'string'}}});
need(!process.env.PEOPLE_REPO_ROOT || process.env.PEOPLE_REPO_ROOT===ROOT,'Conflicting PEOPLE_REPO_ROOT');
process.env.PEOPLE_REPO_ROOT=ROOT;
// Read-only local preflight first, including on --apply. No remote fetch in preview.
execFileSync(process.execPath,[path.join(HOST,'scripts/check-local-disk.mjs')],{cwd:HOST,stdio:'inherit'});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const pins=read(path.join(HERE,'input-pins.json'));
for(const [file,digest] of Object.entries(pins.files))need(hash(fs.readFileSync(file))===digest,`Pinned file changed: ${file}`);
const load=relative=>import(pathToFileURL(path.join(RUNTIME,'scripts',relative)).href);
const {PEOPLE_DIR,readJson}=await load('lib/people-content.mjs');
const {buildDateAuditPacket}=await load('lib/people-date-audit.mjs');
const {runDateWorkflow,dateWorkflowDirectory,applyDateRepairProposal,deriveDateRepairEditorialAmendment}=await load('lib/people-date-workflow.mjs');
const {mutateRemotePeopleWorkLedger,dateExecutorIsBusy,extractionClaimBlocksDateAudit}=await load('lib/people-work-queue.mjs');
const {acquireProcessRunLock}=await load('lib/process-run-lock.mjs');
const {createDateWorkerPool}=await load('lib/people-date-concurrency.mjs');
const {createRunControl,installSignalHandlers}=await load('lib/cursor-run-control.mjs');
const {buildPeopleExtractionPacket}=await load('build-people-extraction-packet.mjs');
const {validateCompactPeopleExtraction}=await load('validate-people-extraction.mjs');
const {loadProperNounMatcher}=await load('lib/people-candidates.mjs');
const {editorialDecisionPath,validateAppliedEditorialDecisions}=await load('lib/people-editorial-decisions.mjs');
const directory=dateWorkflowDirectory(PINS.book,PINS.chapter),stateFile=path.join(directory,'state.json');
const lockFile=path.join(PEOPLE_DIR,'generated/date-workflow-run.lock');
need(!fs.existsSync(lockFile),'Date workflow process lock exists; inspect original owner');
const packet=buildDateAuditPacket(PINS.book,PINS.chapter);
need(packet.sourceHash===PINS.sourceHash && packet.extractionHash===PINS.extractionHash,'Source/extraction fingerprints changed');
const state=readJson(stateFile),report=readJson(path.join(directory,'review-0.json'));
for(const key of ['generationId','sourceHash','extractionHash'])need(state[key]===PINS[key],`Retained state changed: ${key}`);
need(state.phase==='repair' && state.round===0 && state.review==='review-0.json','Expected repair round zero');
need(!state.circuitBreaker && !state.candidate && !state.repairCandidate && !state.repairIndex,'Unexpected candidate, breaker or repair progress');
assertUnstarted(state.jobs[PINS.job]);
need(report.findings.length===19 && state.repairPlan?.length===1,'Expected all nineteen findings in one repair');
const findingSet=rows=>JSON.stringify(rows.map(row=>JSON.stringify(row)).sort());
need(findingSet(state.repairPlan[0].findings)===findingSet(report.findings),'Repair findings differ from complete current report');
need(!fs.existsSync(path.join(directory,`${PINS.job}.json`)),'Repair artifact already exists');
need(args.proposal && path.isAbsolute(args.proposal),'Provide --proposal ABSOLUTE_PATH');
need(/^[a-f0-9]{64}$/.test(args['proposal-sha256']??''),'Provide sealed --proposal-sha256');
need(typeof args.author==='string' && args.author.trim()===args.author && args.author.length>0 && !args.author.startsWith('bc-'),'Provide actual native --author identity');
const proposalBytes=fs.readFileSync(args.proposal),proposal=JSON.parse(proposalBytes.toString('utf8'));
need(hash(proposalBytes)===args['proposal-sha256'],'Proposal bytes changed');
need(proposal.author?.agentId===args.author,'Proposal author must equal actual native author');
need(proposal.sourceHash===PINS.sourceHash && proposal.extractionHash===PINS.extractionHash,'Proposal scope changed');
need(!proposal.blocked,'A blocker cannot stage a candidate');
const extractionPacket=buildPeopleExtractionPacket(PINS.book,PINS.chapter,{properNounMatcher:loadProperNounMatcher()});
const validateExtraction=candidate=>{
  const result=validateCompactPeopleExtraction(candidate,extractionPacket);
  const editorial=editorialDecisionPath(PINS.book,PINS.chapter);
  if(fs.existsSync(editorial)) {
    const decisions=readJson(editorial);
    try {validateAppliedEditorialDecisions(decisions,result.normalized);}
    catch(error) {const editorialAmendment=deriveDateRepairEditorialAmendment(decisions,result.normalized);if(!editorialAmendment)throw error;return {editorialAmendment};}
  }
};
// Same full production gate as the CLI, also evaluated on preview.
const extraction=readJson(path.join(PEOPLE_DIR,'extractions/jinshu/053.json'));
validateExtraction(extraction);
const previewCandidate=applyDateRepairProposal(extraction,proposal,packet);
validateExtraction(previewCandidate);
const previewCandidateHash=`sha256:${hash(Buffer.from(JSON.stringify(previewCandidate)))}`;
const token=randomUUID(),leaseMs=3600000;
const check=(ledger,reserving=false)=>assertClaim(ledger,{hostname:os.hostname(),token,reserving,busy:dateExecutorIsBusy,extractionBlocks:extractionClaimBlocksDateAudit});
// Host supplied a sealed authentic snapshot. Preview performs no Git operations.
const snapshot=read(path.join(HERE,'host-ledger-snapshot.json'));
need(snapshot.key===PINS.key && snapshot.dateAudit && Object.hasOwn(snapshot,'extractionClaim'),'Invalid sealed host snapshot');
const previewLedger={dateAudits:{[PINS.key]:snapshot.dateAudit},claims:{[PINS.key]:snapshot.extractionClaim}};
check(previewLedger,true);
if(!args.apply) {
  console.log(JSON.stringify({mode:'preflight-only',paidCalls:0,remoteMutations:0,workflowWrites:0,pins:PINS,proposalSha256:hash(proposalBytes),previewCandidateHash,nativeAuthorId:args.author,findings:19,next:'Host reviews driver and sealed proposal, then explicitly invokes --apply; preview ledger is the sealed host snapshot.'},null,2));
} else {
  const unlock=acquireProcessRunLock(lockFile,{label:'People date workflow',failIfExists:true});
  const control=createRunControl(),removeSignals=installSignalHandlers(control);
  const options={maxUnits:250,maxBytes:256*1024-8192,maxWorkerBytes:256*1024,jobConcurrency:4,
    maxRounds:3,maxAttempts:3,maxRunCostCents:300,maxRunTokens:4000000,timeoutMs:1200000,maxToolTurns:20,
    generationId:PINS.generationId,validateExtraction,workerPool:createDateWorkerPool(4,{shouldStop:()=>control.stopRequested})};
  let reserved=false,returned=false,boundarySeen=false;
  const mutate=(callback,message)=>mutateRemotePeopleWorkLedger(callback,{message});
  try {
    mutate(ledger=>{
      // Recheck durable files on every CAS retry; never reset or recreate a claim.
      for(const [file,digest] of Object.entries(pins.files))need(hash(fs.readFileSync(file))===digest,`Pinned file changed before reservation: ${file}`);
      const claim=check(ledger,true);
      need(JSON.stringify(claim)===JSON.stringify(previewLedger.dateAudits[PINS.key]),'Remote date claim differs from sealed host snapshot');
      claim.executorHost=os.hostname();claim.executorToken=token;
      claim.executorExpiresAt=new Date(Date.now()+leaseMs).toISOString();claim.updatedAt=new Date().toISOString();
    },`Reserve native repair staging executor ${PINS.key}`);
    reserved=true;
    const saveRemoteJob=async(job,patch)=>mutate(ledger=>{
      const claim=check(ledger);need(job===PINS.job,'Unexpected native job');assertUnstarted(claim.jobs[job]);
      claim.jobs[job]={...claim.jobs[job],...patch};claim.executorExpiresAt=new Date(Date.now()+leaseMs).toISOString();
    },`Checkpoint genuine native repair author ${PINS.key}`);
    options.saveReviewPlan=async(key,plan)=>mutate(ledger=>{
      const claim=check(ledger);need(key==='reaudit-1','Unexpected independent review plan');
      need(plan.maxUnits===250 && plan.maxBytes===253952,'Independent review envelope changed');
      claim.reviewPlans??={};
      need(!claim.reviewPlans[key] || JSON.stringify(claim.reviewPlans[key])===JSON.stringify(plan),'Remote review plan differs');
      claim.reviewPlans[key]=plan;claim.executorExpiresAt=new Date(Date.now()+leaseMs).toISOString();
    },`Retain unstarted independent re-audit plan ${PINS.key}`);
    const worker=async task=>{
      need(!control.stopRequested,'Host requested stop');
      if(task.kind==='review') {
        need(returned && task.key.startsWith('reaudit-1-'),'Unexpected review boundary');
        need(!task.state.agentId && !task.state.sent && !task.state.runId,'Independent reviewer already started');
        boundarySeen=true;throw new IndependentReviewBoundary('Native candidate staged; resume original Cursor CLI for independent review');
      }
      need(task.kind==='repair' && task.key===PINS.job && !returned,'Unexpected or repeated native repair task');
      assertUnstarted(task.state);
      need(task.workflowSourceHash===PINS.sourceHash && task.workflowExtractionHash===PINS.extractionHash,'Task generation fingerprints changed');
      need(findingSet(task.findings)===findingSet(report.findings),'Task no longer owns all nineteen findings');
      need(hash(fs.readFileSync(args.proposal))===args['proposal-sha256'],'Proposal changed at submission');
      // Author identity is honest provenance, never a fabricated Cursor agent/run.
      const patch={status:'returned',nativeAuthorId:args.author,localProposalHash:hash(proposalBytes),localProposalPath:args.proposal};
      await saveRemoteJob(task.key,patch);task.save(patch);returned=true;
      return structuredClone(proposal);
    };
    let outcome;
    try {outcome=await runDateWorkflow({book:PINS.book,chapter:PINS.chapter},worker,options);}
    catch(error) {
      const final=readJson(stateFile);
      // Accept only the deliberate post-staging boundary, never arbitrary workflow errors.
      const isBoundary=e=>e instanceof IndependentReviewBoundary || (e instanceof AggregateError && e.errors.length>0 && e.errors.every(isBoundary));
      need(isBoundary(error) && boundarySeen && returned && final.phase==='reaudit' && final.round===1 && final.candidate==='candidate-1.json' && final.reviewPlans?.['reaudit-1'],'Workflow failed before the expected independent review boundary: '+error.message);
      console.log(JSON.stringify({status:'candidate-staged-independent-review-pending',paidCalls:0,approved:false,published:false,nativeAuthorId:args.author,candidate:path.join(directory,final.candidate),workerPool:options.workerPool.summary()}));
    }
    need(outcome===undefined,'Unexpected workflow return; preserve and inspect state');
  } finally {
    try {
      if(reserved)mutate(ledger=>{const claim=check(ledger);delete claim.executorToken;delete claim.executorExpiresAt;},'Release native staging executor lease; retain sticky date claim and review ownership');
    } finally {removeSignals();unlock();}
  }
}
