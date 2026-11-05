import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { inspectLocalDisk } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import { mutateRemotePeopleWorkLedger, dateExecutorIsBusy } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-work-queue.mjs';
import { acquireProcessRunLock } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/process-run-lock.mjs';
import { buildPeopleExtractionPacket } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import { validateCompactPeopleExtraction } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
import { buildDateAuditPacket } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import { writeTextAtomic } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-content.mjs';
const root = '/Users/garrettpetersen/records-of-the-grand-historian', dir = new URL('.', import.meta.url).pathname;
const read = file => JSON.parse(fs.readFileSync(file)), hash = bytes => createHash('sha256').update(bytes).digest('hex');
const need = (ok, message) => { if (!ok) throw Error(message); };
const archive = (file, bytes) => { if (fs.existsSync(file)) need(fs.readFileSync(file).equals(bytes), 'Retained old report changed'); else fs.writeFileSync(file, bytes, { flag: 'wx' }); };
const manifest = read(dir + 'reviewed-amendments-manifest.json'), stateFile = dir + 'review-state.json', state = read(stateFile);
const receiptFile = dir + 'reviewed-amendments-application.json', intentFile = dir + 'reviewed-amendments-application-intent.json';
need(!fs.existsSync(receiptFile) && !fs.existsSync(intentFile), 'Existing application/intent must be recovered, never overwritten');
need(!inspectLocalDisk(root).errors.length, 'Resource guard rejected source application');
need(manifest.sourceApproved && manifest.canonicalWrites === 0 && state.phase === 'source-reconciliation-hold' &&
  state.repairReview.phase === 'report-recorded' && !state.parts.some(p => ['reserved', 'running'].includes(p.phase)), 'Source reviewers must be idle');
