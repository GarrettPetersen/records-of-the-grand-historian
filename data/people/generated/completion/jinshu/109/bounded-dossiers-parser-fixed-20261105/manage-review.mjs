import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { validatePreparedIdentityReviewArtifacts } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/prepare-people-chapter-identity.mjs';
import { mutateRemotePeopleWorkLedger, dateExecutorIsBusy, claimIsActive } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-work-queue.mjs';
import { inspectLocalDisk } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import { validatePart, propertySpan } from '../../093/bounded-independent-parts-eb9a-20261105/host-part-validation.mjs';
import { observeProvider } from '../../093/bounded-independent-parts-eb9a-20261105/provider-observation.mjs';

const dir = new URL('.', import.meta.url).pathname;
const host = '/Users/garrettpetersen/records-of-the-grand-historian';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const need = (ok, message) => { if (!ok) throw Error(message); };
const save = (file, value) => { fs.writeFileSync(file + '.tmp', JSON.stringify(value, null, 2) + '\n'); fs.renameSync(file + '.tmp', file); };
const state = read(dir + 'review-state.json'), receipt = read(dir + 'preparation-receipt.json');
const packet = read(dir + 'source-review-packet.json');
const prepared = { packet, receipt, plan: read(dir + 'plan.json'), transport: read(dir + 'transport-packet.json'),
  reviewParts: receipt.reviewParts.map(part => read(dir + part.file)) };
validatePreparedIdentityReviewArtifacts(prepared);
need(hash(fs.readFileSync(dir + 'source-review-packet.json')) === state.sourcePacketSha256 &&
  state.planFingerprint === prepared.plan.fingerprint && packet.plan.fingerprint === state.planFingerprint,
  'Prepared state/source changed; preserve work and reconcile');
need(state.parts.length === receipt.reviewParts.length, 'Review frontier changed');
need(!inspectLocalDisk(host).errors.length, 'Resource guard rejected review coordination');
const action = process.argv[2], number = Number(process.argv[3]), agentId = process.argv[4];
need(['claim', 'bind', 'start', 'capture', 'capture-derived', 'readable', 'repair-reserve', 'repair-start', 'repair-record', 'code-reserve', 'code-start', 'code-record', 'code-amend-reserve', 'code-amend-start', 'code-amend-record'].includes(action), 'Choose owned identity, repair or code review action');

function checkpoint() {
  const expectedUpdatedAt = state.queueUpdatedAt ?? null, stamp = new Date().toISOString();
  const result = mutateRemotePeopleWorkLedger(ledger => {
    ledger.identityReviews ??= {};
    const old = ledger.identityReviews['jinshu/109'];
    need(!old || (old.worker === state.worker && old.sourcePacketSha256 === state.sourcePacketSha256 &&
      old.planFingerprint === state.planFingerprint && old.updatedAt === expectedUpdatedAt),
      'Shared identity owner/frontier changed; recover the remote state before writing');
    const extraction = ledger.claims['jinshu/109'];
    need(!extraction || !claimIsActive(extraction), 'Current extraction ownership must be reconciled before identity review');
    const dates = ledger.dateAudits?.['jinshu/109'];
    need(!dates || !dateExecutorIsBusy(dates), 'Date owner is active; preserve its invocation');
    ledger.identityReviews['jinshu/109'] = { ...state, sticky: true, updatedAt: stamp, queueUpdatedAt: stamp,
      activeRun: state.parts.some(part => part.phase === 'running') || state.repairReview?.phase === 'running' || state.codeReview?.phase === 'running' || state.codeReviewAmendment?.phase === 'running' };
  }, { message: 'Checkpoint bounded Jinshu109 independent identity ' + action });
  state.queueUpdatedAt = stamp; state.queueCommit = result.commit;
  save(dir + 'review-state.json', state);
  return result.commit;
}

