# Jinshu 090 independent editorial evidence (2026-11-24)

Independent reviewer: `bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8` (distinct from owner PR #5415 and retained grok reviewer `bc-5bf35208-796f-45c3-8547-d8732edd1730`).

Staging pin: PR #5489 commit `378771b831b7eb7b7049903eb3e26bb86155db4d`.

## Scope

- **Verified:** applied repairs `jinshu:090:r0001`–`r0033` (33) against primary Chinese in `data/jinshu/090.json` and both English fields in the current extraction.
- **Retained unchanged:** prior authenticated batch `r0034`–`r0050` (17) copied verbatim from `data/people/editorial-decisions/jinshu/090.json`, including claim retraction/revision/addition sidecars.
- **No changes** to chapter source, extraction, editorial production file, chronology, identity, or registry.

## Artifacts

| File | Role |
|------|------|
| `source-reviewed-editorial-decisions.json` | Schema 4 history: independent batch + retained grok batch |
| `editorial-install-verification.json` | Confirms 33+17 install contract vs unchanged production v3 producer |
| `composition-plan.json` | Host merge plan (`append-schema4-review`); fingerprint rebind still required |
| `coverage-checkpoint.json` | Editorial repair ID / unit / field coverage receipt |
| `chronology-scope-checkpoint.json` | Date audit progress and next biography groups |
| `date-packet-pin.json` | Pinned native date packet (~553 items) for this review generation |
| `partial-date-report-preface-20261124.json` | Validated `needs-revision` partial report (preface units only) |
| `partial-date-preface-20261124.md` | Human summary of chronology pass 1 |
| `partial-date-report-lu-zhi-20261124.json` | Validated partial report (魯芝 s0016–s0057) |
| `partial-date-lu-zhi-20261124.md` | Human summary of chronology pass 2 |
| `chronology-cumulative-checkpoint-20261124.json` | Unique item-ID coverage across completed groups |
| `partial-date-report-hu-wei-20261124.json` | Validated partial report (胡威 s0058–s0092) |
| `partial-date-hu-wei-20261124.md` | Human summary of chronology pass 3 |
| `partial-date-report-du-zhen-20261124.json` | Validated partial report (杜軫 s0093–s0135) |
| `partial-date-du-zhen-20261124.md` | Human summary of chronology pass 4 |
| `partial-date-report-biog136-212-20261124.json` | 竇允–王宏–曹攄 tranche (s0136–s0212) |
| `partial-date-biog136-212-20261124.md` | Human summary of chronology pass 5 |
| `partial-date-report-pan-fan-ding-20261124.json` | 潘京–丁紹 tranche (s0213–s0276) |
| `chronology-owner-defect-groups-20261124.json` | Recurring blocked patterns for owner patch |
| `partial-date-pan-fan-ding-20261124.md` | Human summary of chronology pass 6 |
| `partial-date-report-qiao-deng-20261124.json` | 喬智明–鄧攸 (s0277–s0376) |
| `partial-date-qiao-deng-20261124.md` | Human summary of chronology pass 7 |
| `partial-date-report-wu-shilun-hints-20261124.json` | 吳隱之 + 【史论】 + all active-date hints (s0377–s0439) |
| `partial-date-wu-shilun-hints-20261124.md` | Human summary of final remainder (553/553 item IDs) |
| `owner-chronology-author-notes.json` | Retained owner notes from staging #5489 + independent progress pointer |
| `independent-source-review-20261124.md` | Editorial verification notes (r0001–r0033) |

## Native checks run locally

- `validatePeopleExtraction` on expanded `jinshu/090` extraction
- `validateEditorialDecisionDocument` on schema4 artifact
- `validateAppliedEditorialDecisions(schema4, extraction)` → **no errors**
- `validateDateAuditReport` on preface, Lu Zhi, and Hu Wei partial reports against pinned packet → **pass**

Production `npm run people:validate -- --book jinshu --chapter 090` still fails until the host applies editorial schema4 history. No file under `data/people/date-audits/jinshu/090.json` is installed.

Rebuild:

- `node research/people/build-jinshu090-independent-editorial-20261124.mjs`
- `node research/people/verify-jinshu090-editorial-install-20261124.mjs`
- `node research/people/build-jinshu090-partial-date-preface-20261124.mjs`
- `node research/people/build-jinshu090-partial-date-lu-zhi-20261124.mjs`
- `node research/people/build-jinshu090-partial-date-hu-wei-20261124.mjs`
- `node research/people/build-jinshu090-partial-date-du-zhen-20261124.mjs`
- `node research/people/build-jinshu090-partial-date-biog136-212-20261124.mjs`
- `node research/people/build-jinshu090-partial-date-pan277-20261124.mjs`
- `node research/people/build-jinshu090-partial-date-qiao-deng-20261124.mjs`
- `node research/people/build-jinshu090-partial-date-wu-shilun-hints-20261124.mjs`