#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import {
  REPO_ROOT,
  chapterPath,
  extractionPath,
  normalizedChapterId,
  packetPath,
  readJson,
  writeTextAtomic,
  writeJsonAtomic,
} from './lib/people-content.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import {
  compactPeopleExtraction,
  expandPeopleExtraction,
  isCompactPeopleExtraction,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import {
  applyTranslationRepairs,
  reconcileExtractionAfterRepairs,
} from './lib/people-translation-repairs.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage:
  node scripts/apply-people-translation-repairs.mjs --book BOOK --chapter NNN [--extraction PATH]
  node scripts/apply-people-translation-repairs.mjs --book BOOK --chapter NNN --reconcile-current
  node scripts/apply-people-translation-repairs.mjs --self-test

This command is intended for an isolated worker workspace. It validates all
proposals before editing the chapter, applies only their exact replacements,
rebuilds the packet, and performs deterministic candidate reconciliation.
If changed text needs semantic attention, it leaves explicit validation errors
for the worker to repair before the host accepts either artifact.`);
}

function parseArgs(argv) {
  const opts = { book: null, chapter: null, extraction: null, reconcileCurrent: false, selfTest: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`);
      return value;
    };
    if (arg === '--book') opts.book = next();
    else if (arg === '--chapter') opts.chapter = normalizedChapterId(next());
    else if (arg === '--extraction') opts.extraction = path.resolve(REPO_ROOT, next());
    else if (arg === '--reconcile-current') opts.reconcileCurrent = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  return opts;
}

