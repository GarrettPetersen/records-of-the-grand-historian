# Independent composition verification: Jinshu 022 (incomplete)

I independently read the source, input draft, three proposal JSON files, output
draft and report. Every input hash listed in the report matches its file. The
output has SHA-256 `f038366b75123182a45e1f217f0a9b736a779da8d1ec77f6deaee68c39ab59b4`
and semantic extraction fingerprint
`sha256:77876f7a5ef1c061a5438e9922f3a684ee1d54e420e2f4102ede74cb2c930354`.
The diagnostics report hash is
`53d1212bf06a38e852a2c82695cbcf87285f28c0e29ce7286955a90be8e617e5`;
the producer script hash is
`bcbc4daca34921c4f8ebce861ff4302f6cc93ae02b1f8b35e9d124b04bbfc361`.

I reconstructed the expected output independently from the proposal before/after
rows, checked the indices 303, 304, 369, 571 and 590 and complete before rows,
and deep-compared the entire resulting object to the saved candidate. Exactly
those five `kind` fields changed from `posthumous-commemoration` to
`retrospective-reference`: no dates, confidence, claims, people, citations or
other fields changed. The complete recorded `changes` equals the proposal rows.

Using the current `buildPeopleExtractionPacket` and
`validateCompactPeopleExtraction` with the saved candidate, I independently
obtained the same three errors recorded in the diagnostics report: c0826,
c0851 and c0856, all removed posthumous reception kinds. A separate invocation
of `dateAuditDiagnostics(dateAuditItems(candidate))` exactly matched the
report's three diagnostics, claims 334/p051, 359/p056 and 364/p057. This is
**failed validation**, not approval: these records are held for unresolved
referents, not candidates for mechanical relabeling.

This verifies composition and diagnostics only. The proposal reviews' identity,
chronology and editorial concerns still apply, including the exact 266 date on
the Xuan–Wen hymn claims, 太上, 先後 and 皇祖, the false-person p046, and
prior review disagreements. No date, identity, translation, full extraction
or publication approval follows; the ultimate source and extraction need fresh
independent complete review and all normal gates.
