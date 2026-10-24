# Three-generation combined-curation design assessment — incomplete

Research proposal only. No implementation, approved specification, candidate
approval, receipt, queue transition, canonical mutation, or publication has
occurred. This document does not authorize repinning retained state, reverting
the current extraction, deleting any lock, taking a live lease, weakening any
gate, or bypassing independent review. Scope and references below must be
rechecked before any implementation or use.

## Observed generations and implementation pins

- Current chapter source byte SHA-256 `813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`,
  semantic source hash `sha256:851915ffde8d18ff168794b13c6b900354ec593d983aa6fde461ffc82f9a7ce2`.
- Original retained workflow `state.json` byte SHA-256
  `d390bb71870faf925157b7f6d9b4286dc70ce4e4c9d93428f0001d594d91a383`;
  phase repair, round 4, 145 jobs; it pins the source above and original
  extraction semantic SHA-256
  `sha256:3c9b7490f95d01f8923f7683d7f9bd6911c741187013e9cd99552cf2f173aa58`.
  The original extraction at Git commit
  `a20371bc0c5c40fa328cdda3b05802a3625910ee` has byte SHA-256
  `8bc52f48690ff313a95b7a44d6a130d79e6dae3a58a3999a73382e89f4cf56ae`.
- Queue revision `4aca09929f40d88b55271e75e780d6423d494b2c` contains the
  active stable worker `jinshu-release-dates-022-cursor-sdk` claim with the
  same source and original extraction hashes, 145 jobs, and semantic JSON
  claim hash `sha256:1d78ea897ed15db8fee1e8a29c9489994aa713ffdc707a7c4a29319268d1d8b7`.
  This revision is historical evidence, not proof the live claim is unchanged.
- Current canonical extraction byte SHA-256
  `303d6e25bf1cf7d9bf3550eb00b7bc78b1c3ab1a01f3f3f11b0bfbb59a550918`,
  semantic SHA-256
  `sha256:ee27cc8c8ee5aedac8773fd32f2355327e0ea15dc7d41082261c51c525a5cf9e`.
  The separate `original-generation-hash-delta-20261020-incomplete.md`
  records 44 changed leaves in 41 claims and evidence that some blanket
  category changes do not describe the source correctly.
- Inspected implementation byte SHA-256s: `scripts/lib/people-combined-curation.mjs`
  `9b0c11385d25a8631571237f6856b983d63474734f6db1da5a8d16b104284690`;
  `scripts/lib/people-combined-curation-review.mjs`
  `97d13dea15828ca31adea6cd0c3b506cea550a30c0d75a6d59eee9f023257827`;
  `scripts/test-people-combined-curation.mjs`
  `2e2484e3c20ed005cc47ecb260ddf83db521618eec76e6fb07afdfff702fd8a5`.

No final after-candidate is selected by this proposal: all existing research
candidates remain provisional. Any actual receipt must pin the exact fully
reviewed candidate, source and complete independent reports at the time of
preparation, not infer their approval from this document.

## Why the existing protocol stops

`prepareCombinedCuration` snapshots current canonical before files and invokes
`verifyCombinedCuration`. The latter builds `oldPacket` from those exact before
source/extraction bytes, then requires both retained local state and prior claim
to match that packet. Here the current canonical extraction is not the retained
original. Simply inserting the current hash into old state, claim or reports
would misrepresent their evidence. Simply restoring the original canonical
bytes would overwrite a different generation and reinstate invalid labels.
Neither is an acceptable remedy. A full new date audit is required on the final
candidate regardless of what earlier reports conclude.

## Potential extension, requiring independent design and code review

A versioned reviewed drift-reconciliation receipt could explicitly preserve
three distinct snapshots: original packet generation, exact current canonical
before generation, and the fully reviewed after generation. It must derive and
independently review the complete original-to-current semantic difference,
including exact paths and old/new values. It must not characterize a category
rewrite as factually valid without source evidence. The drift review and final
full reviews have distinct roles; the former must never replace the latter.

