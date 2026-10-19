// Research only: these assert the currently observed unsafe heuristic outcomes,
// not desired production behavior. Run with the prototype's loader enabled.
import test from 'node:test';
import assert from 'node:assert/strict';
import { exactSpanAt } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-content.mjs';
import { reconcileExtractionAfterRepairs } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs';

assert.equal(process.env.PEOPLE_TRANSFER_PROTOTYPE, '1', 'Use the hash-checking prototype loader');
const unit = (id, en, itemIndex) => ({ id, kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex, zh: '', en, literal: en });
const earlier = unit('s0000', 'Xyzzy is a place.', 0);
const first = unit('s0001', 'Xyzzy spoke.', 1);
const second = unit('s0002', 'Xyzzy appeared.', 2);
const candidate = (id, u) => ({ id, unit: u.id, language: 'en', ...exactSpanAt(u.en, 'Xyzzy', 0), detectors: [] });
const prior = candidate('old', earlier);
const added = candidate('new', second);
const packet = candidates => ({ book: 'fixture', chapter: '001', input: {}, units: [earlier, first, second], preflight: { candidates } });
const person = localId => ({ localId, preferredNameSuggestion: { en: 'Xyzzy', zh: null }, identityHints: { polityHints: [], activeDateHints: [], relatedLocalPeople: [] } });
const claim = (id, subject) => ({ id, subject, predicate: 'name', value: { kind: 'personal-name', en: 'Xyzzy' }, certainty: 'explicit', evidence: ['fixture:001:s0001'] });
const mention = { id: 'm1', person: 'p1', unit: { id: first.id, kind: first.kind, blockIndex: 0, collection: first.collection, itemIndex: 1 }, kind: 'personal-name', spans: { zh: [], en: [exactSpanAt(first.en, 'Xyzzy', 0)] }, candidateRefs: [] };

function run(people, mentions, claims) {
  const extraction = { book: 'fixture', chapter: '001', input: {}, people, mentions, claims, translationRepairs: [], candidateDispositions: [{ candidate: 'old', disposition: 'not-person', reason: 'place', note: null }], coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] } };
  return reconcileExtractionAfterRepairs(extraction, packet([prior, added]), { previousPacket: packet([prior]) });
}
function assertObservedLink(result) {
  assert.equal(result.unresolvedCandidates.includes('new'), false);
  assert.equal(result.extraction.mentions.find(m => m.candidateRefs.includes('new'))?.person, 'p1');
}

test('a global exact alias supplies a link without local identity evidence', () => {
  assertObservedLink(run([person('p1')], [], [claim('c1', 'p1')]));
});
test('a preceding mention supplies a link despite two different identical-name people', () => {
  assertObservedLink(run([person('p1'), person('p2')], [mention], [claim('c1', 'p1'), claim('c2', 'p2')]));
});
