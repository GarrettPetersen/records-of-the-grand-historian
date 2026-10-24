# Independent review: sticky queue recovery patch v5

**Disposition: approve as a narrow sticky-ownership safety stopgap, not as a
complete post-publication reconciliation workflow.** This review is not an
approval to release claims, change the shared ledger, or count any chapter as
complete. The reviewed fixture was script-only under
`/tmp/people-queue-recovery-review.I9mfxzKC`; no repository copy or full build
was created. The isolated test writes fixture files only inside that directory.

## Exact reviewed files (byte SHA-256)

- `sticky-recovery-v5.patch`: `de6fd535947f315ddce4ba4bc234d88d510bf3018c8497d460c4c8ba84f743a0`
- `test-recovery.mjs`: `a8ed9e5f001af7479b912fd7b5af1db0357ed890307bf6b36d1ab4f5c4189cd0`
- Fixture `scripts/lib/people-work-queue.mjs`: `6f54c4cd4aa2a6dd723494280d6c35e45aa796c19ae0836e4a9072ca8485833e`
- Fixture `scripts/sdk-people-extract.mjs`: `29d89d30027ff34b37e6e4397f5433950f8d04240c71ffa414b805a9c21dcb6a`
- Fixture `scripts/people-work-queue.mjs`: `f6492160db177fbd9befbe53e117ab26d03ec1a6f88378bdea08ebd660994b6f`

`node test-recovery.mjs` passed, and `node --check` passed for all three
fixture scripts. I independently exercised in-memory collisions and inspected
the actual Grok target-selection code. These tests and code inspection are
not a live multiworker or remote-queue test.

## Scope of approval

- The earlier free-form-note based base-pruning path is removed, rather than
  treating a hash mentioned in a writable note as proof of validated origin.
- A foreign sticky Cursor reservation cannot be adopted via direct reservation
  or selected by the revised Cursor availability predicate.
- In my two-owner, two-chapter in-memory test, owner-a's `resume-required`
  chapter 001 remained with owner-a; owner-b's unrelated chapter 002 was
  reserved; the collision was surfaced in `reservedElsewhere`. This avoids
  the global synchronization failure reproduced against v3.
- In another in-memory test, owner-b's own `ready` chapter was blocked from
  redispatch and an unrelated chapter was claimable. Current Grok target
  selection separately excludes existing `ready`/`submitted` reservations,
  while selecting a worker's actual `claimed` recovery first; ready claims
  remain locked to their chapters, not to the execution slot.
- No live lease, lock, or sticky claim was changed for this review; no remote
  queue push, shared index operation, or production build was performed.

## Explicit limitation

The patch deliberately retains merged claims rather than deleting them from
current-looking metadata. It does **not** implement an owner-verified
post-master reconciliation procedure. Existing `release` checks owner identity
unless forced but does not itself verify current source, accepted artifact,
validation, and actual publication. Consequently Cursor `ready` and Grok
`submitted` claims can remain reserved indefinitely even after legitimate
publication until an operator performs a genuinely evidence-backed
reconciliation. Do not interpret this approval as permission to release them
without that evidence, bypass ownership, or use `--force` as a substitute for
reconciliation.

Before claiming the entire queue workflow complete, design and test a safe
post-publication path that binds the correct assignment and accepted output to
the deployed/base result, handles legitimate reviewed output changes, respects
sticky recovery and live owners, and maintains unrelated-work liveness. Also
run the applicable project-level and production-path tests in a suitable host
environment; the focused fixture is not a replacement for those tests.
