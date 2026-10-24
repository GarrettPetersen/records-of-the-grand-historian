# Jinshu 022 seven-reception composition: independent verification, incomplete

This verifies the combined object and reruns current local validators. It is
not a date, identity, editorial, completeness, or publication approval.
All hashes below are exact-byte SHA-256; the files reside in this directory
unless a different path is given.

- Source `data/jinshu/022.json`: `813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`.
- Cumulative input: `01d03455ea8ebadd823b7edbc63eccae5bd24150995efa4d809767a2aabdcfe3`.
- Xuan–Wen candidate proposal: `3ce2f2888c1b86a29c22d3d92ed8853e9987ff42756851de04d2cc0cc3ecb695`.
- Two-hymns proposal JSON: `c6384c840ff44bbcef6622aa77d52cb8a594b7c594ed016bdd5e3f2101e22ed8`.
- Three-hymns proposal JSON: `e5ef0048cf632a6e3bc4715357f04b4a9ad09f30752a351f45024e57298b16bb`.
- Composed candidate: `6f664654b5c0a8758dc467f5c94a41a0e042e178f4aa719c6fb79c5dc6466068`.
- Recorded diagnostics: `ff1d255a96c8a0314b453c42c692578eed6b0974472c035b550dea6eae0f9414`.
- Composition script: `c7ace547294c3fb24f46c357bbccc5346ac7f5151e5f21b80b3eb720fa7e1ea6`.

I independently reconstructed the combined object from the cumulative input,
the two Xuan–Wen rows and the exact before/after rows in the two proposal
JSONs. A deep comparison was equal. An independent complete row diff finds
exactly seven changes, zero-based claim indexes 438, 444, 627, 637, 647, 915,
916, and no other object changes. On 438 and 444 only `receptionType` changed
from `posthumous` to `retrospective`. On the other five only `kind` changed
from `posthumous-commemoration` or `posthumous-reference` to
`retrospective-reference`, and `receptionType` from `posthumous` to
`retrospective`. Date fields, source units, confidence, identities, claims,
surfaces and translations remain byte-equivalent at the JSON value level.
The Xuan–Wen narrow label evidence and outstanding uncertainty were separately
reviewed in `xuan-wen-reception-independent-review-20261020-incomplete.md`;
this composition check does not independently settle the other hymn identities.

I directly invoked `validateCompactPeopleExtraction` against a fresh
`buildPeopleExtractionPacket('jinshu','022')` and invoked
`dateAuditDiagnostics(dateAuditItems(candidate))`, rather than trusting the
recorded output. Both results exactly matched the saved diagnostics. The
extraction validator **fails** with eight removed-kind errors: c0796, c0797,
c0826, c0851, c0856, c0862, c1064, c1083. The date diagnostics likewise return
eight items: claim-304 / p047, 305 / p048, 334 / p051, 359 / p056,
364 / p057, 370 / p058, 572 / p083 and 591 / p085. These are one-based
date-audit item labels for the composed candidate; do not confuse them with
zero-based indexes above. Each flags a removed posthumous reception kind and
requires source-specific examination, not automatic relabelling.

The freshly recomputed date packet semantic fingerprint is
`sha256:dac10a7322a7764b93bae914b275514309b01ed2bae56e10e267c1fcc0fd6198`,
matching the saved report. Eight remaining diagnostics do not cover all
substantive problems. In particular: the Xuan–Wen AD 266 date, reciprocal
person link, shared alias and achievement attribution remain uncertain;
the three later hymn rows' `undatedSourceAttestation` and identity/kinship
need fresh contextual audit; p046 and s0130's translation/candidate accounting
remain held; prior removal of original claims 305 and 306 conflicts with the
retained review-4; and the earlier blanket label migrations require individual
source review. The original date-worker claim fingerprint differs from the
current staging extraction. Nothing here authorizes changing that ownership or
reusing old approvals. Independent date, editorial, identity, chapter-link and
ebook gates remain outstanding on the eventual exact candidate.
