# Jinshu 053, s0203: provisional Eastern Palace correction

Status: **isolated candidate, not an approval or chapter completion**. No
canonical chapter, queue, claim, lock, or date audit has been changed.

## Evidence and proposed wording

The source is `元康元年，出就東宮，又詔曰：「遹尚幼蒙，今出東宮，惟當賴師傅群賢之訓。`.
The narrative says Yu went out to take up residence at the Eastern Palace;
both existing English versions mistakenly say he subsequently *left* it in
the quotation. The [Jinshu text](https://www.shidianguji.com/zh/book/SK0712/chapter/1kfjj3kgstp2r)
likewise reads 出就東宮 / 出東宮. The [Jinshu critical commentary](https://ctext.org/wiki.pl?chapter=769660&if=en)
records 王隱《晉書》 出止東宮, a parallel witness explicitly adding 止
(reside). These witnesses are not claimed to be independent manuscript
lineages.

The exact bilingual proposal is the earlier draft by `audit_053` in
`89296b9:research/people/jinshu053-bilingual-editorial-repair-draft-20261019.md`:

- Literal: `In the first year of Yuankang he went out to take up residence in the Eastern Palace; an edict further said: "Yu is still young and untutored; now that he goes out to the Eastern Palace, he must rely on the instruction of his tutors and the assembled worthy men.`
- Idiomatic: `In the first year of Yuankang he moved to the Eastern Palace. An edict declared: "Yu is still young and inexperienced. Now that he is going to the Eastern Palace, he must depend on his tutors and the other worthy men for instruction.`

The separate `editorial_crosscheck` conversation found these replacements
locally defensible in `89296b9:research/people/jinshu053-independent-editorial-crosscheck-20261019.md`.
That assessment is not an editorial decision for this materialized candidate,
not a complete chapter review, and not permission to publish.

## Isolated artifact and checks

Derived from exact SHA-pinned `jinshu053-rong-v1-incomplete-20261020` inputs by
`data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-eastern-palace-draft-materializer-20261020.mjs`.
Output directory:
`data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-eastern-palace-v1-incomplete-20261020/`.

| File | SHA-256 |
| --- | --- |
| source.json | `91cac867cc9ca5b6512473472b58734158c1c3636e22d4a1318fab20c4e52394` |
| candidate.json | `97293630f82fde5709049a4ff4d9f84eea3f15e422cd6de0417f327ad2c6adc6` |
| editorial-history.json | `d43050e295bc83bc4321a3800aec20ff4f2d9759f86c0ca69703f1a1ef3f5675` |
| draft-component.json | `bbaff2c3fd4669b24b3f0d44c90b83d40d1e5fc2e2ce20e07c83d9f48817033c` |

The fixture's production strict compact extraction, editorial-document,
decision alignment, and applied-decision structural validators pass. Counts:
209 units, 375 candidates, 71 people, 518 mentions, 541 claims, 59 repair rows,
148 dispositions, no alias-disposition conflicts. Assertions preserve all
person records, surfaces/mention ordinals, and compact claims. These checks
only establish structure and alignment; they cannot validate history or
replace review. The merged history contains synthetic reviewer placeholders,
including inherited placeholders; none are real approvals.

## Unresolved questions and holds

- The quotation remains open through `s0204`. Its separately held 相長益
  interpretation (mutual improvement versus benefit to the prince) must be
  reviewed in context without closing the quotation at `s0203`.
- A fresh separate reviewer must evaluate the exact full candidate, all
  inherited provisional changes, and the matched s0203 person/mention anchor;
  earlier limited agreement alone cannot approve these synthetic decisions.
- The independently flagged `s0205` textual/office variants, other held source
  restorations, and the s0202 terminology question remain unresolved.
- This new source fingerprint makes old date-audit approval inapplicable;
  preserve the existing research-blocked audit and its ownership, and obtain a
  fresh independent complete audit after source and editorial closure. Identity,
  publication, full chapter and downstream gates remain open.
