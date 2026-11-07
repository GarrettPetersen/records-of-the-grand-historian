# Completion handoff — 2026-11-07T02:10:27.238548+00:00

Full objective: all4,099 chapters; prioritize all130Jinshu through ebook readiness. Read the goal attachment, AGENTS.md and PEOPLE_COMPLETION_PROCESS.md. Goal ACTIVE. Only Jinshu053 is verified complete/live; do not repeat its release. No broad extraction, new checkout, paid fallback or native subagents. This bounded batch is complete; rotate from this compact handoff.

R=data/people/generated/completion/jinshu/127/retained-source-check-20261107
B=data/people/generated/completion/jinshu/072/bounded-dossiers-20261103
A=data/people/generated/completion/jinshu/080/retained-date-recovery-20261103
D=data/people/generated/completion/jinshu/109/bounded-dossiers-parser-fixed-20261105/candidate-date-review-1-20261105
H=D/native-final-date-stage-a2332e08
NEW109=D/native-final-date-stage-4c6719af (NEW in the retained109 section below)
W=/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime, clean c991cf12d80fda1d1375d729f6f3553cc212bbcb. Use explicit primary data paths, never PEOPLE_REPO_ROOT=dirty primary. Preserve unrelated changes and staged109audit deletion. W is unchanged; do not update a runtime used by MCP/jobs without checking ownership.

## Current127 applied source and held dates

R/English-applied-prepared-v6/application.json is APPLIED and R/post-application-verification.json independently verifies it.8Englishfields fixed: s0011both (AhMengofWu),s0272both (elderbrother’sson andearliersummons),s0010en (Chui’selderbrother relationship),s0013both (implicated, notprovedaccomplice),s0275en (omittedinheritance/nobilitygrant). Source sha256:8d87af938f44b8508f0966ec791e459235767bbc848e185e1ad63281dee67a7e; canonical sha256:21531ff5b0023ce1def8e97d11717dc625b89e2c585784c4120af6f43e7b15c2; source generation a6dc476b-5e0c-4284-b7dc-e61524ceb7c9.

278units/819candidates/165people/687mentions/910expandedclaims/19appliedrepairs/479dispositions/0aliasconflicts.379dateitems, everyrawperson/claim/hint andChinese witness unchanged; all15legacyWFfiles byte-exact. TwoEnglishdisplaylinks retainexistingp001(s0010) andp009(s0011), no newindividual/merge. Primary index unchanged.0ownedmodeljobs/globaldate+resolutionlocksabsent, allwatchersexited0.

127’s previous current-looking date approval was FALSE: independent retainedDDDb/t15s3 checked17sourceunits,10dateitems/5people and confirmed5falseactivity attestations/hints. All15retainedproposalchanges independently supported. R/negative-recording.json used normal W recordDateAudit to replace canonicalpositive with a native needs-revision report, archiving oldpositive normally plus R/prior-audited-report-byte-exact.json. After8Englishchanges the negative is now STALE with itsoriginalhashes, neverretagged current approval. No current127dateapproval exists. Its original legacyWF phasecomplete/round2 remains unchanged, historically preserved; it must be explicitly reconciled, not trusted as current completion.

R/English-applied-prepared-v6/staged-date-proposal.json and staged-date-extraction.json hold the15exact reviewedchanges with mechanically derivednewpins, validated but NOTcanonically applied, NOTfreshdateapproved. They replace5falseactivityclaims by undated retrospective references, clearing correspondinghints while retainingpeople/facts. Do not inventBC598/otherdates or make genuinely dated events undated. Original source review/input/rawreports remainimmutable.

Machine-readable Chinese-link hold: config/manifest/receipt/shared candidateStage.unlinkedChineseWitnesses flags p001/s0010/德 occurrence0, context德兄垂甚壯之, statusflagged-not-linked, linkedNowfalse, requiresSeparateIdentityReviewtrue. R/identity-coverage-s0010-proposal.json is the concrete proposed missingChinese displaylink. Independently review/fix it BEFORE sealing fresh dateevidence, so a later repair doesnotstale another fullaudit. This Englishbatch deliberatelydidnotaddtheChinese span orclearidentity.