need(manifest.acceptedReviewSha256 === hash(fs.readFileSync(dir + 'focused-english-accepted-review.json')), 'Independent approval changed');
for (const chapter of manifest.chapters) for (const [kind, input] of Object.entries(chapter.inputs)) {
  need(hash(fs.readFileSync(root + '/' + input.path)) === input.sha256 &&
    hash(fs.readFileSync(chapter.outputs[kind].path)) === chapter.outputs[kind].sha256, 'Exact prepared input/output changed');
}
const release = acquireProcessRunLock(root + '/data/people/generated/resolution-run.lock', { label: 'Apply reviewed108/109 source amendments', failIfExists: true });
const token = 'host-reviewed-source-' + randomUUID(), oldDates = {}, dateFiles = {};
let canonicalWrites = 0;
try {
  for (const chapter of manifest.chapters) {
    const file = root + '/data/people/date-audits/jinshu/' + chapter.chapter + '.json';
    if (fs.existsSync(file)) {
      const bytes = fs.readFileSync(file); oldDates[chapter.chapter] = JSON.parse(bytes);
      const saved = dir + 'before-amendments-' + chapter.chapter + '-date-audit.json';
      archive(saved, bytes); dateFiles[chapter.chapter] = { file, saved, sha256: hash(bytes), canonicalExisted: true };
    } else if (chapter.chapter === '109') {
      need(process.argv[2] === '--archive-pinned-109-audit', 'Host109 audit is absent; explicitly recover only the sealed old-revision report, without restoring its staged deletion');
      const relative = 'data/people/date-audits/jinshu/109.json';
      const bytes = execFileSync('git', ['-C', root, 'show', manifest.sourceRevision + ':' + relative], { maxBuffer: 4 * 1024 * 1024 });
      need('sha256:' + hash(bytes) === read(dir + 'preparation-receipt.json').inputs.dateAudit, 'Pinned old date report differs from sealed preparation');
      const saved = dir + 'before-amendments-109-date-audit.json'; archive(saved, bytes); oldDates['109'] = JSON.parse(bytes);
      dateFiles['109'] = { file, saved, sha256: hash(bytes), canonicalExisted: false, origin: 'sealed-pinned-revision-only',
        sourceRevision: manifest.sourceRevision, currentDateApproval: false, stagedDeletionPreserved: true };
    } else dateFiles[chapter.chapter] = { file, canonicalExisted: false };
  }
  const stamp = new Date().toISOString();
  const reservation = mutateRemotePeopleWorkLedger(ledger => {
    const owner = ledger.identityReviews?.['jinshu/109'];
    need(owner?.worker === state.worker && owner.sourcePacketSha256 === state.sourcePacketSha256 &&
      owner.updatedAt === state.queueUpdatedAt && !owner.activeRun && owner.repairReview.phase === 'report-recorded', 'Shared source owner changed');
    for (const chapter of manifest.chapters) {
      const key = 'jinshu/' + chapter.chapter, date = ledger.dateAudits?.[key], identity = ledger.identityReviews?.[key];
      need(!ledger.claims[key] && (!identity || identity.worker === state.worker) && date?.worker === 'jinshu-release-dates-cursor-sdk' &&
        !date.executorToken && !dateExecutorIsBusy(date), 'Another extraction/identity/date owner is active: ' + key);
      need(Object.values(date.jobs ?? {}).every(job => job.status === 'returned' ||
        (job.status === 'interrupted' && !job.agentId && !job.runId && !job.remoteJob?.agentId && !job.remoteJob?.runId)),
        'A retained remote date handle needs terminal verification: ' + key);
      date.executorToken = token; date.executorHost = os.hostname(); date.executorExpiresAt = new Date(Date.now() + 300_000).toISOString();
      date.sourceEditorialApplication = { phase: 'applying', token, intentFile, originalStatus: date.status, dateApproval: false };
    }
    owner.sourceApplication = { phase: 'applying', token, intentFile, chapterApproved: false };
    owner.updatedAt = stamp; owner.queueUpdatedAt = stamp;
  }, { message: 'Reserve exact independently reviewed108/109 source amendments; preserve all date histories' });
  fs.writeFileSync(intentFile, JSON.stringify({ at: stamp, token, queueCommit: reservation.commit, manifest,
    oldDateFiles: dateFiles, canonicalWritesExpected: manifest.chapters.length * 3, chapterApproved: false }, null, 2) + '\n', { flag: 'wx' });
  Object.assign(state, { queueUpdatedAt: stamp, queueCommit: reservation.commit,
    sourceApplication: { phase: 'applying', token, intentFile, chapterApproved: false } });
  writeTextAtomic(stateFile, JSON.stringify(state, null, 2) + '\n');
  // Recheck after acquiring both shared ownership and the host publication lock.
  for (const chapter of manifest.chapters) for (const [kind, input] of Object.entries(chapter.inputs))
    need(hash(fs.readFileSync(root + '/' + input.path)) === input.sha256 &&
      hash(fs.readFileSync(chapter.outputs[kind].path)) === chapter.outputs[kind].sha256, 'Input/output changed after reservation');
  for (const chapter of manifest.chapters) for (const [kind, input] of Object.entries(chapter.inputs)) {
    writeTextAtomic(root + '/' + input.path, fs.readFileSync(chapter.outputs[kind].path, 'utf8')); canonicalWrites++;
  }
  const verified = [];
  for (const chapter of manifest.chapters) {
    const source = read(root + '/' + chapter.inputs.source.path), extraction = read(root + '/' + chapter.inputs.extraction.path);
    const editorial = read(root + '/' + chapter.inputs.editorial.path);
    const packet = buildPeopleExtractionPacket('jinshu', chapter.chapter, { chapterData: source,
      chapterFile: root + '/' + chapter.inputs.source.path, properNounMatcher: loadProperNounMatcher() });
    const validation = validateCompactPeopleExtraction(extraction, packet, { strictAliasDispositions: chapter.chapter === '109' });
    validateAppliedEditorialDecisions(editorial, validation.normalized);
    const date = buildDateAuditPacket('jinshu', chapter.chapter, { dataDir: root + '/data', peopleDir: root + '/data/people', extraction });
    const old = oldDates[chapter.chapter];
    need(!old || old.sourceHash !== date.sourceHash || old.extractionHash !== date.extractionHash, 'Changed source unexpectedly retained its old date fingerprints');
    verified.push({ chapter: chapter.chapter, englishRepairs: chapter.repairs, names: chapter.nameAmendments.length,
      derivedTitleClaims: chapter.derivedClaimAmendments.length, currentSourceHash: date.sourceHash,
      currentExtractionHash: date.extractionHash, oldDateReportStatus: old?.status ?? 'absent',
      oldDateReportPreserved: !old || (hash(fs.readFileSync(dateFiles[chapter.chapter].saved)) === dateFiles[chapter.chapter].sha256 &&
        (dateFiles[chapter.chapter].canonicalExisted ? hash(fs.readFileSync(dateFiles[chapter.chapter].file)) === dateFiles[chapter.chapter].sha256 : !fs.existsSync(dateFiles[chapter.chapter].file))),
      oldDateApprovalStale: Boolean(old), dateItems: date.items.length, datePeople: date.people.length,
      normalProductionValidation: true, editorialValidation: true, stats: validation.stats });
  }
  const receipt = { schemaVersion: 1, kind: 'applied-independently-reviewed-source-amendments', at: new Date().toISOString(),
    sourceRevision: manifest.sourceRevision, acceptedReviewSha256: manifest.acceptedReviewSha256, canonicalWrites,
    chapters: verified, englishRepairsApplied: verified.reduce((n, c) => n + c.englishRepairs, 0),
    preferredNameCorrections: verified.reduce((n, c) => n + c.names, 0), canonicalMerges: 0,
    oldDateFiles: dateFiles, dateApproval: false, identityApproval: false, chapterApproved: false, published: false };
  fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
  const finished = new Date().toISOString();
  const final = mutateRemotePeopleWorkLedger(ledger => {
    const owner = ledger.identityReviews['jinshu/109']; need(owner.sourceApplication?.token === token, 'Source ownership changed during application');
    for (const chapter of verified) {
      const date = ledger.dateAudits['jinshu/' + chapter.chapter]; need(date.executorToken === token, 'Date lease changed during source application');
      const priorStatus = date.sourceEditorialApplication.originalStatus;
      date.sourceEditorialApplication = { phase: 'applied', at: finished, receipt: receiptFile, sourceHash: chapter.currentSourceHash,
        extractionHash: chapter.currentExtractionHash, oldDateReportPreserved: true, requiresFreshApproval: true, originalStatus: priorStatus };
      if (chapter.chapter === '109') date.status = 'stale-source'; // Preserve108's existing research hold.
      delete date.executorToken; delete date.executorHost; delete date.executorExpiresAt;
    }
    owner.phase = 'source-reconciliation-hold'; owner.activeRun = false;
    owner.sourceApplication = { phase: 'applied', receipt: receiptFile, oldPacketDispatchForbidden: true, dateApproval: false, chapterApproved: false };
    owner.updatedAt = finished; owner.queueUpdatedAt = finished;
  }, { message: 'Record validated108/109 English/name amendments; retain original reports and require current proof reconciliation' });
  state.queueUpdatedAt = finished; state.queueCommit = final.commit; state.sourceApplication = {
    phase: 'applied', receipt: receiptFile, oldPacketDispatchForbidden: true, dateApproval: false, chapterApproved: false };
  state.repairReview.sourceApplied = true;
  writeTextAtomic(stateFile, JSON.stringify(state, null, 2) + '\n');
  need(!inspectLocalDisk(root).errors.length, 'Resource hold after source application; preserve all artifacts');
  console.log(JSON.stringify({ applied: true, canonicalWrites, englishRepairs: receipt.englishRepairsApplied,
    preferredNames: receipt.preferredNameCorrections, chapters: verified, queueCommit: final.commit, chapterApproved: false }));
} finally { release(); }
