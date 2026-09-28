import path from 'node:path';
import { applyDateRepairProposal, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '003';
const candidateCommit = '885f8e52fcb4891acf26043054d0c5bd8042f31a';
const independentReviewCommit = '5f79dcab4ac36cf7589a17e90d47c5c644c5bf3a';
const sealedCandidateHash = 'sha256:55877905ceb925a50ef179e82d0b9dd81e97db750f31c86516427c4b6f276f4c';
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const reviewFile = `${sealedCandidateHash.slice(7)}.candidate-review.json`;
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);

const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter);
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));

if (packet.sourceHash !== handoff.canonicalSourceHash || packet.extractionHash !== handoff.canonicalExtractionHash) {
  throw new Error('Canonical source or extraction changed since the sealed handoff');
}
if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash || audit.extractionHash !== packet.extractionHash) {
  throw new Error('Expected current needs-revision audit pinned to the pre-curation canonical extraction');
}
const reviewed = validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.disposition !== 'accept-for-host-curation' || reviewed.sealedCandidateHash !== sealedCandidateHash) {
  throw new Error('The sealed candidate lacks the accepted independent review');
}
if (handoff.proposal.changes.length !== 16) throw new Error('Expected exactly sixteen sealed repair operations');

const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (JSON.stringify(candidate) !== JSON.stringify(handoff.candidate)) {
  throw new Error('Canonical replay does not reproduce the sealed candidate');
}
const candidateHash = sha256(JSON.stringify(candidate));
if (candidateHash !== handoff.candidateExtractionHash) throw new Error('Candidate extraction hash mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), {
  strictAliasDispositions: true,
});
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry failed: ${JSON.stringify(geometry)}`);

writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(candidate));
const curated = readJson(extractionPath);
const curatedHash = sha256(JSON.stringify(curated));
if (curatedHash !== candidateHash) throw new Error('Compact serialization changed the curated extraction');
const stalePacket = buildDateAuditPacket(book, chapter);
if (stalePacket.extractionHash === audit.extractionHash) throw new Error('Curation did not invalidate the prior date audit');

const receipt = {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateCommit,
  candidateFile,
  sealedCandidateHash,
  candidateExtractionHash: candidateHash,
  candidateReview: reviewFile,
  independentReviewCommit,
  canonicalSourceHash: packet.sourceHash,
  priorCanonicalExtractionHash: packet.extractionHash,
  curatedAt: new Date().toISOString(),
  operations: handoff.proposal.changes.length,
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    canonicalReplay: 'PASS',
    compactValidation: `PASS: ${validation.stats.claims} claims; strict scoped alias-disposition validation.`,
    chronologyGeometry: 'PASS',
    priorDateAudit: 'STALE: curated extraction hash differs from the needs-revision audit pin; fresh independent whole-chapter audit required.',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh independent canonical date audit by a different reviewer.',
};
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.curation.json`), receipt);
console.log(JSON.stringify({ candidateHash, validation: validation.stats, geometry: 'PASS', priorAudit: 'STALE', receipt }));
