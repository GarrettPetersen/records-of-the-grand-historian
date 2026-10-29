import os,json,pathlib,hashlib,tempfile,subprocess
R=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian');J=pathlib.Path(__file__).resolve().parent
def git(*a,input=None,env=None):return subprocess.check_output(['git',*a],cwd=R,input=input,env=env).decode().strip()
def sha(b):return hashlib.sha256(b).hexdigest()
def commit(base,files,msg):
 fd,name=tempfile.mkstemp(prefix='rollout-index-',dir=J);os.close(fd);os.unlink(name);env={**os.environ,'GIT_INDEX_FILE':name}
 try:
  git('read-tree',base,env=env)
  for f,b in files.items():git('update-index','--add','--cacheinfo','100644,'+git('hash-object','-w','--stdin',input=b)+','+f,env=env)
  return git('commit-tree',git('write-tree',env=env),'-p',base,input=(msg+'\n').encode())
 finally:pathlib.Path(name).unlink(missing_ok=True)
assert json.loads((J/'code-ready.json').read_text())['approved'];assert 'ℹ pass 41' in (J/'final41-tests.log').read_text();subprocess.run(['npm','run','people:disk:check'],cwd=R,stdout=subprocess.DEVNULL,check=True)
receipt=json.loads((J/'code-publication-receipt.json').read_text());files={f:(J/'candidate'/f).read_bytes() for f in ['scripts/grokbot-mcp-server.mjs','scripts/grokbot-mcp-client.mjs','scripts/grokbot-headless-dispatch.mjs','scripts/lib/grokbot-dispatch-work.mjs','scripts/test-grokbot-review-store.mjs','scripts/test-grokbot-dispatch-work.mjs']}
proof={'schemaVersion':1,'independentApproval':json.loads((J/'code-ready.json').read_text()),'independentReviewerState':json.loads((J/'code-ready-state.json').read_text()),'hostFinalAcceptance':json.loads((J/'host-code-review-triage.json').read_text()),'finalFiles':{f:sha(b) for f,b in files.items()},'tests':{'passed':41,'logSha256':sha((J/'final41-tests.log').read_bytes())},'serverVersion':'1.1.0','client':json.loads((J/'public-client-pin.json').read_text()),'qualityAndPublicationGatesUnchanged':True,'grokInferenceDispatched':False}
files['research/people/process-reviews/grokbot-sealed-review-rollout-20261029.json']=(json.dumps(proof,ensure_ascii=False,indent=2)+'\n').encode();results={}
for branch,parent in [('codex/people-glossary-staging-v2',receipt['stagingCommit']),(receipt['releaseBranch'],receipt['releaseCommit'])]:
 assert git('ls-remote','origin','refs/heads/'+branch).split()[0]==parent
 c=commit(parent,files,'Guard GrokBot review rollout against old servers and stale public clients');git('push','origin',c+':refs/heads/'+branch,'--force-with-lease=refs/heads/'+branch+':'+parent);results[branch]=c
(J/'rollout-publication-receipt.json').write_text(json.dumps(results,indent=2)+'\n');print(json.dumps(results))
