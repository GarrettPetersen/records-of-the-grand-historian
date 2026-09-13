import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { attachmentDateWorker, cursorDateWorker, dateWorkerInput } from './lib/people-date-worker.mjs';
import { cancelActiveRuns, createRunControl } from './lib/cursor-run-control.mjs';

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

test('fresh review records getUsage telemetry locally and remotely at return', async () => {
  const h = harness();
  const task = reviewTask();
  const result = await h.worker(task);
  assert.deepEqual(result.reviewer, { name: 'offline-model', agentId: 'agent-1', independentOfExtractor: true });
  assert.equal(task.state.status, 'returned');
  assert.equal(task.state.validationError, null);
  assert.deepEqual(task.state.usage.data, billedUsage);
  assert.equal(task.state.usage.agentId, 'agent-1');
  assert.equal(task.state.usage.runId, 'run-1');
  assert.equal(h.calls('usage').length, 1);
  assert.equal(h.calls('usage')[0][2].runId, 'run-1');
  assert.equal(h.calls('wait')[0][2].maxTotalTokens, 4000000);
  assert.equal(h.calls('wait')[0][2].maxRawCostCents, 300);
  assertUsageCheckpoint(h, task);
});
test('artifact-only recovery downloads retained output but never creates or sends a turn',async()=>{
  const h=harness();h.options.recoverOnly=true;
  h.addAgent('retained',{artifact:{jobId:'audit-0-first',complete:true}});
  await h.worker(reviewTask(undefined,{agentId:'retained',sent:true}));
  assert.equal(h.calls('send').length,0);assert.equal(h.calls('create').length,0);
  await assert.rejects(h.worker(reviewTask('new-job')),/Artifact-only recovery/);
  assert.equal(h.calls('create').length,0);
  h.addAgent('unfinished');
  await assert.rejects(h.worker(reviewTask(undefined,{agentId:'unfinished',sent:true})),/Artifact-only recovery/);
  assert.equal(h.calls('send').length,0);
});

test('retained conversation continues before any replacement, even with an empty run listing', async () => {
  const h = harness();
  h.addAgent('retained');
  const task = reviewTask(undefined, { agentId: 'retained', model: 'original-model', sent: true });
  const result = await h.worker(task);
  assert.equal(h.calls('create').length, 0);
  assert.equal(h.calls('resume')[0][1], 'retained');
  assert.equal(h.calls('send')[0][1], 'retained');
  assert.match(h.calls('send')[0][2], /Continue your existing date work; do not restart research/);
  assert.equal(result.reviewer.name, 'original-model');
  assertUsageCheckpoint(h, task);
});

test('failed resume retains ownership and never creates a replacement agent', async () => {
  const failure = new Error('fetch failed during resume');
  const h = harness({ resume: () => { throw failure; } });
  h.addAgent('retained');
  const task = reviewTask(undefined, { agentId: 'retained', sent: true });
  await assert.rejects(h.worker(task), error => error === failure);
  assert.equal(h.calls('create').length, 0);
  assert.equal(h.calls('send').length, 0);
  assert.equal(task.state.agentId, 'retained');
  assert.equal(task.state.validationError, undefined);
  assertUsageCheckpoint(h, task);
});

test('transport interruption recovers a published artifact on retry without another model turn', async () => {
  const failure = new Error('run stream is no longer available');
  const h = harness({ wait(run, options, agent) {
    agent.artifact = { complete: true };
    run.status = 'completed';
    throw failure;
  } });
  const task = reviewTask();
  await assert.rejects(h.worker(task), error => error === failure);
  assert.equal(task.state.validationError, undefined);
  assert.equal(task.state.lastError, failure.message);
  assert.equal(task.state.status, 'interrupted');
  assert.equal(h.control.activeRuns.size, 0);
  assertUsageCheckpoint(h, task);
  const result = await h.worker(task);
  assert.equal(result.complete, true);
  assert.equal(h.calls('create').length, 1);
  assert.equal(h.calls('send').length, 1);
  assert.equal(h.calls('resume').length, 1);
  assert.equal(task.state.lastError, null);
  assertUsageCheckpoint(h, task);
});

