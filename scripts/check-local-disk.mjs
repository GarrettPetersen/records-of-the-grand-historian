#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const RESERVE_BYTES = 30n * 1024n ** 3n;
export const SWAP_WARNING_BYTES = 4n * 1024n ** 3n;
export const MAX_SWAP_BYTES = 8n * 1024n ** 3n;
export const MAX_CODEX_RSS_BYTES = 4n * 1024n ** 3n;

export function parseMacSwapUsage(output) {
  const match = /^vm\.swapusage:\s+total\s*=\s*(\d+(?:\.\d+)?)([KMGT])\s+used\s*=\s*(\d+(?:\.\d+)?)([KMGT])\s+free\s*=\s*(\d+(?:\.\d+)?)([KMGT])(?:\s+\(encrypted\))?\s*$/.exec(output);
  if (!match) throw new Error('Unrecognized macOS swap measurement');
  const bytes = (value, unit) => {
    const [whole, fraction = ''] = value.split('.');
    const scale = 1024n ** BigInt('KMGT'.indexOf(unit) + 1);
    return BigInt(whole) * scale + BigInt(fraction || '0') * scale / 10n ** BigInt(fraction.length);
  };
  const total = bytes(match[1], match[2]), used = bytes(match[3], match[4]), free = bytes(match[5], match[6]);
  if (used > total || free > total) throw new Error('Invalid macOS swap measurement');
  return used;
}

export function parseCodexResidentUsage(output) {
  const processes = [];
  for (const line of output.split('\n').filter(line => line.trim())) {
    const match = /^\s*(\d+)\s+(\d+)\s+(.+?)\s*$/.exec(line);
    if (!match) throw new Error('Unrecognized process resident-memory measurement');
    if (path.basename(match[3]) !== 'codex') continue;
    processes.push({ pid: match[1], residentBytes: (BigInt(match[2]) * 1024n).toString() });
  }
  return processes;
}

export function evaluateMemoryPolicy({ swapUsedBytes, codexResidentBytes, pressureLevel }) {
  for (const bytes of [swapUsedBytes, codexResidentBytes]) {
    if (typeof bytes !== 'bigint' || bytes < 0n) throw new Error('Invalid memory measurement');
  }
  if (![1, 2, 4].includes(pressureLevel)) throw new Error('Unknown macOS memory pressure level');
  const errors = [];
  if (swapUsedBytes >= MAX_SWAP_BYTES) errors.push('macOS swap is at least 8 GiB: stop new glossary dispatches and local heavy jobs; preserve work and end this coordination session.');
  if (codexResidentBytes >= MAX_CODEX_RSS_BYTES) errors.push('Codex backends have at least 4 GiB combined resident memory: stop new work and rotate to a fresh, compact-handoff chat.');
  if (pressureLevel !== 1) errors.push('macOS reports warning or critical memory pressure: stop new glossary work.');
  return errors;
}

export function inspectMemory(platform = process.platform, execute = execFileSync) {
  if (platform !== 'darwin') return {
    status: 'not-applicable', platform,
    reason: 'macOS host memory guard; disk policy still applies. This is not a memory-safety assessment of other platforms.',
    errors: [],
  };
  const read = (command, args) => execute(command, args, { encoding: 'utf8', timeout: 5000, maxBuffer: 2 * 1024 * 1024 });
  const swapUsedBytes = parseMacSwapUsage(read('sysctl', ['vm.swapusage']));
  // Executable names only: never collect process arguments, environment or credentials.
  const codexProcesses = parseCodexResidentUsage(read('ps', ['-axo', 'pid=,rss=,comm=']));
  const codexResidentBytes = codexProcesses.reduce((total, row) => total + BigInt(row.residentBytes), 0n);
  const rawPressure = read('sysctl', ['-n', 'kern.memorystatus_vm_pressure_level']).trim();
  if (!/^[124]$/.test(rawPressure)) throw new Error('Unrecognized macOS memory pressure measurement');
  const pressureLevel = Number(rawPressure);
  return {
    status: 'measured', platform, swapUsedBytes: swapUsedBytes.toString(),
    codexResidentBytes: codexResidentBytes.toString(), codexProcesses, pressureLevel,
    warningSwapBytes: SWAP_WARNING_BYTES.toString(),
    warnings: swapUsedBytes >= SWAP_WARNING_BYTES ? ['macOS swap is at least 4 GiB: inspect memory consumers, pressure and swap growth before increasing concurrency.'] : [],
    maxSwapBytes: MAX_SWAP_BYTES.toString(), maxCodexResidentBytes: MAX_CODEX_RSS_BYTES.toString(),
    errors: evaluateMemoryPolicy({ swapUsedBytes, codexResidentBytes, pressureLevel }),
  };
}

export function evaluateDiskPolicy({ availableBytes, primary, worktrees }) {
  if (typeof availableBytes !== 'bigint' || availableBytes < 0n) throw new Error('Invalid available disk measurement');
  if (!worktrees.some(tree => tree.path === primary)) throw new Error('Primary checkout missing from worktree inventory');
  const errors = [];
  if (availableBytes < RESERVE_BYTES) errors.push('Less than 30 GiB available: stop new checkouts/full builds and reclaim only verified completed work.');
  for (const tree of worktrees) {
    if (tree.path !== primary && tree.hasPublic) errors.push(`Secondary checkout contains public/: ${tree.path}. Check ownership and recovery before reducing or archiving it.`);
  }
  return errors;
}

export function inspectLocalDisk(repoRoot) {
  const git = (...args) => execFileSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8' }).trimEnd();
  const common = fs.realpathSync(git('rev-parse', '--path-format=absolute', '--git-common-dir'));
  if (path.basename(common) !== '.git') throw new Error('Expected a non-bare repository with a primary .git directory');
  const primary = fs.realpathSync(path.dirname(common));
  const stats = fs.statfsSync(primary, { bigint: true });
  const availableBytes = stats.bavail * stats.bsize;
  const worktrees = git('worktree', 'list', '--porcelain', '-z').split('\0')
    .filter(field => field.startsWith('worktree '))
    .map(field => {
      const checkout = fs.realpathSync(field.slice('worktree '.length));
      return { path: checkout, hasPublic: fs.existsSync(path.join(checkout, 'public')) };
    });
  const memory = inspectMemory();
  return {
    primary, availableBytes: availableBytes.toString(),
    availableGiB: Number(availableBytes / (1024n ** 2n)) / 1024,
    reserveGiB: 30, worktrees,
    memory,
    errors: [...evaluateDiskPolicy({ availableBytes, primary, worktrees }), ...memory.errors],
    scope: 'Registered worktrees only; external clones and service runtimes must also be checked by the host.',
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  if (process.argv.length !== 2) throw new Error('Usage: node scripts/check-local-disk.mjs (read-only; no overrides)');
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const report = inspectLocalDisk(repoRoot);
  console.log(JSON.stringify(report, null, 2));
  if (report.errors.length) process.exitCode = 1;
}
