# Person Glossary and Cross-Reference System

## Status

This document is the implementation design for a corpus-wide person glossary.
It is intentionally broader than an ebook index: the same source data must
support person pages on 24histories.com, links on every explicit person mention,
cross-book identity resolution, and per-book ebook glossaries with backlinks.

The design assumes one AI extraction pass over each chapter. Later identity
resolution may inspect the extracted evidence windows, but it must not require
agents to read all 4,099 chapters again.

The extraction foundation was implemented on 2026-08-10. Version 1 now has:

- versioned packet, extraction, chronology, resolution, and canonical-person
  JSON schemas under `data/people/schema/`;
- shared content-unit enumeration, Unicode span location, hashing, and atomic
  JSON helpers in `scripts/lib/people-content.mjs`;
- a scalable proper-noun matcher and deterministic candidate scanner in
  `scripts/lib/people-candidates.mjs`;
- `scripts/build-people-extraction-packet.mjs` for reproducible chapter packets;
- `scripts/validate-people-extraction.mjs` for schema, fingerprint, locator,
  evidence, candidate-coverage, stale-span, and overlap validation;
- `scripts/sdk-people-extract.mjs` for resumable Cursor Cloud runs, with
  artifact-only worker output, host-side acceptance, and validation retries;
- initial role, polity, and reign vocabularies for the Songshu pilot.

Generated packets, verbose worker output, runner state, and temporary workspaces
live under `data/people/generated/` and are gitignored. Only validated compact
chapter sidecars under `data/people/extractions/` are tracked. Compact sidecars
are fully reversible: the validator regenerates every language-specific mention
span and candidate decision from their surface rules before accepting them.

The Songshu 69 pilot completed on 2026-08-10 with 86 people, 315 reusable
surface rules (956 generated language-specific spans), 372 distinct claims, 821
candidate decisions, and nine accepted translation repairs. Its tracked compact
sidecar is 108 KB, down from 796 KB for the verbose draft.

Three smaller cloud pilots established the initial economics. Grok 4.5 at low
effort cost about $0.99 for Shiji 50; Gemini 3.6 Flash at low effort also cost
about $0.99 for Hanshu 3 and offered no clear savings. A Grok 4.5 medium run on
Shiji 64 cost about $1.98 after repair retries. These are short chapters, so
costs must be sampled again before extrapolating across the corpus.

The first end-to-end independent-review pilot completed on Hanshu 4. Extraction
cost $0.77 and produced 42 local people, 340 initial mentions, 242 claims, and
three repair proposals. A separate Grok 4.5 medium reviewer cost $0.25, accepted
two proposals, and revised the third. After application and repeated-name
reconciliation, the sidecar generates 341 mentions and remains fully valid.

Cloud workers never commit, push, or open pull requests. They return extraction
artifacts to the host. The host validates and accumulates many chapters locally,
then pushes a deliberate batch to `codex/people-glossary-staging`. Only a final
staged merge goes to `master`, avoiding a Cloudflare build for every chapter.
Routine checkpoints remain local because pushes to a staging branch may still
trigger Cloudflare preview builds. The older `translation-staging` branch is
not reused because it has substantially diverged from current `master`.

Bulk extraction is size-aware. The host measures every candidate chapter before
applying `--limit`, ranks by compact worker-packet workload, and records the full
decision in `data/people/generated/extraction-plan.json`. Ranking includes a
per-agent overhead term so a four-chunk chapter does not jump ahead merely
because its serialized text is terse. The whole-chapter lane
admits at most 250 content units and 600 preflight candidates. Larger chapters
are divided into deterministic contiguous ownership ranges, with six read-only
neighboring units on either side for continuity. Chunk workers emit annotations
only for owned units. The host validates every chunk, caches it for interruption
recovery, rebases its local IDs, and assembles one sidecar that must pass the
ordinary full-chapter validator. Repeated people across chunk boundaries remain
separate local records for conservative identity resolution later; no second
read of the source chapter is required. `--defer-large` records large chapters
without launching them, while `--allow-large` explicitly uses one whole-chapter
worker. `--max-cost` sets the invocation budget, and each in-flight agent must
first reserve the amount configured by `--cost-reserve` (default $10). This
prevents concurrent launches from treating unknown in-flight charges as zero.
Workers wait while another reservation may free capacity and stop once the
remaining budget cannot cover another reservation. The first Ctrl-C also
drains; a second Ctrl-C cancels active SDK runs.

Useful commands:

```sh
npm run people:packet -- --book songshu --chapter 069 --summary
npm run people:extract -- --book songshu --chapter 069 --dry-run
npm run people:extract -- --book songshu --chapter 069
npm run people:extract -- --book hanshu --chapter 020 --dry-run
npm run people:extract -- --book hanshu --limit 8 --concurrency 2 --max-cost 20 --cost-reserve 10
npm run people:editorial-review -- --book songshu --chapter 069 --dry-run
npm run people:editorial-review -- --book songshu --chapter 069
npm run people:apply-repairs -- --book songshu --chapter 069
npm run people:validate
```

