# Bounded chapter completion

The operational deliverable is a deployed nonempty chapter with current source,
editorial, chronology, identity, backlinks, search, sitemap and ebook-contribution
checks. Completed packets and reduced pair counters are intermediate work.

## The necessary rule change

A chapter certifies its source-backed person records and their accepted identity
assignments. It does not certify that every similarly named person elsewhere has
been ruled out. Cross-chapter equivalence may remain explicitly uncertain after
independent source review. A genuine false merge or uncertain attribution inside
this chapter is a hold; a broad name index is not.

The old zero-touching-pairs gate must be replaced, not renamed or secretly set to
zero. Historical pair decisions remain constraints and evidence. Their unresolved
backlog remains historical research debt, separately reported. No workflow may
create a complete same-name pair graph to generate matching or publication work.

## One dossier and one reviewed case

1. Maintain an immutable, versioned dossier per accepted canonical person. Preserve
   every local member, source-backed name/alias, claim reference and membership
   proof. The dossier is identity-review evidence, not permission to publish facts
   from unqualified external chapters.
2. Maintain an inverted name/alias index over dossiers. Build/update the registry
   once per accepted source delta. Load it once and reuse it across chapter jobs;
   do not compile the global graph per worker, packet, poll or minor correction.
3. For each canonical person in the chapter, retrieve at most eight other dossiers.
   Read at most sixteen name keys and eight postings per key. Prefer specific
   Chinese names, then full English names. Keep Chinese variant handling and the
   existing source-backed generic-title rules. A ranking is retrieval, never a
   factual identity verdict.
4. Retain complete key counts/fingerprints and explicit overflow. An oversized
   bucket produces an ambiguity review, not hundreds of pair assignments. The
   reviewer reads the chapter's identity evidence and the relevant dossier evidence,
   approves the retained source identity or holds a concrete contradiction. No
   uninspected remainder is labelled different-person, reviewed, or impossible.
5. Only positive source-backed identification may propose a merge. A new merge
   still needs separate independent review and normal native application. Lack of
   a match leaves a separate record with honest uncertainty, not a guessed merge.
6. Store the actual independent report, source witnesses, plan and input hashes.
   A certificate covers every local person exactly once and is checked against
   current source/extraction/editorial/date bytes. It cannot itself merge, split,
   retract a known constraint, or grant source/date/publication approval.

Index construction is linear in input evidence plus sorting posting lists. Chapter
preparation is O(Ap + Mp + p × q × r), with Ap aliases and Mp protected members in the chapter dossiers, p chapter people, q <= 16 posting keys and r <= 8 reads.
The source context still takes time proportional to the evidence that must be read.
There is no k × k loop for a k-person same-name bucket. At most eight candidate
headers enter a case; zero unordered pair assignments are generated.

## Retain useful completed work

A source identity edit invalidates the affected proof. Unrelated chapters, a new
name posting, or another accepted source for an existing person must not reopen
all earlier reviewed people. Retain old reports unchanged. Reconcile accepted merge
lineage/redirects mechanically and verify each proof's actual source dependencies.
Current chapter byte pins, fresh required chronology approvals and exact primary
witnesses are still checked. Never change approval hashes to preserve approval.

The prototype already permits accepted canonical membership growth without
reopening unchanged chapter-local identity evidence. Source-identity edits, new
chapter people, stale chapter inputs and unknown reviewer/merge fields fail closed.
Further selective reuse after an editorial edit must be implemented as an auditable
new aggregate over unchanged individual proofs, not by rewriting an old report.

## Target an ordinary chapter in about one hour

| Elapsed time | Deliverable |
| --- | --- |
| 0–10 minutes | Validate current extraction and complete editorial/source evidence; reuse unchanged passed work. |
| 10–25 minutes | Bounded dossier preparation and independent identity review; apply only independently proven merges. |
| 25–35 minutes | Current chronology and scoped projection, both-language mentions, inverse excerpts and ebook contribution checks. |
| 35–45 minutes | Clean release PR, required CI and the production build. |
| 45–60 minutes | Merge/deploy, live person/chapter/search/sitemap checks, and the nonempty acceptance receipt. |

These are time budgets to measure, not permission to approve missing evidence.
Jinshu053 already has source/editorial and current independent date pins, so those
passed stages should be reused. A chapter requiring genuine historical research
gets an exact source issue/hold; we do not launch repeated unchanged review rounds.
Unknown dates may remain unknown only through the existing chronology representation
and independent approval, never by inventing years or disguising an audit hold.

Keep one completion WIP chapter until the first nonempty release is verified.
After that, admit at most three, sized from measured completed/published throughput.
Retain current ownership, all recovery, one shared checkout and the host resource
profile. No new extraction campaign while this acceptance path is unproven.

## Production integration is part of acceptance

The new engine is not active merely because its tests pass. Before claiming the
one-hour path works:

- Replace fresh work generation in the existing resolver with dossier cases. Old
  unfinished assignments retain recovery; no fresh quadratic pair wave is sent.
- Persist and load the registry by immutable manifest; verify retrieved bytes.
- Consume independent per-person review proofs in the shared qualified-scope gate.
  Remove the global all-pairs veto from chapter qualification. Keep actual source,
  editorial, date, family, artifact, quotation, coverage and CI checks intact.
- Revalidate proof dependencies and accepted canonical lineage without forcing a
  whole-corpus reread or reopening unchanged cases.
- Display reviewed identity uncertainty; do not present provisional records as
  confident distinct historical individuals or silently suppress their mentions.
- Prove real Jinshu053 coverage, generate normal outputs, pass CI, deploy and check
  their actual content. Report reviewed cases, held cases, ambiguous identities,
  data-qualified chapters and live published nonempty chapters separately.

Current prototype state: bounded engine, immutable dossier store and regression
checks exist; production scheduler/gate/rendering integration and a real independent
chapter review are still required. No chapter has been made complete by this change.
