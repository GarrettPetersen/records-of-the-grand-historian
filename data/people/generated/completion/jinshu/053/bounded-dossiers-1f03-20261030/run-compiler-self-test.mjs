import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';import{overlay,load}from'./runtime.mjs';
const J=path.dirname(fileURLToPath(import.meta.url));
function put(directory,prefix=''){for(const d of fs.readdirSync(directory,{withFileTypes:true})){const name=prefix+d.name;if(d.isDirectory())put(directory+'/'+d.name,name+'/');else if(/\.(?:mjs|js|json)$/.test(name))overlay.set(name,fs.readFileSync(directory+'/'+d.name));}}
put(J+'/candidate');const source=overlay.get('scripts/compile-people-catalog.mjs');overlay.set('scripts/compile-people-catalog.mjs',Buffer.from(source.toString()+'\nexport { selfTest };\n'));
const api=await load('scripts/compile-people-catalog.mjs');api.selfTest();
