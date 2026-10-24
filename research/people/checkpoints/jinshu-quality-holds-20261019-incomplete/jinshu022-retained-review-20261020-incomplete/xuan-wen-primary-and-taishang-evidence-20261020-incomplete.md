# Jinshu 022: Xuan–Wen hymn claims and 太上 hold

Research proposal, not approval. This report is tied to the exact source and
the composed candidate SHA-256 values recorded in the companion JSON. Claim
numbers are one-based for this candidate; JSON indices are zero-based. Exact
before and after rows are in the companion; reject any hash or row mismatch.

## Claims 304–305: conditional narrow category correction

The s0110 edict commissions Fu Xuan's revised lyrics: `泰始二年，詔…但改樂章
而已，使傅玄為之詞雲`. The lyric invokes `宣文惟後，克配彼天` (s0136).
As a phrase in a later Jin sacrificial song about ancestral sovereigns it
supports retrospective hymn-praise, conditional on the extracted identifications
of 宣 and 文; it is not a separately received title or a contemporaneous
action of the persons. Change only `kind: posthumous-commemoration` to
`kind: retrospective-reference` on each of the two `event-participation` rows.
The existing repository reconciliation code maps that removed kind to this
supported value. The earlier independent report for the same hymn context,
`xuan-wen-reception-independent-review-20261020-incomplete.md`, independently
confirms retrospective treatment of related rows, but did not review this
exact pair on this candidate; a separate review of these exact rows is needed.

**Date hold:** retain the complete existing `泰始二年`/AD 266 `dateContext`
unchanged for a fresh independent audit, not as an endorsement of accuracy.
The edict is dated; s0136 does not say when this particular song was completed
or performed. It would be unjustified to assign the edict year to the hymn on
that fact alone or to invent an alternative numerical bound. The two companion
claims at indices 915–916 cite the wider lyric and carry the same unresolved
date; this proposed change neither approves nor removes them. Their reciprocal
`otherPersonId` fields may imply a person-to-person pairing that the text,
which pairs 宣文 with Heaven, does not establish. The assignment of later
achievements to both subjects, the individual alternate name 宣文, and the
cross-chapter identities require separate review. Prior date review required
retaining two now-removed honor claims; that conflict remains for independent
re-audit, not resolved by this proposal.

## Claim 334: hold, no categorical repair proposed

s0214 names an ancestral-temple spirit processional hymn; s0215–s0218 call
for the spirits to descend and bestow blessing; s0219 reads `赫赫太上，巍巍聖祖`.
The ritual invocation is clear, but those lines alone do not establish that
太上 is a specific separate human person, as opposed to a deity, collective
ancestor, or another interpretation of the parallel invocation. Nor do they
identify the individual recorded as p051. Earlier independent review of this
exact underlying issue (`held-ritual-claims-independent-review-20261020-incomplete.md`,
old claim 338) likewise held it. Leave the claim unchanged pending evidence
that resolves its referent and candidate accounting; mechanically converting
its removed `posthumous-reference` kind would make the row structurally cleaner
without settling whether there is a valid person to receive it. No chronology
or person merge is inferred. Other related asserted facts, including sex and
role, are likewise not approved by this hold.

Neither proposal nor hold approves identity, complete temporal coverage,
translation, validation, or publication. A fresh independent audit must cover
the eventual exact extraction/source fingerprint.
