import fs from 'node:fs';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const root=process.cwd(),dir=root+'/data/people/generated/independent-identity-recovery/pairwise-english-identity-guard-20261025/v2-unihan17/candidate';
const {CHINESE_VARIANT_GROUPS:actual}=await import(pathToFileURL(dir+'/scripts/lib/people-chinese-variant-data.mjs'));
const {buildResolutionCandidates}=await import(pathToFileURL(dir+'/scripts/lib/people-resolution.mjs'));
const allowed=new Set(['kSimplifiedVariant','kTraditionalVariant','kSemanticVariant','kSpecializedSemanticVariant','kZVariant']),graph=new Map();let edges=0;
const cp=t=>String.fromCodePoint(parseInt(t.split('<')[0].slice(2),16)).normalize('NFKC');
for(const line of fs.readFileSync(dir+'/scripts/data/unihan/17.0.0/Unihan_Variants.txt','utf8').split('\n')){
 if(!line||line.startsWith('#'))continue;const [s,p,ts]=line.split('\t');if(!allowed.has(p))continue;
 const left=cp(s);for(const token of ts.split(' ')){const right=cp(token);for(const [a,b]of [[left,right],[right,left]]){if(!graph.has(a))graph.set(a,new Set());graph.get(a).add(b)}edges++}
}
const seen=new Set(),groups=[];for(const c of graph.keys()){if(seen.has(c))continue;const todo=[c],group=[];seen.add(c);for(let i=0;i<todo.length;i++){const x=todo[i];group.push(x);for(const y of graph.get(x)){if(!seen.has(y)){seen.add(y);todo.push(y)}}}if(group.length>1)groups.push(group.sort((a,b)=>a.codePointAt(0)-b.codePointAt(0)).join(''))}
groups.sort((a,b)=>a.codePointAt(0)-b.codePointAt(0));assert.deepEqual(groups,actual,'independent BFS must equal generator union-find closure');
const choices=[[],['王衍'],['王儼'],['王衍','王儼']].flatMap(names=>[false,true].map(supported=>({names,supported})));
function person(id,{names,supported}){return[id,{localId:id,preferredNameSuggestion:{en:'Shared Name'},historicity:'historical',descriptorSuggestion:'Fixture',identityHints:{nativePlaces:[],relatedLocalPeople:[],activeDateHints:[],polityHints:[]},mentions:[],promptVersion:7,claims:[...(supported?[{predicate:'name',value:{kind:'personal-name',en:'Shared Name'}}]:[]),...names.map(zh=>({predicate:'name',value:{kind:'personal-name',zh}}))]}]}
const pairs=entries=>[...new Set(buildResolutionCandidates(new Map(entries)).blocks.flatMap(b=>b.localPeople.flatMap((a,i)=>b.localPeople.slice(i+1).map(c=>[a,c].sort().join('\0')))))].sort();
let cases=0;for(const a of choices)for(const b of choices)for(const c of choices){const ps=[a,b,c],expected=[];for(let i=0;i<3;i++)for(let j=i+1;j<3;j++){const x=ps[i],y=ps[j];if(!x.supported||!y.supported||!x.names.length||!y.names.length||x.names.some(n=>y.names.includes(n)))expected.push([String(i),String(j)].join('\0'))}assert.deepEqual(pairs(ps.map((p,i)=>person(String(i),p))),expected.sort());cases++}
const four=[{names:['王衍'],supported:true},{names:['王儼'],supported:true},{names:[],supported:false},{names:['王玄'],supported:false}];
assert.deepEqual(pairs(four.map((p,i)=>person(String(i),p))),['0\0'+'2','0\0'+'3','1\0'+'2','1\0'+'3','2\0'+'3'],'both unknown comparisons survive without reopening disjoint known endpoints');
console.log(JSON.stringify({independentBfsMatchesAllVariantClasses:true,selectedRelationEdges:edges,classes:groups.length,characters:groups.reduce((n,g)=>n+[...g].length,0),pairwiseCases:cases,fourMemberTwoUnknownCase:'PASS',canonicalWrites:false}));
