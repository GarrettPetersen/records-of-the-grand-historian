import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '118';
const seal = 'sha256:3a163c86cad1deb7d3567007019c0687a846cdd4c8d8d541877a1571217ce74d';
const expectedSource = 'sha256:fe71712bfce73f223899014aade5c70426aa2a8b5c04522f9907800ec192cb52';
const expectedBefore = 'sha256:a72989513e37d0698e1a10dc80994d7d5ba94b54a1bb441f32948bfac0337486';
const expectedCandidate = 'sha256:710727e058835f388f79b8e4a65cc540230de4e79df3e233cfdc95597af691e1';
const repairDir = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
const staged = readJson(path.join(repairDir, 'staged-candidate-3a163c86cad1deb7d356.json'));
const receipt = readJson(path.join(repairDir, `${seal.slice(7)}.candidate-review.json`));
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const before = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction: before });
if (packet.sourceHash !== expectedSource || packet.extractionHash !== expectedBefore) throw new Error('Canonical pins differ from accepted corrective candidate');
if (staged.sealedCandidateHash !== seal || sha256(JSON.stringify(staged.candidate)) !== expectedCandidate) throw new Error('Sealed candidate does not match its promised extraction');
if (receipt.disposition !== 'accept-for-host-curation' || receipt.sealedCandidateHash !== seal || receipt.candidateExtractionHash !== expectedCandidate) throw new Error('Independent review receipt does not accept this exact candidate');
if (staged.proposal.changes.length !== 2 || staged.proposal.changes[0].id !== 'claim-700' || staged.proposal.changes[1].personId !== 'p098') throw new Error('Corrective proposal is not the approved two-operation replay');
const candidate = staged.candidate;
if (candidate.claims.some(claim => JSON.stringify(claim) === JSON.stringify(staged.proposal.changes[0].before))) throw new Error('claim-700 remains in corrective candidate');
if (candidate.people.find(person => person[0] === 'p098')?.[4]?.a?.join('|') !== 'AD 958') throw new Error('Tang Yue does not retain only the AD 958 active hint');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter), { strictAliasDispositions: true });
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Chronology geometry failed: ${JSON.stringify(geometry)}`);
writeJsonAtomic(extractionPath, candidate);
const curation = {
  schemaVersion: 1,
  kind: 'host-date-repair-curation',
  book,
  chapter,
  candidateCommit: '421357160542658447b4022003e383d5e24f7482',
  independentReviewCommit: 'bf76db4a0a902105d939a14fc4fd27e8ca9c34d6',
  candidateFile: 'staged-candidate-3a163c86cad1deb7d356.json',
  candidateReview: `${seal.slice(7)}.candidate-review.json`,
  sealedCandidateHash: seal,
  candidateExtractionHash: expectedCandidate,
  canonicalSourceHash: expectedSource,
  priorCanonicalExtractionHash: expectedBefore,
  operations: 2,
  auditGroups: 1,
  scope: { falseRetrospectiveClaimRemovals: 1, sourceBackedHintAdditions: 1 },
  validation: {
    sourceCandidateReviewPins: 'PASS',
    sealedProposalIdentity: 'PASS',
    exactReplay: 'PASS: claim-700 removal and p098 AD 958 hint replayed exactly.',
    candidateHash: 'PASS',
    scopedDelta: 'PASS: only the approved people claim removal and active-hint addition changed.',
    compactSchema: `PASS: ${validation.stats.claims} claims.`,
    chronologyGeometry: 'PASS: zero diagnostics.'
  },
  publication: 'staging-only',
  masterMutation: 'NONE',
  sharedTreeMutation: 'NONE',
  nextStep: 'Fresh independent canonical date audit by a different reviewer before any master publication.'
};
writeJsonAtomic(path.join(repairDir, `${seal.slice(7)}.curation.json`), curation);
console.log(JSON.stringify({ candidateHash: sha256(JSON.stringify(readJson(extractionPath))), stats: validation.stats, geometry: geometry.length }));
