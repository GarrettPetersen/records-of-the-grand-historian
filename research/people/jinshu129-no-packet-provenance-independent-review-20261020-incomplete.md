# Independent reproduction: compact no-packet provenance

Research-only review by Codex `/root/jinshu129_target`; no production change
or chapter approval. Reviewed staging `8bfd06b65c815884cf91ba206d3617629e7569d0`,
diagnostic script SHA-256
`af84ac28068d2b36be579414c0e96fc72d17f8c802f30f102afdd824c11b93b5`, and
note SHA-256
`c03bd1131d45664cd4e84d92e8e8a16b70fb0e030e5eb7f22211e27197a68c6e`.
The stage source and extraction match the note's pinned byte hashes
`bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800` and
`91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8`.

## Reproduced observation

In a temporary scripts-only stage snapshot, the diagnostic passed. It changes
only an in-memory s0184 idiomatic substring from `visit to Yi and submitted`
to `visit to Yi in the east and submitted`; this is an artificial test, not a
proposed translation. Its original compact unit digest is
`277b55873475f45ffa4159a6`, versus `62476ee72c8c404c0e0065f9` after the edit.
The old English hash is
`sha256:2827133ad8f6df2d1359d3fb71d9900bb7cfb5148490f46b48083e50e2551d25`;
the new English hash is
`sha256:7ada738c0e08e1f7025d67f157ed14cfe8a6e235a6f81ecb7ac08d5d32ff7345`.
Expansion using the changed packet reports the latter in `expanded.input`,
and the Yi candidate ID remains `jinshu:129:cand_8a551c2a741c2b24`.
Both reported scanner versions are 2. The test also verifies the adjacent
unchanged s0183 compact digest. It does not exercise the complete applier or
prove that a bad result would be published.

## Code inspection and boundaries

Stage `expandPeopleExtraction` sets `input` from its packet, not compact
historical input. The `--reconcile-current` path passes its current packet to
that expansion and invokes reconciliation without a previous packet. Stage
scanner code computes chapter-wide capitalized-expression frequencies and
uses glossary input, then hashes unit, language, exact text and occurrence for
candidate IDs. The note's warning that an unchanged ID or current expanded
input cannot alone establish unchanged context or prior human approval follows
from this code and the reproduced case. The regression does not independently
demonstrate a global-frequency change, glossary change, or arbitrary scanner
collision; those remain test requirements, not observed failures here.

The note's proposed pinned historical inputs, explicit independent decisions,
full source/mention/claim dossier, fail-closed behavior and crash/retry tests
are a safety-design recommendation, not an implemented or formally proven
minimal contract. This review does not determine that every unchanged unit
must be re-reviewed, that every corpus extraction is affected, or that the
listed tests are exhaustive. Existing sticky state and date/identity gates
remain unchanged. The temporary fixture was removed after testing; no source,
claim, lock, shared Git state, prior artifact, or full build was changed.
