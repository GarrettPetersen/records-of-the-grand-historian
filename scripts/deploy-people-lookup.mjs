#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash,randomBytes} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {parseArgs} from 'node:util';
import {loadDotenv} from './load-dotenv.mjs';
loadDotenv(process.cwd());
const {values}=parseArgs({options:{export:{type:'string'},apply:{type:'boolean'},deploy:{type:'boolean'}}});
if(!values.export)throw Error('--export DIRECTORY is required');
const dir=path.resolve(values.export),plan=JSON.parse(fs.readFileSync(path.join(dir,'export.json')));
const account=process.env.PRODUCTION_CLOUDFLARE_ACCOUNT_ID,token=process.env.PRODUCTION_CLOUDFLARE_API_TOKEN;
if(!account||!token)throw Error('Missing Cloudflare account credential');
const bucket='24histories-people-lookup',script='24histories-people-lookup';
let lastGuard=0;
function guard(){
 if(Date.now()-lastGuard<60000)return;
 const check=spawnSync(process.execPath,['scripts/check-local-disk.mjs'],{encoding:'utf8'});
 if(check.status!==0)throw Error(`Resource preflight failed: ${check.stdout} ${check.stderr}`);
 lastGuard=Date.now();
}
const base=`https://api.cloudflare.com/client/v4/accounts/${account}`;
async function api(suffix,{method='GET',body,raw=false}={}){
 const r=await fetch(base+'/'+suffix,{method,headers:{Authorization:`Bearer ${token}`,...(!raw&&body?{'Content-Type':'application/json'}:{})},body:raw?body:body?JSON.stringify(body):undefined});
 const text=await r.text();let j;try{j=JSON.parse(text);}catch{j=null;}
 if(!r.ok||j?.success===false)throw Error(`Cloudflare ${method} ${suffix.split('/').slice(0,3).join('/')} failed (${r.status}): ${j?.errors?.map(e=>e.message).join('; ')??'non-JSON error'}`);
 return j?.result??j;
}
if(!values.apply){console.log(JSON.stringify({action:values.deploy?'deploy':'upload',bucket,prefix:plan.prefix,dossiers:plan.manifest.dossierCount,parts:plan.parts.length,readOnlyPreview:true}));process.exit(0);}
if(values.deploy){
 guard();
 const completed=JSON.parse(fs.readFileSync(path.join(dir,'upload-complete.json'),'utf8'));
 if(completed.prefix!==plan.prefix)throw Error('Upload completion belongs to another generation');
 const remote=await api(`r2/buckets/${bucket}/objects/${encodeURIComponent(plan.prefix+'/manifest.json')}`);
 if(remote?.generation!==plan.manifest.generation)throw Error('Remote generation is not complete');
 const privateDir=path.join(os.homedir(),'.local','share','24histories-people-lookup');fs.mkdirSync(privateDir,{recursive:true,mode:0o700});
 const secretPath=path.join(privateDir,'client-token');
 if(!fs.existsSync(secretPath))fs.writeFileSync(secretPath,randomBytes(32).toString('hex'),{flag:'wx',mode:0o600});
 const secret=fs.readFileSync(secretPath,'utf8').trim();if(!/^[a-f0-9]{64}$/.test(secret))throw Error('Invalid private API credential');
 const config=path.join(process.cwd(),'services','people-lookup','wrangler.toml');
 const child=spawnSync('wrangler',['deploy','--config',config,'--var',`REGISTRY_PREFIX:${plan.prefix}`],{
   env:{...process.env,CLOUDFLARE_ACCOUNT_ID:account,CLOUDFLARE_API_TOKEN:token},encoding:'utf8',maxBuffer:1024*1024});
 if(child.status!==0)throw Error(`Worker deployment failed: ${child.stderr.slice(-1500)}`);
 // Only a SHA-256 verifier is stored in the Worker. The actual token stays private.
 await api(`workers/scripts/${script}/secrets`,{method:'PUT',body:{name:'PEOPLE_API_TOKEN_SHA256',type:'secret_text',text:createHash('sha256').update(secret).digest('hex')}});
 console.log(JSON.stringify({deployed:true,script,prefix:plan.prefix,clientTokenFile:secretPath,wrangler:child.stdout.slice(-1800)}));
 process.exit(0);
}
const list=await api('r2/buckets');
if(!list.buckets.some(b=>b.name===bucket))await api('r2/buckets',{method:'POST',body:{name:bucket}});
const receipt=path.join(dir,'uploaded.jsonl');
const uploaded=new Map(fs.existsSync(receipt)?fs.readFileSync(receipt,'utf8').trim().split('\n').filter(Boolean).map(l=>{const r=JSON.parse(l);return[r.key,r];}):[]);
async function put(key,bytes){
 guard();
 const digest=createHash('sha256').update(bytes).digest('hex');
 if(uploaded.get(key)?.sha256===digest)return;
 await api(`r2/buckets/${bucket}/objects/${encodeURIComponent(plan.prefix+'/'+key)}`,{method:'PUT',body:bytes,raw:true});
 fs.appendFileSync(receipt,JSON.stringify({key,sha256:digest,bytes:bytes.length})+'\n',{mode:0o600});
 uploaded.set(key,{sha256:digest});
}
// Single bounded data buffer; no copied corpus, source files or per-chapter worktree.
const source=path.join(plan.registry,plan.manifest.sourceStore.headers.file),fd=fs.openSync(source,'r'),chunkSize=32*1024*1024;
const sourceHash=createHash('sha256');
if(fs.fstatSync(fd).size!==plan.manifest.sourceStore.headers.bytes)throw Error('Native source size changed');
try{for(let offset=0,part=0;offset<plan.manifest.sourceStore.headers.bytes;offset+=chunkSize,part++){
 const n=Math.min(chunkSize,plan.manifest.sourceStore.headers.bytes-offset),buffer=Buffer.alloc(n);
 if(fs.readSync(fd,buffer,0,n,offset)!==n)throw Error('Incomplete native source range');
 sourceHash.update(buffer);
 await put(`data/${String(part).padStart(4,'0')}.bin`,buffer);console.log(JSON.stringify({dataPart:part,uploaded:uploaded.size}));
}}finally{fs.closeSync(fd);}
if(sourceHash.digest('hex')!==plan.manifest.sourceStore.headers.sha256)throw Error('Native source changed after preparation');
for(let i=0;i<plan.parts.length;i+=4){
 await Promise.all(plan.parts.slice(i,i+4).map(async part=>{
 const bytes=fs.readFileSync(path.join(dir,part.key));
 if(bytes.length!==part.bytes||createHash('sha256').update(bytes).digest('hex')!==part.sha256)throw Error('Export shard changed after preparation');
 await put(part.key,bytes);
 }));
 if(i%250===0)console.log(JSON.stringify({indexParts:i+1,total:plan.parts.length}));
}
// Publish the generation manifest last. Earlier failures leave a resumable incomplete upload.
await put('manifest.json',fs.readFileSync(path.join(dir,'manifest.json')));
fs.writeFileSync(path.join(dir,'upload-complete.json'),JSON.stringify({prefix:plan.prefix,objects:uploaded.size,completedAt:new Date().toISOString()})+'\n',{mode:0o600});
console.log(JSON.stringify({uploaded:true,bucket,prefix:plan.prefix,objects:uploaded.size}));
