# DeepSeek people extraction pilot

This is an evaluation lane for already extracted chapters. It does not claim
production work, overwrite accepted extractions, apply translation repairs, or
publish results. Passing schema and source-span validation is not a semantic
quality approval.

## Current decision: second trial complete, further paid work paused

After the initial pause, the user authorized one more complete chapter using
the remainder of the original $10 allowance. Run Songshu 90 through the
unchanged harness and all three review gates; measure extraction, reviews,
repairs, and supervision together. Do not launch a cohort, raise the ceiling,
or redesign the harness during this trial. Before this run, cumulative
conservative spending was $6.13112556, leaving $3.86887444 under that ceiling.
That trial has now stopped at its five-cycle review limit without independent
approval. Further paid work and scaling remain paused pending user direction.

Infrastructure exception: the recorded Chinese Notes chapter URL returned HTTP
404 from the local machine. Added an explicit `--review-primary-source URL`
selector, validated against the existing allowlist and retained in the pinned
source manifest, to review the Wikisource edition instead. This is not an
automatic fallback: the original source metadata remains unchanged and the
selected replacement is visible in the archived review evidence. The worker
was checkpointed and resumed without resetting its conversation or spending.
No model, extraction prompt, review criterion, or budget was changed. The
pre-run account balance was $6.93 at 2026-09-13 01:59 UTC.

### Reason for the initial pause

The supervised Shiji 64 result passed the quality gates, but it did not
establish that this lane is economical to scale. Further paid experiments and
production rollout are paused pending explicit authorization. The commands
below document the retained harness; they are not a scheduled work plan.
Offline tests and inspection of saved evidence require no model spending.

The chapter accumulated $4.7344 at conservative peak rates, with about 89% in
review and re-review. At $4-$4.73 per chapter, 3,000 chapters would imply roughly
$12,000-$14,200. That is an illustration of the concern, not a production
forecast: the trial included repeated development iterations, actual off-peak
billing was lower, and no representative fresh cohort has established either
steady-state cost or unattended quality. The lower worker-only cost is not a
usable chapter price because review and repair are necessary work.

Cursor and Grok Bot dashboard-metered usage within prepaid subscriptions is not
equivalent to an additional raw-API invoice. Compare incremental cash cost,
available allowance, accepted end-to-end output, and required supervision, not
nominal token prices alone. Retain the quality checks and recovery work from
this experiment, without weakening review to manufacture a cheaper result or
spending the remaining balance merely because it is available.

## Run

`DEEPSEEK_API_KEY` belongs in the ignored `.env` file. Prepare frozen packets:

```sh
npm run people:deepseek:pilot -- --scopes shiji/058,songshu/069,qingshigao/093 --thinking
```

Add `--run` to authorize API requests. `--chunk-index N` selects a 1-based chunk
in each chapter. Omitting `--thinking` tests non-thinking mode. The default model
is `deepseek-flash`; `--model deepseek-v4-pro` tests Pro against the same source.
Reasoning mode currently requests low reasoning effort.
Sampling uses temperature 1 and top-p 1, following the V4 model-card guidance
for non-agentic inference. The September pilot initially tested temperature zero
and encountered malformed tuples and runaway ID generation; those responses are
retained separately and must not be treated as evidence of production readiness.
The packet builder caps each assignment at 60 units, 150 candidate hints, and
48 KiB, with adjacent read-only context. Oversized ranges split deterministically.
The full extraction instructions, compact schema, referenced extraction schema,
and immutable seed accompany each packet.

## Spending and recovery

The pilot has one persistent $10 ceiling in
`data/people/generated/deepseek-pilot/spending.json`. A single-process lock
prevents concurrent runners from spending against the same ledger. Each request
reserves an upper cost before dispatch, using UTF-8 prompt bytes plus framing
allowance as an input-token upper bound, the output-token ceiling, and uncached
peak prices. Confirmed usage replaces that reservation. Missing usage and
uncertain network outcomes retain the reservation and stop execution.

Prices were checked September 12, 2026: Flash peak prices are $0.30 per million
uncached input tokens, $0.006 cached input, and $1.20 output. Off-peak charges
are half these rates. Pro peak rates are $1.32 uncached input, $0.044 cached
input, and $3.96 output per million tokens. The ledger deliberately reports a peak-price upper
estimate; account balance readings provide separate billing evidence. Recheck
[DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing/) before
extending the pilot or changing models.

