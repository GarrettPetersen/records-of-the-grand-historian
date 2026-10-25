# V2 guarded native staging driver

V1 is preserved for evidence and must not be applied: independent testing demonstrated that an orphaned valid re-audit artifact could bypass its worker callback and publish before the post-return guard. No live apply occurred. V2 is a separate driver/guards/input manifest; v1 hashes are retained in `v1-preservation-hashes.json`.

V2 seals the complete initial workflow directory by exact names and content hashes. Only these three files exist in the admitted baseline:

| File | SHA-256 |
| --- | --- |
| audit-0-8787e06f0b2bc56d7500.json | 739492e4664f2398355915ba1bc1da2fe7c65f72bf7f395d3589768629b54a1a |
| review-0.json | a46cb509c717714519a028b8f8e88666a95d18de9770565c28b74ba48d423b36 |
| state.json | d8caed8d418bda8df208dc360cb2fefe5c733666087cbd966625b0ef7cc50da8 |

Any added/removed/changed file, directory, or symlink fails. Any candidate, repair artifact, future review, publication, or future review plan/job also fails the initial guard. These checks run at preview, under the exclusive original CLI process lock, on every reservation CAS attempt, after remote reservation immediately before workflow entry, and again before native submission. Baseline source/state/report pins remain unchanged from v1. V2 additionally seals all validator schemas and their directory inventory, the proper-noun glossary, and the exact v2 proposal path/hash/native author.

The workflow's real `saveReviewPlan` hook always runs after local re-audit plan persistence and before loading any cached review artifacts. V2 validates staged round one, checkpoints the remote unstarted plan with the original ownership CAS, and then deliberately throws from this hook. This guarantees stopping before cached reviews or paid review dispatch, even if a cached artifact appeared after the initial inventory checks. The native callback's review branch is now an error, not the primary stopping mechanism. No new production API or publication mechanism was introduced.

Read-only preview command:

```sh
node /Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/efficiency/jinshu053-native-host-driver-20261025/driver-v2.mjs \
  --proposal /Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/efficiency/jinshu053-current-source-repair-20261025/proposal-v2.json \
  --proposal-sha256 c2d48723c6c4bf307f60bff66ff4794d518201c969e10c35dda32d05a01c4e73 \
  --author /root/prepare_053_editorial_apply
```

Only the host may append `--apply`, after reviewing this exact driver and the independently approved exact source proposal. No real apply has been executed by this lane. The original owning worker/lane/generation and original shared four-job pool, 250-unit/256-KiB envelope, $3/four-million-token/20-minute circuit breakers, and three-round/three-attempt limits remain unchanged. Existing executor tokens, even expired tokens, fail rather than being taken over. The finalizer removes only this invocation's executor token/expiry, retaining the sticky claim and all prior audit metadata. Fresh independent Cursor re-audit and normal publication remain required afterward.

V2 verification: three bounded offline tests passed: ownership/busy/sent-state guards; actual production workflow staging through the direct plan-hook boundary on a tiny synthetic fixture; exact inventory rejection of orphan candidates/reviews/publication, directories, future plans, and baseline byte changes. Independent review also tested the direct hook against the same matching cached review artifact that demonstrated the v1 bypass. Real v2 preview passed production compact/editorial validation with candidate `sha256:a2d845c4865ceb0f637f6f74bccf5b234f428b307e36c0d10df96b2ffe114187`.
