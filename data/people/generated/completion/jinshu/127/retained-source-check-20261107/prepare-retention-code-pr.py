import os,json,hashlib,pathlib,subprocess,tempfile,datetime
R=pathlib.Path(__file__).resolve().parent
cfg=json.loads((R/'reconciliation-runtime-transform.json').read_text());base='c991cf12d80fda1d1375d729f6f3553cc212bbcb';branch='refs/heads/codex/people-kinship-source-retention'
def git(*a,input=None,env=None):return subprocess.check_output(['git',*a],input=input,env=env).decode().strip()
guard=subprocess.check_output(['npm','run','people:disk:check'],text=True);assert not json.loads(guard[guard.index('{'):])['errors'];assert git('ls-remote','origin','refs/heads/master').split()[0]==base;assert not git('ls-remote','origin',branch),'Preserve an existing branch; inspect ownership'
index=pathlib.Path(git('rev-parse','--git-path','index'));indexSha=hashlib.sha256(index.read_bytes()).hexdigest();source=pathlib.Path(cfg['baseFile']).read_bytes();assert hashlib.sha256(source).hexdigest()==cfg['baseSha256'];compiled=source.decode()
for e in cfg['edits']:assert compiled.count(e['before'])==1;compiled=compiled.replace(e['before'],e['after'])
compiled=compiled.encode();assert hashlib.sha256(compiled).hexdigest()==cfg['compiledSha256'];testPath='scripts/self-test-people-source-name-retention.mjs';oldTest=subprocess.check_output(['git','show',base+':'+testPath]).decode();last="console.log('Chinese name retention: 6 offline assertions passed.');";assert oldTest.count(last)==1
newTests='''const intermediary={mentionException:'Unnamed father inferred from the cited kinship phrase.'};
const familyClaim={predicate:'family-relationship',value:{personId:'jinshu:127:p154',kinshipTerm:{zh:'兄'}},evidence:['jinshu:127:s0272']};
const kinshipBefore=new Map([['s0272',{zh:'初，德迎其兄子超于長安，及是而至。',en:'old English'}]]);
const kinshipAfter=new Map([['s0272',{zh:'初，德迎其兄子超于長安，及是而至。',en:'corrected English'}]]);
assert.equal(retains(intermediary,[familyClaim],kinshipBefore,kinshipAfter),true,'English-only corrections retain an existing Chinese-backed unnamed intermediary');
assert.equal(retains({},[familyClaim],kinshipBefore,kinshipAfter),false,'a kinship claim does not invent a no-span exception');
assert.equal(retains(intermediary,[{...familyClaim,value:{personId:'jinshu:127:p154',kinshipTerm:{en:'elder brother'}}}],kinshipBefore,kinshipAfter),false,'an English kinship term alone is insufficient');
assert.equal(retains(intermediary,[familyClaim],kinshipBefore,new Map([['s0272',{zh:'超至長安。'}]])),false,'changed Chinese cannot preserve kinship support');
assert.equal(retains(intermediary,[familyClaim,{predicate:'attestation',value:{},evidence:['jinshu:127:missing']}],kinshipBefore,kinshipAfter),false,'every owned kinship claim witness must remain present and unchanged');
console.log('Chinese name and kinship retention: 11 offline assertions passed.');'''
newTest=oldTest.replace(last,newTests).encode();art=R/'production-retention-code';art.mkdir();(art/'people-translation-repairs.mjs').write_bytes(compiled);(art/'self-test-people-source-name-retention.mjs').write_bytes(newTest)
updates={'scripts/lib/people-translation-repairs.mjs':compiled,testPath:newTest};blobs={p:git('hash-object','-w','--stdin',input=b)for p,b in updates.items()}
with tempfile.TemporaryDirectory(prefix='people-retention-code-index-')as d:
 env=dict(os.environ,GIT_INDEX_FILE=str(pathlib.Path(d)/'index'));git('read-tree',base,env=env);git('update-index','--add','--index-info',input=''.join('100644 '+blob+'\t'+p+'\n'for p,blob in blobs.items()).encode(),env=env);tree=git('write-tree',env=env);assert set(git('diff-tree','--no-commit-id','--name-only','-r',git('rev-parse',base+'^{tree}'),tree).splitlines())==set(updates);commit=git('commit-tree',tree,'-p',base,input=b'Preserve Chinese-backed kinship intermediaries after English repairs\n')
assert hashlib.sha256(index.read_bytes()).hexdigest()==indexSha
receipt={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'base':base,'head':commit,'branch':branch,'files':{p:{'gitBlob':blobs[p],'sha256':hashlib.sha256(b).hexdigest()}for p,b in updates.items()},'helperMatchesIndependentlyReviewableTransform':True,'primaryIndexUnchanged':True,'canonicalSourceWrites':0,'published':False};(R/'retention-code-commit.json').write_text(json.dumps(receipt,indent=2)+'\n');git('push','origin',commit+':'+branch);assert git('ls-remote','origin',branch).split()[0]==commit;print(json.dumps({'head':commit,'branch':branch,'files':list(updates),'primaryIndexUnchanged':True}))
