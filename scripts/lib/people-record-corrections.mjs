import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { inspectLocalDisk } from '../check-local-disk.mjs';
import { buildPeopleExtractionPacket } from '../build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../validate-people-extraction.mjs';
import { addCompactSurface } from './people-compact-surface.mjs';
import { loadProperNounMatcher } from './people-candidates.mjs';
import { inspectCombinedBefore } from './people-combined-curation.mjs';
import { exactSpanAt, readJson, REPO_ROOT, sha256, writeTextAtomic } from './people-content.mjs';
import { buildDateAuditPacket, validateDateAuditScope } from './people-date-audit.mjs';
import { validateAppliedEditorialDecisions } from './people-editorial-decisions.mjs';
import { acquireProcessRunLock } from './process-run-lock.mjs';
import { mutateRemotePeopleWorkLedger } from './people-work-queue.mjs';

function requireMatch(actual, expected, message) {
  if (!isDeepStrictEqual(actual, expected)) throw new Error(message);
}

function requireText(value, message) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(message);
}

export function replayRecordCorrections(before, units, changes) {
  requireMatch(before.schemaVersion, 2, 'Record correction packet requires compact extraction');
  if (!Array.isArray(changes) || !changes.length) throw new Error('Empty correction batch');
  const result = structuredClone(before);
  const unitById = new Map(units.map(unit => [unit.id, unit]));
  const targets = new Set();
  for (const change of changes) {
    const { person, unit, witness } = change;
    const source = unitById.get(unit);
    requireText(witness, 'Chinese witness required');
    if (!source?.zh.includes(witness)) throw new Error('Source witness changed');
    if (!result.people.some(row => row[0] === person)) throw new Error('Unknown chapter person');
    if (change.type === 'add-mention') {
      const { kind, language, exact, occurrence } = change;
      requireMatch(language, 'zh', 'Explicit source span requires Chinese');
      exactSpanAt(source.zh, exact, occurrence);
      if (!witness.includes(exact)) throw new Error('Missing span in source witness');
      if (result.surfaces.some(row => row[2] === language && row[3] === exact &&
          row[4].some(([id, occurrences]) => id === unit && occurrences.includes(occurrence)))) {
        throw new Error('Source span already assigned');
      }
      addCompactSurface(result, person, kind, { id: unit, unit, exact, occurrence, language });
      continue;
    }
    requireText(change.after, 'Replacement text required');
    requireText(change.before, 'Exact prior text required');
    if (change.before === change.after || targets.has(change.pointer)) throw new Error('Redundant record edit');
    targets.add(change.pointer);
    const alias = /^\/people\/(0|[1-9]\d*)\/5\/(0|[1-9]\d*)\/0\/en$/u.exec(change.pointer);
    const assessment = /^\/claims\/(0|[1-9]\d*)\/2\/assessment$/u.exec(change.pointer);
    let value, field, evidence, subject;
    if (change.type === 'alias-wording' && alias) {
      const row = result.people[Number(alias[1])];
      const name = row?.[5]?.[Number(alias[2])];
      [subject, value, field, evidence] = [row?.[0], name?.[0], 'en', name?.[2]];
    } else if (change.type === 'assessment-wording' && assessment) {
      const row = result.claims[Number(assessment[1])];
      requireMatch(row?.[1], 'assessment', 'Expected an assessment claim');
      [subject, value, field, evidence] = [row[0], row[2], 'assessment', row[4]];
    } else throw new Error('Unsupported record correction target');
    if (subject !== person || !evidence?.includes(unit) || value?.[field] !== change.before) {
      throw new Error('Record person, evidence or prior wording changed');
    }
    value[field] = change.after;
  }
  return result;
}

