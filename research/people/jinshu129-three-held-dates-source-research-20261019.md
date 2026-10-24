# Jinshu 129, s0004: three chronology holds — source research only

This narrowly scoped research is not a date audit, a repair proposal approved
for publication, or a chapter-completion claim. It needs independent review,
then a complete independent re-audit of the final extraction. In particular,
do not replace the current partial report, alter sealed work, or claim its
remaining items have been reviewed based on this note.

## Reproducible inputs and ownership snapshot

Staging revision `4233a8973c889b761947a9e367072ae4af40fd03`:

| Staged file | Exact byte SHA-256 |
| --- | --- |
| `data/jinshu/129.json` | `bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800` |
| `data/people/extractions/jinshu/129.json` | `91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8` |
| `data/people/date-audits/jinshu/129.json` | `db5007c78b394a0eb7e722671bcdb83af65c3f9461afcfc73f94e9233f7208b0` |
| `data/jinshu/122.json` | `a3b4edebb2249ba34b504ba980b024d3559e0d06733299c8ff330db01734e269` |
| `data/zizhitongjian/106.json` | `5d4fa17ec91a37bc23bf5c19e86183b59d95a344cd6d649ff8747ba8954ebc6f` |

The 129 report records semantic source hash
`sha256:cc168549d3ff787bf0807c78dcecb8792fc513e40c5554de585e326dcf2d9fce`
and extraction hash
`sha256:3c2a1f4126ff1e4b802cf8bfbae0150471b6563d21562eab1a8a8616b7eda472`.
At remote queue commit `4aca09929f40d88b55271e75e780d6423d494b2c`,
`claims`, `dateAudits`, and `dateAuditHistory` have no `jinshu/129` entry.
No local `data/people/generated/date-workflow/jinshu/129` directory was found.
This is a snapshot, not proof that another host cannot be working; recheck
ownership and all fingerprints before any operation.

## Textual observations

1. Jinshu 129 s0004 says that Liang Xi and Lü Guang both considered Juqu
   Mengxun remarkable and feared him, and that Mengxun hid his talents in
   drinking and roaming. It contains neither a calendar year nor a statement
   that their assessments occurred simultaneously or lasted over a dated
   interval. The publicly readable transcription of
   [Jinshu 129](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7129)
   agrees with this wording. This digital transcription has not been checked
   against a physical edition.
2. The account of Lü Guang in Jinshu 122 s0075–s0088 has Liang Xi oppose Lü's
   return from the western regions, then records Peng Ji's capture of Liang
   and Lü's entry into Guzang. It does not itself place numeric endpoints on
   Jinshu 129 s0004. See also the
   [Jinshu 122 transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7122).
3. The later chronological compilation Zizhi Tongjian 106 places the encounter
   under the Taiyuan tenth-year heading (local s0004–s0004a, the latter
   supplying the modern conversion AD 385). In s0225 it says Liang considered
   preventing Lü's return; s0243j says Peng Ji seized Liang and Lü killed him,
   and s0243k records Lü entering Guzang. See the
   [Zizhi Tongjian 106 transcription](https://zh.wikisource.org/wiki/%E8%B3%87%E6%B2%BB%E9%80%9A%E9%91%91/%E5%8D%B7106).
   The compilation is later than Jinshu and may draw on related sources: it
   is contextual historical evidence, not an independent eyewitness. The
   heading's modern-year conversion and any lunar-calendar boundaries need
   separate verification before use in a canonical date claim.
4. Jinshu 129 s0005–s0014 subsequently narrates events culminating in the
   correspondence Longfei year 2 = Shenxi year 1, but this date appears after
   s0004 and does not establish that every earlier described action occurred
   then. A separately sourced regnal-to-Western conversion is required before
   assigning a Western year to that event; the relation alone does not prove
   the endpoints of an earlier assessment.

## Implications for the six held items

- `claim-4` (p002 Liang Xi): if the Zizhi Tongjian account and its conversion
  are accepted, Liang's execution in 385 is evidence against a literal reading
  that his appraisal continued into 386. It does not establish that the
  appraisal began in 380, or provide the date of that appraisal. Do not infer
  either endpoint from the fact of his office or death. The possibility that
  an inclusive interval was intended as an imprecise bound must be reviewed
  explicitly against the schema; it is not currently established.
- `claim-1` (p001 Juqu Mengxun) and `claim-5` (p003 Lü Guang): their shared
  s0004 occurrence has no sourced 386–397 date range. Liang's earlier death
  does not by itself date Lü's separate appraisal, and the later 397 event does
  not date it either. A single simultaneity or a revised interval would be
  inference, not a direct quotation.
- `hints-p001`, `hints-p002`, and `hints-p003`: the above evidence does not
  establish both endpoints for the present active-date hints. These are person
  activity hints, not necessarily the duration of s0004 alone. Review each
  against *all* relevant source and extraction evidence before either retaining
  or changing it. Juqu Mengxun's later activities require their own evaluation;
  no broad lifetime dates are asserted here.

The safe next action is an independent verification of these cited passages,
the year conversion and the distinct interpretation of intervals versus
activity hints. Then coordinate any source-backed conservative repair and
fresh whole-chapter editorial, date and identity gates through the original
host-controlled ownership and history-preserving workflow. Until then the
existing `research-blocked` report stays in force.
