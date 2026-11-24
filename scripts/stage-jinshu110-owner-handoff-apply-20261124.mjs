#!/usr/bin/env node
/**
 * Jinshu 110 owner repairs from independent handoff @05ba840 (#5465):
 * - claim-137, claim-213
 * - seven unsupported hint spans
 * - frozen 774–787 accept verification / no-op if already undated
 *
 * Does not invent Western years, self-approve, edit validators, or touch other chapters.
 */
import { writeFileSync } from 'node:fs';
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
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const extraction = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction });

const RESEARCH_HINT = ['Chapter cite lacks a convertible reign-year Western date for this person'];
const FROZEN = Array.from({ length: 14 }, (_, i) => 774 + i);

const changes = [];
const plan = [];

function beforeClaim(n) {
  return extraction.claims[n - 1];
}

function replace(n, after, reason, meta) {
  const before = beforeClaim(n);
  changes.push({ kind: 'replace', id: `claim-${n}`, before, after, reason });
  plan.push({ claimId: `claim-${n}`, ...meta });
}

// --- claim-137: remove Yonghe-imported westernBounds; undated prophecy/birth only ---
replace(137, [
  'p003',
  'attestation',
  {
    undatedSourceAttestation: true,
    event: 'Murong Gui’s prophecy of Central Plains descendants and recognition of Jun’s extraordinary physiognomy at birth, as stated at s0004–s0005, without a convertible calendar date.',
  },
  'explicit',
  ['s0004', 's0005'],
], 'Independent residual-failure: Gui’s 初/既而生俊 lines carry no 永和五年; remove onOrBefore AD 349 westernBounds and drop s0008/s0010 imports.', {
  treatment: 'undated-attestation',
  personId: 'p003',
  chinese: '初…既而生俊',
  witness: 's0004–s0005',
});

// --- claim-213: keep seal witness s0076; replace false AD 350 inheritance with 先是 unresolved ---
// Independent suggested s0071, but s0071 is the sortie already owned by claim-212;
// s0076 alone carries 先是，蔣幹以傳國璽送於建鄴.
replace(213, [
  'p038',
  'event-participation',
  {
    kind: 'political',
    role: 'sender',
    action: 'sent the transmitted-state seal to Jianye',
    item: { en: 'transmitted-state seal', zh: '傳國璽' },
    dateContext: {
      sourceDate: { text: '先是' },
      unresolved: true,
      unresolvedReason: 's0076 dates Jiang Gan’s seal delivery only as 先是 relative to Jun’s enthronement narrative; no convertible Western year is stated on this unit. Unit remains s0076 (seal witness); s0071 is the separate sortie already cited on claim-212.',
      event: 'Jiang Gan sent the transmitted-state seal to Jianye before the usurping enthronement account at s0076.',
    },
  },
  'explicit',
  ['s0076'],
], 'Repair hold-evidence-unit-mismatch dating: replace inherited 時/既而/尋而 + AD 350 bounds with exact 先是 unresolved hold on the seal unit.', {
  treatment: 'unresolved-relative-hold',
  personId: 'p038',
  chinese: '先是',
  witness: 's0076 先是，蔣幹以傳國璽送於建鄴…',
  unitNote: 'Kept s0076; declined re-anchor to s0071 because that unit is the military sortie (claim-212), not the seal.',
});

// --- unsupported hint persons: remove off-chapter Western where needed so hints can clear ---
replace(644, [
  'p140',
  'death',
  {
    manner: 'died young, mourned by his father',
    event: 'Cangshu is named in Murong Jun’s banquet speech at s0216 as having died young; this chapter supplies no convertible death year.',
  },
  beforeClaim(644)[3],
  ['s0216'],
], 'Remove off-chapter AD 208 death bound; keep death fact as event-only on the speech unit.', {
  treatment: 'event-only-death',
  personId: 'p140',
  chinese: '倉舒',
  witness: 's0216',
});

replace(772, [
  'p140',
  'attestation',
  {
    undatedSourceAttestation: true,
    event: 'Named as Cangshu in Murong Jun’s Pu Pond banquet speech at s0216, without a personal calendar date in this chapter.',
  },
  'explicit',
  ['s0216'],
], 'Speech-unit attestation becomes undatedSourceAttestation; strip unsupported before AD 208 hint span.', {
  treatment: 'undated-attestation',
  personId: 'p140',
  chinese: '倉舒',
  witness: 's0216',
});

