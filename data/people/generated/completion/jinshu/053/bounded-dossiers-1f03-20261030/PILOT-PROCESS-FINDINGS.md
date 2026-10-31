# Jinshu 053 completion pilot

Implementation and the repair are merged on master; required CI passed, and production is building the repaired release. A live acceptance receipt remains required. One-hour throughput is not yet established.

The chapter’s identity workload is 72 canonical-person cases covering 73 local records. Each case retrieves at most eight dossiers through the index; the pilot generates zero pair assignments. Sixty-three cases retain explicit reviewed cross-chapter uncertainty. That uncertainty does not prevent completion; a suspected incorrect merge or chapter attribution does.

The first deployed release exposed an extraction defect: Wei Guan’s explicit Chinese/English name was included inside his son’s compound mention, leaving the father’s profile with no inverse source excerpts. Strict extraction and the earlier generated-output checks had accepted zero expected references. The repair gives father and son exact non-overlapping personal-name spans, preserving source text, full aliases, facts, chronology and identities. The shared website/ebook qualification path now fails on a scoped person with zero source mention references, with a named-parent regression.

The original independent date and identity reviewers approved the repaired current inputs. The date approval covers 209 units, 206 date items and 73 people. The identity approval covers all 72 cases, preserving 63 uncertainties. Mechanical comparison proves only the father’s and son’s substantive mention data changed; generated administrative mention IDs changed more widely and are honestly bound by the new proof. Old approvals and failed live evidence remain preserved.

The repair’s review usage was $0.580 raw for date, $0.723 for identity and $0.103 for the separate publication-guard code review; charged usage reported zero. These are this repair’s costs, not the total cost of the pilot or an estimate for an ordinary chapter.

The reviewed verifier optimization keeps the original DOM predicate when a person-link attribute may be present, and skips parsing pages where it is absent. Prior CI measured that phase at 3m48s versus 7m14s. Required CI and deployment still rebuild the full site, so those stages need measured timings before the proposed 15-minute release budget can be treated as realistic.

The current normal host workflow prepares and records indexed chapter dossier reviews and rejects fresh automatic pair waves. Historical pair jobs remain available only for retained recovery. Whole unchanged proofs can be reused; selective mixing of per-case proofs after a substantive source change is not implemented. The pilot must finish before expanding work in progress.
