import json,hashlib
from pathlib import Path
out=Path(__file__).resolve().parent;base=out.parent
read=lambda p:json.loads(p.read_text())
write=lambda p,v:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
handoff=read(base/'host-handoff.json')
assert sha(base/'sealed-cohort-manifest.json')==handoff['sealedManifestSha256']
packets=[];docs=[]
for a in handoff['batches']:
 assert sha(base/a['packet'])==a['sha256']
 packets.append(read(base/a['packet']))
def dec(kind,ids,*basis,confidence='high'):
 return dict(decision=kind,localPeople=ids,basis=list(basis),confidence=confidence)
def pair(n,other,kind,*basis,confidence='high'):
 p=packets[n-1];return dec(kind,p['scope']['targetLocalPeople']+[other],*basis,confidence=confidence)
D=[]
D.append([dec('merge',['jinshu:053:p036','jinshu:031:p202','zizhitongjian:083:p025','zizhitongjian:083:p084'],
 'Jinshu053:s0035 and Tongjian083:s0129 identify 壽妻賈午 in the same rejected Han marriage and Wang bride episode; this is an event-and-spouse match, not only a name match.',
 'Jinshu031:s0530 calls her 后妹午; s0579/s0581 link 午 and 趙粲 in the plot against the heir. Tongjian083:s0132/s0135 repeat the same named pair and plot.',
 'Jinshu031:s0599 lists 趙粲、賈午 among those punished, and Tongjian083:s0260 records 趙粲、賈午 sent to 暴室 at the empress’s fall. The final Tongjian endpoint is the same named associate in this matching fall-of-empress episode.')])
D.append([
 pair(2,'houhanshu:084:p092','keep-separate','Houhanshu084:s0251/s0254 identify 蒋均 at 耒陽 in a property dispute with his brothers; Jinshu053:s0017/s0065 identify the crown prince’s childbearing consort 蔣美人/太子保林蔣俊. The specific Chinese names, narrative identities and family situations differ.'),
 pair(2,'jinshu:004:p024','keep-separate','Jinshu004:s0024 executes 中書令蔣俊 with Yang Jun’s group; Jinshu053:s0017/s0065 instead concern the prince’s childbearing consort, 太子保林蔣俊, killed in his deposition. Matching 蔣俊 does not erase the distinct office, gendered family role and purge episode.'),
 pair(2,'zizhitongjian:083:p051','merge','Jinshu053:s0065 has 考竟謝淑妃及太子保林蔣俊 when the prince’s household is removed. Tongjian083:s0196 has 殺太子母謝淑媛及虨母保林蔣俊. Both name 保林蔣俊 beside the prince’s mother Xie in the same household purge; Jinshu053:s0017 supplies the childbearing consort context.')])
D.append([dec('merge',[x['localId'] for x in packets[2]['people']],
 'Jinshu053:s0058/s0060 and Tongjian083:s0185/s0191 match 黃門令董猛 presenting the prince’s letter and falsifying 長廣公主’s words on Jia’s orders.',
 'Jinshu031:s0582/s0583 explicitly identify 宦人董猛, trusted by the empress and serving the Eastern Palace; s0599 records his execution. Tongjian083:s0274 places 董猛 among those executed at that same collapse.',
 'Jinshu024:s0164 names 宦者董猛 appointed 中常侍 by 惠帝 in 元康中. The specific full Chinese name, eunuch status, same emperor/period and compatible palace service connect this record to the Dong Meng serving Hui and Jia; no incompatible person or chronology is evidenced.',confidence='high')])
D.append([
 dec('merge',['jinshu:053:p034','jinshu:031:p221','zizhitongjian:083:p024','zizhitongjian:083:p034'],
 'Jinshu053:s0034/s0035 and Tongjian083:s0128/s0129 match the proposed 韓壽 daughter marriage, rejected by 壽妻賈午 and the empress.',
 'Jinshu031:s0571 and Tongjian083:s0159 identify the empress’s 妹夫韓壽 and his son 慰祖 taken to replace the heir. This supplies a distinctive spouse/family bridge to Jia Wu’s husband, not merely the name 韓壽.'),
 pair(4,'zizhitongjian:097:p031','keep-separate','Jinshu053:s0034/s0035 identify Jia Wu’s husband in the Western Jin heir’s marriage affair; Jinshu031:s0599 includes this 韓壽 in the purge list. Tongjian097:s0074g/s0085–s0085c concern 左長史韓壽 campaigning with 皝 against Koguryŏ in the later Former Yan setting. These are distinct careers/periods; preserve the complete prior separation from jinshu:109:p051 (Former Yan marshal in s0057).')])
