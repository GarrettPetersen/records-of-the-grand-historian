#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  extractionPath,
  readJson,
  writeJsonAtomic,
  writeTextAtomic,
} from './lib/people-content.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const REVIEW_FILE = path.join(PEOPLE_DIR, 'generated', 'alias-callback-review.json');
const DEBT_FILE = path.join(PEOPLE_DIR, 'generated', 'alias-disposition-debt.json');
const DISPOSITION_REASONS = new Set([
  'place', 'office', 'organization', 'title', 'book-title', 'collective', 'deity',
  'reign-period', 'polity', 'ambiguous', 'duplicate-candidate', 'other',
]);
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage:
  node scripts/apply-people-alias-decisions.mjs --decisions PATH [--apply]
  node scripts/apply-people-alias-decisions.mjs --self-test

Without --apply, validates the complete decision file and reports the prospective
changes. Every listed chapter must decide every current review item.`);
}

function options(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      decisions: { type: 'string' },
      apply: { type: 'boolean', default: false },
      'self-test': { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
    strict: true,
    allowPositionals: false,
  });
  if (values.help) {
    usage();
    process.exit(0);
  }
  if (values['self-test']) return { selfTest: true };
  if (!values.decisions) throw new Error('--decisions is required');
  return {
    selfTest: false,
    apply: values.apply,
    decisions: path.resolve(REPO_ROOT, values.decisions),
  };
}

function shortId(value, book, chapter) {
  const prefix = `${book}:${chapter}:`;
  if (!value.startsWith(prefix)) throw new Error(`${value} is outside ${book}/${chapter}`);
  return value.slice(prefix.length);
}

function removeCandidate(compact, candidate) {
  compact.candidateDispositions = compact.candidateDispositions
    .map(([disposition, reason, entries]) => [
      disposition,
      reason,
      entries.filter(([id]) => id !== candidate),
    ])
    .filter(([, , entries]) => entries.length > 0);
}

function addDisposition(compact, candidate, decision) {
  const disposition = decision.reason === 'ambiguous' ? 'ambiguous' : 'not-person';
  let group = compact.candidateDispositions.find((row) => row[0] === disposition && row[1] === decision.reason);
  if (!group) {
    group = [disposition, decision.reason, []];
    compact.candidateDispositions.push(group);
  }
  group[2].push([candidate, decision.note]);
}

function addSurface(compact, candidate, decision, book, chapter) {
  const person = shortId(decision.personId, book, chapter);
  let surface = compact.surfaces.find((row) => (
    row[0] === person && row[1] === decision.kind && row[2] === candidate.language && row[3] === candidate.exact
  ));
  if (!surface) {
    surface = [person, decision.kind, candidate.language, candidate.exact, []];
    compact.surfaces.push(surface);
  }
  let unit = surface[4].find(([unitId]) => unitId === candidate.unit);
  if (!unit) {
    unit = [candidate.unit, []];
    surface[4].push(unit);
  }
  if (unit[1].includes(candidate.occurrence)) {
    throw new Error(`${candidate.id} is already present in the selected surface`);
  }
  unit[1].push(candidate.occurrence);
  unit[1].sort((left, right) => left - right);
}

function validateEnvelope(document) {
  if (document.schemaVersion !== 1 || !Array.isArray(document.chapters) || document.chapters.length === 0) {
    throw new Error('Decision document must have schemaVersion 1 and a nonempty chapters array');
  }
}

function prepareChapter(review, submitted, matcher) {
  if (submitted.book !== review.book || submitted.chapter !== review.chapter) {
    throw new Error(`Decision scope does not match ${review.book}/${review.chapter}`);
  }
  if (submitted.chapterFingerprint !== review.chapterFingerprint) {
    throw new Error(`${review.book}/${review.chapter} decision fingerprint is stale`);
  }
  if (!Array.isArray(submitted.decisions)) throw new Error(`${review.book}/${review.chapter} has no decisions array`);
  const expected = new Map(review.reviewItems.map((item) => [item.candidate, item]));
  const decisions = new Map();
  for (const decision of submitted.decisions) {
    if (!expected.has(decision.candidate)) throw new Error(`${review.book}/${review.chapter} has unknown decision ${decision.candidate}`);
    if (decisions.has(decision.candidate)) throw new Error(`${review.book}/${review.chapter} repeats ${decision.candidate}`);
    if (decision.action === 'link') {
      const item = expected.get(decision.candidate);
      const option = item.options.find((candidate) => candidate.personId === decision.personId);
      if (!option) throw new Error(`${decision.candidate} links to an unavailable person option`);
      if (!option.kinds.includes(decision.kind)) throw new Error(`${decision.candidate} uses an unavailable mention kind`);
    } else if (decision.action === 'dispose') {
      if (!DISPOSITION_REASONS.has(decision.reason)) throw new Error(`${decision.candidate} has invalid disposition reason`);
      if (typeof decision.note !== 'string' || decision.note.trim().length < 12) {
        throw new Error(`${decision.candidate} needs a concise evidence-based disposition note`);
      }
    } else {
      throw new Error(`${decision.candidate} has invalid action ${JSON.stringify(decision.action)}`);
    }
    decisions.set(decision.candidate, decision);
  }
  const missing = [...expected.keys()].filter((candidate) => !decisions.has(candidate));
  if (missing.length > 0) throw new Error(`${review.book}/${review.chapter} is missing ${missing.length} decision(s)`);

  const file = extractionPath(review.book, review.chapter);
  const compact = structuredClone(readJson(file));
  if (compact.schemaVersion !== 2) throw new Error(`${review.book}/${review.chapter} is not a compact extraction`);
  const packet = buildPeopleExtractionPacket(review.book, review.chapter, { properNounMatcher: matcher });
  const candidateById = new Map(packet.preflight.candidates.map((candidate) => [candidate.id, candidate]));
  for (const [candidateId, decision] of decisions) {
    const candidate = candidateById.get(candidateId);
    if (!candidate) throw new Error(`${candidateId} is absent from the current scanner packet`);
    const shortCandidate = shortId(candidateId, review.book, review.chapter);
    removeCandidate(compact, shortCandidate);
    if (decision.action === 'link') addSurface(compact, candidate, decision, review.book, review.chapter);
    else addDisposition(compact, shortCandidate, decision);
  }
  validateCompactPeopleExtraction(compact, packet, { strictAliasDispositions: true });
  return { file, compact, decisions: decisions.size };
}

function updateGeneratedReports(resolvedKeys) {
  const debt = readJson(DEBT_FILE);
  debt.chapters = debt.chapters.filter((item) => !resolvedKeys.has(`${item.book}/${item.chapter}`));
  writeJsonAtomic(DEBT_FILE, debt);
  const review = readJson(REVIEW_FILE);
  review.chapters = review.chapters.filter((item) => !resolvedKeys.has(`${item.book}/${item.chapter}`));
  review.summary = {
    chapters: review.chapters.length,
    initial: review.chapters.reduce((sum, item) => sum + item.initial, 0),
    safelyReconciled: review.chapters.reduce((sum, item) => sum + item.safelyReconciled, 0),
    remaining: review.chapters.reduce((sum, item) => sum + item.remaining, 0),
  };
  writeJsonAtomic(REVIEW_FILE, review);
}

function selfTest() {
  const compact = {
    surfaces: [],
    candidateDispositions: [['not-person', 'not-a-name', [['cand_a', 'old']]]],
  };
  removeCandidate(compact, 'cand_a');
  if (compact.candidateDispositions.length !== 0) throw new Error('Candidate disposition was not removed');
  const candidate = { id: 'book:001:cand_a', language: 'en', exact: 'Alice', unit: 's0001', occurrence: 1 };
  addSurface(compact, candidate, {
    personId: 'book:001:p001', kind: 'personal-name',
  }, 'book', '001');
  if (compact.surfaces[0][4][0][1][0] !== 1) throw new Error('Linked surface was not added');
  addDisposition(compact, 'cand_b', { reason: 'place', note: 'This occurrence names a province.' });
  if (compact.candidateDispositions[0][1] !== 'place') throw new Error('Contextual disposition was not added');
  console.log('apply-people-alias-decisions self-test: ok');
}

function main() {
  const opts = options(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  if (!fs.existsSync(REVIEW_FILE) || !fs.existsSync(DEBT_FILE)) {
    throw new Error('Alias review reports are missing; run npm run people:validate and npm run people:aliases:reconcile -- --all');
  }
  const document = readJson(opts.decisions);
  validateEnvelope(document);
  const review = readJson(REVIEW_FILE);
  const reviewByKey = new Map(review.chapters.map((item) => [`${item.book}/${item.chapter}`, item]));
  const seen = new Set();
  const matcher = loadProperNounMatcher();
  const prepared = [];
  for (const submitted of document.chapters) {
    const key = `${submitted.book}/${submitted.chapter}`;
    if (seen.has(key)) throw new Error(`Decision document repeats ${key}`);
    seen.add(key);
    const expected = reviewByKey.get(key);
    if (!expected) throw new Error(`No current alias review packet exists for ${key}`);
    prepared.push({ key, ...prepareChapter(expected, submitted, matcher) });
  }
  if (opts.apply) {
    for (const item of prepared) writeTextAtomic(item.file, serializeCompactPeopleExtraction(item.compact));
    updateGeneratedReports(new Set(prepared.map((item) => item.key)));
  }
  console.log(
    `${opts.apply ? 'Applied' : 'Validated'} ${prepared.reduce((sum, item) => sum + item.decisions, 0)} ` +
    `alias decision(s) across ${prepared.length} chapter(s).`,
  );
}

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
