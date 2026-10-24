# Independent check: Jinshu 025 s0544 editorial component

Reviewer `/root/curation_path`, 2026-10-19 UTC. This assessment covers only the
two scoped editorial decisions and their in-memory replay. It is not a full
chapter, extraction authorship, identity, date, receipt, or publication
approval. No canonical files, Git index, claims, leases, or locks were changed.

## Exact inputs and provenance

The v3 component authored by `/root/edit_component` has byte SHA-256
`77d110578899232dada2cbafa77c27f54783ff8faa26fe69c9b2b3368f7b1c27`;
its paired compact applied rows have SHA-256
`03c4d042555f0cf8f8fd2e174bf9ce7d0ccaca029859e940d4eae9212aa79772`.
The original source at staging `e02a499df802b8c0eaa8f5cf9f06397c397fad11`
has byte SHA-256
`e53efc427e7a19c038d54ccf5f3253ce68bb5cb5c121b8bc9ab4e615f673ef60`;
the examined amended source has byte SHA-256
`2f1980cd20d124b450e4e1eecfa7319a610a5fbe0669851206442603eed43ab4`.
The retained partial candidate has byte SHA-256
`a67293ef781c9e7f30451c2a3d4398a7822f41e62c0cf8ae76070e2bc4a6a438`.
The staged original editorial history has byte SHA-256
`88e82fcdb8ec0dc191ba5cb79a1653f660711898514b1275d3a812bab555d1dc`.

The component identifies a different reviewer from the prior editorial proposal
and materializer. The preserved Grok Bot extraction run and chunks have null
agent IDs; null does not establish independence. The host must check preserved
operational ownership and all repair authors before accepting any full curation
review. I did not inspect a complete independent identity/date report.

## Replay and tests

I independently loaded the exact staged original source, located s0544 at
paragraph 161 sentence 3, verified the Chinese witness and both exact English
before values, matched each accepted decision to the corresponding compact
applied row including decision reason and confidence, and replayed the two
English fields in memory. The complete parsed result was deeply equal to the
saved amended source. An unrelated Chinese edit in an in-memory control was
detected by that whole-document comparison. This is a source-replay check, not
evidence of independent coverage of the other source units.

I reran the independently authored staging-pinned harness against e02a499. It
loaded staging JavaScript and a 16-file staging configuration fixture, validated
the component and merged editorial history, verified preservation of the prior
review, and passed applied-decision and strict extraction validation after
adding the two rows in memory. Statistics: 607 units, 681 scanner candidates,
80 people, 173 mentions, 448 claims, six repairs, 528 dispositions, and zero
alias-disposition conflicts. An in-memory changed-reason negative control was
rejected by the applied-editorial validator. The harness and the review used
the installed local Node dependencies; those dependencies were not independently
version-pinned here. Its small fixture was preserved; no checkout was created.

The component's chapter fingerprint equals the staged pre-amendment extraction
fingerprint, not the amended candidate fingerprint. Its source witness includes
the exact s0544 Chinese. Both decisions and the previous bounded adjudication
describe the account as reported, without adding an infant or a sash.

This remains a bounded editorial result. The candidate retains unresolved
chronology and needs full independent source/identity and date reviews on the
final hashes, curation receipt verification, and all publication and ebook gates.
