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
2. Have the trusted orchestrator atomically claim an exact chapter for the worker first.
   This is the normal route when Grok Bot has the GitHub connector but terminal Git does
   not have push credentials:

   ```bash
   npm run people:grokbot:claim -- --worker grokbot-01 --book <book> --chapter <nnn>
   ```
3. Use a shallow sparse clone. The full Git history is roughly 10 GiB and the tracked
   `public/` build assets are not needed by extraction workers. Substitute the assigned
   book in the final path:

   ```bash
   git clone --depth 1 --single-branch --branch master --filter=blob:none --sparse \
     https://github.com/GarrettPetersen/records-of-the-grand-historian.git
   cd records-of-the-grand-historian
   git sparse-checkout set scripts data/<book> data/people/chronology \
     data/people/curation data/people/schema data/people/extractions
   npm install
   ```

   Cone-mode sparse checkout includes the small root files and `data/glossary.json`
   through their parent directories while omitting `public/`, generated people data,
   and unrelated books. Never give a Grok worker a full-history clone.
4. Keep one clone or Git worktree per concurrently running bot. Give every bot a stable,
   unique worker ID such as `grokbot-01`.
5. Work from `origin/master`. Extraction PRs target
   `codex/people-glossary-staging-v2`, not `master`, so a chapter does not trigger a
   production deployment.

The staging branch is merged to `master` only at a reviewed batch checkpoint.

## Bot Routine

Give each Grok Bot agent this standing instruction:

```text
Process exactly one 24histories people-glossary chapter at a time.

1. Work in the assigned shallow sparse clone. Switch to master, pull origin/master, and
   reconstruct the exact sticky claim published by the orchestrator:
   npm run people:grokbot:resume -- --worker YOUR_STABLE_WORKER_ID --book BOOK --chapter NNN
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
6. If terminal Git can push, run the assignment's submission command. Otherwise, run
   the assembly command and attach the assembled extraction to the trusted orchestrator.
   The orchestrator verifies the reported byte count and SHA-256, saves it at the exact
   extraction path, and runs `people:grokbot:accept`. Do not route JSON through a text or
   repository connector that can alter Unicode bytes. Never place credentials in chat or
   configure them in the worker shell.
7. Stop after submission. Start the next chapter only in a clean worktree from the
   latest origin/master.

If interrupted, resume the same bot conversation and branch first. Rerunning the resume
command with the same worker ID reconstructs its active assignment without mutating the
ledger or overwriting partial output. Never release or replace an interrupted assignment
merely to obtain a fresh chapter.
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

# Reconstruct a claim already published by the trusted orchestrator; no queue push.
npm run people:grokbot:resume -- --worker grokbot-01 --book <book> --chapter <nnn>

# Validate each sealed chunk, assemble, and submit.
npm run people:grokbot:validate -- --worker grokbot-01 --book <book> --chapter <nnn> --chunk-id <id>
npm run people:grokbot:assemble -- --worker grokbot-01 --book <book> --chapter <nnn>
npm run people:grokbot:submit -- --worker grokbot-01 --book <book> --chapter <nnn>

# Trusted orchestrator: validate an imported direct attachment and mark its claim ready.
npm run people:grokbot:accept -- --worker grokbot-01 --book <book> --chapter <nnn>

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
