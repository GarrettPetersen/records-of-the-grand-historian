import fs from 'node:fs';
import crypto from 'node:crypto';
const { baselineApi } = await import(process.cwd()+'/data/people/generated/ownership-plan-draft-v2-30e2e9-20261025/scripts/lib/people-ownership-plan.mjs');
const R='data/people/generated/independent-identity-recovery/jinshu053-source106-identity-reconciliation-20261025';
const caseDir=R+'/renewals-v2/renew-merge-016', out=caseDir+'/author-current/current7b6-source31-20261025';
const revision='7b6e4f15a7894c14d7a5ecb7023c85c9b6cd9691';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const pin=p=>({file:p,bytes:fs.statSync(p).size,sha256:sha(fs.readFileSync(p))});
const write=(f,x)=>{fs.writeFileSync(out+'/'+f,JSON.stringify(x,null,2)+'\n',{flag:'wx'});return pin(out+'/'+f);};
const oldScope=JSON.parse(fs.readFileSync(caseDir+'/blind-source-scope.json'));
const oldManifest=JSON.parse(fs.readFileSync(caseDir+'/source-part-manifest.json'));
const oldEntries=oldManifest.sourceParts.flatMap(p=>{let b=fs.readFileSync(R+'/'+p.file);if(sha(b)!==p.sha256||b.length!==p.bytes)throw Error('old part mismatch');return JSON.parse(b).entries;});
const members=oldScope.completeEndpointClusters.flatMap(v=>v.localPeople);
const api=await baselineApi(process.cwd(),revision), chapters=new Map(), pins=[], normalValidation=[];
for(const chapterKey of [...new Set(members.map(id=>id.split(':').slice(0,2).join(':')))].sort()){
 const [book,chapter]=chapterKey.split(':'), sourcePath=`data/${book}/${chapter}.json`, extractionPath=`data/people/extractions/${book}/${chapter}.json`;
 const sourceRaw=api.read(sourcePath), extractionRaw=api.read(extractionPath), source=JSON.parse(sourceRaw), packet=api.p.buildPeopleExtractionPacket(book,chapter,{chapterData:source});
 const expanded=api.v.validateCompactPeopleExtraction(JSON.parse(extractionRaw),packet,{strictAliasDispositions:true}).normalized;
 if(!expanded)throw Error('normalization absent');
 const prior=oldScope.currentInputPins[chapterKey];
 pins.push({chapterKey,source:{path:sourcePath,sha256:sha(sourceRaw),bytes:sourceRaw.length,unchangedFrom1b9:sha(sourceRaw)===prior.source.sha256},extraction:{path:extractionPath,sha256:sha(extractionRaw),bytes:extractionRaw.length,unchangedFrom1b9:sha(extractionRaw)===prior.extraction.sha256},input:expanded.input});
 chapters.set(chapterKey,{source,packet,expanded});normalValidation.push({chapterKey,exactGitStrictExtraction:'PASS'});
}
const entries=[],units=new Map(),frames=new Map(),reference=(v,id)=>typeof v==='string'?v===id:Array.isArray(v)?v.some(x=>reference(x,id)):v&&typeof v==='object'?Object.values(v).some(x=>reference(x,id)):false;
function unit(ref){let k=ref.split(':').slice(0,2).join(':'),u=chapters.get(k).packet.units.find(v=>v.id===ref.split(':')[2]);if(!u)throw Error('missing unit '+ref);units.set(ref,{kind:'source-unit',key:ref,value:{...u,id:ref}});return u;}
function frame(k,i){let key=k+':block:'+i;if(frames.has(key))return;let c=chapters.get(k),b=c.source.content[i];if(!b)throw Error('missing full block '+key);let refs=c.packet.units.filter(u=>u.blockIndex===i).map(u=>k+':'+u.id);refs.forEach(unit);frames.set(key,{kind:'complete-governing-block',key,value:{chapterKey:k,blockIndex:i,block:b,unitRefs:refs}});}
for(let e of oldEntries.filter(e=>e.kind==='complete-governing-block-structure'))frame(e.value.chapterPinRef,e.value.blockIndex);
for(let id of members){let k=id.split(':').slice(0,2).join(':'),x=chapters.get(k).expanded,p=x.people.find(v=>v.localId===id);if(!p)throw Error('unknown owner '+id);let cs=x.claims.filter(v=>v.subject===id),ms=x.mentions.filter(v=>v.person===id),ins=x.claims.filter(v=>v.subject!==id&&reference(v.value,id));let refs=new Set([...cs,...ins].flatMap(c=>c.evidence).concat(ms.map(m=>k+':'+m.unit.id)));for(let ref of refs){let u=unit(ref);frame(ref.split(':').slice(0,2).join(':'),u.blockIndex);}entries.push({kind:'person-profile',key:id,value:p},{kind:'person-claims',key:id,value:cs},{kind:'person-mentions',key:id,value:ms},{kind:'person-inboundClaims',key:id,value:ins});}
for(let [k,c]of chapters)entries.push({kind:'chapter-framing',key:k,value:{meta:c.source.meta,blockOrder:c.source.content.map((v,i)=>({blockIndex:i,type:v.type}))}});
entries.push(...frames.values(),...units.values());
let parts=[],chunk=[];function flush(){if(!chunk.length)return;let f=`source-only-part-${String(parts.length+1).padStart(3,'0')}.json`;let p=write(f,{schemaVersion:1,artifactKind:'current-source-only-identity-evidence',revision,scope:'renew-merge-016',containsAuthorJudgments:false,entries:chunk});if(p.bytes>262144)throw Error('oversized sealed part');parts.push(p);chunk=[];}
for(let e of entries){if(Buffer.byteLength(JSON.stringify({entries:[...chunk,e]},null,2))>245000)flush();chunk.push(e);}flush();
const report={schemaVersion:1,artifactKind:'current-source-only-identity-packet-manifest',revision,sealedAt:new Date().toISOString(),precedesCurrentAuthorApplicabilityAssessment:true,containsProposedDecisions:false,members,originalScope:pin(caseDir+'/blind-source-scope.json'),oldSourceManifest:pin(caseDir+'/source-part-manifest.json'),currentChapterPins:pins,parts,allSourcePartsRequired:true,counts:{members:members.length,units:units.size,fullFrames:frames.size,claims:entries.filter(e=>e.kind==='person-claims').reduce((a,e)=>a+e.value.length,0),mentions:entries.filter(e=>e.kind==='person-mentions').reduce((a,e)=>a+e.value.length,0),inboundClaims:entries.filter(e=>e.kind==='person-inboundClaims').reduce((a,e)=>a+e.value.length,0)},exactGitNormalValidation:normalValidation,fullClosedSDKCoreStatus:'PENDING fresh current loader; no old overlay used',independentCurrentDeltaStatus:'PENDING',noCanonicalWrites:true};
console.log(JSON.stringify(write('source-only-manifest.json',report)));
