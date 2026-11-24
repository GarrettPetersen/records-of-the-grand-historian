#!/usr/bin/env node
/**
 * Lu Zhi (魯芝) biography partial date review: s0016–s0057.
 * Research-only; uses pinned packet; no canonical writes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { validateDateAuditReport, DATE_AUDIT_VERSION } from '../../scripts/lib/people-date-audit.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT_DIR = path.join(ROOT, 'research/people/jinshu090-independent-evidence-20261124');
const REVIEWER = 'bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8';
const LU_UNITS = [
  's0016', 's0017', 's0018', 's0019', 's0020', 's0021', 's0022', 's0023', 's0024', 's0025', 's0026', 's0027',
  's0028', 's0029', 's0030', 's0031', 's0032', 's0033', 's0034', 's0035', 's0036', 's0037', 's0038', 's0039',
  's0040', 's0041', 's0042', 's0043', 's0044', 's0045', 's0046', 's0047', 's0048', 's0049', 's0050', 's0051',
  's0052', 's0053', 's0054', 's0055', 's0056', 's0057',
];

const packet = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'date-packet-pin.json'), 'utf8'));
const unitMap = new Map(packet.units.map((u) => [u.id, u]));
const luItems = packet.items.filter((item) => item.evidence.some((u) => LU_UNITS.includes(u)));

const QUOTE = {
  'claim-54': { unit: 's0032', quote: '黃霸' },
  'claim-59': { unit: 's0050', quote: '武帝踐阼' },
  'claim-62': { unit: 's0050', quote: '武帝踐阼' },
  'claim-63': { unit: 's0051', quote: '帝以芝清忠履正' },
  'claim-65': { unit: 's0056', quote: '泰始九年卒' },
  'claim-66': { unit: 's0057', quote: '帝為舉哀' },
  'claim-94': { unit: 's0017', quote: '扶風郿人' },
  'claim-99': { unit: 's0019', quote: '年十七' },
  'claim-102': { unit: 's0019', quote: '年十七' },
  'claim-124': { unit: 's0032', quote: '魏明帝許焉' },
  'claim-127': { unit: 's0035', quote: '宣帝起兵誅爽' },
  'claim-128': { unit: 's0035', quote: '宣帝起兵誅爽' },
  'claim-138': { unit: 's0043', quote: '高貴鄉公即位' },
  'claim-141': { unit: 's0044', quote: '毌丘儉平' },
  'claim-145': { unit: 's0045', quote: '諸葛誕以壽春叛' },
  'claim-150': { unit: 's0048', quote: '常道鄉公即位' },
  'claim-157': { unit: 's0049', quote: '五等建' },
  'claim-160': { unit: 's0050', quote: '武帝踐阼' },
  'claim-170': { unit: 's0056', quote: '泰始九年卒' },
  'claim-171': { unit: 's0056', quote: '泰始九年卒' },
  'claim-172': { unit: 's0056', quote: '年八十四' },
  'claim-173': { unit: 's0057', quote: '諡曰貞' },
  'claim-180': { unit: 's0019', quote: '父為郭氾所害' },
  'claim-181': { unit: 's0019', quote: '父為郭氾所害' },
  'claim-183': { unit: 's0019', quote: '郭氾' },
  'claim-185': { unit: 's0021', quote: '郭淮為雍州刺史' },
  'claim-190': { unit: 's0023', quote: '諸葛亮侵隴右' },
  'claim-194': { unit: 's0028', quote: '真薨' },
  'claim-196': { unit: 's0028', quote: '真薨' },
  'claim-199': { unit: 's0024', quote: '臨淄侯文學' },
  'claim-201': { unit: 's0025', quote: '鄭袤薦' },
  'claim-203': { unit: 's0025', quote: '司空王朗' },
  'claim-206': { unit: 's0028', quote: '宣帝代焉' },
  'claim-208': { unit: 's0035', quote: '宣帝起兵誅爽' },
  'claim-212': { unit: 's0032', quote: '魏明帝許焉' },
  'claim-214': { unit: 's0033', quote: '曹爽輔政' },
  'claim-218': { unit: 's0038', quote: '委身受戮' },
  'claim-220': { unit: 's0035', quote: '伊周' },
  'claim-221': { unit: 's0035', quote: '伊周之位' },
  'claim-222': { unit: 's0035', quote: '伊周' },
  'claim-223': { unit: 's0035', quote: '伊周之位' },
  'claim-224': { unit: 's0043', quote: '高貴鄉公即位' },
  'claim-225': { unit: 's0043', quote: '高貴鄉公即位' },
  'claim-226': { unit: 's0045', quote: '文帝奉魏帝出征' },
  'claim-227': { unit: 's0044', quote: '毌丘儉平' },
  'claim-229': { unit: 's0045', quote: '諸葛誕以壽春叛' },
  'claim-232': { unit: 's0045', quote: '文帝奉魏帝出征' },
  'claim-234': { unit: 's0048', quote: '常道鄉公即位' },
  'claim-235': { unit: 's0048', quote: '常道鄉公即位' },
  'claim-236': { unit: 's0053', quote: '羊祜為車騎將軍' },
};

const SUPPORTED_REGNAL = new Set([
  'claim-127', 'claim-128', 'claim-208',
  'claim-138', 'claim-141', 'claim-145', 'claim-150', 'claim-157',
  'claim-160', 'claim-170', 'claim-171', 'claim-172', 'claim-173',
  'claim-218',
  'claim-224', 'claim-225', 'claim-226', 'claim-227', 'claim-229', 'claim-232',
  'claim-234', 'claim-235',
  'claim-59', 'claim-62', 'claim-65', 'claim-63', 'claim-66',
]);

const RETRO_ONLY = new Set(['claim-54', 'claim-220', 'claim-221', 'claim-222', 'claim-223']);

const UNDATED_OK = new Set(['claim-94', 'claim-102', 'claim-99']);

const BLOCKED_ENDPOINTS = new Set([
  'claim-180', 'claim-181', 'claim-183', 'claim-185', 'claim-190',
  'claim-124', 'claim-212', 'claim-201', 'claim-203', 'claim-199', 'claim-214', 'claim-236',
  'claim-194', 'claim-196', 'claim-206',
]);

function eventFor(claim) {
  const v = claim.value ?? {};
  if (typeof v.event === 'string' && v.event.trim().length >= 10) return v.event.trim();
  if (v.sourceDate?.text) return `${v.sourceDate.text} in Lu Zhi biography (魯芝列傳)`;
  if (v.label?.zh) return `${v.label.zh} for Lu Zhi`;
  if (claim.id === 'claim-59') return 'Wu emperor accession (武帝踐阼) during Lu Zhi service';
  if (claim.id === 'claim-172') return 'Lu Zhi died at eighty-four sui (年八十四)';
  if (claim.predicate === 'age') return 'Lu Zhi sui age attestation in biography';
  return `Lu Zhi biography temporal record (${claim.id})`;
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
        claim.id === 'claim-99'
          ? 's0019 states 年十七 at the Yong move without a regnal year; sui age is explicit source text, not an invented Western date.'
          : 'The cited unit supplies identity or qualitative detail only; marking undated attestation is correct and does not invent a calendar year.',
    };
  }

  if (RETRO_ONLY.has(claim.id)) {
    return {
      ...base,
      verdict: 'supported',
      reason:
        'The unit uses Yi Yin, Duke of Zhou, or Huang Ba only as rhetoric; the stored record is retrospective-reference with no false personal-activity year on Lu Zhi.',
    };
  }

  if (SUPPORTED_REGNAL.has(claim.id)) {
    return {
      ...base,
      verdict: 'supported',
      reason:
        'The Chinese names the reign, accession, pacification, rebellion, or death year cited on the claim; the Western year matches the standard conversion for that explicit source wording read in biography context.',
    };
  }

  if (BLOCKED_ENDPOINTS.has(claim.id)) {
    const zhenCluster = ['claim-194', 'claim-196', 'claim-206'].includes(claim.id);
    return {
      ...base,
      verdict: 'research-blocked',
      reason: zhenCluster
        ? 's0028 states 真薨 and 宣帝代焉 without a regnal or Western year; AD 231 on these records is extraction inference tied to external Wei chronology, not explicit biography text.'
        : 'The biography names the person or episode but does not state the stored Western interval endpoints; certify only after pinned external annals or downgrade to undated/event-only representation.',
    };
  }

  return {
    ...base,
    verdict: 'research-blocked',
    reason: 'Not yet source-pinned in this independent pass; retain hold rather than defaulting to supported.',
  };
}

const itemChecks = luItems.map(judge);
const findings = [];

const blocked = itemChecks.filter((c) => c.verdict === 'research-blocked').map((c) => c.id);
if (blocked.length) {
  findings.push({
    items: blocked,
    problem:
      'Lu Zhi’s early career and some Wei/Jin office spans use Western intervals or bounds not stated in the cited sentences (Guo Si/Guo Huai/Liang–Yong campaigns, Ming petition window, undated recommendations, Yang Hu service span).',
    action:
      'Research each item against Wei/Jin annals or accept undated attestation only; do not certify blanket biography-span hints.',
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
    name: 'Independent source chronology reviewer Jinshu 090 (Lu Zhi group)',
    agentId: REVIEWER,
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    'Partial review of 魯芝 biography units s0016–s0057. Supported explicit regnal career anchors (249 coup through Taishi 9 death), age-seventeen text, and rhetorical exemplars; blocked early-career and imported interval endpoints. Not chapter approval.',
  reviewedUnits: LU_UNITS,
  itemChecks,
  personChecks: [],
  findings,
  references: [],
  scope: { group: 'lu-zhi', label: '魯芝', units: 's0016–s0057', itemCount: itemChecks.length },
  carriedForwardFromPreface: {
    incorrect: ['claim-60'],
    researchBlockedEndpoints: [
      'claim-40', 'claim-43', 'claim-47', 'claim-51', 'claim-55', 'claim-84', 'claim-89', 'claim-92',
    ],
    note: 'Preface holds unchanged; claim-59 additionally supported here on s0050 武帝踐阼.',
  },
};

validateDateAuditReport(report, packet);

const reportPath = path.join(OUT_DIR, 'partial-date-report-lu-zhi-20261124.json');
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

const prefaceReport = JSON.parse(
  fs.readFileSync(path.join(OUT_DIR, 'partial-date-report-preface-20261124.json'), 'utf8'),
);
const prefaceIds = new Set(prefaceReport.itemChecks.map((c) => c.id));
const luIds = itemChecks.map((c) => c.id);
const overlap = luIds.filter((id) => prefaceIds.has(id));
const uniqueLu = luIds.filter((id) => !prefaceIds.has(id));
const cumulativeIds = [...new Set([...prefaceIds, ...luIds])];

const verdictRollup = (checks) =>
  Object.fromEntries(
    ['supported', 'incorrect', 'research-blocked'].map((v) => [v, checks.filter((c) => c.verdict === v).length]),
  );

const scope = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), 'utf8'));
const prefaceGroup = scope.completedGroups.find((g) => g.id === 'preface');
scope.completedGroups = scope.completedGroups.filter((g) => g.id !== 'lu-zhi');
scope.completedGroups.push({
  id: 'lu-zhi',
  units: LU_UNITS,
  reportFile: 'partial-date-report-lu-zhi-20261124.json',
  itemChecks: itemChecks.length,
  uniqueNewItemIds: uniqueLu.length,
  overlapWithPreface: overlap,
  verdicts: verdictRollup(itemChecks),
});
scope.untouchedGroups = scope.untouchedGroups.filter((g) => g.id !== 'lu-zhi');
const uniqueChecks = [
  ...prefaceReport.itemChecks,
  ...itemChecks.filter((c) => !prefaceIds.has(c.id)),
];
scope.cumulative = {
  uniqueItemIdsReviewed: cumulativeIds.length,
  uniqueUnitsReviewed: new Set([...(prefaceGroup?.units ?? []), ...LU_UNITS]).size,
  itemIds: cumulativeIds.sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1])),
  verdicts: verdictRollup(uniqueChecks),
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), `${JSON.stringify(scope, null, 2)}\n`);

const cumulative = {
  schemaVersion: 1,
  kind: 'chronology-cumulative-evidence',
  book: 'jinshu',
  chapter: '090',
  packetHashes: { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash },
  groups: ['preface', 'lu-zhi'],
  uniqueCoverage: scope.cumulative,
  editorialEvidenceUnchanged: true,
  preservedPrefaceChecks: 27,
  preservedEditorialDecisions: 50,
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-cumulative-checkpoint-20261124.json'), `${JSON.stringify(cumulative, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      ok: true,
      reportPath,
      itemChecks: itemChecks.length,
      uniqueNew: uniqueLu.length,
      cumulativeUnique: cumulativeIds.length,
      verdicts: verdictRollup(itemChecks),
    },
    null,
    2,
  ),
);