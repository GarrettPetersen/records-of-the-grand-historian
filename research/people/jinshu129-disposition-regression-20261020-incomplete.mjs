// Offline regression: run against a scripts-only staging snapshot, never canonical writes.
// This is not a source review of preserved mention spans; s0183's broad title
// span is independently known to over-link province and polity and needs repair.
// The first proposed patch does NOT pass the retained-alias ambiguity test.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const fixture = resolve(process.argv[2] ?? '');
if (!fixture.startsWith('/tmp/jinshu129-patched-final.') || process.env.PEOPLE_REPO_ROOT !== fixture) throw Error('Dedicated fixture required');
function read(file, expected) {
  const bytes = readFileSync(file);
  if (createHash('sha256').update(bytes).digest('hex') !== expected) throw Error(`Stale input: ${file}`);
  return JSON.parse(bytes);
}
const oldSource = read('data/jinshu/129.json', 'bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800');
const dossier = read('research/people/jinshu129-rebased-editorial-dossier-20261020-incomplete.json', '758a8584f2430eb8604bef47bfb21cd34822d318a483485e63ec54c0a725e367');
const final = read('research/people/jinshu129-final-materialized-20261020-incomplete.json', '3aeaf2fc42220e9beeca59388b778b8988db53542ac3ba49fba8e95e17024c26');
const mod = name => import(pathToFileURL(join(fixture, 'scripts', name)).href);
const { buildPeopleExtractionPacket } = await mod('build-people-extraction-packet.mjs');
const { validateCompactPeopleExtraction } = await mod('validate-people-extraction.mjs');
const { reconcileExtractionAfterRepairs } = await mod('lib/people-translation-repairs.mjs');
const before = buildPeopleExtractionPacket('jinshu', '129', {chapterData:oldSource});
const after = buildPeopleExtractionPacket('jinshu', '129', {chapterData:final.source});
const extraction = validateCompactPeopleExtraction(dossier.candidate, before, {strictAliasDispositions:true}).normalized;
const reconciled = reconcileExtractionAfterRepairs(extraction, after, {previousPacket:before});
const expectations = [
  ['jinshu:129:cand_8dc4288346d219dc', 'jinshu:129:p103', 's0183'],
  ['jinshu:129:cand_d162756b159cff9a', 'jinshu:129:p122', 's0222'],
];
const failures = [];
for (const [id, person, unit] of expectations) {
  const oldCandidate = before.preflight.candidates.find(c => c.id === id);
  const newCandidate = after.preflight.candidates.find(c => c.id === id);
  assert.deepEqual(newCandidate, oldCandidate, `fixture must use the exact unchanged candidate ${id}`);
  assert(extraction.mentions.some(m => m.person === person && m.unit.id === unit && m.candidateRefs.includes(id)), `prior mention ownership missing ${id}`);
  const dispositions = reconciled.extraction.candidateDispositions.filter(d => d.candidate === id);
  const links = reconciled.extraction.mentions.filter(m => m.person === person && m.unit.id === unit && m.candidateRefs.includes(id));
  if (dispositions.length || links.length !== 1) failures.push({id, unit, dispositions, matchingLinks:links.length});
}
assert.deepEqual(failures, [], 'Unchanged mention-covered candidates must not inherit another unit’s disposition');
// A changed scanner ID for the same unchanged occurrence must keep the
// original reviewed disposition, rather than becoming unresolved.
const remappedPacket = structuredClone(after);
const remappedOldId = 'jinshu:129:cand_63f488ae8b3807b9';
const remappedNewId = 'jinshu:129:cand_fixture_remapped';
const remappedCandidate = remappedPacket.preflight.candidates.find(c => c.id === remappedOldId);
assert(remappedCandidate);
remappedCandidate.id = remappedNewId;
const remappedResult = reconcileExtractionAfterRepairs(extraction, remappedPacket, {previousPacket:before});
assert.deepEqual(
  remappedResult.extraction.candidateDispositions.find(d => d.candidate === remappedNewId),
  {candidate:remappedNewId, disposition:'not-person', reason:'other', note:'Xuanyuan names the astronomical asterism in this omen, not the Yellow Thearch.'},
  'same unit and exact mapped occurrence retains its reviewed disposition',
);

