# Independent review: held s0191 De correction

Research-only, not an approval of the chapter or canonical publication. Exact candidate extraction SHA-256 `739152aea5f690b2f56faba4f2c480deda3c8a77b4ff3427c9c609a3e468ca8d`; baseline `ba7e5437d01c7065015f6f73e2be26d45390b97a8fcd85f454ac2c56355cf4f6`; held source `ca683ed09f79724fe107185f6f1e5f5ded2378999ea887ce910432eb127dd3b3`; packet `cd6ab556fb0b323f639d2cf46013312e78a8868379cf053f1678f40c013b4701`; editorial history `093ceb5a45d1be3500d1449ebdfbd4d304081049fd11e7257a50d1d93b26917e`.

## Result

The exact compact JSON diff removes only the `not-person/other` disposition for `cand_9831e41404c31316` (`De @ s0191`) and adds only English personal-name surface `De`, occurrence 0 in s0191, to p078. On expansion the new mention has code-point span [0,2), English unit hash `sha256:459b3dc7c5edaee3242fae6a3bab52725fc815530c2475897f69490168c937a6`, and references that same candidate. p078 is locally named Murong De / 慕容德 and is already linked to Chinese `德` at [0,1) in the unit; source `德母兄` supports interpreting English `De` as a person. This establishes local source support, not a cross-chapter identity merge.

p106's existing Chinese `母` [1,2), Chinese `太后` [33,35), and English `empress dowager` [198,213) retain identical spans, kind and unit text hashes. **However, expanded mention IDs are not unchanged:** insertion shifts 202 retained mention IDs, beginning with old `jinshu:127:m0494` through old `jinshu:127:m0695`; p106 examples move m0495→m0496, m0497→m0498 and m0500→m0501. Any downstream persisted mention-ID references must be checked/reconciled rather than assuming stable IDs.

English `mother` [5,11) remains unlinked. It can be separately proposed as a p106 kinship-reference: the source has explicit `母`, already attached to p106, and [5,11) does not overlap English `De` [0,2) or `empress dowager` [198,213). It is not part of this correction, and its creation requires appropriate independent review and validation. No span was added by this reviewer.

## Independent validation

Using script-only fixture `/tmp/jinshu127-editorial-fixture.iM9uIsV8` with `validate-people-extraction.mjs` SHA-256 `33b59627388be1735eae3a05fb0b36b4580eb8b2c4924b063f2f7ad66e1af2c6`, packet-builder SHA-256 `6561e28aed4a472fb6bba80b84728b395b3254f893a4b9b42c8939ecff195245`, and editorial-decisions module SHA-256 `8c61394d8376d4c13263341f2a054a55bd67ed227da63f11a822050cfc1f0af6`:

- `validateCompactPeopleExtraction(candidate, heldPacket, {strictAliasDispositions: true})` passed: 278 units, 822 candidates, 165 people, 696 mentions, 916 claims, 36 repairs, 478 dispositions, zero alias-disposition conflicts.
- `validateAppliedEditorialDecisions(history, expandPeopleExtraction(candidate, heldPacket))` returned `{"errors":[]}`.
- These read-only checks do not establish complete person coverage, date approval, trusted unscanned review replay, identity resolution, translation approval, or publication readiness. Other 127 questions and chapter gates remain open; no canonical data, Git state, queue, or locks were changed.
