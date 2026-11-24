# Jinshu 116 two-group verify + Shaodang before-AD-56 reconcile (2026-11-24)

## Pins

- Candidate: #5429 @ `c6d2f8b57e12101afd375e078173f2baa3ff38f3`
- Evidence: #5453 / investigation `729d9f643cf45995ce13d16d7042a4821abedfd6`
- Owner receipts: `two-group-representation-delta-receipt.json`, `owner-two-group-representation-vs-729d9f64.json`
- Reviewer: `bc-96175e3c-9233-480b-8bdd-ac02689d9be2`
- Branch: `cursor/jinshu-116-independent-shaodang-ad56-9be2`

## Preserved

- Editorial **70** accepts: byte-identical
- Saved Shaodang hold rows unchanged on candidate (`claim-12`, `hints-p007`)
- Prior verified residual pins untouched
- No general chronology rerun, owner edits, validator edits, canonical approval, or merge

## Two representation groups — verified

| Group | Native IDs | Source pin | Verdict |
| --- | --- | --- | --- |
| Sun Ce | claim-253, hints-p054, p054 | s0104 `孫策之儔` | supported undated simile |
| Zhongyuan raid | claim-14, claim-15, hints-p008 | s0005 `漢中元末寇擾西州` | supported undated exact source form |
| Zhongyuan counterattack | claim-16–18, hints-p009 | s0005 `為楊虛侯馬武所敗` | supported undated exact source form |

Raid vs counterattack clauses are correctly separated; HHS 滇吾 years remain unsealed / not equated.

## claim-12 / hints-p007 reconcile

**Actor:** p007 Shaodang 燒當 (not 填虞).  
**Witness:** s0005 `其後燒當雄於洮、罕之間`.  
**Available structure:** then `七世孫填虞` (relative order only) → raid `漢中元末寇擾西州` → counterattack `為楊虛侯馬武所敗`.

`before AD 56` is not licensed: the year is an inferred Zhongyuan-end conversion that the raid/counterattack rows no longer assert, and Shaodang’s own clause has no year title. This is **absence of a licensed Western bound**, not a positive Chinese contradiction that requires keeping AD 56.

### One minimal supported change (not applied here)

1. **claim-12** → undatedSourceAttestation on exact form `其後燒當雄於洮、罕之間`; drop `westernBounds.before AD 56`.
2. **hints-p007** → `[]` (clear `before AD 56`).

Exact before/after JSON: `minimal-supported-change.json`.

## Outcome

- Two groups: OK  
- Shaodang pair: **minimal supported undate** (recommended)  
- Not canonical approval; staging extraction / date-audit provenance left unchanged in this pass
