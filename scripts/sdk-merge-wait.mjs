#!/usr/bin/env node
/**
 * Wait until a cloud agent's translation work is merged to master before the next session.
 */
import { exec, execSync } from 'node:child_process';
import { promisify } from 'node:util';
import { REPO_ROOT } from './sdk-translation-books.mjs';

const execAsync = promisify(exec);

/**
 * @param {string} command
 * @param {{ maxBuffer?: number }} [opts]
 */
async function execGit(command, opts = {}) {
  const { stdout } = await execAsync(command, {
    cwd: REPO_ROOT,
    maxBuffer: opts.maxBuffer ?? 50 * 1024 * 1024,
    encoding: 'utf8',
  });
  return stdout;
}

/**
 * @param {string} repoUrl
 */
export function parseGitHubRepo(repoUrl) {
  const m = repoUrl.replace(/\.git$/, '').match(/github\.com[/:]([^/]+)\/([^/]+)/);
  if (!m) throw new Error(`Cannot parse GitHub repo from: ${repoUrl}`);
  return { owner: m[1], repo: m[2] };
}

/**
 * @param {string} ref e.g. origin/master
 * @param {string} book
 * @param {{ includeRed?: boolean }} [opts]
 * @returns {Set<string>} chapter ids still needing work on ref
 */
