import test from 'node:test';
import assert from 'node:assert/strict';
import { exactSpanAt } from './lib/people-content.mjs';
import { reconcileExtractionAfterRepairs } from './lib/people-translation-repairs.mjs';

const locator = (id, index) => ({ id, kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: index });
const unit = (id, index, en, zh) => ({ ...locator(id, index), en, literal: en, zh });
function candidate(id, unit, exact) {
  return { id, unit: unit.id, language: 'en', ...exactSpanAt(unit.en, exact, 0), detectors: [] };
}
function fixture({ prior = false, polity = false } = {}) {
  const u1 = unit('s0001', 0, 'The armies of Jin advanced.', '晉軍進。');
  const u2 = unit('s0002', 1, 'De hid at Jin’s residence.', '德隱於進舍。');
  const old = candidate('fixture:001:cand_old', u1, 'Jin');
  const added = candidate('fixture:001:cand_new', u2, 'Jin');
  const packet = { book: 'fixture', chapter: '001', input: {}, units: [u1, u2], preflight: { candidates: prior ? [old, added] : [added] } };
  const previous = { ...packet, preflight: { candidates: prior ? [old] : [] } };
  const person = 'fixture:001:p001';
  const extraction = { book: 'fixture', chapter: '001', input: {},
    people: [{ localId: person, preferredNameSuggestion: { en: 'Xun Jin', zh: '遜進' }, identityHints: { polityHints: polity ? ['Jin'] : [], activeDateHints: [], relatedLocalPeople: [] } }],
    mentions: [], claims: [{ id: 'fixture:001:c0001', subject: person, predicate: 'name', value: { kind: 'personal-name', en: 'Xun Jin', zh: '遜進' }, certainty: 'explicit', evidence: ['fixture:001:s0002'] }],
    translationRepairs: [], candidateDispositions: prior ? [{ candidate: old.id, disposition: 'not-person', reason: 'polity', note: 'The source names the polity Jin in this unit.' }] : [],
    coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] } };
  return { extraction, packet, previous, old, added };
}

for (const config of [{ prior: true }, { polity: true }, { prior: true, polity: true }]) {
  test(`ambiguous Jin remains unresolved: ${JSON.stringify(config)}`, () => {
    const { extraction, packet, previous, old, added } = fixture(config);
    const result = reconcileExtractionAfterRepairs(extraction, packet, { previousPacket: previous });
    assert.ok(result.unresolvedCandidates.includes(added.id), 'new context requires human review');
    assert.ok(!result.extraction.candidateDispositions.some(d => d.candidate === added.id), 'must not assign a polity disposition');
    if (config.prior) assert.ok(result.extraction.candidateDispositions.some(d => d.candidate === old.id && d.reason === 'polity'), 'retain original reviewed decision');
  });
}

test('an unchanged polity occurrence remaps within the same edited unit', () => {
  const { extraction, packet, previous, old, added } = fixture({ prior: true });
  const revisedUnit = { ...packet.units[0], en: 'Later the armies of Jin advanced.', literal: 'Later the armies of Jin advanced.' };
  const moved = candidate('fixture:001:cand_moved', revisedUnit, 'Jin');
  const revised = { ...packet, units: [revisedUnit, packet.units[1]], preflight: { candidates: [moved, added] } };
  const result = reconcileExtractionAfterRepairs(extraction, revised, { previousPacket: previous });
  assert.ok(result.extraction.candidateDispositions.some(d => d.candidate === moved.id && d.reason === 'polity'));
  assert.ok(!result.extraction.candidateDispositions.some(d => d.candidate === old.id));
  assert.ok(result.unresolvedCandidates.includes(added.id));
});

test('adversarial: chapter-wide unique person alias can classify a polity as that person', () => {
  const { extraction, packet, previous, added } = fixture({ polity: true });
  extraction.people[0].preferredNameSuggestion.en = 'Jin';
  extraction.claims[0].value.en = 'Jin';
  const polityUnit = unit('s0002', 1, 'The armies of Jin advanced.', '晉軍進。');
  packet.units[1] = polityUnit;
  packet.preflight.candidates = [candidate(added.id, polityUnit, 'Jin')];
  const result = reconcileExtractionAfterRepairs(extraction, packet, { previousPacket: previous });
  assert.ok(!result.unresolvedCandidates.includes(added.id));
  assert.ok(result.extraction.mentions.some(m => m.candidateRefs.includes(added.id)), 'incorrectly assigned person mention');
});

test('adversarial: same-unit surface remap persists when semantics change', () => {
  const { extraction, packet, previous, old, added } = fixture({ prior: true });
  const changed = unit('s0001', 0, 'The name Jin refers to a man.', '進是一個人。');
  const moved = candidate('fixture:001:cand_moved', changed, 'Jin');
  const revised = { ...packet, units: [changed, packet.units[1]], preflight: { candidates: [moved, added] } };
  const result = reconcileExtractionAfterRepairs(extraction, revised, { previousPacket: previous });
  assert.ok(result.extraction.candidateDispositions.some(d => d.candidate === moved.id && d.reason === 'polity'));
});

test('adversarial: a prior polity decision no longer prevents wrong person assignment', () => {
  const { extraction, packet, previous, added } = fixture({ prior: true, polity: true });
  extraction.people[0].preferredNameSuggestion.en = 'Jin';
  extraction.claims[0].value.en = 'Jin';
  const polityUnit = unit('s0002', 1, 'The armies of Jin advanced.', '晉軍進。');
  packet.units[1] = polityUnit;
  packet.preflight.candidates = [packet.preflight.candidates[0], candidate(added.id, polityUnit, 'Jin')];
  const result = reconcileExtractionAfterRepairs(extraction, packet, { previousPacket: previous });
  if (process.env.TEST_BASELINE === '1') {
    assert.ok(result.extraction.candidateDispositions.some(d => d.candidate === added.id && d.reason === 'polity'));
    assert.ok(!result.extraction.mentions.some(m => m.candidateRefs.includes(added.id)));
  } else {
    assert.ok(result.extraction.mentions.some(m => m.candidateRefs.includes(added.id)), 'incorrectly assigned person mention');
    assert.ok(!result.extraction.candidateDispositions.some(d => d.candidate === added.id));
  }
});
