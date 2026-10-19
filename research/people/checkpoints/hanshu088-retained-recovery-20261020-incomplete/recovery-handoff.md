# Hanshu 088 retained extraction: staged validation, not completion

Base: staging Git tree `badf6573cb7ea861bbb244fda4ddb446735740c8`;
queue snapshot `4aca09929f40d88b55271e75e780d6423d494b2c`. Findings are
for these snapshots and the local files whose hashes are listed below; do not
assume a moving branch or later checkout still matches.

An isolated script-only fixture under `/tmp/hanshu088-stage-check.wLwd0wXT`
contains the staging scripts, people config/schema/chronology/curation,
glossary, symlinked existing `node_modules`, and these exact local files:

| File | Byte SHA-256 |
| --- | --- |
| `data/hanshu/088.json` | `caf88a6a1235eebe20dc7c339e5a79dcbff11f7e4b45ec0dcb3335c27a1f260e` |
| `data/people/extractions/hanshu/088.json`, original | `25ec0a45db090fb2a4c338888e024612d4ae6f51810946216afc514c949f98ba` |
| `data/people/extractions/hanshu/088.json`, normalized fixture candidate | `d4ce24ce03e95b5fc025c44bf5cb9a040d3a020344c1fb931fbe377dc3f98cad` |
| `data/people/editorial-decisions/hanshu/088.json` | `b0c8109ce3d7fd61bdf0ffdb87419288d8ac2fcfd5d49b6ea0210298641a1226` |
| fixture `hints-receipt.json` | `063114f78631410fc32fb61a57e55f1c88c70a9f3d72e844609a5dab0eb0c325` |

The editorial decision file is byte-identical to staging. The local source and
original extraction differ from staging: staging byte hashes are respectively
`8ed201dfaf07b4b98da0c4985e07ce11efa36509c5c56acaaa0f98f5d7343727`
and `7121391e386dab5a2c154d384d9ecd34479405121974cc6531c81266d717f940`.
The source delta comprises 18 changed literal/idiomatic fields in 314 units;
15 have exact matching accepted editorial proposal before/after pairs. Three
do not match exact pairs: idiomatic `s0021`, idiomatic `s0209`, and literal
`s0216`. These may be paired-field propagation or other edits; independent
source review is necessary. All are preserved unchanged here. This comparison
does not certify that arbitrary JSON metadata is unchanged.

Without normalization, staging's scoped validator fails on many BC-formatted
hints that the locally modified validator permits. Staging's documented hint
normalizer previewed and applied 124 existing-year formatting changes **only
to the fixture**, with the receipt above. With the normalized candidate and
copied source and editorial decisions, staging's `npm run people:validate --
--book hanshu --chapter 088` passed: 150 people, 799 mentions, 1,511 expanded
claims, 0 proposed repairs, 47 applied repairs, 48 editorial decisions, 6 claim
retractions, 1 claim revision, and one legacy missing active-date hint. This is
a structural validation, not historical verification or chapter completion.

Date packet for the normalized fixture: source semantic hash
`sha256:87413567c1cf5ce97445626f93c9a47131f91651680e54c0f9bdc340662b9d24`,
extraction semantic hash
`sha256:98ccc87c42008b5c0d63563b911e55665d08f40ee7837ffff7e4bf74004a865d`,
314 units, 150 people, 473 date items. `dateAuditStatus` is `stale`: the
existing research-blocked audit covers an older source/extraction and 110
people; its findings cannot approve or be mechanically transposed onto the new
candidate. Date approval requires the normal complete independent audit,
repair and fresh re-audit as needed, with preserved prior artifacts.

There are 57 existing staging resolution documents containing a
`hanshu:088:` identifier. This is a document count, not a count of unresolved
identity pairs or proof of bad decisions. The extraction replacement changes
people/evidence and requires full current identity reconciliation; do not
assume the older resolutions cover it.

The queue snapshot retains a sticky Cursor `ready` claim for stable worker
`Garretts-MacBook-Pro-2.local-cursor-recovery`; there was no separate 088 date
reservation. The candidate run's five Cursor agent IDs match the accepted
local chunk-state agent IDs and its source fingerprint matches the claim.
This is helpful recovery evidence but does not by itself authorize clearing the
claim or prove no remote activity; a local `lsof` with no matching files open
does not establish remote quiescence. No claim, live source/extraction,
approval, lock, or common Git index was modified.

Candidate source, extraction and normalization receipt remain only in the
named fixture pending independent review and host-owned checkpointing. If
checkpointed, label them incomplete, retain the original and receipt, and do
not overwrite current approvals or claim publication. Recheck hashes, exact
staging head and ownership immediately before any host operation.
