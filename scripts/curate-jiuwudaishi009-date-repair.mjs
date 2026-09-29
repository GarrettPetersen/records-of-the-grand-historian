import path from 'node:path';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Host-side curation is deliberately fail-closed: it can write only the
// independently accepted sealed candidate and the receipts needed for a fresh
// complete audit.  It never changes the source or creates publication output.
const book = 'jiuwudaishi';
const chapter = '009';
const candidateCommit = '297ff27c2accc3be485139439569eba8959b6eec';
const reviewerCommit = '49bf1272fc34df03838904d7a5fb056a409b30bd';
const sealedCandidateHash = 'sha256:dedbada0367660f07aee79cd9de86033d77a8176bc8bf9ef05bcb0ac05f5b66f';
const candidateExtractionHash = 'sha256:0186c158ddb91a69f9871d7f30d20d6f2b20de615e4c934e61c73ac6ec578d6c';
const canonicalSourceHash = 'sha256:2f482b41c2fb2b5b44411d76d5fe84dbf04efba1947768832cd2fe161581fb07';
const canonicalExtractionHash = 'sha256:5d38e2c0ba2dd8db1219c1bbcfcf93e0f5adfd1d82a8b94fbe9d77bd464c69d4';
const repairDirectory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const reviewFile = `${sealedCandidateHash.slice(7)}.candidate-review.json`;
const acceptanceFile = `${sealedCandidateHash.slice(7)}.host-recorded-independent-acceptance.json`;
const curationFile = `${sealedCandidateHash.slice(7)}.curation.json`;
const canonicalPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const handoff = readJson(path.join(repairDirectory, candidateFile));
const canonical = readJson(canonicalPath);
const packet = buildDateAuditPacket(book, chapter);

