# Jinshu 025: combined candidate handoff (incomplete)

This combines previously retained work without modifying the sticky date
workflow or any canonical chapter or extraction. It is not approved for
publication or as a complete independent audit.

At staging revision `35bcdb2e607ebdda30520a3caa9c99798699da91`, the
seal-conflict candidate is the base. The two Cao Rui cap rows from the
separately reviewed cap candidate replace its claims 162 and 163. The
intermediate candidate raw SHA-256 is
`623c9c9595499fe1731e400aae48849103c4f390b057e1beebe2a6e150eff373`.
The adjacent reproducer pins both staged input byte hashes and writes only
to a new research path. An independent in-memory comparison confirmed those
two staged inputs reproduce the intermediate candidate exactly.

The final `jinshu025-combined-cap-hint-cleared-20261019-incomplete.json`
has raw SHA-256
`31d731f4029d9cc6e423111fff139a1be74d0398a773c19d0f83f9d3d89f2c99`
and compact JSON semantic SHA-256
`c0f6943447c74b9997f7bf671d9c195b069531da108f6f3cf6f1b25dfcdade0f`.
It differs from the intermediate only by clearing p052's active-date hint,
which otherwise asserted a reign-bound date while both source-specific
claims remain unresolved. This does not assert that the conventional reign
dates are false. The adjacent second reproducer pins the intermediate and
refuses to overwrite its output.

The author ran the local compact production validator against a fresh
packet from the pinned staged seal source; it passed. Its local dependency
graph was not shown identical to staging, so this is not a staging-code
validation. Independent conversation `/root/other_vertical` verified the
exact differences, hashes and source-conservative hint removal, but did
not independently rerun that validator or approve the complete candidate.

The cap rows deliberately replace the seal candidate's intervals with
unresolved date contexts; no date approval follows. Other holds include the
Fu Zi event's imported lifespan, the conditional BC 207 qualifier's person
summary rendering, additional chronology, independent identity review,
and full source/editorial/date/site/ebook verification. Further changes
invalidate fingerprints and require the normal fresh reviews. Preserve both
candidate lineages and the original worker's claim and retained artifacts.
