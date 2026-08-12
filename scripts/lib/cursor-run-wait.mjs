import { Agent } from '@cursor/sdk';

const LOST_STREAM = /run stream is no longer available/iu;

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function lostStream(value) {
  return LOST_STREAM.test(value instanceof Error ? value.message : String(value ?? ''));
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

export async function waitForCursorRun(run, options) {
  const timeoutMs = options.timeoutMs ?? 45 * 60 * 1000;
  const pollMs = options.pollMs ?? 5000;
  const deadline = Date.now() + timeoutMs;
  let streamOutcome;
  const streamWait = run.wait().then(
    (result) => { streamOutcome = { result }; },
    (error) => { streamOutcome = { error }; },
  );
  let announcedPolling = false;

  while (Date.now() < deadline) {
    if (streamOutcome) await sleep(pollMs);
    else await Promise.race([streamWait, sleep(pollMs)]);
    if (streamOutcome?.result && !(
      streamOutcome.result.status === 'error' && lostStream(streamOutcome.result.error?.message)
    )) {
      return streamOutcome.result;
    }
    if (streamOutcome?.error && !lostStream(streamOutcome.error)) throw streamOutcome.error;
    if (streamOutcome && !announcedPolling) {
      console.warn(`${options.label}: SDK stream was lost; polling cloud run ${run.id}`);
      announcedPolling = true;
    }
    const refreshed = await Agent.getRun(run.id, {
      runtime: 'cloud',
      agentId: options.agentId,
      apiKey: options.apiKey,
    });
    if (refreshed.status === 'running') continue;
    if (!announcedPolling) {
      console.warn(`${options.label}: cloud run finished before its SDK stream closed; accepting terminal status`);
    }
    return terminalResult(refreshed);
  }
  throw new Error(`${options.label}: timed out waiting for cloud run ${run.id}`);
}
