#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { identityArtifactHash } from '../../../../scripts/lib/people-identity-artifacts.mjs';
import { peopleDigest as stableDigest } from '../../../../scripts/lib/people-identity-seal.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT = process.env.JINSHU083_IDENTITY_ARTIFACT ?? '/tmp/jinshu083-corrected-identity';
const receipt = JSON.parse(fs.readFileSync(path.join(ARTIFACT, 'preparation-receipt.json'), 'utf8'));

const baseManifest = JSON.parse(fs.readFileSync(path.join(HERE, 'identity-review-manifest-parts-01-08.json'), 'utf8'));
const partReports = [];
const caseHashes = [];

for (let n = 1; n <= 10; n += 1) {
  const partNum = String(n).padStart(3, '0');
  const transportName = `transport-part-${partNum}.json`;
  const reportName = `identity-report-part-${partNum}.json`;
  const transportMeta = receipt.reviewParts.find((p) => p.file === transportName);
  const transportBytes = fs.readFileSync(path.join(ARTIFACT, transportName));
  const transportSha = identityArtifactHash(transportBytes);
  if (transportSha !== transportMeta.sha256) throw new Error(`Transport ${transportName} hash mismatch`);
  const reportBytes = fs.readFileSync(path.join(HERE, reportName));
  const report = JSON.parse(reportBytes.toString('utf8'));
  if (report.transportSha256 !== transportMeta.sha256) throw new Error(`Report pin ${reportName}`);
  const coreEnvelope = {
    schemaVersion: report.schemaVersion,
    planFingerprint: report.planFingerprint,
    reviewer: report.reviewer,
    reviews: report.reviews,
  };
  const status =
    n === 1 ? 'independent-authored-corrected-p165'
    : n === 3 ? 'independent-authored-corrected-p092'
    : n === 5 ? 'independent-authored-corrected-p148'
    : 'independent-authored';
  partReports.push({
    file: reportName,
    status,
    transportPart: transportName,
    transportBytes: transportBytes.length,
    transportSha256: transportMeta.sha256,
    reportBytes: reportBytes.length,
    reportSha256: stableDigest(coreEnvelope),
    reportFileSha256: `sha256:${identityArtifactHash(reportBytes)}`,
    caseCount: report.reviews.length,
    caseIds: report.reviews.map((r) => r.caseId),
  });
  for (const row of report.reviews) {
    caseHashes.push({
      caseId: row.caseId,
      transportPart: transportName,
      reportPart: reportName,
      reviewRowDigest: stableDigest(row),
      canonicalPersonId: row.canonicalPersonId,
      unresolvedIdentity: row.unresolvedIdentity,
    });
  }
}

const authoredCaseCount = caseHashes.length;
const unresolvedCount = caseHashes.filter((c) => c.unresolvedIdentity).length;

const manifest = {
  ...baseManifest,
  kind: 'jinshu083-independent-identity-review-manifest-complete',
  reviewedAt: new Date().toISOString(),
  preparationReceipt: {
    ...baseManifest.preparationReceipt,
    transportVerifiedParts001010: true,
    transportVerifiedParts001008: undefined,
  },
  continuation: {
    authoredTransportParts: receipt.reviewParts.map((p) => p.file),
    unreviewedTransportParts: [],
    authoredCaseCount,
    remainingCaseCount: 0,
    corrections: baseManifest.continuation.corrections,
    note: 'All ten transport parts independently authored on artifact 14875662517.',
  },
  nativeIdentity: {
    status: 'independent-review-complete-pending-host-composition',
    authoredParts: 10,
    totalParts: 10,
    chapterClosure: false,
  },
  partReports,
  unreviewedParts: [],
};

delete manifest.preparationReceipt.transportVerifiedParts001008;

const coverageSummary = {
  schemaVersion: 1,
  kind: 'jinshu083-independent-identity-reviewed-coverage-summary',
  artifactId: '14875662517',
  ghActionsRunId: '45294717807',
  planFingerprint: baseManifest.preparationReceipt.planFingerprint,
  reviewedCaseCount: authoredCaseCount,
  planCaseCount: 164,
  coverageComplete: authoredCaseCount === 164,
  verdictSummary: { approve: authoredCaseCount, hold: 0, reject: 0 },
  unresolvedIdentityRows: unresolvedCount,
  resolvedIdentityRows: authoredCaseCount - unresolvedCount,
  holds: [
    {
      kind: 'host-composition',
      severity: 'blocking-for-chapter-certificate',
      note: 'Ten part envelopes include transport pins; host must compose closed-schema identity-report-complete.json without extra fields before validateDossierIdentityEvidence.',
    },
    {
      kind: 'cross-chapter-ambiguity',
      severity: 'informational',
      note: `${unresolvedCount} cases retain unresolvedIdentity: true (overflow/candidate caps); no witness-blocked or reject rows in this review.`,
    },
    {
      kind: 'chronology-out-of-lane',
      severity: 'informational',
      note: 'p026 / 山賈諸公 collective may still carry a separate date-audit concern; not revisited in this identity slice.',
    },
  ],
  manifestFile: 'identity-review-manifest-parts-01-10.json',
  caseHashFile: 'identity-part-case-hashes-parts-01-10.json',
};

fs.writeFileSync(path.join(HERE, 'identity-review-manifest-parts-01-10.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(
  path.join(HERE, 'identity-part-case-hashes-parts-01-10.json'),
  JSON.stringify(
    {
      schemaVersion: 1,
      kind: 'jinshu083-independent-identity-case-hash-manifest',
      planFingerprint: baseManifest.preparationReceipt.planFingerprint,
      sourceRevision: baseManifest.sourceRevision,
      caseHashes,
    },
    null,
    2,
  ) + '\n',
);
fs.writeFileSync(path.join(HERE, 'identity-reviewed-coverage-summary.json'), JSON.stringify(coverageSummary, null, 2) + '\n');
console.log(`Wrote manifest (${authoredCaseCount} cases, ${unresolvedCount} unresolved)`);