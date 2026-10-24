# Independent review: held Jinshu 127 s0107–s0108 person candidate

Research-only; no chapter or publication approval. Candidate SHA-256 `f3d1b90dc2811e10dfad1cb53c11f942418f69253c045a4e3b01761a8581cee2`; immediate baseline `1d0aef11596fac9ca663d26e9835946908613249a89a57cf8986f71523a89008`; held source `ca683ed09f79724fe107185f6f1e5f5ded2378999ea887ce910432eb127dd3b3`; packet `cd6ab556fb0b323f639d2cf46013312e78a8868379cf053f1678f40c013b4701`; applied editorial history `093ceb5a45d1be3500d1449ebdfbd4d304081049fd11e7257a50d1d93b26917e`.

## Source and precise changes

Exact compact diff adds two p045 s0108 personal-name surfaces and removes exactly five dispositions; there are no other changes. Chinese `敗德將慕容鐘` supports ruler Murong De as the possessor of general Murong Zhong. p045 is locally named Murong De / 慕容德, and s0107 already refers to him in `降於德`. The new English `Murong De` [125,134) and Chinese `德` [23,24) correctly identify p045 and do not overlap other person mentions in their respective languages. The English expansion includes both contained scanner refs `cand_b530729a14f76854` (`Murong De`) and `cand_02090274dda293f5` (`Murong`). English text hash is `sha256:85a6109b343be85c630b2dc38a5d33b9c315a2682ab331763cd13e1a6faf0738`; Chinese hash is `sha256:2c06d9e57ab9030501d4afb77646b2daad18ab30f9f2f8927dc7d973e274e232`.

The five removals are source-supported and re-accounted by person mentions on expansion:

1. s0107 English `Yao Xing` `cand_38c6336f4cb5a5cf` → existing p061 English name [21,29).
2. s0107 Chinese `姚興` `cand_28c47123ed6058ae` → existing p061 Chinese name [6,8). Source `苻登既為姚興所滅` identifies a named actor, not a non-person.
3. s0107 English `Murong De` `cand_49d97e68499a403e` → existing p045 English name [85,94); source `降於德` and unit context support it.
4. s0108 English `Murong De` `cand_b530729a14f76854` → the added p045 English mention [125,134).
5. s0108 English `Murong` `cand_02090274dda293f5` → same added p045 mention; it is the contained surname component [125,131), not a separate unlinked name.

These are chapter-local identities, not authorization for any global identity merge.

## Remaining adjacent accounting issue

Two other scanner hints in s0108 remain `not-person/not-a-name`: English `Murong` `cand_71da6880db5fe590` [145,151) and Chinese `慕容` `cand_636938f67048576c` [25,27). They are contained by existing p044 person mentions `Murong Zhong` [145,157) and `慕容鐘` [25,28), respectively. The project preflight rule accounts a contained candidate as a person-mention candidateRef; these remaining dispositions warrant separate source review and reconciliation. This candidate does not address them. The separate title question `King of Qin` and related office/polity scanner dispositions also remain unresolved; no inference that a syntactic pass proves the whole chapter is correct.

## Validation, identifier changes, and limits

Using script-only `/tmp/jinshu127-editorial-fixture.iM9uIsV8`, strict `validateCompactPeopleExtraction(candidate, packet, {strictAliasDispositions:true})` passed: 278 units, 822 candidates, 165 people, 703 mentions, 916 claims, 36 repairs, 473 dispositions, zero alias-disposition conflicts. `validateAppliedEditorialDecisions(history, expandedCandidate)` returned `{"errors":[]}`. These are structural checks, not validation of the two retained questionable dispositions above.

All 701 baseline expanded mentions retain the same person, unit, kind, geometry and text hash. The two additions shift 397 prior expanded mention IDs, from old `jinshu:127:m0305` through old `jinshu:127:m0701`; persisted mention-ID consumers need reconciliation. Other source review, unscanned questions, identity, independent dates, translation and publication gates remain open. No canonical data, Git state, queue or locks were changed.
