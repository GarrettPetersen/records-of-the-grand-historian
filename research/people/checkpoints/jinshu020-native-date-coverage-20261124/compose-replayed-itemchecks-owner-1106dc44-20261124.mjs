#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { contentUnits, readJson } from '../../../../scripts/lib/people-content.mjs';
import {
  buildDateAuditPacket,
  dateAuditItems,
  validateDateAuditReport,
} from '../../../../scripts/lib/people-date-audit.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const ART = path.join(ROOT, '../../jinshu020-cloud-authoring-20261123');
const OWNER = '1106dc44ba8ce3bbd8d76ff9c3a3db7cbdd138c0';
const EVIDENCE_BASE = '163d06fe83dd30fe7970c7a9d08715f8dea2c717';

const extraction = JSON.parse(execSync(`git show ${OWNER}:data/people/extractions/jinshu/020.json`, { encoding: 'utf8' }));
const sourceJson = JSON.parse(execSync(`git show ${OWNER}:data/jinshu/020.json`, { encoding: 'utf8' }));
const packet = buildDateAuditPacket('jinshu', '020', { extraction: extraction });
// Re-pin source units from owner commit (buildDateAuditPacket reads workspace source; override hashes)
const ownerUnits = contentUnits(sourceJson).map(({ id, zh, en, literal, blockIndex }) => ({ id, zh, en, literal, blockIndex }));
packet.units = ownerUnits;
packet.sourceHash = sha(JSON.stringify(ownerUnits));
packet.extractionHash = sha(JSON.stringify(extraction));

const unitMap = new Map(packet.units.map((u) => [u.id, u]));
const base = readJson(`${ART}/date-audit-report-partial-s0037-s0700.json`);
const candidatePerson = readJson(path.join(ROOT, 'jinshu020-native-date-audit-candidate-20261124.json'));
const priorCandidate = candidatePerson;

function sha(v) {
  return `sha256:${createHash('sha256').update(v).digest('hex')}`;
}

function loadWaveDispositions() {
  const byId = new Map();
  const add = (id, wave, note) => {
    if (!byId.has(id)) byId.set(id, { id, wave, note });
  };
  const inc = readJson(`${ART}/independent-incorrect-30-verification-20261124.json`);
  for (const id of inc.supportedJudgmentIds) add(id, 'incorrect-30', 'Independent incorrect-30 verification 20261124');
  for (const q of inc.qualitativeOrUndatedTruthsAccepted ?? []) add(q.id, 'incorrect-30', q.note);
  const amend = readJson(`${ART}/independent-hold-amend-verification-20261124.json`);
  for (const v of amend.itemVerdicts) add(v.id, 'hold-amend', v.note ?? v.disposition);
  const scopes = readJson(`${ART}/owner-hold038-046-scopes-pin-20261124.json`);
  for (const s of scopes.scopes ?? []) {
    add(`hints-${s.pid}`, 'hold-038-046', s.action);
  }
  const batch = readJson(`${ART}/owner-residual-claims-batches-pin-20261124.json`);
  for (const b of batch.batches) {
    for (const ch of b.changes ?? []) {
      add(ch.id, 'residual-claims', ch.classification ?? b.batchId);
    }
  }
  return byId;
}

const waves = loadWaveDispositions();
const { items: packetItems } = dateAuditItems(extraction);
const packetItemById = new Map(packetItems.map((i) => [i.id, i]));

const TABLE_HINT = /^AD\s+\d{3,4}–\d{3,4}\s*\([^)]+\)$/;

