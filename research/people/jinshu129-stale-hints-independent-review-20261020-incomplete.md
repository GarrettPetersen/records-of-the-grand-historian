# Independent review: Jinshu 129 stale hints (incomplete)

This is focused research, not chapter or publication approval. The reviewed
generator SHA-256 is
`658272e90b5077482256e364d15c8d5fea3b976954a4498c8d8b735f8da4ace5`;
its candidate JSON SHA-256 is
`2947793437381e85fbe6274462dac158f7336d0c785fbe735d90e3aa7b9eb89b`.
The input precise-mentions candidate is pinned at SHA-256
`86ca0e189587e6c1fd86f99d11be8c9759da26c4e4309974c25632e229c92496`;
the code revision is `8bfd06b65c815884cf91ba206d3617629e7569d0`.

In a disposable small snapshot, the generator reproduced the candidate
byte-for-byte. The exact-stage packet builder and strict compact extraction
validator passed; the generator also passed retained editorial-decision
validation. Independent structured comparison confirms that source,
editorial history, and all other extraction fields are unchanged. Exactly 12
disposition rows were removed; no other disposition was added or changed.

## Independent same-unit checks

Each removed hint below now resolves to one same-unit candidate reference on
the stated person's existing mention, with the source Chinese witness also
linked to that person. English spans are exact except `Qifu`, which is
contained in the full name `Qifu Tuiniiyin`:

| Candidate suffix | Unit | Candidate | Person | Chinese witness |
| --- | --- | --- | --- | --- |
| `560fb004e59ac078` | s0180 | Qifu | p098 | 乞伏魋尼寅 |
| `d79aa3be41ba8ee4` | s0155 | Wen Zhi | p088 | 文支 |
| `b8d552029d048e7a` | s0156 | Wen Zhi | p088 | 文支 |
| `4e3f4a1d44f0e570` | s0177 | Lady Che | p095 | 車氏 |
| `03372e7265bd4926` | s0193 | Hanping | p102 | 漢平 |
| `b7ad6a3e2f16335f` | s0195 | Hanping | p102 | 漢平 |
| `0eef7b493a029b90` | s0196 | Hanping | p102 | 漢平 |
| `fa732e36c743342d` | s0217 | Liu Yu | p118 | 劉裕 |
| `1d1a8aa69dfa6db8` | s0217 | 劉裕 | p118 | 劉裕 |
| `d26850cd390147a1` | s0218 | Liu Yu | p118 | 劉裕 |
| `2ad774e489e164e6` | s0218 | 劉裕 | p118 | 劉裕 |
| `da9c82ef41334e05` | s0223 | Liu Yu | p118 | 裕 |

The s0223 shortened 裕 is supported by the preceding context's 劉裕; this
review does not assert broader cross-chapter identity or chronology. Removal
of the stale notes is supported at the above scoped mentions, but strict
validation does not guarantee full human-name coverage.

## Remaining coverage hold: s0195

The Chinese sentence `漢平長史焦昶、將軍段景密信招熾磐，熾磐復進攻漢平。`
has **two** 漢平 occurrences. The current extraction links p102 to only the
first, code-point interval [0,2); the second, [22,24), is not linked. The
English `Hanping` [83,90) corresponds to the second occurrence. The rebuilt
scanner has no Chinese 漢平 candidate in this unit, so a successful candidate
accounting gate does not detect this omission. Source-review an additional
p102 Chinese mention and all affected expanded mention IDs and downstream
references before approving a revised candidate. This missing backlink predates
the 12 removals and is not repaired by this candidate.

The previously noted s0223 鎮星 `deity` category remains a separate inherited
review hold. This review did not audit all other mentions, claims, translations,
identity, chronology, historical approvals, or publication gates. Preserve the
sealed history and independently verify any subsequent revisions.
