import json,pathlib,hashlib,subprocess,collections
p=pathlib.Path(__file__).resolve().parent.parent;o=p/'independent-review'; rev='30e2e9700c2494e6e7abcefeb53b19c24f7197c1'
H=lambda b:hashlib.sha256(b).hexdigest()
canon=lambda x:json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
read=lambda q:json.loads(q.read_text())
m=read(p/'sealed-manifest.json');r=read(p.parent/'selected-registry.json');h=read(p/'host-context.json')
assert H((p/'sealed-manifest.json').read_bytes())=='48b3590a9b0386c74141933371c6ce36f1069424082fcbc068458b5935698bac'
assert H((p.parent/'HOST_REVIEW_PROTOCOL.md').read_bytes())=='7de78092e3da0da3cef2c1ca18ed2ca234fda210d4cdbd7fbaf2e9b2b6dfa91b'
assert H((p.parent/'selected-registry.json').read_bytes())==m['registry']['sha256']
for f in m['files']:
 b=(p/f['file']).read_bytes();assert len(b)==f['bytes'] and H(b)==f['sha256']
clusters={x['canonicalPersonId']:x['localPeople'] for x in r['completeEndpointClusters']};owned={};pairs=[];pins={};packets=[]
for f in m['packetIndex']:
 d=read(p/f['file']);packets.append(d);assert len((p/f['file']).read_bytes())<=d['ceilings']['bytes'];assert len(d['scope']['reviewPairs'])<=d['ceilings']['maxComparisons']
 ids={x['localId'] for x in d['people']};endpoints=set(sum(d['scope']['reviewPairs'],[]));assert ids==set(sum([clusters[e] for e in endpoints],[]))
 assert sorted((x['localId'],x['currentCanonicalPersonId']) for x in d['people'])==sorted((x['localId'],x['canonicalPersonId']) for x in d['scope']['completeEndpointMembers'])
 for x in d['people']:
  z=dict(r['people'][x['localId']]);cp=r['chapterPins'][z.pop('chapterPinRef')];us=[r['units'][u] for u in z.pop('sourceUnitRefs')];z['sourcePins']=cp;z['sourceUnits']=us
  y=dict(x);y.pop('mentionCount');y['mentions']=z['mentions'];assert canon(y)==canon(z)
  owned[x['localId']]=x;pins[cp['sourcePath']]=cp['sourceRawSha256'];pins[cp['extractionPath']]=cp['extractionRawSha256']
 pairs+=d['scope']['reviewPairs']
assert len(pairs)==69 and len({tuple(sorted(x)) for x in pairs})==69 and len(owned)==79
assert set(h['ownedPeople'])==set(owned)
expected=[]
for x in r['priorConstraintDocuments']:
 ds=[d for d in x['document']['decisions'] if set(d['localPeople'])&set(owned)]
 if ds:
  doc=dict(x['document']);doc['decisions']=ds;expected.append({'path':x['path'],'document':doc})