## Decision Summary

Do **not** insert person metadata into the translation objects. Keep the chapter
JSON as the source text and translation, and add a tracked sidecar for each
chapter under `data/people/extractions/<book>/<chapter>.json`. Clear editorial
errors found during extraction are returned as structured translation repairs;
the host queues them for an independent evidence review and applies only
accepted changes to chapter JSON.

Use three distinct layers:

1. **Chapter extraction:** one independent file per chapter containing local
   people, explicit mention spans, names, dates, roles, relationships, polity
   associations, and evidence references.
2. **Identity resolution:** mappings that say which chapter-local people are the
   same historical individual. Resolution is conservative and reversible.
3. **Canonical people:** one canonical object per resolved person, stored in
   sharded JSON files. These objects select the display name, short description,
   accepted names, accepted life dates, and stable public URL.

Website pages, snippets, links, search indexes, and ebook glossaries are build
artifacts. They must be generated from the current chapter text plus these three
tracked layers. Snippet prose is never copied into person records.

This gives us two useful properties:

- Editing a translation updates every displayed snippet on the next build.
- Merging two duplicate people changes the resolution layer, not 4,099 chapter
  files or thousands of individual mention records.

## Corpus Facts That Affect the Design

The current corpus contains:

- 4,099 chapter JSON files;
- about 2.4 million prose sentences, table headers, and table cells;
- 271,279 prose blocks and 44,485 table rows;
- stable sentence IDs, made unique within each chapter by the migration below;
- paragraph anchors currently derived from array position (`#p-18`), which are
  useful for readers but not sufficiently stable as database identifiers.

The pre-migration audit found 53,021 missing or duplicate content-unit IDs in
156 chapters. Most were in *Zizhi Tongjian*, where multiple sentences in a
paragraph sometimes shared one ID.

## Content-Unit Migration

The prerequisite migration was completed on 2026-08-10. It scanned all 4,099
chapters and 2,404,924 content units, changed 53,012 later occurrences of
duplicated IDs, and supplied IDs for nine units that had none. A post-migration
check found zero missing or duplicate IDs.

The deterministic migration tool and its permanent audit trail are:

```text
scripts/normalize-content-unit-ids.mjs
data/people/migrations/unit-id-normalization.json
```

The report records the source locator, old and new ID, reason, and Chinese-text
hash for every change. The migration also updated 31 exact references in the
source-correspondence review data. Five locators that were already stale were
left untouched rather than guessed; they are listed in the report for later QA.

Use these checks before accepting chapter-extraction output:

```sh
npm run people:check-ids
npm run people:normalize-ids:self-test
```

`make validate` also runs the corpus-wide uniqueness check. A future scoped
repair must write a new dated report instead of replacing the original audit
trail, for example:

```sh
node scripts/normalize-content-unit-ids.mjs --apply --book songshu \
  --report data/people/migrations/unit-id-normalization-YYYY-MM-DD.json
```

## Directory Layout

Tracked source data:

```text
data/people/
  config.json
  schema/
    extraction.schema.json
    canonical-person.schema.json
    resolution.schema.json
    chronology.schema.json
  extractions/
    songshu/
      069.json
    nanshi/
      033.json
  chronology/
    polities.json
    reigns.json
  resolution/
    decisions/
      batch-000001.json
    shards/
      00.json ... ff.json
  records/
    00.json ... ff.json
  curation/
    overrides.json
    role-vocabulary.json
  migrations/
    unit-id-normalization.json
```

Generated data, which should be reproducible and normally gitignored:

```text
data/people/generated/
  local-person-map.json
  person-mention-index.json
  book-person-index/
  unresolved-identity-queue.json
  stale-annotation-queue.json

public/data/people/
  index.json
  search-index.json
  records/<shard>.json

public/people/
  <slug>--<person-id>.html
```

The 256 shards are selected by the first byte of the opaque person ID. Shards
avoid one enormous merge-conflict-prone file without adding tens of thousands
of tiny source files to Git.

## Stable Identifiers

### Content units

Before extraction, every prose sentence, table-header cell, and table-body cell
must have an ID that is unique within its chapter.

The normalization migration must:

- preserve every ID that is already unique;
- preserve the first occurrence of a duplicated ID;
- give later occurrences deterministic unused suffixes;
- give missing IDs the next available numeric ID;
- record every change with book, chapter, block index, item index, old ID, new
  ID, and a hash of the Chinese text;
- update or regenerate tracked reports that refer to changed IDs;
- fail if a second check finds any missing or duplicated IDs.

The public identity of a content unit is therefore:

```text
<book>:<chapter>:<unit-id>
```

For example, `songshu:069:s0177`. The extraction also records the block and item
positions for diagnostics, but position is not the primary key.

### Chapter-local people

Each extraction assigns local IDs in chapter order:

```text
songshu:069:p001
songshu:069:p002
```

These are permanent evidence subjects. They are not public person IDs and do not
change when identities are merged or split later.

