# Independent consolidated review — Jinshu 030 staging draft #5479

Reviewer conversation `bc-ab2acfed-77c9-4601-afc7-18feb78285d3`. Target staging commit `a8c157f5611b0ced987f361262fb6173725f0571` (draft PR #5479, owner `bc-64160cca-fb61-4c6e-ba29-27cd0fc0ada1`, source PR #5421). Author package: `research/people/checkpoints/jinshu030-author-residual-20261123/`. Machine-readable decisions: `independent-consolidated-review.json` in that directory.

This is one independent review across source/English proposals, extraction structure, Han-era chronology scope, and identity prerequisites. It does **not** apply repairs, edit claim ledgers, merge staging, or grant publication, date audit, or canonical identity certification.

## Pins and validation

| Artifact | SHA-256 |
| --- | --- |
| `data/jinshu/030.json` | `3298f6dd67c597a5a61a6c662199b7b10f54640db3f5eeef158f003e2a8e2a09` |
| `data/people/extractions/jinshu/030.json` | `625cf1e818f5703a6143c443c03c115695e74d656f6cc32b078bb071b7a47d3f` |
| `date-packet.json` | see JSON pin `datePacketSha256` |
| Author residual | `6bd4575cea18b3977beea3284f2023a1d3551d819860998820fef39b41cc9b6d` |

`npm run people:validate -- --book jinshu --chapter 030` passed: 208 people, 509 mentions, 1341 claims, **44 proposed / 0 applied** repairs, 0 editorial decisions. All 44 proposed `before` strings match live English (0 mismatches). `people:dates:status` → **un-audited**.

## Editorial — 44 translation repairs

**Verdict: accept all 44** for owner application via the normal repair applier (bilingual pairs where author supplied literal follow-ups). Source English remains unchanged until apply.

Independent spot-checks (Chinese cited from pinned `data/jinshu/030.json`):

| Units | Finding |
| --- | --- |
| s0096 | 於是作《春秋折獄》 attributes the work to Dong Zhongshu after Zhang Tang visits; owner replacement accepted. |
| s0067b/f | 統 is 梁統 (s0050); Wang Tong → Liang Tong accepted in both fields. |
| s0149 | 九百六卷 = 906; 司徒鮑公 = Lord Bao; accepted. |
| s0211–s0212 | 景帝輔政 = Sima Shi regent; 顗 = Xun Yi, 與景帝姻; accepted. |
| s0184 | 《丁酉詔書》，漢文所下; Wen-di edict and Detention Statute reading accepted. |
| s0246 | 泰始三年 only in source; removal of unsourced `(267 CE)` accepted (does not approve a Western year in claims). |
| s0525 | 則加之以刑 argues corporal substitution; accepted reversal of “received death.” |
| s0563 | 鐘陳 = Zhong Yao and Chen Qun; 元皇 = Emperor Yuan; accepted. |
| s0122–s0123 | Exemplar lists match supplied expansions. |

No repair rejected. No additional English defect found in the author source-review sample (540/575 units marked clean). Themes from the residual package (parallel literal omissions, attribution, regency wording) are addressed by the accepted set.

## Extraction record

**p044 Chen Chong 陳寵:** accept `polity: ["Eastern Han"]` (already on staging extraction). Reject prior Western/Eastern Jin assignment as contradicting 章帝 / 永元 context.

## Chronology — Han-era scope (not approval)

**Scoped cohort:** Han law retrospective and debates — 69 Han-tagged local people; ~191 `outside-knowledge conversion` western-interval attestations; native reign strings in chapter text include 永元, 初元, 建平, 泰始, 元興, and the 丁酉詔 attribution.

**Holds (source-supported):**

1. Entire chapter remains **un-audited**; no Western year or reign conversion in extraction/date claims is approved here.
2. Han official active hints (e.g. Chen Chong `AD 76-94`, Guo Gong `AD 87-94`, Chen Zhong `AD 107-125`) require independent audit against native anchors such as 永元六年 — not independent approval in this review.
3. Accept **editorial** hold at s0246 only (drop invented Western parenthetical); does not certify Taishi 3 in date claims.

Owner should run `people:dates:run` / record workflow on the sealed `date-packet.json` with this Han cohort explicit.

## Identity (no canonical certification)

**Exact canonical identity packet:** absent. **Dependency:** current immutable registry generation + `prepareChapterIdentityReview` output (`source-review-packet.json` for jinshu/030). No membership seals in this review.

**Bounded lookup (5 authenticated GET attempts):** all returned `404 {"error":"Unknown read-only route"}` (routes recorded in JSON). No registry dossiers retrieved.

**Chapter-local:** accept Han attribution for p044 only. **Additional work after lookup/API fix:** Chen Chong 陳寵 homographs; Liang Tong 梁統; Dong Zhongshu anchor; Zhang Shizhi 張釋之; Xun Yi 荀顗 — listed in JSON.

## Owner next steps

1. Materialize `data/people/editorial-decisions/jinshu/030.json` from accepted repairs and run applier (source still owner-owned).
2. Independent date audit on scoped Han/Western-interval claims.
3. Identity preparation when registry + lookup routes are available.

**Publication:** not ready. **Reviewer approval flag:** `approvalGranted: false`.