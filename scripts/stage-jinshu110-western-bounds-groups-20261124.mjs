#!/usr/bin/env node
/**
 * Jinshu 110: reconcile 169 post-delta unsupported Western-bounds rows
 * pinned in research/people/jinshu110-independent-grouped-owner-check-c5e2f862-20261124.json
 * at 83f3e312.
 *
 * Buckets: Mingnian, Ye-campaign, Yonghe leaks, Zhizhi, accession/及暐立, misc.
 * Preserve: claim-670 Western, claim-212/213 ownership, 15 English repairs, seven hint clears.
 * No native date approval / merge / other chapters.
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
const unitZh = Object.fromEntries(
  (packet.units || []).map((unit) => [unit.unitId || unit.id, unit.zh || unit.chinese || unit.text?.zh || '']),
);

const PRESERVE_UNCHANGED = new Set([213, 670]); // seal ownership; 昇平四年 death Western retain
const SEVEN_HINT_PERSONS = {
  p003: [],
  p140: [],
  p142: [],
  p143: ['Chapter cite lacks a convertible reign-year Western date for this person'],
  p161: ['Chapter cite lacks a convertible reign-year Western date for this person'],
  p169: ['Chapter cite lacks a convertible reign-year Western date for this person'],
  p170: [],
};

const MINGNIAN_IDS = [
  71, 72, 73, 75, 76, 102, 106, 107, 108, 109, 110, 112, 114, 115, 117, 119, 120,
  122, 124, 125, 127, 128, 130, 131, 135, 144, 145, 149, 151, 152, 153, 154, 155,
  156, 157, 158, 159, 160, 161,
];

const YE_IDS = [
  194, 195, 196, 197, 198, 202, 203, 204, 205, 208, 209, 210, 212, 214, 215, 220,
  221, 222, 225, 226, 229, 230, 231, 232, 233, 234, 235, 238, 239, 243, 247, 249,
  251, 252, 253, 255, 256, 257, 258, 260, 262, 263, 264, 265, 266, 267, 269, 270,
  271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286,
  287, 288, 289, 290, 291, 292, 293, 294, 316, 317, 318, 319, 320, 321, 322, 323,
  324, 325, 328, 329, 330, 331, 332, 333, 334, 344, 345, 346, 347, 348, 349, 350,
  355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370,
];

const YONGHE_LEAK_IDS = [98, 136, 162, 163];
const ZHIZHI_IDS = [501];
const ACCESSION_WEI_IDS = [757, 758, 759, 769, 770]; // 及暐立 inherit from 昇平四年
const MISC_IDS = [228, 681, 683, 689, 690, 692, 693]; // accession Yuanxi / 咸和中 / 俊僭位

const ALL_TARGET = new Set([
  ...MINGNIAN_IDS, ...YE_IDS, ...YONGHE_LEAK_IDS, ...ZHIZHI_IDS, ...ACCESSION_WEI_IDS, ...MISC_IDS,
]);

function sourceText(claim) {
  const value = claim[2] || {};
  return value.sourceDate?.text || value.dateContext?.sourceDate?.text || '';
}

function scrubAd(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/\s*\(undated narrative continuing after AD 350\)/gu, '')
    .replace(/\s*\(narrative after 明年, 永和五年\+1\)/gu, '')
    .replace(/\s*\(era Yuanxi begun; year not converted here\)/gu, '')
    .replace(/\s*\(the year before Chang Wei's mission\)/gu, '')
    .replace(/\s*\(year before Chang Wei's mission\)/gu, '')
    .replace(/After Murong Jun claimed the imperial title \([^)]*AD 350\)\.?/gu,
      'After Murong Jun claimed the imperial title (俊僭位 / Yuanxi era onward).')
    .replace(/Murong Wei succeeded on Murong Jun's death in Shengping 4 \(AD 360\), per the preceding chunk\./gu,
      'Murong Wei’s accession as stated by 及暐立 on the cited unit.')
    .replace(/Xianhe era = AD 326–334\./gu, 'Xianhe-era mid-period as stated in the source.')
    .replace(/Chanyu Zhizhi was killed BC 36\./gu, 'Speech allusion to Zhizhi’s head; chapter cite supplies no convertible year.')
    .replace(/Inherited narrative after the AD 350[^.]*\./gu, '')
    .replace(/Narrative sequence after the AD 350 campaign;?[^.]*\./gu, '')
    .replace(/after AD 350[^.]*\./gu, '')
    .replace(/\bAD\s+\d{3,4}\b/gu, '')
    .replace(/\bBC\s+\d{1,4}\b/gu, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\(\s*\)/g, '')
    .replace(/,\s*\./g, '.')
    .replace(/\.\s*\./g, '.')
    .trim();
}

function relativeFromUnits(unitIds) {
  const patterns = [
    [/明年/u, '明年'],
    [/是歲/u, '是歲'],
    [/是時/u, '是時'],
    [/去歲/u, '去歲'],
    [/既而/u, '既而'],
    [/尋而/u, '尋而'],
    [/於是/u, '於是'],
    [/^時/u, '時'],
    [/初/u, '初'],
    [/及冉閔殺石祗/u, '及冉閔殺石祗'],
    [/及暐立/u, '及暐立'],
    [/建元曰元璽/u, '建元曰元璽'],
    [/咸和中/u, '咸和中'],
    [/俊僭位|僭即皇帝位/u, '俊僭位'],
    [/永和五年/u, '永和五年'],
    [/皝死，永和五年/u, '皝死，永和五年'],
    [/郅支之首/u, '郅支之首'],
  ];
  for (const unitId of unitIds || []) {
    const zh = unitZh[unitId] || '';
    for (const [re, label] of patterns) {
      if (re.test(zh)) return label;
    }
  }
  return null;
}

function nativeSourceDate(claim, bucket) {
  const units = claim[4] || [];
  const fromUnit = relativeFromUnits(units);
  const raw = sourceText(claim);
  if (bucket === 'mingnian') {
    // Only accept phrases actually present on a cited unit — never keep the
    // synthetic「narrative after 明年」gloss as if it were unit-native.
    if (fromUnit) return fromUnit;
    return null;
  }
  if (bucket === 'ye') {
    if (fromUnit) return fromUnit;
    if (/^初\/至此/.test(raw)) return '初';
    if (/^時\/既而\/尋而/.test(raw)) return '時';
    return scrubAd(raw).split('/')[0].trim() || '時';
  }
  if (bucket === 'yonghe-leak') {
    if (/皝死|永和五年/.test(raw) || fromUnit === '永和五年' || units.includes('s0008')) {
      return '皝死，永和五年';
    }
    return '去歲';
  }
  if (bucket === 'zhizhi') return '郅支之首';
  if (bucket === 'accession-wei') return '及暐立';
  if (bucket === 'misc') {
    if (fromUnit) return fromUnit;
    if (/建元曰元璽|元璽/.test(raw)) return '建元曰元璽';
    if (/咸和中/.test(raw)) return '咸和中';
    if (/俊僭位/.test(raw)) return '俊僭位';
    return scrubAd(raw) || raw;
  }
  return scrubAd(raw) || raw;
}

function unresolvedReason(text, bucket) {
  if (bucket === 'zhizhi') {
    return `Chapter cite「${text}」is a speech allusion without a chapter-linked Western year; keep unresolved rather than importing BC 36.`;
  }
  if (bucket === 'misc' && text === '咸和中') {
    return `Source states「咸和中」without a convertible Western endpoint on the cited units; retain unresolved until an independent conversion audit.`;
  }
  if (bucket === 'misc' && text === '建元曰元璽') {
    return `Source states「建元曰元璽」without a Western year on the cited unit; retain unresolved pending native conversion audit (do not inherit AD 350).`;
  }
  if (bucket === 'yonghe-leak' && /永和五年/.test(text)) {
    return `Source states「${text}」without a Western year in the Chinese; retain unresolved until an independent conversion audit certifies the era year.`;
  }
  if (bucket === 'yonghe-leak' && text === '去歲') {
    return `Relative source phrase「去歲」does not by itself convert to a Western year; do not invent AD from the Yonghe spine.`;
  }
  if (bucket === 'accession-wei') {
    return `Relative accession phrase「及暐立」does not warrant inheriting 昇平四年 / AD 360 Western bounds from claim-670’s death unit.`;
  }
  if (bucket === 'mingnian') {
    return `Narrative / relative wording「${text}」on the cited unit does not warrant synthetic AD 350; keep source-native form unresolved until a conversion audit or an explicit reign year on this unit.`;
  }
  if (bucket === 'ye') {
    return `Ye-campaign relative / undated narrative「${text}」lacks a Chinese reign year on the cited units; do not inherit AD 350.`;
  }
  return `Source-native temporal wording「${text}」does not warrant the inherited Western bounds; keep unresolved without synthetic AD/BC endpoints.`;
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
  const priorEvent = scrubAd(value.dateContext?.event || value.event || '');
  const eventBits = [
    manner ? `Death manner: ${manner}.` : null,
    text ? `Source temporal wording「${text}」retained without Western conversion.` : null,
    priorEvent && priorEvent.length >= 12 ? priorEvent : null,
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

function undatedAttestation(claim, text) {
  const value = claim[2] || {};
  let event = scrubAd(value.event || '');
  if (!event || event.length < 20 || /outside-knowledge/i.test(event)) {
    event = `Person attested in Ye-campaign / inherited narrative framed only as「${text}」without a per-unit Chinese year; undated source attestation.`;
  }
  if (event.length < 20) event = `${event} Chapter supplies no convertible personal calendar date.`;
  return { undatedSourceAttestation: true, event };
}

function toUnresolvedContainer(container, text, bucket) {
  const clean = stripWesternDeep(container || {});
  const event = scrubAd(clean.event);
  const next = {
    ...clean,
    sourceDate: { text },
    unresolved: true,
    unresolvedReason: unresolvedReason(text, bucket),
  };
  if (event) next.event = event;
  else delete next.event;
  delete next.westernYear;
  delete next.westernBounds;
  delete next.westernInterval;
  delete next.undatedSourceAttestation;
  return next;
}

const changes = [];
const changedGroups = {
  mingnianYongheSyntheticAd350: [],
  yeCampaignAd350Inherit: [],
  yongheSpineLeakWestern: [],
  zhizhiOffChapterDeathLeak: [],
  weiLiShengping4Inherit: [],
  miscWesternSeven: [],
};
const touchedPeople = new Set();

function replace(id, after, reason, groupKey) {
  const before = extraction.claims[id - 1];
  changes.push({ kind: 'replace', id: `claim-${id}`, before, after, reason });
  changedGroups[groupKey].push(`claim-${id}`);
  touchedPeople.add(after[0]);
}

function repairClaim(id, bucket, groupKey) {
  if (PRESERVE_UNCHANGED.has(id)) return;
  const before = extraction.claims[id - 1];
  if (!before) throw new Error(`Missing claim-${id}`);
  const kind = before[1];
  const value = before[2] || {};
  const text = nativeSourceDate(before, bucket);
  const hasWestern = !!(
    value.westernYear || value.westernBounds || value.westernInterval
    || value.dateContext?.westernYear || value.dateContext?.westernBounds || value.dateContext?.westernInterval
  );
  // Skip only if already honest and no Western
  if (!hasWestern && (value.undatedSourceAttestation || value.unresolved || value.dateContext?.unresolved)) {
    return;
  }

  let afterValue;
  const label = text || scrubAd(sourceText(before)).replace(/\/.*/, '').trim() || 'undated narrative';
  if (kind === 'attestation') {
    // No unit-native year/relative → undated. Exact/relative Chinese on unit → unresolved hold.
    const synthetic = /undated narrative continuing after AD 350|narrative after 明年/.test(sourceText(before));
    if (!text || synthetic && bucket === 'ye' || bucket === 'mingnian' && !text) {
      afterValue = undatedAttestation(before, label);
    } else if (bucket === 'ye' && !/永和|升平|咸和|建元|去歲|明年|是歲|是時|既而|尋而|初/.test(text)) {
      afterValue = undatedAttestation(before, label);
    } else {
      afterValue = toUnresolvedContainer(value, text, bucket);
      delete afterValue.dateContext;
    }
  } else if (kind === 'death') {
    afterValue = eventOnlyDeath(before, label);
  } else if (!text && (bucket === 'mingnian' || bucket === 'ye')) {
    // Non-attestation, no unit-native temporal token: drop inherited dating rather than invent AD or a fake hold.
    const base = { ...value };
    delete base.dateContext;
    delete base.westernYear;
    delete base.westernBounds;
    delete base.westernInterval;
    afterValue = base;
  } else {
    const base = { ...value };
    base.dateContext = toUnresolvedContainer(value.dateContext || { sourceDate: { text: label } }, label, bucket);
    delete base.westernYear;
    delete base.westernBounds;
    delete base.westernInterval;
    afterValue = base;
  }

  const after = [before[0], before[1], afterValue, before[3], before[4]];
  replace(
    id,
    after,
    `Grounded ${bucket} reconciliation: strip unsupported Western; keep source-native ${text} without synthetic AD/BC.`,
    groupKey,
  );
}

