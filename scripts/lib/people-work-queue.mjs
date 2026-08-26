import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  DATA_DIR,
  PEOPLE_DIR,
  REPO_ROOT,
  buildInputFingerprint,
  chapterPath,
  contentUnits,
  extractionPath,
  readJson,
} from './people-content.mjs';

export const DEFAULT_PEOPLE_QUEUE_BRANCH = 'codex/people-work-queue';
export const DEFAULT_PEOPLE_STAGING_BRANCH = 'codex/people-glossary-staging-v2';
export const DEFAULT_PEOPLE_QUEUE_REMOTE = 'origin';
export const DEFAULT_PEOPLE_QUEUE_BASE_REF = 'origin/master';
export const PEOPLE_QUEUE_FILE = 'people-work-queue.json';
export const DEFAULT_CLAIM_HOURS = 24;

const PEOPLE_CONFIG = readJson(path.join(PEOPLE_DIR, 'config.json'));
const RECOVERABLE_STATUSES = new Set([
  'claimed',
  'extracting',
  'interrupted',
  'recovering',
  'failed/retryable',
  'failed',
  'split',
]);

function git(args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: options.cwd ?? REPO_ROOT,
    encoding: 'utf8',
    input: options.input,
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: process.env.GIT_AUTHOR_NAME || '24histories queue broker',
      GIT_AUTHOR_EMAIL: process.env.GIT_AUTHOR_EMAIL || 'queue@24histories.com',
      GIT_COMMITTER_NAME: process.env.GIT_COMMITTER_NAME || '24histories queue broker',
      GIT_COMMITTER_EMAIL: process.env.GIT_COMMITTER_EMAIL || 'queue@24histories.com',
    },
  });
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(
      `git ${args.join(' ')} failed: ${(result.stderr || result.stdout || '').trim()}`,
    );
  }
  return result;
}

function emptyLedger() {
  return {
    schemaVersion: 1,
    updatedAt: new Date(0).toISOString(),
    claims: {},
  };
}

export function validatePeopleWorkLedger(ledger) {
  if (!ledger || ledger.schemaVersion !== 1 || typeof ledger.claims !== 'object' || Array.isArray(ledger.claims)) {
    throw new Error('Invalid people work queue ledger');
  }
  for (const [key, claim] of Object.entries(ledger.claims)) {
    if (!/^[a-z0-9_-]+\/\d{3}$/u.test(key)) throw new Error(`Invalid queue chapter key: ${key}`);
    if (!['cursor-sdk', 'grokbot'].includes(claim.lane)) throw new Error(`Invalid queue lane for ${key}`);
    if (!claim.worker || !claim.status || !claim.updatedAt) throw new Error(`Incomplete queue claim for ${key}`);
    if (claim.sticky !== true && !claim.expiresAt) throw new Error(`Non-sticky queue claim lacks expiry: ${key}`);
  }
  return ledger;
}

function remoteRef(remote, branch) {
  return `refs/remotes/${remote}/${branch}`;
}

function fetchQueueSnapshot({ remote, branch }) {
  const destination = remoteRef(remote, branch);
  const fetched = git([
    'fetch', '--quiet', remote, `+refs/heads/${branch}:${destination}`,
  ], { allowFailure: true });
  if (fetched.status !== 0) return { oid: null, ledger: emptyLedger() };
  const oid = git(['rev-parse', destination]).stdout.trim();
  const shown = git(['show', `${oid}:${PEOPLE_QUEUE_FILE}`], { allowFailure: true });
  if (shown.status !== 0) throw new Error(`${branch} exists without ${PEOPLE_QUEUE_FILE}`);
  return { oid, ledger: validatePeopleWorkLedger(JSON.parse(shown.stdout)) };
}

