# Reconciliation guard v5: isolated research, not approved

Patch `reconciliation-guard-303b4e0-review-v5.patch` is based on commit
`303b4e0fe883d4d305d84987b656322a91e5c3a4`, with SHA-256
`3b9a87755cd078791fcbe39a7d9a4cd7a1f9036270c53aaee53ceca9cde36a2e`.
It does not modify canonical source and requires independent review. The
preceding v4 patch is retained unchanged.

The new prototype requires scanner coverage of the entire unscanned name,
normalizes reviewer IDs using Unicode NFKC, trimming and case normalization,
excludes extraction/chunk authors and validated editorial reviewers, and fails
closed when author provenance is absent. It also rejects contradictory
overlapping person/non-person decisions. Reviewer independence depends on the
authenticity and completeness of the source provenance: the CLI derives
editorial IDs from validated editorial history, but this is not proof that
historical metadata itself is truthful.

The following inputs were copied, unmodified, into the existing script-only
fixture for a real-chapter command-path check:

- `jinshu127-focused-reviewed-materialized-20261020-incomplete/source.json`,
  SHA-256 `6970c4c954c237823685d6e9accee73bb3e9a49e3aec0c92664c5998ff921652`.
- `jinshu127-focused-reconciliation-candidate-20261020-incomplete/extraction.json`,
  SHA-256 `cfff7a83582f27778d3088391e2c2633f63c43dbb9888850877464661fd7f6e7`.
  Its `run.agentId` is null, and each of its seven `run.chunks[*].agentId`
  values is null.
- `jinshu127-focused-reviewed-materialized-20261020-incomplete/editorial-history.json`,
  SHA-256 `4e496af66185e95535f0ffbc7fb9085b13b75f41ce216f7357bb6aa7495e8102`.
  Its first review, completed `2026-09-09T01:34:00.000Z`, has a null
  `reviewer.agentId`; the following four reviews have IDs.

Running `node scripts/apply-people-translation-repairs.mjs --book jinshu
--chapter 127 --reconcile-current --decisions
data/people/editorial-decisions/jinshu/127.json --unscanned-review-packet
/tmp/jinshu127-guard.QGaCJs/unscanned-review-packet.json` in the fixture
failed closed with `Unscanned review requires trusted extraction chunk author
provenance`. This is a deliberate safe failure, not an end-to-end successful
packet/replay test. No identity was filled in or inferred.

The offline name-collision, ambiguity and editorial-rejection suites passed
34 tests. `node scripts/apply-people-translation-repairs.mjs --self-test`
passed. These tests do not establish that the full CLI packet/replay/write
path works; that requires independently verifiable provenance and a safe
end-to-end fixture. No reviewed chapter or canonical data was published.
