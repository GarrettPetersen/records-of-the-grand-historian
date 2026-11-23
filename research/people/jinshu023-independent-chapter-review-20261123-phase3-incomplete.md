# Jinshu 023 — retained independent reviewer (phase 3 chronology)

**Pinned owner staging head:** `d8a7b41185d8a59ecae3f03642d2b40dc9c1d4ab` (PR #5457)  
**Status:** **NOT APPROVED** — claim-level witness review complete; person hints, omission scan, and native date record still open.

## Editorial (unchanged)

- **20/20** accepted proposals are **applied** on the pin (`data/people/editorial-decisions/jinshu/023.json`).
- Independent witness file: `jinshu023-editorial-independent-decisions-20261123-incomplete.json` (PR #5464 lineage).
- `npm run people:validate -- --book jinshu --chapter 023` → PASS (20 applied repairs).

## Song-variant uncertainty (explicit hold)

- **p137** 宋識 (`s0648`) and **p146** 宋職 (`s0656`) remain **separate rows**; no merge, no invented same-as link (owner packet + independent editorial review).

## Chronology — substantive item review (rejects #5467 defaults)

The preliminary generator on PR #5467 (`jinshu023-build-independent-date-audit-20261123.mjs`) **defaulted** non-residual rows to `supported` and used **generic prefix fallbacks** when intended witnesses were absent. **Coverage counts from that script are not substantive review.**

This pass uses:

- `jinshu023-build-substantive-chronology-review-20261123.mjs` — no default `supported`; grouped defect verification.
- `jinshu023-chronology-substantive-review-table-20261123-incomplete.json` — **437** rows (`id`, `verdict`, `witnessUnit`, `witnessQuote`, `group`, `rationale`).
- `jinshu023-verify-chronology-witness.mjs` — refuses missing units, quotes not in Chinese, incomplete tables.
- `jinshu023-independent-date-audit-20261123-incomplete.json` — native-shaped report with **`status: research-blocked`**.

### Exact coverage

| Plane | Count | Notes |
|-------|------:|-------|
| Packet temporal items | 437 | All rows in review table |
| Chapter source units | 716 | **Omission scan not completed** (`unitsOmissionScanCompleted: false`) |
| Person hint rows (`hints-p*`) | 167 | **`research-blocked`** — witness anchored to a cite unit only; hints not pinned to Chinese |
| Person checks (`p001`–`p167`) | 167 | **`research-blocked`** — separate substantive pass required |
| **Substantive coverage complete** | **false** | 181 claim/hint rows `research-blocked` (hint plane) |

### Claim-level verdicts (437 items)

| Verdict | Count |
|---------|------:|
| supported | 154 |
| incorrect | 102 |
| research-blocked | 181 (all `hints-p*`) |

### Owner defect candidates (82 ids)

Verified against cited Chinese (not script defaults):

| Outcome | Count |
|---------|------:|
| Confirmed **incorrect** | 81 |
| **supported** (retained) | 1 |
| research-blocked | 0 |

## Grouped actionable residuals for owner

Owner should batch repairs by **verified** evidence group (counts from strict review):

| Group | Incorrect items | Owner action (summary) |
|-------|----------------:|------------------------|
| `compositeNarrativeSourceDate` | 22 | Drop composite `westernYear`; keep 咸在中 / 永和十一年 only where units state them. |
| `interpretiveBoundSourceDate` | 46 | Remove Western precision on hymn interpretive `sourceDate`; keep qualitative attestation. |
| `taiyuanPointerMissingFromEvidence` | 9 | Remove 太元中 `westernBounds` until a unit states 太元. |
| `otherLiteralSourceDateNotInCitedUnits` | 19 | Drop Western imports on thematic hymn labels. |
| `xiankang7PointerMissingFromEvidence` | 6 | Add `s0692` to evidence **or** use source-only dating on edict rows (no AD year without 咸康七年 in cited units). |

Full id lists: `groupedActionableResiduals` in the review table JSON.

## Open gates (no native approval)

1. Complete person-level substantive chronology (including Song hold review).  
2. Unit omission scan across all **716** units if claiming full chapter date certification.  
3. Host `people:dates:record` after an approved substantive audit — **not** this artifact.

## Evidence branch

Chapter-only commits on `cursor/jinshu023-chronology-verified-40d6` (separate from owner staging). **No** registry build, queue edits, or master PR from this reviewer.