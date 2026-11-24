#!/usr/bin/env node
/**
 * Jinshu 047 owner consume of research-blocked date report @b18fbe66.
 *
 * Apply ONLY the exact-support case: claim-148 pure undated death → event-only,
 * parallel to supported claim-150 undatedSourceAttestation on the same Chinese
 * unit s0058「尋卒于家」.
 *
 * Remaining five-rank / regency / 丙寅 / imperial mourning / unfamiliar-death
 * rows: emit grouped concrete candidate patches + real blockers; do not apply
 * without exact reviewer support. Preserve dated facts, 21 undated conversions,
 * historical holds, and approved English. No Western invention / full audit redo.
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
const chapter = '047';
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const extraction = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction });
const unitZh = Object.fromEntries((packet.units || []).map((unit) => [unit.id, unit.zh || '']));

const CONVERTED_21 = [
  102, 106, 111, 114, 150, 192, 196, 211, 239, 254, 257, 260, 263, 265,
  416, 476, 477, 877, 883, 884, 885,
];
const HOLD_IDS = [
  27, 28, 148, 454, 455, 456, 459, 475, 480, 482, 485, 487, 489, 494, 495, 496,
  501, 505, 509, 513, 517, 518, 522, 527, 528, 529,
];

function snapshot(id) {
  const claim = extraction.claims[id - 1];
  const value = claim[2] || {};
  const dateContext = value.dateContext || {};
  return {
    claimId: `claim-${id}`,
    personId: claim[0],
    kind: claim[1],
    units: claim[4],
    unitChinese: (claim[4] || []).map((unitId) => ({
      unitId,
      zh: unitZh[unitId] || null,
    })),
    sourceDate: value.sourceDate?.text || dateContext.sourceDate?.text || null,
    unresolved: !!(value.unresolved || dateContext.unresolved),
    unresolvedReason: value.unresolvedReason || dateContext.unresolvedReason || null,
    undatedSourceAttestation: value.undatedSourceAttestation === true,
    western: value.westernBounds || value.westernYear || value.westernInterval
      || dateContext.westernBounds || dateContext.westernYear || dateContext.westernInterval || null,
  };
}

// --- Exact-support apply: claim-148 ---
const before148 = extraction.claims[147];
const zh148 = unitZh.s0058 || '';
if (before148[1] !== 'death' || before148[0] !== 'p018') {
  throw new Error('claim-148 person/kind drifted');
}
if (!Array.isArray(before148[4]) || before148[4][0] !== 's0058') {
  throw new Error('claim-148 unit drifted from s0058');
}
if (!/尋卒于家/.test(zh148)) {
  throw new Error(`claim-148 Chinese mismatch on s0058: ${zh148}`);
}
const before150 = snapshot(150);
if (!before150.undatedSourceAttestation || before150.units[0] !== 's0058') {
  throw new Error('claim-150 parallel undated attestation missing; refuse claim-148 conversion');
}

const after148Value = {
  place: before148[2].place,
  event: 'Death at home after the seating-case dismissal; source states 尋卒于家，時年六十二 with no reign year (same unit Chinese as supported undated attestation claim-150).',
};
const after148 = [before148[0], before148[1], after148Value, before148[3], before148[4]];

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Jinshu 047 owner blocked-date claim-148 event-only conversion',
    agentId: 'bc-1d294055-ba1a-4edb-9343-adeb9881920a',
  },
  changes: [{
    kind: 'replace',
    id: 'claim-148',
    before: before148,
    after: after148,
    reason: 'Exact reviewer support at b18fbe66: optional consistent conversion of pure undated death claim-148 parallel to supported claim-150 on s0058 尋卒于家; event-only, no invented Western year.',
  }],
};

let final = applyDateRepairProposal(extraction, proposal, packet);

// Preserve p018 hints (dated offices + qualitative death age); do not invent Western death year.
const p018 = final.people.find((row) => row[0] === 'p018');
const p018HintsBefore = p018[4]?.a ?? [];
const p018HintsExpected = [
  'Taishi 4 (AD 268) metropolitan censor',
  'Taishi 5 (AD 269) grand coachman',
  'died aged 62 not long after later dismissal',
];
if (JSON.stringify(p018HintsBefore) !== JSON.stringify(p018HintsExpected)) {
  const hintPacket = buildDateAuditPacket(book, chapter, { extraction: final });
  final = applyDateRepairProposal(final, {
    schemaVersion: 1,
    kind: 'date-repair-proposal',
    book,
    chapter,
    sourceHash: hintPacket.sourceHash,
    extractionHash: hintPacket.extractionHash,
    author: proposal.author,
    changes: [{
      kind: 'hints',
      personId: 'p018',
      before: p018HintsBefore,
      after: p018HintsExpected,
      reason: 'Preserve verified p018 active-date hints; death remains qualitative aged-62 without Western year.',
    }],
  }, hintPacket);
}

// Integrity: 21 undated conversions untouched; other holds untouched; English untouched.
for (const id of CONVERTED_21) {
  if (final.claims[id - 1][2]?.undatedSourceAttestation !== true) {
    throw new Error(`converted undated claim-${id} drifted`);
  }
}
for (const id of HOLD_IDS) {
  if (id === 148) continue;
  if (JSON.stringify(final.claims[id - 1]) !== JSON.stringify(extraction.claims[id - 1])) {
    throw new Error(`historical hold claim-${id} was modified without reviewer apply support`);
  }
}
const appliedEnglish = final.translationRepairs.filter((row) => row[6] === 'applied').length;
if (appliedEnglish !== 16) {
  throw new Error(`approved English drifted: ${appliedEnglish}`);
}
if (final.claims[147][2]?.unresolved || final.claims[147][2]?.sourceDate || final.claims[147][2]?.westernBounds) {
  throw new Error('claim-148 still carries unresolved/sourceDate/Western after conversion');
}
if (typeof final.claims[147][2]?.event !== 'string' || final.claims[147][2].event.length < 20) {
  throw new Error('claim-148 event-only conversion missing substantive event');
}

const extPacket = buildPeopleExtractionPacket(book, chapter, { properNounMatcher: loadProperNounMatcher() });
validateCompactPeopleExtraction(final, extPacket, { strictAliasDispositions: true });
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(final));
const afterPacket = buildDateAuditPacket(book, chapter);

// --- Candidate patches (NOT applied) ---
function candidate(groupId, claimIds, disposition, blocker, witnesses) {
  return {
    groupId,
    claimIds: claimIds.map((id) => `claim-${id}`),
    applied: false,
    proposedDisposition: disposition,
    realBlocker: blocker,
    witnesses,
    current: claimIds.map((id) => snapshot(id)),
  };
}

const candidates = [
  candidate(
    'fiveRankNobility',
    [27, 28],
    'Retain unresolved with exact sourceDate「五等建」on s0012; attestation claim-28 could optionally become undatedSourceAttestation only after independent confirm that institutional foundation is pure undated (no conversion ambiguity beyond missing reign year). Enfeoffment claim-27 should stay unresolved/event-tied to 五等建, not Western.',
    'b18fbe66 retains research holds; no exact apply authorization beyond keep-hold. Missing reign year for 五等建 is substantive conversion ambiguity.',
    [{ unitId: 's0012', zh: unitZh.s0012, quote: '五等建' }],
  ),
  candidate(
    'simaLiangRegency',
    [454, 455, 456, 459, 480, 482, 485, 487, 489, 495, 496, 501, 505, 509, 522],
    'Keep unresolved with unit-native phrases (時太宰、汝南王亮輔政 / 咸復以亮輔政專權 / 上在諒暗 / 駿之見討). Strip inherited「時太宰…」labels from cites that lack that Chinese (notably claim-522 on s0162「往從駕」). Do not invent Western Jin year from regency narrative.',
    'b18fbe66 retains cluster as research-blocked pending hashed calendar witnesses. claim-522 sourceDate/regency inherit does not appear on cited unit Chinese — representation candidate only.',
    [
      { unitId: 's0404', zh: unitZh.s0404, quote: '時太宰、汝南王亮輔政' },
      { unitId: 's0151', zh: unitZh.s0151, quote: '咸復以亮輔政專權' },
      { unitId: 's0406', zh: unitZh.s0406, quote: '上在諒暗…所以至死' },
      { unitId: 's0162', zh: unitZh.s0162, quote: '往從駕' },
    ],
  ),
  candidate(
    'bingyinDay',
    [475, 494],
    'Retain unresolved sexagenary-day hold with exact「會丙寅」on s0169; year/month/reign absent. No Western from 丙寅 alone.',
    'b18fbe66 research-blocked: sexagenary day without year is substantive ambiguity, not pure undated.',
    [{ unitId: 's0169', zh: unitZh.s0169, quote: '會丙寅' }],
  ),
  candidate(
    'zhengshiMidMislabelledAsBingyin',
    [527],
    'Re-anchor sourceDate from inherited「會丙寅」to unit-native「正始中」on s0438 and keep unresolved conversion hold (era-mid span), OR undated-only if independent review rejects era-mid as convertible. Do not keep 丙寅 label on a unit that lacks 丙寅.',
    'Independent hold item lists quote 正始中 while owner sourceDate still says 會丙寅 — real witness mismatch; needs independent confirm before apply.',
    [{ unitId: 's0438', zh: unitZh.s0438, quote: '正始中' }],
  ),
  candidate(
    'lateEmperorDeathMourning',
    [513, 517, 518],
    'Retain unresolved with exact「先帝崩背」on s0156. Death claim-518 → optional event-only (no Western) only after independent confirm parallel to claim-148; attestations stay unresolved chapter-cite or undatedSourceAttestation if review treats the speech allusion as undated.',
    'b18fbe66 retains holds; late-emperor death lacks reign year — substantive, not authorized for owner apply this pass.',
    [{ unitId: 's0156', zh: unitZh.s0156, quote: '先帝崩背' }],
  ),
  candidate(
    'stepmotherMourningDeaths',
    [528, 529],
    'Relative mourning「遭繼母憂去官」on s0171: attestation claim-528 candidate undatedSourceAttestation; death claim-529 candidate event-only — same pattern as claim-148/150 only if independent review classifies these as pure undated (report currently retains holds).',
    'b18fbe66 explicitly retains stepmother mourning/death holds; no exact apply authorization this pass.',
    [{ unitId: 's0171', zh: unitZh.s0171, quote: '遭繼母憂去官' }],
  ),
];

const patchesPath = 'research/people/jinshu047-owner-hold-group-candidate-patches-20261124.json';
writeJsonAtomic(patchesPath, {
  schemaVersion: 1,
  kind: 'owner-hold-group-candidate-patches',
  book,
  chapter,
  pullRequest: 5423,
  independentReportCommit: 'b18fbe66a3d714919bfec41774e74719aacf1966',
  independentReport: 'research/people/jinshu047-independent-changed-evidence-review-20261123.json',
  note: 'Concrete grouped candidates only. Not applied except claim-148 (exact support). No Western invention.',
  groups: candidates,
});

const receipt = {
  schemaVersion: 1,
  kind: 'owner-dependency-receipt',
  book,
  chapter,
  pullRequest: 5423,
  independentReportCommit: 'b18fbe66a3d714919bfec41774e74719aacf1966',
  independentChangedEvidenceReview: 'research/people/jinshu047-independent-changed-evidence-review-20261123.json',
  independentDateAuditMaterialized: 'data/people/date-audits/jinshu/047.json',
  baseOwnerCommit: '0d56e4fb15c27e1b9dcc87d046ee27046ec0b0e4',
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  sourceHash: afterPacket.sourceHash,
  approvalStatus: 'not-self-approved',
  appliedWithExactSupport: {
    claimIds: ['claim-148'],
    treatment: 'death event-only parallel to supported claim-150 undatedSourceAttestation on s0058 尋卒于家',
    chineseWitness: { unitId: 's0058', zh: zh148, quote: '尋卒于家' },
  },
  preserved: {
    convertedUndatedAttestations: CONVERTED_21.map((id) => `claim-${id}`),
    convertedCount: 21,
    historicalHoldsUnchanged: HOLD_IDS.filter((id) => id !== 148).map((id) => `claim-${id}`),
    approvedEnglishApplied: appliedEnglish,
    p018Hints: p018HintsExpected,
    datedWesternFacts: 'untouched (no blanket Western strip/guess)',
  },
  candidatePatchesPath: patchesPath,
  remainingBlockers: [
    'Native status=audited still blocked by remaining research holds (25 after claim-148 conversion)',
    'five-rank 五等建 missing reign year',
    'Sima Liang regency cluster lacks numbered year; claim-522 inherited label vs 往從駕 mismatch',
    '會丙寅 sexagenary-day rows lack year/month/reign',
    'claim-527 sourceDate 會丙寅 vs unit 正始中 witness mismatch',
    '先帝崩背 / stepmother mourning holds retained pending independent apply support',
    'date-audits/jinshu/047.json remains research-blocked snapshot @b18fbe66; claim-148 conversion makes extractionHash newer — needs fresh independent item check, not owner self-approval',
  ],
  notDone: [
    'no Western date guessing',
    'no full audit redo',
    'no native audited self-approval',
    'no merge',
    'no other owner chapters',
  ],
};

writeJsonAtomic('research/people/jinshu047-owner-blocked-date-candidate-receipt-20261124.json', receipt);

console.log(JSON.stringify({
  applied: ['claim-148'],
  candidateGroups: candidates.map((group) => ({ id: group.groupId, claims: group.claimIds.length })),
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  english: appliedEnglish,
}, null, 2));
console.log('PASS');
