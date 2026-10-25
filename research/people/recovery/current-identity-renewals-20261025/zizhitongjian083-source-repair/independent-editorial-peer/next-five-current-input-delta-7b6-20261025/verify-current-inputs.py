import json,pathlib,hashlib,subprocess,datetime,collections
base=pathlib.Path.cwd();J=base/'data/people/generated/independent-identity-recovery/zizhitongjian083-s0386-source-repair-20261025';K=J/'host-identity-input-delta/next-five-7b6e4f-20261025';O=pathlib.Path(__file__).parent
old='abe22d6a2fe459385d32e5d2096543d6d0b7b7f2';new='7b6e4f15a7894c14d7a5ecb7023c85c9b6cd9691'
h=lambda b:hashlib.sha256(b).hexdigest()
read=lambda p:json.loads(pathlib.Path(p).read_text())
def pin(p):
 p=pathlib.Path(p);b=p.read_bytes();return dict(file=str(p),bytes=len(b),sha256=h(b))
def verify(p,root=base):
 f=pathlib.Path(p['file']);f=f if f.is_absolute() else root/f
 b=f.read_bytes();assert len(b)==p['bytes'] and h(b)==p['sha256'],str(f)
def git(ref,p):return subprocess.check_output(['git','show',ref+':'+p])
idx=read(K/'final-review-index.json');wo=read(K/'complete-review-work-order.json');ap=read(K/'prior-evidence-and-current-prior-appendix.json')
assert h((K/'final-review-index.json').read_bytes())=='651e22249ae3a40fd6ff2206d4dbe4a448ed9d20b64f01fcfbee695880086ad5'
assert h((K/'complete-dossier-seal.json').read_bytes())=='01fe22557ef985df438f89223bd1ad3d278f30728ae362de0973c71b2ae2e699'
verify(idx['completeWorkOrder'],K)
items=[]
for p in idx['allSourceParts']:
 verify(p,K);items+=read(K/p['file'])['items']
scopepins=items[0]['value'];rawpins=[]
for ref,label in [(old,'old'),(new,'current')]:
 for kind,path in [('Source','data/zizhitongjian/083.json'),('Extraction','data/people/extractions/zizhitongjian/083.json')]:
  b=git(ref,path);assert h(b)==scopepins[label+kind+'Sha256'];rawpins.append(dict(ref=ref,file=path,bytes=len(b),sha256=h(b)))
S=[json.loads(git(ref,'data/zizhitongjian/083.json')) for ref in [old,new]]
units=[{x['id']:x for b in s['content'] for x in b.get('sentences',[])} for s in S]
# Complete raw source chapter includes title/table-like source units via recursive id walk.
def allunits(o):
 out={}
 def walk(x):
  if isinstance(x,dict):
   if 'id' in x and 'zh' in x:out[x['id']]=x
   for z in x.values():walk(z)
  elif isinstance(x,list):
   for z in x:walk(z)
 walk(o);return out
units=[allunits(s) for s in S]
ch=[x['value'] for x in items if x['type']=='complete-chapter-Chinese-framing-source-only'][0]
assert len(ch)==381
for row in ch:
 uid=row['id'].split(':')[-1];assert units[0][uid]['zh']==units[1][uid]['zh']==row['zh']
frames=[x['value'] for x in items if x['type'] in ['complete-current-owned-governing-block','complete-current-owned-or-inbound-claim-governing-block']]
assert len(frames)==24
for f in frames:assert S[1]['content'][f['blockIndex']]==f['block']
A=read(J/'independent-editorial-peer/final31-source-owner/canonical-normalized-proof.json');N=read(J/'independent-editorial-peer/final31-source-owner/normal-validation-expanded-proof.json')['final-actual31']['normalized']
profiles=[x['value'] for x in items if x['type']=='complete-owned083-old-current-profile'];assert len(profiles)==9
profileproof=[]
for p in profiles:
 for i,(doc,record) in enumerate(zip([A,N],p['oldAndCurrent'])):
  pid=p['localId'];assert record['person']==next(x for x in doc['people'] if x['localId']==pid)
  assert record['claims']==[x for x in doc['claims'] if x['subject']==pid]
  assert record['mentions']==[x for x in doc['mentions'] if x['person']==pid]
  for m in record['mentions']:
   u=units[i][m['unit']['id']]
   for lang,ss in m['spans'].items():
    t=u['zh'] if lang=='zh' else u['translations'][0]['idiomatic']
    for sp in ss:
     assert h(t.encode())==sp['unitTextHash'].replace('sha256:','')
     assert t[sp['startCodePoint']:sp['endCodePoint']]==sp['exact']
 oldp,newp=p['oldAndCurrent'];assert oldp['person']==newp['person'] and oldp['claims']==newp['claims']
 profileproof.append(dict(localId=p['localId'],oldMentions=len(oldp['mentions']),currentMentions=len(newp['mentions']),metadataAndClaimsEqual=True))