test('artifact download transport errors do not become validation failures', async () => {
  let failDownload = true;
  const h = harness({ download: () => {
    if (failDownload) throw new Error('ECONNRESET');
    return Buffer.from('{"complete":true}');
  } });
  h.addAgent('retained', { artifact: { complete: true } });
  const task = reviewTask(undefined, { agentId: 'retained', sent: true });
  await assert.rejects(h.worker(task), /ECONNRESET/);
  assert.equal(task.state.validationError, undefined);
  failDownload = false;
  assert.equal((await h.worker(task)).complete, true);
  assert.equal(h.calls('send').length, 0);
  assertUsageCheckpoint(h, task);
});

test('semantic rejection continues the same chat with the validator feedback', async () => {
  const h = harness();
  const task = reviewTask();
  await h.worker(task);
  task.state.validationError = 'Missing birth and death checks for person-1';
  task.state.status = 'rejected';
  await h.worker(task);
  assert.equal(h.calls('create').length, 1);
  assert.equal(h.calls('send').length, 2);
  assert.equal(h.calls('send')[1][1], task.state.agentId);
  assert.match(h.calls('send')[1][2], /Missing birth and death checks/);
  assert.match(h.calls('send')[1][2], /do not restart research/);
  assert.equal(task.state.validationError, null);
});

test('invalid JSON is an artifact validation error and is repaired in the retained chat', async () => {
  let malformed = true;
  const h = harness({ wait(run, options, agent) {
    agent.artifact = malformed ? '{broken' : { complete: true };
    run.status = 'completed';
    return run;
  } });
  const task = reviewTask();
  await assert.rejects(h.worker(task), { name: 'DateArtifactValidationError' });
  assert.match(task.state.validationError, /Invalid date artifact/);
  assert.equal(task.state.artifactHash, hash('{broken'));
  assertUsageCheckpoint(h, task);
  malformed = false;
  await h.worker(task);
  assert.equal(h.calls('create').length, 1);
  assert.equal(h.calls('send').length, 2);
  assert.match(h.calls('send')[1][2], /Invalid date artifact/);
  assert.equal(task.state.validationError, null);
});

test('a corrected artifact from an interrupted continuation supersedes rejected bytes', async () => {
  const h = harness();
  h.addAgent('retained', { artifact: { complete: true } });
  const task = reviewTask(undefined, {
    agentId: 'retained', sent: true, artifactHash: hash('{"complete":false}'),
    validationError: 'Missing checks in the prior artifact',
  });
  assert.equal((await h.worker(task)).complete, true);
  assert.equal(h.calls('send').length, 0);
  assert.equal(task.state.validationError, null);
});

test('JSON null, primitives and arrays are rejected as artifacts rather than mistaken for missing output', async t => {
  for (const artifact of ['null', 'false', '7', '"text"', '[]']) {
    await t.test(artifact, async () => {
      const h = harness({ wait(run, options, agent) { agent.artifact = artifact; return run; } });
      const task = reviewTask();
      await assert.rejects(h.worker(task), { name: 'DateArtifactValidationError' });
      assert.match(task.state.validationError, /Expected a JSON object/);
    });
  }
});

test('missing artifact is resumable and not an artifact validation error', async () => {
  const h = harness({ wait: run => ({ ...run, status: 'error', error: { message: 'Worker interrupted' } }) });
  const task = reviewTask();
  await assert.rejects(h.worker(task), /without date-.*Worker interrupted/);
  assert.equal(task.state.validationError, undefined);
  assert.equal(h.control.stopRequested, false);
  assertUsageCheckpoint(h, task);
});