### Mentions and claims

Mentions and claims are likewise chapter-local and globally namespaced:

```text
songshu:069:m0001
songshu:069:c0001
```

### Canonical people

Canonical IDs are opaque, immutable IDs minted only by the resolver, for
example `per_01JZ8K7M2Q6YF9X4W3D1`. A readable slug is stored separately:

```text
/people/cao-cao--per_01JZ8K7M2Q6YF9X4W3D1.html
```

Dates, names, and slugs can be corrected without breaking the ID. When two
canonical people are merged, the retired ID remains as a redirect to the
surviving ID.

## What Counts as a Person

Include every named human individual, whether prominent or obscure, including:

- rulers, officials, generals, scholars, authors, consorts, servants, monks,
  nuns, envoys, rebels, merchants, and named commoners;
- historical, legendary, and uncertain individuals, with historicity recorded;
- people named only in commentary, quotations, genealogies, or tables;
- a person referred to by a unique title or shortened name when the referent is
  unambiguous in context.

Do not create person records for:

- unnamed people such as "a soldier," "his maid," or "the messenger";
- collective groups, clans, armies, offices, places, books, reign periods, or
  deities that are not also treated as human historical figures;
- an ambiguous title such as "the governor" when the chapter does not establish
  who it is.

Pronouns are useful evidence for claims but are not linkable mentions. On the
site, linking every `he` or `she` would make the prose noisy and would imply more
certainty than the text often supports.

## Linkable Mention Policy

A mention is an explicit referring expression in the Chinese, the English, or
both. Link these when their referent is clear:

- full personal names;
- given names or shortened names used to refer to a known person;
- courtesy, childhood, religious, temple, posthumous, or alternate names;
- noble or official titles used in place of a name;
- kinship expressions only when they function as a unique name in context and
  the extraction agent identifies the referent confidently.

Mention spans in one language may not overlap. If `Cao Cao` and `Cao` could both
be annotated over the same characters, retain the longest expression. A single
sentence may contain several separate mentions of the same person.

## Chapter Extraction Schema

Each chapter is processed independently. The expanded validation form below is
illustrative; the tracked v2 sidecar folds name and role claims into people,
groups repeated mentions into compact surface rules, and groups candidate
dispositions. Build-time expansion must reproduce a valid form equivalent to:

```json
{
  "schemaVersion": 1,
  "book": "songshu",
  "chapter": "069",
  "input": {
    "unitCount": 416,
    "chineseFingerprint": "sha256:...",
    "englishFingerprint": "sha256:...",
    "unitDigests": [
      { "id": "s0001", "zh": "sha256:...", "en": "sha256:...", "literal": "sha256:..." }
    ]
  },
  "run": {
    "model": "grok-4.5",
    "promptVersion": 3
  },
  "people": [
    {
      "localId": "songshu:069:p001",
      "preferredNameSuggestion": {
        "en": "Caizao",
        "zh": "採藻"
      },
      "historicity": "historical",
      "descriptorSuggestion": "Maid",
      "identityHints": {
        "nativePlaces": [],
        "relatedLocalPeople": ["songshu:069:p002"],
        "activeDateHints": ["liu-song-yuanjia:22"]
      }
    }
  ],
  "mentions": [
    {
      "id": "songshu:069:m0001",
      "person": "songshu:069:p001",
      "unit": {
        "id": "s0177",
        "kind": "paragraph-sentence",
        "blockIndex": 18,
        "collection": "sentences",
        "itemIndex": 6
      },
      "kind": "personal-name",
      "spans": {
        "zh": [{ "exact": "採藻", "occurrence": 0 }],
        "en": [{ "exact": "Caizao", "occurrence": 0 }]
      },
      "candidateRefs": ["songshu:069:cand_..."]
    },
    {
      "id": "songshu:069:m0002",
      "person": "songshu:069:p001",
      "unit": {
        "id": "s0179",
        "kind": "paragraph-sentence",
        "blockIndex": 18,
        "collection": "sentences",
        "itemIndex": 8
      },
      "kind": "personal-name",
      "spans": {
        "zh": [{ "exact": "採藻", "occurrence": 0 }],
        "en": [{ "exact": "Caizao", "occurrence": 0 }]
      },
      "candidateRefs": ["songshu:069:cand_..."]
    }
  ],
  "claims": [
    {
      "id": "songshu:069:c0001",
      "subject": "songshu:069:p001",
      "predicate": "name",
      "value": {
        "kind": "personal",
        "en": "Caizao",
        "zh": "採藻",
        "pinyin": "Cǎizǎo"
      },
      "certainty": "explicit",
      "evidence": ["songshu:069:s0177"]
    },
    {
      "id": "songshu:069:c0002",
      "subject": "songshu:069:p001",
      "predicate": "role",
      "value": { "roleId": "maid", "label": "Maid" },
      "certainty": "explicit",
      "evidence": ["songshu:069:s0177"]
    },
    {
      "id": "songshu:069:c0003",
      "subject": "songshu:069:p001",
      "predicate": "death",
      "value": {
        "manner": "poisoned",
        "dateContext": { "reignId": "liu-song-yuanjia", "year": 22 }
      },
      "certainty": "explicit-event-contextual-date",
      "evidence": ["songshu:069:s0179", "songshu:069:s0226"]
    }
  ],
  "translationRepairs": [],
  "candidateDispositions": [],
  "coverage": {
    "allUnitsVisited": true,
    "preflightCandidatesAccountedFor": true,
    "unresolvedReferences": []
  }
}
```

