import fs from 'node:fs';
import path from 'node:path';
import { actionableDateAuditItems, buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'xintangshu';
const chapter = '138';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const actionable = actionableDateAuditItems(audit);
const claimIds = actionable.filter(id => id.startsWith('claim-'));
const hintIds = actionable.filter(id => id.startsWith('hints-'));
if (claimIds.length !== 92 || hintIds.length !== 44) throw new Error(`Unexpected Xintangshu 138 repair scope: ${claimIds.length} claims, ${hintIds.length} hints`);
const findingFor = id => audit.findings.find(finding => finding.items.includes(id));
const sourceDateText = value => {
  if (!value || typeof value !== 'object') return null;
  if (typeof value.sourceDate?.text === 'string') return value.sourceDate.text;
  for (const child of Object.values(value)) {
    const text = sourceDateText(child);
    if (text) return text;
  }
  return null;
};
const researchReason = (id, value) => {
  const sourceDate = sourceDateText(value);
  if (!sourceDate) throw new Error(`${id} lacks a source-date context for its research hold`);
  return `The source date “${sourceDate}” records this specific episode or context, but does not establish continuous personal activity across the removed Western span; further source research is required before assigning personal chronology.`;
};
function directWesternYears(value, years = []) {
  if (!value || typeof value !== 'object') return years;
  if (value.westernYear?.era && Number.isInteger(value.westernYear.year)) years.push(value.westernYear);
  for (const child of Object.values(value)) directWesternYears(child, years);
  return years;
}
const yearLabel = date => `${date.era} ${date.year}`;
function replaceWesternContainer(value, id) {
  if (!value || typeof value !== 'object') return false;
  let replaced = false;
  if (Object.hasOwn(value, 'westernYear') || Object.hasOwn(value, 'westernInterval') || Object.hasOwn(value, 'westernBounds')) {
    const reason = researchReason(id, value);
    delete value.westernYear;
    delete value.westernInterval;
    delete value.westernBounds;
    value.unresolved = true;
    value.unresolvedReason = reason;
    value.event = 'Source-specific contextual or episode evidence retained; no Western personal chronology is asserted.';
    replaced = true;
  }
  for (const child of Object.values(value)) if (child && typeof child === 'object') replaced = replaceWesternContainer(child, id) || replaced;
  return replaced;
}
const changes = claimIds.map(id => {
  const before = extraction.claims[Number(id.slice(6)) - 1];
  if (!before) throw new Error(`Missing ${id}`);
  const after = structuredClone(before);
  if (!replaceWesternContainer(after[2], id)) throw new Error(`${id} has no Western date container to repair`);
  return { kind: 'replace', id, before, after, reason: findingFor(id)?.problem ?? researchReason(id, before[2]) };
});
for (const hintId of hintIds) {
  const personId = hintId.slice(6);
  const person = extraction.people.find(row => row[0] === personId);
  if (!person) throw new Error(`Missing ${hintId} person`);
  const related = claimIds.map(id => extraction.claims[Number(id.slice(6)) - 1]).find(claim => claim[0] === personId);
  if (!related) throw new Error(`${hintId} lacks a paired actionable claim`);
  const direct = [...new Set(extraction.claims
    .filter((claim, index) => claim[0] === personId && !claimIds.includes(`claim-${index + 1}`))
    .flatMap(claim => directWesternYears(claim[2]).map(yearLabel)))];
  const change = {
    kind: 'hints', personId, before: person[4]?.a ?? [],
    after: direct.length ? direct : [`research required: ${researchReason(hintId, related[2])}`],
    reason: direct.length
      ? `Replace the inherited interval with direct source-attested year hints for ${personId}.`
      : `Replace the inherited activity hint with the source-specific research hold for ${personId}.`,
  };
  // A finding can identify a paired hint which is already the exact direct-date
  // form required after its claim repair. Do not seal a byte-identical operation.
  if (JSON.stringify(change.before) !== JSON.stringify(change.after)) changes.push(change);
}
if (new Set(changes.map(change => change.kind === 'hints' ? `hints-${change.personId}` : change.id)).size !== changes.length) throw new Error('Duplicate candidate operations');
if (changes.length !== 133) throw new Error(`Unexpected non-noop Xintangshu 138 operation count: ${changes.length}`);
const proposal = {
  schemaVersion: 1, kind: 'date-repair-proposal', book, chapter,
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
  author: { name: 'Codex Xintangshu 138 residual date-repair candidate', agentId: 'date_audit_beiqishu006' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const sealedCandidateHash = sha256(JSON.stringify(proposal));
const dir = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(dir, { recursive: true });
// Extraction bytes can be identical after removing an invalid no-op from a
// proposal. Name the immutable handoff by its sealed proposal as well, so a
// rejected proposal is never overwritten by a corrected replay of those bytes.
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
writeJsonAtomic(path.join(dir, candidateFile), {
  schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter,
  canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash,
  auditReportHash: sha256(JSON.stringify(audit)), author: proposal.author, sealedCandidateHash,
  validation: { status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats },
  proposal, candidateExtractionHash, candidate, candidatePacket, auditEvidence: { findings: audit.findings },
});
writeJsonAtomic(path.join(dir, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter,
  candidateFile, sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash,
  sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence: { findings: audit.findings },
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, operations: changes.length, compact: validation.stats, serializedBytes: serializeCompactPeopleExtraction(candidate).length }));
