# Noncanonical disposition-transfer prototype

This is a research-only proposal, not an applied production change, new gate,
chapter repair, or publication approval. Pinned upstream staging observed at
inspection: `6ae8940a6cecb1c23ca1b5156e77687340c39876`. Its
`scripts/lib/people-translation-repairs.mjs` byte SHA-256 is
`ce87a452f7d3640add38cc7d502eabc540e25d44679f8adc86e90d785c28b8e4`, equal
to the existing `/tmp/jinshu053-strict-5ce.NuGR9k1r` fixture's copy. The
shared checkout's same file had a different SHA-256 at inspection and was not
modified; `git apply --check remove-unscoped-transfer.patch` succeeded against
that checkout but is not permission to apply it.

`remove-unscoped-transfer.patch` deletes only the branch that copies a prior
disposition solely by matching language and exact text. Existing candidate IDs
and uniquely remapped same-unit, same-occurrence dispositions remain as
before. A new occurrence no longer obtains a classification merely because an
unrelated occurrence has the same spelling, including a second occurrence in
the same sentence. Other pre-existing reconciliation heuristics, including
same-unit cross-language counterpart handling and final mention heuristics,
are unchanged; this is not a general semantic classifier or a validator fix.
Consequently some candidates previously auto-disposed may now remain
unresolved and require review, or may be processed by other existing rules.
This deliberately does not reclassify stale existing dispositions, repair
already-generated artifacts, change validation, or guarantee no conflicts.

The loader transforms only the isolated fixture's hash-verified source in
memory; it does not write that module. The test script compares baseline and
prototype behavior, including real Jinshu 053 reproduction from the
hash-pinned source, candidate and 22-row draft used by the earlier materializer.
The baseline copies `not-person/place` into s0047 candidate
`jinshu:053:cand_e52f72d263aa7470`; the prototype leaves no disposition and
the existing reconciliation links it to p001 with kind `personal-name`. That
link and its kind still need independent semantic review. In both runs three
other candidates remain unresolved. The earlier s0063 disposition is retained
because its candidate ID remains valid; it is a separate review defect.

From the repository root, run baseline and prototype:

```sh
node --test data/people/generated/jinshu-identity-ref-64521198-20261018/disposition-transfer-prototype-20261020/transfer.test.mjs
PEOPLE_TRANSFER_PROTOTYPE=1 node --no-warnings --loader ./data/people/generated/jinshu-identity-ref-64521198-20261018/disposition-transfer-prototype-20261020/loader.mjs --test data/people/generated/jinshu-identity-ref-64521198-20261018/disposition-transfer-prototype-20261020/transfer.test.mjs
```

Both ran 6/6 as expected: baseline tests deliberately assert the observed bug;
prototype tests assert the safer changed behavior. The test adds a synthetic
unlinked cross-unit case, duplicate occurrence in one unit, unchanged candidate,
and remapped same-occurrence case. For production integration these should be
adapted into fixed-behavior-only regression tests; do not ship the loader or
the baseline-expects-bug conditional as a production test.

In prototype mode the isolated existing `test-people-repair-name-collisions.mjs`
passed 10/10 and the isolated `apply-people-translation-repairs.mjs --self-test`
reported `ok`. The latter was run via `/private/tmp/...` because macOS resolves
`/tmp` to `/private/tmp` and the script's direct-execution guard requires the
resolved path. No full corpus build or semantic chapter-wide review was run.
Independent review and representative compatibility analysis are required
before considering production adoption; review preservation of legitimate
dispositions and new unresolved work without weakening any gate.
