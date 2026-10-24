import fs from 'node:fs';
import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'chenshu';
const chapter = '032';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const claimIds = [...new Set(audit.findings.flatMap(finding => finding.items).filter(id => /^claim-\d+$/.test(id)))];
const personIds = [...new Set(audit.findings.flatMap(finding => finding.items)
  .filter(id => /^hints-p\d+$/.test(id)).map(id => id.slice('hints-'.length)))];
if (claimIds.length !== 49 || personIds.length !== 49) throw new Error(`Expected 49 claims and hints, got ${claimIds.length}/${personIds.length}`);
const reasonFor = id => audit.findings.find(finding => finding.items.includes(id))?.problem ?? '';
const directYears = new Map([
  ['claim-77', 582], // 後主即位
  ['claim-110', 559], // 世祖即位
  ['claim-117', 566], // 廢帝嗣立
  ['claim-120', 568] // 高宗即位
]);
const eraInterval = new Map([
  ['claim-257', [553, 554]] // 承聖中
]);
const claimForPerson = new Map();
const changes = claimIds.map(id => {
  const before = extraction.claims[Number(id.slice(6)) - 1];
  const after = structuredClone(before);
  const reason = reasonFor(id);
  claimForPerson.set(before[0], id);
  delete after[2].westernYear;
  delete after[2].westernInterval;
  delete after[2].westernBounds;
  if (directYears.has(id)) {
    after[2].westernYear = { era: 'AD', year: directYears.get(id), precision: 'year' };
    after[2].event = 'A discrete accession year is retained from the source wording.';
  } else if (eraInterval.has(id)) {
    const [start, end] = eraInterval.get(id);
    after[2].westernInterval = {
      start: { era: 'AD', year: start, precision: 'year' },
      end: { era: 'AD', year: end, precision: 'year' }
    };
    after[2].event = 'The source says mid-Chengsheng; the regnal-era interval is retained without an invented point date.';
  } else {
    after[2].unresolved = true;
    after[2].unresolvedReason = reason;
    after[2].event = 'Source-specific allusion, title, genealogy, relationship, or undated court context retained; no Western personal activity chronology is asserted.';
  }
  return { kind: 'replace', id, before, after, reason };
});

for (const personId of personIds) {
  const person = extraction.people.find(row => row[0] === personId);
  const claimId = claimForPerson.get(personId);
  if (!person || !claimId) throw new Error(`Unmatched audit hint ${personId}`);
  const direct = directYears.get(claimId);
  const interval = eraInterval.get(claimId);
  const after = direct ? [`AD ${direct}`] : interval ? [`AD ${interval[0]}-${interval[1]}`]
    : [`research required: ${reasonFor(claimId)}`];
  changes.push({
    kind: 'hints', personId, before: person[4]?.a ?? [], after,
    reason: direct || interval
      ? 'Replace the unsupported reign-wide hint with the source-grounded discrete or bounded chronology.'
      : 'Replace borrowed chronology with a source-specific research hold.'
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
