# Jinshu 116 independent chronology recheck vs #5446 (2026-11-23)

## Pins

- Candidate PR: #5429 @ `5520975d6aaf496e3494352c6498fa12947d3f80`
- Compared to: `b23b174813b42c498da3448c56de421f2e6e572d` and native report on #5446 (`f1c3429e8d…`)
- Reviewer: `bc-96175e3c-9233-480b-8bdd-ac02689d9be2`
- Review branch: `cursor/jinshu-116-independent-dates-recheck-9be2`

## Byte-identical (unchanged proof)

| Artifact | Result |
| --- | --- |
| `data/jinshu/116.json` | identical to b23b174 |
| `data/people/editorial-decisions/jinshu/116.json` | identical; **70** accepts retained |
| Extraction | changed only (see owner residual package) |

Editorial was not re-opened.

## Scoped verification

| Item | Verdict |
| --- | --- |
| claim-255 + s0297 | **supported** (year sentence now cited) |
| Undated Yang An / Fu Jian invasion / Quan Yi defection / Fu Jian capture rows | **supported** |
| hints-p064 empty; hints-p054 empty | **supported** |
| Sun Ce claim-253 / p054 | **research-blocked** (simile only; no Western lifespan) |
| Zhongyuan p008/p009 claims + research-required hints | **research-blocked** (no sealed conversion) |

## Independent residual findings (block audited)

1. **claim-315 / claim-291 / claim-563 / hints-p059 / p059** — residual Fu Jian Western packaging (AD 384 on s0121; AD 383 bounds on s0114; AD 357–385 on dream s0282).
2. **claim-446 / claim-502 (incorrect)** — Fu Deng-war `sourceDate` belongs to s0166 but evidence cites s0175.
3. **claim-540 / claim-568 / hints-p039 / p039 (incorrect + blocked)** — Matouyuan `sourceDate` belongs to s0243 but evidence cites s0233.

## Native record

- Packet rebuilt: 680 items / 150 people / 299 units  
  - `sourceHash` `sha256:158449e5963593c9cb5561cc79748324a474c712eab72af66facfa4b4145dd89`  
  - `extractionHash` `sha256:898cee6b383600a81977169ec66c443515f85c94504d37c44bcff9cdbc6e46f8`
- `people:dates:record` → **`research-blocked`**
- `people:dates:verify` → research-blocked:1
- Counts: itemChecks 34 (17 supported / 13 research-blocked / 4 incorrect) · personChecks 9 · findings 6 · references 10

## Identity / certification

**Not opened.** Chronology did not verify as `audited`.

## Next action

Owner repair residual Fu Jian/Quan Yi mis-pins and unsupported Western fields; preserve Sun Ce + Zhongyuan unresolved holds; rebuild packet; same reviewer re-audits. Identity only after audited verify.
