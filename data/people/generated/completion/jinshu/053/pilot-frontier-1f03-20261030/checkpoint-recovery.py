import os,json,pathlib,subprocess,tempfile,hashlib,re
R=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian');J=pathlib.Path(__file__).resolve().parent;PARENT='0e4fa7b53e252229dae27fd1c62ebd468a81c0f2';BRANCH='codex/people-recovery-20261025'
def git(*args,input=None,env=None):return subprocess.check_output(['git',*args],cwd=R,input=input,env=env).decode().strip()
subprocess.run(['npm','run','people:disk:check'],cwd=R,check=True,stdout=subprocess.DEVNULL);assert git('ls-remote','origin','refs/heads/'+BRANCH).split()[0]==PARENT
files={}
for root in [J,J.parent/'editorial-grok14-1f03-20261030']:
 for p in root.rglob('*'):
  if p.is_file() and '__pycache__' not in p.parts and not any(t in p.name for t in ['.lock','checkpoint-index-','private','probe-']) and p.name!='checkpoint-recovery.log':files[str(p.relative_to(R))]=p.read_bytes()
T=J.parent/'grok-review-transport-966e-20261029'
for name in ['HANDOFF-SIGNEDIN-20261030.md','real-review-returned-report.json','real-review-host-validation.json','real-review-editorial-application-work-order.json','real-review-dispatch-receipt.json','real-review-transport-receipt.json','real-review-observer-state.json','real-review-resource-samples.jsonl','observe-real-review.mjs','observe-real-review.log','validate-real-review.mjs','validate-real-review.log','validate-real-review-paired-shape-rejected.log','dispatch-signedin-20261030.log','pre-signedin-dispatch-guard.json','pre-editorial-application-guard.json']:
 p=T/name;files[str(p.relative_to(R))]=p.read_bytes()
secrets=[]
for p in T.glob('private-dispatch-ticket*.json'):
 for j in json.loads(p.read_text()).get('jobs',[]):
  if j.get('claimToken'):secrets.append(j['claimToken'].encode())
for line in (R/'.env').read_text().splitlines():
 m=re.match(r'^(?:export\s+)?(CURSOR_API_KEY|GROKBOT_MCP_AUTH_TOKEN|GITHUB_TOKEN|GH_TOKEN)\s*=\s*(.+)$',line)
 if m:
  value=m[2].strip().strip('\"\'')
  if len(value)>12:secrets.append(value.encode())
for name,b in files.items():assert not any(secret in b for secret in secrets),'Private data detected; stop checkpoint'
fd,name=tempfile.mkstemp(prefix='checkpoint-index-',dir=J);os.close(fd);os.unlink(name);env={**os.environ,'GIT_INDEX_FILE':name}
try:
 git('read-tree',PARENT,env=env)
 for file,b in files.items():git('update-index','--add','--cacheinfo','100644,'+git('hash-object','-w','--stdin',input=b)+','+file,env=env)
 commit=git('commit-tree',git('write-tree',env=env),'-p',PARENT,input=b'Preserve independent Grok review and canonical dossier pilot diagnosis\n')
 (J/'prepared-recovery-publication.json').write_text(json.dumps({'parent':PARENT,'commit':commit,'files':len(files)},indent=2)+'\n');git('push','origin',commit+':refs/heads/'+BRANCH);assert git('ls-remote','origin','refs/heads/'+BRANCH).split()[0]==commit
 (J/'recovery-publication-receipt.json').write_text(json.dumps({'commit':commit,'branch':BRANCH,'files':len(files),'noCanonicalSourceOrValidatorChanges':True,'stagingRemains':'1f031602cf7aa15090b26ec997097d46dd2ef09f'},indent=2)+'\n');print(json.dumps({'recoveryCommit':commit,'files':len(files),'stagingUnchanged':True}))
finally:pathlib.Path(name).unlink(missing_ok=True)
