#!/usr/bin/env node
/**
 * Launch cloud translation agents from plan launch[] — one Node process only.
 * Creates each remote agent via @cursor/sdk, sends the prompt, logs bc- id + run id,
 * disposes the local SDK handle (does NOT wait for translation to finish).
 *
 *   node scripts/launch-tail-cloud-only.mjs
 *   node scripts/launch-tail-cloud-only.mjs --dry-run
 *   SDK_TAIL_LAUNCH_CONCURRENCY=5 node scripts/launch-tail-cloud-only.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Agent, CursorAgentError } from '@cursor/sdk';
import { loadDotenv } from './load-dotenv.mjs';
import { buildTranslationPrompt } from './sdk-translation-prompt.mjs';
import { cloudAgentUrl } from './sdk-inspect-shared.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadDotenv(ROOT);

const PLAN = path.join(ROOT, 'data', 'shortest-untranslated-batch-plan.json');
const LOG = process.env.SDK_TAIL_LAUNCH_LOG || path.join(ROOT, 'data', 'batch-tail-cloud-launches.log');
const DEFAULT_REPO = 'https://github.com/GarrettPetersen/records-of-the-grand-historian';
const MODEL = process.env.SDK_TRANSLATE_MODEL ?? 'composer-2.5';
const TRANSLATOR = process.env.SDK_TRANSLATOR ?? 'Garrett M. Petersen (2026)';

function parseArgs() {
  const dryRun = process.argv.includes('--dry-run');
  let limit = Infinity;
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--limit' && process.argv[i + 1]) {
      limit = Number.parseInt(process.argv[++i], 10) || limit;
    }
  }
  const concurrency = Number.parseInt(process.env.SDK_TAIL_LAUNCH_CONCURRENCY ?? '1', 10) || 1;
  const delayMs = Number.parseInt(process.env.SDK_TAIL_LAUNCH_DELAY_MS ?? '700', 10) || 0;
  return { dryRun, limit, concurrency, delayMs };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function disposeAgent(agent) {
  if (typeof agent[Symbol.asyncDispose] === 'function') {
    await agent[Symbol.asyncDispose]();
  } else {
    agent.close();
  }
}

function buildModelSelection() {
  const selection = { id: MODEL };
  if (MODEL.startsWith('composer-2.5') || MODEL === 'composer-latest') {
    selection.params = [{ id: 'fast', value: 'false' }];
  }
  return selection;
}

/**
 * @param {string} book
 * @param {string} chapter
 * @param {string} apiKey
 */
async function launchChapterCloud(book, chapter, apiKey) {
  const prompt = buildTranslationPrompt(book, {
    model: MODEL,
    translator: TRANSLATOR,
    chapter,
  });

  /** @type {import('@cursor/sdk').SDKAgent | undefined} */
  let agent;
  try {
    agent = await Agent.create({
      apiKey,
      model: buildModelSelection(),
      cloud: {
        repos: [{ url: process.env.SDK_TRANSLATE_REPO ?? DEFAULT_REPO }],
        skipReviewerRequest: true,
        autoCreatePR: true,
      },
    });

    const run = await agent.send(prompt);
    const agentId = agent.agentId;
    const runId = run.id;
    const url = cloudAgentUrl(agentId);
    const line = `OK\t${book}/${chapter}\t${agentId}\t${runId}\t${url ?? ''}\t${new Date().toISOString()}\n`;
    fs.appendFileSync(LOG, line);
    console.log(`OK ${book}/${chapter} ${agentId} ${runId}`);
    return { ok: true, agentId, runId };
  } catch (err) {
    const msg = err instanceof CursorAgentError ? err.message : String(err);
    fs.appendFileSync(LOG, `FAIL\t${book}/${chapter}\t${msg}\t${new Date().toISOString()}\n`);
    console.error(`FAIL ${book}/${chapter}: ${msg}`);
    return { ok: false, error: msg };
  } finally {
    if (agent) await disposeAgent(agent);
  }
}

/**
 * @param {Array<{ book: string, chapter: string }>} items
 * @param {number} concurrency
 * @param {string} apiKey
 */
async function runPool(items, concurrency, apiKey, delayMs) {
  let index = 0;
  let ok = 0;
  let fail = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      const item = items[i];
      let result = { ok: false, error: '' };
      for (let attempt = 0; attempt < 8; attempt++) {
        result = await launchChapterCloud(item.book, item.chapter, apiKey);
        if (result.ok) break;
        if (!/rate limit/i.test(result.error ?? '')) break;
        const wait = 65_000;
        console.error(`rate limit on ${item.book}/${item.chapter}, waiting ${wait / 1000}s…`);
        await sleep(wait);
      }
      if (result.ok) ok++;
      else fail++;
      if (delayMs > 0) await sleep(delayMs);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return { ok, fail };
}

async function main() {
  const { dryRun, limit, concurrency, delayMs } = parseArgs();
  const apiKey = process.env.CURSOR_API_KEY;
  if (!dryRun && !apiKey) {
    console.error('CURSOR_API_KEY required');
    process.exit(1);
  }

  if (!fs.existsSync(PLAN)) {
    console.error(`Missing plan: ${PLAN}`);
    process.exit(1);
  }

  const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8'));
  let launch = plan.launch ?? [];
  if (limit < launch.length) launch = launch.slice(0, limit);

  const already = new Set();
  if (fs.existsSync(LOG)) {
    for (const line of fs.readFileSync(LOG, 'utf8').split('\n')) {
      const m = line.match(/^OK\t([^/\t]+)\/([^\t]+)\t(bc-[^\t]+)/);
      if (m) already.add(`${m[1]}/${m[2]}`);
    }
  }
  const pending = launch.filter(({ book, chapter }) => !already.has(`${book}/${chapter}`));
  if (already.size > 0) {
    console.log(`Skipping ${already.size} already logged OK; pending ${pending.length}`);
  }
  launch = pending;

  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  if (!dryRun) {
    fs.appendFileSync(
      LOG,
      `\n=== cloud-only launch ${new Date().toISOString()} count=${launch.length} concurrency=${concurrency} ===\n`,
    );
  }

  console.log(`Chapters: ${launch.length}  concurrency: ${concurrency}  log: ${LOG}`);

  if (dryRun) {
    for (const { book, chapter } of launch.slice(0, 5)) {
      console.log(`  would launch ${book}/${chapter}`);
    }
    if (launch.length > 5) console.log(`  …and ${launch.length - 5} more`);
    return;
  }

  const { ok, fail } = await runPool(launch, concurrency, apiKey, delayMs);
  console.log(`\nDone: ${ok} ok, ${fail} failed (remote agents keep running)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