replace(646, [
  'p142',
  'death',
  {
    manner: 'died, mourned by his father',
    event: 'Sun Deng is named in Murong Jun’s banquet speech at s0216 as mourned by his father; this chapter supplies no convertible death year.',
  },
  beforeClaim(646)[3],
  ['s0216'],
], 'Remove off-chapter AD 241 death bound; keep death fact as event-only on the speech unit.', {
  treatment: 'event-only-death',
  personId: 'p142',
  chinese: '登',
  witness: 's0216',
});

replace(773, [
  'p142',
  'attestation',
  {
    undatedSourceAttestation: true,
    event: 'Named as Deng in Murong Jun’s Pu Pond banquet speech at s0216, without a personal calendar date in this chapter.',
  },
  'explicit',
  ['s0216'],
], 'Speech-unit attestation becomes undatedSourceAttestation; strip unsupported before AD 241 hint span.', {
  treatment: 'undated-attestation',
  personId: 'p142',
  chinese: '登',
  witness: 's0216',
});

replace(647, [
  'p143',
  'death',
  {
    manner: 'died as crown prince',
    event: 'Murong Jun recalls crown prince Ye with 自曄亡以來 at s0217; death fact retained without converting the relative speech frame to a Western year.',
  },
  beforeClaim(647)[3],
  ['s0217'],
], 'Remove AD 360 bound from relative 自曄亡以來 speech frame; keep death event-only with source phrase in event text.', {
  treatment: 'event-only-death',
  personId: 'p143',
  chinese: '自曄亡以來',
  witness: 's0217',
});

replace(736, [
  'p169',
  'event-participation',
  {
    kind: 'migration',
    role: 'follower',
    action: 'joined Zu Ti in the south, then returned home',
    otherPersonId: 'p170',
    dateContext: {
      sourceDate: { text: '永嘉之亂' },
      unresolved: true,
      unresolvedReason: 'Chapter cites 永嘉之亂 for the southern flight without a single convertible Western year on s0291–s0292; keep unresolved rather than off-chapter AD 307–313 bounds.',
      event: 'Joined Zu Ti southward during the Yongjia disorders, then returned home.',
    },
  },
  beforeClaim(736)[3],
  ['s0291', 's0292'],
], 'Replace off-chapter Yongjia Western interval with unresolved hold on exact 永嘉之亂.', {
  treatment: 'unresolved-era-hold',
  personId: 'p169',
  chinese: '永嘉之亂',
  witness: 's0291 永嘉之亂，同郡祖逖…',
});

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Jinshu 110 owner handoff repairs 2026-11-24',
    agentId: 'bc-1d294055-ba1a-4edb-9343-adeb9881920a',
  },
  changes,
};

const mid = applyDateRepairProposal(extraction, proposal, packet);

// Hint rebuilds / clears for the seven unsupported spans + p003
const hintTargets = {
  p003: [],
  p140: [],
  p142: [],
  p143: RESEARCH_HINT,
  p161: RESEARCH_HINT,
  p169: RESEARCH_HINT,
  p170: [],
};

const hintChanges = [];
for (const [personId, after] of Object.entries(hintTargets)) {
  const person = mid.people.find((row) => row[0] === personId);
  const before = person[4]?.a ?? [];
  if (JSON.stringify(before) === JSON.stringify(after)) continue;
  hintChanges.push({
    kind: 'hints',
    personId,
    before,
    after,
    reason: `Clear unsupported Western hint span for ${personId} per independent activeDateHintsAudit.`,
  });
}

const midPacket = buildDateAuditPacket(book, chapter, { extraction: mid });
const final = hintChanges.length
  ? applyDateRepairProposal(mid, {
    schemaVersion: 1,
    kind: 'date-repair-proposal',
    book,
    chapter,
    sourceHash: midPacket.sourceHash,
    extractionHash: midPacket.extractionHash,
    author: proposal.author,
    changes: hintChanges,
  }, midPacket)
  : mid;

