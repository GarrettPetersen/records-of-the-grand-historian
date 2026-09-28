import path from 'node:path';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '012';
const candidateCommit = 'b6e7ceb91aa33f8d2dda62181177a508106c594b';
const reviewerCommit = '1bedfe8e793dc75515ea1a3ba65df5ae54d8a113';
const sealedCandidateHash = 'sha256:d125cac95772148f8c2844fe80816a3795ebf7dfba296521004858a7b1ce5422';
const candidateExtractionHash = 'sha256:a963c287684b181abc765abc69bce0991adf5a355e6f3310a876989c45018404';
const canonicalSourceHash = 'sha256:6c0cc1bb09cf5670d637cd5068d42f3bc556e903359ee8112d914331b30f6f7a';
const canonicalExtractionHash = 'sha256:6bb5856caa2064928b30337d125eb81d695aeb268d15b0e815b1049aa6ccaa2f';
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
  throw new Error('The sealed Jiuwudaishi 012 handoff identity is not exact');
}
if (packet.sourceHash !== canonicalSourceHash || packet.extractionHash !== canonicalExtractionHash ||
  sha256(JSON.stringify(canonical)) !== canonicalExtractionHash) {
  throw new Error('Canonical source or extraction pins are stale; do not curate');
}

const operationKinds = handoff.proposal.changes.reduce((counts, change) => {
  counts[change.kind] = (counts[change.kind] ?? 0) + 1;
  return counts;
}, {});
const expectedKinds = { replace: 7, hints: 13, remove: 5, 'add-reception-event': 5 };
if (handoff.proposal.changes.length !== 30 || !equal(operationKinds, expectedKinds)) {
  throw new Error(`Accepted repair scope changed: ${JSON.stringify(operationKinds)}`);
}

const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (!equal(candidate, handoff.candidate) || sha256(JSON.stringify(candidate)) !== candidateExtractionHash) {
  throw new Error('Exact replay does not reproduce the independently accepted candidate');
}

const receptions = candidate.claims.filter((claim) => claim[1] === 'event-participation' && claim[2]?.receptionType === 'posthumous');
if (receptions.length !== 5) throw new Error(`Expected five posthumous reception claims, got ${receptions.length}`);
const expectedReceptions = [
  ['p014', '開平初', 907, 'posthumous-princely-title-conferred'],
  ['p021', '開平初', 907, 'posthumous-princely-title-conferred'],
  ['p026', '開平初', 907, 'posthumous-princely-title-conferred'],
  ['p027', '開平初', 907, 'posthumous-princely-title-conferred'],
  ['p027', '乾化三年', 913, 'posthumous-honor-conferred'],
];
for (const [personId, sourceDate, year, action] of expectedReceptions) {
  const matches = receptions.filter((claim) => claim[0] === personId && claim[2]?.action === action &&
    claim[2]?.dateContext?.sourceDate?.text === sourceDate && claim[2]?.dateContext?.westernYear?.year === year);
  if (matches.length !== 1) throw new Error(`Missing or duplicate posthumous reception ${personId}/${sourceDate}/${action}`);
}
for (const personId of ['p014', 'p021', 'p026', 'p027']) {
  const person = candidate.people.find((entry) => entry[0] === personId);
  if (person?.[4]?.a?.includes('AD 907') || person?.[4]?.a?.includes('AD 913')) {
    throw new Error(`${personId} retains a reception date as active-life chronology`);
  }
}
const youwen = candidate.people.find((entry) => entry[0] === 'p034');
if (!equal(youwen?.[4]?.a, ['AD 907', 'AD 912'])) throw new Error('Zhu Youwen must retain AD 912 death evidence, not AD 913 restoration activity');
const youZi = candidate.people.find((entry) => entry[0] === 'p042');
if (!equal(youZi?.[4]?.a, ['on or after AD 913'])) throw new Error('You Zi must retain only the one-sided AD 913 bound');
const youZiClaim = candidate.claims.find((claim) => claim[0] === 'p042' && claim[1] === 'attestation');
if (youZiClaim?.[2]?.westernBounds?.onOrAfter?.year !== 913 || youZiClaim?.[2]?.westernInterval ||
  !youZiClaim?.[2]?.event?.includes('no terminal endpoint')) throw new Error('You Zi claim must have an AD 913 lower bound and no AD 923 endpoint');

