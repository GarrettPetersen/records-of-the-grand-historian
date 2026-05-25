#!/usr/bin/env node
/**
 * Absorb open cursor/* translation PRs into translation-staging.
 *
 * Each chapter PR is retargeted to translation-staging (if needed) and merged via GitHub
 * so it shows as "Merged" into staging — not left open against master.
 *
 * Does NOT merge chapter PRs to master. After staging is ready:
 *   gh pr create --base master --head translation-staging --title "Translation batch"
 *   # then squash-merge that single PR
 *
 * Usage:
 *   node scripts/merge-translation-prs-to-staging.mjs --dry-run
 *   node scripts/merge-translation-prs-to-staging.mjs
 *   node scripts/merge-translation-prs-to-staging.mjs --limit 20
 *   node scripts/merge-translation-prs-to-staging.mjs --staging-branch translation-staging
 *   node scripts/merge-translation-prs-to-staging.mjs --git-only   # legacy: git-merge heads only
 */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  closeAbsorbedChapterPr,
  DEFAULT_REPO_URL,
  getPullRequest,
  listOpenCursorTranslationPrs,
  mergePullRequest,
  updatePullRequestBase,
  updatePullRequestBranch,
} from './github-pr.mjs';
import { REPO_ROOT } from './sdk-translation-books.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_STAGING = process.env.TRANSLATION_STAGING_BRANCH || 'translation-staging';

function parseArgs() {
  const dryRun = process.argv.includes('--dry-run');
  const skipConflicts = process.argv.includes('--skip-conflicts');
  const gitOnly = process.argv.includes('--git-only');
  const push = !process.argv.includes('--no-push');
  let stagingBranch = DEFAULT_STAGING;
  let limit = Infinity;

  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === '--staging-branch' && process.argv[i + 1]) {
      stagingBranch = process.argv[++i].trim();
    }
    if (process.argv[i] === '--limit' && process.argv[i + 1]) {
      limit = Number.parseInt(process.argv[++i], 10) || Infinity;
    }
  }

  return { dryRun, skipConflicts, gitOnly, push, stagingBranch, limit };
}

function run(cmd, opts = {}) {
  return execSync(cmd, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: opts.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    ...opts,
  });
}

