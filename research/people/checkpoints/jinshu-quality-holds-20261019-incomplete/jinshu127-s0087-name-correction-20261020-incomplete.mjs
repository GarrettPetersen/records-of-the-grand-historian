// Research only: narrow an office-plus-name scanner surface to the actual name.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath,pathToFileURL} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)), fixture='/tmp/jinshu127-editorial-fixture.iM9uIsV8';
const sha=b=>createHash('sha256').update(b).digest('hex');
const scripts={'validate-people-extraction.mjs':'33b59627388be1735eae3a05fb0b36b4580eb8b2c4924b063f2f7ad66e1af2c6','build-people-extraction-packet.mjs':'6561e28aed4a472fb6bba80b84728b395b3254f893a4b9b42c8939ecff195245','lib/people-editorial-decisions.mjs':'8c61394d8376d4c13263341f2a054a55bd67ed227da63f11a822050cfc1f0af6'};
for(const [name,hash] of Object.entries(scripts))if(sha(fs.readFileSync(path.join(fixture,'scripts',name)))!==hash)throw new Error(`Changed fixture ${name}`);
const mod=name=>import(pathToFileURL(path.join(fixture,'scripts',name)).href);
const {validateCompactPeopleExtraction}=await mod('validate-people-extraction.mjs');
const {buildPeopleExtractionPacket}=await mod('build-people-extraction-packet.mjs');
const {validateAppliedEditorialDecisions}=await mod('lib/people-editorial-decisions.mjs');
const pins={
  extraction:['jinshu127-four-missing-mentions-candidate-20261020-incomplete/extraction.json','1d0aef11596fac9ca663d26e9835946908613249a89a57cf8986f71523a89008'],
  precedingReview:['jinshu127-four-missing-mentions-candidate-20261020-incomplete/independent-review.md','1c9eb570a7c1b07bd146d8a7d46e620a0bfbb3e8c2486274ed64324645a83894'],
  packet:['jinshu127-two-field-materialized-held-20261020-incomplete/packet.json','cd6ab556fb0b323f639d2cf46013312e78a8868379cf053f1678f40c013b4701'],
  source:['jinshu127-two-field-materialized-held-20261020-incomplete/source.json','ca683ed09f79724fe107185f6f1e5f5ded2378999ea887ce910432eb127dd3b3'],
  history:['jinshu127-two-field-materialized-held-20261020-incomplete/editorial-history.json','093ceb5a45d1be3500d1449ebdfbd4d304081049fd11e7257a50d1d93b26917e'],
  sourceReview:['jinshu127-unscanned-v7-independent-source-review-20261020-incomplete.md','253daa741e63dcbf21906b26e77b51d4a9a03846d071eb40b30f026f425e25d1'],
  challenge:['jinshu127-unscanned-v7-independent-challenge-20261020-incomplete.md','b81cad9e23c5521900af7ec99ae3d6255607e8ec8b783d8c37b9110c10be285e'],
};
const read=([n,h],json=true)=>{const b=fs.readFileSync(path.join(dir,n));if(sha(b)!==h)throw new Error(`Changed input ${n}`);return json?JSON.parse(b):b.toString('utf8');};
const extraction=read(pins.extraction),packet=read(pins.packet),source=read(pins.source),history=read(pins.history);
for(const key of ['precedingReview','sourceReview','challenge'])read(pins[key],false);
const rebuilt=buildPeopleExtractionPacket('jinshu','127',{chapterData:source,chapterFile:path.join(dir,'jinshu127-four-field-materialized-20261020-incomplete/source.json')});
if(!isDeepStrictEqual(rebuilt,packet))throw new Error('Stale packet');
const u=packet.units.find(x=>x.id==='s0087');
if(!u.zh.startsWith('其黃門侍郎張華進曰')||Array.from(u.en).slice(31,52).join('')!=='Yellow Gate Zhang Hua'||Array.from(u.en).slice(43,52).join('')!=='Zhang Hua')throw new Error('Unexpected source geometry');
const find=id=>packet.preflight.candidates.find(c=>c.id===`jinshu:127:${id}`);
const broad=find('cand_2f722612707ea12d'),exact=find('cand_98f8290f92dcbf22');
if(!broad||!exact||broad.unit!=='s0087'||broad.startCodePoint!==31||broad.endCodePoint!==52||exact.unit!=='s0087'||exact.startCodePoint!==43||exact.endCodePoint!==52)throw new Error('Unexpected candidate geometry');
const before=validateCompactPeopleExtraction(extraction,packet,{strictAliasDispositions:true});validateAppliedEditorialDecisions(history,before.normalized);
const oldSurface=['p046','personal-name','en','Yellow Gate Zhang Hua',[['s0087',[0]]]],newSurface=['p046','personal-name','en','Zhang Hua',[['s0087',[0]]]];
const index=extraction.surfaces.findIndex(row=>isDeepStrictEqual(row,oldSurface));
if(index<0||extraction.surfaces.filter(row=>isDeepStrictEqual(row,oldSurface)).length!==1)throw new Error('Unexpected old surface');
const original=structuredClone(extraction);extraction.surfaces[index]=newSurface;
const groups=extraction.candidateDispositions.filter(g=>g[0]==='not-person'&&g[1]==='other');
if(groups.length!==1||extraction.candidateDispositions.some(g=>g[2].some(row=>row[0]==='cand_2f722612707ea12d')))throw new Error('Unexpected disposition state');
const disposition=['cand_2f722612707ea12d','Redundant enclosing scanner expression combines office words with Zhang Hua; the exact personal name is linked separately.'];groups[0][2].push(disposition);
const restored=structuredClone(extraction);restored.surfaces[index]=oldSurface;
if(!isDeepStrictEqual(restored.candidateDispositions.find(g=>g[0]==='not-person'&&g[1]==='other')[2].pop(),disposition)||!isDeepStrictEqual(restored,original))throw new Error('Unexpected changes');
const after=validateCompactPeopleExtraction(extraction,packet,{strictAliasDispositions:true});validateAppliedEditorialDecisions(history,after.normalized);
const matches=after.normalized.mentions.filter(m=>m.person==='jinshu:127:p046'&&m.unit.id==='s0087'&&m.spans.en.some(s=>s.exact==='Zhang Hua'&&s.startCodePoint===43&&s.endCodePoint===52));
if(matches.length!==1||!matches[0].candidateRefs.includes(exact.id)||matches[0].candidateRefs.includes(broad.id))throw new Error('Candidate accounting mismatch');
const broadDisposition=after.normalized.candidateDispositions.find(d=>d.candidate===broad.id);
if(!broadDisposition||broadDisposition.reason!=='other'||!broadDisposition.note.includes('Redundant enclosing'))throw new Error('Missing enclosing disposition');
const bytes=Buffer.from(`${JSON.stringify(extraction,null,2)}\n`);
const receipt={status:'research-only-held-independent-review-required',stagingScriptsRevision:'303b4e0fe883d4d305d84987b656322a91e5c3a4',fixture,scriptHashes:scripts,inputHashes:Object.fromEntries(Object.entries(pins).map(([k,v])=>[k,v[1]])),extractionSha256:sha(bytes),chapterFingerprint:packet.input.chapterFingerprint,changes:{oldSurface,newSurface,disposition,broadCandidate:broad.id,exactCandidate:exact.id},validation:{strictAliasDispositions:true,appliedHistory:true,exactChangesOnly:true,stats:after.stats},limitations:['The enclosing candidate is disposed as a redundant mixed scanner expression, not as an assertion that Zhang Hua is non-person; exact person candidate stays linked.','Independent review of this exact candidate and disposition semantics is required.','Mention IDs may change; downstream artifacts need regeneration and revalidation.','Other reconciliation, editorial, date, identity and publication gates remain unapproved.','No canonical files, Git, queue or locks changed.']};
const out=path.join(dir,'jinshu127-s0087-name-corrected-20261020-incomplete');fs.mkdirSync(out);fs.writeFileSync(path.join(out,'extraction.json'),bytes,{flag:'wx',mode:0o600});fs.writeFileSync(path.join(out,'receipt.json'),`${JSON.stringify(receipt,null,2)}\n`,{flag:'wx',mode:0o600});console.log(JSON.stringify({out,receipt},null,2));
