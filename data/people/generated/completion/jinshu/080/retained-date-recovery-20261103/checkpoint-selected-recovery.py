import json,pathlib,subprocess,os,tempfile,hashlib,datetime
base=pathlib.Path('data/people/generated/completion/jinshu/072/bounded-dossiers-20261103');audit=pathlib.Path('data/people/generated/completion/jinshu/080/retained-date-recovery-20261103');wf=pathlib.Path('data/people/generated/date-workflow/jinshu/080')
receiptName=os.environ['PEOPLE_CHECKPOINT_RECEIPT'];assert '/' not in receiptName and receiptName.endswith('.json');assert not (base/receiptName).exists()
def git(*args,input=None,env=None):return subprocess.run(['git',*args],input=input,stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True,env=env).stdout.decode().strip()
g=subprocess.run(['npm','run','people:disk:check'],capture_output=True,text=True,check=True);assert not json.loads(g.stdout[g.stdout.index('{'):])['errors']
branch='refs/heads/codex/people-recovery-20261025';parent=git('ls-remote','origin',branch).split()[0]
if subprocess.run(['git','cat-file','-e',parent+'^{commit}'],capture_output=True).returncode:git('fetch','--no-tags','origin',branch)
files=[base/x for x in ['CURRENT-STATE.json','HANDOFF.md','transport-merge-receipt.json','transport-staging-reconciliation.json','deployment-observation.json','observe-production.mjs','live-transport-release-receipt.json','release-progress-transport.json','staging-progress-after-080-audit.json','ci-transport-qualified-contribution/qualification-and-contribution.json']]
files += [audit/'audit-coverage-receipt.json',audit/'repair-admission-preview.json',audit/'staging-negative-audit-publication.json',audit/'next-repair-work-order.json',audit/'audit-cost-receipt.json',pathlib.Path('data/people/date-audits/jinshu/080.json'),pathlib.Path('data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/live-check-9fb028cbfa31.json'),audit/'resume-one-review.mjs',wf/'state.json']
for folder in [audit,audit/'second-range-calibration',audit/'final-original-range',*sorted(audit.glob('measured-pair-*'))]:
 if not folder.is_dir():continue
 for name in ['one-review-state.json','one-review-summary.json','accepted-review-receipt.json','accepted-and-recovered-receipt.json','audit-coverage-receipt.json']:
  p=folder/name
  if p.exists():files.append(p)
files += list(audit.glob('recover-*-summary.json'));files += [p for p in audit.glob('*.json') if not p.name.startswith('memory-') and p.name != 'resource-hold-cleared.json'];files.append(audit/'pre-feedback-validation-resource.npm.log');files.append(audit/'producer-hint-contract-proposal.patch');files += list(wf.glob('*.json'));files += list(audit.glob('repair-round-0-group-*/*.json'))
files += [audit/'capture-repair-admission.mjs',audit/'review-producer-contract.mjs']; files += list(audit.glob('existing-reception-*.raw.txt')); files += list(audit.glob('people-reception-*.log')); files += list((audit/'producer-contract-release-ci').glob('*'))
files += list(audit.glob('vocabulary-checkout-*.raw.txt')); files += list(audit.glob('vocabulary-sparse*.log')); files.append(audit/'vocabulary-e1c3-ci-failure.log'); files.append(pathlib.Path('data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/live-check-4cd33f50caf1.json')); files.append(base/'nov03-third-repair-and-reviewed-code-recovery.json')
files.append(audit/'date-reaudit-unresolved-preflight-proposal.patch'); files += list((audit/'reception-repair-release-ci').glob('*')); files.append(base/'nov03-live-and-ci-repair-recovery.json')
files += list(audit.glob('reaudit-preflight-*.raw.txt')); files += [audit/name for name in ['reaudit-preflight-workflow-ownership.log','reaudit-preflight-worker-campaign.log','reaudit-preflight-stale.log','glossary-skill-completion-policy.patch']]; files.append(pathlib.Path('data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/live-check-89edbf689cf1.json')); files.append(base/'nov03-four-repairs-and-merged-code-recovery.json')
assert json.loads((audit/'repair-round-0-group-5-correction/one-review-state.json').read_text())['phase']=='terminal','Preserve active source invocation; do not snapshot it'
publication=json.loads((audit/'staging-negative-audit-publication.json').read_text());files.append(pathlib.Path(publication['priorApprovalArchived']));state=json.loads((wf/'state.json').read_text());oldKeys={'audit-0-0006d1041a16df164133','audit-0-9fd718005f4ae233d3fb','audit-0-af883eaa7938ed9c71a4','audit-0-4c573687d4b749838c66','audit-0-e5afb6ceefc1a984f32e'};oldRawAbsent=[];returned=0
for key,job in state['jobs'].items():
 if job.get('status')!='returned' or not key.startswith('audit-0-'):continue
 report=wf/(key+'.json')
 if not report.exists():raise RuntimeError('Returned report still being validated/published; wait for idle checkpoint')
 files.append(report)
 if key.startswith('audit-0-'):returned+=1
 raw=wf/('raw-date-artifact-'+job['artifactHash']+'.json')
 if key in oldKeys and not raw.exists():oldRawAbsent.append(key)
 else:assert hashlib.sha256(raw.read_bytes()).hexdigest()==job['artifactHash'];files.append(raw)
