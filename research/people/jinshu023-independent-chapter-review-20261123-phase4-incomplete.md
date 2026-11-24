# Jinshu 023 — phase 4 (post #5471 apply)

**Pinned staging head:** `d0f5e31ad74f8dbd3db8885c57c2600709c83c07` (PR #5457)  
**Independent findings:** PR #5471 commit `190dbf48e11e7ad76d6301f1b404b90cbf1c1f19`  
**Status:** **NOT APPROVED** — owner grouped chronology apply verified; remaining claim, hint, and unit residuals documented.

## Editorial (preserved)

- **20/20** applied repairs unchanged; `npm run people:validate -- --book jinshu --chapter 023` PASS.
- Song-variant hold: **p137** 宋識 vs **p146** 宋職.

## #5471 apply verification (102 rows)

Script: `jinshu023-verify-owner-5471-apply-20261123.mjs`  
Artifact: `jinshu023-verify-owner-5471-apply-20261123-incomplete.json`

| Check | Result |
|-------|--------|
| Operations vs phase-3 incorrect ids | **102/102** match |
| Evidence / westernRetained / researchHold | **0** errors |
| Groups | 22 + 46 + 9 + 19 + 6 = **102** |

Post-apply extraction hash (owner receipt): `sha256:f4607f7889c79a9231698bab1d5c5cde32e6039fdfa3e7ea9a495134beb3fd00`

## Omission scan (716 units)

Artifact: `jinshu023-unit-omission-scan-20261123-incomplete.json`

- **716/716** units scanned for explicit calendar phrases.
- **12** units carry explicit calendar text.
- **1** omission candidate: **s0429** (`泰始中歌辭今列之後雲。`) — calendar phrase present, **no** temporal claim cites that unit in the packet.

## Hint checks (167 persons)

| Verdict | Count |
|---------|------:|
| supported | 161 |
| research-blocked | 6 |

**research-blocked:** `hints-p027`, `hints-p028`, `hints-p030`, `hints-p032` (Western hints without source-pinned claim bounds after apply); `hints-p137`, `hints-p146` (Song-variant hold).

## Remaining chronology findings (claim plane)

After re-review at `d0f5e31`:

| Verdict | Count |
|---------|------:|
| supported | 403 claims + 14 hint pairs counted in 417 supported rows |
| incorrect | **14** |
| research-blocked | **6** (hints only) |

**0** incorrect among the original **82** defect candidates (all addressed by #5471).

### Grouped actionable residuals

| Group | Count | Ids (summary) |
|-------|------:|---------------|
| `remainingInterpretiveWesternImport` | **14** | `claim-148`, `159`, `161`, `163`, `180`, `257`, `396`, `411`, `412`, `413`, `506`, `509`, `548`, `556` — thematic `westernBounds` without calendar substring in cited units (outside the 102-row repair set). |
| `finding-hymn-heading-hints-without-claim-bounds` | **4** | p027–p032 hymn-heading AD hints |
| `finding-song-variant-uncertainty` | **2** | p137, p146 |
| `finding-unit-calendar-without-temporal-claim` | **1** unit | s0429 |

Full table: `jinshu023-chronology-substantive-review-table-20261123-incomplete.json` (pin `d0f5e31…`).  
Phase-3 pre-apply table preserved: `jinshu023-chronology-substantive-review-table-20261123-phase3-d8a7b411-incomplete.json`.

## Gates

- Native `people:dates:record` / chapter approval: **not** requested.
- `substantiveCoverageComplete: false` (6 hint holds + 14 incorrect claims + 1 unit omission candidate).

Evidence branch only; no registry build, queue edits, or master PR.