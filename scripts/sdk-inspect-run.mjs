#!/usr/bin/env node
/**
 * Inspect failed Cursor SDK translation runs (conversation tail, result summary, agent URL).
 *
 *   node scripts/sdk-inspect-run.mjs --agent bc-… --run run-…
 *   node scripts/sdk-inspect-run.mjs --from-log /tmp/sdk-translate-cloud.log
 *   node scripts/sdk-inspect-run.mjs --from-log /tmp/sdk-translate-cloud.log --book songshi
 */
import { Agent } from '@cursor/sdk';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDotenv } from './load-dotenv.mjs';
import {
  cloudAgentUrl,
  formatConversationTurn,
  isCloudAgentId,
  parseTranslateLogErrors,
  printRunFailureDiagnostics,
  printRunFailureHeader,
  readTranslateLog,
} from './sdk-inspect-shared.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadDotenv(REPO_ROOT);

function usage() {
  console.log(`Usage: node scripts/sdk-inspect-run.mjs [options]

Options:
  --agent <bc-…>           Cloud agent id (required with --run unless --from-log)
  --run <run-…>            Run id to inspect
  --runtime <local|cloud>    Override runtime detection (default: from agent id prefix)
  --cwd <path>               Local agent cwd (default: repo root)
  --from-log <path>          Parse sdk-translate log for status=error / startup failed
  --book <id>                With --from-log: only that book (default: all errors in log)
  --tail-turns <n>           Conversation turns to print (default: 4)
  -h, --help                 This message

Examples:
  node scripts/sdk-inspect-run.mjs --agent bc-68933ed8-66a4-41ea-a5ff-c0c18311f5f3 --run run-59b5bbaa-42f4-4d76-8507-30c520539b80
  node scripts/sdk-inspect-run.mjs --from-log /tmp/sdk-translate-cloud.log
  node scripts/sdk-inspect-run.mjs --from-log /tmp/sdk-translate-cloud.log --book songshi
`);
}

function parseArgs(argv) {
  const opts = {
    agentId: undefined,
    runId: undefined,
    fromLog: undefined,
    book: undefined,
    runtime: undefined,
    cwd: REPO_ROOT,
    tailTurns: 4,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') opts.help = true;
    else if (a === '--agent') opts.agentId = argv[++i];
    else if (a === '--run') opts.runId = argv[++i];
    else if (a === '--from-log') opts.fromLog = argv[++i];
    else if (a === '--book') opts.book = argv[++i];
    else if (a === '--runtime') opts.runtime = argv[++i];
    else if (a === '--cwd') opts.cwd = path.resolve(argv[++i]);
    else if (a === '--tail-turns') opts.tailTurns = Number.parseInt(argv[++i], 10);
    else {
      console.error(`Unknown option: ${a}`);
      opts.help = true;
    }
  }
  return opts;
}

/**
 * @param {ReturnType<typeof parseArgs>} opts
 */
async function inspectOne(opts) {
  const { agentId, runId, book, tailTurns } = opts;
  if (!agentId || !runId) {
    console.error('--agent and --run are required');
    process.exit(1);
  }
  const runtime = opts.runtime ?? (isCloudAgentId(agentId) ? 'cloud' : 'local');
  const apiKey = process.env.CURSOR_API_KEY;
  if (runtime === 'cloud' && !apiKey) {
    console.error('CURSOR_API_KEY is required for cloud runs');
    process.exit(1);
  }

  const getOpts =
    runtime === 'cloud'
      ? { runtime: 'cloud', agentId, apiKey }
      : { runtime: 'local', cwd: opts.cwd };

  const run = await Agent.getRun(runId, getOpts);
  const status = run.status === 'running' ? 'error' : run.status;
  const result = {
    id: runId,
    status,
    result: run.result,
    git: run.git,
    durationMs: run.durationMs,
    model: run.model,
  };

  if (book) {
    await printRunFailureDiagnostics({
      book,
      agentId,
      runId,
      result,
      run,
      runtime,
      cwd: opts.cwd,
      apiKey,
      tailTurns,
    });
    return;
  }

  printRunFailureHeader({ agentId, runId, status, resultText: run.result });
  if (run.supports('conversation')) {
    const turns = await run.conversation();
    const tail = turns.slice(-tailTurns);
    console.error(`conversation: ${turns.length} turn(s), last ${tail.length}:`);
    for (const [i, turn] of tail.entries()) {
      const label = turns.length - tail.length + i + 1;
      console.error(`--- turn ${label} ---`);
      console.error(formatConversationTurn(turn));
    }
  }
}

/**
 * @param {ReturnType<typeof parseArgs>} opts
 */
async function inspectFromLog(opts) {
  const logPath = path.resolve(opts.fromLog);
  const errors = parseTranslateLogErrors(readTranslateLog(logPath));
  const filtered = opts.book ? errors.filter((e) => e.book === opts.book) : errors;

  if (filtered.length === 0) {
    console.error(
      opts.book
        ? `No errors for book "${opts.book}" in ${logPath}`
        : `No run errors or startup failures in ${logPath}`,
    );
    process.exit(1);
  }

  for (const entry of filtered) {
    console.error(`\n=== ${entry.book} (${entry.kind}) ===`);
    if (entry.kind === 'startup_failed') {
      console.error(`message: ${entry.message ?? '(none)'}`);
      if (entry.agentId) {
        console.error(`agent: ${entry.agentId}`);
        const url = cloudAgentUrl(entry.agentId);
        if (url) console.error(`open: ${url}`);
      }
      continue;
    }
    if (!entry.runId) {
      console.error('missing run id in log');
      continue;
    }
    if (!entry.agentId) {
      console.error(`run ${entry.runId} — no agent id in log (grep "[${entry.book}] agent" earlier)`);
      continue;
    }
    await inspectOne({
      ...opts,
      book: entry.book,
      agentId: entry.agentId,
      runId: entry.runId,
    });
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    usage();
    process.exit(opts.help && process.argv.length <= 2 ? 0 : 1);
  }

  if (opts.fromLog) {
    await inspectFromLog(opts);
    return;
  }

  if (!opts.agentId || !opts.runId) {
    usage();
    process.exit(1);
  }

  await inspectOne(opts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
