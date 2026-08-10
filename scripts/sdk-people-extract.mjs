#!/usr/bin/env node

import { Agent, CursorAgentError } from '@cursor/sdk';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
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
import {
  compactPeopleExtraction,
  isCompactPeopleExtraction,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import { applyTranslationRepairs } from './lib/people-translation-repairs.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';

loadDotenv(REPO_ROOT);

const DEFAULT_MODEL = 'grok-4.5';
const DEFAULT_REPO_URL = 'https://github.com/GarrettPetersen/records-of-the-grand-historian';
const DEFAULT_STARTING_REF = 'codex/people-glossary-staging';
const STATE_FILE = path.join(PEOPLE_DIR, 'generated', 'extraction-state.json');
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
  --max-attempts N     Validation attempts per phase (default: 3).
  --model MODEL        Cursor model (default: ${DEFAULT_MODEL}).
  --effort LEVEL       Model effort: low, medium, or high (default: medium).
  --fast               Enable the model's fast variant (default: off).
  --repo URL           Repository URL available to cloud agents.
  --starting-ref REF   Remote branch/ref agents read (default: ${DEFAULT_STARTING_REF}).
  --dry-run            Build and summarize packets without calling Cursor.
  --force              Re-extract chapters with a currently valid sidecar.
  --retry-failed       Include chapters whose latest state is failed.
  --stream             Stream assistant text; requires concurrency 1.

This runner is cloud-only. Workers never commit, push, or open pull requests.
The host downloads artifacts, validates them, applies exact translation repairs,
and accumulates accepted chapters locally for a later staging batch.`);
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
    maxAttempts: 3,
    model: process.env.SDK_PEOPLE_MODEL ?? DEFAULT_MODEL,
    effort: process.env.SDK_PEOPLE_EFFORT ?? 'medium',
    fast: false,
    repoUrl: process.env.SDK_PEOPLE_REPO ?? DEFAULT_REPO_URL,
    startingRef: process.env.SDK_PEOPLE_STARTING_REF ?? DEFAULT_STARTING_REF,
    apiKey: process.env.CURSOR_API_KEY,
    dryRun: false,
    force: false,
    retryFailed: false,
    stream: false,
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
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  if (!['low', 'medium', 'high'].includes(opts.effort)) throw new Error('--effort must be low, medium, or high');
  if (opts.chapter && !opts.book) throw new Error('--chapter requires --book');
  if (!opts.book && !opts.all) throw new Error('Specify --book or explicitly pass --all');
  if (opts.all && (opts.book || opts.chapter)) throw new Error('--all cannot be combined with --book or --chapter');
  if (opts.stream && opts.concurrency !== 1) throw new Error('--stream requires --concurrency 1');
  return opts;
}

function modelSelection(opts) {
  const params = [{ id: 'fast', value: opts.fast ? 'true' : 'false' }];
  if (/^grok-4\.(?:5|6)$/u.test(opts.model)) params.unshift({ id: 'effort', value: opts.effort });
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

function repairPrompt(target) {
  const output = artifactPath(target);
  return `The host validated the proposed translation repairs in ${output}. Reconcile the extraction against only those exact proposals now.

1. Run:
   node scripts/apply-people-translation-repairs.mjs --book ${target.book} --chapter ${target.chapter} --extraction ${output}
2. If the command reports changed spans, new candidates, or other validation failures, inspect only the changed units and repair ${output}. Do not add, remove, or rewrite a translation repair.
3. Run node scripts/validate-people-extraction.mjs ${output} --normalize until it passes.
4. Publish the reconciled JSON for the host by running:
   ${publishArtifactCommand(target)}

The source chapter may be modified in this isolated cloud workspace only by the repair command. Do not make any other source edit. Do not commit, push, run gh, or open a pull request. The host will independently apply the exact proposals and validate the final extraction against its own revised packet.`;
}

function repairRetryPrompt(target, errors) {
  const output = artifactPath(target);
  return `The host still rejected the reconciled extraction for ${target.book}/${target.chapter}. Preserve every validated translation-repair contract exactly.

If any repair still has status proposed, first run:
node scripts/apply-people-translation-repairs.mjs --book ${target.book} --chapter ${target.chapter} --extraction ${output}

Then inspect only the changed units, fix every extraction error below, and run:
node scripts/validate-people-extraction.mjs ${output} --normalize

After validation succeeds, refresh the host artifact by running:
${publishArtifactCommand(target)}

Do not make any source edit except through the repair command. Do not commit, push, run gh, or open a pull request.

VALIDATION ERRORS:
${errors.slice(0, 400).map((error) => `- ${error}`).join('\n')}`;
}

async function closeAgent(agent) {
  if (!agent) return;
  if (typeof agent[Symbol.asyncDispose] === 'function') await agent[Symbol.asyncDispose]();
  else agent.close();
}

async function runAgentTurn(agent, prompt, target, opts, phase) {
  console.log(`[${stateKey(target)}] ${phase} prompt -> ${agent.agentId}`);
  const run = await agent.send(prompt);
  if (opts.stream) {
    for await (const event of run.stream()) {
      if (event.type !== 'assistant') continue;
      for (const block of event.message.content) {
        if (block.type === 'text') process.stdout.write(block.text);
      }
    }
  }
  const result = await run.wait();
  console.log(`[${stateKey(target)}] ${phase} run ${result.id} status=${result.status}`);
  if (result.status !== 'finished') {
    throw new Error(result.error?.message ?? `Cursor run ended with status ${result.status}`);
  }
  return result;
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

function repairContract(repair) {
  const { status: _status, ...contract } = repair;
  return contract;
}

function assertSameRepairContract(initial, final) {
  const expected = initial.map(repairContract);
  const actual = final.map(repairContract);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error('The reconciliation phase changed the validated translation-repair contract');
  }
  if (!final.every((repair) => repair.status === 'applied')) {
    throw new Error('Every reconciled translation repair must have status applied');
  }
}

async function obtainValidInitialExtraction(agent, target, packet, opts, state) {
  let errors = [];
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt += 1) {
    const priorAttempts = state.chapters[stateKey(target)]?.attempts ?? 0;
    updateState(state, target, { status: 'extracting', attempts: priorAttempts + 1, phaseAttempt: attempt });
    const prompt = attempt === 1 ? initialPrompt(target, opts) : retryPrompt(target, errors);
    let result;
    try {
      result = await runAgentTurn(agent, prompt, target, opts, 'extraction');
      const downloaded = withRunMetadata(await downloadExtraction(agent, target), opts, agent, result);
      const validated = validateDownloadedExtraction(downloaded, packet);
      return { extraction: validated.normalized, result, stats: validated.stats };
    } catch (error) {
      errors = validationErrors(error);
      updateState(state, target, { status: 'failed/retryable', lastErrors: errors });
      console.error(`[${stateKey(target)}] extraction attempt ${attempt} failed with ${errors.length} error(s)`);
      if (error instanceof CursorAgentError && !error.isRetryable) break;
    }
  }
  throw Object.assign(new Error(`Initial extraction failed after ${opts.maxAttempts} attempt(s)`), { errors });
}

async function obtainValidReconciledExtraction(agent, target, initial, opts, state) {
  const localChapter = readJson(chapterPath(target.book, target.chapter));
  const applied = applyTranslationRepairs(localChapter, initial.translationRepairs);
  const revisedPacket = buildPeopleExtractionPacket(target.book, target.chapter, {
    chapterData: applied.chapter,
    chapterFile: chapterPath(target.book, target.chapter),
    properNounMatcher: opts.properNounMatcher,
  });
  let errors = [];
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt += 1) {
    updateState(state, target, { status: 'reconciling', repairAttempt: attempt });
    const prompt = attempt === 1 ? repairPrompt(target) : repairRetryPrompt(target, errors);
    try {
      const result = await runAgentTurn(agent, prompt, target, opts, 'repair reconciliation');
      const downloaded = withRunMetadata(await downloadExtraction(agent, target), opts, agent, result);
      assertSameRepairContract(initial.translationRepairs, downloaded.translationRepairs);
      const validated = validateDownloadedExtraction(downloaded, revisedPacket);
      return {
        chapter: applied.chapter,
        extraction: validated.normalized,
        packet: revisedPacket,
        result,
        stats: validated.stats,
      };
    } catch (error) {
      errors = validationErrors(error);
      updateState(state, target, { status: 'failed/retryable', lastErrors: errors });
      console.error(`[${stateKey(target)}] repair attempt ${attempt} failed with ${errors.length} error(s)`);
      if (error instanceof CursorAgentError && !error.isRetryable) break;
    }
  }
  throw Object.assign(new Error(`Repair reconciliation failed after ${opts.maxAttempts} attempt(s)`), { errors });
}

async function processTarget(target, opts, state) {
  const key = stateKey(target);
  const packet = buildPeopleExtractionPacket(target.book, target.chapter, {
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
    const initial = await obtainValidInitialExtraction(agent, target, packet, opts, state);

    let accepted;
    if (initial.extraction.translationRepairs.length > 0) {
      accepted = await obtainValidReconciledExtraction(
        agent,
        target,
        initial.extraction,
        opts,
        state,
      );
      writeJsonAtomic(chapterPath(target.book, target.chapter), accepted.chapter);
    } else {
      accepted = { ...initial, packet };
    }
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
      lastErrors: [],
    });
    console.log(
      `[${key}] accepted: ${accepted.stats.people} people, ${accepted.stats.mentions} mentions, ` +
      `${accepted.stats.claims} claims, ${accepted.stats.repairs} translation repair(s)`,
    );
    return { status: 'accepted', stats: accepted.stats };
  } catch (error) {
    const errors = validationErrors(error);
    updateState(state, target, { status: 'failed', lastErrors: errors });
    console.error(`[${key}] failed: ${errors[0]}`);
    return { status: 'failed', errors };
  } finally {
    await closeAgent(agent);
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.dryRun && !opts.apiKey) throw new Error('CURSOR_API_KEY is required. Get a key from Cursor -> Integrations.');
  if (!opts.dryRun) fetchStartingRef(opts.startingRef);
  const state = loadState();
  opts.properNounMatcher = loadProperNounMatcher();
  let targets = chapterTargets(opts);
  if (opts.limit) targets = targets.slice(0, opts.limit);
  console.log(
    `Selected ${targets.length} chapter(s); Cursor Cloud concurrency=${opts.concurrency}; ` +
    `model=${opts.model} effort=${opts.effort} fast=${opts.fast ? 'on' : 'off'}; no worker git pushes`,
  );

  let nextIndex = 0;
  const results = [];
  const workers = Array.from({ length: Math.min(opts.concurrency, targets.length) }, async () => {
    while (nextIndex < targets.length) {
      const target = targets[nextIndex++];
      results.push(await processTarget(target, opts, state));
    }
  });
  await Promise.all(workers);

  const counts = new Map();
  for (const result of results) counts.set(result.status, (counts.get(result.status) ?? 0) + 1);
  console.log(`Finished: ${[...counts].map(([status, count]) => `${status}=${count}`).join(', ') || 'no targets'}`);
  console.log(
    'Accepted files remain local. Commit locally in batches; push codex/people-glossary-staging only at a deliberate checkpoint.',
  );
  if (counts.has('failed')) process.exitCode = 2;
}

if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
