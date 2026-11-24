import fs from 'node:fs';
import path from 'node:path';
const need=(ok,message)=>{if(!ok)throw Error('Remote admission: '+message);};
const chapterId=/^[a-z0-9_-]+-\d{3}-[a-f0-9]{12}$/;
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));

export function chapterRoleAgentId(job,role){
 need(role==='owner'||role==='reviewer','Unknown chapter role');
 return job[role==='reviewer'?'reviewAgentId':'ownerAgentId'];
}

export function remoteAdmissionLimit(policy,value){
 const p=policy.completionThroughput;
 need(p&&Number.isSafeInteger(p.targetPublishedChaptersPerDay)&&p.targetPublishedChaptersPerDay>0&&
  Number.isSafeInteger(p.initialRemoteAssignments)&&p.initialRemoteAssignments>0&&
  Number.isSafeInteger(p.maxRemoteAssignments)&&p.maxRemoteAssignments>=p.initialRemoteAssignments,'Explicit valid completion throughput policy required');
 const limit=value===undefined?p.initialRemoteAssignments:Number(value);
 need(Number.isSafeInteger(limit)&&limit>0&&limit<=p.maxRemoteAssignments,'Explicit concurrency exceeds policy or is not a positive integer');
 return limit;
}

// Inventory jobs across the shared host, not only this campaign's selected scope.
// Artifact-only directories are not jobs. Never read scoped credentials.
export function remoteAdmissionInventory(directory){
 const jobs=[],runs=new Map(),uncertain=new Set();
 const addRun=(agentId,runId)=>{need(typeof agentId==='string'&&agentId.startsWith('bc-')&&typeof runId==='string'&&runId.startsWith('run-'),'Malformed Cursor assignment');runs.set(runId,{agentId,runId});};
 for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
  if(!entry.isDirectory()||entry.isSymbolicLink())continue;
  const dir=path.join(directory,entry.name),jobFile=path.join(dir,'job.json');
  if(chapterId.test(entry.name)&&fs.existsSync(jobFile)){
   const job=read(jobFile);need(job.id===entry.name,'Chapter job scope does not match directory');jobs.push(job);
   for(const role of ['owner','reviewer']){
    const actor=chapterRoleAgentId(job,role),run=job[role+'RunId'],dispatch=job.dispatch?.[role];
    if(actor?.startsWith('bc-')&&run)addRun(actor,run);
    const activeGrokPhase=role==='owner'?['prepared','working'].includes(job.status):job.status==='reviewing';
    if(dispatch?.state==='dispatching'||dispatch?.state==='sent'&&(dispatch.lane==='cursor-sdk'&&!run||dispatch.lane==='grokbot'&&activeGrokPhase))
     uncertain.add(actor?.startsWith('bc-')?'cursor:'+actor:actor?.startsWith('grokbot:')?'grok:'+actor.slice(8):'uncertain:'+job.id+':'+role);
   }
  }
  const reviewFile=path.join(dir,'review-state.json');
  if(fs.existsSync(reviewFile)){
   const state=read(reviewFile);
   if(state.agentId?.startsWith('bc-')&&state.runId)addRun(state.agentId,state.runId);
   else if(['dispatching','sending'].includes(state.phase))uncertain.add('uncertain:code:'+entry.name);
  }
 }
 return{jobs,runs:[...runs.values()],uncertain:[...uncertain]};
}

export async function measureRemoteAdmission(inventory,liveGrok,getRun){
 need(liveGrok instanceof Set&&typeof getRun==='function','Measured live Grok state and Cursor status reader required');
 const occupied=new Set([...inventory.uncertain,...[...liveGrok].map(id=>'grok:'+id)]),cursorRuns=new Map();
 // Keep status reads bounded by the caller and sequential to avoid a host burst.
 for(const item of inventory.runs){
  const run=await getRun(item);need(run&&['running','finished','error','cancelled','canceled'].includes(run.status),'Unknown Cursor run status; stop admission');
  cursorRuns.set(item.runId,run);if(run.status==='running')occupied.add('cursor:'+item.agentId);
 }
 return{activeCount:occupied.size,cursorRuns,occupied:[...occupied]};
}

export function remoteContinuationSlot(admission,actor,maxActive){
 need(typeof actor==='string'&&(actor.startsWith('bc-')||actor.startsWith('grokbot:')),'Retained actual actor required');
 const key=actor.startsWith('bc-')?'cursor:'+actor:'grok:'+actor.slice(8),reserved=admission.occupied.includes(key);
 return{reserved,admitted:admission.activeCount<maxActive||reserved&&admission.activeCount===maxActive};
}
