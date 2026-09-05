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
  assignExplicitCandidatePeople,
  applyTranslationRepairs,
  reconcileExtractionAfterRepairs,
  removeDispositionMentionConflicts,
  removeUnsupportedCrossPersonOverlaps,
  remapMentionSpanThroughEdit,
} from './lib/people-translation-repairs.mjs';
import {
  editorialDecisionPath,
  editorialDecisionSeed,
  validateAppliedEditorialDecisions,
  validateEditorialDecisions,
} from './lib/people-editorial-decisions.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const EXPLICIT_NON_PERSON_REASONS = new Set([
  'place',
  'office',
  'organization',
  'title',
  'book-title',
  'collective',
  'deity',
  'reign-period',
  'polity',
  'not-a-name',
]);

function usage() {
  console.log(`Usage:
  node scripts/apply-people-translation-repairs.mjs --book BOOK --chapter NNN [--extraction PATH] [--decisions PATH]
  node scripts/apply-people-translation-repairs.mjs --book BOOK --chapter NNN --reconcile-current
  node scripts/apply-people-translation-repairs.mjs --self-test

Options:
  --candidate-disposition ID=REASON
                         Explicitly classify a new revised-packet candidate as
                         a non-person. May be repeated; REASON must be one of:
                         ${[...EXPLICIT_NON_PERSON_REASONS].join(', ')}.
  --candidate-person ID=LOCAL_PERSON@KIND
                         Assign a new revised-packet candidate to an existing
                         local person using an explicit mention kind. May be
                         repeated; LOCAL_PERSON may be p071 or the full ID.

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
    candidateDispositions: [],
    candidatePeople: [],
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
    else if (arg === '--candidate-disposition') {
      const value = next();
      const separator = value.lastIndexOf('=');
      const candidate = value.slice(0, separator);
      const reason = value.slice(separator + 1);
      if (separator < 1 || !EXPLICIT_NON_PERSON_REASONS.has(reason)) {
        throw new Error(
          `${arg} must be ID=REASON, with REASON one of: ` +
          [...EXPLICIT_NON_PERSON_REASONS].join(', '),
        );
      }
      opts.candidateDispositions.push({
        candidate,
        disposition: 'not-person',
        reason,
        note: 'Explicitly classified while applying an independently reviewed translation repair.',
      });
    }
    else if (arg === '--candidate-person') {
      const value = next();
      const separator = value.indexOf('=');
      const kindSeparator = value.lastIndexOf('@');
      if (separator < 1 || kindSeparator <= separator + 1 || kindSeparator === value.length - 1) {
        throw new Error(`${arg} must be ID=LOCAL_PERSON@KIND`);
      }
      opts.candidatePeople.push({
        candidate: value.slice(0, separator),
        person: value.slice(separator + 1, kindSeparator),
        kind: value.slice(kindSeparator + 1),
      });
    }
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

function applyReviewedClaimChanges(claims, reviewed) {
  return [
    ...claims
    .filter((claim) => !reviewed.retractedClaimIds.has(claim.id))
    .map((claim) => reviewed.revisedClaims.get(claim.id) ?? claim),
    ...structuredClone(reviewed.addedClaims ?? []),
  ];
}

function removeRetractedNameMentionSpans(mentions, claims, reviewed) {
  const retractedNames = claims.filter((claim) =>
    reviewed.retractedClaimIds.has(claim.id) && claim.predicate === 'name'
  );
  if (retractedNames.length === 0) return structuredClone(mentions);

  return structuredClone(mentions).flatMap((mention) => {
    for (const claim of retractedNames) {
      if (
        claim.subject !== mention.person ||
        !claim.evidence.some((evidence) => evidence.split(':').at(-1) === mention.unit.id)
      ) continue;
      for (const language of ['zh', 'en']) {
        const exact = claim.value?.[language];
        if (typeof exact !== 'string' || !exact) continue;
        mention.spans[language] = mention.spans[language].filter((span) => span.exact !== exact);
      }
    }
    return mention.spans.zh.length > 0 || mention.spans.en.length > 0 ? [mention] : [];
  });
}

function applyReviewedPersonNameChanges(people, claims, reviewed) {
  const originalClaims = new Map(claims.map((claim) => [claim.id, claim]));
  const nameRevisions = [...reviewed.revisedClaims.entries()]
    .map(([id, after]) => ({ before: originalClaims.get(id), after }))
    .filter(({ before, after }) => before?.predicate === 'name' && after.predicate === 'name');

  return people.map((person) => {
    const preferred = { ...person.preferredNameSuggestion };
    let changed = false;
    for (const { before, after } of nameRevisions) {
      if (before.subject !== person.localId || after.subject !== person.localId) continue;
      for (const field of ['en', 'zh', 'pinyin']) {
        const exactMatch = preferred[field] === before.value?.[field];
        const descriptiveKinshipMatch =
          before.value?.kind === 'descriptive-kinship' &&
          field === 'zh' &&
          typeof before.value?.zh === 'string' &&
          preferred.zh?.endsWith(before.value.zh);
        if ((!exactMatch && !descriptiveKinshipMatch) || after.value?.[field] === undefined) continue;
        preferred[field] = after.value[field];
        changed = true;
      }
    }
    return changed ? { ...person, preferredNameSuggestion: preferred } : person;
  });
}

function nestedPersonIds(value, people) {
  if (typeof value === 'string') return people.has(value) ? [value] : [];
  if (Array.isArray(value)) return value.flatMap((item) => nestedPersonIds(item, people));
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap((item) => nestedPersonIds(item, people));
}

function claimPersonPairs(claim, people) {
  return nestedPersonIds(claim.value, people).flatMap((other) => {
    if (other === claim.subject || !people.has(claim.subject)) return [];
    return [[claim.subject, other].sort().join('\u0000')];
  });
}

function applyReviewedRelationshipHintChanges(people, originalClaims, finalClaims, reviewed) {
  const personIds = new Set(people.map((person) => person.localId));
  const affectedBefore = originalClaims.filter((claim) =>
    reviewed.retractedClaimIds.has(claim.id) || reviewed.revisedClaims.has(claim.id)
  );
  const affectedAfter = [
    ...reviewed.revisedClaims.values(),
    ...(reviewed.addedClaims ?? []),
  ];
  const removedPairs = new Set(affectedBefore.flatMap((claim) => claimPersonPairs(claim, personIds)));
  const addedPairs = new Set(affectedAfter.flatMap((claim) => claimPersonPairs(claim, personIds)));
  const finalPairs = new Set(finalClaims.flatMap((claim) => claimPersonPairs(claim, personIds)));

  return people.map((person) => {
    const related = new Set(person.identityHints.relatedLocalPeople);
    for (const pair of removedPairs) {
      const [left, right] = pair.split('\u0000');
      if (!finalPairs.has(pair)) {
        if (person.localId === left) related.delete(right);
        if (person.localId === right) related.delete(left);
      }
    }
    for (const pair of addedPairs) {
      const [left, right] = pair.split('\u0000');
      if (person.localId === left) related.add(right);
      if (person.localId === right) related.add(left);
    }
    return {
      ...person,
      identityHints: {
        ...person.identityHints,
        relatedLocalPeople: [...related].sort(),
      },
    };
  });
}

function westernPointLabel(point) {
  if (!point || !['AD', 'BC'].includes(point.era) || !Number.isInteger(point.year)) return null;
  return `${point.era} ${point.year}`;
}

function claimActiveDateHints(claim) {
  const hints = [];
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (value.westernInterval?.start && value.westernInterval?.end) {
      const start = westernPointLabel(value.westernInterval.start);
      const end = westernPointLabel(value.westernInterval.end);
      if (start && end) {
        hints.push(
          value.westernInterval.start.era === value.westernInterval.end.era
            ? `${start}-${value.westernInterval.end.year}`
            : `${start}-${end}`,
        );
      }
    } else if (value.westernYear) {
      const year = westernPointLabel(value.westernYear);
      if (year) hints.push(year);
    }
    for (const nested of Object.values(value)) {
      if (nested && typeof nested === 'object') visit(nested);
    }
  }
  visit(claim.value);
  return [...new Set(hints)];
}

function applyReviewedTemporalHintChanges(people, originalClaims, finalClaims, reviewed) {
  const affectedSubjects = new Set([
    ...originalClaims
      .filter((claim) =>
        reviewed.retractedClaimIds.has(claim.id) || reviewed.revisedClaims.has(claim.id)
      )
      .filter((claim) => claimActiveDateHints(claim).length > 0)
      .map((claim) => claim.subject),
    ...(reviewed.addedClaims ?? [])
      .filter((claim) => claimActiveDateHints(claim).length > 0)
      .map((claim) => claim.subject),
    ...reviewed.revisedClaims.values()
      .filter((claim) => claimActiveDateHints(claim).length > 0)
      .map((claim) => claim.subject),
  ]);
  if (affectedSubjects.size === 0) return people;

  return people.map((person) => {
    if (!affectedSubjects.has(person.localId)) return person;
    const activeDateHints = [...new Set(finalClaims
      .filter((claim) => claim.subject === person.localId)
      .flatMap(claimActiveDateHints))].sort();
    return {
      ...person,
      identityHints: {
        ...person.identityHints,
        activeDateHints,
      },
    };
  });
}

function describeUnresolvedCandidates(candidateIds, packet) {
  const candidates = new Map(packet.preflight.candidates.map((candidate) => [candidate.id, candidate]));
  return candidateIds.map((id) => {
    const candidate = candidates.get(id);
    if (!candidate) return id;
    return `${id} (${candidate.unit} ${candidate.language} ${JSON.stringify(candidate.exact)})`;
  }).join(', ');
}

function applyExplicitCandidateDispositions(reconciled, packet, requested) {
  if (requested.length === 0) return reconciled;
  const packetCandidates = new Set(packet.preflight.candidates.map((candidate) => candidate.id));
  const accounted = new Set([
    ...reconciled.extraction.mentions.flatMap((mention) => mention.candidateRefs),
    ...reconciled.extraction.candidateDispositions.map((item) => item.candidate),
  ]);
  const unresolved = new Set(reconciled.unresolvedCandidates);
  for (const disposition of requested) {
    if (!packetCandidates.has(disposition.candidate)) {
      throw new Error(`Explicit candidate disposition is not in the revised packet: ${disposition.candidate}`);
    }
    if (accounted.has(disposition.candidate)) {
      throw new Error(`Explicit candidate disposition is already accounted for: ${disposition.candidate}`);
    }
    if (!unresolved.has(disposition.candidate)) {
      throw new Error(`Explicit candidate disposition is not unresolved: ${disposition.candidate}`);
    }
    reconciled.extraction.candidateDispositions.push(disposition);
    accounted.add(disposition.candidate);
    unresolved.delete(disposition.candidate);
  }
  return {
    ...reconciled,
    unresolvedCandidates: reconciled.unresolvedCandidates.filter((candidate) => unresolved.has(candidate)),
  };
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
  const candidateId = 'fixture:001:cand_1234567890abcdef';
  const explicitClassification = applyExplicitCandidateDispositions({
    extraction: { mentions: [], candidateDispositions: [] },
    unresolvedCandidates: [candidateId],
    unresolvedSpans: [],
  }, {
    preflight: { candidates: [{ id: candidateId }] },
  }, [{
    candidate: candidateId,
    disposition: 'not-person',
    reason: 'polity',
    note: 'Fixture classification.',
  }]);
  if (
    explicitClassification.unresolvedCandidates.length !== 0 ||
    explicitClassification.extraction.candidateDispositions[0]?.candidate !== candidateId
  ) {
    throw new Error('Explicit revised-packet candidate disposition was not applied');
  }
  const personCandidateId = 'fixture:001:cand_abcdef0123456789';
  const personAssignment = assignExplicitCandidatePeople({
    extraction: {
      book: 'fixture',
      chapter: '001',
      people: [{ localId: 'fixture:001:p001' }],
      mentions: [{
        id: 'fixture:001:m0001',
        person: 'fixture:001:p001',
        unit: {
          id: 's0001', kind: 'paragraph-sentence', blockIndex: 0,
          collection: 'sentences', itemIndex: 0,
        },
        kind: 'personal-name',
        spans: {
          zh: [],
          en: [{
            exact: 'King Example', occurrence: 0,
            startCodePoint: 0, endCodePoint: 12,
          }],
        },
        candidateRefs: [],
      }],
      candidateDispositions: [],
    },
    unresolvedCandidates: [personCandidateId],
    unresolvedSpans: [],
  }, {
    units: [{
      id: 's0001', kind: 'paragraph-sentence', blockIndex: 0,
      collection: 'sentences', itemIndex: 0, zh: '', en: 'King Example arrived.',
    }],
    preflight: { candidates: [{
      id: personCandidateId, unit: 's0001', language: 'en', exact: 'King Example',
      occurrence: 0, startCodePoint: 0, endCodePoint: 12,
    }] },
  }, [{ candidate: personCandidateId, person: 'p001', kind: 'title-reference' }]);
  if (
    personAssignment.unresolvedCandidates.length !== 0 ||
    personAssignment.extraction.mentions.length !== 1 ||
    personAssignment.extraction.mentions[0]?.person !== 'fixture:001:p001' ||
    personAssignment.extraction.mentions[0]?.candidateRefs[0] !== personCandidateId
  ) {
    throw new Error('Explicit revised-packet person candidate was not assigned');
  }

  const retractedMentionResult = removeRetractedNameMentionSpans([{
    id: 'fixture:001:m0001',
    person: 'fixture:001:p001',
    unit: { id: 's0001' },
    spans: {
      zh: [],
      en: [{ exact: 'Wrong Name', occurrence: 0 }],
    },
    candidateRefs: ['fixture:001:cand_wrong'],
  }], [{
    id: 'fixture:001:c0001',
    subject: 'fixture:001:p001',
    predicate: 'name',
    value: { kind: 'personal', en: 'Wrong Name' },
    evidence: ['fixture:001:s0001'],
  }], { retractedClaimIds: new Set(['fixture:001:c0001']) });
  if (retractedMentionResult.length !== 0) {
    throw new Error('A mention created solely by a retracted name claim survived reconciliation');
  }
  const claimAdditionResult = applyReviewedClaimChanges([], {
    retractedClaimIds: new Set(),
    revisedClaims: new Map(),
    addedClaims: [{
      id: 'fixture:001:c0002',
      subject: 'fixture:001:p001',
      predicate: 'relationship',
      value: { relation: 'spouse-of', personId: 'fixture:001:p002' },
      certainty: 'explicit',
      evidence: ['fixture:001:s0001'],
    }],
  });
  if (claimAdditionResult.length !== 1 || claimAdditionResult[0].id !== 'fixture:001:c0002') {
    throw new Error('An independently reviewed claim addition was not applied');
  }
  const temporalPeople = [{
    localId: 'fixture:001:p001',
    identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: ['AD 502-549'] },
  }];
  const temporalBefore = [{
    id: 'fixture:001:c0003',
    subject: 'fixture:001:p001',
    predicate: 'attestation',
    value: {
      westernInterval: {
        start: { era: 'AD', year: 502 },
        end: { era: 'AD', year: 549 },
      },
    },
  }];
  const temporalAfter = [{
    ...temporalBefore[0],
    value: {
      westernInterval: {
        start: { era: 'AD', year: 209 },
        end: { era: 'AD', year: 290 },
      },
    },
  }];
  const temporalResult = applyReviewedTemporalHintChanges(
    temporalPeople,
    temporalBefore,
    temporalAfter,
    {
      retractedClaimIds: new Set(),
      revisedClaims: new Map([[temporalBefore[0].id, temporalAfter[0]]]),
      addedClaims: [],
    },
  );
  if (temporalResult[0].identityHints.activeDateHints.join() !== 'AD 209-290') {
    throw new Error('A reviewed temporal claim revision left stale active-date hints');
  }
  expectDecisionFailure(() => applyExplicitCandidateDispositions(
    explicitClassification,
    { preflight: { candidates: [{ id: candidateId }] } },
    [{ candidate: candidateId, disposition: 'not-person', reason: 'polity' }],
  ), 'already-accounted explicit candidate disposition');

  const renamed = remapMentionSpanThroughEdit(
    { exact: 'Xuan', occurrence: 0, startCodePoint: 17, endCodePoint: 21 },
    'After three days Xuan let a dagger fall before him.',
    'After three days Xian let a visiting card fall before him.',
    'en',
  );
  if (renamed?.exact !== 'Xian') {
    throw new Error('Edited person name was not remapped through surrounding changes');
  }
  const renamedAtEnd = remapMentionSpanThroughEdit(
    { exact: 'Biao', occurrence: 0 },
    'Bo was the son of Biao.',
    'Bo was the son of Bing.',
    'en',
  );
  if (renamedAtEnd?.exact !== 'Bing') {
    throw new Error('Edited person name before punctuation was not remapped');
  }
  const removedAttribution = remapMentionSpanThroughEdit(
    { exact: 'Confucius', occurrence: 0 },
    'He often quoted Confucius: "Lead with virtue."',
    'He often took as principle: "Lead with virtue."',
    'en',
  );
  if (removedAttribution !== null) {
    throw new Error('Removed person attribution was remapped onto ordinary replacement prose');
  }
  const overlappingTitle = {
    people: [
      { localId: 'fixture:p001', preferredNameSuggestion: {} },
      { localId: 'fixture:p002', preferredNameSuggestion: {} },
    ],
    claims: [],
    mentions: [
      {
        id: 'fixture:m001',
        person: 'fixture:p001',
        unit: { id: 's0001' },
        kind: 'title-reference',
        spans: { zh: [], en: [{ exact: 'Chancellor', startCodePoint: 4, endCodePoint: 14 }] },
        candidateRefs: [],
      },
      {
        id: 'fixture:m002',
        person: 'fixture:p002',
        unit: { id: 's0001' },
        kind: 'personal-name',
        spans: { zh: [], en: [{ exact: 'Chancellor', startCodePoint: 4, endCodePoint: 14 }] },
        candidateRefs: [],
      },
    ],
  };
  removeUnsupportedCrossPersonOverlaps(overlappingTitle, new Map());
  if (
    overlappingTitle.mentions[0].spans.en.length !== 1 ||
    overlappingTitle.mentions[1].spans.en.length !== 0
  ) {
    throw new Error('A remapped personal name displaced an unchanged title reference');
  }
  const repeatedOldText =
    'Dances ran from Offered Ancestor through Taiwu; later records start from Offered Ancestor.';
  const repeatedNewText =
    'Dances ran from the Lord of Hongnong through Taiwu; later records start from Offered Ancestor.';
  const firstRepeatedStart = repeatedOldText.indexOf('Offered Ancestor');
  const secondRepeatedStart = repeatedOldText.lastIndexOf('Offered Ancestor');
  const firstRepeated = remapMentionSpanThroughEdit({
    exact: 'Offered Ancestor', occurrence: 0,
    startCodePoint: firstRepeatedStart, endCodePoint: firstRepeatedStart + 16,
  }, repeatedOldText, repeatedNewText, 'en');
  const secondRepeated = remapMentionSpanThroughEdit({
    exact: 'Offered Ancestor', occurrence: 1,
    startCodePoint: secondRepeatedStart, endCodePoint: secondRepeatedStart + 16,
  }, repeatedOldText, repeatedNewText, 'en');
  if (firstRepeated?.exact === 'Offered Ancestor') {
    throw new Error('A replaced repeated name drifted onto the surviving namesake');
  }
  if (secondRepeated?.exact !== 'Offered Ancestor') {
    throw new Error('A surviving repeated name was not preserved through an earlier replacement');
  }
  const matcher = loadProperNounMatcher();
  const chapter = {
    meta: { book: 'fixture', chapter: '001', title: { zh: '', en: '' } },
    content: [{
      type: 'paragraph',
      sentences: [{
        id: 's0001',
        zh: '劉湛昨日來，劉湛留。',
        literal: 'Liu Zhan came.',
        idiomatic: 'Liu Zhan came.',
        translation: 'Liu Zhan came.',
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
  decisions.claimRevisions.push({
    repairId: extraction.translationRepairs[1].id,
    before: structuredClone(extraction.claims[0]),
    after: {
      ...structuredClone(extraction.claims[0]),
      value: { ...structuredClone(extraction.claims[0].value), pinyin: 'Liu Zhan' },
    },
    reason: 'The accepted repair confirms the normalized pinyin represented by the corrected English name.',
    sourceWitness: {
      source: 'chapter-text',
      citation: 'fixture/001 s0001',
      excerpt: '劉湛',
    },
  });
  decisions.claimAdditions.push({
    repairId: extraction.translationRepairs[1].id,
    claim: {
      id: 'fixture:001:c0004',
      subject: 'fixture:001:p001',
      predicate: 'role',
      value: { roleId: 'scholar' },
      certainty: 'strongly-inferred',
      evidence: ['fixture:001:s0001'],
    },
    reason: 'The accepted fixture repair supplies evidence for an additional durable role claim.',
    sourceWitness: {
      source: 'chapter-text',
      citation: 'fixture/001 s0001',
      excerpt: '劉湛昨日來，劉湛留。',
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
  const cjkReplacement = structuredClone(decisions);
  cjkReplacement.decisions[1].decision = 'revise';
  cjkReplacement.decisions[1].after = 'Liu Zhan (劉湛) came yesterday and stayed.';
  expectDecisionFailure(
    () => validateEditorialDecisions(cjkReplacement, extraction, oldPacket),
    'Chinese characters in an English replacement',
  );

  const applied = applyTranslationRepairs(chapter, reviewedRepairs);
  const appliedUnit = applied.chapter.content[0].sentences[0];
  const appliedEnglish = 'Liu Zhan came yesterday, and Liu Zhan stayed.';
  if (
    appliedUnit.translation !== appliedEnglish ||
    appliedUnit.idiomatic !== appliedEnglish ||
    appliedUnit.translations[0].idiomatic !== appliedEnglish
  ) {
    throw new Error('Duplicated idiomatic translation fields were not updated together');
  }
  const revisedPacket = buildPeopleExtractionPacket('fixture', '001', {
    chapterData: applied.chapter,
    chapterFile: '/tmp/fixture-001.json',
    properNounMatcher: matcher,
  });
  if (!reviewed.retractedClaimIds.has('fixture:001:c0003')) {
    throw new Error('Reviewed claim retraction was not returned for application');
  }
  if (reviewed.revisedClaims.get('fixture:001:c0001')?.value.pinyin !== 'Liu Zhan') {
    throw new Error('Reviewed claim revision was not returned for application');
  }
  if (reviewed.addedClaims[0]?.id !== 'fixture:001:c0004') {
    throw new Error('Reviewed claim addition was not returned for application');
  }
  const evidenceRemoval = structuredClone(decisions);
  evidenceRemoval.claimRevisions[0].before.evidence = [
    'fixture:001:s0001',
    'fixture:001:s0002',
  ];
  evidenceRemoval.claimRevisions[0].after.evidence = ['fixture:001:s0002'];
  extraction.claims[0].evidence = ['fixture:001:s0001', 'fixture:001:s0002'];
  const evidenceReviewed = validateEditorialDecisions(evidenceRemoval, extraction, oldPacket);
  if (
    JSON.stringify(evidenceReviewed.revisedClaims.get('fixture:001:c0001')?.evidence) !==
    JSON.stringify(['fixture:001:s0002'])
  ) {
    throw new Error('Reviewed claim evidence removal was not returned for application');
  }
  const overbroadEvidenceRemoval = structuredClone(evidenceRemoval);
  overbroadEvidenceRemoval.claimRevisions[0].after.evidence = [];
  expectDecisionFailure(
    () => validateEditorialDecisions(overbroadEvidenceRemoval, extraction, oldPacket),
    'claim evidence removal without a remaining citation',
  );
  extraction.claims[0].evidence = ['fixture:001:s0001'];
  const reviewedExtraction = {
    ...structuredClone(extraction),
    people: applyReviewedPersonNameChanges(extraction.people, extraction.claims, reviewed),
    claims: applyReviewedClaimChanges(extraction.claims, reviewed),
    translationRepairs: reviewedRepairs,
  };
  if (reviewedExtraction.people[0].preferredNameSuggestion.pinyin !== 'Liu Zhan') {
    throw new Error('Reviewed name claim did not update the preferred person suggestion');
  }
  const reconciled = reconcileExtractionAfterRepairs(reviewedExtraction, revisedPacket, {
    previousPacket: oldPacket,
  });
  if (reconciled.unresolvedCandidates.length > 0) throw new Error('Fixture left unresolved candidates');
  if (reconciled.unresolvedSpans.length > 0) throw new Error('Fixture left unresolved mention spans');
  const repeatedSpans = reconciled.extraction.mentions
    .filter((mention) => mention.person === 'fixture:001:p001' && mention.unit.id === 's0001')
    .flatMap((mention) => mention.spans.en);
  if (repeatedSpans.length !== 2) {
    throw new Error('Repeated repaired person surface was not reconciled');
  }
  validatePeopleExtraction(reconciled.extraction, revisedPacket);
  validateAppliedEditorialDecisions(decisions, reconciled.extraction);
  const compact = compactPeopleExtraction(reconciled.extraction, revisedPacket);
  const compactResult = validateCompactPeopleExtraction(compact, revisedPacket);
  if (compactResult.stats.people !== 1 || compactResult.stats.repairs !== 1) {
    throw new Error('Compact extraction round trip lost fixture data');
  }

  const fragmentPacket = {
    book: 'fixture',
    chapter: '002',
    input: {},
    units: [{
      id: 's0001', kind: 'paragraph-sentence', blockIndex: 0,
      collection: 'sentences', itemIndex: 0,
      zh: '平樂監傅介子', en: 'Ping Le Supervisor Fu Jiezi', literal: 'Ping Le Supervisor Fu Jiezi',
    }, {
      id: 's0002', kind: 'paragraph-sentence', blockIndex: 1,
      collection: 'sentences', itemIndex: 0,
      zh: '河內', en: 'Henei', literal: 'Henei',
    }, {
      id: 's0003', kind: 'paragraph-sentence', blockIndex: 2,
      collection: 'sentences', itemIndex: 0,
      zh: '', en: 'Liu Xin', literal: 'Liu Xin',
    }, {
      id: 's0004', kind: 'paragraph-sentence', blockIndex: 3,
      collection: 'sentences', itemIndex: 0,
      zh: '', en: 'Only one remains.', literal: 'Only one remains.',
    }, {
      id: 's0005', kind: 'paragraph-sentence', blockIndex: 4,
      collection: 'sentences', itemIndex: 0,
      zh: '', en: 'Am I also to leave?', literal: 'Am I also to leave?',
    }, {
      id: 's0006', kind: 'paragraph-sentence', blockIndex: 5,
      collection: 'sentences', itemIndex: 0,
      zh: '', en: 'During the Jianwu era, he served.', literal: 'During the Jianwu era, he served.',
    }, {
      id: 's0007', kind: 'paragraph-sentence', blockIndex: 6,
      collection: 'sentences', itemIndex: 0,
      zh: '', en: 'Administrator of Nan Commandery', literal: 'Administrator of Nan Commandery',
    }, {
      id: 's0008', kind: 'paragraph-sentence', blockIndex: 7,
      collection: 'sentences', itemIndex: 0,
      zh: '', en: 'The Privy Treasurer ordered it.', literal: 'The Privy Treasurer ordered it.',
    }, {
      id: 's0009', kind: 'paragraph-sentence', blockIndex: 8,
      collection: 'sentences', itemIndex: 0,
      zh: '', en: 'Gaozu ordered it.', literal: 'Gaozu ordered it.',
    }, {
      id: 's0010', kind: 'paragraph-sentence', blockIndex: 9,
      collection: 'sentences', itemIndex: 0,
      zh: '', en: 'He held all the Xi and Xí peoples.', literal: 'He held all the Xi and Xí peoples.',
    }, {
      id: 's0011', kind: 'paragraph-sentence', blockIndex: 10,
      collection: 'sentences', itemIndex: 0,
      zh: '', en: 'He took five prefectures: Wei, Xin, Wu, Gui, and Ru.',
      literal: 'He took five prefectures: Wei, Xin, Wu, Gui, and Ru.',
    }, {
      id: 's0012', kind: 'paragraph-sentence', blockIndex: 11,
      collection: 'sentences', itemIndex: 0,
      zh: '芝、葛祗皆被執。', en: 'Zhi and Ge Zhi were both captured.',
      literal: 'Zhi and Ge Zhi were both captured.',
    }, {
      id: 's0013', kind: 'paragraph-sentence', blockIndex: 12,
      collection: 'sentences', itemIndex: 0,
      zh: '賜保義功臣。', en: 'He was granted the title Meritorious Subject of Sincere Support.',
      literal: 'He was granted the title Meritorious Subject of Sincere Support.',
    }, {
      id: 's0014', kind: 'paragraph-sentence', blockIndex: 13,
      collection: 'sentences', itemIndex: 0,
      zh: '國舅詳穩。', en: 'Guojiu Xiangwen presented offerings.',
      literal: 'Guojiu Xiangwen presented offerings.',
    }, {
      id: 's0015', kind: 'paragraph-sentence', blockIndex: 14,
      collection: 'sentences', itemIndex: 0,
      zh: '禺中。', en: 'Trade continued through the Wei hour.',
      literal: 'Trade continued through the Wei hour.',
    }, {
      id: 's0016', kind: 'paragraph-sentence', blockIndex: 15,
      collection: 'sentences', itemIndex: 0,
      zh: '遙輦窪可汗宮人。', en: 'Yaolian Waqaghan Palace enrolled him.',
      literal: 'Yaolian Waqaghan Palace enrolled him.',
    }, {
      id: 's0017', kind: 'paragraph-sentence', blockIndex: 16,
      collection: 'sentences', itemIndex: 0,
      zh: '安平王。', en: 'The Prince of Anping arrived.',
      literal: 'The Prince of Anping arrived.',
    }, {
      id: 's0018', kind: 'paragraph-sentence', blockIndex: 17,
      collection: 'sentences', itemIndex: 0,
      zh: '離碓。', en: 'Lidui was surveyed.',
      literal: 'Lidui was surveyed.',
    }, {
      id: 's0019', kind: 'paragraph-sentence', blockIndex: 18,
      collection: 'sentences', itemIndex: 0,
      zh: '詹事。', en: 'Heir Apparent’s Household',
      literal: 'Heir Apparent’s Household',
    }, {
      id: 's0020', kind: 'paragraph-sentence', blockIndex: 19,
      collection: 'sentences', itemIndex: 0,
      zh: '滑、濮、澶、鄆。', en: 'They went to Hua, Pu, Chan, and Yun prefectures.',
      literal: 'They went to Hua, Pu, Chan, and Yun prefectures.',
    }, {
      id: 's0021', kind: 'paragraph-sentence', blockIndex: 20,
      collection: 'sentences', itemIndex: 0,
      zh: '伊、洛、澶、澗皆溢。', en: 'Yi, Luo, Chan, and Jian rivers overflowed.',
      literal: 'Yi, Luo, Chan, and Jian rivers overflowed.',
    }, {
      id: 's0022', kind: 'paragraph-sentence', blockIndex: 21,
      collection: 'sentences', itemIndex: 0,
      zh: '為官。', en: 'He became an official.',
      literal: 'Bao became an official.',
    }, {
      id: 's0023', kind: 'paragraph-sentence', blockIndex: 22,
      collection: 'sentences', itemIndex: 0,
      zh: '在福州。', en: 'He served in Fuzhou.',
      literal: 'He served in Fuzhou.',
    }, {
      id: 's0024', kind: 'paragraph-sentence', blockIndex: 23,
      collection: 'sentences', itemIndex: 0,
      zh: '傅介子安平王。', en: 'Fu Jiezi, Prince of Anping, returned.',
      literal: 'Fu Jiezi, Prince of Anping, returned.',
    }, {
      id: 's0025', kind: 'paragraph-sentence', blockIndex: 24,
      collection: 'sentences', itemIndex: 0,
      zh: '未久。', en: 'Not long after, it ended.',
      literal: 'Not long after, it ended.',
    }, {
      id: 's0026', kind: 'paragraph-sentence', blockIndex: 25,
      collection: 'sentences', itemIndex: 0,
      zh: '引新史。', en: 'He cited the New History.',
      literal: 'He cited the New History.',
    }, {
      id: 's0027', kind: 'paragraph-sentence', blockIndex: 26,
      collection: 'sentences', itemIndex: 0,
      zh: '寧朔將軍。', en: 'He became General Who Pacifies the North.',
      literal: 'He became General Who Pacifies the North.',
    }, {
      id: 's0028', kind: 'paragraph-sentence', blockIndex: 27,
      collection: 'sentences', itemIndex: 0,
      zh: '不能決者。', en: 'What they cannot decide should be reported.',
      literal: 'What they cannot decide should be reported.',
    }, {
      id: 's0029', kind: 'paragraph-sentence', blockIndex: 28,
      collection: 'sentences', itemIndex: 0,
      zh: '廷尉亦當奏。', en: 'The Commandant of Justice should also report.',
      literal: 'The Commandant of Justice should also report.',
    }, {
      id: 's0030', kind: 'paragraph-sentence', blockIndex: 29,
      collection: 'sentences', itemIndex: 0,
      zh: '尚書顧命篇。', en: 'The Documents cites the Testamentary Charge.',
      literal: 'The Documents cites the Testamentary Charge.',
    }, {
      id: 's0031', kind: 'paragraph-sentence', blockIndex: 30,
      collection: 'sentences', itemIndex: 0,
      zh: '其中。', en: 'Among them, none objected.',
      literal: 'Among them, none objected.',
    }, {
      id: 's0032', kind: 'paragraph-sentence', blockIndex: 31,
      collection: 'sentences', itemIndex: 0,
      zh: '三父房。', en: "The Three Fathers' lines were noble.",
      literal: "The Three Fathers' lines were noble.",
    }, {
      id: 's0033', kind: 'paragraph-sentence', blockIndex: 32,
      collection: 'sentences', itemIndex: 0,
      zh: '王府近侍。', en: "Princes' attendants served.",
      literal: "Princes' attendants served.",
    }],
    preflight: {
      candidates: [{
        id: 'fixture:002:cand_title', unit: 's0001', language: 'en',
        exact: 'Ping Le Supervisor Fu', occurrence: 0, startCodePoint: 0, endCodePoint: 21,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_henei_en', unit: 's0002', language: 'en',
        exact: 'Henei', occurrence: 0, startCodePoint: 0, endCodePoint: 5,
        detectors: [{ kind: 'chinese-notes-english-definition', glossaryId: 36412 }],
      }, {
        id: 'fixture:002:cand_henei_zh', unit: 's0002', language: 'zh',
        exact: '河內', occurrence: 0, startCodePoint: 0, endCodePoint: 2,
        detectors: [{ kind: 'chinese-notes-proper-noun', glossaryId: 36412 }],
      }, {
        id: 'fixture:002:cand_liu_xin', unit: 's0003', language: 'en',
        exact: 'Liu Xin', occurrence: 0, startCodePoint: 0, endCodePoint: 7,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_only', unit: 's0004', language: 'en',
        exact: 'Only', occurrence: 0, startCodePoint: 0, endCodePoint: 4,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_am_i', unit: 's0005', language: 'en',
        exact: 'Am I', occurrence: 0, startCodePoint: 0, endCodePoint: 4,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_jianwu', unit: 's0006', language: 'en',
        exact: 'Jianwu', occurrence: 0, startCodePoint: 11, endCodePoint: 18,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_nan', unit: 's0007', language: 'en',
        exact: 'Nan', occurrence: 0, startCodePoint: 17, endCodePoint: 20,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_privy', unit: 's0008', language: 'en',
        exact: 'Privy Treasurer', occurrence: 0, startCodePoint: 4, endCodePoint: 19,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_gaozu', unit: 's0009', language: 'en',
        exact: 'Gaozu', occurrence: 0, startCodePoint: 0, endCodePoint: 5,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_xi_people', unit: 's0010', language: 'en',
        exact: 'Xí', occurrence: 0, startCodePoint: 23, endCodePoint: 25,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_ru_prefecture', unit: 's0011', language: 'en',
        exact: 'Ru', occurrence: 0, startCodePoint: 49, endCodePoint: 51,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_ge_zhi', unit: 's0012', language: 'en',
        exact: 'Ge Zhi', occurrence: 0, startCodePoint: 8, endCodePoint: 14,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_meritorious_subject', unit: 's0013', language: 'en',
        exact: 'Meritorious Subject', occurrence: 0, startCodePoint: 25, endCodePoint: 44,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_guojiu', unit: 's0014', language: 'en',
        exact: 'Guojiu Xiangwen', occurrence: 0, startCodePoint: 0, endCodePoint: 15,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_wei_hour', unit: 's0015', language: 'en',
        exact: 'Wei', occurrence: 0, startCodePoint: 28, endCodePoint: 31,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_yaolian_palace', unit: 's0016', language: 'en',
        exact: 'Yaolian Waqaghan', occurrence: 0, startCodePoint: 0, endCodePoint: 16,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_anping_title', unit: 's0017', language: 'en',
        exact: 'Anping', occurrence: 0, startCodePoint: 14, endCodePoint: 20,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_lidui_place', unit: 's0018', language: 'en',
        exact: 'Lidui', occurrence: 0, startCodePoint: 0, endCodePoint: 5,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_heir_household', unit: 's0019', language: 'en',
        exact: 'Heir Apparent’s Household', occurrence: 0, startCodePoint: 0, endCodePoint: 25,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_nested_place', unit: 's0020', language: 'en',
        exact: 'Chan', occurrence: 0, startCodePoint: 22, endCodePoint: 26,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_river_list', unit: 's0021', language: 'en',
        exact: 'Chan', occurrence: 0, startCodePoint: 9, endCodePoint: 13,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_reused_title_prefix', unit: 's0024', language: 'en',
        exact: 'Prince', occurrence: 0, startCodePoint: 10, endCodePoint: 16,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_reused_title_place', unit: 's0024', language: 'en',
        exact: 'Anping', occurrence: 0, startCodePoint: 20, endCodePoint: 26,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_not', unit: 's0025', language: 'en',
        exact: 'Not', occurrence: 0, startCodePoint: 0, endCodePoint: 3,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_work_title', unit: 's0026', language: 'en',
        exact: 'New History', occurrence: 0, startCodePoint: 13, endCodePoint: 24,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_office_direction', unit: 's0027', language: 'en',
        exact: 'North', occurrence: 0, startCodePoint: 35, endCodePoint: 40,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_what', unit: 's0028', language: 'en',
        exact: 'What', occurrence: 0, startCodePoint: 0, endCodePoint: 4,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_justice', unit: 's0029', language: 'en',
        exact: 'Justice', occurrence: 0, startCodePoint: 18, endCodePoint: 25,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_testamentary_charge', unit: 's0030', language: 'en',
        exact: 'Testamentary Charge', occurrence: 0, startCodePoint: 24, endCodePoint: 43,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_among', unit: 's0031', language: 'en',
        exact: 'Among', occurrence: 0, startCodePoint: 0, endCodePoint: 5,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_three_fathers', unit: 's0032', language: 'en',
        exact: "Three Fathers'", occurrence: 0, startCodePoint: 4, endCodePoint: 18,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }, {
        id: 'fixture:002:cand_princes', unit: 's0033', language: 'en',
        exact: "Princes'", occurrence: 0, startCodePoint: 0, endCodePoint: 8,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }],
    },
  };
  const fragmentExtraction = {
    schemaVersion: 1,
    book: 'fixture',
    chapter: '002',
    input: {},
    run: { model: 'fixture', promptVersion: 4, agentId: 'fixture' },
    people: [{
      localId: 'fixture:002:p001',
      preferredNameSuggestion: { en: 'Fu Jiezi', zh: '傅介子' },
      historicity: 'historical',
      descriptorSuggestion: 'Envoy',
      identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: [] },
    }, {
      localId: 'fixture:002:p002',
      preferredNameSuggestion: { en: 'Li' },
      historicity: 'historical',
      descriptorSuggestion: 'Named Individual',
      identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: [] },
    }, {
      localId: 'fixture:002:p003',
      preferredNameSuggestion: { en: 'Liu Xin' },
      historicity: 'historical',
      descriptorSuggestion: 'Scholar',
      identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: [] },
    }, {
      localId: 'fixture:002:p004',
      preferredNameSuggestion: { en: 'Gaozu' },
      historicity: 'historical',
      descriptorSuggestion: 'Ruler',
      identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: [] },
    }, {
      localId: 'fixture:002:p005',
      preferredNameSuggestion: { en: 'Zhi', zh: '芝' },
      historicity: 'historical',
      descriptorSuggestion: 'Official',
      identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: [] },
    }, {
      localId: 'fixture:002:p006',
      preferredNameSuggestion: { en: 'Ge Zhi', zh: '葛祗' },
      historicity: 'historical',
      descriptorSuggestion: 'Official',
      identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: [] },
    }],
    mentions: [{
      id: 'fixture:002:m0001',
      person: 'fixture:002:p001',
      unit: {
        id: 's0001', kind: 'paragraph-sentence', blockIndex: 0,
        collection: 'sentences', itemIndex: 0,
      },
      kind: 'personal-name',
      spans: { zh: [], en: [{ exact: 'Fu Jiezi', occurrence: 0 }] },
      candidateRefs: [],
    }, {
      id: 'fixture:002:m0002',
      person: 'fixture:002:p003',
      unit: {
        id: 's0003', kind: 'paragraph-sentence', blockIndex: 2,
        collection: 'sentences', itemIndex: 0,
      },
      kind: 'personal-name',
      spans: {
        zh: [],
        en: [{ exact: 'Liu Xin', occurrence: 0 }, { exact: 'Liu', occurrence: 0 }],
      },
      candidateRefs: ['fixture:002:cand_liu_xin'],
    }, {
      id: 'fixture:002:m0003',
      person: 'fixture:002:p005',
      unit: {
        id: 's0012', kind: 'paragraph-sentence', blockIndex: 11,
        collection: 'sentences', itemIndex: 0,
      },
      kind: 'personal-name',
      spans: { zh: [{ exact: '芝', occurrence: 0 }], en: [] },
      candidateRefs: [],
    }, {
      id: 'fixture:002:m0004',
      person: 'fixture:002:p006',
      unit: {
        id: 's0012', kind: 'paragraph-sentence', blockIndex: 11,
        collection: 'sentences', itemIndex: 0,
      },
      kind: 'personal-name',
      spans: { zh: [{ exact: '葛祗', occurrence: 0 }], en: [] },
      candidateRefs: [],
    }, {
      id: 'fixture:002:m0005',
      person: 'fixture:002:p001',
      unit: {
        id: 's0022', kind: 'paragraph-sentence', blockIndex: 21,
        collection: 'sentences', itemIndex: 0,
      },
      kind: 'personal-name',
      spans: { zh: [], en: [{ exact: 'Bao', occurrence: 0 }] },
      candidateRefs: [],
    }, {
      id: 'fixture:002:m0006',
      person: 'fixture:002:p001',
      unit: {
        id: 's0023', kind: 'paragraph-sentence', blockIndex: 22,
        collection: 'sentences', itemIndex: 0,
      },
      kind: 'personal-name',
      spans: { zh: [], en: [{ exact: 'Fu', occurrence: 0, startCodePoint: 13, endCodePoint: 15 }] },
      candidateRefs: [],
    }, {
      id: 'fixture:002:m0007',
      person: 'fixture:002:p001',
      unit: {
        id: 's0024', kind: 'paragraph-sentence', blockIndex: 23,
        collection: 'sentences', itemIndex: 0,
      },
      kind: 'personal-name',
      spans: {
        zh: [{ exact: '傅介子', occurrence: 0 }],
        en: [{ exact: 'Fu Jiezi', occurrence: 0 }],
      },
      candidateRefs: [],
    }],
    claims: [{
      id: 'fixture:002:c0001', subject: 'fixture:002:p001', predicate: 'name',
      value: { kind: 'personal', en: 'Fu Jiezi', zh: '傅介子' }, certainty: 'explicit',
      evidence: ['fixture:002:s0001'],
    }, {
      id: 'fixture:002:c0002', subject: 'fixture:002:p002', predicate: 'name',
      value: { kind: 'personal', en: 'Li' }, certainty: 'explicit',
      evidence: ['fixture:002:s0003'],
    }, {
      id: 'fixture:002:c0003', subject: 'fixture:002:p003', predicate: 'name',
      value: { kind: 'personal', en: 'Liu Xin' }, certainty: 'explicit',
      evidence: ['fixture:002:s0003'],
    }, {
      id: 'fixture:002:c0004', subject: 'fixture:002:p004', predicate: 'name',
      value: { kind: 'temple-name', en: 'Gaozu' }, certainty: 'explicit',
      evidence: ['fixture:002:s0003'],
    }, {
      id: 'fixture:002:c0005', subject: 'fixture:002:p005', predicate: 'name',
      value: { kind: 'personal', en: 'Zhi', zh: '芝' }, certainty: 'explicit',
      evidence: ['fixture:002:s0012'],
    }, {
      id: 'fixture:002:c0006', subject: 'fixture:002:p006', predicate: 'name',
      value: { kind: 'personal', en: 'Ge Zhi', zh: '葛祗' }, certainty: 'explicit',
      evidence: ['fixture:002:s0012'],
    }, {
      id: 'fixture:002:c0007', subject: 'fixture:002:p001', predicate: 'honor',
      value: { label: { en: 'Meritorious Subject of Sincere Support', zh: '保義功臣' } },
      certainty: 'explicit', evidence: ['fixture:002:s0013'],
    }, {
      id: 'fixture:002:c0008', subject: 'fixture:002:p001', predicate: 'organization-association',
      value: { organization: { en: 'Yaolian Waqaghan Palace', zh: '遙輦窪可汗宮' }, relation: 'member-of' },
      certainty: 'explicit', evidence: ['fixture:002:s0016'],
    }, {
      id: 'fixture:002:c0009', subject: 'fixture:002:p001', predicate: 'name',
      value: { kind: 'title', en: 'Prince of Anping', zh: '安平王' },
      certainty: 'explicit', evidence: ['fixture:002:s0017'],
    }, {
      id: 'fixture:002:c0010', subject: 'fixture:002:p001', predicate: 'place-association',
      value: { place: { en: 'Lidui', zh: '離碓' }, relation: 'worked-at' },
      certainty: 'explicit', evidence: ['fixture:002:s0018'],
    }, {
      id: 'fixture:002:c0011', subject: 'fixture:002:p001', predicate: 'event-participation',
      value: { kind: 'travel', place: { en: 'Hua, Pu, Chan, and Yun prefectures' } },
      certainty: 'explicit', evidence: ['fixture:002:s0020'],
    }, {
      id: 'fixture:002:c0012', subject: 'fixture:002:p001', predicate: 'attestation',
      value: { westernYear: { era: 'AD', year: 900, precision: 'year' } },
      certainty: 'explicit-event-contextual-date', evidence: ['fixture:002:s0023'],
    }, {
      id: 'fixture:002:c0013', subject: 'fixture:002:p001', predicate: 'authorship',
      value: { work: { en: 'New History of the Five Dynasties' }, relation: 'author' },
      certainty: 'explicit', evidence: ['fixture:002:s0026'],
    }],
    translationRepairs: [],
    candidateDispositions: [{
      candidate: 'fixture:002:cand_henei_zh',
      disposition: 'not-person', reason: 'place', note: null,
    }, {
      candidate: 'fixture:002:cand_guoguo',
      disposition: 'not-person', reason: 'office', note: null,
    }],
    coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] },
  };
  const previousFragmentPacket = structuredClone(fragmentPacket);
  const previousOfficeUnit = previousFragmentPacket.units.find((unit) => unit.id === 's0014');
  previousOfficeUnit.en = 'Guoguo Xiangwen presented offerings.';
  previousOfficeUnit.literal = 'Guoguo Xiangwen presented offerings.';
  const previousOfficeCandidate = previousFragmentPacket.preflight.candidates.find((candidate) =>
    candidate.id === 'fixture:002:cand_guojiu'
  );
  previousOfficeCandidate.id = 'fixture:002:cand_guoguo';
  previousOfficeCandidate.exact = 'Guoguo Xiangwen';
  const fragments = reconcileExtractionAfterRepairs(fragmentExtraction, fragmentPacket, {
    previousPacket: previousFragmentPacket,
    markRepairsApplied: false,
  });
  if (fragments.unresolvedCandidates.length > 0) {
    throw new Error('Fragment reconciliation fixture left unresolved candidates');
  }
  if (fragments.extraction.mentions.some((mention) =>
    mention.spans.en.some((span) => span.exact === 'Bao')
  )) {
    throw new Error('Literal-only English surface survived as a display-text mention');
  }
  if (
    fragments.extraction.mentions.some((mention) =>
      mention.spans.en.some((span) => span.exact === 'Fu')
    ) ||
    fragments.extraction.claims.some((claim) =>
      claim.predicate === 'attestation' && claim.evidence.includes('fixture:002:s0023')
    )
  ) {
    throw new Error('Unbounded subword surface or its derived attestation survived reconciliation');
  }
  const widened = fragments.extraction.mentions.find((mention) =>
    mention.spans.en.some((span) => span.exact === 'Ping Le Supervisor Fu Jiezi')
  );
  if (!widened) throw new Error('Overlapping title fragment did not widen the person mention');
  const inherited = fragments.extraction.candidateDispositions.find((item) =>
    item.candidate === 'fixture:002:cand_henei_en' && item.reason === 'place'
  );
  if (!inherited) throw new Error('Bilingual glossary candidate did not inherit its disposition');
  const boundedName = fragments.extraction.mentions.find((mention) =>
    mention.person === 'fixture:002:p003' &&
    mention.spans.en.some((span) => span.exact === 'Liu Xin')
  );
  if (!boundedName) throw new Error('English surface matching confused Li with Liu Xin');
  if (boundedName.spans.en.length !== 1 || boundedName.spans.en[0].exact !== 'Liu Xin') {
    throw new Error('Contained alias span was not collapsed into the widest person mention');
  }
  const preferredNameMention = fragments.extraction.mentions.find((mention) =>
    mention.person === 'fixture:002:p004' &&
    mention.unit.id === 's0009' &&
    mention.spans.en.some((span) => span.exact === 'Gaozu')
  );
  if (!preferredNameMention) {
    throw new Error('Unique preferred name did not acquire a mention in a newly repaired unit');
  }
  const restoredFullName = fragments.extraction.mentions.find((mention) =>
    mention.person === 'fixture:002:p006' &&
    mention.unit.id === 's0012' &&
    mention.spans.en.some((span) => span.exact === 'Ge Zhi')
  );
  if (!restoredFullName) {
    throw new Error('Restored full name did not outrank its contained shorter alias');
  }
  const restoredTitle = fragments.extraction.mentions.find((mention) =>
    mention.person === 'fixture:002:p001' &&
    mention.unit.id === 's0017' &&
    mention.kind === 'title-reference' &&
    mention.spans.en.some((span) => span.exact === 'Prince of Anping')
  );
  if (!restoredTitle) {
    throw new Error('A corrected full title did not become a linked person mention');
  }
  const reusedTitle = fragments.extraction.mentions.find((mention) =>
    mention.person === 'fixture:002:p001' &&
    mention.unit.id === 's0024' &&
    mention.spans.en.some((span) => span.exact === 'Prince of Anping')
  );
  if (!reusedTitle) {
    throw new Error('Established title was not reused for a later explicit person context');
  }
  const expectedNonPeople = new Map([
    ['fixture:002:cand_only', 'not-a-name'],
    ['fixture:002:cand_am_i', 'not-a-name'],
    ['fixture:002:cand_not', 'not-a-name'],
    ['fixture:002:cand_jianwu', 'reign-period'],
    ['fixture:002:cand_nan', 'place'],
    ['fixture:002:cand_privy', 'office'],
    ['fixture:002:cand_xi_people', 'collective'],
    ['fixture:002:cand_ru_prefecture', 'place'],
    ['fixture:002:cand_meritorious_subject', 'title'],
    ['fixture:002:cand_guojiu', 'office'],
    ['fixture:002:cand_wei_hour', 'other'],
    ['fixture:002:cand_yaolian_palace', 'organization'],
    ['fixture:002:cand_lidui_place', 'place'],
    ['fixture:002:cand_heir_household', 'organization'],
    ['fixture:002:cand_nested_place', 'place'],
    ['fixture:002:cand_river_list', 'place'],
    ['fixture:002:cand_work_title', 'book-title'],
    ['fixture:002:cand_office_direction', 'office'],
    ['fixture:002:cand_justice', 'office'],
    ['fixture:002:cand_testamentary_charge', 'book-title'],
    ['fixture:002:cand_among', 'not-a-name'],
    ['fixture:002:cand_three_fathers', 'organization'],
    ['fixture:002:cand_princes', 'collective'],
    ['fixture:002:cand_what', 'not-a-name'],
  ]);
  for (const [candidate, reason] of expectedNonPeople) {
    const disposition = fragments.extraction.candidateDispositions.find((item) =>
      item.candidate === candidate
    );
    if (disposition?.reason !== reason) {
      throw new Error(`Contextual non-person candidate was not classified: ${candidate}`);
    }
  }

  const semanticUnits = [
    ['s0001', '懿祖', 'The Virtuous Ancestor (Yizu) arrived.'],
    ['s0002', '諡曰孝', 'He received the posthumous name Xiao.'],
    ['s0003', '皇太弟重元', 'The Imperial Younger Brother Chongyuan arrived.'],
    ['s0004', '太子少傅魏收', 'Junior Tutor to the Crown Prince Wei Shou served.'],
    ['s0005', '國子監生', 'Imperial Academy students could not serve.'],
    ['s0006', '北南院兵', 'He led the Northern and Southern Division armies.'],
    ['s0007', '至澶州', 'He reached Chanzhou.'],
    ['s0008', '汲郡城旁', "He camped beside Ji commandery's city."],
    ['s0009', '上柱國', 'He was Supreme Pillar of the State.'],
    ['s0010', '塔里捨，地名。', 'Talise: a place name.'],
    ['s0011', '莫弗紇，諸部酋長稱。', 'Mofu He: a title for tribal chiefs; also called Mofu Ho.'],
    ['s0012', '征斡羅思部。', "He campaigned against the Rus'."],
    ['s0013', '鎮守斡羅思。', "He was sent to garrison Rus'."],
    ['s0014', '博啓圖遷。', 'Boqitu was transferred.'],
  ].map(([id, zh, en], index) => ({
    id,
    kind: 'paragraph-sentence',
    blockIndex: index,
    collection: 'sentences',
    itemIndex: 0,
    zh,
    en,
    literal: en,
  }));
  const semanticUnit = (id) => semanticUnits.find((unit) => unit.id === id);
  const semanticSpan = (unitId, language, exact) => {
    const text = semanticUnit(unitId)[language];
    const start = text.indexOf(exact);
    return {
      exact,
      occurrence: 0,
      startCodePoint: [...text.slice(0, start)].length,
      endCodePoint: [...text.slice(0, start + exact.length)].length,
    };
  };
  const semanticCandidate = (id, unit, exact) => ({
    id: `fixture:003:${id}`,
    unit,
    language: 'en',
    ...semanticSpan(unit, 'en', exact),
    detectors: [{ kind: 'english-capitalized-expression' }],
  });
  const semanticPacket = {
    book: 'fixture',
    chapter: '003',
    input: {},
    units: semanticUnits,
    preflight: {
      candidates: [
        semanticCandidate('cand_virtuous', 's0001', 'Virtuous Ancestor'),
        semanticCandidate('cand_xiao', 's0002', 'Xiao'),
        semanticCandidate('cand_younger_brother', 's0003', 'Imperial Younger Brother Chongyuan'),
        semanticCandidate('cand_junior_tutor', 's0004', 'Junior Tutor'),
        semanticCandidate('cand_academy', 's0005', 'Imperial Academy'),
        semanticCandidate('cand_northern', 's0006', 'Northern'),
        semanticCandidate('cand_chanzhou', 's0007', 'Chanzhou'),
        semanticCandidate('cand_ji', 's0008', 'Ji'),
        semanticCandidate('cand_supreme_pillar', 's0009', 'Supreme Pillar'),
        semanticCandidate('cand_place_headword', 's0010', 'Talise'),
        semanticCandidate('cand_chief_title', 's0011', 'Mofu Ho'),
        semanticCandidate('cand_rus_collective', 's0012', "Rus'"),
        semanticCandidate('cand_rus_place', 's0013', "Rus'"),
      ],
    },
  };
  const semanticPerson = (id, en, zh) => ({
    localId: `fixture:003:${id}`,
    preferredNameSuggestion: { en, zh },
    historicity: 'historical',
    descriptorSuggestion: 'Named Individual',
    identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: [] },
  });
  const semanticMention = (id, person, unit, kind, language, exact) => ({
    id: `fixture:003:${id}`,
    person: `fixture:003:${person}`,
    unit: (({ id: unitId, kind: unitKind, blockIndex, collection, itemIndex }) => ({
      id: unitId,
      kind: unitKind,
      blockIndex,
      collection,
      itemIndex,
    }))(semanticUnit(unit)),
    kind,
    spans: {
      zh: language === 'zh' ? [semanticSpan(unit, language, exact)] : [],
      en: language === 'en' ? [semanticSpan(unit, language, exact)] : [],
    },
    candidateRefs: [],
  });
  const semanticClaim = (id, person, unit, predicate, value) => ({
    id: `fixture:003:${id}`,
    subject: `fixture:003:${person}`,
    predicate,
    value,
    certainty: 'explicit',
    evidence: [`fixture:003:${unit}`],
  });
  const semanticExtraction = {
    schemaVersion: 1,
    book: 'fixture',
    chapter: '003',
    input: {},
    run: { model: 'fixture', promptVersion: 7, agentId: 'fixture' },
    people: [
      semanticPerson('p001', 'Yizu', '懿祖'),
      semanticPerson('p002', 'Lu Luyuan', '盧魯元'),
      semanticPerson('p003', 'The Emperor', '帝'),
      semanticPerson('p004', 'Yelü Chongyuan', '耶律重元'),
      semanticPerson('p005', 'Wei Shou', '魏收'),
      semanticPerson('p006', 'Boqitu', '博啓圖'),
    ],
    mentions: [
      semanticMention('m0001', 'p001', 's0001', 'temple-name', 'en', 'Yizu'),
      semanticMention('m0002', 'p002', 's0002', 'posthumous-name', 'zh', '孝'),
      semanticMention('m0003', 'p003', 's0003', 'title-reference', 'en', 'Imperial Younger Brother'),
      semanticMention('m0004', 'p004', 's0003', 'personal-name', 'en', 'Chongyuan'),
      semanticMention('m0005', 'p004', 's0003', 'title-reference', 'zh', '皇太弟重元'),
      semanticMention('m0006', 'p006', 's0014', 'personal-name', 'zh', '博啓圖'),
    ],
    claims: [
      semanticClaim('c0001', 'p001', 's0001', 'name', { kind: 'temple-name', en: 'Yizu', zh: '懿祖' }),
      semanticClaim('c0002', 'p002', 's0002', 'honor', {
        label: { en: 'Filial', zh: '孝' }, action: 'posthumous-name',
      }),
      semanticClaim('c0003', 'p004', 's0003', 'name', {
        kind: 'title', en: 'Imperial Younger Brother', zh: '皇太弟',
      }),
      semanticClaim('c0004', 'p004', 's0003', 'name', {
        kind: 'personal', en: 'Chongyuan', zh: '重元',
      }),
      semanticClaim('c0005', 'p005', 's0004', 'occupation', {
        label: { en: 'Junior Tutor to the Crown Prince', zh: '太子少傅' },
      }),
      semanticClaim('c0006', 'p006', 's0014', 'name', {
        kind: 'personal', en: 'Boqitu', zh: '博啓圖',
      }),
    ],
    translationRepairs: [],
    candidateDispositions: [],
    coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] },
  };
  const semanticResult = reconcileExtractionAfterRepairs(semanticExtraction, semanticPacket, {
    markRepairsApplied: false,
  });
  if (semanticResult.unresolvedCandidates.length > 0) {
    throw new Error(`Semantic reconciliation fixture left unresolved candidates: ${semanticResult.unresolvedCandidates}`);
  }
  const semanticNameKinds = new Map(semanticResult.extraction.claims
    .filter((claim) => claim.predicate === 'name')
    .map((claim) => [claim.value?.en, claim.value?.kind]));
  if (semanticNameKinds.get('Virtuous Ancestor') !== 'temple-name') {
    throw new Error('A translated temple name before a parenthetical romanization was not linked');
  }
  if (semanticNameKinds.get('Xiao') !== 'posthumous-name') {
    throw new Error('A posthumous-name formula did not create the corresponding person alias');
  }
  const semanticDispositions = new Map(semanticResult.extraction.candidateDispositions.map((item) => [
    item.candidate,
    item.reason,
  ]));
  if (semanticDispositions.get('fixture:003:cand_place_headword') !== 'place') {
    throw new Error('An explicit place-name headword was not classified as a place');
  }
  if (semanticDispositions.get('fixture:003:cand_chief_title') !== 'office') {
    throw new Error('A tribal-chief title variant was not classified as an office');
  }
  if (semanticDispositions.get('fixture:003:cand_rus_collective') !== 'collective') {
    throw new Error('The Rus campaign target was not classified as a collective');
  }
  if (semanticDispositions.get('fixture:003:cand_rus_place') !== 'place') {
    throw new Error('Rus as garrisoned territory was not classified as a place');
  }
  const titleMention = semanticResult.extraction.mentions.find((mention) =>
    mention.spans.en.some((span) => span.exact === 'Imperial Younger Brother Chongyuan')
  );
  const chongyuan = semanticResult.extraction.people.find((person) =>
    person.preferredNameSuggestion.en === 'Yelü Chongyuan'
  );
  if (titleMention?.person !== chongyuan?.localId) {
    throw new Error('A combined title-and-name span was not assigned to the named title holder');
  }
  if (!semanticResult.extraction.mentions.some((mention) =>
    mention.person === semanticResult.extraction.people.find((person) =>
      person.preferredNameSuggestion.en === 'Boqitu'
    )?.localId &&
    mention.unit.id === 's0014' &&
    mention.spans.en.some((span) => span.exact === 'Boqitu')
  )) {
    throw new Error('A preferred romanization introduced once by a repair was not linked');
  }

  const contextualTitlePacket = {
    book: 'fixture',
    chapter: '004',
    input: {},
    units: [{
      id: 's0001',
      kind: 'paragraph-sentence',
      blockIndex: 0,
      collection: 'sentences',
      itemIndex: 0,
      zh: '帝歸。',
      en: 'The Emperor returned.',
      literal: 'The Emperor returned.',
    }],
    preflight: {
      candidates: [{
        id: 'fixture:004:cand_emperor',
        unit: 's0001',
        language: 'en',
        exact: 'Emperor',
        occurrence: 0,
        startCodePoint: 4,
        endCodePoint: 11,
        detectors: [{ kind: 'english-capitalized-expression' }],
      }],
    },
  };
  const contextualTitleExtraction = {
    schemaVersion: 1,
    book: 'fixture',
    chapter: '004',
    input: {},
    run: { model: 'fixture', promptVersion: 7, agentId: 'fixture' },
    people: [{
      localId: 'fixture:004:p003',
      preferredNameSuggestion: { en: 'Earlier Emperor', zh: '先帝' },
      historicity: 'historical',
      descriptorSuggestion: 'Ruler',
      identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: [] },
    }],
    mentions: [],
    claims: [{
      id: 'fixture:004:c0001',
      subject: 'fixture:004:p003',
      predicate: 'name',
      value: { kind: 'title', en: 'Emperor', zh: '帝' },
      certainty: 'explicit',
      evidence: ['fixture:004:s0000'],
    }],
    translationRepairs: [],
    candidateDispositions: [],
    coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] },
  };
  const contextualTitleResult = reconcileExtractionAfterRepairs(
    contextualTitleExtraction,
    contextualTitlePacket,
    { markRepairsApplied: false },
  );
  if (!contextualTitleResult.unresolvedCandidates.includes('fixture:004:cand_emperor')) {
    throw new Error('A generic sovereign title was assigned from unrelated cross-unit evidence');
  }
  if (contextualTitleResult.extraction.people[0]?.localId !== 'fixture:004:p003') {
    throw new Error('Translation repair reconciliation renumbered a stable person ID');
  }

  const candidateConflictFixture = {
    mentions: [{ candidateRefs: ['fixture:candidate:person'] }],
    candidateDispositions: [
      { candidate: 'fixture:candidate:person', disposition: 'not-person', reason: 'not-a-name' },
      { candidate: 'fixture:candidate:place', disposition: 'not-person', reason: 'place' },
    ],
  };
  removeDispositionMentionConflicts(candidateConflictFixture);
  if (
    candidateConflictFixture.candidateDispositions.length !== 1 ||
    candidateConflictFixture.candidateDispositions[0].candidate !== 'fixture:candidate:place'
  ) {
    throw new Error('Final person mentions did not supersede stale non-person dispositions');
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
  let extraction = compactStored
    ? expandPeopleExtraction(storedExtraction, currentPacket, {
      allowStaleSurfaces: opts.reconcileCurrent,
    })
    : storedExtraction;
  const statuses = new Set(extraction.translationRepairs.map((repair) => repair.status));
  const invalidStatuses = [...statuses].filter((status) => !['applied', 'proposed'].includes(status));
  if (invalidStatuses.length > 0) {
    throw new Error(`Unknown translation repair status: ${invalidStatuses.join(', ')}`);
  }

  if (opts.reconcileCurrent) {
    const reconciled = applyExplicitCandidateDispositions(
      assignExplicitCandidatePeople(reconcileExtractionAfterRepairs(extraction, currentPacket, {
        markRepairsApplied: false,
      }), currentPacket, opts.candidatePeople),
      currentPacket,
      opts.candidateDispositions,
    );
    if (reconciled.unresolvedSpans.length > 0) {
      throw new Error(
        `Unresolved stale mention spans: ${reconciled.unresolvedSpans.map((item) =>
          `${item.mention.id}:${item.language}:${JSON.stringify(item.span.exact)}`
        ).join(', ')}`,
      );
    }
    if (reconciled.unresolvedCandidates.length > 0) {
      throw new Error(
        `Unresolved new candidates: ${describeUnresolvedCandidates(reconciled.unresolvedCandidates, currentPacket)}`,
      );
    }
    const result = validatePeopleExtraction(reconciled.extraction, currentPacket);
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

  if (!statuses.has('proposed')) {
    if (compactStored) validateCompactPeopleExtraction(storedExtraction, currentPacket);
    else validatePeopleExtraction(extraction, currentPacket);
    console.log(`No proposed repairs remain for ${opts.book}/${opts.chapter}.`);
    return;
  }

  const oldPacket = currentPacket;
  extraction = validatePeopleExtraction(extraction, oldPacket).normalized;
  const decisionFile = opts.decisions ?? editorialDecisionPath(opts.book, opts.chapter);
  if (!fs.existsSync(decisionFile)) {
    throw new Error(
      `Independent editorial decisions are required: ${path.relative(REPO_ROOT, decisionFile)}`,
    );
  }
  const decisionDocument = readJson(decisionFile);
  const reviewed = validateEditorialDecisions(decisionDocument, extraction, oldPacket);
  const retainedRepairs = renumberRepairs([
    ...extraction.translationRepairs.filter((repair) => repair.status === 'applied'),
    ...reviewed.reviewedRepairs,
  ], opts.book, opts.chapter);
  const reviewedRepairs = retainedRepairs.filter((repair) => repair.status === 'proposed');
  const reviewedClaims = applyReviewedClaimChanges(extraction.claims, reviewed);
  const reviewedPeople = applyReviewedTemporalHintChanges(
    applyReviewedRelationshipHintChanges(
      applyReviewedPersonNameChanges(extraction.people, extraction.claims, reviewed),
      extraction.claims,
      reviewedClaims,
      reviewed,
    ),
    extraction.claims,
    reviewedClaims,
    reviewed,
  );
  const reviewedExtraction = {
    ...structuredClone(extraction),
    people: reviewedPeople,
    mentions: removeRetractedNameMentionSpans(extraction.mentions, extraction.claims, reviewed),
    claims: reviewedClaims,
    translationRepairs: retainedRepairs,
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
  const reconciled = applyExplicitCandidateDispositions(
    assignExplicitCandidatePeople(reconcileExtractionAfterRepairs(reviewedExtraction, revisedPacket, {
      previousPacket: oldPacket,
    }), revisedPacket, opts.candidatePeople),
    revisedPacket,
    opts.candidateDispositions,
  );
  if (reconciled.unresolvedSpans.length > 0) {
    throw new Error(
      `Unresolved stale mention spans: ${reconciled.unresolvedSpans.map((item) =>
        `${item.mention.id}:${item.language}:${JSON.stringify(item.span.exact)}`
      ).join(', ')}`,
    );
  }
  if (reconciled.unresolvedCandidates.length > 0) {
    throw new Error(
      `Unresolved new candidates: ${describeUnresolvedCandidates(reconciled.unresolvedCandidates, revisedPacket)}`,
    );
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
