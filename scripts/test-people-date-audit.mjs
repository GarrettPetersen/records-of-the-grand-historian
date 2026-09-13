import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems, dateAuditStatus, recordDateAudit, validateDateAuditReport } from './lib/people-date-audit.mjs';
import { sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { westernBoundsErrors, boundedDateLabel } from './lib/people-date-values.mjs';
import { personLifeSummary, formatPersonWesternYear, inferredPersonBirthYear } from './lib/people-presentation.mjs';
import { peopleCatalogIsComplete } from './lib/people-publication.mjs';

const year = n => ({ era: n < 0 ? 'BC' : 'AD', year: Math.abs(n), precision: 'year' });
test('catalog completion requires date approval independently of extraction', () => {
  const stats = { missingChapters: 0, legacyChapters: 0, legacyLocalPeople: 0, pendingTranslationRepairs: 0, unresolvedCandidateBlocks: 0, dateAuditPendingChapters: 1 };
  assert.equal(peopleCatalogIsComplete(stats), false);
  assert.equal(peopleCatalogIsComplete({ ...stats, dateAuditPendingChapters: 0 }), true);
  delete stats.dateAuditPendingChapters;
  assert.throws(() => peopleCatalogIsComplete(stats), /invalid dateAuditPendingChapters/);
});
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'people-dates-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const options = { dataDir: path.join(root, 'data'), peopleDir: path.join(root, 'people') };
  const source = { content: [{ sentences: [{ id: 's0001', zh: '甲卒。', translation: 'Jia died.' }] }] };
  const extraction = { schemaVersion: 2, book: 'fixture', chapter: '001', run: { model: 'extractor' },
    people: [['p001', ['Jia', '甲'], 'historical', 'Official', { a: ['before AD 472'] }]],
    claims: [['p001', 'death', { dateContext: { sourceDate: { text: 'before accession' }, westernBounds: { before: year(472) } } }, 'inferred', ['s0001']]] };
  const sourceFile = path.join(options.dataDir, 'fixture/001.json');
  const extractionFile = path.join(options.peopleDir, 'extractions/fixture/001.json');
  writeJsonAtomic(sourceFile, source);
  writeJsonAtomic(extractionFile, extraction);
  const packet = buildDateAuditPacket('fixture', '001', options);
  const evidence = [{ unit: 's0001', quote: '甲卒' }];
  const check = id => ({ id, verdict: 'supported', event: 'Jia died before the accession.', reason: 'Fixture interpretation, not an assertion about a historical individual.', evidence });
  const report = { schemaVersion: 1, auditVersion: 1, book: 'fixture', chapter: '001',
    sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, status: 'audited',
    reviewer: { name: 'Independent fixture reviewer', independentOfExtractor: true }, reviewedAt: '2026-09-12T12:00:00Z',
    summary: 'Complete test fixture for independent date approval.', reviewedUnits: ['s0001'],
    itemChecks: packet.items.map(item => check(item.id)), personChecks: [check('p001')], findings: [], references: [] };
  return { options, source, extraction, sourceFile, extractionFile, packet, report };
}

test('missing reports are unaudited; complete source checks can approve', t => {
  const f = fixture(t);
  assert.equal(dateAuditStatus('fixture', '001', f.options).status, 'un-audited');
  assert.equal(recordDateAudit(f.report, f.options).status, 'audited');
});

for (const field of ['reviewedUnits', 'itemChecks', 'personChecks']) {
  test(`approval requires all ${field}`, t => {
    const f = fixture(t); f.report[field].pop();
    assert.throws(() => validateDateAuditReport(f.report, f.packet), /complete chapter/);
  });
}

test('approval rejects forged quotes, duplicate IDs, failed checks and self-review', t => {
  const f = fixture(t);
  let r = structuredClone(f.report); r.itemChecks[0].evidence[0].quote = '乙卒';
  assert.throws(() => validateDateAuditReport(r, f.packet), /Chinese source/);
  r = structuredClone(f.report); r.itemChecks.push(r.itemChecks[0]);
  assert.throws(() => validateDateAuditReport(r, f.packet), /duplicate/);
  r = structuredClone(f.report); r.itemChecks[0].verdict = 'incorrect';
  assert.throws(() => validateDateAuditReport(r, f.packet), /finding/);
  r = structuredClone(f.report); r.reviewer.independentOfExtractor = false;
  assert.throws(() => validateDateAuditReport(r, f.packet), /separate source reviewer/);
});

test('source edits, extraction edits, removals and protocol changes invalidate approval', t => {
  const f = fixture(t); recordDateAudit(f.report, f.options);
  f.source.content[0].sentences[0].translation = 'Changed translation.';
  writeJsonAtomic(f.sourceFile, f.source);
  assert.equal(dateAuditStatus('fixture', '001', f.options).status, 'stale');
  f.source.content[0].sentences[0].translation = 'Jia died.';
  writeJsonAtomic(f.sourceFile, f.source);
  f.extraction.people[0][4].a = ['AD 472'];
  writeJsonAtomic(f.extractionFile, f.extraction);
  assert.equal(dateAuditStatus('fixture', '001', f.options).status, 'stale');
  fs.unlinkSync(f.extractionFile);
  assert.equal(dateAuditStatus('fixture', '001', f.options).status, 'stale');
  writeJsonAtomic(f.extractionFile, { ...f.extraction, people: f.extraction.people.map(p => [...p.slice(0, 4), { a: ['before AD 472'] }]) });
  writeJsonAtomic(path.join(f.options.peopleDir, 'date-audits/fixture/001.json'), { ...f.report, auditVersion: 0 });
  assert.equal(dateAuditStatus('fixture', '001', f.options).status, 'stale');
});

