// Offline research test only. Requires a separately copied staging-pinned fixture
// with the adjacent research patch applied; never writes canonical project data.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const fixture = process.argv[2];
assert.ok(fixture && path.isAbsolute(fixture), 'pass an absolute isolated fixture path');
const root = '/Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-anonymous-son-proposal-v3-20261019-incomplete';
const expected = {
  'source.json': 'a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d',
  'extraction.json': '9fd9057a444fef6b50119009fe7e113c1956ea0abc8f74217e9998ef052938ec',
  'editorial-history.json': 'da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7',
};
const read = name => {
  const bytes = fs.readFileSync(path.join(root, name));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), expected[name], `${name} pin mismatch`);
  return JSON.parse(bytes);
};
const importFixture = file => import(pathToFileURL(path.join(fixture, file)).href);
const { buildPeopleExtractionPacket } = await importFixture('scripts/build-people-extraction-packet.mjs');
const { validatePeopleExtraction } = await importFixture('scripts/validate-people-extraction.mjs');
const { validateAppliedEditorialDecisions } = await importFixture('scripts/lib/people-editorial-decisions.mjs');
const { validateDateAuditReport } = await importFixture('scripts/lib/people-date-audit.mjs');
const source = read('source.json');
const extraction = read('extraction.json');
const packet = buildPeopleExtractionPacket('jinshu', '053', { chapterData: source });
assert.equal(packet.input.chapterFingerprint, 'sha256:ff9a510d9110982e5a0fbd25ef15709067b33a52ae787c11c8b4b13a71594c88');
const validate = candidate => validatePeopleExtraction(candidate, packet, { strictAliasDispositions: true });
const passed = validate(extraction);
validateAppliedEditorialDecisions(read('editorial-history.json'), passed.normalized);
console.log('PASS: exact held draft validates with applied editorial history');

function reject(label, mutate, expression) {
  const candidate = structuredClone(extraction);
  mutate(candidate);
  assert.throws(() => validate(candidate), expression, label);
  console.log(`PASS: ${label}`);
}
const claim = (candidate, id) => {
  const found = candidate.claims.find(row => row.id === `jinshu:053:${id}`);
  assert.ok(found, `missing ${id}`);
  return found;
};
reject('concrete year mixed with unresolved death cannot remove active-hint gate', x => {
  claim(x, 'c0543').value = { sourceDate: { text: '十二月' }, westernYear: { era: 'AD', year: 299, precision: 'year' } };
}, /p027 has no active-date hint required/);
reject('a concrete year within a death hold cannot remove active-hint gate', x => {
  claim(x, 'c0528').value.dateContext.westernYear = { era: 'AD', year: 299, precision: 'year' };
}, /p027 has no active-date hint required/);
reject('unresolved death without a substantive reason is rejected', x => {
  claim(x, 'c0528').value.dateContext.unresolvedReason = 'unknown';
}, /unresolved|active-date hint/);
reject('unresolved death without source-date wording cannot remove active-hint gate', x => {
  delete claim(x, 'c0528').value.dateContext.sourceDate;
}, /p027 has no active-date hint required|sourceDate/);
reject('death source-date without an unresolved flag cannot remove active-hint gate', x => {
  delete claim(x, 'c0528').value.dateContext.unresolved;
}, /p027 has no active-date hint required/);
reject('unresolved death without supporting source-attestation is rejected', x => {
  x.claims = x.claims.filter(c => c.id !== 'jinshu:053:c0543');
}, /p027 has no (?:active-date hint|evidence-backed attestation)/);

// This intentionally synthetic report is not an audit and is never saved.
// It proves the existing approval guard rejects an unresolved source context.
const dateContext = claim(extraction, 'c0528').value;
const unit = { id: 's0065', zh: '澹以兵仗送太子妃王氏、三皇孫于金墉城，考竟謝淑妃及太子保林蔣俊。' };
const datePacket = { schemaVersion: 1, auditVersion: 1, book: 'jinshu', chapter: '053',
  sourceHash: 'test-source', extractionHash: 'test-extraction', units: [unit],
  people: [{ id: 'p027' }], items: [{ id: 'claim-1', personId: 'p027', predicate: 'death', value: dateContext }] };
const check = { verdict: 'supported', reason: 'Synthetic test only; this is not a factual source-based finding.', evidence: [{ unit: unit.id, quote: unit.zh }] };
const report = { schemaVersion: 1, auditVersion: 1, book: 'jinshu', chapter: '053', sourceHash: 'test-source', extractionHash: 'test-extraction',
  status: 'audited', reviewer: { name: 'synthetic test only', independentOfExtractor: true }, reviewedAt: '2026-10-20T00:00:00.000Z',
  summary: 'Synthetic test only, never a review or approval.', reviewedUnits: [unit.id],
  itemChecks: [{ ...check, id: 'claim-1', event: 'Synthetic death event for regression test.' }], personChecks: [{ ...check, id: 'p027' }], findings: [], references: [] };
assert.throws(() => validateDateAuditReport(report, datePacket), /Unresolved chronology cannot be approved/);
console.log('PASS: unresolved death still prevents synthetic date approval');
