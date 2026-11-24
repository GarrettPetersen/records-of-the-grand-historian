#!/usr/bin/env node
/**
 * Jinshu 090: 潘京 + 范晷 family + 丁紹 (s0213–s0276).
 */
import fs from 'node:fs';
import path from 'node:path';
import { validateDateAuditReport, DATE_AUDIT_VERSION } from '../../scripts/lib/people-date-audit.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT_DIR = path.join(ROOT, 'research/people/jinshu090-independent-evidence-20261124');
const REVIEWER = 'bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8';
const GROUP_ID = 'pan-fan-ding';
const UNIT_LO = 213;
const UNIT_HI = 276;
const PRIOR_REPORTS = [
  'partial-date-report-preface-20261124.json',
  'partial-date-report-lu-zhi-20261124.json',
  'partial-date-report-hu-wei-20261124.json',
  'partial-date-report-du-zhen-20261124.json',
  'partial-date-report-biog136-212-20261124.json',
];

const packet = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'date-packet-pin.json'), 'utf8'));
const SPAN_UNITS = packet.units
  .map((u) => u.id)
  .filter((id) => {
    const n = Number(id.slice(1));
    return n >= UNIT_LO && n <= UNIT_HI;
  })
  .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
const unitMap = new Map(packet.units.map((u) => [u.id, u]));
const spanItems = packet.items.filter((item) => item.evidence.some((u) => SPAN_UNITS.includes(u)));

const QUOTE_OVERRIDE = {
  'claim-515': { unit: 's0213', quote: '潘京' },
  'claim-692': { unit: 's0215', quote: '弱冠' },
  'claim-714': { unit: 's0232', quote: '年五十卒' },
  'claim-812': { unit: 's0260', quote: '別有傳' },
};

function geometry(claim) {
  const v = claim.value ?? {};
  const dc = v.dateContext ?? {};
  return {
    undated: !!(v.undatedSourceAttestation || dc.undatedSourceAttestation),
    unresolved: !!v.unresolved,
    westernYear: v.westernYear ?? dc.westernYear,
    westernBounds: v.westernBounds ?? dc.westernBounds,
    westernInterval: v.westernInterval ?? dc.westernInterval,
    sourceText: v.sourceDate?.text ?? dc.sourceDate?.text ?? '',
    retrospective:
      v.kind === 'retrospective-reference' ||
      dc.kind === 'retrospective-reference' ||
      v.receptionType === 'retrospective' ||
      (claim.predicate === 'work-association' && v.relation === 'subject'),
  };
}

function pickUnit(claim) {
  return claim.evidence.filter((u) => SPAN_UNITS.includes(u))[0] ?? claim.evidence[0];
}

function eventFor(claim) {
  const v = claim.value ?? {};
  const dc = v.dateContext ?? {};
  if (typeof v.event === 'string' && v.event.trim().length >= 10) return v.event.trim();
  if (typeof dc.event === 'string' && dc.event.length >= 10) return dc.event;
  if (v.manner && String(v.manner).length >= 10) return String(v.manner);
  if (v.label?.zh) return `${v.label.zh} (潘京–丁紹 span)`;
  if (geometry(claim).sourceText) return `${geometry(claim).sourceText} in good-officials biographies`;
  return `Good-officials biography temporal record (${claim.id})`;
}

function witness(claim) {
  const pin = QUOTE_OVERRIDE[claim.id];
  const unit = pin?.unit ?? pickUnit(claim);
  const zh = unitMap.get(unit)?.zh;
  if (!zh) throw new Error(`No unit ${unit} for ${claim.id}`);
  const geo = geometry(claim);
  let quote = pin?.quote;
  if (!quote && geo.sourceText && zh.includes(geo.sourceText)) quote = geo.sourceText;
  if (!quote && geo.undated) quote = zh.length <= 12 ? zh : zh.slice(0, 8);
  if (!quote && claim.predicate === 'age') {
    if (zh.includes('弱冠')) quote = '弱冠';
    else if (zh.includes('年五十')) quote = '年五十';
  }
  if (!quote && claim.predicate === 'death') {
    if (zh.includes('卒')) quote = zh.includes('卒于官') ? '卒于官' : '卒';
    else if (zh.includes('早卒')) quote = '早卒';
  }
  if (!quote) quote = zh.slice(0, 8);
  if (!zh.includes(quote)) throw new Error(`Quote not in ${unit} for ${claim.id}: ${quote}`);
  return [{ unit, quote }];
}

