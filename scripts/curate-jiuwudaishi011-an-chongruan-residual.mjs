import path from 'node:path';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Host curation is deliberately limited to the independently reviewed residual.
const book = 'jiuwudaishi';
const chapter = '011';
const candidateCommit = '06c367fe4f3db21fd74abe9b081d54299e931984';
const reviewerCommit = '76f1afe8bd2fa44ad027e5dd20d40817716474ec';
const sealedCandidateHash = 'sha256:242cacb5f32328946d38fe9cee0f0ec2bbaa0d17175ef40fdf213ab1dbc0a7da';
const candidateExtractionHash = 'sha256:45a32db209baba5559763efc1fddfbf9dee13af54b77101e326b07d3bd838d09';
const canonicalSourceHash = 'sha256:d476e3806ff45586a556ebff16032b8d546965eb30fdff1aacf4f9d3706b9162';
const priorCanonicalExtractionHash = 'sha256:57ff699afdc17fe4cc4b3d31a3177078dd304f1393d61bbc0db402396150b544';
const repairDirectory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const reviewFile = `${sealedCandidateHash.slice(7)}.candidate-review.json`;
const acceptanceFile = `${sealedCandidateHash.slice(7)}.host-recorded-independent-acceptance.json`;
const curationFile = `${sealedCandidateHash.slice(7)}.curation.json`;
const canonicalPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const handoff = readJson(path.join(repairDirectory, candidateFile));
const review = readJson(path.join(repairDirectory, reviewFile));
const canonical = readJson(canonicalPath);
const packet = buildDateAuditPacket(book, chapter);

