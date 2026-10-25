import pathlib,json,hashlib,subprocess,time,datetime
started=time.perf_counter();R=pathlib.Path('data/people/generated/independent-identity-recovery/jinshu053-source106-identity-reconciliation-20261025');P=R/'constraint-delta-renewals-7b6e4f-20261025/blind-current-028';O=pathlib.Path(__file__).parent;read=lambda p:json.loads(pathlib.Path(p).read_text());h=lambda b:hashlib.sha256(b).hexdigest()
def pin(p):
 b=pathlib.Path(p).read_bytes();return dict(file=str(pathlib.Path(p).resolve()),bytes=len(b),sha256=h(b))
def verify(q):
 actual=pin(q['file']);assert actual['sha256']==q['sha256'] and actual['bytes']==q['bytes']
seal=read(P/'blind-seal.json');verify(seal['scope']);s=read(P/'blind-scope.json');E=[]
for q in seal['sourceParts']:verify(q);E+=read(q['file'])['entries']
verify(seal['technicalProof']);tech=read(seal['technicalProof']['file']);verify(tech['currentGraphManifest']);verify(tech['currentGraphCompletion'])
records={e['key']:e['value'] for e in E if e['kind']=='person-record'};claims=[e['value'] for e in E if e['kind']=='person-claims'];mentions=[e['value'] for e in E if e['kind']=='person-mentions'];inbound=[e['value'] for e in E if e['kind']=='person-inboundClaims'];F=[e['value'] for e in E if e['kind']=='complete-current-governing-block']
assert (len(records),len(claims),len(mentions),len(inbound),len(F))==(15,131,214,17,38)
# Access only people and complete-current-clusters fields; never old/current decision verdict fields.
G=pathlib.Path(tech['currentGraphManifest']['file']).parent;manifest=read(tech['currentGraphManifest']['file']);golden={};shardpins=[];groups=[]
for fieldname in ['people','completeCurrentClusters']:
 field=next(f for f in manifest['fields'] if f['key']==fieldname)
 for q in field['parts']:
  path=G/q['file'];b=path.read_bytes();assert len(b)==q['bytes'] and h(b)==q['sha256'];shardpins.append(pin(path));part=json.loads(b)
  if fieldname=='people':
   for key,value in part['entries']:
    if key in records:golden[key]=value
  else:groups+=part.get('items',part.get('entries',[]))
assert set(golden)==set(records)
for key,record in records.items():
 g=golden[key];assert all(g[k]==v for k,v in record.items());assert g['claims']==[c for c in claims if c['subject']==key];assert g['mentions']==[m for m in mentions if m['person']==key]
proc=subprocess.Popen(['git','cat-file','--batch'],stdin=subprocess.PIPE,stdout=subprocess.PIPE);sources={}
for q in s['exactCurrentInputPins']:
 proc.stdin.write((q['gitRevision']+':'+q['path']+'\n').encode());proc.stdin.flush();hdr=proc.stdout.readline().decode().split();assert hdr[1]=='blob';b=proc.stdout.read(int(hdr[2]));assert proc.stdout.read(1)==b'\n';assert len(b)==q['bytes'] and h(b)==q['sha256']
 if '/extractions/' not in q['path']:sources[':'.join(q['path'].split('/')[1:]).replace('.json','')]=json.loads(b)
proc.stdin.close();proc.wait();U={}
for f in F:
 assert sources[f['chapter']]['content'][f['blockIndex']]==f['block']
 for u in f['block'].get('sentences',[]):U[f['chapter']+':'+u['id']]=u
anchors=set()
for c in claims+inbound:
 assert all(k in U for k in c['evidence']);anchors.update(c['evidence'])
for m in mentions:
 key=':'.join(m['person'].split(':')[:2])+':'+m['unit']['id'];u=U[key];anchors.add(key)
 for lang,ss in m['spans'].items():
  t=u['zh'] if lang=='zh' else u['translations'][0]['idiomatic']
  for sp in ss:assert t[sp['startCodePoint']:sp['endCodePoint']]==sp['exact'] and h(t.encode())==sp['unitTextHash'].replace('sha256:','')
# Current cluster format is preserved verbatim and selected by actual ID without inspecting decisions.
selected=[]
for requested in s['completeCurrentGroups']:
 candidates=[g for g in groups if isinstance(g,dict) and g.get('canonicalPersonId',g.get('id'))==requested['canonicalPersonId']]
 if not candidates:
  candidates=[g[1] for g in groups if isinstance(g,list) and len(g)==2 and g[0]==requested['canonicalPersonId']]
 assert len(candidates)==1,requested
 g=candidates[0];ids=g.get('localPeople',g.get('localIds',g.get('members',g.get('fullCurrentMemberIds'))));assert ids==requested['fullCurrentMemberIds'],g
 selected.append(g)
proof=dict(reviewer='/root/jin053_full_owner_peer',verifiedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),scope=pin(P/'blind-scope.json'),seal=pin(P/'blind-seal.json'),sourceParts=[pin(q['file']) for q in seal['sourceParts']],exactCurrentInputPins=s['exactCurrentInputPins'],goldenManifest=tech['currentGraphManifest'],goldenSelectedShardPins=shardpins,golden15OwnedRecordsMatch=True,completeCurrentSelectedGroups=selected,coverage=dict(fullMembers=15,ownedPairs=14,claims=131,mentions=214,inboundClaims=17,fullFrames=38,uniqueChineseUnits=len(U),pairedEnglishOwnedClaimMentionInboundAnchors=len(anchors)),verificationElapsedSeconds=round(time.perf_counter()-started,3),noOldVerdictOrAuthorProposalFieldsAccessed=True)
p=O/'blind-exact-current-input-proof.json';p.write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n');print(pin(p))
