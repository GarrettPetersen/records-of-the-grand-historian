# Reconciliation guard v4 — research only, not approved

The patch `reconciliation-guard-303b4e0-review-v4.patch` is based on staging
commit `303b4e0fe883d4d305d84987b656322a91e5c3a4` and has SHA-256
`d9fc87de89f4005b24e937befb5472046c4474f28ab4d779be901d3b7153957e`.
It is not applied to canonical source and has not been independently reviewed.

The isolated library at `/tmp/jinshu127-guard.QGaCJs/scripts/lib/people-translation-repairs.mjs`
has SHA-256 `c35723e1dda71f6297b542588ecd2eb1f5a8bd9762c6c752146001d89f5fe5d9`.
The isolated CLI has SHA-256 `f592fb5aeb61b2fffbff45905d6e5bcd0c799f87c0081e720bea8f6f6a3c3476`.

The prototype generates a complete unscanned-occurrence packet bound to full
extraction, packets, reconciliation settings, and declared excluded reviewer
identities. It requires one exact source-witnessed decision per occurrence,
an identified reviewer outside that exclusion list, and valid links to offered
people. It can fail closed while emitting the packet, and it exposes CLI flags
for packet emission and reviewed replay.

Offline `node --test scripts/test-people-repair-name-collisions.mjs
scripts/test-people-repair-ambiguity.mjs` passed 26 tests, including a mixed
person/state homonym, incomplete or stale reviews, changed witnesses and
reviewer exclusion. `node scripts/apply-people-translation-repairs.mjs
--self-test` passed. These were isolated tests, not a production chapter run.

## Remaining blockers and limitations

- **CLI packet emission and replay have not been exercised end to end.** The
  library replay test alone does not establish safe CLI integration, correct
  artifact persistence, or correct writes after a fully validated real chapter.
- Independent adversarial source and code review is still required. The
  exclusion list depends on the operator accurately identifying every author.
- A non-person review is not encoded into the extraction because unscanned
  occurrences have no candidate disposition slot. Preserve the exact review
  artifact; later reruns against changed inputs can require renewed review.
- A merely overlapping scanner candidate currently suppresses the unscanned
  surface even if it does not cover the whole name. This can mask a larger
  unscanned name and must be resolved before adoption.
- Two overlapping unscanned surfaces can receive contradictory person and
  non-person decisions: v4 checks overlapping person links but does not reject
  mixed dispositions or a non-person decision overlapping a retained mention.
  This must be addressed and regression-tested before adoption.
- Existing conservative guard and CLI caller behavior remain subject to full
  regression and independent review; source review, candidate accounting,
  production validation, dates and identity gates are not bypassed by this
  research artifact.
