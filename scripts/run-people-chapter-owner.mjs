#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {randomBytes} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {parseArgs} from 'node:util';
import {Agent} from '@cursor/sdk';
import {loadDotenv} from './load-dotenv.mjs';
import {REPO_ROOT,writeJsonAtomic} from './lib/people-content.mjs';
import {readRemotePeopleWorkLedger,mutateRemotePeopleWorkLedger,dateExecutorIsBusy} from './lib/people-work-queue.mjs';
import {prepareChapterOwner,ownerDirectory,digest,pinChapterNativeRuntime} from './lib/people-chapter-owner.mjs';
import {readRosterWorkers,dispatchPrompt,probe,liveRunningAgentIds} from './grokbot-headless-dispatch.mjs';

loadDotenv(REPO_ROOT);
const {values:o}=parseArgs({options:{prepare:{type:'boolean'},start:{type:'boolean'},status:{type:'boolean'},review:{type:'boolean'},run:{type:'boolean'},continue:{type:'boolean'},feedback:{type:'string'},book:{type:'string'},chapter:{type:'string'},lane:{type:'string'},worker:{type:'string'},job:{type:'string'},model:{type:'string'},extra:{type:'string',multiple:true},'native-root':{type:'string'}}});
const modes=['prepare','start','status','review'].filter(k=>o[k]);if(modes.length!==1)throw Error('Choose --prepare, --start, --review or --status');
const guard=()=>{const r=spawnSync(process.execPath,['scripts/check-local-disk.mjs'],{cwd:REPO_ROOT,encoding:'utf8',env:{...process.env,PEOPLE_REPO_ROOT:REPO_ROOT}});if(r.status!==0)throw Error('Resource guard failed: '+r.stdout+r.stderr);};
if(o.prepare){
 guard();const ledger=readRemotePeopleWorkLedger();
 if(!o['native-root'])throw Error('--native-root must pin the existing current production runtime');
 const job=prepareChapterOwner(REPO_ROOT,{book:o.book,chapter:o.chapter,lane:o.lane,worker:o.worker,ledger,extra:o.extra??[]});
 pinChapterNativeRuntime(REPO_ROOT,job,o['native-root']);
 const pinCode=`import {inspectCombinedBefore} from './scripts/lib/people-combined-curation.mjs';console.log(JSON.stringify(inspectCombinedBefore({root:process.env.PEOPLE_CHAPTER_HOST_ROOT,book:process.env.PEOPLE_CHAPTER_BOOK,chapter:process.env.PEOPLE_CHAPTER_NUMBER})));`;
 const pinned=spawnSync(process.execPath,['--input-type=module','-'],{cwd:job.nativeRoot,input:pinCode,encoding:'utf8',env:{...process.env,PEOPLE_REPO_ROOT:job.nativeRoot,PEOPLE_CHAPTER_HOST_ROOT:REPO_ROOT,PEOPLE_CHAPTER_BOOK:job.book,PEOPLE_CHAPTER_NUMBER:job.chapter}});
 if(pinned.status!==0)throw Error('Cannot capture original native before pins: '+pinned.stderr);job.beforeNative=JSON.parse(pinned.stdout);
 writeJsonAtomic(path.join(ownerDirectory(REPO_ROOT,job.id),'job.json'),job);
 const key=job.book+'/'+job.chapter;
 mutateRemotePeopleWorkLedger(current=>{
  current.chapterOwners??={};
  if(current.chapterOwners[key]&&current.chapterOwners[key].status!=='published')throw Error('Another chapter owner claimed this scope');
  if(dateExecutorIsBusy(current.dateAudits?.[key]))throw Error('A date executor became active');
  if(digest(JSON.stringify(current.dateAudits?.[key]??null))!==digest(JSON.stringify(job.priorDateClaim)))throw Error('Existing date ownership changed during preparation');
  const prior=current.claims[key];if(prior&& !['ready','submitted','completed'].includes(prior.status))throw Error('Existing extraction work must drain before chapter-owner migration');
  current.chapterOwners[key]={jobId:job.id,worker:job.worker,lane:job.lane,status:'active',updatedAt:new Date().toISOString()};
 },{message:'Reserve end-to-end chapter owner '+key+' while preserving prior claims'});
 console.log(JSON.stringify({job:job.id,chapter:key,lane:job.lane,artifacts:job.artifacts.length,totalEvidenceBytes:job.artifacts.reduce((a,b)=>a+b.bytes,0),sharedCheckout:true}));
}else{
 if(!o.job)throw Error('--job ID is required');
 const dir=ownerDirectory(REPO_ROOT,o.job),file=path.join(dir,'job.json'),job=JSON.parse(fs.readFileSync(file));
 if(o.status){console.log(JSON.stringify({id:job.id,status:job.status,lane:job.lane,ownerAgentId:job.ownerAgentId,ownerRunId:job.ownerRunId,reviewAgentId:job.reviewAgentId,revision:job.revision,covered:job.coveredUnits.length,total:job.unitIds.length,findings:job.findings,dispatch:job.dispatch},null,2));process.exit(0);}
 guard();if(!o.run)throw Error('--run is required to start/continue inference');
 if(job.status==='held'||job.circuitBreaker)throw Error('Chapter is held; diagnose and independently review a new approach before resuming');
 const role=o.review?'reviewer':'owner',lane=o.lane??job.lane,agentKey=role==='owner'?'ownerAgentId':'reviewAgentId';
 if(job.dispatch?.[role]?.lane&&job.dispatch[role].lane!==lane)throw Error('Retained role must resume in its original lane; no implicit provider switch');
 if(role==='reviewer'&&job.status!=='ready-for-review'&&!(o.continue&&job.status==='reviewing'))throw Error('Owner must finish a validated candidate first');
 if(role==='reviewer'&&job.ownerAgentId?.startsWith('bc-')&&job.ownerRunId){
  const ownerRun=await Agent.getRun(job.ownerRunId,{runtime:'cloud',agentId:job.ownerAgentId,apiKey:process.env.CURSOR_API_KEY});
  if(ownerRun.status==='running')throw Error('Owner inference must drain before independent review');
 }
 if(role==='reviewer'&&job.ownerAgentId?.startsWith('grokbot:')&&(await liveRunningAgentIds('http://127.0.0.1:9229')).has(job.ownerAgentId.slice(8)))throw Error('Owner inference must drain before independent review');
 if(role==='reviewer'&&job.status==='ready-for-review'){
  const prepared=spawnSync(process.execPath,['scripts/prepare-people-chapter-review.mjs','--job',job.id],{cwd:REPO_ROOT,encoding:'utf8',env:{...process.env,PEOPLE_REPO_ROOT:job.nativeRoot}});
  if(prepared.status!==0)throw Error('Independent packet preparation failed: '+prepared.stderr);
  Object.assign(job,JSON.parse(fs.readFileSync(file)));
  job.reviewFindingStart=job.findings.length;
 }
 if(job.dispatch?.[role]?.state==='dispatching')throw Error('Prior dispatch is uncertain: inspect before another send');
 if(job.dispatch?.[role]?.state==='sent'&&!o.continue)throw Error('Assignment already sent: observe the retained agent; do not duplicate');
 if(o.continue&&!o.feedback)throw Error('A continuation requires compact concrete --feedback FILE');
 const token=fs.readFileSync(path.join(dir,role+'-token'),'utf8'),url=`https://grokbot-mcp.24histories.com/chapter-mcp/${job.id}/${role}`;
 const health=await fetch('https://grokbot-mcp.24histories.com/health',{signal:AbortSignal.timeout(10000)});if(!health.ok)throw Error('Chapter MCP bridge is unavailable');
 const intro=`You are the ${role} for ${job.book}/${job.chapter}. Own this chapter end to end using chapter_* and people_* tools. Begin with chapter_manifest, then locate and read the latest RESUME/HANDOFF/work order and returned partial reviews. All partially completed work is indexed, not automatically approved. Reuse valid work, diagnose exact remaining defects, preserve known kinship records and primary-source research. Read all source units and both English fields, reusing pinned complete coverage where valid. Submit individual exact-before draft patches, complete source-based repairs, coverage and concrete findings through tools. Run chapter_validate and repair real errors in this same conversation. Do not ask for routine confirmation. Do not clone, create a worktree, copy repo/data/public/dependencies, build, change Git or publish canonical files. Host checkout is shared at ${REPO_ROOT}; remote workers use only isolated people-jobs/${job.id} artifacts. Do not invent labels/dates/people, mark your own repairs approved, or clear circuit breakers. Call chapter_finish only when your work is ready for the next native gate. If a shared applier/code defect is the remaining blocker, record its exact reproducer and smallest needed shared fix. The host owns production code changes and publication. ${role==='owner'?'Prepare one coherent source/extraction/editorial/date/identity candidate; the host supplies an independent final reviewer.':'You must be independent of every author. Return native identity/date/editorial reports and input seals for the exact frozen candidate; no vague approval or fabricated provenance.'}`;
 const roleGuidance=role==='reviewer'?'\nRead the reviewPacketArtifacts listed by chapter_manifest first: native date packet and exact hashes/counts. Use the native-* production contract artifacts. Retain all old editorial history and approve new editorial entries only after independent source review. For concrete corrections call chapter_finding with disposition:"repair-required"; for genuinely unresolved evidence use "research-hold". Return all findings in one batch before chapter_finish.': '';
 const prompt=o.continue?'Continue this same sealed chapter and existing draft; do not re-onboard or repeat unchanged work. Host feedback:\n'+fs.readFileSync(o.feedback,'utf8'):intro+roleGuidance;
 if(prompt.length>16000)throw Error('Prompt/feedback must be compact');
 job.dispatch??={};
 if(lane==='cursor-sdk'){
  if(o.continue){const previous=await Agent.getRun(job[role+'RunId'],{runtime:'cloud',agentId:job[agentKey],apiKey:process.env.CURSOR_API_KEY});if(previous.status==='running')throw Error('Retained agent is still running');}
  if(!o.model)throw Error('--model must select an available capable reasoning model');
  const connection={type:'http',url,headers:{Authorization:'Bearer '+token}};
  const agent=job[agentKey]?await Agent.resume(job[agentKey],{apiKey:process.env.CURSOR_API_KEY}):await Agent.create({apiKey:process.env.CURSOR_API_KEY,name:`Chapter ${role} ${job.book}/${job.chapter}`,model:{id:o.model,params:[{id:'effort',value:'high'},{id:'fast',value:'false'}]},cloud:{repos:[],autoCreatePR:false,metadata:{purpose:'people-chapter-'+role,book:job.book,chapter:job.chapter,job:job.id}},mcpServers:[{chapter:connection}]});
  if(role==='reviewer'&&agent.agentId===job.ownerAgentId)throw Error('Reviewer is the owner');
  job[agentKey]=agent.agentId;if(role==='owner')job.authors=[...new Set([...job.authors,agent.agentId])];else job.status='reviewing';
  job.dispatch[role]={state:'dispatching',at:new Date().toISOString(),lane};writeJsonAtomic(file,job);
  const run=await agent.send(prompt,{mcpServers:{chapter:connection}});
  // Tool activity can update the journal while send awaits: merge only dispatch fields.
  const latest=JSON.parse(fs.readFileSync(file));latest[role+'RunId']=run.id;latest.dispatch[role]={state:'sent',at:new Date().toISOString(),lane,runId:run.id};writeJsonAtomic(file,latest);agent.close();
  console.log(JSON.stringify({job:job.id,role,lane,agentId:agent.agentId,runId:run.id}));
 }else if(lane==='grokbot'){
  const worker=o.worker??job.worker,rows=readRosterWorkers(),selected=rows.find(r=>r.worker===worker);
  if(!selected||selected.isRunning)throw Error('GrokBot worker missing or busy');
  if(job[agentKey]&&job[agentKey]!=='grokbot:'+selected.id)throw Error('Resume the same durable GrokBot conversation; do not replace retained context');
  if(role==='reviewer'&&((job.originalAuthorWorkerIds??[]).includes(worker)||job.authors.some(author=>[worker,selected.id,'grokbot:'+selected.id].includes(author))))throw Error('This GrokBot worker authored prior chapter work');
  if((await liveRunningAgentIds('http://127.0.0.1:9229')).has(selected.id))throw Error('Live GrokBot worker is still running');
  await probe('http://127.0.0.1:9229');
  if(role==='reviewer'&&'grokbot:'+selected.id===job.ownerAgentId)throw Error('Reviewer must use a separate GrokBot conversation');
  const key=randomBytes(32).toString('hex');if(!o.continue)writeJsonAtomic(path.join(dir,role+'-bootstrap.json'),{key,expiresAt:new Date(Date.now()+3600000).toISOString()});
  job[agentKey]='grokbot:'+selected.id;if(role==='owner')job.authors=[...new Set([...job.authors,job[agentKey]])];else job.status='reviewing';
  job.dispatch[role]={state:'dispatching',at:new Date().toISOString(),lane,worker};writeJsonAtomic(file,job);
  const workdir='people-jobs/'+job.id+'-'+role;
  const bootstrap=`First provision the scoped chapter client in your existing remote computer terminal. Run this Node script (do not echo credentials):\nnode --input-type=module <<'CHAPTER_BOOTSTRAP'\nimport fs from 'node:fs';\nfs.mkdirSync(${JSON.stringify(workdir)},{recursive:true,mode:0o700});\nconst r=await fetch(${JSON.stringify('https://grokbot-mcp.24histories.com/chapter-bootstrap/'+job.id+'/'+role)},{method:'POST',headers:{'x-bootstrap-key':${JSON.stringify(key)}},redirect:'error'});if(!r.ok)throw Error('Chapter bootstrap HTTP '+r.status);fs.writeFileSync(${JSON.stringify(workdir+'/config.json')},await r.text(),{mode:0o600});\nconst c=await fetch('https://grokbot-mcp.24histories.com/chapter-client.mjs');if(!c.ok)throw Error('Client download failed');fs.writeFileSync(${JSON.stringify(workdir+'/client.mjs')},await c.text(),{mode:0o600});\nCHAPTER_BOOTSTRAP\nThen use your terminal tool to invoke individual tools:\nnode ${workdir}/client.mjs ${workdir}/config.json chapter_manifest\nFor arguments, write a small JSON file in ${workdir} and pass its path as the third argument; names are chapter_read, chapter_patch, chapter_repair, chapter_coverage, chapter_finding, chapter_validate, chapter_finish, people_search and people_dossier. All calls use your scoped credential file; never print it.\n`;
  await dispatchPrompt('http://127.0.0.1:9229',selected,(o.continue?'Use the existing scoped chapter client and configuration; do not redeem a new bootstrap.\n':bootstrap+'\n')+prompt);
  const latest=JSON.parse(fs.readFileSync(file));latest.dispatch[role]={state:'sent',at:new Date().toISOString(),lane,worker};writeJsonAtomic(file,latest);
  console.log(JSON.stringify({job:job.id,role,lane,worker,agentId:job[agentKey]}));
 }else throw Error('Unsupported lane');
}
