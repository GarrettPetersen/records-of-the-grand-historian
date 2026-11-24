#!/usr/bin/env node
/**
 * Hu Wei family partial date review: units s0058–s0092 (胡威, 子奕, 弟羆).
 * Research-only; uses pinned packet; merges deduplicated cumulative checkpoints.
 */
import fs from 'node:fs';
import path from 'node:path';
import { validateDateAuditReport, DATE_AUDIT_VERSION } from '../../scripts/lib/people-date-audit.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT_DIR = path.join(ROOT, 'research/people/jinshu090-independent-evidence-20261124');
const REVIEWER = 'bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8';
const GROUP_ID = 'hu-wei';

const packet = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'date-packet-pin.json'), 'utf8'));
const HU_UNITS = packet.units
  .map((u) => u.id)
  .filter((id) => {
    const n = Number(id.slice(1));
    return n >= 58 && n <= 92;
  })
  .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
const unitMap = new Map(packet.units.map((u) => [u.id, u]));
const huItems = packet.items.filter((item) => item.evidence.some((u) => HU_UNITS.includes(u)));

const QUOTE = {
  'claim-242': { unit: 's0058', quote: '胡威' },
  'claim-287': { unit: 's0086', quote: '太康元年' },
  'claim-288': { unit: 's0086', quote: '追贈' },
  'claim-289': { unit: 's0086', quote: '諡曰烈' },
  'claim-290': { unit: 's0086', quote: '卒於位' },
  'claim-291': { unit: 's0063', quote: '質之為荊州也' },
  'claim-292': { unit: 's0075', quote: '拜侍御史' },
  'claim-313': { unit: 's0061', quote: '仕魏' },
  'claim-321': { unit: 's0061', quote: '蔣濟' },
  'claim-323': { unit: 's0061', quote: '硃績' },
  'claim-326': { unit: 's0063', quote: '質之為荊州也' },
  'claim-330': { unit: 's0077', quote: '後入朝，武帝語及平生' },
  'claim-334': { unit: 's0087', quote: '子奕嗣' },
  'claim-336': { unit: 's0086', quote: '太康元年' },
  'claim-343': { unit: 's0092', quote: '仕至益州刺史' },
};

const TAIKANG_EXPLICIT = new Set(['claim-287', 'claim-288', 'claim-289', 'claim-290']);
const SUCCESSION_TAIKANG = new Set(['claim-334', 'claim-336']);
const UNDATED_OK = new Set(['claim-242', 'claim-292', 'claim-343']);
const WEI_SERVE_IMPORT = new Set(['claim-313', 'claim-321', 'claim-323']);
const JING_FRAME_IMPORT = new Set(['claim-291', 'claim-326']);
const COURT_BEFORE_DEATH = new Set(['claim-330']);

const PERSON_LABEL = {
  'claim-313': 'father Hu Zhi (胡質)',
  'claim-321': 'Jiang Ji (蔣濟)',
  'claim-323': 'Zhu Ji (硃績)',
  'claim-291': 'Hu Wei’s visit while his father governed Jing',
  'claim-326': 'Hu Zhi’s tenure as Jing inspector',
};

function eventFor(claim) {
  const v = claim.value ?? {};
  if (typeof v.event === 'string' && v.event.trim().length >= 10) return v.event.trim();
  if (v.dateContext?.event && v.dateContext.event.length >= 10) return v.dateContext.event;
  if (v.sourceDate?.text) return `${v.sourceDate.text} in Hu Wei biography span (s0058–s0092)`;
  if (v.label?.zh) return `${v.label.zh} (Hu family biography)`;
  if (claim.id === 'claim-242') return 'Biography heading for Hu Wei (胡威)';
  return `Hu Wei family temporal record (${claim.id})`;
}

function witness(claim) {
  const pin = QUOTE[claim.id];
  if (!pin) throw new Error(`Missing quote pin for ${claim.id}`);
  const u = unitMap.get(pin.unit);
  if (!u?.zh.includes(pin.quote)) throw new Error(`Quote not in ${pin.unit}: ${pin.quote}`);
  return [{ unit: pin.unit, quote: pin.quote }];
}

