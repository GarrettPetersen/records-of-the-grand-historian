import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '136';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);

const findingIds = [
  'allusive-han-sheng', 'liu-bei-precedent', 'work-title-not-author-life',
  'zhang-mengyang-quotation', 'wang-yan-retrospective-fate',
  'du-guangting-undated-exam', 'meng-ancestral-office-background',
  'meng-uncles-undated-ranks',
];
if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || audit.findings.length !== findingIds.length ||
    JSON.stringify(audit.findings.map(finding => finding.id).sort()) !== JSON.stringify([...findingIds].sort())) {
  throw new Error('Jiuwudaishi 136 initial audit is stale or is not the expected eight-group repair state');
}
const findingFor = id => {
  const finding = audit.findings.find(entry => entry.id === id);
  if (!finding) throw new Error(`Missing ${id} audit finding`);
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
const expectClaim = (id, subject, predicate, sourceText) => {
  const value = claim(id);
  if (value[0] !== subject || value[1] !== predicate ||
      value[2]?.sourceDate?.text !== sourceText && value[2]?.dateContext?.sourceDate?.text !== sourceText) {
    throw new Error(`${id} drifted from its audited source fact`);
  }
  return value;
};
const expectHints = (id, expected) => {
  const actual = person(id)[4]?.a ?? [];
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${id} active-date hints drifted from audit input`);
  return actual;
};

const changes = [];
const remove = (id, subject, predicate, sourceText, reason) => {
  const before = expectClaim(id, subject, predicate, sourceText);
  changes.push({ kind: 'remove', id, before, reason });
};
const reception = (subject, sourceDate, role, action, event, evidence, reason) => {
  changes.push({
    kind: 'add-reception-event',
    after: [subject, 'event-participation', {
      kind: 'retrospective-reference', role, action, receptionType: 'retrospective',
      sourceDate: { text: sourceDate }, event,
    }, 'explicit', evidence],
    reason,
  });
};
const hints = (personId, before, after, reason) => {
  expectHints(personId, before);
  changes.push({ kind: 'hints', personId, before, after, reason });
};
const undatedAttestation = (id, subject, sourceText, reason) => {
  const before = expectClaim(id, subject, 'attestation', sourceText);
  const after = structuredClone(before);
  delete after[2].sourceDate;
  delete after[2].westernYear;
  delete after[2].westernInterval;
  delete after[2].westernBounds;
  after[2].undatedSourceAttestation = true;
  after[2].event = `The chapter records “${sourceText}” as an undated personal fact; it gives no reign, year, or independently bounded sequence.`;
  changes.push({ kind: 'replace', id, before, after, reason });
};

// The first five groups are references to earlier figures or works.  They stay
// visible as reception/provenance events, never as evidence of personal activity.
findingFor('allusive-han-sheng');
remove('claim-440', 'p035', 'attestation', '韓生所謂',
  '“韓生所謂” is an undated allusion. Remove the imported Han Feizi life interval rather than treating this later quotation as a life attestation.');
reception('p035', '韓生所謂', 'alluded-author', 'alluded',
  'The chapter invokes Master Han as an earlier authority; it supplies no chronology for the cited figure.', ['s0077'],
  'Preserve the allusion as a retrospective reference, not a dated personal event.');
hints('p035', ['BC 280-233'], [],
  'Remove the active-life hint imported from an unpinned identification; the remaining record is a reception-only allusion.');

findingFor('liu-bei-precedent');
remove('claim-407', 'p040', 'event-participation', '劉備故事',
  'The request to follow “Liu Bei’s precedent” is a Later Liang-era comparison, not an AD 221 political act by Liu Bei in this chapter.');
remove('claim-445', 'p040', 'attestation', '劉備故事',
  'The precedent citation contains no direct dated life attestation for Liu Bei and cannot carry the imported AD 221 label.');
reception('p040', '請建行劉備故事', 'precedent', 'invoked-as-precedent',
  'The chapter invokes Liu Bei as a precedent for declaring emperorship; this is not a contemporaneous event by Liu Bei.', ['s0081'],
  'Preserve the rhetorical precedent as a retrospective reference while separating it from Liu Bei’s life chronology.');
hints('p040', ['AD 221'], [],
  'Remove the unsupported active-life hint derived solely from the precedent citation.');

findingFor('work-title-not-author-life');
remove('claim-784', 'p078', 'attestation', '歐陽史',
  '“Ouyang History” is a cited work title, not a dated act by an identified Ouyang author in this chapter.');
reception('p078', '歐陽史', 'cited-author', 'source-work-referenced',
  'The chapter cites the work called Ouyang History; the citation is source-work provenance, not a personal activity date.', ['s0166'],
  'Preserve the work citation as retrospective source provenance without asserting authorial activity in AD 1071.');
hints('p078', ['AD 1071'], [],
  'Remove the personal active-date hint imported from a cited work title.');
remove('claim-789', 'p079', 'attestation', '薛史',
  '“Xue History” is a cited work title, not a dated act by Xue Juzheng in this chapter.');
reception('p079', '薛史', 'cited-author', 'source-work-referenced',
  'The chapter contrasts its account with Xue History; this is source-work provenance, not evidence of an author’s AD 974 activity.', ['s0169'],
  'Preserve the work citation as retrospective source provenance without asserting authorial activity.');
hints('p079', ['AD 974'], [],
  'Remove the personal active-date hint imported from a cited work title.');

findingFor('zhang-mengyang-quotation');
remove('claim-945', 'p092', 'attestation', '張孟陽為《劍閣銘》',
  'The quotation attributes the Sword Gate Inscription but supplies no Western chronology for Zhang Mengyang; remove the imported AD 280–289 interval.');
reception('p092', '昔張孟陽為《劍閣銘》云', 'quoted-author', 'quoted-work',
  'The historian quotes Zhang Mengyang’s Sword Gate Inscription as an earlier literary authority; no date is given here.', ['s0211'],
  'Preserve the quotation as a retrospective literary reference, not a dated life attestation.');
hints('p092', ['AD 280-289'], [],
  'Remove the imported active-life interval from an otherwise undated quotation.');

findingFor('wang-yan-retrospective-fate');
remove('claim-916', 'p096', 'event-participation', '王衍之遭季世',
  'The sentence retrospectively compares Wang Yan’s fate and gives no AD 925–926 event date for this record.');
remove('claim-949', 'p096', 'attestation', '王衍之遭季世也，則赤族於秦川',
  'The rhetorical comparison is not a dated personal attestation and cannot support an AD 925–926 life interval.');
reception('p096', '王衍之遭季世也，則赤族於秦川', 'recalled-example', 'fate-recalled',
  'The chapter recalls Wang Yan’s fate as a rhetorical comparison; it does not date a personal event in this source.', ['s0215'],
  'Preserve the retrospective comparison separately from personal chronology.');
hints('p096', ['AD 925-926'], [],
  'Remove the unsupported active-life interval derived from the retrospective comparison.');

// These three groups remain genuine chapter facts, but the chapter provides no
// chronology.  Retain them as explicit research-required source attestations.
findingFor('du-guangting-undated-exam');
undatedAttestation('claim-661', 'p067', '應九經舉不第',
  'The examination failure is a direct source fact, but no reign, year, or bounded sequence supports the imported AD 874–880 interval.');
hints('p067', ['AD 874-885', 'AD 891-918'], ['AD 891-918'],
  'Remove only the examination-derived imported interval; retain the chapter’s independently supported later activity hint.');

findingFor('meng-ancestral-office-background');
undatedAttestation('claim-742', 'p071', '世為郡校',
  'The ancestral office background is a direct source fact but has no temporal endpoint for Meng Cha; retain it as source-limited rather than importing AD 870–890.');
undatedAttestation('claim-746', 'p072', '世為郡校',
  'The ancestral office background is a direct source fact but has no temporal endpoint for Meng Dao; retain it as source-limited rather than importing AD 870–890.');
hints('p071', ['AD 870-890'], [],
  'Remove the inherited active-life interval; the retained attestation is explicitly source-limited.');
hints('p072', ['AD 870-890'], [],
  'Remove the inherited active-life interval; the retained attestation is explicitly source-limited.');

findingFor('meng-uncles-undated-ranks');
undatedAttestation('claim-750', 'p073', '終於邢洺節度使',
  'The stated final rank is a direct source fact but has no year; retain it as source-limited rather than importing AD 880–889.');
undatedAttestation('claim-754', 'p074', '位至澤潞節度使',
  'The stated final rank is a direct source fact but has no year; retain it as source-limited rather than importing AD 880–890.');
hints('p073', ['AD 880-889'], [],
  'Remove the unsupported active-life interval; the retained rank attestation is explicitly source-limited.');
hints('p074', ['AD 880-890'], [],
  'Remove the unsupported active-life interval; the retained rank attestation is explicitly source-limited.');

if (changes.length !== 30) throw new Error(`Expected 30 atomic operations across eight audit groups, got ${changes.length}`);
const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit: 'b88bb653ad764cd02e020502bf24141dd3e94ec2',
  author: { name: 'Codex Jiuwudaishi 136 source-faithful chronology repair candidate', agentId: 'candidate_jwd136' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
if (candidate.people.length !== extraction.people.length || candidate.claims.length !== extraction.claims.length - 2) {
  throw new Error('Repair must preserve people and replace eight stale claims with six explicit reception records');
}
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
    exactAtomicScope: 'PASS: 30 operations cover exactly the eight audit findings; source, people, surfaces, and unrelated claims are untouched.',
    preservedEvidence: 'PASS: allusions, precedents, work citations, quotations, and rhetorical recall become explicit retrospective references; direct but undated examination, ancestral-office, and rank facts remain research-required source attestations.',
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
