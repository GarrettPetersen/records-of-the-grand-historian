# Independent review: Jinshu 129 mention proposal (incomplete)

Reviewed separately from the proposal, without modifying canonical data. The
reviewed proposal SHA-256 is
`c6adec79222c68439df9bbad2a9bb60e663e94537feeef04e3a6c0b963334536`.
Evidence is staging revision `fce861bb48533eeb388dc5573a60000f14167984`,
including chapter source SHA-256
`bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800` and
the committed final-materialized wrapper SHA-256
`3aeaf2fc42220e9beeca59388b778b8988db53542ac3ba49fba8e95e17024c26`.
The packet and candidates were rebuilt offline using the pinned stage scripts,
glossary and the wrapper's source, in a small disposable snapshot.

## Findings

The proposed narrowing is source-supported: s0183 identifies Zhu Lingshi as
the person, while Yi is a place and Eastern Jin a polity; 益州 and 刺史 are a
place and office respectively. The existing p103 English title reference in
s0183 covers the province and polity unnecessarily. The Chinese compact
surface groups s0183 with s0188, which must be split deliberately to avoid an
unintended change. In s0188 the English personal-name mention is already
narrow; the Chinese name can likewise be narrowed without changing the text.

The proposal omits a pre-existing stale disposition that should be reconciled:
s0188 `cand_ea6519a039092626`, exact English `Zhu Lingshi` [12,23), is already
covered by its exact p103 personal-name mention but has a `duplicate-hint`
whose note refers to the s0183 broad title reference. Review/remove that stale
disposition according to the strict reconciliation contract, preserving the
existing s0188 mention. Do not leave an explanation pointing across units.

For s0184, `cand_8a551c2a741c2b24` is English `Yi`, matching Chinese 益州 in
the sentence; its existing `polity`/`Jin` classification conflates the
province with the polity. A focused change to `place`, leaving the separate
Chinese place disposition intact, is justified. The proposal's cautions about
native place, sex, diplomat role, chronology and the separate Xuanyuan issue
are appropriate: these are not established or resolved by the cited spans.

## Offset check

All below are zero-based half-open Unicode code-point offsets, independently
recomputed from the pinned packet with `Array.from`/code-point slicing:

| Unit | Language | Range | Exact text |
| --- | --- | --- | --- |
| s0183 | en | [0,47) | Zhu Lingshi, governor of Yi for the Eastern Jin |
| s0183 | zh | [1,8) | 益州刺史硃齡石 |
| s0183 | en | [0,11) | Zhu Lingshi |
| s0183 | zh | [5,8) | 硃齡石 |
| s0188 | zh | [6,9) | 硃齡石 |
| s0188 | zh | [2,4) | 益州 |
| s0188 | zh | [4,6) | 刺史 |
| s0188 | en | [12,23) | Zhu Lingshi |
| s0184 | en | [68,70) | Yi |
| s0184 | zh | [9,11) | 益州 |

The rebuilt scanner confirms all candidate IDs and surfaces named in the
proposal as well as the additional s0188 English candidate above. This is a
source-and-proposal review, not a validation of a modified full extraction,
independent chronology approval, identity decision, or publication approval.
Any candidate must still undergo strict validation and the normal independent
review and publication gates, including inspection of affected downstream IDs.
