import json,hashlib
from pathlib import Path
p=Path(__file__).resolve().parent.parent;a=p/'author'
read=lambda f:json.loads(f.read_text());sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
r=read(p.parent/'selected-registry.json');h=read(p/'host-context.json');seal=read(p/'sealed-manifest.json');hand=read(p/'host-handoff.json')
assert sha(p/'sealed-manifest.json')=='48b3590a9b0386c74141933371c6ce36f1069424082fcbc068458b5935698bac'
assert sha(p.parent/'selected-registry.json')==h['registry']['sha256']
packets=[read(p/b['packet']) for b in hand['batches']]
for b,d in zip(hand['batches'],packets):
 assert sha(p/b['packet'])==b['sha256']
 assert len(d['scope']['reviewPairs'])<=24
 for x in d['people']:
  q=dict(r['people'][x['localId']]);q['sourcePins']=r['chapterPins'][q.pop('chapterPinRef')];q['sourceUnits']=[r['units'][id] for id in q.pop('sourceUnitRefs')]
  y=dict(x);assert y.pop('mentionCount')==len(q['mentions']);y['mentions']=q['mentions'];assert q==y,x['localId']
 expected=[{'localId':id,'canonicalPersonId':c['canonicalPersonId']} for c in r['completeEndpointClusters'] if c['canonicalPersonId'] in {v for pair in d['scope']['reviewPairs'] for v in pair} for id in c['localPeople']]
 assert sorted(expected,key=lambda x:x['localId'])==d['scope']['completeEndpointMembers']
owned=set(h['ownedPeople']);prior=[]
for doc in r['priorConstraintDocuments']:
 decisions=[d for d in doc['document']['decisions'] if owned.intersection(d['localPeople'])]
 if decisions:prior.append({'path':doc['path'],'document':{**doc['document'],'decisions':decisions}})
assert prior==h['priorConstraintDocuments']
reasons={}
# The Chinese evidence identifies the Chengdu prince throughout; sparse reference is the same quoted historical exemplum as existing root.
for x in packets[0]['people']:
 us=x['sourceUnits'];pick=next((u for u in us if '成都王' in u['zh']),us[-1]);reasons[x['localId']]=f"{x['localId']} {pick['id']}: {pick['zh']}"
