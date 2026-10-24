# Independent review: Jinshu 053 source omission and retrospective date claims

Status: independent source-local research, **not** a complete editorial/date audit,
identity decision, production application, or publication approval. I did not
author either proposal and did not edit canonical source, extraction or reports.

## s0170–s0172 textual omission

I checked the baseline source `jinshu053-real-letter-p056-v1-incomplete-20261020/source.json`
(SHA-256 `26f2169267b866e9203dd05f902044aa6c7839d7b780bba10ce4a1b0066c7e78`)
and current `data/jinshu/053.json` (SHA-256
`85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407`).
Both have the same missing first name at s0170 and missing subject at s0171.
I independently inspected the following primary-text transcriptions:

* [Wikisource Jinshu 053](https://zh.wikisource.org/wiki/晉書/卷053), lines
  145 and 150, gives the list with 虨 and begins the next unit 虨字道文.
* [Shidianguji Jinshu 053](https://www.shidianguji.com/zh/book/HY2499/chapter/1mb9kswm56c6j),
  lines 27–29, gives the same two characters in those positions.
* [Wikisource Siku transcription](https://zh.wikisource.org/wiki/晉書_(四庫全書本)/卷053),
  line 117, independently displays the same text in an unpunctuated sequence;
  line 116 lists the three sons. Their textual ancestry is not established.
* [Kaoyi page 103](https://zh.wikisource.org/wiki/Page:Sibu_Congkan0179-司馬光-資治通鑑考異-6-1.djvu/103),
  lines 111–113, explicitly reports 虨 versus 霖 and prefers the former on
  the basis of the biography and courtesy name. The page states its machine
  transcription is unproofread; I did not collate the scanned original.

I support the *limited transcription correction* inserting 虨 in exactly
the two proposed positions, preserving existing punctuation. Multiple text
presentations show the omission is local to this transcription; they do not
prove independent manuscript witnesses or settle every textual variant.
They support rendering Bin, Zang, Shang and Bin, courtesy name Daowen in the
paired English fields, with no unsupported “eldest” inference. The later
四月追封 also requires “posthumously” in the English s0172. This is a
source-correction review of the research proposal, not a decision on the
new 98-item editorial dossier or authorization to apply source changes.

The biography explicitly makes 虨 a son of the crown prince and attributes
道文 to him. The earlier letter's 道文 is plausibly the same son, but the
cross-passage identity must remain separately reviewed. The list order alone
does not prove eldest status or maternal/half-sibling relationships. The
reported 霖 reading is a textual variant, not an independently established
alias. Rebuild spans and packet after a source change; existing source-bound
date, editorial and identity results must be checked for staleness.

## Retrospective commentary and AD 300

I independently verified the inputs and their hashes reported in
`jinshu053-retrospective-commentary-date-finding-incomplete-20261020.md`:
source `85bc5e…4407`, extraction `464b3e…e69`, existing audit
`d3bb12…073`, Shiji 040 `e5db0e…18b`, and Hanshu 073 `68ef59…8bb`.
The actual current extraction array indices 191 and 192 attach AD 300 to
`p070` and `p071` as `attestation` with `sourceDate.text` set to `史臣曰`,
and both people have `AD 300` active hints. The source `s0185` introduces
the historian's commentary and `s0192` compares the prince's wrong with
楚建 and 戾園. Neither sentence gives a date of 300 for the comparison,
or says either comparison subject was alive or active then. The cited
relative historical event cannot by itself date the later historian's prose.

I therefore agree the AD 300 claims and life hints are unsupported **by
these cited units**; I did not perform a corpus-wide search that could
establish every possible alternative source. A later-attestation category
must follow the approved vocabulary, and an undated comparison should not
be assigned an invented year. The 戾園 surface itself is a place, not an
explicit personal name; identity of the allusion needs a separate review.
No conclusion is made about the other BC hints or the completeness or
validity of the entire prior date audit. Any date repair must be performed
under the correct owner and independently re-audited on fresh fingerprints.
