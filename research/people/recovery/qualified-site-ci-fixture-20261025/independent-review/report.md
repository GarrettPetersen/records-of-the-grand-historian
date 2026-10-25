# Independent one-file CI fixture fix review

Verdict: **APPROVED. No actionable findings.**

Exact patch SHA-256: `863417ad12a360499fee8a6d6fc84d62b10f2c002a0687bccf64de5c241ee937`.
Exact file SHA-256: `8172082bd94b88cfc3d019a87e817485e2aa120aaba9a791a30cc1f1a83ba7cc`.
Base: `5d652c2cded7074ad5bfe3727cff639b1f07e1f1`.
Target file: `scripts/test-people-production-build.mjs` only.

Independently checked the envelope's base/draft hashes and patch SHA. The actual production npm-build guard/sentinel prefix preceding the fixture block is byte-identical to the base (hash retained in integrity.json). All frozen V2 declared source/patch hashes remain unchanged. The diff changes only a negative test fixture, not publication behavior or authorization policy.

Actual execution used an isolated authored fixture containing just the exact test file, exact package.json and real guard script, with one narrow module-resolution loader pointing its existing context import at frozen V2 code. PEOPLE_REPO_ROOT points at that fixture, and its empty data inventory is explicitly present. No corpus/dependency/public copies or canonical writes occur.

Actual `npm run people:production-build:self-test` passed with no physical identity seal, and passed again with a physically present poison seal containing invalid JSON. The test itself forces only the exact seal read to ENOENT with exact error.path, so poison content cannot substitute for the intended missing-proof condition. Both runs execute the unchanged actual npm guard/sentinel branch first. Preview=1 stops before the sentinel; normal and preview=0 guard behavior is retained.

Two independent counterproofs also ran through the same actual npm self-test. Replacing only the context dependency with a function throwing ENOENT for `/wrong/path` fails its exact matcher. Returning inactive without throwing also fails. Thus unrelated missing inputs and inactive fallback cannot satisfy the new assertions. Source inspection confirms all patched filesystem methods and prior environment state are restored in finally. There is no generic catch accepting arbitrary failure.

Evidence: integrity.json, execution.json and four named logs. The initial isolated harness lacked its empty data directory and correctly failed for the unrelated ENOENT; creating that authored directory corrected the harness without changing any reviewed bytes. The final retained logs cover the complete passing/counterproof runs.

Disk preflight passed. No live code/Git index/branches/queue/runtime changes, paid calls or full corpus build. Host must reconcile this exact single file with the intended PR head using its normal CAS and rerun required CI. The approved V2 publication gates and existing no-repair editorial policy are unchanged.
