# Jinshu 053 completion pilot

Jinshu 053 passed exact live acceptance on October 31 at b26f20aae583d22a90abb2bb48bd04c05e794fa5: 72 profiles, 73 records, 63 reviewed uncertainties and 541 chapter links. CI, ebook contribution, production and all live checks passed. Staging preserves both histories and matches the verified release. Ordinary one-hour throughput remains unproven.

The chapter’s identity workload is 72 canonical-person cases covering 73 local records. Each case retrieves at most eight dossiers through the index; the pilot generates zero pair assignments. Sixty-three cases retain explicit reviewed cross-chapter uncertainty. That uncertainty does not prevent completion; a suspected incorrect merge or chapter attribution does.

The first deployed release exposed an extraction defect: Wei Guan’s explicit Chinese/English name was included inside his son’s compound mention, leaving the father’s profile with no inverse source excerpts. Strict extraction and the earlier generated-output checks had accepted zero expected references. The repair gives father and son exact non-overlapping personal-name spans, preserving source text, full aliases, facts, chronology and identities. The shared website/ebook qualification path now fails on a scoped person with zero source mention references, with a named-parent regression.

The original independent date and identity reviewers approved the repaired current inputs. The date approval covers 209 units, 206 date items and 73 people. The identity approval covers all 72 cases, preserving 63 uncertainties. Mechanical comparison proves only the father’s and son’s substantive mention data changed; generated administrative mention IDs changed more widely and are honestly bound by the new proof. Old approvals and failed live evidence remain preserved.

The repair’s review usage was $0.580 raw for date, $0.723 for identity and $0.103 for the separate publication-guard code review; charged usage reported zero. These are this repair’s costs, not the total cost of the pilot or an estimate for an ordinary chapter.

The reviewed verifier optimization keeps the original DOM predicate when a person-link attribute may be present, and skips parsing pages where it is absent. Prior CI measured that phase at 3m48s versus 7m14s. Required CI and deployment still rebuild the full site, so those stages need measured timings before the proposed 15-minute release budget can be treated as realistic.

The current normal host workflow prepares and records indexed chapter dossier reviews and rejects fresh automatic pair waves. Historical pair jobs remain available only for retained recovery. Whole unchanged proofs can be reused; selective mixing of per-case proofs after a substantive source change is not implemented. The pilot must finish before expanding work in progress.

The completed release made 112 live HTTP checks, including 33 retired-ID redirects. CI took 22m20s; production cloning took 4m07s, building 25m47s and deploying 57s. Identity refresh through live acceptance took 57m42s, excluding earlier source/editorial/date work, implementation and first-release rework.

The milestone editorial audit validated 1,508 current-prompt empty repair queues against strict source and independent-history checks. It confirmed 1,393 editorial closures and 115 authorization holds, including Jinshu 035 and 090. Jinshu has 61 source-validated extractions, 45 editorially closed chapters, eight current date approvals, five stale date approvals and one independently identity-reviewed and verified published chapter. The corpus has 2,040 current-prompt extractions, 258 current date approvals and 142 stale date approvals; current-prompt coverage alone is not full readiness.
