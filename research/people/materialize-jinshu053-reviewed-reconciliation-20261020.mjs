// Isolated research draft only; never writes canonical chapter or approval files.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import {validatePeopleExtraction} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import {validateAppliedEditorialDecisions} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import {buildEditorialReviewDossierFromLoaded} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-editorial-review.mjs';

const root='data/people/generated/jinshu-identity-ref-64521198-20261018';
const base=`${root}/jinshu053-merged-reviewed-simulation-v2-incomplete-20261020`;
const out=`${root}/jinshu053-source-reviewed-reconciliation-v1-incomplete-20261020`;
const hash=b=>createHash('sha256').update(b).digest('hex');
const expected={'source.json':'a810ace8d38f97313800c968c6858373dc08c98ef08440dfa56e6907a9bd950c','candidate-unreviewed-reconciliation.json':'1c55e8f6b5c1637485e6a4603d3d0006f42f88c686725fc2b583de9914a15519','editorial-history.json':'30b09ad788522860bd04293c199a03e7f388569ec15314eb53ee2ac8de08a767'};
const bytes=Object.fromEntries(Object.entries(expected).map(([n,h])=>{const b=fs.readFileSync(`${base}/${n}`);assert.equal(hash(b),h,n);return [n,b]}));
const source=JSON.parse(bytes['source.json']);
const extraction=JSON.parse(bytes['candidate-unreviewed-reconciliation.json']);
const history=JSON.parse(bytes['editorial-history.json']);
const packet=buildPeopleExtractionPacket('jinshu','053',{chapterData:source});
assert.equal(packet.input.chapterFingerprint,'sha256:40fa800060e3025f9b63ce7a3b201609c9d7797353e3344ef34814443646172e');
const candidateId=s=>`jinshu:053:cand_${s}`;
const personId=s=>`jinshu:053:p${s}`;
const mention=(id)=>{const matches=extraction.mentions.filter(m=>m.id===`jinshu:053:${id}`);assert.equal(matches.length,1,id);return matches[0]};
const clearDisposition=id=>{const before=extraction.candidateDispositions.length;extraction.candidateDispositions=extraction.candidateDispositions.filter(d=>d.candidate!==id);assert(before-extraction.candidateDispositions.length<=1,id)};
const addRefs=(m,suffixes)=>{for(const s of suffixes){const id=candidateId(s);clearDisposition(id);assert(!m.candidateRefs.includes(id));m.candidateRefs.push(id)}};
const unit=(id)=>{const u=packet.units.find(u=>u.id===id);assert(u,id);return u};
let nextId=9001;
const addMention=(id,person,kind,exact,suffixes)=>{
  const u=unit(id), text=u.en, start=[...text.slice(0,text.indexOf(exact))].length;
  assert(text.includes(exact),`${id} ${exact}`);assert.equal(text.indexOf(exact),text.lastIndexOf(exact),`${id} ${exact} nonunique`);
  const ref={id:u.id,kind:u.kind,blockIndex:u.blockIndex,collection:u.collection,itemIndex:u.itemIndex};
  const m={id:`jinshu:053:m${nextId++}`,person:personId(person),unit:ref,kind,spans:{zh:[],en:[{exact,occurrence:0,startCodePoint:start,endCodePoint:start+[...exact].length,unitTextHash:`sha256:${hash(Buffer.from(text))}`}]},candidateRefs:[]};
  assert(!extraction.mentions.some(old=>old.id===m.id));extraction.mentions.push(m);addRefs(m,suffixes);return m;
};
// Existing whole-title links: replace mistaken automatic not-person dispositions.
for(const [m,ids] of [
 ['m0036',['194668bbf5e9ac56']],['m0199',['e52f72d263aa7470']],
 ['m0240',['200b2d13ba5a3bd6']],['m0242',['6b8390c3b5e7e7f5']],
 ['m0447',['64a2c5fedcc5df96']],['m0466',['b0652f53467c579a']],
 ['m0474',['5021a0321e0edaa8']]
]) addRefs(mention(m),ids);
// Create reviewed whole title / name spans; each substring candidate is covered once.
addMention('s0017','027','title-reference','Lady Jiang',['dc3cdc7da8dba67c']);
addMention('s0063','051','title-reference','General-in-Chief Sima Rong',['c7b50c21e83f5cb3']);
addMention('s0063','054','title-reference','Prince of Zhao',['25dcca266b0a27dd']);
addMention('s0108','054','title-reference','Lun, Prince of Zhao',['c24d32ff69ebaf50','53e4f0d3d4cdc1db','a7ced6d11ecdf1da']);
addMention('s0111','054','title-reference','Prince of Zhao',['9e13cb8aefd7aadf','8b50d48c050cf12b']);
addMention('s0174','068','title-reference','Prince of Linhuai',['6f06d15ca1c4a827']);
addMention('s0179','054','title-reference','Lun, Prince of Zhao',['c558ac3414829511','789300eaa5a46e24','8448bc18029fb928']);
addMention('s0183','054','title-reference','Lun, Prince of Zhao',['a9b9b1b7929dc11c','e70a7bd4b71a0007','0c939602d7e61a50']);
// Preserve the actual old candidate reference, but move it to He Yu, not the prince.
const wrongYu=mention('m0234');assert.equal(wrongYu.person,personId('001'));assert.deepEqual(wrongYu.candidateRefs,[candidateId('333b09cb95859bf6')]);
extraction.mentions=extraction.mentions.filter(m=>m!==wrongYu);
addMention('s0063','049','personal-name','He Yu',['333b09cb95859bf6']);
// Jia in the family/faction phrase is not an individual. Do not erase Empress Jia.
const wrongJia=mention('m0346');assert.equal(wrongJia.person,personId('026'));assert.deepEqual(wrongJia.candidateRefs,[candidateId('5a0e2c2625fec491')]);
extraction.mentions=extraction.mentions.filter(m=>m!==wrongJia);
extraction.candidateDispositions.push({candidate:candidateId('5a0e2c2625fec491'),disposition:'not-person',reason:'collective',note:'Jia family/faction qualifier, not the empress as an individual.'});
for(const suffix of ['d007b642bf81eeaf','86dce4b95424d9fb']) extraction.candidateDispositions.push({candidate:candidateId(suffix),disposition:'not-person',reason:'not-a-name',note:'Exclamation.'});
// The review supports non-person readings of all other automatic dispositions.
// Honorific components were instead linked to full source-supported titles above.
// Follow the production reconciliation's stable deterministic mention ordering.
extraction.mentions.sort((a,b)=>{const as=[...a.spans.zh,...a.spans.en][0];const bs=[...b.spans.zh,...b.spans.en][0];return a.unit.blockIndex-b.unit.blockIndex||a.unit.itemIndex-b.unit.itemIndex||a.unit.id.localeCompare(b.unit.id)||(as?.startCodePoint??0)-(bs?.startCodePoint??0)||a.person.localeCompare(b.person)});
for(const [index,m] of extraction.mentions.entries())m.id=`jinshu:053:m${String(index+1).padStart(4,'0')}`;
const validated=validatePeopleExtraction(extraction,packet,{strictAliasDispositions:true});
validateAppliedEditorialDecisions(history,validated.normalized);