test('account usage errors stop subsequent launches, whether thrown or returned', async t => {
  for (const mode of ['throw', 'result']) {
    await t.test(mode, async () => {
      const error = Object.assign(new Error('Account capacity exhausted'), { code: 'usage_limit_exceeded' });
      const h = harness({ wait(run) {
        if (mode === 'throw') throw error;
        return { ...run, status: 'error', error };
      } });
      const task = reviewTask();
      await assert.rejects(h.worker(task));
      assert.equal(h.control.stopRequested, true);
      assert.equal(h.control.stopReason, 'usage-limit');
      assert.equal(task.state.validationError, undefined);
      assertUsageCheckpoint(h, task);
      await assert.rejects(h.worker(reviewTask('audit-0-next')), /launch stopped/);
      assert.equal(h.calls('create').length, 1);
      assert.equal(h.calls('send').length, 1);
    });
  }
});

test('usage stop still recovers an artifact produced by the exhausted run', async () => {
  const h = harness({ wait(run, options, agent) {
    agent.artifact = { complete: true };
    return { ...run, status: 'error', error: { code: 'usage_limit_exceeded' } };
  } });
  const task = reviewTask();
  assert.equal((await h.worker(task)).complete, true);
  assert.equal(h.control.stopRequested, true);
  assertUsageCheckpoint(h, task);
});

test('stop during agent creation or remote checkpoint prevents sending', async t => {
  for (const phase of ['create', 'checkpoint']) {
    await t.test(phase, async () => {
      const h = harness({
        create() { if (phase === 'create') h.control.stopRequested = true; },
        checkpoint(key, state) { if (phase === 'checkpoint' && state.status === 'sending') h.control.stopRequested = true; },
      });
      const task = reviewTask();
      await assert.rejects(h.worker(task), /launch stopped/);
      assert.equal(task.state.agentId, 'agent-1');
      assert.equal(h.calls('send').length, 0);
      assertUsageCheckpoint(h, task);
    });
  }
});

test('an asynchronous send retry checks the shared stop again', async () => {
  const h = harness({ async send(agent, message) {
    await Promise.resolve();
    h.control.stopRequested = true;
    return agent.send(message);
  } });
  const task = reviewTask();
  await assert.rejects(h.worker(task), /launch stopped/);
  assert.equal(h.agents.get('agent-1').runs.length, 0);
  assert.equal(task.state.sent, undefined);
});

test('stopRequested drains active retained runs and downloads without launching', async () => {
  const h = harness({ wait(run, options, agent) {
    assert.equal(h.control.activeRuns.get(run.id).agentId, 'retained');
    agent.artifact = { complete: true };
    return { ...run, status: 'completed' };
  } });
  h.addAgent('retained', { runs: [{ id: 'active-run', status: 'running' }] });
  h.control.stopRequested = true;
  const task = reviewTask(undefined, { agentId: 'retained', sent: true });
  assert.equal((await h.worker(task)).complete, true);
  assert.equal(h.control.activeRuns.size, 0);
  assert.equal(h.calls('create').length, 0);
  assert.equal(h.calls('send').length, 0);
  assert.equal(task.state.usage.runId, 'active-run');
  assertUsageCheckpoint(h, task);
});

test('a stop while waiting drains already launched work', async () => {
  const h = harness({ wait(run, options, agent) {
    h.control.stopRequested = true;
    agent.artifact = { complete: true };
    return { ...run, status: 'completed' };
  } });
  const task = reviewTask();
  assert.equal((await h.worker(task)).complete, true);
  assert.equal(task.state.status, 'returned');
  assert.equal(h.control.activeRuns.size, 0);
});

test('active runs support signal cancellation even when retained run listings have no instance methods', async () => {
  const h = harness({ async wait(run) {
    await cancelActiveRuns(h.control);
    return { ...run, status: 'cancelled' };
  } });
  h.addAgent('retained', { runs: [{ id: 'active-run', status: 'running' }] });
  h.control.stopRequested = true;
  const task = reviewTask(undefined, { agentId: 'retained', sent: true });
  await assert.rejects(h.worker(task), /launch stopped/);
  assert.deepEqual(h.calls('cancel'), [['cancel', 'active-run', {
    runtime: 'cloud', agentId: 'retained', apiKey: 'offline-test-only',
  }]]);
  assert.equal(h.control.activeRuns.size, 0);
  assert.equal(h.calls('send').length, 0);
  assertUsageCheckpoint(h, task);
});

