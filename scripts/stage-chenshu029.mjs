import fs from 'node:fs';
import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'chenshu';
const chapter = '029';
const claimId = 'claim-207';
const personId = 'p072';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const reason = audit.findings.find(finding => finding.items.includes(claimId))?.problem;
if (!reason) throw new Error(`Missing audit finding for ${claimId}`);

const before = extraction.claims[Number(claimId.slice(6)) - 1];
const after = structuredClone(before);
delete after[2].westernYear;
delete after[2].westernInterval;
after[2].unresolved = true;
after[2].unresolvedReason = reason;
after[2].event = 'Source-specific collation note retained; no Western personal activity interval is asserted.';
const person = extraction.people.find(row => row[0] === personId);
if (!person) throw new Error(`Missing ${personId}`);
const proposal = {
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  changes: [
    { kind: 'replace', id: claimId, before, after, reason },
    {
      kind: 'hints',
      personId,
      before: person[4]?.a ?? [],
      after: [`research required: ${reason}`],
      reason: 'Replace borrowed modern active chronology with a source-specific collation hold.'
    }
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
writeJsonAtomic(path.join(directory, `staged-candidate-${candidateExtractionHash.slice(7, 27)}.json`), {
  schemaVersion: 1,
  kind: 'date-repair-candidate-handoff',
  book,
  chapter,
  canonicalSourceHash: packet.sourceHash,
  canonicalExtractionHash: packet.extractionHash,
  proposal,
  candidateExtractionHash,
  candidate,
  validation: { status: 'passed', stats: validation.stats, replay: 'PASS', geometry: 'PASS' },
  auditEvidence: { findings: audit.findings }
});
console.log(candidateExtractionHash);
