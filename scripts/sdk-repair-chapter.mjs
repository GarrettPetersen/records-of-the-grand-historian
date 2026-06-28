#!/usr/bin/env node
/**
 * Run local Cursor SDK agents to repair source/placeholder/quote issues by chapter.
 *
 * Examples:
 *   node scripts/sdk-repair-chapter.mjs --list-queue
 *   node scripts/sdk-repair-chapter.mjs --book hanshu --chapter 007 --dry-run
 *   node scripts/sdk-repair-chapter.mjs --limit 20 --concurrency 4 --no-stream
 *   node scripts/sdk-repair-chapter.mjs --until-complete --concurrency 4 --no-stream
 */
import { Agent, CursorAgentError } from '@cursor/sdk';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { loadDotenv } from './load-dotenv.mjs';
import { normalizeChapterId } from './normalize-chapter-id.mjs';
import { buildRepairPrompt, REPO_ROOT } from './sdk-repair-prompt.mjs';

loadDotenv(REPO_ROOT);

const QUALITY_DIR = path.join(REPO_ROOT, 'data', 'quality');
const DEFAULT_MODEL = 'composer-2.5';
const DEFAULT_CONCURRENCY = Number.parseInt(process.env.SDK_REPAIR_CONCURRENCY ?? '2', 10) || 2;
const DEFAULT_RUNTIME_RETRIES = Number.parseInt(process.env.SDK_REPAIR_RUNTIME_RETRIES ?? '5', 10) || 5;
const DEFAULT_LAUNCH_INTERVAL_MS = Number.parseInt(process.env.SDK_REPAIR_LAUNCH_INTERVAL_MS ?? '15000', 10) || 0;
const DEFAULT_LOG = process.env.SDK_REPAIR_LOG || '/tmp/sdk-repair-chapter.log';
const PLAN_PATH = path.join(REPO_ROOT, 'data', 'repair-chapter-batch-plan.json');
const CLAIM_DIR = path.join(REPO_ROOT, 'data', 'repair-chapter-claims');
const SOURCE_QUEUE_RE = /^source-correspondence-corpus-wikisource-(.+)\.json$/u;
const CHAPTER_FILE_RE = /^data\/([^/]+)\/(\d{3})\.json$/u;
const PROCESS_RUN_ID = `${process.pid}-${Date.now()}`;

let drainRequested = false;
let localSdkMutex = Promise.resolve();
let lastLocalAgentStartAt = 0;

