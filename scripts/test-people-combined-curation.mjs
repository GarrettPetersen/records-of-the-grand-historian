import {fileURLToPath} from 'node:url';
import {prepareChapterNativeInputs} from './lib/people-chapter-native-inputs.mjs';
import {deriveDateRepairEditorialAmendment,applyDateRepairEditorialAmendment} from './lib/people-date-workflow.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { buildPeopleExtractionPacket, buildPeopleExtractionSeed } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { buildCompactInput } from './lib/people-compact.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { editorialDecisionSeed, editorialReviews, proposalSetFingerprint, validateAppliedEditorialDecisions } from './lib/people-editorial-decisions.mjs';
import { sha256, contentUnits, writeJsonAtomic } from './lib/people-content.mjs';
import { reservePeopleTargetsInLedger } from './lib/people-work-queue.mjs';
import { inspectCombinedBefore, prepareCombinedCuration, verifyCombinedCuration, publishCombinedCuration } from './lib/people-combined-curation.mjs';
import { CompletedDateGenerationHold } from './lib/people-date-workflow.mjs';
import { combinedDatePacket, documentHash, replayCombinedSourceReordering, validateCombinedReviews, combinedEditorialBaseline, acceptedHistoricalClaims } from './lib/people-combined-curation-review.mjs';

const reason = 'Independently checked this exact source unit and its named individual against the complete fixture.';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hashFile = file => `sha256:${createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`;
const unpack = content => JSON.parse(Buffer.from(content.base64, 'base64'));
const pinFile = file => ({ file, bytes: fs.statSync(file).size, sha256: hashFile(file) });
const chunkRun = agentId => ({ model: 'offline-fixture-chunked', promptVersion: 7, agentId: null,
  chunks: [{ chunkId: '001', startOrder: 0, endOrderExclusive: 1, model: 'offline-fixture', agentId, runId: 'chunk-run', completedAt: '2026-09-13T00:00:00Z' }] });

const runnerSource = fs.readFileSync(new URL('./run-people-date-workflow.mjs', import.meta.url), 'utf8');
const reservationStart = 'reserved=mutateRemotePeopleWorkLedger(ledger=>{';
const reservationEnd = '},{message:`Reserve date audit ${key}`}).result;';
const start = runnerSource.indexOf(reservationStart), end = runnerSource.indexOf(reservationEnd, start);
assert.ok(start >= 0 && end > start, 'production reservation callback must be present');
const makeOrdinaryReservation = new Function('o', 'key', 'CompletedDateGenerationHold', `return ledger=>{${runnerSource.slice(start + reservationStart.length, end)}}`);

export function fixture(t, book = 'testbook', chapter = '001', run = { model: 'offline-fixture', promptVersion: 7, agentId: 'extractor' }, authorAgentIds = ['extractor', 'curator'], { reorder = false, multiple = false, initial = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'combined-curation-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const people = path.join(root, 'data', 'people');
  const files = { source: path.join(root, 'data', book, `${chapter}.json`),
    extraction: path.join(people, 'extractions', book, `${chapter}.json`),
    editorial: path.join(people, 'editorial-decisions', book, `${chapter}.json`),
    dateReport: path.join(people, 'date-audits', book, `${chapter}.json`) };
  const workflow = path.join(people, 'generated', 'date-workflow', book, chapter);
  const source = { meta: { book, chapter }, content: [{ sentences: [{ id: 's0001', zh: '\u827e\u9e97\u7d72\u4f86\u3002', translations: [{ lang: 'en', literal: 'Alice Smith come.', idiomatic: 'The official Alice Smith came.' }] }] }] };
  if (reorder) {
    source.content[0].type = 'paragraph';
    source.content.push(
      { type: 'paragraph', sentences: [{ id: 's0067', zh: '\u96e8\u3002', translations: [{ lang: 'en', literal: 'it rained.', idiomatic: 'it rained.' }] }] },
      { type: 'paragraph', sentences: [{ id: 's0002', zh: '\u96ea\u3002', translations: [{ lang: 'en', literal: 'it snowed.', idiomatic: 'it snowed.' }] }] },
    );
  }
  const packetFor = source => buildPeopleExtractionPacket(book, chapter, { chapterData: source, properNounMatcher: loadProperNounMatcher() });
  const beforePacket = packetFor(source);
  const extraction = { schemaVersion: 2, book, chapter, input: buildCompactInput(beforePacket),
    run,
    people: [['p001', ['Alice Smith', '\u827e\u9e97\u7d72', null], 'historical', 'A named traveler.', { n: [], r: [], a: ['AD 1'], p: [], x: null }, [[{ kind: 'personal-name', en: 'Alice Smith', zh: '\u827e\u9e97\u7d72' }, 'explicit', ['s0001']]], [['official', 'explicit', ['s0001']]]]],
    surfaces: [['p001', 'personal-name', 'en', 'Alice Smith', [['s0001', [0]]]], ['p001', 'personal-name', 'zh', '\u827e\u9e97\u7d72', [['s0001', [0]]]]],
    claims: [['p001', 'attestation', { event: 'Arrived in the fixture narrative.', sourceDate: { text: 'Fixture year' }, westernYear: { era: 'AD', year: 1, precision: 'year' } }, 'explicit', ['s0001']]],
    translationRepairs: [], candidateDispositions: [],
    coverage: Object.fromEntries(Object.entries(buildPeopleExtractionSeed(beforePacket, 'test').coverage).map(([k, v]) => [k, typeof v === 'boolean' ? true : v])) };
  const beforeExpanded = validateCompactPeopleExtraction(extraction, beforePacket, { strictAliasDispositions: true }).normalized;
  const editorialBefore = editorialDecisionSeed(beforeExpanded);
  editorialBefore.reviewer = { kind: 'human', name: 'Old independent editor', model: null, agentId: 'old-editor', runId: null, completedAt: '2026-09-01T00:00:00Z' };
  const afterSource = structuredClone(source);
  let sourceReordering;
  if (reorder) {
    const [block] = afterSource.content.splice(1, 1);
    afterSource.content.splice(0, 0, block);
    sourceReordering = {
      schemaVersion: 1, kind: 'source-unit-reordering', book, chapter, authorAgentId: 'curator',
      beforeSourceHash: documentHash(source), reorderedSourceHash: documentHash(afterSource),
      beforeUnitOrder: contentUnits(source).map(u => u.id), afterUnitOrder: contentUnits(afterSource).map(u => u.id),
      moves: [{ kind: 'move-paragraph-block', fromBlockIndex: 1, toBlockIndex: 0, unitIds: ['s0067'], block: structuredClone(block) }],
    };
  }
  afterSource.content[reorder ? 1 : 0].sentences[0].translations[0].literal = multiple ? 'Alice Smith had come.' : 'Alice Smith came.';
  const packet = packetFor(afterSource);
  const candidate = structuredClone(extraction);
  candidate.input = buildCompactInput(packet);
  candidate.people[0][3] = 'The independently identified traveler Alice.';
  candidate.people[0][4].a = ['AD 2'];
  candidate.claims[0][2].westernYear.year = 2;
  const proposal = structuredClone(beforeExpanded);
  proposal.translationRepairs = [{ id: `${book}:${chapter}:r0001`, unit: validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true }).normalized.mentions[0].unit, field: 'literal', before: 'Alice Smith come.', after: 'Alice Smith came.', reason, confidence: 'high', status: 'proposed' }];
  const newEditorial = editorialDecisionSeed(proposal);
  newEditorial.reviewer = { kind: 'human', name: 'Independent editor', model: null, agentId: 'reviewer', runId: null, completedAt: '2026-09-14T00:00:00Z' };
  newEditorial.decisions[0] = { repairId: `${book}:${chapter}:r0001`, decision: 'accept', after: null, reason, sourceWitness: { source: 'chapter-text', citation: 's0001', excerpt: '\u827e\u9e97\u7d72\u4f86\u3002' } };
  candidate.translationRepairs = [['s0001', 'literal', 'Alice Smith come.', 'Alice Smith came.', reason, 'high', 'applied']];
  const record = r => structuredClone(Object.fromEntries(Object.entries(r).filter(([k]) => !['schemaVersion', 'book', 'chapter'].includes(k))));
  const editorial = { schemaVersion: 4, book, chapter, reviews: [record(editorialBefore), record(newEditorial)] };
  if (multiple) {
    const secondProposal = structuredClone(proposal);
    secondProposal.translationRepairs = [{ ...secondProposal.translationRepairs[0], id: `${book}:${chapter}:r0002`, before: 'Alice Smith came.', after: 'Alice Smith had come.' }];
    const secondEditorial = editorialDecisionSeed(secondProposal);
    secondEditorial.reviewer = { ...newEditorial.reviewer, name: 'Second independent editor', agentId: 'reviewer-two' };
    secondEditorial.decisions[0] = { ...newEditorial.decisions[0], repairId: `${book}:${chapter}:r0002` };
    editorial.reviews.push(record(secondEditorial));
    candidate.translationRepairs.push(['s0001', 'literal', 'Alice Smith came.', 'Alice Smith had come.', reason, 'high', 'applied']);
  }
  const result = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
  const expanded = result.normalized;
  const dates = combinedDatePacket(book, chapter, afterSource, candidate);
  const reviewer = { name: 'Independent fixture reviewer', agentId: 'reviewer', actualAgentId: 'reviewer', independentOfExtractor: true, independentOfRepairAuthor: true, excludedAuthorAgentIds: ['extractor', 'curator'] };
  const hashes = { sourceHash: dates.sourceHash, extractionHash: dates.extractionHash };
  const check = id => ({ id, verdict: 'supported', reason, evidence: [{ unit: 's0001', quote: '\u827e\u9e97\u7d72' }] });
  const dateReport = { schemaVersion: 1, auditVersion: 1, book, chapter, ...hashes, status: 'audited', reviewer, reviewedAt: '2026-09-14T00:00:00Z', summary: reason,
    reviewedUnits: dates.units.map(u => u.id), itemChecks: dates.items.map(i => ({ ...check(i.id), event: reason })), personChecks: dates.people.map(p => check(p.id)), findings: [], references: [] };
  const identity = { schemaVersion: 1, reportType: 'complete-independent-source-identity-review', book, chapter, ...hashes, status: 'approved', approved: true,
    reviewer, reviewedAt: dateReport.reviewedAt, summary: reason, findings: [], references: [],
    unitChecks: packet.units.map(u => ({ ...check(u.id), sourceHash: sha256(u.zh), englishHash: sha256(u.en), literalHash: sha256(u.literal), mentions: expanded.mentions.filter(m => m.unit.id === u.id).map(m => m.id) })),
    personChecks: candidate.people.map(p => ({ ...check(p[0]), names: p[1] })),
    nameClaimChecks: candidate.people.flatMap((p, i) => p[5].map((claim, j) => ({ ...check(`name-${p[0]}-${j + 1}`), personId: p[0], path: `/people/${i}/5/${j}`, claim }))),
    familyRelationshipChecks: [],
    mentionChecks: expanded.mentions.map(m => ({ ...check(m.id), personId: m.person.split(':').at(-1), unit: m.unit.id, kind: m.kind, spans: m.spans, candidateRefs: m.candidateRefs })),
    candidateChecks: packet.preflight.candidates.map(c => { const mentions = expanded.mentions.filter(m => m.candidateRefs.includes(c.id)); return { ...c, ...check(c.id), mentionIds: mentions.map(m => m.id), personalOwners: [...new Set(mentions.map(m => m.person.split(':').at(-1)))], disposition: expanded.candidateDispositions.find(d => d.candidate === c.id) ?? null }; }),
    collectiveOccurrenceChecks: [],
    coverage: { sourceUnits: packet.units.length, people: 1, nameClaims: 1, familyRelationships: 0, personalMentions: expanded.mentions.length, scannerCandidates: packet.preflight.candidates.length,
      candidateDispositions: expanded.candidateDispositions.length, collectiveOccurrences: 0, temporalItems: dates.items.length,
      allSourceUnitsRead: true, allStoredMentionsChecked: true, unscannedCallbacksChecked: true, namedPeopleAndDefiniteCallbacksComplete: true, omittedNamedPeopleFound: 0 } };
  const beforeDates = combinedDatePacket(book, chapter, source, extraction);
  const oldReport = { ...dateReport, sourceHash: beforeDates.sourceHash, extractionHash: beforeDates.extractionHash, status: 'research-blocked',
    itemChecks: dateReport.itemChecks.map(c => ({ ...c, verdict: 'research-blocked' })), findings: dateReport.itemChecks.map(c => ({ items: [c.id], problem: reason, action: reason })) };
  for (const [role, doc] of Object.entries({ source, extraction, editorial: editorialBefore, dateReport: oldReport })) if (!initial || role !== 'dateReport') writeJsonAtomic(files[role], doc);
  const state = { schemaVersion: 1, workflowVersion: 1, sourceHash: beforeDates.sourceHash, extractionHash: beforeDates.extractionHash, phase: 'repair', round: 0, jobs: { 'repair-0-retained': { agentId: 'curator', conversation: 'do-not-delete' } }, review: 'review-0.json' };
  if (!initial) {
    writeJsonAtomic(path.join(workflow, 'state.json'), state);
    writeJsonAtomic(path.join(workflow, 'review-0.json'), oldReport);
    writeJsonAtomic(path.join(workflow, 'jobs', 'failed.json'), { rejected: true, evidence: 'retain all bytes' });
  }
  const materializedDir = path.join(root, 'staged', 'materialized'), reviewDir = path.join(root, 'staged', 'independent-review');
  const inputPaths = { source: path.join(materializedDir, 'data', book, `${chapter}.json`), extraction: path.join(materializedDir, 'candidate.json'), editorial: path.join(materializedDir, 'editorial-decisions.json'), materialization: path.join(materializedDir, 'validation.json'),
    identity: path.join(reviewDir, 'identity-review.json'), dateReport: path.join(reviewDir, 'date-report.json'), validation: path.join(reviewDir, 'validation.json'), seal: path.join(reviewDir, 'input-seal.json') };
  for (const [role, doc] of Object.entries({ source: afterSource, extraction: candidate, editorial })) writeJsonAtomic(inputPaths[role], doc);
  const materialization = { ...hashes, sourceByteHash: hashFile(inputPaths.source), extractionByteHash: hashFile(inputPaths.extraction) };
  if (reorder) materialization.sourceReordering = sourceReordering;
  writeJsonAtomic(inputPaths.materialization, materialization);
  const context = { candidatePath: inputPaths.extraction, sourcePath: inputPaths.source, candidateByteHash: materialization.extractionByteHash, sourceByteHash: materialization.sourceByteHash, editorialDecisionHash: documentHash(newEditorial), amendmentAuthor: 'curator' };
  if (multiple) {
    delete context.editorialDecisionHash;
    context.editorialDecisionHashes = editorialReviews(editorial).slice(1).map(documentHash);
  }
  if (reorder) {
    context.sourceReorderingHash = documentHash(sourceReordering);
    identity.sourceReorderingReview = { id: context.sourceReorderingHash, verdict: 'supported', reason, evidence: [{ unit: 's0067', quote: '\u96e8' }] };
  }
  identity.reviewContext = context; dateReport.reviewContext = context;
  const validation = { ...hashes, status: 'approved-exact-editorial-amended-candidate', reviewerId: 'reviewer', identityReviewHash: documentHash(identity), dateReportHash: documentHash(dateReport), productionDateReportValid: true, productionAppliedEditorialValid: true, completeIdentityEvidenceCoverage: true, exactFreshDatePacket: true, allProtectedBytesUnchanged: true, productionExtractionStats: result.stats, strictAliasDispositionConflicts: [], dateGeometryReceptionDiagnostics: [] };
  const protectedFile = path.join(root, 'protected.json');
  writeJsonAtomic(protectedFile, { unchanged: true });
  const protectedPaths = [files.source, files.extraction, files.editorial, inputPaths.source, inputPaths.extraction, inputPaths.editorial, inputPaths.materialization, protectedFile];
  const seal = { ...hashes, reviewer, protectedFiles: protectedPaths.map(file => ({ file, bytes: fs.statSync(file).size, sha256: hashFile(file) })) };
  if (multiple) seal.editorialDecisionHashes = [...context.editorialDecisionHashes];
  if (reorder) {
    validation.sourceReorderingHash = context.sourceReorderingHash;
    seal.sourceReorderingHash = context.sourceReorderingHash;
  }
  for (const [role, doc] of Object.entries({ identity, dateReport, validation, seal })) writeJsonAtomic(inputPaths[role], doc);
  const priorClaim = { lane: 'manual', worker: 'sticky-worker', status: initial ? 'active' : 'research-blocked', sourceHash: beforeDates.sourceHash, extractionHash: beforeDates.extractionHash, jobs: initial ? {} : structuredClone(state.jobs) };
  const spec = { root, book, chapter, materializedDir, reviewDir, before: inspectCombinedBefore({ root, book, chapter }), priorClaim, claimHash: documentHash(priorClaim), authorAgentIds };
  const ledger = { schemaVersion: 1, claims: {}, dateAudits: { [`${book}/${chapter}`]: structuredClone(priorClaim) }, sentinel: { unrelated: 'unchanged' } };
  let calls = 0;
  const options = { root, mutateLedger: fn => {
    calls++;
    const copy = structuredClone(ledger), result = fn(copy);
    for (const key of Object.keys(ledger)) delete ledger[key];
    Object.assign(ledger, copy);
    return { result, ledger: structuredClone(ledger) };
  } };
  const prepared = prepareCombinedCuration(spec);
  return { root, spec, ...prepared, options, files, workflow, inputPaths, ledger, protectedFile, state,
    calls: () => calls, key: `${book}/${chapter}`, docs: { book, chapter, source: afterSource, candidate, editorial, identity, dateReport, validation, materialization, seal, beforeSource: source, beforeExtraction: extraction, beforeEditorial: editorialBefore, authorAgentIds: spec.authorAgentIds } };
}

