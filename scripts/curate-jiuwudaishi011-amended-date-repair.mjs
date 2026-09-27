import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '011';
const candidateCommit = '19ed051eddca776d229e91e0db6147d071588e24';
const sealedCandidateHash = 'sha256:30557dc6c738c63361d521f988d67f769e58378270c9c6d337105db008edcda0';
const candidateExtractionHash = 'sha256:37a7df3a4ec76cfbd456bcdc12aee273d6f585c1739cb6ef31d123008ec0fc48';
const canonicalSourceHash = 'sha256:d476e3806ff45586a556ebff16032b8d546965eb30fdff1aacf4f9d3706b9162';
const canonicalExtractionHash = 'sha256:1f3ccf5a04c92e6302bf95462ae7de2d531092b7e7946d435b919af50dde79d3';
const repairDirectory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const acceptanceFile = `${sealedCandidateHash.slice(7)}.host-recorded-independent-acceptance.json`;
const curationFile = `${sealedCandidateHash.slice(7)}.curation.json`;
const reAuditPacketFile = `${candidateExtractionHash.slice(7)}.fresh-canonical-re-audit-packet.json`;
const handoff = readJson(path.join(repairDirectory, candidateFile));
const canonicalPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(canonicalPath);
const beforePacket = buildDateAuditPacket(book, chapter);
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);

if (handoff.kind !== 'date-repair-candidate-handoff' || handoff.book !== book || handoff.chapter !== chapter ||
    handoff.sealedCandidateHash !== sealedCandidateHash || handoff.candidateExtractionHash !== candidateExtractionHash ||
    handoff.canonicalSourceHash !== canonicalSourceHash || handoff.canonicalExtractionHash !== canonicalExtractionHash ||
    sealedDateRepairProposalHash(handoff.proposal) !== sealedCandidateHash ||
    sha256(JSON.stringify(handoff.candidate)) !== candidateExtractionHash) {
  throw new Error('The sealed Jiuwudaishi 011 amended handoff identity is not exact');
}
if (beforePacket.sourceHash !== canonicalSourceHash || beforePacket.extractionHash !== canonicalExtractionHash ||
    sha256(JSON.stringify(canonical)) !== canonicalExtractionHash) {
  throw new Error('Canonical source or extraction pins are stale; do not curate');
}
const kindCounts = handoff.proposal.changes.reduce((counts, change) => {
  counts[change.kind] = (counts[change.kind] ?? 0) + 1;
  return counts;
}, {});
const expectedKinds = { replace: 26, remove: 6, 'add-reception-event': 4, add: 1, hints: 25 };
if (handoff.proposal.changes.length !== 62 || !equal(kindCounts, expectedKinds)) {
  throw new Error(`The accepted amendment operation scope changed: ${JSON.stringify(kindCounts)}`);
}

// This is a durable transcription of the separately supplied acceptance, not a
// replacement review or an approval of the canonical chapter.
const acceptance = {
  schemaVersion: 1,
  kind: 'host-recorded-independent-date-repair-acceptance-attachment',
  book,
  chapter,
  candidateCommit,
  reviewer: 'independent_jwd011_amended_review',
  disposition: 'accept-for-host-curation',
  sealedCandidateHash,
  candidateExtractionHash,
  canonicalSourceHash,
  canonicalExtractionHash,
  validation: {
    canonicalPins: 'PASS',
    exactReplay: 'PASS',
    compactValidation: 'PASS: 34 people, 177 mentions, 350 claims, zero alias-disposition conflicts.',
    chronologyGeometry: 'PASS: zero diagnostics.'
  },
  sourceFindings: {
    kaiping: '開平初 is retained as explicit posthumous-commemoration with Western year unspecified.',
    yiWenGui: '以溫貴 is retained as an undated source attestation.',
    westernFields: 'Neither retained record has Western date fields; p001 has no active-date hints.'
  },
  authorization: 'Direct independent acceptance declaration supplied to the trusted host; this attachment does not approve the fresh canonical re-audit.'
};
writeJsonAtomic(path.join(repairDirectory, acceptanceFile), acceptance);

