import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Reviewer artifact assembly/verification only. No production content is applied.
const dir = path.dirname(fileURLToPath(import.meta.url));
const base = path.dirname(dir);
const root = '/Users/garrettpetersen/records-of-the-grand-historian';
const agentId = '/root/jinshu119_candidate_reconciliation';
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const read = (file) => JSON.parse(fs.readFileSync(file));
const sorted = (value) => Array.isArray(value) ? value.map(sorted) :
  value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, sorted(value[key])])) : value;
const canonical = (value) => JSON.stringify(sorted(value));
const objectHash = (value) => sha(canonical(value));
const filePin = (file) => ({ file, sha256: sha(fs.readFileSync(file)) });
const assertPin = (file, digest) => assert.equal(sha(fs.readFileSync(file)), digest.replace(/^sha256:/, ''), `Byte pin: ${file}`);
const inputFile = path.join(dir, 'input.json');
const inputHash = '30e4065243bd3357c7d319dab63bee73ef8e26c491e2b95bcffddc11378d87fc';
assertPin(inputFile, inputHash);
const input = read(inputFile);
assert(!input.authorExclusions.includes(agentId), 'Reviewer must be independent of listed authors');
for (const [file, digest] of Object.entries(input.pins)) assertPin(file, digest);
const dossier = read(input.newDossier);
const oldDossier = read(input.oldDossier);
const oldResolution = read(input.oldResolution);
assert.deepEqual(dossier.input, input.nativeInput);
assert.equal(dossier.candidates.length, 123);
assert.equal(dossier.people.length, 202);
const workOrder = read(path.join(base, 'candidate-review/work-order.json'));
const returned = read(path.join(base, 'candidate-review/returned-receipt.json'));
const actualOriginalFile = path.resolve(base, 'candidate-review', workOrder.dossierFile);
assertPin(actualOriginalFile, workOrder.dossierSha256);
const actualOriginal = read(actualOriginalFile);
assert.equal(actualOriginal.people.length, 198);
assert.deepEqual(actualOriginal.input, oldResolution.input);
assert.equal(returned.terminalObserved, true);

const supportingPins = [];
const oldDecisionById = new Map();
const originalReportById = new Map();
const originalReports = [];
for (const part of workOrder.parts) {
  const partFile = path.join(base, 'candidate-review', part.file);
  assertPin(partFile, part.sha256);
  const partInput = read(partFile);
  assert.deepEqual(partInput.input, actualOriginal.input);
  const reportFile = partFile.replace('.input.json', '.candidate-review.json');
  const returnedPart = returned.reports.find((item) => item.file === path.basename(reportFile));
  assert(returnedPart, `Missing actual returned report for ${part.file}`);
  assertPin(reportFile, returnedPart.reportSha256);
  const report = read(reportFile);
  assert.equal(report.inputSha256, part.sha256);
  assert.equal(report.agentId, returned.reviewer);
  assert.deepEqual(report.holds, []);
  const decisions = [...report.candidatePeople, ...report.candidateDispositions];
  assert.equal(decisions.length, part.candidateIds.length);
  assert.deepEqual(new Set(decisions.map((item) => item.candidate)), new Set(part.candidateIds));
  const provenance = { ...filePin(reportFile), agentId: report.agentId, completedAt: report.completedAt,
    input: filePin(partFile), checked: decisions.length };
  originalReports.push(provenance);
  for (const decision of decisions) {
    assert(!oldDecisionById.has(decision.candidate), `Duplicate original decision ${decision.candidate}`);
    const originalCandidate = partInput.candidates.find((item) => item.id === decision.candidate);
    assert.deepEqual(originalCandidate, actualOriginal.candidates.find((item) => item.id === decision.candidate));
    assert.deepEqual(originalCandidate, oldDossier.candidates.find((item) => item.id === decision.candidate));
    oldDecisionById.set(decision.candidate, decision);
    originalReportById.set(decision.candidate, provenance);
  }
}
assert.equal(oldDecisionById.size, 121);
for (const decision of [...oldResolution.candidatePeople, ...oldResolution.candidateDispositions]) {
  assert.deepEqual(oldDecisionById.get(decision.candidate), decision, `Original report/resolution equality ${decision.candidate}`);
}

