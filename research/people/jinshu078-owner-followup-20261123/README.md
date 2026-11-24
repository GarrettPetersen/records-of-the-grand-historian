# Jinshu 078 owner repair (post independent review #5432)

Base candidate: `67e19fbddd4677db3744330d4919212887b94ea6` (PR #5425)  
Reviewer commit reused: `33066bbe439e94702c968d23e3859b453501fd5c` (draft #5432)

## Applied

1. Landed reviewer schema4 editorial decisions (`r0027`/`r0028` accept) onto the staging chapter branch.
2. Adjudicated intra-chapter duplicate locals against source; added reciprocal `same-person` links for 33 pairs (see `duplicate-local-adjudication.json`). Explicitly **did not** link `p002` Kong Wang (汪) with `p166` Tao Wang (汪).
3. Converted unsupported Western endpoints whose `sourceDate` lacks reign/year numerals into `unresolved` holds (see `unsupported-western-endpoint-changes.json`); updated matching `activeDateHints` to `research required: …`.
4. No evidenced family-attachment rewrite beyond continuity links; Ming-Emperor mistranslation already absent from chapter English.

## Not claimed

- No native date-audit seal (`data/people/date-audits/jinshu/078.json` not written).
- No canonical identity merge/certificate; lookup remains read-only evidence only.
- Reign-map gaps (`咸和初`, `隆和元年`, `太和中`, inherited `五年`, undated careers) remain research holds for the independent auditor.
