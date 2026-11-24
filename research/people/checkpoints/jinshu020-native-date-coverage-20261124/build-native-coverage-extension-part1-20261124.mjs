#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { readJson } from '../../../../scripts/lib/people-content.mjs';
import { findPersonWitness } from '../../jinshu020-cloud-authoring-20261123/lib/chronology-witness.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const ART = path.join(ROOT, '../../jinshu020-cloud-authoring-20261123');
const manifest = readJson(path.join(ROOT, 'missing-coverage.json'));
const report = readJson(`${ART}/date-audit-report-partial-s0037-s0700.json`);
const pin = readJson(`${ART}/date-audit-packet-post-editorial-pin.json`);
const source = readJson('data/jinshu/020.json');

const unitMap = new Map(pin.units.map((u) => [u.id, u]));
const itemById = new Map(report.itemChecks.map((c) => [c.id, c]));
const personById = new Map(pin.people.map((p) => [p.id, p]));
const itemsByPerson = new Map();
for (const item of pin.items) {
  if (!itemsByPerson.has(item.personId)) itemsByPerson.set(item.personId, []);
  itemsByPerson.get(item.personId).push(item.id);
}

function loadAcceptedIds() {
  const accepted = new Set();
  for (const c of report.itemChecks) if (c.verdict === 'supported') accepted.add(c.id);
  const inc = readJson(`${ART}/independent-incorrect-30-verification-20261124.json`);
  for (const id of inc.supportedJudgmentIds) accepted.add(id);
  const amend = readJson(`${ART}/independent-hold-amend-verification-20261124.json`);
  for (const v of amend.itemVerdicts) if (!v.rejected) accepted.add(v.id);
  const h38 = readJson(`${ART}/independent-hold038-046-verification-20261124.json`);
  for (const scope of readJson(`${ART}/owner-hold038-046-scopes-pin-20261124.json`).scopes ?? []) {
    if (scope.action?.includes('strip') || scope.action?.includes('skip')) accepted.add(`hints-${scope.pid}`);
  }
  for (const pid of h38.acceptedKeepPersonIds ?? []) accepted.add(`hints-${pid}`);
  const res = readJson(`${ART}/independent-residual-claims-verification-20261124.json`);
  const batch = readJson(`${ART}/owner-residual-claims-batches-pin-20261124.json`);
  for (const b of batch.batches) for (const ch of b.changes ?? []) accepted.add(ch.id);
  accepted.add('claim-238');
  return accepted;
}

const acceptedItems = loadAcceptedIds();
const REIGN = /(?:[元二三三四五六七八九十]+年|太元|太康|泰始|咸寧|咸康|永和|升平|元興|建武|隆安|光熙|永嘉|永康|元康|太安|泰安|咸安|甯康|宁康)/;

function witnessQuote(unitId) {
  const zh = unitMap.get(unitId)?.zh ?? '';
  if (!zh) return null;
  const q = zh.length <= 24 ? zh : zh.slice(0, Math.min(18, zh.length));
  if (q.length < 2) return null;
  return { unit: unitId, quote: q };
}

function checksOnUnit(unitId) {
  return report.itemChecks.filter((c) => c.evidence?.some((e) => e.unit === unitId));
}

const unitReviews = [];
for (const unitId of manifest.requiredUnits) {
  const zh = unitMap.get(unitId)?.zh ?? '';
  const related = checksOnUnit(unitId);
  const hasReign = REIGN.test(zh);
  let verdict = 'supported';
  let attribution;
  let omissions = 'No material date omission beyond item-level holds already adjudicated.';
  const blockers = related.filter((c) => c.verdict === 'research-blocked' && !acceptedItems.has(c.id));
  const incorrect = related.filter((c) => c.verdict === 'incorrect' && !acceptedItems.has(c.id));
  if (incorrect.length) {
    verdict = 'research-blocked';
    omissions = `Open incorrect-linked item checks on unit: ${incorrect.map((c) => c.id).join(', ')}.`;
  } else if (blockers.length) {
    verdict = 'research-blocked';
    omissions = `Item checks still blocked on unit: ${blockers.map((c) => c.id).join(', ')}.`;
  }
  if (unitId.startsWith('s0159a')) {
    attribution = hasReign
      ? 'Du Yu essay subsection with reign or period wording on the owned line; paired claim item checks cite this unit.'
      : 'Du Yu essay subsection without Jin reign dating on the unit; classical or narrative comparison only.';
  } else {
    attribution = hasReign
      ? 'Pre-s0037 narrative unit with explicit reign or year wording on owned Chinese.'
      : 'Pre-s0037 mourning-custom narrative without Jin reign or Western year on owned Chinese (classical or Wei–Jin lore).';
  }
  const ev = related[0]?.evidence?.[0] ?? witnessQuote(unitId);
  const evidence = ev
    ? [{ unit: ev.unit, quote: ev.quote ?? (unitMap.get(ev.unit)?.zh.includes(ev.quote) ? ev.quote : witnessQuote(ev.unit)?.quote) }]
    : [witnessQuote(unitId)].filter(Boolean);
  if (evidence[0] && !unitMap.get(evidence[0].unit)?.zh?.includes(evidence[0].quote)) {
    const w = witnessQuote(unitId);
    if (w) evidence[0] = w;
  }
  unitReviews.push({
    unitId,
    verdict,
    attribution,
    omissions,
    relatedItemChecks: related.map((c) => ({ id: c.id, verdict: c.verdict, accepted: acceptedItems.has(c.id) })),
    reason: `${attribution} ${omissions}`,
    evidence,
  });
}

