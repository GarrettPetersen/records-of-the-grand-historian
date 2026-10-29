import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  assembleGrokbotOutput,
  claimGrokbot,
  defaultGrokbotOptions,
  readGrokbotAssignment,
  resumeGrokbot,
  saveGrokbotExtractionData,
  validateGrokbotOutput,
} from '../people-work-queue.mjs';
import {
  chapterKey,
  claimIsActive,
  fetchPeopleQueueBase,
  markRemotePeopleClaims,
  readRemotePeopleWorkLedger,
} from './people-work-queue.mjs';
import { REPO_ROOT, readJson } from './people-content.mjs';
import {GrokbotReviewStore,reviewFingerprint} from './grokbot-review-store.mjs';

const WORKER_PATTERN = /^grokbot-[a-z0-9][a-z0-9-]{0,47}$/u;
const BOOK_PATTERN = /^[a-z0-9_-]+$/u;
const CHAPTER_PATTERN = /^\d{3}$/u;
const LEDGER_CACHE_MS = 30_000;

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function requireWorker(worker) {
  if (!WORKER_PATTERN.test(worker)) {
    throw new Error('worker must match grokbot-[a-z0-9][a-z0-9-]{0,47}');
  }
  return worker;
}

function requireTarget({ book, chapter }) {
  if (!BOOK_PATTERN.test(book) || !CHAPTER_PATTERN.test(chapter)) {
    throw new Error('Invalid book/chapter target');
  }
  return { book, chapter };
}

function encodeTokenPart(value) {
  return Buffer.from(value).toString('base64url');
}

function decodeTokenPart(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signature(secret, encodedPayload) {
  return createHmac('sha256', secret).update(encodedPayload).digest();
}

function makeClaimToken(secret, payload) {
  const encoded = encodeTokenPart(JSON.stringify(payload));
  return `${encoded}.${signature(secret, encoded).toString('base64url')}`;
}

function parseClaimToken(secret, token) {
  const [encoded, encodedSignature, extra] = String(token).split('.');
  if (!encoded || !encodedSignature || extra) throw new Error('Malformed claim token');
  const supplied = Buffer.from(encodedSignature, 'base64url');
  const expected = signature(secret, encoded);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    throw new Error('Invalid claim token signature');
  }
  let payload;
  try {
    payload = JSON.parse(decodeTokenPart(encoded));
  } catch {
    throw new Error('Invalid claim token payload');
  }
  if (payload?.version !== 1) throw new Error('Unsupported claim token version');
  requireWorker(payload.worker);
  requireTarget(payload);
  return payload;
}

function queueOptions(opts) {
  return { remote: opts.remote, branch: opts.queueBranch, baseRef: opts.baseRef };
}

function claimPlanHash(claim) {
  if (!claim.grokbotPlan) {
    throw new Error('The Grok Bot claim has no persisted sealed chunk plan; run people:grokbot:backfill-plans');
  }
  return sha256(JSON.stringify(claim.grokbotPlan));
}

function claimPayload(worker, target, claim) {
  return {
    version: 1,
    worker,
    book: target.book,
    chapter: target.chapter,
    chapterFingerprint: claim.chapterFingerprint,
    planHash: claimPlanHash(claim),
  };
}

function assignmentSummary(assignment, claimToken) {
  return {
    worker: assignment.worker,
    book: assignment.book,
    chapter: assignment.chapter,
    mode: assignment.mode,
    claimToken,
    chunks: assignment.chunks.map(({ id, start, end }) => ({
      id,
      ...(start === undefined ? {} : { start, end }),
    })),
    instructions: 'Call get_chunk for one chunk at a time, then submit_chunk. Call finalize_chapter only after every chunk is accepted.',
  };
}

