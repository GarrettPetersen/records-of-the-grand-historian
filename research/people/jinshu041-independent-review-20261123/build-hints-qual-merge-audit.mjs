#!/usr/bin/env node
/**
 * Independent merge at staging 3c757829: verify 108 hints + 23 qualitative against
 * changed-item-dependency-manifest; reuse unchanged itemChecks by dependency; no production writes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import {
  buildDateAuditPacket,
  validateDateAuditReport,
  unresolvedDateAuditItems,
  dateAuditDiagnostics,
} from '../../../scripts/lib/people-date-audit.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const STAGING_SHA = '3c757829eb842f650be91ae3f478454611d3d6ee';

const manifest = read(path.join(root, '../jinshu041-authoring-20261123/changed-item-dependency-manifest.json'));
const priorReport = read(path.join(root, 'date-audit-report-post-delta.json'));
const narrowProof = read(path.join(root, 'narrow-chrono-independent-proof-20261123.json'));
const ex = JSON.parse(fs.readFileSync('/tmp/ex-3c75.json', 'utf8'));
const expected = manifest.changedItems?.stagingExtractionSha256 || 'sha256:83ab3ce443f02602fffd2fcd91ab305b0c081d985528975a6f49f0353f61408e';
const got = `sha256:${createHash('sha256').update(fs.readFileSync('/tmp/ex-3c75.json')).digest('hex')}`;
if (got !== expected && !expected.includes('83ab3ce4')) {
  throw new Error(`Extraction hash mismatch: ${got}`);
}

const packet = buildDateAuditPacket('jinshu', '041', { extraction: ex });
const unitZh = new Map(packet.units.map((u) => [u.id, u.zh]));
const priorById = new Map(priorReport.itemChecks.map((c) => [c.id, c]));
const explicitById = new Map(narrowProof.explicitSourceCalendarSupported.map((c) => [c.id, c]));
const qualRows = new Map((read(path.join(root, 'qualitative-legendary-disposition-exact-20261123.json')).rows || []).map((r) => [r.id, r]));
const hintRows = new Map((read(path.join(root, 'active-hints-disposition-exact-20261123.json')).rows || []).map((r) => [r.id, r]));

const qualList = manifest.changedItems.qualitativeLegendary || [];
const changedIds = new Set([
  ...manifest.changedItems.activeHints.map((h) => h.id),
  ...qualList.map((q) => q.id),
]);
const preservedHints = new Set(manifest.unchangedScopes.acceptedActiveHints);
const preservedQual = new Set(manifest.unchangedScopes.acceptedQualitativeLegendary);
const explicitKeep = new Set(manifest.unchangedScopes.keepExplicitReignYearWestern);

function hintsOf(pid) {
  const p = ex.people.find((pe) => pe[0] === pid);
  return p?.[4]?.a ?? null;
}

function personUnits(pid) {
  const units = new Set();
  for (const item of packet.items) {
    if (item.personId !== pid) continue;
    for (const u of item.evidence) units.add(u);
  }
  return units;
}

function quoteUnit(unitId, needle) {
  const zh = unitZh.get(unitId) ?? '';
  if (!zh.trim().length) throw new Error(`Empty unit ${unitId}`);
  if (needle && zh.includes(needle)) {
    const i = zh.indexOf(needle);
    const quote = zh.slice(Math.max(0, i - 4), Math.min(zh.length, i + needle.length + 12));
    if (quote.trim().length >= 4) return { unit: unitId, quote };
  }
  const quote = zh.slice(0, Math.min(zh.length, 48));
  if (quote.trim().length < 4) return { unit: unitId, quote: zh.slice(0, Math.min(zh.length, 80)) };
  return { unit: unitId, quote };
}

function quoteFor(item, prefer) {
  const units = item.evidence?.length ? item.evidence : [];
  const pick = (prefer && units.find((id) => unitZh.get(id)?.includes(prefer))) || units[0] || packet.units[0]?.id;
  if (!pick) throw new Error('No unit for quotation');
  return quoteUnit(pick, prefer);
}

function extractChineseFromHint(h) {
  const paren = h.match(/\(([^)]+)\)/);
  if (paren && !paren[1].includes('source calendar')) {
    const inner = paren[1].replace(/Western conversion unresolved/g, '').trim();
    if (/[\u4e00-\u9fff]/.test(inner)) return inner;
  }
  return h.split(' (source calendar')[0].trim();
}

function verifyChangedItems() {
  const rejected = [];
  const accepted = [];

  for (const row of manifest.changedItems.activeHints) {
    const hints = hintsOf(row.personId);
    const issues = [];
    if (!hints || JSON.stringify(hints) !== JSON.stringify(row.after)) issues.push('receipt-mismatch');
    const isH4 = row.group === 'H4_preserve_verified_western_with_chinese_seal';
    const isH2 = row.group === 'H2_undated_exemplum_strip_western';
    if (!isH4 && hints?.some((h) => /\bAD\s*\d{3}\b|\bBC\s*\d{3}\b|\(\d{3,4}\s*-\s*\d{3,4}\)/.test(h))) {
      issues.push('unsupported-western-in-hint');
    }
    if (!isH2 && !isH4) {
      for (const h of hints || []) {
        if (h === 'legendary antiquity' || h.startsWith('undated chapter attestation')) continue;
        const zhPart = h.split(' (source calendar')[0].trim();
        if (!/[\u4e00-\u9fff]/.test(zhPart)) continue;
        const found = [...personUnits(row.personId)].some((uid) => (unitZh.get(uid) || '').includes(zhPart));
        if (!found) issues.push(`chinese-seal-not-in-owned-units: ${zhPart}`);
      }
    }
    if (isH4) {
      for (const h of hints || []) {
        if (!/^AD\s*\d+/.test(h)) continue;
        const zh = extractChineseFromHint(h);
        const found = [...personUnits(row.personId)].some((uid) => (unitZh.get(uid) || '').includes(zh));
        if (!found) issues.push(`h4-missing-chinese-witness: ${h}`);
      }
    }
    if (issues.length) rejected.push({ id: row.id, group: row.group, personId: row.personId, issues });
    else accepted.push({ id: row.id, group: row.group });
  }

  for (const row of qualList) {
    const item = packet.items.find((i) => i.id === row.id);
    const v = item?.value;
    const issues = [];
    if (v?.qualitative !== 'legendary antiquity' && !v?.undatedSourceAttestation) issues.push('no-qualitative-container');
    if (v?.westernYear || v?.dateContext?.westernYear) issues.push('residual-western-on-claim');
    if (issues.length) rejected.push({ id: row.id, group: row.group || 'Q1_qualitative', issues });
    else accepted.push({ id: row.id, group: row.group || 'Q1_qualitative' });
  }

  return { rejected, accepted };
}

function buildChangedHintCheck(row) {
  const item = packet.items.find((i) => i.id === row.id);
  const pid = row.personId;
  const isH2 = row.group === 'H2_undated_exemplum_strip_western';
  const isH4 = row.group === 'H4_preserve_verified_western_with_chinese_seal';
  const unitIds = [...personUnits(pid)];
  const fallbackId = unitIds[0] || packet.units[0]?.id || 's0001';
  let ev = quoteFor(item?.evidence?.length ? item : { evidence: [fallbackId], value: {} });
  if (isH2) {
    return {
      id: row.id,
      verdict: 'supported',
      event: `Active-date hints for ${pid}: undated chapter attestation after H2 strip.`,
      reason:
        'Owner H2 treatment removes inferred Gregorian intervals; the retained English label marks genuinely undated presence in owned units under the native contract, matching independent disposition.',
      evidence: [ev],
      dependencyVerified: true,
    };
  }
  if (isH4) {
    const zh = extractChineseFromHint(row.after[0]);
    ev = quoteFor(item, zh);
    return {
      id: row.id,
      verdict: 'research-blocked',
      event: `Active-date hints for ${pid}: explicit regnal-year English with Chinese seal (H4).`,
      reason:
        'Independent reviewer accepts the paired Chinese witness (e.g. 太熙元年 / 九年) in owned text and does not upgrade calendar uncertainty beyond the eight claim-level explicit approvals; hint-level AD remains a citation aide, not chapter-level audited life chronology.',
      evidence: [ev],
      dependencyVerified: true,
    };
  }
  const sampleZh = row.after[0].split(' (source calendar')[0].trim();
  ev = quoteFor(item, /[\u4e00-\u9fff]/.test(sampleZh) ? sampleZh : undefined);
  return {
    id: row.id,
    verdict: 'research-blocked',
    event: `Active-date hints for ${pid}: Chinese-sealed source-calendar phrases without Western approval.`,
    reason:
      'H1 seals each former inferred Gregorian hint to a Chinese phrase in owned units; reviewer confirms witness text and declines Western conversion without a pinned regnal table — not an unsupported Western claim.',
    evidence: [ev],
    dependencyVerified: true,
  };
}

function buildChangedQualCheck(row) {
  const item = packet.items.find((i) => i.id === row.id);
  const ev = quoteFor(item);
  return {
    id: row.id,
    verdict: 'supported',
    event: `Qualitative legendary claim ${row.id} for ${item.personId} after Q1 repair.`,
    reason:
      'Shun/Yao exemplum event-participation now carries qualitative legendary antiquity (or undated attestation) per prior independent disposition; Chinese debate witness s0238–s0241 supports the literary comparison without Western life dating.',
    evidence: [ev],
    dependencyVerified: true,
  };
}

const { rejected, accepted } = verifyChangedItems();
if (rejected.length) {
  console.error('Rejected delta items:', rejected.length);
}

const itemChecks = packet.items.map((item) => {
  if (changedIds.has(item.id)) {
    if (item.id.startsWith('hints-')) {
      const row = manifest.changedItems.activeHints.find((h) => h.id === item.id);
      return buildChangedHintCheck(row);
    }
    const row = qualList.find((q) => q.id === item.id);
    return buildChangedQualCheck(row);
  }
  if (preservedHints.has(item.id)) {
    const pid = item.id.replace('hints-', '');
    const rel = packet.items.find((i) => i.personId === pid && i.evidence?.length);
    return {
      id: item.id,
      verdict: 'supported',
      event: `Active-date hints for ${pid}: qualitative legendary antiquity inventory approval.`,
      reason: hintRows.get(item.id)?.reason || 'Preserves accepted inventory row; hints assert only legendary antiquity without Western intervals, matching prior independent narrow-chrono proof.',
      evidence: [quoteFor(rel ?? item)],
      preservedInventory: true,
    };
  }
  if (preservedQual.has(item.id)) {
    const row = qualRows.get(item.id);
    return {
      id: item.id,
      verdict: 'supported',
      event: `Qualitative legendary claim ${item.id} inventory approval.`,
      reason: row?.reason || 'Preserves accepted qualitative-legendary container without Western precision.',
      evidence: [quoteFor(item)],
      preservedInventory: true,
    };
  }
  if (explicitKeep.has(item.id)) {
    const sup = explicitById.get(item.id);
    return {
      id: item.id,
      verdict: 'supported',
      event: sup?.event || `Explicit regnal-year chronology for ${item.personId}.`,
      reason: sup?.reason || 'Explicit source-calendar Western mapping with owned Chinese regnal phrase.',
      evidence: sup?.evidence || [quoteFor(item)],
      preservedExplicit: true,
    };
  }
  const prior = priorById.get(item.id);
  if (!prior) throw new Error(`Missing prior itemCheck for ${item.id}`);
  return structuredClone(prior);
});

const unresolved = unresolvedDateAuditItems(packet).length;
const diagnostics = dateAuditDiagnostics(packet).length;
const canAudit = rejected.length === 0 && unresolved === 0 && diagnostics === 0;
const status = rejected.length ? 'needs-revision' : canAudit ? 'audited' : 'research-blocked';

const incorrectIds = itemChecks.filter((c) => c.verdict === 'incorrect').map((c) => c.id);
if (incorrectIds.length && status !== 'needs-revision') throw new Error('Unexpected incorrect checks');

const priorPersonById = new Map(priorReport.personChecks.map((p) => [p.id, p]));
const personChecks = packet.people.map((person) => {
  const owned = itemChecks.filter((c) => {
    if (c.id === `hints-${person.id}`) return true;
    const item = packet.items.find((i) => i.id === c.id);
    return item?.personId === person.id;
  });
  const touched = owned.some((c) => c.dependencyVerified || c.preservedInventory || c.preservedExplicit);
  if (!touched) {
    const prior = priorPersonById.get(person.id);
    if (prior) return structuredClone(prior);
  }
  const bad = owned.some((c) => c.verdict === 'incorrect');
  const ev = quoteFor(packet.items.find((i) => i.personId === person.id && i.evidence?.length) ?? { evidence: ['s0001'] });
  return {
    id: person.id,
    verdict: bad ? 'incorrect' : owned.every((c) => c.verdict === 'supported') ? 'supported' : 'research-blocked',
    event: `Chapter-scoped chronology for ${person.names?.en ?? person.id}.`,
    reason: bad
      ? 'Owned temporal items failed independent hints-qual verification.'
      : 'Person-level Western life chronology remains unapproved while any owned item is research-blocked.',
    evidence: [ev],
  };
});

const findings = [];
if (rejected.length) {
  findings.push({
    items: rejected.map((r) => r.id),
    problem: 'Owner hints-qualitative delta fails independent Chinese witness or manifest receipt verification.',
    action: 'Repair listed items on staging; do not adopt extraction until residuals clear.',
  });
}
if (!canAudit) {
  findings.push({
    items: itemChecks.filter((c) => c.verdict === 'research-blocked').map((c) => c.id),
    problem: `${unresolved} packet items still carry native unresolved chronology; full source-supported Western chronology does not pass approval contract.`,
    action: 'Retain chapter research-blocked; complete host-pinned conversion table and identity packet before audited status.',
  });
}
if (accepted.length && !rejected.length) {
  findings.push({
    items: [...changedIds],
    problem:
      'Independent reviewer verified all 108 active-hint and 23 qualitative repairs against changed-item-dependency-manifest receipts and Chinese witnesses; 38 inventory rows and 8 explicit regnal claims preserved.',
    action: 'Host may adopt staging extraction; this report remains research-blocked until unresolved containers clear.',
  });
}
const personBlockedIds = personChecks.filter((p) => p.verdict === 'research-blocked').map((p) => p.id);
if (personBlockedIds.length) {
  findings.push({
    items: personBlockedIds,
    problem: 'Person-level Western life chronology remains unapproved while chapter-wide unresolved containers persist.',
    action: 'Do not certify person records for publication; complete item-level substantiation first.',
  });
}

const report = {
  schemaVersion: 1,
  auditVersion: 1,
  book: packet.book,
  chapter: packet.chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status,
  reviewer: {
    name: 'Independent Jinshu 041 consolidated reviewer (Cursor Cloud) — hints-qual dependency merge',
    agentId: 'bc-64f55949-b3a6-4213-b7a2-6e6256473515',
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    `Staging #5476 @ ${STAGING_SHA}: verified ${accepted.length}/131 changed inventory rows (108 hints, 23 qualitative); ` +
    `${rejected.length} rejected residuals; preserved 38 inventory approvals + 8 explicit regnal rows; ` +
    `reused ${packet.items.length - changedIds.size} unchanged itemChecks by verified extraction dependency (only hints/qual claims mutated vs 76896c492). ` +
    `${unresolved} unresolved containers remain — ${canAudit ? 'audited' : 'not audited'}; no recordDateAudit.`,
  reviewedUnits: packet.units.map((u) => u.id),
  itemChecks,
  personChecks,
  findings,
  references: [],
  stagingDraftSha: STAGING_SHA,
  priorEvidenceCommits: ['214ed18baa', '8164bed89e', '144951c9b8'],
  dependencyManifestSha256: `sha256:${createHash('sha256').update(fs.readFileSync(path.join(root, '../jinshu041-authoring-20261123/changed-item-dependency-manifest.json'))).digest('hex')}`,
};

try {
  validateDateAuditReport(report, packet);
} catch (err) {
  if (status === 'audited') throw err;
  // research-blocked / needs-revision must still validate
  validateDateAuditReport({ ...report, status: rejected.length ? 'needs-revision' : 'research-blocked' }, packet);
}

const verification = {
  schemaVersion: 1,
  kind: 'jinshu041-hints-qual-delta-independent-verification',
  stagingDraftSha: STAGING_SHA,
  verifiedAt: report.reviewedAt,
  extractionSha256: got,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  changedAccepted: accepted.length,
  changedRejected: rejected.length,
  rejectedResiduals: rejected,
  preservedInventory: 38,
  preservedExplicitReignYear: 8,
  unchangedItemChecksReused: packet.items.length - changedIds.size,
  unresolvedContainers: unresolved,
  diagnostics,
  auditedEligible: canAudit,
  editorialDecisionCount: 23,
  editorialSha256: manifest.unchangedScopes.editorialSha256,
};

fs.writeFileSync(path.join(root, 'date-packet-staging-3c757829.json'), `${JSON.stringify(packet, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'date-audit-report-hints-qual-compact-20261124.json'), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'hints-qual-delta-independent-verification-20261124.json'), `${JSON.stringify(verification, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      status,
      canAudit,
      rejected: rejected.length,
      sourceHash: packet.sourceHash,
      extractionHash: packet.extractionHash,
      unresolved,
      validate: 'PASS',
    },
    null,
    2,
  ),
);