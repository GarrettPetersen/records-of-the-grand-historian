# Jinshu 085 — holder diagnosis at 85ae6671

Same reviewer `bc-65fb5d6a…`.

## Metadata-only tip

`85ae667155` changes only `run.chunks[].agentId` → `grokbot-30`. Claims/holds/English accepts unchanged vs `2ebb84a4`.

Chunk ranges match PR **#4900** head and queue `833c4c1e` `grokbotPlan` (001/002a/002b/003/004/005/006). Top-level `run.agentId`/`runId` remain null.

## Diagnosis of 24 unresolved packet holders

| Class | Count | IDs |
| --- | --- | --- |
| Genuinely unresolved | 3 | claim-395, claim-396, claim-397 |
| Already-supported Chinese wording | 12 | claim-9, claim-237, claim-296, claim-341, claim-342, claim-343, claim-352, claim-353, claim-407, claim-408, claim-409, claim-410 |
| Honestly undated role | 9 | claim-280, claim-281, claim-379, claim-380, claim-381, claim-382, claim-399, claim-400, claim-412 |

Plus already-cleared undated appointment rows claim-282/339/340 (outside packet).

## Pattern

Jinshu 094 exact era (`太元二十年`, `義熙初`) may carry `westernInterval`. Non-era relative/office/merit/kinship phrases must not.

## Blocked proof

`research-blocked` date audit re-pinned to tip extractionHash; findings retained. No mass clear / source edit / broad re-audit / identity / merge.
