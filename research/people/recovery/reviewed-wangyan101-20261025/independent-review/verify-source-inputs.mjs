import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual as eq } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const p=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=f=>JSON.parse(fs.readFileSync(path.join(p,f)));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const hash=v=>sha(JSON.stringify(v));
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
const manifest=read('sealed-manifest.json'), h=read('host-context.json'), j=read('join-proof.json'), pins=read('input-pins.json');
assert(sha(fs.readFileSync(p+'/sealed-manifest.json'))==='0104eb78cc76e3251388ca95f503e9c29fe8f4a2a46f21e156f0d249016011e3','manifest');
for(const f of manifest.files){const b=fs.readFileSync(p+'/'+f.file);assert(b.length===f.bytes&&sha(b)===f.sha256,'file '+f.file)}
const s=JSON.parse(fs.readFileSync(h.dependencyProof.sourceManifest));
assert(sha(fs.readFileSync(h.dependencyProof.sourceManifest))===h.dependencyProof.sourceManifestSha256,'basis manifest');
const requests=[...pins.inputPins,...pins.dependencyPins.filter(i=>i.location==='configRoot')];
const raw=execFileSync('git',['cat-file','--batch'],{input:requests.map(i=>pins.canonicalRevision+':'+i.path+'\n').join(''),maxBuffer:200*1024*1024});
const docs=new Map();let pos=0;
for(const i of requests){let end=raw.indexOf(10,pos);let head=raw.subarray(pos,end).toString().split(' ');assert(head[1]==='blob','git blob '+i.path);let n=Number(head[2]);pos=end+1;let b=raw.subarray(pos,pos+n);pos+=n+1;assert(sha(b)===i.sha256&&(!('bytes'in i)||n===i.bytes),'pin '+i.path);if(i.path.endsWith('.json'))docs.set(i.path,JSON.parse(b))}
for(const i of pins.dependencyPins.filter(i=>i.location==='runtime'))assert(sha(fs.readFileSync(s.runtime+'/'+i.path))===i.sha256,'runtime '+i.path);
const {expandPeopleExtraction,isCompactPeopleExtraction}=await import(s.runtime+'/scripts/lib/people-compact.mjs');
const {contentUnits}=await import(s.runtime+'/scripts/lib/people-content.mjs');
const validator=fs.readFileSync(s.runtime+'/scripts/validate-people-extraction.mjs','utf8');
const pure=validator.slice(validator.indexOf('function canonicalJson('),validator.indexOf('\nfunction nestedValuesWithKey('));
const normalizeClaims=new Function(pure+'\nreturn normalizeClaims;')();
const packets=[1,2,3].map(n=>read(`part-00${n}.json`));const own=new Map();const pairs=new Set();
for(const x of packets){assert(eq(x.priorConstraintDocuments,h.priorConstraintDocuments.map(d=>d.document)),'full prior docs');for(const a of x.people){if(own.has(a.localId))assert(eq(own.get(a.localId),a),'repeated endpoint');own.set(a.localId,a)}for(const pair of x.scope.reviewPairs){let key=[...pair].sort().join('|');assert(!pairs.has(key),'duplicate pair');pairs.add(key);for(const id of pair){const members=h.completeOwnedMembership.find(v=>v.canonicalPersonId===id);assert(members,'missing canonical');assert(eq(members.localPeople.slice().sort(),x.people.filter(v=>v.currentCanonicalPersonId===id).map(v=>v.localId).sort()),'incomplete endpoint')}}}
const joined=[...own.values()].sort((a,b)=>a.localId.localeCompare(b.localId,'en')).map(a=>{let r={};for(const[k,v]of Object.entries(a)){if(k==='mentionCount')continue;if(k==='sourcePins')r.mentions=h.omittedOwnedMentionArrays[a.localId];r[k]=v}return r});
assert(hash(joined)===j.hashes.unprojectedOwnedSemanticSha256,'join');assert(hash(h.priorConstraintPeople)===j.hashes.fullPriorPeopleSemanticSha256,'prior people');assert(hash(h.priorConstraintDocuments.map(d=>d.document))===j.hashes.fullPriorConstraintsSemanticSha256,'prior documents');
let claimCount=0,ownedClaimCount=0,unitCount=0,ownedUnitCount=0;const cache=new Map();const all=[...own.values(),...h.priorConstraintPeople];
for(const a of all){const source=docs.get(a.sourcePins.sourcePath),units=contentUnits(source);let ext=cache.get(a.sourcePins.extractionPath);if(!ext){let c=docs.get(a.sourcePins.extractionPath);ext=isCompactPeopleExtraction(c)?expandPeopleExtraction({...c,surfaces:[]},{book:c.book,chapter:c.chapter,input:c.input,units,preflight:{candidates:[]}}):c;ext.claims=normalizeClaims(ext.claims,`${ext.book}:${ext.chapter}`);cache.set(a.sourcePins.extractionPath,ext)}assert(eq(ext.people.find(v=>v.localId===a.localId),a.record),'record '+a.localId);const cs=ext.claims.filter(c=>c.subject===a.localId);assert(eq(cs,a.claims),'claims '+a.localId);claimCount+=cs.length;if(own.has(a.localId))ownedClaimCount+=cs.length;const us=new Map(units.map(u=>[u.id,u]));const provided=new Set(a.sourceUnits.map(u=>u.id));for(const u of a.sourceUnits){assert(u.zh===us.get(u.id)?.zh,'Chinese '+a.localId+'/'+u.id);unitCount++;if(own.has(a.localId))ownedUnitCount++}for(const c of cs)for(const e of c.evidence??[])assert(provided.has(e.split(':').at(-1)),'claim evidence '+e);for(const m of a.mentions??h.omittedOwnedMentionArrays[a.localId])assert(provided.has(m.unit.id),'mention evidence '+m.unit.id)}
assert(own.size===103&&all.length===174&&pairs.size===101,'counts');
const receipt={canonicalRevision:pins.canonicalRevision,manifestSha256:sha(fs.readFileSync(p+'/sealed-manifest.json')),joinProofSha256:sha(fs.readFileSync(p+'/join-proof.json')),inputPinsVerified:pins.inputPins.length,dependencyPinsVerified:pins.dependencyPins.length,ownedRecords:own.size,totalRecordsStructurallyVerified:all.length,ownedFullNormalizedClaimsVerified:ownedClaimCount,totalFullNormalizedClaimsVerified:claimCount,ownedChineseUnitInstancesVerified:ownedUnitCount,totalChineseUnitInstancesVerified:unitCount,chapters:cache.size,pairs:101,fullEndpointMembershipVerified:true,losslessOwnedJoinSha256:hash(joined),priorDocumentsSha256:hash(h.priorConstraintDocuments.map(d=>d.document)),priorPeopleSha256:hash(h.priorConstraintPeople),notes:'Read-only canonical git objects and pinned runtime; exact validator claim normalization merges identical facts and unions evidence. No prior-only people source judgments reopened. Full global CI remains host-owned.'};
fs.writeFileSync(p+'/independent-review/source-verification.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
