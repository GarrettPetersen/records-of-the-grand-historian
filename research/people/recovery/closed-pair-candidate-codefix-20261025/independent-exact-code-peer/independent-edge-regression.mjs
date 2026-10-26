import assert from 'node:assert/strict';import fs from 'node:fs';import {execFileSync} from 'node:child_process';
try {
const root=process.cwd(),dir=root+'/data/people/generated/independent-identity-recovery/closed-pair-candidate-probe-20261025',ref='000d85cb53ca03bc88bf7399223587aee30e1892';
const code=fs.readFileSync(dir+'/compile-people-catalog.draft.mjs','utf8'),span=code.slice(code.indexOf('export function unresolvedCandidateState('),code.indexOf('export function compilePeopleCatalog('));
const {unresolvedCandidateState:state}=await import('data:text/javascript;base64,'+Buffer.from('const identityPairKey=(a,b)=>[a,b].sort().join("\\u0000");\n'+span).toString('base64'));
const resolver=execFileSync('git',['show',ref+':scripts/lib/people-resolution.mjs'],{encoding:'utf8'});const {resolvePeopleClusters,buildResolutionCandidates}=await import('data:text/javascript;base64,'+Buffer.from(resolver).toString('base64'));
const id=['x:001:p001','x:002:p001','x:003:p001','x:004:p001'];const person=(i,name)=>[i,{localId:i,claims:[{predicate:'name',value:{kind:'personal-name',zh:name,en:name}}],preferredNameSuggestion:{zh:name,en:name},identityHints:{nativePlaces:[],relatedLocalPeople:[],activeDateHints:[],polityHints:[]},mentions:[],promptVersion:7}];
const people=()=>new Map([person(id[0],'王甲'),person(id[1],'仲達'),person(id[2],'王甲'),person(id[3],'明德')]);
const doc=(authority,decision,localPeople)=>({schemaVersion:1,batch:authority+decision,authority,decisions:[{decision,localPeople,basis:['fixture'],confidence:'high'}]});
function run(p,docs){const r=resolvePeopleClusters(p,docs),map=new Map(r.clusters.flatMap(c=>c.localPeople.map(id=>[id,c.canonicalPersonId])));return state(buildResolutionCandidates(p),map,r.keepSeparate,r.possibleSameAs)}
let p=people();p.get(id[1]).claims.push({predicate:'different-person',value:{personId:id[3]},certainty:'explicit'});assert.equal(run(p,[doc('model','merge',id.slice(0,2)),doc('model','merge',id.slice(2))]).blocks.length,0);
p=people();assert.equal(run(p,[doc('model','merge',id.slice(0,2)),doc('model','merge',id.slice(2)),doc('curated','keep-separate',[id[1],id[3]])]).blocks.length,0);
p=people();assert.equal(run(p,[doc('model','keep-separate',[id[0],id[2]]),doc('curated','merge',[id[0],id[2]])]).blocks.length,0);
assert.throws(()=>state({blocks:[]},new Map([[id[0],'canonical']]),new Set([id[0]+'\0absent'])),/unknown local person/);
assert.throws(()=>state({blocks:[]},new Map(id.map((v,i)=>[v,String(i)])),new Set([id.join('\0')])),/unknown local person/);
console.log(JSON.stringify({independentAdditionalAssertions:5,explicitDifferentThroughBothOffBlockAliases:true,curatedSeparation:true,curatedOverride:true,missingOwnerFailsBeforeEmptyBlockScan:true,malformedConstraintFails:true,base:ref,noProductionWrites:true}));
} catch(error) { console.error(error.message);process.exit(1); }
