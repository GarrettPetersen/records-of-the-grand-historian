#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';
import {spawnSync} from 'node:child_process';
import {ownerDirectory,digest} from './lib/people-chapter-owner.mjs';
import {writeJsonAtomic} from './lib/people-content.mjs';
const {values:o}=parseArgs({options:{job:{type:'string'},root:{type:'string'},publish:{type:'boolean'}}});
const root=fs.realpathSync(o.root??process.cwd()),dir=ownerDirectory(root,o.job),file=path.join(dir,'job.json'),job=JSON.parse(fs.readFileSync(file));
if(!['review-returned','gate-passed'].includes(job.status))throw Error('Independent review must return before the native gate');
if(!job.ownerAgentId||!job.reviewAgentId||job.ownerAgentId===job.reviewAgentId)throw Error('Missing actual independent agent identities');
for(const name of ['identity-review','date-report','input-seal'])if(JSON.parse(fs.readFileSync(path.join(dir,name+'.json'))).reviewer?.agentId!==job.reviewAgentId)throw Error('Report does not identify the actual captured independent reviewer');
const allowedProtected=new Set([...job.artifacts.map(a=>path.join(root,a.file)),...['source','extraction','materialization','editorial'].map(n=>path.join(dir,n+'.json'))]);
for(const pin of JSON.parse(fs.readFileSync(path.join(dir,'input-seal.json'))).protectedFiles??[])if(!allowedProtected.has(pin.file))throw Error('Unregistered protected evidence: host must seal a bounded explicit input');
const guard=spawnSync(process.execPath,['scripts/check-local-disk.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,PEOPLE_REPO_ROOT:root}});if(guard.status!==0)throw Error('Resource guard failed');
if(process.env.PEOPLE_REPO_ROOT!==job.nativeRoot)throw Error('Run with PEOPLE_REPO_ROOT set to the explicitly pinned native runtime');
for(const pin of job.nativeSeals)if(digest(fs.readFileSync(path.join(job.nativeRoot,pin.file)))!==pin.sha256)throw Error('Native runtime changed');
const {inspectCombinedBefore,prepareCombinedCuration,publishCombinedCuration}=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-combined-curation.mjs')));
// Original canonical data stays exact. No hash refresh can bless a changed original.
for(const [name,expected] of [[`data/${job.book}/${job.chapter}.json`,job.sourceSha256],[`data/people/extractions/${job.book}/${job.chapter}.json`,job.extractionSha256]])if(digest(fs.readFileSync(path.join(root,name)))!==expected)throw Error('Original canonical input changed; reconcile instead of repinning');
const materialized=path.join(dir,'materialized'),review=path.join(dir,'review');
const link=(from,to)=>{fs.mkdirSync(path.dirname(to),{recursive:true});if(fs.existsSync(to)){if(digest(fs.readFileSync(from))!==digest(fs.readFileSync(to)))throw Error('Prepared gate input changed; preserve the prior receipt and reconcile');}else fs.linkSync(from,to);};
for(const [from,to] of [['source',`data/${job.book}/${job.chapter}`],['extraction','candidate'],['editorial','editorial-decisions'],['materialization','validation']])link(path.join(dir,from+'.json'),path.join(materialized,to+'.json'));
for(const [from,to] of [['identity-review','identity-review'],['date-report','date-report'],['review-validation','validation'],['input-seal','input-seal']])link(path.join(dir,from+'.json'),path.join(review,to+'.json'));
const candidate=JSON.parse(fs.readFileSync(path.join(dir,'extraction.json')));
const authors=[...new Set([...job.authors,candidate.run?.agentId,...(candidate.run?.chunks??[]).map(c=>c.agentId)].filter(Boolean))];
if(!job.beforeNative)throw Error('Missing original native before pins; host must reconcile and capture them explicitly');
const before=job.beforeNative;
const {receipt,hash}=prepareCombinedCuration({root,book:job.book,chapter:job.chapter,materializedDir:materialized,reviewDir:review,before,priorClaim:job.priorDateClaim,claimHash:job.priorDateClaimHash,authorAgentIds:authors});
const receiptFile=path.join(dir,'native-receipt-'+hash.slice(7,23)+'.json');
if(!fs.existsSync(receiptFile))fs.writeFileSync(receiptFile,JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
if(o.publish){const result=publishCombinedCuration(receipt,hash,{root});job.status='native-published';job.nativePublication={at:new Date().toISOString(),receipt:receiptFile,hash};writeJsonAtomic(file,job);console.log(JSON.stringify({nativePublished:true,receipt:receiptFile,hash,result,publicChapterComplete:false}));}
else{job.status='gate-passed';job.nativeGate={at:new Date().toISOString(),receipt:receiptFile,hash};writeJsonAtomic(file,job);console.log(JSON.stringify({gatePassed:true,receipt:receiptFile,hash,publicChapterComplete:false}));}