# All member chapters raw-byte comparison, including the independently reviewed Jin059 bridge.
chapters=set()
for s in ap['scopePins']:
 for p in s['actualAllMemberIds']:
  b,c,_=p.split(':');chapters.add((b,c))
chapters.add(('jinshu','059'))
for b,c in sorted(chapters):
 for path in [f'data/{b}/{c}.json',f'data/people/extractions/{b}/{c}.json']:
  if (b,c)==('jinshu','059') and '/extractions/' in path:continue # Source-only primary bridge; no extraction claimed.
  ob=git(old,path);nb=git(new,path)
  if (b,c)!=('zizhitongjian','083'):assert ob==nb,path
  rawpins.append(dict(file=path,oldSha256=h(ob),currentSha256=h(nb),unchanged=ob==nb,oldBytes=len(ob),currentBytes=len(nb)))
assert h(git(new,'data/jinshu/059.json'))=='bf77c700ff55715096e32a1f60f1b453edb4e8807018feba965f82f7b1082525'
# Scan ALL current resolution documents; retain each touching WHOLE decision.
paths=subprocess.check_output(['git','ls-tree','-r','--name-only',new,'data/people/resolutions']).decode().splitlines();paths=[p for p in paths if p.endswith('.json')]
assert len(paths)==275,len(paths)
currentdocs=[];touch={s['scope']:[] for s in ap['scopePins']}
for path in paths:
 b=git(new,path);doc=json.loads(b);currentdocs.append(dict(file=path,bytes=len(b),sha256=h(b)))
 for i,d in enumerate(doc.get('decisions',[])):
  people=set(d.get('localPeople',[]))
  for s in ap['scopePins']:
   if people.intersection(s['actualAllMemberIds']):touch[s['scope']].append(dict(file=path,documentSha256=h(b),index=i,wholeDecision=d))
for s in ap['scopePins']:
 for field in ['manifest','proposal','originalSourceReview']:verify(s[field])
 s['actualResolution']=read(s['proposal']['file'])
 s['allOwnedCanonicalPairs']=read(base/'data/people/generated/independent-identity-recovery/jinshu053-source106-identity-reconciliation-20261025/renewals-v2'/s['scope']/'blind-source-scope.json')['ownedCurrentTouchingPairs']
 assert len(s['allOwnedCanonicalPairs'])==s['ownedPairs']
# The new documents added since old source approval do not touch any member.
for row in ap['currentNewWholeDocuments']:
 assert h(git(new,row['file']))==row['sha256']
 assert not any(d['touchesAnyActualFiveMember'] for d in row['decisions'])
for s,ds in touch.items():
 print(s,'whole touching decisions',len(ds),[(d['file'].split('/')[-1],d['index'],d['wholeDecision']['decision']) for d in ds])
proof=dict(reviewer='/root/jin053_full_owner_peer',reviewedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),oldRef=old,currentRef=new,index=pin(K/'final-review-index.json'),seal=pin(K/'complete-dossier-seal.json'),attachments=[pin(K/p['file']) for p in idx['allSourceParts']],sourcePins=rawpins,chapterChineseUnits=381,governingFrames=24,profileProof=profileproof,completeProfiles=profiles,current275Documents=currentdocs,currentWholeTouchingDecisions=touch,scopes=ap['scopePins'])
(O/'independent-exact-current-input-proof.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
print('PROOF',pin(O/'independent-exact-current-input-proof.json'))
