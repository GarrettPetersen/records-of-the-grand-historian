import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const ROOT='/Users/garrettpetersen/records-of-the-grand-historian',JOB=path.dirname(fileURLToPath(import.meta.url)),REF='966eecf6d00d0f14c72b46d94aff65f2790810e7',CANDIDATE=JOB+'/candidate/';
const files=new Set(execFileSync('git',['ls-tree','-r','--name-only',REF],{cwd:ROOT,encoding:'utf8',maxBuffer:64*1024*1024}).split('\n'));
export async function resolve(specifier,context,nextResolve){
 let url;
 if(specifier.startsWith('file:'))url=new URL(specifier);else if(specifier.startsWith('.')||specifier.startsWith('/'))url=new URL(specifier,context.parentURL??pathToFileURL(ROOT+'/'));
 if(url?.protocol==='file:'){
  let file=fileURLToPath(url);if(file.startsWith(CANDIDATE))file=ROOT+'/'+file.slice(CANDIDATE.length);
  if(file.startsWith(ROOT+'/scripts/')){
   const rel=file.slice(ROOT.length+1);
   if(files.has(rel)||fs.existsSync(CANDIDATE+rel))return {url:pathToFileURL(file).href,shortCircuit:true};
  }
 }
 return nextResolve(specifier,context);
}
export async function load(url,context,nextLoad){
 if(url.startsWith('file:')){
  const file=fileURLToPath(url);
  if(file.startsWith(ROOT+'/scripts/')&&/\.(mjs|js|json)$/u.test(file)){
   const rel=file.slice(ROOT.length+1),proposed=CANDIDATE+rel;
   const source=fs.existsSync(proposed)?fs.readFileSync(proposed):execFileSync('git',['show',REF+':'+rel],{cwd:ROOT,maxBuffer:16*1024*1024});
   return {format:file.endsWith('.json')?'json':'module',source:source.toString(),shortCircuit:true};
  }
 }
 return nextLoad(url,context);
}
