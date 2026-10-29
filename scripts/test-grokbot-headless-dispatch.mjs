import assert from 'node:assert/strict';
import test from 'node:test';

import {
  capacityLimitMessage,
  isExactWorkerSearchResult,
  parseArgs,
  mergeLiveWorkerState,
  observeWorkerActivity,
  rosterWorkersFromDocuments,
  workerPrompt,
  workersEligibleForDispatch,
  workersToDispatch,
} from './grokbot-headless-dispatch.mjs';

function rosterRows() {
  return Array.from({ length: 12 }, (_, index) => ({
    id: `agent-${index + 24}`,
    name: `24 Histories Glossary ${index + 24}`,
    isRunning: index === 0,
    lastActivityAt: 1000 + index,
  }));
}

test('parses only a loopback DevTools endpoint', () => {
  assert.equal(parseArgs(['once', '--cdp-url', 'http://127.0.0.1:9333']).cdpUrl, 'http://127.0.0.1:9333');
  assert.equal(parseArgs(['daemon', '--launch-app']).launchApp, true);
  assert.equal(parseArgs(['daemon']).maxActive, 1);
  assert.throws(() => parseArgs(['once', '--force']), /Unknown option/);
  assert.throws(() => parseArgs(['once', '--cdp-url', 'http://0.0.0.0:9333']), /loopback-only/u);
});

test('loads all twelve durable worker identities and fails on gaps', () => {
  const workers = rosterWorkersFromDocuments([{ value: { rows: rosterRows() } }]);
  assert.equal(workers.length, 12);
  assert.equal(workers[0].worker, 'grokbot-24');
  assert.equal(workers[11].id, 'agent-35');
  assert.throws(
    () => rosterWorkersFromDocuments([{ value: { rows: rosterRows().slice(1) } }]),
    /Missing durable Grok Bot agents: grokbot-24/u,
  );
});

test('preserves the stable conversation ID when the sidebar differs after recovery', () => {
  const rows = rosterWorkersFromDocuments([{ value: { rows: rosterRows() } }]);
  const merged = mergeLiveWorkerState(rows, new Set(['original-conversation']), { workers: { 'grokbot-31': { agentId: 'original-conversation' } } });
  const worker = merged.find(row => row.worker === 'grokbot-31');
  assert.equal(worker.id, 'original-conversation');
  assert.equal(worker.isRunning, true);
});

test('idle selection respects running state and cooldown', () => {
  const workers = mergeLiveWorkerState(
    rosterWorkersFromDocuments([{ value: { rows: rosterRows() } }]),
    new Set(['agent-26']),
  );
  const state = { workers: { 'grokbot-25': { lastDispatchAt: 9_500 } } };
  const eligible = workersEligibleForDispatch(workers, state, {
    force: false,
    cooldownMs: 1000,
    now: 10_000,
  });
  assert.equal(eligible.some((row) => row.worker === 'grokbot-24'), false);
  assert.equal(eligible.some((row) => row.worker === 'grokbot-25'), false);
  assert.equal(eligible.some((row) => row.worker === 'grokbot-26'), false);
  assert.equal(eligible.some((row) => row.worker === 'grokbot-27'), true);
});

test('observed activity holds an idle-looking worker quiet instead of interrupting it', () => {
  const workers = mergeLiveWorkerState(
    rosterWorkersFromDocuments([{ value: { rows: rosterRows() } }]),
    new Set(),
  );
  const worker = workers.find((row) => row.worker === 'grokbot-25');
  worker.lastActivityAt = 9_900;
  const state = {
    workers: {
      'grokbot-25': { lastDispatchAt: 8_000, lastActivityAtSeen: 9_000 },
    },
  };
  assert.equal(observeWorkerActivity(workers, state, 10_000), true);
  assert.equal(state.workers['grokbot-25'].lastObservedActivityAt, 9_900);
  assert.equal(observeWorkerActivity(workers, state, 10_001), false);
  assert.equal(
    workersEligibleForDispatch(workers, state, {
      force: false,
      cooldownMs: 1_000,
      activityQuietMs: 30_000,
      now: 20_000,
    }).some((row) => row.worker === 'grokbot-25'),
    false,
  );
  assert.equal(
    workersEligibleForDispatch(workers, state, {
      force: false,
      cooldownMs: 1_000,
      activityQuietMs: 30_000,
      now: 40_000,
    }).some((row) => row.worker === 'grokbot-25'),
    true,
  );
});
test('a delayed observation of old activity does not create a fresh quiet period',()=>{
 const worker={worker:'grokbot-24',id:'agent-24',isRunning:false,lastActivityAt:1000},state={workers:{'grokbot-24':{lastDispatchAt:500,lastActivityAtSeen:500}}};
 assert.equal(observeWorkerActivity([worker],state,100_000),true);
 assert.equal(state.workers['grokbot-24'].lastObservedActivityAt,1000);
 assert.equal(workersEligibleForDispatch([worker],state,{now:100_000,cooldownMs:1000,activityQuietMs:30_000}).length,1);
 worker.isRunning=true;assert.equal(workersEligibleForDispatch([worker],state,{now:100_000,cooldownMs:1000,activityQuietMs:30_000}).length,0);
});