// Frozen 774–787 must remain undatedSourceAttestation
const frozenStatus = [];
for (const n of FROZEN) {
  const claim = final.claims[n - 1];
  if (claim[1] !== 'attestation' || claim[2]?.undatedSourceAttestation !== true) {
    throw new Error(`frozen claim-${n} is not undatedSourceAttestation`);
  }
  frozenStatus.push({
    id: `claim-${n}`,
    personId: claim[0],
    status: 'already-undatedSourceAttestation',
    units: claim[4],
  });
}

if (final.translationRepairs.filter((row) => row[6] === 'applied').length !== 15) {
  throw new Error('English repairs drifted');
}

const extPacket = buildPeopleExtractionPacket(book, chapter, { properNounMatcher: loadProperNounMatcher() });
validateCompactPeopleExtraction(final, extPacket, { strictAliasDispositions: true });
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(final));
const afterPacket = buildDateAuditPacket(book, chapter);

const receipt = {
  schemaVersion: 1,
  kind: 'owner-dependency-and-handoff-apply-receipt',
  book,
  chapter,
  pullRequest: 5462,
  independentEvidencePullRequest: 5465,
  independentHandoffCommit: '05ba840300b9e70ccf3c740bf3a5cb00b067008e',
  independentHandoff: 'research/people/jinshu110-independent-owner-handoff-20261124.json',
  baseRevisionBefore: '287217b1d7eb30efc4ed5124749e3ab4d6bf2978',
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  sourceHash: afterPacket.sourceHash,
  approvalStatus: 'not-self-approved',
  preserved: {
    reviewedPriorScopeItems: 631,
    appliedEnglishRepairs: 15,
    frozen774to787Undated: true,
    narrativeBoundsHoldsLeftUntouchedExceptClaim213: true,
  },
  applied: {
    claimChanges: changes.length,
    hintChanges: hintChanges.length,
    plan,
    frozenStatus,
    unsupportedHintsCleared: Object.keys(hintTargets),
  },
  leftAsSpecificHolds: {
    note: 'Grouped narrative/calendar holds outside this scoped set remain for independent conversion; not broadly cleared.',
    examples: [
      'claim-277 narrative bounds on p038 attestation',
      'claim-212 supported-relative-undated sortie',
      'claim-61 / Yonghe spine conversion cluster',
      'claim-678 / claim-771 off-chapter Western outside the seven hint persons',
    ],
  },
  claim213UnitDecision: {
    independentSuggested: 's0071',
    applied: 's0076',
    reason: 'Seal delivery Chinese is only on s0076; s0071 is the sortie already evidenced on claim-212.',
  },
};

writeJsonAtomic('research/people/jinshu110-owner-handoff-apply-receipt-20261124.json', receipt);
writeJsonAtomic('research/people/jinshu110-owner-dependency-manifest-20261124.json', {
  schemaVersion: 1,
  kind: 'owner-dependency-manifest',
  book,
  chapter,
  candidatePullRequest: 5462,
  evidencePullRequest: 5465,
  handoffCommit: '05ba840300b9e70ccf3c740bf3a5cb00b067008e',
  handoffPath: 'research/people/jinshu110-independent-owner-handoff-20261124.json',
  ownerReceipt: 'research/people/jinshu110-owner-handoff-apply-receipt-20261124.json',
  priorOwnerReceipt: 'research/people/jinshu110-owner-dependency-receipt-20261123.json',
  scopedTargets: {
    concreteDefects: ['claim-137', 'claim-213'],
    unsupportedHintSpans: [
      'hints-p003',
      'hints-p140',
      'hints-p142',
      'hints-p143',
      'hints-p161',
      'hints-p169',
      'hints-p170',
    ],
    frozenExemplars: FROZEN.map((n) => `claim-${n}`),
  },
  doNot: [
    'self-approve date-audits/jinshu/110.json',
    'broad calendar conversion rerun',
    'merge',
    'edit unrelated chapters 023/031/047/081',
  ],
});

console.log(JSON.stringify({
  claimChanges: changes.length,
  hintChanges: hintChanges.length,
  afterExtractionHash: afterPacket.extractionHash,
  frozenOk: frozenStatus.length,
}, null, 2));
console.log('PASS');
