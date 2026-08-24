#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildCompactPeopleExtractionSeed,
  buildPeopleChunkWorkerPacket,
  buildPeopleExtractionPacket,
  buildPeopleWorkerPacket,
} from './build-people-extraction-packet.mjs';
import {
  DEFAULT_PEOPLE_QUEUE_BASE_REF,
  DEFAULT_PEOPLE_QUEUE_BRANCH,
  DEFAULT_PEOPLE_QUEUE_REMOTE,
  DEFAULT_PEOPLE_STAGING_BRANCH,
  chapterKey,
  claimIsActive,
  claimRemotePeopleTargets,
  extractionIsCurrent,
  fetchPeopleQueueBase,
  listPeopleChapterTargets,
  markRemotePeopleClaims,
  mutateRemotePeopleWorkLedger,
  pruneExpiredClaims,
  pruneMergedClaims,
  readRemotePeopleWorkLedger,
  releaseRemotePeopleClaims,
  reservePeopleTargetsInLedger,
  syncLocalCursorReservations,
  validatePeopleWorkLedger,
} from './lib/people-work-queue.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  extractionPath,
  readJson,
  writeJsonAtomic,
  writeTextAtomic,
} from './lib/people-content.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { assertDurableCareerCoverage } from './lib/people-extraction-acceptance.mjs';
import {
  DEFAULT_PEOPLE_CHUNK_CONTEXT_UNITS,
  assembleCompactPeopleChunks,
  buildPeopleChunkPacket,
  normalizePeopleExtractionChunkPlan,
  planPeopleExtractionChunks,
  splitPeopleExtractionChunk,
} from './lib/people-extraction-chunks.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const DEFAULT_MAX_UNITS = 60;
const DEFAULT_MAX_CANDIDATES = 150;
const DEFAULT_MAX_WORKER_BYTES = 48 * 1024;

function usage() {
  console.log(`Usage:
  node scripts/people-work-queue.mjs sync-cursor [options]
  node scripts/people-work-queue.mjs plan-grokbot --worker ID [options]
  node scripts/people-work-queue.mjs claim-grokbot --worker ID [options]
  node scripts/people-work-queue.mjs resume-grokbot --worker ID --book BOOK --chapter NNN
  node scripts/people-work-queue.mjs validate-grokbot --worker ID --book BOOK --chapter NNN [--chunk-id ID]
  node scripts/people-work-queue.mjs assemble-grokbot --worker ID --book BOOK --chapter NNN
  node scripts/people-work-queue.mjs submit-grokbot --worker ID --book BOOK --chapter NNN [options]
  node scripts/people-work-queue.mjs status [options]
  node scripts/people-work-queue.mjs reconcile [options]
  node scripts/people-work-queue.mjs release --lane LANE --worker ID --book BOOK --chapter NNN
  node scripts/people-work-queue.mjs --self-test

Shared options:
  --remote NAME        Git remote (default: ${DEFAULT_PEOPLE_QUEUE_REMOTE}).
  --queue-branch NAME  Atomic ledger branch (default: ${DEFAULT_PEOPLE_QUEUE_BRANCH}).
  --base-ref REF       Completed-work reference (default: ${DEFAULT_PEOPLE_QUEUE_BASE_REF}).
  --worker ID          Stable lane worker ID.
  --book BOOK          Limit work to one book.
  --chapter NNN        Limit work to one chapter; requires --book.
  --limit N            Number of chapters to claim (default: 1).

Grok Bot claim options:
  --max-units N        Whole-chapter unit ceiling (default: ${DEFAULT_MAX_UNITS}).
  --max-candidates N   Candidate ceiling (default: ${DEFAULT_MAX_CANDIDATES}).
  --max-worker-kib N   Compact packet ceiling (default: ${DEFAULT_MAX_WORKER_BYTES / 1024}).

Submit options:
  --staging-branch REF Pull request base (default: ${DEFAULT_PEOPLE_STAGING_BRANCH}).
  --no-pr              Push the worker branch without opening a PR.
  --force              Required to release a claim owned by another worker.`);
}

