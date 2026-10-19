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

test('an era name elsewhere does not decide whether this occurrence names a person', () => {
  const { extraction, packet, previous } = fixture();
  const era = unit('s0001', 0, 'During the Qinglong era.', '青龍年間。');
  const personUnit = unit('s0002', 1, 'The house of Qinglong.', '青龍之家。');
  const personCandidate = candidate('fixture:001:cand_period_person', personUnit, 'Qinglong');
  packet.units = [era, personUnit];
  packet.preflight.candidates = [personCandidate];
  previous.units = packet.units;
  extraction.people[0].preferredNameSuggestion = { en: 'Xun Qinglong', zh: '青龍' };
  const result = reconcileExtractionAfterRepairs(extraction, packet, { previousPacket: previous });
  assert.ok(result.unresolvedCandidates.includes(personCandidate.id));
  assert.ok(!result.extraction.candidateDispositions.some(d => d.candidate === personCandidate.id));
});

test('only the occurrence in an explicit local era expression is classified', () => {
  const { extraction, packet, previous } = fixture();
  const current = unit('s0002', 1, 'In the Qinglong era, Qinglong departed.', '青龍年間，青龍出。');
  const eraCandidate = candidate('fixture:001:cand_era', current, 'Qinglong');
  const personCandidate = { id: 'fixture:001:cand_person', unit: current.id, language: 'en', ...exactSpanAt(current.en, 'Qinglong', 1), detectors: [] };
  packet.units = [packet.units[0], current];
  packet.preflight.candidates = [eraCandidate, personCandidate];
  previous.units = packet.units;
  extraction.people[0].preferredNameSuggestion = { en: 'Xun Qinglong', zh: '青龍' };
  const result = reconcileExtractionAfterRepairs(extraction, packet, { previousPacket: previous });
  assert.ok(result.extraction.candidateDispositions.some(d => d.candidate === eraCandidate.id && d.reason === 'reign-period'));
  assert.ok(result.unresolvedCandidates.includes(personCandidate.id));
  assert.ok(!result.extraction.candidateDispositions.some(d => d.candidate === personCandidate.id));
});

for (const english of ['He served in Qinglong year 3.', 'The events of Qinglong 4 followed.']) {
  test(`local numbered-year context: ${english}`, () => {
    const { extraction, packet, previous } = fixture();
    const current = unit('s0002', 1, english, '青龍年間。');
    const era = candidate('fixture:001:cand_year', current, 'Qinglong');
    packet.units = [packet.units[0], current];
    packet.preflight.candidates = [era];
    previous.units = packet.units;
    const result = reconcileExtractionAfterRepairs(extraction, packet, { previousPacket: previous });
    assert.ok(result.extraction.candidateDispositions.some(d => d.candidate === era.id && d.reason === 'reign-period'));
  });
}

test('a new polity occurrence must not inherit a globally matching person', () => {
  const { extraction, packet, previous, old } = fixture({ prior: true });
  const territoryUnit = unit('s0002', 1, 'Soldiers marched into Jin.', '兵入晉。');
  const personUnit = unit('s0003', 2, 'Jin served at court.', '進侍於朝。');
  const polityCandidate = candidate('fixture:001:cand_new_polity', territoryUnit, 'Jin');
  packet.units = [packet.units[0], territoryUnit, personUnit];
  packet.preflight.candidates = [old, polityCandidate];
  previous.units = packet.units;
  extraction.people[0].preferredNameSuggestion = { en: 'Jin', zh: '進' };
  extraction.claims[0].value = { kind: 'personal-name', en: 'Jin', zh: '進' };
  extraction.claims[0].evidence = ['fixture:001:s0003'];
  const result = reconcileExtractionAfterRepairs(extraction, packet, { previousPacket: previous });
  assert.ok(result.unresolvedCandidates.includes(polityCandidate.id), 'the new polity context needs independent review');
  assert.ok(!result.extraction.mentions.some(m => m.unit.id === territoryUnit.id && m.spans.en.some(s => s.exact === 'Jin')), 'must not fabricate a person link');
});
