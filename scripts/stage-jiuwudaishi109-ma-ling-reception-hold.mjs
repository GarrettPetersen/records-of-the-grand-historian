import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '109';
const claimId = 'claim-641';
const personId = 'p084';
const sourceUnit = 's0145';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const finding = audit.findings.find(item =>
  item.items?.length === 3 && item.items.includes(claimId) &&
  item.items.includes(`hints-${personId}`) && item.items.includes(personId));

if (audit.status !== 'needs-revision' || audit.findings.length !== 1 || !finding) {
  throw new Error('Jiuwudaishi 109 audit is not the expected single Ma Ling repair group');
}

const before = extraction.claims[Number(claimId.slice(6)) - 1];
const person = extraction.people.find(row => row[0] === personId);
if (!before || before[0] !== personId || before[1] !== 'attestation' ||
    before[2]?.westernYear?.year !== 1105 || JSON.stringify(before[4]) !== JSON.stringify([sourceUnit])) {
  throw new Error(`${claimId} is not the expected false AD 1105 Ma Ling attestation`);
}
if (!person || JSON.stringify(person[4]?.a) !== JSON.stringify(['AD 1105'])) {
  throw new Error(`${personId} lacks the expected false AD 1105 active-date hint`);
}

const heldAttestation = structuredClone(before);
delete heldAttestation[2].westernYear;
delete heldAttestation[2].westernInterval;
delete heldAttestation[2].westernBounds;
heldAttestation[2].unresolved = true;
heldAttestation[2].unresolvedReason = finding.problem;
heldAttestation[2].event = 'Ma Ling is named only as the cited author of Southern Tang History, Zhu Yuan biography; author chronology requires separately pinned biographical evidence.';

const citedAuthorityReception = [
  personId,
  'event-participation',
  {
    kind: 'bibliographic-citation',
    role: 'cited-authority',
    action: 'Southern Tang History, Zhu Yuan biography is cited retrospectively while recounting Li Shouzhen’s rebellion; this citation does not assert Ma Ling’s personal activity.',
    receptionType: 'retrospective',
  },
  'explicit',
  [sourceUnit],
];

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Codex Jiuwudaishi 109 Ma Ling cited-authority date-repair candidate',
    agentId: 'date_repair_candidate_jiuwudaishi109',
  },
  changes: [
    {
      kind: 'replace',
      id: claimId,
      before,
      after: heldAttestation,
      reason: finding.action,
    },
    {
      kind: 'add-reception-event',
      after: citedAuthorityReception,
      reason: 'The cited work must remain source-faithful evidence, but its retrospective authority is distinct from Ma Ling’s personal chronology.',
    },
    {
      kind: 'hints',
      personId,
      before: person[4].a,
      after: [`research required: ${finding.problem}`],
      reason: 'Replace the false life-date hint with the audit-required author-chronology research hold.',
    },
  ],
};

const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
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