The block and item indexes above are illustrative; the real extractor writes
their current validated values.

The chapter fingerprints record provenance. The compact per-unit digests make
later changes local: a validator can identify exactly which covered units
changed instead of invalidating an otherwise sound chapter extraction.

### Span representation

Agents provide exact visible text plus a zero-based occurrence number. A host
normalizer computes offsets and hashes after validating the output. Agents
should not be trusted to count Unicode offsets correctly.

Each normalized span stores:

```json
{
  "exact": "Caizao",
  "occurrence": 0,
  "startCodePoint": 30,
  "endCodePoint": 36,
  "unitTextHash": "sha256:..."
}
```

The build fails if the unit no longer exists, a changed unit has not gone through
delta validation, the exact text cannot be located at the recorded occurrence,
or two spans overlap. A separate repair command may update an annotation
automatically only when the same exact surface has one unambiguous location in
the edited sentence. There is no silent fallback.

When a later source or translation edit changes a unit digest, a delta packet
contains that unit, enough neighboring context to resolve references, its old
mentions and claims, and current candidate hints. The agent or deterministic
remapper updates only that unit's annotations and coverage digest. This is
maintenance of changed material, not a second pass over the chapter or corpus.

### Candidate dispositions

Before the AI run, deterministic scanners produce hints from:

- chapter titles;
- Chinese formulas such as `姓`, `名`, `字`, `諱`, `小字`, `改名`, `賜名`,
  `謚`, and `廟號`;
- English formulas such as "courtesy name," "son of," "daughter of," "died,"
  and "aged";
- capitalized English name candidates;
- Chinese Notes proper-noun glossary matches;
- names already known from completed extractions.

The glossary has more than 8,000 `isProperNoun` entries, but this flag also
includes places, dates, and other non-people. It is a hint, never authority.

Every preflight hint must appear either as a person mention or in
`candidateDispositions` with a reason such as `place`, `office`, `book-title`,
`collective`, `deity`, `not-a-name`, or `ambiguous`. This does not prove perfect
recall, but it prevents likely names from disappearing silently.

## Claims Captured in the One Chapter Pass

To avoid needing a second corpus pass, extraction records the following when
the chapter states or strongly establishes it:

- all personal names and name types;
- surname and given-name components when known;
- courtesy names, childhood names, religious names, alternate names, changed
  names, temple names, posthumous names, and posthumous titles;
- sex or gender only when explicit or linguistically certain;
- native place and lineage information useful for disambiguation;
- parent, child, sibling, spouse, adoption, and other explicit kinship;
- occupations and broad historical roles;
- significant offices, noble titles, and enfeoffments;
- polity associations and the nature of each association;
- birth, death, age-at-event, accession, deposition, and reign-date evidence;
- authorship of named works when it helps identify or describe the person;
- explicit renaming and same-person statements;
- uncertainty, textual variants, and conflicting claims.

This is not a general event graph. We do not need to structure every battle,
journey, audience, or speech. The person page can show those incidents through
dynamically generated mention snippets.

## Names

A canonical person can have any number of names:

```json
{
  "kind": "courtesy",
  "en": "Weizong",
  "zh": "蔚宗",
  "pinyin": "Wèizōng",
  "preferred": false,
  "claimRefs": ["songshu:069:c0123"]
}
```

Supported initial name kinds:

```text
personal, surname, given, courtesy, childhood, alternate, changed,
religious, style, nickname, temple, posthumous, regnal, title
```

Names outside this vocabulary are retained as `alternate` and placed in a
curation queue. Non-Han and transliterated names are stored as the source gives
them; the schema must not assume every person has a one-character surname or a
Han-style given name.

Noble and official titles are normally claims rather than names. They are also
recorded as name-like aliases only when the text actually uses the title as the
person's identifying expression.

## Roles and One-Line Descriptions

The public page uses a compact label, not an invented mini-biography:

```text
Fan Ye
范曄
Historian and Official
```

Extraction agents suggest broad roles from a controlled vocabulary, such as
`ruler`, `official`, `general`, `warlord`, `historian`, `scholar`, `poet`,
`consort`, `eunuch`, `monk`, `nun`, `envoy`, `rebel`, `merchant`, `maid`, and
`artisan`. Exact offices remain separate claims.

After identity resolution, a description composer sees the merged claim dossier
and proposes a title-cased phrase of roughly two to eight words. It may combine
two or three genuinely defining roles, but it may not add an unsupported value
judgment. The phrase and its supporting claim references are stored in the
canonical record so that the website does not generate prose at request time.

