# Target: 50 published chapters per day

The user set this target on November 15. Count independently completed chapters
released to master and verified on the live site, not extractions, prepared packets,
code tests or queued work. Keep zero-person and nonempty chapters separately visible.
The source of configuration is `campaign-policy.json.completionThroughput`.

Fifty per day means a fleet release rate of one chapter every 28.8 minutes. It does
not mean one agent must finish a chapter in 29 minutes. Feed one persistent owner
the existing chapter work and source context; use one independent reviewer, then
only the actual repair/dependency closure. Follow `PEOPLE_CHAPTER_COMPLETION_RULES.md`.

## Size concurrency from actual productive model time

The first 056 owner used 5,070,673 ms and its repair continuation 2,958,226 ms (actual
Cursor run durations). The first Grok review ran about 17.5 minutes from dispatch to
final tool access. That is approximately 2.52 active remote-agent hours. It excludes
host waiting, code engineering and unfinished final review; ONE large chapter is
not a representative corpus estimate or a completion-rate measurement.

For planning, required simultaneous assignments = target/day × mean productive
agent-hours/chapter ÷ (24 × productive utilization). At 2.52 hours and 70% utilization,
50/day needs about 7.5 assignments. Four would support roughly 27/day, eight 53/day and
twelve 80/day **on model time alone**. Actual throughput is the minimum of model
capacity, accepted quality, lookup/transport capacity and publication capacity.
Included subscription allowances are finite; no sustained daily rate is guaranteed.

Start with the four-assignment measured cohort, then ramp to eight and twelve when
resource guards, transport headroom and useful output support it. Do not keep an
arbitrary one-agent cap after calibration. `people:chapter:campaign` accepts explicit
`--max-active 8` or `--max-active 12` after the coordinator records those measurements.
Use the existing command's required job/model/run options. One campaign/coordinator
owns scheduling; all other live chapter and code-review runs count against the same
budget. Uncertain dispatches reserve capacity. Unknown measurements stop admission.

## Make downstream completion the work queue

1. Finish 056/119/127 and prove a real nonempty release. Do not substitute another
   extraction milestone or repeat 053. The host must finish shared packet/publication
   fixes while existing remote work proceeds, not idle every lane behind code work.
2. Prioritize runnable partial chapters by remaining work, preserving all retained
   work, claims, research evidence and independent proofs. Separate genuine factual
   contradictions from valid unknowns/uncertain identities. No new broad extraction
   wave to keep agents busy.
3. Favor GrokBot for useful work covered by its included allowance; add capable Cursor
   cloud owners/reviewers for throughput. Compare accepted work and repair rounds,
   not just model price. Keep actual independent author/reviewer identities and
   original conversations. No fallback to a new paid API without authorization.
4. Serialize canonical writes and heavy local jobs. Keep chapter evidence/validation
   scoped and reuse immutable indexed dossiers. All workers share the host checkout
   through isolated artifacts; no full repo/corpus/public/dependency copies.
5. Stage each completed chapter promptly. Batch master releases at 30 complete chapters
   or at least twice daily while completions are arriving, rather than launching a
   full site build per worker. The final drain must be released before pausing for
   capacity. Keep required CI, source/identity/date gates and live verification.

## Remove the next capacity limits before filling more slots

The current public person-lookup service has a 1,000-request UTC-day pilot budget.
Fifty chapters with 150 people each would require 7,500 requests even at just one lookup
per person. Host-generated, generation-pinned bounded dossier/primary-context packets
and reused immutable evidence should supply that routine context without one public
API request per person per agent. Keep real indexed retrieval for additional questions.
Do not remove abuse controls or silently raise paid usage. If a measured quota change
is needed, review account-wide limits first and retain an explicit bounded allowance.

## Record a small useful throughput report

At each dispatch/release checkpoint record active assignments by lane, runnable work,
oldest blocked chapter with its exact blocker, model service time and repair rounds,
and completed/staged/live chapters in the last 24 hours. Report utilization and allowance
separately from concurrency. If model output piles up but releases do not, stop fresh
admission and fix the oldest shared host blocker. If a defect repeats twice, diagnose
it once rather than purchasing another unchanged full review. Preserve native loop
breakers. Scale from a measured cohort rate; never label the 50/day target achieved
because the scheduler can start twelve agents.
