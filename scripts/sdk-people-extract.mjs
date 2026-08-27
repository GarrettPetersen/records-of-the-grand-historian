#!/usr/bin/env node

import { Agent, CursorAgentError } from '@cursor/sdk';
import { execFileSync } from 'node:child_process';
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
  cursorRateLimitDelayMs,
  CursorRunLimitExceededError,
  isCursorAgentBusy,
  isCursorRateLimited,
  sendCursorAgentWhenReady,
  waitForCursorRun,
} from './lib/cursor-run-wait.mjs';
import {
  parseCursorDollarLimit,
  parseCursorIntegerLimit,
} from './lib/cursor-cli-limits.mjs';
import {
  createRunControl,
  installSignalHandlers,
} from './lib/cursor-run-control.mjs';
import { acquireProcessRunLock } from './lib/process-run-lock.mjs';
import {
  compactPeopleExtraction,
  isCompactPeopleExtraction,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import {
  DEFAULT_PEOPLE_CHUNK_CONTEXT_UNITS,
  DEFAULT_PEOPLE_CHUNK_MAX_CANDIDATES,
  DEFAULT_PEOPLE_CHUNK_MAX_UNITS,
  DEFAULT_PEOPLE_WORKER_MAX_BYTES,
  assembleCompactPeopleChunks,
  buildPeopleChunkPacket,
  normalizePeopleExtractionChunkPlan,
  peopleChunkRunRecord,
  planPeopleExtractionChunks,
  splitPeopleExtractionChunk,
} from './lib/people-extraction-chunks.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';
import { assertDurableCareerCoverage } from './lib/people-extraction-acceptance.mjs';
import {
  DEFAULT_PEOPLE_QUEUE_BASE_REF,
  DEFAULT_PEOPLE_QUEUE_BRANCH,
  DEFAULT_PEOPLE_QUEUE_REMOTE,
  chapterKey as workQueueChapterKey,
  claimIsActive,
  claimRemotePeopleTargets,
  fetchPeopleQueueBase,
  markRemotePeopleClaims,
  readRemotePeopleWorkLedger,
  syncLocalCursorReservations,
} from './lib/people-work-queue.mjs';
import {
  invalidateResolutionReferences,
  pruneResolutionDocument,
} from './lib/people-resolution-invalidation.mjs';
import {
  editorialDecisionPath,
  validateAppliedEditorialDecisions,
} from './lib/people-editorial-decisions.mjs';

loadDotenv(REPO_ROOT);

const DEFAULT_MODEL = 'grok-4.5';
const DEFAULT_REPO_URL = 'https://github.com/GarrettPetersen/records-of-the-grand-historian';
const DEFAULT_STARTING_REF = 'codex/people-glossary-staging-v2';
const STATE_FILE = path.join(PEOPLE_DIR, 'generated', 'extraction-state.json');
const RUN_LOCK_FILE = path.join(PEOPLE_DIR, 'generated', 'extraction-run.lock');
const DEFAULT_PLAN_FILE = path.join(PEOPLE_DIR, 'generated', 'extraction-plan.json');
const DEFAULT_MAX_UNITS = DEFAULT_PEOPLE_CHUNK_MAX_UNITS;
const DEFAULT_MAX_CANDIDATES = DEFAULT_PEOPLE_CHUNK_MAX_CANDIDATES;
const DEFAULT_MAX_WORKER_BYTES = DEFAULT_PEOPLE_WORKER_MAX_BYTES;
const DEFAULT_MAX_COST_CENTS = 1000;
const DEFAULT_MAX_RUN_COST_CENTS = 500;
const DEFAULT_MAX_RUN_TOKENS = 5_000_000;
const DEFAULT_RUN_POLL_MS = 15_000;
const DEFAULT_CHUNK_CONTEXT_UNITS = DEFAULT_PEOPLE_CHUNK_CONTEXT_UNITS;
const DEFAULT_AGENT_OVERHEAD_SCORE = 100_000;
const DEFAULT_AGENT_COST_RESERVE_CENTS = 500;
const PEOPLE_CONFIG = readJson(path.join(PEOPLE_DIR, 'config.json'));
const SEALED_WORKER_VERSION = 1;
const COMPACT_WORKER_INSTRUCTIONS = fs.readFileSync(
  path.join(REPO_ROOT, 'prompt-people-extraction-compact.txt'),
  'utf8',
).trim();
const COMPACT_EXTRACTION_SCHEMA = fs.readFileSync(
  path.join(PEOPLE_DIR, 'schema', 'compact-extraction.schema.json'),
  'utf8',
).trim();
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
  --concurrency N      Parallel Cursor Cloud agents (default: 2, max: 100).
  --order ORDER        Queue order: smallest or book (default: smallest).
  --max-units N        Bulk chapter ceiling (default: ${DEFAULT_MAX_UNITS}).
  --max-candidates N   Bulk candidate ceiling (default: ${DEFAULT_MAX_CANDIDATES}).
  --max-worker-kib N   Maximum compact packet size per new worker (default: ${DEFAULT_MAX_WORKER_BYTES / 1024} KiB).
  --allow-large        Send oversized chapters through one whole-chapter worker.
  --defer-large        Leave oversized chapters in the plan instead of chunking them.
  --chunk-context-units N
                       Read-only neighboring units per chunk side (default: ${DEFAULT_CHUNK_CONTEXT_UNITS}).
  --max-cost DOLLARS   Stop launching agents after this invocation reaches the raw
                       usage cost (default: $${(DEFAULT_MAX_COST_CENTS / 100).toFixed(2)}; use unlimited to disable).
  --cost-reserve DOLLARS
                       Budget reserved for each in-flight agent (default: $${(DEFAULT_AGENT_COST_RESERVE_CENTS / 100).toFixed(2)}).
  --max-run-cost DOLLARS
                       Cancel one active run at this raw usage cost (default: $${(DEFAULT_MAX_RUN_COST_CENTS / 100).toFixed(2)}; use unlimited to disable).
  --max-run-tokens N   Cancel one active run at this token count (default: ${DEFAULT_MAX_RUN_TOKENS.toLocaleString('en-US')}; use unlimited to disable).
  --plan-out PATH      Write the measured queue plan (default: generated data).
  --max-attempts N     Validation attempts per phase (default: 3).
  --model MODEL        Cursor model (default: ${DEFAULT_MODEL}).
  --effort LEVEL       Model effort/reasoning: low, medium, or high (default: low).
  --fast               Enable the model's fast variant (default: off).
  --repo URL           Repository used only to verify source and recover older agents.
  --starting-ref REF   Verification/recovery branch (default: ${DEFAULT_STARTING_REF}).
  --worker-id ID       Stable shared-queue worker ID (default: host-cursor-sdk).
  --queue-remote NAME  Git remote holding centralized claims (default: ${DEFAULT_PEOPLE_QUEUE_REMOTE}).
  --queue-branch NAME  Atomic claim ledger branch (default: ${DEFAULT_PEOPLE_QUEUE_BRANCH}).
  --dry-run            Build and summarize packets without calling Cursor.
  --recover-only       Download and validate existing artifacts without starting or
                       continuing any Cursor model turn.
  --force              Re-extract chapters with a valid sidecar from the current prompt.
  --retry-failed       Include chapters whose latest state is failed.
  --only-failed        Process only failed chapters; implies --retry-failed.
  --stream             Stream assistant text; requires concurrency 1.
  --self-test          Run scheduler guardrail tests without Cursor.

Valid sidecars from older prompt versions are automatically queued for upgrade.
This runner is cloud-only. Workers never commit, push, or open pull requests.
The host downloads and validates artifacts, queues translation repairs for an
independent evidence review, and accumulates accepted chapters locally.`);
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
    maxWorkerBytes: DEFAULT_MAX_WORKER_BYTES,
    allowLarge: false,
    deferLarge: false,
    chunkContextUnits: DEFAULT_CHUNK_CONTEXT_UNITS,
    maxCostCents: DEFAULT_MAX_COST_CENTS,
    agentCostReserveCents: DEFAULT_AGENT_COST_RESERVE_CENTS,
    maxRunCostCents: DEFAULT_MAX_RUN_COST_CENTS,
    maxRunTokens: DEFAULT_MAX_RUN_TOKENS,
    planOut: DEFAULT_PLAN_FILE,
    maxAttempts: 3,
    model: process.env.SDK_PEOPLE_MODEL ?? DEFAULT_MODEL,
    effort: process.env.SDK_PEOPLE_EFFORT ?? 'low',
    fast: false,
    repoUrl: process.env.SDK_PEOPLE_REPO ?? DEFAULT_REPO_URL,
    startingRef: process.env.SDK_PEOPLE_STARTING_REF ?? DEFAULT_STARTING_REF,
    workerId: process.env.SDK_PEOPLE_WORKER_ID ?? `${os.hostname()}-cursor-sdk`,
    queueRemote: process.env.PEOPLE_QUEUE_REMOTE ?? DEFAULT_PEOPLE_QUEUE_REMOTE,
    queueBranch: process.env.PEOPLE_QUEUE_BRANCH ?? DEFAULT_PEOPLE_QUEUE_BRANCH,
    queueBaseRef: process.env.PEOPLE_QUEUE_BASE_REF ?? DEFAULT_PEOPLE_QUEUE_BASE_REF,
    apiKey: process.env.CURSOR_API_KEY,
    dryRun: false,
    recoverOnly: false,
    force: false,
    retryFailed: false,
    onlyFailed: false,
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
    else if (arg === '--concurrency') opts.concurrency = positiveInteger(next(), arg, 100);
    else if (arg === '--order') opts.order = next();
    else if (arg === '--max-units') opts.maxUnits = positiveInteger(next(), arg);
    else if (arg === '--max-candidates') opts.maxCandidates = positiveInteger(next(), arg);
    else if (arg === '--max-worker-kib') opts.maxWorkerBytes = positiveInteger(next(), arg) * 1024;
    else if (arg === '--allow-large') opts.allowLarge = true;
    else if (arg === '--defer-large') opts.deferLarge = true;
    else if (arg === '--chunk-context-units') {
      const value = next();
      if (!/^\d+$/u.test(value)) throw new Error(`${arg} must be a nonnegative integer`);
      opts.chunkContextUnits = Number(value);
    }
    else if (arg === '--max-cost') opts.maxCostCents = parseCursorDollarLimit(next(), arg);
    else if (arg === '--cost-reserve') opts.agentCostReserveCents = parseCursorDollarLimit(next(), arg);
    else if (arg === '--max-run-cost') opts.maxRunCostCents = parseCursorDollarLimit(next(), arg);
    else if (arg === '--max-run-tokens') opts.maxRunTokens = parseCursorIntegerLimit(next(), arg);
    else if (arg === '--plan-out') opts.planOut = path.resolve(REPO_ROOT, next());
    else if (arg === '--max-attempts') opts.maxAttempts = positiveInteger(next(), arg, 5);
    else if (arg === '--model') opts.model = next();
    else if (arg === '--effort') opts.effort = next();
    else if (arg === '--fast') opts.fast = true;
    else if (arg === '--repo') opts.repoUrl = next();
    else if (arg === '--starting-ref') opts.startingRef = next();
    else if (arg === '--worker-id') opts.workerId = next();
    else if (arg === '--queue-remote') opts.queueRemote = next();
    else if (arg === '--queue-branch') opts.queueBranch = next();
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--recover-only') opts.recoverOnly = true;
    else if (arg === '--force') opts.force = true;
    else if (arg === '--retry-failed') opts.retryFailed = true;
    else if (arg === '--only-failed') {
      opts.onlyFailed = true;
      opts.retryFailed = true;
    }
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
  if (opts.allowLarge && opts.deferLarge) throw new Error('--allow-large cannot be combined with --defer-large');
  if (opts.stream && opts.concurrency !== 1) throw new Error('--stream requires --concurrency 1');
  if (opts.stream && (opts.maxRunCostCents !== null || opts.maxRunTokens !== null)) {
    throw new Error('--stream requires --max-run-cost unlimited and --max-run-tokens unlimited');
  }
  if (opts.agentCostReserveCents === null) throw new Error('--cost-reserve must be a dollar amount');
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

function assertInferenceAllowed(opts, label) {
  if (!opts.recoverOnly) return;
  const error = new Error(
    `${label} has no validated published artifact; --recover-only forbids a new Cursor turn`,
  );
  error.code = 'RECOVERY_ARTIFACT_UNAVAILABLE';
  throw error;
}

function isRecoveryArtifactUnavailable(error) {
  return error?.code === 'RECOVERY_ARTIFACT_UNAVAILABLE';
}

function isMissingCursorAgent(error) {
  return error?.code === 'agent_not_found';
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

function withDispatchMetrics(target, workerCount = 1) {
  return {
    ...target,
    metrics: {
      ...target.metrics,
      workerCount,
      dispatchScore: target.metrics.workloadScore + workerCount * DEFAULT_AGENT_OVERHEAD_SCORE,
    },
  };
}

function hasRetainedAgentConversation(record) {
  return Boolean(record?.agentId && !record.resumeExhausted && (
    ['claimed', 'extracting', 'interrupted', 'recovering', 'failed/retryable', 'failed'].includes(record.status) ||
    chunkHitRunLimit(record)
  ));
}

function withRecoveryPriority(target, state) {
  const chapterState = state.chapters[stateKey(target)] ?? {};
  const chunkStates = Object.values(chapterState.chunks ?? {});
  const hasRetainedChat = hasRetainedAgentConversation(chapterState) ||
    chunkStates.some(hasRetainedAgentConversation);
  const archiveDirectory = path.join(
    PEOPLE_DIR,
    'generated',
    'chunk-extractions',
    target.book,
    target.chapter,
  );
  const hasAcceptedPart = chunkStates.some((chunk) => chunk.status === 'accepted') ||
    (fs.existsSync(archiveDirectory) && fs.readdirSync(archiveDirectory).some((name) => name.endsWith('.json')));
  return {
    ...target,
    metrics: {
      ...target.metrics,
      recoveryPriority: hasRetainedChat ? 0 : hasAcceptedPart ? 1 : 2,
    },
  };
}

function recoveryOnlyTarget(target, state) {
  const chapterState = state.chapters[stateKey(target)] ?? {};
  if (
    hasRetainedAgentConversation(chapterState) ||
    Object.values(chapterState.chunks ?? {}).some(hasRetainedAgentConversation)
  ) {
    return true;
  }
  const archiveDirectory = path.join(
    PEOPLE_DIR,
    'generated',
    'chunk-extractions',
    target.book,
    target.chapter,
  );
  return fs.existsSync(archiveDirectory) &&
    fs.readdirSync(archiveDirectory).some((name) => name.endsWith('.json'));
}

function availableToCursorLane(target, ledger, workerId, state) {
  const claim = ledger.claims[workQueueChapterKey(target)];
  if (!claimIsActive(claim)) return true;
  if (claim.lane !== 'cursor-sdk') return false;
  if (claim.worker === workerId) return true;
  return claim.status === 'resume-required' && recoveryOnlyTarget(target, state);
}

function planningScopeTargets(laneTargets, ledger, opts, state) {
  if (opts.recoverOnly) {
    return laneTargets.filter((target) => recoveryOnlyTarget(target, state));
  }
  if (!opts.limit) return laneTargets;
  const recoveryTargets = laneTargets.filter((target) => {
    const claim = ledger.claims[workQueueChapterKey(target)];
    return claim?.lane === 'cursor-sdk' &&
      claim.status === 'resume-required' &&
      recoveryOnlyTarget(target, state);
  });
  return recoveryTargets.length >= opts.limit ? recoveryTargets : laneTargets;
}

function compareBookOrder(left, right) {
  return left.book.localeCompare(right.book) || left.chapter.localeCompare(right.chapter);
}

function compareWorkload(left, right) {
  return (left.metrics.recoveryPriority ?? 2) - (right.metrics.recoveryPriority ?? 2) ||
    (left.metrics.dispatchScore ?? left.metrics.workloadScore) -
      (right.metrics.dispatchScore ?? right.metrics.workloadScore) ||
    left.metrics.candidates - right.metrics.candidates ||
    left.metrics.units - right.metrics.units ||
    compareBookOrder(left, right);
}

function exceedsBulkCeiling(target, opts) {
  return target.metrics.units > opts.maxUnits ||
    target.metrics.candidates > opts.maxCandidates ||
    target.metrics.workerBytes > opts.maxWorkerBytes;
}

function chunkWorkerBytes(packet, chunk) {
  return Buffer.byteLength(JSON.stringify(buildPeopleChunkWorkerPacket(packet, chunk)));
}

function currentChunkArchiveIsValid(target, packet, chunk) {
  const archive = chunkArchivePath(target, chunk);
  if (!fs.existsSync(archive)) return false;
  try {
    validateCompactPeopleExtraction(readJson(archive), buildPeopleChunkPacket(packet, chunk));
    return true;
  } catch {
    return false;
  }
}

function enforceWorkerByteCeiling(target, packet, chunks, opts, state = null) {
  let planned = normalizePeopleExtractionChunkPlan(packet, chunks, {
    contextUnits: opts.chunkContextUnits,
  });
  for (let index = 0; index < planned.length;) {
    const chunk = planned[index];
    const bytes = chunkWorkerBytes(packet, chunk);
    const previous = target && state?.chapters?.[stateKey(target)]?.chunks?.[chunk.id];
    const hasCurrentArchive = target && currentChunkArchiveIsValid(target, packet, chunk);
    if (
      bytes <= opts.maxWorkerBytes ||
      chunk.units === 1 ||
      hasResumableChunkConversation(previous) ||
      hasCurrentArchive
    ) {
      index += 1;
      continue;
    }
    const children = splitPeopleExtractionChunk(packet, chunk, {
      contextUnits: opts.chunkContextUnits,
    });
    planned = normalizePeopleExtractionChunkPlan(packet, [
      ...planned.slice(0, index),
      ...children,
      ...planned.slice(index + 1),
    ], { contextUnits: opts.chunkContextUnits });
  }
  return planned;
}

function planFreshChunks(target, packet, opts, state = null) {
  const planned = planPeopleExtractionChunks(packet, {
    maxUnits: opts.maxUnits,
    maxCandidates: opts.maxCandidates,
    contextUnits: opts.chunkContextUnits,
  });
  return enforceWorkerByteCeiling(target, packet, planned, opts, state);
}

function baseChunkPlanForTarget(target, packet, opts, state, log = false) {
  const prior = state.chapters[stateKey(target)];
  if (prior?.chapterFingerprint === packet.input.chapterFingerprint && prior.chunkPlan?.length) {
    const restored = normalizePeopleExtractionChunkPlan(packet, prior.chunkPlan, {
      contextUnits: opts.chunkContextUnits,
    });
    if (log) console.log(`[${stateKey(target)}] restored adaptive ${restored.length}-range chunk plan`);
    return restored;
  }
  return restoreLegacyChunkPlan(target, packet, prior, opts) ??
    planFreshChunks(target, packet, opts, state);
}

function sealedPayloadMetrics(target, packet, opts, state) {
  const chunked = exceedsBulkCeiling({ metrics: targetMetrics(packet) }, opts) && !opts.allowLarge;
  if (!chunked) {
    const bytes = Buffer.byteLength(
      sealedInitialPrompt(target, packet, buildPeopleWorkerPacket(packet), opts),
    );
    return { workers: 1, totalBytes: bytes, maxBytes: bytes };
  }
  const chunks = baseChunkPlanForTarget(target, packet, opts, state);
  const sizes = chunks.map((chunk) => Buffer.byteLength(sealedInitialPrompt(
    target,
    buildPeopleChunkPacket(packet, chunk),
    buildPeopleChunkWorkerPacket(packet, chunk),
    opts,
    chunk,
  )));
  return {
    workers: sizes.length,
    totalBytes: sizes.reduce((sum, bytes) => sum + bytes, 0),
    maxBytes: Math.max(...sizes),
  };
}

function planTarget(target) {
  return {
    book: target.book,
    chapter: target.chapter,
    ...target.metrics,
    ...(target.chunkCount ? { chunkCount: target.chunkCount } : {}),
  };
}

function recoverInterruptedState(state) {
  let changed = false;
  for (const entry of Object.values(state.chapters)) {
    const entryRecoverable = ['claimed', 'extracting', 'recovering', 'failed/retryable'].includes(entry.status) ||
      (entry.status === 'failed' && entry.agentId && !entry.resumeExhausted);
    if (entryRecoverable) {
      entry.status = 'interrupted';
      entry.updatedAt = new Date().toISOString();
      changed = true;
    }
    for (const chunk of Object.values(entry.chunks ?? {})) {
      const chunkRecoverable = ['claimed', 'extracting', 'recovering', 'failed/retryable'].includes(chunk.status) ||
        (chunk.status === 'failed' && chunk.agentId && !chunk.resumeExhausted);
      if (!chunkRecoverable) continue;
      chunk.status = 'interrupted';
      chunk.updatedAt = new Date().toISOString();
      changed = true;
    }
  }
  if (changed) saveState(state);
}

function recordCurrentExtraction(state, target, packet, opts) {
  if (opts.dryRun) return false;
  const key = stateKey(target);
  state.chapters[key] = {
    ...(state.chapters[key] ?? { attempts: 0 }),
    status: 'accepted',
    chapterFingerprint: packet.input.chapterFingerprint,
    updatedAt: new Date().toISOString(),
  };
  return true;
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
    const measured = withRecoveryPriority({ ...target, metrics: targetMetrics(packet) }, state);
    if (!opts.force && currentExtractionIsValid(target, packet)) {
      current.push(measured);
      stateChanged = recordCurrentExtraction(state, target, packet, opts) || stateChanged;
    } else if (opts.onlyFailed && state.chapters[stateKey(target)]?.status !== 'failed') {
      continue;
    } else if (!opts.retryFailed && state.chapters[stateKey(target)]?.status === 'failed') {
      failed.push(measured);
    } else if (opts.recoverOnly && measured.metrics.recoveryPriority > 1) {
      continue;
    } else if (exceedsBulkCeiling(measured, opts) && !opts.allowLarge) {
      if (opts.deferLarge) {
        oversized.push(measured);
      } else {
        const chunks = baseChunkPlanForTarget(target, packet, opts, state);
        eligible.push({ ...withDispatchMetrics(measured, chunks.length), chunkCount: chunks.length });
      }
    } else {
      eligible.push(withDispatchMetrics(measured));
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
      maxWorkerBytes: opts.allowLarge ? null : opts.maxWorkerBytes,
      largeChapterMode: opts.allowLarge ? 'whole' : opts.deferLarge ? 'defer' : 'chunk',
      chunkContextUnits: opts.chunkContextUnits,
      maxCostCents: opts.maxCostCents,
      concurrency: opts.concurrency,
    },
    counts: {
      measured: rawTargets.length,
      selected: selected.length,
      selectedChunked: selected.filter((target) => target.chunkCount).length,
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

  if (opts.chapter && opts.deferLarge && oversized.length > 0) {
    const item = oversized[0];
    throw new Error(
      `${item.book}/${item.chapter} has ${item.metrics.units} units and ` +
      `${item.metrics.candidates} candidates in a ` +
      `${(item.metrics.workerBytes / 1024).toFixed(1)} KiB packet, above the bulk ceilings of ` +
      `${opts.maxUnits} units, ${opts.maxCandidates} candidates, or ` +
      `${opts.maxWorkerBytes / 1024} KiB; remove --defer-large to use deterministic chunks ` +
      'or pass --allow-large explicitly',
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

function updateChunkState(state, target, chunk, patch) {
  const key = stateKey(target);
  const current = state.chapters[key] ?? { attempts: 0 };
  state.chapters[key] = {
    ...current,
    chunks: {
      ...(current.chunks ?? {}),
      [chunk.id]: {
        ...(current.chunks?.[chunk.id] ?? { attempts: 0 }),
        start: chunk.start,
        end: chunk.end,
        ...(chunk.parentId ? { parentId: chunk.parentId } : {}),
        ...(chunk.adaptiveDepth ? { adaptiveDepth: chunk.adaptiveDepth } : {}),
        ...patch,
        updatedAt: new Date().toISOString(),
      },
    },
    updatedAt: new Date().toISOString(),
  };
  saveState(state);
}

function currentExtractionIsValid(target, packet) {
  const file = extractionPath(target.book, target.chapter);
  if (!fs.existsSync(file)) return false;
  try {
    const extraction = readJson(file);
    if (extraction.run?.promptVersion < PEOPLE_CONFIG.promptVersion) return false;
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

function chunkArtifactPath(target, chunk) {
  return path.posix.join(
    'data', 'people', 'generated', 'cloud', target.book, target.chapter, `chunk-${chunk.id}.json`,
  );
}

function chunkPacketArtifactPath(target, chunk) {
  return path.posix.join(
    'data', 'people', 'generated', 'cloud', target.book, target.chapter, `chunk-${chunk.id}.packet.json`,
  );
}

function chunkArchivePath(target, chunk) {
  return path.join(
    PEOPLE_DIR, 'generated', 'chunk-extractions', target.book, target.chapter, `${chunk.id}.json`,
  );
}

function rejectedArtifactPath(target, chunk = null) {
  return chunk
    ? path.join(
      PEOPLE_DIR, 'generated', 'rejected-chunk-extractions',
      target.book, target.chapter, `${chunk.id}.json`,
    )
    : path.join(
      PEOPLE_DIR, 'generated', 'rejected-extractions', target.book, `${target.chapter}.json`,
    );
}

function publishArtifactCommand(output) {
  const artifact = path.posix.join('/opt/cursor/artifacts', output);
  return `mkdir -p ${path.posix.dirname(artifact)} && cp ${output} ${artifact}`;
}

function sealedArtifactPath(output) {
  return path.posix.join('/opt/cursor/artifacts', output);
}

function sealedInitialPrompt(target, packet, workerPacket, opts, chunk = null) {
  const output = chunk ? chunkArtifactPath(target, chunk) : artifactPath(target);
  const artifact = sealedArtifactPath(output);
  const scope = chunk
    ? `owned chunk ${chunk.id}/${String(chunk.count).padStart(3, '0')} of ${stateKey(target)}`
    : `chapter ${stateKey(target)}`;
  const seed = serializeCompactPeopleExtraction(
    buildCompactPeopleExtractionSeed(packet, opts.model),
  ).trim();
  return `Perform the person extraction and final editorial audit for ${scope}.

This is a sealed packet-only assignment. The workspace intentionally contains no repository.
Use only the four payload sections below. Do not inspect the filesystem, browse, search, use
subagents, or reconstruct project context. The only permitted workspace action is one final
shell write that creates the complete JSON artifact at:
${artifact}

Preserve the seed's scope, input fingerprints, and run metadata exactly. Replace its empty
result arrays and incomplete coverage flags with the complete compact extraction. For a chunk,
readOnlyContext is context only and all emitted evidence must belong to owned units. Create the
artifact directory if necessary, write valid JSON directly to the absolute path above, and do
not create any other file. Finish only after auditing every owned unit and every candidate.

<compact-worker-instructions version="${PEOPLE_CONFIG.promptVersion}">
${COMPACT_WORKER_INSTRUCTIONS}
</compact-worker-instructions>

<compact-extraction-schema>
${COMPACT_EXTRACTION_SCHEMA}
</compact-extraction-schema>

<worker-packet version="${workerPacket.version}">
${JSON.stringify(workerPacket)}
</worker-packet>

<immutable-seed>
${seed}
</immutable-seed>`;
}

function sealedRetryPrompt(target, chunk, errors) {
  const output = chunk ? chunkArtifactPath(target, chunk) : artifactPath(target);
  const artifact = sealedArtifactPath(output);
  return `The host rejected the sealed extraction artifact for ${stateKey(target)}${chunk ? ` chunk ${chunk.id}` : ''}.

Preserve correct work already present in this conversation. Fix every validation error below,
audit all owned units again, and overwrite only ${artifact} with the complete valid JSON.
Do not inspect the filesystem, browse, search, use subagents, or create another file.

VALIDATION ERRORS:
${errors.slice(0, 400).map((error) => `- ${error}`).join('\n')}`;
}

function sealedResumePrompt(target, chunk, errors) {
  const output = chunk ? chunkArtifactPath(target, chunk) : artifactPath(target);
  const artifact = sealedArtifactPath(output);
  return `Your sealed packet-only run for ${stateKey(target)}${chunk ? ` chunk ${chunk.id}` : ''} was interrupted before the host accepted a validated artifact.

Resume the work already completed in this conversation; do not restart the extraction. Finish
the remaining owned units and overwrite only ${artifact} with the complete valid JSON. Do not
inspect the filesystem, browse, search, use subagents, or create another file.

PRIOR HOST DIAGNOSTICS:
${errors.slice(0, 40).map((error) => `- ${error}`).join('\n')}`;
}

function sealedAgentOptions(target, opts, chunk = null) {
  return {
    apiKey: opts.apiKey,
    name: `People extraction ${stateKey(target)}${chunk ? ` chunk ${chunk.id}` : ''}`,
    model: modelSelection(opts),
    cloud: {
      metadata: {
        purpose: 'people-extraction',
        workerMode: 'sealed',
        workerVersion: String(SEALED_WORKER_VERSION),
        book: target.book,
        chapter: target.chapter,
        chunk: chunk?.id ?? 'whole',
      },
    },
  };
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
   ${publishArtifactCommand(output)}

Do not edit a source chapter. Do not run git commit, git push, gh, or open a pull request. The only tracked file you may modify is ${output}. Finish the complete chapter in this run.`;
}

