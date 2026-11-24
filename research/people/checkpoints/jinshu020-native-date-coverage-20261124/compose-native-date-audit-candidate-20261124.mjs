#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson } from '../../../../scripts/lib/people-content.mjs';
import { validateDateAuditReport } from '../../../../scripts/lib/people-date-audit.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const ART = path.join(ROOT, '../../jinshu020-cloud-authoring-20261123');
const base = readJson(`${ART}/date-audit-report-partial-s0037-s0700.json`);
const unitsPart = readJson(path.join(ROOT, 'native-date-coverage-units-part1-20261124.json'));
const p1 = readJson(path.join(ROOT, 'native-date-coverage-personChecks-part1-20261124.json'));
const p2 = readJson(path.join(ROOT, 'native-date-coverage-personChecks-part2-20261124.json'));
const p3 = readJson(path.join(ROOT, 'native-date-coverage-personChecks-part3-20261124.json'));

function stripPersonRow(row) {
  const { linkedItemChecks, materialException, source, ...native } = row;
  return native;
}

const extensionPeople = [...p1.personChecks, ...p2.personChecks, ...p3.personChecks].map(stripPersonRow);
const priorPeople = base.personChecks.map(stripPersonRow);
const byId = new Map();
for (const p of priorPeople) byId.set(p.id, p);
for (const p of extensionPeople) byId.set(p.id, p);

const packet = readJson(`${ART}/date-audit-packet-post-editorial-pin.json`);
const orderedPeople = packet.people.map((p) => p.id);
const personChecks = orderedPeople.map((id) => {
  const row = byId.get(id);
  if (!row) throw new Error(`Missing personCheck for ${id}`);
  return row;
});

const reviewedSet = new Set(base.reviewedUnits);
for (const u of unitsPart.unitReviews) reviewedSet.add(u.unitId);
const reviewedUnits = [...reviewedSet].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const candidate = {
  ...base,
  status: 'needs-revision',
  summary:
    'Canonical composition candidate: 650 retained itemChecks, 756 reviewedUnits, 325 personChecks grounded in prior adjudication and coverage extension parts 1–3. Not publication or audited seal.',
  reviewedAt: new Date().toISOString(),
  reviewedUnits,
  personChecks,
  composeMeta: {
    kind: 'jinshu020-native-date-audit-candidate-compose',
    ownerRevision: '1106dc44ba8ce3bbd8d76ff9c3a3db7cbdd138c0',
    retainedItemChecks: 650,
    priorPersonChecksRetained: priorPeople.length,
    extensionPersonChecks: extensionPeople.length,
    extensionUnits: unitsPart.unitReviews.length,
    compositionArtifacts: [
      'native-date-coverage-units-part1-20261124.json',
      'native-date-coverage-personChecks-part1-20261124.json',
      'native-date-coverage-personChecks-part2-20261124.json',
      'native-date-coverage-personChecks-part3-20261124.json',
    ],
    notCanonicalPath: true,
  },
};

const outPath = path.join(ROOT, 'jinshu020-native-date-audit-candidate-20261124.json');
fs.writeFileSync(outPath, JSON.stringify(candidate, null, 2));

const validation = { ok: true, errors: [] };
try {
  validateDateAuditReport(candidate, packet);
} catch (e) {
  validation.ok = false;
  validation.errors.push(e.message);
}
const valPath = path.join(ROOT, 'jinshu020-native-date-audit-candidate-validation-20261124.json');
fs.writeFileSync(
  valPath,
  JSON.stringify(
    {
      schemaVersion: 1,
      candidatePath: 'jinshu020-native-date-audit-candidate-20261124.json',
      validator: 'scripts/lib/people-date-audit.mjs validateDateAuditReport',
      packetBuiltFrom: 'date-audit-packet-post-editorial-pin.json',
      counts: {
        reviewedUnits: candidate.reviewedUnits.length,
        itemChecks: candidate.itemChecks.length,
        personChecks: candidate.personChecks.length,
        findings: candidate.findings?.length,
      },
      ...validation,
    },
    null,
    2,
  ),
);

console.log(JSON.stringify({ counts: { reviewedUnits: reviewedUnits.length, personChecks: personChecks.length, itemChecks: candidate.itemChecks.length }, validation }, null, 2));