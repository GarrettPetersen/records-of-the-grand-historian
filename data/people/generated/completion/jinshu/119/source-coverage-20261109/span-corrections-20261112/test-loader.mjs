import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const runtime=pathToFileURL('/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/').href;
const replacements=new Map([
 ['scripts/lib/people-translation-repairs.mjs',new URL('./people-translation-repairs.mjs',import.meta.url)],
 ['scripts/apply-people-translation-repairs.mjs',new URL('./apply-people-translation-repairs.mjs',import.meta.url)],
 ['scripts/test-people-reviewed-name-spans.mjs',new URL('./test-people-reviewed-name-spans.mjs',import.meta.url)],
]);
export function resolve(specifier,context,nextResolve){
 const url=new URL(specifier,context.parentURL??runtime).href;
 if(url.startsWith(runtime)&&replacements.has(decodeURIComponent(url.slice(runtime.length))))return {url,shortCircuit:true};
 return nextResolve(specifier,context);
}
export function load(url,context,nextLoad){
 if(!url.startsWith(runtime))return nextLoad(url,context);
 const relative=decodeURIComponent(url.slice(runtime.length));
 if(relative.startsWith('node_modules/')||!/^.*\.(?:mjs|js)$/.test(relative))return nextLoad(url,context);
 const replacement=replacements.get(relative);
 const source=replacement?fs.readFileSync(replacement,'utf8'):execFileSync('git',['show','60849db832e126bbacbf4da483644aa25a00fa09:'+relative],{cwd:'/Users/garrettpetersen/records-of-the-grand-historian',encoding:'utf8',maxBuffer:4*1024*1024});
 return {format:'module',source,shortCircuit:true};
}