test('active runs prefer their supported instance cancellation method', async () => {
  let cancelled = false;
  const h = harness({ async wait(run, options, agent) {
    run.supports = capability => capability === 'cancel';
    run.cancel = async () => { cancelled = true; };
    await cancelActiveRuns(h.control);
    agent.artifact = { complete: true };
    return { ...run, status: 'cancelled' };
  } });
  await h.worker(reviewTask());
  assert.equal(cancelled, true);
  assert.equal(h.calls('cancel').length, 0);
  assert.equal(h.control.activeRuns.size, 0);
});

test('stopped retained work without an artifact never continues research', async () => {
  const h = harness();
  h.addAgent('retained');
  h.control.stopRequested = true;
  await assert.rejects(h.worker(reviewTask(undefined, { agentId: 'retained', sent: true })), /launch stopped/);
  assert.equal(h.calls('send').length, 0);
  assert.equal(h.calls('create').length, 0);
});

test('usage read failure is explicitly unavailable on both return and error, never fake zero', async t => {
  for (const outcome of ['return', 'error']) {
    await t.test(outcome, async () => {
      const failure = new Error('run transport failed');
      const h = harness({
        getUsage() { throw new Error('usage service unavailable'); },
        ...(outcome === 'error' ? { wait() { throw failure; } } : {}),
      });
      const task = reviewTask();
      if (outcome === 'error') await assert.rejects(h.worker(task), error => error === failure);
      else assert.equal((await h.worker(task)).complete, true);
      assertUsageCheckpoint(h, task, 'unavailable');
      assert.equal(task.state.usage.error, 'usage service unavailable');
      assert.equal(task.state.usage.data, undefined);
      assert.equal(task.state.usage.totalTokens, undefined);
      assert.equal(task.state.usage.rawCostCents, undefined);
      assert.ok(!task.state.validationError);
    });
  }
});

test('empty usage response is unavailable and a real zero response stays available', async () => {
  const empty = harness({ getUsage: () => null });
  const emptyTask = reviewTask();
  await empty.worker(emptyTask);
  assertUsageCheckpoint(empty, emptyTask, 'unavailable');
  const zero = { usage: { totalTokens: 0 }, cost: { rawCostCents: 0 } };
  const h = harness({ getUsage: () => zero });
  const task = reviewTask();
  await h.worker(task);
  assertUsageCheckpoint(h, task);
  assert.deepEqual(task.state.usage.data, zero);
});

test('distinct concurrent review and repair jobs own independent agent IDs and usage checkpoints', async () => {
  const pending = [];
  const h = harness({ wait(run, options, agent) {
    return new Promise(resolve => {
      pending.push(() => {
        agent.artifact = { complete: true };
        resolve({ ...run, status: 'completed' });
      });
      if (pending.length === 3) pending.reverse().forEach(finish => finish());
    });
  } });
  const tasks = [reviewTask('audit-0-a'), repairTask(), reviewTask('reaudit-1-b')];
  const results = await Promise.all(tasks.map(task => h.worker(task)));
  assert.equal(new Set(tasks.map(task => task.state.agentId)).size, 3);
  assert.notEqual(results[0].reviewer.agentId, tasks[1].state.agentId);
  assert.notEqual(results[2].reviewer.agentId, tasks[1].state.agentId);
  assert.equal(results[1].reviewer, undefined);
  for (const task of tasks) {
    const checkpoint = h.checkpoints.filter(c => c.key === task.key).at(-1);
    assert.equal(checkpoint.state.usage.agentId, task.state.agentId);
    assert.equal(checkpoint.state.usage.runId, task.state.runId);
    assert.equal(checkpoint.state.status, 'returned');
  }
  assert.equal(h.control.activeRuns.size, 0);
});