export function incompleteChaptersOnGitRef(ref, book, opts = {}) {
  let raw;
  try {
    raw = execSync(`git show "${ref}:data/progress.json"`, {
      encoding: 'utf8',
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return incompleteChaptersFromDataFiles(ref, book);
  }

  const progress = JSON.parse(raw);
  const bookData = progress.books?.[book];
  if (!bookData?.chapters) return new Set();

  const incomplete = new Set();
  for (const ch of bookData.chapters) {
    const needs =
      ch.status === 'gray' ||
      ch.status === 'yellow' ||
      (opts.includeRed && ch.status === 'red');
    if (needs) incomplete.add(ch.chapter);
  }
  return incomplete;
}

/**
 * @param {string} ref
 * @param {string} book
 */
function incompleteChaptersFromDataFiles(ref, book) {
  let listing;
  try {
    listing = execSync(`git ls-tree --name-only "${ref}:data/${book}"`, {
      encoding: 'utf8',
      cwd: REPO_ROOT,
    })
      .trim()
      .split('\n')
      .filter((f) => f.endsWith('.json'));
  } catch {
    return new Set();
  }

  const incomplete = new Set();
  for (const file of listing) {
    const chapter = file.replace(/\.json$/, '');
    try {
      const json = execSync(`git show "${ref}:data/${book}/${file}"`, {
        encoding: 'utf8',
        cwd: REPO_ROOT,
        maxBuffer: 50 * 1024 * 1024,
      });
      const data = JSON.parse(json);
      let t = 0;
      let m = 0;
      for (const block of data.content ?? []) {
        const rows = block.type === 'table_row' ? (block.cells ?? []) : (block.sentences ?? []);
        for (const s of rows) {
          const tr = s.translations?.[0]?.translator ?? s.translator;
          if (tr === 'Herbert J. Allen (1894)') continue;
          const zh = (s.zh ?? s.content ?? '').trim();
          if (!zh) continue;
          t++;
          const idio = s.translations?.[0]?.idiomatic ?? s.idiomatic ?? '';
          if (idio.trim()) m++;
        }
      }
      if (t > 0 && m < t) incomplete.add(chapter);
    } catch {
      incomplete.add(chapter);
    }
  }
  return incomplete;
}

/**
 * Non-blocking variant for parallel orchestrator workers (avoids long execSync stalls).
 * @param {string} ref
 * @param {string} book
 * @param {{ includeRed?: boolean }} [opts]
 */
export async function incompleteChaptersOnGitRefAsync(ref, book, opts = {}) {
  let raw;
  try {
    raw = await execGit(`git show "${ref}:data/progress.json"`, { maxBuffer: 10 * 1024 * 1024 });
  } catch {
    return incompleteChaptersFromDataFilesAsync(ref, book);
  }

  const progress = JSON.parse(raw);
  const bookData = progress.books?.[book];
  if (!bookData?.chapters) return new Set();

  const incomplete = new Set();
  for (const ch of bookData.chapters) {
    const needs =
      ch.status === 'gray' ||
      ch.status === 'yellow' ||
      (opts.includeRed && ch.status === 'red');
    if (needs) incomplete.add(ch.chapter);
  }
  return incomplete;
}

/**
 * @param {string} ref
 * @param {string} book
 */
async function incompleteChaptersFromDataFilesAsync(ref, book) {
  let listing;
  try {
    const out = await execGit(`git ls-tree --name-only "${ref}:data/${book}"`);
    listing = out
      .trim()
      .split('\n')
      .filter((f) => f.endsWith('.json'));
  } catch {
    return new Set();
  }

  const incomplete = new Set();
  await Promise.all(
    listing.map(async (file) => {
      const chapter = file.replace(/\.json$/, '');
      try {
        const json = await execGit(`git show "${ref}:data/${book}/${file}"`);
        const data = JSON.parse(json);
        let t = 0;
        let m = 0;
        for (const block of data.content ?? []) {
          const rows = block.type === 'table_row' ? (block.cells ?? []) : (block.sentences ?? []);
          for (const s of rows) {
            const tr = s.translations?.[0]?.translator ?? s.translator;
            if (tr === 'Herbert J. Allen (1894)') continue;
            const zh = (s.zh ?? s.content ?? '').trim();
            if (!zh) continue;
            t++;
            const idio = s.translations?.[0]?.idiomatic ?? s.idiomatic ?? '';
            if (idio.trim()) m++;
          }
        }
        if (t > 0 && m < t) incomplete.add(chapter);
      } catch {
        incomplete.add(chapter);
      }
    }),
  );
  return incomplete;
}

const RETRYABLE_NETWORK = new Set(['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED']);

/**
 * @param {unknown} err
 */
function isRetryableFetchError(err) {
  if (!err || typeof err !== 'object') return false;
  const e = /** @type {{ code?: string, cause?: { code?: string }, message?: string }} */ (err);
  const code = e.code ?? e.cause?.code;
  if (code && RETRYABLE_NETWORK.has(code)) return true;
  const msg = e.message ?? '';
  return msg.includes('fetch failed') || /GitHub API (429|5\d\d)/.test(msg);
}

/**
 * @param {string} url
 * @param {{ token?: string, maxAttempts?: number, baseMs?: number }} [opts]
 */
async function githubFetch(url, opts = {}) {
  const { token, maxAttempts = 5, baseMs = 1000 } = opts;
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, { headers });
      if (res.status === 429 || res.status >= 500) {
        const body = await res.text();
        throw new Error(`GitHub API ${res.status}: ${body.slice(0, 200)}`);
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (!isRetryableFetchError(err) || attempt === maxAttempts) throw err;
      const delay = baseMs * 2 ** (attempt - 1);
      console.warn(
        `GitHub API retry ${attempt}/${maxAttempts} in ${delay}ms: ${/** @type {Error} */ (err).message}`,
      );
      await sleep(delay);
    }
  }
  throw lastErr;
}

/**
 * @param {{ state?: string, merged?: boolean, mergeable?: boolean | null, mergeable_state?: string, number?: number }} pr
 * @param {string} book
 */
function assertPrMergeable(pr, book) {
  if (pr.state === 'closed' && !pr.merged) {
    throw new Error(`[${book}] PR #${pr.number} closed without merge — fix or reopen manually`);
  }
  if (pr.state !== 'open' || pr.merged) return;
  if (pr.mergeable == null) return;

  const state = pr.mergeable_state ?? 'unknown';
  if (!pr.mergeable && (state === 'dirty' || state === 'conflicting')) {
    throw new Error(
      `[${book}] PR #${pr.number} has merge conflicts (mergeable_state=${state}). Resolve on GitHub before the next session.`,
    );
  }
  if (!pr.mergeable && state === 'behind') {
    console.warn(
      `[${book}] PR #${pr.number} is behind master (mergeable_state=behind) — automerge may be waiting on an update`,
    );
  }
}