Retained source/date owner jinshu-completion-127-source-quality, grokbot, currentgeneration above, research-blocked, noexecutor. Sourceauthors host codex-thread:01a18e17-07b3-7f13-8e34-cb207908be33 andDDDb(dddb08ed-6a6f-4878-872a-436e19e2882a) mustbeexcluded fromfreshdateaudits; preservelegacyrepairauthorIDs too. Actual Englishreview0f487fa0-1e09-449e-a50d-2cf33e7a3df7/t10s2 acceptedall8,0supplementals. Actualcodefinalsame0f/t12s3 approved10/10,0findings; sourceauthor/reviewerindependence preserved. Firstcode review8/10negative retained; missingChineseflag, staleunusedhash andunsealedfixture findings werefixed andfreshlyrechecked.

## Process bug fix and live CI

English-only reconciliation silently removed theunnamedfatherp163 and4claims despiteunchangedChinese. Exactnormaldata guard caughtit beforeanysourcewrite. Thefix extends theexisting no-span Chinese-name retentionguard to actualcitedChinesekinshipterms, still requiring everyownedChinese witnessunchanged andanexisting exception.6newtests inclreal165people/910claims,6existingnameassertions andrepairselftestpassed.11productionassertionspassed. Noidentity/dateapprovalisgrantedbyrecordretention.

PR5378 https://github.com/GarrettPetersen/records-of-the-grand-historian/pull/5378, head50ef6d3ddcab9ebc2fab6ab9b56f4cc000ef6b1c, has onlyhelper+offlineassertions. R/retention-code-independent-review-binding.json tiesitsactualhelpercompiledSHA andfull11assertioncodetoindependentfinalapproval. R/retention-code-pr-observation.json lastshowsOPEN,ready,normalSQUASHauto-mergeenabled at02:07:26UTC. Requiredmaster-build run42326585325/job128263172236 is IN_PROGRESS; vocabulary42326585297passed. Poll thoseactualhandles/PRstate, neverrestart/duplicateCI oruseadminbypass. Auto-merge/deploy is NOTyetverified. Aftermerge recordnewmaster/deploymentandlivechecks; no newchaptercount.

W runtime disk stayedclean c991 becauseMCP ownershipmustbepreserved. Thishostsourcebatch loadedtheexactSHA-guarded reviewed helpertransform via --import R/register-reconciliation-loader.mjs, receiptR/reconciliation-runtime-transform.json; noWfileschanged. Thefunction/compiledchecksumisexactlytheproductionPRhelper. Do notreruncompletedsourceapplication/intent. Once safelyadoptingmergedcode atidleinvocationboundary, use thenewcleanruntime directly andretiretheold-base override; theoverride correctlyrejectsachangedbase.

##109 unchanged holds

109’s prior32fieldsourcebatchremainsapplied; currentgeneration4c6719af, sourcea2ee9933..., canonical146db679..., staged537ae0a9....603dateitems/366stagedchanges retained,41oldWFfilesbyte-exact; no109positiveapproval. Keepallprevious receipts andowners. ThefollowingholdsummaryusesH/NEW109pathsabove:

## Chronology and attribution remain blocked

NEW/revision.json is the current source lineage. WF phase REPAIR, ROUND3/CEILING3, sourceApproachReviewRequired true. Old complete13-part negative report is WF/retained-source-negative-review.json with ORIGINAL hashes; SHA55f9413b48cc52461883bcc0e1cbe1fb7712804b1da3832c87ab95d1a0413076. It is historical negative evidence, not current-source approval. Complete original workflow archive: /Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/date-workflow/jinshu/109.reviewed-English-4c6719af-84ea-4bef-b30c-002b88b34b1f. H/audit-controller.json is source-reconciled/oldPacketDispatchForbidden. Old frozen packets/configs must not launch work. Current positive109date audit remains absent.

Never add automatic round4, raise limits, delete state/locks/history or retag approvals. Independently investigate the source/representation and review the new approach before reconciling the exhausted loop. Preserve the16finding groups: original603itemchecks572supported/20incorrect/11research-blocked;181personchecks167supported/11incorrect/3blocked. Those checks are not automatically current after source changes.

Concrete holds: p116/claim734 grantor (Jin court versus Huang); p133 HanGaozu identity conflicts with the Guangwu land-survey-execution anecdote (primary HouHanshu/ZZTJ references in prior artifacts). Both require independent source/canonical-anchor review, never blind date reassignment. Other negatives include precise335raid, claim223sourceDate splice/339endpoint, YuBing bounds, WangChe endpoint, retrospective exhumation/city references, unsupported farming window, missing own-person events, Helong341/342source conflict, and9genuine Xiankang4twelfth-month338/339calendar items. Do not make genuinely dated events undated. H/undated-fact-representation-diagnostic.json is only a successful in-memory production-path diagnostic for withdrawing the unsupported farming date while retaining the fact, not an approved repair.