const candidate = applyDateRepairProposal(canonical, handoff.proposal, beforePacket);
if (!equal(candidate, handoff.candidate) || sha256(JSON.stringify(candidate)) !== candidateExtractionHash) {
  throw new Error('Exact replay does not reproduce the independently accepted candidate');
}
const p001 = candidate.people.find(person => person[0] === 'p001');
const p001Claims = candidate.claims.filter(claim => claim[0] === 'p001');
const hasPosthumousKaiping = p001Claims.some(claim => claim[1] === 'event-participation' && claim[2]?.kind === 'posthumous-commemoration' && claim[2]?.summary === 'Source date wording: 開平初; Western year unspecified.');
const hasUndatedYiWenGui = p001Claims.some(claim => claim[1] === 'attestation' && claim[2]?.undatedSourceAttestation && claim[2]?.event?.includes('以溫貴'));
const p001HasWesternDate = p001Claims.some(claim => ['westernYear', 'westernInterval', 'westernBounds'].some(key => key in claim[2]));
if (!hasPosthumousKaiping || !hasUndatedYiWenGui || p001HasWesternDate || p001?.[4]?.a?.length) {
  throw new Error('The accepted p001 source-preservation findings do not hold in the exact replay');
}
const compactValidation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
if (compactValidation.stats.people !== 34 || compactValidation.stats.mentions !== 177 || compactValidation.stats.claims !== 350 || compactValidation.stats.aliasDispositionConflicts !== 0) {
  throw new Error(`Unexpected compact validation statistics: ${JSON.stringify(compactValidation.stats)}`);
}
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

writeJsonAtomic(canonicalPath, candidate);
const persisted = readJson(canonicalPath);
if (!equal(persisted, candidate) || sha256(JSON.stringify(persisted)) !== candidateExtractionHash) {
  throw new Error('Persisted canonical extraction differs from the sealed candidate');
}
const freshPacket = buildDateAuditPacket(book, chapter);
if (freshPacket.sourceHash !== canonicalSourceHash || freshPacket.extractionHash !== candidateExtractionHash ||
    freshPacket.units.length !== 57 || freshPacket.items.length !== 91 || freshPacket.people.length !== 34) {
  throw new Error('Fresh canonical re-audit packet is not the complete pinned Jiuwudaishi 011 scope');
}
const freshPacketHash = sha256(JSON.stringify(freshPacket));
writeJsonAtomic(path.join(repairDirectory, reAuditPacketFile), freshPacket);
const savedPacket = readJson(path.join(repairDirectory, reAuditPacketFile));
if (sha256(JSON.stringify(savedPacket)) !== freshPacketHash) throw new Error('Fresh canonical re-audit packet did not persist exactly');

writeJsonAtomic(path.join(repairDirectory, curationFile), {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateCommit,
  candidateFile,
  acceptanceAttachment: acceptanceFile,
  sealedCandidateHash,
  candidateExtractionHash,
  canonicalSourceHash,
  priorCanonicalExtractionHash: canonicalExtractionHash,
  curatedAt: new Date().toISOString(),
  operations: handoff.proposal.changes.length,
  operationKinds: kindCounts,
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedIndependentAttachment: 'PASS',
    exactReplayAndHash: 'PASS',
    p001SourcePreservation: 'PASS',
    compactValidation: 'PASS: 34 people, 177 mentions, 350 claims, zero alias-disposition conflicts.',
    chronologyGeometry: 'PASS: zero diagnostics.'
  },
  freshCanonicalReaudit: {
    status: 'required',
    packetFile: reAuditPacketFile,
    packetHash: freshPacketHash,
    sourceHash: freshPacket.sourceHash,
    extractionHash: freshPacket.extractionHash,
    completeScope: { sourceUnits: freshPacket.units.length, temporalClaimAndHintChecks: freshPacket.items.length, people: freshPacket.people.length },
    requiredReviewerConstraint: 'A reviewer independent of the amended candidate author and this host curation must check every source unit and every date-bearing claim or hint.'
  },
  publication: 'staging-only',
  masterMutation: 'NONE'
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, freshPacketHash, sourceUnits: freshPacket.units.length, checks: freshPacket.items.length, people: freshPacket.people.length }));
