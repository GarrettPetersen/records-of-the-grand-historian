// Research-only: remove false nonperson dispositions already covered by names.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath,pathToFileURL} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const fixture='/tmp/jinshu127-editorial-fixture.iM9uIsV8';
const sha=b=>createHash('sha256').update(b).digest('hex');
const scripts={'validate-people-extraction.mjs':'33b59627388be1735eae3a05fb0b36b4580eb8b2c4924b063f2f7ad66e1af2c6','build-people-extraction-packet.mjs':'6561e28aed4a472fb6bba80b84728b395b3254f893a4b9b42c8939ecff195245','lib/people-editorial-decisions.mjs':'8c61394d8376d4c13263341f2a054a55bd67ed227da63f11a822050cfc1f0af6'};
for(const [name,hash] of Object.entries(scripts))if(sha(fs.readFileSync(path.join(fixture,'scripts',name)))!==hash)throw new Error(`Changed fixture ${name}`);
const mod=name=>import(pathToFileURL(path.join(fixture,'scripts',name)).href);
const {validateCompactPeopleExtraction}=await mod('validate-people-extraction.mjs');
const {buildPeopleExtractionPacket}=await mod('build-people-extraction-packet.mjs');
const {validateAppliedEditorialDecisions}=await mod('lib/people-editorial-decisions.mjs');
const pins={
 extraction:['jinshu127-s0107-s0108-person-candidate-20261020-incomplete/extraction.json','f3d1b90dc2811e10dfad1cb53c11f942418f69253c045a4e3b01761a8581cee2'],
 review:['jinshu127-s0107-s0108-person-candidate-20261020-incomplete/independent-review.md','db913fd48a28ff2ae4f86879b3651912cfbdc5e5e825ca95d5da05ab1a227a3c'],
 packet:['jinshu127-two-field-materialized-held-20261020-incomplete/packet.json','cd6ab556fb0b323f639d2cf46013312e78a8868379cf053f1678f40c013b4701'],
 source:['jinshu127-two-field-materialized-held-20261020-incomplete/source.json','ca683ed09f79724fe107185f6f1e5f5ded2378999ea887ce910432eb127dd3b3'],
 history:['jinshu127-two-field-materialized-held-20261020-incomplete/editorial-history.json','093ceb5a45d1be3500d1449ebdfbd4d304081049fd11e7257a50d1d93b26917e']
};
const read=([name,hash],json=true)=>{const b=fs.readFileSync(path.join(dir,name));if(sha(b)!==hash)throw new Error(`Changed input ${name}`);return json?JSON.parse(b):b.toString('utf8');};
const extraction=read(pins.extraction),packet=read(pins.packet),source=read(pins.source),history=read(pins.history);read(pins.review,false);
if(!isDeepStrictEqual(buildPeopleExtractionPacket('jinshu','127',{chapterData:source,chapterFile:path.join(dir,'jinshu127-four-field-materialized-20261020-incomplete/source.json')}),packet))throw new Error('Stale packet');
const before=validateCompactPeopleExtraction(extraction,packet,{strictAliasDispositions:true});validateAppliedEditorialDecisions(history,before.normalized);
// Each tuple: source unit, language, candidate, candidate ID, local person, independently inspectable source phrase.
const specs=[
 ['s0108','en','Murong','cand_71da6880db5fe590','p044','敗德將慕容鐘'],
 ['s0108','zh','慕容','cand_636938f67048576c','p044','敗德將慕容鐘'],
 ['s0111','en','Murong','cand_0713027adcd4ff5b','p045','德乃留慕容和'],
 ['s0111','en','Murong','cand_2430385b1618a12f','p058','德乃留慕容和'],
 ['s0111','zh','慕容','cand_b10c9940c94f7c95','p058','德乃留慕容和'],
 ['s0112','en','Murong He','cand_0cc84d928b00d56a','p064','和不從'],
 ['s0112','en','Murong Bao','cand_af3668477965bcdc','p063','寶之至黎陽'],
 ['s0113','en','Li Bian','cand_eb48ad652617fcfa','p065','辯懼謀泄'],
 ['s0115','en','Li Bian','cand_adffb65f409f4185','p065','辯又勸和反'],
 ['s0115','en','Murong He','cand_0863f718ea46dbbb','p064','和不從'],
 ['s0116','en','Li Bian','cand_07f86a60a7a143f8','p065','辯怒，殺和'],
 ['s0116','en','Murong He','cand_98f64b07d4aefdeb','p064','辯怒，殺和']
];
const original=structuredClone(extraction), removed=[];
for(const [unit,language,exact,id,person,witness] of specs){
 const u=packet.units.find(x=>x.id===unit),c=packet.preflight.candidates.find(x=>x.id===`jinshu:127:${id}`);
 if(!u||!u.zh.includes(witness)||!c||c.unit!==unit||c.language!==language||c.exact!==exact)throw new Error(`Changed evidence ${id}`);
 const covering=before.normalized.mentions.filter(m=>m.unit.id===unit&&m.person===`jinshu:127:${person}`&&m.kind==='personal-name'&&m.spans[language].some(s=>s.startCodePoint<=c.startCodePoint&&c.endCodePoint<=s.endCodePoint));
 if(covering.length!==1)throw new Error(`Expected one existing covering personal mention for ${id}`);
 const hits=[];for(const group of extraction.candidateDispositions)for(let i=0;i<group[2].length;i++)if(group[2][i][0]===id)hits.push({group,i});
 if(hits.length!==1||hits[0].group[0]!=='not-person')throw new Error(`Unexpected disposition ${id}`);
 const {group,i}=hits[0];removed.push({unit,language,exact,id,person,witness,unitZh:u.zh,unitEn:u.en,candidateStart:c.startCodePoint,candidateEnd:c.endCodePoint,coveredBy:covering[0].spans[language],priorDisposition:[group[0],group[1],group[2][i][1]]});group[2].splice(i,1);
}
const expected=structuredClone(original),ids=new Set(specs.map(s=>s[3]));for(const g of expected.candidateDispositions)g[2]=g[2].filter(x=>!ids.has(x[0]));
if(!isDeepStrictEqual(expected,extraction))throw new Error('Unexpected changes outside 12 exact dispositions');
const after=validateCompactPeopleExtraction(extraction,packet,{strictAliasDispositions:true});validateAppliedEditorialDecisions(history,after.normalized);
const stripRefs=m=>{const x=structuredClone(m);delete x.candidateRefs;return x;};
if(!isDeepStrictEqual(before.normalized.mentions.map(stripRefs),after.normalized.mentions.map(stripRefs)))throw new Error('Mention geometry or identity changed');
const bytes=Buffer.from(`${JSON.stringify(extraction,null,2)}\n`);
const receipt={status:'research-only-independent-review-required',stagingScriptsRevision:'303b4e0fe883d4d305d84987b656322a91e5c3a4',fixture,scriptHashes:scripts,inputHashes:Object.fromEntries(Object.entries(pins).map(([k,v])=>[k,v[1]])),extractionSha256:sha(bytes),removed,validation:{strictAliasDispositions:true,appliedHistory:true,unchangedMentionGeometryAndIds:true,stats:after.stats},limitations:['Independent source, cross-language identity and candidate-accounting review of all 12 changes is required.','Existing local IDs do not resolve cross-chapter identities; local p058 and p064 remain distinct.','Title, place and office overlaps were excluded, not adjudicated.','Other chapter editorial, date, identity, candidate and publication gates remain open.','No canonical files, Git, queue or locks changed.']};
const out=path.join(dir,'jinshu127-s0108-s0116-linked-name-accounting-20261020-incomplete');fs.mkdirSync(out);
fs.writeFileSync(path.join(out,'extraction.json'),bytes,{flag:'wx',mode:0o600});fs.writeFileSync(path.join(out,'receipt.json'),`${JSON.stringify(receipt,null,2)}\n`,{flag:'wx',mode:0o600});
console.log(JSON.stringify({out,extractionSha256:receipt.extractionSha256,stats:after.stats,removed:removed.length},null,2));
