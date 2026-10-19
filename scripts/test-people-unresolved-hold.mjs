// Offline regression tests for source-backed research holds. No canonical writes.
// Run from the repository root after applying validator.patch to the staging base.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const load = name => import(pathToFileURL(path.join(process.cwd(), 'scripts', name)));
const { validatePeopleExtraction, validateCompactPeopleExtraction } = await load('validate-people-extraction.mjs');
const { compactPeopleExtraction } = await load('lib/people-compact.mjs');
const { dateAuditItems, validateDateAuditReport } = await load('lib/people-date-audit.mjs');
const { normalizeExtractionDateHints } = await load('lib/people-date-hints.mjs');

const input = {
  unitCount: 1,
  chapterFingerprint: `sha256:${'1'.repeat(64)}`,
  chineseFingerprint: `sha256:${'2'.repeat(64)}`,
  englishFingerprint: `sha256:${'3'.repeat(64)}`,
  unitDigests: [{ id: 's0001', zh: `sha256:${'4'.repeat(64)}`, en: `sha256:${'5'.repeat(64)}`, literal: `sha256:${'6'.repeat(64)}` }],
};
const locator = { id: 's0001', kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: 0 };
const packet = {
  schemaVersion: 1, book: 'testbook', chapter: '001',
  source: { path: 'data/testbook/001.json', title: { zh: '', en: '' } }, input,
  units: [{ ...locator, zh: '艾麗絲來。', en: 'Alice came.', literal: 'Alice came.' }],
  preflight: { scannerVersion: 2, candidates: [
    { id: 'testbook:001:cand_1111111111111111', unit: 's0001', language: 'zh', exact: '艾麗絲', occurrence: 0, startCodePoint: 0, endCodePoint: 3, detectors: [{ kind: 'fixture' }] },
    { id: 'testbook:001:cand_2222222222222222', unit: 's0001', language: 'en', exact: 'Alice', occurrence: 0, startCodePoint: 0, endCodePoint: 5, detectors: [{ kind: 'fixture' }] },
  ] },
  context: { westernEraStyle: 'BC_AD', roles: [{ id: 'official', label: 'Official' }], polities: [], reigns: [] },
};
const extraction = {
  schemaVersion: 1, book: 'testbook', chapter: '001', input,
  run: { model: 'fixture', promptVersion: 7 },
  people: [{ localId: 'testbook:001:p001', preferredNameSuggestion: { en: 'Alice', zh: '艾麗絲' }, historicity: 'historical', descriptorSuggestion: 'Official', identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: [] } }],
  mentions: [{ id: 'testbook:001:m0001', person: 'testbook:001:p001', unit: locator, kind: 'personal-name', spans: { zh: [{ exact: '艾麗絲', occurrence: 0 }], en: [{ exact: 'Alice', occurrence: 0 }] }, candidateRefs: ['testbook:001:cand_1111111111111111', 'testbook:001:cand_2222222222222222'] }],
  claims: [
    { id: 'testbook:001:c0001', subject: 'testbook:001:p001', predicate: 'name', value: { kind: 'personal', en: 'Alice', zh: '艾麗絲' }, certainty: 'explicit', evidence: ['testbook:001:s0001'] },
    { id: 'testbook:001:c0002', subject: 'testbook:001:p001', predicate: 'role', value: { roleId: 'official' }, certainty: 'explicit', evidence: ['testbook:001:s0001'] },
    { id: 'testbook:001:c0003', subject: 'testbook:001:p001', predicate: 'attestation', value: { undatedSourceAttestation: true, event: 'Alice is named in the source.' }, certainty: 'explicit', evidence: ['testbook:001:s0001'] },
    { id: 'testbook:001:c0004', subject: 'testbook:001:p001', predicate: 'event-participation', value: { kind: 'appointment', action: 'Alice arrived.', dateContext: { sourceDate: { text: '艾麗絲來' }, unresolved: true, unresolvedReason: 'The source does not establish a securely convertible calendar year.' } }, certainty: 'explicit', evidence: ['testbook:001:s0001'] },
  ],
  translationRepairs: [], candidateDispositions: [],
  coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [], allNamedPeopleAndMentionsCaptured: true, allDurableFactsCaptured: true, allChronologyCaptured: true, editorialPassCompleted: true, allPersonEventsCaptured: true, allClaimProvenanceCaptured: true, allFamilyRelationshipsCaptured: true },
};
const forms = {
  expanded: (value, source = packet) => validatePeopleExtraction(value, source),
  compact: (value, source = packet) => validateCompactPeopleExtraction(compactPeopleExtraction(value, source), source),
};
for (const [form, validate] of Object.entries(forms)) {
  const before = JSON.stringify(extraction);
  validate(extraction);
  assert.equal(JSON.stringify(extraction), before, `${form} validation mutated input`);
  const undated = structuredClone(extraction);
  undated.claims.pop();
  validate(undated);
  const dated = structuredClone(undated);
  dated.claims[2].value = { sourceDate: { text: '艾麗絲來' }, westernYear: { era: 'BC', year: 682, precision: 'year' }, event: 'Alice is named in the source.' };
  dated.people[0].identityHints.activeDateHints = ['682 BC'];
  assert.throws(() => validate(dated), error => error.message.includes('has no Western active-date hint'), `${form}: noncanonical hint`);
  dated.people[0].identityHints.activeDateHints = ['BC 682'];
  validate(dated);
  for (const [label, change, expected] of [
    ['missing flag', c => { delete c.claims[3].value.dateContext.unresolved; }, 'has no active-date hint'],
    ['short reason', c => { c.claims[3].value.dateContext.unresolvedReason = 'short'; }, 'has no active-date hint'],
    ['missing source date', c => { delete c.claims[3].value.dateContext.sourceDate; }, 'has no active-date hint'],
    ['hold mixed with concrete Western year', c => { c.claims[3].value.dateContext.westernYear = { era: 'BC', year: 682, precision: 'year' }; }, 'has no active-date hint'],
    ['hold mixed with concrete Western interval', c => { c.claims[3].value.dateContext.westernInterval = { start: { era: 'BC', year: 683, precision: 'year' }, end: { era: 'BC', year: 682, precision: 'year' } }; }, 'has no active-date hint'],
    ['hold mixed with concrete Western bound', c => { c.claims[3].value.dateContext.westernBounds = { before: { era: 'BC', year: 682, precision: 'year' } }; }, 'has no active-date hint'],
    ['missing attestation', c => { c.claims.splice(2, 1); }, 'has no evidence-backed attestation'],
    ['source-only death', c => { c.claims[3] = { id: 'testbook:001:c0004', subject: 'testbook:001:p001', predicate: 'death', value: { sourceDate: { text: '艾麗絲來' }, unresolved: true, unresolvedReason: 'The source does not establish a securely convertible calendar year.' }, certainty: 'explicit', evidence: ['testbook:001:s0001'] }; }, 'has no Western-year attestation'],
  ]) {
    const candidate = structuredClone(extraction); change(candidate);
    assert.throws(() => validate(candidate), error => error.message.includes(expected), `${form}: ${label}`);
  }
  const fatherSource = structuredClone(packet);
  fatherSource.units[0].zh = '艾麗絲父死。';
  const falseDeath = structuredClone(extraction);
  const hold = { sourceDate: { text: '艾麗絲父死' }, unresolved: true, unresolvedReason: 'The source does not establish a securely convertible calendar year.' };
  falseDeath.claims[2].value = { ...hold, event: 'Later events followed the death of her father.' };
  falseDeath.claims[3] = { id: 'testbook:001:c0004', subject: 'testbook:001:p001', predicate: 'death', value: structuredClone(hold), certainty: 'explicit', evidence: ['testbook:001:s0001'] };
  assert.throws(() => validate(falseDeath, fatherSource), error => error.message.includes('has no active-date hint'), `${form}: another person's death is not the subject's death`);
  console.log(`${form}: positive, genuinely undated, canonical hint, no-mutation, and targeted negative controls passed`);
}
const noncanonical = structuredClone(extraction);
noncanonical.claims.pop();
noncanonical.claims[2].value = { sourceDate: { text: '艾麗絲來' }, westernYear: { era: 'BC', year: 682, precision: 'year' }, event: 'Alice is named in the source.' };
noncanonical.people[0].identityHints.activeDateHints = ['682 BC'];
for (const [form, inputValue] of [['expanded', noncanonical], ['compact', compactPeopleExtraction(noncanonical, packet)]]) {
  const before = JSON.stringify(inputValue);
  const { candidate, changes } = normalizeExtractionDateHints(inputValue);
  assert.equal(JSON.stringify(inputValue), before, `${form}: date-hint normalizer mutated input`);
  assert.equal(changes.length, 1, `${form}: expected one normalization change`);
  const hints = form === 'expanded' ? candidate.people[0].identityHints.activeDateHints : candidate.people[0][4].a;
  assert.deepEqual(hints, ['BC 682']);
  if (form === 'expanded') validatePeopleExtraction(candidate, packet);
  else validateCompactPeopleExtraction(candidate, packet);
  console.log(`${form}: date-hint normalizer preserves input and produces BC 682`);
}
// Fabricated complete report is deliberately rejected: extraction acceptance is
// never independent date approval while any research hold remains unresolved.
const { people, items } = dateAuditItems(extraction);
const datePacket = { book: 'testbook', chapter: '001', sourceHash: 'fixture-source', extractionHash: 'fixture-extraction', people, items, units: packet.units };
const check = id => ({ id, verdict: 'supported', event: 'Alice appears in the source.', reason: 'This synthetic explanation is sufficiently substantive.', evidence: [{ unit: 's0001', quote: '艾麗絲' }] });
const report = { schemaVersion: 1, auditVersion: 1, book: datePacket.book, chapter: datePacket.chapter, sourceHash: datePacket.sourceHash, extractionHash: datePacket.extractionHash, status: 'audited', reviewer: { name: 'fixture reviewer', independentOfExtractor: true }, reviewedAt: '2026-10-19T00:00:00Z', summary: 'Synthetic audit report for regression testing.', reviewedUnits: ['s0001'], itemChecks: items.map(item => check(item.id)), personChecks: people.map(person => check(person.id)), findings: [], references: [] };
assert.throws(() => validateDateAuditReport(report, datePacket), /Unresolved chronology cannot be approved/);
console.log('date audit: unresolved chronology cannot be approved');