function retryPrompt(target, errors) {
  const output = artifactPath(target);
  const packet = packetArtifactPath(target);
  return `The host rejected ${output} for ${target.book}/${target.chapter}. Preserve correct work, fix every validation error below, audit the complete chapter again, and rerun:
node scripts/validate-people-extraction.mjs ${output} --packet ${packet} --normalize

Do not commit, push, open a PR, or edit the source chapter.

After validation succeeds, refresh the host artifact by running:
${publishArtifactCommand(output)}

VALIDATION ERRORS:
${errors.slice(0, 400).map((error) => `- ${error}`).join('\n')}`;
}

function chunkBuildArgs(target, chunk, opts, packet, output) {
  return [
    `--book ${target.book}`,
    `--chapter ${target.chapter}`,
    `--chunk-start ${chunk.start}`,
    `--chunk-end ${chunk.end}`,
    `--chunk-id ${chunk.id}`,
    `--chunk-count ${chunk.count}`,
    `--chunk-max-units ${opts.maxUnits}`,
    `--chunk-max-candidates ${opts.maxCandidates}`,
    `--chunk-context-units ${opts.chunkContextUnits}`,
    `--out ${packet}`,
    `--seed-out ${output}`,
    `--model ${opts.model}`,
    '--compact-worker',
  ].join(' ');
}

