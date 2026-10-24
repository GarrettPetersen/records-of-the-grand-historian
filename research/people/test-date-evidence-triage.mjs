import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { triage } from './date-evidence-triage.mjs';

test('flags repetition without rejecting contextual and unassociated evidence', () => {
  const source = { content: [{ sentences: [{ id: 's0001', zh: '甲乙' }, { id: 's0002', zh: '乙' }] }] };
  const extraction = { schemaVersion: 2, book: 'x', chapter: '001', people: [['p001'], ['p002'], ['p003']], surfaces: [['p001', null, null, null, [['s0001']]], ['p002', null, null, null, [['s0002']]]] };
  const report = { book: 'x', chapter: '001', status: 'audited', itemChecks: [], personChecks: ['p001', 'p002', 'p003'].map(id => ({ id, evidence: [{ unit: 's0001', quote: '甲' }] })) };
  const result = triage(report, extraction, source);
  assert.equal(result.repeatedPersonEvidence[0].count, 3);
  assert.deepEqual(result.personSignals.map(row => row.associationStatus), ['has-associated-citation', 'no-associated-citation', 'no-recorded-association']);
  assert.equal(result.personSignals[0].citations[0].occursInUnit, true);
  assert.equal(result.storedStatus, 'audited');
  assert.match(result.limitation, /no source or extraction fingerprint/i);
  assert.throws(() => triage({ ...report, chapter: '002' }, extraction, source), /scope mismatch/);
  assert.deepEqual(result.sourceScope, { book: 'unverified-missing', chapter: 'unverified-missing' });
  assert.deepEqual(triage(report, extraction, { ...source, meta: { book: 'x', chapter: '001' } }).sourceScope, { book: 'metadata-matches', chapter: 'metadata-matches' });
  assert.throws(() => triage(report, extraction, { ...source, meta: { book: 'y', chapter: '001' } }), /Source book scope mismatch/);
  assert.throws(() => triage(report, extraction, { ...source, meta: { book: 'x', chapter: '002' } }), /Source chapter scope mismatch/);
  assert.throws(() => triage(report, extraction, { content: [{ sentences: [{ id: 's0001', zh: '甲' }, { id: 's0001', zh: '乙' }] }] }), /duplicate content-unit ID/);
  assert.throws(() => triage(report, { ...extraction, schemaVersion: 3 }, source), /Unsupported extraction schema/);
  assert.throws(() => triage(report, { ...extraction, surfaces: undefined }, source), /requires surfaces array/);
  assert.throws(() => triage(report, { ...extraction, schemaVersion: 1 }, source), /requires mentions array/);
});

test('grouping is exact JSON order and does not establish evidence independence', () => {
  const report = { book: 'x', chapter: '001', personChecks: [], itemChecks: [
    { id: 'a', evidence: [{ unit: 's0001', quote: '甲' }] },
    { id: 'b', evidence: [{ quote: '甲', unit: 's0001' }] },
  ] };
  const result = triage(report, { book: 'x', chapter: '001', schemaVersion: 2, people: [], surfaces: [] }, { content: [] });
  assert.deepEqual(result.repeatedItemEvidence, []);
  assert.match(result.limitation, /lack of grouping does not establish independent evidence/);
  assert.match(result.limitation, /item-evidence alignment/);
});

test('CLI rejects missing inputs without creating files', () => {
  assert.throws(() => execFileSync(process.execPath, ['research/people/date-evidence-triage.mjs'], { stdio: 'pipe' }), /Usage/);
});

test('successful CLI leaves its three input files and directory unchanged', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'date-evidence-triage-test-'));
  t.after(() => fs.rmSync(directory, { recursive: true }));
  const files = ['report.json', 'extraction.json', 'source.json'].map(name => path.join(directory, name));
  const fixtures = [
    { book: 'x', chapter: '001', status: 'audited', personChecks: [], itemChecks: [] },
    { book: 'x', chapter: '001', schemaVersion: 2, people: [], surfaces: [] },
    { content: [] },
  ];
  files.forEach((file, i) => fs.writeFileSync(file, JSON.stringify(fixtures[i])));
  const before = files.map(file => ({ data: fs.readFileSync(file, 'utf8'), mtime: fs.statSync(file).mtimeMs }));
  const result = JSON.parse(execFileSync(process.execPath, ['research/people/date-evidence-triage.mjs', '--report', files[0], '--extraction', files[1], '--source', files[2]], { encoding: 'utf8' }));
  assert.equal(result.scope, 'x/001');
  assert.deepEqual(fs.readdirSync(directory).sort(), ['extraction.json', 'report.json', 'source.json']);
  assert.deepEqual(files.map(file => ({ data: fs.readFileSync(file, 'utf8'), mtime: fs.statSync(file).mtimeMs })), before);
});
