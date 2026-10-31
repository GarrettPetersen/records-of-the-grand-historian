import os,json,pathlib,subprocess,tempfile,re,hashlib
R=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian');J=pathlib.Path(__file__).resolve().parent;PARENT='80472038726aac52c4c31ef419eeb1601c2acede';BRANCH='codex/people-recovery-20261025'
def git(*args,input=None,env=None):return subprocess.check_output(['git',*args],cwd=R,input=input,env=env).decode().strip()
subprocess.run(['npm','run','people:disk:check'],cwd=R,check=True,stdout=subprocess.DEVNULL)
assert json.loads((J/'measurement-state.json').read_text())['phase']=='finished'
assert git('ls-remote','origin','refs/heads/'+BRANCH).split()[0]==PARENT
files={}
for p in J.rglob('*'):
 if not p.is_file():continue
 rel=p.relative_to(J)
 if any(part in ['registry','registry-revision-1','__pycache__'] for part in rel.parts) or any(t in p.name for t in ['private','checkpoint-index-','.lock']) or p.name in ['checkpoint-recovery.log','checkpoint-integration.log']:continue
 files[str(p.relative_to(R))]=p.read_bytes()
secrets=[]
for line in (R/'.env').read_text().splitlines():
 m=re.match(r'^(?:export\s+)?(CURSOR_API_KEY|GROKBOT_MCP_AUTH_TOKEN|GITHUB_TOKEN|GH_TOKEN|PRODUCTION_CLOUDFLARE_API_TOKEN)\s*=\s*(.+)$',line)
 if m:
  value=m[2].strip().strip('\"\'')
  if len(value)>12:secrets.append(value.encode())
for name,b in files.items():assert not any(secret in b for secret in secrets),'Private data found; no checkpoint'
fd,name=tempfile.mkstemp(prefix='checkpoint-index-',dir=J);os.close(fd);os.unlink(name);env={**os.environ,'GIT_INDEX_FILE':name}
try:
 git('read-tree',PARENT,env=env)
 assert git('rev-parse','--show-object-format')=='sha1'
 entries=subprocess.check_output(['git','ls-tree','-r','-z',PARENT],cwd=R).split(b'\0')
 prior={row.split(b'\t',1)[1].decode():row.split(b'\t',1)[0].split()[2].decode() for row in entries if row}
 updates=[]
 for file,b in files.items():
  oid=hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
  if prior.get(file)==oid:continue
  assert git('hash-object','-w','--stdin',input=b)==oid
  updates.append(('100644 '+oid+'\t'+file).encode()+b'\0')
 assert updates,'No changed recovery artifacts'
 git('update-index','-z','--index-info',input=b''.join(updates),env=env)
 commit=git('commit-tree',git('write-tree',env=env),'-p',PARENT,input=b'Checkpoint independently approved Jinshu 053 mention repair and reviewed publication gate\n')
 (J/'prepared-recovery-publication.json').write_text(json.dumps({'commit':commit,'parent':PARENT,'files':len(files),'largeLocalStoresExcluded':True},indent=2)+'\n')
 git('push','origin',commit+':refs/heads/'+BRANCH);assert git('ls-remote','origin','refs/heads/'+BRANCH).split()[0]==commit
 (J/'recovery-publication-receipt.json').write_text(json.dumps({'commit':commit,'branch':BRANCH,'files':len(files),'productionAdopted':False,'canonicalStagingRevision':git('ls-remote','origin','refs/heads/codex/people-glossary-staging-v2').split()[0]},indent=2)+'\n')
 print(json.dumps({'recoveryCommit':commit,'files':len(files),'largeStoresLocalOnly':True,'productionAdopted':False}))
finally:pathlib.Path(name).unlink(missing_ok=True)
