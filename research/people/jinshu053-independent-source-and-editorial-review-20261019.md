# Independent Jinshu 053 source and editorial review: needs revision

Reviewer: `audit_053`, a separate conversation from the proposal author.
This is a focused review of the proposed dates and name classification plus
newly noticed source/translation defects. It is not a full chapter audit,
approved repair, identity review, or authorization to publish.

## Evidence and pinning

Inspected Git staging revision `837d6292433b50c8f1c0d752a3723df778b814ec`.
Byte SHA-256 (not semantic audit hashes): 053 source
`85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407`, 003
source `d163d68fb29b4a8f38ec63e70fcda6bf3f3168ccfed0b4d905f561a20e365150`,
004 source `9399721c862f5c50af2e2bd1a49542c63dd618b6eaa00ed971a76843a07871da`,
053 extraction `464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69`,
053 research-blocked report
`d3bb12dbc7db670357affb2e216790baffb359db62ce78478ff3d37c1ba93073`,
and editorial decisions
`b0b4a054119e26645b957b10703559d0ba5041b47f0ae207bcc682708a4df45a`.
The report records semantic fingerprints `sha256:fab0a59c5d375ac889d03e7530b083fed82c11b4521823e1330e8840637b84f1`
(source) and `sha256:a23f128f1371dc93275fa0f54af14e3d5952530b3e0e57975ccded564208c3b9`
(extraction). Do not confuse those with byte hashes. Recheck live inputs and
ownership before acting.

The independently inspected revised date candidate bytes hash to
`220b9103c2dacae2a68e5638b3f259c6f78c8a0a9ab9328b2f77c4779a83ecef`;
its proposal hashes to `6c6f262541de719722e7ac0b1f081b4f980038d916d9ba42414a62c6c0e25222`.
The separate p004 name candidate hashes to
`46ea9568a892f8c4fce0de43820cf56dcfee45f232b68383f390b759f2b4ec3d`.
These candidates are not the canonical extraction and are not combined.

## Findings on specific proposals

* **Claims 101 and 116:** Jinshu 053 s0003 states that Yu was bright in
  childhood, and Emperor Wu loved him and kept him near. It does not assign
  a specific calendar date. The proposed substantive undated attestations
  are faithful in isolation; do not imply that the affection is exactly dated
  by the separate fire episode or that it persisted throughout a reign.
* **Claims 102 and 110:** 053 s0006–s0007 describes a palace fire and says
  the prince was five sui; s0123–s0124 describes his killing and says 23.
  [Jinshu 004](https://zh.wikisource.org/wiki/晉書/卷004), s0117 and
  s0120–s0122, places his killing in the third month of Yongkang 1; the
  conventional corresponding year is AD 300. Under the stated assumptions
  that both age figures are reliable, both use inclusive calendar-year age,
  and the recorded death falls in the Chinese year conventionally numbered
  300, the calculation `300 - 22 + 4 = 282` is correct. It is an inference,
  not an explicitly dated fire and not an independently known birth date.
  A [published calendar reconstruction](https://sangokushi-biyori.com/reference-gregorian-calendar-282)
  places Taikang 3 in proleptic Gregorian 282–283. It provides a secondary
  calendar check, not independent proof of the two ages or their reckoning.
  [Homer Dubs's study](https://www11.ihp.sinica.edu.tw/storage/w2_file/1344QXDQBuy.pdf)
  discusses ordinal/calendar-year age in ancient Chinese texts, but that
  convention still must be explicitly applied and qualified here.
* The revised candidate improves the original by setting the attestation
  certainty to `derived`, adding s0124 as evidence, and describing inference
  in text. Its age-five statement remains explicit; the inferred date is not.
  Cross-chapter Jinshu 004 evidence and the calendar witness are not linked by
  ordinary 053 claim evidence, and the accompanying bibliography is an
  ignored research sidecar. They therefore are not yet a complete, tested,
  reader-visible citation chain. Do not publish the proposed 282–283 interval
  as certain merely because compact validation passes. A fresh independent
  date audit of the final fingerprints must assess this and all other claims.
* **p004 proposed new fire attestation and hint:** The source places Wu in
  the event, so the event itself is supportable. Its proposed date and hint
  depend on the same conditional chain. A hint is not a lifespan or a claim
  of continuous activity. Review the actual rendered person page and ebook
  citation treatment before publication, rather than relying on the sidecar.
* **p004 `武帝`:** 053 s0003 and s0006 use that appellation. Jinshu 003
  s0636 explicitly records his temple name as `世祖`, while the historical
  identification of `武皇帝` as his posthumous name is corroborated by
  [All Jin Prose's biographical heading](https://www.xuoda.com/hj/qjw/004.htm).
  Reclassifying `武帝` from `temple-name` to `posthumous-name` is supported
  in principle; the separate candidate still needs the approved combined
  handoff, exact candidate validation, and identity-impact assessment.
  Preserve the appellation rather than removing it.

Additional caution: [Zizhi Tongjian 082](https://zh.wikisource.org/wiki/資治通鑑/卷082)
recounts the five-sui anecdote in a passage under Taikang 10, but the
paragraph starts `初` and looks back to Yu's birth and earlier events.
Its placement is not a direct assertion that the fire happened in 289.
Similarly, fires recorded in Jinshu 003 under 289 should not be equated
with this anecdote without specific evidence. The Tongjian passage is a later
witness, possibly dependent on the same tradition, not an independent
confirmation of either the event or its year.

## New source and translation defects; coordinate before resealing

The eight accepted editorial decisions concern the previously proposed
repair IDs; that receipt is not proof of a complete chapter-wide fidelity
review. Concrete examples against the staged source:

* 053 s0144 `幼稟英挺，芬馨誕茂` has idiomatic text `Praise for childhood
  brilliance.` This is a summary, not a translation of the funeral address.
  s0145–s0150 and s0152–s0165 contain numerous comparable summary-style
  entries. For example, s0151 `嗚呼哀哉` is `Funeral lament pause.` rather
  than a translation of the lament. An independent reviewer should assess the
  full literal and idiomatic sequence, not patch only these examples.
* 053 s0203 states `出就東宮` and then `今出東宮` in the edict. Both
  English fields first correctly say Yu moved to the Eastern Palace but then
  say he `leaves`/`left` it. In context the edict refers to that same move
  out to the Eastern Palace; the conflicting English direction needs an
  independent translation repair.
* 053 s0170 has `太子三子：、臧、尚`, omitting the first son's Chinese
  name. Its English fields already supply Bin. Two separate online
  transcriptions, [Wikisource](https://zh.wikisource.org/wiki/晉書/卷053)
  and [Shidianguji](https://www.shidianguji.com/mid-page/7463962545133617190),
  both read `太子三子：虨、臧、尚`; the immediately following son
  biography also identifies 虨. These are two digital witnesses, not proven
  independent print editions or a manuscript collation. A source restoration
  requires a separately reviewed source-witness handoff; retain exact
  provenance and do not silently change sealed source.

The discovered defects are localized enough for a scoped chapter repair and
independent review, but their presence shows that the existing eight-repair
decision receipt is insufficient to certify the whole chapter. Editorial
and source corrections should be coordinated first, with chapter-wide review
of both English fields and any source restoration, then strict extraction
validation on the exact amended source, a fresh independent complete date
audit, applicable identity reconciliation, and rendered site/ebook checks.
Changing any source or extraction fingerprint invalidates prior downstream
approval. Do not overwrite the preserved research-blocked report or reuse
the current draft as if its fingerprints still matched; follow host-owned
queue and receipt protocols. No canonical files, shared Git, locks, leases,
or ledger were modified in this review.
