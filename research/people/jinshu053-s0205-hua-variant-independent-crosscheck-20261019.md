# Independent cross-check: Jinshu 053 s0205 Hua variant

Research only; not an approval or instruction to change source, extraction,
queue, or identities. I independently inspected the source and extraction in
staging `22427ca7ce2a94cce7408d8e5fb9c5d6045e4edd`; the three files' hashes
match those pinned in `jinshu053-s0205-hua-variant-research-20261019.md`.
Digital witnesses were consulted on 2026-10-19; their relationships to one
another and to printed editions were not established.

## Chapter 053 witnesses and attribution

- Pinned s0205 reads `尚書令華暠息恆與太子游處`. Both English fields call the
  father Hua Gao and the son Heng. The grammar lists a minister's son among
  companions, rather than naming the father as the companion.
- [Wikisource 053](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7053)
  has the same `華暠息恆` sequence. This is agreement between transcriptions;
  it is not evidence that their copying histories are independent.
- [Shidianguji, Siku-labelled 053](https://www.shidianguji.com/zh/book/SK0712/chapter/1kfjj3kgstp2r)
  reads `尚書令華廙息恒，與太子游處`. The named text is labelled 欽定四庫全書
  by the website; I inspected its transcription, not an edition image.
- [Shidianguji's other 053](https://www.shidianguji.com/book/HY2499/chapter/1mb9kswm55zjf)
  reads `尚书令华廙息，恒与太子游处`. Its comma after 息 is problematic for
  the parallel list and must not be treated as dispositive. The platform may
  share source material between these texts; do not count them as independent
  manuscripts. 恒 and 恆 represent the same name here.
- The cited `晉書斠注` [CTP page](https://ctext.org/wiki.pl?chapter=783247&if=en)
  returned an internal error in my independent check. I cannot independently
  verify its transcription or annotations; the original research note's claim
  about that page therefore remains unconfirmed by this reviewer.

## Internal chapter 044 comparison and a further variant

Pinned 044 s0425 attributes 尚書令 to the subject of the 廙 biography;
s0431 says his sons were 混、薈、恆; s0272 identifies 恆 as 廙's son; s0275
says Heng became a crown-prince companion early in Yuankang. This convergence
strongly supports identifying the father-son pair described in 053 with Hua Yi
and Hua Heng, without establishing which character every edition of 053 prints.
The [Wikisource 044 transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7044)
supports the same contextual reading.

An important qualification not explicit in the initial research note: the
pinned 044 biography itself uses **暠** at s0252 (`暠固辭`), s0254
(`送三奴與暠`), and s0256 (`免暠官`) amid numerous references to 廙; its
Wikisource transcription does likewise. A [Wikisource transcription labelled
Siku 044](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8_%28%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC%29/%E5%8D%B7044)
has 廙 in all three corresponding places. I did not inspect the underlying
printed page or apparatus. These repeated forms extend the textual question to
044 and may reflect a shared textual or digitization history; neither that
history nor an actual personal alias is established. Chapter 044 therefore
provides strong contextual identification evidence, but is not a uniformly
consistent-character witness. Do not silently normalize 044 or use its 暠
forms to establish an unqualified alias.

## Extraction and disposition

The compact 053 extraction records p024 as Hua Gao / 華暠, with an explicit
Chinese surface 華暠 and English surface Hua Gao at s0205; p025 is Hua Heng /
華恆, with Chinese surface 恆, English surface Heng, and the description “Son
of Hua Gao; companion to crown prince.” The explicit child-of claim points from
p025 to p024. Both have event-contextual AD 291 attestations. Thus the existing
extraction follows the pinned reading, while a reviewed source decision would
affect the Chinese and English surfaces, names, description, relational context,
and possibly cross-chapter identity decisions. The staged tree has no
`data/people/extractions/jinshu/044.json`; do not assume an already reviewed 044
person record from this observation.

I agree with the original note's hold and its caution against auto-merge or
unqualified aliasing. Obtain a named edition scan/apparatus and independent
textual/source review; assess 053 and 044 together. Preserve the old witness and
decision history, then use a supported reviewed source-amendment workflow and
fresh extraction, identity, editorial and date gates as appropriate. This
focused research does not establish whole-chapter completion.
