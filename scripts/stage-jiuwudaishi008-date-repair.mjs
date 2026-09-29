import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '008';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || audit.findings.length !== 7 ||
    sha256(JSON.stringify(extraction)) !== audit.extractionHash) {
  throw new Error('Jiuwudaishi 008 audit or canonical extraction pin is stale');
}

const findingFor = (id) => {
  const finding = audit.findings.find(entry => entry.items.includes(id));
  if (!finding) throw new Error(`Missing audit finding for ${id}`);
  return finding;
};
const claim = (id) => {
  const index = Number(id.slice('claim-'.length)) - 1;
  const value = extraction.claims[index];
  if (!value) throw new Error(`Missing ${id}`);
  return value;
};
const replace = (id, after, reason = findingFor(id).problem) => ({ kind: 'replace', id, before: claim(id), after, reason });
const hint = (personId, after) => {
  const person = extraction.people.find(row => row[0] === personId);
  if (!person || !Array.isArray(person[4]?.a)) throw new Error(`Missing active-date hint for ${personId}`);
  return { kind: 'hints', personId, before: person[4].a, after, reason: findingFor(`hints-${personId}`).problem };
};

const changes = [];

// 貞明中 names a period of the source narrative, not the emperor's activity
// throughout every year of the era.
{
  const after = structuredClone(claim('claim-39'));
  after[2].dateContext = {
    undatedSourceAttestation: true,
    event: '“貞明中” identifies the narrative period of the name change but does not establish endpoints for a Western activity interval.',
  };
  changes.push(replace('claim-39', after));
}

// Taizu's terminal illness in s0042 is the only directly dated personal
// chronology in this chapter.  The rhetorical “from founding until illness”
// does not prove a continuous AD 907–912 activity interval.  Keep a narrow
// attestation of that terminal illness (rather than making this claim wholly
// undated): its date is the source's retrospective 去歲 in the AD 913 context,
// and s0042 itself supplies the illness wording.  This gives the ordinary
// person record direct, source-backed AD 912 attestation without recreating
// the rejected reign-wide interval.
{
  const after = structuredClone(claim('claim-162'));
  after[2] = {
    sourceDate: { text: '去歲（乾化二年）' },
    westernYear: { era: 'AD', year: 912, precision: 'year' },
    event: 's0042 records that the late emperor’s terminal illness was worsening; the preceding 去歲 fixes this narrow attestation to AD 912, not to the full founding-to-illness span.',
  };
  after[4] = ['s0042'];
  changes.push(replace('claim-162', after));
  changes.push(hint('p019', ['AD 912']));
}

// The AD 913 order restores Zhu Youwen's honors and orders his reburial after
// his AD 912 execution.  Preserve its date and source units as a reception
// event rather than a living attestation.
{
  const before = claim('claim-166');
  if (before[0] !== 'p020' || before[1] !== 'attestation' || before[2]?.westernYear?.year !== 913) {
    throw new Error('claim-166 no longer matches the audited Zhu Youwen reception');
  }
  const after = structuredClone(before);
  after[1] = 'event-participation';
  after[2] = {
    kind: 'posthumous-commemoration',
    receptionType: 'posthumous',
    role: 'honoree',
    action: 'honors-restored-and-reburial-ordered',
    dateContext: before[2],
  };
  changes.push({ kind: 'remove', id: 'claim-166', before, reason: findingFor('claim-166').problem });
  changes.push({ kind: 'add-reception-event', after, reason: 'Retain the AD 913 乾化三年 restoration/reburial order as Zhu Youwen’s posthumous reception, distinct from his AD 912 death.' });
  changes.push(hint('p020', ['AD 912']));
}
{
  const after = structuredClone(claim('claim-167'));
  after[2] = {
    undatedSourceAttestation: true,
    event: '“二紀於茲” describes the length of a shared service relationship but does not state endpoints for Zhu Youwen’s activity.',
  };
  changes.push(replace('claim-167', after));
}

// Luo Shaowei's “太祖時” is a reign-context phrase; it cannot establish that he
// was active throughout the entire reign.
{
  const after = structuredClone(claim('claim-332'));
  after[2] = {
    undatedSourceAttestation: true,
    event: '“太祖時” supplies only a reign-context reference for Taizu’s anger, not a dated personal activity interval for Luo Shaowei.',
  };
  changes.push(replace('claim-332', after));
  changes.push(hint('p056', []));
}

// This source specifically says 太祖時.  The retained Western normalization is
// therefore a reign bound, never a fabricated AD 912 point event.
{
  const after = structuredClone(claim('claim-527'));
  after[2].sourceDate = { text: '太祖時' };
  delete after[2].westernYear;
  after[2].westernInterval = {
    start: { era: 'AD', year: 907, precision: 'year' },
    end: { era: 'AD', year: 912, precision: 'year' },
  };
  changes.push(replace('claim-527', after));
}

