# Jinshu 115 independent exact-identity review (2026-11-24)

Independent reviewer: Cursor cloud agent `bc-84536a48-e6d3-4027-a8ff-2478884deaaf` (PR #5483).

## Pinned inputs

| Input | Pin |
| --- | --- |
| Owner draft (#5470) | `f0d51576bc03a0a830aba56eb94fefea3708b727` |
| Prior evidence on #5483 | `c070bbcf9b784420d6e524c25566277bb55768d5` |
| Identity overlay | `113045707441db95d089d8921965df1a813f8bf6` |
| CI run / artifact | `45293576860` / `jinshu-115-native-identity-evidence` |
| Plan fingerprint | `sha256:0e4ccd3401fbc05d67a8f668569169ad7d6c4cfd8c120ccb02c034a4cbc932b0` |

Transport part SHA-256s are verified against `preparation-receipt.json` from the downloaded artifact (see `artifact-verification.json`).

## Non-authoritative prior work

Commit `46008dfc0` and `research/people/checkpoints/jinshu115-independent-identity-20261123/` remain rejected. This checkpoint does not reuse that logic.

## Method

1. Read bounded transport partitions (`transport-part-001.json` … `011`) from the CI artifact.
2. For each case, read primary Chinese from sealed units; pin witnesses to mention-aligned exact graphs (never arbitrary substrings).
3. Author case-specific `reason` text; do **not** copy transport `proposal.reason`.
4. Set `unresolvedIdentity` from bounded overflow / candidate buckets only (structural), preserving canonical uncertainty; no new merges.
5. Incorporate independent zh-surface continuity notes from round-6 evidence where the same locals appear in identity cases.

Assembly and witness lint live only in this checkpoint (`assemble-exact-identity-part.mjs`). Production scripts are unchanged.