function selfTest() {
  const matcher = loadProperNounMatcher();
  const chapter = {
    meta: { book: 'fixture', chapter: '001', title: { zh: '', en: '' } },
    content: [{
      type: 'paragraph',
      sentences: [{
        id: 's0001',
        zh: '劉湛來。',
        translations: [{ lang: 'en', literal: 'Liu Zhan came.', idiomatic: 'Liu Zhan came.' }],
      }],
    }],
  };
  const oldPacket = buildPeopleExtractionPacket('fixture', '001', {
    chapterData: chapter,
    chapterFile: '/tmp/fixture-001.json',
    properNounMatcher: matcher,
  });
  const locator = (({ id, kind, blockIndex, collection, itemIndex }) =>
    ({ id, kind, blockIndex, collection, itemIndex }))(oldPacket.units[0]);
  const extraction = {
    schemaVersion: 1,
    book: 'fixture',
    chapter: '001',
    input: oldPacket.input,
    run: { model: 'fixture', promptVersion: 2 },
    people: [{
      localId: 'fixture:001:p001',
      preferredNameSuggestion: { en: 'Liu Zhan', zh: '劉湛' },
      historicity: 'historical',
      descriptorSuggestion: 'Named Individual',
      identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: [] },
    }],
    mentions: [{
      id: 'fixture:001:m0001',
      person: 'fixture:001:p001',
      unit: locator,
      kind: 'personal-name',
      spans: { zh: [{ exact: '劉湛', occurrence: 0 }], en: [{ exact: 'Liu Zhan', occurrence: 0 }] },
      candidateRefs: oldPacket.preflight.candidates.map((candidate) => candidate.id),
    }],
    claims: [{
      id: 'fixture:001:c0001', subject: 'fixture:001:p001', predicate: 'name',
      value: { kind: 'personal', en: 'Liu Zhan', zh: '劉湛' }, certainty: 'explicit',
      evidence: ['fixture:001:s0001'],
    }, {
      id: 'fixture:001:c0002', subject: 'fixture:001:p001', predicate: 'role',
      value: { roleId: 'named-individual' }, certainty: 'explicit', evidence: ['fixture:001:s0001'],
    }],
    translationRepairs: [{
      id: 'fixture:001:r0001', unit: locator, field: 'idiomatic', before: 'Liu Zhan came.',
      after: 'Yesterday, Liu Zhan came.', reason: 'Adds the temporal word present in the source fixture.',
      confidence: 'high', status: 'proposed',
    }],
    candidateDispositions: [],
    coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] },
  };
  validatePeopleExtraction(extraction, oldPacket);
  const applied = applyTranslationRepairs(chapter, extraction.translationRepairs);
  const revisedPacket = buildPeopleExtractionPacket('fixture', '001', {
    chapterData: applied.chapter,
    chapterFile: '/tmp/fixture-001.json',
    properNounMatcher: matcher,
  });
  const reconciled = reconcileExtractionAfterRepairs(extraction, revisedPacket);
  if (reconciled.unresolvedCandidates.length > 0) throw new Error('Fixture left unresolved candidates');
  validatePeopleExtraction(reconciled.extraction, revisedPacket);
  const compact = compactPeopleExtraction(reconciled.extraction, revisedPacket);
  const compactResult = validateCompactPeopleExtraction(compact, revisedPacket);
  if (compactResult.stats.people !== 1 || compactResult.stats.repairs !== 1) {
    throw new Error('Compact extraction round trip lost fixture data');
  }
  console.log('apply-people-translation-repairs self-test: ok');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  if (!opts.book || !opts.chapter) throw new Error('--book and --chapter are required');

  const chapterFile = chapterPath(opts.book, opts.chapter);
  const extractionFile = opts.extraction ?? extractionPath(opts.book, opts.chapter);
  if (!fs.existsSync(extractionFile)) throw new Error(`Extraction not found: ${path.relative(REPO_ROOT, extractionFile)}`);
  const chapter = readJson(chapterFile);
  const matcher = loadProperNounMatcher();
  const storedExtraction = readJson(extractionFile);
  const compactStored = isCompactPeopleExtraction(storedExtraction);
  const currentPacket = buildPeopleExtractionPacket(opts.book, opts.chapter, { properNounMatcher: matcher });
  const extraction = compactStored
    ? expandPeopleExtraction(storedExtraction, currentPacket)
    : storedExtraction;
  const statuses = new Set(extraction.translationRepairs.map((repair) => repair.status));

  if (opts.reconcileCurrent) {
    const reconciled = reconcileExtractionAfterRepairs(extraction, currentPacket);
    const result = validatePeopleExtraction(reconciled.extraction, currentPacket);
    if (reconciled.unresolvedCandidates.length > 0) {
      throw new Error(`Unresolved new candidates: ${reconciled.unresolvedCandidates.join(', ')}`);
    }
    if (compactStored) {
      const compact = compactPeopleExtraction(result.normalized, currentPacket);
      validateCompactPeopleExtraction(compact, currentPacket);
      writeTextAtomic(extractionFile, serializeCompactPeopleExtraction(compact));
    } else {
      writeJsonAtomic(extractionFile, result.normalized);
    }
    writeJsonAtomic(packetPath(opts.book, opts.chapter), currentPacket);
    console.log(
      `Reconciled current ${opts.book}/${opts.chapter}: ${result.stats.people} people, ` +
      `${result.stats.claims} claims, ${result.stats.candidates} candidates.`,
    );
    return;
  }

  if (statuses.size === 0 || (statuses.size === 1 && statuses.has('applied'))) {
    if (compactStored) validateCompactPeopleExtraction(storedExtraction, currentPacket);
    else validatePeopleExtraction(extraction, currentPacket);
    console.log(`No proposed repairs remain for ${opts.book}/${opts.chapter}.`);
    return;
  }
  if (statuses.size !== 1 || !statuses.has('proposed')) {
    throw new Error('Translation repairs must be uniformly proposed or uniformly applied');
  }

  const oldPacket = currentPacket;
  validatePeopleExtraction(extraction, oldPacket);
  const applied = applyTranslationRepairs(chapter, extraction.translationRepairs);
  const revisedPacket = buildPeopleExtractionPacket(opts.book, opts.chapter, {
    chapterData: applied.chapter,
    chapterFile,
    properNounMatcher: matcher,
  });
  const reconciled = reconcileExtractionAfterRepairs(extraction, revisedPacket);

  writeJsonAtomic(chapterFile, applied.chapter);
  if (compactStored) {
    const compact = compactPeopleExtraction(reconciled.extraction, revisedPacket);
    validateCompactPeopleExtraction(compact, revisedPacket);
    writeTextAtomic(extractionFile, serializeCompactPeopleExtraction(compact));
  } else {
    writeJsonAtomic(extractionFile, reconciled.extraction);
  }
  writeJsonAtomic(packetPath(opts.book, opts.chapter), revisedPacket);

  try {
    const result = validatePeopleExtraction(reconciled.extraction, revisedPacket);
    console.log(
      `Applied ${extraction.translationRepairs.length} repair(s) to ${opts.book}/${opts.chapter}; ` +
      `${result.stats.people} people and ${result.stats.candidates} candidates remain valid.`,
    );
  } catch (error) {
    const unresolved = reconciled.unresolvedCandidates.length > 0
      ? `\nUnresolved new candidates: ${reconciled.unresolvedCandidates.join(', ')}`
      : '';
    throw new Error(`${error.message}${unresolved}\nRepair the changed units in the extraction and rerun validation.`);
  }
}

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
