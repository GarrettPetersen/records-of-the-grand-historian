# Unscanned-name review: provenance design, research only

## Existing evidence and scope

The v5 prototype's requirement that every historical chunk author and every
past editorial reviewer have an `agentId` is an additional gate beyond the
repository's existing editorial contract. In the pinned fixture the
production editorial validator rejects an extractor reviewing its own
proposals when **both** matching IDs are available; the workflow still
requires an independently authored review regardless of available IDs. The
prototype must not be deployed as if its new historical-ID requirement were
an existing policy.

The retained assignment
`data/people/generated/grokbot/grokbot-34/jinshu-127/assignment.json` has
SHA-256 `7f4deee6c3e6db2106fb4f588e1bd77edfe73905928d2a03f087f2134df18bbf`;
it identifies lane `grokbot`, worker `grokbot-34`, chapter and seven chunk
ranges matching the pinned extraction
`jinshu127-focused-reconciliation-candidate-20261020-incomplete/extraction.json`
(SHA-256 `cfff7a83582f27778d3088391e2c2633f63c43dbb9888850877464661fd7f6e7`).
The extraction identifies Grok Bot, but its run and chunk agent IDs are null.
The first editorial review in the pinned history
`jinshu127-focused-reviewed-materialized-20261020-incomplete/editorial-history.json`
(SHA-256 `4e496af66185e95535f0ffbc7fb9085b13b75f41ce216f7357bb6aa7495e8102`)
identifies a `cursor-agent` named `Codex`, but its agent and run IDs are null.
The same record appears in commit
`deddbe54eaaa8390ed247ae4bf360a9db0528e25`. These provider/lane records
support a different extraction and editorial lane, but do not establish exact
conversation IDs. The current queue has no chapter claim. None of this
establishes who authored a new unscanned-occurrence decision.

## Proposed host-controlled design, not implemented

Use a **new separate review conversation** for the particular unscanned
decisions. The trusted orchestrator creates the conversation and records the
actual platform-issued task/session and reviewer identifiers in a dispatch
receipt; do not derive, fabricate or retrofit historical IDs. The receipt
must bind at least:

1. The full exact review-packet byte hash, its input fingerprint, the source
   and extraction fingerprints, and the exact proposal/candidate or
   reconciliation artifact hash the reviewer is checking.
2. The actual originating task/session identity and author role for the
   proposed decisions or reconciliation, including the host's evidence of
   who authored that work. Missing or uncertain current-proposal provenance
   means no approval; an unrelated historic reviewer need not be retroactively
   assigned an ID.
3. The fresh reviewer's actual platform task/session/conversation identity,
   reviewer identifier, creation/dispatch event and time, and the host's
   attestation that this is a separate conversation that did not author the
   proposal. Record real values returned by the runtime, not names guessed
   from provider labels. Scope identifiers by their actual parent thread or
   session where needed to avoid collisions.
4. A completion receipt binding that dispatch, the exact reviewed decision
   artifact and its hash, all source witnesses, and the complete per-occurrence
   decisions. If packet, source, extraction, proposal or review changes,
   review and receipt are stale and cannot be replayed.

The reviewer may write its decision artifact, but the trusted host—not the
reviewer—must create and preserve the dispatch/completion records from actual
runtime events. A JSON file or hash invented by an arbitrary caller is not
proof of a fresh independent conversation: verification needs a trusted host
storage boundary, signed attestation or independently inspectable runtime
event record. Callers should fail closed if they cannot verify that boundary,
the task identities, the causal dispatch, the complete review and all hashes.
They must still run the normal source-witness, editorial, extraction, date,
identity and publication gates. A source-backed non-person decision must not
silently remove a real person mention; a reviewed person link must not hide a
different homonym or unresolved scanner candidate.

This is a design only; no receipt mechanism was implemented or independently
reviewed. v5 remains a blocked research artifact, not a production patch.
The existing validator's lack of mandatory historical IDs does not authorize
self-review or imply that model names alone prove independence. Date
repair/fresh independent re-audit requirements are unchanged.
