#!/usr/bin/env node
/**
 * Du Zhen family partial date review: units s0093–s0135 (杜軫及子弟).
 */
import fs from 'node:fs';
import path from 'node:path';
import { validateDateAuditReport, DATE_AUDIT_VERSION } from '../../scripts/lib/people-date-audit.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT_DIR = path.join(ROOT, 'research/people/jinshu090-independent-evidence-20261124');
const REVIEWER = 'bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8';
const GROUP_ID = 'du-zhen';
const PRIOR_REPORTS = [
  'partial-date-report-preface-20261124.json',
  'partial-date-report-lu-zhi-20261124.json',
  'partial-date-report-hu-wei-20261124.json',
];

const packet = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'date-packet-pin.json'), 'utf8'));
const DU_UNITS = packet.units
  .map((u) => u.id)
  .filter((id) => {
    const n = Number(id.slice(1));
    return n >= 93 && n <= 135;
  })
  .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
const unitMap = new Map(packet.units.map((u) => [u.id, u]));
const duItems = packet.items.filter((item) => item.evidence.some((u) => DU_UNITS.includes(u)));

const QUOTE = {
  'claim-368': { unit: 's0110', quote: '會病卒' },
  'claim-369': { unit: 's0110', quote: '年五十一' },
  'claim-370': { unit: 's0098', quote: '時鄧艾至成都' },
  'claim-371': { unit: 's0110', quote: '當遷，會病卒' },
  'claim-379': { unit: 's0095', quote: '綿竹令' },
  'claim-383': { unit: 's0096', quote: '師事譙周' },
  'claim-386': { unit: 's0098', quote: '白太守' },
  'claim-392': { unit: 's0098', quote: '鄧艾至成都' },
  'claim-398': { unit: 's0100', quote: '艾果遣其參軍牽弘' },
  'claim-404': { unit: 's0108', quote: '蜀有二郎' },
  'claim-413': { unit: 's0117', quote: '毗南渡江' },
  'claim-417': { unit: 's0118', quote: '遂遇害' },
  'claim-418': { unit: 's0117', quote: '及洛陽覆沒' },
  'claim-419': { unit: 's0118', quote: '杜弢遣軍要毗' },
  'claim-426': { unit: 's0116', quote: '參太傅軍事' },
  'claim-429': { unit: 's0117', quote: '王敦表為益州刺史' },
  'claim-433': { unit: 's0117', quote: '柳純共固白帝' },
  'claim-435': { unit: 's0118', quote: '杜弢遣軍' },
  'claim-442': { unit: 's0124', quote: '見害' },
  'claim-443': { unit: 's0123', quote: '州沒' },
  'claim-446': { unit: 's0122', quote: '為羅尚主簿' },
  'claim-449': { unit: 's0123', quote: '李驤' },
  'claim-453': { unit: 's0125', quote: '舉秀才' },
  'claim-465': { unit: 's0131', quote: '病卒' },
  'claim-466': { unit: 's0129', quote: '察孝廉' },
  'claim-477': { unit: 's0135', quote: '補州大中正，卒' },
  'claim-478': { unit: 's0135', quote: '不就' },
};

const DENG_AI_UNRESOLVED = new Set(['claim-370', 'claim-386', 'claim-392', 'claim-398']);
const LUOYANG_UNRESOLVED = new Set(['claim-413', 'claim-418', 'claim-429', 'claim-433']);
const UNDATED_OK = new Set([
  'claim-371', 'claim-379', 'claim-383', 'claim-404', 'claim-419', 'claim-426',
  'claim-435', 'claim-443', 'claim-446', 'claim-449', 'claim-453', 'claim-466', 'claim-478',
]);
const EXPLICIT_AGE_DEATH = new Set(['claim-368', 'claim-369']);
const UNDATED_DEATH = new Set(['claim-417', 'claim-442', 'claim-465', 'claim-477']);

