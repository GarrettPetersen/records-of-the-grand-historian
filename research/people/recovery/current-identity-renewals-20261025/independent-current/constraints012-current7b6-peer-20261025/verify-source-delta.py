import pathlib,json,hashlib,subprocess,datetime,collections
R=pathlib.Path('data/people/generated/independent-identity-recovery/jinshu053-source106-identity-reconciliation-20261025');P=R/'constraint-delta-renewals-7b6e4f-20261025';O=pathlib.Path(__file__).parent
read=lambda p:json.loads(pathlib.Path(p).read_text());h=lambda b:hashlib.sha256(b).hexdigest()
def pin(p):
 b=pathlib.Path(p).read_bytes();return dict(file=str(pathlib.Path(p).resolve()),bytes=len(b),sha256=h(b))
def verify(q,root=P):
 f=pathlib.Path(q['file']);f=f if f.is_absolute() else root/f;b=f.read_bytes();assert h(b)==q['sha256'] and ('bytes' not in q or len(b)==q['bytes']),str(f)
start=read(P/'START-HERE-review-index.json')
assert pin(P/'START-HERE-review-index.json')['sha256']=='83f37a88ad6ed4fda117c398c673cd696162de9c19e89381dd6bb23e11849572'
for k in ['authoritativeMatrixSeal','compactMatrix','primaryInputDeltaLedger','currentWholeConstraintIndex','originalProvenanceInventory']:verify(start[k])
seal=read(P/'v2/matrix-seal.json');d=next(x for x in seal['dossiers'] if x['id']=='renew-constraints-012');E=[];BE=[]
for q in d['parts']:verify(q);E+=read(P/q['file'])['items']
for q in d['fullUnchangedPrimaryPacketsAvailable']:verify(q,R);BE+=read(R/q['file'])['entries']
scope=E[0]['value'];cases=[x['value'] for x in E if x['type']=='one-source-verified-OLD-WHOLE-case-with-current-delta'];profiles=[x['value'] for x in E if x['type']=='original-endpoint-current-profile-and-precise-delta'];prov=read(P/'original-provenance-inventory.json');original=[x for x in prov['cases'] if x['workOrder']=='renew-constraints-012']
assert len(cases)==len(original)==scope['currentPairCount']==50 and len(profiles)==51
assert all(len(g['fullCurrentMemberIds'])==1 and not g['addedCurrentMemberIds'] and not g['uncoveredExpandedIds'] for g in scope['fullCurrentGroups'])
for q in [scope['originalWorkOrderPin'],scope['originalPriorEvidencePin']]:verify(q)
# Verify exact actual original author/source peer, independent handoff, blind seal and whole published decision.
authorpin=cases[0]['originalAuthorAndPeer']['author'];peerpin=cases[0]['originalAuthorAndPeer']['independentSourcePeer'];verify(authorpin);verify(peerpin);author=read(authorpin['file']);peer=read(peerpin['file']);job=pathlib.Path(authorpin['file']).parent.parent;handoff=read(job/'host-handoff.json');assert handoff['sourceAuthor']!='/root/jin053_full_owner_peer' and handoff['sourceAuthor']!=handoff['independentReviewer']==peer['reviewer'];assert peer['sourceApproval'] is True and peer['approved'] is True
blind=job/peer['blindReceipt']['file'];assert pin(blind)['sha256']==peer['blindReceipt']['sha256']
# Read-only batched Git objects, exact raw input epochs and canonical documents.
proc=subprocess.Popen(['git','cat-file','--batch'],stdin=subprocess.PIPE,stdout=subprocess.PIPE);cache={}
def gitobj(query):
 if query in cache:return cache[query]
 proc.stdin.write((query+'\n').encode());proc.stdin.flush();hdr=proc.stdout.readline().decode().split();assert hdr[1]=='blob',query;b=proc.stdout.read(int(hdr[2]));assert proc.stdout.read(1)==b'\n';cache[query]=(hdr[0],b);return cache[query]
ref=start['canonicalRevision'];rawproof=[];sources={};up={x['key']:x['value'] for x in BE if x['kind']=='source-unit'}
for x in profiles:
 q=x['inputProof']
 for kind,pathkey,oldoid,newOid,pinkey in [('source','sourcePath','sourceOid','currentSourceOid','actualCurrentSourcePin'),('extraction','extractionPath','extractionOid','currentExtractionOid','actualCurrentExtractionPin')]:
  oid,b=gitobj(q['epoch']+':'+q[pathkey]);assert oid==q[oldoid]
  coid,cb=gitobj(ref+':'+q[pathkey]);assert coid==q[newOid];cp=q[pinkey];assert h(cb)==cp['sha256'] and len(cb)==cp['bytes']
  if x['localId']!='jinshu:053:p023':assert b==cb
  rawproof.append(dict(localId=x['localId'],kind=kind,file=q[pathkey],oldEpoch=q['epoch'],oldOid=oid,currentOid=coid,oldSha256=h(b),currentSha256=h(cb),unchanged=b==cb))
  if kind=='source':sources[q['book']+':'+q['chapter']]=json.loads(cb)
 assert x['before']['person']==x['after']['person']
 sem=lambda cs:[{k:v for k,v in c.items() if k!='id'} for c in cs]
 assert sem(x['before']['claims'])==sem(x['after']['claims'])
 assert x['before']['mentions']==x['after']['mentions']
 assert not x['metadataDeltas'] and x['claimsSame'] and x['chineseOwnedOccurrencesSame']