for name in ['review-0.json','combined-proposal.json']:
 p=wf/name
 if p.exists():files.append(p)
files += list(audit.glob('*.mjs')); files += list(audit.glob('*.py')); files += list(audit.glob('preflight-resume-*.raw.txt')); files += [audit/name for name in ['preflight-resume-workflow-ownership.log','preflight-resume-workflow-ownership-final.log','preflight-resume-e2e-ownership.log','preflight-resume-worker-campaign-stale.log','preflight-resume-corrected-workflow.log']]; files += list((audit/'reaudit-preflight-release-ci').glob('*')); files.append(pathlib.Path('data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/live-check-32f51184c37b.json')); files.append(base/'nov03-fifth-repair-and-live-preflight-recovery.json')
cohort=json.loads((audit/'full-reaudit-2/state.json').read_text());assert cohort['phase']=='terminal','Preserve active re-audit before checkpoint'
try:os.kill(cohort['pid'],0)
except ProcessLookupError:pass
else:raise RuntimeError('Retained source CLI is still present; inspect current ownership')
files += [p for p in (audit/'full-reaudit-2').glob('*.json') if p.name!='f0c40-original-first-turn.json']
files += list((audit/'preflight-resume-release-ci').glob('*'))
files.append(base/'nov03-six-repairs-source-amendment-and-resume-recovery.json')
files += list((audit/'final-reaudit2-range-20261104').glob('*.json'))
files.append(pathlib.Path('data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/live-check-862bdec59a91.json'))
files += [audit/name for name in ['preflight-ancestry-proposal.patch','preflight-ancestry-workflow.log','preflight-ancestry-workers.log','preflight-ancestry-combined-initial.log','preflight-ancestry-pr-body.md','preflight-ancestry-independent-review.raw.txt']]
files += list((audit/'preflight-ancestry-release-ci').glob('*'))
# Full provider conversation dumps, credentials and private memory cleanup receipts
# remain excluded. Keep the compact replaced handoff as historical evidence.
archive=audit/'handoff-before-memory-standard-checkpoint-20261104.md'
if archive.exists():files.append(archive)
for folderName in ['final-reaudit3-calibration-20261104','final-reaudit3-artifact-recovery-20261105']:
 folder=audit/folderName
 invocation=json.loads((folder/'one-review-state.json').read_text());assert invocation['phase']=='terminal','Preserve active final-round source work'
 try:os.kill(invocation['pid'],0)
 except ProcessLookupError:pass
 else:raise RuntimeError('Final-round CLI PID still present; verify ownership before snapshot')
 files += list(folder.glob('*.json'));files.append(folder/'one-review.log')
