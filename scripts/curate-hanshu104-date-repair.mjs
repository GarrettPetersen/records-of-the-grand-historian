import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Host-only materialization of the independently reviewed chronology repair.
// Candidate and review records are copied unchanged into the curation chain.
const book = 'hanshu';
const chapter = '104';
const auditCommit = '2eaac00ddbcb61bc3a939f8d5da9f4c164c48c66';
const candidateCommit = 'c34e5fd792';
const reviewCommit = '1fa930b1e5';
const seal = 'sha256:e2f44ee0b734163af9e7666d99401a124547c477ab11f0445d61ee0d48a3dcf0';
const candidateHash = 'sha256:8c27c2f26c2d5bbda7279f053dc4f42444e8ef47fcb26afa0535da0fd79ab7a0';
const sourceHash = 'sha256:8a70caaf1afc1fdc15096707d2e71519f5da38674d7219b276cc2ccc685eef8f';
const priorHash = 'sha256:a72f4f26ae869892e8ac669c56201840cc7801b353e1415373a6956bf1bafecd';
const repairDir = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${seal.slice(7, 27)}.json`;
const reviewFile = `${seal.slice(7)}.candidate-review.json`;
const handoff = readJson(path.join(repairDir, candidateFile));
const review = readJson(path.join(repairDir, reviewFile));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction: canonical });

if (packet.sourceHash !== sourceHash || packet.extractionHash !== priorHash ||
    handoff.canonicalSourceHash !== sourceHash || handoff.canonicalExtractionHash !== priorHash) {
  throw new Error('Current canonical Hanshu 104 pins differ from the accepted candidate');
}
if (sha256(JSON.stringify(canonical)) !== priorHash || handoff.auditReportHash !==
    'sha256:652f9d595d6b269486fd6b5cde3b5ac6d6972c5287a05d9e4968197b3a8cf21e') {
  throw new Error('Canonical extraction or initial audit pin mismatch');
}
if (handoff.sealedCandidateHash !== seal || sealedDateRepairProposalHash(handoff.proposal) !== seal ||
    handoff.candidateExtractionHash !== candidateHash || sha256(JSON.stringify(handoff.candidate)) !== candidateHash) {
  throw new Error('Sealed candidate identity mismatch');
}
validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.disposition !== 'accept-for-host-curation' || handoff.proposal.changes.length !== 64) {
  throw new Error('Independent review does not accept exactly 64 operations');
}
const counts = handoff.proposal.changes.reduce((out, change) => {
  out[change.kind] = (out[change.kind] ?? 0) + 1;
  return out;
}, {});
if (counts.replace !== 34 || counts.hints !== 30 || Object.keys(counts).length !== 2) {
  throw new Error(`Unexpected accepted operation scope: ${JSON.stringify(counts)}`);
}
const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (JSON.stringify(candidate) !== JSON.stringify(handoff.candidate) || sha256(JSON.stringify(candidate)) !== candidateHash) {
  throw new Error('Accepted candidate does not replay byte-for-byte');
}
const expectedHints = new Map([
  ['p012', ['BC 196-174']], ['p013', ['BC 154-131']], ['p014', ['BC 140-131']],
  ['p015', ['BC 154']], ['p044', ['BC 127', 'BC 124-121']],
]);
for (const [personId, expected] of expectedHints) {
  const person = candidate.people.find(row => row[0] === personId);
  if (!person || JSON.stringify(person[4]?.a ?? []) !== JSON.stringify(expected)) {
    throw new Error(`${personId} active-date hint must remain ${JSON.stringify(expected)}`);
  }
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry diagnostics: ${JSON.stringify(geometry)}`);
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(candidate));
if (sha256(JSON.stringify(readJson(extractionPath))) !== candidateHash) throw new Error('Compact serialization changed the sealed candidate');
writeJsonAtomic(path.join(repairDir, `${seal.slice(7)}.curation.json`), {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book, chapter, auditCommit, candidateCommit, independentReviewCommit: reviewCommit,
  candidateFile, candidateReview: reviewFile, sealedCandidateHash: seal,
  candidateExtractionHash: candidateHash, canonicalSourceHash: sourceHash,
  priorCanonicalExtractionHash: priorHash, operations: 64,
  scope: { claimDateReplacements: 34, activeHintRepairs: 30 },
  validation: {
    canonicalPins: 'PASS', sealedProposalIdentity: 'PASS', acceptedReviewIdentity: 'PASS',
    exactProposalReplay: 'PASS', candidateHash: 'PASS',
    p012IndependentBound: 'PASS: King of Huainan retains only independently supported BC 196-174.',
    retainedIndependentHints: 'PASS: p013 BC 154-131, p014 BC 140-131, p015 BC 154, and p044 BC 127 / BC 124-121 are unchanged.',
    compactValidation: `PASS: ${validation.stats.claims} claims.`,
    chronologyGeometry: 'PASS: zero diagnostics.',
  },
  publication: 'staging-only', masterMutation: 'NONE', sharedTreeMutation: 'NONE',
  nextStep: 'Fresh independent full canonical date audit by a different reviewer; the prior audit is stale after this canonical change.',
});
console.log(JSON.stringify({ candidateHash, operations: handoff.proposal.changes.length, counts, validation: validation.stats, geometry: 'PASS' }));
