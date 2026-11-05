import fs from 'node:fs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian';
const dir=new URL('.',import.meta.url).pathname;
const stateFile=process.argv[2]??'review-state.json';
if(!['review-state.json','focused-name-repair-review-state.json','repeated-jiiye-repair-state.json'].includes(stateFile))throw Error('Unknown review state');
while(true){
 const state=JSON.parse(fs.readFileSync(dir+stateFile));
 const active=stateFile==='review-state.json'?state.parts.filter(p=>p.phase==='running'):(state.phase==='running'?[{index:'focused-repair',agentId:state.agentId}]:[]);
 if(stateFile!=='review-state.json'&&!active.length){console.log(JSON.stringify({watchEnded:true,reason:'repair-not-running'}));break;}
 const guard=inspectLocalDisk(root);
 fs.appendFileSync(dir+'resources.jsonl',JSON.stringify({at:new Date().toISOString(),active:active.map(p=>({index:p.index,agentId:p.agentId})),guard})+'\n');
 if(guard.errors.length){console.error(JSON.stringify({resourceHold:guard.errors,preserveActualHandles:true}));process.exitCode=1;break;}
 if(Date.now()>=Date.parse(state.deadlineAt)){console.log(JSON.stringify({watchEnded:true,reason:'dispatch-deadline',preserveActualHandles:true}));break;}
 await new Promise(resolve=>setTimeout(resolve,45000));
}
