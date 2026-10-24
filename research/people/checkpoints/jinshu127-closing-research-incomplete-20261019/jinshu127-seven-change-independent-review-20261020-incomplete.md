# Jinshu 127: independent review of retained seven-change date draft

Reviewer `/root/jin127_seven_review`, separate from proposal author `/root/recovery_review`. This is a focused source review, not a whole-chapter date audit, production approval, or instruction to publish. The prior goal turn changed staging by checkpointing independently reviewed research; it did not establish a completed chapter.

## Exact inputs and scope

I checked byte hashes of `jinshu127-s0232-materialized-source-67faa205.json` (`984b1214a02bf06ba26c25db258a46652f0d17d11cbf56c4d96c01a3a8542d39`), `jinshu127-s0232-materialized-extraction-67faa205.json` (`947b1fd8e41f859f26ef6959fc7580065f42ad3050dc9de645173ed0a1427e1b`), `jinshu127-expanded-date-work-tRX7ee/proposal.json` (`af3a68ae67733d4c451acf73558d89e80933ba5cd5ce1509526fb96551e138ba`), and its `candidate-extraction.json` (`59ed9d7f0738108fb1e587c861382a583ba8bf2e44dc63fc853e06777cd31301`). I inspected the exact rows in the original and candidate, rather than treating another review's conclusion as approval. The source s0232 reads `武王封比干之墓，漢祖祭信陵之墳，皆留心賢哲，每懷往事`; the [Jin shu 127 witness](https://zh.wikisource.org/wiki/晉書/卷127) has the same wording. It describes actions at tombs as Sui's examples of rulers honoring earlier worthies; it gives no absolute year.

## Seven proposed changes

1. **Source-supported for this unit:** replace original p139 `claim-334`'s supposed `BC 1046` attestation with undated King Wu tomb action. The source reports the action, not its year; the changed wording follows the separately materialized translation. It does not prove 1046 false, or prove Wu personally moved earth.
2. **Source-supported:** remove original p140 `claim-335` as a living 1046 attestation. An action at Bi Gan's existing tomb is not an attestation of his living activity.
3. **Source-supported:** add p140's retrospective honoree event. Sui recounts Wu's tomb action as attention to a worthy; it is not a dated lifetime event. `kind: retrospective-reference` is a descriptive event kind; the approved reception category is `retrospective`, not `posthumous` (see `scripts/lib/people-reception.mjs`).
4. **Source-supported as conservative removal, not a historical disproof:** delete p139's `BC 1046` activity hint when this source alone is offered as its evidence. Retain the original artifact and research a provenance-backed date independently if desired.
5. **Source-supported as conservative removal, not a historical disproof:** delete p140's `BC 1100` activity hint when no source for that exact year is identified. Do not describe the deletion as a finding that the year is impossible; retain historical bytes.
6. **Source-supported:** remove original p142 `claim-337` as a living activity attestation in `BC 206–195`. The cited act is at Xinling's grave. [Shiji 77](https://zh.wikisource.org/wiki/史記/卷077) reports his death before Gaozu's later offerings.
7. **Source-supported:** add the source-specific p142 retrospective honoree event. The source says Gaozu sacrificed at Xinling's grave, recalled in Sui's speech; it gives no absolute year. This preserves the reference without treating the later ceremony as Xinling's living activity.

These findings concern the source-local seven edits only. They are not an endorsement of the candidate as a whole: the unchanged p142 hint and p141 chronology below remain unresolved, and complete independent date review is still required.

## p142 activity hint: stronger contrary evidence for the starting endpoint

The exact candidate leaves `BC 275-243` unchanged. Jinshu s0232 states neither endpoint. [Zizhi Tongjian 4](https://zh.wikisource.org/wiki/資治通鑑/卷004), under King Nan year 39, conventionally `276 BC`, states `魏安釐王封其弟無忌為信陵君`. This is an independently cited narrative attestation of his investiture **before 275 BC**. It undermines treating 275 as the first year of his documented activity; the text does not establish his birth year, or prove that his entire career continuously spanned a proposed range. A search-result excerpt that appears to associate this passage with 277 omits the intervening year heading; the full text explicitly places it under year 39 (276), not year 38 (277). Check chronology conventions and primary witnesses as part of the eventual audit, rather than silently converting this into a replacement birth year or fabricated source-local claim.

[Shiji 44](https://zh.wikisource.org/wiki/史記/卷044) places both Xinling's death and King Anli's death in Anli year 34; [Shiji 77](https://zh.wikisource.org/wiki/史記/卷077) likewise reports the two deaths in the same year. The [Kotobank encyclopedia entry](https://kotobank.jp/word/%E4%BF%A1%E9%99%B5%E5%90%9B-82740) conventionally converts this to 243 BC. This supports investigating a sourced death year, but does not supply a Jinshu source date or independently approve a proposed activity range. **Hold the existing p142 range and this candidate** until a reviewer can represent the evidence and bounds honestly.

## p141 claim-336 and compact-ID hazard

Original `claim-336` is p141 Gaozu's s0232 attestation with the noncontiguous alleged source-date text `漢祖信陵` and interval `BC 206–195`. The unit supplies no explicit year. [Shiji 77](https://zh.wikisource.org/wiki/史記/卷077) says Gaozu regularly sacrificed when passing Daliang after taking the imperial title, then separately describes his twelfth-year establishment of five grave-guard households. It does not authorize attributing that twelfth-year date to each sacrifice or fabricating an exact date for the Jinshu allusion. A separately reviewed undated source-attestation is a conservative possible replacement, but no such change is in this seven-change proposal; externally supported bounds and the separate p141 activity hint need their own provenance review.

Compact claim identifiers are positional. In the exact candidate, original p141 `claim-336` has shifted to **`claim-335`** after removing the Bi Gan row. The two new retrospective events are `claim-385` and `claim-386`; the removed original p142 `claim-337` is not the candidate's `claim-337`. Rebuild the exact packet and reconcile all citations and decisions by row content and fingerprint before submitting any later repair; never blindly apply an old positional ID.

No canonical source, extraction, queue, lock, shared Git index, build, or model lane was changed. This note has not rerun the full production validators or checked every person and claim; retain all prior reports and conduct the fresh independent whole-chapter audit after final source and extraction are sealed.
