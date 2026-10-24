# Jinshu 108–109: Murong Hui's titles and Huang's heir appointment

Independent reviewer `/root/review053_combined`. This is targeted research, not
a complete date audit, a repair proposal, or an approval. Source and extraction
files were read from staging commit `75d816dd2af8cff40fa827813fd0721d78c7f739`;
do not assume those fingerprints match a subsequent live workflow.

## What the source actually says

1. Jinshu 108 s0058 reports that, **during Jianxing**, Emperor Min sent an
   envoy to appoint Hui `昌黎、遼東二國公` and a general. It does not supply
   the exact year, month or date of this grant. Its Chinese-unit SHA-256 is
   `7ea2f58fc4954e009a606a982399f22bf7ee8197df2e1130354bc67cf9d2ea84`.
2. Jinshu 108 s0059 says that in early Jianwu Emperor Yuan offered a different
   list including `昌黎公`, which Hui declined. The refusal of this list must
   not be automatically assigned to the earlier Jianxing grant.
3. Jinshu 108 s0096 separately records a later advancement to `遼東郡公`,
   accompanied by staff, military, and Pingzhou-governor titles and 10,000
   households; s0096 itself says `尋` and gives no named year. Chinese-unit
   hash `e194214cf557b58439a654cd41ef4cfcc50f8f0756f73b0d6001c3f68f8cc93b`.
   This must not be merged by assumption with the earlier two-duchy grant.
4. Jinshu 109 s0006 `廆為遼東公，立為世子` says Hui was Duke of Liaodong
   and Huang was established as his heir; it gives neither the regnal year nor
   the calendar date. The sentence does not necessarily assert that Huang was
   established on the day Hui was first made duke. The next unit, s0007,
   begins `建武初` and names Huang's offices. Its early-Jianwu qualifier
   belongs to those appointments; it cannot be mechanically moved backward to
   the heir establishment. The biography's order is not guaranteed to be
   chronological. Unit hashes: s0006
   `eeb828b6e72ef82f66e91d1081854a63124c068df7758ee8e83520b61a3b2d8c`;
   s0007 `293a3df14207c730ee5b7cd51404b8448d0242993fec13dffcc47535bad3d5f9`.

## Chronological witnesses and remaining calendar hold

Jinshu 006 s0238 opens the fourth year, and s0257 records Hui's `遼東郡公`
advancement in its twelfth month; the following s0258 changes to Yongchang 1.
Read back through the annal's era context, this is Taixing 4, month 12.
Chinese-unit s0257 hash
`b3cf7783d0277d78f444efc7e069b4cac00b897b36369880025a13acb17ca868`.
[Taiping Yulan juan 121](https://zh.wikisource.org/zh-hant/%E5%A4%AA%E5%B9%B3%E5%BE%A1%E8%A6%BD/0121)
quotes an earlier account placing the later Liaodong commandery-duke grant in
Taixing 4; its named offices match the later promotion, not just the earlier
Jianxing grant. These witnesses should be treated as potentially textually
dependent, not as independent contemporaneous confirmations.

[Zizhi Tongjian juan 91](https://ancient-china-books.github.io/zizhitongjian/OEBPS/Text/6235.html)
places Hui's promotion under a twelfth-month heading, narrates his establishment
of officials, and then records `廆立子皝爲世子`. This provides a concrete
source-based reason to associate the heir appointment with the **later**
promotion rather than treating the s0007 Jianwu label as its date. However, it
is a compiled narrative entry: the exact day and whether every intervening
institution-building action necessarily occurred inside that month are not
independently established. Preserve this qualification rather than equating the
two events to an exact Western day.

Taixing 4 is conventionally labelled 321. That label is not necessarily the
Western calendar year of its lunar twelfth month. An
[astronomical study of Jin records](https://www.jstage.jst.go.jp/article/jhsj/22/145/22_21/_pdf/-char/ja)
places its second day in AD 322, and the annals put Yongchang 1 immediately
after it. This is a strong warning against an unqualified `westernYear: 321`,
but I have not verified the study's Julian-versus-proleptic-Gregorian convention
or a complete lunar-month conversion against the workflow's required calendar
reference. Do not publish an exact Western day, month, or final 322 point from
this note without that verification. The heir appointment's assignment to the
chronicle's month must also be evaluated independently; a one-sided bound or a
research hold may be appropriate if its exact placement remains uncertain.

## Findings against the pinned extraction

The 109 p002 `noble-title` and p001 `heir-apparent` claims both cite s0006 but
record `sourceDate.text: 建武初` and `westernYear: AD 317`. The cited
sentence has no such text; the words belong to s0007's different event. Flag
both contextual dates for owner-controlled correction. The 108 p001
`noble-title` claim for s0096 records `太興後` and a point AD 318; s0096
does not provide this label, and the 006/Taiping witnesses place the matching
later promotion in Taixing 4, not early Taixing. Flag it separately rather than
copying Huang's event date onto Hui's earlier 108 s0058 title.

The 109 extraction also has `AD 317` activity hints on p001 and p002; each
hint needs its own ownership/source review. Huang has independent early-Jianwu
activity in s0007, but the era wording does not by itself justify blindly
carrying an exact single Western year to Hui's 109 s0006 event. This note does
not approve or alter any hint.

Pinned source SHA-256: 006
`1cfdae1640bf8167f5b1a05c3b3ad5c4a8488fbc7bea3ae365257f1d3a762956`, 108
`8c3f789a55588e130f64eac778decf43ebde6809f3ecb81ddc91b54a76d6cfbb`, 109
`aa15f4935b0154841972a9b61f6ecfbaee031bf3db500c5cf6888bc47a71f888`.
Pinned extraction SHA-256: 108
`03128355667288fe2c91695a7e4a5372c5e758623277f420ac57d7c37e493576`, 109
`e42c9e04d3b850076f96dc1c94721f2ad71cc819bc27cdb21187f55e84135c97`.
No canonical input, date report, reservation, lease, lock or index was modified.
