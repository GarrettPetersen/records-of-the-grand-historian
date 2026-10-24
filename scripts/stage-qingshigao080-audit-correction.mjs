import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'qingshigao';
const chapter = '080';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson('/tmp/qingshigao080-audit.json');
const packet = buildDateAuditPacket(book, chapter);

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash || audit.extractionHash !== packet.extractionHash) {
  throw new Error('Published Qingshigao 080 audit does not match the canonical source and extraction');
}
const findingFor = id => audit.findings.find(finding => finding.items.includes(id));
const changes = [];
const holds = new Map([
  ['claim-47', '元憲宗 identifies the founder, but the source supplies no specific year for this founding event or a continuous personal activity range.'],
  ['claim-48', '世祖時 supplies a reign context for reorganization, but no specific event year or continuous personal activity range.'],
  ['claim-56', 'The later AD 1717 annexation is explicitly owned by Güshi Khan’s great-grandson Lha-bzang Khan, not this unnamed earlier generation.'],
  ['claim-57', 'The later AD 1717 annexation is explicitly owned by Güshi Khan’s great-grandson Lha-bzang Khan, not this unnamed earlier generation.'],
  ['claim-62', '其子襲封，以罪誅 follows Polhané’s AD 1739 appointment but gives no year for the son’s inheritance or execution.'],
  ['claim-68', 'The AD 1750 ministerial stationing is institutional context; the adjacent Dalai Lama seating description does not date an officeholder’s personal activity.'],
  ['claim-77', 'The AD 1750 ministerial stationing is institutional context; the adjacent Panchen Erdeni seating description does not date an officeholder’s personal activity.'],
  ['claim-81', 'The AD 1717 survey commission dates the cartographers’ dispatch, not the Ladakh Khan named only in the boundary description.'],
]);
for (const [claimId, explanation] of holds) {
  const before = extraction.claims[Number(claimId.slice(6)) - 1];
  const finding = findingFor(claimId);
  if (!before?.[2] || (!finding && !['claim-47', 'claim-48'].includes(claimId))) throw new Error(`${claimId} is not an audited chronology target`);
  const after = structuredClone(before);
  delete after[2].westernYear;
  delete after[2].westernInterval;
  delete after[2].westernBounds;
  after[2].unresolved = true;
  after[2].unresolvedReason = explanation;
  after[2].event = 'The source preserves the relationship or succession statement, but does not supply this person’s own Western-year chronology.';
  changes.push({ kind: 'replace', id: claimId, before, after, reason: finding?.action ?? 'Narrow the reign-wide ruler attestation to the source’s undated event context while preserving its separately bounded event claim.' });
}
const hintChanges = new Map([
  ['p001', ['research required: 元憲宗 names the founder, but the source gives no specific event year.']],
  ['p002', ['research required: 世祖時 supplies only a reign context, not continuous personal activity.']],
  ['p007', ['research required: the source identifies this as an unnamed intermediate Güshi generation, not an AD 1717 actor.']],
  ['p008', ['research required: the source identifies this as an unnamed intermediate Güshi generation, not an AD 1717 actor.']],
  ['p012', ['research required: 其子襲封，以罪誅 has no stated inheritance or execution year.']],
  ['p013', ['research required: the AD 1750 ministerial stationing is institutional context, not a personal Dalai Lama date.']],
  ['p015', ['research required: the AD 1750 ministerial stationing is institutional context, not a personal Panchen Erdeni date.']],
  ['p016', ['research required: the AD 1717 survey dates cartographers’ dispatch, not the Ladakh Khan in the boundary description.']],
]);
for (const [personId, after] of hintChanges) {
  const person = extraction.people.find(row => row[0] === personId);
  if (!person || !findingFor(`hints-${personId}`)) throw new Error(`${personId} is not an audited hint target`);
  changes.push({ kind: 'hints', personId, before: person[4]?.a ?? [], after, reason: findingFor(`hints-${personId}`).action });
}
if (changes.length !== 16) throw new Error(`Expected 16 scoped repairs, got ${changes.length}`);
const proposal = {
  schemaVersion: 1, kind: 'date-repair-proposal', book, chapter,
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
  author: { name: 'Codex Qingshigao 080 source-date correction candidate', agentId: 'fresh_jinshi130_audit' },
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
  schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter, candidateFile,
  sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash, sealedCandidateHash, candidateExtractionHash,
  candidatePacket, auditEvidence: { findings: audit.findings },
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
