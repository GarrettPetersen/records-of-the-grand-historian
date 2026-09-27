import fs from 'node:fs';
import path from 'node:path';
import {
  actionableDateAuditItems,
  buildDateAuditPacket,
  dateAuditDiagnostics,
  dateAuditItems,
} from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '135';
const auditCommit = '61f6c7d919c051fb51be25b570754f293e54ec06';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || audit.findings.length !== 4) {
  throw new Error('Jiuwudaishi 135 audit is stale or not the expected four-group repair state');
}

const actionable = actionableDateAuditItems(audit);
const expected = { claims: 56, hints: 56, total: 112 };
if (actionable.filter(id => id.startsWith('claim-')).length !== expected.claims ||
    actionable.filter(id => id.startsWith('hints-')).length !== expected.hints ||
    actionable.length !== expected.total) {
  throw new Error(`Unexpected JWD135 actionable scope: ${JSON.stringify(actionable)}`);
}
const included = new Set(actionable);
const assertIncluded = id => {
  if (!included.has(id)) throw new Error(`Audit did not mark ${id} incorrect`);
};
const changes = [];

function claim(claimId, personId, predicate) {
  assertIncluded(claimId);
  const before = extraction.claims[Number(claimId.slice(6)) - 1];
  if (!before || before[0] !== personId || before[1] !== predicate) {
    throw new Error(`${claimId} drifted from the audited person or predicate`);
  }
  return before;
}

function replace(claimId, personId, predicate, transform, reason) {
  const before = claim(claimId, personId, predicate);
  const after = structuredClone(before);
  after[2] = transform(after[2]);
  changes.push({ kind: 'replace', id: claimId, before, after, reason });
}

function hint(personId, after, reason) {
  const id = `hints-${personId}`;
  assertIncluded(id);
  const person = extraction.people.find(row => row[0] === personId);
  if (!person || !Array.isArray(person[4]?.a)) throw new Error(`${personId} lacks auditable active-date hints`);
  changes.push({ kind: 'hints', personId, before: person[4].a, after, reason });
}

const unresolvedSequence = (sourceDate, detail) => ({
  sourceDate: { text: sourceDate },
  unresolved: true,
  unresolvedReason: `${detail} The Chinese sequence supplies no independent Western endpoint, so the former AD 900–905 interval is removed pending focused source research.`,
  event: 'The narrative records this person in an undated sequence following the Guanghua-era context.',
});

for (const [id, personId, sourceDate] of [
  ['claim-114', 'p018', '十月'],
  ['claim-126', 'p029', '營於乾寧軍'],
  ['claim-127', 'p030', '乞師於晉'],
  ['claim-128', 'p031', '十月'],
]) {
  replace(id, personId, 'attestation', value => unresolvedSequence(sourceDate,
    `The source label ${JSON.stringify(value.sourceDate?.text)} is a relative narrative context, not a dated five-year life window.`),
  'The cited Guanghua-era narrative does not establish the imported AD 900–905 interval. Preserve the Chinese attestation as source-limited rather than treating contextual sequence as sustained personal activity.');
}
hint('p018', ['AD 898–899 (directly dated Cangzhou and Guanghua-year attestations; later sequence unresolved)'],
  'Retain the two independently explicit Guanghua-era attestations while removing the unsupported AD 900–901 activity endpoint inherited from the later undated sequence.');
for (const personId of ['p029', 'p030', 'p031']) hint(personId,
  ['research required: Qianning Army sequence is undated in this chapter'],
  'Remove the synthetic AD 901 active hint. The cited narrative attests the person or event but does not establish a Western activity date.');

replace('claim-261', 'p051', 'attestation', value => ({
  sourceDate: { text: value.sourceDate.text },
  unresolved: true,
  unresolvedReason: '“及莊宗有柏鄉之捷” is relative sequence, not an AD 911 point date. This chapter supplies no independently converted Western date for the Baixiang reference.',
  event: 'The source places Liu Shouguang’s plan after the Baixiang victory without dating that plan in Western chronology.',
}), 'Replace the unsupported AD 911 point with a source-limited relative attestation; retain the dated August accession separately.');
hint('p051', ['AD 911 (August accession); Baixiang sequence date unresolved'],
  'Keep the independently explicit August 911 accession while making clear that the separate Baixiang sequence has no source-supported point date.');

