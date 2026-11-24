#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { peopleDigest } from '../../../../scripts/lib/people-identity-seal.mjs';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const SEALED = '/tmp/jinshu030-sealed-id';
const prep = JSON.parse(fs.readFileSync(path.join(SEALED, 'preparation-receipt.json'), 'utf8'));
const plan = JSON.parse(fs.readFileSync(path.join(SEALED, 'plan.json'), 'utf8'));
const planById = new Map(plan.cases.map((c) => [c.id, c]));

const maxPart = Number(process.argv[2] ?? 42);

function parseLocalId(localId) {
  const [book, chapter] = localId.split(':');
  return { book, chapter };
}

function validateWitness(part, w) {
  const u = part.units.find(
    (x) => x.book === w.book && x.chapter === w.chapter && x.id === w.unitId,
  );
  if (!u?.zh?.includes(w.quote)) {
    throw new Error(`witness quote missing ${w.localId} ${w.unitId} ${w.quote}`);
  }
}

function validatePart(partNum) {
  const pad = String(partNum).padStart(3, '0');
  const file = `transport-part-${pad}.json`;
  const reviewPath = path.join(__dir, `transport-part-${pad}-independent-review.json`);
  const errors = [];
  if (!fs.existsSync(reviewPath)) {
    return { file: path.basename(reviewPath), passed: false, errors: ['missing review file'], cases: 0 };
  }
  const receipt = prep.reviewParts.find((p) => p.file === file);
  const transportBytes = fs.readFileSync(path.join(SEALED, file));
  const transportSha = `sha256:${createHash('sha256').update(transportBytes).digest('hex')}`;
  const envelope = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  const part = JSON.parse(transportBytes.toString('utf8'));

  if (envelope.transportPart.sha256 !== transportSha) errors.push('transport sha mismatch');
  if (receipt?.sha256 !== transportSha.replace('sha256:', '')) errors.push('prep receipt sha mismatch');
  const digest = peopleDigest(envelope.requiredReport);
  if (digest !== envelope.reportFingerprint) errors.push('reportFingerprint digest mismatch');

  const reviews = envelope.requiredReport.reviews;
  if (reviews.length !== receipt.caseIds.length) errors.push('case count mismatch');

  for (const rv of reviews) {
    const rc = part.reviewCases.find((x) => x.caseId === rv.caseId);
    if (!rc) {
      errors.push(`unknown case ${rv.caseId}`);
      continue;
    }
    if (rv.membershipFingerprint !== rc.canonicalMembership.fingerprint) {
      errors.push(`fingerprint ${rv.caseId}`);
    }
    if (rv.verdict === 'hold') continue;
    const planCase = planById.get(rv.caseId);
    if (planCase && rv.membershipFingerprint !== planCase.canonicalMembership.fingerprint) {
      errors.push(`plan fingerprint ${rv.caseId}`);
    }
    if (rc.proposal.unresolvedIdentity && rv.unresolvedIdentity === false) {
      errors.push(`cleared unresolved without auth ${rv.caseId}`);
    }
    if (rc.proposal.missingBlockingName && rv.unresolvedIdentity === false) {
      errors.push(`cleared with missingBlockingName ${rv.caseId}`);
    }
    const requiredLocals = new Set([...rc.localPeople, rc.canonicalMembership.anchorLocalId]);
    const witnessLocals = new Set(rv.sourceWitnesses.map((w) => w.localId));
    for (const lid of requiredLocals) {
      if (!witnessLocals.has(lid)) errors.push(`missing witness local ${lid} in ${rv.caseId}`);
    }
    for (const w of rv.sourceWitnesses) {
      try {
        validateWitness(part, w);
      } catch (e) {
        errors.push(e.message);
      }
    }
    if (!rv.reason || rv.reason.length < 10) errors.push(`short reason ${rv.caseId}`);
  }

  return {
    file: path.basename(reviewPath),
    passed: errors.length === 0,
    errors,
    cases: reviews.length,
    reportFingerprint: envelope.reportFingerprint,
    transportSha256: envelope.transportPart.sha256,
  };
}

const parts = [];
let total = 0;
for (let n = 1; n <= maxPart; n++) {
  const r = validatePart(n);
  parts.push(r);
  if (r.passed) total += r.cases;
}
const allPassed = parts.every((p) => p.passed);
const out = {
  schemaVersion: 1,
  kind: 'jinshu030-native-identity-part-validation-receipt',
  validatedAt: new Date().toISOString(),
  command: `sealed-transport witness + plan case field checks (parts 001-${String(maxPart).padStart(3, '0')})`,
  planFingerprint: prep.planFingerprint,
  totalCasesReviewed: total,
  allPassed,
  parts,
};
const outPath = path.join(__dir, 'validation-receipt.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ allPassed, totalCasesReviewed: total, parts: parts.length }, null, 2));
if (!allPassed) process.exit(1);