import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '130';
const auditCommit = 'bd243e417f45f0c587503b1859ba48dba7c7a5af';
const auditPath = path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`);
const historyDirectory = path.join(PEOPLE_DIR, 'date-audit-history', book, chapter);
const importedAudit = JSON.parse(execFileSync('git', ['show', `${auditCommit}:data/people/date-audits/${book}/${chapter}.json`], { encoding: 'utf8' }));
const importedAuditHash = sha256(JSON.stringify(importedAudit));
const currentAudit = readJson(auditPath);
const currentAuditHash = sha256(JSON.stringify(currentAudit));
const expectedPriorAuditHash = 'sha256:3221f00e9ed0b3605ee3fdfaf253857ca12b257005b34192daf00d52e6991b66';

if (importedAuditHash !== 'sha256:2690e8cbe11fe70306e014eb02a35ec2f239db72259e3b1d5a5d6f3616f46dba' ||
    importedAudit.status !== 'needs-revision' || importedAudit.extractionHash !== 'sha256:35fcb811176c54d508d2ebcd33e45653e41db24bd0c11394a1d9803a4244e80a' ||
    importedAudit.findings.length !== 2) {
  throw new Error('The pinned fresh JWD130 audit is not the expected two-group residual report');
}
if (currentAuditHash === expectedPriorAuditHash) {
  const archivedPath = path.join(historyDirectory, `${expectedPriorAuditHash.slice(7)}.json`);
  if (fs.existsSync(archivedPath) && sha256(JSON.stringify(readJson(archivedPath))) !== expectedPriorAuditHash) {
    throw new Error('Existing JWD130 audit-history artifact has unexpected content');
  }
  fs.mkdirSync(historyDirectory, { recursive: true });
  if (!fs.existsSync(archivedPath)) writeJsonAtomic(archivedPath, currentAudit);
  writeJsonAtomic(auditPath, importedAudit);
} else if (currentAuditHash !== importedAuditHash) {
  throw new Error('Current JWD130 audit is neither the preserved prior report nor the pinned fresh audit');
}

const audit = readJson(auditPath);
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
if (packet.extractionHash !== audit.extractionHash || packet.extractionHash !== 'sha256:35fcb811176c54d508d2ebcd33e45653e41db24bd0c11394a1d9803a4244e80a') {
  throw new Error('Fresh audit does not pin the canonical post-Guangshun-2 extraction');
}

const findingOne = audit.findings.find(finding => JSON.stringify(finding.items) === JSON.stringify(['claim-94', 'hints-p038']));
const findingTwoItems = ['claim-95', 'hints-p040', 'claim-102', 'hints-p045', 'claim-144', 'claim-180', 'claim-181', 'claim-182'];
const findingTwo = audit.findings.find(finding => JSON.stringify(finding.items) === JSON.stringify(findingTwoItems));
if (!findingOne || !findingTwo) throw new Error('Fresh JWD130 audit does not identify the exact ten residual items');

const year951 = { era: 'AD', year: 951, precision: 'year' };
const year952 = { era: 'AD', year: 952, precision: 'year' };
const year954 = { era: 'AD', year: 954, precision: 'year' };
const changes = [];
const claim = id => extraction.claims[Number(id.slice(6)) - 1];
const replace = (id, expected, mutate, reason) => {
  const before = claim(id);
  if (!before || JSON.stringify(before) !== JSON.stringify(expected)) throw new Error(`${id} is not the pinned residual input`);
  const after = structuredClone(before);
  mutate(after);
  changes.push({ kind: 'replace', id, before, after, reason });
};

replace('claim-94', ['p038', 'attestation', { sourceDate: { text: '周太祖時' }, westernYear: year951 }, 'explicit-event-contextual-date', ['s0109']], after => {
  delete after[2].westernYear;
  after[2].westernInterval = { start: year951, end: year954 };
}, '「周太祖時」 identifies Guo Wei’s full AD 951–954 reign, not a point year; preserve the source wording and use only that supported reign interval.');

for (const [id, personId, sourceDate, units] of [
  ['claim-95', 'p040', '高祖平兗州後', ['s0138']],
  ['claim-102', 'p045', '慕容彥超謀大逆', ['s0153']],
]) {
  replace(id, [personId, 'attestation', { sourceDate: { text: sourceDate }, westernYear: year951 }, 'explicit-event-contextual-date', units], after => {
    after[2].westernYear = year952;
  }, 'The cited Yanzhou campaign and its immediate aftermath are Guangshun 2 (AD 952), not AD 951.');
}

replace('claim-144', ['p039', 'attribution', { kind: 'dream-announcement', role: 'speaker', otherPersonId: 'p011', dateContext: { sourceDate: { text: '高祖親征兗州' }, westernYear: year951 } }, 'explicit', ['s0127', 's0132']], after => {
  after[2].dateContext.westernYear = year952;
}, 'The temple dream belongs to Gaozu’s Guangshun 2 (AD 952) Yanzhou campaign; retain its nested reception context without asserting a life event for its honoree.');

for (const [id, personId, action, replacementAction, units] of [
  ['claim-180', 'p039', 'appeared in the later AD 951 Qufu temple-dream reception context', 'appeared in the later AD 952 Qufu temple-dream reception context', ['s0132']],
  ['claim-181', 'p046', 'received a posthumous AD 951 honor after Taizu pacified Yanzhou', 'received a posthumous AD 952 honor after Taizu pacified Yanzhou', ['s0159']],
  ['claim-182', 'p041', 'named alongside Cui Zhoudu in the AD 951 posthumous honor', 'named alongside Cui Zhoudu in the AD 952 posthumous honor', ['s0159']],
]) {
  const before = [personId, 'event-participation', { kind: 'posthumous-commemoration', receptionType: 'posthumous', role: 'honoree', action }, 'explicit', units];
  if (JSON.stringify(claim(id)) !== JSON.stringify(before)) throw new Error(`${id} is not the pinned posthumous-reception input`);
  // Action prose is deliberately non-temporal claim content.  The date-repair
  // contract forbids mutating it in place, so replace this auditable reception
  // record as a remove-plus-add-reception-event pair instead of bypassing that
  // safety boundary.
  changes.push({ kind: 'remove', id, before, reason: 'Remove the reception record whose action text incorrectly says AD 951; a separately classified AD 952 replacement is added from the same cited source unit.' });
  changes.push({ kind: 'add-reception-event', after: [personId, 'event-participation', { kind: 'posthumous-commemoration', receptionType: 'posthumous', role: 'honoree', action: replacementAction }, 'explicit', units], reason: 'Re-add the same explicitly posthumous reception with the source-supported Guangshun 2 (AD 952) Yanzhou chronology; this remains reception, not life activity.' });
}

for (const [personId, before, after, reason] of [
  ['p038', ['AD 951'], ['AD 951–954'], 'The sole hint derives from 「周太祖時」 and must preserve Guo Wei’s full AD 951–954 reign interval rather than a point year.'],
  ['p040', ['AD 951'], ['AD 952'], 'Kong Renyu’s post-pacification appointment follows the Guangshun 2 (AD 952) Yanzhou campaign.'],
  ['p045', ['AD 951'], ['AD 952'], 'Yan Xijun’s service occurs in the Guangshun 2 (AD 952) Murong Yanchao campaign context.'],
]) {
  const person = extraction.people.find(row => row[0] === personId);
  if (!person || JSON.stringify(person[4]?.a) !== JSON.stringify(before)) throw new Error(`${personId} does not have the pinned active-date hint`);
  changes.push({ kind: 'hints', personId, before, after, reason });
}

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Codex Jiuwudaishi 130 second residual date-repair candidate',
    agentId: 'candidate_jwd130_second_residual',
  },
  changes,
};
const expectedChangeIds = ['claim-94', 'claim-95', 'claim-102', 'claim-144', 'claim-180', 'add-reception-event', 'claim-181', 'add-reception-event', 'claim-182', 'add-reception-event', 'hints-p038', 'hints-p040', 'hints-p045'];
if (JSON.stringify(changes.map(change => change.kind === 'hints' ? `hints-${change.personId}` : (change.kind === 'add-reception-event' ? change.kind : change.id))) !== JSON.stringify(expectedChangeIds)) {
  throw new Error('Second residual candidate must contain only the ten independently audited items and their required three replacement reception events');
}
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
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
  auditEvidence: { findings: audit.findings },
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter,
  candidateFile, sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash,
  auditReportHash: sha256(JSON.stringify(audit)), sealedCandidateHash, candidateExtractionHash,
  candidatePacket, auditEvidence: { findings: audit.findings },
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, auditReportHash: sha256(JSON.stringify(audit)), operations: changes.length, stats: validation.stats }));
