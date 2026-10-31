import os,json,pathlib,subprocess,tempfile,hashlib
R=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian');J=pathlib.Path(__file__).resolve().parent;C=J/'mention-release-candidate';BASE='077d1875a81e22dd035f7e7fb855ca050a75dad1';BRANCH='codex/people-site-verification-speed-20261031'
def git(*args,input=None,env=None):return subprocess.check_output(['git',*args],cwd=R,input=input,env=env).decode().strip()
subprocess.run(['npm','run','people:disk:check'],cwd=R,check=True,stdout=subprocess.DEVNULL)
review=json.loads((J/'mention-gate-review-report.json').read_text());assert review['verdict']=='approve' and not review['findings']
proof=json.loads((J/'mention-coverage-repair-revision-1/native-repaired-proof-receipt.json').read_text());assert proof['nativeIdentityProofAccepted'] and proof['sourceCases']==72 and proof['localPeople']==73 and proof['uncertainCases']==63 and proof['dateStatus']['status']=='audited'
assert git('ls-remote','origin','refs/heads/'+BRANCH).split()[0]==BASE
assert git('ls-remote','origin','refs/heads/master').split()[0]=='1ba159d4984470aacb1b1869ba399d5be02bd34e'
files={str(p.relative_to(C)):p.read_bytes() for p in C.rglob('*') if p.is_file()};assert len(files)==6,sorted(files)
assert set(files)-{'scripts/compile-people-catalog.mjs','scripts/test-ebook-certified-people.mjs','data/people/extractions/jinshu/053.json','data/people/date-audits/jinshu/053.json','data/people/identity-reviews/jinshu/053.json'}=={proof['oldDateHistoryPath']}
fd,name=tempfile.mkstemp(prefix='mention-release-index-',dir=J);os.close(fd);os.unlink(name);env={**os.environ,'GIT_INDEX_FILE':name}
try:
 git('read-tree',BASE,env=env)
 for file,b in files.items():git('update-index','--add','--cacheinfo','100644,'+git('hash-object','-w','--stdin',input=b)+','+file,env=env)
 commit=git('commit-tree',git('write-tree',env=env),'-p',BASE,input=b'Fix Jinshu 053 father mentions and require source references for publication\n')
 receipt={'schemaVersion':1,'base':BASE,'branch':BRANCH,'commit':commit,'pr':5362,'files':[{'path':f,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()} for f,b in files.items()],'nativeProof':proof,'codeReview':review,'rootWorktreeUnchanged':True}
 (J/'mention-release-topic.json').write_text(json.dumps(receipt,indent=2)+'\n')
 git('push','origin',commit+':refs/heads/'+BRANCH)
 print(json.dumps({'commit':commit,'files':len(files),'pr':5362}))
finally:pathlib.Path(name).unlink(missing_ok=True)
