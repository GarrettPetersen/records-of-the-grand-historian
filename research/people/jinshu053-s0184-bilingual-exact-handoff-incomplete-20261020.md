# Jinshu 053 s0184: exact-field posthumous-title proposal

This is a noncanonical proposal for a future owner-safe editorial handoff,
not an applied repair, a completed editorial review, a date approval or a
chapter-completion claim. The inspected staging commit is
`89296b9f9da8683bcd807c78b0cf27f94d129865`. Its source blob byte SHA-256 is
`85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407`;
its extraction blob byte SHA-256 is
`464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69`.
The source is unchanged in the earlier reviewed 9d298a5 draft.

## Exact proposed fields

The Chinese is `太安初，追諡曰哀。`. In the preceding unit the grandson-heir
Zang is deposed and subsequently killed. The idiomatic `canonized` is a
misleading way to render a posthumous name, and its compressed wording can
make Ai seem to be the person rather than the name. The exact field changes
below reproduce the earlier authored proposal in
`jinshu053-additional-editorial-draft-20261019.md`, not a new independent
translation:

| Field | Exact before | Proposed after |
| --- | --- | --- |
| literal | `Early in Tai'an posthumous title Ai was granted.` | `Early in Tai'an, he was posthumously titled Ai.` |
| idiomatic | `Tai'an era canonized Ai.` | `Early in the Tai'an era, he received the posthumous title Ai.` |

The separate recorded reviewer `audit_053` provisionally supported s0184
among the enumerated rows in
`jinshu053-additional-independent-review-20261019.md`, subject to ordinary
exact-field and quotation checks; that source-scoped check did not approve
this compiled handoff, reviewer independence for production, the chapter or
unchanged surrounding text. The tracked v3 editorial-decision file contains
eight proposals and decisions, none for s0184; preserve it and its applied
repair history when constructing any later combined candidate. The present
proposal does not assert a specific award year or decide the separate
retrospective-chronology issue.

## Mention and publication impact

The compact extraction has exactly two s0184 surface rows: p068,
`posthumous-name`, Chinese `哀` occurrence 0; and p068,
`posthumous-name`, English `Ai` occurrence 0. There are no s0184 candidate
dispositions or pre-existing extraction translation-repair rows. In the
current idiomatic text, `Ai` is at Unicode code-point interval `[21,23)`;
in the proposed idiomatic text it is `[58,60)`. Chinese `哀` remains at
`[7,8)`. Occurrence-based compact surfaces should still identify the same
name, but changing the English sentence invalidates its packet/unit digest
and changes expanded span positions and text hashes. Run the production
reconciliation, fresh packet/scanner, extraction and editorial consistency
validators on the *whole final candidate*, check the resulting mention and
all candidate dispositions and backlink/snippet offsets, and independently
review their exact outputs. Do not merely change a hash or rely on these
manually computed offsets as validation. `scripts/lib/people-content.mjs`
uses the idiomatic English when present for the people packet; ensure actual
generated chapter, person and ebook output reflects the final approved text.

Changing source invalidates source-bound approvals. Preserve the original
research-blocked date report and review state, address the separate p068
retrospective finding in
`jinshu053-zang-posthumous-date-audit-discrepancy-20261020.md`, and obtain a
fresh complete independent date audit on the final candidate. The source and
extraction remain untouched by this note; no claim, lease, lock or recovery
artifact has been changed.
