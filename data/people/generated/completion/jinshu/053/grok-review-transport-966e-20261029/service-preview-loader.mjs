import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
const SERVICE='/Users/garrettpetersen/.local/share/24histories-grokbot-mcp/repo',ROOT='/Users/garrettpetersen/records-of-the-grand-historian',J=path.dirname(fileURLToPath(import.meta.url)),REF='966eecf6d00d0f14c72b46d94aff65f2790810e7';
export async function resolve(specifier,context,next){
 if(specifier.startsWith('.')||specifier.startsWith('/')||specifier.startsWith('file:')){
  const url=new URL(specifier,context.parentURL??pathToFileURL(SERVICE+'/'));
  if(url.protocol==='file:'){
   const f=fileURLToPath(url);
   if(f.startsWith(SERVICE+'/scripts/')&&fs.existsSync(J+'/candidate/'+f.slice(SERVICE.length+1)))return {url:url.href,shortCircuit:true};
  }
 }
 return next(specifier,context);
}
export async function load(url,context,next){
 if(url.startsWith('file:')){
  const f=fileURLToPath(url);
  if(f.startsWith(SERVICE+'/scripts/')){
   const rel=f.slice(SERVICE.length+1),candidate=J+'/candidate/'+rel;
   if(fs.existsSync(candidate))return {format:'module',source:fs.readFileSync(candidate,'utf8'),shortCircuit:true};
   if(rel==='scripts/lib/process-run-lock.mjs')return {format:'module',source:execFileSync('git',['show',REF+':'+rel],{cwd:ROOT,encoding:'utf8'}),shortCircuit:true};
  }
 }
 return next(url,context);
}
