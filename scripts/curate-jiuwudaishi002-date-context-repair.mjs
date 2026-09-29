import path from 'node:path';
import { applyDateRepairProposal, sealedDateRepairProposalHash, validateStagedDateRepairReview } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '002';
const seal = 'sha256:8f739824a8bb6ffc506da1c30f76b5059011764350c3cfb5712b1cac8beaa75e';
const sourceHash = 'sha256:68a2692002f17ed5b31223325942befe5c13494d284567422c86e30976e43858';
const canonicalHash = 'sha256:7f287fd7195a12b9ec36bc95f7f4e18dde6b20ed8162ee1e160343cbe7a6453e';
const candidateHash = 'sha256:626fae373efb9a1c337346b50063f10914cc2b8c66c04a73028f47bce08b395e';
const auditHash = 'sha256:5df2ea83cd37110e9e602f675e2486ec11c5f9de065e63bd360b1c1c34367a2a';
const candidateCommit = '0d708d2cbeeb75a0128f021e694c67455638a349';
const reviewCommit = 'c25bdcd29b8e30f2a89096134da268f179ccf46c';
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const candidateFile = `staged-candidate-${seal.slice(7, 27)}.json`;
const reviewFile = `${seal.slice(7)}.candidate-review.json`;
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const handoff = readJson(path.join(directory, candidateFile));
const review = readJson(path.join(directory, reviewFile));
const canonical = readJson(extractionPath);
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter);
if (packet.sourceHash !== sourceHash || packet.extractionHash !== canonicalHash || sha256(JSON.stringify(canonical)) !== canonicalHash ||
  handoff.canonicalSourceHash !== sourceHash || handoff.canonicalExtractionHash !== canonicalHash || sha256(JSON.stringify(audit)) !== auditHash) {
  throw new Error('Canonical source, extraction, or audit pin changed since the sealed handoff');
}
if (handoff.sealedCandidateHash !== seal || sealedDateRepairProposalHash(handoff.proposal) !== seal || handoff.candidateExtractionHash !== candidateHash) {
  throw new Error('Unexpected sealed date-context candidate');
}
const reviewed = validateStagedDateRepairReview(handoff, review, candidateFile);
if (review.disposition !== 'accept-for-host-curation' || !review.reviewer?.independentOfExtractor || !review.reviewer?.independentOfCandidateCurator || !review.reviewer?.independentOfAuditAuthor ||
  reviewed.sealedCandidateHash !== seal || reviewed.candidateExtractionHash !== candidateHash) throw new Error('Independent receipt does not accept this exact candidate');
const changes = handoff.proposal.changes;
if (changes.length !== 2 || changes.some(change => change.kind !== 'replace') || JSON.stringify(changes.map(change => change.id).sort()) !== JSON.stringify(['claim-428', 'claim-466'])) {
  throw new Error('The accepted proposal is not exactly claim-428 and claim-466');
}
const candidate = applyDateRepairProposal(canonical, handoff.proposal, packet);
if (JSON.stringify(candidate) !== JSON.stringify(handoff.candidate) || sha256(JSON.stringify(candidate)) !== candidateHash) throw new Error('Exact replay does not reproduce the accepted candidate');
const claim = id => candidate.claims[Number(id.slice(6)) - 1];
const date = id => claim(id)?.[2];
if (date('claim-428')?.sourceDate?.text !== '天祐三年正月' || date('claim-428')?.westernYear?.year !== 906 ||
  date('claim-466')?.sourceDate?.text !== '天祐二年十一月' || date('claim-466')?.westernYear?.year !== 905) throw new Error('Source-specific Tianyou contexts were not exactly retained');
