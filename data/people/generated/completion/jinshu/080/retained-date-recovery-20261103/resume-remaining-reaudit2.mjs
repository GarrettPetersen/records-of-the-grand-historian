import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn,execFileSync} from 'node:child_process';
import {buildDateAuditPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import {retainedDateReviewJobs,validateDateJobResult} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-workflow.mjs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',runtime='/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime';
const base=path.dirname(fileURLToPath(import.meta.url)),directory=root+'/data/people/generated/date-workflow/jinshu/080',jobdir=base+'/full-reaudit-2-remaining';
const read=f=>JSON.parse(fs.readFileSync(f)),need=(ok,m)=>{if(!ok)throw Error(m);};
need(process.argv.length===2&&!fs.existsSync(jobdir),'Retained invocation exists; recover its actual handles');
const prior=read(base+'/full-reaudit-2/state.json');need(prior.phase==='terminal'&&!prior.resourceHold,'Prior invocation must finish safely');
try{process.kill(prior.pid,0);throw Error('Prior CLI is still present');}catch(e){if(e.code!=='ESRCH')throw e;}
need(execFileSync('git',['rev-parse','HEAD'],{cwd:runtime,encoding:'utf8'}).trim()===prior.revision,'Runtime revision changed');
const adoption=read(base+'/full-reaudit-2/finished-first-review.host-adoption.json');need(adoption.nativePartitionValidationPassed&&adoption.modelTurns===0,'Retained checksum recovery missing');
const before=read(directory+'/state.json');need(before.phase==='reaudit'&&before.round===2&&!before.circuitBreaker,'Preserve phase/round/circuit');
const packet=buildDateAuditPacket('jinshu','080',{extraction:read(directory+'/'+before.candidate)});need(packet.extractionHash===prior.candidateExtractionHash,'Current candidate changed');
const {jobs}=retainedDateReviewJobs(packet,structuredClone(before),{}),pending=[];
for(const job of jobs){const key='reaudit-2-'+job.id,file=directory+'/'+key+'.json';if(fs.existsSync(file))validateDateJobResult(read(file),job,packet);else{need(!before.jobs[key]?.runId,'Missing cached report has retained work; recover it before fresh dispatch');pending.push(key);}}
need(jobs.length===16&&pending.length===3,'Expected exactly three never-started retained ranges');
need(!inspectLocalDisk(root).errors.length,'Resource guard rejected continuation');
fs.mkdirSync(jobdir);const expected=new Set(pending),state={schemaVersion:1,kind:'bounded-retained-date-review-continuation',worker:prior.worker,phase:'starting',startedAt:new Date().toISOString(),revision:prior.revision,sourceHash:before.sourceHash,originalExtractionHash:before.extractionHash,candidateExtractionHash:packet.extractionHash,cachedReportsValidated:13,expectedJobs:pending,limits:prior.limits,drainPolicy:'One SIGINT once all three missing review ranges have captured runs, or resource/time hold. Drain active work; never force or send a second signal. No fresh repair turn.'};
const save=()=>fs.writeFileSync(jobdir+'/state.json',JSON.stringify(state,null,2)+'\n');
const sample=()=>{const guard=inspectLocalDisk(root);fs.appendFileSync(jobdir+'/resources.jsonl',JSON.stringify({at:new Date().toISOString(),guard})+'\n');return guard;};
need(!sample().errors.length,'Guard failed immediately before launch');
const log=fs.openSync(jobdir+'/host.log','wx',0o600);
const args=['--max-old-space-size=3072',runtime+'/scripts/run-people-date-workflow.mjs','--book','jinshu','--chapter','080','--worker',prior.worker,'--lane','cursor-sdk','--model','grok-4.6','--run','--concurrency','1','--job-concurrency','2','--limit','1','--max-units','40','--max-worker-kib','56','--max-rounds','3','--max-run-cost','3','--max-run-tokens','4000000','--run-timeout-minutes','20','--summary-out',jobdir+'/summary.json'];
const child=spawn(process.execPath,args,{cwd:runtime,env:{...process.env,PEOPLE_REPO_ROOT:root},stdio:['ignore',log,log]});fs.closeSync(log);state.pid=child.pid;state.phase='running';save();
let drained=false;const drain=reason=>{if(drained)return;need(child.kill('SIGINT'),'Owned CLI cannot be signaled; inspect actual state');drained=true;state.drainRequestedAt=new Date().toISOString();state.drainReason=reason;save();};
const capture=setInterval(()=>{try{const current=read(directory+'/state.json');need(current.sourceHash===before.sourceHash&&current.extractionHash===before.extractionHash,'Canonical generation changed');const rows=Object.entries(current.jobs).filter(([key,value])=>expected.has(key)&&value.runId).map(([key,value])=>({key,agentId:value.agentId,runId:value.runId,status:value.status}));state.runs=rows;save();if(rows.length===expected.size)drain('All three remaining review ranges captured; preserve independent results and stop before repair dispatch');}catch(e){state.observationError=e.message;save();drain('Observation failed; preserve work');}},1000);
const guardTimer=setInterval(()=>{try{if(sample().errors.length){state.resourceHold=true;save();drain('Resource guard rejected further dispatch');}}catch(e){state.resourceHold=true;state.measurementError=e.message;save();drain('Resource measurement failed');}},45000);
const duration=setTimeout(()=>drain('Bounded continuation coordinator deadline reached'),55*60000);
console.log(JSON.stringify({pid:child.pid,cachedReportsValidated:13,remainingReviewRanges:3,concurrency:2}));
try{state.result=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',(code,signal)=>resolve({code,signal}));});state.phase='terminal';state.finishedAt=new Date().toISOString();save();console.log(JSON.stringify({phase:state.phase,result:state.result,runs:state.runs?.length??0}));}
finally{clearInterval(capture);clearInterval(guardTimer);clearTimeout(duration);sample();}
