import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Candidate only. This script intentionally never writes the canonical extraction,
// source chapter, audit report, or any published artefact.
const book = 'jiuwudaishi';
const chapter = '011';
const auditCommit = 'c88ba0714c485b51dfed424fa85ff67786210448';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || sha256(JSON.stringify(extraction)) !== audit.extractionHash) {
  throw new Error('Jiuwudaishi 011 residual audit or canonical extraction pin is stale');
}
const finding = audit.findings.find(entry => entry.items.includes('claim-156'));
if (!finding || audit.findings.length !== 1) throw new Error('Expected exactly the claim-156 residual finding');
const before = extraction.claims[155];
if (JSON.stringify(before) !== JSON.stringify([
  'p023', 'attestation',
  { undatedSourceAttestation: true, event: 'The AD 938 order dates the burial operation, not a life-wide attestation for An Chongruan.' },
  'explicit', ['s0048'],
])) throw new Error('claim-156 is not the audited residual state');
const person = extraction.people.find(row => row[0] === 'p023');
if (!person || JSON.stringify(person[4]?.a) !== JSON.stringify(['AD 938'])) {
  throw new Error('p023 no longer has the audited AD 938 discrete hint');
}

// The dated order expressly dispatches An Chongruan. It is therefore a single
// AD 938 personal attestation. It does not say when he was born or died, and it
// remains distinct from the Last Emperor's posthumous reception/burial event.
const after = [
  'p023', 'attestation',
  {
    sourceDate: { text: '晉天福三年', regnalYear: 3 },
    westernYear: { era: 'AD', year: 938, precision: 'year' },
    event: 'Dispatched with the consort for burial; a discrete dated personal assignment, not a life-span inference.',
  },
  'explicit', ['s0048'],
];
const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book, chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit,
  author: {
    name: 'Independent Jiuwudaishi 011 An Chongruan residual date-repair candidate',
    agentId: 'candidate_jiuwudaishi011_an_chongruan_repair',
  },
  changes: [{
    kind: 'replace', id: 'claim-156', before, after,
    reason: 's0048 explicitly dispatches An Chongruan in AD 938. Record that one dated assignment without deriving a lifespan interval; the Last Emperor remains separately classified as a posthumous burial reception.',
  }],
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
const candidatePerson = candidate.people.find(row => row[0] === 'p023');
if (JSON.stringify(candidatePerson[4]?.a) !== JSON.stringify(['AD 938'])) throw new Error('Candidate changed p023 active hint');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const validationSummary = {
  status: 'passed', proposalReplay: 'PASS',
  compactValidation: 'PASS (strict scoped alias-disposition validation)',
  chronologyGeometry: 'PASS',
  exactAtomicScope: 'PASS: exactly claim-156 changed; p023 AD 938 hint retained; no canonical extraction, Chinese source, model, external-primary dossier, or publication output changed.',
  stats: validation.stats,
};
writeJsonAtomic(path.join(directory, candidateFile), {
  schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter,
  canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash,
  auditReportHash: sha256(JSON.stringify(audit)), author: proposal.author,
  sealedCandidateHash, candidateExtractionHash, proposal, candidate, candidatePacket,
  validation: validationSummary, auditEvidence: { findings: audit.findings },
  canonicalMutation: 'NONE', masterMutation: 'NONE', publication: 'candidate-ref-only',
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter,
  candidateFile, sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash,
  sealedCandidateHash, candidateExtractionHash, candidatePacket,
  auditEvidence: { findings: audit.findings },
  requiredReview: 'Independently verify that s0048’s 晉天福三年 order explicitly dispatches An Chongruan, that claim-156 is only a discrete AD 938 personal assignment (not a lifespan interval), that p023 retains exactly AD 938, and that the Last Emperor’s distinct AD 938 posthumous burial reception plus all Zhu Wen/princess external-primary and research-hold chronology are unchanged. Replay the sealed proposal and rerun strict compact validation plus chronology geometry.',
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: proposal.changes.length, stats: validation.stats }));