function unchangedEnglishDocs(t) {
  const f = fixture(t), d = structuredClone(f.docs);
  d.beforeSource = structuredClone(d.source);
  d.beforeExtraction.input = structuredClone(d.candidate.input);
  d.beforeExtraction.translationRepairs = structuredClone(d.candidate.translationRepairs);
  d.beforeEditorial = structuredClone(d.editorial);
  for (const report of [d.identity, d.dateReport]) {
    delete report.reviewContext.editorialDecisionHash;
    report.reviewContext.editorialDecisionHashes = [];
  }
  d.seal.editorialDecisionHashes = [];
  d.validation.status = 'approved-exact-combined-candidate';
  d.validation.identityReviewHash = documentHash(d.identity);
  d.validation.dateReportHash = documentHash(d.dateReport);
  return { f, d };
}

test('correct English needs no invented repair for independently reviewed person/date corrections', t => {
  const { f, d } = unchangedEnglishDocs(t);
  assert.notDeepEqual(d.beforeExtraction.people, d.candidate.people);
  assert.deepEqual(d.beforeSource, d.source);
  assert.deepEqual(d.beforeEditorial, d.editorial);
  assert.equal(validateCombinedReviews(d, { dataDir: path.join(f.root, 'data') }).stats.people, 1);
});

test('unchanged-English path rejects fabricated editorial pins and altered history', t => {
  const { f, d } = unchangedEnglishDocs(t);
  d.identity.reviewContext.editorialDecisionHash = 'sha256:' + '0'.repeat(64);
  assert.throws(() => validateCombinedReviews(d, { dataDir: path.join(f.root, 'data') }), /phantom incoming editorial/);
  delete d.identity.reviewContext.editorialDecisionHash;
  d.editorial.chapter = '002';
  assert.throws(() => validateCombinedReviews(d, { dataDir: path.join(f.root, 'data') }), /editorial scope/);
});

test('unchanged English publishes reviewed identity/date changes without rewriting source or editorial history', t => {
  const { f, d } = unchangedEnglishDocs(t);
  const beforeDates = combinedDatePacket(d.book, d.chapter, d.beforeSource, d.beforeExtraction);
  writeJsonAtomic(f.files.source, d.beforeSource);
  writeJsonAtomic(f.files.extraction, d.beforeExtraction);
  writeJsonAtomic(f.files.editorial, d.beforeEditorial);
  const oldReport = read(f.files.dateReport);
  Object.assign(oldReport, { sourceHash: beforeDates.sourceHash, extractionHash: beforeDates.extractionHash });
  writeJsonAtomic(f.files.dateReport, oldReport);
  Object.assign(f.state, { sourceHash: beforeDates.sourceHash, extractionHash: beforeDates.extractionHash });
  writeJsonAtomic(path.join(f.workflow, 'state.json'), f.state);
  Object.assign(f.spec.priorClaim, { sourceHash: beforeDates.sourceHash, extractionHash: beforeDates.extractionHash });
  f.spec.claimHash = documentHash(f.spec.priorClaim);
  f.ledger.dateAudits[f.key] = structuredClone(f.spec.priorClaim);
  d.seal.protectedFiles = d.seal.protectedFiles.map(pin => pinFile(pin.file));
  for (const [role, doc] of Object.entries({ identity: d.identity, dateReport: d.dateReport, validation: d.validation, seal: d.seal })) writeJsonAtomic(f.inputPaths[role], doc);
  f.spec.before = inspectCombinedBefore({ root: f.root, book: d.book, chapter: d.chapter });
  const prepared = prepareCombinedCuration(f.spec);
  const sourceHash = hashFile(f.files.source), editorialHash = hashFile(f.files.editorial);
  assert.equal(publishCombinedCuration(prepared.receipt, prepared.hash, f.options).status, 'complete');
  assert.equal(hashFile(f.files.source), sourceHash);
  assert.equal(hashFile(f.files.editorial), editorialHash);
  assert.deepEqual(read(f.files.extraction), d.candidate);
  assert.equal(f.ledger.dateAudits[f.key].status, 'ready');
});

test('unchanged-English path cannot approve an unrecorded English edit or self-review', t => {
  const { f, d } = unchangedEnglishDocs(t);
  d.source.content[0].sentences[0].translations[0].literal += ' Unreviewed new claim.';
  assert.throws(() => validateCombinedReviews(d, { dataDir: path.join(f.root, 'data') }));
  d.source = structuredClone(d.beforeSource);
  d.authorAgentIds.push(d.identity.reviewer.agentId);
  assert.throws(() => validateCombinedReviews(d, { dataDir: path.join(f.root, 'data') }), /self-approved/);
});

test('GrokBot editorial review has an explicit provenance kind, with unknown kinds still rejected', t => {
  const f = fixture(t), d = structuredClone(f.docs);
  d.editorial.reviews.at(-1).reviewer.kind = 'grokbot';
  const bind = () => {
    for (const report of [d.identity, d.dateReport]) report.reviewContext.editorialDecisionHash = documentHash(editorialReviews(d.editorial).at(-1));
    d.validation.identityReviewHash = documentHash(d.identity);
    d.validation.dateReportHash = documentHash(d.dateReport);
  };
  bind();assert.equal(validateCombinedReviews(d, { dataDir: path.join(f.root, 'data') }).stats.people, 1);
  d.editorial.reviews.at(-1).reviewer.kind = 'invented-review-engine';bind();
  assert.throws(() => validateCombinedReviews(d, { dataDir: path.join(f.root, 'data') }));
});

function reorderContract(source, moves) {
  const reordered = structuredClone(source);
  const operations = moves.map(([fromBlockIndex, toBlockIndex]) => {
    const [block] = reordered.content.splice(fromBlockIndex, 1);
    reordered.content.splice(toBlockIndex, 0, block);
    return { kind: 'move-paragraph-block', fromBlockIndex, toBlockIndex, unitIds: block.sentences.map(u => u.id), block: structuredClone(block) };
  });
  return {
    schemaVersion: 1, kind: 'source-unit-reordering', book: 'testbook', chapter: '001', authorAgentId: 'curator',
    beforeSourceHash: documentHash(source), reorderedSourceHash: documentHash(reordered),
    beforeUnitOrder: contentUnits(source).map(u => u.id), afterUnitOrder: contentUnits(reordered).map(u => u.id), moves: operations,
  };
}

function reorderSource() {
  const sentence = id => ({ id, zh: '\u96e8\u3002', translations: [{ lang: 'en', literal: 'it rained.', idiomatic: 'it rained.', model: 'original-provenance' }], reviewed: false });
  return { meta: { unchanged: true }, content: [
    { type: 'paragraph', label: 'unchanged block metadata', sentences: [sentence('s0067')] },
    { type: 'paragraph', sentences: [sentence('s0001'), sentence('s0002')] },
    { type: 'paragraph', sentences: [sentence('s0003')] },
  ] };
}

for (const [label, moves, order] of [
  ['first to last', [[0, 2]], ['s0001', 's0002', 's0003', 's0067']],
  ['last to first', [[2, 0]], ['s0003', 's0067', 's0001', 's0002']],
  ['sequential multi-unit moves', [[1, 0], [2, 1]], ['s0001', 's0002', 's0003', 's0067']],
]) {
  test(`source reordering replays ${label} with exact payloads and no input mutation`, () => {
    const source = reorderSource(), before = structuredClone(source), contract = reorderContract(source, moves);
    const contractBefore = structuredClone(contract);
    const after = replayCombinedSourceReordering(source, contract, { book: 'testbook', chapter: '001' });
    assert.deepEqual(contentUnits(after).map(u => u.id), order);
    assert.deepEqual(after.meta, source.meta);
    for (const unit of contentUnits(before)) assert.deepEqual(contentUnits(after).find(u => u.id === unit.id).source, unit.source);
    assert.deepEqual(source, before);
    assert.deepEqual(contract, contractBefore);
  });
}

for (const [label, mutate] of Object.entries({
  'wrong scope': c => { c.chapter = '002'; },
  'unknown protocol': c => { c.schemaVersion = 2; },
  'missing author': c => { c.authorAgentId = ''; },
  'unsealed arbitrary operation fields': c => { c.moves[0].patch = { zh: 'changed' }; },
  'unknown operation': c => { c.moves[0].kind = 'replace-unit'; },
  'stale source pin': c => { c.beforeSourceHash = `sha256:${'0'.repeat(64)}`; },
  'stale reordered pin': c => { c.reorderedSourceHash = `sha256:${'0'.repeat(64)}`; },
  'missing before order': c => { c.beforeUnitOrder.pop(); },
  'renamed after ID': c => { c.afterUnitOrder[0] = 'renamed'; },
  'duplicate after ID': c => { c.afterUnitOrder[0] = c.afterUnitOrder[1]; },
  'wrong direction': c => { c.moves[0].fromBlockIndex = 2; c.moves[0].toBlockIndex = 0; },
  'negative index': c => { c.moves[0].fromBlockIndex = -1; },
  'out-of-range destination': c => { c.moves[0].toBlockIndex = 3; },
  'fractional index': c => { c.moves[0].fromBlockIndex = 0.5; },
  'coerced index': c => { c.moves[0].fromBlockIndex = '0'; },
  'no-op': c => { c.moves[0].toBlockIndex = 0; },
  'missing moves': c => { c.moves = []; },
  'partial block IDs': c => { c.moves[0].unitIds = []; },
  'Chinese edit inside move': c => { c.moves[0].block.sentences[0].zh += '\u96ea'; },
  'English edit inside move': c => { c.moves[0].block.sentences[0].translations[0].literal = 'changed'; },
  'metadata edit inside move': c => { c.moves[0].block.sentences[0].reviewed = true; },
  'ID edit inside move': c => { c.moves[0].block.sentences[0].id = 's0004'; },
})) {
  test(`source reordering rejects ${label}`, () => {
    const source = reorderSource(), before = structuredClone(source), contract = reorderContract(source, [[0, 2]]);
    mutate(contract);
    assert.throws(() => replayCombinedSourceReordering(source, contract, { book: 'testbook', chapter: '001' }), /source reordering|Source reordering/);
    assert.deepEqual(source, before);
  });
}

test('source reordering refuses duplicate source IDs, table moves, null contracts and cancelling moves', () => {
  const scope = { book: 'testbook', chapter: '001' };
  const duplicate = reorderSource(); duplicate.content[1].sentences[0].id = 's0067';
  assert.throws(() => replayCombinedSourceReordering(duplicate, reorderContract(duplicate, [[0, 2]]), scope), /duplicate content-unit ID/);
  const table = reorderSource(); table.content[0].type = 'table_header';
  assert.throws(() => replayCombinedSourceReordering(table, reorderContract(table, [[0, 2]]), scope), /only complete nonempty paragraph/);
  const mixed = reorderSource(); mixed.content[0].cells = [];
  assert.throws(() => replayCombinedSourceReordering(mixed, reorderContract(mixed, [[0, 2]]), scope), /only complete nonempty paragraph/);
  const source = reorderSource();
  assert.throws(() => replayCombinedSourceReordering(source, null, scope), /Missing source reordering/);
  assert.throws(() => replayCombinedSourceReordering(source, reorderContract(source, [[0, 2], [2, 0]]), scope), /no net order change/);
});

const reorderedFixture = t => fixture(t, 'hanshu', '003', undefined, undefined, { reorder: true });

test('source reordering is sealed, independently reviewed, replayed before shifted English repairs and published only in scratch', t => {
  const f = reorderedFixture(t);
  const contract = f.docs.materialization.sourceReordering;
  assert.equal(f.calls(), 0);
  assert.deepEqual(read(f.files.source), f.docs.beforeSource);
  assert.deepEqual(unpack(f.receipt.inputs.materialization.content).sourceReordering, contract);
  assert.equal(f.docs.identity.sourceReorderingReview.id, documentHash(contract));
  assert.equal(verifyCombinedCuration(f.receipt, f.hash, { root: f.root }).status, 'verified');
  publishCombinedCuration(f.receipt, f.hash, f.options);
  const after = read(f.files.source);
  assert.deepEqual(contentUnits(after).map(u => u.id), ['s0067', 's0001', 's0002']);
  assert.deepEqual(after.content[0], f.docs.beforeSource.content[1]);
  assert.equal(after.content[1].sentences[0].translations[0].literal, 'Alice Smith came.');
  assert.deepEqual(read(f.files.extraction).run, f.docs.beforeExtraction.run);
  assert.equal(publishCombinedCuration(f.receipt, f.hash, f.options).status, 'complete');
});

test('source reordering recovery retains the same sealed contract after a partial scratch publication', t => {
  const f = reorderedFixture(t);
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, { ...f.options, checkpoint: stage => { if (stage === 'source') throw new Error('fixture interruption'); } }), /fixture interruption/);
  assert.equal(f.ledger.dateAudits[f.key].status, 'research-blocked');
  assert.equal(publishCombinedCuration(f.receipt, f.hash, f.options).status, 'complete');
  assert.deepEqual(read(f.files.source), f.docs.source);
});

