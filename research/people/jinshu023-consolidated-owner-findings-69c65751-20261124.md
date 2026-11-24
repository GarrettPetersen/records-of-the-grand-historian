# Jinshu 023 — consolidated owner findings (hints + named contexts)

**Staging pin:** `69c657510f3acda54f223edfdf19f7d70686ace0` (PR #5457)  
**Prior independent evidence:** `cf34382f02672845023f425ec96a3ce79dab19da`  
**Not approved.** No re-review of the **18** representation changes, **102** #5471 checks, or **20** editorial decisions.

Machine JSON: `jinshu023-consolidated-owner-findings-69c65751-20261124-incomplete.json`

## Six active-date hint rows (this pass)

| Row | Verdict | At pin |
|-----|---------|--------|
| `hints-p027` | **supported** | `[]` — stale AD cleared; pairs `claim-121` undated attestation |
| `hints-p028` | **supported** | `[]` + `claim-125` |
| `hints-p030` | **supported** | `[]` + `claim-135` |
| `hints-p032` | **supported** | `[]` + `claim-141` |
| `hints-p137` | **research-blocked** | `[]`; **宋識** / `claim-530` 魏晉之世 unresolved; Song hold |
| `hints-p146` | **supported** | Qualitative hint only (no AD digits); **宋職** / `claim-556` unresolved |

## Unresolved source contexts (phase4b list only)

| Scope | Verdict | Owner action |
|-------|---------|--------------|
| `claim-409`, `claim-410` | **incorrect** | Drop `westernBounds`; keep exact `桓玄將僭位` (unsupported Western, not Chinese contradiction) |
| `unit-s0429` | **supported** | `claim-424` / `claim-467` cite unit with unresolved `泰始中` — omission flag from `b7b699` cleared at packet level |

## Open owner actions (consolidated)

1. Repair **`claim-409`** and **`claim-410`** (sibling rows to verified `claim-411`–`413`).  
2. Retain **Song-variant** scheduling hold on **`hints-p137`** until identity review closes 宋識 vs 宋職.  
3. Host **native date record** at current extraction hash (still no `dateAudits/jinshu/023.json`).

No author edit, merge, registry build, or queue change from independent reviewer.