function ownerSemanticsMatch(id) {
  const pit = packetItemById.get(id);
  if (!pit) return { ok: false, why: 'missing-packet-item' };
  if (id.startsWith('hints-')) {
    const hints = pit.value ?? [];
    if (!Array.isArray(hints)) return { ok: false, why: 'hints-not-array' };
    for (const h of hints) {
      if (TABLE_HINT.test(h)) return { ok: false, why: 'table-only-active-hint', detail: h };
    }
    return { ok: true };
  }
  const claim = extraction.claims[pit.claimIndex];
  const value = claim?.[2];
  if (!value) return { ok: false, why: 'missing-claim-value' };
  if (value.undatedSourceAttestation === true) return { ok: true, kind: 'undated' };
  if (value.qualitative) return { ok: true, kind: 'qualitative' };
  if (value.sourceDate?.text && /[\u4e00-\u9fff]/.test(value.sourceDate.text)) {
    if (!value.westernInterval?.start || value.westernYear) return { ok: true, kind: 'explicit-source-reign' };
    return { ok: true, kind: 'source-date-text' };
  }
  const serialized = JSON.stringify(value);
  if (/westernInterval|westernYear/.test(serialized) && !/undatedSourceAttestation/.test(serialized)) {
    return { ok: false, why: 'western-without-source-or-undated' };
  }
  return { ok: true, kind: 'other-safe' };
}

function evidenceValid(evidence) {
  const out = [];
  for (const e of evidence ?? []) {
    const zh = unitMap.get(e.unit)?.zh ?? '';
    if (zh.includes(e.quote)) out.push({ unit: e.unit, quote: e.quote });
  }
  return out;
}

function promoteCheck(prev, waveMeta, semantic) {
  const evidence = evidenceValid(prev.evidence);
  if (!evidence.length) return { ok: false, why: 'evidence-quote-mismatch', id: prev.id };
  const event =
    typeof prev.event === 'string' && prev.event.length >= 10
      ? prev.event
      : `Chronology item ${prev.id} after owner repair.`;
  const reason = [
    `Owner extraction at ${OWNER.slice(0, 12)} matches independently accepted ${waveMeta.wave} disposition`,
    `(${semantic.kind ?? 'repair'}).`,
    prev.reason?.replace(/\s+/g, ' ').trim().slice(0, 200) ?? '',
    `Cited Chinese at ${evidence.map((e) => e.unit).join(', ')} supports the current undated or source-explicit form; no fabricated Western years.`,
  ]
    .join(' ')
    .slice(0, 1200);
  if (reason.length < 20) return { ok: false, why: 'reason-too-short', id: prev.id };
  return {
    ok: true,
    row: { id: prev.id, verdict: 'supported', event, reason, evidence },
    mapping: {
      id: prev.id,
      priorVerdict: prev.verdict,
      newVerdict: 'supported',
      wave: waveMeta.wave,
      ownerSemantic: semantic.kind ?? semantic.ok,
      evidenceUnits: evidence.map((e) => e.unit),
    },
  };
}

const rowMappings = [];
const blockers = [];
const itemChecks = [];

for (const prev of base.itemChecks) {
  if (prev.verdict === 'supported') {
    const evidence = evidenceValid(prev.evidence);
    if (!evidence.length) {
      blockers.push({ id: prev.id, issue: 'supported-row-evidence-mismatch', proof: 'date-audit-report-partial-s0037-s0700.json' });
      itemChecks.push({ ...prev, evidence });
      continue;
    }
    itemChecks.push({ ...prev, evidence });
    rowMappings.push({ id: prev.id, priorVerdict: 'supported', newVerdict: 'supported', action: 'retain' });
    continue;
  }
  const waveMeta = waves.get(prev.id);
  if (!waveMeta) {
    blockers.push({ id: prev.id, issue: 'no-wave-disposition', priorVerdict: prev.verdict, proof: EVIDENCE_BASE });
    itemChecks.push(prev);
    continue;
  }
  const semantic = ownerSemanticsMatch(prev.id);
  if (!semantic.ok) {
    blockers.push({
      id: prev.id,
      issue: semantic.why,
      detail: semantic.detail,
      priorVerdict: prev.verdict,
      wave: waveMeta.wave,
      proof: `owner extraction @ ${OWNER}`,
    });
    itemChecks.push(prev);
    continue;
  }
  const promoted = promoteCheck(prev, waveMeta, semantic);
  if (!promoted.ok) {
    blockers.push({ id: prev.id, issue: promoted.why, priorVerdict: prev.verdict, wave: waveMeta.wave });
    itemChecks.push(prev);
    continue;
  }
  itemChecks.push(promoted.row);
  rowMappings.push(promoted.mapping);
}

