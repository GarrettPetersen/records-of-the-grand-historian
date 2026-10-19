# Jinshu 053 date-review recovery: evidence and scheduling

This is a read-only investigation, not an audit approval. It does not change
the source, extraction, date report, queue, lock, lease, or recovery state.

## Pinned observations

- On 2026-10-19 approximately 03:27 UTC, the staging ref was
  `59f311e4a76e2c702c38033984168b11238f965e`, and the work-queue ref was
  `4aca09929f40d88b55271e75e780d6423d494b2c`. The latter contains neither
  an extraction nor date reservation for `jinshu/053`. These observations
  expire; recheck the live remote ref and all owners before any action.
- The staging `data/people/date-audits/jinshu/053.json` has byte SHA-256
  `d3bb12dbc7db670357affb2e216790baffb359db62ce78478ff3d37c1ba93073`.
  It is `research-blocked`, records source fingerprint
  `sha256:fab0a59c5d375ac889d03e7530b083fed82c11b4521823e1330e8840637b84f1`
  and extraction fingerprint
  `sha256:a23f128f1371dc93275fa0f54af14e3d5952530b3e0e57975ccded564208c3b9`,
  and claims coverage of 209 units, 188 items, and 71 people. No direct
  `date-workflow/jinshu/053` recovery directory was found locally.
- 184 of its item checks repeat one identical generic reason; 70 of its person
  checks repeat another. Independent source checks in
  `research/people/jinshu053-age-five-date-discrepancy-independent-check-20261019.md`,
  `research/people/jinshu053-zang-posthumous-date-independent-check-20261020.md`,
  and `research/people/jinshu053-date-scope-after-letter-simulation-incomplete-20261020.md`
  identify unsupported or unsubstantiated supported checks: the age-five
  interval (`claim-110`), the posthumous honor (`claim-124` and `hints-p068`),
  and the deceased Lady of Yicheng (`claim-180` and `hints-p056`). These findings
  do not establish exact new dates. Keep them as research context, not approved
  checks. The separate later partial report checks 7 of 188 items and 0 of 71
  people on different fingerprints; it too is research, not full coverage.
- The local date lock records PID 32459, which was not running at inspection.
  The queue shows sticky active `jinshu/006` and `jinshu/080` reservations with
  expired executor timestamps, but this observation alone does not establish
  whether remote work is alive or authorize takeover or release. Preserve both.

## Feasibility and safeguards

The existing runner supports two chapter slots and one shared four-job pool.
Review job acceptance requires the sealed job ID and both exact source and
extraction hashes (`scripts/lib/people-date-workflow.mjs`,
`validateDateJobResult`); checks against older hashes cannot be transplanted as
accepted results. A complete fresh, genuinely independent review after source
freeze must inspect all source units,  temporal items and people, use those
research notes as leads, and justify each source date and endpoint. A separate
conversation must independently re-audit any repaired candidate. Only normal
validation, coverage, fingerprint and approval gates can publish it.

The runner filters out proposed editorial repairs. Once all source and
identity-affecting changes are accepted, run a read-only targeted dry run to
measure actual packet sizes and job count, check available lane and its budget,
recheck queue ownership and active executors, and preserve all sticky work. Use
`--concurrency 2 --job-concurrency 4` within one host invocation and the
documented stable worker and packet ceilings. Do not create per-chapter
checkouts. `PEOPLE_DATE_AUDIT.md` describes the full workflow and exceptions.

Important operational constraints: `acquireProcessRunLock` unlinks a lock whose
PID does not exist, so launching the normal non-dry runner now would delete the
retained lock. The current instruction forbids that; no runner was launched.
Additionally, the displayed remote executor token is checked per chapter; the
local process lock is not in itself proof that another host has stopped or a
cross-host publication fence. Verify and reconcile host ownership before a
production run; do not take a lease or release another worker's claim.

The runner automatically seeds repair from a current `research-blocked` or
`needs-revision` report when no workflow state exists. That shortcut would
reuse the report's existing finding set, which misses the independently found
defects above. Conversely, changed source/extraction fingerprints make the old
report stale, in which case fresh review is needed. Before execution, explicitly
confirm the final packet/status and ensure a full independent audit is actually
scheduled; do not silently retain the old 184 generic supported findings as
approved or delete the old report to force a different code path. Preserve it
and any superseding report in the normal history.
