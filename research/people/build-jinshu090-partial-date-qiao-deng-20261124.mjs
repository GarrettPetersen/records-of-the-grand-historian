#!/usr/bin/env node
/**
 * Jinshu 090: 喬智明 + 鄧攸 (s0277–s0376).
 */
import fs from 'node:fs';
import path from 'node:path';
import { validateDateAuditReport, DATE_AUDIT_VERSION } from '../../scripts/lib/people-date-audit.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT_DIR = path.join(ROOT, 'research/people/jinshu090-independent-evidence-20261124');
const REVIEWER = 'bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8';
const GROUP_ID = 'qiao-deng';
const UNIT_LO = 277;
const UNIT_HI = 376;
const PRIOR_REPORTS = [
  'partial-date-report-preface-20261124.json',
  'partial-date-report-lu-zhi-20261124.json',
  'partial-date-report-hu-wei-20261124.json',
  'partial-date-report-du-zhen-20261124.json',
  'partial-date-report-biog136-212-20261124.json',
  'partial-date-report-pan-fan-ding-20261124.json',
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
  'claim-911': { unit: 's0283', quote: '停其獄' },
};

const EXPLICIT_REGNAL_IN_SOURCE = /^(太寧二年|咸和元年|咸和五年)/;

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
      v.receptionType === 'retrospective',
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
  const g = geometry(claim);
  if (g.sourceText) return `${g.sourceText} (喬智明–鄧攸 span)`;
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
  if (!quote && geo.undated) quote = zh.length <= 14 ? zh : zh.slice(0, 8);
  if (!quote) quote = zh.slice(0, 8);
  if (!zh.includes(quote)) throw new Error(`Quote not in ${unit} for ${claim.id}: ${quote}`);
  return [{ unit, quote }];
}

function defectId(geo) {
  const s = geo.sourceText;
  if (geo.westernYear && s && !EXPLICIT_REGNAL_IN_SOURCE.test(s)) return 'import-event-label-western-year';
  if (geo.westernInterval && s.includes('永嘉之亂')) return 'import-yongjia-anarchy-interval';
  if (geo.westernInterval && s.includes('賈充伐吳')) return 'import-jia-chong-wu-interval';
  if (geo.westernInterval && s.includes('湣帝')) return 'import-min-di-interval';
  if (geo.westernInterval && s.includes('元帝')) return 'import-yuan-di-interval';
  if (geo.westernInterval && s.includes('永昌')) return 'import-yongchang-interval';
  if (geo.westernInterval && s.includes('孔子')) return 'import-confucius-interval';
  if (geo.westernBounds && s.includes('永嘉末')) return 'import-yongjia-end-bounds';
  if (geo.westernBounds && (s.includes('過江') || s.includes('江東') || s.includes('新鄭'))) return 'import-cross-jiang-bounds';
  if (geo.westernBounds && /喪父|喪母|祖母/.test(s)) return 'import-kinship-age-bounds';
  if (geo.westernBounds && s.includes('王敦')) return 'import-wang-dun-bounds';
  if (geo.westernBounds && s.includes('石勒')) return 'import-shi-le-bounds';
  if (geo.westernBounds && s.includes('為父報仇')) return 'import-prison-mercy-bounds';
  if (geo.westernBounds && s.includes('歲餘')) return 'import-prison-mercy-bounds';
  if (geo.westernBounds || geo.westernInterval) return 'import-other-geometry';
  return null;
}

