# Jinshu 053 s0170–s0172: source restoration proposal (incomplete)

This is source research and a proposed repair, **not** an editorial approval,
date approval, identity decision, or instruction to publish. No chapter data,
claims, queue, Git index, or canonical source has been changed. The examined
`jinshu053-real-letter-p056-v1-incomplete-20261020/source.json` has SHA-256
`26f2169267b866e9203dd05f902044aa6c7839d7b780bba10ce4a1b0066c7e78`;
its candidate has SHA-256
`35620e8c25541384a137c93eb7d2c6324f7777f5b142860ef8fb74d8bcf2c131`.
This snapshot is an isolated research candidate, not the canonical chapter.

## Exact source discrepancy and evidence

The snapshot's s0170 reads `太子三子：、臧、尚，並與父同幽金墉。`,
and s0171 reads `字道文，永康元年正月，薨。`. This is an omission in the
project transcription; it is not evidence that the surviving historical
text itself has a lacuna. The empty first list position and missing subject
should not be silently filled on the basis of the English translation alone.

The [Wikisource transcription of Jinshu 053](https://zh.wikisource.org/wiki/晉書/卷053)
and [Shidianguji transcription](https://www.shidianguji.com/zh/book/HY2499/chapter/1mb9kswm56c6j)
read `太子三子：虨、臧、尚，並與父同幽金墉` and `虨字道文`.
The [Siku Quanshu text of Jinshu 053](https://zh.wikisource.org/wiki/晉書_(四庫全書本)/卷053)
also contains `太子三子虨臧尚` and `虨字道文`; its differently punctuated
presentation does not independently establish manuscript ancestry. The
[Shidianguji character index](https://www.shidianguji.com/character/虨)
lists the list reading in several identifiable editions, including its
1739 Wuyingdian edition and an edition it identifies as Song-printed; these
are index transcriptions, not inspected facsimiles. Do not claim a full
manuscript collation or that the websites are independent witnesses.

Importantly, [Zizhi Tongjian kaoyi's historical textual note](https://zh.wikisource.org/wiki/Page:Sibu_Congkan0179-司馬光-資治通鑑考異-6-1.djvu/103)
reports the imperial annals as reading `霖` where the biography has `虨`,
and expressly prefers the biography: `帝紀虨作霖，按虨字道文，不當作霖，今從傳`.
This is a reported textual variant, not proof of an additional alias, a second
individual, or an independent contemporary account of the same person.

## Proposed repair

Subject to a source-correction review and normal fingerprint/reconciliation
workflow, restore only the two missing characters, preserving project
punctuation:

* s0170 `太子三子：虨、臧、尚，並與父同幽金墉。`
* s0171 `虨字道文，永康元年正月，薨。`

Then a faithful literal/idiomatic pair for s0170 can be respectively
“The crown prince had three sons—Bin, Zang, and Shang—all confined with their
father at Jinyong” and “The crown prince's three sons, Bin, Zang, and Shang,
were confined with their father at Jinyong.” This provides all names omitted
by the current idiomatic sentence. For s0171, use “Bin, courtesy name Daowen,
died in the first month of Yongkang year one” / “Bin, whose courtesy name was
Daowen, died in the first month of Yongkang's first year.” The existing
idiomatic's “Eldest” is not explicit in s0170–s0171; sequence in a list alone
does not establish birth order. Restore the explicit posthumous action in
s0172 idiomatic: “In the fourth month he was posthumously enfeoffed as Prince
of Nanyang.” The local literal's `posthumous investiture` already captures 追封.
Existing editorial proposals overlap s0172; reconcile exact reviewed text
instead of independently applying competing edits.

If restoration is not approved, do not represent the name as present in the
current local Chinese: render s0170's missing first list item explicitly as
`[name missing in this transcription]` and s0171 as “The one whose courtesy
name was Daowen died ...”, with a clear source note explaining the outside
witnesses. This conservative option does not resolve the source omission and
is not a substitute for the reviewed source repair.

## Extraction and downstream holds

* p028 currently has uncertain `虨`/Bin name assertions citing s0170 and
  s0171, and a s0171 English mention `Eldest Bin` but no exact Chinese 虨
  mention. After a reviewed source restoration, rebuild the packet, record
  exact Chinese and English mention spans on the corrected current fields,
  review supported name-claim certainty, and regenerate candidate dispositions.
  Do not attach a Chinese character to a string which does not yet contain it.
* The s0172 `南陽王` title, posthumous action and link to the biography's
  subject are supported contextually. Treat its fourth month as relative to
  the biography's preceding year, and leave Western conversion and precise
  chronology to the independent date reviewer.
* The candidate calls p028 “Eldest son,” records `subjectBirthOrder: 1`, and
  classifies p068/p069 as paternal-half younger siblings based on s0170. These
  particulars are not established by the listed texts. The unnamed son of
  Jiang in s0017 likewise is not expressly named there. Audit the relationships
  against the complete source evidence; don't substitute automatic deletion or
  cross-chapter assumptions for an independent identity/claim decision.
* The contemporary narrative records 道文 in other passages, and the corrected
  s0171 would identify that courtesy name with 虨; contextual identity remains
  an evidence-based decision, not an automatic consequence of matching strings.
  `霖` must remain a cited textual variant pending targeted identity analysis,
  not an asserted alias merely because of the kaoyi note.
* This source change invalidates fingerprints and requires normal extraction
  validation, fresh independent editorial/date review, identity-decision
  reconciliation, and downstream publication gates. No whole-chapter coverage
  or approval is implied. Previous genuine review artifacts must be preserved.
