# Unscanned review v6: export-only research checkpoint

`reconciliation-guard-303b4e0-review-v6-export-only.patch` SHA-256
`59fb81fc06486f1740a5d6c75b08cf2001837f9a862ca8a4990f8c798be253a9`
is based on `303b4e0fe883d4d305d84987b656322a91e5c3a4` and passed
`git apply --cached --check` against a separate temporary index at that commit.
The existing v4 and v5 patches are unchanged. None is deployed.

Unlike v5, v6 permits read-only packet export without requiring unrelated
historical missing agent IDs. It **always refuses review replay**: the
research CLI cannot authenticate a fresh Codex collaboration dispatch or
verify an untrusted JSON assertion of reviewer independence. The existing
Cursor SDK can return a newly created agent ID and run ID and retrieve a run
conversation, but no verified unscanned-review SDK adapter, host-controlled
receipt verifier or live end-to-end dispatch has been implemented. Do not
interpret a provider name, locally supplied reviewer ID or artifact hash
alone as proof of independent dispatch. See
`unscanned-review-independence-design-20261020-incomplete.md` for the intended
trust contract. Date and editorial gates are unchanged.

An isolated CLI export on the three pinned Jinshu 127 inputs from
`reconciliation-guard-v5-provenance-test-20261020-incomplete.md` produced
`jinshu127-unscanned-review-packet-v6-20261020-incomplete.json`, byte SHA-256
`b9f4985448cfde13e6206ae5a60d88db8ed592a1f123d199b753261837ae5b5c`.
Its packet fingerprint is
`582b9aa0fb62389ae94c7822001196a8ecb38dc10324b0be00a49ad15a5f129b`.
It contains exactly three source-witnessed surface **questions**, not reviewed
decisions: s0016 King Zhuang of Chu, s0205 Prince Jing of Chengyang, and s0232
King Wu of Zhou. Underlying extraction and source files remained unchanged.
All actual person/non-person identity decisions remain unmade and must be
independently reviewed against complete source context.

A CLI replay attempt using the packet itself as the review input failed with
`Unscanned review replay disabled: no trusted dispatch verifier is configured`;
it did not write canonical data. The name-collision, ambiguity and
editorial-rejection suites passed 34 tests, and the apply-repairs self-test
passed. Those tests do not establish complete detection of all missed names,
an authenticated review, safe decision replay, chapter completion or any
publication approval. Full replay remains a concrete unresolved blocker for
this prototype; do not infer that v6 has completed the requested mechanism.
