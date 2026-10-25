# Jinshu 053 native staging driver: prepared, not applied

This one-off host artifact uses the verified runtime's supported `runDateWorkflow` API. It is not a production feature or a publication command. It has not executed production mutations.

The default invocation is read-only, consumes the host's sealed ledger snapshot without fetching Git, runs the disk preflight, checks 627 pinned runtime/input files and the exact proposal bytes, and validates the candidate with the CLI's production compact/editorial gates. The packet, complete nineteen findings, generation, owning worker, lane, and interrupted unstarted repair state must all match.

```sh
node /Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/efficiency/jinshu053-native-host-driver-20261025/driver.mjs \
  --proposal /Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/efficiency/jinshu053-current-source-repair-20261025/proposal.json \
  --proposal-sha256 1017b4113134d43c1fd85bd4ba583cd603a5098a7c324c7c471ed8a98089e394 \
  --author /root/prepare_053_editorial_apply
```

Only the host, after independent driver/proposal review, may append `--apply`. This mode uses the original CLI's exact global lock with `failIfExists:true`, rechecks all frozen inputs on each remote CAS attempt, requires the entire authentic date claim to equal the sealed snapshot, and refuses every existing executor token or expiry, including expired ones. It never creates/replaces/releases a sticky claim or takes over ownership. All existing audit metadata is preserved. Remote checkpoint operations assert worker, lane, generation, fingerprints and executor token, and extend its one-hour lease. The finalizer removes only its token and expiry while retaining sticky ownership.

The native callback returns the genuine proposal and records only honest `status`, `nativeAuthorId`, `localProposalHash` and `localProposalPath` metadata. The production workflow writes the proposal, tracks `author.agentId` as `proposalAuthorId`, validates/stages the candidate and creates its fresh independent re-audit plan. No SDK `agentId`, `runId`, `sent` or remote `artifactHash` is fabricated. A deliberate exception stops all fresh review callbacks before dispatch. Successful staging requires round one, `candidate-1.json`, phase `reaudit`, and its retained plan; it does not count as approval or publication.

The host then resumes the original owning CLI invocation with the original settings (four-job shared pool, 250 units, 256 KiB, $3/four-million-token/20-minute limits, three rounds/attempts) for independent Cursor review and normal publication. Do not hand-install workflow JSON or manually mark the candidate approved.

Verification: `node --test .../test-driver.mjs` passed two bounded offline tests. Ownership/lease/sent-state guards fail closed; the real workflow API on a tiny generated fixture stages native authorship and an unstarted independent review plan while preserving its original extraction and negative report. The synthetic fixture is removed afterward. The live read-only default preflight also passed with the exact proposal above. No SDK calls, remote mutations, canonical changes, source edits, branch/index changes or production workflow writes were performed by this preparation lane.

If any pin, proposal byte, claim, job, lock, or generation has changed, stop and reconcile with the host. Do not refresh seals merely to bypass a guard. Partial failures preserve available state for explicit host recovery.
