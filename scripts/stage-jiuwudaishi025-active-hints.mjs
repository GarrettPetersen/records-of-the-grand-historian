import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '025';
const ref = 'origin/codex/people-glossary-staging-v2';
const readRemoteJson = file => JSON.parse(execFileSync('git', ['show', `${ref}:${file}`], { encoding: 'utf8' }));
const extraction = readRemoteJson(`data/people/extractions/${book}/${chapter}.json`);
const audit = readRemoteJson(`data/people/date-audits/${book}/${chapter}.json`);
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || audit.findings.length !== 5 ||
    sha256(JSON.stringify(extraction)) !== audit.extractionHash) {
  throw new Error('Jiuwudaishi 025 canonical audit or remote extraction pin is stale');
}

const expectedProblems = new Map([
  ['p001', 'The active hint labels Li Keyong’s Pang Xun campaign as AD 868–869 while the chapter’s direct unit gives only his traditional age (十五) and the source-dated birth is AD 856. The present hint supplies a two-year event interval without chapter-local conversion evidence and obscures the age/date tension.'],
  ['p004', 'The active hint turns 貞元中 (within the Zhenyuan reign) into AD 785–805 as if Zhuye Jingzhong held the office throughout the entire reign. The source supplies an era placement, not continuous personal activity across both endpoints.'],
  ['p005', 'The active hints turn 元和初, 長慶初, and 太和中 into broad continuous AD ranges and add a late-eighth/early-ninth-century career span. These phrases locate individual acts within reigns; they do not establish activity across every listed endpoint.'],
  ['p006', 'The hint states AD 780–805 as Emperor Dezong’s appointment activity. The source says only that Dezong ordered Zhiyi appointed; a ruler’s reign supplies an outer bound, not evidence that the appointment or person’s activity lasted through the reign.'],
  ['p011', 'The hint derives a pre-AD-874 bound for the otherwise unidentified Prince of Zheng from Guochang’s enrollment in his lineage. The source identifies a lineage branch but supplies no identity-specific activity date for the title-holder.'],
]);
for (const [personId, problem] of expectedProblems) {
  const finding = audit.findings.find(item => item.items.includes(`hints-${personId}`) && item.items.includes(personId));
  if (!finding || finding.problem !== problem) throw new Error(`Unexpected audit evidence for ${personId}`);
}

const replacements = new Map([
  ['p001', [
    'AD 856 (birth, Dazhong 10)',
    'Source records age fifteen in Guochang’s campaign against Pang Xun; no chapter-local Western conversion is asserted.',
    'AD 876 (Qianfu 3, Yunzhou rising)',
  ]],
  ['p004', [
    'AD 785 or later (Zhenyuan reign, 貞元中): Shatuo prefectural chief; no continuous tenure across the reign is asserted.',
    'Died in battle fleeing Tibetan pursuers (after the cited tenure).',
  ]],
  ['p005', [
    'Under Emperor Dezong: appointed governor of Yinshan; no date within the reign is asserted.',
    'Yuanhe reign (元和初): entered as Golden Crow general; no continuous career range is asserted.',
    'Changqing reign (長慶初): defeated rebels at Shenzhou; no continuous reign-wide range is asserted.',
    'Taihe reign (太和中): Yinshan governor again; no continuous tenure across the reign is asserted.',
  ]],
  ['p006', [
    'AD 805 or earlier (under Emperor Dezong): appointed Zhiyi governor of Yinshan; no date within the reign is asserted.',
  ]],
  ['p011', [
    'AD 874 concerns Guochang’s later identification, not this title-holder: Zheng-prince lineage reference only; individual date unresolved.',
  ]],
]);

const changes = [...expectedProblems].map(([personId, problem]) => {
  const person = extraction.people.find(row => row[0] === personId);
  if (!person || !Array.isArray(person[4]?.a)) throw new Error(`${personId} lacks an active hint list`);
  return {
    kind: 'hints',
    personId,
    before: person[4].a,
    after: replacements.get(personId),
    reason: `${problem} ${audit.findings.find(item => item.items.includes(`hints-${personId}`)).action}`,
  };
});
if (changes.length !== 5) throw new Error('Expected exactly five active-hint changes');

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: { name: 'Codex Jiuwudaishi 025 active-hint date-repair candidate', agentId: 'repair_jiuwudaishi025_hints' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
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
