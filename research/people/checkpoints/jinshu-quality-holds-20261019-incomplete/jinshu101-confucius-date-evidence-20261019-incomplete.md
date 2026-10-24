# Jinshu 101 Confucius chronology evidence — incomplete research

This is a focused independent source investigation, not a repaired extraction,
complete date audit, identity decision, or approval. Research accessed 2026-10-19
UTC. It does not change the live report or any workflow ownership.

## Pinned inputs and target

- `data/jinshu/101.json`, byte SHA-256
  `221808c006bb5d8250863e40a79c07a056dd4f0137f273fe7e91e1c6f22d51c8`.
- `data/shiji/047.json`, byte SHA-256
  `7ce3307ddaf6b60725aec029784ed2bdf41a97fd379fbf2d065876366f3b37f1`.
- `data/people/extractions/jinshu/101.json`, byte SHA-256
  `7aae76a6377c5ed33c633a8688fd8db7b0baf9b1e0e1cf984b368d6d53e7ad99`.
- Saved date packet `data/people/generated/jinshu101-date-evidence-hold-1da4e6a/packet.json`,
  byte SHA-256 `431ea2220376c5a21e366012ba3a40c0f75db43ad73a30c3cfae0cc6c78410c5`.
  Its source-content fingerprint is
  `sha256:36504ddac4e4d3159b34f437c4790d0531c6a6df44b26dfd7a1e2b0a316e75b6`;
  its extraction fingerprint is
  `sha256:ed366dd5d21d5675b6459e5be6622c239ba93116d29f0027320af7e85bb742a0`.
- Current local date report byte SHA-256
  `ac10442e4ca41899c48e49ac372d71b3fee978471100e27a88df928c141e79d2`.
  Earlier evidence-hold reports refer to the preserved pre-hold report, which
  has different bytes; do not confuse the two.
- Packet `p008` is Confucius (孔子), with `hints-p008` `BC 551-479`.
  `claim-61` is an attestation attached to Jinshu `s0014`, with sourceDate
  `孔子曰`, interval BC 551–479, and claim fingerprint
  `sha256:4abe48932c0b5d2f32a1fd73e4e95403f058cf0577d05027940683097387ff3d`.

## Source comparison

1. Jinshu 101 `s0014` (Chinese unit SHA-256
   `e213d3fbd2a86de9386505a78ffcf6e13ad698c1371d14b8ef2fa7aadda66388`)
   attributes the comment on Guan Zhong to Confucius: `孔子曰：「微管仲，吾其被髮左衽矣。」`
   The sentence itself has no date. It occurs within the chapter's *Zaiji*
   preface, a later author's quotation of Confucius. The quotation is evidence
   for attribution, not evidence that Confucius was active in the preface's
   own later composition period or continuously throughout his life. It must
   not be assigned a composition date by assumption.
2. Shiji 47 `s0005` (Chinese unit SHA-256
   `4fe49970eecaf39c0d044a2bde396c190c26bac8fb574ca9f0b2867c5f17396f`)
   says `魯襄公二十二年而孔子生。` Its `s0587` (Chinese unit SHA-256
   `8691338c505115da62f20bde0a3b21db08537bc7d77e881b7ac70b20d691ff15`)
   says `孔子年七十三，以魯哀公十六年四月己丑卒。` These are distinct
   local historical witnesses for birth and death, not dates stated in Jinshu.
   The age is in traditional historical reckoning; do not calculate a modern
   age or birthday from it.
3. [Taichung Confucius Temple's chronology](https://www.confucius.taichung.gov.tw/837742/post)
   explicitly maps Lu Xiang 22 to 551 BC and Lu Ai 16 to 479 BC. The
   [Smithsonian National Museum of Asian Art](https://asia-archive.si.edu/learn/for-educators/teaching-china-with-the-smithsonian/interactives/timelines/timeline-of-chinese-history-art-and-culture/)
   independently gives `551–479 BCE` (exact excerpt SHA-256
   `f668e0e6d7457565c8ba39c0be7b2bff675d78a45a37a160882002d0d1b34667`).
   These corroborate the conventional life-date labels, not an exact day of
   the quotation or continuous activity. They are secondary chronology aids,
   not evidence the dates appear in Jinshu.
4. A conflicting ancient witness matters: the transmitted
   [Gongyang commentary for Lu Xiang 21](https://www.qj.hk/mobile/jingdian/book/12/1222.html)
   places `十有一月庚子，孔子生。` in the preceding regnal year (exact
   excerpt SHA-256
   `8fd1b6a9dd8a82b31cf52cfe74292f5737e23c07d1bd7c8a4fafd64232dee1c7`).
   [Wang Chuning's published analysis of the Haihunhou tomb screen](https://www.fdgwz.org.cn/Web/Show/2694)
   lists Xiang 21 as 552 BC and Xiang 22 as 551 BC and discusses textual
   versions and a more divergent archaeological reading. Its chronology
   table is useful evidence of an alternative witness; its proposed screen
   interpretation is explicitly debated, and the article itself cautions
   that more evidence is needed. It also contains an inconsistent isolated
   year reference in its prose, so do not rely on it as an error-free converter.
   No exact Western month/day is asserted here. The relation between a Chinese
   regnal year and a Western calendar year requires careful calendrical treatment.

## Assessment and remaining work

The previously identified absence of relevant citation for `hints-p008` can
now be addressed with independently checkable sources for the conventional
551–479 life dates. This **does not by itself approve** the existing active
hint or `claim-61`: the source is an undated retrospective quotation, the
birth witness is contested, and a lifespan interval is not proof of activity
at both endpoints or of uninterrupted activity. A reviewer should determine
whether to preserve a qualified life-bound as uncertainty on the quotation,
replace the active hint with a supported narrower formulation, or remove the
unsupported hint, using the normal source-backed repair process. Treat a later
quotation as reception only when there is evidence of the later event and its
date; do not create a spurious event date.

The separate evidence problems for Guan Zhong, Emperor Xuan, other claims and
all chapter units still require independent investigation. Any prospective
repair must be validated and followed by a fresh complete independent audit
against current source and extraction hashes; existing sticky jobs and saved
artifacts must remain intact. No chapter completion or publication is claimed.
