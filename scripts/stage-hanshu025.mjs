import fs from 'node:fs';
import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'hanshu', chapter = '025';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const failed = new Set(audit.itemChecks.filter(check => check.verdict === 'incorrect' && check.id.startsWith('claim-')).map(check => check.id));
const why = id => audit.findings.find(finding => finding.items.includes(id))?.problem ?? 'Historical survey context has no own dated event.';
const changes = [];
for (const id of failed) {
  const before = extraction.claims[Number(id.slice(6)) - 1];
  const after = structuredClone(before), value = after[2];
  delete value.westernYear; delete value.westernInterval; delete value.westernBounds;
  value.unresolved = true;
  value.unresolvedReason = why(id);
  value.event = 'Historical survey or historiographical context retained; no personal Western activity chronology is asserted.';
  changes.push({ kind: 'replace', id, before, after, reason: why(id) });
}
for (const person of extraction.people) {
  const personId = person[0];
  const owned = [...failed].filter(id => extraction.claims[Number(id.slice(6)) - 1][0] === personId);
  if (!owned.length) continue;
  changes.push({ kind: 'hints', personId, before: person[4]?.a ?? [], after: [`research required: ${why(owned[0])}`], reason: 'Replace survey-derived activity dates with a source-specific research hold.' });
}
const proposal = { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, changes };
const candidate = applyDateRepairProposal(extraction, proposal, packet);
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw Error(JSON.stringify(geometry));
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw Error('Replay mismatch');
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const dir = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(dir, { recursive: true });
writeJsonAtomic(path.join(dir, `staged-candidate-${candidateExtractionHash.slice(7, 27)}.json`), { schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter, canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash, proposal, candidateExtractionHash, candidate, validation: { status: 'passed', stats: validation.stats, replay: 'PASS', geometry: 'PASS' }, auditEvidence: { findings: audit.findings } });
console.log(candidateExtractionHash);
