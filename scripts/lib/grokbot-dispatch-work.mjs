import fs from 'node:fs';
import { createHash } from 'node:crypto';

export const inputFingerprint = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };

export function dispatchMcpEnvironment(envFile, inherited = process.env) {
  let token;
  if (Object.hasOwn(inherited, 'GROKBOT_MCP_AUTH_TOKEN')) token = inherited.GROKBOT_MCP_AUTH_TOKEN;
  else {
    const stat = fs.lstatSync(envFile);
    requireValue(stat.isFile() && !stat.isSymbolicLink() && (stat.mode & 0o077) === 0, 'MCP dotenv must be an owner-only regular file');
    requireValue(stat.size <= 64 * 1024, 'MCP dotenv exceeds 64 KiB');
    const values = fs.readFileSync(envFile, 'utf8').split(/\r?\n/).map(line => /^\s*GROKBOT_MCP_AUTH_TOKEN\s*=\s*(.*?)\s*$/.exec(line)).filter(Boolean);
    requireValue(values.length === 1, 'MCP dotenv must contain exactly one GROKBOT_MCP_AUTH_TOKEN assignment');
    token = values[0][1];
    if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) token = token.slice(1, -1);
  }
  requireValue(typeof token === 'string' && token.length > 0 && !/\s/.test(token), 'Missing or malformed MCP bearer credential');
  return { ...inherited, GROKBOT_MCP_AUTH_TOKEN: token,
    GROKBOT_MCP_URL: 'https://grokbot-mcp.24histories.com/mcp', GROKBOT_MCP_REQUEST_TIMEOUT_MS: '10000' };
}

export function validateDispatchJobs(document, now = Date.now()) {
  requireValue(document?.schemaVersion === 1 && Array.isArray(document.jobs), 'Invalid GrokBot work manifest');
  const ids = new Set(), workers = new Set();
  for (const job of document.jobs) {
    requireValue(/^[a-z0-9][a-z0-9-]{0,100}$/.test(job.id ?? '') && !ids.has(job.id), 'Invalid or duplicate dispatch job ID');
    requireValue(/^grokbot-(?:2[4-9]|3[0-5])$/.test(job.worker ?? '') && !workers.has(job.worker), 'Invalid or duplicate assigned worker');
    requireValue(/^[a-z0-9_-]+$/.test(job.book ?? '') && /^\d{3}$/.test(job.chapter ?? ''), 'Invalid assigned chapter');
    requireValue(job.kind === undefined || ['extraction','sealed-review'].includes(job.kind), 'Invalid assigned work kind');
    if(job.kind === 'sealed-review')requireValue(/^[a-z0-9][a-z0-9-]{0,63}$/.test(job.reviewJob ?? '') && job.chunks?.length === 1 && job.chunks[0].id === 'review', 'Sealed review requires its exact reviewJob and review chunk');
    else requireValue(job.reviewJob === undefined, 'Extraction ticket cannot name a review job');
    requireValue(typeof job.claimToken === 'string' && job.claimToken.length >= 20 && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(job.claimToken), 'Missing scoped assignment token');
    const attempt = job.attempt ?? 1;
    requireValue(Number.isSafeInteger(attempt) && attempt >= 1, 'Invalid dispatch attempt');
    if (attempt > 1) requireValue(typeof job.retryOf === 'string' && typeof job.retryReason === 'string' && job.retryReason.trim().length >= 10, 'A retry requires the previous job ID and an operator reconciliation reason');
    const issued = Date.parse(job.issuedAt), expires = Date.parse(job.expiresAt);
    requireValue(Number.isFinite(issued) && Number.isFinite(expires) && issued <= now && expires > issued && expires - issued <= 3600000, 'Invalid dispatch ticket lifetime (maximum one hour)');
    requireValue(Array.isArray(job.chunks) && job.chunks.length > 0, 'Dispatch requires actual sealed chunk work');
    const chunks = new Set();
    for (const chunk of job.chunks) {
      requireValue(/^[a-zA-Z0-9_-]{1,32}$/.test(chunk.id ?? '') && !chunks.has(chunk.id), 'Invalid or duplicate assigned chunk');
      for (const field of ['packetFingerprint', 'draftFingerprint']) requireValue(/^[a-f0-9]{64}$/.test(chunk[field] ?? ''), 'Missing sealed input fingerprint');
      chunks.add(chunk.id);
    }
    ids.add(job.id); workers.add(job.worker);
  }
  return document.jobs.filter(job => Date.parse(job.expiresAt) > now);
}

