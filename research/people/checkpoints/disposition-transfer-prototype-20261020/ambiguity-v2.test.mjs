// Adapted from the independent reviewer's preserved adversarial fixture.
import test from 'node:test';
import assert from 'node:assert/strict';
import { exactSpanAt } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-content.mjs';
import { reconcileExtractionAfterRepairs } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs';
assert.equal(process.env.PEOPLE_TRANSFER_PROTOTYPE, '2');
const unit = (id, en, itemIndex) => ({ id, kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex, zh: '', en, literal: en });
const earlier = unit('s0000', 'Xyzzy is a place.', 0), first = unit('s0001', 'Xyzzy spoke.', 1), second = unit('s0002', 'Xyzzy appeared.', 2);
const candidate = (id, u) => ({ id, unit: u.id, language: 'en', ...exactSpanAt(u.en, 'Xyzzy', 0), detectors: [] });
const prior = candidate('old', earlier), added = candidate('new', second);
const packet = candidates => ({ book: 'fixture', chapter: '001', input: {}, units: [earlier, first, second], preflight: { candidates } });
const person = localId => ({ localId, preferredNameSuggestion: { en: 'Xyzzy', zh: null }, identityHints: { polityHints: [], activeDateHints: [], relatedLocalPeople: [] } });
const claim = (id, subject, unitId = 's0001') => ({ id, subject, predicate: 'name', value: { kind: 'personal-name', en: 'Xyzzy' }, certainty: 'explicit', evidence: [`fixture:001:${unitId}`] });
const mention = u => ({ id: `m-${u.id}`, person: 'p1', unit: { id: u.id, kind: u.kind, blockIndex: 0, collection: u.collection, itemIndex: u.itemIndex }, kind: 'personal-name', spans: { zh: [], en: [exactSpanAt(u.en, 'Xyzzy', 0)] }, candidateRefs: [] });
function run(people, mentions, claims) {
  const extraction = { book: 'fixture', chapter: '001', input: {}, people, mentions, claims, translationRepairs: [], candidateDispositions: [{ candidate: 'old', disposition: 'not-person', reason: 'place', note: null }], coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] } };
  return reconcileExtractionAfterRepairs(extraction, packet([prior, added]), { previousPacket: packet([prior]) });
}
function assertUnresolved(result) {
  assert.ok(result.unresolvedCandidates.includes('new'));
  assert.equal(result.extraction.mentions.some(m => m.candidateRefs.includes('new')), false);
  assert.equal(result.extraction.candidateDispositions.some(d => d.candidate === 'new'), false);
}
test('global unique name does not establish local identity', () => assertUnresolved(run([person('p1')], [], [claim('c1','p1')])));
test('preceding unit cannot disambiguate identical-name persons', () => assertUnresolved(run([person('p1'),person('p2')], [mention(first)], [claim('c1','p1'),claim('c2','p2')])));
test('exact existing local mention covers the candidate', () => {
  const result = run([person('p1')], [mention(second)], [claim('c1','p1')]);
  assert.equal(result.unresolvedCandidates.includes('new'), false);
  assert.equal(result.extraction.mentions.find(m => m.candidateRefs.includes('new'))?.person, 'p1');
});
test('local name claim retains existing same-unit restoration', () => {
  const result = run([person('p1')], [], [claim('c1','p1','s0002')]);
  assert.equal(result.unresolvedCandidates.includes('new'), false);
  assert.equal(result.extraction.mentions.find(m => m.candidateRefs.includes('new'))?.person, 'p1');
});
test('local claim does not auto-link an ambiguous repeated same-unit surface', () => {
  const u = unit('s0002', 'Xyzzy and Xyzzy appeared.', 2);
  const firstCandidate = candidate('a', u);
  const secondCandidate = { ...candidate('b', u), ...exactSpanAt(u.en, 'Xyzzy', 1) };
  const extraction = { book: 'fixture', chapter: '001', input: {}, people: [person('p1')], mentions: [], claims: [claim('c1','p1','s0002')], translationRepairs: [], candidateDispositions: [], coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] } };
  const revised = { ...packet([firstCandidate, secondCandidate]), units: [earlier, first, u] };
  const result = reconcileExtractionAfterRepairs(extraction, revised);
  assert.deepEqual(new Set(result.unresolvedCandidates), new Set(['a','b']));
  assert.equal(result.extraction.mentions.length, 0);
});
