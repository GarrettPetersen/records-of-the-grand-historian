import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '130';
const claimIds = ['claim-74', 'claim-75', 'claim-76', 'claim-77'];
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const finding = audit.findings.find(item =>
  claimIds.every(id => item.items?.includes(id)) &&
  item.items?.includes('hints-p019') && item.items?.includes('hints-p021'));

if (audit.status !== 'needs-revision' || audit.findings.length !== 1 || !finding) {
  throw new Error('Jiuwudaishi 130 audit is not the expected single Guangshun 2 repair group');
}

const year952 = { era: 'AD', year: 952, precision: 'year' };
const expected = new Map([
  ['claim-74', { personId: 'p019', units: ['s0040'], sourceDate: '慕容彥超叛於兗州', field: 'westernInterval' }],
  ['claim-75', { personId: 'p019', units: ['s0125', 's0126'], sourceDate: '是年兗州慕容彥超反', field: 'westernYear' }],
  ['claim-76', { personId: 'p020', units: ['s0040'], sourceDate: '討慕容彥超', field: 'westernInterval' }],
  ['claim-77', { personId: 'p021', units: ['s0040'], sourceDate: '討慕容彥超', field: 'westernInterval' }],
]);

const changes = [];
for (const claimId of claimIds) {
  const before = extraction.claims[Number(claimId.slice(6)) - 1];
  const rule = expected.get(claimId);
  if (!before || before[0] !== rule.personId || before[1] !== 'attestation' ||
      before[2]?.sourceDate?.text !== rule.sourceDate || before[2]?.[rule.field] === undefined ||
      JSON.stringify(before[4]) !== JSON.stringify(rule.units)) {
    throw new Error(`${claimId} is not the expected Guangshun 2 campaign attestation`);
  }
  const after = structuredClone(before);
  delete after[2].westernInterval;
  delete after[2].westernBounds;
  after[2].westernYear = year952;
  changes.push({
    kind: 'replace', id: claimId, before, after,
    reason: '大事記續編 volume 77 explicitly dates Murong Yanchao’s rebellion and Cao Ying’s Yanzhou command to 周太祖廣順二年 (AD 952); retain each source attestation while replacing the false AD 951 or AD 952–953 chronology with the documented year.',
  });
}

for (const [personId, after] of [['p019', ['AD 950', 'AD 952']], ['p021', ['AD 952']]]) {
  const person = extraction.people.find(row => row[0] === personId);
  if (!person || !Array.isArray(person[4]?.a) || !person[4].a.length) throw new Error(`${personId} lacks active-date hints`);
  changes.push({
    kind: 'hints', personId, before: person[4].a, after,
    reason: personId === 'p019'
      ? 'Retain the separately supported AD 950 activity while replacing unsupported AD 951 with the documented Guangshun 2 (AD 952) rebellion.'
      : 'The only campaign evidence here is the Guangshun 2 (AD 952) expedition; narrow the active hint to that documented year.',
  });
}

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Codex Jiuwudaishi 130 Guangshun 2 residual date-repair candidate',
    agentId: 'date_repair_candidate_jiuwudaishi130_guangshun2',
  },
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
    status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS',
    chronologyGeometry: 'PASS', stats: validation.stats,
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
