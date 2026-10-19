# Jinshu 025 s0536–s0537: seal chronology research, incomplete

This is research for independent adjudication, not an audit, acceptance, or a
canonical date repair. Preserve both current holds until the reviewing editor
has verified the source readings and their applicability to this exact seal.

## Input fingerprints

The retained partial candidate is `jinshu025-shihu-reviewed-partial-20261019/`:
`source.json` has byte SHA-256
`2f1980cd20d124b450e4e1eecfa7319a610a5fbe0669851206442603eed43ab4`;
`candidate.json` has byte SHA-256
`a67293ef781c9e7f30451c2a3d4398a7822f41e62c0cf8ae76070e2bc4a6a438`.
Recheck these before using any proposal; these are not source/extraction
semantic hashes for a sealed date packet. They do not authorize edits.

- s0536: `又有秦始皇藍田玉璽，螭獸紐，在六璽之外，文曰「受天之命，皇帝壽昌」。`
  Chinese unit SHA-256 `12aba4331332244ae173b49d3e900a96397c129e98052c7dbee1fb7379b48797`.
- s0537: `漢高祖佩之，後世名曰傳國璽，與斬白蛇劍俱為乘輿所寶。`
  Chinese unit SHA-256 `af072cd2bd06bab1df109cdba6a1cfe37984c53209d3eac15a260d703140b728`.

## Checked witnesses

1. [Zizhi tongjian 9 and Hu Sanxing's commentary](https://ancient-china-books.github.io/zizhitongjian/OEBPS/Text/5388.html), accessed 2026-10-19, reports Ziying's surrender of the imperial seal at Bashang in Han year 1, tenth month. Its quoted Han guanyi then says `漢官儀曰：子嬰上始皇璽，因服御之` (UTF-8 SHA-256 `198a57bfb399c3877b01996a98b2664da568ef73bd8543a4307ab23c983225f2`); its quotation attributed to Shen Yue describes the First Emperor's Lantian seal with the exact Jinshu inscription. These are cited historical testimonies, not an independently verified artifact. Their juxtaposition is not proof that all seal traditions have the same material object.
2. [Songshu 18](https://www.shidianguji.com/zh/book/NGJ892412000000033230559/chapter/1lvrusjoj826z) is attributed by [this textual anthology](https://zh.wikisource.org/zh-hant/%E7%8E%89%E7%92%BD%E6%96%87) as saying Gaozu obtained the First Emperor's Lantian seal on entering the passes and wore it. The commentary in item 1 independently displays the longer Shen Yue excerpt and identical inscription. This is likely a related literary tradition, not two independent archaeological confirmations.
3. [Hou Hanshu biography 48, Xu Qiu, commentary attributed to Wei Hong](https://zh.wikisource.org/zh/%E5%BE%8C%E6%BC%A2%E6%9B%B8_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B7078), accessed 2026-10-19, says `漢髙祖定三秦子嬰獻之髙祖即位乃佩之` (SHA-256 `637f85556771282ac23cd4b916c5624ab095cfedf81d4cbb0f8baaaad01cca90`). The same cited account gives the seal inscription `受命于天既夀永昌`, which differs from Jinshu. It also places Ziying's surrender after the subjugation of the Three Qin, which warrants scrutiny against the main chronological narrative. Do not transfer its accession-date claim as if physical identity and chronological consistency were established.
4. [Routledge Handbook of Imperial Chinese History, timeline, p. 20](https://api.pageplace.de/preview/DT0400.9781317538233_A35095488/preview-9781317538233_A35095488.pdf), accessed 2026-10-19, places Liu Bang's entry into Xianyang and Qin's fall in **207 BCE**. Zizhi tongjian's heading uses conventional Han year 1 = 206 BCE, but explicitly dates arrival at Bashang and surrender to the year's tenth month, with the Qin-style year beginning at that month. Do not automatically equate the historical year label 206 with that lunar month's Western year, infer a Gregorian day, or treat the secondary chronology alone as proof of the year of entry into the passes: the sequence and conversion require a source review.
5. [Wanli yehuo bian, supplement 4](https://zh.wikisource.org/zh-hant/%E8%90%AC%E6%9B%86%E9%87%8E%E7%8D%B2%E7%B7%A8/%E8%A3%9C%E9%81%BA%E5%9B%9B), accessed 2026-10-19, compares accounts and questions identifying differing seal inscriptions. This warns against silently harmonizing the witnesses; it does not prove there were two physical seals.

## Candidate inference for separate review

For **s0537 only**, if the independent reviewer verifies (a) the Shen Yue/Songshu acquisition story concerns the Jinshu-described seal, (b) `因服御之` in the quoted Han guanyi preserves the relevant acquisition-before-wearing sequence rather than referring to a distinct seal, and (c) the conventional 207 BCE chronology for entry into the passes, then a **single one-sided** date candidate is `westernBounds.onOrAfter: {"era":"BC","year":207,"precision":"year"}` for the *reported wearing event*. Explain that this is a sequence-based lower bound in a historical narrative, not a proven first day of wear, a direct date stated in s0537, continuous wearing, or a lifespan-based bound. It has no supported upper endpoint here. The reviewer must assess the inscription conflict; if those premises cannot be established, retain the existing unresolved claim. No claim mutation or active-hint mutation is included in this dossier.

For **s0536**, the sentence identifies the seal as the First Emperor's, but does not state when he obtained, commissioned, carried, or owned it. The inscriptions, reported origin traditions, and the dated relationship of the different seal accounts need further collation. Neither his reign nor a generic lifespan automatically dates a specific act of ownership; no replacement chronology is proposed.

Separately, s0537's idiomatic translation attributes both seal and snake sword as regalia claimed by Liu Bang. Its Chinese instead says he wore the seal, later generations named it, and the imperial carriage treasured it together with the sword. This possible ownership/chronology translation defect requires separate editorial review; the present research is not an editorial approval.
