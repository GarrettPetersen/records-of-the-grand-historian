# Songshu 069 — applied editorial history recovery

**Owner:** `cursor-nov24-editorial-recovery-1`

## Situation

- Source already reflects **51** translation repairs (`translationRepairs[].status === "applied"`).
- **`data/people/editorial-decisions/songshu/069.json` is missing** (never in git).
- `extraction.run`: `Manual bilingual source rereview`, `agentId: null`, `completedAt: 2026-08-23`.
- Provenance hint: commit `19d4bcf58f` ("Complete Songshu 69 people rereview").

## Sealed inputs (checkout bytes)

| Path | SHA-256 |
| --- | --- |
| `data/songshu/069.json` | `01ffbb157491f5a75e0d7665802659e5355053a8a3674627a2153e488293db47` |
| `data/people/extractions/songshu/069.json` | `843d8566e6d9c169309744090716197a9e9404cac99aee749a4f2c929fba7544` |
| `data/people/date-audits/songshu/069.json` | `61b5a078e4e49a5436be48b550574d4271f3dc53a18525e8d8f3a8d5392f6565` |

Date audit reused: **audited**, 0 findings.

## Owner verification

All 51 applied `after` strings match current source fields (0 still on `before`).

## Next gate

Independent reviewer must **not** treat owner inventory as approval. Options:

1. Source-review a sample or full set from `applied-editorial-recovery-inventory.json`, then record `data/people/editorial-decisions/songshu/069.json` with genuine reviewer metadata and accept decisions matching the applied repairs; or
2. Reject/revise any repair that fails source check and reconcile source + extraction.

Identity dossier preparation remains blocked until `editorial-decisions` validates against applied repairs.

**Applied contracts fingerprint:** `sha256:ad0c1e0214fa568f00cfbdecf0bf01a759eff09e1e06a178011e267a283a2341`

See `provenance-blocker.json` and `exact-chapter-handoff.json` for the narrow gate receipt.