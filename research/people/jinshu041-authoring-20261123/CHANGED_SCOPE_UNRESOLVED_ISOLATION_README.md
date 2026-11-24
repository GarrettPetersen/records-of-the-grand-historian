# Jinshu 041 — changed-scope unresolved isolation

Independent evidence: `224a3ed815e7601314188e4a72534cd7d0c9ffb6`  
Staging tip: `3c757829eb842f650be91ae3f478454611d3d6ee` (PR #5476)

## Changed-evidence scope (reviewer-accepted)

| Bucket | Count | Post-isolation state |
|--------|------:|----------------------|
| H1 sourceDate seals | 82 | Untouched Western-conversion unresolved packaging |
| H2 undated exempla | 22 | Intact `undatedSourceAttestation` |
| H4 verified Western+Chinese | 4 | Intact (`太熙元年`→290 / `九年`→299) |
| QL1 qualitative legendary | 23 | Intact top-level qualitative |
| Editorial decisions | 23 | Byte-identical `sha256:d10fd82f…` |

## Real unresolved in scope

Only two containers are **genuine undated deaths** (source has no calendar year):

- `claim-283` (p021 / Wei Rong) — `又早卒` @ s0094
- `claim-484` (p034 / Li Xi) — `及卒` @ s0146

The other **293** unresolved containers are Western-conversion packaging. Unlike Jinshu 028 (`2e1bd988` representationConstraints), evidence `224a3ed8` did **not** authorize western-only-unresolved-flag closure, and attestation rows lack `event` fields for `sourceQuotedQualitativeAttestation`. They remain research holds (no self-approval).

## Minimum correction applied

- `claim-484` statement: `died; date not stated in this chunk` → `died` (source-backed; chronology `dateContext` unchanged)

## Exact remaining holds

See `changed-scope-unresolved-isolation-receipt.json#exactRemainingHolds` (295 claim IDs; genuine = claim-283, claim-484).
