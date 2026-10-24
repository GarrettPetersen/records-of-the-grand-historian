# Jinshu 101 date-audit evidence hold (incomplete)

Read-only inspection of staging revision `1da4e6a2ca9df03d780ab18762e43e5e50b787a2`.
This is a quality hold for further review, not a replacement audit and not a
claim that any historical date is necessarily false. No canonical files or
historical reports were changed.

## Exact inputs

- `data/jinshu/101.json` file SHA-256: `221808c006bb5d8250863e40a79c07a056dd4f0137f273fe7e91e1c6f22d51c8`.
- `data/people/extractions/jinshu/101.json` file SHA-256: `7aae76a6377c5ed33c633a8688fd8db7b0baf9b1e0e1cf984b368d6d53e7ad99`.
- `data/people/date-audits/jinshu/101.json` file SHA-256: `d195f9298f6029667b540686f05117869ba6999dd97d9ff0011cbbda4a1d0355`.
- The report's source/content fingerprint is `sha256:36504ddac4e4d3159b34f437c4790d0531c6a6df44b26dfd7a1e2b0a316e75b6`; its extraction fingerprint is `sha256:ed366dd5d21d5675b6459e5be6622c239ba93116d29f0027320af7e85bb742a0`. Both match the staging inputs using `contentUnits` and the `sha256(JSON.stringify(...))` convention in `scripts/lib/people-date-audit.mjs`.

## Reproducible concern

The report says `audited`, and `validateDateAuditReport` accepts a packet
constructed from these exact staging inputs. It declares 263 reviewed units,
445 item checks and 201 person checks; all 445 item reasons repeat the same
general sentence, all 201 person reasons repeat another, and `references` is
empty. The reviewer has a descriptive name and `independentOfExtractor: true`,
but no reviewer agent ID is recorded. Repetition alone does not prove a review
was not performed.

The following specific support citations, however, do not support the dates or
identify the person whose active hints they purport to substantiate:

| Item | Extracted person and active hint | Report's only quoted evidence |
| --- | --- | --- |
| `hints-p008` | Confucius, `BC 551-479` | s0001 `劉元海（子和） 劉宣` |
| `hints-p009` | Guan Zhong, `BC 685-645` | s0001 `劉元海（子和） 劉宣` |
| `hints-p010` | Emperor Xuan of Han, `BC 74-48` | s0001 `劉元海（子和） 劉宣` |

That s0001 excerpt names Liu Yuanhai, his son He, and Liu Xuan; it contains
none of the three dates or names in the table. The report records no external
references. Consequently these particular support assertions lack cited
evidence in this report, even though the validation result is green. That does
not establish whether the hints themselves are historically correct or whether
other uncited evidence exists.

Next: preserve the original report, recover any separately retained sealed
review conversation and actual source evidence if it exists, and arrange an
independent source-based re-audit of the current chapter and hints. Correct or
remove any unsupported hints only through the normal repair/re-audit workflow;
do not infer author identities or overwrite approval hashes. Identity,
editorial independence, chapter links, and publication remain separate gates.
