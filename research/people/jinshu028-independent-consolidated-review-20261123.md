# Jinshu 028 — independent consolidated review (staging draft #5477)

**Reviewer:** Cursor Cloud `bc-0dff1b5a-cee1-497c-a682-50af5e1e208b` (independent of owner `bc-e9c3ed78-9d42-4a75-8ea8-b7bd764b43cd`)  
**Candidate:** PR [#5477](https://github.com/GarrettPetersen/records-of-the-grand-historian/pull/5477) @ `e0dd64172202d644fccc431811dcb0f52ff09b5b` (replayed from #5427)  
**Verdict:** **Partial editorial authorization; chapter remains blocked** on chronology, identity certification, residual English, and host publication gates.

## Evidence pins

| Input | SHA-256 (bytes) |
| --- | --- |
| `data/jinshu/028.json` | `6ad9de591ec5a7a906dfd69caf69d99b0cb64056c2b5edbf4dfa197cf4c1ec45` |
| `data/people/extractions/jinshu/028.json` | `29cbfde683fc7df3b53a5bb35eefe8ce580cdbafae4a8661526e595342702424` |
| Native editorial review artifact | `research/people/jinshu028-independent-editorial-decisions-20261123.json` |

`npm run people:validate-extraction data/people/extractions/jinshu/028.json` → **ok** (403 people, 1211 mentions, 2016 claims, 1921 candidates).

Owner-applied English in `data/jinshu/028.json` was **not** treated as authorized until checked. All 72 repair rows in the extraction match the author’s `pending-editorial-proposals.json` targets; `validateAppliedEditorialDecisions` passes against the independent editorial record on this review branch.

## Editorial decisions (72 repairs)

| Disposition | Count | Notes |
| --- | ---: | --- |
| **Accept** (independent) | 71 | Source-supported corrections for mistranslation, dropped names, wrong era labels (e.g. Taishi vs Taihe/Taikang), wrong actors (e.g. 太子小名 → crown prince, not Emperor Hui; 海西公 vs Sima Yi 懿), and coverage restorations. |
| **Accept with residual hold** | 1 | `jinshu:028:r0015` (`s0569` idiomatic): applied text inserts “toward **Jin**” for 中原**向化**; contextual but not lexical. Accept authorized repair vs prior summary, but **hold** until owner either keeps interpretive gloss with explicit reviewer note or softens to “assimilation/submission” without naming Jin. |
| **Reject** | 0 | — |

**Additional English holds outside the 72-pack (not blocking the 71 acceptances above):**

1. **`s0569` literal** still renders 石季龍 as “Shi **Hu**” while idiomatic correctly says Shi **Jilong** — definite omission; needs a sibling literal repair.
2. **Unrepaired summary idiomatics** remain across the chapter (e.g. `s0694`, `s0139`, many annalistic compression lines). The 72-pack addressed the author’s targeted set; it is **not** a full literal/idiomatic audit of all 863 units.
3. **`s0354` Shi Wu (Shi Hu)** gloss in quotation marks is defensible taboo exegesis; retain as medium-confidence accepted, not a hard block.

## Named-person / extraction coverage

- Extraction validates against current source after owner reconciliation.
- `translationRepairs`: **72** rows marked `applied` in the extraction artifact; independent editorial record matches.
- Residual **title-level** `康帝` records appear on **multiple** local people (`p105`, `p318`, `p372`, etc.); bounded lookup shows **truncated** candidate sets for `zh:康帝` (5 postings, search truncated). **No identity certification** for chapter-level merge/split of Kang-di rulers.

## Chronology gate

- `dateAuditStatus('jinshu','028')` → **`un-audited`**.
- Extraction attestation claims carry many `westernBounds` / Ming-table **inferred** years in compact claims — **not** independently date-approved.
- **Hold:** fresh `people:dates:packet` + independent native date audit before catalog/publication gates.

## Identity gate (bounded lookup budget)

Pinned registry: `snapshots/cb756c508e0265caad63cdac5c50b49c06d4ca2d2d19bb6e1ef9bde48db40aac` (matches author package).

Five authenticated lookup operations used (see `jinshu028-independent-identity-lookup-20261123.json`):

1. `/v1/manifest`
2. `/v1/search?key=zh:康帝&limit=3` → truncated multi-posting block
3. `/v1/search?q=Sima%20Yue&limit=5` → truncated
4. `/v1/people/per_4C5P0YD3MKP8B9YNB87D` → 高堂隆 dossier (registry romanization `Gao Tanglong` vs applied `Gaotang Long` — acceptable compound-surname fix at translation layer)
5. `/v1/people/per_0B7XC1NRYFQ61134MT7P` → dossier tied to `jinshu:028` 康帝 claims (membership evidence only; no merge decision)

**Exact canonical chapter identity packet:** **absent**. Dependency: host must run `prepare-people-chapter-identity.mjs` against a current immutable registry generation **after** installing `data/people/editorial-decisions/jinshu/028.json` from the validated independent editorial artifact and **after** date audit progress — reviewer does **not** claim identity certification.

## Consolidated decision list (host-actions)

| # | Area | Decision |
| --- | --- | --- |
| 1 | Editorial (72) | Authorize **71** accepts via `jinshu028-independent-editorial-decisions-20261123.json`; stage as `data/people/editorial-decisions/jinshu/028.json` on host. |
| 2 | Editorial residual | Owner repair **`s0569` literal** (石季龍); resolve **`s0569` idiomatic** Jin vs 向化 per hold note. |
| 3 | Editorial residual | Schedule optional wave for remaining summary idiomatic units outside the 72-pack. |
| 4 | Chronology | **Hold** — full independent date audit required (`un-audited`). |
| 5 | Identity | **Hold** — native chapter identity dossier review after gates in row 1 and 4; no corpus-wide registry build in this review. |
| 6 | Publication | **Blocked** until editorial file installation, date audit, identity certification, and normal CI/publication gates. |

**Do not merge #5477 to staging as a completed chapter.** This review authorizes the substantive English repair set subject to residual holds above.