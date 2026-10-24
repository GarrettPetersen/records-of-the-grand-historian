# Reconciliation guard patch: independent review — not safe to stage

Reviewed patch `jinshu127-reconcile-isolated-20261019/reconciliation-guard-303b4e0-review.patch`,
byte SHA-256 `27d06076fc532c0e1d0164485bbd44834b110ab80d9a70212823d4bc2008395c`,
against staging commit `303b4e0fe883d4d305d84987b656322a91e5c3a4`. `git apply
--check` passed on a separately archived staging scripts/schema/config fixture.
For a stable exact-patch test I constructed `/tmp/jinshu127-guard-review.cnTMjxlC`
from that commit, applied the patch there only, and linked existing dependencies;
this is a small script/data fixture, not a checkout or corpus copy. Its patched
library SHA-256 is `0cf39c45eb6494638521689352c75bb877f6be2974b65c1bce6b1e4a03b1bc08`,
apply-script SHA-256 `87222e2dd30f0667f0edff6b040b58050d19eb0cee11c0daf88d5fcc7aefeb52`,
and patch-supplied test SHA-256 `0945c950e27e99fd149fbea57ec7de282778d5af30961a5561d5732abb8f512c`.

The originally supplied `/tmp/jinshu127-guard.QGaCJs` had the same two patched
implementation hashes, but its ambiguity-test file was independently changed
after this patch was recorded: its test SHA was
`1072a18feb157533372762b28f5b73fe8b6dd11ab6421d6d16ee9c3acdcdcbc6` at this
review. Do not attribute those additional live-fixture tests to the pinned patch.

## Blocking finding: same-unit name evidence can falsely resolve a polity

In the exact patch fixture, the unit-level synthetic test in
`jinshu127-guard-review-chinese-only-repro-20261020-incomplete.mjs`, SHA-256
`b6580be60031d50ac7b3a352a38b3089f6c4a2637629d75dfda8226c3506803d`,
uses Chinese `進居晉。` and English `He lived in Jin.`. The former contains a
person 進 and the polity 晉; English `Jin` is the latter. The input has a
reviewed Chinese-only mention for person 進 and a same-unit person-name claim
with English alias `Jin`; the sole English Jin scanner candidate is not yet
reviewed. The result contains `unresolvedCandidates: []` and a newly created
English personal-name mention of the polity `Jin` assigned to the person. The
assertion expecting unresolved fails, as intended. This is a function-level
synthetic fixture, not a claim that this exact sentence exists in the corpus.

This bypass does not require a second same-surface English occurrence: the
same-unit preferred/name claim path can infer a person from context merely
because some claim or mention for that person exists in the unit. The new
guard for another already-linked identical occurrence therefore does not
cover it. The late mention-growth path must also be considered when fixing
the issue; do not blindly remove legitimate already-reviewed name links.
The result can pass caller unresolved checks because the bad candidate is
reported as accounted for. Source review of each newly classified occurrence
is required; merely adding another global name/polity heuristic is not enough.

## Checks performed and limits

- Patch-supplied `node --test scripts/test-people-repair-ambiguity.mjs`: 12/12
  passed on the exact patch fixture. Its positive examples preserve prior
  unchanged dispositions and same-unit remapping; its negative examples cover
  global polymatches, same-unit *already linked* repeated surfaces, and era
  contexts, but not the Chinese-only same-unit case above.
- Exact-patch `node scripts/apply-people-translation-repairs.mjs --self-test`
  passed. The live fixture's additional collision tests also passed, but are not
  part of this patch's recorded bytes.
- The two production call sites in `scripts/apply-people-translation-repairs.mjs`
  test both `unresolvedSpans` and `unresolvedCandidates` before writing; the
  guard cannot be called fail-closed for this defect because it silently marks
  the false person link resolved. Other reconciliation heuristics, including
  cross-language same-glossary dispositions and automatic mention growth,
  remain source-dependent and warrant adversarial review. This limited review
  is not proof that all possible paths are safe.

Keep the patch unactivated and uncommitted pending correction, expanded
adversarial and positive-preservation tests, full caller review, and a fresh
independent review of the exact revised bytes. No canonical data, shared script,
queue, lock, branch, Git index or repository build was changed. After confirming
no process uses the independent temporary fixture, it can be removed through
the host's normal explicit cleanup procedure.
