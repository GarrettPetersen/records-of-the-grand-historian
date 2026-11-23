# Jinshu 030 owner chronology delta (post-apply review)

Pinned **#5479** `aed1eba6d5d38944fc98a551b846d89da187be5f`.  
Independent evidence **`a75ec4bfd63bd4288f9fa712b5170e4bfe839aaf`**.

## Changed

### Eight held exemplar / commentator rows (resolved)
Removed unresolved attestations that stored reception labels (`recalled as exemplar` / `Han commentator`) as `sourceDate`. Kept one source-specific `undatedSourceAttestation` each; cleared `research required` active-date hints.

| IDs | Was |
|-----|-----|
| p052, p073, p075 | recalled as exemplar |
| p096, p097, p132, p133, p135 | Han commentator |

### Three native era-year attestations (verified)
Source-only `sourceQuotedQualitative` form retained/tightened; active hints remain Chinese era years only (no Western conversion).

| ID | `sourceDate.text` | Unit |
|----|-------------------|------|
| p054 | 永元六年 | s0080 |
| p057 | 建安元年 | s0094 |
| p162 | 元康四年 | s0379 |

## Preserved
- 44 applied English repairs; editorial decisions unchanged
- **p044** Eastern Han
- **193** undated source attestations
- Author/run provenance; no queue/merge/global build

## Irreducible holds
None for this delta.

## Validation
`npm run people:validate -- --book jinshu --chapter 030` → PASS (208 people, 1333 claims, 44 applied).
