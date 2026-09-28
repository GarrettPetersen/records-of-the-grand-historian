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
const finding = audit.findings.find(entry => JSON.stringify(entry.items) === JSON.stringify(['claim-167']));
const problem = 'The AD 913 restoration-and-burial order concerns Zhu Youwen after his AD 912 execution. The existing noble-title claim still presents the restoration as an ordinary dated title action without posthumous/reception classification; the separate reception event does not repair that misleading life claim.';
const action = 'Replace or annotate claim-167 so its AD 913 restoration is explicitly posthumous/reception-only (for example receptionType: posthumous), or remove the duplicative life-style title claim while retaining the existing event-participation posthumous reception. Preserve the AD 912 life hint and all original Chinese evidence.';

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash || audit.extractionHash !== packet.extractionHash ||
    sha256(JSON.stringify(extraction)) !== packet.extractionHash || !finding || finding.problem !== problem || finding.action !== action) {
  throw new Error('Fresh Jiuwudaishi 008 audit is stale or does not contain the sole residual claim-167 finding');
}

const claim = extraction.claims[166];
if (!claim || claim[0] !== 'p020' || claim[1] !== 'noble-title' || claim[2]?.action !== 'restored' ||
    claim[2]?.dateContext?.westernYear?.year !== 913 || claim[2]?.receptionType || JSON.stringify(claim[4]) !== JSON.stringify(['s0048'])) {
  throw new Error('Claim-167 is not the expected unclassified AD 913 restoration claim');
}
const person = extraction.people.find(row => row[0] === 'p020');
if (!person || JSON.stringify(person[4]?.a) !== JSON.stringify(['AD 912'])) throw new Error('Zhu Youwen AD 912 life hint must remain intact');
const reception = extraction.claims.find(entry => entry[0] === 'p020' && entry[1] === 'event-participation' &&
  entry[2]?.kind === 'posthumous-commemoration' && entry[2]?.receptionType === 'posthumous' &&
  entry[2]?.dateContext?.westernYear?.year === 913);
if (!reception || !reception[4].includes('s0048')) throw new Error('Expected separate AD 913 posthumous-reception event is absent');

const changes = [{
  kind: 'remove',
  id: 'claim-167',
  before: claim,
  reason: 'The s0048 AD 913 order restores Zhu Youwen’s title and orders reburial after his AD 912 execution. Remove the duplicative life-style noble-title claim; retain the same dated source evidence in the existing separately classified posthumous event-participation claim.',
}];
const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Codex Jiuwudaishi 008 residual Zhu Youwen posthumous-reception candidate',
    agentId: 'candidate_jiuwudaishi008_residual_posthumous',
  },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) {
  throw new Error('Candidate replay mismatch');
}
if (candidate.claims.some(entry => entry[0] === 'p020' && entry[1] === 'noble-title' && entry[2]?.dateContext?.westernYear?.year === 913)) {
  throw new Error('The misleading AD 913 life-style noble-title claim remains');
}
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
