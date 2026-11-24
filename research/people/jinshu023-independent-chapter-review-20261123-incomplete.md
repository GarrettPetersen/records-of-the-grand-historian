# Jinshu 023 independent chapter evidence review

**Candidate:** `2ac477356f2c45918ec874f019b21baa2bef9bd9` (PR #5457 replay of #5412 author evidence)  
**Status:** INCOMPLETE — editorial opinions recorded; date and identity certification still open.

## Preconditions

| Gate | Result |
|------|--------|
| `npm run people:validate -- --book jinshu --chapter 023` | PASS (167 people, 576 mentions, 1050 claims, 20 proposed repairs) |
| Source fingerprint | `sha256:3eef51572…` (matches author package) |
| Extraction fingerprint | `sha256:65683b5a…` (+ s0692 literal vs #5412 `2b40efae…`) |
| Independent date audit on disk | **Missing** |
| Editorial decisions in `data/people/` | **None** (review artifact in `research/people/` only) |

## Editorial (20 proposals)

All **20** proposed translation repairs are **accepted** after independent check against pinned Chinese in `data/jinshu/023.json`. Decisions with witnesses: `jinshu023-editorial-independent-decisions-20261123-incomplete.json`.

High-signal fixes:

- **s0137** — include 權命將周瑜 (Sun Quan orders Zhou Yu).
- **s0179** — Meng Da / You-Hu disordering, not “punishing You-Hu”.
- **s0478** — 受遺齊七政 is Xuan’s charge; Cao Shuang is the parallel clause.
- **s0692** — 成帝咸康七年 (idiomatic + literal); not Xianhe.

## Source coverage and attribution

- Author **19** unresolved references retained (unnamed rulers, lyric fathers, 齊王 act title, etc.).
- **宋職 / 宋識:** keep separate rows with uncertain same-person link (s0648 vs s0656 wording).
- **蔡謨 block (s0692–s0703):** names, offices, and date string supported in Chinese.

No blanket approval of all 167 person rows.

## Chronology (not a native audit)

- Packet: **437** checks; **17** `westernYear` occurrences in extraction, all tied to in-chapter `sourceDate` text in spot samples.
- Spot-check file: `jinshu023-independent-date-spotcheck-20261123-incomplete.json`.
- **Do not** strip western years without item-by-item auditor review.

## Identity

Lookup service healthy (registry pin matches author). Canonical identity **not** certified — upstream date audit missing.

## Open gates

1. Materialize accepted repairs via host editorial apply path.  
2. Independent `people:dates` audit + record.  
3. Chapter identity dossier after date approval.  
4. Publication / combined curation.