function persistedAssignmentForClaim(worker, target, claim) {
  let assignment;
  try {
    assignment = readGrokbotAssignment(worker, target);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Missing Grok Bot assignment:')) return null;
    throw error;
  }
  if (
    assignment.worker !== worker || assignment.book !== target.book || assignment.chapter !== target.chapter ||
    !claim.grokbotPlan || !Array.isArray(assignment.chunks) ||
    assignment.chunks.length !== claim.grokbotPlan.chunks.length
  ) {
    throw new Error(`Persisted Grok Bot assignment does not match the live claim for ${chapterKey(target)}`);
  }
  for (let index = 0; index < assignment.chunks.length; index += 1) {
    const saved = assignment.chunks[index];
    const planned = claim.grokbotPlan.chunks[index];
    if (
      saved.id !== planned.id ||
      (assignment.mode === 'chunked' && (saved.start !== planned.start || saved.end !== planned.end)) ||
      typeof saved.packet !== 'string' || typeof saved.output !== 'string' ||
      !fs.existsSync(fileFromRepo(saved.packet)) || !fs.existsSync(fileFromRepo(saved.output))
    ) {
      throw new Error(`Persisted Grok Bot assignment is incomplete or stale for ${chapterKey(target)}`);
    }
  }
  return assignment;
}

function fileFromRepo(relative) {
  const absolute = path.resolve(REPO_ROOT, relative);
  const prefix = `${REPO_ROOT}${path.sep}`;
  if (!absolute.startsWith(prefix)) throw new Error(`Path escapes repository: ${relative}`);
  return absolute;
}

function jsonResult(value) {
  return JSON.parse(JSON.stringify(value));
}

export class GitHubPublisher {
  constructor({ token, repository, baseBranch }) {
    this.token = token;
    this.repository = repository;
    this.baseBranch = baseBranch;
    const [owner, repo, extra] = String(repository ?? '').split('/');
    if (!owner || !repo || extra) throw new Error('GITHUB_REPOSITORY must be owner/repository');
    this.owner = owner;
  }

  async request(method, route, body, { allow404 = false } = {}) {
    const response = await fetch(`https://api.github.com/repos/${this.repository}${route}`, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'User-Agent': '24histories-grokbot-mcp',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (allow404 && response.status === 404) return null;
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      throw new Error(`GitHub ${method} ${route} failed (${response.status}): ${data?.message ?? text}`);
    }
    return data;
  }

  async ref(branch) {
    return this.request('GET', `/git/ref/heads/${branch}`, undefined, { allow404: true });
  }

  async branchContains(branch, file, bytes) {
    const current = await this.request(
      'GET',
      `/contents/${file}?ref=${encodeURIComponent(branch)}`,
      undefined,
      { allow404: true },
    );
    if (!current?.content) return false;
    return Buffer.from(current.content.replace(/\s+/gu, ''), 'base64').equals(bytes);
  }

  async ensureBranchFile(branch, file, bytes, message) {
    let branchRef = await this.ref(branch);
    if (branchRef && await this.branchContains(branch, file, bytes)) return branchRef.object.sha;
    const parent = branchRef ?? await this.ref(this.baseBranch);
    if (!parent) throw new Error(`GitHub staging branch is missing: ${this.baseBranch}`);
    const parentCommit = await this.request('GET', `/git/commits/${parent.object.sha}`);
    const blob = await this.request('POST', '/git/blobs', {
      content: bytes.toString('base64'),
      encoding: 'base64',
    });
    const tree = await this.request('POST', '/git/trees', {
      base_tree: parentCommit.tree.sha,
      tree: [{ path: file, mode: '100644', type: 'blob', sha: blob.sha }],
    });
    const commit = await this.request('POST', '/git/commits', {
      message,
      tree: tree.sha,
      parents: [parent.object.sha],
    });
    if (branchRef) {
      await this.request('PATCH', `/git/refs/heads/${branch}`, { sha: commit.sha, force: false });
    } else {
      await this.request('POST', '/git/refs', { ref: `refs/heads/${branch}`, sha: commit.sha });
    }
    return commit.sha;
  }

  async ensurePullRequest(branch, title, body) {
    const query = new URLSearchParams({
      state: 'open',
      head: `${this.owner}:${branch}`,
      base: this.baseBranch,
    });
    const existing = await this.request('GET', `/pulls?${query}`);
    if (existing.length) return existing[0].html_url;
    const created = await this.request('POST', '/pulls', {
      title,
      head: branch,
      base: this.baseBranch,
      body,
    });
    return created.html_url;
  }

