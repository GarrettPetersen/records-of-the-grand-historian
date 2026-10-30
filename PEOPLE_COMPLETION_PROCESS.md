# Completion-first people glossary process

This is the current orchestration policy.

**October 30, 2026 user-authorized process revision:** chapter completion uses
bounded canonical-person dossier reviews, not exhaustive O(k²) same-name pair
comparisons. This explicitly supersedes the old zero-touching-pairs completion
condition. Adoption still requires integrated code, independent review, passing
CI and a real nonempty live chapter receipt; this text alone grants no approval. It supersedes extraction-volume targets,
old deadline wave recipes, and waiting for 25–50 new extractions before identity work.
Existing source, editorial, chronology, identity and publication gates remain intact.
A planning checkpoint grants no approval.

## First prove a real delivery

Continue the existing owner/work for Jinshu 053 as the first nonempty pilot. If held,
record the precise obstacle and choose the next already-extracted Jinshu chapter with
the smallest total downstream workload. Do not choose an empty extraction to satisfy
this milestone, or re-extract to avoid a downstream gate. No new broad extraction
wave until a nonempty chapter is verified live. Drain/recover existing claims rather
than abandoning them. Use one shared checkout and isolated artifact paths; this policy
does not authorize a second executor or taking over an active chapter.


## Repair English omissions when found

A definite English omission or mistranslation requires a concrete complete replacement,
not only a flag or an outside-scope note. Check both English fields and repeated uses.
Supply supplemental repairs in an artifact with book, chapter, unit ID, field, exact
before/after text and source-based reason; keep them separate from closed-schema date
or identity reports. The host routes these into the active editorial application work,
with a separate reviewer for worker-authored repairs. Preserve independent review and
normal extraction, chronology, identity, CI and publication gates. Do not defer known
fixable English to a future corpus-wide pass. An empty proposal queue alone does not
prove every source proposition has been translated.

## Bounded chapter work order

1. Finish source/editorial corrections first: paired translations, repeated names and
   transcription. Run current extraction/editorial gates. Repair the existing extraction;
   re-extract only for a demonstrated defect that requires it.
2. Obtain current independent date approval. Genuinely undated facts stay undated;
   actual ambiguity stays on research hold. Follow the date loop breaker, not repeated
   whole-chapter reviews of unchanged candidates.
3. Pin the actual source, extraction, editorial history and date-report bytes. Record
   a small work order under `data/people/generated/completion/BOOK/NNN/`, not a checkout.
   Keep the original evidence in place; a fingerprint is not permission to rewrite it.
4. Reuse the current immutable canonical-person dossier registry. Build/update it
   once from validated source records and accepted membership decisions, never once
   per review packet. One logical dossier represents one accepted canonical person;
   chapter records remain its cited provenance. Historical merge, separation and
   reviewed-ambiguity decisions remain valid constraints, not a new all-pairs queue.
5. Prepare one case per canonical person occurring in this chapter, covering every
   chapter-local record exactly once. Retrieve at most eight other dossiers per
   case through the name/alias index, with at most sixteen keys and eight posting
   reads per key. Record full posting counts/fingerprints, every omitted key and
   every overflow. Retrieval limits are admission limits, never proof of uniqueness
   or permission to discard a plausible match. No complete same-name pair graph,
   connected-component completion, or recursive external-chapter completion.
6. Independently review each case's source-backed retained identity assignment and
   exact cited Chinese evidence. The reviewer must confirm that the record denotes
   an actual individual, its chapter mentions belong to that record, and the accepted
   canonical membership is supported. An unresolved cross-chapter equivalence may
   finish as explicit reviewed uncertainty while records remain separate. It must
   not create a confident separation, a guessed match, or a new merge. A suspected
   false existing merge, unsupported chapter-person attribution, or conflicting
   primary evidence remains a concrete case hold. New merges still use the existing
   independently reviewed resolution-application gates.
7. Once every chapter-local person has current independent case coverage and no
   concrete case hold, run actual scoped website qualification/projection. A legacy
   same-name candidate count is not the chapter's release gate. Publication must
   preserve reviewed cross-chapter uncertainty visibly and reconstruct facts only
   from qualified source members. Source/extraction/editorial/date, unsupported
   family-target, source-fidelity, quote/artifact, CI and live-content gates remain.
   Do not use preview flags or change stale approval hashes to obtain a green result.

