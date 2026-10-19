# Jinshu 072 independent-date-hold prototype — incomplete

This is an isolated experiment based on Git commit `6651857d41d5d88ea397d22806b1ecdfe03917fe`. It is **not approved for staging, production, or resuming the 072 worker**. No canonical source, claim, state, lease, lock, job artifact or audit report has been edited. The `data/jinshu/072.json` and `data/people/.../072.json` files under this directory are a small, isolated copy of exact staged inputs, not an additional corpus checkout.

The proposed exact-source hold is `data/people/date-audit-holds/jinshu/072.json`; it carries the reviewed finding from the retained partial audit and identifies the old semantic report hash. The hold file and source-review note still require independent verification and controlled publication. No resolution receipt has been created.

`hold-prototype.patch` covers the proposed status/record gate, repair and combined-curation preflights, sparse-selection additions, and fixture tests. With the exact old staging source/extraction/report, the patched status returned `research-blocked`. It permits an exact held finding in a failed report, or a fresh full approval when a separate reviewed resolution binds the hold, new report, current fingerprints and cited source evidence. Such bindings do not establish the historical meaning of a quotation; an independent reviewer must do that. It cannot auto-convert the retained eight partial jobs into a new approval.

The prototype patch, test logs, inputs, and proposed hold remain local ignored
recovery artifacts; a checkpoint of this report alone does not bundle them or
make the prototype reproducible on another machine. Preserve those artifacts.

## Safety gaps — do not install

* **No common hold-writer protocol exists.** File additions, removals and receipt changes are not required to take the same host process lock and shared executor lease as publication. Existing direct `people:dates:record` can write outside that lock. A hold can arrive after preflight and before a canonical write; repeated checks cannot make the check/write atomic across processes or hosts. The partial-publication receipt is recoverable but may contain already-applied source changes. Race coverage at explicit checkpoints does not prove atomicity.
* The combined path is guarded in `verifyCombinedCuration` and before each canonical role, but uncoordinated direct file writers and one-off `scripts/stage-*.mjs` require a complete inventory. The repair guard is checked before candidate mutation, but its check and mutation are separate. Code that directly reads report JSON may ignore the status gate. Do not claim universal write or publication protection.
* The runner startup reconciliation and catalog use `dateAuditStatus`, but all remaining readers and deployed/search/ebook artifacts must be audited. Existing sparse checkouts do not receive newly introduced paths merely because the preparation helper changes; they need safe migration before any held chapter is evaluated.
* No durable, independently verified CLI to create, revise or resolve holds has been designed; reviewer identity is a convention, not cryptographic authorization. The closure schema and provenance need independent adversarial review, including evidence relevance, swapped references, held-item remapping across reordered claims, stale source/extraction, malformed JSON, direct writers, crash/replay, concurrent hosts and tamper races.
* Structural tests verify hashes, quoted containment and gating, not that sources establish the AD 270–285 endpoints. A genuinely fresh complete date review and independent resolution are still required. Eight original OpenRouter job artifacts and their owner must be preserved.

The final offline date-audit, date-workflow and combined-curation suite exited successfully with 205 tests (`test-full.log`). Focused updated checks also passed: date-audit suite 20/20, repair preflight 1/1, combined checkpoint-race tests 2/2. `git apply --check` succeeded against an isolated pristine copy of the seven staging files. No full site build or CI was run.