rawunits={}
for key,s in sources.items():
 def walk(v):
  if isinstance(v,dict):
   if 'id' in v and 'zh' in v:rawunits[key+':'+v['id']]=v
   for z in v.values():walk(z)
  elif isinstance(v,list):
   for z in v:walk(z)
 walk(s)
for key,u in up.items():
 ru=rawunits[key];assert u['zh']==ru['zh']
 if 'en' in u:assert u['en']==ru['translations'][0]['idiomatic']
 if 'literal' in u:assert u['literal']==ru['translations'][0]['literal']
for x in profiles:
 chapter=':'.join(x['localId'].split(':')[:2])
 for m in x['after']['mentions']:
  u=rawunits[chapter+':'+m['unit']['id']]
  for lang,ss in m['spans'].items():
   t=u['zh'] if lang=='zh' else u['translations'][0]['idiomatic']
   for sp in ss:assert t[sp['startCodePoint']:sp['endCodePoint']]==sp['exact'] and h(t.encode())==sp['unitTextHash'].replace('sha256:','')
for x in E:
 if x['type']=='complete-current-primary-frame-for-changed-record':
  v=x['value'];assert sources[v['book']+':'+v['chapter']]['content'][v['blockIndex']]==v['completeCurrentGoverningBlock']
for c in cases:
 p=next(p for p in original if p['oldWholeDecision']==c['oldWholeDecision']);assert c['classification']=='ELIGIBLE_BOUNDED_SOURCE_INPUT_DELTA_REVIEW_NOT_APPROVAL'
 assert c['oldWholeDecision']==author['decisions'][p['originalFullDocumentDecisionIndices'][0]]
 assert len(p['originalFullDocumentDecisionIndices'])==1
 for key in ['oldWholeDocumentPin','publishedReceiptPin']:
  q=p[key];_,b=gitobj(q['gitRevision']+':'+q['path']);assert h(b)==q['sha256'] and len(b)==q['bytes']
 if p['oldWholeDocumentPin']['path']==c['oldPath']:
  published=json.loads(gitobj(p['oldWholeDocumentPin']['gitRevision']+':'+c['oldPath'])[1]);assert published['decisions'][p['originalFullDocumentDecisionIndices'][0]]==c['oldWholeDecision']
 assert any(sorted(q['pair'])==sorted(pair) and q['sourceApproved'] and q['outcome']=='keep-separate' for pair in c['actualCurrentTouchingPairs'] for q in peer['checkedPairs'])
 assert len(c['oldWholeDecision']['localPeople'])==2 and c['oldWholeDecision']['decision']=='keep-separate'
 # Whole scope maps retain every old member; no trimming or component collapse.
 assert {x['localId'] for x in c['oldMemberToActualComponent']}==set(c['oldWholeDecision']['localPeople'])
 assert all(x['fullCurrentMemberIds']==[x['localId']] for x in c['oldMemberToActualComponent'])
# Check all current whole documents for hard constraints touching these endpoints.
paths=subprocess.check_output(['git','ls-tree','-r','--name-only',ref,'data/people/resolutions']).decode().splitlines();paths=[p for p in paths if p.endswith('.json')];assert len(paths)==275
members={x['localId'] for x in profiles};touch=[]
for path in paths:
 _,b=gitobj(ref+':'+path)
 for i,dec in enumerate(json.loads(b).get('decisions',[])):
  if members.intersection(dec.get('localPeople',[])):touch.append(dict(file=path,documentSha256=h(b),index=i,wholeDecision=dec))
proc.stdin.close();proc.wait();assert not touch
proof=dict(reviewer='/root/jin053_full_owner_peer',verifiedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),currentRef=ref,startHere=pin(P/'START-HERE-review-index.json'),authoritativeSeal=pin(P/'v2/matrix-seal.json'),compactMatrix=pin(P/'v2/compact-matrix.json'),originalProvenance=pin(P/'original-provenance-inventory.json'),assignedPartPins=[pin(P/x['file']) for x in d['parts']],unchangedFullPrimaryPartPins=[pin(R/x['file']) for x in d['fullUnchangedPrimaryPacketsAvailable']],originalAuthor=authorpin,originalPeer=peerpin,originalHandoff=pin(job/'host-handoff.json'),originalBlind=pin(blind),authorship=handoff,currentRawPins=rawproof,fullCurrentGroups=scope['fullCurrentGroups'],cases=cases,currentWholeTouchingDecisions=touch,profileCounts=dict(profiles=51,claims=sum(len(x['after']['claims']) for x in profiles),mentions=sum(len(x['after']['mentions']) for x in profiles)),wholePrimaryUnitsVerifiedAgainstCurrentGit=len(up),completeBeforeAfterProfiles=profiles)
p=O/'independent-source-input-delta-proof.json';p.write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n');print('PROOF',pin(p))
