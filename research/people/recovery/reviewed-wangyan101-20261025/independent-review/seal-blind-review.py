import json,pathlib,hashlib,collections
p=pathlib.Path(__file__).resolve().parent.parent
rd=lambda n:json.loads((p/n).read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
packets=[rd(f'part-00{i}.json') for i in [1,2,3]]
people={a['localId']:a for x in packets for a in x['people']}
merge={
'jinshu:032:p030':('s0063','The explicit 太尉王夷甫 is the root canonical group’s distinctive 夷甫, with a Western Jin family/office setting; courtesy-name source bridge, not English romanization.'),
'jinshu:090:p074':('s0173','太尉王衍 is linked through the independently reviewed 太尉王夷甫 (jinshu:032:s0063) to the root canonical courtesy 夷甫; identical personal name plus distinctive office/courtesy bridge in Western Jin.'),
'zizhitongjian:083:p026':('s0129','The same daughters are assigned to the crown prince and Jia Mi: 太子聘王衍少女 / 后為賈謐聘之 repeats Jinshu053 s0035–36’s marriage configuration.'),
'zizhitongjian:083:p102':('s0286','The 尚書令王衍 punished for abandoning the falsely accused crown prince belongs to the same deposition aftermath as the root’s 妃父王衍表請離婚; same named actor, crown-prince crisis and culpable withdrawal.'),
'zizhitongjian:214:p087':('s0145','王夷甫識石勒 is a retrospective exemplum, matching the root canonical member’s distinctive 夷甫. It is not a Tang contemporary or evidence for a new lifetime.'),
'zizhitongjian:083:p050':('s0195','王衍自表離婚 and 妃慟哭而歸 exactly repeat the root’s 妃父王衍表請離婚, including the unusual divorce memorial.'),
'zizhitongjian:083:p066':('s0218','The explicitly named consort’s father 妃父衍 suppresses the deposed crown prince’s letter; the same father/consort/crown-prince relationship and crisis as Jinshu053 s0035/s0073 identifies him.')}
possible={
'jinshu:004:p247':('s0292','光祿大夫王衍 appointed 尚書左僕射 in AD304 is compatible with the root’s generation and polity, but this owned source supplies no shared daughter, courtesy or direct career bridge to the root. Same personal name and plausible chronology do not alone seal identity.'),
'jinshu:031:p219':('s0559','王衍 joins and abandons a plan with Pei Wei to depose the empress. This fits the root’s court setting but does not identify him as the princess’s father or 夷甫; no contradictory fact either.'),
'jinshu:035:p108':('s0201','The philosopher 王衍 whose influential followers neglect affairs is a compatible conventional identification, but this source does not join that circle to the root’s marriage/deposition or courtesy evidence.'),
'jinshu:035:p113':('s0272','黃門郎王衍 visits Pei Kai and 王衍之徒 oppose Pei Wei. These identify a compatible contemporary but no unique root family/courtesy/office bridge. The explicit different-person constraint against the cousin 衍 is retained.'),
'jinshu:035:p210':('s0348','楷比王衍 in the eight Pei/eight Wang comparison is retrospective and compatible. The comparison itself supplies neither a daughter/courtesy bridge nor a contradictory career.'),
'jinshu:070:p194':('s0442','王衍、潘滔 oppose striking Wang Mi as Dun argues with Yue. Compatible Western Jin setting, but no owned source joins this actor to the root’s particular family or courtesy.'),
'xintangshu:139:p015':('s0027','任王衍為宰相 is a historical allusion, not a Tang contemporary. The owned Chinese gives no explicit 夷甫 or root family/event bridge; extracted AD300–311 is an interpretive conversion, not additional Chinese identity evidence.')}
context={
'beiqishu:042:p050':'A contemporary friendship with Lu Huairen and Li Shouzhi in the Northern Qi biography is a later career, incompatible with the Western Jin father of the consort.',
'weishu:068:p057':'Wang Bing brings his elder brother’s sons 誦、翊、衍 into Northern Wei under Shizong; this later family/career cannot be the root’s Western Jin life.',
'weishu:068:p063':'誦弟衍，字文舒 dies 天平三年 at fifty-two after service under Xiaojing. This is the sixth-century Wenshu, not the root canonical 夷甫.',
'zizhitongjian:154:p160':'Erzhu Zhongyuan captures this Western Yanzhou inspector, expressly the nephew of Xiao. The Northern Wei career and kinship contradict the root’s Western Jin identity.',
'jiuwudaishi:110:p120':'The Chinese explicitly calls him 晉州節度使王晏 in the Later Zhou narrative. That tenth-century governorship contradicts the root; the English-only preferred label supplies no bridge.',
'jiuwudaishi:110:p142':'The Chinese gives 晉州王晏 with 武行德、張彥成、常思、候章 in the Later Zhou court. This tenth-century official cannot be the Western Jin root.'}
for x in packets:
 for a in x['people']:
  lid=a['localId'];name=a['record']['preferredNameSuggestion'].get('zh','')
  if lid.startswith(('xinwudaishi:','jiuwudaishi:')) and (name in ['王衍','衍']):
   context.setdefault(lid,'This is the Former Shu ruler in the Later Tang conquest/succession narrative (王建/郭崇韜/莊宗 context), centuries after the Western Jin root. The reused 王衍/衍 name does not overcome incompatible reign and career.')
judgments=[]
root='per_E5EB4BCMGK9X0W7RB5T4'
for n,x in enumerate(packets,1):
 for pair in x['scope']['reviewPairs']:
  other=next(i for i in pair if i!=root);members=[a for a in x['people'] if a['currentCanonicalPersonId']==other];assert len(members)==1
  a=members[0];lid=a['localId'];units=a['sourceUnits'];name=a['record']['preferredNameSuggestion'].get('zh','');record=a['record'];hints=record.get('identityHints',{})
  if lid in merge:out='merge';uid,why=merge[lid]
  elif lid in possible:out='possible-same-as';uid,why=possible[lid]
  else:
   out='keep-separate';selected=next((u for u in units if name and name in u['zh']),next((u for u in units if '王' in u['zh']),units[0]));uid=selected['id']
   if lid in context:why=context[lid]
   else:
    why=f"The source identifies {name or 'the differently named official'} as {record.get('descriptorSuggestion','a separate person')}. "
    if name not in ['王衍','衍']:
     why+='Its explicit Chinese personal-name/kinship or office context differs from 王衍/夷甫; no source presents it as his alternate name. '
    if hints.get('activeDateHints') or hints.get('polityHints'):
     why+='The attested career context ('+'; '.join(hints.get('activeDateHints',[])+hints.get('polityHints',[]))+') is distinct from the root’s Western Jin consort-family context.'
    else:why+='The cited office/family setting supplies an independent person; the shared English spelling is not an identity bridge.'
  quote=next(u['zh'] for u in units if u['id']==uid)
  judgments.append({'pair':sorted(pair),'localEndpoint':lid,'outcome':out,'anchor':{'unit':':'.join(lid.split(':')[:2])+':'+uid,'zh':quote},'why':why,'packet':f'part-00{n}.json'})
assert len(judgments)==101 and len({tuple(j['pair'])for j in judgments})==101
counts=dict(collections.Counter(j['outcome']for j in judgments))
coverage=[]
for lid,a in sorted(people.items()):
 coverage.append({'localId':lid,'canonicalPersonId':a['currentCanonicalPersonId'],'recordAliasesClaimsChineseReviewed':True,'aliases':len(a['aliasesAndNameKeys']),'claims':len(a['claims']),'sourceUnits':[u['id']for u in a['sourceUnits']],'packetRecordSha256':sha(json.dumps(a,ensure_ascii=False,separators=(',',':')).encode())})
v=rd('independent-review/source-verification.json')
report={'schemaVersion':1,'reviewer':'/root/jin053_wangyan101_source_peer','status':'sealed blind source judgments; exact author proposal review pending','independence':'Author directory and all other proposals unread before sealing. Prior fixed constraints inspected without reopening prior-only source judgments.','canonicalRevision':rd('sealed-manifest.json')['canonicalRevision'],'manifestSha256':'0104eb78cc76e3251388ca95f503e9c29fe8f4a2a46f21e156f0d249016011e3','joinProofSha256':'eafa284ff55e8dbbcd163d2a82b1124a7b92e252384cd9824e86468f28bade19','rootCanonicalPersonId':root,'rootAnchors':[{'unit':'jinshu:053:s0035','zh':'而壽妻賈午及後皆不聽，而為太子聘王衍小女惠風。'},{'unit':'jinshu:053:s0073','zh':'初，太子之廢也，妃父王衍表請離婚。'},{'unit':'weishu:091:s0165','zh':'還京，李楷執其手曰：「卿今得免，足使夷甫慚德。」'}],'counts':counts,'verification':v,'coverage':coverage,'judgments':judgments,'limitations':'This is an independent source disposition receipt, not approval of an unseen author document. Host must validate complete 174-person prior structure, proposal transitivity and full global CI before publication; possible-same-as endpoints remain separate.'}
out=p/'independent-review/blind-source-judgment.json';assert not out.exists();out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
files=['blind-source-judgment.json','source-verification.json','verify-source-inputs.mjs','seal-blind-review.py'];hashes={f:{'sha256':sha((p/'independent-review'/f).read_bytes()),'bytes':(p/'independent-review'/f).stat().st_size}for f in files};(p/'independent-review/blind-seal.json').write_text(json.dumps(hashes,indent=2)+'\n');print(json.dumps({'counts':counts,'files':hashes}))
