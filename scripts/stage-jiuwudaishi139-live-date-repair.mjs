import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '139';
const freshAuditCommit = '55138bd4a05ccfab002b305164db31810eae5c37';
const freshAuditReportHash = 'sha256:cc3fac5813484ad88fe53372753c9c9c443dddb00ace3663a8ef60298401e358';
const expectedSourceHash = 'sha256:ae4fb524069706b4c6fd15d02c282667c2b239610a320b1ced6659dc0e1afa04';
const expectedExtractionHash = 'sha256:e6d9785a3db466d42d28ea577f4433d6e5e647e2d9cc7b319f5f763cffa63cd3';

const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
if (packet.sourceHash !== expectedSourceHash || packet.extractionHash !== expectedExtractionHash) {
  throw new Error(`Live JWD139 input drifted: ${packet.sourceHash} / ${packet.extractionHash}`);
}

const claim26 = extraction.claims[25];
const hanGaozu = extraction.people.find(person => person[0] === 'p004');
const jinGaozu = extraction.people.find(person => person[0] === 'p008');
if (!claim26 || claim26[0] !== 'p004' || claim26[1] !== 'attestation' ||
    claim26[2]?.sourceDate?.text !== '漢高祖末年' || !claim26[2]?.westernInterval ||
    JSON.stringify(hanGaozu?.[4]?.a) !== JSON.stringify(['BC 196-195']) ||
    JSON.stringify(jinGaozu?.[4]?.a) !== JSON.stringify(['AD 937-943'])) {
  throw new Error('JWD139 live inputs do not match the independently audited three-item repair scope');
}

const retrospectiveClaim = structuredClone(claim26);
delete retrospectiveClaim[2].westernYear;
delete retrospectiveClaim[2].westernInterval;
delete retrospectiveClaim[2].westernBounds;
delete retrospectiveClaim[2].sourceDate;
retrospectiveClaim[2].undatedSourceAttestation = true;
retrospectiveClaim[2].event = 'The source retrospectively invokes an eclipse from 漢高祖末年; it preserves the allusion but supplies no personal activity chronology for Han Gaozu.';

const changes = [
  {
    kind: 'replace',
    id: 'claim-26',
    before: claim26,
    after: retrospectiveClaim,
    reason: 'The source invokes 漢高祖末年 only as a retrospective eclipse comparison, not as evidence of Han Gaozu personal activity in BC 196–195.',
  },
  {
    kind: 'hints',
    personId: 'p004',
    before: hanGaozu[4].a,
    after: [],
    reason: 'After the retrospective attestation loses its invented activity interval, this chapter has no personal active-date evidence for Han Gaozu.',
  },
  {
    kind: 'hints',
    personId: 'p008',
    before: jinGaozu[4].a,
    after: ['AD 937-941'],
    reason: 'This chapter dates Jin Gaozu in Tianfu 2 and Tianfu 6 (AD 937 and 941), but supplies no evidence for the inherited AD 943 endpoint.',
  },
];
if (changes.length !== 3) throw new Error('JWD139 candidate must contain exactly three independently audited repairs');

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: { name: 'Codex JWD139 fresh-audit date-repair candidate', agentId: 'candidate_jwd139_live_repairs' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

const candidateExtractionHash = sha256(JSON.stringify(candidate));
const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const auditEvidence = {
  freshAuditCommit,
  freshAuditReportHash,
  sourceHash: expectedSourceHash,
  extractionHash: expectedExtractionHash,
  findings: [
    {
      items: ['claim-26', 'hints-p004'],
      problem: 'The source is a retrospective comparison with an eclipse from 漢高祖末年. It does not attest the subject’s contemporaneous activity and cannot support an active-date range.',
      action: 'Preserve the historical allusion as retrospective context, but remove its life/activity chronology and derived active-date hint.',
    },
    {
      items: ['hints-p008'],
      problem: 'Jin Gaozu’s AD 943 active-hint endpoint is not supported by this chapter; dated records are Tianfu 2 (AD 937) and Tianfu 6 (AD 941).',
      action: 'Replace the inherited hint with chronology bounded only by the dated chapter evidence, without inventing a later AD 943 endpoint.',
    },
  ],
};
writeJsonAtomic(path.join(directory, candidateFile), {
  schemaVersion: 1,
  kind: 'date-repair-candidate-handoff',
  book,
  chapter,
  canonicalSourceHash: packet.sourceHash,
  canonicalExtractionHash: packet.extractionHash,
  auditReportHash: freshAuditReportHash,
  author: proposal.author,
  sealedCandidateHash,
  candidateExtractionHash,
  proposal,
  candidate,
  candidatePacket,
  validation: {
    status: 'passed',
    proposalReplay: 'PASS',
    compactValidation: 'PASS',
    chronologyGeometry: 'PASS',
    stats: validation.stats,
  },
  auditEvidence,
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1,
  kind: 'independent-staged-date-repair-review-packet',
  book,
  chapter,
  candidateFile,
  sourceHash: packet.sourceHash,
  originalExtractionHash: packet.extractionHash,
  sealedCandidateHash,
  candidateExtractionHash,
  candidatePacket,
  auditEvidence,
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
