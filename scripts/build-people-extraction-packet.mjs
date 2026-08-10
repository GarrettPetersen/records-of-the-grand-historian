#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  buildInputFingerprint,
  chapterPath,
  contentUnits,
  loadChapter,
  normalizedChapterId,
  packetPath,
  readJson,
  writeJsonAtomic,
} from './lib/people-content.mjs';
import {
  candidateScannerVersion,
  loadProperNounMatcher,
  scanPeopleCandidates,
} from './lib/people-candidates.mjs';
import { createPeopleSchemaValidator, formatSchemaErrors } from './lib/people-schema.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage:
  node scripts/build-people-extraction-packet.mjs --book BOOK --chapter NNN [--out PATH] [--seed-out PATH]
  node scripts/build-people-extraction-packet.mjs --self-test

Options:
  --book BOOK       Chapter book ID.
  --chapter NNN     Chapter number.
  --out PATH        Output path; defaults under data/people/generated/packets/.
  --seed-out PATH   Also write an empty extraction envelope for a worker.
  --model MODEL     Model recorded in the seed (required with --seed-out).
  --summary         Print candidate detector counts.
  --self-test       Run deterministic packet-builder tests.`);
}

function parseArgs(argv) {
  const opts = { book: null, chapter: null, out: null, seedOut: null, model: null, summary: false, selfTest: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`);
      return value;
    };
    if (arg === '--book') opts.book = next();
    else if (arg === '--chapter') opts.chapter = normalizedChapterId(next());
    else if (arg === '--out') opts.out = path.resolve(REPO_ROOT, next());
    else if (arg === '--seed-out') opts.seedOut = path.resolve(REPO_ROOT, next());
    else if (arg === '--model') opts.model = next();
    else if (arg === '--summary') opts.summary = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  return opts;
}

function relevantChronology(units) {
  const polities = readJson(path.join(PEOPLE_DIR, 'chronology', 'polities.json')).polities;
  const allReigns = readJson(path.join(PEOPLE_DIR, 'chronology', 'reigns.json')).reigns;
  const textZh = units.map((unit) => unit.zh).join('\n');
  const textEn = units.map((unit) => unit.en).join('\n').toLocaleLowerCase('en');
  const reigns = allReigns.filter((reign) =>
    textZh.includes(reign.name.zh) || textEn.includes(reign.name.en.toLocaleLowerCase('en'))
  );
  const relevantPolityIds = new Set(reigns.map((reign) => reign.polityId));
  return {
    polities: relevantPolityIds.size > 0
      ? polities.filter((polity) => relevantPolityIds.has(polity.id))
      : polities,
    reigns,
  };
}

export function buildPeopleExtractionPacket(book, chapter, options = {}) {
  const chapterId = normalizedChapterId(chapter);
  const loaded = options.chapterData
    ? { file: options.chapterFile ?? chapterPath(book, chapterId), chapter: options.chapterData }
    : loadChapter(book, chapterId);
  if (loaded.chapter.meta?.book && loaded.chapter.meta.book !== book) {
    throw new Error(`Chapter metadata book mismatch: expected ${book}, found ${loaded.chapter.meta.book}`);
  }
  if (normalizedChapterId(loaded.chapter.meta?.chapter) !== chapterId) {
    throw new Error(`Chapter metadata number mismatch: expected ${chapterId}, found ${loaded.chapter.meta?.chapter}`);
  }

  const units = contentUnits(loaded.chapter).map((unit, order) => ({ ...unit, order }));
  const input = buildInputFingerprint(units);
  const candidates = scanPeopleCandidates({
    book,
    chapter: chapterId,
    units,
    properNounMatcher: options.properNounMatcher,
  });
  const chronology = relevantChronology(units);
  const config = readJson(path.join(PEOPLE_DIR, 'config.json'));
  const roles = readJson(path.join(PEOPLE_DIR, 'curation', 'role-vocabulary.json')).roles;

  const packet = {
    schemaVersion: config.packetSchemaVersion,
    book,
    chapter: chapterId,
    source: {
      path: path.relative(REPO_ROOT, loaded.file),
      title: {
        zh: String(loaded.chapter.meta?.title?.zh ?? ''),
        en: String(loaded.chapter.meta?.title?.en ?? ''),
      },
    },
    input,
    units: units.map(({ source: _source, order: _order, ...unit }) => unit),
    preflight: {
      scannerVersion: candidateScannerVersion(),
      candidates,
    },
    context: {
      westernEraStyle: config.westernEraStyle,
      roles,
      polities: chronology.polities,
      reigns: chronology.reigns,
    },
  };

  const ajv = createPeopleSchemaValidator();
  const validate = ajv.getSchema('https://24histories.com/schema/people/extraction-packet-v1.json');
  if (!validate(packet)) {
    throw new Error(`Generated packet failed schema validation:\n${formatSchemaErrors(validate.errors).join('\n')}`);
  }
  return packet;
}

