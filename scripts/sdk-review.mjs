#!/usr/bin/env node
/**
 * Run editorial review on the next translated-but-unreviewed chapter via @cursor/sdk.
 *
 * Usage:
 *   node scripts/sdk-review.mjs
 *   node scripts/sdk-review.mjs --book songshi
 *   node scripts/sdk-review.mjs --book songshi --runtime cloud --no-stream
 *   node scripts/sdk-review.mjs --until-complete --book liaoshi
 */
import { Agent, CursorAgentError } from '@cursor/sdk';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDotenv } from './load-dotenv.mjs';
import { buildReviewPrompt } from './sdk-review-prompt.mjs';
import {
  countUnreviewedChapters,
  findNextReviewChapter,
  loadManifest,
  REPO_ROOT,
  reviewFilePath,
  writeReviewExtract,
} from './review-queue.mjs';
import { cloudAgentUrl, printRunFailureDiagnostics } from './sdk-inspect-shared.mjs';

loadDotenv(REPO_ROOT);

const DEFAULT_MODEL = 'composer-2.5';
const DEFAULT_REPO_URL = 'https://github.com/GarrettPetersen/records-of-the-grand-historian';

function usage() {
  console.log(`Usage: node scripts/sdk-review.mjs [options]

Options:
  --book <id>              Limit queue to one book (optional)
  --chapter <id>           Review this chapter only (requires --book)
  --list-queue             Show unreviewed chapter count and exit
  --runtime <local|cloud>  Default: cloud if unset and CURSOR_API_KEY set, else local
  --direct-to-master       Local only: push to origin/master (no PR)
  --repo <url>             GitHub repo for cloud agents
  --model <id>             Default: ${DEFAULT_MODEL}
  --until-complete         Run sessions until no unreviewed chapters remain (optional book scope)
  --dry-run                Print next chapter and paths without calling the API
  --no-stream              Do not stream assistant text
  --no-apply               Skip make apply-review / update after agent (cloud: agent must run make)
  -h, --help               This message

Examples:
  node scripts/sdk-review.mjs --list-queue
  node scripts/sdk-review.mjs --book nanqishu --runtime cloud --no-stream
  node scripts/sdk-review-cloud.mjs --until-complete
`);
}

function parseArgs(argv) {
  const opts = {
    book: null,
    chapter: null,
    listQueue: false,
    runtime: null,
    repoUrl: process.env.SDK_TRANSLATE_REPO ?? DEFAULT_REPO_URL,
    model: process.env.SDK_TRANSLATE_MODEL ?? DEFAULT_MODEL,
    untilComplete: false,
    dryRun: false,
    stream: true,
    apiKey: process.env.CURSOR_API_KEY,
    fast: false,
    directToMaster: false,
    noApply: false,
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
        opts.book = next();
        break;
      case '--chapter':
        opts.chapter = next();
        break;
      case '--list-queue':
        opts.listQueue = true;
        break;
      case '--runtime':
        opts.runtime = next();
        if (opts.runtime !== 'local' && opts.runtime !== 'cloud') {
          throw new Error('--runtime must be local or cloud');
        }
        break;
      case '--direct-to-master':
        opts.directToMaster = true;
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
      case '--until-complete':
        opts.untilComplete = true;
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--no-stream':
        opts.stream = false;
        break;
      case '--no-apply':
        opts.noApply = true;
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (!opts.runtime) {
    opts.runtime = opts.apiKey ? 'cloud' : 'local';
  }
  if (opts.directToMaster && opts.runtime !== 'local') {
    throw new Error('--direct-to-master requires --runtime local');
  }

  return opts;
}

function buildModelSelection(opts) {
  const params = [{ id: 'fast', value: opts.fast ? 'true' : 'false' }];
  return { id: opts.model, params };
}

/**
 * @param {{ bookId: string, chapter: string, filePath: string }} target
 */
function relPaths(target) {
  const chapterFile = path.relative(REPO_ROOT, target.filePath);
  const reviewFile = path.relative(REPO_ROOT, reviewFilePath(target));
  return { chapterFile, reviewFile };
}

/**
 * @param {{ bookId: string, chapter: string, filePath: string }} target
 * @param {string} reviewFileAbs
 * @param {ReturnType<typeof parseArgs>} opts
 */
function finalizeReviewLocally(target, reviewFileAbs, opts) {
  const chapterRel = path.relative(REPO_ROOT, target.filePath);
  console.log(`[${target.bookId}] applying review and rebuilding site…`);
  execSync('node check-no-autotranslate.js', { cwd: REPO_ROOT, stdio: 'inherit' });
  execSync(`node apply-reviewed-translations.js "${chapterRel}" "${path.relative(REPO_ROOT, reviewFileAbs)}"`, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });
  execSync(`make update BOOK=${target.bookId}`, { cwd: REPO_ROOT, stdio: 'inherit' });
  console.log(`[${target.bookId}] chapter ${target.chapter} reviewed and site updated`);
}

/**
 * @param {{ bookId: string, chapter: string, filePath: string }} target
 * @param {ReturnType<typeof parseArgs>} opts
 */