function reconcileRecordHolds(stage, input, inputHash) {
  const next = structuredClone(stage ?? {});
  for (const witness of next.unlinkedChineseWitnesses ?? []) {
    const matched = input.changes.some(c => c.type === 'add-mention' &&
      [c.person, input.book + ':' + input.chapter + ':' + c.person].includes(witness.expectedExistingPerson) &&
      c.unit === witness.unit && c.exact === witness.zh && c.occurrence === witness.occurrence);
    if (matched) Object.assign(witness, { linkedNow: true, status: 'linked-awaiting-chapter-identity-review' });
  }
  const wording = next.requiredRecordWordings;
  if (wording?.targets) {
    const reviewed = new Set(input.changes.filter(c => c.type !== 'add-mention').map(c => c.pointer));
    const outstanding = wording.outstandingTargets ?? wording.targets;
    wording.outstandingTargets = outstanding.filter(pointer => !reviewed.has(pointer));
    if (wording.outstandingTargets.length === 0) {
      wording.independentReviewRequired = false;
      wording.status = 'reviewed-and-applied';
    }
  }
  if (next.stagedCandidate) next.stagedCandidate.requiresCurrentGenerationReconciliation = true;
  next.actualSourceAuthors = [...new Set([...(next.actualSourceAuthors ?? []), input.authorId])];
  next.requiresIndependentFreshWholeChapterReview = true;
  next.reviewedRecordCorrections = { inputHash, resolvedChanges: input.changes, supersededGeneration: input.generationId };
  return next;
}

function capturedContentReview(row, input, base, inputHash) {
  const job = Object.values(row.jobs).filter(j => j.kind === 'independent-record-correction-review' &&
    j.status === 'returned' && j.inputSha256 === inputHash.slice(7));
  if (job.length !== 1) throw new Error('Exact captured independent content review required');
  const review = job[0];
  requireText(review.agentId, 'Missing actual reviewer');
  requireText(review.runId, 'Missing actual terminal run');
  const authors = new Set([input.authorId, ...input.excludedReviewerIds, ...(row.candidateStage?.actualSourceAuthors ?? []),
    base.run.agentId, ...(base.run.chunks ?? []).map(c => c.agentId)]);
  if (authors.has(review.agentId)) throw new Error('Self-reviewed packet');
  const reportText = fs.readFileSync(review.resultFile, 'utf8');
  requireMatch(sha256(reportText).slice(7), review.resultSha256, 'Captured review changed');
  const report = JSON.parse(reportText);
  requireMatch([report.kind, report.book, report.chapter, report.packetSha256, report.reviewer?.agentId,
    report.reviewer?.independentOfAuthors, report.candidateHash], ['independent-record-correction-review',
    input.book, input.chapter, inputHash.slice(7), review.agentId, true, input.candidateHash], 'Review scope or independence changed');
  requireMatch(report.decisions.map(d => [d.index, d.verdict]), input.changes.map((_, index) => [index, 'accept']), 'Every exact change needs approval');
  for (const [index, d] of report.decisions.entries()) {
    requireText(d.reason, 'Missing review reason');
    requireMatch(d.witness, input.changes[index].witness, 'Review witness mismatch');
  }
  requireMatch(report.supplementalRepairs, [], 'Resolve discovered source defects first');
  return review;
}