const structuredFile = path.join(base, 'structured-adjudication-20261112/independent-review.json');
const structured = read(structuredFile);
const coherentCompactFile = structured.proofReuseVerified.artifacts['coherent-candidate.compact.json'].file;
assertPin(coherentCompactFile, structured.proofReuseVerified.artifacts['coherent-candidate.compact.json'].sha256);
const coherentCompact = read(coherentCompactFile);
const observedOriginalCompactFile = path.join(base, 'independent-decisions/candidate.compact.json');
const observedOriginalCompact = read(observedOriginalCompactFile);
for (const key of ['people', 'surfaces', 'claims', 'candidateDispositions', 'coverage', 'input', 'run']) {
  assert.deepEqual(observedOriginalCompact[key], coherentCompact[key], `Retained compact array ${key}`);
}
supportingPins.push(filePin(actualOriginalFile), filePin(coherentCompactFile), filePin(observedOriginalCompactFile));
const oldEditorialFile = path.join(base, 'independent-decisions/validated-review.json');
const oldEditorialReceiptFile = path.join(base, 'independent-decisions/decision-review-receipt.json');
assertPin(oldEditorialReceiptFile, workOrder.decisionReceiptHash);
const oldEditorialReceipt = read(oldEditorialReceiptFile);
assertPin(oldEditorialFile, oldEditorialReceipt.outputSha256['validated-review.json']);
const oldEditorial = read(oldEditorialFile);
const nativeReview = read(path.join(base, 'structured-adjudication-20261112/coherent-native-review.json'));
supportingPins.push(filePin(oldEditorialFile), filePin(oldEditorialReceiptFile));

const englishFile = path.join(base, 'structured-adjudication-20261112/coherent-english-fields.json');
const english = read(englishFile);
const sourceFile = path.join(root, 'data/jinshu/119.json');
assertPin(sourceFile, english.canonicalSourceSha256);
supportingPins.push(filePin(sourceFile));
const sourceById = new Map();
function collectUnits(value) {
  if (Array.isArray(value)) { for (const item of value) collectUnits(item); return; }
  if (!value || typeof value !== 'object') return;
  if (value.id && typeof value.zh === 'string') {
    assert(!sourceById.has(value.id), `Duplicate source unit ${value.id}`);
    sourceById.set(value.id, value);
  }
  for (const item of Object.values(value)) collectUnits(item);
}
collectUnits(read(sourceFile).content);
const sourceReceipt = read(path.join(base, 'source-coverage-receipt.json'));
assert.equal(sourceReceipt.fullScopeCovered, true);
assert.equal(sourceReceipt.totalUnits, 276);
const sourceProofByUnit = new Map();
const sourceReports = [];
for (const part of sourceReceipt.reports) {
  const file = path.join(base, `${part.partId}.source-review.json`);
  assertPin(file, part.reportSha256);
  const report = read(file);
  const partInputFile = path.join(base, `${part.partId}.input.json`);
  assertPin(partInputFile, report.inputSha256);
  const partInput = read(partInputFile);
  assert.equal(report.unitChecks.length, part.units);
  assert.deepEqual(new Set(report.unitChecks.map((item) => item.unit)), new Set(partInput.units.map((item) => item.id)));
  const provenance = { ...filePin(file), agentId: report.reviewer.agentId, input: filePin(partInputFile) };
  sourceReports.push(provenance);
  for (const check of report.unitChecks) {
    assert(!sourceProofByUnit.has(check.unit), `Duplicate original source proof ${check.unit}`);
    sourceProofByUnit.set(check.unit, { ...provenance, unit: check.unit, proofSha256: objectHash(check) });
  }
}
assert.equal(sourceProofByUnit.size, 276);
const acceptedFieldByKey = new Map(english.repairs.map((repair) => [`${repair.unitId}:${repair.field}`, repair]));
const provenancePins = new Map();
for (const repair of english.repairs) for (const p of repair.provenance) {
  assertPin(p.file, p.sha256);
  provenancePins.set(p.file, { file: p.file, sha256: p.sha256 });
}
supportingPins.push(...provenancePins.values());
function contextProof(candidate) {
  const source = sourceById.get(candidate.unit);
  assert(source, `Source unit ${candidate.unit}`);
  assert.equal(source.zh, candidate.context.zh);
  const translation = source.translations.find((item) => item.lang === 'en');
  const fields = {};
  for (const field of ['idiomatic', 'literal']) {
    const repair = acceptedFieldByKey.get(`${candidate.unit}:${field}`);
    if (repair) assert.equal(repair.before, translation[field], `Accepted repair original field ${candidate.unit}/${field}`);
    const finalText = repair ? repair.after : translation[field];
    assert.equal(candidate.context[field], finalText, `Candidate exact accepted context ${candidate.id}/${field}`);
    fields[field] = { textSha256: sha(finalText), provenance: repair ? repair.provenance :
      [{ ...filePin(sourceFile), field, status: 'unchanged-canonical-field' }] };
  }
  return { originalSourceReview: sourceProofByUnit.get(candidate.unit), chineseSha256: sha(source.zh), fields };
}

