import json,hashlib,pathlib,subprocess,datetime,collections
base=pathlib.Path(__file__).resolve().parents[1]; out=base/'independent-review'; root=base.parent
read=lambda p:json.loads(p.read_text()); sha=lambda b:hashlib.sha256(b).hexdigest(); canon=lambda x:json.dumps(x,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
h=read(base/'host-handoff.json');m=read(base/'sealed-manifest.json');r=read(root/'selected-registry.json');hc=read(base/'host-context.json');jp=read(base/'join-proof.json')
assert sha((base/'sealed-manifest.json').read_bytes())=='baae93fc8ba8a06f095137b531fe5c09a6ea4dfd920908b2627b22bd4af52432'
assert sha((root/'HOST_REVIEW_PROTOCOL.md').read_bytes())=='7de78092e3da0da3cef2c1ca18ed2ca234fda210d4cdbd7fbaf2e9b2b6dfa91b'
assert sha((root/'selected-registry.json').read_bytes())==h['registrySha256']
for x in m['files']:assert sha((base/x['file']).read_bytes())==x['sha256'] and (base/x['file']).stat().st_size==x['bytes']
def mat(id):
 x=dict(r['people'][id]);x['sourcePins']=r['chapterPins'][x.pop('chapterPinRef')];x['sourceUnits']=[r['units'][u] for u in x.pop('sourceUnitRefs')];return x
packets=[read(base/b['packet']) for b in h['batches']];owned={}
for p in packets:
 assert len(p['scope']['reviewPairs'])<=p['ceilings']['maxComparisons']
 for x in p['people']:
  v=dict(x);assert v.pop('mentionCount')==len(r['people'][x['localId']]['mentions']);v['mentions']=r['people'][x['localId']]['mentions'];assert v==mat(x['localId']);assert sha(canon(v))==next(y['unprojectedAndRejoinedSemanticSha256'] for y in jp['ownedRecordJoinHashes'] if y['localId']==x['localId']);owned[x['localId']]=x
assert len(owned)==122
# Verify every source/extraction exact baseline raw pin, caching repeated blobs.
cache={}
for x in owned.values():
 for field,hfield in [('sourcePath','sourceRawSha256'),('extractionPath','extractionRawSha256')]:
  pin=x['sourcePins'];p=pin[field]
  if p not in cache:cache[p]=sha(subprocess.check_output(['git','show',h['canonicalRevision']+':'+p]))
  assert cache[p]==pin[hfield],p
priorids=set()
for doc in hc['priorConstraintDocuments']:
 original=next(z for z in r['priorConstraintDocuments'] if z['path']==doc['path'])
 assert all(v in original['document']['decisions'] for v in doc['document']['decisions'])
 for dec in doc['document']['decisions']:priorids.update(dec['localPeople'])
assert priorids-set(owned)==set(hc['priorOnlyPeople'])
assert set(hc['ownedPeople'])==set(owned)
# Complete canonical memberships from sealed registry, independent of proposal.
for p in packets:
 for cp in set(x['currentCanonicalPersonId'] for x in p['people']):
  actual={id for id,x in r['people'].items() if x['currentCanonicalPersonId']==cp}
  given={x['localId'] for x in p['people'] if x['currentCanonicalPersonId']==cp}
  assert actual==given,(cp,actual,given)
# Exact baseline supplements: compact Chinese only, never English inference.
supp=[]
def supplement(book,ch,ids):
 path=f'data/{book}/{ch}.json';raw=subprocess.check_output(['git','show',h['canonicalRevision']+':'+path]);doc=json.loads(raw);units=[]
 def walk(o):
  if isinstance(o,dict):
   if o.get('id') in ids:units.append({'id':o['id'],'zh':o['zh']})
   for v in o.values():walk(v)
  elif isinstance(o,list):
   for v in o:walk(v)
 walk(doc);supp.append({'sourcePath':path,'rawSha256':sha(raw),'units':units})
supplement('jinshu','043',[f's{i:04}' for i in range(235,360)])
supplement('jinshu','035',[f's{i:04}' for i in range(278,286)])
supplement('nanshi','063',['s0001','s0002','s0355','s0356','s0357'])
supplement('nanshi','046',['s0001','s0002','s0022','s0117'])
supplement('jiuwudaishi','067',[f's{i:04}' for i in range(238,243)])
supplement('beishi','082',[f's{i:04}' for i in range(208,215)])
(out/'source-supplement.json').write_text(json.dumps({'canonicalRevision':h['canonicalRevision'],'supplements':supp},ensure_ascii=False,indent=2)+'\n')
emerges=set('jinshu:020:p188 jinshu:020:p293 jinshu:028:p071 jinshu:028:p151 jinshu:037:p187 jinshu:037:p297 jinshu:037:p326 jinshu:037:p444 jinshu:094:p046 jiutangshu:084:p089'.split())
wmerges=set('jinshu:003:p295 jinshu:003:p320 jinshu:004:p008 jinshu:004:p064 jinshu:004:p222 jinshu:035:p127 jinshu:047:p089 jinshu:047:p121 jinshu:052:p085 jinshu:089:p021 jinshu:037:p288 sanguozhi:010:p225 songshu:059:p123 zizhitongjian:083:p090'.split())
holds={'zizhitongjian:023:p053':'Definite mixed-person ownership: s0111 武帝 is deceased Han Wudi; s0133 陛下 is living Han Zhaodi addressed by Su Wu. Registry m0312/m0315 assign Majesty/陛下 to Wudi. Repair ownership before resolving this entity.','jinshu:035:p164':'Unapproved source-identity hold: s0283 identifies 綏父戎 while s0348 compares Pei Wei with 王戎. Baseline Jinshu043 s0355–0359 gives the Jin minister sons 萬/興 and succession by 愔子, without 綏. Father-of-Wang-Sui and famous minister cannot safely be fused; independently resolve the anomalous father attribution/source reading before ordinary identity disposition.'}
judgments=[]
for b,p in zip(h['batches'],packets):
 rootid=p['scope']['starRootCanonicalPersonId'];members=collections.defaultdict(list)
 for x in p['people']:members[x['currentCanonicalPersonId']].append(x['localId'])
 for pair in p['scope']['reviewPairs']:
  peer=next(i for i in pair if i!=rootid);ids=members[peer];assert len(ids)==1;id=ids[0];x=owned[id]
  outcome='source-defect-hold' if id in holds else 'merge' if id in emerges|wmerges else 'keep-separate'
  if id in holds:reason=holds[id]
  elif id in emerges:reason='Western Jin Sima Yan: the cited accession/imperial edict, Taishi/Taikang, 炎 taboo with Empress Yang, or explicit 晉武 context identifies the same emperor who favored Sima Yu in Jinshu053; later narrative dates are retrospective references, not a later Wudi.'
  elif id in wmerges:reason='Same Jin 王戎: source-specific court office/episode bridges the prince tutor to the minister. Baseline Jinshu043 biography supplies 建威伐吳/武昌, 安豐侯, 太子太傅, 吏部僕射/司徒, 傅咸 impeachment, Pei/嵇 bamboo-grove circle, and 張裴 kin dismissal; paired Chinese name and these concrete bridges support identity.'
  elif b['packet']=='part-001.json':reason='Reused Wu emperor epithet: Chinese dynasty/episode belongs to Han (漢武, Huo Guang, Su Wu or earlier Han accounts), Northern Zhou (平齊, 建德 or Yuwen Hu context), Liu Song (孫恩/盧循), Southern Qi, Liang (侯景/Yang Kan), or the later Taiyuan Wu ruler; these cannot be Sima Yan of Western Jin. '+x['record'].get('descriptorSuggestion','')
  else:reason='Distinct from Western Jin prince tutor 王戎. Chinese personal name '+str(x['record']['preferredNameSuggestion'].get('zh'))+' and source office/family/episode identify a different individual (Southern Qi writer 王融, later Zhen/Zhao 王鎔/镕/熔, or another named official); preserve homonyms rather than merging Romanization.'
  judgments.append({'packet':b['packet'],'batch':b['batch'],'canonicalPair':pair,'rootMembers':members[rootid],'peerMembers':ids,'outcome':outcome,'sourceReasons':[reason],'citedChineseUnits':[{'id':u['id'],'zh':u['zh']} for u in x['sourceUnits']],'claimIds':[a['id'] for a in x['claims']]})
assert len(judgments)==120
receipt={'schemaVersion':1,'reviewer':'/root/jin053_rest_c003_peer','stage':'blind source judgment; author files not read','createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'canonicalRevision':h['canonicalRevision'],'sealedManifestSha256':h['sealedManifestSha256'],'registrySha256':h['registrySha256'],'protocolSha256':sha((root/'HOST_REVIEW_PROTOCOL.md').read_bytes()),'packetPins':h['batches'],'coverage':{'canonicalPairs':120,'ownedRecords':len(owned),'priorOnlyRecords':len(priorids-set(owned)),'ownedClaims':sum(len(x['claims']) for x in owned.values()),'ownedSourceUnitsIncludingRepeatedText':sum(len(x['sourceUnits']) for x in owned.values()),'everyOwnedClaimAndChineseUnitRead':True,'completeEndpointMembershipVerified':True,'fullPriorMembershipsRetained':True,'rawExactBaselineSourceAndExtractionPinsVerified':len(cache),'losslessJoinVerified':True},'priorMemberships':[{'path':d['path'],'decisions':[{'decision':v['decision'],'localPeople':v['localPeople']} for v in d['document']['decisions']]} for d in hc['priorConstraintDocuments']],'sourceSupplement':{'file':'source-supplement.json','sha256':sha((out/'source-supplement.json').read_bytes())},'outcomes':dict(collections.Counter(x['outcome'] for x in judgments)),'judgments':judgments,'sourceDefectHolds':[{'localId':k,'reason':v,'approved':False} for k,v in holds.items()],'globalCI':False,'publicationApproval':False,'usage':'Native token/cost usage unavailable'}
(out/'blind-source-judgment.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print(receipt['outcomes']);print('bytes',(out/'blind-source-judgment.json').stat().st_size,'sha256',sha((out/'blind-source-judgment.json').read_bytes()))
