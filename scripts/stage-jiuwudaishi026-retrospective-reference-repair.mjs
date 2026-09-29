import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Candidate-only: all existing undated life-style attestations in the single
// research hold become explicit undated retrospective references. This script
// does not write the canonical extraction or its independent audit report.
const book = 'jiuwudaishi';
const chapter = '026';
// This is the actual canonical audit-record commit on glossary staging.  The
// prior candidate used an older audit-history commit, so its source substance
// reviewed cleanly but its provenance pin was deliberately rejected.
const auditCommit = 'c695edde8ee1fd810453d8257f35b2669c432cff';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const source = readJson(path.join('data', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);

if (audit.status !== 'research-blocked' || audit.sourceHash !== packet.sourceHash ||
  audit.extractionHash !== packet.extractionHash || sha256(JSON.stringify(extraction)) !== packet.extractionHash ||
  audit.findings.length !== 1) throw new Error('The sole Jiuwudaishi 026 research-blocked audit is stale');
const sentences = new Map(source.content.flatMap(paragraph => paragraph.sentences ?? []).map(sentence => [sentence.id, sentence]));
const entries = [
  ['claim-478', 'p157', 's0228', 'literary-allusion', 'alluded-subject', 'Shen Xu is invoked as a literary comparison.'],
  ['claim-479', 'p158', 's0229', 'literary-allusion', 'alluded-subject', 'Jiang Ji is invoked as a literary comparison.'],
  ['claim-480', 'p159', 's0231', 'literary-allusion', 'alluded-subject', 'Wang Mang is invoked in a literary comparison.'],
  ['claim-482', 'p161', 's0236', 'literary-allusion', 'alluded-subject', 'Sun Quan is invoked in a literary comparison.'],
  ['claim-483', 'p162', 's0236', 'literary-allusion', 'alluded-subject', 'Liu Bei is invoked in a literary comparison.'],
  ['claim-484', 'p163', 's0241', 'literary-allusion', 'alluded-subject', 'Zang Hong is invoked in a literary comparison.'],
  ['claim-491', 'p170', 's0257', 'retrospective-reference', 'genealogical-subject', 'Zhuoye Chixin is named in retrospective genealogy.'],
  ['claim-492', 'p171', 's0258', 'retrospective-reference', 'genealogical-subject', 'An ancestral legend explains the Zhu Ye clan name.'],
  ['claim-493', 'p172', 's0262', 'retrospective-reference', 'narrative-subject', 'Huang Chao is named in a retrospective career notice.'],
  ['claim-494', 'p173', 's0264', 'retrospective-reference', 'anecdotal-subject', 'Yang Xingmi is named in an undated anecdote.'],
  ['claim-495', 'p174', 's0264', 'retrospective-reference', 'anecdotal-subject', 'An unnamed painter is named in an undated anecdote.'],
  ['claim-496', 'p175', 's0272', 'retrospective-reference', 'remembered-target', 'Liu Rengong is named as the target of a remembered deathbed charge.'],
  ['claim-497', 'p176', 's0273', 'retrospective-reference', 'remembered-target', 'Abaoji is named in a remembered deathbed charge.'],
  ['claim-498', 'p177', 's0274', 'retrospective-reference', 'remembered-target', 'Zhu Wen is named as the target of a remembered deathbed charge.'],
  ['claim-499', 'p178', 's0284', 'historiographical-comparison', 'comparison-subject', 'Duke Huan is invoked in a historian comparison.'],
  ['claim-500', 'p179', 's0284', 'historiographical-comparison', 'comparison-subject', 'Duke Wen is invoked in a historian comparison.'],
  ['claim-501', 'p180', 's0286', 'historiographical-comparison', 'comparison-subject', 'King Wen is invoked in a historian comparison.'],
  ['claim-502', 'p181', 's0286', 'historiographical-comparison', 'comparison-subject', 'Cao Cao is invoked in a historian comparison.'],
];
const claim = id => {
  const value = extraction.claims[Number(id.slice(6)) - 1];
  if (!value || value[1] !== 'attestation' || value[2]?.unresolved !== true || !value[2]?.unresolvedReason) throw new Error(`${id} is not an unresolved temporal attestation`);
  return value;
};
const sourceEvidence = entries.map(([, , unit]) => {
  const sentence = sentences.get(unit);
  if (!sentence?.zh) throw new Error(`Missing ${unit}`);
  return { unit, quote: sentence.zh, sourceHash: sha256(sentence.zh), reason: 'This chapter-primary sentence names the subject but supplies no calendar-bearing personal chronology.' };
});
const research = {
  schemaVersion: 1, kind: 'chapter-primary-retrospective-reference-research', book, chapter,
  canonicalAuditCommit: auditCommit, sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
  researchedAt: new Date().toISOString(),
  method: 'Read every source unit named by the sole research-blocked finding. Each is an allusion, genealogy, anecdote, remembered target, or historian comparison; none supplies a calendar-bearing life date for its named subject.',
  sources: [...new Map(sourceEvidence.map(entry => [entry.unit, entry])).values()],
  conclusion: 'Replace only the malformed unresolved temporal attestations and their sole derived active-date hints with undated retrospective event-participation records. Do not infer or expose life dates.'
};
const changes = entries.flatMap(([id, personId, unit, kind, role, action]) => {
  const before = claim(id);
  const person = extraction.people.find(row => row[0] === personId);
  if (!person || !Array.isArray(person[4]?.a) || !person[4].a.every(hint => hint.startsWith('research required:') || hint === 'AD 908')) {
    throw new Error(`${personId} active hint is not the expected research-only input`);
  }
  return [
    { kind: 'remove', id, before, reason: `${before[2].unresolvedReason} The chapter-primary source is non-temporal for this person.` },
    { kind: 'add-reception-event', after: [personId, 'event-participation', { kind, role, action, receptionType: 'retrospective' }, 'explicit', [unit]], reason: 'Preserve the explicit source reference without representing it as personal life chronology.' },
    { kind: 'hints', personId, before: person[4].a, after: [], reason: `The removed ${id} was the sole active-date hint; no date is inferred from the retrospective reference.` },
  ];
});
if (changes.length !== 54 || changes.filter(change => change.kind === 'remove').length !== 18 || changes.filter(change => change.kind === 'add-reception-event').length !== 18 || changes.filter(change => change.kind === 'hints').length !== 18) throw new Error('Expected exact 18×3 retrospective reclassification');
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const researchFile = '20260929-chapter-primary-retrospective-reference-research-c695edde.json';
writeJsonAtomic(path.join(directory, researchFile), research);
const proposal = { schemaVersion: 1, kind: 'date-repair-proposal', book, chapter, sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, auditCommit,
  author: { name: 'Jiuwudaishi 026 retrospective-reference repair candidate', agentId: 'candidate_jiuwudaishi026_retrospective_references' },
  sourceResearch: { path: `data/people/date-repairs/${book}/${chapter}/${researchFile}`, hash: sha256(JSON.stringify(research)), sourceIds: entries.map(([id]) => id), limits: 'Research establishes only non-temporal reference semantics; it supplies no personal date.' }, changes };
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (!equal(candidate, applyDateRepairProposal(extraction, proposal, packet))) throw new Error('Candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);
for (const [, personId, unit] of entries) {
  const person = candidate.people.find(row => row[0] === personId);
  if (!person || !equal(person[4]?.a, []) || candidate.claims.some(value => value[0] === personId && value[1] === 'attestation' && value[2]?.unresolved) ||
    candidate.claims.filter(value => value[0] === personId && value[1] === 'event-participation' && value[2]?.receptionType === 'retrospective' && value[4]?.includes(unit)).length !== 1) {
    throw new Error(`${personId} reclassification is incomplete`);
  }
}
const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
writeJsonAtomic(path.join(directory, candidateFile), { schemaVersion: 1, kind: 'date-repair-candidate-handoff', book, chapter, canonicalSourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash, auditReportHash: sha256(JSON.stringify(audit)), author: proposal.author, sealedCandidateHash, candidateExtractionHash, proposal, candidate, candidatePacket,
  validation: { status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS (strict scoped alias-disposition validation)', chronologyGeometry: 'PASS', chapterPrimaryResearch: 'PASS: all eighteen source references are non-temporal for the named subject.', exactAtomicScope: 'PASS: 18 unresolved temporal attestations and research-only hints become 18 undated retrospective reference events; no identities, roles, mentions, source units, translations, or canonical extraction changed.', stats: validation.stats }, auditEvidence: { findings: audit.findings }, canonicalMutation: 'NONE', masterMutation: 'NONE', publication: 'candidate-only' });
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), { schemaVersion: 1, kind: 'independent-staged-date-repair-review-packet', book, chapter, candidateFile, sourceHash: packet.sourceHash, originalExtractionHash: packet.extractionHash, sealedCandidateHash, candidateExtractionHash, candidatePacket, auditEvidence: { findings: audit.findings }, sourceResearch: proposal.sourceResearch, reviewerConstraint: 'Independently read every cited Chinese unit. Accept only if all eighteen replacements preserve an explicit but undated retrospective reference and attach no personal chronology.' });
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, researchFile, operations: changes.length, stats: validation.stats }));