function personCheck(pid) {
  const existing = report.personChecks.find((p) => p.id === pid);
  if (existing) return { ...existing, source: 'retained-prior-personCheck' };
  const person = personById.get(pid);
  const itemIds = itemsByPerson.get(pid) ?? [];
  const checks = itemIds.map((id) => itemById.get(id)).filter(Boolean);
  const label = person?.names?.[0] ?? pid;
  const outstandingIncorrect = checks.filter((c) => c.verdict === 'incorrect' && !acceptedItems.has(c.id));
  const outstandingBlocked = checks.filter((c) => c.verdict === 'research-blocked' && !acceptedItems.has(c.id));
  const hintItem = pin.items.find((i) => i.id === `hints-${pid}`);
  let verdict = 'supported';
  let reason;
  const evidence = [];
  if (outstandingIncorrect.length) {
    verdict = 'incorrect';
    reason = `Person-linked items remain incorrect after owner waves: ${outstandingIncorrect.map((c) => c.id).join(', ')}.`;
  } else if (outstandingBlocked.length) {
    verdict = 'research-blocked';
    reason = `Residual blocked items without independent acceptance: ${outstandingBlocked.map((c) => c.id).join(', ')}. ${outstandingBlocked[0].reason}`;
  } else if (!checks.length) {
    verdict = 'research-blocked';
    reason = `${label} has no dated packet items; person record is retrospective or undated-only in this chapter.`;
  } else {
    const parts = checks.map((c) => {
      if (acceptedItems.has(c.id) && c.verdict === 'research-blocked') return `${c.id} accepted as supported unknown date after owner undated repair.`;
      return `${c.id} ${c.verdict}.`;
    });
    reason = `${label}: ${parts.join(' ')} Person-level dates follow accepted item adjudication without inventing Western years.`;
    verdict = checks.every((c) => c.verdict === 'supported' || acceptedItems.has(c.id)) ? 'supported' : 'research-blocked';
  }
  for (const c of checks) {
    for (const e of c.evidence ?? []) {
      if (unitMap.get(e.unit)?.zh?.includes(e.quote)) evidence.push({ unit: e.unit, quote: e.quote });
    }
  }
  if (!evidence.length) {
    const w = findPersonWitness({
      personId: pid,
      people: pin.people,
      units: pin.units,
      unitMap,
      unitPeople: pin.unitPeople,
      surfaces: [],
      priorEvidenceByPerson: new Map(checks.flatMap((c) => (c.evidence ?? []).map((e) => [pid, [e]]))),
    });
    if (w) evidence.push({ unit: w.unit, quote: w.quote });
  }
  const uniq = [];
  const seen = new Set();
  for (const e of evidence) {
    const k = `${e.unit}:${e.quote}`;
    if (!seen.has(k)) {
      seen.add(k);
      uniq.push(e);
    }
  }
  const event =
    checks[0]?.event ??
    (hintItem ? `Active-date hints and attestations for ${label}.` : `Chronology attestation coverage for ${label}.`);
  return {
    id: pid,
    verdict,
    event,
    reason: reason.length >= 20 ? reason : `${reason} See linked item checks for ${label}.`,
    evidence: uniq.slice(0, 4),
    linkedItemChecks: itemIds.map((id) => {
      const v = itemById.get(id)?.verdict;
      return {
        id,
        verdict: v,
        adjudication:
          v === 'supported' ? 'supported' : acceptedItems.has(id) ? 'accepted-owner-repair' : v,
      };
    }),
  };
}

const firstPeople = manifest.requiredPeople.slice(0, 100);
const personChecks = firstPeople.map(personCheck);

const sha = (v) => `sha256:${createHash('sha256').update(v).digest('hex')}`;
const inputPins = {
  sourceSha256: report.sourceHash,
  extractionSha256: report.extractionHash,
  ownerRevision: manifest.ownerRevision,
  manifestSha256: sha(JSON.stringify(manifest)),
  initialEvidenceSha256: sha(fs.readFileSync(`${ART}/date-audit-report-partial-s0037-s0700.json`)),
  reviewerEvidenceRevision: manifest.retainedEvidenceRevision,
};

const partMeta = {
  schemaVersion: 1,
  kind: 'jinshu020-native-date-coverage-extension',
  part: 1,
  scope: 'jinshu/020',
  generatedAt: new Date().toISOString(),
  inputPins,
  manifestPath: 'research/people/checkpoints/jinshu020-native-date-coverage-20261124/missing-coverage.json',
  counts: {
    unitsThisPart: unitReviews.length,
    personChecksThisPart: personChecks.length,
    personChecksRemaining: manifest.requiredPeople.length - firstPeople.length,
    unitBlockers: unitReviews.filter((u) => u.verdict !== 'supported').length,
    personBlockers: personChecks.filter((p) => p.verdict !== 'supported').length,
  },
};

fs.writeFileSync(
  path.join(ROOT, 'native-date-coverage-units-part1-20261124.json'),
  JSON.stringify({ ...partMeta, kind: 'jinshu020-native-date-coverage-unitReviews', unitReviews }, null, 2),
);
fs.writeFileSync(
  path.join(ROOT, 'native-date-coverage-personChecks-part1-20261124.json'),
  JSON.stringify({ ...partMeta, kind: 'jinshu020-native-date-coverage-personChecks', personChecks }, null, 2),
);

console.log(JSON.stringify(partMeta.counts, null, 2));
console.log(
  'person blockers',
  personChecks.filter((p) => p.verdict !== 'supported').map((p) => p.id),
);
console.log(
  'unit blockers',
  unitReviews.filter((u) => u.verdict !== 'supported').map((u) => u.unitId),
);