function branchExistsOnRemote(branch) {
  try {
    run(`git rev-parse --verify "origin/${branch}"`);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Ensure translation-staging exists on origin and includes latest master. */
function syncStagingBranchWithMaster(stagingBranch) {
  run('git fetch origin', { inherit: true });

  const onStaging = run('git branch --show-current').trim() === stagingBranch;
  if (!onStaging) {
    if (branchExistsOnRemote(stagingBranch)) {
      run(`git checkout -B ${stagingBranch} origin/${stagingBranch}`, { inherit: true });
    } else {
      run(`git checkout -B ${stagingBranch} origin/master`, { inherit: true });
    }
  }

  console.log(`Syncing ${stagingBranch} with origin/master…`);
  run('git merge origin/master -m "staging: sync from master" --no-edit', { inherit: true });
}

/**
 * Resolve merge conflicts by keeping the incoming PR version (chapter + corpus deltas).
 * Multiple chapter PRs touch the same search-corpus/{book}.json; sequential merges conflict otherwise.
 */
function resolveConflictsPreferIncoming() {
  let unmerged = run('git diff --name-only --diff-filter=U', { encoding: 'utf8' }).trim();
  if (!unmerged) return true;

  for (const file of unmerged.split('\n')) {
    if (!file) continue;
    run(`git checkout --theirs -- "${file}"`, { inherit: true });
    run(`git add -- "${file}"`, { inherit: true });
  }

  unmerged = run('git diff --name-only --diff-filter=U', { encoding: 'utf8' }).trim();
  if (unmerged) return false;

  run('git commit --no-edit', { inherit: true });
  return true;
}

function rebuildSearchCorporaOnStaging() {
  console.log('Rebuilding search corpora on staging (fixes batch merge conflicts)…');
  run('node scripts/build-book-search-corpus.mjs', { inherit: true });
  const status = run('git status --porcelain public/data/search-corpus', { encoding: 'utf8' }).trim();
  if (!status) return;
  run('git add public/data/search-corpus', { inherit: true });
  run('git commit -m "staging: rebuild search corpora after chapter batch" --no-edit', { inherit: true });
}

function gitMergePrHeadIntoStaging(pr, stagingBranch, skipConflicts) {
  const remoteRef = `origin/${pr.headRef}`;
  try {
    run(`git fetch origin ${pr.headRef}`, { inherit: true });
  } catch (err) {
    throw new Error(`fetch failed: ${err instanceof Error ? err.message : err}`);
  }

  try {
    run(
      `git merge "${remoteRef}" -m "staging: absorb PR #${pr.number} (${pr.headRef})" --no-edit`,
      { inherit: true },
    );
    return true;
  } catch {
    if (resolveConflictsPreferIncoming()) {
      console.log(`  PR #${pr.number}: git merge completed after conflict resolution`);
      return true;
    }
    try {
      run('git merge --abort', { inherit: true });
    } catch {
      run('git reset --hard HEAD', { inherit: true });
    }
    if (!skipConflicts) {
      throw new Error(`git merge conflict for PR #${pr.number}`);
    }
    console.warn(`  git conflict: PR #${pr.number} ${pr.headRef}`);
    return false;
  }
}

/**
 * Wait for GitHub to compute mergeability (null → true/false).
 */
async function waitForPrMergeable(repoUrl, pullNumber, maxMs = 90_000) {
  const started = Date.now();
  while (Date.now() - started < maxMs) {
    const detail = await getPullRequest(repoUrl, pullNumber);
    if (detail.state === 'closed') {
      return { detail, closed: true, merged: Boolean(detail.merged) };
    }
    if (detail.mergeable === true) return { detail };
    if (
      detail.mergeable === false &&
      (detail.mergeable_state === 'dirty' || detail.mergeable_state === 'conflicting')
    ) {
      return { detail, blocked: true };
    }
    await sleep(2000);
  }
  return { detail: await getPullRequest(repoUrl, pullNumber), timeout: true };
}

/**
 * Retarget PR to staging, merge via GitHub API; fall back to local git merge + retry API.
 */
async function mergePrIntoStagingViaGithub(pr, stagingBranch, { skipConflicts, repoUrl }) {
  if (pr.baseRef !== stagingBranch) {
    console.log(`  PR #${pr.number}: retarget base ${pr.baseRef} → ${stagingBranch}`);
    await updatePullRequestBase(repoUrl, pr.number, stagingBranch);
    await sleep(1500);
  } else {
    console.log(`  PR #${pr.number}: already targets ${stagingBranch}`);
  }

  const ready = await waitForPrMergeable(repoUrl, pr.number);
  if (ready.closed) {
    if (ready.merged) {
      console.log(`  PR #${pr.number}: already merged`);
      return { ok: true, via: 'already-merged' };
    }
    throw new Error(`PR #${pr.number} is closed but not merged`);
  }
  if (ready.blocked) {
    console.warn(
      `  PR #${pr.number}: not mergeable (state=${ready.detail.mergeable_state}) — trying git fallback`,
    );
  } else if (ready.timeout) {
    console.warn(`  PR #${pr.number}: mergeability check timed out — attempting merge anyway`);
  }

  let detail = ready.detail;
  if (detail.mergeable_state === 'behind') {
    console.log(`  PR #${pr.number}: updating branch (behind ${stagingBranch})`);
    try {
      await updatePullRequestBranch(repoUrl, pr.number);
      await sleep(2000);
      detail = await getPullRequest(repoUrl, pr.number);
    } catch (err) {
      console.warn(
        `  PR #${pr.number}: update-branch failed (${err instanceof Error ? err.message : err})`,
      );
    }
  }

  try {
    await mergePullRequest(repoUrl, pr.number, { mergeMethod: 'merge' });
    console.log(`  PR #${pr.number}: merged into ${stagingBranch} (GitHub)`);
    return { ok: true, via: 'github' };
  } catch (err) {
    console.warn(
      `  PR #${pr.number}: GitHub merge failed (${err instanceof Error ? err.message : err}) — trying git fallback`,
    );
  }

  syncStagingBranchWithMaster(stagingBranch);
  const gitOk = gitMergePrHeadIntoStaging(pr, stagingBranch, skipConflicts);
  if (!gitOk) {
    return { ok: false, via: 'git-conflict' };
  }

  try {
    await mergePullRequest(repoUrl, pr.number, { mergeMethod: 'merge' });
    console.log(`  PR #${pr.number}: merged into ${stagingBranch} (GitHub, after git fallback)`);
    return { ok: true, via: 'github-after-git' };
  } catch (err) {
    console.warn(
      `  PR #${pr.number}: GitHub merge still blocked after git absorb — closing PR (${err instanceof Error ? err.message : err})`,
    );
    try {
      await closeAbsorbedChapterPr(repoUrl, pr.number);
      console.log(`  PR #${pr.number}: closed after git absorb`);
    } catch (closeErr) {
      console.warn(
        `  PR #${pr.number}: could not close (${closeErr instanceof Error ? closeErr.message : closeErr})`,
      );
    }
    return { ok: true, via: 'git-absorb-closed' };
  }
}

async function main() {
  const { dryRun, skipConflicts, gitOnly, push, stagingBranch, limit } = parseArgs();
  const repoUrl = process.env.GITHUB_REPO_URL ?? DEFAULT_REPO_URL;

  const prs = await listOpenCursorTranslationPrs(repoUrl);
  const batch = prs.slice(0, limit);

  console.log(`Open cursor/* translation PRs: ${prs.length}`);
  if (limit < prs.length) {
    console.log(`Processing first ${batch.length} (--limit ${limit})`);
  }

  if (batch.length === 0) {
    console.log('Nothing to merge into staging.');
    return;
  }

  if (dryRun) {
    for (const pr of batch) {
      const retarget =
        pr.baseRef !== stagingBranch ? `retarget ${pr.baseRef}→${stagingBranch}, ` : '';
      console.log(`  #${pr.number} ${pr.headRef} — ${retarget}merge into ${stagingBranch} — ${pr.title}`);
    }
    console.log(`\nDry-run: would sync ${stagingBranch} with master, then merge ${batch.length} PR(s) via GitHub.`);
    return;
  }

  syncStagingBranchWithMaster(stagingBranch);
  if (push) {
    console.log(`Pushing origin ${stagingBranch} (pre-merge sync)…`);
    run(`git push -u origin ${stagingBranch}`, { inherit: true });
  }

  let merged = 0;
  const conflicts = [];
  const failed = [];

  if (gitOnly) {
    for (const pr of batch) {
      try {
        if (gitMergePrHeadIntoStaging(pr, stagingBranch, skipConflicts)) {
          merged += 1;
        } else {
          conflicts.push(pr);
        }
      } catch (err) {
        failed.push({ pr, reason: err instanceof Error ? err.message : String(err) });
        if (!skipConflicts) break;
      }
    }
    if (push && merged > 0) {
      console.log(`Pushing origin ${stagingBranch}…`);
      run(`git push -u origin ${stagingBranch}`, { inherit: true });
    }
  } else {
    for (const pr of batch) {
      try {
        const result = await mergePrIntoStagingViaGithub(pr, stagingBranch, {
          skipConflicts,
          repoUrl,
        });
        if (result.ok) {
          merged += 1;
          // Keep local staging in sync for subsequent git fallbacks / push
          try {
            run(`git fetch origin ${stagingBranch} && git merge origin/${stagingBranch} --no-edit`, {
              inherit: true,
            });
          } catch {
            run(`git fetch origin ${stagingBranch}`, { inherit: true });
            run(`git reset --hard origin/${stagingBranch}`, { inherit: true });
          }
        } else {
          conflicts.push(pr);
          if (!skipConflicts) break;
        }
      } catch (err) {
        failed.push({ pr, reason: err instanceof Error ? err.message : String(err) });
        console.warn(`  failed: PR #${pr.number} — ${failed.at(-1)?.reason}`);
        if (!skipConflicts) break;
      }
    }
  }

  if (merged > 0 && push) {
    try {
      syncStagingBranchWithMaster(stagingBranch);
      rebuildSearchCorporaOnStaging();
      console.log(`Pushing origin ${stagingBranch} (post-corpus rebuild)…`);
      run(`git push -u origin ${stagingBranch}`, { inherit: true });
    } catch (err) {
      console.warn(
        `Corpus rebuild/push issue (${err instanceof Error ? err.message : err}) — push staging manually if needed.`,
      );
    }
  }

  console.log(
    `\nMerged ${merged} PR(s) into ${stagingBranch}. Conflicts: ${conflicts.length}. Failed: ${failed.length}.`,
  );

  if (conflicts.length > 0) {
    console.log('Conflict PRs (still open):');
    for (const pr of conflicts) {
      console.log(`  #${pr.number} ${pr.url}`);
    }
  }

  if (failed.length > 0) {
    console.log('Failed:');
    for (const { pr, reason } of failed) {
      console.log(`  #${pr.number} ${reason}`);
    }
  }

  console.log(`
Next: one squash merge to master (one Cloudflare build):
  gh pr create --base master --head ${stagingBranch} --title "Translation batch" --body "Absorbs chapter translation PRs from staging."
  gh pr merge <number> --squash
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