replace('claim-280', 'p052', 'death', value => ({
  ...value,
  dateContext: {
    sourceDate: { text: value.dateContext.sourceDate.text },
    westernBounds: { onOrBefore: { era: 'AD', year: 911, precision: 'year' } },
  },
}), 'The execution occurs before Liu Shouguang’s August 911 accession. Use an inclusive upper bound, not a false point date, because the execution may have occurred earlier in the same year.');
hint('p052', ['on or before AD 911 (execution before the August accession)'],
  'Replace the false point-year activity hint with the one-sided chronology explicitly preserved by the source sequence.');

const importedClaims = actionable.filter(id => id.startsWith('claim-')).slice(6);
if (importedClaims.length !== 50) throw new Error(`Expected 50 imported-date claims, got ${importedClaims.length}`);
for (const id of importedClaims) {
  const before = extraction.claims[Number(id.slice(6)) - 1];
  if (!before || before[1] !== 'attestation' || !before[2]?.sourceDate?.text?.startsWith('AD ')) {
    throw new Error(`${id} is not an imported English-date attestation`);
  }
  const sourceLimitedRequired = new Map([
    ['p115', '鋹，晟長子也。'],
    ['p126', '署其子承鈞為侍衛親軍都指揮使'],
  ]);
  replace(id, before[0], 'attestation', () => sourceLimitedRequired.has(before[0]) ? ({
    sourceDate: { text: sourceLimitedRequired.get(before[0]) },
    unresolved: true,
    unresolvedReason: 'The cited Chinese kinship or contextual sentence identifies the person but supplies no personal Western activity date. The former English date label is not source evidence and requires focused historical research.',
    event: 'The cited unit supplies source-limited identification or context, not a dated life event for this person.',
  }) : ({
    undatedSourceAttestation: true,
    event: 'The cited Chinese unit identifies the person, relationship, office, event context, or retrospective reference, but it supplies no biographical Western date.',
  }), 'Remove the imported English AD label or broad interval. Retain the cited Chinese attestation as explicitly undated rather than converting contextual or retrospective wording into personal activity.');
}

const retainedHints = new Map([
  ['p093', ['AD 910 (death; cited identity attestation undated)']],
  ['p102', ['AD 917 accession; AD 942 death; cited identity attestation undated']],
  ['p112', ['AD 943 (death; cited succession attestation undated)']],
  ['p113', ['AD 958 (death; cited kinship attestation undated)']],
  ['p115', ['AD 958 accession; AD 971 captured by Song; cited kinship chronology requires research']],
  ['p122', ['AD 951 (death; cited kinship attestation undated)']],
  ['p125', ['AD 951 accession; AD 955 death; cited contextual attestation undated']],
  ['p126', ['AD 955 accession; cited contextual chronology requires research']],
]);
const importedHintPeople = actionable.filter(id => id.startsWith('hints-')).slice(6).map(id => id.slice(6));
if (importedHintPeople.length !== 50) throw new Error(`Expected 50 imported-date hints, got ${importedHintPeople.length}`);
for (const personId of importedHintPeople) hint(personId, retainedHints.get(personId) ?? [],
  retainedHints.has(personId)
    ? 'Replace the unsupported broad active-date hint with independently dated chapter claims, explicitly keeping the cited identifier or context undated.'
    : 'Remove the unsupported active-date hint. The paired cited attestation remains an explicitly undated source observation and does not establish a biographical activity period.');

if (changes.length !== 112 || new Set(changes.map(change => change.kind === 'hints' ? `hints-${change.personId}` : change.id)).size !== changes.length) {
  throw new Error(`Expected exactly 112 unique repairs, got ${changes.length}`);
}

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit,
  author: { name: 'Codex Jiuwudaishi 135 source-faithful chronology repair candidate', agentId: 'candidate_jwd135' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
if (candidate.people.length !== extraction.people.length || candidate.claims.length !== extraction.claims.length) {
  throw new Error('Repair changed person or claim cardinality');
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
    exactAtomicScope: 'PASS: exactly 112 audited records (56 claims and 56 paired hints); no source, person, or claim cardinality changes.',
    preservedEvidence: 'PASS: Chinese source evidence and non-date claim content are unchanged; only imported or overprecise temporal representation was repaired.',
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
