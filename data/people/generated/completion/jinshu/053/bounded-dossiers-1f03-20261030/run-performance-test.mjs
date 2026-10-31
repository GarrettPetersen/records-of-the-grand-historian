import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';
import{ROOT,overlay,load}from'./fixture-runtime.mjs';
const J=path.dirname(fileURLToPath(import.meta.url)),entry=process.argv[2];
if(!/^scripts\/[a-z0-9-]+\.mjs$/u.test(entry??''))throw Error('Explicit repository script entry required');
function put(dir,prefix=''){for(const row of fs.readdirSync(dir,{withFileTypes:true})){const name=prefix+row.name;if(row.isDirectory())put(dir+'/'+row.name,name+'/');else if(/\.(?:mjs|js|json)$/.test(name))overlay.set(name,fs.readFileSync(dir+'/'+row.name));}}
put(J+'/candidate');put(J+'/performance-candidate');globalThis.__completionRecordChapter=(file,_packet,extraction)=>({file,extraction});
process.argv=[process.execPath,ROOT+'/'+entry,...process.argv.slice(3)];
await load(entry);
