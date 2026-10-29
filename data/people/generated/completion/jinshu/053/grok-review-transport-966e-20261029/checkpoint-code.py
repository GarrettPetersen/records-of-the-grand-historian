import os,json,pathlib,hashlib,tempfile,subprocess
R=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian');J=pathlib.Path(__file__).resolve().parent
STAGING='966eecf6d00d0f14c72b46d94aff65f2790810e7';MASTER='1bbd68dd41f565c0153c60a0a86b6e569ac40041'
def git(*a,input=None,env=None):return subprocess.check_output(['git',*a],cwd=R,input=input,env=env).decode().strip()
def read(n):return json.loads((J/n).read_text())
def save(n,x):(J/n).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(b):return hashlib.sha256(b).hexdigest()
def guard():subprocess.run(['npm','run','people:disk:check'],cwd=R,check=True,stdout=subprocess.DEVNULL)
def commit(base,files,message):
 fd,name=tempfile.mkstemp(prefix='code-index-',dir=J);os.close(fd);os.unlink(name);env={**os.environ,'GIT_INDEX_FILE':name}
 try:
  git('read-tree',base,env=env)
  for f,b in files.items():git('update-index','--add','--cacheinfo','100644,'+git('hash-object','-w','--stdin',input=b)+','+f,env=env)
  return git('commit-tree',git('write-tree',env=env),'-p',base,input=(message+'\n').encode())
 finally:pathlib.Path(name).unlink(missing_ok=True)
guard();assert read('code-fix.json')['approved'];assert 'ℹ pass 39' in (J/'final-verified-tests.log').read_text();assert '"passed":true' in (J/'service-preview.log').read_text()
files={}
for p in (J/'candidate').rglob('*'):
 if not p.is_file():continue
 f=str(p.relative_to(J/'candidate'));old=subprocess.run(['git','show',STAGING+':'+f],cwd=R,capture_output=True)
 if old.returncode or old.stdout!=p.read_bytes():files[f]=p.read_bytes()
codeFiles={f:sha(b) for f,b in files.items()}
review=read('code-fix.json');proof={'schemaVersion':1,'purpose':'GrokBot downstream review artifact transport; no canonical quality acceptance','inputRevision':STAGING,'files':codeFiles,'independentReview':review,'reviewerState':read('code-fix-state.json'),'hostTriage':read('host-code-review-triage.json'),'offlineTests':{'passed':39,'logSha256':sha((J/'final-verified-tests.log').read_bytes())},'serviceDependencyPreview':{'passed':True,'logSha256':sha((J/'service-preview.log').read_bytes()),'productionDataChanged':False},'operations':['resume_or_claim','get_chunk','submit_chunk','finalize_chapter','worker_status'],'chapter053':{'unresolvedPairs':572,'sourceEditorialDateInputsUnchanged':True,'qualified':False,'published':False},'deployment':'pending controlled existing-runtime update; no inference dispatched yet','recoveryBranch':'codex/people-recovery-20261025'}
files['research/people/process-reviews/grokbot-sealed-review-transport-20261029.json']=(json.dumps(proof,ensure_ascii=False,indent=2)+'\n').encode()
branch='codex/people-glossary-staging-v2';assert git('ls-remote','origin','refs/heads/'+branch).split()[0]==STAGING
c=commit(STAGING,files,'Enable sealed GrokBot downstream review reports with host-owned acceptance');git('push','origin',c+':refs/heads/'+branch,'--force-with-lease=refs/heads/'+branch+':'+STAGING)
# Release only the necessary code and process dependencies, with targeted npm-script
# edits against master's package, preserving all other current master commands.
release=dict(files);p=git('show',MASTER+':package.json')+'\n'
old='"people:grokbot:mcp:self-test": "node --test scripts/test-grokbot-mcp-server.mjs",';assert old in p
p=p.replace(old,'"people:grokbot:mcp:self-test": "node --test --test-concurrency=1 scripts/test-grokbot-mcp-server.mjs scripts/test-grokbot-review-store.mjs",\n    "people:grokbot:review-jobs": "node scripts/grokbot-review-jobs.mjs",')
old='"people:grokbot:headless:self-test": "node --test scripts/test-grokbot-headless-dispatch.mjs"';assert old in p;p=p.replace(old,'"people:grokbot:headless:self-test": "node --test scripts/test-grokbot-headless-dispatch.mjs scripts/test-grokbot-dispatch-work.mjs"')
release['package.json']=p.encode();(J/'release-package.json').write_bytes(p.encode())
rb='codex/grokbot-sealed-review-transport-20261029';assert not git('ls-remote','origin','refs/heads/'+rb)
rc=commit(MASTER,release,'Let GrokBot review sealed downstream packets while preserving host quality gates');git('push','origin',rc+':refs/heads/'+rb)
save('code-publication-receipt.json',{'stagingCommit':c,'stagingParent':STAGING,'releaseBranch':rb,'releaseCommit':rc,'releaseParent':MASTER,'files':codeFiles,'masterMerged':False,'deployment':False})
print(json.dumps({'staging':c,'releaseBranch':rb,'releaseCommit':rc,'files':len(files)}))
