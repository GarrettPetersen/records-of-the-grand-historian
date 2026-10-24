# Jinshu 053 current-input eligibility evidence — incomplete

This is a read-only staging audit, not a chapter approval or publication
decision. Git tree: `69b5868753ad48d46da7058f3cac4dcdd7ceb112`. The local
script-only fixture is an export of that tree; it is not a checkout and the
real chapter, queue, locks and Git index were not changed. The fixture's
`1/1` coverage below describes only the one exported source chapter, not the
Book of Jin or corpus.

## Exact input bytes (SHA-256)

| Git path | SHA-256 |
| --- | --- |
| `data/jinshu/053.json` | `85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407` |
| `data/people/extractions/jinshu/053.json` | `464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69` |
| `data/people/editorial-decisions/jinshu/053.json` | `b0b4a054119e26645b957b10703559d0ba5041b47f0ae207bcc682708a4df45a` |
| `data/people/date-audits/jinshu/053.json` | `d3bb12dbc7db670357affb2e216790baffb359db62ce78478ff3d37c1ba93073` |

Staging validator hashes: `validate-people-data.mjs`
`9d9c0ef5d73288d457619d838e4743204ae7e3d16605c6e51de77523ba75be9e`,
`validate-people-extraction.mjs`
`33b59627388be1735eae3a05fb0b36b4580eb8b2c4924b063f2f7ad66e1af2c6`,
`lib/people-date-audit.mjs`
`97f8d0657ee459b4770e09a52aee183e0fcf317d5874999fea333cfc53c83306`,
and `lib/people-editorial-decisions.mjs`
`8c61394d8376d4c13263341f2a054a55bd67ed227da63f11a822050cfc1f0af6`.

## Supported validation and review provenance

In the staging-export fixture:

```text
$ npm run people:validate -- --book jinshu --chapter 053
Scoped person data validation passed for jinshu/053: 1 extraction(s), 71 local people, 516 mentions, 541 claims, 0 proposed repair(s), 8 applied repair(s), 8 editorial decision(s), 0 claim retraction(s), 0 claim revision(s), 0 claim addition(s). Legacy temporal debt: 0 person record(s) without an attestation, 0 without an active-date hint. Legacy alias-disposition debt: 0 candidate(s) in 0 chapter(s). Corpus coverage: 1/1 chapter(s), 0 remaining.
```

Using `buildPeopleExtractionPacket` and `validateCompactPeopleExtraction` on
the same files with `{strictAliasDispositions:true}` independently passed:
209 units, 374 candidates, 71 people, 516 mentions, 541 claims, eight repairs,
139 dispositions, zero alias conflicts. `validateAppliedEditorialDecisions`
also passed on the authentic editorial history and normalized extraction.

The extraction records model `grok-4.5`, prompt version 7, and extractor agent
`bc-c196b973-e444-4151-8587-f3264ed37970`. The eight-decision editorial review
records reviewer agent `bc-83725135-a43f-4a82-bf42-1773aa145950`, a different
conversation, and its proposal fingerprint is
`sha256:11bd7078c28eb95f0519dec389bc8d3b289ad1e7bff0314abca361c44017a005`.
Its original chapter fingerprint is
`sha256:ef0a1c8840af368b058e4193bd3550608e2387c0581c81e27b8bf201d0dc3e5f`;
the current extraction chapter fingerprint is
`sha256:b50f8457f354fb33c4d133a38605edcb6a841019b536689c9a7000f2286c15ae`.
Those differ after applied repairs; difference alone does not invalidate the
review. The supported applied-history validator, not a raw comparison with the
original fingerprint, is the evidence that the eight decisions match the
current extraction. It is not a full independent identity/source audit.

The current `buildDateAuditPacket` hashes are source
`sha256:fab0a59c5d375ac889d03e7530b083fed82c11b4521823e1330e8840637b84f1`
and extraction
`sha256:a23f128f1371dc93275fa0f54af14e3d5952530b3e0e57975ccded564208c3b9`.
`dateAuditStatus('jinshu','053')` validates the report against these current
hashes and returns `research-blocked`, audit version 1, reviewed at
`2026-09-23T12:09:28.433Z`, with one finding. The auditor is recorded as
independent of the extractor; the finding identifies p004 and claim-101,
claim-102, claim-116 and hints-p004: the chapter's childhood, age-five and
affection passages give no secure era, year, reign or independently anchored
event. The auditor preserves unresolved source contexts and calls for external
historical research. This does not establish any proposed Western date.

## Identity scope and conclusion

There is no tracked `data/people/combined-curations/jinshu/053` receipt in
this tree. A read-only scan of the 80 tracked resolution documents mentioning
`jinshu:053:p` found 595 decisions involving 45 distinct 053 local people:
542 `keep-separate`, 33 `merge`, and 20 `possible-same-as`. These counts are
not unresolved-comparison counts and do not mean the decisions are wrong. A
fresh, current candidate graph and cross-chapter consistency check are needed
to assess completion. The existing resolution documents do not independently
record per-participant extraction hashes; supported host invalidation and
reviewed history must be considered rather than automatically discarding or
approving legitimate prior decisions.

The checked-in current report is genuinely research-blocked, so 053 cannot
be called date-approved or fully publication-ready, regardless of the passed
extraction and editorial checks. This audit did not rerun the whole corpus,
resolve identity, verify chapter links/person pages/search/ebook, or alter the
production publication gate. A combined-curation receipt, if obtained later,
would need its supported production review and current source/extraction
checks; its existence alone would not establish global identity resolution or
all release artifacts.
