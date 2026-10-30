import os,subprocess,tempfile,json,hashlib
from pathlib import Path
R=Path.cwd();J=Path(__file__).resolve().parent;C=J/'candidate';BASE='1f031602cf7aa15090b26ec997097d46dd2ef09f'
subprocess.run(['npm','run','people:disk:check'],cwd=R,check=True,stdout=subprocess.DEVNULL)
fd,index=tempfile.mkstemp(prefix='checkpoint-index-',dir=J);os.close(fd);os.unlink(index);env={**os.environ,'GIT_INDEX_FILE':index}
def git(*a,input=None):return subprocess.check_output(['git',*a],cwd=R,env=env,input=input)
try:
 git('read-tree',BASE);files=[]
 for p in sorted(C.rglob('*')):
  if not p.is_file():continue
  rel=p.relative_to(C).as_posix();b=p.read_bytes();oid=git('hash-object','-w','--stdin',input=b).decode().strip();git('update-index','--add','--cacheinfo','100644,'+oid+','+rel);files.append({'path':rel,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
 patch=git('diff','--cached','--binary',BASE);(J/'production-integration-candidate.patch').write_bytes(patch)
 (J/'production-candidate-manifest.json').write_text(json.dumps({'base':BASE,'files':files,'patchSha256':hashlib.sha256(patch).hexdigest(),'patchBytes':len(patch),'codeAdopted':False,'independentFinalRecheckComplete':False,'requiredCiComplete':False,'nativePilotIdentityProofAccepted':True,'dataQualified':False,'published':False},indent=2)+'\n')
 print(json.dumps({'files':len(files),'patchBytes':len(patch),'adopted':False,'nativePilotIdentityProofAccepted':True,'published':False}))
finally:Path(index).unlink(missing_ok=True)
