#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleGlossaryProgress } from '../generate-progress.js';
import {
  campaignIdentityProgress,
  campaignProgress,
  campaignTargets,
  selectResolutionChapters,
} from './plan-people-campaign.mjs';
import { PEOPLE_DIR, REPO_ROOT } from './lib/people-content.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

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
    phase: null,
    limit: null,
    prepareDossiers: false,
    dryRun: false,
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
    else if (arg === '--phase') opts.phase = next();
    else if (arg === '--limit') {
      opts.limit = Number.parseInt(next(), 10);
      if (!Number.isInteger(opts.limit) || opts.limit < 1) throw new Error('--limit must be a positive integer');
    }
    else if (arg === '--prepare-dossiers') opts.prepareDossiers = true;
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (!opts.selfTest && !['recovery', 'extraction', 'editorial', 'resolution'].includes(opts.phase)) {
    throw new Error('--phase must be recovery, extraction, editorial, or resolution');
  }
  if (!opts.selfTest && !opts.deadline) {
    throw new Error('--deadline is required (or set PEOPLE_CAMPAIGN_DEADLINE)');
  }
  if (!opts.selfTest && opts.prepareDossiers && opts.phase !== 'resolution') {
    throw new Error('--prepare-dossiers is only valid with --phase resolution');
  }
  return opts;
}

function currentPlan(opts) {
  const manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'data', 'manifest.json'), 'utf8'));
  const corpusProgress = buildPeopleGlossaryProgress(manifest);
  const progress = corpusProgress.summary;
  const completion = campaignProgress(corpusProgress);
  const identity = campaignIdentityProgress(corpusProgress);
  const extractionTargets = campaignTargets({
    missingChapters: completion.extractionDebt,
    asOf: opts.asOf,
    deadline: opts.deadline,
    capacityStart: opts.capacityStart ?? opts.asOf,
    wavesPerDay: 3,
    bufferPercent: 15,
  });
  const editorialTargets = campaignTargets({
    missingChapters: completion.editorialDebt,
    asOf: opts.asOf,
    deadline: opts.deadline,
    capacityStart: opts.capacityStart ?? opts.asOf,
    wavesPerDay: 3,
    bufferPercent: 15,
  });
  const resolutionTargets = campaignTargets({
    missingChapters: identity.resolutionDebt,
    asOf: opts.asOf,
    deadline: opts.deadline,
    capacityStart: opts.capacityStart ?? opts.asOf,
    wavesPerDay: 3,
    bufferPercent: 15,
  });
  const resolutionSelection = selectResolutionChapters(
    identity.pendingResolutionChapters,
    Math.min(opts.limit ?? resolutionTargets.chaptersPerWave, identity.pendingResolutionChapters.length),
  );
  const resolutionScopes = resolutionSelection.map(({ chapterId }) => chapterId.replace(':', '/'));
  const resolutionBatchName = resolutionScopes.length > 0
    ? `deadline-resolution-${crypto.createHash('sha256').update(resolutionScopes.join(',')).digest('hex').slice(0, 16)}`
    : null;
  const resolutionOutput = resolutionBatchName
    ? path.join(PEOPLE_DIR, 'resolutions', `${resolutionBatchName}.json`)
    : null;
  const resolutionDossierDir = resolutionBatchName
    ? path.join(PEOPLE_DIR, 'resolution-dossiers', resolutionBatchName)
    : null;
  return {
    ...progress,
    ...completion,
    ...identity,
    ...extractionTargets,
    extractionChaptersPerWave: extractionTargets.chaptersPerWave,
    editorialChaptersPerWave: editorialTargets.chaptersPerWave,
    editorialConcurrency: editorialTargets.editorialConcurrency,
    resolutionChaptersPerWave: resolutionTargets.chaptersPerWave,
    resolutionConcurrency: resolutionTargets.resolutionConcurrency,
    resolutionMaxRunCostDollars: resolutionTargets.resolutionMaxRunCostDollars,
    resolutionMaxRunTokens: resolutionTargets.resolutionMaxRunTokens,
    resolutionSelection,
    resolutionScopes,
    resolutionBatchName,
    resolutionOutput,
    resolutionDossierDir,
    resolutionDossierReady: Boolean(
      resolutionDossierDir && fs.existsSync(path.join(resolutionDossierDir, 'manifest.json'))
    ),
    prepareDossiers: opts.prepareDossiers,
  };
}

