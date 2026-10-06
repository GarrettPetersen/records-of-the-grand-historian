#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {peopleExtractionFiles} from './lib/people-corpus.mjs';
import {readJson,sha256,writeJsonAtomic} from './lib/people-content.mjs';
import {reconcileRetrospectiveExtraction} from './lib/people-reception-reconciliation.mjs';

const {values:o}=parseArgs({options:{all:{type:'boolean'},book:{type:'string'},chapter:{type:'string'},out:{type:'string'},apply:{type:'boolean'}}});
if(o.all===Boolean(o.book)||o.chapter&&!o.book)throw new Error('Use --all or --book [--chapter NNN]');
if(o.chapter&&!/^\d{3}$/.test(o.chapter))throw new Error('Chapter must have three digits');
const entries=[];
for(const file of peopleExtractionFiles()) {
  const before=readJson(file);
  if(o.book&&before.book!==o.book||o.chapter&&before.chapter!==o.chapter)continue;
  const {candidate,changes}=reconcileRetrospectiveExtraction(before);
  if(changes.length)entries.push({book:before.book,chapter:before.chapter,file,extractionHash:sha256(JSON.stringify(before)),candidateHash:sha256(JSON.stringify(candidate)),changes});
}
const report={kind:'retrospective-taxonomy-reconciliation',schemaVersion:1,chapters:entries.length,claims:entries.reduce((n,e)=>n+e.changes.length,0),entries};
if(o.out) {
  const file=path.resolve(o.out);
  if(fs.existsSync(file))throw new Error('Reconciliation output already exists; preserve the prior plan');
  writeJsonAtomic(file,report);
}
if(o.apply) {
  if(!o.out) throw new Error('--apply requires --out so the immutable before/after receipt is retained');
  for(const entry of entries) {
    const before=readJson(entry.file);
    if(sha256(JSON.stringify(before))!==entry.extractionHash) throw new Error(`Extraction changed before reconciliation: ${entry.book}/${entry.chapter}`);
    const {candidate,changes}=reconcileRetrospectiveExtraction(before);
    if(JSON.stringify(changes)!==JSON.stringify(entry.changes)) throw new Error(`Exact reconciliation rows changed: ${entry.book}/${entry.chapter}`);
    writeJsonAtomic(entry.file,candidate);
  }
}
console.log(JSON.stringify({chapters:report.chapters,claims:report.claims,canonicalWrites:o.apply?report.chapters:0,report:o.out?path.resolve(o.out):null}));
