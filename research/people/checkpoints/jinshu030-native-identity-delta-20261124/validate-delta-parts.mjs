#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { peopleDigest } from '../../../../scripts/lib/people-identity-seal.mjs';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const SEALED = process.env.JINSHU030_RESIDUAL_SEALED ?? '/tmp/jinshu030-residual-id';
const prep = JSON.parse(fs.readFileSync(path.join(SEALED, 'preparation-receipt.json'), 'utf8'));

function validatePart(partNum) {
  const pad = String(partNum).padStart(3, '0');
  const file = `transport-part-${pad}.json`;
  const receipt = prep.reviewParts.find((p) => p.file === file);
  const transportBytes = fs.readFileSync(path.join(SEALED, file));
  const transportSha = `sha256:${createHash('sha256').update(transportBytes).digest('hex')}`;
  const part = JSON.parse(transportBytes.toString('utf8'));
  const envelope = JSON.parse(
    fs.readFileSync(path.join(__dir, `transport-part-${pad}-independent-review.json`), 'utf8'),
  );
  const errors = [];
  if (envelope.transportPart.sha256 !== transportSha) errors.push('transport sha mismatch');
  if (envelope.planFingerprint !== prep.planFingerprint) errors.push('plan fingerprint mismatch');
  if (peopleDigest(envelope.requiredReport) !== envelope.reportFingerprint) errors.push('report digest mismatch');
  const unitMap = new Map();
  for (const u of part.units) unitMap.set(`${u.book}:${u.chapter}:${u.id}`, u.zh);
  for (const rv of envelope.requiredReport.reviews) {
    const rc = part.reviewCases.find((x) => x.caseId === rv.caseId);
    if (!rc) errors.push(`unknown case ${rv.caseId}`);
    if (rv.membershipFingerprint !== rc?.canonicalMembership.fingerprint) errors.push(`fingerprint ${rv.caseId}`);
    for (const w of rv.sourceWitnesses) {
      const zh = unitMap.get(`${w.book}:${w.chapter}:${w.unitId}`);
      if (!zh?.includes(w.quote)) errors.push(`witness ${w.localId} ${w.unitId} ${w.quote}`);
    }
    if (rc.proposal.unresolvedIdentity && rv.unresolvedIdentity === false) errors.push(`cleared unresolved ${rv.caseId}`);
    if (!rc.proposal.unresolvedIdentity && rv.unresolvedIdentity === true) errors.push(`left unresolved ${rv.caseId}`);
  }
  return { file: `transport-part-${pad}-independent-review.json`, passed: errors.length === 0, errors, cases: envelope.requiredReport.reviews.length };
}

const parts = [1, 2].map(validatePart);
const allPassed = parts.every((p) => p.passed);
const receipt = {
  schemaVersion: 1,
  kind: 'jinshu030-native-identity-delta-validation-receipt',
  validatedAt: new Date().toISOString(),
  planFingerprint: prep.planFingerprint,
  sourcePacketSha256: prep.sourcePacketSha256,
  sourceRevisionSeal: prep.sourceRevision,
  casesReviewed: parts.reduce((n, p) => n + p.cases, 0),
  allPassed,
  parts,
};
fs.writeFileSync(path.join(__dir, 'validation-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ allPassed, casesReviewed: receipt.casesReviewed }, null, 2));
if (!allPassed) process.exit(1);