# Independent review: Jinshu 053 age-five candidate

I reviewed the narrow proposal in `jinshu053-age-five-retrospective-proposal-20261019.md`
against staging `5ce2986d92275533f68e1f1d16ba5b5ade31eb4d` and its source,
extraction and failed report. The source says the prince was five when the
palace caught fire but does not give that event a year. The later
[Zizhi Tongjian 82](https://zh.wikisource.org/wiki/%E8%B3%87%E6%B2%BB%E9%80%9A%E9%91%91/%E5%8D%B7082)
places the account following a 289 appointment but introduces the birth with
`初` and the fire with `嘗`. That context does not establish that the fire
occurred in 289. This review does not independently adjudicate the age-based
calculation or supply a replacement date.

The proposed extraction has byte SHA-256
`ae953c22149c69831301c1f8edf45bfbe4391d2f07ee7f9d8f6d7324649f0b78`.
I compared it with the staging extraction as parsed JSON: only claim 110's
`dateContext` changed. The AD 266–290 interval is replaced with the original
source phrase and a stated unresolved reason; the person, age, `sui` label,
certainty and evidence are unchanged. The recorded report already treats the
same incident in claim 102 as undated but gives no derivation for claim 110's
interval. Removing that unsupported interval while retaining an explicit
research hold is reasonable as a proposed consistency repair; it is not a
finding that the event could not have fallen within that interval.

The author's isolated receipt records successful production extraction,
editorial-consistency and date-repair-transform checks, along with stale-input
and invented-certainty negative controls. I independently checked the exact
diff, not a rerun of those tests. Exploratory invalid numeric ages were not
rejected by that validator; its passing result is not proof of numeric-age
validity. This review does not approve the chapter, date report, identity or
editorial closure. The existing owner must use the approved workflow, preserve
the sticky recovery and obtain a complete fresh independent date audit. An
unresolved context continues to block date approval.
