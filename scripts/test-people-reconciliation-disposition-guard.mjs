import assert from 'node:assert/strict';
import test from 'node:test';
import { reconcileExtractionAfterRepairs } from './lib/people-translation-repairs.mjs';

const oldId = 'fixture:001:old';
const newId = 'fixture:001:new';

function fixture() {
  const first = { id: 's0001', zh: '', en: 'Saturn is a star.', literal: 'Saturn is a star.' };
  const second = { id: 's0002', zh: '', en: 'Saturn led troops.', literal: 'Saturn led troops.' };
  const candidate = (id, unit) => ({ id, unit, language: 'en', exact: 'Saturn', occurrence: 1, startCodePoint: 0, endCodePoint: 6 });
  const oldCandidate = candidate(oldId, 's0001');
  const newCandidate = candidate(newId, 's0002');
  const oldPacket = { input: {}, units: [first, second], preflight: { candidates: [oldCandidate] } };
  const revisedPacket = { input: {}, units: [first, second], preflight: { candidates: [oldCandidate, newCandidate] } };
  const extraction = {
    book: 'fixture', chapter: '001', input: {}, people: [], claims: [], mentions: [], translationRepairs: [],
    candidateDispositions: [{ candidate: oldId, disposition: 'not-person', reason: 'deity', note: 'A star in this occurrence.' }],
  };
  return { oldPacket, revisedPacket, extraction };
}

test('an identical spelling in another unit is not silently classified from the prior occurrence', () => {
  const { oldPacket, revisedPacket, extraction } = fixture();
  const result = reconcileExtractionAfterRepairs(extraction, revisedPacket, { previousPacket: oldPacket });
  assert.deepEqual(result.unresolvedCandidates, [newId]);
  assert.equal(result.extraction.candidateDispositions.some((item) => item.candidate === newId), false);
  assert.deepEqual(result.extraction.candidateDispositions[0], extraction.candidateDispositions[0]);
});

test('an already recorded same-unit person mention is not replaced by a different unit’s disposition', () => {
  const { oldPacket, revisedPacket, extraction } = fixture();
  const person = 'fixture:001:p001';
  extraction.people.push({ localId: person, identityHints: { relatedLocalPeople: [] }, preferredNameSuggestion: { en: 'Saturn' } });
  extraction.mentions.push({
    id: 'fixture:001:m001', person, unit: { id: 's0002' }, kind: 'personal-name',
    spans: { zh: [], en: [{ exact: 'Saturn', occurrence: 1, startCodePoint: 0, endCodePoint: 6 }] },
    candidateRefs: [],
  });
  const result = reconcileExtractionAfterRepairs(extraction, revisedPacket, { previousPacket: oldPacket });
  assert.equal(result.extraction.candidateDispositions.some((item) => item.candidate === newId), false);
  assert.ok(result.extraction.mentions.some((mention) => mention.person === person && mention.candidateRefs.includes(newId)));
  assert.deepEqual(result.unresolvedCandidates, []);
});
