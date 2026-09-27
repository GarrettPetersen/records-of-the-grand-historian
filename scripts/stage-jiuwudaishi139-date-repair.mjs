import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '139';
const auditCommit = 'd56b8b87f3875f4b0517c423a815075ad829cf5d';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const findingFor = id => audit.findings.find(finding => finding.items?.includes(id));

const required = ['claim-5', 'hints-p001', 'p001', 'claim-11', 'hints-p002', 'p002',
  'hints-p004', 'p004', 'hints-p006', 'p006', 'claim-66', 'hints-p011', 'p011'];
if (audit.status !== 'needs-revision' || audit.findings.length !== 4 ||
    required.some(id => !findingFor(id))) {
  throw new Error('Jiuwudaishi 139 audit is not the expected four-group repair state');
}

function claim(id) {
  const value = extraction.claims[Number(id.slice(6)) - 1];
  if (!value) throw new Error(`Missing ${id}`);
  return value;
}
function hints(personId, expected) {
  const person = extraction.people.find(row => row[0] === personId);
  if (!person || JSON.stringify(person[4]?.a) !== JSON.stringify(expected)) {
    throw new Error(`${personId} does not have the expected active-date hint`);
  }
  return person[4].a;
}

const changes = [];
for (const [id, personId, sourceText, event] of [
  ['claim-5', 'p001', '薛史', 'The source names the Xue History as a bibliographic authority; it supplies no personal-date attestation for Xue Juzheng.'],
  ['claim-11', 'p002', '歐陽史', 'The source names the Ouyang History as a bibliographic authority; it supplies no personal-date attestation for Ouyang Xiu.'],
]) {
  const before = claim(id);
  if (before[0] !== personId || before[1] !== 'attestation' || before[2]?.sourceDate?.text !== sourceText ||
      !before[2]?.westernYear || JSON.stringify(before[4]) !== JSON.stringify(['s0003'])) {
    throw new Error(`${id} is not the expected dated bibliographic label`);
  }
  const after = structuredClone(before);
  after[2] = { undatedSourceAttestation: true, event };
  changes.push({ kind: 'replace', id, before, after,
    reason: 'The cited Chinese is an undated bibliographic source-work label, not a personal activity; preserve the source reference while removing the imported Western-year attestation.' });
}

for (const [personId, expected] of [['p001', ['AD 973-974']], ['p002', ['AD 1053']]]) {
  const before = hints(personId, expected);
  changes.push({ kind: 'hints', personId, before, after: [],
    reason: 'Remove the active-date hint derived solely from the repaired undated bibliographic label; the source-work reference remains visible as an undated attestation.' });
}

{
  const before = hints('p004', ['BC 202-195']);
  changes.push({ kind: 'hints', personId: 'p004', before, after: ['BC 196-195'],
    reason: 'The chapter explicitly says 漢高祖末年; retain only the final-years chronology (BC 196-195), not the unsupported whole-reign range.' });
}
{
  const before = hints('p006', ['AD 924-925']);
  changes.push({ kind: 'hints', personId: 'p006', before, after: ['AD 911', 'AD 924-925'],
    reason: 'The chapter explicitly names Tang Zhuangzong as victor at Boxiang in AD 911; retain that personal event alongside the separately supported Tongguang AD 924-925 records.' });
}
{
  const before = claim('claim-66');
  if (before[0] !== 'p011' || before[1] !== 'attestation' || before[2]?.sourceDate?.text !== '顯德三年' ||
      before[2]?.westernYear?.era !== 'AD' || before[2]?.westernYear?.year !== 956 ||
      JSON.stringify(before[4]) !== JSON.stringify(['s0056'])) {
    throw new Error('claim-66 is not the expected internally inconsistent Zhou Taizu label');
  }
  const after = structuredClone(before);
  after[2] = { undatedSourceAttestation: true,
    event: 'The source wording reads 周太祖顯德三年, an internally inconsistent ruler/era label. Preserve the wording as an undated source attestation; it does not establish AD 956 activity for Zhou Taizu.' };
  changes.push({ kind: 'replace', id: 'claim-66', before, after,
    reason: 'Do not silently rewrite or transfer the internally inconsistent 周太祖顯德三年 label. Remove its false AD 956 Zhou Taizu chronology while retaining the source wording explicitly.' });
}
{
  const before = hints('p011', ['AD 952-956']);
  changes.push({ kind: 'hints', personId: 'p011', before, after: ['AD 952'],
    reason: 'The remaining named chapter evidence for Zhou Taizu is Guangshun 2 (AD 952); remove the unsupported AD 956 endpoint derived from the inconsistent Xiande 3 label.' });
}

if (changes.length !== 8) throw new Error(`Expected exactly 8 repairs, received ${changes.length}`);
const proposal = {
  schemaVersion: 1, kind: 'date-repair-proposal', book, chapter,
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, auditCommit,
  author: { name: 'Codex Jiuwudaishi 139 source-faithful four-group date-repair candidate', agentId: 'candidate_jwd139' },
  changes,
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
  schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter,
  canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash,
  auditCommit, auditReportHash: sha256(JSON.stringify(audit)), author: proposal.author,
  sealedCandidateHash, candidateExtractionHash, proposal, candidate, candidatePacket,
  validation: { status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats },
  auditEvidence: { findings: audit.findings }, canonicalMutation: 'NONE', masterMutation: 'NONE', publication: 'candidate-ref-only',
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter, candidateFile,
  sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash,
  sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence: { findings: audit.findings },
});
console.log(JSON.stringify({ auditCommit, sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
