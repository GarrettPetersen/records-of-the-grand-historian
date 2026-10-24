# Jinshu 022 held ritual claims: source-backed proposals (incomplete)

This is a proposed repair, not independent approval, a date audit, or a
publication candidate. Claim numbers are one-based indexes in the pinned input.
Do not remove array rows in forward order: doing so shifts later indexes. A
reviewer must verify the exact before rows, source, and dependent coverage before
any application. No original file has been modified.

Inputs (SHA-256): `data/jinshu/022.json`
`813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`;
`selected-receptions-candidate-incomplete.json`
`2319764510c4848a8d07355273497f3844fd003c687433b5cf1367eb1b7ba7ac`.
The latter's recorded semantic extraction fingerprint is
`sha256:b0e21007e32696396666368d0a982359d928f227889c2d50969c470244f04dc9`.

## Proposed exact replacement: claim 112

Unit s0023 says Emperor Ming acceded; s0024 says he sacrificed to Guangwu in
the Bright Hall, making Guangwu the counterpart of 上帝. Ming is the actor, not
the dead recipient. Existing claim 111 uses `kind: ritual` for his preceding
action. Change only the kind, and remove the invalid receptionType; leave its
historical bound for an independent date audit, and retain Guangwu's separate
retrospective claim 122. Before:

```json
["p019","event-participation",{"kind":"posthumous-commemoration","role":"officiant","action":"sacrificed to Guangwu in the Bright Hall, pairing him with High God","otherPersonId":"p020","place":{"en":"Bright Hall","zh":"明堂"},"dateContext":{"sourceDate":{"text":"明皇帝即位"},"westernBounds":{"onOrAfter":{"era":"AD","year":57,"precision":"year"}}},"receptionType":"posthumous"},"explicit-event-contextual-date",["s0024"]]
```

After:

```json
["p019","event-participation",{"kind":"ritual","role":"officiant","action":"sacrificed to Guangwu in the Bright Hall, pairing him with High God","otherPersonId":"p020","place":{"en":"Bright Hall","zh":"明堂"},"dateContext":{"sourceDate":{"text":"明皇帝即位"},"westernBounds":{"onOrAfter":{"era":"AD","year":57,"precision":"year"}}}},"explicit-event-contextual-date",["s0024"]]
```

## Proposed removals: claims 121, 305, 306, 332, and 346

The proposed after state for each is **no row**. These rows turn descriptions
or hymn headings into honors or titles held or received; source wording does
not establish those titles. Companion event claims retain the underlying
reception evidence, subject to the individual caveats below. Verify coverage
after deletion; do not remove an actual source title or the named persons.

- 121 before: `["p020","honor",{"title":{"en":"counterpart to the Supreme Lord in the Bright Hall","zh":"配上帝"},"action":"received","receptionType":"posthumous","dateContext":{"sourceDate":{"text":"明皇帝即位"},"westernBounds":{"onOrAfter":{"era":"AD","year":57,"precision":"year"}}}},"explicit-event-contextual-date",["s0024"]]`. The verb 配 describes the ritual pairing, which 122 already represents. The bound and actor link on 122 remain unaudited.
- 305 before: `["p047","honor",{"title":{"en":"paired counterpart of Heaven","zh":"克配彼天"},"action":"honored","receptionType":"posthumous","dateContext":{"sourceDate":{"text":"泰始二年"},"westernYear":{"era":"AD","year":266,"precision":"year"}}},"explicit",["s0136"]]`.
- 306 before: `["p048","honor",{"title":{"en":"paired counterpart of Heaven","zh":"克配彼天"},"action":"honored","receptionType":"posthumous","dateContext":{"sourceDate":{"text":"泰始二年"},"westernYear":{"era":"AD","year":266,"precision":"year"}}},"explicit",["s0136"]]`. The hymn in s0136 says 宣文惟後，克配彼天, praising Xuan and Wen as capable of matching Heaven. Claims 307–308 separately retain the hymn references, but the exact 266 date on those rows is **not approved**: s0110 dates an edict and commission, not necessarily the exact writing or performance of this hymn.
- 332 before: `["p050","honor",{"title":{"en":"counterpart paired with High God","zh":"配上帝"},"action":"held","receptionType":"posthumous","place":{"en":"Bright Hall","zh":"明堂"}},"explicit",["s0204","s0206"]]`. The Bright Hall lyric says 烈考 光配上帝 and 聖考是配, not that the descriptive pairing was a formally held title. Claim 334 retains the reference; whether both descriptions identify the same person remains a separate identity hold.
- 346 before: `["p053","honor",{"label":{"en":"shrine hymn dedicatee","zh":"祠征西將軍登歌"},"action":"received","receptionType":"posthumous"},"explicit",["s0221"]]`. This is the heading of a hymn for sacrifice to the General Who Conquers the West, not an honor formally received under the label “shrine hymn dedicatee.” The actual office claim 345 is separate. See claim 348 below.

