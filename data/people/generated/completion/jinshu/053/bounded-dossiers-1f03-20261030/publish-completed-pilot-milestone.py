import os,json,pathlib,subprocess,tempfile,hashlib,re
R=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian');J=pathlib.Path(__file__).resolve().parent;C=J/'completion-milestone-candidate';BRANCH='codex/people-glossary-staging-v2';BASE='e92763680be3a16694db9f531e131dc0a23f1c5e';MASTER='b26f20aae583d22a90abb2bb48bd04c05e794fa5'
def git(*a,input=None,env=None):return subprocess.check_output(['git',*a],cwd=R,input=input,env=env).decode().strip()
subprocess.run(['npm','run','people:disk:check'],cwd=R,check=True,stdout=subprocess.DEVNULL)
assert git('ls-remote','origin','refs/heads/'+BRANCH).split()[0]==BASE,'Staging moved; preserve new work'
assert git('ls-remote','origin','refs/heads/master').split()[0]==MASTER,'Master moved; relabel evidence explicitly'
acceptance=json.loads((C/'research/people/checkpoints/jinshu053-live-acceptance-20261031/acceptance.json').read_text());assert acceptance['mergedRevision']==MASTER and acceptance['publishedPeople']==72
files={str(p.relative_to(C)):p.read_bytes() for p in C.rglob('*') if p.is_file()};assert len(files)==14
assert all(f in ['AGENTS.md','PEOPLE_COMPLETION_PROCESS.md','PEOPLE_ONE_HOUR_WORKFLOW.md'] or f.startswith('research/people/checkpoints/jinshu053-live-acceptance-20261031/') for f in files)
secrets=[]
for line in (R/'.env').read_text().splitlines():
 m=re.match(r'^(?:export\s+)?(?:CURSOR_API_KEY|GROKBOT_MCP_AUTH_TOKEN|GITHUB_TOKEN|GH_TOKEN|PRODUCTION_CLOUDFLARE_API_TOKEN)\s*=\s*(.+)$',line)
 if m:
  value=m[1].strip().strip('\"\'')
  if len(value)>12:secrets.append(value.encode())
for f,b in files.items():assert not any(v in b for v in secrets),'Private value found; do not publish'
fd,p=tempfile.mkstemp(prefix='completed-pilot-index-',dir=J);os.close(fd);os.unlink(p);env={**os.environ,'GIT_INDEX_FILE':p}
try:
 git('read-tree',BASE,env=env);updates=[]
 for f,b in files.items():updates.append(('100644 '+git('hash-object','-w','--stdin',input=b)+'\t'+f).encode()+b'\0')
 git('update-index','-z','--index-info',input=b''.join(updates),env=env)
 commit=git('commit-tree',git('write-tree',env=env),'-p',BASE,input=b'Record first verified nonempty people chapter and measured completion process\n')
 receipt={'schemaVersion':1,'parent':BASE,'commit':commit,'branch':BRANCH,'verifiedLiveMaster':MASTER,'files':[{'path':f,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()} for f,b in files.items()],'productionPersonInputsChanged':False,'rootWorktreeAndIndexUnchanged':True,'goalComplete':False}
 (J/'prepared-completed-pilot-milestone.json').write_text(json.dumps(receipt,indent=2)+'\n');git('push','origin',commit+':refs/heads/'+BRANCH);assert git('ls-remote','origin','refs/heads/'+BRANCH).split()[0]==commit;(J/'completed-pilot-milestone-publication.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps({'staging':commit,'files':len(files),'livePublishedNonemptyChapters':1,'wholeGoalComplete':False}))
finally:pathlib.Path(p).unlink(missing_ok=True)
