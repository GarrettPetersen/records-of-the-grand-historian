import fs from 'node:fs';
import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'beiqishu';
const chapter = '013';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const repairIds = ['claim-62', 'claim-69', 'claim-97', 'claim-99', 'hints-p004', 'hints-p010', 'hints-p016', 'hints-p026', 'hints-p030'];
const findingFor = id => audit.findings.find(finding => finding.items.includes(id));
if (repairIds.some(id => !findingFor(id))) throw new Error('Fresh audit target missing');
const claimChanges = new Map();

for (const id of repairIds.filter(id => id.startsWith('claim-'))) {
  const before = extraction.claims[Number(id.slice(6)) - 1];
  const after = structuredClone(before);
  const reason = findingFor(id).problem;
  delete after[2].westernYear;
  delete after[2].westernInterval;
  delete after[2].westernBounds;
  if (id === 'claim-69') {
    after[2].westernYear = { era: 'AD', year: 550, precision: 'year' };
    after[2].event = 'The accession and beginning-of-Tianbao appointment provide a discrete AD 550 event, not a reign-wide activity span.';
  } else if (id === 'claim-97') {
    after[2].sourceDate = { text: '少年時因獵墜馬，傷腰腳，終於長安' };
    after[2].unresolved = true;
    after[2].unresolvedReason = 'The cited Chinese narrates Gao Zhengxin’s succession, childhood injury, and undated death at Chang’an; it does not contain Tian Tong wording or a personal temporal endpoint.';
    after[2].event = 'Source-specific undated narrative context retained; no Western personal date or bound is asserted.';
  } else {
    after[2].unresolved = true;
    after[2].unresolvedReason = reason;
    after[2].event = 'Source-specific undated narrative context retained; no Western personal activity interval is asserted.';
  }
  claimChanges.set(id, { kind: 'replace', id, before, after, reason });
}
const hintValues = new Map([
  ['hints-p004', ['AD 577', 'AD 581-600']],
  ['hints-p010', ['AD 555']],
  ['hints-p016', ['AD 550']],
  ['hints-p026', ['research required: The cited Chinese narrates Gao Zhengxin’s succession, childhood injury, and undated death at Chang’an; it does not contain Tian Tong wording or a personal temporal endpoint.']],
  ['hints-p030', [`research required: ${findingFor('hints-p030').problem}`]]
]);
const hintChanges = [...hintValues].map(([id, after]) => {
  const personId = id.slice(6);
  const person = extraction.people.find(row => row[0] === personId);
  if (!person) throw new Error(`Missing ${personId}`);
  return { kind: 'hints', personId, before: person[4]?.a ?? [], after, reason: findingFor(id).problem };
});
const proposal = { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, changes: [...claimChanges.values(), ...hintChanges] };
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
