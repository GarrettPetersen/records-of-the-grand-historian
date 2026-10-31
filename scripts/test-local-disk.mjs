import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  evaluateDiskPolicy, inspectLocalDisk, RESERVE_BYTES, SWAP_WARNING_BYTES, MAX_SWAP_BYTES, MAX_CODEX_RSS_BYTES,
  parseMacSwapUsage, parseCodexResidentUsage, evaluateMemoryPolicy, inspectMemory,
} from './check-local-disk.mjs';

test('swap parser handles encrypted, zero and fractional measurements without guessing', () => {
  assert.equal(parseMacSwapUsage('vm.swapusage: total = 7168.00M  used = 6063.50M  free = 1104.50M  (encrypted)\n'), 6063n * 1024n ** 2n + 512n * 1024n);
  assert.equal(parseMacSwapUsage('vm.swapusage: total = 0.00M used = 0.00M free = 0.00M'), 0n);
  for (const text of ['unavailable', 'vm.swapusage: total = 0M used = 1M free = 0M',
    'vm.swapusage: total = 0M used = 0M free = 1M']) {
    assert.throws(() => parseMacSwapUsage(text), /swap measurement/);
  }
});

test('resident totals count Codex backends, preserving spaces and excluding other executables', () => {
  assert.deepEqual(parseCodexResidentUsage(' 12 1024 /Applications/ChatGPT App/CodexCLI.app/Contents/MacOS/codex\n13 2048 codex\n14 999999 /usr/bin/node\n'), [
    { pid: '12', residentBytes: '1048576' }, { pid: '13', residentBytes: '2097152' },
  ]);
  assert.throws(() => parseCodexResidentUsage('12 -1 codex'), /measurement/);
});

test('memory guard stops at 8 GiB swap while retaining RSS and pressure limits', () => {
  const normal = { swapUsedBytes: MAX_SWAP_BYTES - 1n, codexResidentBytes: MAX_CODEX_RSS_BYTES - 1n, pressureLevel: 1 };
  assert.deepEqual(evaluateMemoryPolicy(normal), []);
  assert.match(evaluateMemoryPolicy({ ...normal, swapUsedBytes: MAX_SWAP_BYTES })[0], /swap/);
  assert.match(evaluateMemoryPolicy({ ...normal, codexResidentBytes: MAX_CODEX_RSS_BYTES })[0], /Codex/);
  for (const pressureLevel of [2, 4]) assert.match(evaluateMemoryPolicy({ ...normal, pressureLevel })[0], /pressure/);
  assert.throws(() => evaluateMemoryPolicy({ ...normal, swapUsedBytes: -1n }), /Invalid memory/);
  assert.throws(() => evaluateMemoryPolicy({ ...normal, pressureLevel: 0 }), /Unknown/);
});

test('macOS inspection collects no process arguments and propagates measurement failures', () => {
  const commands = [];
  const execute = (command, args, options) => {
    commands.push([command, args]);
    assert.equal(options.timeout, 5000);
    if (command === 'ps') return '12 1048576 /Applications/CodexCLI.app/Contents/MacOS/codex\n';
    return args[0] === 'vm.swapusage' ? 'vm.swapusage: total = 8192M used = 4096M free = 4096M' : '1\n';
  };
  const report = inspectMemory('darwin', execute);
  assert.equal(report.status, 'measured');
  assert.equal(report.codexResidentBytes, '1073741824');
  assert.deepEqual(report.errors, []);
  assert.match(report.warnings[0], /4 GiB/);
  assert.equal(report.warningSwapBytes, SWAP_WARNING_BYTES.toString());
  assert.equal(report.maxSwapBytes, (8n * 1024n ** 3n).toString());
  assert.deepEqual(commands[1], ['ps', ['-axo', 'pid=,rss=,comm=']]);
  assert.throws(() => inspectMemory('darwin', () => { throw new Error('measurement failed'); }), /measurement failed/);
  assert.equal(inspectMemory('linux', () => assert.fail('must not run macOS commands')).status, 'not-applicable');
});

test('swap warnings start at 4 GiB and admission stops at 8 GiB', () => {
  for (const [usedMiB, warning, stopped] of [[4095, false, false], [4096, true, false], [8191, true, false], [8192, true, true]]) {
    const execute = (command, args) => command === 'ps' ? '12 1024 codex\n'
      : args[0] === 'vm.swapusage' ? `vm.swapusage: total = 8192M used = ${usedMiB}M free = ${8192 - usedMiB}M` : '1\n';
    const report = inspectMemory('darwin', execute);
    assert.equal(report.warnings.length > 0, warning, `warning at ${usedMiB} MiB`);
    assert.equal(report.errors.length > 0, stopped, `stop at ${usedMiB} MiB`);
  }
});

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
