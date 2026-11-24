# Jinshu 030 owner round 2 — editorial apply + chronology residual

Exact draft **#5479** base `@ daccd7d55ebfb46c4843edf4c3531fdc7e5dc7c1`.  
Independent witness bindings + native dry-run validation `@ 6661063cf2a7c16e1f60cbc8f0d6c745cf41f967`.

## Editorial (44 accepts) — applied

Reviewer returned complete `sourceWitness` bindings for `jinshu:030:r0001`–`r0044`. Owner checked proposal/before-text pins against the dry-run receipt, then ran the native applier:

```
npm run people:apply-repairs -- --book jinshu --chapter 030 \
  --candidate-resolution data/people/editorial-candidate-decisions/jinshu/030.json
```

- 15 new EN candidates resolved independently: 3 person rebinds (`Emperor Cheng`→`p040`, `Duke Mu`→`p079`, `Masses Lord Bao`→`p095`) and 12 non-person dispositions.
- Mention/source surfaces rebound only for affected repairs; all 208 local person IDs preserved.
- **p044** keeps `polity: ["Eastern Han"]` and Eastern Han role text.
- Chronology/identity rows from the prior owner round are unchanged aside from compact empty `e:[]` serialization.

## Chronology — outside-knowledge Western attestations (unchanged)

Prior owner curation stands; same reviewer will audit chronology on this post-apply candidate. No date self-approval in this step.

## Validation

`npm run people:validate -- --book jinshu --chapter 030` → PASS  
208 people, 539 mentions, 1341 claims, **0 proposed / 44 applied** repairs, 44 editorial decisions.

## Artifacts

- `editorial-witness-bindings-complete.json` — reviewer witness set used for apply
- `editorial-native-validation-receipt.json` — pre-apply dry-run pins `@ 6661063c`
- `editorial-apply-receipt.json` — post-apply hashes + scoped validation
- `missing-editorial-witness-bindings.json` — superseded residual (bindings now complete)
- `outside-knowledge-chronology-diagnosis.json` / `western-attestation-curation-log.json` — chronology residual for the next independent audit

## Not done here

No self-approval, queue edits, merge, or global build.