  async publish({ branch, file, bytes, title, body, message }) {
    const commit = await this.ensureBranchFile(branch, file, bytes, message);
    const prUrl = await this.ensurePullRequest(branch, title, body);
    return { commit, prUrl };
  }
}

export class GrokbotMcpBridge {
  constructor({ claimSecret, githubToken, githubRepository, options = {}, publisher, reviewStore } = {}) {
    if (!claimSecret || claimSecret.length < 32) {
      throw new Error('GROKBOT_MCP_CLAIM_SECRET must contain at least 32 characters');
    }
    this.claimSecret = claimSecret;
    this.reviewStore = reviewStore ?? new GrokbotReviewStore(path.join(REPO_ROOT,'data/people/generated/grokbot/review-jobs'));
    this.options = defaultGrokbotOptions(options);
    this.ledgerCache = null;
    this.publisher = publisher ?? (githubToken && githubRepository
      ? new GitHubPublisher({
          token: githubToken,
          repository: githubRepository,
          baseBranch: this.options.stagingBranch,
        })
      : null);
  }

  currentLedger({ fresh = false, includeBase = true } = {}) {
    if (!fresh && this.ledgerCache && Date.now() - this.ledgerCache.loadedAt < LEDGER_CACHE_MS) {
      return this.ledgerCache.value;
    }
    if (includeBase) fetchPeopleQueueBase(queueOptions(this.options));
    const value = readRemotePeopleWorkLedger(queueOptions(this.options));
    this.ledgerCache = { loadedAt: Date.now(), value };
    return value;
  }

  invalidateLedger() {
    this.ledgerCache = null;
  }

  currentClaim(worker, { fresh = false } = {}) {
    const rows = Object.entries(this.currentLedger({ fresh }).claims)
      .filter(([, claim]) =>
        claim.lane === 'grokbot' && claim.worker === worker && claim.status === 'claimed')
      .map(([key, claim]) => ({ target: requireTarget({
        book: key.split('/')[0],
        chapter: key.split('/')[1],
      }), claim }));
    if (rows.length > 1) throw new Error(`${worker} owns multiple claimed chapters; operator reconciliation is required`);
    return rows[0] ?? null;
  }

  verifiedClaim(token, allowedStatuses = ['claimed'], { fresh = false } = {}) {
    const payload = parseClaimToken(this.claimSecret, token);
    const target = requireTarget(payload);
    const claim = this.currentLedger({ fresh }).claims[chapterKey(target)];
    if (!claimIsActive(claim) || claim.lane !== 'grokbot' || claim.worker !== payload.worker) {
      throw new Error('The claim token no longer names an active Grok Bot assignment');
    }
    if (!allowedStatuses.includes(claim.status)) {
      throw new Error(`Claim is ${claim.status}; expected ${allowedStatuses.join(' or ')}`);
    }
    if (
      claim.chapterFingerprint !== payload.chapterFingerprint ||
      claimPlanHash(claim) !== payload.planHash
    ) {
      throw new Error('The chapter fingerprint or sealed chunk plan changed after token issuance');
    }
    return { payload, target, claim };
  }

  reviewClaim(claimToken) {
    const payload=parseClaimToken(this.claimSecret,claimToken);
    if(payload.kind!=='sealed-review')return null;
    if(this.currentClaim(payload.worker,{fresh:true}))throw new Error('Sticky extraction owns this worker; preserve the review and resume extraction first');
    const job=this.reviewStore.read(payload.worker,payload.reviewJob);
    if(payload.jobSha256!==reviewFingerprint(job)||payload.book!==job.book||payload.chapter!==job.chapter)throw new Error('Review job changed after token issuance');
    return {payload,job};
  }

