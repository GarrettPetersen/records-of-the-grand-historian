# Jinshu 129 s0241: independent 太歲 context check

Research only. This is not whole-chapter extraction, editorial, date, identity,
or publication approval, and it does not propose changing the extraction.
Reviewer: Codex conversation `/root/review_129`.

## Pinned inputs and exact candidate

The staging revision inspected was `932755964d0be6b63addd46cd35a471c5a7deeae`.
The source SHA-256 is
`bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800`, and
the stacked Saturn research wrapper SHA-256 is
`507b0c22fb43f63401f29ad3684d49e26210e12f15e40cdaee6be4ecb4bcba89`.
The complete structural delta inventory inspected has SHA-256
`e540a1ffd85adbb5a200239a7c319553388c2508878346c97e19667345422531`.

The packet built from the candidate source identifies
`jinshu:129:cand_3faed49538785881` as the Chinese surface `太歲` in
`s0241`, occurrence 0, at code-point interval [22,24). The local packet
builder and content library match their staged files, but this check did not
independently establish equality for every packet dependency. Its exact
scanner ID and position therefore should still be verified against the final
sealed production packet.

The passage says `但太歲在申，月又建申，未可西行` in the context of
Mengxun explaining why he should not march west. Both the year and the month
are assigned the earthly branch 申, with a directional military consequence.
It does **not** establish that the term here means the physically observed
planet Jupiter, nor is it the separate `鎮星` candidate in s0223.

The National Palace Museum explains that traditional astral reckoning used a
notional "shadow Jupiter" called 太歲 or 歲陰, traveling opposite the planet
歳星: <https://www.npm.edu.tw/NewChineseArtDownload.ashx?bid=5252>. At the
same time, the historical compilation 欽定協紀辨方書 describes 太歲 both in
relation to the yearly cycle and as the year's spirit, including directional
restrictions on military action:
<https://zh.wikisource.org/zh-hant/%E6%AC%BD%E5%AE%9A%E5%8D%94%E7%B4%80%E8%BE%A8%E6%96%B9%E6%9B%B8_%28%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC%29/%E5%8D%B703>.
The compilation is later than this chapter and helps identify the traditional
concept, not prove that every later practice or interpretation applied at the
narrative date.

## Decision and remaining review

The inherited `not-person/deity` disposition with note `Grand Year star`
should **not** be automatically replaced with the Saturn correction, with a
physical-planet classification, or with a categorical denial of divinity.
This occurrence is a calendrical/astrological directional concept with a
well-attested spirit interpretation; the available evidence does not force an
exclusive choice of those conceptions in this sentence. A future reviewer may
improve the explanatory note, but must choose a schema-valid disposition with
source support and independently review the exact materialized delta.

The crosswalk and focused prior reviews do not establish the accuracy of all
other 774 mentions, 1,607 claims, candidate dispositions, cross-chapter
identity links, or translations. In particular, positional claim and mention
IDs and two retained mention offsets change; downstream decisions must be
rebuilt and reconciled against the final fingerprint. A current complete
independent date audit, full source/candidate coverage, identity decisions,
and site/ebook publication checks remain necessary. No canonical inputs,
claims, locks, Git state, builds, or previous artifacts were changed.
