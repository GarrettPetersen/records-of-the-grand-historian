import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'houhanshu';
const chapter = '130';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const expected = new Map([
  ['claim-10', { person: 'p002', source: 's0037', label: 'Confucius quotation' }],
  ['claim-11', { person: 'p002', source: 's0059', label: 'Confucius retrospective carriage reference' }],
  ['claim-27', { person: 'p005', source: 's0124', label: 'Wu and Sun military-treatise title' }],
  ['claim-32', { person: 'p006', source: 's0124', label: 'Wu and Sun military-treatise title' }],
]);
const findingFor = id => audit.findings.find(finding => finding.items.includes(id));

if (audit.status !== 'needs-revision' || audit.findings.length !== 3) {
  throw new Error('Houhanshu 130 audit is not at the expected three-finding repair state');
}
for (const id of expected.keys()) {
  if (!findingFor(id)) throw new Error(`Missing audit finding for ${id}`);
}

const changes = [];
for (const [claimId, target] of expected) {
  const before = extraction.claims[Number(claimId.slice(6)) - 1];
  if (!before || before[0] !== target.person || before[1] !== 'attestation' ||
      !before[2]?.westernYear || JSON.stringify(before[4]) !== JSON.stringify([target.source])) {
    throw new Error(`${claimId} is not the expected dated literary/title attestation`);
  }
  const after = structuredClone(before);
  delete after[2].westernYear;
  delete after[2].westernInterval;
  delete after[2].westernBounds;
  after[2].unresolved = true;
  after[2].unresolvedReason = findingFor(claimId).problem;
  after[2].event = target.person === 'p002'
    ? `${target.label} retained as a source-linked literary reception record; no personal activity date is asserted.`
    : `${target.label} retained as a source-linked bibliographic reference; it does not identify or date a personal event.`;
  changes.push({ kind: 'replace', id: claimId, before, after, reason: findingFor(claimId).action });
}

for (const personId of ['p002', 'p005', 'p006']) {
  const person = extraction.people.find(row => row[0] === personId);
  const hintId = `hints-${personId}`;
  if (!person || !Array.isArray(person[4]?.a) || person[4].a.length !== 1 || !findingFor(hintId)) {
    throw new Error(`${personId} lacks the expected unsupported active-date hint`);
  }
  changes.push({
    kind: 'hints',
    personId,
    before: person[4].a,
    after: [`research required: ${findingFor(hintId).problem}`],
    reason: 'Replace chronology inherited from a quotation or bibliographic title with its explicit source-research hold.',
  });
}

if (changes.length !== 7) throw new Error('Expected four claim holds and three hint holds');
const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: { name: 'Codex Houhanshu 130 literary-reception date-repair candidate', agentId: 'repair_houhanshu130' },
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
  validation: { status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats },
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
