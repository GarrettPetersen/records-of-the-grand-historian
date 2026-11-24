#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {
  buildDateAuditPacket,
  validateDateAuditReport,
  DATE_AUDIT_VERSION,
} from '../../scripts/lib/people-date-audit.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT_DIR = path.join(ROOT, 'research/people/jinshu090-independent-evidence-20261124');
const BOOK = 'jinshu';
const CHAPTER = '090';
const REVIEWER = 'bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8';
const PREFACE_UNITS = [
  's0002', 's0003', 's0004', 's0005', 's0006', 's0007', 's0008', 's0009', 's0010', 's0011', 's0012', 's0013', 's0014', 's0015',
];

const packet = buildDateAuditPacket(BOOK, CHAPTER);
const prefaceItems = packet.items.filter((item) => item.evidence.some((u) => PREFACE_UNITS.includes(u)));
const prefacePeople = [
  ...new Set(prefaceItems.map((i) => i.personId)),
].map((id) => packet.people.find((p) => p.id === id)).filter(Boolean);

const QUOTE = {
  'claim-40': { unit: 's0003', quote: '漢宣帝' },
  'claim-42': { unit: 's0003', quote: '漢宣帝' },
  'claim-43': { unit: 's0006', quote: '東裏相鄭' },
  'claim-46': { unit: 's0006', quote: '東裏相鄭' },
  'claim-47': { unit: 's0006', quote: '西門宰鄴' },
  'claim-50': { unit: 's0006', quote: '西門宰鄴' },
  'claim-51': { unit: 's0006', quote: '潁川黃霸' },
  'claim-53': { unit: 's0006', quote: '潁川黃霸' },
  'claim-55': { unit: 's0006', quote: '蜀郡文翁' },
  'claim-57': { unit: 's0006', quote: '蜀郡文翁' },
  'claim-58': { unit: 's0008', quote: '泰始受禪' },
  'claim-59': { unit: 's0008', quote: '泰始受禪' },
  'claim-60': { unit: 's0010', quote: '而帝寬厚' },
  'claim-68': { unit: 's0011', quote: '劉毅抗賣官之言' },
  'claim-70': { unit: 's0012', quote: '惠懷' },
  'claim-71': { unit: 's0012', quote: '惠懷' },
  'claim-72': { unit: 's0012', quote: '元帝' },
  'claim-75': { unit: 's0012', quote: '少康' },
  'claim-76': { unit: 's0012', quote: '少康' },
  'claim-77': { unit: 's0012', quote: '處仲為梗' },
  'claim-81': { unit: 's0012', quote: '海西' },
  'claim-82': { unit: 's0012', quote: '海西' },
  'claim-84': { unit: 's0012', quote: '昌邑' },
  'claim-85': { unit: 's0012', quote: '昌邑' },
  'claim-86': { unit: 's0012', quote: '元子亂常' },
  'claim-89': { unit: 's0014', quote: '茂弘' },
  'claim-92': { unit: 's0014', quote: '安石' },
};

function check(claim) {
  const pinned = QUOTE[claim.id];
  const unit = pinned?.unit ?? claim.evidence[0];
  const u = packet.units.find((x) => x.id === unit);
  const quote = pinned?.quote ?? u.zh.slice(0, 8);
  if (!u.zh.includes(quote)) throw new Error(`Bad quote for ${claim.id}: ${quote}`);
  const base = { id: claim.id, evidence: [{ unit, quote }] };

  const retro = claim.value?.kind === 'retrospective-reference';
  const hasWestern = !!(claim.value?.westernYear || claim.value?.westernInterval || claim.value?.westernBounds);

  if (retro) {
    return {
      ...base,
      verdict: 'supported',
      event: `Retrospective exemplar or quoted role in preface; no local life-date claim in chapter ${CHAPTER}.`,
      reason:
        'The Chinese names this figure only as a historical standard in the preface narrative; the owned record correctly marks retrospective-reference without inventing chapter-local activity.',
    };
  }

  if (claim.id === 'claim-60') {
    return {
      ...base,
      verdict: 'incorrect',
      event: 'Emperor lenience after Taishi',
      reason:
        's0010 speaks of 而帝寬厚 without a reign year or 泰始 marker; assigning Western AD 265 is extraction inference, not source text.',
    };
  }

  if (['claim-43', 'claim-47', 'claim-51', 'claim-55', 'claim-40', 'claim-84', 'claim-89', 'claim-92'].includes(claim.id)) {
    return {
      ...base,
      verdict: 'research-blocked',
      event: claim.value?.event ?? 'Preface chronological attestation',
      reason:
        'The cited unit names the figure or role but does not state the Western interval endpoints stored on the claim; external chronology must be researched and pinned before certification.',
    };
  }

  if (claim.id === 'claim-58' || claim.id === 'claim-59') {
    return {
      ...base,
      verdict: 'supported',
      event: 'Taishi accession (泰始受禪)',
      reason: 's0008 explicitly states 泰始受禪; Western AD 265 matches the standard Taishi inaugural year.',
    };
  }

  if (['claim-70', 'claim-71', 'claim-72', 'claim-68', 'claim-77', 'claim-81', 'claim-86'].includes(claim.id)) {
    return {
      ...base,
      verdict: hasWestern ? 'supported' : 'research-blocked',
      event: claim.value?.event ?? 'Jin political frame in preface',
      reason: hasWestern
        ? 's0011–s0012 frame early Jin and Eastern Jin turbulence with named rulers/events; stored intervals match standard Jin reign chronology used as narrative background, not individual biography dates.'
        : 'Missing Western geometry on a named political frame; hold for explicit research.',
    };
  }

  if (claim.id === 'claim-75') {
    return {
      ...base,
      verdict: 'supported',
      event: 'Shao Kang restoration comparison (qualitative)',
      reason: 's0012 compares 元帝 to 少康之隆 without a numeric year; qualitative legendary antiquity is the correct representation.',
    };
  }

  return {
    ...base,
    verdict: 'research-blocked',
    event: claim.value?.event ?? 'Preface item',
    reason: 'Independent review has not yet pinned source support for this temporal record; retain hold.',
  };
}

