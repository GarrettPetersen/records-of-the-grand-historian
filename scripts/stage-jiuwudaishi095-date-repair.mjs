import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '095';
const auditCommit = '3b5ba39d3916d908d35227d8429a7beb4e4134f6';
const readJson = spec => JSON.parse(execFileSync('git', ['show', spec], { encoding: 'utf8' }));
const audit = readJson(`${auditCommit}:data/people/date-audits/${book}/${chapter}.json`);
const extraction = readJson(`${auditCommit}^:data/people/extractions/${book}/${chapter}.json`);
const packet = buildDateAuditPacket(book, chapter, { extraction });
if (audit.status !== 'needs-revision' || audit.findings.length !== 5 ||
    audit.sourceHash !== packet.sourceHash || audit.extractionHash !== packet.extractionHash ||
    sha256(JSON.stringify(extraction)) !== packet.extractionHash) throw new Error('stale Jiuwudaishi 095 audit/extraction pin');

const findingFor = id => {
  const finding = audit.findings.find(entry => entry.items.includes(id));
  if (!finding) throw new Error(`missing audit finding for ${id}`);
  return finding;
};
const claim = id => {
  const row = extraction.claims[Number(id.slice(6)) - 1];
  if (!row) throw new Error(`missing ${id}`);
  return row;
};
const person = id => {
  const row = extraction.people.find(entry => entry[0] === id);
  if (!row) throw new Error(`missing ${id}`);
  return row;
};
const changes = [];
const reason = id => `${findingFor(id).problem} ${findingFor(id).action}`;
const replace = (id, mutate, auditId = id) => {
  const before = claim(id);
  const after = structuredClone(before);
  mutate(after[2]);
  changes.push({ kind: 'replace', id, before, after, reason: reason(auditId) });
};
const hints = (id, after) => {
  const before = person(id)[4]?.a;
  if (!Array.isArray(before)) throw new Error(`${id} has no active-date hints`);
  // This audit identifies person-level hint debt by person ID, while some
  // older audits spell it as hints-pNNN.  Bind either representation to the
  // same audited finding rather than manufacturing a sixth finding.
  const target = audit.findings.some(entry => entry.items.includes(`hints-${id}`)) ? `hints-${id}` : id;
  changes.push({ kind: 'hints', personId: id, before, after, reason: reason(target) });
};
const year = value => ({ era: 'AD', year: value, precision: 'year' });
const initialEraBound = (value, field, start) => {
  const context = field ? value[field] : value;
  if (!context) throw new Error(`missing ${field || 'date container'}`);
  delete context.westernYear;
  context.westernBounds = { onOrAfter: year(start) };
  context.unresolved = true;
  context.unresolvedReason = 'The source says early in the era, which supplies a lower bound but no exact first-year point or phase endpoint.';
};
const undate = (value, message, field = null) => {
  const context = field ? value[field] : value;
  if (!context) throw new Error(`missing ${field || 'date container'}`);
  delete context.westernYear;
  delete context.westernInterval;
  delete context.westernBounds;
  context.unresolved = true;
  context.unresolvedReason = message;
};

// 初 gives a source phase, not a calendar-year point.  Without a stated phase
// endpoint the source-faithful rendering is the era's inclusive first-year
// lower bound, retaining the Chinese wording and declining to invent a span.
for (const id of ['claim-152', 'claim-153', 'claim-154']) replace(id, value => initialEraBound(value, null, 923));
for (const id of ['claim-659', 'claim-660', 'claim-661', 'claim-680', 'claim-834', 'claim-835', 'claim-843', 'claim-844', 'claim-852']) replace(id, value => initialEraBound(value, value.dateContext ? 'dateContext' : null, 926));
for (const id of ['claim-749', 'claim-750', 'claim-775', 'claim-787']) replace(id, value => initialEraBound(value, value.dateContext ? 'dateContext' : null, 930));
hints('p015', ['on or after AD 923', 'AD 926-936', 'AD 936-945']);
hints('p066', ['AD 906', 'AD 923', 'AD 925-926', 'on or after AD 926', 'AD 944']);
hints('p076', ['on or after AD 930', 'AD 936', 'AD 944']);

