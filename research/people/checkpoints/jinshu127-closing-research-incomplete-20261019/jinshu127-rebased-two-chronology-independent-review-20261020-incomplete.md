# Jinshu 127: independent review of rebased two-change chronology candidate

Research only; not a full date audit, approval, or publication authorization. Reviewer `/root/jin127_two_review` independently checked the rebased candidate, the current validators, and its source lineage.

## Lineage and exact delta

All eight recorded input byte hashes and all four output hashes in the rebased receipt match the files independently read. The isolated chapter copy hashes to `74698e41243b3fb1554471574a6ba180c58c8a4872ffbe0e9e2bea1023d3dc3c`, exactly the later closing-materialized source. Compared with the earlier s0232 source snapshot, that source differs in exactly three English translation fields: s0277 idiomatic, and s0279 literal and idiomatic. s0232 and its Chinese source remain unchanged. The recorded history includes the earlier independent closing-review decisions and the current applied-history validator accepts the supplied candidate; this confirms consistency, not an independent full editorial audit.

The new pre-repair date packet identifies the same source-supported Gaozu row as `claim-335`, index 334, claim hash `sha256:f16bc8d9d799d7af1abc9a04c2d6233a9f91ae401bc329cabfe064279dd43619`. Fresh packet source fingerprint is `sha256:51d82f04c9fa23a29a319ca91fd529ecf8cdf9541a7ffedcc531c56e46c9e6a7`; pre-repair extraction fingerprint is `sha256:30fbad6cfe73eb53b9d5111ec6334e44c159217d3de9d7b7396dac76f5421e8e`; candidate extraction fingerprint is `sha256:5bee9b6a1821ed160d0f249fce07d2f85155a27034916c9a64c522cf55e36b31`. Independently rebuilding both packets reproduced these values.

Comparing the entire compact extraction against the later closing-materialized extraction as multisets, the only semantic changes are replacement of p141's source-unsupported dated attestation by the explicit undated tomb-sacrifice attestation and removal of p142's unsupported activity range. A separate recursive comparison of the **normalized** validated extractions found only those same fields changed. Only packet items `claim-335` and `hints-p142` changed; no item IDs were added. The previously proposed p139/p140 tomb-sacrifice and retrospective changes and p142 retrospective event are already present in this closing baseline and remain unchanged. The p141 activity hint `BC 206-195` also remains unchanged and **unapproved**, pending provenance and endpoint review.

## Validation and scope

The current checkout's `validateCompactPeopleExtraction` with strict alias dispositions passed: 278 units, 817 candidates, 165 people, 690 mentions, 916 claims, 16 repairs, 479 dispositions and zero alias conflicts. `validateAppliedEditorialDecisions` returned no errors. The specific historical source and caution concerning repeated sacrifices and Lord Xinling's activity are independently discussed in `jinshu127-two-chronology-independent-review-20261020-incomplete.md`; because s0232 is unchanged, those source findings apply to this narrow rebase. No invented reception type was introduced.

This candidate combines partial reviewed work but remains noncanonical. Final sealing, complete fresh independent date review, retained-hint investigation, identity resolution and publication gates remain necessary. No claims, locks, canonical files or shared Git state were altered in this review.
