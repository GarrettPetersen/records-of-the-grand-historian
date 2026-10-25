import pathlib,json,hashlib,subprocess,datetime,collections
R=pathlib.Path('data/people/generated/independent-identity-recovery/jinshu053-source106-identity-reconciliation-20261025');P=R/'renewals-v2/renew-merge-016/author-current/current7b6-source31-20261025';O=pathlib.Path(__file__).parent
read=lambda p:json.loads(pathlib.Path(p).read_text());h=lambda b:hashlib.sha256(b).hexdigest()
def pin(p):
 p=pathlib.Path(p);b=p.read_bytes();return dict(file=str(p.resolve()),bytes=len(b),sha256=h(b))
def verify(p):
 b=pathlib.Path(p['file']).read_bytes();assert len(b)==p['bytes'] and h(b)==p['sha256'],p['file']
def git(ref,path):return subprocess.check_output(['git','show',ref+':'+path])
idx=read(P/'source-only-index.json');manifest=read(P/'source-only-manifest.json');app=read(P/'current-author-applicability-manifest.json');lineage=read(P/'current-input-delta-lineage.json');notes=read(P/'current-author-evidence-notes.json');oldreceipt=R/'independent-current/batch-g-20261025/blind-source-assessment-renew-merge-016.json';old=read(oldreceipt)
assert pin(oldreceipt)['sha256']=='91f5de4d4e47328fa6593cac997333140dc418dad3c5bf695e71922fe47a886f'
assert pin(P/'source-only-manifest.json')['sha256']=='c84dc12a212b0ff9f07da0ad31856ab6154d6cddbba903774294118480b84691'
assert pin(P/'current-author-applicability-manifest.json')['sha256']=='1af4953ae595526ca8aa4139fb85cbfe3fc436166b5c9add985b46c5d4d86a1b'
for q in app['files']+[app['reusedExactResolution'],app['originalAuthorManifest'],app['manageableSourceOnlyIndex'],app['currentGraphManifest']]:verify(q)
E=[]
for q in idx['parts']:verify(q);E+=read(q['file'])['entries']
oldpart=R/'renewals-v2/renew-merge-016/source-part-001.json';assert pin(oldpart)['sha256']=='4e0c9e03831d5ff798b6ce3e563cd885f7bd0fd7692fbffe3bd387b7cd14256b';BE=read(oldpart)['entries']
ref=idx['revision'];raw=[];sources={}
for c in idx['chapterPins']:
 for typ in ['source','extraction']:
  q=c[typ];b=git(ref,q['path']);assert len(b)==q['bytes'] and h(b)==q['sha256']
  before=git('1b9c1e4262fcd1e5eef069b867e96f4e9d90be59',q['path'])
  if c['chapterKey']!='zizhitongjian:083':assert b==before
  raw.append(dict(chapter=c['chapterKey'],kind=typ,file=q['path'],oldSha256=h(before),currentSha256=h(b),unchanged=b==before))
  if typ=='source':sources[c['chapterKey']]=json.loads(b)
units={x['key']:x['value'] for x in E if x['kind']=='source-unit'};bu={x['key']:x['value'] for x in BE if x['kind']=='source-unit'}
assert set(units)==set(bu) and len(units)==261
for key,u in units.items():assert u['zh']==bu[key]['zh']
frames=[x['value'] for x in E if x['kind']=='complete-governing-block'];assert len(frames)==31
for f in frames:assert sources[f['chapterKey']]['content'][f['blockIndex']]==f['block']
profiles={x['key']:x['value'] for x in E if x['kind']=='person-profile'};bprofiles={x['key']:x['value'] for x in BE if x['kind']=='person-record'};assert len(profiles)==13
for key,v in profiles.items():assert all(v[k]==bprofiles[key][k] for k in v)
claims=sum([x['value'] for x in E if x['kind']=='person-claims'],[]);mentions=sum([x['value'] for x in E if x['kind']=='person-mentions'],[]);inbound=sum([x['value'] for x in E if x['kind']=='person-inboundClaims'],[])
assert (len(claims),len(mentions),len(inbound))==(71,79,4)
bclaims=[x['value'] for x in BE if x['kind']=='person-claims'];bmentions=[x['value'] for x in BE if x['kind']=='person-mentions']
assert len(lineage['claimLineage'])==71
assert collections.Counter(json.dumps(x['before'],sort_keys=True) for x in lineage['claimLineage'])==collections.Counter(json.dumps(x,sort_keys=True) for x in bclaims)
assert collections.Counter(json.dumps(x['after'],sort_keys=True) for x in lineage['claimLineage'])==collections.Counter(json.dumps(x,sort_keys=True) for x in claims)
changes=[]
for row in lineage['claimLineage']:
 b={k:v for k,v in row['before'].items() if k!='id'};a={k:v for k,v in row['after'].items() if k!='id'}
 if b!=a:changes.append(row)
