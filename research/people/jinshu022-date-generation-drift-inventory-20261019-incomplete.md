# Jinshu 022 retained-date generation drift — incomplete

Research inventory only: this is not an editorial, identity, date or publication
approval. No canonical files, sealed jobs, queue claims, leases or locks were
changed. Index numbers below are **zero-based positions in the pinned original
and current extraction only**, not durable claim identifiers.

## Exact inputs and ownership

At staging `e158abbcde3d51be36d1ccad384e42659f404722`, source bytes have
SHA-256 `813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`
and current extraction bytes have SHA-256
`303d6e25bf1cf7d9bf3550eb00b7bc78b1c3ab1a01f3f3f11b0bfbb59a550918`.
The local current extraction matches that staging blob byte-for-byte. The
retained original extraction is in commit
`a20371bc0c5c40fa328cdda3b05802a3625910ee`, bytes SHA-256
`8bc52f48690ff313a95b7a44d6a130d79e6dae3a58a3999a73382e89f4cf56ae`.

At queue revision `4aca09929f40d88b55271e75e780d6423d494b2c`, the active
claim belongs to `jinshu-release-dates-022-cursor-sdk`, with 145 retained jobs
and no executor token or expiry. It and the local round-four repair state pin
source semantic hash `sha256:851915ffde8d18ff168794b13c6b900354ec593d983aa6fde461ffc82f9a7ce2`
and the **original** extraction semantic hash
`sha256:3c9b7490f95d01f8923f7683d7f9bd6911c741187013e9cd99552cf2f173aa58`.
The current extraction semantic hash is
`sha256:ee27cc8c8ee5aedac8773fd32f2355327e0ea15dc7d41082261c51c525a5cf9e`.
The saved state bytes hash to
`d390bb71870faf925157b7f6d9b4286dc70ce4e4c9d93428f0001d594d91a383`.
These are point-in-time observations, not permission to modify the claim.

## The 46 exact changed fields

The production-independent `computeCurationDrift` comparison returns only
`replace` rows, all under `/claims/<index>/2/`. The following three lists are
exhaustive; an index appearing in two lists has two changed fields:

| Field and exact before → after | Count | Zero-based claim indices |
| --- | ---: | --- |
| `kind`: `posthumous-commemoration` → `retrospective-reference` | 23 | 112, 122, 309, 310, 338, 352, 361, 367, 370, 375, 382, 389, 400, 423, 455, 462, 480, 591, 600, 610, 648, 659, 670 |
| `kind`: `posthumous-reference` → `retrospective-reference` | 2 | 342, 346 |
| `receptionType`: `posthumous` → `retrospective` | 21 | 112, 121, 122, 307, 308, 336, 350, 359, 365, 381, 388, 399, 422, 454, 461, 479, 642, 648, 653, 659, 670 |

Thus 46 fields changed across 41 rows. The prior original-generation note's
44-field total is an arithmetic error; its three subtotals were correct.
The inventory describes the changes, not whether the resulting claims are
supported. In particular, a valid `retrospective` vocabulary value does not
prove an event is a later reception. Existing independent review flags living
officiant, hymn-recipient and other counterexamples; never apply a blanket
relabeling as a historical decision.

## What can and cannot be reconciled mechanically

The exact original/current leaf differences and their hashes are mechanically
reproducible without touching either generation. Sealed review jobs and old
proposals can be inspected and replayed against their *original* before-values
in an isolated research representation. This does not establish that all
proposals remain correct on a different generation. Claims are positional
arrays: the retained round-four candidate has added and removed rows; a
positional comparison to it has thousands of differences. Matching by index,
blindly replaying old edits onto current data, or deduplicating identical rows
can target a different claim. Require exact before-value checks and independent
source review of every nontrivial mapping; leave ambiguous mappings unresolved.

The existing combined-curation verifier builds its old packet from **current**
canonical before-bytes and requires both retained state and original queue
claim to match that packet. They do not match here. Neither changing historical
hashes nor restoring old canonical bytes is a valid fix. A reviewed
three-generation protocol is a possible design, not an implemented production
path: it must preserve the original snapshot, the actual current before-image,
and an independently reviewed final candidate separately, with complete
original-to-current drift and a durable exact receipt. See the retained
`three-generation-curation-design-20261020-incomplete.md` and the corrective
count addendum for the fuller proposed contract. The existing global lock is a
separate operational blocker; its mere existence does not authorize deleting it
or taking an executor lease.

The last retained independent report, `review-4.json`, is **needs-revision**
on its own candidate (`candidate-4.json` bytes SHA-256
`6525bc9dd9c94b2fbfca5132e4005b29ca3383dcdced01cca8dfa60ec4bb2419`).
It identifies three substantive issues: the undated Marquis Wen anecdote,
the likely false person at s0130, and the imported closed interval for the
Dayu hymn. Later focused research questions aspects of that review, so a new
independent reviewer must adjudicate; it does not supersede or approve the
failed report. Existing provisional compositions still fail the production
extraction/date vocabulary checks and do not constitute a finished candidate.

## Required proof before production

1. Re-pin both Git refs, canonical bytes, all retained workflow artifacts,
   reviewer provenance, and queue ownership; do not change a live or foreign
   lease. Review the complete 46-field original/current drift against source,
   including event subject and category, and reconcile source/editorial/false-
   person and identity impacts. Sealed historic work remains unaltered.
2. Independently review any protocol implementation. On synthetic fixtures,
   test original/current/final hash and provenance tampering, missing/incorrect
   or ambiguous drift rows, positional claim additions/removals, incomplete or
   self-reviewing authorship, stale candidate/source/editorial hashes, unsupported
   taxonomy, and old approvals presented as current. Preserve fail-closed
   concurrency and lock behavior, live/foreign lease rejection, exact-before/
   exact-after third-state refusal, durable receipts, every crash boundary,
   and idempotent same-receipt recovery.
3. Run the applicable offline combined-curation and date self-tests, including
   `node --test scripts/test-people-combined-curation.mjs`,
   `npm run people:dates:workflow:self-test`, and
   `node --test scripts/test-people-date-worker.mjs scripts/test-people-campaign-dates.mjs`,
   against the reviewed implementation in isolated fixtures. These are not
   a substitute for live chapter review.
4. After source/editorial corrections are closed, obtain a complete **fresh,
   independent** audit of the exact final source and extraction, including all
   owned checks and the three disputed findings. Independently review complete
   identity/name/mention coverage and validate the final extraction and applied
   editorial decisions. Then run scoped production validation and, at a reviewed
   milestone, the full people and date verifiers and normal publication/CI gates.

No candidate in this note is approved, and no chapter completion is implied.
