import json,hashlib,subprocess,datetime
from pathlib import Path
p=Path(__file__).resolve().parent.parent;m=json.loads((p/'sealed-manifest.json').read_text());r=json.loads((p/'../selected-registry.json').read_text());h=json.loads((p/'host-context.json').read_text());rev=m['canonicalRevision'];sha=lambda b:hashlib.sha256(b).hexdigest(); canon=lambda x:json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
assert sha((p/'sealed-manifest.json').read_bytes())=='c4b8d405989186ce07008ce61108217dc6cd3fc2c4c9d67f1ed7f67ed08fcc39'
assert sha((p/'../selected-registry.json').read_bytes())==m['registry']['sha256']
for f in m['files']:assert sha((p/f['file']).read_bytes())==f['sha256']
owned={};pairs=[];pins={};packetdocs={}
for ix in m['packetIndex']:
 a=json.loads((p/ix['file']).read_text());pairs+=a['scope']['reviewPairs']
 assert sorted(x['localId'] for x in a['people'])==sorted(x['localId'] for x in a['scope']['completeEndpointMembers'])
 for v in a['people']:
  reg=r['people'][v['localId']];restored=dict(v);assert restored.pop('mentionCount')==len(reg['mentions']);restored['mentions']=reg['mentions']
  full={k:x for k,x in reg.items() if k not in ('chapterPinRef','sourceUnitRefs')};full['sourcePins']=r['chapterPins'][reg['chapterPinRef']];full['sourceUnits']=[r['units'][q] for q in reg['sourceUnitRefs']]
  assert restored==full,v['localId']
  if v['localId'] in owned:assert owned[v['localId']]==v
  owned[v['localId']]=v;pins[reg['chapterPinRef']]=full['sourcePins']
 for d in a['priorConstraintDocuments']:
  for dec in d['document']['decisions']:packetdocs.setdefault(d['path'],{})[sha(canon(dec))]=dec
assert set(owned)==set(h['ownedPeople']);assert len(owned)==115;assert len(pairs)==len(set(map(tuple,pairs)))==111
for c in r['completeEndpointClusters']:
 if c['canonicalPersonId'] in {q for pair in pairs for q in pair}:assert sorted(c['localPeople'])==sorted(k for k,v in owned.items() if v['currentCanonicalPersonId']==c['canonicalPersonId'])
docs={d['path']:d for d in h['priorConstraintDocuments']};expected={}
for d in r['priorConstraintDocuments']:
 ds=[dec for dec in d['document']['decisions'] if set(dec['localPeople'])&set(owned)]
 if ds:expected[d['path']]={sha(canon(x)):x for x in ds}
assert packetdocs==expected
assert {k:{sha(canon(x)):x for x in d['document']['decisions']} for k,d in docs.items()}==expected
priorids={q for d in docs.values() for dec in d['document']['decisions'] for q in dec['localPeople']}-set(owned)
assert priorids==set(h['priorOnlyPeople']);assert len(priorids)==96;assert all(q in r['people'] for q in priorids)
for key,pin in pins.items():
 for field,hfield in [('sourcePath','sourceRawSha256'),('extractionPath','extractionRawSha256')]:
  b=subprocess.check_output(['git','show',rev+':'+pin[field]]);assert sha(b)==pin[hfield],(key,field)
root='per_06SNC6C156E33GWCBPYE';merged={root}|{q for pair in pairs if root in pair for q in pair if q!='per_GWQN2D1S605J75WY04M8'}
conflicts=[]
for d in docs.values():
 for i,dec in enumerate(d['document']['decisions']):
  if dec['decision']=='keep-separate':
   involved={r['people'][q]['currentCanonicalPersonId'] for q in dec['localPeople']}
   if len(involved&merged)>1:conflicts.append([d['path'],i,sorted(involved&merged)])
