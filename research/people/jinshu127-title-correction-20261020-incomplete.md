# Jinshu 127 title correction — chapter still incomplete

The Chinese title and chapter metadata identify volume 127, but the English
and combined raw titles incorrectly said volume 12. The earlier independent
source review at
`research/people/checkpoints/jinshu127-closing-research-incomplete-20261019/jinshu127-title-s0177-independent-review-20261020-incomplete.md`
supports correcting both fields. No translation sentence was changed here.

Against staging revision `b04182eea79c16c95cb94ce75e499c007819899f`, the
only JSON changes are `meta.title.en` and `meta.title.raw`: `Volume 12` became
`Volume 127`. Before raw source SHA-256 was
`ae7e45ebf47268878ac456cacf2cca892b2abd080129f921015f13cdc9b1732a`;
after is `1b0ed1664bdf27f77ff5a9f1cb635d82e2dd9772f5ede7d3c18e0ed558b93f99`.

An independent check used that staging revision's scripts and reference data
in a temporary, subsequently removed snapshot. Old and new packets had the
same input, units, preflight and context; the displayed packet title changed.
The staged extraction strictly validated against the corrected source: 278
units, 817 candidates, 165 people, 686 mentions, 910 claims, 11 repairs,
479 dispositions and no alias conflicts. Old and new date source hashes were
both `sha256:48f235482a285d91bc99fb19f9e1ad0e602ed183d0dea305e756d084362fda2b`.
The existing local dependency installation was used rather than independently
recreated. The host also ran the scoped integrated people validator with the
local extraction and editorial decisions, which matched staging.

The retained date report is **needs-revision**, not an approval. Byte-pinned
source seals and title-dependent output must be checked and regenerated as
needed; unchanged unit hashes do not approve retained reviews. Preserve the
old research artifacts and review their lineage rather than rewriting them.
Full editorial coverage, fresh independent date audit, identity resolution,
and site/ebook publication checks remain. This correction does not make the
chapter complete or authorize a release.
