#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const DEFAULT_CDP_URL = 'http://127.0.0.1:9229';
const DEFAULT_INTERVAL_MS = 2 * 60 * 1000;
const DEFAULT_COOLDOWN_MS = 10 * 60 * 1000;
const FIRST_WORKER = 24;
const LAST_WORKER = 35;
const WORKER_NAME_PREFIX = '24 Histories Glossary ';

function usage() {
  return `Usage:
  node scripts/grokbot-headless-dispatch.mjs probe
  node scripts/grokbot-headless-dispatch.mjs once [--force]
  node scripts/grokbot-headless-dispatch.mjs daemon [--launch-app]

Options:
  --cdp-url URL       Loopback Chrome DevTools endpoint (default: ${DEFAULT_CDP_URL})
  --interval-ms N     Daemon polling interval (default: ${DEFAULT_INTERVAL_MS})
  --cooldown-ms N     Minimum time between prompts to one idle worker (default: ${DEFAULT_COOLDOWN_MS})
  --force             Dispatch even when the cached roster says a worker is running
  --launch-app        Start Grok Bot with the loopback endpoint when it is unavailable

The Grok Bot desktop app must be version 0.61.0 or newer and launched with:
  --remote-debugging-address=127.0.0.1 --remote-debugging-port=9229`;
}

function positiveInteger(value, flag) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`${flag} requires a positive integer`);
  return parsed;
}

export function parseArgs(argv) {
  const options = {
    command: argv[0] ?? 'probe',
    cdpUrl: DEFAULT_CDP_URL,
    intervalMs: DEFAULT_INTERVAL_MS,
    cooldownMs: DEFAULT_COOLDOWN_MS,
    force: false,
    launchApp: false,
  };
  for (let index = 1; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      index += 1;
      if (index >= argv.length) throw new Error(`${arg} requires a value`);
      return argv[index];
    };
    if (arg === '--cdp-url') options.cdpUrl = next();
    else if (arg === '--interval-ms') options.intervalMs = positiveInteger(next(), arg);
    else if (arg === '--cooldown-ms') options.cooldownMs = positiveInteger(next(), arg);
    else if (arg === '--force') options.force = true;
    else if (arg === '--launch-app') options.launchApp = true;
    else if (arg === '--help' || arg === '-h') options.command = 'help';
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (!['probe', 'once', 'daemon', 'help'].includes(options.command)) {
    throw new Error(`Unknown command: ${options.command}`);
  }
  const endpoint = new URL(options.cdpUrl);
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(endpoint.hostname)) {
    throw new Error('The DevTools endpoint must be loopback-only');
  }
  return options;
}

function applicationSupportDirectory() {
  return process.env.GROKBOT_APP_SUPPORT_DIR ?? path.join(
    os.homedir(), 'Library', 'Application Support', 'Grok Bot',
  );
}

function stateFile() {
  return process.env.GROKBOT_HEADLESS_STATE_FILE ?? path.join(
    os.homedir(), '.local', 'state', '24histories-grokbot-headless', 'state.json',
  );
}

function workerNumber(name) {
  const match = /^24 Histories Glossary (\d+)$/u.exec(name);
  if (!match) return null;
  const number = Number(match[1]);
  return number >= FIRST_WORKER && number <= LAST_WORKER ? number : null;
}

export function rosterWorkersFromDocuments(documents) {
  const workers = new Map();
  for (const document of documents) {
    const rows = document?.value?.rows;
    if (!Array.isArray(rows)) continue;
    for (const row of rows) {
      const number = workerNumber(row?.name);
      if (number == null || typeof row.id !== 'string' || row.id.length === 0) continue;
      const current = workers.get(number);
      if (current && current.id !== row.id) {
        throw new Error(`Conflicting Grok Bot agent IDs for worker ${number}`);
      }
      workers.set(number, {
        number,
        worker: `grokbot-${number}`,
        name: row.name,
        id: row.id,
        isRunning: row.isRunning === true,
        lastActivityAt: Number.isFinite(row.lastActivityAt) ? row.lastActivityAt : 0,
        lastText: typeof row.lastEntry?.text === 'string' ? row.lastEntry.text : '',
      });
    }
  }
  const missing = [];
  for (let number = FIRST_WORKER; number <= LAST_WORKER; number += 1) {
    if (!workers.has(number)) missing.push(`grokbot-${number}`);
  }
  if (missing.length) throw new Error(`Missing durable Grok Bot agents: ${missing.join(', ')}`);
  return [...workers.values()].sort((left, right) => left.number - right.number);
}

