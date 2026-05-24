#!/usr/bin/env node
/**
 * Run prompt.txt translation workflow via @cursor/sdk, one agent per book.
 *
 * Parallelize across books with --concurrency (prefer --runtime cloud when >1).
 *
 * Usage:
 *   # CURSOR_API_KEY in repo-root .env is loaded automatically
 *   node scripts/sdk-translate.mjs --list-books
 *   node scripts/sdk-translate.mjs --book jinshu
 *   node scripts/sdk-translate.mjs --books jinshu,songshu --concurrency 2 --runtime cloud
 *   node scripts/sdk-translate.mjs --all-untranslated --concurrency 4 --runtime cloud --max-runs-per-book 3
 */
import { Agent, CursorAgentError } from '@cursor/sdk';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTranslationPrompt } from './sdk-translation-prompt.mjs';
import { loadDotenv } from './load-dotenv.mjs';
import { listBooksNeedingTranslation, REPO_ROOT } from './sdk-translation-books.mjs';
import { incompleteChaptersOnGitRef, waitForSessionMergedToMaster } from './sdk-merge-wait.mjs';

loadDotenv(REPO_ROOT);

const DEFAULT_MODEL = 'composer-2.5';
const DEFAULT_TRANSLATOR = 'Garrett M. Petersen (2026)';
const DEFAULT_REPO_URL = 'https://github.com/GarrettPetersen/records-of-the-grand-historian';

function usage() {
  console.log(`Usage: node scripts/sdk-translate.mjs [options]

Options:
  --book <id>              Translate a single book (e.g. jinshu)
  --books <a,b,c>          Comma-separated book ids
  --all-untranslated       Books with gray/yellow chapters (missing/partial translation)
  --exclude <a,b,c>        Skip these book ids (e.g. --exclude songshu)
  --include-red            Also treat red chapters as work (quality fixes; off by default)
  --list-books             Print books needing work and exit
  --concurrency <n>        Max parallel agents (default: 1)
  --runtime <local|cloud>  local = this repo checkout; cloud = Cursor VM clone (default: cloud if concurrency>1 else local)
  --repo <url>             GitHub repo for cloud agents (default: ${DEFAULT_REPO_URL})
  --model <id>             Model id (default: ${DEFAULT_MODEL})
  --fast                   Enable Composer 2.5 fast mode (default: off — economy)
  --translator <name>      Passed through in prompt for make submit-translations
  --max-runs-per-book <n>  Agent sessions per book (default: 1)
  --until-complete         Run sessions until book is green (waits for merge between sessions)
  --no-wait-merge          Start next session without waiting for PR merge (not recommended)
  --merge-poll-ms <n>      Poll interval while waiting for merge (default: 90000)
  --merge-timeout-ms <n>   Max wait per session for merge (default: 6h)
  --dry-run                Print plan without calling the API
  --no-stream              Wait without streaming assistant text
  -h, --help               This message

Examples:
  node scripts/sdk-translate.mjs --list-books
  node scripts/sdk-translate.mjs --book weishu --runtime local
  node scripts/sdk-translate.mjs --all-untranslated --concurrency 3 --runtime cloud --max-runs-per-book 5
`);
}

function parseArgs(argv) {
  const opts = {
    books: [],
    exclude: [],
    listBooks: false,
    concurrency: 1,
    runtime: null,
    repoUrl: process.env.SDK_TRANSLATE_REPO ?? DEFAULT_REPO_URL,
    model: process.env.SDK_TRANSLATE_MODEL ?? DEFAULT_MODEL,
    translator: process.env.SDK_TRANSLATE_TRANSLATOR ?? DEFAULT_TRANSLATOR,
    maxRunsPerBook: 1,
    waitForMerge: true,
    mergePollMs: 90_000,
    mergeTimeoutMs: 6 * 60 * 60 * 1000,
    includeRed: false,
    dryRun: false,
    stream: true,
    apiKey: process.env.CURSOR_API_KEY,
    fast: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) throw new Error(`Missing value for ${arg}`);
      return argv[++i];
    };
    switch (arg) {
      case '-h':
      case '--help':
        usage();
        process.exit(0);
        break;
      case '--book':
        opts.books.push(next());
        break;
      case '--books':
        opts.books.push(...next().split(',').map((s) => s.trim()).filter(Boolean));
        break;
      case '--all-untranslated':
        opts.allUntranslated = true;
        break;
      case '--exclude':
        opts.exclude.push(...next().split(',').map((s) => s.trim()).filter(Boolean));
        break;
      case '--include-red':
        opts.includeRed = true;
        break;
      case '--list-books':
        opts.listBooks = true;
        break;
      case '--concurrency':
        opts.concurrency = Math.max(1, Number.parseInt(next(), 10) || 1);
        break;
      case '--runtime':
        opts.runtime = next();
        if (opts.runtime !== 'local' && opts.runtime !== 'cloud') {
          throw new Error('--runtime must be local or cloud');
        }
        break;
      case '--repo':
        opts.repoUrl = next();
        break;
      case '--model':
        opts.model = next();
        break;
      case '--fast':
        opts.fast = true;
        break;
      case '--translator':
        opts.translator = next();
        break;
      case '--max-runs-per-book':
        opts.maxRunsPerBook = Math.max(1, Number.parseInt(next(), 10) || 1);
        break;
      case '--until-complete':
        opts.maxRunsPerBook = 9999;
        opts.waitForMerge = true;
        break;
      case '--no-wait-merge':
        opts.waitForMerge = false;
        break;
      case '--merge-poll-ms':
        opts.mergePollMs = Number.parseInt(next(), 10) || 90_000;
        break;
      case '--merge-timeout-ms':
        opts.mergeTimeoutMs = Number.parseInt(next(), 10) || 6 * 60 * 60 * 1000;
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--no-stream':
        opts.stream = false;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!opts.runtime) {
    opts.runtime = opts.concurrency > 1 ? 'cloud' : 'local';
  }

  return opts;
}

