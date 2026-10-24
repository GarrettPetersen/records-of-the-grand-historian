# People-aware reviewed Chinese amendment: design assessment (not implemented)

This is a read-only design review, not a specification approval, finished
implementation, publication authorization, or change to production state.
It extends the host-owned combined-curation transaction rather than using the
general source-correspondence writer as a competing publisher.

## Retained prototype and independent findings

The frozen `chinese-amendment-prototype-20261019/` contains a draft
`replayReviewedChineseAmendments` and synthetic tests based on staging
`aee5f2592332776c6b8a02bbcfb2d6a4534360af`. Its exact unit before/after,
whole-source replay, contract hash bindings and declared reviewer exclusion
are useful patterns to inspect, but it must not be applied wholesale. It
continues to require new English repairs and its witnesses consist only of
author-provided URL/quote/reading fields. The separately retained
`jinshu053-amend-prototype-independent-review-20261019.md` reports an actual
offline counterexample accepting a fabricated witness. That finding motivates
sealed witness bytes and independently attested provenance, not merely another
hash over the same declaration.

The independent review also identified a shared-queue recovery race: the
publisher's `combinedCuration` marker survives an interruption, but an ordinary
date runner could reserve or reconcile that generation once its lease expires.
The currently inspected `scripts/run-people-date-workflow.mjs`,
`scripts/lib/people-date-workflow.mjs` and people queue module have no explicit
`combinedCuration` check; this text search is not a substitute for a full live
race test. A future implementation must fence *all* competing queue
reservation/reconciliation paths and test same-owner and other-owner attempts
at every crash boundary, including a pending marker before a durable receipt.
One local process lock is not a cross-host fence. Preserve sticky claims and
never resolve the race by deleting the marker or taking over a live lease.

Existing date-history reuse compares parsed reports rather than original
bytes. Archive and verify the exact old bytes (including when a semantically
equal but byte-different history file already exists), not merely parsed JSON.
The prototype also lacks a global impacted-resolution and external-audit
reference inventory. Its reported 133 passing synthetic tests and a
host-specific Jinshu replay do not resolve any of these blockers or validate a
real review. Reuse only after rebasing each reviewed hunk onto a frozen current
revision and independently verifying its complete dependency closure; preserve
the prototype unchanged.

## Minimal review contract

In `scripts/lib/people-combined-curation-review.mjs`, add a versioned, strict
`sourceAmendment` contract adjacent to `sourceReordering`. Its exact scope
includes book/chapter, nonempty author identity, before/after full-source
document hashes, ordered distinct unit IDs and, for each unit, exact old and
new Chinese strings, plus exact source-witness identifiers and immutable
evidence pins. Require nonempty genuine changes, valid unique target locators,
and replay from the exact before source. Only the chosen unit's `zh` may be
changed. Preserve all other units, block structure, translations and metadata;
reject duplicate, overlapping, missing, stale or unlisted edits. Compare the
replayed whole document to the contract's source-stage hash. Do not silently
normalize punctuation or infer a missing character. Reordering, amendment and
English-repair replay ordering must be explicit and tested; an initial
implementation can reject simultaneous reordering to reduce ambiguity.

Each amendment must have a specific independent human/agent review covering
exactly the changed units, citing an exact excerpt of a separately sealed
witness with URL, edition/version and provenance. Validate witness bytes and
quote membership; this establishes referential integrity, not authority or
independence of editions. The reviewer must explicitly identify the restoration
as supported and address materially differing variants. Require a distinct
identified reviewer independent of all source/amendment and extraction
authors; do not fabricate provenance or treat a checkable citation as scholarly
approval. An exact contract hash must appear in both full identity and fresh
date review contexts, their validation, and the sealed inputs. Bind the source
review and witness snapshots into the externally hashed durable receipt. Where
review roles are separate conversations, retain their true identities; do not
manufacture independence by relabelling.

