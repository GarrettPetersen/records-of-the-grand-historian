#!/usr/bin/env node
/**
 * Launch cloud SDK agents for the N shortest gray/yellow chapters on origin/master,
 * skipping anything in-flight (open PRs, staging, local claims).
 *
 *   node scripts/run-shortest-untranslated-batch.mjs --dry-run
 *   node scripts/run-shortest-untranslated-batch.mjs --limit 100
 *   SDK_CHAPTER_BATCH_CONCURRENCY=25 node scripts/run-shortest-untranslated-batch.mjs
 *   node scripts/run-shortest-untranslated-batch.mjs --skip-log /tmp/sdk-full-batch.log
 *   node scripts/run-shortest-untranslated-batch.mjs --skip-json data/batch-started-chapters.json
 *   SDK_CHAPTER_BATCH_CONCURRENCY=25 SDK_BATCH_START_DELAY_MS=2000 node scripts/...
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Agent } from '@cursor/sdk';
import { countChapterMetrics } from '../chapter-counts.mjs';
import { loadDotenv } from './load-dotenv.mjs';
import { normalizeChapterId } from './normalize-chapter-id.mjs';
import { incompleteChaptersOnGitRefAsync } from './sdk-merge-wait.mjs';
import { REPO_ROOT } from './sdk-translation-books.mjs';
import { parseBatchStartLog } from './extract-batch-starts.mjs';
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
  /** @type {string[]} */
  const skipLogs = [];
  /** @type {string[]} */
  const skipJsons = [];
  let skipActiveAgentHours = 0;
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === '--limit' && process.argv[i + 1]) {
      limit = Number.parseInt(process.argv[++i], 10) || 100;
    }
    if (process.argv[i] === '--skip-log' && process.argv[i + 1]) {
      skipLogs.push(process.argv[++i]);
    }
    if (process.argv[i] === '--skip-json' && process.argv[i + 1]) {
      skipJsons.push(process.argv[++i]);
    }
    if (process.argv[i] === '--skip-active-agents-hours' && process.argv[i + 1]) {
      skipActiveAgentHours = Number.parseFloat(process.argv[++i]) || 0;
    }
  }
  const concurrency = Number.parseInt(process.env.SDK_CHAPTER_BATCH_CONCURRENCY ?? '100', 10) || 100;
  const startDelayMs = Number.parseInt(process.env.SDK_BATCH_START_DELAY_MS ?? '0', 10) || 0;
  return { dryRun, limit, concurrency, skipLogs, skipJsons, skipActiveAgentHours, startDelayMs };
}

/**
 * @param {string[]} skipLogPaths
 */
function loadStartedKeysFromLogs(skipLogPaths) {
  const keys = new Set();
  for (const logPath of skipLogPaths) {
    const { chapters } = parseBatchStartLog(path.resolve(ROOT, logPath));
    for (const { book, chapter } of chapters) {
      keys.add(chapterKey(book, chapter));
    }
  }
  return keys;
}

/**
 * @param {string[]} skipJsonPaths
 */
function loadStartedKeysFromJson(skipJsonPaths) {
  const keys = new Set();
  for (const jsonPath of skipJsonPaths) {
    const abs = path.resolve(ROOT, jsonPath);
    const { chapters } = JSON.parse(fs.readFileSync(abs, 'utf8'));
    for (const { book, chapter } of chapters) {
      keys.add(chapterKey(book, chapter));
    }
  }
  return keys;
}

/** @param {string} name */
function chapterKeyFromAgentName(name) {
  const n = (name || '').toLowerCase();
  const m = n.match(/\b([a-z]+)\s+(?:chapter\s+)?(\d{1,4})\b/);
  if (!m) return null;
  return chapterKey(m[1], m[2]);
}

/**
 * Skip chapters that already have a cloud agent created recently (name → book/chapter).
 *
 * @param {number} hours
 * @param {string} [apiKey]
 */
