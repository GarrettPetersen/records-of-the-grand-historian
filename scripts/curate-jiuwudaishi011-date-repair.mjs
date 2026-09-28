import path from 'node:path';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '011';
const candidateCommit = '550d4c1de3ecea4c7c3f406a8ccd0f99203d3b15';
const reviewerCommit = '5e4d2c8be33e43b4208919b5fd7570d55ae1a0e2';
const sealedCandidateHash = 'sha256:a8a7d159da43c0d805516c7053824e35785fc7733a168df7a47b951384490bad';
const candidateExtractionHash = 'sha256:57ff699afdc17fe4cc4b3d31a3177078dd304f1393d61bbc0db402396150b544';
const canonicalSourceHash = 'sha256:d476e3806ff45586a556ebff16032b8d546965eb30fdff1aacf4f9d3706b9162';
const canonicalExtractionHash = 'sha256:49c34802ba2dc99c1667760c0fe3e57e3bbb781d399a737005f852d810b7786c';
const repairDirectory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const reviewFile = `${sealedCandidateHash.slice(7)}.candidate-review.json`;
const acceptanceFile = `${sealedCandidateHash.slice(7)}.host-recorded-independent-acceptance.json`;
const curationFile = `${sealedCandidateHash.slice(7)}.curation.json`;
const reAuditPacketFile = `${candidateExtractionHash.slice(7)}.fresh-canonical-re-audit-packet.json`;
const canonicalPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const handoff = readJson(path.join(repairDirectory, candidateFile));
const canonical = readJson(canonicalPath);
const packet = buildDateAuditPacket(book, chapter);
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);

if (handoff.kind !== 'date-repair-candidate-handoff' || handoff.book !== book || handoff.chapter !== chapter ||
  handoff.sealedCandidateHash !== sealedCandidateHash || handoff.candidateExtractionHash !== candidateExtractionHash ||
  handoff.canonicalSourceHash !== canonicalSourceHash || handoff.canonicalExtractionHash !== canonicalExtractionHash ||
  sealedDateRepairProposalHash(handoff.proposal) !== sealedCandidateHash ||
  sha256(JSON.stringify(handoff.candidate)) !== candidateExtractionHash) {
  throw new Error('The sealed Jiuwudaishi 011 external-primary handoff identity is not exact');
}
if (packet.sourceHash !== canonicalSourceHash || packet.extractionHash !== canonicalExtractionHash ||
  sha256(JSON.stringify(canonical)) !== canonicalExtractionHash) {
  throw new Error('Canonical source or extraction pins are stale; do not curate');
}

const operationKinds = handoff.proposal.changes.reduce((counts, change) => {
  counts[change.kind] = (counts[change.kind] ?? 0) + 1;
  return counts;
}, {});
const expectedKinds = { remove: 4, hints: 3, 'external-primary-chronology': 1 };
if (handoff.proposal.changes.length !== 8 || !equal(operationKinds, expectedKinds)) {
  throw new Error(`Accepted repair scope changed: ${JSON.stringify(operationKinds)}`);
}

const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (!equal(candidate, handoff.candidate) || sha256(JSON.stringify(candidate)) !== candidateExtractionHash) {
  throw new Error('Exact replay does not reproduce the independently accepted candidate');
}
const person = id => candidate.people.find(entry => entry[0] === id);
const zhuWen = person('p002');
const expectedZhuHint = 'AD 852-912 (external primary birth and death witnesses; no chapter reception date treated as life activity)';
if (!equal(zhuWen?.[4]?.a, [expectedZhuHint])) throw new Error('Zhu Wen must retain only the bounded AD 852-912 external-primary hint');
const evidence = zhuWen?.[4]?.e;
if (!Array.isArray(evidence) || evidence.length !== 1 || evidence[0]?.kind !== 'bounded-life' ||
  !equal(evidence[0].bounds, { start: { era: 'AD', year: 852, precision: 'year' }, end: { era: 'AD', year: 912, precision: 'year' } }) ||
  !equal(evidence[0].sourceResearch?.sourceIds, ['jwd-001-birth', 'xwd-002-death']) ||
  !equal(evidence[0].witnesses?.map(witness => [witness.sourceType, witness.sourceId, witness.kind, witness.westernYear?.year]), [
    ['external-primary', 'jwd-001-birth', 'birth', 852],
    ['external-primary', 'xwd-002-death', 'death', 912],
  ])) {
  throw new Error('Zhu Wen external-primary evidence is not the exact approved bounded-life binding');
}
for (const [personId, hint] of [['p026', 'AD 907 (enfeoffment only; no life-wide interval inferred)'], ['p028', 'AD 907 (enfeoffment only; no life-wide interval inferred)']]) {
  if (!equal(person(personId)?.[4]?.a, [hint]) || person(personId)?.[4]?.a?.some(value => value.includes('921'))) {
    throw new Error(`${personId} must remain AD 907 ceremony-only, without an AD 921 interval`);
  }
}
const compactValidation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
if (compactValidation.stats.people !== 34 || compactValidation.stats.mentions !== 177 ||
  compactValidation.stats.claims !== 347 || compactValidation.stats.aliasDispositionConflicts !== 0) {
  throw new Error(`Unexpected strict compact validation statistics: ${JSON.stringify(compactValidation.stats)}`);
}
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

