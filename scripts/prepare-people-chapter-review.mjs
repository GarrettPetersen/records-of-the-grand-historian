#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';
import {spawnSync} from 'node:child_process';
import {ownerDirectory,digest} from './lib/people-chapter-owner.mjs';
import {writeJsonAtomic} from './lib/people-content.mjs';
const {values:o}=parseArgs({options:{job:{type:'string'},root:{type:'string'}}});
const root=fs.realpathSync(o.root??process.cwd()),dir=ownerDirectory(root,o.job),file=path.join(dir,'job.json');
let original=fs.readFileSync(file),job=JSON.parse(original);
if(job.status!=='ready-for-review')throw Error('Finish the owner candidate before preparing independent review');
if(process.env.PEOPLE_REPO_ROOT!==job.nativeRoot)throw Error('Set PEOPLE_REPO_ROOT to the pinned production runtime');
const compiled=spawnSync(process.execPath,['scripts/compile-people-chapter-owner.mjs','--job',job.id,'--root',root],{cwd:root,encoding:'utf8',env:{...process.env,PEOPLE_REPO_ROOT:root}});
if(compiled.status!==0)throw Error(compiled.stderr||'Owner coherence: compilation failed');
original=fs.readFileSync(file);job=JSON.parse(original);
const guard=spawnSync(process.execPath,['scripts/check-local-disk.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,PEOPLE_REPO_ROOT:root}});if(guard.status!==0)throw Error('Resource preflight failed: '+guard.stdout+guard.stderr);
for(const pin of job.nativeSeals)if(digest(fs.readFileSync(path.join(job.nativeRoot,pin.file)))!==pin.sha256)throw Error('Pinned native code changed');
const sourceBytes=fs.readFileSync(path.join(dir,'source.json')),extractionBytes=fs.readFileSync(path.join(dir,'extraction.json'));
const validation=JSON.parse(fs.readFileSync(path.join(dir,'native-validation.json')));
if(!validation.passed||validation.sourceSha256!==digest(sourceBytes)||validation.extractionSha256!==digest(extractionBytes))throw Error('Candidate lacks current passing native extraction validation');
const {combinedDatePacket,documentHash}=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-combined-curation-review.mjs')));
const source=JSON.parse(sourceBytes),extraction=JSON.parse(extractionBytes),packet=combinedDatePacket(job.book,job.chapter,source,extraction);
const {buildPeopleExtractionPacket}=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/build-people-extraction-packet.mjs')));
const {validateCompactPeopleExtraction}=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/validate-people-extraction.mjs')));
const {loadProperNounMatcher}=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-candidates.mjs')));
const {editorialDecisionSeed,editorialReviews}=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-editorial-decisions.mjs')));
const extractionPacket=buildPeopleExtractionPacket(job.book,job.chapter,{chapterData:source,properNounMatcher:loadProperNounMatcher()});
const expanded=validateCompactPeopleExtraction(extraction,extractionPacket,{strictAliasDispositions:true}).normalized;
const canonicalExtraction=JSON.parse(fs.readFileSync(path.join(root,`data/people/extractions/${job.book}/${job.chapter}.json`)));
const canonicalEditorial=path.join(root,`data/people/editorial-decisions/${job.book}/${job.chapter}.json`);
const beforeEditorial=JSON.parse(fs.readFileSync(canonicalEditorial));
const newRepairs=expanded.translationRepairs.slice(canonicalExtraction.translationRepairs.length);
if(newRepairs.length){
 const seed=editorialDecisionSeed({...expanded,translationRepairs:newRepairs.map(r=>({...r,status:'proposed'}))});
 const record=Object.fromEntries(Object.entries(seed).filter(([key])=>!['schemaVersion','book','chapter'].includes(key)));
 const existing=JSON.parse(fs.readFileSync(path.join(dir,'editorial.json'))),oldReviews=editorialReviews(beforeEditorial),current=editorialReviews(existing);
 if(current.length!==oldReviews.length&&JSON.stringify(current.at(-1).proposals)!==JSON.stringify(record.proposals))throw Error('Owner coherence: changed pending editorial proposals require explicit same-reviewer reconciliation; preserve prior review');
 if(current.length===oldReviews.length)fs.writeFileSync(path.join(dir,'editorial.json'),JSON.stringify({schemaVersion:4,book:job.book,chapter:job.chapter,reviews:[...oldReviews,record]},null,2)+'\n');
}else{
 const editorialFile=path.join(dir,'editorial.json'),existing=JSON.parse(fs.readFileSync(editorialFile));
 if(JSON.stringify(existing)!==JSON.stringify(beforeEditorial)){
  const history=path.join(dir,'review-history');fs.mkdirSync(history,{recursive:true});
  const archived=path.join(history,'editorial-before-zero-repair-'+digest(fs.readFileSync(editorialFile)).slice(7,23)+'.json');
  if(!fs.existsSync(archived))fs.copyFileSync(editorialFile,archived,fs.constants.COPYFILE_EXCL);
  writeJsonAtomic(editorialFile,beforeEditorial);
 }
}
const suffix=digest(sourceBytes).slice(7,19)+'-'+digest(extractionBytes).slice(7,19);
const materialization={sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,sourceByteHash:digest(sourceBytes),extractionByteHash:digest(extractionBytes)};
const existingMaterialization=JSON.parse(fs.readFileSync(path.join(dir,'materialization.json')));
if(Object.keys(existingMaterialization).some(k=>!Object.hasOwn(materialization,k)))throw Error('Owner coherence: unsupported source-structure contract requires explicit host review');
fs.writeFileSync(path.join(dir,'materialization.json'),JSON.stringify(materialization,null,2)+'\n');
const draftFiles=['source','extraction','editorial','editorial-proposals','materialization'].map(name=>{const f=path.join(dir,name+'.json'),b=fs.readFileSync(f);return{name,file:f,bytes:b.length,sha256:digest(b),documentHash:documentHash(JSON.parse(b))};});
const context={kind:'independent-chapter-review-context',schemaVersion:1,book:job.book,chapter:job.chapter,
 actualAuthors:job.authors,sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,draftFiles,
 counts:{sourceUnits:job.unitIds.length,people:extraction.people.length,temporalItems:packet.items.length,personChecks:packet.people.length},
 editorial:{newRepairProposals:newRepairs.length,oldHistoryPreserved:true,hashesAreInitialDraftSnapshots:true,getFinalHashes:'Read draft:editorial with JSON pointer /reviews/INDEX for documentHash after decisions; read each full draft for final raw sha256/bytes. No hashes here grant approval.'},
 approvalGranted:false,instruction:'Review all required native source/editorial/date/identity evidence. These computed hashes and counts grant no semantic approval. Retained editorial history must remain intact. Never approve a repair you authored; return repair-required or research-hold findings explicitly.'};
const entries=[];
for(const [name,value] of [['date-review-packet',packet],['review-context',context]]){
 const target=path.join(dir,name+'-'+suffix+'.json'),bytes=Buffer.from(JSON.stringify(value,null,2)+'\n');
 if(fs.existsSync(target)){if(digest(fs.readFileSync(target))!==digest(bytes))throw Error('Immutable review packet differs; preserve and reconcile');}else fs.writeFileSync(target,bytes,{flag:'wx',mode:0o600});
 const id=name+'-'+suffix;entries.push({id,file:path.relative(root,target),bytes:bytes.length,sha256:digest(bytes),use:'current-independent-review-input-not-approval'});
}
if(!fs.readFileSync(file).equals(original))throw Error('Job changed while sealing review; reconcile without losing outputs');
job.artifacts=[...job.artifacts.filter(a=>!entries.some(e=>e.id===a.id)),...entries];job.reviewPacketArtifacts=entries.map(e=>({id:e.id,kind:e.id.startsWith('date-')?'native-date-packet':'native-hashes-and-counts'}));
fs.writeFileSync(file,JSON.stringify(job,null,2)+'\n');console.log(JSON.stringify({job:job.id,reviewInputs:job.reviewPacketArtifacts,approvalGranted:false}));
