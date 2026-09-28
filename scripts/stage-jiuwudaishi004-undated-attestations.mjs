import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '004';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || audit.findings.length !== 2 ||
    sha256(JSON.stringify(extraction)) !== audit.extractionHash) {
  throw new Error('Jiuwudaishi 004 audit or canonical extraction pin is stale');
}

const problemFor = (item) => {
  const finding = audit.findings.find((entry) => entry.items.includes(item));
  if (!finding) throw new Error(`Missing audit finding for ${item}`);
  return finding.problem;
};

const withoutWesternInterval = (claimId) => {
  const index = Number(claimId.slice('claim-'.length)) - 1;
  const before = extraction.claims[index];
  if (!before || before[0] !== ({ 'claim-278': 'p031', 'claim-279': 'p031', 'claim-748': 'p074', 'claim-768': 'p076' })[claimId]) {
    throw new Error(`Unexpected ${claimId} owner`);
  }
  const after = structuredClone(before);
  const value = claimId === 'claim-278' ? after[2].dateContext : after[2];
  if (!value?.sourceDate?.text || !value.westernInterval) throw new Error(`${claimId} is not the expected dated attestation`);
  const events = {
    'claim-278': '“西漢梁孝王之時” is a retrospective Terrace of Song allusion; it supplies no calendar-bearing personal event or continuous activity span for Prince Xiao.',
    'claim-279': '“西漢梁孝王之時” identifies the historical allusion only; it supplies no calendar-bearing personal event or continuous activity span for Prince Xiao.',
    'claim-768': '“為小將王求所殺” records that Wang Qiu killed Wang Jue, but gives no calendar-bearing date for Wang Qiu’s activity.',
  };
  if (claimId === 'claim-278') {
    after[2].dateContext = { undatedSourceAttestation: true, event: events[claimId] };
  } else if (claimId === 'claim-748') {
    // Wang Jue's dated posthumous honor remains in its separate existing claim.
    // This prior-office notice must remain source-faithful without borrowing
    // that reception date for the offices or the killing.
    after[2] = {
      sourceDate: before[2].sourceDate,
      unresolved: true,
      unresolvedReason: 'The source records Wang Jue’s former offices and service at Xiangyang without a calendar-bearing personal event. The separate August AD 908 posthumous honor dates a later reception, not these offices or the killing.',
    };
  } else {
    after[2] = { undatedSourceAttestation: true, event: events[claimId] };
  }
  return { kind: 'replace', id: claimId, before, after, reason: problemFor(claimId) };
};

const withoutActiveHint = (personId) => {
  const person = extraction.people.find((row) => row[0] === personId);
  if (!person || !Array.isArray(person[4]?.a)) throw new Error(`${personId} lacks active hints`);
  const expected = personId === 'p031' ? ['BC 168-144'] : ['before AD 908'];
  if (JSON.stringify(person[4].a) !== JSON.stringify(expected)) throw new Error(`${personId} active hints changed before candidate preparation`);
  return { kind: 'hints', personId, before: person[4].a, after: [], reason: problemFor(`hints-${personId}`) };
};

const changes = [
  withoutWesternInterval('claim-278'),
  withoutWesternInterval('claim-279'),
  withoutActiveHint('p031'),
  withoutWesternInterval('claim-748'),
  withoutWesternInterval('claim-768'),
  withoutActiveHint('p076'),
];
if (changes.length !== 6) throw new Error('Candidate must contain exactly six audited operations');

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: { name: 'Independent Jiuwudaishi 004 date-repair candidate', agentId: 'candidate_jiuwudaishi004_date_repair' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
const replay = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(replay) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
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
