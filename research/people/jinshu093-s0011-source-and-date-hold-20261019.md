# Jinshu 093 s0011 — source/identity/chronology hold (draft)

This is a source-pinned research and proposed-repair draft, not a complete
chapter review, date-audit replacement, finding acceptance, identity decision,
or permission to modify the chapter or queue. It has not yet received an
independent review. It examines one sentence, not the full 093 corpus packet.
Do not count the chapter as complete on this basis.

Staging revision examined: `29469570bc6e35d27aae9cb9e75baea9d522abce`.
SHA-256 of exact staged file bytes (not logical packet fingerprints):

| Path | SHA-256 |
| --- | --- |
| `data/jinshu/093.json` | `8625c06da214d53adfc71c4969a6e5a2766db30b29b73dc0e2ee23ff8a77626c` |
| `data/people/extractions/jinshu/093.json` | `4c235fe03b5db2c79c7e881fc28b0333f2315bf02a39496f50b87f6abf8968d8` |
| `data/people/date-audits/jinshu/093.json` | `c269aad0cf926284689249fe390fc48c94879b3636a95634d2c8b2ed64999c30` |
| `data/people/editorial-decisions/jinshu/093.json` | `6b976377d0b4615c8c34b09c181541a1ec0e063d2924979a4c4145ed91e47dd0` |

The existing date report is `audited`, with logical source hash
`sha256:b83de35c67083750273b1c213e2f5a444ad342ddf9c7c7a640fd0705e9125bdc`
and extraction hash
`sha256:913a94949591224527014e5e594f9a7a10fb408dc0ea45f349e1959d4517cd1e`.
The evidence below contradicts its unqualified support for several chronology
checks. Do not silently amend the signed report, its hashes, or overwrite its
original bytes. The host must determine ownership, preserve the exact report,
and use a supported reviewed hold/re-audit transition; no claim was modified.

## Primary textual evidence

1. The staged s0011 reads `樊靡卿之父子，竇廣國之弟兄` and groups these
   examples with `陰興之守約戒奢，史丹之掩惡揚善`. The transcription at
   [Book of Jin 93](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7093)
   contains the same wording. The sentence itself supplies no regnal year,
   absolute dates, or named second member of the Fan pair.
