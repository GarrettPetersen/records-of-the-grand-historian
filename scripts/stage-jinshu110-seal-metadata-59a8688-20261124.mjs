#!/usr/bin/env node
/**
 * Jinshu 110 owner metadata pass at 59a8688 per independent scoped report
 * 9bf571812353b4fda63a0b2990ca504f1918a8a0 (#5465): no source contradictions;
 * remaining seal issues are metadata / native-audit file.
 *
 * Scope only:
 *  - claim-670: point-year westernBounds → westernYear AD 360 (accepted 昇平四年)
 *  - 23 empty active-date hint dossier strings → source-backed non-Western metadata
 *  - coverage.unresolvedReferences: frozen exemplar carry-forward notes
 *
 * Preserve Chinese chronology and prior 628+ claim work. Do not write/seal
 * data/people/date-audits/jinshu/110.json, rewrite the full extraction, or merge.
 */
import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';

const book = 'jinshu';
const chapter = '110';
const report = readJson(
  'research/people/jinshu110-native-date-audit-scoped-report-59a8688-20261124-incomplete.json',
);
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const extraction = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (packet.extractionHash !== report.ownerExtractionHash) {
  throw new Error(`extractionHash drift vs scoped report`);
}
if (report.ownerCommitReviewed !== '59a8688995125bac6b4f17bc7ca2a68bf2179fd2') {
  throw new Error(`unexpected reviewed commit`);
}
if (report.exactRemainingSourceContradictions.count !== 0) {
  throw new Error('scoped report still lists source contradictions');
}

const HINT_STRING = 'Chapter cite lacks a convertible reign-year Western date for this person';
const FROZEN_IDS = report.frozenExemplarsScopeReview.claimIds.map((id) =>
  Number(id.replace('claim-', '')),
);
const ENGLISH_BEFORE = extraction.translationRepairs.filter((r) => r[6] === 'applied').length;
const CLAIM_670_BEFORE = structuredClone(extraction.claims[669]);
const PRESERVE_CLAIM_IDS = new Set(
  Array.from({ length: extraction.claims.length }, (_, i) => i + 1)
    .filter((id) => id !== 670),
);

const emptyHintPeople = extraction.people
  .filter((p) => !Array.isArray(p[4]?.a) || p[4].a.length === 0)
  .map((p) => p[0]);
if (emptyHintPeople.length !== 23) {
  throw new Error(`expected 23 empty-hint people, got ${emptyHintPeople.length}`);
}

const claim670AfterValue = {
  manner: CLAIM_670_BEFORE[2].manner,
  ageAtDeath: CLAIM_670_BEFORE[2].ageAtDeath,
  dateContext: {
    sourceDate: { text: '昇平四年' },
    westernYear: { era: 'AD', year: 360, precision: 'year' },
    event: 'Shengping 4 (昇平四年) = AD 360 per accepted Eastern Jin Mu-era calendar authority.',
  },
};
const claim670After = [
  CLAIM_670_BEFORE[0],
  CLAIM_670_BEFORE[1],
  claim670AfterValue,
  CLAIM_670_BEFORE[3],
  CLAIM_670_BEFORE[4],
];

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Jinshu 110 owner seal-metadata pass at 59a8688',
    agentId: 'bc-1d294055-ba1a-4edb-9343-adeb9881920a',
  },
  changes: [{
    kind: 'replace',
    id: 'claim-670',
    before: CLAIM_670_BEFORE,
    after: claim670After,
    reason: 'Normalize point-year 昇平四年 conversion from degenerate westernBounds to westernYear AD 360 using accepted Eastern Jin Mu-era calendar authority; preserve Chinese sourceDate.',
  }],
};

const applied = applyDateRepairProposal(structuredClone(extraction), proposal, packet);

const hintChanges = [];
for (const person of applied.people) {
  if (!emptyHintPeople.includes(person[0])) continue;
  const before = structuredClone(person[4].a);
  person[4].a = [HINT_STRING];
  hintChanges.push({ personId: person[0], before, after: structuredClone(person[4].a) });
}

const p135 = applied.people.find((p) => p[0] === 'p135');
const p135HintBefore = structuredClone(p135[4].a);
p135[4].a = ['AD 360'];
hintChanges.push({
  personId: 'p135',
  before: p135HintBefore,
  after: ['AD 360'],
  reason: 'align with claim-670 westernYear',
});

const frozenUnits = new Map();
for (const id of FROZEN_IDS) {
  const claim = applied.claims[id - 1];
  if (!claim?.[2]?.undatedSourceAttestation) {
    throw new Error(`frozen claim-${id} lost undatedSourceAttestation`);
  }
  for (const unit of claim[4] || []) {
    if (!frozenUnits.has(unit)) frozenUnits.set(unit, []);
    frozenUnits.get(unit).push(`claim-${id}`);
  }
}