assert not conflicts,conflicts
bridge={
'jinshu:001:p001':(['s0001','s0013','s0020'],'The opening genealogy explicitly equates 宣皇帝 with 懿, surname 司馬 and courtesy 仲達. This is the named Sima Yi in the root cluster, not a title-only match.'),
'jinshu:001:p032':(['s0073a','s0073c','s0095','s0101'],'Continuous biography after Cao Cao: Cao Pi deathbed charge, Wuyang marquis, and the execution of Meng Da under 司馬公 agree with the root Sanguozhi Meng Da campaign.'),
'jinshu:001:p080':(['s0205','s0206','s0229','s0261'],'The Wen homecoming with brother Fu and son Shi, followed by the Liaodong victory under 司馬公, continues the same Sima Yi biography.'),
'jinshu:001:p103':(['s0284','s0286','s0286d','s0335'],'Returning from Liaodong, he receives Cao Rui’s dying charge with Cao Shuang; son Shi and wife Zhang belong to the same continuing Sima Yi biography.'),
'jinshu:001:p128':(['s0348','s0354','s0368','s0393'],'The Grand Tutor called 司馬公 entrusts sons Shi and Zhao and then removes Cao Shuang. The Cao Rui deathbed charge explicitly links to the preceding biography.'),
'jinshu:001:p162':(['s0433','s0434','s0439'],'Explicit 司馬懿 is linked to retrospective 宣王 and 武帝受禪…宣皇帝; this directly bridges the root’s Emperor Xuan reference under Emperor Wu.'),
'jinshu:001:p193':(['s0500','s0521','s0524'],'The apparatus explicitly names 司馬懿 and identifies the same 宣帝 and 舞陽宣文侯; variant posthumous wording does not create a second person.'),
'jinshu:023:p048':(['s0148','s0149','s0150'],'The Jin songs identify 宣帝 by service to Wei, execution of Meng Da, opposition to Zhuge Liang and defeat of Gongsun. These specific campaigns bridge directly to the named Sima Yi cluster.'),
'jinshu:031:p003':(['s0042','s0043','s0060'],'宣帝 refuses 魏武 through feigned paralysis and fathers Jingdi/Wendi; the named opening biography and later sons Shi/Zhao identify the same Sima Yi.')}
zhangroot='per_T0W9XJBKWB936XRXSZ5F';judgments=[]
for pair in pairs:
 other=next(q for q in pair if q not in (root,zhangroot)); rr=[v for v in owned.values() if v['currentCanonicalPersonId']==other];assert len(rr)==1;v=rr[0];lid=v['localId'];zh=v['record']['preferredNameSuggestion'].get('zh','');ev=[]
 if root in pair:
  if lid=='jiutangshu:029:p086':
   outcome='keep-separate';reason='Tang ancestral temple succession 宣、光、景、元、神、堯、文武 and relocation of the 宣皇帝 tablet identify a Tang ancestor. This is distinct from the Cao Wei general/Jin ancestor Sima Yi despite the shared 宣帝 title.';ids=['s0159','s0160','s0163']
  else:outcome='merge';ids,reason=bridge[lid]
 else:
  outcome='keep-separate';ids=[u['id'] for u in v['sourceUnits']]
  if lid in ['jinshu:089:p011','jinshu:089:p273','songshu:059:p016']:
   reason='The source identifies the loyalist who drank the poison intended for the Prince of Langye/Emperor Gong, in the Liu Yu succession narrative. He is distinct from Zhang Hua’s son assigned to accompany the crown prince in jinshu:053:s0205; identical 禕/褘 does not bridge these generations.'
  elif lid in ['jiutangshu:166:p127','jiutangshu:166:p128','mingshi:314:p251']:
   reason='禕/祎 orthography alone does not separate identities, but this source identifies '+('the Tang figure, Yi fu’s son and/or official under Xizong and Zhaozong' if lid.startswith('jiutangshu') else 'the Hongwu-sixth-year overseas envoy who died on the journey')+'. He cannot be the Western Jin son of Zhang Hua in jinshu:053:s0205.'
  else:
   reason='The cited Chinese identifies '+zh+' in its own biographical/event context, a distinct personal name/referent from 張華息禕 in jinshu:053:s0205. Shared English Zhang Yi supplies no identity bridge; all supplied source units and claims retain that distinction.'
 ev=[lid.rsplit(':',1)[0]+':'+q for q in ids]
 judgments.append({'pair':pair,'outcome':outcome,'counterpart':lid,'evidence':ev,'rootEvidence':['jinshu:053:s0013','sanguozhi:033:s0059','sanguozhi:041:s0245'] if root in pair else ['jinshu:053:s0205'],'reason':reason})
assert sum(x['outcome']=='merge' for x in judgments)==9
receipt={'schemaVersion':1,'reviewer':'/root/jin053_rest_c001_peer','stage':'blind-source-judgment-sealed-before-proposals','createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'canonicalRevision':rev,'sealedManifestSha256':sha((p/'sealed-manifest.json').read_bytes()),'registrySha256':m['registry']['sha256'],'packetPins':m['packetIndex'],'coverage':{'pairs':111,'ownedEndpointMembers':115,'priorOnlyMembers':96,'priorDocuments':len(docs),'priorDecisions':sum(len(d['document']['decisions']) for d in docs.values()),'merge':9,'keepSeparate':102,'possibleSameAs':0,'allOwnedNamesClaimsAndChineseReviewed':True,'rootEvidenceDeduplicatedByExactRecordEquality':True},'verification':{'manifestAndRegistryAndPacketHashes':True,'losslessSourceHostRejoinIncludingFullMentions':True,'completeCanonicalEndpointMembership':True,'completeIntersectingPriorDecisionsAndMembership':True,'rawSourceAndExtractionGitPins':len(pins),'transitiveMergePriorConstraintConflicts':conflicts},'ownedRecordPins':[{'localId':k,'canonicalPersonId':v['currentCanonicalPersonId'],'fullRecordSha256':sha(canon(r['people'][k])),'sourceUnitsSha256':sha(canon(v['sourceUnits'])),'claimsSha256':sha(canon(v['claims']))} for k,v in sorted(owned.items())],'priorConstraintPins':[{'path':k,'decisionsSha256':sha(canon(d['document']['decisions'])),'completeMemberIds':sorted({q for dec in d['document']['decisions'] for q in dec['localPeople']})} for k,d in sorted(docs.items())],'caveats':['Closed prior-only source decisions remain binding; they are not re-reviewed or overturned.','Retrospective mentions do not supply life dates. Some extraction polity/date hints are narrative metadata rather than literal personal chronology, e.g. Ming quotations of Warring States Zhang Yi.','This receipt covers the assigned cohort only; host aggregate graph validation and global CI remain required.'],'judgments':judgments}
out=p/'independent-review/blind-source-judgment.json';assert not out.exists();out.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'file':str(out),'bytes':out.stat().st_size,'sha256':sha(out.read_bytes()),'coverage':receipt['coverage'],'verification':receipt['verification']}))
