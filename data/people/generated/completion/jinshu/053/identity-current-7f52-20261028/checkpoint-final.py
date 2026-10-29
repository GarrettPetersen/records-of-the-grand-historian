import json, hashlib, pathlib, subprocess, os, tempfile, datetime
ROOT=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian'); J=ROOT/'data/people/generated/completion/jinshu/053/identity-current-7f52-20261028'
def read(name): return json.loads((J/name).read_text())
def sha(b): return hashlib.sha256(b).hexdigest()
def save(name,x): (J/name).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def git(*args,input=None,env=None): return subprocess.check_output(['git',*args],cwd=ROOT,input=input,env=env).decode().strip()
def guard():
 script="import{inspectLocalDisk}from'./scripts/check-local-disk.mjs';const r=inspectLocalDisk(process.cwd());if(r.errors.length)process.exit(1);console.log(JSON.stringify({freeGiB:r.availableGiB,errors:r.errors}));"
 subprocess.run(['node','--input-type=module','-e',script],cwd=ROOT,check=True,capture_output=True)
state=read('final-global/graph-state.json'); assert state['phase']=='finished', 'Global validation not finished'
validation=read('final-global/full-global-decision-validation.json'); proposed=(J/'final-proposed-resolution.json').read_bytes(); assert sha(proposed)==validation['documentSha256']
old=read('selected-complete-endpoint-clusters.json'); new=read('final-global/selected-complete-endpoint-clusters.json'); before=read('pairs.json')['pairs']; after=read('final-global/pairs.json')['pairs']; afterset={tuple(sorted(p)) for p in after}; mapping={}
for g in old['endpointClusters']:
 roots={new['localToCanonical'][i] for i in g['localPeople'] if i in new['localToCanonical']}; assert len(roots)<=1, 'Prior canonical group split';
 if roots: mapping[g['canonicalPersonId']]=next(iter(roots))
mapped=set(); internallyMerged=[]; disappeared=[]
for a,b in before:
 if a not in mapping or b not in mapping: disappeared.append([a,b]); continue
 p=tuple(sorted((mapping[a],mapping[b])))
 if p[0]==p[1]: internallyMerged.append([a,b])
 else: mapped.add(p)