applied.coverage = {
  ...applied.coverage,
  unresolvedReferences: [...frozenUnits.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([unit, claimIds]) => ({
      unit,
      description: `Frozen exemplar carry-forward (${claimIds.join(', ')}): undatedSourceAttestation retained; not re-adjudicated in this metadata pass.`,
    })),
};

for (const id of PRESERVE_CLAIM_IDS) {
  if (JSON.stringify(applied.claims[id - 1]) !== JSON.stringify(extraction.claims[id - 1])) {
    throw new Error(`untouched claim-${id} drifted`);
  }
}
for (const id of FROZEN_IDS) {
  if (applied.claims[id - 1][2]?.undatedSourceAttestation !== true) {
    throw new Error(`frozen claim-${id} drifted`);
  }
}
if (JSON.stringify(applied.claims[669][2].dateContext.sourceDate) !== JSON.stringify({ text: '昇平四年' })) {
  throw new Error('claim-670 lost 昇平四年');
}
if (applied.claims[669][2].dateContext.westernYear?.year !== 360) {
  throw new Error('claim-670 missing westernYear AD 360');
}
if (applied.claims[669][2].dateContext.westernBounds) {
  throw new Error('claim-670 still has westernBounds');
}
if (applied.translationRepairs.filter((r) => r[6] === 'applied').length !== ENGLISH_BEFORE) {
  throw new Error('English drifted');
}
const emptyAfter = applied.people.filter((p) => !p[4]?.a?.length).map((p) => p[0]);
if (emptyAfter.length !== 0) {
  throw new Error(`empty hints remain: ${emptyAfter.join(',')}`);
}

const extPacket = buildPeopleExtractionPacket(book, chapter, {
  properNounMatcher: loadProperNounMatcher(),
});
validateCompactPeopleExtraction(applied, extPacket, { strictAliasDispositions: true });
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(applied));

const afterPacket = buildDateAuditPacket(book, chapter);
const verify = readJson(extractionPath);

const receipt = {
  schemaVersion: 1,
  kind: 'owner-seal-metadata-receipt',
  book,
  chapter,
  pullRequest: 5462,
  baseOwnerCommit: '59a8688995125bac6b4f17bc7ca2a68bf2179fd2',
  independentEvidenceCommit: '9bf571812353b4fda63a0b2990ca504f1918a8a0',
  independentScopedReport: 'research/people/jinshu110-native-date-audit-scoped-report-59a8688-20261124-incomplete.json',
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  sourceHash: afterPacket.sourceHash,
  approvalStatus: 'not-self-approved',
  sourceContradictionsRemaining: 0,
  exactDiff: {
    claim670: {
      before: CLAIM_670_BEFORE[2],
      after: verify.claims[669][2],
      calendarAuthority: 'Eastern Jin Emperor Mu 昇平四年 = AD 360 (accepted prior independent conversion; schema form westernYear for point year)',
    },
    activeHintDossierStrings: {
      count: 23,
      personIds: emptyHintPeople,
      stringApplied: HINT_STRING,
      alsoAligned: [{ personId: 'p135', before: p135HintBefore, after: ['AD 360'] }],
    },
    coverageFrozenCarryForward: {
      before: extraction.coverage.unresolvedReferences,
      after: verify.coverage.unresolvedReferences,
      frozenClaimIds: report.frozenExemplarsScopeReview.claimIds,
    },
  },
  preserved: {
    priorClaimRowsUnchangedExcept670: PRESERVE_CLAIM_IDS.size,
    frozenExemplarsUndatedRetained: FROZEN_IDS.length,
    carriedForwardPriorChecksBasis: 628,
    chineseSourceChronologyPreserved: true,
    approvedEnglishApplied: ENGLISH_BEFORE,
  },
  remainingConcreteUnresolvedCondition: {
    blocksNativeSeal: true,
    condition: 'data/people/date-audits/jinshu/110.json is still absent; owner must not manually seal native approvals on this branch. Extraction metadata above addresses claim-670 schema form, 23 hint dossier strings, and frozen carry-forward coverage notes only.',
  },
  notDone: [
    'no data/people/date-audits/jinshu/110.json write',
    'no native approval seal',
    'no full extraction rewrite',
    'no merge',
    'no self-approval',
  ],
};

writeJsonAtomic('research/people/jinshu110-owner-seal-metadata-receipt-20261124.json', receipt);

console.log(JSON.stringify({
  claim670: {
    beforeWestern: CLAIM_670_BEFORE[2].dateContext.westernBounds ? 'westernBounds' : null,
    afterWestern: 'westernYear AD 360',
    sourceDate: verify.claims[669][2].dateContext.sourceDate,
  },
  hintsFilled: hintChanges.length,
  frozenCoverageNotes: verify.coverage.unresolvedReferences.length,
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  remainingUnresolved: receipt.remainingConcreteUnresolvedCondition.condition,
}, null, 2));
console.log('PASS');
