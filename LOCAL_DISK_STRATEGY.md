# Local disk strategy

## Preventing duplicate storage

The November 18 storage policy supersedes local full-build instructions. One shared
source checkout is sufficient; global derived output is generated on ephemeral remote
runners. `compile-people-catalog.mjs` and the full registry runner fail before loading
the corpus unless running in GitHub-hosted CI or Cloudflare Pages. There is no local
override. Small isolated library fixtures and self-tests remain available.

- Normal reviewed source PRs run the existing **Master build gate** remotely. Its
  `npm run build` produces the catalog, website/search shards, HTML, sitemap and OG
  assets; qualification receipts retain the normal independent review/chronology/
  identity and product gates. Cloudflare Pages separately builds the deployed site.
  Inspect exact commit/run receipts and actual live URLs; do not rebuild everything
  locally merely to prepare or count a chapter release.
- For a manual build of an existing remote branch, run
  `gh workflow run master-build-gate.yml --ref BRANCH`. Record the resulting exact
  head SHA and run ID; a dispatch is not qualification. No local clone or full artifact
  download is required to inspect a small qualification receipt.
- Full canonical registry construction is remote via
  `gh workflow run people-registry-build.yml --ref BRANCH`. It produces one immutable
  shared generation, manifest and SHA-256 hashes, with a **160 MiB compressed artifact
  cap** and **seven-day retention**. Keep durable review evidence separately. Download
  only bounded packets/receipts for chapter work; do not unpack the corpus on this host.
  Existing pinned lookup generations remain unchanged; publishing a new lookup
  generation is a separate verified operation, never implied by this build.
  Repeated dispatch of the same commit reuses its existing artifact. Do not request
  full construction for an unrelated code/config edit: prove native pinned reuse.
- Full registry paths belong under one `identity-dossiers/GENERATION`, never inside
  a chapter job. Identical input fingerprints must reuse the existing immutable
  generation and its original provenance, not regenerate under another name. Use the
  existing bounded native delta path for membership-preserving dossier corrections.
  Genuine membership changes still require normal validated remote construction.
- `data/people/storage-policy.json` freezes the existing full registries that are
  still referenced by retained proofs. The read-only resource guard compares their
  manifests/file sizes and refuses **any new local full registry**. Do not add a
  retention entry to make a new copy pass. This is preservation of old evidence,
  not permission to keep producing historical whole-corpus copies.
  The guard also rejects local `catalog.json`, `catalog-shards/`, `site-index.json`
  or `site-index-shards/`, including partial generations made by old/direct library
  writers. Hosted builders are allowed to produce ephemeral global outputs; they
  do not inherit the local historical-cache inventory restriction.
- KDP exports are separate, on-demand book-release artifacts. Do not put EPUB,
  MOBI, print interiors or KDP bundles in the website deployment. Private CI checks
  may verify the ebook contribution from exactly the same accepted chapter inputs.

### Source-only host checkpoints

Save a JSON array of explicit owned source file paths, then use:

```sh
node scripts/create-people-recovery-checkpoint.mjs \
  --files /absolute/path/to/owned-source-paths.json \
  --prefix refs/recovery/NAME
```

The helper preserves HEAD, staged tree and owned working changes through Git objects
and named refs, without touching the primary HEAD/index. It rejects ignored/private
files, generated data, `public/`, dependency/cache directories, redirected paths and
directory copies. A checkpoint is limited to 64 MiB of explicitly selected source.
Unfinished model responses/proofs remain in their existing artifact paths, never
copied into Git to take a checkpoint. Repeating the same source uses Git's existing
content-addressed objects. No private recovery refs go into a public PR.

At **1 GiB loose Git storage**, the helper stops before writing more objects. The
host may use `node scripts/compact-people-git-storage.mjs` to preview, then `--apply
--receipt NEW_ABSOLUTE_PATH` while the coordinator and all host Git writers are idle.
It packs at most 3 GiB per operation with one bounded-memory Git process; includes
unreachable/recovery-only objects; verifies the full new pack and exact selected
object set; and removes only redundant loose copies. Refs, reflogs, old packs,
HEAD, index, source and historical objects are retained. This is **not GC** and
must not be replaced with `git gc`, prune or expiry. An interrupted/failed pack
leaves loose originals; inspect the receipt before another attempt. Cleanup is
serialized with builds/registry jobs and has its own worst-case temporary budget.

