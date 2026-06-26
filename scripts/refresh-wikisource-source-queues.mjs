#!/usr/bin/env node
/**
 * Refresh per-book Wikisource source-correspondence queues with the current
 * scanner. Existing reviewed decisions are preserved by
 * scan-source-correspondence.mjs; stale pending items disappear when they no
 * longer reproduce against the fetched upstream witness.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence-corpus-wikisource-(.+)\.json$/u;

function usage() {
  console.error(`Usage:
  node scripts/refresh-wikisource-source-queues.mjs [--book BOOK[,BOOK...]]
    [--dry-run] [--scanner-concurrency N] [--retry-count N]
    [--min-severity N] [--progress-every N]

Refreshes data/quality/source-correspondence-corpus-wikisource-<book>.json
from current Wikisource fetches, preserving resolved queue decisions.`);
}

function parseArgs(argv) {
  const opts = {
    books: new Set(),
    dryRun: false,
    scannerConcurrency: 8,
    retryCount: 2,
    minSeverity: 2,
    progressEvery: 50,
  };

  const addBooks = (value) => {
    for (const book of String(value || '').split(',').map((part) => part.trim()).filter(Boolean)) {
      opts.books.add(book);
    }
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--dry-run') {
      opts.dryRun = true;
      continue;
    }
    if (arg === '--book') {
      addBooks(argv[++index]);
      continue;
    }
    if (arg.startsWith('--book=')) {
      addBooks(arg.slice('--book='.length));
      continue;
    }
    if (arg === '--scanner-concurrency') {
      opts.scannerConcurrency = Number(argv[++index]);
      continue;
    }
    if (arg.startsWith('--scanner-concurrency=')) {
      opts.scannerConcurrency = Number(arg.slice('--scanner-concurrency='.length));
      continue;
    }
    if (arg === '--retry-count') {
      opts.retryCount = Number(argv[++index]);
      continue;
    }
    if (arg.startsWith('--retry-count=')) {
      opts.retryCount = Number(arg.slice('--retry-count='.length));
      continue;
    }
    if (arg === '--min-severity') {
      opts.minSeverity = Number(argv[++index]);
      continue;
    }
    if (arg.startsWith('--min-severity=')) {
      opts.minSeverity = Number(arg.slice('--min-severity='.length));
      continue;
    }
    if (arg === '--progress-every') {
      opts.progressEvery = Number(argv[++index]);
      continue;
    }
    if (arg.startsWith('--progress-every=')) {
      opts.progressEvery = Number(arg.slice('--progress-every='.length));
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }

  if (!Number.isFinite(opts.scannerConcurrency) || opts.scannerConcurrency < 1) opts.scannerConcurrency = 8;
  if (!Number.isFinite(opts.retryCount) || opts.retryCount < 0) opts.retryCount = 2;
  if (!Number.isFinite(opts.minSeverity) || opts.minSeverity < 1) opts.minSeverity = 2;
  if (!Number.isFinite(opts.progressEvery) || opts.progressEvery < 1) opts.progressEvery = 50;
  return opts;
}

function queueBooks(opts) {
  return fs.readdirSync(QUALITY_DIR)
    .map((entry) => entry.match(QUEUE_RE)?.[1])
    .filter(Boolean)
    .filter((book) => opts.books.size === 0 || opts.books.has(book))
    .filter((book) => fs.existsSync(path.join(DATA_DIR, book)))
    .sort();
}

function chapterFiles(book) {
  return fs.readdirSync(path.join(DATA_DIR, book))
    .filter((entry) => /^\d{3}\.json$/u.test(entry))
    .map((entry) => path.join('data', book, entry))
    .sort();
}

function runBook(book, opts) {
  const files = chapterFiles(book);
  const out = path.join('data', 'quality', `source-correspondence-corpus-wikisource-${book}.json`);
  const args = [
    'scripts/scan-source-correspondence.mjs',
    ...files,
    '--source-name',
    'wikisource',
    '--out',
    out,
    '--min-severity',
    String(opts.minSeverity),
    '--concurrency',
    String(opts.scannerConcurrency),
    '--retry-rate-limit',
    '--retry-count',
    String(opts.retryCount),
    '--quiet',
    '--progress-every',
    String(opts.progressEvery),
  ];

  if (opts.dryRun) {
    console.log(['node', ...args].join(' '));
    return { book, status: 'dry-run', files: files.length };
  }

  console.error(`refresh-wikisource: ${book} (${files.length} chapters)`);
  const result = spawnSync('node', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 1024 * 1024 * 50,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error(`${book}: scanner exited ${result.status}`);
  }
  return { book, status: 'refreshed', files: files.length };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const books = queueBooks(opts);
  const summary = [];
  for (const book of books) {
    summary.push(runBook(book, opts));
  }
  console.log(JSON.stringify({
    dryRun: opts.dryRun,
    books: summary.length,
    summary,
  }, null, 2));
}

main();
