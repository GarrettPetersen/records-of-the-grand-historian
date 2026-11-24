# Independent source review: Jinshu 090 repairs r0001–r0033

Reviewer agent: `bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8`.  
Owner evidence: PR #5415; staging candidate PR #5489 @ `378771b831b7eb7b7049903eb3e26bb86155db4d`.

## Outcome

All **33** unauthorized applied repairs are **accepted** as already materialized in `data/jinshu/090.json` and the compact extraction. No incorrect applied English required revision; no fabricated approvals for the retained grok batch.

## Method

For each native repair ID `jinshu:090:r0001`–`r0033` (compact row order = ID ordinal):

1. Read `zh` from `data/jinshu/090.json` for the proposal unit.
2. Confirm applied `before`/`after` in `data/people/extractions/jinshu/090.json` matches the live source English field.
3. Record an independent `accept` with exact native `reason` string (required by `validateAppliedEditorialDecisions`) and a primary-text `sourceWitness.excerpt`.

Retained accepts `r0034`–`r0050` were not re-authored; they are embedded unchanged in `source-reviewed-editorial-decisions.json` review 2.

## Notable confirmations

- **r0001 (s0012):** 海西微昌邑之罪 → Prince of Haixi / offenses on a lesser scale; 羈縻成俗 → loose restraint hardened into custom; 既權逼是憂 preserved. Opening clauses unchanged in applied output.
- **r0002–r0003 (s0048):** 振武將軍 distinguished from 振威 in both fields.
- **r0014 (s0227):** Applied idiomatic now tracks 假借, 若思, and 方極其言論; **Dai Yuan** is correctly absent (若思 only).
- **r0016 → r0030 (s0249):** Chain from widow/grandson misread to 適孫氏 / 有孫名邁 as nephew **Sun Mai** (surname Sun after 適孫氏).
- **r0031 (s0348):** 慰勞 parsed as verb; 散騎常侍桓彝、虞 matches literal field.
- **r0033 (s0436 idiomatic):** Restores 世英/曹氏/宣帝/犯門斬關/收雷霆之威/獎忠貞之烈 rhetoric; personal name **Lu Zhi** remains acceptable for 盧志 in idiomatic voice (literal r0050 retains **Shiying**).

## Still open (unchanged by this review)

- Chapter fingerprint rebind on editorial file (`chapterFingerprint` stale vs extraction `input.chapterFingerprint`).
- Independent date audit, identity/dossier review, combined curation / publication.