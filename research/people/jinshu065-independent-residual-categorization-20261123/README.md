# Jinshu 065 — independent residual categorization (2026-11-23)

Independent final reviewer continuation on PR **#5426** @ `629a81d9159a8bedbb4c7e509b14a62e159683aa`, reusing native chronology report `f0ab1ebe8c10be64f70f5c573dd4198618c123cb`.

## Scope

- Review owner undated-representation fix under `research/people/jinshu065-owner-undated-repr-fix-20261123/`
- Cross-check group-specific earlier ledger `research/people/jinshu065-owner-date-consolidation-20261123/applied-date-changes.json` (longan / yixi-mid / shihu / sixth-winter)
- Verify p054 Liyang raid + dependents remain source-supported **without** unsupported numeric conversion
- Preserve r0017 and already accepted unaffected evidence
- Categorize the exact prior **165** research-blocked residuals
- Reuse genuine native unchanged checks only
- **No** broad audit restart, automatic decisions, source/validator/queue edits, or merge

## Verdict

**Scoped validation pass with concrete blockers remaining.** Chronology is still **not** approved.

| Bucket | Count |
|--------|------:|
| Prior incorrect (f0ab) cleared of Western years | 30 / 30 |
| → undatedSourceAttestation (Shi Hu / Liyang cluster) | 7 |
| → unresolved hold (Long'an / 義熙中 / sixth-winter) | 23 |
| Research-blocked residuals categorized | 165 |
| Truly unsupported era/mapping (Western conversion unpinned) | **44** (20 claims + 24 hints) |
| Optional date precision on otherwise supported source | **121** |
| — of which 咸康五年 Chinese-era + Western-until-pinned | 10 |

### Taxonomy

- **unsupported-era-or-mapping:** Jin era / sequential year / emperor-reign (or hint) where Jin→Western mapping is unavailable; a Western year would be an unsupported assertion.
- **optional-precision-on-supported-source:** source event/age/Chinese-era is supported (including explicit 咸康五年); exact Western certification is optional or held only for pin.

## p054 Liyang

Source `s0183`：石季龍掠騎至曆陽 — no reign year. Accepted as `undatedSourceAttestation` on claim-364 / claim-428 / claim-429 and same-narrative dependents (claim-355, 407–410, 427). No AD 334. Empty `hints-p054` is scoped hint debt, not a license to invent a year.

## Blockers (concrete, source-specific)

1. **Stale date-audit file** — still pins pre-fix extraction `d6424e6b…`; current extraction `924c3009…`. Needs fresh native packet+record (not done here).
2. **44 unsupported era/mapping residuals** — keep unresolved or pin Jin→Western mapping; IDs in `unsupported-era-or-mapping-ids.txt`.
3. **Prior-incorrect Long'an / 義熙中 / sixth-winter** — representation fixed to unresolved; Western approval still blocked until mapping is pinned.
4. **hints-p054 empty** — optional non-numeric research-required hint preferred; do not restore AD 334.

## Non-blockers

- Liyang undated representation
- r0017 editorial accept preserved (`jinshu:065:r0017` accept on Sima Pou)
- 121 optional-precision residuals (`optional-precision-ids.txt`), including 10× 咸康五年
- Reused prior supported undated checks: claim-182, claim-190, claim-559, claim-630

## Validation

- `people:validate-extraction` PASS
- `people:validate --book jinshu --chapter 065` PASS (1 person without active-date hint)

Artifacts are reviewer-only. No owner source, validator, queue, or merge actions.
