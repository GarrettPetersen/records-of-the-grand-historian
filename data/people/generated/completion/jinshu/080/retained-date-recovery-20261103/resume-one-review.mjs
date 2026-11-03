import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { inspectLocalDisk } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';

const root = '/Users/garrettpetersen/records-of-the-grand-historian';
const runtime = '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime';
const base = path.dirname(fileURLToPath(import.meta.url));
const argsIn = process.argv.slice(2);
if (argsIn.length !== 0 && (argsIn.length !== 2 || argsIn[0] !== '--attempt' || !/^[a-z0-9-]+$/.test(argsIn[1]))) throw new Error('Use no arguments or --attempt UNIQUE_NAME');
const job = argsIn.length ? path.join(base, argsIn[1]) : base;
const stateFile = root + '/data/people/generated/date-workflow/jinshu/080/state.json';
const ownState = job + '/one-review-state.json';
if (fs.existsSync(ownState)) throw new Error('Retained invocation exists; inspect its exact process and remote handles before resuming');
const before = JSON.parse(fs.readFileSync(stateFile));
if (before.phase !== 'audit' || before.round !== 0 || !before.reviewPlans?.['audit-0']) throw new Error('Unexpected retained audit phase; preserve it');
const oldRuns = new Set(Object.values(before.jobs).map(value => value.runId).filter(Boolean));
const state = { schemaVersion: 1, worker: 'jinshu-release-dates-cursor-sdk', scope: { book: 'jinshu', chapter: '080' },
  phase: 'starting', startedAt: new Date().toISOString(), priorRunIds: [...oldRuns],
  sourceHash: before.sourceHash, extractionHash: before.extractionHash, limits: { concurrency: 1, rawCostCents: 300, totalTokens: 4000000, timeoutMinutes: 20 },
  drainPolicy: 'One SIGINT to the owned CLI after the first newly captured run. Its installed handler stops queued work and drains the active run; no SIGTERM, second SIGINT, or active cancellation.' };
const save = () => fs.writeFileSync(ownState, JSON.stringify(state, null, 2) + '\n');
const sample = () => {
  const guard = inspectLocalDisk(root);
  fs.appendFileSync(job + '/one-review-resources.jsonl', JSON.stringify({ at: new Date().toISOString(), guard }) + '\n');
  return guard;
};
if (inspectLocalDisk(root).errors.length) throw new Error('Host guard rejected dispatch');
if (argsIn.length) fs.mkdirSync(job, { recursive: false });
if (sample().errors.length) throw new Error('Host guard rejected dispatch');
const log = fs.openSync(job + '/one-review.log', 'wx', 0o600);
const args = ['--max-old-space-size=3072', runtime + '/scripts/run-people-date-workflow.mjs',
  '--book', 'jinshu', '--chapter', '080', '--worker', state.worker, '--lane', 'cursor-sdk',
  '--model', 'grok-4.6', '--run', '--concurrency', '1', '--job-concurrency', '1', '--limit', '1',
  '--max-units', '40', '--max-worker-kib', '56', '--max-run-cost', '3', '--max-run-tokens', '4000000',
  '--run-timeout-minutes', '20', '--summary-out', job + '/one-review-summary.json'];
const child = spawn(process.execPath, args, { cwd: runtime, env: { ...process.env, PEOPLE_REPO_ROOT: root }, stdio: ['ignore', log, log] });
fs.closeSync(log); state.pid = child.pid; state.phase = 'running'; save();
let drained = false;
const drain = reason => {
  if (drained) return;
  if (!child.kill('SIGINT')) throw new Error('Could not request owned CLI drain; inspect its current process');
  drained = true; state.drainRequestedAt = new Date().toISOString(); state.drainReason = reason; save();
};
const capture = setInterval(() => {
  try {
    const current = JSON.parse(fs.readFileSync(stateFile));
    if (current.sourceHash !== state.sourceHash || current.extractionHash !== state.extractionHash) throw new Error('Retained source changed');
    const fresh = Object.entries(current.jobs).filter(([, value]) => value.runId && !oldRuns.has(value.runId));
    if (fresh.length) {
      state.newRuns = fresh.map(([key, value]) => ({ key, agentId: value.agentId, runId: value.runId, status: value.status }));
      save(); drain('First new native date-review run captured; preserve and finish it before another assignment');
    }
  } catch (error) { state.observationError = error.message; save(); drain('State observation failed; stop further dispatch and preserve active work'); }
}, 1000);
const resource = setInterval(() => {
  try { if (sample().errors.length) { state.resourceHold = true; save(); drain('Host resource guard failed; preserve the active run'); } }
  catch (error) { state.resourceHold = true; state.measurementError = error.message; save(); drain('Host resource measurement failed'); }
}, 45000);
try {
  const result = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', (code, signal) => resolve({ code, signal })); });
  state.phase = 'terminal'; state.result = result; state.finishedAt = new Date().toISOString(); save();
  console.log(JSON.stringify({ phase: state.phase, result, newRuns: state.newRuns ?? [], resourceHold: state.resourceHold ?? false }));
} finally { clearInterval(capture); clearInterval(resource); sample(); }
