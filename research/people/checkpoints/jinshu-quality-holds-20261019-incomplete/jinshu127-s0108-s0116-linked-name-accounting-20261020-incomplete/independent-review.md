# Independent review: Jinshu 127 s0108–s0116 linked-name accounting

Research only; not chapter or publication approval. Reviewed candidate SHA-256 `0fb06ca1d1d3c14d568ed36937f283f22be00202b8823da2ef05ac2eb808d0db`; immediate baseline `f3d1b90dc2811e10dfad1cb53c11f942418f69253c045a4e3b01761a8581cee2`; held source `ca683ed09f79724fe107185f6f1e5f5ded2378999ea887ce910432eb127dd3b3`; held packet `cd6ab556fb0b323f639d2cf46013312e78a8868379cf053f1678f40c013b4701`; applied editorial history `093ceb5a45d1be3500d1449ebdfbd4d304081049fd11e7257a50d1d93b26917e`.

## Exact delta and twelve source-backed associations

The exact compact JSON diff removes precisely these twelve `not-person` dispositions and changes no other compact data. Expanding the candidate against the held packet accounts for each removed scanner hint exactly once, as a candidate reference on the indicated existing, same-language, same-unit containing person mention. Offsets below are half-open Unicode code points of the scanner hint, not new hyperlink spans.

| Unit | Candidate suffix | Hint and offsets | Existing person/link; source basis |
| --- | --- | --- | --- |
| s0108 | `71da6880db5fe590` | English `Murong` [145,151) | p044 `Murong Zhong`; `敗德將慕容鐘`. |
| s0108 | `636938f67048576c` | Chinese `慕容` [25,27) | p044 `慕容鐘`; same source witness. |
| s0111 | `0713027adcd4ff5b` | English `Murong` [0,6) | p045 `Murong De`; `德乃留慕容和`. |
| s0111 | `2430385b1618a12f` | English `Murong` [15,21) | p058 `Murong He`; `德乃留慕容和`. |
| s0111 | `b10c9940c94f7c95` | Chinese `慕容` [3,5) | p058 `慕容和`; same witness. |
| s0112 | `0cc84d928b00d56a` | English `Murong He` [86,95), second occurrence | p064 `Murong He`; `和不從`, after Li Bian urges He. |
| s0112 | `af3668477965bcdc` | English `Murong Bao` [5,15) | p063 `Murong Bao`; `寶之至黎陽`. |
| s0113 | `eb48ad652617fcfa` | English `Li Bian` [107,114), second occurrence | p065 `Li Bian`; `辯懼謀泄` and surrounding sentence establish the plotting subject. |
| s0115 | `adffb65f409f4185` | English `Li Bian` [41,48) | p065 `Li Bian`; `辯又勸和反`. |
| s0115 | `0863f718ea46dbbb` | English `Murong He` [88,97), second occurrence | p064 `Murong He`; `和不從`. |
| s0116 | `07f86a60a7a143f8` | English `Li Bian` [0,7) | p065 `Li Bian`; `辯怒，殺和`. |
| s0116 | `98f64b07d4aefdeb` | English `Murong He` [13,22) | p064 `Murong He`; `辯怒，殺和`. |

The surname-only hints are components of already-linked named people, not standalone non-person references; their re-accounting does not create separate overlapping links. The exact referenced spans, occurrence numbers and unit hashes were verified by read-only expansion from the pinned packet.

## Boundaries and validation

Adjacent units s0111–s0116 present continuity around Murong He, but the extraction retains separate local records p058 and p064. These changes do not merge them, prove global identity, or settle any same-person decision; identity resolution remains a separate gate. Other title/office/place overlaps and unscanned questions were outside this accounting candidate.

Using script-only `/tmp/jinshu127-editorial-fixture.iM9uIsV8`, `validateCompactPeopleExtraction(candidate, packet, {strictAliasDispositions:true})` passed: 278 units, 822 candidates, 165 people, 703 mentions, 916 claims, 36 repairs, 461 dispositions and zero alias-disposition conflicts. `validateAppliedEditorialDecisions(history, expandedCandidate)` returned `{"errors":[]}`. All 703 preceding expanded mention IDs, person associations, unit locators, kinds, spans and text hashes remain unchanged; only their derived candidate references differ. This does not undo ID churn in earlier candidate steps.

Complete person coverage, identity, source/editorial reviews, independent dates, trusted unscanned-review replay and publication gates remain open. No canonical data, shared Git state, queue or locks were changed. This reviewer no longer needs the script-only fixture; other workers may still depend on it, so verify process ownership and preservation before any cleanup.
