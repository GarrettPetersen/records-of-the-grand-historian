# Jinshu 127 source findings and provenance blocker — incomplete

Research on staging revision `5a431c6a8be63bb0a70010c3c2d91901de945a02`.
Exact current source, extraction, and editorial-history byte SHA-256s are
respectively `1b0ed1664bdf27f77ff5a9f1cb635d82e2dd9772f5ede7d3c18e0ed558b93f99`,
`e55bb752bbe33b0fb5492616933c6c32645d47cdc296673f43e55ea9bc54caf6`, and
`5d707ac70687ae595bec5106e95ffcfca0bc20ecf14d051fc92779598022542e`.
The findings below are not a complete editorial review or approved repair
packet. No source, extraction, existing editorial history, or review seal was
changed by these findings.

The first source pass (`/root/j127_editorial_a` and `/root/j127_editorial_b`)
and a separate focused cross-check (`/root/j127_crossreview`) identified:

- s0004: Chinese gives eight chi and two cun. The idiomatic field's modern
  “eight feet two inches” is an unsupported conversion. Preserve the original
  units or provide a properly sourced approximation.
- s0078, s0091 and s0094: 慕輿 is the compound surname Muyu, not Yu. s0092's
  literal also uses Yu Hu, but its Chinese omits the subject; assess attribution
  from context instead of automatically asserting the person. The idiomatic
  already uses “He”. Current local entries and English surfaces for Yu Ba,
  Muyu Ba, Yu Hu and Muyu Hu need source-backed reconciliation. Do not silently
  merge them or assume every duplicate is the same person.
- s0126: 水路通浚 concerns open/navigable waterways, not waterways reaching a
  place called Jun. Both English fields need a reviewed correction.
- s0141: 遣使喻 reports sending envoys to persuade or admonish; the idiomatic
  “summoned” is not supported by this wording. Preserve the refusal context.
- s0148: the proclamation's 昔同段龕阻亂淄川 describes participation in
  rebellious resistance with Duan Kan in the Zichuan region, not “blocking
  chaos on the Zi River.” Preserve the speaker's accusatory framing. The
  existing overlapping kinship/name surfaces require separate reconciliation.

Hold s0138 for additional source research: reviewers disagreed whether
北圍臨齊 identifies Linqi as a place or means a northward move against Qi.
Do not adopt either interpretation without evidence. A previously reviewed
s0277 coffin correction is already retained in the staged Jinshu 127 closing
research chain; reuse that exact lineage instead of duplicating its review.
The status of s0178's office terminology also needs separate house-style and
source checking, not an automatic rewrite.

For each eventual repair, build the normal exact-source proposal and independent
decision; reconcile affected mention spans, candidates, claims and source and
extraction fingerprints. The prior broad review and retained 11 decisions are
not proven independent solely by these focused findings. Their reviewer IDs are
null. At this revision the combined-curation verifier requires a nonempty
reviewer ID for every historical editorial component while also preserving the
old history. Dependency-only refresh does not resolve this. Do not invent IDs
or replace history: either recover actual provenance or implement and test a
separately sealed independent re-review of the exact historical decisions and
claim actions. The re-review would not prove the original reviewer was
independent. Current locks, claims and retained artifacts remain untouched.
Full editorial, fresh independent date, identity and publication gates remain.