  async resumeOrClaim({ worker, book, chapter, reviewJob }) {
    requireWorker(worker);
    if ((book && !chapter) || (!book && chapter)) throw new Error('book and chapter must be supplied together');
    if (book) requireTarget({ book, chapter });
    // Claiming must read the live ledger. A cached pre-claim snapshot would
    // otherwise recreate a preserved assignment as if it were fresh.
    const existing = this.currentClaim(worker, { fresh: true });
    if(reviewJob!==undefined){
      if(existing)throw new Error('Resume existing sticky extraction before scheduling a review');
      const job=this.reviewStore.read(worker,reviewJob);
      if(book&&(book!==job.book||chapter!==job.chapter))throw new Error('Review job scope mismatch');
      const status=this.reviewStore.list(worker).find(r=>r.id===reviewJob).status;
      const token=makeClaimToken(this.claimSecret,{version:1,kind:'sealed-review',worker,book:job.book,chapter:job.chapter,reviewJob:job.id,jobSha256:reviewFingerprint(job)});
      return {worker,book:job.book,chapter:job.chapter,mode:'sealed-review',kind:job.kind,reviewJob:job.id,status,claimToken:token,chunks:status==='pending-review'?[{id:'review'}]:[],qualityApproved:false,published:false};
    }
    if(!existing&&this.reviewStore.list(worker).some(job=>job.status==='pending-review'))throw new Error('Resume the host-prepared reviewJob before creating extraction work');
    let prepared;
    let claim;
    if (existing) {
      if (book && (book !== existing.target.book || chapter !== existing.target.chapter)) {
        throw new Error(`${worker} must resume ${chapterKey(existing.target)} before claiming ${book}/${chapter}`);
      }
      claim = existing.claim;
      const persisted = persistedAssignmentForClaim(worker, existing.target, claim);
      prepared = persisted
        ? { assignment: persisted }
        : resumeGrokbot(defaultGrokbotOptions({ ...this.options, worker, ...existing.target }));
    } else {
      const claimed = await claimGrokbot(defaultGrokbotOptions({
        ...this.options,
        worker,
        ...(book ? { book, chapter } : {}),
      }));
      prepared = claimed[0];
      claim = prepared.claim;
    }
    const target = { book: prepared.assignment.book, chapter: prepared.assignment.chapter };
    if (!claim) throw new Error(`Missing atomic Grok Bot claim for ${chapterKey(target)}`);
    const token = makeClaimToken(this.claimSecret, claimPayload(worker, target, claim));
    return assignmentSummary(prepared.assignment, token);
  }

  getChunk({ claimToken, chunkId }) {
    const review=this.reviewClaim(claimToken);
    if(review){
      if(chunkId!=='review')throw new Error('Unknown sealed review chunk');
      const {job}=review;
      return {worker:job.worker,book:job.book,chapter:job.chapter,mode:'sealed-review',kind:job.kind,reviewJob:job.id,chunkId,prompt:job.prompt,
        packet:job.packet,draft:job.draft,schema:{type:'object',additionalProperties:false,required:['schemaVersion','jobId','packetSha256','reviewer','result'],properties:{schemaVersion:{const:1},jobId:{const:job.id},packetSha256:{const:reviewFingerprint(job.packet)},reviewer:{type:'object',additionalProperties:false,required:['agentId','name'],properties:{agentId:{const:job.reviewerAgentId},name:{type:'string',minLength:1}}},result:job.reportSchema}},
        instructions:'Return the complete review envelope with submit_chunk report. This stores an artifact only. Host validation and independent editorial/date/identity/publication gates remain required.'};
    }
    const { payload, target } = this.verifiedClaim(claimToken);
    const assignment = readGrokbotAssignment(payload.worker, target);
    const chunk = assignment.chunks.find((row) => row.id === chunkId);
    if (!chunk) throw new Error(`Unknown sealed chunk: ${chunkId}`);
    return {
      worker: payload.worker,
      book: target.book,
      chapter: target.chapter,
      mode: assignment.mode,
      chunkId,
      prompt: fs.readFileSync(fileFromRepo(assignment.prompt), 'utf8'),
      schema: readJson(fileFromRepo(assignment.schema)),
      packet: readJson(fileFromRepo(chunk.packet)),
      draft: readJson(fileFromRepo(chunk.output)),
      instructions: 'Complete the draft from this packet only. Submit the entire extraction object with submit_chunk.',
    };
  }