for (const id of MINGNIAN_IDS) repairClaim(id, 'mingnian', 'mingnianYongheSyntheticAd350');
for (const id of YE_IDS) repairClaim(id, 'ye', 'yeCampaignAd350Inherit');
for (const id of YONGHE_LEAK_IDS) repairClaim(id, 'yonghe-leak', 'yongheSpineLeakWestern');
for (const id of ZHIZHI_IDS) repairClaim(id, 'zhizhi', 'zhizhiOffChapterDeathLeak');
for (const id of ACCESSION_WEI_IDS) repairClaim(id, 'accession-wei', 'weiLiShengping4Inherit');
for (const id of MISC_IDS) repairClaim(id, 'misc', 'miscWesternSeven');

if (!changes.length) throw new Error('No changes planned');
if (changes.some((change) => PRESERVE_UNCHANGED.has(Number(change.id.replace('claim-', ''))))) {
  throw new Error('Preserved claim was modified');
}

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Jinshu 110 owner Western-bounds grouped reconciliation',
    agentId: 'bc-1d294055-ba1a-4edb-9343-adeb9881920a',
  },
  changes,
};

const mid = applyDateRepairProposal(extraction, proposal, packet);

function rebuildHints(claims) {
  const westernLabels = [];
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
    }
  }
  const unique = [...new Set(westernLabels)];
  if (unique.length) return unique;
  if (unresolved) return ['Chapter cite lacks a convertible reign-year Western date for this person'];
  if (undatedOnly) return [];
  return [];
}