function bindReordering(docs) {
  const hash = documentHash(docs.materialization.sourceReordering);
  for (const report of [docs.identity.reviewContext, docs.dateReport.reviewContext, docs.validation, docs.seal]) report.sourceReorderingHash = hash;
  docs.identity.sourceReorderingReview.id = hash;
  docs.validation.identityReviewHash = documentHash(docs.identity);
  docs.validation.dateReportHash = documentHash(docs.dateReport);
}

for (const [label, mutate, pattern] of [
  ['missing explicit approval', d => { delete d.identity.sourceReorderingReview; }, /source reordering approval/],
  ['rejected source approval', d => { d.identity.sourceReorderingReview.verdict = 'needs-revision'; }, /source reordering approval/],
  ['no source reasoning', d => { d.identity.sourceReorderingReview.reason = ''; }, /source reordering reasoning/],
  ['fabricated source evidence', d => { d.identity.sourceReorderingReview.evidence[0].quote = 'not in source'; }, /source reordering source evidence/],
  ['wrong identity pin', d => { d.identity.reviewContext = { ...d.identity.reviewContext, sourceReorderingHash: 'wrong' }; }, /source reordering hash/],
  ['missing date pin', d => { d.dateReport.reviewContext = { ...d.dateReport.reviewContext }; delete d.dateReport.reviewContext.sourceReorderingHash; }, /source reordering hash/],
  ['wrong seal pin', d => { d.seal.sourceReorderingHash = 'wrong'; }, /source reordering hash/],
  ['missing validation pin', d => { delete d.validation.sourceReorderingHash; }, /source reordering hash/],
  ['resealed stale exact block', d => { d.materialization.sourceReordering.moves[0].block.sentences[0].zh = 'changed'; bindReordering(d); }, /exact block payload/],
  ['undeclared move author', d => { d.materialization.sourceReordering.authorAgentId = 'omitted-author'; bindReordering(d); }, /Missing declared curation author/],
  ['self-approved move author', d => { d.materialization.sourceReordering.authorAgentId = 'reviewer'; d.authorAgentIds.push('reviewer'); bindReordering(d); }, /self-approved/],
  ['missing incoming editorial component', d => { d.editorial = d.beforeEditorial; }, /has no matching independent/],
  ['missing applied English contracts', d => { d.candidate.translationRepairs = []; }, /does not match applied decision/],
  ['incomplete definite title callbacks', d => { d.identity.coverage.namedPeopleAndDefiniteCallbacksComplete = false; }, /namedPeopleAndDefiniteCallbacksComplete/],
  ['unresolved identity findings', d => { d.identity.findings = [{ problem: 'Unreviewed emperor reference' }]; }, /unresolved identity findings/],
  ['metadata changes outside move', d => { d.source.content[0].sentences[0].reviewed = false; }, /unrelated source edit/],
]) {
  test(`source reordering cannot bypass ${label}`, t => {
    const f = reorderedFixture(t), docs = structuredClone(f.docs);
    const before = Object.fromEntries(Object.entries(f.files).map(([role, file]) => [role, hashFile(file)]));
    mutate(docs);
    assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }), pattern);
    assert.equal(f.calls(), 0);
    for (const [role, file] of Object.entries(f.files)) assert.equal(hashFile(file), before[role]);
  });
}

test('source reordering cannot be implicit, detached from its approval, or changed after sealing', t => {
  const f = reorderedFixture(t), docs = structuredClone(f.docs);
  delete docs.materialization.sourceReordering;
  assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }), /source reordering hash/);
  for (const report of [docs.identity.reviewContext, docs.dateReport.reviewContext, docs.validation, docs.seal]) delete report.sourceReorderingHash;
  assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }), /review without a contract/);
  delete docs.identity.sourceReorderingReview;
  assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }), /locator is stale|unrelated source edit/);
  const materialization = read(f.inputPaths.materialization);
  materialization.sourceReordering.moves[0].toBlockIndex = 2;
  writeJsonAtomic(f.inputPaths.materialization, materialization);
  assert.throws(() => prepareCombinedCuration(f.spec), /protected input|seal must pin/);
  assert.equal(f.calls(), 0);
});

function dependencyRefresh(f, { originalEdit = () => {}, addendumEdit = () => {} } = {}) {
  const docs = structuredClone(f.docs), original = structuredClone(docs.validation);
  originalEdit(original);
  const directory = path.join(f.root, 'dependency-review');
  const oldValidationFile = path.join(directory, 'original/validation.json');
  const oldSealFile = path.join(directory, 'original/input-seal.json');
  writeJsonAtomic(oldValidationFile, original); writeJsonAtomic(oldSealFile, docs.seal);
  const oldDependencyHash = hashFile(f.protectedFile);
  writeJsonAtomic(f.protectedFile, { independentlyReviewedDependencyChange: true });
  const delta = { file: f.protectedFile, beforeHash: oldDependencyHash, afterHash: hashFile(f.protectedFile) };
  const addendum = { status: 'approved-dependency-delta-prior-conclusions-retained', findings: [],
    reviewerId: docs.identity.reviewer.agentId, originalFullReviewAt: docs.identity.reviewedAt,
    sourceHash: docs.identity.sourceHash, extractionHash: docs.identity.extractionHash,
    identityReviewHash: documentHash(docs.identity), dateReportHash: documentHash(docs.dateReport),
    dependency: delta, originalArchives: [pinFile(oldSealFile), pinFile(oldValidationFile)],
    candidateByteHash: docs.identity.reviewContext.candidateByteHash, sourceByteHash: docs.identity.reviewContext.sourceByteHash,
    retainedReports: [pinFile(f.inputPaths.dateReport), pinFile(f.inputPaths.identity)] };
  addendumEdit(addendum);
  const addendumFile = path.join(directory, 'addendum.json');
  writeJsonAtomic(addendumFile, addendum);
  Object.assign(docs.validation, { validationKind: 'dependency-delta-revalidation-not-a-new-chapter-review',
    completeIdentityEvidenceCoverage: 'retained-unchanged-approved-report',
    originalFullReviewAt: docs.identity.reviewedAt, originalValidation: pinFile(oldValidationFile),
    dependencyChangeAddendum: pinFile(addendumFile), authorizedDependencyChange: delta,
    priorFullReviewChecks: { file: oldValidationFile, sha256: hashFile(oldValidationFile), unchangedSourceAndReports: true } });
  Object.assign(docs.seal, { reviewKind: 'retained-full-review-with-new-independent-dependency-review',
    originalFullReviewAt: docs.identity.reviewedAt, priorSeal: pinFile(oldSealFile),
    dependencyChangeAddendum: pinFile(addendumFile),
    protectedFiles: [...docs.seal.protectedFiles.map(p => p.file === f.protectedFile ? pinFile(p.file) : p),
      pinFile(oldSealFile), pinFile(oldValidationFile), pinFile(addendumFile), ...addendum.retainedReports] });
  writeJsonAtomic(f.inputPaths.seal, docs.seal); writeJsonAtomic(f.inputPaths.validation, docs.validation);
  return docs;
}

test('dependency-only refresh retains a pinned true full approval and preserves its evidence in the receipt', t => {
  const f = fixture(t);
  const docs = dependencyRefresh(f);
  const { receipt, hash } = prepareCombinedCuration(f.spec);
  assert.equal(verifyCombinedCuration(receipt, hash, { root: f.root }).status, 'verified');
  assert.equal(unpack(receipt.inputs.validation.content).completeIdentityEvidenceCoverage, 'retained-unchanged-approved-report');
  const prior = receipt.protectedInputs.find(e => e.file === docs.validation.originalValidation.file);
  assert.equal(unpack(prior.content).completeIdentityEvidenceCoverage, true);
  assert.equal(unpack(prior.content).identityReviewHash, documentHash(docs.identity));
  publishCombinedCuration(receipt, hash, f.options);
  assert.equal(f.ledger.dateAudits[f.key].status, 'ready');
});

for (const [label, edits, expected] of [
  ['false prior coverage', { originalEdit: d => { d.completeIdentityEvidenceCoverage = false; } }, /original complete identity coverage/],
  ['missing prior coverage', { originalEdit: d => { delete d.completeIdentityEvidenceCoverage; } }, /original complete identity coverage/],
  ['changed prior report hash', { originalEdit: d => { d.identityReviewHash = `sha256:${'0'.repeat(64)}`; } }, /retained review identity/],
  ['unapproved addendum', { addendumEdit: d => { d.status = 'needs-revision'; } }, /independent dependency approval/],
  ['invalid retained report set', { addendumEdit: d => { d.retainedReports = []; } }, /retain both exact/],
]) {
  test(`dependency retention rejects fully hash-pinned ${label}`, t => {
    const f = fixture(t);
    dependencyRefresh(f, edits);
    assert.throws(() => prepareCombinedCuration(f.spec), expected);
    assert.equal(f.calls(), 0);
  });
}

test('dependency retention rejects missing prior files and changed bytes without resealing', t => {
  const f = fixture(t), docs = dependencyRefresh(f);
  const prior = docs.validation.originalValidation.file;
  const before = fs.readFileSync(prior);
  fs.appendFileSync(prior, ' ');
  assert.throws(() => prepareCombinedCuration(f.spec), /protected input/);
  fs.writeFileSync(prior, before);
  fs.unlinkSync(prior);
  assert.throws(() => prepareCombinedCuration(f.spec), /ENOENT/);
  assert.equal(f.calls(), 0);
});

test('production validators, offline preparation, complete reviewed transition and idempotence', t => {
  const f = fixture(t);
  assert.equal(f.calls(), 0);
  const old = Object.fromEntries(Object.entries(f.files).map(([k, file]) => [k, fs.readFileSync(file)]));
  assert.equal(verifyCombinedCuration(f.receipt, f.hash, { root: f.root }).status, 'verified');
  for (const [k, file] of Object.entries(f.files)) assert.deepEqual(fs.readFileSync(file), old[k]);
  assert.equal(publishCombinedCuration(f.receipt, f.hash, f.options).status, 'complete');
  for (const [k, file] of Object.entries(f.files)) assert.equal(hashFile(file), f.receipt.inputs[k].content.sha256);
  const state = read(path.join(f.workflow, 'state.json'));
  assert.equal(state.phase, 'complete'); assert.equal(state.reviewReceipt.hash, f.hash);
  assert.deepEqual(state.reviewedGenerationTransition.before, { sourceHash: f.state.sourceHash, extractionHash: f.state.extractionHash });
  assert.equal(f.ledger.dateAudits[f.key].status, 'ready');
  assert.deepEqual(f.ledger.dateAuditHistory[f.key], [f.spec.priorClaim]);
  assert.deepEqual(f.ledger.sentinel, { unrelated: 'unchanged' });
  const retained = read(path.join(f.root, 'data/people/combined-curations', f.spec.book, f.spec.chapter, `${f.hash.slice(7)}.json`));
  assert.deepEqual(unpack(retained.workflow.find(r => r.name === 'state.json').content), f.state);
  assert.deepEqual(read(path.join(f.workflow, 'jobs/failed.json')), { rejected: true, evidence: 'retain all bytes' });
  assert.equal(read(path.join(f.root, 'data/people/date-audit-history', f.spec.book, f.spec.chapter, `${documentHash(unpack(f.receipt.before.dateReport)).slice(7)}.json`)).status, 'research-blocked');
  assert.equal(publishCombinedCuration(f.receipt, f.hash, f.options).status, 'complete');
  assert.equal(f.ledger.dateAuditHistory[f.key].length, 1);
});

test('the review pin binds the incoming component while the receipt pins full before/after history', t => {
  const f = fixture(t);
  const [old, incoming] = editorialReviews(f.docs.editorial);
  assert.equal(f.docs.identity.reviewContext.editorialDecisionHash, documentHash(incoming));
  assert.notEqual(documentHash(incoming), documentHash(f.docs.editorial));
  for (const badHash of [documentHash(old), documentHash(f.docs.editorial), `sha256:${'0'.repeat(64)}`]) {
    const docs = structuredClone(f.docs);
    docs.identity.reviewContext.editorialDecisionHash = badHash;
    docs.dateReport.reviewContext.editorialDecisionHash = badHash;
    assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }), /incoming editorial component/);
  }
  assert.deepEqual(unpack(f.receipt.before.editorial), f.docs.beforeEditorial);
  assert.deepEqual(unpack(f.receipt.inputs.editorial.content), f.docs.editorial);
});

test('separate independently reviewed components bind in order and replay sequential repairs through the durable receipt', t => {
  const f = fixture(t, 'testbook', '001', undefined, undefined, { multiple: true });
  const components = editorialReviews(f.docs.editorial).slice(1);
  const hashes = components.map(documentHash);
  assert.deepEqual(f.docs.identity.reviewContext.editorialDecisionHashes, hashes);
  assert.deepEqual(f.docs.dateReport.reviewContext.editorialDecisionHashes, hashes);
  assert.deepEqual(f.docs.seal.editorialDecisionHashes, hashes);
  assert.equal(verifyCombinedCuration(f.receipt, f.hash, { root: f.root }).status, 'verified');
  assert.deepEqual(unpack(f.receipt.inputs.editorial.content), f.docs.editorial);
  assert.deepEqual(unpack(f.receipt.inputs.seal.content).editorialDecisionHashes, hashes);
  assert.equal(publishCombinedCuration(f.receipt, f.hash, f.options).status, 'complete');
  assert.equal(read(f.files.source).content[0].sentences[0].translations[0].literal, 'Alice Smith had come.');
  assert.equal(publishCombinedCuration(f.receipt, f.hash, f.options).status, 'complete');
});

for (const [label, mutate] of [
  ['missing identity pin', d => { delete d.identity.reviewContext.editorialDecisionHashes; }],
  ['reordered date pins', d => { d.dateReport.reviewContext.editorialDecisionHashes.reverse(); }],
  ['missing seal pin', d => { delete d.seal.editorialDecisionHashes; }],
  ['reordered seal pins', d => { d.seal.editorialDecisionHashes.reverse(); }],
  ['mixed singular and plural pins', d => { d.identity.reviewContext.editorialDecisionHash = d.identity.reviewContext.editorialDecisionHashes[0]; }],
  ['old component dropped', d => { d.editorial.reviews.shift(); }],
  ['old component altered', d => { d.editorial.reviews[0].reviewer.name = 'Changed'; }],
  ['component duplicated', d => { d.editorial.reviews.push(structuredClone(d.editorial.reviews[1])); }],
  ['component omitted', d => { d.editorial.reviews.pop(); }],
  ['one approval rejected', d => { d.editorial.reviews[2].decisions[0].decision = 'reject'; }],
  ['second reviewer is an author', d => { d.editorial.reviews[2].reviewer.agentId = 'curator'; }],
  ['second reviewer unidentified', d => { d.editorial.reviews[2].reviewer.agentId = null; }],
  ['second reviewer blank', d => { d.editorial.reviews[2].reviewer.agentId = '   '; }],
  ['second repair omitted', d => { d.candidate.translationRepairs.pop(); }],
  ['repair duplicated', d => { d.candidate.translationRepairs.push(structuredClone(d.candidate.translationRepairs[1])); }],
  ['repair sequence reversed', d => { d.candidate.translationRepairs.reverse(); }],
]) {
  test(`multi-review rejects ${label}`, t => {
    const f = fixture(t, 'testbook', '001', undefined, undefined, { multiple: true });
    const docs = structuredClone(f.docs);
    mutate(docs);
    assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }));
    assert.equal(f.calls(), 0);
  });
}

