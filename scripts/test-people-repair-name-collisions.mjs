import test from 'node:test';
import assert from 'node:assert/strict';
import { exactSpanAt } from './lib/people-content.mjs';
import { assignExplicitCandidatePeople, reconcileExtractionAfterRepairs } from './lib/people-translation-repairs.mjs';

function fixture(name, english, linked = true) {
  const unit = { id: 's0001', kind: 'paragraph-sentence', blockIndex: 0,
    collection: 'sentences', itemIndex: 0, zh: '\u548c', en: english, literal: english };
  const person = 'fixture:001:p001';
  const packet = { book: 'fixture', chapter: '001', input: {}, units: [unit],
    preflight: { candidates: [] } };
  const extraction = { book: 'fixture', chapter: '001', input: {},
    people: [{ localId: person, preferredNameSuggestion: { en: name, zh: unit.zh },
      identityHints: { polityHints: [], activeDateHints: [], relatedLocalPeople: [] } }],
    mentions: linked ? [{ id: 'fixture:001:m0001', person,
      unit: { id: unit.id, kind: unit.kind, blockIndex: 0, collection: 'sentences', itemIndex: 0 },
      kind: 'personal-name', spans: { zh: [], en: [exactSpanAt(english, name, 0)] }, candidateRefs: [] }] : [],
    claims: [{ id: 'fixture:001:c0001', subject: person, predicate: 'name',
      value: { kind: 'given', en: name, zh: unit.zh }, certainty: 'explicit', evidence: ['fixture:001:s0001'] }],
    translationRepairs: [], candidateDispositions: [],
    coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] } };
  return { extraction, packet };
}

test('preserves a reviewed He name without linking a later English pronoun', () => {
  const { extraction, packet } = fixture('He', 'He took the throne. He later marched.');
  const result = reconcileExtractionAfterRepairs(extraction, packet, { previousPacket: packet });
  assert.deepEqual(result.unresolvedCandidates, []);
  assert.deepEqual(result.unresolvedSpans, []);
  const spans = result.extraction.mentions.flatMap(m => m.spans.en);
  assert.equal(spans.length, 1);
  assert.equal(spans[0].startCodePoint, 0);
});

test('does not infer a pronoun-name link from a same-unit claim during current-source reconciliation', () => {
  for (const name of ['He', 'She', 'I', 'You', 'We']) {
    const { extraction, packet } = fixture(name, `${name} spoke.`, false);
    const result = reconcileExtractionAfterRepairs(extraction, packet, { markRepairsApplied: false });
    assert.equal(result.extraction.mentions.flatMap(m => m.spans.en).length, 0, name);
  }
});

test('still restores an unambiguous preferred romanization evidenced in the unit', () => {
  const { extraction, packet } = fixture('Boqitu', 'Boqitu was transferred.', false);
  const result = reconcileExtractionAfterRepairs(extraction, packet);
  assert.equal(result.extraction.mentions.flatMap(m => m.spans.en).filter(s => s.exact === 'Boqitu').length, 1);
});

test('rejects conflicting overlapping reviewed assignments before changing any spans', () => {
  const { extraction, packet } = fixture('Qiao', 'Father Qiao and son Qiao.', false);
  extraction.people.push({ ...structuredClone(extraction.people[0]), localId: 'fixture:001:p002' });
  const unit = packet.units[0];
  packet.preflight.candidates = ['Father Qiao', 'Qiao'].map((exact, index) => ({
    id: `fixture:001:cand_${index}`, unit: unit.id, language: 'en',
    ...exactSpanAt(unit.en, exact, 0), detectors: [],
  }));
  const reconciled = { extraction, unresolvedCandidates: packet.preflight.candidates.map((c) => c.id), unresolvedSpans: [] };
  const before = structuredClone(reconciled);
  assert.throws(() => assignExplicitCandidatePeople(reconciled, packet, [
    { candidate: packet.preflight.candidates[0].id, person: 'p001', kind: 'personal-name' },
    { candidate: packet.preflight.candidates[1].id, person: 'p002', kind: 'personal-name' },
  ]), /Conflicting overlapping person assignments/);
  assert.deepEqual(reconciled, before);
});

test('validates all explicit assignments before changing the extraction', () => {
  const { extraction, packet } = fixture('Qiao', 'Qiao spoke.', false);
  const unit = packet.units[0];
  packet.preflight.candidates = [{ id: 'fixture:001:cand_0', unit: unit.id, language: 'en',
    ...exactSpanAt(unit.en, 'Qiao', 0), detectors: [] }];
  const reconciled = { extraction, unresolvedCandidates: [packet.preflight.candidates[0].id], unresolvedSpans: [] };
  const before = structuredClone(reconciled);
  assert.throws(() => assignExplicitCandidatePeople(reconciled, packet, [
    { candidate: packet.preflight.candidates[0].id, person: 'p001', kind: 'personal-name' },
    { candidate: 'fixture:001:missing', person: 'p001', kind: 'personal-name' },
  ]), /not in the revised packet/);
  assert.deepEqual(reconciled, before);
});