test('failed partial audits persist findings; replacement archives history', t => {
  const f = fixture(t);
  const failed = { ...f.report, status: 'needs-revision', personChecks: [], itemChecks: [], reviewedUnits: [],
    findings: [{ items: ['p001'], problem: 'The evidence belongs to a different person.', action: 'Read the named subject and correct the ownership.' }] };
  assert.equal(recordDateAudit(failed, f.options).status, 'needs-revision');
  recordDateAudit(f.report, f.options);
  assert.equal(fs.readdirSync(path.join(f.options.peopleDir, 'date-audit-history/fixture/001')).length, 1);
});

test('research holds cannot receive date approval', t => {
  const f = fixture(t);
  f.extraction.claims[0][2] = { dateContext: { sourceDate: { text: 'first year' }, unresolved: true, unresolvedReason: 'The ruler and reign are not established by this unit.' } };
  writeJsonAtomic(f.extractionFile, f.extraction);
  const packet = buildDateAuditPacket('fixture', '001', f.options);
  f.report.extractionHash = packet.extractionHash;
  assert.throws(() => validateDateAuditReport(f.report, packet), /Unresolved chronology/);
});

test('reversed intervals are audit blockers, never automatically swapped', t => {
  const f = fixture(t);
  f.packet.items[0].value = { westernInterval: { start: year(202), end: year(195) } };
  assert.equal(dateAuditDiagnostics(f.packet)[0].item, 'claim-1');
  assert.throws(() => validateDateAuditReport(f.report, f.packet), /invalid temporal geometry/);
  assert.equal(f.packet.items[0].value.westernInterval.start.year, 202);
});

test('cross-chapter evidence is pinned and edits invalidate approval', t => {
  const f = fixture(t);
  const ref = path.join(f.options.dataDir, 'fixture/002.json');
  writeJsonAtomic(ref, f.source);
  f.report.references = [{ book: 'fixture', chapter: '002', unit: 's0001', quote: '甲卒', sourceHash: sha256('甲卒。'), reason: 'Independent source passage corroborates this event.' }];
  recordDateAudit(f.report, f.options);
  f.source.content[0].sentences[0].zh = '甲未卒。'; writeJsonAtomic(ref, f.source);
  assert.equal(dateAuditStatus('fixture', '001', f.options).status, 'stale');
});

test('external reference excerpts must carry correct hashes', t => {
  const f = fixture(t);
  const ref = { kind: 'external', url: 'https://example.org/chronology', title: 'Fixture chronology', quote: 'A short fixture excerpt.', reason: 'This is a test reference, not historical evidence.', accessedAt: f.report.reviewedAt, sourceHash: sha256('A short fixture excerpt.') };
  f.report.references = [ref]; validateDateAuditReport(f.report, f.packet);
  ref.quote = 'Altered excerpt';
  assert.throws(() => validateDateAuditReport(f.report, f.packet), /hash-pinned/);
});

test('nested dates, ages, undated life claims and every active hint enter the audit', () => {
  const result = dateAuditItems({ schemaVersion: 2, people: [['p001', ['Jia'], 'historical', 'Official', {}]], claims: [
    ['p001', 'age', { age: 43 }, 'explicit', ['s0001']],
    ['p001', 'death', { cause: 'execution' }, 'explicit', ['s0001']],
    ['p001', 'office', { startDate: { westernYear: year(445) } }, 'explicit', ['s0001']],
    ['p001', 'role', { roleId: 'official' }, 'explicit', ['s0001']],
  ] });
  assert.deepEqual(result.items.map(i => i.id), ['claim-1', 'claim-2', 'claim-3', 'hints-p001']);
});

test('one-sided bounds preserve direction, inclusion and the BC/AD boundary', () => {
  assert.deepEqual(westernBoundsErrors({ before: year(472) }), []);
  assert.deepEqual(westernBoundsErrors({ after: year(-1), onOrBefore: year(1) }), []);
  assert.ok(westernBoundsErrors({ after: year(479), before: year(479) }).length);
  assert.ok(westernBoundsErrors({ before: year(0) }).length);
  assert.ok(westernBoundsErrors({ after: year(10), before: year(-10) }).length);
  assert.equal(boundedDateLabel({ westernBounds: { onOrAfter: year(479) } }, formatPersonWesternYear), 'on or after AD 479');
});

test('person summaries never turn one-sided bounds into exact life dates', () => {
  const person = { life: { birth: [], death: [{ value: { dateContext: { westernBounds: { onOrAfter: year(479) } } } }], attestedActivity: [] }, claims: [] };
  assert.equal(personLifeSummary(person), 'Died on or after AD 479');
  assert.equal(inferredPersonBirthYear(person), null);
  person.life.birth = [{ value: { westernBounds: { before: year(472) } } }];
  assert.equal(personLifeSummary(person), 'Born before AD 472; died on or after AD 479');
});