const hintChanges = [];
for (const personId of touchedPeople) {
  const person = mid.people.find((row) => row[0] === personId);
  const before = person[4]?.a ?? [];
  let after = rebuildHints(mid.claims.filter((claim) => claim[0] === personId));
  if (Object.hasOwn(SEVEN_HINT_PERSONS, personId)) {
    if (after.some((hint) => /\b(?:AD|BC)\s+\d/.test(hint))) after = SEVEN_HINT_PERSONS[personId];
    else if (SEVEN_HINT_PERSONS[personId].length === 0 && after.some((hint) => /\b(?:AD|BC)\s+\d/.test(hint))) {
      after = [];
    } else if (SEVEN_HINT_PERSONS[personId].length === 0) {
      // keep cleared empty unless rebuild introduced Western (handled above)
      after = after.some((hint) => /\b(?:AD|BC)\s+\d/.test(hint)) ? [] : after;
      // Prefer preserving empty clear when rebuild only adds research-hold from unrelated claims
      if (SEVEN_HINT_PERSONS[personId].length === 0 && before.length === 0) after = [];
    }
  }
  if (JSON.stringify(before) === JSON.stringify(after)) continue;
  hintChanges.push({
    kind: 'hints',
    personId,
    before,
    after,
    reason: `Rebuild hints for ${personId} after Western-bounds grouped reconciliation.`,
  });
}

