import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'houhanshu';
const chapter = '031';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const targets = new Map([
  ['claim-173', ['s0007']],
  ['claim-174', ['s0023', 's0024']],
  ['claim-175', ['s0024']],
  ['claim-176', ['s0082']],
]);
const finding = audit.findings.find(item =>
  ['claim-173', 'claim-174', 'claim-175', 'claim-176', 'claim-177'].every(id => item.items.includes(id)));
if (audit.status !== 'needs-revision' || !finding) {
  throw new Error('Houhanshu 031 is not at the complete Huan Tan anchor-repair state');
}
const changes = [];
for (const [claimId, evidence] of targets) {
  const before = extraction.claims[Number(claimId.slice(6)) - 1];
  if (!before || before[0] !== 'p001' || before[1] !== 'attestation' || JSON.stringify(before[4]) !== JSON.stringify(['s0001'])) {
    throw new Error(`${claimId} is not the expected Huan Tan heading-anchored attestation`);
  }
  const after = structuredClone(before);
  after[4] = evidence;
  changes.push({
    kind: 'replace', id: claimId, before, after,
    reason: `${claimId} retains its source-bounded chronology but now cites the dated local passage that establishes this Huan Tan event, rather than undated biographical heading s0001.`,
  });
}
const tombBefore = extraction.claims[176];
if (!tombBefore || tombBefore[0] !== 'p001' || tombBefore[1] !== 'attestation' ||
    tombBefore[2]?.sourceDate?.text !== '元和中' || JSON.stringify(tombBefore[4]) !== JSON.stringify(['s0001'])) {
  throw new Error('claim-177 is not the expected Yuanhe tomb-worship attestation');
}
changes.push({
  kind: 'remove', id: 'claim-177', before: tombBefore,
  reason: 's0085 dates Emperor Zhang\'s envoy worshipping Huan Tan\'s tomb in Yuanhe; it is a posthumous commemoration, not a living attestation or activity date for Huan Tan.',
});

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: { name: 'Codex Houhanshu 031 complete Huan Tan date-repair candidate', agentId: 'repair_houhanshu031_round3' },
  changes,
};

const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
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
