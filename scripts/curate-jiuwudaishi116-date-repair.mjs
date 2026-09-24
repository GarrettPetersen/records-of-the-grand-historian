import path from 'node:path';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '116';
const candidateCommit = '838531d08913a27f1543e81fa1da477878f99e41';
const independentReviewCommit = '7fe90640a458e3bd468ec62b3a32516ceea1fe23';
const sealedCandidateHash = 'sha256:fe0e79dfc1a90882832cf946fc55f6e8be4d46d2d2e62f9153f5be1303155458';
const expectedCandidateHash = 'sha256:56a1bc197e1ed5cde61cd81bf946771cd09916fcb50c4f086392c1e9d58941d3';
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const reviewFile = `${sealedCandidateHash.slice(7)}.candidate-review.json`;
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter);
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

if (packet.sourceHash !== handoff.canonicalSourceHash || packet.extractionHash !== handoff.canonicalExtractionHash) {
  throw new Error('Canonical source or extraction changed since the pinned sealed handoff');
}
if (handoff.auditCommit !== '9afa27224245d16a4ce64a63f4df80aab44b9833' || review.auditCommit !== handoff.auditCommit) {
  throw new Error('Audit commit pin mismatch');
}
if (handoff.sealedCandidateHash !== sealedCandidateHash || review.sealedCandidateHash !== sealedCandidateHash ||
    handoff.candidateExtractionHash !== expectedCandidateHash || review.candidateExtractionHash !== expectedCandidateHash) {
  throw new Error('Pinned candidate or review identity mismatch');
}
if (sealedDateRepairProposalHash(handoff.proposal) !== sealedCandidateHash) throw new Error('Sealed proposal hash mismatch');
validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.disposition !== 'accepted-staging-only' || review.hostRequirements?.canonicalPublicationAuthorized !== false) {
  throw new Error('Review does not authorize this staging-only curation boundary');
}
const changes = handoff.proposal.changes;
const counts = Object.fromEntries(['replace', 'remove', 'add-reception-event', 'hints'].map(kind => [kind, changes.filter(change => change.kind === kind).length]));
if (changes.length !== 55 || !same(counts, { replace: 28, remove: 2, 'add-reception-event': 2, hints: 23 })) {
  throw new Error(`Expected the reviewed 55-operation six-group repair, got ${JSON.stringify(counts)}`);
}
const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (!same(candidate, handoff.candidate)) throw new Error('Exact canonical replay does not reproduce the sealed candidate');
const candidateHash = sha256(JSON.stringify(candidate));
if (candidateHash !== expectedCandidateHash) throw new Error(`Candidate extraction hash mismatch: ${candidateHash}`);
const changedTopLevel = Object.keys(canonical).filter(key => !same(canonical[key], candidate[key]));
if (!same(changedTopLevel, ['people', 'claims'])) throw new Error(`Non-date/top-level drift: ${JSON.stringify(changedTopLevel)}`);
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry diagnostics: ${JSON.stringify(geometry)}`);

writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(candidate));
const curated = readJson(extractionPath);
if (sha256(JSON.stringify(curated)) !== candidateHash || !same(curated, candidate)) throw new Error('Compact serialization altered the sealed candidate');
const receipt = {
  schemaVersion: 1, kind: 'host-date-repair-curation', book, chapter,
  candidateCommit, independentReviewCommit, candidateFile, candidateReview: reviewFile,
  sealedCandidateHash, candidateExtractionHash: candidateHash,
  canonicalSourceHash: packet.sourceHash, priorCanonicalExtractionHash: packet.extractionHash,
  curatedAt: new Date().toISOString(), operations: changes.length,
  auditGroups: 6, scope: { replacements: counts.replace, removals: counts.remove, receptionAdditions: counts['add-reception-event'], hintChanges: counts.hints },
  validation: {
    sourceCandidateReviewPins: 'PASS', sealedProposalIdentity: 'PASS', exactReplay: 'PASS', candidateHash: 'PASS',
    scopedDelta: 'PASS: 28 replacements, 2 removals, 2 reception additions, 23 hint changes; non-date/top-level drift zero.',
    compactSchema: `PASS: ${validation.stats.claims} claims.`, chronologyGeometry: 'PASS: zero diagnostics.',
  },
  publication: 'staging-only', masterMutation: 'NONE', sharedTreeMutation: 'NONE',
  nextStep: 'Fresh independent canonical date audit by a different reviewer before any master publication.',
};
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.curation.json`), receipt);
console.log(JSON.stringify({ candidateHash, operations: changes.length, counts, changedTopLevel, validation: validation.stats, geometry: geometry.length, receipt }));