function judge(claim) {
  const evidence = witness(claim);
  const event = eventFor(claim);
  const base = { id: claim.id, evidence, event };

  if (UNDATED_OK.has(claim.id)) {
    return {
      ...base,
      verdict: 'supported',
      reason:
        claim.id === 'claim-242'
          ? 's0058 is the section heading only; undated heading attestation is correct and does not invent chronology.'
          : claim.id === 'claim-343'
            ? 's0092 lists Hu Pi’s peak offices without a reign year; undated career ceiling is the correct source representation.'
            : 's0075–s0085 narrate Jin offices under Emperor Wu without year markers; undated career summary is correct rather than fabricating regnal years.',
    };
  }

  if (TAIKANG_EXPLICIT.has(claim.id)) {
    return {
      ...base,
      verdict: 'supported',
      reason:
        's0086 explicitly states 太康元年 for death in office, posthumous grants, and 諡曰烈; Western AD 280 matches the standard Taikang inaugural year.',
    };
  }

  if (SUCCESSION_TAIKANG.has(claim.id)) {
    return {
      ...base,
      verdict: 'supported',
      reason:
        claim.id === 'claim-334'
          ? 's0087 子奕嗣 follows immediately after the Taikang 1 death sentence on s0086; succession on or after AD 280 is anchored to explicit 太康元年 in the same closure.'
          : 's0086–s0087 tie heir succession to the Taikang 1 death notice; the onOrAfter AD 280 bound is biography-local, not an invented interval.',
    };
  }

  if (WEI_SERVE_IMPORT.has(claim.id)) {
    const who = PERSON_LABEL[claim.id];
    return {
      ...base,
      verdict: 'research-blocked',
      reason: `s0061 names ${who} among figures who 仕魏, but the sentence does not state AD 266 or any Western bound; certifying onOrBefore 266 requires pinned Wei–Jin political chronology outside this clause.`,
    };
  }

  if (JING_FRAME_IMPORT.has(claim.id)) {
    return {
      ...base,
      verdict: 'research-blocked',
      reason: `${PERSON_LABEL[claim.id]}: 質之為荊州也 frames the episode without a regnal or Western year; AD 266 onOrBefore is imported from Hu Zhi’s career reconstruction, not explicit source wording on the cited unit.`,
    };
  }

  if (COURT_BEFORE_DEATH.has(claim.id)) {
    return {
      ...base,
      verdict: 'research-blocked',
      reason:
        's0077 後入朝，武帝語及平生 precedes the Taikang 1 death line narratively but does not state a year; onOrBefore AD 280 is sequence inference—hold until bounded by an explicit reign marker or accepted undated attestation.',
    };
  }

  throw new Error(`Unhandled claim in Hu Wei span: ${claim.id}`);
}

function loadPriorItemChecks() {
  const paths = [
    'partial-date-report-preface-20261124.json',
    'partial-date-report-lu-zhi-20261124.json',
  ];
  const byId = new Map();
  for (const file of paths) {
    const report = JSON.parse(fs.readFileSync(path.join(OUT_DIR, file), 'utf8'));
    for (const check of report.itemChecks) {
      if (!byId.has(check.id)) byId.set(check.id, check);
    }
  }
  return byId;
}

const itemChecks = huItems.map(judge);
const findings = [];

const weiServe = itemChecks.filter((c) => WEI_SERVE_IMPORT.has(c.id)).map((c) => c.id);
if (weiServe.length) {
  findings.push({
    items: weiServe,
    problem: 'Shared s0061 仕魏 clause assigns identical Western onOrBefore AD 266 bounds to Hu Zhi, Jiang Ji, and Zhu Ji without sentence-level years.',
    action: 'Research each figure’s Wei service independently or store undated 仕魏 only; do not certify one bound for all three persons.',
  });
}

const jingFrame = itemChecks.filter((c) => JING_FRAME_IMPORT.has(c.id)).map((c) => c.id);
if (jingFrame.length) {
  findings.push({
    items: jingFrame,
    problem: '質之為荊州也 narrative frame lacks explicit dating on s0063 (and related units for Hu Zhi’s posting).',
    action: 'Pin Hu Zhi’s Jing tenure from external tables or keep event-only records; block Western AD 266 endpoints until sourced.',
  });
}