function withLocalSdkMutex(fn) {
  const run = localSdkMutex.then(fn, fn);
  localSdkMutex = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function createLocalAgent(agentOptions, opts) {
  return withLocalSdkMutex(async () => {
    if (lastLocalAgentStartAt > 0 && opts.launchIntervalMs > 0) {
      const waitMs = opts.launchIntervalMs - (Date.now() - lastLocalAgentStartAt);
      if (waitMs > 0) await sleep(waitMs);
    }
    const agent = await Agent.create(agentOptions);
    lastLocalAgentStartAt = Date.now();
    return agent;
  });
}

process.on('SIGINT', () => {
  if (!drainRequested) {
    drainRequested = true;
    console.log('\n[repair] drain requested — active agents will finish; no new chapters will start');
  } else {
    process.exit(130);
  }
});

function usage() {
  console.log(`Usage: node scripts/sdk-repair-chapter.mjs [options]

Options:
  --book <id>                Limit to one book
  --chapter <id>             Repair exactly one chapter (requires --book)
  --list-queue               Print combined repair queue and exit
  --limit <n>                Max chapters to launch in this process
  --concurrency <n>          Local agents to run at once (default: ${DEFAULT_CONCURRENCY})
  --until-complete           Keep selecting new chapters until the queue is empty or drained
  --model <id>               SDK model id (default: ${DEFAULT_MODEL})
  --fast                     Enable Composer fast mode (default off)
  --dry-run                  Print the plan and prompt size without calling the SDK
  --no-stream                Wait without streaming assistant text
  --order <shortest|largest|chronological>
                             Chapter selection order (default: shortest)
  --verify-retries <n>       Same-agent follow-up attempts after verification failure (default: 2)
  --runtime-retries <n>      Fresh-agent retries for SDK runtime failures (default: ${DEFAULT_RUNTIME_RETRIES})
  --launch-interval-ms <n>   Minimum delay between starting new agents (default: ${DEFAULT_LAUNCH_INTERVAL_MS})
  --refresh-reports          After the batch, refresh placeholder and quote reports
  -h, --help                 This message

The runner always uses local SDK runtime with cwd=${REPO_ROOT}.
It does not set max-mode parameters.`);
}

function parseArgs(argv) {
  const opts = {
    book: null,
    chapter: null,
    listQueue: false,
    limit: Infinity,
    concurrency: DEFAULT_CONCURRENCY,
    untilComplete: false,
    model: process.env.SDK_REPAIR_MODEL || DEFAULT_MODEL,
    fast: false,
    dryRun: false,
    stream: true,
    apiKey: process.env.CURSOR_API_KEY,
    order: 'shortest',
    verifyRetries: Number.parseInt(process.env.SDK_REPAIR_VERIFY_RETRIES ?? '2', 10),
    runtimeRetries: DEFAULT_RUNTIME_RETRIES,
    launchIntervalMs: DEFAULT_LAUNCH_INTERVAL_MS,
    refreshReports: false,
    log: DEFAULT_LOG,
  };

  const next = (argvRef, i, arg) => {
    if (i + 1 >= argvRef.length) throw new Error(`Missing value for ${arg}`);
    return argvRef[i + 1];
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '-h':
      case '--help':
        usage();
        process.exit(0);
        break;
      case '--book':
        opts.book = next(argv, i, arg);
        i += 1;
        break;
      case '--chapter':
        opts.chapter = normalizeChapterId(next(argv, i, arg));
        i += 1;
        break;
      case '--list-queue':
        opts.listQueue = true;
        break;
      case '--limit':
        opts.limit = Number.parseInt(next(argv, i, arg), 10);
        i += 1;
        break;
      case '--concurrency':
        opts.concurrency = Math.max(1, Number.parseInt(next(argv, i, arg), 10) || 1);
        i += 1;
        break;
      case '--until-complete':
        opts.untilComplete = true;
        break;
      case '--model':
        opts.model = next(argv, i, arg);
        i += 1;
        break;
      case '--fast':
        opts.fast = true;
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--no-stream':
        opts.stream = false;
        break;
      case '--order':
        opts.order = next(argv, i, arg);
        if (!['shortest', 'largest', 'chronological'].includes(opts.order)) {
          throw new Error('--order must be shortest, largest, or chronological');
        }
        i += 1;
        break;
      case '--verify-retries':
        opts.verifyRetries = Math.max(0, Number.parseInt(next(argv, i, arg), 10) || 0);
        i += 1;
        break;
      case '--runtime-retries':
        opts.runtimeRetries = Math.max(0, Number.parseInt(next(argv, i, arg), 10) || 0);
        i += 1;
        break;
      case '--launch-interval-ms':
        opts.launchIntervalMs = Math.max(0, Number.parseInt(next(argv, i, arg), 10) || 0);
        i += 1;
        break;
      case '--refresh-reports':
        opts.refreshReports = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (opts.chapter && !opts.book) throw new Error('--chapter requires --book');
  if (!Number.isFinite(opts.limit) || opts.limit < 1) opts.limit = Infinity;
  if (!Number.isFinite(opts.verifyRetries) || opts.verifyRetries < 0) opts.verifyRetries = 2;
  if (!opts.dryRun && !opts.apiKey) {
    throw new Error('CURSOR_API_KEY is required. Set it in .env or the environment.');
  }
  return opts;
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (status === 'applied' || decision === 'included' || decision === 'approved') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
}

function chapterKey(book, chapter) {
  return `${book}/${chapter}`;
}

function chapterFile(book, chapter) {
  return path.join('data', book, `${chapter}.json`);
}

function sourceQueueFile(book) {
  return path.join('data', 'quality', `source-correspondence-corpus-wikisource-${book}.json`);
}

function shortText(text, max = 140) {
  const value = String(text || '').replace(/\s+/gu, ' ').trim();
  return value.length <= max ? value : `${value.slice(0, max - 1)}...`;
}

function ensureRecord(map, book, chapter) {
  const key = chapterKey(book, chapter);
  if (!map.has(key)) {
    map.set(key, {
      key,
      book,
      chapter,
      chapterFile: chapterFile(book, chapter),
      sourceQueueFile: sourceQueueFile(book),
      counts: { source: 0, placeholders: 0, quotes: 0 },
      samples: { source: [], placeholders: [], quotes: [] },
    });
  }
  return map.get(key);
}

function addSample(list, text, max = 8) {
  if (list.length < max) list.push(text);
}

function readJsonIfExists(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadQueue(opts) {
  const records = new Map();
  const bookFilter = opts.book ? new Set([opts.book]) : null;
  const chapterFilter = opts.chapter ? new Set([opts.chapter]) : null;

  for (const entry of fs.readdirSync(QUALITY_DIR).filter((file) => SOURCE_QUEUE_RE.test(file)).sort()) {
    const book = entry.match(SOURCE_QUEUE_RE)?.[1];
    if (!book || (bookFilter && !bookFilter.has(book))) continue;
    const queue = readJsonIfExists(path.join(QUALITY_DIR, entry));
    for (const item of queue?.items || queue?.hits || []) {
      if (statusOf(item) !== 'pending') continue;
      if (chapterFilter && !chapterFilter.has(item.chapter)) continue;
      const record = ensureRecord(records, item.book || book, item.chapter);
      record.counts.source += 1;
      addSample(
        record.samples.source,
        `${item.id} ${item.type || 'source'} severity=${item.severity ?? '?'} source="${shortText(item.sourceRange?.text)}" local="${shortText(item.localRange?.text)}"`,
      );
    }
  }

  const placeholders = readJsonIfExists(path.join(QUALITY_DIR, 'placeholder-translations.json'));
  for (const [key, summary] of Object.entries(placeholders?.byChapter || {})) {
    const [book, chapter] = key.split('/');
    if ((bookFilter && !bookFilter.has(book)) || (chapterFilter && !chapterFilter.has(chapter))) continue;
    const count = Number(summary.pendingItems || 0);
    if (count <= 0) continue;
    const record = ensureRecord(records, book, chapter);
    record.counts.placeholders += count;
    addSample(record.samples.placeholders, `${count} placeholder translation(s) reported in ${key}`);
  }

  const quoteReport = readJsonIfExists(path.join(QUALITY_DIR, 'quote-span-alignment.json'));
  if (Array.isArray(quoteReport?.items)) {
    for (const item of quoteReport.items) {
      const match = String(item.file || '').match(CHAPTER_FILE_RE);
      if (!match) continue;
      const [, book, chapter] = match;
      if ((bookFilter && !bookFilter.has(book)) || (chapterFilter && !chapterFilter.has(chapter))) continue;
      const record = ensureRecord(records, book, chapter);
      record.counts.quotes += 1;
      addSample(
        record.samples.quotes,
        `${item.id || 'quote'} ${item.sentenceId || ''} severity=${item.severity ?? '?'}: ${(item.boundaryProblems || []).join('; ')}`,
      );
    }
  } else {
    for (const [file, count] of Object.entries(quoteReport?.byFile || {})) {
      const match = String(file).match(CHAPTER_FILE_RE);
      if (!match) continue;
      const [, book, chapter] = match;
      if ((bookFilter && !bookFilter.has(book)) || (chapterFilter && !chapterFilter.has(chapter))) continue;
      if (Number(count) <= 0) continue;
      const record = ensureRecord(records, book, chapter);
      record.counts.quotes += Number(count);
      addSample(record.samples.quotes, `${count} quote-span alignment issue(s) reported in ${file}`);
    }
  }

  for (const record of records.values()) {
    record.total = record.counts.source + record.counts.placeholders + record.counts.quotes;
  }

  return [...records.values()]
    .filter((record) => record.total > 0)
    .filter((record) => fs.existsSync(path.join(REPO_ROOT, record.chapterFile)))
    .sort(compareRecords(opts.order));
}

function compareRecords(order) {
  return (a, b) => {
    if (order === 'largest') return b.total - a.total || a.key.localeCompare(b.key);
    if (order === 'chronological') return a.key.localeCompare(b.key, 'en', { numeric: true });
    return a.total - b.total || a.key.localeCompare(b.key, 'en', { numeric: true });
  };
}

function buildModelSelection(opts) {
  const selection = { id: opts.model };
  if (opts.model.startsWith('composer-2.5') || opts.model === 'composer-latest') {
    selection.params = [{ id: 'fast', value: opts.fast ? 'true' : 'false' }];
  }
  return selection;
}

async function disposeAgent(agent) {
  if (typeof agent[Symbol.asyncDispose] === 'function') await agent[Symbol.asyncDispose]();
  else agent.close();
}

function appendLog(line, opts) {
  fs.appendFileSync(opts.log, `${line}\n`);
}

function claimPath(record) {
  return path.join(CLAIM_DIR, `${record.book}__${record.chapter}.lock`);
}

function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readClaimOwner(record) {
  try {
    return JSON.parse(fs.readFileSync(path.join(claimPath(record), 'owner.json'), 'utf8'));
  } catch {
    return null;
  }
}

function writeClaimOwner(record, patch) {
  const owner = {
    ...(readClaimOwner(record) || {}),
    ...patch,
    key: record.key,
    book: record.book,
    chapter: record.chapter,
    pid: process.pid,
    processRunId: PROCESS_RUN_ID,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(claimPath(record), 'owner.json'), `${JSON.stringify(owner, null, 2)}\n`);
}

function tryClaimChapter(record) {
  fs.mkdirSync(CLAIM_DIR, { recursive: true });
  const dir = claimPath(record);
  try {
    fs.mkdirSync(dir);
    writeClaimOwner(record, { startedAt: new Date().toISOString() });
    return true;
  } catch (err) {
    if (err?.code !== 'EEXIST') throw err;
    const owner = readClaimOwner(record);
    if (owner && processIsAlive(owner.pid) && owner.processRunId !== PROCESS_RUN_ID) {
      return false;
    }
    fs.rmSync(dir, { recursive: true, force: true });
    return tryClaimChapter(record);
  }
}

function releaseChapterClaim(record) {
  const owner = readClaimOwner(record);
  if (!owner || owner.processRunId === PROCESS_RUN_ID) {
    fs.rmSync(claimPath(record), { recursive: true, force: true });
  }
}

function runCheck(command, args) {
  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 1024 * 1024 * 16,
  });
  return {
    status: result.status ?? 1,
    output: `${result.stdout || ''}${result.stderr || ''}`.trim(),
  };
}

function pendingSourceFor(record) {
  const queuePath = path.join(REPO_ROOT, record.sourceQueueFile);
  const queue = readJsonIfExists(queuePath);
  return (queue?.items || queue?.hits || [])
    .filter((item) => item.book === record.book && item.chapter === record.chapter)
    .filter((item) => statusOf(item) === 'pending')
    .map((item) => item.id);
}

function manualTranslationMetadataIssues(record) {
  const queuePath = path.join(REPO_ROOT, record.sourceQueueFile);
  const queue = readJsonIfExists(queuePath);
  const issues = [];
  for (const item of queue?.items || queue?.hits || []) {
    if (item.book !== record.book || item.chapter !== record.chapter) continue;
    if (item.reviewer !== 'sdk-repair-chapter') continue;
    const rows = item.manualTranslations || item.manualTranslation || [];
    for (const [index, row] of rows.entries()) {
      if (!row?.translator) issues.push(`${item.id}.manualTranslations[${index}].translator`);
      if (!row?.model) issues.push(`${item.id}.manualTranslations[${index}].model`);
    }
  }
  return issues;
}

function sourceQueueJsonErrors() {
  const errors = [];
  for (const entry of fs.readdirSync(QUALITY_DIR)) {
    if (!SOURCE_QUEUE_RE.test(entry)) continue;
    const relPath = path.join('data', 'quality', entry);
    try {
      JSON.parse(fs.readFileSync(path.join(REPO_ROOT, relPath), 'utf8'));
    } catch (err) {
      errors.push(`${relPath}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return errors;
}

function verifyChapter(record) {
  const jsonErrors = [];
  try {
    JSON.parse(fs.readFileSync(path.join(REPO_ROOT, record.chapterFile), 'utf8'));
  } catch (err) {
    jsonErrors.push(`${record.chapterFile}: ${err instanceof Error ? err.message : String(err)}`);
  }
  if (fs.existsSync(path.join(REPO_ROOT, record.sourceQueueFile))) {
    try {
      JSON.parse(fs.readFileSync(path.join(REPO_ROOT, record.sourceQueueFile), 'utf8'));
    } catch (err) {
      jsonErrors.push(`${record.sourceQueueFile}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  jsonErrors.push(...sourceQueueJsonErrors().filter((line) => !line.startsWith(`${record.sourceQueueFile}:`)));

  const quote = runCheck('node', [
    'scripts/scan-quote-span-alignment.mjs',
    record.chapterFile,
    '--publication',
    '--limit=0',
  ]);
  const placeholders = runCheck('node', [
    'scripts/scan-placeholder-translations.mjs',
    record.chapterFile,
    '--summary',
    '--limit=0',
    '--fail',
  ]);
  const pendingSource = jsonErrors.length === 0 ? pendingSourceFor(record) : [];
  const metadataIssues = jsonErrors.length === 0 ? manualTranslationMetadataIssues(record) : [];
  const ok = jsonErrors.length === 0
    && quote.status === 0
    && placeholders.status === 0
    && pendingSource.length === 0
    && metadataIssues.length === 0;
  return { ok, jsonErrors, quote, placeholders, pendingSource, metadataIssues };
}

function clip(text, max = 6000) {
  const value = String(text || '').trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max)}\n... [truncated ${value.length - max} chars]`;
}

function isSdkRuntimeError(err) {
  if (err instanceof CursorAgentError) return true;
  const message = err instanceof Error ? err.message : String(err);
  return /NGHTTP2_|ERR_HTTP2_|ConnectError|Stream closed|SQLITE_BUSY|database is locked|ECONNRESET|ETIMEDOUT|EAI_AGAIN/u.test(message);
}

function verificationFailureText(record, verification, status) {
  const sections = [
    `Chapter: ${record.key}`,
    `Previous run status: ${status}`,
  ];
  if (verification?.jsonErrors?.length) {
    sections.push(`JSON errors:\n${verification.jsonErrors.map((line) => `- ${line}`).join('\n')}`);
  }
  if (verification && verification.quote.status !== 0) {
    sections.push(`Quote scanner output:\n${clip(verification.quote.output)}`);
  }
  if (verification && verification.placeholders.status !== 0) {
    sections.push(`Placeholder scanner output:\n${clip(verification.placeholders.output)}`);
  }
  if (verification?.pendingSource?.length) {
    sections.push(`Pending source queue item ids:\n${verification.pendingSource.map((id) => `- ${id}`).join('\n')}`);
  }
  if (verification?.metadataIssues?.length) {
    sections.push(`Missing manual translation metadata:\n${verification.metadataIssues.map((id) => `- ${id}`).join('\n')}`);
  }
  if (!verification) {
    sections.push('The prior SDK run did not finish successfully. Inspect the chapter and queue files, then complete the same assignment.');
  }
  return sections.join('\n\n');
}

function buildVerificationFixPrompt(record, verification, status, attempt, maxAttempts) {
  return `Your previous repair attempt for ${record.key} did not pass verification.

This is follow-up ${attempt} of ${maxAttempts}. Continue in the same chapter only:

- Chapter file: ${record.chapterFile}
- Source queue: ${record.sourceQueueFile}

Fix only the problems below. Do not edit other chapters. After fixing, rerun the relevant checks before you finish.

${verificationFailureText(record, verification, status)}
`;
}

async function sendAndWait(agent, record, message, opts, label) {
  const run = await agent.send(message);
  console.log(`[${record.key}] ${label} run ${run.id}`);
  appendLog(`[${record.key}] ${label} run=${run.id}`, opts);
  writeClaimOwner(record, { runId: run.id, phase: label });

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
  console.log(`\n[${record.key}] finished ${label} run ${result.id} status=${result.status}`);
  appendLog(`=== END ${record.key} ${label} status=${result.status} run=${result.id} ===`, opts);
  return result;
}

async function runRepair(record, opts) {
  const prompt = buildRepairPrompt({
    book: record.book,
    chapter: record.chapter,
    chapterFile: record.chapterFile,
    sourceQueueFile: record.sourceQueueFile,
    model: opts.model,
    counts: record.counts,
    samples: record.samples,
  });

  const fastNote = opts.fast ? 'fast=on' : 'fast=off';
  if (opts.dryRun) {
    console.log(
      `[dry-run] ${record.key}: total=${record.total} source=${record.counts.source} placeholders=${record.counts.placeholders} quotes=${record.counts.quotes}; model=${opts.model} (${fastNote}); prompt=${prompt.length} chars`,
    );
    return { key: record.key, status: 'dry-run' };
  }

  const preflight = verifyChapter(record);
  if (preflight.ok) {
    console.log(`[${record.key}] already passes verification; skipping SDK agent`);
    return {
      key: record.key,
      status: 'finished',
      verification: 'already-passed',
    };
  }

  const agentOptions = {
    apiKey: opts.apiKey,
    model: buildModelSelection(opts),
    local: { cwd: REPO_ROOT, settingSources: [] },
  };

  for (let runtimeAttempt = 0; runtimeAttempt <= opts.runtimeRetries; runtimeAttempt += 1) {
    /** @type {import('@cursor/sdk').SDKAgent | undefined} */
    let agent;
    let lastResult;
    let shouldRetryRuntime = false;
    try {
      agent = await createLocalAgent(agentOptions, opts);
      const runtimeLabel = runtimeAttempt === 0 ? 'initial' : `runtime-retry-${runtimeAttempt}`;
      console.log(`[${record.key}] agent ${agent.agentId} — sending repair prompt (${fastNote}; ${runtimeLabel})`);
      appendLog(`=== START ${record.key} ${runtimeLabel} agent=${agent.agentId} ${new Date().toISOString()} ===`, opts);
      writeClaimOwner(record, { agentId: agent.agentId, runtimeAttempt });

      let result = await sendAndWait(agent, record, prompt, opts, 'initial');
      lastResult = result;
      if (result.status !== 'finished') {
        console.error(`[${record.key}] SDK run status=${result.status}; will retry with a fresh agent`);
        appendLog(`=== RUNTIME RETRY ${record.key} status=${result.status} run=${result.id} ===`, opts);
        shouldRetryRuntime = true;
      } else {
        let verification = verifyChapter(record);

        for (let attempt = 1; attempt <= opts.verifyRetries && !verification.ok; attempt += 1) {
          console.error(`[${record.key}] verification failed; sending same-agent follow-up ${attempt}/${opts.verifyRetries}`);
          if (verification.jsonErrors.length) console.error(`[${record.key}] JSON errors: ${verification.jsonErrors.join('; ')}`);
          if (verification.quote.status !== 0) console.error(clip(verification.quote.output, 1200));
          if (verification.placeholders.status !== 0) console.error(clip(verification.placeholders.output, 1200));
          if (verification.pendingSource.length) {
            console.error(`[${record.key}] pending source items: ${verification.pendingSource.join(', ')}`);
          }
          if (verification.metadataIssues.length) {
            console.error(`[${record.key}] missing manual translation metadata: ${verification.metadataIssues.join(', ')}`);
          }

          const followUp = buildVerificationFixPrompt(record, verification, result.status, attempt, opts.verifyRetries);
          result = await sendAndWait(agent, record, followUp, opts, `follow-up-${attempt}`);
          lastResult = result;
          if (result.status !== 'finished') {
            console.error(`[${record.key}] SDK follow-up status=${result.status}; will retry with a fresh agent`);
            appendLog(`=== RUNTIME RETRY ${record.key} follow-up status=${result.status} run=${result.id} ===`, opts);
            verification = null;
            shouldRetryRuntime = true;
            break;
          }
          verification = verifyChapter(record);
        }

        if (verification && !verification.ok) {
          console.error(`[${record.key}] post-run verification failed after ${opts.verifyRetries} follow-up attempt(s)`);
          return {
            key: record.key,
            status: result.status,
            runId: result.id,
            agentId: agent.agentId,
            verification: 'failed',
          };
        }

        if (verification?.ok) {
          return {
            key: record.key,
            status: result.status,
            runId: result.id,
            agentId: agent.agentId,
            verification: 'passed',
          };
        }
      }
    } catch (err) {
      if (!isSdkRuntimeError(err)) {
        throw err;
      }
      shouldRetryRuntime = true;
      const message = err instanceof Error ? err.message : String(err);
      const retryable = err instanceof CursorAgentError ? err.isRetryable : 'unknown';
      console.error(`[${record.key}] SDK runtime failed: ${message} retryable=${retryable}`);
      appendLog(`=== SDK RUNTIME FAILED ${record.key} retryable=${retryable} message=${message} ===`, opts);
    } finally {
      if (agent) await withLocalSdkMutex(() => disposeAgent(agent));
    }

    if (drainRequested && shouldRetryRuntime) {
      return {
        key: record.key,
        status: lastResult?.status ?? 'drained',
        runId: lastResult?.id,
        verification: 'runtime-drained',
      };
    }

    if (shouldRetryRuntime && runtimeAttempt < opts.runtimeRetries) {
      const delayMs = Math.min(60_000, 2_000 * 2 ** runtimeAttempt);
      console.error(`[${record.key}] retrying after SDK runtime failure in ${delayMs}ms (${runtimeAttempt + 1}/${opts.runtimeRetries})`);
      await sleep(delayMs);
    } else if (lastResult) {
      if (shouldRetryRuntime) {
        return {
          key: record.key,
          status: lastResult.status,
          runId: lastResult.id,
          verification: 'runtime-failed',
        };
      }
    }
  }

  return {
    key: record.key,
    status: 'error',
    verification: 'runtime-failed',
  };
}

function writePlan(items, opts) {
  const plan = {
    generatedAt: new Date().toISOString(),
    model: opts.model,
    fast: opts.fast,
    concurrency: opts.concurrency,
    order: opts.order,
    limit: Number.isFinite(opts.limit) ? opts.limit : null,
    chapters: items.map((item) => ({
      book: item.book,
      chapter: item.chapter,
      total: item.total,
      ...item.counts,
    })),
  };
  fs.writeFileSync(PLAN_PATH, `${JSON.stringify(plan, null, 2)}\n`);
  return plan;
}

function selectInitialBatch(items, opts) {
  if (opts.chapter) return items;
  if (!Number.isFinite(opts.limit)) return items;

  const selected = [];
  const selectedKeys = new Set();
  const selectedBooks = new Set();

  for (const item of items) {
    if (selected.length >= opts.limit) break;
    if (selectedBooks.has(item.book)) continue;
    selected.push(item);
    selectedKeys.add(item.key);
    selectedBooks.add(item.book);
  }

  for (const item of items) {
    if (selected.length >= opts.limit) break;
    if (selectedKeys.has(item.key)) continue;
    selected.push(item);
    selectedKeys.add(item.key);
  }

  return selected;
}

async function runPool(initialItems, opts) {
  const results = [];
  const failedOrAttempted = new Set();
  let launched = 0;
  let queue = [...initialItems];
  const running = new Map();
  const activeBooks = new Set();
  let lastLaunchAt = 0;

  const maybeWaitForLaunchSlot = async () => {
    if (lastLaunchAt === 0 || opts.launchIntervalMs === 0) return;
    const waitMs = opts.launchIntervalMs - (Date.now() - lastLaunchAt);
    if (waitMs > 0) await sleep(waitMs);
  };

  const launchNext = async () => {
    while (!drainRequested && running.size < opts.concurrency && launched < opts.limit) {
      const index = queue.findIndex((item) => !activeBooks.has(item.book) && !failedOrAttempted.has(item.key));
      if (index === -1) break;
      await maybeWaitForLaunchSlot();
      if (drainRequested) break;
      const [item] = queue.splice(index, 1);
      if (!opts.dryRun && !tryClaimChapter(item)) {
        failedOrAttempted.add(item.key);
        continue;
      }
      launched += 1;
      activeBooks.add(item.book);
      failedOrAttempted.add(item.key);
      const promise = runRepair(item, opts)
        .then((result) => ({ item, result }))
        .catch((error) => ({ item, error }));
      running.set(item.key, promise);
      lastLaunchAt = Date.now();
    }
  };

  while (!drainRequested) {
    await launchNext();
    if (running.size === 0) {
      if (!opts.untilComplete || launched >= opts.limit) break;
      queue = loadQueue(opts).filter((item) => !failedOrAttempted.has(item.key));
      if (queue.length === 0) break;
      continue;
    }

    const settled = await Promise.race(running.values());
    running.delete(settled.item.key);
    activeBooks.delete(settled.item.book);
    if (!opts.dryRun) releaseChapterClaim(settled.item);
    if (settled.error) {
      console.error(`[${settled.item.key}] failed: ${settled.error instanceof Error ? settled.error.message : settled.error}`);
      results.push({ key: settled.item.key, status: 'error' });
    } else {
      results.push(settled.result);
    }
  }

  if (running.size > 0) {
    const remaining = await Promise.all(running.values());
    for (const settled of remaining) {
      if (!opts.dryRun) releaseChapterClaim(settled.item);
      if (settled.error) results.push({ key: settled.item.key, status: 'error' });
      else results.push(settled.result);
    }
  }

  return results;
}

function refreshReports() {
  console.log('[repair] refreshing placeholder report…');
  spawnSync('npm', ['run', 'quality:placeholders:report'], { cwd: REPO_ROOT, stdio: 'inherit' });
  console.log('[repair] refreshing quote report…');
  spawnSync('npm', ['run', 'quality:quotes:report'], { cwd: REPO_ROOT, stdio: 'inherit' });
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.refreshReports && !opts.dryRun) refreshReports();
  const items = loadQueue(opts);

  if (opts.listQueue) {
    console.log(`${items.length} chapter(s) with pending repair issues`);
    for (const item of items.slice(0, 80)) {
      console.log(
        `${item.key} total=${item.total} source=${item.counts.source} placeholders=${item.counts.placeholders} quotes=${item.counts.quotes}`,
      );
    }
    if (items.length > 80) console.log(`...and ${items.length - 80} more`);
    return;
  }

  const selected = selectInitialBatch(items, opts);
  writePlan(selected, opts);
  console.log(`Plan: ${PLAN_PATH}`);
  console.log(`Log: ${opts.log}`);
  console.log(`Selected ${selected.length} chapter(s); concurrency=${opts.concurrency}; model=${opts.model}; fast=${opts.fast}`);
  for (const item of selected.slice(0, 25)) {
    console.log(
      `  ${item.key} total=${item.total} source=${item.counts.source} placeholders=${item.counts.placeholders} quotes=${item.counts.quotes}`,
    );
  }
  if (selected.length > 25) console.log(`  ...and ${selected.length - 25} more`);

  if (selected.length === 0) return;

  fs.writeFileSync(opts.log, `=== sdk repair batch ${new Date().toISOString()} ===\n`);
  const results = await runPool(selected, opts);
  const failed = results.filter((result) => result.status !== 'finished' && result.status !== 'dry-run');
  const verificationFailed = results.filter((result) => result.verification === 'failed');
  const runtimeFailed = results.filter((result) => result.verification === 'runtime-failed');
  console.log(
    `\nFinished: ${results.length - failed.length} ok, ${failed.length} failed, ${verificationFailed.length} verification failed, ${runtimeFailed.length} runtime failed`,
  );
  if (opts.refreshReports && !opts.dryRun) refreshReports();
  if (failed.length > 0 || verificationFailed.length > 0) process.exit(2);
}

main().catch((err) => {
  console.error(err);
  process.exit(err instanceof CursorAgentError ? 1 : 2);
});
