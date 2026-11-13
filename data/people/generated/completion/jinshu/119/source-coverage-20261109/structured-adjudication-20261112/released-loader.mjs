import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const runtime=pathToFileURL('/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/').href;
export function load(url,context,nextLoad){
 if(!url.startsWith(runtime))return nextLoad(url,context);
 const relative=decodeURIComponent(url.slice(runtime.length));
 if(relative.startsWith('node_modules/')||!/^.*\.(?:mjs|js)$/.test(relative))return nextLoad(url,context);
 const source=execFileSync('git',['show','60849db832e126bbacbf4da483644aa25a00fa09:'+relative],{cwd:'/Users/garrettpetersen/records-of-the-grand-historian',encoding:'utf8',maxBuffer:4*1024*1024});
 return {format:'module',source,shortCircuit:true};
}
