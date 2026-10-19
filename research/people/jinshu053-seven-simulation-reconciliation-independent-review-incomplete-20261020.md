# Jinshu 053 seven-decision simulation: independent reconciliation review

Status: **incomplete research, not approval or canonical application**. I did
not author the seven decisions or simulation. I inspected simulation
`jinshu053-seven-reviewed-simulation-20261019-incomplete` with source SHA-256
`8c97585a324c7e8ee539083672dad7911638e7d6386418f814287d2c9e31496f`,
extraction `2eac6cd56f93ccf4590b1ae756881971daa5c9808e372ca7172e4914af825788`,
diagnostics `7801dd8415d85f326eff1e6b8bfe91f8627000db8d201a04f258b5ccbe0b7f55`,
and decision document `c009fe89a8d501132b56a96895e8ad1d2e4979627eb9de2b520f4b5b23a48175`.
Its source-bound packet fingerprint is
`sha256:71e709696d5177a7f3b50405533d029273822796ece00eb442b6b81bab2c7655`.
It currently fails strict validation for two unaccounted s0065 candidates.
The independent translation decisions do not approve automatic entity links.

## s0065 reviewed candidate outcomes

The source `澹以兵仗送太子妃王氏、三皇孫于金墉城，考竟謝淑妃及太子保林蔣俊`
distinguishes the crown princess, Consort Xie and Jiang Jun. The [Jinshu 053
transcription](https://zh.wikisource.org/wiki/晉書/卷053) corroborates it.
In this exact simulated packet:

* `cand_b4afb9a624b24196`, `Jinyong City`: **not-person, place**. 金墉城
  is the destination. It must not link to a person.
* `cand_d3fded850e8a7d0e`, `Consort Shufei Xie`: **person p003,
  title-reference**. Chinese 謝淑妃 is already linked to p003 in m0256;
  the same sentence distinguishes her from Jiang Jun p027. This review does
  not decide any disputed wider parentage or the best English rank rendering.
* `cand_57344e707a7ad43a`, `Crown Princess Wang`: **person p038,
  title-reference**, not p037. s0035 identifies Wang Yan's younger daughter
  Huifeng as the crown princess, and s0065's 太子妃王氏 is linked to p038.
  Existing c0148 is the exact title claim. The simulation instead assigns
  this English span to p037 (Wang Yan, her father) via m0255. This is
  wrong even though its candidate is automatically accounted. Remove the
  wrong p037 surface and link it to p038; recompute exact spans and validate.
* `cand_11bb7c130a38d3ce`, `Jiang Jun`: p027, personal-name; the unchanged
  Chinese 太子保林蔣俊 and c0105 support the referent. Its remapped
  occurrence and offsets must be validated on the actual final English text.
  Correction of the erroneous title claim c0106 remains a separate reviewed
  claim change.

## Other automatically changed dispositions

The simulation re-runs reconciliation over the *entire* chapter. It changes 25
dispositions and renumbers mentions after removals; compare semantic person,
unit, kind, geometry, and candidate references, **not mention IDs alone**.
Some key regressions outside s0065:

* `cand_e52f72d263aa7470` (s0047 `Crown Prince`) becomes `not-person/place`,
  although Chinese 太子 and the retained English span both refer to p001.
  Restore the source-reviewed p001 `title-reference` and its candidate ref.
* `cand_200b2d13ba5a3bd6` and `cand_6b8390c3b5e7e7f5` (s0063 successive
  `Prince` fragments) become `not-person/title`, despite covering separately
  linked `Prince of Liang` p051 and `Prince of Huainan` p052. Restore their
  candidate refs to those local title mentions after exact-span validation.
* `cand_64a2c5fedcc5df96` (s0172 `Prince`) similarly becomes a non-person
  title, although it is within the p028 `Prince of Nanyang` mention; reattach
  it to that mention. This does not resolve the prior s0171 Chinese lacuna.
* `cand_21ec1530f0b812ef` (`Jinyong`, s0183) vanishes from the revised
  preflight packet as well as its disposition, so the lost old disposition is
  not, by itself, an unaccounted revised candidate. The source/unit is not one
  of the seven edits; scanner-wide candidate changes require care. Verify the
  actual fresh packet and don't recreate an obsolete candidate ID.

The remaining automatic Jia/title changes have **not** been exhaustively
re-reviewed here. Reapply the previously source-reviewed V2 semantic outcomes
where their source, language, span and meaning remain unchanged; independently
review any changed context, candidate, or geometry. Do not carry decisions
forward by ID alone. The two missing candidates are not the whole problem.

## Production-script implications and selective safe path

`scripts/apply-people-translation-repairs.mjs` builds a preliminary dossier only
for `reconciled.unresolvedCandidates`; auto-accounted wrong links and wrong
dispositions above are outside that dossier. Its
`assignExplicitCandidatePeople` helper accepts an unresolved or disposed
candidate and can replace an exactly conflicting mention, but rejects an
already-mentioned candidate such as the wrong `Crown Princess Wang` link.
`--candidate-person` therefore cannot simply override that current auto-link.
The host must use a reviewed targeted correction in an isolated candidate or
fix the helper with tests; do not falsely manufacture an unresolved state or
assume passing validation detects semantic identity mistakes. The
`--prepare-candidate-review` path writes its output dossier, and an actual
apply writes chapter, extraction and packet sequentially; `--extraction` alone
does not isolate chapter writes. Do not run the apply against a shared canonical
checkout without host ownership and an appropriate transaction/fencing plan.

For a safe selective simulation: rebuild the revised packet from the exact
seven-decision source, start with the retained V2 **reviewed** semantic
decisions, preserve unchanged sentence-local dispositions/mentions where their
new spans still match, reconcile the changed units and detector differences,
then explicitly handle the four s0065 cases and other reviewed title/callback
regressions. Independently inspect a semantic delta across *all* units and
ensure no hidden auto-disposition replaces a reviewed person link. Validate
strict extraction plus applied editorial history against the exact pinned
versions and current production validators; run fresh independent downstream
date/identity gates after source/extraction changes. This is a recommended
method, not a claim that a supported atomic production applier already exists.
No result in this note demonstrates chapter completion or release readiness.
