# People glossary progress snapshot — incomplete

Observed at 2026-10-19T07:43:15Z. Remote staging was
`b96bc65e27a8a1430e529004c1b5676f8a0961ec`; remote master was
`26ebf8c830a43c3eb0a15e361c72436bd946c83e`. This is a read-only
snapshot, not an approval or release authorization.

## Deployed progress data

The deployed `https://24histories.com/data/progress.json` and its linked Jinshu
chunk both report `generatedAt` of `2026-10-19T05:29:27.694Z`. They do not
identify a source revision, so this snapshot is not independently proven to
correspond to the master SHA above.

| Site progress proxy | Whole corpus | Jinshu |
| --- | ---: | ---: |
| Source chapters | 4,099 | 130 |
| Extractions, any prompt version | 1,466 | 32 |
| Current-prompt extractions | 1,456 | 32 |
| Current date-audited | 259 | 8 |
| Current-prompt with zero unresolved people | 33 | 0 |
| Site `current` glossary state | 15 | 0 |

Jinshu additionally has 30 current-prompt chapters with no proposed repairs;
this is an editorial-closure **proxy**, not proof of independent editorial
approval or artifact checks. Its date-status counts are 8 audited, 3 stale,
2 needs-revision, 5 research-blocked and 112 un-audited. The site classifies
24 Jinshu chapters as date-review, 8 identity-review and 98 missing.

The site's `current` state combines prompt version, date status, pending
translation repairs and unresolved identity people. It does not itself prove
the objective's complete validation, backlinks, person pages, search, ebook,
and publication checks. Therefore the number of **fully complete** chapters
and the number verified **published** under the objective are unknown; do not
equate them with 15 or with the extracted count. The 15 site-current chapter
IDs are xintangshu/069; songshi/078, 084; mingshi/038, 039; and
qingshigao/029–035, 046, 051, 053.

## Staging comparison

`git diff --name-only` between the master SHA and staging predecessor
`caed46a2329fef5f3464b0ea3ed655fc7e4ec80e` identified 63 changed tracked
extraction files. Reading each extraction and checking the corresponding
`data/people/date-audits/BOOK/NNN.json` directly in the staging Git tree found
no current date-audit file for any of those 63. No current date-audit paths
changed between the two revisions. Thus none of these 63 changed extractions
can pass the required date gate on that evidence, regardless of extraction or
editorial status. The 11 added Jinshu extractions are current prompt version 7
with zero proposed repairs; modified jinshu/126 has 134 proposed repairs.
These are not complete-chapter counts.

The only changes from `caed46a2329fef5f3464b0ea3ed655fc7e4ec80e` to the
observed staging SHA are three explicitly incomplete research files, so this
extraction/date-path comparison also applies to that staging SHA. It does not
establish that no other chapter could become complete due to changed code or
other evidence. No release candidate has been established by this check.

## Measurement limitations

`buildPeopleGlossaryProgress` consumes a freshly generated canonical catalog
and fingerprint-sensitive date statuses from the working data tree. The shared
checkout has substantial unrelated changes and its generated data therefore
cannot be assumed to represent either Git revision. Exact stage totals and
fully complete counts remain unmeasured; obtaining them needs a revision-bound
read-only evaluator or a safely isolated minimal fixture with all required
dependencies and verification, rather than rebuilding shared outputs. No full
build, additional checkout, claim mutation, or lock operation was performed for
this snapshot.
