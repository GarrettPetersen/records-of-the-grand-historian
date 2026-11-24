# Jinshu 090 owner: install schema4 editorial history (not chapter completion)

**Staging:** #5489 @ `378771b831`  
**Independent evidence:** `e1e1ec9605`  
**Owner PR context:** #5415

## Installed

Exact `source-reviewed-editorial-decisions.json` → `data/people/editorial-decisions/jinshu/090.json` (schema 4):

| Batch | Agent | Decisions |
|-------|-------|-----------|
| Independent | `bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8` | **33 accept** (`r0001`–`r0033`) |
| Retained grok | `bc-5bf35208-796f-45c3-8547-d8732edd1730` | **17 accept** (`r0034`–`r0050`) + claim sidecars |

Retained review bytes match prior v3 accepted document exactly (producer IDs + claim retraction/revision sidecars unchanged).  
Chapter source, extraction, and all English fields **unchanged**.

## Validation

- `validateEditorialDecisionDocument` + `validateAppliedEditorialDecisions` → ok  
- `people:validate-extraction` → ok  
- `people:validate --book jinshu --chapter 090` → scoped pass (50 applied / 50 decisions)

## Non-actions

No manufactured approval · no dates · no registry · no English rewrite · no other chapter · no merge
