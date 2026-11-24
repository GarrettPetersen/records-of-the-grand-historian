# Jinshu 085 — hold reconcile review at 2ebb84a4

Same reviewer `bc-65fb5d6a…`. Scope: owner provenance/hold native-form tip only.

## Results

| Check | Result |
| --- | --- |
| 21 Chinese-context hold rewrites | verified |
| 3 undated appointment-sequence clears | verified (claim-282/339/340) |
| 29 prior residual edits | preserved |
| 13 editorial accepts | preserved (`sha256:7fb822bb…`) |
| Era date witnesses 205/207/208/392 | preserved |
| Native date report | `research-blocked` (not audited) |
| Semantic dependency pins | recorded in `DEPENDENCY_RECEIPT.json` |

## Residuals kept

24 `unresolvedDateAuditItems` remain (21 holds + 3×`年十八`). Cleared appointment rows stay undated. No invented Western years.

## Extractor metadata

`run.agentId` / `runId` still null; unchanged vs 3f01a1ef. Historical producer evidence verified separately (PR #4900 / grokbot-30).
