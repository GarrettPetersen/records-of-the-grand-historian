// Offline negative controls against an isolated staging-code fixture. Expected
// to fail until all three unsafe inheritance paths are independently fixed.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const fixture = resolve(process.argv[2] ?? '');
if (!fixture.startsWith('/tmp/jinshu129-failclosed.') || process.env.PEOPLE_REPO_ROOT !== fixture) throw Error('Dedicated fixture required');
function load(file, expected) {
  const bytes = readFileSync(file);
  if (createHash('sha256').update(bytes).digest('hex') !== expected) throw Error(`Stale input: ${file}`);
  return JSON.parse(bytes);
}
const source = load('data/jinshu/129.json', 'bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800');
const dossier = load('research/people/jinshu129-rebased-editorial-dossier-20261020-incomplete.json', '758a8584f2430eb8604bef47bfb21cd34822d318a483485e63ec54c0a725e367');
const mod = name => import(pathToFileURL(join(fixture, 'scripts', name)).href);
const { buildPeopleExtractionPacket } = await mod('build-people-extraction-packet.mjs');
const { validateCompactPeopleExtraction } = await mod('validate-people-extraction.mjs');
const { reconcileExtractionAfterRepairs } = await mod('lib/people-translation-repairs.mjs');
const before = buildPeopleExtractionPacket('jinshu', '129', {chapterData:source});
const extraction = validateCompactPeopleExtraction(dossier.candidate, before, {strictAliasDispositions:true}).normalized;
const failures = [];
function check(label, result, id) {
  const dispositions = result.extraction.candidateDispositions.filter(d => d.candidate === id);
  const mentions = result.extraction.mentions.filter(m => m.candidateRefs.includes(id)).map(m => ({person:m.person, unit:m.unit.id}));
  if (!result.unresolvedCandidates.includes(id) || dispositions.length || mentions.length) failures.push({label,id,dispositions,mentions});
}
// Keep the token and occurrence unchanged while altering its surrounding text.
const changed = structuredClone(source);
const sentence = changed.content.flatMap(block => block.sentences ?? []).find(s => s.id === 's0184');
const english = sentence?.translations?.find(t => t.lang === 'en');
if (!english?.idiomatic.includes('visit to Yi and submitted')) throw Error('Fixture source no longer matches');
english.idiomatic = english.idiomatic.replace('visit to Yi and submitted', 'visit to Yi in the east and submitted');
const after = buildPeopleExtractionPacket('jinshu', '129', {chapterData:changed});
const existingId = 'jinshu:129:cand_8a551c2a741c2b24';
assert(before.preflight.candidates.some(c => c.id === existingId));
assert(after.preflight.candidates.some(c => c.id === existingId), 'negative control requires a surviving ID');
check('changed context with surviving candidate ID', reconcileExtractionAfterRepairs(extraction, after, {previousPacket:before}), existingId);
// A new occurrence in a new unit must not inherit an existing personal alias.
const syntheticAfter = structuredClone(before);
const unit = (id, zh, en) => ({id, kind:'paragraph-sentence', blockIndex:9999, collection:'sentences', itemIndex:0, zh,en,literal:en});
const candidate = (id, unitId, language, exact) => ({id:`jinshu:129:${id}`,unit:unitId,language,exact,occurrence:0,startCodePoint:0,endCodePoint:[...exact].length,detectors:[{kind:'chinese-notes-proper-noun',glossaryId:68815}]});
syntheticAfter.units.push(unit('s9999','軒轅星現','Morpheus appeared.'));
const star = candidate('cand_fixture_star', 's9999', 'zh', '軒轅');
syntheticAfter.preflight.candidates.push(star);
assert(extraction.people.some(p => p.localId === 'jinshu:129:p122'), 'real Yellow Thearch person is retained');
check('new asterism versus existing person alias', reconcileExtractionAfterRepairs(extraction, syntheticAfter, {previousPacket:before}), star.id);
// Same glossary ID in two languages does not prove co-reference in one unit.
const bilingualBefore = structuredClone(before), bilingualAfter = structuredClone(before), bilingualExtraction = structuredClone(extraction);
bilingualBefore.units.push(unit('s9998','軒轅','Morpheus'));
bilingualAfter.units.push(unit('s9998','軒轅','Morpheus'));
const zh = candidate('cand_fixture_bilingual_zh','s9998','zh','軒轅');
const en = candidate('cand_fixture_bilingual_en','s9998','en','Morpheus');
bilingualBefore.preflight.candidates.push(zh);
bilingualAfter.preflight.candidates.push(zh,en);
bilingualExtraction.candidateDispositions.push({candidate:zh.id, disposition:'not-person', reason:'other', note:'Synthetic Chinese asterism'});
check('same-unit bilingual glossary ID is not co-reference', reconcileExtractionAfterRepairs(bilingualExtraction, bilingualAfter, {previousPacket:bilingualBefore}), en.id);
assert.deepEqual(failures, [], `Unreviewed classifications or links require review: ${JSON.stringify(failures,null,2)}`);
console.log('PASS: all changed-context and homograph negative controls remain unresolved');
