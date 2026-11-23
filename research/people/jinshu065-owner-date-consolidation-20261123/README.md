# Jinshu 065 owner chronology consolidation (not approval)

**Status:** `needs-revision` — chronology **not** approved.  
**Chapter draft:** PR #5426 @ base `0822cc7b54e483188b51896723d5916883324cb3`  
**Editorial pin:** `f5e6ffcb3c3554e0cf2b7e4010b984da240b5319` (includes residual r0017 Pou accept)  
**Date findings pin:** PR #5443 @ `f0ab1ebe8c10be64f70f5c573dd4198618c123cb` (`needs-revision`)

## What changed

- Adopted native schema-4 editorial decisions (r0017 Pou accept preserved with exact native provenance).
- Adopted native date-audit findings (30 incorrect + 165 research-blocked + 4 supported).
- Repaired all 30 incorrect Western conversions in the chapter extraction:
  - Long'an `四年`/`歳餘` → unresolved (aligned with `隆安初` holds)
  - `義熙中` full-era intervals → unresolved (aligned with `義熙末` policy)
  - `石季龍掠騎至曆陽` AD 334 → unresolved research hold
  - `六年冬` AD 331 → unresolved
- Follow-on: stripped invented AD 334 on `俄而賊退` and restated p054 active-date hint as research-required.
- Left 165 research-blocked holds untouched; preserved supported witnessed dates and established person IDs.

## Fingerprints

| | hash |
|--|--|
| source | `sha256:e874ebdc7941b9c948ea82f14e4fcb4c6ac3ebc3cca1d496da9a4f8a9927fd50` |
| reviewed extraction | `sha256:d6424e6b7ccbfd6a781c046e9a15ab199337599a6d2758cac5a1c894676b7fbf` |
| repaired extraction | `sha256:73f360a613c5e037348b5ccd8fc3113cc5a4986b366e362222b29d9496c56888` |

## Validators

- `node scripts/validate-people-extraction.mjs data/people/extractions/jinshu/065.json` — PASS
- `npm run people:validate -- --book jinshu --chapter 065` — PASS

See `consolidation-receipt.json` for hold groups by source evidence and repair mapping. Same reviewer must recheck; this directory is **not** a date seal.
