import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi', chapter = '118';
const candidateCommit = '8524d51896b9b5515feb5849191e1d382d1605f8', independentReviewCommit = 'a3fbde1a58260e3324c1528f7901649c2585c2c2';
const sealedCandidateHash = 'sha256:dee1b96c9df5419ae36347337c7109b49c468a86a6e788a15907dcd2dc7c4e69';
const expectedCandidateHash = 'sha256:a72989513e37d0698e1a10dc80994d7d5ba94b54a1bb441f32948bfac0337486';
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`, reviewFile = `${sealedCandidateHash.slice(7)}.candidate-review.json`;
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter), handoff = readJson(path.join(directory, candidateFile)), review = readJson(path.join(directory, reviewFile));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`), canonical = readJson(extractionPath), packet = buildDateAuditPacket(book, chapter);
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
if (packet.sourceHash !== handoff.canonicalSourceHash || packet.extractionHash !== handoff.canonicalExtractionHash || handoff.auditCommit !== '022446ede9b557008a145d2ccb8462805d227945' || sha256(JSON.stringify(readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`)))) !== handoff.auditReportHash) throw new Error('Canonical or initial-audit pin mismatch');
if (handoff.sealedCandidateHash !== sealedCandidateHash || handoff.candidateExtractionHash !== expectedCandidateHash || sha256(JSON.stringify(handoff.proposal)) !== sealedCandidateHash) throw new Error('Sealed candidate identity mismatch');
if (review.kind !== 'independent-staged-date-repair-review' || review.book !== book || review.chapter !== chapter || review.candidateCommit !== candidateCommit || review.candidateFile !== candidateFile || review.sealedCandidateHash !== sealedCandidateHash || review.candidateHash !== expectedCandidateHash || review.validation?.canonicalSourceHash !== packet.sourceHash || review.validation?.canonicalExtractionHash !== packet.extractionHash || review.disposition !== 'accept-for-host-curation' || review.expectedCanonicalAuditStatus !== 'requires-fresh-independent-audit') throw new Error('Independent review receipt mismatch');
const changes = handoff.proposal.changes, counts = Object.fromEntries(['reclassify-retrospective-reference', 'hints'].map(kind => [kind, changes.filter(change => change.kind === kind).length]));
if (changes.length !== 32 || !same(counts, { 'reclassify-retrospective-reference': 16, hints: 16 })) throw new Error(`Unexpected operation set: ${JSON.stringify(counts)}`);
const candidate = structuredClone(canonical), seen = new Set();
for (const change of changes) {
  if (change.kind === 'hints') { const key = `hints-${change.personId}`; if (seen.has(key)) throw new Error('Duplicate hint repair'); seen.add(key); const person = candidate.people.find(row => row[0] === change.personId); if (!person || !same(person[4]?.a ?? [], change.before) || !Array.isArray(change.after) || change.after.length) throw new Error('Stale or non-empty reception hint repair'); person[4] = { ...person[4], a: change.after }; continue; }
  if (change.kind !== 'reclassify-retrospective-reference' || !/^claim-[1-9]\d*$/.test(change.id) || seen.has(change.id)) throw new Error('Invalid claim repair');
  seen.add(change.id); const index = Number(change.id.slice(6)) - 1;
  if (!same(candidate.claims[index], change.before) || change.before[1] !== 'attestation' || change.after?.[1] !== 'event-participation' || change.after?.[2]?.kind !== 'retrospective-reference' || change.after?.[2]?.receptionType !== 'retrospective' || change.after?.[2]?.role !== 'recalled-subject') throw new Error('Stale or invalid retrospective reception repair');
  candidate.claims[index] = change.after;
}
if (!same(candidate, handoff.candidate) || sha256(JSON.stringify(candidate)) !== expectedCandidateHash) throw new Error('Exact replay does not reproduce sealed candidate');
const changedTopLevel = Object.keys(canonical).filter(key => !same(canonical[key], candidate[key]));
if (!same(changedTopLevel, ['people', 'claims'])) throw new Error(`Non-date/top-level drift: ${JSON.stringify(changedTopLevel)}`);
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter)), geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry diagnostics: ${JSON.stringify(geometry)}`);
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(candidate));
const curated = readJson(extractionPath); if (!same(curated, candidate) || sha256(JSON.stringify(curated)) !== expectedCandidateHash) throw new Error('Compact serialization altered candidate');
const receipt = { schemaVersion: 1, kind: 'host-date-repair-curation', book, chapter, candidateCommit, independentReviewCommit, candidateFile, candidateReview: reviewFile, sealedCandidateHash, candidateExtractionHash: expectedCandidateHash, canonicalSourceHash: packet.sourceHash, priorCanonicalExtractionHash: packet.extractionHash, curatedAt: new Date().toISOString(), operations: changes.length, auditGroups: 2, scope: { retrospectiveReclassifications: counts['reclassify-retrospective-reference'], hintChanges: counts.hints }, validation: { sourceCandidateReviewPins: 'PASS', sealedProposalIdentity: 'PASS', exactReplay: 'PASS', candidateHash: 'PASS', scopedDelta: 'PASS: 16 retrospective reclassifications and 16 paired hint removals; non-date/top-level drift zero.', compactSchema: `PASS: ${validation.stats.claims} claims.`, chronologyGeometry: 'PASS: zero diagnostics.' }, publication: 'staging-only', masterMutation: 'NONE', sharedTreeMutation: 'NONE', nextStep: 'Fresh independent canonical date audit by a different reviewer before any master publication.' };
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.curation.json`), receipt);
console.log(JSON.stringify({ candidateHash: expectedCandidateHash, operations: changes.length, counts, changedTopLevel, validation: validation.stats, geometry: geometry.length }));
