# Independent review: Jinshu 129 second Hanping mention

Focused research review by Codex `/root/jinshu129_target`, independent of
the candidate author. It is not full editorial, chronology, identity or
publication approval.

The reviewed generator SHA-256 is
`2fa938c8c639791cd82b6c631f2f52d166b7d4c5d9f45e6f5ca8c4ede40fd269`;
the reviewed candidate wrapper SHA-256 is
`74e2d7077c164cdd9ba833dfaf1591f50dc94fe80e74f939c25f8e901dfd9c79`;
the prior stale-hints wrapper SHA-256 is
`2947793437381e85fbe6274462dac158f7336d0c785fbe735d90e3aa7b9eb89b`.
The generator pins staging implementation
`8bfd06b65c815884cf91ba206d3617629e7569d0`.

## Source and exact delta

In s0195, `漢平長史焦昶、將軍段景密信招熾磐，熾磐復進攻漢平。`
first identifies Hanping through his chief clerk, then states that Chipan
again attacked Hanping. Both occurrences refer to that same named person in
the sentence; the already-linked English `Hanping` describes the second.
The existing p102 Chinese occurrence 0 is [0,2); adding occurrence 1 [22,24)
links the previously omitted second `漢平`. Offsets are zero-based half-open
Unicode code points. This does not establish any additional relationship,
date or cross-chapter identity.

An independent structured comparison confirmed that the source and editorial
history equal the preceding wrapper and the sole extraction difference is the
addition of occurrence `1` to p102's s0195 Chinese personal-name surface, whose
prior occurrence list was `[0]`. No other compact extraction value changes.
Expanded output keeps the first mention at m0649 and adds the second at
m0654. The former m0654 through m0773 shift to m0655 through m0774: 120
existing mention IDs change, even though their semantic mentions are retained.
Do not reuse ID-dependent sealed evidence or downstream links without
explicit fingerprint and reference reconciliation.

## Validation and boundaries

Reproduced the generator in an isolated snapshot of the exact stage scripts,
schemas and packet inputs: it emitted byte-for-byte the reviewed wrapper hash
and reported 120 shifted IDs. Its scoped strict compact validator and retained
applied editorial-history validation passed. This confirms structural and
history checks for the exact candidate, not a source review of all 774
mentions, 1,607 claims, or outstanding dispositions. Full independent date
audit, whole-chapter editorial review, identity resolution and downstream
publication checks remain open. The temporary fixture was removed; no
canonical source, claim, lock, shared Git state or prior artifact was changed.