files += [audit/'final-reaudit3-calibration-controller.log',audit/'final-reaudit3-artifact-recovery-controller.log']
files += list(audit.glob('handoff-before-*.md'))
live=pathlib.Path('data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/live-check-4064b02dc4d2.json')
if live.exists():files.append(live)
for folderName in ['second-final-reaudit3-calibration-20261105','second-final-reaudit3-artifact-recovery-20261105']:
 folder=audit/folderName
 invocation=json.loads((folder/'one-review-state.json').read_text());assert invocation['phase']=='terminal','Preserve active second final-round source work'
 try:os.kill(invocation['pid'],0)
 except ProcessLookupError:pass
 else:raise RuntimeError('Second final-round CLI PID still present; inspect ownership')
 files += list(folder.glob('*.json'));files.append(folder/'one-review.log')
files += [audit/name for name in ['finished-budget-red.log','finished-budget-regression.log','finished-budget-proposal.patch','finished-budget-independent-review.raw.txt','focused-source-editorial-review.raw.txt','finished-budget-pr-body.md']]
files += list((audit/'finished-budget-release-ci').glob('*'))
files += [audit/name for name in ['reviewed-editorial-prepare.log','reviewed-editorial-apply.log','reviewed-editorial-pr-body.md']]
files.append(audit/'current-jinshu-date-frontier-preflight.log')
files += list(audit.glob('pinned-registry-*.log'));files += list(audit.glob('pinned-registry-*.patch'));files += list(audit.glob('pinned-registry-*.raw.txt'));files.append(audit/'pinned-registry-pr-body.md')
for folder in [pathlib.Path('data/people/generated/completion/jinshu/093/pinned-dossiers-20261105'),pathlib.Path('data/people/generated/completion/jinshu/093/pinned-dossiers-reviewed-candidate-20261105')]: files += list(folder.glob('*.json'))
files.append(pathlib.Path('data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/live-check-8f2c7a77f87a.json'))
# Preserve the terminal real093 attempt and merged production evidence; never
# snapshot a live controller or include its full private provider conversation.
review=pathlib.Path('data/people/generated/completion/jinshu/093/pinned-dossiers-reviewed-candidate-20261105')
reviewState=json.loads((review/'independent-review/state.json').read_text())
assert reviewState['phase'] in ['stopped-preserve-handles','all-reports-recorded','research-blocked','budget-stopped']
try:os.kill(reviewState['pid'],0)
except ProcessLookupError:pass
else:raise RuntimeError('093 controller PID present; verify ownership before checkpoint')
files += [review/'run-independent-review.mjs'];files += list(review.glob('*.log'))
files += [q for q in (review/'independent-review').glob('*.json') if not q.name.endswith('.private.json')]
files += list((review/'independent-review').glob('*.jsonl'));files += list((review/'independent-review').glob('*-report.json'));files += list((review/'independent-review').glob('*-provider.raw.json'))
files += list((audit/'pinned-registry-release-ci').glob('*'))
verifiedLive=pathlib.Path('data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/live-check-3a078d6924f8.json')
if verifiedLive.exists():files.append(verifiedLive)
files += list(audit.glob('identity-review-context-bound-*.log'));files += list(audit.glob('identity-review-context-bound-*.patch'))
files += list(pathlib.Path('data/people/generated/completion/jinshu/093/bounded-independent-parts-eb9a-20261105').glob('*.json'))
current093=pathlib.Path('data/people/generated/completion/jinshu/093/bounded-independent-parts-eb9a-20261105')
for extension in ['mjs','txt','jsonl','log','md']:files += list(current093.glob('*.'+extension))
files += [pathlib.Path(p) for p in ['data/jinshu/093.json','data/people/extractions/jinshu/093.json','data/people/editorial-decisions/jinshu/093.json']]
files += [p for p in audit.glob('site-certification-single-pass-*') if p.is_file()]
files.append(audit/'host-completion-process-before-part-adoption-20261105.md')
files += list(audit.glob('identity-review-context-bound-*-prompt.txt'));files += list(audit.glob('identity-review-context-bound-*resources.jsonl'))
# Preserve the verified deployed release and current-source093 negative audit.
files += list((audit/'site-certification-single-pass-release-ci').glob('*.json'))
files += list(audit.glob('dossier-reuse-*.log'));files += list(audit.glob('dossier-reuse-*.patch'));files += list(audit.glob('dossier-reuse-*.txt'))
files.append(audit/'single-pass-production-observations.jsonl')
files.append(pathlib.Path('data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/live-check-a366058eaf47.json'))
for extension in ['json','mjs','txt','jsonl']:
 files += list((current093/'current-source-date-parts').glob('*.'+extension))
