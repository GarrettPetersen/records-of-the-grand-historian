#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import {
  compactPeopleExtraction,
  isCompactPeopleExtraction,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  extractionPath,
  readJson,
  writeJsonAtomic,
  writeTextAtomic,
} from './lib/people-content.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';

const DEFAULT_DEBT_FILE = path.join(PEOPLE_DIR, 'generated', 'alias-disposition-debt.json');
const DEFAULT_REPORT_FILE = path.join(PEOPLE_DIR, 'generated', 'alias-callback-review.json');
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage:
  node scripts/reconcile-people-alias-callbacks.mjs --all [--apply]
  node scripts/reconcile-people-alias-callbacks.mjs --book BOOK [--chapter NNN] [--apply]
  node scripts/reconcile-people-alias-callbacks.mjs --self-test

Safely removes not-a-name dispositions for candidates already contained by an
existing person mention. Remaining conflicts are written as small review items.
Run npm run people:validate first to refresh the debt file.`);
}

function cliOptions(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      all: { type: 'boolean', default: false },
      apply: { type: 'boolean', default: false },
      book: { type: 'string' },
      chapter: { type: 'string' },
      'debt-file': { type: 'string' },
      'report-out': { type: 'string' },
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
  if (values.all === Boolean(values.book)) throw new Error('Choose exactly one of --all or --book');
  if (values.chapter && !values.book) throw new Error('--chapter requires --book');
  if (values.book && !/^[a-z0-9-]+$/u.test(values.book)) throw new Error(`Invalid book ID: ${values.book}`);
  if (values.chapter && !/^\d{1,3}$/u.test(values.chapter)) throw new Error(`Invalid chapter: ${values.chapter}`);
  return {
    all: values.all,
    apply: values.apply,
    book: values.book ?? null,
    chapter: values.chapter?.padStart(3, '0') ?? null,
    debtFile: path.resolve(REPO_ROOT, values['debt-file'] ?? DEFAULT_DEBT_FILE),
    reportOut: path.resolve(REPO_ROOT, values['report-out'] ?? DEFAULT_REPORT_FILE),
    selfTest: false,
  };
}

function candidateIsInsideMention(candidate, mention) {
  if (mention.unit.id !== candidate.unit) return false;
  return mention.spans[candidate.language].some((span) => (
    span.startCodePoint <= candidate.startCodePoint && span.endCodePoint >= candidate.endCodePoint
  ));
}

function mentionIsInsideCandidate(candidate, mention) {
  if (mention.unit.id !== candidate.unit) return false;
  return mention.spans[candidate.language].some((span) => (
    candidate.startCodePoint <= span.startCodePoint && candidate.endCodePoint >= span.endCodePoint
  ));
}

function safelyContainedCandidateIds(normalized, packet, conflicts) {
  const candidateById = new Map(packet.preflight.candidates.map((candidate) => [candidate.id, candidate]));
  const safe = new Set();
  for (const conflict of conflicts) {
    const candidate = candidateById.get(conflict.candidate);
    if (!candidate) continue;
    const containing = normalized.mentions.filter((mention) => candidateIsInsideMention(candidate, mention));
    if (containing.length === 1) safe.add(candidate.id);
  }
  return safe;
}

function safelyWrappedCandidateIds(normalized, packet, conflicts, excluded = new Set()) {
  const candidateById = new Map(packet.preflight.candidates.map((candidate) => [candidate.id, candidate]));
  const peopleBySurface = new Map();
  for (const mention of normalized.mentions) {
    for (const language of ['zh', 'en']) {
      for (const span of mention.spans[language]) {
        const key = `${language}\0${span.exact}`;
        if (!peopleBySurface.has(key)) peopleBySurface.set(key, new Set());
        peopleBySurface.get(key).add(mention.person);
      }
    }
  }
  const safe = new Set();
  for (const conflict of conflicts) {
    if (excluded.has(conflict.candidate)) continue;
    const candidate = candidateById.get(conflict.candidate);
    if (!candidate) continue;
    const exactPeople = peopleBySurface.get(`${candidate.language}\0${candidate.exact}`) ?? new Set();
    const innerPeople = new Set(normalized.mentions
      .filter((mention) => mentionIsInsideCandidate(candidate, mention) && exactPeople.has(mention.person))
      .map((mention) => mention.person));
    if (innerPeople.size === 1) safe.add(candidate.id);
  }
  return safe;
}

function codePointContext(text, start, end, radius = 140) {
  const points = Array.from(text);
  const left = Math.max(0, start - radius);
  const right = Math.min(points.length, end + radius);
  return `${left > 0 ? '...' : ''}${points.slice(left, start).join('')}[[` +
    `${points.slice(start, end).join('')}]]${points.slice(end, right).join('')}${right < points.length ? '...' : ''}`;
}

function reviewItems(normalized, packet, conflicts) {
  const candidateById = new Map(packet.preflight.candidates.map((candidate) => [candidate.id, candidate]));
  const personById = new Map(normalized.people.map((person) => [person.localId, person]));
  const unitById = new Map(packet.units.map((unit) => [unit.id, unit]));
  const optionsBySurface = new Map();
  const kindsByPerson = new Map();
  const peopleByUnit = new Map();
  for (const mention of normalized.mentions) {
    if (!peopleByUnit.has(mention.unit.id)) peopleByUnit.set(mention.unit.id, new Set());
    peopleByUnit.get(mention.unit.id).add(mention.person);
    if (!kindsByPerson.has(mention.person)) kindsByPerson.set(mention.person, new Set());
    kindsByPerson.get(mention.person).add(mention.kind);
    for (const language of ['zh', 'en']) {
      for (const span of mention.spans[language]) {
        const key = `${language}\0${span.exact}`;
        if (!optionsBySurface.has(key)) optionsBySurface.set(key, new Map());
        const people = optionsBySurface.get(key);
        if (!people.has(mention.person)) people.set(mention.person, new Set());
        people.get(mention.person).add(mention.kind);
      }
    }
  }
  const namespace = `${packet.book}:${packet.chapter}:`;
  for (const claim of normalized.claims) {
    for (const evidence of claim.evidence) {
      if (!evidence.startsWith(namespace)) continue;
      const unit = evidence.slice(namespace.length);
      if (!unitById.has(unit)) continue;
      if (!peopleByUnit.has(unit)) peopleByUnit.set(unit, new Set());
      peopleByUnit.get(unit).add(claim.subject);
    }
  }
  return conflicts.map((conflict) => {
    const candidate = candidateById.get(conflict.candidate);
    const unit = unitById.get(candidate.unit);
    const exactOptions = optionsBySurface.get(`${candidate.language}\0${candidate.exact}`) ?? new Map();
    const ranked = new Map([...exactOptions].map(([personId, kinds]) => [personId, {
      personId,
      kinds: new Set(kinds),
      match: 'exact-surface',
    }]));
    for (const personId of peopleByUnit.get(candidate.unit) ?? []) {
      if (!ranked.has(personId)) {
        ranked.set(personId, {
          personId,
          kinds: new Set(kindsByPerson.get(personId) ?? ['personal-name']),
          match: 'unit-evidence',
        });
      }
    }
    const options = [...ranked.values()]
      .sort((left, right) => (
        Number(right.match === 'exact-surface') - Number(left.match === 'exact-surface') ||
        left.personId.localeCompare(right.personId)
      ))
      .slice(0, 12)
      .map(({ personId, kinds, match }) => {
        const person = personById.get(personId);
        return {
          personId,
          name: person.preferredNameSuggestion,
          descriptor: person.descriptorSuggestion,
          kinds: [...kinds].sort(),
          match,
        };
      });
    return {
      candidate: candidate.id,
      language: candidate.language,
      exact: candidate.exact,
      unit: candidate.unit,
      context: codePointContext(
        unit[candidate.language],
        candidate.startCodePoint,
        candidate.endCodePoint,
      ),
      options,
    };
  });
}

function validateExtraction(raw, packet) {
  return isCompactPeopleExtraction(raw)
    ? validateCompactPeopleExtraction(raw, packet)
    : validatePeopleExtraction(raw, packet);
}

function reconcileSafeDispositions(raw, normalized, packet, contained, wrapped) {
  const safe = new Set([...contained, ...wrapped]);
  if (!isCompactPeopleExtraction(raw)) {
    const reconciled = structuredClone(normalized);
    reconciled.candidateDispositions = reconciled.candidateDispositions.filter((entry) => !safe.has(entry.candidate));
    for (const candidate of wrapped) {
      reconciled.candidateDispositions.push({
        candidate,
        disposition: 'duplicate-hint',
        reason: 'duplicate-candidate',
        note: 'Detector span wraps an existing link to the same person.',
      });
    }
    return compactPeopleExtraction(reconciled, packet);
  }
  const namespace = `${packet.book}:${packet.chapter}:`;
  const shortSafe = new Set([...safe].map((candidate) => candidate.slice(namespace.length)));
  const compact = structuredClone(raw);
  compact.candidateDispositions = compact.candidateDispositions
    .map(([disposition, reason, entries]) => [
      disposition,
      reason,
      entries.filter(([candidate]) => !shortSafe.has(candidate)),
    ])
    .filter(([, , entries]) => entries.length > 0);
  if (wrapped.size > 0) {
    let group = compact.candidateDispositions.find((row) => (
      row[0] === 'duplicate-hint' && row[1] === 'duplicate-candidate'
    ));
    if (!group) {
      group = ['duplicate-hint', 'duplicate-candidate', []];
      compact.candidateDispositions.push(group);
    }
    group[2].push(...[...wrapped].map((candidate) => [
      candidate.slice(namespace.length),
      'Detector span wraps an existing link to the same person.',
    ]));
  }
  return compact;
}

function processChapter(item, opts, matcher) {
  const file = extractionPath(item.book, item.chapter);
  if (!fs.existsSync(file)) throw new Error(`Missing ${path.relative(REPO_ROOT, file)}`);
  const raw = readJson(file);
  if (raw.input?.chapterFingerprint !== item.chapterFingerprint) {
    throw new Error(`${item.book}/${item.chapter} debt entry is stale; run npm run people:validate`);
  }
  const packet = buildPeopleExtractionPacket(item.book, item.chapter, { properNounMatcher: matcher });
  const initial = validateExtraction(raw, packet);
  const contained = safelyContainedCandidateIds(initial.normalized, packet, initial.audit.aliasDispositionConflicts);
  const wrapped = safelyWrappedCandidateIds(
    initial.normalized,
    packet,
    initial.audit.aliasDispositionConflicts,
    contained,
  );
  const safeCount = contained.size + wrapped.size;
  const compact = reconcileSafeDispositions(raw, initial.normalized, packet, contained, wrapped);
  const checked = validateCompactPeopleExtraction(compact, packet);
  const remaining = checked.audit.aliasDispositionConflicts;
  if (initial.audit.aliasDispositionConflicts.length - remaining.length !== safeCount) {
    throw new Error(`${item.book}/${item.chapter} safe reconciliation count was not conserved`);
  }
  if (opts.apply && safeCount > 0) writeTextAtomic(file, serializeCompactPeopleExtraction(compact));
  return {
    book: item.book,
    chapter: item.chapter,
    chapterFingerprint: item.chapterFingerprint,
    initial: initial.audit.aliasDispositionConflicts.length,
    safelyContained: contained.size,
    safelyReclassified: wrapped.size,
    safelyReconciled: safeCount,
    remaining: remaining.length,
    reviewItems: reviewItems(checked.normalized, packet, remaining),
  };
}

function selfTest() {
  const candidate = { id: 'test:001:cand_a', unit: 's0001', language: 'en', exact: 'Alice', startCodePoint: 5, endCodePoint: 8 };
  const packet = { preflight: { candidates: [candidate] } };
  const normalized = {
    mentions: [{
      unit: { id: 's0001' },
      spans: { zh: [], en: [{ startCodePoint: 0, endCodePoint: 12 }] },
    }],
  };
  const safe = safelyContainedCandidateIds(normalized, packet, [{ candidate: candidate.id }]);
  if (!safe.has(candidate.id)) throw new Error('Contained candidate was not recognized as safe');
  candidate.startCodePoint = 13;
  candidate.endCodePoint = 16;
  if (safelyContainedCandidateIds(normalized, packet, [{ candidate: candidate.id }]).size !== 0) {
    throw new Error('Standalone candidate was incorrectly recognized as safe');
  }
  candidate.startCodePoint = 0;
  candidate.endCodePoint = 16;
  normalized.mentions[0].person = 'test:001:p001';
  normalized.mentions[0].spans.en[0].exact = 'Alice';
  const wrapped = safelyWrappedCandidateIds(normalized, packet, [{ candidate: candidate.id }]);
  if (!wrapped.has(candidate.id)) throw new Error('Same-person wrapper candidate was not recognized as safe');
  console.log('reconcile-people-alias-callbacks self-test: ok');
}

function updateDebtReport(debt, chapters) {
  const replacements = new Map(chapters.map((item) => [`${item.book}/${item.chapter}`, item]));
  debt.chapters = debt.chapters.flatMap((item) => {
    const replacement = replacements.get(`${item.book}/${item.chapter}`);
    if (!replacement) return [item];
    if (replacement.remaining === 0) return [];
    return [{ ...item, conflicts: replacement.remaining }];
  });
  return debt;
}

function main() {
  const opts = cliOptions(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  if (!fs.existsSync(opts.debtFile)) {
    throw new Error(`Missing ${path.relative(REPO_ROOT, opts.debtFile)}; run npm run people:validate`);
  }
  const debt = readJson(opts.debtFile);
  if (debt.schemaVersion !== 1 || !Array.isArray(debt.chapters)) throw new Error('Invalid alias disposition debt report');
  const selected = debt.chapters.filter((item) => (
    (!opts.book || item.book === opts.book) && (!opts.chapter || item.chapter === opts.chapter)
  ));
  const matcher = loadProperNounMatcher();
  const chapters = selected.map((item) => processChapter(item, opts, matcher));
  const reviewChapters = chapters.filter((item) => item.remaining > 0);
  const report = {
    schemaVersion: 1,
    mode: opts.apply ? 'applied' : 'dry-run',
    chapters: reviewChapters,
    summary: {
      processedChapters: chapters.length,
      chapters: reviewChapters.length,
      initial: chapters.reduce((sum, item) => sum + item.initial, 0),
      safelyReconciled: chapters.reduce((sum, item) => sum + item.safelyReconciled, 0),
      remaining: chapters.reduce((sum, item) => sum + item.remaining, 0),
    },
  };
  if (opts.apply) writeJsonAtomic(opts.debtFile, updateDebtReport(debt, chapters));
  writeJsonAtomic(opts.reportOut, report);
  console.log(
    `${opts.apply ? 'Applied' : 'Planned'} safe alias callback reconciliation: ` +
    `${report.summary.safelyReconciled}/${report.summary.initial} candidate(s) across ` +
    `${report.summary.chapters} chapter(s); ${report.summary.remaining} need contextual review.`,
  );
  console.log(`Review packet: ${path.relative(REPO_ROOT, opts.reportOut)}`);
}

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
