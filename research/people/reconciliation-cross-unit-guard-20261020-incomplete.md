# Cross-unit disposition guard — incomplete safety work

The accompanying staging change stops copying a previous non-person
classification solely because a new candidate in a different passage has the
same language and spelling. The candidate remains unresolved unless existing
mention geometry accounts for it. This is a narrowly scoped improvement, not a
general approval of automatic reconciliation or of the Jinshu 129 candidate.

Two regression tests exercise an unresolved same-spelling candidate and a
same-unit existing person mention. Both fail on the preceding staging
implementation and pass with the guard. The existing repair self-test also
passes; the new tests are included in that command.

Independent review identified other inference paths that remain unchanged.
In particular, a same-ID disposition is retained when the wording around its
span changes: a reviewer reproduced `Saturn is a star.` becoming `Saturn led
troops.` with the old `not-person` disposition still retained and no unresolved
candidate. Same-unit span remapping, bilingual inference, and inferred or
widened mention geometry also require occurrence-specific scrutiny. No claim
is made here that all changes in those paths are incorrect.

Do not use this guard as authority to publish 129 or any other reconciliation.
Source-backed independent review of the complete delta, current fingerprint
validation, fresh date audit, identity decisions and publication gates remain
required. Preserve existing recovery state and the protected date-workflow lock.
