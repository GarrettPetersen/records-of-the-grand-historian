import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readValidatedCorpusCache} from '../identity-wu-f85-20261029/cache-reader.mjs';
import * as producer from '../identity-wu-f85-20261029/runtime.mjs';
import {ROOT,REF,load,read,has} from './runtime.mjs';
const OLD=ROOT+'/data/people/generated/completion/jinshu/053/identity-wu-f85-20261029';
const KIND=ROOT+'/data/people/generated/completion/jinshu/053/temple-kind-58b-20261029';
const hash=b=>createHash('sha256').update(b).digest('hex');
const need=(v,m)=>{if(!v)throw Error(m)};
export async function loadCurrentCorpus(){
 const allowed=['data/people/extractions/jinshu/020.json','data/people/extractions/jinshu/086.json','data/people/extractions/jiutangshu/029.json','data/people/resolutions/jinshu053-wu-source-reviewed-20261029.json','data/people/resolutions/jinshu053-wangrong-source-reviewed-20261029.json','data/people/resolutions/jinshu053-wangyan-source-reviewed-20261029.json','scripts/grokbot-headless-dispatch.mjs','scripts/grokbot-mcp-client.mjs','scripts/grokbot-mcp-server.mjs','scripts/grokbot-review-jobs.mjs','scripts/lib/grokbot-dispatch-work.mjs','scripts/lib/grokbot-mcp-bridge.mjs','scripts/lib/grokbot-review-store.mjs','scripts/test-grokbot-dispatch-work.mjs','scripts/test-grokbot-headless-dispatch.mjs','scripts/test-grokbot-review-store.mjs'].sort();
 const changed=execFileSync('git',['diff','--name-only',producer.REF,REF,'--','data','scripts'],{cwd:ROOT,encoding:'utf8'}).trim().split('\n').filter(Boolean).sort();
 need(JSON.stringify(changed)===JSON.stringify(allowed),'Unvalidated source/code drift from corpus cache');
 const oldPackage=JSON.parse(execFileSync('git',['show',producer.REF+':package.json'],{cwd:ROOT})),currentPackage=read('package.json');for(const key of ['dependencies','devDependencies','engines'])need(JSON.stringify(oldPackage[key])===JSON.stringify(currentPackage[key]),'Package validation dependency drift');
 need(JSON.parse(fs.readFileSync(OLD+'/cache-reader-tests.json')).passed,'Cache-reader tests unproven');
 const cached=await readValidatedCorpusCache({dir:OLD,revision:producer.REF,treeInventorySha256:producer.treeInventorySha256,runtimeSha256:hash(fs.readFileSync(OLD+'/runtime.mjs')),captureSha256:hash(fs.readFileSync(OLD+'/capture-cache.mjs')),expectedPeople:258210,expectedExtractions:2050});
 const corpus=cached.corpus,builder=await load('scripts/build-people-extraction-packet.mjs'),matcher=(await load('scripts/lib/people-candidates.mjs')).loadProperNounMatcher(),validator=await load('scripts/validate-people-extraction.mjs'),editorial=await load('scripts/lib/people-editorial-decisions.mjs');
 const curation=JSON.parse(fs.readFileSync(KIND+'/review-packet.json')),fresh=[];
 for(const[book,chapter]of[['jinshu','020'],['jinshu','086'],['jiutangshu','029']]){
  const file=`data/people/extractions/${book}/${chapter}.json`,bytes=execFileSync('git',['show',REF+':'+file],{cwd:ROOT,maxBuffer:16*1024*1024});
  need(hash(bytes)===curation.pins[file].afterSha256,'Committed name-kind correction differs from independently reviewed bytes');
  const packet=builder.buildPeopleExtractionPacket(book,chapter,{properNounMatcher:matcher}),result=validator.validateCompactPeopleExtraction(read(file),packet),x=result.normalized;
  const editorialFile=`data/people/editorial-decisions/${book}/${chapter}.json`;
  if(has(editorialFile))editorial.validateAppliedEditorialDecisions(read(editorialFile),x);
  const prior=new Set([...corpus.localPeople].filter(([,p])=>p.book===book&&p.chapter===chapter).map(([id])=>id));
  need(prior.size===x.people.length&&x.people.every(p=>prior.has(p.localId)),'Changed extraction roster');
  for(const p of x.people)corpus.localPeople.set(p.localId,{...p,book,chapter,promptVersion:x.run.promptVersion,claims:x.claims.filter(c=>c.subject===p.localId),mentions:x.mentions.filter(m=>m.person===p.localId)});
  fresh.push({book,chapter,sha256:hash(bytes),stats:result.stats});
 }
 const reader=await load('scripts/lib/people-corpus.mjs'),docs=reader.loadValidatedResolutionDocuments(corpus.localPeople);
 need(docs.length===305,'Existing resolution document drift');
 return {corpus,docs,receipt:{cache:cached.receipt,currentRevision:REF,exactDeltaFiles:changed,scopedFreshValidation:fresh,existingWholeResolutionDocuments:docs.length}};
}