// Cross-unit and bilingual homographs cannot acquire the old unit's
// disposition. A new unmatched token must be left for source review.
const ambiguityPacket = structuredClone(after);
ambiguityPacket.units.push({id:'s9999', kind:'paragraph-sentence', blockIndex:9999, collection:'sentences', itemIndex:0, zh:'軒轅星現', en:'Morpheus', literal:'Morpheus'});
const synthetic = (id, unit, language, exact) => ({id:`jinshu:129:${id}`, unit, language, exact, occurrence:0, startCodePoint:0, endCodePoint:[...exact].length, detectors:[{kind:'chinese-notes-proper-noun', glossaryId:68815}]});
const crossUnit = synthetic('cand_fixture_cross_unit', 's9999', 'zh', '軒轅');
const crossLanguage = synthetic('cand_fixture_cross_language', 's9999', 'en', 'Morpheus');
ambiguityPacket.preflight.candidates.push(crossUnit, crossLanguage);
assert(extraction.people.some(p => p.localId === 'jinshu:129:p122'), 'real Yellow Thearch alias remains in the fixture');
const ambiguousResult = reconcileExtractionAfterRepairs(extraction, ambiguityPacket, {previousPacket:before});
for (const candidate of [crossUnit, crossLanguage]) {
  assert(!ambiguousResult.extraction.candidateDispositions.some(d => d.candidate === candidate.id), `new ${candidate.language} candidate inherited another unit's disposition`);
  assert(ambiguousResult.unresolvedCandidates.includes(candidate.id), `new ${candidate.language} candidate should require review; links: ${JSON.stringify(ambiguousResult.extraction.mentions.filter(m => m.candidateRefs.includes(candidate.id)))}`);
}
// Reconciliation also retains the reviewed classification of the same
// occurrence through a sentence edit and the documented same-unit bilingual
// pairing; neither operation borrows evidence from another sentence.
const oldExtra = structuredClone(before);
const newExtra = structuredClone(after);
const fixtureExtraction = structuredClone(extraction);
const unit = (id, en, zh) => ({id, kind:'paragraph-sentence', blockIndex:9998, collection:'sentences', itemIndex:0, zh, en, literal:en});
oldExtra.units.push(unit('s9997', 'Morpheus was a city.', ''));
newExtra.units.push(unit('s9997', 'The Morpheus was a city.', ''));
const oldEdited = synthetic('cand_fixture_old_edit', 's9997', 'en', 'Morpheus');
const newEdited = {...synthetic('cand_fixture_new_edit', 's9997', 'en', 'Morpheus'), startCodePoint:4, endCodePoint:12};
oldExtra.preflight.candidates.push(oldEdited);
newExtra.preflight.candidates.push(newEdited);
fixtureExtraction.candidateDispositions.push({candidate:oldEdited.id, disposition:'not-person', reason:'place', note:'Fixture city'});
oldExtra.units.push(unit('s9998', 'Morpheus', '軒轅'));
newExtra.units.push(unit('s9998', 'Morpheus', '軒轅'));
const zhSameUnit = synthetic('cand_fixture_bilingual_zh', 's9998', 'zh', '軒轅');
const enSameUnit = synthetic('cand_fixture_bilingual_en', 's9998', 'en', 'Morpheus');
oldExtra.preflight.candidates.push(zhSameUnit);
newExtra.preflight.candidates.push(zhSameUnit, enSameUnit);
fixtureExtraction.candidateDispositions.push({candidate:zhSameUnit.id, disposition:'not-person', reason:'other', note:'Fixture asterism'});
const sameUnitResult = reconcileExtractionAfterRepairs(fixtureExtraction, newExtra, {previousPacket:oldExtra});
assert.deepEqual(sameUnitResult.extraction.candidateDispositions.find(d => d.candidate === newEdited.id), {candidate:newEdited.id, disposition:'not-person', reason:'place', note:'Fixture city'}, 'mapped occurrence through a same-unit edit retains its disposition');
assert.deepEqual(sameUnitResult.extraction.candidateDispositions.find(d => d.candidate === enSameUnit.id), {candidate:enSameUnit.id, disposition:'not-person', reason:'other', note:'Fixture asterism'}, 'same-unit bilingual counterpart retains its disposition');
console.log('PASS: previously linked unchanged homograph candidates remain linked');
console.log('PASS: same-occurrence disposition remaps; new cross-unit and cross-language cases remain unresolved');
console.log('PASS: edited-occurrence remapping and same-unit bilingual counterpart');