wf093=pathlib.Path('data/people/generated/date-workflow/jinshu/093')
files += [wf093/'state.json',wf093/'audit-0-3dc0994b6fe992d77786.json']
files += list(pathlib.Path('data/people/generated/date-workflow/jinshu/093.source-reconciled-913a94949591').glob('*.json'))
prepared109=pathlib.Path('data/people/generated/completion/jinshu/109/bounded-dossiers-parser-fixed-20261105')
if prepared109.exists():
 assert (prepared109/'preparation-receipt.json').exists(),'Preserve active109 preparation before snapshot'
 
 for extension in ['json','md','mjs','py','txt','log','patch']:files += list(prepared109.glob('*.'+extension))
 files += list((prepared109/'candidate-native-dossier-delta').glob('*.json'))
 for generation in ['native-proof-composition-candidate','native-proof-composition-final','native-proof-strict-author-journal']:files += list((prepared109/generation).glob('*.json'))
 # Independently reviewed amendments are canonical working inputs, still
 # incomplete and unapproved for dates/identity/publication. Preserve exact
 # bytes without touching the shared checkout's Git index or staged deletions.
 if (prepared109/'reviewed-amendments-application.json').exists():
  for chapter in ['108','109']:
   files += [pathlib.Path(p) for p in [f'data/jinshu/{chapter}.json',f'data/people/extractions/jinshu/{chapter}.json',f'data/people/editorial-decisions/jinshu/{chapter}.json']]
for extension in ['json','mjs','txt','jsonl']:files += list((prepared109/'current-source-date-parts').glob('*.'+extension))
files += list((prepared109/'combined-code-release-ci').glob('*.json'))
for folderName in ['paired-office-prepared','paired-office-prepared-preserve-facts','date-known-findings-draft']:files += list((prepared109/folderName).glob('*.json'))
for extension in ['json','mjs','txt','jsonl']:files += list((prepared109/'candidate-date-review-1-20261105').glob('*.'+extension))
files += list((prepared109/'candidate-date-review-1-20261105'/'native-repair-handoffs-round1').glob('*.json'))
for folder in (prepared109/'candidate-date-review-1-20261105').glob('reviewed-English-source-prepared*'):
 if folder.is_dir():files += list(folder.glob('*.json'))
files += list((prepared109/'candidate-date-review-1-20261105'/'reviewed-English-label-source-prepared-v4').glob('*.json'))
files += list((prepared109/'candidate-date-review-1-20261105'/'prospective-current-source-repair').glob('*.json'))
for folder in (prepared109/'candidate-date-review-1-20261105').glob('host-date-repair-group*'):
 if folder.is_dir():files += list(folder.glob('*.json'))
for folder in (prepared109/'candidate-date-review-1-20261105').glob('host-authored-repair-handoffs-round1*'):
 if folder.is_dir():files += list(folder.glob('*.json'))
