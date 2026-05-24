#!/usr/bin/env node
/**
 * Merge cursor SDK branches (pushed without PR) into the current branch.
 *
 * Usage:
 *   git checkout master && git pull
 *   node scripts/merge-cursor-translation-branches.mjs [--dry-run]
 */
import { execSync } from 'node:child_process';

/** One branch per book from 2026-05-24 SDK bulk run (deduped). */
const BRANCHES = [
  'origin/cursor/qingshigao-translation-f61d',
  'origin/cursor/songshi-translation-4a9f',
  'origin/cursor/mingshi-translation-12e8',
  'origin/cursor/zizhitongjian-translation-1b7c',
  'origin/cursor/xintangshu-translation-1607',
  'origin/cursor/jiutangshu-translation-2a42',
  'origin/cursor/yuanshi-ch038-translation-c0e4',
  'origin/cursor/translate-jiuwudaishi-1151',
];

const dryRun = process.argv.includes('--dry-run');
const master = 'origin/master';

const allFiles = new Set();
for (const branch of BRANCHES) {
  const files = execSync(`git diff --name-only ${master}..."${branch}"`, { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);
  console.log(`${branch}: ${files.length} files`);
  for (const f of files) allFiles.add(f);
}

console.log(`\nTotal unique files: ${allFiles.size}`);

if (dryRun) {
  for (const f of [...allFiles].sort()) console.log(f);
  process.exit(0);
}

for (const branch of BRANCHES) {
  const files = execSync(`git diff --name-only ${master}..."${branch}"`, { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);
  if (files.length === 0) continue;
  const chunkSize = 30;
  for (let i = 0; i < files.length; i += chunkSize) {
    const part = files.slice(i, i + chunkSize);
    execSync(`git checkout "${branch}" -- ${part.map((f) => `"${f}"`).join(' ')}`, {
      stdio: 'inherit',
      shell: true,
    });
  }
}

console.log('\nFiles checked out from agent branches. Review with git status, then commit.');