function writeQueueCommit(ledger, oldOid, { remote, branch, message }) {
  const serialized = `${JSON.stringify(ledger, null, 2)}\n`;
  const blob = git(['hash-object', '-w', '--stdin'], { input: serialized }).stdout.trim();
  const tree = git(['mktree'], {
    input: `100644 blob ${blob}\t${PEOPLE_QUEUE_FILE}\n`,
  }).stdout.trim();
  const args = ['commit-tree', tree];
  if (oldOid) args.push('-p', oldOid);
  args.push('-m', message);
  const commit = git(args).stdout.trim();
  const pushed = git([
    'push', '--porcelain', remote, `${commit}:refs/heads/${branch}`,
  ], { allowFailure: true });
  return { ok: pushed.status === 0, commit, error: (pushed.stderr || pushed.stdout).trim() };
}

export function mutateRemotePeopleWorkLedger(mutator, options = {}) {
  const remote = options.remote ?? DEFAULT_PEOPLE_QUEUE_REMOTE;
  const branch = options.branch ?? DEFAULT_PEOPLE_QUEUE_BRANCH;
  const attempts = options.attempts ?? 8;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const { oid, ledger: original } = fetchQueueSnapshot({ remote, branch });
    const ledger = structuredClone(original);
    const result = mutator(ledger);
    ledger.updatedAt = new Date().toISOString();
    validatePeopleWorkLedger(ledger);
    const written = writeQueueCommit(ledger, oid, {
      remote,
      branch,
      message: options.message ?? 'Update people work queue',
    });
    if (written.ok) return { ledger, result, commit: written.commit };
    if (attempt === attempts) {
      throw new Error(`Could not update ${remote}/${branch} after ${attempts} attempts: ${written.error}`);
    }
  }
  throw new Error('Unreachable people queue update state');
}

export function readRemotePeopleWorkLedger(options = {}) {
  return fetchQueueSnapshot({
    remote: options.remote ?? DEFAULT_PEOPLE_QUEUE_REMOTE,
    branch: options.branch ?? DEFAULT_PEOPLE_QUEUE_BRANCH,
  }).ledger;
}

export function fetchPeopleQueueBase(options = {}) {
  const remote = options.remote ?? DEFAULT_PEOPLE_QUEUE_REMOTE;
  const baseRef = options.baseRef ?? DEFAULT_PEOPLE_QUEUE_BASE_REF;
  const match = baseRef.match(new RegExp(`^${remote}/(.+)$`, 'u'));
  if (match) git(['fetch', '--quiet', remote, match[1]]);
}

export function chapterKey(target) {
  return `${target.book}/${target.chapter}`;
}

function splitChapterKey(key) {
  const [book, chapter] = key.split('/');
  return { book, chapter };
}

function chapterFingerprintFromData(chapter) {
  return buildInputFingerprint(contentUnits(chapter)).chapterFingerprint;
}

function jsonAtRef(ref, file) {
  const relative = path.relative(REPO_ROOT, file);
  const shown = git(['show', `${ref}:${relative}`], { allowFailure: true });
  return shown.status === 0 ? JSON.parse(shown.stdout) : null;
}

export function extractionIsCurrent(target, options = {}) {
  const ref = options.ref ?? null;
  const extraction = ref
    ? jsonAtRef(ref, extractionPath(target.book, target.chapter))
    : fs.existsSync(extractionPath(target.book, target.chapter))
      ? readJson(extractionPath(target.book, target.chapter))
      : null;
  if (!extraction) return false;
  const complete = extraction?.coverage && [
    'allUnitsVisited',
    'preflightCandidatesAccountedFor',
    'allNamedPeopleAndMentionsCaptured',
    'allDurableFactsCaptured',
    'allChronologyCaptured',
    'allPersonEventsCaptured',
    'allClaimProvenanceCaptured',
    'allFamilyRelationshipsCaptured',
    'editorialPassCompleted',
  ].every((key) => extraction.coverage[key] === true);
  if (!complete || extraction.run?.promptVersion < PEOPLE_CONFIG.promptVersion) return false;
  const chapter = ref
    ? jsonAtRef(ref, chapterPath(target.book, target.chapter))
    : fs.existsSync(chapterPath(target.book, target.chapter))
      ? readJson(chapterPath(target.book, target.chapter))
      : null;
  if (!chapter) return false;
  return extraction.input?.chapterFingerprint === chapterFingerprintFromData(chapter);
}