/**
 * @param {string} owner
 * @param {string} repo
 * @param {string} book
 * @param {string} [token]
 */
async function fetchOpenPrsForBook(owner, repo, book, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=100`;
  const res = await githubFetch(url, { token });
  const pulls = await res.json();
  if (!Array.isArray(pulls)) {
    throw new Error(
      `GitHub pulls list was not an array for ${owner}/${repo}: ${JSON.stringify(pulls).slice(0, 200)}`,
    );
  }
  const needle = book.toLowerCase();
  return pulls.filter((pr) => {
    const head = (pr.head?.ref ?? '').toLowerCase();
    const title = (pr.title ?? '').toLowerCase();
    return head.includes(needle) || title.includes(needle);
  });
}

/**
 * @param {string} prUrl
 * @param {string} [token]
 */
async function fetchPullRequest(prUrl, token) {
  const m = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!m) return null;
  const [, owner, repo, number] = m;
  const res = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`,
    { token },
  );
  if (!res.ok) return null;
  return res.json();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Local agents push straight to master — wait until origin/master shows the chapter done.
 * @param {string} book
 * @param {Set<string>} baselineIncomplete
 * @param {{ includeRed?: boolean, pollMs?: number, timeoutMs?: number }} opts
 */
async function waitForProgressOnMaster(book, baselineIncomplete, opts) {
  const pollMs = opts.pollMs ?? 90_000;
  const timeoutMs = opts.timeoutMs ?? 6 * 60 * 60 * 1000;
  const masterRef = 'origin/master';
  const started = Date.now();

  console.log(
    `[${book}] waiting for direct push to master — baseline incomplete chapters: ${baselineIncomplete.size}`,
  );

  execSync('git fetch origin master', { cwd: REPO_ROOT, stdio: 'inherit' });

  while (Date.now() - started < timeoutMs) {
    execSync('git fetch origin master', { cwd: REPO_ROOT, stdio: 'pipe' });

    const currentIncomplete = await incompleteChaptersOnGitRefAsync(masterRef, book, {
      includeRed: opts.includeRed,
    });

    let progressed = false;
    for (const ch of baselineIncomplete) {
      if (!currentIncomplete.has(ch)) {
        progressed = true;
        console.log(`[${book}] chapter ${ch} now complete on origin/master`);
        break;
      }
    }

    if (progressed) break;

    if (baselineIncomplete.size > 0 && currentIncomplete.size < baselineIncomplete.size) {
      console.log(
        `[${book}] master incomplete count dropped ${baselineIncomplete.size} → ${currentIncomplete.size}`,
      );
      break;
    }

    const elapsed = Math.round((Date.now() - started) / 1000);
    console.log(
      `[${book}] still waiting for master push (${elapsed}s): incomplete on master=${currentIncomplete.size}`,
    );
    await sleep(pollMs);
  }

  if (Date.now() - started >= timeoutMs) {
    throw new Error(`[${book}] timed out waiting for master push after ${timeoutMs / 1000}s`);
  }

  execSync('git fetch origin master', { cwd: REPO_ROOT, stdio: 'pipe' });
}

/**
 * True when origin/master shows this session reduced incomplete chapters vs baseline.
 *
 * @param {string} book
 * @param {Set<string>} baselineIncomplete
 * @param {{ includeRed?: boolean }} [opts]
 * @returns {Promise<{ progressed: boolean, reason?: string, currentIncomplete: Set<string> }>}
 */
export async function detectSessionProgressOnMaster(book, baselineIncomplete, opts = {}) {
  execSync('git fetch origin master', { cwd: REPO_ROOT, stdio: 'pipe' });
  const currentIncomplete = await incompleteChaptersOnGitRefAsync('origin/master', book, {
    includeRed: opts.includeRed,
  });

  for (const ch of baselineIncomplete) {
    if (!currentIncomplete.has(ch)) {
      return {
        progressed: true,
        reason: `chapter ${ch} now complete on origin/master`,
        currentIncomplete,
      };
    }
  }

  if (baselineIncomplete.size > 0 && currentIncomplete.size < baselineIncomplete.size) {
    return {
      progressed: true,
      reason: `incomplete count dropped ${baselineIncomplete.size} → ${currentIncomplete.size}`,
      currentIncomplete,
    };
  }

  return { progressed: false, currentIncomplete };
}

