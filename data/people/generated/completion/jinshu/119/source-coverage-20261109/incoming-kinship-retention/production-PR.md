English repairs can remove an unnamed relative and both family links when Chinese support occurs in an incoming kinship claim. Jinshu 119’s “恢舅苟和” supports Yao Hui’s mother, but the released applier drops her because her own inferred “母” glyph is absent.

Retain an existing no-span person when a family claim explicitly targets that person and its Chinese kinship evidence is present and unchanged. Require every owned claim’s Chinese evidence to remain unchanged. Preserve failures for missing chronology and unsupported evidence.

Validation: 32 focused assertions, including reconciliation and negative guards. The new regression fails on released master and passes with the change. The native Jinshu 119 preview restores 202/202 people, preserves all 30 reviewed family claims and both maternal links, and keeps all 121 candidate objects unchanged. Normal application still fails on Fu Jian’s unresolved chronology before writing source or extraction. Independent code review and broader applier tests are recorded in the linked recovery checkpoint.

This change grants no chapter approval. Source-backed corrections to the two mothers’ activity/service claims, Fu Jian’s chronology, supplemental English adjudication and fresh downstream gates remain open.

Independent review: [approved code-only report](https://github.com/GarrettPetersen/records-of-the-grand-historian/blob/4b7695f5cae4f34f84779383328a60492ae89224/data/people/generated/completion/jinshu/119/source-coverage-20261109/incoming-kinship-retention/independent-code-review.json). Broader released-baseline tests:17 passed plus the applier self-test;32 focused assertions passed.
