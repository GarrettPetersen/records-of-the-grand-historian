import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Candidate-only materialization. This script never writes the canonical
// extraction, source chapter, model output, or publication artifact.
const book = 'jiuwudaishi';
const chapter = '010';
const auditCommit = '982c5dd4930931579912fa4559f10b771b54bb32';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = JSON.parse(execFileSync('git', ['show', `${auditCommit}:data/people/date-audits/${book}/${chapter}.json`], { encoding: 'utf8' }));
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || sha256(JSON.stringify(extraction)) !== audit.extractionHash) {
  throw new Error('Jiuwudaishi 010 canonical source, extraction, or audit pin is stale');
}
const findingFor = item => {
  const finding = audit.findings.find(entry => entry.items.includes(item));
  if (!finding) throw new Error(`Missing audit finding for ${item}`);
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
const hints = (id, expectedBefore, after, reason = findingFor(`hints-${id}`).problem) => {
  const before = person(id)[4]?.a ?? [];
  if (JSON.stringify(before) !== JSON.stringify(expectedBefore)) throw new Error(`${id} active hints drifted from audited input`);
  changes.push({ kind: 'hints', personId: id, before, after, reason });
};
const undated = (id, event) => {
  const before = claim(id);
  const after = [before[0], before[1], { undatedSourceAttestation: true, event }, before[3], before[4]];
  replace(id, after);
};
const onOrBefore = (id, sourceDate, year) => {
  const before = claim(id);
  const after = structuredClone(before);
  after[2] = {
    sourceDate: { text: sourceDate },
    westernBounds: { onOrBefore: { era: 'AD', year, precision: 'year' } },
  };
  replace(id, after);
};
const reception = (personId, sourceClaimId, action, role = 'honoree') => {
  const before = claim(sourceClaimId);
  const dateContext = structuredClone(before[2]?.dateContext ?? before[2]);
  changes.push({
    kind: 'add-reception-event',
    after: [personId, 'event-participation', {
      kind: 'posthumous-commemoration', role, action,
      receptionType: 'posthumous', dateContext,
    }, 'explicit', structuredClone(before[4])],
    reason: `Preserve the dated posthumous reception in ${sourceClaimId} without treating the deceased recipient as active.`,
  });
};

// Mourning, retrospective causes, historiographical references, and a ruler's
// allusion to his dead father identify people but do not date their lives.
undated('claim-19', 'Qian Chuanjing mourned his already deceased mother; the chapter does not date her life.');
hints('p004', ["AD 920; attested through Qian Chuanjing's mourning for her death"], []);
undated('claim-65', 'Zhang Shoujin\'s rebellion is recalled retrospectively; this chapter supplies no personal Western date.');
hints('p012', ['AD 920; his earlier Yanzhou rebellion was recalled'], []);
undated('claim-195', 'Wei Shou is named in a historiographical memorial; the 921 memorial is not a personal life attestation.');
hints('p043', ['AD 921; cited as compiler of the History of Later Wei'], []);
undated('claim-199', 'Northern Wei Taiwu is a ruler in a retrospective historical narrative, not a participant in the 921 memorial.');
hints('p044', ["AD 921; cited as the starting ruler in Wei Shou's historical account"], []);
undated('claim-235', 'The Last Emperor names his deceased father and predecessor retrospectively; the 921 edict is not a life attestation.');
hints('p054', ['AD 921; recalled by the Last Emperor as his father and predecessor'], []);

// The 937 authorization concerns the Last Emperor's severed head after his
// independently witnessed 923 death. It is a reception, not renewed life or
// death evidence. The omen passage is textual commentary and must not invent
// an eleventh regnal year or another death date.
remove('claim-28');
remove('claim-48');
remove('claim-51');
reception('p006', 'claim-51', 'authorized collection and reburial of the Last Emperor\'s head');
hints('p006', ['AD 920-923; issued edicts, ruled Later Liang, and died in AD 923', 'AD 937; remains were ordered reburied'],
  ['AD 920-923; issued edicts, ruled Later Liang, and died in AD 923']);

// Qi Fengguo's dated honor, like the Last Emperor's later reburial, is kept
// visible as a classified reception. The pre-existing undated death claim is
// retained; the honor date cannot attest Qi Fengguo's life.
remove('claim-113');
reception('p025', 'claim-113', 'posthumous grant of Grand Mentor');
hints('p025', ['AD 920; posthumously honored as Grand Mentor'], []);

// 先是 gives a one-sided sequence. Preserve that direction in both the claim
// and the reader-facing hint instead of fabricating a point year.
onOrBefore('claim-138', '貞明六年六月以前', 920);
hints('p030', ['AD 920; fled Tongzhou after Zhu Youqian seized it'], ['on or before AD 920; fled Tongzhou after Zhu Youqian seized it']);
onOrBefore('claim-157', '龍德三年春三月以前', 923);
hints('p034', ['AD 920-923; Jin commander, later recalled as Luzhou commissioner who died in battle'],
  ['AD 920; Jin commander', 'on or before AD 923; Luzhou commissioner who died in battle']);

if (changes.length !== 22) throw new Error(`Expected 22 exact candidate-only repair operations, got ${changes.length}`);
const proposal = {
  schemaVersion: 1, kind: 'date-repair-proposal', book, chapter,
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, auditCommit,
  author: { name: 'Independent Jiuwudaishi 010 date-repair candidate', agentId: 'candidate_jiuwudaishi010_date_repair' },
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
  exactAtomicScope: 'PASS: exactly the 20 initially-audited failed records plus two source-backed reception records; no canonical extraction, source, model, or publication output changed.',
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
  requiredReview: 'Independently replay all 22 atomic operations against the pinned canonical extraction and inspect every cited Chinese witness. Confirm p004, p012, p043, p044, and p054 retain only undated retrospective or relationship evidence; the 937 Last Emperor reburial and 920 Qi Fengguo honor are posthumous receptions; claim-48 carries no invented omen numeral or date; Cheng Quanhui and Li Sizhao retain only on-or-before bounds; and strict compact validation plus chronology geometry pass.',
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
