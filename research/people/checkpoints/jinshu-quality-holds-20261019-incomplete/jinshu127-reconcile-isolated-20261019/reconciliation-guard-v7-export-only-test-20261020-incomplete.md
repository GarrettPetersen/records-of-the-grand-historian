# V7 unscanned-name export: review-only, not deployable

The v7 patch `reconciliation-guard-303b4e0-review-v7-export-only.patch`
is based on `303b4e0fe883d4d305d84987b656322a91e5c3a4`, SHA-256
`816b6ea25d85a09bbb5267bddca33827d8c1c7b54f29306bf7d0f40f32a0854b`, and
passed `git apply --cached --check` on an isolated temporary index. V6 is
unchanged. This is a research artifact, not a reviewed production patch.

An independent audit correctly identified that v6 could write canonical
extraction and packet files when `--unscanned-review-packet` found zero
occurrences. V7 rejects export combined with review/explicit candidate
decisions, requires `--reconcile-current`, and on zero occurrences fails
explicitly before any extraction or chapter/packet writes. Nonempty export
writes only the requested new output with exclusive creation; existing output
is not overwritten. The caller's data tree was hashed before/after in tests.
Review replay remains disabled pending a trusted dispatch verifier.

Another independent audit found v6 missed s0192 `Xiong`, a source-supported
alias of p109 Du Xiong, because v6 considered only preferred names. V7 also
collects exact English `name` claim values for a person in units with a
mention or claim for that person, asking for review rather than assigning a
link. This also surfaces pronoun-like strings without deciding that they are
names. It is still not a whole-chapter audit: people not locally contextualized,
unrecorded aliases, nonexact surfaces, and other extraction defects remain
outside this heuristic.

On the same exact pinned chapter/extraction as v6, isolated CLI export yielded
`jinshu127-unscanned-review-packet-v7-20261020-incomplete.json`, SHA-256
`3f1bd4db70ffc765b6d88347cb7039ffa68c8600ced06306dc19697264c5d004`, with
13 unreviewed questions including s0192 `Xiong`. These are questions, not
person links, approvals or a coverage claim; exact packet and source witnesses
must be independently reviewed.

The four focused offline suites passed 37 tests, including real-chapter mixed
export, synthetic zero-occurrence export, incompatible arguments and
no-overwrite checks. The CLI tests are deliberately restricted to the
fingerprinted isolated fixture using `JINSHU127_GUARD_TEST_FIXTURE_ROOT` and
must not run against the shared checkout. The broader existing
`apply-people-translation-repairs.mjs --self-test` **does not pass** under v7:
its synthetic fragment fixture now exposes two previously unreviewed
`Prince of Anping` name-claim occurrences in s0017 and s0024. Since replay is
deliberately disabled, that self-test requires a safe independently reviewed
fixture redesign or an authorized replay mechanism; this was not bypassed.
Independent patch review, complete source coverage, authenticated review
dispatch and replay, and all chapter/publication gates remain outstanding.
