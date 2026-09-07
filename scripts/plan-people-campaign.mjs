#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleGlossaryProgress } from '../generate-progress.js';
import { REPO_ROOT } from './lib/people-content.mjs';

const DAY_MS = 24 * 60 * 60 * 1000;
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage:
  node scripts/plan-people-campaign.mjs --deadline YYYY-MM-DD [options]
  node scripts/plan-people-campaign.mjs --self-test

Options:
  --deadline DATE       Last campaign date, inclusive.
  --as-of DATE          Planning date (default: local current date).
  --waves-per-day N     Extraction waves per day (default: 4).
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
    wavesPerDay: 4,
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

export function campaignTargets({ missingChapters, asOf, deadline, wavesPerDay, bufferPercent }) {
  const start = isoDate(asOf, '--as-of');
  const end = isoDate(deadline, '--deadline');
  const calendarDays = Math.floor((end.epoch - start.epoch) / DAY_MS) + 1;
  if (calendarDays < 1) throw new Error('--deadline must not be before --as-of');
  const minimumChaptersPerDay = Math.ceil(missingChapters / calendarDays);
  const bufferedChaptersPerDay = Math.ceil(minimumChaptersPerDay * (1 + bufferPercent / 100));
  const chaptersPerWave = Math.ceil(bufferedChaptersPerDay / wavesPerDay);
  return {
    calendarDays,
    minimumChaptersPerDay,
    bufferedChaptersPerDay,
    chaptersPerWave,
    extractionConcurrency: Math.min(24, Math.max(12, Math.ceil(chaptersPerWave / 2))),
    editorialConcurrency: Math.min(24, Math.max(8, Math.ceil(chaptersPerWave / 3))),
  };
}

function selfTest() {
  const result = campaignTargets({
    missingChapters: 3130,
    asOf: '2026-09-07',
    deadline: '2026-09-30',
    wavesPerDay: 4,
    bufferPercent: 15,
  });
  if (
    result.calendarDays !== 24 ||
    result.minimumChaptersPerDay !== 131 ||
    result.bufferedChaptersPerDay !== 151 ||
    result.chaptersPerWave !== 38
  ) {
    throw new Error(`Unexpected campaign targets: ${JSON.stringify(result)}`);
  }
  console.log('people campaign planner self-test: ok');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  if (!opts.deadline) throw new Error('--deadline is required (or set PEOPLE_CAMPAIGN_DEADLINE)');
  const manifestFile = path.join(REPO_ROOT, 'data', 'manifest.json');
  if (!fs.existsSync(manifestFile)) throw new Error('data/manifest.json is missing; run make manifest');
  const progress = buildPeopleGlossaryProgress(JSON.parse(fs.readFileSync(manifestFile, 'utf8'))).summary;
  const targets = campaignTargets({
    missingChapters: progress.sourceChapters - progress.currentChapters,
    asOf: opts.asOf,
    deadline: opts.deadline,
    wavesPerDay: opts.wavesPerDay,
    bufferPercent: opts.bufferPercent,
  });
  const result = {
    asOf: opts.asOf,
    deadline: opts.deadline,
    ...progress,
    ...targets,
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
  console.log(`Older rereview: ${progress.rereviewChapters}; missing/current-prompt debt: ${progress.sourceChapters - progress.currentChapters}`);
  console.log(`Calendar dates remaining: ${targets.calendarDays}`);
  console.log(`Minimum: ${targets.minimumChaptersPerDay} chapters/day`);
  console.log(`Buffered target: ${targets.bufferedChaptersPerDay} chapters/day (${opts.bufferPercent}% buffer)`);
  console.log(`Cadence: ${opts.wavesPerDay} x ${targets.chaptersPerWave}-chapter waves/day`);
  console.log(`Initial concurrency: extraction ${targets.extractionConcurrency}, editorial ${targets.editorialConcurrency}`);
  console.log(`Identity resolution checkpoint: every ${opts.resolutionBatch} accepted chapters`);
}

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
