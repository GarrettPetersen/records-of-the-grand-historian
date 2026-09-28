import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

// Host-only materialization of the independently reviewed sealed candidate.
const book = 'jiuwudaishi';
const chapter = '008';
const candidateCommit = '6d3f55c27d51d8820f5b06daefe052265f868e66';
const independentReviewCommit = 'e23a3d76b2a829d2fe9aad0bc87cb84348ea745b';
const seal = 'sha256:5823914edbb05ffa6e0cefe10496e6951ddce349c890615ac6a944c9d27434ad';
const candidateHash = 'sha256:1972fdd99ecf47ac026213812e7b20a0eb2cd136a89b46dd1edddbb58d92c815';
const repairDirectory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = 'staged-candidate-5823914edbb05ffa6e0c.json';
const reviewFile = `${seal.slice(7)}.candidate-review.json`;
const handoff = readJson(path.join(repairDirectory, candidateFile));
const review = readJson(path.join(repairDirectory, reviewFile));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter);

const identity = validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.disposition !== 'accept-for-host-curation' ||
    review.candidateCommit !== candidateCommit ||
    identity.sealedCandidateHash !== seal || identity.candidateExtractionHash !== candidateHash ||
    handoff.proposal?.changes?.length !== 45) {
  throw new Error('Independent review does not authorize this exact 45-operation candidate');
}
if (handoff.canonicalSourceHash !== packet.sourceHash) {
  throw new Error('Canonical source no longer matches the sealed candidate pin');
}
const canonicalHash = sha256(JSON.stringify(canonical));
if (packet.extractionHash !== canonicalHash ||
    (canonicalHash !== handoff.canonicalExtractionHash && canonicalHash !== candidateHash)) {
  throw new Error('Canonical extraction no longer matches the sealed candidate pins');
}

const changes = handoff.proposal.changes;
const changesById = new Map(changes.filter(change => change.id).map(change => [change.id, change]));
const hintsByPerson = new Map(changes.filter(change => change.kind === 'hints').map(change => [change.personId, change]));
if (changes.filter(change => change.kind === 'replace').length !== 38 ||
    changes.filter(change => change.kind === 'hints').length !== 5 ||
    changes.filter(change => change.kind === 'remove').length !== 1 ||
    changes.filter(change => change.kind === 'add-reception-event').length !== 1) {
  throw new Error('Candidate operation kinds differ from accepted scope');
}

const assertAdYear = (value, year, label) => {
  if (value?.westernYear?.era !== 'AD' || value.westernYear.year !== year ||
      value.westernYear.precision !== 'year' || value.westernInterval || value.westernBounds) {
    throw new Error(`${label} must be AD ${year} only`);
  }
};
const p019 = changesById.get('claim-162');
if (p019?.after?.[2]?.sourceDate?.text !== '去歲（乾化二年）' ||
    p019.after?.[4]?.length !== 1 || p019.after[4][0] !== 's0042') {
  throw new Error('claim-162 must retain only s0042 and 去歲（乾化二年） provenance');
}
assertAdYear(p019.after[2], 912, 'claim-162');
if (JSON.stringify(hintsByPerson.get('p019')?.after) !== JSON.stringify(['AD 912'])) {
  throw new Error('p019 must retain the narrow AD 912 hint only');
}
if (JSON.stringify(hintsByPerson.get('p087')?.after) !== JSON.stringify(['AD 915'])) {
  throw new Error('p087 must remain AD 915 only');
}
const p020 = changes.find(change => change.kind === 'add-reception-event');
if (p020?.after?.[0] !== 'p020' || p020.after?.[1] !== 'event-participation' ||
    p020.after?.[2]?.kind !== 'posthumous-commemoration' ||
    p020.after?.[2]?.receptionType !== 'posthumous' ||
    p020.after?.[2]?.dateContext?.westernYear?.year !== 913 ||
    JSON.stringify(hintsByPerson.get('p020')?.after) !== JSON.stringify(['AD 912'])) {
  throw new Error('Zhu Youwen must retain AD 913 only as a posthumous reception and AD 912 as life hint');
}

