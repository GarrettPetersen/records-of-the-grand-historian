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
  editorialDecisionPath,
  editorialDecisionSeed,
  validateEditorialDecisions,
} from './lib/people-editorial-decisions.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage:
  node scripts/apply-people-translation-repairs.mjs --book BOOK --chapter NNN [--extraction PATH] [--decisions PATH]
  node scripts/apply-people-translation-repairs.mjs --book BOOK --chapter NNN --reconcile-current
  node scripts/apply-people-translation-repairs.mjs --self-test

Proposed repairs require a complete, independently authored editorial-decision
file. The command validates the review before editing, applies only accepted or
revised replacements, rebuilds the packet, and reconciles candidates and spans.
No tracked file is written unless the complete revised state validates.`);
}

function parseArgs(argv) {
  const opts = {
    book: null,
    chapter: null,
    extraction: null,
    decisions: null,
    reconcileCurrent: false,
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
    else if (arg === '--extraction') opts.extraction = path.resolve(REPO_ROOT, next());
    else if (arg === '--decisions') opts.decisions = path.resolve(REPO_ROOT, next());
    else if (arg === '--reconcile-current') opts.reconcileCurrent = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  return opts;
}

function renumberRepairs(repairs, book, chapter) {
  return repairs.map((repair, index) => ({
    ...repair,
    id: `${book}:${chapter}:r${String(index + 1).padStart(4, '0')}`,
  }));
}

function expectDecisionFailure(callback, label) {
  try {
    callback();
  } catch {
    return;
  }
  throw new Error(`Expected editorial decision failure: ${label}`);
}

function selfTest() {
  const matcher = loadProperNounMatcher();
  const chapter = {
    meta: { book: 'fixture', chapter: '001', title: { zh: '', en: '' } },
    content: [{
      type: 'paragraph',
      sentences: [{
        id: 's0001',
        zh: '劉湛昨日來，劉湛留。',
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
    run: { model: 'fixture', promptVersion: 2, agentId: 'fixture-extractor' },
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
      spans: {
        zh: [{ exact: '劉湛', occurrence: 0 }, { exact: '劉湛', occurrence: 1 }],
        en: [{ exact: 'Liu Zhan', occurrence: 0 }],
      },
      candidateRefs: oldPacket.preflight.candidates.map((candidate) => candidate.id),
    }],
    claims: [{
      id: 'fixture:001:c0001', subject: 'fixture:001:p001', predicate: 'name',
      value: { kind: 'personal', en: 'Liu Zhan', zh: '劉湛' }, certainty: 'explicit',
      evidence: ['fixture:001:s0001'],
    }, {
      id: 'fixture:001:c0002', subject: 'fixture:001:p001', predicate: 'role',
      value: { roleId: 'named-individual' }, certainty: 'explicit', evidence: ['fixture:001:s0001'],
    }, {
      id: 'fixture:001:c0003', subject: 'fixture:001:p001', predicate: 'name',
      value: { kind: 'alternate-name', en: 'Liu Zhaan' }, certainty: 'explicit',
      evidence: ['fixture:001:s0001'],
    }],
    translationRepairs: [{
      id: 'fixture:001:r0001', unit: locator, field: 'literal', before: 'Liu Zhan came.',
      after: 'Yesterday did Liu Zhan come.', reason: 'Attempts to add the temporal word present in the source fixture.',
      confidence: 'high', status: 'proposed',
    }, {
      id: 'fixture:001:r0002', unit: locator, field: 'idiomatic', before: 'Liu Zhan came.',
      after: 'Liu Zhan came yesterday, and Liu Zhan stayed.',
      reason: 'Adds the temporal word and second action present in the source fixture.',
      confidence: 'high', status: 'proposed',
    }],
    candidateDispositions: [],
    coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] },
  };
  validatePeopleExtraction(extraction, oldPacket);
  const decisions = editorialDecisionSeed(extraction);
  decisions.reviewer = {
    kind: 'human',
    name: 'Fixture Reviewer',
    model: null,
    agentId: null,
    runId: null,
    completedAt: '2026-08-10T00:00:00.000Z',
  };
  decisions.decisions[0] = {
    repairId: extraction.translationRepairs[0].id,
    decision: 'reject',
    after: null,
    reason: 'The proposal is ungrammatical even though the source contains the temporal word.',
    sourceWitness: {
      source: 'chapter-text',
      citation: 'fixture/001 s0001',
      excerpt: '劉湛昨日來，劉湛留。',
    },
  };
  decisions.decisions[1] = {
    repairId: extraction.translationRepairs[1].id,
    decision: 'accept',
    after: null,
    reason: 'The fixture source explicitly contains the omitted temporal word and second action.',
    sourceWitness: {
      source: 'chapter-text',
      citation: 'fixture/001 s0001',
      excerpt: '昨日來，劉湛留',
    },
  };
  decisions.claimRetractions.push({
    repairId: extraction.translationRepairs[1].id,
    claim: structuredClone(extraction.claims[2]),
    reason: 'The accepted repair confirms that this misspelled English alias was only a translation artifact.',
    sourceWitness: {
      source: 'chapter-text',
      citation: 'fixture/001 s0001',
      excerpt: '劉湛',
    },
  });
  const reviewed = validateEditorialDecisions(decisions, extraction, oldPacket);
  const reviewedRepairs = renumberRepairs(reviewed.reviewedRepairs, 'fixture', '001');
  if (reviewedRepairs.length !== 1 || reviewedRepairs[0].id !== 'fixture:001:r0001') {
    throw new Error('Reviewed repairs were not filtered and renumbered');
  }
  const selfReviewed = structuredClone(decisions);
  selfReviewed.reviewer = {
    kind: 'cursor-agent',
    name: 'fixture',
    model: 'fixture',
    agentId: 'fixture-extractor',
    runId: 'fixture-review',
    completedAt: '2026-08-10T00:00:00.000Z',
  };
  expectDecisionFailure(
    () => validateEditorialDecisions(selfReviewed, extraction, oldPacket),
    'self-review',
  );
  const stale = structuredClone(decisions);
  stale.input.chapterFingerprint = `sha256:${'0'.repeat(64)}`;
  expectDecisionFailure(
    () => validateEditorialDecisions(stale, extraction, oldPacket),
    'stale chapter fingerprint',
  );

  const applied = applyTranslationRepairs(chapter, reviewedRepairs);
  const revisedPacket = buildPeopleExtractionPacket('fixture', '001', {
    chapterData: applied.chapter,
    chapterFile: '/tmp/fixture-001.json',
    properNounMatcher: matcher,
  });
  if (!reviewed.retractedClaimIds.has('fixture:001:c0003')) {
    throw new Error('Reviewed claim retraction was not returned for application');
  }
  const reviewedExtraction = {
    ...structuredClone(extraction),
    claims: extraction.claims.filter((claim) => !reviewed.retractedClaimIds.has(claim.id)),
    translationRepairs: reviewedRepairs,
  };
  const reconciled = reconcileExtractionAfterRepairs(reviewedExtraction, revisedPacket);
  if (reconciled.unresolvedCandidates.length > 0) throw new Error('Fixture left unresolved candidates');
  if (reconciled.unresolvedSpans.length > 0) throw new Error('Fixture left unresolved mention spans');
  const repeatedSpans = reconciled.extraction.mentions
    .filter((mention) => mention.person === 'fixture:001:p001' && mention.unit.id === 's0001')
    .flatMap((mention) => mention.spans.en);
  if (repeatedSpans.length !== 2) {
    throw new Error('Repeated repaired person surface was not reconciled');
  }
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
    const reconciled = reconcileExtractionAfterRepairs(extraction, currentPacket, {
      markRepairsApplied: false,
    });
    const result = validatePeopleExtraction(reconciled.extraction, currentPacket);
    if (reconciled.unresolvedSpans.length > 0) {
      throw new Error(
        `Unresolved stale mention spans: ${reconciled.unresolvedSpans.map((item) =>
          `${item.mention.id}:${item.language}:${JSON.stringify(item.span.exact)}`
        ).join(', ')}`,
      );
    }
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
  const decisionFile = opts.decisions ?? editorialDecisionPath(opts.book, opts.chapter);
  if (!fs.existsSync(decisionFile)) {
    throw new Error(
      `Independent editorial decisions are required: ${path.relative(REPO_ROOT, decisionFile)}`,
    );
  }
  const decisionDocument = readJson(decisionFile);
  const reviewed = validateEditorialDecisions(decisionDocument, extraction, oldPacket);
  const reviewedRepairs = renumberRepairs(reviewed.reviewedRepairs, opts.book, opts.chapter);
  const reviewedExtraction = {
    ...structuredClone(extraction),
    claims: extraction.claims.filter((claim) => !reviewed.retractedClaimIds.has(claim.id)),
    translationRepairs: reviewedRepairs,
  };

  if (reviewedRepairs.length === 0) {
    const result = validatePeopleExtraction(reviewedExtraction, oldPacket);
    if (compactStored) {
      const compact = compactPeopleExtraction(result.normalized, oldPacket);
      validateCompactPeopleExtraction(compact, oldPacket);
      writeTextAtomic(extractionFile, serializeCompactPeopleExtraction(compact));
    } else {
      writeJsonAtomic(extractionFile, result.normalized);
    }
    console.log(
      `Reviewed ${extraction.translationRepairs.length} proposal(s) for ${opts.book}/${opts.chapter}; ` +
      'all were rejected and the chapter was unchanged.',
    );
    return;
  }

  const applied = applyTranslationRepairs(chapter, reviewedRepairs);
  const revisedPacket = buildPeopleExtractionPacket(opts.book, opts.chapter, {
    chapterData: applied.chapter,
    chapterFile,
    properNounMatcher: matcher,
  });
  const reconciled = reconcileExtractionAfterRepairs(reviewedExtraction, revisedPacket);
  if (reconciled.unresolvedSpans.length > 0) {
    throw new Error(
      `Unresolved stale mention spans: ${reconciled.unresolvedSpans.map((item) =>
        `${item.mention.id}:${item.language}:${JSON.stringify(item.span.exact)}`
      ).join(', ')}`,
    );
  }
  if (reconciled.unresolvedCandidates.length > 0) {
    throw new Error(`Unresolved new candidates: ${reconciled.unresolvedCandidates.join(', ')}`);
  }
  const result = validatePeopleExtraction(reconciled.extraction, revisedPacket);
  let serializedExtraction;
  if (compactStored) {
    const compact = compactPeopleExtraction(result.normalized, revisedPacket);
    validateCompactPeopleExtraction(compact, revisedPacket);
    serializedExtraction = serializeCompactPeopleExtraction(compact);
  } else {
    serializedExtraction = `${JSON.stringify(result.normalized, null, 2)}\n`;
  }

  writeJsonAtomic(chapterFile, applied.chapter);
  writeTextAtomic(extractionFile, serializedExtraction);
  writeJsonAtomic(packetPath(opts.book, opts.chapter), revisedPacket);
  console.log(
    `Applied ${reviewedRepairs.length} independently reviewed repair(s) to ` +
    `${opts.book}/${opts.chapter}; ${result.stats.people} people and ` +
    `${result.stats.candidates} candidates remain valid.`,
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
