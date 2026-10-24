# Nine Jinshu date-evidence holds: independent manifest check (incomplete)

Candidate `/tmp/people-date-holds-3BAVDDuT/candidate-manifest.json` has byte SHA-256 `dbd4de12de059abe7b7a088a32d3c63f3cde697ca80c7f981e8fff04d98aec56`; its provenance notes have SHA-256 `6d7d448ee3f3c371a7800fd0997dafc63b9cb24f3e7de065ce2995a807a74e67`. I loaded exact Git object bytes read-only, independently of the author's script.

For each of chapters 072, 080, 093, 109, 117, 119 and 130, the source, extraction and original audit report file hashes in the notes match both `6b3fe7a8c4f5072b9fd44e5e74140d8a1fd88b17` and master `e2a3f340d4e53aed243e989e8005007ba42d4f2b`. For chapters 101 and 128 the same three hashes match both `1da4e6a2ca9df03d780ab18762e43e5e50b787a2` and that master. The candidate report-file hashes equal these originals and its source/extraction fingerprints equal the corresponding original report fields. All evidence-document hashes match their Git blobs at `0b3364d`.

Each old report was `audited`, cited no references, and marked the following hints `supported`, each with exactly the one quoted complete unit shown. I checked the target names and hints in the original extractions and exact Chinese unit bytes independently:

| Chapter | Checked person and hint | Sole cited Chinese unit |
| --- | --- | --- |
| 072 | p002 Guo Yuan, AD 270–285 | s0002 郭璞 |
| 080 | p002 Wang Dao, AD 307–339 | s0001 王羲之 |
| 093 | p001 Fan Miqing, AD 25–51 | s0001 詳觀往誥，逖聽前聞，階緣外戚以致顯榮者，其所由來尚矣。 |
| 109 | p002 Murong Hui, AD 317 and AD 333 | s0002 慕容皝 |
| 117 | p002 Yao Chang, AD 384–393 | s0001 姚興 |
| 119 | p002 Yao Xing, AD 394–416 | s0002 姚泓 |
| 130 | p002 Qubei, AD 216 | s0001 赫連勃勃 |
| 101 | p008 Confucius, BC 551–479; p009 Guan Zhong, BC 685–645; p010 Emperor Xuan of Han, BC 74–48 | each s0001 劉元海（子和） 劉宣 |
| 128 | p002 Murong Na, AD 370–384; p003 Murong De, AD 384–405 | each s0002 慕容超 |

These citations do not name the relevant people or establish the stated dates. This independently supports the manifest's narrow reason for holding the reports; it does not prove those historical dates false, establish that the reviewer had no uncited evidence, or approve the remaining audit contents. Jinshu 101's staged report was subsequently changed; the manifest explicitly pins the original master report and a hold must not be made to expire merely because a report differs.

Separate implementation review found direct publication and queue-reservation paths that can bypass the proposed fence, as well as a hold-removal ordering that can revive the old audited report. This research note does not approve installation, resolution, or publication of the hold mechanism. No claims, locks, canonical files, or shared Git state were changed.
