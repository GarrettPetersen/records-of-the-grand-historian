#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  readJson,
  writeJsonAtomic,
} from './lib/people-content.mjs';
import {
  readPeopleCampaignPolicy,
  rollingCampaignDeadline,
} from './lib/people-campaign-policy.mjs';
import { dateRunAcceptedChapters } from './run-people-deadline-wave.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const STATE_FILE = path.join(PEOPLE_DIR, 'generated', 'deadline-day-state.json');
const CALIBRATION_STATE_FILE = path.join(PEOPLE_DIR, 'generated', 'deadline-calibration-state.json');
const CALIBRATION_FILE = path.join(PEOPLE_DIR, 'generated', 'deadline-calibration.json');
const campaignPolicy = readPeopleCampaignPolicy();

function localIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function usage() {
  console.log(`Usage:
  node scripts/run-people-deadline-day.mjs [options]
  node scripts/run-people-deadline-day.mjs --self-test

Options:
  --deadline DATE    Override the rolling quality-planning horizon.
  --cursor-capacity-start DATE
                     Override the campaign policy's Cursor SDK reset date.
  --as-of DATE       Campaign date (default: local current date).
  --waves N          Extraction/editorial/dates/resolution cycles (default: 3).
  --calibration      Run recovery, editorial, 5 date chapters, and 10 identity scopes.
  --dry-run          Print every child wave without paid calls or saved state.

Successful stages are checkpointed locally. Rerunning the command on the same day
continues at the first unfinished stage. The managed production cadence combines
each extraction/editorial/dates cycle into one canonical catalog rebuild.

Before paid calibration, inspect the cohort with:
  npm run people:dates:run -- --all --order calibration --limit 5 --concurrency 2 --dry-run
Check genre coverage manually; size/book sampling is not a genre review.`);
}

function positiveInteger(value, flag, maximum) {
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
    throw new Error(`${flag} is not a valid date`);
  }
  return value;
}