if (handoff.kind !== 'date-repair-candidate-handoff' || handoff.sealedCandidateHash !== sealedCandidateHash ||
  handoff.candidateExtractionHash !== candidateExtractionHash || handoff.canonicalSourceHash !== canonicalSourceHash ||
  handoff.canonicalExtractionHash !== priorCanonicalExtractionHash ||
  sealedDateRepairProposalHash(handoff.proposal) !== sealedCandidateHash ||
  sha256(JSON.stringify(handoff.candidate)) !== candidateExtractionHash) {
  throw new Error('Sealed JWD011 An Chongruan handoff identity is not exact');
}
if (review.disposition !== 'accept-for-host-curation' || review.sealedCandidateHash !== sealedCandidateHash ||
  review.candidateExtractionHash !== candidateExtractionHash || review.candidateCommit !== candidateCommit) {
  throw new Error('Independent candidate review is not the accepted sealed review');
}
if (packet.sourceHash !== canonicalSourceHash || packet.extractionHash !== priorCanonicalExtractionHash ||
  sha256(JSON.stringify(canonical)) !== priorCanonicalExtractionHash) {
  throw new Error('Canonical pins are stale; do not curate');
}
if (handoff.proposal.changes.length !== 1 || handoff.proposal.changes[0]?.id !== 'claim-156' || handoff.proposal.changes[0]?.kind !== 'replace') {
  throw new Error('Curation scope is not exactly claim-156 replacement');
}
const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (!equal(candidate, handoff.candidate) || sha256(JSON.stringify(candidate)) !== candidateExtractionHash) {
  throw new Error('Exact replay does not reproduce accepted candidate');
}
const p023 = candidate.people.find(person => person[0] === 'p023');
if (!p023 || !equal(p023[4]?.a, ['AD 938'])) throw new Error('p023 must retain exactly AD 938 hint');
const claim156 = candidate.claims[155];
if (!equal(claim156, handoff.proposal.changes[0].after) || claim156[2]?.westernYear?.year !== 938 ||
  claim156[2]?.sourceDate?.text !== '晉天福三年' || claim156[2]?.event?.includes('life-span') !== true) {
  throw new Error('claim-156 is not the exact discrete AD 938 assignment');
}
const lastEmperorReception = candidate.claims.find(claim => claim[0] !== 'p023' && claim[2]?.receptionType === 'posthumous' && claim[2]?.dateContext?.westernYear?.year === 938);
if (!lastEmperorReception) throw new Error('Last Emperor posthumous AD 938 reception was not preserved');
const zhuWen = candidate.people.find(person => person[0] === 'p002');
if (zhuWen?.[4]?.e?.[0]?.sourceResearch?.sourceIds?.join(',') !== 'jwd-001-birth,xwd-002-death') {
  throw new Error('Zhu Wen external-primary safeguard changed');
}
const compact = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
if (compact.stats.people !== 34 || compact.stats.mentions !== 177 || compact.stats.claims !== 347 || compact.stats.aliasDispositionConflicts !== 0) {
  throw new Error(`Unexpected strict validation stats: ${JSON.stringify(compact.stats)}`);
}
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry failure: ${JSON.stringify(geometry)}`);

writeJsonAtomic(path.join(repairDirectory, acceptanceFile), {
  schemaVersion: 1, kind: 'host-recorded-independent-date-repair-acceptance', book, chapter,
  candidateCommit, reviewerCommit, reviewerArtifact: reviewFile, disposition: 'accept-for-host-curation',
  sealedCandidateHash, candidateExtractionHash, canonicalSourceHash, canonicalExtractionHash: priorCanonicalExtractionHash, operations: 1,
  validation: { canonicalPins: 'PASS', sealedReplay: 'PASS', strictCompactValidation: 'PASS: 34 people, 177 mentions, 347 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.' },
  authorization: 'Independent review accepted the sealed candidate; this host receipt does not approve the required fresh canonical audit.',
});
writeTextAtomic(canonicalPath, serializeCompactPeopleExtraction(candidate));
const persisted = readJson(canonicalPath);
if (!equal(persisted, candidate) || sha256(JSON.stringify(persisted)) !== candidateExtractionHash) throw new Error('Persisted canonical extraction differs from accepted candidate');
const freshPacket = buildDateAuditPacket(book, chapter);
if (freshPacket.sourceHash !== canonicalSourceHash || freshPacket.extractionHash !== candidateExtractionHash || freshPacket.units.length !== 57 || freshPacket.people.length !== 34) {
  throw new Error('Fresh canonical audit packet is not complete pinned scope');
}
const reAuditPacketFile = `${candidateExtractionHash.slice(7)}.fresh-canonical-re-audit-packet.json`;
const freshPacketHash = sha256(JSON.stringify(freshPacket));
writeJsonAtomic(path.join(repairDirectory, reAuditPacketFile), freshPacket);
writeJsonAtomic(path.join(repairDirectory, curationFile), {
  schemaVersion: 1, kind: 'host-date-repair-curation', book, chapter, candidateCommit, candidateFile,
  reviewerCommit, acceptanceAttachment: acceptanceFile, sealedCandidateHash, candidateExtractionHash,
  canonicalSourceHash, priorCanonicalExtractionHash, operations: 1, operationKinds: { replace: 1 },
  validation: {
    canonicalPins: 'PASS', sealedProposalIdentity: 'PASS', exactReplayAndHash: 'PASS',
    anChongruanScope: 'PASS: claim-156 is exactly the discrete AD 938 s0048 burial dispatch attestation; p023 retains only AD 938.',
    receptionScope: 'PASS: the Last Emperor remains a separate AD 938 posthumous burial reception.',
    externalPrimarySafeguards: 'PASS: Zhu Wen and princess research-hold/external-primary structures are unchanged.',
    strictCompactValidation: 'PASS: 34 people, 177 mentions, 347 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.',
  },
  freshCanonicalReaudit: {
    status: 'required', packetFile: reAuditPacketFile, packetHash: freshPacketHash, sourceHash: freshPacket.sourceHash, extractionHash: freshPacket.extractionHash,
    completeScope: { sourceUnits: freshPacket.units.length, temporalClaimAndHintChecks: freshPacket.items.length, people: freshPacket.people.length },
    requiredReviewerConstraint: 'A reviewer independent of candidate author, independent candidate reviewer, and host curation must check every source unit and every date-bearing claim or hint.',
  },
  publication: 'staging-only', masterMutation: 'NONE',
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, freshPacketHash, sourceUnits: freshPacket.units.length, checks: freshPacket.items.length, people: freshPacket.people.length, operations: 1 }));
