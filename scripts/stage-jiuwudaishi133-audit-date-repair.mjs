import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '133';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash || audit.extractionHash !== packet.extractionHash || audit.findings.length !== 4) {
  throw new Error('Jiuwudaishi 133 initial audit is stale or not the expected four-group repair state');
}
const findingFor = id => audit.findings.find(finding => finding.items.includes(id));
for (const id of ['claim-394', 'p113', 'claim-541', 'p170', 'claim-666', 'p217', 'p224']) {
  if (!findingFor(id)) throw new Error(`Missing audit finding for ${id}`);
}

const changes = [];
const replaceClaimDateContext = (claimId, expectedPerson, expectedPredicate, expectedText, reason) => {
  const before = extraction.claims[Number(claimId.slice(6)) - 1];
  if (!before || before[0] !== expectedPerson || before[1] !== expectedPredicate || before[2]?.dateContext?.sourceDate?.text !== expectedText) {
    throw new Error(`${claimId} is not the audited source-overprecision record`);
  }
  const after = structuredClone(before);
  delete after[2].dateContext;
  changes.push({ kind: 'replace', id: claimId, before, after, reason });
};
const replaceHint = (personId, expectedHints, removedHint, after, reason) => {
  const person = extraction.people.find(row => row[0] === personId);
  const before = person?.[4]?.a;
  if (!person || JSON.stringify(before) !== JSON.stringify(expectedHints)) throw new Error(`${personId} active-date hints drifted from audit input`);
  if (!before.includes(removedHint)) throw new Error(`${personId} lacks expected synthetic hint`);
  changes.push({ kind: 'hints', personId, before, after, reason });
};

replaceClaimDateContext(
  'claim-394', 'p113', 'death', '希範卒',
  'The sentence gives Ma Xifan’s death and age but no Western chronology. Remove only the imported AD 947 lower bound, retaining the Chinese death narrative and source evidence as undated.'
);
replaceHint(
  'p113', ['Tianfu AD 936-944', 'died age 49 ~AD 947'], 'died age 49 ~AD 947',
  ['Tianfu AD 936-944'],
  'Remove the death hint derived from the unsupported AD 947 lower bound. Retain the independent Tianfu-era activity hint.'
);

replaceClaimDateContext(
  'claim-541', 'p170', 'event-participation', '乾寧前',
  'The Luoping-kingship sentence is undated in this source. Remove the fabricated “乾寧前” date label and its unsupported AD 897 upper bound, retaining Dong Chang’s undated political claim.'
);
replaceHint(
  'p170', ['Jingfu–Qianning AD 892-897'], 'Jingfu–Qianning AD 892-897',
  ['AD 870-980 (separate chapter attestation; Luoping claim undated)'],
  'Replace the synthetic Jingfu–Qianning hint with the separate, retained chapter-attestation range; the Luoping-kingship sentence itself remains explicitly undated.'
);

replaceClaimDateContext(
  'claim-666', 'p217', 'event-participation', '舉族入朝',
  'The submission sentence supplies no Western date. Remove only the imported AD 978 lower bound, retaining the undated submission event and its source evidence.'
);
replaceHint(
  'p217', ['Qianyou 1 AD 948', 'Jianlong AD 960', 'submitted to Song ending kingdom'], 'submitted to Song ending kingdom',
  ['Qianyou 1 AD 948', 'Jianlong AD 960'],
  'Remove the final-submission hint derived from an unsupported imported date, while retaining the two independently sourced regnal-year hints.'
);
replaceHint(
  'p224', ['Song-era composition reflecting AD 960+ reunification'], 'Song-era composition reflecting AD 960+ reunification',
  ['AD 960+ narrative perspective; not a biographical activity date'],
  'The generic historian voice is not a biographical subject. Replace the false personal activity hint with an explicit non-biographical perspective label, without recasting the chapter perspective as a life event.'
);

if (changes.length !== 7) throw new Error(`Expected exactly seven audited repair records, got ${changes.length}`);
const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit: 'a7660111a95d8760303988f9a89eb756a149212e',
  author: { name: 'Codex Jiuwudaishi 133 source-faithful chronology repair candidate', agentId: 'candidate_jwd133' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
if (candidate.people.length !== extraction.people.length || candidate.claims.length !== extraction.claims.length) throw new Error('Repair changed record cardinality');
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
  validation: {
    status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS',
    exactAtomicScope: 'PASS: three date-context removals and four paired hint removals; no people, claim, or source cardinality changes.',
    preservedEvidence: 'PASS: all three narrative claims retain their original predicate, values, evidence, and Chinese source wording without imported Western chronology.',
    stats: validation.stats,
  },
  auditEvidence: { findings: audit.findings },
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter,
  candidateFile, sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash,
  sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence: { findings: audit.findings },
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
