# Jinshu 025 chronology proposals: Cao Rui and Cao Hongzhi

Source research for independent review; **not an approved date audit**, curation
receipt, or publication. Do not alter a sealed input or accept this note as a
substitute for a complete, independent chapter date review. This note targets
only the combined incomplete candidate below; check every before-value and
fingerprint before constructing a replacement candidate.

## Fingerprints and locators

- Candidate `jinshu025-s0544-editorial-combined-incomplete-20261019/candidate.json`,
  byte SHA-256 `ee2528391c5ac3daa3b675c517f7701903925abd699131c9e5b10e9d83a0564c`.
- Accompanying `source.json`, byte SHA-256
  `2f1980cd20d124b450e4e1eecfa7319a610a5fbe0669851206442603eed43ab4`.
- Indexes below are zero-based compact `claims` indexes, not permanent IDs.
  Verify owner, kind, evidence unit and full old temporal object, not index
  alone. Keep each sourceDate and non-temporal event/action unchanged.

## s0517: Cao Hongzhi and Emperor Ai

Jinshu s0517 dates the event only by the emperor; the phrase `立秋` specifies
the seasonal ceremony, not necessarily the day the consultation occurred.
An event-specific later witness, *Taiping yulan* 687, quotes a lost earlier
source under the title `晉書要事`: `哀帝隆和元年，太學博士曹弘之等議：立秋應讀令，不應着緗幘，改爲素。`
This records the **same named adviser and headcloth change** in Emperor Ai's
Longhe year 1. Its text is at
https://www.shidianguji.com/zh/book/SK1958/chapter/1kfso4k24eom2 . The exact
excerpt above has SHA-256
`da3b80b2d1740b0cfbdd11b86ceb7fad0d7c36f56898aa0ea1435d26aa3c4545`
(UTF-8, excluding quotation delimiters). A second transcription labels that
source `晉氏要事`, at https://www.arteducation.com.tw/guwen/bookv_15538.html ;
record the attribution variant instead of pretending these are independent
original witnesses. Both are later compilations of a purported earlier text,
not a surviving autograph or proof of textual independence from Jinshu.

*Songshu* 18's surviving account identifies the same Cao Hongzhi proposal and
imperial acceptance but says only `晉哀帝初`; it does **not** corroborate the
precise Longhe year. The searchable reproduction at
https://photoapps.yd.chaoxing.com/MobileApp/GDSL/pdf/gddj/1315426.pdf , PDF
page 144 (zero-based page 143), reads: `晋哀帝初，博士曹弘之等议：“立秋御读令，不应缃帻。求改用素。”诏从之。`
In that edition the subsequent `遂不改` refers to a later Song-era attempt
to reverse the white headcloth, not rejection of the Jin-era proposal. One
independent online OCR copy elides the intervening sentence and makes that
distinction ambiguous; do not treat that OCR defect as a historical conflict.
Separately, *Songshu* 15 preserves Xu Daoyu's later memorial describing Cao's
proposal as `上應著緗幘，遂改用素`: https://www.sidneyluo.net/a/a06/015.html .
This wording differs from the "should not wear xiang" account in Songshu 18
and the yulan quotation. Preserve the competing wording for editorial study;
it does not by itself disprove the event or establish another event year. Do
not silently emend either witness or treat a difference in reported argument
as independent confirmation of the Longhe dating.

Longhe 1 is the conventional historical year **AD 362**, but lunar months
cross the Western new year. A proleptic-Gregorian comparison prepared with a
Sinica converter identifies Longhe 1, eleventh month 30 as Gregorian 363-01-01
and twelfth month 29 as 363-01-30:
https://sangokushi-biyori.com/reference-gregorian-calendar-362 . The external
witness gives only a regnal year, not a month or day **for the proposal**;
Liqiu concerns the prescribed ceremony and does not by itself date the
decision. Thus AD 362–363 is a conservative candidate event window, not an
assertion of ongoing activity throughout two years. A reviewer may represent
the conventional 362 year label differently only if the project semantics
clearly distinguish it from an exact Gregorian event year. Do not infer a
Gregorian month/day or identify an actual date of the Liqiu ceremony.

