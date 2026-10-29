import os,json,pathlib,hashlib,tempfile,subprocess
R=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian');J=pathlib.Path(__file__).resolve().parent
PARENT='7f37bde2522f442330b4b7622c225ae664f53dbd';RECOVERY_PARENT='90e06fca38e0c337ba283de5d7bcbf078f4ee580'
def read(n):return json.loads((J/n).read_text())
def save(n,x):(J/n).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(b):return hashlib.sha256(b).hexdigest()
def git(*args,input=None,env=None):return subprocess.check_output(['git',*args],cwd=R,input=input,env=env).decode().strip()
def guard():subprocess.run(['npm','run','people:disk:check'],cwd=R,check=True,stdout=subprocess.DEVNULL)
def commit(base,files,msg):
 fd,name=tempfile.mkstemp(prefix='checkpoint-index-',dir=J);os.close(fd);os.unlink(name);env={**os.environ,'GIT_INDEX_FILE':name}
 try:
  git('read-tree',base,env=env)
  for file,b in files.items():git('update-index','--add','--cacheinfo','100644,'+git('hash-object','-w','--stdin',input=b)+','+file,env=env)
  return git('commit-tree',git('write-tree',env=env),'-p',base,input=(msg+'\n').encode())
 finally:pathlib.Path(name).unlink(missing_ok=True)
state=read('graph-state.json');assert state['phase']=='finished'
v=read('full-global-decision-validation.json');assert v['passed'];b=(J/'reviewed-resolution.json').read_bytes();assert sha(b)==v['documentSha256']
a=read('source-review-acceptance.json');assert len(a['acceptedAssignmentReviews'])==107 and not a['citationHolds']
usage=[]
for f in sorted([*J.glob('*-usage-??.json'),J/'citation-supplement-usage.json']):
 x=json.loads(f.read_text());usage.append({'file':f.name,'tokens':x['usage']['totalTokens'],'rawCostCents':x['cost']['rawCostCents'],'chargedCents':x['cost']['chargedCents']})
