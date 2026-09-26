import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '128';
const candidateCommit = '9938e8923262f7fcfb8759337cfb80e358bea35c';
const reviewCommit = '7a176794ec4399edc1b5c648a25d6c218d3b0bcd';
const seal = 'sha256:c23fce9d9561a7fcad223c6a11b7480e5eaf32974877a09200d94e0bce765142';
const candidateHash = 'sha256:bb4a341c3a12e4cceb96d0391d08eec353875a779f50ab092179d1b078bcf69f';
const sourceHash = 'sha256:b07fd7856801a15657e2abce2c996faacf2dbe24387fb42509b6ccbd2a5baf97';
const beforeHash = 'sha256:c44350bbf8b6c10a26bc284b872e332f39f43f81760f02dd7b921ce126f45708';
const repairDir = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${seal.slice(7, 27)}.json`;
const handoff = readJson(path.join(repairDir, candidateFile));
const receiptFile = `${seal.slice(7)}.candidate-review.json`;
const receipt = readJson(path.join(repairDir, receiptFile));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const before = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction: before });
if (packet.sourceHash !== sourceHash || packet.extractionHash !== beforeHash) throw new Error('Canonical pins differ from accepted Luo candidate');
if (handoff.sealedCandidateHash !== seal || sealedDateRepairProposalHash(handoff.proposal) !== seal) throw new Error('Sealed proposal identity mismatch');
if (handoff.candidateExtractionHash !== candidateHash || sha256(JSON.stringify(handoff.candidate)) !== candidateHash) throw new Error('Candidate hash mismatch');
validateStagedDateRepairReview(handoff, receipt, candidateFile);
if (receipt.disposition !== 'accept-for-host-curation' || handoff.proposal.changes.length !== 2) throw new Error('Independent receipt does not accept exactly two operations');
const replay = applyDateRepairProposal(before, handoff.proposal, packet);
if (JSON.stringify(replay) !== JSON.stringify(handoff.candidate)) throw new Error('Exact proposal replay mismatch');
const validation = validateCompactPeopleExtraction(replay, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(replay));
if (geometry.length) throw new Error(`Chronology geometry failed: ${JSON.stringify(geometry)}`);
writeJsonAtomic(extractionPath, replay);
if (sha256(JSON.stringify(readJson(extractionPath))) !== candidateHash) throw new Error('Canonical extraction serialization changed sealed candidate');
writeJsonAtomic(path.join(repairDir, `${seal.slice(7)}.curation.json`), {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateCommit,
  independentReviewCommit: reviewCommit,
  candidateFile,
  candidateReview: receiptFile,
  sealedCandidateHash: seal,
  candidateExtractionHash: candidateHash,
  canonicalSourceHash: sourceHash,
  priorCanonicalExtractionHash: beforeHash,
  operations: 2,
  auditGroups: 1,
  scope: { claimReplacements: 1, activeHintRevisions: 1 },
  validation: {
    sourceCandidateReviewPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    exactReplay: 'PASS: Luo Shaowei attestation endpoint and paired hint byte-match the accepted candidate.',
    candidateHash: 'PASS',
    scopedDelta: 'PASS: only the two accepted temporal fields changed.',
    compactSchema: `PASS: ${validation.stats.claims} claims.`,
    chronologyGeometry: 'PASS: zero diagnostics.'
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  sharedTreeMutation: 'NONE',
  nextStep: 'Fresh independent canonical date audit by a different reviewer before any master publication.'
});
console.log(JSON.stringify({ candidateHash, operations: handoff.proposal.changes.length, claims: validation.stats.claims, geometry: geometry.length }));
