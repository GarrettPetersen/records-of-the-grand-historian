# Independent source review: Jinshu 022 太上 (incomplete)

Focused review only, not a whole-chapter approval, date audit or identity
decision. No extraction, source, lock, claim, or prior report was changed.

## Evidence pins

- Reviewed report `taishang-ritual-context-20261020-incomplete.md` byte
  SHA-256 `7413dc74c1b749264b1f239a36f7337d7ad89b42faab8b60a29e3139e706c3fa`.
- Five-kinds candidate byte SHA-256
  `f038366b75123182a45e1f217f0a9b736a779da8d1ec77f6deaee68c39ab59b4`.
- Local Jinshu 022 source byte SHA-256
  `813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`.
- Local Songshu 020 source byte SHA-256
  `328ab577e8475272327a32fc39f867b4a7e390632556d0d5d4f886cf22cd393d`.
- Local Nan Qishu 011 source byte SHA-256
  `3a028b5d37dddf8873fae6ce0cef47dbc6d684fbf89b4327298ebe074c8c4ae7`.

I regenerated the packet in memory from the current source and confirmed its
s0219 candidates and their IDs. The prior report gives a byte hash for a
generated packet but no packet file path; I did **not** verify that historical
packet's byte hash. The current candidate and three source files have the
above hashes; neither this caveat nor in-memory regeneration authorizes applying
anything against a packet with different fingerprints.

## Independent findings

Jinshu s0214–s0220 indeed gives a hymn for welcoming and sending spirits,
including 太上, 聖祖 and 烈考 in adjacent poetic clauses. s0221 is a
separate heading for a stair hymn to the General Who Conquered the West.
Songshu 020 s0351–s0358 transmits the corresponding hymn, with its heading
*after* the words. This corroborates the ritual context and the wording, not
an individual identity or biological sex. The modern Songshu translations
are alternate renderings, not primary identification evidence.

Nan Qishu 011 s0392 distinguishes one welcoming/sending hymn from seven
temple stair hymns, s0393 says the latter have temple-specific wording, and
s0394 says the **spirit-feasting** hymn is used at all seven temples. The
report correctly refrains from transferring the latter sentence to the
welcoming/sending hymn. A single recorded welcoming/sending song makes a
generic or shared context plausible, but does not establish the use of the
song at each shrine, a collective referent, or whether 太上 is human, divine,
or identical to another invoked term. The possibility that it is a specific
individual remains open.

The exact proposed deletion is present at zero-based claim index 331:
`["p051","sex",{"sex":"male"},"strongly-inferred",["s0219"]]`.
With 太上 unresolved and s0219 the claim's only cited unit, the source does
not justify recording male sex as strongly inferred. Removing that one claim
in a review candidate is supported as a limited correction; it establishes
neither another sex nor that p051 should be retained, removed, or merged.
The invalid `posthumous-reference` event at index 333, the explicit
`royal-family-member` role, the royal-ancestor label and `personal-name`
English surface all still require source and identity adjudication. The
undated attestation at index 332 describes the invocation, but any assertion
that it identifies a separate human likewise remains to be determined.

One wording correction to the report: the pinned p051 has `x: null`, not an
unresolved-reference note asserting unique invocation. Its **active hint**
is `research required: ancestral-hymn dedicatee invoked as 太上; personal
activity dates not stated`. That hint does assume a dedicatee, but it does
not literally claim uniqueness. This distinction should be retained in any
later evidence dossier.

I independently regenerated the s0219 preflight candidates: English
`Radiant` `cand_f6b27729b554fc0d` and Chinese `聖祖`
`cand_a32d5ca936b40934`; neither is 太上 or Grand Supreme. The latter is
currently disposed `not-person/collective` with the sole note that modern
translations render it as plural ancestors. The original text does not
itself force plurality. Do not replace that disposition with a person link,
or assert a collective, without adjudicating the Chinese context. The former
is correctly a non-name adjective as far as the English surface is concerned,
but its note says it describes “Heaven's lord,” an identification not
established by s0219; the note itself deserves review and should not silently
settle 太上.

The proposed sex-only change leaves the claim category, uncertain referent,
coverage, source translation, and all other chapter holds open. After any
accepted source/extraction edits, rebuild the packet, validate against its
current fingerprints and obtain the independent editorial, identity and
complete date reviews required for publication. This report is not evidence
that any of those downstream gates have passed.
