# Jinshu 025 s0444: Fu Zi citation event proposal — incomplete

This is a proposed editorial clarification, not an applied change, complete
review, or date approval. The retained candidate and review remain untouched.
It requires an independent reviewer to inspect the source context, the person
identity, the claim's existing undated classification and the exact wording.

## Pinned evidence

- Retained candidate-3 byte SHA-256:
  `7753af40712ce48b855e7c798f571701716789c02dc0c48ae1d2e83691785981`.
- Retained review-3 byte SHA-256:
  `31e45db21d6da52c14a98bf8f6b01c0aeb4936be8c1b784703db2d8dbcb54ae9`.
- Chinese s0444: `《傅子》曰：「魏明帝以其制似通天、遠遊，故改令卑下。」`
- Candidate claim-160 is an attestation of p051 marked
  `undatedSourceAttestation: true`; its event says `Fu Zi attributed to Fu
  Xuan; AD 217-AD 278 (outside-knowledge conversion)`. Review-3 supports an
  undated authorship citation but explicitly says the years are imported
  biography, not dates supplied by this passage or a date for the citation.
- The host has inspected `renderClaimValue`/`renderClaimDetail` in
  `scripts/generate-people-pages.mjs` and found the event detail can be
  rendered as a fact. If published, the current wording can therefore place
  imported lifespan years inside a purported source attestation.

## Proposed narrow replacement for independent adjudication

Replace only claim-160's event string with:

> The Fu Zi is quoted on Emperor Ming of Wei's redesign of the high-mountain cap.

The wording describes the citation and does not assert a lifespan or event
date. It does not resolve whether the p051 identity, its strongly inferred
authorship claim, or the `undatedSourceAttestation` classification is fully
supported in context; assess those separately. Do not infer that Fu Xuan was
alive at the time of Cao Rui's event or substitute a reign window. Inspect
also the explicit name and scholar/writer claims for p051 citing only s0444:
the unit itself quotes the title `傅子`, not the characters `傅玄` or an
explicit office. This note does not decide those separate claims.

After any accepted editorial changes, preserve the original evidence, build a
new extraction fingerprint, and obtain a fresh independent complete date audit
and all remaining identity/publication gates. The 162–163 research candidate is
separate and still retains this unchanged claim-160 issue.
