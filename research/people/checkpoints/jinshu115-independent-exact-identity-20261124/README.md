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
| Parts 008–011 | **101** cases **unreviewed** (`identity-review-coverage.json`) |

Authored judgments live in **`authored-native-part-report-NNN.json`**. **`verify-native-part-report.mjs`** only checks transport byte hashes and witness lint, then copies verified output to **`native-part-report-NNN.json`**.

| Part | `native-part-report` SHA-256 |
| --- | --- |
| 005 | `d8131cc910e9a1361c5099fdad63425a10011a653d3d2fd203c5b2ee1a0426a6` |
| 006 | `a5dfe8c7cf8c0b6710dd19969e72a009f8fbb7dc96fa1246a9663e2c6cdcad04` |
| 007 | `21393c729453a24ab5303b146b346cf2bcfe7d421840f51feeafc035156c3b59` |

## Rejected on this branch

- Commit **`df861a8499`** batch (mechanical reason generator) — superseded by hand-authored part 001 only.
- Commit **`46008dfc0`** — still non-authoritative.

No production scripts are modified. No host `people:identity:record` or merges.