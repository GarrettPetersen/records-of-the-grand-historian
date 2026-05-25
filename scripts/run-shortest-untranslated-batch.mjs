#!/usr/bin/env node
/**
 * Launch cloud SDK agents for the N shortest gray/yellow chapters on origin/master,
 * skipping anything in-flight (open PRs, staging, local claims).
 *
 *   node scripts/run-shortest-untranslated-batch.mjs --dry-run
 *   node scripts/run-shortest-untranslated-batch.mjs --limit 100
 *   SDK_CHAPTER_BATCH_CONCURRENCY=25 node scripts/run-shortest-untranslated-batch.mjs
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { countChapterMetrics } from '../chapter-counts.mjs';
import { loadDotenv } from './load-dotenv.mjs';
import { normalizeChapterId } from './normalize-chapter-id.mjs';
import { incompleteChaptersOnGitRefAsync } from './sdk-merge-wait.mjs';
import { REPO_ROOT } from './sdk-translation-books.mjs';
import {
  buildInflightRegistry,
  chapterKey,
  isChapterInflight,
} from './translation-inflight.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadDotenv(ROOT);

const LOG = process.env.SDK_SHORTEST_BATCH_LOG || '/tmp/sdk-shortest-100.log';
const PLAN_PATH = path.join(ROOT, 'data', 'shortest-untranslated-batch-plan.json');
const MASTER_REF = 'origin/master';

function parseArgs() {
  const dryRun = process.argv.includes('--dry-run');
  let limit = 100;
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === '--limit' && process.argv[i + 1]) {
      limit = Number.parseInt(process.argv[++i], 10) || 100;
    }
  }
  const concurrency = Number.parseInt(process.env.SDK_CHAPTER_BATCH_CONCURRENCY ?? '100', 10) || 100;
  return { dryRun, limit, concurrency };
}

function log(line) {
  fs.appendFileSync(LOG, line + '\n');
  console.log(line);
}

function fetchMaster() {
  execSync('git fetch origin master', { cwd: ROOT, stdio: 'inherit' });
}

function listBooksOnRef(ref) {
  try {
    const out = execSync(`git ls-tree --name-only "${ref}:data"`, {
      cwd: ROOT,
      encoding: 'utf8',
    });
    return out
      .trim()
      .split('\n')
      .filter((name) => name && !name.includes('.'));
  } catch {
    return [];
  }
}

/**
 * @param {string} ref
 * @param {string} book
 * @param {string} chapter
 */
function sentenceCountOnRef(ref, book, chapter) {
  try {
    const json = execSync(`git show "${ref}:data/${book}/${chapter}.json"`, {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
    });
    return countChapterMetrics(JSON.parse(json)).sentenceCount;
  } catch {
    return 99999;
  }
}

/**
 * Uses origin/master chapter JSON (progress.json is not in git).
 *
 * @returns {Promise<Array<{ book: string, chapter: string, status: string, sentences: number, skip?: string }>>}
 */
async function collectCandidates() {
  const registry = await buildInflightRegistry({ fetchGit: true });
  const books = listBooksOnRef(MASTER_REF);

  /** @type {Array<{ book: string, chapter: string, status: string, sentences: number, skip?: string }>} */
  const raw = [];

  for (const book of books) {
    const incomplete = await incompleteChaptersOnGitRefAsync(MASTER_REF, book);
    for (const chapter of incomplete) {
      const ch = normalizeChapterId(chapter);
      const sentences = sentenceCountOnRef(MASTER_REF, book, ch);
      let skip = null;
      if (isChapterInflight(book, ch, registry)) {
        skip = 'in-flight';
      }
      raw.push({ book, chapter: ch, status: 'incomplete', sentences, skip });
    }
  }

  return raw;
}

/**
 * @param {Array<{ book: string, chapter: string, status: string, sentences: number, skip?: string | null }>} raw
 * @param {number} limit
 */
function selectShortest(raw, limit) {
  const eligible = raw.filter((r) => !r.skip);
  eligible.sort((a, b) => a.sentences - b.sentences || a.book.localeCompare(b.book) || a.chapter.localeCompare(b.chapter));
  return eligible.slice(0, limit);
}

function runOne({ book, chapter, sentences }) {
  return new Promise((resolve) => {
    log(`\n=== START ${book}/${chapter} (${sentences} sentences) ${new Date().toISOString()} ===`);
    const child = spawn(
      process.execPath,
      [
        path.join(ROOT, 'scripts/sdk-translate-cloud.mjs'),
        '--book',
        book,
        '--chapter',
        chapter,
        '--no-stream',
      ],
      { cwd: ROOT, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
    );
    child.stdout?.on('data', (d) => fs.appendFileSync(LOG, d));
    child.stderr?.on('data', (d) => fs.appendFileSync(LOG, d));
    child.on('close', (code) => {
      log(`=== END ${book}/${chapter} exit=${code} ===`);
      resolve({ book, chapter, code });
    });
  });
}

/**
 * @param {Array<{ book: string, chapter: string, sentences: number }>} items
 * @param {number} concurrency
 */
async function runPool(items, concurrency) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await runOne(items[i]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

async function main() {
  const { dryRun, limit, concurrency } = parseArgs();

  if (!dryRun && !process.env.CURSOR_API_KEY) {
    console.error('CURSOR_API_KEY is required (set in .env or environment).');
    process.exit(1);
  }

  console.log('Fetching origin/master…');
  fetchMaster();

  const raw = await collectCandidates();
  const skipped = raw.filter((r) => r.skip);
  const selected = selectShortest(raw, limit);

  const plan = {
    generatedAt: new Date().toISOString(),
    masterRef: MASTER_REF,
    limit,
    concurrency,
    skippedCount: skipped.length,
    skipped: skipped.map((r) => ({
      book: r.book,
      chapter: r.chapter,
      reason: r.skip,
      sentences: r.sentences,
    })),
    launch: selected.map((r) => ({
      book: r.book,
      chapter: r.chapter,
      status: r.status,
      sentences: r.sentences,
    })),
  };

  fs.mkdirSync(path.dirname(PLAN_PATH), { recursive: true });
  fs.writeFileSync(PLAN_PATH, JSON.stringify(plan, null, 2) + '\n');

  console.log(`\nPlan: ${PLAN_PATH}`);
  console.log(`Log: ${LOG}`);
  console.log(`Gray/yellow on master: ${raw.length}`);
  console.log(`Skipped (in-flight or already complete): ${skipped.length}`);
  console.log(`Launching: ${selected.length} (concurrency ${concurrency})\n`);

  if (selected.length === 0) {
    console.log('Nothing to launch.');
    return;
  }

  for (const r of selected.slice(0, 20)) {
    console.log(`  ${r.book}/${r.chapter} (${r.sentences} sentences, ${r.status})`);
  }
  if (selected.length > 20) {
    console.log(`  …and ${selected.length - 20} more`);
  }

  if (dryRun) {
    console.log('\nDry-run: not starting agents.');
    return;
  }

  fs.writeFileSync(LOG, `=== shortest untranslated batch ${new Date().toISOString()} ===\n`);
  fs.writeFileSync(
    LOG,
    `Launch ${selected.length} chapters, concurrency ${concurrency}\n`,
    { flag: 'a' },
  );

  const results = await runPool(selected, concurrency);
  const failed = results.filter((r) => r.code !== 0);
  console.log(`\nFinished: ${results.length - failed.length} ok, ${failed.length} failed`);
  if (failed.length > 0) {
    for (const r of failed.slice(0, 10)) {
      console.log(`  ${r.book}/${r.chapter} exit ${r.code}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
