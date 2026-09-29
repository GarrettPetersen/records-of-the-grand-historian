import fs from 'node:fs';
import path from 'node:path';
import { actionableDateAuditItems, buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'hanshu';
const chapter = '101';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const actionable = actionableDateAuditItems(audit);
const claimIds = actionable.filter(id => id.startsWith('claim-'));
const hintIds = actionable.filter(id => id.startsWith('hints-'));
if (claimIds.length !== 43 || hintIds.length !== 43) throw new Error(`Unexpected Hanshu 101 audit scope: ${claimIds.length} claims, ${hintIds.length} hints`);
const findingFor = id => audit.findings.find(finding => finding.items.includes(id));
function sourceDateText(value) {
  if (!value || typeof value !== 'object') return null;
  if (typeof value.sourceDate?.text === 'string') return value.sourceDate.text;
  return Object.values(value).map(sourceDateText).find(Boolean) ?? null;
}
function holdWesternContainers(value, id) {
  if (!value || typeof value !== 'object') return false;
  let changed = false;
  if (Object.hasOwn(value, 'westernYear') || Object.hasOwn(value, 'westernInterval') || Object.hasOwn(value, 'westernBounds')) {
    const sourceDate = sourceDateText(value);
    if (!sourceDate) throw new Error(`${id} lacks source-date wording for an unresolved hold`);
    delete value.westernYear;
    delete value.westernInterval;
    delete value.westernBounds;
    value.unresolved = true;
    value.unresolvedReason = `The source wording “${sourceDate}” identifies a specific event, context, or historical frame, but does not establish personal activity throughout the removed Western span; independent research is required for personal chronology.`;
    value.event = 'Source-specific context retained; no Western personal chronology is asserted.';
    changed = true;
  }
  for (const child of Object.values(value)) if (child && typeof child === 'object') changed = holdWesternContainers(child, id) || changed;
  return changed;
}
const changes = claimIds.map(id => {
  const before = extraction.claims[Number(id.slice(6)) - 1];
  if (!before) throw new Error(`Missing ${id}`);
  const after = structuredClone(before);
  if (!holdWesternContainers(after[2], id)) throw new Error(`${id} has no Western date container`);
  return { kind: 'replace', id, before, after, reason: findingFor(id)?.problem ?? 'Replace unsupported broad chronology with a source-specific unresolved hold.' };
});
for (const hintId of hintIds) {
  const personId = hintId.slice(6);
  const person = extraction.people.find(row => row[0] === personId);
  const related = claimIds.map(id => extraction.claims[Number(id.slice(6)) - 1]).find(claim => claim[0] === personId);
  if (!person || !related) throw new Error(`${hintId} lacks its audited person or paired claim`);
  const sourceDate = sourceDateText(related[2]);
  if (!sourceDate) throw new Error(`${hintId} paired claim lacks source-date wording`);
  changes.push({ kind: 'hints', personId, before: person[4]?.a ?? [], after: [`research required: The source wording “${sourceDate}” does not establish continuous personal activity across the prior Western span.`], reason: 'Replace the derived activity hint with the paired source-specific research hold.' });
}
if (changes.length !== 86 || new Set(changes.map(change => change.kind === 'hints' ? `hints-${change.personId}` : change.id)).size !== changes.length) throw new Error('Hanshu 101 proposal does not have one operation for every unique audited target');
const proposal = { schemaVersion: 1, kind: 'date-repair-proposal', book, chapter, sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, author: { name: 'Codex Hanshu 101 date-repair candidate', agentId: 'date_audit_beiqishu006' }, changes };
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const dir = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(dir, { recursive: true });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
writeJsonAtomic(path.join(dir, candidateFile), { schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter, canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash, auditReportHash: sha256(JSON.stringify(audit)), author: proposal.author, sealedCandidateHash, candidateExtractionHash, proposal, candidate, candidatePacket, validation: { status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats }, auditEvidence: { findings: audit.findings } });
writeJsonAtomic(path.join(dir, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), { schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter, candidateFile, sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash, sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence: { findings: audit.findings } });
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, operations: changes.length, stats: validation.stats }));
