# Jinshu 129 s0183: source-grounded mention correction proposal

Research-only proposal by Codex `/root/jinshu129_target`; it requires a
separate independent review and exact-candidate validation. It does not alter
the canonical extraction or certify chapter completion. Reviewed source is the
`source` embedded in
`jinshu129-final-materialized-20261020-incomplete.json` (whole wrapper SHA-256
`3aeaf2fc42220e9beeca59388b778b8988db53542ac3ba49fba8e95e17024c26`). Its
s0183 text is unchanged from staging source byte SHA-256
`bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800`.
Offsets below are zero-based, half-open Unicode code-point offsets in the
indicated idiomatic English or Chinese unit, not byte offsets.

## Source and proposed scope

s0183 Chinese: `晉益州刺史硃齡石遣使來聘。`

s0183 idiomatic: `Zhu Lingshi, governor of Yi for the Eastern Jin, sent envoys on a courtesy mission.`

The person is Zhu Lingshi / 硃齡石, not Yi or Eastern Jin. The existing
normalized p103 English mention m0617 is a `title-reference` over the whole
phrase `Zhu Lingshi, governor of Yi for the Eastern Jin` [0,47), causing a
person link to cover the province and polity. The companion Chinese m0618
likewise includes `益州刺史硃齡石` [1,8). Proposed compact surfaces for this
unit alone are p103 `personal-name` English `Zhu Lingshi` [0,11), occurrence
0, and p103 `personal-name` Chinese `硃齡石` [5,8), occurrence 0. Preserve
the same local person p103 and the separately recorded office, province and
polity facts; narrowing a hyperlink is not a retraction of those facts.

Candidate handling should be reviewed against the final rebuilt packet:

| Candidate | Exact surface | Proposed handling |
| --- | --- | --- |
| `cand_77ec019e708a0171` | `Zhu Lingshi` | Covered by the exact p103 name mention; remove the stale duplicate-hint that refers to the broad span, per the reconciliation contract. |
| `cand_8dc4288346d219dc` | `Yi` | `not-person` / `place`; the English Yi corresponds to 益州, not to Jin. |
| `cand_99bc8b15d97df335` | `Eastern Jin` | `not-person` / `polity`; this is distinct from Yi. |
| `cand_28a3080bfce53a76` | `益州` | `not-person` / `place`; remove the broad-person duplicate-hint. |
| `cand_d179139b595c2857` | `刺史` | `not-person` / `office`; remove the broad-person duplicate-hint. |

The existing Chinese compact surface groups s0183 and s0188 under the same
`益州刺史硃齡石` string; editing that group mechanically without splitting
its occurrence list would also change s0188. The latter has the same issue:
`去冬益州刺史硃齡石遣使詣臣` explicitly names 硃齡石 [6,9), with 益州
[2,4) and 刺史 [4,6). Its English `Zhu Lingshi` [12,23) is already narrowly
linked. If correcting both units, split the group deliberately and separately
review s0188's candidate dispositions `cand_ebe33751f3990fc7` (益州/place)
and `cand_4b2afa438eb15ac2` (刺史/office). Do not change its text.

Compact expansion assigns mention IDs sequentially; preservation of p103 and
the meaning of unaffected mentions is required, but literal retention of
m0617/m0618 after surface regrouping is not guaranteed. Compare the full
expanded before/after mentions and reconcile any ID-referencing downstream
artifacts, not just these two rows. Rebuild the packet, verify exact coverage
and run strict stage-revision validation without changing sealed history.

## Adjacent s0184: an existing donor disposition is wrong

Staging `fce861bb48533eeb388dc5573a60000f14167984` already classifies the
English s0184 candidate `cand_8a551c2a741c2b24`, exact `Yi` [68,70), as
`not-person` / `polity` with note `Jin`. This is not a newly added disposition.
The Chinese context is `蒙遜遣舍人黃迅報聘益州`, and both English fields
render the destination 益州 as Yi. It is Yi Province, not the Jin polity.
The separate Chinese candidate `cand_e03de8ce9db7e698`, exact `益州` [9,11),
is already correctly classified `not-person` / `place`. A separately reviewed
correction should move only the English candidate to `not-person` / `place`
with an accurate Yi Province note and preserve the Chinese disposition and
other members of both compact disposition groups. The automatic propagation
that copied the erroneous Jin note to s0183 must not be trusted. This is a
focused proposal, not proof that all other classifications are correct.

## Separate concerns, not approved by this narrow proposal

p103's `nativePlaces: ["Yi"]` cannot be established solely from the fact that
he held an office in Yi. Its `explicit` male-sex and diplomat role claims also
need separate evidence review; s0183 states he sent envoys, not explicitly his
sex or that he served as an envoy. Dated claims and hints need the independent
full date audit. This proposal does not authorize edits to those fields or
resolve any dates, identity or other candidate dispositions. In particular,
the separate s0222 Xuanyuan disposition defect still needs its own reviewed
repair. No canonical file, claim, lock, Git state, worktree, or build was
changed.
