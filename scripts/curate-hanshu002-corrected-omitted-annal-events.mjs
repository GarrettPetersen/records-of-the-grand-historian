import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Host-only materialization of the independently accepted 57-operation repair.
// The candidate and independent review remain immutable provenance records.
const book = 'hanshu';
const chapter = '002';
const repairDirectory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = 'staged-candidate-46b2bc4181c3fa550b2e.json';
const reviewFile = '46b2bc4181c3fa550b2ef9d0bc55351024989694622939ad7fdf3620efe206bb.candidate-review.json';
const handoff = readJson(path.join(repairDirectory, candidateFile));
const review = readJson(path.join(repairDirectory, reviewFile));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter);

if (review.disposition !== 'accept-for-host-curation') throw new Error('Candidate review is not accepted for host curation');
if (review.candidateFile !== candidateFile || review.candidateHash !== handoff.sealedCandidateHash) throw new Error('Accepted review does not identify this sealed candidate');
if (handoff.canonicalSourceHash !== packet.sourceHash || handoff.canonicalExtractionHash !== packet.extractionHash) throw new Error('Canonical source or extraction no longer matches the sealed candidate pins');
if (sha256(JSON.stringify(canonical)) !== handoff.canonicalExtractionHash) throw new Error('Canonical extraction hash mismatch');
const changes = handoff.proposal?.changes;
if (!Array.isArray(changes) || changes.length !== 57) throw new Error('Expected exactly 57 reviewed operations');
const kindCounts = changes.reduce((counts, change) => ({ ...counts, [change.kind]: (counts[change.kind] ?? 0) + 1 }), {});
if (kindCounts.add !== 35 || kindCounts['add-reception-event'] !== 6 || kindCounts.hints !== 16 || Object.keys(kindCounts).length !== 3) {
  throw new Error(`Unexpected repair operation kinds: ${JSON.stringify(kindCounts)}`);
}

const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
const candidateHash = sha256(JSON.stringify(candidate));
if (candidateHash !== handoff.candidateExtractionHash || JSON.stringify(candidate) !== JSON.stringify(handoff.candidate)) {
  throw new Error('Sealed candidate does not replay byte-for-byte');
}
const p003S0170 = candidate.claims.find(claim => claim[0] === 'p003' && claim[4]?.includes('s0170'));
const p018S0170 = candidate.claims.find(claim => claim[0] === 'p018' && claim[4]?.includes('s0170'));
const p003Hint = candidate.people.find(person => person[0] === 'p003')?.[4]?.a ?? [];
const p018Hint = candidate.people.find(person => person[0] === 'p018')?.[4]?.a ?? [];
if (p003S0170 || !p018S0170 || p003Hint.includes('BC 199') || !p018Hint.includes('BC 199')) {
  throw new Error('BC 199 s0170 ownership must remain solely with p018 Han Wang Xin');
}
for (const personId of ['p044', 'p075', 'p076', 'p077', 'p078', 'p079']) {
  if (!candidate.claims.some(claim => claim[0] === personId && claim[1] === 'event-participation' && claim[2]?.kind === 'posthumous-reference')) {
    throw new Error(`${personId} must retain its reviewed posthumous-reference reception event`);
  }
}

const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry diagnostics: ${JSON.stringify(geometry)}`);
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(candidate));

const receipt = {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateFile,
  sealedCandidateHash: handoff.sealedCandidateHash,
  candidateExtractionHash: handoff.candidateExtractionHash,
  candidateReview: reviewFile,
  canonicalSourceHash: handoff.canonicalSourceHash,
  priorCanonicalExtractionHash: handoff.canonicalExtractionHash,
  curatedAt: new Date().toISOString(),
  operations: changes.length,
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    canonicalReplay: 'PASS',
    s0170Ownership: 'PASS: BC 199 belongs solely to p018 Han Wang Xin; p003 has neither the claim nor active hint.',
    receptionClassification: 'PASS: p044 and p075–p079 remain posthumous-reference events without active-date hints.',
    currentExtractionHash: candidateHash,
    compactValidation: `PASS: ${validation.stats.claims} claims.`,
    chronologyGeometry: 'PASS',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh independent full canonical date audit by a different reviewer; the prior audit is expected to be stale after this canonical change.',
};
writeJsonAtomic(path.join(repairDirectory, `${handoff.sealedCandidateHash.slice(7)}.curation.json`), receipt);
console.log(JSON.stringify({ candidateHash, operations: changes.length, kindCounts, validation: validation.stats, geometry: 'PASS', receipt: `${handoff.sealedCandidateHash.slice(7)}.curation.json` }));
