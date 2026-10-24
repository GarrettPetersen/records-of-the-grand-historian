# Jinshu 022: selected retrospective classifications, incomplete

This is a research candidate, not an independently approved repair, date audit,
or chapter completion. `selected-receptions-candidate-incomplete.mjs` checks the
exact source, retained candidate and prior source-context preview byte hashes;
it changes only rows 3, 9, 11, 13, 15, 17, 23, 25, 26, 27, 29, 31 and 33 of the
41-row preview. All date fields, including date holds and `undatedSourceAttestation`,
are unchanged. The two prior independent row reviews support these categories,
not all other aspects of each claim. Person linkage and chronology still require
separate review; the selected candidate requires an independent whole-diff review.

The integrated chapter validator fails with 20 closed-vocabulary errors; date
diagnostics list 34 findings on 28 claims. This failure is intentional: no invalid
label is silently legitimized and the old sealed or canonical candidate is not
overwritten. The report contains exact before/after rows and full diagnostics.

Remaining issues needing source-backed review rather than blanket conversion:

- Row 1 (`claim-112`): Emperor Ming acts as a living officiant. Represent his
  sacrifice as an ordinary event and separately retain Guangwu's reception;
  a retrospective category for Ming is not supported.
- Rows 2, 4, 5 and 8 (`claim-121`, `305`, `306`, `332`): assess whether
  sacrificial/hymn wording actually establishes an honor or formal title;
  the text supports a reception context but not necessarily the title claim.
- Rows 6 and 7 (`claim-307`, `308`): examine whether cross-person references
  wrongly imply the two people are paired with each other rather than Heaven.
- Rows 10, 18, 19 and 21 (`claim-338`, `366`, `371`, `378`): review whether
  the phrase identifies the extracted individual, without assuming a generic
  ancestor or ritual invocation refers to a particular person.
- Rows 12, 14 and 16 (`claim-346`, `355`, `361`): although one row review found
  the dedicatee-reception category supported, the independent review of rows
  22 and 24 identifies the same risk of converting a hymn heading into a title
  or honor supposedly received. Check these `honor` claims against that
  distinction before altering them. Separate event rows remain represented.
- Rows 20, 22 and 24 (`claim-377`, `384`, `395`): the heading is not evidence
  of a received honor called “Temple Stair Hymn honoree.” Consider a supported
  work association or event, avoiding unsupported duplicate claims.
- Rows 28, 30, 32 and 34 (`claim-449`, `455`, `582`, `601`): classification is
  supported as later reception but Wei identities or descriptive ancestor
  identifications still require verification; these were conservatively held.
- Rows 35 and 37 (`claim-633`, `644`): the text attests hymn references, not a
  later title-holding action. Their companion event claims must be considered.
- Rows 36, 38 and 39 (`claim-639`, `650`, `660`): later references are supported,
  but their existing undated-source flags need source-context scrutiny. No flag
  or temporal context was changed here.
- Rows 40 and 41 (`claim-928`, `929`): a 266 commission does not by itself date
  the exact composition or performance, and cross-person links need review.

The separate false-person `p046` candidate and translation issue remain
unresolved in this candidate. Combine changes only through the ordinary
fingerprinted review workflow, then rerun extraction validation and a fresh
independent date audit before identity/publication gates.