Examples:

```text
Cao Cao - Warlord, Statesman, and Poet
Fan Ye - Historian and Official
Caizao - Maid
```

An editor can override this phrase without changing the underlying roles.

## Polities and Dynasties

Never infer a person's polity solely from birth and death years or from the book
in which the person appears. This would incorrectly attach people to rival or
geographically separate states that happened to exist at the same time.

Use explicit associations:

```json
{
  "polityId": "northern-wei",
  "relation": "served",
  "certainty": "explicit",
  "claimRefs": ["weishu:042:c0018"]
}
```

Initial association relations are:

```text
ruled, member-of-ruling-house, served, held-office-in, military-service,
subject-of, resident-in, active-in, opposed, dynastic-founder-posthumous
```

`active-in` is a cautious contextual association. It is useful for someone such
as Caizao without asserting that she held office. Rival affiliations can coexist
when the evidence supports them, and each association has its own date range and
citations.

Polities are canonical objects in `chronology/polities.json`. Their labels may
say "Eastern Han," "Cao Wei," "Shu Han," or "Northern Wei" rather than relying
on the broad dynasty label in a book's metadata.

## Dates, Reign Years, and Ages

### Display convention

All public output uses **BC** and **AD**. This is a site-wide configuration, not
something individual agents choose. Internal sorting may use astronomical year
numbers, but no year zero is ever displayed.

```json
{
  "westernEraStyle": "BC_AD"
}
```

### Preserve the source date

Every dated claim retains the source representation and the conversion:

```json
{
  "sourceDate": {
    "text": "元嘉二十二年",
    "reignId": "liu-song-yuanjia",
    "regnalYear": 22,
    "month": null,
    "day": null,
    "sexagenaryDay": null
  },
  "westernYear": {
    "era": "AD",
    "year": 445,
    "precision": "year"
  },
  "conversion": {
    "method": "reign-year-table",
    "chronologyVersion": 1
  }
}
```

Agents identify the reign, regnal year, and relevant context. A deterministic
chronology module performs and validates the BC/AD conversion. It is unsafe to
resolve a reign name by text alone because reign names can repeat under different
rulers and states.

`chronology/reigns.json` therefore gives every reign an unambiguous ID, polity,
ruler when known, start and end dates, and explicit year mappings or overrides
for irregular transitions. Version 1 converts years only. It must not pretend to
produce exact Gregorian month and day values without a tested historical Chinese
calendar implementation.

### Contextual dates

The sentence stating a death may say only "he was executed." The governing year
may have been established earlier in the paragraph or section. A claim may cite
both the event unit and its date-context unit. `certainty` distinguishes an
explicit same-sentence date from a date inherited from narrative context.

### Universal attested chronology

Every canonical person should have a time indicator, even when no birth or
death year is known. Chapter extraction prompt v5 therefore requires each local
person to carry at least one evidence-backed `attestation` claim and a concise
`activeDateHints` entry. The preferred result is a Western year or bounded
interval. Multiple mentions produce an earliest/latest **attested activity**
interval; that interval is not a lifespan and must never be displayed as one.

When the source gives a reign year, the claim preserves the source wording and
the units that establish its context. A deterministic chronology compiler adds
the BC/AD conversion when the supplied reign table supports it. If conversion
is not yet possible, the claim remains explicitly unresolved but still retains
useful context such as "during Emperor Xuan's reign." Legendary and genuinely
undatable material uses a qualitative marker such as "legendary antiquity";
the system does not invent a year for the Yellow Emperor.

```json
{
  "predicate": "attestation",
  "value": {
    "sourceDate": {
      "text": "元嘉二十二年",
      "reignId": "liu-song-yuanjia",
      "regnalYear": 22
    },
    "westernYear": { "era": "AD", "year": 445, "precision": "year" }
  },
  "certainty": "explicit-event-contextual-date",
  "evidence": ["songshu:069:s0179", "songshu:069:s0226"]
}
```

Prompt-v4 and earlier sidecars remain valid while a dedicated temporal backfill
uses their mention evidence and chapter chronology. Missing attestations in
legacy sidecars are reported as migration debt rather than silently treated as
unknown lifespans.

### Deriving birth years from age at death

Agents record the stated age and its wording; they do not silently perform the
arithmetic. The chronology compiler creates a separate derived claim.

For example, Fan Ye's execution and the statement that he was forty-eight can
support a birth estimate around AD 398 when the death year is AD 445 and the age
is interpreted as traditional East Asian `sui` reckoning:

```json
{
  "predicate": "birth",
  "value": {
    "westernYear": { "era": "AD", "year": 398, "precision": "circa" },
    "derivation": {
      "rule": "death-year-minus-sui-age-plus-one",
      "inputs": ["death-claim-id", "age-claim-id"]
    }
  },
  "certainty": "derived"
}
```

