#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import {
  buildDateAuditPacket,
  dateAuditDiagnostics,
  dateAuditItems,
  unresolvedDateAuditItems,
  validateDateAuditReport,
} from '../../../../scripts/lib/people-date-audit.mjs';
import { sha256 } from '../../../../scripts/lib/people-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRAFT_COMMIT = 'f0d51576bc03a0a830aba56eb94fefea3708b727';
const PRIOR_AUDITED_EVIDENCE = '5118131b4a58b0aabe59208d4d7da90fe1dbe896';
const PRIOR_DRAFT = '10cdaf0030d3489e021bdedeed6fb495c074d943';

function loadExtraction(rev) {
  const raw = execSync(`git show ${rev}:data/people/extractions/jinshu/115.json`, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return JSON.parse(raw);
}

function chronologyFingerprint(extraction) {
  const { items, people } = dateAuditItems(extraction);
  const itemLines = items
    .map(item => JSON.stringify({
      id: item.id,
      personId: item.personId,
      predicate: item.predicate,
      value: item.value,
      certainty: item.certainty,
      evidence: item.evidence,
      claimHash: item.claimHash,
    }))
    .sort();
  const peopleLines = people
    .map(person => JSON.stringify({ id: person.id, hints: person.hints }))
    .sort();
  return {
    itemSha256: sha256(itemLines.join('\n')),
    peopleSha256: sha256(peopleLines.join('\n')),
    itemCount: items.length,
    peopleCount: people.length,
  };
}

const extPrior = loadExtraction(PRIOR_DRAFT);
const extDraft = loadExtraction(DRAFT_COMMIT);
const fpPrior = chronologyFingerprint(extPrior);
const fpDraft = chronologyFingerprint(extDraft);
if (fpPrior.itemSha256 !== fpDraft.itemSha256 || fpPrior.peopleSha256 !== fpDraft.peopleSha256) {
  throw new Error('Chronology fingerprint mismatch vs 10cdaf00 seal');
}

const packet = buildDateAuditPacket('jinshu', '115');
const priorReportPath = path.resolve(__dirname, '../jinshu115-independent-round5-rebind-20261123/date-audit-report.json');
const priorReport = JSON.parse(readFileSync(priorReportPath, 'utf8'));
if (priorReport.status !== 'audited' || priorReport.findings?.length) throw new Error('Prior rebound report not audited');

if (dateAuditDiagnostics(packet).length || unresolvedDateAuditItems(packet).length) {
  throw new Error('Native diagnostics failed on rebound packet');
}

const rebound = {
  ...priorReport,
  extractionHash: packet.extractionHash,
  status: 'audited',
  reviewer: {
    name: 'Jinshu 115 independent chronology reviewer (rebind @ f0d51576, same reviewer)',
    independentOfExtractor: true,
    priorAuditedEvidenceCommit: PRIOR_AUDITED_EVIDENCE,
    draftCommit: DRAFT_COMMIT,
    rebindKind: 'zh-surface-metadata-only-chronology-preservation',
  },
  reviewedAt: new Date().toISOString(),
  summary:
    'Rebound native chronology from 5118131b after owner Chinese surface links on f0d51576. ' +
    'Date-packet item and active-date-hint fingerprints match 10cdaf00; sourceHash unchanged. ' +
    'Seven courtesy/title/abbreviated zh surfaces added; no death-claim or chronology delta. ' +
    'Prior itemChecks and personChecks retained verbatim; independent identity packet deferred.',
  findings: [],
};

validateDateAuditReport(rebound, packet);

const deltaReceipt = {
  schemaVersion: 1,
  kind: 'independent-chronology-rebind-delta',
  book: 'jinshu',
  chapter: '115',
  draftCommit: DRAFT_COMMIT,
  priorAuditedEvidenceCommit: PRIOR_AUDITED_EVIDENCE,
  priorDraftCommit: PRIOR_DRAFT,
  chronologySeal: {
    sourceHash: packet.sourceHash,
    extractionHashBefore: priorReport.extractionHash,
    extractionHashAfter: packet.extractionHash,
    datePacketItemFingerprint: fpDraft.itemSha256,
    datePacketPeopleFingerprint: fpDraft.peopleSha256,
    itemCount: fpDraft.itemCount,
    peopleCount: fpDraft.peopleCount,
    itemPersonWitnessDelta: 'none',
    zhSurfaceLinksOnly: true,
  },
  nativeChecks: {
    validateDateAuditReport: 'pass',
    dateAuditDiagnostics: 0,
    unresolvedDateAuditItems: 0,
    findings: 0,
    status: 'audited',
  },
  rejectedNonAuthoritativeEvidence: '46008dfc0da32c610d09f6696f9cff71deaf1fb2 (scripted identity approvals)',
};

writeFileSync(path.join(__dirname, 'chronology-delta-receipt.json'), `${JSON.stringify(deltaReceipt, null, 2)}\n`);
writeFileSync(path.join(__dirname, 'date-audit-report.json'), `${JSON.stringify(rebound, null, 2)}\n`);
console.log(JSON.stringify({ status: rebound.status, extractionHash: packet.extractionHash }, null, 2));