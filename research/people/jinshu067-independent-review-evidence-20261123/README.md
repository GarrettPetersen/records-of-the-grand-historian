# Jinshu 067 independent review — substantive evidence (pin 73a655)

**Candidate PR #5445** @ `73a655fb8523f92a12f58a5d1cd7cb0e815b3012`.  
**Evidence branch only** — no edits to `data/people/extractions`, `data/people/date-audits`, registry, or queue.

## Superseded (not evidence)

- **#5454 / `build-date-audit.mjs`**: default `supported` on every packet item with generic `zh.slice(0,8)` quotes. Passes structural validation only; **rejected** as chronology approval.

## This bundle

| File | Role |
| ---- | ---- |
| `reviewed-decision-table.json` | Exhaustive decision source; no default verdicts in serializer |
| `assemble-substantive-report.mjs` | Fails if quote ∉ unit; emits native report from table only |
| `date-audit-report-substantive.json` | **`status: needs-revision`** — passes `validateDateAuditReport` |
| `native-validation-receipt.json` | Validator pass + exact coverage counts |
| `continuity-and-xi-yin-retained.json` | Preserved verified continuity + Xi Yin decisions |

## Native coverage (honest)

- **269 / 452** packet `itemChecks` (28 vital/hint + 241 attestation ownership)
- **171 / 578** `reviewedUnits` (units touched by substantive checks)
- **4** `personChecks` (p178, p029, p041, p166)
- **61** attestation items **incorrect** (event quote not in cited unit)
- **170** empty `active-date-hint` rows **not** substantively reviewed

Native `people:dates:verify` on candidate remains **un-audited** (no `data/people/date-audits/jinshu/067.json` on candidate).