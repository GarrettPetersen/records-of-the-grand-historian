#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';
import {spawnSync} from 'node:child_process';
import {ownerDirectory,digest} from './lib/people-chapter-owner.mjs';
import {writeJsonAtomic} from './lib/people-content.mjs';
import {prepareChapterEditorialHistory} from './lib/people-chapter-editorial-preparation.mjs';
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
const editorialNative=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-editorial-decisions.mjs')));
const extractionPacket=buildPeopleExtractionPacket(job.book,job.chapter,{chapterData:source,properNounMatcher:loadProperNounMatcher()});
const expanded=validateCompactPeopleExtraction(extraction,extractionPacket,{strictAliasDispositions:true}).normalized;
const canonicalExtractionFile=path.join(root,`data/people/extractions/${job.book}/${job.chapter}.json`);
if(job.canonicalExtractionAbsent&&fs.existsSync(canonicalExtractionFile))throw Error('Original canonical extraction absence changed; reconcile ownership');
const priorRepairCount=job.canonicalExtractionAbsent?0:JSON.parse(fs.readFileSync(canonicalExtractionFile)).translationRepairs.length;
const canonicalEditorial=path.join(root,`data/people/editorial-decisions/${job.book}/${job.chapter}.json`);
const beforeEditorial=fs.existsSync(canonicalEditorial)?JSON.parse(fs.readFileSync(canonicalEditorial)):null;
const newRepairs=expanded.translationRepairs.slice(priorRepairCount);
const editorialFile=path.join(dir,'editorial.json'),editorialBytes=fs.readFileSync(editorialFile);
const preparedEditorial=prepareChapterEditorialHistory({extraction:{...expanded,translationRepairs:newRepairs},canonical:beforeEditorial,current:JSON.parse(editorialBytes),reviewerAgentId:job.reviewAgentId,native:editorialNative});
if(JSON.stringify(JSON.parse(editorialBytes))!==JSON.stringify(preparedEditorial.document)){
 const history=path.join(dir,'review-history');fs.mkdirSync(history,{recursive:true});
 const archived=path.join(history,'editorial-before-preparation-'+digest(editorialBytes).slice(7,23)+'.json');
 if(!fs.existsSync(archived))fs.writeFileSync(archived,editorialBytes,{flag:'wx',mode:0o600});
 writeJsonAtomic(editorialFile,preparedEditorial.document);
}
const suffix=digest(sourceBytes).slice(7,19)+'-'+digest(extractionBytes).slice(7,19);
const materialization={sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,sourceByteHash:digest(sourceBytes),extractionByteHash:digest(extractionBytes)};
const existingMaterialization=JSON.parse(fs.readFileSync(path.join(dir,'materialization.json')));
if(Object.keys(existingMaterialization).some(k=>!Object.hasOwn(materialization,k)&&k!=='sourceFootnoteContract'))throw Error('Owner coherence: unsupported source-structure contract requires explicit host review');
if(existingMaterialization.sourceFootnoteContract)materialization.sourceFootnoteContract=existingMaterialization.sourceFootnoteContract;
fs.writeFileSync(path.join(dir,'materialization.json'),JSON.stringify(materialization,null,2)+'\n');
const draftFiles=['source','extraction','editorial','editorial-proposals','materialization'].map(name=>{const f=path.join(dir,name+'.json'),b=fs.readFileSync(f);return{name,file:f,bytes:b.length,sha256:digest(b),documentHash:documentHash(JSON.parse(b))};});
const context={kind:'independent-chapter-review-context',schemaVersion:1,book:job.book,chapter:job.chapter,
 actualAuthors:job.authors,sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,draftFiles,
 counts:{sourceUnits:job.unitIds.length,people:extraction.people.length,temporalItems:packet.items.length,personChecks:packet.people.length},
 editorial:{canonicalBeforeReviewCount:editorialNative.editorialReviews(beforeEditorial).length,nativeIncomingReviewIndices:editorialNative.editorialReviews(preparedEditorial.document).map((_,i)=>i).slice(editorialNative.editorialReviews(beforeEditorial).length),newRepairProposals:preparedEditorial.pendingRepairIds.length,pendingRepairIds:preparedEditorial.pendingRepairIds,retainedReviewCount:preparedEditorial.retainedReviewCount,oldHistoryPreserved:true,hashesAreInitialDraftSnapshots:true,getFinalHashes:'After final decisions, chapter_read draft:editorial returns editorialComponentHashes as native schema3 document hashes, even with a component pointer. Select nativeIncomingReviewIndices in order; never use the bare /reviews/INDEX documentHash as the native wrapper hash. Read final full drafts for report hashes. All hashes are computed metadata, not approval.'},
 approvalGranted:false,instruction:'Review all required native source/editorial/date/identity evidence. These computed hashes and counts grant no semantic approval. Retained editorial history must remain intact. Never approve a repair you authored; return repair-required or research-hold findings explicitly.'};
const entries=[];
for(const [name,value] of [['date-review-packet',packet],['review-context',context]]){
 const bytes=Buffer.from(JSON.stringify(value,null,2)+'\n'),id=name+'-'+suffix+(name==='review-context'?'-'+digest(bytes).slice(7,19):''),target=path.join(dir,id+'.json');
 if(fs.existsSync(target)){if(digest(fs.readFileSync(target))!==digest(bytes))throw Error('Immutable review packet differs; preserve and reconcile');}else fs.writeFileSync(target,bytes,{flag:'wx',mode:0o600});
 entries.push({id,file:path.relative(root,target),bytes:bytes.length,sha256:digest(bytes),use:'current-independent-review-input-not-approval'});
}
if(!fs.readFileSync(file).equals(original))throw Error('Job changed while sealing review; reconcile without losing outputs');
job.artifacts=[...job.artifacts.filter(a=>!entries.some(e=>e.id===a.id)),...entries];job.reviewPacketArtifacts=entries.map(e=>({id:e.id,kind:e.id.startsWith('date-')?'native-date-packet':'native-hashes-and-counts'}));
fs.writeFileSync(file,JSON.stringify(job,null,2)+'\n');console.log(JSON.stringify({job:job.id,reviewInputs:job.reviewPacketArtifacts,approvalGranted:false}));
