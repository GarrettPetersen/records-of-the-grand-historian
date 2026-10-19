// Narrow research revision after independent semantic review; never publishes canonical files.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validatePeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const src = `${root}/jinshu053-seven-selective-reconciliation-v2-20261019-incomplete`;
const dest = `${root}/jinshu053-seven-selective-reconciliation-v3-20261019-incomplete`;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function read(name, expected) { const bytes = fs.readFileSync(`${src}/${name}`); assert.equal(sha(bytes), expected, name); return JSON.parse(bytes); }
const chapter = read('source.json', 'a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d');
const extraction = read('extraction.json', '5467127e8583a80dbf67aea1828a9477fa6ce0762c3d9b7f3201f4eb1d9534d4');
const history = read('editorial-history.json', 'da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7');
const review = read('review-decisions.json', 'e13553b417b78da78b58dfc8e5cb267dd825e60345c72af572a3dcf01c00115a');
const packet = buildPeopleExtractionPacket('jinshu', '053', {chapterData: chapter});
validatePeopleExtraction(extraction, packet, {strictAliasDispositions:true});
const decisions = [
  ['s0037','jinshu:053:cand_2f82781097ad8a15','Jia clan'],
  ['s0039','jinshu:053:cand_1ff92634eb5f2a97','Jia kin'],
  ['s0189','jinshu:053:cand_60911611b781fdae','Jia kin'],
];
const removed = [];
for (const [unit, ref, phrase] of decisions) {
  const text = packet.units.find(u => u.id === unit)?.en; assert(text?.includes(phrase));
  const matches = extraction.mentions.filter(m => m.unit.id === unit && m.person === 'jinshu:053:p026' && m.candidateRefs.includes(ref));
  assert.equal(matches.length, 1, ref); const m = matches[0];
  assert.deepEqual(m.spans.zh, []); assert.equal(m.spans.en.length, 1); assert.equal(m.spans.en[0].exact, 'Jia'); assert.deepEqual(m.candidateRefs, [ref]);
  removed.push(structuredClone(m)); extraction.mentions.splice(extraction.mentions.indexOf(m),1);
  assert(!extraction.candidateDispositions.some(d => d.candidate === ref));
  extraction.candidateDispositions.push({candidate:ref, disposition:'not-person', reason:'collective', note:`${phrase} denotes a group, not the empress as an individual.`});
}
const unit = packet.units.find(u => u.id === 's0132'); const exact = 'late emperor';
const start = unit.en.indexOf(exact); assert(start >= 0 && unit.en.indexOf(exact,start+1) === -1);
const codepointStart = [...unit.en.slice(0,start)].length;
const title = extraction.mentions.find(m => m.unit.id === 's0132' && m.person === 'jinshu:053:p004' && m.spans.zh.some(s => s.exact === '先帝'));
assert(title && title.kind === 'title-reference' && title.spans.en.length === 0);
title.spans.en.push({ exact, occurrence:0, startCodePoint:codepointStart, endCodePoint:codepointStart + [...exact].length, unitTextHash:`sha256:${sha(unit.en)}` });
extraction.mentions.forEach((m,i) => { m.id = `jinshu:053:m${String(i+1).padStart(4,'0')}`; });
const result = validatePeopleExtraction(extraction, packet, {strictAliasDispositions:true});
validateAppliedEditorialDecisions(history, result.normalized);
const delta = {removedMentions:removed, addedDispositions:decisions.map(([unit,candidate,phrase])=>({unit,candidate,phrase,reason:'collective'})), addedEnglishTitle:{unit:'s0132',person:'jinshu:053:p004',exact,startCodePoint:codepointStart}, note:'Only independently reviewed candidate links changed; claims, people, source, and editorial decisions remain unchanged. Research draft, not production approval.'};
assert(!fs.existsSync(dest)); fs.mkdirSync(dest);
const files = {'source.json':chapter,'extraction.json':result.normalized,'editorial-history.json':history,'review-decisions.json':review,'semantic-delta-v3.json':delta};
const hashes={}; for(const [name,value] of Object.entries(files)){const bytes=Buffer.from(`${JSON.stringify(value,null,2)}\n`); fs.writeFileSync(`${dest}/${name}`,bytes,{flag:'wx'});hashes[name]=sha(bytes);}
console.log(JSON.stringify({dest,hashes,stats:result.stats,fingerprint:packet.input.chapterFingerprint,status:'incomplete research; independent verification and downstream gates remain open'},null,2));
