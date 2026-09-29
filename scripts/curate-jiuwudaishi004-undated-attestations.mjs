import path from 'node:path';
import { applyDateRepairProposal, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '004';
const sealedCandidateHash = 'sha256:1e2a8d23dada7eb5cb64f86c7c4ef6ec5bc5adeb99fe1242d85148af3758f071';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const reviewFile = `${sealedCandidateHash.slice(7)}.candidate-review.json`;
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter);

if (packet.sourceHash !== handoff.canonicalSourceHash || packet.extractionHash !== handoff.canonicalExtractionHash) {
  throw new Error('Canonical source or extraction changed since the sealed handoff');
}
const identities = validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.disposition !== 'accept-for-host-curation' || identities.sealedCandidateHash !== sealedCandidateHash) {
  throw new Error('Independent review did not accept the expected sealed candidate');
}
if (handoff.proposal.changes.length !== 6) throw new Error('Expected exactly six accepted repair operations');

const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (JSON.stringify(candidate) !== JSON.stringify(handoff.candidate)) throw new Error('Canonical replay does not reproduce the sealed candidate');
const candidateHash = sha256(JSON.stringify(candidate));
if (candidateHash !== handoff.candidateExtractionHash) throw new Error('Candidate extraction hash mismatch');

const person = id => candidate.people.find(row => row[0] === id) ?? (() => { throw new Error(`Missing ${id}`); })();
const claim = id => candidate.claims[Number(id.slice(6)) - 1] ?? (() => { throw new Error(`Missing ${id}`); })();
if (JSON.stringify(person('p031')[4].a) !== '[]' || claim('claim-278')[2].dateContext.westernInterval || claim('claim-279')[2].westernInterval) {
  throw new Error('Prince Xiao must not retain a retrospective BC 168–144 active range');
}
const jue = claim('claim-748')[2];
if (!jue.unresolved || typeof jue.unresolvedReason !== 'string' || !jue.unresolvedReason.includes('separate August AD 908 posthumous honor') || jue.westernInterval || jue.westernYear) {
  throw new Error('Wang Jue offices must remain an undated substantive hold independent of the AD 908 reception');
}
if (JSON.stringify(person('p076')[4].a) !== '[]' || claim('claim-768')[2].westernInterval || claim('claim-768')[2].westernYear || !claim('claim-768')[2].undatedSourceAttestation) {
  throw new Error('Wang Qiu must remain undated and have no active-date hint');
}

const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry failed: ${JSON.stringify(geometry)}`);
const serialized = serializeCompactPeopleExtraction(candidate);
if (sha256(JSON.stringify(JSON.parse(serialized))) !== candidateHash) throw new Error('Compact serialization changed the sealed candidate');

const curationFile = `${sealedCandidateHash.slice(7)}.curation.json`;
const receipt = {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateCommit: 'f6d24e8618484da23e62bb2a6cf867605d216acf',
  candidateFile,
  sealedCandidateHash,
  candidateExtractionHash: candidateHash,
  candidateReview: reviewFile,
  independentReviewCommit: '2e5b9d3231489d14fd9d27dbae1dc898bdf96161',
  canonicalSourceHash: packet.sourceHash,
  priorCanonicalExtractionHash: packet.extractionHash,
  curatedAt: new Date().toISOString(),
  operations: 6,
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    canonicalReplay: 'PASS',
    princeXiaoNoRetrospectiveRange: 'PASS',
    wangJueIndependentUndatedHold: 'PASS',
    wangQiuNoActiveHint: 'PASS',
    compactValidation: `PASS: ${validation.stats.claims} claims.`,
    chronologyGeometry: 'PASS',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh independent canonical date audit by a different reviewer.',
};

// Save durable provenance before replacing the canonical extraction, so recovery
// can prove exactly what was reviewed if a later write is interrupted.
writeJsonAtomic(path.join(directory, curationFile), receipt);
writeTextAtomic(extractionPath, serialized);
if (sha256(JSON.stringify(readJson(extractionPath))) !== candidateHash) throw new Error('Persisted canonical extraction differs from sealed candidate');
console.log(JSON.stringify({ curationFile, candidateHash, validation: validation.stats, geometry: 'PASS' }));
