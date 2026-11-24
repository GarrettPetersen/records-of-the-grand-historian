# Jinshu 085 — owner apply of independent holder diagnosis

Source diagnosis: commit `6ea06857cd6eef2c9c4a66cd582470664d58f4a8`
(`research/people/jinshu085-independent-holder-diagnosis-85ae6671-20261124/`).

## Applied treatments

1. **12 already-supported Chinese wording** (claims 9, 237, 296, 341–343, 352–353, 407–410): keep `sourceDate` + native `event`; drop `unresolved` / `unresolvedReason`; add `qualitative` with the exact Chinese source phrase (schema-honest relative chronology; no Western years).
2. **9 honestly undated roles** (claims 280–281, 379–382, 399–400, 412): clear `dateContext` entirely (same as already-cleared 282/339/340), preserving claim value and primary evidence.
3. **3 age holds** (claims 395–397): keep unresolved `年十八`; rewrite `event` only to strip smuggled era-anchor boilerplate.

## Preserved

- Editorial: 13 accepts, sha256 `7fb822bb…`
- Historical provenance: chunk `agentId=grokbot-30`, top-level `agentId`/`runId` null
- People / surfaces / translationRepairs / dispositions / coverage / input / run.chunks byte-identical except the 24 named claims

## Validation

- Extraction + scoped people-data: pass
- Dates verify: stale (expected; no self-approval)

See `holder-diagnosis-apply-dependency-receipt.json` and `changed-item-dependency-manifest-holder-diagnosis.json`.
