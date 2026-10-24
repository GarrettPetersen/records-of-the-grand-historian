# Independent review: held s0191 mother candidate

Research-only, not chapter or publication approval. Candidate SHA-256 `65b4ebeb282370efb5ae0aed51b563a990d948c61e843b7a1dfd0d1d0ef79679`; exact preceding De candidate SHA-256 `739152aea5f690b2f56faba4f2c480deda3c8a77b4ff3427c9c609a3e468ca8d`; held source SHA-256 `ca683ed09f79724fe107185f6f1e5f5ded2378999ea887ce910432eb127dd3b3`; held packet SHA-256 `cd6ab556fb0b323f639d2cf46013312e78a8868379cf053f1678f40c013b4701`; applied editorial history SHA-256 `093ceb5a45d1be3500d1449ebdfbd4d304081049fd11e7257a50d1d93b26917e`.

## Findings

- The compact JSON diff has exactly one addition: p106 `kinship-reference`, English `mother`, s0191 occurrence 0. No other compact field is changed. Source `德母兄` explicitly identifies De's mother; p106's local record is `Mother of Murong De` / `慕容德母`, and its existing Chinese kinship `母` [1,2) agrees. This is local evidence, not a cross-chapter identity merge.
- Expanding against the held packet produces p106 English `mother` at code-point offsets [5,11), unit text hash `sha256:459b3dc7c5edaee3242fae6a3bab52725fc815530c2475897f69490168c937a6`, with no scanner candidate reference. It does not overlap English p078 `De` [0,2), p108 `Du Hong` [75,82), or p106 `empress dowager` [198,213). All 696 earlier expanded mentions retain the same person, unit, kind, language spans and unit hashes.
- Insertion shifts 202 retained expanded mention IDs: old `jinshu:127:m0495` through `jinshu:127:m0696`. Check and reconcile persisted downstream mention-ID consumers; unchanged geometry does not mean stable identifiers. The new mention is m0495 in this expansion.

## Read-only validation

Using `/tmp/jinshu127-editorial-fixture.iM9uIsV8` and the pinned packet/history, `validateCompactPeopleExtraction(candidate, packet, {strictAliasDispositions:true})` passed: 278 units, 822 candidates, 165 people, 697 mentions, 916 claims, 36 repairs, 478 dispositions, and zero alias-disposition conflicts. `validateAppliedEditorialDecisions(history, expandPeopleExtraction(candidate, packet))` returned `{"errors":[]}`. The validator script hashes are recorded in the preceding De independent review; this audit did not change those scripts.

These results do not approve any of the remaining unscanned questions, trusted review replay, complete person coverage, date audit, identity resolution, translation review or publication. No canonical files, shared Git state, queue or locks were changed.
