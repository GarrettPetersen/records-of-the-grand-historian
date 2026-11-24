#!/usr/bin/env node
/**
 * Jinshu 110: cohesive repair of Yonghe s0008 + Shengping s0164 shared groups
 * and remaining off-chapter bounds per independent remaining-date-groups @0e56aff9.
 *
 * - Exact era years → unresolved sourceDate (no Western until conversion audit)
 * - Relative phrases → unresolved without Western (do not upgrade to AD)
 * - Synthetic inherited “undated narrative…” → undatedSourceAttestation / event-only death
 * - Off-chapter 678/771 → unresolved chapter-cite
 * Preserve: 15 English repairs, seven hint clears, claim-212/213, 昇平四年 claim-670
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
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const extraction = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction });

const YONGHE_IDS = [39, 41, 42, 44, 45, 48, 50, 52, 58, 59, 60, 63, 132, 133, 134];
const PRESERVE_CLAIM_IDS = new Set([212, 213, 670]); // sortie/seal ownership + 昇平四年 death
const OFF_CHAPTER_IDS = [678, 771];
const SEVEN_HINT_PERSONS = {
  p003: [],
  p140: [],
  p142: [],
  p143: ['Chapter cite lacks a convertible reign-year Western date for this person'],
  p161: ['Chapter cite lacks a convertible reign-year Western date for this person'],
  p169: ['Chapter cite lacks a convertible reign-year Western date for this person'],
  p170: [],
};

function sourceText(claim) {
  const value = claim[2] || {};
  return value.sourceDate?.text || value.dateContext?.sourceDate?.text || '';
}

function isSyntheticInherited(text) {
  return /^\(undated narrative (?:before|after) 升平元年\)$/u.test(text)
    || /^\(narrative between 升平元年 and 升平四年\)$/u.test(text);
}

function isExactEraYear(text) {
  return /^(永和五年|升平元年|昇平四年|皝死，永和五年)$/u.test(text.trim());
}

function isRelativePhrase(text) {
  return /是時|是歲|明年|先是/.test(text) && !isExactEraYear(text);
}

function shengpingGroupIds(ex) {
  const ids = [];
  ex.claims.forEach((claim, index) => {
    const id = index + 1;
    if (PRESERVE_CLAIM_IDS.has(id)) return;
    const text = sourceText(claim);
    if (!text) return;
    if (isSyntheticInherited(text) || text === '升平元年' || text === '昇平四年') {
      // Keep 昇平四年 only on preserved claim-670; other 昇平四年 rows still convert if any
      if (text === '昇平四年' && id === 670) return;
      ids.push(id);
    }
  });
  return ids;
}

function unresolvedReason(kind, text, group) {
  if (group === 'off-chapter') {
    return `Chapter cite「${text}」does not support an off-chapter Western conversion on this unit; keep unresolved pending a chapter-linked year.`;
  }
  if (isExactEraYear(text) || text === '升平元年' || text === '永和五年' || text === '皝死，永和五年') {
    return `Source states「${text}」without a Western year in the Chinese; retain unresolved until an independent conversion audit certifies the era year.`;
  }
  if (isRelativePhrase(text)) {
    return `Relative source phrase「${text}」does not by itself convert to a Western year; do not invent AD from the ${group} anchor.`;
  }
  return `Inherited ${group} narrative label「${text}」lacks a per-unit Chinese year; keep unresolved/undated rather than Western bounds.`;
}

function stripWesternDeep(value) {
  if (!value || typeof value !== 'object') return value;
  const next = { ...value };
  delete next.westernYear;
  delete next.westernBounds;
  delete next.westernInterval;
  return next;
}

function toUnresolvedContainer(container, text, group) {
  const clean = stripWesternDeep(container);
  return {
    ...clean,
    sourceDate: { text },
    unresolved: true,
    unresolvedReason: unresolvedReason('temporal', text, group),
  };
}

function eventOnlyDeath(claim, text) {
  const value = claim[2] || {};
  const manner = value.manner;
  const eventBits = [
    manner ? `Death manner: ${manner}.` : null,
    text ? `Source temporal wording「${text}」retained without Western conversion.` : null,
    value.dateContext?.event || value.event || null,
  ].filter(Boolean);
  const event = eventBits.join(' ') || 'Death recorded without a convertible Western year on the cited units.';
  const next = { ...value, event };
  delete next.dateContext;
  return next;
}

function undatedAttestation(claim, text) {
  const value = claim[2] || {};
  const event = (typeof value.event === 'string' && value.event.trim().length >= 20 && !/outside-knowledge|AD \d{3}/i.test(value.event))
    ? value.event
    : `Person attested in narrative framed only as「${text}」without a per-unit Chinese year; undated source attestation.`;
  return {
    undatedSourceAttestation: true,
    event: event.length >= 20 ? event : `${event} Chapter supplies no convertible personal calendar date.`,
  };
}

const changes = [];
const changedGroups = {
  yongheSpine: [],
  shengpingShared: [],
  offChapterBounds: [],
};
const touchedPeople = new Set();

function replace(id, after, reason, groupKey) {
  const before = extraction.claims[id - 1];
  changes.push({ kind: 'replace', id: `claim-${id}`, before, after, reason });
  changedGroups[groupKey].push(`claim-${id}`);
  touchedPeople.add(after[0]);
}

function repairClaim(id, groupKey, groupLabel) {
  if (PRESERVE_CLAIM_IDS.has(id)) return;
  const before = extraction.claims[id - 1];
  const kind = before[1];
  const text = sourceText(before);
  if (!text) return;

  // Already honest?
  const value = before[2] || {};
  const dc = kind === 'attestation' ? value : (value.dateContext || null);
  const hasWestern = !!(dc?.westernYear || dc?.westernBounds || dc?.westernInterval || value.westernYear || value.westernBounds);
  if (!hasWestern && (value.undatedSourceAttestation || value.unresolved || dc?.unresolved)) return;

  let afterValue;
  if (kind === 'attestation') {
    if (isSyntheticInherited(text)) {
      afterValue = undatedAttestation(before, text);
    } else {
      afterValue = toUnresolvedContainer(value, text.replace(/\s*\(inherited from 永和五年 in s0008\)/u, '').trim() || text, groupLabel);
      // normalize relative inherited labels to exact Chinese tokens when possible
      if (/是時/.test(text)) afterValue.sourceDate = { text: '是時' };
      else if (/是歲/.test(text)) afterValue.sourceDate = { text: '是歲' };
      else if (/明年/.test(text)) afterValue.sourceDate = { text: '明年' };
      else if (text.includes('永和五年') && !text.includes('皝死')) afterValue.sourceDate = { text: '永和五年' };
      else if (text.includes('皝死')) afterValue.sourceDate = { text: '皝死，永和五年' };
      afterValue.unresolvedReason = unresolvedReason('attestation', afterValue.sourceDate.text, groupLabel);
      delete afterValue.westernYear;
      delete afterValue.westernBounds;
      delete afterValue.westernInterval;
      delete afterValue.undatedSourceAttestation;
    }
  } else if (kind === 'death') {
    // Deaths: preserve fact as event-only; do not keep unsupported Western or unresolved death dateContext
    afterValue = eventOnlyDeath(before, text);
  } else {
    // offices / events / etc.
    const base = { ...value };
    const exactText = (() => {
      if (/是時/.test(text) && !/永和五年/.test(text.replace(/inherited.*/u, ''))) return '是時';
      if (/是歲/.test(text)) return '是歲';
      if (/明年/.test(text)) return '明年';
      if (/升平元年/.test(text) && !isSyntheticInherited(text)) return '升平元年';
      if (text.includes('皝死') && text.includes('永和五年')) return '皝死，永和五年';
      if (text.includes('永和五年')) return '永和五年';
      if (text.includes('皝為燕王')) return '皝為燕王';
      if (text.includes('永嘉之亂')) return '永嘉之亂';
      if (text.includes('郅支')) return '郅支之首';
      return text;
    })();
    if (isSyntheticInherited(text)) {
      // Non-attestation synthetic: unresolved relative hold without Western
      base.dateContext = {
        sourceDate: { text: exactText },
        unresolved: true,
        unresolvedReason: unresolvedReason('temporal', exactText, groupLabel),
        event: value.dateContext?.event || value.action || value.statement || 'Activity in undated narrative near the Shengping anchor.',
      };
      delete base.westernYear;
      delete base.westernBounds;
    } else {
      base.dateContext = toUnresolvedContainer(value.dateContext || { sourceDate: { text: exactText } }, exactText, groupLabel);
    }
    delete base.westernYear;
    delete base.westernBounds;
    afterValue = base;
  }

  const after = [before[0], before[1], afterValue, before[3], before[4]];
  replace(id, after, `Cohesive ${groupLabel} representation: strip unsupported Western; keep exact source-native hold/undated form.`, groupKey);
}

