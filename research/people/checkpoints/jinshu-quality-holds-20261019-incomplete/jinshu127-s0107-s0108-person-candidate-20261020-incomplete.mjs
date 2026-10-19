// Research only: source-backed person candidate accounting, not publication.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath,pathToFileURL} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const fixture='/tmp/jinshu127-editorial-fixture.iM9uIsV8';
const sha=b=>createHash('sha256').update(b).digest('hex');
const scripts={'validate-people-extraction.mjs':'33b59627388be1735eae3a05fb0b36b4580eb8b2c4924b063f2f7ad66e1af2c6','build-people-extraction-packet.mjs':'6561e28aed4a472fb6bba80b84728b395b3254f893a4b9b42c8939ecff195245','lib/people-editorial-decisions.mjs':'8c61394d8376d4c13263341f2a054a55bd67ed227da63f11a822050cfc1f0af6'};
for(const [name,hash] of Object.entries(scripts)) if(sha(fs.readFileSync(path.join(fixture,'scripts',name)))!==hash) throw new Error(`Changed fixture ${name}`);
const moduleAt=name=>import(pathToFileURL(path.join(fixture,'scripts',name)).href);
const {validateCompactPeopleExtraction}=await moduleAt('validate-people-extraction.mjs');
const {buildPeopleExtractionPacket}=await moduleAt('build-people-extraction-packet.mjs');
const {validateAppliedEditorialDecisions}=await moduleAt('lib/people-editorial-decisions.mjs');
const pins={
 extraction:['jinshu127-four-missing-mentions-candidate-20261020-incomplete/extraction.json','1d0aef11596fac9ca663d26e9835946908613249a89a57cf8986f71523a89008'],
 priorReview:['jinshu127-four-missing-mentions-candidate-20261020-incomplete/independent-review.md','1c9eb570a7c1b07bd146d8a7d46e620a0bfbb3e8c2486274ed64324645a83894'],
 packet:['jinshu127-two-field-materialized-held-20261020-incomplete/packet.json','cd6ab556fb0b323f639d2cf46013312e78a8868379cf053f1678f40c013b4701'],
 source:['jinshu127-two-field-materialized-held-20261020-incomplete/source.json','ca683ed09f79724fe107185f6f1e5f5ded2378999ea887ce910432eb127dd3b3'],
 history:['jinshu127-two-field-materialized-held-20261020-incomplete/editorial-history.json','093ceb5a45d1be3500d1449ebdfbd4d304081049fd11e7257a50d1d93b26917e']
};
const read=([name,hash],json=true)=>{const b=fs.readFileSync(path.join(dir,name));if(sha(b)!==hash)throw new Error(`Changed input ${name}`);return json?JSON.parse(b):b.toString('utf8');};
const extraction=read(pins.extraction),packet=read(pins.packet),source=read(pins.source),history=read(pins.history);read(pins.priorReview,false);
const rebuilt=buildPeopleExtractionPacket('jinshu','127',{chapterData:source,chapterFile:path.join(dir,'jinshu127-four-field-materialized-20261020-incomplete/source.json')});
if(!isDeepStrictEqual(rebuilt,packet))throw new Error('Stale packet');
const before=validateCompactPeopleExtraction(extraction,packet,{strictAliasDispositions:true});validateAppliedEditorialDecisions(history,before.normalized);
const units=Object.fromEntries(packet.units.filter(u=>['s0107','s0108'].includes(u.id)).map(u=>[u.id,u]));
if(!units.s0107.zh.includes('苻登既為姚興所滅') || !units.s0107.zh.includes('降於德') || !units.s0108.zh.includes('敗德將慕容鐘'))throw new Error('Source witnesses changed');
const removals=[
 ['s0107','en','Yao Xing','cand_38c6336f4cb5a5cf'],
 ['s0107','zh','姚興','cand_28c47123ed6058ae'],
 ['s0107','en','Murong De','cand_49d97e68499a403e'],
 ['s0108','en','Murong De','cand_b530729a14f76854'],
 ['s0108','en','Murong','cand_02090274dda293f5']
];
const original=structuredClone(extraction), removed=[];
for(const [unit,language,exact,id] of removals){
 const c=packet.preflight.candidates.find(c=>c.id===`jinshu:127:${id}`);
 if(!c||c.unit!==unit||c.language!==language||c.exact!==exact)throw new Error(`Changed candidate ${id}`);
 const matches=[];
 for(const group of extraction.candidateDispositions)for(let i=0;i<group[2].length;i++)if(group[2][i][0]===id)matches.push({group,i});
 if(matches.length!==1||matches[0].group[0]!=='not-person')throw new Error(`Unexpected disposition ${id}`);
 const {group,i}=matches[0];removed.push({unit,language,exact,id,disposition:[group[0],group[1],group[2][i][1]]});group[2].splice(i,1);
}
const additions=[['p045','personal-name','zh','德',[['s0108',[0]]]],['p045','personal-name','en','Murong De',[['s0108',[0]]]]];
for(const a of additions){
 const [, , lang, exact]=a, text=units.s0108[lang], start=Array.from(text).findIndex((_,i)=>Array.from(exact).every((ch,j)=>Array.from(text)[i+j]===ch));
 if(start<0)throw new Error(`Missing source surface ${exact}`);
 const end=start+Array.from(exact).length;
 const overlap=before.normalized.mentions.flatMap(m=>m.unit.id!=='s0108'?[]:m.spans[lang].filter(s=>s.startCodePoint<end&&start<s.endCodePoint));
 if(overlap.length)throw new Error(`Overlapping source surface ${exact}`);
 extraction.surfaces.push(a);
}
const expected=structuredClone(original), removalIds=new Set(removals.map(x=>x[3]));
for(const group of expected.candidateDispositions)group[2]=group[2].filter(x=>!removalIds.has(x[0]));
expected.surfaces.push(...additions);
if(!isDeepStrictEqual(expected,extraction))throw new Error('Changes exceed targeted removals and additions');
const after=validateCompactPeopleExtraction(extraction,packet,{strictAliasDispositions:true});validateAppliedEditorialDecisions(history,after.normalized);
for(const [, , lang, exact] of additions){if(!after.normalized.mentions.some(m=>m.unit.id==='s0108'&&m.person==='jinshu:127:p045'&&m.spans[lang].some(s=>s.exact===exact&&s.occurrence===0)))throw new Error(`Missing validated link ${exact}`);}
const bytes=Buffer.from(`${JSON.stringify(extraction,null,2)}\n`);
const receipt={status:'research-only-independent-review-required',stagingScriptsRevision:'303b4e0fe883d4d305d84987b656322a91e5c3a4',fixture,scriptHashes:scripts,inputHashes:Object.fromEntries(Object.entries(pins).map(([k,v])=>[k,v[1]])),extractionSha256:sha(bytes),sourceWitnesses:{s0107:units.s0107.zh,s0108:units.s0108.zh},removed,additions,validation:{strictAliasDispositions:true,appliedHistory:true,stats:after.stats},limitations:['Exact source and semantic review by an independent reviewer is required.','Existing local IDs do not resolve cross-chapter identities.','Generated mention IDs can shift and require downstream reconciliation.','Other editorial, date, identity, candidate and publication gates remain open.','No canonical files, Git, queue or locks were changed.']};
const out=path.join(dir,'jinshu127-s0107-s0108-person-candidate-20261020-incomplete');fs.mkdirSync(out);
fs.writeFileSync(path.join(out,'extraction.json'),bytes,{flag:'wx',mode:0o600});fs.writeFileSync(path.join(out,'receipt.json'),`${JSON.stringify(receipt,null,2)}\n`,{flag:'wx',mode:0o600});
console.log(JSON.stringify({out,receipt},null,2));
