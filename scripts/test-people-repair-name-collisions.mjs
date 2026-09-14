import test from 'node:test';
import assert from 'node:assert/strict';
import { exactSpanAt } from './lib/people-content.mjs';
import { reconcileExtractionAfterRepairs } from './lib/people-translation-repairs.mjs';

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
