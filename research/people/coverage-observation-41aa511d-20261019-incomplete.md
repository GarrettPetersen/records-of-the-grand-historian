# People glossary coverage observation (incomplete)

Observed at 2026-10-19T03:53:48Z. This is a checkpoint observation, not a
chapter-completion report. Remote staging was `41aa511d3c0d1312c42f299e946efd2d997bf74d`.

The staging Git tree contains 4,099 chapter source files and 1,527 extraction
files; Jinshu accounts for 130 source files and 43 extraction files. A tracked
file is not proof of current prompt, validation, editorial closure, or readiness.
The extraction-ready, editorially closed, currently date-approved,
identity-cleared, fully complete, and published counts were not established by
this file inventory. They must not be inferred from those file counts.

For comparison only, a read-only `people-date-audit.mjs status` run against the
mixed, dirty shared checkout (not the staging tree or deployed master) returned:

| Scope | Audited | Stale | Unaudited | Needs revision | Research blocked |
| --- | ---: | ---: | ---: | ---: | ---: |
| All 4,099 | 120 | 67 | 3,683 | 20 | 209 |
| Jinshu 130 | 1 | 9 | 115 | 3 | 2 |

These are report-validation and fingerprint statuses, not a finding that the
underlying work is correct or that any chapter is complete. In particular, the
local audited report for Jinshu 127 is not the later report on staging; known
source defects require further work. Working-tree status must not be presented
as staging or deployed status. No deployment or publication count was verified.

This observation does not establish lane usage, costs, retries, throughput,
or rework totals. Those remain unknown rather than assumed to be zero.
