import path from 'node:path';
import {
  applyDateRepairProposal,
  sealedDateRepairProposalHash,
  validateStagedDateRepairReview,
} from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '010';
const seal = 'sha256:d4d1b56aabcb9779b2690570adac2ea538b2aca60eeaa3436e59fa27c56c3614';
const expectedCandidateHash = 'sha256:c6201dc930264f8896fae558f3a03f224eed8b281b22fe754d5db915f22b33a6';
const expectedCanonicalHash = 'sha256:ad2893e1e67e46bd7a32f6c2ec26346d99cd097ea96dd3d3c0670db71e51ec31';
const candidateCommit = '35106de17628cd02f8db87b661db4287a2785929';
const reviewCommit = '183fb69793c2ecad50d249bc72b81e6f149422b8';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${seal.slice(7, 27)}.json`;
const reviewFile = `${seal.slice(7)}.candidate-review.json`;
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter);
const canonicalHash = sha256(JSON.stringify(canonical));

if (packet.sourceHash !== handoff.canonicalSourceHash || packet.extractionHash !== expectedCanonicalHash ||
    canonicalHash !== expectedCanonicalHash || handoff.canonicalExtractionHash !== expectedCanonicalHash) {
  throw new Error('Canonical source or extraction changed since the sealed handoff');
}
if (handoff.sealedCandidateHash !== seal || sealedDateRepairProposalHash(handoff.proposal) !== seal ||
    handoff.candidateExtractionHash !== expectedCandidateHash) {
  throw new Error('Unexpected sealed proposal or candidate identity');
}
const reviewed = validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.disposition !== 'accept-for-host-curation' || !review.reviewer?.independentOfExtractor ||
    !review.reviewer?.independentOfCandidateCurator || !review.reviewer?.independentOfAuditAuthor ||
    reviewed.sealedCandidateHash !== seal || reviewed.candidateExtractionHash !== expectedCandidateHash) {
  throw new Error('Independent review did not accept this exact candidate');
}
const changes = handoff.proposal.changes;
const count = kind => changes.filter(change => change.kind === kind).length;
if (changes.length !== 22 || count('replace') !== 7 || count('remove') !== 4 || count('add-reception-event') !== 2 || count('hints') !== 9 ||
    !changes.some(change => change.id === 'claim-28') || !changes.some(change => change.id === 'claim-48') ||
    !changes.some(change => change.id === 'claim-51') || !changes.some(change => change.id === 'claim-113')) {
  throw new Error('The accepted proposal is not the exact 22-operation repair');
}

const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (JSON.stringify(candidate) !== JSON.stringify(handoff.candidate)) throw new Error('Canonical replay does not reproduce the sealed candidate');
const candidateHash = sha256(JSON.stringify(candidate));
if (candidateHash !== expectedCandidateHash) throw new Error('Candidate extraction hash mismatch');
const person = id => candidate.people.find(row => row[0] === id) ?? (() => { throw new Error(`Missing ${id}`); })();
const p006 = person('p006');
const p025 = person('p025');
const p030 = person('p030');
const p034 = person('p034');
const p006Claims = candidate.claims.filter(claim => claim[0] === 'p006');
const p006Reception = p006Claims.filter(claim => claim[1] === 'event-participation' &&
  claim[2]?.kind === 'posthumous-commemoration' && claim[2]?.receptionType === 'posthumous' &&
  claim[2]?.dateContext?.westernYear?.year === 937 && claim[2]?.action === 'authorized collection and reburial of the Last Emperor\'s head');
if (p006Reception.length !== 1 || p006Claims.some(claim =>
  (claim[1] === 'attestation' || claim[1] === 'death') && JSON.stringify(claim).includes('937'))) {
  throw new Error('The Last Emperor AD 937 evidence must be solely a posthumous reception');
}
if (!p006[4]?.a?.includes('AD 920-923; issued edicts, ruled Later Liang, and died in AD 923') ||
    !p006Claims.some(claim => claim[1] === 'death' && JSON.stringify(claim).includes('923'))) {
  throw new Error('The independently witnessed AD 923 Last Emperor death evidence was not retained');
}
const hasRegnalYearEleven = value => Array.isArray(value)
  ? value.some(hasRegnalYearEleven)
  : value && typeof value === 'object'
    ? value.regnalYear === 11 || Object.values(value).some(hasRegnalYearEleven)
    : false;
if (candidate.claims.some(hasRegnalYearEleven)) {
  throw new Error('The omen passage must not restore a fabricated regnalYear 11');
}
const p025Reception = candidate.claims.filter(claim => claim[0] === 'p025' && claim[1] === 'event-participation' &&
  claim[2]?.kind === 'posthumous-commemoration' && claim[2]?.receptionType === 'posthumous' && claim[2]?.dateContext?.westernYear?.year === 920);
if (p025Reception.length !== 1 || p025[4]?.a?.length) throw new Error('Qi Fengguo must retain only the classified AD 920 posthumous reception');
for (const [row, year, wording] of [[p030, 920, '貞明六年六月以前'], [p034, 923, '龍德三年春三月以前']]) {
  if (!row[4]?.a?.some(hint => hint.includes(`on or before AD ${year}`)) || !candidate.claims.some(claim =>
    claim[0] === row[0] && claim[2]?.westernBounds?.onOrBefore?.year === year && claim[2]?.sourceDate?.text === wording)) {
    throw new Error(`${row[0]} must retain the reviewed one-sided upper bound`);
  }
}

const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry failed: ${JSON.stringify(geometry)}`);
const compact = serializeCompactPeopleExtraction(candidate);
if (sha256(JSON.stringify(JSON.parse(compact))) !== candidateHash) throw new Error('Compact serialization changed the curated extraction');

const curationFile = `${seal.slice(7)}.curation.json`;
const receipt = {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateCommit,
  candidateFile,
  sealedCandidateHash: seal,
  candidateExtractionHash: candidateHash,
  candidateReview: reviewFile,
  independentReviewCommit: reviewCommit,
  canonicalSourceHash: packet.sourceHash,
  priorCanonicalExtractionHash: canonicalHash,
  curatedAt: new Date().toISOString(),
  operations: 22,
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    canonicalReplay: 'PASS',
    lastEmperorReceptionSeparation: 'PASS: AD 937 is solely one posthumous reception; AD 923 death evidence retained.',
    omenNoRegnalYear11: 'PASS',
    qiFengguoPosthumousReception: 'PASS',
    oneSidedBounds: 'PASS: p030 AD 920 and p034 AD 923 retain cited upper bounds without lower endpoints.',
    compactValidation: `PASS: ${validation.stats.claims} claims; strict alias dispositions.`,
    chronologyGeometry: 'PASS',
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh complete independent canonical date audit by a different reviewer.',
};

writeJsonAtomic(path.join(directory, curationFile), receipt);
writeTextAtomic(extractionPath, compact);
const persisted = readJson(extractionPath);
if (sha256(JSON.stringify(persisted)) !== candidateHash) throw new Error('Persisted canonical extraction differs from the sealed candidate');
const freshPacket = buildDateAuditPacket(book, chapter);
if (freshPacket.sourceHash !== packet.sourceHash || freshPacket.extractionHash !== candidateHash) {
  throw new Error('Fresh post-curation date-audit packet does not pin the curated canonical extraction');
}
console.log(JSON.stringify({ curationFile, candidateHash, freshPacket: freshPacket.extractionHash, validation: validation.stats, geometry: 'PASS' }));
