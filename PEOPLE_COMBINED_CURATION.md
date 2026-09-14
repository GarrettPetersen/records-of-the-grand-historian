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
- The complete retained editorial history and exactly one new independently
  approved review component. Report hashes identify that incoming component;
  the full merged history is pinned separately. An older review cannot authorize
  the new source amendment.
- All extraction authors, including chunk authors, and all repair authors must
  be excluded from the independent reviewers. Preserve their provenance.

The source mutation is limited to approved literal/idiomatic translation repairs.
Chinese emendations, paragraph reordering and metadata changes are not supported
by this command. Do not bypass that boundary with arbitrary JSON patches.

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

A durable, content-addressed receipt precedes all canonical changes. Exact old
date reports, queue claims, local state and workflow artifacts are preserved.
Only after all canonical after-files validate does an explicit reviewed-generation
transition mark the new date claim and local workflow complete.

Resume an interrupted operation with the same receipt and hash. Only exact before
or after file contents are accepted; unrelated third-state edits fail. A hard-crash
lease must expire before resumption. Do not discard retained conversations or
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