function rebuildPeopleCatalog() {
  console.log('Refreshing the canonical people catalog for the next campaign wave');
  const result = spawnSync(process.execPath, ['scripts/compile-people-catalog.mjs'], {
    cwd: REPO_ROOT,
    env: process.env,
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function catalogInputSignature() {
  const files = [];
  const addTree = (root) => {
    if (!fs.existsSync(root)) return;
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      const file = path.join(root, entry.name);
      if (entry.isDirectory()) addTree(file);
      else if (entry.isFile() && entry.name.endsWith('.json')) files.push(file);
    }
  };
  addTree(path.join(PEOPLE_DIR, 'extractions'));
  addTree(path.join(PEOPLE_DIR, 'resolutions'));
  addTree(path.join(PEOPLE_DIR, 'curation'));
  files.push(path.join(PEOPLE_DIR, 'config.json'), path.join(REPO_ROOT, 'data', 'manifest.json'));
  for (const entry of fs.readdirSync(path.join(REPO_ROOT, 'data'), { withFileTypes: true })) {
    if (!entry.isDirectory() || ['people', 'quality'].includes(entry.name)) continue;
    const directory = path.join(REPO_ROOT, 'data', entry.name);
    for (const name of fs.readdirSync(directory).filter((item) => /^\d{3}\.json$/u.test(item))) {
      files.push(path.join(directory, name));
    }
  }
  const hash = crypto.createHash('sha256');
  for (const file of files.sort()) {
    const stat = fs.statSync(file);
    hash.update(path.relative(REPO_ROOT, file));
    hash.update(`\0${stat.size}\0${stat.mtimeMs}\n`);
  }
  return hash.digest('hex');
}

export function phaseCommand(phase, plan) {
  if (phase === 'recovery') {
    return [
      'scripts/sdk-people-extract.mjs', '--all', '--recover-only',
      '--concurrency', String(plan.extractionConcurrency), '--retry-failed', '--skip-dirty',
    ];
  }
  if (phase === 'extraction') {
    return [
      'scripts/sdk-people-extract.mjs', '--all', '--limit', String(plan.chaptersPerWave),
      '--concurrency', String(plan.extractionConcurrency), '--order', 'deadline-balanced',
      '--max-units', String(plan.maxUnits), '--max-candidates', String(plan.maxCandidates),
      '--max-worker-kib', String(plan.maxWorkerKiB), '--max-cost', String(plan.waveCostCeilingDollars),
      '--cost-reserve', '5', '--max-run-cost', '5', '--max-run-tokens', String(plan.maxRunTokens),
      '--run-timeout-minutes', String(plan.runTimeoutMinutes), '--max-attempts', '3',
      '--retry-failed', '--skip-dirty', '--model', 'grok-4.6', '--effort', 'low',
    ];
  }
  if (phase === 'editorial') return [
    'scripts/sdk-people-editorial-review.mjs', '--all', '--limit', String(plan.editorialChaptersPerWave ?? plan.chaptersPerWave),
    '--concurrency', String(plan.editorialConcurrency), '--max-attempts', '2',
    '--max-run-cost', String(plan.editorialMaxRunCostDollars),
    '--max-run-tokens', String(plan.editorialMaxRunTokens),
    '--run-timeout-minutes', String(plan.runTimeoutMinutes),
    '--model', 'grok-4.6', '--effort', 'medium',
  ];
  if (phase === 'resolution') {
    if (!plan.resolutionBatchName || !plan.resolutionScopes?.length) {
      throw new Error('No current-prompt chapters are awaiting identity resolution');
    }
    const shards = Math.min(64, Math.max(8, Math.ceil(plan.resolutionScopes.length / 2)));
    const command = [
      'scripts/sdk-people-resolve.mjs', '--batch', plan.resolutionBatchName,
      '--chapters', plan.resolutionScopes.join(','), '--shards', String(shards),
      '--max-new-shards', String(shards), '--concurrency', String(plan.resolutionConcurrency),
      '--max-attempts', '3', '--max-run-cost', String(plan.resolutionMaxRunCostDollars),
      '--max-run-tokens', String(plan.resolutionMaxRunTokens),
      '--model', 'grok-4.6', '--effort', 'medium',
    ];
    if (plan.resolutionDossierReady || plan.prepareDossiers) {
      command.push('--dossier-dir', path.relative(REPO_ROOT, plan.resolutionDossierDir));
    }
    if (plan.prepareDossiers) command.push('--prepare-dossiers');
    return command;
  }
  throw new Error(`Unsupported deadline phase ${phase}`);
}

function selfTest() {
  const plan = campaignTargets({
    missingChapters: 3130,
    asOf: '2026-09-07',
    deadline: '2026-09-30',
    wavesPerDay: 3,
    bufferPercent: 15,
  });
  const extraction = phaseCommand('extraction', plan);
  const editorial = phaseCommand('editorial', plan);
  const recovery = phaseCommand('recovery', plan);
  const resolution = phaseCommand('resolution', {
    ...plan,
    resolutionBatchName: 'deadline-resolution-fixture',
    resolutionScopes: ['a/001', 'a/002'],
    resolutionConcurrency: 8,
    resolutionMaxRunCostDollars: 3,
    resolutionMaxRunTokens: 4_000_000,
    resolutionDossierDir: path.join(REPO_ROOT, 'data', 'people', 'resolution-dossiers', 'fixture'),
    resolutionDossierReady: true,
    prepareDossiers: false,
  });
  if (
    extraction[extraction.indexOf('--limit') + 1] !== '51' ||
    extraction[extraction.indexOf('--concurrency') + 1] !== '20' ||
    extraction[extraction.indexOf('--order') + 1] !== 'deadline-balanced' ||
    editorial[editorial.indexOf('--concurrency') + 1] !== '17' ||
    !recovery.includes('--recover-only') ||
    resolution[resolution.indexOf('--chapters') + 1] !== 'a/001,a/002' ||
    resolution[resolution.indexOf('--concurrency') + 1] !== '8' ||
    resolution[resolution.indexOf('--dossier-dir') + 1] !== 'data/people/resolution-dossiers/fixture'
  ) {
    throw new Error('Deadline wave command does not match the campaign targets');
  }
  const packageScripts = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'),
  ).scripts;
  for (const name of [
    'people:extract:deadline-recovery',
    'people:extract:deadline-wave',
    'people:editorial:deadline-wave',
    'people:resolution:deadline-prepare',
    'people:resolution:deadline-wave',
  ]) {
    if (!packageScripts[name]?.includes('--capacity-start 2026-09-13')) {
      throw new Error(`${name} does not enforce the September paid-capacity start date`);
    }
  }
  console.log('people deadline wave self-test: ok');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  const plan = currentPlan(opts);
  if (
    !opts.dryRun && opts.phase !== 'recovery' &&
    !(opts.phase === 'resolution' && opts.prepareDossiers) &&
    plan.blackoutDays > 0
  ) {
    const target = opts.phase === 'resolution'
      ? `${plan.resolutionChaptersPerWave} identity chapter scopes`
      : opts.phase === 'editorial'
        ? `${plan.editorialChaptersPerWave} editorial chapters`
        : `${plan.extractionChaptersPerWave} extraction chapters`;
    throw new Error(
      `Paid capacity is unavailable until ${plan.capacityStart}; ` +
      `the post-reset target is ${target} per wave`,
    );
  }
  const command = phaseCommand(opts.phase, plan);
  console.log(
    `People deadline ${opts.phase}: ${plan.currentChapters}/${plan.sourceChapters} current, ` +
    `${plan.reviewedChapters}/${plan.sourceChapters} editorially closed, ` +
    `${plan.identityClosedChapters}/${plan.sourceChapters} identity-clean, ` +
    `${plan.extractionChaptersPerWave} extraction, ${plan.editorialChaptersPerWave} editorial, and ` +
    `${plan.resolutionChaptersPerWave} identity chapter scopes/wave, ` +
    `extraction concurrency ${plan.extractionConcurrency}, ` +
    `editorial concurrency ${plan.editorialConcurrency}`,
  );
  if (opts.phase === 'resolution') {
    console.log(
      `Resolution selection: ${plan.resolutionScopes.length} chapter scope(s), ` +
      `${plan.actionableResolutionChapters} actionable seed chapter(s), ` +
      `${plan.peopleNeedingReview} people and ${plan.unresolvedCandidateBlocks} candidate blocks currently unresolved; ` +
      `batch ${plan.resolutionBatchName}`,
    );
    console.log(
      opts.prepareDossiers
        ? `Preparing reusable dossiers in ${path.relative(REPO_ROOT, plan.resolutionDossierDir)}`
        : plan.resolutionDossierReady
          ? `Using prepared dossiers from ${path.relative(REPO_ROOT, plan.resolutionDossierDir)}`
          : 'No prepared dossiers found; this wave will build the corpus graph locally',
    );
  }
  if (opts.dryRun) {
    console.log([process.execPath, ...command].join(' '));
    return;
  }
  const catalogInputsBefore = catalogInputSignature();
  const result = spawnSync(process.execPath, command, {
    cwd: REPO_ROOT,
    env: process.env,
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  const catalogInputsChanged = catalogInputsBefore !== catalogInputSignature();
  const resolutionOutputNeedsCatalog = opts.phase === 'resolution' &&
    plan.resolutionOutput && fs.existsSync(plan.resolutionOutput);
  if (!opts.prepareDossiers && (catalogInputsChanged || resolutionOutputNeedsCatalog)) {
    rebuildPeopleCatalog();
  } else if (!opts.prepareDossiers) {
    console.log('Campaign wave changed no catalog inputs; skipping the catalog rebuild');
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
