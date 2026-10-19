# Independent reconciliation review: Jinshu 053, 98-proposal simulation

Research only, not a production decision or approval. The sealed original chapter
fingerprint is `sha256:437d9e2d76d520caafb8053f79304681fcece7139971add44cc572475c491007`;
the in-memory post-review fingerprint is
`sha256:40fa800060e3025f9b63ce7a3b201609c9d7797353e3344ef34814443646172e`.
`jinshu053-reviewed98-reconciliation-packet-incomplete-20261020/decision-seed.json`
has SHA-256 `c904c0310cb616d98fa754c7ba074dc555d928e705a98ad00851c45278cf1805`.
An independently produced simulated source has that same chapter fingerprint.
The packet combines all 24 newly generated automatic dispositions with all seven
unresolved candidates, without exposing their classifications. It also records
the original and automatic-after mentions in all 75 units touched by accepted or
revised field repairs. The exact decisions and offsets must be regenerated if
any source wording changes.

## Source-local interpretation of the 31 candidate surfaces

Suffixes are `jinshu:053:cand_…`. A local identity is not authorization for a
cross-chapter merge. Where two substrings make one title, the desired rendered
link covers the complete title if the production validator permits; offsets are
for the final idiomatic text, not necessarily the literal translation.

| Candidate suffix(es) | Assessment and evidence |
| --- | --- |
| 523e02b466ec9f5f | Not a person: `Heaven` is in 天子氣, an aura of rulership. |
| 194668bbf5e9ac56 | p001, title reference; 廣陵王, Prince of Guangling. |
| e52f72d263aa7470 | p001, title reference; 太子 in s0047 is the crown prince. |
| 200b2d13ba5a3bd6; 6b8390c3b5e7e7f5; 25dcca266b0a27dd | s0063's 梁王肜, 淮南王允, 趙王倫 are p051, p052 and p054. Cover the corresponding complete prince titles. |
| c7b50c21e83f5cb3 | s0063's General-in-Chief Sima Rong is p051: 梁王肜 (not the old Sima Tong spelling). See the surname-record hold below. |
| c24d32ff69ebaf50; 53e4f0d3d4cdc1db; a7ced6d11ecdf1da | s0108 Lun and Prince of Zhao are p054: 趙王倫謀臣孫秀 identifies Sun Xiu as his adviser. |
| 9e13cb8aefd7aadf; 8b50d48c050cf12b | s0111 Prince of Zhao is p054, the person receiving Xiu's proposal, 趙王倫. |
| b9ec23a9324923be | Not a person: `All` renders the collective 同悲等痛. |
| 32c5b3c9f1791ff7 | Not a person: 顯平陵 is the Xianping burial place. |
| 64a2c5fedcc5df96 | s0172 Prince of Nanyang is locally p028, the child with courtesy name 道文 in s0171. This does not settle s0017's unnamed son's identity. |
| 6f06d15ca1c4a827 | s0174 Prince of Linhuai is p068; s0173 introduces 臧. |
| c558ac3414829511; 789300eaa5a46e24; 8448bc18029fb928 | s0179 Lun / Prince of Zhao are p054, 趙王倫. |
| a9b9b1b7929dc11c; 0c939602d7e61a50; e70a7bd4b71a0007 | s0183 first Prince / Zhao / Lun are p054, 趙王倫, not the grandson. |
| b0652f53467c579a | s0183 second Prince is p068, Zang, demoted to Prince of Puyang. |
| 5021a0321e0edaa8 | s0207 Prince of Xiangyang is p069, following 尚 in s0206. |
| ceddecf925f4b2a2; 852bfc6c8ad0e262 | Not persons: 天下 is the realm or populace, not an individual. |
| 105b2fe617db5013 | Not a person: 天挺 is a cosmological attribution, not a human being. |
| 3b5abb84a67a7e04 | Not a person: Once is an ordinary conjunction. |
| dc3cdc7da8dba67c | s0017 Lady Jiang is p027, 蔣美人. This does not identify her unnamed son. |
| d007b642bf81eeaf; 86dce4b95424d9fb | Not persons: Alas renders the exclamations 嗚呼 and 嗚呼哀哉. |

## Automatic and retained mention audit: hard blockers

I inspected the person attribution of **all 63 English spans in the automatic
after-state across the 75 repaired units**, using each displayed Chinese and
idiomatic sentence. This checks person attribution only, not complete name
coverage, all Chinese spans, history validity, claims, or chapter-wide identity.
Two concrete errors make the automatic result unsafe:

1. **s0063, m0234:** p001 (the crown prince) is linked to `Yu` at code points
   31–33 inside `He Yu`. The text names 和郁, whose chapter-local record is
   p049; the crown prince is instead 太子 at the end of the sentence. Remove the
   erroneous p001 substring link and create a source-supported p049 link to
   the complete `He Yu` surface; reconcile candidate `333b09cb95859bf6`
   under the actual candidate/overlap rules. The exact human-reviewed and
   validator-checked implementation remains to be done.
2. **s0113, m0346:** p026 (Empress Jia) is linked to the second `Jia` in the
   idiomatic phrase `the Jia family`. That surface is the qualifier of a family
   or faction, not a standalone occurrence of the individual named by the
   first `Empress Jia`. The Chinese 贾氏之黨 describes affiliation, and the
   English wording here is explicitly collective. Remove the isolated p026
   substring link and review candidate `5a0e2c2625fec491` in context under the
   actual schema; keep the first independent `Empress Jia` mention.

The remaining automatically retained English spans appeared locally attributable
on the displayed Chinese and idiomatic contexts, but that observation is not
an independent source audit of whole chapters, all linked surfaces, or identity
claims. In particular, this review does not claim all names have links.

## Other holds

- s0131 literal `Commandant of the Guard Yi Ce` misreads 伊策 as a personal
  name; the reviewed idiomatic renders 策 as a patent/announcement. Propose a
  separate independently reviewed literal correction and inspect any
  associated person claims and links before publishing; do not silently change
  the sealed proposal set. Actual Chinese context: 皇帝使使持節、兼司空、
  衛尉伊策故皇太子之靈曰. The independent s0131 interpretation is narrower
  than identification of the envoy's full name.
- p051's existing preferred label or name claims may still say Sima Tong even
  though the independently reviewed idiomatic correction says Sima Rong; audit
  and revise the record and claims using the independent-claim workflow.
- s0017's retained p028 mention on 皇孫 asserts identification that this
  sentence alone does not establish. Review wider source evidence separately;
  Lady Jiang's identification cannot establish her child's identity.
- Some retained titles and new title components need full-span linkage and
  explicit dispositions. Some English names are not linked at all. Both
  literal and idiomatic surfaces require checking after the final text freeze;
  this packet's candidates are extracted from the idiomatic field.
- No production dossier, reviewed decision document, corrected extraction,
  date audit, identity approval, source publication, or completed chapter is
  created by this file. It neither changes canonical data nor touches Git,
  queue, locks, builds, or worktrees.
