import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';

const validatorModule = process.env.PEOPLE_COMPACT_VALIDATOR ?? './validate-people-extraction.mjs';
const { validateCompactPeopleExtraction } = await import(validatorModule);

const book = 'jiuwudaishi';
const chapter = '112';
const ref = 'origin/codex/people-glossary-staging-v2';
const rejectedSeal = 'sha256:c60f0842b211ad68da6f4ab891e2769f8f603718a65d178893f711f65c3c4182';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const rejectedFile = path.join(directory, `staged-candidate-${rejectedSeal.slice(7, 27)}.json`);
const remoteJson = file => JSON.parse(execFileSync('git', ['show', `${ref}:${file}`], { encoding: 'utf8' }));

const rejected = readJson(rejectedFile);
const extraction = remoteJson(`data/people/extractions/${book}/${chapter}.json`);
const audit = remoteJson(`data/people/date-audits/${book}/${chapter}.json`);
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (rejected.sealedCandidateHash !== rejectedSeal || rejected.canonicalSourceHash !== packet.sourceHash ||
    rejected.canonicalExtractionHash !== packet.extractionHash || sha256(JSON.stringify(extraction)) !== packet.extractionHash ||
    sha256(JSON.stringify(audit)) !== rejected.auditReportHash) {
  throw new Error('Rejected handoff, current source, or canonical staging pins are stale');
}

const finding = audit.findings.find(item => item.items.includes('claim-68') && item.items.includes('hints-p028'));
if (!finding || finding.action !== 'Remove claim-68 and hints-p028; retain claim-151 exactly as the source-supported before-AD-951 death bound.') {
  throw new Error('Li Congcan audit instruction no longer matches the rejected handoff');
}

const proposal = structuredClone(rejected.proposal);
const erroneousIndex = proposal.changes.findIndex(change => change.id === 'claim-68');
if (erroneousIndex !== 32 || proposal.changes.length !== 49 || proposal.changes[erroneousIndex].kind !== 'replace') {
  throw new Error('Rejected handoff does not contain the expected operation 33');
}
const erroneous = proposal.changes[erroneousIndex];
proposal.author = {
  name: 'Codex Jiuwudaishi 112 audit37f898d36b corrected sealed source-faithful date-repair candidate',
  agentId: 'date_repair_candidate2_jiuwudaishi112',
};
proposal.changes[erroneousIndex] = {
  kind: 'remove',
  id: erroneous.id,
  before: erroneous.before,
  reason: erroneous.reason,
};

for (let index = 0; index < rejected.proposal.changes.length; index += 1) {
  if (index === erroneousIndex) continue;
  if (JSON.stringify(proposal.changes[index]) !== JSON.stringify(rejected.proposal.changes[index])) {
    throw new Error(`Operation ${index + 1} changed outside the mandated Li Congcan removal`);
  }
}

const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
if (candidate.claims.some(claim => claim === erroneous.before)) throw new Error('claim-68 was not removed');
const liCongcanClaims = candidate.claims.filter(claim => claim[0] === 'p028' && claim[1] === 'attestation' &&
  claim[2]?.westernBounds?.before?.era === 'AD' && claim[2]?.westernBounds?.before?.year === 951);
if (liCongcanClaims.length !== 0) throw new Error('Li Congcan still has a duplicate Western-bearing attestation');
const liCongcanDeathBounds = candidate.claims.filter(claim => claim[0] === 'p028' && claim[1] === 'death' &&
  claim[2]?.dateContext?.westernBounds?.before?.era === 'AD' && claim[2]?.dateContext?.westernBounds?.before?.year === 951);
if (liCongcanDeathBounds.length !== 1) throw new Error('claim-151 is not the sole retained pre-AD-951 death bound');

const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
writeJsonAtomic(path.join(directory, candidateFile), {
  schemaVersion: 1,
  kind: 'date-repair-candidate-handoff',
  book,
  chapter,
  canonicalSourceHash: packet.sourceHash,
  canonicalExtractionHash: packet.extractionHash,
  auditReportHash: sha256(JSON.stringify(audit)),
  author: proposal.author,
  sealedCandidateHash,
  candidateExtractionHash,
  proposal,
  candidate,
  candidatePacket,
  validation: { status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats },
  auditEvidence: { findings: audit.findings },
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1,
  kind: 'independent-staged-date-repair-review-packet',
  book,
  chapter,
  candidateFile,
  sourceHash: packet.sourceHash,
  originalExtractionHash: packet.extractionHash,
  sealedCandidateHash,
  candidateExtractionHash,
  candidatePacket,
  auditEvidence: { findings: audit.findings },
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: proposal.changes.length, preservedOperations: 48, stats: validation.stats }));
