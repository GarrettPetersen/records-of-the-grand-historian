# Independent review: Jinshu 053 claim-110 upper bound

**Narrow source-supported proposal, not a recorded date approval, production
repair, or approval of the chapter.** I did not author the proposal; I reviewed
it with knowledge of the accompanying research, so this is not blind review.
This assessment addresses the single intended date replacement only.

## Inputs and exact change

Byte SHA-256s: proposal
`faabd19a220afd1777f0040da35642ea965701c57ca5cf9135768bf37cb50de1`;
accompanying source review
`0c73c37c00faaa965c9aa08fbcef49189765b894ad7b094020729a62373f7f39`;
local Jinshu 053 source
`85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407`;
local Jinshu 003 source
`d163d68fb29b4a8f38ec63e70fcda6bf3f3168ccfed0b4d905f561a20e365150`.
The proposal is pinned to source semantic fingerprint
`sha256:fab0a59c5d375ac889d03e7530b083fed82c11b4521823e1330e8840637b84f1`
and extraction semantic fingerprint
`sha256:a23f128f1371dc93275fa0f54af14e3d5952530b3e0e57975ccded564208c3b9`;
these are not interchangeable with the byte hashes above.

I compared the proposal's complete `before` row with `claims[109]` from Git
tree `f6e1588ed0a2b426c19e6902a208d59f7f87dce4`: they are exactly equal.
There is one `replace` change targeting `claim-110`; its `after` retains
subject p001, `age: 5`, `reckoning: sui`, the exact source-date text, `explicit`
certainty and s0007 evidence. It removes the `westernInterval` AD 266–290 and
adds only `westernBounds.onOrBefore` AD 290 with year precision. The
`westernBounds` representation and one-sided `onOrBefore` key are accepted by
the documented temporal-value implementation. I did not rerun the author's
full staging-pinned validator, so its prior reported pass remains separate
evidence, not an independently reproduced test.

## Source and conversion

- Jinshu 053 s0002 identifies 遹 (Yu), the subject of the biography, with
  local p001. In s0003–s0009, 武帝 is the emperor who dotes on him; s0006
  explicitly says Emperor Wu climbed a tower to watch a nighttime palace fire,
  and s0007 says the prince was five and pulled the emperor into darkness.
  Thus the age claim belongs to Yu and the reported event has to occur while
  that Emperor Wu is alive, if this narrated episode is treated as occurring.
  The posthumous title `太子` in the narrative does not establish he already
  held that office when he was five.
- Local Jinshu 003 s0635 places the next entries in the fourth lunar month;
  s0636 says the emperor died on the 己酉 day. [Jinshu 004](https://zh.wikisource.org/zh-hans/%E6%99%89%E6%9B%B8/%E5%8D%B7004)
  explicitly identifies that death as 武帝's in 太熙元年四月己酉. The
  independent [University of Mississippi era table](https://home.olemiss.edu/~gg/lidaijiy.htm)
  maps 太熙 1 to 290; the [Chinese Text Project person chronology](https://ctext.org/datawiki.pl?if=en&res=637909)
  also associates the cited death with 290. This supports an **inclusive
  latest Western year** 290 for the narrated event. The fourth lunar month is
  not near a lunar-new-year crossover into the following Western year; the
  proposed year-only bound does not rely on an exact day-of-month conversion.
  Do not use it to assert a 290 fire, infer a lower bound or birth year, or
  claim ongoing activity throughout any interval.
- `時年五歲` expressly gives five in this account. The inherited `sui`
  reckoning is consistent with conventional Chinese age reckoning but is not
  separately spelled out by these characters, and the cited [Taiping Yulan 148
  quotation of Wang Yin's Jinshu](https://ctext.org/taiping-yulan/148) says
  six or seven for a corresponding fire anecdote. Preserve the five-year-old
  attribution as this chapter's report and the alternate witness as an open
  historical discrepancy; neither grants an exact Western year. This narrow
  date-only proposal neither resolves nor conceals that difference.

## Assessment and remaining gates

I support the proposed removal of the unsupported AD 266 lower endpoint and
the conservative `onOrBefore AD 290` replacement for this claim, on the stated
source-based conditional reasoning. This is not evidence that the entire
original interval or any other date is correct or incorrect, nor permission to
rewrite sealed audit fingerprints. The proposal's citation and explanation
should remain associated with the claim through the supported repair workflow.
The retained age-reckoning and alternate-age question, every other item in the
research-blocked date report, final source/editorial work, reviewer
independence, identity and publication checks remain open. Any source or
extraction change needs a freshly sealed packet and an independent complete
date audit; this review is not that audit. I changed no canonical source,
extraction, audit, queue claim, lock, lease, Git index, build, or worktree.
