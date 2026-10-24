#!/usr/bin/env node

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  chapterPath,
  extractionPath,
  normalizedChapterId,
  readJson,
  writeJsonAtomic,
} from './lib/people-content.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import {
  isCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import { editorialDecisionPath, editorialDecisionSeed, validateAppliedEditorialDecisions } from './lib/people-editorial-decisions.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage:
  node scripts/build-people-editorial-review.mjs --book BOOK --chapter NNN [--out PATH] [--context N]
    [--extraction PATH]
    [--decision-seed-out PATH]

Builds the bounded evidence dossier for an independent review of proposed
translation repairs. The default output is gitignored under
data/people/generated/editorial-review/. --decision-seed-out writes the
immutable decision scaffold for a human or Codex reviewer. --extraction reads
and validates a candidate extraction against the current chapter; it requires
an explicit --out and does not publish the candidate. Applied decision history
is checked, but other candidate extraction changes require independent review.`);
}

function parseArgs(argv) {
  const opts = { book: null, chapter: null, out: null, extraction: null, decisionSeedOut: null, context: 2 };
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
    else if (arg === '--extraction') opts.extraction = path.resolve(REPO_ROOT, next());
    else if (arg === '--decision-seed-out') opts.decisionSeedOut = path.resolve(REPO_ROOT, next());
    else if (arg === '--context') {
      const value = next();
      if (!/^\d+$/u.test(value) || Number(value) > 5) throw new Error('--context must be an integer from 0 to 5');
      opts.context = Number(value);
    } else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  return opts;
}

function reviewUnit(unit, focus) {
  return {
    id: unit.id,
    focus,
    zh: unit.zh,
    idiomatic: unit.en,
    literal: unit.literal,
  };
}

export function buildEditorialReviewDossier(book, chapter, options = {}) {
  const loaded = loadEditorialReviewChapter(book, chapter, options);
  return buildEditorialReviewDossierFromLoaded(book, loaded, options);
}

export function buildEditorialReviewDossierFromLoaded(book, loaded, options = {}) {
  const { chapterId, packet, extraction } = loaded;
  const proposals = extraction.translationRepairs.filter((repair) => repair.status === 'proposed');
  if (proposals.length === 0) throw new Error(`${book}/${chapterId} has no proposed editorial repairs`);

  const contextRadius = options.context ?? 2;
  const unitIndex = new Map(packet.units.map((unit, index) => [unit.id, index]));
  const items = proposals.map((proposal) => {
    const center = unitIndex.get(proposal.unit.id);
    if (center === undefined) throw new Error(`${proposal.id} refers to missing unit ${proposal.unit.id}`);
    const start = Math.max(0, center - contextRadius);
    const end = Math.min(packet.units.length, center + contextRadius + 1);
    const { status: _status, ...proposalContract } = proposal;
    const evidenceId = `${book}:${chapterId}:${proposal.unit.id}`;
    const relatedClaims = extraction.claims.filter((claim) => claim.evidence.includes(evidenceId));
    const relatedPeople = new Set(relatedClaims.map((claim) => claim.subject));
    return {
      proposal: proposalContract,
      context: packet.units.slice(start, end).map((unit) => reviewUnit(unit, unit.id === proposal.unit.id)),
      relatedPeople: extraction.people.filter((person) => relatedPeople.has(person.localId)),
      relatedClaims,
    };
  });

  return {
    schemaVersion: 1,
    book,
    chapter: chapterId,
    source: packet.source,
    input: {
      chapterFingerprint: packet.input.chapterFingerprint,
      extractionModel: extraction.run.model,
      extractionAgentId: extraction.run.agentId ?? null,
    },
    instructions: {
      decisions: ['accept', 'reject', 'revise'],
      independentReviewRequired: true,
      chineseControlsMeaning: true,
      preserveAccurateHumanWording: true,
      externalWitnessRequiredForSourceCorrection: true,
      retractClaimsInvalidatedByAdvancedRepairs: true,
    },
    items,
    decisionSeed: editorialDecisionSeed(extraction),
  };
}

export function loadEditorialReviewChapter(book, chapter, options = {}) {
  const chapterId = normalizedChapterId(chapter);
  const file = options.extraction ?? extractionPath(book, chapterId);
  const stored = readJson(file);
  const packet = buildPeopleExtractionPacket(book, chapterId, {
    properNounMatcher: options.properNounMatcher ?? loadProperNounMatcher(),
  });
  const result = isCompactPeopleExtraction(stored)
    ? validateCompactPeopleExtraction(stored, packet)
    : validatePeopleExtraction(stored, packet);
  const extraction = result.normalized;
  const historyFile = editorialDecisionPath(book, chapterId);
  if (fs.existsSync(historyFile)) validateAppliedEditorialDecisions(readJson(historyFile), extraction);
  return { chapterId, packet, extraction, stored };
}

function canonicalPath(file) {
  let current = path.resolve(file);
  const missing = [];
  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) throw new Error(`Cannot resolve path: ${file}`);
    missing.unshift(path.basename(current));
    current = parent;
  }
  return path.join(fs.realpathSync(current), ...missing);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.book || !opts.chapter) throw new Error('--book and --chapter are required');
  if (opts.extraction && !opts.out) throw new Error('--extraction requires an explicit --out');
  const out = opts.out ?? path.join(
    PEOPLE_DIR,
    'generated',
    'editorial-review',
    opts.book,
    `${opts.chapter}.json`,
  );
  if (opts.decisionSeedOut && canonicalPath(opts.decisionSeedOut) === canonicalPath(out)) {
    throw new Error('Dossier and decision seed must use different output paths');
  }
  const protectedInputs = new Set([
    opts.extraction,
    extractionPath(opts.book, opts.chapter),
    chapterPath(opts.book, opts.chapter),
    editorialDecisionPath(opts.book, opts.chapter),
  ].filter(Boolean).map(canonicalPath));
  if ([out, opts.decisionSeedOut].filter(Boolean).some((file) => protectedInputs.has(canonicalPath(file)))) {
    throw new Error('Review outputs must not overwrite a source or review input');
  }
  const dossier = buildEditorialReviewDossier(opts.book, opts.chapter, {
    context: opts.context,
    extraction: opts.extraction,
  });
  writeJsonAtomic(out, dossier);
  if (opts.decisionSeedOut) writeJsonAtomic(opts.decisionSeedOut, dossier.decisionSeed);
  console.log(
    `${path.relative(REPO_ROOT, out)}: ${dossier.items.length} proposal(s), ` +
    `context radius ${opts.context}` +
    (opts.decisionSeedOut ? `; decision seed ${path.relative(REPO_ROOT, opts.decisionSeedOut)}` : ''),
  );
}

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
