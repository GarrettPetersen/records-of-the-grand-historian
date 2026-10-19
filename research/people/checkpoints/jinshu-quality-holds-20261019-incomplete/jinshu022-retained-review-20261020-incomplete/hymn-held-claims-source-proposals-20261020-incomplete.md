# Jinshu 022 held hymn claims: source proposals (incomplete)

Research handoff only. Input is `selected-receptions-candidate-incomplete.json`
(SHA-256 `2319764510c4848a8d07355273497f3844fd003c687433b5cf1367eb1b7ba7ac`),
against `data/jinshu/022.json` (SHA-256
`813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`).
No canonical claim, person, date, lock, queue, or approval was changed. The
following are source-oriented proposals requiring independent review, complete
validator checks and a fresh date audit against any eventual changed candidate.
In particular, changing a label must not imply that identity or dating is settled.

## Shrine hymn headings

- **355 / p054, 361 / p055:** s0226 `祠豫章府君登歌` and s0231
  `祠潁川府君登歌` are headings for songs at sacrifices to the named lords;
  they do not say that anyone received an honor named `shrine hymn dedicatee`.
  Proposed disposition: remove these two `honor` rows as unsupported/duplicative,
  retaining the name evidence and their companion retrospective-reference rows
  357 and 363. Those companion rows still need chronology and identity review.
- **377 / p058, 384 / p059, 395 / p060:** s0236 `祠京兆府君登歌`, s0240
  `祠宣皇帝登歌` and s0247 `祠景皇帝登歌` similarly identify sacrificial
  hymn headings, not an honor formally received called `Temple Stair Hymn
  honoree`. Proposed disposition: remove only those three `honor` rows; retain
  headings, posthumous names, and companion event claims 378, 385 and 396.
  Row 378 remains separately held for the identification of `曾皇`.
- **366 / p056 and 371 / p057:** both s0232 `于邈先後，實司於天` and
  s0233 `顯矣皇祖，帝祉肇臻` appear immediately after the s0231 Yingchuan
  heading, with no intervening heading before s0236. The note claiming the
  prior hymn heading lies outside the chunk is therefore incorrect in full
  chapter context. This supports hymn-reference framing, but does not alone
  establish whether 先後 is a queen mother, a former ruler, or a separate
  person from the dedicatee, nor whether 皇祖 is a distinct named individual.
  Do not auto-merge, keep as known separate persons, or upgrade certainty on
  this basis. Resolve the wording and entity with full-context source review;
  a retrospective reference may be retained only after person linkage is
  justified. Do not interpret `先後` as a queen mother solely from the existing
  translation.

## Music for assemblies and ancestors

- **449 / p066 and 455 / p067:** s0284 says `《於赫篇》，詠武帝`; s0285
  says `《巍巍篇》，詠文帝`. Proposed *narrow* category repair: replace
  each work-association's `receptionType: "posthumous"` with the only permitted
  value `"retrospective"`; retain `subject-of`, titles, cited units and both
  distinct claims. The surrounding s0279–s0283 discusses Du Kui, Zuo Yannian
  and later changes, not an explicit precise date of these two hymns. The Wei
  identity of each 武帝/文帝 must be checked separately; the titles are not
  sufficient to select a person across dynasties. No Western dates proposed.
- **582 / p083:** s0388 `皇皇顯祖` is in a sequence of lyrics praising
  ancestors (s0388–s0399); s0392 explicitly names 景皇. Proposed narrow label
  repair: `kind: "retrospective-reference"` for this hymn reference, while
  retaining the source and current certainty. It does not establish that 顯祖
  is a specific Jin individual or a formal temple name; identity and the
  existing `temple-name` claim need separate verification. Do not merge p083.
- **601 / p085:** s0396 `穆穆烈考` and s0398 `肇建帝業，開國有晉`
  provide a deceased-father/ancestor reference in the same sequence, not a
  uniquely named person. Proposed narrow label repair: `kind:
  "retrospective-reference"`, retaining source and certainty; separately review
  who 烈考 refers to and whether it denotes the same person as any other
  extracted figure. Do not derive a precise date from `開國有晉` alone.
- **633 / p090, 644 / p091:** s0426 `赫矣太祖` and s0430 `烈文伯考，時維帝景`
  do attest the names or designations in a lyric; neither passage narrates
  an action of holding a noble title. Proposed disposition: remove the two
  `noble-title` / `action: held` rows, preserving their corresponding name
  claims and companion reference rows 639 and 650. This does not retract a
  historically legitimate temple or posthumous name, assign its conferment
  date, or approve its linkage to another extraction.
- **639 / p090, 650 / p091, 660 / p092:** s0426–s0440 praises 太祖,
  帝景, and 先皇聖文 respectively. The permitted narrow label is
  `retrospective`: change invalid `receptionType: "posthumous"` to that value
  and use a compatible `retrospective-reference` event kind, while retaining
  all actual source evidence and avoiding invention of a performance date.
  Crucial chronology hold: these lines are within Xun Xu's song sequence under
  s0409, and s0290 says compositions were commissioned in Taishi 5 (AD 269).
  That is temporal context, not necessarily the exact composition or performance
  date of each surviving verse. The current `undatedSourceAttestation: true`
  must not be approved merely because no year appears in the isolated stanza;
  an independent auditor must determine whether an appropriate contextual
  bound is warranted and how to represent it. Do not silently drop or invent a
  date. The existing on-or-before-266 bounds in neighboring life-action claims
  are not evidence dating these later hymn references.

## Xuan and Wen in the Fu Xuan hymn

- **928 / p047 and 929 / p048:** s0110 records an edict in Taishi 2 (AD 266)
  commissioning Fu Xuan to make words for revised ritual songs; s0136 names
  `宣文` together as worthy counterparts of Heaven, and s0137–s0141 praise
  pacification and foundational work. The retrospective context is real, but
  the edict alone does not establish that each specific lyric was composed,
  performed, or completed in 266. Proposed narrow repair: change only
  `receptionType` to `retrospective` in each candidate, holding the exact-266
  `dateContext` for independent reassessment and retaining source references.
  The cross-person `otherPersonId` should not by itself imply that Xuan and Wen
  were each other's counterpart to Heaven; its intended joint-subject semantics
  need checking against the renderer/schema. If that cannot be expressed
  unambiguously, remove this field from these two claim rows only after review,
  while preserving both subjects and their individual evidence. Do not infer
  that all political achievements belong equally to both without scrutiny.

These proposals do not address all other held claims, the false-person p046,
translation defects, stale approvals, or identity resolution. They are neither a
chapter date audit nor a finding that the chapter is ready for publication.
