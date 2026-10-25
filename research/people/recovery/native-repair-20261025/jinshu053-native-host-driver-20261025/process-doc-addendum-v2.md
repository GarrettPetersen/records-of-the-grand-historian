
### Reusing reviewed source repairs in a retained date generation

The host can reuse a genuinely authored local date-only proposal through the
existing `runDateWorkflow(target, worker, options)` API. Rebase it against current
source/extraction fingerprints, reconcile every current finding from the Chinese
source, retain all actual author/proposal provenance, and run production extraction
and applied-editorial-history validation. A local author's identity must be recorded
honestly; preserve any started SDK conversation and its ownership.

A programmatic host invocation must use the ordinary global process lock, shared
queue CAS, same stable worker/lane/generation and no outstanding executor token or expiry. Retain the
original packet ceilings and shared job pool. Reject changed inputs, any existing executor token or expiry (including expired),
attempts to replace started jobs, and unexpected workflow artifacts. Keep the original
negative reviews, candidates and recovery evidence. Release only the invocation’s
own executor lease; retain sticky claim ownership and all recovery metadata.

For staging-only handoffs, use the existing `saveReviewPlan` hook as the stopping
boundary: persist the independent review plan with ownership checks, then stop before
cached review artifacts can be read. A worker callback that refuses review tasks
alone is insufficient, because cached reports may bypass that callback. Test the
boundary against cached approvals as well as ordinary staging before live use.

Resume the ordinary same-worker runner for a fresh complete independent re-audit
and normal publication/queue completion. Local repair staging does not grant date
approval. English source edits require the documented stale-generation reconciliation
and new current-source evidence; never rewrite old approvals to preserve their hashes.
