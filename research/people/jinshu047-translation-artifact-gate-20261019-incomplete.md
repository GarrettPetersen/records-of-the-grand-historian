# Jinshu 047: translation-artifact check (incomplete chapter)

Checked 2026-10-19 against staging commit
`dc942a479eef1f50d167d892ddf6a44c96b8a186`. This is a narrow,
deterministic source check, not a date or identity approval, a full
translation-fidelity review, or a completed chapter.

The checked `data/jinshu/047.json` has Git blob ID
`7b0ad43dad9473a1bb9f36f76573a5e403eb2dc1` and SHA-256
`77557d28b176fcac176822606e68f5fa3c01eeb3fee28fe6a93be927eb97b3ae`;
its bytes match staging. The local scanner and all its local imported
project modules also match their staging blob IDs:

- `scripts/scan-translation-artifacts.mjs`: `5f0447d7eade57fd40d12dc0d56630f774110044`
- `score-translations.js`: `69fd8682de319b179db6c20405e657fe244f1191`
- `scripts/lib/chapter-files.mjs`: `765876d84c80e1ebc62b119a59a6d930094ad89d`
- `translation-guards.mjs`: `50afe514e1984cc5cacade8eefa3121603503223`

`node scripts/scan-translation-artifacts.mjs --fail data/jinshu/047.json`
exited 0 with no hits. The source has no `allowChineseCharacters: true`
exceptions. The optional `--include-literal` scan reported two stylistic
candidates: s0329, `cannot but`, and s0088, `cannot be counted`. These
heuristic hits do not themselves establish errors; they should remain
available to a future editorial reviewer rather than being silently changed.

A separate conversation also ran the scoped people validator against local
source, extraction and editorial-decision files whose bytes match staging.
It reported 149 people, 720 mentions, 1,536 claims, 15 applied repairs,
no proposed repairs, 16 editorial decisions, one claim retraction, no alias
debt, and three person records without an active-date hint. The full
validator dependency graph was not proven byte-identical to staging, so
that result is a local-code validation of matching inputs, not a reproducible
staging-code approval.

There is no tracked Jinshu 047 date-audit report at the cited staging
revision. Independent date, identity, and site/ebook verification remain
outstanding. Existing sticky work and the shared date-runner lock retain
priority; this check creates no claim or authorization to bypass them.
