# Jinshu 020: independent editorial review (97 translation repairs)

**Reviewer:** independent Cursor agent `bc-ca56fb16-d4fd-4ced-a2fb-3640376ab1df` (Composer 2.5 Fast), separate from retained owner #5413.  
**This is native independent editorial evidence only**, not chapter completion, date approval, identity closure, combined curation, or publication.

## Evidence pins

| Input | Pin |
| --- | --- |
| Owner draft | PR [#5488](https://github.com/GarrettPetersen/records-of-the-grand-historian/pull/5488) @ `9faf511034d929f9fb7d7b69edf5678c8059c991` |
| Chapter source | `sha256:ea4c955dcfebe4b9ec6f7ff187319a9f589b9497cb12c158344b469e44d9c0a2` |
| Extraction (draft) | `sha256:1d07879954af4979db2cc749d01844763be0063b4de12e609383a4a995843eca` |
| Proposals fingerprint | `sha256:dd3fa92722766ad6e4464ca6cc8c3789f81cf5ad1ff848575d142bb3c78a218d` |
| Decision artifact | `research/people/jinshu020-cloud-authoring-20261123/independent-editorial-decisions.json` |

All proposal `before` texts matched the pinned source (0 stale). Shared dossier units were read once per unit with paired `literal`/`idiomatic` context in `editorial-review-dossier.json`.

## Scope completed

- **97 / 97** proposals adjudicated in native schema v3 format.
- **83 accept** as owner-proposed.
- **14 revise** (accept substance, independent replacement wording).
- **0 reject** (no grouped blockers for unsupported repairs).

Production `validateEditorialDecisionDocument` passed against the pinned compact extraction expanded with the current chapter packet builder.

## Grouped independent revisions (not rejections)

| Group | IDs | Witness / issue |
| --- | --- | --- |
| Succession vocabulary | r0004 | `s0094` 詔從述等議，上繼顯宗 — drop wrong Emperor Yuan; 述 = Wang Shu; omit unsupported “Emperor Cheng” gloss for 顯宗. |
| Zuo commentary names | r0005 | `s0152` 惠公仲子 — commentary has Duke Hui and Zhongzi, not “Dukes” plural or consort misread. |
| Realignment nuance | r0013 | `s0493` 必嫡宣孟 — Lady Zhao insisted on Xuan Meng, not Yuan Tong. |
| Kin terms | r0039 | `s0622` 姊 — elder sister. |
| Lexical | r0047 | `s0635` 禮義 / 傳記. |
| Argument polarity | r0053 | `s0641` 己涉二庭 — second household forced on Yan, not kept two households. |
| Name | r0054 | `s0642` 趙姬 — Zhao Ji, not “Lady Zhao”. |
| Style | r0061 | `s0649` 魏帝 — “the Wei emperor”, not “Emperor Wei”. |
| Office question | r0073 | `s0666` 得為夫人 — question of title, not ennoblement. |
| Name-taboo discourse | r0088–r0094 | `s0691`–`s0697` — 前誥, 無私諱, 詩書, 臣, 編官列署 tightening without changing meaning. |

Full per-repair reasons and excerpts are in `independent-editorial-decisions.json`.

## Not in scope / next actions

1. **Host apply** — run the production editorial applier on draft #5488 using this decision file (accept + revise `after` strings).
2. **Date audit** — hold until post-editorial candidate hash is stable (do not approve dates against the pre-repair extraction).
3. **Identity / dossier** — owner notes in `identity-author-notes.json` still pending independent pass.
4. **Combined curation / publication** — gated on date + identity + validator milestones.

No owner source, extraction, merge to staging, or registry generation was performed in this review branch.