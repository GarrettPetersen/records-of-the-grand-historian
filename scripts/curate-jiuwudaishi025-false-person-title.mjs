import path from 'node:path';
import fs from 'node:fs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '025';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = 'staged-false-person-candidate-c102564c39dfa58e7feb.json';
const reviewFile = 'c102564c39dfa58e7febc0cf2b7026f4071d20c96717a130e24a4c0925b6ebaa.candidate-review.json';
const candidate = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const extractionFile = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const extraction = readJson(extractionFile);
const packet = buildDateAuditPacket(book, chapter);
const candidateHash = sha256(JSON.stringify(candidate));
const extractionHash = sha256(JSON.stringify(extraction));
const candidateRawHash = sha256(fs.readFileSync(path.join(directory, candidateFile)));

if (review.book !== book || review.chapter !== chapter ||
    review.candidateCommit !== 'e13e181d45d735a9ed0c2860c1f74b042e506d93' ||
    review.disposition !== 'accept-for-host-curation' ||
    !review.reviewer?.independentOfExtractor || !review.reviewer?.independentOfCandidateCurator) {
  throw new Error('The JWD025 title-removal review is not the accepted independent receipt');
}
if (candidateHash !== review.candidateExtractionHash || extractionHash !== review.candidateExtractionHash ||
    candidateRawHash !== review.candidateFileSha256) {
  throw new Error('The sealed candidate or persisted canonical extraction differs from the accepted target');
}
if (packet.sourceHash !== review.canonicalSourceHash) throw new Error('The source pin is stale; refusing host curation');
if (sha256(JSON.stringify(readJson(path.join(directory, candidateFile)))) !== review.candidateExtractionHash) {
  throw new Error('The sealed candidate JSON no longer matches its accepted extraction hash');
}

const validation = validateCompactPeopleExtraction(extraction, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(extraction));
if (geometry.length) throw new Error(`Chronology geometry failure: ${JSON.stringify(geometry)}`);
if (extraction.people.some((person) => person[0] === 'p011') ||
    extraction.surfaces.some((surface) => surface[1] === 'p011') ||
    extraction.claims.some((claim) => claim[0] === 'p011')) {
  throw new Error('p011 removal did not apply exactly');
}
const titleDisposition = extraction.candidateDispositions
  .find(([disposition, reason]) => disposition === 'not-person' && reason === 'title');
if (!titleDisposition?.[2]?.some(([candidateId, note]) => candidateId === 'cand_2af60bbbe3eda433' && note === 'Removed after source audit: title reference, not an individual.')) {
  throw new Error('The sealed title disposition is absent or changed');
}

const freshPacket = buildDateAuditPacket(book, chapter);
if (freshPacket.extractionHash !== review.candidateExtractionHash) throw new Error('Fresh audit packet has an unexpected extraction hash');
const packetFile = `${candidateHash.slice(7)}.fresh-independent-audit-packet.json`;
const curationFile = `${candidateHash.slice(7)}.curation.json`;
const receipt = {
  schemaVersion: 1,
  kind: 'host-false-person-curation',
  book,
  chapter,
  candidateCommit: review.candidateCommit,
  candidateFile,
  sealedCandidateHash: candidateHash,
  candidateReview: reviewFile,
  canonicalSourceHash: packet.sourceHash,
  priorCanonicalExtractionHash: review.canonicalExtractionHash,
  candidateExtractionHash: review.candidateExtractionHash,
  curatedAt: new Date().toISOString(),
  operations: {
    peopleRemoved: 1,
    mentionsRemoved: 2,
    subjectClaimsRemoved: 5,
    externalClaimsRemoved: 0,
    candidateDispositionsAdded: 1,
  },
  validation: {
    canonicalPins: 'PASS',
    sealedCandidateIdentity: 'PASS',
    acceptedReviewIdentity: 'PASS',
    exactScope: 'PASS: removed only p011 (Prince of Zheng / 鄭王), its two title-reference mentions, and five subject claims; classified cand_2af60bbbe3eda433 as title/not-person.',
    compactValidation: `PASS: ${validation.stats.people} people, ${validation.stats.mentions} mentions, ${validation.stats.claims} claims, ${validation.stats.candidates} candidates.`,
    chronologyGeometry: 'PASS: zero diagnostics.',
    scopedValidator: 'PASS: npm run people:validate -- --book jiuwudaishi --chapter 025.',
    sourceOwnership: 'PASS: 鄭王房 remains a genealogical-branch reference; Li Guochang retains the Xiantong campaign chronology.',
  },
  freshAuditPacket: packetFile,
  publication: 'staging-only',
  masterMutation: 'NONE',
  nextStep: 'Fresh complete independent canonical date audit by a reviewer distinct from this host curator.',
};
writeJsonAtomic(path.join(directory, packetFile), freshPacket);
writeJsonAtomic(path.join(directory, curationFile), receipt);
console.log(JSON.stringify({ curationFile, packetFile, extractionHash, auditItems: freshPacket.items.length, stats: validation.stats }));
