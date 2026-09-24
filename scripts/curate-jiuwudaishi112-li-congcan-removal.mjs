import path from 'node:path';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '112';
const candidateCommit = '676d180f7cc0120a3d2cfa455a48558b666a1081';
const reviewCommit = 'db6ae400bddb31fc666444160b988688901411e0';
const validatorFix = 'a3c4ab7ab54a9fc30f30fd283fffb6eab582407b';
const sealedCandidateHash = 'sha256:c6f1887481d013569e8a86d4030eba83787db9d3944c9126d4e3996f6e03536a';
const candidateExtractionHash = 'sha256:ffaec784efce8ca3a60a7d264b44161407926ec0ce737837e8d662a580c6f9a6';
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const reviewFile = `${sealedCandidateHash.slice(7)}.candidate-review.json`;
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(extractionPath);
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);

if (packet.sourceHash !== handoff.canonicalSourceHash || packet.extractionHash !== handoff.canonicalExtractionHash ||
    sha256(JSON.stringify(audit)) !== handoff.auditReportHash) throw new Error('Canonical pins or audit report are stale');
if (review.candidateRef !== candidateCommit || review.validatorFixRef !== validatorFix || review.scope?.stagingOnly !== true ||
    review.scope?.auditReportHash !== handoff.auditReportHash) throw new Error('Acceptance receipt does not bind the mandated candidate, validator, and audit');
const reviewed = validateStagedDateRepairReview(handoff, review, candidateFile);
if (reviewed.sealedCandidateHash !== sealedCandidateHash || reviewed.candidateExtractionHash !== candidateExtractionHash ||
    sealedDateRepairProposalHash(handoff.proposal) !== sealedCandidateHash || handoff.proposal.changes.length !== 49) {
  throw new Error('Accepted sealed proposal identity or operation count changed');
}
const removal = handoff.proposal.changes[32];
if (removal.kind !== 'remove' || removal.id !== 'claim-68' || removal.after !== undefined) throw new Error('Operation 33 must be a true claim-68 removal');
const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (JSON.stringify(candidate) !== JSON.stringify(handoff.candidate) || sha256(JSON.stringify(candidate)) !== candidateExtractionHash) {
  throw new Error('Exact accepted candidate does not replay from canonical extraction');
}
if (candidate.claims.some(claim => claim === removal.before)) throw new Error('claim-68 remains after curation');
const liCongcanAttestations = candidate.claims.filter(claim => claim[0] === 'p028' && claim[1] === 'attestation');
const liCongcanDeathBounds = candidate.claims.filter(claim => claim[0] === 'p028' && claim[1] === 'death' &&
  claim[2]?.dateContext?.westernBounds?.before?.era === 'AD' && claim[2]?.dateContext?.westernBounds?.before?.year === 951);
if (liCongcanAttestations.length !== 0 || liCongcanDeathBounds.length !== 1) {
  throw new Error('Li Congcan must retain only the sole source-backed before-AD-951 death bound');
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry failed: ${JSON.stringify(geometry)}`);
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(candidate));
if (sha256(JSON.stringify(readJson(extractionPath))) !== candidateExtractionHash) throw new Error('Compact serialization changed the sealed candidate');
const receipt = {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateCommit,
  candidateFile,
  sealedCandidateHash,
  candidateExtractionHash,
  candidateReview: reviewFile,
  independentReviewCommit: reviewCommit,
  validatorFix,
  canonicalSourceHash: packet.sourceHash,
  priorCanonicalExtractionHash: packet.extractionHash,
  auditReportHash: handoff.auditReportHash,
  operations: 49,
  validation: {
    canonicalPins: 'PASS',
    acceptedReviewIdentity: 'PASS',
    exactProposalReplay: 'PASS',
    trueClaim68Removal: 'PASS',
    liCongcanSoleDeathBound: 'PASS',
    compactValidation: `PASS: ${validation.stats.claims} claims.`,
    chronologyGeometry: 'PASS',
    nonDateRepairScope: 'PASS',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh independent canonical date audit by a different reviewer.',
};
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.curation.json`), receipt);
console.log(JSON.stringify({ candidateExtractionHash, operations: handoff.proposal.changes.length, validation: validation.stats, geometry: 'PASS', receipt }));
