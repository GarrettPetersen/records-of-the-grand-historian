# Jinshu 025 claim-160 person-page render check — incomplete

This is a focused rendering check, not an editorial decision or date approval.
The retained `candidate-3.json` has byte SHA-256
`7753af40712ce48b855e7c798f571701716789c02dc0c48ae1d2e83691785981`.
Its compact claim-160 (zero-based index 159) is an explicit attestation citing
`s0444`; its value contains `undatedSourceAttestation: true` and event prose
`Fu Zi attributed to Fu Xuan; AD 217-AD 278 (outside-knowledge conversion)`.

The event prose survives the person-page value renderer: both the working-tree
renderer and the renderer at staging revision
`735a8a81ba286c938271a876196e169e3c140ee9` use `renderClaimValue` to render
nonempty non-ignored value fields using `renderClaimDetail`; `event` is not an
ignored field. Calling the local exported function with the actual compact
claim's predicate and value produced a visible `Event` detail containing the
entire lifespan string, alongside the undated-source flag. This is a conditional
rendering result, not a claim that the retained candidate is currently deployed
or that this particular claim will survive catalog compilation unchanged.

The independent review at staging
`research/people/checkpoints/jinshu-quality-holds-20261019-incomplete/jinshu025-cap-redesign-20261020-incomplete/independent-review.md`
notes that s0444 cites the work but does not date the author's life. The years
should not be represented as supported by that source; their independent
biographical truth was not evaluated here. Have an independent editor assess a
source-backed claim correction, preserve the existing sealed candidate and
date-review artifacts, and obtain a fresh date audit of the eventual corrected
candidate. This check changes no claim, source, approval, queue entry or lock.
