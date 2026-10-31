# Host-only application of the explicitly reviewed seven-path merge resolution.
import json,pathlib,subprocess,hashlib
R=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian');J=pathlib.Path(__file__).resolve().parent;STAGING='codex/people-glossary-staging-v2'
def git(*args,input=None):return subprocess.check_output(['git',*args],cwd=R,input=input).decode().strip()
receipt=J/'post-live-staging-reconciliation.json';assert not receipt.exists(),'Recover existing staging reconciliation'
a=json.loads((J/'live-chapter-acceptance-mention-repair.json').read_text());live=json.loads(pathlib.Path(a['liveVerification']).read_text());assert live['passed'] and live['people']==72
plan=json.loads((J/'staging-explicit-resolution.json').read_text());master=a['mergedRevision'];staging=plan['staging'];assert plan['master']==master and plan['treeExactlyMatchesIndependentlyReviewedCiMaster']
assert git('ls-remote','origin','refs/heads/master').split()[0]==master,'Master moved; reconcile explicitly'
assert git('ls-remote','origin','refs/heads/'+STAGING).split()[0]==staging,'Staging moved; preserve new work'
subprocess.run(['npm','run','people:disk:check'],cwd=R,check=True,stdout=subprocess.DEVNULL)
r=subprocess.run(['git','merge-tree','--write-tree',staging,master],cwd=R,capture_output=True,text=True);raw=(r.stdout+r.stderr).encode();assert r.returncode==1 and hashlib.sha256(raw).hexdigest()==plan['preflightMergeOutputSha256'],'Merge preflight changed; do not invent a resolution'
assert plan['resolvedTree']==git('rev-parse',master+'^{tree}'),'Resolution differs from exact independently verified live master'
changed=set(git('diff','--name-only',plan['conflictedMergeTree'],plan['resolvedTree']).splitlines());assert changed=={row['path'] for row in plan['resolvedPaths']},'Unreviewed merge changes'
for row in plan['resolvedPaths']:assert row['selectedBlob']==git('rev-parse',master+':'+row['path'])
commit=git('commit-tree',plan['resolvedTree'],'-p',staging,'-p',master,input=b'Synchronize verified Jinshu 053 dossier release; resolve superseded pair gates and fresh approvals\n')
assert git('ls-remote','origin','refs/heads/'+STAGING).split()[0]==staging,'Staging moved during reconciliation'
git('push','origin',commit+':refs/heads/'+STAGING);assert git('ls-remote','origin','refs/heads/'+STAGING).split()[0]==commit
receipt.write_text(json.dumps({'schemaVersion':1,'previousStaging':staging,'verifiedMaster':master,'newStaging':commit,'treeExactlyMatchesVerifiedLiveMaster':True,'bothHistoriesPreserved':True,'explicitResolution':'staging-explicit-resolution.json','rootIndexAndWorktreeUnchanged':True},indent=2)+'\n');print(receipt.read_text())
