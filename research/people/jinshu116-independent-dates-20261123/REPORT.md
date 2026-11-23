# Jinshu 116 independent chronology recheck (2026-11-23)

## Scope

- Candidate PR: #5429
- Candidate branch: `codex/cursor-glossary-nov24-2026-jinshu116`
- Candidate revision: `b23b174813b42c498da3448c56de421f2e6e572d`
- Reviewer agent: `bc-96175e3c-9233-480b-8bdd-ac02689d9be2` (same independent reviewer as #5441)
- Distinct review branch: `cursor/jinshu-116-independent-dates-9be2`
- No owner edits, merges, corpus builds, secrets, or imagined dates/approvals

## Confirmed before chronology

### R1 residual wording (supported; owner already applied on b23b174)

| Surface | Exact English now present |
| --- | --- |
| Lan Du attack claim | `Attacked Lan Du.` |
| Gucheng Shen ask claim | `asked Gucheng Shen` |
| Suolu Yao friend descriptor | `Friend of Suolu Yao from Longxi` |

`translation-repairs.journal.json` still lists these three as leftovers; chapter text matches the intended English. No further wording repair required for this recheck.

### Editorial provenance unchanged

- Path: `data/people/editorial-decisions/jinshu/116.json`
- Accepts: **70**
- Reviewer agent: `bc-96175e3c-9233-480b-8bdd-ac02689d9be2`
- Completed at: `2026-11-23T07:52:58.741Z` (from #5441)
- Not re-opened; not re-recorded

`npm run people:validate -- --book jinshu --chapter 116 --require-ready` passed with `editorialDecisions: ok`.

## Chronology result

Native path used:

1. `node scripts/build-people-date-packet.mjs --book jinshu --chapter 116 --out /tmp/jinshu116-r3/date-packet.json`
2. Independent report authored against current packet + still-valid prior evidence
3. `node scripts/people-date-audit.mjs validate-report --report …`
4. `npm run people:dates:record -- --report …`
5. `npm run people:dates:verify -- --book jinshu --chapter 116`

### Recorded status

**`research-blocked`** (not `audited`)

| Count | Value |
| --- | --- |
| itemChecks | 20 |
| personChecks | 8 |
| reviewedUnits | 13 |
| findings | 6 |
| references | 12 |
| supported itemChecks | 7 |
| research-blocked itemChecks | 12 |
| incorrect itemChecks | 1 |

Hashes pinned to current extraction:

- `sourceHash`: `sha256:158449e596359…` (full in audit file)
- `extractionHash`: `sha256:4ea6895944eed…`

### Why not audited

Only `claim-253` remains `unresolved` in the extraction, but many other Western-year claims lack a chapter year-title or other in-chapter chronological anchor that would honestly support the stated Gregorian year. Prior accepted date evidence was reused only where still valid against current unit text; no editorial work was repeated.

### Actionable corrections / research holds

1. **`claim-255` (incorrect)**: Western year is asserted without matching year evidence on the cited unit / related unit s0297. Either attach the actual year-bearing evidence unit or drop/rephrase the year until supported.
2. **Sun Ce / related early-war claims (research-blocked)**: Western years for Sun Ce material lack a supporting year title or equivalent in-chapter chronological marker in the scoped packet. Hold until source year structure is cited or the year is removed.
3. **Yang An material (research-blocked)**: Same class of hold — Gregorian year without chapter year-title support.
4. **Fu Jian material (research-blocked)**: Same class of hold.
5. **Quan Yi material (research-blocked)**: Same class of hold.
6. **Zhongyuan / remaining blocked personChecks**: Preserve as research holds; do not invent dynasty-to-Gregorian conversions outside chapter evidence.

Supported anchors retained where chapter text + prior valid evidence still match (including claim-272 / 33 / 76 / 332 / 431 / 596 and hints around p054). Full native detail is in `data/people/date-audits/jinshu/116.json`.

## Affected dependencies

- `data/people/date-audits/jinshu/116.json` (new research-blocked record)
- `data/people/date-audit-history/jinshu/116/` (prior audit archived by native recorder)
- Identity certification / publication gates remain blocked until chronology can pass as `audited` (or host accepts documented holds under completion rules — this report does **not** grant that)
- Editorial file unchanged; no identity merge package in this PR

## Non-goals for this recheck

- No corpus / registry / site builds
- No owner-branch commits or merges
- No fabricated `audited` status
- No identity final review in this turn
