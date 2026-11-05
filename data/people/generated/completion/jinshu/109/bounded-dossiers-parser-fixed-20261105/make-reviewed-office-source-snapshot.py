import datetime,hashlib,json,os,pathlib,subprocess,tempfile
root=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian');out=pathlib.Path(__file__).resolve().parent
base='029c0b784aede1067fda4c808c7cbedc2d11c20c';ref='refs/heads/codex/people-109-reviewed-offices-20261105'
def git(*args,input=None,env=None):return subprocess.run(['git','-C',str(root),*args],input=input,env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stdout.decode().strip()
g=subprocess.run(['npm','run','people:disk:check'],cwd=root,capture_output=True,text=True,check=True);assert not json.loads(g.stdout[g.stdout.index('{'):])['errors']
assert not(out/'reviewed-office-source-snapshot.json').exists();index=root/'.git/index';indexHash=hashlib.sha256(index.read_bytes()).hexdigest();files=[]
old=json.loads((out/'reviewed-amendments-manifest.json').read_text());office=json.loads((out/'paired-office-prepared-preserve-facts/manifest.json').read_text())
for ch in old['chapters']:
 if ch['chapter']!='108':continue
 for kind,output in ch['outputs'].items():files.append({'path':ch['inputs'][kind]['path'],'sha256':output['sha256']})
for row in office['files'].values():files.append({'path':row['path'],'sha256':row['afterSha256']})
assert len(files)==6
for row in files:
 p=root/row['path'];assert p.is_file() and not p.is_symlink();data=p.read_bytes();assert hashlib.sha256(data).hexdigest()==row['sha256'];row['blob']=git('hash-object','-w','--stdin',input=data)
date='data/people/date-audits/jinshu/109.json';assert not(root/date).exists();assert git('diff','--cached','--name-status','--',date)=='D\t'+date
assert subprocess.run(['git','-C',str(root),'rev-parse','--verify',ref],capture_output=True).returncode!=0,'Preserve existing source snapshot'
with tempfile.TemporaryDirectory(prefix='people-office-source-index-')as temp:
 env=dict(os.environ,GIT_INDEX_FILE=str(pathlib.Path(temp)/'index'));git('read-tree',base,env=env)
 for row in files:git('update-index','--add','--cacheinfo','100644',row['blob'],row['path'],env=env)
 git('update-index','--force-remove',date,env=env);tree=git('write-tree',env=env);commit=git('commit-tree',tree,'-p',base,input=b'Preserve reviewed paired-office source corrections; chronology and chapter remain incomplete\n');git('update-ref',ref,commit,'0'*40)
assert hashlib.sha256(index.read_bytes()).hexdigest()==indexHash
receipt={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'kind':'reviewed-incomplete-source-snapshot','revision':commit,'parent':base,'ref':ref,'files':files,'dateReportAbsent':date,'primaryIndexUnchanged':True,'pairedEnglishApplication':'paired-office-application.json','dateCandidateApplied':False,'canonicalWrites':0,'chapterApproved':False,'published':False}
(out/'reviewed-office-source-snapshot.json').write_text(json.dumps(receipt,indent=2)+'\n');git('push','origin',commit+':'+ref);assert git('ls-remote','origin',ref).split()[0]==commit
print(json.dumps({'revision':commit,'files':len(files),'primaryIndexUnchanged':True,'remoteRefVerified':True,'chapterApproved':False}))
