#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleGlossaryProgress } from '../generate-progress.js';
import { REPO_ROOT } from './lib/people-content.mjs';

const DAY_MS = 24 * 60 * 60 * 1000;
const CAMPAIGN_MAX_UNITS = 80;
const CAMPAIGN_MAX_CANDIDATES = 200;
const CAMPAIGN_MAX_WORKER_KIB = 48;
const CAMPAIGN_RUN_TIMEOUT_MINUTES = 20;
const CAMPAIGN_MAX_RUN_TOKENS = 3_000_000;
const CAMPAIGN_EDITORIAL_MAX_RUN_COST_DOLLARS = 3;
const CAMPAIGN_EDITORIAL_MAX_RUN_TOKENS = 4_000_000;
const CAMPAIGN_RESOLUTION_MAX_RUN_COST_DOLLARS = 3;
const CAMPAIGN_RESOLUTION_MAX_RUN_TOKENS = 4_000_000;
const ALIAS_DISPOSITION_DEBT_PATH = path.join(
  REPO_ROOT,
  'data',
  'people',
  'generated',
  'alias-disposition-debt.json',
);
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage:
  node scripts/plan-people-campaign.mjs --deadline YYYY-MM-DD [options]
  node scripts/plan-people-campaign.mjs --self-test

Options:
  --deadline DATE       Last campaign date, inclusive.
  --as-of DATE          Planning date (default: local current date).
  --capacity-start DATE First date paid workers can launch (default: --as-of).
  --waves-per-day N     Extraction waves per day (default: 3).
  --buffer-percent N    Completion buffer above the minimum rate (default: 15).
  --resolution-batch N  Accepted chapters per identity checkpoint (default: 50).
  --json                Emit machine-readable JSON.`);
}

function positiveInteger(value, flag, maximum = Number.MAX_SAFE_INTEGER) {
  if (!/^\d+$/u.test(value) || Number(value) < 1 || Number(value) > maximum) {
    throw new Error(`${flag} must be an integer from 1 to ${maximum}`);
  }
  return Number(value);
}

function isoDate(value, flag) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) throw new Error(`${flag} must use YYYY-MM-DD`);
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`${flag} is not a valid calendar date`);
  }
  return { value, epoch: date.getTime() };
}

function localIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseArgs(argv) {
  const opts = {
    deadline: process.env.PEOPLE_CAMPAIGN_DEADLINE ?? null,
    asOf: localIsoDate(),
    capacityStart: process.env.PEOPLE_CAMPAIGN_CAPACITY_START ?? null,
    wavesPerDay: 3,
    bufferPercent: 15,
    resolutionBatch: 50,
    json: false,
    selfTest: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`);
      return value;
    };
    if (arg === '--deadline') opts.deadline = next();
    else if (arg === '--as-of') opts.asOf = next();
    else if (arg === '--capacity-start') opts.capacityStart = next();
    else if (arg === '--waves-per-day') opts.wavesPerDay = positiveInteger(next(), arg, 24);
    else if (arg === '--buffer-percent') opts.bufferPercent = positiveInteger(next(), arg, 100);
    else if (arg === '--resolution-batch') opts.resolutionBatch = positiveInteger(next(), arg, 200);
    else if (arg === '--json') opts.json = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  return opts;
}

