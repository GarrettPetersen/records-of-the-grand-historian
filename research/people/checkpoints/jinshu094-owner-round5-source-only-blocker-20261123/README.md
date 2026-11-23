# Jinshu 094 owner round 5 — source-only contract blocker

Pinned #5430 @ `6a105053b45aedce8955a8660d982fbbfdee774b` with independent review #5466.

## Ask
Only `claim-133` / `claim-134` (`s0306`「永康初」) remain held. Investigate native source-only attestation contract; if applicable, preserve exact Chinese sourceDate + qualitative early-era context with no Western year and drop unresolved only when the contract + validator confirm.

## Finding
- Contract **does apply to the chapter data** (exact `永康初` in `s0306`; persons have no competing Western/life chronology).
- Contract is implemented on **master** as `sourceQuotedQualitativeAttestation` + `scripts/test-people-source-only-chronology.mjs`.
- This **staging branch validator lacks** that helper. Chapter-only rewrite → prompt-v7 Western gate failures.
- Probe against master validator: PASS / unresolved 0. Branch file restored; no extraction mutation.

## Action taken
**No claim edits.** Recorded blocker with exact before/attempted-after evidence. Deaths, English decisions, and all other items untouched. No self-approval.

Same reviewer: `bc-aa913dc1-24e5-4aaf-9dd8-6d1b0651a008`.