test('active-worker ceiling prevents a new dispatch burst after partial completion', () => {
  const workers = rosterWorkersFromDocuments([{ value: { rows: rosterRows() } }]);
  const selected = workersToDispatch(workers, { workers: {} }, {
    force: false,
    cooldownMs: 0,
    maxActive: 2,
    now: 10_000,
  });
  // Worker 24 is already running, so the two-worker cap leaves one slot only.
  assert.deepEqual(selected.map((worker) => worker.worker), ['grokbot-25']);
});

test('recovery allowlist dispatches only established workers', () => {
  const selected = workersToDispatch(
    rosterWorkersFromDocuments([{ value: { rows: rosterRows() } }]),
    { workers: {} },
    {
      force: false,
      cooldownMs: 0,
      maxActive: 12,
      now: 10_000,
      workers: new Set(['grokbot-26', 'grokbot-35']),
    },
  );
  assert.deepEqual(selected.map((worker) => worker.worker), ['grokbot-26', 'grokbot-35']);
  assert.throws(() => parseArgs(['once', '--workers', 'grokbot-23']), /grokbot-24 through grokbot-35/u);
});

test('recognizes the visible weekly-capacity alert before prompting more workers', () => {
  assert.equal(
    capacityLimitMessage(['Weekly usage limit reached. It resets in 1 day.']),
    'Weekly usage limit reached. It resets in 1 day.',
  );
  assert.equal(capacityLimitMessage(['You’re at 90% of your weekly usage limit.']), null);
  assert.equal(capacityLimitMessage([]), null);
});

test('ignores a hidden historic capacity alert', () => {
  assert.equal(
    capacityLimitMessage([
      { text: 'Weekly usage limit reached. It resets in 6 days.', visible: false },
      { text: 'Welcome back.', visible: true },
    ]),
    null,
  );
});

test('search fallback accepts only a button with the exact durable worker ID', () => {
  const worker = { id: 'agent-24', name: '24 Histories Glossary 24' };
  assert.equal(isExactWorkerSearchResult({ agentId: 'agent-24', tagName: 'BUTTON' }, worker), true);
  assert.equal(isExactWorkerSearchResult({ agentId: 'agent-240', tagName: 'BUTTON' }, worker), false);
  assert.equal(isExactWorkerSearchResult({ agentId: 'agent-24', tagName: 'DIV' }, worker), false);
  assert.equal(isExactWorkerSearchResult({ agentId: 'agent-24' }, worker), false);
  assert.equal(isExactWorkerSearchResult(null, worker), false);
});

test('worker prompt requires exact approved work and never asks an agent to find work', () => {
  assert.throws(() => workerPrompt('grokbot-31'), /assignment/);
  const prompt = workerPrompt('grokbot-31', { id: 'fixture', worker: 'grokbot-31', book: 'jinshu', chapter: '053', claimToken: 'fixture-scoped-token', chunks: [{ id: '001' }] });
  assert.match(prompt, /Do not call resume_or_claim/u);
  assert.match(prompt, /ONLY jinshu\/053, chunks 001/u);
  assert.match(prompt, /grokbot-31/u);
  assert.match(prompt, /submit-chunk/u);
  assert.match(prompt, /Do not use Cursor SDK/u);
  assert.match(prompt, /host owns finalization/u);
  assert.match(prompt, /MCP-only remote computers need no repository checkout/u);
  assert.doesNotMatch(prompt, /resume --worker/u);
});