export function readDispatchJobs(file, now = Date.now()) {
  let stat;
  try { stat = fs.lstatSync(file); } catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  requireValue(stat.isFile() && !stat.isSymbolicLink() && (stat.mode & 0o077) === 0, 'Work manifest must be an owner-only regular file (0600)');
  requireValue(stat.size <= 256 * 1024, 'Work manifest exceeds 256 KiB');
  return validateDispatchJobs(JSON.parse(fs.readFileSync(file, 'utf8')), now);
}

export function dispatchJobKey(job) {
  // The same sealed work is not new work merely because its ticket ID/expiry changed.
  const chunks = job.chunks.map(({ id, packetFingerprint, draftFingerprint }) => ({ id, packetFingerprint, draftFingerprint })).sort((a, b) => a.id.localeCompare(b.id));
  return inputFingerprint({ worker: job.worker, book: job.book, chapter: job.chapter, ...(job.kind === 'sealed-review' ? {kind:job.kind,reviewJob:job.reviewJob} : {}), chunks });
}

export async function verifyDispatchWork(job, callMcp, { assertSafe = () => {}, now = Date.now, reviewerAgentId } = {}) {
  const status = await callMcp('status', { worker: job.worker });
  requireValue(status?.worker === job.worker && Array.isArray(status.claims), 'Invalid MCP worker status');
  const target = `${job.book}/${job.chapter}`;
  const current = status.claims.filter(claim => claim.status === 'claimed');
  requireValue(current.length <= 1, 'Multiple active claims require operator reconciliation');
  if(job.kind === 'sealed-review'){
    requireValue(!status.reviewsError,'MCP review store requires host reconciliation: '+(status.reviewsError?.message??''));
    requireValue(Array.isArray(status.reviews),'MCP does not support sealed review jobs');
    const pending=status.reviews.filter(r=>r.status==='pending-review');
    requireValue(pending.length<=1,'Multiple pending reviews require host reconciliation');
    if(current.length||pending.length!==1||pending[0].id!==job.reviewJob||pending[0].book!==job.book||pending[0].chapter!==job.chapter)return false;
    requireValue(typeof reviewerAgentId==='string'&&reviewerAgentId.length>5&&pending[0].reviewerAgentId===reviewerAgentId,'Sealed reviewer does not match the actual roster agent receiving this job');
  }else if (current.length === 0 || current[0].chapter !== target) return false;
  for (const chunk of job.chunks) {
    assertSafe();
    if (Date.parse(job.expiresAt) <= now()) return false;
    const sealed = await callMcp('get-chunk', { 'claim-token': job.claimToken, 'chunk-id': chunk.id });
    requireValue(sealed?.worker === job.worker && sealed.book === job.book && sealed.chapter === job.chapter && sealed.chunkId === chunk.id, 'MCP returned a different assignment');
    requireValue(typeof sealed.prompt === 'string' && sealed.prompt.length > 0 && sealed.schema && typeof sealed.schema === 'object', 'Missing sealed prompt/schema');
    if(job.kind === 'sealed-review')requireValue(sealed.mode==='sealed-review'&&sealed.reviewJob===job.reviewJob&&sealed.packet&&typeof sealed.packet==='object'&&!Array.isArray(sealed.packet)&&Object.keys(sealed.packet).length>0&&sealed.draft&&typeof sealed.draft==='object','Missing/different sealed review packet/draft');
    else requireValue(Array.isArray(sealed.packet?.units) && sealed.packet.units.length > 0 && sealed.draft && typeof sealed.draft === 'object', 'Missing sealed packet/draft work');
    if (inputFingerprint(sealed.packet) !== chunk.packetFingerprint || inputFingerprint(sealed.draft) !== chunk.draftFingerprint) return false;
  }
  return true;
}

