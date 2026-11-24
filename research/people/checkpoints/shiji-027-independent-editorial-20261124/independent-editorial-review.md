# Shiji 027 — independent editorial review (round 1)

**Reviewer:** `bc-846df7da-16df-49e5-b4ac-eef19ac70d51` (Composer 2.5)  
**Owner PR:** #5500 @ `1ba8105866cf74e93204ea88185bd29685b9a941` (`bc-340a6bc1-9a52-4e4e-88fd-a75cb8c3b429`)  
**Proposals file:** `../shiji-027-owner-round1-20261124/pending-editorial-proposals.json`  
  SHA-256 `c41580ef263fdc0b8f8c7d944a57dc7aab88460974d2319d4eae598eb730a5c0`

Editorial review only. No source apply, no date blessing, no identity seal, no publication.

## Verification

- Read all seven proposal units in `data/shiji/027.json`; confirmed each `before` text matches live literal or idiomatic English on fingerprint `sha256:764e34d5181048a156c8077a073323242c648e5ec822eb2ca150a6ed7acb1ee9`.
- Compared Chinese excerpts to both English fields and chapter-internal parallels (`s0631` for 華; list context `s0757`–`s0765` for astronomers; `s0789` for misplaced barbarian text).
- Native `validateEditorialDecisions` passes on `independent-editorial-decisions.json`.

## Decisions

| ID | Unit | Field | Verdict | Before → After (if accepted) |
| --- | --- | --- | --- | --- |
| r0001 | s0011 | literal | **accept** | Huazhi → Mount Hua |
| r0002 | s0011 | idiomatic | **accept** | Huazhi → Mount Hua |
| r0003 | s0168 | literal | **reject** | (keep literal; do not add “the general”) |
| r0004 | s0759 | idiomatic | **accept** | Chu / Tang Mei → Under the Xia / Kunwu |
| r0005 | s0759 | literal | **accept** | same |
| r0006 | s0779 | idiomatic | **accept** | s0789 barbarian text → twenty-eight lodges / Dipper handle |
| r0007 | s0779 | literal | **accept** | same |

### r0003 rationale

縮，其國有憂，將亡，國傾敗 follows the same omen pattern as s0167 (贏，其國有兵不復). Here 將亡 is “about to perish,” not “the general will perish.” The literal already renders 將 as future auxiliary; the idiomatic line is the defective one and needs a separate repair proposal.

### Extraction / date bindings (accepted repairs)

- **s0759 (r0004–r0005):** Extraction already places Kunwu (p012) on `s0759` with Tang Mei confined to `s0765`. Accepted English aligns with existing claims `c` on p012; no date-claim change.
- **s0011, s0779:** Place/cosmology strings only; no person or date claim edits on current extraction.

## Pending (not approved here)

- Owner native apply of six accepted repairs via `apply-people-translation-repairs.mjs` + copy decisions to `data/people/editorial-decisions/shiji/027.json`.
- New editorial proposal for s0168 **idiomatic** (replace “the general will perish” with “about to perish” / equivalent).
- Identity dossier and publication remain blocked until editorial apply clears proposals.

## Retained owner work

Owner checkpoint `shiji-027-owner-round1-20261124/` unchanged. Date audit bytes unchanged (`status: audited`).