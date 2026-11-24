# Jinshu 078 continuity + partial native chronology (db0945f)

Candidate: PR #5425 / `db0945f96ae6b1273da5ac0dbe21a9ccc6db82e5`  
Evidence branch: `cursor/jinshu-078-re-review-820d952-7f05`  
Reviewer: `bc-7f508e5e-7b4f-4508-9646-49aac6917f05`

## Continuity verification

See `continuity-verification.json`:

- **8/8** new local same-person links across **7** groups present
- **33/33** prior exact link approvals retained (41 undirected / 82 reciprocal live)
- **p002 ≠ p166** affirmed from Chinese (Kong 汪 vs Tao 汪); no same-person claim
- **r0027 / r0028** English accepts retained; `validateAppliedEditorialDecisions` OK

## Partial native chronology

Pinned packet: 573 items / 173 people / 16 jobs  
`sourceHash` / `extractionHash` match owner dates-packet-summary.

Validated job parts (via `validateDateJobResult`):

| Index | Job ID | Units | Notes |
|------:|--------|-------|-------|
| 0 | 359d5c533f64e66fe393 | s0001–s0026 | 惠帝末 + 帝為晉王 shared passages; 7 listing research-blocks |
| 1 | 85fa29b17ea464fdd12b | s0027–s0052 | 咸和八年 shared decree; external-event holds preserved |
| 2 | 774ab4ab3a7ea314d6af | s0053–s0078 | 咸康八年 / 太元十七年 / 及帝崩 / 隆安中; Jing career research-block |

Next index: `chronology-partial/next-index.json` → job index **3** (`22df163f20a500cf95be`).

Source-only vs residual: `source-only-vs-residual-defects.json` (no residual defects in this span).

## Explicit non-claims

Not `assembleDateReview`, not `status=audited`, no author edits, no synthetic approval, no merge, no full registry.


## Jobs 3–5 continuation (2026-11-24)

Validated and retained jobs 0–2; added:

| Index | Job ID | Units | Notes |
|------:|--------|-------|-------|
| 3 | 22df163f20a500cf95be | s0079–s0104 | 義熙四年/317/320 supported; Zhou Zha & Chong/Kan holds |
| 4 | 77933ffdcc4d9b60869f | s0105–s0130 | Wang Dun / 咸和初 / Sujun onset holds; Wan Mo after 320 |
| 5 | 556555cf72dd36ecaef0 | s0131–s0156 | Sujun campaign continuum + 肅祖臨崩 hold |

Coverage: `chronology-partial/coverage.json`  
Next index: **6** (`66d15f889cf1ee453867`, s0157–s0182)

## Jobs 6–15 continuation (2026-11-24)

Reused jobs 0–5. Validated remaining jobs 6–15 (full unit coverage **415/415**).

- Supported year-numeral anchors include 三康元年/335, 元帝稱制/317, 及帝踐阼/318, 太興三年/320, 成帝踐阼/325, 康帝即位/342, 咸和二年/327.
- Concrete holds retained for unresolved external events (石勒新死, 會王敦反, 蘇峻*, 敦死, 沈充之反, 八月十五日, undated careers).
- **Residual defects (incorrect):** claim-1033/1034/1100 (AD 324), claim-1046–1049 (AD 327–328 intervals) — Chinese lacks year numerals.

Coverage: `chronology-partial/coverage.json`  
Next index: **none** (all 16 jobs complete; still not `assembleDateReview` / not audited).

## Seven-change recheck at `ccbfbfc9`

See `research/people/jinshu078-seven-chronology-recheck-ccbfbfc9-20261124/`.

## Verify seven undated @ 54d2e91c

See `research/people/jinshu078-seven-undated-verify-54d2e91c-20261124/`.

## Independent 28-group / 109 decisions @ 6bb589b7

See `research/people/jinshu078-unresolved-109-group-decisions-20261124/`.
