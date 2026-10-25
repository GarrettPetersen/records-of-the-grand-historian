import json,pathlib,hashlib,subprocess,copy
P=pathlib.Path(__file__).resolve().parent.parent; R=P.parent
sha=lambda b:hashlib.sha256(b).hexdigest()
canon=lambda o:json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
read=lambda p:json.loads(p.read_text())
m=read(P/'sealed-manifest.json');r=read(R/'selected-registry.json');h=read(P/'host-context.json');j=read(P/'join-proof.json')
assert sha((P/'sealed-manifest.json').read_bytes())=='a5d5d996bf9c8f5f713eb050ffd3bd85968aba30362cf2cf4c1d02242657e68d'
assert sha((R/'selected-registry.json').read_bytes())==m['registry']['sha256']
for f in m['files']:
 b=(P/f['file']).read_bytes();assert len(b)==f['bytes'] and sha(b)==f['sha256']
cache={}
paths=sorted({r['chapterPins'][r['people'][id]['chapterPinRef']][kind+'Path'] for id in h['ownedPeople']+h['priorOnlyPeople'] for kind in ['source','extraction']} | {x['path'] for x in h['priorConstraintDocuments']})
raw=subprocess.check_output(['git','cat-file','--batch'],input=(''.join(m['canonicalRevision']+':'+path+'\n' for path in paths)).encode())
pos=0
for path in paths:
 end=raw.index(b'\n',pos);header=raw[pos:end].split();assert header[1]==b'blob';size=int(header[2]);cache[path]=raw[end+1:end+1+size];pos=end+2+size
def blob(path):
 if path not in cache: cache[path]=subprocess.check_output(['git','show',m['canonicalRevision']+':'+path])
 return cache[path]
def mat(id):
 x=copy.deepcopy(r['people'][id]);x['sourcePins']=r['chapterPins'][x.pop('chapterPinRef')];x['sourceUnits']=[r['units'][q] for q in x.pop('sourceUnitRefs')];return x
clusters={x['canonicalPersonId']:set(x['localPeople']) for x in r['completeEndpointClusters']}
owned={};pairs=[];pins=set();claimCount=0;unitRefs=set()
for ix in m['packetIndex']:
 d=read(P/ix['file']);assert len((P/ix['file']).read_bytes())<=d['ceilings']['bytes'];assert len(d['scope']['reviewPairs'])<=d['ceilings']['maxComparisons']
 ids={x['localId'] for x in d['scope']['completeEndpointMembers']};assert ids=={x['localId'] for x in d['people']}
 for cid in set(sum(d['scope']['reviewPairs'],[])):
  assert {x['localId'] for x in d['scope']['completeEndpointMembers'] if x['canonicalPersonId']==cid}==clusters[cid]
 for x in d['people']:
  id=x['localId']; y=copy.deepcopy(x); y.pop('mentionCount'); y['mentions']=r['people'][id]['mentions'];assert y==mat(id),id
  assert r['people'][id]['currentCanonicalPersonId']==x['currentCanonicalPersonId'];owned[id]=x
 pairs+=d['scope']['reviewPairs']
assert len(pairs)==127 and len({tuple(sorted(q)) for q in pairs})==127
assert set(owned)==set(h['ownedPeople']) and len(owned)==139
for id in h['ownedPeople']+h['priorOnlyPeople']:
 x=mat(id);pin=x['sourcePins'];pins.add(r['people'][id]['chapterPinRef'])
 for kind in ['source','extraction']:
  assert sha(blob(pin[kind+'Path']))==pin[kind+'RawSha256'],pin[kind+'Path']
 src=json.loads(blob(pin['sourcePath'])); units={s['id']:s for b in src['content'] for s in b.get('sentences',[])}
 for u in x['sourceUnits']:
  assert units[u['id']]['zh']==u['zh'],(id,u['id']);unitRefs.add(':'.join(id.split(':')[:2])+':'+u['id'])
 if id in owned:claimCount+=len(x['claims'])
priorIds=set()
for doc in h['priorConstraintDocuments']:
 registryDoc=next(x for x in r['priorConstraintDocuments'] if x['path']==doc['path'])
 assert all(d in registryDoc['document']['decisions'] for d in doc['document']['decisions'])
 whole=json.loads(blob(doc['path']))
 for dec in doc['document']['decisions']:
  assert dec in whole['decisions'];priorIds.update(dec['localPeople'])
assert priorIds-set(owned)==set(h['priorOnlyPeople'])
expected=[]
for doc in r['priorConstraintDocuments']:
 selected=[d for d in doc['document']['decisions'] if set(d['localPeople'])&set(owned)]
 if selected:
  x=copy.deepcopy(doc);x['document']['decisions']=selected;expected.append(x)
assert expected==h['priorConstraintDocuments']
proof={'schemaVersion':1,'reviewer':'/root/jin053_rest_c004_peer','baseline':m['canonicalRevision'],'sealedManifestSha256':sha((P/'sealed-manifest.json').read_bytes()),'registrySha256':sha((R/'selected-registry.json').read_bytes()),'verifiedPacketHashesCaps':True,'losslessRecordJoins':139,'completeCanonicalEndpointMemberships':True,'priorMembershipRecords':len(priorIds-set(owned)),'priorConstraintDocuments':len(h['priorConstraintDocuments']),'rawPinnedSourceExtractionChapters':len(pins),'exactCitedChineseUnitsIncludingPriorOnly':len(unitRefs),'ownedClaims':claimCount,'uniqueOwnedPairs':127,'method':'Packet records rejoined to selected registry with full mentions; canonical endpoint sets compared to registry clusters; all relevant source and extraction raw SHA256 pins independently verified against baseline git blobs; cited Chinese units compared; intersecting prior document decisions verified against full baseline documents. No whole compiler or canonical mutation.','inputHashes':{f['file']:f['sha256'] for f in m['files']}}
(P/'independent-review/source-join-proof.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n');print(json.dumps(proof,ensure_ascii=False))
