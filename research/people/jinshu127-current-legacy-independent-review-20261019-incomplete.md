# Jinshu 127: independent current-stage legacy-action review — incomplete

This is a focused research review of the eleven legacy editorial decisions and
three associated claim actions, **not** an approval of the chapter, extraction,
dates, identities or publication. The reviewer is the separate conversation
`/root/legacy_current_review`; the identity and independence of the original
reviewer remain unknown. The historical reviewer metadata must not be invented.

## Inputs and method

Against staging commit `0b9e79219820bac30bc0fdb02377e1cd589837ba`, the read-only
`scripts/people-legacy-editorial-inventory.mjs` was invoked on the exact three
Git blobs using process substitutions. The local inventory script's Git blob
hash matched that commit. It performed its own structural and applied-history
checks; this review examined the current staged Chinese and English, compact
name claims and the staged earlier source review at
`research/people/checkpoints/jinshu-quality-holds-20261019-incomplete/jinshu127-original-eleven-independent-source-review-20261020-incomplete.md`.
The inventory's output calls itself `NOT_APPROVED`; no approval is implied here.

Byte SHA-256 fingerprints (without the `sha256:` prefix):

- Source `data/jinshu/127.json`: `1b0ed1664bdf27f77ff5a9f1cb635d82e2dd9772f5ede7d3c18e0ed558b93f99`.
- Extraction `data/people/extractions/jinshu/127.json`: `e55bb752bbe33b0fb5492616933c6c32645d47cdc296673f43e55ea9bc54caf6`.
- History `data/people/editorial-decisions/jinshu/127.json`: `5d707ac70687ae595bec5106e95ffcfca0bc20ecf14d051fc92779598022542e`.
- History component semantic SHA-256 (`JSON.stringify`): `d66dce07438d25446ca899f149b2ea57929cf6cf59c298895f760f9cc8339ea3`.
- Chapter fingerprint: `f6bdf140cecc56db219d787e7c3e014dfe566450086cdbb02371f92215020494`.

Each action hash below is the inventory's SHA-256 of the serialized action
content; it uniquely locates that action within this component. Source snippets
refer to the exact staged sentence. A supported verdict is limited to the
specified effect and does not verify other aspects of the sentence or chapter.

## Decisions