## Proposed replacements: claims 307 and 308

The entity paired in the text is Heaven, not the other ruler. `otherPersonId`
therefore implies an unsupported pairwise relationship; remove it. Describe the
act as praise in the hymn, rather than assert a performed ritual. Preserve the
existing date context **unchanged and explicitly unresolved**, not as an
approval of its precision. The eventual repair must resolve the chronological
evidence separately; changing the fingerprint requires a fresh audit.

307 before:
```json
["p047","event-participation",{"kind":"posthumous-commemoration","role":"honoree","action":"paired-with-Heaven","otherPersonId":"p048","dateContext":{"sourceDate":{"text":"泰始二年"},"westernYear":{"era":"AD","year":266,"precision":"year"}}},"explicit",["s0136"]]
```
307 after:
```json
["p047","event-participation",{"kind":"retrospective-reference","role":"honoree","action":"praised in the hymn as fit to be paired with Heaven","dateContext":{"sourceDate":{"text":"泰始二年"},"westernYear":{"era":"AD","year":266,"precision":"year"}}},"explicit",["s0136"]]
```
308 before:
```json
["p048","event-participation",{"kind":"posthumous-commemoration","role":"honoree","action":"paired-with-Heaven","otherPersonId":"p047","dateContext":{"sourceDate":{"text":"泰始二年"},"westernYear":{"era":"AD","year":266,"precision":"year"}}},"explicit",["s0136"]]
```
308 after:
```json
["p048","event-participation",{"kind":"retrospective-reference","role":"honoree","action":"praised in the hymn as fit to be paired with Heaven","dateContext":{"sourceDate":{"text":"泰始二年"},"westernYear":{"era":"AD","year":266,"precision":"year"}}},"explicit",["s0136"]]
```

The additional 928–929 claims repeat the commission-date and paired-person
issues and remain on hold; correcting 307–308 alone does not resolve them.

## Proposed companion wording: claim 348

The heading s0221 names the dedicatee; the later lyric's 皇祖 in s0224 may
refer to the dedicatee but its precise identity remains to be checked. A hymn
heading alone does not prove the timing or historical act of receipt. Proposed
change preserves all cited source IDs, and says only what the heading shows:

Before: `["p053","event-participation",{"kind":"retrospective-reference","role":"honoree","action":"received-shrine-hymn"},"explicit",["s0221","s0222","s0223","s0224","s0225"]]`.

After: `["p053","event-participation",{"kind":"retrospective-reference","role":"honoree","action":"named in the heading of a shrine hymn"},"explicit",["s0221","s0222","s0223","s0224","s0225"]]`.

Claim 347 also equates the dedicatee with 皇祖 and keeps an undated flag; it
remains on hold for identity and date-context review. This proposal does not
approve family summaries 349–350 or claim 345's identity attribution.

## Holds: claims 338 and 342

The spirit-procession heading s0214, plural forefathers at s0213, and the
parallel 赫赫太上，巍巍聖祖 (s0219) do not by themselves establish that 太上
is a specific human individual p051, rather than a divine or collective
invocation. Do not convert claim 338 mechanically or assert identity; review
the full hymn and neighboring context, aliases, and candidate accounting.

The next line 明明烈考，丕承繼序 (s0220) invokes an illustrious deceased
father and succession, supporting the narrow retrospective classification on
342, but does not uniquely identify him, nor establish he is p050 from the
different Bright Hall hymn. Preserve the unresolved person linkage. Neither
this hold nor a source-relative chronological expression is permission to
invent a Western date or silently call a genuinely dated event undated.

## Gate

This targeted analysis is not a whole-chapter review. Independent review of
the before/after rows and source, a strict integrated chapter validator, the
remaining reception repairs and chronology review, and a fresh independent
date audit on final fingerprints are mandatory. Editing removes or shifts claim
indexes and invalidates prior sealed date packets; reseal normally rather than
transferring old approvals.