const compactValidation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
if (compactValidation.stats.people !== 42 || compactValidation.stats.mentions !== 324 ||
  compactValidation.stats.claims !== 346 || compactValidation.stats.aliasDispositionConflicts !== 0) {
  throw new Error(`Unexpected strict compact validation statistics: ${JSON.stringify(compactValidation.stats)}`);
}
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

writeJsonAtomic(path.join(repairDirectory, acceptanceFile), {
  schemaVersion: 1,
  kind: 'host-recorded-independent-date-repair-acceptance',
  book, chapter, candidateCommit, reviewerCommit, reviewerArtifact: reviewFile,
  disposition: 'accept-for-host-curation', sealedCandidateHash, candidateExtractionHash,
  canonicalSourceHash, canonicalExtractionHash, operations: 30,
  validation: {
    canonicalPins: 'PASS', sealedReplay: 'PASS',
    strictCompactValidation: 'PASS: 42 people, 324 mentions, 346 claims, zero alias-disposition conflicts.',
    chronologyGeometry: 'PASS: zero diagnostics.'
  },
  authorization: 'Independent review accepted the sealed candidate; this host receipt does not approve the fresh canonical audit.'
});

writeTextAtomic(canonicalPath, serializeCompactPeopleExtraction(candidate));
const persisted = readJson(canonicalPath);
if (!equal(persisted, candidate) || sha256(JSON.stringify(persisted)) !== candidateExtractionHash) {
  throw new Error('Persisted canonical extraction differs from the sealed candidate');
}
const freshPacket = buildDateAuditPacket(book, chapter);
if (freshPacket.sourceHash !== canonicalSourceHash || freshPacket.extractionHash !== candidateExtractionHash ||
  freshPacket.units.length !== 119 || freshPacket.people.length !== 42) {
  throw new Error('Fresh canonical re-audit packet is not the complete pinned Jiuwudaishi 012 scope');
}
const freshPacketHash = sha256(JSON.stringify(freshPacket));
writeJsonAtomic(path.join(repairDirectory, reAuditPacketFile), freshPacket);

writeJsonAtomic(path.join(repairDirectory, curationFile), {
  schemaVersion: 1, kind: 'host-date-repair-curation', book, chapter,
  candidateCommit, candidateFile, reviewerCommit, acceptanceAttachment: acceptanceFile,
  sealedCandidateHash, candidateExtractionHash, canonicalSourceHash,
  priorCanonicalExtractionHash: canonicalExtractionHash, operations: 30, operationKinds,
  validation: {
    canonicalPins: 'PASS', sealedProposalIdentity: 'PASS', exactReplayAndHash: 'PASS',
    receptionClassification: 'PASS: five AD 907/913 posthumous grants are classified as receptions, not living attestations.',
    youwenChronology: 'PASS: AD 913 restoration is not life activity; direct AD 912 death evidence remains.',
    youZiBound: 'PASS: post-accession evidence is on or after AD 913, with no fabricated AD 923 endpoint.',
    strictCompactValidation: 'PASS: 42 people, 324 mentions, 346 claims, zero alias-disposition conflicts.',
    chronologyGeometry: 'PASS: zero diagnostics.'
  },
  freshCanonicalReaudit: {
    status: 'required', packetFile: reAuditPacketFile, packetHash: freshPacketHash,
    sourceHash: freshPacket.sourceHash, extractionHash: freshPacket.extractionHash,
    completeScope: { sourceUnits: freshPacket.units.length, temporalClaimAndHintChecks: freshPacket.items.length, people: freshPacket.people.length },
    requiredReviewerConstraint: 'A reviewer independent of the candidate author, independent reviewer, and host curation must check every source unit and every date-bearing claim or hint.'
  },
  publication: 'staging-only', masterMutation: 'NONE'
});

console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, freshPacketHash, sourceUnits: freshPacket.units.length, checks: freshPacket.items.length, people: freshPacket.people.length, operations: handoff.proposal.changes.length }));
