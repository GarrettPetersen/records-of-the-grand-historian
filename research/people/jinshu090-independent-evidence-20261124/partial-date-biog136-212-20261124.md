# Jinshu 090 chronology — 竇允 / 王宏 / 曹攄 (s0136–s0212)

Third tranche after Du Zhen. **118 → 186** cumulative unique claim IDs (+**68**). **50** editorials unchanged. `needs-revision`; no canonical install.

## Native counts (this tranche)

| | |
|--|--|
| Units | 77 in span (through s0212, before 潘京 s0213) |
| Item checks | **68** (100% of packet items touching span) |
| Supported | **29** |
| Research-blocked | **39** |
| Incorrect (new) | **0** |

## Undated vs projection (distinction)

- **Supported undated:** headings, career strips (少仕縣), moral anecdotes, 卒於官 / court deaths without reign years, retrospective ancestors (`claim-577`, `635`).
- **Supported explicit years:** every `永嘉二年` / `永嘉三年` line with Western AD 308/309 on the same sentence (Cao Shu campaign/death cluster).
- **Blocked projections:** `westernBounds` imported from reign labels (**泰始中/初**, **太康中**), **魏時/魏侍中/魏衛將軍**, **齊王冏輔政**, **惠帝末**, **天子為賊臣所逼** — source gives frame words only, not AD endpoints.
- **Blocked inference:** `claim-502` unresolved genealogical intermediary (祖肇).

## Consequential remaining holds (cumulative)

After this tranche, **80** cumulative **research-blocked** items (plus **claim-60** incorrect). This pass adds **39** boundary projections—the largest batch so far—concentrated on:

1. **Taishi/Taikang interval imports** on edicts and Wang Hong offices (shared s0143–s0166 text).
2. **Wei-service bounds** on kinship clauses (Wang Can, Cao Zhao lines).
3. **Eastern Jin regency frames** without years on Cao Shu’s career arc.

Prior holds (**時鄧艾至成都**, **及洛陽覆沒**, early **仕魏** intervals, **claim-60**) remain in cumulative rollup unchanged.

## Next scope

- **潘京** biography: **s0213–s0232**, next claim **`claim-515`**
- **Packet progress:** **186 / 553** items reviewed; **367** remaining

Rebuild: `node research/people/build-jinshu090-partial-date-biog136-212-20261124.mjs`