import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '111';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = 'staged-candidate-df7007c8e79ae8b4072e.json';
const reviewFile = 'df7007c8e79ae8b4072ee61639859fcfa4daac8afe931bcb79b1d64b4ab29e27.independent-review.json';
const seal = 'sha256:df7007c8e79ae8b4072ee61639859fcfa4daac8afe931bcb79b1d64b4ab29e27';
const candidateHash = 'sha256:a07381684a4020323c166ffac94d801b39c0564b5867d9ee7ebf05c7136c4e4c';
const canonicalHash = 'sha256:377514257817d0a13a39482bc5fec83318ceaacba3f628442596e124eb245b59';
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const extractionFile = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const current = readJson(extractionFile);
const packet = buildDateAuditPacket(book, chapter);
const currentHash = sha256(JSON.stringify(current));

if (handoff.kind !== 'date-repair-candidate-handoff' || handoff.book !== book || handoff.chapter !== chapter ||
    handoff.sealedCandidateHash !== seal || handoff.candidateExtractionHash !== candidateHash ||
    review.status !== 'accepted' || review.accepted !== true || !review.reviewer?.independentOfExtractor ||
    !review.reviewer?.independentOfCandidateCurator || review.candidate?.sealedCandidateHash !== seal ||
    review.candidate?.candidateExtractionHash !== candidateHash) {
  throw new Error('Jiuwudaishi 111 candidate or independent acceptance receipt is not the sealed accepted handoff');
}
if (handoff.proposal?.changes?.length !== 32 || handoff.proposal?.changes?.filter(change => change.kind === 'reclassify-reception-kind').length !== 14 ||
    handoff.proposal?.changes?.filter(change => change.kind === 'hints').length !== 16 ||
    handoff.proposal?.changes?.filter(change => change.kind === 'remove' && change.id === 'claim-1216').length !== 1 ||
    handoff.proposal?.changes?.filter(change => change.kind === 'reclassify-reception-claim' && change.id === 'claim-1219').length !== 1) {
  throw new Error('Jiuwudaishi 111 handoff does not contain exactly the accepted 32 operations');
}
if (packet.sourceHash !== handoff.canonicalSourceHash || packet.sourceHash !== review.canonicalInputs?.canonicalSourceHash ||
    handoff.canonicalExtractionHash !== canonicalHash || currentHash !== canonicalHash ||
    sha256(JSON.stringify(handoff.candidate)) !== candidateHash) {
  throw new Error('Jiuwudaishi 111 canonical source or extraction pin is stale; do not curate');
}
const validation = validateCompactPeopleExtraction(handoff.candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(handoff.candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);
const compact = serializeCompactPeopleExtraction(handoff.candidate);
if (sha256(JSON.stringify(JSON.parse(compact))) !== candidateHash) throw new Error('Compact serialization changes the accepted candidate');

const curationFile = `${seal.slice(7)}.curation.json`;
writeJsonAtomic(path.join(directory, curationFile), {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateFile,
  candidateReview: reviewFile,
  sealedCandidateHash: seal,
  candidateExtractionHash: candidateHash,
  canonicalSourceHash: packet.sourceHash,
  priorCanonicalExtractionHash: canonicalHash,
  operations: 32,
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    exactCandidateReplay: 'PASS',
    compactValidation: `PASS: ${validation.stats.claims} claims.`,
    nonDateValidation: 'PASS',
    chronologyGeometry: 'PASS',
    scopedValidator: 'PASS',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  sharedQueueMutation: 'NONE',
  nextStep: 'Fresh independent canonical date audit by a different reviewer.',
});
writeTextAtomic(extractionFile, compact);
const persisted = readJson(extractionFile);
if (sha256(JSON.stringify(persisted)) !== candidateHash) throw new Error('Persisted canonical extraction differs from the sealed candidate');
console.log(JSON.stringify({ curationFile, sealedCandidateHash: seal, candidateExtractionHash: candidateHash, claims: validation.stats.claims }));
