# Jinshu 053: commentary allusions and unsupported AD 300 life hints

This is a source-local research finding, not an independent full date audit,
an approved repair, an identity decision, or a chapter-completion claim. No
canonical source, extraction, date report, queue reservation, lock, lease, or
recovery artifact was changed.

## Pinned inputs and check identifiers

The local source, extraction and existing report have SHA-256 byte hashes
`85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407`,
`464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69`,
and `d3bb12dbc7db670357affb2e216790baffb359db62ce78478ff3d37c1ba93073`,
respectively. In this extraction, the compact claim array indexes are 191 for
`p070` and 192 for `p071`. The old recorded report identifies those checks as
`claim-192` and `claim-193`. A subsequently rebuilt isolated packet identifies
them as `claim-191` and `claim-192`; the packet hash is
`b032da3de9d1d341d18e93e4fb00df014faa4e275e978d9e7fd11119020edb6e`.
**Do not transfer check IDs between fingerprints or packets without matching
their actual claim contents and owner.**

The retained partial v2 report checks seven of 188 packet items, nine source
units and zero people. It does not include these two claim checks or the two
active-hint checks. The old `research-blocked` report marked both claims and
`hints-p070` / `hints-p071` supported using a generic reason, without deriving
the year from this passage. Neither report is a complete approval.

## Evidence and discrepancy

Jinshu 053 `s0185` begins the historian's commentary, `史臣曰`, and `s0192`
reads `遂使冤逾楚建，酷甚戾園`: a comparison of the prince's wrong and
cruelty with earlier cases. Neither cited sentence states AD 300 as the
commentary's date or a date of personal activity for either figure. The
extractor nevertheless attaches `sourceDate.text: 史臣曰` and the point year
AD 300 to ordinary `attestation` claims for `p070` and `p071`. Their active
hints also each contain AD 300. The circumstances of the prince's own death
do not date the later historian's literary comparison or make its subjects
alive in that year.

The person mappings require their own source review. Shiji 040 `s0343`
mentions `太子建` under Chu's King Ping; Hanshu 073 `s0004`–`s0005` names
`戾太子據`, and `s0342` gives `戾園` as a location connected with the
burial complex. Those independently retained local passages support checking
the historical allusion and show why the exact `戾園` surface is not itself
a personal name. They do not by themselves establish a date for the Jinshu
commentary or prove every detail of either identification. The additional
local file byte hashes are Shiji 040
`e5db0ee1a6416a72588cf2872d3c24f9a3cacec0aff3db364de4b689d882e18b` and
Hanshu 073
`68ef596b57384dfd7c2dc327fe5e781e844657ecd7310b3ab6a15dfa4bd5e8bb`.

## Suggested audit disposition

After the final editorial source is frozen, independently review every
remaining claimed date and all evidence for both people. The AD 300 life
hints and ordinary life-attestation years need specific evidence beyond this
commentary, or removal/correction through the owner-safe date workflow. Retain
an undated retrospective comparison where supported; do not invent a date for
the historian's passage or derive a death year from the allusion. Assess the
`戾園` person link in the appropriate identity/editorial workflow rather than
using a date-only repair to settle it. Other hints (`BC 500-400`, `BC 91`)
need separate source-based review; this note neither endorses nor replaces
them. A production change needs a separate reviewer, fresh packet fingerprints,
full unit/item/person coverage, and the ordinary re-audit and publication gates.
