# Independent evidence review: five Jinshu date holds

Scope: proposals for chapters 093, 109, 117, 119, and 130, checked against Git commit `6b3fe7a8c4f5072b9fd44e5e74140d8a1fd88b17`. This is a partial review of the cited evidence, not a complete chronology audit and not a finding that any proposed date is historically false.

| Chapter | Prior audit's sole cited passage | Proposal's person evidence | Focused conclusion |
|---|---|---|---|
| 093 | `s0001` `詳觀往誥，逖聽前聞，階緣外戚以致顯榮者，其所由來尚矣。` | `s0011` `樊靡卿` | The prior citation is general commentary, not Fan Miqing or AD 25–51. The named-person passage does not state that range. |
| 109 | `s0002` `慕容皝` | `s0003` `廆第三子也` | The prior citation names Murong Huang, not his father Murong Hui (廆), and states neither AD 317 nor AD 333. The relationship excerpt states no year. |
| 117 | `s0001` `姚興` | `s0003` `萇之長子也` | The prior citation names Yao Xing, not Yao Chang (萇), and states no AD 384–393 range. The relationship excerpt states no year. |
| 119 | `s0002` `姚泓` | `s0003` `興之長子也` | The prior citation names Yao Hong, not Yao Xing (興), and states no AD 394–416 range. The relationship excerpt states no year. |
| 130 | `s0001` `赫連勃勃` | `s0002` `匈奴右賢王去卑之後` | The prior citation names Helian Bobo, not Qubei, and states no AD 216. The ancestry excerpt states no year. |

For every chapter I independently compared all three receipt SHA-256 byte pins with `git show` at the stated revision, confirmed each copied source JSON is byte-identical, rebuilt and compared the entire saved packet from that staged extraction, and ran `validateDateAuditReport` against the rebuilt packet using the staged validator (Git blob `4b5324791cf11bccabdf3d0489962f16b1250e4b`). All five pass. I independently hashed each proposal and matched its receipt; the prior reports are staged `audited` reports with empty reference lists, and the quoted evidence is each targeted check's only evidence. The main checkout does not currently contain these report paths, so no claim is made about live working-tree report bytes or current remote state.

Proposal SHA-256: 093 `50862b9efe6f5a2c7ef1a9bbed60ecafff296d6ab0ae0d2573a131ff0b7ba4a2`; 109 `b2ca5de17078093dc6ab64a9427f767c9e7016a7f8b040ad70183ac289226caf`; 117 `ad5dd49a9fbb5e75dbf825c065a056d9776f351dc4e99f78af69a02e31d35ac8`; 119 `9265ff871d0df3059a902dd2e0c59872b9017ea1af3f4c84755a8acd570cb3f2`; 130 `f7e3e5bf3b9a6d77e721b6aceb890b2878ba845cf4ffecad6dfc5c1128c404b1`.

The proposal author `/root/near_complete_jinshu` is a separate live-team agent from this reviewer and does not match any extraction `run.agentId` or chunk `agentId` in these staged extractions. Prior audit metadata names a reviewer but supplies no agent ID; therefore this check does not independently authenticate the prior reviewer's identity or exclude unrecorded authorship. The proposal is a human/agent attestation, not cryptographic provenance. Validator acceptance verifies structural and packet-bound rules, not historical correctness or independence by itself.

Each targeted finding accurately identifies a deficiency in the cited support only. Other chapters, other uncited passages, or independently verified sources may establish some or all dates. None of the five proposals is a complete audit or an approval, and this review does not authorize recording or override active claims, leases, or the prior-report preservation process.
