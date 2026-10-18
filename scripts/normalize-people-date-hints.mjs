#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {parseArgs,isDeepStrictEqual} from 'node:util';
import {fileURLToPath} from 'node:url';
import {peopleExtractionFiles} from './lib/people-corpus.mjs';
import {normalizeExtractionDateHints} from './lib/people-date-hints.mjs';
import {PEOPLE_DIR,readJson,sha256,writeTextAtomic} from './lib/people-content.mjs';
import {serializeCompactPeopleExtraction} from './lib/people-compact.mjs';

export function runDateHintNormalization(argv){
  const {values:o}=parseArgs({args:argv,options:{file:{type:'string'},all:{type:'boolean'},book:{type:'string'},chapter:{type:'string'},apply:{type:'boolean'},receipt:{type:'string'},check:{type:'boolean'}}});
  if([Boolean(o.file),Boolean(o.all),Boolean(o.book)].filter(Boolean).length!==1||o.chapter&&!o.book)throw new Error('Select --file PATH, --all, or --book BOOK [--chapter NNN]');
  if(o.book&&!/^[a-z0-9_-]+$/u.test(o.book)||o.chapter&&!/^\d{3}$/u.test(o.chapter))throw new Error('Invalid book/chapter scope');
  if(o.apply&&(!o.receipt||o.check))throw new Error('--apply requires --receipt PATH and cannot use --check');
  const files=o.file?[path.resolve(o.file)]:o.chapter?[path.join(PEOPLE_DIR,'extractions',o.book,`${o.chapter}.json`)]:peopleExtractionFiles().filter(file=>!o.book||path.basename(path.dirname(file))===o.book);
  if(!files.length)throw new Error('No extraction files selected');
  const entries=[];
  for(const file of files){const bytes=fs.readFileSync(file,'utf8'),before=JSON.parse(bytes);const {candidate,changes}=normalizeExtractionDateHints(before);
    if(changes.length)entries.push({file,beforeHash:sha256(bytes),candidateSemanticHash:sha256(JSON.stringify(candidate)),changes});}
  const report={kind:'western-date-hint-formatting',schemaVersion:1,entries,chapters:entries.length,hints:entries.reduce((n,e)=>n+e.changes.length,0)};
  if(o.receipt){
    if(files.some(file=>path.resolve(file)===path.resolve(o.receipt)))throw new Error('Receipt cannot overwrite an input');
    try{fs.writeFileSync(path.resolve(o.receipt),`${JSON.stringify(report,null,2)}\n`,{flag:'wx',mode:0o600});}
    catch(error){if(error?.code==='EEXIST')throw new Error('Receipt already exists; preserve prior recovery evidence');throw error;}
  }
  if(o.apply)for(const entry of entries){const bytes=fs.readFileSync(entry.file,'utf8');if(sha256(bytes)!==entry.beforeHash)throw new Error(`Input changed; refusing stale normalization: ${entry.file}`);
    const {candidate}=normalizeExtractionDateHints(JSON.parse(bytes));
    if(sha256(JSON.stringify(candidate))!==entry.candidateSemanticHash)throw new Error('Normalization candidate hash changed');
    const output=candidate.schemaVersion===2?serializeCompactPeopleExtraction(candidate):`${JSON.stringify(candidate,null,2)}\n`;
    if(!isDeepStrictEqual(JSON.parse(output),candidate))throw new Error(`Serialization would alter unrelated extraction fields: ${entry.file}`);
    writeTextAtomic(entry.file,output);}
  console.log(JSON.stringify({...report,canonicalWrites:o.apply?entries.length:0}));
  return o.check&&entries.length?1:0;
}
if(process.argv[1]&&fs.realpathSync(process.argv[1])===fileURLToPath(import.meta.url))process.exitCode=runDateHintNormalization(process.argv.slice(2));