Freezing inputs means no speculative cleanup during downstream review, not ignoring
factual errors. Independently review genuine corrections, preserve the old generation,
reconcile affected work, and obtain fresh affected approvals. Do not change hashes to
keep approvals. Keep unrelated extraction changes out of the pilot acceptance release.

## Historical pair checkpoints and spending stops

The following retained command compares historical pair-frontier receipts. It is
diagnostic recovery tooling; its pair count is no longer a release gate or a model
worklist. New dossier checkpoints report person cases, approved/held cases, reviewed
uncertainty, source input pins, reviewer receipts and publication evidence.

Compare two historical compact checkpoints with:

```sh
npm run people:completion:check -- --baseline /absolute/baseline.json --current /absolute/current.json
```

Each JSON contains `scope: {book, chapter}`, chapter-local extracted `personCount`, `inputs` containing
SHA-256 byte digests for `source`, `extraction`, `editorial`, `dateAudit`, and
`unresolvedPairs`, an array of distinct two-element canonical-ID pairs. Derive pairs
from the current validated graph, not model estimates/raw block counts. Record graph
revision/generation and accepted decision receipts beside each checkpoint. Hash file
bytes, not paths. Do not substitute checkpoints for sealed evidence.

The command is read-only and diagnostic: it does not validate decisions, graph
freshness, date reports or publication. Input/people-count drift or added pair IDs
returns `replan-required` and nonzero exit. Zero pairs means `ready-for-release-checks`,
never `complete`. Zero-person checkpoints return `empty-scope` with nonzero exit;
they cannot satisfy the nonempty pilot. Malformed
checkpoints fail loudly. Preserve sequential checkpoints to expose reversals.

Date work permits at most three automatic repair/re-audit rounds and stops earlier
for repeated candidates or two non-improving rounds (`PEOPLE_DATE_AUDIT.md`). For
identity work, repeated unchanged case/evidence fingerprints require diagnosis
before another model turn. Reuse unchanged independent case proofs; reconcile
source edits and accepted membership changes explicitly. Do not
delete state, release sticky work, raise limits or change worker IDs to bypass a hold.
Continue another bounded chapter if useful work cannot proceed. A hold is neither a
completion nor a campaign-wide stop.

## What counts as done

Report these separately:

- Extracted/repaired: intermediate work, not glossary completion.
- Data-qualified nonempty chapter: current source/editorial/date/identity gates pass.
- Verified zero-person chapter: reviewed extraction contains no people; no pages
  expected. This does not prove the nonempty pipeline. Genre alone does not prove
  absence of people: check source review and candidate coverage.
- Published nonempty chapter: qualified output merged/deployed, generated person
  pages, both-language chapter links, inverse snippets, search and sitemap targets
  pass site verifiers and live HTTP/content checks for that deployment.

The first acceptance receipt must identify the chapter, nonzero published people,
exact source/approval/identity inputs, merged revision, successful deployment,
generated verification results and live checked person/chapter/search/sitemap URLs.
Check multiple mentions, shared names and inverse links; a 200 fallback page does
not pass. Check slug redirects where applicable. Changed inputs invalidate a stale
receipt. Synthetic fixtures are regression tests, not this production receipt.

Do not report published completion from claims, unit tests, PRs, audit approval,
build success alone or an empty extraction. Do not wait for 30 other chapters before
releasing the first nonempty acceptance slice: this is an exception to batch-size
targets, not to CI/master rules. Use exact reviewed changes and the normal PR path.

## Scale only the demonstrated path

### Crash-recovery operating profile (October 26, 2026)

The last crash was preceded by measured Codex backend allocations of about 79 GiB
and roughly 55 GiB swapped out; free disk subsequently fell below 1 GiB. A local
graph pass peaked around 2.4 GiB of JavaScript heap. These observations identify a
backend memory problem as a major contributor; they do not establish its software
cause. Do not assume free disk, cloud inference, compaction or simply reopening the
same long chat fixes it.

Use this conservative profile until successful small runs justify changes:

