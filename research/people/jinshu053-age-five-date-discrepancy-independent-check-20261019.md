# Independent check: Jinshu 053 age-five date discrepancy

I checked `jinshu053-age-five-date-claim-discrepancy-20261019.md` against the
exact Git blobs in staging commit `e29dc9e5cdda6f73f9709ef0778af2b47d3e2a37`.
The three byte SHA-256 values in that note match those blobs. Source units
`s0006` and `s0007` say that Emperor Wu witnessed a palace fire and the crown
prince was five sui; those two units do not specify Western years.

Extraction claim 102 (array index 101) is a source-linked unresolved
attestation. Claim 110 (index 109) is a five-sui age claim for the same person
and phrase with an AD 266–290 `dateContext.westernInterval`. The date report
marks claim 102 `research-blocked` and claim 110 `supported`, with a generic
reason and no specific explanation of the interval endpoints. Its summary and
finding describe the identified childhood contexts as having no such interval,
but the finding's item list does not include claim 110. This independently
confirms the recorded-review discrepancy described in the original note.

This check does not establish that either endpoint is historically wrong or
that the interval asserts continuous activity. It does not approve a repair or
the chapter. Resolve the discrepancy against source evidence under the existing
owner-safe workflow, then obtain a fresh independent complete audit on the final
fingerprints; leave the current `research-blocked` status in force meanwhile.
