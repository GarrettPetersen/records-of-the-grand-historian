import fs from 'node:fs';
import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'hanshu';
const chapter = '004';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const reasonFor = id => audit.findings.find(finding => finding.items.includes(id))?.problem ?? '';
const holdClaims = ['claim-169', 'claim-176', 'claim-179', 'claim-184', 'claim-187'];
const receptionClaims = ['claim-222', 'claim-223', 'claim-224', 'claim-229'];
const changes = [];
for (const id of holdClaims) {
  const before = extraction.claims[Number(id.slice(6)) - 1];
  const after = structuredClone(before);
  delete after[2].westernYear;
  delete after[2].westernInterval;
  after[2].unresolved = true;
  after[2].unresolvedReason = reasonFor(id);
  after[2].event = 'Source-specific relationship or appraisal context retained; no Western personal activity date is asserted.';
  changes.push({ kind: 'replace', id, before, after, reason: reasonFor(id) });
}
for (const id of receptionClaims) {
  const before = extraction.claims[Number(id.slice(6)) - 1];
  changes.push({ kind: 'remove', id, before, reason: reasonFor(id) });
  const value = before[2];
  const posthumous = ['claim-223', 'claim-224'].includes(id);
  changes.push({
    kind: 'add-reception-event',
    after: [before[0], 'event-participation', {
      kind: 'retrospective-reference',
      role: posthumous ? 'honoree' : 'recalled-relative',
      action: posthumous ? 'later posthumous title reference' : 'later kinship reference',
      dateContext: structuredClone(value)
    }, before[3], before[4]],
    reason: 'Preserve the dated later reference as reception context rather than a living-person attestation.'
  });
}
const person = id => extraction.people.find(row => row[0] === id);
changes.push(
  { kind: 'hints', personId: 'p006', before: person('p006')[4].a, after: ['BC 188', 'BC 184'], reason: 'Keep the Former Young Emperor’s own accession and deposition chronology but remove the unsupported BC 187 heir-designation hint.' },
  { kind: 'hints', personId: 'p007', before: person('p007')[4].a, after: [`research required: ${reasonFor('claim-187')}`], reason: 'The dated enfeoffment concerns the nephews, not their elder-father relationship.' },
  { kind: 'hints', personId: 'p026', before: person('p026')[4].a, after: [], reason: 'The retained BC 181 source is a retrospective reference, not Supreme Emperor life activity.' },
  { kind: 'hints', personId: 'p027', before: person('p027')[4].a, after: [], reason: 'The retained BC 181 source is a posthumous title reference, not Marquis Wu’ai life activity.' },
  { kind: 'hints', personId: 'p028', before: person('p028')[4].a, after: [], reason: 'The retained BC 181 source is a posthumous title reference, not Lady Xuan life activity.' },
  { kind: 'hints', personId: 'p033', before: person('p033')[4].a, after: [], reason: 'The retained BC 180 source is a retrospective kinship reference, not King Daohui life activity.' }
);
const proposal = { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, changes };
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