function positiveInteger(value, flag) {
  if (!/^\d+$/u.test(value) || Number(value) < 1) throw new Error(`${flag} must be a positive integer`);
  return Number(value);
}

function parseArgs(argv) {
  const opts = {
    command: null,
    remote: DEFAULT_PEOPLE_QUEUE_REMOTE,
    queueBranch: DEFAULT_PEOPLE_QUEUE_BRANCH,
    baseRef: DEFAULT_PEOPLE_QUEUE_BASE_REF,
    stagingBranch: DEFAULT_PEOPLE_STAGING_BRANCH,
    worker: null,
    lane: null,
    book: null,
    chapter: null,
    limit: 1,
    maxUnits: DEFAULT_MAX_UNITS,
    maxCandidates: DEFAULT_MAX_CANDIDATES,
    maxWorkerBytes: DEFAULT_MAX_WORKER_BYTES,
    noPr: false,
    force: false,
    chunkId: null,
    selfTest: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`);
      return value;
    };
    if (!arg.startsWith('--') && !opts.command) opts.command = arg;
    else if (arg === '--remote') opts.remote = next();
    else if (arg === '--queue-branch') opts.queueBranch = next();
    else if (arg === '--base-ref') opts.baseRef = next();
    else if (arg === '--staging-branch') opts.stagingBranch = next();
    else if (arg === '--worker') opts.worker = next();
    else if (arg === '--lane') opts.lane = next();
    else if (arg === '--book') opts.book = next();
    else if (arg === '--chapter') opts.chapter = String(positiveInteger(next(), arg)).padStart(3, '0');
    else if (arg === '--limit') opts.limit = positiveInteger(next(), arg);
    else if (arg === '--max-units') opts.maxUnits = positiveInteger(next(), arg);
    else if (arg === '--max-candidates') opts.maxCandidates = positiveInteger(next(), arg);
    else if (arg === '--max-worker-kib') opts.maxWorkerBytes = positiveInteger(next(), arg) * 1024;
    else if (arg === '--chunk-id') opts.chunkId = next();
    else if (arg === '--no-pr') opts.noPr = true;
    else if (arg === '--force') opts.force = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  if (opts.selfTest) return opts;
  if (!opts.command) throw new Error('A command is required');
  if (opts.chapter && !opts.book) throw new Error('--chapter requires --book');
  return opts;
}

function queueOptions(opts) {
  return {
    remote: opts.remote,
    branch: opts.queueBranch,
    baseRef: opts.baseRef,
  };
}

function safeWorkerId(worker) {
  return worker.toLowerCase().replace(/[^a-z0-9-]+/gu, '-').replace(/^-|-$/gu, '') || 'worker';
}

function assignmentDirectory(worker, target) {
  return path.join(
    PEOPLE_DIR,
    'generated',
    'grokbot',
    safeWorkerId(worker),
    `${target.book}-${target.chapter}`,
  );
}

function grokBranch(worker, target) {
  return `grokbot/people-${target.book}-${target.chapter}-${safeWorkerId(worker)}`;
}

function planGrokbotChunks(packet, opts) {
  let chunks = planPeopleExtractionChunks(packet, {
    maxUnits: opts.maxUnits,
    maxCandidates: opts.maxCandidates,
    contextUnits: DEFAULT_PEOPLE_CHUNK_CONTEXT_UNITS,
  });
  for (let index = 0; index < chunks.length;) {
    const chunk = chunks[index];
    const bytes = Buffer.byteLength(JSON.stringify(buildPeopleChunkWorkerPacket(packet, chunk)));
    if (bytes <= opts.maxWorkerBytes || chunk.units === 1) {
      index += 1;
      continue;
    }
    chunks = normalizePeopleExtractionChunkPlan(packet, [
      ...chunks.slice(0, index),
      ...splitPeopleExtractionChunk(packet, chunk, {
        contextUnits: DEFAULT_PEOPLE_CHUNK_CONTEXT_UNITS,
      }),
      ...chunks.slice(index + 1),
    ], { contextUnits: DEFAULT_PEOPLE_CHUNK_CONTEXT_UNITS });
  }
  return chunks;
}

function prepareGrokbotAssignment(target, packet, opts) {
  const directory = assignmentDirectory(opts.worker, target);
  const assignmentFile = path.join(directory, 'assignment.json');
  const outputFile = extractionPath(target.book, target.chapter);
  const chunks = target.chunks ?? planGrokbotChunks(packet, opts);
  const whole = chunks.length === 1 && chunks[0].start === 0 && chunks[0].end === packet.units.length;
  const chunkAssignments = [];
  if (whole) {
    const packetFile = path.join(directory, 'packet.json');
    writeTextAtomic(packetFile, `${JSON.stringify(buildPeopleWorkerPacket(packet))}\n`);
    if (!fs.existsSync(outputFile)) {
      writeTextAtomic(
        outputFile,
        serializeCompactPeopleExtraction(buildCompactPeopleExtractionSeed(packet, 'Grok Bot')),
      );
    } else if (!target.reused) {
      throw new Error(`Refusing to overwrite existing output for a new claim: ${path.relative(REPO_ROOT, outputFile)}`);
    }
    chunkAssignments.push({
      id: chunks[0].id,
      packet: path.relative(REPO_ROOT, packetFile),
      output: path.relative(REPO_ROOT, outputFile),
      validate: `npm run people:grokbot:validate -- --worker ${opts.worker} --book ${target.book} --chapter ${target.chapter}`,
    });
  } else {
    for (const chunk of chunks) {
      const packetFile = path.join(directory, `chunk-${chunk.id}.packet.json`);
      const chunkOutput = path.join(directory, `chunk-${chunk.id}.output.json`);
      const chunkPacket = buildPeopleChunkPacket(packet, chunk);
      writeTextAtomic(packetFile, `${JSON.stringify(buildPeopleChunkWorkerPacket(packet, chunk))}\n`);
      if (!fs.existsSync(chunkOutput)) {
        writeTextAtomic(
          chunkOutput,
          serializeCompactPeopleExtraction(buildCompactPeopleExtractionSeed(chunkPacket, 'Grok Bot')),
        );
      } else if (!target.reused) {
        throw new Error(`Refusing to overwrite existing chunk output: ${path.relative(REPO_ROOT, chunkOutput)}`);
      }
      chunkAssignments.push({
        id: chunk.id,
        start: chunk.start,
        end: chunk.end,
        contextStart: chunk.contextStart,
        contextEnd: chunk.contextEnd,
        packet: path.relative(REPO_ROOT, packetFile),
        output: path.relative(REPO_ROOT, chunkOutput),
        validate: `npm run people:grokbot:validate -- --worker ${opts.worker} --book ${target.book} --chapter ${target.chapter} --chunk-id ${chunk.id}`,
      });
    }
  }
  const assignment = {
    schemaVersion: 1,
    lane: 'grokbot',
    worker: opts.worker,
    book: target.book,
    chapter: target.chapter,
    branch: grokBranch(opts.worker, target),
    mode: whole ? 'whole' : 'chunked',
    prompt: 'prompt-people-extraction-compact.txt',
    schema: 'data/people/schema/compact-extraction.schema.json',
    output: path.relative(REPO_ROOT, outputFile),
    chunks: chunkAssignments,
    assemble: whole
      ? null
      : `npm run people:grokbot:assemble -- --worker ${opts.worker} --book ${target.book} --chapter ${target.chapter}`,
    submit: `npm run people:grokbot:submit -- --worker ${opts.worker} --book ${target.book} --chapter ${target.chapter}`,
  };
  writeJsonAtomic(assignmentFile, assignment);
  return { assignment, assignmentFile };
}

function printGrokbotAssignment(target, source, prepared) {
  const { assignment, assignmentFile } = prepared;
  console.log(
    `${target.reused ? 'Resumed' : 'Claimed'} ${chapterKey(target)}: ${source.units} units, ` +
    `${source.candidates} candidates, ${source.chunkCount} sealed chunk(s), ` +
    `max ${(source.maxWorkerBytes / 1024).toFixed(1)} KiB, ` +
    `total ${(source.workerBytes / 1024).toFixed(1)} KiB`,
  );
  console.log(`Assignment: ${path.relative(REPO_ROOT, assignmentFile)}`);
  console.log(`Create/switch to ${assignment.branch}, then read only the prompt, packet, schema, and seeded output.`);
  for (const chunk of assignment.chunks) console.log(`Validate ${chunk.id}: ${chunk.validate}`);
  if (assignment.assemble) console.log(`Assemble: ${assignment.assemble}`);
  console.log(`Submit:   ${assignment.submit}`);
}

function chunkPlanMetrics(packet, chunks) {
  const sizes = chunks.map((chunk) =>
    Buffer.byteLength(JSON.stringify(buildPeopleChunkWorkerPacket(packet, chunk)))
  );
  return {
    units: packet.units.length,
    candidates: packet.preflight.candidates.length,
    workerBytes: sizes.reduce((sum, bytes) => sum + bytes, 0),
    maxWorkerBytes: Math.max(...sizes),
    chunkCount: chunks.length,
  };
}

function chaptersWithExtractionFiles() {
  const found = new Set();
  const root = path.join(PEOPLE_DIR, 'extractions');
  if (!fs.existsSync(root)) return found;
  for (const book of fs.readdirSync(root, { withFileTypes: true })) {
    if (!book.isDirectory()) continue;
    for (const file of fs.readdirSync(path.join(root, book.name))) {
      if (/^\d{3}\.json$/u.test(file)) found.add(`${book.name}/${file.slice(0, 3)}`);
    }
  }
  return found;
}

function eligibleGrokTargets(opts, ledger) {
  const matcher = loadProperNounMatcher();
  const eligible = [];
  const extracted = chaptersWithExtractionFiles();
  const targets = listPeopleChapterTargets({ book: opts.book, chapter: opts.chapter }).sort((left, right) => {
    const leftClaim = ledger.claims[chapterKey(left)];
    const rightClaim = ledger.claims[chapterKey(right)];
    const leftOwned = leftClaim?.lane === 'grokbot' && leftClaim.worker === opts.worker && leftClaim.status === 'claimed';
    const rightOwned = rightClaim?.lane === 'grokbot' && rightClaim.worker === opts.worker && rightClaim.status === 'claimed';
    return Number(rightOwned) - Number(leftOwned) || left.sourceBytes - right.sourceBytes;
  });
  for (const target of targets) {
    // Existing extraction files, including stale ones, stay in the Cursor upgrade lane.
    if (extracted.has(chapterKey(target))) continue;
    const claim = ledger.claims[chapterKey(target)];
    if (claimIsActive(claim) && !(
      claim.lane === 'grokbot' && claim.worker === opts.worker && claim.status === 'claimed'
    )) continue;
    const packet = buildPeopleExtractionPacket(target.book, target.chapter, { properNounMatcher: matcher });
    const chunks = planGrokbotChunks(packet, opts);
    const metrics = chunkPlanMetrics(packet, chunks);
    eligible.push({
      ...target,
      ...metrics,
      chunks,
      packet,
      chapterFingerprint: packet.input.chapterFingerprint,
    });
    if (eligible.length >= Math.max(opts.limit * 12, 12)) break;
  }
  return eligible.sort((left, right) =>
    left.chunkCount - right.chunkCount ||
    left.workerBytes - right.workerBytes ||
    left.units - right.units ||
    chapterKey(left).localeCompare(chapterKey(right))
  );
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: options.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`${command} ${args.join(' ')} failed: ${(result.stderr || result.stdout || '').trim()}`);
  }
  return result;
}

function readGrokbotAssignment(worker, target) {
  const file = path.join(assignmentDirectory(worker, target), 'assignment.json');
  if (!fs.existsSync(file)) throw new Error(`Missing Grok Bot assignment: ${path.relative(REPO_ROOT, file)}`);
  return readJson(file);
}

function chunksFromAssignment(packet, assignment) {
  return normalizePeopleExtractionChunkPlan(packet, assignment.chunks.map((row) => ({
    id: row.id,
    start: row.start,
    end: row.end,
  })), { contextUnits: DEFAULT_PEOPLE_CHUNK_CONTEXT_UNITS });
}

function validateGrokbotOutput(target, options = {}) {
  const packet = buildPeopleExtractionPacket(target.book, target.chapter, {
    properNounMatcher: loadProperNounMatcher(),
  });
  let ownedPacket = packet;
  let output = extractionPath(target.book, target.chapter);
  if (options.chunkId) {
    if (!options.worker) throw new Error('--chunk-id requires --worker');
    const assignment = readGrokbotAssignment(options.worker, target);
    const row = assignment.chunks.find((item) => item.id === options.chunkId);
    if (!row?.start && row?.start !== 0) throw new Error(`Unknown assignment chunk: ${options.chunkId}`);
    const chunk = chunksFromAssignment(packet, assignment).find((item) => item.id === row.id);
    ownedPacket = buildPeopleChunkPacket(packet, chunk);
    output = path.resolve(REPO_ROOT, row.output);
  }
  if (!fs.existsSync(output)) throw new Error(`Missing Grok Bot output: ${path.relative(REPO_ROOT, output)}`);
  const validated = validateCompactPeopleExtraction(readJson(output), ownedPacket);
  assertDurableCareerCoverage(validated.normalized, ownedPacket);
  return { output, validated, packet: ownedPacket };
}

function assembleGrokbotOutput(target, opts) {
  if (!opts.worker) throw new Error('assemble-grokbot requires --worker');
  const assignment = readGrokbotAssignment(opts.worker, target);
  if (assignment.mode === 'whole') return validateGrokbotOutput(target, opts);
  const packet = buildPeopleExtractionPacket(target.book, target.chapter, {
    properNounMatcher: loadProperNounMatcher(),
  });
  const planned = chunksFromAssignment(packet, assignment);
  const parts = assignment.chunks.map((row) => {
    const chunk = planned.find((item) => item.id === row.id);
    const output = path.resolve(REPO_ROOT, row.output);
    if (!fs.existsSync(output)) throw new Error(`Missing Grok Bot chunk output: ${row.output}`);
    const extraction = readJson(output);
    const ownedPacket = buildPeopleChunkPacket(packet, chunk);
    const validated = validateCompactPeopleExtraction(extraction, ownedPacket);
    assertDurableCareerCoverage(validated.normalized, ownedPacket);
    return { chunk, extraction };
  });
  const compact = assembleCompactPeopleChunks(packet, parts, {
    model: 'Grok Bot-chunked',
    promptVersion: readJson(path.join(PEOPLE_DIR, 'config.json')).promptVersion,
    agentId: null,
    runId: null,
    completedAt: new Date().toISOString(),
    chunks: parts.map(({ chunk }) => ({
      id: chunk.id,
      start: chunk.start,
      end: chunk.end,
    })),
  });
  const validated = validateCompactPeopleExtraction(compact, packet);
  assertDurableCareerCoverage(validated.normalized, packet);
  const output = extractionPath(target.book, target.chapter);
  writeTextAtomic(output, serializeCompactPeopleExtraction(compact));
  return { output, validated, packet };
}

function currentBranch() {
  return run('git', ['branch', '--show-current']).stdout.trim();
}

function assertGrokbotClaim(worker, target, opts) {
  fetchPeopleQueueBase(queueOptions(opts));
  const claim = readRemotePeopleWorkLedger(queueOptions(opts)).claims[chapterKey(target)];
  if (
    !claimIsActive(claim) ||
    claim.lane !== 'grokbot' ||
    claim.worker !== worker ||
    claim.status !== 'claimed'
  ) {
    throw new Error(
      `${chapterKey(target)} is not an active claimed assignment for grokbot/${worker}`,
    );
  }
  return claim;
}

function assertOnlyOutputChanged(output) {
  const status = run('git', ['status', '--porcelain']).stdout.trim().split('\n').filter(Boolean);
  const allowed = path.relative(REPO_ROOT, output);
  const unexpected = status.filter((line) => line.slice(3) !== allowed);
  if (unexpected.length) {
    throw new Error(`Grok Bot worktree contains unrelated changes:\n${unexpected.join('\n')}`);
  }
}

async function syncCursor(opts) {
  fetchPeopleQueueBase(queueOptions(opts));
  const worker = opts.worker ?? `${os.hostname()}-cursor-recovery`;
  const synced = syncLocalCursorReservations({ ...queueOptions(opts), worker });
  console.log(
    `Cursor reservations synchronized: recovery=${synced.result.recovery.length}, ` +
    `local-ready=${synced.result.ready.length}, merged-pruned=${synced.result.merged.length}`,
  );
}

async function claimGrokbot(opts) {
  if (!opts.worker) throw new Error('claim-grokbot requires --worker');
  fetchPeopleQueueBase(queueOptions(opts));
  const ledger = readRemotePeopleWorkLedger(queueOptions(opts));
  const eligible = eligibleGrokTargets(opts, ledger);
  if (!eligible.length) throw new Error('No unclaimed whole chapter fits the Grok Bot packet ceilings');
  const reserved = claimRemotePeopleTargets(eligible, {
    ...queueOptions(opts),
    lane: 'grokbot',
    worker: opts.worker,
    limit: opts.limit,
    sticky: true,
    note: 'Persistent Grok Bot assignment; resume this conversation and branch before reassignment',
  });
  if (!reserved.result.claimed.length) throw new Error('All eligible chapters were claimed by another lane');
  for (const target of reserved.result.claimed) {
    const source = eligible.find((item) => chapterKey(item) === chapterKey(target));
    printGrokbotAssignment(target, source, prepareGrokbotAssignment(target, source.packet, opts));
  }
}

function resumeGrokbot(opts) {
  if (!opts.worker || !opts.book || !opts.chapter) {
    throw new Error('resume-grokbot requires --worker, --book, and --chapter');
  }
  fetchPeopleQueueBase(queueOptions(opts));
  const target = { book: opts.book, chapter: opts.chapter };
  const claim = readRemotePeopleWorkLedger(queueOptions(opts)).claims[chapterKey(target)];
  if (
    !claimIsActive(claim) ||
    claim.lane !== 'grokbot' ||
    claim.worker !== opts.worker ||
    claim.status !== 'claimed'
  ) {
    throw new Error(`${chapterKey(target)} is not reserved for grokbot/${opts.worker}`);
  }
  const packet = buildPeopleExtractionPacket(target.book, target.chapter, {
    properNounMatcher: loadProperNounMatcher(),
  });
  if (claim.chapterFingerprint !== packet.input.chapterFingerprint) {
    throw new Error(`${chapterKey(target)} changed after it was claimed; operator reconciliation is required`);
  }
  const chunks = planGrokbotChunks(packet, opts);
  const source = { ...target, ...chunkPlanMetrics(packet, chunks), chunks, packet };
  const resumed = { ...source, reused: true };
  printGrokbotAssignment(resumed, source, prepareGrokbotAssignment(resumed, packet, opts));
}

function planGrokbot(opts) {
  if (!opts.worker) throw new Error('plan-grokbot requires --worker');
  fetchPeopleQueueBase(queueOptions(opts));
  const ledger = readRemotePeopleWorkLedger(queueOptions(opts));
  const eligible = eligibleGrokTargets(opts, ledger).slice(0, opts.limit);
  if (!eligible.length) throw new Error('No unclaimed chapter is available to Grok Bot');
  for (const target of eligible) {
    console.log(
      `${chapterKey(target)}: ${target.units} units, ${target.candidates} candidates, ` +
      `${target.chunkCount} sealed chunks, max ${(target.maxWorkerBytes / 1024).toFixed(1)} KiB, ` +
      `total ${(target.workerBytes / 1024).toFixed(1)} KiB`,
    );
  }
}

async function submitGrokbot(opts) {
  if (!opts.worker || !opts.book || !opts.chapter) {
    throw new Error('submit-grokbot requires --worker, --book, and --chapter');
  }
  const target = { book: opts.book, chapter: opts.chapter };
  const assignment = readGrokbotAssignment(opts.worker, target);
  const expectedBranch = grokBranch(opts.worker, target);
  if (currentBranch() !== expectedBranch) {
    throw new Error(`Run this submission from ${expectedBranch}; current branch is ${currentBranch() || '(detached)'}`);
  }
  assertGrokbotClaim(opts.worker, target, opts);
  const { output, validated } = assignment.mode === 'chunked'
    ? assembleGrokbotOutput(target, opts)
    : validateGrokbotOutput(target, opts);
  assertOnlyOutputChanged(output);
  const relativeOutput = path.relative(REPO_ROOT, output);
  const outputStatus = run('git', ['status', '--porcelain', '--', relativeOutput]).stdout.trim();
  if (outputStatus) {
    run('git', ['add', relativeOutput]);
    run('git', ['commit', '-m', `Extract people from ${target.book} ${target.chapter}`]);
  } else {
    run('git', ['ls-files', '--error-unmatch', relativeOutput]);
  }
  run('git', ['push', '-u', opts.remote, expectedBranch], { inherit: true });
  let prUrl = null;
  if (!opts.noPr) {
    const existingPr = run('gh', [
      'pr', 'view', expectedBranch, '--json', 'url', '--jq', '.url',
    ], { allowFailure: true });
    if (existingPr.status === 0) {
      prUrl = existingPr.stdout.trim();
    } else {
      const pr = run('gh', [
        'pr', 'create',
        '--base', opts.stagingBranch,
        '--head', expectedBranch,
        '--title', `People glossary: ${target.book} ${target.chapter}`,
        '--body', `Grok Bot extraction for \`${target.book}/${target.chapter}\`.\n\nValidated locally against prompt v7.`,
      ], { allowFailure: true });
      if (pr.status !== 0) {
        throw new Error(
          `The branch is pushed and remains reserved, but PR creation failed: ${(pr.stderr || pr.stdout).trim()}`,
        );
      }
      prUrl = pr.stdout.trim();
    }
  }
  markRemotePeopleClaims([target], 'submitted', {
    ...queueOptions(opts),
    lane: 'grokbot',
    worker: opts.worker,
    branchName: expectedBranch,
    prUrl,
    note: `${validated.stats.people} people, ${validated.stats.mentions} mentions, ${validated.stats.claims} claims`,
  });
  console.log(`Submitted ${chapterKey(target)}${prUrl ? `: ${prUrl}` : ' without a pull request'}`);
}

