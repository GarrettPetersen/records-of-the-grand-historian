#!/usr/bin/env node
/** Witness/case checks for manually authored identity parts 001–010 (overlay 5683d375). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertDossierPrimaryWitness } from '../../../../scripts/lib/people-identity-dossiers.mjs';
import { identityArtifactHash } from '../../../../scripts/lib/people-identity-artifacts.mjs';
import { localNameKeys } from '../../../../scripts/lib/people-resolution.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT = process.env.JINSHU083_IDENTITY_ARTIFACT ?? '/tmp/jinshu083-corrected-identity';

const receipt = JSON.parse(fs.readFileSync(path.join(ARTIFACT, 'preparation-receipt.json'), 'utf8'));
const plan = JSON.parse(fs.readFileSync(path.join(ARTIFACT, 'plan.json'), 'utf8'));
const packet = JSON.parse(fs.readFileSync(path.join(ARTIFACT, 'source-review-packet.json'), 'utf8'));
const sourceUnits = new Map(packet.units.map((u) => [`${u.book}:${u.chapter}:${u.id}`, u.zh]));
const localPeople = new Map(packet.people.map((p) => [p.localId, { ...p, book: 'jinshu', chapter: '083', promptVersion: 7 }]));
const caseById = new Map(plan.cases.map((c) => [c.id, c]));
const nameEvidence = new Map();

const PARTS = (process.env.JINSHU083_PARTS ?? '001,002,003,004,005,006,007,008,009,010').split(',');
for (const partNum of PARTS) {
  const part = receipt.reviewParts.find((p) => p.file === `transport-part-${partNum}.json`);
  const bytes = fs.readFileSync(path.join(ARTIFACT, part.file));
  if (identityArtifactHash(bytes) !== part.sha256) throw new Error(`Transport hash mismatch ${part.file}`);
  const report = JSON.parse(fs.readFileSync(path.join(HERE, `identity-report-part-${partNum}.json`), 'utf8'));
  if (report.transportSha256 !== part.sha256) throw new Error(`Report transport pin mismatch part ${partNum}`);
  for (const row of report.reviews) {
    const item = caseById.get(row.caseId);
    if (!item) throw new Error(`Unknown case ${row.caseId}`);
    for (const localId of item.localPeople) {
      if (!row.sourceWitnesses.some((w) => w.localId === localId)) {
        throw new Error(`Missing witness for ${localId} in ${row.caseId}`);
      }
    }
    for (const witness of row.sourceWitnesses) {
      assertDossierPrimaryWitness(witness, localPeople.get(witness.localId), sourceUnits, localNameKeys, nameEvidence);
    }
  }
  console.log(`identity-report-part-${partNum}.json: ${report.reviews.length} cases OK`);
}
console.log('validate-authored-parts: pass');