assert len(changes)==2
# Reconcile every original occurrence, including its documented transfer outside this owned group.
assert len(lineage['mentionLineage'])==79
assert collections.Counter(json.dumps(x['before'],sort_keys=True) for x in lineage['mentionLineage']+lineage['removedForeignOccurrence'] if 'before' in x)==collections.Counter(json.dumps(x,sort_keys=True) for x in bmentions if x not in lineage['removedForeignOccurrence'])
for m in mentions:
 key=':'.join(m['person'].split(':')[:2])+':'+m['unit']['id'];u=units[key]
 for lang,ss in m['spans'].items():
  t=u['zh'] if lang=='zh' else u['en']
  for sp in ss:assert t[sp['startCodePoint']:sp['endCodePoint']]==sp['exact'] and h(t.encode())==sp['unitTextHash'].replace('sha256:','')
res=read(app['reusedExactResolution']['file']);members=set(res['decisions'][0]['localPeople']);assert members==set(profiles)==set(old['judgment']['samePersonMembers'])
assert all('zizhitongjian:083:s0386' not in c['evidence'] for c in claims if c['subject']=='zizhitongjian:083:p142')
assert all(m['unit']['id']=='s0354' for m in mentions if m['person']=='zizhitongjian:083:p142')
# Every current whole prior document is pinned; preserve complete touching decisions.
paths=subprocess.check_output(['git','ls-tree','-r','--name-only',ref,'data/people/resolutions']).decode().splitlines();paths=[x for x in paths if x.endswith('.json')];assert len(paths)==275
proc=subprocess.Popen(['git','cat-file','--batch'],stdin=subprocess.PIPE,stdout=subprocess.PIPE);docs=[];touch=[]
for path in paths:
 proc.stdin.write((ref+':'+path+'\n').encode());proc.stdin.flush();hdr=proc.stdout.readline().decode().split();assert hdr[1]=='blob';b=proc.stdout.read(int(hdr[2]));assert proc.stdout.read(1)==b'\n';docs.append(dict(file=path,bytes=len(b),sha256=h(b)))
 for i,d in enumerate(json.loads(b).get('decisions',[])):
  overlap=members.intersection(d.get('localPeople',[]))
  if overlap:
   if d['decision']=='keep-separate':assert len(overlap)<=1
   touch.append(dict(file=path,sha256=h(b),index=i,wholeDecision=d))
proc.stdin.close();proc.wait()
proof=dict(reviewer='/root/jin053_full_owner_peer',reviewedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),currentRef=ref,oldBlindReceipt=pin(oldreceipt),sourceOnlyManifest=pin(P/'source-only-manifest.json'),currentApplicabilityManifest=pin(P/'current-author-applicability-manifest.json'),parts=[pin(x['file']) for x in idx['parts']],rawPins=raw,completeCurrentProfiles=profiles,allCurrentClaims=claims,allCurrentMentions=mentions,allCurrentInbound=inbound,twoSemanticClaimChanges=changes,all275CurrentDocumentPins=docs,currentWholeTouchingDecisions=touch,counts=idx['counts'],originalExactResolution=app['reusedExactResolution'],lineage=pin(P/'current-input-delta-lineage.json'))
p=O/'independent-current-input-proof.json';p.write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n');print('PROOF',pin(p));print('CHANGES',json.dumps(changes,ensure_ascii=False));print('TOUCH',len(touch))