D.append([
 dec('merge',['jinshu:053:p060','jinshu:031:p220','zizhitongjian:083:p012','zizhitongjian:083:p077'],
 'Jinshu053:s0119 and Tongjian083:s0236 name 太醫令程據 preparing the poison on Jia’s orders; Jinshu053:s0131 and Tongjian083:s0274 match his later execution alongside 劉振 and 孫慮.',
 'Jinshu031:s0560 and Tongjian083:s0068 both identify 太醫令程據 in Jia’s intimate court circle. The exact medical office, full Chinese name and same empress’s affairs connect these earlier mentions to the poison preparer.'),
 pair(5,'jinshu:003:p280','possible-same-as','Jinshu003:s0415 names 太醫司馬程據 presenting the pheasant-fur robe; Jinshu053:s0119 names 太醫令程據 preparing poison for Jia. The full Chinese name and imperial medical institution are compatible, and the earlier attestation does not itself contradict a later career. The sealed units provide no explicit career, kinship or repeated-event bridge between the offices, so identity remains uncertain.',confidence='medium')])
D.append([])
for other in ['jinshu:115:p029','jinshu:115:p051','jinshu:115:p143','jinshu:115:p170']:
 x=next(x for x in packets[5]['people'] if x['localId']==other)
 refs=', '.join('jinshu115:'+s['id'] for s in x['sourceUnits'])
 D[-1].append(pair(6,other,'keep-separate',f'Jinshu053:s0205 explicitly has 太子太傅楊濟息毖, the son Bi assigned to the prince. {refs} explicitly write 楊璧/璧 in the later Qin political-military network (丕/登, 竇沖 or 楊定), not 毖 son of 楊濟. Distinct Chinese personal names and political setting warrant separation; English Yang Bi is not identity evidence.'))
D[-1].append(pair(6,'houhanshu:088:p121','keep-separate','Jinshu053:s0205 has 楊濟息毖, the prince’s companion; Houhanshu088:s0260 has 博士羊弼, teacher of 休 in the textual controversy. Both surname and given-name characters and the family/scholarly identities differ; a shared English Yang Bi cannot equate them.'))
D.append([pair(7,'jinshu:037:p199','merge','Jinshu053:s0205 identifies 尚書令華暠息恆 assigned with 司空泰息略 to the prince. Jinshu037:s0368 places 略與華恆 in precisely the 元康初 湣懷太子 Eastern Palace companion selection. Same full name reconstructed from father, same companion 略, prince and selection event establish identity.')])
for other in ['jinshu:006:p244','jinshu:031:p115','zizhitongjian:094:p066','zizhitongjian:094:p185']:
 x=next(x for x in packets[6]['people'] if x['localId']==other)
 refs=', '.join(':'.join(other.split(':')[:2])+':'+s['id'] for s in x['sourceUnits'])
 D[-1].append(pair(7,other,'possible-same-as',f'Jinshu053:s0205 identifies 華暠息恆 as the crown prince’s companion. {refs} name 華恒/華恆 in later Eastern Jin senior office. 恒/恆 is compatible orthography and the later career is possible, but these sealed units do not state the father, earlier companionship or an explicit career bridge to the 053 record. Keep the endpoints unmerged pending evidence; do not promote compatible name and timing into certain identity.',confidence='medium'))
coverage=[]
for i,(p,ds,a) in enumerate(zip(packets,D,handoff['batches']),1):
 doc=dict(schemaVersion=1,batch=a['batch'],authority='model',decisions=ds);docs.append(doc)
 write(out/f'next-{i:02}.resolution.json',doc)
 for cp in p['scope']['reviewPairs']:
  groups={g:[e['id'] for e in p['scope']['completeEndpointMembers'] if e['canonicalPersonId']==g] for g in cp}
  matches=[(j,d) for j,d in enumerate(ds) if all(set(members)<=set(d['localPeople']) for members in groups.values())]
  assert len(matches)==1,(i,cp,matches)
  j,d=matches[0];coverage.append(dict(packet=a['packet'],canonicalPair=cp,completeEndpointMembers=groups,decisionIndex=j,outcome=d['decision'],basis=d['basis']))
write(out/'source-judgments-coverage.json',dict(canonicalRevision=handoff['canonicalRevision'],sealedManifestSha256=handoff['sealedManifestSha256'],method='Independent reading of every sealed person record, full claims and Chinese cited units, plus every complete prior constraint; no external source or reviewer artifacts consulted.',pairCount=len(coverage),pairs=coverage,sourceRepairHolds=[],qualification='Author judgments only; independent source review and host full-corpus CI remain required.'))
print(json.dumps({'documents':len(docs),'pairs':len(coverage),'outcomes':{k:sum(x['outcome']==k for x in coverage) for k in ['merge','keep-separate','possible-same-as']}},indent=2))
