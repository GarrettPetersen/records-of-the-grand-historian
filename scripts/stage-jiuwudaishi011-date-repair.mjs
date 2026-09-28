import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Candidate only.  The host may replay this sealed proposal after an independent
// review; this command never writes the canonical extraction or audit report.
const book = 'jiuwudaishi';
const chapter = '011';
const auditCommit = '85245390e611b5b53a2a7c18be8487ac6ab32fe6';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = JSON.parse(execFileSync('git', ['show', `${auditCommit}:data/people/date-audits/${book}/${chapter}.json`], { encoding: 'utf8' }));
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || sha256(JSON.stringify(extraction)) !== audit.extractionHash) {
  throw new Error('Jiuwudaishi 011 audit or canonical extraction pin is stale');
}

const findingFor = id => {
  const finding = audit.findings.find(entry => entry.items.includes(id));
  if (!finding) throw new Error(`Missing audit finding for ${id}`);
  return finding;
};
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
const replace = (id, after, reason = findingFor(id).problem) =>
  changes.push({ kind: 'replace', id, before: claim(id), after, reason });
const remove = (id, reason = findingFor(id).problem) =>
  changes.push({ kind: 'remove', id, before: claim(id), reason });
const hints = (id, after, reason = findingFor(`hints-${id}`).problem) =>
  changes.push({ kind: 'hints', personId: id, before: person(id)[4]?.a ?? [], after, reason });
const undated = (id, event) => {
  const after = structuredClone(claim(id));
  after[2] = { undatedSourceAttestation: true, event };
  replace(id, after);
};
const hold = (id, event) => {
  const after = structuredClone(claim(id));
  delete after[2].westernYear;
  delete after[2].westernInterval;
  delete after[2].westernBounds;
  after[2].unresolved = true;
  after[2].unresolvedReason = event;
  after[2].event = 'Source-specific title or relationship context retained; no Western personal activity date is asserted.';
  replace(id, after);
};
const reception = (id, { kind = 'posthumous-reference', role = 'honoree', action, receptionType = 'posthumous' }) => {
  const before = claim(id);
  remove(id);
  changes.push({
    kind: 'add-reception-event',
    after: [before[0], 'event-participation', {
      kind, role, action, receptionType, dateContext: structuredClone(before[2]?.dateContext ?? before[2]),
    }, before[3], before[4]],
    reason: `Preserve ${id}'s dated later reference as a separately classified ${receptionType} reception rather than a life attestation.`,
  });
};

// A posthumous style dated early in Kaiping concerns Wang's reception, not an
// attestation that she was alive in AD 907.  The pre-existing honor claim is
// retained; the event record keeps the dated reception visible on the person page.
reception('claim-2', { kind: 'posthumous-commemoration', action: 'posthumous-title-conferred' });
// “以溫貴” is not itself dated.  It must not inherit a date from a later reign.
{
  const after = structuredClone(claim('claim-8'));
  after[2].dateContext = {
    undatedSourceAttestation: true,
    event: '“以溫貴” gives a causal description of Wang’s enfeoffment, not a dated personal attestation.',
  };
  replace('claim-8', after);
}
hints('p001', []);

// The founder is mentioned through his mother's or wife’s posthumous honors.
// Keep those source references, but do not date his life from somebody else’s reception.
hold('claim-15', 'Research required: Wang’s posthumous title cannot establish the founder’s personal life chronology.');
hold('claim-16', 'Research required: Empress Zhang’s posthumous title cannot establish the founder’s personal life chronology.');
hints('p002', ['research required: the chapter gives only relative “after usurpation” context, not a personal life-date endpoint.']);

// “Died early”, rebellion membership, a later office, marriage, a source
// citation, or a literary allusion supplies no personal Western endpoint.
const unsupported = new Map([
  ['claim-49', '“Died early” has no stated year in this chapter.'],
  ['claim-72', 'Joining Huang Chao’s army is stated without a year; do not use the rebellion’s full chronology.'],
  ['claim-78', 'Remaining with the Liu household is stated without a year.'],
  ['claim-82', 'The source names Huang Chao’s army but gives no date for this participation.'],
  ['claim-85', 'Military merit and reaching a regional command are stated without a date.'],
  ['claim-89', 'Military merit and reaching a regional command are stated without a date.'],
  ['claim-109', 'The cited former Songzhou prefecture supplies no date for Zhang Rui.'],
  ['claim-118', '“At the initial capture of Yan and Yun” is not a source-given personal Western interval.'],
  ['claim-122', 'The capture and marriage reference gives no personal Western endpoint.'],
  ['claim-128', 'The phrase “the disaster of Yougui” does not date Yougui’s own activity to AD 912.'],
  ['claim-132', 'A cited title of Taizu’s consort does not establish a reign-wide life interval.'],
  ['claim-136', 'A cited title of Taizu’s consort does not establish a reign-wide life interval.'],
  ['claim-140', 'A citation of Ouyang’s history does not date its author’s activity to AD 1073.'],
  ['claim-213', 'A cited Xue history entry does not date Luo Shaowei’s activity to AD 910.'],
]);
for (const [id, event] of unsupported) undated(id, event);
for (const id of ['p003', 'p006', 'p007', 'p008', 'p009', 'p010', 'p012', 'p014', 'p015', 'p016', 'p017', 'p018', 'p019', 'p034']) hints(id, []);

