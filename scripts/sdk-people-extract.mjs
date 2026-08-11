#!/usr/bin/env node

import { Agent, CursorAgentError } from '@cursor/sdk';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildPeopleExtractionPacket,
  buildPeopleWorkerPacket,
} from './build-people-extraction-packet.mjs';
import { loadDotenv } from './load-dotenv.mjs';
import {
  DATA_DIR,
  PEOPLE_DIR,
  REPO_ROOT,
  chapterPath,
  extractionPath,
  normalizedChapterId,
  readJson,
  writeTextAtomic,
  writeJsonAtomic,
} from './lib/people-content.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { waitForCursorRun } from './lib/cursor-run-wait.mjs';
import {
  compactPeopleExtraction,
  isCompactPeopleExtraction,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';

loadDotenv(REPO_ROOT);

const DEFAULT_MODEL = 'grok-4.5';
const DEFAULT_REPO_URL = 'https://github.com/GarrettPetersen/records-of-the-grand-historian';
const DEFAULT_STARTING_REF = 'codex/people-glossary-staging';
const STATE_FILE = path.join(PEOPLE_DIR, 'generated', 'extraction-state.json');
const DEFAULT_PLAN_FILE = path.join(PEOPLE_DIR, 'generated', 'extraction-plan.json');
const DEFAULT_MAX_UNITS = 250;
const DEFAULT_MAX_CANDIDATES = 600;
const DEFAULT_MAX_COST_CENTS = 1000;
const PEOPLE_CONFIG = readJson(path.join(PEOPLE_DIR, 'config.json'));
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage:
  node scripts/sdk-people-extract.mjs --book BOOK --chapter NNN [options]
  node scripts/sdk-people-extract.mjs --book BOOK [--limit N] [options]
  node scripts/sdk-people-extract.mjs --all [--limit N] [options]

Options:
  --book BOOK          Limit extraction to one book.
  --chapter NNN        Limit extraction to one chapter; requires --book.
  --all                Explicitly allow a corpus-wide queue.
  --limit N            Maximum chapters selected this run.
  --concurrency N      Parallel Cursor Cloud agents (default: 2, max: 12).
  --order ORDER        Queue order: smallest or book (default: smallest).
  --max-units N        Bulk chapter ceiling (default: ${DEFAULT_MAX_UNITS}).
  --max-candidates N   Bulk candidate ceiling (default: ${DEFAULT_MAX_CANDIDATES}).
  --allow-large        Bypass chapter-size ceilings after explicit review.
  --max-cost DOLLARS   Stop launching agents after this run reaches the charged
                       amount (default: $${(DEFAULT_MAX_COST_CENTS / 100).toFixed(2)}; use unlimited to disable).
  --plan-out PATH      Write the measured queue plan (default: generated data).
  --max-attempts N     Validation attempts per phase (default: 3).
  --model MODEL        Cursor model (default: ${DEFAULT_MODEL}).
  --effort LEVEL       Model effort/reasoning: low, medium, or high (default: low).
  --fast               Enable the model's fast variant (default: off).
  --repo URL           Repository URL available to cloud agents.
  --starting-ref REF   Remote branch/ref agents read (default: ${DEFAULT_STARTING_REF}).
  --dry-run            Build and summarize packets without calling Cursor.
  --force              Re-extract chapters with a currently valid sidecar.
  --retry-failed       Include chapters whose latest state is failed.
  --stream             Stream assistant text; requires concurrency 1.
  --self-test          Run scheduler guardrail tests without Cursor.

This runner is cloud-only. Workers never commit, push, or open pull requests.
The host downloads and validates artifacts, queues translation repairs for an
independent evidence review, and accumulates accepted chapters locally.`);
}

function dollarCents(value, flag) {
  if (value === 'unlimited') return null;
  if (!/^\d+(?:\.\d{1,2})?$/u.test(value) || Number(value) <= 0) {
    throw new Error(`${flag} must be a positive dollar amount or unlimited`);
  }
  return Math.round(Number(value) * 100);
}

function positiveInteger(value, flag, maximum = Number.MAX_SAFE_INTEGER) {
  if (!/^\d+$/u.test(value) || Number(value) < 1 || Number(value) > maximum) {
    throw new Error(`${flag} must be an integer from 1 to ${maximum}`);
  }
  return Number(value);
}

function parseArgs(argv) {
  const opts = {
    book: null,
    chapter: null,
    all: false,
    limit: null,
    concurrency: 2,
    order: 'smallest',
    maxUnits: DEFAULT_MAX_UNITS,
    maxCandidates: DEFAULT_MAX_CANDIDATES,
    allowLarge: false,
    maxCostCents: DEFAULT_MAX_COST_CENTS,
    planOut: DEFAULT_PLAN_FILE,
    maxAttempts: 3,
    model: process.env.SDK_PEOPLE_MODEL ?? DEFAULT_MODEL,
    effort: process.env.SDK_PEOPLE_EFFORT ?? 'low',
    fast: false,
    repoUrl: process.env.SDK_PEOPLE_REPO ?? DEFAULT_REPO_URL,
    startingRef: process.env.SDK_PEOPLE_STARTING_REF ?? DEFAULT_STARTING_REF,
    apiKey: process.env.CURSOR_API_KEY,
    dryRun: false,
    force: false,
    retryFailed: false,
    stream: false,
    selfTest: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`);
      return value;
    };
    if (arg === '--book') opts.book = next();
    else if (arg === '--chapter') opts.chapter = normalizedChapterId(next());
    else if (arg === '--all') opts.all = true;
    else if (arg === '--limit') opts.limit = positiveInteger(next(), arg);
    else if (arg === '--concurrency') opts.concurrency = positiveInteger(next(), arg, 12);
    else if (arg === '--order') opts.order = next();
    else if (arg === '--max-units') opts.maxUnits = positiveInteger(next(), arg);
    else if (arg === '--max-candidates') opts.maxCandidates = positiveInteger(next(), arg);
    else if (arg === '--allow-large') opts.allowLarge = true;
    else if (arg === '--max-cost') opts.maxCostCents = dollarCents(next(), arg);
    else if (arg === '--plan-out') opts.planOut = path.resolve(REPO_ROOT, next());
    else if (arg === '--max-attempts') opts.maxAttempts = positiveInteger(next(), arg, 5);
    else if (arg === '--model') opts.model = next();
    else if (arg === '--effort') opts.effort = next();
    else if (arg === '--fast') opts.fast = true;
    else if (arg === '--repo') opts.repoUrl = next();
    else if (arg === '--starting-ref') opts.startingRef = next();
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--force') opts.force = true;
    else if (arg === '--retry-failed') opts.retryFailed = true;
    else if (arg === '--stream') opts.stream = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  if (opts.selfTest) return opts;
  if (!['low', 'medium', 'high'].includes(opts.effort)) throw new Error('--effort must be low, medium, or high');
  if (!['smallest', 'book'].includes(opts.order)) throw new Error('--order must be smallest or book');
  if (opts.chapter && !opts.book) throw new Error('--chapter requires --book');
  if (!opts.book && !opts.all) throw new Error('Specify --book or explicitly pass --all');
  if (opts.all && (opts.book || opts.chapter)) throw new Error('--all cannot be combined with --book or --chapter');
  if (opts.stream && opts.concurrency !== 1) throw new Error('--stream requires --concurrency 1');
  return opts;
}