mergeYu={'jinshu:053:p001','jinshu:004:p006','jinshu:004:p074','jinshu:028:p389','jinshu:037:p198','jinshu:037:p284','jinshu:067:p131','zizhitongjian:083:p028','zizhitongjian:083:p097','zizhitongjian:214:p148'}
held='jinshu:028:p153'
judgments=[];docs=[]
for n,(b,d) in enumerate(zip(hand['batches'],packets),1):
 groups={}
 for x in d['people']:groups.setdefault(x['currentCanonicalPersonId'],[]).append(x['localId'])
 root=d['scope']['starRootCanonicalPersonId'];rootids=groups[root];decisions=[]
 if n==1:
  decisions=[{'decision':'merge','localPeople':sorted(x['localId'] for x in d['people']),'basis':['The owned Chinese sources identify the Jin prince 成都王穎: his Jia Mi dispute, campaigns against 長沙王乂, Ye base, imperial-younger-brother succession, flight and death form one continuous royal career. The 晉室穎、顒 reference is the identical historical exemplum in Chenshu and Nanshi, not a contemporary Chen namesake.']+[reasons[x['localId']] for x in d['people']],'confidence':'high'}]
 elif n==2:
  decisions=[{'decision':'merge','localPeople':sorted(mergeYu),'basis':['Jinshu053 s0002 identifies 湣懷太子遹, courtesy 熙祖, eldest son of 惠帝; s0072 gives childhood 沙門; s0201 his crown-prince accession. The matching records explicitly name 遹 or 湣懷/愍懷太子 and repeat his deposition, Xuchang murder and restoration. This is one prince, not Eastern Jin 昱.']+[f"{x['localId']} "+'; '.join(u['id']+': '+u['zh'] for u in x['sourceUnits'] if '遹' in u['zh'] or '懷' in u['zh']) for x in d['people'] if x['localId'] in mergeYu and x['localId']!='jinshu:053:p001'],'confidence':'high'}]
  for x in d['people']:
   id=x['localId']
   if id in mergeYu or id==held:continue
   label=x['record']['preferredNameSuggestion']['zh'];specific='Different Chinese identity and family/episode: '+ '; '.join(u['id']+': '+u['zh'] for u in x['sourceUnits'])
   if '昱' in label:specific='Eastern Jin 昱/會稽王/簡文帝 is distinct from 惠帝 son 遹, the murdered Crown Prince Minhuai. '+specific
   for rid in rootids:decisions.append({'decision':'keep-separate','localPeople':[rid,id],'basis':[specific],'confidence':'high'})
 else:
  target=next(x for x in d['people'] if x['localId']=='sanguozhi:040:p027')
  decisions=[{'decision':'merge','localPeople':sorted(rootids+[target['localId']]),'basis':['Jinshu053 s0135 pairs 申生、孝己 as past wronged sons, Sanguozhi040 s0038 pairs 孝己、伯奇 among filial sons suffering undeserved harm, and Shiji056 s0063 cites 孝己之行. The exact Chinese name and filial-exemplum context identify the same traditional figure; these are retrospective references, not contemporary officials.'],'confidence':'high'}]
  for x in d['people']:
   id=x['localId']
   if id in rootids or id==target['localId']:continue
   specific='The retrospective filial exemplar 孝己 is distinct from this historical '+x['record']['preferredNameSuggestion']['zh']+' record: '+'; '.join(u['id']+': '+u['zh'] for u in x['sourceUnits'] if ('紀' in u['zh'] or '蕭' in u['zh'] or '武陵' in u['zh']))
   for rid in rootids:decisions.append({'decision':'keep-separate','localPeople':[rid,id],'basis':[specific],'confidence':'high'})
 doc={'schemaVersion':1,'batch':b['batch'],'authority':'model','decisions':decisions};file=f'part-{n:03}.resolution.json';(a/file).write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n');docs.append(file)
 for left,right in d['scope']['reviewPairs']:
  ids=groups[left]+groups[right]; outcome='merge' if n==1 or (n==2 and set(ids)<=mergeYu) or (n==3 and target['localId'] in ids) else 'keep-separate'
  if held in ids:outcome='held-source-defect'
  judgments.append({'packet':b['packet'],'canonicalPair':[left,right],'completeEndpointMembers':ids,'outcome':outcome})
coverage={'sourceRecords':[{ 'localId':id,'claims':len(r['people'][id]['claims']),'sourceUnits':len(r['people'][id]['sourceUnitRefs']),'mentions':len(r['people'][id]['mentions']),'recordSha256':hashlib.sha256(json.dumps(r['people'][id],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()} for id in sorted(owned)],'reviewedPairs':judgments,'holds':[{'localId':held,'reason':'Mixed source membership: m0509 assigns 太子 in s0373 (海西公太和 nursery rhyme, block79) to the Shamen/Minhuai record of s0316/s0318 (元康 Jia empress block66). Its membership must be repaired before identity resolution.','evidenceFile':'source-supplement.json'}],'ancillaryDefects':[{'localId':'beishi:070:p240','reason':'Name/role/sex evidence refs include unrelated s0547/s0554/s0560/s0565. Full blocks48-50 and complete mentions show every actual owned mention is Liang 武陵王紀 in block50; no second person is mixed into mentions. Separation from 孝己 is independently certain.'},{'localId':'suishu:023:p093','reason':'Attestation c0796 cites s0318 where 紀極 is a common phrase in Chen Houzhu context. All actual mentions s0335/s0340 identify Liang 武陵王紀 in block59; this is an ancillary bad ref, not a second identity. Separation from 孝己 is independently certain.'},{'localId':'zizhitongjian:083:p097','reason':'Name claim c0193 cites s0290 about 荀嵩 ancestry, not 遹. Actual owned mentions and s0285/s0293/s0298/s0299 identify Minhuai consistently. No second Yu entity.'},{'localId':'jinshu:037:p248','reason':'Office claim c2170 misreads 成都王穎故帳下督公師籓 as an office of Ying; Chinese assigns the post to Gongshi Fan. Ying identity remains explicit.'}], 'nativeUsage':'Native token/cost usage unavailable; not reported as zero.'}
(a/'source-coverage.json').write_text(json.dumps(coverage,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'documents':docs,'outcomes':{k:sum(x['outcome']==k for x in judgments) for k in set(x['outcome'] for x in judgments)},'sourceRecords':len(owned)},indent=2))
