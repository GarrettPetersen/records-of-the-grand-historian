#!/usr/bin/env node
/**
 * Launch cloud SDK editorial-review sessions for many chapters (one agent per chapter).
 * Independent of translation batch / translation-inflight.
 *
 *   node scripts/run-review-batch.mjs --book shiji --dry-run
 *   node scripts/run-review-batch.mjs --book shiji --limit 20
 *   SDK_REVIEW_BATCH_CONCURRENCY=10 node scripts/run-review-batch.mjs --book shiji
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDotenv } from './load-dotenv.mjs';
import { DEFAULT_REPO_URL, listOpenCursorTranslationPrs } from './github-pr.mjs';
import { listUnreviewedChapters, loadManifest } from './review-queue.mjs';
import { parsePrChapter, listKnownBookIds } from './translation-inflight.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadDotenv(ROOT);

const LOG = process.env.SDK_REVIEW_BATCH_LOG || '/tmp/sdk-review-batch.log';
const PLAN_PATH = path.join(ROOT, 'data', 'review-batch-plan.json');

function parseArgs() {
  const dryRun = process.argv.includes('--dry-run');
  let book = null;
  let limit = Infinity;
  let skipOpenPrs = !process.argv.includes('--no-skip-open-prs');

  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === '--book' && process.argv[i + 1]) {
      book = process.argv[++i].trim();
    }
    if (process.argv[i] === '--limit' && process.argv[i + 1]) {
      limit = Number.parseInt(process.argv[++i], 10) || Infinity;
    }
  }

  if (!book) {
    console.error('Usage: node scripts/run-review-batch.mjs --book <id> [--limit N] [--dry-run]');
    console.error('  SDK_REVIEW_BATCH_CONCURRENCY=10 (default)');
    process.exit(1);
  }

  const concurrency =
    Number.parseInt(process.env.SDK_REVIEW_BATCH_CONCURRENCY ?? '10', 10) || 10;

  return { dryRun, book, limit, concurrency, skipOpenPrs };
}

function log(line) {
  fs.appendFileSync(LOG, line + '\n');
  console.log(line);
}

/**
 * Chapters with an open cursor/* PR (any workflow) for this book.
 *
 * @param {string} book
 */
async function openPrChapterKeys(book) {
  const bookIds = listKnownBookIds();
  const keys = new Set();
  const prs = await listOpenCursorTranslationPrs(
    process.env.GITHUB_REPO_URL ?? DEFAULT_REPO_URL,
  );
  for (const pr of prs) {
    const parsed = parsePrChapter(pr, bookIds);
    if (parsed?.book === book && parsed.chapter) {
      keys.add(`${book}/${parsed.chapter}`);
    }
  }
  return keys;
}

/**
 * @param {Array<{ bookId: string, chapter: string, sentences: number }>} items
 * @param {number} concurrency
 */
async function runPool(items, concurrency) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      const item = items[i];
      results[i] = await runOne(item);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

/**
 * @param {{ bookId: string, chapter: string, sentences: number }} item
 */
function runOne({ bookId, chapter, sentences }) {
  return new Promise((resolve) => {
    log(
      `\n=== START review ${bookId}/${chapter} (${sentences} strings) ${new Date().toISOString()} ===`,
    );
    const child = spawn(
      process.execPath,
      [
        path.join(ROOT, 'scripts', 'sdk-review-cloud.mjs'),
        '--book',
        bookId,
        '--chapter',
        chapter,
        '--no-stream',
      ],
      { cwd: ROOT, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
    );
    child.stdout?.on('data', (d) => fs.appendFileSync(LOG, d));
    child.stderr?.on('data', (d) => fs.appendFileSync(LOG, d));
    child.on('close', (code) => {
      log(`=== END review ${bookId}/${chapter} exit=${code} ===`);
      resolve({ bookId, chapter, code });
    });
  });
}

async function main() {
  const { dryRun, book, limit, concurrency, skipOpenPrs } = parseArgs();

  if (!dryRun && !process.env.CURSOR_API_KEY) {
    console.error('CURSOR_API_KEY is required (set in .env or environment).');
    process.exit(1);
  }

  const manifest = loadManifest();
  const raw = listUnreviewedChapters(manifest, book);

  let prKeys = new Set();
  if (skipOpenPrs && (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.CURSOR_API_KEY)) {
    try {
      prKeys = await openPrChapterKeys(book);
    } catch (err) {
      console.warn(
        `Could not load open PRs (${err instanceof Error ? err.message : err}) — not skipping PR chapters`,
      );
    }
  }

  const withSkip = raw.map((r) => {
    const key = `${r.bookId}/${r.chapter}`;
    const skip = prKeys.has(key) ? 'open-pr' : null;
    return { ...r, skip };
  });

  const eligible = withSkip.filter((r) => !r.skip);
  eligible.sort(
    (a, b) =>
      a.chapter.localeCompare(b.chapter, 'en', { numeric: true }) ||
      a.sentences - b.sentences,
  );
  const selected = eligible.slice(0, limit);

  const plan = {
    generatedAt: new Date().toISOString(),
    book,
    limit: Number.isFinite(limit) ? limit : null,
    concurrency,
    unreviewedCount: raw.length,
    skippedCount: withSkip.length - eligible.length,
    skipped: withSkip
      .filter((r) => r.skip)
      .map((r) => ({ chapter: r.chapter, reason: r.skip, sentences: r.sentences })),
    launch: selected.map((r) => ({
      book: r.bookId,
      chapter: r.chapter,
      sentences: r.sentences,
    })),
  };

  fs.mkdirSync(path.dirname(PLAN_PATH), { recursive: true });
  fs.writeFileSync(PLAN_PATH, JSON.stringify(plan, null, 2) + '\n');

  console.log(`\nPlan: ${PLAN_PATH}`);
  console.log(`Log: ${LOG}`);
  console.log(`Unreviewed (${book}): ${raw.length}`);
  console.log(`Skipped (open cursor PR on same chapter): ${plan.skippedCount}`);
  console.log(`Launching: ${selected.length} (concurrency ${concurrency})\n`);

  if (selected.length === 0) {
    console.log('Nothing to launch.');
    return;
  }

  for (const r of selected.slice(0, 25)) {
    console.log(`  ${r.bookId}/${r.chapter} (${r.sentences} translated strings)`);
  }
  if (selected.length > 25) {
    console.log(`  …and ${selected.length - 25} more`);
  }

  if (dryRun) {
    console.log('\nDry-run: not starting agents.');
    return;
  }

  fs.writeFileSync(LOG, `=== review batch ${book} ${new Date().toISOString()} ===\n`);
  fs.appendFileSync(
    LOG,
    `Launch ${selected.length} chapters, concurrency ${concurrency}\n`,
  );

  const results = await runPool(selected, concurrency);
  const failed = results.filter((r) => r.code !== 0);
  console.log(`\nFinished: ${results.length - failed.length} ok, ${failed.length} failed`);
  if (failed.length > 0) {
    for (const r of failed.slice(0, 15)) {
      console.log(`  ${r.bookId}/${r.chapter} exit ${r.code}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