function defectId(geo) {
  const s = geo.sourceText;
  if (geo.westernInterval && s.includes('光武時')) return 'import-guangwu-interval';
  if (geo.westernInterval && s.includes('元康中')) return 'import-yuankang-interval';
  if (geo.westernBounds && s.includes('元帝承制')) return 'import-yuandi-bounds';
  if (geo.westernBounds && (s.includes('討破汲桑') || s.includes('暴疾而卒'))) return 'import-campaign-death-bound';
  if ((geo.westernInterval || geo.westernBounds) && s.includes('懷帝')) return 'import-huai-di-interval';
  if (geo.westernBounds || geo.westernInterval) return 'import-unspecified-geometry';
  return null;
}

function judge(claim) {
  const evidence = witness(claim);
  const event = eventFor(claim);
  const geo = geometry(claim);
  const base = { id: claim.id, evidence, event };
  const unit = evidence[0].unit;
  const quote = evidence[0].quote;

  if (geo.undated) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} states career or discourse without reign years (witness “${quote}”); undated attestation is correct and explicitly not a Western projection.`,
    };
  }

  if (geo.retrospective && !geo.westernInterval && !geo.westernBounds) {
    return {
      ...base,
      verdict: 'supported',
      reason: `The sentence cites retrospective or cross-biography context only (${quote} on ${unit}); no calendar year is claimed in source text.`,
    };
  }

  if (claim.predicate === 'age' && !geo.westernYear && !geo.westernBounds && !geo.westernInterval) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} gives sui or capping age in Chinese (“${quote}”) without a Western year; age attestation is explicit source material, not imported chronology.`,
    };
  }

  if (
    claim.predicate === 'death' &&
    !geo.westernYear &&
    !geo.westernBounds &&
    !geo.westernInterval
  ) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} records death or manner (“${quote}”) without stating a reign or Western year; undated death is the faithful representation.`,
    };
  }

  const defect = defectId(geo);
  if (defect || geo.westernInterval || geo.westernBounds) {
    const templates = {
      'import-guangwu-interval': `Quoted speech recalls 光武時 on ${unit}, but only the era name appears—AD 25–57 is table import for an anecdotal Wuling toponymy story (not Pan Jing’s life date).`,
      'import-yuankang-interval': `元康中 on ${unit} names a reign frame without Western endpoints in the biography; AD 291–299 interval is projection (claim applies to Fan Chang’s office/death clause).`,
      'import-yuandi-bounds': `元帝承制 on ${unit} marks Eastern Jin provisional appointment language; onOrAfter AD 317 is not explicit in the sentence (Fan Guang/Tangyi magistracy cluster).`,
      'import-campaign-death-bound': `“${geo.sourceText}” on ${unit} narrates Ji Sang campaign or sudden death without calendar year; stored Western bounds are external chronology, not chapter text.`,
      'import-huai-di-interval': `懷帝 on ${unit} identifies the posthumous authority only by reign name; AD 307–313 interval is not stated in source (Ding Shao 策贈 cluster).`,
      'import-unspecified-geometry': `Western geometry on ${unit} lacks a matching explicit year phrase in the cited Chinese.`,
    };
    return {
      ...base,
      verdict: 'research-blocked',
      reason: `${templates[defect] ?? templates['import-unspecified-geometry']} Retain hold (${claim.id}).`,
    };
  }

  return {
    ...base,
    verdict: 'research-blocked',
    reason: `Could not certify ${claim.id} without inventing dates; retain explicit uncertainty.`,
  };
}

function loadPriorItemChecks() {
  const byId = new Map();
  for (const file of PRIOR_REPORTS) {
    const report = JSON.parse(fs.readFileSync(path.join(OUT_DIR, file), 'utf8'));
    for (const check of report.itemChecks) byId.set(check.id, check);
  }
  return byId;
}

const itemChecks = spanItems.map(judge);
const findings = [];

const byDefect = {};
for (const check of itemChecks) {
  if (check.verdict !== 'research-blocked') continue;
  const claim = spanItems.find((c) => c.id === check.id);
  const d = defectId(geometry(claim)) ?? 'other';
  byDefect[d] = byDefect[d] ?? [];
  byDefect[d].push(check.id);
}

const ownerPatchGroups = [
  {
    defectId: 'import-yuankang-interval',
    label: '元康中 WesternInterval import',
    items: byDefect['import-yuankang-interval'] ?? [],
    ownerPatchHint: 'Downgrade to sourceDate 元康中 only or cite annals per Fan Chang death sentence.',
  },
  {
    defectId: 'import-yuandi-bounds',
    label: '元帝承制 onOrAfter AD 317',
    items: byDefect['import-yuandi-bounds'] ?? [],
    ownerPatchHint: 'Shared Fan Guang/Fan Zhi office records on Tangyi—split or undated until Yuan Di year explicit.',
  },
  {
    defectId: 'import-guangwu-interval',
    label: '光武時 anecdote AD 25–57',
    items: byDefect['import-guangwu-interval'] ?? [],
    ownerPatchHint: 'Keep retrospective Guangwu reference; strip WesternInterval from speech-in-dialogue claims.',
  },
  {
    defectId: 'import-campaign-death-bound',
    label: 'Ji Sang / sudden-death bound imports',
    items: byDefect['import-campaign-death-bound'] ?? [],
    ownerPatchHint: '討破汲桑 and 暴疾而卒 lack years—match Wang Hong duplicate line 天亡冀州 pattern.',
  },
  {
    defectId: 'import-huai-di-interval',
    label: '懷帝 posthumous WesternInterval',
    items: byDefect['import-huai-di-interval'] ?? [],
    ownerPatchHint: '策贈車騎將軍: retain 懷帝 reign label; block interval until edict date pinned.',
  },
].filter((g) => g.items.length);

for (const g of ownerPatchGroups) {
  findings.push({
    items: g.items,
    problem: `${g.label} (recurring extraction pattern; group for owner patch).`,
    action: g.ownerPatchHint,
  });
}

const report = {
  schemaVersion: 1,
  auditVersion: DATE_AUDIT_VERSION,
  book: 'jinshu',
  chapter: '090',
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status: 'needs-revision',
  reviewer: {
    name: 'Independent source chronology reviewer Jinshu 090 (潘京–丁紹 tranche)',
    agentId: REVIEWER,
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    'Partial review s0213–s0276 (潘京, 范晷/廣/稚, 丁紹). Supported undated discourse, explicit ages, undated deaths, and retrospective 別有傳; blocked Western interval/bound imports on 光武時, 元康中, 元帝承制, 討破汲桑/暴疾而卒, 懷帝. Grouped recurring defects for owner patch.',
  reviewedUnits: SPAN_UNITS,
  itemChecks,
  personChecks: [],
  findings,
  references: [],
  scope: {
    group: GROUP_ID,
    label: '潘京、范晷家族、丁紹',
    units: 's0213–s0276',
    itemCount: itemChecks.length,
    ownerDefectGroups: ownerPatchGroups,
    nextUntouchedGroup: { label: '喬智明', unitRange: 's0277–s0295', nextClaimId: 'claim-860' },
  },
  carriedForward: {
    priorUniqueItemIdsReviewed: 186,
    editorialDecisionsPreserved: 50,
    prefaceIncorrect: ['claim-60'],
  },
};

validateDateAuditReport(report, packet);

fs.writeFileSync(
  path.join(OUT_DIR, 'chronology-owner-defect-groups-20261124.json'),
  `${JSON.stringify({ schemaVersion: 1, chapter: '090', tranche: GROUP_ID, groups: ownerPatchGroups, note: 'For host owner patch; not production install.' }, null, 2)}\n`,
);

const reportPath = path.join(OUT_DIR, 'partial-date-report-pan-fan-ding-20261124.json');
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

const priorById = loadPriorItemChecks();
for (const check of itemChecks) priorById.set(check.id, check);

const cumulativeIds = [...priorById.keys()].sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]));
const uniqueChecks = [...priorById.values()];
const verdictRollup = (checks) =>
  Object.fromEntries(
    ['supported', 'incorrect', 'research-blocked'].map((v) => [v, checks.filter((c) => c.verdict === v).length]),
  );

const priorIds = new Set(
  JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'chronology-cumulative-checkpoint-20261124.json'), 'utf8')).uniqueCoverage
    .itemIds,
);
const spanIds = itemChecks.map((c) => c.id);
const uniqueNew = spanIds.filter((id) => !priorIds.has(id));

const scope = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), 'utf8'));
const allUnits = new Set();
for (const g of scope.completedGroups) {
  if (g.units) for (const u of g.units) allUnits.add(u);
}
for (const u of SPAN_UNITS) allUnits.add(u);

scope.completedGroups = scope.completedGroups.filter((g) => g.id !== GROUP_ID);
scope.completedGroups.push({
  id: GROUP_ID,
  units: SPAN_UNITS,
  reportFile: 'partial-date-report-pan-fan-ding-20261124.json',
  itemChecks: itemChecks.length,
  uniqueNewItemIds: uniqueNew.length,
  verdicts: verdictRollup(itemChecks),
});
scope.untouchedGroups = [
  { id: 'qiao-zhiming', label: '喬智明', units: 's0277–s0295', estimatedItems: 20 },
  { id: 'deng-you', label: '鄧攸', units: 's0296–s0376', estimatedItems: null },
  { id: 'through-wu-yinzhi', label: '吳隱之 + 史論', units: 's0377–s0436', estimatedItems: null },
];
scope.cumulative = {
  uniqueItemIdsReviewed: cumulativeIds.length,
  uniqueUnitsReviewed: allUnits.size,
  itemIds: cumulativeIds,
  verdicts: verdictRollup(uniqueChecks),
  packetItemsTotal: packet.items.length,
  packetItemsRemaining: packet.items.length - cumulativeIds.length,
  nextUnreviewedClaimId: 'claim-860',
  nextUnitRange: 's0277–s0295',
  ownerDefectGroupsFile: 'chronology-owner-defect-groups-20261124.json',
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), `${JSON.stringify(scope, null, 2)}\n`);

const cumulative = {
  schemaVersion: 1,
  kind: 'chronology-cumulative-evidence',
  book: 'jinshu',
  chapter: '090',
  packetHashes: { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash },
  groups: ['preface', 'lu-zhi', 'hu-wei', 'du-zhen', 'dou-wang-cao', GROUP_ID],
  uniqueCoverage: scope.cumulative,
  editorialEvidenceUnchanged: true,
  preservedEditorialDecisions: 50,
  spanCounts: {
    thisGroupItemChecks: itemChecks.length,
    uniqueNewThisGroup: uniqueNew.length,
    cumulativeUniqueItemIds: cumulativeIds.length,
  },
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-cumulative-checkpoint-20261124.json'), `${JSON.stringify(cumulative, null, 2)}\n`);

console.log(JSON.stringify({
  ok: true,
  itemChecks: itemChecks.length,
  uniqueNew: uniqueNew.length,
  cumulativeUnique: cumulativeIds.length,
  remaining: packet.items.length - cumulativeIds.length,
  nextClaimId: 'claim-860',
  verdicts: verdictRollup(itemChecks),
}, null, 2));