for (const [personId, after] of Object.entries(SEVEN_HINT_PERSONS)) {
  const person = mid.people.find((row) => row[0] === personId);
  const before = person[4]?.a ?? [];
  if (JSON.stringify(before) === JSON.stringify(after)) continue;
  if (hintChanges.some((change) => change.personId === personId)) {
    const idx = hintChanges.findIndex((change) => change.personId === personId);
    if (after.some((hint) => /\b(?:AD|BC)\s+\d/.test(hint)) === false && after.length === 0) {
      hintChanges[idx].after = after;
      hintChanges[idx].reason = `Preserve prior seven unsupported-hint clear for ${personId}.`;
    }
    continue;
  }
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
if (final.claims[212][2]?.dateContext?.unresolved !== true) {
  throw new Error('claim-213 unresolved seal drifted');
}
if (final.claims[669][2]?.dateContext?.sourceDate?.text !== '昇平四年') {
  throw new Error('claim-670 昇平四年 drifted');
}
if (!(final.claims[669][2].dateContext.westernBounds || final.claims[669][2].dateContext.westernYear)) {
  throw new Error('claim-670 definitively dated Western evidence was stripped');
}
for (const [personId, expected] of Object.entries(SEVEN_HINT_PERSONS)) {
  const got = final.people.find((row) => row[0] === personId)[4]?.a ?? [];
  if (expected.length === 0) {
    if (got.some((hint) => /\b(?:AD|BC)\s+\d/.test(hint))) {
      throw new Error(`seven-hint clear reintroduced Western for ${personId}: ${JSON.stringify(got)}`);
    }
  } else if (JSON.stringify(got) !== JSON.stringify(expected)) {
    throw new Error(`seven-hint form drifted for ${personId}: ${JSON.stringify(got)}`);
  }
}

// No target row may retain Western
for (const id of ALL_TARGET) {
  if (PRESERVE_UNCHANGED.has(id)) continue;
  const value = final.claims[id - 1][2] || {};
  const dc = value.dateContext || {};
  if (value.westernBounds || value.westernInterval || value.westernYear
    || dc.westernBounds || dc.westernInterval || dc.westernYear) {
    throw new Error(`claim-${id} still carries Western bounds after reconciliation`);
  }
}

const extPacket = buildPeopleExtractionPacket(book, chapter, { properNounMatcher: loadProperNounMatcher() });
validateCompactPeopleExtraction(final, extPacket, { strictAliasDispositions: true });
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(final));
const afterPacket = buildDateAuditPacket(book, chapter);