const freshFile = path.join(dir, 'fresh-decisions.json');
const fresh = read(freshFile);
assert.equal(fresh.agentId, agentId);
assert.equal(fresh.inputSha256, inputHash);
const freshById = new Map([...fresh.candidatePeople, ...fresh.candidateDispositions].map((item) => [item.candidate, item]));
assert.equal(freshById.size, 7);
assert.deepEqual(new Set(freshById.keys()), new Set(input.focusedIds));
const structuralById = new Map(fresh.structurallyAffectedReuse.map((item) => [item.candidate, item]));
const unchanged = new Set(input.unchangedIds);
assert.equal(unchanged.size, 116);
const resolution = structuredClone(dossier.decisionSeed);
const provenance = [];
const affectedSeen = new Set();
for (const candidate of dossier.candidates) {
  const prior = actualOriginal.candidates.find((item) => item.id === candidate.id);
  const oldDecision = oldDecisionById.get(candidate.id);
  const reused = unchanged.has(candidate.id);
  if (reused) assert.deepEqual(candidate, prior, `Complete unchanged candidate ${candidate.id}`);
  else assert(freshById.has(candidate.id), `Missing focused review ${candidate.id}`);
  const decision = structuredClone(reused ? oldDecision : freshById.get(candidate.id));
  if (oldDecision) {
    const { note: oldNote, ...oldSemantics } = oldDecision;
    const { note: newNote, ...newSemantics } = decision;
    assert.deepEqual(newSemantics, oldSemantics, `Retained original decision semantics ${candidate.id}`);
  }
  const entry = { candidate: candidate.id, unit: candidate.unit,
    mode: reused ? 'reuse-original-independent-proof' : prior ? 'fresh-changed-context-review' : 'fresh-new-candidate-review',
    candidateObjectSha256: objectHash(candidate), originalCandidateObjectSha256: prior ? objectHash(prior) : null,
    completeCandidateObjectUnchanged: reused, decisionSha256: objectHash(decision), decision,
    originalIndependentReport: originalReportById.get(candidate.id) ?? null,
    originalDecisionSha256: oldDecision ? objectHash(oldDecision) : null,
    sourceAndEnglishProof: contextProof(candidate) };
  if (decision.person) {
    resolution.candidatePeople.push(decision);
    const currentPerson = dossier.people.find((item) => item.localId === decision.person);
    const originalPerson = actualOriginal.people.find((item) => item.localId === decision.person);
    assert(currentPerson, `Known current person ${decision.person}`);
    const local = decision.person.split(':').at(-1);
    const compactPerson = coherentCompact.people.find((item) => item[0] === local);
    assert(compactPerson, `Retained compact person ${local}`);
    const nameRevisions = nativeReview.claimRevisions.filter((item) => item.after.subject === decision.person && item.after.predicate === 'name');
    for (const revision of nameRevisions) assert.deepEqual(revision, oldEditorial.claimRevisions.find((item) => item.after.id === revision.after.id), `Retained accepted name revision ${revision.after.id}`);
    entry.linkedPersonProof = { person: decision.person, preferredNameUnchanged: canonical(currentPerson.preferredNameSuggestion) === canonical(originalPerson?.preferredNameSuggestion),
      originalDossierPersonSha256: originalPerson ? objectHash(originalPerson) : null, currentDossierPersonSha256: objectHash(currentPerson),
      dossierPersonExactlyUnchanged: canonical(currentPerson) === canonical(originalPerson),
      retainedNameClaimsSha256: objectHash(compactPerson[5]),
      retainedNameEvidence: compactPerson[5], retainedAcceptedNameRevisions: nameRevisions.map((item) => ({ id: item.after.id, sha256: objectHash(item), source: filePin(oldEditorialFile) })),
      source: filePin(coherentCompactFile), historicalCompactFileWasIndependentlySealed: false,
      proofLimit: 'Current compact bytes and unchanged arrays verified against the pinned structured-review receipt. Actual historical sealed candidate/person dossier and original report remain the prior-review authority.' };
    if (reused && !entry.linkedPersonProof.dossierPersonExactlyUnchanged) {
      const focused = structuralById.get(candidate.id);
      assert(focused, `Changed linked-person proof needs explicit review ${candidate.id}`);
      assert.equal(focused.person, decision.person);
      for (const excerpt of focused.sourceExcerpts) assert(focused.sourceUnits.some((unit) => sourceById.get(unit).zh.includes(excerpt)), `Focused Chinese witness ${excerpt}`);
      entry.mode = 'reuse-original-proof-with-fresh-structural-attribution-confirmation';
      entry.focusedStructuralReview = focused;
      affectedSeen.add(candidate.id);
    }
  } else resolution.candidateDispositions.push(decision);
  provenance.push(entry);
}
assert.deepEqual(affectedSeen, new Set(structuralById.keys()));
assert.equal(provenance.length, 123);
// Run the actual released native resolution validator, without executing the applier.
const nativeFile = 'scripts/apply-people-translation-repairs.mjs';
const released = execFileSync('git', ['show', `${input.runtimeRelease}:${nativeFile}`], { cwd: root, encoding: 'utf8' });
const constants = ['EXPLICIT_NON_PERSON_REASONS', 'EXPLICIT_MENTION_KINDS'].map((name) => {
  const found = released.match(new RegExp(`const ${name} = new Set\\(\\[[\\s\\S]*?\\]\\);`));
  assert(found, `Native constant ${name}`); return found[0];
}).join('\n');
const start = released.indexOf('function candidateResolutionFromDocument(');
const end = released.indexOf('\nfunction renumberRepairs(', start);
assert(start > 0 && end > start, 'Released native validator boundaries');
vm.runInNewContext(`${constants}\n${released.slice(start, end)}\ncandidateResolutionFromDocument(document, dossier);`,
  { document: resolution, dossier, structuredClone }, { timeout: 1000 });
