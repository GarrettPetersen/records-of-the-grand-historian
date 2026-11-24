# Independent review r7: Jinshu 123 historical authorship provenance rebind @ `b377300715a080920ab3df533f89b1628d6ae3cf`

**Status:** chronology **audited** (provenance rebind); chapter **not** publication-approved; **no** identity seals.  
**Continues reviewer:** `bc-985e5c79-a8bc-4040-8f8d-4f1fba0f38b2`  
**Prior r6 audited:** `91d58169` (exact decision preimage under `preserved/`)  
**Prior r5 circuit-breaker:** `25af2db2` research-blocked (preserved)  
**Owner dependency:** `jinshu123-historical-authorship-recovery-20261124/dependency-receipt.json`

## Historical authorship (verified)

| Anchor | Value |
|-------|-------|
| Author | `grokbot-34` |
| Original merged PR | #4873 (`grokbot/people-jinshu-123-grokbot-34`) |
| Original commit | `0797338b` |
| Artifact sha256 | `7726c0687af94658def61107162018bd0c29ec0efe07b10be59afd4f7a31acbf` |
| Queue revision | `69671ddc` (worker `grokbot-34`, same artifact hash) |
| Pin | #5439 @ `b377300715` |

## Native date packet delta

- **Unchanged:** all 322 date items, 103 people, mentions/surfaces, 298 Chinese units, claim positions, unitPeople dependencies, `sourceHash`
- **Changed:** extractor `run.agentId` / chunk `agentId` null → `grokbot-34` only → `extractionHash` `c6513710…` → `9a3a107b…`

## Reuse

- Exact r6 semantic `itemChecks` (322) + `personChecks` (103) rebound to current `extractionHash`
- **No** fresh semantic audit
- Prior hold history retained in `reuse-receipt.json` and `preserved/`

## Non-actions

No source edits, fresh audit, identity approval, or merge.
