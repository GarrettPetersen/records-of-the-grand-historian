import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root='/Users/garrettpetersen/records-of-the-grand-historian',ref='000d85cb53ca03bc88bf7399223587aee30e1892';
const dir=new URL('.',import.meta.url),pins=JSON.parse(fs.readFileSync(new URL('source-pins.json',dir)));
const hash=s=>createHash('sha256').update(s).digest('hex');
const src=execFileSync('git',['-C',root,'show',ref+':scripts/compile-people-catalog.mjs'],{encoding:'utf8'}),draft=fs.readFileSync(new URL('compile-people-catalog.draft.mjs',dir),'utf8');
assert.equal(hash(src),pins.sha256);assert.equal(hash(draft),pins.draftSha256);
const graph=JSON.parse(fs.readFileSync(root+'/data/people/generated/independent-identity-recovery/jinshu053-source106-7b6e4f-20261025/input-pin-manifest.json'));
const runtime=graph.runtime+'/scripts/lib/people-resolution.mjs',code=execFileSync('git',['-C',root,'show',ref+':scripts/lib/people-resolution.mjs']);
assert.equal(hash(fs.readFileSync(runtime)),hash(code));
const {resolvePeopleClusters,buildResolutionCandidates}=await import(runtime);
async function pure(source){const span=source.slice(source.indexOf('export function unresolvedCandidateState('),source.indexOf('export function compilePeopleCatalog('));assert(span.startsWith('export function'));return import('data:text/javascript;base64,'+Buffer.from('const identityPairKey=(a,b)=>[a,b].sort().join("\\u0000");\n'+span).toString('base64'))}
const before=await pure(src),after=await pure(draft);
function p(id,name){return[id,{localId:id,claims:[{predicate:'name',value:{kind:'personal-name',en:name,zh:name}}],preferredNameSuggestion:{en:name,zh:name},identityHints:{nativePlaces:[],relatedLocalPeople:[],activeDateHints:[],polityHints:[]},mentions:[],promptVersion:7}]}
const people=new Map([p('a:001:p001','王甲'),p('a:002:p001','仲達'),p('b:001:p001','王甲'),p('c:001:p001','王甲')]);
const doc=(decision,ids)=>({schemaVersion:1,batch:decision,authority:'model',decisions:[{decision,localPeople:ids,basis:['fixture'],confidence:'high'}]});
function run(api,documents){const resolved=resolvePeopleClusters(people,documents),map=new Map(resolved.clusters.flatMap(c=>c.localPeople.map(id=>[id,c.canonicalPersonId]))),candidates=buildResolutionCandidates(people);return{...api.unresolvedCandidateState(candidates,map,resolved.keepSeparate,resolved.possibleSameAs),map}}
const merges=[doc('merge',['a:001:p001','a:002:p001'])],separation=doc('keep-separate',['a:002:p001','b:001:p001']);
const key=p=>[...p].sort().join('\0'),has=(r,a,b)=>r.blocks.some(block=>block.reviewPairs.some(pair=>key(pair)===key([r.map.get(a),r.map.get(b)])));
const old=run(before,[...merges,separation]),fixed=run(after,[...merges,separation]);
assert(has(old,'a:001:p001','b:001:p001'),'Actual production bug must reproduce');
assert(!has(fixed,'a:001:p001','b:001:p001'),'Merged alias outside the name block closes the canonical pair');
assert(has(fixed,'a:001:p001','c:001:p001'),'An unresolved third person stays open');
assert(has(fixed,'b:001:p001','c:001:p001'),'Separation is not transitive');
assert(has(run(after,merges),'a:001:p001','b:001:p001'),'Without a prior decision the pair stays open');
assert(!has(run(after,[...merges,doc('possible-same-as',['a:002:p001','b:001:p001'])]),'a:001:p001','b:001:p001'),'Canonical possible-same-as remains closed');
assert(!has(run(after,[...merges,doc('keep-separate',['a:001:p001','b:001:p001'])]),'a:001:p001','b:001:p001'),'Direct separation remains closed');
assert.throws(()=>after.unresolvedCandidateState({blocks:[]},new Map(),new Set(['missing\0other'])),/unknown local person/);
console.log(JSON.stringify({actualProductionBugReproduced:true,draftRegressionAssertions:8,productionResolverHash:hash(code),base:ref,canonicalWrites:false}));
