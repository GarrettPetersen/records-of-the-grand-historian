// Research-only: add the independently witnessed s0191 mother surface.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath,pathToFileURL} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const fixture = '/tmp/jinshu127-editorial-fixture.iM9uIsV8';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const scripts = {
  'validate-people-extraction.mjs':'33b59627388be1735eae3a05fb0b36b4580eb8b2c4924b063f2f7ad66e1af2c6',
  'build-people-extraction-packet.mjs':'6561e28aed4a472fb6bba80b84728b395b3254f893a4b9b42c8939ecff195245',
  'lib/people-editorial-decisions.mjs':'8c61394d8376d4c13263341f2a054a55bd67ed227da63f11a822050cfc1f0af6',
};
for (const [name, hash] of Object.entries(scripts)) if (sha(fs.readFileSync(path.join(fixture,'scripts',name))) !== hash) throw new Error(`Changed fixture script ${name}`);
const moduleAt = name => import(pathToFileURL(path.join(fixture,'scripts',name)).href);
const {validateCompactPeopleExtraction} = await moduleAt('validate-people-extraction.mjs');
const {buildPeopleExtractionPacket} = await moduleAt('build-people-extraction-packet.mjs');
const {validateAppliedEditorialDecisions} = await moduleAt('lib/people-editorial-decisions.mjs');
const pins = {
  extraction:['jinshu127-s0191-de-corrected-20261020-incomplete/extraction.json','739152aea5f690b2f56faba4f2c480deda3c8a77b4ff3427c9c609a3e468ca8d'],
  packet:['jinshu127-two-field-materialized-held-20261020-incomplete/packet.json','cd6ab556fb0b323f639d2cf46013312e78a8868379cf053f1678f40c013b4701'],
  source:['jinshu127-two-field-materialized-held-20261020-incomplete/source.json','ca683ed09f79724fe107185f6f1e5f5ded2378999ea887ce910432eb127dd3b3'],
  history:['jinshu127-two-field-materialized-held-20261020-incomplete/editorial-history.json','093ceb5a45d1be3500d1449ebdfbd4d304081049fd11e7257a50d1d93b26917e'],
  sourceReview:['jinshu127-unscanned-v7-independent-source-review-20261020-incomplete.md','253daa741e63dcbf21906b26e77b51d4a9a03846d071eb40b30f026f425e25d1'],
  independentChallenge:['jinshu127-unscanned-v7-independent-challenge-20261020-incomplete.md','b81cad9e23c5521900af7ec99ae3d6255607e8ec8b783d8c37b9110c10be285e'],
};
const read = ([name,hash], json=true) => {const bytes=fs.readFileSync(path.join(dir,name)); if(sha(bytes)!==hash) throw new Error(`Changed input ${name}`);return json ? JSON.parse(bytes) : bytes.toString('utf8');};
const extraction=read(pins.extraction), packet=read(pins.packet), source=read(pins.source), history=read(pins.history);
if (!read(pins.sourceReview,false).includes('s0191') || !read(pins.independentChallenge,false).includes('mother` [5,11)')) throw new Error('Missing independent witness');
const rebuilt=buildPeopleExtractionPacket('jinshu','127',{chapterData:source,chapterFile:path.join(dir,'jinshu127-four-field-materialized-20261020-incomplete/source.json')});
if(!isDeepStrictEqual(rebuilt,packet)) throw new Error('Stale packet');
const unit=packet.units.find(x=>x.id==='s0191');
if(!unit.zh.startsWith('德母兄先在長安') || Array.from(unit.en).slice(5,11).join('')!=='mother' || !unit.en.startsWith("De's mother and elder brother")) throw new Error('Unexpected source');
const before=validateCompactPeopleExtraction(extraction,packet,{strictAliasDispositions:true});
validateAppliedEditorialDecisions(history,before.normalized);
const originals=structuredClone(extraction);
const motherZh=extraction.surfaces.find(row=>row[0]==='p106' && row[1]==='kinship-reference' && row[2]==='zh' && row[3]==='母' && row[4].some(loc=>loc[0]==='s0191'));
if(!motherZh || extraction.surfaces.some(row=>row[0]==='p106' && row[1]==='kinship-reference' && row[2]==='en' && row[3]==='mother' && row[4].some(loc=>loc[0]==='s0191'))) throw new Error('Mother surface missing or already added');
const added=['p106','kinship-reference','en','mother',[['s0191',[0]]]];
extraction.surfaces.push(added);
const restored=structuredClone(extraction);
if(!isDeepStrictEqual(restored.surfaces.pop(),added) || !isDeepStrictEqual(restored,originals)) throw new Error('Unexpected other changes');
const checked=validateCompactPeopleExtraction(extraction,packet,{strictAliasDispositions:true});
validateAppliedEditorialDecisions(history,checked.normalized);
const spans = (person,text) => checked.normalized.mentions.filter(m=>m.person===person && m.unit.id==='s0191').flatMap(m=>m.spans.en.filter(s=>s.exact===text));
const mother=spans('jinshu:127:p106','mother'), de=spans('jinshu:127:p078','De'), empress=spans('jinshu:127:p106','empress dowager');
if(mother.length!==1 || mother[0].startCodePoint!==5 || mother[0].endCodePoint!==11 || de.length!==1 || de[0].startCodePoint!==0 || de[0].endCodePoint!==2 || empress.length!==1 || empress[0].startCodePoint<11) throw new Error('Unexpected mention geometry');
const beforeRefs=before.normalized.mentions.filter(m=>m.person==='jinshu:127:p078' && m.unit.id==='s0191').flatMap(m=>m.candidateRefs);
const afterRefs=checked.normalized.mentions.filter(m=>m.person==='jinshu:127:p078' && m.unit.id==='s0191').flatMap(m=>m.candidateRefs);
if(!isDeepStrictEqual(beforeRefs,afterRefs) || !afterRefs.includes('jinshu:127:cand_9831e41404c31316')) throw new Error('Existing De candidate reference changed');
const bytes=Buffer.from(`${JSON.stringify(extraction,null,2)}\n`);
const receipt={status:'research-only-held-independent-review-required',stagingScriptsRevision:'303b4e0fe883d4d305d84987b656322a91e5c3a4',fixture,scriptHashes:scripts,inputHashes:Object.fromEntries(Object.entries(pins).map(([k,v])=>[k,v[1]])),extractionSha256:sha(bytes),chapterFingerprint:packet.input.chapterFingerprint,addedSurface:added,geometry:{de:de[0],mother:mother[0],empressDowager:empress[0]},validation:{strictAliasDispositions:true,appliedHistory:true,exactAdditionOnly:true,stats:checked.stats},limitations:['Independent review of this exact correction is required.','Generated mention IDs may change; downstream artifacts depending on them must be regenerated and revalidated.','Other reconciliation, editorial, date, identity and publication work remains unapproved.','No canonical files, Git, queue or locks changed.']};
const out=path.join(dir,'jinshu127-s0191-mother-corrected-20261020-incomplete');
fs.mkdirSync(out);
fs.writeFileSync(path.join(out,'extraction.json'),bytes,{flag:'wx',mode:0o600});
fs.writeFileSync(path.join(out,'receipt.json'),`${JSON.stringify(receipt,null,2)}\n`,{flag:'wx',mode:0o600});
console.log(JSON.stringify({out,receipt},null,2));