If the age reckoning, event year, or text is uncertain, the compiler emits a
range or leaves the birth year unresolved. Derived dates never overwrite an
explicit birth statement. Conflicting claims remain visible to the resolver and
can be shown as uncertain rather than collapsed to false precision.

## Identity Resolution

Chapter agents do not directly edit canonical people. Parallel agents would
otherwise race to create and modify `Cao Cao`, and a mistaken early merge would
spread through the whole corpus.

After a batch of chapter extractions is validated, the resolver builds dossiers
from local people and their cited evidence windows. It proposes clusters using:

- exact Chinese and English names;
- courtesy, temple, posthumous, childhood, and alternate names;
- native place and lineage;
- kinship links;
- offices and titles;
- compatible dates and polities;
- co-occurring people;
- highly similar parallel passages across different histories.

The repeated Caizao incident in `songshu/069` and `nanshi/033`, with the same
Chinese name, co-participants, actions, and sequence, is strong evidence for a
merge even though the character variant `採/采` differs.

### Conservative merge rule

A false merge is more damaging than a temporary duplicate page. Exact romanized
or Chinese spelling alone is not sufficient for common or short names.

Resolution decisions are explicit and reviewable:

```json
{
  "decision": "merge",
  "canonicalPersonId": "per_...",
  "localPeople": ["songshu:069:p001", "nanshi:033:p014"],
  "basis": ["parallel-passage", "same-name", "same-co-participants"],
  "confidence": "high"
}
```

Other decisions are `keep-separate`, `possible-same-as`, `split`, and `redirect`.
Low-confidence candidates stay separate and enter a review queue. The resolver
can be rerun after new chapters are extracted without changing raw evidence.

## Canonical Person Record

One resolved person has one canonical object:

```json
{
  "id": "per_...",
  "slug": "fan-ye",
  "preferredName": { "en": "Fan Ye", "zh": "范曄", "pinyin": "Fàn Yè" },
  "description": {
    "en": "Historian and official",
    "claimRefs": ["songshu:069:c...", "houhanshu:001:c..."]
  },
  "historicity": "historical",
  "names": [],
  "roles": [],
  "life": {
    "birth": null,
    "death": null,
    "ageClaims": []
  },
  "polityAssociations": [],
  "relationships": [],
  "localPeople": ["songshu:069:p..."],
  "retiredIds": [],
  "curation": {
    "status": "machine-reviewed",
    "notes": []
  }
}
```

The canonical record selects accepted display values. The complete evidence and
conflicting alternatives remain in extraction claims and generated dossiers.

## Website Build

### Mention links

The static generator loads the compiled local-person map and the extraction for
the current chapter. It wraps exact Chinese and English mention spans with links
to the canonical person URL.

Each rendered unit receives stable language-specific anchors:

```text
#zh-s0177
#en-s0177
```

This avoids duplicate HTML IDs in the side-by-side Chinese and English columns.
Existing paragraph anchors such as `#p-18` remain for human-readable citations.

When links are injected into Chinese, the current per-character glossary spans
remain inside the person link. The renderer must reject overlapping or nested
person mentions rather than emitting invalid HTML.

### Person pages

A person page contains:

- preferred English, Chinese, and pinyin names;
- the concise role description;
- known life dates, with `c.` or ranges where appropriate;
- all recorded names grouped by type;
- explicitly evidenced polity associations;
- selected close relationships when useful;
- references grouped by book and chapter;
- a current Chinese and English snippet pulled from each referenced paragraph;
- links to the precise mention in the chapter.

For readability, repeated mentions in the same paragraph are one reference card
with an occurrence count. The underlying index still retains every mention.

Person pages use current chapter text at build time. They do not store or serve
AI-generated incident summaries. This avoids stale prose and preserves Garrett's
translation as the reader-facing account.

### Search and SEO

The person search index includes all English names, Chinese names, pinyin with
and without tone marks, alternate names, role labels, and life years. Person
pages use one generic person-page Open Graph image; generating tens of thousands
of bespoke PNGs would add large build and repository costs for little benefit.

## Ebook Build

For each ebook product, generate a glossary containing every canonical person
with at least one mention in the included chapters.

Each main-text mention links internally to that person's glossary anchor. Each
glossary entry contains:

- English and Chinese preferred names;
- alternate names used in that book;
- concise description;
- life dates when known;
- chapter references linking back to the exact anchored sentence;
- a link to the person's 24histories.com page for cross-book references, if
  external links remain acceptable in final Kindle QA.

Large glossaries are split into bounded XHTML chunks, for example 250-300 people
per file, rather than one enormous document. The package manifest and navigation
include all chunks. Internal hrefs are calculated after chunking, so a person's
mentions always point to the correct file and anchor.

The ebook glossary is book-scoped: Cao Cao's Sanguozhi entry links back to his
mentions in that ebook, while his website page shows Hou Hanshu, Sanguozhi, and
later callbacks across the entire corpus.

## Validation and Failure Policy

The build must fail loudly on structural errors. Required checks include:

- every content unit has an ID unique within its chapter;
- extraction book and chapter match the source chapter;
- every current unit has a matching coverage digest or a completed delta
  extraction;