export function listPeopleChapterTargets(options = {}) {
  const targets = [];
  for (const entry of fs.readdirSync(DATA_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'people' || (options.book && entry.name !== options.book)) continue;
    const directory = path.join(DATA_DIR, entry.name);
    for (const file of fs.readdirSync(directory).filter((name) => /^\d{3}\.json$/u.test(name)).sort()) {
      const chapter = file.slice(0, 3);
      if (options.chapter && chapter !== options.chapter) continue;
      const sourceFile = path.join(directory, file);
      targets.push({ book: entry.name, chapter, sourceBytes: fs.statSync(sourceFile).size });
    }
  }
  return targets.sort((left, right) =>
    left.sourceBytes - right.sourceBytes || chapterKey(left).localeCompare(chapterKey(right))
  );
}

export function claimIsActive(claim, now = Date.now()) {
  return Boolean(claim && (claim.sticky === true || Date.parse(claim.expiresAt) > now));
}

export function pruneExpiredClaims(ledger, now = Date.now()) {
  const removed = [];
  for (const [key, claim] of Object.entries(ledger.claims)) {
    if (!claimIsActive(claim, now)) {
      delete ledger.claims[key];
      removed.push(key);
    }
  }
  return removed;
}

export function pruneMergedClaims(ledger, options = {}) {
  const baseRef = options.baseRef ?? DEFAULT_PEOPLE_QUEUE_BASE_REF;
  const removed = [];
  for (const key of Object.keys(ledger.claims)) {
    if (!extractionIsCurrent(splitChapterKey(key), { ref: baseRef })) continue;
    delete ledger.claims[key];
    removed.push(key);
  }
  return removed;
}

function makeClaim(target, options, now) {
  const sticky = options.sticky === true;
  return {
    lane: options.lane,
    worker: options.worker,
    status: options.status ?? 'claimed',
    sticky,
    claimedAt: options.claimedAt ?? new Date(now).toISOString(),
    updatedAt: new Date(now).toISOString(),
    expiresAt: sticky ? null : new Date(now + (options.claimHours ?? DEFAULT_CLAIM_HOURS) * 3_600_000).toISOString(),
    chapterFingerprint: target.chapterFingerprint,
    ...(options.note ? { note: options.note } : {}),
    ...(options.branchName ? { branch: options.branchName } : {}),
    ...(options.prUrl ? { prUrl: options.prUrl } : {}),
  };
}

function cursorMayAdopt(claim, options) {
  return options.lane === 'cursor-sdk' && claim.lane === 'cursor-sdk' &&
    ['resume-required', 'ready'].includes(claim.status);
}

export function reservePeopleTargetsInLedger(ledger, targets, options) {
  const now = options.now ?? Date.now();
  pruneExpiredClaims(ledger, now);
  const claimed = [];
  const blocked = [];
  for (const target of targets) {
    if (claimed.length >= options.limit) break;
    const key = chapterKey(target);
    const current = ledger.claims[key];
    if (claimIsActive(current, now)) {
      if (current.lane === options.lane && current.worker === options.worker) {
        claimed.push({ ...target, claim: current, reused: true });
      } else if (cursorMayAdopt(current, options)) {
        current.worker = options.worker;
        current.updatedAt = new Date(now).toISOString();
        claimed.push({ ...target, claim: current, reused: true });
      } else {
        blocked.push({ ...target, claim: current });
      }
      continue;
    }
    const claim = makeClaim(target, options, now);
    ledger.claims[key] = claim;
    claimed.push({ ...target, claim, reused: false });
  }
  return { claimed, blocked };
}

