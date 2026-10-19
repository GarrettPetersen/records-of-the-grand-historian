# Exact-byte date-report archival: proposed protocol, not implementation

Basis: staged revision `29469570bc6e35d27aae9cb9e75baea9d522abce`;
`scripts/lib/people-date-audit.mjs`, `scripts/lib/people-combined-curation.mjs`,
`scripts/lib/process-run-lock.mjs`, and their callers. No live files, claims,
locks, or recovery artifacts were changed. This is not approval to run a repair.

## Existing safety gap

The standalone `recordDateAudit` and workflow's recorder calls archive parsed
JSON under a semantic hash through replace-style `writeJsonAtomic`; the combined
publisher accepts an existing archive by parsed equivalence and also installs
absent history with replace-style rename. Formatting can be lost, and a
check-then-rename may overwrite a racing archive. The combined publisher and
workflow lock `date-workflow-run.lock`; the standalone CLI recorder does not.
The scheduler calls the recorder while holding that lock, so blindly acquiring
it again inside the recorder deadlocks or fails. That local path is not a
cross-checkout lock; its stale-PID removal is not sufficient cross-host fencing.
The combined publisher's queue executor lease by itself cannot atomically fence
a filesystem write after the lease expires. Existing legacy processes do not
retroactively honor newly installed checks.

## Required protocol and explicit trust boundary

1. Host identifies all report/history writers, checkouts and active processes,
   including previously launched versions, and waits for safe natural quiescence;
   no lock deletion or lease takeover. Every path that can replace report bytes,
   including the standalone CLI, workflow, publisher and recovery, must use the
   same reviewed transaction service and ownership protocol. No deployment may
   claim this guarantee while an old writer can still run. A host with unknown
   writer state must fail closed.
2. Serialize report mutation per chapter with a shared durable pending
   transaction plus host-held exclusive ownership. A scheduler already holding
   an exclusive lock must pass a verified, non-forgeable in-process capability
   to the recorder, rather than reacquire it. Use the shared queue reservation
   and matching transaction ID for multi-checkout coordination; no lease check
   alone may authorize writes after an ownership change. Specify a safe
   single-writer host boundary or enforce hard fencing of old hosts; a queue
   timestamp/token checked before rename is not hard fencing. Refuse malformed
   or pending transactions except matching recovery; never silently steal them.
3. Under that ownership, validate current source, extraction, existing exact
   report bytes, and candidate; seal a durable, no-replace write-ahead receipt
   containing exact prior bytes/hash, proposed bytes/hash, scope, owner, current
   inputs and transaction ID. Sync receipt file and every newly created parent
   directory before changing the report. A recovery reads the receipt, reacquires
   ownership, verifies the existing report is *exactly* either before or after,
   and refuses any third state. Preserve all receipts on mismatch or error.
4. Install the old report bytes into its history using a temporary file in the
   same directory, write fully, sync file, and atomic hard-link to the final name
   (no replacement). Sync the destination directory before report replacement.
   If destination already exists, read it without following symlinks and compare
   exact bytes; sync the archive and directory if durable persistence is not
   otherwise proven. Equal parsed JSON is not sufficient. On differing bytes,
   even when the semantic filename collides, stop and preserve both; do not
   overwrite or silently choose. Handle unsupported hard links/cross-device
   operations, storage-full errors and sync failures as failures, not fallbacks.
5. With ownership still valid, atomically install the new report only after the
   original archive is durable, and sync the new file and containing directory;
   finish the receipt transaction only when all associated publisher role files,
   state and queue changes satisfy their existing reviewed gate. Receipt recovery
   must be idempotent at every interruption point, including after archive link,
   after directory sync, after report replacement, and before final state/queue
   updates. Retain exact previous bytes and all receipts.

Path safety must cover every ancestor as well as leaf files, with directory-
relative descriptor operations and no-follow semantics; an `lstat` followed by
path-based open/rename is susceptible to ancestor substitution. The current Node
path APIs do not expose a portable `openat`-style solution sufficient for an
adversarial concurrently changing tree. Either use a reviewed platform-specific
descriptor-based helper, or explicitly require and verify an exclusively managed,
non-mutating trusted directory hierarchy throughout the transaction. Similarly,
`fsync` durability depends on filesystem/device semantics; test actual supported
platforms and document any stronger macOS flush requirement rather than asserting
that unit tests prove power-loss safety.

## Preconditions and test evidence for a future candidate

- Prove all live mutation paths use the shared service, including CLI, direct
  library callers, scheduler-held lock, combined publication and replay, and
  refusal by old or unknown writers before migration.
- Offline tests with isolated real Git-backed ledger and actual child processes:
  competing publishers/recorders across chapters and checkouts, same/foreign
  owner, lock contention, stale lease, ready/pending marker, stale writer after
  expiry, independently launched CLI and scheduler reentrancy.
- Crash/kill at receipt and archive creation, fsync, link, report replacement,
  each combined role, state and queue transition; matching recovery succeeds,
  mismatching receipt, archive bytes, source or ownership fails without changes.
- Equal JSON but differing bytes; no-replace collision races; malformed and
  symlinked leaf/ancestor paths; root substitution; storage and sync failures;
  cross-filesystem failures; duplicate replay; no lost original byte sequence.
- Test end-to-end schema/identity/review/publication gates and actual durability
  semantics separately. Never count a research hold as an approved chapter.

No candidate is provided because the existing code and process information do
not establish common ownership or a portable no-follow directory transaction.
The previous publisher and recorder prototypes remain unapproved and preserved.
