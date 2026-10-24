# Independent review: Jinshu 022 hymn claim proposals (incomplete)

Reviewed against `selected-receptions-candidate-incomplete.json` SHA-256
`2319764510c4848a8d07355273497f3844fd003c687433b5cf1367eb1b7ba7ac`
and `data/jinshu/022.json` SHA-256
`813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`.
Claim numbers below are **one-based** indexes in that exact candidate, not
stable identifiers. This is a source and proposed-label review, not a complete
chapter audit or an approval to publish. No data was changed.

| Claim | Disposition and independent source reasoning |
|---|---|
| 355 / p054 | Support removal of this fabricated `honor` row: s0226 is the heading of a hymn for sacrifice to the Lord of Yuzhang, not a grant of a title or honor called “shrine hymn dedicatee.” Preserve his name and the fact of the hymn separately. Companion 357's `received-shrine-hymn` wording should be checked, not taken as evidence of a personal act or a grant. |
| 361 / p055 | Support removal on the same narrow grounds: s0231 is a sacrificial hymn heading for the Lord of Yingchuan, not the conferment of an honor. Companion 363 needs the same qualification as 357. |
| 366 / p056 | Hold. s0232 belongs under s0231 in full chapter context, contrary to the chunk-boundary note. That proves the placement, not that 先後 is a distinct woman, a queen mother, or the dedicatee; the asserted `explicit` certainty and “ministering” characterization also require review. Do not convert, merge, or assert identity on placement alone. |
| 371 / p057 | Hold. s0233–s0235 likewise fall under the Yingchuan heading, but 皇祖 need not be a separate person from its dedicatee, and its exact referent needs review. Placement does not justify retaining an independently identified p057 or `explicit` certainty. |
| 377 / p058 | Support removing the purported received “Temple Stair Hymn honoree” honor: s0236 supplies a hymn heading, not a conferral. Companion 378's reading of 曾皇 as the hymn's dedicatee is a separate identity issue. |
| 384 / p059 | Support removing the invented honor. s0240 is the heading for sacrifice to Emperor Xuan, not an honor conferred on him. Retain the underlying title/name and hymn evidence subject to identity review. |
| 395 / p060 | Support removing the invented honor. s0247 is the heading for sacrifice to Emperor Jing, not an honor conferred on him. Retain underlying title/name and hymn evidence subject to identity review. |
| 449 / p066 | Support `subject-of` and replacing invalid `receptionType: posthumous` with `retrospective` as a narrow schema/category repair: s0284 expressly says the piece praises 武帝. The category change does not establish a death date, an exact date of composition/performance, or identity across dynasties. The contemporaneity and person linkage need independent review. |
| 455 / p067 | Same disposition: s0285 expressly says the piece praises 文帝. The subsequent mention of Zuo Yannian's tune does not independently supply the composition date or settle this individual's cross-dynastic identity. |
| 582 / p083 | Conditional support for `retrospective-reference`, since s0388 is ancestor-praising lyric, not a new office or living action. **Do not treat that label as identity approval:** the evidence does not by itself prove which individual 顯祖 designates, that it is a formal temple name, or that the strong inference attaches to the correct extracted person. |
| 601 / p085 | Conditional support for `retrospective-reference`: 烈考 in s0396 is a father/ancestor epithet and the lyrics in s0398 refer to founding Jin. The referent and assignment of a separate person remain unproved by those lines alone; a founding mention is not an exact hymn-performance date. |
| 633 / p090 | Support removing `noble-title` with `action: held`: s0426 calls the subject 太祖 in a lyric; it does not document holding a noble title or an act of conferral. Preserve the name/reference evidence; this is not a denial of a temple designation. |
| 644 / p091 | Support removing `noble-title` with `action: held`: s0430 calls the subject 帝景, not a noble title held during life. Preserve the reference and separately verify its personal and kinship linkage. |
| 639 / p090 | Support changing the invalid `kind: posthumous-commemoration` and `receptionType: posthumous` to `retrospective-reference` and `retrospective` respectively, **only as a label correction**. s0409 attributes the following meal songs to Xun Xu; s0290–s0294 report a Taishi-5 commission and Xun's subsequent songs. That context does not prove a specific composition/performance year for this stanza. The present `undatedSourceAttestation` needs a fresh audit against the full sequence, not acceptance merely because s0426 has no year. |
| 650 / p091 | Same conditional label repair and chronology hold as 639. The phrase 伯考 is spoken from a lyric's perspective; the extracted identity and kinship semantics need separate verification and cannot be settled by a category repair. |
| 660 / p092 | Same conditional label repair and chronology hold as 639. Its actual citation includes s0434 as well as s0435–s0440; preserve all source references. The identification of 先皇聖文 with the chosen person remains independently reviewable. |
| 928 / p047 | **Do not apply the proposal literally as a complete repair.** Changing `receptionType` alone leaves the prohibited `kind: posthumous-reference` untouched; `scripts/lib/people-reception-reconciliation.mjs` maps that kind to `retrospective-reference`. s0136 invokes 宣文 together, while s0137–s0141's subject and distribution of achievements require textual review; `otherPersonId` does not explicitly encode “joint subjects” and could imply an unsupported person-to-person relationship. The s0110 edict commissions Fu Xuan to write revised words in Taishi 2; it does not establish the exact composition or performance date of this particular stanza. Retain the unresolved date and content/identity questions for independent full review; do not silently replace the date with an invented bound. |
| 929 / p048 | Same defect and hold as 928: both prohibited `kind` and prohibited `receptionType` require correction, and the shared wording and reciprocal `otherPersonId` need source/renderer review before acceptance. Preserve both subjects' evidence without asserting identical accomplishments. |

The suggested Western equivalents AD 266 and AD 269 are not independently
proved by the quoted Chinese alone; they are calendar conversions requiring
the audit's independent chronology evidence, and no conversion or exact lyric
date is approved here. This review leaves all omitted claims, person identity,
translation, full validation and fresh independent date audit unresolved.
