# Independent materialization check: Jinshu 025 s0537 + Wang Mang

This is a bounded comparison of `/root/seal_materialize`'s new saved combined
research artifact. It is **not** a canonical curation receipt, full date
audit, identity decision or chapter approval. I authored the earlier s0537
editorial component and the earlier Wang Mang source dossier; this makes me
independent of this combiner, not a new independent adjudicator of those
underlying editorial or chronological conclusions. Separate reviews of those
inputs are already recorded. Null historic chunk IDs do not establish reviewer
independence.

## Checked byte hashes

- Combiner: `713b27c7ba4c73d125eb3854834d87ca5a51eba9fc296876b48998af96db19de`.
- Combined `source.json`: `02c4c78e636051d3e81397d696443984f3963ebaad881805befcc60a92c6be78`.
- Combined `candidate.json`: `a5f5514f0f3ed3ce8638cf5da13028184af76684560937417bc04f5d7594f910`.
- Combined `editorial-history.json`: `a2f590d7cd367d4293b69ae00cddbd4e3c1c105981c1ff845a60e493db841530`.
- Combined `manifest.json`: `df100510895c34a1dfd355fd05593a071c68488dd3a77f5e27a71574d5d79c75`.
- `INCOMPLETE.txt`: `837d6ec221d529d1135ad75bf0d4b8dbb3f8a49d9b9a5278a9c2f2ad461d25af`.

I checked that all three manifest outputs have their reported hashes and
byte lengths. The source and complete editorial history are byte-identical
to the s0537-applied branch. The qualified Wang branch has byte-identical
source and history to the common three-date-holds ancestor. Replacing only
claim 140 and p047's active-hint array in the qualified Wang candidate with
the ancestor's values reconstructs that entire ancestor; replacing only those
two fields in the combined candidate with the s0537 branch's values
reconstructs the entire s0537 candidate. Thus the result retains the earlier
three chronology changes and the editorial branch's eight applied repair
rows without silently importing other differences.

The transferred claim retains exact source text `王莽用黃貂`, certainty
`uncertain`, and just one `onOrBefore` AD 13 year-precision bound; it has no
lower bound or exact day. The transferred active hint explicitly conditions
the reported single change on the Hanshu narrative sequence and scholarly
placement of the dowager's death. This qualification is in the active hint;
the temporal object itself does not contain the narrative. The final
evidence-bearing curation and independent date-audit records must preserve
that source and inference and must not present it as a direct Jinshu date.
This check accepts only faithful combination, not the historical inference.

## Stage-pinned testing

I verified the existing separate 16-file fixture against the exact
`e02a499df802b8c0eaa8f5cf9f06397c397fad11` Git objects, then reran
`test-jinshu025-s0537-wang-combined-20261019.mjs` under the stage-pinned
module loader. Strict extraction and applied-editorial-history validation
passed: 607 units, 683 candidates, 80 people, 173 mentions, 448 claims,
eight repairs, 528 dispositions and no alias-disposition conflicts. The test
reconstructed both branch ancestry relationships, rejected byte changes to
all nine pinned inputs, and confirmed a rerun refused the existing destination
without changing the candidate. Local Node dependencies were not independently
version-pinned. At observation staging was
`c149b40dd30b3692bfea7f1cdd19e9b40636e5a1`; the relevant validation inputs
matched the pinned revision in the immediately preceding check. Verify again
against live staging before canonical action.

This artifact remains incomplete; remaining chronology holds, the protected
host-controlled curation receipt, fresh independent complete date audit on
final fingerprints, identity resolution, and publication/search/backlink/ebook
checks remain outstanding. Do not alter or release retained sticky claims or
locks on the basis of this comparison.
