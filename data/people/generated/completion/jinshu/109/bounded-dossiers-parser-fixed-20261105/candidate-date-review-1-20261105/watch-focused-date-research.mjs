import fs from 'node:fs';
import path from 'node:path';
const configurationFile=process.argv[2];if(!configurationFile||!path.isAbsolute(configurationFile))throw Error('Explicit absolute focused-source configuration required');
const config=JSON.parse(fs.readFileSync(configurationFile));
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {acquireProcessRunLock} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/process-run-lock.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('.',import.meta.url).pathname,unlock=acquireProcessRunLock(root+'/data/people/generated/date-workflow-run.lock',{label:'Single focused109 source-review executor',failIfExists:true});
try{while(true){const m=JSON.parse(fs.readFileSync(dir+config.controllerFile));if(!['claimed','running','ready-next','all-reviewed'].includes(m.phase)){console.log(JSON.stringify({watchEnded:true,phase:m.phase}));break;}const guard=inspectLocalDisk(root);fs.appendFileSync(dir+config.controllerFile.replace(/\.json$/u,'-resources.jsonl'),JSON.stringify({at:new Date().toISOString(),guard})+'\n');if(guard.errors.length)console.error(JSON.stringify({resourceHold:guard.errors,preserveActualJob:true}));await new Promise(r=>setTimeout(r,45000));}}finally{unlock();}
