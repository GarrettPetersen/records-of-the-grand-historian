import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const runtime=pathToFileURL('/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/').href;
const artifacts=new URL('./',import.meta.url);
const replacements=new Map([
 ['scripts/lib/people-translation-repairs.mjs',new URL('people-translation-repairs.mjs',artifacts)],
 ['scripts/self-test-people-source-name-retention.mjs',new URL('self-test-people-source-name-retention.mjs',artifacts)],
]);
export function load(url,context,nextLoad){
 if(!url.startsWith(runtime))return nextLoad(url,context);
 const relative=decodeURIComponent(url.slice(runtime.length));
 if(relative.startsWith('node_modules/')||!/^.*\.(?:mjs|js)$/.test(relative))return nextLoad(url,context);
 const replacement=replacements.get(relative);
 const source=replacement?fs.readFileSync(replacement,'utf8'):execFileSync('git',['show','56aee9165ec8ba93e8c30a6166da95df00acdcc8:'+relative],{cwd:'/Users/garrettpetersen/records-of-the-grand-historian',encoding:'utf8',maxBuffer:4*1024*1024});
 return {format:'module',source,shortCircuit:true};
}
