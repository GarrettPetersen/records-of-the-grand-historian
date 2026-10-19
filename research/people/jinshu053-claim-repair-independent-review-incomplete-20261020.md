# Jinshu 053: independent claim review and repair proposals

Status: **incomplete research; proposals, not a schema-sealed decision, date
audit, identity resolution, source edit, or publication approval**. This
review did not author the V2 draft and does not change it, any canonical file,
claim reservation, lock, or review history. The V2 files inspected were:

* `jinshu053-source-reviewed-reconciliation-v2-incomplete-20261020/source.json`,
  SHA-256 `a810ace8d38f97313800c968c6858373dc08c98ef08440dfa56e6907a9bd950c`.
* `.../reconciled-extraction.json`, SHA-256
  `badd6a43e26940d85d3e3673a1533287fda4c9ab9dd78fea6afc970de756b4cb`.
* `.../proposed-extraction.json`, SHA-256
  `3a5a61d771beee8a11b8fdbe9e0d357eeda47e30ef3ea289c11f87cc08370d27`.
* Current canonical `data/jinshu/053.json`, SHA-256
  `85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407`.

These are bytes, not interchangeable chapter/packet fingerprints. The owner
must regenerate a sealed packet after any edit and independently review the
final candidate; do not substitute these hashes into historical approvals.

## c0106: Jiang Jun's rank

