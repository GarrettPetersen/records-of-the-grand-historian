# Jinshu 129 early siege chronology — partial independent review

Research only. This is not a date-audit report, approval, production repair,
complete check of units s0001–s0089, or authorization to publish. It records a
specific defect found while examining that range, plus nearby context through
s0104. A fresh complete independent audit is still required.

Reviewed packet: staging revision `e1e6738a41a524212548f50db54664a9ae6a1f53`,
`research/people/jinshu129-candidate-date-packet-20261020-incomplete.json`,
file SHA-256 `e12dc796a3a3fb504f1959fc9f0a0b2d7d479055020f776d6eda699c5888a341`.
Its source fingerprint is
`sha256:b67618d76725994ac36717b3fdd27228b2e23ba1ddf60cb9d7c9bd62972c1318`;
its candidate extraction fingerprint is
`sha256:66c4e7e7eb5cb030aca7c35b2488bc75efc325dcdc7f7ef4b3bf9a1f800fa754`.
This is a noncanonical candidate, not an accepted production input.

## Defect: two different submissions conflated

- `claim-539`, p051 (Li Xuansheng), dates his receipt of the two commanderies'
  defection to AD 403. `claim-391` is an AD 403 attestation for p051 combining
  evidence from s0088 and s0097; it requires separate review of both units.
  `claim-417`, p048 (Lü Long), dates his submission to Later Qin to AD 403.
- In s0087, Yao Shuode attacks Lü Long at Guzang. In s0088, Mengxun hears
  that Lü has submitted and the two commanderies have defected to Li Xuansheng,
  then sends his brother and Zhang Qian to Shuode; Shuode appoints them in
  s0089. In s0091 his brother argues `呂氏猶存，姑臧未拔，碩德糧竭將遠`:
  the Lü regime still exists, Guzang has not fallen, and Shuode will depart.
  This is an earlier submission while Lü remains in Guzang, not the later
  removal of Lü and his followers. The chapter's later s0104 identifies the
  other commander: `姚興遣將齊難率眾四萬迎呂隆`.
- Independent chronological witness: [Zizhi Tongjian 112, annotated](https://zh.wikisource.org/wiki/%E8%B3%87%E6%B2%BB%E9%80%9A%E9%91%92_(%E8%83%A1%E4%B8%89%E7%9C%81%E9%9F%B3%E6%B3%A8)/%E5%8D%B7112)
  places the earlier siege, submission and defection/mission under `隆安五年`
  (conventional AD 401); it explicitly notes conflicting historical witnesses
  concerning whether Shuode's campaign belongs in the following year.
  [Jinshu 122](https://zh.wikisource.org/zh-hant/%E6%99%89%E6%9B%B8/%E5%8D%B7122)
  separately narrates Shuode accepting Lü's earlier submission and hostages,
  followed by later attacks and Qi Nan escorting Lü east.
  [Zizhi Tongjian 113](https://www.shidianguji.com/zh/book/CADAL01033487/chapter/1lac94gd6chzu)
  places the Qi Nan escort under `元興二年`, conventional AD 403. These
  sources support two distinct events; they do not establish a precise modern
  Gregorian day for either event.
- Recommended action: preserve the competing witness for the siege year and
  independently research the conversion and event date; revise all three claims
  consistently only when the owner has a validated repair. Do not silently
  assign the year of the later escort to the earlier defection or submission,
  or treat the broad AD 401–403 claims elsewhere as independently approved.
  The exact 401 versus 402 witness conflict must remain visible until resolved.
  An independent checker also flagged `claim-397`, `claim-398`, `claim-425`,
  `claim-478`, `claim-545`, and `claim-546`: their AD 403 dates cite
  s0097–s0099, so review their actual events individually rather than
  automatically redating them from the earlier defection.

## Related ownership check for later work

The packet splits the same continuous narrative's named actors across records:
p001, p026 and p049 are all labelled Mengxun; p012 and p025 are Duan Ye; p011
and p029 are Nancheng. This is a source-backed review signal, not an identity
merge decision or evidence that all dates on any of these records are correct.
The date reviewer must track events to the right subject across these local IDs
and send the identity question through the independent identity gate.

## Pinned local Chinese units

Hashes are SHA-256 of the entire UTF-8 `zh` field, not of this file. Short
excerpts below are from the stored chapter and are sufficient to identify the
event under review.

- s0087 `4e98fe1e3cd6ffb3b496afc52cf6723974157856adc1c90d3de43b28b1006c93`:
  `姚碩德攻呂隆于姑臧`.
- s0088 `96ce8ee0ae3508719b3006a70481c53ad1c2faedfa65376f46e1ba22e4930bd5`:
  `呂隆既降於興，酒泉、涼寧二郡叛降李玄盛`.
- s0089 `b6f833852f378254a4bbd27ca6e9d04adfac45929bb3507a8e4b058ef240f804`:
  `碩德大悅，拜潛張掖太守，挐建康太守`.
- s0091 `02e5a5dcfd5c6fda59b9db8b54ed44dd4d292f35465819d8ec409ed5439cf5aa`:
  `呂氏猶存，姑臧未拔，碩德糧竭將遠`.
- s0104 `fa83f8989cb0153dbc87b649c1021289204fbf73cbb77e1e84597e16ef0f852d`:
  `姚興遣將齊難率眾四萬迎呂隆`.

External pages were consulted for this research on 2026-10-19 UTC. Their quoted
phrases above are not a machine-recordable external reference receipt; the
production reviewer must independently verify and fingerprint the actual
reference excerpts before recording an audit.
An independent reviewer checked the five local unit hashes, affected claim
values, separate events and competing witness cited above; the qualifications
about mixed evidence and other 403 claims incorporate that review.