function modelSelection(opts) {
  let params = [];
  if (/^grok-4\.(?:5|6)$/u.test(opts.model)) {
    params = [
      { id: 'effort', value: opts.effort },
      { id: 'fast', value: opts.fast ? 'true' : 'false' },
    ];
  } else if (opts.model === 'gemini-3.6-flash') {
    params = [{ id: 'effort', value: opts.effort }];
  } else if (/^gpt-5\.4-(?:mini|nano)$/u.test(opts.model)) {
    params = [{ id: 'reasoning', value: opts.effort }];
  } else if (/^composer-/u.test(opts.model)) {
    params = [{ id: 'fast', value: opts.fast ? 'true' : 'false' }];
  } else if (opts.model === 'claude-haiku-4-5') {
    params = [{ id: 'thinking', value: opts.effort === 'low' ? 'false' : 'true' }];
  }
  return {
    id: opts.model,
    params,
  };
}

function chapterTargets(opts) {
  const targets = [];
  const books = fs.readdirSync(DATA_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'people' && (!opts.book || entry.name === opts.book))
    .filter((entry) => fs.readdirSync(path.join(DATA_DIR, entry.name)).some((name) => /^\d{3}\.json$/u.test(name)))
    .map((entry) => entry.name)
    .sort();
  for (const book of books) {
    const directory = path.join(DATA_DIR, book);
    for (const name of fs.readdirSync(directory).filter((file) => /^\d{3}\.json$/u.test(file)).sort()) {
      const chapter = name.slice(0, -5);
      if (opts.chapter && chapter !== opts.chapter) continue;
      targets.push({ book, chapter });
    }
  }
  if (opts.book && books.length === 0) throw new Error(`Unknown book: ${opts.book}`);
  if (opts.chapter && targets.length === 0) throw new Error(`Chapter not found: ${opts.book}/${opts.chapter}`);
  return targets;
}

