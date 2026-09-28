import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Candidate only: never writes canonical extraction or source data.
const book = 'jiuwudaishi';
const chapter = '012';
const stagingBase = '9b93d68af30277aab977e8f40fec167ff4647c3d';
const auditCommit = '44d753a0da3efdf904c34c528817ca7406e7f834';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = JSON.parse(execFileSync('git', ['show', `${auditCommit}:data/people/date-audits/${book}/${chapter}.json`], { encoding: 'utf8' }));
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || sha256(JSON.stringify(extraction)) !== audit.extractionHash ||
    execFileSync('git', ['rev-parse', `${stagingBase}:data/people/extractions/${book}/${chapter}.json`], { encoding: 'utf8' }).trim() !==
      execFileSync('git', ['hash-object', path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`)], { encoding: 'utf8' }).trim()) {
  throw new Error('Jiuwudaishi 012 canonical source, extraction, or audit pin is stale');
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
const hints = (id, after, reason = findingFor(`hints-${id}`).problem) =>
  changes.push({ kind: 'hints', personId: id, before: person(id)[4]?.a ?? [], after, reason });
const undated = (id, event) => {
  const after = structuredClone(claim(id));
  after[2] = { undatedSourceAttestation: true, event };
  replace(id, after);
};
const reception = (id, action) => {
  const before = claim(id);
  // The corresponding title/honor claim remains; the separated event retains
  // the source date without representing the dead honoree as active.
  const reason = `Preserve ${id}'s dated posthumous reception without treating it as a living attestation.`;
  changes.push({ kind: 'remove', id, before, reason });
  changes.push({ kind: 'add-reception-event', after: [before[0], 'event-participation', {
    kind: 'posthumous-commemoration', role: 'honoree', action,
    receptionType: 'posthumous', dateContext: structuredClone(before[2]),
  }, before[3], before[4]], reason });
};

// Literary, editorial, and retrospective allusions identify people but supply
// no personal Western date in this chapter.
undated('claim-76', 'Huang Chao is named in Quan Yu’s undated recollection; the chapter does not date Huang Chao’s activity here.');
undated('claim-77', '“Hu notes” is an undated editorial attribution, not a Song-dynasty personal attestation.');
undated('claim-89', 'The capture of Qin Zongquan is referenced without a calendar date in this source context.');
hints('p005', []);
hints('p006', []);
hints('p015', []);

// Kaiping and Qianhua dates here are grants made after these men died.  Keep
// the date visible as a classified reception, never as an active-life date.
reception('claim-88', 'posthumous-princely-title-conferred');
reception('claim-98', 'posthumous-princely-title-conferred');
reception('claim-103', 'posthumous-princely-title-conferred');
reception('claim-111', 'posthumous-princely-title-conferred');
reception('claim-112', 'posthumous-honor-conferred');
hints('p014', ['AD 903']);
hints('p021', ['AD 892', 'AD 901', 'AD 902', 'AD 903']);
hints('p026', []);
hints('p027', ['AD 881-885', 'AD 892', 'AD 895', 'AD 897', 'AD 901', 'AD 904']);
hints('p034', ['AD 907', 'AD 912']);

// Zhu Youzhen's accession is explicitly AD 913, but supplies neither a full
// reign interval nor an AD 923 endpoint.  You Zi's following sequence has an
// inclusive lower bound only.
hints('p010', ['AD 913']);
{
  const after = structuredClone(claim('claim-129'));
  after[2].westernBounds = { onOrAfter: { era: 'AD', year: 913, precision: 'year' } };
  delete after[2].westernInterval;
  after[2].event = 'Enfeoffed after Zhu Youzhen’s AD 913 accession; the chapter gives no terminal endpoint.';
  replace('claim-129', after);
}
hints('p042', ['on or after AD 913']);

// “At nineteen” is not date-bearing.  Li Hanzhi retains the direct AD 901
// claim elsewhere in the chapter, not an imported interval.
undated('claim-163', 'You Lun was nineteen when he became a Xuanwu officer; this source statement has no calendar year.');
hints('p022', ['AD 901']);

// Liu Sheng and Liu Shao are analogical precedents, not participants in a
// dated event in this chapter.
undated('claim-101', 'Liu Sheng is a retrospective Eastern Han precedent; no personal Western date is asserted by this source context.');
hints('p024', []);
undated('claim-125', 'Liu Shao is named as a historical precedent for a label; this source context supplies no personal date.');
hints('p038', []);

// The five reception repairs each use a remove/add pair so that the immutable
// original attestation predicate is never silently rewritten.
if (changes.length !== 30) throw new Error(`Expected 25 audit targets in 30 atomic operations, got ${changes.length}`);
const proposal = {
  schemaVersion: 1, kind: 'date-repair-proposal', book, chapter,
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, auditCommit,
  author: { name: 'Independent Jiuwudaishi 012 date-repair candidate', agentId: 'candidate_jiuwudaishi012_date_repair' },
  changes,
};
for (let index = 1; index <= changes.length; index += 1) {
  try { applyDateRepairProposal(extraction, { ...proposal, changes: changes.slice(0, index) }, packet); }
  catch (error) { throw new Error(`Operation ${index} ${changes[index - 1].id ?? changes[index - 1].personId}: ${error.message}`); }
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
const validationSummary = {
  status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS (strict scoped alias-disposition validation)',
  chronologyGeometry: 'PASS', exactAtomicScope: 'PASS: candidate-only date claims/hints/receptions; no canonical extraction, source, model, or publication output changed.',
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
  sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence: { findings: audit.findings },
  requiredReview: 'Independently replay all 30 atomic operations for the 25 audit targets against the pinned canonical extraction and read every cited Chinese witness. Confirm literary/editorial/allusive contexts carry no invented dates; AD 907/913 grants are classified as posthumous receptions; no title restoration date is a life date; the accession has no fabricated AD 923 endpoint; the age statement is undated; and strict compact validation plus chronology geometry pass.',
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