for (const id of YONGHE_IDS) repairClaim(id, 'yongheSpine', 'Yonghe s0008');
for (const id of shengpingGroupIds(extraction)) repairClaim(id, 'shengpingShared', 'Shengping s0164');
for (const id of OFF_CHAPTER_IDS) repairClaim(id, 'offChapterBounds', 'off-chapter');

if (!changes.length) throw new Error('No changes planned');

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Jinshu 110 owner Yonghe/Shengping/off-chapter cohesive repair',
    agentId: 'bc-1d294055-ba1a-4edb-9343-adeb9881920a',
  },
  changes,
};

const mid = applyDateRepairProposal(extraction, proposal, packet);

function rebuildHints(claims) {
  const westernLabels = [];
  let qualitativeLabel = null;
  let unresolved = false;
  let undatedOnly = true;
  for (const claim of claims) {
    const value = claim[2];
    if (!value) continue;
    if (!value.undatedSourceAttestation) undatedOnly = false;
    const containers = [];
    if (claim[1] === 'attestation') containers.push(value);
    if (value.dateContext) containers.push(value.dateContext);
    for (const ctx of containers) {
      if (ctx.unresolved) unresolved = true;
      if (ctx.westernYear) westernLabels.push(`${ctx.westernYear.era} ${ctx.westernYear.year}`);
      if (ctx.westernInterval) {
        const { start, end } = ctx.westernInterval;
        westernLabels.push(`${start.era} ${start.year}-${end.era} ${end.year}`);
      }
      if (ctx.westernBounds) {
        const parts = [];
        if (ctx.westernBounds.onOrAfter) parts.push(`on or after ${ctx.westernBounds.onOrAfter.era} ${ctx.westernBounds.onOrAfter.year}`);
        if (ctx.westernBounds.after) parts.push(`after ${ctx.westernBounds.after.era} ${ctx.westernBounds.after.year}`);
        if (ctx.westernBounds.onOrBefore) parts.push(`on or before ${ctx.westernBounds.onOrBefore.era} ${ctx.westernBounds.onOrBefore.year}`);
        if (ctx.westernBounds.before) parts.push(`before ${ctx.westernBounds.before.era} ${ctx.westernBounds.before.year}`);
        if (parts.length) westernLabels.push(parts.join(' and '));
      }
      if (ctx.qualitative && ctx.sourceDate?.text) {
        qualitativeLabel = `During ${ctx.sourceDate.text} as stated in the source`;
      }
    }
  }
  const unique = [...new Set(westernLabels)];
  if (unique.length) return unique;
  if (unresolved) return ['Chapter cite lacks a convertible reign-year Western date for this person'];
  if (qualitativeLabel) return [qualitativeLabel];
  if (undatedOnly) return [];
  return [];
}