assert canon(expected)==canon(h['priorConstraintDocuments'])
for path,sha in pins.items():assert H(subprocess.check_output(['git','show',rev+':'+path]))==sha
judgments=[]
yumerge={'jinshu:004:p006','jinshu:004:p074','jinshu:028:p389','jinshu:037:p198','jinshu:037:p284','jinshu:067:p131','zizhitongjian:083:p028','zizhitongjian:083:p097','zizhitongjian:214:p148'}
for ix,d in enumerate(packets,1):
 root=d['scope']['starRootCanonicalPersonId']
 for a,b in d['scope']['reviewPairs']:
  other=b if a==root else a;members=clusters[other];rec=owned[members[0]];units=[u for lid in members for u in owned[lid]['sourceUnits']]
  if ix==1:out='merge';reason='The Chinese identifies Chengdu Prince Ying, or retrospectively Jin Ying with Yong. The Chengdu/Ye, Jia Mi/go, Lu Ji/Changsha, or Wang Jun/Dangyin episode matches the root; later-book citations are retrospective.'
  elif ix==2:
   if 'jinshu:028:p153' in members:out='source-hold';reason='Shamen and Jia-empress passages identify Minhuai, but the same record incorrectly attaches s0373 from the complete Haixi Taihe song about his purported sons. No merge/possible-same-as approval until repaired.'
   elif set(members)&yumerge:out='merge';reason='Chinese Guangling heir Yu 遹 / Minhuai is linked by enthronement as heir, Jia-empress deposition, Xuchang death/restoration or exact posthumous title. Matches root Hui-emperor son 遹, not Eastern Jin 昱.'
   else:out='keep-separate';reason='Chinese identifies 昱 (Eastern Jin Kuaiji/Jianwen), 虞 (Teng’s son), 瑜 (Teng’s commander), or 郁 (Yun’s Qin-prince son), distinct from Hui’s son 遹 despite English Sima Yu.'
  else:
   if 'sanguozhi:040:p027' in members:out='merge';reason='Exact 孝己 is invoked as the wronged filial exemplar beside 伯奇; root invokes 孝己 with 申生 as earlier wronged sons and Shiji calls his conduct filial. Same ancient exemplar, no contemporary-life inference.'
   else:out='keep-separate';reason='Chinese identifies historical 蕭紀/武陵王紀, 蕭幾德玄 (遙欣 son), 蕭濟孝康 or Jin Qinzhou 蕭濟, or 樂譜 author 蕭吉. These different names and concrete historical careers are distinct from ancient filial exemplar 孝己.'
  judgments.append({'packet':f'part-{ix:03d}.json','canonicalPair':[a,b],'endpointMemberships':{a:clusters[a],b:clusters[b]},'outcome':out,'confidence':'high','reason':reason,'otherEndpointChineseEvidence':[{'localId':lid,'units':[u['id'] for u in owned[lid]['sourceUnits']]} for lid in members]})
proof={'sealedManifestSha256':H((p/'sealed-manifest.json').read_bytes()),'registrySha256':m['registry']['sha256'],'ownedRecords':len(owned),'ownedClaims':sum(len(x['claims']) for x in owned.values()),'ownedSourceUnitsIncludingRepeated':sum(len(x['sourceUnits']) for x in owned.values()),'baselineRawPinsVerified':len(pins),'priorDocumentsComplete':len(expected),'priorDecisions':sum(len(x['document']['decisions']) for x in expected),'losslessJoinVerified':True,'completeCanonicalMembershipsVerified':True,'allPacketHashesAndCapsVerified':True,'allClaimsAndCitedChineseRead':True,'sourceSupplementSha256':H((o/'source-supplement.json').read_bytes()),'coverage':[{ 'localId':k,'claimsSha256':H(canon(x['claims'])),'aliasesSha256':H(canon(x['aliasesAndNameKeys'])),'citedChineseSha256':H(canon(x['sourceUnits']))} for k,x in sorted(owned.items())]}
report={'schemaVersion':1,'role':'independent-source-reviewer','reviewer':'/root/jin053_rest_c006_peer','canonicalRevision':rev,'status':'blind source judgments sealed before reading author proposals','scope':'source review and bounded input verification; no global CI or publication approval','counts':dict(collections.Counter(j['outcome'] for j in judgments)),'proof':proof,'judgments':judgments,'notes':['All owned claims and cited Chinese read; prior memberships inspected without re-reviewing closed source pairs.','No proposals read. Native model cost/token usage unavailable.','Incidental extraction defects (e.g. malformed office claims or unrelated evidence citations) are not silently corrected. Identity outcomes rely on explicit Chinese entity bridges.']}
path=o/'blind-source-judgment.json';assert not path.exists();path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'file':str(path),'sha256':H(path.read_bytes()),'bytes':path.stat().st_size,'counts':report['counts'],'proof':{k:v for k,v in proof.items() if k!='coverage'}},indent=2))
