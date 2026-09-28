import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// This is intentionally a candidate-only repair.  The preceding independent
// audit identified annal events that were never represented as temporal claims;
// it did not authorize a mutation of the canonical extraction.
const book = 'hanshu';
const chapter = '002';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);

if (audit.status !== 'needs-revision' || audit.findings.length !== 22) {
  throw new Error('Hanshu 002 must be at the fresh 22-finding omitted-event audit state');
}

// Each row is one dated event named in the complete fresh audit.  `date` keeps
// the Chinese wording visible in the pertinent annal unit; `year` is only the
// year-level Western conversion, never an invented month/day.  Context units
// are included only when the event unit itself carries a relative month/day.
const events = [
  ['p001', 's0001', '五年冬十月', 202], ['p001', 's0095', '秋七月', 202],
  ['p001', 's0126', '春正月丙午', 200], ['p001', 's0151', '七年冬十月', 200],
  ['p001', 's0156', '十二月', 200], ['p001', 's0163', '二月至夏四月', 199, ['s0161', 's0163', 's0169']],
  ['p001', 's0170', '八年冬', 199], ['p001', 's0231', '十一年冬', 196],
  ['p001', 's0281', '十二年冬十月', 195], ['p001', 's0323', '三月', 195],
  ['p001', 's0340', '三月至四月', 195, ['s0323', 's0340', 's0348']],
  ['p002', 's0001', '五年冬十月', 202], ['p002', 's0017', '十二月', 202, ['s0001', 's0017']],
  ['p003', 's0001', '五年冬十月', 202], ['p003', 's0109', '六年十二月', 201, ['s0106', 's0109']],
  // s0150–s0151 establish that the abbreviated 韓信 in s0170 is Han Wang
  // Xin, not the former Qi/Chu king Han Xin.
  ['p018', 's0170', '八年冬', 199, ['s0150', 's0151', 's0170'], 'The s0170 references to 韓信 continue the Han Wang Xin campaign established by s0150–s0151; they attest p018, not the former Qi/Chu king p003.'], ['p004', 's0001', '五年冬十月', 202],
  ['p007', 's0014', '十一月', 202, ['s0001', 's0014']], ['p007', 's0126', '春正月丙午', 200],
  ['p015', 's0046', '二月甲午', 202, ['s0029', 's0046']], ['p023', 's0046', '二月甲午', 202, ['s0029', 's0046']],
  ['p021', 's0095', '秋七月', 202], ['p021', 's0096', '九月', 202],
  ['p018', 's0126', '春正月丙午', 200], ['p018', 's0150', '秋九月', 200], ['p018', 's0151', '七年冬十月', 200],
  ['p040', 's0126', '春正月丙午', 200], ['p030', 's0163', '二月至夏四月', 199, ['s0161', 's0163', 's0169']],
  ['p030', 's0340', '三月至四月', 195, ['s0323', 's0340', 's0348']], ['p020', 's0194', '春正月', 198],
  ['p072', 's0201', '十年冬十月', 197], ['p053', 's0206', '九月', 197],
  ['p009', 's0273', '秋七月', 195], ['p009', 's0281', '十二年冬十月', 195],
  ['p024', 's0340', '三月至四月', 195, ['s0323', 's0340', 's0348']],
];

const receptions = [
  ['p044', 's0205', '八月', 197],
  ['p075', 's0311', '十二月', 195], ['p076', 's0311', '十二月', 195],
  ['p077', 's0311', '十二月', 195], ['p078', 's0311', '十二月', 195], ['p079', 's0311', '十二月', 195],
];

if (events.length + receptions.length !== 41) throw new Error('Expected exactly 41 fresh-audit annal events');
const findingFor = personId => audit.findings.find(finding => finding.items.includes(personId));
for (const personId of new Set([...events, ...receptions].map(([personId]) => personId))) {
  if (!findingFor(personId)) throw new Error(`Missing fresh-audit finding for ${personId}`);
}

const chronology = (date, year) => ({
  sourceDate: { text: date },
  westernYear: { era: 'BC', year, precision: 'year' },
});
const changes = events.map(([personId, unit, date, year, evidence = [unit], reason]) => ({
  kind: 'add',
  after: [personId, 'attestation', {
    ...chronology(date, year),
    event: 'Explicitly dated annal event naming this person; the Western conversion is retained at year precision only.',
  }, 'explicit', evidence],
  reason: reason ?? findingFor(personId).problem,
}));

for (const [personId, unit, date, year] of receptions) {
  changes.push({
    kind: 'add-reception-event',
    after: [personId, 'event-participation', {
      kind: 'posthumous-reference',
      role: 'honoree',
      action: 'named-in-dynastic-continuity decree',
      dateContext: chronology(date, year),
      event: 'The dated decree refers to this earlier ruler; it is not evidence of life or activity in this year.',
    }, 'explicit', [unit]],
    reason: findingFor(personId).problem,
  });
}

const activeYears = new Map();
for (const [personId, , , year] of events) {
  if (!activeYears.has(personId)) activeYears.set(personId, new Set());
  activeYears.get(personId).add(`BC ${year}`);
}
for (const [personId, years] of activeYears) {
  const person = extraction.people.find(row => row[0] === personId);
  if (!person) throw new Error(`Missing person ${personId}`);
  const before = person[4]?.a ?? [];
  const after = [...before];
  for (const year of [...years].sort((a, b) => Number(b.slice(3)) - Number(a.slice(3)))) if (!after.includes(year)) after.push(year);
  if (JSON.stringify(before) !== JSON.stringify(after)) changes.push({
    kind: 'hints', personId, before, after,
    reason: 'Add only the explicit annal-event years represented by this sealed candidate; posthumous reception years remain excluded from active hints.',
  });
}

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: { name: 'Codex Hanshu 002 omitted-annal-events date-repair candidate', agentId: 'candidate_hanshu002_omitted_dates' },
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
  schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter,
  canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash,
  auditReportHash: sha256(JSON.stringify(audit)), author: proposal.author,
  sealedCandidateHash, candidateExtractionHash, proposal, candidate, candidatePacket,
  validation: { status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats },
  auditEvidence: { findings: audit.findings },
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter,
  candidateFile, sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash,
  sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence: { findings: audit.findings },
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, events: 41, operations: changes.length, stats: validation.stats }));
