# Retained Jinshu curation evidence at staging 729b0ab0

**Read-only investigation; no chapter is certified complete.** The Git tree
examined is `729b0ab0d4f84781b168cba48f4c0d4d5ea0c08c`. Hashes below are
independently calculated from its Git blobs. A byte hash is SHA-256 of the
file; a semantic extraction hash is `sha256(JSON.stringify(parsedExtraction))`.
Source semantic hashes use the production `contentUnits` date-packet fields.

## Combined versus date-only receipts

`git ls-tree -r` of the staging tree's `data/people/combined-curations` finds
**one** tracked combined receipt, for Shiji 064, and none for Jinshu. This is a
bounded statement about that Git directory, not proof that no untracked or
externally retained Jinshu curation evidence exists. The Shiji receipt's
`kind` is `reviewed-combined-source-identity-date-curation`, with embedded
source, extraction, editorial, materialization, identity, date-report,
validation and seal inputs. A prior staged investigation found its identity/date
inputs no longer bind the current Shiji extraction; it cannot establish a
current Jinshu chapter's eligibility.

Jinshu 053 instead has a distinct tracked **date-only** curation receipt at
`data/people/date-repairs/jinshu/053/233532d91fbfb2ecd9294a4e56ea6b25f86fe2f164ca9951fee5bdcbf98a3be9.curation.json`.
It identifies four chronology edits and explicitly requires a *fresh*
independent canonical date audit. The accompanying candidate review identifies
`review_jinshu053`, asserts independence and accepts only host curation; its
expected later audit state is `research-blocked`, not approval. Its author
fields are assertions; I did not obtain or verify the original reviewer
conversation/provider record.

For the actual 053 staging files, source byte SHA-256 is
`85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407`,
extraction byte SHA-256 is
`464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69`,
and date report byte SHA-256 is
`d3bb12dbc7db670357affb2e216790baffb359db62ce78478ff3d37c1ba93073`.
The curation receipt's candidate semantic extraction hash
`sha256:a23f128f1371dc93275fa0f54af14e3d5952530b3e0e57975ccded564208c3b9`
matches the staging extraction; the later date report's source and extraction
hashes match the current semantic source
`sha256:fab0a59c5d375ac889d03e7530b083fed82c11b4521823e1330e8840637b84f1`
and that extraction. It reports all 209 units, 71 people, and 188 date items
but has one finding and status **research-blocked**. This evidence is useful
recovery and a reason not to publish as date-approved; it is not approval.

The separately retained
`jinshu053-combined-independent-review-20261020.md` concerns a partial
editorial *research candidate*, not a combined-curation publication receipt.
It explicitly rejects that candidate for publication and notes null reviewer
identity and unresolved semantic defects. Other research-candidate receipts
must not be substituted for current canonical evidence merely because their
names include `combined`.

## Concrete nearby cases

- **025:** staging source byte hash
  `e53efc427e7a19c038d54ccf5f3253ce68bb5cb5c121b8bc9ab4e615f673ef60`,
  extraction semantic hash
  `sha256:93662fe449b822d048dada0594021eaf539e1d3c912a32e5fc4f8897f264a576`;
  there is no staging `data/people/date-audits/jinshu/025.json`. Its editorial
  decisions record a Cursor agent ID and run ID, but the extraction's nine
  chunk `agentId` fields are null. The saved editorial independent adjudication
  covers two passages and explicitly disclaims whole-chapter approval. A
  distinct reviewed date audit, complete editorial provenance/coverage and
  identity evidence are not demonstrated.
- **093:** staging source byte hash
  `8625c06da214d53adfc71c4969a6e5a2766db30b29b73dc0e2ee23ff8a77626c`,
  extraction semantic hash
  `sha256:913a94949591224527014e5e594f9a7a10fb408dc0ea45f349e1959d4517cd1e`,
  date report byte hash
  `c269aad0cf926284689249fe390fc48c94879b3636a95634d2c8b2ed64999c30`.
  The report says `audited` and its source/extraction semantic hashes match
  current staging, but its reviewer has no agent ID. More importantly, the
  tracked independently reviewed five-hold assessment identifies an approval
  whose cited passage does not establish the target person/date; it does not
  prove the year false. Until safe preservation, hold recording, repair if
  needed and fresh independent full audit, this is not trustworthy release
  evidence. The editorial review has agent/run IDs distinct from recorded
  extraction chunk IDs, but the provider conversations were not verified here,
  and repair-window review is not whole-chapter editorial approval.
- **101 and 127:** staging reports respectively `research-blocked` and
  `needs-revision`, with source/extraction semantic fingerprints matching
  their current staging inputs. Their editorial records have null `agentId`
  and `runId`. These explicit statuses alone rule out date approval; no claim
  is made that null identifiers prove a reviewer was not actually independent.

## What existing contracts do and do not prove

`PEOPLE_COMBINED_CURATION.md` requires retained authors, independent review,
source and extraction pins, and fresh full source/identity and date approval.
At this commit, `validateCombinedReviews` checks those hashes, all listed
authors' and reviewers' nonmatching agent IDs and declarations, production
date-report validation, and exhaustive source-unit/person/name/family/mention/
scanner ownership checks; it matches incoming editorial approvals to applied
repairs. This is valuable concrete evidence **if a real current receipt and
independent review can be verified**. The implemented ID comparisons and
`independentOf...` booleans are not, by themselves, authenticated proof that
two genuinely separate conversations existed. The combined source/identity
review is also not a full cross-corpus identity decision for every relevant
homonym, and proposal-based editorial decisions do not themselves certify a
full independent editorial reading of every source unit.

No current eligible Jinshu chapter was demonstrated by this bounded inspection.
The practical next step is to preserve and complete a real chapter's existing
repair work; recover actual reviewer/provider transcripts or dispatch separate
reviewers with host-recorded identity and retained packet/report hashes; run a
fresh independent complete audit after repairs; and validate relevant
cross-corpus identity decisions against the current compared extractions. Do
not manufacture approvals, convert findings into completion, or modify live
claims/leases. Such evidence can feed the proposed fail-closed publication
projection, but a missing combined receipt is not itself proof a chapter could
never qualify through another independently verifiable workflow.
