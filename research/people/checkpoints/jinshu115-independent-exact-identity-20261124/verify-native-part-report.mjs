#!/usr/bin/env node
/**
 * Checkpoint-only: verify transport hashes and lint authored part reports.
 * Does not author decisions or reasons.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { localNameKeys } from '../../../../scripts/lib/people-resolution.mjs';
import { assertDossierPrimaryWitness } from '../../../../scripts/lib/people-identity-dossiers.mjs';
import { identityArtifactHash } from '../../../../scripts/lib/people-identity-artifacts.mjs';

const CHECKPOINT = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_ROOT = process.env.JINSHU115_EXACT_IDENTITY ?? '/tmp/jinshu115-exact-identity';

function expandPerson(compact) {
  return {
    localId: compact.localId,
    preferredNameSuggestion: compact.preferredNameSuggestion,
    claims: compact.claims.map(([id, predicate, value, certainty, evidence]) => ({
      id, predicate, value, certainty, evidence,
    })),
    mentions: compact.mentions.map(([id, unitId, kind, spans, notes]) => ({
      id, unit: { id: unitId }, kind, spans, notes,
    })),
  };
}

function verifyTransportHashes() {
  const receipt = JSON.parse(fs.readFileSync(path.join(ARTIFACT_ROOT, 'preparation-receipt.json'), 'utf8'));
  const mismatches = [];
  for (const part of receipt.reviewParts) {
    const bytes = fs.readFileSync(path.join(ARTIFACT_ROOT, part.file));
    if (identityArtifactHash(bytes) !== part.sha256) mismatches.push(part.file);
  }
  return { receipt, mismatches };
}

export function verifyAuthoredPartReport(partNumber, reportPath) {
  const partFile = `transport-part-${String(partNumber).padStart(3, '0')}.json`;
  const part = JSON.parse(fs.readFileSync(path.join(ARTIFACT_ROOT, partFile), 'utf8'));
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const people = new Map(part.people.map((p) => [p.localId, expandPerson(p)]));
  const sourceUnits = new Map(
    part.units.map((u) => [`${u.book}:${u.chapter}:${u.id}`, u.zh]),
  );
  const expectedIds = new Set(part.reviewCases.map((c) => c.caseId));
  if (report.planFingerprint !== part.planFingerprint) throw new Error('planFingerprint mismatch');
  if (report.reviews.length !== part.reviewCases.length) throw new Error('review count mismatch');
  for (const row of report.reviews) {
    if (!expectedIds.has(row.caseId)) throw new Error(`unexpected caseId ${row.caseId}`);
    const caseItem = part.reviewCases.find((c) => c.caseId === row.caseId);
    if (row.canonicalPersonId !== caseItem.canonicalPersonId) throw new Error('canonicalPersonId mismatch');
    if (row.membershipFingerprint !== caseItem.canonicalMembership.fingerprint) {
      throw new Error('membershipFingerprint mismatch');
    }
    const nameEvidence = new Map();
    for (const witness of row.sourceWitnesses) {
      assertDossierPrimaryWitness(witness, people.get(witness.localId), sourceUnits, localNameKeys, nameEvidence);
    }
    const locals = new Set([...caseItem.localPeople, caseItem.canonicalMembership.anchorLocalId]);
    for (const id of locals) {
      if (!row.sourceWitnesses.some((w) => w.localId === id)) {
        throw new Error(`missing witness for ${id}`);
      }
    }
  }
  return report;
}

function writeVerifiedPart(partNumber) {
  const label = String(partNumber).padStart(3, '0');
  const authored = path.join(CHECKPOINT, `authored-native-part-report-${label}.json`);
  if (!fs.existsSync(authored)) return null;
  const report = verifyAuthoredPartReport(partNumber, authored);
  const out = path.join(CHECKPOINT, `native-part-report-${label}.json`);
  fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
  const hash = identityArtifactHash(fs.readFileSync(out));
  fs.writeFileSync(path.join(CHECKPOINT, `native-part-report-${label}.json.sha256`), `${hash}\n`);
  return { out, hash, count: report.reviews.length };
}

function main() {
  const { receipt, mismatches } = verifyTransportHashes();
  if (mismatches.length) {
    console.error('Transport hash mismatch:', mismatches);
    process.exit(1);
  }
  const parts = process.argv.slice(2).map(Number).filter(Boolean);
  const targets = parts.length ? parts : receipt.reviewParts.map((_, i) => i + 1);
  for (const n of targets) {
    const result = writeVerifiedPart(n);
    if (result) console.log(`Verified part ${String(n).padStart(3, '0')}:`, result.out, result.hash, `(${result.count} cases)`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();