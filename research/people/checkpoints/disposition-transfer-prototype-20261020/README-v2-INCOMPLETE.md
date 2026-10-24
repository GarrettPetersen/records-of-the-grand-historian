# Extended reconciliation prototype: incomplete, do not deploy

This is a preserved research prototype, not an adopted fix or permission to
alter production, chapter data, leases, or publication gates. The original v1
loader and narrow patch remain separately preserved; v2 is **not** represented
by that patch. Staging observed at inspection:
`16208a5cc9f61ec2420cef1bbbb059f3143c741d`. Its translation-repair module
is unchanged from the hash-pinned fixture:
`ce87a452f7d3640add38cc7d502eabc540e25d44679f8adc86e90d785c28b8e4`.

The independent reviewer's original observed-unsafe-link fixtures are
`data/people/generated/death-bound-review-20261019/disposition-transfer-ambiguity-research.test.mjs`
(SHA-256 `66761e651f77bb54bbbf94913c893411aea4038abdd85087fae99dba15ce5b7b`).
They use a place disposition in s0000, optional p1 mention in s0001, and a
new same-text candidate in s0002. A globally unique person or a mention in the
immediately previous unit is insufficient to identify that occurrence; the
old behavior nevertheless auto-links both cases. The reviewer did not assert
that all actual repeated names refer to different individuals.

`loader-v2.mjs` changes the pinned fixture only in memory. In addition to v1's
removal of unrestricted disposition copying, it removes the global-name and
previous-unit linking fallbacks. It also conservatively limits the main local
alias branch and the later preferred-name restoration to one exact occurrence
in the unit and a matching exact name claim citing that unit. Existing
overlapping person links and unique same-occurrence disposition remaps are
preserved by separate earlier paths. A local unit-level claim plus a unique
display occurrence is still **inference**, not independent proof of the
referent; other existing reconciliation heuristics remain unexamined. The
prototype does not repair old classifications, enforce occurrence-level
semantics in validators, or provide a full conflict guard.

`ambiguity-v2.test.mjs` adapts the independent reviewer's examples to assert
that the two cases remain unresolved, tests explicit existing local link and
single locally evidenced name, and checks that a repeated same-unit spelling
is not automatically linked by the late restoration. `transfer.test.mjs`
retains the Jinshu 053 and exact-remap cases. Run the 21 targeted tests with:

```sh
PEOPLE_TRANSFER_PROTOTYPE=2 node --no-warnings --loader ./data/people/generated/jinshu-identity-ref-64521198-20261018/disposition-transfer-prototype-20261020/loader-v2.mjs --test data/people/generated/jinshu-identity-ref-64521198-20261018/disposition-transfer-prototype-20261020/ambiguity-v2.test.mjs data/people/generated/jinshu-identity-ref-64521198-20261018/disposition-transfer-prototype-20261020/transfer.test.mjs /tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/test-people-repair-name-collisions.mjs
```

All 21 passed in this isolated run. On the pinned 053 review-draft
reproduction, s0047's copied place disposition disappears and the existing
p001 mention accounts for it, while the unrelated unresolved total increases
from 3 baseline to 4 with v2. The p001 kind remains subject to semantic review.

## Blocking compatibility finding

The existing `apply-people-translation-repairs.mjs --self-test` fails with v2.
The first fixture now leaves
`fixture:001:cand_ceaf5aa2ff4e0293`, the second occurrence of `Liu Zhan` in
s0001, unresolved. Its existing expected behavior links two repaired
occurrences; v2's no-inference repeated-surface rule withholds the latter.
This may be a legitimate same-person recovery case and requires an explicit
reviewer-led policy/fixture design, not a blind test update. The less
restrictive intermediate v2 (before unique-local-claim restrictions) also
failed the later fragment fixture because `Gaozu` in s0009 was formerly
auto-linked from a name claim only in s0003—the unsafe global-name behavior
identified by the reviewer. The current version stops at the earlier fixture,
so there is no claim that later self-test checks pass.

Diagnostic command (TRACE modifies the fixture driver only in memory to print
the unresolved candidate; it must not be used as a passing test):

```sh
PEOPLE_TRANSFER_PROTOTYPE=2 PEOPLE_TRANSFER_TRACE=1 node --no-warnings --loader ./data/people/generated/jinshu-identity-ref-64521198-20261018/disposition-transfer-prototype-20261020/loader-v2.mjs /private/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/apply-people-translation-repairs.mjs --self-test
```

The deliberate behavior change can expose additional unresolved work. No
full corpus compatibility assessment, production validation, chapter-wide
semantic review, or build was performed. Preserve all reproduction evidence;
do not merge v2 or paper over its failing legacy test. A reviewer-led migration
must decide when precise source evidence is sufficient for repeated occurrences,
add appropriate reviewed fixtures, retain strict failure for unresolved cases,
and independently evaluate downstream impact before adoption.
