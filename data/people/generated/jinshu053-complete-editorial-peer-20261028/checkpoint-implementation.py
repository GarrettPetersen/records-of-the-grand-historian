from pathlib import Path
import subprocess,os,json,tempfile,hashlib
root=Path('/Users/garrettpetersen/records-of-the-grand-historian');job=root/'data/people/generated/jinshu053-complete-editorial-peer-20261028';parent='7f86bd10500d0b333bae7f7c9d0b447916aac149';branch='refs/heads/codex/people-glossary-staging-v2'
def git(args,**kw):return subprocess.check_output(['git',*args],cwd=root,**kw).decode().strip()
if git(['ls-remote','--heads','origin',branch]).split()[0]!=parent:raise RuntimeError('Staging advanced: reconcile without overwriting')
fd,index=tempfile.mkstemp(prefix='code-index-',dir=job);os.close(fd);os.unlink(index);env=dict(os.environ,GIT_INDEX_FILE=index)
try:
 git(['read-tree',parent],env=env);records=[]
 for f in ['scripts/lib/people-translation-repairs.mjs','scripts/self-test-people-source-name-retention.mjs']:
  data=(job/'implementation'/f).read_bytes();blob=git(['hash-object','-w','--stdin'],input=data);git(['update-index','--add','--cacheinfo',f'100644,{blob},{f}'],env=env);records.append({'path':f,'sha256':hashlib.sha256(data).hexdigest()})
 tree=git(['write-tree'],env=env);commit=git(['commit-tree',tree,'-p',parent],input=b'Preserve source-backed overlapping people across English editorial repairs\n');git(['push',f'--force-with-lease={branch}:{parent}','origin',f'{commit}:{branch}']);(job/'implementation-staging-receipt.json').write_text(json.dumps({'commit':commit,'parent':parent,'branch':branch,'files':records,'tests':'6offline assertions; actual053normal applier and source/extraction/editorial validation,73people retained','chapterPublication':False},indent=2)+'\n');print(json.dumps({'commit':commit,'files':2,'chapterPublication':False}))
finally:
 if os.path.exists(index):os.unlink(index)