test('multi-review rejects two otherwise valid approvals for the same repair even with fresh matching pins', t => {
  const f = fixture(t, 'testbook', '001', undefined, undefined, { multiple: true });
  const docs = structuredClone(f.docs);
  const second = docs.editorial.reviews[2];
  const actualSecondApproval = structuredClone(second);
  docs.editorial.reviews.push(actualSecondApproval);
  second.proposals[0].before = 'Alice Smith come.';
  second.proposals[0].after = 'Alice Smith came.';
  second.proposals[0].confidence = 'medium';
  second.input.proposalsFingerprint = proposalSetFingerprint(second.proposals);
  const hashes = editorialReviews(docs.editorial).slice(1).map(documentHash);
  docs.identity.reviewContext.editorialDecisionHashes = hashes;
  docs.dateReport.reviewContext.editorialDecisionHashes = hashes;
  docs.seal.editorialDecisionHashes = hashes;
  assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }), /exactly one unused approval/);
});

test('multi-review rejects reversed review history even when all ordered pins match', t => {
  const f = fixture(t, 'testbook', '001', undefined, undefined, { multiple: true });
  const docs = structuredClone(f.docs);
  [docs.editorial.reviews[1], docs.editorial.reviews[2]] = [docs.editorial.reviews[2], docs.editorial.reviews[1]];
  const hashes = editorialReviews(docs.editorial).slice(1).map(documentHash);
  docs.identity.reviewContext.editorialDecisionHashes = hashes;
  docs.dateReport.reviewContext.editorialDecisionHashes = hashes;
  docs.seal.editorialDecisionHashes = hashes;
  assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }), /repair order contradicts/);
});

for (const role of ['identity', 'dateReport', 'seal', 'nestedWorker']) {
  for (const field of ['agentId', 'name']) {
    test(`combined review rejects whitespace-only ${field} in ${role}`, t => {
      const f = fixture(t);
      const docs = structuredClone(f.docs);
      // Break the fixture's intentional shared reviewer object so the test
      // exercises each role independently rather than mutating all of them.
      for (const key of ['identity', 'dateReport', 'seal']) docs[key].reviewer = structuredClone(docs[key].reviewer);
      if (role === 'nestedWorker') {
        docs.dateReport.reviewer.workers = [{ ...structuredClone(docs.dateReport.reviewer), name: 'Nested reviewer', agentId: 'nested-reviewer', actualAgentId: 'nested-reviewer' }];
        docs.dateReport.reviewer.workers[0][field] = '   ';
      } else {
        docs[role].reviewer[field] = '   ';
      }
      assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }), /Unidentified or self-approved combined curation reviewer/);
      assert.equal(f.calls(), 0);
    });
  }
}

for (const role of ['identity', 'dateReport', 'seal', 'nestedWorker']) {
  test(`combined review rejects padded author ID in ${role}`, t => {
    const f = fixture(t), docs = structuredClone(f.docs);
    for (const key of ['identity', 'dateReport', 'seal']) docs[key].reviewer = structuredClone(docs[key].reviewer);
    if (role === 'nestedWorker') {
      docs.dateReport.reviewer.workers = [{ ...structuredClone(docs.dateReport.reviewer), agentId: ' extractor ', actualAgentId: ' extractor ' }];
    } else {
      docs[role].reviewer.agentId = ' extractor ';
      docs[role].reviewer.actualAgentId = ' extractor ';
    }
    assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }), /Unidentified or self-approved combined curation reviewer/);
  });
}

test('combined review rejects padded editorial author ID even with matching review pins', t => {
  const f = fixture(t), docs = structuredClone(f.docs);
  docs.editorial.reviews[1].reviewer.agentId = ' extractor ';
  const hash = documentHash(editorialReviews(docs.editorial)[1]);
  docs.identity.reviewContext.editorialDecisionHash = hash;
  docs.dateReport.reviewContext.editorialDecisionHash = hash;
  assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }), /Self-approved or unidentified editorial amendment/);
});

test('combined review rejects padded declared and chunk-extraction author IDs', t => {
  const f = fixture(t), docs = structuredClone(f.docs);
  docs.authorAgentIds = [' extractor ', 'curator'];
  assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }), /canonical form/);
  assert.throws(() => fixture(t, 'testbook', '001', chunkRun(' chunk-author '), ['extractor', 'curator', 'chunk-author']), /Noncanonical extraction author agent ID/);
});

test('one incoming editorial component must cover every new repair, not a second unpinned component', t => {
  const f = fixture(t), docs = structuredClone(f.docs);
  docs.editorial.reviews.push(structuredClone(docs.editorial.reviews[0]));
  // Even structurally invalid duplicates are refused by production validation.
  assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }));
  const missing = structuredClone(f.docs);
  missing.editorial.reviews[1].decisions[0].decision = 'reject';
  for (const report of [missing.identity, missing.dateReport]) report.reviewContext.editorialDecisionHash = documentHash(editorialReviews(missing.editorial)[1]);
  assert.throws(() => validateCombinedReviews(missing, { dataDir: path.join(f.root, 'data') }), /rejected|approval/);
});

test('schema-valid null top-level agent plus reviewer-authored extraction chunk cannot prepare', t => {
  assert.throws(() => fixture(t, 'testbook', '001', chunkRun('reviewer')), /self-approved/);
});

test('independent chunked extraction remains publishable with provenance unchanged', t => {
  const f = fixture(t, 'testbook', '001', chunkRun('chunk-author'), ['extractor', 'curator', 'chunk-author']);
  publishCombinedCuration(f.receipt, f.hash, f.options);
  assert.deepEqual(read(f.files.extraction).run, f.docs.beforeExtraction.run);
});

test('declared author inventory cannot omit an actual extraction chunk author', t => {
  assert.throws(() => fixture(t, 'testbook', '001', chunkRun('chunk-author')), /Missing declared extraction author/);
});

for (const role of ['identity', 'dateReport', 'seal', 'editorial', 'historicalEditorial', 'nestedDateWorker']) {
  test(`actual chunk provenance excludes ${role} approval independently of declared authors`, t => {
    const f = fixture(t, 'testbook', '001', chunkRun('chunk-author'), ['extractor', 'curator', 'chunk-author']);
    const docs = structuredClone(f.docs);
    docs.authorAgentIds = ['extractor', 'curator'];
    if (role === 'editorial' || role === 'historicalEditorial') {
      const index = role === 'editorial' ? 1 : 0;
      docs.editorial.reviews[index].reviewer.agentId = 'chunk-author';
      if (index === 0) docs.beforeEditorial.reviewer.agentId = 'chunk-author';
      for (const report of [docs.identity, docs.dateReport]) report.reviewContext.editorialDecisionHash = documentHash(editorialReviews(docs.editorial)[1]);
    } else if (role === 'nestedDateWorker') {
      docs.dateReport.reviewer = { ...docs.dateReport.reviewer, workers: [{ ...docs.dateReport.reviewer, agentId: 'chunk-author', actualAgentId: 'chunk-author' }] };
    } else docs[role].reviewer = { ...docs[role].reviewer, agentId: 'chunk-author', actualAgentId: 'chunk-author' };
    assert.throws(() => validateCombinedReviews(docs, { dataDir: path.join(f.root, 'data') }), /[Ss]elf-approved/);
    assert.equal(f.calls(), 0);
  });
}

test('ready shared date claim with unfinished local state fails before reservation or canonical writes', t => {
  const f = fixture(t);
  const before = Object.fromEntries(Object.entries(f.files).map(([role, file]) => [role, hashFile(file)]));
  f.spec.priorClaim.status = 'ready';
  f.spec.claimHash = documentHash(f.spec.priorClaim);
  f.ledger.dateAudits[f.key] = structuredClone(f.spec.priorClaim);
  assert.throws(() => prepareCombinedCuration(f.spec), /not ready/);
  const receipt = structuredClone(f.receipt);
  receipt.priorClaim = f.spec.priorClaim; receipt.claimHash = f.spec.claimHash;
  assert.throws(() => publishCombinedCuration(receipt, documentHash(receipt), f.options), /not ready/);
  assert.equal(f.calls(), 0);
  for (const [role, file] of Object.entries(f.files)) assert.equal(hashFile(file), before[role]);
});

for (const status of ['active', 'research-blocked']) {
  test(`production extraction reservation remains blocked at every unfinished ${status} publication boundary`, t => {
    const f = fixture(t);
    f.spec.priorClaim.status = status; f.spec.claimHash = documentHash(f.spec.priorClaim);
    f.ledger.dateAudits[f.key] = structuredClone(f.spec.priorClaim);
    const { receipt, hash } = prepareCombinedCuration(f.spec), seen = [];
    publishCombinedCuration(receipt, hash, { ...f.options, checkpoint: boundary => {
      if (boundary === 'queue') return;
      const result = reservePeopleTargetsInLedger(f.ledger, [{ book: f.spec.book, chapter: f.spec.chapter }], { lane: 'grokbot', worker: 'competing-extractor', limit: 1, sticky: true });
      assert.equal(result.claimed.length, 0);
      assert.match(result.blocked[0].reason, /date work owns/);
      assert.equal(f.ledger.dateAudits[f.key].status, status);
      assert.equal(f.ledger.dateAudits[f.key].extractionHash, f.spec.priorClaim.extractionHash);
      assert.deepEqual(f.ledger.dateAudits[f.key].jobs, f.spec.priorClaim.jobs);
      seen.push(boundary);
    } });
    assert.deepEqual(seen, ['lease', 'receipt', 'history', 'source', 'extraction', 'editorial', 'dateReport', 'state']);
    assert.deepEqual(f.ledger.dateAuditHistory[f.key], [f.spec.priorClaim]);
  });
}

for (const boundary of ['lease', 'receipt', 'history', 'source', 'extraction', 'editorial', 'dateReport', 'state', 'queue']) {
  test(`crash at ${boundary} resumes only the exact receipt and retains the original generation`, t => {
    const f = fixture(t);
    assert.throws(() => publishCombinedCuration(f.receipt, f.hash, { ...f.options, checkpoint: name => {
      if (name === boundary) throw new Error('simulated crash');
    } }), /simulated crash/);
    if (!['state', 'queue'].includes(boundary)) assert.deepEqual(read(path.join(f.workflow, 'state.json')), f.state);
    if (boundary !== 'queue') {
      const claim = f.ledger.dateAudits[f.key];
      assert.equal(claim.status, 'research-blocked');
      assert.equal(claim.sourceHash, f.state.sourceHash);
      assert.equal(claim.extractionHash, f.state.extractionHash);
      assert.deepEqual(claim.jobs, f.spec.priorClaim.jobs);
      const unchanged = structuredClone(f.ledger);
      for (const o of [{ worker: claim.worker }, { worker: 'other', takeover: true }, { worker: claim.worker, release: true, takeover: true }]) {
        assert.throws(() => makeOrdinaryReservation(o, f.key, CompletedDateGenerationHold)(f.ledger), /Combined curation .* pending/);
        assert.deepEqual(f.ledger, unchanged);
      }
    }
    assert.equal(publishCombinedCuration(f.receipt, f.hash, f.options).status, 'complete');
    assert.equal(f.ledger.dateAuditHistory[f.key].length, 1);
  });
}

test('arbitrary after bytes without a durable combined receipt cannot masquerade as date-only recovery', t => {
  const f = fixture(t);
  fs.copyFileSync(f.inputPaths.extraction, f.files.extraction);
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /neither exact before/);
  assert.equal(f.calls(), 0);
});

for (const role of ['source', 'extraction', 'editorial', 'dateReport']) {
  test(`${role} third-state drift before and during recovery fails closed`, t => {
    const f = fixture(t);
    assert.throws(() => publishCombinedCuration(f.receipt, f.hash, { ...f.options, checkpoint: n => { if (n === 'receipt') throw new Error('stop'); } }), /stop/);
    fs.appendFileSync(f.files[role], ' ');
    const calls = f.calls();
    assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /neither exact before/);
    assert.equal(f.calls(), calls);
    assert.notEqual(f.ledger.dateAudits[f.key].status, 'ready');
  });
}

test('all exact-before pins, state/jobs, receipt hash and protected inputs are mandatory', t => {
  const f = fixture(t);
  for (const key of Object.keys(f.spec.before)) {
    const spec = structuredClone(f.spec); spec.before[key] = null;
    assert.throws(() => prepareCombinedCuration(spec), /exact-before/);
  }
  assert.throws(() => verifyCombinedCuration(f.receipt, undefined, { root: f.root }), /external exact receipt hash/);
  const wrong = structuredClone(f.receipt); wrong.priorClaim.status = 'ready';
  assert.throws(() => publishCombinedCuration(wrong, f.hash, f.options), /receipt hash/);
  fs.appendFileSync(f.protectedFile, ' ');
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /protected input drift/);
  assert.equal(f.calls(), 0);
});

for (const target of ['state.json', 'jobs/failed.json', 'new-job.json']) {
  test(`changed/missing/additional local recovery artifact ${target} is protected`, t => {
    const f = fixture(t);
    writeJsonAtomic(path.join(f.workflow, target), { foreign: true });
    assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /state drift|artifacts drift/);
    assert.equal(f.calls(), 0);
  });
}

for (const change of ['owner', 'generation', 'jobs', 'busy', 'foreign', 'extraction']) {
  test(`refuses ${change} shared queue conflict without canonical writes`, t => {
    const f = fixture(t), claim = f.ledger.dateAudits[f.key];
    const before = hashFile(f.files.source);
    if (change === 'owner') claim.worker = 'other';
    if (change === 'generation') claim.sourceHash = `sha256:${'0'.repeat(64)}`;
    if (change === 'jobs') claim.jobs.extra = { agentId: 'other' };
    if (change === 'busy') Object.assign(claim, { executorToken: 'live', executorExpiresAt: new Date(Date.now() + 3600000).toISOString() });
    if (change === 'foreign') claim.executorHost = 'another-host';
    if (change === 'extraction') f.ledger.claims[f.key] = { lane: 'grokbot', worker: 'other', status: 'extracting', sticky: true, updatedAt: '2026-09-14T00:00:00Z' };
    assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /queue claim|executor|extraction/);
    assert.equal(hashFile(f.files.source), before);
    assert.deepEqual(read(path.join(f.workflow, 'state.json')), f.state);
  });
}

for (const [description, content] of [
  ['live', JSON.stringify({ pid: process.pid, token: 'live' })],
  ['stale', JSON.stringify({ pid: 99999999, token: 'stale' })],
  ['unreadable', 'not json'],
]) {
  test(`combined publisher preserves ${description} existing global lock`, t => {
    const f = fixture(t), lock = path.join(f.root, 'data/people/generated/date-workflow-run.lock');
    fs.mkdirSync(path.dirname(lock), { recursive: true });
    fs.writeFileSync(lock, content);
    const before = Object.fromEntries(Object.entries(f.files).map(([role, file]) => [role, fs.readFileSync(file)]));
    const ledger = structuredClone(f.ledger);
    const state = fs.readFileSync(path.join(f.workflow, 'state.json'));
    assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /run lock already exists/);
    assert.equal(fs.readFileSync(lock, 'utf8'), content);
    for (const [role, bytes] of Object.entries(before)) assert.deepEqual(fs.readFileSync(f.files[role]), bytes);
    assert.deepEqual(fs.readFileSync(path.join(f.workflow, 'state.json')), state);
    assert.deepEqual(f.ledger, ledger);
    assert.equal(f.calls(), 0);
  });
}