function chunkInitialPrompt(target, chunk, opts) {
  const output = chunkArtifactPath(target, chunk);
  const packet = chunkPacketArtifactPath(target, chunk);
  return `Perform person extraction and the final editorial audit for owned chunk ${chunk.id}/${String(chunk.count).padStart(3, '0')} of ${target.book}/${target.chapter}.

Efficiency boundary: read only prompt-people-extraction-compact.txt, the assigned packet,
data/people/schema/compact-extraction.schema.json, and the assigned seed. The packet's
readOnlyContext is context only; output facts and repairs solely for owned units.

1. Read prompt-people-extraction-compact.txt completely.
2. Run:
   node scripts/build-people-extraction-packet.mjs ${chunkBuildArgs(target, chunk, opts, packet, output)}
3. Read ${packet}, data/people/schema/compact-extraction.schema.json, and ${output}.
4. Process every owned unit and replace the seed with the complete chunk extraction at ${output}.
5. Run node scripts/validate-people-extraction.mjs ${output} --packet ${packet} --normalize.
6. Publish the validated JSON for the host by running:
   ${publishArtifactCommand(output)}

Do not emit annotations for read-only context. Do not edit a source chapter. Do not run
git commit, git push, gh, or open a pull request. The only file you may modify is ${output}.`;
}

function chunkRetryPrompt(target, chunk, errors) {
  const output = chunkArtifactPath(target, chunk);
  const packet = chunkPacketArtifactPath(target, chunk);
  return `The host rejected owned chunk ${chunk.id} of ${target.book}/${target.chapter}. Preserve correct work, fix every validation error below, audit all owned units again, and rerun:
node scripts/validate-people-extraction.mjs ${output} --packet ${packet} --normalize

Do not emit annotations for read-only context. Do not commit, push, open a PR, or edit the source chapter.

After validation succeeds, refresh the host artifact by running:
${publishArtifactCommand(output)}

VALIDATION ERRORS:
${errors.slice(0, 400).map((error) => `- ${error}`).join('\n')}`;
}

function chunkResumePrompt(target, chunk, errors) {
  const output = chunkArtifactPath(target, chunk);
  const packet = chunkPacketArtifactPath(target, chunk);
  return `Your previous run for owned chunk ${chunk.id} of ${target.book}/${target.chapter} was interrupted before the host accepted a validated artifact, but this conversation and workspace were retained.

Resume the work already completed in this conversation. Do not start the extraction over. Finish any remaining owned units, write the complete extraction to ${output}, and run:
node scripts/validate-people-extraction.mjs ${output} --packet ${packet} --normalize

After validation succeeds, publish the artifact by running:
${publishArtifactCommand(output)}

Do not edit the source chapter, commit, push, or open a PR. If the prior output file is incomplete, preserve correct entries and complete it.

PRIOR HOST DIAGNOSTICS:
${errors.slice(0, 40).map((error) => `- ${error}`).join('\n')}`;
}

function wholeResumePrompt(target, errors) {
  const output = artifactPath(target);
  const packet = packetArtifactPath(target);
  return `Your previous run for ${target.book}/${target.chapter} was interrupted before the host accepted a validated artifact, but this conversation and workspace were retained.

Resume the work already completed in this conversation. Do not start the extraction over. Finish any remaining units, write the complete extraction to ${output}, and run:
node scripts/validate-people-extraction.mjs ${output} --packet ${packet} --normalize

After validation succeeds, publish the artifact by running:
${publishArtifactCommand(output)}

Do not edit the source chapter, commit, push, or open a PR. If the prior output file is incomplete, preserve correct entries and complete it.

PRIOR HOST DIAGNOSTICS:
${errors.slice(0, 40).map((error) => `- ${error}`).join('\n')}`;
}

async function closeAgent(agent) {
  if (!agent) return;
  if (typeof agent[Symbol.asyncDispose] === 'function') await agent[Symbol.asyncDispose]();
  else await agent.close();
}

async function runAgentTurn(agent, prompt, target, opts, phase, control) {
  console.log(`[${stateKey(target)}] ${phase} prompt -> ${agent.agentId}`);
  const run = await sendCursorAgentWhenReady(agent, prompt, {
    label: `[${stateKey(target)}] ${phase}`,
  });
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
      pollMs: DEFAULT_RUN_POLL_MS,
      maxRawCostCents: opts.maxRunCostCents,
      maxTotalTokens: opts.maxRunTokens,
    });
    console.log(`[${stateKey(target)}] ${phase} run ${result.id} status=${result.status}`);
    if (result.status !== 'finished') {
      const error = new Error(result.error?.message ?? `Cursor run ended with status ${result.status}`);
      error.runId = result.id;
      error.runStatus = result.status;
      throw error;
    }
    return result;
  } finally {
    control.activeRuns.delete(run.id);
  }
}

async function downloadExtraction(agent, wanted) {
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

function validateDownloadedExtraction(extraction, packet, target = null, chunk = null) {
  try {
    return isCompactPeopleExtraction(extraction)
      ? validateCompactPeopleExtraction(extraction, packet)
      : validatePeopleExtraction(extraction, packet);
  } catch (error) {
    if (target) {
      const rejected = rejectedArtifactPath(target, chunk);
      writeJsonAtomic(rejected, extraction);
      console.warn(
        `[${stateKey(target)}${chunk ? `/chunk-${chunk.id}` : ''}] ` +
        `preserved rejected artifact at ${path.relative(REPO_ROOT, rejected)}`,
      );
    }
    throw error;
  }
}

async function recoverInterruptedExtraction(target, packet, opts, state, control, budget) {
  const prior = state.chapters[stateKey(target)];
  if (prior?.status !== 'interrupted' || !prior.agentId || prior.resumeExhausted) return null;
  const workerMode = prior.workerMode === 'sealed' ? 'sealed' : 'repository';

  let agent;
  let run;
  let releaseReservation = () => {};
  let resumeTurnStarted = false;
  const recoveryErrors = [...(prior.lastErrors ?? [])];
  try {
    console.log(`[${stateKey(target)}] resuming interrupted agent ${prior.agentId}`);
    updateState(state, target, { status: 'recovering' });
    seedRecordedUsage(budget, prior.usage);
    agent = await Agent.resume(prior.agentId, { apiKey: opts.apiKey });
    const runs = await Agent.listRuns(prior.agentId, {
      runtime: 'cloud',
      apiKey: opts.apiKey,
      limit: 20,
    });
    seedRecordedRuns(budget, runs.items);
    run = runs.items.find((candidate) => candidate.status === 'running') ?? runs.items[0];
    let existingRunError = null;
    if (run?.status === 'running') {
      control.activeRuns.set(run.id, { run, target });
      try {
        run = await waitForCursorRun(run, {
          agentId: prior.agentId,
          apiKey: opts.apiKey,
          label: `[${stateKey(target)}] recovered extraction`,
          pollMs: DEFAULT_RUN_POLL_MS,
          maxRawCostCents: opts.maxRunCostCents,
          maxTotalTokens: opts.maxRunTokens,
        });
      } catch (error) {
        existingRunError = error;
      } finally {
        control.activeRuns.delete(run.id);
      }
    }
    if (run) {
      try {
        const downloaded = withRunMetadata(
          await downloadExtraction(agent, artifactPath(target)),
          opts,
          agent,
          run,
        );
        const validated = validateDownloadedExtraction(downloaded, packet, target);
        console.log(`[${stateKey(target)}] recovered validated artifact from run ${run.id}`);
        updateState(state, target, { resumePending: false });
        return { extraction: validated.normalized, result: run, stats: validated.stats, packet };
      } catch (error) {
        recoveryErrors.push(...validationErrors(error));
      }
    }
    if (existingRunError) throw existingRunError;
    assertInferenceAllowed(opts, stateKey(target));
    releaseReservation = await reserveAgentBudget(opts, budget, control);
    resumeTurnStarted = true;
    updateState(state, target, {
      status: 'recovering',
      resumePending: true,
      lastErrors: recoveryErrors,
    });
    const accepted = await obtainValidInitialExtraction(
      agent,
      target,
      packet,
      opts,
      state,
      control,
      null,
      workerMode === 'sealed'
        ? sealedResumePrompt(target, null, recoveryErrors)
        : wholeResumePrompt(target, recoveryErrors),
      workerMode,
    );
    updateState(state, target, { resumePending: false });
    return { ...accepted, packet };
  } catch (error) {
    if (error instanceof CursorRunLimitExceededError) {
      control.stopRequested = true;
      control.stopReason = 'run-limit';
    }
    const exhausted = resumeTurnStarted && (
      error instanceof CursorRunLimitExceededError ||
      /failed after \d+ attempt/iu.test(error instanceof Error ? error.message : String(error)) ||
      (error instanceof CursorAgentError && !error.isRetryable)
    );
    const errors = validationErrors(error);
    console.warn(
      `[${stateKey(target)}] interrupted agent was not recoverable: ` +
      `${error instanceof Error ? error.message : String(error)}`,
    );
    updateState(state, target, {
      status: 'interrupted',
      lastErrors: errors,
      ...(resumeTurnStarted ? { resumePending: false } : {}),
      ...(exhausted ? { resumeExhausted: true } : {}),
    });
    return { recoveryFailed: true, errors };
  } finally {
    if (run?.id) control.activeRuns.delete(run.id);
    await recordAgentUsage(agent, target, budget, state);
    releaseReservation();
    await closeAgent(agent);
  }
}

async function obtainValidInitialExtraction(
  agent,
  target,
  packet,
  opts,
  state,
  control,
  chunk = null,
  firstPrompt = null,
  workerMode = 'repository',
) {
  let errors = [];
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt += 1) {
    if (control.cancelRequested) {
      throw Object.assign(new Error('Extraction cancelled during shutdown'), { errors });
    }
    const currentState = chunk
      ? state.chapters[stateKey(target)]?.chunks?.[chunk.id]
      : state.chapters[stateKey(target)];
    const priorAttempts = currentState?.attempts ?? 0;
    const patch = { status: 'extracting', attempts: priorAttempts + 1, phaseAttempt: attempt };
    if (chunk) updateChunkState(state, target, chunk, patch);
    else updateState(state, target, patch);
    const prompt = attempt === 1
      ? firstPrompt ?? (chunk ? chunkInitialPrompt(target, chunk, opts) : initialPrompt(target, opts))
      : workerMode === 'sealed'
        ? sealedRetryPrompt(target, chunk, errors)
        : chunk ? chunkRetryPrompt(target, chunk, errors) : retryPrompt(target, errors);
    const phase = chunk ? `chunk-${chunk.id}` : 'extraction';
    const wanted = chunk ? chunkArtifactPath(target, chunk) : artifactPath(target);
    let result;
    try {
      result = await runAgentTurn(agent, prompt, target, opts, phase, control);
      const downloaded = withRunMetadata(await downloadExtraction(agent, wanted), opts, agent, result);
      const validated = validateDownloadedExtraction(downloaded, packet, target, chunk);
      return { extraction: validated.normalized, result, stats: validated.stats };
    } catch (error) {
      if (chunk && (error instanceof CursorRunLimitExceededError || error.runStatus)) {
        try {
          const recovered = withRunMetadata(
            await downloadExtraction(agent, wanted),
            opts,
            agent,
            { id: error.runId ?? null },
          );
          const validated = validateDownloadedExtraction(recovered, packet, target, chunk);
          console.warn(
            `[${stateKey(target)}/chunk-${chunk.id}] recovered a valid artifact after ` +
            (error instanceof CursorRunLimitExceededError
              ? `${error.metric} cancellation`
              : `terminal run status ${error.runStatus}`),
          );
          return {
            extraction: validated.normalized,
            result: { id: error.runId ?? null },
            stats: validated.stats,
          };
        } catch (recoveryError) {
          error.artifactRecoveryError = recoveryError;
          console.warn(
            `[${stateKey(target)}/chunk-${chunk.id}] no valid post-cancellation artifact: ` +
            `${validationErrors(recoveryError)[0]}`,
          );
        }
      }
      if (error instanceof CursorRunLimitExceededError && !chunk) {
        control.stopRequested = true;
        control.stopReason = 'run-limit';
      }
      errors = validationErrors(error);
      const failure = {
        status: control.stopRequested ? 'interrupted' : 'failed/retryable',
        lastErrors: errors,
        ...(error instanceof CursorRunLimitExceededError ? { stopReason: 'run-limit' } : {}),
      };
      if (chunk) updateChunkState(state, target, chunk, failure);
      else updateState(state, target, failure);
      console.error(
        `[${stateKey(target)}${chunk ? `/chunk-${chunk.id}` : ''}] ` +
        `attempt ${attempt} failed with ${errors.length} error(s)`,
      );
      for (const diagnostic of errors.slice(0, 20)) {
        console.error(`  - ${String(diagnostic).replaceAll('\n', '\n    ')}`);
      }
      if (errors.length > 20) {
        console.error(`  - ... ${errors.length - 20} more error(s)`);
      }
      if (control.cancelRequested) break;
      if (error instanceof CursorRunLimitExceededError) throw error;
      if (error instanceof CursorAgentError && !error.isRetryable) break;
    }
  }
  throw Object.assign(new Error(
    `${chunk ? `Chunk ${chunk.id}` : 'Initial extraction'} failed after ${opts.maxAttempts} attempt(s)`,
  ), { errors });
}

