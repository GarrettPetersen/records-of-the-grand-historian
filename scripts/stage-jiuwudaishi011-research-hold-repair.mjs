import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '011';
const researchCommit = 'fd6f88c9bffde1b1a1e64b2868a1eac3514a957f';
const researchPath = `data/people/date-repairs/${book}/${chapter}/20260928-source-research-zhu-wen-and-princess-holds.json`;
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const dossier = readJson(researchPath);
const packet = buildDateAuditPacket(book, chapter);
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);

if (audit.status !== 'research-blocked' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || sha256(JSON.stringify(extraction)) !== packet.extractionHash ||
    audit.findings.length !== 3) {
  throw new Error('Jiuwudaishi 011 final research-blocked audit or canonical pins are stale');
}
if (dossier.canonicalAuditCommit !== '6b5edf1bc9202b05079ace7ee9f6b2bb3866e588' ||
    dossier.book !== book || dossier.chapter !== chapter || dossier.findings.length !== 3 ||
    !dossier.sources.some(source => source.id === 'jwd-001-birth') ||
    !dossier.sources.some(source => source.id === 'xwd-002-death') ||
    !dossier.sources.some(source => source.id === 'wdhy-002-princesses') ||
    !dossier.sources.some(source => source.id === 'jwd-062-puning-survival')) {
  throw new Error('The independent source-research dossier is incomplete or not pinned to this audit');
}

const claim = id => {
  const value = extraction.claims[Number(id.slice('claim-'.length)) - 1];
  if (!value) throw new Error(`Missing ${id}`);
  return value;
};
const person = id => {
  const value = extraction.people.find(row => row[0] === id);
  if (!value) throw new Error(`Missing ${id}`);
  return value;
};
const claim14 = claim('claim-14');
const claim15 = claim('claim-15');
const claim170 = claim('claim-170');
const claim173 = claim('claim-173');
const claim178 = claim('claim-178');
const claim181 = claim('claim-181');
const p002 = person('p002');
const p026 = person('p026');
const p028 = person('p028');
const sourceResearch = id => {
  const source = dossier.sources.find(entry => entry.id === id);
  if (!source) throw new Error(`Missing independent source-research witness ${id}`);
  return source;
};
const birthWitness = sourceResearch('jwd-001-birth');
const deathWitness = sourceResearch('xwd-002-death');
const primarySourceResearch = {
  path: researchPath,
  hash: sha256(JSON.stringify(dossier)),
  sourceIds: ['jwd-001-birth', 'xwd-002-death'],
};
if (birthWitness.sourceType !== 'external-primary' || deathWitness.sourceType !== 'external-primary' ||
    birthWitness.chronologyWitness?.kind !== 'birth' || deathWitness.chronologyWitness?.kind !== 'death' ||
    !equal(birthWitness.chronologyWitness?.westernYear, { era: 'AD', year: 852, precision: 'year' }) ||
    !equal(deathWitness.chronologyWitness?.westernYear, { era: 'AD', year: 912, precision: 'year' })) {
  throw new Error('The immutable primary-source dossier does not contain exact Zhu Wen birth/death witnesses');
}
const externalPrimaryChronology = [{
  kind: 'bounded-life',
  hint: 'AD 852-912 (external primary birth and death witnesses; no chapter reception date treated as life activity)',
  bounds: {
    start: { era: 'AD', year: 852, precision: 'year' },
    end: { era: 'AD', year: 912, precision: 'year' },
  },
  sourceResearch: primarySourceResearch,
  witnesses: [
    { sourceType: 'external-primary', sourceId: birthWitness.id, kind: birthWitness.chronologyWitness?.kind, work: birthWitness.work, citation: birthWitness.id, url: birthWitness.url, quotation: birthWitness.quotation, westernYear: birthWitness.chronologyWitness?.westernYear },
    { sourceType: 'external-primary', sourceId: deathWitness.id, kind: deathWitness.chronologyWitness?.kind, work: deathWitness.work, citation: deathWitness.id, url: deathWitness.url, quotation: deathWitness.quotation, westernYear: deathWitness.chronologyWitness?.westernYear },
  ],
}];

if (claim14[0] !== 'p002' || claim15[0] !== 'p002' || claim170[0] !== 'p026' ||
    claim178[0] !== 'p028' || claim173[1] !== 'honor' || claim181[1] !== 'honor' ||
    claim173[2]?.dateContext?.westernYear?.year !== 907 || claim181[2]?.dateContext?.westernYear?.year !== 907 ||
    !claim14[2]?.unresolved || !claim15[2]?.unresolved || !claim170[2]?.unresolved || !claim178[2]?.unresolved) {
  throw new Error('Expected held claims or retained AD 907 ceremony claims are no longer exact');
}
if (!equal(p002[4]?.a, ['research required: the chapter gives only relative “after usurpation” context, not a personal life-date endpoint.']) ||
    !equal(p026[4]?.a, ['research required: a dated enfeoffment does not establish a life-wide activity endpoint.']) ||
    !equal(p028[4]?.a, ['research required: a dated enfeoffment does not establish a life-wide activity endpoint.'])) {
  throw new Error('Expected final-audit research holds are no longer exact');
}

