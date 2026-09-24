import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '105';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash || audit.extractionHash !== packet.extractionHash) {
  throw new Error('Jiuwudaishi 105 recovery audit is stale or not repairable');
}
const finding = audit.findings.find(item => item.items.includes('claim-205'));
if (!finding || audit.findings.length !== 1) throw new Error('Expected exactly the residual claim-205 audit finding');

const p027 = extraction.people.find(person => person[0] === 'p027');
if (JSON.stringify(p027?.[4]?.a) !== JSON.stringify(['AD 948-950'])) {
  throw new Error('p027 must retain the ordinary supported AD 948-950 activity hint, not a research hold');
}

const before = extraction.claims[204];
if (!before || before[0] !== 'p027' || before[1] !== 'attestation' ||
    before[2]?.sourceDate?.text !== '乾祐中' || before[2]?.westernInterval?.start?.year !== 948 ||
    before[2]?.westernInterval?.end?.year !== 950 || before[2]?.unresolved !== true) {
  throw new Error('claim-205 is not the expected unresolved Qianyou interval');
}
const after = structuredClone(before);
delete after[2].unresolved;
delete after[2].unresolvedReason;

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit: '0b12c935e641333b123feb6b6b2bbdd63ff4bce2',
  author: {
    name: 'Codex Jiuwudaishi 105 claim-205 resolved-interval candidate',
    agentId: 'date_repair_candidate3_jiuwudaishi105',
  },
  changes: [{
    kind: 'replace',
    id: 'claim-205',
    before,
    after,
    reason: '乾祐中 supplies a complete source-faithful Qianyou-era interval of AD 948-950. The interval deliberately avoids an unsupported point year, but no outstanding research question remains once that interval is retained; remove only the unjustified unresolved marker and reason. p027 already carries the matching ordinary AD 948-950 activity hint and remains neither held nor unresolved.',
  }],
};

if (proposal.changes.length !== 1) throw new Error('This residual repair must contain exactly one atomic operation');
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

const claim48 = candidate.claims[47];
if (claim48?.[2]?.dateContext?.westernYear?.year !== 948 || claim48?.[2]?.dateContext?.westernInterval !== undefined) {
  throw new Error('Earlier curated claim-48 repair must remain an exact nested AD 948 year');
}
if (candidate.claims.length !== extraction.claims.length || candidate.people.length !== extraction.people.length) {
  throw new Error('Residual repair changed record cardinality');
}

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
    preservedClaim48: 'PASS: nested westernYear AD 948 only',
    retainedP027Hint: 'PASS: ordinary AD 948-950 interval; no research hold',
    exactAtomicScope: 'PASS: claim-205 only',
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