files.append(prepared109/'candidate-date-review-1-20261105'/'reviewed-English-source-prepared-v3'/'date-input'/'jinshu'/'109.json')
files += list(pathlib.Path('data/people/generated/date-workflow/jinshu/109').glob('*.json'))
for folder in pathlib.Path('data/people/generated/date-workflow/jinshu').glob('109.english-label-source-*'):
 if folder.is_dir():files += list(folder.glob('*.json'))
files += list(pathlib.Path('data/people/generated/date-workflow/jinshu/109.stale-939c2e595e93dbf2804b').glob('*.json'))
files.append(pathlib.Path('data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/live-check-029c0b784aed.json'))
files.append(pathlib.Path('data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/live-check-c991cf12d80f.json'))
files.append(audit/'composed-identity-production-observations.jsonl')
files.append(pathlib.Path('data/people/generated/date-workflow/jinshu/109/state.json'))
files.append(pathlib.Path('data/people/generated/date-workflow/jinshu/109.stale-6dc9cbab2bd96a8c378b/state.json'))
files += list(pathlib.Path('data/people/generated/date-workflow/jinshu/109').glob('audit-0-*.json'))
files += list((audit/'dossier-reuse-release-ci').glob('*'));files += list(audit.glob('dossier-reuse-*.jsonl'));files.append(pathlib.Path('data/people/generated/completion/jinshu/053/bounded-dossiers-1f03-20261030/live-check-5a79118e3c66.json'))
files.append(audit/'handoff-before-semantic-reuse-diagnostic-20261105.md')
files.append(audit/'handoff-before-native-dossier-delta-20261105.md')
files.append(audit/'handoff-before-proof-composition-wip-20261105.md')
files.append(audit/'handoff-before-strict-author-journal-approved-20261105.md')
# Retained free-lane recovery and focused source proposals remain incomplete.
# Individual provider responses are replayable; full conversation snapshots stay private.
dateResearch=prepared109/'candidate-date-review-1-20261105'
for pattern in ['focused-date-research-20261105*','focused-date-research-v4-20261105','p112-label-source-closure-20261105']:
 for folder in dateResearch.glob(pattern):
  if folder.is_dir():files += list(folder.glob('*.json'))
for folder in audit.glob('free072-*'):
 if folder.is_dir():
  for extension in ['json','jsonl','txt','mjs']:
   files += [p for p in folder.glob('*.'+extension) if not p.name.endswith('.private.json')]
freeFix=audit/'free-date-record-ownership-fix-20261105'
for extension in ['json','mjs']:files += list(freeFix.glob('*.'+extension))
for extension in ['json','mjs','md','log','yml','txt']:
 files += list((audit/'free-date-record-ownership-pr-20261105').glob('*.'+extension))
for folder in (audit/'free-date-record-ownership-pr-20261105').glob('independent-free-code-review-*'):
 if folder.is_dir():
  for extension in ['json','log']:files += list(folder.glob('*.'+extension))
files += list((audit/'free-date-record-ownership-pr-20261105'/'ci-qualified-contribution').glob('*'))
files += list((audit/'free-date-record-ownership-pr-20261105'/'merged-qualified-contribution').glob('*'))
files += list((audit/'free-date-record-ownership-pr-20261105').glob('merged-deployment-*.jsonl'))
files += list((audit/'adopt109-v4-host-date-repairs-20261105').glob('*.json'))
files += list((audit/'adopt109-v4-host-date-repairs-20261105').glob('*.jsonl'))
for folder in dateResearch.glob('reviewed-research-English-source-prepared*'):
 if folder.is_dir():
  files += list(folder.glob('*.json'))
  files += list((folder/'date-input'/'jinshu').glob('109.json'))
for folder in dateResearch.glob('focused-date-research-current-source-*'):
 if folder.is_dir():
  for extension in ['json','mjs','txt','jsonl']:files += list(folder.glob('*.'+extension))
  files += list((folder/'full-claim-anchors-1').glob('*.json'))