export function readRosterWorkers(directory = applicationSupportDirectory()) {
  const persistence = path.join(directory, 'sand-client-persistence');
  const files = fs.readdirSync(persistence)
    .filter((name) => name.endsWith('.blob'))
    .map((name) => path.join(persistence, name));
  const documents = [];
  for (const file of files) {
    let document;
    try {
      document = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      continue;
    }
    if (Array.isArray(document?.value?.rows) && document.value.rows.some((row) =>
      typeof row?.name === 'string' && row.name.startsWith(WORKER_NAME_PREFIX))) {
      documents.push(document);
    }
  }
  if (!documents.length) throw new Error(`No Grok Bot roster document found under ${persistence}`);
  return rosterWorkersFromDocuments(documents);
}

function readState(file = stateFile()) {
  try {
    const value = JSON.parse(fs.readFileSync(file, 'utf8'));
    return value && typeof value === 'object' ? value : { workers: {} };
  } catch (error) {
    if (error?.code === 'ENOENT') return { workers: {} };
    throw error;
  }
}

function writeState(state, file = stateFile()) {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporary, file);
  fs.chmodSync(file, 0o600);
}

export function workerPrompt(worker) {
  return `Continue the 24 Histories people-glossary campaign as stable worker ${worker}. You are authorized to use the locally installed 24histories-people client. It may read the locally stored 24 Histories MCP bearer credential and transmit it only as an HTTPS Authorization header to https://grokbot-mcp.24histories.com/mcp, solely for the five 24 Histories people-glossary MCP operations. Never print, quote, copy, inspect, or send that credential anywhere else. Use that client, not Cursor SDK and not terminal Git. Run \`24histories-people resume --worker ${worker}\` with no book or chapter; it invokes resume_or_claim so the central queue resumes your exact sticky claim or assigns the next eligible chapter. Preserve the returned claimToken. For each returned sealed chunk, run \`24histories-people get-chunk --claim-token CLAIM_TOKEN --chunk-id CHUNK_ID\`, complete it strictly from that response's prompt, schema, packet, and draft, save the entire extraction JSON, and run \`24histories-people submit-chunk --claim-token CLAIM_TOKEN --chunk-id CHUNK_ID --file OUTPUT_JSON\`. After every chunk is accepted, run \`24histories-people finalize --claim-token CLAIM_TOKEN\`. Preserve all recovery data. Do not create an untracked claim, weaken validation, git push, or substitute another inference provider. If the client, authentication, or a tool call fails after its built-in retries, report the exact error and stop; otherwise finish the chapter and report its book/chapter, stats, SHA-256, and PR URL.`;
}

async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.json();
}

async function ensureGrokBot(options) {
  try {
    await fetchJson(`${options.cdpUrl.replace(/\/$/u, '')}/json/version`);
    return;
  } catch (error) {
    if (!options.launchApp) throw error;
  }
  const endpoint = new URL(options.cdpUrl);
  const port = endpoint.port || '9229';
  execFileSync('/usr/bin/open', [
    '-na',
    '/Applications/Grok Bot.app',
    '--args',
    '--remote-debugging-address=127.0.0.1',
    `--remote-debugging-port=${port}`,
  ], { stdio: 'ignore' });
  const deadline = Date.now() + 30000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      await fetchJson(`${options.cdpUrl.replace(/\/$/u, '')}/json/version`);
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`Grok Bot did not expose ${options.cdpUrl} after launch: ${lastError?.message ?? 'timeout'}`);
}

class CdpSession {
  constructor(webSocketDebuggerUrl) {
    this.socket = new WebSocket(webSocketDebuggerUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.opened = new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id == null) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
    this.socket.addEventListener('close', () => {
      for (const pending of this.pending.values()) pending.reject(new Error('DevTools socket closed'));
      this.pending.clear();
    });
  }

  async call(method, params = {}) {
    await this.opened;
    const id = this.nextId;
    this.nextId += 1;
    const result = new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
    this.socket.send(JSON.stringify({ id, method, params }));
    return result;
  }

  async evaluate(expression) {
    const result = await this.call('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (result.exceptionDetails) {
      const detail = result.exceptionDetails.exception?.description ?? result.exceptionDetails.text;
      throw new Error(`Grok Bot evaluation failed: ${detail}`);
    }
    return result.result?.value;
  }

