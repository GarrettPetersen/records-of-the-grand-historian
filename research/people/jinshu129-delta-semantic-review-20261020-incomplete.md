# Jinshu 129: independent semantic review of the candidate delta

Reviewer: Codex conversation `/root/review_129`, separate from the recorded
candidate and focused-review authors. This is a review of changed rows and
their recorded evidence, **not** a whole-chapter source, date, editorial,
identity, or publication approval. Staging inspected:
`932755964d0be6b63addd46cd35a471c5a7deeae`.

Inputs: staged source SHA-256
`bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800`;
staged extraction SHA-256
`91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8`;
staged editorial history SHA-256
`ff5170c7fefc5542092c0c7be0955f069c04bc60c642d52868e3fd2a5b3fe4e2`;
stacked Saturn candidate SHA-256
`507b0c22fb43f63401f29ad3684d49e26210e12f15e40cdaee6be4ecb4bcba89`;
structural inventory SHA-256
`e540a1ffd85adbb5a200239a7c319553388c2508878346c97e19667345422531`.
The inventory's separate independent review checked the expansion and mapping,
but expressly did not audit candidate ownership or source semantics.

## Changed rows and findings

- **Two idiomatic translations and their two applied-repair entries:** s0020
  `蒙遜引水灌城，城潰，執太守呂純以歸` supports diverting water to
  inundate the city and capturing Lü Chun, not breaching dikes. s0023
  `呂弘去張掖，將東走，業議欲擊之` states impending eastward flight and
  Ye's deliberation, not a council's proposal. The new wordings avoid those
  errors. The independent `/root/jinshu129_target` decisions and separately
  authored materialization recorded the same limited conclusions; this review
  does not independently approve the rest of either paragraph's translation.
- **Six old claim rows removed and four added:** the two explicit-sex claims
  lack explicit sex terms in their cited units, so their retraction is
  conservative, not a claim of contrary sex. The three Xijun-linked claims
  cite s0016–s0017 and s0019–s0020 and mark the connection inferential;
  s0020 supplies the capture and office, while the prior context identifies
  Xijun. The office's quoted title is narrowed to 太守. The revised Lü Hong
  event reflects impending flight and removes `commander`, which s0023 does
  not explicitly supply. The independent five-claim evidence review and the
  separately reviewed editorial decision cover these specific changes; no
  other retained date or historical claim is established thereby.
- **Surface and disposition changes:** in s0183 and s0188, 硃齡石 is the
  person, 益州 the place, and 刺史 the office. In s0184 益州 again supports
  Yi as a place, not a Jin polity. The narrowly changed p103 surfaces and
  associated six place/office disposition additions and relevant obsolete
  duplicate hints have separately documented source and exact-candidate
  checks. The corrected intermediate s0222 軒轅 remains the already-linked
  p122 ancestor, unlike the s0223 asterism; the erroneous intermediate
  disposition is absent from this final candidate. The twelve other stale
  duplicate hints removed from the final candidate have same-unit ownership
  and source-witness checks in the independent stale-hints review. The second
  s0195 漢平 is another occurrence of the person p102, supported by the
  sentence; the exact added occurrence was independently reproduced and
  reviewed. s0223 鎮星 is a celestial body in its astronomical context, and
  the separate Saturn candidate review supports the one changed disposition.
  These conclusions cover the identified changed candidates, not all 801
  scanner candidates or unscanned surfaces.
- **136 empty `identityHints` `e` arrays:** the staged compact expander only
  emits `externalPrimaryChronology` when `e` is nonempty. Empty arrays do not
  create chronology assertions. The independently checked expanded-people
  and matched-claim equality supports this as representation churn for these
  inputs, not new evidence of dates.
- **Fingerprints and editorial history:** the two source edits require new
  chapter/unit digests, and prior structural review checked exact packet
  expansion. The history is wrapped into schema-version 4 reviews, retaining
  the earlier recorded review and adding the targeted two-proposal review.
  Applied-history validation passed in the staged fixture. This validation
  matches reviewed claim content and evidence, not every downstream positional
  ID; it does not by itself repair stale IDs in saved dossiers or identity/date
  artifacts. The new and old reviews both contain an `r0028` identifier for
  different proposals; staged validation scopes decisions to each review, so
  consumers must not assume repair IDs are globally unique across review
  records. No failure of a particular downstream consumer is asserted here.

## Boundaries and still-open work

This synthesis relies on the independently checked structural inventory and
focused reviews for their detailed byte-for-byte comparisons; I inspected the
changed-row categories and key Chinese source passages, not all 136 people or
all 1,607 claims. The two automatic misdispositions previously found in the
intermediate materialization were separately corrected, but the known unsafe
automatic reconciliation mechanism remains a production hold; a structurally
valid final artifact is not a general proof that it can regenerate safely.
The 1,029 claim-ID shifts, 120 mention-ID shifts, and two unchanged mention
IDs with changed offsets and text hashes require fingerprint-aware downstream
handling. A source-backed full extraction/translation review, complete fresh
independent date audit, identity resolution, and verified site/ebook/publication
gates still remain. The reviews of older retained editorial decisions and
individual identity assertions were not redone in this delta review. Preserve
the original inputs and normal ownership/approval workflow.
