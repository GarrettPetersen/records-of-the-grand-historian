#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {GrokbotReviewStore} from './lib/grokbot-review-store.mjs';
import {REPO_ROOT} from './lib/people-content.mjs';
import {inspectLocalDisk} from './check-local-disk.mjs';
import {readRemotePeopleWorkLedger} from './lib/people-work-queue.mjs';

const [command,...args]=process.argv.slice(2),options={};
for(let i=0;i<args.length;i+=2){if(!args[i]?.startsWith('--')||args[i+1]===undefined)throw Error('Expected --name value pairs');options[args[i].slice(2)]=args[i+1];}
for(const key of Object.keys(options))if(!['root','file','worker','job','output'].includes(key))throw Error('Unknown option: '+key);
if(inspectLocalDisk(REPO_ROOT).errors.length)throw Error('Host resource guard failed');
const store=new GrokbotReviewStore(options.root??path.join(REPO_ROOT,'data/people/generated/grokbot/review-jobs'));
if(command==='register'){
 if(!options.file)throw Error('register requires --file');
 const stat=fs.lstatSync(options.file);
 if(!stat.isFile()||stat.isSymbolicLink()||(stat.mode&0o077)||stat.size>256*1024)throw Error('Review registration requires an owner-only regular input at most256KiB');
 const job=JSON.parse(fs.readFileSync(options.file,'utf8')),ledger=readRemotePeopleWorkLedger();
 if(Object.values(ledger.claims).some(c=>c.worker===job.worker&&c.lane==='grokbot'&&c.status==='claimed')||Object.values(ledger.dateAudits??{}).some(c=>c.worker===job.worker&&c.status!=='ready'))throw Error('Worker has preserved sticky extraction/date work; resume it before registering a review');
 console.log(JSON.stringify(store.register(job)));
}else if(command==='export'){
 if(!options.worker||!options.job||!options.output)throw Error('export requires --worker, --job and --output');
 const job=store.read(options.worker,options.job),saved=store.savedResult(job);
 // Preserve the exact stored transport envelope; host native acceptance remains separate.
 const b=fs.readFileSync(store.resultFile(options.worker,options.job));
 if(createHash('sha256').update(b).digest('hex')!==saved.sha256)throw Error('Report changed during export');
 fs.writeFileSync(options.output,b,{flag:'wx',mode:0o600});
 console.log(JSON.stringify({...store.receipt(job,saved),output:path.resolve(options.output)}));
}else throw Error('Usage: grokbot-review-jobs.mjs register --file FILE [--root DIRECTORY] | export --worker ID --job ID --output FILE [--root DIRECTORY]');