Affected code, provisionally:

1. `inspectCombinedBefore` and `prepareCombinedCuration`: retain exact current
   canonical byte pins and workflow snapshot; separately include immutable
   exact original source/extraction snapshots, provenance, review artifact and
   drift inventory in a versioned receipt. Reject missing, stale, aliased or
   contradictory inputs. Preparation remains offline and must not write the
   queue or canonical files.
2. `verifyCombinedCuration`: validate retained state, original claim, old report
   and old-generation jobs against the *original* packet; validate canonical
   before independently against the current pin. Verify a complete, independently
   source-reviewed drift inventory against a freshly computed original/current
   diff and preserve every protected byte. Require the final candidate and all
   independent identity/date reports to match their exact source, extraction,
   editorial history, and review seals. Reject carrying forward old date
   approval. Reviewer exclusion must cover all extraction/chunk and repair
   authors from both generations, including the drift and amendment authors.
3. `validateCombinedReviews` in `people-combined-curation-review.mjs`: retain
   current source and extraction as `beforeSource`/`beforeExtraction` for
   existing source-repair replay, provenance, dispositions and independent full
   candidate checks. Separately validate original-generation provenance rather
   than rewriting it or treating it as the canonical before image. Adapt only
   what a reviewed precise contract requires; no blanket support for arbitrary
   source patches or identity changes.
4. `canonicalState`, `completeState`, `completeClaim`, and
   `publishCombinedCuration`: retain the exact current-before/approved-after
   third-state guard, durable receipt before writes, original claim and report
   history, full local workflow artifacts, exact original-to-final transition,
   production after-write validation, same-receipt crash recovery and the
   existing global lock, reservation and queue lease safeguards. The protocol
   must not reacquire or delete the existing lock contrary to the user's
   explicit instruction; changing this receipt does not confer authority to do
   so. Active or foreign leases must continue to fail closed. The known
   stale-lock reclamation race remains a separate unresolved operational issue.

This is not a claim that these changes are sufficient for safe production.
Existing documentation, JSON schemas, publication paths and cross-chapter
identity invalidation may impose additional constraints. A safety review must
establish how original bytes were acquired and whether the retained old date
report actually matches that old packet. Source-changing cases require their
own verified source history; current source equality here is not a generic
assumption.

## Mandatory proof obligations and scratch-fixture tests

Extend the existing synthetic test harness rather than touching the real queue,
lock, checkout index or chapter. Passing fixture tests proves only the machinery,
not historical correctness, independent approval or Jinshu 022 readiness.

- Reject missing, changed or mutually inconsistent original source/extraction,
  old packet, state, claim, report, retained jobs, byte/semantic hashes and
  provenance; reject live-claim drift when attempting publication.
- Reject omitted, added, reordered or incorrect drift rows, incorrect old/new
  values, unreviewed fields, unapproved categories, and author or reviewer
  independence omissions; do not accept a claimed diff without recomputation.
- Reject stale source/candidate/editorial/input-seal/fingerprint references,
  missing independent source/identity and full date checks, old approvals
  masquerading as new, and unsupported repairs or changed candidate surfaces.
- Test extractor/chunk and repair-author exclusions across both snapshots;
  test original and new editorial histories and exact approved repair replay.
- Preserve exact-before/exact-after and unrelated third-state refusal, active
  extraction reservation, concurrent and foreign lease rejection, ownership
  renewal, and lock safeguards. Exercise crash interruption at every existing
  publication checkpoint, receipt tampering, third-state edits, retained
  history/jobs, idempotent same-receipt recovery, and missing durable receipt.
- Check old/current source drift, schema-invalid category and unexpected
  run/provenance changes cannot silently ride along. Review any intentionally
  permitted delta explicitly and source-by-source, never by bulk label rule.

Publication still requires independently approved editorial repairs, full
fresh source/identity/date reviews, extraction and global identity validation,
normal ownership, a separately reviewed implementation and release gates.
This proposal leaves the existing lock and every queue claim and recovery
artifact untouched.
