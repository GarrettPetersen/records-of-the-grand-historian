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
  remapMentionSpanThroughEdit,
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

function applyReviewedClaimChanges(claims, reviewed) {
  return claims
    .filter((claim) => !reviewed.retractedClaimIds.has(claim.id))
    .map((claim) => reviewed.revisedClaims.get(claim.id) ?? claim);
}

function describeUnresolvedCandidates(candidateIds, packet) {
  const candidates = new Map(packet.preflight.candidates.map((candidate) => [candidate.id, candidate]));
  return candidateIds.map((id) => {
    const candidate = candidates.get(id);
    if (!candidate) return id;
    return `${id} (${candidate.unit} ${candidate.language} ${JSON.stringify(candidate.exact)})`;
  }).join(', ');
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
    claims: applyReviewedClaimChanges(extraction.claims, reviewed),
    translationRepairs: reviewedRepairs,
  };
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
    ],
    mentions: [
      semanticMention('m0001', 'p001', 's0001', 'temple-name', 'en', 'Yizu'),
      semanticMention('m0002', 'p002', 's0002', 'posthumous-name', 'zh', '孝'),
      semanticMention('m0003', 'p003', 's0003', 'title-reference', 'en', 'Imperial Younger Brother'),
      semanticMention('m0004', 'p004', 's0003', 'personal-name', 'en', 'Chongyuan'),
      semanticMention('m0005', 'p004', 's0003', 'title-reference', 'zh', '皇太弟重元'),
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
  const titleMention = semanticResult.extraction.mentions.find((mention) =>
    mention.spans.en.some((span) => span.exact === 'Imperial Younger Brother Chongyuan')
  );
  const chongyuan = semanticResult.extraction.people.find((person) =>
    person.preferredNameSuggestion.en === 'Yelü Chongyuan'
  );
  if (titleMention?.person !== chongyuan?.localId) {
    throw new Error('A combined title-and-name span was not assigned to the named title holder');
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
    ? expandPeopleExtraction(storedExtraction, currentPacket, {
      allowStaleSurfaces: opts.reconcileCurrent,
    })
    : storedExtraction;
  const statuses = new Set(extraction.translationRepairs.map((repair) => repair.status));

  if (opts.reconcileCurrent) {
    const reconciled = reconcileExtractionAfterRepairs(extraction, currentPacket, {
      markRepairsApplied: false,
    });
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
    claims: applyReviewedClaimChanges(extraction.claims, reviewed),
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
  const reconciled = reconcileExtractionAfterRepairs(reviewedExtraction, revisedPacket, {
    previousPacket: oldPacket,
  });
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