reconcile={'baselinePairs':len(before),'remainingPairs':len(after),'internallyMergedPriorPairs':internallyMerged,'priorPairsWhoseEndpointsLeftRemainingGraph':disappeared,'reviewedClosedMappedPairs':[list(p) for p in sorted(mapped-afterset)],'genuineAddedPairs':[list(p) for p in sorted(afterset-mapped)],'canonicalRenames':{a:b for a,b in mapping.items() if a!=b},'sourceInputsUnchanged':True,'canonicalMembershipPreserved':True,'publicationQualification':False}
save('final-reconciliation.json',reconcile)
reports=[read('review-01.json'),read('review-02.json'),read('followup-review.json')]
receipt={'schemaVersion':1,'kind':'independently-source-reviewed-identity-checkpoint','scope':{'book':'jinshu','chapter':'053'},'inputRevision':validation['revision'],'documentSha256':sha(proposed),'decisions':validation['decisions'],'validation':validation,'validatorRunnerSha256':sha((J/'final-global/graph.mjs').read_bytes()),'validatorSourceAcceptanceLabelNote':'The output label refers to ../source-review-acceptance.json; the executed runner actually reads ../final-source-review-acceptance.json and verifies that exact document SHA.','frozenInputs':read('../work-order-20261028.json')['inputs'],'reviewerStates':[read('review-state-01.json'),read('review-state-02.json'),read('followup-state.json')],'sourceReviews':reports,'hostSupplementalTriage':read('host-supplemental-triage.json'),'followupClientCleanupReceipt':read('followup-cleanup-recovery.json'),'acceptedSelection':read('final-source-review-acceptance.json'),'reconciliation':reconcile,'nonemptyChapterDataQualified':False,'publishedNonemptyChapters':0}
files={'data/people/resolutions/jinshu053-source-reviewed-final-20261029.json':proposed,'research/people/identity-reviews/jinshu053-source-reviewed-final-20261029.json':(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n').encode()}
branch='codex/people-glossary-staging-v2'; parent='7f52dca725fad6fb94e2149b858d15a0749ea7e2'
if (J/'publication-receipt.json').exists():
 prior=read('publication-receipt.json'); assert git('ls-remote','origin','refs/heads/'+branch).split()[0]==prior['commit']; print(json.dumps(prior)); raise SystemExit(0)
guard(); assert git('ls-remote','origin','refs/heads/'+branch).split()[0]==parent, 'Staging moved; reconcile instead of overwrite'
def commit_files(parent,files,message):
 fd,index=tempfile.mkstemp(prefix='exact-index-',dir=J); os.close(fd); os.unlink(index); env={**os.environ,'GIT_INDEX_FILE':index}
 try:
  git('read-tree',parent,env=env)
  for file,body in files.items():
   blob=git('hash-object','-w','--stdin',input=body); git('update-index','--add','--cacheinfo','100644,'+blob+','+file,env=env)
  tree=git('write-tree',env=env); return git('commit-tree',tree,'-p',parent,input=(message+'\n').encode())
 finally:
  pathlib.Path(index).unlink(missing_ok=True)
commit=commit_files(parent,files,'Checkpoint 25 independently reviewed Jinshu053 identity decisions')
git('push','origin',commit+':refs/heads/'+branch,'--force-with-lease=refs/heads/'+branch+':'+parent)
assert git('ls-remote','origin','refs/heads/'+branch).split()[0]==commit
save('publication-receipt.json',{'branch':branch,'parent':parent,'commit':commit,'files':list(files),'remainingPairs':len(after),'dataQualified':False,'livePublished':False,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()})
handoff=f"""# Jinshu053 completion handoff — 2026-10-29
Continue completion, never fresh extraction. Read AGENTS.md, PEOPLE_COMPLETION_PROCESS.md and the people-glossary skill. No native subagents; one cloud assignment; one local heavy job. Check disk/memory before dispatch and every 60s. Shared checkout only, unique artifacts, 3GiB heavy Node ceiling. Preserve all owners/claims/leases/recovery. Never switch/reset/stage broadly in this dirty checkout.

Staging checkpoint: {commit}. Recovery branch: codex/people-recovery-20261025. Frozen source/extraction/editorial/current independent date approval remain those at 7f52dca725fad6fb94e2149b858d15a0749ea7e2 and work-order-20261028.json. 73 people. Current date approval: 209 units/206 items, zero findings. Do not repeat passed unchanged source/date work.

This bounded batch: 25 native globally validated identity decisions, independent source evidence and a separate current 67-member renewal receipt. See final-global/full-global-decision-validation.json, final-reconciliation.json and publication-receipt.json. Remaining target-touching canonical pairs: {len(after)}; newly added after canonical reconciliation: {len(reconcile['genuineAddedPairs'])}. Keep raw and mapped scopes. Data-qualified/published nonempty chapter count still ZERO. No master PR/CI/deployment claimed.

Held two-person Jia Nanfeng merge failed the proper strong-name gate (032 nickname-only overlap with 053); never weaken it or relabel to force a merge. A genuine source bridge exists in Jinshu031p193. New four-person root-authored packet: next-jia-empress-transitive-packet.json. Independent peer state/report: jia-bridge-state.json and jia-bridge-review.json if finished. Host acceptance and complete supplemental English application work are in jia-bridge-host-acceptance.json and editorial-application-work-order.json. The independent bridge review approved the full four-person merge, approved the 032 given-name correction, and rejected changing 028 courtesy because the actual Chinese explicitly says 字. Its claim corrections and supplemental English fixes remain UNAPPLIED, independent date approvals must become stale upon actual relevant input edits. Use the original stable peer handles. Check actual remote state before any resend, no blind continuation after uncertain send.

The largest remaining baseline blocks touch Emperor Wu/Sima Yan (160 pairs), Wang Rong (83), Emperor Xuan (70), Wang Yan (46). These are baseline figures; regenerate a bounded assignment from final-global current pairs and full protected canonical groups, not an old packet. Reuse source-verified prior evidence and explicit primary alias chains. Review source-complete clusters in bounded packets and do one full global rebuild per accepted batch. Run the fast native preflight against the validated current dossier before spending another 17-minute global corpus pass; it does not replace global validation. No recursive completion/date audits of external identity evidence chapters.

Main artifacts: data/people/generated/completion/jinshu/053/identity-current-7f52-20261028/. Retained source cache: data/people/generated/independent-identity-recovery/jinshu053-unihan17-pairwise-current-81a36ee49529-20261025/. Verify all hashes, current-source drift and current summaries before reuse. Endpoint cache is not a replacement for complete canonical membership or global consistency.

After zero touching pairs: real scoped site qualification, pages, bilingual backlinks, snippets, search/sitemap and ebook gates, clean exact-file PR, passing required CI, merge, verified deployment/live content receipt. First nonempty chapter need not wait for 30; no direct master push.
"""
(J/'HANDOFF-COMPLETION.md').write_text(handoff)
guard(); recovery='codex/people-recovery-20261025'; recoveryparent='04544ef894f741758e32d78f6b56607caf410629'; assert git('ls-remote','origin','refs/heads/'+recovery).split()[0]==recoveryparent, 'Recovery branch moved; preserve staging checkpoint and reconcile'
recoveryfiles={str(p.relative_to(ROOT)):p.read_bytes() for p in J.rglob('*') if p.is_file() and '__pycache__' not in p.parts and '.lock' not in p.name and 'exact-index-' not in p.name}
checkpoint=commit_files(recoveryparent,recoveryfiles,'Preserve frozen053 reviewed identity decisions, validation and remaining finite scope')
git('push','origin',checkpoint+':refs/heads/'+recovery,'--force-with-lease=refs/heads/'+recovery+':'+recoveryparent)
assert git('ls-remote','origin','refs/heads/'+recovery).split()[0]==checkpoint
save('recovery-publication-receipt.json',{'branch':recovery,'commit':checkpoint,'files':len(recoveryfiles),'stagingCommit':commit}); print(json.dumps({'staging':commit,'recovery':checkpoint,'decisions':validation['decisions'],'remainingPairs':len(after),'addedPairs':len(reconcile['genuineAddedPairs'])}))