  close() {
    this.socket.close();
  }
}

async function targets(cdpUrl) {
  const rows = await fetchJson(`${cdpUrl.replace(/\/$/u, '')}/json/list`);
  if (!Array.isArray(rows)) throw new Error('DevTools target list was not an array');
  return rows.filter((row) => row.type === 'page' && typeof row.webSocketDebuggerUrl === 'string');
}

async function grokBotMain(cdpUrl) {
  for (const target of await targets(cdpUrl)) {
    if (target.url.includes('desktop-mount')) continue;
    const session = new CdpSession(target.webSocketDebuggerUrl);
    try {
      const isMain = await session.evaluate(`(() =>
        document.title === 'Grok Bot'
        && document.querySelector('[data-agent-id]') != null
        && document.querySelector('[contenteditable="true"][role="textbox"][aria-label="Prompt"]') != null
      )()`);
      if (isMain) return { target, session };
    } catch {
      // A non-GrokBot page may reject evaluation; keep looking.
    }
    session.close();
  }
  return null;
}

async function waitForComposer(session, agentId, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const ready = await session.evaluate(`(() => {
      const active = document.querySelector('[data-agent-id][aria-current="page"]');
      const composer = document.querySelector('[contenteditable="true"][role="textbox"][aria-label="Prompt"]');
      return active?.getAttribute('data-agent-id') === ${JSON.stringify(agentId)} && composer != null;
    })()`);
    if (ready) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Grok Bot composer did not open for agent ${agentId}`);
}

async function liveRunningAgentIds(cdpUrl) {
  const main = await grokBotMain(cdpUrl);
  if (!main) throw new Error('Grok Bot main renderer is unavailable');
  try {
    const ids = await main.session.evaluate(`Array.from(document.querySelectorAll('[data-agent-id]'))
      .filter((button) => button.querySelector('[data-grok-state="working"], [data-status="working"]') != null)
      .map((button) => button.getAttribute('data-agent-id'))
      .filter(Boolean)`);
    if (!Array.isArray(ids)) throw new Error('Grok Bot returned an invalid live worker-state payload');
    return new Set(ids);
  } finally {
    main.session.close();
  }
}

export function capacityLimitMessage(alerts) {
  if (!Array.isArray(alerts)) throw new Error('Grok Bot capacity alerts were not an array');
  const message = alerts
    .map((alert) => String(alert ?? '').replace(/\s+/gu, ' ').trim())
    .find((alert) => /(?:weekly|usage)\s+limit\s+reached/iu.test(alert));
  return message || null;
}

async function liveCapacityLimitMessage(cdpUrl) {
  const main = await grokBotMain(cdpUrl);
  if (!main) throw new Error('Grok Bot main renderer is unavailable');
  try {
    const alerts = await main.session.evaluate(`Array.from(document.querySelectorAll('[role="alert"]'))
      .map((node) => node.innerText || node.textContent || '')`);
    return capacityLimitMessage(alerts);
  } finally {
    main.session.close();
  }
}

export function mergeLiveWorkerState(workers, runningAgentIds) {
  return workers.map((worker) => ({
    ...worker,
    isRunning: worker.isRunning || runningAgentIds.has(worker.id),
  }));
}

export async function probe(cdpUrl) {
  const desktopStatusFile = path.join(applicationSupportDirectory(), 'desktop-status.json');
  const desktopStatus = JSON.parse(fs.readFileSync(desktopStatusFile, 'utf8'));
  const version = String(desktopStatus.appVersion ?? '0.0.0').split('.').map(Number);
  if (version.some((part) => !Number.isInteger(part)) || (version[0] ?? 0) === 0 && (version[1] ?? 0) < 61) {
    throw new Error(`Grok Bot ${desktopStatus.appVersion ?? 'unknown'} is too old; version 0.61.0+ is required`);
  }
  if (desktopStatus.signedIn !== true) throw new Error('Grok Bot desktop status says the user is signed out');
  const rows = await targets(cdpUrl);
  const main = await grokBotMain(cdpUrl);
  if (!main) throw new Error('No Grok Bot renderer exposes the durable-agent sidebar and prompt editor');
  const status = {
    reachable: true,
    targets: rows.length,
    appVersion: desktopStatus.appVersion,
    mainTargetId: main.target.id,
    mainUrl: main.target.url,
  };
  main.session.close();
  return status;
}

export async function dispatchPrompt(cdpUrl, worker, prompt) {
  const main = await grokBotMain(cdpUrl);
  if (!main) throw new Error('Grok Bot main renderer is unavailable');
  try {
    const selected = await main.session.evaluate(`(() => {
      const button = document.querySelector('[data-agent-id="${worker.id}"]');
      if (!(button instanceof HTMLButtonElement)) return false;
      button.click();
      return true;
    })()`);
    if (!selected) throw new Error(`Grok Bot agent ${worker.id} is absent from the sidebar`);
    await waitForComposer(main.session, worker.id);
    const focused = await main.session.evaluate(`(() => {
      const composer = document.querySelector('[contenteditable="true"][role="textbox"][aria-label="Prompt"]');
      if (!(composer instanceof HTMLElement)) return false;
      composer.focus();
      return document.activeElement === composer;
    })()`);
    if (!focused) throw new Error(`Grok Bot composer could not be focused for ${worker.worker}`);
    await main.session.call('Input.insertText', { text: prompt });
    await main.session.call('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: 'Enter',
      code: 'Enter',
      windowsVirtualKeyCode: 13,
      nativeVirtualKeyCode: 36,
    });
    await main.session.call('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'Enter',
      code: 'Enter',
      windowsVirtualKeyCode: 13,
      nativeVirtualKeyCode: 36,
    });
    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const submitted = await main.session.evaluate(`(() => {
        const composer = document.querySelector('[contenteditable="true"][role="textbox"][aria-label="Prompt"]');
        const active = document.querySelector('[data-agent-id][aria-current="page"]');
        return active?.getAttribute('data-agent-id') === ${JSON.stringify(worker.id)}
          && (composer?.innerText ?? '').trim() === '';
      })()`);
      if (submitted) return;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    throw new Error(`Grok Bot did not accept the prompt for ${worker.worker}`);
  } finally {
    main.session.close();
  }
}

export function workersEligibleForDispatch(workers, state, { force, cooldownMs, now = Date.now() }) {
  return workers.filter((worker) => {
    if (!force && worker.isRunning) return false;
    const lastDispatchAt = Number(state.workers?.[worker.worker]?.lastDispatchAt ?? 0);
    return force || now - lastDispatchAt >= cooldownMs;
  });
}

async function dispatchCycle(options) {
  await ensureGrokBot(options);
  await probe(options.cdpUrl);
  const capacityMessage = await liveCapacityLimitMessage(options.cdpUrl);
  if (capacityMessage) throw new Error(`Grok Bot capacity unavailable: ${capacityMessage}`);
  const workers = mergeLiveWorkerState(
    readRosterWorkers(),
    await liveRunningAgentIds(options.cdpUrl),
  );
  const state = readState();
  state.workers ??= {};
  const eligible = workersEligibleForDispatch(workers, state, options);
  for (const worker of eligible) {
    await dispatchPrompt(options.cdpUrl, worker, workerPrompt(worker.worker));
    state.workers[worker.worker] = {
      agentId: worker.id,
      lastDispatchAt: Date.now(),
      lastActivityAtSeen: worker.lastActivityAt,
    };
    writeState(state);
    console.log(`Dispatched ${worker.worker} (${worker.id})`);
  }
  console.log(`Cycle complete: dispatched=${eligible.length}, running=${workers.filter((row) => row.isRunning).length}`);
  return { workers, eligible };
}

async function daemon(options) {
  console.log(`Grok Bot headless dispatcher active on ${options.cdpUrl}`);
  for (;;) {
    const startedAt = Date.now();
    try {
      await dispatchCycle(options);
    } catch (error) {
      console.error(`${new Date().toISOString()} dispatch cycle failed: ${error.stack ?? error}`);
    }
    const delay = Math.max(250, options.intervalMs - (Date.now() - startedAt));
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.command === 'help') {
    console.log(usage());
    return;
  }
  if (options.command === 'probe') {
    const status = await probe(options.cdpUrl);
    const workers = mergeLiveWorkerState(
      readRosterWorkers(),
      await liveRunningAgentIds(options.cdpUrl),
    );
    console.log(JSON.stringify({ ...status, workers }, null, 2));
    return;
  }
  if (options.command === 'once') {
    await dispatchCycle(options);
    return;
  }
  await daemon(options);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(error.stack ?? error);
    process.exitCode = 1;
  });
}
