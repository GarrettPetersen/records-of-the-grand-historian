# Jinshu 108 s0090 materialization and focused note review — incomplete

Reviewer: `/root/progress108`, a separate conversation from the identified
contributors `/root/editorial108`, `/root/pub_path_new`, `/root/candidate108`
and `/root/material108`, and the English editorial reviewer `/root/date127`.
This is an independence attestation, not machine proof of authorship. The
previous provenance investigation and the materializer identify these authors;
an unidentified contributor would require the independence assessment to be
revisited. This review did not change the source, extraction, queue, lease,
locks or shared index.

## Pinned artifacts and mechanical verification

All hashes in this list are raw-byte SHA-256, not the production semantic
document hashes discussed below:

- Materializer `research/people/jinshu108-materialize-s0090-20261020-incomplete.mjs`: `9bd0325e24908d8bf92e3b4e00be1c6f9e48bcf67df22dcb7e551d924ff18717`.
- Current source `data/jinshu/108.json`: `8c3f789a55588e130f64eac778decf43ebde6809f3ecb81ddc91b54a76d6cfbb`.
- Retained `candidate-2.json`: `c2eeee0bea6a07b506feab07f655ec46882ace1c4f02faae84baee61a3821413`.
- Link preview `s0090-link-candidate-v2-20261019-incomplete.json`: `c4c3ac872baea71eec5e71cc540445fb4939732f3da70ed75fef424fc2a7892b`.
- Editorial proposed candidate: `ff65c8a2d675f8ad532693a02bf4ac9f9cde384b880a9e01112693aed55c5f35`; independent decisions: `187da53312050a8af44cfdb22e721638eadedf28ccb2561d82f141ad69b075b9`; prior editorial decisions: `bbf4eff8391fd9ef6e6c773b2f911436944c1082cda45b821437d304a41c730a`.
- Under `data/people/generated/date-workflow/jinshu/108/materialized-s0090-20261020-incomplete/`: `source.json` `a8c9facff77727db7b66dc2992357668cf8839c1723c1253542747e60b9ba270`, `candidate.json` `3ac2be52b301893d5b347334660a58abe56cdbd29872828208b3ad93d99dba74`, `editorial-decisions.json` `e5d9525feec28919d3abf4db0661b7035bffb0c150bab2d8c505eeefb84e215b`, and `footnote-contract-unapproved.json` `6c52b75f34d2904eb18fcc2d1c3645dcf74ebd29f6a55a8f20170d287544af11`.

I compared parsed documents directly. The source changes only s0090's two
English fields and adds its note; Chinese and all other source fields are
unchanged. Comparing retained candidate 2 against the output without treating
the deletion of a surface as a cascade of array-index differences, the only
surface changes remove p050's `Tao` at s0090 and add s0090 to p001's `Hui`;
the obsolete duplicate candidate `cand_82b7f03d9b1db47f` is removed, input
fingerprints are regenerated, and exactly the two approved repairs are appended
as applied. Other claims and people do not change. I re-created the merged
editorial decisions from the pinned old and incoming records: deep equality
with the materialized editorial record holds.

A separately built packet and strict `validateCompactPeopleExtraction`
passed: 213 units, 490 candidates, 96 people, 448 mentions, 634 claims,
8 repairs, 325 dispositions and zero alias-disposition conflicts.
`validateAppliedEditorialDecisions` also passed. The resulting chapter
fingerprint is `sha256:5017bddc500d67204b1aaf3fce01b9867c58108db75094c76f53fd33b32fa408`.
The contract's before/after production document hashes match the amended
source without/with the footnote, respectively
`sha256:115be62d43145cdc191f60c30b4c7eb3cbb322c16635a3c5d978d81b812d4ad2`
and `sha256:338337934634eb2b0fe0cb0ca8a895731fcdf924398a9033964b90531b3945b2`.
These hashes are not the raw-file hashes above.

## Focused source note assessment

The exact proposed note reads: “The displayed Chinese names Hui (廆); a
Siku-labelled Wikisource digital transcription instead names Tao (燾),
consistent with the surrounding account.” The displayed local Chinese is
`廆懼，首服。`. The ordinary [Wikisource Jinshu 108 transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7108)
also gives 廆 there, while the [Siku-labelled Wikisource transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B7108)
gives `燾懼首服` after Hui confronts Tao, and then says Hui sends Tao away.
I accessed both on 2026-10-19. The note accurately describes these digital
texts and the immediate sequence, and does not assert that either reading is
the historically original one. The Siku label alone is not proof of an
independent physical manuscript. This is a focused factual approval of this
exact note only, not approval of the complete chapter or a source emendation.

The full independent identity reviewer must still review the footnote
contract and all applicable chapter identity work. The existing research hold,
fresh independent complete date audit, editorial/curation sealing,
publication, rendered web and ebook verification, and release gates remain.
This review neither rewrites the sticky date workflow nor authorizes canonical
publication.
