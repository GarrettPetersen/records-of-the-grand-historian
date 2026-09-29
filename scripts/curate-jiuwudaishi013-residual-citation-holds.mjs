import path from 'node:path';
import {
  applyDateRepairProposal,
  sealedDateRepairProposalHash,
  validateStagedDateRepairReview,
} from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '013';
const seal = 'sha256:5ae11fd6bb0cc07689f83ea321dd1f95ddd0a3574df7c3a2309d4534793cb831';
const expectedSourceHash = 'sha256:696e9bc6cc32accdf42d127e06b9b96b594ae984e7144e49f4781c509b818b52';
const expectedCanonicalHash = 'sha256:be9f5a14c21a3bfcbc0e52ed848bd60214823e593050f93243dad7ccb374ea9b';
const expectedCandidateHash = 'sha256:29ee39b60b9b9f1ec48ae40439518047c9bb6a60fe27f245f43156a55af925ce';
const candidateCommit = 'cc60d26818ec73d167c235b530288e4eda36b11d';
const reviewCommit = 'b877762c560b8ab34aa4e2667c4e43f6f29d6fc8';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${seal.slice(7, 27)}.json`;
const reviewFile = `${seal.slice(7)}.candidate-review.json`;
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter);

if (packet.sourceHash !== expectedSourceHash || packet.extractionHash !== expectedCanonicalHash ||
  sha256(JSON.stringify(canonical)) !== expectedCanonicalHash || handoff.canonicalSourceHash !== expectedSourceHash ||
  handoff.canonicalExtractionHash !== expectedCanonicalHash) {
  throw new Error('Canonical source or extraction changed since the sealed citation-hold handoff');
}
if (handoff.sealedCandidateHash !== seal || sealedDateRepairProposalHash(handoff.proposal) !== seal ||
  handoff.candidateExtractionHash !== expectedCandidateHash) {
  throw new Error('Unexpected sealed citation-hold proposal or candidate identity');
}
const reviewed = validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.disposition !== 'accept-for-host-curation' || !review.reviewer?.independentOfExtractor ||
  !review.reviewer?.independentOfCandidateCurator || !review.reviewer?.independentOfAuditAuthor ||
  reviewed.sealedCandidateHash !== seal || reviewed.candidateExtractionHash !== expectedCandidateHash) {
  throw new Error('Independent review did not accept this exact citation-hold candidate');
}
const changes = handoff.proposal.changes;
const count = kind => changes.filter(change => change.kind === kind).length;
if (changes.length !== 6 || count('remove') !== 2 || count('add-reception-event') !== 2 || count('hints') !== 2 ||
  JSON.stringify(changes.filter(change => change.kind === 'remove').map(change => change.id).sort()) !== JSON.stringify(['claim-231', 'claim-233']) ||
  JSON.stringify(changes.filter(change => change.kind === 'hints').map(change => change.personId).sort()) !== JSON.stringify(['p042', 'p044'])) {
  throw new Error('The accepted proposal is not the exact six-operation citation-hold repair');
}
const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (JSON.stringify(candidate) !== JSON.stringify(handoff.candidate) || sha256(JSON.stringify(candidate)) !== expectedCandidateHash) {
  throw new Error('Exact replay does not reproduce the independently accepted citation-hold candidate');
}
for (const [personId, unit] of [['p042', 's0061'], ['p044', 's0079']]) {
  const person = candidate.people.find(row => row[0] === personId);
  const receptions = candidate.claims.filter(claim => claim[0] === personId && claim[1] === 'event-participation' &&
    claim[2]?.kind === 'bibliographic-citation' && claim[2]?.role === 'cited-authority' &&
    claim[2]?.receptionType === 'retrospective' && claim[4]?.includes(unit));
  if (!person || JSON.stringify(person[4]?.a ?? []) !== '[]' || receptions.length !== 1 ||
    candidate.claims.some(claim => claim[0] === personId && claim[1] === 'attestation' && claim[2]?.unresolved)) {
    throw new Error(`${personId} did not retain exactly one undated retrospective citation without temporal leakage`);
  }
  if (JSON.stringify(receptions[0]).match(/western|AD |BC /)) throw new Error(`${personId} bibliographic citation contains temporal leakage`);
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
if (validation.stats.people !== 166 || validation.stats.mentions !== 1031 || validation.stats.claims !== 1157 || validation.stats.aliasDispositionConflicts !== 0) {
  throw new Error(`Unexpected strict compact validation statistics: ${JSON.stringify(validation.stats)}`);
}
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry failed: ${JSON.stringify(geometry)}`);
const compact = serializeCompactPeopleExtraction(candidate);
if (sha256(JSON.stringify(JSON.parse(compact))) !== expectedCandidateHash) throw new Error('Compact serialization changed the curated extraction');