function targetMetrics(packet) {
  const workerBytes = Buffer.byteLength(JSON.stringify(buildPeopleWorkerPacket(packet)));
  const units = packet.units.length;
  const candidates = packet.preflight.candidates.length;
  return {
    units,
    candidates,
    workerBytes,
    workloadScore: workerBytes + candidates * 160,
  };
}

function compareBookOrder(left, right) {
  return left.book.localeCompare(right.book) || left.chapter.localeCompare(right.chapter);
}

function compareWorkload(left, right) {
  return left.metrics.workloadScore - right.metrics.workloadScore ||
    left.metrics.candidates - right.metrics.candidates ||
    left.metrics.units - right.metrics.units ||
    compareBookOrder(left, right);
}

function exceedsBulkCeiling(target, opts) {
  return !opts.allowLarge && (
    target.metrics.units > opts.maxUnits || target.metrics.candidates > opts.maxCandidates
  );
}

function planTarget(target) {
  return {
    book: target.book,
    chapter: target.chapter,
    ...target.metrics,
  };
}

function recoverInterruptedState(state) {
  let changed = false;
  for (const entry of Object.values(state.chapters)) {
    if (!['claimed', 'extracting', 'failed/retryable'].includes(entry.status)) continue;
    entry.status = 'interrupted';
    entry.updatedAt = new Date().toISOString();
    changed = true;
  }
  if (changed) saveState(state);
}

