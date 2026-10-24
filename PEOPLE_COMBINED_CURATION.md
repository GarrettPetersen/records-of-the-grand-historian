# Reviewed Source, Identity, And Date Publication

Use the normal workflow in `PEOPLE_DATE_AUDIT.md` for date-only repairs. The
combined-curation command is a separate host-only path for an already extracted
chapter whose reviewed repair also changes English text and person identities.
It does not extract chapters, call models, approve its own inputs, build, or push.

## Required Evidence

- Exact original source, extraction, editorial-history, date-report, local workflow
  and shared date-claim pins. Inspect the existing generation; do not bless drift
  by replacing its expected hashes with whatever happens to be on disk.
- A materialized candidate with complete independent source/identity and date
  approvals, full coverage, current references, and no proposed translation repairs.
- The complete retained editorial history followed by one or more independently
  approved review components. For one component, each report's review context
  pins its `editorialDecisionHash`. For multiple components, both report contexts
  and the input seal pin the ordered `editorialDecisionHashes` array. The receipt
  preserves the full history separately. Each new approval must match exactly one
  new applied repair and vice versa, and repairs replay in component order. An
  older review cannot authorize the new source amendment.
- All extraction authors, including chunk authors, and all repair authors must
  be excluded from the independent reviewers. Preserve their provenance.

Source mutations are limited to independently approved literal/idiomatic repairs,
explicitly reviewed whole-paragraph reordering, and narrowly reviewed English
footnote additions. See `PEOPLE_COMBINED_FOOTNOTE_REVIEW.md` for the additional
footnote contract and exact-byte seal requirements. Chinese emendations and
metadata changes are not supported; do not bypass these boundaries with
arbitrary JSON patches.

## Commands

```sh
npm run people:curation:self-test
npm run people:curation:publish -- --help
npm run people:curation:publish -- --inspect --book BOOK --chapter NNN
npm run people:curation:publish -- --prepare --spec /absolute/spec.json --out /absolute/new-receipt.json
npm run people:curation:publish -- --verify --receipt /absolute/receipt.json --receipt-hash sha256:HASH
npm run people:curation:publish -- --publish --receipt /absolute/receipt.json --receipt-hash sha256:HASH
```

Inspection, preparation and verification are read-only with respect to canonical
files and the shared queue. Preparation writes a new external receipt only; keep
its printed hash independently. The CLI help lists the spec and artifact fields.
Publish only after review of the candidate and the publication implementation.

## Ownership And Recovery

Publication uses the existing global date-process lock and shared Git-backed
queue lease. An unfinished operation must start from an active or research-blocked
date claim, not a ready claim that another extraction worker could reserve.
The original generation's hashes and retained jobs stay intact during writes.

The standard `apply-source-correspondence` command cooperates with this same
process lock for its entire write operation. The publisher and date runner
also fail if that lock already exists, including when it appears stale,
without taking it over or removing it.
This is not general chapter-write exclusion: many other source and translation
writers, as well as manual edits, do not honor this lock. The host must ensure
that none of those writers are running against the chapter during publication.
This lock is cooperative protection, not a guarantee of cross-writer exclusion.
This lock does not authorize Chinese emendations in combined curation.

A durable, content-addressed receipt precedes all canonical changes. Exact old
date reports, queue claims, local state and workflow artifacts are preserved.
Only after all canonical after-files validate does an explicit reviewed-generation
transition mark the new date claim and local workflow complete.

Resume an interrupted operation with the same receipt and hash. Only exact before
or after file contents are accepted; unrelated third-state edits fail. After a
hard crash the lock remains: preserve it and follow the host's authorized lock
recovery procedure before retrying. The lease must also expire before resumption;
neither an absent lock nor expiry alone authorizes a takeover. Do not discard retained conversations or
claim history, fabricate date-only recovery receipts, or force a foreign executor.

An independently reviewed code-dependency change can retain an unchanged full
chapter approval. Its addendum must pin the original true coverage verdict,
unchanged source and reports, original seal, and reviewed dependency delta.
Arbitrary truthy strings or regenerated hashes are not approval evidence.

After publication, run scoped people validation and `people:dates:verify`.
If the curation removed a person or split a conflated identity, also invalidate
the affected old comparisons with `pruneResolutionPeople` from
`scripts/lib/people-resolution-invalidation.mjs`. Preserve the original decisions
and the approved curation receipt hash in a separate curation archive first.
Retain unrelated comparisons; invalidation is not a new merge or separation.
Run the full `people:validate` before pushing an identity-changing checkpoint:
the scoped chapter gate cannot detect references in old cross-book decisions.
Accumulate reviewed chapter changes on staging, then rebuild and validate the
site and affected ebooks at a milestone. Extraction acceptance or a successful
receipt preparation is not date approval, identity completion, or publication.
