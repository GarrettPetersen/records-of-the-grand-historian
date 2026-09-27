import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '134';
const auditPath = '/tmp/jwd134-final-audit.json';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(auditPath);
const packet = buildDateAuditPacket(book, chapter);

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash || audit.extractionHash !== packet.extractionHash) {
  throw new Error('Fresh JWD134 final audit is stale or not repairable');
}
const finding = audit.findings.find((entry) => entry.items.includes('claim-237'));
if (!finding || audit.findings.length !== 1) throw new Error('Expected exactly the claim-237 residual finding');

const before = extraction.claims[236];
if (!before || before[0] !== 'p045' || before[1] !== 'attestation' || before[2]?.westernInterval?.start?.year !== 921 || before[2]?.westernInterval?.end?.year !== 922) {
  throw new Error('JWD134 claim-237 is not the expected AD 921–922 Yang Pu interval');
}
const after = structuredClone(before);
delete after[2].westernInterval;
after[2].westernYear = { era: 'AD', year: 921, precision: 'year' };

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  author: {
    name: 'Codex Jiuwudaishi 134 final-audit Yang Pu point-date repair candidate',
    agentId: 'candidate_jwd134_residual',
  },
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  changes: [{
    kind: 'replace',
    id: 'claim-237',
    before,
    after,
    reason: `${finding.action} The contemporaneous sequence in s0308 and s0310 dates Yang Wei’s death and Yang Pu’s sixth-month installation to Tianyou 18 (AD 921); s0068 retains the installation wording without asserting AD 922.`,
  }],
};
if (proposal.changes.length !== 1) throw new Error('Expected exactly one residual repair');

const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;

writeJsonAtomic(path.join(directory, candidateFile), {
  schemaVersion: 1,
  kind: 'date-repair-candidate-handoff',
  book,
  chapter,
  canonicalSourceHash: packet.sourceHash,
  canonicalExtractionHash: packet.extractionHash,
  auditReportHash: sha256(JSON.stringify(audit)),
  author: proposal.author,
  sealedCandidateHash,
  candidateExtractionHash,
  proposal,
  candidate,
  candidatePacket,
  validation: {
    status: 'passed',
    proposalReplay: 'PASS',
    compactValidation: 'PASS',
    chronologyGeometry: 'PASS',
    stats: validation.stats,
  },
  auditEvidence: { findings: audit.findings },
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1,
  kind: 'independent-staged-date-repair-review-packet',
  book,
  chapter,
  candidateFile,
  sourceHash: packet.sourceHash,
  originalExtractionHash: packet.extractionHash,
  sealedCandidateHash,
  candidateExtractionHash,
  candidatePacket,
  auditEvidence: { findings: audit.findings },
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: proposal.changes.length, stats: validation.stats }));
