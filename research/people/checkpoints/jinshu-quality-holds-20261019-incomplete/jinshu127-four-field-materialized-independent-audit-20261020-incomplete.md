# Jinshu 127 four-field materialization: independent audit — HOLD

This is focused research, not canonical approval, whole-chapter editorial review, a date audit, or identity clearance. Independently checked the candidate against its exact pinned prior source and extraction and recomputed all output SHA-256 values:

| Candidate artifact | SHA-256 |
| --- | --- |
| `source.json` | `7ee2060fe19858753d4b08bd4171a567abe85c0d84b77c9b3396d033db0dccd4` |
| `extraction.json` | `4f95b6bc29e14bd7a65869983e855edec7875b10391965c7029538735f257784` |
| `packet.json` | `9bdab3e1bc5ed44cc6f1f5ba7a7e82f2071a280566fec48e94519c34c81c8cfc` |
| `editorial-history.json` | `ccdfed5ce8b2f7ae0303a3854f26258f71ee6cb855efd347280d1e9adabd86a1` |
| `reconciliation-diagnostics.json` | `832f4652941d4cd5f28e91272e68c027311e1cf2255f0877756f5ac1fe41be09` |

Prior source is byte hash `6970c4c954c237823685d6e9accee73bb3e9a49e3aec0c92664c5998ff921652`; prior extraction `cfff7a83582f27778d3088391e2c2633f63c43dbb9888850877464661fd7f6e7`. Candidate source and extraction record chapter fingerprint `sha256:3dd558867abfe3a00e320b6fb21bf4dea88d2f5a44597c9de7e95f6be5668afd`; prior extraction fingerprint was `sha256:a60004e5077ae400ef9f27c317f05149f251ec78efec6d50b523d06ab5501bd0`.

## Source and changed-field comparison

A recursive source comparison finds exactly four changed fields: s0182 literal and idiomatic, s0272 literal, and s0275 literal. All are byte-for-byte the prior independent decision's accepted after-strings; no Chinese or other source field changed. The source readings and s0272 迎 caveat remain those in `jinshu127-followon-translation-independent-review-20261020-incomplete.md`; this audit is not broader endorsement. The prior 30 extraction repairs are unchanged, and the four new repair records are marked applied with the reviewed reasons. People, claims, and coverage are unchanged; the extraction input fingerprint/digests change as expected.

## Complete reconciliation delta and blocking regression

The index-based diagnostics lists 95 changed surface indices. A value-based multiset comparison of every compact surface across the two extractions shows **no added, removed, or modified surface at all**: the index entries result from a permutation around existing p125 `Jin`. Comparing every candidate disposition as a flattened multiset instead finds exactly one addition:

`jinshu:127:cand_b79e43b7adcb8ce4` → `not-person` / `polity`, note `Jin`.

This repeats the independently established false disposition that the immediate prior candidate had removed. Candidate is s0213 English `Jin`, occurrence 1, code points 64–67, in the possessive “Jin's residence”. The pinned Chinese `中黃門遜進扶德逾城，隱於進舍` identifies 遜進 (Xun Jin), whose house shelters De: the second 進 refers to the person, not the polity. The existing p125 personal-name English surface `Jin` occurrence 1 is retained, and its normalized span has the same coordinates but an empty `candidateRefs` list. Thus the new disposition directly contradicts the retained person surface even though the names are not bound by candidateRefs. No other semantic surface or disposition delta was found.

The diagnostic `unresolvedCandidates: []` and `unresolvedSpans: []` do not mean semantically correct accounting. Independently rerunning the staging-derived fixture's strict compact extraction validator and applied-history validator passes, reporting 278 units, 822 candidates, 165 people, 695 mentions, 916 claims, 34 repairs, 480 dispositions, and zero alias-disposition conflicts. This demonstrates the validator does not catch this instance; it is not a reason to accept it.

## Disposition

**Do not promote this materialization.** Preserve it and the prior source-backed p125 correction; correct the false candidate accounting only through an independently reviewed, fingerprint-pinned follow-on. Any automated reconciler change must address the demonstrated fallthrough/regression separately and be tested; do not assume a narrow patch or a passing structural validator guarantees semantic correctness. Also preserve the unresolved s0181/s0194, broader chapter, date and identity gates. No canonical source, extraction, branch, shared Git index, queue, lock, claim, or build was modified.
