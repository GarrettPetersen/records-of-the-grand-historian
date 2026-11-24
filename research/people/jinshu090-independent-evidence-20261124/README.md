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
| `composition-plan.json` | Host merge plan (`append-schema4-review`); fingerprint rebind still required |
| `coverage-checkpoint.json` | Repair ID / unit / field coverage receipt |
| `independent-source-review-20261124.md` | Human-readable verification notes |

## Native checks run locally

- `validatePeopleExtraction` on expanded `jinshu/090` extraction
- `validateEditorialDecisionDocument` on schema4 artifact
- `validateAppliedEditorialDecisions(schema4, extraction)` → **no errors**

Production `npm run people:validate -- --book jinshu --chapter 090` still fails until the host applies this history to `data/people/editorial-decisions/jinshu/090.json` and rebinding fingerprints.

Rebuild: `node research/people/build-jinshu090-independent-editorial-20261124.mjs`