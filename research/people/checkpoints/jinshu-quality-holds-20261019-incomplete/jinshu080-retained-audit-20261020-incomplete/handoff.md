# Jinshu 080: retained partial date-audit handoff — incomplete

This is a read-only inventory, not a complete audit, approval, or repair. The
four returned audit jobs and the twelve interrupted jobs remain owned by the
existing stable worker `jinshu-release-dates-cursor-sdk`; do not replace their
sealed inputs, release the sticky claim, or import this note as an approval.

The current local source and extraction byte hashes are respectively
`ef27f98c1a64dbe8a1dee18c8905d75baa26f3b5d939df1674a00975fb30cac8`
and `e13ffc6fd640f7018bf044b2e846e54c146c69ac31f1f1a2499ed05f6d580759`.
The four retained job outputs all carry source fingerprint
`sha256:78efc236952724ac19b16e86ab77616208432d87d2d71eb2c25e79a7b6a2dc4b`
and extraction fingerprint
`sha256:44e7f63b247f9a0c4460a79eddb6c9bbbb578ef3fe3a69bbd82fe2634e051632`.
Those match the recorded prior audited report, whose approval is contradicted
by the new findings. Hash equality is not substantive approval.

| Retained result (under `date-workflow/jinshu/080/`) | Owned units | Incorrect / supported item checks | Findings | Raw SHA-256 |
| --- | --- | --- | --- | --- |
| `audit-0-0006d1041a16df164133.json` | s0001–s0022 | 24 / 9 | 8 | `eaf1b55bf12c425abfc70008646073dafb28cce6f94eeb0a4fa9a1671f76a15f` |
| `audit-0-9fd718005f4ae233d3fb.json` | s0023–s0044 | 8 / 4 | 4 | `b32c2654edd95124ff703dba86365fea6723da5511ba7aa655ed829186eae749` |
| `audit-0-af883eaa7938ed9c71a4.json` | s0045–s0066 | 4 / 10 | 1 | `9d05d57e89a2c9417bb421395390d30a342c8ab1c961f0bae34452b2e18ffb6f` |
| `audit-0-4c573687d4b749838c66.json` | s0067–s0088 | 10 / 0 | 5 | `169a7f334d9410525552bca7130050b788930cc445013f704325b23a9fdee737` |

The 46 incorrect checks and 18 findings are reviewer judgments, not
independently approved repairs. The files retain exact evidence, affected
claims, references, and suggested actions. They include inferred childhood
and activity windows, borrowed dates, and retrospective references assigned
as living activity. The reviews declare extractor independence; the owner must
still validate that independence and assess each judgment.

For a directly inspectable example, Chinese unit s0057 describes fear of a
Qin-style crisis using `恐勝廣之憂`. Claim-174 and claim-175 currently store
the people p019 and p020 as living attestations dated BC 209, although that
year is not in this unit. The associated hints also repeat BC 209. The
retained review calls for preserving the allusion as retrospective reception,
not asserting their life activity at the later letter's date. The event's
own date must be established or honestly left unresolved; do not substitute
an invented exact date.

The chunks disagree on the supported range for the related letter context:
`audit-0-af883eaa7938ed9c71a4` argues for AD 353–354, whereas
`audit-0-4c573687d4b749838c66` argues that 353–354 excludes a plausible AD
352 setting and proposes unresolved or 352–354 bounds for its owned letter.
The jobs cover adjacent passages, so first determine whether they discuss the
same letter and whether the source sequence supplies a tighter bound; do not
assume conflict or mechanically propagate either date. In particular, verify
the unit-level context before linking the allusion to the latter letter.

Separately, the prior partial review of p050 identified unsupported AD 353–355
for the mother of Wang Shu and a generic prior approval; see
`research/people/jinshu080-mother-date-independent-check-20261020.md` and
the associated staged finding. That observation is outside these four owned
unit ranges and is not resolved by them.

The live workflow is still in `audit`, with four `returned` jobs and twelve
`interrupted` jobs in its retained `state.json` (raw SHA-256
`2019e167e9b9f2aabdd671018e73a0d7c693a4369a600937a25b5a5badb89515`
at inspection). Resume the stable owner using the supported workflow and the
original packet ceilings; retain all existing artifacts. Finish the remaining
owned units, evaluate all findings and cross-chunk dependencies, produce
source-backed repairs, and independently re-audit the entire changed extraction
before canonical publication. Chapter identity, editorial, page/backlink,
ebook, and release checks remain separate.
