import assert from 'node:assert/strict';
import test from 'node:test';

import {
  capacityLimitMessage,
  parseArgs,
  mergeLiveWorkerState,
  rosterWorkersFromDocuments,
  workerPrompt,
  workersEligibleForDispatch,
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

test('recognizes the visible weekly-capacity alert before prompting more workers', () => {
  assert.equal(
    capacityLimitMessage(['Weekly usage limit reached. It resets in 1 day.']),
    'Weekly usage limit reached. It resets in 1 day.',
  );
  assert.equal(capacityLimitMessage(['You’re at 90% of your weekly usage limit.']), null);
  assert.equal(capacityLimitMessage([]), null);
});

test('campaign prompt binds the worker and MCP workflow', () => {
  const prompt = workerPrompt('grokbot-31');
  assert.match(prompt, /resume_or_claim/u);
  assert.match(prompt, /grokbot-31/u);
  assert.match(prompt, /submit-chunk/u);
  assert.match(prompt, /24histories-people finalize/u);
  assert.match(prompt, /not Cursor SDK/u);
});
