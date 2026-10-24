# Independent verification: 太上 sex-claim removal preview (incomplete)

I independently read the input, candidate, diagnostics and source, and
reconstructed the candidate in memory by locating the **unique** complete
`["p051","sex",{"sex":"male"},"strongly-inferred",["s0219"]]` row in
the pinned input, then removing it. Its index was 331 (zero-based). A deep
comparison of the entire reconstructed object with the saved candidate passed:
no other claims, dates, identities, surfaces, dispositions, or other fields
were changed.

Verified SHA-256 byte fingerprints:

- Input five-kinds candidate: `f038366b75123182a45e1f217f0a9b736a779da8d1ec77f6deaee68c39ab59b4`.
- Output candidate: `12723521c8c5b7a4cb2d42441c60c961084617399b2a582fa94101d764210005`.
- Recorded diagnostics: `ffcb284e8de168ae9dabcf716c15de7b743e795513e69647956266ba9f0f2a52`.
- Preview script: `0e45a7560da7bdd818313a764ee4504f0d1219804727e84f35b6db5c6fceebc8`.
- Current Jinshu 022 source: `813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`.

I independently rebuilt the current extraction packet and ran
`validateCompactPeopleExtraction` on the saved candidate. It **failed** with
exactly the three errors in the diagnostics report (c0825, c0850, c0855;
removed posthumous reception kinds). The independently computed complete
`dateAuditDiagnostics(dateAuditItems(candidate))` matches the recorded array:
three diagnostic items, claims 333/p051, 358/p056 and 363/p057. Their indices
shifted by one after the deleted row. The independently built date packet's
semantic extraction fingerprint is
`sha256:f4c9eb306c40769eda9e51a7388bcea1ccb43c3412e1aa13c51c0173c53d1b7b`,
matching the report.

This verifies only the exact limited edit and the reproducibility of its
diagnostics. The disputed 太上 referent, p056/p057, the held event kinds,
broader source/identity issues and all independent editorial, full date and
publication gates remain unresolved. It is not a chapter approval, and the
three errors must not be mechanically relabeled without source adjudication.
