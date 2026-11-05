import fs from 'node:fs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {acquireProcessRunLock} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/process-run-lock.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('.',import.meta.url).pathname;
const unlock=acquireProcessRunLock(root+'/data/people/generated/date-workflow-run.lock',{label:'Single corrected-source date attachment controller',failIfExists:true});
try{
 let deadlineReported=false;
 while(true){
  const state=JSON.parse(fs.readFileSync(dir+'controller.json'));
  if(!['reviewing','capturing'].includes(state.phase)){console.log(JSON.stringify({controllerWatchEnded:true,phase:state.phase}));break;}
  const guard=inspectLocalDisk(root);
  fs.appendFileSync(dir+'resources.jsonl',JSON.stringify({at:new Date().toISOString(),guard})+'\n');
  if(guard.errors.length)console.error(JSON.stringify({resourceHold:guard.errors,preserveActualHandles:true}));
  if(Date.now()>=Date.parse(state.deadlineAt)&&!deadlineReported){console.log(JSON.stringify({dispatchDeadlineReached:true,preserveRunningWorkers:true}));deadlineReported=true;}
  await new Promise(resolve=>setTimeout(resolve,45000));
 }
}finally{unlock();}
