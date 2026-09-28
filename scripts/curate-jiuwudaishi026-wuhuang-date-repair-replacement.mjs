import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '026';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = 'staged-candidate-9cd6ef5a8a618b41172f.json';
const reviewFile = '9cd6ef5a8a618b41172fe84f2bcf38d78869fb65d5c5bb8eaf5756da7b882a6d.candidate-review.json';
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const extractionFile = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const current = readJson(extractionFile);
const packet = buildDateAuditPacket(book, chapter);
const currentHash = sha256(JSON.stringify(current));

if (handoff.book !== book || handoff.chapter !== chapter || review.disposition !== 'accept-for-host-curation' ||
    !review.reviewer?.independentOfExtractor || !review.reviewer?.independentOfCandidateCurator) {
  throw new Error('Handoff or host-recorded independent acceptance is not eligible for Jiuwudaishi 026 curation');
}
const identities = validateStagedDateRepairReview(handoff, review, candidateFile);
if (handoff.sealedCandidateHash !== 'sha256:9cd6ef5a8a618b41172fe84f2bcf38d78869fb65d5c5bb8eaf5756da7b882a6d' ||
    identities.sealedCandidateHash !== handoff.sealedCandidateHash ||
    sealedDateRepairProposalHash(handoff.proposal) !== handoff.sealedCandidateHash) {
  throw new Error('Unexpected replacement sealed proposal identity');
}
if (packet.sourceHash !== handoff.canonicalSourceHash || packet.sourceHash !== review.sourceHash ||
    ![handoff.canonicalExtractionHash, handoff.candidateExtractionHash].includes(packet.extractionHash) ||
    ![handoff.canonicalExtractionHash, handoff.candidateExtractionHash].includes(currentHash)) {
  throw new Error('Canonical source or extraction pins are stale; do not curate');
}
if (handoff.proposal.changes.length !== 1 || handoff.proposal.changes[0].kind !== 'replace' || handoff.proposal.changes[0].id !== 'claim-477') {
  throw new Error('The accepted replacement must change only claim-477');
}
const replay = currentHash === handoff.canonicalExtractionHash
  ? applyDateRepairProposal(current, handoff.proposal, packet)
  : current;
if (JSON.stringify(replay) !== JSON.stringify(handoff.candidate) || sha256(JSON.stringify(replay)) !== handoff.candidateExtractionHash) {
  throw new Error('Accepted replacement does not replay byte-for-byte from canonical extraction');
}
const validation = validateCompactPeopleExtraction(replay, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(replay));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);
const compact = serializeCompactPeopleExtraction(replay);
if (sha256(JSON.stringify(JSON.parse(compact))) !== handoff.candidateExtractionHash) throw new Error('Compact serialization changes the accepted candidate');
const retainedHolds = ['p157','p158','p159','p160','p161','p162','p163','p170','p171','p172','p173','p174','p178','p179','p180','p181'];
const personById = extraction => new Map(extraction.people.map(person => [person[0], person]));
const currentPeople = personById(current);
const replayPeople = personById(replay);
if (!retainedHolds.every(id => JSON.stringify(currentPeople.get(id)) === JSON.stringify(replayPeople.get(id)))) {
  throw new Error('Replacement must preserve every existing research/legendary hold unchanged');
}

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
  priorCanonicalExtractionHash: handoff.canonicalExtractionHash,
  curatedAt: new Date().toISOString(),
  operations: 1,
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS: host-recorded independent replacement acceptance',
    canonicalReplay: 'PASS',
    operationScope: 'PASS: only claim-477 retains s0253 Tianyou 5 AD 908 and removes unrelated s0245 Tianyou 4–5 provenance.',
    retainedResearchAndLegendaryHolds: 'PASS: 16 unchanged.',
    compactValidation: `PASS: ${validation.stats.claims} claims.`,
    chronologyGeometry: 'PASS',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh independent canonical date audit; retained research/legendary holds make the chapter research-blocked.',
};

writeJsonAtomic(path.join(directory, curationFile), receipt);
writeTextAtomic(extractionFile, compact);
const persisted = readJson(extractionFile);
if (sha256(JSON.stringify(persisted)) !== handoff.candidateExtractionHash) throw new Error('Persisted canonical extraction differs from the accepted candidate');
console.log(JSON.stringify({ curationFile, sealedCandidateHash: handoff.sealedCandidateHash, candidateExtractionHash: handoff.candidateExtractionHash, claims: validation.stats.claims }));
