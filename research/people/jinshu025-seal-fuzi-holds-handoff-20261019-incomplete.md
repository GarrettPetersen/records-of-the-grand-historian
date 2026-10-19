# Jinshu 025: seal and Fu Zi research holds (incomplete)

The adjacent materializer reads the combined-cap candidate pinned by raw
SHA-256 `31d731f4029d9cc6e423111fff139a1be74d0398a773c19d0f83f9d3d89f2c99`
and creates a new research-only candidate, raw SHA-256
`3b00ea38f552ef71051ad97cc3e2bdea05d771b20131c017f1064b50105af429`.
It refuses to overwrite its output and does not touch canonical extraction,
retained date-workflow state, a claim, or a lock.

Two focused changes are made:

- p072's conditional BC 207 bound and matching activity hint are replaced by
  an unresolved date reason, preserving the quoted source, event, certainty
  and citation. The existing staging life summary otherwise presents that
  conditional bound without its qualification in the site and ebook.
- p051's sex claim supported only by s0444, which names a work rather than its
  author, is removed from this local candidate. This does not change separately
  sourced claims about the author in other chapters.

Independent conversation `/root/seal_review` confirmed the first change is
source-faithful, then checked that the materialized output has exactly these
two differences. The previously staged Fu Zi attribution review independently
supports removing the local sex assertion. The author ran the local compact
production validator with strict alias dispositions on this candidate using
the staged seal-conflict source: 607 units, 80 people, 173 mentions, 447
claims, 528 dispositions, and zero alias-disposition conflicts. The local
validator dependency graph was not proven identical to staging; this is not
a staging-code validation.

This is **not** an editorial, identity, or date approval and is not publishable.
In particular, p051 still contains a source-attestation event with an imported
lifespan and unresolved author attribution. See the staged independent Fu Zi
review and the earlier combined-cap handoff. The owner-controlled workflow
must resolve provenance and row type, integrate the reviewed material against
current source, validate with the production revision, obtain a fresh complete
independent date audit and identity review, and pass all publication gates.
Preserve all sticky ownership, sealed inputs and recovery artifacts.
