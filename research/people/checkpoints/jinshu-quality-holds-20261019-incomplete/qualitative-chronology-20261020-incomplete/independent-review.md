# Independent review: qualitative chronology prototype

Decision: **hold the prototype; do not apply to production or treat it as a
date approval**. Research and tests only; no source, extraction, Git index,
queue, ownership or audit state was changed.

## Pinned review inputs

- Staging base `badf6573cb7ea861bbb244fda4ddb446735740c8`.
- Existing isolated script fixture `/private/tmp/people-qual-chronology.QPaGctFL`.
- `qualitative-chronology-incomplete.patch` SHA-256 `65a335d165f7b3863ffc0f13a82fd48fa6c4c15b539739436cfad314c96fbf8f`.
- Modified `scripts/lib/people-date-values.mjs` SHA-256 `c9a0264fc8a477a897b83d5382d8bee8967f49105eddc654745015a1dd1d187e`.
- Modified `scripts/lib/people-date-workflow.mjs` SHA-256 `50b44974997839acafa4f29b458d8116e5da73e12334a52c014efb6b9773a8a3`.
- Modified `scripts/validate-people-extraction.mjs` SHA-256 `b3d6c3d0c71c0388df58fc5558839584a7bb4a516c4846da6a5b410a4db1ec52`.
- Date workflow test SHA-256 `c6e81ea9e02113eb40701638cdd15f074fca40da71d26eb9fc24a3a3662f76ec`; date audit test SHA-256 `a8037d73daa60298098e238b78e5be58428013f33e702c63c4e4796255cd08fd`.

## Findings

1. **The proposed machine guard does not reliably distinguish an unresolved
   date from genuinely relative context.** `isSourceRelativeQualitative`
   blocks common Arabic/Chinese numbered `年` forms and an explicit
   `regnalYear`, but returns `true` for each of `建武二載` (a numbered reign
   year written with 載), `甲子` (a sexagenary date requiring contextual
   conversion) and `44 BC` (a Western year). Reproduction in the isolated
   fixture:

   ```js
   import { isSourceRelativeQualitative } from './scripts/lib/people-date-values.mjs';
   isSourceRelativeQualitative({
     sourceDate: { text: '建武二載' },
     qualitative: 'An event with unresolved exact historical chronology',
   }); // true; same result for 甲子 and 44 BC
   ```

   Existing `validateDateAuditReport` explicitly blocks `unresolved:true`,
   but a repair that improperly replaces that field with an accepted
   qualitative description can escape that mechanical specific hold. A fresh
   full independent audit is still required: this is **not** evidence of
   automatic approval or publication, but a reviewer mistake is no longer
   caught by that gate. Generic strings of sufficient length also qualify;
   string length does not establish that source evidence is meaningful or
   that a conversion dispute has been settled. A finite denylist cannot prove
   all absolute or relative temporal meanings; keep a clear, enforceable
   unresolved-evidence/review design rather than claiming regex completeness.

2. **The >=20-character restriction is newly imposed on a descriptive field.**
   The prior extraction validator required nonempty qualitative text. The
   proposed validator rejects shorter text whenever sourceDate is present and
   no Western date is supplied. The goal expressly says not to invent new
   restrictions on fields intentionally allowing descriptive text; a concise
   source-specific description can be valid. Require meaningful attested
   evidence and independent review without a new arbitrary length minimum.

3. **Jinshu 025 does have source-relative evidence but this does not by itself
   establish approval.** Retained packet s0016 gives `成王之會` and s0017
   names 殷公 and 曹叔 in the immediately following passage. Recording the
   source's assembly/participants without inventing Western endpoints could
   preserve meaningful context. However, the retained review-3 explicitly
   records competing proposed Western Zhou chronologies and holds claims 10–15
   and p004–p006. The present prototype's test uses a synthetic fixture, not
   the real sealed candidate or a fresh complete audit; it does not resolve
   whether external conflicting chronologies are material, whether participant
   identities are stable, or whether any narrower attribution is warranted.
   Do not delete those findings or equate passing code tests with approval.

## Positive evidence and limits

In the existing isolated fixture, `node scripts/validate-people-extraction.mjs
--self-test` passed, and `node --test scripts/test-people-date-workflow.mjs
scripts/test-people-date-audit.mjs` passed all 76 tests. These exercise
roundtripping, reviewer/packet completeness and independent repair re-audit.
Existing runner semantics still require the repaired candidate to pass an
independent fresh audit before publication; separate reviewer identity and
fingerprint checks remain in force. Neither check proves that a qualitative
label is source-supported or that disputed date evidence has been retained.
No attempt was made to record an audit or publish the candidate.
