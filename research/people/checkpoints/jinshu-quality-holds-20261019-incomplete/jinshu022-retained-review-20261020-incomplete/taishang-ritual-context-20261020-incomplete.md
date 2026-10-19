# Jinshu 022, 太上 (s0219): source investigation and limited proposal

Research handoff only; not an independent approval, completed extraction, or
date audit. This proposal is pinned to the exact `five-kinds-composed-candidate-20261020-incomplete.json`
byte SHA-256 `f038366b75123182a45e1f217f0a9b736a779da8d1ec77f6deaee68c39ab59b4`,
`data/jinshu/022.json` byte SHA-256
`813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`,
and generated packet byte SHA-256
`d788951ada6f8e8aa85d96cff63f9a3161d2f9c81266a9e144412f214cd16155`.
Verify all pins and the full row before using this handoff. Indices below are
zero-based. Any application and translation change needs independent review.

## Primary evidence

- Jinshu 022 s0214 explicitly heads the song `祠廟迎送神歌`; s0215–s0218
  invoke descending spirits, blessing, and Heaven; s0219 has `赫赫太上，巍巍聖祖`,
  followed by s0220 `明明烈考，丕承繼序`. It is followed by separately
  headed hymns for particular shrine dedicatees (s0221 onward). The passage
  does not explicitly name or identify 太上, provide an individual biography,
  or say that 太上 is a personal name, a distinct male person, or Laozi.
- [Songshu 020](https://24histories.com/songshu/020), s0356, repeats the
  same four clauses in another transmission, followed by its heading for the
  shrine welcome/send-off song. The two English fields there translate 太上
  differently, as “Supreme Lord” and “Supreme Ancestor”; they are modern
  renderings, not independent authority for the referent. Nor does the local
  Jinshu English “Grand Supreme” establish an individual identity.
- [Nan Qishu 011](https://zh.wikisource.org/zh-hant/%E5%8D%97%E9%BD%8A%E6%9B%B8/%E5%8D%B711),
  also present locally at s0392–s0394, attributes one welcoming/sending
  spirits hymn and seven distinct ascent hymns to Fu Xuan; it quotes Fu on
  different texts for the ascent hymns and shared ritual music for spirit
  feasting. The source's explicit statement that all seven shrines use the
  same hymn concerns **饗神**, not expressly this **迎送神** hymn. Do not
  transfer that assertion between musical functions. The separately enumerated
  one welcoming/sending song is evidence against assuming its ambiguous title
  is necessarily one individual dedicatee, but does not prove that 太上 is
  collective, a deity, or the same person as 聖祖 or 烈考.

## Candidate implications

`p051` is labeled “Grand Supreme / 太上”, uncertain, with one s0219 bilingual
surface. It asserts a title as explicit, `royal-family-member` as explicit,
and the following four claims (all s0219): male sex (index 331), undated
attestation (332), `posthumous-reference` event-participation (333, the third
remaining validator error), and a hymn assessment (334). This is a constructed
record, not evidence for a separately individuated human. The existing
unresolved-reference note claims 太上 is uniquely invoked; that uniqueness is
unproven. The description of the role and attestation presumes a single
dedicatee; the `personal-name` kind on the English surface is also unsupported.
The claim's `posthumous-reference` is an invalid event kind, but replacing its
label while retaining an unsupported person would not resolve the underlying
question.

**Precise low-risk draft proposal, conditional on keeping p051 for further
adjudication:** remove only index 331, exact before row
`["p051","sex",{"sex":"male"},"strongly-inferred",["s0219"]]`.
This records no alternative sex and infers no new date: the cited line does
not uniquely identify a person or establish sex. Do not present this deletion
as an independent review, as a resolution of claim 333, or as permission to
publish. If p051 is instead removed as a false/generic person, that must be a
separate independently reviewed change including all linked surfaces, claims,
coverage and freshly generated candidate accounting.

The packet's s0219 preflight candidates are English `Radiant`
`cand_f6b27729b554fc0d` and Chinese `聖祖` `cand_a32d5ca936b40934`, not 太上
or “Grand Supreme”. The extraction accounts for 聖祖 as a plural collective
because the English renders it plural. Classical Chinese lacks obligatory
number; the parallel context alone does not prove plural or singular, so this
disposition deserves independent source review and must not be justified by
the modern translation alone. Do not automatically relabel it or link it to
p051. The s0220 烈考 `p052` may also be a generic ritual role rather than a
proven separate historic individual; it requires its own evidence assessment.

No precise new translation for s0219 is recommended on this evidence. An
independent philological reviewer should assess sense, number, parallelism,
and whether “Grand Supreme” capitalizes a title too definitively; synchronise
both English fields and regenerate source-dependent packets if a correction is
accepted. All chronology, person identity, extraction, and editorial gates
remain open, including a fresh independent audit against final fingerprints.
