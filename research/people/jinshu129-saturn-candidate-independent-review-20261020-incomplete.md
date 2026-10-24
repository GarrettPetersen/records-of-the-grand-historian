# Jinshu 129 Saturn candidate: independent focused review

This review concerns one candidate disposition only. It is not a whole-chapter
editorial, extraction, chronology, identity or publication approval. Reviewer:
Codex conversation `/root/vertical_path`, independent of the candidate author
`/root/saturn_source`.

## Inputs and scope

- Staging revision: `4cf8c9af8e349709b7ac11f57e85c6d57a12933f`.
- Prior Hanping research wrapper SHA-256:
  `74e2d7077c164cdd9ba833dfaf1591f50dc94fe80e74f939c25f8e901dfd9c79`.
- Saturn candidate wrapper SHA-256:
  `507b0c22fb43f63401f29ad3684d49e26210e12f15e40cdaee6be4ecb4bcba89`.
- Candidate generator SHA-256:
  `2ae95e3e84f80f44388aeb6f33d25cd94907777d931b8fdbaf3522afb57355f9`.

The staged s0223 says `今鎮星在軒轅`, placing the star in an astronomical
asterism. Taiwan's Ministry of Education dictionary identifies
[鎮星 as an old name for Saturn](https://dict.revised.moe.edu.tw/dictView.jsp?ID=116857&la=0&powerMode=0).
The source supports treating this occurrence as a celestial body, rather than
a person or a deity in this context. It does not settle other uses or other
candidate dispositions.

## Independent checks

Compared the wrappers in memory: source and editorial history are deeply
equal. Removing the new `cand_4d49e48d91b5c24c` row from the `not-person/other`
group and reinserting its old `not-person/deity` row in its original position
restores the preceding compact extraction exactly. Thus this candidate changes
only the disposition and note for that candidate.

Rebuilt the packet from the candidate source using scripts, schema, glossary,
chronology, configuration and role vocabulary archived from the exact staging
revision. The rebuilt packet identifies the candidate uniquely as Chinese
`鎮星` in s0223, occurrence 0, code-point interval [1,3). Strict compact
validation succeeded for both the prior and candidate extraction, with 266
units, 801 scanner candidates, 136 people, 774 mentions, 1,607 claims, 29
repairs, 335 dispositions and zero alias-disposition conflicts. The applied
editorial-history validator also passed for the candidate. Expanded mentions,
claims and people, including their IDs, were deeply equal before and after.
The fixture used existing local Node dependencies and was removed after checking
that no process held it; dependency installation was not independently tested.

The proposal uses the schema-permitted `other` reason with a nonempty note.
The independent check did not execute the generator; it independently
verified the materialized result and inspected its transformation. The
underlying research wrapper remains unapproved for canonical publication and
has separate ID drift, reconciliation, source-review and downstream gate
requirements. No canonical input, lock, claim, shared Git state or build was
changed.