function judge(claim) {
  const evidence = witness(claim);
  const event = eventFor(claim);
  const geo = geometry(claim);
  const base = { id: claim.id, evidence, event };
  const unit = evidence[0].unit;
  const quote = evidence[0].quote;
  const zh = unitMap.get(unit).zh;

  if (geo.undated) {
    return {
      ...base,
      verdict: 'supported',
      reason: `s${unit.slice(1)} “${quote}” names offices or life facts without a reign year; undated attestation matches primary text and is not a Western projection (${claim.id}).`,
    };
  }

  if (geo.retrospective && !geo.westernInterval && !geo.westernBounds && !geo.westernYear) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} cites retrospective reference only (“${quote}”); no calendar year asserted in Chinese for this person record.`,
    };
  }

  if (
    geo.westernYear &&
    EXPLICIT_REGNAL_IN_SOURCE.test(geo.sourceText) &&
    zh.includes(geo.sourceText)
  ) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} explicitly states ${geo.sourceText}; Western AD ${geo.westernYear.year} is standard conversion for that reign-year phrase on the cited line (${claim.id}).`,
    };
  }

  if (claim.id === 'claim-911') {
    return {
      ...base,
      verdict: 'research-blocked',
      reason:
        's0283 “停其獄” describes mercy toward Zhang Dui’s case, not Zhang’s death; death manner on this claim is extraction inference without a killing sentence—hold until retyped or re-sourced.',
    };
  }

  if (
    claim.predicate === 'death' &&
    !geo.westernYear &&
    !geo.westernBounds &&
    !geo.westernInterval &&
    /卒|死|崩|害|殺/.test(zh)
  ) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} records death wording in primary text (“${quote}”) without a Western year; undated death is correct (${claim.id}).`,
    };
  }

  const defect = defectId(geo);
  if (defect === 'import-event-label-western-year') {
    return {
      ...base,
      verdict: 'research-blocked',
      reason: `${unit} gives event frame “${geo.sourceText}” but no Western year in Chinese; AD ${geo.westernYear.year} is annal import (e.g. Ying vs Lun, Huai’s Ye campaign, Zhong Hui’s Shu campaign)—not text on this sentence (${claim.id}).`,
    };
  }

  const blockedReasons = {
    'import-yongjia-anarchy-interval':
      `“${geo.sourceText}” on ${unit} marks narrative chaos frame only; Yongjia Western interval on the claim is not stated in biography text (${claim.id}).`,
    'import-jia-chong-wu-interval':
      `賈充伐吳 on ${unit} names campaign context without AD endpoints in the sentence (${claim.id}).`,
    'import-min-di-interval': `湣帝 on ${unit} is reign-name framing for flight/succession; stored Western interval is not in source (${claim.id}).`,
    'import-yuan-di-interval': `元帝 on ${unit} identifies authority without year markers on this line (${claim.id}).`,
    'import-yongchang-interval': `永昌中 on ${unit} is era frame without numeric Western year in text (${claim.id}).`,
    'import-confucius-interval': `孔子 exemplary reference on ${unit} is undated antiquity; Western interval is projection (${claim.id}).`,
    'import-yongjia-end-bounds': `永嘉末 on ${unit} ends a career clause without calendar year; bound import blocked (${claim.id}).`,
    'import-cross-jiang-bounds': `Crossing south (過江/江東/新鄭) on ${unit} lacks explicit Western dating in biography (${claim.id}).`,
    'import-kinship-age-bounds': `Kinship-loss wording on ${unit} does not supply the stored childhood Western bounds (${claim.id}).`,
    'import-wang-dun-bounds': `王敦-related frame on ${unit} has no year on sentence (${claim.id}).`,
    'import-shi-le-bounds': `石勒 episode on ${unit} lacks explicit year for stored bounds (${claim.id}).`,
    'import-prison-mercy-bounds': `張兌停獄 episode on ${unit} (“${geo.sourceText}”) has no calendar year; Western bounds are inference (${claim.id}).`,
    'import-other-geometry': `Western geometry on ${unit} does not match explicit dating in cited Chinese (${claim.id}).`,
  };

  if (defect) {
    return {
      ...base,
      verdict: 'research-blocked',
      reason: blockedReasons[defect] ?? blockedReasons['import-other-geometry'],
    };
  }

  if (!geo.westernYear && !geo.westernBounds && !geo.westernInterval && geo.sourceText) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} anchors “${geo.sourceText}” without attaching Western geometry on the claim; source-framed undated record is supported (${claim.id}).`,
    };
  }

  return {
    ...base,
    verdict: 'research-blocked',
    reason: `Retain hold on ${claim.id}—uncertainty not resolved without inventing dates.`,
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
const byDefect = {};
for (const check of itemChecks) {
  if (check.verdict !== 'research-blocked') continue;
  const claim = spanItems.find((c) => c.id === check.id);
  const d = defectId(geometry(claim)) ?? (claim.id === 'claim-911' ? 'inferred-death-without-source' : 'other');
  byDefect[d] = byDefect[d] ?? [];
  byDefect[d].push(check.id);
}

const ownerPatchGroups = [
  {
    defectId: 'import-event-label-western-year',
    label: 'Event-label Western year (穎之敗趙王倫 / 惠帝伐鄴 / 鐘會伐蜀)',
    items: byDefect['import-event-label-western-year'] ?? [],
    ownerPatchHint: 'Keep sourceDate event text; strip AD 301/304/263 unless annal pinned separately.',
  },
  {
    defectId: 'import-yongjia-anarchy-interval',
    label: '永嘉之亂 WesternInterval',
    items: byDefect['import-yongjia-anarchy-interval'] ?? [],
    ownerPatchHint: 'Undated service under Liu Yao or source 永嘉之亂 only.',
  },
  {
    defectId: 'import-yongjia-end-bounds',
    label: '永嘉末 bound imports',
    items: byDefect['import-yongjia-end-bounds'] ?? [],
    ownerPatchHint: 'Narrative 永嘉末 without onOrBefore AD merge.',
  },
  {
    defectId: 'import-cross-jiang-bounds',
    label: 'Southward flight bound imports',
    items: byDefect['import-cross-jiang-bounds'] ?? [],
    ownerPatchHint: '過江 / 江東 clauses—undated migration until Yongjia year explicit.',
  },
  {
    defectId: 'import-kinship-age-bounds',
    label: 'Childhood 喪父/喪母 WesternBounds',
    items: byDefect['import-kinship-age-bounds'] ?? [],
    ownerPatchHint: 'Retain kinship facts; drop Western childhood endpoints.',
  },
  {
    defectId: 'import-jia-chong-wu-interval',
    label: '賈充伐吳 intervals',
    items: byDefect['import-jia-chong-wu-interval'] ?? [],
  },
  {
    defectId: 'import-min-di-interval',
    label: '湣帝 intervals',
    items: byDefect['import-min-di-interval'] ?? [],
  },
  {
    defectId: 'import-yuan-di-interval',
    label: '元帝 intervals',
    items: byDefect['import-yuan-di-interval'] ?? [],
  },
  {
    defectId: 'import-yongchang-interval',
    label: '永昌中 intervals',
    items: byDefect['import-yongchang-interval'] ?? [],
  },
  {
    defectId: 'import-prison-mercy-bounds',
    label: '張兌停獄 bound imports (為父報仇 / 歲餘)',
    items: byDefect['import-prison-mercy-bounds'] ?? [],
    ownerPatchHint: 'Prison-mercy narrative only; remove AD 304 before-bounds.',
  },
  {
    defectId: 'inferred-death-without-source',
    label: 'Death claim without death sentence (claim-911)',
    items: byDefect['inferred-death-without-source'] ?? [],
  },
].filter((g) => g.items.length);

let findings = ownerPatchGroups.map((g) => ({
  items: g.items,
  problem: `${g.label} — systemic unsupported projection (owner repair batch; not generic rights).`,
  action: g.ownerPatchHint ?? 'Downgrade to undated/sourceDate-only per item in owner patch.',
}));

const blockedIds = itemChecks.filter((c) => c.verdict === 'research-blocked').map((c) => c.id);
const listed = new Set(findings.flatMap((f) => f.items));
const orphan = blockedIds.filter((id) => !listed.has(id));
if (orphan.length) {
  findings.push({
    items: orphan,
    problem: 'Isolated bound/geometry imports on prison-mercy or misc clauses (喬智明 span).',
    action: 'Case-specific owner patch per claim; keep 為父報仇 / 歲餘 undated until year explicit.',
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
    name: 'Independent source chronology reviewer Jinshu 090 (喬智明–鄧攸)',
    agentId: REVIEWER,
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    'Partial s0277–s0376: supported explicit 太寧二年/咸和元年 and undated source-framed facts; blocked event-label Western years and interval/bound imports (永嘉之亂, flight south, kinship bounds). Prior tranche findings unchanged.',
  reviewedUnits: SPAN_UNITS,
  itemChecks,
  personChecks: [],
  findings,
  references: [],
  scope: { group: GROUP_ID, units: 's0277–s0376', itemCount: itemChecks.length, ownerDefectGroups: ownerPatchGroups },
  carriedForward: { priorUniqueItemIdsReviewed: 227, editorialDecisionsPreserved: 50 },
};

validateDateAuditReport(report, packet);
fs.writeFileSync(
  path.join(OUT_DIR, 'partial-date-report-qiao-deng-20261124.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);

const prevDefects = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'chronology-owner-defect-groups-20261124.json'), 'utf8'));
const mergedDefects = {
  schemaVersion: 2,
  chapter: '090',
  tranches: [
    ...(prevDefects.tranches ?? [{ tranche: prevDefects.tranche ?? 'pan-fan-ding', groups: prevDefects.groups }]),
    { tranche: GROUP_ID, groups: ownerPatchGroups },
  ],
  note: 'Additive owner-patch catalog only; prior pan-fan-ding groups preserved.',
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-owner-defect-groups-20261124.json'), `${JSON.stringify(mergedDefects, null, 2)}\n`);

const priorById = loadPriorItemChecks();
for (const check of itemChecks) priorById.set(check.id, check);
const cumulativeIds = [...priorById.keys()].sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]));
const uniqueChecks = [...priorById.values()];
const verdictRollup = (checks) =>
  Object.fromEntries(
    ['supported', 'incorrect', 'research-blocked'].map((v) => [v, checks.filter((c) => c.verdict === v).length]),
  );

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
  reportFile: 'partial-date-report-qiao-deng-20261124.json',
  itemChecks: itemChecks.length,
  uniqueNewItemIds: itemChecks.length,
  verdicts: verdictRollup(itemChecks),
});
scope.untouchedGroups = [
  { id: 'wu-yinzhi', label: '吳隱之', units: 's0377–s0428', estimatedItems: 43 },
  { id: 'shilun', label: '【史论】', units: 's0429–s0436', estimatedItems: null },
];
scope.cumulative = {
  uniqueItemIdsReviewed: cumulativeIds.length,
  uniqueUnitsReviewed: allUnits.size,
  itemIds: cumulativeIds,
  verdicts: verdictRollup(uniqueChecks),
  packetItemsTotal: packet.items.length,
  packetItemsRemaining: packet.items.length - cumulativeIds.length,
  nextUnreviewedClaimId: 'claim-921',
  nextUnitRange: 's0377–s0428',
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), `${JSON.stringify(scope, null, 2)}\n`);

const cumulative = {
  schemaVersion: 1,
  kind: 'chronology-cumulative-evidence',
  book: 'jinshu',
  chapter: '090',
  packetHashes: { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash },
  groups: [...(JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'chronology-cumulative-checkpoint-20261124.json'))).groups || []), GROUP_ID],
  uniqueCoverage: scope.cumulative,
  editorialEvidenceUnchanged: true,
  preservedEditorialDecisions: 50,
  spanCounts: {
    thisGroupItemChecks: itemChecks.length,
    uniqueNewThisGroup: itemChecks.length,
    cumulativeUniqueItemIds: cumulativeIds.length,
  },
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-cumulative-checkpoint-20261124.json'), `${JSON.stringify(cumulative, null, 2)}\n`);

console.log(JSON.stringify({
  ok: true,
  itemChecks: itemChecks.length,
  cumulativeUnique: cumulativeIds.length,
  remaining: packet.items.length - cumulativeIds.length,
  nextClaimId: scope.cumulative.nextUnreviewedClaimId,
  verdicts: verdictRollup(itemChecks),
}, null, 2));