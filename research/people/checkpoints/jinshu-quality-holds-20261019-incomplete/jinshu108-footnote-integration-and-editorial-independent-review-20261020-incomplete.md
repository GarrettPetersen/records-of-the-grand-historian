# Jinshu 108 footnote integration and editorial decision: independent check

Reviewer `/root/prov108`. This is an implementation and narrow editorial
artifact check, not approval of any footnote, identity, date audit, source
publication, or completed chapter. All hashes below are raw-byte SHA-256.

## Integration

Reviewed local implementation hashes:

- `scripts/lib/people-combined-footnote-review.mjs`:
  `331bd4a09904956ac3792f39dd878cbc4105711787bbd92032739af2c5af40fd`.
- `scripts/lib/people-combined-curation-review.mjs`:
  `9a842016db633f1fd09b1c4d098858ecf9603eb59525d6d516a76fd89bd5f133`.
- `scripts/lib/people-combined-curation.mjs`:
  `9b0c11385d25a8631571237f6856b983d63474734f6db1da5a8d16b104284690`.

Compared with the staging version, the review module adds the footnote import,
replays a reviewed contract after the already approved English repairs and adds
its author to the existing independence checks. Other existing curation review
logic is retained. The new contract admits only exact additions to unique
English translations, with exact before/after document hashes and reviewed
text; identity, date, validation and seal pin the same contract. The existing
receipt additionally checks raw source and protected materialization bytes,
current local references, exact original state and reviewer independence
against the recorded extraction/repair authors and declared authors. The
author list and factual accuracy still need real evidence: structural checks
cannot establish that every contributor was declared or that a reviewer
actually examined a witness.

`node --test scripts/test-people-combined-footnote-review.mjs
scripts/test-people-combined-footnote-integration.mjs
scripts/test-people-combined-curation.mjs` passed 360 tests, 0 failed. The
existing combined suite is registered twice because the integration test
imports its fixture, so this is not 360 distinct cases. Negative coverage includes
contract pins, self-review, stale same-chapter reference, changed protected
source bytes and the receipt hash. The three test-file hashes were respectively
`8f61dc57bb3128e69f75fb8c33916370e37042129ddcc9782ccd02303c4288e9`,
`4ba0cb3423d839d387c7d49b77433b097965d77e80d7862c6455c2c3d7b70e41`,
and `8cf39e2b16017e27d22f2a2e6f2ab3347933c5d11d560c2945c847f30e13475a`.

Important limitation: a synthetic **module-level** check showed that a note
asserting a second witness can pass with only a reference to the local source.
The production reference validator still checks that reference's current bytes,
but neither that nor the footnote module proves an alternate witness exists or
that an external quotation supports the assertion. For Jinshu 108, an
independent reviewer must verify and cite the actual alternate transcription;
do not interpret a structural pass as such verification. The policy document
`PEOPLE_COMBINED_CURATION.md` still describes the older literal/idiomatic-only
source boundary and needs to be reconciled before this code is adopted.

## Exact editorial decision

Independently rehashed the original source
`8c3f789a55588e130f64eac778decf43ebde6809f3ecb81ddc91b54a76d6cfbb`,
seed `f10f52baa17169dd0fd1b9e3c26ea491e15c19130a7caef21d2609c0a34e809e`,
proposed candidate `ff65c8a2d675f8ad532693a02bf4ac9f9cde384b880a9e01112693aed55c5f35`,
and resulting decision `187da53312050a8af44cfdb22e721638eadedf28ccb2561d82f141ad69b075b9`.
The fresh strict extraction validator and `validateEditorialDecisions` both
passed; seed and decision retain exactly the same proposals and input pins.
The two accepts concern r0007 and r0008 only, and the actual focused source is
`廆懼，首服。`; the reviewer explicitly conditions final presentation on a
separately reviewed variant note.

The decision is by `/root/date127`, session thread
`01a15307-cd8e-7e43-8e6d-4bfa37b4ba82`, not the identified preview and formal
proposal contributors `/root/editorial108` or `/root/pub_path_new`. The
reviewer's script excludes those and the pinned extraction author and retained
repair-job IDs. Its finding is limited to the two English amendments; it does
not approve the note or resolve the remaining chapter gates.