/** @param {ReturnType<typeof parseArgs>} opts */
function buildModelSelection(opts) {
  const selection = { id: opts.model };
  if (opts.model.startsWith('composer-2.5') || opts.model === 'composer-latest') {
    selection.params = [{ id: 'fast', value: opts.fast ? 'true' : 'false' }];
  }
  return selection;
}

function bookStillNeedsWork(bookId, includeRed) {
  try {
    execSync('git fetch origin master', { cwd: REPO_ROOT, stdio: 'pipe' });
  } catch {
    // offline or no remote — fall back to local progress.json
    const books = listBooksNeedingTranslation({ bookFilter: [bookId], includeRed });
    return books.length > 0;
  }
  return incompleteChaptersOnGitRef('origin/master', bookId, { includeRed }).size > 0;
}

async function disposeAgent(agent) {
  if (typeof agent[Symbol.asyncDispose] === 'function') {
    await agent[Symbol.asyncDispose]();
  } else {
    agent.close();
  }
}

/**
 * @param {string} book
 * @param {ReturnType<typeof parseArgs>} opts
 */
async function runOneSession(book, opts) {
  const prompt = buildTranslationPrompt(book, {
    model: opts.model,
    translator: opts.translator,
  });

  const modelSelection = buildModelSelection(opts);

  /** @type {import('@cursor/sdk').AgentOptions} */
  const agentOptions = {
    apiKey: opts.apiKey,
    model: modelSelection,
    local: opts.runtime === 'local' ? { cwd: REPO_ROOT, settingSources: [] } : undefined,
    cloud:
      opts.runtime === 'cloud'
        ? {
            repos: [{ url: opts.repoUrl }],
            skipReviewerRequest: true,
            autoCreatePR: true,
          }
        : undefined,
  };

  if (opts.dryRun) {
    const fastNote =
      modelSelection.params?.find((p) => p.id === 'fast')?.value === 'true' ? 'fast=on' : 'fast=off';
    console.log(
      `[dry-run] ${book}: would start ${opts.runtime} agent, model=${opts.model} (${fastNote}), prompt ${prompt.length} chars`,
    );
    return { book, status: 'dry-run' };
  }

  const agent = await Agent.create(agentOptions);
  try {
    console.log(`[${book}] agent ${agent.agentId} — sending translation prompt…`);
    const run = await agent.send(prompt);
    console.log(`[${book}] run ${run.id}`);

    if (opts.stream) {
      for await (const event of run.stream()) {
        if (event.type === 'assistant') {
          for (const block of event.message.content) {
            if (block.type === 'text') process.stdout.write(block.text);
          }
        }
      }
    }

    const result = await run.wait();
    console.log(`\n[${book}] finished run ${result.id} status=${result.status}`);
    return {
      book,
      status: result.status,
      agentId: agent.agentId,
      runId: result.id,
      git: result.git,
    };
  } finally {
    await disposeAgent(agent);
  }
}

/**
 * @param {string} book
 * @param {ReturnType<typeof parseArgs>} opts
 */