if (action.startsWith('code-')) {
  const amendment = action.startsWith('code-amend-'), field = amendment ? 'codeReviewAmendment' : 'codeReview';
  const operation = action.split('-').at(-1), prefix = amendment ? 'dossier-delta-amendment-review' : 'dossier-delta-independent-review';
  need(state.worker && state.queueUpdatedAt && agentId, 'Actual independent code reviewer and retained owner required');
  if (operation === 'reserve') {
    need(!state[field] && state.sourceApplication?.phase === 'applied' && !packet.authorAgentIds.includes(agentId) &&
      !state.parts.some(p => p.agentId === agentId) && state.repairReview?.agentId !== agentId, 'Separate code reviewer required');
    if (amendment) need(state.codeReview?.phase === 'report-recorded' && state.codeReview.verdict === 'approve' && state.codeReview.agentId === agentId,
      'Amendment must retain the actual independent parent reviewer');
    need(state.parts.filter(p => ['reserved','running'].includes(p.phase)).length +
      (['reserved','running'].includes(state.repairReview?.phase) ? 1 : 0) < 2, 'Shared remote pool is full');
    const file = dir + prefix + '-packet.json';
    state[field] = { phase: 'reserved', agentId, packetFile: file, packetSha256: hash(fs.readFileSync(file)), reservedAt: new Date().toISOString(),
      deadlineAt: new Date(Date.now() + 20 * 60_000).toISOString(), canonicalWritesAuthorized: false };
  } else if (operation === 'start') {
    need(state[field]?.phase === 'reserved' && state[field].agentId === agentId, 'Code review reservation changed');
    state[field].phase = 'running'; state[field].startedObservedAt = new Date().toISOString();
  } else {
    const review = read(dir + prefix + '.raw.json'), observed = observeProvider(p => p.id === agentId);
    need(state[field]?.phase === 'running' && state[field].agentId === agentId && review.reviewer?.agentId === agentId &&
      review.packetSha256 === state[field].packetSha256 && ['approve','request-changes'].includes(review.verdict) &&
      Array.isArray(review.findings) && (review.verdict !== 'approve' || review.findings.length === 0) && observed.lastMessageId,
      'Actual complete independent code report and producer required');
    state[field] = { ...state[field], phase: 'report-recorded', reportFile: dir + prefix + '.raw.json',
      reportSha256: hash(fs.readFileSync(dir + prefix + '.raw.json')), providerMessageId: observed.lastMessageId,
      verdict: review.verdict, findings: review.findings.length, capturedAt: new Date().toISOString() };
  }
  state.activeModelJobs = state.parts.filter(p => p.phase === 'running').length +
    (state.repairReview?.phase === 'running' ? 1 : 0) + (state.codeReview?.phase === 'running' ? 1 : 0) + (state.codeReviewAmendment?.phase === 'running' ? 1 : 0);
  console.log(JSON.stringify({ phase: state[field].phase, agentId, packetSha256: state[field].packetSha256, queueCommit: checkpoint() }));
} else if (['repair-reserve', 'repair-start', 'repair-record'].includes(action)) {
  need(state.worker && state.queueUpdatedAt && agentId, 'Actual independent editorial producer and retained ownership required');
  if (action === 'repair-reserve') {
    need(state.phase === 'source-reconciliation-hold' && !state.repairReview && !packet.authorAgentIds.includes(agentId) &&
      !state.parts.some(part => part.agentId === agentId), 'Separate independent repair reviewer required');
    need(state.parts.filter(part => ['reserved', 'running'].includes(part.phase)).length < 2, 'Shared review pool is full');
    const packetFile = dir + 'focused-english-review-packet.json';
    state.repairReview = { phase: 'reserved', agentId, packetFile, packetSha256: hash(fs.readFileSync(packetFile)),
      reservedAt: new Date().toISOString(), targetAt: new Date(Date.now() + 5 * 60_000).toISOString(),
      deadlineAt: new Date(Date.now() + 20 * 60_000).toISOString(), canonicalWritesAuthorized: false };
  } else if (action === 'repair-start') {
    need(state.repairReview?.phase === 'reserved' && state.repairReview.agentId === agentId, 'Retained editorial reservation changed');
    state.repairReview.phase = 'running'; state.repairReview.startedObservedAt = new Date().toISOString();
  } else {
    const review = read(dir + 'focused-english-accepted-review.json');
    need(state.repairReview?.phase === 'running' && state.repairReview.agentId === agentId && review.sourceApproved &&
      review.agentId === agentId && review.packetSha256 === state.repairReview.packetSha256 &&
      review.reportSha256 === hash(fs.readFileSync(dir + 'focused-english-review.raw.json')), 'Independent English approval changed');
    Object.assign(state.repairReview, { phase: 'report-recorded', sourceApproved: true, reportFile: dir + 'focused-english-review.raw.json',
      reportSha256: review.reportSha256, acceptedReviewFile: dir + 'focused-english-accepted-review.json',
      finalAmendmentRunId: review.finalAmendmentRunId, originalParentMessageIdKnown: false,
      englishRepairs: review.repairs.length, nameCorrections: review.nameCorrections.length, sourceApplied: false });
    state.sourceApplication = { phase: 'independently-reviewed-awaiting-native-preparation',
      acceptedReviewFile: state.repairReview.acceptedReviewFile, canonicalWrites: 0, dateApproval: false, chapterApproval: false };
  }
  console.log(JSON.stringify({ phase: state.repairReview.phase, agentId, packetSha256: state.repairReview.packetSha256, queueCommit: checkpoint() }));
} else if (action === 'claim') {
  need(state.phase === 'prepared-unclaimed' && !state.worker, 'Retained review ownership already exists; resume it');
  state.worker = state.proposedWorker; state.lane = 'grokbot'; state.phase = 'claimed';
  state.claimedAt = new Date().toISOString(); state.chapterApproved = false;
  console.log(JSON.stringify({ phase: state.phase, worker: state.worker, queueCommit: checkpoint() }));
} else {
  need(state.worker && state.queueUpdatedAt, 'Claim source ownership before assigning a reviewer');
  need(Number.isInteger(number) && number >= 1 && number <= state.parts.length && agentId, 'Exact part and actual producer required');
  const part = state.parts[number - 1], sealed = receipt.reviewParts[number - 1];
  need(part.file === sealed.file && part.sha256 === sealed.sha256, 'Assigned transport changed');
  const stem = 'part-' + String(number).padStart(3, '0');
  if (action === 'bind') {
    need(!['source-reconciliation-hold', 'review-hold'].includes(state.phase) && part.phase === 'unstarted', 'Reconcile retained work before a new assignment');
    need(!packet.authorAgentIds.includes(agentId) && !state.parts.some(row => row.agentId === agentId), 'Fresh independent producer required');
    need(state.parts.filter(row => ['reserved', 'running'].includes(row.phase)).length +
      (['reserved', 'running'].includes(state.repairReview?.phase) ? 1 : 0) < 2,
      'Measured shared review pool is full; preserve active assignments');
    part.agentId = agentId; part.phase = 'reserved'; part.reservedAt = new Date().toISOString();
    part.transportFile = dir + sealed.file; part.transportSha256 = sealed.sha256;
    part.targetAt = new Date(Date.now() + 5 * 60_000).toISOString();
    part.deadlineAt = new Date(Date.now() + 20 * 60_000).toISOString();
    state.phase = 'independent-review';
  } else if (action === 'start') {
    need(part.phase === 'reserved' && part.agentId === agentId, 'Unmatched source reservation');
    part.phase = 'running'; part.startedObservedAt = new Date().toISOString();
  } else if (action === 'readable') {
    need(['reserved', 'running'].includes(part.phase) && part.agentId === agentId, 'Unmatched readable display recipient');
    const displays = read(dir + 'readable-transports.json'), display = displays.parts[number - 1];
    need(displays.sourcePacketSha256 === state.sourcePacketSha256 && display.canonicalSha256 === part.sha256 &&
      display.canonicalReserializationByteEquality && hash(fs.readFileSync(dir + display.readableFile)) === display.readableSha256 &&
      Buffer.from(JSON.stringify(read(dir + display.readableFile)) + '\n').equals(fs.readFileSync(dir + part.file)),
      'Readable display is not byte-equivalent after canonical serialization');
    part.auxiliaryDisplay = { ...display, sentObservedAt: new Date().toISOString(), originalCanonicalTransportAlsoProvided: true };
  } else {
    need(part.phase === 'running' && part.agentId === agentId, 'Unmatched running source reviewer');
    const observation = observeProvider(row => row.id === agentId);
    need(observation.lastMessageId && observation.lastMessageId !== 'tbs0' && observation.lastMessageId === observation.newestEntryId,
      'Actual completed provider message not established');
    const rawFile = dir + stem + '-provider.raw.json', raw = fs.readFileSync(rawFile);
    let validationBytes = raw, editorialContextDerivation;
    if (action === 'capture-derived') {
      const file = dir + stem + '-editorial-context-derivation.json', derivation = read(file);
      validationBytes = fs.readFileSync(dir + stem + '-editorial-context-envelope.json');
      need(derivation.providerMessageSha256 === hash(raw) && derivation.contextEnvelopeSha256 === hash(validationBytes) &&
        derivation.identityReportBytesUnchanged && derivation.sourcePacketSha256 === state.sourcePacketSha256 &&
        propertySpan(raw.toString('utf8'), 'identityReport').bytes.equals(propertySpan(validationBytes.toString('utf8'), 'identityReport').bytes),
        'Host context derivation changed independent review bytes');
      editorialContextDerivation = { file, sha256: hash(fs.readFileSync(file)) };
    }
    const result = validatePart(validationBytes, number - 1, agentId, dir);
    const reportFile = dir + stem + '-report.json';
    fs.writeFileSync(reportFile, result.reportBytes, { flag: 'wx' });
    const capture = { schemaVersion: 1, kind: 'captured-independent-identity-review-part', phase: 'report-recorded',
      scope: state.scope, agentId, runId: observation.lastMessageId, providerKind: 'grokbot', providerConversationId: agentId,
      providerMessageId: observation.lastMessageId, providerCompletedAt: new Date(observation.lastActivityAt).toISOString(),
      providerObservation: observation, capturedAt: new Date().toISOString(), sourcePacketSha256: state.sourcePacketSha256,
      transportFile: part.transportFile, transportSha256: part.transportSha256, reportFile, reportSha256: hash(result.reportBytes),
      providerMessageFile: rawFile, providerMessageSha256: hash(raw), approvedCases: result.approved, holds: result.holds,
      editorialRepairs: result.repairs, chapterApproved: false,
      ...(part.auxiliaryDisplay ? { auxiliaryDisplay: part.auxiliaryDisplay } : {}),
      ...(editorialContextDerivation ? { editorialContextDerivation } : {}) };
    fs.writeFileSync(dir + stem + '-capture.json', JSON.stringify(capture, null, 2) + '\n', { flag: 'wx' });
    Object.assign(part, capture);
    state.independentCasesReviewed = state.parts.reduce((sum, row) => sum + (row.approvedCases ?? 0) + (row.holds?.length ?? 0), 0);
    state.approvedCases = state.parts.reduce((sum, row) => sum + (row.approvedCases ?? 0), 0);
    state.heldCases = state.parts.reduce((sum, row) => sum + (row.holds?.length ?? 0), 0);
    if (result.holds.length || result.repairs.length) state.phase = 'source-reconciliation-hold';
  }
  console.log(JSON.stringify({ phase: state.phase, number, partPhase: part.phase, agentId, queueCommit: checkpoint(),
    approvedCases: state.approvedCases ?? 0, heldCases: state.heldCases ?? 0 }));
}
