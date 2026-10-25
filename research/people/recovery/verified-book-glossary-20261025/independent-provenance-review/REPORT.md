# Independent v2 provenance / editorial compatibility review

Verdict: **approve v2 for adoption within this review scope**. The v1 P1 is fixed. No further concrete correctness finding. This is code approval, not chapter/book approval or a release-readiness claim.

Exact base: `81240df60b45d748f7b951c41810ef8cac9c7a3d`. Exact reviewed patch: `sha256:72a2369b17cff7c97c46c84a63505b681096c459856713da4f4c3362bf70fa94`. Recomputed the patch and every one of 11 envelope file hashes; all match. Changed editorial module hash: `sha256:19fc72d9d8627d61df945c470b20cee2200137beb1dcd70e9b8a20bd79490755`.

## Defect closure

`people-editorial-decisions.mjs:525-550` now builds exact authorization contracts from independent accept/revise decisions and requires one for every applied repair. It compares the actual unit locator, field, original text, authorized replacement and review reasoning, while allowing repair-ID resequencing. Existing forward historical checks and extractor self-review rejection remain active.

`exact-v1-repro.mjs` preserves the original r0002 defect fixture and changes its expected outcome to rejection. Both the direct gate case and the case that first passes production strict extraction validation reject with “no matching independent accept/revise authorization”. Exit 0; evidence in `exact-repro-output.txt`.

## Actual normal applier compatibility

`editorial-normal-applier.mjs` invokes the unchanged, exact-master-verified production `applyPeopleTranslationRepairs`, not a simulated implementation:

1. Creates a current synthetic two-sentence source and production extraction seed, then a valid independent acceptance history. The normal applier writes the accepted wording, marks the repair applied and replaces its reason with the independent review reason. The new certified gate passes.
2. Adds a second proposal and an independent revise decision, combines histories using production `mergeEditorialDecisionReview`, and calls the normal applier again. The first accepted repair/history is retained and the second uses the reviewer's revised wording. Production strict extraction validation and the certified gate both pass.
3. Replays the normal applier with no pending proposals; applied history validates and the operation succeeds idempotently.
4. Adds an unauthorized applied repair: rejected. Sets the actual history review agent IDs to the extraction agent: rejected.

Exit 0; complete output in `test-output.txt`. This tests normal transformation of before/after/reason/status and retained historical records, addressing the risk that matching hand-constructed fixtures could conceal incompatibility.

## Remaining reviewed code

The v2 provenance loader, identity seal, canonical projection and ebook generation/verifier production files match their v1 hashes. The earlier review found no concrete defect in their inspected source/input seal, scoped facts, stable canonical IDs, relevant ambiguity, source/date gates or whole-book/volume scope paths. The applied-editorial zero-proposal check remains fixed and the reverse authorization check closes the missing-history gap. Independence continues to use the established production reviewer contract: explicit extractor agent IDs cannot approve their own proposals; supported human/other reviewer records may use null agent IDs under existing schemas.

Required `master-build` CI now runs the portable certified ebook test file alongside the existing readiness/date/editorial suites, and retains `test-people-date-preflight-diagnostics.mjs` in the Cursor recovery test command. Inspected the actual workflow; did not execute CI or a full build.

## Execution boundaries

Disk preflight passed (51.15 GiB free). All writes are in this reviewer directory. Fixtures contain synthetic source/extraction/editorial/packet files; schema/config/chronology/role dependencies are read through symlinks, with no runtime or canonical writes. The supplied overlay loader was copied here with its log redirected here and checks unchanged imported source modules against exact master. No original v1/v2 sealed code/tests were edited; no Git/index/branch/build/worktree/corpus operation or external model request occurred. Date status is supplied directly for these editorial gate checks, so these tests do not claim date qualification or full EPUB readiness.
