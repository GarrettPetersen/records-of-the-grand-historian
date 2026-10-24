# Five Jinshu date holds: current-state promotion assessment (incomplete)

Research only. This does not record a report, establish a live lease, approve a
chapter, or prove that any historical year is false. On this check, remote master
was `e2a3f340d4e53aed243e989e8005007ba42d4f2b`, staging was
`854314e191cf702909e856f5f91340acd80aa9d3`, and the shared queue was
`4aca09929f40d88b55271e75e780d6423d494b2c`. These are snapshots, not locks.

For 093, 109, 117, 119, and 130, independently compared Git blob IDs for each
chapter source, compact extraction, and existing audit across those two branch
heads and reviewed baseline `6b3fe7a8c4f5072b9fd44e5e74140d8a1fd88b17`:
all 15 are unchanged. Each stored master/staging audit says `audited`. The
independent nine-hold manifest check and five-hold source review in staging
demonstrate that each of these audits asserts support for a particular date
whose sole cited passage neither identifies the target person nor substantiates
the date. This makes the recorded evidentiary approval unreliable; it does not
exclude unrecorded evidence or prove the stated dates wrong.

Staging research checkpoint `research/people/checkpoints/jinshu-quality-holds-20261019-incomplete/`
contains a partial `research-blocked` proposal and receipt for each chapter.
Fresh SHA-256 checks of the Git blobs match the saved independent review:

| Chapter | Proposal byte SHA-256 |
| --- | --- |
| 093 | `50862b9efe6f5a2c7ef1a9bbed60ecafff296d6ab0ae0d2573a131ff0b7ba4a2` |
| 109 | `b2ca5de17078093dc6ab64a9427f767c9e7016a7f8b040ad70183ac289226caf` |
| 117 | `ad5dd49a9fbb5e75dbf825c065a056d9776f351dc4e99f78af69a02e31d35ac8` |
| 119 | `9265ff871d0df3059a902dd2e0c59872b9017ea1af3f4c84755a8acd570cb3f2` |
| 130 | `f7e3e5bf3b9a6d77e721b6aceb890b2878ba845cf4ffecad6dfc5c1128c404b1` |

The separate `jinshu-five-date-holds-independent-review-6b3fe7a.md` reports
rebuilt packet matching and successful `validateDateAuditReport` for all five,
as well as its source comparison. Their author `/root/near_complete_jinshu`
did not match recorded extraction agent IDs; the independent review was by a
different agent. The original audit metadata lacks a reviewer agent ID and the
extraction metadata cannot prove all authorship: reviewer independence remains
an attestation, not a cryptographic or exhaustive identity proof. The reports
each cover only one finding and two units and do not approve the full chapter.

At the queue snapshot, none of these five scope keys occurs in `claims`,
`dateAudits`, or `dateAuditHistory`. None has a local
`data/people/generated/date-workflow/jinshu/NNN` directory, and a local process
name scan found no date runner. These observations rule out neither a remote
writer nor a new claim after the snapshot; they are not authority to take over
any worker or assurance of exclusive ownership. The 128 OpenRouter sticky claim
is separate and remains reserved.

**Promotion disposition:** the five candidate reports are already preserved
and independently source-reviewed as research; none is demonstrated safe to
record or publish into the canonical date-report path solely from the above
snapshot. Re-check exact branch/packet hashes and queue ownership immediately
before host-controlled publication; establish an actual non-interrupting
single-writer protocol including direct recorders, preserved prior-report
bytes and recovery, and enforce reviewer provenance. `recordDateAudit` in the
shared checkout archives a parsed and reserialized prior object before
overwriting, not necessarily the original report bytes, and an independently
reviewed archive design documents writer/race limitations. Do not discard the
old reports, overwrite a live claim, or assume an absent queue key fences
uncooperative writers. On a safe future transition, retain exact before/after
bytes and run current packet and status validation. Subsequent source or
extraction edits make these report fingerprints stale and require renewed
review. Fresh comprehensive independent audits remain required.
