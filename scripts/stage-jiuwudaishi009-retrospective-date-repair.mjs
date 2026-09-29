import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Candidate-only materialization.  This script never writes a canonical
// extraction, source chapter, model output, or publication artifact.
const book = 'jiuwudaishi';
const chapter = '009';
const auditCommit = '0132129498466d395fc9d936d317b58b73bd588b';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || sha256(JSON.stringify(extraction)) !== audit.extractionHash ||
    audit.findings.length !== 2) {
  throw new Error('Jiuwudaishi 009 canonical source, extraction, or initial audit pin is stale');
}
const findingFor = item => {
  const finding = audit.findings.find(entry => entry.items.includes(item));
  if (!finding) throw new Error(`Missing audit finding for ${item}`);
  return finding;
};
const claim = id => {
  const value = extraction.claims[Number(id.slice(6)) - 1];
  if (!value) throw new Error(`Missing ${id}`);
  return value;
};
const person = id => {
  const value = extraction.people.find(row => row[0] === id);
  if (!value) throw new Error(`Missing ${id}`);
  return value;
};
const boundedDate = (text, year) => ({
  sourceDate: { text },
  westernBounds: { onOrBefore: { era: 'AD', year, precision: 'year' } },
});
const changes = [];
const replaceTopLevelDate = (id, expectedPerson, expectedPredicate, expectedText, year) => {
  const before = claim(id);
  if (before[0] !== expectedPerson || before[1] !== expectedPredicate ||
      before[2]?.sourceDate?.text !== expectedText || !before[2]?.westernInterval) {
    throw new Error(`${id} is not the audited over-precise record`);
  }
  const after = structuredClone(before);
  after[2] = boundedDate(expectedText, year);
  changes.push({ kind: 'replace', id, before, after, reason: findingFor(id).problem });
};
const replaceContextDate = (id, expectedPerson, expectedPredicate, expectedText, year) => {
  const before = claim(id);
  if (before[0] !== expectedPerson || before[1] !== expectedPredicate ||
      before[2]?.dateContext?.sourceDate?.text !== expectedText || !before[2]?.dateContext?.westernInterval) {
    throw new Error(`${id} is not the audited over-precise contextual record`);
  }
  const after = structuredClone(before);
  after[2].dateContext = boundedDate(expectedText, year);
  changes.push({ kind: 'replace', id, before, after, reason: findingFor(id).problem });
};
const replaceStartDate = (id, expectedPerson, expectedPredicate, expectedText, year) => {
  const before = claim(id);
  if (before[0] !== expectedPerson || before[1] !== expectedPredicate ||
      before[2]?.startDate?.sourceDate?.text !== expectedText || !before[2]?.startDate?.westernInterval) {
    throw new Error(`${id} is not the audited over-precise start-date record`);
  }
  const after = structuredClone(before);
  after[2].startDate = boundedDate(expectedText, year);
  changes.push({ kind: 'replace', id, before, after, reason: findingFor(id).problem });
};
const hints = (id, expectedBefore, after) => {
  const before = person(id)[4]?.a ?? [];
  if (JSON.stringify(before) !== JSON.stringify(expectedBefore)) throw new Error(`${id} active hints drifted from audited input`);
  changes.push({ kind: 'hints', personId: id, before, after, reason: findingFor(`hints-${id}`).problem });
};

// The December 917 memorial only proves that Liu Xun's earlier loss of
// discipline had already occurred.  It gives no lower endpoint.
replaceTopLevelDate('claim-557', 'p063', 'attestation', '劉鄩失律', 917);
replaceContextDate('claim-558', 'p063', 'polity-association', '劉鄩失律', 917);
replaceContextDate('claim-559', 'p063', 'event-participation', '劉鄩失律', 917);
hints('p063', ['AD 915-917'], ['on or before AD 917']);

// 初 only places the recalled episode before the April 918 scene.  Every
// related fact shares that one-sided upper bound; none supports an AD 917
// lower endpoint.
replaceTopLevelDate('claim-703', 'p079', 'attestation', '初', 918);
replaceContextDate('claim-704', 'p079', 'office', '初', 918);
replaceContextDate('claim-708', 'p079', 'place-association', '初', 918);
replaceContextDate('claim-709', 'p079', 'work-association', '初', 918);
replaceContextDate('claim-710', 'p079', 'polity-association', '初', 918);
replaceContextDate('claim-711', 'p079', 'event-participation', '初', 918);
replaceContextDate('claim-712', 'p079', 'event-participation', '初', 918);
replaceTopLevelDate('claim-714', 'p080', 'attestation', '初', 918);
hints('p079', ['AD 917-918, drafted Qian Liu edict and demoted to Penglai'], ['on or before AD 918, drafted Qian Liu edict and demoted to Penglai']);
hints('p080', ['AD 917-918, subject of Dou Mengzheng appointment edict'], ['on or before AD 918, subject of Dou Mengzheng appointment edict']);

if (changes.length !== 14) throw new Error(`Expected 14 exact repair operations, got ${changes.length}`);
const proposal = {
  schemaVersion: 1, kind: 'date-repair-proposal', book, chapter,
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, auditCommit,
  author: { name: 'Independent Jiuwudaishi 009 retrospective chronology repair candidate', agentId: 'candidate_jiuwudaishi009_date_repair' },
  changes,
};
for (let index = 1; index <= changes.length; index += 1) {
  try { applyDateRepairProposal(extraction, { ...proposal, changes: changes.slice(0, index) }, packet); }
  catch (error) { throw new Error(`Operation ${index} ${changes[index - 1].id ?? changes[index - 1].personId}: ${error.message}`); }
}
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const validationSummary = {
  status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS (strict scoped alias-disposition validation)', chronologyGeometry: 'PASS',
  exactAtomicScope: 'PASS: exactly eleven audited chronology replacements and three paired active-date-hint replacements; no canonical extraction, source, model, or publication output changed.',
  stats: validation.stats,
};
writeJsonAtomic(path.join(directory, candidateFile), {
  schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter,
  canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash,
  auditReportHash: sha256(JSON.stringify(audit)), author: proposal.author,
  sealedCandidateHash, candidateExtractionHash, proposal, candidate, candidatePacket,
  validation: validationSummary, auditEvidence: { findings: audit.findings },
  canonicalMutation: 'NONE', masterMutation: 'NONE', publication: 'candidate-ref-only',
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter,
  candidateFile, sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash,
  sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence: { findings: audit.findings },
  requiredReview: 'Independently replay exactly 14 operations against the pinned canonical input and inspect Chinese units s0053 and s0076. Confirm claims 557–559 and p063 retain 劉鄩失律 only with on-or-before AD 917; claims 703, 704, 708–712, and 714 plus p079/p080 retain 初 only with on-or-before AD 918; no invented lower endpoint, source wording, evidence, or unrelated claim is changed. Confirm strict compact validation and chronology geometry pass.',
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
