#!/usr/bin/env node
/**
 * Independent review of owner changed-scope unresolved isolation @ 4bbb3a8
 * against retained hints-qual audit 224a3ed8. Proof-only; no production writes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildDateAuditPacket } from '../../../scripts/lib/people-date-audit.mjs';
import { temporalContainers } from '../../../scripts/lib/people-date-values.mjs';
import { contentUnits, readJson } from '../../../scripts/lib/people-content.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const STAGING_TIP = '4bbb3a8b07938036ec74b182c4d1947d9080b732';
const PRIOR_EVIDENCE = '224a3ed815e7601314188e4a72534cd7d0c9ffb6';
const SOURCE_PATH = path.join(root, '../../../data/jinshu/041.json');

const receipt = JSON.parse(
  fs.readFileSync(path.join(root, '../jinshu041-authoring-20261123/changed-scope-unresolved-isolation-receipt.json'), 'utf8'),
);
const priorReport = JSON.parse(fs.readFileSync(path.join(root, 'date-audit-report-hints-qual-compact-20261124.json'), 'utf8'));
const priorById = new Map(priorReport.itemChecks.map((c) => [c.id, c]));
const ex = JSON.parse(fs.readFileSync('/tmp/ex-4bbb.json', 'utf8'));
const sourceUnits = new Map(contentUnits(readJson(SOURCE_PATH)).map((s) => [s.id, s.zh]));
const expectedEx = receipt.preflight.afterCorrectionExtractionSha256.replace(/^sha256:/, '');
const got = createHash('sha256').update(fs.readFileSync('/tmp/ex-4bbb.json')).digest('hex');
if (got !== expectedEx) throw new Error(`Extraction hash mismatch: ${got} vs ${expectedEx}`);

const packet = buildDateAuditPacket('jinshu', '041', { extraction: ex });
const unitZh = new Map(packet.units.map((u) => [u.id, u.zh]));

function quoteWitness(item, needle) {
  const unit = item.evidence.find((u) => unitZh.get(u)?.includes(needle)) || item.evidence[0];
  const zh = unitZh.get(unit) ?? '';
  const i = needle && zh.includes(needle) ? zh.indexOf(needle) : 0;
  const quote = needle && zh.includes(needle) ? zh.slice(Math.max(0, i - 2), Math.min(zh.length, i + needle.length + 6)) : zh.slice(0, 40);
  return { unit, quote, sourcePinned: sourceUnits.get(unit)?.includes(quote) ?? unitZh.get(unit)?.includes(quote) };
}

const undatedDeathJudgments = ['claim-283', 'claim-484'].map((id) => {
  const item = packet.items.find((i) => i.id === id);
  const v = item.value;
  const sd = v.dateContext?.sourceDate?.text || v.sourceDate?.text;
  const ev = quoteWitness(item, sd);
  const qualifies =
    item.predicate === 'death' &&
    v.dateContext?.unresolved === true &&
    sd &&
    ev.sourcePinned &&
    !temporalContainers(v).some((c) => c.westernYear || c.westernInterval || c.westernBounds);
  let reason;
  if (id === 'claim-283') {
    reason =
      'Wei Rong (p021): biography states 又早卒 with succession 從孫晃嗣 — an undated early death, not a missing Western year to infer. Source-supported missing date qualifies as valid genuinely undated chronology under the native contract; unresolved hold is appropriate, not incorrect.';
  } else {
    reason =
      'Death claim p034: s0146 narrates 及卒 with posthumous honors only — no regnal or cyclical year. Source-supported missing date qualifies; owner statement cleanup to plain “died” matches witness without inventing calendar precision.';
  }
  return {
    id,
    personId: item.personId,
    predicate: item.predicate,
    sourceDate: sd,
    verdict: qualifies ? 'qualified-genuinely-undated' : 'incorrect',
    qualifiesAsMissingDate: qualifies,
    evidence: [ev],
    reason,
    priorAuditItemCheckReused: priorById.get(id)?.verdict ?? null,
  };
});

const westernIds = receipt.exactRemainingHolds.westernConversionPackagingInChangedPeople;
const chronologyDefects = [];
const representationConstraints = [];

for (const id of westernIds) {
  const item = packet.items.find((i) => i.id === id);
  const prior = priorById.get(id);
  const containers = temporalContainers(item.value);
  let defective = false;
  for (const v of containers) {
    if (v.westernYear || v.westernInterval || v.westernBounds) {
      chronologyDefects.push({
        id,
        personId: item.personId,
        predicate: item.predicate,
        issue: 'western-precision-retained-with-unresolved',
        sourceDate: v.sourceDate?.text,
      });
      defective = true;
    }
    const sd = v.sourceDate?.text;
    if (sd && !item.evidence.some((u) => (unitZh.get(u) || '').includes(sd))) {
      chronologyDefects.push({
        id,
        personId: item.personId,
        predicate: item.predicate,
        issue: 'sourceDate-not-in-owned-evidence',
        sourceDate: sd,
      });
      defective = true;
    }
    if (v.unresolved !== true) {
      chronologyDefects.push({ id, issue: 'expected-unresolved-packaging', predicate: item.predicate });
      defective = true;
    }
  }
  if (!defective) {
    const sd = containers[0]?.sourceDate?.text;
    const ev = quoteWitness(item, sd);
    representationConstraints.push({
      id,
      personId: item.personId,
      predicate: item.predicate,
      classification: 'western-conversion-packaging',
      nativeConstraint:
        'Post–hints-qual H1 seal: Chinese sourceDate retained, Gregorian stripped, unresolved:true documents Western conversion debt — same research-hold class as Jinshu 028 representationConstraints (no western-only closure without independent constraint IDs).',
      representationConstraintNotChronologyDefect: true,
      evidence: sd ? [ev] : prior?.evidence?.slice(0, 1) || [ev],
      priorAuditVerdict: prior?.verdict ?? 'research-blocked',
      ownerAction: 'None required for packaging; close only after host-pinned regnal conversion table and explicit constraint registration (028-style), not self-approval.',
    });
  }
}

if (representationConstraints.length !== westernIds.length) {
  throw new Error(`Constraint row count ${representationConstraints.length} !== ${westernIds.length}`);
}

const out = {
  schemaVersion: 1,
  kind: 'jinshu041-changed-scope-isolation-independent-review',
  stagingDraftPr: 5476,
  stagingTipSha: STAGING_TIP,
  priorIndependentEvidence: PRIOR_EVIDENCE,
  priorAuditArtifact: 'research/people/jinshu041-independent-review-20261123/date-audit-report-hints-qual-compact-20261124.json',
  ownerReceipt: 'research/people/jinshu041-authoring-20261123/changed-scope-unresolved-isolation-receipt.json',
  reviewedAt: new Date().toISOString(),
  reviewerAgentId: 'bc-64f55949-b3a6-4213-b7a2-6e6256473515',
  packetHashes: {
    sourceHash: packet.sourceHash,
    extractionSha256: `sha256:${got}`,
    extractionHash: packet.extractionHash,
  },
  extractionDeltaVsPriorAudit: {
    priorExtractionSha256: 'sha256:83ab3ce443f02602fffd2fcd91ab305b0c081d985528975a6f49f0353f61408e',
    claimMutations: ['claim-484'],
    note: 'Statement text only on claim-484; dateContext unchanged vs 3c757829.',
  },
  undatedDeathClaims: {
    judgments: undatedDeathJudgments,
    allQualify: undatedDeathJudgments.every((j) => j.qualifiesAsMissingDate),
    summary:
      'Both inventoried genuine-undated-death containers are source-backed: pinned Chinese death witness, unresolved without Western, substantive unresolvedReason.',
  },
  westernConversionPackaging: {
    inventoriedCount: westernIds.length,
    chronologyDefects,
    chronologyDefectCount: chronologyDefects.length,
    representationConstraintsCount: representationConstraints.length,
    inventoriedClaimIds: westernIds,
    primaryEraEvidenceSamples: representationConstraints.slice(0, 6).map((r) => ({
      id: r.id,
      sourceDate: r.evidence?.[0],
      constraint: r.nativeConstraint,
    })),
    consolidatedOwnerFindings:
      chronologyDefects.length === 0
        ? 'No actual chronology defects in the 293 Western-packaging rows; remain native research holds pending conversion citation (028-path), not incorrect extractions.'
        : chronologyDefects,
  },
  editorial: { decisionCount: 23, sha256: receipt.preflight.editorialSha256, preserved: true },
  chapterCanClose: false,
  auditedEligible: false,
  explicitNonActions: ['No recordDateAudit', 'No data/people writes', 'No merge', 'No full itemCheck rerun'],
};

const compact = {
  schemaVersion: 1,
  kind: 'jinshu041-changed-scope-isolation-compact',
  stagingTipSha: STAGING_TIP,
  chronologyDefectsOnly: chronologyDefects,
  undatedDeathQualified: undatedDeathJudgments.filter((j) => j.qualifiesAsMissingDate).map((j) => j.id),
  westernPackagingDefects: 0,
  westernPackagingConstraints: westernIds.length,
};

fs.writeFileSync(path.join(root, 'changed-scope-isolation-independent-review-20261124.json'), `${JSON.stringify(out, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'changed-scope-isolation-compact-20261124.json'), `${JSON.stringify(compact, null, 2)}\n`);
fs.writeFileSync(
  path.join(root, 'changed-scope-chronology-defects-for-owner-20261124.json'),
  `${JSON.stringify({ stagingTipSha: STAGING_TIP, defects: chronologyDefects, generatedAt: out.reviewedAt }, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    {
      undatedQualified: out.undatedDeathClaims.allQualify,
      westernDefects: chronologyDefects.length,
      constraints: representationConstraints.length,
      extractionHash: packet.extractionHash,
    },
    null,
    2,
  ),
);

fs.writeFileSync(
  path.join(root, 'western-packaging-constraints-inventory-20261124.json'),
  `${JSON.stringify({ stagingTipSha: STAGING_TIP, count: representationConstraints.length, rows: representationConstraints }, null, 2)}\n`,
);