export function campaignTargets({
  missingChapters,
  asOf,
  deadline,
  capacityStart = asOf,
  wavesPerDay,
  bufferPercent,
}) {
  const start = isoDate(asOf, '--as-of');
  const end = isoDate(deadline, '--deadline');
  const capacity = isoDate(capacityStart, '--capacity-start');
  const calendarDays = Math.floor((end.epoch - start.epoch) / DAY_MS) + 1;
  if (calendarDays < 1) throw new Error('--deadline must not be before --as-of');
  const effectiveStartEpoch = Math.max(start.epoch, capacity.epoch);
  const capacityDays = Math.floor((end.epoch - effectiveStartEpoch) / DAY_MS) + 1;
  if (capacityDays < 1) throw new Error('--capacity-start must not be after --deadline');
  const blackoutDays = Math.max(0, Math.floor((effectiveStartEpoch - start.epoch) / DAY_MS));
  const minimumChaptersPerDay = Math.ceil(missingChapters / capacityDays);
  const bufferedChaptersPerDay = Math.ceil(minimumChaptersPerDay * (1 + bufferPercent / 100));
  const chaptersPerWave = Math.ceil(bufferedChaptersPerDay / wavesPerDay);
  return {
    calendarDays,
    capacityStart: capacity.value,
    capacityDays,
    blackoutDays,
    minimumChaptersPerDay,
    bufferedChaptersPerDay,
    chaptersPerWave,
    extractionConcurrency: Math.min(20, Math.max(12, Math.ceil(chaptersPerWave / 2.5))),
    editorialConcurrency: Math.min(18, Math.max(8, Math.ceil(chaptersPerWave / 3))),
    resolutionConcurrency: Math.min(16, Math.max(8, Math.ceil(chaptersPerWave / 5))),
    maxUnits: CAMPAIGN_MAX_UNITS,
    maxCandidates: CAMPAIGN_MAX_CANDIDATES,
    maxWorkerKiB: CAMPAIGN_MAX_WORKER_KIB,
    runTimeoutMinutes: CAMPAIGN_RUN_TIMEOUT_MINUTES,
    maxRunTokens: CAMPAIGN_MAX_RUN_TOKENS,
    editorialMaxRunCostDollars: CAMPAIGN_EDITORIAL_MAX_RUN_COST_DOLLARS,
    editorialMaxRunTokens: CAMPAIGN_EDITORIAL_MAX_RUN_TOKENS,
    resolutionMaxRunCostDollars: CAMPAIGN_RESOLUTION_MAX_RUN_COST_DOLLARS,
    resolutionMaxRunTokens: CAMPAIGN_RESOLUTION_MAX_RUN_TOKENS,
    waveCostCeilingDollars: Math.ceil(chaptersPerWave * 4.5),
  };
}

export function campaignProgress(progress, aliasDispositionDebt = new Set()) {
  const chapters = [...progress.byChapter.entries()];
  const aliasDispositionChapters = chapters.filter(([chapterId, chapter]) => (
    chapter.state === 'current' && aliasDispositionDebt.has(chapterId)
  )).length;
  const reviewedChapters = chapters.filter(([chapterId, chapter]) => (
    chapter.state === 'current' && chapter.pendingTranslationRepairs === 0 &&
    !aliasDispositionDebt.has(chapterId)
  )).length;
  const pendingEditorialChapters = chapters.filter(([chapterId, chapter]) => (
    chapter.state === 'current' && (
      chapter.pendingTranslationRepairs > 0 || aliasDispositionDebt.has(chapterId)
    )
  )).length;
  return {
    reviewedChapters,
    pendingEditorialChapters,
    aliasDispositionChapters,
    extractionDebt: progress.summary.sourceChapters - progress.summary.currentChapters,
    editorialDebt: progress.summary.sourceChapters - reviewedChapters,
  };
}

