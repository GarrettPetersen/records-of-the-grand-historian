# Jinshu 127 combined editorial/date materialization: independent audit

Research only; incomplete and not an approval of the chapter. Reviewer: `/root/independent_combined_127`, independent of `/root/reconcile_127`, the s0177 editorial reviewer, and the earlier focused chronology reviewer. No canonical files, queue claims, locks, or Git state were changed in this audit.

## Fingerprints and source lineage

- Independently computed SHA-256 for all seven inputs and eight outputs listed in `jinshu127-s0177-two-dates-reconciled-20261020-incomplete/receipt.json`; all match. Also verified all five input and five output hashes in `jinshu127-closing-materialized-receipt-20261019.json`, establishing byte-level lineage to its earlier s0232 snapshot and independently reviewed closing proposal. This is not proof that an ignored snapshot equals the current canonical source: the canonical `data/jinshu/127.json` currently hashes to `ae7e45ebf47268878ac456cacf2cca892b2abd080129f921015f13cdc9b1732a`, different from the combined source `cf2d789947d99dbd56ed75c96eb7e097d85e2699cf73e96268cf2fd22b90c264`.
- Compared the earlier s0232 source snapshot against the closing snapshot recursively: exactly three translation fields differ, s0277 idiomatic and s0279 literal and idiomatic. Compared that closing snapshot against the combined source recursively: exactly s0177 literal and idiomatic differ, and both equal the two independently revised decisions. No Chinese, metadata, or other source field was changed in this last reconciliation.
- Rebuilt the earlier editorial packet using the closing snapshot and ran current-checkout `validateCompactPeopleExtraction` with strict alias dispositions on the s0177 proposed extraction. Merged the recorded decisions into the previous editorial history and ran `validateEditorialDecisions`; two reviewed repairs were returned, and the merged history is deeply equal to the saved combined history. The review fingerprint binds those decisions to that earlier snapshot; it is not a blanket independent editorial approval of this chapter.

## Complete compact-extraction and packet comparison

I recursively compared every compact extraction field and row from the closing extraction to the combined extraction, independently of the reconciler diagnostics. `surfaces`, `candidateDispositions`, and `coverage` are exactly equal, as are all people, claims, and other root fields except the following explicitly enumerated changes:

- `input.chapterFingerprint` and the s0177 unit digest change with the source.
- Person p142's sole activity hint `BC 275-243` is removed, with no substitute date.
- One p141 attestation changes from an inferred `BC 206–195` interval with the discontinuous Chinese source text to the explicit undated tomb-sacrifice attestation. This is the intended source-specific assertion, not a newly added reception category.
- Two reviewed s0177 translation-repair rows are appended, marked applied; no other repair row changes.

Because the whole surfaces array is identical, all 690 represented mentions, including their recorded IDs, source coordinates and referenced people, are unchanged in this particular reconciliation; this does **not** independently establish that all historical coordinates or identities are substantively correct. The unchanged p142 `retrospective-reference` is an existing descriptive event, not a newly introduced closed-vocabulary reception label. No other claims or individual records were silently changed.

Using the current checkout's production functions, I rebuilt the extraction packet and the final date packet and obtained deep equality with the saved final date packet. Strict compact-extraction validation with `strictAliasDispositions: true` and `validateAppliedEditorialDecisions` both pass: 278 units, 817 candidates, 165 people, 690 mentions, 916 claims, 18 repairs, 479 dispositions and zero alias conflicts. I also rebuilt the pre-date packet and independently applied the saved date proposal; the resulting extraction exactly equals the saved final extraction. Both date packets contain 381 items with identical ordered IDs. The pre-date target `claim-335` has hash `sha256:f16bc8d9d799d7af1abc9a04c2d6233a9f91ae401bc329cabfe064279dd43619`; its final hash is `sha256:9b259f339919819b8730f1cd1a25cf04d72f4b08f176ffb17f6b59511bd2ef49`. Therefore neither a bare packet-relative ID nor an old claim hash may be treated as current approval.

## Substantive caveats and next gates

- The focused date review supports the two narrow conservative changes but explicitly leaves p141 Gaozu's unchanged `BC 206-195` activity hint unproven. A fresh independent full audit must research that hint and every other date against the final source and extraction. The s0177 AD 400 contextual conversion likewise remains unaudited.
- The s0177 review reads locative 焉 as the immediately preceding temporary temple; its reviewer expressly identified that antecedent as plausible but interpretative. Neither a specific recipient nor the document's precise contents are independently established by this repair.
- The source metadata still has the pre-existing English/raw title `Volume 12 Records 27: Murong De`, whereas its Chinese title is 卷一百二十七 and this is chapter 127. This mismatch was not introduced or repaired here and needs an independently handled source correction, with fingerprint invalidation assessed.
- These validators check structure and existing history, not a full source/editorial, chronology, identity, publication, backlink, search, or ebook review. The saved candidate is not canonical; no prior date approval carries forward to its new fingerprints. Reviewer independence, exact current source, shared-queue ownership, full approval and normal publication gates remain mandatory.
