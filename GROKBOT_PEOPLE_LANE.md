# Grok Bot People-Glossary Lane

Grok Bot has a weekly allowance separate from the Cursor SDK. It is a persistent-agent
product, not another SDK model endpoint, so it runs as a second worker lane while the
repository owns assignment, validation, and publication.

## Coordination Contract

Both lanes use the atomic ledger on `codex/people-work-queue`.

- Cursor SDK runs claim chapters automatically through `npm run people:extract`.
- Grok Bot claims chapters with `npm run people:grokbot:claim`.
- Grok Bot claims are sticky from assignment onward because their persistent
  conversations may be resumed after a long pause. A submitted extraction, a locally
  completed Cursor extraction, or a resumable Cursor conversation/chunk plan is also
  sticky. Only an untouched Cursor lease may expire after 24 hours.
- Resumable Cursor work always remains in the Cursor lane. It cannot be assigned to
  Grok Bot even after an allowance reset or a long interruption.
- Accepted work is pruned from the ledger only after it is present and current on
  `origin/master`.
- The queue branch is coordination state. Never merge it into `master`.

The claim update is a compare-and-swap Git push. Concurrent workers may race, but only
one can publish the winning claim; the loser rereads the ledger and receives different
work.

## One-Time Setup

1. Give the Grok Bot agent access to the GitHub repository and a persistent terminal.
2. Clone the repository and run `npm install`.
3. Keep one clone or Git worktree per concurrently running bot. Give every bot a stable,
   unique worker ID such as `grokbot-01`.
4. Work from `origin/master`. Extraction PRs target
   `codex/people-glossary-staging-v2`, not `master`, so a chapter does not trigger a
   production deployment.

The staging branch is merged to `master` only at a reviewed batch checkpoint.

## Bot Routine

Give each Grok Bot agent this standing instruction:

```text
Process exactly one 24histories people-glossary chapter at a time.

1. In the repository, switch to master, pull origin/master, and run:
   npm run people:grokbot:claim -- --worker YOUR_STABLE_WORKER_ID
2. Read the generated assignment file. Create or resume the exact branch named there.
3. Process the assignment's sealed chunks in order. For each chunk, read only
   prompt-people-extraction-compact.txt, that chunk's compact packet, the compact
   extraction schema, and its seeded output. Do not inspect unrelated chapters, prior
   extractions, or another chunk while writing the current one. Do not call the Cursor SDK.
4. Complete each seeded chunk extraction. Capture every person, mention, attested time,
   durable claim, relationship, family edge, and candidate disposition. Propose clear
   translation repairs in translationRepairs; do not edit source chapter JSON.
5. Run each chunk's validation command until it passes. After every chunk passes, run
   the assignment's assembly command; it rejects gaps and overlaps and validates the
   complete chapter.
6. Run the assignment's submission command. It validates and assembles again, commits only the
   extraction, pushes the worker branch, marks the claim sticky, and opens a PR to the
   people staging branch.
7. Stop after submission. Start the next chapter only in a clean worktree from the
   latest origin/master.

If interrupted, resume the same bot conversation and branch first. Rerunning the claim
command with the same worker ID reopens its active assignment without overwriting the
partial output. Never release or replace an interrupted assignment merely to obtain a
fresh chapter.
```

## Operator Commands

```bash
# Import local Cursor partials and completed-but-unpushed output as sticky claims.
npm run people:queue:sync-cursor

# Inspect both lanes and every active reservation.
npm run people:queue:status

# Preview and claim one economical chunked chapter for a Grok Bot worker.
npm run people:grokbot:plan -- --worker grokbot-01
npm run people:grokbot:claim -- --worker grokbot-01

# Validate each sealed chunk, assemble, and submit.
npm run people:grokbot:validate -- --worker grokbot-01 --book <book> --chapter <nnn> --chunk-id <id>
npm run people:grokbot:assemble -- --worker grokbot-01 --book <book> --chapter <nnn>
npm run people:grokbot:submit -- --worker grokbot-01 --book <book> --chapter <nnn>

# Remove expired leases and work already merged to master.
npm run people:queue -- reconcile
```

Use `--book` and `--chapter` only when a specific chapter is deliberately assigned.
The default Grok Bot allocator chooses the smallest unclaimed chapter, then divides it
into disjoint 60-unit, 150-candidate, and 48-KiB sealed packets. The chapter remains one
central claim, so no other lane can take a later chunk. Cursor retains its adaptive
split and conversation-recovery machinery for its own assignments.

## Review And Merge

Grok Bot PRs contain extraction files only. Translation repairs remain proposals until
an independent editorial pass checks the Chinese source and records decisions. Merge a
reviewed cohort into the people staging branch, then make one checkpoint merge to
`master`. After the checkpoint lands, run `npm run people:queue -- reconcile` so those
sticky submitted claims disappear.
