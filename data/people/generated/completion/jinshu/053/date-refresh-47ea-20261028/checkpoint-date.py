from pathlib import Path
import subprocess,os,json,tempfile,hashlib
root=Path('/Users/garrettpetersen/records-of-the-grand-historian');job=Path(__file__).resolve().parent;runtime=Path('/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical');parent='47ea6132b6728af4b14360a5a7f4ac9139c2afd2';branch='refs/heads/codex/people-glossary-staging-v2'
def git(args,**kw):return subprocess.check_output(['git',*args],cwd=root,**kw).decode().strip()
assert json.loads((job/'date-verification.json').read_text())['chapters'][0]['status']=='audited'
assert json.loads((job/'invocation-recovery.json').read_text())['exitCode']==0
if git(['ls-remote','--heads','origin',branch]).split()[0]!=parent:raise RuntimeError('Staging advanced: reconcile without overwriting')
fd,index=tempfile.mkstemp(prefix='date-index-',dir=job);os.close(fd);os.unlink(index);env=dict(os.environ,GIT_INDEX_FILE=index)
try:
 git(['read-tree',parent],env=env);records=[]
 for f in json.loads((job/'date-checkpoint-files.json').read_text())['files']:
  src=job/'checkpoint'/f if f.startswith('research/') else runtime/f
  data=src.read_bytes();blob=git(['hash-object','-w','--stdin'],input=data);git(['update-index','--add','--cacheinfo',f'100644,{blob},{f}'],env=env);records.append({'path':f,'sha256':hashlib.sha256(data).hexdigest()})
 tree=git(['write-tree'],env=env);commit=git(['commit-tree',tree,'-p',parent],input=b'Record current independent chronology approval for reviewed Jinshu053\n');git(['push',f'--force-with-lease={branch}:{parent}','origin',f'{commit}:{branch}']);(job/'date-staging-receipt.json').write_text(json.dumps({'commit':commit,'parent':parent,'branch':branch,'files':records,'newlyCurrentDateApprovedChapters':1,'newlyCompleteNonemptyChapters':0,'newlyPublishedNonemptyChapters':0},indent=2)+'\n');print(json.dumps({'commit':commit,'files':len(records),'dateApprovalCurrent':True,'chapterComplete':False}))
finally:
 if os.path.exists(index):os.unlink(index)
