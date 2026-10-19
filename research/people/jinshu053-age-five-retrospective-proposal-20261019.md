# Jinshu 053: age-five incident, retrospective witness and limited repair proposal

This is an **unapproved, noncanonical proposal**, not an independent date
approval or chapter completion. Pinned inputs are staging commit
`5ce2986d92275533f68e1f1d16ba5b5ade31eb4d`, source blob SHA-256
`85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407`,
extraction blob SHA-256
`464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69`,
and date-report blob SHA-256
`d3bb12dbc7db670357affb2e216790baffb359db62ce78478ff3d37c1ba93073`.
The existing discrepancy and independent check remain separately recorded in
`jinshu053-age-five-date-claim-discrepancy-20261019.md` and
`jinshu053-age-five-date-discrepancy-independent-check-20261019.md`.

## Witness and chronology

[Zizhi Tongjian 082](https://zh.wikisource.org/wiki/%E8%B3%87%E6%B2%BB%E9%80%9A%E9%91%91/%E5%8D%B7082)
places the naming of the imperial grandson Yu as Prince of Guangling under
Taikang 10, conventionally AD 289. It then introduces Yu's birth and the
palace fire with `初` and `嘗`: the fire is an earlier recollection, not a
statement that it took place in 289. The narrative may support a terminus
only if its retrospective ordering and the placement of the appointment are
accepted; it does not give the incident's calendar year. The Tongjian is a
later compilation and should not be treated as an independently established
contemporary account.

[Jinshu 053](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7053)
gives the prince's age as five at the undated fire, and age 23 when killed.
[Jinshu 004](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7004)
places the killing in the third month of Yongkang 1, conventionally AD 300.
If **both** ages use inclusive Chinese-year reckoning and the regnal-year
mapping is accepted, then 300 − 22 + 4 = 282 is the conventional label of the
Chinese year of the incident. A published secondary
[calendar reconstruction](https://sangokushi-biyori.com/reference-gregorian-calendar-282)
places Taikang 3 across proleptic Gregorian AD 282–283. This is a conditional
calculation, not an explicit year in the biography or proof of the age
convention; it is not an independently corroborated event date. Do not
silently present it as an established 282–283 life event.

## Minimal proposed change, still research-blocked

The reviewed report marks the age-five attestation `claim-102` unresolved,
but marks the same incident's age row `claim-110` supported while it still
contains an AD 266–290 interval. The reason does not derive either endpoint.
To reconcile those treatments without promoting a conditional inference,
propose changing **only** `claims[109][2].dateContext` from

```json
{"sourceDate":{"text":"太子時年五歲"},"westernInterval":{"start":{"era":"AD","year":266,"precision":"year"},"end":{"era":"AD","year":290,"precision":"year"}}}
```

to

```json
{"sourceDate":{"text":"太子時年五歲"},"unresolved":true,"unresolvedReason":"The source gives the prince's age at the fire but not the event's year. A date inferred from his reported age at death depends on inclusive age reckoning and a separately dated death, and requires independent source and calendar review."}
```

The proposal preserves the original person, predicate, age, stated reckoning,
claim certainty and evidence-unit list; it removes no age information. This
does not adjudicate whether the extraction's existing `sui` label is itself
fully supported. The existing owner must validate the exact change through the
date workflow, preserve the report and sticky recovery, and obtain independent
review and a fresh complete date audit. In particular, an unresolved date
continues to block approval. No candidate has been installed or approved.

This proposal does not address other translation defects, source witness
disagreements, name classification, identities, page presentation or ebook
gates. Those remain separate work.

## Isolated structural validation

The proposed exact one-field change was applied to a noncanonical candidate
using the date-repair transform at the pinned staging revision. The pinned
production compact-extraction validator and applied-editorial-decision
consistency check both accepted it. The validator counted 209 units, 71 people,
516 mentions and 541 claims. A stale before-value and an invented certainty
were rejected in negative controls. This validates structure and matching
applied decisions, not the history, complete editorial coverage, or independent
review. Exploratory controls changing the age to `-1` or `"five"` did not
raise an extraction-validation error; this check cannot establish numeric-age
validity. The actual candidate preserves the original numeric age of five.

The isolated candidate byte SHA-256 is
`ae953c22149c69831301c1f8edf45bfbe4391d2f07ee7f9d8f6d7324649f0b78`;
its semantic extraction fingerprint is
`sha256:2951d89905e83651301e422384e7ba638bdbf82a75f08c7c1a7de8f46b5c0bd6`.
The proposal, candidate, new packet, receipt and test harness are retained at
`data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-age-five-unresolved-candidate-5ce2986/`.
They are not an approved repair, do not clear the research hold and have not
been installed in canonical chapter data.
