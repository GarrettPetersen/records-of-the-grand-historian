# Keep the shared host synchronized with master

The shared host is the current released baseline plus explicit, owned local work.
Publishing through an alternate index or pinned runtime does not synchronize it.

At coordinator startup, after a master merge, before preparing a new chapter and
before publication, run the resource guard and `node scripts/check-people-master-sync.mjs`.
The latter checks the live remote, local tracking ref, HEAD ancestry, and the presence
of released source/code/schema/certification files. It never fetches or repairs state.
A failed check stops new dispatch and publication, not an already running sealed job.

Only the host synchronizes, at a recorded Git/canonical-write boundary. Fetch master;
preserve the exact staged tree, working tree and old HEAD in named local recovery
refs before reconciling. Preserve ignored responses, credentials, dossiers, claims,
locks and recovery in place. Never reset, clean, overwrite, delete or auto-stash them.
Do not make another checkout or copy the corpus. Inventory overlaps and retain
unpublished work in recoverable Git objects; record the refs and changed paths in
the handoff. Do not push private recovery snapshots as a public source-code PR.

Bring the host to the released baseline. Active chapters' canonical before-inputs
must stay byte-identical until their owner can reconcile at an idle boundary. Record
only these deliberate exceptions in `data/people/generated/master-sync-receipt.json`:
`masterCommit`, `exceptions: [{path, sha256, owner, reason}]`; null sha256 means an
intentional sealed absence. A changed exception or a new master invalidates that
receipt. The receipt is not a content approval. Reconcile rather than retag reviews.

After sync, verify source/code and released extraction/date/identity file inventories,
rerun both guards, and report the exact master commit plus remaining owned overlays.
Ignored generated catalogs are not synchronized by Git: verify their generation
against current inputs or rebuild before using their counts. Use supported pinned
Git readers for immutable evidence; do not treat missing local files as missing work.

Unmerged recovery work needs an owner and a reconciliation list. Compare it against
master before applying it so already-released changes are not repeated. A dirty
checkout is a reconciliation task, never an indefinite exemption from synchronization.
