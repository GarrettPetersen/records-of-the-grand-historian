CODE DRAFT ONLY — independent review and idle host adoption required.
Base: bfc1da81b37cf43b3bd8fe3d49192316fc137b6a

Scope: scripts/lib/people-date-worker.mjs, scripts/lib/cursor-run-wait.mjs,
and scripts/test-people-date-worker.mjs.
The verification directory is a small pinned static module/test dependency closure,
not a checkout. Twelve minimal pinned static config/schema contracts (54120 bytes)
were added solely as offline test scaffolding with host authorization. No corpus, production recovery, queue, locks or runtime were copied
or changed. Package resolution uses the host node_modules without copying it.

The worker now inspects its existing expected artifact following only a typed
CursorRunLimitExceededError for the same run and raw-cost/tokens/wall-clock metric.
It preserves the upstream cancellation and ceilings. A failed cancellation,
usage-monitor failure, noncompleted/error terminal evidence, unexpected
transport/fatal error, or account limit stays an error. Account limits nested in cancellation/cause also stop the shared pool.
The original per-run stop metrics/message and final actual usage are checkpointed.
The waiter now carries terminal status/error on limit exceptions rather than
discarding an already-known terminal fatal/account result.
Post-stop Agent-not-found artifact errors cannot enter the replacement branch.
Both fresh and retained-active run paths reuse the same wait/download helper.
Missing, malformed or previously rejected retained artifacts do not send again in
this invocation. Malformed raw bytes are archived before parsing; downstream
report/repair validation, hashes, ownership, reviewer identity, and publication
remain unchanged. A returned artifact is only a parsed/pinned proposal, never a
chapter approval. No paid call or real artifact recovery was performed here.

Coverage: existing worker tests plus mocked fresh/retained recovery for all three
metrics; missing/malformed/rejected artifacts; fatal/transport/account/monitor,
wrong-run, cancellation failure and nested account error exclusions; artifact
transport failures; unchanged caps; immutable raw evidence; no additional sends.
Three tests exercise the actual waiter with injected terminal results/usage to
prove over-budget terminal fatal/account failures stay failures while completed
output can recover. The cancellation event in other added tests represents the
wait helper's completed cancellation. Existing signal-cancellation
worker tests remain part of the full suite.

Reproduce from repository root:
node --test data/people/generated/code-drafts/date-finished-artifact-efficiency-20261025/verification/scripts/test-people-date-worker.mjs
node --test data/people/generated/code-drafts/date-finished-artifact-efficiency-20261025/verification/scripts/test-people-date-workflow.mjs data/people/generated/code-drafts/date-finished-artifact-efficiency-20261025/verification/scripts/test-people-date-ownership.mjs

Limitations: offline mocks cannot prove remote artifact listing consistency or
completeness. An account error still requires ordinary artifact-only recovery on
a later host invocation. Missing/partial reports still require ordinary independent
validation and retained work. No new paid retries or raised limits are introduced.

Verification receipts: worker suite 105 passed; pinned workflow suite 106 passed;
standalone pinned ownership suite 36 passed. Total 247 passed, zero failures.
The initial combined workflow/ownership run had all 36 ownership tests pass but
workflow import failed because static contracts were absent. Its full diagnostic
is preserved in workflow-test-initial-setup-failure.txt; the pinned-contract rerun
passed. The initial patch was rejected in independent review and is preserved as
superseded-initial-review.patch with its reasons/hash in superseded.json.
The second reviewed proposal is preserved as superseded-second-review.patch;
its post-limit nested account cause handling was replaced by a reusable scanner.
