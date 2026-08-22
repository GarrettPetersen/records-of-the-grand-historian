import { Agent } from '@cursor/sdk';

const LOST_STREAM = /run stream is no longer available/iu;
const AGENT_BUSY = /(?:\[agent_busy\]|agent already has an active run)/iu;
const RATE_LIMIT = /(?:exceeded (?:the )?rate limit|rate limit exceeded|\b429\b)/iu;
const RATE_LIMIT_MINUTE = /requests per minute/iu;
const RATE_LIMIT_HOUR = /requests per hour/iu;
const TRANSIENT_READ = /(?:service unavailable|temporarily unavailable|fetch failed|econnreset|etimedout|socket hang up)/iu;

export class CursorRunLimitExceededError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'CursorRunLimitExceededError';
    this.code = 'cursor_run_limit_exceeded';
    this.isRetryable = false;
    Object.assign(this, details);
  }
}

let cursorApiBlockedUntil = 0;
let announcedCursorApiBlockUntil = 0;

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function lostStream(value) {
  return LOST_STREAM.test(value instanceof Error ? value.message : String(value ?? ''));
}

function errorText(value) {
  return value instanceof Error ? value.message : String(value ?? '');
}

export function isCursorRateLimited(error) {
  return error?.status === 429 || error?.statusCode === 429 || RATE_LIMIT.test(errorText(error));
}

export function cursorRateLimitDelayMs(error, options = {}) {
  const message = errorText(error);
  if (RATE_LIMIT_HOUR.test(message)) return options.hourDelayMs ?? 61 * 60 * 1000;
  if (RATE_LIMIT_MINUTE.test(message)) return options.minuteDelayMs ?? 65 * 1000;
  return options.defaultDelayMs ?? 65 * 1000;
}

function isTransientCursorRead(error) {
  return error?.isRetryable === true || TRANSIENT_READ.test(errorText(error));
}

function blockCursorApiFor(delayMs, label, reason) {
  const blockedUntil = Date.now() + delayMs;
  cursorApiBlockedUntil = Math.max(cursorApiBlockedUntil, blockedUntil);
  if (cursorApiBlockedUntil > announcedCursorApiBlockUntil) {
    announcedCursorApiBlockUntil = cursorApiBlockedUntil;
    console.warn(
      `${label ?? 'Cursor API'}: ${reason}; pausing shared Cursor requests for ` +
      `${Math.ceil(delayMs / 1000)}s`,
    );
  }
}

async function waitForCursorApiCooldown() {
  while (Date.now() < cursorApiBlockedUntil) {
    await sleep(cursorApiBlockedUntil - Date.now());
  }
}

export function isCursorAgentBusy(error) {
  return error?.code === 'agent_busy' || AGENT_BUSY.test(
    error instanceof Error ? error.message : String(error ?? ''),
  );
}

export async function sendCursorAgentWhenReady(agent, prompt, options = {}) {
  const timeoutMs = options.timeoutMs ?? 45 * 60 * 1000;
  const maxDelayMs = options.maxDelayMs ?? 2 * 60 * 1000;
  const deadline = Date.now() + timeoutMs;
  let delayMs = options.initialDelayMs ?? 1000;

  while (true) {
    await waitForCursorApiCooldown();
    try {
      return await agent.send(prompt);
    } catch (error) {
      if (Date.now() >= deadline) throw error;
      if (isCursorRateLimited(error)) {
        blockCursorApiFor(
          cursorRateLimitDelayMs(error, options),
          options.label,
          'rate limit reached',
        );
        continue;
      }
      if (isCursorAgentBusy(error)) {
        console.warn(
          `${options.label ?? 'Cursor agent'}: previous run is still releasing; ` +
          `retrying send in ${delayMs}ms`,
        );
        await sleep(delayMs);
        delayMs = Math.min(Math.max(delayMs * 2, 1), maxDelayMs);
        continue;
      }
      throw error;
    }
  }
}

function terminalResult(run) {
  return {
    id: run.id,
    requestId: run.requestId,
    status: run.status,
    result: run.result,
    error: run.error,
    model: run.model,
    durationMs: run.durationMs,
    git: run.git,
    usage: run.usage,
  };
}

async function cancelRunForLimit(run, options, error) {
  try {
    if (options.cancelRun) await options.cancelRun(run);
    else if (run.supports('cancel')) await run.cancel();
    else {
      await Agent.cancelRun(run.id, {
        runtime: 'cloud',
        agentId: options.agentId,
        apiKey: options.apiKey,
      });
    }
  } catch (cancelError) {
    error.message += `; cancellation also failed: ${errorText(cancelError)}`;
    error.cancelError = cancelError;
  }
  throw error;
}