/**
 * @param {string} book
 * @param {{ git?: { branches?: Array<{ branch?: string, prUrl?: string, repoUrl?: string }> } }} sessionResult
 * @param {Set<string>} baselineIncomplete
 * @param {{ repoUrl: string, includeRed?: boolean, pollMs?: number, timeoutMs?: number, githubToken?: string, directToMaster?: boolean }} opts
 */
export async function waitForSessionMergedToMaster(book, sessionResult, baselineIncomplete, opts) {
  if (opts.directToMaster) {
    return waitForProgressOnMaster(book, baselineIncomplete, opts);
  }

  const { owner, repo } = parseGitHubRepo(opts.repoUrl);
  const token = opts.githubToken ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  const pollMs = opts.pollMs ?? 90_000;
  const timeoutMs = opts.timeoutMs ?? 6 * 60 * 60 * 1000;
  const masterRef = 'origin/master';
  const started = Date.now();

  const branches = sessionResult.git?.branches ?? [];
  const branchInfo =
    branches.find((b) => b.repoUrl?.includes(owner)) ?? branches[0] ?? {};
  const branch = branchInfo.branch;
  const prUrl = branchInfo.prUrl;

  console.log(
    `[${book}] waiting for merge to master` +
      (prUrl ? ` (PR ${prUrl})` : branch ? ` (branch ${branch})` : '') +
      ` — baseline incomplete chapters: ${baselineIncomplete.size}`,
  );

  if (!prUrl && !branch) {
    console.warn(
      `[${book}] agent finished but SDK returned no PR URL or branch — will wait for origin/master progress only`,
    );
  }

  execSync('git fetch origin master', { cwd: REPO_ROOT, stdio: 'inherit' });

  while (Date.now() - started < timeoutMs) {
    execSync('git fetch origin master', { cwd: REPO_ROOT, stdio: 'pipe' });

    if (prUrl) {
      const pr = await fetchPullRequest(prUrl, token);
      if (pr) {
        assertPrMergeable(pr, book);
        if (pr.merged) {
          console.log(`[${book}] PR #${pr.number} merged`);
          break;
        }
      }
    }

    const openPrs = await fetchOpenPrsForBook(owner, repo, book, token);
    const openCount = openPrs.length;
    const currentIncomplete = await incompleteChaptersOnGitRefAsync(masterRef, book, {
      includeRed: opts.includeRed,
    });

    let progressed = false;
    for (const ch of baselineIncomplete) {
      if (!currentIncomplete.has(ch)) {
        progressed = true;
        console.log(`[${book}] chapter ${ch} now complete on origin/master`);
        break;
      }
    }

    if (openCount === 0 && progressed) {
      console.log(`[${book}] no open PRs for book and master progress updated`);
      break;
    }

    if (openCount === 0 && !prUrl && !branch) {
      if (progressed) break;
      console.warn(
        `[${book}] no PR/branch metadata from agent; waiting for master progress only (${currentIncomplete.size} incomplete left)`,
      );
      if (baselineIncomplete.size > 0 && currentIncomplete.size < baselineIncomplete.size) break;
    }

    const elapsed = Math.round((Date.now() - started) / 1000);
    const openTitles = openPrs.map((p) => `#${p.number}`).join(', ') || 'none';
    console.log(
      `[${book}] still waiting (${elapsed}s): open PRs=${openTitles}, incomplete on master=${currentIncomplete.size}`,
    );
    await sleep(pollMs);
  }

  if (Date.now() - started >= timeoutMs) {
    throw new Error(`[${book}] timed out waiting for merge after ${timeoutMs / 1000}s`);
  }

  execSync('git fetch origin master', { cwd: REPO_ROOT, stdio: 'pipe' });
}
