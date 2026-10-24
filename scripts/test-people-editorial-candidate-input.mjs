import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildEditorialReviewDossierFromLoaded } from './build-people-editorial-review.mjs';

const script = fileURLToPath(new URL('./build-people-editorial-review.mjs', import.meta.url));
function run(...args) {
  return spawnSync(process.execPath, [script, '--book', 'jinshu', '--chapter', '037', ...args], { encoding: 'utf8' });
}

test('dossier and seed contain the candidate proposals and related source evidence', () => {
  const proposal = {
    id: 'fixture:001:r0002',
    unit: { id: 's0001', kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: 0 },
    field: 'idiomatic', before: 'Old reading', after: 'New reading', reason: 'Source reading', confidence: 'high', status: 'proposed',
  };
  const loaded = {
    chapterId: '001',
    packet: { source: {}, input: { chapterFingerprint: 'sha256:fixture' }, units: [{ id: 's0001', zh: '原文', en: 'Old reading', literal: 'Literal' }] },
    extraction: {
      book: 'fixture', chapter: '001', input: { chapterFingerprint: 'sha256:fixture' }, run: { model: 'fixture' },
      people: [{ localId: 'p0001' }], claims: [{ subject: 'p0001', evidence: ['fixture:001:s0001'] }],
      translationRepairs: [proposal],
    },
  };
  const before = structuredClone(loaded);
  const dossier = buildEditorialReviewDossierFromLoaded('fixture', loaded);
  assert.equal(dossier.items[0].proposal.after, 'New reading');
  assert.equal(dossier.items[0].context[0].zh, '原文');
  assert.equal(dossier.items[0].relatedPeople[0].localId, 'p0001');
  assert.equal(dossier.decisionSeed.proposals[0].id, proposal.id);
  assert.equal(dossier.decisionSeed.proposals[0].after, 'New reading');
  assert.deepEqual(loaded, before);
});

test('candidate review requires a separate output path', () => {
  const result = run('--extraction', 'candidate.json');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--extraction requires an explicit --out/);
});

test('candidate, source, canonical extraction, and decision history cannot be overwritten by review output', () => {
  for (const output of ['candidate.json', 'data/people/extractions/jinshu/037.json', 'data/jinshu/037.json', 'data/people/editorial-decisions/jinshu/037.json']) {
    const result = run('--extraction', 'candidate.json', '--out', output);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /must not overwrite a source or review input/);
  }
  const result = run('--extraction', 'candidate.json', '--out', 'dossier.json', '--decision-seed-out', 'candidate.json');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must not overwrite a source or review input/);
});

test('canonical review outputs cannot overwrite chapter source or prior decisions', () => {
  const source = run('--out', 'data/jinshu/037.json');
  assert.notEqual(source.status, 0);
  assert.match(source.stderr, /must not overwrite a source or review input/);
  const history = run('--out', 'dossier.json', '--decision-seed-out', 'data/people/editorial-decisions/jinshu/037.json');
  assert.notEqual(history.status, 0);
  assert.match(history.stderr, /must not overwrite a source or review input/);
});

test('dossier and decision seed cannot overwrite each other', () => {
  const result = run('--extraction', 'candidate.json', '--out', 'dossier.json', '--decision-seed-out', 'dossier.json');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must use different output paths/);
  const implicit = run('--decision-seed-out', 'data/people/generated/editorial-review/jinshu/037.json');
  assert.notEqual(implicit.status, 0);
  assert.match(implicit.stderr, /must use different output paths/);
});

test('symlinked paths cannot overwrite candidate inputs', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'people-review-symlink-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const candidate = path.join(dir, 'candidate.json');
  const link = path.join(dir, 'linked.json');
  fs.writeFileSync(candidate, '{}');
  fs.symlinkSync(candidate, link);
  const result = run('--extraction', candidate, '--out', link);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must not overwrite a source or review input/);
  assert.equal(fs.readFileSync(candidate, 'utf8'), '{}');
});

test('candidate input is read rather than silently falling back to canonical extraction', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'people-review-candidate-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const candidate = path.join(dir, 'invalid.json');
  fs.writeFileSync(candidate, '{');
  const result = run('--extraction', candidate, '--out', path.join(dir, 'dossier.json'));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /JSON|Unexpected|property name/i);
  assert.equal(fs.existsSync(path.join(dir, 'dossier.json')), false);
});
