import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const runtime='file:///Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/',primary='file:///Users/garrettpetersen/records-of-the-grand-historian/',verified=new Set();
export function resolve(specifier,context,next){
 if(!specifier.startsWith('.'))return next(specifier,context);
 const parent=context.parentURL?.startsWith(primary+'public/')?context.parentURL.replace(primary,runtime):context.parentURL;
 const absolute=new URL(specifier,parent).href;
 if(absolute.startsWith(runtime+'public/')){
  const relative=decodeURIComponent(absolute.slice(runtime.length)),actual=new URL(relative,primary);
  if(!verified.has(relative)){const expected=execFileSync('git',['-C','/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime','show','a366058eaf47f2bb88684a9d8acf6432f489fd1a:'+relative],{maxBuffer:1024*1024});if(!fs.readFileSync(actual).equals(expected))throw Error('Primary static test dependency differs: '+relative);verified.add(relative);}
  return next(actual.href,context);
 }
 return next(absolute,context);
}