async function enforceRunLimits(run, options) {
  const maxRawCostCents = options.maxRawCostCents ?? null;
  const maxTotalTokens = options.maxTotalTokens ?? null;
  if (maxRawCostCents === null && maxTotalTokens === null) return;

  const readUsage = options.readUsage ?? (() => Agent.getUsage(options.agentId, {
    apiKey: options.apiKey,
    runId: run.id,
  }));
  const billed = await readUsage(run);
  const totalTokens = Math.max(
    billed?.usage?.totalTokens ?? 0,
    run.usage?.totalTokens ?? 0,
  );
  const rawCostCents = billed?.cost?.rawCostCents ?? null;

  if (maxTotalTokens !== null && totalTokens >= maxTotalTokens) {
    await cancelRunForLimit(run, options, new CursorRunLimitExceededError(
      `${options.label}: cancelled cloud run ${run.id} at ` +
      `${totalTokens.toLocaleString('en-US')} tokens (limit ` +
      `${maxTotalTokens.toLocaleString('en-US')})`,
      { metric: 'tokens', observed: totalTokens, limit: maxTotalTokens },
    ));
  }
  if (maxRawCostCents !== null && rawCostCents !== null && rawCostCents >= maxRawCostCents) {
    await cancelRunForLimit(run, options, new CursorRunLimitExceededError(
      `${options.label}: cancelled cloud run ${run.id} at $${(rawCostCents / 100).toFixed(2)} ` +
      `raw usage cost (limit $${(maxRawCostCents / 100).toFixed(2)})`,
      { metric: 'raw-cost', observed: rawCostCents, limit: maxRawCostCents },
    ));
  }
}

export async function waitForCursorRun(run, options) {
  const timeoutMs = options.timeoutMs ?? 90 * 60 * 1000;
  const pollMs = options.pollMs ?? 30 * 1000;
  const deadline = Date.now() + timeoutMs;
  let streamOutcome;
  const streamWait = run.wait().then(
    (result) => { streamOutcome = { result }; },
    (error) => { streamOutcome = { error }; },
  );
  let announcedPolling = false;
  let usageReadFailures = 0;

  while (Date.now() < deadline) {
    if (streamOutcome) await sleep(pollMs);
    else await Promise.race([streamWait, sleep(pollMs)]);
    if (streamOutcome?.result && !(
      streamOutcome.result.status === 'error' && lostStream(streamOutcome.result.error?.message)
    )) {
      return streamOutcome.result;
    }
    if (
      streamOutcome?.error &&
      !lostStream(streamOutcome.error) &&
      !isTransientCursorRead(streamOutcome.error) &&
      !isCursorRateLimited(streamOutcome.error)
    ) {
      throw streamOutcome.error;
    }
    try {
      await enforceRunLimits(run, options);
      usageReadFailures = 0;
    } catch (error) {
      if (error instanceof CursorRunLimitExceededError) throw error;
      usageReadFailures += 1;
      const maximum = options.maxUsageReadFailures ?? 3;
      if (usageReadFailures >= maximum) {
        await cancelRunForLimit(run, options, new CursorRunLimitExceededError(
          `${options.label}: cancelled cloud run ${run.id} because usage monitoring failed ` +
          `${usageReadFailures} consecutive times: ${errorText(error)}`,
          { metric: 'usage-monitor', observed: usageReadFailures, limit: maximum, cause: error },
        ));
      }
      console.warn(
        `${options.label}: usage monitor read failed ${usageReadFailures}/${maximum}; ` +
        `${errorText(error)}`,
      );
    }
    if (streamOutcome && !announcedPolling) {
      console.warn(`${options.label}: SDK stream was lost; polling cloud run ${run.id}`);
      announcedPolling = true;
    }
    await waitForCursorApiCooldown();
    let refreshed;
    try {
      refreshed = await Agent.getRun(run.id, {
        runtime: 'cloud',
        agentId: options.agentId,
        apiKey: options.apiKey,
      });
    } catch (error) {
      if (isCursorRateLimited(error)) {
        blockCursorApiFor(
          cursorRateLimitDelayMs(error, options),
          options.label,
          'status-read rate limit reached',
        );
        continue;
      }
      if (isTransientCursorRead(error)) {
        blockCursorApiFor(
          options.transientDelayMs ?? 30 * 1000,
          options.label,
          `transient status-read failure (${errorText(error)})`,
        );
        continue;
      }
      throw error;
    }
    if (refreshed.status === 'running') continue;
    if (!announcedPolling) {
      console.warn(`${options.label}: cloud run finished before its SDK stream closed; accepting terminal status`);
    }
    return terminalResult(refreshed);
  }
  throw new Error(`${options.label}: timed out waiting for cloud run ${run.id}`);
}
