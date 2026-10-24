# Jinshu 129 reconciliation safety hold — incomplete

This is an engineering and source-review hold, not a chapter approval. Do not
apply `jinshu129-disposition-reconciliation-20261020-incomplete.patch` to
production: independent review identified further unsafe paths, and the
regression now preserves an actual person alias that makes the proposed patch
fail. Do not publish the prior materialized candidate.

The observations below use staging revision `b50596b`, the pinned research
dossier and decisions in the adjacent diagnostic scripts, and the separately
reviewed source findings. No canonical chapter, extraction, audit lock, claim,
or retained recovery artifact was changed.

## Observed production behavior

The staging `scripts/lib/people-translation-repairs.mjs` clears existing
mention candidate references, then its `priorSurfaceDispositions` branch copies
an old disposition from *any* unit with the same language and exact text,
before checking whether an existing person mention contains the candidate.

- In s0183, `cand_8dc4288346d219dc` (`Yi`) is covered by the existing p103
  title-reference span `Zhu Lingshi, governor of Yi for the Eastern Jin`.
  Reconciliation instead copied the s0184 `Yi` disposition `polity`, note `Jin`.
  Independent source review identifies Yi here as 益州, the province. The old
  p103 span is itself too broad: linking the whole span also links Yi and
  Eastern Jin to Zhu Lingshi. Preserving this old span is not source approval;
  independently review and narrow/reclassify it.
- In s0222, `cand_d162756b159cff9a` (`軒轅`) is covered by the existing p122
  personal-name mention for the Yellow Thearch. Reconciliation instead copied
  the disposition for the s0223 astronomical asterism. The two occurrences have
  different referents even though their written form is identical.

These two candidates were already present, with the same IDs and geometry,
before the reviewed translation changes. The defect is not merely scanner-ID
churn. Production compact validation passes the result, demonstrating that
schema/coverage checks alone do not establish the semantic classification.

## Patch is insufficient

The draft patch removes cross-unit surface-only disposition copying and gives
an existing containing mention precedence. It also preserves an unchanged,
exact same-unit occurrence whose scanner ID changes. In an exact staging-code
fixture, it stops both wrong dispositions on the real candidate; the normal
applier reports zero unresolved candidates and spans and passes strict compact
and retained editorial-history validation. That result remains incomplete and
is **not** semantic approval, particularly because of the broad Yi span.

Independent review found another failure. The existing generic alias logic
automatically maps new names to a unique chapter-wide alias without proving
that the occurrence refers to that individual. With the real p122 Yellow Thearch
record retained, a synthetic new unit `軒轅星現` is automatically linked to
p122, even though `軒轅` there can be the asterism. The regression script
`jinshu129-disposition-regression-20261020-incomplete.mjs` now retains the
actual p122 alias and **fails against the draft patch** on exactly that case.
The test's synthetic sentence does not assert anything about the original
Jinshu text; it is a negative control for a newly scanned occurrence.

Other unsafe inheritance paths remain: the initial surviving-ID disposition
filter does not verify that its unit text is unchanged, and the same-unit
bilingual counterpart heuristic assumes shared glossary identifiers establish
co-reference. A changed sentence or a glossary homograph requires explicit
review even if its old candidate ID survives. A subsequent guard around the
global alias and preceding-unit fallback made the synthetic asterism unresolved,
but caused the existing applier self-test to fail at `Fixture left unresolved
candidates`. That exploratory guard is not included in the patch, has not been
reviewed, and does not address all other heuristics; it must not be adopted as
an independently validated fix.

Before a production fix, audit the reconciliation branches as a whole. Carry
forward reviewed classifications only where the same occurrence and relevant
context remain valid; do not infer cross-language or cross-sentence identity
from a shared string or glossary ID. Unresolved candidates need explicit
source-reviewed disposition or person assignment. Adapt existing fixture
expectations and production handoffs to the genuinely fail-closed behavior,
then run the full relevant offline suite and obtain independent review. Keep
all current extraction, editorial, date, identity and publication gates intact.
