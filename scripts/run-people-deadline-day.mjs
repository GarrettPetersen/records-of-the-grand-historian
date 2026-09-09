#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  readJson,
  writeJsonAtomic,
} from './lib/people-content.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const STATE_FILE = path.join(PEOPLE_DIR, 'generated', 'deadline-day-state.json');
const CALIBRATION_FILE = path.join(PEOPLE_DIR, 'generated', 'deadline-calibration.json');

function localIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function usage() {
  console.log(`Usage:
  node scripts/run-people-deadline-day.mjs --deadline DATE --capacity-start DATE [options]
  node scripts/run-people-deadline-day.mjs --self-test

Options:
  --as-of DATE       Campaign date (default: local current date).
  --waves N          Extraction/editorial/resolution cycles (default: 3).
  --calibration      Run recovery plus the required 10-scope identity calibration.
  --dry-run          Print every child wave without paid calls or saved state.

Successful stages are checkpointed locally. Rerunning the command on the same day
continues at the first unfinished stage. The managed production cadence combines
each extraction/editorial pair into one canonical catalog rebuild.`);
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
    capacityStart: process.env.PEOPLE_CAMPAIGN_CAPACITY_START ?? null,
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
    else if (arg === '--capacity-start') opts.capacityStart = isoDate(next(), arg);
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
  if (!opts.selfTest && (!opts.deadline || !opts.capacityStart)) {
    throw new Error('--deadline and --capacity-start are required');
  }
  return opts;
}

export function campaignDaySteps({ waves, calibration }) {
  if (calibration) {
    return [
      { id: 'recovery', phase: 'recovery' },
      { id: 'identity-calibration', phase: 'resolution', limit: 10 },
    ];
  }
  const steps = [{ id: 'recovery', phase: 'recovery' }];
  for (let wave = 1; wave <= waves; wave += 1) {
    steps.push(
      { id: `extraction-${wave}`, phase: 'extraction', deferCatalog: true },
      { id: `editorial-${wave}`, phase: 'editorial', forceCatalog: true },
      { id: `resolution-${wave}`, phase: 'resolution' },
    );
  }
  return steps;
}

function stateKey(opts) {
  return [opts.asOf, opts.deadline, opts.capacityStart, opts.waves, opts.calibration ? 'calibration' : 'production'].join('|');
}

function loadState(opts) {
  const key = stateKey(opts);
  if (fs.existsSync(STATE_FILE)) {
    const state = readJson(STATE_FILE);
    if (state.schemaVersion === 1 && state.key === key) return state;
  }
  return {
    schemaVersion: 1,
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
  writeJsonAtomic(STATE_FILE, state);
}

function runStep(step, opts) {
  const args = [
    'scripts/run-people-deadline-wave.mjs',
    '--deadline', opts.deadline,
    '--capacity-start', opts.capacityStart,
    '--as-of', opts.asOf,
    '--phase', step.phase,
  ];
  if (step.limit) args.push('--limit', String(step.limit));
  if (step.deferCatalog) args.push('--defer-catalog');
  if (step.forceCatalog) args.push('--force-catalog');
  if (opts.dryRun) args.push('--dry-run');
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
      'recovery,extraction-1,editorial-1,resolution-1,extraction-2,editorial-2,resolution-2') {
    throw new Error(`Unexpected production cadence: ${JSON.stringify(production)}`);
  }
  if (calibration.map((step) => `${step.id}:${step.limit ?? ''}`).join(',') !==
      'recovery:,identity-calibration:10') {
    throw new Error(`Unexpected calibration cadence: ${JSON.stringify(calibration)}`);
  }
  if (!production.filter((step) => step.phase === 'extraction').every((step) => step.deferCatalog) ||
      !production.filter((step) => step.phase === 'editorial').every((step) => step.forceCatalog)) {
    throw new Error('Production cadence does not coalesce extraction and editorial catalog rebuilds');
  }
  const packageScripts = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8')).scripts;
  for (const name of ['people:deadline:calibrate', 'people:deadline:day']) {
    if (!packageScripts[name]?.includes('--capacity-start 2026-09-13')) {
      throw new Error(`${name} does not enforce the paid-capacity start date`);
    }
  }
  console.log('people deadline day self-test: ok');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  const steps = campaignDaySteps(opts);
  if (!opts.calibration && !opts.dryRun && !fs.existsSync(CALIBRATION_FILE)) {
    throw new Error('Run the post-reset identity calibration before the production day command');
  }
  const state = loadState(opts);
  const completed = new Set(state.completed);
  for (const step of steps) {
    if (completed.has(step.id)) {
      console.log(`Deadline day: ${step.id} already complete; skip`);
      continue;
    }
    const status = runStep(step, opts);
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
      schemaVersion: 1,
      completedAt: new Date().toISOString(),
      asOf: opts.asOf,
      deadline: opts.deadline,
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
