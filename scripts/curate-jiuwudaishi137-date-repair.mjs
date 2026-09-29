import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '137';
const candidateCommit = '1514d35e2a7d4c9a6025c84e2a6366e5430dab33';
const reviewCommit = 'b799b89ded994a19d887a611835d7a8d95a46235';
const seal = 'sha256:0d51fbe0716f0f19a368850f8a46145ee9ce8baa4693785a433cce75d7f5ee13';
const candidateHash = 'sha256:bb3af1ecfb55b1572ba439ed9b8c44bf38a68c9fd19b81027e969c9142f87ec0';
const sourceReviewRawHash = 'sha256:57d342725ab4d04628f0ec012b6fb3792740e6393e60b65e194d5c6ee29d9feb';
const normalizedReviewHash = 'sha256:b9d3aa99de574c4a97b205d587fc2510f32d525d7d2640437bd0df53ff102fe4';
const stagingBase = process.env.CURATION_STAGING_BASE;
if (!/^[0-9a-f]{40}$/.test(stagingBase ?? '')) throw new Error('CURATION_STAGING_BASE must be the fetched staging commit');

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const dir = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${seal.slice(7, 27)}.json`;
const reviewFile = `${seal.slice(7)}.candidate-review.json`;
const handoff = readJson(path.join(dir, candidateFile));
const reviewPath = path.join(dir, reviewFile);
const reviewRaw = fs.readFileSync(reviewPath, 'utf8');
// The independently reviewed branch had one terminal literal "\\n" after valid JSON.
// Its exact raw hash remains pinned, while this valid JSON normalization is what staging
// can safely parse and is separately pinned below.
if (sha256(reviewRaw) !== normalizedReviewHash) throw new Error('Normalized independent-review artifact drifted');
const review = JSON.parse(reviewRaw);
const packet = buildDateAuditPacket(book, chapter);
const canonicalPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(canonicalPath);

if (packet.sourceHash !== handoff.canonicalSourceHash || packet.extractionHash !== handoff.canonicalExtractionHash) {
  throw new Error('Canonical source or extraction pin is stale');
}
if (handoff.sealedCandidateHash !== seal || sealedDateRepairProposalHash(handoff.proposal) !== seal ||
    handoff.candidateExtractionHash !== candidateHash || sha256(JSON.stringify(handoff.candidate)) !== candidateHash) {
  throw new Error('Sealed candidate identity mismatch');
}
if (review.candidateCommit !== candidateCommit || review.disposition !== 'accept-for-host-curation' ||
    review.expectedCanonicalAuditStatus !== 'requires-fresh-independent-audit' || review.sealedCandidateHash !== seal ||
    review.candidateExtractionHash !== candidateHash || review.publication !== 'staging-only' ||
    review.reviewer?.independentOfExtractor !== true || review.reviewer?.independentOfCandidateCurator !== true ||
    review.reviewer?.independentOfAuditAuthor !== true) {
  throw new Error('Independent review does not authorize this exact staging-only curation');
}
const changes = handoff.proposal.changes;
const counts = Object.fromEntries(['replace', 'hints'].map(kind => [kind, changes.filter(change => change.kind === kind).length]));
if (changes.length !== 11 || !same(counts, { replace: 5, hints: 6 })) throw new Error(`Unexpected operation scope: ${JSON.stringify(counts)}`);
const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (!same(candidate, handoff.candidate) || sha256(JSON.stringify(candidate)) !== candidateHash) throw new Error('Exact eleven-operation replay does not reproduce candidate');
const changedTopLevel = Object.keys(canonical).filter(key => !same(canonical[key], candidate[key]));
if (!same(changedTopLevel, ['people', 'claims'])) throw new Error(`Non-date top-level drift: ${JSON.stringify(changedTopLevel)}`);

const hintsFor = id => candidate.people.find(person => person[0] === id)?.[4]?.a;
if (!same(hintsFor('p004'), ['AD 913']) || !same(hintsFor('p041'), ['Mingzong reign AD 926-933']) ||
    !['p005', 'p037', 'p066', 'p089'].every(id => same(hintsFor(id), []))) {
  throw new Error('Retained or removed date hints differ from the accepted source-supported scope');
}
for (const id of ['claim-27', 'claim-37', 'claim-305', 'claim-488', 'claim-588']) {
  const change = changes.find(item => item.id === id);
  const value = change?.after?.[2];
  if (change?.kind !== 'replace' || value?.undatedSourceAttestation !== true ||
      ['westernYear', 'westernInterval', 'westernBounds', 'dateContext'].some(key => key in value)) {
    throw new Error(`${id} is not the required explicit undated attestation`);
  }
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry diagnostics: ${JSON.stringify(geometry)}`);

fs.writeFileSync(canonicalPath, serializeCompactPeopleExtraction(candidate));
const curated = readJson(canonicalPath);
if (!same(curated, candidate) || sha256(JSON.stringify(curated)) !== candidateHash) throw new Error('Canonical serialization altered sealed candidate');
writeJsonAtomic(path.join(dir, `${seal.slice(7)}.curation.json`), {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book, chapter, stagingBase, candidateCommit, independentReviewCommit: reviewCommit,
  candidateFile, candidateReview: reviewFile, candidateReviewRawHash: sourceReviewRawHash,
  candidateReviewNormalizedHash: normalizedReviewHash,
  candidateReviewEncoding: 'review commit had one terminal literal \\n; staging removes only that invalid suffix, while preserving the remote raw hash and commit pin',
  sealedCandidateHash: seal, candidateExtractionHash: candidateHash,
  canonicalSourceHash: packet.sourceHash, priorCanonicalExtractionHash: handoff.canonicalExtractionHash,
  curatedAt: new Date().toISOString(), operations: changes.length,
  operationIds: changes.map(change => change.kind === 'hints' ? `hints-${change.personId}` : change.id),
  scope: { claimReplacements: counts.replace, activeHintRevisions: counts.hints, retainedHints: { p004: hintsFor('p004'), p041: hintsFor('p041') } },
  validation: {
    canonicalPins: 'PASS', sealedProposalIdentity: 'PASS', acceptedReviewIdentity: 'PASS',
    exactReplayAndHash: 'PASS', exactOperationScope: 'PASS: five claim replacements and six paired active-hint revisions.',
    strictCompactValidation: `PASS: ${validation.stats.claims} claims.`, chronologyGeometry: 'PASS: zero diagnostics.',
  },
  publication: 'staging-only', masterMutation: 'NONE', sharedTreeMutation: 'NONE',
  nextStep: 'Fresh complete independent canonical date audit by a different reviewer.',
});
console.log(JSON.stringify({ book, chapter, stagingBase, operations: changes.length, counts, candidateHash, claims: validation.stats.claims, geometry: 'PASS' }));
