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
const seal = 'sha256:7261b3503d23b32217e3cfd35ab3c9e33a142d187adb40e06bf616433748a561';
const expectedCandidateHash = 'sha256:be9f5a14c21a3bfcbc0e52ed848bd60214823e593050f93243dad7ccb374ea9b';
const expectedCanonicalHash = 'sha256:881841912802cd74e5790e58ad6f0119d854f38ce01b7ec479aafba8d7f1ccc8';
const expectedSourceHash = 'sha256:696e9bc6cc32accdf42d127e06b9b96b594ae984e7144e49f4781c509b818b52';
const candidateCommit = 'd717b6732003a6d2ebd70b460ed0152b253bc77a';
const reviewCommit = 'f14190ef5af42a0224f8abdd2120f4f14819c76c';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${seal.slice(7, 27)}.json`;
const reviewFile = `${seal.slice(7)}.candidate-review.json`;
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter);
const canonicalHash = sha256(JSON.stringify(canonical));

if (packet.sourceHash !== expectedSourceHash || packet.extractionHash !== expectedCanonicalHash ||
  canonicalHash !== expectedCanonicalHash || handoff.canonicalSourceHash !== expectedSourceHash ||
  handoff.canonicalExtractionHash !== expectedCanonicalHash) {
  throw new Error('Canonical source or extraction changed since the sealed handoff');
}
if (handoff.sealedCandidateHash !== seal || sealedDateRepairProposalHash(handoff.proposal) !== seal ||
  handoff.candidateExtractionHash !== expectedCandidateHash) {
  throw new Error('Unexpected sealed proposal or candidate identity');
}
const reviewed = validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.disposition !== 'accept-for-host-curation' || !review.reviewer?.independentOfExtractor ||
  !review.reviewer?.independentOfCandidateCurator || !review.reviewer?.independentOfAuditAuthor ||
  reviewed.sealedCandidateHash !== seal || reviewed.candidateExtractionHash !== expectedCandidateHash) {
  throw new Error('Independent review did not accept this exact candidate');
}
const changes = handoff.proposal.changes;
const count = kind => changes.filter(change => change.kind === kind).length;
const expectedClaims = ['claim-98', 'claim-453', 'claim-454', 'claim-459', 'claim-460', 'claim-461', 'claim-462',
  'claim-463', 'claim-464', 'claim-465', 'claim-466', 'claim-467', 'claim-468', 'claim-469', 'claim-470',
  'claim-471', 'claim-472', 'claim-473', 'claim-475', 'claim-476', 'claim-477', 'claim-478', 'claim-479'];
if (changes.length !== 24 || count('replace') !== 23 || count('hints') !== 1 ||
  JSON.stringify(changes.filter(change => change.kind === 'replace').map(change => change.id).sort()) !== JSON.stringify([...expectedClaims].sort()) ||
  changes.find(change => change.kind === 'hints')?.personId !== 'p124') {
  throw new Error('The accepted proposal is not the exact 24-operation repair');
}

const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (JSON.stringify(candidate) !== JSON.stringify(handoff.candidate)) throw new Error('Canonical replay does not reproduce the sealed candidate');
const candidateHash = sha256(JSON.stringify(candidate));
if (candidateHash !== expectedCandidateHash) throw new Error('Candidate extraction hash mismatch');
const person = id => candidate.people.find(row => row[0] === id) ?? (() => { throw new Error(`Missing ${id}`); })();
const hasBound = (claimId, bound, year) => {
  const claim = candidate.claims[Number(claimId.slice(6)) - 1];
  const date = claim?.[2]?.dateContext ?? claim?.[2];
  return date?.westernBounds?.[bound]?.year === year && !date?.westernInterval;
};
if (!hasBound('claim-453', 'onOrBefore', 909) || !hasBound('claim-475', 'onOrBefore', 909) ||
  !person('p124')[4]?.a?.every(hint => !hint.includes('AD 909') || hint.includes('on or before AD 909'))) {
  throw new Error('Wang Chongshi or Liu Yuan did not retain the reviewed one-sided pre-rebellion bound');
}
for (const claimId of ['claim-454', 'claim-459', 'claim-460', 'claim-461', 'claim-462', 'claim-463', 'claim-464',
  'claim-465', 'claim-466', 'claim-467', 'claim-468', 'claim-476', 'claim-477', 'claim-478', 'claim-479']) {
  if (!hasBound(claimId, 'onOrAfter', 909)) throw new Error(`${claimId} did not retain the reviewed one-sided post-rebellion bound`);
}
for (const claimId of ['claim-469', 'claim-470', 'claim-471']) {
  if (!hasBound(claimId, 'onOrAfter', 918)) throw new Error(`${claimId} did not retain the reviewed Wang Yan succession lower bound`);
}
for (const claimId of ['claim-472', 'claim-473']) {
  const claim = candidate.claims[Number(claimId.slice(6)) - 1];
  const date = claim?.[2]?.dateContext ?? claim?.[2];
  if (date?.westernBounds?.onOrAfter?.year !== 920 || date?.westernBounds?.onOrBefore?.year !== 921) {
    throw new Error(`${claimId} did not retain late Zhenming AD 920–921`);
  }
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
if (validation.stats.people !== 166 || validation.stats.mentions !== 1031 || validation.stats.claims !== 1157 || validation.stats.aliasDispositionConflicts !== 0) {
  throw new Error(`Unexpected strict compact validation statistics: ${JSON.stringify(validation.stats)}`);
}
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry failed: ${JSON.stringify(geometry)}`);
const compact = serializeCompactPeopleExtraction(candidate);
if (sha256(JSON.stringify(JSON.parse(compact))) !== candidateHash) throw new Error('Compact serialization changed the curated extraction');

