from pathlib import Path
import datetime,hashlib,json,os,subprocess,tempfile
d=Path(__file__).resolve().parent
base='56aee9165ec8ba93e8c30a6166da95df00acdcc8'
branch='codex/people-reviewed-record-corrections'
def call(*args,input=None,env=None):
    return subprocess.check_output(args,input=input,env=env)
def git(*args,input=None,env=None):
    return call('git',*args,input=input,env=env).decode().strip()
def sha(data):
    return hashlib.sha256(data).hexdigest()
guard=json.loads(call('npm','run','--silent','people:disk:check'))
assert not guard['errors'] and not guard['memory']['warnings']
assert git('ls-remote','origin','refs/heads/master').split()[0] == base
assert not git('ls-remote','origin','refs/heads/'+branch), 'Inspect existing code branch before reuse'
index=Path(git('rev-parse','--git-path','index'))
indexSha=sha(index.read_bytes())
assert indexSha=='793be8e2b83d79da0d364c448f8bd85e4ac5f53c924d11b45af06a53c24f88a6'
paths=['scripts/apply-people-alias-decisions.mjs','scripts/lib/people-compact-surface.mjs','scripts/lib/people-record-corrections.mjs','scripts/test-people-record-corrections.mjs']
files={p:(d/p).read_bytes() for p in paths}
workflow='.github/workflows/master-build-gate.yml'
original=call('git','show',base+':'+workflow)
needle=b'      - name: '
offset=original.index(needle,original.index(b'npm run people:hints:self-test'))
files[workflow]=original[:offset]+b'      - name: Verify reviewed record corrections\n        run: |\n          node scripts/apply-people-alias-decisions.mjs --self-test\n          node --test scripts/test-people-record-corrections.mjs\n\n'+original[offset:]
with tempfile.TemporaryDirectory(prefix='record-correction-index-') as tmp:
    env=dict(os.environ,GIT_INDEX_FILE=str(Path(tmp)/'index'))
    git('read-tree',base,env=env)
    blobs={p:git('hash-object','-w','--stdin',input=body) for p,body in files.items()}
    git('update-index','--add','--index-info',input=''.join('100644 '+oid+'\t'+p+'\n' for p,oid in blobs.items()).encode(),env=env)
    tree=git('write-tree',env=env)
    commit=git('commit-tree',tree,'-p',base,input=b'Apply reviewed record wording and explicit Chinese spans under the source owner\n')
assert sorted(git('diff-tree','--no-commit-id','--name-only','-r',commit).splitlines())==sorted(files)
assert sha(index.read_bytes())==indexSha
assert not git('diff','--check',base,commit)
git('push','origin',commit+':refs/heads/'+branch)
assert git('ls-remote','origin','refs/heads/'+branch).split()[0]==commit
(d/'code-commit.json').write_text(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'base':base,'commit':commit,'branch':branch,'files':{p:sha(v) for p,v in files.items()},'primaryIndex':indexSha,'independentCodeApproval':False},indent=2)+'\n')
