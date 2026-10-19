# Independent review: four held Jinshu 127 mentions

Research-only; no publication approval. Candidate SHA-256 `1d0aef11596fac9ca663d26e9835946908613249a89a57cf8986f71523a89008`; immediately preceding mother-corrected extraction `65b4ebeb282370efb5ae0aed51b563a990d948c61e843b7a1dfd0d1d0ef79679`; held source `ca683ed09f79724fe107185f6f1e5f5ded2378999ea887ce910432eb127dd3b3`; packet `cd6ab556fb0b323f639d2cf46013312e78a8868379cf053f1678f40c013b4701`; editorial history `093ceb5a45d1be3500d1449ebdfbd4d304081049fd11e7257a50d1d93b26917e`.

## Exact changes and source support

The compact JSON diff adds only the following four English surfaces, with no other additions, removals or altered fields. Offsets are half-open Unicode code points in the pinned packet.

| Unit | Added mention | Source and context |
| --- | --- | --- |
| s0056 | p019, personal-name `Zhang`, occurrence 1, [85,90) | `言章師老`: the report concerns Tuoba Zhang's army; preceding and following units identify Zhang. The first English occurrence remains inside an existing `Tuoba Zhang` mention. |
| s0085 | p042, title-reference `heir emperor`, occurrence 0, [20,32) | `嗣帝奔亡`, in context of Murong Bao's southward flight in s0082 and his return in s0086. |
| s0192 | p109, personal-name `Xiong`, occurrence 0, [10,15) | `臣父雄`: the speaker Du Hong is established in s0191; the full surname is family-context inference, not an additional explicit surname in this unit. |
| s0273 | p162, personal-name `Chao`, occurrence 0, [79,83) | `立超為太子`; s0272 identifies De's nephew Chao. The existing `crown prince` link is a separate title mention. |

Each added English span is disjoint from every other existing English mention in its unit and from scanner candidates there; none has a candidate reference. Local person attribution is supported but does not decide cross-chapter identity.

All 697 preceding expanded mention geometries (person, unit, kind, spans, text hashes) are retained. The additions shift 554 existing expanded mention IDs, from old `jinshu:127:m0144` through old `jinshu:127:m0697`. Reconcile any persisted downstream mention-ID consumers before promoting; text geometry stability is not identifier stability.

## Validation and remaining gates

Using script-only fixture `/tmp/jinshu127-editorial-fixture.iM9uIsV8`, the held packet and history, strict `validateCompactPeopleExtraction(..., {strictAliasDispositions:true})` passed: 278 units, 822 candidates, 165 people, 701 mentions, 916 claims, 36 repairs, 478 dispositions and zero alias-disposition conflicts. `validateAppliedEditorialDecisions(history, expandedCandidate)` returned `{"errors":[]}`. Existing validator script hashes are recorded in the s0191 De independent review.

These checks do not establish complete person coverage, trusted unscanned-review replay, independent date approval, identity resolution, translation review, or publication readiness; other chapter questions remain. No canonical files, Git state, queue or locks were changed.
