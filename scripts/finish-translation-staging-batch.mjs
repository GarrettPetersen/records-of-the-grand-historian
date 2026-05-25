#!/usr/bin/env node
/**
 * Close absorbed chapter PRs, merge conflicted ones into translation-staging, squash batch to master.
 *
 *   node scripts/finish-translation-staging-batch.mjs --dry-run
 *   node scripts/finish-translation-staging-batch.mjs
 */
import { execSync } from 'node:child_process';
import {
  DEFAULT_REPO_URL,
  githubFetch,
  getPullRequest,
  listOpenCursorTranslationPrs,
  mergePullRequest,
} from './github-pr.mjs';
import { parseGitHubRepo } from './sdk-merge-wait.mjs';
import { chaptersOnStagingNotMasterFromProgress } from './translation-inflight.mjs';
import { REPO_ROOT } from './sdk-translation-books.mjs';

const STAGING = process.env.TRANSLATION_STAGING_BRANCH || 'translation-staging';
const BATCH_PR_TITLE = 'Translation batch';
const ABSORBED_COMMENT =
  'Absorbed via **translation-staging** batch (chapter work already on `translation-staging`). Closing to clear the queue.';

/** @type {Record<number, string>} */
const MERGE_BRANCHES = {
  748: 'cursor/translate-liaoshi-chapter-109-dfda',
  750: 'cursor/liaoshi-ch117-f40a',
  754: 'cursor/translate-liaoshi-106-033e',
  756: 'cursor/qingshigao-chapter-057-401b',
};

/** PRs to close without merge (work already on staging and/or master). */
const CLOSE_ONLY = [746, 747, 749, 751, 752, 753];

function parseArgs() {
  return { dryRun: process.argv.includes('--dry-run') };
}

function token() {
  return process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
}

function run(cmd, inherit = false) {
  return execSync(cmd, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
  });
}

/**
 * @param {string} repoUrl
 * @param {number} pullNumber
 * @param {string} body
 */
async function commentOnPr(repoUrl, pullNumber, body) {
  const auth = token();
  const { owner, repo } = parseGitHubRepo(repoUrl);
  const res = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${pullNumber}/comments`,
    { token: auth, method: 'POST', body: { body } },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`comment PR #${pullNumber}: ${res.status} ${text.slice(0, 200)}`);
  }
}

/**
 * @param {string} repoUrl
 * @param {number} pullNumber
 */
async function closePullRequest(repoUrl, pullNumber) {
  const auth = token();
  const { owner, repo } = parseGitHubRepo(repoUrl);
  const res = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`,
    { token: auth, method: 'PATCH', body: { state: 'closed' } },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`close PR #${pullNumber}: ${res.status} ${text.slice(0, 200)}`);
  }
}

/**
 * @param {string} repoUrl
 * @param {number} batchPrNumber
 */
async function squashMergeBatchPr(repoUrl, batchPrNumber) {
  const auth = token();
  const { owner, repo } = parseGitHubRepo(repoUrl);
  const res = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${batchPrNumber}/merge`,
    { token: auth, method: 'PUT', body: { merge_method: 'squash' } },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`squash merge PR #${batchPrNumber}: ${res.status} ${text.slice(0, 300)}`);
  }
}

function gitMergeConflictBranches(dryRun) {
  run('git fetch origin master', true);
  run(`git fetch origin ${STAGING}`, true);
  for (const branch of Object.values(MERGE_BRANCHES)) {
    run(`git fetch origin ${branch}`, true);
  }

  if (dryRun) {
    console.log(`Would checkout ${STAGING} and merge:`, Object.values(MERGE_BRANCHES).join(', '));
    return;
  }

  run(`git checkout -B ${STAGING} origin/${STAGING}`, true);
  run('git merge origin/master -m "staging: sync from master" --no-edit', true);

  for (const [num, branch] of Object.entries(MERGE_BRANCHES)) {
    console.log(`Git merge PR #${num} (${branch})…`);
    try {
      run(
        `git merge "origin/${branch}" -m "staging: absorb PR #${num} (${branch})" -X theirs --no-edit`,
        true,
      );
    } catch {
      try {
        run('git merge --abort', true);
      } catch {
        run('git reset --hard HEAD', true);
      }
      throw new Error(`git merge failed for PR #${num} (${branch})`);
    }
  }

  console.log(`Pushing origin ${STAGING}…`);
  run(`git push origin ${STAGING}`, true);
}

async function findBatchPr(repoUrl) {
  const auth = token();
  const { owner, repo } = parseGitHubRepo(repoUrl);
  const res = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&base=master&head=${owner}:${STAGING}&per_page=10`,
    { token: auth },
  );
  const prs = await res.json();
  if (!Array.isArray(prs) || prs.length === 0) return null;
  return prs[0];
}

async function main() {
  const { dryRun } = parseArgs();
  const repoUrl = DEFAULT_REPO_URL;
  const auth = token();
  if (!auth && !dryRun) {
    throw new Error('GITHUB_TOKEN or GH_TOKEN required');
  }

  const open = await listOpenCursorTranslationPrs(repoUrl, auth);
  console.log(`Open cursor/* PRs: ${open.length}`);

  for (const num of CLOSE_ONLY) {
    const pr = open.find((p) => p.number === num);
    if (!pr) {
      console.log(`  #${num}: already closed or missing`);
      continue;
    }
    console.log(`Close #${num} (${pr.headRef}) — already on staging`);
    if (!dryRun) {
      await commentOnPr(repoUrl, num, ABSORBED_COMMENT);
      await closePullRequest(repoUrl, num);
    }
  }

  const mergeNums = Object.keys(MERGE_BRANCHES).map(Number);
  const toMerge = open.filter((p) => mergeNums.includes(p.number));
  console.log(`\nMerge ${toMerge.length} conflicted chapter PR(s) into ${STAGING}…`);
  gitMergeConflictBranches(dryRun);

  for (const num of mergeNums) {
    const pr = toMerge.find((p) => p.number === num) ?? { number: num };
    console.log(`Close #${num} after git absorb`);
    if (!dryRun) {
      try {
        const detail = await getPullRequest(repoUrl, num, auth);
        if (detail.state === 'open') {
          await commentOnPr(repoUrl, num, ABSORBED_COMMENT);
          await closePullRequest(repoUrl, num);
        }
      } catch (err) {
        console.warn(`  #${num}: ${err instanceof Error ? err.message : err}`);
      }
    }
  }

  const pending = chaptersOnStagingNotMasterFromProgress(`origin/${STAGING}`, 'origin/master');
  console.log(`\nChapters on ${STAGING} not yet on master: ${pending.length}`);
  for (const { book, chapter } of pending.slice(0, 15)) {
    console.log(`  ${book}/${chapter}`);
  }
  if (pending.length > 15) console.log(`  …and ${pending.length - 15} more`);

  let batch = await findBatchPr(repoUrl);
  if (!batch) {
    console.log('\nNo open batch PR found (translation-staging → master). Create one on GitHub, then re-run with --merge-batch only.');
  } else {
    console.log(`\nBatch PR: #${batch.number} ${batch.title}`);
    if (!dryRun) {
      console.log('Squash-merging batch PR to master (one Cloudflare build)…');
      await squashMergeBatchPr(repoUrl, batch.number);
      console.log(`Merged #${batch.number} to master.`);
    }
  }

  const remaining = await listOpenCursorTranslationPrs(repoUrl, auth);
  console.log(`\nRemaining open cursor/* PRs: ${remaining.length}`);
  for (const pr of remaining) {
    console.log(`  #${pr.number} → ${pr.baseRef} ${pr.headRef}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
