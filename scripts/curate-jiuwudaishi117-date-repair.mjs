import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '117';
const candidateCommit = '5f425c6044e1fbea3a70d07279d2a46eb0ecc538';
const independentReviewCommit = '305eaeb1218d0caf5e2dd42f7231a28b37c18526';
const sealedCandidateHash = 'sha256:4a7e647952adbc39ff691bb7dcc4a8c09295c93013c28e277df31ffd27bb14a2';
const expectedCandidateHash = 'sha256:8dc24cb81820800535be26dea6c6f59d5396525d828daea6b7fc2c30570f838e';
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const reviewFile = `${sealedCandidateHash.slice(7)}.candidate-review.json`;
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const canonical = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter);
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

if (packet.sourceHash !== handoff.canonicalSourceHash || packet.extractionHash !== handoff.canonicalExtractionHash) throw new Error('Canonical source or extraction changed since the pinned sealed handoff');
if (handoff.auditCommit !== '009551410a8f721201cf93e3e3b044d5f2a52f49' || handoff.auditReportHash !== 'sha256:14e7d517ef2e868d885fb7052ad9a3df02bd6679c064a64186a0d8ec45d43e18') throw new Error('Audit pins mismatch');
if (sha256(JSON.stringify(readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`)))) !== handoff.auditReportHash) throw new Error('Pinned initial audit report changed');
if (handoff.sealedCandidateHash !== sealedCandidateHash || handoff.candidateExtractionHash !== expectedCandidateHash || sha256(JSON.stringify(handoff.proposal)) !== sealedCandidateHash) throw new Error('Sealed candidate identity mismatch');
if (review.kind !== 'independent-staged-date-repair-review' || review.book !== book || review.chapter !== chapter || review.candidateCommit !== candidateCommit || review.candidateFile !== candidateFile || review.sealedCandidateHash !== sealedCandidateHash || review.candidateHash !== expectedCandidateHash || review.validation?.canonicalSourceHash !== packet.sourceHash || review.validation?.canonicalExtractionHash !== packet.extractionHash || review.validation?.auditReportHash !== handoff.auditReportHash || review.disposition !== 'accept-for-host-curation' || review.expectedCanonicalAuditStatus !== 'requires-fresh-independent-audit') throw new Error('Independent review receipt does not bind this exact candidate and canonical inputs');
const changes = handoff.proposal.changes;
const counts = Object.fromEntries(['reclassify-retrospective-reference', 'hints', 'replace'].map(kind => [kind, changes.filter(change => change.kind === kind).length]));
if (changes.length !== 21 || !same(counts, { 'reclassify-retrospective-reference': 10, hints: 10, replace: 1 })) throw new Error(`Expected reviewed 21-operation repair, got ${JSON.stringify(counts)}`);

const candidate = structuredClone(canonical);
const seen = new Set();
for (const change of changes) {
  if (change.kind === 'hints') {
    const key = `hints-${change.personId}`;
    if (seen.has(key)) throw new Error('Duplicate hint repair');
    seen.add(key);
    const person = candidate.people.find(row => row[0] === change.personId);
    if (!person || !same(person[4]?.a ?? [], change.before) || !Array.isArray(change.after)) throw new Error('Stale hint repair');
    person[4] = { ...person[4], a: change.after };
    continue;
  }
  if (!/^claim-[1-9]\d*$/.test(change.id) || seen.has(change.id)) throw new Error('Invalid or duplicate claim repair');
  seen.add(change.id);
  const index = Number(change.id.slice(6)) - 1;
  if (!same(candidate.claims[index], change.before) || !Array.isArray(change.after) || change.after.length !== 5) throw new Error('Stale claim repair');
  if (change.kind === 'reclassify-retrospective-reference') {
    if (change.before[1] !== 'attestation' || change.after[1] !== 'event-participation' || change.after[2]?.kind !== 'retrospective-reference' || change.after[2]?.receptionType !== 'retrospective' || change.after[2]?.role !== 'recalled-subject') throw new Error('Invalid retrospective reception reclassification');
  } else if (change.kind !== 'replace') throw new Error('Unexpected repair operation');
  candidate.claims[index] = change.after;
}
if (!same(candidate, handoff.candidate) || sha256(JSON.stringify(candidate)) !== expectedCandidateHash) throw new Error('Exact deterministic replay does not reproduce the sealed candidate');
const changedTopLevel = Object.keys(canonical).filter(key => !same(canonical[key], candidate[key]));
if (!same(changedTopLevel, ['people', 'claims'])) throw new Error(`Non-date/top-level drift: ${JSON.stringify(changedTopLevel)}`);
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry diagnostics: ${JSON.stringify(geometry)}`);
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(candidate));
const curated = readJson(extractionPath);
if (!same(curated, candidate) || sha256(JSON.stringify(curated)) !== expectedCandidateHash) throw new Error('Compact serialization altered the sealed candidate');
const receipt = { schemaVersion: 1, kind: 'host-date-repair-curation', book, chapter, candidateCommit, independentReviewCommit, candidateFile, candidateReview: reviewFile, sealedCandidateHash, candidateExtractionHash: expectedCandidateHash, canonicalSourceHash: packet.sourceHash, priorCanonicalExtractionHash: packet.extractionHash, curatedAt: new Date().toISOString(), operations: changes.length, auditGroups: 4, scope: { retrospectiveReclassifications: counts['reclassify-retrospective-reference'], hintChanges: counts.hints, replacements: counts.replace }, validation: { sourceCandidateReviewPins: 'PASS', sealedProposalIdentity: 'PASS', exactReplay: 'PASS', candidateHash: 'PASS', scopedDelta: 'PASS: 10 retrospective reclassifications, 10 paired hint removals, and 1 undated-death correction; non-date/top-level drift zero.', compactSchema: `PASS: ${validation.stats.claims} claims.`, chronologyGeometry: 'PASS: zero diagnostics.' }, publication: 'staging-only', masterMutation: 'NONE', sharedTreeMutation: 'NONE', nextStep: 'Fresh independent canonical date audit by a different reviewer before any master publication.' };
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.curation.json`), receipt);
console.log(JSON.stringify({ candidateHash: expectedCandidateHash, operations: changes.length, counts, changedTopLevel, validation: validation.stats, geometry: geometry.length, receipt }));
