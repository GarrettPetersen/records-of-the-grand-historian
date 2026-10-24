# Independent review of p046 removal preview (incomplete)

This review compares the retained `candidate-4.json` (SHA-256
`6525bc9dd9c94b2fbfca5132e4005b29ca3383dcdced01cca8dfa60ec4bb2419`)
with the isolated `p046-removal-candidate-incomplete.json` (SHA-256
`2c385031aa005500fc2721c075738b403d2bd8f1f9096cbe5e9a2aa6a4e17713`).
The still-unchanged source `data/jinshu/022.json` has SHA-256
`813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`.
This is not a source correction, date approval, release authorization or
chapter completion.

## Exact change

I independently compared parsed JSON, including multiset comparison where
the compactor reordered surfaces. The sole people change is deletion of
p046; the sole surface changes are deletion of its two s0130 surfaces
`天子` and `Son of Heaven`. The sole compact claim changes are deletion of
six p046 rows (sex, historicity, noble-title, polity association, attestation,
event participation); all other claim rows remain byte-for-byte equivalent as
parsed JSON and in original order. The two embedded name claims and one role
claim in the removed person explain the preview tool's **nine expanded
claims** count. Remaining surface entries are unchanged as a multiset but
reordered; people, compact claims, and all other top-level fields are
otherwise unchanged.

Exactly two entries are added to the `not-person/not-a-name` disposition
group: `cand_5d758adf2790a666` (‘Son’) and `cand_399f2b22feb82d2a`
(‘Heaven’). Both refer to s0130's existing English text, which still reads
‘the Son of Heaven sustains that rhythm’ and must be corrected. These
dispositions are provisional: after correcting the source, rebuild the packet
and review the new candidate list and source fingerprint rather than assuming
the same candidate IDs survive. The proposed removal alone does not repair
either English translation.

**Additional defect:** Chinese s0130 candidate `cand_b1d8ab3590ece280` for
`天子` retains its pre-existing `not-person/title` disposition and the note
‘天子 is the generic ritual office Son of Heaven’. That note is inconsistent
with the source reading `昊天 / 子 / 之`: `天子` crosses the subject–verb
boundary and is not a title in this line. The disposition and note need
source-backed correction through the normal reviewed workflow; this preview
cannot be treated as a complete false-person cleanup.

## Independent validation and downstream references

I ran `validateCompactPeopleExtraction` independently on both candidates
against a newly constructed current-source packet. Each fails with 22
closed-vocabulary `receptionType` schema errors. The 22 offending compact rows
are identical before and after removal; their array indices shift after the six
deletions. I also independently ran the date-diagnostic functions: both
candidates have 48 diagnostics affecting 41 claims. Some claims have both an
invalid receptionType and a removed posthumous-reception kind; these require
the separately reviewed retrospective reconciliation, not an inference that
the candidate is already valid. This validation stops at schema and does not
prove downstream candidate coverage or identity correctness.

An exact-string search for `jinshu:022:p046` in the current checkout's
`data/people/resolutions`, `data/people/curation`, and
`data/people/combined-curations` found no matches. This is a local snapshot
check only, not a global staged-branch verification or a substitute for the
identity gate. The reproduction script pins the source, retained candidate,
original semantic fingerprints and removal implementation, calls the actual
removal function against an in-memory expansion, and writes only new preview
artifacts with exclusive-create flags; it does not run the canonical CLI.

After the English correction and Chinese disposition repair, regenerate and
validate the current packet and extraction, reconcile legitimate retrospective
labels, and carry all unresolved chronology to a fresh independent date audit.
Recheck current resolution/curation references at publication. No canonical
file, queue, lock, Git index, or approval was changed by this review.
