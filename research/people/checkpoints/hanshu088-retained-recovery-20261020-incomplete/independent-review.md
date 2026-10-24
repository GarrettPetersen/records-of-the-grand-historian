# Hanshu 088 independent retained-candidate review

Incomplete research checkpoint only. Do not replace canonical files or count a
chapter complete on this evidence. The review concerns staging commit
`badf6573cb7ea861bbb244fda4ddb446735740c8` and the existing isolated fixture
`/tmp/hanshu088-stage-check.wLwd0wXT`; it did not mutate the queue, shared
worktree, index, owner claim, lock or saved chapter.

## Exact candidate inputs

- Fixture source bytes SHA-256 `caf88a6a1235eebe20dc7c339e5a79dcbff11f7e4b45ec0dcb3335c27a1f260e`.
- Fixture normalized extraction bytes SHA-256 `d4ce24ce03e95b5fc025c44bf5cb9a040d3a020344c1fb931fbe377dc3f98cad`.
- Fixture editorial decision bytes SHA-256 `b0c8109ce3d7fd61bdf0ffdb87419288d8ac2fcfd5d49b6ea0210298641a1226`, identical to staged decision document.
- Normalization receipt bytes SHA-256 `063114f78631410fc32fb61a57e55f1c88c70a9f3d72e844609a5dab0eb0c325`.
- Original local extraction byte hash is `25ec0a45db090fb2a4c338888e024612d4ae6f51810946216afc514c949f98ba`; staged baseline extraction byte hash is `7121391e386dab5a2c154d384d9ecd34479405121974cc6531c81266d717f940`.

## Source and editorial checks

An independent recursive JSON comparison of fixture source to staging found 18
changed English literal or idiomatic string fields and no other source changes.
Every before/after string matched an accepted or revised decision in the
staged editorial history: r0030, r0032–r0039 and r0040–r0048. In particular,
the three values that differ from the original proposal after-text (r0032,
r0042 and r0043) exactly match the reviewer's revised `after` field. This is
an editorial history and source-delta check, not a fresh complete translation
review. Extractor chunk conversations and the later reviewer have distinct
recorded agent IDs; no additional independent date or identity review follows
from that fact.

Running staging fixture `npm run people:validate -- --book hanshu --chapter 088`
again passed: 150 local people, 799 mentions, 1,511 claims, 0 proposed and 47
applied repairs, 48 decisions, 6 claim retractions and 1 claim revision.
The validator reports one record without an active-date hint; scoped validation
alone is not a date, cross-corpus identity, publication or ebook approval.

## Normalization and current audit

Independently replaying the receipt's 124 exact hint-string changes in memory
against the original local extraction produced JSON exactly equal to the fixture
candidate. Its computed semantic SHA-256 is
`sha256:98ccc87c42008b5c0d63563b911e55665d08f40ee7837ffff7e4bf74004a865d`,
matching the receipt. The receipt's recorded before byte hash matches the
original local file. This validates formatting scope only, not the historic
correctness of the pre-existing hints.

The fixture's rebuilt date packet has source semantic hash
`sha256:87413567c1cf5ce97445626f93c9a47131f91651680e54c0f9bdc340662b9d24`,
extraction semantic hash
`sha256:98ccc87c42008b5c0d63563b911e55665d08f40ee7837ffff7e4bf74004a865d`,
314 source units, 473 date items and 150 people. The current date status is
`stale`; the retained staged `research-blocked` report was for source
`sha256:14d1afd653851f485e23dd713262e85d164b64497a10c8457fb1ae4337f13f92`
and extraction
`sha256:f04a048f888644326e313e00119b35926ad94a4a194ea1d1cdd29a73bced2f4d`.
Preserve the old finding and arrange a fresh, independent complete audit at the
final source/extraction fingerprints; never treat this older hold as approval.

## Identity blocker and queue ownership

This is not just normalization of the staged extraction: staging has 110
people and 141 claims, while the normalized retained candidate has 150 and
1,511. Thirteen staged local person IDs are absent from the candidate and 24
same-ID preferred name triples differ. Staging has 57 resolution documents
containing `hanshu:088:`; a scan found 90 distinct referenced local IDs, of
which 11 are absent from the candidate (p011, p012, p016, p036, p069, p076,
p077, p079, p080, p083 and p084) and 18 still-present IDs have changed name
triples. Name differences alone do not prove changed identity, but absent IDs
demonstrate that a direct replacement could invalidate or misapply existing
resolution decisions. Reconcile all affected identity evidence and validate
the full dependencies before canonical incorporation; do not silently carry
old decisions as current.

The pinned queue revision `4aca09929f40d88b55271e75e780d6423d494b2c` reserves
`hanshu/088` as sticky `ready` for cursor-sdk worker
`Garretts-MacBook-Pro-2.local-cursor-recovery`; there is no date-audit claim
in that snapshot. `ready` is retained completed extraction work awaiting the
appropriate base, not a free claim. Preserve ownership and all local recovery
artifacts. Recheck the live ledger before any subsequent host operation.

Recommendation: host may preserve the exact source, normalized candidate,
receipt and this review under a clearly labeled incomplete research path on
staging, without touching canonical source/extraction or queue. Canonical
promotion must explicitly reconcile identity decisions and stale dates and pass
all normal gates.
