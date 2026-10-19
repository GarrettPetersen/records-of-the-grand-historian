# Jinshu 053: second independent reconciliation review (incomplete)

This is an independent source-local review, **not** an approved extraction,
decision file, complete editorial review, date audit, or identity resolution.
I used the Chinese and English displayed in the exact 31-candidate packet and
checked the related chapter context against the Jinshu text. The simulation is
not canonical. I did not modify source, extraction, Git, queue, leases, or locks.

Input byte hashes (SHA-256):

- V2 simulated source `source.json`: `a810ace8d38f97313800c968c6858373dc08c98ef08440dfa56e6907a9bd950c`.
- V2 automatically reconciled candidate: `1c55e8f6b5c1637485e6a4603d3d0006f42f88c686725fc2b583de9914a15519`.
- `jinshu053-reviewed98-reconciliation-packet-incomplete-20261020/decision-seed.json`: `c904c0310cb616d98fa754c7ba074dc555d928e705a98ad00851c45278cf1805`.
- Its reported revised source fingerprint is `sha256:40fa800060e3025f9b63ce7a3b201609c9d7797353e3344ef34814443646172e`.

The quoted chapter text and contiguous context can also be checked in the
[Jinshu 53 transcription](https://www.shidianguji.com/zh/book/HY2499/chapter/1mb9kswm56c6j).
This is another transcription of the same historical source, not an
independent historical witness to every event. In particular, its child-list
text contains 虨 where the local source has a lacuna; the lacuna needs the
separately documented source-correction procedure.

## Candidate-by-candidate source judgments

IDs below abbreviate `jinshu:053:cand_`. They specify source-local meaning,
not executable decisions or offsets. Grouped IDs each have a distinct candidate
in the packet. If an enclosing full title and its components overlap, use only
the schema's supported representation after checking the exact final wording.

| Candidate suffix | Judgment and evidence |
| --- | --- |
| `523e02b466ec9f5f` | `Heaven` in 天子氣 is not a reference to a named individual. The whole phrase describes an imperial aura. |
| `194668bbf5e9ac56` | `Prince` belongs to the full `Prince of Guangling`, 廣陵王, locally p001. The previous biographical context identifies the prince; this is not a separate Prince. |
| `e52f72d263aa7470` | `Crown Prince` corresponds to 太子, locally p001. |
| `200b2d13ba5a3bd6` | The first s0063 `Prince` is in `Prince of Liang`, 梁王肜, locally p051. |
| `6b8390c3b5e7e7f5` | The second s0063 `Prince` is in `Prince of Huainan`, 淮南王允, locally p052. |
| `25dcca266b0a27dd` | s0063 `Zhao` is part of the title 趙王倫, locally p054, not a separate person. |
| `c7b50c21e83f5cb3` | `General-in-Chief Sima Rong` expands 大將軍梁王肜, locally p051. Correct the person's existing name/claims only through a separately checked source-backed edit; a mention link alone does not repair a contradictory Tong label. |
| `c24d32ff69ebaf50`, `53e4f0d3d4cdc1db`, `a7ced6d11ecdf1da` | s0108 `Lun`, `Prince`, and `Zhao` are components of 趙王倫, the prince for whom 孫秀 is adviser, locally p054. |
| `9e13cb8aefd7aadf`, `8b50d48c050cf12b` | s0111 `Prince` and `Zhao` are the title 趙王倫, locally p054; 秀 tells him the proposal. |
| `b9ec23a9324923be` | `All` translates a collective sentiment in 同悲等痛, not an individual. |
| `32c5b3c9f1791ff7` | `Xianping Mausoleum` is the burial place 顯平陵, not a person. |
| `64a2c5fedcc5df96` | s0172 `Prince` is in 南陽王; the subject follows the child 字道文 in s0171, locally p028. This does not establish that the unnamed son in s0017 is necessarily the same person. **The idiomatic sentence omits 追; see the editorial hold below.** |
| `6f06d15ca1c4a827` | `Prince of Linhuai`, 臨淮王, is 臧 introduced immediately before, locally p068. |
| `c558ac3414829511`, `789300eaa5a46e24`, `8448bc18029fb928` | s0179 `Lun`, `Prince`, `Zhao` correspond to 趙王倫, locally p054; the imperial grandson is a different figure. |
| `a9b9b1b7929dc11c`, `0c939602d7e61a50`, `e70a7bd4b71a0007` | s0183 first `Prince`, `Zhao`, and `Lun` correspond to 趙王倫, locally p054. |
| `b0652f53467c579a` | s0183 second `Prince` is in `Prince of Puyang`, 濮陽王: the demoted grandson 臧, locally p068, not Lun. |
| `5021a0321e0edaa8` | `Prince of Xiangyang`, 襄陽王, refers to 尚 introduced in the preceding unit, locally p069. |
| `ceddecf925f4b2a2`, `852bfc6c8ad0e262` | `All` and `Heaven` are parts of 天下, the realm/people collectively; neither refers to an individual. |
| `105b2fe617db5013` | `Heaven` renders 天 in 天挺, a cosmological attribution, not a named person. |
| `3b5abb84a67a7e04` | `Once` is a temporal conjunction for 既, not a name. |
| `dc3cdc7da8dba67c` | `Lady Jiang` corresponds to 蔣美人, locally p027. Her identity does not by itself prove which separately named child she bore. |
| `d007b642bf81eeaf` | s0131 `Alas` is the exclamation 嗚呼, not a name. |
| `86dce4b95424d9fb` | s0151 `Alas` is the exclamation 嗚呼哀哉, not a name. |

These are 31 candidate IDs. Attribution does not approve complete coverage:
the packet covers only particular candidates and changed units. A candidate
surface may already be represented by an existing mention, and exact overlap,
kind, occurrence, code-point offsets, and disposition still require validated
handling against the final sealed text.

## Unsafe automatic mentions

1. **s0063 p001 `Yu`**: the auto-reconciled mention `m0234` selects the two
   English letters inside `He Yu`, while p001 is Sima Yu the crown prince.
   Chinese 尚書和郁 names Minister Director He Yu, separately p049; 太子 at
   the end identifies the crown prince. Remove only the mistaken p001 English
   occurrence and connect the complete `He Yu` surface to p049 using a reviewed
   schema-valid mention. Retain p001's supported 太子/crown-prince mention.
   Inspect candidate `333b09cb95859bf6`, candidate references, exact code-point
   spans and overlap after the final source freeze. Do not rely on a substring
   match to reassign an identity.
2. **s0113 p026 second `Jia`**: `m0346` links the Jia in `the Jia family` to
   Empress Jia as a person. The Chinese distinguishes 贾后 from 贾氏之黨,
   a clan/faction affiliation; the revised English likewise explicitly says
   family. Preserve the first `Empress Jia` person mention, remove the second
   standalone person link, and review candidate `5a0e2c2625fec491` in its
   exact context. Do not eliminate the collective expression from the prose.

These recommendations are source-local. Their implementation has not been
applied or validated here.

## Separate translation and source holds

- **s0131 伊策:** The existing literal `Yi Ce` treats 策 as part of a
  person's name, whereas 冊復太子 and the subsequent imperial patent make a
  parsing with 策 as the act of issuing a patent/announcement plausible. The
  idiomatic text already has `Yi to announce by patent`. A parallel literal
  correction should be independently proposed and reviewed. The single local
  character 伊 following 衛尉 is insufficient by itself to establish the
  envoy's full name or confidently merge p062 across chapters. Do not silently
  edit the previously sealed decision set, or assert an independently verified
  full name. The source also has a parallel formula later in this chapter,
  皇帝臨軒，使洗馬劉務告于皇太子之殯曰, confirming that an official is sent
  to address the prince, but it does not independently prove the identity of 伊.
- **s0172 追:** The exact V2 literal retains `posthumous`, but the idiomatic
  `Fourth month titled Prince of Nanyang` omits 追 and lacks an explicit
  subject. In context, propose and independently review, for example, `In the
  fourth month, he was posthumously enfeoffed Prince of Nanyang.` Recompute all
  affected candidate offsets and source fingerprints if it is adopted. The
  missing local source character in s0171 must be resolved separately before
  claiming the name and character were verified from the local text.
- **s0132 direct speech:** After the colon and 嗚呼 in s0131, the source
  continues the patent's second-person address: 維爾少資岐嶷之質，荷先帝殊異
  之寵，大啟土宇，奄有淮陵. The V2 idiomatic `Hui's ghost-eulogy praised Wu
  Di's love and Yu's fief` summarizes it rather than translating the address,
  omits salient content, and obscures the speaker/genre. The literal also
  renders 淮陵 as `Hailing`, which needs source-backed name checking. A separate
  paired-field proposal and independent review are needed; this observation
  is not a substitute for a full editorial review.
- **s0171 `Eldest Bin`:** the displayed local Chinese only says 字道文 … 薨;
  its missing initial character is a source lacuna. The excerpt alone does not
  establish `eldest`; the independent transcription's three-child listing is
  evidence of names but order alone should not be promoted into a birth-order
  fact without additional support.

The s0172 and s0132 issues materially prevent a claim that this V2 chapter is
editorially closed. Fixing any text changes the fingerprint and can invalidate
packet offsets and approvals; review and reseal before downstream work. The
date, full extraction, cross-chapter identities, link coverage, publication,
and ebook gates remain separately outstanding.
