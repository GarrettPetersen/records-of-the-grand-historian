import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { inputFingerprint, validateDispatchJobs, readDispatchJobs, dispatchApprovedWork, pendingDispatchJobs, dispatchMcpEnvironment } from './lib/grokbot-dispatch-work.mjs';
import { workersToDispatch } from './grokbot-headless-dispatch.mjs';

const NOW = Date.parse('2026-10-27T12:00:00Z');
const packet = { units: [{ id: 'u1', chinese: '甲' }] }, draft = { people: [] };
const job = () => ({ id: 'owned-chunk-001', worker: 'grokbot-31', book: 'jinshu', chapter: '053',
  issuedAt: new Date(NOW).toISOString(), expiresAt: new Date(NOW + 3600000).toISOString(),
  claimToken: 'fixturePayload0123456789.fixtureSignature0123456789',
  chunks: [{ id: '001', packetFingerprint: inputFingerprint(packet), draftFingerprint: inputFingerprint(draft) }] });

test('host MCP client loads only its authorized credential and pins the destination', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grok-dispatch-auth-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, '.env');
  fs.writeFileSync(file, 'OTHER_KEY=must-not-load\nGROKBOT_MCP_AUTH_TOKEN="fixture-only-bearer"\n', { mode: 0o600 });
  const env = dispatchMcpEnvironment(file, { GROKBOT_MCP_URL: 'https://wrong.invalid' });
  assert.equal(env.GROKBOT_MCP_AUTH_TOKEN, 'fixture-only-bearer');
  assert.equal(env.GROKBOT_MCP_URL, 'https://grokbot-mcp.24histories.com/mcp');
  assert.equal(env.OTHER_KEY, undefined);
  assert.throws(() => dispatchMcpEnvironment(file, { GROKBOT_MCP_AUTH_TOKEN: '' }), /Missing or malformed/);
  fs.chmodSync(file, 0o644);
  assert.throws(() => dispatchMcpEnvironment(file, {}), /owner-only/);
});
function harness(overrides = {}) {
  const events = [];
  const api = { now: () => NOW, assertSafe: () => events.push('safe'), save: () => events.push('save'), wake: async () => events.push('wake'),
    callMcp: async command => {
      events.push(command);
      return command === 'status' ? { worker: 'grokbot-31', claims: [{ chapter: 'jinshu/053', status: 'claimed' }] }
        : { worker: 'grokbot-31', book: 'jinshu', chapter: '053', chunkId: '001', prompt: 'sealed instructions', schema: {}, packet, draft };
    }, ...overrides };
  return { events, api };
}

