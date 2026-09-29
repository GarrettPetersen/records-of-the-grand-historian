import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '147';
const auditCommit = '77eea0d15fd2ebd497f53a0a4495996c4395d61c';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || audit.findings.length !== 3) {
  throw new Error('Jiuwudaishi 147 initial audit is stale or is not the expected three-group repair state');
}

const expectedItems = new Set([
  'claim-92', 'claim-251', 'p001',
  'claim-134', 'hints-p037', 'p037',
  'claim-141', 'hints-p044', 'p044',
]);
const auditedItems = new Set(audit.findings.flatMap(finding => finding.items ?? []));
if (JSON.stringify([...auditedItems].sort()) !== JSON.stringify([...expectedItems].sort())) {
  throw new Error(`Unexpected JWD147 audit scope: ${JSON.stringify([...auditedItems].sort())}`);
}

const claim = id => {
  const row = extraction.claims[Number(id.slice(6)) - 1];
  if (!row) throw new Error(`Missing ${id}`);
  return row;
};
const findingFor = id => audit.findings.find(finding => finding.items?.includes(id));
const changes = [];
const replaceHints = (personId, expected, after, reason) => {
  const person = extraction.people.find(row => row[0] === personId);
  const before = person?.[4]?.a;
  if (!person || JSON.stringify(before) !== JSON.stringify(expected)) {
    throw new Error(`${personId} active-date hints drifted from audit input`);
  }
  changes.push({ kind: 'hints', personId, before, after, reason });
};

// Tongguang 1 is the date of the Later Tang Censorate memorial, not a 923
// attestation or action by Liang Taizu. Keep the source's retrospective
// identification and its political content, but remove only its borrowed date.
{
  const before = claim('claim-92');
  if (before[0] !== 'p001' || before[1] !== 'attestation' || before[2]?.sourceDate?.text !== '同光元年' ||
      before[2]?.westernYear?.era !== 'AD' || before[2]?.westernYear?.year !== 923) {
    throw new Error('claim-92 drifted from the audited false Tongguang attestation');
  }
  const after = [before[0], before[1], {
    undatedSourceAttestation: true,
    event: 'A Later Tang Censorate memorial retrospectively identifies Zhu Wen’s usurpation and revision of legal provisions; Tongguang 1 dates the memorial, not Liang Taizu’s activity.',
  }, before[3], before[4]];
  changes.push({ kind: 'replace', id: 'claim-92', before, after, reason: findingFor('claim-92').action });
}
{
  const before = claim('claim-251');
  if (before[0] !== 'p001' || before[1] !== 'event-participation' || before[2]?.dateContext?.sourceDate?.text !== '同光元年' ||
      before[2]?.dateContext?.westernYear?.era !== 'AD' || before[2]?.dateContext?.westernYear?.year !== 923) {
    throw new Error('claim-251 drifted from the audited false Tongguang event date');
  }
  const after = structuredClone(before);
  delete after[2].dateContext;
  changes.push({ kind: 'replace', id: 'claim-251', before, after, reason: findingFor('claim-251').action });
}
if (JSON.stringify(extraction.people.find(row => row[0] === 'p001')?.[4]?.a) !== JSON.stringify(['AD 909', 'AD 910'])) {
  throw new Error('p001’s independently supported active-date hints drifted from audit input');
}

// Cui Cong's memorial is dated only to a fourth month. Preserve the source
// attestation, not an interval inferred from neighboring narrative.
{
  const before = claim('claim-134');
  if (before[0] !== 'p037' || before[1] !== 'attestation' || before[2]?.sourceDate?.text !== '四月' ||
      before[2]?.westernInterval?.start?.year !== 931 || before[2]?.westernInterval?.end?.year !== 932) {
    throw new Error('claim-134 drifted from the audited false Cui Cong interval');
  }
  const after = [before[0], before[1], {
    undatedSourceAttestation: true,
    event: 'Cui Cong submitted a memorial proposing a ward and medical care for sick prisoners; the source dates it only to a fourth month.',
  }, before[3], before[4]];
  changes.push({ kind: 'replace', id: 'claim-134', before, after, reason: findingFor('claim-134').action });
}
replaceHints(
  'p037', ['AD 931', 'AD 932'], [],
  'Remove the active-date hints copied from Cui Cong’s unsupported AD 931–932 interval; the retained memorial is explicitly source-undated.'
);

// The covenant of three articles is an early-Han allusion. Correct the
// era-direction error while retaining the original retrospective wording.
{
  const before = claim('claim-141');
  if (before[0] !== 'p044' || before[1] !== 'attestation' || before[2]?.sourceDate?.text !== '漢祖約三章' ||
      before[2]?.westernYear?.era !== 'AD' || before[2]?.westernYear?.year !== 206) {
    throw new Error('claim-141 drifted from the audited reversed Han-founder year');
  }
  const after = structuredClone(before);
  after[2].westernYear = { era: 'BC', year: 206, precision: 'year' };
  changes.push({ kind: 'replace', id: 'claim-141', before, after, reason: findingFor('claim-141').action });
}
replaceHints(
  'p044', ['AD 206'], ['BC 206'],
  'Correct the Han founder’s active-date hint from AD 206 to source-qualified BC 206; the chapter’s wording remains a retrospective early-Han allusion.'
);

if (changes.length !== 6) throw new Error(`Expected exactly six atomic JWD147 repairs, got ${changes.length}`);
const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit,
  author: { name: 'Codex Jiuwudaishi 147 source-faithful chronology repair candidate', agentId: 'candidate_jwd147' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
if (candidate.people.length !== extraction.people.length || candidate.claims.length !== extraction.claims.length) {
  throw new Error('Repair changed record cardinality');
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
    exactAtomicScope: 'PASS: three audited chronology groups, with two borrowed Tongguang dates removed, one undated fourth-month memorial retained, and one AD/BC era-direction correction.',
    preservedEvidence: 'PASS: Liang Taizu’s retrospective political reference, Cui Cong’s memorial, the Han-founder allusion, all people, all source units, and all claim/mention provenance remain present.',
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
