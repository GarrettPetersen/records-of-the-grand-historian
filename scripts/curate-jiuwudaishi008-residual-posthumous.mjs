import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '008';
const seal = 'sha256:2277dfef06731f90be798416e825d2ee724a83ccf44c7d6d6344d0d0098168f9';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${seal.slice(7, 27)}.json`;
const reviewFile = `${seal.slice(7)}.candidate-review.json`;
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter);
const canonicalHash = sha256(JSON.stringify(canonical));

if (packet.sourceHash !== handoff.canonicalSourceHash || canonicalHash !== handoff.canonicalExtractionHash) {
  throw new Error('Canonical source or extraction changed since the sealed handoff');
}
if (review.disposition !== 'accept-for-host-curation' || !review.reviewer?.independentOfExtractor ||
    !review.reviewer?.independentOfCandidateCurator || !review.reviewer?.independentOfAuditAuthor) {
  throw new Error('Independent review did not accept this residual candidate');
}
const reviewed = validateStagedDateRepairReview(handoff, review, candidateFile);
if (handoff.sealedCandidateHash !== seal || reviewed.sealedCandidateHash !== seal ||
    sealedDateRepairProposalHash(handoff.proposal) !== seal) {
  throw new Error('Unexpected sealed candidate identity');
}
if (handoff.proposal.changes.length !== 1 || handoff.proposal.changes[0].kind !== 'remove' ||
    handoff.proposal.changes[0].id !== 'claim-167') {
  throw new Error('The accepted proposal must remove exactly claim-167');
}

const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (JSON.stringify(candidate) !== JSON.stringify(handoff.candidate)) {
  throw new Error('Canonical replay does not reproduce the sealed candidate');
}
const candidateHash = sha256(JSON.stringify(candidate));
if (candidateHash !== handoff.candidateExtractionHash) throw new Error('Candidate extraction hash mismatch');
const zhuYouwen = candidate.people.find((person) => person[0] === 'p020');
if (!zhuYouwen || !zhuYouwen[4]?.a?.some((hint) => hint.includes('AD 912'))) {
  throw new Error('Zhu Youwen AD 912 active-date evidence was not retained');
}
const ad913 = candidate.claims.filter((claim) => JSON.stringify(claim).includes('AD') && JSON.stringify(claim).includes('913') && claim[0] === 'p020');
if (ad913.length !== 1 || ad913[0][1] !== 'event-participation' ||
    ad913[0][2]?.kind !== 'posthumous-commemoration' || ad913[0][2]?.receptionType !== 'posthumous' ||
    !ad913[0][4]?.includes('s0048')) {
  throw new Error('The unique AD 913 s0048 evidence must remain a posthumous reception event');
}
if (candidate.claims.some((claim) => claim[0] === 'p020' && claim[1] === 'noble-title' && JSON.stringify(claim).includes('913'))) {
  throw new Error('An AD 913 Zhu Youwen noble-title life-like claim remains');
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry failed: ${JSON.stringify(geometry)}`);
const compact = serializeCompactPeopleExtraction(candidate);
if (sha256(JSON.stringify(JSON.parse(compact))) !== candidateHash) throw new Error('Compact serialization changed the curated extraction');

const curationFile = `${seal.slice(7)}.curation.json`;
const receipt = {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateCommit: '1714e36e5c7af232ca26c7763a54d1dc75ae9cc6',
  candidateFile,
  sealedCandidateHash: seal,
  candidateExtractionHash: candidateHash,
  candidateReview: reviewFile,
  independentReviewCommit: 'f777c4db3a1804a00944bb0b28503f07e0932905',
  canonicalSourceHash: packet.sourceHash,
  priorCanonicalExtractionHash: canonicalHash,
  curatedAt: new Date().toISOString(),
  operations: 1,
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    canonicalReplay: 'PASS',
    zhuYouwenReceptionSeparation: 'PASS: claim-167 removed; AD 912 life hint and sole AD 913 s0048 posthumous-commemoration event retained.',
    compactValidation: `PASS: ${validation.stats.claims} claims; strict alias dispositions.`,
    chronologyGeometry: 'PASS',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh complete independent canonical date audit by a different reviewer.',
};

// Persist the receipt before replacement so an interrupted write remains recoverable.
writeJsonAtomic(path.join(directory, curationFile), receipt);
writeTextAtomic(extractionPath, compact);
if (sha256(JSON.stringify(readJson(extractionPath))) !== candidateHash) {
  throw new Error('Persisted canonical extraction differs from the sealed candidate');
}
console.log(JSON.stringify({ curationFile, candidateHash, validation: validation.stats, geometry: 'PASS' }));
