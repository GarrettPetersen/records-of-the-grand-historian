import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'houhanshu';
const chapter = '031';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = 'staged-candidate-db1a755d21af3dee44b5.json';
const reviewFile = '175baa970d8c5f9fd06ec5cdf3aba6c4bc2b48f521f04fb461781804d1c06486.candidate-review.json';
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const extractionFile = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const current = readJson(extractionFile);
const packet = buildDateAuditPacket(book, chapter);
const currentHash = sha256(JSON.stringify(current));

if (handoff.book !== book || handoff.chapter !== chapter || review.disposition !== 'accept-for-host-curation' ||
    !review.reviewer?.independentOfExtractor || !review.reviewer?.independentOfCandidateCurator) {
  throw new Error('Handoff or review is not an accepted independent Houhanshu 031 candidate');
}
const identities = validateStagedDateRepairReview(handoff, review, candidateFile);
if (handoff.sealedCandidateHash !== 'sha256:175baa970d8c5f9fd06ec5cdf3aba6c4bc2b48f521f04fb461781804d1c06486' ||
    identities.sealedCandidateHash !== handoff.sealedCandidateHash ||
    sealedDateRepairProposalHash(handoff.proposal) !== handoff.sealedCandidateHash) {
  throw new Error('Unexpected sealed proposal identity');
}
if (packet.sourceHash !== handoff.canonicalSourceHash || packet.sourceHash !== review.sourceHash ||
    ![handoff.canonicalExtractionHash, handoff.candidateExtractionHash].includes(packet.extractionHash) ||
    ![handoff.canonicalExtractionHash, handoff.candidateExtractionHash].includes(currentHash)) {
  throw new Error('Canonical source or extraction pins are stale; do not curate');
}
if (handoff.proposal.changes.length !== 1 || handoff.proposal.changes[0].kind !== 'remove' || handoff.proposal.changes[0].id !== 'claim-173') {
  throw new Error('The accepted proposal must remove only claim-173');
}
const fatherClaim = current.claims[currentHash === handoff.canonicalExtractionHash ? 178 : 177];
if (!fatherClaim || fatherClaim[0] !== 'p002' || JSON.stringify(fatherClaim) !== JSON.stringify(handoff.candidate.claims[177])) {
  throw new Error('The father’s claim-179 is not byte-identical in the candidate');
}
const replay = currentHash === handoff.canonicalExtractionHash
  ? applyDateRepairProposal(current, handoff.proposal, packet)
  : current;
if (JSON.stringify(replay) !== JSON.stringify(handoff.candidate) || sha256(JSON.stringify(replay)) !== handoff.candidateExtractionHash) {
  throw new Error('Accepted candidate does not replay byte-for-byte from current canonical extraction');
}
const validation = validateCompactPeopleExtraction(replay, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(replay));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);
const compact = serializeCompactPeopleExtraction(replay);
if (sha256(JSON.stringify(JSON.parse(compact))) !== handoff.candidateExtractionHash) throw new Error('Compact serialization changes the reviewed candidate');

const curationFile = `${handoff.sealedCandidateHash.slice(7)}.curation.json`;
const receipt = {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateFile,
  sealedCandidateHash: handoff.sealedCandidateHash,
  candidateExtractionHash: handoff.candidateExtractionHash,
  candidateReview: reviewFile,
  canonicalSourceHash: packet.sourceHash,
  priorCanonicalExtractionHash: packet.extractionHash,
  curatedAt: new Date().toISOString(),
  operations: 1,
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    canonicalReplay: 'PASS',
    fatherClaim179Preserved: 'PASS',
    compactValidation: `PASS: ${validation.stats.claims} claims.`,
    chronologyGeometry: 'PASS',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh independent canonical date audit by a different reviewer.',
};

// The receipt is persisted before canonical replacement so recovery has a
// durable, sealed record if a write is interrupted between the two files.
if (currentHash === handoff.canonicalExtractionHash) writeJsonAtomic(path.join(directory, curationFile), receipt);
writeTextAtomic(extractionFile, compact);
const persisted = readJson(extractionFile);
if (sha256(JSON.stringify(persisted)) !== handoff.candidateExtractionHash) throw new Error('Persisted canonical extraction differs from the sealed candidate');
console.log(JSON.stringify({ curationFile, sealedCandidateHash: handoff.sealedCandidateHash, candidateExtractionHash: handoff.candidateExtractionHash, claims: validation.stats.claims }));
