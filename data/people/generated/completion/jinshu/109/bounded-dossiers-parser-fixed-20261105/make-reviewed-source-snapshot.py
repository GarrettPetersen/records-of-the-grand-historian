import datetime,hashlib,json,os,pathlib,subprocess,tempfile

root=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian')
out=pathlib.Path(__file__).resolve().parent
base='5a79118e3c66f6b01ff39b242091a93ae1fc207c'
ref='refs/heads/codex/people-109-reviewed-source-20261105'
def git(*args,input=None,env=None):
 return subprocess.run(['git','-C',str(root),*args],input=input,env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stdout.decode().strip()
guard=subprocess.run(['npm','run','people:disk:check'],cwd=root,capture_output=True,text=True,check=True)
assert not json.loads(guard.stdout[guard.stdout.index('{'):])['errors']
index=root/'.git/index';before=hashlib.sha256(index.read_bytes()).hexdigest()
manifest=json.loads((out/'reviewed-amendments-manifest.json').read_text());files=[]
for chapter in manifest['chapters']:
 for kind,output in chapter['outputs'].items():
  file=chapter['inputs'][kind]['path'];p=root/file;assert p.is_file() and not p.is_symlink()
  data=p.read_bytes();assert hashlib.sha256(data).hexdigest()==output['sha256'],file
  files.append({'path':file,'sha256':output['sha256'],'blob':git('hash-object','-w','--stdin',input=data)})
date='data/people/date-audits/jinshu/109.json'
assert not (root/date).exists(),'Preserve unexpected current date report'
assert git('diff','--cached','--name-status','--',date)=='D\t'+date,'Expected preexisting staged deletion'
with tempfile.TemporaryDirectory(prefix='people-source-snapshot-index-') as temp:
 env=dict(os.environ,GIT_INDEX_FILE=str(pathlib.Path(temp)/'index'))
 git('read-tree',base,env=env)
 for row in files:git('update-index','--add','--cacheinfo','100644',row['blob'],row['path'],env=env)
 git('update-index','--force-remove',date,env=env)
 tree=git('write-tree',env=env)
 existing=subprocess.run(['git','-C',str(root),'rev-parse','--verify',ref],capture_output=True,text=True)
 if existing.returncode==0:
  commit=existing.stdout.strip();assert git('rev-parse',commit+'^{tree}')==tree,'Retained source snapshot changed'
 else:
  commit=git('commit-tree',tree,'-p',base,input=b'Preserve independently reviewed Jinshu108/109 source corrections (incomplete chapter)\n')
  git('update-ref',ref,commit,'0'*40)
assert hashlib.sha256(index.read_bytes()).hexdigest()==before,'Primary shared index changed'
receipt={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'kind':'reviewed-incomplete-source-snapshot','revision':commit,'parent':base,'ref':ref,'files':files,'dateReportAbsent':date,'primaryIndexUnchanged':True,'canonicalWrites':0,'chapterApproved':False,'published':False}
(out/'reviewed-source-snapshot.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps({'revision':commit,'files':len(files),'primaryIndexUnchanged':True,'chapterApproved':False}))
