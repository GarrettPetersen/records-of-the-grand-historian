// Source-reviewed stale-note cleanup; research only, no canonical publication.
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {isDeepStrictEqual} from 'node:util';

const fixture=resolve(process.argv[2]??'');
if (!fixture.startsWith('/tmp/jinshu129-stale.') || process.env.PEOPLE_REPO_ROOT!==fixture) throw Error('Dedicated fixture required');
const sha=b=>createHash('sha256').update(b).digest('hex');
const path='research/people/jinshu129-precise-mentions-candidate-20261020-incomplete.json';
const bytes=readFileSync(path);
if (sha(bytes)!=='86ca0e189587e6c1fd86f99d11be8c9759da26c4e4309974c25632e229c92496') throw Error('Stale candidate');
const previous=JSON.parse(bytes), candidate=structuredClone(previous.extraction);
const mod=name=>import(pathToFileURL(join(fixture,'scripts',name)).href);
const {buildPeopleExtractionPacket}=await mod('build-people-extraction-packet.mjs');
const {validateCompactPeopleExtraction}=await mod('validate-people-extraction.mjs');
const {validateAppliedEditorialDecisions}=await mod('lib/people-editorial-decisions.mjs');
const packet=buildPeopleExtractionPacket('jinshu','129',{chapterData:previous.source});
const before=validateCompactPeopleExtraction(candidate,packet,{strictAliasDispositions:true}).normalized;
const targets=[
  ['560fb004e59ac078','s0180','en','Qifu','p098','乞伏魋尼寅','Contained in retained mention Qifu Kuini Yin'],
  ['d79aa3be41ba8ee4','s0155','en','Wen Zhi','p088','文支','Contained in retained mention His brother Wen Zhi'],
  ['b8d552029d048e7a','s0156','en','Wen Zhi','p088','文支','Contained in retained mention His brother Wen Zhi'],
  ['4e3f4a1d44f0e570','s0177','en','Lady Che','p095','車氏','Contained in retained mention his mother Lady Che'],
  ['03372e7265bd4926','s0193','en','Hanping','p102','漢平','Contained in retained mention his brother Hanping'],
  ['b7ad6a3e2f16335f','s0195','en','Hanping','p102','漢平','Contained in retained mention his brother Hanping'],
  ['0eef7b493a029b90','s0196','en','Hanping','p102','漢平','Contained in retained mention his brother Hanping'],
  ['fa732e36c743342d','s0217','en','Liu Yu','p118','劉裕','Contained in retained mention Liu Yu, general of chariots and cavalry'],
  ['1d1a8aa69dfa6db8','s0217','zh','劉裕','p118','劉裕','Contained in retained mention 車騎將軍劉裕'],
  ['d26850cd390147a1','s0218','en','Liu Yu','p118','劉裕','Contained in retained mention Liu Yu, general of chariots and cavalry'],
  ['2ad774e489e164e6','s0218','zh','劉裕','p118','劉裕','Contained in retained mention 車騎將軍劉裕'],
  ['da9c82ef41334e05','s0223','en','Liu Yu','p118','裕','Contained in retained mention Liu Yu, general of chariots and cavalry'],
];
for(const [id,unit,language,exact,person,witness,note] of targets){
  const candidateId=`jinshu:129:cand_${id}`, personId=`jinshu:129:${person}`;
  const match=packet.preflight.candidates.filter(c=>c.id===candidateId);
  if(match.length!==1)throw Error(`Candidate missing ${id}`);
  const c=match[0], source=packet.units.find(u=>u.id===unit);
  if(c.unit!==unit||c.language!==language||c.exact!==exact||!source.zh.includes(witness))throw Error(`Source mismatch ${id}`);
  const mentions=before.mentions.filter(m=>m.person===personId&&m.unit.id===unit&&m.spans[language].some(s=>s.startCodePoint<=c.startCodePoint&&s.endCodePoint>=c.endCodePoint));
  if(mentions.length!==1)throw Error(`Expected unique same-unit person span ${id}`);
  const zh=before.mentions.filter(m=>m.person===personId&&m.unit.id===unit&&m.spans.zh.some(s=>s.exact===witness));
  if(zh.length!==1)throw Error(`Missing same-unit Chinese witness ${id}`);
  const found=candidate.candidateDispositions.flatMap(g=>g[2].map((row,i)=>({g,row,i})).filter(x=>x.row[0]===`cand_${id}`));
  if(found.length!==1||!isDeepStrictEqual([found[0].g[0],found[0].g[1],found[0].row[1]],['duplicate-hint','duplicate-candidate',note]))throw Error(`Stale disposition ${id}`);
  found[0].g[2].splice(found[0].i,1);
}
const after=validateCompactPeopleExtraction(candidate,packet,{strictAliasDispositions:true});
validateAppliedEditorialDecisions(previous.editorial,after.normalized);
const rebuilt=structuredClone(candidate);
for(const [id,,,,,,note] of targets){
  const group=rebuilt.candidateDispositions.find(g=>g[0]==='duplicate-hint'&&g[1]==='duplicate-candidate');
  if(!group)throw Error('Missing duplicate group');
  group[2].push([`cand_${id}`,note]);
}
// Compare semantic disposition rows independent of order, then all other fields exactly.
const rows=x=>x.candidateDispositions.flatMap(([d,r,items])=>items.map(([id,n])=>JSON.stringify([d,r,id,n]))).sort();
if(!isDeepStrictEqual(rows(rebuilt),rows(previous.extraction)))throw Error('Unrelated disposition change');
delete rebuilt.candidateDispositions;
const original=structuredClone(previous.extraction);delete original.candidateDispositions;
if(!isDeepStrictEqual(rebuilt,original))throw Error('Unrelated extraction change');
const output={status:'research-only-not-approved',stagingImplementation:'8bfd06b65c815884cf91ba206d3617629e7569d0',previousCandidateSha256:sha(bytes),warning:'Requires distinct independent exact review, full editorial/date/identity and publication gates.',removedStaleHints:targets,stats:after.stats,source:previous.source,extraction:candidate,editorial:previous.editorial};
const result=Buffer.from(`${JSON.stringify(output,null,2)}\n`);
const out='research/people/jinshu129-stale-hints-candidate-20261020-incomplete.json';
writeFileSync(out,result,{flag:'wx',mode:0o600});
console.log(`${out} sha256:${sha(result)}; research only`);
