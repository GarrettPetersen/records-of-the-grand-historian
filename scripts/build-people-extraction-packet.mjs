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
  writeTextAtomic,
  writeJsonAtomic,
} from './lib/people-content.mjs';
import {
  buildCompactInput,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import {
  candidateScannerVersion,
  loadProperNounMatcher,
  scanPeopleCandidates,
} from './lib/people-candidates.mjs';
import { createPeopleSchemaValidator, formatSchemaErrors } from './lib/people-schema.mjs';
import {
  buildPeopleChunkPacket,
  createPeopleExtractionChunk,
  planPeopleExtractionChunks,
} from './lib/people-extraction-chunks.mjs';

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
  --compact-worker  Write a compact worker packet and compact v2 seed.
  --chunk-index N   Build one 1-based deterministic chunk instead of the full chapter.
  --chunk-start N   Build an explicit zero-based ownership range; requires --chunk-end.
  --chunk-end N     Exclusive end of an explicit ownership range.
  --chunk-id ID     Stable ID for an explicit range.
  --chunk-count N   Total ranges represented in the worker scope.
  --chunk-max-units N
                    Maximum owned units per chunk (default: 250).
  --chunk-max-candidates N
                    Maximum owned candidates per chunk (default: 600).
  --chunk-context-units N
                    Read-only units supplied on each side (default: 6).
  --model MODEL     Model recorded in the seed (required with --seed-out).
  --summary         Print candidate detector counts.
  --self-test       Run deterministic packet-builder tests.`);
}

function parseArgs(argv) {
  const opts = {
    book: null,
    chapter: null,
    out: null,
    seedOut: null,
    model: null,
    compactWorker: false,
    chunkIndex: null,
    chunkStart: null,
    chunkEnd: null,
    chunkId: null,
    chunkCount: null,
    chunkMaxUnits: 250,
    chunkMaxCandidates: 600,
    chunkContextUnits: 6,
    summary: false,
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
    else if (arg === '--out') opts.out = path.resolve(REPO_ROOT, next());
    else if (arg === '--seed-out') opts.seedOut = path.resolve(REPO_ROOT, next());
    else if (arg === '--model') opts.model = next();
    else if (arg === '--compact-worker') opts.compactWorker = true;
    else if (arg === '--chunk-index') opts.chunkIndex = Number(next());
    else if (arg === '--chunk-start') opts.chunkStart = Number(next());
    else if (arg === '--chunk-end') opts.chunkEnd = Number(next());
    else if (arg === '--chunk-id') opts.chunkId = next();
    else if (arg === '--chunk-count') opts.chunkCount = Number(next());
    else if (arg === '--chunk-max-units') opts.chunkMaxUnits = Number(next());
    else if (arg === '--chunk-max-candidates') opts.chunkMaxCandidates = Number(next());
    else if (arg === '--chunk-context-units') opts.chunkContextUnits = Number(next());
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
      allNamedPeopleAndMentionsCaptured: false,
      allDurableFactsCaptured: false,
      allChronologyCaptured: false,
      allPersonEventsCaptured: false,
      allClaimProvenanceCaptured: false,
      allFamilyRelationshipsCaptured: false,
      editorialPassCompleted: false,
      unresolvedReferences: [],
    },
  };
}

export function buildPeopleWorkerPacket(packet) {
  const namespace = `${packet.book}:${packet.chapter}:`;
  return {
    version: 1,
    book: packet.book,
    chapter: packet.chapter,
    title: packet.source.title,
    units: workerUnitRows(packet.units),
    candidates: packet.preflight.candidates.map((candidate) => [
      candidate.id.slice(namespace.length),
      candidate.unit,
      candidate.language,
      candidate.exact,
      candidate.occurrence,
      [...new Set(candidate.detectors.map((detector) => detector.kind))],
    ]),
    context: {
      westernEraStyle: packet.context.westernEraStyle,
      roles: packet.context.roles.map((role) => [role.id, role.label]),
      polities: packet.context.polities,
      reigns: packet.context.reigns,
    },
  };
}

function workerUnitRows(units) {
  const kindCode = {
    'paragraph-sentence': 'p',
    'table-header-cell': 'h',
    'table-body-cell': 't',
  };
  return units.map((unit) => [
    unit.id,
    kindCode[unit.kind],
    unit.zh,
    unit.en,
    unit.literal,
  ]);
}

export function buildPeopleChunkWorkerPacket(packet, chunk) {
  const ownedPacket = buildPeopleChunkPacket(packet, chunk);
  const worker = buildPeopleWorkerPacket(ownedPacket);
  return {
    ...worker,
    version: 2,
    scope: {
      chunkId: chunk.id,
      chunkIndex: chunk.index,
      chunkCount: chunk.count,
      start: chunk.start,
      end: chunk.end,
      contextStart: chunk.contextStart,
      contextEnd: chunk.contextEnd,
      maxUnits: chunk.maxUnits,
      maxCandidates: chunk.maxCandidates,
      contextUnits: chunk.contextUnits,
    },
    readOnlyContext: {
      before: workerUnitRows(packet.units.slice(chunk.contextStart, chunk.start)),
      after: workerUnitRows(packet.units.slice(chunk.end, chunk.contextEnd)),
    },
  };
}

export function buildCompactPeopleExtractionSeed(packet, model) {
  if (!model?.trim()) throw new Error('A model ID is required to build an extraction seed');
  const config = readJson(path.join(PEOPLE_DIR, 'config.json'));
  return {
    schemaVersion: 2,
    book: packet.book,
    chapter: packet.chapter,
    input: buildCompactInput(packet),
    run: {
      model,
      promptVersion: config.promptVersion,
      agentId: null,
      runId: null,
      completedAt: null,
    },
    people: [],
    surfaces: [],
    claims: [],
    translationRepairs: [],
    candidateDispositions: [],
    coverage: {
      allUnitsVisited: true,
      preflightCandidatesAccountedFor: true,
      allNamedPeopleAndMentionsCaptured: false,
      allDurableFactsCaptured: false,
      allChronologyCaptured: false,
      allPersonEventsCaptured: false,
      allClaimProvenanceCaptured: false,
      allFamilyRelationshipsCaptured: false,
      editorialPassCompleted: false,
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
  const units = [{
    id: 's0001',
    order: 0,
    zh: '劉湛，字弘仁。熊賜履至。',
    en: "Liu Zhan, courtesy name Hongren. Xiong Cilü arrived. He cited 'On Knowing Fate' and ‘Monthly Ordinances’. Ω and Γ label paths; Ω and Γ recur, while EΞ and EΞ label lines.",
  }];
  const matcher = loadProperNounMatcher();
  const candidates = scanPeopleCandidates({ book: 'songshu', chapter: '069', units, properNounMatcher: matcher });
  if (!candidates.some((item) => item.exact === 'Liu Zhan')) throw new Error('English name candidate missing');
  if (!candidates.some((item) => item.exact === 'Hongren')) throw new Error('Courtesy-name candidate missing');
  if (!candidates.some((item) => item.exact === '弘仁')) throw new Error('Chinese formula candidate missing');
  if (!candidates.some((item) => item.exact === 'Xiong Cilü')) throw new Error('Diacritic name candidate was truncated');
  if (candidates.some((item) => item.exact === 'Xiong Cil')) throw new Error('Truncated diacritic candidate survived');
  if (!candidates.some((item) => item.exact === 'Knowing Fate')) throw new Error('Quoted title candidate missing');
  if (candidates.some((item) => item.exact === "Knowing Fate'")) throw new Error('Closing quotation mark survived in candidate');
  if (!candidates.some((item) => item.exact === 'Monthly Ordinances')) throw new Error('Curly-quoted title candidate missing');
  if (candidates.some((item) => item.exact === 'Monthly Ordinances’')) throw new Error('Curly closing quotation mark survived in candidate');
  if (candidates.some((item) => /[\p{Script=Greek}]/u.test(item.exact))) throw new Error('Greek formula label survived as a person candidate');
  if (new Set(candidates.map((item) => item.id)).size !== candidates.length) throw new Error('Candidate IDs are not unique');
  console.log(`build-people-extraction-packet self-test: ok (${candidates.length} candidates)`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  if (!opts.book || !opts.chapter) throw new Error('--book and --chapter are required');
  const fullPacket = buildPeopleExtractionPacket(opts.book, opts.chapter, {
    properNounMatcher: loadProperNounMatcher(),
  });
  let packet = fullPacket;
  let chunk = null;
  const explicitChunk = opts.chunkStart !== null || opts.chunkEnd !== null;
  if (opts.chunkIndex !== null && explicitChunk) {
    throw new Error('--chunk-index cannot be combined with --chunk-start or --chunk-end');
  }
  if (explicitChunk && (opts.chunkStart === null || opts.chunkEnd === null)) {
    throw new Error('--chunk-start and --chunk-end must be supplied together');
  }
  if (!explicitChunk && (opts.chunkId !== null || opts.chunkCount !== null)) {
    throw new Error('--chunk-id and --chunk-count require --chunk-start and --chunk-end');
  }
  if (opts.chunkIndex !== null || explicitChunk) {
    for (const [flag, value] of [
      ['--chunk-max-units', opts.chunkMaxUnits],
      ['--chunk-max-candidates', opts.chunkMaxCandidates],
    ]) {
      if (!Number.isInteger(value) || value < 1) throw new Error(`${flag} must be a positive integer`);
    }
    if (!Number.isInteger(opts.chunkContextUnits) || opts.chunkContextUnits < 0) {
      throw new Error('--chunk-context-units must be a nonnegative integer');
    }
  }
  if (opts.chunkIndex !== null) {
    if (!Number.isInteger(opts.chunkIndex) || opts.chunkIndex < 1) {
      throw new Error('--chunk-index must be a positive integer');
    }
    const chunks = planPeopleExtractionChunks(fullPacket, {
      maxUnits: opts.chunkMaxUnits,
      maxCandidates: opts.chunkMaxCandidates,
      contextUnits: opts.chunkContextUnits,
    });
    chunk = chunks[opts.chunkIndex - 1];
    if (!chunk) throw new Error(`--chunk-index ${opts.chunkIndex} exceeds the ${chunks.length} planned chunks`);
    packet = buildPeopleChunkPacket(fullPacket, chunk);
  } else if (explicitChunk) {
    if (opts.chunkCount !== null && (!Number.isInteger(opts.chunkCount) || opts.chunkCount < 1)) {
      throw new Error('--chunk-count must be a positive integer');
    }
    chunk = createPeopleExtractionChunk(fullPacket, {
      id: opts.chunkId ?? `${opts.chunkStart}-${opts.chunkEnd}`,
      start: opts.chunkStart,
      end: opts.chunkEnd,
      count: opts.chunkCount ?? 1,
      maxUnits: opts.chunkMaxUnits,
      maxCandidates: opts.chunkMaxCandidates,
    }, { contextUnits: opts.chunkContextUnits });
    packet = buildPeopleChunkPacket(fullPacket, chunk);
  }
  const out = opts.out ?? packetPath(opts.book, opts.chapter);
  if (opts.compactWorker) {
    const workerPacket = chunk
      ? buildPeopleChunkWorkerPacket(fullPacket, chunk)
      : buildPeopleWorkerPacket(packet);
    writeTextAtomic(out, `${JSON.stringify(workerPacket)}\n`);
  }
  else writeJsonAtomic(out, packet);
  const chunkLabel = chunk ? ` chunk ${chunk.id}/${String(chunk.count).padStart(3, '0')}` : '';
  console.log(
    `Wrote ${path.relative(REPO_ROOT, out)}${chunkLabel}: ` +
    `${packet.units.length} owned units, ${packet.preflight.candidates.length} owned candidates`,
  );
  if (opts.seedOut) {
    if (!opts.model) throw new Error('--model is required with --seed-out');
    if (opts.compactWorker) {
      writeTextAtomic(
        opts.seedOut,
        serializeCompactPeopleExtraction(buildCompactPeopleExtractionSeed(packet, opts.model)),
      );
    } else {
      writeJsonAtomic(opts.seedOut, buildPeopleExtractionSeed(packet, opts.model));
    }
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
