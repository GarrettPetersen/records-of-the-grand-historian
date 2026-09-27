import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '133';
const candidateCommit = 'f2fb15a8fd2dd5ec643cee30f045cdbf418d2485';
const independentReviewCommit = '5d4effe15daacf7defacdf1ab123079f7c2b4da1';
const sealedCandidateHash = 'sha256:564d6ffd73d15e623c672bceb2a2d607b3036dce94da21f78db6d82bef89749f';
const expectedCandidateHash = 'sha256:a835356cddd17e6b46ad41490677a512d80a4d2f0765da250216e5ad8c37ce3a';
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
  throw new Error('Canonical source or extraction differs from the accepted JWD133 candidate');
}
if (handoff.sealedCandidateHash !== sealedCandidateHash || sealedDateRepairProposalHash(handoff.proposal) !== sealedCandidateHash ||
    handoff.candidateExtractionHash !== expectedCandidateHash || sha256(JSON.stringify(handoff.candidate)) !== expectedCandidateHash) {
  throw new Error('JWD133 sealed candidate identity mismatch');
}
validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.candidateCommit !== candidateCommit || review.disposition !== 'accept-for-host-curation' ||
    review.expectedCanonicalAuditStatus !== 'requires-fresh-independent-audit' || review.validation?.canonicalSourceHash !== packet.sourceHash ||
    review.validation?.canonicalExtractionHash !== packet.extractionHash) {
  throw new Error('Independent review does not authorize this exact staging-only curation');
}
const changes = handoff.proposal.changes;
const counts = Object.fromEntries(['replace', 'hints'].map(kind => [kind, changes.filter(change => change.kind === kind).length]));
if (changes.length !== 7 || !same(counts, { replace: 3, hints: 4 })) {
  throw new Error(`Expected three replacements and four paired hint changes, got ${JSON.stringify(counts)}`);
}
const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (!same(candidate, handoff.candidate) || sha256(JSON.stringify(candidate)) !== expectedCandidateHash) {
  throw new Error('Exact seven-operation replay does not reproduce the sealed JWD133 candidate');
}
const changedTopLevel = Object.keys(canonical).filter(key => !same(canonical[key], candidate[key]));
if (!same(changedTopLevel, ['people', 'claims'])) throw new Error(`Non-date top-level drift: ${JSON.stringify(changedTopLevel)}`);
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry diagnostics: ${JSON.stringify(geometry)}`);

writeJsonAtomic(extractionPath, candidate);
const curated = readJson(extractionPath);
if (!same(curated, candidate) || sha256(JSON.stringify(curated)) !== expectedCandidateHash) {
  throw new Error('Canonical serialization altered the sealed JWD133 candidate');
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
    exactOperationScope: 'PASS: three date-context removals and four paired active-hint revisions; no people, claim, evidence, or source records were added or removed.',
    p170Attestation: 'PASS: p170 claim-549 remains a separate AD 870-980 chapter-attestation and does not date the undated Luoping-kingship claim.',
    p224NarrativePerspective: 'PASS: p224 remains an explicit non-biographical narrative-perspective label, not a personal active-life date.',
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