async function runOneReviewSession(target, opts) {
  const { chapterFile, reviewFile } = relPaths(target);
  const reviewFileAbs = path.join(REPO_ROOT, reviewFile);

  let reviewFileReady = false;
  if (!opts.dryRun && opts.runtime === 'local') {
    const { reviewData } = writeReviewExtract(target.filePath, target);
    reviewFileReady = true;
    console.log(
      `[${target.bookId}] extracted ${reviewData.translations.length} strings → ${reviewFile}`,
    );
  }

  const prompt = buildReviewPrompt({
    bookId: target.bookId,
    chapter: target.chapter,
    chapterFile,
    reviewFile,
    model: opts.model,
    directToMaster: opts.directToMaster,
    reviewFileReady,
  });

  if (opts.dryRun) {
    console.log(`[dry-run] ${target.bookId}/${target.chapter}`);
    console.log(`  chapter: ${chapterFile}`);
    console.log(`  review:  ${reviewFile}`);
    console.log(`  prompt length: ${prompt.length} chars`);
    return { status: 'dry-run' };
  }

  const modelSelection = buildModelSelection(opts);
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

  /** @type {import('@cursor/sdk').SDKAgent | undefined} */
  let agent;
  try {
    agent = await Agent.create(agentOptions);
    const url = cloudAgentUrl(agent.agentId);
    console.log(
      `[${target.bookId}] agent ${agent.agentId} — editorial review prompt…${url ? ` (${url})` : ''}`,
    );
    const run = await agent.send(prompt);
    console.log(`[${target.bookId}] run ${run.id}`);

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
    console.log(`\n[${target.bookId}] finished run ${result.id} status=${result.status}`);

    if (result.status === 'error' || result.status === 'cancelled') {
      await printRunFailureDiagnostics({
        book: target.bookId,
        agentId: agent.agentId,
        runId: result.id,
        result,
        run,
        runtime: opts.runtime,
        cwd: REPO_ROOT,
        apiKey: opts.apiKey,
      });
    }

    if (
      !opts.noApply &&
      opts.runtime === 'local' &&
      (result.status === 'finished' || result.status === 'error')
    ) {
      if (!fs.existsSync(reviewFileAbs)) {
        console.error(`[${target.bookId}] review file missing: ${reviewFile} — skip apply`);
      } else {
        try {
          finalizeReviewLocally(target, reviewFileAbs, opts);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error(`[${target.bookId}] finalize failed: ${msg}`);
          return { status: 'finalize_error', message: msg };
        }
      }
    } else if (opts.runtime === 'cloud' && result.status === 'finished') {
      console.log(
        `[${target.bookId}] cloud session finished — agent should have run make apply-review and opened a PR`,
      );
    }

    return { status: result.status, bookId: target.bookId, chapter: target.chapter };
  } catch (err) {
    if (err instanceof CursorAgentError) {
      console.error(`[${target.bookId}] startup failed: ${err.message} retryable=${err.isRetryable}`);
      if (agent) {
        const url = cloudAgentUrl(agent.agentId);
        if (url) console.error(`[${target.bookId}] open: ${url}`);
      }
    }
    throw err;
  } finally {
    if (agent) {
      if (typeof agent[Symbol.asyncDispose] === 'function') {
        await agent[Symbol.asyncDispose]();
      } else {
        agent.close();
      }
    }
  }
}

/**
 * @param {ReturnType<typeof parseArgs>} opts
 */
function resolveTarget(manifest, opts) {
  if (opts.chapter) {
    if (!opts.book) throw new Error('--chapter requires --book');
    const filePath = path.join(REPO_ROOT, 'data', opts.book, `${opts.chapter}.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Chapter file not found: ${filePath}`);
    }
    return { bookId: opts.book, chapter: opts.chapter, filePath };
  }
  return findNextReviewChapter(manifest, opts.book);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const manifest = loadManifest();

  if (opts.listQueue) {
    const n = countUnreviewedChapters(manifest, opts.book);
    const scope = opts.book ?? 'all books';
    console.log(`${n} translated chapter(s) awaiting editorial review (${scope})`);
    const next = findNextReviewChapter(manifest, opts.book);
    if (next) {
      console.log(`Next: ${next.bookId}/${next.chapter} (${path.relative(REPO_ROOT, next.filePath)})`);
    }
    return;
  }

  if (!opts.dryRun && !opts.apiKey) {
    console.error('CURSOR_API_KEY is required. Get a key from Cursor → Integrations.');
    process.exit(1);
  }

  let sessions = 0;
  while (true) {
    const target = resolveTarget(manifest, opts);
    if (!target) {
      const scope = opts.book ? `in ${opts.book}` : '';
      console.log(`No unreviewed translated chapters ${scope}`.trim());
      break;
    }

    sessions += 1;
    console.log(`\n--- Review session ${sessions}: ${target.bookId}/${target.chapter} ---`);

    try {
      const result = await runOneReviewSession(target, opts);
      if (result.status === 'error' || result.status === 'finalize_error') {
        process.exit(2);
      }
    } catch (err) {
      if (err instanceof CursorAgentError) {
        process.exit(1);
      }
      throw err;
    }

    if (!opts.untilComplete) break;
    if (opts.chapter) break;

    // Reload manifest so reviewed=true is visible for next iteration
    Object.assign(manifest, loadManifest());
  }

  if (sessions === 0) process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