This host-safety profile overrides historical lane-filling and concurrency targets.
Let already-running assignments drain; retained or ready claims are not permission
to launch more work and must not be released merely to reduce concurrency.

- Use a fresh coordination chat with only a compact work-order handoff and exact
  evidence/receipt paths. Do not fork this campaign's accumulated history. End at
  the first bounded batch checkpoint or 60 minutes, whichever comes first; preserve
  a handoff before rotating. This is a session boundary, not permission to discard
  work, abandon sticky conversations or weaken any acceptance gate.
- Do not resume an unbounded automatic goal loop in the old chat. This crash-policy
  repair is the final task here; glossary production resumes from the saved handoff
  in a fresh chat. Do not create a recurring automation as a workaround.
- Initially use no parallel native Codex subagents. Independent author/reviewer
  conversations remain separate but run sequentially, with bounded sealed evidence
  rather than inherited full campaign history. Start with one cloud assignment.
  Consider two only after two completed assignments and their host acceptance checks
  show stable resources. This does not authorize more spend or new extraction.
- Run only one local heavy job at a time. Do not overlap full graph compilation,
  site/ebook builds, Git packing, or large packet construction. Use a 3 GiB Node
  old-space ceiling for newly launched heavy Node jobs; this limits JavaScript heap,
  not native buffers or total RSS. If it fails, preserve the partial run and change
  the batching/streaming approach rather than repeatedly raising the ceiling.
- Run `npm run people:disk:check` before each new dispatch/heavy job, after a job,
  and at least every 60 seconds while observing active work. On macOS it checks disk,
  system swap, Codex backend resident memory and OS memory pressure. Keep 30 GiB
  free; warn at 4 GiB swap and inspect consumers and growth before increasing
  concurrency. Stop new work at 8 GiB swap, 4 GiB combined Codex backend RSS, or warning/
  critical memory pressure. Unknown/failed measurements fail closed. Other platforms
  explicitly report this macOS memory check as not applicable, not as verified safe.
- These are admission checks, not a continuous watchdog or an application memory
  limit. On a breach, stop new dispatches, checkpoint compact state and end the
  coordination turn. Preserve current job IDs and verify actual remote/process
  state before resuming. Never auto-kill the user's Codex/browser, delete swap,
  clear history, remove locks or discard recovery. If growth continues, ask the user
  to quit the app; a repository script cannot safely repair its allocator.
- Bound tool output: normally return at most 1,000 tokens, at most 4,000 for a
  necessary code review. Save large logs/results to their existing job artifacts;
  return counts, hashes and paths. Project search/connector responses before printing
  them. Never dump a corpus, entire API response, huge diff, or long conversation.
- Recover known cloud agents by stable ID. Scan historical agents only for an
  actual missing-ID recovery, not every poll or fresh assignment. Save agent/run IDs,
  usage and output paths as soon as available. Reuse sealed graph/results on unchanged
  inputs; refresh once per reviewed data/semantic change, not per polling turn.

Do not claim this repairs a Codex backend leak or guarantees crash prevention.
It limits exposure and stops new work well before the previously observed failure.
Keep the existing shared date-audit pool, worker IDs, packet ceilings, validation,
review independence and publication gates; do not introduce competing executors.

After the first live receipt, use a bounded WIP cohort (initially at most three
chapters), prioritizing Jinshu and ranking total remaining completion work. Spend
lanes on disjoint downstream packets, not competing host executors. Size later waves
from accepted published-chapter cost/time and failure rates, not tokens consumed or
extraction throughput. Leave capacity unused rather than repeat an unchanged hold.

Ship qualified cohorts incrementally. At book completion, generate/verify the
certified ebook glossary against the authoritative full book/volume manifest.
One published chapter does not make the whole Jinshu ebook release-ready.

## Adoption by the running orchestrator

Let active invocations drain. Preserve locks, leases, conversations and sealed inputs.
At an idle boundary adopt reviewed code/policy, record the existing pilot owner, and
initialize its work order from latest accepted inputs/current graph. Do not reset
Jinshu 053 or repeat passed checks on unchanged inputs merely to adopt this policy.
Reuse gate fixes already on master instead of rebuilding them from an older host
checkout. Documenting policy is not proof the running orchestrator adopted it: report
adoption, data qualification and live publication separately.