const acceptanceFile = `${seal.slice(7)}.host-recorded-independent-acceptance.json`;
const curationFile = `${seal.slice(7)}.curation.json`;
writeJsonAtomic(path.join(directory, acceptanceFile), {
  schemaVersion: 1, kind: 'host-recorded-independent-date-repair-acceptance', book, chapter,
  candidateCommit, reviewerCommit: reviewCommit, reviewerArtifact: reviewFile,
  disposition: 'accept-for-host-curation', sealedCandidateHash: seal, candidateExtractionHash: candidateHash,
  canonicalSourceHash: expectedSourceHash, canonicalExtractionHash: expectedCanonicalHash, operations: 24,
  validation: { canonicalPins: 'PASS', sealedReplay: 'PASS', strictCompactValidation: 'PASS: 166 people, 1031 mentions, 1157 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.' },
  authorization: 'Independent review accepted the sealed candidate; this host receipt does not approve the fresh canonical audit.'
});
writeTextAtomic(extractionPath, compact);
const persisted = readJson(extractionPath);
if (sha256(JSON.stringify(persisted)) !== candidateHash) throw new Error('Persisted canonical extraction differs from the sealed candidate');
const freshPacket = buildDateAuditPacket(book, chapter);
if (freshPacket.sourceHash !== expectedSourceHash || freshPacket.extractionHash !== candidateHash || freshPacket.units.length !== 305 || freshPacket.people.length !== 166) {
  throw new Error('Fresh canonical re-audit packet is not the complete pinned Jiuwudaishi 013 scope');
}
const reAuditPacketFile = `${candidateHash.slice(7)}.fresh-canonical-re-audit-packet.json`;
const freshPacketHash = sha256(JSON.stringify(freshPacket));
writeJsonAtomic(path.join(directory, reAuditPacketFile), freshPacket);
writeJsonAtomic(path.join(directory, curationFile), {
  schemaVersion: 1, kind: 'host-date-repair-curation', book, chapter,
  candidateCommit, candidateFile, reviewerCommit: reviewCommit, acceptanceAttachment: acceptanceFile,
  sealedCandidateHash: seal, candidateExtractionHash: candidateHash, canonicalSourceHash: expectedSourceHash,
  priorCanonicalExtractionHash: expectedCanonicalHash, operations: 24, operationKinds: { replace: 23, hints: 1 },
  validation: {
    canonicalPins: 'PASS', sealedProposalIdentity: 'PASS', acceptedReviewIdentity: 'PASS', exactReplayAndHash: 'PASS',
    chronologyDirection: 'PASS: late Guangqi AD 887–888; pre-rebellion claims are upper-only; sequence and succession claims are lower-only; late Zhenming is AD 920–921.',
    liuYuanChronology: 'PASS: omitted fabricated AD 909 point; retained the one-sided pre-rebellion Tongzhou bound.',
    strictCompactValidation: 'PASS: 166 people, 1031 mentions, 1157 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.'
  },
  freshCanonicalReaudit: { status: 'required', packetFile: reAuditPacketFile, packetHash: freshPacketHash, sourceHash: freshPacket.sourceHash, extractionHash: freshPacket.extractionHash, completeScope: { sourceUnits: freshPacket.units.length, temporalClaimAndHintChecks: freshPacket.items.length, people: freshPacket.people.length }, requiredReviewerConstraint: 'A reviewer independent of the candidate author, independent reviewer, and host curation must check every source unit and every date-bearing claim or hint.' },
  publication: 'staging-only', masterMutation: 'NONE'
});
console.log(JSON.stringify({ curationFile, acceptanceFile, reAuditPacketFile, candidateHash, freshPacketHash, validation: validation.stats, geometry: 'PASS', operations: changes.length }));