const counts = { candidates: 123, peopleRetainedInInput: 202, originalReports: 8, originalCandidates: 121,
  unchangedCandidateObjects: 116, pureProofReuse: 113, proofReuseWithFocusedStructuralConfirmation: 3,
  freshChangedContexts: 5, freshNewCandidates: 2, personAssignments: resolution.candidatePeople.length,
  nonpersonDispositions: resolution.candidateDispositions.length, candidateHolds: fresh.candidateHolds.length };
assert.equal(counts.personAssignments, 31);
assert.equal(counts.nonpersonDispositions, 92);
const nativeValidation = { passed: true, release: input.runtimeRelease, file: nativeFile,
  releasedFileSha256: sha(released), function: 'candidateResolutionFromDocument', applierExecuted: false };
const report = { schemaVersion: 1, kind: 'independent-focused-candidate-generation-reconciliation', agentId,
  reviewer: { kind: 'codex', agentId, model: null, runId: null }, book: 'jinshu', chapter: '119',
  inputSha256: inputHash, completedAt: new Date().toISOString(), jobId: 'candidate-reconciliation-30e4065243bd3357',
  owner: input.owner, independence: { authorExclusions: input.authorExclusions, independentOfAllListedAuthors: true,
    subagentsUsed: false, privateControllersRead: false, canonicalWritesPerformed: false, queueOrLeaseMutationsPerformed: false },
  scope: 'Candidate attribution only: verified actual original reports, reused identical candidate proofs, freshly reviewed five context changes, two additions, and three structurally affected linked-person attributions. No new full source/date audit or identity pair graph.',
  counts, inputs: { native: dossier.input, newDossier: filePin(input.newDossier), releasedOldDossier: filePin(input.oldDossier),
    actualOriginal198PersonDossier: filePin(actualOriginalFile), oldResolution: filePin(input.oldResolution),
    sealedPins: input.pins, additionalVerifiedSupportingPins: supportingPins, originalReports, sourceReports,
    historicalScopeHashesFromWorkOrder: { sourceHash: input.sourceHash, extractionHash: input.extractionHash },
    note: 'Historical work-order scope hashes are retained provenance, not claims that current canonical byte hashes equal those older generation hashes.' },
  sourceProofReuse: { existingFullSourceCoverageUnits: 276, fullScopeCoveredInOriginalReceipt: true,
    originalSourceRepairsIndependentlyApprovedBySourceReviewer: sourceReceipt.independentlyApprovedReplacements,
    acceptedEnglishDistinctFields: english.distinctFields, candidateContextsCheckedMechanicallyAgainstAcceptedFields: 123,
    newlyCommissionedFullSourceReview: false, rawSourceProposalsDoNotConstituteReplacementApproval: true },
  producerArtifact: filePin(freshFile), nativeValidation, candidates: provenance,
  candidateHolds: fresh.candidateHolds, remainingHolds: fresh.downstreamHolds,
  preservation: { requiredPeople: 202, noPersonDeletionOrMergePerformed: true,
    distinctMothers: ['jinshu:119:p118', 'jinshu:119:p119'], p190CorpseReceptionIsRetrospective: true,
    originalReportsPreserved: true, original121DecisionSemanticsRetained: true },
  supplementalEnglishArtifact: null, newSupplementalEnglishRepairs: 0,
  usage: { providerUsage: null, providerCost: null, status: 'unknown', billedCharges: null },
  canonicalApplied: false, finalMentionGeometryVerified: false, fullDateAuditPerformed: false,
  chapterApproved: false, newlyPublishedChapters: 0, dataQualifiedChapters: 0, appliedReviewedCorrections: 0 };
const outputFile = path.join(dir, 'native-candidate-resolution.json');
const reportFile = path.join(dir, 'independent-review.json');
if (process.argv.includes('--assemble')) {
  fs.writeFileSync(outputFile, `${JSON.stringify(resolution, null, 2)}\n`, { flag: 'wx' });
  report.nativeCandidateResolution = filePin(outputFile);
  fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
} else {
  assert.deepEqual(read(outputFile), resolution, 'Fresh assembled native resolution');
  const saved = read(reportFile);
  assert.deepEqual(saved.candidates, report.candidates, 'Saved per-candidate proof provenance');
  assert.deepEqual(saved.counts, counts);
  assert.equal(saved.agentId, agentId);
  assert.equal(saved.inputSha256, inputHash);
  assert.deepEqual(saved.nativeValidation, nativeValidation);
  assert.deepEqual(saved.remainingHolds, fresh.downstreamHolds);
  assert.equal(saved.chapterApproved, false);
  assertPin(outputFile, saved.nativeCandidateResolution.sha256);
}
console.log(JSON.stringify({ passed: true, counts, nativeValidation, outputs: [filePin(outputFile), filePin(reportFile)],
  canonicalApplied: false, chapterApproved: false, usage: 'unknown' }, null, 2));