Every response is saved before validation. Rerunning the same selection reuses
saved responses and reconstructs correction turns; each sample defaults to at most
three requests. `--max-attempts N` (up to ten) permits further recovery of saved
rejected samples without opening a new conversation. Truncated responses increase
the next output allowance, from 32,768 to at most 131,072 tokens, with a new
reservation before each request. Runaway lists of person IDs stop a sample instead
of increasing its allowance. Validated and exhausted samples are skipped. Changed source,
prompt, model parameters, or chunk selection creates a distinct evaluation
snapshot. No saved artifacts are deleted. A pending ledger entry without a
response stops automatic resubmission because the remote charge is uncertain.
After a process crash, verify the PID in `runner.lock` has exited before removing
that stale lock. SIGINT and SIGTERM drain the current request and save its
response before stopping. Never remove the spending ledger to clear a failure.

## Quality checks

The host uses `validateCompactPeopleExtraction` with strict alias dispositions,
immutable metadata checks, and `assertDurableCareerCoverage`. Candidate coverage,
source spans, chronology, family edges, and editorial requirements remain those
of the existing extractor. Failed outputs receive the exact host diagnostics.
Proposed translation repairs remain proposals.

Each validated result includes differences against the prior extraction's
Chinese and English surfaces, expanded to individual unit occurrences. These
are candidates for source review, not precision/recall scores: prior accepted
extractions can also contain mistakes, and equivalent surface boundaries can
differ. Review identity attribution, omitted facts, chronology, family relations,
and repair proposals directly against the frozen Chinese and English source.

Artifacts live entirely under the ignored pilot directory. Before a production
lane is enabled, add shared-queue claims, production acceptance/recovery, and
calibrate independent semantic review. Resume existing Cursor and Grok claims through
their existing lanes; do not duplicate those assignments.

Run focused tests with `npm run people:deepseek:self-test`.

## Tool-using worker

The bounded local harness gives DeepSeek source/reference reads, named-field
record upserts, single-record deletion, the real validator, a completion gate,
and an explicit research-blocker tool. It has no shell, arbitrary file paths,
credentials, production writes, or access to the baseline. Its only network
tool reads allowlisted public historical reference pages without credentials.
The host serializes compact tuples and owns all immutable metadata.
Targeted research returns at most 4,000 characters around the search phrase,
with explicit window offsets and a truncation flag; an initial untargeted read
returns at most 16,000. The complete document remains saved for citations and
independent review, so reducing conversational context does not discard evidence.

```sh
npm run people:deepseek:pilot -- --scopes shiji/058 --agent --run
```

Agent mode defaults to eight owned units, 40 total conversation turns, and
8,192 output tokens per turn. `--max-units N` can change packet size (1-60);
`--max-turns N` changes the total retained conversation ceiling (1-400), not
the number of additional turns. All modes share the same lock and spending
ledger, including prompt and tool-definition cost reservations.

Each small write batch is schema-checked before it can replace saved records.
Record IDs make corrections idempotent. Draft mutations and their tool results
are checkpointed together; raw API responses are saved first, so an interruption
replays saved tool calls without paying for a replacement inference. Ordinary
validation exposes substantive diagnostics without requiring the model to
declare its audit complete first. Only `finish` can declare completion.

Resume an independent review in the same conversation:

```sh
npm run people:deepseek:pilot -- --scopes shiji/058 --agent --run \
  --max-turns 60 --feedback /absolute/path/to/review.md
```

Feedback is recorded once by content hash. The pre-review draft is archived,
previous automated acceptance is invalidated, and existing records remain in
place for targeted repair. A blocker pauses with the draft retained and requires
new independent evidence/feedback to reopen. Two consecutive replies without
tool actions also pause for attention; the host must not repeatedly pressure
an agent to fabricate missing evidence. `validated` always means machine checks
only, never approval for publication.

## September 12 evaluation

