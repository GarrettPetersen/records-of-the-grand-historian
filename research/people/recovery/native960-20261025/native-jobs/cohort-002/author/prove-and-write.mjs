import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import cp from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const out=path.dirname(fileURLToPath(import.meta.url)),dir=path.dirname(out),root=path.dirname(dir);
const read=f=>JSON.parse(fs.readFileSync(f));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const canon=x=>x&&typeof x==='object'?(Array.isArray(x)?'['+x.map(canon).join(',')+']':'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canon(x[k])).join(',')+'}'):JSON.stringify(x);
const write=(f,x)=>fs.writeFileSync(path.join(out,f),JSON.stringify(x,null,2)+'\n');
const sha=f=>hash(fs.readFileSync(f));
assert.equal(sha(root+'/HOST_REVIEW_PROTOCOL.md'),'7de78092e3da0da3cef2c1ca18ed2ca234fda210d4cdbd7fbaf2e9b2b6dfa91b');
assert.equal(sha(dir+'/sealed-manifest.json'),'bff10930261fdf02020e198277594814cfe364075283d20a9ca39214dd422666');
const seal=read(dir+'/sealed-manifest.json'), handoff=read(dir+'/host-handoff.json'), context=read(dir+'/host-context.json');
assert.equal(sha(root+'/selected-registry.json'),seal.registry.sha256);
for(const f of seal.files){assert.equal(sha(dir+'/'+f.file),f.sha256);assert.equal(fs.statSync(dir+'/'+f.file).size,f.bytes)}
const reg=read(root+'/selected-registry.json');
const materialize=id=>{let x=structuredClone(reg.people[id]);x.sourcePins=reg.chapterPins[x.chapterPinRef];x.sourceUnits=x.sourceUnitRefs.map(k=>reg.units[k]);delete x.chapterPinRef;delete x.sourceUnitRefs;return x};
const packets=handoff.batches.map(b=>({batch:b.batch,file:b.packet,packet:read(dir+'/'+b.packet)}));
const owned=new Map();
for(const {packet:p}of packets){assert.ok(fs.statSync(dir+'/'+handoff.batches.find(b=>b.packet==='part-'+String(packets.findIndex(x=>x.packet===p)+1).padStart(3,'0')+'.json')?.packet).size<=p.ceilings.bytes);assert.ok(p.scope.reviewPairs.length<=p.ceilings.maxComparisons);for(let x of p.people){let restored=structuredClone(x);assert.equal(restored.mentionCount,reg.people[x.localId].mentions.length);delete restored.mentionCount;restored.mentions=reg.people[x.localId].mentions;assert.equal(canon(restored),canon(materialize(x.localId)));owned.set(x.localId,x)}}
assert.equal(owned.size,148);
const allIds=[...new Set([...context.ownedPeople,...context.priorOnlyPeople])];assert.equal(allIds.length,319);
const relevant=reg.priorConstraintDocuments.map(x=>({...x,document:{...x.document,decisions:x.document.decisions.filter(d=>d.localPeople.some(id=>owned.has(id)))}})).filter(x=>x.document.decisions.length);
assert.equal(canon(context.priorConstraintDocuments),canon(relevant));
const chapterIds=[...new Set(allIds.map(id=>reg.people[id].chapterPinRef))];let checkedBlobs=0;
for(const id of chapterIds){const p=reg.chapterPins[id];for(const [kind,f]of [['source',p.sourcePath],['extraction',p.extractionPath]]){let b=cp.execFileSync('git',['show',reg.canonicalRevision+':'+f],{maxBuffer:30*1024*1024});assert.equal(hash(b),p[kind+'RawSha256'],f);checkedBlobs++;if(kind==='source'){let obj=JSON.parse(b);let units=new Map(obj.content.flatMap(b=>b.sentences??[]).map(s=>[s.id,s.zh]));for(const pid of allIds.filter(k=>reg.people[k].chapterPinRef===id))for(const ref of reg.people[pid].sourceUnitRefs)assert.equal(units.get(reg.units[ref].id),reg.units[ref].zh,ref)}}}
const otherYi=new Set(['jinshu:004:p040','jinshu:004:p106','jinshu:004:p253','jinshu:013:p355','jinshu:037:p084','jinshu:037:p135','jinshu:037:p452','jinshu:071:p008','jinshu:089:p051','jinshu:089:p072','jinshu:089:p101','jinshu:089:p119','jinshu:090:p081','weishu:001:p162','weishu:042:p106','zhoushu:049:p052','zizhitongjian:169:p286','jinshu:037:p060','jinshu:037:p080','jinshu:037:p090','jinshu:037:p368','jinshu:063:p004']);
const tangXuan=new Set(['jiutangshu:029:p033','jiutangshu:029:p060']);
const reasons={
'jinshu:037:p084':'弈 is Sima Wang’s son and Qi’s father; not the older dynastic ancestor 懿.',
'jinshu:037:p135':'翼, courtesy 子世, younger brother of 輔 and 邕, died before 武帝受禪; distinct from 懿, courtesy 仲達.',
'jinshu:037:p452':'毅 is the grandson succeeding after 蔚 and was lost to 石勒 in 永嘉; distinct from the Cao Wei regent.',
'weishu:001:p162':'弈 succeeds 司馬千齡 and is deposed by 桓溫 as 海西公; this Eastern Jin ruler is not 懿.',
'weishu:042:p106':'裔, courtesy 承業, inherits ancestral rank under 世宗; this specific spelling and genealogy distinguish him from 懿.',
'zhoushu:049:p052':'裔 campaigns under 陸騰 in 天和元年 and captures 冉三公; a Northern Zhou commander, not the Cao Wei regent.',
'zizhitongjian:169:p286':'裔 serves 陸騰 and is made 信州刺史; the Northern Zhou episode distinguishes him from 懿.',
'jinshu:037:p060':'翼 is listed among the nine sons of 孚; this is the nephew-generation 翼, not 懿.',
'jinshu:037:p080':'弈 appears among Sima Wang’s four sons, not as the older 懿.',
'jinshu:037:p090':'遺 is 洪’s uncle and adoptive father, 昌武亭侯; distinct from the dynastic ancestor 懿.',
'jinshu:037:p368':'海西 is deposed when 簡文帝登阼 and 桓溫 acts; a later Eastern Jin ruler, not 懿.',
'jiutangshu:029:p033':'The 宣皇帝 tablet is moved on 高宗’s enshrinement under 唐文明; this Tang ancestral tablet is not Jin 宣帝.',
'jiutangshu:029:p060':'The owned mention at s0114 is the Tang ancestral 宣 alongside 光 above 太祖; Jin 宣 at s0107 is an erroneous extra claim citation, not an owned mention.'
};
function judgement(x,part){const id=x.localId;
 if(part<3){if(otherYi.has(id))return ['keep-separate',reasons[id]??'長沙王乂 belongs to the later conflicts involving 穎/顒/張方; the distinct given name 乂 and princely career exclude 懿.'];if(tangXuan.has(id))return ['keep-separate',reasons[id]];
 if(id==='beishi:070:p275')return ['keep-separate','宣帝 succeeds in the Northern Zhou narrative of 劉行本 and his remonstrance, not the Jin ancestor serving Cao Wei.'];
 if(id.startsWith('houhanshu:')||id.startsWith('zizhitongjian:027:')||id==='songshi:340:p176'||id==='mingshi:311:p232')return ['keep-separate','The Han 孝宣/宣帝 precedent or Han administrative/classical episode identifies Western Han Xuandi, distinct from the Cao Wei regent and Jin ancestor 懿.'];
 return ['merge','The Chinese identifies Jin 宣帝 / 司馬懿 / 司馬宣王 in the Wei-regency, campaigns, specific Sima genealogy, or explicit retrospective Jin ancestral context; these bridge to the target Jin dynastic ancestor, rather than merely sharing an English reading.'];
 }
 if(id.startsWith('jinshu:')||id==='jiutangshu:029:p051')return ['merge','The Jin accession, 泰始/咸寧/太康 reign, Anshi style, Sima-family enfeoffment or Western Jin consort episode identifies the founding Jin 武帝, Sima Yan, who favors his grandson in Jinshu053.'];
 if(id.startsWith('beishi:070:')||id==='beishi:082:p106'||id==='suishu:047:p061')return ['keep-separate','The Northern Zhou ruler appointing 杜杲/劉行本, ruling in 保定, or campaigning against 高氏 is 周武帝, distinct from Western Jin Sima Yan.'];
 if(id.startsWith('nanqishu:')||id.startsWith('nanshi:046:')||id.startsWith('nanshi:077:'))return ['keep-separate','The Southern Qi accession/永明/世祖 episodes and Xiao-family attendants identify Qi 武帝 Xiao Ze, distinct from Western Jin Sima Yan.'];
 if(id.startsWith('nanshi:017:'))return ['keep-separate','Explicit 宋武帝 and campaigns against 孫恩/慕容超/劉毅/司馬休之 identify Liu Song’s founding ruler Liu Yu, distinct from Western Jin Sima Yan.'];
 return ['keep-separate','Explicit 漢武/孝武皇帝 or the Han episodes involving 田蚡, 灌夫, 馬邑, 李延年, 太初曆 or 漢世宗 identify Han Wudi, distinct from Western Jin Sima Yan.'];
}
const outcomes=[], docs=[];
for(const [i,{packet:p,batch,file}]of packets.entries()){
 const groups=new Map();for(const m of p.scope.completeEndpointMembers){if(!groups.has(m.canonicalPersonId))groups.set(m.canonicalPersonId,[]);groups.get(m.canonicalPersonId).push(m.localId)}
 for(const [c,ids]of groups){const exact=reg.completeEndpointClusters.find(x=>x.canonicalPersonId===c);assert.equal(canon([...ids].sort()),canon(exact.localPeople.slice().sort()))}
 const star=p.scope.starRootCanonicalPersonId,starIds=groups.get(star), mergeIds=new Set(starIds),seps=[],mergeBasis=[];
 for(const pair of p.scope.reviewPairs){const target=pair.find(id=>id!==star),ids=groups.get(target);let js=ids.map(id=>judgement(owned.get(id),i+1));assert.ok(js.every(x=>x[0]===js[0][0]));let decision=js[0][0];let basis=ids.map((id,k)=>id+': '+js[k][1]+' Source: '+owned.get(id).sourceUnits.map(u=>u.id+' '+u.zh).join(' / '));outcomes.push({packet:file,pair,decision,starMembers:starIds,targetMembers:ids,basis});if(decision==='merge'){for(let id of ids)mergeIds.add(id);mergeBasis.push(...basis)}else for(let a of starIds)for(let b of ids)seps.push({decision,localPeople:[a,b],basis,confidence:'high'});
 }
 const decisions=[];if(mergeIds.size>starIds.length)decisions.push({decision:'merge',localPeople:[...mergeIds].sort(),basis:['Target Jin identity: '+starIds.join(',')+'. Root Chinese: '+starIds.flatMap(id=>owned.get(id).sourceUnits.map(u=>id+' '+u.id+' '+u.zh)).join(' / '),...mergeBasis],confidence:'high'});decisions.push(...seps);
 const doc={schemaVersion:1,batch,authority:'model',decisions};docs.push(doc);write('resolution-part-'+String(i+1).padStart(3,'0')+'.json',doc);
}
write('pair-outcomes.json',{schemaVersion:1,sourceCoverage:{ownedPeople:148,canonicalPairs:144,priorOnlyPeople:171},outcomes});
process.env.PEOPLE_REPO_ROOT='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
const {validateResolutionDocument}=await import(runtime+'/scripts/sdk-people-resolve.mjs');
const {resolvePeopleClusters}=await import(runtime+'/scripts/lib/people-resolution.mjs');
const localPeople=new Map(allIds.map(id=>{const x=materialize(id);return [id,{...x.record,claims:x.claims,mentions:x.mentions}]}));
const priors=context.priorConstraintDocuments.map(x=>x.document);
const baseline=resolvePeopleClusters(localPeople,priors);
const clusterBy=new Map(baseline.clusters.flatMap(c=>c.localPeople.map(id=>[id,c])));
for(const x of owned.values()){assert.equal(clusterBy.get(x.localId).canonicalPersonId,x.currentCanonicalPersonId);assert.equal(canon(clusterBy.get(x.localId).localPeople),canon(reg.completeEndpointClusters.find(c=>c.canonicalPersonId===x.currentCanonicalPersonId).localPeople))}
for(let i=0;i<docs.length;i++){let p=packets[i].packet;const people=Object.fromEntries(p.people.map(x=>[x.localId,{...x.record,currentCanonicalPersonId:x.currentCanonicalPersonId,nameKeys:x.aliasesAndNameKeys}]));let dossier={batch:docs[i].batch,document:{people,targetLocalPeople:p.people.map(x=>x.localId),blocks:[{component:'owned-star-'+i,localPeople:p.people.map(x=>x.localId),reviewPairs:p.scope.reviewPairs}]}};validateResolutionDocument(docs[i],dossier,{localPeople},priors,docs.filter((_,j)=>i!==j));}
const union=resolvePeopleClusters(localPeople,[...priors,...docs]);
const mergedBy=new Map(union.clusters.flatMap(c=>c.localPeople.map(id=>[id,c.canonicalPersonId])));
for(let o of outcomes){const eq=mergedBy.get(o.starMembers[0])===mergedBy.get(o.targetMembers[0]);assert.equal(eq,o.decision==='merge');if(o.decision==='keep-separate')for(let a of o.starMembers)for(let b of o.targetMembers)assert.ok(union.keepSeparate.has([a,b].sort().join('\0')))}
assert.equal(outcomes.length,144);
const counts=Object.fromEntries(['merge','keep-separate','possible-same-as'].map(k=>[k,outcomes.filter(o=>o.decision===k).length]));
write('structural-proof.json',{schemaVersion:1,scope:'bounded cohort and complete sealed prior context; not global CI or publication approval',checks:{sealedHashes:true,packetCaps:true,losslessRegistryJoin:true,completeEndpointMembership:true,completeIntersectingPriorDocuments:true,canonicalSourceExtractionBlobs:true,sourceChineseJoins:true,baselineMembership:true,exportedDocumentValidation:docs.length,unionResolution:true,exactOwnedPairCoverage:144,allCartesianSeparations:true},counts:{owned:148,priorOnly:171,structuralPeople:localPeople.size,priorDocuments:priors.length,priorDecisions:priors.reduce((n,d)=>n+d.decisions.length,0),chapters:chapterIds.length,checkedBlobs,sourceUnits:new Set([...owned.values()].flatMap(x=>x.sourceUnits.map(u=>x.localId.split(':').slice(0,2).join(':')+':'+u.id))).size,...counts},byPacket:packets.map(p=>({packet:p.file,...Object.fromEntries(Object.keys(counts).map(k=>[k,outcomes.filter(o=>o.packet===p.file&&o.decision===k).length]))})),priorMembershipDigest:hash(canon(priors.map(d=>({batch:d.batch,decisions:d.decisions.map(x=>({decision:x.decision,localPeople:x.localPeople}))})))),registrySha256:seal.registry.sha256});
write('source-defects.json',{schemaVersion:1,edited:false,findings:[{record:'jiutangshu:029:p060',finding:'c0160/c0161/c1148 cite s0107 Jin 宣, but owned mentions and s0114 identify the Tang ancestor. Keep separate from Jin target; host should remove unrelated claim evidence through ordinary repair.'},{record:'jinshu:028:p340',finding:'c0822/c0823/c1842 also cite s0698 explicit 漢宣帝 although owned mentions and killer-of claim are solely s0729 Jin 宣帝. Merge follows the specific Cao Shuang episode; host should repair unrelated claim evidence.'},{record:'hanshu:061:p064',finding:'Record has English-only Emperor mentions in Han Jing-era Liang-wang narrative s0239–s0274, while owned title/name and initial episode concern Han Wu. Both are distinct from Jin target; repair conflated/overbroad English mentions independently.'},{record:'jinshu:026:p072',finding:'Chinese s0118 reads 嘉平四年 for 宣帝’s memorial (after Sima Yi death in 嘉平三年); s0121 and s0122 independently identify the Zhuge Ke/Deng Ai commander. Preserve source reading and investigate apparent source chronology discrepancy; identity is supported by independent specific episode.'},{record:'jinshu:024:p061',finding:'Chinese says 魏明帝太和四年 but attestation gives AD 227; conversion is inconsistent. Identity rests on Wei Mingdi’s 宣帝征蜀, not that conversion.'},{record:'mingshi:255:p117',finding:'Polity claim 明 describes the reception context, not Sima Yi’s service; AD 240 is not supplied by s0363. The named 司馬懿 closing gates against the sovereign remains the retrospective Cao Wei figure.'},{record:'beishi:001:p271',finding:'AD 409 date belongs to the retrospective Han Wu comparison by Daowu, not Han Wudi’s activity.'}],general:'Several older extracted dates label chronology tables of an unrelated dynasty. No such English date conversion was used as the identity bridge. Source and extraction repairs remain host work and invalidate affected seals normally.'});
write('manifest.json',{schemaVersion:1,role:'source-author',canonicalRevision:reg.canonicalRevision,sealedManifestSha256:sha(dir+'/sealed-manifest.json'),registrySha256:seal.registry.sha256,documents:docs.map((d,i)=>{let file='resolution-part-'+String(i+1).padStart(3,'0')+'.json';return{file,batch:d.batch,bytes:fs.statSync(out+'/'+file).size,sha256:sha(out+'/'+file),decisions:d.decisions.length}}),outcomeCounts:counts,sourceCoverage:{ownedEndpointRecords:148,priorOnlyRecords:171,ownedCanonicalPairs:144,allOwnedClaimsAndChineseRead:true,completePriorStructuralContext:true},proofs:['pair-outcomes.json','structural-proof.json','source-defects.json','prove-and-write.mjs'].map(file=>({file,bytes:fs.statSync(out+'/'+file).size,sha256:sha(out+'/'+file)})),approval:'Author proposal and bounded structural validation only; independent review, host aggregate validation, full global CI and publication remain separate.',usage:'Native model token/cost usage unavailable.'});
console.log(JSON.stringify({manifestSha256:sha(out+'/manifest.json'),counts,documents:docs.length}));
