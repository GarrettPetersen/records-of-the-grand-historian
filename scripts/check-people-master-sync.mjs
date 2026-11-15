#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

// Read-only: fetching, reconciliation and approval belong to the host.
export function checkPeopleMasterSync(root=process.cwd()) {
 const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024});
 const remote=git('ls-remote','--exit-code','origin','refs/heads/master').trim().split(/\s+/)[0];
 if(!/^[a-f0-9]{40}$/.test(remote))throw Error('Cannot establish the live master commit');
 const head=git('rev-parse','HEAD').trim(),tracking=git('rev-parse','origin/master').trim(),errors=[];
 if(tracking!==remote)errors.push('origin/master is stale: host must fetch origin master and reconcile');
 if(spawnSync('git',['merge-base','--is-ancestor',remote,head],{cwd:root}).status!==0)errors.push('HEAD does not contain live master: preserve work and reconcile before new dispatch/publication');
 if(errors.length)return{ok:false,head,master:remote,errors};
 const receiptFile=path.join(root,'data/people/generated/master-sync-receipt.json');
 const receipt=fs.existsSync(receiptFile)?JSON.parse(fs.readFileSync(receiptFile,'utf8')):null;
 const exceptions=new Map();
 if(receipt){
  if(receipt.masterCommit!==remote)errors.push('Local input exceptions belong to an older master; reconcile them at an idle boundary');
  for(const e of receipt.exceptions??[]){
   if(typeof e.path!=='string'||path.isAbsolute(e.path)||e.path.split('/').some(p=>!p||p==='..')||!e.reason||!e.owner||exceptions.has(e.path))throw Error('Invalid explicit local-input exception');
   const f=path.join(root,e.path);
   const actual=fs.existsSync(f)?'sha256:'+createHash('sha256').update(fs.readFileSync(f)).digest('hex'):null;
   if(actual!==e.sha256)errors.push('Pinned local input changed: '+e.path);
   exceptions.set(e.path,e);
  }
 }
 const index=new Set(git('ls-files','-z').split('\0').filter(Boolean));
 const files=git('ls-tree','-r','--name-only','-z',remote,'--','AGENTS.md','package.json','scripts','functions','data').split('\0').filter(Boolean);
 const missing=files.filter(f=>!exceptions.has(f)&&(!index.has(f)||!fs.existsSync(path.join(root,f))));
 if(missing.length)errors.push(`${missing.length} released production files missing from checkout/index: ${missing.slice(0,8).join(', ')}`);
 return{ok:!errors.length,head,master:remote,releasedFilesChecked:files.length,localInputExceptions:exceptions.size,errors};
}
export function assertPeopleMasterSync(root=process.cwd()) {
 const report=checkPeopleMasterSync(root);
 if(!report.ok)throw Error('Master synchronization required: '+report.errors.join('; '));
 return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const r=checkPeopleMasterSync();console.log(JSON.stringify(r,null,2));if(!r.ok)process.exitCode=1;}
 catch(e){console.error('Master-sync preflight failed: '+e.message);process.exitCode=1;}
}
