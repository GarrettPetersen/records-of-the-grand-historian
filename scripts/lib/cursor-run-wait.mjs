import { Agent } from '@cursor/sdk';

const LOST_STREAM = /run stream is no longer available/iu;

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function lostStream(value) {
  return LOST_STREAM.test(value instanceof Error ? value.message : String(value ?? ''));
}

export async function waitForCursorRun(run, options) {
  let initial;
  try {
    initial = await run.wait();
  } catch (error) {
    if (!lostStream(error)) throw error;
  }
  if (initial && !(initial.status === 'error' && lostStream(initial.error?.message))) return initial;

  const timeoutMs = options.timeoutMs ?? 15 * 60 * 1000;
  const pollMs = options.pollMs ?? 5000;
  const deadline = Date.now() + timeoutMs;
  console.warn(`${options.label}: SDK stream was lost; polling cloud run ${run.id}`);
  while (Date.now() < deadline) {
    await sleep(pollMs);
    const refreshed = await Agent.getRun(run.id, {
      runtime: 'cloud',
      agentId: options.agentId,
      apiKey: options.apiKey,
    });
    if (refreshed.status === 'running') continue;
    return refreshed.wait();
  }
  throw new Error(`${options.label}: timed out polling cloud run ${run.id} after a lost SDK stream`);
}
