# Independent review: reconciliation contract (research only)

This reviews a structural research prototype, not the Jinshu 129 extraction,
the correctness of its proposed changes, or a publication-ready implementation.
No production source, extraction, claims, locks, or queue state was changed.

## Reviewed inputs and observed controls

- `reconciliation-review-contract-20261020-incomplete.mjs`: SHA-256
  `a5ec3678c6fbcb5b8543a3e1cb487b8bbd5712cb99c23edc66e1f2552da48c96`.
- `reconciliation-review-contract-test-20261020-incomplete.mjs`: SHA-256
  `40721288e4a043075f519e7a2e0b888291d3c8578e601f1788f849f4393840b8`.
- `node research/people/reconciliation-review-contract-test-20261020-incomplete.mjs`
  exited zero, reporting 71 structural changes in its real-candidate exercise.
  That exercise uses a mock packet, mock provenance, and mock reviewer adapters;
  it establishes neither historical packet freshness nor independent approval.
- Real input byte hashes: `jinshu129-final-materialized-20261020-incomplete.json`
  `3aeaf2fc42220e9beeca59388b778b8988db53542ac3ba49fba8e95e17024c26`, and
  `jinshu129-saturn-disposition-candidate-20261020-incomplete.json`
  `507b0c22fb43f63401f29ad3684d49e26210e12f15e40cdaee6be4ecb4bcba89`.

The controls exercise missing and duplicate decisions, changed content,
untrusted adapter rejection, mutation while an adapter awaits, pointer escaping,
non-JSON value shapes, and a real extraction structural delta. They demonstrate
useful fail-closed building blocks but not actual production provenance or coverage.

## Remaining limitations and required integration work

1. With both adapters returning true, I reproduced acceptance of an unchanged,
   structurally invalid bundle containing `source: {}`, `extraction: {}`, a
   superficially shaped empty packet, an author array containing an object,
   fabricated hash-shaped context strings, and an empty decisions list. This is
   expected from a delta-only prototype that delegates trust, not proof of a
   working validation gate. Trusted host adapters must independently validate
   production schemas, rebuild and compare the packet against exact source and
   pinned scanner and glossary dependencies, establish historical receipt and
   actual byte hashes, and enumerate actual authors and downstream references.
   A no-op delta is not full extraction, editorial, date, or identity approval.
2. After `verifyReview` returned in that reproduction, the caller modified the
   reviewed extraction. The final rehash detects persistent mutations during the
   awaited calls, not later in-memory or on-disk changes. Publication needs a
   host-controlled immutable snapshot, fingerprint rechecks at the write boundary,
   atomic compare-and-swap semantics, and normal independent downstream gates.
3. Reviewer identity is a string until a real trusted adapter authenticates the
   sealed report and proves the reviewer is independent of *all* relevant
   extraction and repair authors. Hashing a self-asserted reviewer, or mock
   adapters accepting a fixture, is not evidence of independence.
4. Leaf-level structural decisions do not by themselves prove that unchanged
   references remain semantically correct when indexed claim or mention IDs,
   offsets, source hashes, or interpretation change. Explicitly inventory and
   validate references and invalidate or freshly review affected approvals.
5. The canonicalizer rejects accessors in its input eventually, but validation
   and report checks access some properties before that call. The interface
   should accept bounded, parsed JSON data under trusted ownership, not arbitrary
   adversarial JavaScript objects or proxies. Size and nesting bounds and strict
   schema checks should precede expensive recursive delta processing. No
   prototype-pollution exploit was established in this module itself.

Add integration tests using authentic sealed packets and reviewer records,
invalid/stale dependencies, malformed author and reference records, array
insertions and ID shifts, no-op coverage, post-return mutation and competing disk
writes. Test against real staged validators and history without assuming a compact
expansion's freshly stamped fingerprint proves the historical packet existed.
Until those requirements are implemented and independently reviewed, this
prototype must not authorize canonical edits or publication.
