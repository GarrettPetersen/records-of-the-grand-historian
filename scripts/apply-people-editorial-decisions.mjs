#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyPeopleTranslationRepairs } from './apply-people-translation-repairs.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  readJson,
} from './lib/people-content.mjs';
import { editorialDecisionPath } from './lib/people-editorial-decisions.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage:
  node scripts/apply-people-editorial-decisions.mjs --all [--limit N] [--dry-run]
  node scripts/apply-people-editorial-decisions.mjs --book BOOK [--chapter NNN]
  node scripts/apply-people-editorial-decisions.mjs --self-test

Applies every current independent editorial decision whose extraction still has
proposed repairs. Missing decision files are left pending for a later review wave.`);
}

function positiveInteger(value, flag) {
  if (!/^\d+$/u.test(value) || Number(value) < 1) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return Number(value);
}

function parseArgs(argv) {
  const opts = {
    all: false,
    book: null,
    chapter: null,
    limit: null,
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
    if (arg === '--all') opts.all = true;
    else if (arg === '--book') opts.book = next();
    else if (arg === '--chapter') opts.chapter = next().padStart(3, '0');
    else if (arg === '--limit') opts.limit = positiveInteger(next(), arg);
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  if (!opts.selfTest && opts.all === Boolean(opts.book)) {
    throw new Error('Pass either --all or --book');
  }
  if (opts.chapter && !opts.book) throw new Error('--chapter requires --book');
  return opts;
}

export function extractionHasProposedRepairs(extraction) {
  const statusIndex = extraction.schemaVersion === 2 ? 6 : null;
  return (extraction.translationRepairs ?? []).some((repair) =>
    (statusIndex === null ? repair.status : repair[statusIndex]) === 'proposed'
  );
}

function pendingTargets(opts) {
  const root = path.join(PEOPLE_DIR, 'extractions');
  const targets = [];
  if (!fs.existsSync(root)) return targets;
  const books = opts.book ? [opts.book] : fs.readdirSync(root).sort();
  for (const book of books) {
    const directory = path.join(root, book);
    if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) continue;
    const names = opts.chapter
      ? [`${opts.chapter}.json`]
      : fs.readdirSync(directory).filter((name) => /^\d{3}\.json$/u.test(name)).sort();
    for (const name of names) {
      const file = path.join(directory, name);
      if (!fs.existsSync(file) || !extractionHasProposedRepairs(readJson(file))) continue;
      const chapter = name.slice(0, 3);
      if (!fs.existsSync(editorialDecisionPath(book, chapter))) continue;
      targets.push({ book, chapter });
      if (opts.limit && targets.length >= opts.limit) return targets;
    }
  }
  return targets;
}

export function applyEditorialDecisions(opts) {
  const targets = pendingTargets(opts);
  console.log(`Editorial application: ${targets.length} reviewed chapter(s) ready`);
  if (opts.dryRun) {
    for (const target of targets) console.log(`[dry-run ${target.book}/${target.chapter}] apply reviewed decisions`);
    return { applied: 0, failed: 0, targets: targets.length };
  }

  let applied = 0;
  const failures = [];
  for (const target of targets) {
    try {
      applyPeopleTranslationRepairs({
        book: target.book,
        chapter: target.chapter,
        extraction: null,
        decisions: null,
        reconcileCurrent: false,
        candidateDispositions: [],
        candidatePeople: [],
        selfTest: false,
      });
      applied += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${target.book}/${target.chapter}: ${message}`);
      console.error(`[${target.book}/${target.chapter}] editorial application failed: ${message}`);
    }
  }
  console.log(`Editorial application finished: applied=${applied}, failed=${failures.length}`);
  return { applied, failed: failures.length, targets: targets.length, failures };
}

function selfTest() {
  const compact = { schemaVersion: 2, translationRepairs: [[null, null, null, null, null, null, 'proposed']] };
  const expanded = { schemaVersion: 1, translationRepairs: [{ status: 'proposed' }] };
  const closed = { schemaVersion: 2, translationRepairs: [[null, null, null, null, null, null, 'applied']] };
  if (!extractionHasProposedRepairs(compact) || !extractionHasProposedRepairs(expanded) || extractionHasProposedRepairs(closed)) {
    throw new Error('Editorial repair status detection failed');
  }
  console.log('apply people editorial decisions self-test: ok');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  const result = applyEditorialDecisions(opts);
  if (result.failed > 0) process.exitCode = 2;
}

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
