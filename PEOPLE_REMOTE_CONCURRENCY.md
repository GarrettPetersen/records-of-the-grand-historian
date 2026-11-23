# Remote completion concurrency

The November 15 user direction favors more Cursor cloud parallelism and useful
GrokBot work from included capacity. The initial one-assignment recovery limit is
superseded by staged remote admission, not by unlimited local concurrency.
Follow `PEOPLE_THROUGHPUT_TARGET.md`: the objective is 50 published chapters/day;
the shared policy defines an initial 4 assignments and measured steps to 8 and 12.

Start with a shared target of four remote assignments across both lanes, for
example two Cursor cloud agents and two GrokBot conversations. This is a target,
not a requirement to fill slots with blocked work. Resume retained runnable chapters
first. Prefer GrokBot when equally suitable; use capable reasoning Cursor owners
and reviewers for additional throughput and difficult work. Do not silently switch
the provider of a retained conversation or buy new paid API capacity.

Adopt the reviewed scheduler change at an idle boundary. The campaign runner now
reads the shared throughput policy and supports `--max-active`; do not run unreviewed
changes or competing launchers. Other launchers must not independently claim four more slots.
Count actual running assignments, uncertain dispatches and existing sticky work
across both lanes; neither a returned chat nor a stale roster flag proves idleness.
Preserve atomic claims, stable actors and independent review provenance.

Each chapter retains one persistent owner and one independent combined reviewer.
Parallelize different chapters and independently owned research/code tasks, never
two writers to the same candidate. Freeze a candidate before its reviewer starts.
Retain unchanged reviewed evidence and apply one consolidated repair batch. Do not
launch a broad extraction wave or repeated full audits to occupy capacity.

Before raising admission, inspect resource pressure, swap trend and relevant
physical footprints as well as RSS. Continue the existing resource checks before
each dispatch and at least every 60 seconds while observing work. Stop new admission
on failed or unknown measurements; preserve live remote work and recovery. The
November 15 calibration completed owner, independent-review and owner-repair runs
with normal pressure and stable/decreasing swap. This supports a measured increase,
not a guarantee that every larger configuration is safe.

For Cursor Cloud campaigns that coordinate entirely through GitHub, run
`npm run people:disk:check -- --cursor-cloud-github-only` on that same cadence.
This mode allows the light GitHub and Cursor API coordination calls below the
30 GiB local disk floor. Keep all claims, artifact handling, code writes, validation
and builds remote. Use the default guard for dispatches that rely on Mac-side
packets, artifact downloads, local MCP services or other local job execution.
Record the mode and measured resources in the campaign journal before resuming.

Keep one host canonical publication/compilation/heavy build at a time. All workers
use sealed inputs, scoped tools and isolated artifacts in the same shared checkout.
Never copy the repository, corpus, public assets or dependencies, or create a
checkout merely to run a chapter/reviewer. Cloud workers do not mutate host Git.

After a four-assignment cohort shows stable host resources, bounded MCP response
times, lookup quota headroom and useful validated output, the coordinator may raise
the shared target to eight, then twelve. Record the measurements first. Stop scaling if the
publication queue grows without releases or repeated review defects dominate.
Measure released nonempty chapters and cost per accepted chapter, not busy agents.

Cloudflare queue source is not yet the production claim authority. Until an explicit
verified cutover retires old writers, use the existing native Git ledger. Two claim
authorities or multiple independent schedulers do not provide safe parallelism.