1. **r0001, supported.** Hash `439d3a06b37ea168aadd38e252943a3ac007105f4a5e2387f22a2b0795f5b458`. In s0037, `以都督專總南夏` is a territorial/administrative jurisdiction, not summer; current literal “southern Xia domains” implements the correction. This does not establish exact geographical extent.
2. **r0002, supported.** Hash `ddc274c36cdaf78654996ff6cde639d4cd2563977e0b4c81ad468c3e463a77f5`. s0007 `及垂嗣位，改范陽王，稍遷魏尹` continues De's biography. Current literal identifies `[De]`, the title Prince of Fanyang, and Yin of Wei; the capital-region gloss is interpretive.
3. **r0003, supported.** Hash `beb3b740c44a18c7fc406755cea0cea958bca4deafc014ed964e7c887647cf56`. s0014 `後遇垂敗…數歲免歸` supports Chui's defeat and De's later dismissal and return; current idiomatic removes the unsupported claim of disgrace.
4. **r0004, supported.** Hash `fab835b828c8f2889e7a6dcdf876281c56267679a39ee44634cc2388d86f5776`. s0056 `章司馬丁建率眾來降` names Ding Jian; current idiomatic identifies him, not Ding Tong. `丁通` occurs separately in s0078.
5. **r0005, supported.** Hash `f85dd23039c7fb6a7c56b948047511ed6a09a6e4b68ad5e9b93b3c564504bf93`. The same s0056 `丁建` supports Ding Jian in the current literal field; this is the paired-field correction, not a second event.
6. **r0006, supported.** Hash `6e218ba9056f50c4d890dcfd18e993c084693e29b9a7e71f28e3c20e3dc25b81`. s0065 `承制南夏` occurs in an appointment context and supports the current literal's delegated authority over southern Xia domains rather than “southern summer.”
7. **r0007, supported with rationale caveat.** Hash `e455cfd5cbe3597f26ae68b60c134582cc233a5b88fcc3ee52a7b292805f5a8c`. s0105 `中軍慕容法、撫軍慕容和等距之` supports both names, “and others” and resistance; current idiomatic includes them. s0104 explicitly identifies the opposing army as Jin. The proposal's claim that 慕容和 is corrupted in this witness is unsupported: the staged Chinese spells it out.
8. **r0008, supported in normalized reading, with variant and claim caveat.** Hash `a1148e321a16321eb3c34d0836550ce2d0ecdce81c87ed8d7e32dc942ea2fe69`. s0131 has `避閭渾昔負國恩`, while current idiomatic calls him Pilü Hun. A [historical parallel in Zizhi Tongjian 111](https://zh.wikisource.org/wiki/%E8%B3%87%E6%B2%BB%E9%80%9A%E9%91%91/%E5%8D%B7111) gives 辟閭渾 in Pan Cong's corresponding Guanggu plan and in the subsequent attack narrative; it supports the inferred identification, not a proven corruption of the present witness. [Hàn Diǎn's 辟閭 entry](https://zdic.net/hans/%E8%BE%9F%E9%96%AD) gives the compound surname as pì lǘ, but does not itself prove how the variant 避 is pronounced. Retain the witnessed variant rather than declaring it an emendation; see claim actions below.
9. **r0009, hold current wording.** Hash `8698746e5f5527a0fbd6dc3ad79e4ec0345593a46eec82f47a6f50c4b302966e`. s0177 `四年，僭即皇帝位於南郊…設行廟于宮南，遣使奉策告成焉` supports the hostile accession framing, temple, envoys and reporting completion. Unlike the later research candidate examined in the earlier independent review, **current staging** still says “sent envoys bearing the accession proclamation,” omitting 告成 and narrowing 策. Its literal instead says envoys carried a document to report completion. The old decision's current idiomatic effect remains a hold for source-focused repair/reconciliation. The sentence alone says only “fourth year”; Long'an 4 / AD 400 needs the independent chronology audit and is not approved here.
10. **r0010, supported.** Hash `6522c583dcef9ee133467ac930042339d3f6bfe570551139104bf8ec773a77c7`. s0243 `桓玄將行篡逆` makes Huan Xuan the subject of an impending usurpation; current literal does not introduce a fictitious general. The idiomatic “purged dissenters” compresses the following phrase and is not evidence of a separate named group.
11. **r0011, supported.** Hash `d1c77396bef0ebf5490395d7791e348d75a1409faecdfed930a226182f888a8b`. s0271 `以慕容鎮為前鋒，慕容鐘為大都督，配以步卒二萬，騎五千，克期將發，而德寢疾，於是罷兵` supplies the appointments, 20,000 infantry, 5,000 cavalry, fixed departure date, illness and cancellation. Current idiomatic represents those points. It does not establish a duration or precise stopping place.

## Claim actions

1. **r0004 claim retraction c0115, supported.** Hash `842e62ad38553dc91c97af7b03dbd411756063ed21daabf478db333c47a3e4d8`. The retracted p030 alias paired “Ding Tong” with `丁建` from s0056. Current compact p030 retains only the explicit Ding Jian/丁建 personal name. The Chinese s0056 supports the retraction; s0078's different 丁通 does not justify attributing that name to the s0056 person.
2. **r0008 claim revision c0259, supported as inferred identity, not an explicit local graph.** Hash `682db30025153f055a79f7fbf72e286578d1b750b3dc364ca41548e5128377a1`. Current p076 retains “Pilü Hun” / `辟閭渾` / `Pìlǘ Hún` as **strongly inferred** from s0131, which itself has 避閭渾. The historical parallel and dictionary above support a normalized inference, not a claim that 辟 is explicitly present in the staged sentence.
3. **r0008 claim revision c0260, hold pinyin interpretation.** Hash `3e5ffc1501cc60484f8c6392aa6b39debfe70984cd3aa28977d0c1234c6e5f3b`. Current p076 retains “Pilü Hun” / `避閭渾` / `Pìlǘ Hún` as explicit from s0131. The graph 避閭渾 is explicitly witnessed and the normalized English is contextually supported by the parallel; whether the pinyin field is intended to transcribe this exact graph or to give the normalized historical surname requires further source and schema verification. Do not automatically accept the full effect on the basis of the 辟閭 dictionary entry alone.

## Boundaries

The prior focused review concerns a different, later research candidate and
cannot establish that its repairs are present in these staged source bytes.
This review neither changes canonical data nor grants provenance to the older
anonymous history. It is not whole-chapter editorial, independent date, identity,
backlink, website or ebook approval. Any subsequent source or extraction edits
require the normal fingerprint reconciliation and downstream gates.
