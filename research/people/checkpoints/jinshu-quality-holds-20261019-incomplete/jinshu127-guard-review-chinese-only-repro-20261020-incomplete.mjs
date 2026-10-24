// Research-only adversarial repro; this intentionally asserts the desired
// fail-closed result and fails on patch 27d06076fc532c0e1d0164485bbd44834b110ab80d9a70212823d4bc2008395c.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const fixture = process.env.JINSHU127_REVIEW_FIXTURE;
if (!fixture || !path.isAbsolute(fixture)) throw new Error('Set JINSHU127_REVIEW_FIXTURE to an absolute path containing the pinned patched scripts');
const { exactSpanAt } = await import(pathToFileURL(path.join(fixture, 'scripts/lib/people-content.mjs')).href);
const { reconcileExtractionAfterRepairs } = await import(pathToFileURL(path.join(fixture, 'scripts/lib/people-translation-repairs.mjs')).href);

const locator = { id: 's0001', kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: 0 };
const unit = { ...locator, en: 'He lived in Jin.', literal: 'He lived in Jin.', zh: '進居晉。' };
const candidate = { id: 'fixture:001:cand_polity', unit: unit.id, language: 'en', ...exactSpanAt(unit.en, 'Jin', 0), detectors: [] };
const packet = { book: 'fixture', chapter: '001', input: {}, units: [unit], preflight: { candidates: [candidate] } };
const person = 'fixture:001:p001';
const extraction = {
  book: 'fixture', chapter: '001', input: {},
  people: [{ localId: person, preferredNameSuggestion: { en: 'Jin', zh: '進' }, identityHints: { polityHints: [], activeDateHints: [], relatedLocalPeople: [] } }],
  mentions: [{ id: 'fixture:001:m0001', person, unit: locator, kind: 'personal-name', spans: { zh: [exactSpanAt(unit.zh, '進', 0)], en: [] }, candidateRefs: [] }],
  claims: [{ id: 'fixture:001:c0001', subject: person, predicate: 'name', value: { kind: 'personal-name', en: 'Jin', zh: '進' }, certainty: 'explicit', evidence: ['fixture:001:s0001'] }],
  translationRepairs: [], candidateDispositions: [],
  coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] },
};
const result = reconcileExtractionAfterRepairs(extraction, packet, { previousPacket: packet });
console.log(JSON.stringify({ unresolved: result.unresolvedCandidates, mentions: result.extraction.mentions.map(mention => ({ person: mention.person, english: mention.spans.en, candidateRefs: mention.candidateRefs })) }, null, 2));
assert.ok(result.unresolvedCandidates.includes(candidate.id), 'The Chinese-only person evidence must not classify the English polity Jin as that person.');
assert.ok(!result.extraction.mentions.some(mention => mention.spans.en.some(span => span.exact === 'Jin')), 'Do not link the polity to the person.');
