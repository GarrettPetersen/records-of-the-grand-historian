# Independent validation of the three-date-holds research candidate

This is a bounded artifact review, not a chapter or independent date-audit
approval, curation receipt, identity decision, or publication authorization.
The candidate remains incomplete and is not a substitute for any required gate.

I independently checked the materializer and saved output against the exact
input/output hashes in its manifest. The resulting candidate's SHA-256 is
`44406e5534b6a0e42ae3df7eba1741421e338ecf01d46cc8eac23053b92b93b5`.
The source and editorial-history files remain byte-for-byte identical to their
inputs. Reversing precisely compact claim rows 161, 162 and 195 and the two
person active-date hints p052 and p065 reproduces the entire original candidate;
claim 194 remains exactly unchanged and explicitly unresolved. SourceDate text
is unchanged in each repaired claim. The two new hints describe one reported
event each, not continuous activity.

Recomputed `repair` exactly equals the saved candidate. Altering each of the
three input byte streams independently was rejected by fingerprint checks.
Reinvoking the actual materializer against an existing destination failed with
its no-overwrite error and left the candidate hash unchanged. The original test
script's initial output-absent guard made rerunning it in place inappropriate;
the separate checker below exercised the applicable assertions without moving or
deleting any retained artifact.

Using scripts pinned through the staging loader at
`e02a499df802b8c0eaa8f5cf9f06397c397fad11` and schema/config data copied from
that revision into a small isolated temporary fixture, strict compact extraction
and applied-editorial validation passed: 607 units, 681 candidates, 80 people,
173 mentions, 448 claims, 528 dispositions, no alias-disposition conflicts.
The checked validation-related paths are unchanged between that revision and
the materializer's staging revision `709e2b641abb5347c177fb3a7dd9cf4a7e8c7184`.
The fixture was selected before importing the staging validators. The exact
independent check is `jinshu025-three-date-independent-check-20261019.mjs` and
was run with `jinshu025-s0544-editorial-current-staging-loader-20261019.mjs`.
This is not evidence about any newer staging revision.

The source basis and limits are separately recorded in
`jinshu025-caorui-caohongzhi-independent-review-20261019.md`: the AD 362–363
window is externally sourced for Cao Hongzhi's proposal, not an explicit year in
Jinshu; AD 226–239 is a Wei Mingdi reign-based possible event window, not a
precise dated cap reform. Claim 194's distinct imperial acceptance remains on
hold because the proposal's dated external witness does not expressly date that
agent's acceptance. No false day, rejection of a text variant, or later-reception
label is introduced by this materialization.
