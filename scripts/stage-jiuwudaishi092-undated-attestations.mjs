import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '092';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);

// These are source-backed identifications, offices, relationships, or allusions.
// None supplies a date-bearing expression for the individual named in the claim.
const undatedEvents = new Map([
  ['claim-20', 'The genealogy identifies Yao Xiqi as Yao Yi’s great-grandfather and a Tang Huzhou staff-merit officer; it gives no personal date.'],
  ['claim-25', 'The genealogy identifies Yao Hongqing as Yao Yi’s grandfather and prefect of Suzhou; it gives no personal date.'],
  ['claim-29', 'The genealogy identifies Yao Jing as Yao Yi’s father and chancellor of the Directorate of Education; it gives no personal date.'],
  ['claim-116', 'The genealogy identifies Lü Shou as Lü Qi’s grandfather and recorder of Jingcheng in Yingzhou; it gives no personal date.'],
  ['claim-306', 'The biography identifies Jing as Wenju’s father and vice director of the Secretariat; it gives no date for Jing’s officeholding.'],
  ['claim-437', 'The genealogy identifies Zeng as Shi Gui’s great-grandfather and a military clerk at Zhenyang; it gives no personal date.'],
  ['claim-445', 'The genealogy identifies Jun as Shi Gui’s father and acting magistrate of Anping and Jiumen; it gives no personal date.'],
  ['claim-450', 'The genealogy entails an unnamed grandfather between Zeng and Jun in Shi Gui’s paternal line, but supplies no date for him.'],
  ['claim-614', 'The biography identifies Wu Qiong as the father of Wu Weizhou and general of the Right Gold Crow Guard; it gives no personal date.'],
  ['claim-704', 'The genealogy identifies Lu Boqing as an attending censor in the palace and ancestor of the later Lu family member; it gives no personal date.'],
  ['claim-710', 'The genealogy identifies Lu Ruhui as assistant director of the Directorate of Education and father of the later Lu family member; it gives no personal date.'],
  ['claim-798', 'The genealogy identifies Zheng Yin as a Tang chief minister and Zheng Taoguang’s great-grandfather; it gives no date for his officeholding.'],
  ['claim-808', 'The genealogy identifies Zheng Zhide as chancellor of the Directorate of Education and Zheng Taoguang’s grandfather; it gives no date for his officeholding.'],
  ['claim-816', 'The genealogy identifies Zheng Hao as prefect of Henan and Zheng Taoguang’s father; it gives no date for his officeholding.'],
  ['claim-899', 'The genealogy identifies Wang Qi as Left Vice Director and Shannan West military commissioner; it gives no date for either office.'],
  ['claim-906', 'The genealogy identifies Wang Gui as Zhedong observation commissioner; it gives no date for that officeholding.'],
  ['claim-912', 'The genealogy identifies Wang Rao as a vice director of the Right Department; it gives no date for that officeholding.'],
  ['claim-976', 'The genealogy identifies Han Jun as a Tang Dragon Martial Guard general and great-grandfather of the later Han family member; it gives no personal date.'],
  ['claim-979', 'The genealogy identifies Han Shize as a military adjutant of Shi Prefecture and grandfather of the later Han family member; it gives no personal date.'],
  ['claim-982', 'The genealogy identifies Han Kui as prefect of Dai Prefecture and father of the later Han family member; it gives no personal date.'],
  ['claim-1048', 'The genealogy identifies Li Bao as Qiannan observation commissioner and grandfather of the later Li family member; it gives no personal date.'],
  ['claim-1050', 'The genealogy identifies Li Zhao as minister of revenue and father of the later Li family member; it gives no personal date.'],
  ['claim-355', 'The passage invokes the Marquis of Liu as a retrospective historical exemplar; it supplies no date for the referenced man in this source.'],
  ['claim-430', 'The genealogy says Shi Gui’s forebears came from beyond the frontier with Wang Wujun; it gives no date for Wang Wujun’s activity.'],
  ['claim-822', 'The genealogy identifies Tang Emperor Xuanzong as Princess Wanshou’s father; it gives no date for the ruler in this kinship statement.'],
  ['claim-829', 'The genealogy identifies Princess Wanshou as Zheng Taoguang’s mother and Xuanzong’s daughter; it gives no date for her life or activity.'],
]);
const dateContextTargets = new Set(['claim-751', 'claim-752']);
const findingFor = id => audit.findings.find(finding => finding.items.includes(id));

if (audit.status !== 'needs-revision' || audit.findings.length !== 2 ||
    [...undatedEvents.keys(), ...dateContextTargets].some(id => !findingFor(id))) {
  throw new Error('Jiuwudaishi 092 audit is not at the expected 28-item source-overprecision repair state');
}

const changes = [];
const repairedPeople = new Set();
for (const [claimId, event] of undatedEvents) {
  const before = extraction.claims[Number(claimId.slice(6)) - 1];
  if (!before || before[1] !== 'attestation' || !before[2]?.westernInterval || !Array.isArray(before[4]) || !before[4].length) {
    throw new Error(`${claimId} is not the expected dated attestation`);
  }
  const after = structuredClone(before);
  after[2] = { undatedSourceAttestation: true, event };
  changes.push({ kind: 'replace', id: claimId, before, after, reason: findingFor(claimId).action });
  repairedPeople.add(before[0]);
}

for (const claimId of dateContextTargets) {
  const before = extraction.claims[Number(claimId.slice(6)) - 1];
  if (!before || before[0] !== 'p066' || !before[2]?.dateContext?.westernInterval ||
      before[2].dateContext.sourceDate?.text !== '生三日') {
    throw new Error(`${claimId} is not the expected hereditary-grant date context`);
  }
  const after = structuredClone(before);
  delete after[2].dateContext;
  changes.push({
    kind: 'replace', id: claimId, before, after,
    reason: 'The three-day hereditary grant remains recorded for Zheng Taoguang, but the source supplies no Western date for that birth-relative grant and cannot support an AD 846–861 interval.',
  });
}

for (const personId of repairedPeople) {
  const person = extraction.people.find(row => row[0] === personId);
  if (!person || !Array.isArray(person[4]?.a) || !person[4].a.length) throw new Error(`${personId} lacks active-date hints`);
  const before = person[4].a;
  const after = before.filter(hint => !/^Tang dynasty AD 618-907$|^AD 782-850$|^AD 870-898$|^AD 800-870$|^AD 890-920$|^AD 820-870$|^AD 860-900$|^AD 811-816$|^AD 840-860$|^AD 849-860$|^AD 820-847$|^AD 850-873$|^AD 870-900$|^AD 618-907$|^BC 209-186$|^AD 782-801$|^AD 846-859$|^AD 907-923$/.test(hint));
  if (after.length === before.length) throw new Error(`${personId} has no matching unsupported active-date hint`);
  changes.push({
    kind: 'hints', personId, before, after,
    reason: 'Remove the active-date hint copied from the unsupported interval; the repaired source attestation remains explicitly undated.',
  });
}

if (changes.length !== 54) throw new Error(`Expected 54 bounded repairs, received ${changes.length}`);
const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: { name: 'Codex Jiuwudaishi 092 source-faithful undated-attestation repair candidate', agentId: 'date_repair_candidate_jiuwudaishi092' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
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
  validation: { status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats },
  auditEvidence: { findings: audit.findings },
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter,
  candidateFile, sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash,
  sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence: { findings: audit.findings },
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
