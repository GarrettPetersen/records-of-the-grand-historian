import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { assertFreeModel, openRouterFreeJson, openRouterFreeCompletion } from './lib/openrouter-free.mjs';
import { openRouterDateWorker } from './lib/people-date-worker.mjs';

const catalog = { data: [{ id: 'fixture/model:free', pricing: { prompt: '0', completion: '0' },
  top_provider: { max_completion_tokens: 2048 } }] };
const reply = (body, status = 200) => ({ ok: status === 200, status, headers: { get: () => null }, json: async () => body });

test('rejects paid, missing, and unverified models before inference', () => {
  assert.equal(assertFreeModel('fixture/model:free', catalog).id, 'fixture/model:free');
  assert.throws(() => assertFreeModel('fixture/model', catalog), /free/);
  assert.throws(() => assertFreeModel('missing:free', catalog), /unavailable/);
  assert.throws(() => assertFreeModel('paid:free', { data: [{ id: 'paid:free', pricing: { prompt: '0.01', completion: '0' } }] }), /zero-priced/);
});

test('free completion validates route, JSON, and cost', async () => {
  const fetchImpl = async (url, options) => url.endsWith('/models') ? reply(catalog) :
    reply({ model: 'fixture/model:free', choices: [{ message: { content: '{"ok":true}' } }], usage: { cost: 0 } });
  const result = await openRouterFreeJson({ key: 'fixture', model: 'fixture/model:free', messages: [{ role: 'user', content: 'test' }], maxTokens: 16, fetchImpl });
  assert.deepEqual(result.artifact, { ok: true });
  await assert.rejects(openRouterFreeJson({ key: 'fixture', model: 'fixture/model:free', messages: [{ role: 'user', content: 'test' }], maxTokens: 3000, fetchImpl }), /limit/);
  const bad = async url => url.endsWith('/models') ? reply(catalog) : reply({ model: 'paid/model', choices: [{ message: { content: '{}' } }] });
  await assert.rejects(openRouterFreeJson({ key: 'fixture', model: 'fixture/model:free', messages: [{ role: 'user', content: 'test' }], maxTokens: 16, fetchImpl: bad }), /unexpected model/);
});

test('tool completion keeps reasoning and tool calls enabled', async () => {
  let sent;
  const fetchImpl = async (url, options) => {
    if (url.endsWith('/models')) return reply(catalog);
    sent = JSON.parse(options.body);
    return reply({ model: 'fixture/model:free', choices: [{ finish_reason: 'tool_calls', message: { tool_calls: [] } }], usage: { cost: 0 } });
  };
  await openRouterFreeCompletion({ key: 'fixture', model: 'fixture/model:free', messages: [{ role: 'user', content: 'test' }],
    tools: [{ type: 'function', function: { name: 'ping', parameters: { type: 'object', properties: {} } } }], maxTokens: 16, fetchImpl });
  assert.equal(sent.reasoning.enabled, true);
  assert.equal(sent.tools[0].function.name, 'ping');
  assert.equal(sent.response_format, undefined);
});

test('date worker checkpoints artifact and separates reviewer identity', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'openrouter-date-test-'));
  try {
    const state = {};
    let calls = 0;
    const worker = openRouterDateWorker({ key: 'fixture', model: 'fixture/model:free', maxWorkerBytes: 100000,
      timeoutMs: 1000, saveRemoteJob: async () => {}, request: async ({ onResponse }) => {
        calls++;
        const response = { model: 'fixture/model:free', choices: [{ finish_reason: 'tool_calls', message: {
          role: 'assistant', content: null, tool_calls: [{ id: 'call-1', type: 'function', function: {
            name: 'finish_date', arguments: JSON.stringify({ summary: 'Every assigned source unit was checked.', blocked: false, reason: '' }),
          } }],
        } }] };
        await onResponse(response);
        return response;
      } });
    const task = { kind: 'review', key: 'audit-0-001', job: { book: 'fixture', chapter: '001', id: 'job-001',
      sourceHash: 'sha256:source', extractionHash: 'sha256:extraction', ownedUnits: [], ownedItems: [], ownedPeople: [], units: [] },
      directory, state, save: async patch => Object.assign(state, patch) };
    const artifact = await worker(task);
    assert.equal(artifact.reviewer.independentOfExtractor, true);
    assert.equal(artifact.reviewer.agentId, 'openrouter:fixture/model:free:review:audit-0-001');
    assert.equal((await worker(task)).summary, 'Every assigned source unit was checked.');
    assert.equal(calls, 1);
    assert.equal(fs.readdirSync(directory).length, 2);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
