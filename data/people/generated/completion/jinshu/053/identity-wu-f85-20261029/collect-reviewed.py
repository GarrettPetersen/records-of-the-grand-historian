import json,hashlib,pathlib,collections,subprocess
J=pathlib.Path(__file__).parent; OLD=J.parent/'identity-current-7f52-20261028';REF='f85be2a1787ba76647e77817b341529eef720569'
def read(n):return json.loads((J/n).read_text())
def sha(b):return hashlib.sha256(b).hexdigest()
def save(n,x):(J/n).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
groups=json.loads((OLD/'final-global/selected-complete-endpoint-clusters.json').read_text());byroot={g['canonicalPersonId']:g for g in groups['endpointClusters']};root=groups['localToCanonical']; manifest=read('wu-packets.json'); decisions=[];accepted=[];problems=[];supplement=[];normalizations=[]
def norm(d):
 d=json.loads(json.dumps(d));assert set(d)<={'decision','localPeople','basis','confidence','notes'},'Unknown resolution fields'
 if isinstance(d.get('notes'),str):d['notes']=[d['notes']]
 d['localPeople']=sorted(d['localPeople']);return d
for part,p in enumerate(manifest['packets'],1):
 n=f'{part:02}';source=read(p['file']);ar=read('author-'+n+'.json');rr=read('review-'+n+'.json');ast=read('author-state-'+n+'.json');rst=read('review-state-'+n+'.json');assert ast['agentId']!=rst['agentId'];assert sha((J/('author-'+n+'.raw.json')).read_bytes())==ast['reportSha256'];assert sha((J/('review-'+n+'.raw.json')).read_bytes())==rst['reportSha256'];assert sha((J/('review-packet-'+n+'.json')).read_bytes())==rr['packetSha256'];assert rr['part']==part and rr['revision']==REF
 assignments={a['id']:a for a in source['assignment']};authors={a['id']:a for a in ar['assessments']};assert len(rr['reviews'])==len(assignments) and {r['id'] for r in rr['reviews']}==set(assignments)
 units={}
 for profile in source['people'].values():
  s=profile['source']
  for u in s['units']:units[(s['book'],s['chapter'],u['id'])]=u['zh']
 r=source['referencePrimary']
 for u in r['units']:units[(r['book'],r['chapter'],u['id'])]=u['zh']
 for review in rr['reviews']:
  a=assignments[review['id']];prior=authors[review['id']]
  if review['verdict'] not in ['approve','revise'] or not review.get('decision'):
   problems.append({'id':review['id'],'kind':'source-hold','report':review});continue
  d=norm(review['decision'])
  if review['verdict']=='approve':assert prior['decision'] and d==norm(prior['decision']),('Approval changed authored decision',review['id'])
  else:
   old=norm(prior['decision']) if prior.get('decision') else None;added=sorted(set(d['localPeople'])-set(old['localPeople'] if old else []));removed=sorted(set(old['localPeople'] if old else [])-set(d['localPeople']));assert d['decision']=='merge' and not removed and ((old is not None and set(added)<={'jinshu:003:p189'}) or (old is None and review['id']=='wu-093' and any(q['id']!=review['id'] and q.get('decision') and authors[q['id']].get('decision') and q['decision']['decision']=='merge' and sorted(q['decision']['localPeople'])==d['localPeople'] for q in rr['reviews']))),('Unreviewed substantive revision',review['id']);normalizations.append({'id':review['id'],'reviewerRevisionIndependentlyHostCheckedAgainstAnnalsOpening':True,'added':added,'removed':removed})
  witnesses=review.get('sourceWitnesses',[]);bad=[]
  for w in witnesses:
   key=(w.get('book'),w.get('chapter'),w.get('unitId'));text=units.get(key);quote=w.get('quote')
   if not text or not quote or quote not in text:bad.append({'witness':w,'actualUnit':text})
  if bad or not witnesses:problems.append({'id':review['id'],'kind':'citation-check','issues':bad,'decision':d});continue
  namedRoots={root[i] for i in d['localPeople']};
  if d['decision']!='merge':
   assert namedRoots==set(a['canonicalPair']),'Nonmerge is not exactly its assigned canonical pair'
   priorMembers=d['localPeople'];d['localPeople']=sorted(a['representatives']);assert {root[i] for i in d['localPeople']}==namedRoots
   normalizations.append({'id':review['id'],'kind':'canonical-pair-representative-projection','rawLocalPeople':priorMembers,'encodedRepresentatives':d['localPeople'],'identicalTwoCanonicalGroups':sorted(namedRoots),'noPriorCanonicalMembershipChanged':True})
  assignedRoots={x for entry in source['assignment'] for x in entry['canonicalPair']};assert namedRoots<=assignedRoots and any(x in groups['targetCanonicalPeople'] for x in namedRoots),('Out of scope roots',review['id']);decisions.append(d);accepted.append({'id':review['id'],'part':part,'verdict':review['verdict'],'authorAgentId':ast['agentId'],'authorRunId':ast['runId'],'reviewerAgentId':rst['agentId'],'reviewerRunId':rst['runId'],'sourceWitnesses':witnesses,'decision':d})
 supplement.append({'part':part,'authorRepairs':ar['additionalRepairs'],'authorClaims':ar['additionalClaimCorrections'],'reviewedEnglish':rr['englishReviews'],'reviewedClaims':rr['claimReviews'],'reviewerAdditionalRepairs':rr['additionalRepairs'],'reviewerAdditionalClaims':rr['additionalClaimCorrections']})