// Zhang’s three dates are all her posthumous titles, already independently
// described by honor claims.  Keep each dated reception rather than making it
// an ordinary life attestation.
reception('claim-93', { kind: 'posthumous-commemoration', action: 'posthumous-title-conferred' });
reception('claim-94', { kind: 'posthumous-commemoration', action: 'posthumous-consort-title-conferred' });
reception('claim-95', { kind: 'posthumous-commemoration', action: 'posthumous-empress-title-conferred' });
hints('p011', []);

// The Last Emperor is named in a consort’s AD 915 investiture and in the AD
// 938 handling of his severed head.  Neither is a life attestation.  Preserve
// the AD 915 relationship reference as undated and preserve the later handling
// as posthumous reception; no date of death is inferred here.
undated('claim-149', 'The AD 915 investiture belongs to Zhang; “lesser emperor” is an undated relationship reference.');
reception('claim-150', { kind: 'posthumous-commemoration', action: 'head-released-for-burial' });
reception('claim-151', { kind: 'posthumous-commemoration', action: 'head-buried-with-consort' });
hints('p021', []);
undated('claim-158', 'The AD 938 order concerns the later burial; the second consort is not thereby dated as alive.');
hints('p022', []);
undated('claim-164', 'The AD 938 order dates the burial operation, not a life-wide attestation for An Chongruan.');

// Enfeoffment and marriage phrases preserve relationships and honors elsewhere
// in the extraction.  Their dates cannot also be used as living-date hints for
// every named spouse or title-holder.  Any explicit posthumous honor gets its
// own reception record.
reception('claim-168', { kind: 'posthumous-commemoration', action: 'posthumous-princess-title-conferred' });
hints('p024', []);
undated('claim-173', 'The AD 908 posthumous honor of Anyang is an undated marriage reference to Luo Tinggui.');
hints('p025', []);
hold('claim-177', 'Research required: a dated princess enfeoffment does not establish a life-wide activity endpoint.');
hints('p026', ['research required: a dated enfeoffment does not establish a life-wide activity endpoint.']);
undated('claim-182', 'The dated princess enfeoffment is an undated marriage reference to Zhao Yan.');
hints('p027', []);
hold('claim-185', 'Research required: a dated princess enfeoffment does not establish a life-wide activity endpoint.');
hints('p028', ['research required: a dated enfeoffment does not establish a life-wide activity endpoint.']);
undated('claim-190', 'The dated princess enfeoffment is an undated marriage reference to Wang Zhaozuo.');
hints('p029', []);

// The Bian episode itself is already represented by exact AD 883 contextual
// claims 58 and 66.  Narrow the two affected hints to that verified context;
// do not manufacture an AD 907 enfeoffment or retain the 875–907 expansion.
hints('p004', ['AD 883']);
hints('p005', ['AD 883']);

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book, chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit,
  author: { name: 'Independent Jiuwudaishi 011 date-repair candidate', agentId: 'candidate_jiuwudaishi011_date_repair' },
  changes,
};
for (let index = 1; index <= changes.length; index += 1) {
  try { applyDateRepairProposal(extraction, { ...proposal, changes: changes.slice(0, index) }, packet); }
  catch (error) { throw new Error(`Operation ${index} ${JSON.stringify(changes[index - 1])}: ${error.message}`); }
}
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
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
  exactAtomicScope: 'PASS: candidate-only claim dates, active hints, and separately classified receptions; no canonical extraction, Chinese source, model, or publication output changed.',
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
  requiredReview: 'Independently verify all three audit findings: no posthumous honor, later burial, title, marriage, citation, rebellion, reign, dynasty, or literary-reference date remains a personal life attestation; all surviving dates belong only to their source-grounded event owner; p004 and p005 retain only the pre-existing AD 883 Bian-command context; replay the sealed proposal and rerun strict compact validation plus chronology geometry.',
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
