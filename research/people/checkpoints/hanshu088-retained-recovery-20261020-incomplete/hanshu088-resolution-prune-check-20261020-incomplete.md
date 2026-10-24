# Hanshu 088 identity invalidation simulation — not published

This read-only simulation uses staging commit
`badf6573cb7ea861bbb244fda4ddb446735740c8`, the exact normalized 088 candidate
documented in `hanshu088-normalized-staging-recovery-20261020-incomplete.md`,
and staging's `pruneResolutionDocument` implementation. No resolution files,
canonical source, queue claims, Git index, or remote refs were changed.

Reproduction script SHA-256:
`4350c05d2d906abf9405d91261f92076cc6d6ab7f6e91b45ebc684af4577b21e`.
It requires a script-only fixture of the pinned staging revision with its
people schemas and `node_modules` available; the used fixture is
`/tmp/hanshu088-stage-check.wLwd0wXT`. Its staged invalidation library SHA-256
is `f5530d0273ed6b2d43d82ddd4fe4cb7ef08f7c4139f3f05a7082d3fb4adaa856`,
and its staged schema loader SHA-256 is
`068e49d36e651d4380d020c225246b549a821a7d406988ef38607ff26f31ab71`.

From the repository root:

```sh
PEOPLE_STAGING_FIXTURE=/tmp/hanshu088-stage-check.wLwd0wXT node data/people/generated/jinshu-identity-ref-64521198-20261018/hanshu088-resolution-prune-check-20261020-incomplete.mjs
```

The JSON output gives the exact 57 changed paths and per-file counts. It finds
57 staging documents containing the chapter ID; all 57 have affected
`localPeople` references and would change. Across these, pruning touches 326
decisions, removes 340 chapter-local references and drops 220 decisions with
fewer than two remaining people. Another 106 decisions retain at least two
other people (59 keep-separate, 46 merge, one possible-same-as), with the
removed chapter members excluded and canonical IDs cleared by the production
invalidation function. One document becomes empty:
`data/people/resolutions/curated-junfang-identities-2026-08-23.json`.

Every original and pruned document passes the actual staging resolution JSON
schema, including the empty document. The simulation asserts every decision
unaffected by an 088 reference is retained exactly at the JSON-value
level (with duplicate multiplicity), and each affected decision retained with
two or more outsiders has exactly the function's expected member filtering and
canonical-ID removal. Those checks prove the narrow structural behavior, not
the semantic correctness of the 106 surviving cross-chapter decisions. Some
original rationales may depend on the removed 088 member. The simulation also
does not establish corpus-wide referential integrity, current identity
fingerprints, duplicate batch safety across all documents, or any generation
and publication gate.

For a production checkpoint, independently review the candidate and these
identity effects, use current staging and ownership snapshots, preserve all
existing work, and generate the exact 57 changed documents through the staged
invalidation function in an isolated fixture. Review the empty-document
handling, external-member decisions, and `canonicalPersonId` consequences.
Only host-controlled staging should publish the source, candidate, receipt,
and appropriate resolution changes as one coherent incomplete checkpoint;
run scoped extraction plus applicable full resolution validation and rebuild
when disk and operational conditions permit. A fresh date audit, identity
re-resolution, and all website/ebook gates remain outstanding. Never infer
complete chapter status from this simulation.