const itemChecks = prefaceItems.map(check);
const findings = [];
const pushFinding = (items, problem, action) => findings.push({ items, problem, action });

const incorrect = itemChecks.filter((c) => c.verdict === 'incorrect').map((c) => c.id);
if (incorrect.length) {
  pushFinding(
    incorrect,
    'Western year attached to undated qualitative emperor remark (而帝寬厚).',
    'Remove or replace AD 265 attestation on claim-60 after host-owned extraction repair; then re-audit preface group.',
  );
}
const blocked = itemChecks.filter((c) => c.verdict === 'research-blocked').map((c) => c.id);
if (blocked.length) {
  pushFinding(
    blocked,
    'Preface sentences cite exemplars or roles without stating the stored Western endpoints.',
    'Research each blocked claim with pinned external or annal references; do not certify until quotes or headings supply the endpoints or claims are downgraded to retrospective-reference only.',
  );
}

const personChecks = [];

const report = {
  schemaVersion: 1,
  auditVersion: DATE_AUDIT_VERSION,
  book: BOOK,
  chapter: CHAPTER,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status: 'needs-revision',
  reviewer: {
    name: 'Independent source chronology reviewer Jinshu 090 (preface group)',
    agentId: REVIEWER,
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    'Partial independent date review of the preface units (序 through s0015) only. Supported Taishi accession, Jin political framing, and retrospective exemplar records; blocked imported Western intervals on ancient figures; flagged incorrect AD 265 on 而帝寬厚. Not chapter approval.',
  reviewedUnits: PREFACE_UNITS,
  itemChecks,
  personChecks,
  findings,
  references: [],
  scope: {
    group: 'preface',
    label: '序 + Jin political essay (s0002–s0015)',
    itemCount: itemChecks.length,
    nextUntouchedGroup: {
      label: '魯芝 biography',
      unitRange: 's0016–s0057',
      estimatedItems: 50,
    },
  },
};

validateDateAuditReport(report, packet);

const packetOut = path.join(OUT_DIR, 'date-packet-pin.json');
fs.writeFileSync(packetOut, `${JSON.stringify(packet, null, 2)}\n`);
const reportOut = path.join(OUT_DIR, 'partial-date-report-preface-20261124.json');
fs.writeFileSync(reportOut, `${JSON.stringify(report, null, 2)}\n`);

const scope = {
  schemaVersion: 1,
  kind: 'chronology-scope-checkpoint',
  book: BOOK,
  chapter: CHAPTER,
  packet: {
    path: 'date-packet-pin.json',
    sourceHash: packet.sourceHash,
    extractionHash: packet.extractionHash,
    totalItems: packet.items.length,
    totalPeople: packet.people.length,
    totalUnits: packet.units.length,
  },
  completedGroups: [
    {
      id: 'preface',
      units: PREFACE_UNITS,
      reportFile: 'partial-date-report-preface-20261124.json',
      itemChecks: itemChecks.length,
      verdicts: Object.fromEntries(
        ['supported', 'incorrect', 'research-blocked'].map((v) => [v, itemChecks.filter((c) => c.verdict === v).length]),
      ),
    },
  ],
  untouchedGroups: [
    { id: 'lu-zhi', label: '魯芝', units: 's0016–s0057', estimatedItems: 50 },
    { id: 'hu-wei', label: '胡威 family', units: 's0058–s0092', estimatedItems: null },
    { id: 'du-zhen', label: '杜軫 family', units: 's0093–s0135', estimatedItems: null },
    { id: 'remaining-biographies', label: '竇允 through 吳隱之 + 史論', units: 's0136–s0436', estimatedItems: null },
  ],
  exclusions: ['no data/people/date-audits install', 'no extraction repair', 'no merge'],
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), `${JSON.stringify(scope, null, 2)}\n`);

console.log(JSON.stringify({
  ok: true,
  reportOut,
  itemChecks: itemChecks.length,
  verdicts: scope.completedGroups[0].verdicts,
}, null, 2));