const ad915 = ['claim-457', 'claim-459', 'claim-461', 'claim-463', 'claim-465', 'claim-467', 'claim-530', 'claim-533'];
const ad916 = ['claim-469', 'claim-471', 'claim-473', 'claim-475', 'claim-477', 'claim-479', 'claim-481', 'claim-483', 'claim-485', 'claim-487', 'claim-489', 'claim-497', 'claim-500', 'claim-503', 'claim-506', 'claim-509', 'claim-512', 'claim-515', 'claim-518', 'claim-521', 'claim-524', 'claim-536', 'claim-539', 'claim-542', 'claim-545'];
for (const id of ad915) assertAdYear(changesById.get(id)?.after?.[2], 915, id);
for (const id of ad916) assertAdYear(changesById.get(id)?.after?.[2], 916, id);
const sourceDateClaims = [...ad915, ...ad916];
if (sourceDateClaims.length !== 33 || sourceDateClaims.some(id => !changesById.get(id)?.after?.[2]?.sourceDate?.text?.includes('貞明'))) {
  throw new Error('Chinese 貞明 source-date provenance group is incomplete');
}
const claim527 = changesById.get('claim-527')?.after?.[2];
if (claim527?.sourceDate?.text !== '太祖時' || claim527?.westernYear ||
    claim527?.westernInterval?.start?.year !== 907 || claim527.westernInterval?.end?.year !== 912) {
  throw new Error('claim-527 must retain 太祖時 as a 907–912 reign-context interval, not a point');
}
for (const id of ['claim-39', 'claim-167', 'claim-332']) {
  const value = changesById.get(id)?.after?.[2];
  const context = value?.dateContext ?? value;
  if (context?.undatedSourceAttestation !== true || Object.keys(context).some(key => key.startsWith('western'))) {
    throw new Error(`${id} must remain an explicit undated source attestation`);
  }
}
if (JSON.stringify(hintsByPerson.get('p056')?.after) !== JSON.stringify([]) ||
    JSON.stringify(hintsByPerson.get('p114')?.after) !== JSON.stringify(['AD 915'])) {
  throw new Error('Dependent active-date hint repairs differ from accepted scope');
}

const repaired = canonicalHash === handoff.canonicalExtractionHash
  ? applyDateRepairProposal(canonical, handoff.proposal, packet)
  : canonical;
if (sha256(JSON.stringify(repaired)) !== candidateHash || JSON.stringify(repaired) !== JSON.stringify(handoff.candidate)) {
  throw new Error('Sealed candidate does not replay byte-for-byte');
}
const validation = validateCompactPeopleExtraction(repaired, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(repaired));
if (geometry.length) throw new Error(`Chronology geometry diagnostics: ${JSON.stringify(geometry)}`);

writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(repaired));
const receiptFile = `${seal.slice(7)}.curation.json`;
writeJsonAtomic(path.join(repairDirectory, receiptFile), {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateCommit,
  independentReviewCommit,
  candidateFile,
  candidateReview: reviewFile,
  sealedCandidateHash: seal,
  candidateExtractionHash: candidateHash,
  canonicalSourceHash: handoff.canonicalSourceHash,
  priorCanonicalExtractionHash: handoff.canonicalExtractionHash,
  curatedAt: new Date().toISOString(),
  operations: changes.length,
  operationIds: changes.map(change => change.kind === 'hints' ? `hints-${change.personId}` : change.id ?? `add-reception-event-${change.after?.[0]}`),
  validation: {
    canonicalPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    canonicalReplay: 'PASS',
    auditGroupRepairs: 'PASS: all seven audit groups, including 33 貞明 source-date repairs plus claim-527, materialized exactly.',
    p087: 'PASS: AD 915 only.',
    claim162: 'PASS: narrow AD 912 terminal-illness attestation from s0042 and 去歲（乾化二年） provenance only.',
    p019: 'PASS: AD 912 only.',
    zhuYouwenReception: 'PASS: AD 913 restoration/reburial is a posthumous reception; life hint remains AD 912.',
    compactValidation: `PASS: ${validation.stats.claims} claims with strict alias dispositions.`,
    chronologyGeometry: 'PASS',
    currentExtractionHash: candidateHash,
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh independent complete canonical date audit by a different reviewer; the prior audit is stale after this canonical change.',
});
console.log(JSON.stringify({ book, chapter, operations: changes.length, claims: validation.stats.claims, geometry: 'PASS', receipt: receiptFile }));
