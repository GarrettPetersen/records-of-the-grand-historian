import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
process.env.PEOPLE_REPO_ROOT='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
const {validateResolutionDocument}=await import(runtime+'/scripts/sdk-people-resolve.mjs');
const {resolvePeopleClusters}=await import(runtime+'/scripts/lib/people-resolution.mjs');
const dir=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const read=f=>JSON.parse(fs.readFileSync(path.resolve(dir,f),'utf8'));
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const hashFile=f=>sha(fs.readFileSync(f));
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
const manifest=read('sealed-manifest.json'),context=read('host-context.json'),handoff=read('host-handoff.json');
assert.equal(hashFile(dir+'/sealed-manifest.json'),'baae93fc8ba8a06f095137b531fe5c09a6ea4dfd920908b2627b22bd4af52432');
assert.equal(hashFile(dir+'/../HOST_REVIEW_PROTOCOL.md'),'7de78092e3da0da3cef2c1ca18ed2ca234fda210d4cdbd7fbaf2e9b2b6dfa91b');
for(const f of manifest.files){assert.equal(hashFile(dir+'/'+f.file),f.sha256);assert.equal(fs.statSync(dir+'/'+f.file).size,f.bytes);}
assert.equal(hashFile(dir+'/../selected-registry.json'),manifest.registry.sha256);
const registry=read('../selected-registry.json');
const materialize=id=>{const x=structuredClone(registry.people[id]);x.sourcePins=registry.chapterPins[x.chapterPinRef];delete x.chapterPinRef;x.sourceUnits=x.sourceUnitRefs.map(ref=>registry.units[ref]);delete x.sourceUnitRefs;return x;};
const selectedIds=[...context.ownedPeople,...context.priorOnlyPeople];
const selected=Object.fromEntries(selectedIds.map(id=>[id,materialize(id)]));
const prior=context.priorConstraintDocuments.map(x=>x.document);
const expectedPrior=registry.priorConstraintDocuments.map(x=>({...x,document:{...x.document,decisions:x.document.decisions.filter(d=>d.localPeople.some(id=>context.ownedPeople.includes(id)))}})).filter(x=>x.document.decisions.length);
assert.equal(stable(expectedPrior),stable(context.priorConstraintDocuments));
for(const doc of prior)for(const d of doc.decisions)for(const id of d.localPeople)assert(selected[id],id);
const localPeople=new Map(Object.entries(selected).map(([id,x])=>[id,{...x.record,claims:x.claims,mentions:x.mentions,nameKeys:x.aliasesAndNameKeys}]));
const baseline=resolvePeopleClusters(localPeople,prior);
const ownedSet=new Set();let joinedOccurrences=0;
const packets=manifest.packetIndex.map(pi=>{const p=read(pi.file);assert(fs.statSync(dir+'/'+pi.file).size<=p.ceilings.bytes);assert(p.scope.reviewPairs.length<=p.ceilings.maxComparisons);
 const endpointIds=new Set(p.scope.reviewPairs.flat());
 const members=registry.completeEndpointClusters.filter(x=>endpointIds.has(x.canonicalPersonId)).flatMap(x=>x.localPeople.map(id=>({localId:id,canonicalPersonId:x.canonicalPersonId})));
 assert.equal(stable(members.sort((a,b)=>a.localId.localeCompare(b.localId))),stable([...p.scope.completeEndpointMembers].sort((a,b)=>a.localId.localeCompare(b.localId))));
 for(const x of p.people){const joined=structuredClone(x);delete joined.mentionCount;joined.mentions=selected[x.localId].mentions;assert.equal(stable(joined),stable(selected[x.localId]));ownedSet.add(x.localId);joinedOccurrences++;}
 return p;});