// All write destinations derive from the validated chapter scope. Packet files
// and captured reports are evidence. They never select a canonical target.
export function runRecordCorrections({ recordPacket, root = REPO_ROOT, apply = false }, services = {}) {
  const mutate = services.mutateLedger ?? mutateRemotePeopleWorkLedger;
  const raw = fs.readFileSync(recordPacket, 'utf8');
  const input = JSON.parse(raw);
  const { book, chapter, owner, generationId, before, changes } = input;
  requireMatch([input.sourceHash, input.extractionHash], [before.sourceHash, before.extractionHash], 'Inconsistent review pins');
  const inputHash = sha256(raw);
  const key = book + '/' + chapter;
  validateDateAuditScope(book, chapter);
  requireMatch(input.kind, 'chapter-record-corrections-v1', 'Unsupported record packet');
  requireText(owner, 'Expected retained worker');
  requireText(generationId, 'Expected source generation');
  requireText(input.authorId, 'Expected proposal author');
  if (!Array.isArray(input.excludedReviewerIds) || !input.excludedReviewerIds.includes(input.authorId)) throw new Error('Explicit excluded authors required');
  if (!path.isAbsolute(root)) throw new Error('Specify an absolute data root');
  const peopleDir = path.join(root, 'data/people');
  const scope = { dataDir: path.join(root, 'data'), peopleDir };
  const sourceFile = path.join(scope.dataDir, book, chapter + '.json');
  const extractionFile = path.join(peopleDir, 'extractions', book, chapter + '.json');
  const editorialFile = path.join(peopleDir, 'editorial-decisions', book, chapter + '.json');
  const capture = rel => fs.readFileSync(path.resolve(path.dirname(recordPacket), rel), 'utf8');
  const previous = capture(input.beforeFile);
  const candidate = capture(input.candidateFile);
  requireMatch(sha256(previous), before.extractionByteHash, 'Sealed prior extraction changed');
  requireMatch(sha256(candidate), input.candidateByteHash, 'Sealed candidate bytes changed');
  const base = JSON.parse(previous), next = JSON.parse(candidate);
  const packet = buildPeopleExtractionPacket(book, chapter, { chapterData: readJson(sourceFile),
    chapterFile: sourceFile, properNounMatcher: loadProperNounMatcher() });
  requireMatch(replayRecordCorrections(base, packet.units, changes), next, 'Candidate has undeclared changes');
  for (const extraction of [base, next]) {
    const result = validateCompactPeopleExtraction(extraction, packet, { strictAliasDispositions: true });
    validateAppliedEditorialDecisions(readJson(editorialFile), result.normalized);
  }
  const oldDates = buildDateAuditPacket(book, chapter, { ...scope, extraction: base });
  const newDates = buildDateAuditPacket(book, chapter, { ...scope, extraction: next });
  requireMatch([oldDates.sourceHash, oldDates.extractionHash, newDates.extractionHash],
    [before.sourceHash, before.extractionHash, input.candidateHash], 'Changed source or extraction pins');
  requireMatch(newDates.people, oldDates.people, 'Date people changed');
  requireMatch(newDates.items, oldDates.items, 'Date claims changed');
  const assertBoundary = () => {
    const actual = inspectCombinedBefore({ root, book, chapter });
    const prior = isDeepStrictEqual(actual, before);
    if (!prior) requireMatch(actual, { ...before, extractionHash: input.candidateHash,
      extractionByteHash: input.candidateByteHash }, 'Unrelated canonical or workflow drift');
    return prior;
  };
  const summary = { book, chapter, changes: changes.length, candidateHash: input.candidateHash };
  if (!apply) {
    requireMatch(assertBoundary(), true, 'Preview expects current before generation');
    return { ...summary, status: 'validated-candidate', independentApproval: false };
  }
  const guard = (services.guard ?? inspectLocalDisk)(root);
  if (guard.errors.length || guard.memory?.warnings?.length) throw new Error('Resource guard hold');
  requireMatch(fs.realpathSync(root), guard.primary, 'Record application requires the primary host checkout');
  const unlock = acquireProcessRunLock(path.join(peopleDir, 'generated/resolution-run.lock'),
    { label: 'Reviewed record application', failIfExists: true });
  try {
    const unlockDate = acquireProcessRunLock(path.join(peopleDir, 'generated/date-workflow-run.lock'),
      { label: 'Reviewed source generation', failIfExists: true });
    try {
      const transact = fn => mutate(ledger => {
        if (ledger.claims?.[key] || ledger.identityReviews?.[key]?.activeRun) throw new Error('Competing chapter owner');
        const row = ledger.dateAudits?.[key];
        if (row?.worker !== owner || row.status !== 'research-blocked') throw new Error('Retained owner required');
        return fn(row, ledger);
      }, { message: 'Reviewed record corrections for ' + key });
      const reservation = transact((row, ledger) => {
        if (row.candidateStage?.phase !== 'source-reconciliation-hold') throw new Error('Source reconciliation owner required');
        if (row.recordCorrections?.inputHash === inputHash && row.recordCorrections.phase === 'applied') {
          requireMatch(row.extractionHash, input.candidateHash, 'Applied generation changed');
          requireMatch(assertBoundary(), false, 'Applied generation lacks installed extraction');
          if (!ledger.dateAuditHistory?.[key]?.some(r => r.generationId === generationId && r.extractionHash === before.extractionHash)) throw new Error('Missing previous generation history');
          return 'complete';
        }
        requireMatch([row.generationId, row.sourceHash, row.extractionHash],
          [generationId, before.sourceHash, before.extractionHash], 'Retained generation changed');
        if (Object.values(row.jobs).some(j => ['claimed','running','running-tools'].includes(j.status))) throw new Error('Active chapter job');
        const review = capturedContentReview(row, input, base, inputHash);
        const reservation = row.recordCorrections;
        if (reservation?.phase === 'installing') {
          requireMatch([reservation.inputHash, reservation.resultSha256, row.executorToken, row.executorHost],
            [inputHash, review.resultSha256, reservation.token, os.hostname()], 'Different pending application');
        } else {
          if (row.executorToken || !assertBoundary()) throw new Error('Original idle claim and exact before bytes required');
          row.recordCorrections = { phase: 'installing', inputHash, resultSha256: review.resultSha256,
            priorClaim: structuredClone(row), inputFile: recordPacket, token: randomUUID(), toGeneration: randomUUID() };
          row.executorToken = row.recordCorrections.token;
          row.executorHost = os.hostname();
        }
        row.executorExpiresAt = new Date(Date.now() + 5 * 60_000).toISOString();
        return row.recordCorrections.token;
      });
      if (reservation.result === 'complete') return { ...summary, status: 'already-applied' };
      const token = reservation.result;
      services.checkpoint?.('reserved');
      const ownsLease = row => {
        requireMatch([row.executorToken, row.recordCorrections?.inputHash, row.recordCorrections?.token,
          row.executorHost, row.generationId], [token, inputHash, token, os.hostname(), generationId], 'Lost application reservation');
        if (Date.parse(row.executorExpiresAt) <= Date.now()) throw new Error('Expired record correction reservation');
        const { executorToken, executorHost, executorExpiresAt, recordCorrections, ...retained } = row;
        const { recordCorrections: previousReceipt, ...priorRetained } = recordCorrections.priorClaim;
        requireMatch(retained, priorRetained, 'Retained claim changed during publication');
      };
      transact(row => {
        ownsLease(row);
        row.executorExpiresAt = new Date(Date.now() + 5 * 60_000).toISOString();
      });
      if (assertBoundary()) writeTextAtomic(extractionFile, candidate);
      requireMatch(assertBoundary(), false, 'Canonical extraction not installed');
      services.checkpoint?.('installed');
      transact((row, ledger) => {
        ownsLease(row);
        requireMatch(assertBoundary(), false, 'Installed data drifted');
        ledger.dateAuditHistory ??= {};
        (ledger.dateAuditHistory[key] ??= []).push(row.recordCorrections.priorClaim);
        delete row.recordCorrections.priorClaim;
        row.generationId = row.recordCorrections.toGeneration;
        row.extractionHash = input.candidateHash;
        row.jobs = {};
        row.recordCorrections.phase = 'applied';
        row.candidateStage = reconcileRecordHolds(row.candidateStage, input, inputHash);
        delete row.executorToken; delete row.executorHost; delete row.executorExpiresAt;
      });
      return { ...summary, status: 'applied', chapterApproved: false };
    } finally { unlockDate(); }
  } finally { unlock(); }
}
