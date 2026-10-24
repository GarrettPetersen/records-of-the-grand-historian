# Date-generation provenance guard: tested draft, not active

This is an incomplete implementation checkpoint against staging revision
`f3d6999a8a909271ed0fe5079395dbbc7858eac5`. The draft is in
`patches/people-date-provenance-hold-20261019-incomplete.patch`. It has not
been applied to the staging runner, the shared checkout, or production.

The earlier Jinshu 128 hazard note described an older runner: this staging
revision already requires `completedDateClaimEvidence` when reconciling a
completed claim at startup. Independent inspection found two other paths:
a completed workflow could return a different currently audited report, and
the post-run outcome could mark a claim ready without checking that the
report belongs to that retained generation. The draft adds checks on both
paths and counts an approval only after the queue update succeeds.

It also holds legacy ID-less or mismatched generations before dispatch, and
holds ready claims whose completed-generation evidence cannot be verified
before archiving or reassignment. This is deliberately fail-closed, but is
**not yet suitable for activation**:

- Existing sticky claims including Jinshu 025, 108 and 128 lack generation
  IDs and need an independently reviewed, ownership-safe migration. This
  draft would hold them, not resume them.
- Legitimately completed claims with subsequently changed source or
  extraction have stale reports and would also be held before re-audit.
  Historical provenance reconciliation needs a separately verified design.
- A crash after a report is recorded but before the workflow state is saved
  can still strand the claim. A durable generation-bound publication intent
  and a reviewed idempotent recovery protocol are needed; a matching report
  alone is insufficient proof.
- A separate report writer could race a filesystem evidence check and queue
  update. Coordinated report-writer exclusion or equivalent compare-and-swap
  semantics still need analysis and tests.

In a small scripts-only snapshot of the stated revision, the draft passed
`node --test scripts/test-people-date-workflow.mjs scripts/test-people-date-ownership.mjs scripts/test-people-date-worker.mjs`
(185/185) and
`node --test scripts/test-people-date-audit.mjs scripts/test-people-reception.mjs`
(23/23). `git apply --reverse --check` confirmed the saved patch describes
the tested snapshot. The tests include separate negative cases for unfinished,
missing, mismatched and stale ready evidence; mocked positive reservation
tests do not establish historical stale-report recovery. Independent review
identified the migration and stale-source limitations above. No user lock,
queue claim, live runner, canonical source, or recovery artifact was changed.
