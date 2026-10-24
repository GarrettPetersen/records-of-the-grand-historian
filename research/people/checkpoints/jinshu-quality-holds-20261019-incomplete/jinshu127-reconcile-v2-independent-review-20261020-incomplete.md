# Independent review: reconciliation guard v2 (research only)

Verdict: do not activate v2 yet. It preserves the previous ambiguity examples in the focused tests but has an operationally blocking fail-closed case and a separate synthetic disposition-inheritance counterexample requiring further work.

Inputs: v2 patch SHA-256 `6188c4c86c3e96db7b152cd66551c4d46a909d725860a537804fba62fa36d002`; reconstructed against exact 303b4e0 script/schema fixture, resulting repair library SHA-256 `44017bc34cb0e604f93fc1ae9da557b41d14e76c8220d66e87ae4904977c3e48`. Temporary script-only fixture: `/tmp/jinshu127-v2-review.wlQRpaeX` (preserve while in use). The developer's shared `/tmp/jinshu127-guard.QGaCJs` drifted after v2: tests of its later contents are not v2 evidence.

Offline tests in the reconstructed fixture: `node --test scripts/test-people-repair-ambiguity.mjs scripts/test-people-repair-name-collisions.mjs` passed 24/24; `node scripts/apply-people-translation-repairs.mjs --self-test` passed. The tests exercise prior reviewed links, ambiguous separate occurrences, changed context, collision safeguards, and explicit assignments.

Operational blocker: for a preferred English name appearing in a relevant unit with no covering reviewed person span and no overlapping scanner candidate, v2 throws inside reconciliation before the explicit candidate-assignment/disposition path. This does fail closed, but an actual nonperson homonym has no candidate to disposition through that path; adding a person span would falsely assert identity. A source-reviewed, occurrence-specific nonperson resolution path is needed before activation, without silently weakening the guard.

Separate unit-synthetic concern: unchanged cross-language disposition inheritance can transfer a nonperson disposition through a shared glossary ID to multiple English occurrences, including a homonymous person. My earlier synthetic `晉` / `Jin entered Jin` candidate fixture demonstrated the underlying branch but was manually assigned detector IDs: the real matcher excludes single-character Chinese glossary entries, so this specific example is not scanner-reachable. Real-scanner reachability and input preconditions for the general issue were not independently demonstrated here. The subsequent developer change reportedly removes that transfer; it is not part of the v2 bytes reviewed here.

This note does not approve corpus materialization, chapter closure, publication, or any later patch. Preserve the existing reviewer-independence and validation gates.
