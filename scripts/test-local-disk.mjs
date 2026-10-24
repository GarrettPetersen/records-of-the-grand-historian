import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { evaluateDiskPolicy, inspectLocalDisk, RESERVE_BYTES } from './check-local-disk.mjs';

const primary = '/primary';
const tree = { path: primary, hasPublic: true };
test('one full primary and sparse secondary meet the reserve', () => {
  assert.deepEqual(evaluateDiskPolicy({ availableBytes: RESERVE_BYTES, primary,
    worktrees: [tree, { path: '/sparse', hasPublic: false }] }), []);
});
test('reserve uses available bytes and fails even one byte below the boundary', () => {
  assert.match(evaluateDiskPolicy({ availableBytes: RESERVE_BYTES - 1n, primary, worktrees: [tree] })[0], /30 GiB/);
});
test('full secondary fails even with plenty of disk', () => {
  assert.match(evaluateDiskPolicy({ availableBytes: RESERVE_BYTES * 2n, primary,
    worktrees: [tree, { path: '/duplicate', hasPublic: true }] })[0], /Secondary checkout contains public/);
});
test('invalid measurements and incomplete inventory fail loudly', () => {
  assert.throws(() => evaluateDiskPolicy({ availableBytes: -1n, primary, worktrees: [tree] }), /Invalid/);
  assert.throws(() => evaluateDiskPolicy({ availableBytes: NaN, primary, worktrees: [tree] }), /Invalid/);
  assert.throws(() => evaluateDiskPolicy({ availableBytes: RESERVE_BYTES, primary, worktrees: [] }), /Primary/);
});
test('inventory works from a secondary, tolerates spaces, and never changes Git state', t => {
  // Tiny empty fixture repositories only; never copy or create a project worktree.
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'disk-policy-test-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const repo = path.join(temp, 'primary checkout'), secondary = path.join(temp, 'secondary checkout');
  fs.mkdirSync(repo);
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  git('init');
  git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '--allow-empty', '-m', 'fixture');
  git('worktree', 'add', '--detach', '--no-checkout', secondary, 'HEAD');
  fs.mkdirSync(path.join(repo, 'public'));
  const before = git('status', '--porcelain');
  const report = inspectLocalDisk(secondary);
  assert.equal(report.primary, fs.realpathSync(repo));
  assert.equal(report.worktrees.length, 2);
  assert.equal(report.worktrees.find(w => w.path === fs.realpathSync(secondary)).hasPublic, false);
  fs.mkdirSync(path.join(secondary, 'public'));
  assert.match(inspectLocalDisk(repo).errors.join('\n'), /Secondary checkout/);
  assert.equal(git('status', '--porcelain'), before);
});
test('lane documentation does not reintroduce the per-bot checkout instructions', () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const lane = fs.readFileSync(path.join(root, 'GROKBOT_PEOPLE_LANE.md'), 'utf8');
  assert.doesNotMatch(lane, /Keep one clone or Git worktree per concurrently running bot|start that next chapter in a clean worktree/);
  for (const file of ['AGENTS.md', 'LOCAL_DISK_STRATEGY.md', 'GROKBOT_PEOPLE_LANE.md']) {
    assert.match(fs.readFileSync(path.join(root, file), 'utf8'), /people:disk:check/);
  }
});
