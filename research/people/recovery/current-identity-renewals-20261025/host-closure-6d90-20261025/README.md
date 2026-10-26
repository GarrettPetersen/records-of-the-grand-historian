Artifact-only exact-current closed-context helper, pinned to `6d90b444737811c3ea18db3b8e7265965412d16b`.

Run the reproduction from the shared repository:

```sh
PEOPLE_REPO_ROOT=/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical node --experimental-vm-modules data/people/generated/independent-identity-recovery/jinshu053-source106-identity-reconciliation-20261025/host-closure-6d90-20261025/reproduce-context.mjs
```

For host reuse, import `loadCurrentClosedContext` from `current-closed-context.mjs` and await it ONCE per host invocation. The returned context has:

- `people`: 5,174 full structural records, with actual current normalized Ming255 host records, current claim locators, intact aliases, metadata, claims and mentions.
- `documents`: every WHOLE decision in all 268 exact-current Git resolution documents whose complete member set is present in `people`. Never use the selected 5,010 `currentPriorConstraints` index as this baseline.
- `allCurrentDocumentPins`, `current`, `byLocal`, and `proof`: actual prior bytes, current complete components, all 1,962 owned membership/canonical mapping checks, and source/runtime reconciliation.
- `scopeForWorkOrder(pathOrObject)`: checks full actual current canonical membership and hard-constraint closure; returns owned IDs, whole relevant prior decisions, explicit constraints, exact current source/extraction raw fingerprints (including inbound governing-context chapter inputs).
- `validateProposal(document, pathOrWorkOrder)`: ordinary resolution schema, unmodified SDK, and strict core validation against this complete current closed context. Returns bounded structural proof; never grants identity approval.
- `currentInputPinsForScope(ids)` and `sourceAccess.readActualGit(path)`: exact current raw input pins/bytes. Missing sources/extractions fail. No witness-as-record fallback.
- `loadRegistryField(name)`: lazily hashes and reads only that manifest field's shards. The default context loads only people, fullStructuralBaseline, completeCurrentClusters and ownedLocalPeople. Full original source `units`, `blocks`, `chapterFraming` and `chapterPins` remain available in place through individually hash-pinned shards. Each record retains full governing and inbound context references. Old registry bytes, original packets, proposals and reviews are not modified.

The canonical comparison is a bounded closed-subgraph validation, not a new global graph or global CI. Completeness follows from the sealed old complete components, all 268 actual current whole resolution documents, explicit-reference proof plus the exact global extraction delta, and rejection of any missing owner in a hard constraint touching the requested scope (or any of the 1,962 globally owned endpoints). Unrelated decisions with missing outside owners are excluded whole and counted; no partial hard constraints or fabricated owners are inserted. New priors must be fully represented in the host Map. A scope must include every member of each current component it touches.

The only extraction difference since the original complete source read is the genuine separately source-approved Ming255 p117 repair. The helper normalizes actual current Ming255 Git bytes, checks p117 exactly against the approved overlay, and compares all other Ming255 host records' metadata, claim semantics and mentions before refreshing positional claim IDs and dependent alias locator references. The old overlay's pending-host label remains untouched; the helper binds only its new derived current records. All primary chapter source files are unchanged. Jin053 source/extraction/editorial/date raw pins are independently checked unchanged at the actual current ref. This is reuse of source evidence, not rebinding an old approval.

The old selected-index baseline is 4,604 clusters; adding the first 12 current docs gives 4,582. The whole-decision closed baseline is 2,502; those same 12 docs give 2,480. Both count the same 5,174 available records. The difference is that many additional complete decisions among host validation records are present in the full actual resolution files. Reproduction validates all 1,962 owned current mappings and complete memberships against old complete groups plus the 12 actual new whole decisions.

The pinned core, schema, SDK and their used dependencies match actual current Git bytes. The catalog compiler differs at current ref and is explicitly not invoked. No checkout, monolith, corpus copy, branch/index/queue/lock, canonical write, paid call, build or publication operation is part of this helper. `reproduce-context.mjs` writes only its own `reproduction-proof.json` in this artifact directory.
