# Jinshu 094 owner — restore resolution member IDs p081 / p087

Exact draft **#5430** @ `2daaba8f060fcbcad4c9daa65b5ecc43a184da31`.  
Registry Actions run **45284160964** failed: unknown local person `jinshu:094:p087` (and verified dependency `p081`).

## Dependencies (verified)

| Missing ID | Name | currentSameName | Accepted docs |
|------------|------|-----------------|---------------|
| p087 | Sima Yan 司馬炎 | p046 | `jinshu053-current-renew-merge-012-medium-d-20261025.json`, `jinshu053-wu-source-reviewed-20261029.json` |
| p081 | Zhang Hua 張華 | p062 | `jinshu053-current-renew-merge-014-large-f-20261025.json` |

## Natal Chinese spans (chapter source)

- **p046** — `s0145` 武帝踐阼…
- **p087** — `s0238` 武帝欲以琦…; `s0242` …我已為武帝吏…
- **p062** — `s0166` 時張華領司徒…; `s0188` 中書令張華…
- **p081** — `s0226` …中書監張華…

## Owner correction

Restored gap IDs **p081** / **p087** with tip chronology (undated attestations; empty active-date hints). Split absorbed evidence back from p046/p062. Added reciprocal chapter-local `same-person` links. Did **not** edit resolution documents, invent anchors, or delete production merges.

## Checks

- Scoped `people:validate --book jinshu --chapter 094` PASS
- All master + tip resolution `jinshu:094:*` membership refs resolve (0 missing)
