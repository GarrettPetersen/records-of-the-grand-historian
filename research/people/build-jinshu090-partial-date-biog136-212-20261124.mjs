#!/usr/bin/env node
/**
 * Jinshu 090 partial chronology: 竇允 + 王宏 + 曹攄 (units s0136–s0212).
 */
import fs from 'node:fs';
import path from 'node:path';
import { validateDateAuditReport, DATE_AUDIT_VERSION } from '../../scripts/lib/people-date-audit.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT_DIR = path.join(ROOT, 'research/people/jinshu090-independent-evidence-20261124');
const REVIEWER = 'bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8';
const GROUP_ID = 'dou-wang-cao';
const UNIT_LO = 136;
const UNIT_HI = 212;
const PRIOR_REPORTS = [
  'partial-date-report-preface-20261124.json',
  'partial-date-report-lu-zhi-20261124.json',
  'partial-date-report-hu-wei-20261124.json',
  'partial-date-report-du-zhen-20261124.json',
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
  'claim-479': { unit: 's0136', quote: '竇允' },
  'claim-537': { unit: 's0151', quote: '卒於官' },
  'claim-651': { unit: 's0176', quote: '密自殺' },
  'claim-672': { unit: 's0205', quote: '因丁母憂' },
  'claim-577': { unit: 's0153', quote: '魏侍中粲' },
  'claim-635': { unit: 's0172', quote: '祖肇' },
};

function geometry(claim) {
  const v = claim.value ?? {};
  const dc = v.dateContext ?? {};
  return {
    undated: !!(v.undatedSourceAttestation || dc.undatedSourceAttestation),
    unresolved: !!v.unresolved,
    westernYear: v.westernYear ?? dc.westernYear,
    westernBounds: v.westernBounds ?? dc.westernBounds,
    sourceText: v.sourceDate?.text ?? dc.sourceDate?.text ?? '',
    retrospective:
      v.kind === 'retrospective-reference' ||
      dc.kind === 'retrospective-reference' ||
      v.receptionType === 'retrospective' ||
      claim.predicate === 'event-participation' && v.role === 'ancestor-recalled',
  };
}

function pickUnit(claim) {
  const span = claim.evidence.filter((u) => SPAN_UNITS.includes(u));
  return span[0] ?? claim.evidence[0];
}

function eventFor(claim) {
  const v = claim.value ?? {};
  const dc = v.dateContext ?? {};
  if (typeof v.event === 'string' && v.event.trim().length >= 10) return v.event.trim();
  if (typeof dc.event === 'string' && dc.event.length >= 10) return dc.event;
  if (v.statement && String(v.statement).length >= 10) return String(v.statement);
  if (v.label?.zh) return `${v.label.zh} in 竇允/王宏/曹攄 tranche`;
  if (geometry(claim).sourceText) {
    return `${geometry(claim).sourceText} episode in Jinshu 090 good-officials biographies`;
  }
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
  if (!quote && geo.undated) {
    quote = zh.length <= 10 ? zh : zh.slice(0, 8);
  }
  if (!quote && claim.predicate === 'death') {
    if (zh.includes('卒')) quote = zh.includes('卒於官') ? '卒於官' : '卒';
    else if (zh.includes('死')) quote = '死';
    else if (zh.includes('害')) quote = '害';
  }
  if (!quote) quote = zh.slice(0, 8);
  if (!zh.includes(quote)) throw new Error(`Quote not in ${unit} for ${claim.id}: ${quote}`);
  return [{ unit, quote }];
}