if (itemChecks.some((c) => c.id === 'claim-330' && c.verdict === 'research-blocked')) {
  findings.push({
    items: ['claim-330'],
    problem: 'Emperor Wu court exchange has no reign year despite onOrBefore Taikang 1 geometry on the claim.',
    action: 'Accept undated Jin service under Wu Di or add explicit reign citation before certifying AD 280 upper bound.',
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
    name: 'Independent source chronology reviewer Jinshu 090 (Hu Wei family group)',
    agentId: REVIEWER,
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    'Partial review of 胡威 family units s0058–s0092. Supported explicit 太康元年 death/posthumous cluster, heir succession, and undated career attestations; blocked imported Wei/Jing bounds on shared s0061/s0063 contexts and pre-death court bound. Not chapter approval.',
  reviewedUnits: HU_UNITS,
  itemChecks,
  personChecks: [],
  findings,
  references: [],
  scope: {
    group: GROUP_ID,
    label: '胡威 family',
    units: 's0058–s0092',
    itemCount: itemChecks.length,
    contextGroups: [
      { label: 'Taikang 1 closure (s0086–s0087)', itemIds: ['claim-287', 'claim-288', 'claim-289', 'claim-290', 'claim-334', 'claim-336'] },
      { label: 's0061 仕魏 contemporaries', itemIds: weiServe },
      { label: 's0063 Jing visit frame', itemIds: jingFrame },
    ],
    nextUntouchedGroup: { label: '杜軫 Du Zhen', unitRange: 's0093–s0135', nextClaimId: 'claim-368' },
  },
  carriedForward: {
    priorUniqueItemIdsReviewed: 76,
    editorialDecisionsPreserved: 50,
    prefaceIncorrect: ['claim-60'],
  },
};

validateDateAuditReport(report, packet);

const reportPath = path.join(OUT_DIR, 'partial-date-report-hu-wei-20261124.json');
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

const priorById = loadPriorItemChecks();
for (const check of itemChecks) priorById.set(check.id, check);

const cumulativeIds = [...priorById.keys()].sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]));
const uniqueChecks = [...priorById.values()];

const verdictRollup = (checks) =>
  Object.fromEntries(
    ['supported', 'incorrect', 'research-blocked'].map((v) => [v, checks.filter((c) => c.verdict === v).length]),
  );

const priorIds = new Set(JSON.parse(
  fs.readFileSync(path.join(OUT_DIR, 'chronology-cumulative-checkpoint-20261124.json'), 'utf8'),
).uniqueCoverage.itemIds);
const huIds = itemChecks.map((c) => c.id);
const uniqueNew = huIds.filter((id) => !priorIds.has(id));
const overlap = huIds.filter((id) => priorIds.has(id));

const scope = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), 'utf8'));
const allUnits = new Set();
for (const g of scope.completedGroups) {
  if (g.units) for (const u of g.units) allUnits.add(u);
}
for (const u of HU_UNITS) allUnits.add(u);

scope.completedGroups = scope.completedGroups.filter((g) => g.id !== GROUP_ID);
scope.completedGroups.push({
  id: GROUP_ID,
  units: HU_UNITS,
  reportFile: 'partial-date-report-hu-wei-20261124.json',
  itemChecks: itemChecks.length,
  uniqueNewItemIds: uniqueNew.length,
  overlapWithPriorGroups: overlap,
  verdicts: verdictRollup(itemChecks),
});
scope.untouchedGroups = scope.untouchedGroups.filter((g) => g.id !== GROUP_ID);
scope.cumulative = {
  uniqueItemIdsReviewed: cumulativeIds.length,
  uniqueUnitsReviewed: allUnits.size,
  itemIds: cumulativeIds,
  verdicts: verdictRollup(uniqueChecks),
  nextUnreviewedClaimId: 'claim-368',
  nextUnitRange: 's0093–s0135',
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), `${JSON.stringify(scope, null, 2)}\n`);

const cumulative = {
  schemaVersion: 1,
  kind: 'chronology-cumulative-evidence',
  book: 'jinshu',
  chapter: '090',
  packetHashes: { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash },
  groups: ['preface', 'lu-zhi', GROUP_ID],
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
      nextClaimId: 'claim-368',
      verdicts: verdictRollup(itemChecks),
    },
    null,
    2,
  ),
);