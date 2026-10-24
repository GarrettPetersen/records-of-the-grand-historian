# Reconciliation ambiguity — research only, not approved for activation

The staging-derived reconciler copied same-surface non-person dispositions from
other sentences before examining the current occurrence; it also automatically
classified any English surface found among chapter-wide polity hints or era
names. These three operations can misclassify a personal name. A fingerprinted
real Jinshu 127 replay shows `jinshu:127:cand_b79e43b7adcb8ce4`, the second
English `Jin` in s0213 (Xun Jin), classified as `not-person`/`polity`.

The initial `reconciliation-ambiguity-prototype.patch` removes two unsafe
shortcuts but is **not safe for activation**. Independent review identified a
different fallthrough: after removing those shortcuts, a polity occurrence can
be linked to a uniquely matching person through chapter-global alias or
previous-unit matching. Correctness requires guarding against both false
non-person dispositions and false person links, with local evidence and
reviewable unresolved candidates where context is ambiguous. Existing accepted
links and legitimate same-unit evidence must be preserved.

Another chapter-wide shortcut, `knownReignPeriods`, is equally ambiguous. An
isolated regression with an era in one unit and a similarly named person in
another reproduces the failure. A local working copy tests restricting an era
disposition to the actual occurrence in an explicit `X era` or `in/of X year N`
expression; this is **not a complete fix** for the global-alias fallthrough.

Additional follow-up risks: candidate IDs hash only unit, language, exact text,
and occurrence. Consequently, retaining a disposition by an unchanged ID can
retain it after surrounding context changes. The cross-language counterpart and
other hard-coded heuristic branches also require source-context review. None of
these observations means an existing specific record is wrong without evidence.

The local existing self-test's `Jianwu` fixture specifies the end code point as
18 despite `Jianwu` spanning offsets 11 through 17. A local test-only copy
corrects that offset to 17 for the explicit local-era prototype. Neither this
fixture change nor any production code has been applied to staging.

All files here are isolated, incomplete research artifacts. No shared scripts,
canonical extraction, queue, locks, or Git index were changed. Do not publish
or treat the prototype or its passing narrow tests as independent approval.