if (handoff.kind !== 'date-repair-candidate-handoff' || handoff.book !== book || handoff.chapter !== chapter ||
  handoff.sealedCandidateHash !== sealedCandidateHash || handoff.candidateExtractionHash !== candidateExtractionHash ||
  handoff.canonicalSourceHash !== canonicalSourceHash || handoff.canonicalExtractionHash !== canonicalExtractionHash ||
  sealedDateRepairProposalHash(handoff.proposal) !== sealedCandidateHash || sha256(JSON.stringify(handoff.candidate)) !== candidateExtractionHash) {
  throw new Error('The sealed Jiuwudaishi 009 handoff identity is not exact');
}
if (packet.sourceHash !== canonicalSourceHash || packet.extractionHash !== canonicalExtractionHash ||
  sha256(JSON.stringify(canonical)) !== canonicalExtractionHash) {
  throw new Error('Canonical source or extraction pins are stale; do not curate');
}
const kinds = handoff.proposal.changes.reduce((counts, change) => {
  counts[change.kind] = (counts[change.kind] ?? 0) + 1;
  return counts;
}, {});
if (handoff.proposal.changes.length !== 14 || !equal(kinds, { replace: 11, hints: 3 })) {
  throw new Error(`Accepted repair scope changed: ${JSON.stringify(kinds)}`);
}
const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (!equal(candidate, handoff.candidate) || sha256(JSON.stringify(candidate)) !== candidateExtractionHash) {
  throw new Error('Exact replay does not reproduce the independently accepted candidate');
}
const claim = id => candidate.claims[Number(id.slice(6)) - 1];
const upperBound = (id, year) => {
  const date = claim(id)?.[2]?.dateContext ?? claim(id)?.[2];
  if (date?.westernBounds?.onOrBefore?.era !== 'AD' || date.westernBounds.onOrBefore.year !== year || date.westernInterval) {
    throw new Error(`${id} must retain only an on-or-before AD ${year} bound`);
  }
};
for (const id of ['claim-557', 'claim-558', 'claim-559']) upperBound(id, 917);
for (const id of ['claim-703', 'claim-704', 'claim-708', 'claim-709', 'claim-710', 'claim-711', 'claim-712', 'claim-714']) upperBound(id, 918);
const hintsFor = id => candidate.people.find(person => person[0] === id)?.[4]?.a;
if (!equal(hintsFor('p063'), ['on or before AD 917'])) throw new Error('p063 must retain only on-or-before AD 917');
if (!equal(hintsFor('p079'), ['on or before AD 918, drafted Qian Liu edict and demoted to Penglai']) ||
  !equal(hintsFor('p080'), ['on or before AD 918, subject of Dou Mengzheng appointment edict'])) {
  throw new Error('p079/p080 must retain only their AD 918 upper bounds');
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
if (validation.stats.units !== 159 || validation.stats.people !== 154 || validation.stats.mentions !== 421 ||
  validation.stats.claims !== 2452 || validation.stats.aliasDispositionConflicts !== 0) {
  throw new Error(`Unexpected strict compact validation statistics: ${JSON.stringify(validation.stats)}`);
}
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

writeJsonAtomic(path.join(repairDirectory, acceptanceFile), {
  schemaVersion: 1, kind: 'host-recorded-independent-date-repair-acceptance', book, chapter,
  candidateCommit, reviewerCommit, reviewerArtifact: reviewFile, disposition: 'accept-for-host-curation',
  sealedCandidateHash, candidateExtractionHash, canonicalSourceHash, canonicalExtractionHash, operations: 14,
  validation: { canonicalPins: 'PASS', sealedReplay: 'PASS', strictCompactValidation: 'PASS: 154 people, 421 mentions, 2452 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.' },
  authorization: 'Independent review accepted the sealed candidate; this host receipt does not approve the fresh canonical audit.'
});
writeTextAtomic(canonicalPath, serializeCompactPeopleExtraction(candidate));
const persisted = readJson(canonicalPath);
if (!equal(persisted, candidate) || sha256(JSON.stringify(persisted)) !== candidateExtractionHash) throw new Error('Persisted canonical extraction differs from the sealed candidate');
const freshPacket = buildDateAuditPacket(book, chapter);
if (freshPacket.sourceHash !== canonicalSourceHash || freshPacket.extractionHash !== candidateExtractionHash ||
  freshPacket.units.length !== 159 || freshPacket.people.length !== 154) throw new Error('Fresh canonical re-audit packet is not the complete pinned Jiuwudaishi 009 scope');
const freshPacketHash = sha256(JSON.stringify(freshPacket));
const reAuditPacketFile = `${candidateExtractionHash.slice(7)}.fresh-canonical-re-audit-packet.json`;
writeJsonAtomic(path.join(repairDirectory, reAuditPacketFile), freshPacket);
writeJsonAtomic(path.join(repairDirectory, curationFile), {
  schemaVersion: 1, kind: 'host-date-repair-curation', book, chapter, candidateCommit, candidateFile,
  reviewerCommit, acceptanceAttachment: acceptanceFile, sealedCandidateHash, candidateExtractionHash,
  canonicalSourceHash, priorCanonicalExtractionHash: canonicalExtractionHash, operations: 14, operationKinds: kinds,
  validation: { canonicalPins: 'PASS', sealedProposalIdentity: 'PASS', exactReplayAndHash: 'PASS',
    upperBounds: 'PASS: p063/claims 557–559 remain on or before AD 917; p079/p080 and claims 703, 704, 708–712, 714 remain on or before AD 918 with no invented lower endpoint.',
    strictCompactValidation: 'PASS: 154 people, 421 mentions, 2452 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.' },
  freshCanonicalReaudit: { status: 'required', packetFile: reAuditPacketFile, packetHash: freshPacketHash, sourceHash: freshPacket.sourceHash, extractionHash: freshPacket.extractionHash,
    completeScope: { sourceUnits: freshPacket.units.length, temporalClaimAndHintChecks: freshPacket.items.length, people: freshPacket.people.length },
    requiredReviewerConstraint: 'A reviewer independent of the candidate author, independent reviewer, and host curation must check every source unit and every date-bearing claim or hint.' },
  publication: 'staging-only', masterMutation: 'NONE'
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, freshPacketHash, sourceUnits: freshPacket.units.length, checks: freshPacket.items.length, people: freshPacket.people.length, operations: handoff.proposal.changes.length }));