function showStatus(opts) {
  fetchPeopleQueueBase(queueOptions(opts));
  const ledger = readRemotePeopleWorkLedger(queueOptions(opts));
  const counts = new Map();
  for (const claim of Object.values(ledger.claims)) {
    const key = `${claim.lane}/${claim.status}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  console.log(`People work queue: ${Object.keys(ledger.claims).length} active reservation(s)`);
  for (const [key, count] of [...counts].sort()) console.log(`  ${key}: ${count}`);
  for (const [key, claim] of Object.entries(ledger.claims).sort()) {
    console.log(`  ${key}: ${claim.lane}/${claim.worker} ${claim.status}${claim.sticky ? ' (sticky)' : ''}`);
  }
}

function reconcile(opts) {
  fetchPeopleQueueBase(queueOptions(opts));
  const result = mutateRemotePeopleWorkLedger((ledger) => ({
    expired: pruneExpiredClaims(ledger),
    merged: pruneMergedClaims(ledger, queueOptions(opts)),
  }), { ...queueOptions(opts), message: 'Reconcile people work queue' });
  console.log(`Reconciled: expired=${result.result.expired.length}, merged=${result.result.merged.length}`);
}

function release(opts) {
  if (!opts.lane || !opts.worker || !opts.book || !opts.chapter) {
    throw new Error('release requires --lane, --worker, --book, and --chapter');
  }
  const result = releaseRemotePeopleClaims([{ book: opts.book, chapter: opts.chapter }], {
    ...queueOptions(opts),
    lane: opts.lane,
    worker: opts.worker,
    force: opts.force,
  });
  console.log(`Released ${result.result.released.join(', ') || 'no claims'}`);
}

function selfTest() {
  const ledger = validatePeopleWorkLedger({ schemaVersion: 1, updatedAt: new Date(0).toISOString(), claims: {} });
  const targets = [
    { book: 'a', chapter: '001', chapterFingerprint: 'sha256:a' },
    { book: 'a', chapter: '002', chapterFingerprint: 'sha256:b' },
  ];
  const cursor = reservePeopleTargetsInLedger(ledger, targets, {
    lane: 'cursor-sdk', worker: 'cursor-a', limit: 1, now: 1_000,
  });
  if (cursor.claimed.length !== 1 || chapterKey(cursor.claimed[0]) !== 'a/001') {
    throw new Error('Cursor test claim failed');
  }
  const grok = reservePeopleTargetsInLedger(ledger, targets, {
    lane: 'grokbot', worker: 'grok-a', limit: 2, now: 2_000,
  });
  if (grok.claimed.length !== 1 || chapterKey(grok.claimed[0]) !== 'a/002' || grok.blocked.length !== 1) {
    throw new Error('Cross-lane duplicate prevention failed');
  }
  ledger.claims['a/001'] = {
    ...ledger.claims['a/001'],
    status: 'resume-required',
    sticky: true,
    expiresAt: null,
  };
  pruneExpiredClaims(ledger, Date.now() + 10 * 365 * 86_400_000);
  if (!ledger.claims['a/001']) throw new Error('Sticky resumable claim expired');
  const laterGrok = reservePeopleTargetsInLedger(ledger, [targets[0]], {
    lane: 'grokbot', worker: 'grok-b', limit: 1, now: Date.now() + 10 * 365 * 86_400_000,
  });
  if (laterGrok.claimed.length || laterGrok.blocked.length !== 1) {
    throw new Error('Grok Bot acquired a resumable Cursor chapter');
  }
  const packet = {
    units: Array.from({ length: 4 }, (_, index) => ({
      id: `s${String(index + 1).padStart(4, '0')}`,
      blockIndex: index,
    })),
    preflight: { candidates: [] },
  };
  const planned = normalizePeopleExtractionChunkPlan(packet, [
    { id: '001', start: 0, end: 2 },
    { id: '002', start: 2, end: 4 },
  ], { contextUnits: DEFAULT_PEOPLE_CHUNK_CONTEXT_UNITS });
  const rebuilt = chunksFromAssignment(packet, {
    chunks: planned.map(({ id, start, end }) => ({ id, start, end })),
  });
  if (JSON.stringify(planned) !== JSON.stringify(rebuilt)) {
    throw new Error('Grok Bot assignment did not reconstruct its canonical chunk plan');
  }
  console.log('people-work-queue self-test: ok');
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  if (opts.command === 'sync-cursor') return syncCursor(opts);
  if (opts.command === 'plan-grokbot') return planGrokbot(opts);
  if (opts.command === 'claim-grokbot') return claimGrokbot(opts);
  if (opts.command === 'resume-grokbot') return resumeGrokbot(opts);
  if (opts.command === 'validate-grokbot') {
    if (!opts.book || !opts.chapter) throw new Error('validate-grokbot requires --book and --chapter');
    const result = validateGrokbotOutput(
      { book: opts.book, chapter: opts.chapter },
      { worker: opts.worker, chunkId: opts.chunkId },
    );
    console.log(
      `${opts.book}/${opts.chapter}${opts.chunkId ? `/chunk-${opts.chunkId}` : ''}: ok ` +
      `(${result.validated.stats.people} people, ` +
      `${result.validated.stats.mentions} mentions, ${result.validated.stats.claims} claims)`,
    );
    return;
  }
  if (opts.command === 'assemble-grokbot') {
    if (!opts.worker || !opts.book || !opts.chapter) {
      throw new Error('assemble-grokbot requires --worker, --book, and --chapter');
    }
    const result = assembleGrokbotOutput({ book: opts.book, chapter: opts.chapter }, opts);
    console.log(
      `${opts.book}/${opts.chapter}: assembled (${result.validated.stats.people} people, ` +
      `${result.validated.stats.mentions} mentions, ${result.validated.stats.claims} claims)`,
    );
    return;
  }
  if (opts.command === 'submit-grokbot') return submitGrokbot(opts);
  if (opts.command === 'status') return showStatus(opts);
  if (opts.command === 'reconcile') return reconcile(opts);
  if (opts.command === 'release') return release(opts);
  throw new Error(`Unknown command: ${opts.command}`);
}

if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
