# Jinshu 053: Sima Zang's posthumous honor and active-date hint

This is a focused, unapproved finding, not a new complete date audit, a
canonical repair, or a chapter-completion claim. The inspected staging commit
was `89296b9f9da8683bcd807c78b0cf27f94d129865`. Its source, extraction and
date-report blob byte SHA-256 values are respectively
`85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407`,
`464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69`,
and `d3bb12dbc7db670357affb2e216790baffb359db62ce78478ff3d37c1ba93073`.

The local extraction's `p068` identifies Sima Zang and includes `AD 302` in
its active-date hints. Its `claim-124` (array index 123) is an ordinary
attestation assigning AD 302 to `太安初`, citing only `s0184`. `claim-251`
also records the posthumous honor at AD 302, but does not classify it as
retrospective. The date report calls `claim-124` and `hints-p068` supported;
its generic reasons expressly claim that retrospective references were
checked, without explaining this case.

The source at `s0183` says Zang was deposed and soon killed after Zhao Lun's
usurpation in the first month of Yongning 1. `s0184`, `太安初，追諡曰哀`,
states that the posthumous name Ai was granted early in Tai'an. The award is
therefore reception after his death, not a living attestation. [Jinshu 004's
annals](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7004)
place Lun's killing of the Prince of Puyang, Zang, under Yongning 1, before
the entry for the third month. This corroborates the source's sequence; it is
another chapter of the same history, not an independent contemporary witness.
Neither the Chinese phrase `太安初` itself nor the audit's generic reason
explains why the honor is assigned specifically to 302 rather than another
early Tai'an date. This finding does not prove what the historical award year
was or that no other active event can support 302.

The reviewer should check all source and reference evidence before removing
the 302 active hint or changing `claim-124`; retain the award as a separately
dated retrospective event with its Chinese wording and subject role, and
independently establish any Western conversion or preserve the unresolved
chronology. Do not leave the award as ordinary lifetime activity merely to
pass a validator. `PEOPLE_DATE_AUDIT.md` requires this distinction and uses
`retrospective` for later reception; it does not permit inventing a more exact
event date. Review the related honor `claim-251` and any presentation that
consumes the hint. The report already has status `research-blocked`; keep the
sticky ownership, prior report and all recovery artifacts intact. Any final
repair needs independent review, applicable exact-fingerprint validation and a
fresh complete date audit, as well as the still-open editorial and identity
gates. Nothing in this note authorizes publication.
