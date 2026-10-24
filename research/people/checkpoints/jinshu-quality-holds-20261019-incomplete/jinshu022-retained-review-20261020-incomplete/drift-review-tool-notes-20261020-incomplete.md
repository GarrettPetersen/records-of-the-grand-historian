# Three-generation drift research tool (not a publication gate)

`node scripts/people-curation-drift-review.mjs RETAINED.json CURRENT.json CANDIDATE.json --claim-view`
produces all exact positional differences and an optional advisory comparison of
claim contents. The latter does not pair altered claims or assert identities.
Identical duplicate claims are ambiguous and can hide reordering. It does not
replace review of the complete positional inventory.

An optional `--verify REPORT.json --provenance AUTHORS.json` before `--claim-view`
checks report structure against the supplied snapshots and author names and
prints exact raw hashes of the report and author files. It cannot authenticate
either input, prove completeness of the supplied author list, recognize aliases,
or judge the evidence's truth. A structural pass is not independent review,
approval, or authorization to publish. The sorted-key semantic hash in this
research inventory is not the production document fingerprint.

Jinshu 022's actual claims are positional compact arrays, not stable claim IDs.
For one retained candidate comparison the advisory content view found 13 removed
and 12 added values and no unique-value reorder, while the unchanged raw
positional inventory contains 3,897 differences. Neither view establishes which
edits are correct. Preserve the prior retained generation and all review state;
the production three-generation provenance and publication path is not built.
