import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '137';
const auditCommit = '05858ce366604d91efd574cce469da4a1e943212';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || audit.findings.length !== 5) {
  throw new Error('Jiuwudaishi 137 initial audit is stale or not the expected five-group repair state');
}

const expectedItems = new Set([
  'claim-27', 'claim-37', 'claim-305', 'claim-488', 'claim-588',
  'hints-p004', 'hints-p005', 'hints-p037', 'hints-p041', 'hints-p066', 'hints-p089',
  'p004', 'p005', 'p037', 'p041', 'p066', 'p089',
]);
const auditedItems = new Set(audit.findings.flatMap(finding => finding.items ?? []));
if (JSON.stringify([...auditedItems].sort()) !== JSON.stringify([...expectedItems].sort())) {
  throw new Error(`Unexpected JWD137 audit scope: ${JSON.stringify([...auditedItems].sort())}`);
}

const changes = [];
const claim = id => {
  const row = extraction.claims[Number(id.slice(6)) - 1];
  if (!row) throw new Error(`Missing ${id}`);
  return row;
};
const findingFor = id => audit.findings.find(finding => finding.items?.includes(id));
const replaceWithUndatedAttestation = (id, personId, sourceText, event, reason) => {
  const before = claim(id);
  if (before[0] !== personId || before[1] !== 'attestation' || before[2]?.sourceDate?.text !== sourceText) {
    throw new Error(`${id} drifted from its audited overprecise attestation`);
  }
  const after = [personId, 'attestation', { undatedSourceAttestation: true, event }, before[3], before[4]];
  changes.push({ kind: 'replace', id, before, after, reason });
};
const replaceHints = (personId, expected, after, reason) => {
  const person = extraction.people.find(row => row[0] === personId);
  const before = person?.[4]?.a;
  if (!person || JSON.stringify(before) !== JSON.stringify(expected)) {
    throw new Error(`${personId} active-date hints drifted from audit input`);
  }
  changes.push({ kind: 'hints', personId, before, after, reason });
};

// Pingzhou records a military episode but supplies no reign, era, or year.
replaceWithUndatedAttestation(
  'claim-27', 'p004', '時劉守光戍平州',
  'Was stationed at Pingzhou when Prince Shili attacked; this passage gives no era or Western year.',
  'Remove the imported AD 907 date from the Pingzhou episode. The source still explicitly attests Liu Shouguang at Pingzhou, while the independently dated AD 913 material remains separate.'
);
replaceWithUndatedAttestation(
  'claim-37', 'p005', '時劉守光戍平州',
  'Led the attack on Liu Shouguang at Pingzhou; this passage gives no era or Western year.',
  'Remove the imported AD 907 date from Prince Shili’s Pingzhou attack while retaining the source-attested military episode as undated.'
);
replaceHints(
  'p004', ['AD 907-913'], ['AD 913'],
  'Replace the range whose lower endpoint came from the undated Pingzhou episode with the independently source-dated AD 913 final-years material.'
);
replaceHints(
  'p005', ['AD 907'], [],
  'Remove Prince Shili’s unsupported AD 907 active-date hint; the retained Pingzhou attestation is explicitly undated.'
);

// Abaoji’s speech recalls a relationship; it does not date the late Hedong lord’s activity.
replaceWithUndatedAttestation(
  'claim-305', 'p037', '約為兄弟',
  'Was retrospectively recalled by Abaoji as his sworn brother; the statement does not date the brotherhood or the Hedong lord’s life.',
  'Remove the imported AD 907 living-attestation date from Abaoji’s retrospective sworn-brother reference while retaining the undated relationship statement.'
);
replaceHints(
  'p037', ['AD 907'], [],
  'Remove the unsupported AD 907 active-date hint; the surviving attestation is explicitly a retrospective, undated relationship reference.'
);

// Mingzong’s reign is the source’s actual chronological resolution.
replaceHints(
  'p041', ['AD 927'], ['Mingzong reign AD 926-933'],
  'Replace the unsupported AD 927 point with the source-qualified Mingzong-reign interval already carried by Molin’s attestation and diplomatic event.'
);

// These labels identify persons in later speech/genealogy, not their spans of active life.
replaceWithUndatedAttestation(
  'claim-488', 'p066', '先朝是契丹所立',
  'Was referred to retrospectively as the former dynasty’s emperor whom the Khitan installed; this later envoy exchange does not date his personal activity.',
  'Remove the inherited AD 936-942 activity interval from the retrospective Jin-founder reference, retaining the source’s political identification without a fabricated life span.'
);
replaceHints(
  'p066', ['AD 936-942'], [],
  'Remove the active-date hint inherited from the retrospective former-dynasty reference; no independent dated personal event is supplied here.'
);
replaceWithUndatedAttestation(
  'claim-588', 'p089', '東丹王',
  'Was identified as the King of Eastern Dan and father of Prince Yongkang; this genealogical title reference gives no date for his life or rule.',
  'Remove the inherited AD 926-937 activity interval from the undated Eastern-Dan title reference while retaining the genealogical identification.'
);
replaceHints(
  'p089', ['AD 926-937'], [],
  'Remove the inherited active-date hint; the retained Eastern-Dan title reference is explicitly undated.'
);

if (changes.length !== 11) throw new Error(`Expected exactly eleven atomic JWD137 repairs, got ${changes.length}`);
const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit,
  author: { name: 'Codex Jiuwudaishi 137 source-faithful chronology repair candidate', agentId: 'candidate_jwd137' },
  changes,
};

const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
if (candidate.people.length !== extraction.people.length || candidate.claims.length !== extraction.claims.length) {
  throw new Error('Repair changed record cardinality');
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
    compactValidation: 'PASS',
    chronologyGeometry: 'PASS',
    exactAtomicScope: 'PASS: five audited chronology groups, with six date-bearing claims converted to undated attestations and eleven paired or replacement hint updates; no people, claims, source units, or non-date facts removed.',
    preservedEvidence: 'PASS: Pingzhou, Hedong, Jin-founder, and Eastern-Dan source references remain visible as undated attestations; Molin retains the source-qualified Mingzong-reign interval.',
    stats: validation.stats,
  },
  auditEvidence: { findings: audit.findings },
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
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, stats: validation.stats }));
