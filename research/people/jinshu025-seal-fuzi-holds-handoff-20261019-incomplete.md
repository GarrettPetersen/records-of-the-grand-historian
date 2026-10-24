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

## Subsequent staging-code validation and focused editorial review

An independent run against staging revision
`1ac7a4d749f50ff2ded0f2d9e8dff5c8cd45e930` rebuilt the packet from the
retained seal-conflict research source (raw SHA-256
`02c4c78e636051d3e81397d696443984f3963ebaad881805befcc60a92c6be78`)
and passed strict compact validation of the candidate above: 607 units, 683
scanner candidates, 80 people, 173 mentions, 447 claims, eight repairs, 528
dispositions, and zero alias conflicts. The packet chapter fingerprint was
`sha256:fe835f616bfeab4944962cb93e35e6da785d484b5b45f211d862bb20ebc418da`.
The run used staging scripts and reference files in a 20 MiB temporary
snapshot, removed afterwards, and the existing local dependencies (Node
v23.7.0, ajv 8.20.0, ajv-formats 3.0.1). It did not independently reproduce
dependency installation. Importantly, this research source differs from the
staging canonical chapter, whose raw SHA-256 was
`e53efc427e7a19c038d54ccf5f3253ce68bb5cb5c121b8bc9ab4e615f673ef60`;
the result is not canonical-source validation or an approval.

For s0444, a separate focused editorial review agreed that `《傅子》` is a
work title: the existing `The Master Fu` and `Fu Xuan` introductions do not
faithfully represent what that sentence explicitly names. The reviewer found
the proposed `The Fu Zi says` introduction and `form` supported, and
recommended preserving 改 as `ordered it altered to be lower`. This is a
focused assessment, not an applied source correction or whole-chapter review.
Removing the idiomatic `Fu Xuan` wording would invalidate its personal-name
surface: reconcile mentions, name and authorship evidence and candidate
dispositions, regenerate fingerprints and obtain fresh reviews. Do not label
the title as a person's name or cite another chapter's unit as local evidence.
The focused review compared s0444 in both the retained source and the canonical
chapter, not every unit of those differing files.

This is **not** an editorial, identity, or date approval and is not publishable.
In particular, p051 still contains a source-attestation event with an imported
lifespan and unresolved author attribution. See the staged independent Fu Zi
review and the earlier combined-cap handoff. The owner-controlled workflow
must resolve provenance and row type, integrate the reviewed material against
current source, validate with the production revision, obtain a fresh complete
independent date audit and identity review, and pass all publication gates.
Preserve all sticky ownership, sealed inputs and recovery artifacts.
