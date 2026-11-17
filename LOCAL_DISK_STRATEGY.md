# Local disk strategy

## Automatic low-disk procedure

The macOS host runs `node scripts/maintain-local-disk.mjs run` every five minutes
through LaunchAgent `com.24histories.disk-maintenance`. Install it once with
`node scripts/maintain-local-disk.mjs install`; remove the timer with `uninstall`.
`status` prints the current incident and exact receipt location. No model/API calls,
new worktrees, server shutdowns, builds or registry replays run in this service.

Below **35 GiB** free, the service opens one low-space incident and attempts only
this automatic cleanup: the current user's **`~/.npm/_cacache` download cache**.
It first rejects redirected/symlink/special-file paths, bounds its inspection,
checks open files and package-install/cache processes, and records the exact path
and allocated bytes before removal. Busy or unverifiable caches are preserved.
Installed dependencies, npm configuration and logs are not download cache.
Unknown or warning memory pressure prevents automatic cleanup.

It then measures real free space again and issues one local macOS notification.
If space remains low or inspection fails, the incident requires host action; it
does not repeatedly delete, alert, or ask permission on each timer invocation.
The incident is rearmed only after **40 GiB** free is observed. The existing
**30 GiB admission reserve remains unchanged**; clearing a notification or freeing
a small cache never approves dispatch/publication. Run `npm run people:disk:check`
after any cleanup/external change and resume only on a full actual pass. Inspect
the receipt's latest measurement even when a prior incident remains latched.

Receipts are in `~/.local/state/24histories-disk-maintenance/`: atomic `state.json`
and one `incident-*.json` per episode. They record measured before/after space,
the attempted cleanup, and pending action. No credentials or process arguments
are logged. A process lock prevents overlapping timers/manual runs; a leftover
lock requires checking its PID/ownership rather than blindly clearing it.

When the automatic cleanup cannot provide useful headroom, the host follows this
ordered procedure immediately, rather than merely polling the failed guard:

1. Stop new heavy jobs/dispatch; preserve active work and current ownership. Check
   disk trend, swap, memory pressure and physical footprints. Inspect recent growth
   using bounded inventories; do not assume the largest directory caused it.
2. Inspect completed managed checkouts and reproducible outputs, checking process
   dependencies, recovery/claim ownership and required sealed references. Archive
   or remove only verified completed/reproducible work with a recovery receipt.
   Do not delete a private registry merely because a chapter PR merged: native
   retained proofs may still reference it. Do not regenerate site output to clean it.
3. Preserve all source/unpublished changes, incomplete chunks, sealed packets,
   paid responses, native review history, active registries, locks, Git recovery
   refs, app/conversation history, swap, installed runtimes and pending updater
   installations. Never automatically delete them, empty Trash, run Git GC, prune
   worktrees or terminate apps. An updater/download directory is not proven safe
   solely by its name or age.
4. If no safe useful target exists, retain one concrete pending request: required
   extra headroom or a specific target with measured size, owner, interruption and
   recovery/restart plan. Ask once when ownership/authorization is missing. Keep
   this decision in the coordinator handoff and supervisor checkpoint; later
   agents must not repeat the request or bypass the hold.
5. After the cleanup or external change, rerun the full guard and record actual
   reclaimed bytes. Clear resource holds only on observed success. Resume one
   bounded job, remeasure, and keep serialized host writes and five-minute monitoring.

The preflight stays read-only and reports `diskMaintenance.required` below35GiB,
with the command/procedure above. If the host moves machines or the checkout moves,
install the timer again using that machine's Node executable and checkout path.
This timer mitigates safe reproducible cache growth; it cannot guarantee headroom
when other active projects write large files. A pending human space decision is
not permission to delete their work.

MCP GrokBot workers share one local runtime clone. The bridge serves sealed packets
and publishes through GitHub. Remote bots use the installed client and do not need a
repository clone for MCP work. Avoid local per-bot clones.

Git worktrees share history but duplicate checked-out files. A full task checkout can
contain 4.9 GiB of `public/` and 3.5 GiB of `data/`. Keep one full checkout for global
validation and milestone builds. Use sparse, reusable secondary checkouts for chapter
work; build the site once per reviewed milestone.

## Default worker topology

On macOS the same preflight also checks swap, combined resident memory of Codex
backend executables, and OS memory pressure. It warns at 4 GiB swap: inspect memory
consumers and swap growth before increasing concurrency. It refuses new work at 8 GiB swap,
4 GiB Codex backend RSS, or warning/critical pressure, even if disk is plentiful.
These conservative thresholds are not total-process memory limits. RSS misses
swapped allocations, so checking RSS alone would not have caught the crash.
Measurements that fail or cannot be parsed fail loudly. Non-macOS hosts explicitly
report the memory portion as not applicable; the disk rules still apply.