for folder in pathlib.Path('data/people/generated/date-workflow/jinshu').glob('109.research-English-source-*'):
 if folder.is_dir():files += list(folder.glob('*.json'))
files.append(audit/'handoff-before-research-English-source-20261105.md')
files.append(audit/'free-date-record-ownership-proposal.patch')
wf072=pathlib.Path('data/people/generated/date-workflow/jinshu/072')
files += list(wf072.glob('*.json'))
tools072=wf072/'openrouter-tools-audit-0-4d9c64d727f54740b560'
files += list(tools072.glob('response-*.json'))
files=[p for p in files if not p.name.endswith('.private.json')]
files.append(base/'nov05-focused-research-and-free-calibration-metrics.json')
files=list(dict.fromkeys(files));blobs=[]
for p in files:
 data=p.read_bytes()
 if p.suffix=='.json':json.loads(data)
 blobs.append((p,data,hashlib.sha256(data).hexdigest(),hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()))
written=git('hash-object','-w','--stdin-paths',input=('\n'.join(p.as_posix() for p,data,digest,blob in blobs)+'\n').encode()).splitlines();assert written==[blob for p,data,digest,blob in blobs],'Selected file changed during capture; preserve state and retry only after ownership check'
with tempfile.TemporaryDirectory(prefix='people-recovery-index-') as temp:
 env=dict(os.environ,GIT_INDEX_FILE=str(pathlib.Path(temp)/'index'));git('read-tree',parent,env=env)
 git('update-index','--add','--index-info',input=''.join('100644 '+blob+'\t'+p.as_posix()+'\n' for p,data,digest,blob in blobs).encode(),env=env)
 tree=git('write-tree',env=env);changes=git('diff-tree','--no-commit-id','--name-only','-r',git('rev-parse',parent+'^{tree}'),tree).splitlines();assert set(changes)<=set(p.as_posix() for p in files)
 commit=git('commit-tree',tree,'-p',parent,input=('Checkpoint verified release and reviewed source, date and dossier reuse work; next chapters incomplete\n').encode());pendingTarget=base/(receiptName+'.pending.json');assert not pendingTarget.exists();pendingTarget.write_text(json.dumps({'parent':parent,'commit':commit,'branch':branch,'files':len(files),'chapterApproved':False},indent=2)+'\n');print(json.dumps({'pendingCommit':commit}),flush=True);git('push','--porcelain','origin',commit+':'+branch)
assert git('ls-remote','origin',branch).split()[0]==commit
verified=git('cat-file','--batch-check=%(objectname)',input=('\n'.join(commit+':'+p.as_posix() for p,data,digest,blob in blobs)+'\n').encode()).splitlines();assert verified==[blob for p,data,digest,blob in blobs]
receipt={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'branch':branch,'parent':parent,'commit':commit,'files':[{'path':p.as_posix(),'bytes':len(data),'sha256':digest} for p,data,digest,blob in blobs],'originalOctoberRawReportsNotPresentLocally':oldRawAbsent,'returnedOriginalAuditRanges':returned,'workflowPhase':state['phase'],'repairGroupsAccepted':sum(1 for key,job in state['jobs'].items() if key.startswith('repair-0-00') and job.get('status')=='returned'),'chapterApproved':False,'newPublishedChapters':0,'scope':'Exact selected incomplete canonical source work and recovery artifacts; all previous recovery tree entries preserved. Snapshot leaves the dirty primary index, source and staged deletions unchanged.'}
receiptName=os.environ['PEOPLE_CHECKPOINT_RECEIPT'];assert '/' not in receiptName and receiptName.endswith('.json');target=base/receiptName;assert not target.exists();target.write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps({'checkpoint':commit,'files':len(files),'bytes':sum(len(d) for p,d,h,b in blobs),'changedPaths':len(changes),'auditRanges':returned,'chapterApproved':False}))
