# Jinshu 072: unresolved date-review evidence

This is a source-review finding, not an extraction, audit approval, or a
completed-chapter claim. The checked staging source and extraction are those at
`817645b03b1dc24133abaf4da2893ea5490ce928`; their byte SHA-256 hashes are
`a9cca77dbd71eae458620f8973aaa2f98b1a55cdfa876dae97346f291e4d3f15` and
`8f67c9044116ce265d944c6854d67649f8423da900cfb6c98e8f8ee07875cb67`.
The currently staged `audited` report has byte SHA-256
`d81f2cee5979e59a9b9c2e7d0c63f283d5eece1671403364120c216bd998bce5`.

Two independent source reviewers found that the report's `hints-p002` and
person check for Guo Yuan cite only `郭璞` in s0002: the name of his son,
Guo Pu, not evidence for Guo Yuan's AD 270–285 active-date hint. Its claim-59
check cites s0005, which describes an interaction involving Guo Yuan and Du Yu
but states neither endpoint, and the report supplies no external references.
The source gives biographical context in s0004–s0006; the range requires its
own dated evidence. This is a defect in the recorded approval evidence, **not**
proof that the historical dates are false.

Do not rely on this report as a substantively verified whole-chapter audit.
Research the endpoints and conduct a fresh independent complete review of the
current exact source and extraction. Two distinct reviewer conversations
checked the source and a partial `needs-revision` draft; both the old and draft
reports also passed the pinned structural validator, which does not establish
that cited evidence supports an audit conclusion.

## Preserve the existing owner and recovery work

At queue revision `4aca09929f40d88b55271e75e780d6423d494b2c`, an existing
`openrouter-local-dates` reservation for this chapter is active with eight
interrupted jobs. The retained workflow may later assemble those jobs and
replace the current report without incorporating a newly recorded finding.
Before recording a replacement or resuming that worker, recheck live ownership
and coordinate this finding through a tested, supported handoff that preserves
the sticky claim, lease, job artifacts, review independence and packet
fingerprints. Do not delete a lock or take over the claim. An absence of a
local process is not evidence that another host is stopped.