assert.equal(ownedSet.size,122);
// Verify exact canonical source/extraction bytes, deduplicated by path.
const pins=new Map(Object.values(selected).flatMap(x=>[[x.sourcePins.sourcePath,x.sourcePins.sourceRawSha256],[x.sourcePins.extractionPath,x.sourcePins.extractionRawSha256]]));
for(const [file,h]of pins)assert.equal(sha(execFileSync('git',['show',manifest.canonicalRevision+':'+file],{maxBuffer:20*1024*1024})),h,file);
const emperorMergeReasons={
'jinshu:020:p188':'The Jin ritual discussion cites 武皇帝詔 on rulers and princes visiting tombs; it is the founding Jin emperor’s edict, not a new emperor in the later discussion.',
'jinshu:020:p293':'武帝 decides the posthumous name of 奕 in the Taikang court discussion, placing the ruler in Sima Yan’s Jin court.',
'jinshu:028:p071':'武帝泰始七年 and the contemporary He Zeng / Wang Kai court setting identify Sima Yan.',
'jinshu:028:p151':'The omen gloss ties 武帝’s taboo to 雨火 and the empress’s personal name 蘭, identifying Sima Yan and Yang Yan.',
'jinshu:037:p187':'武帝受禪 and the enfeoffment of the Prince of Longxi identify the founding Jin ruler Sima Yan.',
'jinshu:037:p297':'武帝受禪 and the enfeoffment of the Prince of Jinan identify the founding Jin ruler Sima Yan.',
'jinshu:037:p326':'武帝受禪 and the enfeoffment of the Prince of Qiao identify the founding Jin ruler Sima Yan.',
'jinshu:037:p444':'武帝受禪 and the enfeoffment of the Prince of Zhongshan identify the founding Jin ruler Sima Yan.',
'jinshu:094:p046':'武帝踐阼，泰始中 directly locates the accession of Sima Yan.',
'jiutangshu:084:p089':'The retrospective 晉武 and his toleration of Liu Yi identify the Jin emperor Sima Yan.'};
const wangMergeReasons={
'jinshu:003:p295':'Jin 王戎 is the 建威將軍 in the conquest of Wu; the same named commander receives the Anfeng enfeoffment in the connected annals.',
'jinshu:003:p320':'王戎安豐侯 supplies the Anfeng title, also attached to the Jin 司徒王戎 whose tutor appointment matches the target.',
'jinshu:004:p008':'The exact appointment triad 何劭太師、王戎太傅、楊濟太保 matches Jinshu053:s0202, then traces Rong to 尚書右僕射.',
'jinshu:004:p064':'尚書右僕射王戎 becomes 司徒, continuing the documented tutor-to-vice-director office sequence.',
'jinshu:004:p222':'司徒王戎 and 侍中、司徒、安豐侯王戎 connect the same court official and Anfeng title across the Hui court.',
'jinshu:035:p127':'Pei Kai and Wang Rong are named together in youth, and the later Wang Rong in 尚書 with Zhang Hua matches the tutor’s court cohort and subsequent office.',
'jinshu:047:p089':'僕射王戎兼吏部 matches the Jin tutor’s recorded ministries and vice-directorship; Fu Xian’s impeachment belongs to that same court.',
'jinshu:047:p121':'王戎 praises Fu Zhi while Zhao prince Lun governs, continuing the tutor’s named Western Jin court circle.',
'jinshu:052:p085':'司徒王戎 aiding Tan in 永甯初 matches the tutor’s later 司徒 office and Hui-court chronology.',
'jinshu:089:p021':'王戎 knows Ji Shao’s father and comments on Ji Shao’s arrival at Luoyang, the Wei-Jin peer of Pei Kai documented in Jinshu035.',
'jinshu:037:p288':'司徒戎 in the Jin praise is the same named Jin 司徒王戎 linked by the annalistic office sequence to the crown prince’s tutor.',
'sanguozhi:010:p225':'王戎 is famous in youth beside 裴楷, matching Jinshu035’s 少與王戎齊名 and locating the same Wei-Jin peer.',
'songshu:059:p123':'王戎把臂入林 with a 專征 commission retrospectively identifies the Jin Wang Rong associated with the Wu campaign, not a contemporary Song official.',
'zizhitongjian:083:p090':'司徒王戎 is dismissed among 張、裴’s associates, matching the Western Jin tutor’s later office and court cohort.'};
const docs=[],judgments=[];
for(let i=0;i<packets.length;i++){
 const p=packets[i],target=p.people.find(x=>x.currentCanonicalPersonId===p.scope.starRootCanonicalPersonId),others=p.people.filter(x=>x!==target),reasons=i===0?emperorMergeReasons:wangMergeReasons;
 const decisions=[],mergers=[];
 for(const x of others){
  let outcome,reason;
  if(reasons[x.localId]){outcome='merge';reason=reasons[x.localId];mergers.push(x.localId);}
  else if(x.localId==='jinshu:035:p164'){outcome='possible-same-as';reason='綏父戎 identifies a father of Wang Sui; the other cited unit is a comparison of eight Wangs. Neither establishes that this father is the crown prince’s tutor. Preserve the possible relationship without conflating a same-name or textually problematic father reference.';}
  else {outcome='keep-separate';reason=i===0?'The cited historical episode belongs to a different ruler from Jinshu053’s Western Jin 武帝, grandfather and patron of Sima Yu.':'The cited Chinese name and historical setting identify a person distinct from the Western Jin 王戎 appointed tutor alongside He Shao and Yang Ji.';}
  const evidence=x.sourceUnits.map(u=>`${x.localId.split(':').slice(0,2).join(':')}:${u.id}「${u.zh}」`);
  const basis=[reason,...evidence];
  if(outcome!=='merge')decisions.push({decision:outcome,localPeople:[target.localId,x.localId],basis,confidence:outcome==='possible-same-as'?'low':'high'});
  judgments.push({packet:manifest.packetIndex[i].file,pair:[target.currentCanonicalPersonId,x.currentCanonicalPersonId].sort(),target:target.localId,other:x.localId,outcome,basis});
 }
 if(mergers.length)decisions.unshift({decision:'merge',localPeople:[target.localId,...mergers],basis:[i===0?'Jinshu053 武帝 is Sima Yu’s grandfather and the founding Western Jin emperor. The accession, Taishi, Jin enfeoffments and explicit 晉武 episodes below identify that same Sima Yan.':'Jinshu053:s0202 identifies Wang Rong in the precise tutor triad. Jinshu004 repeats that triad and traces his offices; the following connected names, offices, title and peer episodes identify the same Jin statesman.',...mergers.map(id=>`${id}: ${reasons[id]}`)],confidence:'high'});
 docs.push({schemaVersion:1,batch:handoff.batches[i].batch,authority:'model',decisions});
}
assert.equal(judgments.length,120);assert.equal(new Set(judgments.map(x=>x.pair.join('|'))).size,120);
for(let i=0;i<docs.length;i++){
 const p=packets[i];const people=Object.fromEntries(p.people.map(x=>[x.localId,{...x,nameKeys:x.aliasesAndNameKeys}]));
 const dossier={batch:docs[i].batch,document:{people,targetLocalPeople:p.people.filter(x=>x.currentCanonicalPersonId===p.scope.starRootCanonicalPersonId).map(x=>x.localId),blocks:[{component:'sealed-cohort003-part'+i,localPeople:Object.keys(people),reviewPairs:p.scope.reviewPairs}]}};
 validateResolutionDocument(docs[i],dossier,{localPeople},prior,docs.filter((_,j)=>j!==i));
}
const union=resolvePeopleClusters(localPeople,[...prior,...docs]);
for(const j of judgments){const [a,b]=[j.target,j.other].map(id=>union.clusters.find(c=>c.localPeople.includes(id)).canonicalPersonId);if(j.outcome==='merge')assert.equal(a,b);else assert.notEqual(a,b);}
const write=(f,x)=>fs.writeFileSync(dir+'/author/'+f,JSON.stringify(x,null,2)+'\n');
const files=docs.map((d,i)=>{const file=`resolution-part-${String(i+1).padStart(3,'0')}.json`;write(file,d);return {file,batch:d.batch,bytes:fs.statSync(dir+'/author/'+file).size,sha256:hashFile(dir+'/author/'+file)};});
write('judgments.json',{schemaVersion:1,canonicalRevision:manifest.canonicalRevision,sourceJudgments:judgments});
write('structural-proof.json',{schemaVersion:1,status:'bounded source-author structural proof; not independent approval, global CI or publication',runtime,command:'node '+path.relative(process.cwd(),dir+'/author/prepare.mjs'),selectedRecords:selectedIds.length,ownedRecords:ownedSet.size,joinedPacketRecordOccurrences:joinedOccurrences,priorDocuments:prior.length,sourceAndExtractionPinsVerified:pins.size,baselineClusters:baseline.clusters.length,unionClusters:union.clusters.length,validatedDocuments:files,verified:{sealedHashes:true,packetCaps:true,exactRegistryJoins:true,completeCanonicalEndpointMemberships:true,completePriorConstraints:true,exactBaselineGitPins:true,all120Outcomes:true,exportedDocumentValidationWithAllOtherNewDocuments:true,exportedUnionResolution:true,mutatingFiltersUsed:false}});
const counts=Object.fromEntries(['merge','keep-separate','possible-same-as'].map(k=>[k,judgments.filter(j=>j.outcome===k).length]));
write('manifest.json',{schemaVersion:1,canonicalRevision:manifest.canonicalRevision,sealedManifestSha256:handoff.sealedManifestSha256,registrySha256:handoff.registrySha256,documents:files,outcomeCounts:counts,sourceCoverage:{ownedPeople:context.ownedPeople,priorOnlyPeople:context.priorOnlyPeople,allOwnedClaimsAndChineseRead:true,sourceUnits:new Set(Object.values(selected).filter(x=>ownedSet.has(x.localId)).flatMap(x=>x.sourceUnits.map(u=>x.localId.split(':').slice(0,2).join(':')+':'+u.id))).size,ownedClaims:Object.values(selected).filter(x=>ownedSet.has(x.localId)).reduce((n,x)=>n+x.claims.length,0)},receipts:['judgments.json','structural-proof.json','source-supplement.json','prepare.mjs'].map(file=>({file,sha256:hashFile(dir+'/author/'+file),bytes:fs.statSync(dir+'/author/'+file).size})),limitations:['Independent source review pending. Host aggregate validation, global CI and publication remain host-owned.','Extracted Western-year metadata is not independently date-approved here; identity judgments rely on the cited Chinese rather than unverified Western-year metadata.','Jinshu035:p164 father-of-Wang-Sui wording needs source research; possible-same-as preserves uncertainty.'],usage:'Native Codex token/cost usage unavailable'});
console.log(JSON.stringify({files,counts,manifestSha256:hashFile(dir+'/author/manifest.json'),proofSha256:hashFile(dir+'/author/structural-proof.json'),judgmentsSha256:hashFile(dir+'/author/judgments.json')}));
