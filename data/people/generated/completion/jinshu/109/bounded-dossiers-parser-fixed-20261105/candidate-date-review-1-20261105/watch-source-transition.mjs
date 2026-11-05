import fs from 'node:fs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {acquireProcessRunLock} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/process-run-lock.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('.',import.meta.url).pathname;
const unlock=acquireProcessRunLock(root+'/data/people/generated/date-workflow-run.lock',{label:'Owned source transition and date repair controller',failIfExists:true});
try{
 while(true){
  const m=JSON.parse(fs.readFileSync(dir+'source-transition-controller.json'));
  if(!['claimed','running','review-returned','repair-ready','repair-running'].includes(m.phase)){console.log(JSON.stringify({watchEnded:true,phase:m.phase}));break;}
  const guard=inspectLocalDisk(root);fs.appendFileSync(dir+'source-transition-resources.jsonl',JSON.stringify({at:new Date().toISOString(),guard})+'\n');
  if(guard.errors.length)console.error(JSON.stringify({resourceHold:guard.errors,preserveActualJobs:true}));
  await new Promise(resolve=>setTimeout(resolve,45000));
 }
}finally{unlock();}
