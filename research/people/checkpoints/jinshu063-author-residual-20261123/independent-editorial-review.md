# Jinshu 063 independent editorial review

Independent reviewer for staging candidate PR #5487 at `d8ad75ef1b702fdf3a76bb848b3b0f2c9498577c`, distinct from owner work #5410 (agent `bc-64160cca-fb61-4c6e-ba29-27cd0fc0ada1`).

This records editorial decisions on **66 proposed translation repairs only**. It does **not** approve chronology, identity, publication, or application of owner extraction deltas.

## Verification method

- Read all 342 Chinese units and both English fields from the pinned source packet.
- Confirmed each repair `before` text matches the current literal or idiomatic (`en`) field on the exact chapter fingerprint.
- Judged each proposed `after` text against the linked Chinese excerpt; grouped themes below.

## Repair decisions

| Group | Units | Repairs | Decision |
| --- | --- | ---: | --- |
| 文鴦 → Wenyang transliteration | s0017–s0212 (seven units) | 32 | accept all |
| 河內 Henan → Henei | s0089, s0272, s0278 | 6 | accept all |
| s0091 Tuge / invitation subject | s0091 | 2 | accept (Li Ju invites Zhang Zhao; 屠各 supply context only) |
| Guo Song agency / s0133 | s0133 | 2 | accept all |
| Panzhi placename | s0136 | 1 | accept |
| s0150 其必留之 | s0150 | 2 | accept all |
| s0172 quotation | s0172 | 2 | accept all |
| Horse collapse s0192 | s0192 | 1 | accept |
| s0203 歸罪 | s0203 | 1 | accept |
| Dong Commandery / 揚威 / Shiliang / 無他 | s0223, s0227, s0229, s0247 | 5 | accept all |
| Appointment vs enfeoff; Gan Zhuo | s0263, s0264 | 2 | accept all |
| Yin Qiao / Han Chao names | s0289, s0299 | 4 | accept all |
| Wang Dao titles / amnesty | s0321 | 2 | accept all |
| Historian epithets 玄明 / 世龍 | s0331, s0337 | 3 | accept all |

**Blockers on translation repairs:** none.

Native artifact: `independent-editorial-decisions.json` (schema v3) passes `validateEditorialDecisions` against the pinned compact extraction.

## Pending actions (not approved here)

1. **Extraction deltas** in `source-review-findings.json` — name/pinyin surfaces, p116/p118 kinship, office English, Yin/Han surfaces, disposition person-id fixes — await host application pass with repairs.
2. **Chronology** — `date-packet.json` research holds stand; no date approval on this candidate fingerprint.
3. **Identity** — 文鴦 triple p011/p100/p110 membership question; lookup was unavailable to the owner and was not used here except for Wenyang transliteration clarity.
4. **Coverage** — 304 units had no proposed repair; this is not a full-chapter editorial seal.

## Prior proof retained unchanged

Owner checkpoint files are not modified: `residual-independent-review.json`, `source-review-findings.json`, `date-packet.json`, `README.md`.
