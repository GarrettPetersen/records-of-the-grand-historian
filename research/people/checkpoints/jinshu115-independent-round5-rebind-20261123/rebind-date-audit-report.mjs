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
import { sha256, readJson } from '../../../../scripts/lib/people-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRAFT_COMMIT = '10cdaf0030d3489e021bdedeed6fb495c074d943';
const PRIOR_AUDITED_EVIDENCE = '3b2c69e2f45ad14a5265ca76d3a4bfa89ce35324';
const PRIOR_DRAFT = '67657d5033ccdc05b513ddf30036af5cea8f2728';
const HISTORICAL_QUEUE = '2027064166bf6d16ac926f99fad04a4b653d01cf';

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
  throw new Error(`Chronology fingerprint mismatch: items ${fpPrior.itemSha256} vs ${fpDraft.itemSha256}`);
}

const packet = buildDateAuditPacket('jinshu', '115');
const priorReportPath = path.resolve(__dirname, '../jinshu115-independent-round4-20261123/date-audit-report.json');
const priorReport = JSON.parse(readFileSync(priorReportPath, 'utf8'));

if (priorReport.status !== 'audited' || priorReport.itemChecks.length !== 496 || priorReport.findings.length) {
  throw new Error('Prior audited report missing or not clean');
}

const recovery = readJson(path.resolve(__dirname, '../../../../research/people/jinshu115-historical-authorship-recovery-20261123.json'));
if (recovery.semanticChanges !== false || recovery.author !== 'grokbot-35') {
  throw new Error('Authorship recovery receipt does not affirm metadata-only scope');
}

const chunks = extDraft.run?.chunks ?? [];
const expectedRanges = recovery.chunkRanges;
if (chunks.length !== 7 || expectedRanges.length !== 7) throw new Error('Chunk count mismatch');
for (let i = 0; i < 7; i += 1) {
  const chunk = chunks[i];
  const [id, start, end] = expectedRanges[i];
  if (chunk.chunkId !== id || chunk.startOrder !== start || chunk.endOrderExclusive !== end) {
    throw new Error(`Chunk range mismatch at ${id}`);
  }
  if (chunk.agentId !== 'grokbot-35') throw new Error(`Chunk ${id} agentId not grokbot-35`);
}

if (dateAuditDiagnostics(packet).length || unresolvedDateAuditItems(packet).length) {
  throw new Error('Native diagnostics failed on rebound packet');
}

const rebound = {
  ...priorReport,
  extractionHash: packet.extractionHash,
  status: 'audited',
  reviewer: {
    name: 'Jinshu 115 independent chronology reviewer (rebind @ 10cdaf00, same reviewer)',
    independentOfExtractor: true,
    priorAuditedEvidenceCommit: PRIOR_AUDITED_EVIDENCE,
    draftCommit: DRAFT_COMMIT,
    rebindKind: 'metadata-only-chronology-preservation',
  },
  reviewedAt: new Date().toISOString(),
  summary:
    'Rebound native chronology approval from evidence 3b2c69e2 after metadata-only extraction authorship recovery on draft #5470 at 10cdaf00. ' +
    'Chronology fingerprint (496 date-packet items, 234 people hints) is byte-identical to the audited seal at 67657d50; sourceHash unchanged. ' +
    'Owner restored grokbot-35 on seven sealed chunk ranges per historical queue 2027064166; runIds remain null as preserved. ' +
    'No item or person witness re-audit performed; prior itemChecks and personChecks retained verbatim.',
  findings: [],
};

validateDateAuditReport(rebound, packet);

const deltaReceipt = {
  schemaVersion: 1,
  kind: 'independent-chronology-rebind-delta',
  book: 'jinshu',
  chapter: '115',
  pullRequest: 5483,
  draftCommit: DRAFT_COMMIT,
  priorAuditedEvidenceCommit: PRIOR_AUDITED_EVIDENCE,
  priorDraftCommit: PRIOR_DRAFT,
  historicalQueueRevision: HISTORICAL_QUEUE,
  authorshipRecovery: {
    path: 'research/people/jinshu115-historical-authorship-recovery-20261123.json',
    originalPullRequest: recovery.originalPullRequest,
    originalCommit: recovery.originalCommit,
    author: recovery.author,
    semanticChanges: recovery.semanticChanges,
  },
  chronologySeal: {
    sourceHash: packet.sourceHash,
    extractionHashBefore: priorReport.extractionHash,
    extractionHashAfter: packet.extractionHash,
    datePacketItemFingerprint: fpDraft.itemSha256,
    datePacketPeopleFingerprint: fpDraft.peopleSha256,
    itemCount: fpDraft.itemCount,
    peopleCount: fpDraft.peopleCount,
    itemPersonWitnessDelta: 'none',
  },
  nativeChecks: {
    validateDateAuditReport: 'pass',
    dateAuditDiagnostics: 0,
    unresolvedDateAuditItems: 0,
    findings: 0,
    status: 'audited',
  },
  canonicalIdentityNote: 'Unchanged hold on catalog-dependent Guangwu merge; see round-4 canonical-identity-dependency.json.',
};

writeFileSync(path.join(__dirname, 'chronology-delta-receipt.json'), `${JSON.stringify(deltaReceipt, null, 2)}\n`);
writeFileSync(path.join(__dirname, 'date-audit-report.json'), `${JSON.stringify(rebound, null, 2)}\n`);

console.log(JSON.stringify({
  status: rebound.status,
  extractionHash: packet.extractionHash,
  itemFingerprint: fpDraft.itemSha256.slice(0, 24),
  rebind: true,
}, null, 2));