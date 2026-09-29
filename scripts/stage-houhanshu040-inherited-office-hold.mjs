import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'houhanshu';
const chapter = '040';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const targets = new Map([
  ['claim-145', 'p004'],
  ['claim-146', 'p005'],
]);
const findingFor = id => audit.findings.find(finding => finding.items.includes(id));

if (audit.status !== 'needs-revision' || audit.findings.length !== 2 ||
    [...targets].some(([claimId, personId]) => !findingFor(claimId)?.items.includes(personId))) {
  throw new Error('Houhanshu 040 audit scope is not the expected two inherited-office findings');
}

const changes = [];
for (const [claimId, personId] of targets) {
  const before = extraction.claims[Number(claimId.slice(6)) - 1];
  if (!before || before[0] !== personId || before[1] !== 'attestation' || !before[2]?.westernInterval) {
    throw new Error(`${claimId} is not the expected inherited-office chronology`);
  }
  const finding = findingFor(claimId);
  const after = structuredClone(before);
  delete after[2].westernYear;
  delete after[2].westernInterval;
  delete after[2].westernBounds;
  after[2].unresolved = true;
  after[2].unresolvedReason = finding.problem;
  after[2].event = 'The dated office belongs to the named ancestor in the genealogy; no personal chronology is asserted for this generic intervening generation.';
  changes.push({ kind: 'replace', id: claimId, before, after, reason: finding.action });

  const person = extraction.people.find(row => row[0] === personId);
  if (!person || !Array.isArray(person[4]?.a) || person[4].a.length !== 1) throw new Error(`${personId} lacks its inherited active-date hint`);
  changes.push({
    kind: 'hints',
    personId,
    before: person[4].a,
    after: [`research required: ${finding.problem}`],
    reason: 'Replace inherited office chronology with the source-specific research hold.',
  });
}

if (changes.length !== 4) throw new Error('Expected exactly two claim repairs and two active-hint repairs');
const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: { name: 'Codex Houhanshu 040 inherited-office date-repair candidate', agentId: 'date_audit_liaoshi052' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

const candidateExtractionHash = sha256(JSON.stringify(candidate));
const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
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
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
