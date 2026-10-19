# Independent focused review: Jinshu 129 materialization — defects found

Reviewer: Codex conversation `/root/jinshu129_target`, independent of the
materialization author `/root/claim_application`. This is a focused comparison,
not a whole-chapter editorial, date or identity audit. Do not publish this
candidate as-is.

Inputs: staging `b9128a4fd65148e0b87f3e2bc9e1fdfee4279be9`; materializer
`research/people/jinshu129-final-materialization-20261020-incomplete.mjs`,
SHA-256 `591fc8466eb7a72b9d7fbd61f32f8290258a46d9bf253e8b69c28b8712ae7488`;
materialization `research/people/jinshu129-final-materialized-20261020-incomplete.json`,
SHA-256 `3aeaf2fc42220e9beeca59388b778b8988db53542ac3ba49fba8e95e17024c26`;
rebased dossier SHA-256 `758a8584f2430eb8604bef47bfb21cd34822d318a483485e63ec54c0a725e367`;
review decision SHA-256 `9a8ae3bffb3bd13e75e3aae86b2130f59e894e2ee142f4aa9a245eb6fb016f80`.
Its pinned staged source, extraction and editorial history byte hashes are
`bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800`,
`91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8`, and
`ff5170c7fefc5542092c0c7be0955f069c04bc60c642d52868e3fd2a5b3fe4e2`.

## Verified focused outcomes

The final source differs from the staged original only in the reviewed s0020
and s0023 idiomatic fields: reversing those two exact replacements restores
the complete source object. Against the rebased dossier, all normalized claims
match the pre-edit claims except the reviewed c0667 revision: Lü Hong left
Zhangye and was **about to** flee east; its role is `departing person` rather
than `fleeing-commander`. Normalized people match. The result's editorial
history equals the normal merge of the prior history and the rebased decision;
the local applied-history validator accepts it. Earlier reviewed sex removals
and contextual Xijun claim changes are retained from the evidence candidate.
These comparisons use the local compact expander and decision library.

## Unreviewed automatic dispositions — hold

The materializer added two candidate dispositions. Both need correction, not
blind acceptance:

- `cand_8dc4288346d219dc`, s0183 English `Yi`, is 益州, a province; the
  generated disposition calls it `polity` and notes `Jin`, confusing it with
  the separately named Eastern Jin. Classify it from its exact local context.
- `cand_d162756b159cff9a`, s0222 Chinese `軒轅`, is in `姚氏舜後，軒轅之苗裔也`:
  the Yao are descendants of Xuanyuan, the Yellow Thearch. The generated
  disposition instead says it is an astronomical asterism and not the Yellow
  Thearch. That astronomical sense occurs in the next sentence s0223, not
  s0222. The existing extraction **already links** s0222 Chinese 軒轅 and
  English Yellow Thearch to p122; this new disposition contradicts that
  link. Do not create a duplicate person or suppress the existing mention.

Thus the candidate contains unrelated unsafe automatic changes despite the
materializer's passing structural check. Review the reconciliation mechanism
and make a separately reviewed, source-aware candidate; preserve this artifact
as evidence. Structural validation alone is insufficient to approve it.

## Validation limitation and remaining work

The generator records a strict-validation pass using a fixture claiming the
staging implementation. An independent local attempt to validate the final
compact extraction failed because the local compact schema rejects added
identity-hint properties on all 136 people; the local code/schema differs from
the materialization environment. This is not proof that the staging validator
failed. Re-run exact-revision validation after correcting the dispositions,
and independently verify resulting editorial history and candidate coverage.
The retained date report is research-blocked, and whole-chapter editorial,
fresh independent date audit, identity, person pages, backlinks, ebook, and
publication/CI checks remain open. No canonical input, claim, lock, shared Git
state, build or existing artifact was modified by this review.
