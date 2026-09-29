# Local disk strategy

MCP GrokBot workers share one local runtime clone. The bridge serves sealed packets
and publishes through GitHub. Remote bots use the installed client and do not need a
repository clone for MCP work. Avoid local per-bot clones.

Git worktrees share history but duplicate checked-out files. A full task checkout can
contain 4.9 GiB of `public/` and 3.5 GiB of `data/`. Keep one full checkout for global
validation and milestone builds. Use sparse, reusable secondary checkouts for chapter
work; build the site once per reviewed milestone.

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
Managed creation may initially materialize a full checkout; check disk before creation
and make it sparse immediately. At low space, reuse rather than create.

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
