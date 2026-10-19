# Jinshu 123: stale date report and source-evidence hold

This is a partial research finding, not a chapter audit, approval, repair, or
release authorization. Inspected staging revision
`6859001397040614fd4602ec409961d4e59c8e9a` and master
`26ebf8c830a43c3eb0a15e361c72436bd946c83e`. Both contain the same report
`data/people/date-audits/jinshu/123.json` but **neither contains the
corresponding extraction**. The report's bytes hash to SHA-256
`77000d713c19a670079906972366c2d2f348ed3f908638a6837bc2aa718b7fc1`;
the staging source bytes hash to
`51c0a72d96ce2681540cffc0c46baad349fd6f89664b96b2781db93b7e99b063`.
The status code explicitly treats a report with a missing extraction as
`stale` (`scripts/lib/people-date-audit.mjs:171`). Commit
`782b3f1c0d9600bb4684032453936a49e32b9240` withheld the extraction pending
packet refresh. Do not restore it merely to make the date report current.

The report claims semantic extraction hash
`sha256:503353d50e489f875a4c14704de0b9db9548b01362fd9fb33e633ae356ee97b4`.
The historical extraction at
`2de4e53dbfdc4889dcbb3ff15a056ff46035e4b1:data/people/extractions/jinshu/123.json`
matches that hash, calculated as SHA-256 of `JSON.stringify` of its parsed
JSON, as the packet builder does. The later withheld extraction immediately
before `782b3f1c` has a different semantic hash,
`sha256:68d30869eaa1aa1186b2c3e0fda3561f3f8bf56de4b44bc4736aed274a9d4eea`.
The historical file is review evidence, not a current approved extraction.

The report labels itself `audited`, listing 298 reviewed units, 643 item
checks and 148 person checks. All item reasons repeat one string; all person
reasons and evidence arrays repeat one string and the single heading s0001
`慕容垂`. It has no references. In the exact historical extraction named by
its hash, p002 is Murong Huang (慕容皝) and p003 is Murong Jun (慕容俊),
not Murong Chui. Their extracted activity hints include externally supplied
years; citing only Chui's heading does not explain the basis for those other
persons' chronology. The staged text itself mentions 皝 in s0002 and 俊 in
s0005, neither of which states the Gregorian years in the hints.

For a temporal example, historical `claim-9` dates the enfeoffment of Chui as
Marquis of Duxiang to AD 344 and describes that year as the destruction of the
Yuwen. The report's only cited sentence, s0006 `以滅宇文之功，封都鄉侯。`,
states the merit and enfeoffment, not an AD year or a necessary same-year
interval. `claim-6` similarly assigns AD 348 to Chui's renaming and cites
s0005, s0009 and s0010; s0009 connects the renaming to Murong Jun's accession
but does not itself give an AD year. These observations identify insufficient
recorded evidence, not proof the dates are historically false. A fresh review
must establish the external chronology, event ownership and exactness from
identified reliable sources, check the entire current packet, and preserve
uncertainty where it cannot establish a point date.

At live shared-queue revision
`4aca09929f40d88b55271e75e780d6423d494b2c`, neither an extraction claim nor
a date-audit claim exists for `jinshu/123`. This observation does not grant
authority to bypass current queue assignment and review rules. Before assigning
work recheck the live ledger, original retained artifacts, packet and source.

## Publication process constraint observed separately

The local `data/people/generated/date-workflow-run.lock` identifies PID 32459;
at inspection `ps -p 32459` returned no process. This establishes only local
PID absence, not remote executor ownership or permission to take over work.
The combined-curation publisher calls `acquireProcessRunLock` at
`scripts/lib/people-combined-curation.mjs:271`; the helper's dead-PID branch
unlinks the existing lock at `scripts/lib/process-run-lock.mjs:61`. Running that
publisher in this state would therefore remove the lock and conflict with the
user's instruction not to delete locks. Inspection, preparation and verification
are documented as read-only with respect to canonical files and the queue;
publication additionally requires exact original claim and generation pins,
independent approvals, and an available queue lease. The standalone date
recorder is not a substitute for coordinating an existing sticky workflow.
No lock, claim, report or canonical source was modified in this investigation.
