import fs from 'node:fs';
import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'chenshu';
const chapter = '027';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const claimIds = ['claim-209', 'claim-792', 'claim-860'];
const personIds = ['p031', 'p104'];
const reasonFor = id => audit.findings.find(finding => finding.items.includes(id))?.problem ?? '';

const changes = claimIds.map(id => {
  const before = extraction.claims[Number(id.slice(6)) - 1];
  const after = structuredClone(before);
  const reason = reasonFor(id);
  if (before[1] === 'event-participation') {
    delete after[2].dateContext.westernYear;
    delete after[2].dateContext.westernInterval;
    after[2].dateContext.unresolved = true;
    after[2].dateContext.unresolvedReason = reason;
    return { kind: 'date-context', id, before, after, reason };
  }
  delete after[2].westernYear;
  delete after[2].westernInterval;
  after[2].unresolved = true;
  after[2].unresolvedReason = reason;
  after[2].event = 'Source-specific rhetorical or collation context retained; no Western activity interval is asserted.';
  return { kind: 'replace', id, before, after, reason };
});

for (const personId of personIds) {
  const person = extraction.people.find(row => row[0] === personId);
  const claimId = claimIds.find(id => extraction.claims[Number(id.slice(6)) - 1][0] === personId);
  changes.push({
    kind: 'hints',
    personId,
    before: person[4]?.a ?? [],
    after: [`research required: ${reasonFor(claimId)}`],
    reason: 'Replace borrowed external active chronology with a source-specific research hold.'
  });
}

const proposal = { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, changes };
const candidate = applyDateRepairProposal(extraction, proposal, packet);
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(JSON.stringify(geometry));
const candidateExtractionHash = sha256(JSON.stringify(candidate));
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Replay mismatch');
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
