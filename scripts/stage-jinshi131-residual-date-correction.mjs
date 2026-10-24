import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jinshi', chapter = '131';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson('/tmp/jinshi131-fresh-audit.json');
const packet = buildDateAuditPacket(book, chapter);
if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash || audit.extractionHash !== packet.extractionHash) throw new Error('Fresh Jinshi 131 audit is stale or not repairable');
const findingFor = id => audit.findings.find(f => f.items.includes(id));
const wuBefore = extraction.claims[88];
const wuAfter = structuredClone(wuBefore);
delete wuAfter[2].westernYear;
delete wuAfter[2].westernInterval;
delete wuAfter[2].westernBounds;
wuAfter[2].qualitative = 'early Zhengda';
const wangBefore = extraction.claims[111];
const wangAfter = structuredClone(wangBefore);
delete wangAfter[2].unresolved;
delete wangAfter[2].unresolvedReason;
wangAfter[2].qualitative = 'early Zhengda';
const proposal = {
  schemaVersion: 1, kind: 'date-repair-proposal', book, chapter,
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
  author: { name: 'Codex Jinshi 131 residual source-date correction candidate', agentId: 'fresh_jinshi130_audit' },
  changes: [
    { kind: 'replace', id: 'claim-89', before: wuBefore, after: wuAfter, reason: findingFor('claim-89').action },
    { kind: 'hints', personId: 'p041', before: extraction.people.find(x => x[0] === 'p041')[4].a, after: ['AD 1213-1217 (bounded event context only; research required: no life-wide activity is inferred)'], reason: findingFor('hints-p041').action },
    { kind: 'replace', id: 'claim-112', before: wangBefore, after: wangAfter, reason: findingFor('claim-112').action },
    { kind: 'hints', personId: 'p055', before: extraction.people.find(x => x[0] === 'p055')[4].a, after: ['AD 1230'], reason: 'Remove the approval-blocking research hold while retaining Wang Xuan’s separate explicit 正大七年夏 (AD 1230) attestation.' },
  ],
};
if (proposal.changes.length !== 4) throw new Error('Expected exactly four residual repairs');
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
writeJsonAtomic(path.join(directory, candidateFile), { schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter, canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash, auditReportHash: sha256(JSON.stringify(audit)), author: proposal.author, sealedCandidateHash, candidateExtractionHash, proposal, candidate, candidatePacket, validation: { status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats }, auditEvidence: { findings: audit.findings } });
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), { schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter, candidateFile, sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash, sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence: { findings: audit.findings } });
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: proposal.changes.length, stats: validation.stats }));
