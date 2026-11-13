# Chapter-owner adoption handoff

Scope: orchestration design and bounded canonical-person retrieval. No chapter
claim has been taken over, no inference wave launched, no running job's source or
inputs changed. Adopt at the existing owner's next idle invocation boundary.

Published handoff branch: `codex/people-chapter-owner-lookup`, based on canonical
runtime revision `c991cf12d80fda1d1375d729f6f3553cc212bbcb`. Its Git commit was made
with a separate temporary index, preserving the active checkout's branch and index.
The read-only endpoint is deployed and host-verified; see `PEOPLE_LOOKUP_API.md`.

1. Read `PEOPLE_SINGLE_OWNER_WORKFLOW.md` and `PEOPLE_LOOKUP_API.md`. Keep the current
   nonempty Jinshu completion target and shared queue/recovery ownership.
2. Run the lookup unit tests, then the live verifier against the exported generation.
   The host export is `data/people/generated/people-lookup/20261113-v1`; receipts and
   seals are ignored local recovery, not files to copy into chapter jobs.
3. Supply the pinned chapter and current accepted artifacts to one capable reasoning
   cloud agent. Inject lookup credentials with `peopleLookupCloudOptions`; resume
   the same agent through validator feedback. No per-chapter repo clone or build.
4. Use the existing canonical runtime's reviewed combined-curation contracts for
   one independent final review, returning its exact source/editorial/date/identity
   reports together. Continue that same reviewer for bounded patch review. Keep
   source and native report provenance; automatic generic hash refresh is prohibited.
5. Host-verify and publish using the existing native gates, then verify a second
   live nonempty chapter and record total usage/time/patch rounds. Scale based on
   accepted publication throughput, not the lookup service or drafted extractions.

The API is read-only. Its initial native registry is pinned to November 3 and is
candidate evidence; newer accepted canonical changes need a new verified snapshot
or explicit sealed host evidence. It never grants date, identity or publication
approval. Lookup rate limits are pilot limits, not inferred production throughput.

Installed SDK supports runtime `cloud.envVars`, including on resume. This change
provides an injection helper; existing launchers and running cloud agents have not
been silently rewritten. The app's saved orchestrator goal has not been edited.

General automatic proof reuse across arbitrary source changes still requires the
native publisher to validate dependencies and actual review provenance. Reuse
supported identity composition and real captured reviewer continuations now; fix
any specific unsupported adapter once, with independent review, rather than adding
per-chapter appliers or automatically redoing every prior reasoning step.
