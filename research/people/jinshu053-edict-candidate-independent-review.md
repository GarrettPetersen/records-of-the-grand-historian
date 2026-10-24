# Jinshu 053 s0177 combined draft: independent narrow review

Reviewed the ignored candidate `jinshu053-edict-combined-v1-incomplete-20261020`
against `jinshu053-eastern-palace-v1-incomplete-20261020`; no canonical data was
modified. SHA-256 values for the combined source, extraction and editorial
history respectively: `3f07b99d013aba2424358263146abb03f63d99d2dc223651f0c9aa2e35a3279c`,
`ec5e1ab566e6d60a9d810d4d6dc07c2b48b04fbd35150c0d9586d10cd100a701`,
`c23416ab0c15f07fec5dce8a5144c083e1f021a5fc2ebf1c8324cec8c12fa559`.
The combined manifest's three `pins` are the predecessor files' hashes,
not output hashes; the actual output hashes match the combined review notes.
Relabel those pins explicitly as inputs before treating the manifest as an
unambiguous handoff.

The only source content change is both English fields of s0177; source metadata
and all other sentence objects are unchanged. As discussed in the companion
source review, the alternatives convey a prospective edict without adding
biological maternity or marriage to the grandson. Extraction people and claim
rows are unchanged. The only changed surface row replaces p038's English
`Wang Huifeng` personal-name mention with `Consort Wang` title reference.
Chinese `王氏` remains linked. Two provisional translation-repair rows and one
scanner disposition were added; input fingerprints were rebuilt.

I rebuilt the packet and independently ran the retained staging-fixture strict
compact validator: 209 units, 375 candidates, 71 people, 518 mentions, 541
claims, 61 repairs, 149 dispositions, zero strict alias-disposition conflicts.
For s0177 the linked English `Consort Wang` occupies code points [6,18),
Chinese `王氏` [2,4). The scanner candidate `Bring Consort Wang` occupies
[0,18); `Bring` is an imperative, so the `not-person/other` note correctly
explains the larger non-name span while preserving the embedded person link.

## Holds

This approves neither all mentions nor chapter completion. The Chinese title
`太孫太妃` and newly written English `Taifei of the Grandson-Heir` refer to
the consort in context but are not individually linked in this sentence; the
title mention and any nested reference to the grandson need review and normal
span/overlap validation before claiming complete backlinks. p038's explicit
bilingual `Wang Huifeng` / `王氏` name row cites s0065 and s0177 although the
given name does not appear in either. Its inherited `Grand Heir Consort
Dowager` title claim is unchanged despite the new rendering. Both require
normal source/identity reconciliation, not an unsupported automatic rewrite.

The reviewed component still contains synthetic decision placeholders; this
note is not a production editorial approval. Preserve every inherited
translation, source-restoration, chronology, identity and publication hold,
and existing date-audit owner and artifacts. Changed source/extraction require
fresh complete independent audits and the full normal handoff.