export function buildPeopleExtractionSeed(packet, model) {
  if (!model?.trim()) throw new Error('A model ID is required to build an extraction seed');
  const config = readJson(path.join(PEOPLE_DIR, 'config.json'));
  return {
    schemaVersion: config.extractionSchemaVersion,
    book: packet.book,
    chapter: packet.chapter,
    input: packet.input,
    run: {
      model,
      promptVersion: config.promptVersion,
      agentId: null,
      runId: null,
      completedAt: null,
    },
    people: [],
    mentions: [],
    claims: [],
    translationRepairs: [],
    candidateDispositions: [],
    coverage: {
      allUnitsVisited: true,
      preflightCandidatesAccountedFor: true,
      unresolvedReferences: [],
    },
  };
}

function detectorSummary(packet) {
  const counts = new Map();
  for (const candidate of packet.preflight.candidates) {
    for (const detector of candidate.detectors) {
      counts.set(detector.kind, (counts.get(detector.kind) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((left, right) => left[0].localeCompare(right[0]));
}

function selfTest() {
  const units = [{ id: 's0001', order: 0, zh: '劉湛，字弘仁。', en: 'Liu Zhan, courtesy name Hongren.' }];
  const matcher = loadProperNounMatcher();
  const candidates = scanPeopleCandidates({ book: 'songshu', chapter: '069', units, properNounMatcher: matcher });
  if (!candidates.some((item) => item.exact === 'Liu Zhan')) throw new Error('English name candidate missing');
  if (!candidates.some((item) => item.exact === 'Hongren')) throw new Error('Courtesy-name candidate missing');
  if (!candidates.some((item) => item.exact === '弘仁')) throw new Error('Chinese formula candidate missing');
  if (new Set(candidates.map((item) => item.id)).size !== candidates.length) throw new Error('Candidate IDs are not unique');
  console.log(`build-people-extraction-packet self-test: ok (${candidates.length} candidates)`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  if (!opts.book || !opts.chapter) throw new Error('--book and --chapter are required');
  const packet = buildPeopleExtractionPacket(opts.book, opts.chapter, {
    properNounMatcher: loadProperNounMatcher(),
  });
  const out = opts.out ?? packetPath(opts.book, opts.chapter);
  writeJsonAtomic(out, packet);
  console.log(`Wrote ${path.relative(REPO_ROOT, out)}: ${packet.units.length} units, ${packet.preflight.candidates.length} candidates`);
  if (opts.seedOut) {
    if (!opts.model) throw new Error('--model is required with --seed-out');
    writeJsonAtomic(opts.seedOut, buildPeopleExtractionSeed(packet, opts.model));
    console.log(`Wrote extraction seed ${path.relative(REPO_ROOT, opts.seedOut)}`);
  }
  if (opts.summary) {
    for (const [kind, count] of detectorSummary(packet)) console.log(`  ${kind}: ${count}`);
  }
}

if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
