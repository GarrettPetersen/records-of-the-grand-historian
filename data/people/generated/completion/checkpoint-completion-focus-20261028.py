from pathlib import Path
import subprocess, os, json, hashlib, tempfile
root=Path('/Users/garrettpetersen/records-of-the-grand-historian')
branch='refs/heads/codex/people-recovery-20261025'
parent='fe0863c09188ac17ea7c513eb7155c404f6231cc'
def git(args, **kw):
    return subprocess.check_output(['git',*args],cwd=root,**kw).decode().strip()
actual=git(['ls-remote','--heads','origin',branch]).split()[0]
if actual!=parent: raise RuntimeError('Recovery branch advanced: reconcile instead of overwriting')
roots=[root/'data/people/generated/jinshu053-quote-close-peer-20261028',root/'data/people/generated/jinshu053-final-fidelity-20261028',root/'data/people/generated/jinshu053-complete-editorial-peer-20261028',root/'data/people/generated/completion/jinshu-ranking-7f86bd10500d-20261028']
files=[p for d in roots for p in d.rglob('*') if p.is_file() and p.suffix in {'.json','.mjs','.txt','.jsonl','.log','.py'} and not p.name.endswith('.tmp')]
files += [root/'data/people/generated/completion/handoff-20261028-completion-focus.json',root/'data/people/generated/completion/jinshu/053/work-order-20261028.json',Path(__file__).resolve()]
if len(files)!=len(set(files)): raise RuntimeError('Duplicate recovery file')
fd,index=tempfile.mkstemp(prefix='people-completion-index-',dir=root/'data/people/generated/completion');os.close(fd);os.unlink(index)
env=dict(os.environ,GIT_INDEX_FILE=index)
try:
    git(['read-tree',parent],env=env)
    records=[]
    for p in sorted(files):
        data=p.read_bytes(); rel=str(p.relative_to(root)); blob=git(['hash-object','-w','--stdin'],input=data)
        git(['update-index','--add','--cacheinfo',f'100644,{blob},{rel}'],env=env)
        records.append({'path':rel,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)})
    tree=git(['write-tree'],env=env)
    commit=git(['commit-tree',tree,'-p',parent],input=b'Preserve completion-first053 independent review and current finite identity scope\n')
    git(['push',f'--force-with-lease={branch}:{parent}','origin',f'{commit}:{branch}'])
    receipt={'commit':commit,'parent':parent,'branch':branch,'files':records,'status':'recovery-only; no chapter publication or approval granted'}
    out=root/'data/people/generated/completion/recovery-completion-focus-20261028.json';out.write_text(json.dumps(receipt,indent=2)+'\n')
    print(json.dumps({'commit':commit,'files':len(files),'bytes':sum(x['bytes'] for x in records),'recoveryOnly':True}))
finally:
    if os.path.exists(index): os.unlink(index)