- every mention references an existing unit and local person;
- every exact span resolves to the recorded occurrence;
- normalized offsets and hashes match current text;
- mention spans do not overlap within one language;
- every local person has at least one mention or an explicit exception;
- every claim subject exists and every evidence reference resolves;
- every preflight candidate has a disposition;
- every chapter-local person used by a build maps to exactly one active
  canonical person;
- no canonical person maps to a retired ID without a redirect;
- every accepted date conversion names a known reign and mapping version;
- every description is supported by accepted role claims;
- generated website and EPUB href targets exist;
- ebook XHTML remains valid after mention-link injection.

Warnings, rather than failures, are appropriate for unresolved identity matches,
conflicting dates, uncertain polity associations, and people whose only useful
description is `Unknown role`. These go into explicit queues and are never
silently guessed away.

## One-Pass Cursor SDK Workflow

### 1. Freeze the input contract

Before spending the large batch of credits:

1. Normalize content-unit IDs and validate repository references.
2. Implement JSON schemas, extraction validator, preflight candidate scanner,
   and span normalizer.
3. Implement a chronology seed sufficient for pilot chapters.
4. Run pilots on several different chapter types.
5. Freeze verbose worker schema version 1, compact accepted schema version 2,
   and `promptVersion: 3`.

Recommended pilots:

- `songshu/069` for biography, aliases, conspiracy, death, and Caizao;
- `nanshi/033` for a parallel account and cross-book identity merge;
- `sanguozhi/001` for dense Pei Songzhi commentary and many callbacks;
- one annals chapter dominated by dates and title-only references;
- one table-heavy chapter;
- one chapter with non-Han transliterated names.

### 2. Prepare deterministic chapter packets

The orchestrator creates an isolated packet containing:

- the chapter JSON;
- normalized unit locators;
- candidate hints;
- relevant polity and reign choices;
- the extraction schema;
- the exact extraction prompt;
- an empty output path.

Before dispatch, deterministic audits should also flag closed-vocabulary
mismatches that do not need model judgment, including sexagenary day names,
reign labels, numerals, and known fused-word patterns. The Hanshu 3 pilot showed
why: the worker missed `辛未` translated as *xinhai* and `甲子` translated as
*jiashen*, while a direct source-to-pinyin check identifies both exactly.

The packet includes all context an agent needs. Agents must not browse, directly
edit the translation, run site builds, or touch shared canonical records. Clear
editorial errors are returned as structured proposals for a separate validated
repair phase.

### 3. One agent per chapter

Use Cursor Cloud with bounded concurrency. Grok 4.5 at low effort is the default
biography and editorial lane; medium/high effort is reserved for dense rhetoric,
ambiguous identity passages, and chapters that fail semantic QA. Gemini 3.6
Flash did not reduce pilot cost, so it is not a separate bulk lane. Each agent
writes exactly one compact extraction artifact. One chapter per agent gives
clean retries, predictable context, and isolated failures. Agents have
`autoCreatePR: false` and are explicitly forbidden to commit or push. Every
successful phase copies its result to `/opt/cursor/artifacts/` for host download.

The agent performs extraction and a self-audit in one run. It must explicitly
confirm candidate dispositions, chronology context, name types, and unresolved
references before finishing.

### 4. Host-side validation before acceptance

The orchestrator, not the agent, validates schema, locators, exact spans,
coverage, and fingerprints. Invalid output is quarantined with diagnostics and
the chapter remains pending. A retry receives the validation errors and the same
input packet.

The state manifest records:

```text
pending -> claimed -> extracted -> validated -> accepted
                              \-> failed/retryable
```

Only validated files enter Git. Create local commits in moderate batches, such
as 50-100 chapter sidecars, so failures and regressions remain reviewable. Keep
those checkpoints local during routine processing. At a deliberate larger
boundary, push the accumulated commits to `codex/people-glossary-staging`;
merge that branch to `master` only when ready for one production Cloudflare
build.

### 5. Review editorial repairs

Extraction workers propose repairs but never apply them. A separate reviewer
sees the Chinese unit, both English fields, the proposed replacement and reason,
and a small window of adjacent units. The reviewer must accept, reject, or
revise each proposal from textual evidence. Source-text corrections require an
identified textual witness. Accepted repairs are then applied by the host,
candidates and spans are rebuilt, and the sidecar is revalidated.

Decision records are tracked under
`data/people/editorial-decisions/<book>/<chapter>.json`. They embed the immutable
original proposals, fingerprint both the chapter and proposal set, identify the
reviewer, and cite a source witness for every accept, reject, or revision. The
applier rejects stale or incomplete decisions, self-review by the extraction
agent, changed proposal contracts, and any revision that leaves unresolved
mentions or candidates. It validates the complete revised state before writing
either chapter or sidecar.