Change `validateCombinedReviews` to replay the explicitly approved amendment
and then independently accepted English repairs. Keep full deep equality against
the exact candidate source, strict packet and candidate accounting, all
historical editorial decisions unchanged, full independent source/identity
coverage, a newly approved date report, all author exclusions and all production
validators. Its current `incomingEditorialReview` and `sourceRepairs > 0`
requirements mean a Chinese-only change is currently impossible: add a narrow
explicit source-only case with zero new English repairs that requires zero new
English editorial components, *only* where reviewed Chinese changes are
present and all existing history is byte-preserved. Otherwise retain the
existing exactly-one-new-editorial-component rule. Never let the source-only
case excuse English changes or proposed repairs.

## Publication and concurrency

Extend `prepareCombinedCuration`, `verifyCombinedCuration` and
`publishCombinedCuration` in `scripts/lib/people-combined-curation.mjs` so the
review report, witness bytes and amendment contract are required sealed inputs
included in the receipt; derive no trusted hash from a mutable current file
after approval. Preserve the existing source/extraction/editorial/date before
snapshots, prior shared date claim, workflow jobs, durable receipt and old date
report history. Keep normal reviewer independence, production validation,
queue reservation, renewable lease, global local date lock, before/after/third
state checks and idempotent recovery. Source-queue metadata, if closed, must be
bound to an exact reviewed item and included in a recoverable transaction; do
not mark it applied merely because a source draft exists. A first version may
leave the quality queue pending for a later independently verified no-op.

Critical limitation: `canonicalState` performs byte comparisons before writes,
but `durableWrite` is a normal atomic replacement, not a cross-process atomic
compare-and-swap. Its lock and shared lease protect cooperating people/date
writers only. The general `apply-source-correspondence.mjs` writer does not
participate in that fence. Before declaring a source transition safe, require
all writers of the source and companion files to honor a common cross-process
ownership protocol, or implement another proven host-controlled exclusion
mechanism covering the check-to-replace window. A recheck immediately before
rename alone still has a race. Explicitly test a conflicting live source writer
and remote lease loss; never take over a live executor or delete locks.
Likewise, multi-file publication is recoverable via durable receipt, not
instantaneously atomic to readers; verify that incomplete generations cannot
be published or observed as complete, including crashes after each write.

Preserve current cross-chapter identity decisions and identify affected rows
before any source/extraction replacement. Existing `PEOPLE_COMBINED_CURATION.md`
requires separate safe invalidation for removed/split people; source changes can
also stale identity decisions without a removal. The extension must explicitly
account for the current applicable decision dependencies, preserve their exact
pre-change evidence, and either prove reviewed retention against current
fingerprints or invalidate and queue proper independent re-review. Do not mark
the chapter identity-cleared merely because the source transition succeeded.

## Offline test requirements

Extend `scripts/test-people-combined-curation.mjs` with a synthetic two-unit
restoration, genuine separate reviewer and sealed witness, plus source-only and
source-plus-reviewed-English positive cases. Exercise stale old text/unit IDs,
unreviewed extra Chinese/English/metadata edits, duplicate targets, no-op,
bad document/contract/witness byte hashes, missing or nonmatching witness
quotes, unsupported or missing per-unit decisions, missing author and extractor
provenance, self-review, changed candidate after sealing, missing full unit,
mention or candidate coverage, stale dates and identity evidence, and invented
or fabricated decision coverage. Reuse the existing scratch fixture and test
every `checkpoint` boundary for resume, exact before/after/third state,
idempotence, retained evidence, active lease/foreign owner, symlinks, external
hash mismatch, lease theft, and concurrent non-cooperating source writer.
Include identity-reference invalidation/retention and queue-only crash tests.
Run existing combined-curation and date-workflow offline suites plus scoped
production validators against the exact candidate after a separately reviewed
implementation. A passing synthetic fixture does not itself authorize the
real Jinshu 053 transition or prove full historical correctness.
