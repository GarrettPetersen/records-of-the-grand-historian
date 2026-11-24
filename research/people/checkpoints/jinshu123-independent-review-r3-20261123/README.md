# Independent review r3: Jinshu 123 (PR #5439 @ `c7696e3be9e79839e70bfd643a4205a008d3e07e`)

**Status:** `needs-revision` — chapter **not** approved.  
**Continues reviewer:** `bc-985e5c79-a8bc-4040-8f8d-4f1fba0f38b2` (same as #5444 / #5455)  
**Compared to prior candidate:** `0ebd20b28e489ca9e1a52ff9097091826d8ffb73`  
**Compared to prior review tip (#5455):** `d1f9753e29ab93d0126277c94cad39c2ca0fe46b`  
**Owner residual:** `research/people/checkpoints/jinshu123-owner-round3-20261123/residual-for-same-reviewer.json`  
**Lookup generation (pinned, unchanged):** `cb756c508e0265caad63cdac5c50b49c06d4ca2d2d19bb6e1ef9bde48db40aac`

## Gates

| Gate | Result |
|------|--------|
| Preserve 45 accepts + 4 claim revisions | **Preserved** (schema4 review0; not reopened) |
| r0046 / r0047 | **Applied** (schema4 review1 accepts retained; now in the 47 applied set) |
| 47 applied / 0 proposed | **Verified** (`validateAppliedEditorialDecisions` OK; chapter English matches) |
| Continuity merges (24 groups; 148→103) | **Verified** (keeps present; absorbed absent) |
| Source-form 太原王 (p120) | **Retained** unresolved; not merged into p009 |
| Chronology (current native packet) | **needs-revision** recorded; exact incorrect groups below |
| Identity membership seals | **Not issued** (blocked by chronology) |
| Scoped validators | extraction OK; people:validate OK; dates:verify = needs-revision |

## Exact SHAs

- Staging draft head reviewed: `c7696e3be9e79839e70bfd643a4205a008d3e07e`
- Prior reviewed candidate: `0ebd20b28e489ca9e1a52ff9097091826d8ffb73`
- Prior review tip (#5455): `d1f9753e29ab93d0126277c94cad39c2ca0fe46b`
- Packet hashes (match residual):  
  - source `sha256:45a310e8b04b4146e5a7856022432cf8ab4c6b8d1f68a299202008c0caaee2a6`  
  - extraction `sha256:1589c0fed66a57ac89b6d6f3bca7536e77ab0346e3b31d7d2a355b9c03365caf`

## Chronology (exact, no blanket)

Supported after source-witness / year-conversion review:

- **99** `undatedSourceAttestation` phrase rows (including repaired event clusters).
- Appropriate **unresolved** / statement-only death rows (including p120 太原王).
- **32** direct 太元 rows whose cited evidence contains the era graph, with checked conversions under Jin Xiaowu 太元元年 = AD 376:
  - 太元八年 → AD 383
  - 太元十一年 → AD 386
  - 太元二十一年 → AD 396

Incorrect (grouped in `date-audits/jinshu/123.json` + `date-report-receipt.json`):

1. **4** inherited Western **point-year** rows without era in cited evidence: `claim-400`, `claim-565`, `claim-566`, `claim-567` (565–567 also mislabel Chui’s death on s0280 campaign text).
2. **18** inherited **westernBounds** retaining `sourceDate` 乙太元… while evidence units lack 太元.
3. **18** **AD hints** for people with no direct 太元-witnessed claim in the current packet.

Chapter **not** audited.

## Canonical inputs still needed

See `consolidation.json` → `canonicalInputsStillNeeded` (C1–C5): corrected chronology for the three incorrect groups, rebuilt packet hashes, then identity seal packet only after chronology clears.

## Non-actions

No reopen of the 47 applied repairs / four claim revisions; no identity seals; no master PR; no global builds; no queue edits; no credential disclosure; no merge of #5439.