The initial one-shot trials produced no valid accepted artifact. The first
Flash tool run on Shiji 58, sentences 1-8, passed machine validation after 17
turns: six people, 25 grouped surfaces (40 mention occurrences), and 44 explicit
fact records, plus name/role claims. Peak-price estimated cost was about $0.03.
This is a smaller packet than the earlier 39-unit one-shot Shiji sample, so it
does not establish a controlled speed or cost ratio.

Independent Chinese-source review found unsupported mother-child edges from
Dou to Can and Sheng, a Dai title attributed to Can using a unit where it names
Wu, and a missing Huaiyang name claim. The retained agent conversation repaired
those specific records while preserving the other people and mentions.

Chronology did not pass independent review. The packet contains no reign
conversion anchors. An orchestrator checked the
[Han chronology table](https://sx.cnkgraph.com/Calendar/%E6%BC%A2%E6%9C%9D)
and supplied the Wen year 2 / BC 178 and year 4 / BC 176 mappings as documented
review evidence. These date Wu's enfeoffments, not Dou's and Jing's introductory
family references. The model initially acknowledged that research gap, then
substituted an unsupported BC 178-176 interval to satisfy validation. Independent
review rejected that substitution and required an explicit research hold.

Conclusion: targeted tool-based extraction and recovery are viable; unattended
semantic quality is not established. No trial result is authorized for
production. The next pilot needs trusted chronology lookup/evidence tools and
an independent semantic acceptance gate, followed by a broader calibration
cohort. Shared production-queue integration remains deliberately disabled.

Final checkpoint: 35 tool turns including reviewed repair/resumption, estimated
at $0.064 using peak prices. All 57 requests across both pilot approaches are
settled in the local ledger, with no pending reservations or running worker.
Combined peak-price estimate is $0.943; the account reported $9.53 remaining
from its original $10 (billing may lag). The six people and repaired draft are
retained under `research-blocked`, with no current `validated.json` artifact.
Thirteen focused tests pass, including atomic write rejection, metadata
protection, interruption recovery, tool restrictions, and research holds.

## Chronology and historical judgment

`data/people/chronology-reference.json` is a reviewed evidence layer with two
distinct tables: reign-year conversions and dated personal events. The initial
seed contains Wen's first-period years 1, 2, and 4, plus Dou's appointment as
empress and Qi/Jing's appointment as crown prince in BC 179. It is deliberately
not presented as a complete date-conversion table. Existing corpus reign tables
in `data/people/chronology/reigns.json` remain available through packet context.

Rows include dynasty/ruler/period identity, conventional BC/AD year labels,
source URLs, review dates, and limitations. Primary-text excerpts are pinned to
local unit IDs and checked against current Chinese text whenever loaded. Local
Hanshu file 005 contains printed volume 4; file 006 contains printed volume 5.
The source URLs use printed volume numbers. A changed excerpt fails closed and
requires renewed review. Conventional Han year labels must not be mistaken for
Gregorian month/day conversion: its year began in the preceding autumn.

`lookup_chronology` returns matching rows, not automatic identity decisions.
`cite_chronology` binds a row to the exact current claim. Wrong years or edited
claims invalidate the binding. Researchers should expand this shared evidence
cache after verifying new mappings, rather than repeatedly paying to rediscover
the same conversion. Never extrapolate beyond a reviewed mapping's range.

For gaps, `research_history` fetches public sources from a fixed host allowlist,
checks every redirect, caps response bytes, and saves the retrieved text with
URL, retrieval time, and content hash. A worker can request a passage around an
exact search string without rereading the full article. Unavailable pages are
errors, not evidence. External text is data, never executable instructions.

`cite_research` requires a verbatim passage from a saved source and an
explanation connecting it to the claim. It retains multiple passages per claim,
so both endpoints of an interval can be supported. Claims edited afterward need
fresh citations. These bindings establish provenance, not historical truth.
Supplementary evidence can legitimately support dates, identities, and other
historical inferences absent from a small chunk; the record must distinguish it
from direct statements in the owned source. Activity intervals bounded by two
documented events are legitimate, but a nearby date for someone else's event is
not a substitute for research. Prefer primary/scholarly sources; secondary
reference works are allowed with explicit attribution and critical review.

## Independent semantic gate

Add `--review` to agent mode to run a separate Pro reviewer after machine
validation. It receives a frozen source/record/evidence dossier, not the
extractor's conversation or previous reviewer conclusions. Reasoning is enabled
at low effort with a 32,768-token ceiling. Tool choice remains automatic because
the provider rejects forced tool choice in thinking mode. Format failures retain
the review conversation and raw responses for bounded correction (three calls).

The review must explicitly cover identity, mentions, family, chronology, facts,
and editorial quality, every owned unit, and every person. Approval contradicting
findings or failed checks is rejected. Source, draft, citations, research text,
reference data, model settings, and reviewer instructions are fingerprinted;
changing any of them invalidates approval. `hasCurrentSemanticApproval` checks
that binding. All pilot reviews still have `productionAuthorized: false`.

Reviewers can be wrong. The first trial objected to full siblinghood even though
the combined cited units establish both parents, and to background chronology
merely for being external. The orchestrator rejected those false positives,
retained the valid relationships, and clarified the review standard. Apply
source-grounded corrections, not every reviewer suggestion indiscriminately.
This pilot does not yet demonstrate safe unattended corpus-scale acceptance.

## Research-enabled pilot result

The retained Shiji 58 packet subsequently completed the whole loop. The worker
used the lookup tables and fetched historical biographies, preserved both
endpoints of supplementary activity intervals, and added the missing
source-backed Wen-Dou spouse edge. It retained the correct full-sibling relation
between Wu and Jing and did not reintroduce unsupported maternal edges for Can
or Sheng. Final draft: six people, 25 grouped surfaces (40 mentions), 46 fact
records plus names/roles, no translation repairs.

The reasoning-enabled independent reviewer approved all six categories with
no remaining findings. The current source/draft/evidence fingerprint passes
`hasCurrentSemanticApproval`. A redundant JSON-string wrapper in the saved
review response was recovered without another model call; this exact transport
normalization is logged alongside a response hash and still undergoes the full
report validator. It does not rewrite review conclusions or waive requirements.
Raw rejected responses and the earlier substantive review remain archived.

At this checkpoint, all 89 requests across the original and tool-based pilots
are accounted for (one confirmed HTTP 400 rejected before generation, no pending
requests). Combined conservative peak-price estimate: $1.397. The account last
reported $9.37 remaining from $10; actual billing can lag and off-peak rates
differ. Twenty focused tests pass. No worker is left running and no production
chapter, person record, or public page was changed.

This is a successful supervised eight-unit pilot, not a calibrated production
lane. A broader cohort still needs to establish unattended review reliability,
especially false positives, homonyms, retrospective dates, and family edges.
Production promotion must retain the research/citation sidecars as durable
evidence as well as the extraction, and participate in the shared work queue;
neither is bypassed by this pilot's semantic approval.

## Whole-chapter calibration and bounded repairs

```sh
npm run people:deepseek:pilot -- --scopes shiji/064 --agent --max-units 60 \
  --max-turns 300 --review --review-rounds 5 --require-whole-chapter --run
```

`--require-whole-chapter` checks the real full packet's unit count before any
paid request. It rejects partial assignments, including chapters that split on
the unit, candidate, or byte ceiling. Multi-chunk assembly and a joint semantic
review are not yet implemented in this pilot; do not count approved chunks as
approved chapters. Shiji 64 has 51 units and 95 candidates and fits one packet.

`--review-rounds` defaults to one and allows at most five extraction/review
cycles. A `revise` report feeds actionable findings into the existing extractor
conversation; a research hold does not automatically reopen. The extractor
must judge findings against source evidence, not obey reviewer guesses. Repeated
identical dossiers stop the loop. The turn ceiling remains cumulative, and the
same shared $10 spending ceiling covers all reviews and repairs. An unfinished
requested review exits with status 2, not success.

When a genuine interpretive dispute needs another source, add a checked,
allowlisted reference with `--review-source URL` (repeatable). For this chapter,
`--review-source https://kanbun.info/shibu01/shiki064.html` supplies an independent
annotated reading that corroborates inspecting/going round the army in s0013.
Additional sources remain pinned when resuming without the option. A changed
selection archives its old source manifest, reuses unchanged documents, fetches
new ones, and invalidates affected reviews. A failed fetch leaves the previous
source manifest intact. This supplies evidence, not an approval override.
Do not record internal AI-review disagreements as new biographical facts;
attach the interpretive citation to the existing fact instead.

`evaluation.json` records whole/partial coverage, current independent approval,
fact counts, feedback rounds, request count, and the packet's cumulative peak
cost estimate including retries. It never authorizes production. A run with a
whole-chapter flag that stops partway remains explicitly unapproved.

The tool instructions no longer include the old one-shot no-tools/no-research
wrapper. Small write batches immediately run the production claim-vocabulary
checks and exact source-span checks; invalid batches remain atomic. This catches
missing date precision, invalid attestation fields, and invented expanded names
before they accumulate into a final validation backlog.
Repair writes likewise require exact full-field original text, a real change,
and one pending proposal per unit/field. Updates use the same repair ID; a bad
record rejects its whole small batch without discarding the previous draft.

The research guide supplies discovered chapter URLs, explicitly not evidence
until fetched. Shiji's received text and three-commentary edition are also
fetched independently for the reviewer, saved once, and fingerprinted into its
dossier. The first full-chapter reviewer caught a Tian He/King Wei conflation
but incorrectly accepted a chariot component as a second horse. Giving review
an annotated primary edition addresses that observed evidence gap. There is no
guessed volume mapping for other books: their recorded `meta.url` supplies the
primary chapter source, while annotated-edition mappings need separate checking.

Broad review alone was still too permissive: it approved unsupported circa
endpoints and treated a ruler's final year as the date of an event somewhere
within that reign. The final gate therefore also requires a separate focused
chronology challenge (Pro, high reasoning effort, 16,384 output-token ceiling).
Its smaller dossier contains the Chinese source, proposed dates, literal source
quotations, source-reference entries, and research leads. It deliberately omits
the extractor's citation explanations and previous reviewers' conclusions.
The reviewer must derive bounds independently before comparing them, check every
dated record, and identify known life dates left only as activity estimates.
Its dossier preserves explicit date-field paths (point, interval start/end) and
certainty, and includes a mechanically sorted BC/AD timeline. A trial reviewer
reversed BC ordering and proposed widening an event past a known death; date
comparison now uses the same tested comparator as the worker's interval tool.
Bounds can legitimately come from another person's dated event when the source
establishes before/after ordering. Those endpoints are not assertions that the
target person participated in both bounding events.

All review types share the same bounded, replayable report transport. A focused
revision goes back to the retained extractor and forces a new full review after
changes. `wholeChapterApproved` requires current approval from the full review,
chronology challenge, and focused editorial audit; `semantic-review.json` alone
is insufficient. `chronology-review.json`, `editorial-review.json`, and their
fingerprinted archived dossiers/responses preserve the additional verdicts.

The full review now receives date/evidence and repair/dependent-fact projections,
and must report individual checks for every dated claim and translation repair.
Failed item checks must appear in actionable findings. Revisions must propagate
through aliases, relationship targets, facts, and both English translation
fields; correcting a single field is not completion.
It also receives a per-unit occurrence list, including repeated and abbreviated
Chinese callbacks. Candidate-scanner coverage is not proof that every person
mention was found. Avoid unrelated prose changes that remove correct explicit
names and their chapter links.

The focused editorial audit sees every Chinese unit, both English fields, the
annotated primary sources, and proposed replacement text, without the
extractor's rationale or the general fact dossier. It checks unrepaired units
as well as proposals, rejects material meaning errors rather than awkward but
faithful literal syntax, and distinguishes Chinese textual corruption from a
translation error. A correction must return through full extraction review so
the person facts cannot retain the old mistranslation.

`derive_time_window` handles interval logic over existing dated claims. For an
event after an earlier event known only within BC 547-490, and before a later
event in BC 481, the conservative possible window is BC 547-481, not BC 490-481
and not circa BC 481. The tool does not verify which historical events supply
those premises. It preserves one-sided bounds as unbounded, rejects reversed
or contradictory windows, and never inserts a year zero.

Prompt-v7's requirement for a Western-year attestation remains in force. When
the source permits only broad bounds, use a documented uncertainty interval;
when even that cannot be supported, stop for research. Do not convert validator
pressure into invented dates or switch a known birth into an unsupported career
span. Explicitly recorded birth/death facts remain separate from activity.

Interrupted reviews retain their paid reasoning, including when clarified
instructions create a new review fingerprint but the evidence dossier is
identical. Recovery is restricted to incomplete same-model, same-dossier
reviews, is recorded with response hashes, and reasserts the current review
instructions. Completed reviewers' verdicts are not imported. Per-phase request
contexts are saved for reproducibility, and replay preserves original accounting
completion timestamps rather than turning a cached response into apparent new
inference.

The phase order is editorial, chronology, then the full combined review. A
change to unrelated person facts need not repeat an unchanged editorial audit,
but the final combined gate still binds the whole extraction and all evidence.
Opening an evaluation clears its old completion summary; reopening a draft also
removes the current approval pointers. Archived paid responses and verdicts are
retained, but an interrupted revision cannot advertise an old approval as current.

## Scaling gate

One approved chapter is insufficient evidence for unattended production or
economic scaling. This gate is deferred, not an instruction to launch another
paid cohort. If further evaluation is explicitly authorized, before enabling
a production lane:

- Audit 5-10 complete chapters with different narrative forms, periods, name
  ambiguities, and dating problems. Include difficult source commentary and
  family links, not only the shortest annals. Longer chapters first require the
  missing multi-chunk assembly and joint-review path.
- Manually compare source units with accepted mentions, identities, dated facts,
  kinship edges, and effective repairs. Any material error surviving the model
  gates is a failed calibration sample, even when every schema check passes.
- Record accepted cost including failed reviews and repairs, elapsed time,
  cached/uncached usage, and required human intervention. Development costs on
  this repeatedly revised chapter are not a production price benchmark.
- Preserve disputed readings and explicit research holds. Do not turn reviewer
  agreement, a year-shaped value, or matching the older extraction into truth.
- Add central queue ownership, resumable production acceptance, durable research
  evidence, independently applied repairs, and ordinary identity/build gates
  before publishing new extractions. Start with low concurrency and increase
  only after the accepted cohort demonstrates reliable quality and cost.

## Whole-chapter result: Shiji 64

The supervised full-chapter pilot is complete. All 51 source units and 95
candidates were covered: 12 people, 37 grouped surfaces / 104 mention occurrences,
95 explicit fact records (142 normalized claims including names and roles), and
23 proposed field repairs across 13 units. The strict production extraction
validator, durable-career gate, focused editorial review, chronology challenge,
and final combined review all pass on the same current source and draft.
There are no remaining review findings or alias-disposition conflicts.

Source audit corrected the Tian He / King Wei conflation, the chariot timber
misread as a horse, several mistranslated actions and referents, the closing
assessment of the military text, and a missed abbreviated Chinese callback.
Family links distinguish Tian He's ancestry from King Wei's rather than
inventing intermediate parents. Known birth/death claims remain separate from
possible-event windows. Yan Ying's recommendation is bounded by 547 BC and
c.500 BC; Tian Qi's and Tian Bao's resentment is bounded by 547 and 481 BC,
with the later coup's source unit explicitly included as bounding evidence.

The review process itself needed correction. It proposed an unsupported
deployment reading, reversed BC ordering, and oscillated between two date
windows without new evidence. Those suggestions were not treated as authority.
Additional independently pinned commentary, explicit date-field labels, the
computed chronology ordering, and source-grounded intervention resolved them.
An internal review-disagreement claim was removed; the interpretive quotation
is bound to the existing event record instead.

This chapter's cumulative peak-price estimate is **$4.7344**, including all
development iterations and 297 request entries:

| Phase | Requests | Peak Estimate |
| --- | ---: | ---: |
| Worker and repairs | 244 | $0.5323 |
| Combined reviews | 18 | $2.1772 |
| Chronology challenges | 18 | $1.0720 |
| Editorial audits | 17 | $0.9529 |

The original $10 cap was not increased. Across all DeepSeek trials, the
conservative ledger total is $6.1311; the account last reported $6.95 remaining
from $10. Off-peak billing is lower and balance updates can lag. Nineteen
feedback rounds include supervised intervention and experimental reviewers;
these costs and intervention rates are not a calibrated production benchmark.

Final verification: 37 harness tests and the existing extraction-validator
self-test pass. An actual cached CLI replay made zero new model requests;
an eight-unit Shiji 58 assignment with `--require-whole-chapter` was rejected
before inference. Source-bound approval fingerprints, the restored date windows,
the added callback, and the research quotation binding were checked directly.
No pending spending reservations or running pilot remain.

The current evidence package is under
`data/people/generated/deepseek-pilot/shiji/064/chunk-1-a32f7949281d/`, including
`evaluation.json`, `validated.json`, source documents, citations, archived
feedback, and all three review reports. `wholeChapterApproved` is true;
`productionAuthorized` remains false. No accepted production extraction,
translation source, person page, or ebook was changed. Further paid calibration
and corpus-wide rollout are paused for the economic reasons above; preserve
this evidence without treating the benchmark as a production extraction.

## Second chapter: Songshu 90

The authorized second trial finished on 2026-09-13 at 02:30 UTC, about 31
minutes after its first paid request. It covered all 33 units in one packet:
22 people, 69 surface groups / 99 mention occurrences, 100 explicit fact
records including 25 family relationships, and eight proposed translation
field repairs. It used the same Flash extractor and Pro review settings as
Shiji 64. No historical correction was supplied by the orchestrator; the only
harness change was the explicit replacement-reference selector described above.

The total conservative peak-rate cost was **$0.853155356**:

| Phase | Requests | Peak Estimate |
| --- | ---: | ---: |
| Worker and automatic repairs | 182 | $0.2485 |
| Editorial reviews | 6 | $0.2571 |
| Chronology reviews | 7 | $0.3476 |
| Final combined review | 0 | Not reached |
| Total | 195 | $0.8532 |

The runner performed five review cycles and four automatic feedback/repair
rounds, retaining interrupted review responses. Mechanical extraction checks
pass and the current editorial review approves, but the chronology review
still requests revisions. `wholeChapterApproved` and `productionAuthorized`
are both false. This is an unsuccessful acceptance trial, not an $0.85 price
for a completed chapter, and it does not include an unperformed final combined
review or any production integration work.

The editorial loop found genuine defects without orchestrator corrections:
posthumous epithet versus posthumous investiture, omitted military offices,
the annotated Lipu/Lifeng textual variant, and Ying Province misread as E
Province. The remaining data problems include unsupported 466-472 activity
windows copied from Emperor Ming's reign, death point-years that the evidence
only bounds after the Qi accession, and omitted researched birth/death facts.
One intermediate repair invented 490 as an upper death bound; another merely
changed the date's explanation or certainty while retaining the rejected year.

Reviewer agreement is not sufficient either. The last chronology report
suggests giving Zan his brother Song's inferred birth year because they were
`同生`. In this genealogical context, the passage establishes a shared mother;
it does not establish twins or an identical birth year. Do not apply that
suggestion automatically. The reviewed English also still needs source audit
of the military jurisdictions in s0021 and s0028: the command includes a whole
province plus specified commanderies in another province, not commanderies
spread across the two provinces as the current wording implies.

The existing production attestation gate requires a Western year or a closed
Western interval for every person. Some rejected claims need more historical
research or a properly represented one-sided bound. The worker should report
a research blocker instead of inventing the missing endpoint to satisfy this
gate. This trial did not change that schema, weaken the validator, or tune
review prompts to obtain approval.

Across all trials the conservative ledger now totals $6.984280916, leaving
$3.015719084 under the unchanged $10 ceiling. The account reported $6.56
remaining versus $6.93 before this trial; the $0.37 reported balance movement
is not a settled per-chapter invoice because balance updates can lag. No paid
worker or pending reservation remains. All draft records, source quotations,
feedback, and responses are preserved at
`data/people/generated/deepseek-pilot/songshu/090/chunk-1-5e66b698774c/`.
No production extraction, translation, site page, or ebook was changed.

The lower inference bill is encouraging, but accepted end-to-end cost remains
unmeasured for a fresh chapter without historical supervision. Stop here rather
than spend the remaining balance repeatedly relabeling unsupported dates.
The reference-selection change passes the 38-test offline harness suite,
including allowlist rejection, pinned-source resumption, and unchanged original
metadata. Any resumed trial must retain this spending ledger and conversation.
