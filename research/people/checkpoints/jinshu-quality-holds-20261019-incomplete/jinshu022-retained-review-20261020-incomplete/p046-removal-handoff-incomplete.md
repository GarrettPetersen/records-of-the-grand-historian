# Jinshu 022 p046 removal: isolated candidate, not approved

The separate `p046-removal-candidate-incomplete.json` (SHA-256
`2c385031aa005500fc2721c075738b403d2bd8f1f9096cbe5e9a2aa6a4e17713`)
was generated from the fingerprint-pinned retained candidate and unchanged
source by `p046-isolated-removal-incomplete.mjs`. This executes the actual
`removePeople` implementation from `scripts/remove-false-people.mjs` without
calling that script's canonical-path writer. Its source hash, input hashes,
new semantic fingerprint, full validator errors and new dispositions are in
`p046-removal-diagnostics-incomplete.json`.

The reviewed correction removes one false person and two mentions. Six
compact claim rows disappear; the host algorithm reports nine expanded claims
because it also expands person-level name and role evidence into claims. Two
previously covered candidates are disposed as `not-person` / `not-a-name`.
All other people, compact claim rows, inputs, repairs and coverage are unchanged
in a direct JSON comparison. Other surface rows have the same multiset but are
reordered by compact serialization.

The actual scoped validator **fails** on 22 pre-existing invalid compact
`receptionType` values. Independent date diagnostics report **48 vocabulary
errors across 41 claim IDs**, reproduced in
`p046-removal-date-diagnostics-incomplete.json`. These issues are not repaired
or approved here. Search of local `data/people/resolutions` and
`data/people/resolution-dossiers`, and `git grep` against those staging paths
at `fb6643aabbf8138ba8d1f7ac2b291140f5fbcfcf`, found no exact
`jinshu:022:p046` reference. This is a scoped reference check, not approval of
the complete identity graph.

The source translation remains unchanged and the first clause remains under
philological review. No date holds, source, sealed candidate, canonical
extraction, identity decisions, ledger or locks were altered. The isolated
candidate does not qualify as accepted extraction, date audit, or chapter
completion. Coordinate any eventual source repair, reconcile all remaining
claims and dispositions, rebuild fingerprint-bound packets and obtain fresh
independent reviews before publication.
