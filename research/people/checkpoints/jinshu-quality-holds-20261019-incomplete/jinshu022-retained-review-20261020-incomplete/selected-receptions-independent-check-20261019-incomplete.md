# Jinshu 022 selected reception labels: independent check

Research only; this is neither a date audit nor publication approval.
I independently compared the candidate to its pinned parent and inspected the
Chinese chapter units and both earlier independent review files.

Inputs and SHA-256:

- `data/jinshu/022.json`: `813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`.
- `candidate-4.json`: `6525bc9dd9c94b2fbfca5132e4005b29ca3383dcdced01cca8dfa60ec4bb2419`.
- `selected-receptions-candidate-incomplete.json`: `2319764510c4848a8d07355273497f3844fd003c687433b5cf1367eb1b7ba7ac`.
- `selected-receptions-diagnostics-incomplete.json`: `47e46ea8d66814b27ce7a69c24c374165c8059505e8e1d240d8ea20f6cedf9f6`.

Recursive structural comparison shows **13 changed claims, 14 changed
leaves**, not 13 individual fields: claim-122 changes both `kind` and
`receptionType`; claim-418 changes only `receptionType`; the other 11
change only `kind`. No date, person ID, relationship, source evidence,
certainty, text, or other field changes. The selected preview rows and claims
are 3/122, 9/334, 11/342, 13/348, 15/357, 17/363, 23/385, 25/396,
26/418, 27/419, 29/450, 31/456 and 33/591. All are marked supported for
the narrow reception classification in the corresponding independent row
reviews; none is one of the rows explicitly marked unsupported or hold.

Source spot-check of every selected claim supports that narrow category:
s0024 sacrifices to Guangwu; s0204/s0206 and s0220 invoke a revered
ancestor; s0221, s0226 and s0231 head sacrificial shrine hymns; s0240–41,
s0247–48 and s0254 identify hymns for named emperors; s0284–85 state that
the respective songs praise Wu and Wen; s0392 praises 景皇. I found no
selected label for the living Ming emperor's own officiating action (row 1),
or for the separately held hymn-title-as-honor rows. However, the identity
of descriptive ancestral references and correct Wei-era person linkage remain
unresolved; the heading alone does not establish when a hymn was composed or
performed. In claim-122, neither the retained `otherPersonId` nor its AD 57
bound is approved by this label review. These caveats apply even though the
category changes themselves are plausible.

Independently rerunning the current shared-checkout in-memory
`validateCompactPeopleExtraction` with `buildPeopleExtractionPacket` returned
**20 errors**, exactly matching the saved diagnostics; all are remaining
`receptionType` enum violations in other claims. Independently rerunning
`dateAuditDiagnostics(dateAuditItems(candidate))` returned **34 diagnostics**
identical to the saved array. The date-packet semantic extraction fingerprint
is `sha256:b0e21007e32696396666368d0a982359d928f227889c2d50969c470244f04dc9`,
also matching. This uses the current worktree's validation code, not a
separately checked-out staging tree, and does not establish a pass on staging.

Conclusion: the chosen narrow label changes are source-consistent subject to
the stated caveats, but this candidate **fails the scoped validator** and
must remain incomplete. Do not publish, apply in bulk, treat this as a date
approval, or use it to close identity/editorial gates. Reconcile the other
claims individually, coordinate any source/editorial changes, and require a
fresh independent date audit of the final fingerprints.
