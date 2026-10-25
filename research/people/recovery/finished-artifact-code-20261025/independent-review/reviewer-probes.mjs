import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { attachmentDateWorker, cursorDateWorker, dateWorkerInput } from '../verification/scripts/lib/people-date-worker.mjs';
import { CursorRunLimitExceededError } from '../verification/scripts/lib/cursor-run-wait.mjs';
import { cancelActiveRuns, createRunControl } from '../verification/scripts/lib/cursor-run-control.mjs';

const billedUsage = { usage: { totalTokens: 1234 }, cost: { rawCostCents: 7.5 } };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

function reviewTask(key = 'audit-0-first', state = {}) {
  const saves = [];
  return {
    key, kind: 'review', state, saves,
    packet: { book: 'shiji', chapter: '001' },
    job: { id: key, sourceHash: 'source', extractionHash: 'extraction', ownedUnits: ['u1'] },
    save(patch) { saves.push(structuredClone(patch)); },
  };
}

// Every SDK operation and both orchestration helpers are injected. No test
// imports credentials, contacts Cursor, or writes corpus/workflow state.
function harness(hooks = {}) {
  const events = [];
  const agents = new Map();
  const checkpoints = [];
  const control = createRunControl();
  let created = 0;
  let sent = 0;
  const addAgent = (id, { key = 'audit-0-first', artifact = null, runs = [] } = {}) => {
    const agent = {
      agentId: id, key, artifact, runs,
      async send(message) {
        const run = { id: `run-${++sent}`, status: 'running' };
        agent.runs = [run, ...agent.runs];
        agent.key = /\/date-(.*)\.json/.exec(message)?.[1] ?? agent.key;
        return run;
      },
      async listArtifacts() {
        events.push(['artifacts', id]);
        if (hooks.listArtifacts) return hooks.listArtifacts(agent);
        return agent.artifact === null ? [] : [{ path: `/opt/cursor/artifacts/date-${agent.key}.json` }];
      },
      async downloadArtifact(file) {
        events.push(['download', id, file]);
        if (hooks.download) return hooks.download(agent);
        return Buffer.from(typeof agent.artifact === 'string' ? agent.artifact : JSON.stringify(agent.artifact));
      },
    };
    agents.set(id, agent);
    return agent;
  };
  const Agent = {
    async create(options) {
      events.push(['create', options]);
      const agent = addAgent(`agent-${++created}`);
      if (hooks.create) await hooks.create(agent);
      return agent;
    },
    async resume(id) {
      events.push(['resume', id]);
      if (hooks.resume) await hooks.resume(id);
      assert.ok(agents.has(id), `Unexpected agent ${id}`);
      return agents.get(id);
    },
    async listRuns(id) {
      events.push(['runs', id]);
      return { items: agents.get(id).runs };
    },
    async getUsage(id, options) {
      events.push(['usage', id, options]);
      return hooks.getUsage ? hooks.getUsage(id, options) : structuredClone(billedUsage);
    },
    async cancelRun(id, options) {
      events.push(['cancel', id, options]);
    },
  };
  const dependencies = {
    Agent,
    async send(agent, message, options) {
      events.push(['send', agent.agentId, message, options]);
      return hooks.send ? hooks.send(agent, message, options) : agent.send(message);
    },
    async wait(run, options) {
      events.push(['wait', run.id, options]);
      const agent = agents.get(options.agentId);
      if (hooks.wait) return hooks.wait(run, options, agent);
      agent.artifact = { jobId: agent.key, complete: true };
      run.status = 'completed';
      return run;
    },
  };
  const options = {
    apiKey: 'offline-test-only', model: 'offline-model', maxWorkerBytes: 64 * 1024,
    timeoutMs: 1200000, maxRunCostCents: 300, maxRunTokens: 4000000,
    async saveRemoteJob(key, state) {
      checkpoints.push({ key, state: structuredClone(state) });
      if (hooks.checkpoint) await hooks.checkpoint(key, state);
    },
  };
  return {
    worker: cursorDateWorker(options, control, dependencies),
    control, options, dependencies, events, agents, checkpoints, addAgent,
    calls: name => events.filter(event => event[0] === name),
  };
}

function assertUsageCheckpoint(h, task, status = 'available') {
  assert.equal(task.state.usage.status, status);
  assert.ok(Number.isFinite(Date.parse(task.state.usage.recordedAt)));
  assert.deepEqual(h.checkpoints.at(-1), { key: task.key, state: task.state });
  assert.deepEqual(task.saves.at(-1), { usage: task.state.usage });
}


test('reviewer probe: nested account cause must globally stop before artifact recovery', async () => {
 const h=harness({wait(){throw new CursorRunLimitExceededError('cost stop',{runId:'prior-run',metric:'tokens',cause:new Error('wrapped',{cause:new Error('usage_limit_exceeded')})});}});
 h.addAgent('retained',{artifact:{complete:true},runs:[{id:'prior-run',status:'running'}]});
 const task=reviewTask(undefined,{agentId:'retained',sent:true});
 await assert.rejects(h.worker(task)); assert.equal(h.control.stopRequested,true); assert.equal(h.calls('download').length,0);
});
test('reviewer probe: post-stop artifact transport failure cannot replace agent', async () => {
 const h=harness({wait(run){throw new CursorRunLimitExceededError('cost stop',{runId:run.id,metric:'tokens'});},listArtifacts(){throw new Error('Agent not found');}});
 h.addAgent('retained',{runs:[{id:'prior-run',status:'running'}]});
 const task=reviewTask(undefined,{agentId:'retained',sent:true});
 await assert.rejects(h.worker(task)); assert.equal(h.calls('create').length,0); assert.equal(h.calls('send').length,0);assert.equal(task.state.agentId,'retained');
});