function repairTask() {
  const task = reviewTask('repair-0-first');
  const claims = [
    ['p1', 'birth', { westernYear: { era: 'AD', year: 100 } }, 'certain', ['u2']],
    ['p1', 'death', { westernYear: { era: 'AD', year: 170 } }, 'certain', ['u14']],
    ['p2', 'death', { westernYear: { era: 'AD', year: 200 } }, 'certain', ['u29']],
  ];
  return {
    ...task, kind: 'repair', extraction: { claims },
    report: {
      findings: [{ items: ['claim-1'], problem: 'Wrong owner', action: 'Reconcile dates and hints' }],
      itemChecks: [{ id: 'claim-2', evidence: [{ unit: 'u20', quote: 'date context' }] }],
      personChecks: [{ id: 'p1', evidence: [{ unit: 'u8', quote: 'personal evidence' }] }],
      references: [{ kind: 'external', title: 'A reviewed reference' }],
    },
    packet: {
      book: 'shiji', chapter: '001', sourceHash: 'source', extractionHash: 'extraction', sourceUrl: 'https://example.invalid/source',
      people: [{ id: 'p1', hints: ['AD 100-170'] }, { id: 'p2', hints: ['AD 200'] }],
      items: [
        ...claims.map((row, claimIndex) => ({ id: `claim-${claimIndex + 1}`, personId: row[0], claimIndex, evidence: row[4] })),
        { id: 'hints-p1', personId: 'p1', evidence: [], value: ['AD 100-170'] },
        { id: 'hints-p2', personId: 'p2', evidence: [], value: ['AD 200'] },
      ],
      units: Array.from({ length: 30 }, (_, i) => ({ id: `u${i}`, zh: `source ${i}` })),
    },
  };
}

test('repair findings include all affected person dates, hints and check evidence, but exclude unrelated people', () => {
  const task = repairTask();
  const original = structuredClone(task.packet);
  const input = dateWorkerInput(task);
  assert.deepEqual(input.people, [task.packet.people[0]]);
  assert.deepEqual(input.items.map(i => i.id), ['claim-1', 'claim-2', 'hints-p1']);
  assert.deepEqual(input.claims, task.extraction.claims.slice(0, 2).map((row, i) => ({ id: `claim-${i + 1}`, row })));
  const units = new Set(input.units.map(u => u.id));
  for (const id of ['u2', 'u8', 'u14', 'u20', 'u23']) assert.ok(units.has(id));
  assert.ok(!units.has('u29'));
  assert.equal(units.size, input.units.length);
  assert.deepEqual(input.units, [...input.units].sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1))));
  assert.deepEqual(input.references, task.report.references);
  assert.deepEqual(task.packet, original);
});

test('person-only and hint-only findings also include the complete affected chronology', () => {
  for (const id of ['p1', 'hints-p1']) {
    const task = repairTask();
    task.report.findings[0].items = [id];
    assert.deepEqual(dateWorkerInput(task).items.map(i => i.id), ['claim-1', 'claim-2', 'hints-p1']);
  }
});

test('repair packet byte ceiling fails before agent creation instead of silently truncating chronology', async () => {
  const h = harness();
  const task = repairTask();
  h.options.maxWorkerBytes = Buffer.byteLength(JSON.stringify(dateWorkerInput(task))) - 1;
  await assert.rejects(h.worker(task), /packet exceeds/);
  assert.equal(h.calls('create').length, 0);
  assert.equal(h.calls('send').length, 0);
  assert.equal(h.calls('usage').length, 0);
  assertUsageCheckpoint(h, task, 'unavailable');
});

test('unknown phases fail before spending', async () => {
  const h = harness();
  const task = { ...reviewTask(), kind: 'unknown' };
  await assert.rejects(h.worker(task), /Unknown date worker phase/);
  assert.equal(h.calls('create').length, 0);
});

