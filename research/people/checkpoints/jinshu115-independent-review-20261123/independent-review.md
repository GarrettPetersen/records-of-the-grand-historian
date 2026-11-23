# Jinshu 115 independent review (#5470 @ f9c7de78)

Reviewer: Cursor Cloud (Composer 2.5). Owner package: #5422 / `jinshu115-author-residual-20261123`. **No approval** for editorial apply, date audit, identity publication, or staging merge.

Pins: source `sha256:c647289fc8cc1dee31029844ea9b01200ff4b2fcfbf9c9d4e6f15bfaa529abf5`; extraction `sha256:7a53354c4a7932ebd7096342d11b4e276212ee6248445e39539c0bd8534fd1c3`; match owner residual.

`npm run people:validate -- --book jinshu --chapter 115` passed with 27 proposed / 0 applied repairs. `people:dates:status` remains **un-audited**.

## Checked coverage (actual)

| Lane | What was checked |
|------|------------------|
| Editorial | All **27** proposed repairs, **17** units, both fields where proposed; pinned `data/jinshu/115.json` Chinese for every verdict |
| Named person | All **8** owner extraction issues; explicit gaps at **s0179** (聖公) and **s0238** (舜); local duplicate clusters (Mao Xing, Bai Weiping, Empress Mao, Yao Shuode) |
| Chronology | **6** owner-noted units re-read in source; **no** Western years invented |
| Identity | **Local** extraction evidence only; cross-chapter catalog lookup **not** run (no lookup token; no local `catalog.json` shard) |

This is **not** a fresh full-chapter named-person census beyond owner-flagged scope.

## Translation repairs (26 accept, 1 reject)

### Reject

- **jinshu-115-tr-025** (s0318 idiomatic): source is `健既承家…校數奸雄，有可言矣。` only. Owner cited `疏爵以侯楚材，築館以須歸命`, which belongs to **s0330** (`自謂戰必勝…疏爵以侯楚材，築館以須歸命。`). Applying the proposed after-text to s0318 would import a different unit.

### Accept (grouped by shared evidence)

**Liang Xi / Yin command** — `殺洛於西海，以子胤為鷹揚將軍，率眾五萬距光於酒泉。` (tr-001, tr-002). **Casualty fraction / duration** — `眾渴死者十二三` and `幾將一紀` (tr-022–024): twenty-to-thirty percent, not two-thirds; nearly one ji, not exactly twelve years.

**Bai Weiping segmentation** — anchor `臨清柏衛平` (s0082), then `推衛平` / `衛公` / `衛平` (tr-005–011, tr-014–015). **建節/建威 titles** — `建威、西郡太守索泮` and `建節將軍` (tr-003–006, tr-012–013).

**Gengshi title** — `推聖公之義` (tr-016–017). **Direction / narration** — `從陝北渡` (tr-018–019); `遣沖…自繁川` after s0218 登 (tr-020); `格奴阪` not ford (tr-021). **Fu Sheng cruelty** — `忍生靈之命，疑猛獸之朝饑` (tr-026–027): 忍 is ruthless, not sparing.

## Owner extraction fixes

| Issue | Verdict |
|-------|---------|
| ex-001 Fu Yin | Diagnosis accepted; **partial** fix — English surface `Fu Yin` still on p032 at s0045 |
| ex-002 建威 | Office on p036 verified |
| ex-003 Bai Weiping | Preferred names set; **partial** — Wei Ping English/zh surfaces remain until repairs |
| ex-004 p117 death | False s0145 death removed |
| ex-005/006 Empress Mao sex | Female on p129, p168 |
| ex-007 聖公 | Still **missing** person record |
| ex-008 舜 | Still **missing** beside Yao |

## Chronology (source read, not audit approval)

- **s0011** `乙太元十年僭即皇帝位` — Fu Pi accession regnal label only
- **s0127** `在位二年而敗`
- **s0160** `乙太元十一年僭即皇帝位`
- **s0255** `幾將一紀` — approximate duration
- **s0280** `在位九年，時年五十二`
- **s0284** Former Qin span in Yonghe / Taiyuan labels

Owner `date-packet.json` retained for a future `people:dates` audit; this review does not approve it.

## Identity (bounded local evidence)

- **Bai Weiping** p065, p100, p120 — one person; merge withheld
- **Mao Xing** p049, p117 — duplicate locals; death correctly on p049 at s0086 `乃殺興`
- **Empress Mao** p129, p168 — same wife at s0175 `其妻毛氏為皇后` and s0217
- **Yao Shuode** p119, p145 — duplicate locals (not in owner eight)
- **聖公 / 舜** — omission confirmed; no default cross-chapter dossier applied

## Remaining gates

1. Apply **26** accepted repairs; **replace or relocate** tr-025 (consider s0330 for 疏爵 clause)
2. Add/review **聖公** and **舜** extraction with independent identity evidence
3. Run full **`people:dates`** audit on sealed packet
4. **Bounded cross-chapter lookup** before merging duplicate local clusters
5. Reconcile English surfaces and refresh validation after any apply step

No repairs applied, no extraction edits, no queue or master changes in this branch.