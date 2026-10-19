# Independent review: Jinshu 053 s0204 quotation (research only)

Reviewer: separate Codex conversation `/root/review053_combined`. Scope is the exact noncanonical `jinshu053-quote-s0204-v1-incomplete-20261020` candidate against `jinshu053-edict-title-link-v1-incomplete-20261020`, not a whole-chapter endorsement. No canonical files or queue state were changed.

## Source and judgment

The local Chinese reads `其遊處左右，宜得正人使共周旋，能相長益者。` The passage opens an edict quotation at s0203 and closes it at s0204, as both proposed English versions do. The prior s0203 movement to the Eastern Palace is preserved. The subsequent s0205 says named officials' sons were made to keep the prince company `以相輔導焉`: the prince's guidance is important context, but does not conclusively establish whether s0204 `相長益` is mutual improvement or improvement directed toward him. The new wording's nonspecific 'foster growth' avoids insisting on reciprocal improvement; that aspect is defensible without claiming a settled interpretation. See the [Jinshu parallel text](https://www.shidianguji.com/zh/book/HY2499/chapter/1mb9kswm55zjf), [Tongdian parallel](https://ctext.org/text.pl?if=gb&node=553630), and [Japanese philological rendering](https://repository.kulib.kyoto-u.ac.jp/dspace/bitstream/2433/240644/1/rek16_03.pdf). The Tongdian parallel is not necessarily an independent witness to the historical event.

One nuance remains: `宜得正人` prescribes obtaining/selecting upright people, whereas 'those ... should be upright men' states a qualification without expressly conveying that selection. This is a possible loss of force rather than grounds for inventing additional events. A possible later, separately reviewed wording is: 'For those in attendance and keeping him company, upright people should be found who can associate with him and foster growth through their companionship.' The exact object of `相長益` should remain explicitly uncertain. No change is authorized here.

The unresolved adjacent s0203 `師傅群賢` construction and s0205 variant remain held; the earlier research suggests 'the worthy tutors' is a plausible alternative to categorically identifying two separate classes. Earlier p038, editorial, chronology, identity, completeness, and publication holds remain unchanged.

## Exact-artifact checks

All manifest-declared predecessor and output file SHA-256 digests matched the actual bytes. The output candidate SHA-256 is `d898aca060b0914f858bf3ec2e4a3cd5a8cdf2ec5953319ee7d7ef4ab84fb296`; source SHA-256 is `a5b100cbfd54d44f1dbc224b36651c3bba65bcc4fe6a2ef6eab66b1aefb4f232`. A recursive comparison found exactly two source changes, the literal and idiomatic translations of s0204; the Chinese and every other source field were identical. All `people`, `surfaces`, `claims`, `candidateDispositions`, `coverage`, `run`, and schema/scope values were identical. The two added repair rows preserve all 61 preceding repair rows; candidate input and repair history change as expected.

With the existing pinned staging-code fixture `/tmp/jinshu053-strict-5ce.NuGR9k1r`, strict compact validation passed: 209 units, 375 candidates, 71 people, 520 mentions, 541 claims, 63 repairs, 149 dispositions, zero alias-disposition conflicts. Applied-editorial history structural validation passed. A deliberately changed chapter fingerprint was rejected. These are structural checks, not semantic or reviewer-independence approvals.

Important compatibility hold: the validator imported from the current shared checkout rejected all 71 existing person attribute objects for additional properties; the same candidate passed with the pinned staging validator. The candidate did not change those person objects. Reconcile the actual target revision/schema before attempting publication; do not characterize the current-checkout test as passed.

The supplied draft component names a synthetic placeholder with null actual reviewer identity, not an independent approving reviewer. No complete candidate, prior repairs, identity resolution, chronology audit, or chapter publication is approved by this report. A genuine independent review on the exact eventual source and candidate is still required.