const DENG_AI_REASON = {
  'claim-370': 'Du Zhen’s counsel to the administrator is framed only by 時鄧艾至成都 on s0098, with no 年号 or Western year in the biography.',
  'claim-386': 'The Chengdu administrator’s exit (太守乃出, narrative sequel) inherits the same 時-only frame on s0098; no regnal year states when the office changed.',
  'claim-392': 'Deng Ai’s arrival is named on s0098 but the chapter supplies no dated reign heading for the Shu capitulation episode; retain unresolved rather than certify AD 263 by inference.',
  'claim-398': 'Qian Hong’s mission on s0100 follows the 時鄧艾至成都 frame without an explicit year on the quoted sentence; do not import a Western date from external annals in this pass.',
};

const LUOYANG_REASON = {
  'claim-413': 'Du Pi’s southward crossing is tied to 及洛陽覆沒 on s0117; the biography names the catastrophe without a reign year or Western date.',
  'claim-418': 'The same s0117 clause gives 及洛陽覆沒 as narrative frame only; unresolvedReason on the claim matches source silence on year.',
  'claim-429': 'Wang Dun’s Yi inspector nomination on s0117 sits inside the 洛陽覆沒 sentence without its own year marker; block Western dating until the fall is explicitly dated in source or annals.',
  'claim-433': 'Liu Chun’s Baidi defense pairing on s0117 shares the undated 洛陽覆沒 frame; hold interval endpoints, not the undated coalition fact.',
};

const DEATH_REASON = {
  'claim-417': 's0118 states Du Pi was intercepted and killed (遂遇害) without a year; manner-of-death attestation is correct; no Western year is stated.',
  'claim-442': 's0124 秀不受，見害 records execution after refusal without reign or Western year.',
  'claim-465': 's0131 病卒 ends Du Lie’s career narrative with illness death only; undated death is the proper representation.',
  'claim-477': 's0135 ends Du Liang’s career with 卒 after declined posts; no year appears on the sentence.',
};

function eventFor(claim) {
  const v = claim.value ?? {};
  if (typeof v.event === 'string' && v.event.trim().length >= 10) return v.event.trim();
  if (v.dateContext?.event && v.dateContext.event.length >= 10) return v.dateContext.event;
  if (v.sourceDate?.text) return `${v.sourceDate.text} in Du Zhen biography span (s0093–s0135)`;
  if (claim.id === 'claim-379') return 'Father Du Xiong as Mianzhu magistrate (綿竹令)';
  return `Du Zhen family temporal record (${claim.id})`;
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

  if (EXPLICIT_AGE_DEATH.has(claim.id)) {
    return {
      ...base,
      verdict: 'supported',
      reason:
        claim.id === 'claim-369'
          ? 's0110 explicitly gives 年五十一 at death; sui age is source text, not an invented Western calendar year.'
          : 's0110 當遷，會病卒 states illness death at promotion juncture without a reign year; death cause and timing relative to 當遷 are explicit, Western year remains absent.',
    };
  }

  if (UNDATED_OK.has(claim.id)) {
    return {
      ...base,
      verdict: 'supported',
      reason:
        claim.value?.undatedSourceAttestation === true
          ? 'The cited unit supplies offices, kinship, or career facts without temporal markers; undatedSourceAttestation is the correct representation.'
          : 'Biography text names roles or episodes without years; supported as undated attestation.',
    };
  }

  if (DENG_AI_UNRESOLVED.has(claim.id)) {
    return {
      ...base,
      verdict: 'research-blocked',
      reason: DENG_AI_REASON[claim.id],
    };
  }

  if (LUOYANG_UNRESOLVED.has(claim.id)) {
    return {
      ...base,
      verdict: 'research-blocked',
      reason: LUOYANG_REASON[claim.id],
    };
  }

  if (UNDATED_DEATH.has(claim.id)) {
    return {
      ...base,
      verdict: 'supported',
      reason: DEATH_REASON[claim.id],
    };
  }

  throw new Error(`Unhandled claim in Du Zhen span: ${claim.id}`);
}

