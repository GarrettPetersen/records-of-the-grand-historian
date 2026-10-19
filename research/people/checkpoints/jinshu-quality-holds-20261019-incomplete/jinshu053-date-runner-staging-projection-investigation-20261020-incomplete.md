# Jinshu 053 date runner: staging projection investigation

Research only. No runner was launched; no queue, claim, lock, canonical input, shared index or repository checkout was modified. The staging revision examined is `e05f6c66e23741d4f5079e1e04c27f7e2f997490`; the checkout HEAD is `3abd4ae7e81e0c4b03884282a51beec9f0dd56a2`. These observations need revalidation immediately before action.

## Byte identities

SHA-256 below is over exact file bytes, not the semantic JSON packet hashes. The second digest is the shared checkout's current file.

| Path | Staging | Shared checkout |
| --- | --- | --- |
| `scripts/run-people-date-workflow.mjs` | `4fe903586994810d34e8361b9b6200e51b6fc8dd9553367c976cc75a67dbd2da` | `6426f753c649c1c901be33cf89c17085a44b27596a9fba444a1deb695270d03b` |
| `scripts/lib/people-date-workflow.mjs` | `42f6c82575432af453a89cd5292867104ef3edace8327e4fbb2f1372ae0c9d9e` | `749560098c702ec28c40c563d2647cef3870593ffebc4b1bfeeef728fb16cc3e` |
| `scripts/lib/people-date-worker.mjs` | `3c2c7df0c28f5aab24df5cd41f3a74e1e3ab6db176a39dbfef1c4c7025efde35` | `714c35bfa7c91fd9151a624b4b77c55f1ed40b91a90e352f1c7ab1abd3e30a79` |
| `scripts/lib/people-work-queue.mjs` | `67fcf1fa39c7762ae9d3b5c53d4bc328a80bbd4ea95130d62cac585e95a44fb4` | `913280cc5be38a172ca58c2e388b722a2b4372590927f71f9092eed440075cbd` |
| `data/people/schema/compact-extraction.schema.json` | `a127c3740e8ae2ecb60bfe558a1c8aecc01196e2f670ad56846e0813b7cf60a5` | `4b51e100fef9d23b994cef18fc4b9e88e99d68cc63378605784d36cb57afd86f` |
| `data/people/schema/editorial-decision.schema.json` | `ec1c58456d5b1804a2e97ebfaf874a864ad5fb29c9740e637ba8e09497a71d3e` | `63fb546c411e5e461e0131ae78a1fb54e02e3c86dda8e713b8927693bd30d1a2` |
| `data/people/schema/extraction.schema.json` | `5aa253091085f4cc82b0fbc18f6f13fbb2f708884d173690b90b8b6e5885e4dd` | `272b98e4b2d57e5f7bdcd85d783731b0ae8f620c7c0859f31f5d5ce7e9ec830d` |
| `prompt-people-date-review.txt` | `566af7197d768111fb1f06ad31b74f5954156a91ec9c0dc4a11986c60e51ef85` | `1c69c13b739d2a01dd167e56bc4ffb5cf7c80f5cb3d73bedb3e05dd1b73b4060` |
| `data/people/extractions/jinshu/053.json` | `464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69` | same |
| `data/people/date-audits/jinshu/053.json` | `d3bb12dbc7db670357affb2e216790baffb359db62ce78478ff3d37c1ba93073` | same |

## Dependency and ownership findings

- The shared date workflow lacks staging's completed-generation/ownership and installed-report-change protections. Other shared scripts also differ, including date runner, worker, audit, work queue, validator, and editorial modules. Do not execute the local runner as though it were the staged revision.
- A static relative-import walk of the staged runner found 27 local modules, of which 15 differ from the checkout. External imports are `@cursor/sdk`, `ajv/dist/2020.js`, and `ajv-formats`; all three packages are installed locally. Staging's entire tracked `scripts/` tree is 565 files and approximately 8.26 MB: a host-controlled script-only projection is much smaller than a corpus copy, though this static walk cannot prove absence of every dynamic resource.
- Staging `people-content.mjs` supports an absolute `PEOPLE_REPO_ROOT`. With that pointed at the shared checkout, the queue adapter explicitly runs Git in `REPO_ROOT`, and data and workflow locks also resolve there. This preserves shared ownership rather than silently creating a second ledger. Package resolution for projected scripts would need the existing `node_modules` made available, for example by a symlink in the isolated script projection.
- **The projection is not yet safe as-is.** The staged schema loader also reads `REPO_ROOT/data/people/schema`, while the staged worker reads `REPO_ROOT/prompt-people-date-review.txt`. Those checkout files differ from staging. In particular, the checkout lacks the staged `externalPrimaryChronology` schema fields and `grok-build` reviewer kind. The local prompt differs on retrospective categorization and clarifies required events for hint checks. Do not overwrite these user files, silently mix revisions, or infer that one prompt is equivalent. Either reconcile the specific schema/prompt and code changes non-destructively in the shared checkout, or design and independently review an explicit projection-resource override that keeps the authoritative data, queue, and lock at the shared root. The latter is new code and needs tests, not an existing supported option.
- Live queue ref at inspection was `4aca09929f40d88b55271e75e780d6423d494b2c`; its `dateAudits` and history had no `jinshu/053` entry, and there was no local `date-workflow/jinshu/053` directory. Thus no existing 053 stable worker was identified. Recheck live ownership and cross-host execution before reservation; existing sticky ownership of other chapters is not transferable.
- The local run lock records PID 32459 for `jinshu/006` artifact-only recovery; `ps -p 32459` showed no local process at inspection. This is not proof about another host or a current lease. Staging's `acquireProcessRunLock` automatically unlinks a lock if the recorded local PID is absent. The user's explicit no-lock-deletion direction means the normal runner must not be allowed to do that without resolving the instruction and ownership situation. Do not manually delete it or take over a live lease.

## Safe next steps

1. Host reviews the full script import graph, schema/prompt deltas and existing local modifications; independently review any reconciliation or resource override and preserve all user changes. Do not create another checkout or copy the corpus.
2. On a tiny isolated fixture with its own temporary data and local-only Git origin, run the staged offline date-workflow and ownership tests plus date-worker and campaign-date tests. Inspect test code first: some tests locate the prompt and package relative to their script tree, and one expects a particular historical `package.json` command that may no longer match staging. A changed assertion must be understood, not blindly weakened. Do not run tests against production queue or canonical data.
3. After resolving the lock issue without violating the user's instruction, verify the current remote ledger and live executor, current exact chapter and proposal hashes, and editorial closure. Use the shared date reservation and one stable owner, retaining existing packet ceilings. The current `research-blocked` report may seed the repair; the proposal is not an approval. Use a fresh complete independent re-audit of the candidate before the canonical publisher may change the extraction.
4. Keep one shared host runner, two chapter slots, and a single four-job pool. Preserve all artifacts, rejected reports and leases. Release only after full identity, link, site, ebook and CI gates pass.
