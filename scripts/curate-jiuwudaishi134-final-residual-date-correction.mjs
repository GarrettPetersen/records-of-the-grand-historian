import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { writeTextAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '134';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = 'staged-candidate-e0ca15ceda8e3bdf6509.json';
const reviewFile = 'e0ca15ceda8e3bdf65094610878275d80aaa122094bd95daaa9b407b3303f855.candidate-review.json';
const expectedSeal = 'sha256:e0ca15ceda8e3bdf65094610878275d80aaa122094bd95daaa9b407b3303f855';
const expectedCandidate = 'sha256:91e6c10af95633d56d470fedbd4b41a697591d9e9e14308793604bc5e7566982';
const stagingBase = process.env.CURATION_STAGING_BASE;
if (!/^[0-9a-f]{40}$/.test(stagingBase ?? '')) throw new Error('CURATION_STAGING_BASE must be the fetched staging commit');

const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const identity = validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.disposition !== 'accept-for-host-curation') throw new Error('Independent review did not accept this candidate');
if (identity.sealedCandidateHash !== expectedSeal || identity.candidateExtractionHash !== expectedCandidate || handoff.proposal.changes.length !== 1 || handoff.proposal.changes[0].id !== 'claim-237') throw new Error('Unexpected JWD134 residual candidate identity or scope');

const packet = buildDateAuditPacket(book, chapter);
if (packet.sourceHash !== handoff.canonicalSourceHash) throw new Error('Canonical source pin is stale');
const canonical = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const repaired = packet.extractionHash === handoff.canonicalExtractionHash
  ? applyDateRepairProposal(canonical, handoff.proposal, packet)
  : packet.extractionHash === expectedCandidate
    ? canonical
    : (() => { throw new Error('Canonical extraction pin is stale'); })();
if (JSON.stringify(repaired) !== JSON.stringify(handoff.candidate) || sha256(JSON.stringify(repaired)) !== expectedCandidate) throw new Error('Canonical replay does not match accepted candidate bytes');
const validation = validateCompactPeopleExtraction(repaired, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(repaired));
if (geometry.length) throw new Error(`Chronology geometry failed: ${JSON.stringify(geometry)}`);

writeTextAtomic(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`), serializeCompactPeopleExtraction(repaired));
writeJsonAtomic(path.join(directory, `${expectedSeal.slice(7)}.curation.json`), {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateCommit: '7a9f660da6b61f102921b880b2a59e124ac17067',
  candidateFile,
  sealedCandidateHash: expectedSeal,
  candidateExtractionHash: expectedCandidate,
  candidateReview: reviewFile,
  independentReviewCommit: 'c381bad13520e8bab95785a4db827f1051c70914',
  canonicalSourceHash: packet.sourceHash,
  priorCanonicalExtractionHash: handoff.canonicalExtractionHash,
  curatedAt: new Date().toISOString(),
  operations: 1,
  operationIds: handoff.proposal.changes.map(change => change.id),
  validation: {
    stagingBase,
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    canonicalReplay: 'PASS',
    compactValidation: `PASS: ${validation.stats.claims} claims.`,
    chronologyGeometry: 'PASS',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh independent canonical date audit by a different reviewer.',
});
console.log(JSON.stringify({ book, chapter, operations: handoff.proposal.changes.map(change => change.id), prior: handoff.canonicalExtractionHash, repaired: expectedCandidate, claims: validation.stats.claims, geometry: 'PASS' }));