A preflight is a snapshot, not continuous protection. Repeat it before dispatch,
after work and every 60 seconds while observing active jobs. Follow the finite-chat,
sequential local-job and bounded-output profile in `PEOPLE_COMPLETION_PROCESS.md`.
Do not delete macOS swap files or Codex history to reclaim space. Stop dispatches,
preserve jobs and rotate the coordinator from a small handoff; a fork carries history.

Use one host checkout to prepare packets, run validators, and apply accepted results.
Each chapter/chunk/review round has a unique artifact directory or output path; keep
that ownership stable across restarts. Workers read only their sealed assignment and
write only that output. They do not need local repository clones. The date workflow
already stores jobs in chapter-scoped directories under `data/people/generated/`;
MCP extraction already uses one persistent runtime for all bots.

Disjoint chapters can share this checkout when the host owns canonical writes and Git.
Do not let concurrent workers switch branches, pull, stage, commit, rebuild global
output, or publish independently in it: the index and HEAD are shared. The existing
host workflow locks and queue reservations still apply. Artifact writers remain
isolated by their unique assigned paths, and independent review uses separate contexts.

Keep a small reusable pool of sparse checkouts only for tasks needing concurrent edits
to scripts or a different revision. Do not allocate a checkout per active chapter.
Prefer supplying a packet to another agent over supplying an entire repository.
Only the host can accept a fingerprint-matching result and publish canonical changes.

## Preparing workspaces

Use the app's managed worktree tools and reuse an idle checkout first. Before changing
an existing selection, inspect its Git status and verify no active worker, shell,
build, or service depends on it. Do not alter the primary checkout or MCP runtime
while they are in use. Preserve all changes and ignored recovery artifacts.

For a clean chapter checkout, run inside that secondary checkout:

```sh
git sparse-checkout set --cone scripts functions data/BOOK \
  data/people/schema data/people/chronology data/people/curation \
  data/people/extractions/BOOK data/people/date-audits/BOOK \
  data/people/date-repairs/BOOK data/people/date-audit-history/BOOK
```

Replace BOOK with the actual book. Cone mode retains root instructions/configuration.
For an even smaller exact-chapter selection, use the helper from the primary checkout:

```sh
node scripts/prepare-people-sparse-checkout.mjs \
  --checkout /absolute/path/to/secondary/repo --book hanshu --chapter 104
```

It previews the required files/directories. Add `--apply` after confirming no process
uses the secondary checkout. It selects scripts, shared schema/chronology/curation,
the exact source chapter, and that chapter's extraction, audits, and repair history.
Root configuration files remain available. Ignored recovery artifacts are preserved.
Omit `--chapter` for an entire book, or omit book/chapter for scripts-only work. It
refuses the primary checkout and any Git changes, and never creates a checkout.

For script work, select `scripts functions` and add only the needed fixtures. For
global people validation, select `data scripts functions` to retain the corpus while
omitting duplicate site files. Expand deliberately if a tool needs additional inputs;
do not weaken validation because an input is absent. Sparse settings are per worktree.

Existing clean full checkouts can first be reduced to `data scripts functions` as a
conservative migration: this retains all source, accepted evidence, and review rounds.
Ignored files remain local and must be audited separately. Sparse checkout does not
release claims or discard commits; omitted tracked files can be restored by expanding
the selection. Retain the selection when reusing the checkout for another task.

Do not create unmanaged `/tmp` worktrees for each chapter or review round. Independent
review requires a separate conversation and sealed evidence, not an entire copy of
the repo. Reuse a released workspace, or use a sparse workspace for concurrent work.
For a genuine different-revision exception, reuse an idle sparse checkout first.
If creation is unavoidable, use `--no-checkout`, configure sparsity, and only then
materialize the exact files. Never create a full checkout and shrink it afterward.
At low space, reuse rather than create.

## Completion and disk reserve

Archive completed or abandoned attached managed worktrees through the app after checking
process dependencies and preserving needed ignored data. The archive saves a recoverable
Git snapshot, including changes and untracked files, but does not save ignored files.
Keep incomplete extraction chunks, retained conversations, staged repair/review rounds,
and paid pilot artifacts until their owning work is finished or they are preserved
elsewhere. A clean status or merged PR alone does not prove a checkout is unused.

Check `df -h /System/Volumes/Data` before each local batch. Maintain 30 GiB free for
macOS swap and other apps. Below this reserve, start no new local checkouts or full
builds; continue only work that fits existing sparse workspaces, and reclaim verified
completed work first. Confirm actual free space after cleanup: directory totals can
include shared APFS extents and do not precisely predict reclaimed space.

The September 29 recovery reduced clean idle managed checkouts to `data scripts functions`.
Changed checkouts were retained for their owners to review. The main checkout, persistent
MCP runtime, and ignored recovery state were preserved.

Before any local batch or workspace change, run `npm run people:disk:check`. It fails below 30 GiB free or when a registered secondary checkout contains `public/`. Workers share the host checkout and isolated artifact directories; preserve all incomplete recovery work.