const acceptanceFile = `${seal.slice(7)}.host-recorded-independent-acceptance.json`;
const curationFile = `${seal.slice(7)}.curation.json`;
writeJsonAtomic(path.join(directory, acceptanceFile), {
  schemaVersion: 1, kind: 'host-recorded-independent-date-repair-acceptance', book, chapter,
  candidateCommit, reviewerCommit: reviewCommit, reviewerArtifact: reviewFile,
  disposition: 'accept-for-host-curation', sealedCandidateHash: seal, candidateExtractionHash: expectedCandidateHash,
  canonicalSourceHash: expectedSourceHash, canonicalExtractionHash: expectedCanonicalHash, operations: 6,
  validation: { canonicalPins: 'PASS', sealedReplay: 'PASS', strictCompactValidation: 'PASS: 166 people, 1031 mentions, 1157 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.' },
  authorization: 'Independent review accepted the sealed candidate; this host receipt does not approve or replace a fresh canonical audit.'
});
writeTextAtomic(extractionPath, compact);
const persisted = readJson(extractionPath);
if (sha256(JSON.stringify(persisted)) !== expectedCandidateHash) throw new Error('Persisted canonical extraction differs from the sealed candidate');
const freshPacket = buildDateAuditPacket(book, chapter);
if (freshPacket.sourceHash !== expectedSourceHash || freshPacket.extractionHash !== expectedCandidateHash || freshPacket.units.length !== 305 || freshPacket.people.length !== 166) {
  throw new Error('Fresh canonical re-audit packet is not the complete pinned Jiuwudaishi 013 scope');
}
const freshPacketHash = sha256(JSON.stringify(freshPacket));
const reAuditPacketFile = `${expectedCandidateHash.slice(7)}.fresh-canonical-re-audit-packet.json`;
writeJsonAtomic(path.join(directory, reAuditPacketFile), freshPacket);
writeJsonAtomic(path.join(directory, curationFile), {
  schemaVersion: 1, kind: 'host-date-repair-curation', book, chapter,
  candidateCommit, candidateFile, reviewerCommit: reviewCommit, acceptanceAttachment: acceptanceFile,
  sealedCandidateHash: seal, candidateExtractionHash: expectedCandidateHash, canonicalSourceHash: expectedSourceHash,
  priorCanonicalExtractionHash: expectedCanonicalHash, operations: 6, operationKinds: { remove: 2, 'add-reception-event': 2, hints: 2 },
  validation: {
    canonicalPins: 'PASS', sealedProposalIdentity: 'PASS', acceptedReviewIdentity: 'PASS', exactReplayAndHash: 'PASS',
    bibliographicCitationClassification: 'PASS: Chen Pengnian and Ma Ling retain only undated retrospective bibliographic-citation events; neither receives inferred life chronology.',
    strictCompactValidation: 'PASS: 166 people, 1031 mentions, 1157 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.'
  },
  priorAuditDisposition: 'research-blocked',
  auditStatusMutation: 'NONE: a host curator cannot self-approve or rewrite the independent audit; the prior report is stale after canonical mutation and a fresh audit is required.',
  freshCanonicalReaudit: { status: 'required', packetFile: reAuditPacketFile, packetHash: freshPacketHash, sourceHash: freshPacket.sourceHash, extractionHash: freshPacket.extractionHash, completeScope: { sourceUnits: freshPacket.units.length, temporalClaimAndHintChecks: freshPacket.items.length, people: freshPacket.people.length }, requiredReviewerConstraint: 'A reviewer independent of the original audit author, both candidate authors, both independent reviewers, and this host curation must check every source unit and every date-bearing claim or hint.' },
  publication: 'staging-only', masterMutation: 'NONE'
});
console.log(JSON.stringify({ curationFile, acceptanceFile, reAuditPacketFile, candidateHash: expectedCandidateHash, freshPacketHash, validation: validation.stats, geometry: 'PASS', operations: changes.length }));