function attachmentFixture(t, task, artifact) {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'people-date-worker-test-'));
  t.after(() => fs.rmSync(outputDir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(outputDir, `${task.key}.result.json`), JSON.stringify(artifact));
  return attachmentDateWorker({ outputDir });
}

test('attachment repair and review persist their attested context IDs before returning', async t => {
  for (const kind of ['repair', 'review']) {
    await t.test(kind, async t => {
      const task = kind === 'repair' ? repairTask() : reviewTask();
      const field = kind === 'repair' ? 'author' : 'reviewer';
      const identity = { name: 'Manual bot attestation', agentId: `context-${kind}`,
        ...(kind === 'review' ? { independentOfExtractor: true } : {}) };
      const artifact = { [field]: identity, complete: true };
      const worker = attachmentFixture(t, task, artifact);
      let saved = false;
      task.save = async patch => {
        await Promise.resolve();
        assert.deepEqual(patch, { agentId: identity.agentId });
        saved = true;
      };
      assert.deepEqual(await worker(task), artifact);
      assert.equal(saved, true);
      assert.equal(task.state.agentId, identity.agentId);
    });
  }
});

test('attachment identities expose same-context repair/review to the host independence gate', async t => {
  const repair = repairTask();
  const review = reviewTask('reaudit-1-attached');
  const identity = { name: 'Same bot', agentId: 'same-conversation' };
  await attachmentFixture(t, repair, { author: identity })(repair);
  const result = await attachmentFixture(t, review, {
    reviewer: { ...identity, independentOfExtractor: true },
  })(review);
  assert.equal(repair.state.agentId, result.reviewer.agentId);
  assert.equal(review.state.agentId, result.reviewer.agentId);
  assert.deepEqual(repair.saves, [{ agentId: 'same-conversation' }]);
});

test('attachment results without complete explicit identities fail without saving an identity', async t => {
  const cases = [
    ['repair', {}],
    ['repair', { author: { name: 'Bot' } }],
    ['repair', { author: { name: '', agentId: 'context' } }],
    ['repair', { author: { name: 'Bot', agentId: ' context ' } }],
    ['review', { reviewer: { name: 'Bot', independentOfExtractor: true } }],
    ['review', { reviewer: { name: 'Bot', agentId: 'context' } }],
    ['review', { reviewer: { name: 'Bot', agentId: 'context', independentOfExtractor: false } }],
    ['review', { reviewer: { name: 'Bot', agentId: 'context', independentOfExtractor: 'true' } }],
  ];
  for (const [index, [kind, artifact]] of cases.entries()) {
    await t.test(`${kind}-${index}`, async t => {
      const task = kind === 'repair' ? repairTask() : reviewTask();
      await assert.rejects(attachmentFixture(t, task, artifact)(task), /attachment requires/);
      assert.equal(task.state.agentId, undefined);
      assert.deepEqual(task.saves, []);
    });
  }
});

test('attachment save failure prevents returning an uncheckpointed identity', async t => {
  const task = repairTask();
  const failure = new Error('Local checkpoint failed');
  task.save = async () => { throw failure; };
  await assert.rejects(attachmentFixture(t, task, {
    author: { name: 'Bot', agentId: 'context' },
  })(task), error => error === failure);
  assert.equal(task.state.agentId, undefined);
});

test('generated attachment packets explicitly request the required identity fields', async t => {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'people-date-worker-test-'));
  t.after(() => fs.rmSync(outputDir, { recursive: true, force: true }));
  const worker = attachmentDateWorker({ outputDir });
  for (const task of [repairTask(), reviewTask()]) {
    await assert.rejects(worker(task), /Attachment required/);
    const input = JSON.parse(fs.readFileSync(path.join(outputDir, `${task.key}.input.json`), 'utf8'));
    assert.ok(input.instructions.includes(task.kind === 'repair'
      ? 'author:{name,agentId}' : 'reviewer:{name,agentId,independentOfExtractor:true}'));
    assert.match(input.instructions, /human attestation, not machine proof/);
    assert.equal(task.saves.length, 0);
  }
});
