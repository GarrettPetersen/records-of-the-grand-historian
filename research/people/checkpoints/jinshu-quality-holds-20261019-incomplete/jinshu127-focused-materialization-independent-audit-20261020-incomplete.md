# Jinshu 127 focused materialization: independent audit — HOLD

This is a limited, research-only check, not whole-chapter editorial, date,
identity, or publication approval. The materialized artifact is not ready to
publish: one newly added candidate disposition contradicts the source and two
paired literal fields remain unresolved.

## Pinned artifact and checks

The input source, prior extraction, prior history, proposal, and independent
review SHA-256 values in the materialization receipt all independently match
their actual files: respectively `cf2d789947d99dbd56ed75c96eb7e097d85e2699cf73e96268cf2fd22b90c264`,
`5f5e8325fd88a44c682cfa3ae475aad26df0841f0b39878b6e478691cf5b3fc8`,
`63ce6951e5ddefc83413787448dd900a8ac9eb282fa961392c5f34977e539a41`,
`72ba1c64e3cdf3acd3a243e463702e0e1131243b84ae2cf3e471ef372488c57d`,
and `39cef4a386aa9ce1ba05845a6bf7890bbd8253cd87e81e1b16cef6ba2dc0d188`.
The five output hashes also match the receipt; the receipt itself hashes to
`65e54e40b037ca4122ba70d7e8bb74375393f6cebc673d1339d7877141773e41`.
The checked output source hashes to
`6970c4c954c237823685d6e9accee73bb3e9a49e3aec0c92664c5998ff921652`
and extraction to
`f4cb3edee8fd984ef1ae1239a1d8ffed0054e26cf47f478af739118131ccfd0f`.
These are byte hashes, not chapter fingerprints; the extraction records
chapter fingerprint `sha256:a60004e5077ae400ef9f27c317f05149f251ec78efec6d50b523d06ab5501bd0`.

The exact staging-derived fixture's strict compact extraction and applied
editorial-history validators passed, reporting 278 units, 822 candidates, 165
people, 694 mentions, 916 claims, 30 repairs, 480 dispositions, and zero alias
disposition conflicts. This structural result does not establish semantic
correctness: the definite false polity disposition below passes it.

## Source and paired-field audit

Independent structural comparison found exactly 12 changed English fields,
in eight units: both fields in s0205, s0213, s0255, s0268; idiomatic only in
s0210, s0267, s0272, s0275. No Chinese field changed. All 12 appended repairs
are marked applied. The changed fields do apply the reviewed source-witness
decisions: Han is not Hancheng in s0205; smelting and the state salt office
in s0210 avoid iron/monopoly inventions; s0213 names the attendant and his
residence; s0255 has annexation rather than peaceful merger; s0267 restores
the stated forces and imagery; s0268 has vengeance against Qi, not on Qi's
behalf; s0272 qualifies the earlier bringing of Chao; s0275 restores the sons'
rank grant without assuming an earlier rank. These are focused observations,
not endorsement of every unchanged sentence or alternate wording.

- **s0272 paired field — HOLD.** The unchanged literal says De earlier
  "had welcomed" Chao, while the source `初，德迎其兄子超于長安，及是而至`
  distinguishes the earlier action from Chao's later arrival. The revised
  idiomatic instead says De earlier sought to bring him. The literal's
  completed welcome is at least potentially misleading and needs a separate
  source-backed wording decision; do not silently force a particular sense
  of 迎 or claim an independent full philological resolution.
- **s0275 paired field — HOLD.** The unchanged literal says each man's rank
  was "raised" two grades. The reviewer revised the idiomatic precisely to
  avoid implying a prior rank from `子為父後者人爵二級`. Review and repair the
  literal independently so the two fields do not make different claims.

## Full reconciliation-delta review

The diagnostics compares arrays by index, so the insertion of new mentions
shifts many entries without changing their semantic content. A separate
value-based comparison yields the following complete surface delta:

1. s0205 p118's English `Prince Jing` becomes `Han Prince Jing`; this matches
   漢城陽景王 rather than the old invented Hancheng location.
2. p114's grouped `Murong De` loses s0213 only; p114 gains `De` at s0213
   occurrences 0 and 1, matching both the revised English and the source 德.
3. p125 gains `Xun Jin` at s0213 occurrence 0, matching 遜進.
4. p154 gains `De` at s0272 occurrences 0 and 1, matching 德 and the English.
   The pre-existing p114/p154 duplication remains a separate identity gate.

The sole semantic candidate-disposition addition is **wrong**:
`cand_b79e43b7adcb8ce4`, s0213 English exact `Jin`, occurrence 1, code points
64–67, is categorized `not-person/polity`. It occurs in “Jin's residence”;
source `中黃門遜進扶德逾城，隱於進舍` identifies 進舍 as Xun Jin's
residence, not a polity. The first `Jin` occurs inside the already linked
`Xun Jin`; the second is the separate possessive. A proposed correction for
independent review is to remove this disposition and add the existing p125
`personal-name`, English `Jin`, s0213 occurrence `[1]`. Do not introduce a
second person or silently accept the old polity category.

Separately, the unchanged s0205 Chinese candidate `cand_2d07edf4384f74af`
is `漢城` spanning the boundary between 漢 and 城陽, not an independently
attested Hancheng. Its existing `not-person/place` disposition therefore has
an unsupported explanation. Review as an overlapping non-name candidate and
select a schema-valid disposition with an explicit boundary explanation; do
not treat this older unchanged error as a new automated delta.

Reconciliation has zero reported unresolved spans/candidates, but that is
not a semantic approval. Independently review any corrected exact artifact,
apply source and paired-field decisions through normal host workflow, then
perform complete fresh independent date and identity review on the final
fingerprints. No canonical data, queue, claims, locks, index, branch, checkout,
or build was changed by this review.

## Independent review of the follow-on reconciliation candidate

Reviewed `jinshu127-focused-reconciliation-candidate-20261020-incomplete/extraction.json`,
byte SHA-256 `cfff7a83582f27778d3088391e2c2633f63c43dbb9888850877464661fd7f6e7`,
against the materialized extraction pinned above and its unchanged packet.
The exact semantic delta consists solely of:

- adding p125's English `Jin`, s0213 occurrence `[1]`, as a personal-name
  surface and removing the corresponding false polity disposition; and
- replacing `cand_2d07edf4384f74af`'s `not-person/place` disposition with
  `not-person/not-a-name` and an explanation that its span crosses 漢/城陽.

Both changes are supported by the pinned source and the existing p125 record,
as described above. All other top-level extraction fields and all remaining
surface/disposition values are unchanged. Using the unchanged materialized
packet and reviewed history, the exact staging-derived fixture's strict compact
validator and applied-decision validator both pass: 278 units, 822 candidates,
165 people, 695 mentions, 916 claims, 30 repairs, 479 dispositions and no alias
conflicts. This supports the two focused reconciliation corrections only; it
does not resolve the s0272/s0275 literal fields, other known source defects,
duplicate identity, complete chapter review, dates or publication gates.