function parseArgs(argv) {
  const opts = {
    deadline: process.env.PEOPLE_CAMPAIGN_DEADLINE ?? null,
    capacityStart: process.env.PEOPLE_CURSOR_CAPACITY_START ??
      campaignPolicy.lanes['cursor-sdk'].capacityStart,
    asOf: localIsoDate(),
    waves: 3,
    calibration: false,
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
    if (arg === '--deadline') opts.deadline = isoDate(next(), arg);
    else if (arg === '--cursor-capacity-start') opts.capacityStart = isoDate(next(), arg);
    else if (arg === '--as-of') opts.asOf = isoDate(next(), arg);
    else if (arg === '--waves') opts.waves = positiveInteger(next(), arg, 8);
    else if (arg === '--calibration') opts.calibration = true;
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  opts.deadline ??= rollingCampaignDeadline(opts.asOf, campaignPolicy.planningHorizonDays);
  return opts;
}

export function campaignDaySteps({ waves, calibration }) {
  if (calibration) {
    return [
      { id: 'recovery', phase: 'recovery' },
      { id: 'editorial-calibration', phase: 'editorial', limit: 5, deferCatalog: true },
      { id: 'date-calibration', phase: 'dates', limit: 5, order: 'calibration', forceCatalog: true },
      { id: 'identity-calibration', phase: 'resolution', limit: 10 },
    ];
  }
  const steps = [{ id: 'recovery', phase: 'recovery' }];
  for (let wave = 1; wave <= waves; wave += 1) {
    steps.push(
      { id: `extraction-${wave}`, phase: 'extraction', deferCatalog: true },
      { id: `editorial-${wave}`, phase: 'editorial', deferCatalog: true },
      { id: `dates-${wave}`, phase: 'dates', forceCatalog: true },
      { id: `resolution-${wave}`, phase: 'resolution' },
    );
  }
  return steps;
}

function stateKey(opts) {
  return [opts.asOf, opts.deadline, opts.capacityStart, opts.waves, opts.calibration ? 'calibration' : 'production'].join('|');
}

export function campaignStateFile(mode) {
  return mode === 'calibration' ? CALIBRATION_STATE_FILE : STATE_FILE;
}

export function migrateCampaignDayState(state) {
  if (![1, 2].includes(state.schemaVersion) || !Array.isArray(state.completed) ||
      !state.completed.every((id) => typeof id === 'string')) {
    throw new Error('Invalid campaign day checkpoint');
  }
  if (state.dateAcceptedChapters !== undefined && !validAcceptedDateChapters(state.dateAcceptedChapters)) {
    throw new Error('Invalid accepted date calibration chapters in checkpoint');
  }
  const steps = campaignDaySteps({ waves: state.waves, calibration: state.mode === 'calibration' });
  const completed = new Set(state.completed);
  if (state.mode === 'calibration' && !acceptedDateCohort(state.dateAcceptedChapters)) {
    completed.delete('date-calibration');
  }
  const missingDates = steps.findIndex((step) => step.phase === 'dates' && !completed.has(step.id));
  if (missingDates !== -1) {
    for (const step of steps.slice(missingDates)) {
      if (step.phase === 'resolution') completed.delete(step.id);
    }
  }
  return { ...state, schemaVersion: 2, completed: [...completed] };
}

function loadState(opts) {
  const key = stateKey(opts);
  const stateFile = campaignStateFile(opts.calibration ? 'calibration' : 'production');
  // Import an older calibration checkpoint without replacing the production file.
  for (const file of new Set([stateFile, STATE_FILE])) {
    if (fs.existsSync(file)) {
      const state = readJson(file);
      if (state.key === key) return migrateCampaignDayState(state);
    }
  }
  return {
    schemaVersion: 2,
    key,
    asOf: opts.asOf,
    deadline: opts.deadline,
    capacityStart: opts.capacityStart,
    waves: opts.waves,
    mode: opts.calibration ? 'calibration' : 'production',
    completed: [],
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function saveState(state) {
  state.updatedAt = new Date().toISOString();
  writeJsonAtomic(campaignStateFile(state.mode), state);
}

function validAcceptedDateChapters(chapters) {
  return Array.isArray(chapters) &&
    chapters.every((key) => typeof key === 'string' && /^[a-z][a-z0-9-]*\/\d{3}$/u.test(key)) &&
    new Set(chapters).size === chapters.length;
}

function acceptedDateCohort(chapters) {
  return validAcceptedDateChapters(chapters) && chapters.length >= 5;
}

export function calibrationIsCurrent(calibration, capacityStart) {
  return calibration?.schemaVersion === 2 &&
    calibration.capacityStart === capacityStart &&
    calibration.asOf >= capacityStart &&
    acceptedDateCohort(calibration.dateAcceptedChapters) &&
    calibration.dateChapters === calibration.dateAcceptedChapters.length && calibration.dateConcurrency === 2 &&
    calibration.scopes === 10;
}

export function dateCalibrationStep(step, state, summaryOut) {
  return {
    ...step,
    limit: Math.max(0, 5 - (state.dateAcceptedChapters?.length ?? 0)),
    catalogOnly: acceptedDateCohort(state.dateAcceptedChapters),
    summaryOut,
  };
}

export function recordDateCalibrationRun(state, summary, invocation) {
  const accepted = dateRunAcceptedChapters(summary);
  if (accepted.length > invocation.limit) throw new Error('Date summary exceeded the requested calibration cohort');
  return {
    ...state,
    dateAcceptedChapters: [...new Set([...(state.dateAcceptedChapters ?? []), ...accepted])],
    dateRunSummaries: [...(state.dateRunSummaries ?? []), invocation.summaryOut],
  };
}

function runStep(step, opts) {
  const args = step.catalogOnly ? ['scripts/compile-people-catalog.mjs'] : [
    'scripts/run-people-deadline-wave.mjs',
    '--deadline', opts.deadline,
    '--cursor-capacity-start', opts.capacityStart,
    '--as-of', opts.asOf,
    '--phase', step.phase,
  ];
  if (!step.catalogOnly) {
    if (step.limit) args.push('--limit', String(step.limit));
    if (step.deferCatalog) args.push('--defer-catalog');
    if (step.forceCatalog) args.push('--force-catalog');
    if (step.summaryOut) args.push('--summary-out', step.summaryOut);
    if (step.order) args.push('--order', step.order);
    if (opts.dryRun) args.push('--dry-run');
  }
  console.log(`\n=== Deadline day: ${step.id} ===`);
  const result = spawnSync(process.execPath, args, {
    cwd: REPO_ROOT,
    env: process.env,
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

function selfTest() {
  const production = campaignDaySteps({ waves: 2, calibration: false });
  const calibration = campaignDaySteps({ waves: 3, calibration: true });
  if (production.map((step) => step.id).join(',') !==
      'recovery,extraction-1,editorial-1,dates-1,resolution-1,extraction-2,editorial-2,dates-2,resolution-2') {
    throw new Error(`Unexpected production cadence: ${JSON.stringify(production)}`);
  }
  if (calibration.map((step) => `${step.id}:${step.limit ?? ''}`).join(',') !==
      'recovery:,editorial-calibration:5,date-calibration:5,identity-calibration:10') {
    throw new Error(`Unexpected calibration cadence: ${JSON.stringify(calibration)}`);
  }
  if (!production.filter((step) => step.phase === 'extraction').every((step) => step.deferCatalog) ||
      !production.filter((step) => step.phase === 'editorial').every((step) => step.deferCatalog) ||
      !production.filter((step) => step.phase === 'dates').every((step) => step.forceCatalog)) {
    throw new Error('Production cadence does not coalesce extraction, editorial, and date catalog rebuilds');
  }
  const packageScripts = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8')).scripts;
  for (const name of ['people:deadline:calibrate', 'people:deadline:day']) {
    if (packageScripts[name]?.includes('--capacity-start') ||
        packageScripts[name]?.includes('--cursor-capacity-start') ||
        packageScripts[name]?.includes('--deadline')) {
      throw new Error(`${name} bypasses the centralized people campaign policy`);
    }
  }
  if (campaignPolicy.lanes['cursor-sdk'].capacityStart !== '2026-09-24' ||
      campaignPolicy.lanes.grokbot.capacityStart !== '2026-09-13' ||
      campaignPolicy.mode !== 'quality-first') {
    throw new Error('People campaign policy does not preserve the lane calendars and quality mode');
  }
  console.log('people deadline day self-test: ok');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  const steps = campaignDaySteps(opts);
  if (!opts.calibration && !opts.dryRun &&
      !calibrationIsCurrent(fs.existsSync(CALIBRATION_FILE) ? readJson(CALIBRATION_FILE) : null, opts.capacityStart)) {
    throw new Error('Run the post-reset date and identity calibration before the production day command');
  }
  let state = loadState(opts);
  const completed = new Set(state.completed);
  for (const step of steps) {
    if (completed.has(step.id)) {
      console.log(`Deadline day: ${step.id} already complete; skip`);
      continue;
    }
    const isDateCalibration = step.id === 'date-calibration' && !opts.dryRun;
    const invocation = isDateCalibration ? dateCalibrationStep(step, state,
      path.join(PEOPLE_DIR, 'generated', 'date-calibration-runs', `${randomUUID()}.json`)) : step;
    const status = runStep(invocation, opts);
    if (isDateCalibration && !invocation.catalogOnly) {
      if (fs.existsSync(invocation.summaryOut)) {
        state = recordDateCalibrationRun(state, readJson(invocation.summaryOut), invocation);
        saveState(state);
      } else if (status === 0) {
        throw new Error('Date calibration returned no run summary; cannot certify accepted chapters');
      }
      if (status === 0 && !acceptedDateCohort(state.dateAcceptedChapters)) {
        throw new Error(`Date calibration accepted ${state.dateAcceptedChapters?.length ?? 0}/5 distinct chapters; rerun to finish the cohort`);
      }
    }
    if (status !== 0) {
      console.error(`Deadline day stopped at ${step.id}; rerun the same command to resume here`);
      process.exit(status);
    }
    if (!opts.dryRun) {
      state.completed.push(step.id);
      saveState(state);
    }
  }
  if (opts.calibration && !opts.dryRun) {
    writeJsonAtomic(CALIBRATION_FILE, {
      schemaVersion: 2,
      completedAt: new Date().toISOString(),
      asOf: opts.asOf,
      deadline: opts.deadline,
      capacityStart: opts.capacityStart,
      dateChapters: state.dateAcceptedChapters.length,
      dateAcceptedChapters: state.dateAcceptedChapters,
      dateRunSummaries: state.dateRunSummaries,
      dateConcurrency: 2,
      scopes: 10,
    });
  }
  console.log(opts.dryRun ? '\nDeadline day dry run complete' : '\nDeadline day complete');
}

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