export function campaignIdentityProgress(progress, catalog = null) {
  if (!catalog) {
    const pendingResolutionChapters = [...progress.byChapter.entries()]
      .filter(([, chapter]) => chapter.state === 'current' && chapter.unresolvedPeople > 0)
      .map(([chapterId, chapter]) => ({ chapterId, unresolvedPeople: chapter.unresolvedPeople }))
      .sort((left, right) =>
        left.unresolvedPeople - right.unresolvedPeople || left.chapterId.localeCompare(right.chapterId));
    if (
      !Number.isInteger(progress.summary.identityCleanChapters) ||
      !Number.isInteger(progress.summary.peopleNeedingReview) ||
      !Number.isInteger(progress.summary.unresolvedCandidateBlocks)
    ) {
      throw new Error('People progress lacks canonical identity status; run npm run people:catalog');
    }
    return {
      identityClosedChapters: progress.summary.identityCleanChapters,
      pendingIdentityChapters: pendingResolutionChapters.length,
      resolutionDebt: progress.summary.sourceChapters - progress.summary.identityCleanChapters,
      peopleNeedingReview: progress.summary.peopleNeedingReview,
      unresolvedCandidateBlocks: progress.summary.unresolvedCandidateBlocks,
      pendingResolutionChapters,
    };
  }
  if (
    catalog.stats?.sourceChapters !== progress.summary.sourceChapters ||
    catalog.stats?.extractedChapters !== progress.summary.extractedChapters
  ) {
    throw new Error('People catalog is stale relative to extraction progress; run npm run people:catalog');
  }
  const currentChapters = new Set([...progress.byChapter.entries()]
    .filter(([, chapter]) => chapter.state === 'current')
    .map(([chapterId]) => chapterId));
  const unresolvedByChapter = new Map();
  const seenPersonChapters = new Set();
  const peopleNeedingReview = catalog.people.filter((person) => person.curation?.status === 'needs-review');
  for (const person of peopleNeedingReview) {
    for (const localId of person.localPeople) {
      const [book, chapter] = localId.split(':');
      const chapterId = `${book}:${chapter}`;
      if (!currentChapters.has(chapterId)) continue;
      const key = `${person.id}\u0000${chapterId}`;
      if (seenPersonChapters.has(key)) continue;
      seenPersonChapters.add(key);
      unresolvedByChapter.set(chapterId, (unresolvedByChapter.get(chapterId) ?? 0) + 1);
    }
  }
  const pendingResolutionChapters = [...unresolvedByChapter.entries()]
    .map(([chapterId, unresolvedPeople]) => ({ chapterId, unresolvedPeople }))
    .sort((left, right) =>
      left.unresolvedPeople - right.unresolvedPeople || left.chapterId.localeCompare(right.chapterId));
  const identityClosedChapters = currentChapters.size - pendingResolutionChapters.length;
  return {
    identityClosedChapters,
    pendingIdentityChapters: pendingResolutionChapters.length,
    resolutionDebt: progress.summary.sourceChapters - identityClosedChapters,
    peopleNeedingReview: peopleNeedingReview.length,
    unresolvedCandidateBlocks: catalog.stats.unresolvedCandidateBlocks,
    pendingResolutionChapters,
  };
}

export function selectResolutionChapters(pendingChapters, limit) {
  const pool = pendingChapters.map((item) => ({ ...item }))
    .sort((left, right) =>
      left.unresolvedPeople - right.unresolvedPeople || left.chapterId.localeCompare(right.chapterId));
  const selected = [];
  while (pool.length > 0 && selected.length < limit) {
    const tailTurn = selected.length % 4 === 3;
    const index = tailTurn ? Math.floor((pool.length - 1) * 0.75) : 0;
    selected.push(pool.splice(index, 1)[0]);
  }
  return selected;
}

function currentAliasDispositionDebt(progress) {
  if (!fs.existsSync(ALIAS_DISPOSITION_DEBT_PATH)) {
    throw new Error(
      `Missing ${path.relative(REPO_ROOT, ALIAS_DISPOSITION_DEBT_PATH)}; ` +
      'run npm run people:validate before planning a deadline wave',
    );
  }
  const report = JSON.parse(fs.readFileSync(ALIAS_DISPOSITION_DEBT_PATH, 'utf8'));
  if (report.schemaVersion !== 1 || !Array.isArray(report.chapters)) {
    throw new Error(`Invalid ${path.relative(REPO_ROOT, ALIAS_DISPOSITION_DEBT_PATH)}`);
  }
  const current = new Set();
  for (const item of report.chapters) {
    const chapterId = `${item.book}:${item.chapter}`;
    const extractionFile = path.join(REPO_ROOT, 'data', 'people', 'extractions', item.book, `${item.chapter}.json`);
    if (!fs.existsSync(extractionFile)) continue;
    const extraction = JSON.parse(fs.readFileSync(extractionFile, 'utf8'));
    if (extraction.input?.chapterFingerprint !== item.chapterFingerprint) continue;
    if (progress.byChapter.get(chapterId)?.state === 'current') current.add(chapterId);
  }
  return current;
}

