/**
 * Shared helpers for inspecting Cursor SDK agent/run failures (cloud + local).
 */
import { Agent } from '@cursor/sdk';
import fs from 'node:fs';

export const CLOUD_AGENT_URL_BASE = 'https://cursor.com/agents';

/**
 * @param {string} agentId
 */
export function isCloudAgentId(agentId) {
  return typeof agentId === 'string' && agentId.startsWith('bc-');
}

/**
 * @param {string} agentId
 */
export function cloudAgentUrl(agentId) {
  if (!agentId) return undefined;
  return isCloudAgentId(agentId)
    ? `${CLOUD_AGENT_URL_BASE}/${agentId}`
    : undefined;
}

/**
 * @param {unknown} turn
 * @param {number} [maxChars]
 */
export function formatConversationTurn(turn, maxChars = 4000) {
  if (!turn || typeof turn !== 'object') return String(turn);
  const t = /** @type {Record<string, unknown>} */ (turn);
  const type = t.type;
  if (type === 'agentConversationTurn' && t.message && typeof t.message === 'object') {
    const msg = /** @type {Record<string, unknown>} */ (t.message);
    const text = typeof msg.text === 'string' ? msg.text : JSON.stringify(msg, null, 2);
    return truncate(text, maxChars);
  }
  if (type === 'shellConversationTurn') {
    const cmd = t.command;
    const out = t.output;
    if (out && typeof out === 'object') {
      const o = /** @type {Record<string, unknown>} */ (out);
      const parts = [
        cmd ? `$ ${cmd}` : '',
        typeof o.exitCode === 'number' ? `exit ${o.exitCode}` : '',
        typeof o.stderr === 'string' && o.stderr.trim() ? `stderr:\n${o.stderr}` : '',
        typeof o.stdout === 'string' && o.stdout.trim() ? `stdout:\n${o.stdout}` : '',
      ].filter(Boolean);
      return truncate(parts.join('\n'), maxChars);
    }
  }
  return truncate(JSON.stringify(turn, null, 2), maxChars);
}

/**
 * @param {string} s
 * @param {number} max
 */
function truncate(s, max) {
  if (s.length <= max) return s;
  return `${s.slice(0, max)}\n… [truncated ${s.length - max} chars]`;
}

/**
 * @param {object} opts
 * @param {string} [opts.book]
 * @param {string} opts.agentId
 * @param {string} opts.runId
 * @param {import('@cursor/sdk').RunResult['status']} opts.status
 * @param {string} [opts.resultText]
 * @param {string} [opts.prefix] Log line prefix (e.g. "[songshi]")
 */
export function printRunFailureHeader(opts) {
  const prefix = opts.prefix ?? (opts.book ? `[${opts.book}]` : '');
  const url = cloudAgentUrl(opts.agentId);
  console.error(`${prefix} run failed: ${opts.runId} status=${opts.status}`);
  console.error(`${prefix} agent: ${opts.agentId}`);
  if (url) console.error(`${prefix} open: ${url}`);
  if (opts.resultText?.trim()) {
    console.error(`${prefix} result summary:\n${truncate(opts.resultText.trim(), 8000)}`);
  }
}

/**
 * Fetch conversation tail and print diagnostics for a finished run.
 *
 * @param {object} opts
 * @param {string} [opts.book]
 * @param {string} opts.agentId
 * @param {string} opts.runId
 * @param {import('@cursor/sdk').RunResult} opts.result
 * @param {import('@cursor/sdk').Run} [opts.run] Prefer in-process run when still open
 * @param {'local'|'cloud'} [opts.runtime]
 * @param {string} [opts.cwd]
 * @param {string} [opts.apiKey]
 * @param {number} [opts.tailTurns]
 */
export async function printRunFailureDiagnostics(opts) {
  const {
    book,
    agentId,
    runId,
    result,
    run: liveRun,
    runtime = isCloudAgentId(agentId) ? 'cloud' : 'local',
    cwd,
    apiKey = process.env.CURSOR_API_KEY,
    tailTurns = 4,
  } = opts;

  printRunFailureHeader({
    book,
    agentId,
    runId,
    status: result.status,
    resultText: result.result,
    prefix: book ? `[${book}]` : undefined,
  });

  let run = liveRun;
  if (!run) {
    try {
      run =
        runtime === 'cloud'
          ? await Agent.getRun(runId, { runtime: 'cloud', agentId, apiKey })
          : await Agent.getRun(runId, { runtime: 'local', cwd });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(book ? `[${book}]` : '', `could not load run for conversation: ${msg}`);
      return;
    }
  }

  if (!run.supports('conversation')) {
    console.error(
      book ? `[${book}]` : '',
      `conversation() not supported: ${run.unsupportedReason('conversation') ?? 'unknown'}`,
    );
    return;
  }

  try {
    const turns = await run.conversation();
    const tail = turns.slice(-tailTurns);
    console.error(
      book ? `[${book}]` : '',
      `conversation: ${turns.length} turn(s), last ${tail.length}:`,
    );
    for (const [i, turn] of tail.entries()) {
      const label = turns.length - tail.length + i + 1;
      console.error(`--- turn ${label} (${/** @type {{ type?: string }} */ (turn).type ?? 'unknown'}) ---`);
      console.error(formatConversationTurn(turn));
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(book ? `[${book}]` : '', `conversation() failed: ${msg}`);
  }
}

/**
 * Parse sdk-translate log for error runs and startup failures.
 *
 * @param {string} logText
 * @returns {Array<{ book: string, agentId?: string, runId?: string, kind: 'run_error'|'startup_failed', message?: string }>}
 */
export function parseTranslateLogErrors(logText) {
  /** @type {Record<string, string>} */
  const lastAgentByBook = {};
  /** @type {Array<{ book: string, agentId?: string, runId?: string, kind: 'run_error'|'startup_failed', message?: string }>} */
  const errors = [];

  for (const line of logText.split('\n')) {
    let m = line.match(/^\[(\w+)\] agent (bc-[^\s]+)/);
    if (m) {
      lastAgentByBook[m[1]] = m[2];
      continue;
    }
    m = line.match(/^\[(\w+)\] finished run (run-[^\s]+) status=error/);
    if (m) {
      errors.push({
        book: m[1],
        runId: m[2],
        agentId: lastAgentByBook[m[1]],
        kind: 'run_error',
      });
      continue;
    }
    m = line.match(/^\[(\w+)\] startup failed: (.+)$/);
    if (m) {
      errors.push({
        book: m[1],
        agentId: lastAgentByBook[m[1]],
        kind: 'startup_failed',
        message: m[2],
      });
    }
  }
  return errors;
}

/**
 * @param {string} logPath
 */
export function readTranslateLog(logPath) {
  return fs.readFileSync(logPath, 'utf8');
}