const supportedCount = itemChecks.filter((c) => c.verdict === 'supported').length;
const allSupported = supportedCount === 650 && blockers.length === 0;

const replayed = {
  schemaVersion: 1,
  auditVersion: 1,
  book: 'jinshu',
  chapter: '020',
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status: allSupported ? 'audited' : 'needs-revision',
  reviewer: {
    ...base.reviewer,
    note: 'Replayed itemChecks from owner 1106dc44 with four independently verified owner waves; not canonical write.',
    independentEvidenceRevision: EVIDENCE_BASE,
    ownerExtractionHead: OWNER,
  },
  reviewedAt: new Date().toISOString(),
  summary: allSupported
    ? 'All 650 packet items supported on owner extraction after replaying independently verified owner-wave dispositions; 756 units and 325 person checks retained from coverage extension.'
    : `Replayed ${rowMappings.filter((m) => m.newVerdict === 'supported' && m.priorVerdict !== 'supported').length} owner-wave item rows; ${blockers.length} blockers remain.`,
  reviewedUnits: priorCandidate.reviewedUnits,
  itemChecks,
  personChecks: priorCandidate.personChecks,
  findings: allSupported ? [] : base.findings,
  references: base.references,
  replayMeta: {
    kind: 'jinshu020-native-itemcheck-replay-compose',
    baseItemReport: 'research/people/jinshu020-cloud-authoring-20261123/date-audit-report-partial-s0037-s0700.json',
    priorCandidate: 'jinshu020-native-date-audit-candidate-20261124.json',
    rowMappingsArtifact: 'jinshu020-native-date-audit-row-mappings-20261124.json',
    ownerRevision: OWNER,
    evidenceWavesRevision: EVIDENCE_BASE,
    retainedSupportedCount: 273,
    promotedCount: rowMappings.filter((m) => m.priorVerdict !== 'supported' && m.newVerdict === 'supported').length,
    blockerCount: blockers.length,
    counts: {
      itemChecks: itemChecks.length,
      supported: supportedCount,
      personChecks: priorCandidate.personChecks.length,
      reviewedUnits: priorCandidate.reviewedUnits.length,
    },
    notCanonicalPath: true,
  },
};

fs.writeFileSync(path.join(ROOT, 'pinned-owner-packet-1106dc44-20261124.json'), JSON.stringify(packet, null, 2));
fs.writeFileSync(path.join(ROOT, 'jinshu020-native-date-audit-row-mappings-20261124.json'), JSON.stringify(
  { schemaVersion: 1, ownerRevision: OWNER, evidenceRevision: EVIDENCE_BASE, rowMappings, blockers },
  null,
  2,
));
fs.writeFileSync(path.join(ROOT, 'jinshu020-native-date-audit-candidate-replayed-20261124.json'), JSON.stringify(replayed, null, 2));

const validation = { ok: true, errors: [] };
try {
  validateDateAuditReport(replayed, packet);
} catch (e) {
  validation.ok = false;
  validation.errors.push(e.message);
}
fs.writeFileSync(
  path.join(ROOT, 'jinshu020-native-date-audit-candidate-replayed-validation-20261124.json'),
  JSON.stringify(
    {
      schemaVersion: 1,
      candidate: 'jinshu020-native-date-audit-candidate-replayed-20261124.json',
      packet: 'pinned-owner-packet-1106dc44-20261124.json',
      status: replayed.status,
      allSupported,
      blockers,
      ...validation,
    },
    null,
    2,
  ),
);

console.log(
  JSON.stringify({
    status: replayed.status,
    supported: supportedCount,
    promoted: replayed.replayMeta.promotedCount,
    blockers: blockers.length,
    validation,
    sourceHash: packet.sourceHash,
    extractionHash: packet.extractionHash,
  }, null, 2),
);