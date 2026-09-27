import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '130';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = 'staged-candidate-7ea4e123684196eb34d4.json';
const reviewFile = '7ea4e123684196eb34d47e5ca2ebf0696fffe8573475952291202b99cfa05ad4.candidate-review.json';
const expectedSeal = 'sha256:7ea4e123684196eb34d47e5ca2ebf0696fffe8573475952291202b99cfa05ad4';
const expectedCanonicalHash = 'sha256:fafe39d26cbeec1095505e0a47d09e199b3bd55e1060288a68250999019d8c50';
const expectedCandidateHash = 'sha256:35fcb811176c54d508d2ebcd33e45653e41db24bd0c11394a1d9803a4244e80a';
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const extractionFile = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const current = readJson(extractionFile);
const packet = buildDateAuditPacket(book, chapter);
const currentHash = sha256(JSON.stringify(current));

if (handoff.book !== book || handoff.chapter !== chapter || review.disposition !== 'accept-for-host-curation' ||
    !review.reviewer?.independentOfExtractor || !review.reviewer?.independentOfCandidateCurator) {
  throw new Error('Handoff or review is not an accepted independent Jiuwudaishi 130 candidate');
}
const identities = validateStagedDateRepairReview(handoff, review, candidateFile);
if (handoff.sealedCandidateHash !== expectedSeal || identities.sealedCandidateHash !== expectedSeal ||
    sealedDateRepairProposalHash(handoff.proposal) !== expectedSeal ||
    handoff.canonicalExtractionHash !== expectedCanonicalHash || handoff.candidateExtractionHash !== expectedCandidateHash) {
  throw new Error('The accepted proposal identity or pinned extraction hashes differ from the six-operation handoff');
}
if (packet.sourceHash !== handoff.canonicalSourceHash || currentHash !== expectedCanonicalHash ||
    packet.extractionHash !== expectedCanonicalHash) {
  throw new Error('Canonical source or extraction pins are stale; do not curate');
}
const changeIds = handoff.proposal.changes.map(change => change.kind === 'hints' ? `hints-${change.personId}` : change.id);
const expectedChanges = ['claim-74', 'claim-75', 'claim-76', 'claim-77', 'hints-p019', 'hints-p021'];
if (handoff.proposal.changes.length !== 6 || JSON.stringify(changeIds) !== JSON.stringify(expectedChanges)) {
  throw new Error('The accepted proposal must contain exactly the six pinned Guangshun 2 operations');
}
const replay = applyDateRepairProposal(current, handoff.proposal, packet);
if (JSON.stringify(replay) !== JSON.stringify(handoff.candidate) || sha256(JSON.stringify(replay)) !== expectedCandidateHash) {
  throw new Error('Accepted candidate does not replay byte-for-byte from canonical extraction');
}
const validation = validateCompactPeopleExtraction(replay, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(replay));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);
const compact = serializeCompactPeopleExtraction(replay);
if (sha256(JSON.stringify(JSON.parse(compact))) !== expectedCandidateHash) throw new Error('Compact serialization changes the reviewed candidate');

const curationFile = `${expectedSeal.slice(7)}.curation.json`;
const receipt = {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateFile,
  sealedCandidateHash: expectedSeal,
  candidateExtractionHash: expectedCandidateHash,
  candidateReview: reviewFile,
  canonicalSourceHash: packet.sourceHash,
  priorCanonicalExtractionHash: currentHash,
  curatedAt: new Date().toISOString(),
  operations: 6,
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    canonicalReplay: 'PASS',
    exactOperationSet: 'PASS: claim-74 through claim-77 and hints-p019, hints-p021 only.',
    compactValidation: `PASS: ${validation.stats.claims} claims; ${validation.stats.aliasDispositionConflicts} alias-disposition conflicts.`,
    chronologyGeometry: 'PASS',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh complete independent canonical date audit by a different reviewer.',
};

writeJsonAtomic(path.join(directory, curationFile), receipt);
writeTextAtomic(extractionFile, compact);
const persisted = readJson(extractionFile);
if (sha256(JSON.stringify(persisted)) !== expectedCandidateHash) throw new Error('Persisted canonical extraction differs from the sealed candidate');
console.log(JSON.stringify({ curationFile, sealedCandidateHash: expectedSeal, candidateExtractionHash: expectedCandidateHash, operations: 6, claims: validation.stats.claims }));
