import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Agent } from '@cursor/sdk';
import { recoverPublishedShardDocuments } from './sdk-people-resolve.mjs';

// No network, credentials, corpus load or model turns: exercise the production
// recovery function against absent, malformed and schema-invalid saved artifacts.
for (const kind of ['missing', 'malformed-json', 'invalid-document']) {
  test(`artifact-only recovery leaves ${kind} pending without requesting a model turn`, async t => {
    const batch = 'offline-recovery-shard-001';
    const artifact = `data/people/generated/resolver-artifacts/${batch}.json`;
    const calls = { resume: 0, download: 0, listRuns: 0, sends: 0, close: 0 };
    const agent = {
      agentId: 'offline-agent',
      async listArtifacts() { return kind === 'missing' ? [] : [{ path: artifact }]; },
      async downloadArtifact() {
        calls.download++;
        return Buffer.from(kind === 'malformed-json' ? '{broken' : JSON.stringify({ schemaVersion: 99, batch, decisions: [] }));
      },
      async send() { calls.sends++; assert.fail('artifact-only recovery requested a model turn'); },
      async close() { calls.close++; },
    };
    t.mock.method(Agent, 'resume', async () => { calls.resume++; return agent; });
    t.mock.method(Agent, 'listRuns', async () => { calls.listRuns++; assert.fail('artifact-only recovery must not enter model-run recovery'); });
    const accepted = [];
    const result = await recoverPublishedShardDocuments(
      [{ batch, shard: 1, document: { targetLocalPeople: ['fixture:001:p001'], people: {}, blocks: [] } }],
      { recoverOnly: true, maxAttempts: 3 }, { localPeople: new Map() }, [], accepted, { clusters: [], keepSeparate: new Set() },
      { stopRequested: false, withAgentSlot() { assert.fail('artifact-only recovery reserved an inference slot'); } },
      new Map([[batch, agent.agentId]]),
    );
    assert.deepEqual(result, []);
    assert.deepEqual(accepted, []);
    assert.deepEqual(calls, { resume: 1, download: kind === 'missing' ? 0 : 1, listRuns: 0, sends: 0, close: 1 });
  });
}

test('artifact-only recovery still accepts an already-published valid artifact', async t => {
  const batch = `offline-recovery-success-${process.pid}-shard-001`;
  const group = `offline-recovery-success-${process.pid}`;
  const document = { schemaVersion: 1, batch, decisions: [] };
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const checkpointDir = path.join(root, 'data/people/generated/resolution-shards', group);
  assert.equal(fs.existsSync(checkpointDir), false, 'fixture must not replace existing state');
  t.after(() => fs.rmSync(checkpointDir, { recursive: true, force: true }));
  let closed = false;
  const agent = {
    agentId: 'offline-success',
    async listArtifacts() { return [{ path: `data/people/generated/resolver-artifacts/${batch}.json` }]; },
    async downloadArtifact() { return Buffer.from(JSON.stringify(document)); },
    async send() { assert.fail('valid saved artifact must not request inference'); },
    async close() { closed = true; },
  };
  t.mock.method(Agent, 'resume', async () => agent);
  t.mock.method(Agent, 'listRuns', async () => assert.fail('valid artifact needs no model-run recovery'));
  const dossier = { batch, shard: 1, checkpointGroup: group, document: { targetLocalPeople: [], people: {}, blocks: [] } };
  const accepted = [];
  const result = await recoverPublishedShardDocuments([dossier], { recoverOnly: true, maxAttempts: 3 },
    { localPeople: new Map() }, [], accepted, { clusters: [], keepSeparate: new Set() },
    { stopRequested: false, withAgentSlot() { assert.fail('saved artifact needs no inference slot'); } },
    new Map([[batch, agent.agentId]]));
  assert.deepEqual(result, [dossier]);
  assert.deepEqual(accepted, [document]);
  const saved = JSON.parse(fs.readFileSync(path.join(checkpointDir, `${batch}.json`), 'utf8'));
  assert.deepEqual(saved.document, document);
  assert.match(saved.dossierFingerprint, /^sha256:[a-f0-9]{64}$/);
  assert.equal(closed, true);
});
