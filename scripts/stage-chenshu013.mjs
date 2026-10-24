import fs from 'node:fs';
import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'chenshu';
const chapter = '013';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const finding = audit.findings[0];
const claimIds = finding.items.filter(id => /^claim-\d+$/.test(id));
const personIds = finding.items.filter(id => /^hints-p\d+$/.test(id)).map(id => id.slice('hints-'.length));
if (claimIds.length !== 79 || personIds.length !== 69) throw new Error(`Expected 79 claims and 69 hints, got ${claimIds.length}/${personIds.length}`);
const reason = finding.problem;
const claimByPerson = new Map();
const changes = claimIds.map(id => {
  const before = extraction.claims[Number(id.slice(6)) - 1];
  const after = structuredClone(before);
  claimByPerson.set(before[0], id);
  const container = after[2].dateContext ?? after[2];
  delete container.westernYear;
  delete container.westernInterval;
  delete container.westernBounds;
  container.unresolved = true;
  container.unresolvedReason = reason;
  if (!after[2].dateContext) {
    after[2].event = 'Source-specific service, conflict, title, genealogy, or comparison context retained; no Western personal activity chronology is asserted.';
  }
  return { kind: after[2].dateContext ? 'date-context' : 'replace', id, before, after, reason };
});
for (const personId of personIds) {
  const person = extraction.people.find(row => row[0] === personId);
  if (!person || !claimByPerson.has(personId)) throw new Error(`Unmatched audit hint ${personId}`);
  changes.push({
    kind: 'hints', personId, before: person[4]?.a ?? [],
    after: [`research required: ${reason}`],
    reason: 'Replace synthetic active chronology with the matching source-specific research hold.'
  });
}
const proposal = { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, changes };
const candidate = applyDateRepairProposal(extraction, proposal, packet);
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(JSON.stringify(geometry));
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Replay mismatch');
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
writeJsonAtomic(path.join(directory, `staged-candidate-${candidateExtractionHash.slice(7, 27)}.json`), {
  schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter,
  canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash,
  proposal, candidateExtractionHash, candidate,
  validation: { status: 'passed', stats: validation.stats, replay: 'PASS', geometry: 'PASS' },
  auditEvidence: { findings: audit.findings }
});
console.log(candidateExtractionHash);
