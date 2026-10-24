# Jinshu 053 selective reconciliation v3: independent scoped review

Status: **incomplete research; not publication or complete-chapter approval**.
Reviewed 2026-10-19 UTC. I did not author the selective materialization or the
seven decisions. I independently reviewed the original simulation's semantic
delta, the new v2 output, and then the following frozen v3 bytes:

* `source.json` SHA-256 `a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d`
* `extraction.json` SHA-256 `13215bc5ec25605eda82e9ae22e99786480821e61b5a709faed7816e0445f22f`
* `editorial-history.json` SHA-256 `da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7`
* `review-decisions.json` SHA-256 `e13553b417b78da78b58dfc8e5cb267dd825e60345c72af572a3dcf01c00115a`
* `semantic-delta-v3.json` SHA-256 `e8fd371916ab611c3e7993dddd310fa2eeac99853a5ff004b49a0541bb64f53b`

These files are in `jinshu053-seven-selective-reconciliation-v3-20261019-incomplete`.
They are not canonical. The source-derived chapter fingerprint is
`sha256:ff9a510d9110982e5a0fbd25ef15709067b33a52ae787c11c8b4b13a71594c88`.
Strict extraction and applied editorial-history validation using the **current
checkout** passed for this packet: 209 units, 364 scanner candidates, 71
people, 492 mentions, 538 claims, 114 repair records, 145 dispositions and no
alias disposition conflicts. This is structural evidence, not proof of
historical correctness or downstream approval.

## Source and mention findings

Compared all semantic mention deltas of v3 against v2 with mention IDs removed.
The only v3 changes were removal of the three p026 `Jia` spans on collective
`Jia clan`/`Jia kin` expressions at s0037, s0039 and s0189, and the addition
of a paired English `late emperor` span to the existing s0132 p004 Chinese
`先帝` mention. Claims, people and repair records are unchanged from v2.
The three candidates now have individual `not-person/collective` dispositions;
the s0037 separate `the empress` mention for p026 and other persons remain.
The s0132 English span is code points 63–75 of its idiomatic field, and the
freshly built packet validates its source text hash and geometry. `you` is a
pronoun, not a named span to synthesize here.

The earlier 23-ref audit found that the selective output preserves all eleven
candidate refs for `Prince` inside specific title mentions, the s0047 p001
`Crown Prince`, and eight contextual individual Jia references. The three
collective refs are now handled as above. See the companion prior-simulation
review for exact IDs and source contexts; candidate IDs must be checked anew
if the source changes.

For changed s0065, v3 links `Crown Princess Wang` and 太子妃王氏 to p038,
not father p037; `Consort Shufei Xie` and 謝淑妃 to p003; `Jiang Jun` and
太子保林蔣俊 to p027; Dan/澹 to p053; and marks both `Jinyong City` and
金墉城 as places. The English `Prince of Nanyang` and Chinese 南陽王 at
s0172 both link to p028, subject to the separate preceding Chinese lacuna.
The s0131 and s0132 previously invented English personal-name surfaces are
not blindly reintroduced after rewriting. Scanner accounting and a retained
mention do not by themselves settle every contextual title or person.

The preserved decision file appends a seven-decision review authored by
`/root/independent_decisions`. Another reviewer raised objections, after which
the original reviewer personally reassessed the three disputed decisions; the
record's reviewer attribution is consistent with that sequence. The applied
repair records contain the revised/accepted decisions, but that history does
not certify an independent full-chapter editorial sweep.

## Open blockers; no downstream approval implied

The 538 claims and 71 people were carried forward unchanged. Earlier source
review identified c0106's `heir guardian` rank for Jiang Jun, c0186/p051's
`Sima Tong` name, the unsupported s0017-to-p028 child attribution, associated
parentage/birth-order/sibling qualifiers and c0528's asserted death authority
as needing reviewed repairs. The omitted 虨 characters in s0170 and s0171
also require the separately reviewed source-correction process. The present
selective output does not make those fixes, prove all other inherited claims,
or close editorial coverage. A fresh source-bound date audit, affected identity
reviews, safe canonical application and publication/ebook gates still remain.
Any subsequent edits invalidate fingerprints and require revalidation and
review on their exact resulting bytes.
