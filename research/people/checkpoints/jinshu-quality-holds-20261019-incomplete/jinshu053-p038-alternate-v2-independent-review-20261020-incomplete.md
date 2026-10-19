# Jinshu 053 p038 alternate-name v2: independent exact-delta review

**Research only; not approval to publish or a complete chapter review.** I did
not author the v2 candidate or its generator. I read the source directly and
compared the complete parsed candidate with its original v3 baseline, not only
the intermediate v1. The earlier independent review was available to me, so
this is independent authorship, not a blind review.

## Pinned inputs

These are SHA-256 hashes of actual file bytes. The candidate manifest pins the
v1 predecessor; I verified the candidate and the following original v3 bytes
separately. The source, editorial history and review decisions are byte-for-byte
identical between the original v3 baseline and v2 candidate.

| Artifact | SHA-256 |
| --- | --- |
| Original v3 extraction | `13215bc5ec25605eda82e9ae22e99786480821e61b5a709faed7816e0445f22f` |
| v2 extraction | `e535984fa43b609bcbce77e346f53327d850061e09c82db63674b63e316c2bf1` |
| Both source files | `a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d` |
| Both editorial-history files | `da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7` |
| Both review-decisions files | `e13553b417b78da78b58dfc8e5cb267dd825e60345c72af572a3dcf01c00115a` |
| v2 manifest | `bcd99048a06c554fd00de0f04e6b048731d7f5419e5681a7492233e46555a049` |
| v2 generator | `fbe1f51c14036ee77ac4f6e052edcac02e14a3d55177aa5eb1f3f359ff4c7faa` |
| Independent chapter 096 source witness | `be8370803176c863317a6ec0bf918bea32f05c0c0f31168f6c5978c9bac60be2` |

The parsed full-extraction comparison finds precisely six changed claims
(`c0146`, `c0147`, `c0150`, `c0335`, `c0336`, `c0338`) and two mention-kind
changes (`m0146`, `m0149`). All other properties, people, claims, mentions,
spans, candidate dispositions, coverage, IDs and array order are unchanged.
The v1 generator temporarily deletes a claim and v2 reinserts it, but the
normalized output preserves the original stable IDs; this was checked on the
result, not assumed from the generator. This does **not** approve inherited
data. I did not rerun the validator; the manifest reports a prior strict
extraction and applied-history structural pass in the pinned staging fixture.

## Source and classification assessment

- `c0146` and `m0146`/`m0149`: 053 s0035 explicitly calls Wang Yan's younger
  daughter 惠風 / Huifeng. 096 s0098 independently titles the crown princess
  王惠風, while s0099 says 字惠風, explicitly identifying Huifeng as her
  courtesy name. 053 does not itself state that category. The schema allows
  `alternate-name` for names and mentions, and `people-presentation.mjs` maps
  it to the generic alternate family, distinct from courtesy. On that
  limited reading, the attested short form is a defensible nonspecific
  alternate relative to the suggested full label, not an assertion of a
  separate formal name. This does not record her known courtesy-name category
  or provide a 096 citation. Do not misrepresent 096 s0099 as 053-local
  evidence; a source-attributed cross-chapter claim and conservative identity
  resolution are still needed to show the more informative classification.
- `c0147`: 053 s0065's 太子妃王氏 and s0177's 妃王氏 support Wang/王 as the
  surname rather than asserting 王氏 literally spells 王惠風. Attaching both
  later references to p038 depends on the contextual identification of the
  younger daughter and crown princess; s0073 independently names the consort's
  father Wang Yan, and 096 corroborates the identification. The full preferred
  label is separately attested in 096 s0098, not as a full-name string in the
  cited 053 evidence for this surname claim.
- `c0150`: s0035 describes a betrothal, not proof of an accomplished consort
  role; s0065 explicitly calls her crown princess. Restricting role evidence
  to s0065 is appropriate conditional on the same identity attribution.
- `c0335`: s0073 says her father submitted a request for divorce; it does not
  say the request succeeded. Removing the definite `divorced` state and
  additional unverified union/role qualifiers is justified. S0065 and s0073
  support a crown-prince/consort relationship; `strongly-inferred` appropriately
  reflects the contextual attachment to p038. Neither source proves that the
  request was granted.
- `c0336`: s0035 says 王衍小女, Wang Yan's younger daughter; it identifies the
  father and daughter but does not expressly specify the biological-parentage
  qualifier. Removing that qualifier is conservative.
- `c0338`: s0035–s0036 refer to Wang Yan's younger and elder daughters. The
  sibling/relative-age reading is supported, but the passage does not establish
  the same mother. Removing `sharedParentage: full` is justified.

## Decision and remaining gates

The **exact limited delta is supportable as a research candidate**, conditional
on the generic rather than courtesy-name interpretation and the contextual
identity described above. It is not a recommendation to publish the complete
extraction. In particular, it does not independently resolve 053-to-096 identity
or establish whether all historical identity decisions remain valid. Prior
editorial reviews, source translation including s0177, complete extraction
coverage, current source/extraction fingerprints, date audit and any fresh
independent re-audit, identity, backlinks, public display/search and ebook
gates remain open. Inherited preferred-name/descriptor hints and all other
claims were not comprehensively audited here. A fresh production validator and
sealed, independently reviewed owner-controlled publication process are still
required; no canonical, queue, lock, shared index or worktree writes were made.
