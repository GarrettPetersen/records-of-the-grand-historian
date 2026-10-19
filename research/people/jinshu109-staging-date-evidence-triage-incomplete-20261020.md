# Jinshu 109: targeted date-evidence triage (incomplete)

This is a read-only source-scoped research note, not a whole-chapter audit,
approved repair, identity determination, publication hold, or completed
chapter. It does not establish that a historical date is false. Input objects
are from staging commit `75d816dd2af8cff40fa827813fd0721d78c7f739`.

| Input | Exact Git-object bytes, SHA-256 |
| --- | --- |
| `data/jinshu/109.json` | `aa15f4935b0154841972a9b61f6ecfbaee031bf3db500c5cf6888bc47a71f888` |
| `data/people/extractions/jinshu/109.json` | `e42c9e04d3b850076f96dc1c94721f2ad71cc819bc27cdb21187f55e84135c97` |
| `data/people/date-audits/jinshu/109.json` | `0fb2dcc5bf9462a5e9c3fb2864c29905051a1ffc2769274883e5ad5ef7c04808` |
| `data/people/editorial-decisions/jinshu/109.json` | `907ed415bf39d6cb7d0e8a3881398d184c8df1616fa75724c128298039b13c79` |

The 302-unit chapter extraction is prompt 7, has 181 people, and has 21
translation repairs marked applied with 21 recorded editorial decisions.
The existing staging-pinned strict compact extraction validator passed a
packet rebuilt from this staged source. This verifies structural extraction
properties, not complete editorial, chronology or identity review. The
editorial reviewer agent ID differs from the six recorded extraction chunk
agent IDs; further review evidence may still be needed to establish the full
chapter's editorial scope.

The date report says `audited`, has 181 person checks, 593 item checks, no
findings and no external references. Its recorded source hash
`sha256:7b644e966baf717c13dcaff442885247dc7af0ad5688480ab844e2fb2af26b02`
and extraction hash
`sha256:6dc9cbab2bd96a8c378b5dfd29e232c50988599b7ca17ac34a6835f4c24c1a02`
match the hashes recomputed by the staged date-packet algorithm over the
source units and extraction respectively. The report names an independent
reviewer but has no reviewer agent ID. Matching hashes and a declared reviewer
do not independently establish the correctness or completeness of the review.

All 181 report person checks use the same evidence, s0002 `慕容皝`, and the
same reason; all 593 item checks have the same generic reason. In particular,
person p002 is Murong Hui `慕容廆`, not Murong Huang `慕容皝`; person p003 is
Yuwen Qidegui `宇文乞得龜`. The s0002 title alone does not identify p002 or
p003 or substantiate their dates. This is a documentation/evidence gap, not
proof that the reviewer did no other research or that those dates are wrong.

## Specific chronology requiring source review

In compact extraction claim **61**, p002 (Hui) holds the title Duke of
Liaodong `遼東公`; the claim cites only s0006 and asserts `dateContext.sourceDate`
`建武初` and an AD 317 Western date with year precision. Claim **136** is a
p002 attestation with the same stated source date, same precision, and same
sole cited unit. Date report checks `claim-61` and `claim-136` label both
supported and cite only the full s0006 sentence:

> 廆為遼東公，立為世子。

The supplied English reads: “When Murong Hui was named duke of Liaodong,
Huang was made his heir.” The clause states Hui's title and establishment of
an heir, but the Chinese sentence itself does not contain `建武初`, an
absolute year, or an explicit assertion that the holding began in that year.
As context, s0003 names Murong Huang as Hui's third son; s0007 then says
`建武初，拜為冠軍將軍、左賢王，封望平侯，率眾征討，累有功。` The established
biographical subject is Huang (p001), and the following early-Jianwu sentence
describes his appointments, enfeoffment and campaigns, not Hui's grant of
title. It occurs **after** the heir sentence, not within the cited evidence.

Thus the stated `sourceDate` text is not present in the cited unit; the
evidence shown does not by itself justify transferring s0007's contextual
era phrase to p002's s0006 title/attestation, much less fixing the event to
precisely AD 317. An independent historical reviewer should investigate
whether other reliable evidence establishes any dating and what it actually
dates. The record does not prove the AD 317 claim false; do not mechanically
delete it, infer an alternative, or count this partial note as a fresh audit.
Review the p002 active hints independently as well: the report's
`hints-p002` check cites only the title s0002 `慕容皝` and supplies no
person-specific chronology explanation.

## Ownership and next gates

At the read-only remote check, staging was the commit above and the shared
queue was `4aca09929f40d88b55271e75e780d6423d494b2c`. That queue's `claims`
and `dateAudits` maps contained no `jinshu/109` entry. This snapshot does not
prove no live worker exists elsewhere and confers no right to publish. Recheck
the remote refs, executor/process state and ownership immediately before any
host-controlled action; do not take over active work or remove locks.

Safe next work is an independent source review of claims 61/136 and p002 hints,
then full editorial/date evidence assessment and conservative identity
resolution against a complete current graph. If repair is needed, use the
owner-safe supported workflow, preserve the original report, and require a
fresh independent audit against the changed fingerprints. Backlink,
person-page, search, ebook and publication/CI gates remain unverified.
The available evidence does not establish that 109 is the closest Jinshu
chapter to all-gate completion. No canonical file, audit, claim, lock, Git
index or build was modified by this investigation.
