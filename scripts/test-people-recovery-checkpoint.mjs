import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { createPeopleRecoveryCheckpoint, validatePeopleCheckpointPaths } from './create-people-recovery-checkpoint.mjs';

test('generated/private paths, directories, aliases and duplicate selections cannot become recovery objects', () => {
  for (const f of ['public/index.html', 'data/people/generated/review.json', 'node_modules/a', '.env', '.env.production',
    '.git/config', '../elsewhere', '/absolute', 'data/../source', 'dist/a', '.codex/response']) {
    assert.throws(() => validatePeopleCheckpointPaths([f]), /refuses/);
  }
  assert.throws(() => validatePeopleCheckpointPaths(['source', 'source']), /unique/);
});
test('source checkpoint preserves exact HEAD/index/working differences without importing ignored recovery', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'people-checkpoint-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  git(['init', '-q']); git(['config', 'user.name', 'Fixture']); git(['config', 'user.email', 'fixture@example.invalid']);
  fs.writeFileSync(path.join(root, '.gitignore'), 'ignored\n'); fs.writeFileSync(path.join(root, 'source'), 'original');
  git(['add', '.']); git(['commit', '-qm', 'base']);
  fs.writeFileSync(path.join(root, 'source'), 'staged'); git(['add', 'source']);
  fs.writeFileSync(path.join(root, 'source'), 'unfinished'); fs.writeFileSync(path.join(root, 'ignored'), 'private model output');
  const before = fs.readFileSync(path.join(root, '.git/index')), head = git(['rev-parse', 'HEAD']);
  const result = createPeopleRecoveryCheckpoint({ root, files: ['source'], prefix: 'refs/recovery/test' });
  assert.equal(git(['show', result.index + ':source']), 'staged');
  assert.equal(git(['show', result.working + ':source']), 'unfinished');
  assert.equal(git(['rev-parse', 'HEAD']), head); assert.deepEqual(fs.readFileSync(path.join(root, '.git/index')), before);
  assert.doesNotMatch(git(['ls-tree', '-r', '--name-only', result.working]), /ignored/);
  assert.throws(() => createPeopleRecoveryCheckpoint({ root, files: ['source'], prefix: 'refs/recovery/test' }), /already exists/);
  assert.throws(() => createPeopleRecoveryCheckpoint({ root, files: ['ignored'], prefix: 'refs/recovery/private' }), /ignored/);
  fs.mkdirSync(path.join(root, 'outside')); fs.writeFileSync(path.join(root, 'outside/secret'), 'private');
  fs.symlinkSync(path.join(root, 'outside'), path.join(root, 'redirect'));
  assert.throws(() => createPeopleRecoveryCheckpoint({ root, files: ['redirect/secret'], prefix: 'refs/recovery/redirect' }), /redirected/);
  fs.writeFileSync(path.join(root, '.gitattributes'), 'source filter=normalize\n');
  git(['config', 'filter.normalize.clean', 'tr a-z A-Z']);
  fs.writeFileSync(path.join(root, 'source'), 'exact lowercase\r\n');
  const filtered = createPeopleRecoveryCheckpoint({ root, files: ['source'], prefix: 'refs/recovery/no-filters' });
  assert.deepEqual(execFileSync('git', ['cat-file', 'blob', filtered.working + ':source'], { cwd: root }), Buffer.from('exact lowercase\r\n'));
});
