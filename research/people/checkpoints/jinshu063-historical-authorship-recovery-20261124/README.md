# Jinshu 063 historical authorship recovery

Restores provable original extractor metadata on staging candidate #5487.

## Provenance
- Merged extraction PR #4901 @ `c73403c20ed60b91a1f22c07dd14b0779a3eee25`
- Historical ledger `833c4c1e6d42f820e86655a471d38d96690d127e` claim `jinshu/063`
- Worker `grokbot-27`
- Original artifact SHA256 `de15bdcb4278fafcf51718b2d4d79f3514eadc59ae7c35836e8ccfa7b753aaa7` (verified)
- Six original chunk ranges match tip and ledger exactly

## Change
Populate only each missing chunk `agentId` with `grokbot-27`. Retain unknown `runId` values as null. Leave top-level `run.agentId` null.

## Preserved
Ten qualitative source-date pairs, 66 applied English repairs, nine verified deltas, chapter evidence, editorial decisions, sealed date packet.

## Non-actions
No chronology approval, other content work, or merge.
