import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Candidate-only materialization.  This never writes the canonical extraction,
// source chapter, model output, or public artifact.
const book = 'jiuwudaishi';
const chapter = '013';
const auditCommit = '0d5a114a2656b3525b5cb39169e32dccbab400fb';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = JSON.parse(execFileSync('git', ['show', `${auditCommit}:data/people/date-audits/${book}/${chapter}.json`], { encoding: 'utf8' }));
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || sha256(JSON.stringify(extraction)) !== audit.extractionHash) {
  throw new Error('Jiuwudaishi 013 canonical source, extraction, or audit pin is stale');
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
const hints = (id, expectedBefore, after, reason = findingFor(`hints-${id}`).problem) => {
  const before = person(id)[4]?.a ?? [];
  if (JSON.stringify(before) !== JSON.stringify(expectedBefore)) throw new Error(`${id} active hints drifted from audited input`);
  changes.push({ kind: 'hints', personId: id, before, after, reason });
};
const onOrAfter = (id, year) => {
  const before = claim(id);
  const sourceDate = structuredClone(before[2].dateContext?.sourceDate ?? before[2].sourceDate);
  if (!sourceDate?.text) throw new Error(`${id} lacks source date text`);
  const after = structuredClone(before);
  const date = {
    sourceDate,
    westernBounds: { onOrAfter: { era: 'AD', year, precision: 'year' } },
  };
  if (after[2].dateContext) after[2].dateContext = date;
  else after[2] = date;
  replace(id, after);
};

// Guangqi's final phase begins in 887, rather than at the reign's 885 accession.
// The chapter itself supplies the upper endpoint through the reign wording.
{
  const after = structuredClone(claim('claim-98'));
  after[2].dateContext.westernBounds = {
    onOrAfter: { era: 'AD', year: 887, precision: 'year' },
    onOrBefore: { era: 'AD', year: 888, precision: 'year' },
  };
  replace('claim-98', after);
}

// Wang Chongshi was killed before the rebellion.  Preserve that direction; the
// chapter supplies no lower endpoint for his death.
{
  const after = structuredClone(claim('claim-453'));
  after[2] = {
    sourceDate: { text: '知俊叛前' },
    westernBounds: { onOrBefore: { era: 'AD', year: 909, precision: 'year' } },
  };
  replace('claim-453', after);
}

// These are local sequence contexts, not personal AD 909–923 attestations.
// The chapter orders them after the AD 909 rebellion, but supplies no common
// terminal event: retain only that one-sided sequence.
for (const id of ['claim-454', 'claim-459', 'claim-460', 'claim-461', 'claim-462',
  'claim-463', 'claim-464', 'claim-465', 'claim-466', 'claim-467', 'claim-468',
  'claim-476', 'claim-477', 'claim-478', 'claim-479']) onOrAfter(id, 909);

// The marriage follows Wang Yan's succession, but this chapter does not itself
// pin a terminal year.  Wang Yan's AD 918 succession gives a lower bound only
// for Wang Yan, Liu Siyin, and the princess; their old AD 923 endpoint was an
// inherited dynasty span rather than evidence for this marriage.
for (const id of ['claim-469', 'claim-470', 'claim-471']) onOrAfter(id, 918);

// "Late Zhenming" is independently represented in this chapter as 920–921;
// preserve that narrow late-reign conversion instead of the full Liang span.
for (const id of ['claim-472', 'claim-473']) {
  const after = structuredClone(claim(id));
  after[2] = {
    sourceDate: structuredClone(claim(id)[2].sourceDate),
    westernBounds: {
      onOrAfter: { era: 'AD', year: 920, precision: 'year' },
      onOrBefore: { era: 'AD', year: 921, precision: 'year' },
    },
  };
  replace(id, after);
}

// Liu Yuan's omen explanation is during Zhijun's Tongzhou tenure, before the
// rebellion.  Preserve that one-sided sequence rather than promoting it to an
// AD 909 point; the source gives no lower endpoint.
{
  const after = structuredClone(claim('claim-475'));
  after[2] = {
    sourceDate: { text: '知俊鎮同州日' },
    westernBounds: { onOrBefore: { era: 'AD', year: 909, precision: 'year' } },
  };
  replace('claim-475', after);
}
hints('p124', ['AD 909'], ['on or before AD 909; explained an omen during Liu Zhijun’s Tongzhou tenure before the rebellion']);

if (changes.length !== 24) throw new Error(`Expected 24 audited operations, got ${changes.length}`);
const proposal = {
  schemaVersion: 1, kind: 'date-repair-proposal', book, chapter,
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, auditCommit,
  author: { name: 'Independent Jiuwudaishi 013 date-repair candidate', agentId: 'candidate_jiuwudaishi013_date_repair' },
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
  chronologyGeometry: 'PASS',
  exactAtomicScope: 'PASS: exactly the 23 audited date claims and Liu Yuan active-date hint; no canonical extraction, source, model, or publication output changed.',
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
  requiredReview: 'Independently replay all 24 atomic operations against the pinned canonical extraction and read every cited Chinese witness. Confirm late Guangqi is AD 887–888; Wang Chongshi is only on or before AD 909; every listed local sequence retains Chinese source wording without an inherited AD 909–923 interval; Wang Yan succession has no imported Western span; late Zhenming is AD 920–921; Liu Yuan retains only the one-sided pre-rebellion Tongzhou bound, not an AD 909 point; and strict compact validation plus chronology geometry pass.',
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
