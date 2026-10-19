# Jinshu 053 candidate reconciliation: independent integration check

Research only: no canonical decision, repair, approval, identity merge, or date
audit. This checks the 30-candidate hypothetical packet and both prior research
reviews against the displayed Chinese and both English fields. The packet's
imagined source fingerprint is
`sha256:8de9f5f9ac87e22add5c990fca67916bf19c7d9809bfe13678572d7d1ce178de`;
the source has not been published at that fingerprint. Candidate coordinates
are for its idiomatic text only. The packet is not the production dossier or
decision schema: no production decision artifact can be validly sealed from
this input alone.

## Supported local interpretations, subject to regenerated dossier

The following are person mentions, with chapter-local person IDs and kind
`title-reference` unless stated otherwise. Suffixes are candidate ID suffixes.
These assignments are source-local and do not authorize cross-chapter identity
merges or claims about family relationships.

| Suffix | Local interpretation |
| --- | --- |
| 194668bbf5e9ac56 | p001, Prince of Guangling |
| e52f72d263aa7470 | p001, Crown Prince |
| 200b2d13ba5a3bd6 | p051, Prince of Liang; see s0063 hold |
| 6b8390c3b5e7e7f5 | p052, Prince of Huainan |
| 25dcca266b0a27dd | p054, Zhao within Prince of Zhao |
| c24d32ff69ebaf50 | p054, Lun, `personal-name` |
| 53e4f0d3d4cdc1db; a7ced6d11ecdf1da | p054, Prince of Zhao |
| 9e13cb8aefd7aadf; 8b50d48c050cf12b | p054, Prince of Zhao |
| 64a2c5fedcc5df96 | p028, Prince of Nanyang; see name/parentage hold |
| 6f06d15ca1c4a827 | p068, Prince of Linhuai |
| c558ac3414829511 | p054, Lun, `personal-name` |
| 789300eaa5a46e24; 8448bc18029fb928 | p054, Prince of Zhao |
| a9b9b1b7929dc11c; 0c939602d7e61a50 | p054, Prince of Zhao |
| b0652f53467c579a | p068, Prince of Puyang |
| 5021a0321e0edaa8 | p069, Prince of Xiangyang |
| dc3cdc7da8dba67c | p027, Lady Jiang |
| e70a7bd4b71a0007 | p054, Lun, `personal-name` |

The following are non-person candidates, using existing reason values. These
are contextual classifications, not chapter-wide rules for the surface.

| Suffix | Reason and local basis |
| --- | --- |
| 523e02b466ec9f5f | `not-a-name`: Heaven in the aura of a Son of Heaven, 天子氣 |
| b9ec23a9324923be | `collective`: All sharing grief, 同悲等痛 |
| 32c5b3c9f1791ff7 | `place`: Xianping Mausoleum, 顯平陵 |
| ceddecf925f4b2a2; 852bfc6c8ad0e262 | `collective`: All under Heaven, 天下 |
| 105b2fe617db5013 | `not-a-name`: Heaven as cosmological attribution in 天挺 |
| 3b5abb84a67a7e04 | `not-a-name`: ordinary conjunction Once |
| d007b642bf81eeaf; 86dce4b95424d9fb | `not-a-name`: Alas as 嗚呼 / 嗚呼哀哉 |

## Integration and editorial blockers

1. The supported labels exist in `scripts/apply-people-translation-repairs.mjs`:
   allowed `candidatePeople` use `candidate`, `person`, `kind`, `note`, and
   `candidateDispositions` use `candidate`, `disposition`, `reason`, `note`.
   But the production contract requires exact `schemaVersion`, `kind`, scope,
   dossier `input`, a person in its sealed local-person list, and every actual
   dossier candidate resolved exactly once. The research seed is not that
   dossier. Regenerate after all approved source edits are properly applied;
   re-review any changed candidate and do not fabricate or transplant input.
2. The explicit-assignment function starts with the candidate's exact span;
   it may retain/extend a covering existing same-person mention, but a bare
   `Prince` or `Zhao` candidate alone does not guarantee a whole `Prince of
   Zhao` link. Confirm actual reconciled full-title geometry and candidate refs
   on the sealed final text; do not claim the gap `of` is covered merely
   because both substrings were assigned. Separate p054 and p068 in s0183.
3. s0063's hypothetical idiomatic text spells p051 `Sima Tong`; prior primary
   source research supports `Sima Rong` for 肜. More importantly, its literal
   text incorrectly reads `Prince Liang of Liang`, `Prince Huainan of Yun`,
   and `Prince Zhao of Lun` for 梁王肜、淮南王允、趙王倫, respectively. Correct
   both fields through independently reviewed repairs, and then regenerate
   all affected candidate IDs, offsets, mentions and fingerprints. The title
   assignments do not approve either malformed rendering.
4. s0171 Chinese 字道文 gives the courtesy name only. Both hypothetical English
   fields insert `Bin` even though the preceding s0170 has a missing personal
   name. The s0170 literal also inserts `Bin` into the lacuna (the idiomatic
   says only "Three sons"). The p028 title in s0172 is locally defensible without supplying a
   missing name; fix both fields on evidence, and retain a lacuna if no source
   justifies reconstruction. Likewise, s0017 says Lady Jiang bore a son but
   does not identify him as p028: that is a separate extraction/relationship
   correction, not an inference licensed by the Lady Jiang mention.
5. Nearby packet context is obtained from flattened physical source blocks,
   not numerical ID order. For example, s0199 has s0013 as its previous context.
   Interpret sequential references from source structure and original text;
   do not infer ancestry, chronology or adjacency solely from IDs or packet
   `previous`/`next`. Resolve the broader source/identity evidence independently.

These findings do not prove complete candidate accounting, editorial closure,
date approval, identity clearance, publication or ebook verification.