test('lease theft after one canonical write prevents further writes or completion', t => {
  const f = fixture(t);
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, { ...f.options, checkpoint: n => {
    if (n === 'source') f.ledger.dateAudits[f.key].executorToken = 'foreign';
  } }), /Lost combined publication executor lease/);
  assert.equal(hashFile(f.files.extraction), f.receipt.before.extraction.sha256);
  assert.equal(read(path.join(f.workflow, 'state.json')).phase, 'repair');
  assert.equal(f.ledger.dateAudits[f.key].executorToken, 'foreign');
});

test('hard process crash retains the durable receipt and lease; recovery waits for expiry', t => {
  const f = fixture(t), receiptFile = path.join(f.root, 'input-receipt.json'), ledgerFile = path.join(f.root, 'mock-ledger.json');
  writeJsonAtomic(receiptFile, f.receipt); writeJsonAtomic(ledgerFile, f.ledger);
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import fs from 'node:fs';
    import { publishCombinedCuration } from ${JSON.stringify(new URL('./lib/people-combined-curation.mjs', import.meta.url).href)};
    import { writeJsonAtomic } from ${JSON.stringify(new URL('./lib/people-content.mjs', import.meta.url).href)};
    const ledgerFile = ${JSON.stringify(ledgerFile)};
    const receipt = JSON.parse(fs.readFileSync(${JSON.stringify(receiptFile)}, 'utf8'));
    publishCombinedCuration(receipt, ${JSON.stringify(f.hash)}, {
      root: ${JSON.stringify(f.root)},
      mutateLedger: fn => {
        const ledger = JSON.parse(fs.readFileSync(ledgerFile, 'utf8'));
        const result = fn(ledger); writeJsonAtomic(ledgerFile, ledger); return {result};
      },
      checkpoint: name => { if (name === 'extraction') process.exit(86); }
    });
  `], { encoding: 'utf8', timeout: 15000 });
  assert.equal(child.status, 86, child.stderr);
  Object.assign(f.ledger, read(ledgerFile));
  assert.ok(f.ledger.dateAudits[f.key].executorToken);
  const lock = path.join(f.root, 'data/people/generated/date-workflow-run.lock');
  const retainedLock = fs.readFileSync(lock);
  const durableReceipt = path.join(f.root, 'data/people/combined-curations', f.spec.book, f.spec.chapter, `${f.hash.slice(7)}.json`);
  const retainedReceipt = fs.readFileSync(durableReceipt);
  const retainedState = fs.readFileSync(path.join(f.workflow, 'state.json'));
  const retainedFiles = Object.fromEntries(Object.entries(f.files).map(([role, file]) => [role, fs.readFileSync(file)]));
  const retainedLedger = structuredClone(f.ledger);
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /run lock already exists/);
  assert.deepEqual(fs.readFileSync(lock), retainedLock);
  assert.deepEqual(fs.readFileSync(durableReceipt), retainedReceipt);
  assert.deepEqual(fs.readFileSync(path.join(f.workflow, 'state.json')), retainedState);
  for (const [role, bytes] of Object.entries(retainedFiles)) assert.deepEqual(fs.readFileSync(f.files[role]), bytes);
  assert.deepEqual(f.ledger, retainedLedger);
  assert.equal(f.calls(), 0);
  // Test-only, isolated fixture simulation of separately authorized host recovery.
  fs.unlinkSync(lock);
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /Concurrent date executor/);
  f.ledger.dateAudits[f.key].executorExpiresAt = new Date(0).toISOString();
  publishCombinedCuration(f.receipt, f.hash, f.options);
  assert.equal(f.ledger.dateAudits[f.key].status, 'ready');
  assert.deepEqual(f.ledger.dateAuditHistory[f.key], [f.spec.priorClaim]);
});

test('optimistic ledger callback retries cannot duplicate history or transition old hashes early', t => {
  const f = fixture(t);
  const retrying = fn => f.options.mutateLedger(ledger => {
    fn(structuredClone(ledger));
    return fn(ledger);
  });
  publishCombinedCuration(f.receipt, f.hash, { ...f.options, mutateLedger: retrying });
  assert.deepEqual(f.ledger.dateAuditHistory[f.key], [f.spec.priorClaim]);
});

test('protected input change between writes interrupts publication before completion', t => {
  const f = fixture(t);
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, { ...f.options, checkpoint: n => {
    if (n === 'source') fs.appendFileSync(f.protectedFile, ' ');
  } }), /protected input drift/);
  assert.equal(hashFile(f.files.extraction), f.receipt.before.extraction.sha256);
  assert.equal(f.ledger.dateAudits[f.key].status, 'research-blocked');
});

test('durable receipt tampering between writes prevents completion and further canonical writes', t => {
  const f = fixture(t);
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, { ...f.options, checkpoint: n => {
    if (n === 'source') writeJsonAtomic(path.join(f.root, 'data/people/combined-curations', f.spec.book, f.spec.chapter, `${f.hash.slice(7)}.json`), { forged: true });
  } }), /durable content receipt/);
  assert.equal(hashFile(f.files.extraction), f.receipt.before.extraction.sha256);
  assert.equal(f.ledger.dateAudits[f.key].status, 'research-blocked');
});

test('old queue repair authors are excluded even when absent from local job state', t => {
  const f = fixture(t);
  f.spec.priorClaim.jobs['repair-1-remote'] = { agentId: 'reviewer' };
  f.spec.claimHash = documentHash(f.spec.priorClaim);
  assert.throws(() => prepareCombinedCuration(f.spec), /self-approved/);
});

test('mismatched durable receipt, pending queue receipt and missing history refuse recovery', t => {
  const f = fixture(t);
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, { ...f.options, checkpoint: n => { if (n === 'receipt') throw new Error('stop'); } }), /stop/);
  const receiptFile = path.join(f.root, 'data/people/combined-curations', f.spec.book, f.spec.chapter, `${f.hash.slice(7)}.json`);
  writeJsonAtomic(receiptFile, { fake: true });
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /durable receipt/);
  writeJsonAtomic(receiptFile, f.receipt);
  f.ledger.dateAudits[f.key].combinedCuration.receiptHash = 'wrong';
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /pending queue receipt/);
  f.ledger.dateAudits[f.key].combinedCuration.receiptHash = f.hash;
  publishCombinedCuration(f.receipt, f.hash, f.options);
  f.ledger.dateAuditHistory[f.key] = [];
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /lost original claim history/);
});

test('source or destination symlinks cannot redirect chapter writes into protected files', t => {
  const f = fixture(t);
  fs.unlinkSync(f.files.source); fs.symlinkSync(f.protectedFile, f.files.source);
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /Symlink publication destination/);
  assert.deepEqual(read(f.protectedFile), { unchanged: true });
});

const negativeReviews = {
  'unapproved identity': d => { d.identity.status = 'needs-revision'; },
  'identity findings': d => { d.identity.findings.push({ problem: reason }); },
  'missing source coverage': d => { d.identity.unitChecks.pop(); },
  'missing people coverage': d => { d.identity.personChecks.pop(); },
  'missing name coverage': d => { d.identity.nameClaimChecks.pop(); },
  'missing mention coverage': d => { d.identity.mentionChecks.pop(); },
  'missing scanner coverage': d => { d.identity.candidateChecks.pop(); },
  'wrong mention owner': d => { d.identity.mentionChecks[0].personId = 'p002'; },
  'wrong name content': d => { d.identity.nameClaimChecks[0].claim[0].en = 'other'; },
  'wrong source quotation': d => { d.identity.unitChecks[0].evidence[0].quote = 'not in source'; },
  'unread callbacks': d => { d.identity.coverage.unscannedCallbacksChecked = false; },
  'unapproved date': d => { d.dateReport.status = 'research-blocked'; },
  'missing date item': d => { d.dateReport.itemChecks.pop(); },
  'missing date person': d => { d.dateReport.personChecks.pop(); },
  'missing date unit': d => { d.dateReport.reviewedUnits.pop(); },
  'self-approved identity': d => { d.identity.reviewer.agentId = 'curator'; },
  'self-approved date': d => { d.dateReport.reviewer.agentId = 'extractor'; },
  'no author attestation': d => { d.identity.reviewer.independentOfRepairAuthor = false; },
  'missing author identity': d => { d.authorAgentIds = ['extractor']; },
  'self-approved editorial': d => { d.editorial.reviews[1].reviewer.agentId = 'curator'; },
  'missing editorial approval': d => { d.editorial.reviews.pop(); },
  'old editorial lost': d => { d.editorial.reviews.shift(); },
  'proposed repairs': d => { d.candidate.translationRepairs[0][6] = 'proposed'; },
  'unrelated source metadata': d => { d.source.meta.unrelated = 'change'; },
  'unrelated extraction scope': d => { d.candidate.book = 'other'; },
  'stale validation stats': d => { d.validation.productionExtractionStats.mentions++; },
  'unapproved validation summary': d => { d.validation.status = 'rejected'; },
  'retained coverage without an approved provenance chain': d => {
    d.validation.completeIdentityEvidenceCoverage = 'retained-unchanged-approved-report';
    d.validation.validationKind = 'dependency-delta-revalidation-not-a-new-chapter-review';
  },
  'stale report reference': d => { d.identity.references = [{ book: 'testbook', chapter: '002', unit: 's0001', quote: 'x', sourceHash: `sha256:${'0'.repeat(64)}`, reason }]; },
};
for (const [label, mutate] of Object.entries(negativeReviews)) {
  test(`full production review gates reject ${label}`, t => {
    const f = fixture(t), d = structuredClone(f.docs);
    mutate(d);
    assert.throws(() => validateCombinedReviews(d, { dataDir: path.join(f.root, 'data') }));
    assert.equal(f.calls(), 0);
  });
}

test('same fixed paths and generation semantics support Hanshu003 without Shiji special cases', t => {
  const f = fixture(t, 'hanshu', '003');
  publishCombinedCuration(f.receipt, f.hash, f.options);
  assert.equal(f.ledger.dateAudits['hanshu/003'].status, 'ready');
});

// Explicit opt-in local integration test. No canonical, packet or queue writes;
// this also exercises the real family, disposition and collective coverage.
if (process.env.PEOPLE_COMBINED_SHIJI_REVIEW) {
  test('exact supplied Shiji064 package passes full reports and rejects removed real coverage', () => {
    const dir = process.env.PEOPLE_COMBINED_SHIJI_REVIEW;
    const materialized = path.join(dir, 'editorial-amendment/materialized');
    const review = path.join(dir, 'independent-review');
    const root = path.resolve(new URL('..', import.meta.url).pathname);
    const identity = read(path.join(review, 'identity-review.json'));
    const docs = { book: 'shiji', chapter: '064', source: read(path.join(materialized, 'data/shiji/064.json')),
      candidate: read(path.join(materialized, 'candidate.json')), editorial: read(path.join(materialized, 'editorial-decisions.json')),
      identity, dateReport: read(path.join(review, 'date-report.json')), validation: read(path.join(review, 'validation.json')),
      materialization: read(path.join(materialized, 'validation.json')), seal: read(path.join(review, 'input-seal.json')),
      beforeSource: read(path.join(root, 'data/shiji/064.json')), beforeExtraction: read(path.join(root, 'data/people/extractions/shiji/064.json')),
      beforeEditorial: read(path.join(root, 'data/people/editorial-decisions/shiji/064.json')), authorAgentIds: identity.reviewer.excludedAuthorAgentIds };
    const options = { dataDir: path.join(root, 'data') };
    const result = validateCombinedReviews(docs, options);
    assert.equal(result.packet.sourceHash, 'sha256:3c75e71111a9d008848b3687ada91b6618b256fc0e836bab2b0adc0255b327a2');
    assert.equal(result.packet.extractionHash, 'sha256:b5280701ed91ffd06d5a60ca1cd5a9bfc63d8480c54982a639288713fd5cf1ec');
    assert.equal(result.stats.mentions, 106);
    for (const field of ['familyRelationshipChecks', 'candidateChecks', 'collectiveOccurrenceChecks', 'nameClaimChecks']) {
      const changed = structuredClone(docs);
      assert.ok(changed.identity[field].length);
      changed.identity[field].pop();
      assert.throws(() => validateCombinedReviews(changed, options), /coverage|count/);
    }
    if (docs.validation.validationKind) {
      for (const mutate of [
        d => { delete d.validation.dependencyChangeAddendum; },
        d => { d.validation.originalValidation.sha256 = `sha256:${'0'.repeat(64)}`; },
        d => { d.validation.priorFullReviewChecks.unchangedSourceAndReports = false; },
        d => { d.validation.priorFullReviewChecks.sha256 = `sha256:${'0'.repeat(64)}`; },
        d => { d.validation.originalFullReviewAt = '2020-01-01T00:00:00Z'; },
        d => { d.validation.authorizedDependencyChange.afterHash = `sha256:${'0'.repeat(64)}`; },
        d => { d.seal.protectedFiles = d.seal.protectedFiles.filter(p => p.file !== d.validation.originalValidation.file); },
      ]) {
        const changed = structuredClone(docs); mutate(changed);
        assert.throws(() => validateCombinedReviews(changed, options), /dependency|retained|timestamp|full review/);
      }
    }
  });
}

if (process.env.PEOPLE_COMBINED_PREPARE_SPEC) {
  test('actual Shiji spec prepares the exact incoming-review package read-only, retaining all signed evidence', () => {
    const spec = read(process.env.PEOPLE_COMBINED_PREPARE_SPEC);
    assert.equal(spec.book, 'shiji'); assert.equal(spec.chapter, '064');
    const seal = read(path.join(spec.reviewDir, 'input-seal.json'));
    const files = [...seal.protectedFiles.map(p => p.file),
      path.join(spec.reviewDir, 'input-seal.json'), path.join(spec.reviewDir, 'identity-review.json'),
      path.join(spec.reviewDir, 'date-report.json'), path.join(spec.reviewDir, 'validation.json')];
    const before = files.map(pinFile);
    const canonicalBefore = inspectCombinedBefore(spec);
    const { receipt, hash } = prepareCombinedCuration(spec);
    assert.equal(verifyCombinedCuration(receipt, hash).status, 'verified');
    const history = unpack(receipt.inputs.editorial.content);
    const incoming = editorialReviews(history).filter(r => !editorialReviews(unpack(receipt.before.editorial)).some(old => documentHash(old) === documentHash(r)));
    assert.equal(incoming.length, 1);
    assert.equal(documentHash(incoming[0]), 'sha256:3a9036e7fdb5e1fddb1117cdd20180b2f6f0aa191c34103eac77006b33e05085');
    assert.equal(unpack(receipt.inputs.identity.content).reviewContext.editorialDecisionHash, documentHash(incoming[0]));
    assert.equal(receipt.protectedInputs.length, seal.protectedFiles.length);
    assert.deepEqual(inspectCombinedBefore(spec), canonicalBefore);
    assert.deepEqual(files.map(pinFile), before);
    assert.deepEqual(receipt.beforePins, spec.before);
    assert.deepEqual(receipt.priorClaim, spec.priorClaim);
  });
}

const initialFixture = t => fixture(t, 'testbook', '001', undefined, undefined, { initial: true });

test('absent initial workflow remains absent until reviewed publication and preserves stale generations', t => {
  const f = initialFixture(t);
  const stale = `${f.workflow}.stale-old/state.json`;
  const held = { phase: 'repair', circuitBreaker: { reason: 'preserve old hold' }, jobs: { old: { agentId: 'original' } } };
  writeJsonAtomic(stale, held);
  const staleHash = hashFile(stale);
  assert.equal(fs.existsSync(f.workflow), false);
  assert.equal(f.receipt.beforePins.stateByteHash, null);
  assert.deepEqual(f.receipt.workflow, []);
  assert.equal(verifyCombinedCuration(f.receipt, f.hash, { root: f.root }).status, 'verified');
  assert.equal(fs.existsSync(f.workflow), false);
  assert.equal(publishCombinedCuration(f.receipt, f.hash, f.options).status, 'complete');
  const state = read(path.join(f.workflow, 'state.json'));
  assert.equal(state.phase, 'complete');
  assert.equal(state.reviewReceipt.hash, f.hash);
  assert.deepEqual(state.reviewedGenerationTransition.before, { sourceHash: f.spec.priorClaim.sourceHash, extractionHash: f.spec.priorClaim.extractionHash });
  assert.deepEqual(f.ledger.dateAuditHistory[f.key], [f.spec.priorClaim]);
  assert.equal(hashFile(stale), staleHash);
  const after = hashFile(path.join(f.workflow, 'state.json'));
  assert.equal(publishCombinedCuration(f.receipt, f.hash, f.options).status, 'complete');
  assert.equal(hashFile(path.join(f.workflow, 'state.json')), after);
  assert.equal(hashFile(stale), staleHash);
});

for (const boundary of ['lease', 'receipt', 'history', 'source', 'extraction', 'editorial', 'dateReport', 'state', 'queue']) {
  test(`absent initial workflow crash recovery after ${boundary}`, t => {
    const f = initialFixture(t);
    assert.throws(() => publishCombinedCuration(f.receipt, f.hash, { ...f.options, checkpoint: stage => { if (stage === boundary) throw Error('interrupt'); } }), /interrupt/);
    if (!['state', 'queue'].includes(boundary)) assert.equal(fs.existsSync(path.join(f.workflow, 'state.json')), false);
    assert.equal(publishCombinedCuration(f.receipt, f.hash, f.options).status, 'complete');
    assert.equal(read(path.join(f.workflow, 'state.json')).phase, 'complete');
    assert.deepEqual(f.ledger.dateAuditHistory[f.key], [f.spec.priorClaim]);
  });
}

for (const [label, mutate] of [
  ['retained remote job', f => { f.spec.priorClaim.jobs.old = { agentId: 'reviewer' }; }],
  ['retained review plan', f => { f.spec.priorClaim.reviewPlans = { audit: { maxUnits: 1, maxBytes: 1024, jobIds: ['old'] } }; }],
  ['research hold', f => { f.spec.priorClaim.status = 'research-blocked'; }],
  ['remote breaker', f => { f.spec.priorClaim.circuitBreaker = { held: true }; }],
  ['unknown recovery metadata', f => { f.spec.priorClaim.recovery = 'not disposable'; }],
  ['retained local artifact', f => { writeJsonAtomic(path.join(f.workflow, 'old-review.json'), { held: true }); }],
  ['installed date report', f => { writeJsonAtomic(f.files.dateReport, f.docs.dateReport); }],
]) {
  test(`missing initial state rejects ${label} even with fresh mechanical pins`, t => {
    const f = initialFixture(t);
    mutate(f);
    f.spec.claimHash = documentHash(f.spec.priorClaim);
    f.spec.before = inspectCombinedBefore({ root: f.root, book: f.spec.book, chapter: f.spec.chapter });
    assert.throws(() => prepareCombinedCuration(f.spec), /untouched initial date reservation/);
    assert.equal(f.calls(), 0);
  });
}

test('missing initial state rejects canonical state appearing after seal and deleted retained state', t => {
  const f = initialFixture(t);
  writeJsonAtomic(path.join(f.workflow, 'state.json'), f.state);
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /state drift/);
  assert.equal(f.calls(), 0);
  const retained = fixture(t);
  fs.unlinkSync(path.join(retained.workflow, 'state.json'));
  assert.throws(() => prepareCombinedCuration(retained.spec), /exact-before/);
  retained.spec.before = inspectCombinedBefore({ root: retained.root, book: retained.spec.book, chapter: retained.spec.chapter });
  assert.throws(() => prepareCombinedCuration(retained.spec), /untouched initial date reservation/);
});

test('existing workflow breaker and jobs remain immutable receipt history', t => {
  const f = fixture(t);
  f.state.circuitBreaker = { reason: 'reviewed resolution required', round: 3 };
  writeJsonAtomic(path.join(f.workflow, 'state.json'), f.state);
  f.spec.before = inspectCombinedBefore({ root: f.root, book: f.spec.book, chapter: f.spec.chapter });
  const prepared = prepareCombinedCuration(f.spec);
  assert.equal(publishCombinedCuration(prepared.receipt, prepared.hash, f.options).status, 'complete');
  const receiptFile = path.join(f.root, 'data/people/combined-curations/testbook/001', `${prepared.hash.slice(7)}.json`);
  const archived = unpack(read(receiptFile).workflow.find(row => row.name === 'state.json').content);
  assert.deepEqual(archived, f.state);
  assert.deepEqual(read(path.join(f.workflow, 'jobs/failed.json')), { rejected: true, evidence: 'retain all bytes' });
});

test('absent workflow still rejects source drift and changed shared ownership', t => {
  const f = initialFixture(t);
  f.ledger.dateAudits[f.key].worker = 'foreign-worker';
  assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /exact-before shared queue claim/);
  assert.equal(fs.existsSync(f.workflow), false);
  const other = initialFixture(t);
  fs.appendFileSync(other.files.source, ' ');
  assert.throws(() => publishCombinedCuration(other.receipt, other.hash, other.options), /Canonical source/);
  assert.equal(other.calls(), 0);
});

{
const native=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const save=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+"\n");};
function bindingFixture(t){
 const f=fixture(t),dir=path.join(f.root,'chapter-job');fs.mkdirSync(dir);
 const names={source:'source',extraction:'extraction',editorial:'editorial',materialization:'materialization',identity:'identity-review',dateReport:'date-report',validation:'review-validation',seal:'input-seal'};
 const files={};for(const[role,name]of Object.entries(names)){files[role]=path.join(dir,name+'.json');fs.copyFileSync(f.inputPaths[role],files[role]);}
 const identity=read(files.identity),dateReport=read(files.dateReport),validation=read(files.validation),seal=read(files.seal);
 for(const r of[identity,dateReport]){delete r.reviewContext.sourcePath;delete r.reviewContext.candidatePath;}
 validation.identityReviewHash=documentHash(identity);validation.dateReportHash=documentHash(dateReport);
 for(const[role,doc]of Object.entries({identity,dateReport,validation}))save(files[role],doc);
 const hashBytes=async file=>{const{createHash}=await import('node:crypto');const b=fs.readFileSync(file);return{file,bytes:b.length,sha256:'sha256:'+createHash('sha256').update(b).digest('hex')};};
 return{f,dir,files,seal,hashBytes};
}

test('metadata binding preserves raw checks and nonstandard source bytes, then passes the native gate',async t=>{
 const{f,dir,files,seal,hashBytes}=bindingFixture(t);
 // A byte-preserving adapter must handle ordinary noncanonical JSON whitespace.
 fs.appendFileSync(files.source,' ');
 const sourcePin=await hashBytes(files.source),materialization=read(files.materialization);
 materialization.sourceByteHash=sourcePin.sha256;save(files.materialization,materialization);
 for(const role of['identity','dateReport']){const r=read(files[role]);r.reviewContext.sourceByteHash=sourcePin.sha256;save(files[role],r);}
 const validation=read(files.validation);validation.identityReviewHash=documentHash(read(files.identity));validation.dateReportHash=documentHash(read(files.dateReport));save(files.validation,validation);
 seal.protectedFiles=await Promise.all(['source','extraction','editorial'].map(role=>hashBytes(files[role])));save(files.seal,seal);
 const raw=Object.fromEntries(Object.entries(files).map(([role,file])=>[role,fs.readFileSync(file)]));
 const job={book:f.spec.book,chapter:f.spec.chapter,nativeRoot:native,reviewAgentId:'reviewer',authors:f.spec.authorAgentIds,beforeNative:f.spec.before};
 const bound=await prepareChapterNativeInputs({root:f.root,dir,job,hostAuthor:'codex:fixture-host'});
 for(const[role,file]of Object.entries(files))assert.deepEqual(fs.readFileSync(file),raw[role]);
 assert.deepEqual(fs.readFileSync(path.join(bound.materializedDir,'data/testbook/001.json')),raw.source);
 const prepared=prepareCombinedCuration({...f.spec,...bound});
 assert.equal(prepared.receipt.inputs.identity.file,path.join(bound.reviewDir,'identity-review.json'));
 const normalized=read(prepared.receipt.inputs.identity.file),original=read(files.identity);
 for(const key of ['unitChecks','personChecks','nameClaimChecks','familyRelationshipChecks','mentionChecks','candidateChecks','collectiveOccurrenceChecks','coverage','reviewer','approved','status','summary','findings'])assert.deepEqual(normalized[key],original[key]);
 assert.equal(read(bound.bindingReceipt).hostAuthor,'codex:fixture-host');
});

for(const[label,mutate]of[
 ['changed report hash',({files})=>{const r=read(files.identity);r.summary+=' changed';save(files.identity,r);}],
 ['foreign reviewer',({files})=>{const r=read(files.identity);r.reviewer.agentId='foreign';save(files.identity,r);}],
 ['absent source protection',({seal})=>{seal.protectedFiles=[];}],
])test('metadata binding rejects '+label,async t=>{
 const x=bindingFixture(t);x.seal.protectedFiles=await Promise.all(['source','extraction','editorial'].map(role=>x.hashBytes(x.files[role])));mutate(x);save(x.files.seal,x.seal);
 await assert.rejects(()=>prepareChapterNativeInputs({root:x.f.root,dir:x.dir,job:{book:x.f.spec.book,chapter:x.f.spec.chapter,nativeRoot:native,reviewAgentId:'reviewer',authors:x.f.spec.authorAgentIds,beforeNative:x.f.spec.before},hostAuthor:'codex:fixture-host'}));
});

function undatedFixture(t){
 const f=fixture(t),d=structuredClone(f.docs);
 d.beforeSource=structuredClone(d.source);d.beforeExtraction=structuredClone(d.candidate);
 d.beforeExtraction.claims[0][2]={sourceDate:{text:'Fixture year'},westernYear:{era:'AD',year:1,precision:'year'}};d.beforeExtraction.claims[0][3]='strongly-inferred';
 const packet=buildPeopleExtractionPacket(d.book,d.chapter,{chapterData:d.source,properNounMatcher:loadProperNounMatcher()});
 const old=validateCompactPeopleExtraction(d.beforeExtraction,packet,{strictAliasDispositions:true}).normalized.claims.find(c=>c.predicate==='attestation');
 const before=structuredClone(old);before.value.westernYear.year=5;
 d.beforeEditorial=structuredClone(d.editorial);d.beforeEditorial.reviews.at(-1).claimRevisions=[{repairId:`${d.book}:${d.chapter}:r0001`,before,after:old,reason:'The independently corrected dated attestation replaces the rejected old date.',sourceWitness:{source:'chapter-text',citation:'s0001',excerpt:'艾麗絲'}}];
 d.candidate.claims[0][2]={undatedSourceAttestation:true,event:'The source names Alice arriving without supplying a Western year.'};d.candidate.claims[0][3]='explicit';d.candidate.people[0][4].a=[];
 const checked=validateCompactPeopleExtraction(d.candidate,packet,{strictAliasDispositions:true}),amendment=deriveDateRepairEditorialAmendment(d.beforeEditorial,checked.normalized);
 d.editorial=applyDateRepairEditorialAmendment(d.beforeEditorial,amendment,checked.normalized);
 const dates=combinedDatePacket(d.book,d.chapter,d.source,d.candidate);
 for(const r of[d.identity,d.dateReport,d.validation,d.materialization,d.seal])Object.assign(r,{sourceHash:dates.sourceHash,extractionHash:dates.extractionHash});
 for(const r of[d.identity,d.dateReport]){delete r.reviewContext.editorialDecisionHash;r.reviewContext.editorialDecisionHashes=[];}
 d.seal.editorialDecisionHashes=[];
 d.materialization.editorialAmendment=amendment;
 for(const r of[d.identity.reviewContext,d.dateReport.reviewContext,d.validation,d.seal])r.editorialAmendmentHash=documentHash(amendment);
 d.dateReport.itemChecks=dates.items.map(i=>({id:i.id,verdict:'supported',reason:'The complete independent fixture review confirms this exact undated source event.',event:'The source supplies no Western date for this event.',evidence:[{unit:'s0001',quote:'艾麗絲'}]}));
 d.identity.coverage.temporalItems=dates.items.length;d.validation.status='approved-exact-combined-candidate';d.validation.productionExtractionStats=checked.stats;d.validation.identityReviewHash=documentHash(d.identity);d.validation.dateReportHash=documentHash(d.dateReport);
 return{f,d,amendment,checked};
}

test('undated chronology amendment composes with full exact independent reviews and preserves old history',t=>{
 const{f,d,amendment}=undatedFixture(t),old=structuredClone(d.beforeEditorial);
 assert.equal(amendment.claimRevisions.length,1);
 assert.equal(validateCombinedReviews(d,{dataDir:path.join(f.root,'data')}).stats.people,1);
 assert.deepEqual(d.beforeEditorial,old);
});

for(const[label,mutate]of[
 ['changed person',a=>{a.claimRevisions[0].after.subject='testbook:001:p999';}],
 ['changed predicate',a=>{a.claimRevisions[0].after.predicate='office';}],
 ['lost evidence',a=>{a.claimRevisions[0].after.evidence=[];}],
 ['invented non-date fact',a=>{a.claimRevisions[0].after.value.office='general';}],
 ['false certainty',a=>{a.claimRevisions[0].after.certainty='uncertain';}],
])test('undated chronology amendment rejects '+label,t=>{
 const{d,amendment,checked}=undatedFixture(t),bad=structuredClone(amendment);mutate(bad);
 assert.throws(()=>applyDateRepairEditorialAmendment(d.beforeEditorial,bad,checked.normalized));
});

test('undated chronology amendment cannot replace an unapproved or incompletely reviewed candidate',t=>{
 const{f,d}=undatedFixture(t);d.dateReport.status='needs-revision';
 assert.throws(()=>validateCombinedReviews(d,{dataDir:path.join(f.root,'data')}));
 d.dateReport.status='audited';delete d.identity.reviewContext.editorialAmendmentHash;
 assert.throws(()=>validateCombinedReviews(d,{dataDir:path.join(f.root,'data')}),/amendment binding/);
});

function mixedChronologyFixture(t){
 const {f,d}=undatedFixture(t),unit=d.source.content[0].sentences[0];
 unit.translations[0].literal='Alice Smith arrived.';
 const packet=buildPeopleExtractionPacket(d.book,d.chapter,{chapterData:d.source,properNounMatcher:loadProperNounMatcher()});
 d.candidate.input=buildCompactInput(packet);
 d.candidate.translationRepairs.push(['s0001','literal','Alice Smith came.','Alice Smith arrived.',reason,'high','applied']);
 const checked=validateCompactPeopleExtraction(d.candidate,packet,{strictAliasDispositions:true});
 const incoming=editorialDecisionSeed({...checked.normalized,translationRepairs:checked.normalized.translationRepairs.slice(-1).map(r=>({...r,status:'proposed'}))});
 incoming.reviewer={kind:'human',name:'Independent editor',model:null,agentId:'reviewer',runId:null,completedAt:'2026-09-14T00:00:00Z'};
 incoming.decisions[0]={repairId:incoming.proposals[0].id,decision:'accept',after:null,reason,sourceWitness:{source:'chapter-text',citation:'s0001',excerpt:'艾麗絲來。'}};
 const baseline=combinedEditorialBaseline(d.beforeEditorial,checked.normalized,d.beforeExtraction.translationRepairs.length,acceptedHistoricalClaims(d.book,d.chapter,d.beforeSource,d.beforeExtraction));
 const record=({schemaVersion,book,chapter,...r})=>r;
 d.editorial={schemaVersion:4,book:d.book,chapter:d.chapter,reviews:[...editorialReviews(baseline.editorial),incoming].map(record)};
 const dates=combinedDatePacket(d.book,d.chapter,d.source,d.candidate);
 for(const r of[d.identity,d.dateReport,d.validation,d.materialization,d.seal])Object.assign(r,{sourceHash:dates.sourceHash,extractionHash:dates.extractionHash});
 const hashes=[documentHash(incoming)];
 for(const r of[d.identity,d.dateReport]){delete r.reviewContext.editorialDecisionHash;r.reviewContext.editorialDecisionHash=hashes[0];delete r.reviewContext.editorialDecisionHashes;}
 delete d.seal.editorialDecisionHashes;d.seal.editorialDecisionHash=hashes[0];
 d.materialization.editorialAmendment=baseline.amendment;
 for(const r of[d.identity.reviewContext,d.dateReport.reviewContext,d.validation,d.seal])r.editorialAmendmentHash=documentHash(baseline.amendment);
 d.identity.unitChecks[0].literalHash=sha256(unit.translations[0].literal);
 d.validation.status='approved-exact-editorial-amended-candidate';d.validation.productionExtractionStats=checked.stats;
 d.validation.identityReviewHash=documentHash(d.identity);d.validation.dateReportHash=documentHash(d.dateReport);
 return{f,d,incoming};
}
test('metadata binding composes chronology history and incoming English without changing raw captured proofs',async t=>{
 const {f,d}=mixedChronologyFixture(t),dir=path.join(f.root,'data/people/generated/chapter-owners/test-001-0123456789ab');fs.mkdirSync(dir,{recursive:true});
 const save=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');
 save(f.files.source,d.beforeSource);save(f.files.extraction,d.beforeExtraction);save(f.files.editorial,d.beforeEditorial);
 const record=({schemaVersion,book,chapter,...r})=>r;
 d.editorial={schemaVersion:4,book:d.book,chapter:d.chapter,reviews:[...editorialReviews(d.beforeEditorial),editorialReviews(d.editorial).at(-1)].map(record)};
 const names={source:'source',candidate:'extraction',editorial:'editorial',materialization:'materialization',identity:'identity-review',dateReport:'date-report',validation:'review-validation',seal:'input-seal'};
 for(const key of ['source','candidate','editorial'])save(path.join(dir,names[key]+'.json'),d[key]);
 const rawPath=key=>path.join(dir,names[key]+'.json');
 const materialization={sourceHash:d.materialization.sourceHash,extractionHash:d.materialization.extractionHash,sourceByteHash:hashFile(rawPath('source')),extractionByteHash:hashFile(rawPath('candidate'))};
 save(rawPath('materialization'),materialization);
 for(const r of [d.identity,d.dateReport]){delete r.reviewContext.editorialAmendmentHash;Object.assign(r.reviewContext,{sourcePath:rawPath('source'),candidatePath:rawPath('candidate'),sourceByteHash:materialization.sourceByteHash,candidateByteHash:materialization.extractionByteHash});}
 delete d.validation.editorialAmendmentHash;delete d.seal.editorialAmendmentHash;
 d.validation.identityReviewHash=documentHash(d.identity);d.validation.dateReportHash=documentHash(d.dateReport);
 d.seal.protectedFiles=['source','candidate','editorial'].map(key=>pinFile(rawPath(key)));
 for(const key of ['identity','dateReport','validation','seal'])save(rawPath(key),d[key]);
 const raw=Object.fromEntries(Object.keys(names).map(key=>[key,fs.readFileSync(rawPath(key))]));
 const job={book:d.book,chapter:d.chapter,nativeRoot:path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),reviewAgentId:'reviewer',authors:d.authorAgentIds,beforeNative:inspectCombinedBefore({root:f.root,book:d.book,chapter:d.chapter})};
 const bound=await prepareChapterNativeInputs({root:f.root,dir,job,hostAuthor:'codex:mixed-fixture'});
 for(const key of Object.keys(names))assert.deepEqual(fs.readFileSync(rawPath(key)),raw[key]);
 const boundDocs={...d,source:read(path.join(bound.materializedDir,'data',d.book,d.chapter+'.json')),candidate:read(path.join(bound.materializedDir,'candidate.json')),editorial:read(path.join(bound.materializedDir,'editorial-decisions.json')),materialization:read(path.join(bound.materializedDir,'validation.json')),identity:read(path.join(bound.reviewDir,'identity-review.json')),dateReport:read(path.join(bound.reviewDir,'date-report.json')),validation:read(path.join(bound.reviewDir,'validation.json')),seal:read(path.join(bound.reviewDir,'input-seal.json'))};
 assert.equal(validateCombinedReviews(boundDocs,{dataDir:path.join(f.root,'data')}).stats.people,1);
 assert.deepEqual(editorialReviews(boundDocs.editorial).at(-1),editorialReviews(d.editorial).at(-1));
});
test('new candidate non-date claims cannot be inserted onto historical editorial records',t=>{
 const{d}=mixedChronologyFixture(t),packet=buildPeopleExtractionPacket(d.book,d.chapter,{chapterData:d.source,properNounMatcher:loadProperNounMatcher()}),expanded=validateCompactPeopleExtraction(d.candidate,packet,{strictAliasDispositions:true}).normalized;
 const before=structuredClone(d.beforeEditorial),accepted=acceptedHistoricalClaims(d.book,d.chapter,d.beforeSource,d.beforeExtraction),expected=combinedEditorialBaseline(before,expanded,d.beforeExtraction.translationRepairs.length,accepted);
 expanded.claims.push({id:'testbook:001:c9999',subject:'testbook:001:p001',predicate:'event-participation',value:{action:'invented-unrelated-non-date-action'},certainty:'explicit',evidence:['testbook:001:s0001']});
 assert.deepEqual(combinedEditorialBaseline(before,expanded,d.beforeExtraction.translationRepairs.length,accepted),expected);
 assert.deepEqual(d.beforeEditorial,before);
 const dateClaim=expanded.claims.find(c=>c.predicate==='attestation');dateClaim.value.event='Invented change to a reviewed non-date event';
 assert.throws(()=>validateCombinedReviews({...d,candidate:{...d.candidate,claims:[['p001','attestation',{undatedSourceAttestation:true,event:dateClaim.value.event},'explicit',['s0001']]]}},{dataDir:process.cwd()}));
});
test('chronology history amendment composes with independently reviewed new English and retains raw old records',t=>{
 const{f,d,incoming}=mixedChronologyFixture(t),old=structuredClone(d.beforeEditorial),current=structuredClone(incoming);
 assert.equal(validateCombinedReviews(d,{dataDir:path.join(f.root,'data')}).stats.people,1);
 assert.deepEqual(d.beforeEditorial,old);assert.deepEqual(editorialReviews(d.editorial).at(-1),current);
});
for(const[label,mutate]of[
 ['unauthorized English',d=>{d.source.content[0].sentences[0].translations[0].literal+=' Unreviewed.';}],
 ['changed canonical non-date reasoning',d=>{d.editorial.reviews[0].reviewedAt='2026-09-15T00:00:00Z';}],
 ['uncaptured incoming component',d=>{d.identity.reviewContext.editorialDecisionHash='sha256:'+'0'.repeat(64);}],
 ['missing chronology review binding',d=>{delete d.dateReport.reviewContext.editorialAmendmentHash;}],
 ['self-approved new English',d=>{d.editorial.reviews.at(-1).reviewer.agentId='extractor';}],
])test('mixed chronology and English rejects '+label,t=>{
 const{f,d}=mixedChronologyFixture(t);mutate(d);assert.throws(()=>validateCombinedReviews(d,{dataDir:path.join(f.root,'data')}));
});

// R2 name-history regressions on the real native validators and AJV schema.
const claimCore=c=>Object.fromEntries(['id','subject','predicate','value','certainty','evidence'].map(k=>[k,structuredClone(c[k])]));
const nameMissing=name=>e=>new RegExp(`revised ${name.id}, but its replacement fact is missing`).test([e?.message,...(e?.errors??[])].join('\n'));
function nameHistory(t){
 const{f,d,checked}=undatedFixture(t);
 const name=checked.normalized.claims.find(c=>c.predicate==='name'&&c.value?.kind==='personal-name');
 assert.ok(name&&name.value.en==='Alice Smith','fixture personal-name claim');
 const reading=en=>({...claimCore(name),value:{...structuredClone(name.value),en}});
 const witness={source:'chapter-text',citation:'s0001',excerpt:'艾麗絲'};
 const unreviewed={repairId:`${d.book}:${d.chapter}:r0001`,before:reading('Alice Smythe'),after:reading('Alice Smyth'),reason,sourceWitness:witness};
 const history=structuredClone(d.beforeEditorial);history.reviews.at(-1).claimRevisions.push(structuredClone(unreviewed));
 const amended=structuredClone(d.editorial);amended.reviews.at(-1).claimRevisions.push(structuredClone(unreviewed));
 return{f,d,checked,name,reading,witness,history,amended};
}

test('name history: raw supersession arrays never excuse a missing reviewed name at the real library boundaries',t=>{
 const{d,checked,name,reading,history,amended}=nameHistory(t),n=d.beforeExtraction.translationRepairs.length,missing=nameMissing(name);
 const raw={laterClaimRevisions:[{before:reading('Alice Smyth'),after:reading('Alice Smith')}]};
 const accepted=acceptedHistoricalClaims(d.book,d.chapter,d.beforeSource,d.beforeExtraction);
 assert.ok(accepted.some(c=>c.predicate==='attestation'&&c.value.westernYear),'accepted claims are the original dated facts, not current facts');
 assert.equal(combinedEditorialBaseline(d.beforeEditorial,checked.normalized,n,accepted).amendment.claimRevisions.length,1,'control: the date-only amendment still derives');
 assert.throws(()=>validateAppliedEditorialDecisions(amended,checked.normalized,raw),missing);
 assert.throws(()=>deriveDateRepairEditorialAmendment(history,checked.normalized,raw),missing);
 assert.throws(()=>combinedEditorialBaseline(history,checked.normalized,n,accepted),missing);
 assert.throws(()=>combinedEditorialBaseline(history,checked.normalized,n,checked.normalized.claims),missing);
 for(const fourth of[undefined,null,raw])assert.throws(()=>combinedEditorialBaseline(history,checked.normalized,n,fourth),/accepted before-extraction claims/);
});

test('name history: a host-inserted claim row fails the captured incoming-component pins; only a reviewer re-pin admits it',t=>{
 const{f,d}=mixedChronologyFixture(t),dataDir=path.join(f.root,'data');
 const packet=buildPeopleExtractionPacket(d.book,d.chapter,{chapterData:d.source,properNounMatcher:loadProperNounMatcher()});
 const name=validateCompactPeopleExtraction(d.candidate,packet,{strictAliasDispositions:true}).normalized.claims.find(c=>c.predicate==='name'&&c.value?.kind==='personal-name');
 assert.ok(name,'fixture personal-name claim');
 const incoming=d.editorial.reviews.at(-1);
 incoming.claimRevisions.push({repairId:incoming.proposals[0].id,before:{...claimCore(name),value:{...structuredClone(name.value),en:'Alice Smyth'}},after:claimCore(name),reason,sourceWitness:{source:'chapter-text',citation:'s0001',excerpt:'艾麗絲'}});
 assert.throws(()=>validateCombinedReviews(d,{dataDir}),/reviewed incoming editorial component/);
 const hash=documentHash(editorialReviews(d.editorial).at(-1));
 for(const r of[d.identity,d.dateReport])r.reviewContext.editorialDecisionHash=hash;
 d.seal.editorialDecisionHash=hash;d.validation.identityReviewHash=documentHash(d.identity);d.validation.dateReportHash=documentHash(d.dateReport);
 assert.equal(validateCombinedReviews(d,{dataDir}).stats.people,1);
});

test('name history: only one later reviewed in-document name row supersedes, under the real validator and schema',t=>{
 const{d,checked,name,reading,witness,amended}=nameHistory(t),missing=nameMissing(name);
 const record=({schemaVersion,book,chapter,...r})=>r,id=`${d.book}:${d.chapter}:r0002`,unit=checked.normalized.translationRepairs[0].unit;
 const build=({before='The official Alice Smyth came.',after='The official Alice Smith came.',row=true,reviewer='reviewer-two',first=false}={})=>{
  const repair={id,unit,field:'idiomatic',before,after,reason,confidence:'high'};
  const later=editorialDecisionSeed({...checked.normalized,translationRepairs:[{...repair,status:'proposed'}]});
  later.reviewer={kind:'human',name:'Later independent editor',model:null,agentId:reviewer,runId:null,completedAt:'2026-09-15T00:00:00Z'};
  later.decisions[0]={repairId:id,decision:'accept',after:null,reason,sourceWitness:{source:'chapter-text',citation:'s0001',excerpt:'艾麗絲來。'}};
  later.claimRevisions=row?[{repairId:id,before:reading('Alice Smyth'),after:reading('Alice Smith'),reason,sourceWitness:witness}]:[];
  const history=editorialReviews(amended);
  return{document:{schemaVersion:4,book:d.book,chapter:d.chapter,reviews:(first?[later,...history]:[...history,later]).map(record)},
   extraction:{...checked.normalized,translationRepairs:[...checked.normalized.translationRepairs,{...repair,status:'applied'}]}};
 };
 const ok=build();
 validateAppliedEditorialDecisions(ok.document,ok.extraction);
 for(const[label,variant]of[['no reviewed row',{row:false}],['English repair is not the exact name substitution',{after:'The official Alice Smith arrived.'}],
   ['row precedes the historical revision',{first:true}],['self-review by the extractor',{reviewer:'extractor'}]]){
  const x=build(variant);assert.throws(()=>validateAppliedEditorialDecisions(x.document,x.extraction),missing,label);
 }
 assert.throws(()=>validateAppliedEditorialDecisions(build({row:false}).document,ok.extraction,{laterClaimRevisions:[ok.document.reviews.at(-1).claimRevisions[0]]}),missing,'raw array');
});

}

{
const save=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+"\n");
const pin=pinFile;
function firstInstallFixture(t){
 const f=fixture(t);
 for(const role of['extraction','editorial','dateReport'])fs.unlinkSync(f.files[role]);
 fs.rmSync(f.workflow,{recursive:true});
 const history=read(f.inputPaths.editorial),editorial={schemaVersion:3,book:f.spec.book,chapter:f.spec.chapter,...history.reviews[1]};save(f.inputPaths.editorial,editorial);
 const seal=read(f.inputPaths.seal);seal.protectedFiles=[f.files.source,...['source','extraction','editorial','materialization'].map(role=>f.inputPaths[role]),f.protectedFile].map(pin);save(f.inputPaths.seal,seal);
 f.spec.before=inspectCombinedBefore({root:f.root,book:f.spec.book,chapter:f.spec.chapter});
 f.spec.priorClaim=null;f.spec.claimHash=documentHash(null);
 f.spec.initialOwner={jobId:'testbook-001-000000000000',worker:'sole-owner',lane:'manual',status:'active',updatedAt:'2026-11-15T00:00:00Z'};f.spec.initialOwnerHash=documentHash(f.spec.initialOwner);
 f.ledger.dateAudits={};f.ledger.chapterOwners={[f.key]:structuredClone(f.spec.initialOwner)};
 const prepared=prepareCombinedCuration(f.spec);return{...f,...prepared};
}

test('first install publishes from real null baselines only after complete independent approval',t=>{
 const f=firstInstallFixture(t);
 assert.equal(f.receipt.before.extraction,null);assert.equal(f.receipt.before.editorial,null);assert.equal(f.receipt.before.dateReport,null);
 assert.equal(f.receipt.beforePins.extractionHash,null);assert.equal(f.receipt.priorClaim,null);assert.deepEqual(f.receipt.workflow,[]);
 assert.equal(fs.existsSync(f.files.extraction),false);assert.equal(fs.existsSync(f.files.editorial),false);
 const stages=[];
 assert.equal(publishCombinedCuration(f.receipt,f.hash,{...f.options,checkpoint:stage=>{
   stages.push(stage);if(['lease','receipt','history','source'].includes(stage))assert.equal(fs.existsSync(f.files.extraction),false);
   if(stage!=='queue')assert.equal(f.ledger.dateAudits[f.key].status,'active');
 }}).status,'complete');
 assert.equal(read(f.files.extraction).people.length,1);assert.equal(read(f.files.dateReport).status,'audited');
 assert.equal(f.ledger.dateAudits[f.key].status,'ready');assert.equal(f.ledger.dateAuditHistory?.[f.key],undefined);
 assert.deepEqual(f.ledger.chapterOwners[f.key],f.spec.initialOwner);
 assert.equal(read(path.join(f.workflow,'state.json')).reviewedGenerationTransition.before.extractionHash,null);
 const final=Object.fromEntries(Object.entries(f.files).map(([role,file])=>[role,pin(file)]));
 assert.equal(publishCombinedCuration(f.receipt,f.hash,f.options).status,'complete');
 for(const[role,file]of Object.entries(f.files))assert.deepEqual(pin(file),final[role]);
});

for(const boundary of['lease','receipt','history','source','extraction','editorial','dateReport','state','queue'])test('first install recovers exact partial publication after '+boundary,t=>{
 const f=firstInstallFixture(t);
 assert.throws(()=>publishCombinedCuration(f.receipt,f.hash,{...f.options,checkpoint:stage=>{if(stage===boundary)throw Error('interrupt');}}),/interrupt/);
 if(!['extraction','editorial','dateReport','state','queue'].includes(boundary))assert.equal(fs.existsSync(f.files.extraction),false);
 assert.equal(publishCombinedCuration(f.receipt,f.hash,f.options).status,'complete');
 assert.equal(f.ledger.dateAudits[f.key].status,'ready');assert.equal(read(f.files.extraction).people.length,1);
});

for(const[label,mutate]of[
 ['foreign owner',f=>{f.ledger.chapterOwners[f.key].worker='different-owner';}],
 ['unclaimed ownership',f=>{delete f.ledger.chapterOwners[f.key];}],
 ['competing extraction',f=>{f.ledger.claims[f.key]={worker:'other',lane:'cursor-sdk',status:'ready',claimedAt:'2026-11-15T00:00:00Z',updatedAt:'2026-11-15T00:00:00Z'};}],
 ['competing identity',f=>{f.ledger.identityReviews={[f.key]:{held:true}};}],
 ['unexpected date reservation',f=>{f.ledger.dateAudits[f.key]={worker:'sole-owner',lane:'manual',status:'active',sourceHash:f.receipt.inputs.identity?read(f.inputPaths.identity).sourceHash:null,extractionHash:read(f.inputPaths.identity).extractionHash,jobs:{}};}],
])test('first install rejects '+label+' before canonical writes',t=>{
 const f=firstInstallFixture(t);mutate(f);assert.throws(()=>publishCombinedCuration(f.receipt,f.hash,f.options));assert.equal(fs.existsSync(f.files.extraction),false);
});

for(const[label,mutate]of[
 ['negative review',f=>{const r=read(f.inputPaths.identity);r.approved=false;save(f.inputPaths.identity,r);}],
 ['incomplete identity coverage',f=>{const r=read(f.inputPaths.identity);r.personChecks=[];save(f.inputPaths.identity,r);}],
 ['unreviewed English',f=>{const r=read(f.inputPaths.source);r.content[0].sentences[0].translations[0].literal+=' Unreviewed.';save(f.inputPaths.source,r);}],
 ['different original source',f=>{fs.appendFileSync(f.files.source,' ');}],
 ['competing canonical install',f=>{save(f.files.extraction,{accepted:'foreign'});}],
 ['retained workflow breaker',f=>{fs.mkdirSync(f.workflow,{recursive:true});save(path.join(f.workflow,'state.json'),{schemaVersion:1,workflowVersion:1,round:3,phase:'repair',jobs:{},circuitBreaker:{held:true}});}],
])test('first install rejects '+label+' without creating accepted empty history',t=>{
 const f=firstInstallFixture(t);mutate(f);assert.throws(()=>prepareCombinedCuration(f.spec));assert.equal(f.calls(),0);
});

test('first install cannot use re-pinned retained workflow state as absence',t=>{
 const f=firstInstallFixture(t);fs.mkdirSync(f.workflow,{recursive:true});save(path.join(f.workflow,'state.json'),{schemaVersion:1,workflowVersion:1,sourceHash:f.spec.before.sourceHash,extractionHash:null,round:3,phase:'repair',jobs:{},circuitBreaker:{held:true}});
 f.spec.before=inspectCombinedBefore({root:f.root,book:f.spec.book,chapter:f.spec.chapter});
 assert.throws(()=>prepareCombinedCuration(f.spec),/retained workflow/);
});

test('first install admission cannot erase an existing extraction editorial history',t=>{
 const f=fixture(t);fs.unlinkSync(f.files.editorial);
 const seal=read(f.inputPaths.seal);seal.protectedFiles=seal.protectedFiles.filter(p=>p.file!==f.files.editorial);save(f.inputPaths.seal,seal);
 f.spec.before=inspectCombinedBefore({root:f.root,book:f.spec.book,chapter:f.spec.chapter});
 assert.throws(()=>prepareCombinedCuration(f.spec),/existing extraction requires its retained editorial history/);
 assert.equal(f.calls(),0);
});

}


// Count reconciliation is an explicit derived artifact, never a changed capture.
{
const nativeRoot=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const save=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');
function countBindingFixture(t,mutate=()=>{}){
 const f=fixture(t),dir=path.join(f.root,'count-binding-job');fs.mkdirSync(dir);
 const names={source:'source',extraction:'extraction',editorial:'editorial',materialization:'materialization',identity:'identity-review',dateReport:'date-report',validation:'review-validation',seal:'input-seal'},files={};
 for(const[role,name]of Object.entries(names)){files[role]=path.join(dir,name+'.json');fs.copyFileSync(f.inputPaths[role],files[role]);}
 const identity=read(files.identity),dateReport=read(files.dateReport),validation=read(files.validation),seal=read(files.seal);
 for(const r of[identity,dateReport]){delete r.reviewContext.sourcePath;delete r.reviewContext.candidatePath;}
 identity.coverage.candidateDispositions++;
 mutate({identity,dateReport,validation,seal});
 validation.identityReviewHash=documentHash(identity);validation.dateReportHash=documentHash(dateReport);
 seal.protectedFiles=['source','extraction','editorial'].map(role=>pinFile(files[role]));
 for(const[role,value]of Object.entries({identity,dateReport,validation,seal}))save(files[role],value);
 const job={id:'testbook-001-abcdef012345',book:f.spec.book,chapter:f.spec.chapter,nativeRoot,reviewAgentId:'reviewer',reviewerRunId:'captured-run',authors:f.spec.authorAgentIds,beforeNative:f.spec.before,
   circuitBreaker:{reason:'original held chapter',reviewRounds:3},reviewRounds:3,repairRounds:2,nativeSeals:[],
   recordingRecoveryHistory:[{stage:'native-wrapper-binding',status:'recorded',receipt:{file:'original-wrapper'}},{stage:'explicit-witness-capture',status:'recorded',receipt:{file:'original-witness'}}],witnessCapture:{receipt:'original-capture'}};
 const rawPins=Object.fromEntries(Object.entries(files).map(([role,file])=>[role,pinFile(file)]));
 const request={schemaVersion:1,kind:'host-candidate-disposition-count-binding',job:job.id,actualReviewer:job.reviewAgentId,actualRun:job.reviewerRunId,breakerHash:documentHash(job.circuitBreaker),reviewRounds:3,repairRounds:2,
  rawPins,change:{pointer:'/coverage/candidateDispositions',before:identity.coverage.candidateDispositions,after:identity.coverage.candidateDispositions-1}};
 const requestFile=path.join(dir,'count-request.json');save(requestFile,request);job.coverageCountBinding=pinFile(requestFile);
 const prepare=()=>prepareChapterNativeInputs({root:f.root,dir,job,hostAuthor:'codex:count-fixture'});
 return{f,dir,files,job,request,requestFile,prepare,saveRequest:()=>{save(requestFile,request);job.coverageCountBinding=pinFile(requestFile);}};
}
test('explicit count binding preserves captured bytes and passes the unchanged full native gate',async t=>{
 const x=countBindingFixture(t),before=Object.fromEntries(Object.entries(x.files).map(([k,f])=>[k,fs.readFileSync(f)])),oldJob=structuredClone(x.job);
 const bound=await x.prepare(),prepared=prepareCombinedCuration({...x.f.spec,...bound}),after=read(prepared.receipt.inputs.identity.file),original=read(x.files.identity);
 assert.equal(after.coverage.candidateDispositions,original.coverage.candidateDispositions-1);
 const expected=structuredClone(original);expected.coverage.candidateDispositions--;expected.reviewContext.sourcePath=after.reviewContext.sourcePath;expected.reviewContext.candidatePath=after.reviewContext.candidatePath;expected.hostInputBinding=after.hostInputBinding;
 assert.deepEqual(after,expected);
 for(const[k,f]of Object.entries(x.files))assert.deepEqual(fs.readFileSync(f),before[k]);assert.deepEqual(x.job,oldJob);
 const receipt=read(bound.coverageCountBinding.file);assert.deepEqual(receipt.change,x.request.change);assert.equal(receipt.semanticApprovalCreated,false);assert.equal(receipt.actualRun,'captured-run');
 assert.equal(receipt.nativeValidation.method,'validateCombinedReviews');assert.deepEqual(receipt.nativeValidation.stats,x.f.docs.validation.productionExtractionStats);
 assert(read(path.join(bound.reviewDir,'input-seal.json')).protectedFiles.some(p=>p.sha256===bound.coverageCountBinding.sha256));
 assert.deepEqual(await x.prepare(),bound);
});
test('no explicit request leaves stale count rejected by ordinary native validation',async t=>{
 const x=countBindingFixture(t);delete x.job.coverageCountBinding;const bound=await x.prepare();assert.equal(bound.coverageCountBinding,undefined);
 assert.throws(()=>prepareCombinedCuration({...x.f.spec,...bound}),/candidateDispositions count/);
});
for(const[label,mutate]of[
 ['missing candidate row',d=>d.identity.candidateChecks.pop()],
 ['duplicate candidate row',d=>d.identity.candidateChecks.push(structuredClone(d.identity.candidateChecks[0]))],
 ['extra candidate row',d=>d.identity.candidateChecks.push({...d.identity.candidateChecks[0],id:'unregistered-candidate'})],
 ['wrong personal owner',d=>d.identity.candidateChecks[0].personalOwners=['wrong-person']],
 ['changed mention judgment',d=>d.identity.mentionChecks[0].verdict='unsupported'],
 ['invalid source witness',d=>d.identity.personChecks[0].evidence[0].quote='not in source'],
 ['other stale count',d=>d.identity.coverage.people++],
 ['false full-source coverage',d=>d.identity.coverage.allSourceUnitsRead=false],
 ['date semantic mutation',d=>d.dateReport.itemChecks[0].verdict='unsupported'],
])test('count reconciliation retains production rejection for '+label,async t=>{const x=countBindingFixture(t,mutate);await assert.rejects(x.prepare());});
for(const[label,mutate]of[
 ['wrong requested count',x=>x.request.change.after++],
 ['wrong before count',x=>x.request.change.before++],
 ['generic metadata pointer',x=>x.request.change.pointer='/coverage/people'],
 ['extra requested edit',x=>x.request.additionalEdit={approved:true}],
 ['wrong reviewer',x=>x.request.actualReviewer='author'],
 ['wrong run',x=>x.request.actualRun='other-run'],
 ['breaker reset',x=>x.job.circuitBreaker.reason='reset'],
 ['counter reset',x=>x.job.reviewRounds=0],
 ['frozen source drift',x=>fs.appendFileSync(x.files.source,' ')],
 ['frozen extraction drift',x=>fs.appendFileSync(x.files.extraction,' ')],
 ['semantic report mutation',x=>{const r=read(x.files.identity);r.personChecks[0].reason+=' altered conclusion';save(x.files.identity,r);const v=read(x.files.validation);v.identityReviewHash=documentHash(r);save(x.files.validation,v);}],
 ['incomplete recording',x=>x.job.recordingRecoveryHistory[1].status='sent'],
 ['absent capture',x=>delete x.job.witnessCapture],
])test('count-binding request rejects '+label,async t=>{const x=countBindingFixture(t);mutate(x);x.saveRequest();await assert.rejects(x.prepare());});
test('count-binding rejects tampered request bytes even with valid JSON',async t=>{const x=countBindingFixture(t);fs.appendFileSync(x.requestFile,' ');await assert.rejects(x.prepare(),/request changed/);});
test('immutable derivation receipt cannot be retagged after tampering',async t=>{const x=countBindingFixture(t),b=await x.prepare();const r=read(b.coverageCountBinding.file);r.change.after=999;save(b.coverageCountBinding.file,r);await assert.rejects(x.prepare(),/Prepared native input changed/);});
test('derived identity semantic changes fail replay against the preserved capture',async t=>{const x=countBindingFixture(t),b=await x.prepare();const f=path.join(b.reviewDir,'identity-review.json'),r=read(f);r.personChecks[0].reason+=' tampered';save(f,r);await assert.rejects(x.prepare(),/Prepared native input changed/);});
}
