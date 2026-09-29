import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// This is candidate-only. The independent final audit remains research-blocked
// until a separate reviewer accepts this exact sealed proposal.
const book = 'jiuwudaishi';
const chapter = '013';
const auditCommit = '1c5adfd15c0a3b46c2660864c56a66a749402925';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);

if (audit.status !== 'research-blocked' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || sha256(JSON.stringify(extraction)) !== packet.extractionHash ||
    audit.findings.length !== 2) {
  throw new Error('Jiuwudaishi 013 final research-blocked audit or canonical pins are stale');
}

const held = [
  {
    claimId: 'claim-231',
    personId: 'p042',
    unit: 's0061',
    work: { en: 'Separate Record of Jiangnan', zh: '江南別錄' },
    citation: '陳彭年《江南別錄》云',
    expectedHint: 'research required: Northern Song author; citation date not personal activity of subjects',
    quote: '〈（陳彭年《江南別錄》云：徐知訓初學兵法於朱瑾，瑾悉心教之。',
  },
  {
    claimId: 'claim-233',
    personId: 'p044',
    unit: 's0079',
    work: { en: 'History of Southern Tang', zh: '南唐書' },
    citation: '馬令《南唐書》云',
    expectedHint: 'research required: Song author of Nan Tang shu; not a contemporary actor',
    quote: '〈（馬令《南唐書》云：初，宿衛將李球、馬謙挾楊隆演登樓，取庫兵以誅知訓，陣於門橋。',
  },
];

const claim = ({ claimId, personId, unit }) => {
  const value = extraction.claims[Number(claimId.slice('claim-'.length)) - 1];
  if (!value || value[0] !== personId || value[1] !== 'attestation' || value[4]?.join(',') !== unit ||
      value[2]?.unresolved !== true || typeof value[2]?.unresolvedReason !== 'string') {
    throw new Error(`${claimId} is not the expected unresolved cited-author attestation`);
  }
  return value;
};
const person = ({ personId, expectedHint }) => {
  const value = extraction.people.find(row => row[0] === personId);
  if (!value || !equal(value[4]?.a, [expectedHint])) throw new Error(`${personId} active hint changed before curation`);
  return value;
};
const finding = ({ claimId }) => {
  const value = audit.findings.find(entry => equal(entry.items, [claimId]));
  if (!value) throw new Error(`Missing final-audit research hold for ${claimId}`);
  return value;
};

const research = {
  schemaVersion: 1,
  kind: 'chapter-primary-citation-research',
  book,
  chapter,
  canonicalAuditCommit: auditCommit,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  researchedAt: new Date().toISOString(),
  method: 'Read the two cited chapter-primary units directly. The quoted wording identifies an author and work but supplies no calendar-bearing date for either author; no external life date is inferred.',
  sources: held.map(entry => ({
    id: entry.claimId,
    sourceType: 'chapter-primary',
    unit: entry.unit,
    quote: entry.quote,
    sourceHash: sha256(entry.quote),
    finding: `${entry.citation} is bibliographic attribution, not temporal evidence.`,
  })),
  conclusion: 'Remove the two malformed temporal attestations and their research-required active hints. Preserve each citation as an undated retrospective bibliographic-citation event; this changes no person identity, role, mention, source unit, or life chronology.',
};

const changes = held.flatMap(entry => {
  const before = claim(entry);
  const owner = person(entry);
  const auditFinding = finding(entry);
  return [
    {
      kind: 'remove',
      id: entry.claimId,
      before,
      reason: `${auditFinding.problem} Direct reading of ${entry.unit} confirms the citation names a work and author but has no calendar-bearing temporal assertion.`,
    },
    {
      kind: 'add-reception-event',
      after: [entry.personId, 'event-participation', {
        kind: 'bibliographic-citation',
        role: 'cited-authority',
        action: `${entry.work.en} is cited as retrospective historical authority.`,
        receptionType: 'retrospective',
      }, 'explicit', [entry.unit]],
      reason: `Preserve the source-backed ${entry.citation} citation without representing it as an event in the author's life.`,
    },
    {
      kind: 'hints',
      personId: entry.personId,
      before: owner[4].a,
      after: [],
      reason: `The removed ${entry.claimId} was the sole basis for this research-required active hint; the chapter supplies no personal chronological datum to replace it.`,
    },
  ];
});
if (changes.length !== 6 || changes.filter(change => change.kind === 'remove').length !== 2 ||
    changes.filter(change => change.kind === 'add-reception-event').length !== 2 ||
    changes.filter(change => change.kind === 'hints').length !== 2) {
  throw new Error('Residual citation repair must have exactly two removals, two retrospective citations, and two hint removals');
}

const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const researchFile = '20260928-chapter-primary-research-chen-pengnian-ma-ling-citations.json';
writeJsonAtomic(path.join(directory, researchFile), research);

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit,
  author: {
    name: 'Jiuwudaishi 013 residual cited-author chronology curation candidate',
    agentId: 'curate_jiuwudaishi013_residual_holds',
  },
  sourceResearch: {
    path: `data/people/date-repairs/${book}/${chapter}/${researchFile}`,
    hash: sha256(JSON.stringify(research)),
    sourceIds: held.map(entry => entry.claimId),
    limits: 'The research establishes only that the two chapter citations are non-temporal. It does not supply, infer, or attach a life date for either author.',
  },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (!equal(applyDateRepairProposal(extraction, proposal, packet), candidate)) throw new Error('Candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);
for (const entry of held) {
  const candidatePerson = candidate.people.find(row => row[0] === entry.personId);
  if (!candidatePerson || !equal(candidatePerson[4]?.a, []) ||
      candidate.claims.some(value => equal(value, claim(entry)))) {
    throw new Error(`${entry.personId} residual citation repair did not have exact scope`);
  }
}

const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
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
    chapterPrimaryResearch: 'PASS: both cited source units identify retrospective bibliographic authorities and contain no calendar-bearing author chronology.',
    exactAtomicScope: 'PASS: two malformed temporal attestations and their paired research-only hints are removed; two source-backed undated retrospective bibliographic-citation events are added. No identities, roles, mentions, source units, translation, or canonical extraction changed.',
    stats: validation.stats,
  },
  auditEvidence: { findings: audit.findings },
  status: 'candidate-only; current canonical audit remains research-blocked pending independent review and host acceptance',
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
  reviewerConstraint: 'Review the two chapter-primary citations independently. Do not infer author life dates; accept only if each replacement preserves citation evidence without temporal leakage.',
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, researchFile, operations: changes.length, stats: validation.stats }));
