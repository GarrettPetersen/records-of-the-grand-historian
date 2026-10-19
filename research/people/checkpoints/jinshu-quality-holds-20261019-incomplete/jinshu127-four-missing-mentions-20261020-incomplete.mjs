// Research-only: four source-reviewed, nonoverlapping mention additions.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath,pathToFileURL} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)), fixture='/tmp/jinshu127-editorial-fixture.iM9uIsV8';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const scripts={'validate-people-extraction.mjs':'33b59627388be1735eae3a05fb0b36b4580eb8b2c4924b063f2f7ad66e1af2c6','build-people-extraction-packet.mjs':'6561e28aed4a472fb6bba80b84728b395b3254f893a4b9b42c8939ecff195245','lib/people-editorial-decisions.mjs':'8c61394d8376d4c13263341f2a054a55bd67ed227da63f11a822050cfc1f0af6'};
for(const [name,hash] of Object.entries(scripts)) if(sha(fs.readFileSync(path.join(fixture,'scripts',name)))!==hash) throw new Error(`Changed fixture ${name}`);
const moduleAt=name=>import(pathToFileURL(path.join(fixture,'scripts',name)).href);
const {validateCompactPeopleExtraction}=await moduleAt('validate-people-extraction.mjs');
const {buildPeopleExtractionPacket}=await moduleAt('build-people-extraction-packet.mjs');
const {validateAppliedEditorialDecisions}=await moduleAt('lib/people-editorial-decisions.mjs');
const pins={
  extraction:['jinshu127-s0191-mother-corrected-20261020-incomplete/extraction.json','65b4ebeb282370efb5ae0aed51b563a990d948c61e843b7a1dfd0d1d0ef79679'],
  previousReview:['jinshu127-s0191-mother-corrected-20261020-incomplete/independent-review.md','f5107b145a377981cdf0f65a8030f4182ec2a409eea0cbac3236046e59b89124'],
  packet:['jinshu127-two-field-materialized-held-20261020-incomplete/packet.json','cd6ab556fb0b323f639d2cf46013312e78a8868379cf053f1678f40c013b4701'],
  source:['jinshu127-two-field-materialized-held-20261020-incomplete/source.json','ca683ed09f79724fe107185f6f1e5f5ded2378999ea887ce910432eb127dd3b3'],
  history:['jinshu127-two-field-materialized-held-20261020-incomplete/editorial-history.json','093ceb5a45d1be3500d1449ebdfbd4d304081049fd11e7257a50d1d93b26917e'],
  sourceReview:['jinshu127-unscanned-v7-independent-source-review-20261020-incomplete.md','253daa741e63dcbf21906b26e77b51d4a9a03846d071eb40b30f026f425e25d1'],
  challenge:['jinshu127-unscanned-v7-independent-challenge-20261020-incomplete.md','b81cad9e23c5521900af7ec99ae3d6255607e8ec8b783d8c37b9110c10be285e'],
  reviewPacket:['jinshu127-reconcile-isolated-20261019/jinshu127-unscanned-review-packet-v7-20261020-incomplete.json','3f1bd4db70ffc765b6d88347cb7039ffa68c8600ced06306dc19697264c5d004'],
};
const read=([name,hash],json=true)=>{const b=fs.readFileSync(path.join(dir,name));if(sha(b)!==hash)throw new Error(`Changed input ${name}`);return json?JSON.parse(b):b.toString('utf8');};
const extraction=read(pins.extraction), packet=read(pins.packet), source=read(pins.source), history=read(pins.history), reviewPacket=read(pins.reviewPacket);
for(const key of ['previousReview','sourceReview','challenge']) read(pins[key],false);
const rebuilt=buildPeopleExtractionPacket('jinshu','127',{chapterData:source,chapterFile:path.join(dir,'jinshu127-four-field-materialized-20261020-incomplete/source.json')});
if(!isDeepStrictEqual(rebuilt,packet)) throw new Error('Stale packet');
const before=validateCompactPeopleExtraction(extraction,packet,{strictAliasDispositions:true});
validateAppliedEditorialDecisions(history,before.normalized);
const specs=[
  {unit:'s0056',person:'p019',kind:'personal-name',exact:'Zhang',occurrence:1,zh:'言章師老'},
  {unit:'s0085',person:'p042',kind:'title-reference',exact:'heir emperor',occurrence:0,zh:'嗣帝奔亡'},
  {unit:'s0192',person:'p109',kind:'personal-name',exact:'Xiong',occurrence:0,zh:'臣父雄年逾六十'},
  {unit:'s0273',person:'p162',kind:'personal-name',exact:'Chao',occurrence:0,zh:'何不早立超為太子'},
];
const original=structuredClone(extraction), geometry=[];
for(const s of specs){
  const u=packet.units.find(u=>u.id===s.unit), item=reviewPacket.items.find(x=>x.unit===s.unit && x.span.exact===s.exact && x.span.occurrence===s.occurrence);
  if(!u || !u.zh.includes(s.zh) || !item || item.source.zh!==u.zh || item.source.en!==u.en || !item.people.includes(`jinshu:127:${s.person}`)) throw new Error(`Stale evidence ${s.unit}`);
  const chars=Array.from(u.en), target=Array.from(s.exact);let starts=[];
  for(let i=0;i<=chars.length-target.length;i++) if(target.every((ch,j)=>chars[i+j]===ch)) starts.push(i);
  const start=starts[s.occurrence],end=start+target.length;
  if(start===undefined || item.span.startCodePoint!==start || item.span.endCodePoint!==end || item.span.unitTextHash!==u.enHash) {
    // unit packet calls the unit text hash enHash only in some formats; verify against independently computed bytes.
    const unitHash=`sha256:${sha(Buffer.from(u.en))}`;
    if(start===undefined || item.span.startCodePoint!==start || item.span.endCodePoint!==end || item.span.unitTextHash!==unitHash) throw new Error(`Stale coordinates ${s.unit}`);
  }
  if(!extraction.people.some(row=>row[0]===s.person)) throw new Error(`Missing person ${s.person}`);
  const overlaps=before.normalized.mentions.flatMap(m=>m.unit.id!==s.unit?[]:m.spans.en.filter(span=>span.startCodePoint<end && start<span.endCodePoint).map(span=>({person:m.person,span})));
  if(overlaps.length) throw new Error(`Existing overlapping mention ${s.unit}: ${JSON.stringify(overlaps)}`);
  if(packet.preflight.candidates.some(c=>c.unit===s.unit && c.language==='en' && c.startCodePoint<end && start<c.endCodePoint)) throw new Error(`Unexpected scanner candidate overlap ${s.unit}`);
  const added=[s.person,s.kind,'en',s.exact,[[s.unit,[s.occurrence]]]];
  extraction.surfaces.push(added);geometry.push({unit:s.unit,person:s.person,exact:s.exact,occurrence:s.occurrence,startCodePoint:start,endCodePoint:end,added});
}
const restored=structuredClone(extraction);restored.surfaces.splice(-specs.length);
if(!isDeepStrictEqual(restored,original)) throw new Error('Changes exceed the four additions');
const checked=validateCompactPeopleExtraction(extraction,packet,{strictAliasDispositions:true});
validateAppliedEditorialDecisions(history,checked.normalized);
for(const s of geometry){const m=checked.normalized.mentions.filter(m=>m.person===`jinshu:127:${s.person}` && m.unit.id===s.unit && m.spans.en.some(x=>x.exact===s.exact && x.occurrence===s.occurrence && x.startCodePoint===s.startCodePoint && x.endCodePoint===s.endCodePoint));if(m.length!==1)throw new Error(`Missing validated span ${s.unit}`);}
const bytes=Buffer.from(`${JSON.stringify(extraction,null,2)}\n`);
const receipt={status:'research-only-held-independent-review-required',stagingScriptsRevision:'303b4e0fe883d4d305d84987b656322a91e5c3a4',fixture,scriptHashes:scripts,inputHashes:Object.fromEntries(Object.entries(pins).map(([k,v])=>[k,v[1]])),extractionSha256:sha(bytes),chapterFingerprint:packet.input.chapterFingerprint,geometry,validation:{strictAliasDispositions:true,appliedHistory:true,exactAdditionsOnly:true,nonoverlap:true,stats:checked.stats},limitations:['Independent review of these exact additions is required.','Generated mention IDs may change; downstream artifacts depending on them need regeneration and validation.','Other reconciliation, editorial, date, identity and publication work remains unapproved.','No canonical files, Git, queue or locks changed.']};
const out=path.join(dir,'jinshu127-four-missing-mentions-candidate-20261020-incomplete');fs.mkdirSync(out);
fs.writeFileSync(path.join(out,'extraction.json'),bytes,{flag:'wx',mode:0o600});fs.writeFileSync(path.join(out,'receipt.json'),`${JSON.stringify(receipt,null,2)}\n`,{flag:'wx',mode:0o600});
console.log(JSON.stringify({out,receipt},null,2));
