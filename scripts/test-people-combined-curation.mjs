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
import { editorialDecisionSeed, editorialReviews } from './lib/people-editorial-decisions.mjs';
import { sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { acquireProcessRunLock } from './lib/process-run-lock.mjs';
import { reservePeopleTargetsInLedger } from './lib/people-work-queue.mjs';
import { inspectCombinedBefore, prepareCombinedCuration, verifyCombinedCuration, publishCombinedCuration } from './lib/people-combined-curation.mjs';
import { combinedDatePacket, documentHash, validateCombinedReviews } from './lib/people-combined-curation-review.mjs';

const reason = 'Independently checked this exact source unit and its named individual against the complete fixture.';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hashFile = file => `sha256:${createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`;
const unpack = content => JSON.parse(Buffer.from(content.base64, 'base64'));
const pinFile = file => ({ file, bytes: fs.statSync(file).size, sha256: hashFile(file) });
const chunkRun = agentId => ({ model: 'offline-fixture-chunked', promptVersion: 7, agentId: null,
  chunks: [{ chunkId: '001', startOrder: 0, endOrderExclusive: 1, model: 'offline-fixture', agentId, runId: 'chunk-run', completedAt: '2026-09-13T00:00:00Z' }] });

function fixture(t, book = 'testbook', chapter = '001', run = { model: 'offline-fixture', promptVersion: 7, agentId: 'extractor' }, authorAgentIds = ['extractor', 'curator']) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'combined-curation-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const people = path.join(root, 'data', 'people');
  const files = { source: path.join(root, 'data', book, `${chapter}.json`),
    extraction: path.join(people, 'extractions', book, `${chapter}.json`),
    editorial: path.join(people, 'editorial-decisions', book, `${chapter}.json`),
    dateReport: path.join(people, 'date-audits', book, `${chapter}.json`) };
  const workflow = path.join(people, 'generated', 'date-workflow', book, chapter);
  const source = { meta: { book, chapter }, content: [{ sentences: [{ id: 's0001', zh: '\u827e\u9e97\u7d72\u4f86\u3002', translations: [{ lang: 'en', literal: 'Alice Smith come.', idiomatic: 'The official Alice Smith came.' }] }] }] };
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
  afterSource.content[0].sentences[0].translations[0].literal = 'Alice Smith came.';
  const packet = packetFor(afterSource);
  const candidate = structuredClone(extraction);
  candidate.input = buildCompactInput(packet);
  candidate.people[0][3] = 'The independently identified traveler Alice.';
  candidate.people[0][4].a = ['AD 2'];
  candidate.claims[0][2].westernYear.year = 2;
  const proposal = structuredClone(beforeExpanded);
  proposal.translationRepairs = [{ id: `${book}:${chapter}:r0001`, unit: beforeExpanded.mentions[0].unit, field: 'literal', before: 'Alice Smith come.', after: 'Alice Smith came.', reason, confidence: 'high', status: 'proposed' }];
  const newEditorial = editorialDecisionSeed(proposal);
  newEditorial.reviewer = { kind: 'human', name: 'Independent editor', model: null, agentId: 'reviewer', runId: null, completedAt: '2026-09-14T00:00:00Z' };
  newEditorial.decisions[0] = { repairId: `${book}:${chapter}:r0001`, decision: 'accept', after: null, reason, sourceWitness: { source: 'chapter-text', citation: 's0001', excerpt: '\u827e\u9e97\u7d72\u4f86\u3002' } };
  candidate.translationRepairs = [['s0001', 'literal', 'Alice Smith come.', 'Alice Smith came.', reason, 'high', 'applied']];
  const record = r => Object.fromEntries(Object.entries(r).filter(([k]) => !['schemaVersion', 'book', 'chapter'].includes(k)));
  const editorial = { schemaVersion: 4, book, chapter, reviews: [record(editorialBefore), record(newEditorial)] };
  const result = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
  const expanded = result.normalized;
  const dates = combinedDatePacket(book, chapter, afterSource, candidate);
  const reviewer = { name: 'Independent fixture reviewer', agentId: 'reviewer', actualAgentId: 'reviewer', independentOfExtractor: true, independentOfRepairAuthor: true, excludedAuthorAgentIds: ['extractor', 'curator'] };
  const hashes = { sourceHash: dates.sourceHash, extractionHash: dates.extractionHash };
  const check = id => ({ id, verdict: 'supported', reason, evidence: [{ unit: 's0001', quote: '\u827e\u9e97\u7d72' }] });
  const dateReport = { schemaVersion: 1, auditVersion: 1, book, chapter, ...hashes, status: 'audited', reviewer, reviewedAt: '2026-09-14T00:00:00Z', summary: reason,
    reviewedUnits: ['s0001'], itemChecks: dates.items.map(i => ({ ...check(i.id), event: reason })), personChecks: dates.people.map(p => check(p.id)), findings: [], references: [] };
  const identity = { schemaVersion: 1, reportType: 'complete-independent-source-identity-review', book, chapter, ...hashes, status: 'approved', approved: true,
    reviewer, reviewedAt: dateReport.reviewedAt, summary: reason, findings: [], references: [],
    unitChecks: packet.units.map(u => ({ ...check(u.id), sourceHash: sha256(u.zh), englishHash: sha256(u.en), literalHash: sha256(u.literal), mentions: expanded.mentions.filter(m => m.unit.id === u.id).map(m => m.id) })),
    personChecks: candidate.people.map(p => ({ ...check(p[0]), names: p[1] })),
    nameClaimChecks: candidate.people.flatMap((p, i) => p[5].map((claim, j) => ({ ...check(`name-${p[0]}-${j + 1}`), personId: p[0], path: `/people/${i}/5/${j}`, claim }))),
    familyRelationshipChecks: [],
    mentionChecks: expanded.mentions.map(m => ({ ...check(m.id), personId: m.person.split(':').at(-1), unit: m.unit.id, kind: m.kind, spans: m.spans, candidateRefs: m.candidateRefs })),
    candidateChecks: packet.preflight.candidates.map(c => { const mentions = expanded.mentions.filter(m => m.candidateRefs.includes(c.id)); return { ...c, ...check(c.id), mentionIds: mentions.map(m => m.id), personalOwners: [...new Set(mentions.map(m => m.person.split(':').at(-1)))], disposition: expanded.candidateDispositions.find(d => d.candidate === c.id) ?? null }; }),
    collectiveOccurrenceChecks: [],
    coverage: { sourceUnits: 1, people: 1, nameClaims: 1, familyRelationships: 0, personalMentions: expanded.mentions.length, scannerCandidates: packet.preflight.candidates.length,
      candidateDispositions: expanded.candidateDispositions.length, collectiveOccurrences: 0, temporalItems: dates.items.length,
      allSourceUnitsRead: true, allStoredMentionsChecked: true, unscannedCallbacksChecked: true, namedPeopleAndDefiniteCallbacksComplete: true, omittedNamedPeopleFound: 0 } };
  const beforeDates = combinedDatePacket(book, chapter, source, extraction);
  const oldReport = { ...dateReport, sourceHash: beforeDates.sourceHash, extractionHash: beforeDates.extractionHash, status: 'research-blocked',
    itemChecks: dateReport.itemChecks.map(c => ({ ...c, verdict: 'research-blocked' })), findings: dateReport.itemChecks.map(c => ({ items: [c.id], problem: reason, action: reason })) };
  for (const [role, doc] of Object.entries({ source, extraction, editorial: editorialBefore, dateReport: oldReport })) writeJsonAtomic(files[role], doc);
  const state = { schemaVersion: 1, workflowVersion: 1, sourceHash: beforeDates.sourceHash, extractionHash: beforeDates.extractionHash, phase: 'repair', round: 0, jobs: { 'repair-0-retained': { agentId: 'curator', conversation: 'do-not-delete' } }, review: 'review-0.json' };
  writeJsonAtomic(path.join(workflow, 'state.json'), state);
  writeJsonAtomic(path.join(workflow, 'review-0.json'), oldReport);
  writeJsonAtomic(path.join(workflow, 'jobs', 'failed.json'), { rejected: true, evidence: 'retain all bytes' });
  const materializedDir = path.join(root, 'staged', 'materialized'), reviewDir = path.join(root, 'staged', 'independent-review');
  const inputPaths = { source: path.join(materializedDir, 'data', book, `${chapter}.json`), extraction: path.join(materializedDir, 'candidate.json'), editorial: path.join(materializedDir, 'editorial-decisions.json'), materialization: path.join(materializedDir, 'validation.json'),
    identity: path.join(reviewDir, 'identity-review.json'), dateReport: path.join(reviewDir, 'date-report.json'), validation: path.join(reviewDir, 'validation.json'), seal: path.join(reviewDir, 'input-seal.json') };
  for (const [role, doc] of Object.entries({ source: afterSource, extraction: candidate, editorial })) writeJsonAtomic(inputPaths[role], doc);
  const materialization = { ...hashes, sourceByteHash: hashFile(inputPaths.source), extractionByteHash: hashFile(inputPaths.extraction) };
  writeJsonAtomic(inputPaths.materialization, materialization);
  const context = { candidatePath: inputPaths.extraction, sourcePath: inputPaths.source, candidateByteHash: materialization.extractionByteHash, sourceByteHash: materialization.sourceByteHash, editorialDecisionHash: documentHash(newEditorial), amendmentAuthor: 'curator' };
  identity.reviewContext = context; dateReport.reviewContext = context;
  const validation = { ...hashes, status: 'approved-exact-editorial-amended-candidate', reviewerId: 'reviewer', identityReviewHash: documentHash(identity), dateReportHash: documentHash(dateReport), productionDateReportValid: true, productionAppliedEditorialValid: true, completeIdentityEvidenceCoverage: true, exactFreshDatePacket: true, allProtectedBytesUnchanged: true, productionExtractionStats: result.stats, strictAliasDispositionConflicts: [], dateGeometryReceptionDiagnostics: [] };
  const protectedFile = path.join(root, 'protected.json');
  writeJsonAtomic(protectedFile, { unchanged: true });
  const protectedPaths = [files.source, files.extraction, files.editorial, inputPaths.source, inputPaths.extraction, inputPaths.editorial, inputPaths.materialization, protectedFile];
  const seal = { ...hashes, reviewer, protectedFiles: protectedPaths.map(file => ({ file, bytes: fs.statSync(file).size, sha256: hashFile(file) })) };
  for (const [role, doc] of Object.entries({ identity, dateReport, validation, seal })) writeJsonAtomic(inputPaths[role], doc);
  const priorClaim = { lane: 'manual', worker: 'sticky-worker', status: 'research-blocked', sourceHash: beforeDates.sourceHash, extractionHash: beforeDates.extractionHash, jobs: structuredClone(state.jobs) };
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

test('the existing global process lock excludes another local date executor', t => {
  const f = fixture(t), lock = path.join(f.root, 'data/people/generated/date-workflow-run.lock');
  const unlock = acquireProcessRunLock(lock);
  try { assert.throws(() => publishCombinedCuration(f.receipt, f.hash, f.options), /already running/); }
  finally { unlock(); }
  assert.equal(f.calls(), 0);
});

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
