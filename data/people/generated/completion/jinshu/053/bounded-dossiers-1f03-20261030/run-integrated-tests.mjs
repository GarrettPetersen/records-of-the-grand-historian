import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';import{overlay,load}from'./runtime.mjs';
const J=path.dirname(fileURLToPath(import.meta.url));
function overlayTree(directory,prefix=''){for(const d of fs.readdirSync(directory,{withFileTypes:true})){const name=prefix+d.name;if(d.isDirectory())overlayTree(directory+'/'+d.name,name+'/');else if(/\.(?:mjs|js|json)$/.test(name))overlay.set(name,fs.readFileSync(directory+'/'+d.name));}}
overlayTree(J+'/candidate');
await load('scripts/lib/people-qualified-scope.mjs');await load('scripts/lib/people-certified-site.mjs');await load('scripts/lib/ebook-people-render.mjs');await load('scripts/generate-people-pages.mjs');
await load('scripts/test-people-identity-dossiers.mjs');await load('scripts/test-people-chapter-identity.mjs');await load('scripts/test-people-resolution.mjs');
