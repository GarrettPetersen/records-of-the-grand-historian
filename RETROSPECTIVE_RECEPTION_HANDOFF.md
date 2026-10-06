# Retrospective-only reception: taxonomy correction

The user confirmed on October 6, 2026: **retrospective is the only later-reception
category**. Posthumous is not a subtype or an alternative. This does not affect
`posthumous-name` aliases, death claims, historical descriptions of posthumously
granted honors, or their source evidence.

## Tested implementation

Update: the orchestrator adopted the main correction. The CI gate and the
descriptive-event-kind correction are now applied in the shared working tree;
the remaining patch represents that incremental delta. Git checkpointing and
publication remain host-owned. Reapplying an already applied patch is unnecessary.

`patches/retrospective-reception.patch` contains the complete change, prepared
against the current working files (including the orchestrator's uncommitted date
workflow changes). Adopt at an idle boundary, not over an active date executor:

```sh
git apply --check patches/retrospective-reception.patch
git apply patches/retrospective-reception.patch
node --test scripts/test-people-reception.mjs scripts/test-people-date-workflow.mjs scripts/test-people-date-worker.mjs scripts/test-people-campaign-dates.mjs
```

If preflight conflicts with newer work, reconcile only the affected hunks. Do not
reset or overwrite a working file. The host orchestrator owns Git checkpoints.

The runtime and JSON schemas admit only `receptionType: retrospective`. Reception
events may use `kind: retrospective-reference`. A descriptive event kind may
instead retain its source-specific meaning with `receptionType: retrospective`.
Narrower honor/work claims may carry
the type without changing their actual honor/work description. Former posthumous
labels are explicit validation errors, not silently accepted compatibility aliases.
Production-validator tests pin the approved set literally and reject invented
types, case/whitespace variants, nulls and wrong JSON types. Descriptive event
kinds are not a closed vocabulary; do not invent a new whitelist for them.

The repair gate allows the exact taxonomy-only reconciliation, preserving subject,
predicate, role, action prose and evidence; it still rejects arbitrary event edits.
Independent review, exact before-values, hashes, complete coverage and publication
gates remain in force. Invalid undated former-category claims enter the audit's
diagnostics instead of being silently omitted. Prompt instructions use only the
retrospective category.

## Existing records and recovery

An evidence-preserving plan is saved locally at
`data/people/generated/retrospective-taxonomy-reconciliation-20261006.json`.
The semantic scan found **2,097 affected claims in 217 chapters**, not the 218 files
matched by raw text search (one match was not a claim category).

The plan records each chapter's extraction/candidate hash and exact before/after
rows. It changes only explicit former-category values in `kind`, `action` and
`receptionType`; it does not perform global string replacements, change free-text
descriptions, alter aliases or infer death. It is idempotent. No canonical data,
queue claims, accepted reports or ignored recovery artifacts were overwritten.

The host should reconcile the selected chapters only after their active work
finishes. For each entry, check the current extraction hash and every before-row;
if either changed, regenerate the plan rather than applying stale indexes. Use
`reconcileRetrospectiveExtraction` from
`scripts/lib/people-reception-reconciliation.mjs` to produce the candidate, and
run the production extraction/editorial validators before canonical checkpointing.
Preserve an exact receipt of before/after rows for recovery. Never apply over a
running extraction/date executor or an unreviewed editorial replacement.

Retained date-workflow candidates also need this explicit reconciliation. Preserve
their old generation and negative reports; do not rewrite already reviewed packets
or substitute changed bytes into a retained job ID. Resume with reconciled ownership
and a fresh sealed review plan. Changed extraction hashes make date approval stale:
this migration does **not** certify dates or publish new approval. The host must
reconcile the sticky ledger's fingerprints through its existing recovery procedure,
not release another worker's claim or discard its conversations.

For a fresh preview/plan after inputs change:

```sh
node scripts/reconcile-people-reception.mjs --all
node scripts/reconcile-people-reception.mjs --book jinshu --chapter 025 --out /absolute/new-reconciliation-plan.json
```

The planner refuses to overwrite a prior output. The host has added `--apply`,
which requires `--out` and verifies current extraction hashes and exact changed
rows before canonical writes. Without `--apply`, the command remains a preview.
Historical audit findings/rejected proposals may continue to quote the removed
labels: they are immutable evidence of what was reviewed, not active vocabulary.

125 offline vocabulary/reception/workflow/worker/campaign tests pass, including schema-level
checks for both extraction formats and production rejection of invented labels. No model calls were
made. Commit/push the exact implementation and reviewed data through the host's
normal staging checkpoint, preserving the parallel worker-pool refactor.

## Automatic repair-submission reconciliation

At the common date-workflow repair return boundary, exact erroneous category
labels in proposed after-rows are reconciled before production validation. The
host saves a content-addressed receipt containing the untouched submission,
normalized proposal and exact changed rows. Sealed before-rows, source/extraction
hashes, event prose and evidence remain unchanged. Invented labels other than
the explicitly corrected ones still fail validation. Review reports are untouched;
the resulting candidate still requires fresh independent review before publication.
Retained repair artifacts use the same narrow reconciliation when applied.
This does not migrate unrelated canonical chapters or hot-reload an active runner:
restart the host runner at its safe boundary to load the new implementation.

## CI vocabulary gate

The patch adds `.github/workflows/people-vocabulary.yml` on master PRs, master
pushes and merge groups. It runs vocabulary regression tests and
`node scripts/check-people-vocabulary.mjs` across every canonical extraction,
not just changed files. The gate uses the production schemas and vocabulary
validator for predicates, certainty, mention/disposition labels, historicity,
reception types, family qualifiers and role/polity/reign IDs. Malformed shapes
fail rather than hiding rows. Descriptive event kinds/actions and historical
prose remain open text. Ignored recovery artifacts are not canonical inputs.
There is no grandfathering or automatic correction in CI: invalid labels fail.
The stable check is `People vocabulary`; add it to master's required checks if
merge blocking is desired. A workflow alone does not change branch protection.
