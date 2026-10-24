# Jinshu 101 date-evidence hold: independent verification — incomplete

Read-only check of the separate `jinshu101-date-audit-evidence-hold-20261020.md`
against exact Git revision `1da4e6a2ca9df03d780ab18762e43e5e50b787a2`. This is
not a replacement audit and does not prove the dates below historically false.

## Exact staged inputs

`git show` and SHA-256 of each blob reproduced the hold's byte hashes:

| Path | SHA-256 |
| --- | --- |
| `data/jinshu/101.json` | `221808c006bb5d8250863e40a79c07a056dd4f0137f273fe7e91e1c6f22d51c8` |
| `data/people/extractions/jinshu/101.json` | `7aae76a6377c5ed33c633a8688fd8db7b0baf9b1e0e1cf984b368d6d53e7ad99` |
| `data/people/date-audits/jinshu/101.json` | `d195f9298f6029667b540686f05117869ba6999dd97d9ff0011cbbda4a1d0355` |

The report declares `audited`, source hash
`sha256:36504ddac4e4d3159b34f437c4790d0531c6a6df44b26dfd7a1e2b0a316e75b6`,
extraction hash
`sha256:ed366dd5d21d5675b6459e5be6622c239ba93116d29f0027320af7e85bb742a0`,
263 reviewed units, 445 item checks, 201 person checks, and zero references.
There is one distinct repeated reason among item checks and one among person
checks. The reviewer provides a descriptive name and declares independence,
but the report records no reviewer agent ID. Neither repeated text nor a
missing ID alone proves that a review did not happen.

## Three specific evidence failures

Each of `hints-p008`, `hints-p009`, and `hints-p010` is marked `supported`,
with exactly one evidence citation: s0001, `劉元海（子和） 劉宣`. That exact
string is the Chinese source of s0001. The three staged extraction rows instead
identify Confucius (孔子; `BC 551-479`), Guan Zhong (管仲; `BC 685-645`),
and Emperor Xuan of Han (漢宣帝; `BC 74-48`) respectively. The quote names
Liu Yuanhai, his son He, and Liu Xuan, and does not identify those three people
or supply their dates. Source s0014 does mention Confucius and Guan Zhong, and
s0017 mentions Emperor Xuan, but these other units are not the report's cited
evidence for the three checks and do not by themselves supply the quoted
Western date endpoints. The report has no cited external references.

Thus the *cited support* for each of those three verdicts is not relevant
evidence for the person's dates. This does not establish that the underlying
historical dates are false, nor that relevant evidence was unavailable or
unrecorded elsewhere. Recover evidence and independently reassess the whole
current audit before accepting or changing its conclusions.

## Validator reproduction and limitation

In memory, I loaded `people-date-audit.mjs`, `people-date-values.mjs`, and
`people-reception.mjs` from this exact Git revision as ES modules; their
unchanged staged `people-content.mjs` was loaded from the working checkout.
I parsed the three exact staged blobs with `git show`, constructed units using
`contentUnits` and the packet items with the staged `dateAuditItems`, and
recomputed both fingerprint hashes using the production JSON convention.
The recomputed hashes matched the report. The staged
`validateDateAuditReport` **accepted** this in-memory packet and report with
263 units, 445 items, 201 people, and zero date diagnostics.

The code checks, among other structural and complete-coverage requirements,
that a quote is a substring of the cited Chinese unit. It does not establish
that this quotation supports the particular person or the historical date.
Acceptance is therefore a structural result, not proof of the three cited
claims' semantic support. This test did not call the recorder or modify the
report, queue, claims, or any lock.