export function pendingDispatchJobs(jobs, state) {
  requireValue(state && typeof state === 'object' && !Array.isArray(state), 'Invalid dispatch state');
  if (state.dispatchJobs !== undefined) requireValue(state.dispatchJobs && typeof state.dispatchJobs === 'object' && !Array.isArray(state.dispatchJobs), 'Invalid dispatch receipts');
  for (const [key, receipt] of Object.entries(state.dispatchJobs ?? {})) requireValue(/^[a-f0-9]{64}$/.test(key) && receipt && typeof receipt.jobId === 'string' && ['dispatching', 'dispatched', 'not-dispatchable'].includes(receipt.status) && Number.isSafeInteger(receipt.attempt) && receipt.attempt >= 1 && (receipt.history === undefined || Array.isArray(receipt.history)), 'Invalid saved dispatch receipt; reconcile without deleting recovery');
  return jobs.filter(job => {
    const previous = state.dispatchJobs?.[dispatchJobKey(job)], attempt = job.attempt ?? 1;
    if (previous && attempt <= previous.attempt) return false;
    if (previous) requireValue(attempt === previous.attempt + 1 && job.retryOf === previous.jobId && typeof job.retryReason === 'string' && job.retryReason.trim().length >= 10, 'Retry must explicitly reconcile the prior dispatch');
    else requireValue(attempt === 1, 'Retry has no preserved predecessor receipt');
    return true;
  });
}

export async function dispatchApprovedWork(jobs, state, { callMcp, assertSafe, wake, save, now = Date.now, reviewerAgentForWorker, prepareWake }) {
  pendingDispatchJobs([], state);
  state.dispatchJobs ??= {};
  let dispatched = 0;
  for (const job of jobs) {
    if (Date.parse(job.expiresAt) <= now()) continue;
    const key = dispatchJobKey(job);
    const previous = state.dispatchJobs[key], attempt = job.attempt ?? 1;
    if (!pendingDispatchJobs([job], state).length) continue;
    const reviewerAgentId=job.kind==='sealed-review'?reviewerAgentForWorker?.(job.worker):undefined;
    const receipt = status => {
      const { history = [], ...prior } = previous ?? {};
      return { jobId: job.id, ...(job.kind==='sealed-review'?{kind:job.kind,reviewJob:job.reviewJob,reviewerAgentId}:{}), worker: job.worker, chapter: `${job.book}/${job.chapter}`, status, at: now(), attempt,
        ...(previous ? { history: [...history, prior], retryReason: job.retryReason } : {}) };
    };
    assertSafe();
    if (!await verifyDispatchWork(job, callMcp, { assertSafe, now, reviewerAgentId })) {
      state.dispatchJobs[key] = receipt('not-dispatchable');
      save(state);
      continue;
    }
    if(job.kind==='sealed-review')requireValue(typeof prepareWake==='function','Sealed review requires an explicit pre-send readiness check');
    if(prepareWake)await prepareWake(job);
    // Recheck resources/expiry after network and readiness reads, immediately before waking the worker.
    assertSafe();
    if (Date.parse(job.expiresAt) <= now()) continue;
    // Reserve BEFORE sending: an uncertain UI/network result must not be auto-retried.
    state.dispatchJobs[key] = receipt('dispatching');
    save(state);
    await wake(job);
    state.dispatchJobs[key].status = 'dispatched';
    save(state);
    dispatched += 1;
  }
  return dispatched;
}
