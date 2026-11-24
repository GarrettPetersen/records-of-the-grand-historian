# Jinshu 030 — p154 / s0296 witness-hold repair proposal

**Status:** proposed-only. No sealed inputs modified. PR #5479 untouched.

## Hold (identity transport part 011)

`p154` attaches English `Zhang Pei` to `s0296`, but Chinese there is only the gesture list starting `仰手似乞` (no personal name). Independent reviewer held.

## Diagnosis

| Item | Finding |
|------|---------|
| Valid Chinese witness for 張裴 | `s0252` `明法掾張裴又注律…` → already on **p153** |
| `s0296` Chinese | Full gesture/expression list; no 張裴 |
| `s0296` idiomatic | Summary-only: invents “Zhang Pei” |
| `s0296` literal | Already lists each gesture — **no change** |
| `p154` | EN-only duplicate of p153, sole surface at s0296 |

## Proposed apply (future; not done here)

1. Replace `s0296` idiomatic with complete gesture/expression rendering (see `hold-proposal.json`).
2. Leave literal unchanged.
3. **Remove** `p154` (person, EN surface, claims). Do **not** relocate onto s0252 (would duplicate p153). Keep p153 mentions intact.
4. Scoped date refresh later: drop only `p154` / `hints-p154` rows; preserve p153 and all other approvals.

## Artifacts

- `hold-proposal.json` — field, before/after, unit, source reason, fingerprint dependencies
- `scoped-verification.json` — read-only witness checks against sealed tip

## Non-actions

No source/extraction/editorial/date edits; no broad gates; no merge.