test('coalesces overlapping assignments to the same person in either order', () => {
  for (const reverse of [false, true]) {
    const { extraction, packet } = fixture('Qiao', 'Father Qiao spoke.', false);
    const unit = packet.units[0];
    packet.preflight.candidates = ['Qiao', 'Father Qiao'].map((exact, index) => ({
      id: `fixture:001:cand_${index}`, unit: unit.id, language: 'en',
      ...exactSpanAt(unit.en, exact, 0), detectors: [],
    }));
    const reconciled = { extraction, unresolvedCandidates: packet.preflight.candidates.map((c) => c.id), unresolvedSpans: [] };
    const requested = packet.preflight.candidates.map((c) => ({ candidate: c.id, person: 'p001', kind: 'personal-name' }));
    if (reverse) requested.reverse();
    const result = assignExplicitCandidatePeople(reconciled, packet, requested);
    const mention = result.extraction.mentions[0];
    assert.deepEqual(mention.spans.en.map((span) => span.exact), ['Father Qiao']);
    assert.deepEqual(new Set(mention.candidateRefs), new Set(packet.preflight.candidates.map((c) => c.id)));
    assert.deepEqual(result.unresolvedCandidates, []);
  }
});

test('rejects an assignment batch that would erase another reviewed link', () => {
  for (const reverse of [false, true]) {
    const { extraction, packet } = fixture('Father Qiao', 'Father Qiao spoke.');
    extraction.people.push({ ...structuredClone(extraction.people[0]), localId: 'fixture:001:p002' });
    const unit = packet.units[0];
    packet.preflight.candidates = ['Father', 'Qiao'].map((exact, index) => ({
      id: `fixture:001:cand_${index}`, unit: unit.id, language: 'en',
      ...exactSpanAt(unit.en, exact, 0), detectors: [],
    }));
    const reconciled = { extraction, unresolvedCandidates: packet.preflight.candidates.map((c) => c.id), unresolvedSpans: [] };
    const before = structuredClone(reconciled);
    const requested = packet.preflight.candidates.map((c, index) => ({
      candidate: c.id, person: `p00${index + 1}`, kind: 'personal-name',
    }));
    if (reverse) requested.reverse();
    assert.throws(() => assignExplicitCandidatePeople(reconciled, packet, requested), /overlap an existing mention/);
    assert.deepEqual(reconciled, before);
  }
});

test('rejects overlapping assignments with different requested mention kinds', () => {
  const { extraction, packet } = fixture('Qiao', 'Father Qiao spoke.', false);
  const unit = packet.units[0];
  packet.preflight.candidates = ['Qiao', 'Father Qiao'].map((exact, index) => ({
    id: `fixture:001:cand_${index}`, unit: unit.id, language: 'en',
    ...exactSpanAt(unit.en, exact, 0), detectors: [],
  }));
  const reconciled = { extraction, unresolvedCandidates: packet.preflight.candidates.map((c) => c.id), unresolvedSpans: [] };
  const before = structuredClone(reconciled);
  assert.throws(() => assignExplicitCandidatePeople(reconciled, packet, [
    { candidate: packet.preflight.candidates[0].id, person: 'p001', kind: 'personal-name' },
    { candidate: packet.preflight.candidates[1].id, person: 'p001', kind: 'title-reference' },
  ]), /Conflicting overlapping mention kinds/);
  assert.deepEqual(reconciled, before);
});

test('preserves the kind of an overlapping existing mention without candidate refs', () => {
  const { extraction, packet } = fixture('Qiao', 'Father Qiao spoke.');
  const unit = packet.units[0];
  packet.preflight.candidates = [{ id: 'fixture:001:cand_0', unit: unit.id, language: 'en',
    ...exactSpanAt(unit.en, 'Father Qiao', 0), detectors: [] }];
  const reconciled = { extraction, unresolvedCandidates: [packet.preflight.candidates[0].id], unresolvedSpans: [] };
  const before = structuredClone(reconciled);
  assert.throws(() => assignExplicitCandidatePeople(reconciled, packet, [
    { candidate: packet.preflight.candidates[0].id, person: 'p001', kind: 'title-reference' },
  ]), /conflicts with an existing mention kind/);
  assert.deepEqual(reconciled, before);
});

test('rejects replacing an existing person span even when it has no candidate refs', () => {
  const { extraction, packet } = fixture('Father Qiao', 'Father Qiao spoke.');
  extraction.people.push({ ...structuredClone(extraction.people[0]), localId: 'fixture:001:p002' });
  extraction.mentions[0].candidateRefs = [];
  const unit = packet.units[0];
  packet.preflight.candidates = [{ id: 'fixture:001:cand_new', unit: unit.id, language: 'en',
    ...exactSpanAt(unit.en, 'Qiao', 0), detectors: [] }];
  const reconciled = { extraction, unresolvedCandidates: [packet.preflight.candidates[0].id], unresolvedSpans: [] };
  const before = structuredClone(reconciled);
  assert.throws(() => assignExplicitCandidatePeople(reconciled, packet, [
    { candidate: packet.preflight.candidates[0].id, person: 'p002', kind: 'personal-name' },
  ]), /would replace part of an existing person's mention/);
  assert.deepEqual(reconciled, before);
});