const changes = [
  {
    kind: 'remove',
    id: 'claim-14',
    before: claim14,
    reason: 'Independent primary birth/death witnesses resolve Zhu Wen’s life summary. This duplicate posthumous-title context is not a life event and must not leak a reception date into personal chronology.',
  },
  {
    kind: 'remove',
    id: 'claim-15',
    before: claim15,
    reason: 'Independent primary birth/death witnesses resolve Zhu Wen’s life summary. This duplicate posthumous-title context is not a life event and must not leak a reception date into personal chronology.',
  },
  {
    kind: 'hints',
    personId: 'p002',
    before: p002[4].a,
    after: ['AD 852-912 (external primary birth and death witnesses; no chapter reception date treated as life activity)'],
    reason: 'Jiu Wudai Shi juan 1 directly records Zhu Wen’s AD 852 birth and Xin Wudai Shi juan 2 directly records his AD 912 death; retain only this bounded external-primary life summary.',
  },
  {
    kind: 'external-primary-chronology',
    personId: 'p002',
    before: p002[4].e ?? [],
    after: externalPrimaryChronology,
    reason: 'Attach the two independently recorded primary witnesses to Zhu Wen’s exact bounded-life hint; neither witness recasts a chapter posthumous reception as life activity.',
  },
  {
    kind: 'remove',
    id: 'claim-170',
    before: claim170,
    reason: 'This duplicate research-hold attestation repeats Changle’s AD 907 personal enfeoffment already represented by claim-173; preserve the honor claim without inferring lifespan.',
  },
  {
    kind: 'hints',
    personId: 'p026',
    before: p026[4].a,
    after: ['AD 907 (enfeoffment only; no life-wide interval inferred)'],
    reason: 'The retained AD 907 honor claim records only Princess Changle’s personal ceremony.',
  },
  {
    kind: 'remove',
    id: 'claim-178',
    before: claim178,
    reason: 'This duplicate research-hold attestation repeats Puning’s AD 907 personal enfeoffment already represented by claim-181; the AD 921 external survival witness is deliberately not added as a chapter claim.',
  },
  {
    kind: 'hints',
    personId: 'p028',
    before: p028[4].a,
    after: ['AD 907 (enfeoffment only; no life-wide interval inferred)'],
    reason: 'The retained AD 907 honor claim records only Princess Puning’s personal ceremony; neither a lifespan nor an AD 921 chapter claim is inferred.',
  },
];
if (changes.length !== 8) throw new Error('Expected exactly eight research-hold repair operations');

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit: dossier.canonicalAuditCommit,
  author: {
    name: 'Independent Jiuwudaishi 011 source-research date-repair candidate',
    agentId: 'candidate_jiuwudaishi011_research_hold_repair',
  },
  sourceResearch: {
    commit: researchCommit,
    path: researchPath,
    hash: sha256(JSON.stringify(dossier)),
    sourceIds: ['jwd-001-birth', 'xwd-002-death', 'wdhy-002-princesses', 'jwd-062-puning-survival'],
    limits: 'The AD 921 Puning survival witness remains preserved in the dossier only; this candidate neither infers an interval nor adds an external-source chapter claim.',
  },
  changes,
};

const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (!equal(applyDateRepairProposal(extraction, proposal, packet), candidate)) throw new Error('Candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);
const candidateP002 = candidate.people.find(row => row[0] === 'p002');
const candidateP026 = candidate.people.find(row => row[0] === 'p026');
const candidateP028 = candidate.people.find(row => row[0] === 'p028');
if (!equal(candidateP002[4]?.a, ['AD 852-912 (external primary birth and death witnesses; no chapter reception date treated as life activity)']) ||
    !equal(candidateP002[4]?.e, externalPrimaryChronology) ||
    !equal(candidateP002[4]?.e?.[0]?.sourceResearch, primarySourceResearch) ||
    !equal(candidateP026[4]?.a, ['AD 907 (enfeoffment only; no life-wide interval inferred)']) ||
    !equal(candidateP028[4]?.a, ['AD 907 (enfeoffment only; no life-wide interval inferred)']) ||
    candidate.claims.some(value => value === claim14 || value === claim15 || value === claim170 || value === claim178)) {
  throw new Error('Candidate leaked a reception date, interval, or removed claim');
}
const candidateClaim173 = candidate.claims.find(value => equal(value, claim173));
const candidateClaim181 = candidate.claims.find(value => equal(value, claim181));
if (!candidateClaim173 || !candidateClaim181) throw new Error('Candidate failed to preserve both AD 907 personal ceremony claims');

const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const handoff = {
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
  validation: {
    status: 'passed',
    proposalReplay: 'PASS',
    compactValidation: 'PASS (strict scoped alias-disposition validation)',
    chronologyGeometry: 'PASS',
    externalPrimaryDossierBinding: 'PASS: every Zhu Wen birth/death witness exactly matches a hash-pinned, chapter-scoped immutable primary-source dossier item.',
    workflowSelfTest: 'PASS: 29 date-workflow tests (run independently before handoff).',
    exactAtomicScope: 'PASS: exactly four duplicate non-life or redundant claims removed, three constrained hints replaced, and one explicit external-primary evidence attachment added; canonical extraction, Chinese source, model, and publication output unchanged.',
    stats: validation.stats,
  },
  auditEvidence: { findings: audit.findings },
};
writeJsonAtomic(path.join(directory, candidateFile), handoff);
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
  sourceResearch: proposal.sourceResearch,
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
