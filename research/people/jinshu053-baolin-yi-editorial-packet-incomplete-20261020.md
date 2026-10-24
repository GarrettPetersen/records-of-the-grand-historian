# Jinshu 053: Baolin and patent formula — independent review packet

Status: **proposals only, incomplete and not approved**. No canonical source,
extraction, prior decision, or reconciliation has been changed. Review each
field and the related claim independently against Chinese and context. This
packet is not a production decision document and does not override existing
sealed decisions.

## Exact draft being reviewed

- `jinshu053-merged-reviewed-simulation-v2-incomplete-20261020/source.json`:
  SHA-256 `a810ace8d38f97313800c968c6858373dc08c98ef08440dfa56e6907a9bd950c`.
- That directory's `candidate-unreviewed-reconciliation.json`: SHA-256
  `1c55e8f6b5c1637485e6a4603d3d0006f42f88c686725fc2b583de9914a15519`.
- That directory's `editorial-history.json`: SHA-256
  `30b09ad788522860bd04293c199a03e7f388569ec15314eb53ee2ac8de08a767`.
- The candidate remains unvalidated: its reconciliation and other source,
  editorial, identity and date holds persist. If its text changes, rebase these
  proposals and recheck prior approvals before creating production decisions.

## 1. s0065 — two translation fields

Chinese: 澹以兵仗送太子妃王氏、三皇孫于金墉城，考竟謝淑妃及太子保林蔣俊。

Literal before: “Dan escorted Crown Princess Wang and three imperial grandsons to Jinyong with armed guards, interrogated Consort-in-chief Xie and heir guardian Jiang Jun to death.”

Literal proposed: “Dan sent armed guards to escort Crown Princess Wang and the three imperial grandsons to Jinyong City; Consort Xie and Jiang Jun, a baolin of the crown prince, were interrogated to death.”

Idiomatic before: “Dan marched Wang consort and grandsons to Jinyong—executed Xie and Jiang Jun.”

Idiomatic proposed: “Dan sent armed guards to escort Crown Princess Wang and the three imperial grandsons to Jinyong City; Consort Xie and Jiang Jun, one of the crown prince's consorts with the rank of baolin, were interrogated to death.”

Reasons for independent checking: 送 with 以兵仗 does not require Dan's
personal escort; 三 denotes three grandsons; 考竟 is death under interrogation,
not simply an execution; 太子保林 is a ranked person in the Eastern Palace,
not an heir's guard. The prince's favored 蔣美人 bears a son in s0017. The
later [Zizhi Tongjian, chapter 83, with Hu Sanxing's commentary](https://donglishuzhai.net/chapter/6227.html)
identifies her as 虨's mother and describes 保林 and 良娣 as Eastern Palace
female ranks under Wei and Jin. That is corroborating context, not grounds to
add an unreviewed mother-child claim or resolve separate textual lacunae.
[Jinshu 053, Siku transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8_%28%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC%29/%E5%8D%B7053)
contains both the s0017 and s0065 Chinese. The proposals preserve 淑妃 as
“Consort Xie” rather than claiming the precise English equivalent of the rank;
review whether a more specific but supportable rendering is needed. They
retain baolin as a rank rather than translating it as a job.

Related extraction defect: candidate claim `jinshu:053:c0106`, subject
`jinshu:053:p027`, gives title English “Heir guardian Jiang Jun” for
太子保林蔣俊. Independently review a claim revision to “Crown Prince's baolin
Jiang Jun” (Chinese unchanged), alongside both translation proposals. Check
other aliases, roles, and regenerated spans; do not alter history records or
reuse old offsets. Existing role `consort` (c0108) is consistent with the
evidence, but this observation is not approval of the full extraction.

## 2. s0131 — literal field only

Chinese: 及賈庶人死，乃誅劉振、孫慮、程據等，冊復太子曰：「皇帝使使持節、兼司空、衛尉伊策故皇太子之靈曰：嗚呼！

Literal before: “When Deposed Commoner Jia died, they executed Liu Zhen, Sun Lü, Cheng Ju, and others, and posthumously restored the crown prince; the edict read: 'The emperor dispatches the credential-bearer, concurrent Director of Works, Commandant of the Guard Yi Ce to the spirit of the late crown prince: Alas!”

Literal proposed: “When Deposed Commoner Jia died, they executed Liu Zhen, Sun Lü, Cheng Ju, and others, and restored the crown prince by patent, saying: 'The emperor sends an envoy bearing the tally, Commandant of the Guard Yi, concurrently serving as Director of Works, to announce by patent to the spirit of the late crown prince: Alas!”

The current independent-review-supported idiomatic field already parses 策 as
the announcement verb rather than part of the envoy's name. This proposal
aligns the literal field with that reading while translating 使使持節 as
dispatching an envoy bearing the tally; reviewer should verify 兼司空's scope,
the restoration/patent formula and whether the identity of 伊 can be stated at
all. Do not assert the envoy's full name based on this sentence. Inspect any
person/name claims and mention spans tied to “Yi Ce” independently; no
identification decision is supplied here.

## 3. s0132 — direct voice and paired name correction

Chinese: 維爾少資岐嶷之質，荷先帝殊異之寵，大啟土宇，奄有淮陵。

Literal before: “In youth you bore a nature quick and wise; the late emperor gave you exceptional favor, opening great territory, holding Hailing.”

Literal proposed: “In youth you bore a nature quick and wise; you received the late emperor's extraordinary favor. He greatly opened your domain and gave you possession of Huailing.”

Idiomatic before: “Hui's ghost-eulogy praised Wu Di's love and Yu's fief.”

Idiomatic proposed: “From youth you showed remarkable intelligence. You received the late emperor's extraordinary favor: he granted you a great domain and possession of Huailing.”

The patent directly addresses the deceased prince as 爾, rather than narrating
a summary about him. The proposed spelling Huailing represents 淮陵; review
that location in context and the rendering of 大啟土宇 and 奄有. This is a
separate proposal from s0131 and does not imply that any later speech has been
fully reviewed or corrected.

## 4. s0172 — posthumous conferral and implied subject

Chinese: 四月，追封南陽王。

Literal before: “In the fourth month posthumous investiture as Prince of Nanyang.”

Literal proposed: “In the fourth month, he was posthumously enfeoffed as Prince of Nanyang.”

Idiomatic before: “Fourth month titled Prince of Nanyang.”

Idiomatic proposed: “In the fourth month, he was posthumously made Prince of Nanyang.”

追 marks posthumous action, and the omitted subject continues from the
preceding sentence. The local Chinese in s0170–s0171 is lacunose, and external
witnesses support 虨; **do not silently insert the character or resolve that
source correction through these translation proposals**. The pronoun avoids a
new identification while remaining grammatical in the immediate sequence.
Review the existing adjacent English (including “Eldest”) independently and
preserve the separate Chinese-source correction workflow.

## Reviewer output and next steps

Record explicit accept/revise/reject decisions for each of the seven proposed
field changes and an independent decision for c0106, explaining any revisions.
Only after the V2 candidate's unresolved preflight dispositions are genuinely
reviewed and validated may the host build the supported production-shaped
editorial dossier/decision seed against the exact new source and extraction.
Decisions cannot be represented by editing a prior seal. Source edits require
fresh source fingerprint, reconciliation, extraction validation, date audit,
and any affected identity decisions before publication.
