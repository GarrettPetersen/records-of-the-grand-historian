# Jinshu 025: scoped editorial review proposal (not approved)

Prepared for a separate classical-Chinese editorial and extraction reviewer.
This is not a production patch, date approval, full source review, or authority
to alter the retained workflow, canonical files, or claims. Work from staging
`c357dbed7c97a98f0a6f07858631610239cff70f`, retained source semantic hash
`sha256:203991b1b2be3d79f3922f8b95aa4118c8165d82eb0d8c11fb5c232c6ca79062`,
and candidate-3 byte SHA-256
`7753af40712ce48b855e7c798f571701716789c02dc0c48ae1d2e83691785981`.
Candidate-3 is a retained date candidate, not the canonical extraction. Check
all pins and the sticky owner before any actual materialization.

## Source translation: s0544

Chinese: `昔周公負成王，制此服衣，至今以為朝服。`

Current literal: “Formerly the Duke of Zhou carried King Cheng on his back,
making this robe; down to today it is taken as court dress.”

Current idiomatic: “Myth credits the Zhou regent’s baby-carrying sash for
today’s court pouch.”

Proposed idiomatic for review: “Long ago, the Duke of Zhou carried King Cheng
on his back and made this garment, which is still worn as court dress today.”

Rationale: preserve the reported action, garment, and court-dress continuity
without asserting the age of Cheng, a sash, a pouch, or a genre classification
not stated in this unit. Check surrounding context to determine the best
English referent for `此服衣`, whether the conjunction accurately represents
the relationship between the carrying and garment, and whether the literal
field also needs correction. The proposed wording is a candidate, not a
review verdict. The independent research review explicitly did not authorize
this replacement.

## Extraction: candidate-3, zero-based claim indices

- `claims[211]` (claim-212, p079): replace “King Cheng is named as the infant
  carried in the court-pouch etiology” with a source-faithful account that does
  not assert an infant; independently decide the exact event and evidentiary
  status, using the original Chinese and adjacent context.
- `claims[212]` (claim-213, p078/p079): independently decide whether the
  recorded action should be an undated reported action instead of a later
  `retrospective-reference`; do not simply assign the action a reception date.
  Remove unsupported “infant” in any supported revised wording. Do not infer
  either a precise Zhou year or actual historical certainty.
- `claims[161]` and `claims[162]` (claim-162/163, p052): neither s0444 nor
  the examined parallels establishes the current “reserved for lower ranks”
  claim. Independently choose a neutral description of the cap modification
  that does not presume whether `卑下` refers to physical height or relative
  status, or an exclusive restriction. The yearless issue remains open.

These are non-temporal event changes and must not be submitted as date-only
repairs. Review `research/people/jinshu025-zhougong-carrying-source-research-20261019.md`,
its independent review, and the corresponding `jinshu025-gaoshan-cap-*` files
at the pinned staging revision. The source notes review evidence, not these
proposed replacement strings.

## Required transition

The actual host workflow must retain the existing candidate, date-review
rounds, sticky ownership, claims, and lock state. After independent editorial
adjudication, materialize the accepted translation and extraction changes in
the documented combined-curation workflow; obtain a new independent, complete
source/identity review and complete date audit against the final source and
candidate hashes. Review all original extraction/chunk/repair authors for
reviewer independence. The Shi Hu collation supports a separate proposed
attributed 349 death interpretation but still requires reviewer adjudication
and explicit conflicting-witness treatment; it must not date the later seal
return. Other round-3 holds, including the Cheng assembly, Huiwen cap, sable,
seal origins and the yearless cap reform, remain; a partial fix is not chapter
approval. Consult `PEOPLE_COMBINED_CURATION.md` and `PEOPLE_DATE_AUDIT.md` for
the actual receipt, complete-coverage and publication gates.
