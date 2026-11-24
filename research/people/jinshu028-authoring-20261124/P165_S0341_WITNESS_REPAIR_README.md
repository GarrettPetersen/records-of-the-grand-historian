# Jinshu 028 — p165 / s0341 witness repair

Hold: `sha256:0c1bce807f648559c9926c540cb7d04ced4dde073dbdacc9e2852652d217042a`  
Identity part-017 @ `e51b063` (389/390 otherwise approved).

## Defect

`s0341` Chinese: 及石頭之事，六軍大潰，兵人抄掠京邑，爰及二宮。 — no **王敦** primary name surface.  
Prior local `jinshu:028:p165` attributed Wang Dun using English idiom only.

## Repair (minimal)

1. **Remove** local `p165` (duplicate Wang Dun without valid Chinese name witness).
2. **Add** undated attestation on existing `jinshu:028:p100` with evidence `s0341` and literal event wording (no invented personal name on that unit).
3. **Preserve** all other Wang Dun locals (`p033`, `p100`, `p201`, `p313`), 79 editorials, audited `date-audits/jinshu/028.json` on disk (stale vs new extraction until independent re-audit).

Receipt: `p165-s0341-witness-closure-receipt.json`