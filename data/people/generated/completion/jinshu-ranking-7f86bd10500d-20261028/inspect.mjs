import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';import{Agent}from'@cursor/sdk';
const JOB=path.dirname(fileURLToPath(import.meta.url)),root='/Users/garrettpetersen/records-of-the-grand-historian';let apiKey=process.env.CURSOR_API_KEY;
if(!apiKey){const m=fs.readFileSync(root+'/.env','utf8').match(/^(?:export\s+)?CURSOR_API_KEY\s*=\s*(.+)\s*$/m);if(!m)throw Error('Cursor credential unavailable');apiKey=m[1].trim();if((apiKey[0]==='"'&&apiKey.at(-1)==='"')||(apiKey[0]==="'"&&apiKey.at(-1)==="'"))apiKey=apiKey.slice(1,-1);}
try {
const state=JSON.parse(fs.readFileSync(JOB+'/state.json','utf8'));const runs=await Agent.listRuns((process.argv[2]??state.agentId),{runtime:'cloud',apiKey,limit:20});const rows=runs.items.map(r=>({id:r.id,status:r.status,error:r.error?{code:r.error.code,message:r.error.message}:null}));fs.writeFileSync(JOB+'/read-only-run-status.json',JSON.stringify({at:new Date().toISOString(),agentId:process.argv[2]??state.agentId,runs:rows},null,2)+'\n');console.log(JSON.stringify({agentId:process.argv[2]??state.agentId,runs:rows}));

}catch(e){console.log(JSON.stringify({errorType:e.name,code:e.code??null,status:e.status??null,message:String(e.message).replaceAll(apiKey,'[redacted]').slice(0,600)}));process.exitCode=1;}