export function claimRemotePeopleTargets(targets, options) {
  if (!options?.lane || !options?.worker) throw new Error('A lane and worker are required to claim chapters');
  const prepared = targets.map((target) => ({
    ...target,
    chapterFingerprint: target.chapterFingerprint ?? chapterFingerprintFromData(readJson(
      chapterPath(target.book, target.chapter),
    )),
  }));
  return mutateRemotePeopleWorkLedger((ledger) => {
    pruneMergedClaims(ledger, options);
    return reservePeopleTargetsInLedger(ledger, prepared, {
      ...options,
      limit: options.limit ?? prepared.length,
    });
  }, {
    ...options,
    message: options.message ?? `Claim ${options.lane} people chapter work`,
  });
}

function hasRecoverableConversation(record) {
  return Boolean(record?.agentId && !record.resumeExhausted && RECOVERABLE_STATUSES.has(record.status));
}

export function localCursorRecoveryTargets() {
  const stateFile = path.join(PEOPLE_DIR, 'generated', 'extraction-state.json');
  if (!fs.existsSync(stateFile)) return [];
  const state = readJson(stateFile);
  const targets = [];
  for (const [key, chapterState] of Object.entries(state.chapters ?? {})) {
    if (chapterState.status === 'accepted') continue;
    const chunks = Object.values(chapterState.chunks ?? {});
    const hasArchive = chunks.some((chunk) => chunk.status === 'accepted') || (() => {
      const { book, chapter } = splitChapterKey(key);
      const directory = path.join(PEOPLE_DIR, 'generated', 'chunk-extractions', book, chapter);
      return fs.existsSync(directory) && fs.readdirSync(directory).some((file) => file.endsWith('.json'));
    })();
    const recoverable = hasRecoverableConversation(chapterState) || chunks.some(hasRecoverableConversation);
    if (!recoverable && !hasArchive && !chapterState.chunkPlan?.length) continue;
    const target = splitChapterKey(key);
    if (!fs.existsSync(chapterPath(target.book, target.chapter))) continue;
    targets.push({
      ...target,
      chapterFingerprint: chapterState.chapterFingerprint ?? chapterFingerprintFromData(
        readJson(chapterPath(target.book, target.chapter)),
      ),
      note: `Local Cursor recovery state: ${chunks.filter((chunk) => chunk.status === 'accepted').length}/${chunks.length} accepted chunks`,
    });
  }
  return targets.sort((left, right) => chapterKey(left).localeCompare(chapterKey(right)));
}

export function localUnpublishedExtractionTargets() {
  const targets = [];
  const root = path.join(PEOPLE_DIR, 'extractions');
  if (!fs.existsSync(root)) return targets;
  const dirtyPaths = new Set(
    git(['status', '--porcelain', '--', path.relative(REPO_ROOT, root)]).stdout
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => line.slice(3)),
  );
  for (const bookEntry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!bookEntry.isDirectory()) continue;
    const directory = path.join(root, bookEntry.name);
    for (const file of fs.readdirSync(directory).filter((name) => /^\d{3}\.json$/u.test(name))) {
      const chapter = file.slice(0, 3);
      const target = { book: bookEntry.name, chapter };
      const output = extractionPath(target.book, target.chapter);
      if (!dirtyPaths.has(path.relative(REPO_ROOT, output)) || !extractionIsCurrent(target)) continue;
      targets.push({
        ...target,
        chapterFingerprint: readJson(output).input.chapterFingerprint,
        note: 'Validated extraction exists locally but is not yet on the base branch',
      });
    }
  }
  return targets.sort((left, right) => chapterKey(left).localeCompare(chapterKey(right)));
}

export function completedForeignClaimOwnsLocalReadyOutput(item, claim, now = Date.now()) {
  return item.status === 'ready' &&
    claimIsActive(claim, now) &&
    claim.lane !== 'cursor-sdk' &&
    ['ready', 'submitted'].includes(claim.status);
}