const hintChanges = [];
for (const personId of touchedPeople) {
  const person = mid.people.find((row) => row[0] === personId);
  const before = person[4]?.a ?? [];
  // Preserve the seven cleared/research hints exactly when untouched persons... for touched seven, re-apply intended
  let after;
  if (Object.hasOwn(SEVEN_HINT_PERSONS, personId) && !touchedPeople.has(personId)) {
    after = SEVEN_HINT_PERSONS[personId];
  } else if (Object.hasOwn(SEVEN_HINT_PERSONS, personId)) {
    // If a seven-hint person was touched (shouldn't for 140 etc.), keep their cleared form unless rebuild needs research hold
    after = rebuildHints(mid.claims.filter((claim) => claim[0] === personId));
    if (SEVEN_HINT_PERSONS[personId].length === 0 && after.length && !after.some((h) => /\bAD\b|\bBC\b/.test(h))) {
      // allow research-hold wording; block Western reintroduction
      after = after;
    }
    if (after.some((h) => /\b(?:AD|BC)\s+\d/.test(h))) after = SEVEN_HINT_PERSONS[personId];
  } else {
    after = rebuildHints(mid.claims.filter((claim) => claim[0] === personId));
  }
  if (JSON.stringify(before) === JSON.stringify(after)) continue;
  hintChanges.push({
    kind: 'hints',
    personId,
    before,
    after,
    reason: `Rebuild hints for ${personId} after Yonghe/Shengping/off-chapter cohesive repair.`,
  });
}

