import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '131';
const candidateCommit = '4adee3f597d6fddc3d47ec4ac7794647f86c6236';
const independentReviewCommit = '396bb253de42f28d13b55a1fef7ae60a808a77e2';
const sealedCandidateHash = 'sha256:b62c51980d8d073dd30323c653df85419d3dc27ef74a6d3db582382341564b42';
const expectedCandidateHash = 'sha256:cddd727099ec9f1891d4444911adfe92422731704e0387a0ec1864be3dbd273a';
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const reviewFile = `${sealedCandidateHash.slice(7)}.candidate-review.json`;
const repairDirectory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const handoff = readJson(path.join(repairDirectory, candidateFile));
const review = readJson(path.join(repairDirectory, reviewFile));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter);
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

if (packet.sourceHash !== handoff.canonicalSourceHash || packet.extractionHash !== handoff.canonicalExtractionHash) {
  throw new Error('Canonical source or extraction differs from the accepted replacement candidate');
}
if (handoff.sealedCandidateHash !== sealedCandidateHash || sealedDateRepairProposalHash(handoff.proposal) !== sealedCandidateHash ||
    handoff.candidateExtractionHash !== expectedCandidateHash || sha256(JSON.stringify(handoff.candidate)) !== expectedCandidateHash) {
  throw new Error('Sealed candidate identity mismatch');
}
validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.candidateCommit !== candidateCommit || review.disposition !== 'accept-for-host-curation' ||
    review.expectedCanonicalAuditStatus !== 'requires-fresh-independent-audit' || review.sourceHash !== packet.sourceHash ||
    review.originalExtractionHash !== packet.extractionHash) {
  throw new Error('Independent review does not authorize this exact staging-only curation');
}
const changes = handoff.proposal.changes;
const counts = Object.fromEntries(['replace', 'hints'].map(kind => [kind, changes.filter(change => change.kind === kind).length]));
if (changes.length !== 33 || !same(counts, { replace: 17, hints: 16 })) {
  throw new Error(`Expected 17 replacements and 16 paired hint changes, got ${JSON.stringify(counts)}`);
}
const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (!same(candidate, handoff.candidate) || sha256(JSON.stringify(candidate)) !== expectedCandidateHash) {
  throw new Error('Exact 33-operation replay does not reproduce the sealed candidate');
}
const changedTopLevel = Object.keys(canonical).filter(key => !same(canonical[key], candidate[key]));
if (!same(changedTopLevel, ['people', 'claims'])) throw new Error(`Non-date top-level drift: ${JSON.stringify(changedTopLevel)}`);
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry diagnostics: ${JSON.stringify(geometry)}`);

writeJsonAtomic(extractionPath, candidate);
const curated = readJson(extractionPath);
if (!same(curated, candidate) || sha256(JSON.stringify(curated)) !== expectedCandidateHash) {
  throw new Error('Canonical serialization altered the sealed candidate');
}
writeJsonAtomic(path.join(repairDirectory, `${sealedCandidateHash.slice(7)}.curation.json`), {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateCommit,
  independentReviewCommit,
  candidateFile,
  candidateReview: reviewFile,
  sealedCandidateHash,
  candidateExtractionHash: expectedCandidateHash,
  canonicalSourceHash: packet.sourceHash,
  priorCanonicalExtractionHash: packet.extractionHash,
  curatedAt: new Date().toISOString(),
  operations: changes.length,
  auditGroups: 4,
  scope: { claimReplacements: counts.replace, activeHintRevisions: counts.hints },
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    exactOperationScope: 'PASS: 17 claim replacements and 16 paired active-hint revisions; rejected closed intervals and inherited endpoints remain absent.',
    exactReplayAndHash: 'PASS',
    compactValidation: `PASS: ${validation.stats.claims} claims.`,
    chronologyGeometry: 'PASS: zero diagnostics.'
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  sharedTreeMutation: 'NONE',
  nextStep: 'Fresh complete independent canonical date audit by a different reviewer.'
});
console.log(JSON.stringify({ candidateHash: expectedCandidateHash, operations: changes.length, counts, changedTopLevel, validation: validation.stats, geometry: geometry.length }));
