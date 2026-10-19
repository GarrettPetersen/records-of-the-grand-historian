# Jinshu 127 p142: independent activity-hint research

Reviewer: Codex agent `/root/disk_audit`. This is a focused research note, not a full-chapter approval or an instruction to change the extraction.

## Inputs and result

Revision `67faa20531f92381a2b192c72004a2ae043e1763`; Jinshu 127 packet source hash `sha256:48f235482a285d91bc99fb19f9e1ad0e602ed183d0dea305e756d084362fda2b`, extraction hash `sha256:623eb92a46490b4ba9b7bddecf5401f0354bb937f55b8e43c6402bc9d38c1eee`. Person p142 identifies Lord Xinling / 信陵君 and has an activity hint `BC 275-243`.

Jinshu s0232 says `漢祖祭信陵之墳`: Gaozu of Han sacrificed at Xinling's tomb. This is a retrospective reference to the deceased, not an event in Xinling's lifetime. The p142 `claim-337` dates the Han-ancestor reference to BC 206–195; that range must not be treated as Xinling's lifespan or active period. Nor does s0232 itself supply BC 275 or BC 243.

## Independent historical evidence

* The staged [Shiji 44](https://zh.wikisource.org/zh-hans/史記/卷044) text places the deaths of Anli and Xinling in Anli's 34th year. In the exact revision, `data/shiji/044.json` file SHA-256 is `988b4b7c6ec4c8c726e17264a7696fb80b43c888e0a99fcbf7dea0abab45f10b`. Its unit s0386 says `三十四年，安釐王卒，太子增立，是為景湣王。` (SHA-256 of UTF-8 zh value `6c33cea456f04fa35eb68f4184e43aa022520ece931cb0b3cbf286c85fff045f`); s0387 says `信陵君無忌卒。` (zh hash `fc0ea3c93f1d063b2cd5105be20c32225f693d3da7142dacd90399913490b441`).
* The staged [Shiji 77](https://zh.wikisource.org/wiki/史記/卷077) biography also reports his death and Anli's death in the same year. Exact `data/shiji/077.json` byte SHA-256 `2043e6f3f3b7c1ad5908d05ac9fccec24426e8b188de4f8785ac066fdc36ccc0`. Unit s0146 says `日夜為樂飲者四歲，竟病酒而卒。` (zh hash `4bcc032d5d3b1531d7e202119a6644f6d50d4bacf79e48f8fc872b9b40ae540c`); s0147 says `其歲，魏安釐王亦薨。` (zh hash `40c8f1cf7c948c20d6352815c7c1b22c2cad2291e964b29e21377f96a15ee7fc`). Unit s0002 records his investiture upon Anli's accession, but gives no Western year; s0040 and s0136 contain regnal-year narrative headings.
* The [Japanese encyclopedia entries collected by Kotobank](https://kotobank.jp/word/%E4%BF%A1%E9%99%B5%E5%90%9B-82740) give his birth as unknown and death as 243 BC. [R. Eno's Indiana University Shiji teaching translation](https://scholarworks.iu.edu/iuswrrest/api/core/bitstreams/51bdb8a8-620f-42ef-8a96-82fc3066efe3/content), p. 31, also states 243 BC and the same-year death. Its account of the later tomb rites appears to misattribute them to the Qin First Emperor, so do not rely on it for the Jinshu tomb actor. The conversion is a conventional historical year label, not an independently established Gregorian day or month.

I found no source establishing that BC 275 was his birth or the start of his documented activity. This is a limitation of this focused search, not proof that no supporting source exists. An activity range is not necessarily a birth–death claim; do not convert its first endpoint into a birth year. Conversely, an externally attested death year alone does not establish the exact start or a continuously attested active range.

## Disposition

Hold the existing `BC 275-243` activity hint pending defensible sourcing and independent review; do not silently replace it with another guessed range. BC 243 is defensible as an externally sourced, conventionally converted **death year**, subject to normal source-attribution and schema/identity checks; it is not supplied as such by the Jinshu tomb sentence. If the date workflow cannot represent that external evidence without pretending Jinshu s0232 supplies it, do not add it to that source-local claim. The retrospective finding remains separate from this hint issue. This note does not approve the audit, assess all other p142 chronology, or authorize changes to canonical files, claims, queues, locks, or the Git index.
