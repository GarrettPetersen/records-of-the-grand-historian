// Offline diagnostic: detects loss of historical unit fingerprints during
// compact expansion. This tests a synthetic context change, not a source edit.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const fixture = resolve(process.argv[2] ?? '');
if (!fixture.startsWith('/tmp/jinshu129-provenance.') || process.env.PEOPLE_REPO_ROOT !== fixture) throw Error('Dedicated fixture required');
function load(file, expected) {
  const bytes = readFileSync(file);
  if (createHash('sha256').update(bytes).digest('hex') !== expected) throw Error(`Stale input: ${file}`);
  return JSON.parse(bytes);
}
const source = load('data/jinshu/129.json', 'bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800');
const compact = load('data/people/extractions/jinshu/129.json', '91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8');
const mod = name => import(pathToFileURL(join(fixture, 'scripts', name)).href);
const { buildPeopleExtractionPacket } = await mod('build-people-extraction-packet.mjs');
const { buildCompactInput, expandPeopleExtraction } = await mod('lib/people-compact.mjs');
const before = buildPeopleExtractionPacket('jinshu', '129', {chapterData:source});
assert.deepEqual(compact.input, buildCompactInput(before), 'pinned compact input must match original packet');
const changed = structuredClone(source);
const sentence = changed.content.flatMap(block => block.sentences ?? []).find(s => s.id === 's0184');
const english = sentence.translations.find(t => t.lang === 'en');
assert(english.idiomatic.includes('visit to Yi and submitted'));
english.idiomatic = english.idiomatic.replace('visit to Yi and submitted','visit to Yi in the east and submitted');
const after = buildPeopleExtractionPacket('jinshu', '129', {chapterData:changed});
const revisedCompactInput = buildCompactInput(after);
const digest = (input, unit) => input.unitDigests.find(row => row[0] === unit)?.[1];
assert.notEqual(digest(compact.input,'s0184'), digest(revisedCompactInput,'s0184'), 'historical compact fingerprint detects edit');
assert.equal(digest(compact.input,'s0183'), digest(revisedCompactInput,'s0183'), 'unrelated source remains unchanged');
const expanded = expandPeopleExtraction(compact, after, {allowStaleSurfaces:true});
assert.deepEqual(expanded.input, after.input, 'expanded input is the CURRENT packet input');
assert.notDeepEqual(expanded.input, before.input, 'expanded input is not the historical packet input');
const candidateId = 'jinshu:129:cand_8a551c2a741c2b24';
assert(before.preflight.candidates.some(c => c.id === candidateId));
assert(after.preflight.candidates.some(c => c.id === candidateId));
const oldFull = before.input.unitDigests.find(row => row.id === 's0184');
const newFull = after.input.unitDigests.find(row => row.id === 's0184');
const expandedFull = expanded.input.unitDigests.find(row => row.id === 's0184');
assert.notEqual(oldFull.en, newFull.en);
assert.deepEqual(expandedFull, newFull);
console.log(JSON.stringify({status:'diagnostic-only-not-approved', unit:'s0184', candidateId, oldCompactDigest:digest(compact.input,'s0184'), currentCompactDigest:digest(revisedCompactInput,'s0184'), oldEnglishHash:oldFull.en, currentEnglishHash:newFull.en, expandedEnglishHash:expandedFull.en, scannerVersion:{old:compact.input.candidateScannerVersion,current:revisedCompactInput.candidateScannerVersion}},null,2));
