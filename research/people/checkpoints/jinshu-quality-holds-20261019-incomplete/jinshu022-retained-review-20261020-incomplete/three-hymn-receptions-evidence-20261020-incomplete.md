# Jinshu 022: three hymn reception category repairs (incomplete)

Research only. The companion JSON pins the candidate and source by SHA-256,
includes full exact before and after rows, and permits only three two-field
substitutions. No canonical data, queue, locks, leases, or approvals were changed.
Require exact hash and before-row equality; never apply it to another generation.

## Evidence and interpretation

The sequence names ancestors and contrasts earlier rulers with the current
sovereign: s0420 `昔我三後，大業是維`; s0421 `今我聖皇，焜炔前暉`.
Within that sequence, s0426 `赫矣太祖，克廣明德` introduces Taizu and s0429
`創業垂統，兆我晉國` praises foundational activity; the first proposal preserves
all cited s0426–s0429. s0430 `烈文伯考，時維帝景` names Emperor Jing and
s0431 `夷險平亂，威而不猛` praises him; the second preserves s0430–s0433.
s0434 `猗歟盛歟！` and s0435 `先皇聖文` introduce the former ruler Wen and
s0436–s0440 praise him; the third preserves the entire s0434–s0440 citation.
These are later references in a hymn, so `retrospective-reference` with the
schema's `receptionType: retrospective` is a defensible narrow replacement.
They are distinct from the already removed unsupported `noble-title`/`held`
rows: a hymn's naming and praise is not proof of a title-holding event or
formal conferral of a new honor. `honoree` here is the unchanged role of the
hymn's praised subject, not an assertion that an honor was granted.

The code's explicit migration maps removed `posthumous-commemoration` to
`retrospective-reference` and `posthumous` to `retrospective`; the Chinese
evidence above supports this mapping for these three rows individually. This
does not justify blanket migration of other claims. Earlier independent review
`hymn-held-claims-independent-review-20261020-incomplete.md` reached the
same conditional result, numbering these rows 639, 650 and 660 in a different
candidate; those numbers must not be substituted for the pinned indexes here.

## Unresolved holds

The s0409 heading identifies the subsequent meal songs with 荀勖; s0290
commissions Fu Xuan, Xun Xu, and Zhang Hua to write ceremonial and meal songs
in Taishi 5, and s0293–s0294 describe subsequent Xun compositions. This context
does not by itself establish the exact composition or performance year of any
individual cited stanza. Preserve `undatedSourceAttestation` pending a fresh
independent audit of the whole sequence; do not count its presence as approved
or derive a living-person date from the later hymn. Separate source review must
assess any contextual bound and historical identity, including the speaker's
perspective behind `伯考` and the referents of 太祖 and 先皇聖文. The existing
family edges, personal dates and translation are outside the proposal.

The s0430 idiomatic translation's “thereafter named Emperor Jing” also merits
independent editorial review: `時維帝景` identifies the subject as Emperor
Jing, and the wording does not obviously narrate a later naming. Do not silently
change translation or claim text without the independent editorial process.
This report is not a chapter-wide date audit or publication approval.