const beforeHints = ['p138', 'p157'].map(id => canonical.people.find(row => row[0] === id)?.[4]?.a);
const afterHints = ['p138', 'p157'].map(id => candidate.people.find(row => row[0] === id)?.[4]?.a);
if (JSON.stringify(beforeHints) !== JSON.stringify(afterHints)) throw new Error('The accepted repair must not change active-date hints');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
if (validation.stats.people !== 157 || validation.stats.mentions !== 856 || validation.stats.claims !== 910 || validation.stats.aliasDispositionConflicts !== 0) throw new Error(`Unexpected strict validation stats: ${JSON.stringify(validation.stats)}`);
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry failure: ${JSON.stringify(geometry)}`);
const compact = serializeCompactPeopleExtraction(candidate);
if (sha256(JSON.stringify(JSON.parse(compact))) !== candidateHash) throw new Error('Compact serialization changed the curated candidate');
const acceptanceFile = `${seal.slice(7)}.host-recorded-independent-acceptance.json`;
const curationFile = `${seal.slice(7)}.curation.json`;
writeJsonAtomic(path.join(directory, acceptanceFile), { schemaVersion: 1, kind: 'host-recorded-independent-date-repair-acceptance', book, chapter, candidateCommit, reviewerCommit: reviewCommit, reviewerArtifact: reviewFile, disposition: 'accept-for-host-curation', sealedCandidateHash: seal, candidateExtractionHash: candidateHash, canonicalSourceHash: sourceHash, canonicalExtractionHash: canonicalHash, auditReportHash: auditHash, operations: 2, validation: { canonicalPins: 'PASS', auditPin: 'PASS', sealedReplay: 'PASS', strictCompactValidation: 'PASS: 157 people, 856 mentions, 910 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.' }, authorization: 'Independent review accepted this candidate; it does not replace the required fresh canonical audit.' });
writeTextAtomic(extractionPath, compact);
if (sha256(JSON.stringify(readJson(extractionPath))) !== candidateHash) throw new Error('Persisted canonical extraction differs from the sealed candidate');
const freshPacket = buildDateAuditPacket(book, chapter);
if (freshPacket.sourceHash !== sourceHash || freshPacket.extractionHash !== candidateHash || freshPacket.units.length !== 322 || freshPacket.people.length !== 157) throw new Error('Fresh re-audit packet is not complete and pinned');
const reAuditPacketFile = `${candidateHash.slice(7)}.fresh-canonical-re-audit-packet.json`;
const freshPacketHash = sha256(JSON.stringify(freshPacket));
writeJsonAtomic(path.join(directory, reAuditPacketFile), freshPacket);
writeJsonAtomic(path.join(directory, curationFile), { schemaVersion: 1, kind: 'host-date-repair-curation', book, chapter, candidateCommit, candidateFile, reviewerCommit: reviewCommit, acceptanceAttachment: acceptanceFile, sealedCandidateHash: seal, candidateExtractionHash: candidateHash, canonicalSourceHash: sourceHash, priorCanonicalExtractionHash: canonicalHash, priorAuditReportHash: auditHash, operations: 2, operationKinds: { replace: 2 }, validation: { canonicalPins: 'PASS', auditPin: 'PASS', sealedProposalIdentity: 'PASS', acceptedReviewIdentity: 'PASS', exactReplayAndHash: 'PASS', sourceContexts: 'PASS: claim-428 Tianyou 3 first month / AD 906; claim-466 Tianyou 2 eleventh month / AD 905.', retainedHints: 'PASS: p138 and p157 hints byte-identical.', strictCompactValidation: 'PASS: 157 people, 856 mentions, 910 claims, zero alias-disposition conflicts.', chronologyGeometry: 'PASS: zero diagnostics.' }, priorAuditDisposition: audit.status, auditStatusMutation: 'NONE: host curation cannot self-approve or rewrite the independent audit; a fresh audit is required.', freshCanonicalReaudit: { status: 'required', packetFile: reAuditPacketFile, packetHash: freshPacketHash, sourceHash: freshPacket.sourceHash, extractionHash: freshPacket.extractionHash, completeScope: { sourceUnits: freshPacket.units.length, temporalClaimAndHintChecks: freshPacket.items.length, people: freshPacket.people.length }, requiredReviewerConstraint: 'A reviewer independent of the candidate author, independent reviewer, original audit author, and host curator must review the complete packet.' }, publication: 'staging-only', masterMutation: 'NONE' });
console.log(JSON.stringify({ curationFile, acceptanceFile, reAuditPacketFile, candidateHash, freshPacketHash, validation: validation.stats, geometry: 'PASS' }));
