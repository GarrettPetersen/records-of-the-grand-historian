# Jinshu 129 s0223: source review of 鎮星 disposition

Status: **research proposal only; not an approved extraction or a completed
chapter**. This review does not apply any changes, replace the sealed inputs, or
establish any editorial, date, identity, or publication approval. A separate
reviewer must verify the exact resulting candidate before canonical application.

## Pinned evidence

- Staging revision inspected: `4cf8c9af8e349709b7ac11f57e85c6d57a12933f`.
- Stacked research input:
  `research/people/jinshu129-hanping-second-mention-20261020-incomplete.json`,
  SHA-256 `74e2d7077c164cdd9ba833dfaf1591f50dc94fe80e74f939c25f8e901dfd9c79`.
  It includes other unapproved work and is not a canonical extraction.
- In the staged Chinese text, s0223 reads `今鎮星在軒轅，而裕滅之，亦不能久守關中。`
  The preceding s0221 describes the stations of 歲 and 鎮 in military omen
  interpretation. In s0222 軒轅 denotes an ancestor; in s0223 it denotes the
  astronomical asterism. The latter distinction must remain sentence-specific.
- An independently hosted transcription of the same chapter reproduces the
  relevant passage: <https://www.shidianguji.com/zh/book/LS0005/chapter/LS0005_1513>.
  Taiwan's Ministry of Education dictionary identifies 鎮星 as an old name for
  土星 (Saturn): <https://dict.revised.moe.edu.tw/dictView.jsp?ID=116857&la=0&powerMode=0>.
  Academia Sinica astronomy teaching material likewise identifies 土星 with 鎮星:
  <https://idv.sinica.edu.tw/gupingao/teaching/Class3.pdf>.

The context is the location of a celestial body in an asterism, used as an
omen. It supports the planet as the referent, not a named human or a deity as
such. This conclusion does not deny that planets can be personified or have
religious associations in other contexts. The currently inherited disposition
is `not-person/deity`, with note `Saturn/garrison star`; the existing note and
the passage therefore support `not-person`, but not this particular reason.

## Exact proposed change

For candidate `cand_4d49e48d91b5c24c` only, remove the pair
`["cand_4d49e48d91b5c24c", "Saturn/garrison star"]` from the existing
`["not-person", "deity", ...]` compact group, and append the following pair
to the existing `["not-person", "other", ...]` group:

```json
["cand_4d49e48d91b5c24c", "Saturn (the garrison star) is a planet in this astronomical omen, not a person or deity."]
```

`other` is an allowed reason in the staged compact and expanded extraction
schemas, and the production validator requires a nonempty note for it. Preserve
all other grouped dispositions, source text, mention IDs and claims. This
proposal has not been run through the packet validator and should not be
represented as a validated replacement extraction. The nearby inherited
`cand_3faed49538785881` has the note `Grand Year star` under `deity`; this
review did not establish its exact candidate context, so it requires separate
source review rather than an automatic change.

The idiomatic translation's “garrison star” is an understandable calque but
does not identify the planet for a modern reader. An editorial reviewer may
consider whether to render it “Saturn” while preserving the literal field's
historical wording; this is a separate translation decision and is **not**
included in the proposed extraction change. Any accepted source edit requires
normal fingerprint reconciliation and fresh downstream approvals.

## Checks performed

Read both s0221–s0223 in the staged chapter and the independent transcription;
checked the exact candidate and original grouped row in both the staged
extraction and stacked research input; inspected the staged compact and
expanded schema enums and the validator's `other` note requirement; verified
the research-input SHA-256. No artifact has been generated or validated by
this review, and no canonical file, lock, lease, claim, or Git state was changed.
