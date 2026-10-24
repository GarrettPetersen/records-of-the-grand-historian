# Jinshu 123 orphan audit and unsupported citation — research only

At staging `4556a370572de46f7a83ffa5e6c6b374980d0755`, the tracked report
`data/people/date-audits/jinshu/123.json` still says `audited` and records
source fingerprint `sha256:d27722689f43b2c369df79aa6cf6bd2e6ca0d2c9a51142cee4d9515427ec8424`
and extraction fingerprint `sha256:503353d50e489f875a4c14704de0b9db9548b01362fd9fb33e633ae356ee97b4`.
The report's raw SHA-256 is `77000d713c19a670079906972366c2d2f348ed3f908638a6837bc2aa718b7fc1`;
the staged source `data/jinshu/123.json` raw SHA-256 is
`51c0a72d96ce2681540cffc0c46baad349fd6f89664b96b2781db93b7e99b063`.
These raw file hashes are not the report's semantic fingerprints.

The extraction path is absent from that staging tree. Merge
`3dfb17fbf94` deleted it; immediately before that merge, at
`bb9e73078a5fa0aa15aef3b303f175ee61e1ed45`, the extraction file had raw
SHA-256 `d6b6358d5534dd23102917e198557bd590f766fc836b4932acd6cb7ad0d5d61a`.
Its compact record `p001` identifies Murong Chui 慕容垂; `p002` identifies
Murong Huang 慕容皝, with activity hints AD 344 and AD 348. The report's
`personChecks` entry for `p002` declares `supported` but its sole evidence
is `s0001`, quote `慕容垂`, and the report lists no references. The complete
staged source unit s0001 is precisely `慕容垂` (Murong Chui), not Huang,
and has no date. Source s0002 separately identifies Chui as Huang's fifth
son, but does not establish either cited year. The cited heading therefore
does not substantiate the p002 chronology verdict; this observation does not
prove the dates false or establish that no other evidence exists.

The orphan report is not enough to count an audited or complete chapter.
At staging, `generate-progress.js` initializes each source chapter as missing
and un-audited and reads date status only for existing extraction files; its
date-audited summary filters those resulting chapter records. Thus a fresh
generation from this tree would not count this orphan as audited. This is a
code-path observation, not a newly generated staging metric. On the deployed
site, `data/progress/books/jinshu.json`, generated at
`2026-10-19T09:04:54.910Z`, reports chapter 123 as `missing` and
`dateAudit.status` as `un-audited`. This does not validate any other chapter.

Preserve the historical report and deletion; do not restore or approve the
old extraction merely to satisfy the gate. Any later recovery requires the
current source and extraction fingerprints, complete independent source-based
date review, and all other editorial, identity and publication gates.
