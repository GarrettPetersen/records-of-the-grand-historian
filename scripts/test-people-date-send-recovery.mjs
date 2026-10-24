import assert from 'node:assert/strict';
import test from 'node:test';
import { cursorDateWorker } from './lib/people-date-worker.mjs';
import { sendCursorAgentWhenReady } from './lib/cursor-run-wait.mjs';
import { createRunControl } from './lib/cursor-run-control.mjs';

function harness({ failure, oldRun = false, ambiguousRuns = 1, listRuns, timeoutMs = 1000 } = {}) {
  let sends = 0, finished = false;
  let lists = 0;
  const control = createRunControl();
  const prior = { id: 'old-run', status: 'completed' };
  const runs = oldRun ? [prior] : [];
  const run = { id: 'accepted-run', status: 'running' };
  const agent = {
    agentId: 'offline-agent',
    async send() {
      sends++;
      runs.unshift(run);
      if (ambiguousRuns > 1) runs.unshift({ id: 'unexpected-second-run', status: 'running' });
      if (failure === 'lost-response') return new Promise(() => {});
      if (failure === 'conflict') throw new Error('[agent_id_conflict] An agent with this agentId already exists.');
      if (failure === 'network') throw new Error('fetch failed');
      return run;
    },
    async listArtifacts() { return finished ? [{ path: 'date-audit-job.json' }] : []; },
    async downloadArtifact() { return Buffer.from(JSON.stringify({ complete: true })); },
  };
  const client = {
    async create() { return agent; },
    async resume() { return agent; },
    async listRuns() {
      lists++;
      return listRuns ? listRuns({ call: lists, runs, control }) : { items: [...runs] };
    },
    async getUsage() { return { usage: { totalTokens: 100 }, cost: { rawCostCents: 1 } }; },
  };
  const task = {
    key: 'audit-job', kind: 'review', state: oldRun ? { agentId: agent.agentId, sent: true } : {},
    packet: { book: 'jinshu', chapter: '086' }, job: { id: 'audit-job' },
    async save() {},
  };
  const worker = cursorDateWorker({
    apiKey: 'offline-test', model: 'offline-model', maxWorkerBytes: 262144,
    timeoutMs, async saveRemoteJob() {},
  }, control, {
    Agent: client,
    send: (a, message, options) => sendCursorAgentWhenReady(a, message, {
      ...options, readTimeoutMs: 5, initialDelayMs: 1, maxDelayMs: 1,
    }),
    async wait(accepted) {
      assert.equal(accepted.id, 'accepted-run');
      finished = true;
      accepted.status = 'completed';
      return accepted;
    },
  });
  return { run: () => worker(task), task, control, sends: () => sends };
}

test('lost send acknowledgement reconnects to the accepted run without another dispatch', async () => {
  const h = harness({ failure: 'lost-response' });
  await h.run();
  assert.equal(h.sends(), 1);
  assert.equal(h.task.state.runId, 'accepted-run');
});

test('agent-id conflict after acceptance recovers the exact new run', async () => {
  const h = harness({ failure: 'conflict' });
  await h.run();
  assert.equal(h.sends(), 1);
  assert.equal(h.task.state.runId, 'accepted-run');
});

test('a retained historical run cannot satisfy the new continuation', async () => {
  const h = harness({ oldRun: true });
  await h.run();
  assert.equal(h.sends(), 1);
  assert.equal(h.task.state.runId, 'accepted-run');
});

test('multiple unexpected accepted runs fail without dispatching again', async () => {
  const h = harness({ failure: 'conflict', ambiguousRuns: 2 });
  await assert.rejects(h.run(), /Multiple unexpected date runs/);
  assert.equal(h.sends(), 1);
});

test('an abandoned lookup cannot dispatch after another lookup recovers the run', async () => {
  let release;
  const h = harness({ failure: 'conflict', listRuns: ({ call, runs }) => {
    if (call === 1) return new Promise(resolve => { release = resolve; });
    return { items: [...runs] };
  } });
  await h.run();
  assert.equal(h.sends(), 1);
  release({ items: [] });
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(h.sends(), 1);
});

test('abandoned lookups cannot dispatch after the overall timeout', async () => {
  const releases = [];
  const h = harness({ failure: 'conflict', timeoutMs: 20,
    listRuns: () => new Promise(resolve => releases.push(resolve)),
  });
  await assert.rejects(h.run(), /timed out/);
  for (const release of releases) release({ items: [] });
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(h.sends(), 1);
});

test('stop during reconciliation drains the accepted run without another dispatch', async () => {
  const h = harness({ failure: 'conflict', listRuns: ({ runs, control }) => {
    control.stopRequested = true;
    return { items: [...runs] };
  } });
  await h.run();
  assert.equal(h.sends(), 1);
});

test('temporarily empty reconciliation waits for accepted work without resending', async () => {
  const h = harness({ failure: 'lost-response', listRuns: ({ call, runs }) => ({
    items: call === 1 ? [] : [...runs],
  }) });
  await h.run();
  assert.equal(h.sends(), 1);
  assert.equal(h.task.state.runId, 'accepted-run');
});

test('native rejection with temporarily empty reconciliation cannot repeat dispatch', async () => {
  const h = harness({ failure: 'network', listRuns: ({ call, runs }) => ({
    items: call === 1 ? [] : [...runs],
  }) });
  await h.run();
  assert.equal(h.sends(), 1);
});
