#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual} from 'node:util';
import {parseArgs} from 'node:util';
import {pathToFileURL} from 'node:url';
import {ownerDirectory,digest,chapterOperation} from './lib/people-chapter-owner.mjs';
import {writeJsonAtomic} from './lib/people-content.mjs';
const {values:o}=parseArgs({options:{job:{type:'string'},root:{type:'string'}}});
const root=fs.realpathSync(o.root??process.cwd()),dir=ownerDirectory(root,o.job),file=path.join(dir,'job.json');
let job=JSON.parse(fs.readFileSync(file));
if(!['working','ready-for-review'].includes(job.status))throw Error('Owner coherence: draft must be in an owner/pre-review phase');
const read=p=>JSON.parse(fs.readFileSync(p));
const {contentUnits,setTranslationField}=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-content.mjs')));
const sourceFile=path.join(root,`data/${job.book}/${job.chapter}.json`),beforeFile=path.join(root,`data/people/extractions/${job.book}/${job.chapter}.json`);
if(digest(fs.readFileSync(sourceFile))!==job.sourceSha256||digest(fs.readFileSync(beforeFile))!==job.extractionSha256)throw Error('Owner coherence: original canonical inputs changed');
const before=read(beforeFile),candidate=read(path.join(dir,'extraction.json')),source=read(path.join(dir,'source.json')),replay=read(sourceFile);
const prefix=before.translationRepairs;
if(!isDeepStrictEqual(candidate.translationRepairs.slice(0,prefix.length),prefix))throw Error('Owner coherence: prior repair history changed; preserve and reconcile it');
const proposals=read(path.join(dir,'editorial-proposals.json')),rows=[],missing=[],fields=new Map();
for(const [index,r] of job.repairs.entries()){
 const unit=contentUnits(replay).find(u=>u.id===r.unitId);if(!unit)throw Error('Owner coherence: unknown source repair unit');
 setTranslationField(replay,unit,r.field,r.before,r.after);
 const key=r.unitId+'/'+r.field,prior=fields.get(key);
 fields.set(key,{...r,before:prior?.before??r.before,lastIndex:index});
}
if(!isDeepStrictEqual(replay,source))throw Error('Owner coherence: source changes are not completely explained by exact-before repair records');
for(const r of fields.values()){
 if(r.before===r.after)continue;
 const confidence=r.confidence??proposals.repairConfidence?.[String(r.lastIndex)];
 if(!['high','medium','low'].includes(confidence))missing.push(r.lastIndex);
 rows.push([r.unitId,r.field,r.before,r.after,r.reason,confidence,'applied']);
}
if(missing.length)throw Error('Owner coherence: repair confidence is missing for journal indices '+missing.join(',')+'. In this same owner context, chapter_patch target editorial-proposals pointer /repairConfidence add:true with an explicit index-to-high/medium/low map, then finish the native gate again. Do not reread unchanged source.');
const manual=candidate.translationRepairs.slice(prefix.length);
if(manual.some(row=>!job.repairs.some(r=>isDeepStrictEqual([r.unitId,r.field,r.before,r.after],row.slice(0,4)))&&!rows.some(r=>isDeepStrictEqual(r.slice(0,4),row.slice(0,4)))))throw Error('Owner coherence: a manually added repair has no matching source-tool record or verified final field delta');
const expected=[...prefix,...rows];
if(!isDeepStrictEqual(candidate.translationRepairs,expected)){
 const snapshot=path.join(dir,'owner-history');fs.mkdirSync(snapshot,{recursive:true});
 const bytes=fs.readFileSync(path.join(dir,'extraction.json')),archive=path.join(snapshot,'extraction-before-repair-assembly-'+digest(bytes).slice(7,23)+'.json');
 if(!fs.existsSync(archive))fs.writeFileSync(archive,bytes,{flag:'wx',mode:0o600});
 candidate.translationRepairs=expected;writeJsonAtomic(path.join(dir,'extraction.json'),candidate);
 job.revision++;job.repairAssembly={at:new Date().toISOString(),sourceOperations:rows.length,priorRepairCount:prefix.length,retainedManualDraft:archive};
 fs.appendFileSync(path.join(dir,'operations.jsonl'),JSON.stringify({at:new Date().toISOString(),role:'host',operation:'compile-recorded-repairs',resultRevision:job.revision,sourceOperations:rows.length})+'\n',{mode:0o600});
 writeJsonAtomic(file,job);
}
const report=chapterOperation(root,job.id,'owner','validate');
if(!report.passed)throw Error('Owner coherence: assembled candidate fails native validation; inspect draft:native-validation');
console.log(JSON.stringify({coherent:true,job:job.id,sourceRepairOperations:rows.length,approvalGranted:false}));
