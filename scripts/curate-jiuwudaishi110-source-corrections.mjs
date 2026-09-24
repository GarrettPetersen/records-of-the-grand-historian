import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '110';
const candidateFile = 'staged-candidate-373d70c9e526e14a3ed7.json';
const sealedCandidateHash = 'sha256:373d70c9e526e14a3ed7dc4be2d2d49d535e2b1dbce740102140fc623a536519';
const candidateExtractionHash = 'sha256:7a6c57d2b31d78cd4701b9f6641da56bfe406b79a9b879f8f882f0a44cb31be9';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review.json`));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction: canonical });
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

if (handoff.kind !== 'source-faithful-factual-repair-candidate-handoff' ||
    handoff.book !== book || handoff.chapter !== chapter ||
    handoff.sealedCandidateHash !== sealedCandidateHash || handoff.candidateExtractionHash !== candidateExtractionHash ||
    sha256(JSON.stringify(handoff.proposal)) !== sealedCandidateHash || sha256(JSON.stringify(handoff.candidate)) !== candidateExtractionHash) {
  throw new Error('Candidate handoff identity is not the independently reviewed sealed candidate');
}
if (review.kind !== 'independent-staged-source-faithful-factual-repair-review' ||
    review.disposition !== 'accept-for-host-curation' || review.candidateFile !== candidateFile ||
    review.sealedCandidateHash !== sealedCandidateHash || review.candidateExtractionHash !== candidateExtractionHash) {
  throw new Error('Independent receipt does not accept this exact sealed candidate');
}
if (packet.sourceHash !== handoff.canonicalSourceHash || packet.extractionHash !== handoff.canonicalExtractionHash ||
    sha256(JSON.stringify(canonical)) !== handoff.canonicalExtractionHash) {
  throw new Error('Canonical source or extraction drifted after candidate review');
}
const proposal = handoff.proposal;
if (!Array.isArray(proposal.claimChanges) || proposal.claimChanges.length !== 4 ||
    !Array.isArray(proposal.evidenceChanges) || proposal.evidenceChanges.length !== 1) {
  throw new Error('Candidate scope must be exactly four claim corrections and one alias synchronization');
}

const candidate = structuredClone(canonical);
const allowedClaims = new Set(['claim-50', 'claim-342', 'claim-343', 'claim-344']);
for (const change of proposal.claimChanges) {
  if (change.kind !== 'claim-replace' || !allowedClaims.delete(change.id)) throw new Error(`Unexpected or duplicate claim target ${change.id}`);
  const index = Number(change.id.slice(6)) - 1;
  if (!same(candidate.claims[index], change.before)) throw new Error(`Stale claim target ${change.id}`);
  if (!Array.isArray(change.after) || change.after.length !== 5 || change.after[0] !== change.before[0] ||
      change.after[1] !== change.before[1] || !same(change.after[3], change.before[3]) || !same(change.after[4], change.before[4])) {
    throw new Error(`Claim replacement changes protected fields for ${change.id}`);
  }
  candidate.claims[index] = structuredClone(change.after);
}
if (allowedClaims.size) throw new Error(`Missing required claim targets: ${[...allowedClaims]}`);
const alias = proposal.evidenceChanges[0];
if (alias.kind !== 'person-alias-replace' || alias.personId !== 'p004') throw new Error('Unexpected evidence synchronization');
const person = candidate.people.find(row => row[0] === alias.personId);
if (!person || !same(person[5][alias.aliasIndex], alias.before)) throw new Error('Stale p004 alias target');
person[5][alias.aliasIndex] = structuredClone(alias.after);

if (!same(candidate, handoff.candidate) || sha256(JSON.stringify(candidate)) !== candidateExtractionHash) {
  throw new Error('Replay does not reconstruct the sealed candidate');
}
if (candidate.claims[341][2].title.zh !== '許州節度使' || candidate.claims[342][2].title.zh !== '徐州節度使' ||
    candidate.claims[343][2].title.zh !== '滑州節度使' || candidate.claims[341][2].title.en === candidate.claims[342][2].title.en ||
    person[5][alias.aliasIndex][0].en !== 'Xinzu') {
  throw new Error('Required source semantics were not preserved');
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Date geometry diagnostics: ${JSON.stringify(geometry)}`);

writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(candidate));
const curation = {
  schemaVersion: 1,
  kind: 'host-source-faithful-factual-repair-curation',
  book,
  chapter,
  curatedAt: new Date().toISOString(),
  candidateFile,
  sealedCandidateHash,
  candidateExtractionHash,
  independentReceipt: `${sealedCandidateHash.slice(7)}.candidate-review.json`,
  appliedScope: { claimCorrections: ['claim-50', 'claim-342', 'claim-343', 'claim-344'], evidenceSynchronization: 'p004 信祖 temple alias' },
  sourceSemantics: {
    heFujin: '許州 Xuzhou',
    wangYanchao: '徐州 Xuzhou',
    liYun: '滑州 Huazhou',
    guoJingTempleAlias: '信祖 Xinzu',
  },
  validation: { canonicalInputs: 'PASS', exactReplay: 'PASS', sealedCandidateHash: 'PASS', candidateExtractionHash: 'PASS', scope: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats },
  publication: 'staging-only',
  masterMutation: 'NONE',
  followUp: 'Fresh independent canonical date audit required after curation.',
};
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.curation.json`), curation);
console.log(JSON.stringify({ candidateExtractionHash, claimCorrections: proposal.claimChanges.length, aliasSynchronizations: proposal.evidenceChanges.length, validation: validation.stats, geometry: 'PASS' }));