function prepareTargetQueue(rawTargets, opts, state, matcher) {
  const eligible = [];
  const oversized = [];
  const current = [];
  const failed = [];
  let stateChanged = false;
  for (const [index, target] of rawTargets.entries()) {
    const packet = buildPeopleExtractionPacket(target.book, target.chapter, {
      properNounMatcher: matcher,
    });
    const measured = { ...target, metrics: targetMetrics(packet) };
    if (!opts.force && currentExtractionIsValid(target, packet)) {
      current.push(measured);
      const key = stateKey(target);
      state.chapters[key] = {
        ...(state.chapters[key] ?? { attempts: 0 }),
        status: 'accepted',
        chapterFingerprint: packet.input.chapterFingerprint,
        updatedAt: new Date().toISOString(),
      };
      stateChanged = true;
    } else if (!opts.retryFailed && state.chapters[stateKey(target)]?.status === 'failed') {
      failed.push(measured);
    } else if (exceedsBulkCeiling(measured, opts)) {
      oversized.push(measured);
    } else {
      eligible.push(measured);
    }
    if (rawTargets.length >= 200 && ((index + 1) % 100 === 0 || index + 1 === rawTargets.length)) {
      console.log(`Measured ${index + 1}/${rawTargets.length} chapters for queue planning`);
    }
  }
  if (stateChanged) saveState(state);

  const ranked = eligible.sort(opts.order === 'smallest' ? compareWorkload : compareBookOrder);
  const selected = opts.limit ? ranked.slice(0, opts.limit) : ranked;
  const waiting = ranked.slice(selected.length);
  const plan = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    scope: opts.all ? { all: true } : { book: opts.book, chapter: opts.chapter },
    policy: {
      order: opts.order,
      maxUnits: opts.allowLarge ? null : opts.maxUnits,
      maxCandidates: opts.allowLarge ? null : opts.maxCandidates,
      maxCostCents: opts.maxCostCents,
      concurrency: opts.concurrency,
    },
    counts: {
      measured: rawTargets.length,
      selected: selected.length,
      waitingAfterLimit: waiting.length,
      deferredOversized: oversized.length,
      alreadyCurrent: current.length,
      skippedFailed: failed.length,
    },
    selected: selected.map(planTarget),
    waitingAfterLimit: waiting.map(planTarget),
    deferredOversized: oversized.sort(compareWorkload).map(planTarget),
    alreadyCurrent: current.map(planTarget),
    skippedFailed: failed.map(planTarget),
  };
  writeJsonAtomic(opts.planOut, plan);

  if (opts.chapter && oversized.length > 0) {
    const item = oversized[0];
    throw new Error(
      `${item.book}/${item.chapter} has ${item.metrics.units} units and ` +
      `${item.metrics.candidates} candidates, above the bulk ceilings of ` +
      `${opts.maxUnits}/${opts.maxCandidates}; inspect the plan and pass --allow-large explicitly`,
    );
  }
  return { selected, waiting, oversized, current, failed, plan };
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return { schemaVersion: 1, chapters: {} };
  return readJson(STATE_FILE);
}

function saveState(state) {
  writeJsonAtomic(STATE_FILE, state);
}

function stateKey(target) {
  return `${target.book}/${target.chapter}`;
}