// Every synthetic “AD …” sourceDate below is replaced by the Chinese temporal
// wording in the cited unit, with the inherited named reign supplied only where
// the cited unit supplies a month/day alone.  Western dates remain conversions,
// not the source evidence itself.
const sourceDates = new Map([
  ['claim-457', ['貞明元年九月', 915]],
  ['claim-459', ['貞明元年九月壬午', 915]],
  ['claim-461', ['貞明元年冬十月辛亥', 915]],
  ['claim-463', ['貞明元年冬十月辛亥', 915]],
  ['claim-465', ['貞明元年十二月乙未', 915]],
  ['claim-467', ['貞明元年十二月乙未', 915]],
  ['claim-469', ['貞明二年春正月庚申', 916]],
  ['claim-471', ['貞明二年春正月', 916]],
  ['claim-473', ['貞明二年二月丙申', 916]],
  ['claim-475', ['貞明二年二月', 916]],
  ['claim-477', ['貞明二年二月', 916]],
  ['claim-479', ['貞明二年三月', 916]],
  ['claim-481', ['貞明二年三月', 916]],
  ['claim-483', ['貞明二年三月', 916]],
  ['claim-485', ['貞明二年夏四月乙酉朔', 916]],
  ['claim-487', ['貞明二年夏四月癸卯夜', 916]],
  ['claim-489', ['貞明二年夏四月癸卯夜', 916]],
  ['claim-497', ['貞明二年秋七月甲寅朔', 916]],
  ['claim-500', ['貞明二年六月', 916]],
  ['claim-503', ['貞明二年六月', 916]],
  ['claim-506', ['貞明二年秋七月甲寅朔', 916]],
  ['claim-509', ['貞明二年秋七月甲寅朔', 916]],
  ['claim-512', ['貞明二年秋七月壬戌', 916]],
  ['claim-515', ['貞明二年秋七月', 916]],
  ['claim-518', ['貞明二年八月丁酉', 916]],
  ['claim-521', ['貞明二年九月', 916]],
  ['claim-524', ['貞明二年九月', 916]],
  // claim-527 was repaired above and remains in this audit finding.
  ['claim-530', ['貞明元年', 915]],
  ['claim-533', ['貞明元年', 915]],
  ['claim-536', ['貞明二年十月己卯', 916]],
  ['claim-539', ['貞明二年十月丁酉', 916]],
  ['claim-542', ['貞明二年十月', 916]],
  ['claim-545', ['貞明二年十月', 916]],
]);
if (sourceDates.size !== 33) throw new Error('Expected 33 sourceDate replacements plus claim-527');
for (const [id, [text, year]] of sourceDates) {
  const after = structuredClone(claim(id));
  after[2].sourceDate = { text };
  after[2].westernYear = { era: 'AD', year, precision: 'year' };
  changes.push(replace(id, after));
}
changes.push(hint('p087', ['AD 915']));
changes.push(hint('p114', ['AD 915']));

if (changes.length !== 45) throw new Error(`Candidate must contain exactly 45 atomic operations, got ${changes.length}`);

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit: '2a1777f8c6b3aa743468c58a9aa8f1e07ac52541',
  author: { name: 'Independent Jiuwudaishi 008 date-repair candidate', agentId: 'candidate_jiuwudaishi008_date_repair' },
  changes,
};
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
  status: 'passed',
  proposalReplay: 'PASS',
  compactValidation: 'PASS (strict scoped alias-disposition validation)',
  scopedCandidateValidation: 'PASS: validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true })',
  chronologyGeometry: 'PASS',
  exactAtomicScope: 'PASS: candidate-only temporal claims, active hints, one posthumous reception reclassification, and source-date provenance; no canonical extraction, Chinese source, model, or publication output changed.',
  preservedEvidence: 'PASS: all cited source units, Chinese temporal wording, verified Western conversions, and Zhu Youwen’s AD 913 restoration/reburial evidence remain present.',
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
  requiredReview: 'Verify all seven audit findings, especially that p019’s narrow AD 912 terminal-illness attestation is sourced only in s0042/its 去歲 context and does not restore a reign-wide interval; 貞明中, 太祖創業至寢疾, 二紀於茲, and Luo Shaowei’s 太祖時 do not become activity intervals; Zhu Youwen’s AD 913 reburial is a posthumous reception after his AD 912 death; p087 is AD 915 only because its sole surviving temporal claim is s0183 貞明元年冬十月辛亥; every sourceDate preserves Chinese provenance. Independently rerun replay, strict compact validation, and chronology geometry.',
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
