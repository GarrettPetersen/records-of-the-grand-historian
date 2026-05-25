/**
 * GitHub PR helpers for translation batch merges.
 */
import { parseGitHubRepo } from './sdk-merge-wait.mjs';

const DEFAULT_REPO_URL = 'https://github.com/GarrettPetersen/records-of-the-grand-historian';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableFetchError(err) {
  const e = err instanceof Error ? err : new Error(String(err));
  const code = /** @type {{ code?: string }} */ (e).code;
  if (code && ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN'].includes(code)) return true;
  const msg = e.message ?? '';
  return msg.includes('fetch failed') || /GitHub API (429|5\d\d)/.test(msg);
}

/**
 * @param {string} url
 * @param {{ token?: string, method?: string, body?: unknown, maxAttempts?: number, baseMs?: number }} [opts]
 */
export async function githubFetch(url, opts = {}) {
  const { token, method = 'GET', body, maxAttempts = 5, baseMs = 1000 } = opts;
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      if (res.status === 429 || res.status >= 500) {
        const text = await res.text();
        throw new Error(`GitHub API ${res.status}: ${text.slice(0, 200)}`);
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

function authToken(token) {
  return token ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
}

/**
 * @param {string} repoUrl
 * @param {number} pullNumber
 * @param {string} [token]
 */
export async function getPullRequest(repoUrl, pullNumber, token) {
  const auth = authToken(token);
  const { owner, repo } = parseGitHubRepo(repoUrl);
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;
  const res = await githubFetch(url, { token: auth });
  return res.json();
}

/**
 * @param {string} repoUrl
 * @param {number} pullNumber
 * @param {string} baseRef
 * @param {string} [token]
 */
export async function updatePullRequestBase(repoUrl, pullNumber, baseRef, token) {
  const auth = authToken(token);
  const { owner, repo } = parseGitHubRepo(repoUrl);
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;
  const res = await githubFetch(url, {
    token: auth,
    method: 'PATCH',
    body: { base: baseRef },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PATCH pull #${pullNumber} base=${baseRef}: ${res.status} ${text.slice(0, 300)}`);
  }
  return res.json();
}

/**
 * @param {string} repoUrl
 * @param {number} pullNumber
 * @param {string} [token]
 */
export async function updatePullRequestBranch(repoUrl, pullNumber, token) {
  const auth = authToken(token);
  const { owner, repo } = parseGitHubRepo(repoUrl);
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/update-branch`;
  const res = await githubFetch(url, { token: auth, method: 'POST' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub update-branch PR #${pullNumber}: ${res.status} ${text.slice(0, 300)}`);
  }
  return res.json();
}

/**
 * Merge an open PR via GitHub (marks it merged into its base branch).
 *
 * @param {string} repoUrl
 * @param {number} pullNumber
 * @param {{ token?: string, mergeMethod?: 'merge' | 'squash' | 'rebase' }} [opts]
 */
export async function mergePullRequest(repoUrl, pullNumber, opts = {}) {
  const auth = authToken(opts.token);
  const mergeMethod = opts.mergeMethod ?? 'merge';
  const { owner, repo } = parseGitHubRepo(repoUrl);
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/merge`;
  const res = await githubFetch(url, {
    token: auth,
    method: 'PUT',
    body: { merge_method: mergeMethod },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub merge PR #${pullNumber}: ${res.status} ${text.slice(0, 300)}`);
  }
  if (res.status === 204) return { merged: true };
  const text = await res.text();
  if (!text.trim()) return { merged: true };
  return JSON.parse(text);
}

/**
 * Open PRs whose head branch is cursor/* (SDK chapter translation).
 *
 * @param {string} [repoUrl]
 * @param {string} [token]
 * @returns {Promise<Array<{ number: number, title: string, headRef: string, baseRef: string, url: string }>>}
 */
export async function listOpenCursorTranslationPrs(repoUrl = DEFAULT_REPO_URL, token) {
  const auth = authToken(token);
  const { owner, repo } = parseGitHubRepo(repoUrl);
  const all = [];

  for (let page = 1; page <= 50; page++) {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=100&page=${page}`;
    const res = await githubFetch(url, { token: auth });
    const pulls = await res.json();
    if (!Array.isArray(pulls)) {
      throw new Error(
        `GitHub pulls list was not an array for ${owner}/${repo}: ${JSON.stringify(pulls).slice(0, 200)}`,
      );
    }
    if (pulls.length === 0) break;

    for (const pr of pulls) {
      const headRef = pr.head?.ref ?? '';
      if (!headRef.startsWith('cursor/')) continue;
      all.push({
        number: pr.number,
        title: pr.title ?? '',
        headRef,
        baseRef: pr.base?.ref ?? 'master',
        url: pr.html_url ?? `https://github.com/${owner}/${repo}/pull/${pr.number}`,
      });
    }
    if (pulls.length < 100) break;
  }

  all.sort((a, b) => a.number - b.number);
  return all;
}

export { parseGitHubRepo, DEFAULT_REPO_URL };
