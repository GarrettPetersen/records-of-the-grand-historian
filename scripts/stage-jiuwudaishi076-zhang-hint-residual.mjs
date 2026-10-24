import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '076';
const ref = 'origin/codex/people-glossary-staging-v2';
const readRemoteJson = file => JSON.parse(execFileSync('git', ['show', `${ref}:${file}`], { encoding: 'utf8' }));
const extraction = readRemoteJson(`data/people/extractions/${book}/${chapter}.json`);
const audit = readRemoteJson(`data/people/date-audits/${book}/${chapter}.json`);
const packet = buildDateAuditPacket(book, chapter, { extraction });

const problem = 'After curation, claim-797 correctly has no Western endpoint, but Zhang Quanyi’s p256 active-date hint still reads “before AD 926”. That hint repeats the unsupported strict cutoff which the repair removed from the claim; the chapter’s retrospective phrase only establishes that he was already deceased when Zhang Jizuo was described as his son.';
const action = 'Replace p256’s inherited “before AD 926” active hint with a substantive source-specific research-required hold. Preserve claim-797 and its unresolved chronology; do not infer or assign any Western death bound without independent dated evidence.';
if (audit.status !== 'research-blocked' || audit.sourceHash !== packet.sourceHash || audit.extractionHash !== packet.extractionHash ||
    sha256(JSON.stringify(extraction)) !== packet.extractionHash || audit.findings.length !== 1 ||
    audit.findings[0].problem !== problem || audit.findings[0].action !== action ||
    JSON.stringify(audit.findings[0].items) !== JSON.stringify(['p256', 'claim-797'])) {
  throw new Error('Jiuwudaishi 076 fresh audit or canonical pin is stale');
}

const person = extraction.people.find(row => row[0] === 'p256');
if (!person || JSON.stringify(person[4]?.a) !== JSON.stringify(['before AD 926'])) throw new Error('Zhang Quanyi active hint is not the expected residual');
const claim = extraction.claims[796];
if (!claim || claim[0] !== 'p256' || claim[1] !== 'attestation' || claim[2]?.unresolved !== true ||
    !String(claim[2]?.unresolvedReason ?? '').includes('故齊王全義之子') || JSON.stringify(claim[4]) !== JSON.stringify(['s0298'])) {
  throw new Error('Claim-797 is not the already-curated source-specific research hold');
}

const changes = [{
  kind: 'hints',
  personId: 'p256',
  before: person[4].a,
  after: ['Source-specific chronology hold: “故齊王全義之子” attests Zhang Quanyi as deceased, but supplies no date or inclusive endpoint; no Western date bound is asserted.'],
  reason: `${problem} ${action}`,
}];
const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: { name: 'Codex Jiuwudaishi 076 Zhang Quanyi residual hint date-repair candidate', agentId: 'repair_jiuwudaishi076_zhang_hint' },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

const candidateExtractionHash = sha256(JSON.stringify(candidate));
const sealedCandidateHash = sealedDateRepairProposalHash(proposal);
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
  validation: { status: 'passed', proposalReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats },
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
