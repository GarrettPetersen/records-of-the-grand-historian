# Host-only, after the exact release has passed all live acceptance checks.
import os,json,pathlib,subprocess
R=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian');J=pathlib.Path(__file__).resolve().parent;STAGING='codex/people-glossary-staging-v2'
def git(*args,input=None):return subprocess.check_output(['git',*args],cwd=R,input=input).decode().strip()
receipt=J/'post-live-staging-reconciliation.json';assert not receipt.exists(),'Recover existing staging reconciliation rather than repeating it'
acceptance=json.loads((J/'live-chapter-acceptance-mention-repair.json').read_text());live=json.loads(pathlib.Path(acceptance['liveVerification']).read_text());assert live['passed'] and live['people']==72
master=acceptance['mergedRevision'];assert git('ls-remote','origin','refs/heads/master').split()[0]==master,'Master moved; reconcile explicitly'
staging=git('ls-remote','origin','refs/heads/'+STAGING).split()[0];assert staging=='1f031602cf7aa15090b26ec997097d46dd2ef09f','Staging moved; preserve new work'
subprocess.run(['npm','run','people:disk:check'],cwd=R,check=True,stdout=subprocess.DEVNULL)
subprocess.run(['git','fetch','origin',master,staging],cwd=R,check=True,stdout=subprocess.DEVNULL)
result=subprocess.run(['git','merge-tree','--write-tree',staging,master],cwd=R,capture_output=True,text=True)
(J/'post-live-staging-merge-tree.txt').write_text(result.stdout+result.stderr);assert result.returncode==0,'Staging merge needs explicit review; do not overwrite or drop its work'
tree=result.stdout.strip();assert tree==git('rev-parse',master+'^{tree}'),'Merged staging content differs from independently verified live master; preserve and review'
commit=git('commit-tree',tree,'-p',staging,'-p',master,input=b'Synchronize verified Jinshu 053 bounded dossier release with staging\n')
assert git('ls-remote','origin','refs/heads/'+STAGING).split()[0]==staging,'Staging moved during reconciliation'
git('push','origin',commit+':refs/heads/'+STAGING)
receipt.write_text(json.dumps({'schemaVersion':1,'previousStaging':staging,'verifiedMaster':master,'newStaging':commit,'treeExactlyMatchesVerifiedLiveMaster':True,'bothHistoriesPreserved':True,'rootIndexAndWorktreeUnchanged':True},indent=2)+'\n');print(receipt.read_text())
