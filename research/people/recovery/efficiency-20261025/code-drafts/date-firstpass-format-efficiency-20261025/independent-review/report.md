# Independent prompt review

Verdict: APPROVED for host publication to fresh jobs only. No actionable defects.
Reviewer: independent date_firstpass_efficiency_prompt_review conversation; not the draft author.

Reviewed exact artifacts:

- Base: `c4c0e032280dcbed529956b193e400cab045e7dc:prompt-people-date-review.txt`, SHA-256 `c3e91b6fb791a4b02b1b5d62ceafeb66f45ecff584054430c54b931c03d107bf`, 10,093 bytes.
- Draft: `source/prompt-people-date-review.txt`, SHA-256 `65c81185158b8db257a91ea1f3afd59e3147b475b8612c646c46af806cdea350`, 10,378 bytes.
- Patch: `patch`, SHA-256 `1b5447156f00933d32502a7a1daef959e67639113be0d2b012c55a4c04df3f86`, 1,824 bytes.

Independently recomputed all three hashes and reconstructed the full unified diff from the committed base and isolated draft. It matches the patch byte for byte. Read the full draft, envelope and author report.

Canonical validator inspection confirms both instructions. `scripts/lib/people-date-audit.mjs:87-88` implements substantive-text minimums with `value.trim().length`. Lines 121-128 apply minimum 20 to reasons for both item and person checks and require every evidence quote to satisfy its cited Chinese source unit's `zh.includes(citation.quote)`. This requires a contiguous exact substring; separate evidence entries for disjoint passages are already supported. The prompt does not confuse event minimum 10 with reason minimum 20. Its substantive/source-specific and no-padding language preserves the existing explanatory requirement while making the mechanical minimum explicit.

The two prompt hunks add 285 bytes and clarify existing output requirements without changing historical semantics, date representation, coverage, event ownership, independent review, research holds, repair proposals, validation, or publication gates. The concise-reason instruction remains explicit, so this does not request repetitive prose or arbitrary verbosity. No runtime or validator change is included. Reviewed existing `scripts/test-people-date-audit.mjs`, including forged-quotation rejection, complete-coverage checks, independent-review requirement, stale-input handling and publication gates. Did not rerun the author's already-passing test suite or add trivial prompt-text tests. No model trial was performed; reduced retry cost remains an expectation, not measured evidence.

Acceptance scope is fresh jobs after host publication. The artifact explicitly preserves sealed live jobs; this review neither modifies nor authorizes modification of their prompts, fingerprints, inputs or state. Host must preserve those seals when publishing. This is approval of the exact prompt artifact, not a claim that deployment or any historical date audit has occurred.

Disk preflight passed before work: 51.648 GiB available, no reported errors. Used the shared host checkout and wrote only this independent-review/report.md. No canonical/source/runtime/queue/locks, Git branch/index, builds, or external model calls were changed or invoked.
