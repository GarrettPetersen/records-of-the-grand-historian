# Jinshu 030 — chronology delta independent review

**Reviewer:** `bc-ab2acfed-77c9-4601-afc7-18feb78285d3`  
**Staging:** PR **#5479** @ `580ff1046cecdf4bf5ecdf724302ff6ab8ceeec0`  
**Prior:** `a75ec4bfd63bd4288f9fa712b5170e4bfe839aaf`

## Editorial (unchanged)

All **44** witnessed English repairs remain applied; `data/people/editorial-decisions/jinshu/030.json` hash unchanged (`d3a2d594…`). See `chronology-delta-independent-verification.json`.

## Owner chronology delta — accept

### Eight contextual / exemplar rows
Replaced pseudo-dates (`recalled as exemplar`, `Han commentator`) with source-specific `undatedSourceAttestation` events and cleared `research required` hints. Independently checked Chinese:

| ID | Unit | Judgment |
| --- | --- | --- |
| p052 | s0075 | 臧孫 cited in 子貢 analogy only — no career calendar |
| p073, p075 | s0122 | 卞和 / 巷伯 listed as moral exemplars in parallel rhetoric |
| p096, p097 | s0155 | Named among 章句 commentators without dated office act |
| p132–p135 | s0233 | 叔孫 / 郭 / 杜 commentary schools cited retrospectively |

### Three native era-years (source-only)
| ID | Chinese | Unit | Judgment |
| --- | --- | --- | --- |
| p054 | 永元六年 | s0080 | Era year opens succession of 廷尉 narrative involving 郭躬 / 寵; hint = Chinese only |
| p057 | 建安元年 | s0094 | 應劭 memorial frame; no Western year asserted |
| p162 | 元康四年 | s0379 | 太常荀寓 dismissal after wind damage; no Western year asserted |

No `outsideKnowledge`, `westernInterval`, or unresolved attestations remain (`dateAuditDiagnostics` 0).

## Full chapter date audit

Built native packet (498 date/hint checks, 208 people, 575 units) and completed closed-schema report `independent-date-audit-report.json` with **`status: audited`**, **`findings: []`**, and **`validateDateAuditReport` PASS**.

Judgment principles applied item-by-item:

- **Undated survey attestations** supported where Chinese lacks a bindable era-year.
- **Native era labels** supported as quoted calendar phrasing without Western conversion.
- **Retrospective event-participation** supported as reception ownership, not life intervals.
- **Legendary antiquity** frames supported in preface survey units.
- **Death claims** supported as narrative events without invented calendar endpoints.

Checkpoint report is **not** recorded via `people:dates:record` on this branch (no queue write).

## Constraints

No merge, no `data/jinshu` edits, no claim-queue change, no global build.