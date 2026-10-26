import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const out="/Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/independent-identity-recovery/pairwise-english-identity-guard-20261025/v2-unihan17",candidate=out+'/candidate',root='/Users/garrettpetersen/records-of-the-grand-historian',ref='d1d2494017426c278606f323233ee335e33b6eeb';
const H=x=>createHash('sha256').update(x).digest('hex'),read=p=>fs.readFileSync(p,'utf8'),git=p=>execFileSync('git',['show',ref+':'+p],{cwd:root,maxBuffer:16e6}).toString();
const modulePath='scripts/lib/people-resolution.mjs',testPath='scripts/test-people-resolution.mjs',baseline=git(modulePath),baseTest=git(testPath),current=read(candidate+'/'+modulePath),test=read(candidate+'/'+testPath),v1=read(out+'/../people-resolution.pairwise-prototype.mjs');
async function load(productionSource,testSource){
 const logs=[],context=vm.createContext({console:{log:(...x)=>logs.push(x.join(' '))}}),cache=new Map();
 async function dep(spec,referencer){
  const id=spec.startsWith('node:')?spec:path.resolve(path.dirname(referencer.identifier),spec);
  if(cache.has(id))return cache.get(id);
  if(spec.startsWith('node:')){const n=await import(spec),keys=Object.keys(n),m=new vm.SyntheticModule(keys,function(){for(const key of keys)this.setExport(key,n[key]);},{context,identifier:id});cache.set(id,m);return m;}
  if(!id.startsWith(candidate+'/scripts/lib/'))throw Error('Unapproved dependency '+id);
  const m=new vm.SourceTextModule(read(id),{context,identifier:id});cache.set(id,m);await m.link(dep);return m;
 }
 const production=new vm.SourceTextModule(productionSource,{context,identifier:candidate+'/'+modulePath});cache.set(production.identifier,production);await production.link(dep);await production.evaluate();
 let result;
 if(testSource){const t=new vm.SourceTextModule(testSource,{context,identifier:candidate+'/'+testPath});try{await t.link(dep);await t.evaluate();result={status:'PASS',logs};}catch(e){result={status:'FAIL',name:e.name,message:e.message};}}
 return{api:production.namespace,result};
}
const old=await load(baseline,baseTest),baseRegression=await load(baseline,test),prototypeRegression=await load(v1,test),fresh=await load(current,test);
assert.equal(old.result.status,'PASS');assert.equal(baseRegression.result.status,'FAIL');assert.match(baseRegression.result.message,/unknown English or Chinese/);assert.equal(prototypeRegression.result.status,'FAIL');assert.match(prototypeRegression.result.message,/documented Unicode variants/);assert.equal(fresh.result.status,'PASS');
const person=(id,en,zh,kind='personal-name',alias={en,zh})=>[id,{localId:id,preferredNameSuggestion:{en,...(zh?{zh}: {})},historicity:'historical',descriptorSuggestion:'Fixture',identityHints:{nativePlaces:[],relatedLocalPeople:[],activeDateHints:[],polityHints:[]},mentions:[],promptVersion:7,claims:[{id:id+':name',predicate:'name',value:{kind,...alias}}]}];
const pairs=(api,ps)=>[...new Set(api.buildResolutionCandidates(new Map(ps)).blocks.flatMap(b=>b.localPeople.flatMap((a,i)=>b.localPeople.slice(i+1).map(c=>[a,c].sort().join('\0')))))].sort();
const ps=[person('a','Wang Yan','王衍'),person('b','Wang Yan','王儼')],c=person('c','Wang Yan',null);c[1].claims=[];
const fixtures=[{name:'strong-disjoint-pair',ps},{name:'unrelated-preferred-only-C',ps:[...ps,c]},...[
 ['Han Shou','韓壽','韩寿'],['Lu Ji','陸機','陆机'],['Han Shou','韩壽','韓寿'],['Han Shou','韓夀','韩寿'],['Tai Xin','颱新','檯新'],['Huang Di','黃帝','炎帝'],
].map(([en,left,right])=>({name:left+'/'+right,ps:[person('a',en,left),person('b',en,right)]}))].map(f=>({name:f.name,baselinePairs:pairs(old.api,f.ps),unsafeV1Pairs:pairs(prototypeRegression.api,f.ps),candidatePairs:pairs(fresh.api,f.ps),candidateClusters:fresh.api.resolvePeopleClusters(new Map(f.ps),[]).clusters.map(c=>c.localPeople)}));
const generator=await import(pathToFileURL(candidate+'/scripts/generate-people-chinese-variants.mjs'));
const raw=fs.readFileSync(candidate+'/scripts/data/unihan/17.0.0/Unihan_Variants.txt');
const generated=generator.generateChineseVariantModule(raw),generatedAgain=generator.generateChineseVariantModule(raw);assert.equal(generated,generatedAgain);assert.equal(generated,read(candidate+'/scripts/lib/people-chinese-variant-data.mjs'));assert.throws(()=>generator.generateChineseVariantModule(Buffer.concat([raw,Buffer.from('\n')])),/pinned/);
const groups=(await import(pathToFileURL(candidate+'/scripts/lib/people-chinese-variant-data.mjs'))).CHINESE_VARIANT_GROUPS;
const helper=await import(pathToFileURL(candidate+'/scripts/lib/people-chinese-variants.mjs'));
assert.throws(()=>helper.chineseVariantComparisonKey('en:wang yan'),/Chinese name key/);
const span=(s,name)=>{const marker=new RegExp('^(?:export )?function '+name+'\\(','m').exec(s);assert.ok(marker);const end=s.indexOf('\n}',marker.index);assert.ok(end>marker.index);return s.slice(marker.index,end+4);};
const invariantNames=['normalizeName','localNameKeys','explicitIdentityConstraints','connectedBlockComponents','resolvePeopleClusters'];
const invariants=invariantNames.map(name=>{const before=span(baseline,name),after=span(current,name);assert.equal(before,after);return{name,sha256:H(before),byteIdentical:true};});
const canonicalKeys=['WEAK_ENGLISH_NAMES','WEAK_CHINESE_NAMES','NON_BLOCKING_NAME_KINDS','IDENTITY_NAME_KINDS'];
for(const name of canonicalKeys){const re=new RegExp('const '+name+' = new Set\\(\\[[\\s\\S]*?\\]\\);');assert.equal(baseline.match(re)?.[0],current.match(re)?.[0]);}
const ordinary=spawnSync(process.execPath,[candidate+'/'+testPath],{encoding:'utf8'});assert.equal(ordinary.status,0,ordinary.stderr);
const check=spawnSync(process.execPath,[candidate+'/scripts/generate-people-chinese-variants.mjs','--check'],{encoding:'utf8'});assert.equal(check.status,0,check.stderr);
const result={revision:ref,canonicalModuleSha256:H(baseline),candidateModuleSha256:H(current),baselineFullOrdinarySelfTest:old.result,baselineWithCombinedDurableRegressions:baseRegression.result,unsafeV1WithVariantRegressions:prototypeRegression.result,candidateFullOrdinarySelfTest:fresh.result,directNodeOrdinarySelfTest:{exitCode:ordinary.status,stdout:ordinary.stdout},productionApiFixtures:fixtures,unicodeData:{fixedRelease:'17.0.0',rawSha256:H(raw),generatedSha256:H(generated),generatedBytes:Buffer.byteLength(generated),variantClasses:groups.length,characters:groups.reduce((n,g)=>n+[...g].length,0),maximumClassSize:Math.max(...groups.map(g=>[...g].length)),selectedRelations:['kSimplifiedVariant','kTraditionalVariant','kSemanticVariant','kSpecializedSemanticVariant','kZVariant'],excludedRelations:['kSpoofingVariant'],repeatedGenerationByteIdentical:true,wrongRawHashFails:true,generatorCheckExitCode:check.status},unchangedProductionFunctions:invariants,unchangedNameKindAndWeakNameTables:canonicalKeys,source50Untouched:true,canonicalWrites:false,globalGraphRuns:0,SDKCalls:0,modelOrPaidApiCalls:0,adoption:'CANDIDATE ONLY; independent code/source-data review required before adoption; no current remaining count asserted'};
fs.writeFileSync("/Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/code-reviews/pairwise-english-unihan17-independent-peer-20261025/independent-production-proof.json",JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({file:out+'/production-proof.json',sha256:H(fs.readFileSync(out+'/production-proof.json')),candidate:H(current),data:result.unicodeData,baseline:baseRegression.result.status,v1:prototypeRegression.result.status,v2:fresh.result.status}));