// This local Liang episode names no year.  Other, independently dated events
// in Lu Shunmi's biography still support his later hints; Dai Siyuan's record
// receives an explicit research hold instead of a borrowed AD 923 activity.
for (const id of ['claim-501', 'claim-517', 'claim-524', 'claim-526', 'claim-528']) replace(id, value => undate(value, 'The Dai Siyuan and Lu Shunmi episode is locally narrated without a dated campaign context; it cannot borrow AD 923. ', value.dateContext ? 'dateContext' : null));
hints('p050', ['AD 926', 'AD 937']);
hints('p051', ['research required: the cited Dai Siyuan and Lu Shunmi episode supplies no Western date.']);

// The death follows Gaozu's uprising.  It may fall in AD 936 itself, so use
// onOrAfter rather than the stricter after bound and do not add an upper end.
replace('claim-850', value => {
  const context = value.dateContext;
  delete context.westernYear;
  context.westernBounds = { onOrAfter: year(936) };
  context.unresolved = true;
  context.unresolvedReason = 'The source says the death followed Gaozu’s uprising; AD 936 is an inclusive lower bound, not an exact death year.';
});
hints('p083', ['on or after AD 926', 'AD 928', 'AD 929', 'AD 930', 'AD 934-936', 'on or after AD 936']);

// 近世 and the historian's appraisal are genuine death attestations, but do
// not identify a Later Jin lifespan interval.  Retain them as unresolved
// evidence and replace only the fabricated calendar labels with research holds.
for (const id of ['claim-963', 'claim-964', 'claim-967']) replace(id, value => undate(value, 'The retrospective phrase 近世 attests the reported death but supplies no AD 936–946 personal interval.', value.dateContext ? 'dateContext' : null), 'p096');
for (const id of ['claim-970', 'claim-971', 'claim-974']) replace(id, value => undate(value, 'The retrospective phrase 近世 attests the reported death but supplies no AD 936–946 personal interval.', value.dateContext ? 'dateContext' : null), 'p097');
hints('p096', ['research required: 近世 preserves a death attestation without a Western date.']);
hints('p097', ['research required: 近世 preserves a death attestation without a Western date.']);

replace('claim-977', value => undate(value, 'The evaluative phrase 晉室之臨危 preserves the Huatai loyalty assessment but supplies no AD 936–937 event interval.', 'dateContext'));
replace('claim-980', value => undate(value, 'The evaluative phrase 晉室之臨危 preserves the Huatai loyalty assessment but supplies no AD 936–937 event interval.'), 'p098');
hints('p098', ['research required: the Huatai appraisal supplies no Western event date.']);

if (changes.length !== 39 || new Set(changes.map(change => change.kind === 'hints' ? `hints-${change.personId}` : change.id)).size !== changes.length) throw new Error(`expected 39 unique operations, found ${changes.length}`);
const proposal = { schemaVersion: 1, kind: 'date-repair-proposal', book, chapter, sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, author: { name: 'Codex Jiuwudaishi 095 date-repair candidate', agentId: 'date_repair_candidate_jiuwudaishi095' }, changes };
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`candidate chronology geometry failure: ${JSON.stringify(geometry)}`);
const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
writeJsonAtomic(path.join(directory, candidateFile), { schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter, canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash, auditReportHash: sha256(JSON.stringify(audit)), author: proposal.author, sealedCandidateHash, candidateExtractionHash, proposal, candidate, candidatePacket, validation: { status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats }, auditEvidence: { findings: audit.findings } });
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), { schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter, candidateFile, sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash, sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence: { findings: audit.findings } });
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
