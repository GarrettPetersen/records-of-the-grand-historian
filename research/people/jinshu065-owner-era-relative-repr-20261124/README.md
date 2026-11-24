# Jinshu 065 owner era/relative representation (not approval)

**Base:** `047c6b226e` (#5426)  
**Independent review:** `a6e1739ab1` (`optional-precision-era-review.json`)  
**Status:** chronology still **not approved** — scoped representation repair only

## Preserved

- All **44** independently covered optional-precision rows (byte-stable)
- **r0017** editorial accept
- **p054** Liyang `undatedSourceAttestation` cluster
- Ten **咸康五年** + AD **339** Western witnesses (preserved, not newly certified)

## Applied (remaining era/relative groups)

1. Direct-witness groups (`義熙末`, `昇平二年`, `穆帝詔`, `隆安初`, `二年`, `俄而帝崩…隆安初`): kept exact native `sourceDate.text`, added `qualitative`, retained `unresolved` research hold — **no** Western year/bound invented.
2. Long'an narrative context claims whose cited units lacked `隆安` characters: added true owned witness **`s0310`** to evidence while keeping exact relative wording + qualitative + unresolved.
3. Hints: cleared 18 orphan “Eastern Jin court activity” hints on undated-only people; related era-person hints to exact claim/group witnesses.

## Unresolved (honest)

Jin→Western concordance still unpinned for the seven retained-era groups. See `unresolved-evidence.json`. No full re-audit, registry edit, fabricated chronology, or merge.

## Validators

- `people:validate-extraction --normalize` → ok
- `people:validate --book jinshu --chapter 065` → scoped pass
