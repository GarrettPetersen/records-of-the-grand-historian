import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiutangshu';
const chapter = '072';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const wudeClaims = [35, 55, 61, 62, 64, 65, 66, 67, 68, 111, 112, 113, 114, 115, 116, 117, 123, 124, 127, 128, 131, 132, 133, 134, 137, 138, 140, 142, 173, 175]
  .map(number => `claim-${number}`);
const headingClaims = [38, 40, 42, 43, 44, 45].map(number => `claim-${number}`);
const undatedAttestations = new Map([
  ['claim-1056', '“卒官” records only that the official died in office. It supplies no calendar-bearing event from which an AD 630–639 death interval can be inferred.'],
  ['claim-1145', 'The literary citation of Fan Ye’s Book of the Later Han is retained as an undated source attestation, not as evidence that the cited subject was active in AD 432–445.'],
  ['claim-1173', 'The martial appraisal “叔寶善用馬槊” is retained as an undated source attestation; it supplies no calendar-bearing personal event for an AD 618–621 interval.'],
]);
const auditedClaims = new Set(audit.itemChecks.filter(check => check.verdict === 'incorrect').map(check => check.id));
const expectedClaims = new Set([...wudeClaims, ...headingClaims, ...undatedAttestations.keys()]);
if (audit.status !== 'needs-revision' || auditedClaims.size !== 39 || auditedClaims.size !== expectedClaims.size ||
    [...expectedClaims].some(id => !auditedClaims.has(id))) {
  throw new Error('Jiutangshu 072 audit scope is not the expected 39 incorrect temporal claims');
}
const findingFor = id => audit.findings.find(finding => finding.items.includes(id));
const claimFor = id => {
  const claim = extraction.claims[Number(id.slice(6)) - 1];
  if (!claim) throw new Error(`Missing ${id}`);
  return claim;
};

function replaceWudeInterval(value, id) {
  if (!value || typeof value !== 'object') return false;
  if (value.westernInterval?.start?.era === 'AD' && value.westernInterval?.start?.year === 620 &&
      value.westernInterval?.end?.era === 'AD' && value.westernInterval?.end?.year === 621) {
    delete value.westernInterval;
    value.westernYear = { era: 'AD', year: 620, precision: 'year' };
    return true;
  }
  const replacements = Object.values(value).map(child => replaceWudeInterval(child, id));
  if (replacements.filter(Boolean).length > 1) throw new Error(`${id} has multiple AD 620–621 containers`);
  return replacements.some(Boolean);
}

const changes = [];
for (const id of wudeClaims) {
  const before = claimFor(id);
  const after = structuredClone(before);
  if (!replaceWudeInterval(after[2], id)) throw new Error(`${id} is not the audited AD 620–621 expansion`);
  changes.push({
    kind: 'replace', id, before, after,
    reason: '武德三年 is Tang Wude 3 (AD 620), and 是日 inherits that same dated episode. The source supports AD 620, not an AD 620–621 personal interval.',
  });
}
for (const id of headingClaims) {
  const before = claimFor(id);
  if (before[1] !== 'attestation' || before[2]?.sourceDate?.text !== '列傳第十八標題' || !before[2]?.westernInterval) {
    throw new Error(`${id} is not the audited heading-only temporal attestation`);
  }
  const after = structuredClone(before);
  after[2] = {
    undatedSourceAttestation: true,
    event: 'The biography heading identifies this named individual but supplies no calendar-bearing personal event.',
  };
  changes.push({
    kind: 'replace', id, before, after,
    reason: 'Remove the heading-derived AD 617–622 temporal assertion. The heading is retained only as an explicitly undated name attestation, because it states no dated personal event.',
  });
}
for (const [id, event] of undatedAttestations) {
  const before = claimFor(id);
  if (before[1] !== 'attestation' || !Object.keys(before[2]).some(key => key.startsWith('western'))) {
    throw new Error(`${id} is not the audited unsupported dated attestation`);
  }
  const after = structuredClone(before);
  after[2] = { undatedSourceAttestation: true, event };
  changes.push({ kind: 'replace', id, before, after, reason: event });
}

const hintReplacements = new Map([
  ['p001', ['AD 617-618', 'AD 620', 'AD 621', 'AD 622']],
  ['p004', ['No date-bearing personal event is asserted by the biography heading.']],
  ['p005', ['No date-bearing personal event is asserted by the biography heading.']],
  ['p006', ['No date-bearing personal event is asserted by the biography heading.']],
  ['p007', ['No date-bearing personal event is asserted by the biography heading.']],
  ['p014', ['AD 620', 'AD 621', 'AD 622']],
  ['p017', ['AD 620']],
  ['p018', ['AD 620', 'AD 621']],
  ['p019', ['AD 620']],
  ['p020', ['AD 620']],
  ['p021', ['AD 620']],
  ['p022', ['AD 620']],
  ['p023', ['AD 620']],
  ['p141', ['No calendar-bearing personal event is asserted by this literary citation.']],
  ['p144', ['No calendar-bearing personal event is asserted by this martial appraisal.']],
]);
for (const [personId, after] of hintReplacements) {
  const person = extraction.people.find(row => row[0] === personId);
  if (!person || !Array.isArray(person[4]?.a)) throw new Error(`${personId} lacks active-date hints`);
  changes.push({
    kind: 'hints', personId, before: person[4].a, after,
    reason: 'Synchronize active-date hints with the repaired source-backed chronology and remove the unsupported derived range.',
  });
}
if (changes.length !== 54 || new Set(changes.map(change => change.kind === 'hints' ? `hints-${change.personId}` : change.id)).size !== changes.length) {
  throw new Error(`Expected 54 uniquely scoped operations, got ${changes.length}`);
}

const proposal = {
  schemaVersion: 1, kind: 'date-repair-proposal', book, chapter,
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
  auditCommit: 'e1c29aac67a053c85077e15c48705efbc3370ba5',
  author: { name: 'Codex Jiutangshu 072 source-faithful chronology repair candidate', agentId: 'candidate_jiutangshu072_date_repair' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);
const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
writeJsonAtomic(path.join(directory, candidateFile), {
  schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter,
  canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash,
  auditReportHash: sha256(JSON.stringify(audit)), author: proposal.author,
  sealedCandidateHash, candidateExtractionHash, proposal, candidate, candidatePacket,
  validation: { status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats },
  auditEvidence: { findings: audit.findings }, canonicalMutation: 'NONE', masterMutation: 'NONE', publication: 'candidate-ref-only',
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter,
  candidateFile, sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash,
  sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence: { findings: audit.findings },
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
