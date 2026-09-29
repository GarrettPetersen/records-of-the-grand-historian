import path from 'node:path';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '026';
const seal = 'sha256:4068d7c77378099ab0df931a4159ae0da7d190de3ae4348caa3e48ad33822bd1';
const sourceHash = 'sha256:30557d72ceec8fd32d6322c29f7448f4695ed6c07ff065931d9b74ce2a3d9eba';
const canonicalHash = 'sha256:37663663bf203f3d8a56e15df2d9fa2c1488a26d963ea5d441f676ec18e5cabc';
const candidateHash = 'sha256:ae203902b70d828e04c253d40d236109ce501cdfb4f027b54e9dbff4326dbad9';
const auditHash = 'sha256:90c7a566ed50f57e8be0279f35e84a15a75062c1b7aaef390c38c2cf7153631d';
const researchHash = 'sha256:c2e0ca85c85b45d83b09a943951fb01a07e503bee8ca4359d1c0c2bd9ce20dce';
const candidateCommit = '0d36aa29bbc22785c9aa4563486e41e93a54c475';
const reviewCommit = 'c56ff9c905ee7969371a4d8bcc5c713e7159ae8f';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${seal.slice(7, 27)}.json`;
const reviewFile = `${seal.slice(7)}.candidate-review.json`;
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const canonical = readJson(extractionPath);
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
const researchPath = path.join(directory, '20260929-chapter-primary-retrospective-reference-research-c695edde.json');
const research = readJson(researchPath);
if (packet.sourceHash !== sourceHash || packet.extractionHash !== canonicalHash || sha256(JSON.stringify(canonical)) !== canonicalHash ||
  handoff.canonicalSourceHash !== sourceHash || handoff.canonicalExtractionHash !== canonicalHash || sha256(JSON.stringify(audit)) !== auditHash ||
  sha256(JSON.stringify(research)) !== researchHash || handoff.proposal.auditCommit !== 'c695edde8ee1fd810453d8257f35b2669c432cff' || handoff.proposal.sourceResearch?.hash !== researchHash) {
  throw new Error('Canonical source, extraction, audit, or source-research pin changed since the sealed handoff');
}
if (handoff.sealedCandidateHash !== seal || sealedDateRepairProposalHash(handoff.proposal) !== seal || handoff.candidateExtractionHash !== candidateHash) throw new Error('Unexpected sealed retrospective candidate');
const reviewed = validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.disposition !== 'accept-for-host-curation' || !review.reviewer?.independentOfExtractor || !review.reviewer?.independentOfCandidateCurator || !review.reviewer?.independentOfAuditAuthor ||
  reviewed.sealedCandidateHash !== seal || reviewed.candidateExtractionHash !== candidateHash) throw new Error('Independent receipt does not accept this exact candidate');
const changes = handoff.proposal.changes;
const count = kind => changes.filter(change => change.kind === kind).length;
if (changes.length !== 54 || count('remove') !== 18 || count('add-reception-event') !== 18 || count('hints') !== 18) throw new Error('The accepted proposal is not the exact 54-operation repair');
const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (JSON.stringify(candidate) !== JSON.stringify(handoff.candidate) || sha256(JSON.stringify(candidate)) !== candidateHash) throw new Error('Exact replay does not reproduce the accepted candidate');
const sourceIds = ['p157','p158','p159','p161','p162','p163','p170','p171','p172','p173','p174','p175','p176','p177','p178','p179','p180','p181'];
for (const personId of sourceIds) {
  const person = candidate.people.find(row => row[0] === personId);
  const events = candidate.claims.filter(claim => claim[0] === personId && claim[1] === 'event-participation' && claim[2]?.receptionType === 'retrospective');
  if (!person || JSON.stringify(person[4]?.a ?? []) !== '[]' || events.length !== 1 || candidate.claims.some(claim => claim[0] === personId && claim[1] === 'attestation' && claim[2]?.unresolved)) throw new Error(`${personId} retrospective reclassification is incomplete`);
  if (JSON.stringify(events[0]).match(/westernYear|westernInterval|westernBounds|AD |BC /)) throw new Error(`${personId} retrospective event leaks a life date`);
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
if (validation.stats.people !== 181 || validation.stats.mentions !== 1038 || validation.stats.claims !== 1030 || validation.stats.aliasDispositionConflicts !== 0) throw new Error(`Unexpected strict validation stats: ${JSON.stringify(validation.stats)}`);
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry failure: ${JSON.stringify(geometry)}`);
const compact = serializeCompactPeopleExtraction(candidate);
if (sha256(JSON.stringify(JSON.parse(compact))) !== candidateHash) throw new Error('Compact serialization changed the curated candidate');
const acceptanceFile = `${seal.slice(7)}.host-recorded-independent-acceptance.json`;
const curationFile = `${seal.slice(7)}.curation.json`;
writeJsonAtomic(path.join(directory, acceptanceFile), { schemaVersion: 1, kind: 'host-recorded-independent-date-repair-acceptance', book, chapter, candidateCommit, reviewerCommit: reviewCommit, reviewerArtifact: reviewFile, disposition: 'accept-for-host-curation', sealedCandidateHash: seal, candidateExtractionHash: candidateHash, canonicalSourceHash: sourceHash, canonicalExtractionHash: canonicalHash, auditReportHash: auditHash, researchHash, operations: 54, validation: { canonicalPins: 'PASS', auditAndResearchPins: 'PASS', sealedReplay: 'PASS', strictCompactValidation: 'PASS: 181 people, 1038 mentions, 1030 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.' }, authorization: 'Independent review accepted this candidate; it does not replace the required fresh canonical audit.' });
writeTextAtomic(extractionPath, compact);
if (sha256(JSON.stringify(readJson(extractionPath))) !== candidateHash) throw new Error('Persisted canonical extraction differs from the sealed candidate');
const freshPacket = buildDateAuditPacket(book, chapter);
if (freshPacket.sourceHash !== sourceHash || freshPacket.extractionHash !== candidateHash || freshPacket.units.length !== 305 || freshPacket.people.length !== 181) throw new Error('Fresh re-audit packet is not complete and pinned');
const reAuditPacketFile = `${candidateHash.slice(7)}.fresh-canonical-re-audit-packet.json`;
const freshPacketHash = sha256(JSON.stringify(freshPacket));
writeJsonAtomic(path.join(directory, reAuditPacketFile), freshPacket);
writeJsonAtomic(path.join(directory, curationFile), { schemaVersion: 1, kind: 'host-date-repair-curation', book, chapter, candidateCommit, candidateFile, reviewerCommit: reviewCommit, acceptanceAttachment: acceptanceFile, sealedCandidateHash: seal, candidateExtractionHash: candidateHash, canonicalSourceHash: sourceHash, priorCanonicalExtractionHash: canonicalHash, priorAuditReportHash: auditHash, researchHash, operations: 54, operationKinds: { remove: 18, 'add-reception-event': 18, hints: 18 }, validation: { canonicalPins: 'PASS', auditAndResearchPins: 'PASS', sealedProposalIdentity: 'PASS', acceptedReviewIdentity: 'PASS', exactReplayAndHash: 'PASS', noInventedChronology: 'PASS: every replacement is an undated retrospective reference, allusion, genealogy, anecdote, remembered target, or historiographical comparison.', strictCompactValidation: 'PASS: 181 people, 1038 mentions, 1030 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.' }, priorAuditDisposition: audit.status, auditStatusMutation: 'NONE: host curation cannot self-approve or rewrite the independent audit; a fresh audit is required.', freshCanonicalReaudit: { status: 'required', packetFile: reAuditPacketFile, packetHash: freshPacketHash, sourceHash: freshPacket.sourceHash, extractionHash: freshPacket.extractionHash, completeScope: { sourceUnits: freshPacket.units.length, temporalClaimAndHintChecks: freshPacket.items.length, people: freshPacket.people.length }, requiredReviewerConstraint: 'A reviewer independent of both candidates, both independent reviewers, the original audit author, and this host curator must review the complete packet.' }, publication: 'staging-only', masterMutation: 'NONE' });
console.log(JSON.stringify({ curationFile, acceptanceFile, reAuditPacketFile, candidateHash, freshPacketHash, validation: validation.stats, geometry: 'PASS' }));