e=read('editorial-application-work-order.json')
receipt={'schemaVersion':1,'kind':'source-reviewed-canonical-identity-batch','scope':{'book':'jinshu','chapter':'053'},'inputRevision':PARENT,'validation':v,'sourceReviewAcceptance':a,'reconciliation':read('final-reconciliation.json'),'baselineEquivalence':read('baseline-equivalence.json'),'baselinePairs':633,'usage':{'runs':len(usage),'totalTokens':sum(x['tokens'] for x in usage),'rawCostCents':sum(x['rawCostCents'] for x in usage),'chargedCents':sum(x['chargedCents'] for x in usage)},'globalElapsedSeconds':state['elapsedSeconds'],'citationRecovery':{'sameReviewerSupplement':read('citation-supplement-state.json'),'orthographicAlignment':read('citation-orthography-receipt.json'),'originalReportsPreserved':True,'partial83ValidationPreserved':'partial-83-global/'},'sourceEditorialDateInputsUnchanged':True,'scopeDataQualified':False,'scopeLivePublished':False,'editorialRepairStatus':{'independentlyApprovedCompleteFields':len(e['independentlyApprovedCompleteFieldRepairs']),'pendingSeparateReviewOrCitation':len(e['pendingSeparateReview']),'rejectedOrUnproven':len(e['rejectedOrUnprovenProposals']),'applied':False},'recoveryBranch':'codex/people-recovery-20261025'}
name='jinshu053-wangyan-expansion-source-reviewed-20261029.json'
files={'data/people/resolutions/'+name:b,'research/people/identity-reviews/'+name:(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n').encode()}
guard();branch='codex/people-glossary-staging-v2';assert git('ls-remote','origin','refs/heads/'+branch).split()[0]==PARENT
c=commit(PARENT,files,'Checkpoint 107 independently reviewed expanded Wang Yan comparisons');git('push','origin',c+':refs/heads/'+branch,'--force-with-lease=refs/heads/'+branch+':'+PARENT);assert git('ls-remote','origin','refs/heads/'+branch).split()[0]==c
save('publication-receipt.json',{'commit':c,'parent':PARENT,'branch':branch,'decisions':len(json.loads(b)['decisions']),'reviewedComparisons':107,'remainingPairs':state['remainingPairs'],'genuineAddedPairs':state['genuineAddedPairs'],'qualified':False,'published':False})
(J/'HANDOFF-COMPLETION.md').write_text(f'''# Completion checkpoint 2026-10-29
Continue Jinshu053 under AGENTS.md, PEOPLE_COMPLETION_PROCESS.md and the people-glossary skill. No fresh extraction, native subagents or new checkout. Primary checkout is dirty: no reset/switch/pull/broad stage. Use exact pinned source and host temp index publication. At most two measured-safe cloud conversations; one local heavy job with 3GiB Node heap; guard before dispatch and every60s. End this bounded coordination batch here.

Staging {c}; parent7f37bde2522f442330b4b7622c225ae664f53dbd. All107 newly target-touching WangYan comparisons independently source-reviewed in six sealed packets, 105 compiled decisions including one whole19-member merge. Strict exact-source citations initially held24; original83 native global graph passed and is preserved in partial-83-global/. Same reviewer05 supplied citation-only23-row supplement; new064 only aligns 為→爲 to actual source, original reports and decisions unchanged. Final full native validation passes, baseline633 -> {state['remainingPairs']} remaining target pairs, genuine added {state['genuineAddedPairs']}. Read final-reconciliation.json for exact IDs/renames. 305 baseline whole resolution documents plus this new document; 2050 extracted chapters/258210 normalized people. Source/editorial/extraction/date fingerprints unchanged. Pilot remains73people, editorial/date approved, NOT data-qualified or live published. Full goal remains active.

Current graph/pairs/whole endpoints in this dir; next packets must be finite source-complete remaining target comparisons, not recursive outside completion. Preserve producer validation and conservative aliases/homonym rules. load-current-corpus.mjs validates exact current7f37 baseline against local strict f85 cache, fresh three typed chapter deltas and all305 whole resolution documents; next baseline must also replay this new105decision document and prove exact delta. Local cache171MB at ../identity-wu-f85-20261029/validated-corpus.v8frames.gz stays local and must be preserved, never re-tag rawf85 as current. No candidate-pruning/validator change.

Editorial work-order retains13 independently approved complete field repairs,13 pending separate review/citation,2 rejected/unproven proposals plus5 claim proposals; none applied. Keep all exact before/after/source reasons and independently review reviewer-authored repairs, paired fields and repetitions through normal editorial application, reconcile all affected downstream approvals. Some peer05 English verdicts lack exact citations and remain held; identity-only supplement does not approve those repairs. Older genuine repairs remain in earlier work-orders; do not lose them or duplicate pending Grok14-field job. No invented Chinese-parentheses rule or deleting accurate contextual full names.

Cursor SDK supplied12 source/review runs plus one same-reviewer citation followup; usage in canonical research receipt. This consumes Cursor allowance even though model is grok-4.6. GrokBot separate allowance has NOT executed the pending MCP job: ../grok-review-transport-966e-20261029/HANDOFF-COMPLETION.md has exact recovery. MCP1.1.0 is deployed from merged processPR5360, master0be83fa27e6a03058cc5bebda5061610c3899c15. Registered job jinshu053-editorial-supplement-20261029 belongs grokbot-24, actualagent68870dc2-b08d-4237-8847-f42fbfd5a7c6,14field repairs6chapters, not dispatched. Desktop running without9229; user active-other-work question pending before graceful restart. Do not forcequit unknown work. Private signedticket expired: renew only times under same job/worker and preserve previous ticket; never expose credentials/ticket or checkpoint it. No capacity-exhaustion claim justified. No automation enabled.

Original086 date worker and retained round3/circuit, claims/leases/locks and recovery unchanged; no takeovers. At zero touching pairs run actual qualification/personpages/bilingual backlinks/inverse excerpts/search/sitemap/ebook verification, clean PR with passingCI, merge, deployment/livecontent checks. First nonempty pilot may release below30, never direct pushmaster or count staging as live.
''')
guard();rbranch='codex/people-recovery-20261025';assert git('ls-remote','origin','refs/heads/'+rbranch).split()[0]==RECOVERY_PARENT
backup={str(p.relative_to(R)):p.read_bytes() for p in J.rglob('*') if p.is_file() and '__pycache__' not in p.parts and '.lock' not in p.name and not p.name.startswith('checkpoint-index-') and not p.name.endswith('.incomplete') and 'private' not in p.name}
rc=commit(RECOVERY_PARENT,backup,'Preserve expanded Wang Yan reviews, citation recovery and completion checkpoint');git('push','origin',rc+':refs/heads/'+rbranch,'--force-with-lease=refs/heads/'+rbranch+':'+RECOVERY_PARENT);assert git('ls-remote','origin','refs/heads/'+rbranch).split()[0]==rc
save('recovery-publication-receipt.json',{'commit':rc,'stagingCommit':c,'files':len(backup)});print(json.dumps({'staging':c,'recovery':rc,'remainingPairs':state['remainingPairs'],'acceptedComparisons':107,'genuineAddedPairs':state['genuineAddedPairs'],'usage':receipt['usage']}))
