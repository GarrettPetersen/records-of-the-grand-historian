import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { readJson } from '../../../../../scripts/lib/people-content.mjs';
import { findPersonWitness } from '../../../jinshu020-cloud-authoring-20261123/lib/chronology-witness.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ART = path.join(ROOT, '../../jinshu020-cloud-authoring-20261123');

export function loadCoverageContext() {
  const manifest = readJson(path.join(ROOT, 'missing-coverage.json'));
  const report = readJson(`${ART}/date-audit-report-partial-s0037-s0700.json`);
  const pin = readJson(`${ART}/date-audit-packet-post-editorial-pin.json`);
  const unitMap = new Map(pin.units.map((u) => [u.id, u]));
  const itemById = new Map(report.itemChecks.map((c) => [c.id, c]));
  const personById = new Map(pin.people.map((p) => [p.id, p]));
  const itemsByPerson = new Map();
  for (const item of pin.items) {
    if (!itemsByPerson.has(item.personId)) itemsByPerson.set(item.personId, []);
    itemsByPerson.get(item.personId).push(item.id);
  }
  const acceptedItems = loadAcceptedIds(report, ART);
  return { manifest, report, pin, unitMap, itemById, personById, itemsByPerson, acceptedItems, ART, ROOT };
}

function loadAcceptedIds(report, art) {
  const accepted = new Set();
  for (const c of report.itemChecks) if (c.verdict === 'supported') accepted.add(c.id);
  const inc = readJson(`${art}/independent-incorrect-30-verification-20261124.json`);
  for (const id of inc.supportedJudgmentIds) accepted.add(id);
  const amend = readJson(`${art}/independent-hold-amend-verification-20261124.json`);
  for (const v of amend.itemVerdicts) if (!v.rejected) accepted.add(v.id);
  const h38pin = readJson(`${art}/owner-hold038-046-scopes-pin-20261124.json`);
  for (const scope of h38pin.scopes ?? []) {
    if (scope.action?.includes('strip') || scope.action?.includes('skip')) accepted.add(`hints-${scope.pid}`);
  }
  const h38 = readJson(`${art}/independent-hold038-046-verification-20261124.json`);
  for (const pid of h38.acceptedKeepPersonIds ?? []) accepted.add(`hints-${pid}`);
  const batch = readJson(`${art}/owner-residual-claims-batches-pin-20261124.json`);
  for (const b of batch.batches) for (const ch of b.changes ?? []) accepted.add(ch.id);
  accepted.add('claim-238');
  return accepted;
}

export function buildPersonCheck(pid, ctx) {
  const { report, pin, unitMap, itemById, personById, itemsByPerson, acceptedItems } = ctx;
  const existing = report.personChecks.find((p) => p.id === pid);
  if (existing) {
    const out = { id: existing.id, verdict: existing.verdict, event: existing.event, reason: existing.reason, evidence: existing.evidence };
    return { ...out, source: 'retained-prior-personCheck' };
  }
  const person = personById.get(pid);
  const itemIds = itemsByPerson.get(pid) ?? [];
  const checks = itemIds.map((id) => itemById.get(id)).filter(Boolean);
  const label = person?.names?.[0] ?? pid;
  const outstandingIncorrect = checks.filter((c) => c.verdict === 'incorrect' && !acceptedItems.has(c.id));
  const outstandingBlocked = checks.filter((c) => c.verdict === 'research-blocked' && !acceptedItems.has(c.id));
  const hintItem = pin.items.find((i) => i.id === `hints-${pid}`);
  let verdict = 'supported';
  let reason;
  let materialException = null;
  const evidence = [];
  if (outstandingIncorrect.length) {
    verdict = 'incorrect';
    reason = `Person-linked items remain incorrect after owner waves: ${outstandingIncorrect.map((c) => c.id).join(', ')}.`;
    materialException = reason;
  } else if (outstandingBlocked.length) {
    verdict = 'research-blocked';
    reason = `Residual blocked items without independent acceptance: ${outstandingBlocked.map((c) => c.id).join(', ')}. ${outstandingBlocked[0].reason}`;
    materialException = reason;
  } else if (!checks.length) {
    verdict = 'research-blocked';
    reason = `${label} has no dated packet items in this chapter packet; person-level chronology is undated-only or narrative.`;
    materialException = reason;
  } else {
    const parts = checks.map((c) => {
      if (acceptedItems.has(c.id) && c.verdict === 'research-blocked')
        return `${c.id} accepted as supported unknown date after owner undated repair.`;
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
    if (w && unitMap.get(w.unit)?.zh?.includes(w.quote)) evidence.push({ unit: w.unit, quote: w.quote });
    else if (verdict === 'supported' && checks.length) {
      materialException = `${label}: no quotable Chinese witness validated for packet item evidence; judgment rests on item-check adjudication only.`;
    } else if (!evidence.length) {
      materialException = `${label}: cannot ground person check in owned Chinese quotation.`;
      if (verdict === 'supported') verdict = 'research-blocked';
    }
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
  const row = {
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
        adjudication: v === 'supported' ? 'supported' : acceptedItems.has(id) ? 'accepted-owner-repair' : v,
      };
    }),
  };
  if (materialException) row.materialException = materialException;
  return row;
}

export function inputPins(ctx) {
  const { manifest, report, ART, ROOT } = ctx;
  const sha = (v) => `sha256:${createHash('sha256').update(v).digest('hex')}`;
  return {
    sourceSha256: report.sourceHash,
    extractionSha256: report.extractionHash,
    ownerRevision: manifest.ownerRevision,
    manifestSha256: sha(fs.readFileSync(path.join(ROOT, 'missing-coverage.json'))),
    initialEvidenceSha256: sha(fs.readFileSync(`${ART}/date-audit-report-partial-s0037-s0700.json`)),
    reviewerEvidenceRevision: manifest.retainedEvidenceRevision,
    coverageCheckpointRevision: '4c9944eeb4bef680adffb17b7efb411a140a281e',
  };
}

export function writePersonChecksPart(part, start, end, outName) {
  const ctx = loadCoverageContext();
  const people = ctx.manifest.requiredPeople.slice(start, end);
  const personChecks = people.map((pid) => buildPersonCheck(pid, ctx));
  const inputPins = inputPinsFrom(ctx);
  const meta = {
    schemaVersion: 1,
    kind: 'jinshu020-native-date-coverage-personChecks',
    part,
    scope: 'jinshu/020',
    generatedAt: new Date().toISOString(),
    inputPins,
    manifestPath: 'research/people/checkpoints/jinshu020-native-date-coverage-20261124/missing-coverage.json',
    manifestSlice: { start, end, exclusive: end, personIds: people },
    counts: {
      personChecksThisPart: personChecks.length,
      personBlockers: personChecks.filter((p) => p.verdict !== 'supported').length,
      materialExceptions: personChecks.filter((p) => p.materialException).length,
    },
    personChecks,
  };
  fs.writeFileSync(path.join(ctx.ROOT, outName), JSON.stringify(meta, null, 2));
  return meta.counts;
}

function inputPinsFrom(ctx) {
  return inputPins(ctx);
}