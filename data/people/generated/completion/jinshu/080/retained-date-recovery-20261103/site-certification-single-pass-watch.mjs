import fs from 'node:fs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
const dir=new URL('.',import.meta.url).pathname;
while(true){
 const state=JSON.parse(fs.readFileSync(dir+'site-certification-single-pass-review-state.json'));
 if(state.phase!=='running'){console.log(JSON.stringify({watchEnded:true,phase:state.phase}));break;}
 const guard=inspectLocalDisk('/Users/garrettpetersen/records-of-the-grand-historian');
 fs.appendFileSync(dir+'site-certification-single-pass-resources.jsonl',JSON.stringify({at:new Date().toISOString(),agentId:state.agentId,guard})+'\n');
 if(guard.errors.length){console.error(JSON.stringify({resourceHold:guard.errors,preserveActualHandle:true}));process.exitCode=1;break;}
 if(Date.now()>=Date.parse(state.deadlineAt)){console.log(JSON.stringify({watchEnded:true,deadlineReached:true,preserveActualHandle:true}));break;}
 await new Promise(resolve=>setTimeout(resolve,45000));
}