async function runBookLoop(book, opts) {
  const results = [];
  let run = 0;
  execSync('git fetch origin master', { cwd: REPO_ROOT, stdio: 'pipe' });

  while (bookStillNeedsWork(book, opts.includeRed)) {
    run += 1;
    if (run > opts.maxRunsPerBook) {
      console.log(`[${book}] stopping: reached --max-runs-per-book ${opts.maxRunsPerBook}`);
      break;
    }
    console.log(`[${book}] session ${run}${Number.isFinite(opts.maxRunsPerBook) ? `/${opts.maxRunsPerBook}` : ''}`);

    const baselineIncomplete = incompleteChaptersOnGitRef('origin/master', book, {
      includeRed: opts.includeRed,
    });

    try {
      const result = await runOneSession(book, opts);
      results.push(result);
      if (result.status === 'error') {
        console.error(`[${book}] run ended with error; stopping book loop`);
        break;
      }
      if (result.status !== 'finished' && result.status !== 'dry-run') {
        console.error(`[${book}] run status=${result.status}; stopping book loop`);
        break;
      }

      const moreWork = bookStillNeedsWork(book, opts.includeRed);
      const hasAnotherSession = run < opts.maxRunsPerBook && moreWork;

      if (hasAnotherSession && opts.waitForMerge && !opts.dryRun) {
        await waitForSessionMergedToMaster(book, result, baselineIncomplete, {
          repoUrl: opts.repoUrl,
          includeRed: opts.includeRed,
          pollMs: opts.mergePollMs,
          timeoutMs: opts.mergeTimeoutMs,
          githubToken: process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN,
        });
      } else if (hasAnotherSession && !opts.waitForMerge) {
        console.warn(`[${book}] --no-wait-merge: next session may re-translate the same chapter`);
      }
    } catch (err) {
      if (err instanceof CursorAgentError) {
        console.error(`[${book}] startup failed: ${err.message} retryable=${err.isRetryable}`);
        results.push({ book, status: 'startup_error', message: err.message });
        break;
      }
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[${book}] session loop failed: ${message}`);
      results.push({ book, status: 'loop_error', message });
      break;
    }
    if (opts.dryRun) break;
  }
  return results;
}

async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      results[i] = await fn(items[i], i);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.listBooks) {
    const books = listBooksNeedingTranslation({ includeRed: opts.includeRed });
    for (const b of books) {
      console.log(
        `${b.id}\twork=${b.needsTranslation}\tgray=${b.gray}\tyellow=${b.yellow}\tred=${b.red}\tgreen=${b.green}\t${b.name}`,
      );
    }
    const scope = opts.includeRed ? 'gray/yellow/red' : 'gray/yellow only (red = flagged quality, excluded)';
    console.log(`\n${books.length} book(s) with ${scope}.`);
    return;
  }

  let books = [...new Set(opts.books)];
  if (opts.allUntranslated) {
    books = listBooksNeedingTranslation({ includeRed: opts.includeRed }).map((b) => b.id);
  }

  if (books.length === 0) {
    console.error('No books selected. Use --book, --books, or --all-untranslated (or --list-books).');
    usage();
    process.exit(1);
  }

  if (!opts.dryRun && !opts.apiKey) {
    console.error('CURSOR_API_KEY is required (or pass apiKey in code). Get a key from Cursor → Integrations.');
    process.exit(1);
  }

  const needing = new Set(
    listBooksNeedingTranslation({ includeRed: opts.includeRed }).map((b) => b.id),
  );
  const skipped = books.filter((b) => !needing.has(b));
  books = books.filter((b) => needing.has(b));
  for (const b of skipped) {
    console.log(`[${b}] no gray/yellow${opts.includeRed ? '/red' : ''} chapters in progress.json — skipping`);
  }

  if (opts.exclude.length > 0) {
    const excluded = new Set(opts.exclude);
    for (const b of books.filter((id) => excluded.has(id))) {
      console.log(`[${b}] excluded by --exclude`);
    }
    books = books.filter((id) => !excluded.has(id));
  }

  if (books.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  console.log(`Books: ${books.join(', ')}`);
  const fastNote = opts.fast ? 'fast=on' : 'fast=off';
  console.log(
    `Runtime: ${opts.runtime}  Concurrency: ${opts.concurrency}  Model: ${opts.model} (${fastNote})`,
  );
  if (opts.runtime === 'cloud') {
    console.log(`Repo: ${opts.repoUrl}`);
  } else if (opts.concurrency > 1) {
    console.warn('Warning: multiple local agents share one working tree; git conflicts are likely. Prefer --runtime cloud for parallel books.');
  }

  const allResults = await mapPool(books, opts.concurrency, (book) => runBookLoop(book, opts));

  const failed = allResults.flat().filter(
    (r) =>
      r?.status === 'error' ||
      r?.status === 'startup_error' ||
      r?.status === 'loop_error',
  );
  if (failed.length > 0) {
    process.exit(failed.some((r) => r.status === 'startup_error') ? 1 : 2);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
