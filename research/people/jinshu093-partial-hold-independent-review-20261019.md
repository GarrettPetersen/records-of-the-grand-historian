# Independent review of Jinshu 093 partial research hold

Reviewer: `/root/chapter_completion`, separate from the candidate assembler
`/root/archive_next`. This review supports the *narrow research hold* below;
it is not an approval of the chronology, a complete chapter audit, a repair,
or permission to alter the shared queue or publish. No canonical file, Git
index, branch, claim, lease or lock was changed during this review.

## Pinned evidence and result

- Staging `11f25addfcdf94089b8aa6c02813ebbb96518f90` and queue
  `4aca09929f40d88b55271e75e780d6423d494b2c` matched the remote at inspection.
- Candidate `/tmp/jinshu093-hold.QWwCzyo9/candidate.json` has byte SHA-256
  `47a8b1b21982dcd8d58c0999948e6781c6c60027c00bdeb930ecc4893d00acb9`.
  It pins source `sha256:b83de35c67083750273b1c213e2f5a444ad342ddf9c7c7a640fd0705e9125bdc`
  and extraction `sha256:913a94949591224527014e5e594f9a7a10fb408dc0ea45f349e1959d4517cd1e`.
- The previous staged `audited` report has exact byte SHA-256
  `c269aad0cf926284689249fe390fc48c94879b3636a95634d2c8b2ed64999c30`.
  Preserve these bytes, not a reserialized equivalent, if a separately
  authorized and race-safe transition is eventually performed.
- Re-running the staged-code read-only packet/report validation passed:
  1 of 300 units, 2 of 171 people and 4 of 529 date items are checked. This
  validates schema and citations, not historical accuracy, independence,
  ownership, or chapter-wide coverage.

## Person, item, source and decision checks

The staged s0011 is `至若樊靡卿之父子，竇廣國之弟兄，陰興之守約戒奢，史丹之掩惡揚善，斯並后族之所美者也。` Every
one of the six candidate evidence excerpts is the exact contiguous substring
`樊靡卿之父子` in that unit. The phrase gives no Western year or endpoint.

The production date packet maps p001 to extracted “Fan Miqing” with hint
AD 25–51 and p002 to extracted “Father of Fan Miqing” with hint BC 6–AD 51.
Its `claim-3` is p001's derived s0011 attestation AD 25–51; `claim-8` is
p002's derived s0011 attestation BC 6–AD 51. `hints-p001` and `hints-p002`
match those respective hints. Thus the candidate identifies all four date
items and their owners correctly. Each is legitimately held for substantiation
of its endpoints; p002 additionally requires identification of the relationship.

In the old report, the two person checks and both hint checks quote s0001,
which names neither individual nor years. The `claim-3` and `claim-8`
checks quote s0011 and contain only a generic support rationale; the report has
no external references. This does not prove that either interval is false or
that the old reviewer did no additional work, but the recorded support is
insufficient to substantiate the claimed endpoints. The candidate's two
findings and requested further source and full-date review are proportional.

The separate staged cross-check `research/people/jinshu093-s0011-hold-independent-crosscheck-20261019.md`
identifies Hou Han shu 32 evidence for Hong and his father Zhong, and Hong and
his son Tiao. Hence the candidate correctly avoids declaring the extracted
father identity proven by the Jinshu phrase alone. Its wording does not rely
on the earlier draft's mistaken Hanshu 83 citation, corrected to 82 in the
staged addendum. This review does not settle courtesy-name or translation
repairs; those require their own normal review.

## Independence and limits

The candidate records `/root/archive_next`, distinct from this report reviewer
and from all six recorded extraction chunk agent IDs. The extraction's
top-level agent ID is null, while each of its six Grok chunk entries identifies
an agent. Distinct recorded identifiers support, but cannot by themselves
authenticate, actual conversational independence or exclude an unrecorded
contributor. The candidate explicitly states that report-level review was
pending at assembly; this separate review does not rewrite that historical
description or assert a complete independent date audit.

The earlier independent source cross-check did not itself authorize mutation,
and neither does this review. Host must separately verify current staging and
queue refs, live process and lease ownership, exact report/archive bytes and a
race-safe publication procedure. Preserve the previous report and recovery
artifacts. A research-blocked replacement cannot be counted as a completed or
date-approved chapter, and all remaining units/items remain unreviewed here.