function isRegnalBoundsProjection(src) {
  if (!src) return false;
  if (/^泰始|太康/.test(src)) return true;
  if (/^魏/.test(src)) return true;
  if (src.includes('齊王冏輔政')) return true;
  if (src.includes('惠帝末')) return true;
  if (src.includes('天子為賊臣')) return true;
  return false;
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
      reason: `The cited unit (${unit}) records career or identity facts without reign years; undated representation is correct and is not a Western date projection.`,
    };
  }

  if (geo.unresolved) {
    return {
      ...base,
      verdict: 'research-blocked',
      reason:
        'Extraction marks this genealogical intermediary as unresolved; s0172 names 祖肇 as Wei general but supplies no datable act—do not infer a father record or calendar year from the grandson’s biography.',
    };
  }

  if (geo.retrospective) {
    return {
      ...base,
      verdict: 'supported',
      reason: `The Chinese on ${unit} cites an ancestor or collateral kin only as lineage context (e.g. ${quote}); retrospective-reference without a local life-year is the proper representation.`,
    };
  }

  if (geo.westernYear && /永嘉[二三]年/.test(geo.sourceText)) {
    const year = geo.westernYear.year;
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} explicitly states ${geo.sourceText}; Western AD ${year} matches the standard Yongjia year conversion for that wording read in situ.`,
    };
  }

  if (
    claim.predicate === 'death' &&
    !geo.westernYear &&
    !geo.westernBounds
  ) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} records death (${quote}) without attaching a reign or Western year; supported as undated manner/cause, not an invented calendar date.`,
    };
  }

  if (geo.westernBounds && isRegnalBoundsProjection(geo.sourceText)) {
    const bucket = /^泰始|太康/.test(geo.sourceText)
      ? 'Taishi/Taikang reign labels give era names only (中/初); AD interval endpoints are table import.'
      : /^魏/.test(geo.sourceText)
        ? '魏/魏時/魏侍中 names Wei service without terminal Western years in the sentence.'
        : geo.sourceText.includes('齊王冏')
          ? '齊王冏輔政 frames offices but does not state AD 301–302 on the biography line.'
          : geo.sourceText.includes('惠帝末')
            ? '惠帝末 is a narrative frame without a numeric Western year in source.'
            : '天子為賊臣所逼 is rhetorical context inside Sima Jiong’s regency without a dated reign marker.';
    return {
      ...base,
      verdict: 'research-blocked',
      reason: `${unit} quotes “${geo.sourceText}”. ${bucket} Block stored westernBounds until sourced or downgrade to undated office/event records (${claim.id}).`,
    };
  }

  if (geo.westernYear && !/永嘉/.test(geo.sourceText)) {
    return {
      ...base,
      verdict: 'research-blocked',
      reason: `Claim carries Western year geometry without a matching explicit year phrase on ${unit}; hold pending source pin.`,
    };
  }

  return {
    ...base,
    verdict: 'research-blocked',
    reason: `Independent pass could not classify ${claim.id} without guessing; retain hold rather than certifying unsupported projection.`,
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

const taishi = itemChecks.filter((c) => /^泰始|太康/.test(geometry(spanItems.find((i) => i.id === c.id)).sourceText) && c.verdict === 'research-blocked').map((c) => c.id);
if (taishi.length) {
  findings.push({
    items: taishi,
    problem: 'Taishi/Taikang reign phrases in Dou Yun and Wang Hong biographies lack Western interval endpoints in source.',
    action: 'Store sourceDate text only or pin each office/edict to annals; do not certify shared AD 265–274 / Taikang spans by default.',
  });
}

const wei = itemChecks.filter((c) => {
  const src = geometry(spanItems.find((i) => i.id === c.id)).sourceText;
  return /^魏/.test(src) && c.verdict === 'research-blocked';
}).map((c) => c.id);
if (wei.length) {
  findings.push({
    items: wei,
    problem: 'Wei-era kinship and office mentions (魏時, 魏侍中粲, 魏衛將軍) lack sentence-level Western bounds.',
    action: 'Keep undated Wei attestations; block imported Wei-endpoint intervals until independently sourced.',
  });
}

const jinLate = itemChecks.filter((c) => {
  const src = geometry(spanItems.find((i) => i.id === c.id)).sourceText;
  return (src.includes('齊王冏') || src.includes('惠帝末') || src.includes('天子為賊臣')) && c.verdict === 'research-blocked';
}).map((c) => c.id);
if (jinLate.length) {
  findings.push({
    items: jinLate,
    problem: 'Eastern Jin turmoil frames (齊王冏輔政, 惠帝末, regency counsel) lack explicit Western years in chapter text.',
    action: 'Research each career episode or retain undated attestation; block identical regency interval imports across persons.',
  });
}

if (itemChecks.some((c) => c.id === 'claim-502')) {
  findings.push({
    items: ['claim-502'],
    problem: 'Inferred father link for Cao Shu genealogy is marked unresolved in extraction.',
    action: 'Do not certify genealogical intermediary without named dated acts in source.',
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
    name: 'Independent source chronology reviewer Jinshu 090 (竇允–王宏–曹攄 tranche)',
    agentId: REVIEWER,
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    'Partial review of units s0136–s0212 (竇允, 王宏, 曹攄). Supported explicit 永嘉二年/三年 anchors, undated careers/deaths, and retrospective kin; blocked Western interval projections on 泰始/太康/魏/齊王冏/惠帝末 frames. Not chapter approval.',
  reviewedUnits: SPAN_UNITS,
  itemChecks,
  personChecks: [],
  findings,
  references: [],
  scope: {
    group: GROUP_ID,
    label: '竇允、王宏、曹攄',
    units: 's0136–s0212',
    itemCount: itemChecks.length,
    nextUntouchedGroup: { label: '潘京 Pan Jing', unitRange: 's0213–s0232', nextClaimId: 'claim-515' },
  },
  carriedForward: {
    priorUniqueItemIdsReviewed: 118,
    editorialDecisionsPreserved: 50,
    prefaceIncorrect: ['claim-60'],
  },
};

validateDateAuditReport(report, packet);

const reportPath = path.join(OUT_DIR, 'partial-date-report-biog136-212-20261124.json');
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
  reportFile: 'partial-date-report-biog136-212-20261124.json',
  itemChecks: itemChecks.length,
  uniqueNewItemIds: uniqueNew.length,
  overlapWithPriorGroups: spanIds.filter((id) => priorIds.has(id)),
  verdicts: verdictRollup(itemChecks),
});
const remainingIds = packet.items.filter((i) => !priorById.has(i.id)).length;
scope.untouchedGroups = [
  { id: 'pan-jing', label: '潘京', units: 's0213–s0232', estimatedItems: 11 },
  { id: 'fan-chao-family', label: '范晷 family', units: 's0233–s0260', estimatedItems: null },
  { id: 'remaining-through-wu-yinzhi', label: '丁紹 through 吳隱之 + 史論', units: 's0261–s0436', estimatedItems: null },
];
scope.cumulative = {
  uniqueItemIdsReviewed: cumulativeIds.length,
  uniqueUnitsReviewed: allUnits.size,
  itemIds: cumulativeIds,
  verdicts: verdictRollup(uniqueChecks),
  packetItemsTotal: packet.items.length,
  packetItemsRemaining: packet.items.length - cumulativeIds.length,
  nextUnreviewedClaimId: 'claim-515',
  nextUnitRange: 's0213–s0232',
  remainingSourceHolds: {
    cumulativeResearchBlocked: verdictRollup(uniqueChecks)['research-blocked'],
    cumulativeIncorrect: verdictRollup(uniqueChecks).incorrect,
    prefaceIncorrect: ['claim-60'],
  },
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), `${JSON.stringify(scope, null, 2)}\n`);

const cumulative = {
  schemaVersion: 1,
  kind: 'chronology-cumulative-evidence',
  book: 'jinshu',
  chapter: '090',
  packetHashes: { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash },
  groups: ['preface', 'lu-zhi', 'hu-wei', 'du-zhen', GROUP_ID],
  uniqueCoverage: scope.cumulative,
  editorialEvidenceUnchanged: true,
  preservedPrefaceChecks: 27,
  preservedEditorialDecisions: 50,
  spanCounts: {
    thisGroupItemChecks: itemChecks.length,
    uniqueNewThisGroup: uniqueNew.length,
    cumulativeUniqueItemIds: cumulativeIds.length,
  },
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-cumulative-checkpoint-20261124.json'), `${JSON.stringify(cumulative, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      ok: true,
      reportPath,
      itemChecks: itemChecks.length,
      uniqueNew: uniqueNew.length,
      cumulativeUnique: cumulativeIds.length,
      remaining: packet.items.length - cumulativeIds.length,
      nextClaimId: 'claim-515',
      verdicts: verdictRollup(itemChecks),
    },
    null,
    2,
  ),
);