function updateState(state, target, patch) {
  const key = stateKey(target);
  state.chapters[key] = {
    ...(state.chapters[key] ?? { attempts: 0 }),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveState(state);
}

function createRunControl() {
  return {
    stopRequested: false,
    cancelRequested: false,
    stopReason: null,
    activeRuns: new Map(),
  };
}

async function cancelActiveRuns(control) {
  control.cancelRequested = true;
  const active = [...control.activeRuns.values()];
  if (active.length === 0) return;
  console.error(`Cancelling ${active.length} active Cursor run(s)...`);
  await Promise.all(active.map(async ({ run, target }) => {
    try {
      if (run.supports('cancel')) await run.cancel();
      else console.error(`[${stateKey(target)}] run ${run.id} does not support cancellation`);
    } catch (error) {
      console.error(
        `[${stateKey(target)}] could not cancel ${run.id}: ` +
        `${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }));
}

function installSignalHandlers(control) {
  let interruptCount = 0;
  const onInterrupt = () => {
    interruptCount += 1;
    control.stopRequested = true;
    control.stopReason = 'SIGINT';
    if (interruptCount === 1) {
      console.error(
        `SIGINT received: draining ${control.activeRuns.size} active run(s); ` +
        'no new agents will start. Press Ctrl-C again to cancel active runs.',
      );
      return;
    }
    void cancelActiveRuns(control);
  };
  const onTerminate = () => {
    control.stopRequested = true;
    control.stopReason = 'SIGTERM';
    void cancelActiveRuns(control);
  };
  process.on('SIGINT', onInterrupt);
  process.on('SIGTERM', onTerminate);
  return () => {
    process.off('SIGINT', onInterrupt);
    process.off('SIGTERM', onTerminate);
  };
}

function currentExtractionIsValid(target, packet) {
  const file = extractionPath(target.book, target.chapter);
  if (!fs.existsSync(file)) return false;
  try {
    const extraction = readJson(file);
    if (isCompactPeopleExtraction(extraction)) validateCompactPeopleExtraction(extraction, packet);
    else validatePeopleExtraction(extraction, packet);
    return true;
  } catch {
    return false;
  }
}

function gitChapterAtRef(target, startingRef) {
  const relative = path.relative(REPO_ROOT, chapterPath(target.book, target.chapter));
  const refs = startingRef.startsWith('origin/') ? [startingRef] : [`origin/${startingRef}`, startingRef];
  let lastError;
  for (const ref of refs) {
    try {
      const raw = execFileSync('git', ['show', `${ref}:${relative}`], {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      return { ref, chapter: JSON.parse(raw) };
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Could not read ${relative} from ${startingRef}: ${lastError?.message ?? 'unknown git error'}`);
}

function fetchStartingRef(startingRef) {
  const ref = startingRef.replace(/^origin\//u, '');
  execFileSync('git', ['fetch', 'origin', ref], { cwd: REPO_ROOT, stdio: 'inherit' });
}

function assertCloudSourceMatches(target, localPacket, opts, matcher) {
  const relative = path.relative(REPO_ROOT, chapterPath(target.book, target.chapter));
  const dirty = execFileSync('git', ['status', '--porcelain', '--', relative], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  }).trim();
  if (dirty) throw new Error(`${relative} has local changes; checkpoint or select a clean chapter before cloud extraction`);
  const remote = gitChapterAtRef(target, opts.startingRef);
  const remotePacket = buildPeopleExtractionPacket(target.book, target.chapter, {
    chapterData: remote.chapter,
    chapterFile: chapterPath(target.book, target.chapter),
    properNounMatcher: matcher,
  });
  if (remotePacket.input.chapterFingerprint !== localPacket.input.chapterFingerprint) {
    throw new Error(
      `${target.book}/${target.chapter} differs between the local checkout and ${remote.ref}; ` +
      'the cloud worker would annotate stale text',
    );
  }
}

function artifactPath(target) {
  return path.posix.join('data', 'people', 'extractions', target.book, `${target.chapter}.json`);
}

function packetArtifactPath(target) {
  return path.posix.join('data', 'people', 'generated', 'cloud', target.book, `${target.chapter}.packet.json`);
}

function publishArtifactCommand(target) {
  const output = artifactPath(target);
  const artifact = path.posix.join('/opt/cursor/artifacts', output);
  return `mkdir -p ${path.posix.dirname(artifact)} && cp ${output} ${artifact}`;
}

function initialPrompt(target, opts) {
  const output = artifactPath(target);
  const packet = packetArtifactPath(target);
  return `Perform the person extraction and final editorial audit for ${target.book}/${target.chapter}.

Efficiency boundary: read only prompt-people-extraction-compact.txt, the assigned packet,
data/people/schema/compact-extraction.schema.json, and the assigned seed. Do not inspect
other extractions, validator/library source, Git history, or unrelated files. Do not browse
or generate ad hoc analysis scripts. Aim to finish with one direct write and one validation;
use validation diagnostics only when a correction is necessary.

1. Read prompt-people-extraction-compact.txt completely.
2. Run:
   node scripts/build-people-extraction-packet.mjs --book ${target.book} --chapter ${target.chapter} --out ${packet} --seed-out ${output} --model ${opts.model} --compact-worker
3. Read ${packet}, data/people/schema/compact-extraction.schema.json, and the seeded ${output}.
4. Process every content unit and replace the seed with the complete extraction at ${output}.
5. Run node scripts/validate-people-extraction.mjs ${output} --packet ${packet} --normalize.
6. Publish the validated JSON for the host by running:
   ${publishArtifactCommand(target)}

Do not edit a source chapter. Do not run git commit, git push, gh, or open a pull request. The only tracked file you may modify is ${output}. Finish the complete chapter in this run.`;
}

function retryPrompt(target, errors) {
  const output = artifactPath(target);
  const packet = packetArtifactPath(target);
  return `The host rejected ${output} for ${target.book}/${target.chapter}. Preserve correct work, fix every validation error below, audit the complete chapter again, and rerun:
node scripts/validate-people-extraction.mjs ${output} --packet ${packet} --normalize

Do not commit, push, open a PR, or edit the source chapter.

After validation succeeds, refresh the host artifact by running:
${publishArtifactCommand(target)}

VALIDATION ERRORS:
${errors.slice(0, 400).map((error) => `- ${error}`).join('\n')}`;
}

async function closeAgent(agent) {
  if (!agent) return;
  if (typeof agent[Symbol.asyncDispose] === 'function') await agent[Symbol.asyncDispose]();
  else await agent.close();
}

async function runAgentTurn(agent, prompt, target, opts, phase, control) {
  console.log(`[${stateKey(target)}] ${phase} prompt -> ${agent.agentId}`);
  const run = await agent.send(prompt);
  control.activeRuns.set(run.id, { run, target });
  try {
    if (opts.stream) {
      for await (const event of run.stream()) {
        if (event.type !== 'assistant') continue;
        for (const block of event.message.content) {
          if (block.type === 'text') process.stdout.write(block.text);
        }
      }
    }
    const result = await waitForCursorRun(run, {
      agentId: agent.agentId,
      apiKey: opts.apiKey,
      label: `[${stateKey(target)}] ${phase}`,
    });
    console.log(`[${stateKey(target)}] ${phase} run ${result.id} status=${result.status}`);
    if (result.status !== 'finished') {
      throw new Error(result.error?.message ?? `Cursor run ended with status ${result.status}`);
    }
    return result;
  } finally {
    control.activeRuns.delete(run.id);
  }
}

async function downloadExtraction(agent, target) {
  const wanted = artifactPath(target);
  const artifacts = await agent.listArtifacts();
  const artifact = artifacts.find((item) => item.path === wanted || item.path.endsWith(`/${wanted}`));
  if (!artifact) {
    const available = artifacts.slice(0, 30).map((item) => item.path).join(', ');
    throw new Error(`Cloud agent did not expose ${wanted}; artifacts: ${available || '(none)'}`);
  }
  const bytes = await agent.downloadArtifact(artifact.path);
  try {
    return JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new Error(`${artifact.path} is not valid JSON: ${error.message}`);
  }
}

function validationErrors(error) {
  return error?.errors ?? [error instanceof Error ? error.message : String(error)];
}

function withRunMetadata(extraction, opts, agent, result) {
  return {
    ...extraction,
    run: {
      model: opts.model,
      promptVersion: PEOPLE_CONFIG.promptVersion,
      agentId: agent.agentId,
      runId: result.id,
      completedAt: new Date().toISOString(),
    },
  };
}

function validateDownloadedExtraction(extraction, packet) {
  return isCompactPeopleExtraction(extraction)
    ? validateCompactPeopleExtraction(extraction, packet)
    : validatePeopleExtraction(extraction, packet);
}

async function obtainValidInitialExtraction(agent, target, packet, opts, state, control) {
  let errors = [];
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt += 1) {
    if (control.cancelRequested) {
      throw Object.assign(new Error('Extraction cancelled during shutdown'), { errors });
    }
    const priorAttempts = state.chapters[stateKey(target)]?.attempts ?? 0;
    updateState(state, target, { status: 'extracting', attempts: priorAttempts + 1, phaseAttempt: attempt });
    const prompt = attempt === 1 ? initialPrompt(target, opts) : retryPrompt(target, errors);
    let result;
    try {
      result = await runAgentTurn(agent, prompt, target, opts, 'extraction', control);
      const downloaded = withRunMetadata(await downloadExtraction(agent, target), opts, agent, result);
      const validated = validateDownloadedExtraction(downloaded, packet);
      return { extraction: validated.normalized, result, stats: validated.stats };
    } catch (error) {
      errors = validationErrors(error);
      updateState(state, target, {
        status: control.cancelRequested ? 'interrupted' : 'failed/retryable',
        lastErrors: errors,
      });
      console.error(`[${stateKey(target)}] extraction attempt ${attempt} failed with ${errors.length} error(s)`);
      if (control.cancelRequested) break;
      if (error instanceof CursorAgentError && !error.isRetryable) break;
    }
  }
  throw Object.assign(new Error(`Initial extraction failed after ${opts.maxAttempts} attempt(s)`), { errors });
}

async function processTarget(target, opts, state, control, budget) {
  const key = stateKey(target);
  const packet = target.packet ?? buildPeopleExtractionPacket(target.book, target.chapter, {
    properNounMatcher: opts.properNounMatcher,
  });
  if (!opts.force && currentExtractionIsValid(target, packet)) {
    console.log(`[${key}] already accepted and current; skip`);
    updateState(state, target, { status: 'accepted', chapterFingerprint: packet.input.chapterFingerprint });
    return { status: 'skipped' };
  }
  if (!opts.retryFailed && state.chapters[key]?.status === 'failed') {
    console.log(`[${key}] previous run failed; pass --retry-failed to retry`);
    return { status: 'skipped-failed' };
  }
  if (opts.dryRun) {
    console.log(`[dry-run ${key}] ${packet.units.length} units, ${packet.preflight.candidates.length} candidates`);
    return { status: 'dry-run' };
  }

  assertCloudSourceMatches(target, packet, opts, opts.properNounMatcher);
  updateState(state, target, { status: 'claimed', chapterFingerprint: packet.input.chapterFingerprint });

  let agent;
  try {
    agent = await Agent.create({
      apiKey: opts.apiKey,
      name: `People extraction ${key}`,
      model: modelSelection(opts),
      cloud: {
        repos: [{ url: opts.repoUrl, startingRef: opts.startingRef }],
        workOnCurrentBranch: true,
        autoCreatePR: false,
        skipReviewerRequest: true,
      },
    });
    updateState(state, target, { agentId: agent.agentId });
    const accepted = {
      ...await obtainValidInitialExtraction(agent, target, packet, opts, state, control),
      packet,
    };
    const compact = compactPeopleExtraction(accepted.extraction, accepted.packet);
    validateCompactPeopleExtraction(compact, accepted.packet);
    const rawArchive = path.join(
      PEOPLE_DIR,
      'generated',
      'raw-extractions',
      target.book,
      `${target.chapter}.json`,
    );
    writeJsonAtomic(rawArchive, accepted.extraction);
    writeTextAtomic(
      extractionPath(target.book, target.chapter),
      serializeCompactPeopleExtraction(compact),
    );
    updateState(state, target, {
      status: 'accepted',
      runId: accepted.result.id,
      acceptedPath: path.relative(REPO_ROOT, extractionPath(target.book, target.chapter)),
      repairs: accepted.stats.repairs,
      repairsPendingReview: accepted.extraction.translationRepairs.length,
      lastErrors: [],
    });
    console.log(
      `[${key}] accepted: ${accepted.stats.people} people, ${accepted.stats.mentions} mentions, ` +
      `${accepted.stats.claims} claims, ${accepted.stats.repairs} translation repair proposal(s)`,
    );
    return { status: 'accepted', stats: accepted.stats };
  } catch (error) {
    const errors = validationErrors(error);
    const status = control.cancelRequested ? 'interrupted' : 'failed';
    updateState(state, target, { status, lastErrors: errors });
    console.error(`[${key}] ${status}: ${errors[0]}`);
    return { status, errors };
  } finally {
    if (agent) {
      try {
        const usage = await agent.getUsage();
        updateState(state, target, { usage });
        budget.chargedCents += usage.cost?.chargedCents ?? 0;
        const dollars = usage.cost ? `; charged=$${(usage.cost.chargedCents / 100).toFixed(2)}` : '';
        console.log(
          `[${key}] Cursor usage: ${usage.usage.totalTokens.toLocaleString('en-US')} tokens${dollars}`,
        );
      } catch (error) {
        console.warn(
          `[${key}] could not read Cursor usage: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    await closeAgent(agent);
  }
}

function selfTest() {
  const small = { book: 'fixture', chapter: '002', metrics: {
    units: 100, candidates: 200, workerBytes: 10_000, workloadScore: 42_000,
  } };
  const large = { book: 'fixture', chapter: '001', metrics: {
    units: 400, candidates: 900, workerBytes: 30_000, workloadScore: 174_000,
  } };
  const opts = { allowLarge: false, maxUnits: 250, maxCandidates: 600 };
  if ([large, small].sort(compareWorkload)[0] !== small) {
    throw new Error('Workload ordering did not put the smaller chapter first');
  }
  if (exceedsBulkCeiling(small, opts) || !exceedsBulkCeiling(large, opts)) {
    throw new Error('Bulk size ceilings did not classify fixture chapters');
  }
  if (dollarCents('10.25', '--max-cost') !== 1025 || dollarCents('unlimited', '--max-cost') !== null) {
    throw new Error('Cost ceiling parser returned the wrong amount');
  }
  console.log('sdk-people-extract scheduler self-test: ok');
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  if (!opts.dryRun && !opts.apiKey) throw new Error('CURSOR_API_KEY is required. Get a key from Cursor -> Integrations.');
  const state = loadState();
  if (!opts.dryRun) recoverInterruptedState(state);
  opts.properNounMatcher = loadProperNounMatcher();
  const queue = prepareTargetQueue(chapterTargets(opts), opts, state, opts.properNounMatcher);
  const targets = queue.selected;
  const planPath = path.relative(REPO_ROOT, opts.planOut);
  console.log(
    `Queue plan ${planPath}: selected=${targets.length}, waiting=${queue.waiting.length}, ` +
    `oversized=${queue.oversized.length}, current=${queue.current.length}, failed=${queue.failed.length}`,
  );
  for (const target of targets.slice(0, 20)) {
    console.log(
      `  ${stateKey(target)}: ${target.metrics.units} units, ${target.metrics.candidates} candidates, ` +
      `${(target.metrics.workerBytes / 1024).toFixed(1)} KiB worker packet`,
    );
  }
  if (targets.length > 20) console.log(`  ... ${targets.length - 20} more selected chapter(s)`);
  console.log(
    `Cursor Cloud concurrency=${opts.concurrency}; model=${opts.model} effort=${opts.effort} ` +
    `fast=${opts.fast ? 'on' : 'off'}; run cost ceiling=` +
    `${opts.maxCostCents === null ? 'unlimited' : `$${(opts.maxCostCents / 100).toFixed(2)}`}; ` +
    'no worker git pushes',
  );
  if (!opts.dryRun && targets.length > 0) fetchStartingRef(opts.startingRef);

  const control = createRunControl();
  const removeSignalHandlers = opts.dryRun ? () => {} : installSignalHandlers(control);
  const budget = { chargedCents: 0 };
  let nextIndex = 0;
  const results = [];
  const workers = Array.from({ length: Math.min(opts.concurrency, targets.length) }, async () => {
    while (nextIndex < targets.length && !control.stopRequested) {
      if (opts.maxCostCents !== null && budget.chargedCents >= opts.maxCostCents) {
        control.stopRequested = true;
        control.stopReason = 'cost-ceiling';
        console.error(
          `Run cost ceiling reached at $${(budget.chargedCents / 100).toFixed(2)}; ` +
          'no new agents will start.',
        );
        break;
      }
      const target = targets[nextIndex++];
      results.push(await processTarget(target, opts, state, control, budget));
    }
  });
  try {
    await Promise.all(workers);
  } finally {
    removeSignalHandlers();
  }

  const counts = new Map();
  for (const result of results) counts.set(result.status, (counts.get(result.status) ?? 0) + 1);
  console.log(`Finished: ${[...counts].map(([status, count]) => `${status}=${count}`).join(', ') || 'no targets'}`);
  console.log(
    `Charged this invocation: $${(budget.chargedCents / 100).toFixed(2)}; ` +
    `not started: ${targets.length - nextIndex}; stop reason: ${control.stopReason ?? 'queue-complete'}`,
  );
  console.log(
    'Accepted files remain local. Commit locally in batches; push codex/people-glossary-staging only at a deliberate checkpoint.',
  );
  if (counts.has('failed')) process.exitCode = 2;
  else if (control.stopReason === 'SIGINT' || control.stopReason === 'SIGTERM') process.exitCode = 130;
}

if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
