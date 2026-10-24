# Jinshu audited reports: shared-citation investigation (incomplete)

This read-only investigation uses staging commit `6f07dd120d624fb2ab19cd2f63efa91b0b0e039b`. It is not a full independent chronology audit and does not assert that the dates themselves are false. No canonical report, extraction, lock, or claim was changed.

## Reproducible inventory

For each `data/people/date-audits/jinshu/NNN.json` at that commit with `status` `audited`, group `personChecks` by the exact JSON serialization of `evidence`; count the largest group and separately count `itemChecks` with IDs beginning `hints-` whose evidence equals that group's evidence. Also count `references`. The nine reports below each have one evidence array repeated for **all** person checks and **all** hint checks, and each has zero references. The stated hashes are SHA-256 of the exact report bytes returned by `git show COMMIT:PATH`.

| Chapter | Person and hint checks each | Repeated source citation | Report SHA-256 |
| --- | ---: | --- | --- |
| 072 | 106 | s0002 `郭璞` | `d81f2cee5979e59a9b9c2e7d0c63f283d5eece1671403364120c216bd998bce5` |
| 080 | 125 | s0001 `王羲之` | `c5d18ca017beae087c5c2c681c791bc0702dffc8c4578e31b135605fd6b835a1` |
| 093 | 171 | s0001 `詳觀往誥，逖聽前聞，階緣外戚以致顯榮者，其所由來尚矣。` | `c269aad0cf926284689249fe390fc48c94879b3636a95634d2c8b2ed64999c30` |
| 109 | 181 | s0002 `慕容皝` | `0fb2dcc5bf9462a5e9c3fb2864c29905051a1ffc2769274883e5ad5ef7c04808` |
| 117 | 243 | s0001 `姚興` | `e6f01637565b4b12e1e296349bac1269689d85fae6bfc82efc448d07c2040036` |
| 119 | 202 | s0002 `姚泓` | `454f44ea3c8985a394e5af8d0b52686d21e167bb1aa473bfed6c4cb0e5887aef` |
| 123 | 148 | s0001 `慕容垂` | `77000d713c19a670079906972366c2d2f348ed3f908638a6837bc2aa718b7fc1` |
| 128 | 162 | s0002 `慕容超` | `29e939e37f98fb6609d991d2db4dd7900a1853343a661e3cd628a39660063acd` |
| 130 | 136 | s0001 `赫連勃勃` | `d4bb1343159d60a34788d1a090afcd057bf1a5791f4acc1dfa8ce3d518bd6509` |

These are all reports marked audited among the staged Jinshu date-audit paths, not a claim about other books. Chapter 123's report is additionally orphaned: staging has no corresponding extraction; see the separate Jinshu 123 handoff. Report byte hashes are not the internal semantic source/extraction hashes.

The nine listed report files are byte-identical between staging and master
`287adaea3fcab4ee9928f986ba7c171cb61c2afe`; this does not by itself establish
whether every corresponding source and extraction on master remains current.

## Concrete source mismatch: 072

At this commit, the source file `data/jinshu/072.json` has SHA-256 `a9cca77dbd71eae458620f8973aaa2f98b1a55cdfa876dae97346f291e4d3f15`, and its extraction `data/people/extractions/jinshu/072.json` has SHA-256 `8f67c9044116ce265d944c6854d67649f8423da900cfb6c98e8f8ee07875cb67`. The sole evidence cited for person checks p002, p003, and p005 and their respective hint checks is s0002 `郭璞`, the heading identifying Guo Pu, p001. The extraction instead identifies p002 as Guo Yuan, p003 as Du Yu, and p005 as Jing Fang; it assigns active hints AD 270–285, AD 270–285, and BC 77–37, respectively. Source units s0004, s0005, and s0010 discuss those other people, but these passages themselves do not state those numerical years. The report gives no external references. Thus the cited heading does not substantiate those individuals' date hints; determining their correct chronology requires a fresh source-backed independent review. The extraction links s0002 only to p001.

A separate reviewer independently checked p002 and its hint on both commits:
source s0004 identifies Yuan as Guo Pu's father, and s0005 describes Yuan and
Du Yu but contains neither endpoint of AD 270–285. The audit's p002 and
`hints-p002` checks cite only s0002; the audit's separate claim-59 check cites
s0005. Neither cited passage establishes the range. The reviewer did not rule
out other evidence or independently determine the correct dates.

## Implications and limitations

The repeated-evidence pattern is a useful triage signal, not by itself a sound universal rule: a single passage can legitimately support multiple people or contextual dates, and a citation may be indirect. Independent sampling found an actual mismatch in 072, and previous work found separate evidence defects in 080, 123, and 128. Each report should be assessed on its own evidence and protected as unverified until reviewed; do not treat a mechanical pattern match as proof every date is wrong. The current validator checks that quoted text occurs in the cited unit, but that alone cannot establish semantic relevance or prove reviewer independence.

Do not publish replacements or start date recovery by bypassing the protected global date lock. Preserve retained work, review actual evidence independently, and use the existing fenced workflow when the lock is safely resolved with appropriate authority. This investigation is not a completed chapter or a date approval.
