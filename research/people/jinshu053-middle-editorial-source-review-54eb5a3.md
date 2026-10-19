# Jinshu 053, s0066–s0130: partial source/editorial review

Reviewed against `data/jinshu/053.json` at staging
`54eb5a3c50281bf71a42464b913f194f56753fd0`; the exact source file SHA-256 is
`85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407`.
This is one reviewer's draft, not an applied repair, independent editorial
approval, or whole-chapter review. The v4 JSON holds exact Chinese source,
before values and proposed after values for 53 units and 65 English fields.
Run `node data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-middle-editorial-proposals-54eb5a3.mjs`
from the repository root to reproduce it from Git objects; no canonical data
or queue is written. The separate v1, v2 and v3 JSONs remain as prior drafts.

The dominant problem is that many idiomatic fields summarize, editorialize or
change grammatical person inside a long first-person letter instead of
translating its sentences. Particularly consequential examples are:

- s0067: the edict circulates the confession to high officials, not all of
  Luoyang; s0068 omits the escort and guard details in idiomatic English.
- s0077: 宜城君 is Lady of Yicheng; the literal field's “Princess Dowager Xuan
  city” is not her title.
- s0095: the source fears becoming disoriented before seeing the addressee;
  the idiomatic field invents “drunken copying.” s0098–s0100 are first-person
  narrative; the literal field of s0098 incorrectly makes the drink a command.
- s0108 and s0111: 倫 is the name Lun, Prince of Zhao, not a place named Lun;
  s0109 directly warns Sun Xiu that trouble will reach him, rather than saying
  Jia will scapegoat allies.
- s0122: Liu Zhen orders the move and cutoff of food, not Sun Lü. Both the
  agent and the palace people's passing food over the wall matter.

The remainder was read but not all has a safe proposed repair. In particular:

- s0069–s0070: the nursery rhymes are difficult and the present English is
  opaque; neither line is approved by leaving it unchanged. Review the Chinese
  wordplay and historical commentary before proposing a confident rendering.
- s0087: `不得王是成國耳` is ambiguous to this reviewer; the current literal
  “got Cheng principality instead” and the idiomatic summary may misread it.
  Consult source context/commentaries and report uncertainty; do not adopt
  that literal as resolved.
- s0104: `持筆研墨黃紙` may use 研 for 硯, yielding brush, inkstone, ink
  and yellow paper; the discarded v3 reading as an action of grinding ink
  needs confirmation. No change is proposed until this is checked.
- s0126: `刻肌刻骨 ... 規為稽顙，正其名號` needs careful review of intended
  subject, contrition and timing. The idiomatic “repent posthumously” adds a
  conclusion not clearly stated and is not approved. No replacement here is
  offered until this is researched.
- No new draft is offered for s0072, s0074, s0110, s0116, s0117, s0125 or
  s0129. This is not a finding that every nuance of those units is perfect.

Several proposed office renderings and terms of address also need independent
checking. In particular confirm s0066/0120 黃門, s0068 治書御史 and 持節,
s0081–s0097 天教 and 陛下, and s0108 常從督. Preserve traditional age
reckoning in s0124. The v4 output is a research handoff, not a directly
applicable `people:editorial` decision document. A separate reviewer must
approve exact proposals, reconcile uncertain or overlapping corrections, and
the host must re-check source/extraction fingerprints, editorial decisions,
dates and identity before any canonical change.