// Prepare, but do not decide, the seven separately independently reviewed proposals.
const proposed=structuredClone(validated.normalized);
const unitText=id=>source.content.flatMap(b=>b.sentences??[]).find(s=>s.id===id).translations.find(t=>t.lang==='en');
const changes=[
 ['s0065','literal',"Dan sent armed guards to escort Crown Princess Wang and the three imperial grandsons to Jinyong City; Consort Xie and Jiang Jun, a baolin of the crown prince, were interrogated to death."],
 ['s0065','idiomatic',"Dan sent armed guards to escort Crown Princess Wang and the three imperial grandsons to Jinyong City; Consort Xie and Jiang Jun, one of the crown prince's consorts with the rank of baolin, were interrogated to death."],
 ['s0131','literal',"When Deposed Commoner Jia died, they executed Liu Zhen, Sun Lü, Cheng Ju, and others, and restored the crown prince by patent, saying: 'The emperor sends an envoy bearing the tally, Commandant of the Guard Yi, concurrently serving as Director of Works, to announce by patent to the spirit of the late crown prince: Alas!"],
 ['s0132','literal',"In youth you bore a nature quick and wise; you received the late emperor's extraordinary favor. He greatly opened your domain and gave you possession of Huailing."],
 ['s0132','idiomatic',"From youth you showed remarkable intelligence. You received the late emperor's extraordinary favor: he granted you a great domain and possession of Huailing."],
 ['s0172','literal','In the fourth month, he was posthumously enfeoffed as Prince of Nanyang.'],
 ['s0172','idiomatic','In the fourth month, he was posthumously made Prince of Nanyang.']
];
for(const [id,field,after] of changes){const before=unitText(id)[field];assert.notEqual(before,after);const u=unit(id);const ref={id:u.id,kind:u.kind,blockIndex:u.blockIndex,collection:u.collection,itemIndex:u.itemIndex};proposed.translationRepairs.push({id:`jinshu:053:r${String(proposed.translationRepairs.length+1).padStart(4,'0')}`,unit:ref,field,before,after,reason:'Source-backed proposed correction; independently reviewed in separate retained research. The decision scaffold is intentionally blank pending production-seal review.',confidence:'high',status:'proposed'});}
const proposedValidated=validatePeopleExtraction(proposed,packet,{strictAliasDispositions:true});
validateAppliedEditorialDecisions(history,proposedValidated.normalized);
const dossier=buildEditorialReviewDossierFromLoaded('jinshu',{chapterId:'053',packet,extraction:proposedValidated.normalized},{context:2});
assert.equal(dossier.items.length,7);assert.equal(dossier.decisionSeed.decisions.length,7);assert(dossier.decisionSeed.decisions.every(d=>d.reason===''&&d.sourceWitness===null));
assert(!fs.existsSync(out),'Refusing existing destination');fs.mkdirSync(out);
const outputs={'source.json':bytes['source.json'],'reconciled-extraction.json':Buffer.from(`${JSON.stringify(validated.normalized,null,2)}\n`),'editorial-history.json':bytes['editorial-history.json'],'proposed-extraction.json':Buffer.from(`${JSON.stringify(proposedValidated.normalized,null,2)}\n`),'dossier.json':Buffer.from(`${JSON.stringify(dossier,null,2)}\n`),'blank-decision-seed.json':Buffer.from(`${JSON.stringify(dossier.decisionSeed,null,2)}\n`)};
for(const [name,b] of Object.entries(outputs))fs.writeFileSync(`${out}/${name}`,b,{flag:'wx'});
const manifest={status:'INCOMPLETE research-only materialization; not canonical, not publication approval',inputSha256:expected,outputSha256:Object.fromEntries(Object.entries(outputs).map(([n,b])=>[n,hash(b)])),chapterFingerprint:packet.input.chapterFingerprint,proposalFingerprint:dossier.decisionSeed.input.proposalsFingerprint,reviewEvidence:['jinshu053-reviewed98-reconciliation-independent-findings-incomplete-20261020.md','jinshu053-reviewed98-reconciliation-second-independent-review-incomplete-20261020.md','jinshu053-baolin-yi-editorial-independent-review-incomplete-20261020.md'],stats:validated.stats,remaining:'Seven-proposal decisions are blank; transcribe genuine separate review only under approved workflow. Claim c0106, Sima Rong claims, s0017 child identification, source lacuna, remaining editorial defects, fresh reconciliation after edits, independent date and identity audits, production validator and publication gates remain open. The 31-candidate review does not establish full chapter coverage.',validator:'isolated staging-pinned fixture only'};
fs.writeFileSync(`${out}/manifest.json`,`${JSON.stringify(manifest,null,2)}\n`,{flag:'wx'});console.log(JSON.stringify({out,...manifest},null,2));