function loadPriorItemChecks() {
  const byId = new Map();
  for (const file of PRIOR_REPORTS) {
    const report = JSON.parse(fs.readFileSync(path.join(OUT_DIR, file), 'utf8'));
    for (const check of report.itemChecks) {
      if (!byId.has(check.id)) byId.set(check.id, check);
    }
  }
  return byId;
}

const findings = [];

const dengAi = [...DENG_AI_UNRESOLVED];
findings.push({
  items: dengAi,
  problem: 'Shared 時鄧艾至成都 narrative (s0098–s0100) introduces the Wei conquest of Chengdu without regnal or Western dating in chapter text.',
  action: 'Keep claims unresolved or pin AD 263 (or other) only with explicit souring beyond 時; separate judgments per actor (Du Zhen, administrator, Deng Ai, Qian Hong).',
});

const luoyang = [...LUOYANG_UNRESOLVED];
findings.push({
  items: luoyang,
  problem: '及洛陽覆沒 on s0117 anchors Du Pi’s flight and Wang Dun’s Yi nomination without a stated year.',
  action: 'Research Yongjia-era chronology externally or retain undated event records; do not certify identical Western intervals for Pi, Wang Dun, and Liu Chun from one undated clause.',
});

const itemChecks = duItems.map(judge);

const report = {
  schemaVersion: 1,
  auditVersion: DATE_AUDIT_VERSION,
  book: 'jinshu',
  chapter: '090',
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status: 'needs-revision',
  reviewer: {
    name: 'Independent source chronology reviewer Jinshu 090 (Du Zhen family group)',
    agentId: REVIEWER,
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    'Partial review of 杜軫 family units s0093–s0135. Supported undated careers/deaths and explicit sui-fifty-one death; blocked Western dating on 時鄧艾至成都 and 及洛陽覆沒 frames shared across multiple persons. Not chapter approval.',
  reviewedUnits: DU_UNITS,
  itemChecks,
  personChecks: [],
  findings,
  references: [],
  scope: {
    group: GROUP_ID,
    label: '杜軫 family',
    units: 's0093–s0135',
    itemCount: itemChecks.length,
    contextGroups: [
      { label: '時鄧艾至成都 (Shu capitulation frame)', itemIds: dengAi },
      { label: '及洛陽覆沒 (southward crisis frame)', itemIds: luoyang },
      { label: 'Du Zhen death age (s0110)', itemIds: ['claim-368', 'claim-369', 'claim-371'] },
    ],
    nextUntouchedGroup: { label: '竇允 through 吳隱之 + 史論', unitRange: 's0136–s0436', nextClaimId: 'claim-479' },
  },
  carriedForward: {
    priorUniqueItemIdsReviewed: 91,
    editorialDecisionsPreserved: 50,
    prefaceIncorrect: ['claim-60'],
  },
};

validateDateAuditReport(report, packet);

const reportPath = path.join(OUT_DIR, 'partial-date-report-du-zhen-20261124.json');
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
const duIds = itemChecks.map((c) => c.id);
const uniqueNew = duIds.filter((id) => !priorIds.has(id));
const overlap = duIds.filter((id) => priorIds.has(id));

const scope = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), 'utf8'));
const allUnits = new Set();
for (const g of scope.completedGroups) {
  if (g.units) for (const u of g.units) allUnits.add(u);
}
for (const u of DU_UNITS) allUnits.add(u);

scope.completedGroups = scope.completedGroups.filter((g) => g.id !== GROUP_ID);
scope.completedGroups.push({
  id: GROUP_ID,
  units: DU_UNITS,
  reportFile: 'partial-date-report-du-zhen-20261124.json',
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
  nextUnreviewedClaimId: 'claim-479',
  nextUnitRange: 's0136–s0436',
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), `${JSON.stringify(scope, null, 2)}\n`);

const cumulative = {
  schemaVersion: 1,
  kind: 'chronology-cumulative-evidence',
  book: 'jinshu',
  chapter: '090',
  packetHashes: { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash },
  groups: ['preface', 'lu-zhi', 'hu-wei', GROUP_ID],
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
      nextClaimId: 'claim-479',
      verdicts: verdictRollup(itemChecks),
    },
    null,
    2,
  ),
);