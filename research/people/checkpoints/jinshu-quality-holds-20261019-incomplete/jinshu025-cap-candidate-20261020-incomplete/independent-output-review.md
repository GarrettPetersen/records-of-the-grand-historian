# Jinshu 025 cap candidate: independent exact-output review

This is a focused review of the retained candidate, not a whole-chapter
editorial or date approval and not authorization to publish. The canonical
source and extraction, sealed review inputs, queue and workflow state were not
modified.

## Inputs and exact differences

- Original retained `candidate-3.json` byte SHA-256:
  `7753af40712ce48b855e7c798f571701716789c02dc0c48ae1d2e83691785981`.
- Retained `review-3.json` byte SHA-256:
  `31e45db21d6da52c14a98bf8f6b01c0aeb4936be8c1b784703db2d8dbcb54ae9`.
- Proposed `candidate.json` byte SHA-256:
  `af559fad13a77399c75070553907c4d074c1a6f6d7434d710b0c9777907d6a5d`.
- Retained `date-packet.json` byte SHA-256:
  `a104badd23bfe01a5e20959da3bc0a80a38ba032c694b9f41463002e5b22c9ac`.

A recursive comparison of the entire parsed original and candidate found
exactly four changed leaf values: compact paths `/claims/161/2/event`,
`/claims/161/2/unresolvedReason`, `/claims/162/2/action`, and
`/claims/162/2/dateContext/unresolvedReason`. All four replacement strings
exactly match the separate focused editorial review checkpointed at
`240fd204:research/people/checkpoints/jinshu-quality-holds-20261019-incomplete/jinshu025-cap-redesign-20261020-incomplete/independent-review.md`.
No other parsed values, including evidence, subject, temporal values and
`unresolved: true`, changed.

I independently inspected the Chinese source s0444, which attributes to
Fuzi the statement `魏明帝以其制似通天、遠遊，故改令卑下`. The source
describes making the cap lower because of its form; it does not say the cap was
reserved for lower ranks. The event and action replacements correct that
distinction without claiming a calendar year.

## Read-only validation rerun

Using the current checkout's production compact-extraction validator against a
freshly rebuilt Jinshu 025 extraction packet passed: 607 source units, 681
candidates, 80 people, 171 mentions, 448 claims, four translation repairs, 531
dispositions and zero alias-disposition conflicts. The existing applied
editorial-decision consistency validator passed against the expanded candidate;
this checks consistency of existing decisions, not independent approval of the
new claim corrections.

Rebuilding the date packet directly from the proposed candidate gave source
fingerprint `sha256:203991b1b2be3d79f3922f8b95aa4118c8165d82eb0d8c11fb5c232c6ca79062`
and candidate fingerprint
`sha256:d98c3efab72f8fb31e1dd17458d1c0d14ba139da7c8bd0d308b6061f548b806f`.
The freshly constructed packet was JSON-identical to the saved date packet;
the temporal-geometry diagnostics returned no findings. This diagnostic does
not establish historical accuracy or resolve any research holds.

Review-3 binds the previous candidate fingerprint and has status
`needs-revision`; it is not transferable to this candidate. The separate
claim-160 imported-lifespan concern remains uncorrected. Use the permitted
editorial workflow, resolve outstanding holds, and obtain a fresh complete
independent audit on the final source and extraction fingerprints before any
identity/publication gates are counted.
