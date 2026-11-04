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
 commit=git('commit-tree',tree,'-p',parent,input=('Checkpoint retained Jinshu080 reviews and validated pending repairs; chapter unapproved\n').encode());pendingTarget=base/(receiptName+'.pending.json');assert not pendingTarget.exists();pendingTarget.write_text(json.dumps({'parent':parent,'commit':commit,'branch':branch,'files':len(files),'chapterApproved':False},indent=2)+'\n');print(json.dumps({'pendingCommit':commit}),flush=True);git('push','--porcelain','origin',commit+':'+branch)
assert git('ls-remote','origin',branch).split()[0]==commit
verified=git('cat-file','--batch-check=%(objectname)',input=('\n'.join(commit+':'+p.as_posix() for p,data,digest,blob in blobs)+'\n').encode()).splitlines();assert verified==[blob for p,data,digest,blob in blobs]
receipt={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'branch':branch,'parent':parent,'commit':commit,'files':[{'path':p.as_posix(),'bytes':len(data),'sha256':digest} for p,data,digest,blob in blobs],'originalOctoberRawReportsNotPresentLocally':oldRawAbsent,'returnedOriginalAuditRanges':returned,'workflowPhase':state['phase'],'repairGroupsAccepted':sum(1 for key,job in state['jobs'].items() if key.startswith('repair-0-00') and job.get('status')=='returned'),'chapterApproved':False,'newPublishedChapters':0,'scope':'Selected recovery artifacts only; all previous recovery tree entries preserved. Dirty primary index and canonical source unchanged.'}
receiptName=os.environ['PEOPLE_CHECKPOINT_RECEIPT'];assert '/' not in receiptName and receiptName.endswith('.json');target=base/receiptName;assert not target.exists();target.write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps({'checkpoint':commit,'files':len(files),'bytes':sum(len(d) for p,d,h,b in blobs),'changedPaths':len(changes),'auditRanges':returned,'chapterApproved':False}))
