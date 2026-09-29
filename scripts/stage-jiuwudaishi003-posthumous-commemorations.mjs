import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '003';
const auditedClaims = [
  ['claim-294', 'p038', '開平元年'],
  ['claim-295', 'p040', '開平元年'],
  ['claim-296', 'p042', '開平元年'],
  ['claim-354', 'p045', '上諡曰文穆皇帝，廟號烈祖'],
  ['claim-355', 'p046', '追諡文惠皇后'],
  ['claim-620', 'p074', '七月己亥'],
  ['claim-776', 'p093', '十二月辛亥'],
  ['claim-791', 'p094', '十二月辛亥'],
];

const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const finding = audit.findings.find(entry =>
  entry.items?.length === 16 && auditedClaims.every(([id]) => entry.items.includes(id)));
if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || audit.findings.length !== 1 || !finding) {
  throw new Error('Jiuwudaishi 003 audit is stale or does not contain the exact eight-claim reception finding');
}

const changes = [];
for (const [id, personId, sourceDate] of auditedClaims) {
  const index = Number(id.slice(6)) - 1;
  const before = extraction.claims[index];
  if (!before || before[0] !== personId || before[1] !== 'event-participation' ||
      before[2]?.kind !== 'ritual' || before[2]?.role !== 'honoree' ||
      before[2]?.dateContext?.sourceDate?.text !== sourceDate || !Array.isArray(before[4]) || !before[4].length) {
    throw new Error(`${id} drifted from the audited later-honors claim`);
  }
  const after = structuredClone(before);
  after[2].kind = 'posthumous-commemoration';
  after[2].receptionType = 'posthumous';
  changes.push({
    kind: 'remove',
    id,
    before,
    reason: `Remove ${id}'s ordinary ritual-participant classification. The source date remains the later commemoration date, not ${personId}'s personal activity.`,
  });
  changes.push({
    kind: 'add-reception-event',
    after,
    reason: `Restore ${id}'s exact source evidence as a posthumous commemoration: retain the honoree, action, ceremony date, place where present, certainty, and source units.`,
  });
}

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit: 'c4161495ba39ad38cd0e99cc3e6a645df46a9dd0',
  author: {
    name: 'Codex Jiuwudaishi 003 posthumous-commemoration repair candidate',
    agentId: 'candidate_jiuwudaishi003_posthumous_repair',
  },
  changes,
};

const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
if (candidate.people.length !== extraction.people.length || candidate.claims.length !== extraction.claims.length) {
  throw new Error('Reception reclassification changed person or claim cardinality');
}
for (const [id, personId, sourceDate] of auditedClaims) {
  const oldIndex = Number(id.slice(6)) - 1;
  if (candidate.claims.some(claim => JSON.stringify(claim) === JSON.stringify(extraction.claims[oldIndex]))) {
    throw new Error(`${id}'s ordinary ritual-participation claim was retained`);
  }
  const restored = candidate.claims.filter(claim => claim[0] === personId && claim[1] === 'event-participation' &&
    claim[2]?.kind === 'posthumous-commemoration' && claim[2]?.receptionType === 'posthumous' &&
    claim[2]?.dateContext?.sourceDate?.text === sourceDate);
  if (restored.length !== 1) throw new Error(`${id} did not produce exactly one posthumous reception event`);
}
for (const personId of auditedClaims.map(([, id]) => id)) {
  const original = extraction.people.find(person => person[0] === personId);
  const repaired = candidate.people.find(person => person[0] === personId);
  if (JSON.stringify(original?.[4]?.a) !== JSON.stringify(repaired?.[4]?.a)) {
    throw new Error(`${personId} active-date hints changed even though none encode the later ceremony date`);
  }
}

const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), {
  strictAliasDispositions: true,
});
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const validationSummary = {
  status: 'passed',
  proposalReplay: 'PASS',
  compactValidation: 'PASS (strict scoped alias-disposition validation)',
  chronologyGeometry: 'PASS',
  exactAtomicScope: 'PASS: eight audited ordinary ritual claims were removed and re-added as posthumous commemoration events; no other claim, person, source, or model record changed.',
  preservedEvidence: 'PASS: every replacement retains its original honoree, action, ceremony date, place where present, certainty, and source units; all existing active-date hints remain unchanged because none carried a 907/908 ceremony date.',
  stats: validation.stats,
};
writeJsonAtomic(path.join(directory, candidateFile), {
  schemaVersion: 1,
  kind: 'date-repair-candidate-handoff',
  book,
  chapter,
  canonicalSourceHash: packet.sourceHash,
  canonicalExtractionHash: packet.extractionHash,
  auditReportHash: sha256(JSON.stringify(audit)),
  author: proposal.author,
  sealedCandidateHash,
  candidateExtractionHash,
  proposal,
  candidate,
  candidatePacket,
  validation: validationSummary,
  auditEvidence: { findings: audit.findings },
  canonicalMutation: 'NONE',
  masterMutation: 'NONE',
  publication: 'candidate-ref-only',
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
  auditEvidence: { findings: audit.findings },
  requiredReview: 'Verify all eight source passages and confirm that each 907/908 ceremony is attributed as posthumous reception rather than a life event; independently re-run replay, compact validation, and chronology geometry.',
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
