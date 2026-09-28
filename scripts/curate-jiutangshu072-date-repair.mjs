import path from 'node:path';
import { applyDateRepairProposal, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Host-only materialization of an independently reviewed, sealed candidate.
// Candidate and review files remain immutable provenance.
const book = 'jiutangshu';
const chapter = '072';
const candidateCommit = 'cc0dcc98d80eaea595b7f290a4ea7628dbfcab53';
const independentReviewCommit = '64b738b7d785d9d5fb5b054295abc3b34f0d3d8c';
const seal = 'sha256:5a6eb268c910352eba7635f7d236d595dbe6692b47480e4af23eb26aa30e7673';
const candidateHash = 'sha256:45406bd9b00929d53922a4d7a4e166b8a2cb6d97456e49aea14a36693d87e6ec';
const repairDirectory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = 'staged-candidate-5a6eb268c910352eba76.json';
const reviewFile = `${seal.slice(7)}.candidate-review.json`;
const handoff = readJson(path.join(repairDirectory, candidateFile));
const review = readJson(path.join(repairDirectory, reviewFile));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter);

const identity = validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.disposition !== 'accept-for-host-curation' ||
    identity.sealedCandidateHash !== seal || identity.candidateExtractionHash !== candidateHash ||
    review.candidateCommit !== candidateCommit || handoff.proposal?.changes?.length !== 54) {
  throw new Error('Independent review does not authorize this exact 54-operation candidate');
}
if (handoff.canonicalSourceHash !== packet.sourceHash || handoff.canonicalExtractionHash !== packet.extractionHash ||
    sha256(JSON.stringify(canonical)) !== handoff.canonicalExtractionHash) {
  throw new Error('Canonical source or extraction no longer matches the sealed candidate pins');
}

const changes = handoff.proposal.changes;
const claimChanges = changes.filter(change => change.kind === 'replace');
const hintChanges = changes.filter(change => change.kind === 'hints');
if (claimChanges.length !== 39 || hintChanges.length !== 15 ||
    changes.some(change => change.kind !== 'replace' && change.kind !== 'hints')) {
  throw new Error('Candidate must contain exactly 39 claim replacements and 15 hint replacements');
}
const wudeIds = [35, 55, 61, 62, 64, 65, 66, 67, 68, 111, 112, 113, 114, 115, 116, 117, 123, 124, 127, 128, 131, 132, 133, 134, 137, 138, 140, 142, 173, 175].map(number => `claim-${number}`);
const headingIds = [38, 40, 42, 43, 44, 45].map(number => `claim-${number}`);
const undatedIds = ['claim-1056', 'claim-1145', 'claim-1173'];
const replacementById = new Map(claimChanges.map(change => [change.id, change]));
if (replacementById.size !== 39 || [...wudeIds, ...headingIds, ...undatedIds].some(id => !replacementById.has(id))) {
  throw new Error('Claim repair scope differs from the independently reviewed 39 claims');
}
const chronologyContainers = value => {
  if (!value || typeof value !== 'object') return [];
  const nested = Array.isArray(value) ? value.flatMap(chronologyContainers) : Object.values(value).flatMap(chronologyContainers);
  return ('westernYear' in value || 'westernInterval' in value || 'westernBounds' in value) ? [value, ...nested] : nested;
};
const isAd620Only = value => {
  const containers = chronologyContainers(value);
  return containers.length === 1 && containers[0].westernYear?.era === 'AD' &&
    containers[0].westernYear.year === 620 && containers[0].westernYear.precision === 'year' &&
    !containers[0].westernInterval && !containers[0].westernBounds;
};
for (const id of wudeIds) {
  const value = replacementById.get(id).after[2];
  if (!isAd620Only(value)) {
    throw new Error(`${id} must retain Tang Wude 3 / same-day as AD 620 only`);
  }
}
for (const id of [...headingIds, ...undatedIds]) {
  const value = replacementById.get(id).after[2];
  if (value?.undatedSourceAttestation !== true || Object.keys(value).some(key => key.startsWith('western'))) {
    throw new Error(`${id} must be an explicit undated source attestation`);
  }
}

const repaired = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (sha256(JSON.stringify(repaired)) !== candidateHash || JSON.stringify(repaired) !== JSON.stringify(handoff.candidate)) {
  throw new Error('Sealed candidate does not replay byte-for-byte');
}
const repairedById = new Map(repaired.claims.map((claim, index) => [`claim-${index + 1}`, claim]));
for (const id of wudeIds) {
  const value = repairedById.get(id)?.[2];
  if (!isAd620Only(value)) {
    throw new Error(`${id} did not materialize as AD 620 only`);
  }
}
for (const id of [...headingIds, ...undatedIds]) {
  const value = repairedById.get(id)?.[2];
  if (value?.undatedSourceAttestation !== true || Object.keys(value).some(key => key.startsWith('western'))) {
    throw new Error(`${id} did not materialize as undated`);
  }
}
if (new Set(hintChanges.map(change => change.personId)).size !== 15) throw new Error('Expected 15 distinct active-date hint repairs');
const validation = validateCompactPeopleExtraction(repaired, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(repaired));
if (geometry.length) throw new Error(`Chronology geometry diagnostics: ${JSON.stringify(geometry)}`);

writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(repaired));
const receiptFile = `${seal.slice(7)}.curation.json`;
writeJsonAtomic(path.join(repairDirectory, receiptFile), {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateCommit,
  independentReviewCommit,
  candidateFile,
  candidateReview: reviewFile,
  sealedCandidateHash: seal,
  candidateExtractionHash: candidateHash,
  canonicalSourceHash: handoff.canonicalSourceHash,
  priorCanonicalExtractionHash: handoff.canonicalExtractionHash,
  curatedAt: new Date().toISOString(),
  operations: changes.length,
  operationIds: changes.map(change => change.kind === 'hints' ? `hints-${change.personId}` : change.id),
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    canonicalReplay: 'PASS',
    wudeThreeChronology: 'PASS: all 30 Wude 3 / same-day claim containers are AD 620 only.',
    undatedAttestations: 'PASS: six heading claims and three unsupported dated claims are explicit undated source attestations.',
    activeDateHints: 'PASS: all 15 independently reviewed hint repairs materialized.',
    compactValidation: `PASS: ${validation.stats.claims} claims.`,
    chronologyGeometry: 'PASS',
    currentExtractionHash: candidateHash,
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh independent complete canonical date audit by a different reviewer; the prior audit is stale after this canonical change.',
});
console.log(JSON.stringify({ book, chapter, operations: changes.length, claims: validation.stats.claims, geometry: 'PASS', receipt: receiptFile }));