Proposed transformations (identical date fields for each):

- `claims[194]`, p064 `attestation`, sourceDate text `哀帝從博士曹弘之等議`,
  event `Emperor Ai of Jin followed Cao Hongzhi and others on Liqiu dress`;
- `claims[195]`, p065 `attestation`, sourceDate text `博士曹弘之等議`,
  event `Cao Hongzhi advised Emperor Ai on the Liqiu dress change`.

Each currently has `unresolved: true` and a substantive reason stating the
chapter itself has no era year. On independent acceptance of the external
identification, replace those two unresolved fields with:

```json
"westernInterval": {
  "start": { "era": "AD", "year": 362, "precision": "year" },
  "end": { "era": "AD", "year": 363, "precision": "year" }
}
```

Retain the chapter's exact `sourceDate` text. In an attached audit explanation,
attribute `隆和元年` to the external witness and cite the Gregorian conversion;
do not claim that the regnal year is written in Jinshu s0517. Because the
Song account says the emperor accepted the specific proposal and the yulan
quotation says the change was made under its year heading, this interval is
proposed for both distinct roles in this single episode. If independent review
finds that the quotation dates only the proposal and does not bound imperial
acceptance, keep p064 separately on hold rather than copying p065's date.

## s0444: Cao Rui's cap order

Jinshu attributes the cap alteration itself to `魏明帝` as an imperial order,
not merely a later reference to him. The extracted event has already had its
earlier unsupported `reserved for lower ranks` description corrected in this
incomplete candidate. The separate source review and adjudication must still
be respected; the precise sense of `卑下` is a philological question.

*Sanguozhi* 3 identifies the ruler as Cao Rui and recounts his accession in
Huangchu 7: https://zh.wikisource.org/wiki/%E4%B8%89%E5%9C%8B%E5%BF%97/%E5%8D%B703 .
Taiwan's Ministry of Education regnal table identifies **Wei Mingdi**'s reign
as AD 226–239, rather than confusing him with Jin Mingdi:
https://dict.revised.moe.edu.tw/appendix.jsp?ID=2&la=0 . The event as stated
is an imperial act, so its candidate date can be bounded by the years of that
reign. This is a bound on **one** otherwise undated event, not an assertion that
Cao Rui performed the act throughout his reign. No precise reform year was
found in the *Fuzi* parallels already examined; no assertion of one is warranted.

- `claims[161]`, p052 `attestation`, sourceDate text `魏明帝以其制似通天`,
  event `Emperor Ming of Wei is named in the Fuzi account as ordering the high-mountain cap altered because its design resembled the tongtian and yuanyou caps.`
- `claims[162]`, p052 `event-participation`, role `reformer`, with nested
  `dateContext.sourceDate.text` `改令卑下` and action `ordered the high-mountain cap altered, making it lower, because its design resembled the tongtian and yuanyou caps.`

For `claims[161][2]` and `claims[162][2].dateContext` respectively, proposed
replacement of `unresolved` and `unresolvedReason` is:

```json
"westernInterval": {
  "start": { "era": "AD", "year": 226, "precision": "year" },
  "end": { "era": "AD", "year": 239, "precision": "year" }
}
```

Keep both original sourceDate strings and the event/action. Explain the
external accession/death endpoints and imperial-act inference in audit evidence;
reviewer may retain a hold if imperial authority during the reign is not
sufficiently established. No later-reception label applies: the date describes
the attributed past act, not a later commemoration.

## Remaining work

These are four candidate temporal repairs, not four approved events or a
complete chapter. The host must obtain an independent source review, verify
fingerprints and all other claim values, carry complete checked external
references, then rebuild packets and run the production validator and a fresh
independent full chapter audit. Other unresolved dates and all identity and
publication gates remain unaffected.