### Legacy recovery archives

Old `.git/worktree-recovery-*` directories may contain moved unfinished work as well
as reproducible output. Never delete them wholesale. The lossless archival helper
`scripts/archive-people-worktree-recovery.py` accepts only that legacy location and
a private `.git/recovery-archives/*.tar.gz` destination. It checks for open files,
hashes every original file, preserves filenames/modes/symlinks/extended attributes, verifies every archive
entry against original bytes, rechecks ownership and unchanged originals, and writes
a durable receipt before removing the uncompressed directory. It refuses an existing
or interrupted archive and reserves worst-case temporary space. It does not select
live chapter directories, registries, app history or another project's files.

Retain the archive and its receipt as recovery evidence. Verify the archive SHA-256
before restoring to the original location; use the same archival helper with
`--restore --source ORIGINAL_PATH --archive ARCHIVE_PATH`. It restores original
bytes, extended attributes, modes, symlinks and nanosecond mtimes into a new empty
destination, then verifies them; reconcile normally afterward. Plain tar extraction
alone does not restore the receipt's extended-attribute contract. Old evidence must be restored
before a consumer needs its original path. Never fabricate a seal or retag approval
because an old path was archived. Do not publish private recovery archives.

Run `npm run people:storage:self-test` and the disk guard tests before changing these
rules. CI runs the storage regressions. Actual free-space measurements, rather than
directory totals, determine whether cleanup cleared the 30 GiB admission reserve.

Identical retained registry payloads can be shared without changing any evidence
path, manifest, hash, offset or content. Preview with
`node scripts/deduplicate-people-registry-payloads.mjs`; after confirming no active
readers/writers, apply with `--apply --receipt NEW_ABSOLUTE_PATH`. The tool checks
every candidate's actual SHA-256 against its immutable manifest, rechecks ownership,
then atomically shares only identical read-only `dossiers.jsonl`/`index.jsonl` files.
Never hard-link mutable source, responses, manifests or receipts. Different registry
contents remain separate; there is no semantic merge or changed approval.

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
Any package-manager invocation is conservatively treated as busy, including dev
commands with flags. Use the direct Node command above for a manual run, rather
than wrapping cleanup in `npm run` and making its own parent look busy.

It then measures real free space again and issues one local macOS notification.
Busy, absent-cache and memory-pressure deferrals are inspected again on later
ticks; they are not falsely described as exhausted cleanup. A completed deletion
or failed/interrupted attempt is not repeated in that incident. If space remains
low or inspection fails, the incident requires host action. Delivered alerts and
permission requests are not repeated; failed notification delivery is retried.
The incident is rearmed only after **40 GiB** free is observed. The existing
**30 GiB admission reserve remains unchanged**; clearing a notification or freeing
a small cache never approves dispatch/publication. Run `npm run people:disk:check`
after any cleanup/external change and resume only on a full actual pass. Inspect
the receipt's latest measurement even when a prior incident remains latched.

### Cursor Cloud coordination through GitHub

Use `npm run people:disk:check -- --cursor-cloud-github-only` before dispatching
and while observing a GitHub-only Cursor Cloud campaign. Its claims, PRs, builds,
validation and artifacts must stay remote. The mode reports free space and whether
the local reserve is met. It waives only the 30 GiB admission floor. Low-disk
maintenance, memory limits, duplicate storage checks and measurement errors
still apply. For every local workspace change, artifact download, build, or
Mac-hosted MCP execution, run the default guard.

Receipts are in `~/.local/state/24histories-disk-maintenance/`: atomic `state.json`
and one `incident-*.json` per episode. They record measured before/after space,
the attempted cleanup, and pending action. No credentials or process arguments
are logged. A kernel `lockf` lock prevents overlapping timers/manual runs and is
released automatically on process exit/reboot. Its empty lock file stays in place;
file existence does not mean a lock is held. Never delete it during a running job.

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
contain 4.9 GiB of `public/` and 3.5 GiB of `data/`. Keep one shared source checkout;
global validation and website builds run remotely. Reuse a sparse secondary checkout
only for a genuine concurrent-code/different-revision exception.

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