writeJsonAtomic(path.join(repairDirectory, acceptanceFile), {
  schemaVersion: 1, kind: 'host-recorded-independent-date-repair-acceptance', book, chapter,
  candidateCommit, reviewerCommit, reviewerArtifact: reviewFile, disposition: 'accept-for-host-curation',
  sealedCandidateHash, candidateExtractionHash, canonicalSourceHash, canonicalExtractionHash, operations: 8,
  validation: { canonicalPins: 'PASS', sealedReplay: 'PASS', strictCompactValidation: 'PASS: 34 people, 177 mentions, 347 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.' },
  authorization: 'Independent review accepted the sealed candidate; this host receipt does not approve the fresh canonical audit.',
});

writeTextAtomic(canonicalPath, serializeCompactPeopleExtraction(candidate));
const persisted = readJson(canonicalPath);
if (!equal(persisted, candidate) || sha256(JSON.stringify(persisted)) !== candidateExtractionHash) {
  throw new Error('Persisted canonical extraction differs from the sealed candidate');
}
const freshPacket = buildDateAuditPacket(book, chapter);
if (freshPacket.sourceHash !== canonicalSourceHash || freshPacket.extractionHash !== candidateExtractionHash || freshPacket.units.length !== 57 || freshPacket.people.length !== 34) {
  throw new Error('Fresh canonical re-audit packet is not the complete pinned Jiuwudaishi 011 scope');
}
const freshPacketHash = sha256(JSON.stringify(freshPacket));
writeJsonAtomic(path.join(repairDirectory, reAuditPacketFile), freshPacket);
writeJsonAtomic(path.join(repairDirectory, curationFile), {
  schemaVersion: 1, kind: 'host-date-repair-curation', book, chapter, candidateCommit, candidateFile,
  reviewerCommit, acceptanceAttachment: acceptanceFile, sealedCandidateHash, candidateExtractionHash,
  canonicalSourceHash, priorCanonicalExtractionHash: canonicalExtractionHash, operations: 8, operationKinds,
  validation: {
    canonicalPins: 'PASS', sealedProposalIdentity: 'PASS', exactReplayAndHash: 'PASS',
    externalPrimaryBinding: 'PASS: Zhu Wen is AD 852-912 only through the exact hash-pinned birth/death witnesses.',
    ceremonyScope: 'PASS: Princess Changle and Princess Puning are AD 907 ceremony-only, without an AD 921 interval or reception-to-life conversion.',
    strictCompactValidation: 'PASS: 34 people, 177 mentions, 347 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.',
  },
  freshCanonicalReaudit: {
    status: 'required', packetFile: reAuditPacketFile, packetHash: freshPacketHash, sourceHash: freshPacket.sourceHash, extractionHash: freshPacket.extractionHash,
    completeScope: { sourceUnits: freshPacket.units.length, temporalClaimAndHintChecks: freshPacket.items.length, people: freshPacket.people.length },
    requiredReviewerConstraint: 'A reviewer independent of the candidate author, independent reviewer, and host curation must check every source unit and every date-bearing claim or hint.',
  },
  publication: 'staging-only', masterMutation: 'NONE',
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, freshPacketHash, sourceUnits: freshPacket.units.length, checks: freshPacket.items.length, people: freshPacket.people.length, operations: handoff.proposal.changes.length }));