test('no approved work performs no MCP calls, app start or model wake', async () => {
  const fail = () => assert.fail('idle launcher must not call anything');
  assert.equal(await dispatchApprovedWork([], {}, { callMcp: fail, assertSafe: fail, wake: fail, save: fail }), 0);
});
test('tickets require scoped, bounded, sealed work and valid ownership', t => {
  assert.equal(validateDispatchJobs({ schemaVersion: 1, jobs: [job()] }, NOW).length, 1);
  for (const change of [{ chunks: [] }, { claimToken: 'not a token $(bad)' }, { expiresAt: new Date(NOW + 7200000).toISOString() }, { chapter: '../053' }]) {
    assert.throws(() => validateDispatchJobs({ schemaVersion: 1, jobs: [{ ...job(), ...change }] }, NOW));
  }
  assert.deepEqual(validateDispatchJobs({ schemaVersion: 1, jobs: [job()] }, NOW + 3600001), []);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grok-dispatch-ticket-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'jobs.json');
  assert.deepEqual(readDispatchJobs(file, NOW), []);
  fs.writeFileSync(file, JSON.stringify({ schemaVersion: 1, jobs: [job()] }), { mode: 0o644 });
  assert.throws(() => readDispatchJobs(file, NOW), /owner-only/);
  fs.chmodSync(file, 0o600);
  assert.equal(readDispatchJobs(file, NOW).length, 1);
});
test('ready/submitted claims are completed, not assignments to redispatch', async () => {
  for (const status of ['ready', 'submitted']) {
    const { api, events } = harness({ callMcp: async command => {
      assert.equal(command, 'status'); return { worker: 'grokbot-31', claims: [{ chapter: 'jinshu/053', status }] };
    } });
    assert.equal(await dispatchApprovedWork([job()], {}, api), 0);
    assert.ok(!events.includes('wake'));
  }
});
test('MCP failure, stale fingerprints and missing work never wake an agent', async () => {
  const failed = harness({ callMcp: async () => { throw new Error('MCP down'); } });
  await assert.rejects(dispatchApprovedWork([job()], {}, failed.api), /MCP down/);
  assert.ok(!failed.events.includes('wake'));
  const stale = job(); stale.chunks[0].draftFingerprint = '0'.repeat(64);
  const { api, events } = harness();
  assert.equal(await dispatchApprovedWork([stale], {}, api), 0);
  assert.ok(!events.includes('wake'));
});
test('resources and live sealed work are checked before reservation and wake', async () => {
  const state = {}, { api, events } = harness();
  assert.equal(await dispatchApprovedWork([job()], state, api), 1);
  assert.deepEqual(events, ['safe', 'status', 'safe', 'get-chunk', 'safe', 'save', 'wake', 'save']);
  assert.ok(!JSON.stringify(state).includes(job().claimToken), 'receipts must not store claim credentials');
  assert.equal(await dispatchApprovedWork([{ ...job(), id: 'renamed-ticket' }], state, api), 0, 'renaming the same work must not wake twice');
  const unsafe = harness({ assertSafe: () => { throw new Error('memory pressure'); } });
  await assert.rejects(dispatchApprovedWork([job()], {}, unsafe.api), /memory pressure/);
  assert.deepEqual(unsafe.events, []);
});
test('uncertain delivery preserves its reservation and cannot auto-retry', async () => {
  const state = {}, first = harness({ wake: async () => { throw new Error('connection lost after send'); } });
  await assert.rejects(dispatchApprovedWork([job()], state, first.api), /connection lost/);
  assert.equal(Object.values(state.dispatchJobs)[0].status, 'dispatching');
  const next = harness();
  assert.equal(await dispatchApprovedWork([job()], state, next.api), 0);
  assert.deepEqual(next.events, []);
  const reconciled = { ...job(), id: 'reviewed-retry-002', attempt: 2, retryOf: job().id, retryReason: 'Host verified the previous conversation is terminal after network repair.' };
  assert.equal(await dispatchApprovedWork([reconciled], state, next.api), 1);
  assert.equal(Object.values(state.dispatchJobs)[0].history[0].status, 'dispatching');
});
test('ticket expiry during MCP preparation prevents a late agent call', async () => {
  let time = NOW;
  const h = harness({ now: () => time });
  const original = h.api.callMcp;
  h.api.callMcp = async command => { const result = await original(command); if (command === 'get-chunk') time += 3600001; return result; };
  assert.equal(await dispatchApprovedWork([job()], {}, h.api), 0);
  assert.ok(!h.events.includes('wake'));
});
test('slot selection selects the worker who actually owns approved work', () => {
  const rows = [24, 31].map(n => ({ worker: 'grokbot-' + n, isRunning: false }));
  assert.deepEqual(workersToDispatch(rows, { workers: {} }, { cooldownMs: 0, maxActive: 1, assignedWorkers: new Set(['grokbot-31']) }).map(row => row.worker), ['grokbot-31']);
});

test('already-dispatched tickets cannot starve another worker who has new work', async () => {
  const state = {}, h = harness();
  await dispatchApprovedWork([job()], state, h.api);
  const next = { ...job(), worker: 'grokbot-32', id: 'next-worker-work' };
  const pending = pendingDispatchJobs([job(), next], state);
  const rows = [31, 32].map(n => ({ worker: 'grokbot-' + n, isRunning: false }));
  assert.deepEqual(workersToDispatch(rows, { workers: {} }, { cooldownMs: 0, maxActive: 1, assignedWorkers: new Set(pending.map(j => j.worker)) }).map(row => row.worker), ['grokbot-32']);
});

test('finished or stale tickets are held without repeatedly occupying dispatch slots', async () => {
  const state = {}, h = harness({ callMcp: async () => ({ worker: 'grokbot-31', claims: [{ chapter: 'jinshu/053', status: 'ready' }] }) });
  assert.equal(await dispatchApprovedWork([job()], state, h.api), 0);
  assert.equal(Object.values(state.dispatchJobs)[0].status, 'not-dispatchable');
  assert.deepEqual(pendingDispatchJobs([job(), { ...job(), worker: 'grokbot-32', id: 'other-work' }], state).map(row => row.worker), ['grokbot-32']);
  const again = harness();
  assert.equal(await dispatchApprovedWork([job()], state, again.api), 0);
  assert.deepEqual(again.events, []);
});

test('actual CLI does not touch the renderer or roster when its approved-work file is empty', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grok-no-work-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'empty.json');
  fs.writeFileSync(file, JSON.stringify({ schemaVersion: 1, jobs: [] }), { mode: 0o600 });
  const result = spawnSync(process.execPath, [new URL('./grokbot-headless-dispatch.mjs', import.meta.url).pathname, 'once', '--assignments', file, '--cdp-url', 'http://127.0.0.1:1'], {
    encoding: 'utf8', timeout: 5000, env: { ...process.env, GROKBOT_APP_SUPPORT_DIR: path.join(dir, 'absent-roster') },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /No approved unexpired work; dispatched=0/);
});