save('source-citation-problems.json',problems)
# Compile the transitive closure of source-reviewed merge rows, preserving all existing canonical groups.
parent={}
def find(x):
 parent.setdefault(x,x)
 if parent[x]!=x:parent[x]=find(parent[x])
 return parent[x]
def union(a,b):
 a,b=find(a),find(b)
 if a!=b:parent[b]=a
merges=[d for d in decisions if d['decision']=='merge'];other=[d for d in decisions if d['decision']!='merge']
for d in merges:
 rs=[root[i] for i in d['localPeople']]
 for r in rs[1:]:union(rs[0],r)
components=collections.defaultdict(set)
for r in parent:components[find(r)].add(r)
compiled=[]
for rs in components.values():
 rows=[d for d in merges if root[d['localPeople'][0]] in rs];members=sorted({i for r in rs for i in byroot[r]['localPeople']});basis=list(dict.fromkeys(b for d in rows for b in d['basis']));notes=list(dict.fromkeys(n for d in rows for n in d['notes']));confidence=min((d['confidence'] for d in rows),key={'low':0,'medium':1,'high':2}.get);compiled.append({'decision':'merge','localPeople':members,'basis':basis,'confidence':confidence,'notes':notes})
seen=set()
for d in other:
 rs={root[i] for i in d['localPeople']};assert len(rs)==2,'Nonmerge must cover assigned canonical pair';key=(d['decision'],tuple(sorted(rs)))
 if key not in seen:compiled.append(d);seen.add(key)
bridge=json.loads((OLD/'jia-bridge-review.json').read_text());bp=json.loads((OLD/'next-jia-empress-transitive-packet.json').read_text());assert bridge['identityReview']['verdict']=='approve' and bridge['identityReview']['decision']==bp['proposal']
for file,digest in bp['sourcePins'].items():assert sha(subprocess.check_output(['git','show',REF+':'+file]))==digest,'Jia input drift'
compiled.append(norm(bridge['identityReview']['decision']));document={'schemaVersion':1,'batch':'jinshu053-wu-source-reviewed-20261029','authority':'model','decisions':compiled};save('reviewed-resolution.json',document);save('source-review-acceptance.json',{'schemaVersion':1,'revision':REF,'documentSha256':sha((J/'reviewed-resolution.json').read_bytes()),'acceptedAssignmentReviews':accepted,'citationHolds':problems,'reviewerRevisions':normalizations,'transitiveCompilation':{'approvedMergeRows':len(merges),'wholeNewClusters':[{'canonicalGroups':len(rs),'localMembers':sum(len(byroot[r]['localPeople']) for r in rs)} for rs in components.values()],'noPriorMembersPruned':True,'sourceAndExtractionUnchanged':True,'notesScalarToArrayOnly':True},'supplementalEditorialWork':supplement,'jiaBridgeReview':bridge['identityReview'],'jiaBridgeState':json.loads((OLD/'jia-bridge-state.json').read_text()),'canonicalPublication':False});print(json.dumps({'accepted':len(accepted),'citationOrSourceHolds':len(problems),'compiledDecisions':len(compiled),'mergeClusters':[len(d['localPeople']) for d in compiled if d['decision']=='merge']}))