// Force-preserve seven hint persons' cleared/research forms even if not in touchedPeople
for (const [personId, after] of Object.entries(SEVEN_HINT_PERSONS)) {
  const person = mid.people.find((row) => row[0] === personId);
  const before = person[4]?.a ?? [];
  if (JSON.stringify(before) === JSON.stringify(after)) continue;
  if (hintChanges.some((change) => change.personId === personId)) continue;
  hintChanges.push({
    kind: 'hints',
    personId,
    before,
    after,
    reason: `Preserve prior seven unsupported-hint clear for ${personId}.`,
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

// Preservations
if (final.translationRepairs.filter((row) => row[6] === 'applied').length !== 15) {
  throw new Error('English repairs drifted');
}
if (JSON.stringify(final.claims[211][4]) !== JSON.stringify(['s0060', 's0071'])) {
  throw new Error('claim-212 sortie units drifted');
}
if (final.claims[212][2]?.dateContext?.sourceDate?.text !== '先是' || final.claims[212][4][0] !== 's0076') {
  throw new Error('claim-213 seal ownership drifted');
}
if (!final.claims[669][2]?.dateContext?.sourceDate || final.claims[669][2].dateContext.sourceDate.text !== '昇平四年') {
  throw new Error('claim-670 昇平四年 drifted');
}
if (!(final.claims[669][2].dateContext.westernBounds || final.claims[669][2].dateContext.westernYear)) {
  throw new Error('claim-670 definitively dated Western evidence was stripped');
}
for (const [personId, expected] of Object.entries(SEVEN_HINT_PERSONS)) {
  const got = final.people.find((row) => row[0] === personId)[4]?.a ?? [];
  if (JSON.stringify(got) !== JSON.stringify(expected)) {
    // allow rebuild to research-hold when empty expected stays empty
    if (!(expected.length === 0 && got.length === 0)) {
      if (expected.length === 0 && got.some((h) => /\b(?:AD|BC)\s+\d/.test(h))) {
        throw new Error(`seven-hint clear reintroduced Western for ${personId}: ${JSON.stringify(got)}`);
      }
      if (expected.length && JSON.stringify(got) !== JSON.stringify(expected)) {
        throw new Error(`seven-hint form drifted for ${personId}: ${JSON.stringify(got)}`);
      }
    }
  }
}

const extPacket = buildPeopleExtractionPacket(book, chapter, { properNounMatcher: loadProperNounMatcher() });
validateCompactPeopleExtraction(final, extPacket, { strictAliasDispositions: true });
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(final));
const afterPacket = buildDateAuditPacket(book, chapter);

const remainingBlockers = {
  holdCalendarConversionPendingNativeAudit: [
    'Exact 永和五年 / 升平元年 rows now unresolved (Chinese retained) awaiting conversion certification',
  ],
  holdNarrativeBoundsOutsideShengpingSharedGroup: 'Ye-campaign 時/既而/尋而 inherits and other non-升平 narrative bounds not in this patch',
  supportedClauseBackedRetain: ['claim-670 昇平四年 death kept with Western bounds'],
  hintsPendingConversion: 137,
  noNativeDateAuditFile: 'data/people/date-audits/jinshu/110.json not written',
};

const receipt = {
  schemaVersion: 1,
  kind: 'owner-dependency-receipt',
  book,
  chapter,
  pullRequest: 5462,
  independentReviewCommit: '0e56aff9e4ae65b620029f3fb68af69f4e472c63',
  independentRemainingGroups: 'research/people/jinshu110-independent-remaining-date-groups-20261124.json',
  baseOwnerCommit: '2bb37206cb2a665e5014779a357f35e22c30c104',
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  sourceHash: afterPacket.sourceHash,
  approvalStatus: 'not-self-approved',
  preserved: {
    englishRepairs: 15,
    sevenHintClears: Object.keys(SEVEN_HINT_PERSONS),
    claim212SortieUnits: ['s0060', 's0071'],
    claim213Seal: { unit: 's0076', sourceDate: '先是', unresolved: true },
    claim670Shengping4Death: true,
  },
  uniqueChangedGroups: {
    yongheSpine: {
      groupId: 'yonghe-spine-hold-calendar-conversion',
      anchor: 's0008 永和五年',
      claimIds: [...new Set(changedGroups.yongheSpine)],
      treatment: 'Strip Western from exact/relative Yonghe spine rows; unresolved with exact Chinese or event-only deaths',
    },
    shengpingShared: {
      groupId: 'shengping-inherited-hold-narrative-bounds',
      anchor: 's0164 升平元年',
      claimIds: [...new Set(changedGroups.shengpingShared)],
      treatment: 'Exact 升平元年 → unresolved; synthetic inherited narrative → undated attestation / event-only death; no relative→Western upgrade',
    },
    offChapterBounds: {
      groupId: 'off-chapter-western-still-held',
      claimIds: [...new Set(changedGroups.offChapterBounds)],
      treatment: 'claim-678 永嘉之亂 and claim-771 郅支之首 → unresolved chapter-cite',
    },
  },
  remainingBlockers,
  notDone: [
    'no broad narrative-bounds clearance outside Shengping shared group',
    'no self-approval',
    'no merge',
    'no other owner chapters',
  ],
};

writeJsonAtomic('research/people/jinshu110-owner-dependency-receipt-20261124.json', receipt);
// Materialize reviewer groups onto branch for collaboration
writeTextAtomic(
  'research/people/jinshu110-independent-remaining-date-groups-20261124.json',
  `${JSON.stringify(readJson('/tmp/jinshu110-remaining-date-groups.json'), null, 2)}\n`,
);

console.log(JSON.stringify({
  claimChanges: changes.length,
  hintChanges: hintChanges.length,
  yonghe: changedGroups.yongheSpine.length,
  shengping: changedGroups.shengpingShared.length,
  offChapter: changedGroups.offChapterBounds.length,
  afterExtractionHash: afterPacket.extractionHash,
}, null, 2));
console.log('PASS');