const remainingWestern = [];
final.claims.forEach((claim, index) => {
  const value = claim[2] || {};
  const dc = value.dateContext || {};
  if (value.westernBounds || value.westernInterval || value.westernYear
    || dc.westernBounds || dc.westernInterval || dc.westernYear) {
    remainingWestern.push({
      claimId: `claim-${index + 1}`,
      kind: claim[1],
      sourceDate: value.sourceDate?.text || dc.sourceDate?.text || null,
      western: value.westernBounds || value.westernInterval || value.westernYear
        || dc.westernBounds || dc.westernInterval || dc.westernYear,
    });
  }
});

const receipt = {
  schemaVersion: 1,
  kind: 'owner-dependency-receipt',
  book,
  chapter,
  pullRequest: 5462,
  independentGroupedOwnerCheckCommit: '83f3e31216d62787c2534846b92790799bffd063',
  independentGroupedOwnerCheck: 'research/people/jinshu110-independent-grouped-owner-check-c5e2f862-20261124.json',
  baseOwnerCommit: 'c5e2f862bd7a3f2bf2b112727cece35860811cca',
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
    mingnianYongheSyntheticAd350: {
      bucketId: 'mingnian-yonghe-synthetic-ad350',
      claimIds: [...new Set(changedGroups.mingnianYongheSyntheticAd350)],
      treatment: 'Strip synthetic AD 350; keep unit-native relative/actor phrases unresolved or event-only deaths',
    },
    yeCampaignAd350Inherit: {
      bucketId: 'ye-campaign-ad350-inherit',
      claimIds: [...new Set(changedGroups.yeCampaignAd350Inherit)],
      treatment: 'Strip AD 350 inherit; undated attestations / event-only deaths / relative unresolved without Western',
    },
    yongheSpineLeakWestern: {
      bucketId: 'yonghe-spine-leak-western',
      claimIds: [...new Set(changedGroups.yongheSpineLeakWestern)],
      treatment: 'Extend Yonghe spine treatment to leaks: 皝死，永和五年 / 去歲 unresolved without AD',
    },
    zhizhiOffChapterDeathLeak: {
      bucketId: 'zhizhi-off-chapter-death-leak',
      claimIds: [...new Set(changedGroups.zhizhiOffChapterDeathLeak)],
      treatment: 'claim-501 death event-only without BC 36; aligns with claim-771 unresolved chapter-cite',
    },
    weiLiShengping4Inherit: {
      bucketId: 'wei-li-shengping4-inherit',
      claimIds: [...new Set(changedGroups.weiLiShengping4Inherit)],
      treatment: '及暐立 accession/events: strip inherited AD 360 from claim-670; relative unresolved or event-only death',
    },
    miscWesternSeven: {
      bucketId: 'misc-western-seven',
      claimIds: [...new Set(changedGroups.miscWesternSeven)],
      treatment: '建元曰元璽 / 咸和中 true conversion holds; 俊僭位 actor-relative unresolved — no synthetic AD',
    },
  },
  remainingEvidence: {
    supportedWesternRetain: ['claim-670'],
    recalledLifetimeIntervalsNotInScope: ['claim-94', 'claim-95', 'claim-96'],
    remainingWesternRows: remainingWestern,
    holdCalendarConversionPendingNativeAudit: [
      '永和五年 / 建元曰元璽 / 咸和中 rows unresolved awaiting conversion certification',
    ],
    noNativeDateAuditFile: 'data/people/date-audits/jinshu/110.json not written',
  },
  notDone: [
    'no native date approval',
    'no full redo',
    'no self-approval',
    'no merge',
    'no other owner chapters',
  ],
};

writeJsonAtomic('research/people/jinshu110-owner-dependency-receipt-western-bounds-20261124.json', receipt);
writeTextAtomic(
  'research/people/jinshu110-independent-grouped-owner-check-c5e2f862-20261124.json',
  `${JSON.stringify(readJson('/tmp/jinshu110-grouped-owner-check.json'), null, 2)}\n`,
);

console.log(JSON.stringify({
  claimChanges: changes.length,
  hintChanges: hintChanges.length,
  groups: Object.fromEntries(Object.entries(changedGroups).map(([key, ids]) => [key, ids.length])),
  remainingWestern: remainingWestern.length,
  afterExtractionHash: afterPacket.extractionHash,
}, null, 2));
console.log('PASS');
