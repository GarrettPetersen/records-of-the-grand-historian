# Jinshu 115 independent round 3 — native chronology (draft #5470 @ 6cc3b19)

Same reviewer lane as `research/people/checkpoints/jinshu115-independent-round2-20261123/` (prior evidence `d2b1617653dcd67f49dbbeea32376d73e29c3712`). Editorial and chapter-local approvals from round 2 are **not** re-run here.

## Scope

- Sealed owner packet: `research/people/checkpoints/jinshu115-owner-round1-20261123/date-packet.json`
- **496** native chronology items (28 death, 234 attestation, 234 active-date-hint) on **342** source units
- Whole-source omission pass via `omission-coverage.json` (all units in `reviewedUnits`)

## Outcome

| Artifact | Role |
|----------|------|
| `date-audit-report.json` | Independent native chronology report — **`needs-revision`** (4 incorrect death claims; no Western-year hints approved) |
| `omission-coverage.json` | Unit coverage + non-blocking holds (Guangwu locals, s0330 editorial compression) |
| `generate-date-audit-report.mjs` | Reproduces report from sealed packet + current `data/jinshu/115.json` pins |

## Blocking findings (owner repair)

1. **claim-513 / claim-514 / claim-515** — English “Dajie” vs source **大界營** on s0217 (persons p157–p159 per packet).
2. **claim-625** — Age fifty-two on Fu Deng death cites s0279 only; age is on **s0280** `在位九年，時年五十二。` (p185).

## Identity dependency

Canonical cross-chapter merge for **Emperor Guangwu** split across **p059 / p082 / p134** remains **blocked** until `readPeopleCatalog` / CI-generated catalog is available on the review runner. Chapter `same-person` tags are insufficient for canonical certification here.

## Not done on this runner

- No `data/people/date-audits/jinshu/115.json` record (status stays `needs-revision`; host must record after owner repairs)
- No global catalog, site build, queue edit, merge, or `audited` self-approval