async function loadActiveAgentKeys(hours, apiKey) {
  const keys = new Set();
  if (hours <= 0 || !apiKey) return keys;
  const since = Date.now() - hours * 60 * 60 * 1000;
  const repoSlug = 'records-of-the-grand-historian';
  let cursor;
  let pages = 0;
  do {
    const res = await Agent.list({ runtime: 'cloud', apiKey, limit: 100, cursor });
    pages++;
    let allOlder = true;
    for (const a of res.items) {
      const ts = a.createdAt ?? 0;
      if (ts < since) continue;
      allOlder = false;
      if (!(a.repos || []).some((r) => r.includes(repoSlug))) continue;
      const key = chapterKeyFromAgentName(a.name);
      if (key) keys.add(key);
    }
    if (allOlder && res.items.length > 0) break;
    cursor = res.nextCursor;
    if (!cursor || pages > 100) break;
  } while (cursor);
  return keys;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
/**
 * @param {Set<string>} [startedKeys]
 * @param {Set<string>} [activeAgentKeys]
 */
async function collectCandidates(startedKeys = new Set(), activeAgentKeys = new Set()) {
  const registry = await buildInflightRegistry({ fetchGit: true });
  const books = listBooksOnRef(MASTER_REF);

  /** @type {Array<{ book: string, chapter: string, status: string, sentences: number, skip?: string }>} */
  const raw = [];

  for (const book of books) {
    const incomplete = await incompleteChaptersOnGitRefAsync(MASTER_REF, book);
    for (const chapter of incomplete) {
      const ch = normalizeChapterId(chapter);
      const sentences = sentenceCountOnRef(MASTER_REF, book, ch);
      const key = chapterKey(book, ch);
      let skip = null;
      if (startedKeys.has(key)) {
        skip = 'batch-log';
      } else if (activeAgentKeys.has(key)) {
        skip = 'active-agent';
      } else if (isChapterInflight(book, ch, registry)) {
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
 * @param {number} startDelayMs
 */
async function runPool(items, concurrency, startDelayMs = 0) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      if (startDelayMs > 0) await sleep(startDelayMs);
      results[i] = await runOne(items[i]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

async function main() {
  const { dryRun, limit, concurrency, skipLogs, skipJsons, skipActiveAgentHours, startDelayMs } =
    parseArgs();

  if (!dryRun && !process.env.CURSOR_API_KEY) {
    console.error('CURSOR_API_KEY is required (set in .env or environment).');
    process.exit(1);
  }

  console.log('Fetching origin/master…');
  fetchMaster();

  const startedKeys = new Set([
    ...(skipLogs.length > 0 ? loadStartedKeysFromLogs(skipLogs) : []),
    ...(skipJsons.length > 0 ? loadStartedKeysFromJson(skipJsons) : []),
  ]);
  if (startedKeys.size > 0) {
    console.log(`Skipping ${startedKeys.size} chapter(s) from batch log/json.`);
  }

  const activeAgentKeys = await loadActiveAgentKeys(
    skipActiveAgentHours,
    process.env.CURSOR_API_KEY,
  );
  if (activeAgentKeys.size > 0) {
    console.log(
      `Skipping ${activeAgentKeys.size} chapter(s) with cloud agents in the last ${skipActiveAgentHours}h.`,
    );
  }

  const raw = await collectCandidates(startedKeys, activeAgentKeys);
  const skipped = raw.filter((r) => r.skip);
  const selected = selectShortest(raw, limit);

  const plan = {
    generatedAt: new Date().toISOString(),
    masterRef: MASTER_REF,
    limit,
    concurrency,
    skipLogs,
    skipJsons,
    skipActiveAgentHours,
    startDelayMs,
    batchLogSkipped: startedKeys.size,
    activeAgentSkipped: activeAgentKeys.size,
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
  const byReason = skipped.reduce((acc, r) => {
    const k = r.skip ?? 'unknown';
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, /** @type {Record<string, number>} */ ({}));
  console.log(`Skipped: ${skipped.length} (${Object.entries(byReason).map(([k, n]) => `${k}=${n}`).join(', ')})`);
  console.log(
    `Launching: ${selected.length} (concurrency ${concurrency}${startDelayMs ? `, ${startDelayMs}ms between starts` : ''})\n`,
  );

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

  const results = await runPool(selected, concurrency, startDelayMs);
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
