# Independent review of Jinshu 025 Fu Zi citation — incomplete

Scope: candidate-3 claim-160, person p051 and their cited source context. This
is not a complete editorial or date audit, not an application instruction, and
does not alter the retained candidate, approvals, or sticky ownership.

The byte SHA-256 of candidate-3 is
`7753af40712ce48b855e7c798f571701716789c02dc0c48ae1d2e83691785981`;
review-3 is
`31e45db21d6da52c14a98bf8f6b01c0aeb4936be8c1b784703db2d8dbcb54ae9`.
Local Jinshu 025 source bytes hash to
`e53efc427e7a19c038d54ccf5f3253ce68bb5cb5c121b8bc9ab4e615f673ef60`.

## Finding

The proposed event text — “The Fu Zi is quoted on Emperor Ming of Wei's
redesign of the high-mountain cap” — is a faithful description of the cited
unit and nearby context. Jinshu 025 s0439 introduces `高山`, s0442 discusses
the same cap, and s0444 reads `《傅子》曰：「魏明帝以其制似通天、遠遊，
故改令卑下。」` The passage identifies neither 217 nor 278, and does not
state when the book was quoted or when its author lived. Removing the
parenthetical imported lifespan from a claim presenting a source attestation
is warranted. The quote says the shape was made lower, not that the cap was
reserved for lower ranks.

Person linkage needs an explicit provenance distinction. Unit s0444 itself
names the work, not its author; it does not by itself prove that `傅玄` is
being named there, nor directly state a scholar/writer role. However, Jinshu
047 gives independent book-internal evidence for the attribution: s0059
identifies `玄` as a writer, and s0060 says of his writings `名為《傅子》`;
the biography names him `傅玄` in s0002. Its source JSON hash is
`77557d28b176fcac176822606e68f5fa3c01eeb3fee28fe6a93be927eb97b3ae`,
identical at inspected staging `735a8a81ba286c938271a876196e169e3c140ee9`
and master `26ebf8c830a43c3eb0a15e361c72436bd946c83e`. This supports a
contextually inferred linkage of the cited work to Fu Xuan, rather than an
explicit personal-name mention in s0444. It does not independently prove
which wording in the received quotation Fu Xuan personally wrote.

Candidate p051 labels the personal-name claim and scholar/writer roles
`explicit` on s0444 alone; those certainty labels and citations require
separate extraction/editorial review with cross-chapter source provenance.
Claim-161's authorship assertion is already `strongly-inferred` but should
be supported by the specific biography evidence, subject to the schema and
normal evidence checks. A title mention must not be silently converted into
an explicit person-name surface.

The proposed event wording describes **the history's citation of a work**,
not Fu Xuan's living participation in the quoted Wei emperor's redesign.
Whether claim-160 can remain an `undatedSourceAttestation` of p051, or should
instead be represented as an undated retrospective citation event alongside
the authored-work claim, is a schema/semantic question for the normal repair
and independent re-audit. The existing proposal alone does not establish that
the attestation is the correct type. Do not attach Cao Rui's reign years to
Fu Xuan's activity or infer his lifetime from the emperor's action. Preserve
the citation, author attribution and uncertainty even if the row is revised.

## Disposition

Support the wording as a descriptive correction in principle, but do not
apply it alone or count it as a complete fix. Resolve p051's source attribution,
certainty and row type in the owner-controlled workflow, revalidate the entire
candidate, and obtain a fresh independent complete date audit of the exact new
fingerprints. Full chapter editorial, identity and publication gates remain.