function selfTest() {
  const result = campaignTargets({
    missingChapters: 3130,
    asOf: '2026-09-07',
    deadline: '2026-09-30',
    wavesPerDay: 3,
    bufferPercent: 15,
  });
  if (
    result.calendarDays !== 24 ||
    result.minimumChaptersPerDay !== 131 ||
    result.bufferedChaptersPerDay !== 151 ||
    result.chaptersPerWave !== 51 ||
    result.extractionConcurrency !== 20 ||
    result.maxUnits !== 80 ||
    result.maxCandidates !== 200 ||
    result.runTimeoutMinutes !== 20 ||
    result.editorialMaxRunCostDollars !== 3 ||
    result.editorialMaxRunTokens !== 4_000_000
  ) {
    throw new Error(`Unexpected campaign targets: ${JSON.stringify(result)}`);
  }
  const blackout = campaignTargets({
    missingChapters: 2983,
    asOf: '2026-09-08',
    deadline: '2026-09-30',
    capacityStart: '2026-09-13',
    wavesPerDay: 3,
    bufferPercent: 15,
  });
  if (
    blackout.calendarDays !== 23 ||
    blackout.capacityDays !== 18 ||
    blackout.blackoutDays !== 5 ||
    blackout.minimumChaptersPerDay !== 166 ||
    blackout.bufferedChaptersPerDay !== 191 ||
    blackout.chaptersPerWave !== 64
  ) {
    throw new Error(`Unexpected blackout targets: ${JSON.stringify(blackout)}`);
  }
  const completion = campaignProgress({
    summary: { sourceChapters: 5, currentChapters: 3 },
    byChapter: new Map([
      ['a:001', { state: 'current', pendingTranslationRepairs: 0 }],
      ['a:002', { state: 'current', pendingTranslationRepairs: 2 }],
      ['a:003', { state: 'current', pendingTranslationRepairs: 0 }],
      ['a:004', { state: 'rereview', pendingTranslationRepairs: 0 }],
      ['a:005', { state: 'missing', pendingTranslationRepairs: 0 }],
    ]),
  }, new Set(['a:001']));
  if (
    completion.reviewedChapters !== 1 ||
    completion.pendingEditorialChapters !== 2 ||
    completion.aliasDispositionChapters !== 1 ||
    completion.extractionDebt !== 2 ||
    completion.editorialDebt !== 4
  ) {
    throw new Error(`Unexpected campaign progress: ${JSON.stringify(completion)}`);
  }
  const identity = campaignIdentityProgress({
    summary: { sourceChapters: 5, extractedChapters: 4 },
    byChapter: new Map([
      ['a:001', { state: 'current' }],
      ['a:002', { state: 'current' }],
      ['a:003', { state: 'current' }],
      ['a:004', { state: 'rereview' }],
      ['a:005', { state: 'missing' }],
    ]),
  }, {
    stats: { sourceChapters: 5, extractedChapters: 4, unresolvedCandidateBlocks: 3 },
    people: [
      { id: 'p1', curation: { status: 'needs-review' }, localPeople: ['a:001:p001', 'a:002:p001'] },
      { id: 'p2', curation: { status: 'machine-reviewed' }, localPeople: ['a:003:p001'] },
    ],
  });
  if (
    identity.identityClosedChapters !== 1 ||
    identity.pendingIdentityChapters !== 2 ||
    identity.resolutionDebt !== 4 ||
    identity.peopleNeedingReview !== 1 ||
    identity.unresolvedCandidateBlocks !== 3
  ) {
    throw new Error(`Unexpected identity progress: ${JSON.stringify(identity)}`);
  }
  const selected = selectResolutionChapters([
    { chapterId: 'a:001', unresolvedPeople: 1 },
    { chapterId: 'a:002', unresolvedPeople: 2 },
    { chapterId: 'a:003', unresolvedPeople: 3 },
    { chapterId: 'a:004', unresolvedPeople: 4 },
    { chapterId: 'a:005', unresolvedPeople: 5 },
  ], 4);
  if (selected.map((item) => item.chapterId).join(',') !== 'a:001,a:002,a:003,a:004') {
    throw new Error(`Unexpected balanced resolution selection: ${JSON.stringify(selected)}`);
  }
  console.log('people campaign planner self-test: ok');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  if (!opts.deadline) throw new Error('--deadline is required (or set PEOPLE_CAMPAIGN_DEADLINE)');
  const manifestFile = path.join(REPO_ROOT, 'data', 'manifest.json');
  if (!fs.existsSync(manifestFile)) throw new Error('data/manifest.json is missing; run make manifest');
  const corpusProgress = buildPeopleGlossaryProgress(JSON.parse(fs.readFileSync(manifestFile, 'utf8')));
  const progress = corpusProgress.summary;
  const completion = campaignProgress(corpusProgress, currentAliasDispositionDebt(corpusProgress));
  const identity = campaignIdentityProgress(corpusProgress);
  const extractionTargets = campaignTargets({
    missingChapters: completion.extractionDebt,
    asOf: opts.asOf,
    deadline: opts.deadline,
    capacityStart: opts.capacityStart ?? opts.asOf,
    wavesPerDay: opts.wavesPerDay,
    bufferPercent: opts.bufferPercent,
  });
  const editorialTargets = campaignTargets({
    missingChapters: completion.editorialDebt,
    asOf: opts.asOf,
    deadline: opts.deadline,
    capacityStart: opts.capacityStart ?? opts.asOf,
    wavesPerDay: opts.wavesPerDay,
    bufferPercent: opts.bufferPercent,
  });
  const aliasReviewTargets = campaignTargets({
    missingChapters: completion.aliasDispositionChapters,
    asOf: opts.asOf,
    deadline: opts.deadline,
    capacityStart: opts.capacityStart ?? opts.asOf,
    wavesPerDay: opts.wavesPerDay,
    bufferPercent: opts.bufferPercent,
  });
  const resolutionTargets = campaignTargets({
    missingChapters: identity.resolutionDebt,
    asOf: opts.asOf,
    deadline: opts.deadline,
    capacityStart: opts.capacityStart ?? opts.asOf,
    wavesPerDay: opts.wavesPerDay,
    bufferPercent: opts.bufferPercent,
  });
  const resolutionSelection = selectResolutionChapters(
    identity.pendingResolutionChapters,
    resolutionTargets.chaptersPerWave,
  );
  const result = {
    asOf: opts.asOf,
    deadline: opts.deadline,
    ...progress,
    ...completion,
    ...identity,
    ...extractionTargets,
    extractionChaptersPerWave: extractionTargets.chaptersPerWave,
    editorialChaptersPerWave: editorialTargets.chaptersPerWave,
    editorialMinimumChaptersPerDay: editorialTargets.minimumChaptersPerDay,
    editorialBufferedChaptersPerDay: editorialTargets.bufferedChaptersPerDay,
    editorialConcurrency: editorialTargets.editorialConcurrency,
    resolutionChaptersPerWave: resolutionTargets.chaptersPerWave,
    resolutionMinimumChaptersPerDay: resolutionTargets.minimumChaptersPerDay,
    resolutionBufferedChaptersPerDay: resolutionTargets.bufferedChaptersPerDay,
    resolutionConcurrency: resolutionTargets.resolutionConcurrency,
    resolutionMaxRunCostDollars: resolutionTargets.resolutionMaxRunCostDollars,
    resolutionMaxRunTokens: resolutionTargets.resolutionMaxRunTokens,
    resolutionSelection,
    aliasReviewChaptersPerWave: aliasReviewTargets.chaptersPerWave,
    aliasReviewMinimumChaptersPerDay: aliasReviewTargets.minimumChaptersPerDay,
    aliasReviewBufferedChaptersPerDay: aliasReviewTargets.bufferedChaptersPerDay,
    wavesPerDay: opts.wavesPerDay,
    bufferPercent: opts.bufferPercent,
    resolutionBatch: opts.resolutionBatch,
  };
  if (opts.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(`People glossary deadline campaign (${opts.asOf} through ${opts.deadline})`);
  console.log(`Current pass: ${progress.currentChapters}/${progress.sourceChapters} (${progress.currentPercent.toFixed(2)}%)`);
  console.log(
    `Editorially closed: ${completion.reviewedChapters}/${progress.sourceChapters}; ` +
    `${completion.pendingEditorialChapters} current extraction(s) still need closure`,
  );
  console.log(
    `Identity-clean: ${identity.identityClosedChapters}/${progress.sourceChapters}; ` +
    `${identity.pendingIdentityChapters} current chapter(s), ${identity.peopleNeedingReview} people, and ` +
    `${identity.unresolvedCandidateBlocks} candidate blocks still need resolution`,
  );
  console.log(`Alias callback rereview: ${completion.aliasDispositionChapters} current chapter(s)`);
  console.log(`Older rereview: ${progress.rereviewChapters}; extraction/rereview debt: ${completion.extractionDebt}`);
  console.log(`Calendar dates remaining: ${extractionTargets.calendarDays}`);
  if (extractionTargets.blackoutDays > 0) {
    console.log(
      `Paid-capacity blackout: ${extractionTargets.blackoutDays} day(s); ` +
      `${extractionTargets.capacityDays} launch day(s) remain from ${extractionTargets.capacityStart}`,
    );
  }
  console.log(`Extraction minimum: ${extractionTargets.minimumChaptersPerDay} chapters/day`);
  console.log(`Extraction buffered target: ${extractionTargets.bufferedChaptersPerDay} chapters/day (${opts.bufferPercent}% buffer)`);
  console.log(`Editorial minimum: ${editorialTargets.minimumChaptersPerDay} closures/day`);
  console.log(`Editorial buffered target: ${editorialTargets.bufferedChaptersPerDay} closures/day (${opts.bufferPercent}% buffer)`);
  console.log(`Identity-resolution minimum: ${resolutionTargets.minimumChaptersPerDay} chapter scopes/day`);
  console.log(`Identity-resolution buffered target: ${resolutionTargets.bufferedChaptersPerDay} chapter scopes/day (${opts.bufferPercent}% buffer)`);
  console.log(
    `Alias-review target: ${aliasReviewTargets.bufferedChaptersPerDay} chapters/day ` +
    `in ${opts.wavesPerDay} x ${aliasReviewTargets.chaptersPerWave}-chapter context-only waves`,
  );
  console.log(
    `Cadence: ${opts.wavesPerDay} x ${extractionTargets.chaptersPerWave}-chapter extraction waves/day; ` +
    `${opts.wavesPerDay} x ${editorialTargets.chaptersPerWave}-chapter editorial waves/day; ` +
    `${opts.wavesPerDay} x ${resolutionTargets.chaptersPerWave}-chapter identity waves/day`,
  );
  console.log(
    `Initial concurrency: extraction ${extractionTargets.extractionConcurrency}, ` +
    `editorial ${editorialTargets.editorialConcurrency}, resolution ${resolutionTargets.resolutionConcurrency}`,
  );
  console.log(
    `New-work profile: ${extractionTargets.maxUnits} units, ${extractionTargets.maxCandidates} candidates, ` +
    `${extractionTargets.maxWorkerKiB} KiB packet ceiling, ${extractionTargets.runTimeoutMinutes}m remote timeout, ` +
    `${extractionTargets.maxRunTokens.toLocaleString('en-US')} token circuit breaker`,
  );
  console.log(`Per-wave raw cost ceiling: $${extractionTargets.waveCostCeilingDollars}`);
  console.log(`Identity resolution checkpoint: every ${opts.resolutionBatch} accepted chapters`);
  console.log('Recovery first: npm run people:extract -- --all --recover-only --retry-failed --skip-dirty');
  console.log('Host alias normalization: npm run people:aliases:reconcile -- --all --apply');
  console.log(
    `New wave: npm run people:extract -- --all --limit ${extractionTargets.chaptersPerWave} --order deadline-balanced ` +
    `--skip-dirty --concurrency ${extractionTargets.extractionConcurrency} --max-units ${extractionTargets.maxUnits} ` +
    `--max-candidates ${extractionTargets.maxCandidates} --max-worker-kib ${extractionTargets.maxWorkerKiB} ` +
    `--run-timeout-minutes ${extractionTargets.runTimeoutMinutes} --max-run-tokens ${extractionTargets.maxRunTokens} ` +
    `--max-attempts 3 --max-cost ${extractionTargets.waveCostCeilingDollars} --cost-reserve 5 ` +
    '--max-run-cost 5 --model grok-4.6 --effort low',
  );
  console.log(
    `Editorial wave: npm run people:editorial-review -- --all --limit ${editorialTargets.chaptersPerWave} ` +
    `--concurrency ${editorialTargets.editorialConcurrency} --max-attempts 2 ` +
    `--max-run-cost ${editorialTargets.editorialMaxRunCostDollars} ` +
    `--max-run-tokens ${editorialTargets.editorialMaxRunTokens} ` +
    `--run-timeout-minutes ${editorialTargets.runTimeoutMinutes} --model grok-4.6 --effort medium`,
  );
  console.log(
    `Identity wave: npm run people:resolution:deadline-wave -- --limit ${resolutionSelection.length} ` +
    `(start with --limit 10 after a capacity reset, then use the measured wave size)`,
  );
}

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
