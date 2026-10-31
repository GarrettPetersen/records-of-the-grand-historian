import fs from 'node:fs';import{load,overlay}from'./master-readonly-runtime.mjs';
const C='data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/mention-release-candidate/';
for(const file of['scripts/compile-people-catalog.mjs','scripts/test-ebook-certified-people.mjs'])overlay.set(file,fs.readFileSync(C+file));
await load('scripts/test-ebook-certified-people.mjs');
