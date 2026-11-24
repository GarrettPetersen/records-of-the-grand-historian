#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual} from 'node:util';
import {parseArgs} from 'node:util';
import {pathToFileURL} from 'node:url';
import {ownerDirectory,digest,chapterOperation} from './lib/people-chapter-owner.mjs';
import {writeJsonAtomic} from './lib/people-content.mjs';
import {prepareEnglishFootnoteAdditions} from './lib/people-footnote-preparation.mjs';
import {acceptedRepairContracts,assembleOwnerRepairChain,assertAcceptedRepairsPreserved} from './lib/people-owner-repair-chain.mjs';
const {values:o}=parseArgs({options:{job:{type:'string'},root:{type:'string'}}});
const root=fs.realpathSync(o.root??process.cwd()),dir=ownerDirectory(root,o.job),file=path.join(dir,'job.json');
let job=JSON.parse(fs.readFileSync(file));
if(!['working','ready-for-review'].includes(job.status))throw Error('Owner coherence: draft must be in an owner/pre-review phase');
const read=p=>JSON.parse(fs.readFileSync(p));
const {contentUnits,setTranslationField}=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-content.mjs')));
const sourceFile=path.join(root,`data/${job.book}/${job.chapter}.json`),beforeFile=path.join(root,`data/people/extractions/${job.book}/${job.chapter}.json`);
if(digest(fs.readFileSync(sourceFile))!==job.sourceSha256)throw Error('Owner coherence: original canonical source changed');
let prefix;
if(job.canonicalExtractionAbsent){
 if(job.extractionSha256!==null||fs.existsSync(beforeFile))throw Error('Owner coherence: original canonical extraction absence changed');
 prefix=[];
}else{
 if(digest(fs.readFileSync(beforeFile))!==job.extractionSha256)throw Error('Owner coherence: original canonical extraction changed');
 prefix=read(beforeFile).translationRepairs;
}
const candidate=read(path.join(dir,'extraction.json')),source=read(path.join(dir,'source.json')),replay=read(sourceFile);
if(!isDeepStrictEqual(candidate.translationRepairs.slice(0,prefix.length),prefix))throw Error('Owner coherence: prior repair history changed; preserve and reconcile it');
const proposals=read(path.join(dir,'editorial-proposals.json'));
for(const r of job.repairs){
 const unit=contentUnits(replay).find(u=>u.id===r.unitId);if(!unit)throw Error('Owner coherence: unknown source repair unit');
 setTranslationField(replay,unit,r.field,r.before,r.after);
}
const materialization=read(path.join(dir,'materialization.json'));
let completeReplay=replay;
if(materialization.sourceFootnoteContract){
 const prepared=prepareEnglishFootnoteAdditions(replay,materialization.sourceFootnoteContract);
 if(!isDeepStrictEqual(prepared.contract,materialization.sourceFootnoteContract)||!job.authors.includes(prepared.contract.authorAgentId))throw Error('Owner coherence: footnote contract or declared author changed');
 completeReplay=prepared.source;
}
if(!isDeepStrictEqual(completeReplay,source))throw Error('Owner coherence: source changes are not completely explained by exact-before repair records and explicit footnote additions');
// Keep the owner's valid repair chain row for row (stable IDs); append only
// journal changes not yet recorded. Accepted incoming rows must survive exactly.
const draftEditorial=path.join(dir,'editorial.json'),priorEditorial=path.join(root,`data/people/editorial-decisions/${job.book}/${job.chapter}.json`);
let editorialNative=null,draft=null,canonicalReviewCount=0;
if(job.reviewAgentId||fs.existsSync(draftEditorial)){
 editorialNative=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-editorial-decisions.mjs')));
 draft=read(draftEditorial);
 canonicalReviewCount=editorialNative.editorialReviews(fs.existsSync(priorEditorial)?read(priorEditorial):null).length;
}
const contracts=editorialNative?acceptedRepairContracts(editorialNative.editorialReviews(draft).slice(canonicalReviewCount),{book:job.book,chapter:job.chapter,authors:job.authors,validateReview:review=>editorialNative.validateEditorialDecisionDocument(review)}):[];
const chain=assembleOwnerRepairChain({journal:job.repairs,manualRows:candidate.translationRepairs.slice(prefix.length),repairConfidence:proposals.repairConfidence??{},contracts});
if(chain.missing.length)throw Error('Owner coherence: repair confidence is missing for journal indices '+chain.missing.join(',')+'. In this same owner context, chapter_patch target editorial-proposals pointer /repairConfidence add:true with an explicit index-to-high/medium/low map, then finish the native gate again. Do not reread unchanged source.');
let expected=[...prefix,...chain.rows],reviewedReasonBindings=[];
if(job.reviewAgentId){
 const {bindChapterRepairReasonMetadata}=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-chapter-native-inputs.mjs')));
 const bound=bindChapterRepairReasonMetadata({...candidate,translationRepairs:expected},draft,{priorRepairCount:prefix.length,canonicalReviewCount,actualReviewerAgentId:job.reviewAgentId,authorAgentIds:job.authors,native:editorialNative});
 expected=bound.candidate.translationRepairs;reviewedReasonBindings=bound.changes;
}
const acceptedIncomingRepairs=assertAcceptedRepairsPreserved(expected,contracts);
if(!isDeepStrictEqual(candidate.translationRepairs,expected)){
 const snapshot=path.join(dir,'owner-history');fs.mkdirSync(snapshot,{recursive:true});
 const bytes=fs.readFileSync(path.join(dir,'extraction.json')),archive=path.join(snapshot,'extraction-before-repair-assembly-'+digest(bytes).slice(7,23)+'.json');
 if(!fs.existsSync(archive))fs.writeFileSync(archive,bytes,{flag:'wx',mode:0o600});
 candidate.translationRepairs=expected;writeJsonAtomic(path.join(dir,'extraction.json'),candidate);
 job.revision++;job.repairAssembly={at:new Date().toISOString(),sourceOperations:chain.appended.length,retainedChainRows:chain.rows.length-chain.appended.length,acceptedIncomingRepairs,priorRepairCount:prefix.length,retainedManualDraft:archive,reviewedReasonBindings};
 fs.appendFileSync(path.join(dir,'operations.jsonl'),JSON.stringify({at:new Date().toISOString(),role:'host',operation:'compile-recorded-repairs',resultRevision:job.revision,sourceOperations:chain.appended.length})+'\n',{mode:0o600});
 writeJsonAtomic(file,job);
}
const report=chapterOperation(root,job.id,'owner','validate');
if(!report.passed)throw Error('Owner coherence: assembled candidate fails native validation; inspect draft:native-validation');
console.log(JSON.stringify({coherent:true,job:job.id,sourceRepairOperations:chain.appended.length,retainedChainRows:chain.rows.length-chain.appended.length,acceptedIncomingRepairs,approvalGranted:false}));