export function syncLocalCursorReservations(options = {}) {
  const worker = options.worker ?? `${os.hostname()}-cursor-recovery`;
  const recovery = localCursorRecoveryTargets();
  const ready = localUnpublishedExtractionTargets();
  const desired = new Map([
    ...recovery.map((target) => [chapterKey(target), { target, status: 'resume-required' }]),
    ...ready.map((target) => [chapterKey(target), { target, status: 'ready' }]),
  ]);
  return mutateRemotePeopleWorkLedger((ledger) => {
    const merged = pruneMergedClaims(ledger, options);
    const conflicts = [];
    const synchronizedRecovery = [];
    const synchronizedReady = [];
    const reservedElsewhere = [];
    for (const [key, item] of desired) {
      const current = ledger.claims[key];
      if (completedForeignClaimOwnsLocalReadyOutput(item, current)) {
        reservedElsewhere.push({ chapter: key, claim: current });
        continue;
      }
      const ownedByAnotherActiveWorker = claimIsActive(current) && (
        current.lane !== 'cursor-sdk' ||
        (
          current.worker !== worker &&
          !['resume-required', 'ready'].includes(current.status)
        )
      );
      if (ownedByAnotherActiveWorker) {
        conflicts.push({ chapter: key, claim: current });
        continue;
      }
      ledger.claims[key] = makeClaim(item.target, {
        lane: 'cursor-sdk',
        worker,
        status: item.status,
        sticky: true,
        claimedAt: current?.claimedAt,
        note: item.target.note,
      }, Date.now());
      if (item.status === 'ready') synchronizedReady.push(item.target);
      else synchronizedRecovery.push(item.target);
    }
    if (conflicts.length) {
      throw new Error(`Local Cursor recovery conflicts with remote claims: ${conflicts.map((item) => item.chapter).join(', ')}`);
    }
    return {
      recovery: synchronizedRecovery,
      ready: synchronizedReady,
      reservedElsewhere,
      merged,
    };
  }, {
    ...options,
    message: 'Sync local Cursor people recovery reservations',
  });
}

export function markRemotePeopleClaims(targets, status, options) {
  if (!options?.lane || !options?.worker) throw new Error('A lane and worker are required to update claims');
  return mutateRemotePeopleWorkLedger((ledger) => {
    const updated = [];
    for (const target of targets) {
      const key = chapterKey(target);
      const claim = ledger.claims[key];
      if (!claim || claim.lane !== options.lane || claim.worker !== options.worker) {
        throw new Error(`Cannot mark unowned claim ${key} as ${status}`);
      }
      ledger.claims[key] = makeClaim({ ...target, chapterFingerprint: claim.chapterFingerprint }, {
        lane: claim.lane,
        worker: options.worker,
        status,
        sticky: ['resume-required', 'ready', 'submitted', 'failed'].includes(status),
        claimedAt: claim.claimedAt,
        claimHours: options.claimHours,
        note: options.note ?? claim.note,
        branchName: options.branchName ?? claim.branch,
        prUrl: options.prUrl ?? claim.prUrl,
      }, Date.now());
      updated.push(key);
    }
    return { updated };
  }, {
    ...options,
    message: `Mark people work ${status}`,
  });
}

export function releaseRemotePeopleClaims(targets, options) {
  return mutateRemotePeopleWorkLedger((ledger) => {
    const released = [];
    for (const target of targets) {
      const key = chapterKey(target);
      const claim = ledger.claims[key];
      if (!claim) continue;
      if (!options.force && (claim.lane !== options.lane || claim.worker !== options.worker)) {
        throw new Error(`Cannot release claim owned by ${claim.lane}/${claim.worker}: ${key}`);
      }
      delete ledger.claims[key];
      released.push(key);
    }
    return { released };
  }, {
    ...options,
    message: 'Release people work claims',
  });
}
