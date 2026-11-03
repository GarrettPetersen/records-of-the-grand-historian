import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildDateAuditPacket, unresolvedDateAuditItems } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import { retainedDateReviewJobs } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-workflow.mjs';
import { inspectLocalDisk } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',runtime='/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime';
const base=path.dirname(fileURLToPath(import.meta.url)),job=base+'/full-reaudit-2',read=f=>JSON.parse(fs.readFileSync(f));
const need=(ok,message)=>{if(!ok)throw Error(message);};
const revision='d02a90e73e3f269dc7071ee547d06dcc3505fdce';
need(process.argv.length===2,'This is the single sealed Jinshu080 re-audit invocation');
need(!fs.existsSync(job),'Retained full re-audit exists; recover its actual CLI/agent/run handles');
const review=read(base+'/preflight-resume-correction-review-report.json'),reviewState=read(base+'/preflight-resume-correction-review-state.json');
const packetHash=createHash('sha256').update(fs.readFileSync(base+'/preflight-resume-correction-review-packet.json')).digest('hex');
need(reviewState.phase==='report-recorded'&&review.verdict==='approve'&&review.revision===revision&&review.reviewerAgentId===reviewState.agentId&&review.packetSha256===packetHash,'Exact independent code approval required');
need(execFileSync('git',['rev-parse','HEAD'],{cwd:runtime,encoding:'utf8'}).trim()===revision,'Runtime code changed');
const file=root+'/data/people/generated/date-workflow/jinshu/080/state.json',before=read(file);
need(before.phase==='reaudit'&&before.round===2&&!before.circuitBreaker,'Preserve another phase or circuit hold');
need(!Object.keys(before.jobs).some(key=>key.startsWith('reaudit-2-')),'Existing reviews need recovery, not a fresh invocation');
const options={dataDir:root+'/data',peopleDir:root+'/data/people',maxUnits:40,maxBytes:56*1024-8192};
const active=buildDateAuditPacket('jinshu','080',{...options,extraction:read(path.join(path.dirname(file),before.candidate))});
need(active.extractionHash==='sha256:af2ead9e282388392087d7c7f57b97362656fa7d88d355844a63fee1e208af28'&&!unresolvedDateAuditItems(active).length,'Research or evidence changed');
const {plan,jobs}=retainedDateReviewJobs(active,before,options),expected=new Set(jobs.map(row=>'reaudit-2-'+row.id));
need(expected.size===jobs.length&&jobs.length>0,'Invalid complete review plan');
for(const name of ['one-review-state.json','second-range-calibration/one-review-state.json']){
  const calibration=read(base+'/'+name);need(calibration.phase==='terminal'&&!calibration.resourceHold&&!calibration.observationError&&!calibration.measurementError&&calibration.newRuns?.length===1,'Two safe retained calibrations required');
  const completed=before.jobs[calibration.newRuns[0].key];need(completed?.status==='returned'&&!completed.validationError&&completed.usage?.data?.cost?.rawCostCents<300&&completed.usage?.data?.usage?.totalTokens<4000000,'Calibration did not pass native validation/budgets');
}
need(!inspectLocalDisk(root).errors.length,'Host guard rejected dispatch');
fs.mkdirSync(job,{recursive:false});
const state={schemaVersion:1,kind:'bounded-complete-chapter-date-reaudit',worker:'jinshu-release-dates-cursor-sdk',phase:'starting',startedAt:new Date().toISOString(),revision,scope:{book:'jinshu',chapter:'080'},sourceHash:before.sourceHash,originalExtractionHash:before.extractionHash,candidateExtractionHash:active.extractionHash,expectedJobs:[...expected],limits:{concurrency:2,rawCostCentsPerRun:300,totalTokensPerRun:4000000,minutesPerRun:20},drainPolicy:'One SIGINT after every planned review has captured a run, or resource/time hold. Stop queued work and drain active runs; no force or second signal.'};
const save=()=>fs.writeFileSync(job+'/state.json',JSON.stringify(state,null,2)+'\n');
const sample=()=>{const guard=inspectLocalDisk(root);fs.appendFileSync(job+'/resources.jsonl',JSON.stringify({at:new Date().toISOString(),guard})+'\n');return guard;};
fs.writeFileSync(job+'/plan.json',JSON.stringify({plan,expectedJobs:[...expected],sourceUnits:active.units.length,people:active.people.length,dateItems:active.items.length},null,2)+'\n',{flag:'wx'});
need(!sample().errors.length,'Guard failed before launch');
const log=fs.openSync(job+'/host.log','wx',0o600);
const args=['--max-old-space-size=3072',runtime+'/scripts/run-people-date-workflow.mjs','--book','jinshu','--chapter','080','--worker',state.worker,'--lane','cursor-sdk','--model','grok-4.6','--run','--retry-blocked','--concurrency','1','--job-concurrency','2','--limit','1','--max-units','40','--max-worker-kib','56','--max-rounds','3','--max-run-cost','3','--max-run-tokens','4000000','--run-timeout-minutes','20','--summary-out',job+'/summary.json'];
const child=spawn(process.execPath,args,{cwd:runtime,env:{...process.env,PEOPLE_REPO_ROOT:root},stdio:['ignore',log,log]});fs.closeSync(log);state.pid=child.pid;state.phase='running';save();
let drained=false;
const drain=reason=>{if(drained)return;need(child.kill('SIGINT'),'Owned CLI could not be drained; inspect actual process');drained=true;state.drainRequestedAt=new Date().toISOString();state.drainReason=reason;save();};
const capture=setInterval(()=>{try{const current=read(file);need(current.sourceHash===before.sourceHash&&current.extractionHash===before.extractionHash,'Retained source generation changed');const rows=Object.entries(current.jobs).filter(([key,value])=>expected.has(key)&&value.runId).map(([key,value])=>({key,agentId:value.agentId,runId:value.runId,status:value.status}));state.runs=rows;save();if(rows.length===expected.size)drain('Complete bounded review cohort captured; preserve and finish active reviews before any new repair work');}catch(error){state.observationError=error.message;save();drain('Observation failed; preserve active work');}},1000);
const resource=setInterval(()=>{try{if(sample().errors.length){state.resourceHold=true;save();drain('Resource guard stopped new dispatch');}}catch(error){state.resourceHold=true;state.measurementError=error.message;save();drain('Resource measurement failed');}},45000);
const duration=setTimeout(()=>drain('Bounded coordinator time reached; preserve remaining planned work'),55*60000);
console.log(JSON.stringify({pid:child.pid,expectedReviewJobs:expected.size,concurrency:2,candidateHash:active.extractionHash}));
try{state.result=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',(code,signal)=>resolve({code,signal}));});state.phase='terminal';state.finishedAt=new Date().toISOString();save();console.log(JSON.stringify({phase:state.phase,result:state.result,capturedReviewJobs:state.runs?.length??0,resourceHold:state.resourceHold??false}));}
finally{clearInterval(capture);clearInterval(resource);clearTimeout(duration);sample();}
