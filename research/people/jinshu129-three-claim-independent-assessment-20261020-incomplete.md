# Jinshu 129: independent assessment of three claim-evidence concerns

Incomplete source and workflow review, not a full editorial, identity or date
audit. Reviewed `jinshu129-three-claim-context-review-20261020-incomplete.md`
(SHA-256 `3ccf6ba69dedab742fb3348ae22634f09409a087b7e591c5c57068a58714e17b`)
against staging `e158abbcde3d51be36d1ccad384e42659f404722`. Its source and
extraction byte hashes were independently reproduced as
`bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800` and
`91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8`.
The normalized claims in the associated dossier were inspected separately from
their compact array indices.

## Conclusions

- **c0575 and c0578:** s0020 `執太守呂純以歸` and s0023 `呂弘去張掖，將東走`
  name the subjects but do not explicitly state sex. s0027 describes Hong
  defeating an army, without a sex term. The note's conclusion that the
  current single-sentence evidence does not support `explicit` is sound.
  This establishes neither that the subjects were not male nor that another
  source could not support the claim. Do not relabel the claims as strongly
  inferred solely on office, activity or translated English pronouns. A
  separate evidence repair may locate adequate support or retract the claims;
  neither action has yet been approved here.
- **c0660:** s0020 calls Lü Chun `太守`, but does not name Xijun. s0016
  orders an attack on `西郡`; s0017 refers to this commandery, s0019 sends
  Mengxun, and s0020 describes an attack on `城` and the capture of its
  governor. This supports a contextual association with Xijun, not the
  verbatim compound `西郡太守` as a quotation from s0020. A future reviewed
  candidate should at minimum cite the relevant context as well as s0020 and
  represent the connection's inferential character. Marking the combined
  office claim `strongly-inferred` is defensible if the reviewer accepts the
  narrative continuity, though the office itself remains directly stated;
  alternatively keep the cited direct office claim and leave the jurisdiction
  unasserted until a separately reviewed contextual assertion is possible.
  These are candidate remedies, not an approved exact edit. Check other
  contextually assigned place claims as well.

## Editorial decision contract

The two proposed English edits concern invented dikes and attribution of a
deliberation to a council; neither changes the subject's sex nor the office's
jurisdiction. The editorial prompt permits retractions for claims created
solely by a bad translation and revisions where the accepted repair requires
changes to a still-valid underlying fact. Their proximity to the repaired
units and machine validation alone do not establish this semantic causal link.
Do not append these three changes to the existing two-repair decision as if
they resulted from either English correction.

Moreover, the staged `scripts/lib/people-editorial-decisions.mjs` rejects an
editorial claim revision that adds evidence: evidence must remain unchanged or
remove only the repaired unit while leaving at least one other citation.
Consequently a c0660 revision that adds s0016 cannot be expressed by that
decision mechanism. The schema's allowable certainty values do not imply that
the source justifies a particular value. Use a separate, source-reviewed
extraction evidence-repair route preserving prior editorial history, with an
independent review of the exact resulting candidate and fresh scoped
validation; do not bypass the editorial contract or manipulate its existing
approval. Date and identity work must be reconciled against the final exact
fingerprints.

No canonical file, lock, claim, retained artifact, shared Git state, or build
was changed by this assessment.
