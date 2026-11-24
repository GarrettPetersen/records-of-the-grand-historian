# Jinshu 028 — Western-only unresolved closure

Independent verify: `2e1bd98819` (340/340 source-event changes supported; 0 source defects; 178 Western-only flags).

## Applied (exact 178 IDs)

For each `representationConstraints` id:
- keep `sourceDate`, `event`, evidence, and certainty semantics
- add native `qualitative` (no Western asserted)
- remove only `unresolved` / `unresolvedReason` (Western-conversion-only)

Certainty:
- keep `explicit-event-contextual-date` (55)
- close `uncertain` → `explicit` where the only asserted ambiguity was Western conversion (123)

Validator: `sourceQuotedQualitativeAttestation` accepts contextual certainty so those 55 rows remain source-only complete without forcing `explicit`.

## Preserved

- 547 prior supported checks (untouched packet supports)
- 79 editorial decisions
- 403 people / stable memberships
- 225 undated attestations
- production date-audits un-audited (no self-approval)
