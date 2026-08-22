#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  extractionPath,
  normalizedChapterId,
  readJson,
  writeJsonAtomic,
} from './lib/people-content.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import {
  isCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import { editorialDecisionSeed } from './lib/people-editorial-decisions.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage:
  node scripts/build-people-editorial-review.mjs --book BOOK --chapter NNN [--out PATH] [--context N]
    [--decision-seed-out PATH]

Builds the bounded evidence dossier for an independent review of proposed
translation repairs. The default output is gitignored under
data/people/generated/editorial-review/. --decision-seed-out writes the
immutable decision scaffold for a human or Codex reviewer.`);
}

function parseArgs(argv) {
  const opts = { book: null, chapter: null, out: null, decisionSeedOut: null, context: 2 };
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
  const file = extractionPath(book, chapterId);
  const stored = readJson(file);
  const packet = buildPeopleExtractionPacket(book, chapterId, {
    properNounMatcher: options.properNounMatcher ?? loadProperNounMatcher(),
  });
  const result = isCompactPeopleExtraction(stored)
    ? validateCompactPeopleExtraction(stored, packet)
    : validatePeopleExtraction(stored, packet);
  const extraction = result.normalized;
  return { chapterId, packet, extraction, stored };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.book || !opts.chapter) throw new Error('--book and --chapter are required');
  const out = opts.out ?? path.join(
    PEOPLE_DIR,
    'generated',
    'editorial-review',
    opts.book,
    `${opts.chapter}.json`,
  );
  const dossier = buildEditorialReviewDossier(opts.book, opts.chapter, { context: opts.context });
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
