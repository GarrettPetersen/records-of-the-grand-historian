import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '116';
const auditCommit = '9afa27224245d16a4ce64a63f4df80aab44b9833';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter, { extraction });
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const year = value => ({ era: 'AD', year: value, precision: 'year' });

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || sha256(JSON.stringify(extraction)) !== packet.extractionHash) {
  throw new Error('Jiuwudaishi 116 audit or canonical staging extraction pin is stale');
}
if (audit.findings.length !== 6) throw new Error('Expected exactly the six findings in audit 9afa');

const findingFor = id => {
  const finding = audit.findings.find(entry => entry.items.includes(id));
  if (!finding) throw new Error(`Missing audited finding for ${id}`);
  return finding;
};
const reason = id => `${findingFor(id).problem} ${findingFor(id).action}`;
const claim = id => {
  const value = extraction.claims[Number(id.slice(6)) - 1];
  if (!value) throw new Error(`Missing ${id}`);
  return value;
};
const person = id => {
  const value = extraction.people.find(row => row[0] === id);
  if (!value) throw new Error(`Missing ${id}`);
  return value;
};
const changes = [];
const replace = (id, mutate, reasonId = id) => {
  const before = claim(id);
  const after = structuredClone(before);
  mutate(after[2]);
  changes.push({ kind: 'replace', id, before, after, reason: reason(reasonId) });
};
const hints = (personId, after, reasonId = `hints-${personId}`) => {
  const before = person(personId)[4]?.a;
  if (!Array.isArray(before)) throw new Error(`${personId} has no active-date hints`);
  changes.push({ kind: 'hints', personId, before, after, reason: reason(reasonId) });
};
const undate = (id, message) => replace(id, value => {
  delete value.sourceDate;
  delete value.westernYear;
  delete value.westernInterval;
  delete value.westernBounds;
  value.undatedSourceAttestation = true;
  value.event = message;
}, id);

// The five killings/deaths occur under the preceding Xiande 3 sequence.  The
// report permits only the inherited month/year; none of these source passages
// licenses a fabricated day.
for (const [id, sourceDate] of [
  ['claim-214', '顯德三年二月'],
  ['claim-290', '顯德三年三月'],
  ['claim-531', '顯德三年冬十月'],
  ['claim-538', '顯德三年冬十月'],
  ['claim-539', '顯德三年十一月'],
]) replace(id, value => { value.dateContext = { sourceDate: { text: sourceDate }, westernYear: year(956) }; });

// A burial and a posthumous award are reception events, not death dates.
for (const [id, action] of [
  ['claim-525', 'buried at Yiling'],
  ['claim-583', 'posthumously awarded the title Right Remonstrance Official'],
]) {
  const before = claim(id);
  if (before[1] !== 'death' || !before[2]?.dateContext?.westernYear?.year) throw new Error(`${id} is not the audited death misclassification`);
  changes.push({ kind: 'remove', id, before, reason: reason(id) });
  changes.push({
    kind: 'add-reception-event',
    after: [before[0], 'event-participation', {
      kind: 'posthumous-commemoration', role: 'honoree', action,
      dateContext: structuredClone(before[2].dateContext),
    }, before[3], structuredClone(before[4])],
    reason: reason(id),
  });
}
hints('p127', []);
hints('p153', []);

// Zhang Zhu's dated petition does not date his otherwise unnamed grandfather.
undate('claim-574', 'Zhang Zhu’s dated name-taboo petition attests an unnamed grandfather reference, not the grandfather’s AD 956 activity.');
hints('p163', []);

const retrospective = [
  ['claim-254', 'p055'], ['claim-255', 'p056'], ['claim-256', 'p057'], ['claim-257', 'p058'], ['claim-258', 'p059'], ['claim-303', 'p060'],
  ['claim-494', 'p136'], ['claim-496', 'p137'], ['claim-498', 'p138'], ['claim-500', 'p139'], ['claim-502', 'p140'], ['claim-504', 'p141'],
  ['claim-560', 'p156'], ['claim-562', 'p157'], ['claim-564', 'p158'],
];
for (const [id] of retrospective) undate(id, 'This retrospective exemplar, reign/polity label, or commissioned-history title is source-backed reception evidence but supplies no personal Western activity interval.');
for (const [, personId] of retrospective) hints(personId, []);

const citations = [['claim-35', 'p012'], ['claim-338', 'p077'], ['claim-425', 'p109'], ['claim-142', 'p028']];
for (const [id] of citations) undate(id, 'The cited source names an author or work but supplies no pinned external chronology; retain the citation as an undated source attestation.');
for (const [, personId] of citations) hints(personId, []);

replace('claim-558', value => {
  value.sourceDate = { text: '顯德三年十二月' };
  delete value.westernInterval;
  value.westernYear = year(956);
});
hints('p155', ['AD 956', 'AD 957'], 'claim-558');
for (const id of ['claim-566', 'claim-568']) replace(id, value => { value.sourceDate = { text: '顯德四年正月' }; });

if (changes.length !== 55 || new Set(changes.map(change => change.kind === 'hints' ? `hints-${change.personId}` : change.kind === 'add-reception-event' ? `reception-${change.after[0]}` : change.id)).size !== changes.length) {
  throw new Error(`Expected exactly 55 unique report-path operations, found ${changes.length}`);
}

const proposal = {
  schemaVersion: 1, kind: 'date-repair-proposal', book, chapter,
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, auditCommit,
  auditReportHash: sha256(JSON.stringify(audit)),
  author: { name: 'Codex Jiuwudaishi 116 audit 9afa source-faithful date-repair candidate', agentId: 'date_repair_candidate_jiuwudaishi116' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (!same(applyDateRepairProposal(extraction, proposal, packet), candidate)) throw new Error('Exact candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const auditEvidence = { findings: audit.findings };
writeJsonAtomic(path.join(directory, candidateFile), {
  schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter,
  canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash,
  auditCommit, auditReportHash: proposal.auditReportHash, author: proposal.author,
  sealedCandidateHash, candidateExtractionHash, proposal, candidate, candidatePacket,
  validation: { status: 'passed', proposalReplay: 'PASS', exactReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats },
  auditEvidence, publication: 'staging-only', masterMutation: 'NONE',
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter, candidateFile,
  sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash,
  sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence,
  scope: { auditCommit, reportFindings: 6, operations: changes.length },
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats, geometry: 'PASS' }));
