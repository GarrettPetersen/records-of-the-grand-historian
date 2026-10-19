# Songshi 084: preliminary source-coverage finding (incomplete)

Checked 2026-10-19 UTC against `origin/master` at
`287adaea3fcab4ee9928f986ba7c171cb61c2afe`. This is research evidence, not
a replacement for a source comparison, editorial review, or chapter approval.

The deployed progress data generated `2026-10-19T09:04:54.910Z` lists
Songshi 084 as current with two source units, zero people, no pending repairs,
and an audited date status. All 15 chapters in the deployed preliminary-check
count likewise report zero person records. These are preliminary status
indicators, not proof of whole-chapter completeness.

The master file `data/songshi/084.json` contains only two sentence units,
covering the opening calendrical paragraph. Its byte SHA-256 is
`0fc8a57f3e7a7adbeb76fd0e7cb40111b4ff0bb7b074de428cee8980374295bd`.
The accessible [Wikisource Songshi volume 84](https://zh.wikisource.org/wiki/宋史/卷084?action=raw)
continues after that opening into the section 步氣朔 and extensive additional
calendrical text. The raw response observed was 83,603 bytes and its byte
SHA-256 was `311795810552634d3035e666d31b15c3a821330ce3208feceeb041e26b92d8d7`;
this remote edition is mutable. Differences between editions require source
comparison, but the stored fragment does not establish coverage of the complete
chapter in this accessible edition. No conclusion is made here about whether the
unreviewed material contains named individuals.

The master date report describes its scope accurately as a two-unit calendrical
fragment. It records source fingerprint
`sha256:508490dbbebca54852a36175eb22f25a00ac3a5e02071ec190091f429d2a70a2`
and extraction fingerprint
`sha256:b969ba159cc89674c167a49e38601ba8670072bccb6115b192fd41d90e82fcb0`.
These are report fingerprints, not the byte hashes above. The master extraction
file's byte SHA-256 is
`15f04a41c5e2c31ba2d4dca1320169e941db4cd7608678bc4b433542e2eb4f35`;
the date report file's byte SHA-256 is
`7bdef66529f079738fd2d4ccf5a4fda4baf9b7890499da5850354227e418d8cc`.

Next: compare the original/source editions, restore and translate missing source
where appropriate, then redo extraction and all affected independent review,
date, identity and publication gates against the resulting fingerprints. Do not
count the present fragment as a fully completed chapter.
