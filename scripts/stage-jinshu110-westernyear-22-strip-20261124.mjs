#!/usr/bin/env node
/**
 * Jinshu 110 owner apply: strip the 22 inherited westernYear AD 349/350 flags
 * flagged in research/people/jinshu110-native-chronology-coverage-receipt-20261124.json
 * (independent evidence f5602490f491e7c6fc23ce7e962f308ece6057f6) at tip 3f98645596.
 *
 * Especially the 13 hold-family contradictions; also align the 9 supported-leak
 * rows to source-native unresolved / event-only death (undated-valid). Preserve
 * the 631 inventory, claim-670, English, unrelated rows. No self-approval/merge.
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
const coverage = readJson('research/people/jinshu110-native-chronology-coverage-receipt-20261124.json');
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const extraction = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (packet.extractionHash !== coverage.provenance.ownerExtractionHash) {
  throw new Error(`extractionHash drift vs coverage receipt`);
}
if (coverage.ownerTipCommit !== '3f986455966bd966adaac92d2631cc5147f7cbd9') {
  throw new Error(`unexpected coverage owner tip ${coverage.ownerTipCommit}`);
}

const CONTRADICTION_IDS = coverage.holdFamilySubstantiveContradictions.claimIds.map((id) =>
  Number(id.replace('claim-', '')),
);
const LEAK_IDS = coverage.preservedSupportedWesternYearLeakNotReAudited.claimIds.map((id) =>
  Number(id.replace('claim-', '')),
);
const ALL_22 = coverage.explicitlyUntouchedBy168Strip.yongheInheritedWesternYear.claimIds.map((id) =>
  Number(id.replace('claim-', '')),
);
if (ALL_22.length !== 22) throw new Error(`expected 22 ids, got ${ALL_22.length}`);
if (CONTRADICTION_IDS.length !== 13) throw new Error('expected 13 contradictions');
if (LEAK_IDS.length !== 9) throw new Error('expected 9 leaks');

const PRESERVE_UNCHANGED = new Set([213, 670]);
const CLAIM_670 = structuredClone(extraction.claims[669]);
const CLAIM_213 = structuredClone(extraction.claims[212]);
const ENGLISH_BEFORE = extraction.translationRepairs.filter((row) => row[6] === 'applied').length;
const unitZh = Object.fromEntries(
  (packet.units || []).map((unit) => [unit.unitId || unit.id, unit.zh || '']),
);

function nativeRelative(claim) {
  const units = claim[4] || [];
  const texts = units.map((id) => unitZh[id] || '');
  if (texts.some((zh) => /是時/.test(zh))) return '是時';
  if (texts.some((zh) => /是歲/.test(zh))) return '是歲';
  if (texts.some((zh) => /明年/.test(zh))) return '明年';
  throw new Error(`no unit-native relative for claim units ${units.join(',')}`);
}

function unresolvedReason(text) {
  return `Relative source phrase「${text}」does not by itself convert to a Western year; do not invent AD from the Yonghe s0008 anchor.`;
}

function stripWesternDeep(value) {
  if (!value || typeof value !== 'object') return value;
  const next = { ...value };
  delete next.westernYear;
  delete next.westernBounds;
  delete next.westernInterval;
  return next;
}

function eventOnlyDeath(claim, text) {
  const value = claim[2] || {};
  const manner = value.manner;
  const eventBits = [
    manner ? `Death manner: ${manner}.` : null,
    text ? `Source temporal wording「${text}」retained without Western conversion.` : null,
  ].filter(Boolean);
  let event = eventBits.join(' ');
  if (!event || event.length < 20) {
    event = `Death recorded under source wording「${text || 'undated'}」without a convertible Western year on the cited units.`;
  }
  const next = { ...value, event };
  delete next.dateContext;
  delete next.westernYear;
  delete next.westernBounds;
  delete next.westernInterval;
  delete next.sourceDate;
  delete next.unresolved;
  delete next.unresolvedReason;
  delete next.undatedSourceAttestation;
  return next;
}

function toUnresolvedAttestation(value, text) {
  const clean = stripWesternDeep(value || {});
  const next = {
    sourceDate: { text },
    unresolved: true,
    unresolvedReason: unresolvedReason(text),
  };
  if (clean.event) next.event = clean.event;
  return next;
}

function toUnresolvedDateContext(value, text) {
  const base = { ...value };
  const dc = stripWesternDeep(base.dateContext || {});
  base.dateContext = {
    ...dc,
    sourceDate: { text },
    unresolved: true,
    unresolvedReason: unresolvedReason(text),
  };
  delete base.dateContext.westernYear;
  delete base.dateContext.westernBounds;
  delete base.dateContext.westernInterval;
  delete base.westernYear;
  delete base.westernBounds;
  delete base.westernInterval;
  delete base.undatedSourceAttestation;
  return base;
}

const changes = [];
const beforeById = {};
const afterById = {};
const contradictionApplied = [];
const leakApplied = [];

for (const id of ALL_22) {
  if (PRESERVE_UNCHANGED.has(id)) throw new Error(`must not touch preserved claim-${id}`);
  const before = extraction.claims[id - 1];
  if (!before) throw new Error(`missing claim-${id}`);
  const value = before[2] || {};
  const hasWestern = !!(
    value.westernYear || value.westernBounds || value.westernInterval
    || value.dateContext?.westernYear || value.dateContext?.westernBounds || value.dateContext?.westernInterval
  );
  if (!hasWestern) throw new Error(`claim-${id} lacks westernYear at tip`);

  const text = nativeRelative(before);
  const kind = before[1];
  let afterValue;
  if (kind === 'death') {
    afterValue = eventOnlyDeath(before, text);
  } else if (kind === 'attestation') {
    afterValue = toUnresolvedAttestation(value, text);
  } else {
    afterValue = toUnresolvedDateContext(value, text);
  }

  const after = [before[0], before[1], afterValue, before[3], before[4]];
  const family = CONTRADICTION_IDS.includes(id) ? 'hold-contradiction' : 'supported-leak';
  changes.push({
    kind: 'replace',
    id: `claim-${id}`,
    before,
    after,
    reason: `Strip inherited westernYear; keep unit-native「${text}」as ${kind === 'death' ? 'event-only death' : 'unresolved Chinese-only'} (${family}).`,
  });
  beforeById[`claim-${id}`] = {
    personId: before[0],
    predicate: before[1],
    value: structuredClone(before[2]),
    units: before[4],
    family,
    nativeSourceDate: text,
  };
  afterById[`claim-${id}`] = {
    personId: after[0],
    predicate: after[1],
    value: structuredClone(after[2]),
    units: after[4],
    family,
    nativeSourceDate: text,
    form: kind === 'death' ? 'event-only-death' : 'sourceDate-unresolved-chinese-only',
  };
  if (family === 'hold-contradiction') contradictionApplied.push(`claim-${id}`);
  else leakApplied.push(`claim-${id}`);
}

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Jinshu 110 owner westernYear-22 strip',
    agentId: 'bc-1d294055-ba1a-4edb-9343-adeb9881920a',
  },
  changes,
};

const final = applyDateRepairProposal(extraction, proposal, packet);

if (JSON.stringify(final.claims[669]) !== JSON.stringify(CLAIM_670)) {
  throw new Error('claim-670 drifted');
}
if (JSON.stringify(final.claims[212]) !== JSON.stringify(CLAIM_213)) {
  throw new Error('claim-213 drifted');
}
const english = final.translationRepairs.filter((row) => row[6] === 'applied').length;
if (english !== ENGLISH_BEFORE || english !== 15) {
  throw new Error(`English drifted: ${english}`);
}

for (let i = 0; i < extraction.claims.length; i += 1) {
  const id = i + 1;
  if (ALL_22.includes(id)) continue;
  if (JSON.stringify(final.claims[i]) !== JSON.stringify(extraction.claims[i])) {
    throw new Error(`untouched claim-${id} changed`);
  }
}
if (JSON.stringify(final.people) !== JSON.stringify(extraction.people)) {
  throw new Error('people rows drifted');
}
if (JSON.stringify(final.translationRepairs) !== JSON.stringify(extraction.translationRepairs)) {
  throw new Error('translationRepairs drifted');
}

for (const id of ALL_22) {
  const value = final.claims[id - 1][2] || {};
  const dc = value.dateContext || {};
  if (value.westernYear || value.westernBounds || value.westernInterval
    || dc.westernYear || dc.westernBounds || dc.westernInterval) {
    throw new Error(`claim-${id} still has Western chronology`);
  }
  if (final.claims[id - 1][1] === 'death') {
    if (!value.event || value.dateContext) throw new Error(`claim-${id} death form invalid`);
  } else if (!(value.unresolved === true || dc.unresolved === true)) {
    throw new Error(`claim-${id} not unresolved after apply`);
  }
}

const remainingWestern = [];
for (let i = 0; i < final.claims.length; i += 1) {
  const value = final.claims[i][2] || {};
  const dc = value.dateContext || {};
  if (value.westernYear || value.westernBounds || value.westernInterval
    || dc.westernYear || dc.westernBounds || dc.westernInterval) {
    remainingWestern.push(`claim-${i + 1}`);
  }
}
if (!remainingWestern.includes('claim-670')) {
  throw new Error('claim-670 Western retention lost');
}

const extPacket = buildPeopleExtractionPacket(book, chapter, {
  properNounMatcher: loadProperNounMatcher(),
});
validateCompactPeopleExtraction(final, extPacket, { strictAliasDispositions: true });
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(final));

const afterPacket = buildDateAuditPacket(book, chapter);

const receipt = {
  schemaVersion: 1,
  kind: 'owner-westernyear-22-strip-receipt',
  book,
  chapter,
  pullRequest: 5462,
  baseOwnerCommit: '3f986455966bd966adaac92d2631cc5147f7cbd9',
  independentCoverageCommit: 'f5602490f491e7c6fc23ce7e962f308ece6057f6',
  independentCoverageReceipt: 'research/people/jinshu110-native-chronology-coverage-receipt-20261124.json',
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  sourceHash: afterPacket.sourceHash,
  approvalStatus: 'not-self-approved',
  inventoryPreserved: {
    ownerPacketItems: 631,
    note: 'Touched only the 22 westernYear claim rows flagged in coverage; no inventory recomputation or unrelated claim edits',
  },
  exactChangedIds: ALL_22.map((id) => `claim-${id}`),
  contradictionIdsApplied: contradictionApplied,
  supportedLeakIdsApplied: leakApplied,
  beforeById,
  afterById,
  preserved: {
    claim670Shengping4WesternBounds: true,
    claim213SealOwnership: true,
    approvedEnglishApplied: english,
    peopleRowsUnchanged: true,
    untouchedClaimCount: extraction.claims.length - ALL_22.length,
  },
  remainingConcreteBlockers: {
    westernChronologyRows: remainingWestern,
    claim670SupportedRetain: 'claim-670',
    conversionPendingNativeAudit: coverage.unresolvedDatesValidDisposition.conversionPendingNativeAudit.claimIds.slice(0, 20).concat(['…']),
    conversionPendingNativeAuditCount: coverage.unresolvedDatesValidDisposition.conversionPendingNativeAudit.count,
    noDateAuditFile: 'data/people/date-audits/jinshu/110.json not written',
    openAuditSealItems: coverage.auditSeal.incompleteCoverage,
  },
  notDone: [
    'no self-approval',
    'no merge',
    'no date-audits/jinshu/110.json',
    'no invent AD for 是時/是歲/明年',
    'no prior-review/certificate edits',
  ],
};

writeJsonAtomic('research/people/jinshu110-owner-westernyear-22-strip-receipt-20261124.json', receipt);

console.log(JSON.stringify({
  changed: ALL_22.length,
  contradictions: contradictionApplied.length,
  leaks: leakApplied.length,
  remainingWestern,
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  english,
}, null, 2));
console.log('PASS');
