# Independent second check: Jinshu 053 reconciliation research

This checks the 30 proposed source-local judgments in
`jinshu053-reconciliation-source-local-independent-review-20261020.md`
(SHA-256 `a11a187ad63d301ac53f31cd4039d76748ac0d12827d0246310a93baa0b6120a`)
against the blank decision seed (SHA-256
`ba3859f7bf7d979635bfc1d3b6bc7f140f52ac674052a82cc2f8660ef7fe7d48`),
its revised unit contexts and original local mention evidence. The source
before the imagined 96 repairs has SHA-256
`26f2169267b866e9203dd05f902044aa6c7839d7b780bba10ce4a1b0066c7e78`;
the packet identifies the imagined revised chapter fingerprint as
`sha256:8de9f5f9ac87e22add5c990fca67916bf19c7d9809bfe13678572d7d1ce178de`.
I did not author the first review. This is not blind: it checks that review's
conclusions and existing packet, rather than making a new production decision.

## Candidate-by-candidate source assessment

Suffixes refer to `jinshu:053:cand_…`; paired rows below were checked
separately. Support means only that the indicated local interpretation is
defensible on this exact imagined context; see the integration and name holds.

| Candidate suffix(es) | Check against Chinese and local evidence |
| --- | --- |
| `523e02b466ec9f5f`; `194668bbf5e9ac56` | s0199 `天子氣` is an aura, so Heaven is not an individual; `封為廣陵王` attributes Prince of Guangling to biography subject p001. |
| `e52f72d263aa7470` | s0047 `太子` is p001; the English Crown Prince is a title reference, not personal name. |
| `200b2d13ba5a3bd6`; `6b8390c3b5e7e7f5`; `25dcca266b0a27dd` | s0063 `梁王肜`, `淮南王允`, `趙王倫` are separately represented locally by p051, p052, p054; Prince occurrences 0 and 1 are Liang and Huainan, and Zhao is part of Lun's title. **The p051 romanization is separately held below.** |
| `c24d32ff69ebaf50`; `53e4f0d3d4cdc1db`; `a7ced6d11ecdf1da` | s0108 `趙王倫謀臣孫秀` names Sun Xiu as adviser to Lun: Lun, Prince and Zhao refer to p054; preceding lower-case crown prince is p001. |
| `9e13cb8aefd7aadf`; `8b50d48c050cf12b` | s0111 `秀言于趙王倫，倫深納焉` identifies the Prince/Zhao title as p054, not speaker Xiu p059. |
| `b9ec23a9324923be` | s0165 `同悲等痛` uses All as a collective, not a person. |
| `32c5b3c9f1791ff7` | s0168 `葬于顯平陵` is a burial location, not a person. |
| `64a2c5fedcc5df96` | s0171 names the previous subject's courtesy name 道文, and s0172 `追封南陽王` attaches that title to local p028. The immediately preceding s0170 has a lacuna in the first son's name: this supports the title attribution, not a reconstructed name. |
| `6f06d15ca1c4a827` | s0173 `臧字敬文` introduces Zang, and s0174 `封臨淮王` supports p068. |
| `c558ac3414829511`; `789300eaa5a46e24`; `8448bc18029fb928` | s0179 `趙王倫行太孫太傅` supports Lun and Prince of Zhao as p054. |
| `a9b9b1b7929dc11c`; `b0652f53467c579a`; `e70a7bd4b71a0007`; `0c939602d7e61a50` | s0183 `趙王倫篡位，廢為濮陽王` distinguishes Lun p054 and the demoted grandson p068, who is the subject of the prior sequence from s0173. Prince occurrence 0 and Zhao belong to Lun; occurrence 1 is Prince of Puyang, p068. |
| `5021a0321e0edaa8` | s0206 `尚字敬仁` introduces Shang, and s0207 `封為襄陽王` supports the p069 title. |
| `ceddecf925f4b2a2`; `852bfc6c8ad0e262` | s0187 天下 as All under Heaven is a collective, not a named individual. |
| `105b2fe617db5013` | s0194 天挺 is a cosmological attribution, not a human-person mention. |
| `3b5abb84a67a7e04` | s0198 Once is a conjunction, not a name. |
| `dc3cdc7da8dba67c` | s0017 蔣美人 is the favored consort and matches the local p027 Chinese title; Lady Jiang refers to her. This does not determine the identity of her unnamed son. |
| `d007b642bf81eeaf`; `86dce4b95424d9fb` | s0131 嗚呼 and s0151 嗚呼哀哉 are exclamations; Alas is not a person in either context. |

## Important differences and holds

1. The first review says `梁王肜` pairs with **Sima Tong**. The packet's
   imagined revised English and original p051 label indeed use Tong, but
   `jinshu053-rong-v1-independent-review-20261020.md` independently supports
   Sima **Rong** for 司馬肜 using Jinshu 038 s0010 and other source evidence.
   Therefore do not interpret this local title-to-p051 judgment as approval
   of Tong, or ignore the already identified name correction. Rebuild the
   packet and offsets if its English is corrected; the local identity of the
   title holder and romanization of the full name are separate questions.
2. In s0017 the source says the favored consort bore a son but does not name
   him. The original extraction associates the title 皇孫 there with p028;
   this candidate concerns Lady Jiang only and cannot validate that child
   assignment, biological parentage, or p028's cross-chapter identity.
3. All 30 decision slots in the seed are null. I verified the exact string,
   code-point offsets, and case-sensitive occurrence for every candidate
   against the **imagined revised idiomatic field**. Many offsets do not match
   the literal field; never transplant them to it. No packet here proves the
   repairs were actually applied. Future text changes require regenerated
   fingerprints, occurrences and offsets.
4. `Prince` and `Zhao` in the same full title overlap as candidate substrings;
   where the final validator allows, cover both with one exact full-title
   mention for the correct person, not overlapping independent links. `Lun`
   is an adjacent personal-name span, subject to actual validator rules.
   Across s0183 distinguish Prince occurrence 0 (p054) from occurrence 1
   (p068). Do not assume old full-title mentions survive changed wording.
5. This checks the 30 rows only. It does not establish complete candidate
   coverage, new independent production decisions, editorial closure, date or
   identity approval, or publication readiness. Nothing in this review
   modifies a source, extraction, Git/index, queue, lock, build or worktree.
