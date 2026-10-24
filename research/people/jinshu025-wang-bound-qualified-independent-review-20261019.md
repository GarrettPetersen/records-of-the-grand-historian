# Independent review: qualified Wang Mang bound, Jinshu 025

Reviewer `/root/seal_materialize`, 2026-10-19. This is a narrow verification,
not a date audit or approval to publish.

The earlier review asked for explicit attribution of the conditional inference.
The revised p047 hint now states that the on-or-before AD 13 bound depends on
Hanshu's narrative sequence and the scholarly placement of the dowager's death.
This addresses that specific concern; the evidence still supports no AD 9 lower
bound or precise day, and the retained claim certainty remains `uncertain`.
An eventual curation and audit record must retain the underlying sources and
the distinction between a reported event and the inferred upper terminus.

I reran `test-jinshu025-wang-bound-qualified-20261019.mjs` using the e02a
staging loader and the existing pinned fixture. The output candidate's byte
SHA-256 is `4c62cdffa6cefe7d1781d9c531ea177efa20f3714237e8d2e180aebceb46f33f`.
The test reconstructs the complete prior candidate after reverting the single
p047 hint change, confirms every claim unchanged, compares source and editorial
history byte-for-byte, rejects tampering in each of the three inputs, and
confirms existing output cannot be overwritten. Strict compact validation
passes for 607 units, 681 candidates, 173 mentions, 448 claims, six repairs,
and zero alias-disposition conflicts.

This candidate is based on the prior three-date-holds source, not the separate
s0537 editorial provisional source. Combining those branches requires a new
fingerprint-checked materialization and validation. Remaining chronology holds,
an independently reviewed curation receipt, a complete fresh independent date
audit on final fingerprints, identity work, and publication/ebook checks are
still required. No canonical data, queue, lock, shared index, worktree, or build
was changed for this review.
