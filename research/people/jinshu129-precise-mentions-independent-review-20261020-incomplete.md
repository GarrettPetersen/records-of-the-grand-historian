# Independent review: Jinshu 129 precise mentions (incomplete)

This is a narrow research review, not approval to publish the chapter. The
reviewed generator has SHA-256
`4f5ae12c31ea3c410803ce4aa811355fa7f86af60e64899e2573f1b78b035d0c`;
the reviewed candidate JSON has SHA-256
`86ca0e189587e6c1fd86f99d11be8c9759da26c4e4309974c25632e229c92496`.
The exact held wrapper SHA-256 is
`3aeaf2fc42220e9beeca59388b778b8988db53542ac3ba49fba8e95e17024c26`;
the pinned stage is `fce861bb48533eeb388dc5573a60000f14167984`.

## Reproduction and exact changes

In a disposable scripts-and-evidence snapshot, the generator reproduced the
reviewed candidate byte-for-byte using pinned staging code. Independently
rebuilt packet plus `validateCompactPeopleExtraction` with
`strictAliasDispositions: true` passed: 266 units, 801 scanner candidates,
136 people, 773 mentions, 1,607 claims, 29 repairs and 347 dispositions.
The generator also ran `validateAppliedEditorialDecisions`; its success is not
an independent endorsement of the historical judgments.

Independent structured comparisons found source and retained editorial history
unchanged from the held wrapper; all extraction fields except surfaces and
dispositions were identical. Exactly two compact surface rows changed: s0183
p103 English was narrowed from `Zhu Lingshi, governor of Yi for the Eastern
Jin` to `Zhu Lingshi`, and the p103 Chinese row was narrowed from
`益州刺史硃齡石` to `硃齡石` for both s0183 and s0188. Unaffected compact
surface rows and all other disposition entries were preserved. The expanded
mention IDs for the changed rows remained m0617/m0618 and m0626 in this
candidate; downstream sealed artifacts still require their own freshness and
reference checks.

Exactly nine disposition entries changed:

- `cand_8dc4288346d219dc` and `cand_8a551c2a741c2b24`, English Yi in s0183
  and s0184: incorrect polity/Jin changed to place/Yi Province.
- `cand_28a3080bfce53a76` and `cand_ebe33751f3990fc7`, Chinese 益州 in
  s0183 and s0188: broad-span duplicate hints changed to place/Yi Province.
- `cand_d179139b595c2857` and `cand_4b2afa438eb15ac2`, Chinese 刺史 in
  s0183 and s0188: broad-span duplicate hints changed to office/regional
  inspector.
- `cand_77ec019e708a0171` and `cand_ea6519a039092626`, English Zhu Lingshi
  in s0183 and s0188: stale broad-span duplicate hints removed; each now has
  an exact p103 mention candidate reference in the same unit.
- `cand_d162756b159cff9a`, Chinese 軒轅 in s0222: the asterism disposition
  was removed; it is covered by the existing exact p122 personal-name mention.

The source supports these narrow changes. The rebuilt packet locates the
names at s0183 English [0,11), Chinese [5,8); s0188 English [12,23), Chinese
[6,9); and s0222 Chinese [5,7), all zero-based half-open Unicode code-point
offsets. The separate s0223 軒轅 is in a star context and remains a non-person
disposition. These checks do not establish native place, sex, diplomat role,
dates, or the identity of other people. No error introduced by the two surface
edits or nine listed disposition edits was identified in this focused review.

## Remaining inherited holds

The candidate is **not whole-chapter approved**. In s0223 the candidate
`cand_da9c82ef41334e05` (`Liu Yu` [46,52)) retains a duplicate-hint note
claiming containment in `Liu Yu, general of chariots and cavalry`, although
the same-unit p118 mention is the exact `Liu Yu` instead. A whole-chapter
string-presence diagnostic found 12 inherited duplicate-hint notes naming a
surface absent from their own unit: `cand_560fb004e59ac078`,
`cand_d79aa3be41ba8ee4`, `cand_b8d552029d048e7a`,
`cand_4e3f4a1d44f0e570`, `cand_03372e7265bd4926`,
`cand_b7ad6a3e2f16335f`, `cand_0eef7b493a029b90`,
`cand_fa732e36c743342d`, `cand_1d1a8aa69dfa6db8`,
`cand_d26850cd390147a1`, `cand_2ad774e489e164e6`, and
`cand_da9c82ef41334e05`. These notes predate the nine edits; the diagnostic
does not itself determine the correct disposition or identity for each one.

Also, s0223 `cand_4d49e48d91b5c24c` (`鎮星`) retains `not-person/deity` with
the note `Saturn/garrison star`; that inherited category merits a separate
source review because a planetary body is not automatically a deity. Do not
make an unreviewed replacement based solely on this diagnostic.

This review did not establish full source fidelity or audit every retained
disposition, claim, name, identity, translation, chronology, date packet, or
downstream artifact. Preserve historical inputs and normal independent
editorial/date/identity/validation/publication gates; a strict validator pass
alone does not settle semantic correctness.
