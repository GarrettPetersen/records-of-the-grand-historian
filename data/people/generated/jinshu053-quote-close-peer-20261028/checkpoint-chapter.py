from pathlib import Path
import subprocess,os,json,tempfile,hashlib
root=Path('/Users/garrettpetersen/records-of-the-grand-historian');job=root/'data/people/generated/jinshu053-quote-close-peer-20261028';parent='f9276870257a13fbd35af09fad465a46c4158f2d';branch='refs/heads/codex/people-glossary-staging-v2'
def git(args,**kw):return subprocess.check_output(['git',*args],cwd=root,**kw).decode().strip()
if git(['ls-remote','--heads','origin',branch]).split()[0]!=parent:raise RuntimeError('Staging advanced: reconcile without overwriting')
verification=json.loads((job/'verification.json').read_text());quotes=json.loads((job/'quote-verification.json').read_text());assert verification['summaries'][0]['people']==73 and verification['summaries'][0]['pendingRepairs']==0 and quotes['totalItems']==0
fd,index=tempfile.mkstemp(prefix='code-index-',dir=job);os.close(fd);os.unlink(index);env=dict(os.environ,GIT_INDEX_FILE=index)
try:
 git(['read-tree',parent],env=env);records=[]
 for f in ['data/jinshu/053.json','data/people/extractions/jinshu/053.json','data/people/editorial-decisions/jinshu/053.json']:
  data=(job/'outputs'/f).read_bytes();blob=git(['hash-object','-w','--stdin'],input=data);git(['update-index','--add','--cacheinfo',f'100644,{blob},{f}'],env=env);records.append({'path':f,'sha256':hashlib.sha256(data).hexdigest()})
 tree=git(['write-tree'],env=env);commit=git(['commit-tree',tree,'-p',parent],input=b'Apply full-source reviewed English corrections and quotation closure for Jinshu053\n');git(['push',f'--force-with-lease={branch}:{parent}','origin',f'{commit}:{branch}']);(job/'chapter-staging-receipt.json').write_text(json.dumps({'commit':commit,'parent':parent,'branch':branch,'files':records,'tests':'Normal source/extraction/applied editorial history validation; unchangedChinese;73people;0pendingrepairs;0publication quote problems; no translation artifacts','chapterPublication':False},indent=2)+'\n');print(json.dumps({'commit':commit,'files':3,'chapterPublication':False}))
finally:
 if os.path.exists(index):os.unlink(index)
