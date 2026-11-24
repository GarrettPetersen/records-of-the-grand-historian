#!/usr/bin/env node
import fs from 'node:fs';
import {Agent} from '@cursor/sdk';
import {loadDotenv} from './load-dotenv.mjs';
import {assertRecordingRecoveryGate,recordingDocumentHash} from './lib/people-recording-recovery.mjs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';
import {spawnSync} from 'node:child_process';
import {ownerDirectory,digest} from './lib/people-chapter-owner.mjs';
import {assertPeopleMasterSync} from './check-people-master-sync.mjs';
import {writeJsonAtomic} from './lib/people-content.mjs';
import {readRemotePeopleWorkLedger} from './lib/people-work-queue.mjs';
const {values:o}=parseArgs({options:{job:{type:'string'},root:{type:'string'},publish:{type:'boolean'},'host-author':{type:'string'}}});
const root=fs.realpathSync(o.root??process.cwd()),dir=ownerDirectory(root,o.job),file=path.join(dir,'job.json'),job=JSON.parse(fs.readFileSync(file));
assertPeopleMasterSync(root);
loadDotenv(root);
await assertRecordingRecoveryGate(job,dir,(agentId,runId)=>Agent.getRun(runId,{runtime:'cloud',agentId,apiKey:process.env.CURSOR_API_KEY}));
if(!['review-returned','gate-passed'].includes(job.status))throw Error('Independent review must return before the native gate');
if(!job.ownerAgentId||!job.reviewAgentId||job.ownerAgentId===job.reviewAgentId)throw Error('Missing actual independent agent identities');
for(const name of ['identity-review','date-report','input-seal'])if(JSON.parse(fs.readFileSync(path.join(dir,name+'.json'))).reviewer?.agentId!==job.reviewAgentId)throw Error('Report does not identify the actual captured independent reviewer');
const allowedProtected=new Set([...job.artifacts.map(a=>path.join(root,a.file)),...['source','extraction','materialization','editorial'].map(n=>path.join(dir,n+'.json'))]);
for(const pin of JSON.parse(fs.readFileSync(path.join(dir,'input-seal.json'))).protectedFiles??[])if(!allowedProtected.has(pin.file))throw Error('Unregistered protected evidence: host must seal a bounded explicit input');
const guard=spawnSync(process.execPath,['scripts/check-local-disk.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,PEOPLE_REPO_ROOT:root}});if(guard.status!==0)throw Error('Resource guard failed');
if(process.env.PEOPLE_REPO_ROOT!==job.nativeRoot)throw Error('Run with PEOPLE_REPO_ROOT set to the explicitly pinned native runtime');
for(const pin of job.nativeSeals)if(digest(fs.readFileSync(path.join(job.nativeRoot,pin.file)))!==pin.sha256)throw Error('Native runtime changed');
const {prepareCombinedCuration,publishCombinedCuration}=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-combined-curation.mjs')));
// Original canonical data stays exact. No hash refresh can bless a changed original.
for(const [name,expected] of [[`data/${job.book}/${job.chapter}.json`,job.sourceSha256],[`data/people/extractions/${job.book}/${job.chapter}.json`,job.extractionSha256]]){
 const sourceFile=path.join(root,name);
 if(expected===null){if(!job.canonicalExtractionAbsent||fs.existsSync(sourceFile))throw Error('Original canonical absence changed; reconcile instead of repinning');}
 else if(!fs.existsSync(sourceFile)||digest(fs.readFileSync(sourceFile))!==expected)throw Error('Original canonical input changed; reconcile instead of repinning');
}
const {prepareChapterNativeInputs}=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-chapter-native-inputs.mjs')));
const {documentHash}=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-combined-curation-review.mjs')));
const bound=await prepareChapterNativeInputs({root,dir,job,hostAuthor:o['host-author']});
const candidate=JSON.parse(fs.readFileSync(path.join(dir,'extraction.json')));
const authors=[...new Set([...job.authors,candidate.run?.agentId,...(candidate.run?.chunks??[]).map(c=>c.agentId)].filter(Boolean))];
if(!job.beforeNative)throw Error('Missing original native before pins; host must reconcile and capture them explicitly');
const before=job.beforeNative;
let initialOwner;
if(job.canonicalExtractionAbsent){
 const ledger=readRemotePeopleWorkLedger();initialOwner=ledger.chapterOwners?.[job.book+'/'+job.chapter];
 if(!initialOwner||initialOwner.jobId!==job.id||initialOwner.worker!==job.worker||initialOwner.lane!==job.lane||initialOwner.status!=='active'||job.priorDateClaim!==null)throw Error('Initial chapter ownership or original date absence changed');
}
const {receipt,hash}=prepareCombinedCuration({root,book:job.book,chapter:job.chapter,...bound,before,priorClaim:job.priorDateClaim,claimHash:job.canonicalExtractionAbsent?documentHash(null):job.priorDateClaimHash,authorAgentIds:authors,
 ...(initialOwner?{initialOwner,initialOwnerHash:documentHash(initialOwner)}:{})});
const receiptFile=path.join(dir,'native-receipt-'+hash.slice(7,23)+'.json');
if(!fs.existsSync(receiptFile))fs.writeFileSync(receiptFile,JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
if(o.publish){const result=publishCombinedCuration(receipt,hash,{root});job.status='native-published';job.nativePublication={at:new Date().toISOString(),receipt:receiptFile,hash};writeJsonAtomic(file,job);console.log(JSON.stringify({nativePublished:true,receipt:receiptFile,hash,result,publicChapterComplete:false}));}
else{if(job.circuitBreaker){job.circuitBreakerResolution={kind:'native-approved-recording-recovery',originalBreakerHash:recordingDocumentHash(job.circuitBreaker),nativeGateHash:hash,actualReviewer:job.reviewAgentId,actualRun:job.reviewerRunId,recordingReceipts:job.recordingRecoveryHistory.map(h=>h.receipt),at:new Date().toISOString()};}job.status='gate-passed';job.nativeGate={at:new Date().toISOString(),receipt:receiptFile,hash};writeJsonAtomic(file,job);console.log(JSON.stringify({gatePassed:true,receipt:receiptFile,hash,publicChapterComplete:false}));}