  submitChunk({ claimToken, chunkId, extraction, report }) {
    const review=this.reviewClaim(claimToken);
    if(review){
      if(chunkId!=='review'||extraction!==undefined||report===undefined)throw new Error('Sealed reviews require only a report and the review chunk');
      return this.reviewStore.submit(review.job,report);
    }
    if(report!==undefined||extraction===undefined)throw new Error('Extraction assignments require only an extraction');
    const { payload, target } = this.verifiedClaim(claimToken);
    const assignment = readGrokbotAssignment(payload.worker, target);
    const chunk = assignment.chunks.find((row) => row.id === chunkId);
    if (!chunk) throw new Error(`Unknown sealed chunk: ${chunkId}`);
    const options = {
      worker: payload.worker,
      ...(assignment.mode === 'chunked' ? { chunkId } : {}),
    };
    const saved = saveGrokbotExtractionData(target, options, extraction);
    return {
      accepted: true,
      worker: payload.worker,
      book: target.book,
      chapter: target.chapter,
      chunkId,
      stats: saved.validated.stats,
      sha256: sha256(fs.readFileSync(saved.output)),
      next: 'Submit the next sealed chunk, or call finalize_chapter after every chunk has been accepted.',
    };
  }

  async finalizeChapter({ claimToken }) {
    const review=this.reviewClaim(claimToken);
    if(review)return this.reviewStore.receipt(review.job,this.reviewStore.savedResult(review.job));
    const verified = this.verifiedClaim(claimToken, ['claimed', 'submitted'], { fresh: true });
    if (verified.claim.status === 'submitted') {
      return {
        submitted: true,
        book: verified.target.book,
        chapter: verified.target.chapter,
        prUrl: verified.claim.prUrl ?? null,
        note: 'This chapter was already submitted.',
      };
    }
    if (!this.publisher) {
      throw new Error('GitHub publishing is not configured; set GITHUB_TOKEN and GITHUB_REPOSITORY');
    }
    const assignment = readGrokbotAssignment(verified.payload.worker, verified.target);
    const completed = assignment.mode === 'chunked'
      ? assembleGrokbotOutput(verified.target, { ...this.options, worker: verified.payload.worker })
      : validateGrokbotOutput(verified.target, { worker: verified.payload.worker });
    const bytes = fs.readFileSync(completed.output);
    const relativeOutput = path.relative(REPO_ROOT, completed.output);
    const published = await this.publisher.publish({
      branch: assignment.branch,
      file: relativeOutput,
      bytes,
      title: `People glossary: ${verified.target.book} ${verified.target.chapter}`,
      body: `Grok Bot MCP extraction for \`${chapterKey(verified.target)}\`.\n\nValidated server-side against the current sealed packet.`,
      message: `Extract people from ${verified.target.book} ${verified.target.chapter}`,
    });
    markRemotePeopleClaims([verified.target], 'submitted', {
      ...queueOptions(this.options),
      lane: 'grokbot',
      worker: verified.payload.worker,
      branchName: assignment.branch,
      prUrl: published.prUrl,
      note: `${completed.validated.stats.people} people, ${completed.validated.stats.mentions} mentions, ` +
        `${completed.validated.stats.claims} claims; sha256 ${sha256(bytes)}`,
    });
    this.invalidateLedger();
    return {
      submitted: true,
      worker: verified.payload.worker,
      book: verified.target.book,
      chapter: verified.target.chapter,
      stats: completed.validated.stats,
      sha256: sha256(bytes),
      commit: published.commit,
      prUrl: published.prUrl,
    };
  }

  status({ worker }) {
    requireWorker(worker);
    const claims = Object.entries(this.currentLedger().claims)
      .filter(([, claim]) => claim.lane === 'grokbot' && claim.worker === worker)
      .map(([key, claim]) => ({ chapter: key, status: claim.status, prUrl: claim.prUrl ?? null }));
    let reviews, reviewsError;
    try{reviews=this.reviewStore.list(worker);}catch(error){reviews=[];reviewsError={code:'review-store-invalid',message:error instanceof Error?error.message:String(error)};}
    return jsonResult({worker,claims,reviews,...(reviewsError?{reviewsError}:{})});
  }
}

export const grokbotMcpTokenInternals = {
  makeClaimToken,
  parseClaimToken,
};
