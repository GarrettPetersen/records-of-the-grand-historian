# Jinshu 053: two sealed reviews, one in-memory source transition

**Research diagnostic only; not an approved chapter, extraction, identity, date
audit, or publication.** No canonical source, extraction, review history,
queue, lock, index, or Git branch was modified by this check. The script emits no
candidate. In particular, its underlying earlier source and extraction are
research artifacts and do not equal staging's chapter or extraction.

## Reproduce

From the repository root with Node and the retained pinned fixture available:

```sh
node data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-dual-seal-atomic-check-20261020.mjs
```

The script SHA-256 is
`da19911a3dc6794cec051bbb371eb689ae9811bb00fb689b909efaa8ec6463ee`.
It pins every seed-declared input byte digest before parsing. The seed is
`jinshu053-reconciliation-review-packet-v1-incomplete-20261020/decision-seed.json`,
SHA-256 `ba3859f7bf7d979635bfc1d3b6bc7f140f52ac674052a82cc2f8660ef7fe7d48`.
The source is SHA-256
`26f2169267b866e9203dd05f902044aa6c7839d7b780bba10ce4a1b0066c7e78`;
the research base extraction is
`35620e8c25541384a137c93eb7d2c6324f7777f5b142860ef8fb74d8bcf2c131`;
the preexisting review history is
`9542ec6bf9385e9b1974d19c74c8227e902931abad8bc33cd58b18c27f696f10`.
The independently authored new review artifacts have SHA-256
`27a816a8fe092a1d6b2e748a24405e954f8f6a7d985f5d86aacd4feb46752096` and
`c1715d9dc4a58e1478296c35e74e9fa39a945473d74229799f0a14654527b263`.
All other draft and source input hashes and locations are in the pinned seed.

The retained fixture `/tmp/jinshu053-strict-5ce.NuGR9k1r` supplied the following
modules (SHA-256; transitive fixture dependencies are not separately pinned by
this diagnostic and should be verified against the target revision before use):

| Module | SHA-256 |
| --- | --- |
| `scripts/build-people-extraction-packet.mjs` | `6561e28aed4a472fb6bba80b84728b395b3254f893a4b9b42c8939ecff195245` |
| `scripts/validate-people-extraction.mjs` | `33b59627388be1735eae3a05fb0b36b4580eb8b2c4924b063f2f7ad66e1af2c6` |
| `scripts/lib/people-editorial-decisions.mjs` | `8c61394d8376d4c13263341f2a054a55bd67ed227da63f11a822050cfc1f0af6` |
| `scripts/lib/people-translation-repairs.mjs` | `ce87a452f7d3640add38cc7d502eabc540e25d44679f8adc86e90d785c28b8e4` |

## Verified and not verified

The two original research drafts independently pass the strict compact gate
against the same original packet and preserve the preceding review history.
Each review separately passes the editorial decision validator against its own
unaltered draft and the original chapter fingerprint
`sha256:437d9e2d76d520caafb8053f79304681fcece7139971add44cc572475c491007`.
Neither review contains claim revisions, additions, or retractions. The first
accepts 36 and rejects 24 proposal rows; the second accepts 60 and rejects 4.
The 96 accepted `(unit, field)` targets are disjoint. Applying those accepted
repairs in one in-memory transition yields the previously reviewed packet's
revised fingerprint
`sha256:8de9f5f9ac87e22add5c990fca67916bf19c7d9809bfe13678572d7d1ce178de`.

Both unaltered review documents fit together in the v4 history, including every
proposal and rejection, after the two previous records. Structural equality is
checked on each recovered v3 document, and the applied-history validator passes
against the in-memory repaired extraction. This establishes that the pinned
schema can represent these two distinct seals; it does not establish that any
new combined review occurred, that upstream history is genuinely approved, or
that the resulting chapter is editorially closed. The reconciler's zero
unresolved span count is only a mechanical signal, not semantic mention review.

The reconciliation helper also produces **24 new automatically inferred
dispositions and six unresolved candidates**. None is accepted or emitted by
this diagnostic; retained independent source-local research addresses their
individual contexts, but mapping those decisions to exact final title spans,
including links and offsets, requires a separate checked materialization.
Existing mentions and changed idiomatic and literal fields have not been fully
source-audited or cross-checked for missing names by this diagnostic. Known
research holds include the `Sima Tong` versus `Sima Rong` wording and a child
assignment; a later independently reviewed amendment or coordinated
re-proposal is needed, not silent editing of a sealed review.

At staging revision `fb7d452c30d5a579edca1555995d0e7daa030858`, the chapter's
source SHA-256 is
`85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407`, and
its extraction SHA-256 is
`464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69`.
The research base extraction differs from that staging extraction in `input`,
`people`, `surfaces`, `claims`, `translationRepairs` (14 versus 8), and
`candidateDispositions`. Its changed source is likewise not staging's. A
separate, exact review and reconciliation of all intermediate changes and
authoritative downstream fingerprints is required; this check cannot supply
that authorization.

Any real application also requires safe shared-queue ownership, no stale
writer, fresh independent date audit, identity-decision reconciliation, full
editorial and literal/idiomatic coverage, production strict validation,
publication checks, and the normal host-owned staging workflow. Do not import
the automatically generated classifications merely because the helper reports
them or reinterpret this report as an independent approval.
