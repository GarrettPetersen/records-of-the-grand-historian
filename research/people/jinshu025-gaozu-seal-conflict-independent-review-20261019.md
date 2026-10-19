# Independent review: Jinshu 025 conditional seal bound

Scope: review of one noncanonical research candidate, not a complete date
audit, editorial closure, identity resolution, curation receipt, or publication
approval. The candidate remains incomplete and the sticky date work must be
preserved. The chronological inference is supportable only with its explicit
conditions; the current publication representation is **not approved**.

## Exact inputs and mechanical checks

At staging `e29dc9e5cdda6f73f9709ef0778af2b47d3e2a37`, I checked the saved
`jinshu025-gaozu-seal-conflict-qualified-incomplete-20261019/` candidate under
`data/people/generated/jinshu-identity-ref-64521198-20261018/`. Its byte
SHA-256 values are:

- `source.json`: `02c4c78e636051d3e81397d696443984f3963ebaad881805befcc60a92c6be78`.
- `candidate.json`: `8b0de4378494cb75542392033d582a826b820b77a10b8923555817e2c6f32d07`.
- `editorial-history.json`: `a2f590d7cd367d4293b69ae00cddbd4e3c1c105981c1ff845a60e493db841530`.

These are byte hashes, not sealed packet fingerprints. Compared with the
previous combined candidate `a5f5514f0f3ed3ce8638cf5da13028184af76684560937417bc04f5d7594f910`,
the only changes are p072's active hint and the s0537 attestation: the latter
replaces an unresolved value with a year-precision, one-sided `onOrAfter BC
207` bound and `uncertain` certainty. Source and applied editorial history are
byte-identical. This does not independently establish the legacy extraction
worker identities, the complete prior chronology, or all identity claims.

The staging-pinned validator code and 16-file fixture used revision
`e02a499df802b8c0eaa8f5cf9f06397c397fad11`; a Git diff confirms its relevant
scripts, schema, references, source, and editorial inputs do not differ from
the staging commit above. Independent rerun of strict compact extraction and
applied editorial validation passed: 607 units, 683 candidates, 80 people,
173 mentions, 448 claims, eight repairs, 528 dispositions, zero alias
disposition conflicts. Replaying the final qualification from its immediately
preceding saved candidate produced the same parsed candidate. A changed source
byte input was rejected by the hash-pinned materializer, and a synthetic BC
year zero was rejected by the extraction validator. These negative controls do
not prove the validators detect every historical or publication error.

## Source support and limits

Jinshu s0537 says that Han Gaozu wore the seal; it supplies no year. The
[Zizhi tongjian 9 and commentary](https://ancient-china-books.github.io/zizhitongjian/OEBPS/Text/5388.html)
place Ziying's surrender in the tenth month and quote *Han guanyi* on Ziying
presenting the First Emperor's seal and its subsequent use. The same note
attributes to Shen Yue a Lantian-seal account with the inscription matching
Jinshu. Those quotations and Jinshu establish a related literary tradition,
not archaeological authentication of a single physical object or a
demonstration that every seal account is identical. The differing
[Hou Hanshu annotation](https://zh.wikisource.org/zh/%E5%BE%8C%E6%BC%A2%E6%9B%B8_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B7078)
has a different inscription and places wearing at accession; do not silently
harmonize it with the Jinshu seal or assign the other episode a date.

The [Routledge Handbook](https://api.pageplace.de/preview/DT0400.9781317538233_A35095488/preview-9781317538233_A35095488.pdf)
is internally inconsistent: its chronology, printed p. 8 (PDF page index 20),
places Xianyang's capture and Qin's fall in 207 BCE, while Charles Sanft's
narrative, printed p. 24 (PDF page index 36), dates Ziying's surrender to early
206 BCE. The older seal review incorrectly called the timeline printed p. 20;
the PDF index 20 is not the printed page number. Neither position alone gives
an exact date of wearing. The 207 date of a subsequent entry alone is also
insufficient to prove when an earlier acquisition occurred. As independent
context, [Robert Eno's Indiana University teaching text](https://scholarworks.iu.edu/dspace/bitstreams/eed3bbd8-bbcb-44df-b9d3-937d6cae89c4/download),
printed p. 2, places the passes campaign and Ziying's surrender in its section
headed 207; it is an alternative modern reconstruction, not a newly calculated
calendar conversion. It also dates Xiang Yu's subsequent sack to 207, so it
must not be used to erase the competing chronology.

On the express premise that the Jinshu act belongs to the quoted sequence,
and with the uncertainty and conflicting chronologies retained, a 207 BCE
lower bound is a plausible conservative inference for the *reported* wearing.
It is not an explicit Jinshu date, first date of wear, continuous wearing,
proof of physical provenance, or a bound for the separate s0536 claim. No
upper endpoint or precise day is established. The research dossier and source
links must accompany any later independent audit; an unexplained reference to
"the cited handbook" inside the hint does not itself supply a citation.

## Publication blocker

On staging-pinned `personLifeSummary`, passing the actual expanded uncertain
attestation `jinshu:025:c0414` as the person's sole activity claim returns
`Attested on or after BC 207`. That summary does not include the `uncertain`
certainty, seal-tradition condition, or conflicting evidence. This is a
demonstrated single-claim presentation case, not a claim about the final merged
Liu Bang page, whose identity and other claims have not been resolved. It is
nevertheless sufficient to show that storing the qualification in an active
hint does not guarantee that it survives presentation. Do not publish this
bounded claim until the actual public and ebook render paths preserve the
relevant caveat or a separately reviewed representation avoids an unqualified
assertion. The chapter's other holds, full fresh independent date audit, identity
and publication gates remain open.