2. [Book of Later Han 32](https://zh.wikisource.org/wiki/%E5%BE%8C%E6%BC%A2%E6%9B%B8/%E5%8D%B732)
   explicitly says `樊宏字靡卿` and `父重，字君雲`: Miqing is Fan Hong's
   courtesy name, and his father is Fan Zhong, courtesy Junyun. It also
   describes both father and son together as `樊重子父` during the Huyang
   conflict and praises Zhong's conduct; this strongly supports—but does not
   by itself prove—that the Jin historian intended that particular father-son
   pair. The same biography names Hong's son 鯈 and describes his virtue;
   hence Hong and his son must also be considered before resolving the local
   phrase. The cited digital text is a transcription, not a newly inspected
   physical edition.
3. [Records of the Grand Historian 49](https://zh.wikisource.org/wiki/%E5%8F%B2%E8%A8%98/%E5%8D%B7049)
   identifies Empress Dou's elder brother as 竇長君 and her younger brother
   as 竇廣國, 字少君. This supports investigating their pair for Jin's
   `弟兄`, but a cross-chapter match must be separately reviewed. The staged
   extraction has p003 for Guangguo and a `family-summary`, but no separate
   Dou sibling record or linked `弟兄` surface. Whether this definite callback
   requires a separate local person must be decided under the current full
   extraction schema and independently reviewed.
4. [Book of Han 83](https://zh.wikisource.org/wiki/%E6%BC%A2%E6%9B%B8/%E5%8D%B7083)
   praises Shi Dan in connection with supporting the deputy ruler, using the
   closely related phrase `掩惡揚美`. This context supports translating
   s0011's `掩惡揚善` as covering or overlooking faults while commending good;
   it does not establish the current idiomatic wording's specific `scandal`.

## Local identity and translation proposals, not yet approved

- p001 currently has preferred name `Fan Miqing / 樊靡卿` and labels the
  combined form `personal-name`. Do not treat 靡卿 as Hong's given name.
  Consider a source-backed preferred label Fan Hong / 樊宏 and a separately
  represented, correctly typed courtesy-name Miqing / 靡卿, while retaining
  the actually attested surface `樊靡卿` with the schema-valid mention kind.
  External provenance and name-claim citations need a schema-compliant solution;
  s0011 alone does not say `宏`. Do not fabricate that literal surface or
  automatically merge any cross-chapter local IDs. p001's `official` role is
  marked `explicit` using s0011 although that unit has no office; the Later
  Han biography supplies independent office evidence, not a verbatim s0011
  office. Review provenance and certainty.
- p002 is labeled `Father of Fan Miqing`, and the relationship states p001 is
  child of p002 with biological parentage and `explicit` certainty. The Huyang
  episode is meaningful corroboration for Zhong, but s0011's `父子` is not
  itself the explicit name or an unambiguous role assignment. Review the
  possible Hong/Zhong versus Hong/son interpretation before affirming the
  direction, assigning p002 a name, or keeping biological certainty. A strong
  preferred reading may be selected only with independently reviewed rationale.
- The staged literal `Fan Miqing’s father and son` can imply two relatives in
  addition to Hong, whereas the idiomatic `Fan Miqing and his father` selects
  one interpretation. A reviewable neutral draft is: **literal** “As for the
  father and son in Fan Miqing's family, the brothers of Dou Guangguo, Yin
  Xing's restraint and warning against extravagance, and Shi Dan's overlooking
  faults and commending goodness, these were admirable among the empresses'
  kin.” **Idiomatic** “Consider the father and son in Fan Miqing's family,
  Dou Guangguo and his brother, Yin Xing's restraint and warning against
  extravagance, and Shi Dan's habit of overlooking faults and praising good:
  all were admirable among imperial in-laws.” This preserves the Fan ambiguity
  but the singular Dou relation also needs review against the paired primary
  account. This is a proposed wording, not an applied editorial decision. It
  must be checked for whole-chapter consistency and reviewed independently;
  old 25 applied editorial repairs and reviewer provenance remain unchanged.

## Chronology hold requiring a full independent re-audit

- `claim-3` assigns p001 an attestation interval `AD 25–51` and puts
  `（東漢光武之世）` inside `sourceDate.text`, although neither wording nor
  endpoints appears in s0011. `claim-8` assigns p002 `BC 6–AD 51`; its source
  phrase has no such date. `hints-p001` and `hints-p002` repeat those windows.
  Their current date report marks all four supported with generic reasoning;
  the hints and person checks cite s0001, which discusses imperial affines in
  general and does not mention either person or a date. This is insufficient
  evidence for those exact windows. It does not by itself establish that every
  endpoint is historically false.
- Analogously, `claim-11`, `claim-16` and `claim-20` and their active hints
  assign date spans to p003–p005 despite s0011's being an undated retrospective
  assessment. These spans and their audit evidence require individual review,
  not blanket approval. The Later Han biography says Fan Hong died in 建武
  twenty-seventh year and that Zhong's tomb was visited in the eighteenth; do
  not infer a birth year or equate an undated laudatory remark to the person's
  lifetime. Converting regnal years to Gregorian endpoints requires separately
  checked calendar evidence and uncertainty. The schema's only later-reception
  category is `retrospective` where it is genuinely applicable.
- A conservative repair candidate could withdraw unsupported exact active
  hints and express the judgment as source-supported undated evidence, without
  asserting missing dates. Apply only through existing reviewed repair and
  validation paths, with a fresh independent complete date audit of final source
  and extraction. Review every item and person, not only these five. Identity,
  editorial, backlink, person-page and ebook gates remain separate.

The staged audit's historical reviewer identity and every report byte must be
preserved, not reused as the identity of a new independent reviewer. Confirm
current ledger, process ownership, staged fingerprints, and any retained
ignored workflow state before any future canonical or queue operation.