async function recordAgentUsage(agent, target, budget, state, chunk = null) {
  if (!agent) return;
  try {
    const usage = await agent.getUsage();
    if (chunk) updateChunkState(state, target, chunk, { usage });
    else updateState(state, target, { usage });
    budget.recordedRunIds ??= new Set();
    budget.recordedAgents ??= new Set();
    const freshRuns = (usage.runs ?? []).filter((run) => !budget.recordedRunIds.has(run.runId));
    let rawCostCents;
    let chargedCents;
    if ((usage.runs ?? []).length > 0) {
      rawCostCents = freshRuns.reduce((sum, run) => sum + (run.cost?.rawCostCents ?? 0), 0);
      chargedCents = freshRuns.reduce((sum, run) => sum + (run.cost?.chargedCents ?? 0), 0);
      for (const run of freshRuns) {
        if (run.runId) budget.recordedRunIds.add(run.runId);
      }
    } else if (!budget.recordedAgents.has(agent.agentId)) {
      rawCostCents = usage.cost?.rawCostCents ?? 0;
      chargedCents = usage.cost?.chargedCents ?? 0;
      budget.recordedAgents.add(agent.agentId);
    } else {
      rawCostCents = 0;
      chargedCents = 0;
    }
    budget.rawCostCents += rawCostCents;
    budget.chargedCents += chargedCents;
    const freshTokens = freshRuns.reduce(
      (sum, run) => sum + (run.usage?.totalTokens ?? 0),
      0,
    );
    const agentTotals = usage.cost
      ? `${usage.usage.totalTokens.toLocaleString('en-US')} tokens, ` +
        `raw=$${(usage.cost.rawCostCents / 100).toFixed(2)}, ` +
        `charged=$${(usage.cost.chargedCents / 100).toFixed(2)}`
      : `${usage.usage.totalTokens.toLocaleString('en-US')} tokens`;
    const invocationDelta = (usage.runs ?? []).length > 0
      ? `; invocation delta=${freshTokens.toLocaleString('en-US')} tokens, ` +
        `raw=$${(rawCostCents / 100).toFixed(2)}, charged=$${(chargedCents / 100).toFixed(2)} ` +
        `across ${freshRuns.length} new run(s)`
      : '';
    console.log(
      `[${stateKey(target)}${chunk ? `/chunk-${chunk.id}` : ''}] Cursor usage: ` +
      `agent total=${agentTotals}${invocationDelta}`,
    );
  } catch (error) {
    console.warn(
      `[${stateKey(target)}${chunk ? `/chunk-${chunk.id}` : ''}] could not read Cursor usage: ` +
      `${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function seedRecordedUsage(budget, usage) {
  budget.recordedRunIds ??= new Set();
  for (const run of usage?.runs ?? []) {
    if (run.runId) budget.recordedRunIds.add(run.runId);
  }
}

function seedRecordedRuns(budget, runs) {
  budget.recordedRunIds ??= new Set();
  for (const run of runs ?? []) {
    if (run.id) budget.recordedRunIds.add(run.id);
  }
}

function agentReservationCents(opts, budget) {
  if (opts.maxCostCents === null) return 0;
  const reservation = Math.min(opts.agentCostReserveCents, opts.maxCostCents);
  return budget.rawCostCents + budget.reservedCents + reservation <= opts.maxCostCents
    ? reservation
    : null;
}

async function reserveAgentBudget(opts, budget, control) {
  if (opts.maxCostCents === null) return () => {};
  while (true) {
    if (control.stopRequested) throw new Error('Shutdown requested before agent launch');
    const reservation = agentReservationCents(opts, budget);
    if (reservation !== null) {
      budget.reservedCents += reservation;
      let released = false;
      return () => {
        if (released) return;
        released = true;
        budget.reservedCents -= reservation;
      };
    }
    if (budget.reservedCents === 0) {
      control.stopRequested = true;
      control.stopReason = 'cost-ceiling';
      throw new Error(
        `Run cost ceiling leaves less than the $${(Math.min(
          opts.agentCostReserveCents,
          opts.maxCostCents,
        ) / 100).toFixed(2)} agent reservation`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

function persistedChunkPlan(chunks) {
  return chunks.map((chunk) => ({
    id: chunk.id,
    start: chunk.start,
    end: chunk.end,
    ...(chunk.parentId ? { parentId: chunk.parentId } : {}),
    ...(chunk.adaptiveDepth ? { adaptiveDepth: chunk.adaptiveDepth } : {}),
  }));
}

function chunkHitRunLimit(chunkState) {
  return chunkState?.stopReason === 'run-limit' ||
    chunkState?.lastErrors?.some((error) =>
      /cancelled cloud run .* (?:tokens|raw usage cost)/iu.test(error)
    );
}

function hasResumableChunkConversation(chunkState) {
  if (!chunkState?.agentId || chunkState.resumeExhausted) return false;
  return chunkHitRunLimit(chunkState) ||
    ['interrupted', 'recovering'].includes(chunkState.status);
}

function isDescendantChunk(chunk, parentId, chunksById) {
  let current = chunk;
  const visited = new Set();
  while (current?.parentId && !visited.has(current.id)) {
    if (current.parentId === parentId) return true;
    visited.add(current.id);
    current = chunksById.get(current.parentId);
  }
  return false;
}

function chunkLineageMap(planned, priorChunks) {
  const chunksById = new Map(planned.map((chunk) => [chunk.id, chunk]));
  for (const [id, state] of Object.entries(priorChunks ?? {})) {
    const current = chunksById.get(id) ?? { id };
    chunksById.set(id, { ...state, ...current });
  }
  for (const [parentId, state] of Object.entries(priorChunks ?? {})) {
    for (const childId of state.childChunks ?? []) {
      const child = chunksById.get(childId) ?? { id: childId };
      if (!child.parentId) chunksById.set(childId, { ...child, parentId });
    }
  }
  return chunksById;
}

function restoreResumableParentChunks(
  target,
  packet,
  planned,
  prior,
  opts,
  parentArchiveIsValid = currentChunkArchiveIsValid,
) {
  if (!prior?.chunks) return planned;
  let restored = planned;
  for (const [parentId, parentState] of Object.entries(prior.chunks)) {
    const chunksById = chunkLineageMap(restored, prior.chunks);
    const descendantIndexes = [];
    for (let index = 0; index < restored.length; index += 1) {
      if (isDescendantChunk(restored[index], parentId, chunksById)) {
        descendantIndexes.push(index);
      }
    }
    if (descendantIndexes.length === 0) continue;
    if (descendantIndexes.some((index) => {
      const descendant = restored[index];
      return prior.chunks[descendant.id]?.status === 'accepted' ||
        fs.existsSync(chunkArchivePath(target, descendant));
    })) {
      continue;
    }
    const firstIndex = descendantIndexes[0];
    const lastIndex = descendantIndexes.at(-1);
    if (
      descendantIndexes.length !== lastIndex - firstIndex + 1 ||
      restored[firstIndex].start >= restored[lastIndex].end
    ) continue;

    const parent = {
      id: parentId,
      start: restored[firstIndex].start,
      end: restored[lastIndex].end,
    };
    const recoveredArchive = parentArchiveIsValid(target, packet, parent);
    const resumableConversation =
      parentState?.status === 'split' &&
      parentState.agentId &&
      !parentState.resumeExhausted &&
      chunkHitRunLimit(parentState);
    if (!recoveredArchive && !resumableConversation) continue;
    restored = normalizePeopleExtractionChunkPlan(packet, [
      ...restored.slice(0, firstIndex),
      parent,
      ...restored.slice(lastIndex + 1),
    ], { contextUnits: opts.chunkContextUnits });
    console.log(
      recoveredArchive
        ? `[${stateKey(target)}] restored validated parent chunk ${parentId} over obsolete child ranges`
        : `[${stateKey(target)}] restored cancelled parent chunk ${parentId} for agent-conversation recovery`,
    );
  }
  return restored;
}

function archivedChunkRange(target, packet, chunkId) {
  const archive = chunkArchivePath(target, { id: chunkId });
  if (!fs.existsSync(archive)) return null;
  const compact = readJson(archive);
  const digestRows = compact.input?.unitDigests;
  if (!Array.isArray(digestRows) || digestRows.length === 0) {
    throw new Error(`Cannot reconstruct ${stateKey(target)}/chunk-${chunkId}: archive has no unit digests`);
  }
  const orderById = new Map(packet.units.map((unit, index) => [unit.id, index]));
  const orders = digestRows.map((row) => orderById.get(Array.isArray(row) ? row[0] : row.id));
  if (orders.some((order) => !Number.isInteger(order))) {
    throw new Error(`Cannot reconstruct ${stateKey(target)}/chunk-${chunkId}: archive units are stale`);
  }
  for (let index = 1; index < orders.length; index += 1) {
    if (orders[index] !== orders[index - 1] + 1) {
      throw new Error(`Cannot reconstruct ${stateKey(target)}/chunk-${chunkId}: archive is not contiguous`);
    }
  }
  return { start: orders[0], end: orders.at(-1) + 1 };
}

function restoreLegacyChunkPlan(target, packet, prior, opts) {
  if (!prior?.chunks || prior.chunkPlan?.length) return null;
  const archivedRanges = new Map();
  for (const chunkId of Object.keys(prior.chunks)) {
    const range = archivedChunkRange(target, packet, chunkId);
    if (range) archivedRanges.set(chunkId, range);
  }
  const hasRetainedChat = Object.values(prior.chunks).some((chunk) =>
    chunk.agentId && !chunk.resumeExhausted
  );
  if (archivedRanges.size === 0) {
    if (hasRetainedChat) {
      if (prior.chapterFingerprint !== packet.input.chapterFingerprint) {
        throw new Error(
          `Cannot safely resume ${stateKey(target)}: retained chunk chats belong to a stale chapter`,
        );
      }
      const recordedRanges = new Map(Object.entries(prior.chunks)
        .filter(([, chunk]) =>
          chunk.agentId && !chunk.resumeExhausted &&
          Number.isInteger(chunk.start) && Number.isInteger(chunk.end)
        )
        .map(([chunkId, chunk]) => [chunkId, { start: chunk.start, end: chunk.end }]));
      const currentPlan = planFreshChunks(target, packet, opts, null);
      const matchesRecordedOwnership = recordedRanges.size > 0 &&
        [...recordedRanges].every(([chunkId, range]) => {
          const chunk = currentPlan.find((item) => item.id === chunkId);
          return chunk?.start === range.start && chunk.end === range.end;
        });
      if (!matchesRecordedOwnership) {
        throw new Error(
          `Cannot safely resume ${stateKey(target)}: current plan does not match the retained ` +
          'agent ownership ranges',
        );
      }
      console.log(
        `[${stateKey(target)}] reconstructed legacy ${currentPlan.length}-range plan from ` +
        'recorded retained-agent ownership',
      );
      return currentPlan;
    }
    return null;
  }

  const policies = [
    { maxUnits: 250, maxCandidates: 600 },
    { maxUnits: 125, maxCandidates: 300 },
    { maxUnits: opts.maxUnits, maxCandidates: opts.maxCandidates },
  ];
  const matching = new Map();
  for (const policy of policies) {
    const candidate = planPeopleExtractionChunks(packet, {
      ...policy,
      contextUnits: opts.chunkContextUnits,
    });
    const matchesArchives = [...archivedRanges].every(([chunkId, range]) => {
      const chunk = candidate.find((item) => item.id === chunkId);
      return chunk?.start === range.start && chunk.end === range.end;
    });
    if (!matchesArchives) continue;
    matching.set(
      JSON.stringify(candidate.map(({ id, start, end }) => ({ id, start, end }))),
      candidate,
    );
  }
  if (matching.size !== 1) {
    throw new Error(
      `Cannot safely resume ${stateKey(target)}: validated legacy archives match ` +
      `${matching.size} distinct deterministic chunk plans`,
    );
  }
  const [restored] = matching.values();
  for (const [chunkId] of archivedRanges) {
    const chunk = restored.find((item) => item.id === chunkId);
    validateCompactPeopleExtraction(
      readJson(chunkArchivePath(target, { id: chunkId })),
      buildPeopleChunkPacket(packet, chunk),
    );
  }
  console.log(
    `[${stateKey(target)}] reconstructed legacy ${restored.length}-range plan from validated chunk archives`,
  );
  return restored;
}

function chunkPlanForTarget(target, packet, opts, state) {
  const prior = state.chapters[stateKey(target)];
  let planned = baseChunkPlanForTarget(target, packet, opts, state, true);
  planned = restoreResumableParentChunks(target, packet, planned, prior, opts);
  planned = enforceWorkerByteCeiling(target, packet, planned, opts, state);
  for (const chunk of [...planned]) {
    const previousChunk = prior?.chunks?.[chunk.id];
    const hitRunLimit = chunkHitRunLimit(previousChunk);
    if (!hitRunLimit) continue;
    if (currentChunkArchiveIsValid(target, packet, chunk)) continue;
    if (previousChunk?.agentId && !previousChunk.resumeExhausted) continue;
    planned = replaceChunkWithChildren(target, packet, planned, chunk, opts, state);
  }
  return planned;
}

function replaceChunkWithChildren(target, packet, chunks, failedChunk, opts, state) {
  const children = splitPeopleExtractionChunk(packet, failedChunk, {
    contextUnits: opts.chunkContextUnits,
  });
  const failedIndex = chunks.findIndex((chunk) => chunk.id === failedChunk.id);
  if (failedIndex < 0) throw new Error(`Cannot split missing chunk ${failedChunk.id}`);
  const revised = normalizePeopleExtractionChunkPlan(packet, [
    ...chunks.slice(0, failedIndex),
    ...children,
    ...chunks.slice(failedIndex + 1),
  ], { contextUnits: opts.chunkContextUnits });
  const previousChunk = state.chapters[stateKey(target)]?.chunks?.[failedChunk.id];
  updateChunkState(state, target, failedChunk, {
    status: 'split',
    childChunks: children.map((child) => child.id),
    ...(previousChunk?.resumePending ? { resumePending: false, resumeExhausted: true } : {}),
  });
  updateState(state, target, {
    status: 'interrupted',
    chunkCount: revised.length,
    chunkPlan: persistedChunkPlan(revised),
  });
  console.error(
    `[${stateKey(target)}/chunk-${failedChunk.id}] split after run limit into ` +
    children.map((child) => `${child.id} (${child.start}:${child.end})`).join(', '),
  );
  return revised;
}

function repairTarget(repair) {
  return `${repair.unit.id}:${repair.field}`;
}

function preservePriorAppliedRepairs(previous, replacement) {
  const priorApplied = previous.translationRepairs.filter((repair) => repair.status === 'applied');
  const priorPending = previous.translationRepairs.filter((repair) => repair.status === 'proposed');
  if (priorPending.length > 0) {
    throw new Error('Cannot replace an extraction while its translation repairs are awaiting review');
  }
  if (replacement.translationRepairs.some((repair) => repair.status === 'proposed')) {
    throw new Error(
      'Replacement extraction proposed new translation repairs for a chapter with existing editorial history',
    );
  }
  const replacementByTarget = new Map(replacement.translationRepairs.map((repair) => [
    repairTarget(repair),
    repair,
  ]));
  for (const repair of priorApplied) {
    const replacementRepair = replacementByTarget.get(repairTarget(repair));
    if (replacementRepair && JSON.stringify(replacementRepair) !== JSON.stringify(repair)) {
      throw new Error(`Replacement extraction changed applied repair ${repair.id}`);
    }
    if (!replacementRepair) replacement.translationRepairs.push(structuredClone(repair));
  }
  return replacement;
}

function preserveEditorialHistory(target, compact, packet) {
  const file = extractionPath(target.book, target.chapter);
  const decisionsFile = editorialDecisionPath(target.book, target.chapter);
  if (!fs.existsSync(file) || !fs.existsSync(decisionsFile)) return compact;

  const previousRaw = readJson(file);
  const previous = isCompactPeopleExtraction(previousRaw)
    ? validateCompactPeopleExtraction(previousRaw, packet).normalized
    : validatePeopleExtraction(previousRaw, packet).normalized;
  const replacement = validateCompactPeopleExtraction(compact, packet).normalized;
  preservePriorAppliedRepairs(previous, replacement);
  const protectedCompact = compactPeopleExtraction(replacement, packet);
  const protectedExtraction = validateCompactPeopleExtraction(protectedCompact, packet).normalized;
  validateAppliedEditorialDecisions(readJson(decisionsFile), protectedExtraction);
  return protectedCompact;
}

function writeAcceptedExtraction(target, compact, packet) {
  const protectedCompact = preserveEditorialHistory(target, compact, packet);
  const file = extractionPath(target.book, target.chapter);
  const serialized = serializeCompactPeopleExtraction(protectedCompact);
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') !== serialized) {
    const invalidated = invalidateResolutionReferences([target]);
    if (invalidated.removedReferences > 0) {
      console.warn(
        `[${stateKey(target)}] replacement extraction invalidated ` +
        `${invalidated.removedReferences} stale reference(s) in ` +
        `${invalidated.touchedDecisions} identity decision(s)`,
      );
    }
  }
  writeTextAtomic(file, serialized);
  return protectedCompact;
}

async function obtainChunkPart(target, fullPacket, chunk, opts, state, control, budget) {
  const packet = buildPeopleChunkPacket(fullPacket, chunk);
  const archive = chunkArchivePath(target, chunk);
  const previousChunk = state.chapters[stateKey(target)]?.chunks?.[chunk.id];
  if (fs.existsSync(archive)) {
    try {
      const extraction = readJson(archive);
      validateCompactPeopleExtraction(extraction, packet);
      updateChunkState(state, target, chunk, { status: 'accepted', cached: true, lastErrors: [] });
      console.log(`[${stateKey(target)}/chunk-${chunk.id}] reused validated local artifact`);
      return { chunk, extraction };
    } catch (error) {
      console.warn(`[${stateKey(target)}/chunk-${chunk.id}] stale local artifact ignored: ${validationErrors(error)[0]}`);
    }
  }
  if (control.stopRequested) throw new Error('Shutdown requested before chunk launch');

  let agent;
  let releaseReservation = () => {};
  try {
    let resumeAgentId = hasResumableChunkConversation(previousChunk)
      ? previousChunk.agentId
      : null;
    let workerMode = previousChunk?.workerMode === 'sealed' ? 'sealed' : 'repository';
    let accepted = null;
    const recoveryErrors = [...(previousChunk?.lastErrors ?? [])];
    if (resumeAgentId) {
      try {
        await Agent.listRuns(resumeAgentId, {
          runtime: 'cloud',
          apiKey: opts.apiKey,
          limit: 1,
        });
      } catch (error) {
        if (!isMissingCursorAgent(error)) throw error;
        console.warn(
          `[${stateKey(target)}/chunk-${chunk.id}] retained agent ${resumeAgentId} no longer exists; ` +
          'starting a sealed replacement worker',
        );
        updateChunkState(state, target, chunk, {
          status: 'interrupted',
          agentId: null,
          resumePending: false,
          resumeExhausted: true,
          lastErrors: validationErrors(error),
        });
        resumeAgentId = null;
      }
    }
    if (resumeAgentId) {
      seedRecordedUsage(budget, previousChunk.usage);
      agent = await Agent.resume(resumeAgentId, { apiKey: opts.apiKey });
      updateChunkState(state, target, chunk, {
        status: 'recovering',
        agentId: agent.agentId,
      });
      console.log(
        `[${stateKey(target)}/chunk-${chunk.id}] resuming retained agent conversation ${agent.agentId}`,
      );
      const runs = await Agent.listRuns(agent.agentId, {
        runtime: 'cloud',
        apiKey: opts.apiKey,
        limit: 20,
      });
      seedRecordedRuns(budget, runs.items);
      let existingRun = runs.items.find((candidate) => candidate.status === 'running') ?? runs.items[0];
      let existingRunError = null;
      if (existingRun?.status === 'running') {
        control.activeRuns.set(existingRun.id, { run: existingRun, target });
        try {
          existingRun = await waitForCursorRun(existingRun, {
            agentId: agent.agentId,
            apiKey: opts.apiKey,
            label: `[${stateKey(target)}] recovered chunk-${chunk.id}`,
            pollMs: DEFAULT_RUN_POLL_MS,
            maxRawCostCents: opts.maxRunCostCents,
            maxTotalTokens: opts.maxRunTokens,
          });
        } catch (error) {
          existingRunError = error;
        } finally {
          control.activeRuns.delete(existingRun.id);
        }
      }
      if (existingRun) {
        try {
          const recovered = withRunMetadata(
            await downloadExtraction(agent, chunkArtifactPath(target, chunk)),
            opts,
            agent,
            existingRun,
          );
          const validated = validateDownloadedExtraction(recovered, packet, target, chunk);
          accepted = {
            extraction: validated.normalized,
            result: existingRun,
            stats: validated.stats,
          };
          console.log(
            `[${stateKey(target)}/chunk-${chunk.id}] recovered the validated artifact before sending another turn`,
          );
        } catch (error) {
          recoveryErrors.push(...validationErrors(error));
        }
      }
      if (!accepted && existingRunError) {
        updateChunkState(state, target, chunk, {
          status: 'failed/retryable',
          lastErrors: validationErrors(existingRunError),
          ...(existingRunError instanceof CursorRunLimitExceededError
            ? { stopReason: 'run-limit' }
            : {}),
        });
        throw existingRunError;
      }
      if (!accepted) {
        if (opts.recoverOnly) {
          updateChunkState(state, target, chunk, {
            status: 'interrupted',
            resumePending: false,
          });
        }
        assertInferenceAllowed(opts, `${stateKey(target)}/chunk-${chunk.id}`);
        releaseReservation = await reserveAgentBudget(opts, budget, control);
        updateChunkState(state, target, chunk, {
          status: 'claimed',
          resumePending: true,
        });
      }
    } else {
      assertInferenceAllowed(opts, `${stateKey(target)}/chunk-${chunk.id}`);
      releaseReservation = await reserveAgentBudget(opts, budget, control);
      workerMode = 'sealed';
      agent = await Agent.create(sealedAgentOptions(target, opts, chunk));
      updateChunkState(state, target, chunk, {
        status: 'claimed',
        agentId: agent.agentId,
        workerMode,
        workerVersion: SEALED_WORKER_VERSION,
        resumePending: false,
        resumeExhausted: false,
      });
    }
    if (!accepted) {
      try {
        accepted = await obtainValidInitialExtraction(
          agent,
          target,
          packet,
          opts,
          state,
          control,
          chunk,
          resumeAgentId
            ? workerMode === 'sealed'
              ? sealedResumePrompt(target, chunk, recoveryErrors)
              : chunkResumePrompt(target, chunk, recoveryErrors)
            : sealedInitialPrompt(
              target,
              packet,
              buildPeopleChunkWorkerPacket(fullPacket, chunk),
              opts,
              chunk,
            ),
          workerMode,
        );
      } catch (error) {
        if (
          resumeAgentId &&
          !(error instanceof CursorRunLimitExceededError) &&
          !isRecoveryArtifactUnavailable(error)
        ) {
          updateChunkState(state, target, chunk, {
            status: 'interrupted',
            resumePending: false,
            resumeExhausted: true,
          });
        } else if (isRecoveryArtifactUnavailable(error)) {
          updateChunkState(state, target, chunk, {
            status: 'interrupted',
            resumePending: false,
          });
        }
        throw error;
      }
    }
    const compact = compactPeopleExtraction(accepted.extraction, packet);
    validateCompactPeopleExtraction(compact, packet);
    writeTextAtomic(archive, serializeCompactPeopleExtraction(compact));
    updateChunkState(state, target, chunk, {
      status: 'accepted',
      runId: accepted.result.id,
      cached: false,
      repairs: accepted.stats.repairs,
      lastErrors: [],
      resumePending: false,
    });
    console.log(
      `[${stateKey(target)}/chunk-${chunk.id}] accepted: ${accepted.stats.people} people, ` +
      `${accepted.stats.mentions} mentions, ${accepted.stats.claims} claims, ` +
      `${accepted.stats.repairs} repair proposal(s)`,
    );
    return { chunk, extraction: compact };
  } finally {
    await recordAgentUsage(agent, target, budget, state, chunk);
    releaseReservation();
    await closeAgent(agent);
  }
}

async function processChunkedTarget(target, packet, opts, state, control, budget) {
  const key = stateKey(target);
  let chunks = chunkPlanForTarget(target, packet, opts, state);
  updateState(state, target, {
    status: 'extracting',
    chapterFingerprint: packet.input.chapterFingerprint,
    chunkCount: chunks.length,
    chunkPlan: persistedChunkPlan(chunks),
  });
  console.log(`[${key}] chunked extraction: ${chunks.length} disjoint ownership range(s)`);
  const parts = [];
  for (let index = 0; index < chunks.length;) {
    const chunk = chunks[index];
    if (control.stopRequested) throw new Error(`Stopped after ${parts.length}/${chunks.length} chunks`);
    try {
      parts.push(await obtainChunkPart(target, packet, chunk, opts, state, control, budget));
      index += 1;
    } catch (error) {
      if (error instanceof CursorRunLimitExceededError) {
        const latest = state.chapters[key]?.chunks?.[chunk.id];
        if (latest?.agentId && !latest.resumePending && !latest.resumeExhausted) {
          updateChunkState(state, target, chunk, { status: 'interrupted' });
          console.warn(
            `[${key}/chunk-${chunk.id}] retaining the interrupted agent conversation for one continuation turn`,
          );
          continue;
        }
        chunks = replaceChunkWithChildren(target, packet, chunks, chunk, opts, state);
        continue;
      }
      throw error;
    }
  }
  const run = {
    model: `${opts.model}-chunked`,
    promptVersion: PEOPLE_CONFIG.promptVersion,
    agentId: null,
    runId: null,
    completedAt: new Date().toISOString(),
    chunks: parts.map(({ chunk, extraction }) => peopleChunkRunRecord(chunk, extraction)),
  };
  let compact = assembleCompactPeopleChunks(packet, parts, run);
  let validated = validateCompactPeopleExtraction(compact, packet);
  assertDurableCareerCoverage(validated.normalized, packet);
  compact = writeAcceptedExtraction(target, compact, packet);
  validated = validateCompactPeopleExtraction(compact, packet);
  updateState(state, target, {
    status: 'accepted',
    acceptedPath: path.relative(REPO_ROOT, extractionPath(target.book, target.chapter)),
    repairs: validated.stats.repairs,
    repairsPendingReview: validated.normalized.translationRepairs
      .filter((repair) => repair.status === 'proposed').length,
    chunkPlan: null,
    lastErrors: [],
  });
  console.log(
    `[${key}] assembled ${chunks.length} chunks: ${validated.stats.people} local people, ` +
    `${validated.stats.mentions} mentions, ${validated.stats.claims} claims, ` +
    `${validated.stats.repairs} repair proposal(s)`,
  );
  return { status: 'accepted', stats: validated.stats };
}

function acceptWholeExtraction(target, accepted, state) {
  let compact = compactPeopleExtraction(accepted.extraction, accepted.packet);
  const initial = validateCompactPeopleExtraction(compact, accepted.packet);
  assertDurableCareerCoverage(initial.normalized, accepted.packet);
  const rawArchive = path.join(
    PEOPLE_DIR,
    'generated',
    'raw-extractions',
    target.book,
    `${target.chapter}.json`,
  );
  writeJsonAtomic(rawArchive, accepted.extraction);
  compact = writeAcceptedExtraction(target, compact, accepted.packet);
  const persisted = validateCompactPeopleExtraction(compact, accepted.packet);
  updateState(state, target, {
    status: 'accepted',
    runId: accepted.result.id,
    acceptedPath: path.relative(REPO_ROOT, extractionPath(target.book, target.chapter)),
    repairs: accepted.stats.repairs,
    repairsPendingReview: persisted.normalized.translationRepairs
      .filter((repair) => repair.status === 'proposed').length,
    lastErrors: [],
  });
  console.log(
    `[${stateKey(target)}] accepted: ${accepted.stats.people} people, ` +
    `${accepted.stats.mentions} mentions, ${accepted.stats.claims} claims, ` +
    `${accepted.stats.repairs} translation repair proposal(s)`,
  );
  return { status: 'accepted', stats: accepted.stats };
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
    const chunkLabel = target.chunkCount ? `, ${target.chunkCount} planned chunks` : '';
    const payload = sealedPayloadMetrics(target, packet, opts, state);
    console.log(
      `[dry-run ${key}] ${packet.units.length} units, ` +
      `${packet.preflight.candidates.length} candidates${chunkLabel}; ` +
      `sealed payload max ${(payload.maxBytes / 1024).toFixed(1)} KiB, ` +
      `total ${(payload.totalBytes / 1024).toFixed(1)} KiB across ${payload.workers} worker(s)`,
    );
    return { status: 'dry-run' };
  }

  assertCloudSourceMatches(target, packet, opts, opts.properNounMatcher);
  const recovered = await recoverInterruptedExtraction(target, packet, opts, state, control, budget);
  if (recovered?.recoveryFailed) {
    return { status: 'interrupted', errors: recovered.errors };
  }
  if (recovered) return acceptWholeExtraction(target, recovered, state);
  updateState(state, target, { status: 'claimed', chapterFingerprint: packet.input.chapterFingerprint });

  if (exceedsBulkCeiling({ metrics: targetMetrics(packet) }, opts) && !opts.allowLarge) {
    try {
      return await processChunkedTarget(target, packet, opts, state, control, budget);
    } catch (error) {
      const errors = validationErrors(error);
      if (isRecoveryArtifactUnavailable(error)) {
        updateState(state, target, { status: 'interrupted' });
        console.log(`[${key}] no validated artifact is available yet; retained chat preserved`);
        return { status: 'recovery-unavailable', errors };
      }
      const status = control.stopRequested ? 'interrupted' : 'failed';
      updateState(state, target, { status, lastErrors: errors });
      console.error(`[${key}] chunked ${status}: ${errors[0]}`);
      return { status, errors };
    }
  }

  let agent;
  let releaseReservation = () => {};
  try {
    assertInferenceAllowed(opts, key);
    releaseReservation = await reserveAgentBudget(opts, budget, control);
    agent = await Agent.create(sealedAgentOptions(target, opts));
    updateState(state, target, {
      agentId: agent.agentId,
      workerMode: 'sealed',
      workerVersion: SEALED_WORKER_VERSION,
      resumePending: false,
      resumeExhausted: false,
    });
    const accepted = {
      ...await obtainValidInitialExtraction(
        agent,
        target,
        packet,
        opts,
        state,
        control,
        null,
        sealedInitialPrompt(target, packet, buildPeopleWorkerPacket(packet), opts),
        'sealed',
      ),
      packet,
    };
    return acceptWholeExtraction(target, accepted, state);
  } catch (error) {
    const errors = validationErrors(error);
    const status = control.stopRequested ? 'interrupted' : 'failed';
    updateState(state, target, { status, lastErrors: errors });
    console.error(`[${key}] ${status}: ${errors[0]}`);
    return { status, errors };
  } finally {
    await recordAgentUsage(agent, target, budget, state);
    releaseReservation();
    await closeAgent(agent);
  }
}

async function selfTest() {
  const careerPacket = {
    units: Array.from({ length: 10 }, (_, index) => ({
      id: `s${String(index + 1).padStart(4, '0')}`,
      en: 'Alice was appointed governor.',
      literal: 'Alice was appointed governor.',
    })),
  };
  const sparseCareerExtraction = {
    run: { promptVersion: 7 },
    coverage: { allDurableFactsCaptured: true },
    claims: [{ predicate: 'office', evidence: ['fixture:001:s0001'] }],
  };
  let sparseCareerRejected = false;
  try {
    assertDurableCareerCoverage(sparseCareerExtraction, careerPacket);
  } catch (error) {
    sparseCareerRejected = /not credible/u.test(error.message);
  }
  if (!sparseCareerRejected) {
    throw new Error('Catastrophically sparse career claims were accepted as complete');
  }
  assertDurableCareerCoverage({
    ...sparseCareerExtraction,
    claims: [
      { predicate: 'office', evidence: ['fixture:001:s0001'] },
      { predicate: 'office', evidence: ['fixture:001:s0002'] },
    ],
  }, careerPacket);

  assertDurableCareerCoverage({
    ...sparseCareerExtraction,
    claims: [],
  }, {
    units: Array.from({ length: 10 }, (_, index) => ({
      id: `s${String(index + 1).padStart(4, '0')}`,
      en: index === 0
        ? 'This rule was insufficient to serve as precedent.'
        : 'Chief ministers served as first offerers.',
      literal: '',
    })),
  });

  const appliedRepair = {
    id: 'fixture:001:r0001',
    unit: { id: 's0001' },
    field: 'idiomatic',
    before: 'wrong',
    after: 'right',
    reason: 'Reviewed fixture correction.',
    confidence: 'high',
    status: 'applied',
  };
  const replacement = preservePriorAppliedRepairs(
    { translationRepairs: [appliedRepair] },
    { translationRepairs: [] },
  );
  if (
    replacement.translationRepairs.length !== 1 ||
    replacement.translationRepairs[0] === appliedRepair ||
    replacement.translationRepairs[0].after !== 'right'
  ) {
    throw new Error('Replacement extraction did not preserve prior applied repairs');
  }
  let pendingReplacementRejected = false;
  try {
    preservePriorAppliedRepairs(
      { translationRepairs: [appliedRepair] },
      { translationRepairs: [{ ...appliedRepair, status: 'proposed' }] },
    );
  } catch (error) {
    pendingReplacementRejected = /existing editorial history/u.test(error.message);
  }
  if (!pendingReplacementRejected) {
    throw new Error('Replacement extraction admitted new repairs over existing editorial history');
  }

  const recoveryPacket = {
    units: Array.from({ length: 4 }, (_, index) => ({
      id: `s${String(index + 1).padStart(4, '0')}`,
      blockIndex: index,
    })),
    preflight: { candidates: [] },
  };
  const recoveryPlan = normalizePeopleExtractionChunkPlan(recoveryPacket, [
    { id: '001a', start: 0, end: 1, parentId: '001', adaptiveDepth: 1 },
    { id: '001b', start: 1, end: 2, parentId: '001', adaptiveDepth: 1 },
    { id: '002', start: 2, end: 4 },
  ], { contextUnits: 0 });
  const recoveryPrior = {
    chunks: {
      '001': {
        status: 'split',
        agentId: 'bc-retained-fixture',
        stopReason: 'run-limit',
      },
      '001a': { status: 'failed' },
      '001b': { status: 'failed' },
    },
  };
  const restoredRecoveryPlan = restoreResumableParentChunks(
    { book: 'fixture', chapter: '003' },
    recoveryPacket,
    recoveryPlan,
    recoveryPrior,
    { chunkContextUnits: 0 },
  );
  if (
    restoredRecoveryPlan.length !== 2 ||
    restoredRecoveryPlan[0].id !== '001' ||
    restoredRecoveryPlan[0].start !== 0 ||
    restoredRecoveryPlan[0].end !== 2
  ) {
    throw new Error('Canceled parent chunk was not restored for retained-agent recovery');
  }
  const recoveredParentPlan = restoreResumableParentChunks(
    { book: 'fixture', chapter: '003' },
    recoveryPacket,
    recoveryPlan,
    {
      chunks: {
        ...recoveryPrior.chunks,
        '001': { ...recoveryPrior.chunks['001'], status: 'accepted' },
      },
    },
    { chunkContextUnits: 0 },
    (_target, _packet, chunk) => chunk.id === '001',
  );
  if (
    recoveredParentPlan.length !== 2 ||
    recoveredParentPlan[0].id !== '001' ||
    recoveredParentPlan[0].start !== 0 ||
    recoveredParentPlan[0].end !== 2
  ) {
    throw new Error('Validated recovered parent chunk did not supersede obsolete child ranges');
  }
  const acceptedChildPlan = restoreResumableParentChunks(
    { book: 'fixture', chapter: '003' },
    recoveryPacket,
    recoveryPlan,
    {
      chunks: {
        ...recoveryPrior.chunks,
        '001a': { status: 'accepted' },
      },
    },
    { chunkContextUnits: 0 },
    (_target, _packet, chunk) => chunk.id === '001',
  );
  if (acceptedChildPlan.length !== 3 || acceptedChildPlan[0].id !== '001a') {
    throw new Error('Retained-agent recovery replaced an already accepted child chunk');
  }
  if (
    !hasResumableChunkConversation({ status: 'interrupted', agentId: 'bc-interrupted-fixture' }) ||
    hasResumableChunkConversation({
      status: 'interrupted',
      agentId: 'bc-exhausted-fixture',
      resumeExhausted: true,
    })
  ) {
    throw new Error('Interrupted chunk conversation eligibility is incorrect');
  }
  if (
    !recoveryOnlyTarget(
      { book: 'fixture', chapter: '003' },
      { chapters: { 'fixture/003': recoveryPrior } },
    ) ||
    recoveryOnlyTarget(
      { book: 'fixture', chapter: '003' },
      { chapters: { 'fixture/003': { status: 'accepted', chunks: {} } } },
    )
  ) {
    throw new Error('Recovery-only prefilter did not isolate resumable work');
  }
  const deepRecoveryPlan = normalizePeopleExtractionChunkPlan(recoveryPacket, [
    { id: '001aa', start: 0, end: 1, parentId: '001a', adaptiveDepth: 2 },
    { id: '001ab', start: 1, end: 2, parentId: '001a', adaptiveDepth: 2 },
    { id: '001b', start: 2, end: 3, parentId: '001', adaptiveDepth: 1 },
    { id: '002', start: 3, end: 4 },
  ], { contextUnits: 0 });
  const deepRecoveryPrior = {
    chunks: {
      '001': {
        status: 'split',
        agentId: 'bc-retained-deep-fixture',
        stopReason: 'run-limit',
        childChunks: ['001a', '001b'],
      },
      '001a': {
        status: 'split',
        childChunks: ['001aa', '001ab'],
      },
      '001aa': { status: 'failed' },
      '001ab': { status: 'failed' },
      '001b': { status: 'failed' },
    },
  };
  const restoredDeepRecoveryPlan = restoreResumableParentChunks(
    { book: 'fixture', chapter: '004' },
    recoveryPacket,
    deepRecoveryPlan,
    deepRecoveryPrior,
    { chunkContextUnits: 0 },
  );
  if (
    restoredDeepRecoveryPlan.length !== 2 ||
    restoredDeepRecoveryPlan[0].id !== '001' ||
    restoredDeepRecoveryPlan[0].start !== 0 ||
    restoredDeepRecoveryPlan[0].end !== 3
  ) {
    throw new Error('Deeply split parent chunk was not restored for retained-agent recovery');
  }
  const bytePacket = {
    book: 'fixture',
    chapter: '005',
    source: { title: { zh: '測試', en: 'Fixture' } },
    units: Array.from({ length: 4 }, (_, index) => ({
      id: `s${String(index + 1).padStart(4, '0')}`,
      kind: 'paragraph-sentence',
      blockIndex: index,
      zh: '甲乙丙丁',
      en: 'A deliberately long fixture unit.',
      literal: 'A deliberately long literal fixture unit.',
    })),
    input: {
      unitCount: 4,
      chapterFingerprint: 'sha256:fixture-chapter',
      unitDigests: Array.from({ length: 4 }, (_, index) => ({
        id: `s${String(index + 1).padStart(4, '0')}`,
        zh: `sha256:fixture-zh-${index}`,
        en: `sha256:fixture-en-${index}`,
        literal: `sha256:fixture-literal-${index}`,
      })),
    },
    preflight: { scannerVersion: 2, candidates: [] },
    context: { westernEraStyle: 'BC_AD', roles: [], polities: [], reigns: [] },
  };
  const byteBoundPlan = enforceWorkerByteCeiling(
    { book: 'fixture', chapter: '005' },
    bytePacket,
    [{ id: '001', start: 0, end: 4 }],
    { chunkContextUnits: 0, maxWorkerBytes: 1 },
    { chapters: {} },
  );
  if (byteBoundPlan.length !== 4 || byteBoundPlan.some((chunk) => chunk.units !== 1)) {
    throw new Error('Worker byte ceiling did not split an oversized packet to its minimum ranges');
  }
  const staleAgentPlan = enforceWorkerByteCeiling(
    { book: 'fixture', chapter: '005' },
    bytePacket,
    [{ id: '001', start: 0, end: 4 }],
    { chunkContextUnits: 0, maxWorkerBytes: 1 },
    { chapters: { 'fixture/005': { chunks: { '001': {
      status: 'accepted',
      agentId: 'bc-stale-fixture',
    } } } } },
  );
  if (staleAgentPlan.length !== 4) {
    throw new Error('A non-resumable historical agent bypassed the worker byte ceiling');
  }
  const retainedAgentPlan = enforceWorkerByteCeiling(
    { book: 'fixture', chapter: '005' },
    bytePacket,
    [{ id: '001', start: 0, end: 4 }],
    { chunkContextUnits: 0, maxWorkerBytes: 1 },
    { chapters: { 'fixture/005': { chunks: { '001': {
      status: 'interrupted',
      agentId: 'bc-retained-fixture',
    } } } } },
  );
  if (retainedAgentPlan.length !== 1 || retainedAgentPlan[0].id !== '001') {
    throw new Error('A resumable agent conversation was split before its recovery turn');
  }
  const sealedFixtureTarget = { book: 'fixture', chapter: '005' };
  const sealedFixtureOpts = {
    apiKey: 'fixture-key',
    model: 'grok-4.5',
    effort: 'low',
    fast: false,
  };
  const sealedPrompt = sealedInitialPrompt(
    sealedFixtureTarget,
    bytePacket,
    buildPeopleWorkerPacket(bytePacket),
    sealedFixtureOpts,
  );
  const sealedArtifact = sealedArtifactPath(artifactPath(sealedFixtureTarget));
  if (
    !sealedPrompt.includes(sealedArtifact) ||
    !sealedPrompt.includes('A deliberately long fixture unit.') ||
    !sealedPrompt.includes('sha256:fixture-chapter') ||
    !sealedPrompt.includes('<compact-extraction-schema>') ||
    !sealedPrompt.includes('<immutable-seed>')
  ) {
    throw new Error('Sealed worker prompt omitted its artifact, packet, schema, or immutable seed');
  }
  const sealedOptions = sealedAgentOptions(sealedFixtureTarget, sealedFixtureOpts);
  if (
    'repos' in sealedOptions.cloud ||
    sealedOptions.cloud.metadata.workerMode !== 'sealed' ||
    sealedOptions.cloud.metadata.workerVersion !== String(SEALED_WORKER_VERSION)
  ) {
    throw new Error('Fresh sealed worker was given repository context or incorrect metadata');
  }

  const small = { book: 'fixture', chapter: '002', metrics: {
    units: 100, candidates: 200, workerBytes: 10_000, workloadScore: 42_000,
  } };
  const large = { book: 'fixture', chapter: '001', metrics: {
    units: 400, candidates: 900, workerBytes: 30_000, workloadScore: 174_000,
  } };
  const longProse = { book: 'fixture', chapter: '003', metrics: {
    units: 20, candidates: 40, workerBytes: 80_000, workloadScore: 86_400,
  } };
  const opts = {
    allowLarge: false,
    maxUnits: 250,
    maxCandidates: 600,
    maxWorkerBytes: 64 * 1024,
  };
  const invalidationFixture = {
    schemaVersion: 1,
    batch: 'fixture',
    decisions: [
      {
        decision: 'merge',
        localPeople: ['hanshu:004:p001', 'shiji:001:p001', 'shiji:002:p001'],
        canonicalPersonId: 'per_fixture',
        basis: ['same-person'],
        confidence: 'high',
      },
      {
        decision: 'keep-separate',
        localPeople: ['hanshu:004:p002', 'shiji:003:p001'],
        basis: ['different-people'],
        confidence: 'high',
      },
      {
        decision: 'merge',
        localPeople: ['shiji:004:p001', 'shiji:005:p001'],
        basis: ['same-person'],
        confidence: 'high',
      },
    ],
  };
  const invalidated = pruneResolutionDocument(invalidationFixture, [{ book: 'hanshu', chapter: '004' }]);
  if (
    invalidated.stats.removedReferences !== 2
    || invalidated.stats.removedDecisions !== 1
    || invalidated.document.decisions.length !== 2
    || invalidated.document.decisions[0].localPeople.length !== 2
    || 'canonicalPersonId' in invalidated.document.decisions[0]
  ) {
    throw new Error('Replacement extraction did not invalidate stale identity references');
  }
  if ([large, small].sort(compareWorkload)[0] !== small) {
    throw new Error('Workload ordering did not put the smaller chapter first');
  }
  const retainedChat = {
    ...large,
    metrics: { ...large.metrics, recoveryPriority: 0 },
  };
  if ([small, retainedChat].sort(compareWorkload)[0] !== retainedChat) {
    throw new Error('Workload ordering did not prioritize a retained agent conversation');
  }
  const oneWorker = withDispatchMetrics(small, 1);
  const fourWorkers = withDispatchMetrics({
    ...small,
    metrics: { ...small.metrics, workloadScore: 1 },
  }, 4);
  if ([fourWorkers, oneWorker].sort(compareWorkload)[0] !== oneWorker) {
    throw new Error('Dispatch ordering did not account for per-agent overhead');
  }
  if (
    exceedsBulkCeiling(small, opts) ||
    !exceedsBulkCeiling(large, opts) ||
    !exceedsBulkCeiling(longProse, opts)
  ) {
    throw new Error('Bulk size ceilings did not classify fixture chapters');
  }
  if (
    parseCursorDollarLimit('10.25', '--max-cost') !== 1025 ||
    parseCursorDollarLimit('unlimited', '--max-cost') !== null
  ) {
    throw new Error('Cost ceiling parser returned the wrong amount');
  }
  if (!isCursorAgentBusy({ code: 'agent_busy' }) ||
      !isCursorAgentBusy(new Error('[agent_busy] Agent already has an active run')) ||
      isCursorAgentBusy(new Error('unrelated failure'))) {
    throw new Error('Cursor agent-busy errors were not classified correctly');
  }
  if (
    !isCursorRateLimited(new Error('You have exceeded the rate limit of 6000 requests per hour')) ||
    !isCursorRateLimited({ status: 429 }) ||
    isCursorRateLimited(new Error('unrelated failure')) ||
    cursorRateLimitDelayMs(
      new Error('You have exceeded the rate limit of 30 requests per minute'),
      { minuteDelayMs: 123, hourDelayMs: 456 },
    ) !== 123 ||
    cursorRateLimitDelayMs(
      new Error('You have exceeded the rate limit of 6000 requests per hour'),
      { minuteDelayMs: 123, hourDelayMs: 456 },
    ) !== 456
  ) {
    throw new Error('Cursor rate-limit errors were not classified correctly');
  }
  let sendAttempts = 0;
  const fakeRun = await sendCursorAgentWhenReady({
    async send() {
      sendAttempts += 1;
      if (sendAttempts === 1) {
        throw Object.assign(new Error('[agent_busy] Agent already has an active run'), {
          code: 'agent_busy',
        });
      }
      return { id: 'run-fixture' };
    },
  }, 'fixture prompt', {
    label: '[fixture] extraction',
    initialDelayMs: 0,
    maxDelayMs: 0,
    timeoutMs: 100,
  });
  if (sendAttempts !== 2 || fakeRun.id !== 'run-fixture') {
    throw new Error('Cursor agent-busy retry did not preserve the logical turn');
  }
  let networkSendAttempts = 0;
  const recoveredNetworkRun = await sendCursorAgentWhenReady({
    async send() {
      networkSendAttempts += 1;
      if (networkSendAttempts === 1) throw new Error('Network request failed');
      return { id: 'run-network-fixture' };
    },
  }, 'fixture prompt', {
    label: '[fixture] extraction',
    initialDelayMs: 0,
    maxDelayMs: 0,
    timeoutMs: 100,
  });
  if (networkSendAttempts !== 2 || recoveredNetworkRun.id !== 'run-network-fixture') {
    throw new Error('Cursor transient-network retry did not preserve the logical turn');
  }
  const budget = { rawCostCents: 400, chargedCents: 0, reservedCents: 600 };
  const costOpts = { maxCostCents: 2000, agentCostReserveCents: 1000 };
  if (agentReservationCents(costOpts, budget) !== 1000) {
    throw new Error('Cost reservation did not admit an agent within the ceiling');
  }
  budget.reservedCents = 700;
  if (agentReservationCents(costOpts, budget) !== null) {
    throw new Error('Cost reservation admitted an agent beyond the ceiling');
  }
  async function assertGuardCancellation({ totalTokens, rawCostCents, metric }) {
    let cancelledForLimit = false;
    const neverFinishes = new Promise(() => {});
    const guardedRun = {
      id: `run-${metric}-fixture`,
      usage: undefined,
      supports: () => true,
      wait: () => neverFinishes,
      cancel: async () => { cancelledForLimit = true; },
    };
    let limitError;
    try {
      await waitForCursorRun(guardedRun, {
        agentId: 'bc-limit-fixture',
        apiKey: 'fixture',
        label: '[fixture] guarded run',
        pollMs: 1,
        timeoutMs: 100,
        maxRawCostCents: 100,
        maxTotalTokens: 1_000,
        readUsage: async () => ({
          usage: { totalTokens },
          cost: { rawCostCents, chargedCents: 0 },
        }),
      });
    } catch (error) {
      limitError = error;
    }
    if (
      !(limitError instanceof CursorRunLimitExceededError)
      || !cancelledForLimit
      || limitError.isRetryable
      || limitError.metric !== metric
      || limitError.runId !== guardedRun.id
    ) {
      throw new Error(`In-flight ${metric} limit did not cancel with a non-retryable error`);
    }
  }
  await assertGuardCancellation({ totalTokens: 1_001, rawCostCents: 99, metric: 'tokens' });
  await assertGuardCancellation({ totalTokens: 999, rawCostCents: 101, metric: 'raw-cost' });
  let terminalLimitError;
  try {
    await waitForCursorRun({
      id: 'run-terminal-limit-fixture',
      usage: undefined,
      wait: async () => ({ id: 'run-terminal-limit-fixture', status: 'finished' }),
    }, {
      agentId: 'bc-terminal-limit-fixture',
      apiKey: 'fixture',
      label: '[fixture] terminal guarded run',
      pollMs: 1,
      timeoutMs: 100,
      maxRawCostCents: 100,
      maxTotalTokens: 1_000,
      readUsage: async () => ({
        usage: { totalTokens: 1_001 },
        cost: { rawCostCents: 99, chargedCents: 0 },
      }),
    });
  } catch (error) {
    terminalLimitError = error;
  }
  if (
    !(terminalLimitError instanceof CursorRunLimitExceededError)
    || terminalLimitError.metric !== 'tokens'
    || terminalLimitError.runId !== 'run-terminal-limit-fixture'
  ) {
    throw new Error('Terminal run bypassed its final usage-limit check');
  }
  const dryRunState = {
    schemaVersion: 1,
    chapters: {
      'fixture/001': {
        status: 'extracting',
        agentId: 'bc-fixture',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    },
  };
  const beforeDryRun = JSON.stringify(dryRunState);
  const changed = recordCurrentExtraction(
    dryRunState,
    { book: 'fixture', chapter: '001' },
    { input: { chapterFingerprint: 'sha256:fixture' } },
    { dryRun: true },
  );
  if (changed || JSON.stringify(dryRunState) !== beforeDryRun) {
    throw new Error('Dry-run queue planning mutated extraction state');
  }
  let recoveryOnlyRejectedInference = false;
  try {
    assertInferenceAllowed({ recoverOnly: true }, 'fixture/001');
  } catch (error) {
    recoveryOnlyRejectedInference = error.code === 'RECOVERY_ARTIFACT_UNAVAILABLE';
  }
  if (!recoveryOnlyRejectedInference) {
    throw new Error('Recovery-only mode did not reject a new model turn');
  }
  if (!isRecoveryArtifactUnavailable({ code: 'RECOVERY_ARTIFACT_UNAVAILABLE' })) {
    throw new Error('Recovery-only artifact absence was not classified');
  }
  if (!isMissingCursorAgent({ code: 'agent_not_found' }) ||
      isMissingCursorAgent({ code: 'network_error' })) {
    throw new Error('Missing Cursor agent errors were not classified narrowly');
  }
  const scoped = planningScopeTargets([
    { book: 'fixture', chapter: '001' },
    { book: 'fixture', chapter: '002' },
    { book: 'fixture', chapter: '003' },
  ], {
    claims: {
      'fixture/001': { lane: 'cursor-sdk', status: 'resume-required' },
      'fixture/002': { lane: 'cursor-sdk', status: 'resume-required' },
    },
  }, { recoverOnly: false, limit: 2 }, {
    chapters: {
      'fixture/001': { status: 'interrupted', agentId: 'bc-a' },
      'fixture/002': { status: 'interrupted', agentId: 'bc-b' },
    },
  });
  if (scoped.length !== 2 || scoped.some((target) => target.chapter === '003')) {
    throw new Error('Recovery-first planning did not bypass unrelated fresh chapters');
  }
  const historicalBudget = { recordedRunIds: new Set() };
  seedRecordedRuns(historicalBudget, [{ id: 'run-before-restart' }]);
  if (!historicalBudget.recordedRunIds.has('run-before-restart')) {
    throw new Error('Restart accounting did not exclude a preexisting Cursor run');
  }
  const lockDirectory = fs.mkdtempSync(path.join(REPO_ROOT, '.people-extract-lock-test-'));
  const lockFile = path.join(lockDirectory, 'run.lock');
  try {
    const release = acquireProcessRunLock(lockFile, { label: 'People extraction scheduler' });
    let duplicateRejected = false;
    try {
      acquireProcessRunLock(lockFile, { label: 'People extraction scheduler' });
    } catch (error) {
      duplicateRejected = /already running/u.test(error.message);
    }
    if (!duplicateRejected) throw new Error('Concurrent extraction scheduler lock was not rejected');
    release();
    const stale = {
      schemaVersion: 1,
      pid: 2147483647,
      token: 'stale',
      startedAt: '2026-01-01T00:00:00.000Z',
      argv: [],
    };
    fs.writeFileSync(lockFile, `${JSON.stringify(stale)}\n`);
    acquireProcessRunLock(lockFile, { label: 'People extraction scheduler' })();
  } finally {
    fs.rmSync(lockDirectory, { recursive: true, force: true });
  }
  console.log('sdk-people-extract scheduler self-test: ok');
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  if (!opts.dryRun && !opts.apiKey) throw new Error('CURSOR_API_KEY is required. Get a key from Cursor -> Integrations.');
  const releaseRunLock = opts.dryRun
    ? () => {}
    : acquireProcessRunLock(RUN_LOCK_FILE, { label: 'People extraction scheduler' });
  try {
    const state = loadState();
    if (!opts.dryRun) recoverInterruptedState(state);
    opts.properNounMatcher = loadProperNounMatcher();
    const sharedQueueOptions = {
      remote: opts.queueRemote,
      branch: opts.queueBranch,
      baseRef: opts.queueBaseRef,
    };
    fetchPeopleQueueBase(sharedQueueOptions);
    if (!opts.dryRun) {
      const synced = syncLocalCursorReservations({
        ...sharedQueueOptions,
        worker: opts.workerId,
      });
      console.log(
        `Shared queue synchronized: recovery=${synced.result.recovery.length}, ` +
        `local-ready=${synced.result.ready.length}, reserved-elsewhere=${synced.result.reservedElsewhere.length}, ` +
        `merged-pruned=${synced.result.merged.length}`,
      );
    }
    const workLedger = readRemotePeopleWorkLedger(sharedQueueOptions);
    const allTargets = chapterTargets(opts);
    const laneTargets = allTargets.filter((target) =>
      availableToCursorLane(target, workLedger, opts.workerId, state)
    );
    const rawTargets = planningScopeTargets(laneTargets, workLedger, opts, state);
    if (rawTargets.length < laneTargets.length) {
      console.log(
        `Recovery-first planner: measuring ${rawTargets.length} resumable chapter(s) ` +
        `instead of ${laneTargets.length} available chapters`,
      );
    }
    if (opts.chapter && rawTargets.length === 0) {
      const claim = workLedger.claims[workQueueChapterKey({ book: opts.book, chapter: opts.chapter })];
      throw new Error(
        `${opts.book}/${opts.chapter} is reserved by ${claim?.lane ?? 'another lane'}/` +
        `${claim?.worker ?? 'unknown worker'} (${claim?.status ?? 'active'})`,
      );
    }
    const queue = prepareTargetQueue(rawTargets, opts, state, opts.properNounMatcher);
    let targets = queue.selected;
    let claimedTargets = [];
    if (!opts.dryRun && !opts.recoverOnly && targets.length > 0) {
      const reserved = claimRemotePeopleTargets(targets, {
        ...sharedQueueOptions,
        lane: 'cursor-sdk',
        worker: opts.workerId,
        limit: targets.length,
      });
      const claimedKeys = new Set(reserved.result.claimed.map(workQueueChapterKey));
      claimedTargets = targets.filter((target) => claimedKeys.has(workQueueChapterKey(target)));
      if (claimedTargets.length !== targets.length) {
        console.warn(
          `Shared queue race: reserved ${claimedTargets.length}/${targets.length}; ` +
          'chapters claimed by the other lane were removed before inference.',
        );
      }
      targets = claimedTargets;
    }
    const planPath = path.relative(REPO_ROOT, opts.planOut);
    console.log(
      `Queue plan ${planPath}: selected=${targets.length}, waiting=${queue.waiting.length}, ` +
      `oversized=${queue.oversized.length}, current=${queue.current.length}, failed=${queue.failed.length}`,
    );
    for (const target of targets.slice(0, 20)) {
      console.log(
        `  ${stateKey(target)}: ${target.metrics.units} units, ${target.metrics.candidates} candidates, ` +
        `${(target.metrics.workerBytes / 1024).toFixed(1)} KiB worker packet` +
        `${target.chunkCount ? `, ${target.chunkCount} chunks` : ''}`,
      );
    }
    if (targets.length > 20) console.log(`  ... ${targets.length - 20} more selected chapter(s)`);
    console.log(
      `Cursor Cloud concurrency=${opts.concurrency}; model=${opts.model} effort=${opts.effort} ` +
      `fast=${opts.fast ? 'on' : 'off'}; run cost ceiling=` +
      `${opts.maxCostCents === null ? 'unlimited' : `$${(opts.maxCostCents / 100).toFixed(2)}`}; ` +
      `agent reservation=$${(opts.agentCostReserveCents / 100).toFixed(2)}; ` +
      `per-run raw ceiling=${opts.maxRunCostCents === null ? 'unlimited' : `$${(opts.maxRunCostCents / 100).toFixed(2)}`}; ` +
      `per-run token ceiling=${opts.maxRunTokens === null ? 'unlimited' : opts.maxRunTokens.toLocaleString('en-US')}; ` +
      `${opts.recoverOnly ? 'artifact recovery only; ' : ''}` +
      `shared worker=${opts.workerId}; fresh workers=sealed packet-only; no worker git pushes`,
    );
    if (!opts.dryRun && targets.length > 0) fetchStartingRef(opts.startingRef);

    const control = createRunControl();
    const removeSignalHandlers = opts.dryRun ? () => {} : installSignalHandlers(control);
    const budget = {
      rawCostCents: 0,
      chargedCents: 0,
      reservedCents: 0,
      recordedRunIds: new Set(),
      recordedAgents: new Set(),
    };
    let nextIndex = 0;
    const results = [];
    const workers = Array.from({ length: Math.min(opts.concurrency, targets.length) }, async () => {
      while (nextIndex < targets.length && !control.stopRequested) {
        if (opts.maxCostCents !== null && budget.rawCostCents >= opts.maxCostCents) {
          control.stopRequested = true;
          control.stopReason = 'cost-ceiling';
          console.error(
            `Run raw cost ceiling reached at $${(budget.rawCostCents / 100).toFixed(2)}; ` +
            'no new agents will start.',
          );
          break;
        }
        const target = targets[nextIndex++];
        results.push({ target, outcome: await processTarget(target, opts, state, control, budget) });
      }
    });
    try {
      await Promise.all(workers);
    } finally {
      removeSignalHandlers();
    }

    const counts = new Map();
    for (const { outcome } of results) {
      counts.set(outcome.status, (counts.get(outcome.status) ?? 0) + 1);
    }
    if (!opts.dryRun && claimedTargets.length > 0) {
      const ready = results
        .filter(({ outcome }) => ['accepted', 'skipped'].includes(outcome.status))
        .map(({ target }) => target);
      const resumable = results
        .filter(({ outcome, target }) =>
          !['accepted', 'skipped'].includes(outcome.status) && recoveryOnlyTarget(target, state)
        )
        .map(({ target }) => target);
      const failed = results
        .filter(({ outcome, target }) =>
          !['accepted', 'skipped'].includes(outcome.status) && !recoveryOnlyTarget(target, state)
        )
        .map(({ target }) => target);
      if (ready.length) {
        markRemotePeopleClaims(ready, 'ready', {
          ...sharedQueueOptions,
          lane: 'cursor-sdk',
          worker: opts.workerId,
          note: 'Validated extraction exists locally and awaits a deliberate checkpoint push',
        });
      }
      if (resumable.length) {
        markRemotePeopleClaims(resumable, 'resume-required', {
          ...sharedQueueOptions,
          lane: 'cursor-sdk',
          worker: opts.workerId,
          note: 'Retained Cursor conversation, adaptive plan, or accepted chunk must be recovered first',
        });
      }
      if (failed.length) {
        markRemotePeopleClaims(failed, 'failed', {
          ...sharedQueueOptions,
          lane: 'cursor-sdk',
          worker: opts.workerId,
          note: 'Manual inspection or explicit release is required before reassignment',
        });
      }
    }
    console.log(`Finished: ${[...counts].map(([status, count]) => `${status}=${count}`).join(', ') || 'no targets'}`);
    console.log(
      `Raw usage cost this invocation: $${(budget.rawCostCents / 100).toFixed(2)}; ` +
      `charged: $${(budget.chargedCents / 100).toFixed(2)}; ` +
      `not started: ${targets.length - nextIndex}; stop reason: ${control.stopReason ?? 'queue-complete'}`,
    );
    console.log(
      'Accepted files remain local. Commit locally in batches; push codex/people-glossary-staging only at a deliberate checkpoint.',
    );
    if (counts.has('failed')) process.exitCode = 2;
    else if (control.stopReason === 'run-limit') process.exitCode = 2;
    else if (control.stopReason === 'SIGINT' || control.stopReason === 'SIGTERM') process.exitCode = 130;
  } finally {
    releaseRunLock();
  }
}

if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
