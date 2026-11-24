# Jinshu 115 independent exact-identity review (2026-11-24)

Independent reviewer: **`bc-84536a48-e6d3-4027-a8ff-2478884deaaf`** (PR #5483).

## Pinned inputs

| Input | Pin |
| --- | --- |
| Owner draft (#5470) | `f0d51576bc03a0a830aba56eb94fefea3708b727` |
| Identity overlay | `113045707441db95d089d8921965df1a813f8bf6` |
| CI run / artifact | `45293576860` / `jinshu-115-native-identity-evidence` |
| Plan fingerprint | `sha256:0e4ccd3401fbc05d67a8f668569169ad7d6c4cfd8c120ccb02c034a4cbc932b0` |

## Status (this branch)

| Scope | Count |
| --- | --- |
| **`transport-part-001.json`** | **14 / 14** (frozen @ `fc2d7f9e87`) |
| **`transport-part-002.json`** | **14 / 14** authored |
| **`transport-part-003.json`** | **14 / 14** authored |
| **`transport-part-004.json`** | **15 / 15** authored |
| **`transport-part-005.json`** | **28 / 28** authored |
| **`transport-part-006.json`** | **29 / 29** authored |
| **`transport-part-007.json`** | **14 / 14** authored |
| **`transport-part-008.json`** | **14 / 14** authored |
| **`transport-part-009.json`** | **29 / 29** authored |
| **`transport-part-010.json`** | **29 / 29** authored |
| **`transport-part-011.json`** | **29 / 29** authored |
| **Total** | **229 / 229** (`identity-review-coverage.json` complete) |

Authored judgments live in **`authored-native-part-report-NNN.json`**. **`verify-native-part-report.mjs`** only checks transport byte hashes and witness lint, then copies verified output to **`native-part-report-NNN.json`**.

| Part | `native-part-report` SHA-256 |
| --- | --- |
| 008 | `8c74d2b50033f9e4248c6404f4e2b17e6c89146bf34792306c9d1cc2c9a7c26a` |
| 009 | `a3c5d190239b95153602f65d5d52fed27816395564a99fef527055920d5b1ca8` |
| 010 | `8cd1692b8b93ead6eb174e2a9bd51f31554c8c6489c462300ad7cebe19fc77cd` |
| 011 | `59a98c6373a3e63634f40c1a6648cff309d841de9d6becd957b721c959fa7fa7` |

## Rejected on this branch

- Commit **`df861a8499`** batch (mechanical reason generator) — superseded by hand-authored part 001 only.
- Commit **`46008dfc0`** — still non-authoritative.

No production scripts are modified. No host `people:identity:record` or merges.