#!/usr/bin/env node
/**
 * Absorb open cursor/* translation PRs into one staging branch (one Cloudflare build when merged).
 *
 * Does NOT merge individual PRs to master. After staging is ready:
 *   gh pr create --base master --head translation-staging --title "Translation batch"
 *   # then squash-merge that single PR
 *
 * Usage:
 *   node scripts/merge-translation-prs-to-staging.mjs --dry-run
 *   node scripts/merge-translation-prs-to-staging.mjs
 *   node scripts/merge-translation-prs-to-staging.mjs --limit 20
 *   node scripts/merge-translation-prs-to-staging.mjs --staging-branch translation-staging
 */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listOpenCursorTranslationPrs } from './github-pr.mjs';
import { REPO_ROOT } from './sdk-translation-books.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_STAGING = process.env.TRANSLATION_STAGING_BRANCH || 'translation-staging';

function parseArgs() {
  const dryRun = process.argv.includes('--dry-run');
  const skipConflicts = process.argv.includes('--skip-conflicts');
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

  return { dryRun, skipConflicts, push, stagingBranch, limit };
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

async function main() {
  const { dryRun, skipConflicts, push, stagingBranch, limit } = parseArgs();

  const prs = await listOpenCursorTranslationPrs();
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
      console.log(`  #${pr.number} ${pr.headRef} — ${pr.title}`);
    }
    console.log(`\nDry-run: would reset ${stagingBranch} to origin/master and merge ${batch.length} PR head(s).`);
    return;
  }

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

  let merged = 0;
  const conflicts = [];
  const failed = [];

  for (const pr of batch) {
    const remoteRef = `origin/${pr.headRef}`;
    try {
      run(`git fetch origin ${pr.headRef}`, { inherit: true });
    } catch (err) {
      failed.push({ pr, reason: `fetch failed: ${err instanceof Error ? err.message : err}` });
      continue;
    }

    try {
      run(
        `git merge "${remoteRef}" -m "staging: absorb PR #${pr.number} (${pr.headRef})" --no-edit`,
        { inherit: true },
      );
      merged += 1;
      if (merged % 25 === 0) {
        console.log(`  …${merged} PRs merged into ${stagingBranch}`);
      }
    } catch {
      try {
        run('git merge --abort', { inherit: true });
      } catch {
        run('git reset --hard HEAD', { inherit: true });
      }
      conflicts.push(pr);
      console.warn(`  conflict: PR #${pr.number} ${pr.headRef}`);
      if (!skipConflicts) {
        console.error(
          'Stopping on first conflict. Re-run with --skip-conflicts to continue past conflicts, or resolve manually.',
        );
        break;
      }
    }
  }

  console.log(`\nMerged ${merged} PR(s) into ${stagingBranch}. Conflicts: ${conflicts.length}. Failed fetch: ${failed.length}.`);

  if (push && merged > 0) {
    console.log(`Pushing origin ${stagingBranch}…`);
    try {
      run(`git push -u origin ${stagingBranch}`, { inherit: true });
    } catch {
      console.warn('Push failed — if the remote branch moved, try: git push --force-with-lease origin HEAD');
      throw new Error('git push failed');
    }
  } else if (!push) {
    console.log('Skipped push (--no-push).');
  }

  if (conflicts.length > 0) {
    console.log('Conflict PRs (not in staging):');
    for (const pr of conflicts) {
      console.log(`  #${pr.number} ${pr.url}`);
    }
  }

  if (failed.length > 0) {
    console.log('Failed fetch:');
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
