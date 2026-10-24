import fs from 'node:fs';
import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'hanshu';
const chapter = '002';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const finding = audit.findings.find(item => item.items.includes('claim-50'));
if (!finding) throw new Error('Missing Liu Bo audit finding');
const claim50 = extraction.claims[49];
const claim51 = extraction.claims[50];
const person = extraction.people.find(row => row[0] === 'p016');
const reception = ['p016', 'event-participation', {
  kind: 'retrospective-reference', role: 'honoree', action: 'posthumously-granted-title',
  title: { en: 'Lord Wu’ai', zh: '武哀侯' },
  dateContext: { sourceDate: { text: '五年春正月' }, westernYear: { era: 'BC', year: 202, precision: 'year' } }
}, 'explicit', ['s0029']];
const proposal = {
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  changes: [
    { kind: 'remove', id: 'claim-50', before: claim50, reason: finding.problem },
    { kind: 'remove', id: 'claim-51', before: claim51, reason: finding.problem },
    { kind: 'add-reception-event', after: reception, reason: 'Preserve the BC 202 honor as a posthumous commemoration, not a Liu Bo life attestation.' },
    { kind: 'hints', personId: 'p016', before: person[4]?.a ?? [], after: [], reason: 'The person has only the retained posthumous reception, so BC 202 is not an active-life hint.' }
  ]
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(JSON.stringify(geometry));
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Replay mismatch');
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
writeJsonAtomic(path.join(directory, `staged-candidate-${candidateExtractionHash.slice(7, 27)}.json`), { schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter, canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash, proposal, candidateExtractionHash, candidate, validation: { status: 'passed', stats: validation.stats, replay: 'PASS', geometry: 'PASS' }, auditEvidence: { findings: audit.findings } });
console.log(candidateExtractionHash);