Local s0065 reads `太子保林蔣俊`. The [Jinshu 053 transcription](https://zh.wikisource.org/wiki/晉書/卷053)
confirms the wording, and the [Taiping Yulan 149 section headed 保林](https://zh.wikisource.org/wiki/太平御覽_(四部叢刊本)/卷之一百四十九)
quotes Wang Yin's Jinshu describing the crown prince's favored baolin Jiang
Jun. This supports a consort rank, not a guardian. Proposed exact V2 delta:

* `jinshu:053:c0106.value.en`: `Heir guardian Jiang Jun` →
  `Crown Prince's baolin Jiang Jun`. Retain `value.zh` unchanged and its
  source evidence `jinshu:053:s0065`. Check the accepted schema kind and
  generated name display when materializing; do not infer that every word in
  the English is a personal name.
* The V2 s0065 English still contains the old wording. Apply only independently
  reviewed bilingual corrections from the properly sealed seven-field packet;
  then regenerate mention/candidate spans against those final fields.
* `c0528` gives `authorityPersonId: jinshu:053:p053` for her death with only
  s0065 evidence. That sentence attributes the armed escort to Dan and records
  the deaths, but does not unambiguously designate the interrogation's
  authority. Review and remove the authority field absent additional explicit
  evidence; preserve the supported death manner and assess date separately.

This does not by itself establish that s0017's unnamed child is p028 or resolve
the identity of every Lady Jiang mention.

## p051 / c0186: 梁王肜

The inspected V2 s0063 source reads `大將軍梁王肜`; the revised idiomatic
English reads Sima Rong, while p051 and c0186 still say Sima Tong. [Jinshu
038](https://zh.wikisource.org/wiki/晉書/卷038) identifies 梁孝王肜 and his
position as 大將軍; the [Chinese Text Project person entry](https://ctext.org/datawiki.pl?if=en&res=604594)
provides the full name and Romanization. On that combined basis, propose:

* `p051.preferredNameSuggestion.en`: `Sima Tong` → `Sima Rong`;
  `.pinyin`: `Sima Tong` → `Sima Rong`; preserve `zh: 司馬肜`.
* `c0186.value.en`: `Sima Tong` → `Sima Rong`;
  `value.pinyin`: `Tong` → `Rong`; preserve `value.zh: 肜` and s0063
  evidence. Since s0063 itself does not give the surname, change certainty
  from `explicit` to `strongly-inferred` for the full-name claim unless the
  owner can add valid evidence for the surname under the production schema.
  Preserve the actual other-source provenance with the review.
* Do not retain Tong as an alias merely because the old English contained it.
  Preserve the already corrected p051 mention and recheck its offsets on final
  source; do not treat this as a cross-chapter identity merge or date approval.

## s0017, child identification, and family detail

The local s0017 says the prince's favored Lady Jiang bore a boy and refers to
an imperial grandson, but neither identifies that son as Bin. Later s0170
lists three sons, and s0171 identifies 道文 as the courtesy name of the first
named subject, once the local omission is restored. The [Zizhi Tongjian 083
transcription](https://ancient-china-books.github.io/zizhitongjian/OEBPS/Text/6227.html)
calls Jiang Jun the mother of Bin; however [Jinshu jiaozhu on chapter 053](https://ctext.org/wiki.pl?chapter=769660&if=en)
cites Wang Yin via Taiping Yulan 358 for Jiang Di as maternal grandfather of
Zang, and its annotator associates Jiang Meiren with Zang while explicitly
leaving the other two sons' maternity unresolved. Those sources show why the
identity/parentage question needs source-aware independent review: they do not
prove that s0017's anonymous son is Bin. They also do not themselves establish
that Bin and Zang had different mothers. The genealogy remarks are not a
blanket finding that those sources are independent in textual ancestry.

Proposed V2 adjustments, subject to final owner-selected treatment of the
anonymous individual and production schema validation:

* `m0098` links s0017 `皇孫` to p028. Remove that identity assertion or assign
  the mention to a separately identified, explicitly unresolved local person
  through a reviewed extraction repair. Do **not** silently drop the named
  passage or fabricate a same-person link. Evaluate candidate coverage and
  duplicate-person consequences before selecting the representation.
* `c0113` identifies s0017 `皇孫` as p028 and `c0334` claims, on s0017 alone,
  that p028 is the child of p027. Remove those local-source assertions from
  p028 pending a properly sourced identity/relationship decision. If the
  schema supports external provenance, retain the Tongjian statement as a
  separately attributed, reviewed claim rather than miscite s0017. Reassess
  related-local-person hints for p027/p028 accordingly, without suppressing
  demonstrably sourced relationships.
* `c0114` (p028 royal-family role), `c0279` (male), and `c0333` (son of
  p001) currently cite s0017; remove that evidence as proof of Bin's identity.
  Reassess against s0170 and, for `c0333`, the locally explicit father/son
  wording in s0078 and s0170 once the lacuna is resolved. Delete c0333
  `value.subjectBirthOrder: 1`, which the cited material does not establish.
* Delete unsupported `subjectBirthOrder: 2` from c0348 and
  `subjectBirthOrder: 3` from c0349. Replace p028's `Eldest son of Sima Yu`,
  p068's `Second son of Sima Yu; imperial grandson-heir`, and p069's `Third
  son of Sima Yu; imperial grandson-heir` with non-ordinal descriptions grounded
  in the source. A three-name list is not by itself proof of birth order.
* c0350 and c0351 specify `sharedParentage: paternal-half` and
  `subjectRelativeAge: younger`; c0352 specifies `sharedParentage: full` and
  `subjectRelativeAge: younger`. Remove those unsupported qualifiers, not the
  source-supported fact that the three are sons of the same father. Select
  the production schema's representation for siblinghood with unspecified
  maternity and ages; if that is impossible, hold these rows for schema review
  rather than inventing a permitted value.
* Reassess p028's `AD 299` active hint and any attestation that relies on the
  s0017 link independently; do not delete or approve dates solely from this
  note. Do not erase independently supported s0053/s0078 道文 links without
  comparing their exact text and the restored s0171.

## Lacuna and sequencing

The V2 s0170 Chinese is `太子三子：、臧、尚，並與父同幽金墉。`; s0171 is
`字道文，永康元年正月，薨。`. [Jinshu 053](https://zh.wikisource.org/wiki/晉書/卷053)
and the [Siku transcription](https://zh.wikisource.org/wiki/晉書_(四庫全書本)/卷053)
show 虨 in both missing positions. An earlier independent review supports the
limited restorations and records a reported 霖 variant, whose existence does
not establish a personal alias. This report supports that limited emendation,
but does not validate the source-correction machinery or license direct edits.

Coordinate reviewed Chinese and bilingual changes before sealing new downstream
evidence. Rebuild all affected spans/coverage, validate against a fresh packet,
preserve authentic historical decisions, and obtain fresh independent date and
identity review on the resulting exact fingerprints. The surviving editorial
proposals and other unresolved chapter defects remain open.
