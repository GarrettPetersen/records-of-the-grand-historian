import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const root='/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/';
const artifacts=new URL('./',import.meta.url);
const replacements=new Map([
 [pathToFileURL(root+'scripts/lib/people-translation-repairs.mjs').href,new URL('people-translation-repairs.mjs',artifacts)],
 [pathToFileURL(root+'scripts/self-test-people-source-name-retention.mjs').href,new URL('self-test-people-source-name-retention.mjs',artifacts)],
]);
export function load(url,context,nextLoad){
 const replacement=replacements.get(url);
 return replacement?{format:'module',source:fs.readFileSync(replacement,'utf8'),shortCircuit:true}:nextLoad(url,context);
}
