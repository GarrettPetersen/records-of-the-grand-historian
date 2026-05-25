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
 * @param {{ token?: string, maxAttempts?: number, baseMs?: number }} [opts]
 */
export async function githubFetch(url, opts = {}) {
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
 * Open PRs whose head branch is cursor/* (SDK chapter translation).
 *
 * @param {string} [repoUrl]
 * @param {string} [token]
 * @returns {Promise<Array<{ number: number, title: string, headRef: string, url: string }>>}
 */
export async function listOpenCursorTranslationPrs(repoUrl = DEFAULT_REPO_URL, token) {
  const auth = token ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
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
        url: pr.html_url ?? `https://github.com/${owner}/${repo}/pull/${pr.number}`,
      });
    }
    if (pulls.length < 100) break;
  }

  all.sort((a, b) => a.number - b.number);
  return all;
}

export { parseGitHubRepo, DEFAULT_REPO_URL };
