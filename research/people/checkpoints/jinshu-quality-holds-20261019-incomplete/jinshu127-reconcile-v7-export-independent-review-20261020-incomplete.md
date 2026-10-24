# Independent challenge: v7 unscanned-name export

Research-only review of exact patch `jinshu127-reconcile-isolated-20261019/reconciliation-guard-303b4e0-review-v7-export-only.patch`, SHA-256 `816b6ea25d85a09bbb5267bddca33827d8c1c7b54f29306bf7d0f40f32a0854b`, applied to a disposable script-only fixture of staging `303b4e0fe883d4d305d84987b656322a91e5c3a4`. Patched library SHA-256 `65bd23949d6c10619cbea6952b4d22019aa771466c617aac726b0c0b9676a9aa`; unmodified patched CLI SHA-256 `b69fccc24553693414d2ffaff344bb45e33e0abdbca0ef9302550439bb8f9950`. No canonical files, queue, locks or shared Git were changed.

## No-write, repeatability and replay

Independent execution of the four focused suites, including the isolated real-chapter and synthetic empty-export tests, passed **37/37**. On unmodified 127 research inputs (`source` SHA-256 `6970c4c954c237823685d6e9accee73bb3e9a49e3aec0c92664c5998ff921652`, extraction SHA-256 `cfff7a83582f27778d3088391e2c2633f63c43dbb9888850877464661fd7f6e7`), two exports to different new paths each produced identical SHA-256 `3f1bd4db70ffc765b6d88347cb7039ffa68c8600ced06306dc19697264c5d004`, matching the retained 13-item packet. Source and extraction bytes remained unchanged. Tests also checked the empty path, conflicting flags and an existing output without writes to the fixture data tree. This is evidence for the tested paths, not a proof against every possible I/O error or concurrent filesystem race.

Replaying the 13-item packet as `--unscanned-review` rejected with `Unscanned review replay disabled: no trusted dispatch verifier is configured`. The export hashes bind content, not independent reviewer identity, and replay remains intentionally unimplemented.

## Coverage and self-test blocker

The original reported omission is addressed: the retained packet includes s0192 `Xiong` / p109 and other English aliases from existing name claims. Enumeration remains bounded to exact existing preferred or claimed English names in units where the record has a claim or mention. It is not an audit of unrecorded aliases, Chinese mentions, other units, identity correctness or overlapping coverage by a different person's mention. The 13 questions are not approvals or a chapter-completeness measure. Person dossiers and surrounding source still need independently sealed context.

The original broader `apply-people-translation-repairs.mjs --self-test` independently failed with `Unscanned name surface requires source review: 2 occurrence(s)`. These arise from existing synthetic title-claim occurrences `Prince of Anping` in s0017 and s0024. The exception is a legitimate safety check, not grounds to pretend a reviewer approved either occurrence.

As a temporary **fixture-only** experiment I first asserted that exact two-item exception on the original fixture, then ran the other fragment checks on a separate cloned fixture with the synthetic title claim removed. This made the self-test pass, but it changed the expected unresolved scanner candidate count from six to five. Consequently it is *not* a full adaptation: the second fixture no longer covers the original title-claim/candidate interaction. Do not deploy that shortcut or silently drop the missing regression.

A stronger adaptation would expose a pure, non-mutating reconciliation analysis containing **both** the unscanned review questions and unresolved scanner-candidate diagnostics for the original fixture. Tests can assert the two questions, all six expected candidates and the absence of inferred links. The host CLI must still stop before any mutation whenever questions remain, and the analysis API must not authorize replay or weaken the independent review, validation or publication gates. Alternatively separate equivalent fixtures that demonstrably preserve every existing assertion. Rerun the original full self-test and independent review before any production adoption.

No authenticated review dispatch, accepted decisions, chapter completion, date/identity approval or publication has been established by this review.
