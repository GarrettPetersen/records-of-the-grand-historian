#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleGlossaryProgress } from '../generate-progress.js';
import { campaignProgress, campaignTargets } from './plan-people-campaign.mjs';
import { REPO_ROOT } from './lib/people-content.mjs';

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
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (!opts.selfTest && !['recovery', 'extraction', 'editorial'].includes(opts.phase)) {
    throw new Error('--phase must be recovery, extraction, or editorial');
  }
  if (!opts.selfTest && !opts.deadline) {
    throw new Error('--deadline is required (or set PEOPLE_CAMPAIGN_DEADLINE)');
  }
  return opts;
}

function currentPlan(opts) {
  const manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'data', 'manifest.json'), 'utf8'));
  const corpusProgress = buildPeopleGlossaryProgress(manifest);
  const progress = corpusProgress.summary;
  const completion = campaignProgress(corpusProgress);
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
  return {
    ...progress,
    ...completion,
    ...extractionTargets,
    extractionChaptersPerWave: extractionTargets.chaptersPerWave,
    editorialChaptersPerWave: editorialTargets.chaptersPerWave,
    editorialConcurrency: editorialTargets.editorialConcurrency,
  };
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
  return [
    'scripts/sdk-people-editorial-review.mjs', '--all', '--limit', String(plan.editorialChaptersPerWave ?? plan.chaptersPerWave),
    '--concurrency', String(plan.editorialConcurrency), '--max-attempts', '2',
    '--max-run-cost', String(plan.editorialMaxRunCostDollars),
    '--max-run-tokens', String(plan.editorialMaxRunTokens),
    '--run-timeout-minutes', String(plan.runTimeoutMinutes),
    '--model', 'grok-4.6', '--effort', 'medium',
  ];
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
  if (
    extraction[extraction.indexOf('--limit') + 1] !== '51' ||
    extraction[extraction.indexOf('--concurrency') + 1] !== '20' ||
    extraction[extraction.indexOf('--order') + 1] !== 'deadline-balanced' ||
    editorial[editorial.indexOf('--concurrency') + 1] !== '17' ||
    !recovery.includes('--recover-only')
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
  if (!opts.dryRun && opts.phase !== 'recovery' && plan.blackoutDays > 0) {
    throw new Error(
      `Paid capacity is unavailable until ${plan.capacityStart}; ` +
      `the post-reset target is ${plan.chaptersPerWave} extraction chapters per wave`,
    );
  }
  const command = phaseCommand(opts.phase, plan);
  console.log(
    `People deadline ${opts.phase}: ${plan.currentChapters}/${plan.sourceChapters} current, ` +
    `${plan.reviewedChapters}/${plan.sourceChapters} editorially closed, ` +
    `${plan.extractionChaptersPerWave} extraction and ${plan.editorialChaptersPerWave} editorial chapters/wave, ` +
    `extraction concurrency ${plan.extractionConcurrency}, ` +
    `editorial concurrency ${plan.editorialConcurrency}`,
  );
  if (opts.dryRun) {
    console.log([process.execPath, ...command].join(' '));
    return;
  }
  const result = spawnSync(process.execPath, command, {
    cwd: REPO_ROOT,
    env: process.env,
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
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
