#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const RESERVE_BYTES = 30n * 1024n ** 3n;

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
  return {
    primary, availableBytes: availableBytes.toString(),
    availableGiB: Number(availableBytes / (1024n ** 2n)) / 1024,
    reserveGiB: 30, worktrees,
    errors: evaluateDiskPolicy({ availableBytes, primary, worktrees }),
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
