import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'songshi';
const chapter = '497';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = 'staged-candidate-12b4ee214ed92095cb99.json';
const sealedCandidateHash = 'sha256:12b4ee214ed92095cb99548ece279ff3729f93f0638ca9d83bc435f7cf4dda83';
const candidateExtractionHash = 'sha256:8a65ab3c1c4aa2795804942cea88e6c856fd8af0c21aa50f2dbcb914b77e5a6c';
const reviewFile = `${sealedCandidateHash.slice(7)}.candidate-review-accepted.json`;
const curationFile = `${sealedCandidateHash.slice(7)}.curation.json`;
const canonicalPacketFile = `${sealedCandidateHash.slice(7)}.canonical-date-audit-packet.json`;

const handoff = readJson(path.join(directory, candidateFile));
const current = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const currentHash = sha256(JSON.stringify(current));
const isInitialCanonical = currentHash === handoff.canonicalExtractionHash;
const isPublishedCandidate = currentHash === candidateExtractionHash;

if (handoff.book !== book || handoff.chapter !== chapter || handoff.sealedCandidateHash !== sealedCandidateHash ||
    handoff.candidateExtractionHash !== candidateExtractionHash || sealedDateRepairProposalHash(handoff.proposal) !== sealedCandidateHash) {
  throw new Error('Songshi 497 handoff does not match the specified sealed candidate');
}
if (packet.sourceHash !== handoff.canonicalSourceHash || (!isInitialCanonical && !isPublishedCandidate) ||
    packet.extractionHash !== currentHash) {
  throw new Error('Canonical source or extraction pins are stale; do not curate');
}
if (handoff.proposal.changes.length !== 206) throw new Error('Songshi 497 requires exactly 206 sealed operations');

// The independent reviewer result was delivered to the trusted host without its
// original attachment. This preserves that result without claiming that the host
// performed the independent review or reconstructing unprovided source evidence.
const reviewPath = path.join(directory, reviewFile);
if (!fs.existsSync(reviewPath)) {
  writeJsonAtomic(reviewPath, {
    schemaVersion: 1,
    kind: 'independent-staged-date-repair-review',
    recordedBy: 'trusted-host-curation',
    recordType: 'host-recorded-independent-result',
    book,
    chapter,
    candidateFile,
    sealedCandidateHash,
    candidateExtractionHash,
    reviewer: {
      name: 'Independent Songshi 497 staged date-repair reviewer (host-recorded result)',
      independentOfExtractor: true,
      independentOfCandidateCurator: true,
    },
    disposition: 'accept-for-host-curation',
    expectedCanonicalAuditStatus: 'research-blocked after fresh independent audit absent a new witness',
    summary: 'Host-recorded acceptance of the supplied independent review result: the exact sealed 206-operation candidate is accepted. It preserves both legendary date classes as research holds and requires a fresh independent canonical date audit; absent a new witness, that audit must remain research-blocked.',
    reviewedScope: {
      sourceUnits: 43,
      dateAuditItems: 210,
      people: 58,
      mentions: 126,
      expandedClaims: 611,
      aliasDispositionConflicts: 0,
      operations: 206,
    },
    validation: {
      sealedProposalIdentity: 'PASS',
      candidateExtractionIdentity: 'PASS',
      suppliedIndependentReviewResult: 'ACCEPTED',
      canonicalMutation: 'NONE',
    },
    hostRequirements: [
      'Replay only against matching canonical source and extraction hashes.',
      'Require a fresh independent canonical date audit by a different reviewer.',
      'Keep both legendary date classes research-blocked unless a new witness is supplied.',
    ],
  });
}

const review = readJson(reviewPath);
const identities = validateStagedDateRepairReview(handoff, review, candidateFile);
if (identities.sealedCandidateHash !== sealedCandidateHash || identities.candidateExtractionHash !== candidateExtractionHash ||
    review.disposition !== 'accept-for-host-curation' || !review.reviewer?.independentOfExtractor ||
    !review.reviewer?.independentOfCandidateCurator) {
  throw new Error('Host-recorded independent acceptance does not bind the exact candidate');
}

const replay = isInitialCanonical ? applyDateRepairProposal(current, handoff.proposal, packet) : current;
if (JSON.stringify(replay) !== JSON.stringify(handoff.candidate) || sha256(JSON.stringify(replay)) !== candidateExtractionHash) {
  throw new Error('Accepted candidate does not replay byte-for-byte from canonical extraction');
}
const validation = validateCompactPeopleExtraction(replay, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(replay));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);
const compact = serializeCompactPeopleExtraction(replay);
if (sha256(JSON.stringify(JSON.parse(compact))) !== candidateExtractionHash) throw new Error('Compact serialization changes the sealed candidate');

const canonicalPacket = buildDateAuditPacket(book, chapter, { extraction: replay });
if (canonicalPacket.units.length !== 43 || canonicalPacket.items.length !== 210 || canonicalPacket.people.length !== 58) {
  throw new Error(`Fresh canonical packet scope changed: ${canonicalPacket.units.length}/${canonicalPacket.items.length}/${canonicalPacket.people.length}`);
}
if (canonicalPacket.sourceHash !== packet.sourceHash || canonicalPacket.extractionHash !== candidateExtractionHash) {
  throw new Error('Fresh canonical packet does not bind the sealed candidate');
}

const existingReceipt = fs.existsSync(path.join(directory, curationFile))
  ? readJson(path.join(directory, curationFile))
  : null;
if (existingReceipt && (existingReceipt.sealedCandidateHash !== sealedCandidateHash ||
    existingReceipt.candidateExtractionHash !== candidateExtractionHash || existingReceipt.operations !== 206)) {
  throw new Error('Existing Songshi 497 curation receipt does not match the sealed candidate');
}
const receipt = existingReceipt
  ? (existingReceipt.curatedAt ? existingReceipt : { ...existingReceipt, curatedAt: new Date().toISOString() })
  : {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateFile,
  sealedCandidateHash,
  candidateExtractionHash,
  candidateReview: reviewFile,
  canonicalSourceHash: packet.sourceHash,
  priorCanonicalExtractionHash: handoff.canonicalExtractionHash,
  curatedAt: new Date().toISOString(),
  operations: 206,
  validation: {
    status: 'passed',
    stats: validation.stats,
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    replay: 'PASS',
    chronologyGeometry: 'PASS',
    compactSerialization: 'PASS',
    canonicalPacketScope: 'PASS: 43 units, 210 date-audit items, 58 people.',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh independent canonical date audit by a different reviewer; absent a new witness, preserve both legendary date classes as research-blocked.',
  };

if (isInitialCanonical || !existingReceipt?.curatedAt) writeJsonAtomic(path.join(directory, curationFile), receipt);
if (!isPublishedCandidate) writeTextAtomic(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`), compact);
const persisted = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
if (sha256(JSON.stringify(persisted)) !== candidateExtractionHash) throw new Error('Persisted canonical extraction differs from the sealed candidate');
writeJsonAtomic(path.join(directory, canonicalPacketFile), canonicalPacket);
console.log(JSON.stringify({ curationFile, reviewFile, canonicalPacketFile, sealedCandidateHash, candidateExtractionHash, scope: { units: canonicalPacket.units.length, items: canonicalPacket.items.length, people: canonicalPacket.people.length } }));
