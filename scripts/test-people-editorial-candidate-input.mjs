import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./build-people-editorial-review.mjs', import.meta.url));
function run(...args) {
  return spawnSync(process.execPath, [script, '--book', 'jinshu', '--chapter', '037', ...args], { encoding: 'utf8' });
}

test('candidate review requires a separate output path', () => {
  const result = run('--extraction', 'candidate.json');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--extraction requires an explicit --out/);
});

test('candidate and canonical extraction inputs cannot be overwritten by review output', () => {
  for (const output of ['candidate.json', 'data/people/extractions/jinshu/037.json']) {
    const result = run('--extraction', 'candidate.json', '--out', output);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /must not overwrite an extraction input/);
  }
  const result = run('--extraction', 'candidate.json', '--out', 'dossier.json', '--decision-seed-out', 'candidate.json');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must not overwrite an extraction input/);
});

test('dossier and decision seed cannot overwrite each other', () => {
  const result = run('--extraction', 'candidate.json', '--out', 'dossier.json', '--decision-seed-out', 'dossier.json');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must use different output paths/);
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