Version 3 decision records may also retract an extraction claim proven to be a
translation artifact or revise a claim whose underlying fact remains valid.
The reviewer embeds the complete old claim, ties the action to an accepted or
revised repair in the same evidence unit, and provides its own source witness.
A claim revision additionally embeds the complete replacement while preserving
the claim ID, subject, predicate, and evidence. Application changes claims
atomically with the text repair; the global audit then proves that a retracted
fact is absent and that every revised fact replaced its old form. A valid alias
or fact is never retracted merely because revised English no longer spells it
out.

Name-bearing repairs are reconciled atomically. The applier remaps stale English
spans only from that person's existing preferred name or name/title claims,
limited to claims evidenced in the repaired unit. It may expand a shorter span
to one enclosing candidate only when no other person overlaps it; ambiguity
halts the write. Compact sidecars preserve explicit candidate dispositions on
round trip, even when a disposed place-name candidate lies inside a valid person
title such as *Marquis of Chang'an*.

This is a focused review of proposed changes, not a second pass over the corpus.
It is necessary because the pilots found confident false repairs: one worker
mistook a second-person `君` for Lord Jing, and another interpreted the corrupt
source character `剨` as frost even though the received Hanshu text has `靁`, a
variant of `雷` (thunder).

### 6. Resolve identities from dossiers

Once a useful batch is accepted, deterministic matching creates identity
candidate dossiers. Resolver agents see only structured claims and small cited
context windows pulled from the current chapters. They do not rescan entire
books. High-confidence decisions update resolution shards and canonical person
records; uncertain cases remain queued.

Resolution can run continuously behind extraction. It does not need to delay the
remaining chapter agents.

### 7. Generate and verify outputs

After coverage is complete:

1. Compile all resolution mappings and person records.
2. Generate person pages and search indexes.
3. Rebuild chapter pages with mention links.
4. Generate ebook glossaries and backlinks.
5. Run broken-link, XHTML, schema, stale-span, and unresolved-person checks.
6. Manually inspect the pilot people, common-name collisions, and several very
   large glossary entries before enabling links site-wide.

## Prompt Requirements

The chapter-agent prompt must state these rules explicitly:

- Read both Chinese and idiomatic English; Chinese controls identity and name
  characters, while English controls the visible English span.
- Record every named human, not only the chapter's biography subjects.
- Record every explicit occurrence, including repeat mentions.
- Do not link pronouns or invent people for unnamed roles.
- Create separate local people when identity is uncertain.
- Record aliases and relationships that will help a later resolver.
- Preserve source uncertainty and textual variants.
- Record date context even when it occurs earlier than the event sentence.
- Give every person an evidence-backed attestation: prefer a Western year or
  interval, preserve unresolved source chronology, and use qualitative time
  only for genuinely undatable material.
- Never convert a reign year by memory; select a supplied reign ID or mark it
  unresolved.
- Record stated ages without silently deriving a birth year.
- Assign polities from textual context, never from lifespan alone.
- Use broad supported roles for the description suggestion; keep exact offices
  as claims.
- Give every claim evidence and every preflight candidate a disposition.
- Write only the assigned extraction file.

## Schema Evolution

The extraction files are expensive evidence. Preserve them.

When a future feature needs a new derived field, first attempt to compute it
from existing mentions and claims. If the schema changes, add a deterministic
`v1 -> v2` migration and retain the original run metadata. Do not launch a new
chapter-wide AI pass merely to rename fields or rearrange objects.

A true second corpus pass is justified only for information that version 1 did
not capture and cannot derive, not for fixing an avoidable schema omission.

## Recommended Implementation Order

1. Add the ID normalizer, migration report, and uniqueness validator.
2. Add schemas and shared content-unit locator helpers.
3. Add the extraction preflight scanner and packet builder.
4. Add the extraction validator and exact-span normalizer.
5. Implement the Cursor SDK extraction orchestrator with resume and retry.
6. Run and inspect the six pilot chapter types.
7. Add chronology and polity seed data needed by the pilots.
8. Implement identity candidate generation and reversible decisions.
9. Implement canonical record shards and description composition.
10. Add website person pages, search, and mention-link rendering.
11. Add ebook glossary chunking, main-text links, and backlinks.
12. Run the full extraction batch, resolve identities continuously, then enable
    production output only after validation reaches zero structural errors.

## Final Answers to the Initial Design Questions

**Are we inserting hidden info in the translation JSONs?** No. Translation JSON
remains readable and editorially focused. Person annotations live in chapter
sidecars keyed to normalized content-unit IDs.

**Are we creating a new object for each person?** Yes, at two levels. Each
chapter extraction creates local person objects without making risky global
assumptions. The resolver then maps those local objects to one canonical person
object per historical individual.

**How do snippets stay current?** Person pages and ebook glossaries pull current
paragraph text at build time from the chapter JSON. The annotation stores only
the person, exact mention span, and evidence locator.

**How do we avoid a second chapter pass?** The first pass captures a deliberate
superset of identity-relevant facts, every mention, date context, aliases,
relationships, roles, polity evidence, and uncertainty. Later agents work from
compiled dossiers and cited windows, not from another scan of all chapters.