Date owner jinshu-release-dates-cursor-sdk, lane grokbot, research-blocked/no executor. Identity owner jinshu-completion-109-identity, source-reconciliation-hold, oldPacketDispatchForbidden. WF/source-author-journal-final3.json includes real new repair authors; do not reuse those authors as later date reviewers. Existing19dossiercases/28records are partial historical proof recovery, not109clearance. Reconcile only changed dossiers, at most8indexed retrievals/person, zero all-name pairs.



## Final active-record repetition check — current127 hold

The eight SOURCE English fields are applied, but two active glossary record strings still retain the old mistranslation. R/record-wording-repairs-required.json supplies complete exact replacements: /people/8/5/2/0/en “young Meng east of Wu” → “Ah Meng of Wu”; /claims/88/2/assessment “praised De as no longer the young Meng of Wu” → “praised De as no longer Ah Meng of Wu”. Both cite s0011; preserve Chinese, identity, certainty and all other fields. These are proposed, NOT applied or independently approved. R/record-wording-hold-receipt.json records their machine-readable shared source hold under candidateStage.requiredRecordWordings. Review and apply them, plus the Chinese德 link, BEFORE sealing any fresh date audit. This is current chapter work, never a deferred corpus-wide cleanup. Do not rerun the completed eight-field app.

## Next work and checkpoint

1. ObservePR5378’sactualrun/auto-merge/deploy. Preserve itscurrenthead/checks andthecleanruntime; do notrebuild/release053again.
2. Fix127’sknownChinese德linkwithindependentreview, preserveanonymousfatherandallfacts. Thenreconcilelegacycompleted2throughreviewedpublicationrecovery, maintaininground2/3history—archiveStaleDateWorkflow intentionallyrejectscomplete; do notbypass/reset. Rebase15unchangedhelddatechangesafterthesource-linkfix; obtainfreshFULLcurrent-source independentaudit beforequalification.
3. Continuebounded canonicaldossiers (atmost8indexedretrievals/person,zeropairgraph) onlywheneligible. Applynormal website/backlinks/search/ebook/CI/deployment/livegates. OtherretainedJinshuholds/ownersstaypreserved; no newwave.

A/checkpoint-selected-recovery.py nowincludesRrecursive,canonical127source/extraction/editorial/dateaudit/history andalllegacyWF127, usingprivateGitindex. Exact latest checkpoint is in B/nov07-jinshu127-record-wording-hold-recovery.json after backup; prior646b9608523c9cebcac4e0365d08390d358b20ee receipt is byte-exact in R/previous-recovery-receipt-646b9608.json; previousdb5333caf1cc13d047dc1e2f39f1391a34c839efreceiptbyte-exactatR/previous-recovery-receipt-db5333ca.json. Priorhandoff/state atA/handoff-before-127-reviewed-source-checkpoint-20261107.md andA/state-before-127-reviewed-source-checkpoint-20261107.json.0newcomplete/0newpublished,only053verifiedlive. Historicaldeployedc991Nov5metricsscopeandcontested072/109/127dateapprovalsarelabelledinCURRENT-STATE; donotcountthemascleared.

## Resource boundary

Stopnewworkatthiscompletedbatchcheckpoint; currentgoalturnbegan01:14:59UTC, hardboundary02:14:59, modeladmission02:07closed. GoalremainsACTIVE. Freshcompacthandoff, noforkedcampaignhistory; oneheavyjob/3GiBNode,onecloudassignmentinitially, guardbefore/after/60s. Guardpasses~31GiBfree,pressure1,swap1875776634stable. Allwatchersnormalexit0; noapp/servicekilled. Standardmemory-warningprocedurepersists: pauseheavy,inspectpressure/swapgrowth/physicalfootprint; onlyverifiedidle/supersededpreviewsgetSIGTERMwithrestartreceipt/retainedpreviewverification. Preserveactive5176anime-games,MCP3001,otherjobs/uncertainservices. Noapprestartwhileotherchatswork; norepeatedoldpackingintents.
