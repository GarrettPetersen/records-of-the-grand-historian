import os,json,pathlib,hashlib,subprocess,time,urllib.request
R=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian');J=pathlib.Path(__file__).resolve().parent;S=pathlib.Path('/Users/garrettpetersen/.local/share/24histories-grokbot-mcp/repo')
def sha(b):return hashlib.sha256(b).hexdigest()
def save(x):(J/'service-deployment-receipt.json').write_text(json.dumps(x,indent=2)+'\n')
def guard():subprocess.run(['npm','run','people:disk:check'],cwd=R,stdout=subprocess.DEVNULL,check=True)
def idle():
 p=subprocess.run(['pgrep','-f',str(S/'scripts/grokbot-mcp-operation-worker.mjs')],capture_output=True,text=True)
 if p.returncode==0:raise RuntimeError('MCP operation is currently active; preserve it and deploy only at idle boundary')
 if p.returncode!=1:raise RuntimeError('Cannot measure live MCP operations')
assert json.loads((J/'code-ready.json').read_text())['approved'];assert 'ℹ pass 41' in (J/'final41-tests.log').read_text();guard();idle()
backup=json.loads((J/'service-backup-receipt.json').read_text());files={}
for row in backup['files']:
 f=row['file'];p=S/f
 if row['existed']:assert sha(p.read_bytes())==row['beforeSha256'],'Service source changed after preservation; inspect owner'
 else:assert not p.exists(),'New service source appeared; inspect owner'
 files[f]=subprocess.check_output(['git','show','966eecf6d00d0f14c72b46d94aff65f2790810e7:'+f],cwd=R) if f=='scripts/lib/process-run-lock.mjs' else (J/'candidate'/f).read_bytes()
receipt={'phase':'updating-reviewed-code','files':{f:sha(b) for f,b in files.items()},'existingRuntimePreserved':True,'schemasDataClaimsRecoveryAndGitIndexUntouched':True,'backup':'service-code-backup (local-only, no credentials)','inferenceDispatched':False};save(receipt)
for f,b in files.items():
 p=S/f;tmp=p.with_name('.'+p.name+'.review-transport-'+str(os.getpid())+'.tmp');tmp.write_bytes(b);tmp.chmod(0o644);os.replace(tmp,p)
idle();guard();subprocess.run(['launchctl','kickstart','-k',f'gui/{os.getuid()}/com.24histories.grokbot-mcp'],check=True,capture_output=True)
deadline=time.time()+30;last=None
while time.time()<deadline:
 try:
  with urllib.request.urlopen('https://grokbot-mcp.24histories.com/health',timeout=5) as r:health=json.load(r)
  if health.get('ok') and health.get('version')=='1.1.0':break
 except Exception as e:last=type(e).__name__
 time.sleep(1)
else:raise RuntimeError('Updated MCP service not confirmed healthy; preserve files and inspect service, last observation '+str(last))
request=urllib.request.Request('https://grokbot-mcp.24histories.com/grokbot-mcp-client.mjs',headers={'Cache-Control':'no-cache'})
with urllib.request.urlopen(request,timeout=15) as response:client=response.read(128*1024+1)
assert len(client)<=128*1024 and sha(client)==receipt['files']['scripts/grokbot-mcp-client.mjs'],'Public client mismatch; do not dispatch inference'
receipt.update({'phase':'healthy-reviewed-service','health':health,'publicClientSha256':sha(client),'publicClientMatches':True,'inferenceDispatched':False});save(receipt);guard();print(json.dumps({'deployed':True,'version':'1.1.0','publicClientMatches':True,'inferenceDispatched':False}))
